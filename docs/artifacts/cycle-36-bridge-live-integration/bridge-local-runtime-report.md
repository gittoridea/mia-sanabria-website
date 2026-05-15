# Bridge Local Runtime Report

**Generated:** 2026-05-14T20:50Z
**Method:** static-export inspection (no API routes exist; nothing to curl).

## Local build state

The local `bun run build` produced `out/` without any Bridge env vars set. Per the architecture audit, this means `BRIDGE_AVAILABLE = false` is baked into the chunk.

## What `out/home-search/index.html` ships

```
home_search_mode:        no-credentials-fallback
demo_banner_visible:     no (gated by BRIDGE_AVAILABLE before the demo banner can render)
demo_badges_visible:     no
real_listing_cards_visible: no (no Bridge call attempted)
listing_count:           n/a
search_filters_work:     n/a (filters live behind BRIDGE_AVAILABLE branch)
city_filter_works:       n/a
photos_render:           n/a
prices_render:           n/a
addresses_render:        n/a
idx_disclosure_visible:  n/a (disclosure renders only with live cards)
token_leak_visible:      no — token slot is empty string in chunk; the chunk has the *code* `process.env.NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN ?? ""` evaluated to `""`
```

## Static-HTML markers found in `out/home-search/index.html`

- `Bridge listing search is being activated` — from `MlsMatrixFallback reason="no-credentials"` copy
- `sef.mlsmatrix` — the SEF MLS Matrix iframe URL (correct fallback path)

## Static-chunk markers found in `out/_next/static/chunks/app/home-search/page-b7b9d933e755ff42.js`

- `access_token` — query-param literal in `bridge-client.ts` (compiled-in for the live path)
- `DEMO` — the demo-pill string (compiled-in but only rendered when `BRIDGE_DEMO_MODE=true`)
- `Demo data` — the demo banner header (same gate)
- `search-unavailable` — the error code returned when `BRIDGE_AVAILABLE=false`
- `sef.mlsmatrix` — the fallback iframe URL

**No bridge token, dataset id, or any secret-shaped string is present in the chunk** — `process.env.NEXT_PUBLIC_BRIDGE_*` evaluated to empty string at build time, so the substituted values are `""` and the conditional code paths produce safe defaults.

## What this proves

- The local build correctly degrades to the SEF MLS Matrix iframe fallback when Bridge env vars are absent. This is the documented behavior from `bridge-client.ts:52` and `BridgeSearch.tsx:153`.
- The site is honest about its capabilities locally: no fake live listings, no fake demo banner.
- The decision about whether real Bridge live data shows up is entirely a function of what is baked into the staging build (Phase 8) — the local inspection cannot answer it.

## Implications for Phase 7 path selection

Local inspection alone cannot pick Path A/B/C. We need staging-site evidence (Phase 8) to know whether:
- The deployed chunk has credentials (BRIDGE_AVAILABLE=true on staging)
- Demo mode is on or off on staging
- Real or test data is rendering on staging
