# Cycle 37 — Staging Live Verification Report

Base: `https://miasanabriarealtor.trueidea.com`
Verification time: 2026-05-16T02:42Z (approx, post-deploy)

## All public + new neighborhood routes — HTTP 200

| Path | Status | Cache-bust strategy |
|------|:-:|---|
| `/` | 200 | `?cb=<8-byte-hex>` + `Cache-Control: no-cache` + `Pragma: no-cache` |
| `/home-search/` | 200 | same |
| `/home-search/?city=Fort%20Lauderdale` | 200 | same (cb appended after &) |
| `/markets/` | 200 | same |
| `/buyers/` | 200 | same |
| `/sellers/` | 200 | same |
| `/about/` | 200 | same |
| `/contact/` | 200 | same |
| `/insights/` | 200 | same |
| `/privacy/` | 200 | same |
| `/terms/` | 200 | same |
| `/accessibility/` | 200 | same |
| `/dmca/` | 200 | same |
| `/markets/coral-springs/` | 200 | same |
| `/markets/davie/` | 200 | same |
| `/markets/deerfield-beach/` | 200 | same |
| `/markets/hollywood/` | 200 | same |
| `/markets/plantation/` | 200 | same |
| `/markets/sunrise/` | 200 | same |
| `/markets/weston/` | 200 | same |
| `/markets/fort-lauderdale/` | 200 | same |
| `/markets/pompano-beach/` | 200 | same |

Saved HTML to `docs/artifacts/cycle-37-neighborhood-images-bridge-idx/staging-html/final/` (one file per route).

## Old IDX absence on live HTML

- Homepage (`/`) `MlsMatrix` / `sef.mlsmatrix.com` / `Matrix/Public/IDXSearch` matches: **0**
- Cross-route grep for `MLS Matrix` / `MlsMatrix`: **0** (only `IDX/MLS disclosure` text matches the substring `MLS`, which is intentional compliance copy)

## Bridge runtime state on live `/home-search/`

- `data-bridge-runtime-mode="demo"` attribute present on the search container — confirms Bridge browser-token + dataset-id baked at build, demo flag held true (test fixture dataset).
- `Search available listings` form aria-label present.
- `Bridge Data Output` reference present in disclosure copy.
- No iframe; no `sef.mlsmatrix.com` URL.

## "No photo available" sweep

`grep -c "No photo available"` across all 22 saved staging HTMLs: **0 matches.** No broken-image sentinel appears live.

## New-neighborhood image HEAD check (with cb hex)

| Slug | `/markets/<slug>.jpg` | Bytes | `/og-markets/<slug>.jpg` |
|------|:-:|------:|:-:|
| coral-springs | 200 | 334,930 | 200 |
| davie | 200 | 146,742 | 200 |
| deerfield-beach | 200 | 178,459 | 200 |
| hollywood | 200 | 136,189 | 200 |
| plantation | 200 | 260,806 | 200 |
| sunrise | 200 | 104,091 | 200 |
| weston | 200 | 177,481 | 200 |

Byte counts match the locally generated assets exactly — the deployed bundle is the post-Cycle-37 build (no stale cache serving old placeholders).

## Live-staging audit re-runs

- `audit:neighborhood-images-deep --base=https://miasanabriarealtor.trueidea.com` — **PASS 23/23** (file thresholds + live HEAD 200)
- `audit:no-old-idx` — PASS (run on the same source the staging build came from; covers `out/` + `.next/` + `src/` + `public/`)

## Visual QA captured

20 PNGs against staging at 375×812 + 1280×800 for `/`, `/home-search/`, `/markets/`, and the 7 new neighborhoods. All 20 captures succeeded. See `docs/artifacts/cycle-37-neighborhood-images-bridge-idx/visual-qa/staging/_capture-summary.json` (PNGs gitignored).

## Live-HTML secret scan

`grep -RnE "BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|BRIDGE_CLIENT_ID|BRIDGE_DATASET_ID|access_token=[A-Za-z0-9]{20,}|refresh_token=[A-Za-z0-9]{20,}|Bearer [A-Za-z0-9._-]{32,}|DOKPLOY_API_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY"` against the saved staging HTMLs — **0 matches.** No secret values leak in live HTML.

## Conclusion

`https://miasanabriarealtor.trueidea.com/` is live with the Cycle 37 implementation: real generated neighborhood images, Bridge-only `/home-search/` rendering in honest `demo` mode, no MLS Matrix iframe, no "No photo available" states, no secret leaks, all 22 verified routes return HTTP 200.
