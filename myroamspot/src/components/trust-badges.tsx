import { getDictionary, t } from "../lib/i18n";

function ShieldCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-green-600">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function TrustBadges() {
  const dict = getDictionary("fr");
  const badges = [t(dict, "trust.ttc"), t(dict, "trust.coverage"), t(dict, "trust.install"), t(dict, "trust.support")];
  return (
    <section aria-label="Garanties" className="mx-auto max-w-5xl px-4">
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <li key={badge} className="flex items-center gap-2 rounded-xl border bg-white/70 px-4 py-3 text-sm shadow-sm">
            <ShieldCheckIcon />
            {badge}
          </li>
        ))}
      </ul>
    </section>
  );
}
