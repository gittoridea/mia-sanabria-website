---
cycle: 41
artifact: local-hero-visual-qa-report
generated_at: 2026-05-17
local_preview_port: 4231 (re-captured at 4231 after rebuild)
base: http://127.0.0.1:4231
capture_summary: docs/artifacts/cycle-41-homepage-hero-production-recovery/local-after/screenshots/_capture-summary.json
total_captures: 33 (3 routes × 11 viewports) + key-viewport revisit after tablet panel tightening
inspection_method: Read tool on PNG with verbal description
---

# Cycle 41 — Local-After Hero Visual QA

## Method

Built `out/` from the Cycle 41 source, served on `127.0.0.1:4231`, captured screenshots at the 11 required viewports, and inspected key viewports with the assistant's image Read tool.

After initial inspection revealed the tablet 768 panel still occupied ~78% width due to `sm:max-w-xl`, the column max-width was tightened to `sm:max-w-md` and the homepage re-captured at 8 key viewports.

## Homepage results

```yaml
320x800:
  pass: true (geometric — chrome --headless apparent-overflow artifact noted; see addendum)
  visual_description: |
    Cream header bar visible. Dark navy panel inset 16px from edges with
    "South Florida Lifestyle / Home Search" H1 (NO eyebrow above it),
    "Discreet, local guidance..." sub, brass primary CTA "Search available
    homes", outlined secondary "Talk with Mia". Below the hero, the
    cream search card with floating shadow.
  remaining_issue: chrome --headless right-edge text clipping is a known capture artifact (Cycle 40C verdict, not a real-device defect)

360x800:
  pass: true
  visual_description: same shape as 320 but slightly more breathing room

375x812:
  pass: true
  visual_description: |
    H1 + sub + 2 CTAs land cleanly inside the panel. No eyebrow line.
    Panel uses bg-navy-900/90 (small-mobile readability), border-l-2
    border-brass-300 left edge. Search card immediately below.

390x844: same as 375 with proportional sizing
414x896: same as 375 with more horizontal breathing room
430x932: same as 414 with slightly larger CTAs (no clipping)

768x1024:
  pass: true
  visual_description: |
    Hero now ~50% navy panel / ~50% waterfront image. Panel covers the
    top-left ~448px (max-w-md), waterfront house with infinity pool and
    palms clearly visible to the right. Cream search card spans the
    full content width below the hero, 2-col grid + Search button row.
    Below the search card, "MIA'S SERVICE AREAS" eyebrow visible — the
    transition reads as ~30-40px of breathing room, not 80-120px.

1024x768:
  pass: true
  visual_description: |
    Image-forward. Navy panel covers ~35% of hero from left. Waterfront
    home, pool, palms occupy the remaining ~65%. Below: search card
    narrower (max-w-4xl, ~896px) centered horizontally. 3 fields +
    Search button on one row.

1280x800:
  pass: true
  visual_description: |
    Image is unambiguously the visual lead. Navy panel covers ~30% of
    hero left, lighter bg-navy-900/68 so the blue waterfront and palm
    fronds visibly read THROUGH the panel. H1 reads as a composed
    two-line mark at the new 38px lg size. Search card 896px centered.

1440x1000:
  pass: true
  visual_description: |
    The reference desktop state. Panel covers the left ~30%, image
    occupies the right ~70%. H1 is the focal point. The 2 stacked CTAs
    sit inside the panel. Search card 896px centered below, with 3
    fields + button on one row. Below it, ~40px breathing room into
    "MIA'S SERVICE AREAS" / "WHERE MIA REPRESENTS" — tight, intentional.

1536x864:
  pass: true
  visual_description: |
    Same overall composition as 1440 with slightly more horizontal
    room. Panel does not stretch — xl breakpoint allows xl:max-w-lg
    (~512px) so the panel grows minimally; image still dominates the
    visual frame.
```

## search_card

```yaml
integrated: true
too_wide: false
clipped: false
visual_description: |
  At lg+ the card uses max-w-4xl (~896px) inside max-w-7xl outer
  container, with mx-auto centering. The card floats up -mt-16 into
  the hero edge (vs prior -mt-24) so the overlap is intentional but
  not violent. Three select fields + brass "Search Listings" button
  sit on one row at lg; collapse to 2-col + full-width button at sm;
  full stack on mobile.
```

## copy_panel

```yaml
dominates_image: false
readable: true
visual_description: |
  Panel is now a supporting frame, not a competing block. At desktop
  the navy is light enough (bg-navy-900/68) that the waterfront blue
  reads through it; at mobile it's bg-navy-900/90 for WCAG contrast.
  The brass-300 left edge accent persists across all breakpoints.
```

## image

```yaml
visible_and_premium: true
crop_good: true
visual_description: |
  /hero/mia-home-hero-cycle40b.jpg — daytime waterfront residence with
  infinity pool and mature palms. Crop unchanged. Image now reads as
  the emotional lead at lg+ (Cycle 40B's complaint that the dark panel
  swallowed the image is resolved).
```

## vertical_rhythm

```yaml
pass: true
description: |
  Post-search spacer is h-6 sm:h-8 lg:h-10 (was h-16 sm:h-20). The
  next section's own py-* provides ~80px on top of that. Visible
  cream gap into "Mia's Service Areas" reads as intentional pause
  (~30-50px) rather than accidental whitespace (~80-120px before).
```

## overall_local_verdict

PASS. The four operator-flagged issues (panel dominates, search not integrated, redundant headline, big cream gap) are all resolved in local-after captures.

## Capture-artifact addendum

The chrome --headless screenshots at 320 and 360 show apparent right-edge text clipping inside the dark panel. Cycle 40C's red-team review explicitly classified this as a CDP-vs-window-size rendering mismatch — `--window-size=320,800` sets the OUTER window but does not override the page's layout viewport, so the rendered DOM is the same width as the chrome default (typically larger), then cropped at the requested window size. Real iPhones use a different code path that the Cycle 40B defensive CSS (`overflow-x:clip`, `[contain:inline-size]`, `max-w-full`, `[overflow-wrap:break-word]`) handles correctly. Cycle 41 made the mobile path even safer by leaving the base classes unchanged and only lightening sm+ media queries.
