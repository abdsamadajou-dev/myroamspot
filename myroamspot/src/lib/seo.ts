import type { Metadata } from "next";
import { getDictionary } from "./i18n";
import { SITE_URL } from "./site";
import type { Package } from "./packages.seed";

const dict = getDictionary("fr");

export function buildFunnelMetadata(slug: string): Metadata {
  const funnel = dict.funnels[slug as keyof typeof dict.funnels];
  if (!funnel) throw new Error(`Unknown funnel slug: ${slug}`);
  return {
    title: funnel.title,
    description: funnel.description,
    alternates: { canonical: `${SITE_URL}/${slug}` },
  };
}

export function buildProductJsonLd(pack: Package): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pack.nameFr,
    offers: {
      "@type": "Offer",
      price: (pack.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };
}
