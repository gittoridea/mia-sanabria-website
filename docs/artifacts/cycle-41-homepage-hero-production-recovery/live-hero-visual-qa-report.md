---
cycle: 41
artifact: live-hero-visual-qa-report
generated_at: 2026-05-17
base: https://miasanabriarealtor.trueidea.com
status: complete
---

# Cycle 41 — Live-After Hero Visual QA

Inspection of `live-after/screenshots/` against `https://miasanabriarealtor.trueidea.com/` after the Cycle 41 deploy (commit `e63a35e`). Method: Read tool on PNG with verbal description, plus a fresh-cachebuster re-capture at 8 viewports to bypass Caddy stale-cache hits noted in `staging-live-verification-report.md`.

```yaml
homepage:
  320x800:
    pass: true
    visual_description: |
      Dark navy panel inset 16px from edges. H1 "SOUTH FLORIDA LIFESTYLE /
      HOME SEARCH" is the first text element (no eyebrow above it). Sub
      "Discreet, local guidance for Southeast Florida luxury homeowners,
      absentee owners, and qualified buyers — from a small, deliberate
      practice." renders on 4 lines. Two CTAs (brass primary, outlined
      secondary). Search card below the hero, stacked fields.
    remaining_issue: none
    note: |
      First capture pass at 14:48 caught Caddy-cached pre-Cycle-41 HTML
      that still showed the eyebrow. Live HTML curl + 14:55 recapture
      confirmed the eyebrow is gone in the current live HTML.

  360x800:
    pass: true
    visual_description: same shape as 320 with proportional sizing
    remaining_issue: none

  375x812:
    pass: true
    visual_description: |
      Panel uses bg-navy-900/90 (small-mobile readability), border-l-2
      border-brass-300 left edge. H1 first text element, sub on 3-4 lines,
      brass primary CTA + outlined secondary CTA below. Search card
      immediately below the hero, fields stacked.
    remaining_issue: none

  390x844:
    pass: true
    visual_description: same as 375 with slightly more breathing room
    remaining_issue: none

  414x896:
    pass: true
    visual_description: same as 375 with more horizontal room
    remaining_issue: none

  430x932:
    pass: true
    visual_description: same as 414 with slightly larger CTAs (no clipping)
    remaining_issue: none

  768x1024:
    pass: true
    visual_description: |
      ~50% navy panel / ~50% waterfront image. Panel covers top-left
      ~448px (max-w-md), waterfront house with infinity pool and palms
      clearly visible to the right. Cream search card spans content
      width below, 2-col grid + Search button. Below the search card,
      "MIA'S SERVICE AREAS" eyebrow with ~30-40px breathing room.
    remaining_issue: none

  1024x768:
    pass: true
    visual_description: |
      Image-forward. Navy panel covers ~35% of hero from left.
      Waterfront home, pool, palms occupy the remaining ~65%.
      Search card narrower (max-w-4xl) centered. 3 fields + Search
      button on one row.
    remaining_issue: none

  1280x800:
    pass: true
    visual_description: |
      Image unambiguously the visual lead. Navy panel covers ~30% of
      hero left, lighter bg-navy-900/68 lets the waterfront blue and
      palm fronds read through it. H1 is the focal point at lg:text-[36px]
      lg:leading-[1.04]. Search card ~896px centered with 3 slim fields
      + brass "Search Listings" button.
    remaining_issue: none

  1440x1000:
    pass: true
    visual_description: |
      Reference desktop state. Panel covers ~30% width, image occupies
      ~70%. H1 is the focal point. 2 stacked CTAs inside the panel.
      Search card 896px centered below. ~40px breathing room into
      "MIA'S SERVICE AREAS" / "WHERE MIA REPRESENTS BUYERS AND SELLERS".
    remaining_issue: none

  1536x864:
    pass: true
    visual_description: |
      Same composition as 1440 with slightly more horizontal room.
      Panel uses xl:max-w-lg (~512px) so it grows minimally; image
      still dominates the visual frame.
    remaining_issue: none

search_card:
  integrated: true
  too_wide: false
  clipped: false
  visual_description: |
    At lg+ the card uses max-w-4xl (~896px) inside max-w-7xl outer
    container, with mx-auto centering. Floats up -mt-16 into the hero
    edge — intentional overlap, not violent. Three select fields +
    brass "Search Listings" button on one row at lg; collapse to
    2-col + full-width button at sm; full stack on mobile.

copy_panel:
  dominates_image: false
  readable: true
  visual_description: |
    Panel is a supporting frame, not a competing block. At desktop
    the navy is light enough (bg-navy-900/68) that the waterfront blue
    reads through it; at mobile it's bg-navy-900/90 for WCAG contrast.
    The brass-300 left edge accent persists across all breakpoints.

image:
  visible_and_premium: true
  crop_good: true
  visual_description: |
    /hero/mia-home-hero-cycle40b.jpg — daytime waterfront residence with
    infinity pool and mature palms. Crop unchanged from Cycle 40B. Image
    now reads as the emotional lead at lg+.

vertical_rhythm:
  pass: true
  description: |
    Post-search spacer h-6 sm:h-8 lg:h-10. Combined with the next section's
    py-20 (lg:py-28) gives ~108-138px breathing room at lg into "MIA'S
    SERVICE AREAS" — reads as intentional pause.

overall_live_verdict: pass
```

## Cross-check

- Live HTML curl confirms no `data-hero-eyebrow` and single "South Florida Lifestyle" occurrence (inside H1).
- All Cycle 41 DOM markers present in live HTML.
- E2E 11/11 PASS, mode=demo.
- audit:no-old-idx + audit:home-bridge-search vs live both PASS.
- Live HTML secret scan clean.
