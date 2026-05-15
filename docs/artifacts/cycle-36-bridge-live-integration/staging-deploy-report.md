# Staging Deploy Report — Cycle 36D

**Generated:** 2026-05-15
**Deploy log:** `docs/artifacts/cycle-36-bridge-live-integration/logs/staging-deploy-20260515-165745.log`
**tmux session:** `mia-cycle36d-staging-deploy-20260515-165745` (ended cleanly after EXIT_CODE:0)

## Results

```yaml
deploy_session: mia-cycle36d-staging-deploy-20260515-165745
deploy_log: docs/artifacts/cycle-36-bridge-live-integration/logs/staging-deploy-20260515-165745.log
exit_code: 0
commit_deployed: 3a99bc33f037b00b3ed04ac97744c48e2a01512e
origin_main_before_deploy: 1386d208fa93b66d3e66f5131b001ff432b35911  # before Phase 9 push
origin_main_after_deploy: 3a99bc33f037b00b3ed04ac97744c48e2a01512e
dokploy_post_issued: true
deploy_duration_seconds: 173
status_polls_observed: 21 (8s..173s)
status_terminal: done
needle: "South Florida Lifestyle"
needle_present_post_deploy: true
needle_first_seen_seconds_after_deploy_done: ~0   # already in cache after Dokploy flipped
result: success
failure_if_any: none
```

## Pre-flight gate summary (deploy log)

```yaml
pre_flight_typecheck: pass
pre_flight_lint: pass
pre_flight_build: 61 static pages, Exporting (3/3) ✓
pre_flight_audit_all:
  audit_stale: clean
  audit_schema: 287 JSON-LD blocks valid
  audit_links: 2847 internal links resolve
  audit_seo: 0 warnings 0 errors
  audit_completeness: 16 PASS · 1 WARN · 0 FAIL · 0 SKIP
  audit_images: 14 PASS · 0 WARN · 0 FAIL · 0 SKIP
  audit_brand: 12 PASS · 0 WARN · 0 FAIL · 0 SKIP
  audit_insights: 547 PASS · 0 WARN · 0 FAIL
  audit_featured_markets: 17 PASS · 0 WARN · 0 FAIL · 0 SKIP
  audit_legal: 18 PASS · 1 WARN · 0 FAIL · 0 SKIP
  audit_about: 12 PASS · 0 WARN · 0 FAIL · 0 SKIP
  audit_hero_contrast_stable: 145 PASS · 0 WARN · 0 FAIL · 0 SKIP
  audit_rendered: 14 PASS · 1 WARN · 0 FAIL · 0 SKIP
  audit_route_inventory: pass
  audit_qa_gate: critical=0
  audit_trust_row: pass
  audit_lead_magnets: pass
  audit_no_fabrications: pass
  audit_fort_lauderdale_standard: 31 PASS · 0 WARN · 0 FAIL
pre_flight_completeness_gate: pass=16 warn=1 fail=0 skip=0
pre_flight_verdict: passed — proceeding to deploy
```

## HTTP signal (cache flip evidence)

```yaml
pre_deploy_last_modified: "Thu, 14 May 2026 16:46:59 GMT"
post_deploy_last_modified: "Fri, 15 May 2026 21:17:43 GMT"   # NEW build timestamp
pre_deploy_etag_home: "diijwdedso3k1hiy"
post_deploy_etag_home: "dijka7eh7g1s1hiy"
etag_changed: true
deploy_actually_landed: true
caddy_cache_warning_in_log: |
  "last-modified did not change" — log warning is misleading because Dokploy
  rebuilt and `last-modified` DID advance to 2026-05-15 21:17:43Z when fetched
  after the wait-for-needle pass. The pre-needle probe may have hit a Caddy
  cache hit before propagation.
needle_verification: "South Florida Lifestyle" present in / after wait-for-needle poll
```

## Constraints respected

```yaml
deployed_in_tmux: true
deploy_command_wrapped_with_env_subshell: true   # set +x; set -a; source ~/.claude/.env; set +a
secret_values_echoed: false
production_DNS_touched: false
production_GHL_touched: false
production_Google_touched: false
Bridge_credentials_rotated: false
Bridge_dataset_id_changed: false
```
