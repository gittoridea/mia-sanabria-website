# Cycle 39 — Bridge E2E Final Report

date: 2026-05-16

## Fields

```yaml
local_e2e_pass: true                    # 11/11 mode=fallback
staging_e2e_pass: true                  # 11/11 mode=demo
submitted_city: "Fort Lauderdale"
submitted_min_price: 1000000
submitted_beds: 3
final_url: |
  https://miasanabriarealtor.trueidea.com/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero
bridge_params_read: true                # React useEffect parsed city/minPrice/beds
results_or_status_visible: true         # demo banner + fixture cards + idx disclosure
mode: demo                              # data-bridge-runtime-mode="demo"
old_idx_absent: true                    # 0 MlsMatrix|sef.mlsmatrix.com|idxbroker|ihomefinder|flexmls|showcaseidx hits
screenshots: docs/artifacts/cycle-39-visual-truth-recovery/e2e/screenshots/
report_json: docs/artifacts/cycle-39-visual-truth-recovery/e2e/report.json
report_md: docs/artifacts/cycle-39-visual-truth-recovery/e2e/report.md
```

## What Cycle 39 closed that Cycle 38 deferred

Cycle 38's `homepage-hero-staging-final-report.md` explicitly stated:

> BridgeSearch URL-param auto-search behavior. This requires JS execution
> after URL params arrive; the static-HTML curl + dump-dom channels do
> not exercise it. The mechanism is exercised by the React useEffect in
> BridgeSearch.tsx and confirmed locally via the source code path; an
> end-to-end live click-through with Interceptor or a Playwright session
> would be the next hardening step. Queued in remaining-blockers.md.

Cycle 39 closes that gap with `scripts/test-home-search-bridge-e2e.ts`:
google-chrome --headless=new with --virtual-time-budget=18000 navigates
the URL with params + waits for JS to run + dumps the DOM + asserts the
post-JS markers (bridge-runtime-mode, results region, BridgeSearch form
surface, IDX/MLS disclosure, no-old-IDX). 11/11 PASS locally
(mode=fallback as expected without local Bridge token); 11/11 PASS
against staging (mode=demo, the Dokploy build-args' current state).

## Per-check live result

| Check | Result | Detail |
|-------|:------:|--------|
| home.form.action | PASS | homepage form action="/home-search/" |
| home.form.source | PASS | hidden source=home-hero present |
| home.form.city | PASS | name="city" select present |
| home.form.minPrice | PASS | name="minPrice" select present |
| home.form.beds | PASS | name="beds" select present |
| home.form.floating | PASS | data-floating="true" + data-home-hero-search="true" markers present |
| search.bridge-mode-marker | PASS | data-bridge-runtime-mode="demo" rendered |
| search.no-old-idx-runtime | PASS | no legacy IDX runtime in rendered DOM |
| search.results-region-rendered | PASS | demo banner + 6 fixture cards + disclosure rendered after JS auto-search |
| search.bridge-surface-present | PASS | aria-label="Search available listings" form rendered |
| search.idx-disclosure-rendered | PASS | "Equal Housing Opportunity" + IDX/MLS disclosure copy rendered |

## Why "demo" is the honest mode

The current Dokploy build args (unchanged this cycle):

- `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` present.
- `NEXT_PUBLIC_BRIDGE_DATASET_ID` points at Bridge's `test_sf` test
  dataset (NOT a live SEF dataset).
- `NEXT_PUBLIC_BRIDGE_DEMO=true` (forces demo mode in the runtime
  classifier).
- `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` = `idx/Properties`.

The UI renders the corresponding "Demo data — Bridge test fixture
connected." banner and the IDX/MLS disclosure copy. Each fixture card
carries a DEMO badge. The mode marker `data-bridge-runtime-mode="demo"`
is rendered on the meta div.

## Live activation path (operator-led, NOT this cycle)

```
1. Operator confirms in Dokploy:
   - NEXT_PUBLIC_BRIDGE_DATASET_ID flipped from test_sf to live SEF dataset
   - NEXT_PUBLIC_BRIDGE_DEMO=false (or removed)
   - NEXT_PUBLIC_BRIDGE_RESOURCE_PATH set to live IDX resource path
2. Operator confirms Bridge IDX feed approval finalized for Mia /
   LPT Realty / SEF MLS.
3. Operator triggers Dokploy redeploy.
4. AI runs test-home-search-bridge-e2e.ts against staging and verifies
   data-bridge-runtime-mode === "live".
5. AI runs sanitized sample-record probe to confirm SEF-area cities +
   allowed media-host MediaURLs (no fixture FIXTURE-* keys).
6. AI commits a single decision-record entry confirming live mode.
```

## What Cycle 39 contributes (net)

The Bridge wiring + truthfulness behavior was already correct in Cycle
38; what Cycle 39 adds is the **JS-path proof** Cycle 38 explicitly
deferred. The test exists, passes 11/11 locally, passes 11/11 against
staging, and will continue to serve as the staging-classification probe
across future cycles.
