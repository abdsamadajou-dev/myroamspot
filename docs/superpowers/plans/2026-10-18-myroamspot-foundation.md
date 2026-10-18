# MyRoamSpot — Foundation & Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the MyRoamSpot Next.js app and ship a live, French, SEO-ready branded site — hub homepage, six destination funnels, legal pages, and the package data layer — with no commerce wired yet.

**Architecture:** Next.js 15 App Router + TypeScript static-first pages; every user-visible string lives in `dictionaries/fr.json`; packages are served through a typed `getPackages(destinationSlug)` function backed by a seed module now and a Supabase query in Plan 2; the i18n dictionary plus a build-time key check keep German (`/de`) addable later without touching French URLs.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui, Lucide icons, Vitest + Testing Library. Supabase schema is committed but not required to run this plan.

**Spec:** `docs/superpowers/specs/2026-10-18-esim-saas-design.md`

## Global Constraints

- App lives in `myroamspot/` inside the workspace root; existing files (`index.html`, `nadroli.html`, `saas/`) are untouched.
- Next.js 15 App Router, React 19, TypeScript `strict: true`.
- Tailwind CSS v4 (`@import "tailwindcss"`), shadcn/ui, Lucide icons.
- All user-visible strings come from `dictionaries/fr.json`; no hardcoded copy in components; a missing key **fails the build**.
- Money is integer cents, EUR only, displayed **TTC**: `formatEur(1299) === "12,99 €"`.
- No eSIM Access or Whop credentials anywhere client-side (none are used in this plan at all).
- No visible English fallback; French is the only UI language.
- Brand: **MyRoamSpot**; canonical site URL `https://myroamspot.com`.
- Tests run with `npm test`; typecheck with `npm run typecheck`; build with `npm run build`.

## Review Focus

1. A page that uses a `fr.json` key that does not exist must fail the build — never render a raw key or English.
2. A package with `priceCents: 0` or `undefined` must not crash `PlanCard` — render `—` and hide the buy CTA.
3. A funnel slug outside the six allowed values must not resolve to a real page (no dynamic `[slug]` route) — prevents junk/duplicate SEO URLs.
4. Every funnel page must emit `title`, `description`, `canonical`, and Product JSON-LD — otherwise it cannot rank.
5. A legal page must render with its placeholder tokens intact — the tokens are intentional until the entity is registered.

---

### Task 1: Scaffold the Next.js app and tooling

**Files:**
- Create: `myroamspot/package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.env.example`, `.gitignore`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/api/health/route.ts`, `src/__tests__/smoke.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test`, `npm run typecheck`, `npm run build`, `npm run dev` all work; `GET /api/health` returns `{ ok: true }`.

- [ ] **Step 1: Create project config**

`package.json` scripts: `dev` (`next dev`), `build` (`next build`), `start` (`next start`), `test` (`vitest run`), `typecheck` (`tsc --noEmit`). Dependencies: `next ^15`, `react ^19`, `react-dom ^19`. Dev: `typescript ^5`, `@types/react`, `@types/node`, `tailwindcss ^4`, `@tailwindcss/postcss ^4`, `postcss`, `vitest ^3`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react ^16`, `@testing-library/jest-dom ^6`, `@testing-library/user-event ^14`, `lucide-react`.

`tsconfig.json` must set `strict: true` and include `"src/**/*"`. `vitest.config.ts` sets `environment: "jsdom"` and a `setupFiles` entry for jest-dom. `.env.example` contains only `NEXT_PUBLIC_SITE_URL=https://myroamspot.com` and a commented `SUPABASE_URL=` / `SUPABASE_SERVICE_KEY=`. `.gitignore` ignores `node_modules`, `.next`, `.env*`.

`src/app/globals.css` contains `@import "tailwindcss";`. `src/app/layout.tsx` is a minimal root layout rendering `<html lang="fr">` + children. `src/app/page.tsx` renders `<h1>MyRoamSpot</h1>`.

- [ ] **Step 2: Write the failing smoke test**

