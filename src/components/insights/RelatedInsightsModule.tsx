import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllInsights, getInsightsForMarket } from "@/lib/insights";
import type { MarketSlug } from "@/lib/mia";

/**
 * Cycle 15 — Compact related-insights module for cross-page weaving. Used on
 * market detail pages, buyer/seller/valuation/contact pages — anywhere the
 * page needs to surface 2-4 relevant insights without dominating the layout
 * with full cards.
 *
 * Two activation modes:
 *   - `marketSlug` → derives related insights via getInsightsForMarket(slug)
 *   - `slugs` → explicit list (used on buyer/seller/valuation/contact pages
 *     where the curation is editorial, not market-derived)
 */

type Props = {
  marketSlug?: MarketSlug;
  slugs?: ReadonlyArray<string>;
  heading?: string;
  sub?: string;
  count?: number;
  background?: "cream" | "white" | "cream-100";
};

export function RelatedInsightsModule({
  marketSlug,
  slugs,
  heading = "From the Insights library",
  sub,
  count = 3,
  background = "cream",
}: Props) {
  const all = getAllInsights();
  let posts: ReadonlyArray<(typeof all)[number]> = [];

  if (slugs && slugs.length > 0) {
    posts = slugs
      .map((s) => all.find((p) => p.slug === s))
      .filter((p): p is (typeof all)[number] => p !== undefined)
      .slice(0, count);
  } else if (marketSlug) {
    posts = getInsightsForMarket(marketSlug).slice(0, count);
  }

  if (posts.length === 0) return null;

  const containerBg =
    background === "cream"
      ? "bg-cream-50"
      : background === "cream-100"
      ? "bg-cream-100"
      : "border-y border-navy-800/10 bg-white";

  return (
    <section className={`${containerBg} py-16 lg:py-20`}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="luxury-divider mb-3">
              <span>Insights</span>
            </div>
            <h2 className="font-display text-2xl text-navy-800 sm:text-3xl">{heading}</h2>
            {sub && <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">{sub}</p>}
          </div>
          <Link
            href="/insights/"
            className="inline-flex items-center gap-2 self-start rounded-full border border-navy-800/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700 sm:self-end"
          >
            All briefs
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/insights/${post.slug}/`}
                className="group block h-full rounded-sm border border-navy-800/10 bg-white px-5 py-5 transition-colors hover:border-brass-400"
              >
                <div className="text-xs uppercase tracking-[0.3em] text-brass-700">
                  {post.topicMonth}
                </div>
                <p className="mt-3 font-display text-[18px] leading-snug text-navy-800 [text-wrap:balance]">
                  {post.title}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-navy-800 transition-colors group-hover:text-brass-700">
                  Read the brief
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
