# Cycle 38 — Continuation Prompt

date written: 2026-05-16

> Self-contained brief to resume Cycle 38 (or pivot to the smallest next mission) in a fresh session. Drop into a raw Claude Code CLI session opened in `/home/torrey/code/mia-sanabria-website/`.

## Where Cycle 38 left off

- branch: `main`
- HEAD: `8eaf986` (`feat(MIA-SITE-CYCLE-38): fix live neighborhood images and launch Bridge-wired hero search`)
- origin/main: matches HEAD
- working tree: clean (or only the 3 pre-existing Cycle-35 logs untracked)
- tmux session(s) at handoff: `mia-cycle38-staging-deploy-<TS>` — log path written to `docs/artifacts/cycle-38-live-images-bridge-hero/logs/latest-staging-deploy-log.txt`

## Completed phases

- Phase 0 — Recovery preflight (✅ `resume-preflight.md`).
- Phase 1 — Prior-state review (✅ `prior-state-review.md`).
- Phase 2 — Live reproduction (✅ `live-neighborhood-image-reproduction.md` + `.json`).
- Phase 3 — Neighborhood image regeneration (✅ `neighborhood-image-root-cause.md` + `neighborhood-image-fix-report.md` + `image-manifest.md` + `image-provenance-ledger.md` + `image-generation-log.md`).
- Phase 4-5 — Hero image swap + floating Bridge search (✅ `reference-hero-provenance.md` + `reference-hero-extraction-report.md` + `homepage-hero-implementation-report.md` + `homepage-search-bridge-wiring-report.md`).
- Phase 6 — Bridge referrer-domain retest (✅ `bridge-referrer-domain-retest.md` + `bridge-live-integration-report.md` + `bridge-truthfulness-report.md`).
- Phase 7 — Old IDX reaudit (✅ `old-idx-reaudit-report.md`).
- Phase 8 — Local validation (✅ `local-validation-report.md` + `secret-safety-report.md`).
- Phase 9 — Local visual QA (✅ `visual-qa-local-report.md` + 20 PNGs).
- Phase 10 — Commit + push (✅ `commit-report.md`, commit `8eaf986`).
- Phase 11 — Staging deploy (✅ tmux session started).

## In-flight at handoff

- Phase 11 deploy is running in tmux. Tail the log:
  ```bash
  tail -F "$(cat docs/artifacts/cycle-38-live-images-bridge-hero/logs/latest-staging-deploy-log.txt)"
  ```
  Look for `EXIT_CODE:0` and "verify success" / "South Florida Lifestyle" needle hit.

## Remaining when you resume

- Phase 12 — Live verification on https://miasanabriarealtor.trueidea.com/:
  ```bash
  base="https://miasanabriarealtor.trueidea.com"
  curl -I -L --max-time 20 -H "Cache-Control: no-cache" "${base}/"
  for slug in deerfield-beach hollywood plantation weston coral-springs davie sunrise; do
    curl -I -L --max-time 20 "${base}/markets/${slug}.jpg" | head -3
    curl -I -L --max-time 20 "${base}/markets/${slug}/" | head -3
  done
  bun run audit:no-old-idx
  bun run audit:neighborhood-images-deep -- --base="${base}"
  bun run audit:home-bridge-search -- --base="${base}"
  bun run scripts/probe-live-neighborhood-images.ts --base="${base}"
  ```
- Phase 12 staging screenshots:
  ```bash
  mkdir -p docs/artifacts/cycle-38-live-images-bridge-hero/visual-qa/staging
  bun run scripts/capture-baseline.ts \
    --base=https://miasanabriarealtor.trueidea.com \
    --out=docs/artifacts/cycle-38-live-images-bridge-hero/visual-qa/staging \
    --viewports=375x812,768x1024,1280x800,1440x1000 \
    --concurrency=3 --vtb=12000
  ```
- Phase 12 final reports: fill in `staging-deploy-report.md`, `staging-live-verification-report.md`, `visual-qa-staging-report.md`, `neighborhood-image-staging-final-report.md`, `homepage-hero-staging-final-report.md`, `bridge-staging-final-report.md`.
- Phase 13-14 — Update decision record + ISA + MIA session report.
- Phase 13 — Final alignment deploy if docs commit lands after the first deploy.
- Phase 15-17 — `claim-vs-reality.md`, `final-deploy-alignment-report.md` (already-stub if needed), final cleanup.

## Changed source files in this commit

- `src/app/page.tsx`
- `src/components/HeroSearch.tsx`
- `src/components/bridge/BridgeSearch.tsx`
- `package.json` (new `audit:home-bridge-search` script)
- `scripts/audit-home-bridge-search.ts` (new)
- `scripts/generate-neighborhood-images-v2.ts` (new)
- `scripts/probe-live-neighborhood-images.ts` (new)
- 14 image assets under `public/markets/` and `public/og-markets/` (7 slugs each)
- 2 image assets under `public/hero/` (new)
- 8 audit-report JSON/MD pairs under `reports/`
- 23 artifact docs under `docs/artifacts/cycle-38-live-images-bridge-hero/`

## Validation results (all PASS at commit time)

typecheck, lint, build, audit:brand, audit:hero-contrast:stable (145/0), audit:route-inventory, audit:no-fabrications, audit:no-old-idx, audit:neighborhood-images-deep (23/23), audit:home-bridge-search (8/8), audit:mobile-readability (84/0), audit:qa-gate (critical=0).

## Live image reproduction summary

operator_report_reproduced: yes (visual content defect on 7 slugs, primarily Hollywood + Davie framed-canvas with white margins). Root cause = Cycle-37 Gemini prompt asked for "painterly luxury aesthetic, illustrative not photo-real" and several outputs were framed paintings on white walls. Fix = re-prompt with explicit photorealism + no-frame ban + perimeter-whiteness validator.

## Bridge mode classification (pending post-deploy)

Will be one of: `live_verified` | `demo_honest` | `error` | `mode_mismatch`. Classification logged in `bridge-staging-final-report.md` after Phase 12.

## Secret safety

`token_values_printed_this_session: false`. `credential_values_changed: false`. `api_key_refresh_touched: false`. All scans returned 0 hits.

## Smallest next mission

After Cycle 38 closes:
- One bounded mission to activate Bridge live mode (requires operator Dokploy build-arg changes). Then verify against staging.
- Production cutover (DNS, GHL, branded email) is a separate, larger, operator-led mission.

## Resume prompt (paste into a fresh Claude Code CLI session)

> Resume Cycle 38 mission for the Mia Sanabria website (`/home/torrey/code/mia-sanabria-website`).
> Current head: `8eaf986`. Branch: `main`. A tmux staging deploy named
> `mia-cycle38-staging-deploy-<TS>` was running at handoff; its log is at
> `docs/artifacts/cycle-38-live-images-bridge-hero/logs/latest-staging-deploy-log.txt`.
> The mission brief and all completed-phase artifacts live under
> `docs/artifacts/cycle-38-live-images-bridge-hero/`. Pick up at Phase 12 (live
> verification on https://miasanabriarealtor.trueidea.com/) and complete
> Phases 12-17 per the original brief. Do not change production. Do not rotate
> any credentials. Do not flip Bridge demo flag without explicit operator approval.
