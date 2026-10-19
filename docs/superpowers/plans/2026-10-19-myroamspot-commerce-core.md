# MyRoamSpot — Commerce Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take MyRoamSpot from a static funnel site to a working paid-delivery system — Supabase catalog, guest checkout, Whop payment seam, idempotent webhook fulfillment through eSIM Access, French transactional email, and the strict pre-activation refund flow.

**Architecture:** Two seams keep the system testable and swappable: a provider-agnostic `lib/payments/` (only `adapter.ts` changes to add Paddle) and an injected `OrdersRepo` interface (Supabase implementation plus an in-memory fake for tests). Everything money-critical — pricing, order lifecycle, fulfillment, refunds — is a pure or dependency-injected function; only thin route handlers and server components touch the network. The catalog moves from a committed seed to Supabase with the seed kept as the no-credentials fallback, so builds and tests stay green everywhere.

**Tech Stack:** Next.js 15 App Router (route handlers, server components, ISR), React 19, TypeScript strict, Tailwind v4 + existing Apple tokens, Supabase (`@supabase/supabase-js`), `nanoid` for public order tokens, `node:crypto` for both signature schemes, Resend REST API (no SDK), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-18-esim-saas-design.md` (status APPROVED, owner sign-off 2026-10-18)

## Scope

**In:** spec §6 (payments seam, order state machine), §7 (Supabase data model, pricing rule, launch catalog), §8 (checkout → webhook → fulfillment → delivery, refund flow), §10 (Resend emails), §11 (env vars).

**Out (deliberately not in this plan):** §9 catalog sync cron + drift alerts (Plan 3 — it consumes this plan's pricing engine and schema); CHF "≈ X CHF" Suisse display (owner must confirm rate + rounding; belongs with the Suisse copy pass); German routing; admin UI (ops = Supabase Studio); rate limiting on public routes; city pages.

## Global Constraints

- Work in a fresh worktree from `main` (`.worktrees/plan2-commerce-core`) per superpowers:using-git-worktrees. Plan 1 is merged on `main` at `d9c3ae1`.
- App root is `myroamspot/`; existing files outside it stay untouched.
- Money is integer cents, EUR only, **TTC**. `formatEur` output must be NBSP-normalized in assertions (U+00A0).
- All user-visible strings live in `dictionaries/fr.json` — including emails and every new UI string. No hardcoded copy in components. A missing key **fails the build** (`npm run check`).
- `dictionaries/de.json` mirrors `fr.json`'s structure key-for-key (placeholder French text).
- No emoji in chrome. New UI uses the existing Apple tokens (`rounded-full` Action Blue CTAs, hairline `border-border` cards, `--muted-foreground`), never raw hex where a token exists.
- Zero secrets client-side: Supabase service key, Whop, Resend and eSIM Access are server-only imports.
- Fulfillment is triggered from the payment webhook **only**. No other path may purchase an eSIM.
- One `transactionId` per order (`order_ref`) for eSIM Access; `provider_session_id` is UNIQUE.
- Tests: `npm test`. Gate: `npm run check && npx tsc --noEmit && npm test && npm run build` — all four must exit 0 before every commit that changes behavior.
- Never run `npm run build` while a server is serving the same `.next`.
- New dependencies this plan adds: `@supabase/supabase-js`, `nanoid`. Nothing else.

## Review Focus

Failure modes the spec implies but unit tests will not exercise end-to-end. Each one's test lives in the task noted.

1. **A replayed or retried `payment.succeeded` must never issue a second eSIM.** Whop delivers at least once and retries for ~3 days; a duplicate must find the order claimed/fulfilled and stop. → Task 8 (replay + resume tests), Task 11 (repeated webhook test).
2. **A webhook with a bad signature, a stale timestamp, or an unknown session must not mutate any order.** → Task 7 (verification) + Task 11 (unknown-session test).
3. **A package that is inactive, zero-priced, or missing its eSIM Access mapping (or retired between page render and checkout) must hard-fail the checkout with a French message — never map to another package.** → Task 9.
4. **A provider outage mid-fulfillment must leave the paid order recoverable:** status stays `paid`, the attempt is recorded, the owner is alerted once, and the order is never marked `failed` while money is captured. → Task 8.
5. **A refund request after activation or with any consumed data must be refused with the CGV sentence and must not cancel the eSIM.** → Task 14.

---

### Task 1: Database contract, launch seed, and environment surface

**Files:**
- Rewrite: `myroamspot/supabase/schema.sql`
- Create: `myroamspot/supabase/seed.sql`
- Modify: `myroamspot/.env.example`
- Create: `myroamspot/src/__tests__/schema.test.ts`

**Interfaces:**
- Consumes: `PACKAGES` from `myroamspot/src/lib/packages.seed.ts` (23 rows, unchanged).
- Produces: the exact table/column names every later task queries (`packages`, `orders`, `sync_log`) and the launch seed the drift test guards.

- [ ] **Step 1: Write the failing schema/seed drift test**

`src/__tests__/schema.test.ts` — reads both SQL files as UTF-8 and asserts the contract:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PACKAGES } from "../lib/packages.seed";

const read = (p: string) => readFileSync(path.join(process.cwd(), p), "utf8");

describe("schema contract", () => {
  const schema = read("supabase/schema.sql");
  it("declares the three spec tables with RLS enabled", () => {
    for (const t of ["packages", "orders", "sync_log"]) {
      expect(schema).toContain(`create table if not exists ${t}`);
      expect(schema).toContain(`alter table ${t} enable row level security`);
    }
  });
  it("carries every column the commerce code queries", () => {
    for (const c of ["slug", "destination_slug", "name_fr", "days", "data_gb", "price_cents",
      "wholesale_net_cents", "esim_access_package_id", "active", "highlight", "updated_at"]) {
      expect(schema, `packages.${c}`).toContain(c);
    }
    for (const c of ["order_ref", "email", "package_id", "provider", "provider_session_id",
      "provider_payment_id", "amount_cents", "currency", "status", "esim_details", "created_at",
      "fulfilled_at", "fulfillment_attempts", "last_error"]) {
      expect(schema, `orders.${c}`).toContain(c);
    }
    for (const c of ["ran_at", "changes", "alert_sent"]) expect(schema, `sync_log.${c}`).toContain(c);
  });
  it("allows the full order state machine", () => {
    for (const s of ["'pending'", "'paid'", "'fulfilled'", "'failed'", "'refunded'", "'expired'"]) {
      expect(schema).toContain(s);
    }
  });
});

describe("launch seed", () => {
  const seed = read("supabase/seed.sql");
  const tuple = /^\s*\('([^']+)', '([^']+)', '([^']+)', (\d+), (\d+), (\d+), (true|false), (true|false)\),?$/gm;
  const rows = [...seed.matchAll(tuple)].map((m) => ({
    slug: m[1], destinationSlug: m[2], nameFr: m[3], days: Number(m[4]), dataGb: Number(m[5]),
    priceCents: Number(m[6]), highlight: m[7] === "true", active: m[8] === "true",
  }));
  it("has exactly one seed row per catalog package, value-for-value", () => {
    expect(rows).toHaveLength(PACKAGES.length);
    for (const p of PACKAGES) {
      expect(rows).toContainEqual({
        slug: p.slug, destinationSlug: p.destinationSlug, nameFr: p.nameFr, days: p.days,
        dataGb: p.dataGb, priceCents: p.priceCents, highlight: p.highlight ?? false, active: p.active,
      });
    }
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `cd myroamspot && npx vitest run src/__tests__/schema.test.ts`
Expected: FAIL — `supabase/seed.sql` does not exist (`ENOENT`) and `packages.slug`/`orders.expired` are absent from the schema.

- [ ] **Step 3: Rewrite `supabase/schema.sql`**

Three tables, spec §7 columns plus four justified additions (`packages.highlight` — the funnel bestseller tag reads it; `orders.provider_payment_id` — the refund API needs the `pay_...` id; `orders.fulfillment_attempts` / `orders.last_error` — ops visibility, ops = Supabase Studio). `slug` is UNIQUE because the drift test and the sync diff key on it. `sync_log` is rewritten to the spec's columns (the Plan 1 shape diverged; ledger flagged it for Plan 2).

```sql
create table if not exists packages (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text not null unique,
  destination_slug       text not null,
  name_fr                text not null,
  days                   int  not null check (days > 0),
  data_gb                int  not null check (data_gb >= 0),
  price_cents            int  not null check (price_cents >= 0),
  wholesale_net_cents    int,                      -- eSIM Access wholesale, EUR cents
  esim_access_package_id text,                     -- provider packageCode used at fulfillment
  active                 boolean not null default true,
  highlight              boolean not null default false,
  updated_at             timestamptz not null default now()
);
create index if not exists packages_destination_idx on packages (destination_slug, active, price_cents);

create table if not exists orders (
  id                   uuid primary key default gen_random_uuid(),
  order_ref            text not null unique,
  email                text not null,
  package_id           uuid not null references packages (id),
  provider             text not null check (provider in ('whop', 'paddle')),
  provider_session_id  text unique,
  provider_payment_id  text,
  amount_cents         int  not null check (amount_cents >= 0),
  currency             text not null default 'EUR' check (currency in ('EUR')),
  status               text not null default 'pending'
                       check (status in ('pending', 'paid', 'fulfilled', 'failed', 'refunded', 'expired')),
  esim_details         jsonb,
  fulfillment_attempts int  not null default 0,
  last_error           text,
  created_at           timestamptz not null default now(),
  fulfilled_at         timestamptz
);
create index if not exists orders_email_ref_idx on orders (lower(email), order_ref);

create table if not exists sync_log (
  id           bigserial primary key,
  ran_at       timestamptz not null default now(),
  changes      jsonb,
  alert_sent   boolean not null default false
);

alter table packages enable row level security;
alter table orders   enable row level security;
alter table sync_log enable row level security;
```

- [ ] **Step 4: Write `supabase/seed.sql`**

Header comment: `-- Launch catalog. Mirrors src/lib/packages.seed.ts; drift-guarded by src/__tests__/schema.test.ts.` Then ONE insert with one tuple per `PACKAGES` entry, in the seed file's order, exactly 8 columns in this order and format (single-quoted strings, bare integers, lowercase booleans, two-space indent, comma between tuples, semicolon on the last):

```sql
insert into packages (slug, destination_slug, name_fr, days, data_gb, price_cents, highlight, active) values
  ('sa-express', 'arabie-saoudite', 'Express', 10, 5, 1299, false, true),
  ...
  ('th-15j-10go', 'thailande', 'Thaïlande 15 jours', 15, 10, 1499, true, true)
on conflict (slug) do update set
  destination_slug = excluded.destination_slug, name_fr = excluded.name_fr, days = excluded.days,
  data_gb = excluded.data_gb, price_cents = excluded.price_cents, highlight = excluded.highlight,
  active = excluded.active, updated_at = now();
