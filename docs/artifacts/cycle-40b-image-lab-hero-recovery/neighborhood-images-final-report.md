# Cycle 40C — Neighborhood Images Final Report

> Closes out the seven Cycle 40B neighborhood image swaps. Each row is
> verified against live `https://miasanabriarealtor.trueidea.com` with the
> Playwright screenshot in `live-after-cycle40c/screenshots/` and the
> companion file on disk.

## Per-slug final state

```yaml
deerfield-beach:
  cycle40b_asset_path: /markets/deerfield-beach-cycle40b.jpg
  og_asset_path:       /og-markets/deerfield-beach-cycle40b.jpg
  winner_candidate:    cand-1
  source_model:        gemini-2.5-flash-image
  screenshot_paths:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-deerfield-beach_1280x800.png
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-deerfield-beach_390x844.png
  visual_description: "Palm-framed Atlantic beach at golden hour — full-bleed, editorial composition matches Deerfield's pier-adjacent beach-corridor identity"
  score: 36/40 (per image-candidate-scorecards.md acceptance threshold ≥34)
  pass: true

hollywood:
  cycle40b_asset_path: /markets/hollywood-cycle40b.jpg
  og_asset_path:       /og-markets/hollywood-cycle40b.jpg
  winner_candidate:    cand-3
  source_model:        gemini-2.5-flash-image
  screenshot_paths:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-hollywood_1280x800.png
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-hollywood_390x844.png
  visual_description: "Broadwalk-adjacent palm + Atlantic composition at golden hour — matches Hollywood's beach-corridor + Broadwalk identity"
  score: 35/40
  pass: true

plantation:
  cycle40b_asset_path: /markets/plantation-cycle40b.jpg
  og_asset_path:       /og-markets/plantation-cycle40b.jpg
  winner_candidate:    cand-2
  source_model:        gemini-2.5-flash-image
  screenshot_paths:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-plantation_1280x800.png
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-plantation_390x844.png
  visual_description: "Mature tree-canopy boulevard composition with filtered sunlight — matches Plantation's mature-canopy + Plantation Heritage Park identity"
  score: 35/40
  pass: true

weston:
  cycle40b_asset_path: /markets/weston-cycle40b.jpg
  og_asset_path:       /og-markets/weston-cycle40b.jpg
  winner_candidate:    cand-3
  source_model:        gemini-2.5-flash-image
  screenshot_paths:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-weston_1280x800.png
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-weston_390x844.png
  visual_description: "Master-planned community vista with palms + lake at golden hour — matches Weston's master-planned + Conservation-Area-edge identity"
  score: 34/40
  pass: true

coral-springs:
  cycle40b_asset_path: /markets/coral-springs-cycle40b.jpg
  og_asset_path:       /og-markets/coral-springs-cycle40b.jpg
  winner_candidate:    cand-2
  source_model:        gemini-2.5-flash-image
  screenshot_paths:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-coral-springs_1280x800.png
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-coral-springs_390x844.png
  visual_description: "Oak-lined parkway composition at golden hour — matches Coral Springs' deliberate road grid + named subdivisions identity"
  score: 35/40
  pass: true

davie:
  cycle40b_asset_path: /markets/davie-cycle40b.jpg
  og_asset_path:       /og-markets/davie-cycle40b.jpg
  winner_candidate:    cand-1
  source_model:        gemini-2.5-flash-image
  screenshot_paths:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-davie_1280x800.png
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-davie_390x844.png
  visual_description: "Equestrian fence / pasture at golden hour — perfectly matches Davie's equestrian-trail + Tree City USA identity"
  score: 37/40
  pass: true

sunrise:
  cycle40b_asset_path: /markets/sunrise-cycle40b.jpg
  og_asset_path:       /og-markets/sunrise-cycle40b.jpg
  winner_candidate:    cand-2
  source_model:        gemini-2.5-flash-image
  screenshot_paths:
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-sunrise_1280x800.png
    - docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots/market-sunrise_390x844.png
  visual_description: "Lake + master-planned residential composition with palms — matches Sunrise's Sunrise Lakes corridor + master-planned identity"
  score: 34/40
  pass: true
```

## Source references confirmed on live

```yaml
markets_index_live_grep:
  - /markets/coral-springs-cycle40b.jpg
  - /markets/davie-cycle40b.jpg
  - /markets/deerfield-beach-cycle40b.jpg
  - /markets/hollywood-cycle40b.jpg
  - /markets/plantation-cycle40b.jpg
  - /markets/sunrise-cycle40b.jpg
  - /markets/weston-cycle40b.jpg
cycle39_paths_on_live: none
```

## Live audit confirmation

```yaml
audit:images:                    14 PASS / 0 WARN / 0 FAIL — both everyMarketCardImagePresent + everyMarketPageHeroImagePresent green
audit:neighborhood-images-deep: PASS — 23/23 markets
audit:image-creative-acceptance: PASS — 7/7 slugs + all docs present
```

## Operator-only remaining

```yaml
mia_subjective_review: pending  # the AI cannot stand in for Mia's eye on her own market identity
production_cutover: out_of_scope
```

## Verdict

```yaml
seven_cycle40b_images_active:      true
seven_cycle40b_images_visible_live: true
seven_cycle40b_images_visually_acceptable_to_ai_review: true
mia_subjective_pass: pending (operator-only gate)
```
