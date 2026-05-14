# Cycle 33 — Implementation Report

**Date:** 2026-05-14
**Status:** Code implemented — NOT deployed. Not production-ready until pre-production gates pass.

## Files Changed

### New files
- `src/lib/bridge-schema.ts` — OData response types (BridgeProperty, BridgeMedia, ODataCollection, BRIDGE_SELECT_FIELDS)
- `src/lib/bridge-client.ts` — Browser-side API client; reads NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN + NEXT_PUBLIC_BRIDGE_DATASET_ID; exports BRIDGE_AVAILABLE, searchListings(), BridgeSearchQuery, ListingCard
- `src/components/bridge/BridgeSearch.tsx` — 'use client' search UI with form, loading skeleton, listing grid, MLS Matrix fallback, attribution text
- `src/components/bridge/BridgeListingCard.tsx` — Individual listing card; sanitized fields only
- `src/app/home-search/page.tsx` — Home Search route (robots: noindex, follow until BRIDGE_INTEGRATION_LIVE)

### Modified files
- `src/lib/bridge.ts` — Added BRIDGE_API_BASE, BRIDGE_IDX_RESOURCE constants; added datasetId env var name; updated env contract comment
- `src/lib/site.ts` — SEARCH_ICON_HREF updated from `/markets/#property-search` → `/home-search/`
- `src/app/sitemap.ts` — Added `/home-search/` with priority 0.75

### Artifact files (docs)
- `docs/artifacts/cycle-33-bridge-runtime/bridge-docs-notes.md`
- `docs/artifacts/cycle-33-bridge-runtime/runtime-decision-matrix.md`
- `docs/artifacts/cycle-33-bridge-runtime/browser-token-risk-acceptance.md`
- `docs/artifacts/cycle-33-bridge-runtime/api-smoke-test-report.md`
- `docs/artifacts/cycle-33-bridge-runtime/secret-safety-report.md`
- `docs/artifacts/cycle-33-bridge-runtime/claim-vs-reality.md`
- `docs/artifacts/cycle-33-bridge-runtime/implementation-report.md` (this file)
- `docs/artifacts/cycle-33-bridge-runtime/rollback-plan.md`

## Architecture Summary

```
Browser (with NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN baked into bundle)
  ↓ user submits search form
BridgeSearch.tsx ('use client')
  ↓ calls searchListings(query) in bridge-client.ts
bridge-client.ts
  ↓ builds OData $filter query, fetches:
https://api.bridgedataoutput.com/api/v2/OData/{DATASET_ID}/idx/Properties
  ?access_token={BROWSER_TOKEN}&$top=12&$filter=...&$select=...
  ↓ sanitizes response via sanitizeListing()
BridgeSearch.tsx
  ↓ renders BridgeListingCard for each result
  ↓ shows MlsMatrixFallback if BRIDGE_AVAILABLE=false or error
```

## Graceful Fallback Chain

1. If `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` or `NEXT_PUBLIC_BRIDGE_DATASET_ID` is absent at build time → `BRIDGE_AVAILABLE = false` → MLS Matrix iframe shown (same as existing `IdxEmbed`)
2. If Bridge API returns non-200 → MLS Matrix iframe shown with "temporarily unavailable" message
3. If Bridge returns 0 results → empty state with contact CTA
4. If `BRIDGE_INTEGRATION_LIVE = false` (current state) — the feature flag has no runtime effect; the graceful fallback path covers this via missing env vars

## What Remains Before Production

1. **Torrey:** Set Referrer Domain in Bridge dashboard (miasanabria.com)
2. **Torrey:** Place `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` in Dokploy build args
3. **Torrey:** Place `NEXT_PUBLIC_BRIDGE_DATASET_ID` in Dokploy build args
4. **Claude:** Run live smoke test after credentials are placed (verify real listings load, attribution text correct)
5. **Counsel:** Review IDX display compliance (attribution text, display rules) — existing external blocker
6. **Claude:** Flip `BRIDGE_INTEGRATION_LIVE = true` in bridge.ts
7. **Claude:** Change robots from `noindex` to `index` on home-search page
8. **Deploy:** Torrey authorizes Dokploy redeploy

## Validation Results

| Gate | Result |
|---|---|
| `bun run typecheck` | ✓ 0 errors |
| `bun run lint` | ✓ 0 warnings |
| `bun run build` | ✓ 61 pages, /home-search 5.54 kB |
| `audit:stale` | ✓ clean |
| `audit:no-fabrications` | ✓ 0 hits |
| `audit:legal` | ✓ 18 PASS · 1 WARN (pre-existing USCO) · 0 FAIL |
| `audit:qa-gate` | ✓ critical 0 · high 4 (all pre-existing c5 legal) · medium 1 |
| `audit:route-inventory` | ✓ 48 routes reconcile |
| `audit:about` | ✓ 12 PASS · 0 FAIL |
| `audit:schema` | ✓ 57 pages · 287 JSON-LD blocks valid |
| Secret repo scan | ✓ CLEAN (no credential values) |
| Secret out/ scan | ✓ CLEAN |
