# Cycle 40C — Staging Deploy Report

> Records the tmux staging-deploy invocation, log path, exit code, and
> needle verification for `https://miasanabriarealtor.trueidea.com/`.
> Updated when Phase 8 runs.

```yaml
deploy_target: https://miasanabriarealtor.trueidea.com
strategy: deploy-and-verify.ts via tmux (background, logged, EXIT_CODE captured)
command: |
  tmux new-session -d -s "mia-cycle40c-staging-deploy-${ts}" \
    "cd /home/torrey/code/mia-sanabria-website && \
     bun scripts/deploy-and-verify.ts \
       --no-lighthouse \
       --wait-for-needle='South Florida Lifestyle' \
       --wait-timeout=900 \
       --wait-interval=15 \
     > '${log}' 2>&1; \
     echo EXIT_CODE:\$? >> '${log}'"

prior_cycle_40b_staging_deploy:
  log: docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-20260516-210340.log
  exit_code: 1
  status: completed_fail
  cause: |
    audit:images failed at pre-flight because src/lib/markets.ts still pointed
    to /markets/<slug>-cycle39.jpg paths for the seven Mia-approved Broward
    slugs while only the -cycle40b.jpg variants existed on disk. Dokploy
    POST never issued.

cycle_40c_staging_deploy:
  tmux_session: <fills after Phase 8>
  log: <docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-cycle40c-<ts>.log>
  exit_code: <fills after Phase 8>
  dokploy_post_issued: <fills>
  needle_verified: <fills>     # "South Florida Lifestyle"
  etag_changed_from_prior: <fills>
  deploy_duration_seconds: <fills>
  status: <pending | running | completed_success | completed_fail>
```

## Verification approach

`deploy-and-verify.ts` already does the right things:

1. Runs `bun run typecheck`, `bun run lint`, `bun run build` as pre-flight.
2. Runs `bun run audit:all` as a hard pre-flight gate (this is what aborted Cycle 40B's deploy).
3. POSTs to Dokploy with the Cycle 40C commit SHA.
4. Polls `https://miasanabriarealtor.trueidea.com/` with cache-bust until the
   `South Florida Lifestyle` needle appears or the timeout elapses.
5. Compares the post-deploy ETag against the pre-deploy ETag for a deploy-
   flip confirmation.
6. Writes EXIT_CODE:N as the final log line.

The Phase 9 live verification then captures the rendered pages with
Playwright-based screenshots (not capture-baseline's chrome --headless
window-size mode — see `cycle40c-mobile-hero-proof.md` for why), runs the
live Bridge E2E, and re-runs the targeted audits.
