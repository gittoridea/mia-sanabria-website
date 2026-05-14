# Final Staging Deploy Report — Cycle 35C

> Records the Phase 7 final staging deploy. Initial scaffold landed in the Phase N commit;
> populated values land in the Phase 8 follow-up docs commit.

| Field | Value |
|---|---|
| deploy_session | _populated after `tmux new-session` in Phase 7_ |
| deploy_log | _populated path of `docs/artifacts/cycle-35-recovery-full-completion/logs/final-deploy-<ts>.log`_ |
| exit_code | _populated from `EXIT_CODE:` marker_ |
| commit_deployed | _populated `git rev-parse HEAD` at moment of deploy_ |
| needle | `South Florida Lifestyle` |
| needle_wait_timeout_s | 900 |
| needle_wait_interval_s | 15 |
| result | _populated_ |
| failure_if_any | _populated or `none`_ |
| dokploy_target | Helos VPS application `XJSRlvH-91ZtUsh0RPGvo` |
| staging_url | `https://miasanabriarealtor.trueidea.com` |
| production_touched | `false` |
| token_rotations | `0` |
| dns_writes | `0` |
| ghl_writes | `0` |
| google_writes | `0` |

## Command shape

```
mkdir -p docs/artifacts/cycle-35-recovery-full-completion/logs
ts="$(date +%Y%m%d-%H%M%S)"
log="docs/artifacts/cycle-35-recovery-full-completion/logs/final-deploy-${ts}.log"
tmux new-session -d -s "mia-cycle35c-final-deploy-${ts}" \
  "cd /home/torrey/code/mia-sanabria-website && \
   bun scripts/deploy-and-verify.ts --no-lighthouse \
   --wait-for-needle='South Florida Lifestyle' \
   --wait-timeout=900 --wait-interval=15 \
   > '${log}' 2>&1; echo EXIT_CODE:\$? >> '${log}'"
```

## Wait expectation

Deploy considered successful when the log contains `EXIT_CODE:0` and the live needle
`South Florida Lifestyle` is observed within 900 seconds at `https://miasanabriarealtor.trueidea.com/`.
