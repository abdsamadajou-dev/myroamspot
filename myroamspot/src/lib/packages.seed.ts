export type Package = {
  slug: string;
  destinationSlug: string;
  nameFr: string;
  days: number;
  dataGb: number;
  priceCents: number;
  active: boolean;
  // Marks the recommended tier ("Le Choix des Voyageurs") on funnel pages.
  highlight?: boolean;
};

// Launch catalog, deterministically seeded (Plan 2 migrates this to Supabase
// and adds wholesale_net_cents + esim_access_package_id per row).
// Prices are integer cents, TTC, psychological x,99 € tiers.
export const PACKAGES: Package[] = [
  // Arabie saoudite (also powers the Omra funnel)
  { slug: "sa-express", destinationSlug: "arabie-saoudite", nameFr: "Express", days: 10, dataGb: 5, priceCents: 1299, active: true },
  { slug: "sa-complete", destinationSlug: "arabie-saoudite", nameFr: "Complete", days: 15, dataGb: 10, priceCents: 1999, active: true, highlight: true },
  { slug: "sa-extended", destinationSlug: "arabie-saoudite", nameFr: "Extended", days: 30, dataGb: 20, priceCents: 2999, active: true },
  // Maroc
  { slug: "ma-7j-5go", destinationSlug: "maroc", nameFr: "Maroc 7 jours", days: 7, dataGb: 5, priceCents: 999, active: true },
  { slug: "ma-15j-10go", destinationSlug: "maroc", nameFr: "Maroc 15 jours", days: 15, dataGb: 10, priceCents: 1699, active: true, highlight: true },
  // Suisse
  { slug: "ch-7j-3go", destinationSlug: "suisse", nameFr: "Suisse 7 jours", days: 7, dataGb: 3, priceCents: 899, active: true },
  { slug: "ch-14j-10go", destinationSlug: "suisse", nameFr: "Suisse 14 jours", days: 14, dataGb: 10, priceCents: 1899, active: true, highlight: true },
  // Turquie
  { slug: "tr-7j-3go", destinationSlug: "turquie", nameFr: "Turquie 7 jours", days: 7, dataGb: 3, priceCents: 799, active: true },
  { slug: "tr-15j-10go", destinationSlug: "turquie", nameFr: "Turquie 15 jours", days: 15, dataGb: 10, priceCents: 1499, active: true, highlight: true },
  // Émirats arabes unis
  { slug: "ae-7j-3go", destinationSlug: "emirats-arabes-unis", nameFr: "Émirats 7 jours", days: 7, dataGb: 3, priceCents: 999, active: true },
  { slug: "ae-14j-10go", destinationSlug: "emirats-arabes-unis", nameFr: "Émirats 14 jours", days: 14, dataGb: 10, priceCents: 1999, active: true, highlight: true },
];
