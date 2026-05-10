import Link from "next/link";
import { useId } from "react";
import { ArrowRight } from "lucide-react";
import type { MarketSlug } from "@/lib/mia";
import { getMarket } from "@/lib/markets";
import { FaqSchema } from "./schema/FaqSchema";

export function AnswerFirst({
  question,
  answer,
  relatedMarkets = [],
  cta,
  background = "cream",
  emitFaqSchema = true,
}: {
  /** A natural-language question that an LLM-driven search engine might ask. */
  question: string;
  /** 75-125 words; first sentence answers directly, remaining sentences expand. */
  answer: string;
  /** 2-3 market slugs to cross-link from this page. */
  relatedMarkets?: ReadonlyArray<MarketSlug>;
  /** Optional small CTA at the section close. */
  cta?: { href: string; label: string };
  background?: "cream" | "cream-tint";
  /** When true, emit a FAQPage JSON-LD entity for the Q+A so AEO citations resolve. */
  emitFaqSchema?: boolean;
}) {
  const headingId = useId();
  const marketLinks = relatedMarkets
    .map((slug) => getMarket(slug))
    .filter((m): m is NonNullable<ReturnType<typeof getMarket>> => Boolean(m));

  return (
    <section
      className={
        background === "cream-tint"
          ? "bg-cream-100 py-16 lg:py-20"
          : "bg-cream-50 py-16 lg:py-20"
      }
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="font-display text-xs uppercase tracking-[0.3em] text-brass-700">
          The Practice
        </div>
        <h2
          id={headingId}
          className="mt-3 font-display text-xl text-navy-800 [text-wrap:balance] [overflow-wrap:anywhere] min-[360px]:text-[22px] min-[375px]:text-2xl sm:text-3xl"
        >
          {question}
        </h2>
        <p className="mt-5 text-[17px] leading-relaxed text-navy-800/85 [text-wrap:pretty]">
          {answer}
        </p>
        {marketLinks.length > 0 ? (
          <p className="mt-5 text-sm text-navy-800/75">
            Related markets:{" "}
            {marketLinks.map((m, i) => (
              <span key={m.slug}>
                <Link
                  href={`/markets/${m.slug}/`}
                  className="underline decoration-brass-400 decoration-1 underline-offset-4 hover:text-brass-700"
                >
                  {m.name}
                </Link>
                {i < marketLinks.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        ) : null}
        {cta ? (
          <p className="mt-6">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-navy-800 transition-colors hover:text-brass-700"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </p>
        ) : null}
      </div>
      {emitFaqSchema ? <FaqSchema items={[{ question, answer }]} /> : null}
    </section>
  );
}
