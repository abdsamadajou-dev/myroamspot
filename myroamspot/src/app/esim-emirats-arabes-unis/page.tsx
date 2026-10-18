import { FunnelHero } from "../../components/funnel-hero";
import { TrustBadges } from "../../components/trust-badges";
import { Faq } from "../../components/faq";
import PlanCard from "../../components/plan-card";
import { getPackages } from "../../lib/packages";
import { buildFunnelMetadata, buildProductJsonLd } from "../../lib/seo";
import { getDictionary, t } from "../../lib/i18n";

const slug = "esim-emirats-arabes-unis";
const destinationSlug = "emirats-arabes-unis";

export const metadata = buildFunnelMetadata(slug);

export default function EmiratsPage() {
  const dict = getDictionary("fr");
  const packs = getPackages(destinationSlug);
  return (
    <main>
      <FunnelHero slug={slug} />
      <TrustBadges />
      <section aria-labelledby="plans-title" className="mx-auto max-w-3xl px-4 py-10">
        <h2 id="plans-title" className="mb-6 text-center text-[21px] font-bold">
          {t(dict, "ui.plansHeading")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {packs.map((pack) => (
            <PlanCard key={pack.slug} pack={pack} />
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(packs[0])) }}
        />
      </section>
      <Faq slug={slug} />
    </main>
  );
}


