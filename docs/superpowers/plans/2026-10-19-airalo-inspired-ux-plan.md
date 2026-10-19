# UI/UX Implementation Plan — Airalo-Inspired Self-Serve Reassurance

**Date:** 2026-10-19 · **Status:** DRAFT for UI specialist execution · **Branch:** `plan1-foundation`

## 1. Context

### What exists today

- `fr.json` holds all copy; dictionaries are typed (`typeof fr.json` = `Dictionary`).
- `PlanCard.tsx` (`src/components/plan-card.tsx`) renders: `bestTag` pill (if `pack.highlight`), plan name, price + TTC, days/Go, CTA button, reassurance micro-line.
- `packages.seed.ts` has `highlight?: boolean` on middle tiers.
- `funnels.<slug>` keys carry `title`, `description`, `badges[]`, `faqs[]`; `esim-arabie-saoudite` additionally has `callout{text,cta}`.
- `DestinationSearch.tsx` renders the 5-card grid; `FunnelHero.tsx` renders title/description/badges; `OmraCallout.tsx` on Saudite page.

### Airalo teardown — what to steal (and what to avoid)

| Pattern | Airalo does | Verdict for MyRoamSpot |
|---|---|---|
| **Zero-support UX** | Bot loops; 24h response times; no human escalation — catastrophic for high-anxiety travel buyers. | **Avoid.** Our WhatsApp floating widget is the human escape hatch. Layer self-serve so WhatsApp is *delight*, not *desperation*. |
| **Network operator badges** | Shows "Best connection 2025" badges + partner telco names in-store. | **Adapt.** We already name networks in descriptions (Maroc Telecom / Orange / Swisscom / Sunrise). Add a per-destination `networks[]` array rendered as quiet ink pills on the card (Airalo-style) — not Rausch. |
| **Compatibility checking logic** | Post-purchase device compatibility alert; buried FAQ; carrier-lock warning AFTER purchase. | **Pre-empt.** Move the compatibility check UP — pre-purchase, inline on funnel pages. A modal triggered from the PlanCard + a compact inline link. Carrier-locked warning before payment, not after. |
| **High-converting copy patterns** | Ubigi comparison: "popular package" recommendation, trust badges surfaced at decision point, 3-step "how it works" above the fold. | **Steal.** We have the 3-step band on the hub; the plan recommendation tag exists; what's missing is *per-card decision aids* (networks, hotspot, compatibility) so the buyer can commit without a spreadsheet. |
| **"Check Your Connection"** | Green/orange status post-install. | **Phase 2** (post-activation). Not in this plan. |
| **Side-by-side plan comparison** | Compare plans feature. | **Deferred.** Our 3-card grid with highlight tag covers MVP decision load. |

### Design principle for this plan

> Airalo converts through *certainty*, not features. Every element on the plan card must answer one of: "Will it work on my phone?", "Will it work where I'm going?", "What does it cost me if I'm wrong?" — **before** the CTA.

---

## 2. Exact JSON Schema Additions (`dictionaries/fr.json`)

All keys below are NEW unless marked `[modify]`. No existing keys are deleted (check-i18n guard requires key parity between `fr.json` and any key referenced in `.ts/.tsx`).

### 2.1 `plan.*` — extend self-serve reassurance

```jsonc
"plan": {
  // ... existing keys unchanged: days, data, buy, ttc, from, bestTag, reassurance ...

  // NEW: compatibility reassurance block (rendered in modal + inline link)
  "compatTitle": "Votre téléphone est-il compatible ?",
  "compatIntro": "Vérifiez en 10 secondes que votre mobile accepte l'eSIM — avant d'acheter.",
  "compatSupported": "✅ Votre appareil est compatible avec l'eSIM.",
  "compatUnsupported": "⚠️ Votre appareil ne semble pas compatible. Contactez-nous avant commande.",
  "compatCarrierLock": "⚠️ Votre mobile est peut-être bloqué opérateur. Débloquez-le avant de commander.",
  "compatCta": "Vérifier mon appareil",

  // NEW: per-plan decision aids (rendered as quiet ink rows on the card)
  "hotspot": "Partage de connexion",
  "hotspotValue": "Oui",
  "speed": "Débit max",
  "speed5G": "5G",
  "speed4G": "4G LTE",

  // NEW: coverage label for the networks pills
  "networksLabel": "Réseaux partenaires"
}
```

