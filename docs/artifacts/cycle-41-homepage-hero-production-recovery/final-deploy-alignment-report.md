---
cycle: 41
artifact: final-deploy-alignment-report
generated_at: 2026-05-17
---

# Cycle 41 — Final Deploy Alignment Report

```yaml
origin_main_head_at_phase_9_commit: e63a35eb10bb1ebd565ef29767c4bf5f10213648
deployed_bundle_built_from: e63a35eb10bb1ebd565ef29767c4bf5f10213648
post_deploy_commit_made: true                      # Phase 14 docs-only records + verification artifacts
post_deploy_commit_sha: 18a2e8a3b1b5e15bb2067dc897e352f978fec32a
post_deploy_commit_touches_bundle_source: false    # ISA.md, docs/*.md, reports/*.{json,md}, cycle-41 artifacts only
second_alignment_deploy_needed: false              # docs commit does not change bundle; aligning would create the
                                                   # Cycle 40C closeout-deploy recursion (committing the alignment-deploy
                                                   # log advances HEAD again past the just-deployed bundle).
second_alignment_deploy_exit_code: n/a
final_origin_main_head: 18a2e8a3b1b5e15bb2067dc897e352f978fec32a
final_deployed_bundle_built_from: e63a35eb10bb1ebd565ef29767c4bf5f10213648
final_deployed_commit_equals_origin_main_head: false
final_deployed_bundle_equals_origin_main_bundle: true  # docs commit produces byte-identical bundle
aligned_by_bundle_equivalence: true
```

## Why no second alignment deploy

The Phase 14 docs commit (`18a2e8a`) touches:
- `ISA.md`
- `docs/mia-client-decision-record.md`
- `docs/artifacts/cycle-41-homepage-hero-production-recovery/*` (12 markdown files + 3 log files)
- `reports/audit-*.{json,md}` (audit re-run output from Phase 11 live verification)

None of these are inputs to the Dokploy build pipeline. The bundle that Dokploy builds from `18a2e8a` is byte-identical to the bundle it built from `e63a35e`. Per the Cycle 40C precedent documented in `docs/artifacts/cycle-40b-image-lab-hero-recovery/final-deploy-alignment-report.md`:

> Triggering a redundant alignment-deploy to make `deployed_commit == origin/main HEAD` numerically equal would force capture + commit of a new `staging-deploy-*.log` file, advancing HEAD again, restarting the recursion.

The honest report is therefore: `final_deployed_commit_equals_origin_main_head = false` (numerically) AND `final_deployed_bundle_equals_origin_main_bundle = true` (semantically). Both statements true; both visible.


## Decision logic

Cycle 41 commit `e63a35e` is the Phase 9 source commit; the Dokploy build picks up origin/main HEAD at trigger time, so the deployed bundle is sourced from `e63a35e`. As long as no further commits land on origin/main between the trigger and "final state," `final_deployed_commit_equals_origin_main_head` will be `true`.

If Phase 14 lands a docs-only commit (records update: ISA.md / decision record / MIA_SESSION_REPORT / live-after artifacts) BEFORE this report is finalized, the prior Cycle 38/39/40B/40C pattern applies:

- Option A: trigger a second alignment-deploy via tmux so the deployed bundle is rebuilt from the post-records-commit HEAD.
- Option B: per Cycle 40C, leave the alignment-deploy LOG file uncommitted (avoid the recursion where committing the log advances HEAD past the just-deployed bundle).

The choice is determined by whether the docs commit touches files Dokploy builds from (`src/`, `public/`, `next.config.mjs`, etc.). If not, no alignment deploy is needed — the docs commit advances HEAD but does not change the bundle. In that case the report records both `head=<docs-commit>` and `deployed_bundle_built_from=<source-commit>` honestly.

## Filled values (pending Phase 11+ completion)

This file is the final-state declaration. Updated after Phase 11 live verification and Phase 14 records update.
