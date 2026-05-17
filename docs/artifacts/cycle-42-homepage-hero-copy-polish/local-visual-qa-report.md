---
cycle: 42
artifact: local-visual-qa-report
generated_at: 2026-05-17
---

# Cycle 42 — Local Visual QA Report

Source: `docs/artifacts/cycle-42-homepage-hero-copy-polish/local-after/screenshots/`
Method: `google-chrome --headless=new --window-size=<viewport> --virtual-time-budget=8000`
Comparison baseline: `docs/artifacts/cycle-42-homepage-hero-copy-polish/live-before/screenshots/` (same viewports, same routes, captured from current live staging before any code change).

## Summary

```yaml
bad_copy_removed_local: true
new_copy_visible_or_removed: visible
hero_layout_regression: none
search_card_regression: none
overall_local_verdict: ready_for_staging_deploy
```

## Per-viewport inspection (home `/`)

```yaml
375x812:
  pass: true
  visual_description: |
    Top: logo + REALTOR® · LPT REALTY (cream banner).
    Hero panel "SOUTH FLORIDA LIFESTYLE / HOME SEARCH" + body copy + two
    CTAs (Search available homes / Talk with Mia). Search card below
    (Neighborhood / Min Price / Bedrooms / Search Listings). Helper
    paragraph below the search button is below the visible 812-tall
    capture fold — same as live-before screenshot. No regression.
    Right-edge body-copy clipping at 375 reproduces the live-before
    behavior — classified by Cycle 40C/41 as CDP --window-size artifact,
    not a real-device defect.

390x844:
  pass: true
  visual_description: |
    Same layout as 375 with marginally more breathing room. Body copy
    still clips at right edge — same as live-before, same classification.
    Floating search card integrated cleanly.

768x1024:
  pass: true
  visual_description: |
    Two-up sm:grid-cols-2 form layout activates. Search card visible
    inline. Cycle 41 layout fully preserved. New helper paragraph
    renders below the search row on this viewport (visible in the
    full-page capture; brief inspection confirms it sits where the old
    paragraph sat — same indent, same vertical rhythm).

1280x800:
  pass: true
  visual_description: |
    Full desktop. Hero image (waterfront home with palms) visible as
    primary visual anchor. Dark navy panel on left, narrower than image.
    Floating search card with four-control row + new helper paragraph
    visible directly beneath. Helper text reads: "Begin with an area,
    price range, and bedroom count. Mia will help you interpret the
    listings, neighborhoods, and details behind the search."
    No regression vs live-before geometry. The card now reads as
    intentional and consumer-facing — the old card read like an admin
    panel with a footnote.

1440x900:
  pass: true
  visual_description: |
    Largest captured viewport. Same as 1280, slightly more horizontal
    breathing room around the hero panel. Service-Areas section header
    "MIA'S SERVICE AREAS" peeks at bottom of capture — vertical rhythm
    into the next section preserved (Cycle 41's tightened spacer
    h-6 sm:h-8 lg:h-10 unchanged).
```

## Hero layout regression: none

Cycle 41 geometry (`max-w-4xl` floating card, `-mt-12 sm:-mt-14 lg:-mt-16`, `p-4 lg:p-5` card padding, post-hero spacer reduced to `h-6 sm:h-8 lg:h-10`) is preserved exactly. The only delta is the helper `<p>` text content. No CSS, no class names, no DOM structure changes.

## Search card regression: none

The form's four controls (Neighborhood / Min Price / Bedrooms / Search Listings) are unchanged in shape, accessibility labels, defaults, hidden `source=home-hero` input, and `action="/home-search/"`. The new helper paragraph is at the same `<p>` slot with the same Tailwind classes (`mt-3 text-[11px] leading-relaxed text-navy-800/65`).

## Bad-copy removal (local build)

```yaml
- "Search routes":          0 occurrences in out/
- "Bridge-backed":          0 occurrences in out/
- "Search anchors":         0 occurrences in out/
- "listings alone cannot tell you":  0 occurrences in out/
- "residence specifics listings":    0 occurrences in out/
- "Begin with an area":     2 occurrences in out/   ← new copy, SSR+RSC pair
```

## Decision: kept paragraph (not removed)

Locally inspecting the card with the new copy at 1280 / 1440 shows the paragraph reads as a hosted invitation rather than a footnote. Removing the paragraph entirely would leave the card visually balanced but emotionally flat; keeping the softer paragraph supports the luxury-real-estate "hosted by Mia" posture without naming the data layer. The kept-paragraph decision is recorded in `helper-copy-implementation-report.md`.
