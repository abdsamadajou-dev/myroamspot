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

// License-safe photography (Unsplash license permits hotlinking). Serve-side
// params keep the payload small (800px, auto format). When the catalog moves to
// Supabase (Plan 2), these URLs move with it; alts stay French for MVP.
const UNSPLASH = (
  id: string,
): string => `https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`;

export type DestinationPhoto = { src: string; alt: string };

export const DESTINATION_PHOTOS: Record<(typeof DESTINATION_SLUGS)[number], DestinationPhoto> = {
  "esim-omra": {
    src: UNSPLASH("1627728734379-a5f8c099763e"),
    alt: "La Kaaba, Masjid al-Haram, La Mecque",
  },
  "esim-arabie-saoudite": {
    src: UNSPLASH("1694018359679-49465b4c0d61"),
    alt: "Kingdom Centre, Riyad",
  },
  "esim-maroc": {
    src: UNSPLASH("1597212618440-806262de4f6b"),
    alt: "Mosquée Koutoubia à Marrakech, Atlas enneigé en arrière-plan",
  },
  "esim-suisse": {
    src: UNSPLASH("1617395547071-98efcee72011"),
    alt: "Le Cervin sous un ciel bleu",
  },
  "esim-turquie": {
    src: UNSPLASH("1623621534850-d325a1980c7e"),
    alt: "Sainte-Sophie au coucher du soleil, Istanbul",
  },
  "esim-emirats-arabes-unis": {
    src: UNSPLASH("1746731341056-2f453a44ebcb"),
    alt: "Burj Khalifa au-dessus de la skyline de Dubaï",
  },
};
