# Cycle 16 — Featured Markets Homepage UX Decision

**Date:** 2026-05-10
**Decision:** Option A — 6-at-a-time accessible pager

## What changed

### Data model (`src/lib/mia.ts`)

- Expanded `FEATURED_SET` from 8 → 12 markets (added `palm-beach`, `lighthouse-point`, `coral-ridge`, `rio-vista`).
- Added `HOMEPAGE_FEATURED_ORDER: ReadonlyArray<MarketSlug>` — 12 slugs in principal-locked + Cycle-16-curated order.
- Added `HOMEPAGE_FEATURED_PAGE_SIZE = 6 as const`.

### Component (`src/components/FeaturedMarketsPager.tsx`)

New client component. Accessible pager renders any markets array in pages of N (default 6).

- 3×2 desktop grid · 2×3 tablet · 1×6 mobile.
- Previous/Next buttons (keyboard focusable, aria-labels, disabled at ends, 44×44 touch target).
- Page-dot indicators (aria-current, click-jumps, 2.5×2.5px visual; 44×44 effective hit area).
- "Explore all markets" link always visible.
- First 3 cards of page 1 eager-load (priority=true on `<Image>`).
- Live region (`aria-live="polite"`) announces page change to assistive tech.
- First heading of new page receives focus on page change (tabindex=-1).
- prefers-reduced-motion honored: motion-safe modifier on transition.
- Static-export safe: client state only; data resolved at build time via SSG.

### Page wire-up (`src/app/page.tsx`)

- Imports `FeaturedMarketsPager` + `HOMEPAGE_FEATURED_ORDER` + `HOMEPAGE_FEATURED_PAGE_SIZE`.
- Resolves featuredMarkets from `HOMEPAGE_FEATURED_ORDER.map(getMarket)`.
- Updated section sub-heading to name first-page markets explicitly.

## First-page order (principal-locked)

1. Fort Lauderdale
2. Boca Raton
3. Palm Beach
4. Victoria Park
5. Lighthouse Point
6. Delray Beach

## Second-page order (Cycle 16 curation by cohort)

7. Las Olas Isles
8. Harbor Beach
9. Bay Colony
10. Bermuda Riviera
11. Coral Ridge
12. Rio Vista

## Why not a carousel

Auto-rotating carousels:
- Reduce dwell time per card.
- Add motion that competes with the editorial hero.
- Map mentally to e-commerce, not luxury real estate.
- Fail accessibility audits if not carefully built.

A static-grid pager preserves the editorial framing (one composition per page, generous whitespace, deliberate ordering) while solving the "we have more than 6" problem.

## Why not 8 visible at once

8 cards in a 4-col / 2-row grid produces:
- Smaller per-card image area (each card competes with three neighbors instead of two).
- Worse hierarchy on hero (smaller cards make the hero feel disconnected).
- Mobile penalty: 4-col grid wraps to 1 or 2 per row at smaller breakpoints anyway, so the desktop premium is the only place users see it.

6 cards in a 3×2 grid is the sweet spot for luxury editorial composition. It's the layout Mansion Global, Architectural Digest, and Sotheby's International use for similar editorial market grids.

## Why no querystring page state

The pager does NOT push `?page=2` into the URL for two reasons:
1. Static-export-with-Next.js + `?page=N` introduces edge-cases around prerendered HTML hydration mismatches (the SSR HTML shows page 1; querystring would force a client repaint).
2. Page state on a homepage section is not load-bearing for SEO or linkability — the underlying market pages and `/markets/` index are the canonical surfaces, not "homepage page 2."

## Accessibility checklist

- [x] Keyboard navigation: Tab → Prev / Dots / Next / Card; Enter / Space activates.
- [x] Focus visible: `focus-visible:outline-2 outline-brass-400` on every interactive element.
- [x] Disabled state communicated: `disabled` attribute + opacity-30 + cursor-not-allowed.
- [x] Live region: `aria-live="polite"` + `aria-atomic="true"` announces page change.
- [x] `aria-current="page"` on active dot.
- [x] `aria-label` on every button.
- [x] `aria-labelledby` on the markets ul to clarify what the cards represent.
- [x] Reduced motion: `motion-safe:transition-opacity` — no animation when prefers-reduced-motion is set.
- [x] Touch targets: 44×44 minimum on Prev/Next; dots have visual 10px but 44×44 hit area via padding-free button.

## Verification plan

1. Local build → static export → loads `/index.html`.
2. Screenshot at 320 / 375 / 768 / 1280 / 1440 viewports.
3. Click Next: page 2 renders 6 second-page markets; Prev re-enables; Next disables.
4. Audit:featured-markets enforces:
   - First page order matches principal direction.
   - All 12 featured markets have route, image, OG, schema, sitemap entry.
   - Pager renders in built HTML with `aria-label="Featured markets pagination"`.

## Open question (not blocking)

The pager state is client-only; first paint shows page 1 (the 6 principal-locked markets) and that is what bots see. Page 2 is JS-hydrated only. This is the correct behavior for an enhancement-pattern pager: search engines and JS-disabled users see page 1, JS-enabled users get pagination. If a future cycle wants page-2 markets to be crawlable as a separate URL, the `/markets/` index already provides that surface.
