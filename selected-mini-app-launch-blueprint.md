# Launch Blueprint — Contractor Bid Normaliser & Scope Comparator

**Date:** 2026-10-18
**Brand:** **Quote Parity** (`quoteparity.com`)
**Niche:** C — Owner-builder home remodels
**Selected app:** C1
**Buyer:** Consumers with commercial stakes (homeowners managing a $28k–$51k decision)
**Market:** US only at launch (see Section 1)
**Price:** $19 one-time
**Budget:** $500 total
**Status:** Niche, app, buyer, price, refund policy, and brand all confirmed by founder. Nothing built yet.

---

## 1. Business and positioning

### Selected market and audience

**Market:** **United States only at launch.** English-language, US customers, US cards.

This is a deliberate restriction, not a limitation of ambition. Selling to US customers only removes UK/EU/Australian statutory withdrawal and consumer-guarantee obligations entirely, which lets you keep the strict technical-failure-only refund policy. Revisit once you have revenue and can afford the compliance work (an express withdrawal waiver at checkout for EU/UK buyers).

**Enforcement:** restrict at the payment layer using a Stripe Radar rule blocking non-US card country (BIN), and state the restriction on the checkout page and in Terms. Blocking by card country is imperfect — someone with a foreign card and a US address may still get through — so treat the Terms statement as the primary control and the Radar rule as a backstop.

**Primary audience:** The homeowner acting as their own general contractor on a kitchen, bathroom, multi-room, or whole-home remodel. They are collecting 2–5 contractor bids and are about to commit $28,000–$51,000.

**Who pays:** The homeowner personally, from a personal card. One decision, one purchase, no procurement process.

**Situation:** They have bids in hand. The numbers are far apart. They cannot tell whether the gap reflects real difference in scope, quality, or padding — so they are stuck between paralysis and guessing.

### Problem and purchase trigger

**Problem (verified, quoted):**
> *"Receiving multiple quotes for a bathroom remodel that range from $28k to $51k for the same scope creates a massive analysis paralysis. The variation suggests the cheaper options might be cutting corners or the expensive ones are inflating costs, but inconsistent formatting across bids makes it nearly impossible to tell from just looking at the line items."*
> — r/Remodel, 2026-03-16

The real failure is **invisible scope asymmetry**. Bids look comparable because they share a headline price and a list of line items. They are not comparable, because one includes demolition, disposal, permits, and tile, and the other quietly does not. The homeowner finds out during construction, as a change order.

**Purchase trigger:** The week multiple bids land on the table and the homeowner realises they cannot compare them. This is a **narrow, time-boxed window** — a deliberate design constraint, addressed in acquisition below.

### Core promise

**"Compare contractor bids on the same scope — and see what the cheap bid left out, before you sign."**

Not "organise your remodel." Not "track your budget." One job, done at the highest-stakes moment.

### Differentiation

Incumbents compare **prices**. This compares **scope**.

| Competitor | What it does | What it misses |
|---|---|---|
| GC In My Pocket (Bid Comparison, $12 template) | Up to 5 bids side by side in Excel | Manual; not browser-based; no normalisation logic; requires Excel |
| Opsite Homeowner Compare (free) | AI-parses 2–4 PDFs; verifies CA contractor licence | Licence/trust focused, not scope-focused; California-only check; requires file upload; free implies a lead-gen incentive |
| comparecontractorquotes.com | Quote comparison | Unverified; appears to compare prices |

**Our specific claim:** normalise every bid onto a **fixed inclusion checklist** and compute the true comparable total. The question we answer is not "which number is smaller" but "what will this actually cost me once every bid covers the same scope".

**Why this is defensible:** the incumbents' incentive is contractor trust and referrals. Scope normalisation is neutral, homeowner-side, and unglamorous — which is exactly why it is underserved.

### Customer language (drawn from research, not invented)

Use their words, not ours:

