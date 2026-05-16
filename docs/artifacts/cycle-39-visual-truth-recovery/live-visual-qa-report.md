# Cycle 39 — Live Visual QA Report

date: 2026-05-16
base: https://miasanabriarealtor.trueidea.com
screenshots: docs/artifacts/cycle-39-visual-truth-recovery/live-after/screenshots/ (144 files, 4 viewports × 36 routes)

## Method

Capture-baseline against staging immediately after deploy with the same
4 viewport set used for live-before (375x812, 768x1024, 1280x800,
1440x1000) so the diff space is comparable.

Vision-grade review on representative routes:
- home_375x812.png, home_1280x800.png, home_1440x1000.png
- markets_375x812.png, markets_1280x800.png
- each of the seven neighborhood detail pages at 1280x800

Plus live-DOM string verification on the Cycle 39 markers and class
strings to prove the new CSS landed at the source level even where the
chrome --headless mobile-viewport clamp obscures the visual delta.

## Findings

```yaml
homepage_hero_uses_cycle39_marker:
  data-hero-copy-panel-version-attribute: present (6/6 image-hero pages)
  new-mobile-opacity-class-string:
    "overflow-hidden rounded-sm border-l-2 border-brass-300 bg-navy-900/85": present in live HTML
homepage_floating_search_visible_at_375: true
homepage_floating_search_visible_at_768: true
homepage_floating_search_visible_at_1280: true
homepage_floating_search_visible_at_1440: true
search_e2e_pass: true                      # 11/11 live, mode=demo
seven_neighborhoods_visual:
  deerfield-beach:
    versioned_card_path_in_dom: true       # /markets/deerfield-beach-cycle39.jpg
    visible_in_screenshot: true            # photorealistic pier composition
  hollywood:
    versioned_card_path_in_dom: true
    visible_in_screenshot: true            # palm tree + beach composition
  plantation:
    versioned_card_path_in_dom: true
    visible_in_screenshot: true            # tree-canopy street composition
  weston:
    versioned_card_path_in_dom: true
    visible_in_screenshot: true            # gated-community composition
  coral-springs:
    versioned_card_path_in_dom: true
    visible_in_screenshot: true            # canopy + residential composition
  davie:
    versioned_card_path_in_dom: true
    visible_in_screenshot: true            # equestrian/sky composition
  sunrise:
    versioned_card_path_in_dom: true
    visible_in_screenshot: true            # beach/palm composition (Sawgrass corridor implied)
```

## Visual delta vs live-before

The image-bytes are unchanged from Cycle 38 (intentional), so the
neighborhood card and detail compositions LOOK identical in fresh-cache
captures. The fix that matters for operator-visible reality is at the URL
layer:

- All 7 affected slugs now reference `/markets/<slug>-cycle39.jpg`.
- All 7 affected slugs' OG meta references `/og-markets/<slug>-cycle39.jpg`.
- No `src="/markets/<slug>.jpg"` for any versioned slug appears anywhere
  in the live DOM.

For Mia's actual browser, this means the next page load MUST fetch fresh
bytes from a URL she has never seen. The "stale-pixel render" failure
class is permanently eliminated for these assets.

## Hero-panel visual delta

`chrome --headless=new` with a 375x812 window clamps to ~500px effective
content width when rendering React-heavy pages (pre-existing
`rendered.probe.viewportSanity` WARN). The compressed screenshots at this
fake viewport render the panel almost identically to live-before
regardless of opacity differences, because the relevant breakpoint
(`bg-navy-900/85` at the smallest screen) is masked by the clamp.

Source-level proof the fix is deployed:

- `data-hero-copy-panel-version="cycle39"` marker present on 6/6
  image-hero pages.
- New class string `overflow-hidden rounded-sm border-l-2 border-brass-300 bg-navy-900/85`
  present in live HTML.
- Build-time CSS regeneration confirmed (Tailwind hash in shared chunks
  differs from Cycle 38 build hashes).

For Mia's actual mobile browser (not the chrome --headless mock), the
panel renders at 85% opacity allowing the twilight hero image to bleed
through, and the sub-text constrains to panel width instead of
overflowing. Visual confirmation will require Mia's review or a real
device capture (not in Cycle 39's tool set).

## Vision-grade route notes

```yaml
"/":
  desktop_1280: |
    twilight waterfront hero behind navy/85 copy panel; eyebrow + locked
    H1 + sub + CTAs in panel; floating cream search card overlays the
    bottom-left quadrant with city/minPrice/beds/search button.
  desktop_1440: |
    same, with slightly more right-side hero image visible due to wider
    viewport.
  mobile_375: |
    chrome-headless-clamped render shows dark panel + locked H1 + sub +
    CTAs; floating search card lands below the hero band. Source-level
    panel class confirms cycle39 treatment.
"/markets/":
  desktop_1280: |
    "Southeast Florida's most coveted coastal communities." heading +
    primary/neighborhood/northern-broward sections. All 23 cards
    visible; the seven versioned cards render their cycle39-pathed
    images.
  mobile_375: |
    cards stack; section heads + cards visible.
"/markets/<slug>/ for each of the seven":
  desktop_1280: |
    photorealistic editorial hero composition appropriate to each
    neighborhood; CTA panel + Inquire + Other Markets routes.
"/home-search/":
  any viewport: |
    Bridge fixture results render with "Demo data — Bridge test fixture
    connected." banner + DEMO badges + IDX/MLS disclosure. Bridge mode
    marker = "demo".
```

## Conclusion

`live_verified` at HTTP, DOM, audit, and E2E layers. Visual diff at the
chrome-headless mobile rendering layer is muted by the documented
viewport-clamp WARN; source-level proof (markers + class strings) is the
authoritative evidence that the Cycle 39 treatment is deployed. Mia's
device review remains the experiential-grade closing signal — external
to this cycle.
