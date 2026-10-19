import Link from "next/link";
import { DESTINATION_GRID_SLUGS, DESTINATION_FLAGS, DESTINATION_LABELS } from "../lib/destinations";
import { formatEur } from "../lib/format";
import { getDictionary, t } from "../lib/i18n";
import { getPackages } from "../lib/packages";

// Apple store-utility-card rows (DESIGN.md): white pills on the parchment
// band, 1px hairline border, 18px radius, no shadow. Flag at {rounded.sm},
// product name in body-strong (17px/600), price anchored right. All inside
// the parchment band rendered by the hub page.
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
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-white py-3.5 pl-4 pr-5 transition-colors hover:border-[#1d1d1f]/30 sm:pl-5"
          >
            <span className="flex min-w-0 items-center gap-4">
              <img
                src={DESTINATION_FLAGS[slug]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={24}
                height={24}
                className="h-6 w-6 shrink-0 rounded-sm object-cover"
              />
              <span className="truncate text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                {DESTINATION_LABELS[slug]}
              </span>
            </span>
            {cheapest && (
              <span className="whitespace-nowrap text-[13px] text-muted-foreground">
                {t(dict, "plan.from")}{" "}
                <span className="text-[17px] font-semibold text-foreground">{formatEur(cheapest.priceCents)}</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
