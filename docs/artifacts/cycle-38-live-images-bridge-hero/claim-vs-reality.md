# Cycle 38 — Claim vs Reality

date: 2026-05-16

A focused, AI-honest scorecard against the mission brief's hard completion standard.

## Brief's hard completion standard (verbatim items) and Cycle 38 reality

| # | Mission requirement | Cycle 38 status |
|---|----------------------|------------------|
| 1 | Seven named neighborhood cards show visible images on `/markets/` live | code+assets+audit green locally; live verification pending Phase 12 |
| 2 | Each of the seven detail pages shows a visible hero image live | code+assets+audit green locally; live verification pending Phase 12 |
| 3 | Each relevant image URL returns HTTP 200 live | already 200 at Cycle 37; expected to remain 200 with new content after deploy |
| 4 | Each rendered image has `naturalWidth > 0` in Playwright live DOM | local DOM already confirmed; live DOM probe pending Phase 12 |
| 5 | Each relevant image asset is tracked in git, committed, pushed, and deployed | committed in `8eaf986`, pushed to origin/main, deploy in flight |
| 6 | Homepage hero image matches the current miasanabria.com hero image OR is documented as blocked only if extraction/reuse truly fails | matches — operator-authorized reuse of the twilight waterfront composition; provenance recorded |
| 7 | Homepage hero search floats visually on the hero image on mobile/tablet/desktop | implemented; local visual QA at 1280×900 + 375×812 confirms; `audit:mobile-readability` PASS on iPhone/iPad |
| 8 | Homepage search submits/passes filters to Bridge home-search and/or triggers Bridge search state correctly | form action `/home-search/`, hidden `source=home-hero`, `name=city/minPrice/beds`, BridgeSearch reads params + auto-runs search |
| 9 | Bridge current live/demo/fallback mode is objectively classified | local code preserved; staging classification pending Phase 12 |
| 10 | If live Bridge feed is proven, demo UI is removed/suppressed only in live mode | unchanged — demo UI only suppressed when `mode === "live"`. If live is not proven, demo UI remains |
| 11 | If live Bridge feed is not proven, demo UI remains clear and honest | unchanged — demo banner condition is OR-joined with `BRIDGE_DEMO_MODE` |
| 12 | Old IDX/MLS Matrix runtime remains absent from source, built output, and live staging HTML | `audit:no-old-idx` PASS over 480 files; live HTML scan pending Phase 12 |
| 13 | All relevant validation gates pass | 11 of 11 audit gates green pre-commit |
| 14 | Staging deploy completes in tmux/logged mode | tmux session active; log path persisted; EXIT_CODE pending |
| 15 | Final live verification confirms current commit visible on `https://miasanabriarealtor.trueidea.com/` | pending Phase 12 — fields scoped in `staging-live-verification-report.md` |
| 16 | No secrets are printed, committed, logged, or exposed | confirmed at commit time; `secret-safety-report.md` records 0 hits across 4 scan surfaces |
| 17 | No production systems are changed | confirmed — only `miasanabriarealtor.trueidea.com` is targeted; DNS/GHL/Google/Bridge-prod untouched |

## What Cycle 38 closed fully (AI-closeable)

- 7-image regeneration with hardened photorealism prompts and perimeter-whiteness validator (root-caused the Cycle-37 framed-canvas defect class).
- Homepage hero swapped to operator-authorized miasanabria.com composition.
- Floating Bridge-wired search card matching production miasanabria.com pattern.
- BridgeSearch URL-param prefill + auto-search.
- New `audit:home-bridge-search`.
- New `scripts/generate-neighborhood-images-v2.ts` and `scripts/probe-live-neighborhood-images.ts`.
- 11 audit gates green.
- Commit + push to origin/main.

## What is in flight (will close at Phase 12 post-deploy)

- Live verification of all 7 images at staging.
- Live verification of the homepage hero + floating search.
- Bridge mode classification on staging.
- Staging visual QA screenshots.
- Final deploy alignment if a post-deploy docs commit lands.

## What remains externally blocked

- Bridge live mode activation (operator Dokploy build-arg changes).
- Production cutover (DNS, GHL, branded email).
- Mia's visual approval.

## Honesty notes

- Cycle 37 reported "23/23 deep image audit PASS" and "staging live verified" while the operator-visible defect persisted. Cycle 38 supersedes those claims with `live-neighborhood-image-reproduction.md` + `neighborhood-image-root-cause.md`.
- The fix is the generation-boundary validator, not the audit-boundary validator. Hardening the audit is queued as a follow-up.
- The hero asset is operator-directed reuse, not an independent license claim.
- Cycle 38 makes **no** claim about Bridge live mode until Phase 12 staging probe runs.
