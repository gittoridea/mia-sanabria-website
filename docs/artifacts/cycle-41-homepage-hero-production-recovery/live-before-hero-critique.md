---
cycle: 41
artifact: live-before-hero-critique
generated_at: 2026-05-17
base: https://miasanabriarealtor.trueidea.com
capture_summary: docs/artifacts/cycle-41-homepage-hero-production-recovery/live-before/screenshots/_capture-summary.json
total_captures: 33 (3 routes × 11 viewports)
inspection_method: Read tool on PNG with verbal description
---

# Cycle 41 — Live-Before Hero Critique

## Method

33 google-chrome --headless screenshots captured against the live staging URL `https://miasanabriarealtor.trueidea.com`, then inspected via the assistant's image Read tool with verbal descriptions of what is visible at each viewport.

## Operator screenshot issue confirmation

```yaml
operator_screenshot_issue_confirmed: true
```

Every cited issue in the operator brief reproduces in the live-before captures.

## Homepage hero issues

```yaml
dark_panel_dominates:
  observed: true
  screenshots: [home__1440x1000.png, home__1280x800.png, home__1536x864.png, home__768x1024.png]
  visual_description: |
    At 1440x1000 the navy panel covers approximately 45–50% of the hero from
    the left edge. Eyebrow + H1 + sub-copy + 2 stacked CTAs all sit on the
    panel. The waterfront house and palms occupy the right ~50%. Because
    the panel is `bg-navy-900/92` at sm+ and the content-scrim adds another
    dark gradient over the image, the overall visual weight on the dark side
    feels heavier than the photographic right side. The eye lands on the
    dark block first; the home becomes background filler.
    At 768x1024 the dark panel covers approximately 70% of the hero. The
    image collapses to a 70-100px column of palms + roofline on the right.
    The image feels accidental.

search_not_integrated:
  observed: true
  screenshots: [home__1440x1000.png, home__1280x800.png, home__768x1024.png]
  visual_description: |
    The HeroSearch card uses `-mt-20 sm:-mt-24` to pull up into the hero,
    then `mx-auto w-full max-w-7xl` so it spans the full hero width. Its
    top edge sits over the dark gradient's bottom and its bottom half sits
    over the cream surface. Visually it reads as a 1200px-wide cream
    horizontal band cutting through the seam between hero and "Mia's
    Service Areas" — not as a curated tool anchored to the hero.

copy_redundancy_or_awkwardness:
  observed: true
  exact_copy:
    eyebrow: "SOUTH FLORIDA LIFESTYLE"     # rendered uppercase
    h1_line_1: "South Florida Lifestyle"
    h1_line_2: "Home Search"
  visual_description: |
    The eyebrow text and the H1's first line are the same five words. At
    1440 the small uppercase brass eyebrow sits ~12px above an H1 that
    begins with the same words and then drops a line for "Home Search."
    On every screenshot the eye reads `South Florida Lifestyle` twice in
    immediate succession before reaching the actual subject `Home Search`.
    This is the single most visible defect.

panel_and_search_compete:
  observed: true
  visual_description: |
    The bottom of the dark panel and the top of the cream search card sit
    within ~80–100px of each other. Both have similar visual weight (heavy
    navy block + heavy cream block with a brass accent on each). At
    desktop neither dominates — they fight. The hero is a hero in name only.

poor_vertical_rhythm:
  observed: true
  visual_description: |
    After the search card the page leaves about 80–120px of empty cream
    before the eyebrow "MIA'S SERVICE AREAS" appears. The empty band reads
    as accidental whitespace because the search card already established
    a strong horizontal edge directly above it. The transition feels like
    a forgotten gap, not an intentional pause.

image_crop_not_art_directed:
  observed: true
  visual_description: |
    The hero JPEG is fine. The crop is fine. The composition is the issue:
    the dark panel's mass + the strong content-scrim gradient on the left
    side obscure the part of the home that would otherwise be the focal
    point (the pool, the palm cluster, the patio). What survives visually
    is the roofline and the right palm — supporting cast, not the lead.

search_too_utilitarian:
  observed: true
  visual_description: |
    At 1280–1536 the search card is a 4-column grid stretched across
    `max-w-7xl` (~1280px). Three select dropdowns + one button. Each
    field has a small uppercase label, a 44px-tall select. The shape is
    correct for a database admin tool, not a luxury homepage element. At
    768 it collapses to a 2-col grid; at <640 it stacks. The mobile stack
    is actually OK; the desktop band is what fails.

homepage_feels_like_home_search_not_mia_homepage:
  observed: true
  visual_description: |
    Because the eyebrow + H1 stack repeats `South Florida Lifestyle` and
    the H1 second line is literally `Home Search`, the page header reads
    like a search-tool label. There is no acknowledgment of Mia as a
    person until you scroll past the entire hero band + search card +
    Mia's Service Areas grid into the "Meet Mia" section. The hero is a
    search-portal hero, not a Realtor homepage hero.
```

## Other issues found

```yaml
mobile_375_capture_artifact_noted:
  description: |
    The 375x812 google-chrome --headless capture shows apparent right-edge
    clipping of the dark panel and search card. Cycle 40C explicitly
    classified this as a CDP-vs-window-size mismatch artifact rather than
    a real iPhone defect; the Cycle 41 fix below moves the layout further
    in the safe direction (lighter panel weight, smaller padding) so any
    residual capture-induced rendering is also relieved without relying
    on the Cycle 40C measurement-based defense.

home-search_route_is_fine:
  description: |
    /home-search/ uses a single bottom-anchored copy block over the hero
    image with no large navy panel. It's a workable production hero
    pattern. The fix on `/` should converge towards a similar discipline:
    let the image be the hero; let the copy support it.
```

## Must fix

1. Remove eyebrow text from the homepage Hero invocation (kill the visible duplication).
2. Reduce dark-panel dominance: lower opacity at sm+, narrower max-width on lg+.
3. Reduce content-scrim gradient strength on the left side.
4. Narrow the floating search card to `max-w-4xl` on lg+, reduce padding by one step.
5. Reduce float negative-margin from `-mt-20 sm:-mt-24` to a smaller overlap.
6. Reduce post-hero-search spacer.
7. Hold H1 word lock exactly.
8. Hold BridgeSearch wiring exactly.