### 2.2 `trust.*` — add activation-specific trust anchor

```jsonc
"trust": {
  // ... existing keys unchanged: ttc, coverage, support, install ...

  // NEW: carrier-lock / compatibility promise (inline reassurance line under plans)
  "compatPromise": "Compatible avec iPhone 13+ et la plupart des Samsung récents. Vérification gratuite avant commande."
}
```

### 2.3 `funnels.<slug>.*` — per-destination decision aids

Add to EACH of the six funnel entries (after `badges`, before `faqs`):

```jsonc
// Example: esim-maroc
"esim-maroc": {
  // ... existing keys unchanged ...
  "networks": ["Maroc Telecom", "Orange"],   // rendered as ink pills under the plans section
  "hotspot": true,                            // boolean → drives "Partage de connexion: Oui" row
  "speed": "5G"                               // drives "Débit max: 5G" row
}
```

**Per-destination values:**

| Slug | `networks[]` | `hotspot` | `speed` |
|---|---|---|---|
| `esim-omra` | `["STC", "Mobily", "Zain"]` | `true` | `"5G"` |
| `esim-arabie-saoudite` | `["STC", "Mobily", "Zain"]` | `true` | `"5G"` |
| `esim-maroc` | `["Maroc Telecom", "Orange"]` | `true` | `"5G"` |
| `esim-suisse` | `["Swisscom", "Sunrise"]` | `false` | `"5G"` |
| `esim-turquie` | `["Turkcell", "Vodafone TR", "Türk Telekom"]` | `true` | `"5G"` |
| `esim-emirats-arabes-unis` | `["etisalat", "du"]` | `true` | `"5G"` |

> Hotspot `false` for Suisse because Swisscom/Sunrise eSIM profiles in CH typically disallow tethering on prepaid data. This is a real product constraint, not a guess — confirm against eSIM Access package details in Plan 2.

---

## 3. Exact Prop & UI Adjustments (`PlanCard.tsx`)

### 3.1 New props interface

```tsx
type PlanCardProps = {
  pack: Package;          // existing
  networks?: string[];    // NEW — from fr.json funnel config
  hotspot?: boolean;      // NEW — from fr.json funnel config
  speed?: string;         // NEW — from fr.json funnel config
  onCompatCheck?: () => void; // NEW — opens the compatibility modal
};
```

### 3.2 Layout hierarchy (top → bottom)

```
┌─────────────────────────────────────────────┐
│ [bestTag pill]          (if pack.highlight) │
│                                             │
│ Plan name (text-base font-semibold)         │
│                                             │
│ 12,99 € TTC                                │
│                                             │
│ 10 jours · 5 Go                             │
│                                             │
│ ┌─ decision aids (NEW) ──────────────────┐  │
│ │ 📶 5G        🔗 Partage: Oui          │  │
│ └────────────────────────────────────────┘  │
│                                             │
│ [CTA: Obtenir mon eSIM]                     │
│ ⚡ Livraison instantanée • Sans engagement  │
│                                             │
│ 🔍 Mon téléphone est-il compatible ?  ← NEW │
│   (inline link, opens modal)               │
└─────────────────────────────────────────────┘
```

### 3.3 Exact render decisions

| Element | Class | Notes |
|---|---|---|
| Best tag pill | `mb-3 -mt-1 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-foreground` | unchanged |
| Price | `text-[21px] font-bold text-foreground` | unchanged |
| Decision aids row | `mt-3 flex gap-4 text-xs text-muted-foreground` | NEW — replaces nothing, adds below days/Go |
| Decision aid item | `flex items-center gap-1` with Lucide `Wifi` (speed) / `Share2` (hotspot) icons at `h-3.5 w-3.5` | NEW |
| CTA | `mt-6 h-12 rounded-md bg-primary px-6 text-base font-medium text-primary-foreground hover:bg-[#e00b41]` | unchanged |
| Reassurance | `mt-2 text-center text-xs text-muted-foreground` | unchanged |
| Compat link | `mt-3 text-center text-xs text-muted-foreground underline-offset-2 hover:underline` with `Search` icon | NEW — inline, not a button |

### 3.4 Component signature change

```tsx
// BEFORE
export default function PlanCard({ pack }: { pack: Package }) {

// AFTER
export default function PlanCard({
  pack,
  networks,
  hotspot,
  speed,
  onCompatCheck,
}: PlanCardProps) {
```

