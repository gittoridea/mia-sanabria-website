# Cycle 38 — Bridge Live Integration Report

date: 2026-05-16

## Summary

Operator-confirmed referrer-domain update completed. Cycle 38 **does not activate live mode** because:

- Local environment cannot probe Bridge (tokens live only in Dokploy build args).
- No Dokploy build-arg writes are authorized in this cycle.
- The remaining Bridge requirements (dataset selection, resource path, demo flag) are unverified.

The truthfulness contract (`bridge-truthfulness-report.md`) keeps demo-banner and IDX disclosure rendering as before. The actual deployed-staging mode will be classified in `bridge-staging-final-report.md` after deploy.

## What changed this cycle

- Homepage hero search now posts to `/home-search/` (the Bridge surface) instead of the legacy `/markets/#property-search` anchor.
- BridgeSearch reads URL params (`city`, `minPrice`, `beds`) on mount and auto-runs a search — so the homepage-to-Bridge deep link is now functional regardless of mode.
- All existing Bridge runtime code paths (live, demo, fallback, error) are preserved.

## Bridge runtime classifications recognized by this build

(unchanged from Cycle 37, restated for the record)

| Mode | Source resolution | Banner | Attribution | Listing badges |
|------|--------------------|--------|-------------|----------------|
| `live` | `BridgeClient.searchListings` returns Bridge feed records | none | `ListingAttribution` | live |
| `demo` | Bridge test fixture connected | demo banner | `FixtureAttribution` | DEMO |
| `fallback` | `NEXT_PUBLIC_BRIDGE_DEMO=true` or runtime not configured | demo banner | `FixtureAttribution` | DEMO |
| `error` | Network/auth failure from Bridge | error panel | error attribution | none rendered |

## What live-activation requires (future cycle)

1. Operator confirms Bridge dataset configured for SEF MLS / Mia / LPT Realty (not `test_sf`).
2. Operator confirms `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` is set to the live IDX resource path (e.g., `idx/Properties`).
3. Operator removes `NEXT_PUBLIC_BRIDGE_DEMO=true` from Dokploy build args.
4. Operator triggers a Dokploy redeploy.
5. Cycle staging probe captures live records, sanity-checks geography/prices, confirms banner absent and `ListingAttribution` rendering.
6. Cycle reports `live_verified` and commits.

Cycle 38 is **not** that cycle.

## What was deliberately not changed

- No Bridge token values.
- No `NEXT_PUBLIC_BRIDGE_DEMO` flag.
- No Dokploy build-arg.
- No demo-banner rendering logic.
- No IDX/MLS disclosure copy.
