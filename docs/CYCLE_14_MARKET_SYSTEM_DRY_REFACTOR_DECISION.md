# Cycle 14 — Phase 1 · Market-System DRY Refactor Decision

**Date:** 2026-05-10
**Decision authority:** Algorithm v6.4.0 OBSERVE/THINK/PLAN (Cycle 14)
**Outcome (one sentence):** Collapse 6 hardcoded slug-array surfaces to 2 canonical helper layers — `src/lib/mia.ts` (slug + route + image-path helpers) and `src/lib/markets.ts` (cluster-derived helpers) — with a new `Market.cluster` field driving the partition the audit scripts and pages currently hand-maintain.

---

## 1. Problem

Cycle 13 added two markets and required 5 audit-script edits + 4 source-file edits to surface them. The 10-touch operation is documented in `CYCLE_13_PROCESS_UPGRADE_REPORT.md` Lesson 1. The leak: every script and page that needs to walk the market space hand-rolls its own slug list. The next market addition repeats the 10 edits — unless the slug lists collapse to a single source of truth.

## 2. Inventory of hardcoded surfaces

| File | Constant | Type | Coverage |
|---|---|---|---|
| `src/lib/mia.ts` | `ALL_MARKET_SLUGS` | `as const` array | 15 slugs — canonical SOT |
| `src/lib/mia.ts` | `FEATURED_SET` | `Set<MarketSlug>` | 8 slugs — canonical SOT |
| `src/app/markets/page.tsx` | `PRIMARY_SLUGS` | `Set<string>` | 7 cluster-A primary city slugs |
| `src/app/markets/page.tsx` | `NEIGHBORHOOD_SLUGS` | `Set<string>` | 8 Eastern FtL neighborhood slugs |
| `src/app/markets/[slug]/page.tsx` | `easternBrowardSlugs` | local `Set` | 8 slugs — duplicates `NEIGHBORHOOD_SLUGS` |
| `scripts/audit-images.ts` | `marketSlugs` | array | 15 slugs |
| `scripts/audit-images.ts` | `expectedFeatured` | array | 8 slugs |
| `scripts/audit-images.ts` | `principalReportedMarkets` | array | 3 slugs |
| `scripts/audit-completeness.ts` | `MARKET_PAGES` | `as const` array | 16 routes (incl. `/markets/`) |
| `scripts/audit-rendered-visual.ts` | `REQUIRED_ROUTES` | `as const` array | 27 routes (15 markets + 12 non-market) |
| `scripts/capture-baseline.ts` | `ROUTES_DEFAULT` | array | 28 routes (15 markets + 13 non-market) |
| `scripts/audit-hero-pixel-contrast.ts` | `REQUIRED_ROUTES` | `as const` array | 10 routes; **already discovers** `/markets/<slug>/` from filesystem |

**Net:** 6 distinct slug-array surfaces that change with every market addition (the `as const` arrays in mia.ts and the `Set`s/arrays in the others). The hero-pixel-contrast script already does dynamic discovery — proves the pattern is workable.

## 3. Decision

### 3.1 Single source of truth

`src/lib/mia.ts` and `src/lib/markets.ts` are the canonical layer. Both modules are pure data + types — no `next/*` imports — so Bun-runnable scripts can safely import from them.

### 3.2 New canonical helpers in `src/lib/mia.ts`

These operate on slug strings only — no `MARKETS` data dependency, no circular import risk.

```typescript
export const MARKETS_INDEX_ROUTE = "/markets/" as const;
export function getMarketRoute(slug: MarketSlug): string;       // "/markets/<slug>/"
export function getAllMarketRoutes(): ReadonlyArray<string>;    // ["/markets/<a>/", ..., "/markets/<o>/"]  (15)
export function getAllMarketRoutesIncludingIndex(): ReadonlyArray<string>; // ["/markets/", "/markets/<a>/", ...] (16)
export function getFeaturedMarketSlugs(): ReadonlyArray<MarketSlug>;
export function getFeaturedMarketRoutes(): ReadonlyArray<string>;
export function getMarketImagePath(slug: MarketSlug): string;   // "/markets/<slug>.jpg"
export function getMarketOgImagePath(slug: MarketSlug): string; // "/og-markets/<slug>.jpg"
```

