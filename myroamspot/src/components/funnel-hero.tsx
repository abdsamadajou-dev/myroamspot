import { getDictionary, t } from "../lib/i18n";

// Apple tile hero (DESIGN.md): {typography.display-md} 34px/600 headline with
// Apple-tight tracking, 17px body subcopy, badges as quiet hairline pills.
export function FunnelHero({ slug }: { slug: string }) {
  const dict = getDictionary("fr");
  const funnel = dict.funnels[slug as keyof typeof dict.funnels];
  return (
    <header className="mx-auto max-w-5xl px-4 pb-6 pt-12 text-center sm:pt-16">
      <h1 className="mx-auto max-w-2xl text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[34px]">
        {funnel.title}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-[17px] leading-[1.47] text-muted-foreground">{funnel.description}</p>
      <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
        {funnel.badges.map((badge) => (
          <li
            key={badge}
            className="rounded-full border border-border bg-white px-4 py-1.5 text-[13px] font-normal text-foreground/90"
          >
            {badge}
          </li>
        ))}
      </ul>
    </header>
  );
}
