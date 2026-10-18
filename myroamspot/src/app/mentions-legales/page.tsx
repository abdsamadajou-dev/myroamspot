import type { Metadata } from "next";
import { LegalDocument } from "../../components/legal-document";
import { getDictionary, t } from "../../lib/i18n";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  const dict = getDictionary("fr");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed">
      <LegalDocument doc={dict.legal.documents.mentionsLegales} />
    </main>
  );
}
