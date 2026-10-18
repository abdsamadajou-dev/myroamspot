import Link from "next/link";
import { DESTINATION_SLUGS, DESTINATION_LABELS, DESTINATION_PHOTOS } from "../lib/destinations";
import { formatEur } from "../lib/format";
import { getDictionary, t } from "../lib/i18n";
import { getPackages } from "../lib/packages";

// Airbnb-style property cards: 1:1 photo plate with {rounded.md} clipping and
// the hover float (the system's only shadow tier), then a sparse meta block —
// title, muted product line, price right-aligned in ink.
export function DestinationSearch() {
  const dict = getDictionary("fr");
  return (
    <nav
      aria-label="Destinations"
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {DESTINATION_SLUGS.map((slug) => {
        const photo = DESTINATION_PHOTOS[slug];
        // Seed catalog keys omit the "esim-" prefix of the funnel slugs.
        const cheapest = getPackages(slug.slice("esim-".length))[0];
        return (
          <Link
            key={slug}
            href={`/${slug}`}
            aria-label={DESTINATION_LABELS[slug]}
            className="group block text-left"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-2.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-foreground">
                  {DESTINATION_LABELS[slug]}
                </h3>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {t(dict, "home.cardMeta")}
                </p>
              </div>
              {cheapest && (
                <p className="whitespace-nowrap text-sm text-foreground">
                  <span className="font-semibold">{t(dict, "plan.from")}</span>{" "}
                  <span className="font-semibold">{formatEur(cheapest.priceCents)}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {t(dict, "plan.ttc")}
                  </span>
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
