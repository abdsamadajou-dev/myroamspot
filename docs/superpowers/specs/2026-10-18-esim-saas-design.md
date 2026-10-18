# Design Doc — French Travel eSIM SaaS (eSIM Access powered)

Date: 2026-10-18 · Status: APPROVED — owner sign-off 2026-10-18 · Brand: MyRoamSpot (myroamspot.com)

## 1. Intent & Why

A French-language travel eSIM reseller, sold under the independent brand **MyRoamSpot** (`myroamspot.com`), operating fully white-label B2B with eSIM Access (full resale rights, standard digital-goods CGV protections). Target customer: French-speaking travelers (France, Belgium, Suisse romande) preparing a trip outside the EU roaming zone — Umrah in Saudi Arabia, Morocco, Turkey, Switzerland, UAE. They find us via high-intent French Google queries days before departure. We sell through a general French travel-eSIM brand hub ("Trojan Horse": brand stays general, acquisition funnels are niche), fulfill automatically via the eSIM Access API, and are structured so German (`/de`) can be added in Phase 2 without touching French URLs.

## 2. Goals / Non-goals / Anti-goals

**Goals**
- Guest checkout end-to-end < 60s, no account required. Email = identity; public order token for a "Mes eSIMs" lookup page.
- Package pages served < 100ms from a local Supabase cache — never live-fetch the eSIM Access catalog on page load.
- Zero double-fulfillment: payment webhooks are idempotent at the DB level.
- 100% French UI, checkout, emails, SEO metadata, EUR-only display.
- Automatic daily catalog sync with drift alerts.

**Non-goals (MVP)**
- User accounts / auth / sessions (Phase 2 — retention/loyalty).
- Multi-language UI runtime beyond dictionary scaffold; `/de` routing ships in Phase 2.
- Programmatic city pages at launch (`/esim-marrakech` etc.) — only if Search Console demand proves out, then hand-written, never auto-templated.
- Admin dashboard — ops happen in Supabase Studio.
- Duration query views beyond a URL filter `?duree=15` on funnel pages.

