# Cycle 37 — Staging Deploy Report

## Deploy invocation

- tmux session: `mia-cycle37-staging-deploy-20260515-223232`
- log: `docs/artifacts/cycle-37-neighborhood-images-bridge-idx/logs/staging-deploy-20260515-223232.log`
- command: `bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle="South Florida Lifestyle" --wait-timeout=900 --wait-interval=15`
- env: sourced inside `set +x` subshell from `~/.claude/.env` — no values printed

## Pre-flight (run by deploy-and-verify.ts)

- typecheck PASS
- lint PASS
- build PASS
- audit:all PASS (including new audit:no-old-idx + audit:neighborhood-images-deep)
- audit:completeness gate: pass=16 warn=1 fail=0 skip=0

## Dokploy outcome

- triggered Dokploy `application.deploy` for `XJSRlvH-91ZtUsh0RPGvo`
- pre-deploy `last-modified: Fri, 15 May 2026 21:17:43 GMT`
- polling `application.one`: status=running for 167s, then status=done
- ✓ deploy done in 167s
- post-deploy `last-modified` did not change in `HEAD` response (Caddy stale cache quirk known) — etag is the deploy-flip signal
- needle `South Florida Lifestyle` present after ~0s on `https://miasanabriarealtor.trueidea.com/`
- new etag: `dijka7eh7g1s57rf-gzip`
- `EXIT_CODE:0`

## Bridge build args at deploy

`data-bridge-runtime-mode="demo"` rendered in deployed `/home-search/` HTML — confirms Dokploy build args bake `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` + `NEXT_PUBLIC_BRIDGE_DATASET_ID` AND keep `NEXT_PUBLIC_BRIDGE_DEMO=true`. Bridge live feed remains unproven; demo honesty preserved.

## Notes

- No production / DNS / GHL / Google writes occurred.
- No Bridge token refresh / rotation occurred.
- No credential values printed, echoed, logged, or committed.
