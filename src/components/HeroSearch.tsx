import { Search } from "lucide-react";
import { MIA_APPROVED_NEIGHBORHOODS } from "@/lib/mia";

/**
 * Hero listings search box — Cycle 38 (2026-05-16).
 *
 * Cycle 38 rewires this surface to the Bridge-backed `/home-search/` page (the
 * old IDX Matrix iframe was removed in Cycle 37). The form submits as a plain
 * HTML GET so it works on the static export with JS disabled; on the
 * destination page `BridgeSearch` reads the URL params on mount and auto-runs
 * the search.
 *
 * Param contract sent to /home-search/:
 *   - city      city LABEL (matches Mia's approved neighborhoods)
 *   - minPrice  integer USD threshold (≥)
 *   - beds      integer bedrooms (≥)
 *   - source    "home-hero" — analytics tag
 *
 * The `floating` prop renders the card as an absolutely-positioned overlay on
 * top of the parent Hero image, matching the production miasanabria.com layout
 * (search card floats on the hero). When false (legacy behavior) the card
 * renders as a stand-alone cream band below the hero.
 */

const PRICE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "Any price" },
  { value: "600000", label: "$600k+" },
  { value: "1000000", label: "$1M+" },
  { value: "2000000", label: "$2M+" },
  { value: "3000000", label: "$3M+" },
  { value: "5000000", label: "$5M+" },
];

const BED_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "Any beds" },
  { value: "2", label: "2+ beds" },
  { value: "3", label: "3+ beds" },
  { value: "4", label: "4+ beds" },
  { value: "5", label: "5+ beds" },
];

export function HeroSearch({ floating = false }: { floating?: boolean } = {}) {
  const formCard = (
    <form
      method="get"
      action="/home-search/"
      aria-label="Search Southeast Florida listings"
      data-form-type="search"
      data-home-hero-search="true"
      className={
        /* Cycle 41 — slimmer card on lg (p-4 lg:p-5 vs prior lg:p-6) so the
           search reads as a refined tool, not a database admin band. */
        floating
          ? "box-border w-full max-w-full overflow-hidden rounded-sm border-l-2 border-brass-400 bg-cream-50/95 p-4 shadow-[0_18px_50px_-20px_rgba(15,42,68,0.55)] [contain:inline-size] sm:p-5 lg:p-5"
          : "box-border w-full max-w-full overflow-hidden rounded-sm border-l-2 border-brass-400 bg-cream-50 p-4 shadow-luxury sm:p-5 lg:p-5"
      }
    >
      <input type="hidden" name="source" value="home-hero" />
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="hero-search-city"
            className="text-[11px] uppercase tracking-[0.18em] text-navy-800/70"
          >
            Neighborhood
          </label>
          <select
            id="hero-search-city"
            name="city"
            defaultValue=""
            className="box-border min-w-0 max-w-full w-full min-h-[44px] rounded-sm border border-navy-800/20 bg-cream-50 px-3 py-2 text-[15px] text-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
          >
            <option value="">Any approved area</option>
            {MIA_APPROVED_NEIGHBORHOODS.map((n) => (
              <option key={n.slug} value={n.label}>
                {n.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="hero-search-price"
            className="text-[11px] uppercase tracking-[0.18em] text-navy-800/70"
          >
            Min price
          </label>
          <select
            id="hero-search-price"
            name="minPrice"
            defaultValue=""
            className="box-border min-w-0 max-w-full w-full min-h-[44px] rounded-sm border border-navy-800/20 bg-cream-50 px-3 py-2 text-[15px] text-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
          >
            {PRICE_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="hero-search-beds"
            className="text-[11px] uppercase tracking-[0.18em] text-navy-800/70"
          >
            Bedrooms
          </label>
          <select
            id="hero-search-beds"
            name="beds"
            defaultValue=""
            className="box-border min-w-0 max-w-full w-full min-h-[44px] rounded-sm border border-navy-800/20 bg-cream-50 px-3 py-2 text-[15px] text-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
          >
            {BED_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-brass-400 px-6 py-3 text-sm font-semibold tracking-wide text-navy-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] transition-colors hover:bg-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-200 lg:w-auto"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden />
            Search Listings
          </button>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-navy-800/65">
        Search routes to Mia&apos;s Bridge-backed Southeast Florida home search.
        Talk with Mia for current comparable sales and the residence specifics
        listings alone cannot tell you.
      </p>
    </form>
  );

  if (floating) {
    /*
     * Cycle 41 — narrower max-w on lg (max-w-4xl, ~896px) so the search card
     * stops reading as a full-width database row across the hero. Smaller
     * negative-margin float (-mt-12 sm:-mt-14 lg:-mt-16) reduces the awkward
     * half-in/half-out integration the operator flagged.
     */
    return (
      <div
        data-component="hero-search"
        data-floating="true"
        data-hero-search-version="cycle41"
        aria-label="Listings search"
        className="pointer-events-none relative z-20 -mt-12 w-full max-w-full px-4 sm:-mt-14 lg:-mt-16 lg:px-8"
      >
        <div className="pointer-events-auto mx-auto w-full max-w-7xl min-w-0 lg:max-w-4xl">
          {formCard}
        </div>
      </div>
    );
  }

  return (
    <section
      data-component="hero-search"
      aria-label="Listings search"
      className="relative z-10 -mt-6 bg-cream-50 sm:-mt-8"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">{formCard}</div>
    </section>
  );
}
