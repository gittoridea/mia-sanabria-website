# Cycle 40 → Cycle 40B — Partial Recovery Report

```yaml
cycle40_dropped_at: writing_generate_neighborhood_images_v3

evidence:
  - resume-preflight.md timestamp 2026-05-16T12:10Z (Cycle 40 entry)
  - live-before screenshots timestamp 2026-05-16T12:10Z (Cycle 40 capture)
  - hero JPGs timestamp 2026-05-16 12:24 (Cycle 40 optimization step)
  - no v3 generator file on disk
  - no source file changes vs HEAD (git diff src/ public/ scripts/ shows zero
    delta apart from the two Cycle 40 hero asset additions)
  - no commit between 21533b9 (Cycle 39 final) and current HEAD

partial_work_preserved:
  - 20 live-before screenshots at 4 viewports × 5 routes
    (home, markets, markets/davie, markets/deerfield-beach, markets/weston)
  - cycle-39-failure-analysis.md — root cause why Cycle 39 declared
    live_verified incorrectly (class-string presence vs rendered-pixel reality)
  - live-before-visual-critique.md — detailed per-viewport defect description
  - resume-preflight.md — Cycle 40 entry preflight
  - reference-home/actual-miasanabria-hero-source.png — daytime waterfront
    mansion fetched from vibe.filesafe.space
    (asset 12f02f56-afc4-4d6d-92e3-5ebb5b76140f.png)
  - public/hero/mia-home-hero-cycle40.jpg — 308KB optimized hero (kept; will
    be re-exported as -cycle40b alongside Cycle 40 evidence)
  - public/hero/mia-home-hero-cycle40-og.jpg — 147KB OG variant (same)

partial_work_repaired:
  - none — nothing reached a partially-broken state in source

partial_work_discarded:
  - empty Cycle 40 subdirs (image-candidates/, live-after/, local-after/,
    staging-html/) — replaced by Cycle 40B parallel structure
  - implicit Cycle 40 "do not regenerate images" recommendation — explicitly
    overridden by operator decision in Cycle 40B mission brief

reasoning: |
  The Cycle 40 recovery commander did a clean job:
  (a) captured live-before evidence,
  (b) wrote an honest failure analysis identifying the Cycle 39 mistake
      (class-string presence vs rendered-pixel reality),
  (c) sourced the actual reference hero from miasanabria.com and optimized it,
  (d) recommended NOT regenerating the 7 neighborhood images because direct
      JPEG inspection showed all 7 Cycle 39 assets were on-brand.

  Cycle 40 then dropped before writing the v3 generator. The operator chose
  to override the "do not regenerate" recommendation and now wants the
  full multi-candidate-with-scoring workflow run end-to-end.

  Cycle 40B inherits:
  - The hero assets (re-export as -cycle40b suffix to align with Cycle 40B
    versioning, keep the original cycle40 files as evidence in place).
  - The reference PNG (use as benchmarking ground-truth).
  - The live-before screenshots (the operator-side reproduction proof).
  - The failure analysis (informs the implementation gate: rendered pixels
    are truth, not class-string presence).

  Cycle 40B does NOT inherit:
  - The "don't regenerate" recommendation (operator override).
  - The empty subdirs (replaced by Cycle 40B parallel set).
```

## Where the next session picks up

The first incomplete artifact in Cycle 40's plan was the v3 image generator
(`scripts/generate-neighborhood-images-v3.ts`). Cycle 40B writes this from
scratch, extending the proven v2 pattern (`generate-neighborhood-images-v2.ts`)
with: per-slug candidate dirs, 3 candidates per slug, contact-sheet stitching,
scoring rubric application, manifest JSON, smart-crop to hero + OG dimensions,
and Cycle 40B versioned output paths.
