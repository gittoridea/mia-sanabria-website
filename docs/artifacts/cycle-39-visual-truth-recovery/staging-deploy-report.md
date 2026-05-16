# Cycle 39 — Staging Deploy Report

date: 2026-05-16
staging_base: https://miasanabriarealtor.trueidea.com

## Fields

```yaml
deploy_session: mia-cycle39-staging-deploy-20260516-103617
deploy_log: docs/artifacts/cycle-39-visual-truth-recovery/logs/staging-deploy-20260516-103617.log
deploy_exit_code: 0
pre_deploy_audit_phase: PASS-on-critical (27 gates green, 0 critical, 4 pre-existing high)
pre_deploy_typecheck: pass
pre_deploy_lint: pass
pre_deploy_build: pass
pre_deploy_audit_completeness_gate: pass (16/1/0)
dokploy_trigger_time: 2026-05-16T13:20:30Z (pre-deploy last-modified)
dokploy_polling_seconds_to_done: 106
dokploy_status_at_done: done
deployed_commit: 889b2c2b117c9bc5fd5bcfc8b97f82e21bae0978
origin_main_at_deploy: 889b2c2b117c9bc5fd5bcfc8b97f82e21bae0978
deployed_equals_origin_main: true
needle_polling_wait_for: "South Florida Lifestyle"
needle_observed_after_seconds: 0
needle_etag: dik4rd71i96o5372-gzip
post_deploy_alert: |
  deploy-and-verify.ts noted "last-modified did not change — Caddy may be
  caching even with bust headers". The needle check + ETag observation
  + downstream live verification (HTTP 200 + versioned-path presence +
  byte match) confirm the deploy landed; the last-modified header is a
  Caddy heuristic that does not flip on every redeploy.
```

## What ran

```
$ bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15
```

Pre-flight audit suite (in deploy-and-verify.ts): typecheck, lint, build,
audit:stale, audit:schema, audit:links, audit:seo, audit:completeness,
audit:images, audit:brand, audit:insights, audit:featured-markets,
audit:legal, audit:about, audit:hero-contrast:stable, audit:rendered,
audit:route-inventory, audit:qa-gate, audit:trust-row, audit:lead-magnets,
audit:no-fabrications, audit:no-old-idx, audit:neighborhood-images-deep,
audit:fort-lauderdale-standard. All green or pre-existing-warn.

Dokploy trigger via authenticated `application.deploy` POST; poll loop on
`application.one` until `status=done`. Then headless needle check via
google-chrome with cache-busting query string.

## Deployment substrate (unchanged from Cycle 38)

- Dokploy application ID: `XJSRlvH-91ZtUsh0RPGvo`
- Substrate: Helos VPS via Dokploy + Caddy
- Cache layer: Caddy edge (cache-busting via `?cb=<hex>` query + `Cache-Control: no-cache`)
- No production DNS change; no GHL endpoint change; no Bridge credential
  rotation.

## Verification immediately following deploy

(Full details in `staging-live-verification-report.md`.)

- All 10 key routes HTTP 200.
- All 7 versioned card/OG paths render in live HTML; zero unversioned
  references for the seven slugs.
- Homepage hero versioned path renders; unversioned path absent.
- Bridge mode: `demo` (correct, honest).
- Old IDX runtime absent (480 files scanned + 7 versioned-slug detail
  pages scanned).
- All 14 image assets HTTP 200 + byte-match repo live.
- E2E home → Bridge: 11/11 PASS with mode=demo.
