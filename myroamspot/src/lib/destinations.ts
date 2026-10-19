// The locked funnel slugs. Any other /esim-* route must 404 (no dynamic
// catch-all exists — see plan Task 7). French labels for MVP only; when /de
// launches in Phase 2, move labels into the dictionaries.
export const DESTINATION_SLUGS = [
  "esim-omra",
  "esim-arabie-saoudite",
  "esim-maroc",
  "esim-suisse",
  "esim-turquie",
  "esim-emirats-arabes-unis",
  // Popular additions requested by the owner (Airalo-style homepage panel).
  "esim-espagne",
  "esim-italie",
  "esim-grece",
  "esim-portugal",
  "esim-etats-unis",
  "esim-thailande",
] as const;

export type DestinationSlug = (typeof DESTINATION_SLUGS)[number];

export const DESTINATION_LABELS: Record<(typeof DESTINATION_SLUGS)[number], string> = {
  "esim-omra": "Omra",
  "esim-arabie-saoudite": "Arabie saoudite",
  "esim-maroc": "Maroc",
  "esim-suisse": "Suisse",
  "esim-turquie": "Turquie",
  "esim-emirats-arabes-unis": "Émirats arabes unis",
  "esim-espagne": "Espagne",
  "esim-italie": "Italie",
  "esim-grece": "Grèce",
  "esim-portugal": "Portugal",
  "esim-etats-unis": "États-Unis",
  "esim-thailande": "Thaïlande",
};

// Grid on the homepage shows the country cards — Saudi Arabia represents
// the kingdom, and the Omra edition is reached via the callout inside
// /esim-arabie-saoudite plus its own SEO funnel. /esim-omra stays a route and
// stays in the sitemap.
export const DESTINATION_GRID_SLUGS: readonly DestinationSlug[] = DESTINATION_SLUGS.filter(
  (slug) => slug !== "esim-omra",
);

// Flags for the Airalo-style popular-locations rows (flagcdn.com — free CDN,
// no key). Kept as ISO codes next to the slugs they must match.
const FLAG_CODES: Record<(typeof DESTINATION_SLUGS)[number], string> = {
  "esim-omra": "sa",
  "esim-arabie-saoudite": "sa",
  "esim-maroc": "ma",
  "esim-suisse": "ch",
  "esim-turquie": "tr",
  "esim-emirats-arabes-unis": "ae",
  "esim-espagne": "es",
  "esim-italie": "it",
  "esim-grece": "gr",
  "esim-portugal": "pt",
  "esim-etats-unis": "us",
  "esim-thailande": "th",
};

export const DESTINATION_FLAGS: Record<(typeof DESTINATION_SLUGS)[number], string> = Object.fromEntries(
  Object.entries(FLAG_CODES).map(([slug, code]) => [slug, `https://flagcdn.com/w80/${code}.png`]),
) as Record<(typeof DESTINATION_SLUGS)[number], string>;
