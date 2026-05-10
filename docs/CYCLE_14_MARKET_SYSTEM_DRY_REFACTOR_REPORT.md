# Cycle 14 — Phase 2 · Market-System DRY Refactor Report

**Date:** 2026-05-10
**Decision:** `docs/CYCLE_14_MARKET_SYSTEM_DRY_REFACTOR_DECISION.md`
**Outcome:** **6 hardcoded slug-array surfaces collapsed to 2 canonical helper layers.**

---

## 1. Surfaces collapsed

| Surface | Before | After |
|---|---|---|
| `src/app/markets/page.tsx` `PRIMARY_SLUGS` | 7-slug `Set<string>` | `getMarketsByCluster("primary")` |
| `src/app/markets/page.tsx` `NEIGHBORHOOD_SLUGS` | 8-slug `Set<string>` | `getMarketsByCluster("neighborhood")` |
| `src/app/markets/[slug]/page.tsx` `easternBrowardSlugs` | 8-slug local `Set` | `new Set(getNeighborhoodSlugs())` |
| `scripts/audit-images.ts` `marketSlugs` | 15-element array literal | `[...ALL_MARKET_SLUGS]` |
| `scripts/audit-images.ts` `expectedFeatured` | 8-element array literal | `[...getFeaturedMarketSlugs()]` |
| `scripts/audit-completeness.ts` `MARKET_PAGES` | 16-route array literal | `[MARKETS_INDEX_ROUTE, ...getAllMarketRoutes()]` |
| `scripts/audit-rendered-visual.ts` `REQUIRED_ROUTES` (market portion) | 15 explicit market routes | `getAllMarketRoutesIncludingIndex()` |
| `scripts/capture-baseline.ts` `ROUTES_DEFAULT` (market portion) | 15 explicit market routes | `getAllMarketRoutesIncludingIndex()` |

**6 distinct slug-arrays collapsed.** (`PRIMARY_SLUGS` and `NEIGHBORHOOD_SLUGS` count as one surface — both collapsed via `Market.cluster`.)

## 2. New canonical helper layer

### `src/lib/mia.ts` (slug + route + image-path helpers)

```typescript
export const MARKETS_INDEX_ROUTE = "/markets/" as const;
export function getMarketRoute(slug: MarketSlug): string;
export function getAllMarketRoutes(): ReadonlyArray<string>;                 // 15 entries
export function getAllMarketRoutesIncludingIndex(): ReadonlyArray<string>;   // 16 entries
export function getFeaturedMarketSlugs(): ReadonlyArray<MarketSlug>;
export function getFeaturedMarketRoutes(): ReadonlyArray<string>;
export function getMarketImagePath(slug: MarketSlug): string;                // "/markets/<slug>.jpg"
export function getMarketOgImagePath(slug: MarketSlug): string;              // "/og-markets/<slug>.jpg"
```

`ALL_MARKET_SLUGS` was promoted from module-local to `export const` so audit scripts can import it.

### `src/lib/markets.ts` (cluster-derived helpers)

```typescript
export type MarketCluster = "primary" | "neighborhood";

export function getMarketsByCluster(cluster: MarketCluster): ReadonlyArray<Market>;
export function getPrimarySlugs(): ReadonlyArray<MarketSlug>;
export function getNeighborhoodSlugs(): ReadonlyArray<MarketSlug>;
```

The `Market` type gained a required `cluster: MarketCluster` field. All 15 entries populated:

| Cluster | Slugs |
|---|---|
| `"primary"` (7) | fort-lauderdale, boca-raton, delray-beach, palm-beach, lighthouse-point, hillsboro-mile, sea-ranch-lakes |
| `"neighborhood"` (8) | coral-ridge, victoria-park, rio-vista, harbor-beach, las-olas-isles, seven-isles, bay-colony, bermuda-riviera |

`Market.internalLinks` JSDoc cap raised from "2-4" to "2-6" to absorb Phase 3 reverse-link curation.

## 3. What stayed curated (deliberate)

| Surface | Why not collapsed |
|---|---|
| `FEATURED_SET` in `mia.ts` | Display curation — featured ≠ all. Stays a hand-edited `Set`. |
| `principalReportedMarkets` in `audit-images.ts` | Cycle-9 sentinel — explicit naming of 3 historically-defective markets is the design feature. |
| Non-market routes in `audit-rendered-visual.ts` and `capture-baseline.ts` | Hand-curated screenshot priority list. Not market-data-derived. Now lives in a clearly-labeled `NON_MARKET_ROUTES` constant. |

## 4. Acceptance gate (post-refactor)

