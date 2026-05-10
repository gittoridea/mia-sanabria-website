import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMarket } from "@/lib/markets";
import type { MarketSlug } from "@/lib/mia";

/**
 * Cycle 15 — Related-markets module. Renders inside an Insights detail page's
 * editorial flow, between the primary CTA and the secondary CTA. Compact: one
 * line per market, with the market's tagline as the qualifying detail.
 *
 * Reuses the existing Market data; never duplicates market copy. If a passed
 * slug doesn't resolve to a real Market entry, it's skipped silently.
 */

export function RelatedMarketsModule({
  marketSlugs,
  heading = "Related markets",
  source,
}: {
  marketSlugs: ReadonlyArray<MarketSlug>;
  heading?: string;
  source?: string;
}) {
  const markets = marketSlugs
    .map((slug) => getMarket(slug))
    .filter((m): m is NonNullable<ReturnType<typeof getMarket>> => m !== undefined);

  if (markets.length === 0) return null;

  return (
    <section className="mt-12 border-t border-navy-800/10 pt-10">
      <h3 className="font-display text-2xl text-navy-800">{heading}</h3>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {markets.map((market) => {
          const params = new URLSearchParams();
          if (source) params.set("source", source);
          const href = `/markets/${market.slug}/${
            params.toString() ? `?${params.toString()}` : ""
          }`;
          return (
            <li key={market.slug}>
              <Link
                href={href}
                className="group block rounded-sm border border-navy-800/10 bg-cream-50 px-5 py-4 transition-colors hover:border-brass-400"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-[18px] text-navy-800">{market.name}</p>
                    <p className="mt-1 text-[13px] text-navy-800/75">{market.tagline}</p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 flex-none text-navy-800/40 transition-colors group-hover:text-brass-700"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
