import { ShieldCheck } from "lucide-react";
import { getDictionary, t } from "../lib/i18n";

// Apple utility strip (DESIGN.md): hairline-bordered white cards, caption
// 14px/400, icon muted — trust signals stay quiet, Action Blue stays
// reserved for interactive elements only.
export function TrustBadges() {
  const dict = getDictionary("fr");
  const badges = [t(dict, "trust.ttc"), t(dict, "trust.coverage"), t(dict, "trust.install"), t(dict, "trust.support")];
  return (
    <section aria-label="Garanties" className="mx-auto max-w-5xl px-4">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <li
            key={badge}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground"
          >
            <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
            {badge}
          </li>
        ))}
      </ul>
    </section>
  );
}