```

`wholesale_net_cents` and `esim_access_package_id` stay NULL at launch: the manual `price_cents` override always wins (spec §7), and both columns are filled by the Plan 3 sync.

- [ ] **Step 5: Rewrite `.env.example`**

Every server-only var from spec §11 plus the two rate/addressing vars this plan actually reads. No real values.

```
NEXT_PUBLIC_SITE_URL=https://myroamspot.com
NEXT_PUBLIC_WHATSAPP_NUMBER=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
PAYMENTS_PROVIDER=whop
WHOP_API_KEY=
WHOP_COMPANY_ID=
WHOP_WEBHOOK_SECRET=
WHOP_CURRENCY=eur
ESIM_ACCESS_BASE_URL=https://api.esimaccess.com
ESIM_ACCESS_ACCESS_CODE=
ESIM_ACCESS_SECRET_KEY=
USD_EUR_RATE=1.08
RESEND_API_KEY=
EMAIL_FROM=MyRoamSpot <contact@myroamspot.com>
OWNER_ALERT_EMAIL=
CRON_SECRET=
```

- [ ] **Step 6: Run the test and verify it passes**

Run: `npx vitest run src/__tests__/schema.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add myroamspot/supabase myroamspot/.env.example myroamspot/src/__tests__/schema.test.ts
git commit -m "feat(db): spec-exact commerce schema, drift-guarded launch seed, full env surface"
```

---

### Task 2: Pricing engine

**Files:**
- Create: `myroamspot/src/lib/pricing.ts`
- Create: `myroamspot/src/__tests__/pricing.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `PRICE_TIERS_CENTS`, `nearestTierCents(cents)`, `marginPct(priceCents, wholesaleNetCents)`, `computeAutoPriceCents(wholesaleNetCents)`, `effectivePriceCents(row)`, `usdMicrosToEurCents(usdMicros, usdPerEur)` — consumed by the Plan 3 catalog sync. Plan 2 itself does not recompute prices at checkout: `orders.amount_cents` always copies the stored, already-effective `price_cents` (manual override wins), so the buyer pays exactly what the page showed.

- [ ] **Step 1: Write the failing tests**

`src/__tests__/pricing.test.ts` pins spec §7 verbatim:

```ts
import { describe, it, expect } from "vitest";
import { PRICE_TIERS_CENTS, nearestTierCents, marginPct, computeAutoPriceCents,
  effectivePriceCents, usdMicrosToEurCents } from "../lib/pricing";

describe("pricing", () => {
  it("exposes the spec tier set, ascending", () => {
    expect(PRICE_TIERS_CENTS).toEqual([499, 799, 899, 999, 1299, 1499, 1699, 1899, 1999, 2999]);
  });
  it("snaps to the nearest tier and rounds ties up", () => {
    expect(nearestTierCents(1148)).toBe(999);    // just below the 999/1299 midpoint
    expect(nearestTierCents(1149)).toBe(1299);   // exact tie -> up
    expect(nearestTierCents(1)).toBe(499);
    expect(nearestTierCents(99999)).toBe(2999);
  });
  it("computes the margin floor on the TTC basis", () => {
    expect(marginPct(2999, 1000)).toBeCloseTo(0.6666, 3);
    expect(marginPct(2999, 0)).toBe(1);
    expect(marginPct(999, 900)).toBeCloseTo(0.0991, 3);
  });
  it("auto price = nearest tier of wholesale x 2.2", () => {
    // 900 x 2.2 = 1980 -> nearest tier 1999; margin (1999-900)/1999 = 55.0% passes
    expect(computeAutoPriceCents(900)).toBe(1999);
    // 500 x 2.2 = 1100 -> nearest tier 999; margin (999-500)/999 = 50.0% passes
    expect(computeAutoPriceCents(500)).toBe(999);
    // 1150 x 2.2 = 2530 -> nearest tier 2999 (469 away vs 531)
    expect(computeAutoPriceCents(1150)).toBe(2999);
  });
  it("bumps a floor-breaking nearest tier exactly one step up", () => {
    // 1099 x 2.2 = 2417.8 -> nearest 1999; margin (1999-1099)/1999 = 45.02% -> stays
    expect(computeAutoPriceCents(1099)).toBe(1999);
    // 1100 x 2.2 = 2420 -> nearest 1999; margin 44.97% < 45% -> bump one tier up
    expect(computeAutoPriceCents(1100)).toBe(2999);
    // 620 x 2.2 = 1364 -> 1299; margin 52.3% -> stays
    expect(computeAutoPriceCents(620)).toBe(1299);
  });
  it("returns the top tier when even it breaks the floor", () => {
    // 1700 x 2.2 = 3740 -> nearest 2999; margin 43.3% < 45% and there is no higher tier
    expect(computeAutoPriceCents(1700)).toBe(2999);
  });
  it("falls back to the manual override and reports unsellable rows", () => {
    expect(effectivePriceCents({ priceCents: 1299, wholesaleNetCents: 900 })).toBe(1299);
    expect(effectivePriceCents({ priceCents: null, wholesaleNetCents: 900 })).toBe(1999);
    expect(effectivePriceCents({ priceCents: 0, wholesaleNetCents: null })).toBeNull();
    expect(effectivePriceCents({ priceCents: null, wholesaleNetCents: null })).toBeNull();
  });
  it("converts eSIM Access micros-USD to EUR cents", () => {
    expect(usdMicrosToEurCents(18000, 1.08)).toBe(167); // $1.80 / 1.08
    expect(usdMicrosToEurCents(88000, 1.0)).toBe(880);
  });
});
```

Every expected value above is derived from the spec formula; do not "fix" an assertion to match an implementation. `computeAutoPriceCents(1100) === 2999` is the floor-bump case the spec calls out (`price < wholesale_net / 0.55` → 1999 < 2000).

- [ ] **Step 2: Run the tests and watch them fail**

Run: `npx vitest run src/__tests__/pricing.test.ts`
Expected: FAIL — cannot resolve `../lib/pricing`.

- [ ] **Step 3: Implement `src/lib/pricing.ts`**

Exact signatures: `export const PRICE_TIERS_CENTS: readonly number[]`; `export function nearestTierCents(cents: number): number`; `export function marginPct(priceCents: number, wholesaleNetCents: number): number`; `export function computeAutoPriceCents(wholesaleNetCents: number): number`; `export function effectivePriceCents(row: { priceCents: number | null; wholesaleNetCents: number | null }): number | null`; `export function usdMicrosToEurCents(usdMicros: number, usdPerEur: number): number`.

Rules (spec §7): target `= wholesaleNetCents * 2.2`; tier = nearest by absolute distance with ties rounding up; while `marginPct(tier, wholesale) < 0.45` move one tier up; if already the top tier, return it. `marginPct` returns `(price - wholesale) / price`, `1` when price is 0. `effectivePriceCents`: a positive `priceCents` always wins; else auto from a positive `wholesaleNetCents`; else `null`. `usdMicrosToEurCents = Math.round(usdMicros / 10000 / usdPerEur * 100)`.

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npx vitest run src/__tests__/pricing.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add myroamspot/src/lib/pricing.ts myroamspot/src/__tests__/pricing.test.ts
git commit -m "feat(pricing): tier snapping + 45% TTC margin floor from spec 7"
```

---

### Task 3: Supabase client and the async catalog

**Files:**
- Create: `myroamspot/src/lib/supabase.ts`
- Modify: `myroamspot/src/lib/packages.seed.ts` (extend the `Package` type only)
- Rewrite: `myroamspot/src/lib/packages.ts`
- Modify: all 12 `myroamspot/src/app/esim-*/page.tsx` (async component + `await` + ISR + JSON-LD guard)
- Modify: `myroamspot/src/components/destination-search.tsx` — the hub's cheapest-price rows are the 13th caller; it is a server component, so it becomes `async` and awaits
- Modify: `myroamspot/src/__tests__/packages.test.ts`, `myroamspot/src/__tests__/funnels.test.tsx`, `myroamspot/src/__tests__/hub.test.tsx`
- Modify: `myroamspot/package.json` (add `@supabase/supabase-js`)

**Interfaces:**
- Consumes: `PRICE_TIERS_CENTS` etc. from Task 2 are *not* needed here; `PACKAGES` from `packages.seed.ts`.
- Produces:
  - `type Package` gains three optional fields: `id?: string; wholesaleNetCents?: number; esimAccessPackageId?: string` (existing importers keep working unchanged).
  - `export type SellablePackage = Package & { id: string; esimAccessPackageId: string }`
  - `export type CatalogRow` (snake_case Supabase row)
  - `export function rowToPackage(row: CatalogRow): Package`
  - `export function selectSellable(row: CatalogRow | null): SellablePackage | null`
  - `export function isCatalogConfigured(): boolean`
  - `export function getPackages(destinationSlug: string): Promise<Package[]>`
  - `export function getPackageById(id: string): Promise<SellablePackage | null>`

- [ ] **Step 1: Write the failing tests**

Extend `packages.test.ts` (make each existing `it` `async` and `await getPackages(...)`) and add:

```ts
  it("maps a catalog row to the display package shape", () => {
    const row: CatalogRow = { id: "uuid-1", slug: "sa-complete", destination_slug: "arabie-saoudite",
      name_fr: "Complete", days: 15, data_gb: 10, price_cents: 1999, wholesale_net_cents: 900,
      esim_access_package_id: "SA_10_15", active: true, highlight: true, updated_at: "2026-10-19T00:00:00Z" };
    expect(rowToPackage(row)).toEqual({ id: "uuid-1", slug: "sa-complete", destinationSlug: "arabie-saoudite",
      nameFr: "Complete", days: 15, dataGb: 10, priceCents: 1999, wholesaleNetCents: 900,
      esimAccessPackageId: "SA_10_15", active: true, highlight: true });
  });
  it("refuses to sell inactive, zero-priced, or unmapped rows", () => {
    const base = { id: "u", slug: "s", destination_slug: "d", name_fr: "n", days: 1, data_gb: 1,
      price_cents: 999, wholesale_net_cents: null, esim_access_package_id: "PKG", active: true,
      highlight: false, updated_at: "x" };
    expect(selectSellable(base)?.id).toBe("u");
    expect(selectSellable({ ...base, active: false })).toBeNull();
    expect(selectSellable({ ...base, price_cents: 0 })).toBeNull();
    expect(selectSellable({ ...base, esim_access_package_id: null })).toBeNull();
    expect(selectSellable(null)).toBeNull();
  });
  it("falls back to the committed seed when Supabase is not configured", async () => {
    expect(isCatalogConfigured()).toBe(false);
    const sa = await getPackages("arabie-saoudite");
    expect(sa.map((p) => p.priceCents)).toEqual([1299, 1999, 2999]);
    expect(await getPackageById("any-id")).toBeNull();
  });
