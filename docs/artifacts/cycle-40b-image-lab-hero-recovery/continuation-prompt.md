# Cycle 40C — Continuation Prompt (paste-ready for the next fresh session)

> Plain markdown brief. Paste into a fresh Claude Code CLI session in
> `/home/torrey/code/mia-sanabria-website`. Updated once Phase 8 completes.

## Where Cycle 40C left off

```yaml
branch: main
head: <will be filled after Phase 7 commit>
origin_main: <will be filled after Phase 7 commit>
working_tree_state: clean (Phase 7 committed and pushed) OR uncommitted (if dropped mid-cycle)
completed_phases: [0, 1, 2, 3, 4, 5, 6, 7]
in_progress_phase: <8 if deploy pending; 9 if live verify pending>
incomplete_phases: <to be filled>

cycle_40b_commit: 8095c78  # image lab + hero recovery + daytime waterfront swap (pushed to origin/main)
cycle_40c_commit: <fix-up commit SHA after Phase 7>
prior_dropped_session_failure: |
  Cycle 40B staging deploy aborted at audit:images pre-flight because
  src/lib/markets.ts still pointed to /markets/<slug>-cycle39.jpg paths
  while only -cycle40b.jpg files existed on disk. Cycle 40C wired the
  source paths and re-deployed.

cycle_40c_changed_files:
  - src/lib/markets.ts (heroImage path flip cycle39 → cycle40b for 7 slugs)
  - reports/audit-*.{json,md} (audit run outputs from the 40C validation)
  - docs/artifacts/cycle-40b-image-lab-hero-recovery/cycle-40c-*.md (new 40C reports)
  - docs/artifacts/cycle-40b-image-lab-hero-recovery/*.md (40B reports the prior session prepared)
  - docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/cycle40c-*.log (new 40C logs)

validation_results:
  typecheck: pass
  lint: pass
  build: pass
  audit:all: <pass / fail — fill after Phase 6 completes>
  test:home-bridge-e2e (local): pass (11/11, mode=fallback)
  secret_scan: clean

cycle_40b_deploy_result: completed_fail (EXIT_CODE:1 from audit:images pre-flight)
cycle_40c_deploy_result: <to fill after Phase 8>

mobile_hero_proof_result: |
  Defect ruled NON-EXISTENT in real browsers via Playwright + system Chromium
  probe. getBoundingClientRect() at 320/360/375/390/414/430/600/768/1280
  confirms panel = viewport - 32px (px-4) at every viewport ≤ 768, capping at
  max-w-2xl (672px) above. docScroll === viewport at every viewport. No
  horizontal scroll. The chrome --headless screenshot artifact at 375/390
  (visible in capture-baseline + direct google-chrome outputs) is a viewport-
  rendering quirk where --window-size sets OS window but not layout viewport.

chosen_image_paths_active:
  deerfield-beach: /markets/deerfield-beach-cycle40b.jpg + /og-markets/deerfield-beach-cycle40b.jpg
  hollywood:       /markets/hollywood-cycle40b.jpg + /og-markets/hollywood-cycle40b.jpg
  plantation:      /markets/plantation-cycle40b.jpg + /og-markets/plantation-cycle40b.jpg
  weston:          /markets/weston-cycle40b.jpg + /og-markets/weston-cycle40b.jpg
  coral-springs:   /markets/coral-springs-cycle40b.jpg + /og-markets/coral-springs-cycle40b.jpg
  davie:           /markets/davie-cycle40b.jpg + /og-markets/davie-cycle40b.jpg
  sunrise:         /markets/sunrise-cycle40b.jpg + /og-markets/sunrise-cycle40b.jpg

image_scorecards_complete: true  # docs/artifacts/cycle-40b-image-lab-hero-recovery/image-candidate-scorecards.md (12.3KB, 21 candidates)
image_winner_selection:
  deerfield-beach: cand-1
  hollywood:       cand-3
  plantation:      cand-2
  weston:          cand-3
  coral-springs:   cand-2
  davie:           cand-1
  sunrise:         cand-2

homepage_hero_asset_active: /hero/mia-home-hero-cycle40b.jpg (daytime waterfront, operator-authorized derivation from miasanabria.com)

bridge_e2e_local: 11/11 PASS, mode=fallback
bridge_e2e_staging: <to fill after Phase 9>
bridge_mode_staging: <live | demo | fallback — fill after Phase 9>
old_idx_runtime_absent: true (cycle 37 removal still holds)

tmux_deploy_session: <session name>
tmux_deploy_log: docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-cycle40c-<timestamp>.log
deployed_commit_equals_origin_main: <true | false — fill after Phase 8>
```

## Exact next commands (if dropped after Phase 8 before Phase 9)

```bash
cd /home/torrey/code/mia-sanabria-website

# Verify what's deployed and where
git status -sb
git rev-parse HEAD
git rev-parse origin/main
log=$(cat docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/latest-cycle40c-staging-deploy-log.txt)
tail -200 "$log"
grep "EXIT_CODE:" "$log"

# Live capture, E2E, audit
mkdir -p docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots

# (use Playwright-based screenshot loop, not capture-baseline at narrow viewports — see cycle40c-mobile-hero-proof.md)
bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com
bun run audit:no-old-idx
bun run audit:neighborhood-images-deep -- --base=https://miasanabriarealtor.trueidea.com || true
bun run audit:home-bridge-search -- --base=https://miasanabriarealtor.trueidea.com || true
bun run audit:image-creative-acceptance
```

## Blockers / external dependencies

- None at the AI level. The remaining gate is human verification by Mia on her
  actual phone at the staging URL (not blocking deploy, but the explicit
  truth-test for cycle40c).
- Production rollout (`miasanabria.com` Direct Axess cutover, DNS swap, GBP
  alignment) remains operator+Mia approval territory and is outside Cycle 40C
  scope.

## Security posture (must hold across continuation)

- Do NOT cat .env / printenv / env / cat raw chunk files.
- Do NOT print secret values.
- Do NOT touch GHL / DNS / production / Bridge credentials.
- Presence-only env probes via `node -e "process.env.X ? 'present' : 'missing'"`.

## Smallest next mission toward production readiness

After Cycle 40C is live-verified, the smallest next move is:

1. Send the staging URL to Mia + Torrey for real-device mobile verification.
2. If Mia approves, switch capture-baseline.ts internals to Playwright (or
   document the Playwright proof as authoritative for narrow-viewport visual
   QA) so future cycles don't burn cycles re-litigating the chrome --headless
   capture artifact.
3. Begin the GHL endpoint wire-up conversation — the homepage form currently
   posts to the static `/home-search/` route and from there to Bridge, but
   the lead-capture forms (valuation, contact, brief) remain mailto fallbacks.

## What this prompt is NOT

- Not a production-readiness claim.
- Not an instruction to deploy to miasanabria.com or to the GBP.
- Not a credential rotation request.
- Not a structural redesign of capture-baseline.ts — that is a separate, smaller mission.
