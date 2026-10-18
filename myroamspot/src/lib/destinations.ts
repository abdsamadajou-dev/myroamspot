// The six allowed funnel slugs. Any other /esim-* route must 404 (no dynamic
// catch-all exists — see plan Task 7). French labels for MVP only; when /de
// launches in Phase 2, move labels into the dictionaries.
export const DESTINATION_SLUGS = [
  "esim-omra",
  "esim-arabie-saoudite",
  "esim-maroc",
  "esim-suisse",
  "esim-turquie",
  "esim-emirats-arabes-unis",
] as const;

export type DestinationSlug = (typeof DESTINATION_SLUGS)[number];

export const DESTINATION_LABELS: Record<(typeof DESTINATION_SLUGS)[number], string> = {
  "esim-omra": "Omra",
  "esim-arabie-saoudite": "Arabie saoudite",
  "esim-maroc": "Maroc",
  "esim-suisse": "Suisse",
  "esim-turquie": "Turquie",
  "esim-emirats-arabes-unis": "Émirats arabes unis",
};
