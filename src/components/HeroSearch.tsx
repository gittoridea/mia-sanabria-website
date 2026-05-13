import { Search } from "lucide-react";
import { MIA_APPROVED_NEIGHBORHOODS } from "@/lib/mia";

/**
 * Hero listings search box — Cycle 24 R2 (2026-05-13).
 *
 * Mia explicitly requested a listings search box in the hero. Bridge Data
 * Output is the future provider (see `src/lib/bridge.ts`) but the secure
 * runtime decision is still open — until then this scaffold uses a plain
 * HTML `<form method="get">` that works without JavaScript on the static
 * export.
 *
 * On submit the form GETs to `/markets/` (which already hosts the existing
 * Matrix MLS iframe + the future Bridge consumer), preserving the chosen
 * city / price band / bed count as URL query parameters and anchoring to
 * `#property-search` so the user lands at the search section. The query
 * parameters are inert until a runtime consumer reads them client-side;
 * the form value semantics are stable so the future consumer can hook in.
 *
 * Cities are restricted to Mia's approved 9 (`MIA_APPROVED_NEIGHBORHOODS`)
 * — no extra cities, no invented data. Price + beds are conservative
 * generic ranges; they do not claim any real-listing distribution.
 *
 * Accessibility: every input has a visible label, the form has an
 * `aria-label`, and the submit button uses both visible text and a Search
 * icon with `aria-hidden`.
 */

const PRICE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "Any price" },
  { value: "600000-1000000", label: "$600k–$1M" },
  { value: "1000000-2000000", label: "$1M–$2M" },
  { value: "2000000-3000000", label: "$2M–$3M" },
  { value: "3000000-5000000", label: "$3M–$5M" },
  { value: "5000000-", label: "$5M+" },
];

const BED_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "Any beds" },
  { value: "2", label: "2+ beds" },
  { value: "3", label: "3+ beds" },
  { value: "4", label: "4+ beds" },
  { value: "5", label: "5+ beds" },
];

export function HeroSearch() {
  return (
    <section
      data-component="hero-search"
      aria-label="Listings search"
      className="relative z-10 -mt-6 bg-cream-50 sm:-mt-8"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <form
          method="get"
          action="/markets/#property-search"
          aria-label="Search Southeast Florida listings"
          data-form-type="search"
          className="rounded-sm border-l-2 border-brass-400 bg-cream-50 p-4 shadow-luxury sm:p-5 lg:p-6"
        >
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-[1.4fr_1fr_0.9fr_auto]">
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
                className="min-h-[44px] w-full rounded-sm border border-navy-800/20 bg-cream-50 px-3 py-2 text-[15px] text-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
              >
                <option value="">Any approved area</option>
                {MIA_APPROVED_NEIGHBORHOODS.map((n) => (
                  <option key={n.slug} value={n.slug}>
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
                Price
              </label>
              <select
                id="hero-search-price"
                name="price"
                defaultValue=""
                className="min-h-[44px] w-full rounded-sm border border-navy-800/20 bg-cream-50 px-3 py-2 text-[15px] text-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
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
                className="min-h-[44px] w-full rounded-sm border border-navy-800/20 bg-cream-50 px-3 py-2 text-[15px] text-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
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
                Search Homes
              </button>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-navy-800/65">
            Search anchors to the Southeast Florida property-search section. Listings shown
            reflect participating brokerages; talk with Mia for current comparable sales,
            ownership history where available, and the residence specifics that lists alone
            cannot tell you.
          </p>
        </form>
      </div>
    </section>
  );
}
