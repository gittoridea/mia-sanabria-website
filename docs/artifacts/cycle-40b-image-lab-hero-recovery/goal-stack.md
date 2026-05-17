# Cycle 40B — Goal Stack

> Claude Code goals model. Use this to keep the plot during long multi-phase work.

```yaml
north_star_goal:
  Produce a dev staging site Mia can review confidently, with a production-grade
  homepage hero and seven production-grade neighborhood images.

outcome_goals:
  - homepage hero fixed across mobile (375/390/430), tablet (768), desktop (1280/1440)
  - actual miasanabria.com daytime waterfront hero used locally as -cycle40b asset,
    not hotlinked
  - seven neighborhood images regenerated through expert 3-candidate workflow
  - images are specific, full-bleed, photorealistic, on-brand, neighborhood-appropriate
  - homepage search remains Bridge-wired and E2E-tested
  - Bridge state remains truthful (demo mode unless live IDX credentials prove themselves)
  - old IDX iframe remains absent
  - dev staging site at https://miasanabriarealtor.trueidea.com/ deployed and verified live

proof_goals:
  - 20 live-before screenshots preserved from Cycle 40 + new local-after + new live-after
    screenshots inspected visually (PNG read with written description)
  - candidate contact sheets per slug
  - scorecard per candidate, 8 axes, ≥34/40 to accept as winner
  - winning candidate justified in writing per slug
  - local E2E test (test-home-search-bridge-e2e.ts) passes
  - staging E2E test passes
  - typecheck, lint, build, audit:qa-gate (critical = 0) all green
  - audit:no-old-idx green locally + staging
  - audit:neighborhood-images-deep green locally + staging
  - new audit:image-creative-acceptance green locally
  - deployed commit equals origin/main HEAD

anti_goals:
  - no framed-art / canvas / white-border / gallery-wall image outputs
  - no abstract AI art
  - no generic luxury image unrelated to neighborhood
  - no images with text, logos, people, license plates, identifiable private addresses
  - no DOM-only "passes" without rendered-pixel verification
  - no stale cached paths
  - no secret exposure (BRIDGE_*, GOOGLE_API_KEY, Bearer, access_token=)
  - no production / DNS / GHL / Bridge credential changes
  - no Cycle 39 image path active for the 7 regenerated slugs after wire

gates:
  observe_gate:
    required_before_code_changes:
      - recover repo state (HEAD = origin/main = 21533b9; tree dirty with reports/* + cycle-40 untracked)
      - inspect Cycle 40 partial work (live-before + reference hero + cycle40 assets preserved)
      - inspect current images (`-cycle39.jpg` and unversioned set both in public/markets/)
      - inspect current hero source/layout (Hero.tsx uses /hero/mia-home-hero-cycle39.jpg)
    PASSED: 2026-05-16T19:55Z

  design_gate:
    required_before_generation:
      - visual-creative-brief.md written
      - neighborhood-image-creative-briefs.md written
      - scoring rubric written (8 axes × ≥34/40 threshold)
      - benchmark candidate generated and reviewed (tool decision: gemini-2.5-flash-image)
    STATUS: pending

  candidate_gate:
    required_before_final_asset_selection:
      - at least 3 candidates per neighborhood unless tool failure documented
      - contact sheet per neighborhood
      - scorecard per candidate
      - chosen candidate score ≥ 34/40
    STATUS: pending

  implementation_gate:
    required_before_commit:
      - Cycle 40B versioned image paths wired in src/lib/mia.ts
      - hero asset wired to /hero/mia-home-hero-cycle40b.jpg
      - hero overflow root cause fixed in Hero.tsx / HeroSearch.tsx / page.tsx
      - local-after screenshots captured + inspected
      - E2E passes locally
      - typecheck, lint, build, audit:qa-gate critical=0
      - secret scan clean
    STATUS: pending

  release_gate:
    required_before_done:
      - commit pushed to origin/main
      - staging deploy EXIT_CODE:0
      - live-after screenshots inspected
      - staging E2E passes
      - final deployed commit equals origin/main HEAD
    STATUS: pending
```

## Tracking notes

- Branch: `main` at HEAD `21533b9` = `origin/main`.
- Cycle 40 partial work preserved in `docs/artifacts/cycle-40-world-class-visual-recovery/`
  (live-before, reference-home, hero JPEGs `public/hero/mia-home-hero-cycle40*.jpg`).
- v3 generator never written — built from scratch this cycle extending v2.
- ELYSIA `localhost:31337/notify` voice endpoint unreachable; voice silent this run.
