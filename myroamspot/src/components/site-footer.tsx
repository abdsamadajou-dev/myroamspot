import Link from "next/link";
import { BRAND } from "../lib/site";
import { getDictionary, t } from "../lib/i18n";

// Legal routes must exist as static pages — see src/app/{mentions-legales,cgv,politique-de-confidentialite}/
const legalLinks = [
  { key: "mentions" as const, href: "/mentions-legales" },
  { key: "cgv" as const, href: "/cgv" },
  { key: "privacy" as const, href: "/politique-de-confidentialite" },
];

export function SiteFooter() {
  const dict = getDictionary("fr");
  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{BRAND}</p>
          <p className="text-muted-foreground">{t(dict, "site.tagline")}</p>
        </div>
        <nav className="flex flex-wrap gap-4">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {t(dict, `legal.links.${link.key}`)}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">{t(dict, "legal.hosting")}</p>
      </div>
    </footer>
  );
}
