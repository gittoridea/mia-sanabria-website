# Cycle 38 — Bridge Referrer-Domain Retest

date: 2026-05-16

## Operator update

> "Bridge referrer-domain configuration now includes all 3 domains."

This removes the external blocker that prevented Cycle 37 from proving Bridge live mode against the production browser-token request flow.

## What this changes (and what it does NOT change)

- **Changes:** A Bridge browser-token request originating from
  `miasanabriarealtor.trueidea.com` (and any other domain in the all-3 list)
  is no longer rejected at the Bridge edge on referrer grounds.
- **Does NOT change:**
  - Whether the Dokploy build args point at a Mia / Southeast-Florida live dataset or at the Bridge `test_sf` test dataset.
  - Whether `NEXT_PUBLIC_BRIDGE_DEMO=true` is set in Dokploy (forces UI demo banner regardless of what the data layer returns).
  - Whether `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` resolves to `idx/Properties` (live IDX) or to `Property` (test endpoint).
  - Whether the Bridge IDX feed approval for Mia / LPT Realty / SEF MLS is finalized on the Bridge account.

## Local env presence (names only, no values)

```
BRIDGE_SERVER_TOKEN                 missing  (Dokploy build-arg only)
BRIDGE_CLIENT_SECRET                missing  (Dokploy build-arg only)
BRIDGE_CLIENT_ID                    missing  (Dokploy build-arg only)
BRIDGE_DATASET_ID                   missing  (Dokploy build-arg only)
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN    missing  (Dokploy build-arg only)
BRIDGE_BROWSER_TOKEN                missing  (Dokploy build-arg only)
NEXT_PUBLIC_BRIDGE_DATASET_ID       missing  (Dokploy build-arg only)
NEXT_PUBLIC_BRIDGE_DEMO             missing  (Dokploy build-arg only)
NEXT_PUBLIC_BRIDGE_RESOURCE_PATH    missing  (Dokploy build-arg only)
```

Local env has no Bridge tokens. This is **expected** — the project stores Bridge variables only in Dokploy build args.

## Retest plan

Local probe (`scripts/probe-bridge-live.ts`) cannot exercise Bridge from this workstation because the secrets are not in `~/.claude/.env`. The truthful retest must happen against the deployed staging site:

1. After Cycle 38 commits & deploys to `https://miasanabriarealtor.trueidea.com/`, fetch `/home-search/` HTML.
2. Inspect the rendered Bridge mode marker:
   - `data-bridge-runtime-mode="live"` → real feed if other checks pass.
   - `data-bridge-runtime-mode="demo"` → Bridge test fixture connected.
   - `data-bridge-runtime-mode="fallback"` → `NEXT_PUBLIC_BRIDGE_DEMO=true` forcing the curated demo path.
   - `data-bridge-runtime-mode="error"` → error state.
3. Confirm whether the visible UI matches the marker (demo banner present iff mode ∈ {demo, fallback}).
4. If `mode === "live"`, sanity-check returned records are non-fixture (city names match Mia's actual SEF MLS coverage, prices/baths look plausible, listingKey is not the static fixture key).
5. Confirm IDX/MLS attribution copy is rendered (live or demo path).
6. Capture all of the above in `bridge-staging-final-report.md` post-deploy.

## What is NOT being changed in this retest

- No Bridge token values are read, printed, logged, or rotated.
- `NEXT_PUBLIC_BRIDGE_DEMO=true` is **not flipped** by this cycle. Doing so would require confirming `NEXT_PUBLIC_BRIDGE_DATASET_ID` and `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` are configured for live data — which is a Dokploy-side change the operator must explicitly authorize separately.
- No Dokploy API write occurs unless the operator separately authorizes it.

## Post-deploy classification thresholds

The Cycle 38 closeout will classify Bridge state as one of:

- `live_verified` — `data-bridge-runtime-mode="live"`; non-fixture records; demo banner absent; IDX disclosure present.
- `demo_honest` — mode is `demo` or `fallback`; demo banner visible; IDX disclosure present.
- `error` — mode is `error` and UI presents the error panel honestly.
- `mode_mismatch` — marker and UI disagree (immediate fix required).

Cycle 38 makes **no claim** of live mode until the staging probe proves it.
