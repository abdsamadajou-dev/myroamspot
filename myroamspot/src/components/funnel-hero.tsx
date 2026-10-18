import { getDictionary, t } from "../lib/i18n";

// Airbnb listing-detail hero: quiet 22–28px/500–700 title; the photography
// above does the shouting, the badges are small white pills.
export function FunnelHero({ slug }: { slug: string }) {
  const dict = getDictionary("fr");
  const funnel = dict.funnels[slug as keyof typeof dict.funnels];
  return (
    <header className="mx-auto max-w-5xl px-4 pb-6 pt-10 text-center sm:pt-12">
      <h1 className="mx-auto max-w-2xl text-[26px] font-bold tracking-tight text-foreground sm:text-[30px]">
        {funnel.title}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{funnel.description}</p>
      <ul className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
        {funnel.badges.map((badge) => (
          <li
            key={badge}
            className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-foreground shadow-airbnb"
          >
            {badge}
          </li>
        ))}
      </ul>
    </header>
  );
}
