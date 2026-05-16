# Cycle 39 — Live-Before Visual Reproduction

date: 2026-05-16
base: https://miasanabriarealtor.trueidea.com
captured: 144 screenshots across 4 viewports (375x812, 768x1024, 1280x800, 1440x1000)
capture_runtime_seconds: 111
capture_failures: 0
log: docs/artifacts/cycle-39-visual-truth-recovery/logs/live-before-capture-20260516-095902.log

## Fields

```yaml
operator_issue_reproduced: true
homepage_hero_regression_observed: true   # mobile 375x812 — see "Findings" below
homepage_search_issue_observed: partial   # static HTML is correct; JS auto-search proven by E2E test, not by static curl
seven_neighborhood_images_issue_observed: indeterminate-on-staging  # Cycle 38's bytes are visually photorealistic in live screenshots; operator-visible browser cache is the suspected root cause
other_issues_observed: true               # see "Findings" below
evidence_screenshots: docs/artifacts/cycle-39-visual-truth-recovery/live-before/screenshots/
```

## Findings

### Homepage hero — REGRESSED (mobile 375x812)

Screenshot: `live-before/screenshots/home__375x812.png`

What you see at 375×812:

- Hero copy panel renders as a near-opaque navy slab (`bg-navy-900/95`) covering ~80% of the visible hero area.
- The twilight waterfront hero image is barely visible — only a thin sliver of background bleeds around the panel.
- Sub-paragraph text overflows rightward past the panel edge: the words `Florida` (line 1), `qualified` (line 2) are visibly clipped.
- CTAs (`Search available homes`, `Talk with Mia`) appear inside the panel as gold pills, but they are quite small at this width.
- The floating Bridge search card lands just below the hero rather than overlapping it — the visual "floating over the hero image" intention of Cycle 38 is not honored on mobile because the dark panel consumes the hero.

On desktop 1280×800 the regression is mild — the panel sits to the left of the hero image which is plainly visible — but the mobile experience is the operator-facing problem.

### Seven neighborhood images — visually photorealistic on staging

Screenshots: `live-before/screenshots/markets_{deerfield-beach,hollywood,plantation,weston,coral-springs,davie,sunrise}__1280x800.png`

In Cycle 38's deployed staging, each of the seven detail pages shows a photorealistic editorial composition (palm trees, beach, twilight skies, sunset waterfront) — NOT the framed-canvas defect class from Cycle 37. Cycle 38's image bytes are visually fine in a fresh headless Chrome profile that has no cache state shared with the operator's browser.

The operator's "did not visually update" report is therefore consistent with browser-cache persistence: Cycle 38 wrote new bytes to the SAME unversioned URLs, so the operator's Chrome (with persistent on-disk cache and possible service-worker remnants) revalidates with the prior ETag, accepts the cached payload, and renders the older pixels even though the origin holds the new file. Versioned URLs (Cycle 39) make this impossible because the URL itself changes.

### Homepage search — wiring is correct, JS path was unproven

The Cycle 38 form HTML is correct: `action="/home-search/"`, hidden `source=home-hero`, `name=city/minPrice/beds` inputs, floating-card markers. BridgeSearch.tsx contains the URL-param parse + auto-search mount effect.

What Cycle 38 never proved: that the JS path actually fires under real headless Chrome — `dump-dom` captures the DOM after some JS runs, but the auto-search timing + result rendering was not asserted. Cycle 39's `scripts/test-home-search-bridge-e2e.ts` closes that gap (11/11 PASS locally, mode=fallback as expected without Bridge token on local).

### Other issues

- Hero copy panel `bg-navy-900/95` is functionally a wall — the operator-authorized hero asset is structurally hidden on mobile. Fixed Cycle 39 to `/85` mobile → `/90` at 375px → `/92` at small → `/95+` at lg.
- Sub-text `max-w-xl` (576px) caused horizontal overflow on mobile. Fixed Cycle 39 to `max-w-full` on mobile, `sm:max-w-xl` reactivated at ≥640px.
- Heading `max-w-[27ch]` was already fine; Cycle 39 widened to `max-w-full` (the `[overflow-wrap:anywhere]` already wraps gracefully).

## Per-route findings

```yaml
route_findings:
  /:
    hero_regressed_mobile: true
    floating_search_present: true
    floating_search_overlap_clean_mobile: false  # sits below dark panel rather than over hero image
  /markets/:
    seven_card_images_visible: true              # photorealistic in fresh-cache probe
    operator_browser_cache_suspected: true        # versioned paths in Cycle 39 fix the class
  /home-search/:
    bridge_demo_banner_visible: true
    bridge_runtime_mode: demo                     # NEXT_PUBLIC_BRIDGE_DEMO=true in Dokploy build args
    listings_rendered: true                       # fixture cards
  /markets/deerfield-beach/:
    hero_image_visible: true                      # photorealistic pier composition
  /markets/hollywood/:
    hero_image_visible: true                      # palm tree + beach
  /markets/plantation/:
    hero_image_visible: true                      # mature canopy street
  /markets/weston/:
    hero_image_visible: true                      # planned community + greenery
  /markets/coral-springs/:
    hero_image_visible: true                      # canopy + residential
  /markets/davie/:
    hero_image_visible: true                      # equestrian sky/fence
  /markets/sunrise/:
    hero_image_visible: true                      # beach + palms (BB&T Center / Sawgrass corridor implied)
```

## Visual-truth-vs-curl divergence rule honored

Cycle 38 declared `live_verified` based on HTTP 200 + byte-for-byte match + DOM `<img>` presence — none of which prove what the operator's browser displays. Cycle 39 makes vision-grade screenshot review the source of truth, and converts the "byte match" proof to a CACHE-DEFEATING URL-version proof (versioned filenames).