```

Add a second suite in the same file for the configured path. Mocks are declared with `vi.hoisted` (a plain outer variable would hit Vitest's hoisting guard) and pinned to the exact query shape:

```ts
const h = vi.hoisted(() => ({ admin: { current: null as unknown } }));
vi.mock("../lib/supabase", () => ({ getSupabaseAdmin: () => h.admin.current }));
```

The seed-fallback suite leaves `h.admin.current === null`; add a file-level `beforeEach(() => { h.admin.current = null; })` so suite order can never leak state between tests. The configured suite sets a recording fake and pins the chain:

```ts
it("queries active rows ordered by price and returns them", async () => {
  const row = /* CatalogRow: active, price_cents 899, all required fields present */;
  const calls: string[] = [];
  const chain = {
    eq(col: string, val: unknown) { calls.push(`eq:${col}=${val}`); return chain; },
    order(col: string) { calls.push(`order:${col}`); return Promise.resolve({ data: [row], error: null }); },
  };
  h.admin.current = { from: (t: string) => { calls.push(`from:${t}`); return { select: () => chain }; } };
  const packs = await getPackages("suisse");
  expect(packs[0].priceCents).toBe(899);
  expect(calls).toContain("from:packages");
  expect(calls).toContain("eq:destination_slug=suisse");
  expect(calls).toContain("eq:active=true");
  expect(calls).toContain("order:price_cents");
});
```

Also add a query-error test: `{ data: null, error: { message: "boom" } }` → `getPackages` rejects with that message (`await expect(getPackages("maroc")).rejects.toThrow("boom")`). Silently serving the seed on a DB error would hide a broken catalog behind fresh-looking prices.

- [ ] **Step 2: Run and watch them fail**

Run: `npx vitest run src/__tests__/packages.test.ts`
Expected: FAIL — `CatalogRow`, `rowToPackage`, `isCatalogConfigured`, `getPackageById` are not exported; existing tests still pass synchronously (they will need `await`).

- [ ] **Step 3: Implement**

`src/lib/supabase.ts`:

```ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
```

No `server-only` import: that package is not a dependency and the tests import this module directly. Server-only-ness is enforced by convention plus the client-component import test in Task 11.

`src/lib/packages.ts` keeps the exported name/signature `getPackages(destinationSlug): Promise<Package[]>` and the price-ascending sort in both paths. Structure: read the env (via `getSupabaseAdmin()`), and when it is `null` return the seed filter+sort; otherwise `from("packages").select("*").eq("destination_slug", slug).eq("active", true).order("price_cents")`, throw on `error`, map rows with `rowToPackage`. `getPackageById(id)` returns `selectSellable(row)` from `.eq("id", id).maybeSingle()`, and `null` when the client is `null` (without querying). `isCatalogConfigured()` returns `getSupabaseAdmin() !== null`.

`packages.seed.ts`: extend `Package` with the three optional fields; leave `PACKAGES` values untouched.

- [ ] **Step 4: Update the 12 funnel pages and the hub's destination rows**

Each `myroamspot/src/app/esim-*/page.tsx`:
- add `export const revalidate = 3600;` (catalog freshness without a redeploy; still never a per-request fetch — ISR serves the cached render),
- make the component `export default async function …()`,
- `const packs = await getPackages(destinationSlug);`,
- guard the JSON-LD: `{packs[0] && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(packs[0])) }} />}`.

Update `funnels.test.tsx`: `render(<PlansSection packs={await getPackages("suisse")} … />)` inside an async test, and `buildProductJsonLd((await getPackages("maroc"))[0])`.

`destination-search.tsx` becomes `export async function DestinationSearch()`:

```tsx
const catalogs = await Promise.all(DESTINATION_GRID_SLUGS.map((slug) => getPackages(slug.slice("esim-".length))));
// inside the map: const cheapest = catalogs[index][0];
```

`page.tsx` (the hub) needs no change — Next renders an async server component child. `hub.test.tsx` wraps both renders: `render(await DestinationSearch());` inside async `it`s (React 19 resolves an awaited async component to its element tree).

- [ ] **Step 5: Run the full test suite and verify**

Run: `npm test`
Expected: PASS — all suites, with the catalog now async in both code and tests.

- [ ] **Step 6: Verify the build still works without credentials, then commit**

Run: `npm run build`
Expected: exit 0, all funnel routes still static/ISR (seed fallback).

```bash
git add -A myroamspot
git commit -m "feat(catalog): supabase-backed async catalog with seed fallback and ISR"
```

---

### Task 4: Order lifecycle persistence, public refs, and expiry

**Files:**
- Create: `myroamspot/src/lib/order-ref.ts`
- Create: `myroamspot/src/lib/orders.repo.ts`
- Create: `myroamspot/src/__tests__/helpers/fakes.ts`
- Create: `myroamspot/src/__tests__/order-ref.test.ts`
- Create: `myroamspot/src/__tests__/orders-repo.test.ts`
- Create: `myroamspot/src/app/api/cron/expire-orders/route.ts`
- Create: `myroamspot/src/__tests__/cron-expire.test.ts`
- Create: `myroamspot/vercel.json`
- Modify: `myroamspot/package.json` (add `nanoid`)

**Interfaces:**
- Consumes: `getSupabaseAdmin()` (Task 3).
- Produces (everything later tasks depend on — names are frozen):

```ts
export type OrderStatus = "pending" | "paid" | "fulfilled" | "failed" | "refunded" | "expired";
export type EsimDetails = {
  esim_access_order_no: string | null; esim_tran_no: string | null; iccid: string | null;
  qr_png_url: string | null; smdp_address: string | null; activation_code: string | null;
};
export type OrderRow = {
  id: string; order_ref: string; email: string; package_id: string; provider: string;
  provider_session_id: string | null; provider_payment_id: string | null;
  amount_cents: number; currency: "EUR"; status: OrderStatus; esim_details: EsimDetails | null;
  fulfillment_attempts: number; last_error: string | null;
  created_at: string; fulfilled_at: string | null;
};
export type NewOrder = { orderRef: string; email: string; packageId: string; provider: "whop" | "paddle"; amountCents: number };
export type OrdersRepo = {
  create(input: NewOrder): Promise<OrderRow>;
  attachSession(orderId: string, sessionId: string): Promise<void>;
  findByRef(orderRef: string): Promise<OrderRow | null>;
  findBySession(sessionId: string): Promise<OrderRow | null>;
  findByEmailAndRef(email: string, orderRef: string): Promise<OrderRow | null>;
  claimForFulfillment(sessionId: string, paymentId: string | null): Promise<OrderRow | null>;
  saveEsimOrderNo(orderId: string, orderNo: string): Promise<void>;
  recordFulfillmentError(orderId: string, message: string): Promise<number>;
  markFulfilled(orderId: string, details: EsimDetails, nowIso: string): Promise<void>;
  markFailed(orderId: string, reason: string): Promise<void>;
  markRefunded(orderId: string): Promise<void>;
  expireStale(olderThanIso: string): Promise<number>;
};
export function createSupabaseOrdersRepo(db: SupabaseClient): OrdersRepo;
export function getOrdersRepo(): OrdersRepo | null;
export function newOrderRef(): string; // 16 chars, alphabet 0123456789ABCDEFGHJKMNPQRSTVWXYZ
```

- [ ] **Step 1: Write the failing `order-ref` test**

`newOrderRef()` → `toMatch(/^[0-9A-HJKMNP-TV-Z]{16}$/)`; 2000 calls are all unique (`new Set(...).size === 2000`). (No `I`, `L`, `O`, `U` — the alphabet is unambiguous when a human reads the token off a screen.)

- [ ] **Step 2: Write the failing repo test with a recording fake client**

`orders-repo.test.ts` builds a fake Supabase client that records the chain and returns canned rows, then pins the three safety-critical operations:

```ts
it("claims only pending/expired orders and records the payment id", async () => {
  const { db, calls } = makeRecordingDb({ row: pendingRow });
  const repo = createSupabaseOrdersRepo(db);
  const claimed = await repo.claimForFulfillment("ch_123", "pay_1");
  expect(claimed?.status).toBe("paid");
  const update = calls.find((c) => c.startsWith("update:orders"))!;
  expect(update).toContain("eq:provider_session_id=ch_123");
  expect(update).toContain("in:status=pending,expired");   // never re-claims fulfilled/refunded/failed
  expect(update).toContain("set:provider_payment_id=pay_1");
  expect(calls).toContain("select:single");                 // returns the updated row
});
it("counts a fulfillment failure atomically through the SQL function", async () => {
  const { db, calls } = makeRecordingDb({ rpcValue: 2 });
  expect(await createSupabaseOrdersRepo(db).recordFulfillmentError("order-1", "000100 server error")).toBe(2);
  expect(calls).toContain("rpc:increment_fulfillment_attempts");
  expect(calls).toContain("rpc:p_order_id=order-1");
});
it("matches a lookup on the normalized email", async () => {
  const { db, calls } = makeRecordingDb({ row: null });
  await createSupabaseOrdersRepo(db).findByEmailAndRef("  Jean@Example.FR ", "REF1");
  expect(calls).toContain("eq:email=jean@example.fr");
  expect(calls).toContain("eq:order_ref=REF1");
});
it("expireStale stamps every stale pending order and returns the count", async () => {
  const { db, calls } = makeRecordingDb({ count: 3 });
  expect(await createSupabaseOrdersRepo(db).expireStale("2026-10-18T00:00:00.000Z")).toBe(3);
  expect(calls).toContain("eq:status=pending");
  expect(calls).toContain("lt:created_at=2026-10-18T00:00:00.000Z");
});
```

Pin the fake's contract in the helper: `makeRecordingDb(result)` returns `{ db, calls }` where `calls` accumulates strings like `from:orders`, `eq:col=value`, `in:col=a,b`, `set:col=value`, `lt:col=value`, `select:*`, `select:single`, `update:orders`, `rpc:fn`, `rpc:key=value`; `makeRecordingDb({ row })` resolves `data: row`, `makeRecordingDb({ count })` resolves `data: null, count`, `makeRecordingDb({ rows })` resolves a list, `makeRecordingDb({ rpcValue })` resolves `data: rpcValue`. Also export from this helper file, for Tasks 5–14: `createMemoryOrdersRepo()` (same interface, in-memory, honours the claim rule and `recordFulfillmentError` counting), `createFakeEsim()`, `createFakeEmail()`, `createFakeProvider()`. The memory repo's `claimForFulfillment` must implement the same `pending|expired → paid` rule, otherwise the fulfillment tests would pass against a weaker fake than production.

- [ ] **Step 3: Run both and watch them fail**

Run: `npx vitest run src/__tests__/order-ref.test.ts src/__tests__/orders-repo.test.ts`
Expected: FAIL — modules do not exist.

- [ ] **Step 4: Implement `order-ref.ts` and `orders.repo.ts`**

`order-ref.ts`: `import { customAlphabet } from "nanoid"`, alphabet `"0123456789ABCDEFGHJKMNPQRSTVWXYZ"`, size 16.

`orders.repo.ts`: `createSupabaseOrdersRepo(db)` implementing the interface, snake_case in/out, and the two safety rules stated in the test above. `claimForFulfillment` = one `update` with `set { status: "paid", provider_payment_id: paymentId }` filtered by `provider_session_id` and `status in ("pending","expired")`, `.select().single()`; a `PGRST116`/no-row result resolves `null` (that is the replay path, not an error). `findByEmailAndRef` lowercases and trims the email. `recordFulfillmentError` must be atomic under concurrent webhook retries, so it calls a small SQL function added to `supabase/schema.sql` in this same commit:

```sql
create or replace function increment_fulfillment_attempts(p_order_id uuid, p_error text)
returns int language sql as $$
  update orders set fulfillment_attempts = fulfillment_attempts + 1, last_error = p_error
  where id = p_order_id returning fulfillment_attempts;