| Their words | Source |
|---|---|
| "massive analysis paralysis" | r/Remodel, 2026-03-16 |
| "inconsistent formatting across bids" | r/Remodel, 2026-03-16 |
| "nearly impossible to tell" | r/Remodel, 2026-03-16 |
| "the cheaper options might be cutting corners or the expensive ones are inflating costs" | r/Remodel, 2026-03-16 |
| "the same scope" | r/Remodel, 2026-03-16 |
| "contractor estimates" / "quotes" | r/Remodel, 2026-03-16 |
| "acting as your own general contractor" | gcinmypocket.com |
| "one bad remodel decision can cost more than the whole app" | gcinmypocket.com |

**Do not claim** things we have not earned: no "trusted by thousands", no testimonials, no ratings, no certifications, no "best" or "#1".

### Objections and truthful responses

| Objection | Honest response |
|---|---|
| "I can do this in a spreadsheet." | You can — that's what the $12 incumbent sells. This does the normalisation for you, in the browser, in minutes, with no Excel. |
| "There's a free tool for this." | Yes, and it verifies contractor licences in California. It doesn't normalise scope. Ours does. Use both if useful. |
| "How do I know the normalised total is right?" | It is arithmetic on numbers *you* entered, and the checklist is visible. You can inspect every input. We don't guess or estimate anything. |
| "Is this legal or construction advice?" | No. It is a calculator. It does not advise on permits, codes, contracts, or whether a contractor is competent. Always verify with your local building department and the professionals you hire. **State this plainly on the page.** |
| "Why should I trust a new tool with my project?" | Don't trust it — check it. The free comparison is fully usable before you pay, and the maths is shown. |
| "Will you store my remodel data?" | No. The comparison runs in your browser. We never receive your bid amounts, contractor names, or project data. See Privacy. |

### Brand-name ideas and domain availability

Availability checked via RDAP on 2026-10-18. **RDAP "no record" is a strong indicator of availability, not a guarantee — confirm at a registrar before relying on it. I have not performed any trademark clearance; do not treat these names as cleared.**

**Checked and taken (28 domains, RDAP, 2026-10-18):**

`scopelens` (2012) · `scopematch` (2009) · `scopefair` (2007) · `levelscope` (2007) · `truescope` (2008) · `scopecheck` (2011) · `scopebid` (2010) · `bidscope` (2012) · `bidlens` (2014) · `bidbench` (2016) · `levelbid` (2017) · `bidgap` (2018) · `bidwise` (1998) · `truebid` (1999) · `truebids` (1999) · `bidledger` (2020) · `bidscore` (2020) · `evenbid` (2020) · `scopeaudit` (2021) · `bidtruth` (2022) · `scopesense` (2019) · `applescope` (2024) · `bidreveal` (2024) · `bidclarity` (2025-05) · `scopecompare` (2025-12)

**Available now (no RDAP record found):**

| Domain | Note |
|---|---|
| **quoteparity.com** | Best available `.com` — "parity" = apples-to-apples, describes the core value |
| **paritybids.com** | Available `.com`; reads slightly less naturally |
| samescope.co | Strongest *concept* — "same scope" is literally the promise; `.co` not `.com` |
| quoteparity.co | Fallback for the above |
| bidparity.co | Also available |
| levelbid.app | Available |
| bidnormalizer.com | Available; descriptive and unbrandable |
| comparabids.com | Available; descriptive and unbrandable |

**⚠ Signal worth taking seriously.** Eleven thematically-matched domains were registered in the last 18 months, and the clustering is dense in 2026 specifically:

| Domain | Registered |
|---|---|
| scopealign.com | 2025-06-01 |
| scopeproof.com | 2025-07-30 |
| bidgauge.com | 2025-06-02 |
| scopesquare.com | 2025-03-15 |
| bidalign.com | 2026-01-02 |
| scopebench.com | 2026-02-07 |
| comparemybids.com | 2026-04-05 |
| equalscope.com | 2026-04-16 |
| scopegauge.com | 2026-04-26 |
| evenquote.com | 2026-04-21 |
| levelbids.com | 2026-04-08 |
| scopesift.com | 2026-06-09 |
| samescope.com | 2026-07-01 |
| bidparity.com | 2026-03-02 |
| scopetruth.com | 2026-08-22 |

