# Cycle 39 — Homepage Search → Bridge E2E Report

date: 2026-05-16

## What this proves (and what Cycle 38 left unproven)

Cycle 38 verified the homepage form HTML structure (action, hidden inputs,
filter selects) and BridgeSearch's static surface, but explicitly deferred
the JS-execution-path proof to a future cycle: "BridgeSearch URL-param
auto-search behavior. This requires JS execution after URL params arrive;
the static-HTML curl + dump-dom channels do not exercise it." Cycle 39
closes that gap.

`scripts/test-home-search-bridge-e2e.ts` runs `google-chrome --headless=new
--virtual-time-budget=18000 --dump-dom` against
`/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero`
so the React useEffect that parses URL params and triggers
`searchListings` actually runs, then asserts the rendered DOM contains
the markers that only appear after JS execution.

## Local E2E result

```yaml
base: http://127.0.0.1:4190
target_url: http://127.0.0.1:4190/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero
bridge_mode: fallback             # NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN unset locally → fallback fixture path
passed: 11
failed: 0
total: 11
```

Per-check pass:

| Check | Result | Detail |
|-------|:------:|--------|
| home.form.action | PASS | homepage form action="/home-search/" |
| home.form.source | PASS | hidden source=home-hero present |
| home.form.city | PASS | name="city" input present |
| home.form.minPrice | PASS | name="minPrice" input present |
| home.form.beds | PASS | name="beds" input present |
| home.form.floating | PASS | data-floating="true" + data-home-hero-search="true" markers present |
| search.bridge-mode-marker | PASS | data-bridge-runtime-mode="fallback" rendered |
| search.no-old-idx-runtime | PASS | no MlsMatrix / sef.mlsmatrix.com / idxbroker / ihomefinder / flexmls / showcaseidx in rendered DOM |
| search.results-region-rendered | PASS | demo banner + fixture cards rendered after JS auto-search |
| search.bridge-surface-present | PASS | aria-label="Search available listings" form present |
| search.idx-disclosure-rendered | PASS | "Equal Housing Opportunity" + IDX/MLS disclosure copy rendered |

## Why "fallback" mode passes the truthfulness gate

`fallback` is the correct mode when the browser-side Bridge token is
missing — the runtime path explicitly distinguishes:

- **fallback** = no credentials at build, demo fixtures with honest banner
  ("Demo data — Southeast Florida MLS feed pending.")
- **demo** = credentials present + `NEXT_PUBLIC_BRIDGE_DEMO=true` + test
  fixture dataset
- **live** = credentials present + dataset is live SEF + non-demo flag

Local builds have no `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` (correctly — never
write a token to the repo) so `fallback` is the honest local mode. On
staging the build pulls the token from Dokploy build args and produces
`demo` (test fixture dataset) — Cycle 38 verified that surface and Cycle
39 will re-verify it after deploy.

## Screenshot of result

`docs/artifacts/cycle-39-visual-truth-recovery/e2e/screenshots/home-search-with-params-1280x900.png`
captured after the auto-search ran; shows fixture listing cards with DEMO
badge, demo banner at top, IDX/MLS disclosure at the bottom.

## Staging E2E

Will run post-deploy (Phase 12) against
`https://miasanabriarealtor.trueidea.com/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero`.
Expected mode on staging: `demo` (per Cycle 38 verification — Bridge
build args are wired to the test_sf dataset, NEXT_PUBLIC_BRIDGE_DEMO=true).
Real `live` mode activation remains operator-blocked on Dokploy build-arg
changes (`bridge-truthfulness-report.md`).

## What this test does NOT exercise

- A real `click` on the homepage submit button — google-chrome --headless
  cannot script user interactions without an MCP/CDP automation harness
  that the project does not depend on. Instead the test exercises the
  POST-NAVIGATION end of the path (URL with params → BridgeSearch reads
  → auto-search), which is the path Cycle 38's wiring claims to support.
- The form-submit POSTs nothing — the homepage form is a plain HTML GET
  that navigates the URL. Static HTML verification covers the GET-path
  invariants; this test covers the JS consumption end.
