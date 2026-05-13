"use client";

import { useId, useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { MarketCard } from "@/components/MarketCard";
import type { Market } from "@/lib/markets";

/**
 * Cycle 16 — Featured Markets accessible pager.
 *
 * Renders the homepage Featured Markets section in pages of N (default 6) with:
 *  - Previous / Next buttons (keyboard-focusable, aria-labels, disabled at ends).
 *  - Page-dot indicators (aria-current page; click-jumps).
 *  - First N cards eager-loaded (priority on page 1; later pages lazy by default).
 *  - "Explore all markets" CTA always visible — pager is discovery, not gate.
 *  - prefers-reduced-motion honored: no transform animation on page swap.
 *  - Mobile: single column. Tablet: 2-up. Desktop: 3-up (3×2 grid).
 *  - Static-export safe: state is client-only; data is statically resolved.
 *
 * NOT a carousel: no auto-rotation, no fade animations beyond a quick crossfade
 * that respects prefers-reduced-motion.
 */

type Props = {
  markets: ReadonlyArray<Market>;
  pageSize?: number;
};

export function FeaturedMarketsPager({ markets, pageSize = 6 }: Props) {
  const labelId = useId();
  const liveRegionId = useId();

  const pages = useMemo(() => {
    const out: Array<ReadonlyArray<Market>> = [];
    for (let i = 0; i < markets.length; i += pageSize) {
      out.push(markets.slice(i, i + pageSize));
    }
    return out;
  }, [markets, pageSize]);

  const totalPages = pages.length;
  const [pageIndex, setPageIndex] = useState(0);
  const gridRef = useRef<HTMLUListElement | null>(null);
  const isFirstRender = useRef(true);

  // Clamp if the markets list shrinks at runtime (defensive — should not happen
  // with static data, but is correct behavior).
  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(0);
    }
  }, [pageIndex, totalPages]);

  // Focus the first card heading on page change for screen readers (skipping
  // initial render so SSR matches first paint).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (gridRef.current) {
      const firstHeading = gridRef.current.querySelector<HTMLElement>("h3");
      if (firstHeading) {
        firstHeading.setAttribute("tabindex", "-1");
        firstHeading.focus({ preventScroll: false });
      }
    }
  }, [pageIndex]);

  const currentPage = pages[pageIndex] ?? [];
  const goPrev = () => setPageIndex((i) => Math.max(0, i - 1));
  const goNext = () => setPageIndex((i) => Math.min(totalPages - 1, i + 1));

  const canPrev = pageIndex > 0;
  const canNext = pageIndex < totalPages - 1;

  const showPager = totalPages > 1;
  const startIdx = pageIndex * pageSize;
  const endIdx = startIdx + currentPage.length;

  return (
    <div>
      <ul
        ref={gridRef}
        aria-labelledby={labelId}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 motion-safe:transition-opacity motion-safe:duration-300"
        key={`page-${pageIndex}`}
      >
        {currentPage.map((market, idx) => (
          <li key={market.slug}>
            {/* Page 1 first 3 cards eager-load (above-fold on desktop). */}
            <MarketCard market={market} priority={pageIndex === 0 && idx < 3} />
          </li>
        ))}
      </ul>

      {/* Visually-hidden live region announces page changes to screen readers.
       * Cycle 19A-M: explicit "featured" wording to remove ambiguity with the
       * full /markets index (12 curated of 16 total markets). */}
      <p id={liveRegionId} aria-live="polite" aria-atomic="true" className="sr-only">
        Showing featured markets {startIdx + 1}–{endIdx} of {markets.length}. Page {pageIndex + 1} of {totalPages}. Browse all markets at the markets index.
      </p>

      {showPager ? (
        <nav
          aria-label="Featured markets pagination"
          className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-4"
        >
          <Link
            href="/markets/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-navy-800/80 transition-colors hover:text-brass-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
          >
            Explore all markets
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label="Previous featured markets"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-800/30 bg-cream-50 text-navy-800 transition-[border-color,color,opacity] hover:border-brass-400 hover:text-brass-700 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>

            <ol
              className="flex items-center gap-2"
              role="list"
              aria-label="Featured markets pages"
            >
              {pages.map((_, i) => {
                const isCurrent = i === pageIndex;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setPageIndex(i)}
                      aria-current={isCurrent ? "page" : undefined}
                      aria-label={`Go to featured markets page ${i + 1} of ${totalPages}`}
                      className="group inline-flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
                    >
                      <span
                        aria-hidden
                        className={`inline-block h-2.5 w-2.5 rounded-full transition-[background-color,box-shadow] ${
                          isCurrent
                            ? "bg-brass-500"
                            : "bg-navy-800/25 group-hover:bg-navy-800/55"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              aria-label="Next featured markets"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-800/30 bg-cream-50 text-navy-800 transition-[border-color,color,opacity] hover:border-brass-400 hover:text-brass-700 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </nav>
      ) : (
        <div className="mt-10 flex justify-center">
          <Link
            href="/markets/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-navy-800/80 transition-colors hover:text-brass-700"
          >
            Explore all markets
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      )}

      <span id={labelId} className="sr-only">
        Featured markets
      </span>
    </div>
  );
}
