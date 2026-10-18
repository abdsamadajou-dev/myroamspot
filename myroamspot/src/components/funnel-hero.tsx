import { getDictionary, t } from "../lib/i18n";

export function FunnelHero({ slug }: { slug: string }) {
  const dict = getDictionary("fr");
  const funnel = dict.funnels[slug as keyof typeof dict.funnels];
  return (
    <header className="mx-auto max-w-5xl px-4 py-10 text-center sm:py-14">
      <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{funnel.title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{funnel.description}</p>
      <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
        {funnel.badges.map((badge) => (
          <li key={badge} className="rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-sm">
            {badge}
          </li>
        ))}
      </ul>
    </header>
  );
}
