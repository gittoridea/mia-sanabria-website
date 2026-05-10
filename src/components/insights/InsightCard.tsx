import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsightPost } from "@/lib/insights";
import { estimateReadingTime } from "@/lib/insights";

/**
 * Cycle 15 — Card preview for an Insights index entry. Editorial framing with
 * topic-month label, title, excerpt, AEO question, primary market chips, and
 * an explicit "Read" affordance. Mirrors the MarketCard editorial discipline
 * without competing with it visually (no large image; insights are text-led).
 *
 * Cycle 16 — Label uses `editorialMonthLabel` (e.g. "Market Note · May" — Cycle 17
 * replaced "Evergreen Brief" with "Market Note" per CYCLE_17_DECISION_REGISTER.md
 * Card 1), which is the visible-only editorial frame. Schema-side datePublished
 * stays honest at the deployment date (rendered separately at the article-page level).
 */

export function InsightCard({ post }: { post: InsightPost }) {
  const readingTime = estimateReadingTime(post);
  const primaryMarket = post.relatedMarkets[0];
  return (
    <Link
      href={`/insights/${post.slug}/`}
      className="group flex flex-col rounded-sm border border-navy-800/10 bg-cream-50 p-6 shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-luxury lg:p-8"
    >
      <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-brass-700">
        <span>{post.editorialMonthLabel}</span>
        <span className="text-navy-800/55">{readingTime} min read</span>
      </div>
      <h3 className="mt-4 font-display text-2xl text-navy-800 [text-wrap:balance] sm:text-[28px]">
        {post.title}
      </h3>
      <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85 [text-wrap:pretty]">
        {post.excerpt}
      </p>
      {primaryMarket && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.relatedMarkets.slice(0, 3).map((market) => (
            <span
              key={market}
              className="rounded-full border border-navy-800/15 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-navy-800/80"
            >
              {market.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-navy-800 transition-colors group-hover:text-brass-700">
        Read the brief
        <ArrowRight className="h-3 w-3" aria-hidden />
      </div>
    </Link>
  );
}
