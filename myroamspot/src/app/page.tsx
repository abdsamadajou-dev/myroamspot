import { DestinationSearch } from "../components/destination-search";
import { getDictionary, t } from "../lib/i18n";

export default function Home() {
  const dict = getDictionary("fr");
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12 text-center sm:py-20">
      <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
        {t(dict, "home.heroTitle")}
      </h1>
      <p className="max-w-xl text-muted-foreground">{t(dict, "home.heroSubtitle")}</p>
      <div id="destinations" className="w-full max-w-xl">
        <p className="mb-3 text-sm text-muted-foreground">{t(dict, "home.searchPlaceholder")}</p>
        <DestinationSearch />
      </div>
      <section id="aide" className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t(dict, "support.whatsappCta")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t(dict, "support.hubBlurb")}</p>
      </section>
    </main>
  );
}