`src/__tests__/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { GET } from "../app/api/health/route";

describe("health route", () => {
  it("returns 200 and { ok: true }", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `cd myroamspot && npm install && npm test`
Expected: FAIL — `Failed to load url ../app/api/health/route`.

- [ ] **Step 4: Implement the health route**

Create `src/app/api/health/route.ts`:
```ts
import { NextResponse } from "next/server";
export const GET = () => NextResponse.json({ ok: true });
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 6: Verify dev, typecheck, and build**

Run: `npm run dev` in one shell, then `curl http://localhost:3000/api/health`.
Expected: `{"ok":true}`.
Run: `npm run typecheck && npm run build`
Expected: both exit 0.

- [ ] **Step 7: Add shadcn/ui**

Run: `npx shadcn@latest init -d` then `npx shadcn@latest add button card input badge accordion`
Expected: `components.json` created, `src/components/ui/*` populated, no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold MyRoamSpot Next.js app"
```

---

### Task 2: i18n dictionary, formatting, and the build-time key check

**Files:**
- Create: `dictionaries/fr.json`, `dictionaries/de.json`, `src/lib/i18n.ts`, `src/lib/format.ts`, `scripts/check-i18n.mjs`, `src/__tests__/i18n.test.ts`, `src/__tests__/format.test.ts`
- Modify: `myroamspot/package.json` (add `"check": "node scripts/check-i18n.mjs"`, `"prebuild": "npm run check"`)

**Interfaces:**
- Consumes: nothing.
- Produces: `type Locale = "fr" | "de"`; `getDictionary(locale: Locale): Dictionary`; `t(dict: Dictionary, key: string): string` (throws on missing key); `formatEur(cents: number): string`; `centsFromEuros(eur: number): number`; `Dictionary` type inferred from `fr.json`.

- [ ] **Step 1: Write the failing i18n test**

`src/__tests__/i18n.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getDictionary, t } from "../lib/i18n";

