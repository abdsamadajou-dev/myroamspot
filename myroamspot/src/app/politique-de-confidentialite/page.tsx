import type { Metadata } from "next";
import { LegalDocument } from "../../components/legal-document";
import { getDictionary } from "../../lib/i18n";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PolitiqueConfidentialitePage() {
  const dict = getDictionary("fr");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed">
      <LegalDocument doc={dict.legal.documents.privacy} />
    </main>
  );
}
