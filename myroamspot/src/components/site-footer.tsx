import Link from "next/link";
import { Plane } from "lucide-react";
import { BRAND } from "../lib/site";
import { getDictionary, t } from "../lib/i18n";

// Legal routes must exist as static pages — see src/app/{mentions-legales,cgv,politique-de-confidentialite}/
const legalLinks = [
  { key: "mentions" as const, href: "/mentions-legales" },
  { key: "cgv" as const, href: "/cgv" },
  { key: "privacy" as const, href: "/politique-de-confidentialite" },
];

// Airbnb footer-light: the footer shares the page canvas (no muted band) —
// three clean text columns, closed by a hairline legal band in caption style.
export function SiteFooter() {
  const dict = getDictionary("fr");
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-base font-semibold text-foreground">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            >
              <Plane className="h-4 w-4" strokeWidth={2.5} />
            </span>
            {BRAND}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t(dict, "site.tagline")}</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/90 underline-offset-2 hover:underline"
            >
              {t(dict, `legal.links.${link.key}`)}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium text-foreground">{t(dict, "support.whatsappCta")}</p>
          <p className="text-muted-foreground">{t(dict, "legal.email")}</p>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>{t(dict, "footer.copyright")}</span>
          <span>
            {t(dict, "site.locale")} · {t(dict, "legal.hosting")}
          </span>
        </p>
      </div>
    </footer>
  );
}