**How to read this, honestly:** this is *consistent with* others actively pursuing bid/scope comparison right now. It is **not proof** — many could be domain investors, and a registered domain is not a shipped product. But it is not what an empty, uncontested field looks like. Two conclusions: (a) the idea is not novel, so any advantage must come from execution and distribution, not from being first; and (b) if you're going to do this, do it now rather than deliberating for a month.

**Recommendation:** `quoteparity.com` — the only strong `.com` left. `samescope.co` if you prefer the concept over the TLD (I'd argue the `.com` matters more for a US consumer audience than a slightly better name). **I have performed no trademark clearance on any of these. A registered domain does not mean a clear trademark, and a clear trademark does not mean an available domain. Do not commit until you've searched USPTO/EUIPO/UKIPO for the name and its equivalents.**

---

## 2. Product and implementation

### Main user journey

```
Landing page
  → "Try it free — no signup" (nothing gated)
  → Comparison workspace opens
      → Add bid 1: total + tick inclusions
      → Add bid 2: total + tick inclusions
      → NORMALISED RESULTS appear immediately
          → per-bid comparable total
          → price gap attributable to scope
          → "missing items" per bid
          → questions to ask each contractor
  → Email capture (optional) to save/print
  → Unlock (£/$19) → Stripe Checkout → success page → printable pack
```

**Design principle: show the result before asking for anything.** The free comparison is the demo, the lead magnet, and the product's proof. This is the single most important conversion decision in the blueprint.

### MVP features and acceptance criteria

| # | Feature | Acceptance criterion |
|---|---|---|
| F1 | Add 2–5 bids | User can add, edit, and remove bids without losing other data |
| F2 | Fixed inclusion checklist (~15 items: permits, demolition, disposal, rough-in, tile, fixtures, paint, contingency, appliances, cabinetry, labour, site protection, cleanup, inspection coordination, materials allowance) | Every bid is scored against the identical list; no free-text-only items in v1 |
| F3 | Headline total per bid | User enters the total from the bid they received |
| F4 | Normalised comparable total | Computed as headline + cost of items the bid omits; formula is visible on screen |
| F5 | Gap explanation | Shows how much of the price difference is attributable to omitted scope |
| F6 | Missing-items list per bid | Each bid lists exactly what it does not cover |
| F7 | Contractor question list | Generated from the gaps ("Does your price include permit fees and disposal?") — **questions, never advice or verdicts** |
| F8 | Side-by-side comparison view | All bids comparable in one table on a mobile screen without horizontal scroll breaking |
| F9 | Print / PDF export (paid) | Produces a clean one-page summary |
| F10 | Save & reload (paid) | Comparison persists for the user's return visit |
| F11 | Payment + unlock | One-time Stripe Checkout; access granted on `checkout.session.completed` |
| F12 | Disclaimers | "Calculator, not advice" visible on results and export |

**Explicitly out of MVP:** AI PDF parsing, contractor licence verification, accounts with passwords, messaging, scheduling, payments to contractors, mobile app, team collaboration, multi-project dashboards.

### Essential screens

1. **Landing** — promise, live demo entry, pricing, FAQ, disclaimers.
2. **Workspace** — bid entry + checklist (the core screen).
3. **Results** — normalised table, gaps, question list.
4. **Unlock** — what the paid tier adds, Stripe handoff.
5. **Success** — receipt, printable pack, "what to do next".
6. **FAQ / Privacy / Terms / Refunds** — static.
7. **Contact** — email + response-time expectation.

### Recommended technology

Chosen for your skills (Next.js/React), your budget ($0 recurring), and your privacy constraint.

| Layer | Choice | Cost | Rationale |
|---|---|---|---|
| Framework | **Next.js (App Router), TypeScript** | $0 | You already use it |
| Hosting | **Vercel** free tier | $0 | Deploy on push; custom domain supported |
| Styling | Tailwind CSS | $0 | Fast, consistent |
| State / storage | **Browser localStorage** | $0 | **No server ever receives project data** |
| Payments | **Stripe Checkout, one-time (`mode: payment`)** | Per-transaction | No card data touches your servers |
| Webhook | Next.js route handler verifying the Stripe signature | $0 | Delivery of access |
| Licence store | Vercel KV / Supabase / a single table (email + licence key only) | $0 on free tier | The **only** server-side data |
| Email | Resend free tier | $0 | Licence key + receipt delivery |
| Analytics | Vercel Analytics + custom events | $0 | Funnel measurement |
| Domain | Registrar | ~$12/yr | Only committed cost |

**Verified against current Stripe docs:** one-time payments use `mode=payment` on the Checkout Session, and fulfilment should be driven by the `checkout.session.completed` webhook with signature verification (`stripe.webhooks.constructEvent`). Never fulfil from the success-page redirect alone — users can close the tab before it loads.

**Why no AI in the MVP:** AI PDF parsing is the single most likely way to blow the budget and the support burden. It costs per use, it misreads real bids, and errors on a $30k decision destroy trust. Manual entry of 2–5 totals is 3 minutes of the user's time and 100% accurate. Add parsing only if users explicitly demand it *after* paying.

### Data storage, integrations, dependencies

- **Stored on the user's device:** bid amounts, checklist selections, contractor labels. Never transmitted.
- **Stored on your server:** licence key, purchaser email, purchase date. Nothing else.
- **Integrations:** Stripe only. No third-party APIs, no scraping, no AI vendor.
- **Dependency risk:** low. Two dependencies (Vercel, Stripe). No platform that can change its pricing and break you overnight.

### Authentication and payment-to-access flow

Deliberately **no accounts in the MVP**.

1. User clicks Unlock → server creates a Checkout Session (`mode=payment`, price $19).
2. User pays on Stripe's hosted page.
3. Stripe fires `checkout.session.completed` → your webhook verifies the signature.
4. You generate a licence key, store `{key, email, date}`, and email it via Resend.
5. Success page shows the printable pack; returning users enter the key to re-unlock.

This removes password storage, password-reset support, session security, and account-deletion workflows — a large reduction in both risk and support load for a solo operator.

### Usage limits and cost controls

- **There is no per-use cost**, so no usage limits are needed and no "unlimited" claim can ever be broken.
- Cost controls that do matter: cap Resend free-tier sending, cap the licence store, and set a Stripe alert for anomalous volume.
- **Hard rule:** keep the total recurring spend at **$0** until revenue exists.

### Privacy, security, deletion, backup, support

- **Privacy:** publish a plain-language policy. The headline is a genuine selling point: *"Your bid amounts, contractor names, and project details never leave your browser."* No third-party analytics that receive project data.
- **Security:** no card data stored; Stripe handles PCI. Webhook signature verification is mandatory. Secrets in environment variables only — never in the repo.
- **Deletion:** because only a licence record exists, a deletion request is a one-row delete. State a response window.
- **Backup:** export the licence table periodically. Nothing else is worth backing up.
- **Support:** email only, with an honest stated response window (e.g. 2 business days). Build an FAQ from real questions and add to it every time the same question appears twice.
- **Guardrail:** the product must never render a verdict on a contractor, a permit, or a contract. It calculates and it asks questions.

### Mobile usability, accessibility, localisation, RTL

- **Mobile-first:** homeowners read bids on a phone, often on site. The comparison table must work at 360px width.
- **Accessibility:** semantic HTML, labelled form inputs, visible focus states, colour contrast ≥ 4.5:1, no colour-only meaning (the "missing items" indicator must carry a text label, not just red).
- **Localisation:** English-only at launch. Do not build i18n scaffolding.
- **RTL:** not required for English. If you later localise to Arabic or Hebrew, RTL is a re-architecture of the table layout — scope it then, not now.

### Build sequence and effort estimates

Assumes 20+ hrs/week.

| Phase | Work | Est. |
|---|---|---|
| 1 | Landing page + workspace shell, deployed on a real domain | 6–8 hrs |
| 2 | Checklist + normalisation logic + results table (**this is the whole free product**) | 10–14 hrs |
| 3 | Question generation, print view, polish, mobile pass | 6–8 hrs |
| 4 | Stripe Checkout + webhook + licence key + email delivery | 6–8 hrs |
| 5 | Analytics events, privacy/terms/refunds, FAQ | 4–6 hrs |
| 6 | Accessibility + mobile QA, disclaimers | 3–4 hrs |
| | **Total to launch** | **~35–48 hrs ≈ 2–2.5 weeks** |

**Stop-and-check gate:** Phases 1–3 (the free product) are ~22–30 hrs and cost ~$12. **Do not build phase 4 until the free comparison produces completed comparisons and at least a few paid pre-orders.** If nobody completes a comparison, no checkout will save you.

---

## 3. Website and conversion

The site is deliberately minimal. No ecommerce cart, no collection pages, no multiple product pages — the offer does not need them.

### Landing page (single page)

1. **Headline:** *"Two contractors. Same bathroom. $28k and $51k. Which one is actually cheaper?"*
2. **Subhead:** *"Compare contractor bids on the same scope and see what the cheap bid left out — free, in your browser."*
3. **Primary CTA:** `Compare my bids free` — goes straight into the workspace. No signup.
4. **Proof-by-demonstration:** a screenshot of a real (anonymised) comparison showing the scope gap. Not a testimonial — we have none and must not invent one.
5. **How it works:** three steps, one line each.
6. **What it is not:** explicit, prominent disclaimer — not legal, construction, or permit advice; a calculator and organiser.
7. **Pricing:** free tier vs $19 unlock, plainly compared.
8. **FAQ:** the six objections above, answered honestly.
9. **Footer:** contact, privacy, terms, refunds.

### Product demonstration / sample output

The demo **is** the product. A `See a sample comparison` link loads a pre-filled example so a visitor sees the output in one click, before entering their own numbers. This is the highest-leverage conversion element on the site.

### Features and use cases

- Compare 2–5 bids on one scope.
- See the true comparable total per bid.
- Get the list of what each bid omits.
- Get the questions to ask before signing.
- Print or save a summary.

### Pricing and FAQ

| | Free | Unlocked — $19 one-time |
|---|---|---|
| Compare 2–5 bids | ✓ | ✓ |
| Normalised totals & gap analysis | ✓ | ✓ |
| Missing-items list | ✓ | ✓ |
| Contractor question list | ✓ | ✓ |
| Save & reload your comparison | — | ✓ |
| Print / PDF summary pack | — | ✓ |
| **Your project data stays in your browser** | ✓ | ✓ |

One-time. No subscription. No account required.

### Checkout and successful-payment page

- Stripe-hosted Checkout (trusted, no PCI burden, supports local payment methods).
- Success page: confirm the purchase, display and re-send the licence key, link the printable pack, and explain what to do next.
- **Fulfil from the webhook, not the redirect.**
- Explicitly state the refund policy on the checkout page, not buried in terms.

### Account or access delivery

Licence key by email plus on-screen, re-enterable any time. No password to forget, nothing to reset.

### Onboarding and first useful result

The user's first useful result is **the normalised comparison**, and they get it *before* paying, within about three minutes of landing. Paid unlock adds persistence and the printable artefact — convenience and output, not withheld insight. Activation is defined accordingly in Section 4.

### Contact, privacy, terms, refund information

- Contact: a real email address and a stated response window.
- Privacy: plain language, with the no-upload guarantee as the headline.
- Terms: state clearly that the tool provides no professional advice.

### Refund policy — decision and compliance caveat

**Chosen policy: refund on technical failure only.** This is the founder's call and is recorded here as decided.

**It carries a real legal risk that you should accept deliberately, not by accident.** A blanket "all sales final" policy is generally fine for US customers, but it conflicts with statutory consumer rights if any buyer is in the **UK, EU, or Australia**:

- **UK** — the Consumer Contracts Regulations 2013 give a 14-day right to withdraw from distance sales. For digital content you can only remove that right if the buyer gives **express consent** and **acknowledges** they lose it, and you confirm this in a durable form.
- **EU** — the same 14-day withdrawal right applies, with the same express-waiver requirement.
- **Australia** — statutory consumer guarantees apply and **cannot be excluded by a refund policy at all**.

If you are yourself based in the UK or EU, your local consumer law applies to your business **regardless of where your customers are** — so this is not avoidable by targeting the US.

**Why this matters commercially, not just legally:** a disputed charge results in a Stripe chargeback, which costs a fee (~$15), can exceed the $19 sale entirely, and repeated chargebacks jeopardise your Stripe account. Refunding $19 is cheaper than winning a $19 dispute.

**RESOLVED — decision taken: sell to US customers only, keep the strict policy.**

This is the compliant path. Because no buyer will be in the UK, EU, or Australia, the statutory withdrawal and consumer-guarantee regimes that would override a no-refund policy simply do not apply. The restriction is what makes the policy lawful, so the two decisions must stay coupled: **if you later open up global sales, the refund policy has to change at the same time.**

Operational requirements that follow from this decision:

- State "US customers only" on the checkout page and in Terms, not just in a FAQ.
- Add the Stripe Radar rule blocking non-US card country as a backstop.
- Keep the technical-failure refund genuine: if the tool fails to produce a result, refund promptly and without argument. Your Terms will say you don't refund for change of mind — that is defensible **only** if you never use it to refuse a refund for a broken product.
- Revisit this decision when you have revenue. Adding EU/UK sales later needs an express withdrawal waiver at checkout; that is a small project, not a rewrite.

**Either way:** if you keep "technical failure only", the policy must be **visible on the checkout page, not buried in Terms**, and it must not be presented as removing rights the buyer legally has. An unenforceable clause is worse than no clause.

**Implementation note:** with no per-use cost, a refund costs you only the Stripe fee. At this price point, generous refunds are cheap insurance — treat this as a business decision you are entitled to make differently, not a settled one.

**What is not negotiable:** never take money for something undelivered without stating the delivery date up front, and always deliver the licence key by webhook-driven email so no paying customer is ever left without access.

---

## 4. Launch and measurement

### 14-day plan (at 20+ hrs/week)

**Days 1–2 — Problem validation (before building).**
Join r/Remodel, r/HomeImprovement, r/DIY. Answer 10–15 bid-comparison questions with genuine help, **no links**. Log exact phrasing in a shared doc.
*Evidence target:* 5+ distinct people describing bid comparison as hard or stressful.
*Stop here if:* the recurring question is about *finding* contractors rather than *comparing* them.

**Days 3–5 — Build the free comparison (phases 1–2).**
Deploy on the real domain. Ship the workspace and results.

**Days 6–7 — Build results quality (phase 3) + analytics.**
Question generation, print view, mobile pass. Instrument events before promoting anything.

**Days 8–9 — The demonstration content.**
Record 3–5 faceless screen recordings (no camera — your constraint): "Why the cheaper bid cost $12,000 more", "The 15 things one contractor left out", "How to read a bid in 3 minutes". Text-on-screen plus voiceover.

**Days 10–11 — First distribution push.**
Post the *method* (not the tool) in 2–3 communities where it genuinely helps, with the tool linked only where rules permit. Concurrently post the screen recordings to TikTok/Reels/Shorts.

**Days 12–13 — Test willingness to pay.**
Enable the $19 unlock. Publish a clearly-labelled pre-order/pre-launch offer if the paid features aren't finished, stating the delivery date and offering a full refund.

**Day 14 — Decide.**
Review the funnel. Apply the criteria below. Write down the one change you'll make next.

### First-customer acquisition actions

1. Answer existing bid-comparison questions in r/Remodel, r/HomeImprovement, r/DIY — value first, and only link where permitted.
2. Publish the method publicly as a genuinely useful post or page ("how to compare contractor bids on the same scope").
3. Post faceless screen recordings of the normalisation on TikTok/Reels/Shorts.
4. Make the comparison output itself shareable — homeowners screenshot it and send it to a spouse. That is your only organic loop; optimise for it.
5. Relevant Facebook groups for local renovations and DIY (these are often more permissive than Reddit about tools).
6. **Do not** cold-DM contractors, spam communities, or run paid ads.

### Demonstration and content ideas

- "The cheapest bid isn't the cheapest bid" — a real annotated comparison.
- "Read this before you sign a contractor estimate" — the question list as content.
- "How I compared three bathroom bids in 10 minutes."
- "5 phrases in a contractor bid that mean 'extra charge later'."
- Short-form reframes of the same three ideas, repeated with new visuals. Faceless: screen recording plus captions.

### Relevant communities and their rules

| Channel | Note on rules |
|---|---|
| r/Remodel | Small, high-intent. Promotion is restricted; lead with the method |
| r/HomeImprovement | Large. Self-promotion generally restricted; participate first |
| r/DIY | Large. Strictly no spam; helpful answers only |
| Renovation Facebook groups | Often the most permissive for tool sharing — check each group's rules |
| TikTok / Reels / Shorts | No promotion restriction; distribution is the constraint |
| YouTube renovation channels | Potential creator collaborations later, not at launch |

**Rule of thumb:** read each community's rules before posting, and treat every community as a place to be useful first. One ban costs more than a week of reach.

### Events to measure

| Event | Meaning |
|---|---|
| `visit_landing` | Arrived |
| `sample_viewed` | Clicked the sample comparison |
| `comparison_started` | Added a first bid |
| `second_bid_added` | Added a second bid |
| **`comparison_completed`** | **ACTIVATION — normalised result displayed for 2+ bids** |
| `unlock_clicked` | Saw the paid tier |
| `checkout_started` | Reached Stripe |
| `purchase_completed` | Webhook confirmed |
| `summary_exported` | Used the paid artefact |
| `returned_7d` | Came back within 7 days |

**Activation is `comparison_completed`** — a real user outcome (two bids genuinely compared), not "created an account". There is no account, deliberately.

**Do not measure:** page views in isolation, time on site, or social followers. None of them pay rent.

### Criteria: improve, expand, or stop

| Signal | Decision |
|---|---|
| ≥ 20 `comparison_completed` from organic reach | Proceed — build the paid tier |
| Activation rate < 30% of `comparison_started` | Improve — simplify bid entry; the checklist is too long |
| 10+ paid purchases | Expand — start C2 (budget tracker) as the natural bundle |
| 1–9 paid purchases | Revise — test $29 and $12 honestly; revisit positioning |
| 0 paid after 100+ completions | **Stop.** Do not build further |
| Refund rate > 15% | Stop and diagnose before spending another hour |
| Sales stop entirely when posting stops | Channel-dependent, not product-market fit — revisit distribution |

### Next action

Build phases 1–2 only (~16–22 hrs, ~$12). Deploy the free comparison on a real domain, then work Days 1–2 validation alongside it. Do not touch Stripe until real people have completed real comparisons.

---

## 5. Open items requiring your decision

1. **Brand — CONFIRMED: Quote Parity (`quoteparity.com`).** 41 domains checked; this was the only strong `.com` remaining. **Trademark clearance is still outstanding and is on you to complete** — search USPTO (and any registry for your own country) for "Quote Parity" and close variants before you buy the domain or print it on anything. A free domain is not a clear trademark.
2. **Your country.** Still unknown, and still the largest unexamined opportunity. It determines your own consumer-law obligations, your Stripe fee schedule, and whether a localised version might beat the English launch. I have not been able to assess any of it.
3. **Price — CONFIRMED: $19 one-time.** Copy can be written on this basis.
4. **Refund policy — CONFIRMED: technical failure only, US customers only.** Legally coherent as a pair; they must change together if you go global.

## 6. Status

| Item | State |
|---|---|
| Niche | **Confirmed** — C, owner-builder remodels |
| First app | **Confirmed** — C1, bid normaliser |
| Buyer definition | **Confirmed** — consumers with commercial stakes |
| Market | **Confirmed** — US only at launch |
| Price | **Confirmed** — $19 one-time |
| Refund policy | **Confirmed** — technical failure only (US-only makes this lawful) |
| Brand / domain | **Confirmed** — Quote Parity, `quoteparity.com` |
| Trademark clearance | **Outstanding — yours to do** |
| Product | **Not built** |

**Next action, in order:**

1. Search USPTO for "Quote Parity". If it's clear, buy `quoteparity.com`. If it isn't, come back to me for another batch — there are still fallbacks.
2. Days 1–2 of the 14-day plan: join r/Remodel, r/HomeImprovement, r/DIY and answer 10–15 bid-comparison questions with genuine help, no links. **Collect the exact words people use.**
3. Only then build phases 1–2 (~16–22 hrs, ~$12): landing page plus the free comparison.

**The gate still stands:** do not touch Stripe until real people complete real comparisons. If nobody completes a comparison, no checkout will save you.