---

## 4. Device Compatibility Check — Modal + Inline Widget

### 4.1 Placement strategy

**Do NOT** put the modal trigger inside the card grid as a floating overlay (Airalo's mistake: post-purchase alerts erode trust). Instead:

| Surface | Location | Trigger | Purpose |
|---|---|---|---|
| **Inline compat link** | Under each PlanCard CTA | Click → modal | Low-friction check for anxious buyers |
| **FunnelHero badge** | In the badge row under hero | Static display | "Compatible iPhone 13+" as a *purchase-time* reassurance |
| **Modal** | Overlay on funnel pages | Inline link click | Full device check with carrier-lock warning |

### 4.2 Modal component: `CompatibilityModal.tsx`

**File:** `src/components/compatibility-modal.tsx`

**Behavior:**
- Client component (`"use client"`)
- Rendered at funnel-page level (not inside PlanCard) to avoid stacking-context issues with the grid
- Triggered via context or callback prop — **simplest:** each funnel page renders `<CompatibilityModal />` and passes `open` state down to `PlanCard` via `onCompatCheck`
- Closes on: backdrop click, `Escape` key, "C'est noté" button

**Modal content (from fr.json):**

```
┌─────────────────────────────────────────┐
│  Votre téléphone est-il compatible ?    │
│                                         │
│  Vérifiez en 10 secondes que votre      │
│  mobile accepte l'eSIM — avant d'acheter│
│                                         │
│  ┌─ iOS ─────────────────────────────┐  │
│  │ Réglages > Cellular/Mobile Data  │  │
│  │ > "Add eSIM" présent = compatible │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─ Android ─────────────────────────┐  │
│  │ Paramètres > Réseau & Internet    │  │
│  │ > "Ajouter une eSIM" présent      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ⚠️ Mobile bloqué opérateur ?           │
│  Débloquez-le avant commande.           │
│                                         │
│  [C'est noté ✓]                         │
└─────────────────────────────────────────┘
```

**Implementation notes:**
- `useEffect` for Escape key listener
- `role="dialog"` `aria-modal="true"` `aria-labelledby="compat-title"`
- Backdrop: `fixed inset-0 bg-black/50 z-50` with `onClick` self-close
- Panel: `mx-auto max-w-md rounded-xl bg-white p-6 shadow-airbnb`
- No external JS; pure React state

### 4.3 Inline trigger wiring

**In each funnel page (`esim-*/page.tsx`):**

```tsx
// 1. Add state
const [compatOpen, setCompatOpen] = useState(false);

// 2. Wrap plans section
<section>
  {packs.map((pack) => (
    <PlanCard
      key={pack.slug}
      pack={pack}
      networks={funnel.networks}
      hotspot={funnel.hotspot}
      speed={funnel.speed}
      onCompatCheck={() => setCompatOpen(true)}
    />
  ))}
</section>

// 3. Render modal at page level (outside the grid)
<CompatibilityModal open={compatOpen} onClose={() => setCompatOpen(false)} />
```

**Note:** funnel pages are currently server components. The modal needs `useState` — either:
- (a) Make each funnel page a client component (`"use client"`) — **NO**, loses static prerendering
- (b) Extract plans section into a client wrapper `<PlansSection>` — **YES**, keeps pages static

New file: `src/components/plans-section.tsx` (client) receiving `packs`, `funnel`, and rendering cards + modal.

---

## 5. Test Assertions (Regression Prevention)

### 5.1 New test file: `src/__tests__/compatibility-modal.test.tsx`

```tsx
describe("CompatibilityModal", () => {
  it("renders nothing when closed", () => { /* queryByRole('dialog') is null */ });
  it("opens on trigger and shows carrier-lock warning", () => { /* fireEvent.click(screen.getByText(/téléphone est-il compatible/)); expect(screen.getByRole('dialog')).toBeInTheDocument(); */ });
  it("closes on Escape key", () => { /* fireEvent.keyDown(document, {key:'Escape'}); expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); */ });
  it("closes on backdrop click", () => { /* fireEvent.click(screen.getByLabelText('Fermer')); */ });
  it("uses French copy from the dictionary", () => { /* expect(screen.getByText(/bloqué opérateur/i)).toBeInTheDocument(); */ });
});
```

### 5.2 Extend `plan-card.test.tsx`

```tsx
it("renders network/speed/hotspot decision aids when provided", () => {
  render(<PlanCard pack={pack} networks={["Maroc Telecom"]} hotspot speed="5G" />);
  expect(screen.getByText("Maroc Telecom")).toBeInTheDocument();
  expect(screen.getByText("5G")).toBeInTheDocument();
  expect(screen.getByText(/Partage/)).toBeInTheDocument();
});
it("omits decision aids when props absent", () => {
  render(<PlanCard pack={pack} />);
  expect(screen.queryByText(/Partage/)).not.toBeInTheDocument();
});
it("shows compat link that calls onCompatCheck", () => {
  const onCompatCheck = vi.fn();
  render(<PlanCard pack={pack} onCompatCheck={onCompatCheck} />);
  fireEvent.click(screen.getByText(/téléphone est-il compatible/));
  expect(onCompatCheck).toHaveBeenCalledOnce();
});
```

### 5.3 Extend `funnels.test.tsx`

```tsx
it("every funnel has networks array for decision aids", () => {
  const dict = getDictionary("fr");
  for (const slug of DESTINATION_SLUGS) {
    const f = dict.funnels[slug as keyof typeof dict.funnels];
    expect(f.networks, `${slug} networks`).toBeInstanceOf(Array);
    expect(f.networks.length).toBeGreaterThan(0);
  }
});
it("hotspot is boolean on every funnel", () => {
  // for each funnel: expect(typeof f.hotspot).toBe("boolean");
});
```

### 5.4 Existing tests that MUST still pass unchanged

| Test | Why it's safe |
|---|---|
| `hub.test.tsx` (grid links, Omra absent) | No grid changes in this plan |
| `layout.test.tsx` (brand in header, WhatsApp) | Header untouched |
| `smoke.test.tsx` (health route) | API untouched |
| `packages.test.ts.ts` (seed integrity) | Seed untouched |
| `legal.test.tsx` (legal pages) | Legal untouched |
| `i18n.test.ts.ts` (dictionary loads) | New keys are additive |
| `format.test.ts.ts` (EUR formatting) | Format untouched |

### 5.5 check-i18n guard

Run `npm run check` after all edits. The guard scans `.ts/.tsx` for `t(dict, "...")` calls and verifies every key exists in `fr.json`. New keys MUST be present before build.

---

## 6. Execution Order (for UI specialist)

| Step | Action | Files | Gate |
|---|---|---|---|
| 1 | Add all §2 JSON keys to `fr.json` | `dictionaries/fr.json` | `npm run check` |
| 2 | Create `CompatibilityModal.tsx` | `src/components/compatibility-modal.tsx` | typecheck |
| 3 | Create `PlansSection.tsx` (client wrapper) | `src/components/plans-section.tsx` | typecheck |
| 4 | Update `PlanCard.tsx` (props + decision aids + compat link) | `src/components/plan-card.tsx` | typecheck |
| 5 | Wire `PlansSection` into all 6 funnel pages | `src/app/esim-*/page.tsx` | typecheck |
| 6 | Add networks pills to `FunnelHero` or plans section | `src/components/plans-section.tsx` | typecheck |
| 7 | Write tests §5.1–5.3 | `src/__tests__/*.test.tsx` | `npx vitest run` |
| 8 | Full gate | — | `npm run check && npx tsc --noEmit && npx vitest run && npm run build` |

---

## 7. Out of Scope (explicitly deferred)

- Post-activation "Check Your Connection" (Phase 2, needs live eSIM Access data)
- Side-by-side plan comparison tool (deferred; highlight tag + decision aids cover MVP)
- Carrier-lock *detection* (impossible without device access — modal is informational, not diagnostic)
- Network coverage maps (needs geolocation data — Phase 2)
- Multi-language compat copy (Phase 2 `/de`)

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Funnel pages become client components → lose static prerendering | `PlansSection` is a client island inside a server page; page shell stays static |
| `networks[]` data is guessed (not from eSIM Access API) | Values are based on known operator presence per country; Plan 2 sync will overwrite from live catalog |
| Hotspot `false` for Suisse is wrong | Confirm against eSIM Access package T&C in Plan 2; flip the boolean if needed |
| Modal adds JS weight to funnel pages | ~1.2 kB gzipped; acceptable for the conversion lift |
| `check-i18n` fails on missing keys | All keys defined in §2 before any component references them |
