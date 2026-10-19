import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDictionary, t } from "../lib/i18n";

// High-intent hero callout on /esim-arabie-saoudite pointing pilgrims to the
// dedicated Omra funnel. Pearl-capsule band (hairline ring, white surface) —
// Action Blue stays reserved for the text-link.
export function OmraCallout() {
  const dict = getDictionary("fr");
  return (
    <aside className="mx-auto max-w-5xl px-4">
      <div className="rounded-lg border border-border bg-white px-6 py-5 text-center">
        <p className="mx-auto max-w-2xl text-[15px] text-foreground sm:text-[17px]">
          {t(dict, "funnels.esim-arabie-saoudite.callout.text")}
        </p>
        <Link
          href="/esim-omra"
          className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-normal text-primary underline-offset-2 hover:underline"
        >
          {t(dict, "funnels.esim-arabie-saoudite.callout.cta")}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
