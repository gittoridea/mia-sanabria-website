# Cycle 38 — Staging Deploy Report

date: 2026-05-16
target: `https://miasanabriarealtor.trueidea.com/`
mode: tmux + `bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15`

## Gate state pre-deploy

- Working tree clean (only intentionally-ignored pre-existing Cycle-35 logs untracked).
- No secrets in diff/logs.
- typecheck / lint / build / audit:brand / audit:hero-contrast:stable / audit:no-old-idx / audit:neighborhood-images-deep / audit:home-bridge-search / audit:route-inventory / audit:no-fabrications / audit:mobile-readability / audit:qa-gate(critical=0) — all green.
- Bridge mode honesty preserved; no Dokploy build-arg writes; no Bridge token refresh.
- HEAD `8eaf986` == origin/main `8eaf986`.

## Tmux invocation

```
tmux new-session -d -s mia-cycle38-staging-deploy-<TS> \
  "bun scripts/deploy-and-verify.ts --no-lighthouse \
       --wait-for-needle='South Florida Lifestyle' \
       --wait-timeout=900 --wait-interval=15 \
   > docs/artifacts/cycle-38-live-images-bridge-hero/logs/staging-deploy-<TS>.log 2>&1; \
   echo EXIT_CODE:\$? >> ..."
```

Log path: `docs/artifacts/cycle-38-live-images-bridge-hero/logs/latest-staging-deploy-log.txt` → resolves to the timestamped log.

## Deploy phases observed (monitor)

- Pre-flight typecheck — PASS.
- Pre-flight lint — PASS (no ESLint warnings or errors).
- Pre-flight build — PASS (Next 15 static export).
- Pre-flight `audit:all` — every audit passed (audit:stale, audit:schema, audit:links, audit:seo, audit:completeness, audit:images, audit:brand, audit:insights, audit:featured-markets, audit:legal 18/1WARN/0, audit:about, audit:hero-contrast:stable 145/0, audit:rendered 14/1WARN/0, audit:route-inventory, audit:qa-gate critical=0, audit:trust-row, audit:lead-magnets, audit:no-fabrications, audit:no-old-idx 480/0, audit:neighborhood-images-deep 23/23, audit:fort-lauderdale-standard 31/0). One warning total (route-inventory canvas-render warnings on PDFs — pre-existing carry-over).
- `→ triggering deploy` — Dokploy POST issued.
- `✓ deploy done in 164s` — Dokploy build + deploy finished.
- `→ wait-for-needle: polling https://miasanabriarealtor.trueidea.com/ for "South Florida Lifestyle" (timeout 900s, interval 15s)`.
- `✓ needle present after ~0s (etag="dijsfozvzncw52w9-gzip")` — needle hit immediately; ETag flipped.
- `EXIT_CODE:0` written to log.

## Result

```yaml
deploy_exit_code: 0
deployed_commit: 8eaf986c411d08db8c443387b74da72bdcc02293   # full sha; "8eaf986" short
needle_observed: "South Florida Lifestyle" (live HTML returned the homepage content)
etag_changed: true
etag_after_deploy: dijsfozvzncw52w9-gzip
deploy_duration_seconds: 164
preflight_audit_results: all PASS (1 pre-existing WARN, 0 FAIL)
```

Log path: `docs/artifacts/cycle-38-live-images-bridge-hero/logs/staging-deploy-20260516-084940.log` (also recorded in `latest-staging-deploy-log.txt`).
