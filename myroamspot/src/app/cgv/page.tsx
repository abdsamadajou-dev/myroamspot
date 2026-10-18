import { getDictionary, t } from "../../lib/i18n";

export const metadata = {
  title: "Conditions générales de vente",
};

export default function CgvPage() {
  const dict = getDictionary("fr");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed">
      <h1 className="mb-6 text-2xl font-bold">Conditions générales de vente</h1>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">1. Objet</h2>
        <p>
          Les présentes conditions régissent la vente de forfaits eSIM prépayés proposés sur le
          site <strong>{t(dict, "legal.company")}</strong>. Tous les prix sont affichés en euros,
          toutes taxes comprises (TTC).
        </p>
        <h2 className="text-lg font-semibold">2. Commande et livraison</h2>
        <p>
          Après paiement confirmé, votre code QR d&apos;installation eSIM est envoyé à
          l&apos;adresse email indiquée lors de la commande. L&apos;eSIM est un produit numérique :
          aucune expédition physique n&apos;a lieu.
        </p>
        <h2 className="text-lg font-semibold">3. Droit de rétractation — produits numériques</h2>
        <p>
          Conformément à l&apos;article L221-28 13° du Code de la consommation, le droit de
          rétractation ne peut être exercé pour les biens numériques livrés avec votre accord
          avant la fin du délai de 14 jours.
        </p>
        <h2 className="text-lg font-semibold">4. Politique de remboursement</h2>
        <p>
          <strong>
            Remboursement intégral sous 14 jours si et seulement si l&apos;eSIM n&apos;a pas été
            installée/activée, sans aucune consommation de données.
          </strong>{" "}
          Une fois l&apos;eSIM installée ou activée, ou dès lors qu&apos;une consommation est
          constatée, aucun remboursement ne peut être accordé, conformément au caractère
          nominatif et périssable du produit numérique.
        </p>
        <h2 className="text-lg font-semibold">5. Service client</h2>
        <p>
          Une question ? Notre support vous répond en français, notamment via WhatsApp&nbsp;:
          <strong>{t(dict, "legal.email")}</strong>.
        </p>
      </section>
    </main>
  );
}