**Anti-goals (failure conditions)**
- Selling a package that no longer exists at eSIM Access (paid order that can't fulfill).
- Any English string visible in UI or emails; any USD/other currency display.
- Client-side exposure of eSIM Access `AccessCode`/`SecretKey`.
- Fulfillment triggered from anything other than the payment webhook.

## 3. Constraints & Stack (decided)

- Next.js 15 App Router + TypeScript, Tailwind + shadcn/ui + Lucide. Deploy target: Vercel.
- Supabase (Postgres) — cache + orders. Resend for transactional email. Plaintext API all server-side.
- Payments: **Whop** (user's confirmed choice) behind a provider-agnostic seam (see §6). No Stripe.
- All eSIM Access calls server-only through `lib/esim-access.ts` (HMAC-SHA256 signature or exact auth scheme per eSIM Access v1 docs — builder verifies during build; doc §9 open item).

## 4. URL routing & funnels (French)

```
app/
  page.tsx                                  # Hub homepage: brand + global destination search bar
  esim-omra/page.tsx                        # Custom pilgrim funnel (Makkah/Madinah 5G, Nusuk/WhatsApp/Uber on
                                            #   landing, skip biometric SIM queues at Jeddah)
  esim-arabie-saoudite/page.tsx             # Same engine as omra funnel, distinct H1/FAQ/metadata copy
  esim-maroc/page.tsx                       # Custom copy (Maroc Telecom/Orange partner networks)
  esim-suisse/page.tsx                      # Border-crossing roaming trap angle; CHF display handled here
  esim-turquie/page.tsx                     # Istanbul/Antalya traveler angle
  esim-emirats-arabes-unis/page.tsx         # Dubai/Abu Dhabi angle
  (no dynamic esim-[...] route)             # Cities disabled at launch: unknown /esim-* slugs 404 naturally
  commande/[order_ref]/page.tsx            # Order status: pending → QR/delivery display
  mes-esims/page.tsx                        # Order lookup by email + order token
  mentions-legales / cgv / politique-de-confidentialite
  api/checkout/route.ts
  api/webhooks/[provider]/route.ts
  api/orders/lookup/route.ts
```

- Custom static funnels always beat the dynamic `[city]` route automatically in Next.js static-route precedence.
- `sitemap.ts` + `robots.ts` include hub + 6 funnels + legal. Product JSON-LD (`Product`/`Offer` with EUR prices) on funnel pages.
- These URLs are identical in Phase 2; German gets `/de/...` via `[locale]` middleware. French stays locale-less, no upgrades, no redirects.

## 5. i18n dictionary pattern

```
dictionaries/fr.json   # every UI string lives here NOW (MVP renders fr directly)
dictionaries/de.json   # scaffold only, empty sections
lib/i18n.ts            # getDictionary(locale) typed from fr.json shape
```
Rule: no hardcoded user-visible string in components — funnels too (funnel copy keys under `funnels.<slug>` in `fr.json`).

## 6. Payments seam (provider-agnostic)

```
lib/payments/types.ts       # PaymentProvider: createCheckout(order) → {url, sessionId},
                            #   parseWebhook(req) → {sessionId, amount, status, raw}
lib/payments/adapter.ts     # registry/factory by PAYMENTS_PROVIDER env ("whop" for MVP);
                            #   the ONLY file to touch when adding Paddle in Phase 1.1
lib/payments/whop.ts        # WhopProvider — checkout link + webhook parse + refund
lib/orders.ts               # fulfill() — provider-agnostic, knows nothing about Whop
```

- Whop is the **Merchant of Record** (owner call): it collects/remits EU & French VAT and issues compliant invoices on our behalf. Our system stays amount-agnostic — webhook amount-matching is by `provider_session_id`, never by price comparison.
- Build-then-Integrate (owner call): build the seam against Whop's documented contract first, integration-test once live credentials exist.

- `orders.provider_session_id` UNIQUE + conditional UPDATE `WHERE status <> 'fulfilled'` — idempotency at SQL level.
- Order state machine: `pending → paid → fulfilled | failed` (+ `refunded`), plus `expired` as a terminal state: `pending` orders older than 24h are marked expired by cron (agent call; owner can override).
- `/api/checkout` returns HTTP 501 with explicit message if provider creds absent (consistent with earlier mini-SaaS pattern). No fake charges, no demo payments in production.

## 7. Data model (Supabase)

```
packages      id, destination_slug, name_fr, days, data_gb, price_cents (EUR, integer),
              esim_access_package_id, active, updated_at
orders        id, order_ref (public token, nanoid), email, package_id,
              provider, provider_session_id UNIQUE, amount_cents, currency 'EUR',
              status, esim_details JSONB (qr_png_url, smdp_address, activation_code,
              iccid, esim_access_order_id), created_at, fulfilled_at
sync_log      id, ran_at, changes JSONB, alert_sent
```
All money integer cents. All timestamps UTC stored, Europe/Paris displayed.

### Pricing rule (user call, formalized by agent)
Tier set (x.99 cents): 4.99, 7.99, 8.99, 9.99, 12.99, 14.99, 16.99, 18.99, 19.99, 29.99.
All displayed prices are **TTC** (owner call, French consumer law). Margin floor is computed on TTC basis:
`(price_TTC − wholesale_net) / price_TTC ≥ 45%`.
Auto price = nearest tier of `wholesale_net × 2.2`; if margin < 45% (i.e. price < wholesale_net/0.55), bump to next tier up. Manual `price_cents` override column always wins — launch catalog is manually set, formula governs future synced packages. Wholesale cost stored per package (source: eSIM Access list). CHF shown as "≈ X CHF" display-only; settlement always EUR.

### Launch catalog seed (user call — 11 packages)
| Destination | Plan FR | Days / GB | Price |
|---|---|---|---|
| Arabie saoudite / Omra | Express | 10 j / 5 Go | 12,99€ |
| Arabie saoudite / Omra | Complete | 15 j / 10 Go | 19,99€ |
| Arabie saoudite / Omra | Extended | 30 j / 20 Go | 29,99€ |
| Maroc | 7 j / 5 Go | 7 / 5 | 9,99€ |
| Maroc | 15 j / 10 Go | 15 / 10 | 16,99€ |
| Turquie | 7 j / 3 Go | 7 / 3 | 7,99€ |
| Turquie | 15 j / 10 Go | 15 / 10 | 14,99€ |
| Suisse | 7 j / 3 Go | 7 / 3 | 8,99€ (~9 CHF) |
| Suisse | 14 j / 10 Go | 14 / 10 | 18,99€ (~19 CHF) |
| Émirats arabes unis | 7 j / 3 Go | 7 / 3 | 9,99€ |
| Émirats arabes unis | 14 j / 10 Go | 14 / 10 | 19,99€ |

CHF display: fixed `EURCHF_RATE` env var (manual monthly update), rendered "≈ X CHF" for approximate display only; settlement always EUR (user call: EUR settlement).

## 8. Order flow, fulfillment & delivery

1. Funnel page → plan card (price, days/GB, coverage badge) → `/api/checkout` (email + packageId, guest).
2. Provider checkout → return to `/commande/{order_ref}` (pending state: "préparation de votre eSIM…").
3. Webhook (`checkout.session.completed` equivalent) → verify signature → match `orders.provider_session_id` → conditional status update → call eSIM Access purchase → store esim_details → Resend confirmation email (FR).
4. Success page shows (user spec): QR image, SM-DP+ address + activation code with copy buttons, Apple 1-click install button `https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=...`, install instructions iOS/Android in French.
5. Page polls `/api/orders/{order_ref}` — provisioning latency is never a dead spinner; email is the backup delivery, not the only one.

### Refund flow (user call — strict conditional)
- 14 days, full refund ONLY if: eSIM not installed/activated AND zero data consumed — verified via eSIM Access usage/query API before refund executes.
- Owner authorizes real-money integration testing (budget $10–15): live provision the cheapest test package, then verify idempotency (no double-fulfillment) and run at least one real pre-activation refund test against live consumption metrics.
- After activation: zero refunds (CGV states clearly, digital goods).
- Self-service: `/mes-esims` order lookup → "Demander un remboursement" (pre-activation only) → server verifies status/usage → provider refund API → `refunded` status + email.

## 9. Catalog sync (cron)

- Daily Vercel cron → eSIM Access package list → diff against `packages`:
  - new package → insert (inactive) + notify,
  - price change → alert,
  - retired package → set `active=false` + alert (sell-through then block checkout).
- Email alert to owner on drift. `sync_log` records every run. Selling a dead package is an anti-goal — a retired/unknown package must hard-fail checkout, never silently map.

## 10. Support & trust

- Floating WhatsApp widget (deep link `wa.me`, number via env) on all pages.
- Resend emails: order received, eSIM delivered, refund confirmation, owner alerts.
- Mandatory French legal routes with placeholder tokens: `/mentions-legales`, `/cgv`, `/politique-de-confidentialite` — `[COMPANY_NAME]`, `[SIRET]`, `[REGISTERED_ADDRESS]`, `[CONTACT_EMAIL]`, hosting = Vercel/Supabase. CGV includes withdrawal-right waiver for instant digital delivery + strict refund rule. Sitemap excludes nothing here; legal pages indexed.

## 11. Env vars (all server-only)

`ESIM_ACCESS_BASE_URL`, `ESIM_ACCESS_ACCESS_CODE`, `ESIM_ACCESS_SECRET_KEY`, `PAYMENTS_PROVIDER`, Whop creds, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `WHATSAPP_NUMBER`, `EURCHF_RATE`, `NEXT_PUBLIC_SITE_URL` (default `https://myroamspot.com`), brand name MyRoamSpot. `.env.example` committed; nothing real committed.

## 12. Explicit agent calls (owner can veto)

- Guest checkout only, no auth at launch (user approved in chat).
- `node:sqlite`-style integer-cents discipline across all money math.
- No English fallback visible: missing dictionary key fails build in CI, not a silent fallback.
- City pages + `/de`: deliberately not in MVP.
- Silent-swap of payment provider via env only after `WhopProvider` passes a scripted integration test; Phase 1.1 adds Paddle for a localized French checkout behind the same `adapter.ts`, with zero schema churn.

## 13. Resolved decisions (owner sign-off 2026-10-18)

1. **Payments:** Whop as MoR, build-then-integrate; amount-agnostic webhook matching. Phase 1.1: Paddle hot-swap for localized French checkout via `adapter.ts`.
2. **Testing budget:** real-money integration tests authorized ($10–15) for idempotency + refund verification.
3. **VAT:** all displayed prices TTC; margin floor on TTC basis (§7).
4. **Checkout UX:** Whop MVP with Apple Pay / Google Pay to mitigate English-checkout friction; French checkout revisited in Phase 1.1.
5. **Brand & reseller terms:** MyRoamSpot (`myroamspot.com`); eSIM Access fully white-label B2B with full resale rights.

Remaining build-time verifications (not decisions): exact eSIM Access v1 auth scheme + endpoint contracts, confirmed against their docs during `lib/esim-access.ts` build.
