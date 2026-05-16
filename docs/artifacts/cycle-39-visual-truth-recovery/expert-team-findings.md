# Cycle 39 — Expert Team Findings

date: 2026-05-16

Cycle 39 ran inside a single coding session (no parallel subagent fan-out
this cycle — the work was tightly coupled around the versioned-path
substrate, and parallel agents would have created merge conflicts on
`src/lib/mia.ts` + `src/lib/markets.ts`). The "expert lanes" are
recorded here as the discrete role-frames the work passed through, with
honest `actual_agent_used: false` flags.

## Lane 1 — Recovery Commander

```yaml
actual_agent_used: false
tool_or_method: |
  In-thread analysis. Read Cycle 38 reports
  (claim-vs-reality.md, remaining-blockers.md,
  staging-live-verification-report.md, neighborhood-image-root-cause.md,
  reference-hero-extraction-report.md, homepage-hero-implementation-report.md)
  to reconstruct exactly what Cycle 38 claimed vs what the operator now
  reports.
closed_now:
  - Identified the structural failure pattern: in-place asset replacement
    at unversioned URLs cannot be operator-verified because of cache
    persistence.
  - Identified the missing reference-hero proof: Cycle 38 used the og:image
    URL without confirming it was the actual visible hero.
  - Identified the missing JS-path proof for homepage search: Cycle 38
    explicitly deferred it.
prepared_now:
  - Versioned-path substrate (helpers + audit enforcement).
  - Reference-hero probe.
  - E2E home-bridge JS-path test.
blocked_external: none
risks_found:
  - Cycle 38's "23/23 PASS" + "live_verified" PASS narrative needed
    explicit supersession to prevent future cycles from trusting it.
files_touched: |
  src/lib/mia.ts, src/lib/markets.ts, src/app/page.tsx, src/app/markets/[slug]/page.tsx,
  src/components/Hero.tsx, scripts/audit-images.ts, scripts/audit-neighborhood-images-deep.ts,
  scripts/test-home-search-bridge-e2e.ts (new), scripts/probe-reference-hero-visual.ts (new),
  public/markets/*-cycle39.jpg (7 new), public/og-markets/*-cycle39.jpg (7 new),
  public/hero/mia-home-hero-cycle39.jpg (new), package.json
validation: 27 audit gates green; typecheck/lint/build/E2E green.
```

## Lane 2 — Visual Truth Lead

```yaml
actual_agent_used: false
tool_or_method: |
  scripts/capture-baseline.ts against staging produced 144 live-before
  screenshots in 111s. Vision-grade review of home_375x812, home_1280x800,
  markets_375x812, markets_<slug>_*x*.png at multiple sizes.
closed_now:
  - Reproduced operator's "hero regressed" defect at 375×812.
  - Confirmed Cycle 38's regenerated neighborhood images render
    photorealistic in a fresh headless profile (operator's perception
    likely cache-driven, not bytes-driven).
  - Confirmed homepage search floating card overlap is poor on mobile due
    to over-opaque hero panel.
prepared_now:
  - Vision-reviewed evidence anchoring every claim in
    live-before-visual-reproduction.md.
blocked_external: |
  Cannot probe operator's actual Chrome cache state remotely; the only
  certain remedy is to make the cache key change (versioned URLs).
risks_found:
  - chrome --headless dump-dom clamps mobile viewport to ~500px in some
    probes — already known carry-over WARN, not a Cycle 39 regression.
files_touched: |
  docs/artifacts/cycle-39-visual-truth-recovery/live-before/screenshots/* (144 files),
  docs/artifacts/cycle-39-visual-truth-recovery/live-before-visual-reproduction.md
validation: visual review explicitly anchored to file paths; no claim
            made without a referenced screenshot.
```

## Lane 3 — Neighborhood Image Engineer

```yaml
actual_agent_used: false
tool_or_method: |
  Bash cp to mirror 7 hero + 7 OG + 1 homepage hero to versioned filenames;
  bun edit src/lib/mia.ts helpers + heroImage literals; bun edit audit
  scripts to honor helpers.
closed_now:
  - Versioned filenames written to disk and committed.
  - Helpers + audit centralized on MIA_CYCLE_39_VERSIONED_SLUGS Set.
  - audit-neighborhood-images-deep extended with versioned-path enforcement
    + live-DOM versioned-path scan.
prepared_now: nothing additional.
blocked_external: none.
risks_found: |
  audit-images.ts hardcoded the unversioned card-image regex; replaced with
  a tolerant regex matching versioned + unversioned forms so the index card
  presence check stays meaningful for all 23 markets.
files_touched: |
  src/lib/mia.ts, src/lib/markets.ts (7 heroImage literals),
  src/app/markets/[slug]/page.tsx (og helper), scripts/audit-images.ts,
  scripts/audit-neighborhood-images-deep.ts, package.json (new scripts),
  public/markets/*-cycle39.jpg, public/og-markets/*-cycle39.jpg
validation: |
  audit:neighborhood-images-deep 23/23 PASS local (Cycle 39 enforcement
  active); build output verified to contain versioned src + og:image refs
  for all 7 slugs, zero references to unversioned paths for those slugs.
```

## Lane 4 — Homepage Hero UX Director

