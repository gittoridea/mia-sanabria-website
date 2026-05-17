---
cycle: 41
artifact: continuation-prompt
generated_at: 2026-05-17
---

# Cycle 41 — Continuation Prompt

Drop this whole document into a fresh Claude Code session to resume Cycle 41 work if the current session is interrupted.

## State snapshot

```yaml
repo: /home/torrey/code/mia-sanabria-website
branch: main
HEAD: e63a35eb10bb1ebd565ef29767c4bf5f10213648
origin_main: e63a35eb10bb1ebd565ef29767c4bf5f10213648
head_equals_origin_main: true (verify with `git rev-parse HEAD` and `git rev-parse origin/main`)
working_tree_state: |
  - reports/* may have audit-rerun delta — regenerable.
  - docs/artifacts/cycle-41-homepage-hero-production-recovery/{live-before,local-after,live-after}/screenshots/*.png are NOT committed (gitignored, regenerable).
  - logs/*.log are committed; logs/*.pid are not.

completed_phases:
  - Phase 0  (resume preflight)
  - Phase 1  (prior state review)
  - Phase 2  (live-before captures + critique)
  - Phase 3  (creative brief)
  - Phase 4  (Hero.tsx + HeroSearch.tsx + page.tsx edits + imagePanelWidth opt-in)
  - Phase 5  (local build + local-after captures + visual QA)
  - Phase 6  (Bridge E2E local PASS 11/11 + no-old-idx PASS + home-bridge-search 8/8)
  - Phase 7  (validation gates — typecheck/lint/build/brand/hero-contrast/rendered/qa-gate/mobile-readability/neighborhood-images-deep all PASS; one regression caught and resolved)
  - Phase 8  (red-team precommit)
  - Phase 9  (commit e63a35e + push)
  - Phase 10 (staging deploy LAUNCHED — running in tmux as of this prompt)

incomplete_phases:
  - Phase 10 (waiting on deploy completion + EXIT_CODE)
  - Phase 11 (live-after capture + live E2E + audits + live HTML scan + visual inspection)
  - Phase 12 (red-team final review)
  - Phase 13 (final-deploy alignment check)
  - Phase 14 (records update: ISA.md + decision record + MIA_SESSION_REPORT)
  - Phase 15 (final claim-vs-reality + remaining-blockers + rollback + continuation-prompt finalization)
  - Phase 16 (closeout)

active_tmux_session:
  name: mia-cycle41-staging-deploy-20260517-102742
  log: docs/artifacts/cycle-41-homepage-hero-production-recovery/logs/staging-deploy-20260517-102742.log
  check_with: tmux list-sessions | grep mia-cycle41
  exit_marker: grep "EXIT_CODE:" <log>
```

## Resume next commands

```bash
cd /home/torrey/code/mia-sanabria-website

# 1. Check deploy completion
log="$(cat docs/artifacts/cycle-41-homepage-hero-production-recovery/logs/latest-staging-deploy-log.txt)"
grep "EXIT_CODE:" "$log" || echo "still running"
tmux list-sessions 2>/dev/null | grep mia-cycle41 || echo "(ended)"

# 2. If EXIT_CODE:0, proceed to live verification:
mkdir -p docs/artifacts/cycle-41-homepage-hero-production-recovery/live-after/screenshots
bun run scripts/capture-baseline.ts \
  --base=https://miasanabriarealtor.trueidea.com \
  --out=docs/artifacts/cycle-41-homepage-hero-production-recovery/live-after/screenshots \
  --routes='/,/home-search/,/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero' \
  --viewports=320x800,360x800,375x812,390x844,414x896,430x932,768x1024,1024x768,1280x800,1440x1000,1536x864 \
  --concurrency=3 \
  --vtb=18000

bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com
bun run audit:no-old-idx
bun run audit:home-bridge-search -- --base=https://miasanabriarealtor.trueidea.com || true

# 3. Inspect live-after captures with the Read tool at minimum these viewports:
#    home 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1536
#    home-search query 390 and 1280

# 4. Write the remaining artifacts:
#    docs/artifacts/cycle-41-homepage-hero-production-recovery/staging-live-verification-report.md
#    docs/artifacts/cycle-41-homepage-hero-production-recovery/live-hero-visual-qa-report.md
#    docs/artifacts/cycle-41-homepage-hero-production-recovery/homepage-hero-final-report.md
#    docs/artifacts/cycle-41-homepage-hero-production-recovery/bridge-e2e-final-report.md
#    docs/artifacts/cycle-41-homepage-hero-production-recovery/red-team-final-review.md
#    docs/artifacts/cycle-41-homepage-hero-production-recovery/final-deploy-alignment-report.md
#    docs/artifacts/cycle-41-homepage-hero-production-recovery/claim-vs-reality.md
#    (plus update ISA.md, docs/mia-client-decision-record.md, /home/torrey/trueops/session-launcher/reports/MIA_SESSION_REPORT.md)

# 5. Stage + commit the records update + final artifacts, push.
# 6. Check origin/main vs deployed commit. If a docs-only commit lands after
#    deploy, follow the Cycle 40C pattern: either redeploy or leave the
#    alignment-log uncommitted to break the recursion.

# 7. Final-state: HEAD == origin/main == deployed bundle source commit.
```

