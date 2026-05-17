# Cycle 40C — Mobile Hero Proof (375 / 390 truthful verdict)

> The user mandated re-proving the 375/390 overflow question from the prior
> session before any deploy. Three independent browser methods were used to
> falsify or confirm. The decisive evidence is the Playwright-with-real-Chromium
> probe of `getBoundingClientRect()` and `scrollWidth` at every viewport.

## Method matrix

```yaml
methods:
  capture_baseline:
    tool: scripts/capture-baseline.ts
    backend: chrome --headless via puppeteer-like driver, window-size only
    output: docs/artifacts/.../cycle40c-mobile-hero-proof/local/
  direct_google_chrome:
    tool: google-chrome --headless=new --window-size=W,H --screenshot
    backend: chrome --headless=new, window-size only (no CDP viewport override)
    output: docs/artifacts/.../cycle40c-mobile-hero-proof/direct/
  playwright:
    tool: bun run --bun /tmp/probe-widths.ts (CDP page.setViewport via context)
    backend: chromium via CDP — sets BOTH window AND layout viewport
    output: docs/artifacts/.../cycle40c-mobile-hero-proof/playwright/
```

## Playwright `getBoundingClientRect` measurements (the truth)

```text
vp=320   panel=288   docScroll=320   hasHorizontalScroll=false   form=288   formScroll=286
vp=360   panel=328   docScroll=360   hasHorizontalScroll=false   form=328   formScroll=326
vp=375   panel=343   docScroll=375   hasHorizontalScroll=false   form=343   formScroll=341
vp=390   panel=358   docScroll=390   hasHorizontalScroll=false   form=358   formScroll=356
vp=414   panel=382   docScroll=414   hasHorizontalScroll=false   form=382   formScroll=380
vp=430   panel=398   docScroll=430   hasHorizontalScroll=false   form=398   formScroll=396
vp=600   panel=568   docScroll=600   hasHorizontalScroll=false   form=568   formScroll=566
vp=768   panel=672   docScroll=768   hasHorizontalScroll=false   form=736   formScroll=734
vp=1280  panel=672   docScroll=1280  hasHorizontalScroll=false   form=1216  formScroll=1214
```

Reading the numbers:

- `panel.width` is exactly `viewport - 32px` (the `px-4` 16+16 padding on the inner
  flex container) at every viewport ≤ 768. At 768+ the panel hits its `max-w-2xl`
  (672px) cap.
- `panelScroll` is `panel.width - 2` (small rounding from the 2px `border-l-2`). Identical
  to client width — no horizontal overflow inside the panel.
- `docScroll === window.innerWidth` at every viewport. The document does NOT scroll
  horizontally.
- `hasHorizontalScroll: false` at every viewport.
- `form.scrollWidth < form.width` at every viewport — the Bridge search card content
  fits inside the form.

Conclusion: **the actual page layout respects viewport at every viewport from 320 up.
No overflow. No horizontal scroll. The defensive Cycle 40B CSS holds.**

## Visual verification per viewport

### Playwright screenshots (CDP viewport set correctly)

```yaml
320x800: |
  - Header cream band with hamburger icon — clean
  - Dark navy hero panel inset 16px from edges, fits viewport
  - SOUTH FLORIDA LIFESTYLE eyebrow visible
  - SOUTH FLORIDA LIFESTYLE / HOME SEARCH heading two lines
  - Sub: "Discreet, local guidance for Southeast / Florida luxury homeowners, absentee / owners, and qualified buyers — from a / small, deliberate practice." — wraps cleanly
  - Primary CTA "Search available homes →" full-width inside panel
  - Floating Bridge search card below, fits viewport, all fields visible
  - Search Listings button full-width
  - VERDICT: PASS
375x812: |
  - Identical structure to 320 with slightly more breathing room
  - Same clean text wrap
  - VERDICT: PASS
390x844: |
  - Same as 375 with slightly more horizontal room
  - All elements within viewport
  - VERDICT: PASS
414x896 / 430x932 / 768x1024 / 1280x800 / 1440x1000: PASS (captures verified)
```

### capture-baseline + direct google-chrome screenshots (window-size only)

These showed the panel "extending past the right viewport edge" at 320/360/375/390
and clean rendering at 430+. **This is the chrome `--headless` viewport-clamping
artifact documented in Cycle 39.** When you pass `--window-size=375,812` to
`google-chrome --headless=new` without also overriding the device metrics (CDP
`Page.setDeviceMetricsOverride`), Chromium sets the OS window size but the
inner layout viewport remains at the default desktop width (~800–1200). The
screenshot then captures only the leftmost N pixels of that wider render,
which looks like the panel is over-wide and the search card is clipped.

