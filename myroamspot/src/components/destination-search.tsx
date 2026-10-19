import Link from "next/link";
import { DESTINATION_GRID_SLUGS, DESTINATION_FLAGS, DESTINATION_LABELS } from "../lib/destinations";
import { formatEur } from "../lib/format";
import { getDictionary, t } from "../lib/i18n";
import { getPackages } from "../lib/packages";

// Airalo-style popular-locations rows: flag square + country + "dès X €" on
// white pills, all inside the green panel rendered by the hub page.
export function DestinationSearch() {
  const dict = getDictionary("fr");
  return (
    <nav
      aria-label="Destinations"
      className="flex flex-col gap-3"
    >
      {DESTINATION_GRID_SLUGS.map((slug) => {
        // Seed catalog keys omit the "esim-" prefix of the funnel slugs.
        const cheapest = getPackages(slug.slice("esim-".length))[0];
        return (
          <Link
            key={slug}
            href={`/${slug}`}
            aria-label={DESTINATION_LABELS[slug]}
            className="flex h-[72px] items-center justify-between gap-4 rounded-xl bg-white px-4 transition-shadow hover:shadow-airbnb sm:px-5"
          >
            <span className="flex min-w-0 items-center gap-4">
              <img
                src={DESTINATION_FLAGS[slug]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-md object-cover"
              />
              <span className="truncate text-base font-semibold text-foreground">
                {DESTINATION_LABELS[slug]}
              </span>
            </span>
            {cheapest && (
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                {t(dict, "plan.from")}{" "}
                <span className="text-base font-bold text-foreground">{formatEur(cheapest.priceCents)}</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
