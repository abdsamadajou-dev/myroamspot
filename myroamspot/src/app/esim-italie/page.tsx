import { FunnelHero } from "../../components/funnel-hero";
import { TrustBadges } from "../../components/trust-badges";
import { Faq } from "../../components/faq";
import { PlansSection } from "../../components/funnel/plans-section";
import { getPackages } from "../../lib/packages";
import { buildFunnelMetadata, buildProductJsonLd } from "../../lib/seo";
import { getDictionary, t } from "../../lib/i18n";

const slug = "esim-italie";
const destinationSlug = "italie";

export const metadata = buildFunnelMetadata(slug);

export default function ItaliePage() {
  const dict = getDictionary("fr");
  const packs = getPackages(destinationSlug);
  return (
    <main>
      <FunnelHero slug={slug} />
      <TrustBadges />
      <section aria-labelledby="plans-title" className="mx-auto max-w-5xl px-4 py-10">
        <h2 id="plans-title" className="mb-6 text-center text-[21px] font-bold">
          {t(dict, "ui.plansHeading")}
        </h2>
        <PlansSection packs={packs} funnelSlug={slug} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(packs[0])) }}
        />
      </section>
      <Faq slug={slug} />
    </main>
  );
}