$$;
```

The repo calls `.rpc("increment_fulfillment_attempts", { p_order_id, p_error })` and returns the new count. `expireStale` = `update { status: "expired" }` where `status = "pending"` and `created_at < olderThanIso`, `.select("id")` → count of returned rows. `getOrdersRepo()` returns `createSupabaseOrdersRepo(db)` or `null` when `getSupabaseAdmin()` is `null`.

- [ ] **Step 5: Cron route + config**

`src/app/api/cron/expire-orders/route.ts`: `export async function GET(request: Request)` — reject with 401 unless `request.headers.get("authorization") === \`Bearer ${process.env.CRON_SECRET}\`` (Vercel cron sends this when `CRON_SECRET` is set). 503 when `getOrdersRepo()` is null or `CRON_SECRET` is unset. Otherwise `const expired = await repo.expireStale(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())` → `NextResponse.json({ expired })`. `export const dynamic = "force-dynamic";`

`myroamspot/vercel.json`: `{"crons": [{"path": "/api/cron/expire-orders", "schedule": "0 3 * * *"}]}`.

`cron-expire.test.ts` mocks `../../lib/orders.repo`: asserts 401 with a wrong/missing token, 503 when the repo is null, and 200 `{ expired: 2 }` with the right token, plus that the cutoff passed to `expireStale` is ~24h before now (`expect(Date.parse(cutoff)).toBeGreaterThan(Date.now() - 24.1e3 * 3600)`).

- [ ] **Step 6: Run and verify**

Run: `npx vitest run src/__tests__/order-ref.test.ts src/__tests__/orders-repo.test.ts src/__tests__/cron-expire.test.ts && npm run check && npx tsc --noEmit`
Expected: PASS, both guards clean.

- [ ] **Step 7: Commit**

```bash
git add -A myroamspot
git commit -m "feat(orders): repo seam, unguessable public refs, 24h expiry cron"
```

---

### Task 5: French transactional email

**Files:**
- Create: `myroamspot/src/lib/email.ts`
- Create: `myroamspot/src/__tests__/email.test.ts`
- Modify: `myroamspot/dictionaries/fr.json` (add `emails.*`)
- Modify: `myroamspot/dictionaries/de.json` (mirror)

**Interfaces:**
- Consumes: `formatEur` (existing), `SITE_URL` (existing), `getDictionary` (existing).
- Produces:

```ts
export type EmailSender = {
  sendOrderReceived(i: { to: string; orderRef: string; packageName: string; amountCents: number }): Promise<void>;
  sendEsimDelivered(i: { to: string; orderRef: string; qrUrl: string | null; installUrl: string | null }): Promise<void>;
  sendRefundConfirmed(i: { to: string; orderRef: string; amountCents: number }): Promise<void>;
  sendOwnerAlert(i: { subject: string; lines: string[] }): Promise<void>;
};
export function formatTemplate(text: string, vars: Record<string, string>): string;
export function createResendEmailSender(cfg: { apiKey: string; from: string; ownerEmail: string; fetchImpl?: typeof fetch }): EmailSender;
export function createNullEmailSender(): EmailSender;
export function getEmailSender(): EmailSender;   // Resend when RESEND_API_KEY is set, else null sender
```

- [ ] **Step 1: Write the failing tests**

```ts
it("interpolates and throws on a missing variable", () => {
  expect(formatTemplate("Bonjour {name}, {ref}", { name: "Jean", ref: "ABC" })).toBe("Bonjour Jean, ABC");
  expect(() => formatTemplate("{nope}", {})).toThrow(/nope/);   // a shipped "{ref}" is a bug, not a fallback
});
it("posts a French email through the Resend REST endpoint", async () => {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchImpl = (async (url: any, init: any) => { calls.push({ url, init });
    return new Response(JSON.stringify({ id: "re_1" }), { status: 200 }); }) as typeof fetch;
  const sender = createResendEmailSender({ apiKey: "re_key", from: "MyRoamSpot <contact@myroamspot.com>",
    ownerEmail: "owner@myroamspot.com", fetchImpl });
  await sender.sendEsimDelivered({ to: "client@example.fr", orderRef: "ABCD1234EFGH5678",
    qrUrl: "https://p.qrsim.net/x.png", installUrl: "https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=LPA%3A1%24rsp.example%24CODE" });
  expect(calls[0].url).toBe("https://api.resend.com/emails");
  const body = JSON.parse(String(calls[0].init.body));
  expect(body.from).toContain("MyRoamSpot");
  expect(body.to).toBe("client@example.fr");
  expect(body.subject).toMatch(/eSIM/);
  expect(body.html).toContain("https://myroamspot.com/commande/ABCD1234EFGH5678");
  expect(body.html).not.toContain("undefined");
  expect(body.text).not.toContain("undefined");   // a missing variable must throw, never ship "undefined"
});
it("routes owner alerts to the owner address and never throws on a Resend error", async () => {
  const fetchImpl = (async () => new Response("nope", { status: 500 })) as typeof fetch;
  const sender = createResendEmailSender({ apiKey: "k", from: "f@x.fr", ownerEmail: "owner@x.fr", fetchImpl });
  await expect(sender.sendOwnerAlert({ subject: "Échec", lines: ["order REF"] })).resolves.toBeUndefined();
});
it("the null sender resolves without network access", async () => {
  const sender = createNullEmailSender();
  await expect(sender.sendOrderReceived({ to: "a@b.fr", orderRef: "R", packageName: "Maroc 7 jours", amountCents: 999 })).resolves.toBeUndefined();
});
```

Email delivery must never break fulfillment: a Resend failure resolves (and, for owner alerts, logs) rather than throwing. Assert that explicitly.

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/email.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

