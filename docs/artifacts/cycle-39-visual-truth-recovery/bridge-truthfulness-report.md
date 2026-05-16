# Cycle 39 — Bridge Truthfulness Report

date: 2026-05-16

## Truthfulness rule (unchanged from Cycle 38)

The UI must never declare `live` mode unless ALL of these are true:

1. `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` is present at build.
2. `NEXT_PUBLIC_BRIDGE_DATASET_ID` is present and is NOT a test dataset.
3. `NEXT_PUBLIC_BRIDGE_DEMO` is unset or `false`.
4. `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` is the live IDX resource path.
5. The OData query returns plausible SEF MLS records (real listings, real
   SEF-area cities, real mediaUrls under the allowed media-host list).

`src/lib/bridge-client.ts` encodes this as the `getBridgeRuntimeStatus()`
mode-derivation:

- `fallback` — credentials missing at build (no NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN
  or NEXT_PUBLIC_BRIDGE_DATASET_ID).
- `demo` — credentials present + DEMO=true (test fixture path).
- `live` — credentials present + DEMO false + non-test dataset.

The UI renders the corresponding banner:

- `fallback` → "Demo data — Southeast Florida MLS feed pending."
- `demo` → "Demo data — Bridge test fixture connected."
- `live` → no demo banner; "Listing information is deemed reliable but
  not guaranteed. Data provided by Bridge Data Output via Southeast
  Florida MLS." attribution.

Cycle 39 did NOT modify any of this logic.

## Cycle 39 mode classification

```yaml
local_build_mode: fallback
  reason: NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN missing at local build
  banner_visible_local: "Demo data — Southeast Florida MLS feed pending."
  honest: true

staging_expected_mode_pre_deploy: demo
  reason: Dokploy build args unchanged from Cycle 38 — token + test_sf
          dataset + DEMO=true
  staging_mode_observed_post_deploy: pending-phase-12

live_mode_proven: false
  reasons:
    - NEXT_PUBLIC_BRIDGE_DEMO=true in Dokploy build args
    - NEXT_PUBLIC_BRIDGE_DATASET_ID points at test_sf (Bridge test dataset,
      not SEF MLS live dataset)
    - Bridge IDX feed approval for Mia / LPT Realty / SEF MLS not
      operator-confirmed as finalized
```

## What "demo" looks like on staging (per Cycle 38 verification, unchanged)

- Yellow "Demo data — Bridge test fixture connected." banner above the
  result grid.
- Each card carries a DEMO badge in the top-right.
- IDX/MLS disclosure paragraph below the cards explicitly clarifies the
  cards are demo fixtures, not real SEF inventory.
- `data-bridge-runtime-mode="demo"` attribute is rendered on the meta
  div so audit + monitoring can classify the surface.

## Anti-fraud rules

- The `DemoBanner` component renders unconditionally when mode is
  `demo`, `fallback`, or when `BRIDGE_DEMO_MODE` env signal is true. There
  is no UI path that suppresses the banner while serving fixture data.
- The `BridgeListingCard demoMode` prop is true unless `resultMode === "live"`,
  so any non-live result set renders the DEMO badge.
- The fixture data is bounded to 6 well-known FIXTURE-* listingKeys; the
  UI never claims a fixture is a real Southeast Florida listing.

## Cycle 39 contributions to truthfulness

- The new `test-home-search-bridge-e2e.ts` test asserts that the mode
  marker is rendered AND that the IDX/MLS disclosure copy renders AND
  that no old-IDX runtime markers leak into the page. A regression that
  ever produced a fraudulent live-without-disclosure surface would FAIL
  this E2E test.

## Recommended live-activation mission (operator-led)

```
1. Operator confirms in Dokploy: dataset is SEF live, resource path is
   live IDX, DEMO is unset/false.
2. Operator confirms Bridge IDX feed approval finalized.
3. Operator triggers Dokploy redeploy.
4. AI runs sanitized browser probe via test-home-search-bridge-e2e.ts +
   verifies data-bridge-runtime-mode === "live" + sample records are
   plausible SEF listings (city in SEF list, mediaUrl on allowed host).
5. AI commits a single decision-record entry "Bridge live mode verified"
   with the sanitized probe artifact.
```

Nothing else, until then.
