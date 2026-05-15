# Cycle 36C/36D — Expert Team Findings

**Generated:** 2026-05-14T22:07Z (Cycle 36C)
**Cycle 36D resume update:** 2026-05-15
**Note:** External subagents were not spawned for this resume — Phase 1 already proved the SSH-drop was a narrow tail-of-validation interruption, and the missing work was bounded enough that lane-by-lane manual execution is the lower-friction path. Lanes below summarize the manual work done in each role on this resume.

## Cycle 36D resume lane summary (added 2026-05-15)

```yaml
recovery_commander:
  actual_agent_used: false
  tool_or_method: manual recovery + tail-grep of full-validation-20260514-180132.log
  closed_now:
    - confirmed validation log ends with EXIT_CODE:0 (full chain green at 18:01:32+)
    - confirmed HEAD == origin/main == 1386d20 (no half-state)
    - confirmed no in-flight tmux/process
    - wrote cycle-36d-resume-preflight.md, cycle-36d-validation-recovery.md
  prepared_now:
    - sanity subset (typecheck, lint, brand, hero-contrast, hero-contrast:stable, mobile-readability) re-run
    - commit batch unchanged from Cycle 36C plan
  blocked_external: none
  risks_found:
    - hero-contrast samples=1 hit a re-occurring flake on /markets/pompano-beach/ 768x1024 (ratio 2.85) — does not fail the gate (audit:all uses :stable), but documents that prewarm fix narrowed the race rather than eliminating it
  files_touched:
    - cycle-36d-resume-preflight.md
    - cycle-36d-validation-recovery.md
  validation: stable run in flight; will close commit only on its pass

release_engineer:
  actual_agent_used: false
  tool_or_method: tmux + deploy-and-verify.ts
  closed_now:
    - re-verified .env vars: DOKPLOY_API_URL and DOKPLOY_API_TOKEN present in ~/.claude/.env (sourced only inline at deploy time, never echoed)
  prepared_now:
    - Phase 10 will spawn tmux session mia-cycle36d-staging-deploy-<ts> with deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15
  blocked_external:
    - Dokploy server must be reachable; out-of-cycle credential rotation could break the deploy
  risks_found: none new
  files_touched: none yet
  validation: pending Phase 10

brand_hero_contrast_engineer:
  actual_agent_used: false
  tool_or_method: targeted grep + sanity reruns
  closed_now:
    - confirmed ASSET_CACHE (line 261), primeAssetCache() (line 263), ArrayBuffer-slice (line 309) intact
    - confirmed audit:brand still 12/0/0
    - confirmed audit:hero-contrast:stable is wired into audit:all (package.json:40)
  prepared_now:
    - waiting on samples=3 result before commit
  blocked_external: none
  risks_found:
    - samples=1 transient FAIL re-confirms that the prewarm fix raises the floor but does not perfectly eliminate the sub-3.0 sampling race; the long-term gate (audit:all → audit:hero-contrast:stable) absorbs this and the mutation sentinel still detects real regressions
  files_touched: none new
  validation: in flight

bridge_idx_truthfulness_engineer:
  actual_agent_used: false
  tool_or_method: secret-safe probe + sanitized HTML re-fetch
  closed_now:
    - re-ran probe-bridge-live.ts → endpointConfigured=false, requestAttempted=false (sanitized JSON saved)
    - re-fetched https://miasanabriarealtor.trueidea.com/home-search/ → HTTP 200, chunk unchanged (page-4e686a00462ff90a.js)
    - re-confirmed demo mode classification + external-blocker list
  prepared_now:
    - Phase 11 will re-fetch the same surfaces post-deploy; expect new chunk hash but same Bridge env values
  blocked_external:
    - non-test dataset id + IDX-licensed resource path + non-demo flag must be flipped in Dokploy build args (and Bridge dashboard referrer domain set) before any "live" classification is possible
  risks_found: none new
  files_touched:
    - bridge-current-truthfulness-report.md (Cycle 36D revalidation appended)
  validation: demo honesty preserved

security_secrets_officer:
  actual_agent_used: false
  tool_or_method: git check-ignore + git ls-files + git diff secret-shape scan (Phase 9-time)
  closed_now:
    - confirmed .gitignore:62-63 cover *chunk*.js and *page-*.js inside staging-html
    - confirmed git ls-files shows no tracked chunk JS (only sanitized HTMLs)
    - confirmed no secret values emitted to terminal, log, or report this resume
  prepared_now:
    - Phase 9 staged-patch secret-shape scan (BRIDGE_*=, NEXT_PUBLIC_BRIDGE_*=, Bearer, access_token=, refresh_token=, DOKPLOY_API_TOKEN, GOOGLE_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY)
    - Phase 11 live HTML secret-shape scan
  blocked_external: none
  risks_found: none new
  files_touched:
    - token-bearing-artifact-safety.md (Cycle 36D revalidation appended)
  validation: clean

visual_qa_reviewer:
  actual_agent_used: false
  tool_or_method: capture-baseline.ts + summary JSON
  closed_now:
    - local visual QA captured 2026-05-14T22:06:28Z (13 routes × 3 viewports = 39 PNGs, 0 fail, 44 s)
  prepared_now:
    - Phase 11 will capture staging set at same viewports post-deploy
  blocked_external: none
  risks_found: none
  files_touched:
    - visual-qa-local-report.md (already finalized this cycle)
  validation: 39/39 ok

cato_compliance_reviewer:
  actual_agent_used: false
  tool_or_method: not spawned — narrow scope, no new feature surface in Cycle 36D
  rationale:
    - Cato is invoked at end of VERIFY on E4/E5 ISAs. Cycle 36D recovers an interrupted close-out, not a new feature build.
    - Hero-contrast fix is one-line ArrayBuffer-slice + one prewarm helper, already covered by mutation sentinel
    - Bridge work is documentation-only; no Bridge UI changes shipped
  closed_now: n/a
  prepared_now: n/a
  blocked_external: n/a
  risks_found: none
  files_touched: none
  validation: not required this cycle

forge_engineer:
  actual_agent_used: false
  tool_or_method: not spawned — no source-bug remediation needed; existing fix is minimal and already verified
  rationale: Cycle 36D is closeout, not build
  closed_now: n/a
  prepared_now: n/a
  files_touched: none
  validation: not required this cycle
```