`email.ts` builds subject/`html`/`text` from `getDictionary("fr").emails.*`; every string comes from the dictionary (subjects included). `send*` calls `POST https://api.resend.com/emails` with `Authorization: Bearer ${apiKey}`, body `{ from, to, subject, html, text }`; a non-2xx response is logged and swallowed. `sendOwnerAlert` sends to `ownerEmail` with `subject` + `lines` joined as plain text and `<br>`-joined HTML — no dictionary keys (operational, owner-facing, French by construction from the callers' strings).

`fr.json` `emails` section (keys, exact): `orderReceived.subject/heading/body/cta`, `delivered.subject/heading/bodyInstall/bodyScan/cta`, `refund.subject/heading/body`, plus `footer` (brand line, WhatsApp contact line, legal link text). Copy is written fresh in the existing dictionary tone; the only fixed strings are the order link path `/commande/{ref}` and the word "MyRoamSpot". `sendEsimDelivered` chooses `bodyInstall` when `installUrl` is present, else `bodyScan`, and always includes the `/commande/{ref}` link.

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/email.test.ts && npm run check`
Expected: PASS, key check clean (proves both dictionaries carry the new section).

- [ ] **Step 5: Commit**

```bash
git add -A myroamspot
git commit -m "feat(email): Resend REST sender with dictionary-driven French templates"
```

---

### Task 6: eSIM Access client

**Files:**
- Create: `myroamspot/src/lib/esim-access.ts`
- Create: `myroamspot/src/__tests__/esim-access.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:

```ts
export type EsimPackageRow = { packageCode: string; slug: string; name: string; priceMicrosUsd: number;
  retailPriceMicrosUsd: number; volumeBytes: number; duration: number; durationUnit: string;
  locationCode: string; speed: string | null; supportTopUpType: number; activeType: number };
export type EsimProfile = { esimTranNo: string; orderNo: string; iccid: string; qrCodeUrl: string | null;
  shortUrl: string | null; ac: string | null; smdpStatus: string; esimStatus: string;
  orderUsage: number; totalVolumeBytes: number; activateTime: string | null; expiredTime: string | null };
export class EsimAccessError extends Error {
  code: string; retryable: boolean;
  constructor(code: string, options: { message?: string; retryable: boolean });
}
export function signEsimHeaders(i: { accessCode: string; secretKey?: string; timestampMs: string; requestId: string; body: string }):
  Record<string, string>;
export type EsimAccessClient = {
  balance(): Promise<number>;
  listPackages(i?: { locationCode?: string }): Promise<EsimPackageRow[]>;
  createOrder(i: { transactionId: string; packageCode: string; count?: number; periodNum?: number }): Promise<{ orderNo: string }>;
  queryOrder(i: { orderNo: string }): Promise<EsimProfile | null>;
  queryUsage(esimTranNo: string): Promise<{ orderUsage: number; totalVolumeBytes: number } | null>;
  cancelOrder(esimTranNo: string): Promise<void>;
  provision(i: { orderNo: string }): Promise<EsimProfile>;
};
export function createEsimAccessClient(cfg: { baseUrl: string; accessCode: string; secretKey?: string;
  fetchImpl?: typeof fetch; sleepImpl?: (ms: number) => Promise<void> }): EsimAccessClient;
export function getEsimAccessClient(): EsimAccessClient | null;
export function parseLpa(ac: string | null): { smdpAddress: string | null; activationCode: string | null; installUrl: string | null };
```

- [ ] **Step 1: Write the failing tests**

Signature — the algorithm is pinned to the vendor's own reference, with a hard-coded vector so a reordering bug cannot pass:

```ts
it("signs timestamp+requestId+accessCode+body with HMAC-SHA256 hex", () => {
  const headers = signEsimHeaders({ accessCode: "TEST_ACCESS_CODE", timestampMs: "1700000000000",
    requestId: "00000000-0000-4000-8000-000000000000", body: '{"locationCode":"US"}' });
  expect(headers["RT-Signature"]).toBe("f0a76acddc415ffb1d60af3f9bfc16147bfb8e62aed160f36abcb5a9be6268a2");
  expect(headers["RT-AccessCode"]).toBe("TEST_ACCESS_CODE");
  expect(headers["RT-Timestamp"]).toBe("1700000000000");
  expect(headers["RT-RequestID"]).toBe("00000000-0000-4000-8000-000000000000");
});
it("uses ESIM_ACCESS_SECRET_KEY as the signing key when one is configured", () => {
  const a = signEsimHeaders({ accessCode: "AC", secretKey: "SK", timestampMs: "1", requestId: "r", body: "{}" });
  const b = signEsimHeaders({ accessCode: "SK", timestampMs: "1", requestId: "r", body: "{}" });
  expect(a["RT-Signature"]).toBe(b["RT-Signature"]); // same key, different identifier
  expect(a["RT-AccessCode"]).toBe("AC");
});
```

Endpoint behaviour (fake `fetchImpl` capturing `{ url, body, headers }`):

```ts
it("posts /esim/order and returns the provider order number", async () => { … expect(body).toEqual({ transactionId: "REF", packageInfoList: [{ packageCode: "SA_10_15", count: 1 }] }); });
it("maps a query response to the profile shape", async () => { … expect(profile?.iccid).toBe("89852…"); expect(profile?.qrCodeUrl).toBe("https://p.qrsim.net/x.png"); });
it("throws a coded error and marks a duplicate transaction as non-retryable", async () => {
  // success:false, errorCode "000106", errorMsg "TransactionId already exists"
  await expect(client.createOrder({ transactionId: "REF", packageCode: "P" })).rejects.toMatchObject({ code: "000106", retryable: false });
});
it("marks 5xx and network failures retryable", async () => { /* fetch rejects -> retryable: true */ });
it("provisions by polling queryOrder until an ICCID appears", async () => {
  // 2 empty responses then a filled one; assert queryOrder called 3x and sleep called twice with 3000
});
```

`parseLpa`:

```ts
it("parses an LPA string into SM-DP+ address, activation code and the Apple install URL", () => {
  const r = parseLpa("LPA:1$rsp.truphone.com$QRGZ-7K2N-9F1X");
  expect(r.smdpAddress).toBe("rsp.truphone.com");
  expect(r.activationCode).toBe("LPA:1$rsp.truphone.com$QRGZ-7K2N-9F1X");
  expect(r.installUrl).toBe("https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=" + encodeURIComponent("LPA:1$rsp.truphone.com$QRGZ-7K2N-9F1X"));
});
it("returns nulls for an absent or malformed ac", () => {
  expect(parseLpa(null)).toEqual({ smdpAddress: null, activationCode: null, installUrl: null });
  expect(parseLpa("not-an-lpa").smdpAddress).toBeNull();
  expect(parseLpa("not-an-lpa").activationCode).toBe("not-an-lpa"); // still usable as carddata
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/esim-access.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

All endpoints POST to `${baseUrl}/api/v1/open<path>` with the signed headers and a JSON body. Response envelope `{ success, errorCode, errorMsg, obj }` — `success === true` returns `obj`, otherwise throw `EsimAccessError` with `code`, `message = `${errorCode} ${errorMsg}``, and `retryable = !["000106", "000107", "000105"].includes(code)` (validation/duplicate codes are not automatically retryable; everything else — including network errors and 5xx — is). `provision` polls `queryOrder` up to 5 times with `sleepImpl(3000)`, returning the first profile with a non-empty `iccid`, and throws a retryable `EsimAccessError("PROVISION_TIMEOUT")` otherwise (the spec's 3s × 4–5 retry guidance from the vendor's own reference). `getEsimAccessClient()` returns `null` unless `ESIM_ACCESS_ACCESS_CODE` is set; base URL defaults to `https://api.esimaccess.com`.

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/esim-access.test.ts && npx tsc --noEmit`
Expected: PASS, clean.

- [ ] **Step 5: Commit**

```bash
git add myroamspot/src/lib/esim-access.ts myroamspot/src/__tests__/esim-access.test.ts
git commit -m "feat(esim): signed eSIM Access client with coded, retry-classified errors"
```

---

### Task 7: Payments seam and the Whop provider

**Files:**
- Create: `myroamspot/src/lib/payments/types.ts`
- Create: `myroamspot/src/lib/payments/whop.ts`
- Create: `myroamspot/src/lib/payments/adapter.ts`
- Create: `myroamspot/src/__tests__/payments-whop.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:

```ts
export type CheckoutInput = { orderRef: string; amountCents: number; email: string;
  title: string; description: string; redirectUrl: string; metadata: Record<string, string> };
export type CheckoutSession = { url: string; sessionId: string };
export type WebhookEvent = { type: string; sessionId: string | null; paymentId: string | null;
  orderRef: string | null; currency: string | null };
export class PaymentError extends Error { retryable: boolean;
  constructor(message: string, options: { retryable: boolean }) }
export class WebhookVerificationError extends Error {}
export type PaymentProvider = { id: "whop" | "paddle";
  createCheckout(i: CheckoutInput): Promise<CheckoutSession>;
  parseWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookEvent>;
  refund(i: { paymentId: string; amountCents: number }): Promise<{ refundId: string }> };
export function createWhopProvider(cfg: { apiKey: string; companyId: string; webhookSecret: string;
  currency?: string; fetchImpl?: typeof fetch; now?: () => number }): PaymentProvider;
export function isPaymentsConfigured(): boolean;
export function getPaymentProvider(providerId: string): PaymentProvider | null;
```

- [ ] **Step 1: Write the failing tests**

Signature verification (Standard Webhooks, pinned to a hard-coded vector — the secret below is 64 hex chars, the shape Whop issues as `ws_…`):

```ts
const secret = "ws_" + "00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff";
const body = JSON.stringify({ type: "payment.succeeded" });
const headers = { "webhook-id": "msg_test123", "webhook-timestamp": "1700000000",
  "webhook-signature": "v1,GdoWZbZPBcwLKghkcQMAXVnE8KZDrcgRwijbu0znvrQ=" };

it("accepts a correctly signed event and extracts the join keys", async () => {
  const ev = await provider({ now: () => 1700000000000 }).parseWebhook(body, headers);
  expect(ev).toMatchObject({ type: "payment.succeeded", sessionId: "ch_123", paymentId: "pay_123", orderRef: "REF123" });
});
it("rejects a tampered body, a wrong prefix, and a stale timestamp", async () => {
  await expect(p.parseWebhook(body + " ", headers)).rejects.toBeInstanceOf(WebhookVerificationError);
  await expect(p.parseWebhook(body, { ...headers, "webhook-signature": "v2,AAAA" })).rejects.toBeInstanceOf(WebhookVerificationError);
  await expect(provider({ now: () => 1700001000000 }).parseWebhook(body, headers)).rejects.toBeInstanceOf(WebhookVerificationError); // >5 min
});
```

The fixture body must be the *full* Whop envelope in the other tests — pin it once at the top of the file:

```json
{ "id": "msg_test123", "type": "payment.succeeded", "data": { "id": "pay_123",
  "checkout_configuration_id": "ch_123", "metadata": { "order_ref": "REF123" },
  "currency": "eur" } }
```

Note for the implementer: the signature header in the first test was computed over the *short* body `{"type":"payment.succeeded"}`, so that test's provider instance uses that body; the full-envelope fixture gets its signature computed in-test with the same helper (`createHmac` over `${id}.${ts}.${body}` keyed by the hex-decoded secret) — that keeps the fixture honest while the hard-coded vector above pins the derivation.

Key derivation is tolerant by design: try the secret's remainder (after stripping `ws_`/`whsec_`) as hex, then as base64, then as raw UTF-8; accept if any candidate matches, constant-time (`crypto.timingSafeEqual`). Reject if none do. This is why the derivation does not need to be guessed before the live webhook exists.

Checkout creation:

```ts
it("creates a one-off EUR checkout configuration that expires with our 24h window", async () => {
  await p.createCheckout({ orderRef: "REF123", amountCents: 1999, email: "a@b.fr", title: "MyRoamSpot — Complete",
    description: "Complete · 15 j · 10 Go", redirectUrl: "https://myroamspot.com/commande/REF123",
    metadata: { order_ref: "REF123" } });
  const body = JSON.parse(String(calls[0].init.body));
  expect(calls[0].url).toBe("https://api.whop.com/api/v1/checkout_configurations");
  expect((calls[0].init.headers as Record<string,string>).Authorization).toBe("Bearer whop_key");
  expect(body.plan.company_id).toBe("biz_1");
  expect(body.plan.initial_price).toBe(19.99);          // currency units, not cents
  expect(body.plan.currency).toBe("eur");
  expect(body.plan.expiration_days).toBe(1);
  expect(body.plan.force_create_new_plan).toBe(true);
  expect(body.plan.product.redirect_purchase_url).toBe("https://myroamspot.com/commande/REF123");
  expect(body.mode).toBe("payment");
  expect(body.redirect_url).toBe("https://myroamspot.com/commande/REF123");
  expect(body.metadata.order_ref).toBe("REF123");
  // response { id: "ch_123", purchase_url: "https://whop.com/checkout/ch_123" } maps to:
  expect(session).toEqual({ url: "https://whop.com/checkout/ch_123", sessionId: "ch_123" });
});
it("reports provider failures as retryable or not", async () => { /* 500 -> retryable true; 401 -> false */ });
```

Refund: `POST https://api.whop.com/api/v1/payments/pay_123/refund` with body `{ partial_amount: 19.99 }`.

Adapter: `isPaymentsConfigured()` is true only when `PAYMENTS_PROVIDER` is not `"paddle"` and `WHOP_API_KEY`, `WHOP_COMPANY_ID` and `WHOP_WEBHOOK_SECRET` are all set. `getPaymentProvider(id)` returns a Whop provider when `id === (process.env.PAYMENTS_PROVIDER ?? "whop")` and `WHOP_WEBHOOK_SECRET` is set; otherwise `null`. It builds the provider with `currency: process.env.WHOP_CURRENCY ?? "eur"`. Assert both with `vi.stubEnv`.

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/payments-whop.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

`parseWebhook` reads `webhook-id`, `webhook-timestamp`, `webhook-signature`; requires `v1,<base64>` (first entry of a space-separated list is enough); rejects when `|now - timestamp| > 300s`; returns `{ type, sessionId: data.checkout_configuration_id ?? null, paymentId: data.id ?? null, orderRef: data.metadata?.order_ref ?? null, currency: data.currency ?? null }`. Unknown types are returned as-is (the route decides).

`createCheckout` returns `{ url: purchase_url, sessionId: id }` and throws `PaymentError` on a non-2xx (`retryable = status >= 500`).

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/payments-whop.test.ts && npx tsc --noEmit`
Expected: PASS, clean.

- [ ] **Step 5: Commit**

```bash
git add myroamspot/src/lib/payments myroamspot/src/__tests__/payments-whop.test.ts
git commit -m "feat(payments): provider seam + Whop checkout/webhook/refund adapter"
```

---

### Task 8: Fulfillment orchestration

**Files:**
- Create: `myroamspot/src/lib/fulfillment.ts`
- Create: `myroamspot/src/__tests__/fulfillment.test.ts`

**Interfaces:**
- Consumes: `OrdersRepo`, `OrderRow`, `EsimDetails` (Task 4); `EsimAccessClient`, `parseLpa` (Task 6); `EmailSender` (Task 5); `getPackageById` (Task 3).
- Produces:

```ts
export type FulfillmentOutcome = "fulfilled" | "already_fulfilled" | "ignored" | "retry" | "mismatch";
export function createFulfillment(deps: {
  repo: OrdersRepo;
  catalog: { getPackageById(id: string): Promise<SellablePackage | null> };
  esim: EsimAccessClient;
  email: EmailSender;
  now?: () => Date;
}): {
  onPaymentSucceeded(i: { sessionId: string; paymentId: string | null; orderRef: string | null }): Promise<FulfillmentOutcome>;
  onPaymentFailed(i: { sessionId: string }): Promise<void>;
};
```

- [ ] **Step 1: Write the failing tests** (memory repo + fakes from Task 4's helper)

Each test names the failure mode it protects:

```ts
it("fulfills a paid order end to end and emails the delivery link", async () => {
  // seed memory repo with a pending order (session ch_1), claim it, assert:
  // outcome "fulfilled"; esim.createOrder called once with { transactionId: order_ref, packageCode: "SA_10_15" };
  // repo row status "fulfilled" with esim_details.iccid set; email.sendEsimDelivered called once with installUrl null (ac absent) or set
});
it("is idempotent: a replay of the same payment never buys a second eSIM", async () => {
  await f.onPaymentSucceeded(pay); await f.onPaymentSucceeded(pay);
  expect(esim.createOrder).toHaveBeenCalledOnce();          // and outcome 2 === "already_fulfilled"
});
it("resumes a paid order that already has a provider order number without re-purchasing", async () => {
  // row status "paid", esim_details.esim_access_order_no "B123" -> outcome "fulfilled", createOrder NOT called, queryOrder called
});
it("leaves a paid order reclaimable when the provider fails, alerts the owner once", async () => {
  esim.createOrder.mockRejectedValueOnce(new EsimAccessError("000100", { retryable: true }));
  expect(await f.onPaymentSucceeded(pay)).toBe("retry");
  expect(row.status).toBe("paid");                          // never "failed" while money is captured
  expect(row.fulfillment_attempts).toBe(1);
  expect(row.last_error).toMatch(/000100/);
  expect(email.sendOwnerAlert).toHaveBeenCalledOnce();      // and only once across a second failure
  await f.onPaymentSucceeded(pay);
  expect(email.sendOwnerAlert).toHaveBeenCalledOnce();
});
it("fulfills an order that was expired when the money arrived, and flags it to the owner", async () => {
  // row status "expired" -> outcome "fulfilled", owner alerted
});
it("refuses to act when the webhook metadata names a different order", async () => {
  expect(await f.onPaymentSucceeded({ sessionId: "ch_1", paymentId: "pay_1", orderRef: "OTHER" })).toBe("mismatch");
  expect(esim.createOrder).not.toHaveBeenCalled();
});
it("ignores an unknown session without touching anything", async () => {
  expect(await f.onPaymentSucceeded({ sessionId: "ch_unknown", paymentId: "pay_x", orderRef: null })).toBe("ignored");
});
it("marks a failed payment as failed without an eSIM purchase", async () => {
  await f.onPaymentFailed({ sessionId: "ch_1" });
  expect(row.status).toBe("failed"); expect(esim.createOrder).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/fulfillment.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

`onPaymentSucceeded` order of operations, exactly:
1. `repo.claimForFulfillment(sessionId, paymentId)`; if `null` → `repo.findBySession(sessionId)`:
   - no row → `"ignored"` (never fulfill an unknown session),
   - `status === "fulfilled"` → `"already_fulfilled"`,
   - `status === "paid"` → continue (retry path),
   - anything else → `"ignored"`.
2. metadata guard: if `orderRef` is non-null and differs from `row.order_ref` → owner alert + `"mismatch"` (no purchase).
3. if the claim moved an `expired` row → owner alert (`alerte: commande payée après expiration`).
4. `catalog.getPackageById(row.package_id)`; missing/unsellable → owner alert + `"retry"` (retried by the provider loop), never a purchase.
5. if `row.esim_details?.esim_access_order_no` is null → `esim.createOrder({ transactionId: row.order_ref, packageCode: pkg.esimAccessPackageId })`, then `repo.saveEsimOrderNo` **immediately**.
6. `esim.provision({ orderNo })` → profile.
7. `parseLpa(profile.ac)` → `EsimDetails` (`esim_tran_no`, `iccid`, `qr_png_url = profile.qrCodeUrl`, `smdp_address`, `activation_code`).
8. `repo.markFulfilled(row.id, details, now().toISOString())`.
9. `email.sendEsimDelivered({ to: row.email, orderRef: row.order_ref, qrUrl: details.qr_png_url, installUrl: parseLpa(...).installUrl })` → `"fulfilled"`.
Any thrown error from steps 5–8 → `repo.recordFulfillmentError(row.id, message)`, owner alert **only when the returned attempt count is 1**, and the call itself throws so the route can answer 500 (the provider retries; the order stays `paid`).

`onPaymentFailed`: `findBySession` → `markFailed` when the row is still `pending` (never overwrite `fulfilled`/`refunded`).

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/fulfillment.test.ts && npx tsc --noEmit`
Expected: PASS, clean.

- [ ] **Step 5: Commit**

```bash
git add myroamspot/src/lib/fulfillment.ts myroamspot/src/__tests__/fulfillment.test.ts
git commit -m "feat(fulfillment): idempotent paid-order pipeline with owner alerts"
```

---

### Task 9: Checkout API

**Files:**
- Create: `myroamspot/src/app/api/checkout/route.ts`
- Create: `myroamspot/src/lib/validate.ts`
- Create: `myroamspot/src/__tests__/checkout-api.test.ts`
- Create: `myroamspot/src/__tests__/validate.test.ts`

**Interfaces:**
- Consumes: `getPackageById`, `isCatalogConfigured` (Task 3); `getOrdersRepo`, `newOrderRef` (Task 4); `getPaymentProvider`, `isPaymentsConfigured` (Task 7); `getEmailSender` (Task 5); `SITE_URL` (existing).
- Produces: `POST` contract the checkout modal (Task 10) consumes; the shared validators `export function isEmail(value: string): boolean`, `isUuid(value: string): boolean`, `isOrderRef(value: string): boolean` in `src/lib/validate.ts` (Task 13 reuses `isEmail`/`isOrderRef` instead of re-implementing them).

- [ ] **Step 1: Write the failing tests**

Mock `../../../lib/packages`, `../../../lib/orders.repo`, `../../../lib/payments/adapter`, `../../../lib/email` and call the exported `POST` with a `new Request("http://localhost/api/checkout", { method: "POST", body: JSON.stringify({...}) })`:

```ts
it("creates a pending order with an unguessable ref and returns the provider URL", async () => {
  const res = await POST(req({ email: "  Jean@Example.FR ", packageId: "pkg-uuid" }));
  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ url: "https://whop.com/checkout/ch_1" });
  expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ email: "jean@example.fr", packageId: "pkg-uuid", amountCents: 1999, provider: "whop" }));
  expect(repo.create.mock.calls[0][0].orderRef).toMatch(/^[0-9A-HJKMNP-TV-Z]{16}$/);
  expect(repo.attachSession).toHaveBeenCalledWith("order-1", "ch_1");
  expect(provider.createCheckout).toHaveBeenCalledWith(expect.objectContaining({ amountCents: 1999, orderRef: expect.any(String), redirectUrl: expect.stringContaining("/commande/") }));
});
it("rejects a bad request before touching the database", async () => {
  expect((await POST(req({ email: "nope", packageId: "pkg-uuid" }))).status).toBe(400);
  expect((await POST(req({ email: "a@b.fr", packageId: "not-a-uuid" }))).status).toBe(400);
  expect(repo.create).not.toHaveBeenCalled();
});
it("returns 501 and creates nothing when the provider is not configured", async () => {
  vi.mocked(isPaymentsConfigured).mockReturnValue(false);
  const res = await POST(req({ email: "a@b.fr", packageId: "pkg-uuid" }));
  expect(res.status).toBe(501);
  expect(await res.json()).toEqual({ error: "payments_not_configured" });
  expect(repo.create).not.toHaveBeenCalled();
});
it("returns 503 when the catalog or database is unavailable", async () => { /* isCatalogConfigured false -> 503 catalog_unavailable; repo null -> 503 */ });
it("hard-fails a package that is not sellable, without creating an order", async () => {
  vi.mocked(getPackageById).mockResolvedValue(null);   // inactive, zero-priced, unmapped or retired
  const res = await POST(req({ email: "a@b.fr", packageId: "pkg-uuid" }));
  expect(res.status).toBe(409);
  expect(await res.json()).toEqual({ error: "package_unavailable" });
  expect(repo.create).not.toHaveBeenCalled();
});
it("returns 502 when the provider call fails", async () => { /* createCheckout rejects -> 502 provider_error */ });
it("sends the order-received email after the order exists", async () => { /* email.sendOrderReceived called once, after repo.create */ });
```

`validate.test.ts` pins the three shapes (they are shared with Task 13, so write them once):

```ts
it("validates email, uuid and order-ref shapes", () => {
  expect(isEmail("jean@example.fr")).toBe(true);
  expect(isEmail("  jean@example.fr ")).toBe(false);      // callers trim first
  expect(isEmail("nope")).toBe(false);
  expect(isUuid("7b1f2c3d-4e5a-4b6c-8d7e-8f9a0b1c2d3e")).toBe(true);
  expect(isUuid("pkg-uuid")).toBe(false);
  expect(isOrderRef("ABCD1234EFGH5678")).toBe(true);
  expect(isOrderRef("abcd1234efgh5678")).toBe(false);     // alphabet is uppercase
  expect(isOrderRef("SHORT")).toBe(false);
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/checkout-api.test.ts src/__tests__/validate.test.ts`
Expected: FAIL — route does not exist.

- [ ] **Step 3: Implement**

`export const runtime = "nodejs";` Create `src/lib/validate.ts` first (it is the only new module this task adds besides the route): `isEmail` → `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, `isUuid` → `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`, `isOrderRef` → `/^[0-9A-HJKMNP-TV-Z]{16}$/`. The route trims the email and lowercases it **before** validating and storing (the test's `"  Jean@Example.FR "` must arrive as `jean@example.fr`). Order: validate → configured checks → sellable check → create order → `getPaymentProvider("whop")`-equivalent (`getPaymentProvider(process.env.PAYMENTS_PROVIDER ?? "whop")`) → `createCheckout` with `title: \`${BRAND} — ${pkg.nameFr}\``, `description: \`${pkg.nameFr} · ${pkg.days} j · ${pkg.dataGb} Go\``, `redirectUrl: \`${SITE_URL}/commande/${orderRef}\``, `metadata: { order_ref: orderRef, package_slug: pkg.slug }` → `attachSession` → `sendOrderReceived` → `{ url, orderRef }`. Errors are logged with the order ref; the order stays `pending` for the expiry cron.

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/checkout-api.test.ts && npx tsc --noEmit`
Expected: PASS, clean.

- [ ] **Step 5: Commit**

```bash
git add myroamspot/src/app/api/checkout myroamspot/src/__tests__/checkout-api.test.ts
git commit -m "feat(checkout): guest checkout API with 501/503/409/502 guard rails"
```

---

### Task 10: Checkout UI on the funnel pages

**Files:**
- Create: `myroamspot/src/components/funnel/checkout-modal.tsx`
- Modify: `myroamspot/src/components/funnel/plan-card.tsx` (add `onBuy?`)
- Modify: `myroamspot/src/components/funnel/plans-section.tsx` (own `checkoutPack`, render modal)
- Modify: `myroamspot/dictionaries/fr.json` + `dictionaries/de.json` (`checkout.*`)
- Create: `myroamspot/src/__tests__/checkout-modal.test.tsx`
- Modify: `myroamspot/src/__tests__/plan-card.test.tsx` (one added test)

**Interfaces:**
- Consumes: `POST /api/checkout` (Task 9) via `fetch`.
- Produces: `PlanCard` prop `onBuy?: () => void` (the CTA button's `onClick`); `CheckoutModal({ pack, open, onClose }: { pack: Package | null; open: boolean; onClose: () => void })`.

- [ ] **Step 1: Write the failing tests**

`plan-card.test.tsx` addition: clicking the CTA calls `onBuy` (`fireEvent.click(screen.getByRole("button", { name: /Commander/ }))` → `expect(onBuy).toHaveBeenCalledOnce()`), and the zero-price card still renders no button.

`checkout-modal.test.tsx`:

```ts
it("keeps submit disabled until an email is typed and the CGV are accepted", () => { /* type email, checkbox, submit enabled */ });
it("posts email + package id and redirects to the provider URL", async () => {
  // vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ url: "https://whop.com/checkout/ch_1" }), { status: 200 })));
  // const assign = vi.fn(); vi.stubGlobal("location", { assign }); // or pass window.location via a `redirect` prop default
  // submit -> expect(assign).toHaveBeenCalledWith("https://whop.com/checkout/ch_1")
});
it("shows the French activation notice with the WhatsApp fallback on 501", async () => { /* assert the dict string "Paiement en cours d'activation" + a wa.me link */ });
it("shows a recoverable French error on 409 and keeps the modal open", async () => { /* "Ce forfait n'est plus disponible" */ });
it("renders nothing when closed", () => { /* queryByRole("dialog") === null */ });
```

The modal exposes the provider URL redirect through an injectable prop (`redirect?: (url: string) => void`, defaulting to `window.location.assign`) so the test never has to fight jsdom navigation.

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/checkout-modal.test.tsx src/__tests__/plan-card.test.tsx`
Expected: FAIL — `checkout-modal` missing; `onBuy` not a prop.

- [ ] **Step 3: Implement**

`PlanCard`: `onBuy?: () => void` on the CTA's `onClick`.

`CheckoutModal`: follows the existing `compatibility-modal.tsx` conventions (same overlay/panel structure, Escape + backdrop close, `data-testid="checkout-modal"`), Apple tokens only: white hairline panel, `CheckoutModal` heading (`checkout.title`), the package line (`nameFr` + `formatEur(priceCents)` — reuse `formatEur`, do not reimplement), email input (`type="email"`, `autoComplete="email"`, label `checkout.emailLabel`), CGV checkbox linking `/cgv` (`checkout.cgvLabel`), Action Blue pill submit (`checkout.submit`), and a status line. On submit: `fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packageId: pack.id, email }) })`; 200 → redirect; 501/503 → `checkout.notConfigured` + a WhatsApp deep link built from `WHATSAPP_NUMBER`; 409 → `checkout.packageUnavailable`; anything else → `checkout.error`. Disable the submit while in flight (`checkout.submitting`).

`PlansSection`: `const [checkoutPack, setCheckoutPack] = useState<Package | null>(null)`, pass `onBuy={() => setCheckoutPack(pack)}`, render the modal once. Note: `pack.id` is undefined in the seed-fallback path — the modal must submit `pack.id ?? ""` and the API answers 400; add a `disabled` guard when `!pack.id` with the `checkout.notConfigured` copy, keeping local dev honest.

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/checkout-modal.test.tsx src/__tests__/plan-card.test.tsx src/__tests__/funnels.test.tsx && npm run check && npx tsc --noEmit`
Expected: PASS (existing plan-card and funnel pins unchanged), guards clean.

- [ ] **Step 5: Commit**

```bash
git add -A myroamspot
git commit -m "feat(checkout-ui): guest email + CGV modal wired to the checkout API"
```

---

### Task 11: Payment webhook route

**Files:**
- Create: `myroamspot/src/app/api/webhooks/[provider]/route.ts`
- Create: `myroamspot/src/__tests__/webhook-api.test.ts`

**Interfaces:**
- Consumes: `getPaymentProvider` (Task 7), `getOrdersRepo` (Task 4), `getPackageById` (Task 3), `getEsimAccessClient` (Task 6), `getEmailSender` (Task 5), `createFulfillment` (Task 8).
- Produces: the endpoint registered in Whop → `https://myroamspot.com/api/webhooks/whop`.

- [ ] **Step 1: Write the failing tests**

```ts
it("acks an event for an unknown type without touching any order", async () => { /* type "payout.created" -> 200 {ok:true} */ });
it("rejects a bad signature with 401 and no side effects", async () => { /* parseWebhook throws WebhookVerificationError */ });
it("404s an unconfigured provider segment", async () => { /* getPaymentProvider mocked null */ });
it("503s when the database or eSIM client is unavailable", async () => { /* repo null -> 503; esim null -> 503 */ });
it("fulfills on payment.succeeded and acks 200", async () => { /* outcome "fulfilled" -> 200; fulfillment called with {sessionId, paymentId, orderRef} */ });
it("returns 500 on a retryable fulfillment failure so the provider retries", async () => { /* outcome "retry" -> 500 { error: "fulfillment_retry" } */ });
it("acks 200 on replay and on mismatch", async () => { /* "already_fulfilled" | "ignored" | "mismatch" -> 200 */ });
it("marks the order failed on payment.failed and acks 200", async () => { /* onPaymentFailed called */ });
```

Also a source-level test that no client module reaches the server seams:

```ts
it("never imports server-only modules from a client file", () => {
  const serverOnly = ["supabase", "packages", "orders.repo", "esim-access", "email", "fulfillment", "refunds", "payments/whop"];
  for (const f of globSync("src/**/*.tsx")) {
    const src = readFileSync(f, "utf8");
    if (!src.includes('"use client"')) continue;   // directive may sit after a comment
    for (const mod of serverOnly) {
      // exact specifier: `lib/packages.seed` (types only) is allowed, `lib/packages` is not
      const imp = new RegExp(`from ["'][^"']*/lib/${mod.replace(".", "\\.")}["']`);
      expect(src, `${f} imports lib/${mod}`).not.toMatch(imp);
    }
  }
});
```

(`globSync` from `node:fs`, paths relative to `process.cwd()` — the app root.)

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/webhook-api.test.ts`
Expected: FAIL — route does not exist.

- [ ] **Step 3: Implement**

`export const runtime = "nodejs"; export const maxDuration = 60; export const dynamic = "force-dynamic";`

`POST(request, { params })`:
1. `const { provider: providerId } = await params;` → `getPaymentProvider(providerId)`; null → 404.
2. `const raw = await request.text();` (raw bytes — parsing first breaks the signature) → `provider.parseWebhook(raw, Object.fromEntries(request.headers))`; `WebhookVerificationError` → 401.
3. `payment.failed` → build fulfillment with the live deps and `await onPaymentFailed({ sessionId })` → 200.
4. `payment.succeeded` → `sessionId` null → 400 `unknown_session`; else map the outcome: `"retry"` → 500 `{ error: "fulfillment_retry" }`, everything else → 200 `{ ok: true }`.
5. All other types → 200 `{ ok: true }` (never 4xx an event we simply do not handle — it would be retried for days).

Fulfillment runs synchronously so a retryable failure can surface as a 5xx and earn a provider retry; Whop's 5-second expectation may lapse on provisioning, which is harmless because every attempt is idempotent.

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/webhook-api.test.ts && npx tsc --noEmit`
Expected: PASS, clean.

- [ ] **Step 5: Commit**

```bash
git add myroamspot/src/app/api/webhooks myroamspot/src/__tests__/webhook-api.test.ts
git commit -m "feat(webhook): signature-verified, idempotent Whop fulfillment endpoint"
```

---

### Task 12: Order status page and polling API

**Files:**
- Create: `myroamspot/src/app/api/orders/[order_ref]/route.ts`
- Create: `myroamspot/src/app/commande/[order_ref]/page.tsx`
- Create: `myroamspot/src/components/order/delivery-card.tsx`
- Create: `myroamspot/src/components/order/copy-field.tsx`
- Create: `myroamspot/src/components/order/order-poller.tsx`
- Modify: dictionaries (`order.*`)
- Create: `myroamspot/src/__tests__/order-status.test.tsx`

**Interfaces:**
- Consumes: `getOrdersRepo` (Task 4), `parseLpa` (Task 6).
- Produces: `GET /api/orders/{order_ref}` → `{ status: OrderStatus; esim: { qr_png_url: string | null; smdp_address: string | null; activation_code: string | null; iccid: string | null; install_url: string | null } | null }`; components `<DeliveryCard details={EsimDetails} />`, `<CopyField label value />`, `<OrderPoller orderRef initialStatus redirect? />`.

- [ ] **Step 1: Write the failing tests**

API (`order-status.test.tsx` or a sibling `.test.ts`): unknown ref → 404; known ref → 200 with the exact shape above and **no email field** (`expect(Object.keys(body)).not.toContain("email")` — a public token must not leak the address); `install_url` computed from `activation_code` via `parseLpa`.

Component:
```ts
it("shows the preparation copy while the order is pending", () => { /* "préparation de votre eSIM" (spec 8.2) */ });
it("cancels the spinner: polls, then refreshes once the status changes", async () => {
  // vi.useFakeTimers(); fetch mock returns pending then fulfilled
  // await vi.advanceTimersByTimeAsync(3000); expect(redirect/refresh).toHaveBeenCalledOnce();
});
it("renders QR, SM-DP+ address and activation code with copy buttons", () => {
  render(<DeliveryCard details={fulfilledDetails} />);
  expect(screen.getByRole("img", { name: /QR/i })).toBeInTheDocument();
  expect(screen.getByText("rsp.truphone.com")).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /Copier/i })).toHaveLength(2);
});
it("offers the Apple one-click install only when an LPA string exists", () => {
  // with activation_code -> link href startsWith https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=
  // with null -> not rendered, scan instructions still shown
});
it("copy writes the value to the clipboard and confirms in French", async () => { /* navigator.clipboard.writeText spy; button label flips to "Copié" */ });
```

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/order-status.test.tsx`
Expected: FAIL — routes and components do not exist.

- [ ] **Step 3: Implement**

API: repo null → 503 `{ error: "unavailable" }`; `findByRef` null → 404; otherwise 200 with the shape above (never `email`, never `esim_tran_no`, never `esim_access_order_no`).

Page: `export default async function CommandePage({ params }: { params: Promise<{ order_ref: string }> })`; `const { order_ref } = await params;` → repo lookup; null repo → render the `order.unavailable` notice; `notFound()` when the ref is unknown. Status switch renders: `pending` → `order.pendingTitle/pendingBody` (exact spec copy: "préparation de votre eSIM…") + `<OrderPoller>`; `paid` → the same pending card with `order.pendingSlow`; `fulfilled` → `<DeliveryCard details={order.esim_details} />` with `order.deliveredTitle`; `failed`/`refunded`/`expired` → their French cards + the WhatsApp help line. `export const dynamic = "force-dynamic";` (a public order page must never be cached).

`DeliveryCard`: QR `<img>` (`order.qrAlt`, `unoptimized`, plain `img` like the flags), `CopyField` for the SM-DP+ address and the activation code (each rendered only when non-null), the CGV-accurate notice, the Apple install link (only with `install_url`), iOS/Android instruction lists from `order.instructions.{ios,android}` (array of steps in the dictionary). It renders the customer-facing fields only — never `esim_tran_no` or `esim_access_order_no`.

`OrderPoller`: `"use client"`; interval 3s while `pending|paid`; `fetch(\`/api/orders/${orderRef}\`)`; on a status change call `refresh()` (injectable, defaults to `useRouter().refresh()`); after 60s keep polling at 15s and render `order.helpLine`; always clear the interval on unmount.

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/order-status.test.tsx && npm run check && npx tsc --noEmit`
Expected: PASS, guards clean.

- [ ] **Step 5: Commit**

```bash
git add -A myroamspot
git commit -m "feat(delivery): public order page with QR/activation code and live polling"
```

---

### Task 13: Order lookup (`/mes-esims`)

**Files:**
- Create: `myroamspot/src/app/api/orders/lookup/route.ts`
- Create: `myroamspot/src/app/mes-esims/page.tsx`
- Create: `myroamspot/src/components/order/lookup-form.tsx`
- Modify: dictionaries (`lookup.*`)
- Create: `myroamspot/src/__tests__/lookup.test.tsx`

**Interfaces:**
- Consumes: `getOrdersRepo` (Task 4); `isEmail`, `isOrderRef` (Task 9).
- Produces: `POST /api/orders/lookup` → `{ found: true; orderRef: string; status: OrderStatus } | { found: false }`; `<LookupForm redirect? />`.

- [ ] **Step 1: Write the failing tests**

```ts
it("finds an order by normalized email + token", async () => { /* 200 {found:true, orderRef, status:"fulfilled"} */ });
it("answers identically for a wrong email and a wrong token", async () => {
  expect(await post({ email: "a@b.fr", orderRef: "WRONG" })).toEqual({ found: false });
  expect(await post({ email: "other@b.fr", orderRef: "REF" })).toEqual({ found: false });
  // same status code and body shape in both cases: no enumeration signal
});
it("rejects malformed input with 400", async () => { /* email without @, ref with "/" or spaces */ });
it("renders the lookup page in French and navigates to the order on success", async () => { /* RTL: labels from lookup.*, submit -> redirect called with /commande/REF */ });
```

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/lookup.test.tsx`
Expected: FAIL — routes/components do not exist.

- [ ] **Step 3: Implement**

API: validate (`orderRef` must match `/^[0-9A-HJKMNP-TV-Z]{16}$/`, email the same regex as checkout — reject invalid shape with 400, never with a "not found"); repo null → 503; normalize email (trim + lowercase, the repo does it again); always 200 `{ found: boolean, … }`.

Page: `export const metadata = { title: … }` from the dictionary, an Apple-style hairline card with the form (`lookup.title/body/emailLabel/refLabel/submit/notFound/help`), plus the WhatsApp line. Result render: found → a link to `/commande/{ref}` with the status pill; not found → `lookup.notFound` (same copy for any mismatch).

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/lookup.test.tsx && npm run check && npx tsc --noEmit`
Expected: PASS, guards clean.

- [ ] **Step 5: Commit**

```bash
git add -A myroamspot
git commit -m "feat(lookup): /mes-esims order lookup with enumeration-safe responses"
```

---

### Task 14: Pre-activation refund flow

**Files:**
- Create: `myroamspot/src/lib/refunds.ts`
- Create: `myroamspot/src/app/api/orders/[order_ref]/refund/route.ts`
- Create: `myroamspot/src/components/order/refund-button.tsx`
- Modify: `myroamspot/src/components/order/lookup-form.tsx` (render the button on a found order)
- Modify: dictionaries (`refund.*`)
- Create: `myroamspot/src/__tests__/refunds.test.ts`

**Interfaces:**
- Consumes: `OrdersRepo` (Task 4), `EsimAccessClient` (Task 6), `PaymentProvider` (Task 7), `EmailSender` (Task 5).
- Produces:

```ts
export type RefundResult = "refunded" | "not_found" | "not_eligible" | "already_refunded" | "provider_error";
export function createRefunds(deps: { repo: OrdersRepo; esim: EsimAccessClient; provider: PaymentProvider;
  email: EmailSender; now?: () => Date }): { request(i: { orderRef: string; email: string }): Promise<RefundResult> };
export function isRefundEligible(row: OrderRow, profile: EsimProfile, now: Date): boolean;
```

- [ ] **Step 1: Write the failing tests**

`isRefundEligible` is a table test — spec §8 in full:

```ts
const base = {/* fulfilled 3 days ago */} as OrderRow;
const fresh = {/* RELEASED, orderUsage 0, activateTime null */} as EsimProfile;
it("is eligible only for an unused, unactivated profile inside 14 days", () => {
  expect(isRefundEligible(base, fresh, now)).toBe(true);
  expect(isRefundEligible({ ...base, status: "pending" }, fresh, now)).toBe(false);
  expect(isRefundEligible(base, { ...fresh, activateTime: "2026-10-19T08:00:00Z" }, now)).toBe(false); // installed
  expect(isRefundEligible(base, { ...fresh, smdpStatus: "ENABLED" }, now)).toBe(false);               // installed
  expect(isRefundEligible(base, { ...fresh, orderUsage: 1048576 }, now)).toBe(false);                 // data consumed
  expect(isRefundEligible({ ...base, fulfilled_at: fifteenDaysAgo }, fresh, now)).toBe(false);        // outside 14 days
});
```

`createRefunds`:

```ts
it("cancels the eSIM, refunds the payment, marks the order and emails the buyer", async () => {
  expect(await r.request({ orderRef: "REF", email: "a@b.fr" })).toBe("refunded");
  expect(esim.cancelOrder).toHaveBeenCalledWith("26041021130002");   // esimTranNo, per the vendor reference
  expect(provider.refund).toHaveBeenCalledWith({ paymentId: "pay_1", amountCents: 1999 });
  expect(repo.markRefunded).toHaveBeenCalledWith("order-1");
  expect(email.sendRefundConfirmed).toHaveBeenCalledOnce();
});
it("refuses after activation without cancelling or refunding", async () => { /* "not_eligible"; no cancel, no refund */ });
it("refuses when the requester's email does not match the order", async () => { /* "not_found" */ });
it("refuses a second refund on an already refunded order", async () => { /* "already_refunded" */ });
it("keeps the order recoverable when the money leg fails after the cancel", async () => {
  provider.refund.mockRejectedValue(new PaymentError("boom", { retryable: true }));
  expect(await r.request({ orderRef: "REF", email: "a@b.fr" })).toBe("provider_error");
  expect(repo.markRefunded).not.toHaveBeenCalled();                    // never claim refunded without the money
  expect(repo.recordFulfillmentError).toHaveBeenCalled();              // recorded for ops
  expect(email.sendOwnerAlert).toHaveBeenCalledOnce();
});
it("refuses when the eSIM has no provider transaction number to cancel", async () => { /* esim_details.esim_tran_no null -> not_eligible */ });
```

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run src/__tests__/refunds.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

`request` order of operations: `findByEmailAndRef` → `not_found`; `status === "refunded"` → `already_refunded`; `esim_details` missing either `esim_tran_no` or `esim_access_order_no` → `not_eligible`; `esim.queryOrder({ orderNo: row.esim_details.esim_access_order_no })` for the live profile (only `queryOrder` — it already carries `orderUsage`, `activateTime` and `smdpStatus`; a query failure → `provider_error`, never a blind refund); `isRefundEligible` false → `not_eligible`; `esim.cancelOrder(esimTranNo)`; `provider.refund({ paymentId, amountCents: row.amount_cents })`; `markRefunded`; `sendRefundConfirmed` → `"refunded"`. The `provider_payment_id` must exist (else `not_eligible`).

Route `POST /api/orders/[order_ref]/refund`: body `{ email }` validated; repo/esim/provider null → 503; result → 200 `{ result }` for `refunded`/`already_refunded`, 409 `{ result }` for `not_eligible`, 404 `{ result: "not_found" }`, 502 for `provider_error`. No copy in the route — the client maps the result to `refund.*` strings.

`RefundButton`: renders only when the lookup result is `fulfilled`; a confirmation step (Apple-style panel, `refund.confirmTitle/confirmBody/confirm/keep`), the CGV sentence on refusal (`refund.refusedCgv`, which must name the 14-day window, the zero-usage condition and the L.221-28 waiver), and the WhatsApp fallback for `provider_error`.

- [ ] **Step 4: Run and verify**

Run: `npx vitest run src/__tests__/refunds.test.ts && npm run check && npx tsc --noEmit`
Expected: PASS, guards clean.

- [ ] **Step 5: Commit**

```bash
git add -A myroamspot
git commit -m "feat(refunds): strict pre-activation refund with CGV-accurate refusals"
```

---

### Task 15: Operator runbook and full gate

**Files:**
- Create: `myroamspot/README.md` (or append a `## Commerce` section when one exists)
- Modify: `.env.example` only if Task 1's list drifted during implementation

**Interfaces:**
- Consumes: everything above.
- Produces: the exact steps the owner follows to switch commerce on in production.

- [ ] **Step 1: Write the runbook**

`myroamspot/README.md` sections, in order:
1. **Supabase** — create the project, run `supabase/schema.sql`, then `supabase/seed.sql` in the SQL editor, copy the project URL + service key into `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` (Vercel → Project → Settings → Environment Variables, Production + Preview).
2. **Whop** — create the app, set `WHOP_API_KEY`, `WHOP_COMPANY_ID`; register the webhook URL `https://myroamspot.com/api/webhooks/whop` for `payment.succeeded` and `payment.failed`; store the signing secret as `WHOP_WEBHOOK_SECRET`; send a dashboard **test event** and confirm 200.
3. **eSIM Access** — fund the account, set `ESIM_ACCESS_ACCESS_CODE` (+ `ESIM_ACCESS_SECRET_KEY` when the account issues one), `USD_EUR_RATE`.
4. **Resend** — verify the sending domain, set `RESEND_API_KEY`, `EMAIL_FROM`, `OWNER_ALERT_EMAIL`.
5. **Cron** — set `CRON_SECRET`; `vercel.json` already registers the daily expiry job.
6. **Live integration checklist (owner-run, spec §13.2 — $10–15 budget)** — provision the cheapest package end-to-end; re-deliver a webhook and confirm no second eSIM appears in the eSIM Access dashboard; run one pre-activation refund and confirm the balance returns; confirm the delivered page shows QR + SM-DP+ + activation code (if `ac` is empty for our packages, record it — the page degrades to QR-only by design).
7. **Known open items** — `NEXT_PUBLIC_WHATSAPP_NUMBER` must be set or the support hatch renders nothing; connect the `myroamspot.com` domain in Vercel; catalog sync + drift alerts are Plan 3.

- [ ] **Step 2: Run the full gate**

Run in `myroamspot/`: `npm run check && npx tsc --noEmit && npm test && npm run build`
Expected: all four exit 0; test count ≥ the pre-plan 40 + the new suites; the build lists every existing route plus `/commande/[order_ref]`, `/mes-esims`, `/api/checkout`, `/api/webhooks/[provider]`, `/api/orders/[order_ref]`, `/api/orders/lookup`, `/api/orders/[order_ref]/refund`, `/api/cron/expire-orders`.

- [ ] **Step 3: Commit, fast-forward `main`, push, verify the deploy**

```bash
git add -A
git commit -m "docs: commerce operator runbook + verified full gate"
# from the main repo checkout (not the worktree):
git merge --ff-only plan2-commerce-core && git push
```

Expected: Vercel deploys `main`; `/` still 200; `/api/checkout` answers 501 while the Whop env vars are absent (proof the guard rail is live in production); `/commande/unknownref` answers 404.

---

## Self-Review

**Spec coverage** — §6 payments seam + state machine → Tasks 4, 7, 8, 11; §7 data model + pricing + launch catalog → Tasks 1, 2, 3; §8 order flow → Tasks 9–12, refund → Task 14; §10 emails + legal-adjacent CGV copy → Tasks 5, 10, 14; §11 env → Task 1. §9 sync is explicitly Plan 3. CHF display is deferred with the reason recorded in Scope.

**Type consistency** — `OrdersRepo`, `EsimDetails`, `OrderRow`, `PaymentProvider`, `EsimAccessClient`, `EmailSender`, `FulfillmentOutcome`, `RefundResult` are each defined once (Tasks 4–8, 14) and referenced by name everywhere after. `parseLpa` produces `smdpAddress/activationCode/installUrl`, consumed by Tasks 8 and 12. `SellablePackage.id` is the checkout key in Tasks 9 and 10.

**Review Focus** — each of the five lines names its owning task and the test that pins it (Task 8 replay/resume/retry, Task 7+11 verification and unknown session, Task 9 sellability, Task 8 provider-outage recovery, Task 14 activation refusal).
