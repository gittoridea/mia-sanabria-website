# Cycle 40C — Homepage Search → Bridge E2E Report

> Local E2E result from `scripts/test-home-search-bridge-e2e.ts` against the
> static export served from `out/`. Staging-live result will be appended
> after Phase 8 deploy + Phase 9 verification.

## Local result (out/ served on 127.0.0.1:4220)

```yaml
local_e2e_pass: true
command: bun run scripts/test-home-search-bridge-e2e.ts --base=http://127.0.0.1:4220
summary: 11/11 PASS, 0 FAIL, mode=fallback
submitted_city: Fort Lauderdale         # per test default
submitted_min_price: 1000000
submitted_beds: 3
final_url: /home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero
bridge_params_read: true                 # BridgeSearch reads city/minPrice/beds/source on mount and auto-runs
results_or_status_visible: true          # status banner + (in live mode) results / (in fallback) demo fixtures
mode: fallback
old_idx_absent: true
screenshots: n/a (E2E test does not capture screenshots; capture-baseline + playwright already cover the visual side)
```

## Why mode=fallback locally

Bridge env vars (`BRIDGE_*` family) are intentionally not present on the dev host. The page detects the missing credentials at runtime and renders the demo-fallback fixtures with an honest banner, instead of hitting the real Bridge endpoint with no token. This is the same honest-demo posture deployed in Cycle 33B and reaffirmed in every subsequent cycle.

## What this test exercises

1. Loads `/` and finds the `data-home-hero-search="true"` form.
2. Confirms the form `action="/home-search/"` and the hidden `source="home-hero"` input.
3. Sets values for `city`, `minPrice`, `beds`.
4. Submits the form as a plain HTML GET (works with JS disabled — the static export does not require client JS to navigate).
5. Lands on `/home-search/?city=…&minPrice=…&beds=…&source=home-hero`.
6. Confirms `BridgeSearch` reads URL params on mount.
7. Confirms BridgeSearch auto-runs the search using those params.
8. Confirms the rendered mode (live | demo | fallback) is a known, truthful value.
9. Confirms the old MLS Matrix IDX iframe is **absent** from runtime (Cycle 37 removal still holds).

## Staging result placeholder

```yaml
staging_e2e_pass: pending Phase 9
staging_base: https://miasanabriarealtor.trueidea.com
staging_command: bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com
staging_mode_expected: live | demo | fallback   # depends on whether BRIDGE_* env vars are populated on the dev host
```

Will be updated after Phase 8 deploy + Phase 9 verification.
