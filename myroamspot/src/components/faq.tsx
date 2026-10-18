import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getDictionary } from "../lib/i18n";

type FaqEntry = { q: string; a: string };

export function Faq({ slug }: { slug: string }) {
  const dict = getDictionary("fr");
  const funnel = dict.funnels[slug as keyof typeof dict.funnels];
  const faqs = funnel.faqs as FaqEntry[];
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 pb-8">
      <h2 id="faq-title" className="mb-4 text-center text-xl font-semibold">
        Questions fréquentes
      </h2>
      <Accordion multiple={false}>
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm sm:text-base">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
