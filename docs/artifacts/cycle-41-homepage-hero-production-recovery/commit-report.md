---
cycle: 41
artifact: commit-report
generated_at: 2026-05-17
---

# Cycle 41 — Commit Report

```yaml
commit_sha: e63a35eb10bb1ebd565ef29767c4bf5f10213648
short_sha: e63a35e
branch: main
parent: 9a6ab53 (Cycle 40C final alignment-deploy log + ETag flip)
push_to_origin: pushed
origin_main_post_push: e63a35e
head_equals_origin_main_post_push: true

files_changed:
  source_code:
    - src/app/page.tsx
    - src/components/Hero.tsx
    - src/components/HeroSearch.tsx
  audit_outputs_regenerated:
    - reports/audit-about.{json,md}
    - reports/audit-brand-consistency.{json,md}
    - reports/audit-completeness.{json,md}
    - reports/audit-featured-markets.{json,md}
    - reports/audit-fort-lauderdale-standard.{json,md}
    - reports/audit-hero-pixel-contrast.{json,md}
    - reports/audit-images.{json,md}
    - reports/audit-insights.{json,md}
    - reports/audit-legal.{json,md}
    - reports/audit-mobile-readability.{json,md}
    - reports/audit-neighborhood-images-deep.{json,md}
    - reports/audit-no-old-idx.{json,md}
    - reports/audit-rendered-visual.{json,md}
    - reports/qa-gate-matrix.{json,md}
  cycle_41_artifacts:
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/resume-preflight.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/goal-stack.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/prior-state-review.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/live-before-hero-critique.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/hero-creative-brief.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/hero-implementation-report.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/local-hero-visual-qa-report.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/homepage-search-bridge-e2e-report.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/local-validation-report.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/secret-safety-report.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/red-team-precommit-review.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/expert-team-findings.md
    - docs/artifacts/cycle-41-homepage-hero-production-recovery/logs/*.log

files_not_staged:
  - docs/artifacts/cycle-41-homepage-hero-production-recovery/live-before/screenshots/*.png
  - docs/artifacts/cycle-41-homepage-hero-production-recovery/local-after/screenshots/*.png
  - docs/artifacts/cycle-41-homepage-hero-production-recovery/logs/*.pid
  reason: |
    docs/artifacts/**/*.png is gitignored (regenerable via capture-baseline);
    *.pid is ephemeral process state.

secret_scan_pre_commit: clean
prohibited_raw_chunks_staged: false
```

## Commit message summary

`feat(MIA-SITE-CYCLE-41): productionize homepage hero and Bridge search layout`

Full body documents:

- the 4 operator-flagged felt-quality defects;
- the 6 layout / opacity / max-width changes;
- the locked H1 + BridgeSearch wiring + old-IDX absence preservation;
- 8 local gate results (all PASS);
- the regression-and-resolve note about audit:rendered.primaryCtaAboveFoldDesktop and the new `imagePanelWidth?: "default" | "narrow"` opt-in;
- the artifact list under `docs/artifacts/cycle-41-homepage-hero-production-recovery/`;
- the live-after / deploy artifacts still to be filed after Phase 10.