## Recovery Commander
```yaml
closed_now:
  - cycle-36c-resume-preflight.md written
  - interrupted-validation-forensics.md written
  - token-bearing-artifact-safety.md written
  - hero-contrast-fix-verification.md written
  - bridge-current-truthfulness-report.md written (re-probe of staging)
  - bridge-runtime-guard-report.md written
  - expert-team-findings.md written
  - full-validation tmux session started (mia-cycle36c-validation-20260514-180132)
prepared_now:
  - Phase 7 final-validation-report.md scaffold (pending validation log EXIT_CODE)
  - Phase 8 visual-qa-local-report.md scaffold (pending local screenshot capture)
  - Phase 9 commit batch (.gitignore, package.json, scripts/audit-hero-pixel-contrast.ts, scripts/probe-bridge-live.ts, docs/artifacts/cycle-36-bridge-live-integration/*.md, decision record)
blocked_external: none
risks_found:
  - SSH-drop midstream is plausible on long runs — mitigated by tmux + appended EXIT_CODE markers
  - Hidden CSS-render race in hero-contrast samples=1 could resurface on other large hero JPGs (prewarm fixes the class, not just the two failing routes)
files_touched:
  - docs/artifacts/cycle-36-bridge-live-integration/cycle-36c-resume-preflight.md
  - docs/artifacts/cycle-36-bridge-live-integration/interrupted-validation-forensics.md
  - docs/artifacts/cycle-36-bridge-live-integration/token-bearing-artifact-safety.md
  - docs/artifacts/cycle-36-bridge-live-integration/hero-contrast-fix-verification.md
  - docs/artifacts/cycle-36-bridge-live-integration/bridge-current-truthfulness-report.md
  - docs/artifacts/cycle-36-bridge-live-integration/bridge-runtime-guard-report.md
validation: see final-validation-report.md (pending EXIT_CODE)
```

## Release Engineer
```yaml
closed_now:
  - confirmed prior Cycle 35C deploy aborted PRE-Dokploy-POST (no orphan deploy state)
  - confirmed no concurrent deploy or audit process running
  - validation tmux session is properly wrapped with EXIT_CODE marker
prepared_now:
  - Phase 10 staging-deploy will run under a tmux session named mia-cycle36c-staging-deploy-<ts>
  - command shape: bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15
  - Phase 11 staging-live verification will pull current HTML across 18 staging URLs and capture screenshots at 375x812 / 768x1024 / 1280x800
blocked_external:
  - Dokploy POST itself depends on DOKPLOY_API_URL + DOKPLOY_API_TOKEN being sourced from ~/.claude/.env at deploy time — these are present in that file but not in the shell by default
risks_found:
  - Caddy serves stale; deploy verify must check etag flip + cache-bust hex on first probe
  - audit:rendered uses port 4173; deploy-and-verify also wants 4173 — port-guard already handles this
files_touched: none yet (deploy phase pending)
validation: pending
```

