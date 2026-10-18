import { formatEur } from "../lib/format";
import { getDictionary, t } from "../lib/i18n";
import type { Package } from "../lib/packages.seed";

// Airbnb reservation-card skin: white, 14px radius, hairline border, sparse
// ink text; the Rausch CTA is 48px tall so it clears the touch-target bar.
// Bestselling plans carry a tag; every CTA gets micro-reassurance.
export default function PlanCard({ pack }: { pack: Package }) {
  const dict = getDictionary("fr");
  const soldOut = pack.priceCents <= 0;
  return (
    <div className="relative flex flex-col rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-airbnb">
      {pack.highlight && (
        <p className="mb-3 -mt-1 inline-block self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-foreground">
          {t(dict, "plan.bestTag")}
        </p>
      )}
      <h3 className="text-base font-semibold text-foreground">{pack.nameFr}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        {soldOut ? (
          <span className="text-[21px] font-bold text-muted-foreground">—</span>
        ) : (
          <>
            <span className="text-[21px] font-bold text-foreground">{formatEur(pack.priceCents)}</span>
            <span className="text-xs text-muted-foreground">{t(dict, "plan.ttc")}</span>
          </>
        )}
      </div>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        <li>
          {pack.days} {t(dict, "plan.days")}
        </li>
        <li>
          {pack.dataGb} {t(dict, "plan.data")}
        </li>
      </ul>
      {!soldOut && (
        <>
          <button
            type="button"
            className="mt-6 h-12 rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-[#e00b41]"
          >
            {t(dict, "plan.buy")}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">{t(dict, "plan.reassurance")}</p>
        </>
      )}
    </div>
  );
}
