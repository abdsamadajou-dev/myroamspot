import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { WhatsAppWidget } from "../components/whatsapp-widget";
import { BRAND, SITE_URL } from "../lib/site";
import { getDictionary, t } from "../lib/i18n";

const dict = getDictionary("fr");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND,
    template: `%s | ${BRAND}`,
  },
  description: t(dict, "home.heroSubtitle"),
  openGraph: {
    siteName: BRAND,
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
