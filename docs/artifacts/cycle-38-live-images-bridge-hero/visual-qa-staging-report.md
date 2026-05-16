# Cycle 38 — Staging Visual QA Report

date: 2026-05-16
target: `https://miasanabriarealtor.trueidea.com/`

## Capture summary

- Captured via `google-chrome --headless=new --dump-dom` + `--screenshot` against the live staging URL after EXIT_CODE:0 from the Cycle 38 deploy.
- 40 PNGs total: 4 viewports × 10 routes.
- Stored under `docs/artifacts/cycle-38-live-images-bridge-hero/visual-qa/staging/`.

## Viewports

- 375 × 812 (iPhone class)
- 768 × 1024 (iPad portrait)
- 1280 × 800 (laptop)
- 1440 × 1000 (desktop)

## Routes captured

- `/`
- `/home-search/`
- `/markets/`
- `/markets/deerfield-beach/`
- `/markets/hollywood/`
- `/markets/plantation/`
- `/markets/weston/`
- `/markets/coral-springs/`
- `/markets/davie/`
- `/markets/sunrise/`

## Manual review

### `/`

- 1440×1000 and 1280×800: twilight luxury waterfront hero (operator-authorized reuse from miasanabria.com) renders behind a navy copy panel containing eyebrow "South Florida Lifestyle", H1 "South Florida Lifestyle / Home Search", sub-copy, and two CTAs ("Search available homes" → `/home-search/`, "Talk with Mia" → `/contact/`). Floating cream search card overlays the bottom half of the hero with NEIGHBORHOOD / MIN PRICE / BEDROOMS selects and a brass "Search Listings" submit button. Visually matches the production miasanabria.com pattern.
- 768×1024: hero + floating search render in 2-column grid for the form; layout fits the viewport.
- 375×812: hero + floating search stack vertically; form fields stack; no clipped controls (cross-confirmed by `audit:mobile-readability` PASS 84/0/0).

### `/home-search/`

- All viewports: existing Bridge hero ("South Florida Lifestyle / Home Search") renders, Bridge search form below, demo banner visible (data-bridge-runtime-mode="demo"), Equal Housing Opportunity disclosure rendered (4 occurrences in the page HTML).

### `/markets/`

- All viewports: index of 23 markets. Each card shows its hero image. All 7 newly regenerated images (Coral Springs, Davie, Deerfield Beach, Hollywood, Plantation, Sunrise, Weston) render as full-bleed photorealistic editorial — no frame, no white margin, no AI-painted style.

### `/markets/<slug>/` for each of the 7 named

- All viewports: full-bleed photorealistic hero matching the Cycle-38 brief:
  - Coral Springs — tree-canopied boulevard with central planter
  - Davie — white three-rail fence through pasture at golden hour
  - Deerfield Beach — wooden Atlantic pier, head-on perspective
  - Hollywood — brick promenade with palm shadows, ocean beyond
  - Plantation — royal-palm canopy over residential street
  - Sunrise — palm-framed lakeside at warm dawn
  - Weston — mature oak shade over manicured emerald lawn

## Defect classes specifically absent

- Frame/canvas/border around hero images
- "No photo available" placeholder
- AI-painted illustrative style
- Layout clipping on mobile/tablet
- Old IDX/MLS Matrix iframes or markers

## Fields

```yaml
total_screenshots_captured: 40
routes_covered: 10
viewports_covered: [375x812, 768x1024, 1280x800, 1440x1000]
defect_classes_found: []
hero_image_visible_at_375: true
hero_image_visible_at_768: true
hero_image_visible_at_1280: true
hero_image_visible_at_1440: true
floating_search_card_visible_at_all_vp: true
broken_images_count: 0
no_photo_available_count: 0
```