Audit-script-friendly: only depends on `ALL_MARKET_SLUGS` and `FEATURED_SET` — both already in this file.

### 3.3 New `Market.cluster` field in `src/lib/markets.ts`

Extend the `Market` type with a discriminator for the existing partition logic:

```typescript
export type MarketCluster = "primary" | "neighborhood";

export type Market = {
  // ... existing fields ...
  readonly cluster: MarketCluster;
  // ... existing fields ...
};
```

Then **all 15 entries get `cluster:` populated** from the existing partition logic in `markets/page.tsx`:

| Cluster | Slugs |
|---|---|
| `"primary"` (7) | fort-lauderdale, boca-raton, delray-beach, palm-beach, lighthouse-point, hillsboro-mile, sea-ranch-lakes |
| `"neighborhood"` (8) | coral-ridge, victoria-park, rio-vista, harbor-beach, las-olas-isles, seven-isles, bay-colony, bermuda-riviera |

### 3.4 New canonical helpers in `src/lib/markets.ts`

```typescript
export function getMarketsByCluster(cluster: MarketCluster): ReadonlyArray<Market>;
export function getPrimarySlugs(): ReadonlyArray<MarketSlug>;
export function getNeighborhoodSlugs(): ReadonlyArray<MarketSlug>;
```

These read `MARKETS` and filter — they cannot live in `mia.ts` without inducing a circular import.

### 3.5 Internal-link cap relaxed

The current `Market.internalLinks` JSDoc reads "2-4 cross-pollination links". Phase 3 (reverse-link curation) needs to add 1-2 links to several peer markets to wire Bay Colony + Bermuda Riviera into the cohort. Update the JSDoc cap to **"2-6"** so the additions don't violate the soft contract; the type itself remains `ReadonlyArray<MarketInternalLink>` (no upper bound at the type level).

### 3.6 Audit-script imports

Each script that currently hardcodes slugs imports the canonical helpers. Bun supports TypeScript imports natively; no transpilation step needed. Existing scripts' Bun runtime + type-import guarantees:

- `import { ALL_MARKET_SLUGS, getMarketImagePath, getMarketOgImagePath } from "../src/lib/mia";`
- `import { MARKETS, getPrimarySlugs, getNeighborhoodSlugs } from "../src/lib/markets";`

Side-effect-free: both source modules export plain data and pure functions — no top-level network/IO/console writes.

### 3.7 Static export compatibility

`src/lib/mia.ts` and `src/lib/markets.ts` already participate in the Next.js static-export pipeline. No new client-only or server-only code introduced. Helper functions are deterministic and can be evaluated at build time.

## 4. What stays curated (NOT collapsed)

| Surface | Why preserved |
|---|---|
| `FEATURED_SET` | Display curation, not derivable. Stays a hand-edited `Set` in `mia.ts`. |
| `principalReportedMarkets` (audit-images.ts) | Cycle 9 sentinel for the 3 specific markets that surfaced visible-defects historically — explicit naming is the design feature, not a data leak. |
| `audit-rendered-visual.REQUIRED_ROUTES` non-market entries | `/`, `/about/`, `/buyers/`, `/sellers/`, `/valuation/`, `/contact/`, `/insights/`, `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/` — these are hand-curated routes, not market-data-derived. They stay in the script. |
| `capture-baseline.ROUTES_DEFAULT` non-market entries | Same — non-market routes are curated for screenshot priority, not derivable. |

The market portion of those scripts collapses; the non-market curation stays.

## 5. Refactor surface

