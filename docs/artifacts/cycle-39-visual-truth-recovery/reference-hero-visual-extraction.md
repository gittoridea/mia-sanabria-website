# Cycle 39 — Reference Hero Visual Extraction

date: 2026-05-16
reference_site: https://miasanabria.com/
hero_screenshot_paths:
  desktop_1440x1000: docs/artifacts/cycle-39-visual-truth-recovery/reference-home/miasanabria-home-1440x1000.png
  mobile_375x812: docs/artifacts/cycle-39-visual-truth-recovery/reference-home/miasanabria-home-375x812.png
rendered_dom_path: docs/artifacts/cycle-39-visual-truth-recovery/reference-home/miasanabria-home-rendered.html
candidates_json: docs/artifacts/cycle-39-visual-truth-recovery/reference-home/reference-hero-candidates.json

## Probe method

`scripts/probe-reference-hero-visual.ts` runs google-chrome --headless=new
with `--virtual-time-budget=15000` (so JS-deferred + lazy assets resolve),
dumps the rendered DOM, and extracts every image URL candidate from four
surfaces: `<img src>`, CSS `url(...)`, `<link rel=preload as=image>`, and
meta `og:image` / `twitter:image`. Each candidate is HEAD-probed for status,
content-type, and byte count, then ranked by the union of surfaces it
appears in.

The same script also captures a desktop (1440×1000) and a mobile (375×812)
screenshot of the actual rendered miasanabria.com homepage so the report
can compare visual-truth to candidate-set claims.

## Findings

```yaml
actual_visible_hero_image_url: |
  https://vibe.filesafe.space/1776455982521426814/attachments/
  9d286670-d1c1-44cf-9bfd-4e701ca8f0e0.jpg   # 320 733 B JPG, og+tw+IMG
og_image_url: |
  https://vibe.filesafe.space/1776455982521426814/assets/
  0cea4829-8017-482f-9f70-4d00deda65a0.png   # 1 237 924 B PNG, og+tw only
actual_hero_matches_og_image: false
reference_hero_text:
  h1: "Discover Southeast Florida's Most Exclusive Real Estate"
  search_placeholder: "Search by City, Neighborhood, or Zip Code"
reference_search_layout: |
  Full-width single search bar inside a glassmorphic pill at the bottom
  of the hero, immediately above a faint "SEARCH" button on the right.
  Single field; no separate city/price/beds selects.
reuse_allowed_by_operator: true
selected_asset_url: |
  Cycle 38 reused the og:image (1.2 MB PNG twilight composition). Cycle 39
  PRESERVES that selection at a versioned path `public/hero/mia-home-hero-cycle39.jpg`
  pending operator decision on whether to swap to the actually-visible
  daytime composition.
selected_asset_local_path: public/hero/mia-home-hero-cycle39.jpg
provenance: |
  - 2026-05-16 reference_extraction: probe-reference-hero-visual.ts
    confirms actual visible hero is the 320 KB JPG attachment, not the
    1.2 MB PNG used as og:image. Both URLs hosted on vibe.filesafe.space.
  - 2026-05-16 cycle39_decision: Honor operator-authorized Cycle 38 reuse
    of the og:image twilight composition. DO NOT unilaterally swap the
    asset to the daytime JPG without operator sign-off. Versioned local
    path mia-home-hero-cycle39.jpg preserves cache-bust intent without
    changing the licensed composition.
```

## Visual diff (operator review)

| What | miasanabria.com (reference) | trueidea.com Cycle 39 |
|------|----------------------------|------------------------|
| Hero composition | Bright DAYTIME luxury waterfront mansion, palms, sun-lit pool, blue sky | Twilight waterfront skyline, intracoastal at dusk |
| Hero copy H1 | "Discover Southeast Florida's Most Exclusive Real Estate" | "South Florida Lifestyle / Home Search" (decision-record locked) |
| Search surface | Single full-width pill, one input | Bridge-wired floating card with city + minPrice + beds selects |
| Hero overlay | Faint gradient | Three-layer mood + content-scrim + cta-scrim |

The H1 is locked per `docs/mia-client-decision-record.md` §Homepage hero
("Line 1: South Florida Lifestyle / Line 2: Home Search") — Cycle 39
does NOT modify that copy. The image asset is the open decision point.

## Recommended next operator decision

Two paths, operator chooses:

1. **Stay with twilight composition** — current Cycle 39 state. Mia has
   approved this asset (operator-authorized in Cycle 38). The cycle is
   complete on the image-asset axis.
2. **Switch to actual daytime composition** — replace
   `public/hero/mia-home-hero-cycle39.jpg` with a Sharp-optimized copy of
   `https://vibe.filesafe.space/1776455982521426814/attachments/9d286670-d1c1-44cf-9bfd-4e701ca8f0e0.jpg`
   (320 KB JPG). Requires no further code change; the path is already
   versioned. Visual match to the live miasanabria.com hero would be
   exact.

This decision is documented and unblocked but explicitly outside Cycle 39's
AI-closeable scope.

## What was NOT extracted

- The internal vibe.filesafe.space asset GUIDs do not encode license
  information — operator-authorized reuse is the standing authorization.
- No tokens, no auth headers, no scraping of restricted endpoints — public
  GET-only requests to a public website.
- The mobile reference screenshot was captured for completeness but is not
  the basis for Cycle 39's asset decision — the desktop hero is the
  canonical composition surface for licensing decisions.
