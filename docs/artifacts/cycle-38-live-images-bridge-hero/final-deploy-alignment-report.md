# Cycle 38 — Final Deploy Alignment Report

date: 2026-05-16

*(Skeleton — filled in after the staging deploy completes and any follow-up docs commit lands.)*

## Fields

```yaml
origin_main_head:                                    # full sha after any docs commit
deployed_commit:                                     # full sha of the deployed build
docs_commit_after_first_deploy:                      # true | false (whether a docs-only commit landed after the first deploy)
second_alignment_deploy_needed:                      # true | false (true if a docs commit landed and HEAD ≠ deployed commit)
second_alignment_deploy_exit_code:                   # integer or N/A
final_staging_live_verified:                         # true | false
deployed_commit_equals_origin_main_head:             # true | false
```

## Approach

Cycle 38 followed the "write docs before commit, deploy once" pattern to avoid the Cycle-37 misalignment where a docs commit landed after the deploy without a follow-up deploy. The first deploy includes all 23 docs files (excluding only post-deploy verification artifacts which are populated *after* the deploy).

If post-deploy verification artifacts (`staging-live-verification-report.md`, `visual-qa-staging-report.md`, `neighborhood-image-staging-final-report.md`, `homepage-hero-staging-final-report.md`, `bridge-staging-final-report.md`, `final-deploy-alignment-report.md`) change the working tree after the first deploy, the procedure is:

1. Stage only docs + `ISA.md` + decision record.
2. Re-scan staged patch for secrets.
3. Commit `docs(MIA-SITE-CYCLE-38): record live image Bridge hero verification`.
4. Push.
5. Run a final-alignment Dokploy deploy so `deployed_commit == origin/main HEAD`.
6. Quick-verify home/markets/home-search live again.

If those artifacts do not require a follow-up commit (e.g. their content fits within the original commit at write time), `second_alignment_deploy_needed = false`.

## Constraints

- No code changes after the first deploy. The first deploy is the runtime decision; later docs commits only record observations.
- No Bridge token rotation.
- No production system writes.
- No DNS, GHL, Google, or branded-email changes.