## Brand / Hero Contrast Engineer
```yaml
closed_now:
  - confirmed scripts/audit-hero-pixel-contrast.ts has ASSET_CACHE prewarm + ArrayBuffer Response fix
  - confirmed bun run audit:hero-contrast (samples=1) returns 145 PASS / 0 FAIL
  - confirmed bun run audit:brand returns 12 PASS / 0 FAIL (data-brand-exception="demo-warning" still works)
  - confirmed package.json audit:all uses audit:hero-contrast:stable
prepared_now:
  - awaiting audit:hero-contrast:stable samples=3 result from Phase 7 tmux log
  - awaiting audit:mobile-readability from Phase 7 tmux log
blocked_external: none
risks_found:
  - gate strength preserved — mutation sentinel previously verified to still detect regression (see hero-contrast-fix-report.md)
files_touched: none new (verifications only)
validation: hero-contrast and brand audits pass; full validation in flight
```

## Bridge IDX Truthfulness Engineer
```yaml
closed_now:
  - confirmed local Bridge credentials still absent (default shell + ~/.claude/.env)
  - re-ran scripts/probe-bridge-live.ts (endpointConfigured=false, requestAttempted=false; sanitized JSON saved)
  - re-probed staging /home-search/ → HTTP 200, chunk reference unchanged (page-4e686a00462ff90a.js)
  - confirmed initial HTML has no DEMO banner / DEMO pill markers (expected — these render client-side after a search) and no MlsMatrixFallback (BRIDGE_AVAILABLE=true on chunk)
  - chunk needles from Cycle 36 initial probe still apply: dataset literal test_sf, DEMO literal true, demoMode prop true
prepared_now:
  - if Mia provisions a production dataset later, the path forward is documented in bridge-current-truthfulness-report.md (Dokploy build args + Bridge dashboard referrer domain only — no code change)
blocked_external:
  - real Bridge live feed is NOT proven; it cannot be proven without a non-test dataset + IDX-licensed resource path baked into the deployed chunk
risks_found:
  - if a future operator flips NEXT_PUBLIC_BRIDGE_DEMO=false without also flipping the dataset id off test_sf, the site would surface San Francisco test rows as if they were real Mia inventory; future audit:bridge-runtime recipe (in bridge-runtime-guard-report.md) closes this risk
files_touched: none new (verifications only)
validation: demo honesty is preserved; demo banner + DEMO badges remain gated to demo mode in chunk
```

## Security / Secrets Officer
```yaml
closed_now:
  - confirmed .gitignore:62-63 rules cover docs/artifacts/**/staging-html/*chunk*.js and *page-*.js
  - confirmed git check-ignore -v passes for the locally downloaded chunk file
  - confirmed git ls-files contains no tracked chunk JS
  - probe script (scripts/probe-bridge-live.ts) reviewed — never logs token values; sanitized JSON output schema documented in script header
prepared_now:
  - Phase 9 pre-commit staged-patch secret-shape scan (BRIDGE_*=[A-Za-z0-9], NEXT_PUBLIC_BRIDGE_*=[A-Za-z0-9], Bearer, access_token=, refresh_token=, DOKPLOY_API_TOKEN, GOOGLE_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY)
  - Phase 11 live staging HTML secret-shape scan
blocked_external: none
risks_found:
  - downloaded chunk JS files (PRE_DEPLOY_home-search_chunk.js and any future staging-html/current|final/*chunk*.js) remain on disk — acceptable because they are gitignored; deletable at end of cycle if desired
files_touched: none new
validation: no token values printed, committed, or otherwise exposed this session
```

## Visual QA Reviewer
```yaml
closed_now:
  - staging visual QA captures from earlier this cycle are intact under docs/artifacts/cycle-36-bridge-live-integration/visual-qa/staging-pre-deploy/
prepared_now:
  - Phase 8 local visual QA (375x812 / 768x1024 / 1280x800 across home, home-search variants, markets/, market pages)
  - Phase 11 final staging visual QA (same viewports, post-deploy)
blocked_external: none
risks_found:
  - capture-baseline.ts depends on libvips runtime — LD_LIBRARY_PATH prefix is already wrapped by the script
files_touched: none yet (capture phase pending)
validation: pending
```

## Cato / Compliance Reviewer
```yaml
closed_now:
  - not spawned this resume — Bridge work has no code changes to audit; hero-contrast fix is narrow + already verified by audit:hero-contrast:stable + mutation sentinel
prepared_now: n/a
blocked_external: n/a
risks_found:
  - Cato review would have nothing material to attack on this resume (no new feature surface)
files_touched: none
validation: not required for this resume
```
