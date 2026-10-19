import { Search } from "lucide-react";
import { DestinationSearch } from "../components/destination-search";
import { getDictionary, t } from "../lib/i18n";

// Apple homepage anatomy (DESIGN.md): full-bleed tile stack, centered hero
// headline (display-lg 40px/600, Apple-tight tracking) → tagline → pill
// search-input; then a parchment band (the color change is the divider) for
// the popular-destinations utility rows; hairline utility cards for the
// steps; a dark product-tile band for support; parchment footer.
export default function Home() {
  const dict = getDictionary("fr");
  return (
    <main className="pb-0">
      {/* light tile: white canvas */}
      <section className="mx-auto max-w-5xl px-4 pb-14 pt-14 text-center sm:px-6 sm:pt-20">
        <h1 className="mx-auto max-w-2xl text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[40px]">
          {t(dict, "home.heroTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[17px] leading-[1.47] text-muted-foreground">
          {t(dict, "home.heroSubtitle")}
        </p>
        <a
          href="#destinations"
          className="mx-auto mt-8 flex h-11 w-full max-w-md items-center gap-3 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-5 text-left transition-colors hover:border-[#1d1d1f]/30"
        >
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-[17px] font-normal text-muted-foreground">
            {t(dict, "home.searchPlaceholder")}
          </span>
        </a>
      </section>

      {/* parchment tile: destinations full-bleed band */}
      <section aria-label={t(dict, "nav.destinations")} className="mt-4 scroll-mt-28 bg-[#f5f5f7] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[32px]">
            {t(dict, "home.popularHeading")}
          </h2>
          <p className="mt-2 max-w-xl text-[17px] text-muted-foreground">{t(dict, "home.popularSubtitle")}</p>
          <div id="destinations" className="mt-8">
            <DestinationSearch />
          </div>
        </div>
      </section>

      {/* white tile: hairline utility cards */}
      <section aria-labelledby="steps-title" className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
        <h2 id="steps-title" className="text-center text-[26px] font-semibold tracking-[-0.02em] text-foreground sm:text-[32px]">
          {t(dict, "home.stepsHeading")}
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {dict.home.steps.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-border bg-white p-6">
              <p aria-hidden="true" className="text-[12px] font-semibold text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-[17px] font-semibold tracking-[-0.02em] text-foreground">{step.title}</p>
              <p className="mt-1.5 text-sm leading-[1.43] text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* dark tile: support */}
      <section
        id="aide"
        className="mt-16 scroll-mt-28 bg-[#272729] px-4 py-14 sm:px-6"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-white">{t(dict, "support.whatsappCta")}</h2>
          <p className="mt-3 max-w-2xl text-[17px] leading-[1.47] text-[#cccccc]">{t(dict, "support.hubBlurb")}</p>
        </div>
      </section>
    </main>
  );
}
