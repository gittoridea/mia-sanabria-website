# Cycle 37 — Bridge Integration Report

## Architecture

Static-export Next.js 15 + browser-token Bridge OData (Architecture Option D). No server runtime can hold a server token; Bridge is consumed directly from the browser at runtime when `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` + `NEXT_PUBLIC_BRIDGE_DATASET_ID` are present at build.

## Cycle 37 changes

### `src/lib/bridge-client.ts`

- Added `BridgeRuntimeMode = "live" | "demo" | "fallback" | "error" | "unconfigured"`.
- Added `BridgeRuntimeStatus { mode, source, reason, resourcePath, updatedAt }` and `getBridgeRuntimeStatus()` resolver.
- Added bundled `FIXTURE_LISTINGS` (6 cards across approved Mia neighborhoods) and `filterFixtures(query)` so the Bridge search UI works end-to-end even when no Bridge credentials are baked.
- `searchListings()` now returns `mode` on every result; when `!BRIDGE_AVAILABLE` it returns `mode: "fallback"` with the filtered fixture set instead of an `unavailable` error.

### `src/components/bridge/BridgeSearch.tsx`

- Removed `MlsMatrixFallback` (the legacy iframe path).
- Added `getBridgeRuntimeStatus()` snapshot at render; the status drives a small mode badge under the search form (`data-bridge-runtime-mode` attribute set for both UI and audits).
- New `DemoBanner({ mode })` differentiates copy for `demo` vs `fallback` (test-fixture vs IDX-pending).
- New `ErrorPanel` with annotated amber styling and IDX/MLS disclosure copy — no iframe, no third-party host.
- Card grid renders `BridgeListingCard` with `demoMode={resultMode !== "live"}` — DEMO badge appears in `demo`, `fallback`, AND `error` recovery paths; only suppressed when result mode is `live`.
- City filter remains driven by `MIA_APPROVED_NEIGHBORHOODS` (works against fixtures, demo dataset, and live).

## Truthfulness rules enforced

| Mode | DemoBanner | DEMO badge | Live attribution | IDX/MLS disclosure |
|------|:----------:|:----------:|:----------------:|:------------------:|
| `live` | hidden | hidden | shown | shown |
| `demo` | shown ("test fixture") | shown | hidden | shown via FixtureAttribution |
| `fallback` | shown ("IDX pending") | shown | hidden | shown via FixtureAttribution |
| `error` | hidden | n/a (no listings) | hidden | shown inside ErrorPanel |
| `unconfigured` | hidden (pre-search) | n/a | hidden | shown by status badge text |

## Real Bridge live feed proven?

**No.** This shell has none of `BRIDGE_SERVER_TOKEN`, `BRIDGE_CLIENT_SECRET`, `BRIDGE_CLIENT_ID`, `BRIDGE_DATASET_ID`, `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN`, `BRIDGE_BROWSER_TOKEN` set. The Dokploy build args may bake them at deploy time; that is checked in `bridge-staging-final-report.md` post-deploy.

## External blockers (unchanged from Cycle 36D)

- SEF MLS approval of Mia's IDX feed on the Bridge account.
- Operator-confirmed promotion of `NEXT_PUBLIC_BRIDGE_DEMO=false` once SEF MLS approval lands.
- Bridge dashboard `Referrer Domain` allowlist must include the staging + production hosts.
