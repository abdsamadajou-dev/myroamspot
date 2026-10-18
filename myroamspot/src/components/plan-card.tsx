import { formatEur } from "../lib/format";
import { getDictionary, t } from "../lib/i18n";
import type { Package } from "../lib/packages.seed";

export default function PlanCard({ pack }: { pack: Package }) {
  const dict = getDictionary("fr");
  const soldOut = pack.priceCents <= 0;
  return (
    <div className="flex flex-col rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold">{pack.nameFr}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        {soldOut ? (
          <span className="text-2xl font-bold text-muted-foreground">—</span>
        ) : (
          <>
            <span className="text-2xl font-bold">{formatEur(pack.priceCents)}</span>
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
        <button type="button" className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          {t(dict, "plan.buy")}
        </button>
      )}
    </div>
  );
}
