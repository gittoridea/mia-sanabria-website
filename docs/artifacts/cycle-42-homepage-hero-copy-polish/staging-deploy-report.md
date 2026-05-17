---
cycle: 42
artifact: staging-deploy-report
generated_at: 2026-05-17
---

# Cycle 42 — Staging Deploy Report

## Deploy

```yaml
target: https://miasanabriarealtor.trueidea.com/
mode: dev staging (Dokploy applicationId XJSRlvH-91ZtUsh0RPGvo)
tmux_session: mia-cycle42-staging-deploy-20260517-123230
log_path: docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/staging-deploy-20260517-123230.log
exit_code: 0
duration_to_dokploy_done: 114s
deploy_command: |
  bun scripts/deploy-and-verify.ts --no-lighthouse \
    --wait-for-needle='South Florida Lifestyle' \
    --wait-timeout=900 --wait-interval=15
```

## Pre-flight (inside deploy-and-verify)

| Step | Result |
|---|---|
| typecheck | pass |
| lint | "No ESLint warnings or errors" |
| build | "Compiled successfully" (56 static pages) |
| audit:no-fabrications | 0 hits |
| audit:no-old-idx | 481 files scanned, PASS |
| audit:rendered | 16 PASS · 1 WARN · 0 FAIL · 0 SKIP |
| audit:hero-contrast:stable | 145 PASS · 0 FAIL |
| audit:brand | 12 PASS · 0 FAIL |
| audit:legal | 18 PASS · 1 WARN (USCO/in-process — staging-acceptable, production gate) · 0 FAIL |
| audit:about | 12 PASS · 0 FAIL |
| audit:fort-lauderdale-standard | 31 PASS · 0 WARN · 0 FAIL |
| audit:completeness gate | pass=16 warn=1 fail=0 skip=0 → PROCEED |

## Dokploy lifecycle

```yaml
pre_deploy_last_modified: Sun, 17 May 2026 14:48:06 GMT   # Cycle 41 build
dokploy_status_progression: running → running → done in 114s
post_deploy_status: done
post_deploy_last_modified_initial_check: Sun, 17 May 2026 14:48:06 GMT  # stale
post_deploy_last_modified_after_revalidate: Sun, 17 May 2026 16:53:14 GMT  # fresh, today
```

The deploy-and-verify script flagged "last-modified did not change" in its initial post-deploy probe (an edge-cache revalidation lag in Caddy). The independent Phase 9 fetch with a fresh cache-busting `?cb=<hex>` token returned the new etag `"dil3wsiarny853qi"` and the new `last-modified: Sun, 17 May 2026 16:53:14 GMT`, confirming the new build is live.

## Needle wait

```
→ wait-for-needle: polling https://miasanabriarealtor.trueidea.com/ for "South Florida Lifestyle" (timeout 900s, interval 15s)
✓ needle present after ~0s (etag="dil18zdpf3eo53sd-gzip")
```

The needle "South Florida Lifestyle" was present immediately (same H1 was on the Cycle 41 build; the needle is a continuity anchor, not a Cycle 42 marker). The etag observed during the wait was the still-edge-cached Cycle 41 etag — by the time Phase 9's independent hex-cache-busted fetch ran, the etag had advanced to the Cycle 42 build.

## Bridge mode at staging

```yaml
bridge_runtime_mode_live: demo
```

The dev Dokploy service has a Bridge dataset configured with `NEXT_PUBLIC_BRIDGE_DEMO=true` (or equivalent), so the staging build renders Bridge UI with a demo banner. This matches the brief's "demo honesty preserved when needed" requirement. The live E2E confirms 11/11 PASS at mode=demo.

## Exit verdict

```yaml
staging_deployed: true
staging_exit_code: 0
final_deployed_commit: 82c70452ceed37c07e0e6f7d48735d6a41c4c833
final_deployed_commit_equals_origin_main: true
```
