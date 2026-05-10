import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InsightCard } from "./InsightCard";
import { getAllInsights } from "@/lib/insights";

/**
 * Cycle 15 — Insights teaser strip for cross-site weaving (homepage,
 * markets index). Renders 3-4 curated cards plus a link to the full index.
 *
 * `slugs` selects which posts to feature; if omitted, takes the first `count`
 * insights in canonical order.
 */

export function InsightsTeaser({
  slugs,
  count = 3,
  heading = "Latest Insights",
  sub = "A twelve-part evergreen guide to the Southeast Florida luxury and waterfront market.",
  background = "cream",
}: {
  slugs?: ReadonlyArray<string>;
  count?: number;
  heading?: string;
  sub?: string;
  background?: "cream" | "white";
}) {
  const all = getAllInsights();
  const posts =
    slugs && slugs.length > 0
      ? slugs
          .map((s) => all.find((p) => p.slug === s))
          .filter((p): p is (typeof all)[number] => p !== undefined)
      : all.slice(0, count);

  if (posts.length === 0) return null;

  const containerBg =
    background === "cream" ? "bg-cream-100" : "border-y border-navy-800/10 bg-white";

  return (
    <section className={`${containerBg} py-20 lg:py-28`}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="luxury-divider mb-4">
              <span>Insights</span>
            </div>
            <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">{heading}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">{sub}</p>
          </div>
          <Link
            href="/insights/"
            className="inline-flex items-center gap-2 self-start rounded-full border border-navy-800/30 px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700 sm:self-end"
          >
            See all twelve briefs
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <InsightCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
