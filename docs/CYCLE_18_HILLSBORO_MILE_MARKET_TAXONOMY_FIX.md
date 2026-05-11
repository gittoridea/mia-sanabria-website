# Cycle 18 — Hillsboro Mile Market Taxonomy Fix

**Date:** 2026-05-10
**Mission Phase:** P5

## Problem at baseline (Cycle 17 close)

Hillsboro Mile (`src/lib/markets.ts:982` Cycle 17 baseline) carried `cluster: "primary"`, which routed it to the `/markets/` index section "South Florida cities and towns." That section visually grouped Hillsboro Mile with Fort Lauderdale, Boca Raton, Palm Beach, Delray Beach, Lighthouse Point, and Sea Ranch Lakes — a cohort of incorporated cities and towns where Mia represents buyers and sellers.

**Why this was a problem.** Hillsboro Mile is a roughly three-mile A1A corridor through the *town of Hillsboro Beach*. It is not Fort Lauderdale; it is not a "city/town" in the same shape as the South Florida cities-and-towns peers (it is a corridor *within* Hillsboro Beach). The principal flagged the placement as taxonomically wrong: the corridor belongs visually next to the Fort Lauderdale waterfront cluster (because that's the cohort serious waterfront buyers compare), but it cannot be claimed as Fort Lauderdale or as one of the city/town primaries.

## Constraint

Move Hillsboro Mile out of the "South Florida cities and towns" section and into the renamed Fort Lauderdale-adjacent waterfront cluster section, **without claiming Hillsboro Mile is Fort Lauderdale**.

## Decision (Cycle 18)

Add a third `MarketCluster` value: `"northern-broward-waterfront"`. Reassign Hillsboro Mile from `cluster: "primary"` to `cluster: "northern-broward-waterfront"`. Render `/markets/` index section #2 with the union `[neighborhood ∪ northern-broward-waterfront]` markets, under a renamed heading: **"Fort Lauderdale waterfront and Northern Broward clusters."**

The renamed heading honors the geographic distinction:
- Eastern Fort Lauderdale neighborhoods (cluster: "neighborhood") → ARE in Fort Lauderdale.
- Northern Broward A1A waterfront corridor (Hillsboro Mile, cluster: "northern-broward-waterfront") → is in Hillsboro Beach, NOT Fort Lauderdale.

The single section visually groups them because that's the cohort serious waterfront buyers compare — not because they share a municipality.

## Why a third cluster value (vs. moving to "neighborhood")

Moving Hillsboro Mile to `cluster: "neighborhood"` would have been a one-line change but would silently encode "Hillsboro Mile is an Eastern Fort Lauderdale neighborhood" — geographically wrong, and the audit:insights `Hillsboro Mile is correctly identified as a Broward barrier-island municipality` check (line 14 of audit-insights.ts) would have started flagging the conflation in the future.

The third cluster value keeps `MarketCluster` honest as a discriminated union ("city/town" vs. "Eastern Fort Lauderdale neighborhood" vs. "Northern Broward waterfront") and the rendering layer joins them only at the section level.

## Implementation

### `src/lib/markets.ts`

1. Extended `MarketCluster` type:
   ```ts
   export type MarketCluster = "primary" | "neighborhood" | "northern-broward-waterfront";
   ```
2. Updated the JSDoc on the `cluster` field of `Market` to document the three values explicitly.
3. Reassigned Hillsboro Mile entry from `cluster: "primary"` → `cluster: "northern-broward-waterfront"` with an inline JSDoc explaining the move + cross-link to this doc.
4. Added Pompano Beach to Hillsboro Mile's `internalLinks` (the Pompano addition lands in the same cycle; Hillsboro Mile is the natural northern-Broward-corridor sibling to the new Pompano Beach market).
5. Added two helper functions:
   - `getNorthernBrowardWaterfrontSlugs(): ReadonlyArray<MarketSlug>` — returns just the new cluster's slugs (currently `["hillsboro-mile"]`).
   - `getFortLauderdaleClusterMarkets(): ReadonlyArray<Market>` — returns the union `[neighborhood ∪ northern-broward-waterfront]`. Source-array order preserved.
   - `getFortLauderdaleClusterSlugs(): ReadonlyArray<MarketSlug>` — convenience for `[slug]/page.tsx` heading auto-detection.

### `src/app/markets/page.tsx`

1. Imported `getFortLauderdaleClusterMarkets` (replaced the prior direct call to `getMarketsByCluster("neighborhood")`).
2. Renamed section #2 heading: "The Fort Lauderdale waterfront and in-town clusters." → **"Fort Lauderdale waterfront and Northern Broward clusters."**
3. Updated section #2 sub-text to clarify the geographic distinction (Eastern Fort Lauderdale neighborhoods + the Northern Broward A1A waterfront corridor at Hillsboro Mile, in the town of Hillsboro Beach, north of Fort Lauderdale city limits).
4. Updated metadata `description` and OpenGraph `description` to reflect the new section + Pompano Beach addition.

### `src/app/markets/[slug]/page.tsx`

1. Imported `getFortLauderdaleClusterSlugs` (replaced `getNeighborhoodSlugs`).
2. Updated `easternFortLauderdaleSlugs` derivation to filter the union back down to ONLY `cluster: "neighborhood"` slugs — so the auto-detected heading "Related Eastern Fort Lauderdale neighborhoods." remains accurate. A peer in the `northern-broward-waterfront` cluster (Hillsboro Mile) routes the page back to the generic "Continue your tour." heading because Hillsboro Mile is not Fort Lauderdale and we will not claim otherwise.

## Verification

- `bun run build` succeeds; 16 markets in `out/markets/`.
- `grep -ic "Hillsboro Mile" out/markets/index.html` → 1 (renders once on /markets/, in section #2 — confirmed by visual inspection of the built HTML and by the section-heading grep below).
- Section headings in built HTML:
  - "South Florida cities and towns." → 6 matches (heading + JSON-LD references)
  - "Fort Lauderdale waterfront and Northern Broward clusters." → 6 matches (heading + JSON-LD references)
- `audit:featured-markets` PASS (17/0/0); `audit:images` PASS (14/0/0); `audit:schema` PASS; `audit:links` PASS; `audit:insights` PASS (547/0/0 with the new built-HTML probe).
- The `audit:insights` Hillsboro-Mile-correctly-identified-as-Broward check (line 14 of audit-insights.ts) is unaffected — Hillsboro Mile remains in `Broward County` per the `county:` field on the Market entry; the cluster move is orthogonal.

## Anti-claims preserved

- ❌ Hillsboro Mile is NOT claimed as Fort Lauderdale.
- ❌ Hillsboro Mile is NOT claimed as a primary city/town the way the South Florida cities-and-towns peers are.
- ✅ Hillsboro Mile IS correctly described as the A1A corridor through the *town of Hillsboro Beach* (preserved from Cycle 13/14 copy).

## Rollback

Single commit. To revert:
1. Revert `MarketCluster` type to `"primary" | "neighborhood"`.
2. Revert Hillsboro Mile entry's `cluster:` to `"primary"`.
3. Remove the three new helper functions.
4. Revert `markets/page.tsx` to use `getMarketsByCluster("neighborhood")` directly + restore the original section heading + metadata description.
5. Revert `markets/[slug]/page.tsx` to use `getNeighborhoodSlugs`.

## Cross-references

- `src/lib/markets.ts` — `MarketCluster` type + `getFortLauderdaleClusterMarkets` helper
- `src/app/markets/page.tsx` — section #2 rendering + heading
- `src/app/markets/[slug]/page.tsx` — auto-detected heading filter
- `docs/CYCLE_18_POMPANO_BEACH_MARKET_IMPLEMENTATION.md` — Pompano Beach addition (same cycle)
- `docs/CYCLE_18_FORT_LAUDERDALE_V4_IMPLEMENTATION.md` — V4 page upgrade (same cycle; Pompano + Hillsboro Mile both surface in the new Buyer's comparison cohort Tier 2)
