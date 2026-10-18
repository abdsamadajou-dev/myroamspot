import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDictionary, t } from "../lib/i18n";

// High-intent hero callout on /esim-arabie-saoudite pointing pilgrims to the
// dedicated Omra funnel. Rausch-tinted surface — the one saturated moment on
// the page stays the CTA.
export function OmraCallout() {
  const dict = getDictionary("fr");
  return (
    <aside className="mx-auto max-w-5xl px-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5 text-center">
        <p className="mx-auto max-w-2xl text-sm text-foreground sm:text-[15px]">
          {t(dict, "funnels.esim-arabie-saoudite.callout.text")}
        </p>
        <Link
          href="/esim-omra"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          {t(dict, "funnels.esim-arabie-saoudite.callout.cta")}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
