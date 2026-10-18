import type { ReactNode } from "react";
import { getDictionary } from "../lib/i18n";

type StructuredDoc = {
  title: string;
  sections: { heading: string; paragraphs: string[] }[];
};

// Token map: {company}→legal.company, {siret}→legal.siret, … Every token is
// rendered as its own text node so the placeholder strings stay greppable
// and testable ([COMPANY_NAME], [REGISTRATION_NUMBER], …).
function renderParagraph(text: string, dict: ReturnType<typeof getDictionary>): ReactNode[] {
  const tokens: Record<string, string> = {
    company: dict.legal.company,
    siret: dict.legal.siret,
    address: dict.legal.address,
    email: dict.legal.email,
    hosting: dict.legal.hosting,
  };
  return text.split(/\{(company|siret|address|email|hosting)\}/g).map((segment, i) =>
    segment in tokens ? <strong key={i}>{tokens[segment]}</strong> : <span key={i}>{segment}</span>,
  );
}

export function LegalDocument({ doc }: { doc: unknown }) {
  const document_ = doc as StructuredDoc;
  const dict = getDictionary("fr");
  return (
    <article className="space-y-6">
      <h1 className="text-2xl font-bold">{document_.title}</h1>
      {document_.sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          {section.paragraphs.map((paragraph, i) => (
            <p key={i}>{renderParagraph(paragraph, dict)}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
