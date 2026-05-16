# Cycle 38 — Final Deploy Alignment Report

date: 2026-05-16

## Fields

```yaml
first_deploy_commit: 8eaf986c411d08db8c443387b74da72bdcc02293
first_deploy_exit_code: 0
first_deploy_duration_seconds: 164
docs_commit_after_first_deploy: true
docs_commit_sha: 2b122b6c672584ce85658b34f4636891b0eb4de3
second_alignment_deploy_needed: true
second_alignment_deploy_exit_code: 0
second_alignment_deploy_duration_seconds: 114
second_alignment_deploy_log: docs/artifacts/cycle-38-live-images-bridge-hero/logs/final-alignment-deploy-20260516-091846.log
needle_observed_after_second_deploy: "South Florida Lifestyle" (etag="dik4iwm8fb405372-gzip")
origin_main_head: 2b122b6c672584ce85658b34f4636891b0eb4de3
deployed_commit_equals_origin_main_head: true
final_staging_live_verified: true
final_staging_etag_observed: dik4iwm8fb405372
```

## Final runtime-source classification

After the second alignment deploy (EXIT_CODE:0, 114s, `etag="dik4iwm8fb405372-gzip"`),
`origin/main HEAD == deployed commit == 2b122b6c672584ce85658b34f4636891b0eb4de3`.

A small follow-on docs commit (this report's `Fields` block + the
`final-alignment-deploy-20260516-091846.log`) lands after the alignment deploy
itself. Per the mission brief, that is acceptable when the post-deploy commit
contains **only docs/logs and does not change runtime source**. The runtime
source of the deployed build matches `8eaf986`'s `src/`, `public/`, `scripts/`,
`Caddyfile`, `Dockerfile`, `next.config.ts`; the subsequent commits
(`2b122b6` + this housekeeping commit) only updated `docs/`, `reports/`,
`ISA.md`, and `docs/mia-client-decision-record.md`. No third deploy is needed —
the live HTML and assets being served are byte-for-byte the build of the
deployed commit, and that build is what `git show 2b122b6` produces for the
runtime paths.

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
