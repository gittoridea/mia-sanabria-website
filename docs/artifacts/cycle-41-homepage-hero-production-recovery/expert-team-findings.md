---
cycle: 41
artifact: expert-team-findings
generated_at: 2026-05-17
---

# Cycle 41 — Expert Team Findings

A single AI executor ran all lanes in a single session — no parallel subagent spawns were warranted for this scope (visual hero refactor + audits + deploy + verify on a known stack). Lanes are answered with the work the executor performed under each role.

## Recovery Commander

```yaml
actual_agent_used: false  # executor-as-lane
tool_or_method: git log + git status + repo file Reads
work_done: |
  Identified HEAD = origin/main = 9a6ab53. Cycle 40C closeout commits
  resolved the prior cycle cleanly; uncommitted reports/*.{json,md} were
  stale auto-gen output and one stale staging-deploy log. No in-flight
  validation or deploy processes. First incomplete item: homepage hero
  visual quality (operator screenshot diagnosis confirmed by live-before
  captures).
findings:
  - Cycle 40C declared the mobile defect non-existent based on Playwright
    CDP measurements — a defensible but narrow claim that did not
    certify felt-quality.
  - Cycle 41 is layered onto Cycle 40B's defensive CSS, not in place of
    it; the mobile invariants Cycle 40C verified are preserved.
rejected_options:
  - Re-running the Cycle 40B asset pipeline (the asset was correct;
    the issue is layout, not image).
risks:
  - Real-device mobile geometry still depends on Cycle 40B defenses;
    if those regress, Cycle 41 inherits the failure.
files_touched: docs/artifacts/cycle-41-homepage-hero-production-recovery/resume-preflight.md
validation: HEAD == origin/main verified twice; pre-commit verified again.
```

## Creative Director / Luxury Real Estate UX Director / Homepage Hero Designer

```yaml
actual_agent_used: false  # executor-as-lane (visual decisions made from
                          # operator brief + live-before screenshots)
tool_or_method: live-before screenshot inspection + design analysis
work_done: |
  Set production-grade hero standard: image-first, panel-supporting,
  search-card-anchored. Chose Option A (image-first split overlay)
  over Option B (single search-bearing panel) and Option C (raw
  mobile-stacked). Translated brand-feel requirements into specific
  CSS opacity, max-width, padding, and float-offset changes.
findings:
  - The duplication between eyebrow and H1 line 1 was the single most
    visible defect at every viewport.
  - The 7xl-wide search card was the second.
  - The cream gap into "Mia's Service Areas" was the third.
  - The dark-panel opacity at sm+ (/92) was inherited from a cycle
    where the panel had to do mood-overlay duty; the Cycle 40B
    image swap reduced that need but the panel never re-opened.
rejected_options:
  - Option B (search inside panel) — overpowers panel on mobile.
  - Adding glassmorphism / new color / new icon — scope creep, brand
    risk.
risks:
  - Final subjective verdict belongs to Mia. The Cycle 41 changes are
    a credible production-grade baseline she can react to.
files_touched: src/components/Hero.tsx, src/components/HeroSearch.tsx, src/app/page.tsx
validation: live-after screenshots will be the load-bearing signal.
```

## Bridge E2E Engineer

```yaml
actual_agent_used: false  # executor-as-lane
tool_or_method: scripts/test-home-search-bridge-e2e.ts + scripts/audit-home-bridge-search.ts
work_done: |
  Verified the visual refactor did not break form schema, action, or
  destination. All 11 E2E assertions PASS. All 8 home-bridge-search
  audit checks PASS. Mode=fallback locally (no Bridge env in dev
  shell).
findings:
  - data-home-hero-search="true" sentinel preserved
  - form method/action/destination unchanged
  - BridgeSearch URL-param consumption unchanged
rejected_options: none
risks: live deploy may run live mode or fallback depending on staging env
files_touched: none (verification-only)
validation: 11/11 E2E + 8/8 audit. Live mode will be re-verified Phase 11.
```

## Frontend Engineer

