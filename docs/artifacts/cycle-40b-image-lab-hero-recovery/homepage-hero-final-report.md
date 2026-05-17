# Cycle 40C — Homepage Hero Final Report

> Closes out the homepage-hero recovery work that began in Cycle 39 and
> continued through Cycle 40 / 40B. This report captures the asset, the
> mobile defenses, the cross-browser proof, and what remains operator-
> verifiable.

## Asset

```yaml
hero_asset: /hero/mia-home-hero-cycle40b.jpg
og_asset:   /hero/mia-home-hero-cycle40b-og.jpg
bytes_hero: 315139
bytes_og:   149774
source:     operator-authorized derivation from miasanabria.com daytime waterfront hero
alt_text:   "Daytime luxury waterfront residence with infinity pool and mature palms on calm Intracoastal Waterway, Southeast Florida"
```

## Component changes (Cycle 40B, shipped in 8095c78)

```yaml
src/components/Hero.tsx:
  - section: w-full max-w-full overflow-hidden (data-hero-overflow-version="cycle40b")
  - flex container: w-full max-w-7xl min-h-[440px] items-center px-4 py-8
  - panel wrap: w-full min-w-0 max-w-2xl
  - panel: box-border min-w-0 w-full max-w-full overflow-hidden [contain:inline-size] (data-hero-copy-panel-version="cycle40b")
  - heading: w-full max-w-full min-w-0 break-words [overflow-wrap:anywhere] [word-break:normal]
  - sub: w-full max-w-full min-w-0 text-[13px]→text-[15px] [text-wrap:pretty] [overflow-wrap:break-word] [word-break:break-word] hyphens-auto
  - CTAs: w-full max-w-full min-w-0 whitespace-normal text-balance (data-hero-cta-version="cycle40b")
src/components/HeroSearch.tsx:
  - floating outer: w-full max-w-full px-4 (data-hero-search-version="cycle40b")
  - inner: mx-auto w-full max-w-7xl min-w-0
  - form: box-border w-full max-w-full overflow-hidden [contain:inline-size]
  - selects: box-border min-w-0 max-w-full w-full
src/app/page.tsx:
  - wrap: relative w-full max-w-full overflow-x-clip
  - imageSrc: /hero/mia-home-hero-cycle40b.jpg (was /hero/mia-home-hero-cycle39.jpg)
src/app/globals.css:
  - html: overflow-x: clip
  - body: overflow-x: clip
```

## Real-browser proof (Cycle 40C, Playwright system Chromium)

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

Panel width = `viewport - 32px (px-4)` up to the `max-w-2xl` cap. Document
scrollWidth equals viewport at every viewport. No horizontal scroll. The
Cycle 40B defensive CSS holds.

## Capture-method caveat

`scripts/capture-baseline.ts` and direct `google-chrome --headless=new`
screenshots at 320/360/375/390/414 viewports show **apparent** overflow
because they pass `--window-size` only — Chromium sets the OS window size
but does NOT override the page's layout viewport. The page renders at the
default desktop layout and the screenshot saves only the leftmost N pixels.

Playwright (via CDP `Page.setDeviceMetricsOverride`) forces the layout
viewport to match the requested size, so the page lays out as a real mobile
device would and the screenshot reflects the actual user experience. Use
Playwright-based screenshots for any future narrow-viewport visual QA on
this codebase.

## Visual descriptions (Playwright captures saved in `cycle40c-mobile-hero-proof/playwright/`)

```yaml
320x800:
  description: "Header cream band with hamburger icon, dark navy hero panel inset 16px from edges, eyebrow + heading + sub all readable, sub wraps cleanly to four short lines, primary CTA Search-available-homes spans panel width, secondary Talk-with-Mia visible below, floating Bridge search card fits viewport with all three selects + Search Listings button"
  pass: true
375x812:
  description: "Same composition as 320, slightly more breathing room, sub: 'Discreet, local guidance for Southeast / Florida luxury homeowners, absentee / owners, and qualified buyers — from a / small, deliberate practice.'"
  pass: true
390x844:
  description: "Same composition, marginally more horizontal room"
  pass: true
430x932:
  description: "Sub fits across three lines comfortably, both CTAs side-stack vertically with full text labels"
  pass: true
768x1024:
  description: "Tablet — hero panel ~50% width on the left, waterfront image visible on the right, search card spans full content width"
  pass: true
1280x800:
  description: "Desktop — premium composition with hero image dominant, dark navy panel on the left edge with refined text hierarchy, search card stretches with 4-column layout"
  pass: true
1440x1000:
  description: "Same as 1280 with more breathing room"
  pass: true
```

## What remains operator-verifiable

Mia or Torrey on a real iPhone at the staging URL is the final truth test.
The Playwright proof is decisive for the AI-layer verification gate, but
the human eyes at an actual device close the loop. This is intentionally
NOT something I claim to have done.

## Conclusion

```yaml
hero_mobile_safe: true
hero_asset_active: true
patch_required: false
production_readiness: not_claimed
```
