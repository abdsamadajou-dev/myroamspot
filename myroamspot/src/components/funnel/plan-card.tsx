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

// Apple store-utility-card skin (DESIGN.md): white, 1px hairline border,
// 18px radius, no shadow (elevation is reserved for product imagery). Top
// block answers "what do I get" (data/validity/price), middle "will it work"
// (decision-aid chips in the configurator-chip grammar), bottom "how do I
// commit" (Action Blue pill CTA + micro-reassurance + self-serve compat
// check as a text-link). Press state is the system-wide scale(0.95).
export default function PlanCard({ pack, networks = [], hotspot = false, speed, onCompatCheck }: PlanCardProps) {
  const dict = getDictionary("fr");
  const soldOut = pack.priceCents <= 0;
  return (
    <div className="relative flex flex-col rounded-lg border border-border bg-white p-6">
      {pack.highlight && (
        <p className="mb-3 -mt-1 self-start rounded-full bg-primary/10 px-3 py-1 text-[13px] font-semibold text-primary">
          {t(dict, "plan.bestTag")}
        </p>
      )}
      <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">{pack.nameFr}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        {soldOut ? (
          <span className="text-[21px] font-semibold text-muted-foreground">—</span>
        ) : (
          <span className="text-[21px] font-semibold tracking-[-0.02em] text-foreground">{formatEur(pack.priceCents)}</span>
        )}
      </div>
      <ul className="mt-3 flex items-baseline gap-3">
        <li className="text-[17px] font-semibold text-foreground">
          {pack.dataGb} {t(dict, "plan.data")}
        </li>
        <li className="text-sm text-muted-foreground">
          {pack.days} {t(dict, "plan.days")}
        </li>
      </ul>
      {(networks.length > 0 || speed) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {speed && (
            <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-normal text-foreground/90">
              {speed}
            </span>
          )}
          {networks.map((network) => (
            <span
              key={network}
              className="rounded-full border border-border bg-white px-3 py-1 text-xs font-normal text-foreground/90"
              data-testid="network-pill"
            >
              {network}
            </span>
          ))}
          {hotspot && !soldOut && (
            <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-normal text-foreground/90">
              {t(dict, "plan.hotspotLabel")} : {t(dict, "plan.yes")}
            </span>
          )}
        </div>
      )}
      {!soldOut && (
        <div className="mt-auto pt-6">
          <button
            type="button"
            className="h-12 w-full rounded-full bg-primary px-6 text-[15px] font-normal text-primary-foreground transition-[transform,background-color] hover:bg-[#0071e3] active:scale-[0.95]"
          >
            {t(dict, "plan.buy")} • {formatEur(pack.priceCents)}
          </button>
          <p className="mt-2 text-center text-[12px] text-muted-foreground">{t(dict, "plan.reassurance")}</p>
        </div>
      )}
      {onCompatCheck && (
        <button
          type="button"
          onClick={onCompatCheck}
          data-testid="compat-trigger"
          className="mt-3 self-center text-[13px] font-normal text-primary transition-colors hover:underline"
        >
          {t(dict, "plan.compatCta")}
        </button>
      )}
    </div>
  );
}
