import { FaqSchema } from "./schema/FaqSchema";

export type FaqItem = { question: string; answer: string };

export function Faq({
  heading = "Frequently asked questions",
  items,
  emitSchema = true,
}: {
  heading?: string;
  items: ReadonlyArray<FaqItem>;
  emitSchema?: boolean;
}) {
  return (
    <section className="bg-cream-50 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">{heading}</h2>
        <div className="mt-10 divide-y divide-navy-800/10 border-y border-navy-800/10">
          {items.map((item, i) => (
            <details
              key={i}
              className="group py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
                <span className="font-display text-lg text-navy-800">{item.question}</span>
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-navy-800/30 text-navy-800 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 pr-12 text-[15px] leading-relaxed text-navy-800/80">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
      {emitSchema ? <FaqSchema items={items} /> : null}
    </section>
  );
}
