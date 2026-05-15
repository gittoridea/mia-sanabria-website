# Bridge Integration — Implementation Report

**Generated:** 2026-05-14T21:00Z
**Path selected:** **Path C** — credentials present in deployed bundle but pointing at the `test_sf` Bridge fixture; real Mia feed requires external provisioning.

## Path-selection rationale

The mission brief defined three paths. Evidence summary:

| Evidence | Source |
|---|---|
| Local shell + `~/.claude/.env` have NO Bridge env vars | `bridge-config-presence-report.md` |
| Local build → BRIDGE_AVAILABLE=false → MlsMatrixFallback iframe | `bridge-local-runtime-report.md` |
| Staging chunk has token + dataset baked in → BRIDGE_AVAILABLE=true | `bridge-staging-before-deploy-report.md` |
| Staging chunk dataset literal is `test_sf` (San Francisco TEST fixture) | chunk needle inspection |
| Staging chunk has `demoMode:true` and unconditional `<DemoBanner />` rendering on results | chunk needle inspection |
| No real Mia listings can flow through `test_sf` (mechanically impossible) | architecture audit + Bridge docs |

Path A (live proven, integrate) — **REJECTED**: real live feed is NOT proven; it's mechanically impossible with the current dataset.
Path B (config present, feed fails) — **REJECTED**: feed isn't failing — it's deliberately pointed at a test fixture per Cycle 33B intent.
Path C (config missing locally, may exist in staging/Dokploy) — **SELECTED**: matches the actual situation.

## What was implemented in this cycle

**Zero source-code changes to the Bridge integration.** The existing implementation is already correct for all three modes:

- BRIDGE_AVAILABLE=false → `MlsMatrixFallback reason="no-credentials"` (SEF MLS Matrix iframe + "search is being activated" copy)
- BRIDGE_AVAILABLE=true + DEMO=true → BridgeSearch with `<DemoBanner />` + `demoMode:true` on every BridgeListingCard
- BRIDGE_AVAILABLE=true + DEMO=false → BridgeSearch with `<ListingAttribution />` IDX disclosure + no DEMO badges

Modifying the Bridge code based on assumption (not evidence) would risk breaking the demo-honesty invariants the audit:brand exception explicitly preserves (per Cycle 35 brand audit demo-warning exception).

## What was added (Bridge-related)

- `scripts/probe-bridge-live.ts` — secret-safe diagnostic probe. Reads the same `NEXT_PUBLIC_BRIDGE_*` env vars the static bundle reads, optionally `BRIDGE_SERVER_TOKEN` if present, classifies live/demo/empty/error, writes sanitized JSON to `docs/artifacts/cycle-36-bridge-live-integration/bridge-live-probe-result.json`. Never prints token values, never persists raw response bodies. Locally: short-circuits with `endpointConfigured=false`. Future use: a credential-bearing operator can run it to verify a new dataset before flipping production cutover.
- `.gitignore` entry preventing commit of downloaded staging chunks (which contain the public-by-design browser token literal).

## What is explicitly NOT implemented

- No `audit:bridge-runtime` audit. Why not: the existing `audit:brand` already enforces the demo-warning data attribute exception is honored; the existing `audit:no-fabrications` enforces no-fake-listings discipline; the chunk needle inspection in this cycle is the right rigor for build-arg verification, not an audit because the input (Dokploy build args) is outside this repo.
- No fallback proxy or server-side runtime. Architecture decision deferred per `bridge-runtime-readiness-dossier.md`.
- No DemoBanner visibility change. The current gating (only renders post-search-with-results) is correct because pre-search the user has no listings on screen to apply the demo label to.
- No code change to suppress demo UI on a "could be live" guess. Demo honesty is paramount until external proof of real feed.

## Honest external-blocker register

To flip from `demo (test_sf)` to `live (Mia feed)`, the operator must — outside this repo — perform the steps in `bridge-staging-before-deploy-report.md` § "What it would take to flip to a real Mia feed". Specifically:

1. Mia provides her real Bridge dataset id and the browser token issued for it.
2. Bridge dashboard Referrer Domain set to `https://miasanabriarealtor.trueidea.com` (and later `https://miasanabria.com`).
3. Update Dokploy build args (application `XJSRlvH-91ZtUsh0RPGvo`):
   - `NEXT_PUBLIC_BRIDGE_DATASET_ID` → Mia's real dataset id
   - `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` → `idx/Properties` (or unset)
   - `NEXT_PUBLIC_BRIDGE_DEMO` → `false` (or unset)
   - `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` → Mia's token
4. Trigger Dokploy redeploy.
5. Re-run `scripts/probe-bridge-live.ts` against the new build (or against staging by chunk inspection) — needle `test_sf` should be gone, `idx/Properties` should appear, `demoMode:true` literal should be gone.
6. Visit staging `/home-search/`, click Search → expect FL listings, IDX disclosure, no DEMO badge.

Until those steps complete, demo honesty stays visible — and that is the correct answer for this cycle.

## Why this answer is "the integration is correct" rather than "we changed code"

The Cycle 33B implementation is provably correct for the demo state currently deployed. Changing the integration code without external proof of a working live feed would risk shipping a code path that flips DEMO badges off while still serving test_sf data — a true site-honesty regression. The right answer is:

- Confirm the integration's three-mode correctness by reading the chunk (done)
- Verify staging UI matches the demo state (done — form renders, no badges yet because no search submitted)
- Document the external blockers crisply so Mia + operator can act
- Preserve the data-brand-exception="demo-warning" pathway intact (done — audit:brand still 12/0/0)
