---
cycle: 42
artifact: continuation-prompt
generated_at: 2026-05-17
---

# Cycle 42 — Continuation Prompt

```yaml
branch: main
head_at_close: 76b5bd5ab34b69060af536877b0e93ad80860205
origin_main: 76b5bd5ab34b69060af536877b0e93ad80860205
working_tree_after_close: clean of source/scripts deltas; same pre-existing untracked sidecars
  (docs/artifacts/cycle-40b-.../logs/staging-deploy-cycle40c-final-alignment-*.log,
   docs/artifacts/cycle-41-.../logs/*.pid,
   docs/artifacts/cycle-41-.../staging-html/)

completed_phases:
  - 0  Recovery preflight
  - 1  Prior-state review
  - 2  Live-before HTML + screenshots capture
  - 3  Helper copy replacement + scripts/audit-home-hero-copy.ts (new) + package.json wiring
  - 4  Local typecheck/lint/build/audits/Bridge E2E
  - 5  Local-after screenshots + secret scans
  - 6  Red-team precommit review
  - 7  Commit + push (commit 82c7045)
  - 8  Staging deploy via tmux (EXIT_CODE:0)
  - 9  Live verification at https://miasanabriarealtor.trueidea.com/
  - 10 Red-team final review
  - 11 Final-deploy-alignment decision + plan
  - 12 Closeout commit (record update) + alignment deploy
  - 13 Final reports written
  - 14 Rollback + continuation written

incomplete_phases: none

exact_next_commands_for_resumption_if_session_dies_mid_phase_12:
  # 1. Verify the closeout-bundle commit landed
  cd /home/torrey/code/mia-sanabria-website
  git log --oneline -3
  git rev-parse HEAD
  git rev-parse origin/main

  # 2. If closeout commit not yet present, stage + commit + push
  git add docs/artifacts/cycle-42-homepage-hero-copy-polish docs/mia-client-decision-record.md ISA.md
  git restore --staged 'docs/artifacts/**/staging-html/*' 'docs/artifacts/**/*.pid' 2>/dev/null || true
  git -c commit.gpgsign=false commit -m "docs(MIA-SITE-CYCLE-42): record live verification + final-deploy alignment + closeout"
  git push origin main

  # 3. Re-run staging deploy under tmux for alignment
  ts="$(date +%Y%m%d-%H%M%S)"
  log="docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/staging-deploy-alignment-${ts}.log"
  tmux new-session -d -s "mia-cycle42-alignment-deploy-${ts}" \
    "set -a && source ~/.claude/.env 2>/dev/null && set +a && \
     bun scripts/deploy-and-verify.ts --no-lighthouse \
       --wait-for-needle='South Florida Lifestyle' \
       --wait-timeout=900 --wait-interval=15 > '${log}' 2>&1; \
     echo EXIT_CODE:\$? >> '${log}'"
  # Wait for EXIT_CODE:0

  # 4. Verify live unchanged (etag will flip but user-visible content identical)
  cb=$(node -e 'console.log(require("crypto").randomBytes(8).toString("hex"))')
  curl -sL -H "Cache-Control: no-cache" "https://miasanabriarealtor.trueidea.com/?cb=$cb" \
    | grep -oF "Begin with an area" | wc -l   # expect 2
  curl -sL -H "Cache-Control: no-cache" "https://miasanabriarealtor.trueidea.com/?cb=$cb" \
    | grep -oF "Bridge-backed" | wc -l   # expect 0

  # 5. Update final-deploy-alignment-report.md with the alignment deploy outcome,
  #    commit + push the report-only edit, no second alignment loop.

changed_files_in_phase_7_code_commit:
  - src/components/HeroSearch.tsx
  - scripts/audit-home-hero-copy.ts (new file, 199 lines)
  - package.json (one new script entry)
  - reports/*.{json,md} (13 audit-report refreshes)
  - docs/artifacts/cycle-42-homepage-hero-copy-polish/** (Phase 0-6 reports + live-before HTML)

changed_files_in_phase_12_closeout_commit:
  - docs/artifacts/cycle-42-homepage-hero-copy-polish/{red-team-final-review,staging-deploy-report,staging-live-verification-report,live-visual-qa-report,homepage-hero-copy-final-report,bridge-e2e-final-report,final-deploy-alignment-report,expert-team-findings,rollback-plan,claim-vs-reality,remaining-blockers,continuation-prompt}.md
  - docs/artifacts/cycle-42-homepage-hero-copy-polish/live-after/html/*.html
  - docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/staging-deploy-*.log
  - docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/live-after-capture.log
  - docs/mia-client-decision-record.md (MIA-CYCLE-42 decision entry)
  - ISA.md (Decisions / Changelog / Verification append)

validation_results_at_close:
  typecheck:                pass
  lint:                     pass
  build:                    pass
  audit:brand:              pass (12/0/0)
  audit:hero-contrast:stable pass (145/0/0)
  audit:route-inventory:    pass (48 routes)
  audit:no-fabrications:    pass (0 hits)
  audit:no-old-idx:         pass (481 files)
  audit:home-bridge-search: pass (7/7 local · 8/8 live)
  audit:home-hero-copy:     pass (3 surfaces clean)
  audit:mobile-readability: pass (84/0/0)
  audit:qa-gate:            pass (critical=0; high=4 readiness register)
  home-search-bridge-e2e:   pass (11/11 local mode=fallback · 11/11 live mode=demo)
  secret_safety:            clean (no token-shaped values in source, build, or live HTML)

bad_copy_removal_status:
  source:                       removed
  out_index_html_post_rebuild:  removed
  live_staging_html_post_deploy: removed
  older_search_anchors_variant_live: never_present_after_deploy

homepage_hero_status:           cycle_41_layout_preserved
bridge_mode_local:              fallback
bridge_mode_staging_live:       demo
bridge_e2e_local:               11/11 PASS
bridge_e2e_live:                11/11 PASS
old_idx_status:                 absent (everywhere)

staging_deploy_status:           EXIT_CODE:0
deployed_commit_at_phase_9:     82c70452ceed37c07e0e6f7d48735d6a41c4c833
deployed_commit_equals_origin_main_at_phase_9: true
deployed_commit_equals_origin_main_at_phase_12_close: pending alignment deploy

tmux_session_log_paths:
  phase_8_deploy: docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/staging-deploy-20260517-123230.log
  phase_12_alignment: docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/staging-deploy-alignment-<ts>.log

blockers:
  - mia visual review of new helper copy (operator territory)
  - production cutover (DNS / GHL / Bridge live creds / legal review / Mia sign-off)
  - qa-gate high register (4 items — separate cycle scope)

secret_safety_status: clean

resume_prompt: |
  Cycle 42 closed with the homepage hero helper copy replaced and verified
  live at https://miasanabriarealtor.trueidea.com/. Mia's visual review is
  the only remaining item to confirm she accepts the new wording. If she
  asks for a different sentence, the smallest forward-fix cycle is:

  1. Edit src/components/HeroSearch.tsx helper <p> with the new wording.
  2. Local rebuild + audit:home-hero-copy (will fail until tooling is in
     sync — adjust the audit's forbidden list ONLY if the operator
     explicitly retires a phrase; otherwise just keep the new text outside
     the forbidden patterns).
  3. Push, deploy to staging via tmux, verify live.

  The smallest next mission toward production readiness is closing the
  qa-gate high register (4 items in reports/qa-gate-matrix.json). That
  is a separate cycle, separate brief.
```
