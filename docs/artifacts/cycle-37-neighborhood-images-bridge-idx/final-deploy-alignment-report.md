# Cycle 37 — Final Deploy Alignment Report

## Three deploys this cycle

| # | Commit | Reason | tmux session | Build (s) | EXIT_CODE | etag (final) |
|---|--------|--------|--------------|----------:|:---------:|--------------|
| 1 | `ed24e69` | Initial Cycle 37 source push (images + IDX removal + Bridge state machine) | mia-cycle37-staging-deploy-20260515-223232 | 167 | 0 | dijka7eh7g1s57rf-gzip |
| 2 | `52a33db` | Closeout artifacts + ISA + decision-record (alignment after first push) | mia-cycle37-final-align-deploy-20260515-230027 | 132 | 0 | dijreaii9la852w9-gzip |
| 3 | `240c2c7` | Caddyfile CSP frame-src cleanup (residual sef.mlsmatrix.com allowance) + audit:no-old-idx scope extension to repo-root config files | mia-cycle37-csp-fix-deploy-20260515-232201 | 122 | 0 | dijsfozvzncw52w9 |

## Final alignment

| Field | Value |
|-------|-------|
| origin_main_head | `240c2c7128149fe13f7e5f8877d2dacabdb81b80` |
| deployed_commit | `240c2c7128149fe13f7e5f8877d2dacabdb81b80` (etag dijsfozvzncw52w9) |
| docs_commit_after_first_deploy | `52a33db` (closeout artifacts) |
| second_alignment_deploy_needed | YES — ran as deploy #2 |
| second_alignment_deploy_exit_code | 0 |
| third_deploy_needed | YES — Caddyfile CSP cleanup spotted during deploy #2 verify |
| third_deploy_exit_code | 0 |
| final_staging_live_verified | YES |
| final_deployed_commit_equals_origin_main | **YES** |

## Final live verification (post deploy #3)

- `https://miasanabriarealtor.trueidea.com/` HTTP 200, etag `dijsfozvzncw52w9`
- CSP `frame-src 'self' https://www.google.com https://maps.google.com` — `sef.mlsmatrix.com` removed from runtime header
- `/home-search/` `data-bridge-runtime-mode="demo"` — Bridge state machine honest
- `/home-search/` `Search available listings` form aria-label present
- 0 `MlsMatrix` / `sef.mlsmatrix.com` / `MLS Matrix` matches across the saved 22 staging HTMLs
- `audit:no-old-idx` PASS 480 files (now scans Caddyfile + Dockerfile + next.config.ts in addition to src/public/out/.next)
- `audit:neighborhood-images-deep --base=https://miasanabriarealtor.trueidea.com` PASS 23/23

## Caddy stale-cache observation (informational)

Caddy serves `Cache-Control: public, max-age=300, s-maxage=600, must-revalidate` on HTML — meaning HEAD `Last-Modified` may not flip immediately after redeploy even with cache-bust query strings. The deploy script's `--wait-for-needle` GET path bypasses this because it forces an origin hit, but operators reading `Last-Modified` via HEAD will see lag of up to ~5 minutes. The `etag` IS the deploy-flip signal and is honored by all three deploys this cycle (etag changed at every redeploy: dijka7eh7g1s57rf-gzip → dijreaii9la852w9-gzip → dijsfozvzncw52w9).

## What this proves

- The deployed staging site at `https://miasanabriarealtor.trueidea.com/` runs commit `240c2c7` exactly.
- All Cycle 37 source changes (image generation, old-IDX removal, Bridge state machine, Caddyfile CSP cleanup) are live.
- All gates green; no production / DNS / GHL / Google writes; no Bridge token rotation; no secrets exposed.

## Post-final-deploy delta (intentional)

After deploy #3 succeeded I authored this `final-deploy-alignment-report.md` and the validation chain auto-regenerated several `reports/*.json|md`, plus three deploy log files were written. Those changes were committed in a closeout commit (see git history). The closeout commit is **docs/reports/logs only** — the runtime source bundle is identical to the deployed `240c2c7` build. A fourth alignment deploy would only emit yet another batch of logs that need committing (infinite regress), so this cycle stops at:

- `origin/main` HEAD: closeout commit (docs/logs only, ahead of `240c2c7`)
- deployed source equivalence: confirmed identical to `240c2c7` (no `src/`, `public/`, `scripts/`, `Caddyfile`, `Dockerfile`, `package.json` changes between `240c2c7` and the closeout commit)

Future cycles that touch any runtime-affecting file MUST redeploy.