| File | Change |
|---|---|
| `src/lib/mia.ts` | + `getMarketRoute` + `getAllMarketRoutes` + `getAllMarketRoutesIncludingIndex` + `getFeaturedMarketSlugs` + `getFeaturedMarketRoutes` + `getMarketImagePath` + `getMarketOgImagePath` + `MARKETS_INDEX_ROUTE` |
| `src/lib/markets.ts` | + `MarketCluster` type · + `cluster` field on Market type · populate `cluster:` on all 15 entries · + `getMarketsByCluster` + `getPrimarySlugs` + `getNeighborhoodSlugs` · JSDoc internalLinks cap "2-4" → "2-6" |
| `src/app/markets/page.tsx` | swap `PRIMARY_SLUGS`/`NEIGHBORHOOD_SLUGS` Sets for derived `getMarketsByCluster()` |
| `src/app/markets/[slug]/page.tsx` | swap `easternBrowardSlugs` Set for `new Set(getNeighborhoodSlugs())` |
| `scripts/audit-images.ts` | swap `marketSlugs` for `[...ALL_MARKET_SLUGS]` · `expectedFeatured` for `[...getFeaturedMarketSlugs()]` · keep `principalReportedMarkets` (curated sentinel) · use `getMarketImagePath`/`getMarketOgImagePath` |
| `scripts/audit-completeness.ts` | swap market portion of `MARKET_PAGES` for `[MARKETS_INDEX_ROUTE, ...getAllMarketRoutes()]` |
| `scripts/audit-rendered-visual.ts` | swap market portion of `REQUIRED_ROUTES` for `getAllMarketRoutesIncludingIndex()` |
| `scripts/capture-baseline.ts` | swap market portion of `ROUTES_DEFAULT` for `getAllMarketRoutesIncludingIndex()` |

**6 hardcoded slug surfaces collapsed to 2 canonical helper layers.** Future market additions become: edit `markets.ts` MARKETS array (add Market entry with `cluster:`) + edit `mia.ts` (append slug to `ALL_MARKET_SLUGS` and optionally `FEATURED_SET`). 2-touch operation, down from 10.

## 6. Acceptance criteria

- typecheck/lint/build remain exit 0
- `bun run audit:all` remains 0 FAIL with same WARN profile (15 PASS·1 WARN baseline)
- audit-images, audit-completeness, audit-rendered, audit-hero-contrast, audit-brand outputs report identical route/market counts as pre-refactor
- No `import "next/*"` introduced into `src/lib/markets.ts` or `src/lib/mia.ts`
- No new circular imports introduced (verified by typecheck)
- Static export still produces 27 routes
- Zero behavioral regression on rendered output (Bay Colony + Bermuda Riviera still appear in homepage Featured Markets, /markets/ index, sitemap; cluster-A neighborhoods still get the "Related Eastern Fort Lauderdale neighborhoods" heading on detail pages)

## 7. Risk and rollback

- **Risk:** circular import between `markets.ts` and `mia.ts`. **Mitigation:** helpers in `mia.ts` only operate on slug strings (no `MARKETS` access); helpers that need `MARKETS` live in `markets.ts`. Verified by typecheck before commit.
- **Risk:** audit script Bun-runtime can't resolve `../src/lib/*` import paths. **Mitigation:** existing scripts already import from `node:fs/promises`; Bun TypeScript resolution handles `.ts` source imports natively. Verified by `bun run scripts/<name>.ts` smoke test.
- **Risk:** `principalReportedMarkets` becomes the only market-data hand-edit in audit-images.ts; future regression where the 3 sentinel markets are renamed/removed silently breaks the check. **Mitigation:** the script already validates each sentinel slug exists in `MARKETS` via the existing `marketSlugs.includes` pattern; a missing slug surfaces as a check failure.
- **Rollback:** atomic commit per file (or one bundled commit per Phase 2). `git revert` restores Cycle 13 state.

## 8. Decision

**APPROVED.** Proceeding to Phase 2 implementation.
