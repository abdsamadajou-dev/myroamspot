import { getDictionary, t } from "../../lib/i18n";

export const metadata = {
  title: "Politique de confidentialité",
};

export default function PolitiqueConfidentialitePage() {
  const dict = getDictionary("fr");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed">
      <h1 className="mb-6 text-2xl font-bold">Politique de confidentialité</h1>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Responsable du traitement</h2>
        <p>
          <strong>{t(dict, "legal.company")}</strong>, <strong>{t(dict, "legal.address")}</strong>.
          Contact&nbsp;: <strong>{t(dict, "legal.email")}</strong>.
        </p>
        <h2 className="text-lg font-semibold">Données collectées</h2>
        <p>
          Nous collectons uniquement les données nécessaires à la fourniture du service&nbsp;:
          email de commande, identifiant de la session de paiement, et données techniques de
          provisionnement de l&apos;eSIM (code QR, identifiant de forfait). Aucune donnée de
          navigation n&apos;est revendue à des tiers.
        </p>
        <h2 className="text-lg font-semibold">Sous-traitants</h2>
        <p>
          Hébergement&nbsp;: <strong>{t(dict, "legal.hosting")}</strong>. Paiement&nbsp;: votre
          prestataire de paiement agit en qualité de marchand de référence et traite les données
          de paiement selon ses propres conditions. Provisionnement eSIM&nbsp;: notre opérateur
          technique reçoit uniquement les données strictement nécessaires à l&apos;activation.
        </p>
        <h2 className="text-lg font-semibold">Vos droits (RGPD)</h2>
        <p>
          Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement et de portabilité.
          Pour les exercer, écrivez à <strong>{t(dict, "legal.email")}</strong>. Vous pouvez
          également saisir la CNIL.
        </p>
      </section>
    </main>
  );
}
