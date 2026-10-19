import Link from "next/link";
import { getDictionary, t } from "../lib/i18n";
import { BrandMark, BrandWordmark } from "./brand-logo";

// Legal routes must exist as static pages — see src/app/{mentions-legales,cgv,politique-de-confidentialite}/
const legalLinks = [
  { key: "mentions" as const, href: "/mentions-legales" },
  { key: "cgv" as const, href: "/cgv" },
  { key: "privacy" as const, href: "/politique-de-confidentialite" },
];

// Apple footer (DESIGN.md): parchment surface, ink-muted-80 links in the
// relaxed dense-link rhythm, column headings in caption-strong, and the
// legal row in micro fine-print. It sits directly under the dark support
// tile — the color change is the divider.
export function SiteFooter() {
  const dict = getDictionary("fr");
  return (
    <footer className="bg-[#f5f5f7]">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em] text-[#333333]">
            <BrandMark className="h-6 w-6" />
            <BrandWordmark />
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">{t(dict, "site.tagline")}</p>
        </div>
        <nav className="flex flex-col gap-2.5 text-[15px]">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#333333] underline-offset-2 hover:underline"
            >
              {t(dict, `legal.links.${link.key}`)}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2.5 text-[15px]">
          <p className="font-semibold text-[#333333]">{t(dict, "support.whatsappCta")}</p>
          <p className="text-[#333333]">{t(dict, "legal.email")}</p>
        </div>
      </div>
      <div className="border-t border-[#e0e0e0]">
        <p className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-8 text-[12px] text-[#7a7a7a] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>{t(dict, "footer.copyright")}</span>
          <span>
            {t(dict, "site.locale")} · {t(dict, "legal.hosting")}
          </span>
        </p>
      </div>
    </footer>
  );
}
