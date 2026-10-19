import { formatEur } from "../../lib/format";
import { getDictionary, t } from "../../lib/i18n";
import type { Package } from "../../lib/packages.seed";

export type PlanCardProps = {
  pack: Package;
  /** Partner networks for the destination (from fr.json funnel config). */
  networks?: string[];
  /** Tethering allowed for this destination's eSIM profiles. */
  hotspot?: boolean;
  /** Max speed tier label, e.g. "5G / 4G LTE". */
  speed?: string;
  /** Opens the device-compatibility modal (owned by PlansSection). */
  onCompatCheck?: () => void;
};

// Airbnb reservation-card skin: white, 14px radius, hairline border. Top block
// answers "what do I get" (data/validity/price), middle "will it work"
// (decision-aid pills), bottom "how do I commit" (price-anchored CTA +
// micro-reassurance + self-serve compatibility check).
export default function PlanCard({ pack, networks = [], hotspot = false, speed, onCompatCheck }: PlanCardProps) {
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
          <span className="text-[21px] font-bold text-foreground">{formatEur(pack.priceCents)}</span>
        )}
      </div>
      <ul className="mt-3 flex items-baseline gap-3">
        <li className="text-base font-bold text-foreground">
          {pack.dataGb} {t(dict, "plan.data")}
        </li>
        <li className="text-sm text-muted-foreground">
          {pack.days} {t(dict, "plan.days")}
        </li>
      </ul>
      {(networks.length > 0 || speed) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {speed && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
              {speed}
            </span>
          )}
          {networks.map((network) => (
            <span
              key={network}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
              data-testid="network-pill"
            >
              {t(dict, "plan.networksLabel")} : {network}
            </span>
          ))}
          {hotspot && !soldOut && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
              {t(dict, "plan.hotspotLabel")} : {t(dict, "plan.yes")}
            </span>
          )}
        </div>
      )}
      {!soldOut && (
        <>
          <button
            type="button"
            className="mt-6 h-12 rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-[#e00b41]"
          >
            {t(dict, "plan.buy")} • {formatEur(pack.priceCents)}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">{t(dict, "plan.reassurance")}</p>
        </>
      )}
      {onCompatCheck && (
        <button
          type="button"
          onClick={onCompatCheck}
          data-testid="compat-trigger"
          className="mt-3 self-center text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {t(dict, "plan.compatCta")}
        </button>
      )}
    </div>
  );
}
