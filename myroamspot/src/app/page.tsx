import { Search } from "lucide-react";
import { DestinationSearch } from "../components/destination-search";
import { getDictionary, t } from "../lib/i18n";

// Airbnb homepage anatomy: quiet 28px/700 hero, the pill bar (white, fully
// rounded, hairline segments, circular Rausch orb) then a dense photo grid.
export default function Home() {
  const dict = getDictionary("fr");
  return (
    <main className="pb-16">
      <section className="mx-auto max-w-5xl px-4 pt-12 text-center sm:pt-16">
        <h1 className="mx-auto max-w-2xl text-[28px] font-bold leading-snug tracking-tight text-foreground sm:text-[30px]">
          {t(dict, "home.heroTitle")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t(dict, "home.heroSubtitle")}</p>
      </section>

      <section aria-label={t(dict, "nav.destinations")} className="mx-auto max-w-5xl px-4 sm:px-6">
        <a
          href="#destinations"
          className="mx-auto mt-8 flex h-16 w-full max-w-xl items-center rounded-full border border-border bg-white pr-2 pl-8 text-left shadow-airbnb transition-shadow"
        >
          <span className="flex min-w-0 flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              {t(dict, "home.searchLabel")}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {t(dict, "home.searchPlaceholder")}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-[#e00b41]"
          >
            <Search className="h-5 w-5" strokeWidth={2.5} />
          </span>
        </a>

        <div id="destinations" className="mt-10 scroll-mt-24">
          <div className="rounded-3xl bg-[#3f9b6f] p-6 sm:p-8">
            <h2 className="text-[26px] font-bold leading-tight text-foreground sm:text-[28px]">
              {t(dict, "home.popularHeading")}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-black/70">
              {t(dict, "home.popularSubtitle")}
            </p>
            <div className="mt-6">
              <DestinationSearch />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
        <h2 id="steps-title" className="text-center text-[21px] font-bold text-foreground">
          {t(dict, "home.stepsHeading")}
        </h2>
        <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {dict.home.steps.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-border bg-white p-6">
              <p
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground"
              >
                {index + 1}
              </p>
              <p className="mt-3 text-base font-semibold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="aide"
        className="mx-auto mt-16 max-w-5xl scroll-mt-24 rounded-xl border border-border bg-white px-6 py-8 sm:px-8"
      >
        <h2 className="text-[21px] font-semibold text-foreground">{t(dict, "support.whatsappCta")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t(dict, "support.hubBlurb")}</p>
      </section>
    </main>
  );
}
