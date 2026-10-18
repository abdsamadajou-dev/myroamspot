import Link from "next/link";
import { Plane } from "lucide-react";
import { getDictionary, t } from "../lib/i18n";
import { BRAND } from "../lib/site";
import { NavTabs } from "./nav-tabs";

// Airbnb-style 80px top-nav: white surface, 1px bottom hairline, brand flush
// left, product tabs dead-center, utilities flush right.
export function SiteHeader() {
  const dict = getDictionary("fr");
  const nav = [
    { label: t(dict, "nav.home"), href: "/" },
    { label: t(dict, "nav.destinations"), href: "/#destinations" },
    { label: t(dict, "nav.help"), href: "/#aide" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="relative mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <Plane className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-foreground">{BRAND}</span>
        </Link>
        <NavTabs items={nav} />
        <p className="hidden text-sm font-medium text-muted-foreground sm:block">
          {t(dict, "site.locale")}
        </p>
      </div>
    </header>
  );
}
