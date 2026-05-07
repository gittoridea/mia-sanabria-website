import type { FAQPage, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";

export function FaqSchema({
  items,
}: {
  items: ReadonlyArray<{ question: string; answer: string }>;
}) {
  const data: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return <JsonLd data={data} />;
}
