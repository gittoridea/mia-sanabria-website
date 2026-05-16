# Cycle 37 — Prior-State Review

## What Cycle 36D shipped

Commit `772cc5e` (docs) + deployed source `3a99bc3`. Stabilized hero contrast gate, closed Bridge truthfulness QA, retained semantic Bridge demo-warning exception in `audit:brand`, verified `https://miasanabriarealtor.trueidea.com/` live after tmux deploy.

## What Cycle 36D did NOT solve

1. New neighborhood pages still ship with brand-tone placeholder JPGs (Coral Springs, Davie, Deerfield Beach, Hollywood, Plantation, Sunrise, Weston).
2. Old IDX / MLS Matrix iframe fallback still present in runtime source AND rendered in homepage `IdxEmbed` + Bridge no-credentials/error fallback.
3. Bridge runtime mode was implicit (only `BRIDGE_AVAILABLE` + `BRIDGE_DEMO_MODE` constants); no typed `BridgeRuntimeStatus` for honest live/demo/fallback/error rendering.

## Why prior "images adequate" claim must be re-tested

`src/lib/mia.ts` line 178-186 documents the truth at file-level:
> "Backing /markets/<slug>/ pages added in the same cycle; brand-tone placeholder hero JPGs are stand-ins until Mia provides licensed photography."

The on-disk file sizes confirm: 7 placeholder neighborhoods at 36–65 kB (hero) and 36–42 kB (OG) versus real-photo markets at 244–613 kB / 137–252 kB. The audit-images PASS in earlier cycles only verified existence — not visual richness — so it could never catch placeholder-only state.

## Current Bridge / IDX truthfulness

Pre-Cycle-37:
- `BRIDGE_INTEGRATION_LIVE = true` constant
- `BRIDGE_AVAILABLE` derived from `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` + `NEXT_PUBLIC_BRIDGE_DATASET_ID` at build
- `BRIDGE_DEMO_MODE` derived from `NEXT_PUBLIC_BRIDGE_DEMO=true`
- When `!BRIDGE_AVAILABLE`, BridgeSearch rendered a `MlsMatrixFallback` iframe pointing at `sef.mlsmatrix.com` — **the legacy IDX runtime path**
- When error: same `MlsMatrixFallback` with a different reason
- Homepage `IdxEmbed.tsx` rendered the `sef.mlsmatrix.com` iframe directly

Bridge live-feed proven? **No** — no Bridge credentials are present in this shell (presence-only env probe), and the documented Cycle 36D conclusion was demo/fallback. No new evidence of live promotion.

## Where old IDX exists in source (pre-refactor)

```
scripts/audit-completeness.ts:382  matrixHost: /sef\.mlsmatrix\.com\/Matrix\/Public\/IDXSearch/  (sentinel — required iframe)
src/components/IdxEmbed.tsx:2      sef.mlsmatrix.com iframe URL
src/components/bridge/BridgeSearch.tsx:35  MLS_MATRIX_URL constant
src/components/bridge/BridgeSearch.tsx:37  MlsMatrixFallback component
src/components/bridge/BridgeSearch.tsx:154 used at no-credentials path
src/components/bridge/BridgeSearch.tsx:276 used at error path (no-credentials)
src/components/bridge/BridgeSearch.tsx:280 used at error path (search-error)
src/lib/bridge.ts:68                comment referencing MLS Matrix
src/lib/site.ts:78                  comment referencing MLS Matrix
src/app/page.tsx:12 + 165           IdxEmbed import + render on homepage
```

## What Cycle 37 must implement

1. Generate real images for the 7 placeholder neighborhoods.
2. Delete `IdxEmbed.tsx` and remove from homepage.
3. Replace `MlsMatrixFallback` (no-credentials AND error) with a Bridge-only fallback path: bundled fixture listings + `DemoBanner` + `DEMO` badges + IDX/MLS disclosure.
4. Introduce typed `BridgeRuntimeStatus { mode: live|demo|fallback|error|unconfigured, ... }`; `searchListings()` returns `mode`; UI renders truthful banners + attribution per-mode.
5. Clean MLS Matrix references from `src/lib/bridge.ts` + `src/lib/site.ts` + `scripts/audit-completeness.ts`.
6. Add `scripts/audit-no-old-idx.ts` that fails on `MlsMatrix*`, `mlsmatrix`, `MatrixFallback`, etc., across `src/`, `public/`, `out/`, `.next/` while permitting compliance "IDX/MLS disclosure" copy + Bridge Data Output references.
7. Add `scripts/audit-neighborhood-images-deep.ts` enforcing min file size + dimensions per market.
8. Wire both new audits into `package.json` and `audit:all`.
9. Validate, commit, deploy, verify on `https://miasanabriarealtor.trueidea.com/`.
