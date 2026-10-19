import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getDictionary, t } from "../lib/i18n";

type FaqEntry = { q: string; a: string };

export function Faq({ slug }: { slug: string }) {
  const dict = getDictionary("fr");
  const funnel = dict.funnels[slug as keyof typeof dict.funnels];
  const faqs = funnel.faqs as FaqEntry[];
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 pb-10">
      <h2 id="faq-title" className="mb-6 text-center text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
        {t(dict, "ui.faqHeading")}
      </h2>
      <Accordion multiple={false}>
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-[15px] sm:text-[17px]">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-[15px] text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
