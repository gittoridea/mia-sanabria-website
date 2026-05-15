# Bridge Staging Pre-Deploy Probe

**Generated:** 2026-05-14T20:55Z
**Staging base:** `https://miasanabriarealtor.trueidea.com`
**Method:** static HTML curl + JS chunk download + chunk needle inspection (NO secret values printed in this report; the deployed JS chunk is gitignored under `docs/artifacts/**/staging-html/*chunk*.js`).
**Cache-bust:** `?cb=<8-byte-hex>` per project `CLAUDE.md` — etag changes signal deploy flips.

## What the deployed chunk has baked in (Cycle 33B build, last shipped)

Inspected `out/_next/static/chunks/app/home-search/page-4e686a00462ff90a.js`:

| Build-time literal | Inlined value (redacted) |
|---|---|
| `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` | present — 32-char hex shape (public by Option D design; not reproduced here) |
| `NEXT_PUBLIC_BRIDGE_DATASET_ID` | `test_sf` (Bridge San-Francisco TEST fixture — not Mia inventory) |
| `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` | `Property` (test datasets do not ship the IDX-licensed `idx/Properties` feed) |
| `NEXT_PUBLIC_BRIDGE_DEMO` | inlined to **true** — DemoBanner gate is statically true; demo banner renders on every search |
| `BRIDGE_AVAILABLE` | resolves to `true` (token + dataset both non-empty) |

Verified by `demoMode:true` literal observed in the chunk's BridgeListingCard call site, and the unconditional `<DemoBanner />` JSX in the result branch (terser collapsed `true && <DemoBanner />` → `<DemoBanner />`).

## What the staging UI shows (rendered via `bun run scripts/capture-baseline.ts`)

Captured to `docs/artifacts/cycle-36-bridge-live-integration/visual-qa/staging-pre-deploy/`:

- `home-search__1280x2600.png` (full-page tall capture) shows:
  - Hero with "South Florida Lifestyle" eyebrow + "Home Search" H1 + waterfront image (BRIDGE_AVAILABLE=true → no MlsMatrixFallback iframe)
  - "Search available Southeast Florida listings." section heading
  - BridgeSearch FORM rendered (City / Min price / Bedrooms / Search listings button)
  - "Found a residence worth a closer look?" CTA box
  - No DEMO badge or DemoBanner visible (gated behind a successful search-and-results state — the chunk has them on by-default but they only render when `searched && listings.length > 0`)
  - IDX/MLS attribution paragraph not present pre-search

## What this means for "Mia says Bridge should be working"

| Question | Answer |
|---|---|
| home_search_status | HTTP 200 across all 4 city-filter URLs probed |
| mode | **demo (test fixture)** — chunk hard-wired to `test_sf` Bridge dataset with DEMO=true |
| real_live_feed_proven_on_staging | **NO** — the deployed chunk literally cannot serve Mia inventory; it queries a Bridge San-Francisco test dataset |
| demo_banner_visible | will render on result-set state (post-search); confirmed in-chunk that `<DemoBanner />` is unconditionally rendered when listings exist |
| demo_badges_visible | will render on every result card via `demoMode:true` literal in BridgeListingCard call |
| idx_disclosure_visible | NOT visible while in demo mode (correct — `<ListingAttribution />` only renders in non-demo mode) |
| listing_count_visible | will be visible once user clicks Search |
| city_filter_verified | form has correct city options drawn from `MIA_APPROVED_NEIGHBORHOODS` |
| photos_visible | depends on what test_sf Bridge dataset returns — likely SF-area photos with cloudfront.net hosts (allowlisted) |
| prices_visible | yes (test_sf returns standard RESO Property fields) |
| addresses_visible | city/zip only per `sanitizeListing` — full address NOT exposed |
| token_leak_scan | The browser token IS in the public bundle (Option D architecture) — this is by design and protected via Bridge dashboard's Referrer Domain restriction. NOT a secret-vault leak. |

## Mia's "Bridge should be working" claim — interpreted

Mia's message most plausibly refers to **external Bridge dashboard provisioning** completing: her IDX feed approval, dataset access, or Referrer Domain configuration. **It does NOT translate to Mia's real listings already being live on the site.** The currently-deployed chunk is a CYCLE 33B test-fixture bundle that mechanically cannot serve Mia inventory — it points at `test_sf`.

## What it would take to flip to a real Mia feed

External (Mia / Bridge dashboard / Dokploy) actions, in order:

1. Mia confirms her real Bridge dataset ID (the alphanumeric identifier her IDX feed has been provisioned under).
2. Mia confirms a browser token issued for that dataset, with Referrer Domain set to `https://miasanabriarealtor.trueidea.com` (and later `https://miasanabria.com`).
3. Update Dokploy build args for application `XJSRlvH-91ZtUsh0RPGvo`:
   - `NEXT_PUBLIC_BRIDGE_DATASET_ID` → Mia's real dataset id
   - `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` → `idx/Properties` (or unset for default)
   - `NEXT_PUBLIC_BRIDGE_DEMO` → `false` (or unset)
   - `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` → token for Mia's dataset
4. Trigger Dokploy redeploy.
5. Re-run this audit; chunk needles should show `idx/Properties`, no `test_sf`, and no `demoMode:true` literal.
6. Verify on staging with a real search — listings should be FL only, with IDX disclosure visible (no DEMO banner, no DEMO badges).

NONE of these steps belong to this Algorithm run. They are Mia + Torrey + Dokploy + Bridge external operations.

## Implications for Phase 7 path selection

This is **Path C** — config is present in the deployed bundle but it points at a test fixture. The site code is correct for all three modes (live / demo / fallback). The current visible state on staging IS the intended Cycle 33B demo state, which is mechanically guaranteed to remain demo (and visibly labeled as such) until external provisioning + redeploy.

No source-code change should be made on the Bridge integration in this cycle. The integration is correct; its mode is determined by build args.