| Check | Pre-refactor | Post-refactor |
|---|---|---|
| `bun run typecheck` | exit 0 | exit 0 ✓ |
| `bun run lint` | exit 0 | exit 0 ✓ |
| `bun run build` | exit 0 · 27 routes · 15 markets prerendered | exit 0 · 27 routes · 15 markets prerendered ✓ |
| `audit:images` | 14 PASS · 0 WARN · 0 FAIL | 14 PASS · 0 WARN · 0 FAIL ✓ |
| `audit:completeness` | 15 PASS · 1 WARN · 0 FAIL | 15 PASS · 1 WARN · 0 FAIL ✓ (same mailto WARN) |
| `audit:brand` | 12 PASS · 0 WARN · 0 FAIL | 12 PASS · 0 WARN · 0 FAIL ✓ |
| `audit:links` | 1351 internal links · 0 broken | 1351 internal links · 0 broken ✓ |
| `audit:schema` | 161/165 blocks across 27/29 pages · all parse | 165 blocks across 29 pages · all parse ✓ |
| `audit:seo` | 0 warnings · 0 errors | 0 warnings · 0 errors ✓ |

**Zero behavioral regression.** Same routes, same markets, same JSON-LD, same email consistency, same featured-card rendering, same hero structure.

## 5. Future-market-add cost

| Operation | Pre-refactor | Post-refactor |
|---|---|---|
| Edit `mia.ts` ALL_MARKET_SLUGS | ✓ | ✓ |
| Edit `mia.ts` FEATURED_SET (if featured) | ✓ | ✓ |
| Edit `markets.ts` MARKETS array (data) | ✓ | ✓ |
| Edit `markets.ts` MARKETS entry — populate `cluster` | (didn't exist) | ✓ NEW |
| Edit `markets/page.tsx` PRIMARY_SLUGS or NEIGHBORHOOD_SLUGS | ✓ | ✗ derived |
| Edit `markets/[slug]/page.tsx` easternBrowardSlugs | ✓ | ✗ derived |
| Edit `audit-images.ts` marketSlugs | ✓ | ✗ derived |
| Edit `audit-images.ts` expectedFeatured (if featured) | ✓ | ✗ derived |
| Edit `audit-completeness.ts` MARKET_PAGES | ✓ | ✗ derived |
| Edit `audit-rendered-visual.ts` REQUIRED_ROUTES | ✓ | ✗ derived |
| Edit `capture-baseline.ts` ROUTES_DEFAULT | ✓ | ✗ derived |

**10-touch operation → 3-touch operation.** ~70% reduction in edits-per-market-add.

## 6. No new circular imports

```
src/lib/mia.ts        — pure data + slug-string helpers (no MARKETS dependency)
src/lib/markets.ts    — imports MarketSlug type from mia.ts; exports MARKETS + cluster helpers
src/app/markets/page.tsx          — imports getMarketsByCluster from markets.ts
src/app/markets/[slug]/page.tsx   — imports MARKETS, getMarket, getNeighborhoodSlugs from markets.ts
scripts/audit-images.ts           — imports ALL_MARKET_SLUGS, getFeaturedMarketSlugs, getMarketImagePath, getMarketOgImagePath from mia.ts
scripts/audit-completeness.ts     — imports MARKETS_INDEX_ROUTE, getAllMarketRoutes from mia.ts
scripts/audit-rendered-visual.ts  — imports getAllMarketRoutesIncludingIndex from mia.ts
scripts/capture-baseline.ts       — imports getAllMarketRoutesIncludingIndex from mia.ts
```

`mia.ts` does NOT import `markets.ts`. Audit scripts import from `mia.ts` only (cheapest dependency footprint — no need to load 1100-line markets.ts data when slug strings suffice).

## 7. Scripts using ImagePath helpers — deferred

`audit-images.ts` still uses `${slug}.jpg` literals in two places (the asset-existence walk and the per-market filesystem checks) rather than `getMarketImagePath(slug)`. The DRY win is on the slug arrays themselves; the literal-path patterns are unambiguous and would only complicate the script's `join(PUBLIC_DIR, ...)` reasoning. Helpers are exported and available; future authors can adopt them where it pays.

## 8. Risk surfaced and resolved

| Risk | Resolution |
|---|---|
| `Market.cluster` becomes required field; existing in-flight branches with new Market entries break | All 15 current entries populated; future entries get TypeScript error on missing field — fail-fast, not silent |
| `ALL_MARKET_SLUGS` was module-local; promoting to `export` could expose mutation surface | Already `as const` — readonly tuple type; export is type-safe |
| Audit scripts importing from `src/lib/*.ts` cross the `src/`/`scripts/` boundary | Bun's TypeScript resolution handles this natively; no `tsconfig` paths added; same pattern Next.js uses internally |
| `getMarketsByCluster` filter changes display order | MARKETS array order preserved; filter walks in source order; visually identical to pre-refactor partition |

## 9. Conclusion

DRY refactor shipped in one bundled commit per file (or one combined commit per Phase 2). Acceptance gates green. **The market system has 1 source of truth for slugs, 1 source of truth for cluster classification, and 0 hand-maintained slug arrays in scripts.** Next market addition costs 3 edits, not 10.
