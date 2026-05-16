# Cycle 38 — Homepage Hero Implementation Report

date: 2026-05-16

## Goal

1. Replace the homepage hero image with the operator-authorized miasanabria.com hero composition.
2. Make the homepage search card float over the hero image (mobile/tablet/desktop) — matching the production miasanabria.com layout pattern.
3. Wire the floating search to `/home-search/` with Bridge-compatible query params; have `BridgeSearch` consume those params on arrival.

## Source changes

### `src/app/page.tsx`

- Wrapped `<Hero>` + `<HeroSearch />` in a `relative` container so the search card can absolutely-position over the hero.
- Hero `imageSrc` changed from `/markets/fort-lauderdale.jpg` to `/hero/mia-home-hero.jpg`.
- Hero `imageAlt` updated to describe the new composition.
- `<HeroSearch floating />` passed to render the new floating-card variant.
- Added a 16/20-rem aria-hidden spacer below the wrapper so subsequent sections clear the floating card.
- Replaced the Cycle-34 comment block with a Cycle-38 comment recording the operator-authorized hero reuse + the new floating-search wiring.

### `src/components/HeroSearch.tsx`

- New `{ floating?: boolean }` prop.
- Form action changed from `/markets/#property-search` to `/home-search/`.
- Hidden `<input name="source" value="home-hero">` added for analytics tagging.
- Field `name` attributes aligned to BridgeSearch's expected query shape:
  - `city` now emits the neighborhood **label** (e.g. "Fort Lauderdale"), not the slug. BridgeSearch compares against `MIA_APPROVED_NEIGHBORHOODS.label`.
  - Price field renamed from `price` (range string) to `minPrice` (integer).
  - `beds` field unchanged (already integer).
- Submit-button label updated from "Search Homes" to "Search Listings" to match BridgeSearch wording.
- Footer copy updated to point users at the Bridge-backed home search rather than `/markets/#property-search`.
- When `floating=true`: card renders as `data-floating="true"`, with `pointer-events-none` wrapper + `pointer-events-auto` inner so the rest of the hero remains interactive. Negative top margin pulls it up onto the hero image. `bg-cream-50/95` + `backdrop-blur` gives the floating-glass aesthetic.

### `src/components/bridge/BridgeSearch.tsx`

- New `parseInitialQueryFromUrl()` helper:
  - Reads `city`, `minPrice`, `beds` from `window.location.search`.
  - Accepts city as either label or slug (graceful — if a slug lands here, it's mapped to the label).
  - Returns `{ initial, hasMeaningful }`.
- New `useEffect` on mount: if any meaningful param is present, set state and auto-trigger `searchListings`. Honors the existing `inFlightRef` AbortController pattern.
- ESLint `react-hooks/exhaustive-deps` suppression on the mount-only effect — intentional one-shot.

## Floating-card layout decisions

- The card uses `relative -mt-20 sm:-mt-24` (negative top margin pulls it up onto the hero) and `z-20` so it sits above the hero overlays.
- `pointer-events-none` on the outer wrapper so the area NOT covered by the card (transparent space surrounding the card) doesn't block clicks on the hero CTAs above it. `pointer-events-auto` on the card itself so its form is interactive.
- `bg-cream-50/95 backdrop-blur` gives translucent glass over the hero.
- The card holds its `max-w-7xl` so it doesn't stretch unreadably on wide viewports.
- On mobile the card occupies almost the full width with `-mt-20`, on tablet/desktop slightly more lift with `sm:-mt-24`.

## Param flow

```
Homepage hero form (GET /home-search/?city=…&minPrice=…&beds=…&source=home-hero)
        │
        ▼
/home-search/ (static export — Bridge UI mounts client-side)
        │
        ▼
BridgeSearch.useEffect (mount)
        │
        ├── parseInitialQueryFromUrl() — reads URL params, maps slug→label if needed
        ├── if hasMeaningful → setQuery(initial); searchListings(...).
        │
        ▼
Results rendered with appropriate mode banner (live | demo | fallback | error)
```

## Anti-regression audit

- `scripts/audit-home-bridge-search.ts` checks:
  1. Homepage form action is `/home-search/`
  2. Hidden `source=home-hero` input is present
  3. `city`, `minPrice`, `beds` filter inputs exist
  4. Legacy `/markets/#property-search` action is absent
  5. No old IDX runtime markers (MlsMatrix, sef.mlsmatrix.com, idxbroker, ihomefinder, flexmls, showcaseidx) on homepage
  6. `/home-search/` exposes BridgeSearch surface (`aria-label="Search available listings"` or `data-bridge-runtime-mode`)
  7. Homepage has the floating-card marker (`data-floating="true"` or `data-home-hero-search="true"`) so a future layout regression is detectable
- Registered in `package.json` as `audit:home-bridge-search`.

## What this report does NOT do

- Does not change Bridge mode (demo/live decision lives in Phase 6 and depends on Dokploy build args).
- Does not modify production miasanabria.com.
- Does not rotate any credentials or expose any token values.
