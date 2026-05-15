# Cycle 36 — Resume Preflight Report

**Generated:** 2026-05-14T20:13Z
**Working dir:** /home/torrey/code/mia-sanabria-website

## Repo state

- branch: main
- head: 1386d208fa93b66d3e66f5131b001ff432b35911
- origin_main: 1386d208fa93b66d3e66f5131b001ff432b35911
- head_equals_origin_main: true
- commit_3530d5f_present: true (Cycle 35 brand audit demo-warning exception)
- commit_1386d20_present: true (Cycle 35C closeout — pushed to origin/main)
- working_tree_clean: false — `reports/audit-*` files dirty from prior `audit:all` run; no source-file dirt
- uncommitted_files: only `reports/audit-*.json|md` (16 files) — these are generated artifacts, not source
- untracked_files: 3 logs under `docs/artifacts/cycle-35-recovery-full-completion/logs/` (final-deploy log + pointer files)

## Process state

- running_tmux_sessions: none — prior `mia-cycle35c-final-deploy-20260514-155531` session has ended
- running_deploy_processes: none (no deploy-and-verify, no audit-hero, no chrome, no playwright)
- background processes seen: openclaw gateway (port 18789), GHL MCP runtime, current claude session

## Last known deploy

- last_known_deploy_log: `docs/artifacts/cycle-35-recovery-full-completion/logs/final-deploy-20260514-155531.log`
- last_known_deploy_exit_code: 1 (`audit:hero-contrast` failed → audit:all aborted → DEPLOY-ABORT)
- did_dokploy_post_happen: NO — abort fired during preflight `audit:all`, well before any Dokploy POST

## Verdict

- safe_to_continue: yes — no in-flight processes, repo state matches origin/main, only generated reports are dirty
- first_incomplete_item: Phase 1 — classify Cycle 35C deploy failure (forensics) and Phase 2 — fix `audit:hero-contrast` at root
- branch protection: do not run another deploy until hero-contrast passes
