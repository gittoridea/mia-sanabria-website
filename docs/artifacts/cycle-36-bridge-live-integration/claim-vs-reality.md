# Claim vs Reality — Cycle 36D

**Generated:** 2026-05-15 (after staging deploy + live verification)

## Mission-level claims and their evidence

| # | Claim | Reality | Evidence |
|---|---|---|---|
| 1 | Cycle 35C deploy blocker fixed | TRUE | `scripts/audit-hero-pixel-contrast.ts:261-309` (ASSET_CACHE + primeAssetCache + ArrayBuffer slice); deploy gate `audit:hero-contrast:stable` 145/0/0 |
| 2 | Cycle 36 source intact before commit | TRUE | `git diff --stat` showed expected files (.gitignore, package.json, scripts/audit-hero-pixel-contrast.ts, +scripts/probe-bridge-live.ts) plus 15 report updates |
| 3 | Validation passed end-to-end | TRUE | `docs/artifacts/cycle-36-bridge-live-integration/logs/full-validation-20260514-180132.log` EXIT_CODE:0; resume sanity subset re-run clean |
| 4 | Token-bearing chunk JS never committed | TRUE | `.gitignore:62-63` covers chunk + page bundles; `git ls-files` shows no `*chunk*.js` or `*page-*.js`; PRE_DEPLOY chunk file gitignored |
| 5 | Bridge truthfulness assessed without leaks | TRUE | `bridge-current-truthfulness-report.md`, sanitized probe JSON, sanitized staging HTML reports; secret-shape scan returned 0 hex/Base64 matches |
| 6 | Bridge mode classified honestly | TRUE | demo (chunk literal `test_sf` + `BRIDGE_DEMO=true` unchanged from Cycle 33B build); live feed NOT proven |
| 7 | Cycle 36 work committed and pushed | TRUE | commit `3a99bc3` ; `1386d20..3a99bc3 main -> main` |
| 8 | Staging deployed in crash-resilient tmux | TRUE | tmux session `mia-cycle36d-staging-deploy-20260515-165745`, log `staging-deploy-20260515-165745.log`, EXIT_CODE:0 in 173 s |
| 9 | https://miasanabriarealtor.trueidea.com/ is live with deployed commit | TRUE | etag flipped to `dijka7eh7g1s1hiy`; `last-modified` advanced to 2026-05-15 21:17:43Z; needle "South Florida Lifestyle" present |
| 10 | Live HTML has no secret values | TRUE | grep over 18 captured HTML files returned 0 matches for BRIDGE_*, DOKPLOY_*, GOOGLE_API_KEY, Bearer, access_token=, refresh_token= |
| 11 | Mobile readability passes locally and on staging | TRUE | local 84/0/0; staging 84/0/0 against live URL |
| 12 | Visual QA captured | TRUE | local 39/39 ok (44 s); staging 108/108 ok (79 s) |
| 13 | No production / DNS / GHL / Google writes | TRUE | confirmed; only Dokploy deploy POST to dev/staging app `XJSRlvH-91ZtUsh0RPGvo` |
| 14 | No Bridge token rotation or credential value changes | TRUE | Bridge env vars never present locally; Dokploy build args unchanged |
| 15 | Production-readiness NOT claimed | TRUE | this report, decision record, and session report all state the same |

## Mission completion criteria (from brief)

```yaml
in_progress_validation_recovered: true
valid_cycle_36_work_preserved: true
ai_closeable_gaps_closed: true
validation_passes: true
safe_changes_committed_and_pushed: true
staging_deploy_crash_resilient: true
staging_live_verified: true   # https://miasanabriarealtor.trueidea.com/ confirmed live with deployed commit
bridge_mode_truthfully_classified: true   # demo
demo_honesty_preserved: true
no_tokens_or_secrets_exposed: true
final_records_rollback_plan_continuation_prompt_updated: true
```

All 11 mission-completion criteria met.

## What is NOT claimed (intentional honesty)

- "Bridge live feed works" — explicitly NOT claimed. Demo is the truthful current state.
- "Production-ready" — explicitly NOT claimed. Staging closeout only.
- "samples=1 is perfectly deterministic" — explicitly classified as intermittent; the deploy gate is samples=3.
- "Cycle 35C audit-WARN count is improved" — Cycle 36D made no claim about WARN counts on completeness/legal/rendered; those remain at their pre-cycle values (1 WARN each).
- "Visual baseline diff against Cycle 35 staging captures" — not performed. Cycle 36D captured fresh visual baselines for the new build; future cycle can diff if desired.

## Surprises / honest record

- The samples=1 race that the Cycle 36 fix targeted is narrowed but not eliminated. Two consecutive resume re-runs gave 144/0/1 then 145/0/0 with no source change. The deploy gate uses samples=3 specifically because of this remaining race tail.
- The staging chunk hash for `/home-search/` did NOT change with the new deploy (`page-4e686a00462ff90a.js` pre and post). Next.js content-hashes deterministically; unchanged source + unchanged env vars = unchanged chunk. Other routes' chunks WERE rebuilt — the etag flip on `/` and `/home-search/` confirms the deploy executed.
- Deploy log emitted "last-modified did not change — Caddy may be caching even with bust headers" but the post-needle HTTP HEAD showed `last-modified: Fri, 15 May 2026 21:17:43 GMT` — the warning was a polling race against Caddy cache, not a deploy failure.
