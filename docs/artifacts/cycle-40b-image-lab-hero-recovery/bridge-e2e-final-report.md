# Cycle 40C — Bridge E2E Final Report

> Final state of homepage-search → Bridge wiring after Cycle 40C deploy.
> Local + staging E2E both green. Staging mode = `demo` (honest demo
> posture per Cycle 33B doctrine).

## Local result (pre-deploy)

```yaml
base: http://127.0.0.1:4220 (static export served via python http.server)
command: bun run scripts/test-home-search-bridge-e2e.ts --base=http://127.0.0.1:4220
result: 11/11 PASS, 0 FAIL
mode: fallback   # expected — no BRIDGE_* env vars on dev host
old_idx_absent: true
```

## Staging result (post-deploy)

```yaml
base: https://miasanabriarealtor.trueidea.com
command: bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com
result: 11/11 PASS, 0 FAIL
mode: demo       # Cycle 33B honest demo posture — Bridge env present, but cycle33B doctrine renders demo fixtures with banner
demo_honesty_correct: true
old_idx_absent: true
```

## What the test exercises (both local and staging)

1. Loads `/` and finds `<form action="/home-search/" data-home-hero-search="true">`.
2. Confirms hidden `source="home-hero"` input.
3. Sets values for `city`, `minPrice`, `beds`.
4. Submits the form as plain HTML GET (works with JS disabled).
5. Lands on `/home-search/?city=…&minPrice=…&beds=…&source=home-hero`.
6. Confirms `BridgeSearch` reads URL params on mount.
7. Confirms BridgeSearch auto-runs the search using those params.
8. Confirms the rendered mode is a known truthful value (`live | demo | fallback`).
9. Confirms the old MLS Matrix IDX iframe is absent from runtime.

## Mode classification

```yaml
modes:
  live:     "Bridge endpoint returned real listing data within the timeout"
  demo:     "Bridge endpoint reachable + responsive, demo fixtures rendered with honest banner per Cycle 33B"
  fallback: "Bridge endpoint unreachable or BRIDGE_* tokens missing — demo fixtures rendered with explicit fallback banner"
staging_mode: demo
verdict: "Honest. The site does not lie about live vs demo status."
```

## Production posture

```yaml
production_credentials_touched: false
bridge_tokens_rotated: false
bridge_env_var_changes: none
remaining_external: "Bridge live-mode token provisioning on dev host (if/when Mia + Torrey want live-mode for the staging surface)"
```