## Files touched in Cycle 41

```yaml
source:
  - src/app/page.tsx       # eyebrow drop, imagePanelWidth="narrow", spacer trim
  - src/components/Hero.tsx       # panel narrow/light, scrim light, lg leading, imagePanelWidth prop
  - src/components/HeroSearch.tsx # max-w-4xl lg + smaller float + lg:p-5 + lg:gap-3

audit_outputs_regenerated:
  - reports/*  (all)

artifacts_created:
  - docs/artifacts/cycle-41-homepage-hero-production-recovery/  (16+ files)
```

## Validation results at commit time

```yaml
typecheck: PASS
lint: PASS
build: PASS
brand: 12/12 PASS
hero-contrast:stable: 145/145 PASS (homepage 1440 = 13.69:1 glyph, 9.11:1 edge)
rendered: 14 PASS / 1 WARN (pre-existing) / 0 FAIL
home-bridge-search: 8/8 PASS
no-old-idx: PASS (481 files scanned)
no-fabrications: 0 hits
mobile-readability: 84 PASS
neighborhood-images-deep: 23/23 PASS
qa-gate: critical=0, high=4 (legal_review pre-existing), medium=1 (lead_capture pre-existing)
test:home-bridge-e2e (local): 11/11 PASS mode=fallback
secret_scan_pre_commit: clean
```

## Before / after screenshots

```yaml
live-before/screenshots: docs/artifacts/cycle-41-homepage-hero-production-recovery/live-before/screenshots
  count: 33 (3 routes × 11 viewports)
local-after/screenshots: docs/artifacts/cycle-41-homepage-hero-production-recovery/local-after/screenshots
  count: 33 + key-viewport revisits after tablet panel tightening + after audit:rendered regression resolve
live-after/screenshots: pending Phase 11 (post-deploy capture)
```

## Homepage hero status

```yaml
fixed: |
  - eyebrow text "South Florida Lifestyle" removed (was verbatim duplication of H1 line 1)
  - copy panel narrower at sm/lg (max-w-md vs prior max-w-2xl) — homepage only, via opt-in prop
  - copy panel lighter at sm+/lg (bg-navy-900/72 sm, /68 lg) — image breathes through
  - content-scrim lighter (from-/35 via-/10 to-transparent vs prior from-/45 via-/20 to-/10)
  - cta-scrim lighter (h-1/3 from-/55 via-/20 vs prior h-1/2 from-/85 via-/45)
  - floating search card narrower on lg (max-w-4xl vs max-w-7xl)
  - float offset reduced -mt-12 sm:-mt-14 lg:-mt-16 (was -mt-20 sm:-mt-24)
  - search card padding p-4 sm:p-5 lg:p-5 (was p-4 sm:p-5 lg:p-6) + lg:gap-3
  - post-search spacer h-6 sm:h-8 lg:h-10 (was h-16 sm:h-20)
  - lg H1 leading 1.04 (was 1.08); lg H1 size held at 36px (38 bump rolled back due to long-market-H1 regression)
preserved: |
  - locked H1 text "South Florida Lifestyle / Home Search"
  - daytime waterfront hero image asset
  - BridgeSearch wiring (method/action/named selects/hidden source)
  - old-IDX absence
  - mobile geometry (Cycle 40B defensive CSS untouched at mobile base classes)
```

## Bridge mode + E2E

```yaml
local_E2E: 11/11 PASS, mode=fallback
local_audit_home_bridge_search: 8/8 PASS
local_audit_no_old_idx: PASS
live_E2E: pending Phase 11
live_audit_no_old_idx: pending Phase 11
```

## Staging deploy status

```yaml
launched_at: 2026-05-17T14:27:42Z
tmux_session: mia-cycle41-staging-deploy-20260517-102742
log: docs/artifacts/cycle-41-homepage-hero-production-recovery/logs/staging-deploy-20260517-102742.log
exit_code: pending
deployed_commit_equals_origin_main: pending
```

## Blockers

See `docs/artifacts/cycle-41-homepage-hero-production-recovery/remaining-blockers.md` — all genuinely external (production cutover decisions, Mia visual approval, GHL/legal/Bridge credentials).

## Secret-safety status

`secret_scan_clean: true` at commit time. Live HTML scan and out-tree scan pending Phase 11.

## Resume prompt (paste into fresh CLI)

> Continue Cycle 41 — Mia Sanabria homepage hero production recovery. Resume from Phase 10 completion: wait for tmux session `mia-cycle41-staging-deploy-20260517-102742` `EXIT_CODE:` line in `docs/artifacts/cycle-41-homepage-hero-production-recovery/logs/staging-deploy-20260517-102742.log`. On `EXIT_CODE:0`, run Phase 11 live-after capture / live E2E / live audits / inspect screenshots, then Phase 12 red-team final review, Phase 13 final-deploy alignment, Phase 14 records update (ISA.md, docs/mia-client-decision-record.md, /home/torrey/trueops/session-launcher/reports/MIA_SESSION_REPORT.md), Phase 15-16 final artifacts + closeout. Use the Cycle 41 mission brief from the original session as the master plan. Do not touch production DNS, GHL, Google, Bridge credentials. Do not print/log/commit secret values.
