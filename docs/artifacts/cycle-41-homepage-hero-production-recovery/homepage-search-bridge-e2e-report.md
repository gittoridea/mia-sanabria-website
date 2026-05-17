---
cycle: 41
artifact: homepage-search-bridge-e2e-report
generated_at: 2026-05-17
base_local: http://127.0.0.1:4231
---

# Cycle 41 — Homepage Search → Bridge E2E Report

## Local result (out/ served on 127.0.0.1:4231)

```yaml
local_e2e_pass: true
command: bun run scripts/test-home-search-bridge-e2e.ts --base=http://127.0.0.1:4231
summary: 11/11 PASS, 0 FAIL, mode=fallback
submitted_city: Fort Lauderdale
submitted_min_price: 1000000
submitted_beds: 3
final_url: /home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero
bridge_params_read: true
results_or_status_visible: true
mode: fallback
demo_honesty_correct_if_needed: true
old_idx_absent: true
audit_no_old_idx: PASS (481 files scanned)
audit_home_bridge_search: PASS (8/8 checks)
screenshots: |
  Bridge surface is covered by capture-baseline /home-search/ and
  /home-search/?city=...&minPrice=...&beds=...&source=home-hero
  routes in docs/artifacts/cycle-41-homepage-hero-production-recovery/local-after/screenshots/
```

## Why mode=fallback locally

Bridge env vars (`BRIDGE_*` family) are not present in the dev shell. The static export's runtime detects the missing credentials and renders the demo-fallback fixtures with the honest banner instead of hitting the real Bridge endpoint with no token. This is the same honest-demo posture deployed in Cycle 33B and reaffirmed through Cycles 37/38/39/40. The deployed staging build may or may not have full Bridge env — the live-verification phase will confirm the live mode value without making any unsupported claim.

## What the test exercises

1. Loads `/` and locates the `data-home-hero-search="true"` form.
2. Verifies the form posts `method="get" action="/home-search/"`.
3. Verifies the form contains hidden `source=home-hero` plus selects for `city`, `minPrice`, `beds`.
4. Verifies the city options are sourced from `MIA_APPROVED_NEIGHBORHOODS`.
5. Loads `/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero`.
6. Verifies BridgeSearch consumes the URL params on mount.
7. Verifies the BridgeSearch surface renders either real results or the honest demo-fallback banner with mode indicator.
8. Verifies the old-IDX (`sef.mlsmatrix.com`, `idxform`) markers are absent.

All 11 assertions pass against the local Cycle 41 build.

## Cycle 41 visual changes to HeroSearch

These visual changes do not alter the form's schema, action, or destination:

- `data-hero-search-version`: `cycle40b` → `cycle41`
- floating wrapper float offset: `-mt-20 sm:-mt-24` → `-mt-12 sm:-mt-14 lg:-mt-16`
- floating wrapper max-width: `max-w-7xl` → `max-w-7xl lg:max-w-4xl`
- card padding `lg:p-6` → `lg:p-5`
- grid template `lg:[1.4fr_1fr_0.9fr_auto]` → `lg:[1.5fr_1fr_1fr_auto]` + `lg:gap-3`

The form attributes (`method`, `action`, hidden inputs, named selects) and the destination param contract are unchanged.
