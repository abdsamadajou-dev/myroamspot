import Link from "next/link";
import { Plane } from "lucide-react";
import { getDictionary, t } from "../lib/i18n";
import { BRAND } from "../lib/site";
import { NavTabs } from "./nav-tabs";

// Apple two-row nav (DESIGN.md): thin black {global-nav} (44px) with the
// brand glyph and 12px on-dark links, then a sticky frosted {sub-nav-frosted}
// (52px, parchment 80% + backdrop blur) carrying the wordmark/tagline and the
// persistent primary CTA.
export function SiteHeader() {
  const dict = getDictionary("fr");
  const nav = [
    { label: t(dict, "nav.home"), href: "/" },
    { label: t(dict, "nav.destinations"), href: "/#destinations" },
    { label: t(dict, "nav.help"), href: "/#aide" },
  ];
  return (
    <header className="sticky top-0 z-40">
      {/* global-nav: pure black is reserved for this bar */}
      <div className="bg-[#000000]">
        <div className="mx-auto flex h-11 max-w-5xl items-center justify-between px-4 sm:px-6">
          <NavTabs items={nav} />
          <p className="hidden text-xs text-white/60 sm:block">{t(dict, "site.locale")}</p>
        </div>
      </div>
      {/* sub-nav-frosted: wordmark left, buy pill right */}
      <div className="border-b border-[rgba(0,0,0,0.08)] bg-[#f5f5f7]/80 backdrop-saturate-150 backdrop-blur-xl">
        <div className="mx-auto flex h-13 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[21px] font-semibold tracking-[-0.02em] text-foreground"
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#1d1d1f] text-white"
            >
              <Plane className="h-4 w-4" strokeWidth={2} />
            </span>
            {BRAND}
          </Link>
          <Link
            href="/#destinations"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-normal text-primary-foreground transition-[transform,background-color] hover:bg-[#0071e3] active:scale-[0.95]"
          >
            {t(dict, "nav.buy")}
          </Link>
        </div>
      </div>
    </header>
  );
}
