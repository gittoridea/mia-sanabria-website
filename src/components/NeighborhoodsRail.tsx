import Link from "next/link";
import { MIA_APPROVED_NEIGHBORHOODS } from "@/lib/mia";
import { SectionHeading } from "./SectionHeading";

/**
 * Approved-neighborhoods rail — Cycle 24 R2 (2026-05-13).
 *
 * Surfaces Mia's 9 approved working neighborhoods on the homepage so the
 * constant `MIA_APPROVED_NEIGHBORHOODS` is actually user-facing.
 *
 * Routing rules per neighborhood:
 *   - `hasPage: true`  → link to /markets/<slug>/ (existing market guide)
 *   - `hasPage: false` → link to /markets/#property-search (search anchor)
 *                        Mia still needs to provide copy + photos for these
 *                        seven neighborhoods; visible label is the city name
 *                        only, no invented neighborhood narrative.
 *
 * The component renders no claim text about each neighborhood beyond its
 * name. It is intentionally minimal: a list, not editorial. Sweeping
 * neighborhood copy lives in a future Mia-content cycle.
 */
export function NeighborhoodsRail() {
  return (
    <section
      aria-labelledby="neighborhoods-rail-heading"
      className="bg-cream-100 py-14 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Mia's service areas"
          heading={
            <span id="neighborhoods-rail-heading">
              Where Mia represents buyers and sellers.
            </span>
          }
          sub="Active working neighborhoods across Broward County. Begin a private inquiry for any address inside or adjacent to these areas."
        />

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {MIA_APPROVED_NEIGHBORHOODS.map((n) => {
            const href = n.hasPage
              ? `/markets/${n.slug}/`
              : `/markets/#property-search`;
            return (
              <li key={n.slug}>
                <Link
                  href={href}
                  className="group flex min-h-[64px] items-center justify-between gap-3 rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-navy-800 transition-colors hover:border-brass-400 hover:bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
                >
                  <span className="font-display text-[15px] tracking-wide sm:text-base">
                    {n.label}
                  </span>
                  <span
                    aria-hidden
                    className="text-[11px] uppercase tracking-[0.18em] text-brass-700 transition-colors group-hover:text-brass-600"
                  >
                    {n.hasPage ? "Guide" : "Search"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-[13px] leading-relaxed text-navy-800/70">
          Eastern Fort Lauderdale waterfront cohorts (Las Olas Isles, Harbor Beach, Rio Vista,
          Bay Colony, Bermuda Riviera, Coral Ridge, Victoria Park, Lighthouse Point, and
          adjacent Northern Broward and Palm Beach County markets) remain available — see the
          Featured Markets section below.
        </p>
      </div>
    </section>
  );
}