describe("i18n", () => {
  it("loads the French dictionary", () => {
    expect(getDictionary("fr").site.name).toBe("MyRoamSpot");
  });
  it("throws on a missing key", () => {
    const dict = getDictionary("fr");
    expect(() => t(dict, "does.not.exist")).toThrow(/missing/i);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `../lib/i18n` does not exist.

- [ ] **Step 3: Create the dictionaries**

`dictionaries/fr.json` (exact values pinned — do not paraphrase):
```json
{
  "site": { "name": "MyRoamSpot", "tagline": "Votre eSIM de voyage, partout." },
  "nav": { "home": "Accueil", "destinations": "Destinations", "help": "Aide" },
  "home": {
    "heroTitle": "Restez connecté partout, sans frais d'itinérance.",
    "heroSubtitle": "eSIM françaises pour l'Arabie saoudite, le Maroc, la Turquie, la Suisse et les Émirats.",
    "searchPlaceholder": "Où voyagez-vous ?",
    "searchCta": "Trouver mon eSIM"
  },
  "plan": { "days": "jours", "data": "Go", "buy": "Acheter", "ttc": "TTC" },
  "support": {
    "whatsappCta": "Besoin d'aide ?",
    "whatsappMessage": "Bonjour, j'ai une question sur mon eSIM."
  },
  "legal": {
    "company": "[COMPANY_NAME]",
    "siret": "[REGISTRATION_NUMBER]",
    "address": "[REGISTERED_ADDRESS]",
    "email": "[CONTACT_EMAIL]",
    "hosting": "Vercel · Supabase"
  },
  "funnels": {
    "esim-omra": {
      "title": "eSIM Omra — Internet à La Mecque et Médine",
      "description": "eSIM 5G pour l'Omra : activation instantanée à l'atterrissage de Djeddah, sans file d'attente.",
      "badges": ["5G à La Mecque et Médine", "WhatsApp dès l'atterrissage", "Sans file biométrique"]
    },
    "esim-arabie-saoudite": {
      "title": "eSIM Arabie saoudite — forfait internet voyage",
      "description": "eSIM Arabie saoudite : couverture 5G à Riyad, Djeddah et La Mecque, installation en 2 minutes.",
      "badges": ["Couverture Riyad et Djeddah", "Activation immédiate", "Support français"]
    },
    "esim-maroc": {
      "title": "eSIM Maroc — internet sans itinérance",
      "description": "eSIM Maroc : réseaux Maroc Telecom et Orange, idéale pour Marrakech et le désert.",
      "badges": ["Réseaux Maroc Telecom & Orange", "Idéale Marrakech", "Activation en 2 minutes"]
    },
    "esim-suisse": {
      "title": "eSIM Suisse pas cher — sans frais de roaming",
      "description": "eSIM Suisse : évitez les pièges du roaming à la frontière franco-suisse, réseaux Swisscom et Sunrise.",
      "badges": ["Évite le roaming frontalier", "Réseaux Swisscom & Sunrise", "Prix en euros"]
    },
    "esim-turquie": {
      "title": "eSIM Turquie — forfait internet Istanbul et Antalya",
      "description": "eSIM Turquie : couverture nationale à Istanbul, Antalya et la Cappadoce, activation instantanée.",
      "badges": ["Couverture nationale", "Istanbul & Antalya", "Activation instantanée"]
    },
    "esim-emirats-arabes-unis": {
      "title": "eSIM Émirats arabes unis — internet à Dubaï",
      "description": "eSIM Émirats arabes unis : 5G à Dubaï et Abu Dhabi, activation à l'atterrissage.",
      "badges": ["5G à Dubaï et Abu Dhabi", "Activation à l'atterrissage", "Support français"]
    }
  }
}
```

`dictionaries/de.json` contains only `{ "site": { "name": "MyRoamSpot" } }` — Phase 2 fills the rest.

- [ ] **Step 4: Implement `src/lib/i18n.ts`**

```ts
import fr from "../../dictionaries/fr.json";
import de from "../../dictionaries/de.json";

export type Locale = "fr" | "de";
export type Dictionary = typeof fr;

const dicts: Record<Locale, Dictionary> = { fr, de } as Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dicts[locale];
}

export function t(dict: Dictionary, key: string): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, dict);
  if (typeof value !== "string") throw new Error(`Missing i18n key: ${key}`);
  return value;
}
```

- [ ] **Step 5: Run the i18n test and verify it passes**

Run: `npm test`
Expected: PASS (2 tests).

- [ ] **Step 6: Write the failing format test**

`src/__tests__/format.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { formatEur, centsFromEuros } from "../lib/format";

describe("format", () => {
  it("formats cents as French TTC euros", () => {
    expect(formatEur(1299)).toBe("12,99 €");
  });
  it("converts euros to cents", () => {
    expect(centsFromEuros(12.99)).toBe(1299);
  });
});
```

- [ ] **Step 7: Run the format test and verify it fails**

Run: `npm test`
Expected: FAIL — `../lib/format` does not exist.

- [ ] **Step 8: Implement `src/lib/format.ts`**

```ts
export function formatEur(cents: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function centsFromEuros(eur: number): number {
  return Math.round(eur * 100);
}
```

- [ ] **Step 9: Run the format test and verify it passes**

Run: `npm test`
Expected: PASS (4 tests total).

- [ ] **Step 10: Write the build-time key check**

`scripts/check-i18n.mjs` must: read `dictionaries/fr.json`; walk `src/**/*.tsx`; find every literal `t(<dict>, "a.b.c")` call; exit 1 if any literal key is absent from the French dictionary, printing `Missing i18n key: <key> in <file>:<line>`.

- [ ] **Step 11: Wire the check into the build**

In `package.json` add `"check": "node scripts/check-i18n.mjs"` and `"prebuild": "npm run check"`.

- [ ] **Step 12: Prove the check fails the build**

Temporarily add `t(dict, "nope.missing")` to `src/app/page.tsx`. Run: `npm run build`
Expected: FAIL with `Missing i18n key: nope.missing`. Revert the temporary line.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add fr/de dictionaries, EUR formatting, and i18n build check"
```

---

### Task 3: Global layout, header, footer, and WhatsApp widget

**Files:**
- Create: `src/lib/site.ts`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/whatsapp-widget.tsx`, `src/__tests__/layout.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `getDictionary`, `t` from Task 2.
- Produces: `SiteHeader`, `SiteFooter`, `WhatsAppWidget` components (no props); `BRAND = "MyRoamSpot"`, `SITE_URL = "https://myroamspot.com"`, `WHATSAPP_NUMBER` read from env.

- [ ] **Step 1: Write the failing layout test**

`src/__tests__/layout.test.tsx`:
```tsx
import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "../components/site-header";
import { WhatsAppWidget } from "../components/whatsapp-widget";

describe("layout", () => {
  it("renders the brand in the header", () => {
    render(<SiteHeader />);
    expect(screen.getByText("MyRoamSpot")).toBeInTheDocument();
  });
  it("links to WhatsApp with a prefilled message", () => {
    render(<WhatsAppWidget />);
    expect(screen.getByRole("link")).toHaveAttribute("href", /wa\.me/);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `../components/site-header` does not exist.

- [ ] **Step 3: Implement `src/lib/site.ts`**

```ts
export const BRAND = "MyRoamSpot";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://myroamspot.com";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
```

- [ ] **Step 4: Implement the three components**

`SiteHeader` renders the `SiteHeader` nav using `t(dict, "nav.*")` keys and the `BRAND` wordmark. `SiteFooter` renders the three legal links (`/mentions-legales`, `/cgv`, `/politique-de-confidentialite`) and the `legal.hosting` string. `WhatsAppWidget` renders an anchor `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}` with a floating button; if `WHATSAPP_NUMBER` is empty it renders nothing.

- [ ] **Step 5: Wire into `layout.tsx`**

Root layout renders `<html lang="fr">`, includes `globals.css`, and renders `<SiteHeader />` above children and `<SiteFooter />` below, plus `<WhatsAppWidget />`.

- [ ] **Step 6: Run the test and verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add site header, footer, and WhatsApp widget"
```

---

### Task 4: Hub homepage and global destination search

**Files:**
- Create: `src/components/destination-search.tsx`, `src/__tests__/hub.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `getDictionary`, `t`, `formatEur` from Task 2.
- Produces: `DestinationSearch` component (no props) exposing the six allowed slugs; `DESTINATION_SLUGS: string[]` in `src/lib/destinations.ts`.

- [ ] **Step 1: Write the failing hub test**

`src/__tests__/hub.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DestinationSearch from "../components/destination-search";
import { DESTINATION_SLUGS } from "../lib/destinations";

describe("hub", () => {
  it("lists the six allowed destinations", () => {
    render(<DestinationSearch />);
    for (const slug of DESTINATION_SLUGS) expect(screen.getByText(slug)).toBeInTheDocument();
  });
  it("exposes exactly six destinations", () => {
    expect(DESTINATION_SLUGS).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `../components/destination-search` does not exist.

- [ ] **Step 3: Implement `src/lib/destinations.ts`**

```ts
export const DESTINATION_SLUGS = [
  "esim-omra",
  "esim-arabie-saoudite",
  "esim-maroc",
  "esim-suisse",
  "esim-turquie",
  "esim-emirats-arabes-unis",
] as const;
```

- [ ] **Step 4: Implement `DestinationSearch`**

Renders a labeled input (`home.searchPlaceholder`) and a button (`home.searchCta`); on submit navigates to `/${slug}` using `next/navigation` `useRouter`. The accessible name of each option is its slug so the test can find it.

- [ ] **Step 5: Build the homepage**

`src/app/page.tsx` renders `home.heroTitle`, `home.heroSubtitle`, and `<DestinationSearch />`.

- [ ] **Step 6: Run the test and verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add hub homepage with destination search"
```

---

### Task 5: Package data layer, seed catalog, and Supabase schema

**Files:**
- Create: `src/lib/packages.seed.ts`, `src/lib/packages.ts`, `supabase/schema.sql`, `src/__tests__/packages.test.ts`
- Modify: none.

**Interfaces:**
- Consumes: nothing.
- Produces: `type Package = { slug: string; destinationSlug: string; nameFr: string; days: number; dataGb: number; priceCents: number; active: boolean }`; `getPackages(destinationSlug: string): Package[]` (reads the seed now; Plan 2 replaces the body with a Supabase query without changing the signature).

- [ ] **Step 1: Write the failing packages test**

`src/__tests__/packages.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getPackages } from "../lib/packages";

describe("packages", () => {
  it("returns the Omra catalog in price order", () => {
    const omra = getPackages("arabie-saoudite");
    expect(omra.map((p) => p.priceCents)).toEqual([1299, 1999, 2999]);
  });
  it("returns exactly 11 packages across all destinations", () => {
    const slugs = ["arabie-saoudite", "maroc", "suisse", "turquie", "emirats-arabes-unis"];
    const total = slugs.reduce((n, s) => n + getPackages(s).length, 0);
    expect(total).toBe(11);
  });
  it("stores integer cents", () => {
    for (const p of getPackages("maroc")) expect(Number.isInteger(p.priceCents)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `../lib/packages` does not exist.

- [ ] **Step 3: Implement the seed**

`src/lib/packages.seed.ts` exports `PACKAGES: Package[]` with exactly these 11 entries (priceCents integer):
`arabie-saoudite`: Express 10j/5Go 1299, Complete 15j/10Go 1999, Extended 30j/20Go 2999 · `maroc`: 7j/5Go 999, 15j/10Go 1699 · `suisse`: 7j/3Go 899, 14j/10Go 1899 · `turquie`: 7j/3Go 799, 15j/10Go 1499 · `emirats-arabes-unis`: 7j/3Go 999, 14j/10Go 1999. Every entry has `active: true`.

- [ ] **Step 4: Implement `getPackages`**

```ts
import { PACKAGES } from "./packages.seed";
import type { Package } from "./packages.seed";

export function getPackages(destinationSlug: string): Package[] {
  return PACKAGES.filter((p) => p.active && p.destinationSlug === destinationSlug)
    .sort((a, b) => a.priceCents - b.priceCents);
}
```

- [ ] **Step 5: Commit the Supabase schema**

`supabase/schema.sql` contains `packages` (`id`, `destination_slug`, `name_fr`, `days`, `data_gb`, `price_cents`, `wholesale_net_cents`, `esim_access_package_id`, `active`, `updated_at`), `orders` (`id`, `order_ref`, `email`, `package_id`, `provider`, `provider_session_id UNIQUE`, `amount_cents`, `currency`, `status`, `esim_details JSONB`, `created_at`, `fulfilled_at`), and `sync_log`. Applied manually in the Supabase dashboard when the project is created — this plan does not require it.

- [ ] **Step 6: Run the test and verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add package seed catalog and Supabase schema"
```

---

### Task 6: Shared funnel components

**Files:**
- Create: `src/components/plan-card.tsx`, `src/components/funnel-hero.tsx`, `src/components/faq.tsx`, `src/components/trust-badges.tsx`, `src/__tests__/plan-card.test.tsx`

**Interfaces:**
- Consumes: `Package`, `getPackages`, `formatEur`, `t` from Tasks 2 and 5.
- Produces: `PlanCard({ pack: Package })`; `FunnelHero({ slug: string })`; `Faq({ slug: string })`; `TrustBadges()`.

- [ ] **Step 1: Write the failing plan-card test**

`src/__tests__/plan-card.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PlanCard from "../components/plan-card";
import type { Package } from "../lib/packages.seed";

const pack: Package = { slug: "omra-express", destinationSlug: "arabie-saoudite", nameFr: "Express", days: 10, dataGb: 5, priceCents: 1299, active: true };

describe("PlanCard", () => {
  it("renders the TTC price and allowance", () => {
    render(<PlanCard pack={pack} />);
    expect(screen.getByText("12,99 €")).toBeInTheDocument();
    expect(screen.getByText(/10\s*jours/)).toBeInTheDocument();
    expect(screen.getByText(/5\s*Go/)).toBeInTheDocument();
  });
  it("renders a placeholder and hides the CTA when price is zero", () => {
    render(<PlanCard pack={{ ...pack, priceCents: 0 }} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `../components/plan-card` does not exist.

- [ ] **Step 3: Implement `PlanCard`**

Renders `pack.nameFr`, `${formatEur(pack.priceCents)} TTC`, `${pack.days} jours`, `${pack.dataGb} Go`, and a buy button labeled `plan.buy`. When `priceCents <= 0`, render `—` instead of a price and omit the button.

- [ ] **Step 4: Implement `FunnelHero`, `Faq`, `TrustBadges`**

`FunnelHero({ slug })` reads `funnels.<slug>.title` / `.description` / `.badges` via `t`. `Faq({ slug })` renders an accordion of the funnel's FAQ keys (add `faqs` arrays to each funnel entry in `fr.json` with at least 3 French Q/A pairs per funnel). `TrustBadges()` renders the `plan.ttc` and coverage badges.

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add plan card, funnel hero, FAQ, and trust badges"
```

---

### Task 7: Six funnel pages with SEO metadata and Product JSON-LD

**Files:**
- Create: `src/app/esim-omra/page.tsx`, `src/app/esim-arabie-saoudite/page.tsx`, `src/app/esim-maroc/page.tsx`, `src/app/esim-suisse/page.tsx`, `src/app/esim-turquie/page.tsx`, `src/app/esim-emirats-arabes-unis/page.tsx`, `src/app/esim-[city]/page.tsx`, `src/lib/seo.ts`, `src/__tests__/funnels.test.tsx`
- Modify: none.

**Interfaces:**
- Consumes: `getPackages`, `FunnelHero`, `Faq`, `TrustBadges`, `PlanCard`, `formatEur` from Tasks 2–6.
- Produces: `buildFunnelMetadata(slug: string): Metadata`; `buildProductJsonLd(pack: Package): Record<string, unknown>`.

- [ ] **Step 1: Write the failing funnels test**

`src/__tests__/funnels.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { DESTINATION_SLUGS } from "../lib/destinations";
import { buildFunnelMetadata, buildProductJsonLd } from "../lib/seo";
import { getPackages } from "../lib/packages";
import PlanCard from "../components/plan-card";

describe("funnels", () => {
  it("every destination maps to a real funnel slug", () => {
    expect(DESTINATION_SLUGS).toContain("esim-omra");
    expect(DESTINATION_SLUGS).toHaveLength(6);
  });
  it("has no dynamic esim slug route (prevents junk SEO URLs)", () => {
    const dynamicDir = path.join(process.cwd(), "src/app/esim-[city]");
    expect(existsSync(dynamicDir)).toBe(false);
  });
  it("emits title, description, and canonical for a funnel", () => {
    const meta = buildFunnelMetadata("esim-maroc");
    expect(meta.title).toBe("eSIM Maroc — internet sans itinérance");
    expect(meta.description).toContain("Maroc Telecom");
    expect(meta.alternates?.canonical).toBe("https://myroamspot.com/esim-maroc");
  });
  it("emits Product JSON-LD with an EUR offer", () => {
    const ld = buildProductJsonLd(getPackages("maroc")[0]);
    expect(ld["@type"]).toBe("Product");
    expect((ld.offers as Record<string, string>).priceCurrency).toBe("EUR");
  });
  it("renders a plan card on a funnel page", () => {
    render(<PlanCard pack={getPackages("suisse")[0]} />);
    expect(screen.getByText("8,99 €")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `../lib/seo` does not exist.

- [ ] **Step 3: Implement `src/lib/seo.ts`**

`buildFunnelMetadata(slug)` returns `{ title: funnels[slug].title, description: funnels[slug].description, alternates: { canonical: `${SITE_URL}/${slug}` } }`. `buildProductJsonLd(pack)` returns `{ "@context": "https://schema.org", "@type": "Product", "name": pack.nameFr, "offers": { "@type": "Offer", "price": (pack.priceCents / 100).toFixed(2), "priceCurrency": "EUR", "availability": "https://schema.org/InStock" } }`.

- [ ] **Step 4: Create the six funnel pages**

Each page calls `export const metadata = buildFunnelMetadata("<slug>")`, renders `<FunnelHero slug="<slug>" />`, `<TrustBadges />`, maps `getPackages(destinationSlug)` to `<PlanCard />`, renders `<Faq slug="<slug>" />`, and injects `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(firstPack)) }} />`. `esim-omra` and `esim-arabie-saoudite` both use `destinationSlug = "arabie-saoudite"`.

- [ ] **Step 5: Do NOT create a dynamic city route**

Leave no `src/app/esim-[...]/page.tsx` file: any unknown `/esim-*` slug 404s by default, which is exactly the launch behavior we want (Review Focus #3). City pages arrive later as hand-written static routes.

- [ ] **Step 6: Run the test and verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add six French funnel pages with SEO metadata and JSON-LD"
```

---

### Task 8: Legal pages, sitemap/robots, and the final build gate

**Files:**
- Create: `src/app/mentions-legales/page.tsx`, `src/app/cgv/page.tsx`, `src/app/politique-de-confidentialite/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/__tests__/legal.test.tsx`
- Modify: none.

**Interfaces:**
- Consumes: `t`, `SITE_URL` from Tasks 2 and 3.
- Produces: three legal routes; `sitemap()` returning the hub + six funnels + three legal routes.

- [ ] **Step 1: Write the failing legal test**

`src/__tests__/legal.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MentionsLegales from "../app/mentions-legales/page";
import { sitemap } from "../app/sitemap";

describe("legal", () => {
  it("renders placeholder tokens intact", () => {
    render(<MentionsLegales />);
    expect(screen.getByText("[COMPANY_NAME]")).toBeInTheDocument();
    expect(screen.getByText("[REGISTRATION_NUMBER]")).toBeInTheDocument();
  });
  it("lists the hub, six funnels, and legal pages in the sitemap", () => {
    const urls = sitemap().map((u) => u.url);
    expect(urls).toContain("https://myroamspot.com/esim-omra");
    expect(urls).toContain("https://myroamspot.com/cgv");
    expect(urls.filter((u) => u.includes("/esim-"))).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — `../app/mentions-legales/page` does not exist.

- [ ] **Step 3: Implement the three legal pages**

Each renders its title and body copy from `fr.json` `legal.*` keys and the placeholder tokens `[COMPANY_NAME]`, `[REGISTRATION_NUMBER]`, `[REGISTERED_ADDRESS]`, `[CONTACT_EMAIL]`, plus `legal.hosting`. `/cgv` states the 14-day conditional refund rule and the digital-goods withdrawal waiver.

- [ ] **Step 4: Implement `sitemap.ts` and `robots.ts`**

`sitemap()` returns one entry for `/`, one per slug in `DESTINATION_SLUGS`, and one per legal route, all under `SITE_URL`. `robots.ts` returns `{ rules: [{ userAgent: "*", allow: "/" }], sitemap: `${SITE_URL}/sitemap.xml` }`.

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Run the full gate**

Run: `npm run check && npm run typecheck && npm test && npm run build`
Expected: all exit 0.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add legal pages, sitemap, and robots"
```

---

## Plan 1 Completion

On success, `myroamspot/` runs locally with `npm run dev` and serves:
- Hub homepage with destination search
- Six French funnel pages with SEO metadata and Product JSON-LD
- Three legal pages with placeholder tokens
- Sitemap and robots
- An 11-package typed seed catalog and `getPackages` API

No commerce, no external credentials, no Supabase required to run. Plan 2 (Commerce Core) then adds the pricing engine, Supabase-backed catalog, payments seam, checkout, webhook, fulfillment, emails, and refund flow.