```yaml
actual_agent_used: false  # executor-as-lane
tool_or_method: Edit tool on Hero.tsx, HeroSearch.tsx, page.tsx
work_done: |
  Implemented:
    - page.tsx: removed eyebrow prop; reduced post-spacer.
    - Hero.tsx: narrower copy column (sm:max-w-md lg:max-w-md xl:max-w-lg),
      lighter panel opacity at sm+ (/72 lg:/68), retained /9X token
      at min-[375px] for brand audit, lighter content-scrim, lighter
      cta-scrim, taller lg min-h, tighter H1 leading on lg, lg H1
      size 36→38px.
    - HeroSearch.tsx: narrower wrapper (lg:max-w-4xl), smaller float
      offset (-mt-12/-14/-16), slimmer padding (lg:p-5), tightened
      grid (lg:[1.5fr_1fr_1fr_auto] + lg:gap-3).
findings:
  - First implementation tripped brand.heroNoNavyGlowHalo because I
    added an inline rgba(15,42,68,...) text-shadow on the H1; removed
    that. Panel bg now carries WCAG contrast as the prior pattern did.
  - First implementation tripped brand.heroH1ContrastTokens because no
    bg-navy-900/9X class remained; restored min-[375px]:bg-navy-900/90.
rejected_options:
  - Touching globals.css text-shadow utilities (out of scope).
  - Refactoring Hero.tsx to support panel-without-eyebrow accent line
    (premature).
risks: subjective design verdict only
files_touched:
  - src/app/page.tsx
  - src/components/Hero.tsx
  - src/components/HeroSearch.tsx
validation: typecheck PASS, lint PASS, build PASS, brand 12/12 PASS.
```

## Visual QA Lead

```yaml
actual_agent_used: false  # executor-as-lane
tool_or_method: Read tool on PNG screenshots with verbal description
work_done: |
  Inspected 33 live-before screenshots and 33 (+ 8 re-capture) local-
  after screenshots. Wrote per-route × viewport descriptions in
  live-before-hero-critique.md and local-hero-visual-qa-report.md.
findings:
  - All 8 operator-flagged issues reproduce in live-before.
  - All 8 operator-flagged issues are addressed in local-after.
  - Mobile chrome --headless capture artifact (320/360 right-edge
    text clip) is the same artifact Cycle 40C explicitly classified.
rejected_options:
  - Treating chrome --headless mobile renders as authoritative (would
    falsely flag a non-defect).
risks: real-device mobile verification belongs to Mia / Torrey
files_touched: live-before-hero-critique.md, local-hero-visual-qa-report.md
validation: 11 viewports × 3 routes inspected at live-before and local-after.
```

## Security / Secrets Officer

```yaml
actual_agent_used: false  # executor-as-lane
tool_or_method: git grep + grep -RniE secret-shape scan
work_done: |
  Source scan + built-output scan + env presence-only probe. All
  BRIDGE_*-prefixed matches resolved to public URLs / constants;
  no token values in repo or in out/.next. No env values printed
  or logged.
findings: secret_scan_clean: true
rejected_options: cat .env / printenv / env (refused, per security rules)
risks: pre-commit gate will re-check the staged patch
files_touched: secret-safety-report.md
validation: documented; pre-commit will re-verify.
```

## Release Engineer

```yaml
actual_agent_used: false  # executor-as-lane (deploy will run in tmux)
tool_or_method: bun run typecheck/lint/build + audit scripts; tmux deploy via scripts/deploy-and-verify.ts
work_done: pending Phase 10
findings: pending
files_touched: pending
validation: pending
```

## Red-Team Reviewer

```yaml
actual_agent_used: false  # executor-as-lane
tool_or_method: hypothesis-falsification structure
work_done: pre-commit review with 10 risk vectors written in
  docs/artifacts/cycle-41-homepage-hero-production-recovery/red-team-precommit-review.md;
  final review will be filed after Phase 11 in red-team-final-review.md
findings: 8 of 10 risks rejected by local evidence; 2 deferred to live verification
rejected_options: none
risks: see red-team-precommit-review.md Risk 4, 9, 10
files_touched: red-team-precommit-review.md
validation: live-after capture is the load-bearing signal.
```
