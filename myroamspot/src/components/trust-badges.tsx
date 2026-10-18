import { ShieldCheck } from "lucide-react";
import { getDictionary, t } from "../lib/i18n";

// Airbnb keeps trust signals in ink — a colored checkmark row reads cheap next
// to Rausch, which must stay the only saturated moment on the page.
export function TrustBadges() {
  const dict = getDictionary("fr");
  const badges = [t(dict, "trust.ttc"), t(dict, "trust.coverage"), t(dict, "trust.install"), t(dict, "trust.support")];
  return (
    <section aria-label="Garanties" className="mx-auto max-w-5xl px-4">
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <li
            key={badge}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground"
          >
            <ShieldCheck aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-foreground" />
            {badge}
          </li>
        ))}
      </ul>
    </section>
  );
}
