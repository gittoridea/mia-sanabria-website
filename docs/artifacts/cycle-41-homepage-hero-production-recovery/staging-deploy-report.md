---
cycle: 41
artifact: staging-deploy-report
generated_at: 2026-05-17
deploy_target: https://miasanabriarealtor.trueidea.com/
---

# Cycle 41 — Staging Deploy Report

## Deploy invocation

```yaml
tmux_session: mia-cycle41-staging-deploy-20260517-102742
log_path: docs/artifacts/cycle-41-homepage-hero-production-recovery/logs/staging-deploy-20260517-102742.log
command: |
  bun scripts/deploy-and-verify.ts \
    --no-lighthouse \
    --wait-for-needle='South Florida Lifestyle' \
    --wait-timeout=900 \
    --wait-interval=15
launched_at: 2026-05-17T14:27:42Z (approx)
source_commit_at_launch: e63a35eb10bb1ebd565ef29767c4bf5f10213648
```

## Pre-deploy gates that ran inside deploy-and-verify

The script wraps the full validation chain before triggering Dokploy:

```yaml
typecheck: PASS
lint: PASS
build: PASS
audit:all: ran (subsumes 21 audits including hero-contrast:stable, rendered, qa-gate)
audit:completeness FAIL-gate: PASS (0 FAIL counts)
```

The deploy script aborts on any FAIL inside `audit:completeness`. It does not abort on WARNs (a deliberate choice — WARNs typically represent pre-cutover external dependencies like USCO DMCA, GHL lead-capture wiring).

## Dokploy trigger result

```yaml
application_id: XJSRlvH-91ZtUsh0RPGvo
needle: "South Florida Lifestyle"
needle_appears_live: <fill after deploy completes>
last_modified_pre_deploy: <fill>
last_modified_post_deploy: <fill>
last_modified_flipped: <fill>
etag_pre_deploy: <fill>
etag_post_deploy: <fill>
etag_flipped: <fill>
deploy_seconds: <fill>
exit_code: <fill>
```

## Cache-bust verification

The deploy-and-verify script runs cache-busted curls against the canonical pages (home, about, fort-lauderdale, contact) with 8-byte random hex `?cb=<hex>` to force origin hits past the Caddy/Dokploy cache, then confirms the `Last-Modified` (or ETag) header advanced.

## Post-deploy alignment

```yaml
origin_main_head_post_deploy: e63a35e (no doc-only commits made after deploy launch)
deployed_commit_built_from: e63a35e
final_deployed_commit_equals_origin_main_head: <fill after deploy completes>
```

If a doc-only commit is made after deploy (e.g., to land this report and the live-after artifacts), Phase 13 will re-deploy or, per the Cycle 40C pattern, leave the doc-only-commit log uncommitted to terminate the alignment-deploy recursion.

## What this deploy does NOT touch

- Production DNS / Cloudflare
- GHL endpoints
- Bridge credential values
- Production Dokploy config (this targets dev/staging only)
- Caddyfile production rewrite
