---
cycle: 41
artifact: red-team-precommit-review
generated_at: 2026-05-17
---

# Cycle 41 — Red-Team Precommit Review

Adversarial review of the Cycle 41 hero changes BEFORE commit. Each risk vector poses a falsifiable claim and answers with the strongest available evidence.

## Risk 1 — Dark panel still dominates

```yaml
hypothesis: |
  Mia opens the staged site and the navy panel still swallows the image.
falsification:
  - 1440 local-after capture: panel covers ~30% width vs ~45–50% before.
  - 1280 local-after capture: same proportional change — image is the lead.
  - 1024 local-after capture: image-forward composition; panel ~35%.
  - 768 local-after capture (after sm:max-w-md fix): panel ~50% vs ~78% before.
  - Panel opacity at sm = bg-navy-900/72 (was /92); at lg = /68 (was /92 from-/85 base).
  - Side-by-side comparison: live-before/screenshots/home__1440x1000.png vs
    local-after/screenshots/home__1440x1000.png. Verifiable on the deployed site
    via Phase 11 live-after capture.
verdict_pre_commit: rejected by local evidence; Phase 11 live-after will re-confirm
```

## Risk 2 — Image still feels like background filler

```yaml
hypothesis: |
  Even with the panel reduced, the waterfront home reads as a backdrop
  rather than the lead.
falsification:
  - Content-scrim left-side dim reduced /45 → /35 and right-side ramp to
    transparent (was /10). Image right two-thirds reads true.
  - cta-scrim bottom dim reduced /85 → /55, h-1/2 → h-1/3. Less navy mass.
  - Hero min-h on lg increased 480 → 540px so image has vertical room.
verdict_pre_commit: rejected; image visibly dominates in 1024/1280/1440/1536 captures
```

## Risk 3 — Search still feels pasted on

```yaml
hypothesis: |
  The floating search card still reads as a wide cream band cutting the
  hero seam.
falsification:
  - Card max-width lg:max-w-4xl (was max-w-7xl). At 1440 the card is
    ~896px wide vs ~1280px — clearly narrower than the hero photo and
    visibly centered.
  - Float offset reduced from -mt-20 sm:-mt-24 to -mt-12 sm:-mt-14
    lg:-mt-16. Overlap into hero edge is intentional, not violent.
  - Padding trimmed lg:p-6 → lg:p-5; grid tightened to
    lg:[1.5fr_1fr_1fr_auto] + lg:gap-3.
verdict_pre_commit: rejected; card now reads as a curated tool anchored to the hero
```

## Risk 4 — Search form still too wide or database-like

```yaml
hypothesis: |
  Even narrower, the 4-column horizontal grid still reads as a database row.
falsification:
  - The shape is the same 4-col layout but at max-w-4xl that's three
    ~190px selects + a button. Subjective call: this is now a refined
    tool, not a database row. If Mia rejects this on review, Option B
    would collapse the search to 3 stacked horizontal fields with a
    full-width brass button — preserved as a rollback design.
verdict_pre_commit: residual subjective risk; deferred to live verification
```

## Risk 5 — Mobile still overflows or clips

```yaml
hypothesis: |
  Cycle 41 broke mobile geometry that Cycle 40C ruled fixed.
falsification:
  - Cycle 41 changes touch only sm:+ media-query classes on the panel
    (sm:bg-navy-900/72, sm:max-w-md, sm:p-6, lg:* etc.). The base mobile
    classes (w-full max-w-full overflow-hidden, [contain:inline-size],
    bg-navy-900/85, max-w-2xl) are unchanged.
  - min-[375px]:bg-navy-900/90 restored as a /9X token; mobile-narrow
    contrast is even higher than Cycle 40C's path.
  - audit:brand passes 12/12 including heroH1ContrastTokens (panel attr +
    navy-9X bg + brass edge + bold weight).
  - The known chrome --headless 320/360 right-edge artifact is the same
    capture-vs-real-device behavior Cycle 40C explicitly classified as
    non-defective using Playwright CDP measurement.
verdict_pre_commit: rejected; mobile geometry unchanged at base, sm+ improved
```

## Risk 6 — Vertical gap still feels accidental

```yaml
hypothesis: |
  The cream gap into "Mia's Service Areas" still reads as forgotten space.
falsification:
  - Post-hero spacer h-16 sm:h-20 → h-6 sm:h-8 lg:h-10. Spacer + next
    section's py-20 (lg:py-28) = ~108–138px total breathing room at lg
    (was ~160–192px before). NeighborhoodsRail leads off with its own
    eyebrow + heading rather than a big top border, so the felt gap is
    smaller than the math suggests.
verdict_pre_commit: rejected; local-after 1440 shows the eyebrow appearing within ~40px of the search card bottom
```

## Risk 7 — Bridge search only looks wired but fails E2E

```yaml
hypothesis: |
  The visual refactor broke the form schema or the destination contract.
falsification:
  - test-home-search-bridge-e2e.ts: 11/11 PASS, mode=fallback
  - audit:home-bridge-search: 8/8 PASS
  - data-home-hero-search="true" sentinel preserved
  - form method="get" action="/home-search/", hidden source=home-hero
  - named selects city, minPrice, beds preserved
verdict_pre_commit: rejected by tests
```

## Risk 8 — Old IDX reappeared

```yaml
hypothesis: |
  The refactor accidentally re-imported IdxEmbed or surfaced
  sef.mlsmatrix.com / mlsmatrix.com / idxform.
falsification:
  - audit:no-old-idx: PASS (481 files scanned)
  - No IdxEmbed import in src/
  - Caddyfile unchanged
verdict_pre_commit: rejected by test
```

## Risk 9 — Audits passed but visual quality still fails

```yaml
hypothesis: |
  The audits were structural-token presence checks, not visual quality
  checks. They pass even when the hero looks bad.
falsification:
  - The 8 operator-flagged felt-quality issues each have a specific
    code change AND a specific local-after screenshot demonstrating
    the change took visual effect.
  - The structural audits are intentionally a token-presence layer, not
    a quality verdict. They are necessary but not sufficient. Phase 11
    live-after captures + visual inspection are the sufficient signal.
verdict_pre_commit: live-after capture remains the load-bearing signal; precommit is "no regression"
```

## Risk 10 — Audits passed but rendered.json failed

```yaml
hypothesis: |
  audit:rendered (or audit:qa-gate) flags a different hero defect that
  the manual inspection missed.
falsification: deferred until both audits complete; will be confirmed in local-validation-report.md before commit
```

## Pre-commit verdict

No risk vectors confirmed at pre-commit time except Risk 4 (subjective) and Risk 9/10 (deferred to gate completion + live verification). Local evidence supports the design intent; live evidence will be load-bearing in Phase 11.
