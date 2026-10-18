import type { Metadata } from "next";
import { LegalDocument } from "../../components/legal-document";
import { getDictionary } from "../../lib/i18n";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

export default function CgvPage() {
  const dict = getDictionary("fr");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed">
      <LegalDocument doc={dict.legal.documents.cgv} />
    </main>
  );
}