Playwright fixes this by calling `setViewport` (via CDP), which forces the
layout viewport to match the requested size. The page lays out at the correct
mobile width, mobile media queries fire, and the screenshot matches what a
real iPhone would show.

The smoking-gun comparison:

```text
Method                         Viewport    Header search/hamburger    Panel inset
capture-baseline 375x812       (claimed)   search icon (sm- desktop)  panel overflows
direct google-chrome 375x812   (claimed)   search icon (sm- desktop)  panel overflows
playwright 375x812             (actual)    hamburger icon (mobile)    panel fits
```

The header icon difference is the giveaway. The site uses a media-query swap
between hamburger (mobile, base) and search icon (sm and up). When the actual
mobile media query fires (Playwright), we see the hamburger. When the page
renders at desktop layout and the screenshot is just clipped (chrome
--headless), we see the search icon. So the failing captures were never even
rendering the mobile layout to begin with.

## Conclusion table

```yaml
local_capture_paths:
  capture_baseline_dir: docs/artifacts/cycle-40b-image-lab-hero-recovery/cycle40c-mobile-hero-proof/local
  direct_chrome_dir:    docs/artifacts/cycle-40b-image-lab-hero-recovery/cycle40c-mobile-hero-proof/direct
  playwright_dir:       docs/artifacts/cycle-40b-image-lab-hero-recovery/cycle40c-mobile-hero-proof/playwright
viewports:
  320x800:
    capture_baseline_result: artifact-clip  (panel appears to overflow — not real)
    direct_chrome_result:    artifact-clip  (panel appears to overflow — not real)
    playwright_measurement:  panel=288, docScroll=320, no horizontal scroll
    visual_description:      Clean mobile render, hamburger icon, all text wraps within panel, all CTAs and form fields fit viewport
    pass: true
  360x800:
    capture_baseline_result: artifact-clip
    direct_chrome_result:    artifact-clip
    playwright_measurement:  panel=328, docScroll=360, no horizontal scroll
    visual_description:      Clean mobile render
    pass: true
  375x812:
    capture_baseline_result: artifact-clip
    direct_chrome_result:    artifact-clip
    playwright_measurement:  panel=343, docScroll=375, no horizontal scroll
    visual_description:      Clean mobile render — text wraps "Southeast / Florida luxury homeowners, absentee / owners, and qualified buyers — from a / small, deliberate practice."
    pass: true
  390x844:
    capture_baseline_result: artifact-clip
    direct_chrome_result:    artifact-clip
    playwright_measurement:  panel=358, docScroll=390, no horizontal scroll
    visual_description:      Clean mobile render
    pass: true
  414x896:
    capture_baseline_result: artifact-clip
    direct_chrome_result:    artifact-clip
    playwright_measurement:  panel=382, docScroll=414, no horizontal scroll
    visual_description:      Clean mobile render
    pass: true
  430x932:
    capture_baseline_result: pass (no artifact at this width)
    direct_chrome_result:    pass
    playwright_measurement:  panel=398, docScroll=430, no horizontal scroll
    visual_description:      Clean mobile render
    pass: true
  768x1024:
    capture_baseline_result: pass
    direct_chrome_result:    pass
    playwright_measurement:  panel=672, docScroll=768, no horizontal scroll
    visual_description:      Tablet layout, hero panel + image, search card spans viewport
    pass: true
  1280x800:
    capture_baseline_result: pass
    direct_chrome_result:    pass
    playwright_measurement:  panel=672, docScroll=1280, no horizontal scroll
    visual_description:      Desktop layout, premium composition
    pass: true
  1440x1000:
    capture_baseline_result: pass (capture-baseline only — direct chrome capture skipped to save time, playwright sufficient)
    playwright_measurement:  panel=672 (max-w-2xl cap), no horizontal scroll
    visual_description:      Wide desktop, plenty of breathing room
    pass: true
final_verdict:
  hero_mobile_safe: true
  patch_applied: false
  reason: |
    The Cycle 40B hero/search code is correct. Playwright with real Chromium
    confirms no overflow and no horizontal scroll at every viewport from 320
    up. The earlier headless-chrome screenshot artifact is a capture-pipeline
    limitation, not a page defect. No code change required to ship the
    cycle40b hero. The live deploy is the appropriate final-verification gate
    — Playwright-style captures should be used for live verification too.
followup_recommendation: |
  Switch capture-baseline.ts to drive screenshots via Playwright (or otherwise
  use CDP setDeviceMetricsOverride) so future visual QA matches real-device
  behavior. Filed as a smaller post-Cycle-40C improvement; not blocking deploy.
```