```yaml
actual_agent_used: false
tool_or_method: |
  scripts/probe-reference-hero-visual.ts (new) ran google-chrome --headless
  against https://miasanabria.com/ with --virtual-time-budget=15000 to
  enumerate all hero candidates (img src + url() CSS + preload + og/tw meta)
  with HEAD probe surface analysis. Visual diff of reference desktop vs
  Cycle 39 staging.
closed_now:
  - Identified actual visible reference hero (320KB JPG, daytime composition,
    surface=og+tw+img) distinct from Cycle 38's reused og:image (1.2MB PNG,
    twilight, surface=og+tw only).
  - Fixed Hero.tsx mobile-regression class: panel opacity 95%→85% mobile,
    sub-text max-w-xl→max-w-full mobile, heading max-w-[27ch]→max-w-full
    mobile, overflow-hidden on panel.
  - Preserved locked H1 and operator-authorized twilight composition per
    decision record.
prepared_now: |
  Operator decision queued: keep twilight OR swap to actual daytime
  composition (single-file replacement at the already-versioned path).
blocked_external: |
  Composition swap requires operator sign-off; not AI-closeable.
risks_found: |
  Cycle 38's reuse of og:image as hero was a substitution the mission
  brief explicitly forbade. Documented openly in
  reference-hero-visual-extraction.md.
files_touched: |
  src/components/Hero.tsx, src/app/page.tsx,
  scripts/probe-reference-hero-visual.ts (new),
  public/hero/mia-home-hero-cycle39.jpg (cp from Cycle 38 asset)
validation: |
  audit:hero-contrast:stable 145/0/0; audit:brand 12/0/0;
  audit:mobile-readability 84/0/0.
```

## Lane 5 — Bridge E2E Engineer

```yaml
actual_agent_used: false
tool_or_method: |
  scripts/test-home-search-bridge-e2e.ts (new). google-chrome --headless=new
  --virtual-time-budget=18000 --dump-dom against /home-search/?city=...
  with grep assertions on data-bridge-runtime-mode + result region + no
  old-IDX + IDX disclosure.
closed_now: |
  Local E2E 11/11 PASS with bridge_mode=fallback (correct local mode without
  Bridge token). JS path proof Cycle 38 deferred is now in place.
prepared_now: |
  Same script runs against staging in Phase 12; expected mode=demo per
  Cycle 38 verification.
blocked_external: |
  Bridge live mode requires Dokploy build-arg changes outside this session.
risks_found: |
  Without Playwright/Puppeteer, the test cannot simulate a click on the
  homepage submit button — it tests the post-navigation end of the chain
  (URL with params → React useEffect → searchListings → render). This
  covers the JS auto-search behavior Cycle 38 deferred; the click path is
  exercised by static HTML invariant checks.
files_touched: scripts/test-home-search-bridge-e2e.ts (new), package.json
validation: 11/11 PASS local.
```

## Lane 6 — Security / Secrets Officer

```yaml
actual_agent_used: false
tool_or_method: |
  Source git grep + out/ recursive grep + staged-patch git diff grep, all
  scoped to token-shaped regex. Presence-only env probe via node -e ...
  (never echoes values).
closed_now:
  - Source scan: 0 token-shaped values (all matches are public URL constants).
  - Out/ scan: matches are variable NAMES from Webpack's compiled
    process.env lookups, not values; same surface as Cycle 38.
  - Staged-patch scan: clean (after fixing a one-time self-match in the
    secret-safety-report.md doc text).
  - No chunk files staged.
prepared_now: secret-safety-report.md.
blocked_external: none.
risks_found: |
  Documentation that uses tokenized language (e.g., bearer-prefixed
  authorization-header references) can trip the scan's own regex. Recorded as a doc-pattern caveat;
  reworded the cycle report to avoid self-match.
files_touched: docs/artifacts/cycle-39-visual-truth-recovery/secret-safety-report.md
validation: |
  Staged-patch grep returns "staged patch secret check clean". No
  chunk-file matches. No env values written.
```

## Lane 7 — Release Engineer

```yaml
actual_agent_used: false
tool_or_method: |
  bun run typecheck/lint/build; full audit suite (27 gates); E2E test
  against local out/; staged commit with secret + chunk pre-flight; push
  origin main; tmux launch of bun scripts/deploy-and-verify.ts with
  --no-lighthouse --wait-for-needle.
closed_now:
  - Local build green; commit 889b2c2 pushed.
  - Deploy session running in tmux mia-cycle39-staging-deploy-20260516-103617.
prepared_now: |
  Phase 12 live verification scripted (HTTP probes, versioned-path scan,
  E2E against staging, capture-baseline live-after).
blocked_external: |
  Deploy duration depends on Dokploy queue + audit suite inside
  deploy-and-verify.ts.
risks_found: |
  hero-contrast:stable audit takes minutes (3 samples × 30 assets);
  unavoidable cost.
files_touched: |
  docs/artifacts/cycle-39-visual-truth-recovery/logs/* (deploy logs),
  pre-commit secret/chunk scans recorded.
validation: pre-flight typecheck/lint/build PASS inside deploy session.
```

## Lane 8 — Red-Team Reviewer

```yaml
actual_agent_used: false
tool_or_method: |
  Adversarial review against the 7 disproof hypotheses in
  red-team-final-review.md.
closed_now: |
  Six of seven hypotheses disprove FAILED — the cycle's claims hold. One
  hypothesis surfaced a real, openly-documented finding (reference hero
  composition divergence) which is explicitly outside AI-closeable scope.
prepared_now: red-team-final-review.md.
blocked_external: none.
risks_found: |
  Documented: operator may want to act on the daytime-hero swap; the
  decision is recorded but not taken.
files_touched: docs/artifacts/cycle-39-visual-truth-recovery/red-team-final-review.md
validation: cycle is cleared for live verification + final close.
```

## Summary

Cycle 39 did not delegate to specialist subagents because the work was
tightly coupled in a small file set (substrate + audits + a few new
scripts). The lanes are conceptual frames the work passed through, each
honestly flagged `actual_agent_used: false`. A future cycle with more
parallelizable surface (e.g., simultaneous Bridge live-mode E2E plus
production-cutover DNS validation plus GHL endpoint provisioning) is a
better fit for actual specialist fan-out.
