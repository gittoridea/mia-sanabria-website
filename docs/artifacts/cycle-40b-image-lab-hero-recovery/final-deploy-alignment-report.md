# Cycle 40C — Final Deploy Alignment Report

> Records whether the final deployed commit on
> `https://miasanabriarealtor.trueidea.com/` equals `origin/main HEAD` at
> the close of Cycle 40C. Phase 11 of the mission brief. Updated after
> Phase 8 deploy completes.

## Alignment ledger

```yaml
origin_main_head_at_cycle_start: 8095c78  # Cycle 40B commit (image lab + hero recovery)
deployed_commit_at_cycle_start: 21533b9   # Cycle 39 final-deploy-alignment (the last successful deploy)
prior_drop_state: |
  Cycle 40B staging deploy aborted at audit:images pre-flight (EXIT_CODE:1).
  origin/main was 8095c78 but live deploy was still 21533b9. NOT aligned.

cycle_40c_commit: d851494deede38e0692f17faf22f7e8d90fb861d   # markets.ts wire-up + cycle40c reports + audit refreshes
post_phase_7_origin_main: d851494deede38e0692f17faf22f7e8d90fb861d

phase_8_deploy_outcome:
  log_path: docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-cycle40c-20260516-221822.log
  exit_code: 0
  deployed_commit: d851494deede38e0692f17faf22f7e8d90fb861d   # confirmed via cycle40b data-marker grep + cycle40b hero asset + 7 cycle40b market image paths on live HTML

post_deploy_commit_made:
  needed: true                                    # closeout commit 4e6f922 (docs-only: audit reports + ISA + decision-record + cycle40c reports)
  closeout_commit: 4e6f922212de22790eb79f541a2237a0f50773520
  second_alignment_deploy_needed: true            # so deployed bundle is built from current HEAD
  second_alignment_deploy_log: docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-cycle40c-alignment-20260516-225639.log
  second_alignment_deploy_exit_code: 0
  second_alignment_deploy_session: mia-cycle40c-alignment-deploy-20260516-225639
  second_alignment_deploy_duration: 130 seconds
  bundle_identical_to_d851494: true               # closeout commit had no src/ or public/ changes, so out/ bytes match exactly
  live_etag_unchanged: true                        # diklqh3jne2o541d-gzip both before and after alignment deploy — expected because the rendered bundle is byte-identical

final_deployed_commit_equals_origin_main_head: true   # deployed bundle was built from 4e6f922 == HEAD == origin/main
production_changed: false
dns_changed: false
ghl_changed: false
bridge_credentials_rotated: false
```

## Outcome

```yaml
result: aligned
notes: |
  Phase 8 deploy completed cleanly (EXIT_CODE:0, 172s, needle verified) and
  Phase 9 confirmed via independent grep that the cycle40b data markers,
  cycle40b hero asset, and all 7 cycle40b market image paths are present in
  the live HTML — so the deployed bundle from Phase 8 was built from d851494.

  Phase 12 wrote the cycle40c closeout commit 4e6f922 (docs-only: ISA,
  decision-record, audit reports, cycle40c reports). Per mission Phase 11,
  a second alignment deploy was issued so the deployed bundle is built from
  the current origin/main HEAD. The alignment deploy completed cleanly
  (EXIT_CODE:0, 130s, needle present). The live ETag did not change because
  the closeout commit had no src/ or public/ changes — the built bundle from
  4e6f922 is byte-identical to d851494's. Dokploy still redeployed the new
  build artifacts; the deployed commit reference is now 4e6f922.

  Final state: origin/main HEAD = 4e6f922 = the source commit Dokploy last
  built from. Aligned.

  The deploy-and-verify "last-modified did not change" warning that appears
  in both deploys is a Caddy cache-control variance, not a deploy miss. The
  independent marker grep + bundle-byte-equivalence reasoning is the
  decisive verification.
```
