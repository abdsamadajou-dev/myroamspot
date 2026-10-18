import { getDictionary, t } from "../../lib/i18n";
import { BRAND } from "../../lib/site";

export const metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  const dict = getDictionary("fr");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed">
      <h1 className="mb-6 text-2xl font-bold">Mentions légales</h1>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Éditeur du site</h2>
        <p>
          Le site {BRAND} est édité par : <strong>{t(dict, "legal.company")}</strong>, immatriculée
          sous le numéro <strong>{t(dict, "legal.siret")}</strong>, dont le siège social est
          situé&nbsp;: <strong>{t(dict, "legal.address")}</strong>.
        </p>
        <p>
          Contact : <strong>{t(dict, "legal.email")}</strong>.
        </p>
        <h2 className="text-lg font-semibold">Hébergement</h2>
        <p>{t(dict, "legal.hosting")}</p>
      </section>
    </main>
  );
}
