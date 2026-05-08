# Mobile + Accessibility Deep-Audit Methodology
## For: miasanabriarealtor.trueidea.com (Next.js 15 static export, Tailwind v4)
## Researcher: Ava Chen | Date: 2026-05-08

> **Premise:** Lighthouse mobile 75-90 + a11y 100 is the floor, not the ceiling. Below is what to deploy *beyond* Lighthouse to ship a luxury-realtor site that actually works for every visitor on every device — including assistive tech.

---

## 1. Mobile-Specific Audit BEYOND Lighthouse

### What Lighthouse Mobile MISSES [HIGH]
Lighthouse simulates a Moto-G-class device with 4× CPU slowdown + slow-3G throttling. It catches viewport meta absence and basic tap-target spacing — but it has been quietly **deprecating** mobile heuristics: "Content Not Sized Correctly" and "Illegible Font Size" are gone from the remote PageSpeed Insights API and only run locally. Source: [Request Metrics](https://requestmetrics.com/web-performance/the-limitations-of-lighthouse/).

**Specific blind spots:**
- **Touch-target adequacy by platform** — Lighthouse flags "tap targets too small" but uses a single ~48px heuristic. It does not differentiate iOS HIG (44×44pt = ~59px rendered) vs. Material Design (48×48dp). [Smashing Magazine cheatsheet](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/) [HIGH]
- **Hover-only affordances on touch** — `:hover`-revealed CTAs/menus/tooltips are invisible on touch devices. Lighthouse never tests this.
- **Scroll-snap behavior** — `scroll-snap-type: y mandatory` on a hero can trap iOS Safari scrolling. Manual test only.
- **Bottom-nav-area accessibility** — iOS Safari's home-indicator bar (~34px) overlaps fixed-bottom CTAs unless `env(safe-area-inset-bottom)` is honored.
- **Font-rendering on Safari iOS** — `-webkit-font-smoothing: antialiased` vs. `subpixel-antialiased`; system-ui font fallback chains differ on iOS 17+.
- **Form-input zoom-on-focus** — any `<input>` with `font-size < 16px` triggers Mobile Safari auto-zoom on focus. Lighthouse misses it. ([CSS-Tricks confirmed](https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/), [Stefan Judis](https://www.stefanjudis.com/notes/mobile-safari-doesnt-zoom-into-form-inputs-with-minimum-16px/)) [HIGH]

### Tools to Deploy

| Tool | Use | Mode |
|------|-----|------|
| **axe DevTools mobile** (Deque) | Mobile-emulated a11y scan with iOS/Android viewport profiles | manual + CI |
| **Pa11y** (`pa11y --runner axe --runner htmlcs <url>`) | Headless mobile a11y, CLI-friendly, complements axe (different rule set) | CI |
| **Unlighthouse** | Sitemap-driven multi-route Lighthouse with HTML dashboard | local + CI ([docs](https://unlighthouse.dev/learn-lighthouse/lighthouse-ci)) |
| **Real-device loops** | Actual iPhone (Safari) + actual Android (Chrome) — emulators miss font rendering, gesture handling, Safari quirks | manual |
| **`@axe-core/playwright`** | Programmatic a11y assertions inside E2E tests | CI |

### Key Viewports to Test
- **375 × 667** — iPhone SE (smallest active iPhone, ~10% of US iOS traffic)
- **390 × 844** — iPhone 14/15 (modal target)
- **412 × 892** — Pixel 7/8 (Android reference)
- **768 × 1024** — iPad portrait (luxury realtor demo skews iPad)
- Bonus: **320 × 568** (iPhone 5/SE-1) for layout-shift floor-test

---

## 2. Accessibility Deep-Audit (WCAG 2.1 AA + ADA Title III)

### Why Lighthouse a11y = 100 ≠ ADA-Compliant [HIGH]

**Hard data:** Automated tools catch 25-40% of WCAG violations. axe-core itself catches ~57%. The remaining 43-75% requires manual review. Source: [Accesify](https://www.accesify.io/blog/accessibility-testing-automation-axe-pa11y-lighthouse-ci/), [Inclly comparison](https://inclly.com/resources/accessibility-testing-tools-comparison) [HIGH]

**Note on regulatory deadline:** The DOJ ADA Title II rule sets a firm WCAG 2.1 AA deadline of **April 24, 2026** for state/local government. ADA Title III (private sector / "places of public accommodation," which includes realtor websites) has no statutory deadline but courts have repeatedly applied WCAG 2.1 AA as the de facto standard ([Upsun summary](https://upsun.com/blog/ada-title-ii-mandate-higher-ed-wcag-2-1-aa/)). [HIGH on deadline date; MED on Title III applicability — courts treat WCAG 2.1 AA as the standard but no statute mandates it]

### What axe-core / Lighthouse Miss

- **ARIA-live regions** — Did the "form submitted" message get announced? Tools see `aria-live="polite"` exists; only screen readers prove the announcement fired in correct order.
- **Keyboard trap detection** — Modal/dropdown focus return; Tab/Shift+Tab loop integrity. Manual test.
- **Focus visibility under Windows High Contrast / macOS Increase Contrast** — `outline: none` with custom `box-shadow` focus often disappears under forced-colors mode.
- **Screen-reader announcement order** — DOM order vs. visual order; CSS `order:` and `flex-direction: row-reverse` desync the two.
- **Reading order in complex hero sections** — overlapping H1 + image + CTA: which does VoiceOver hit first?
- **Skip-link visibility** — present in DOM but `position: absolute; left: -9999px` until focus — needs visible focus state.

### Manual Testing Required

| Test | Tool | What to verify |
|------|------|----------------|
| VoiceOver walkthrough (iOS + macOS) | built-in | Announcement order, image alt readability, form label association |
| NVDA walkthrough (Windows) | [free download](https://www.nvaccess.org/) | Heading hierarchy, landmark navigation, dynamic content announcements ([WebAIM guide](https://webaim.org/articles/nvda/)) |
| Keyboard-only navigation | OS keyboard | Tab order = visual order; no traps; focus visible at every step |
| 200% zoom | browser | No horizontal scroll; all content reachable |
| 400% zoom | browser | WCAG 1.4.10 reflow — single-column layout works |
| Screen magnifier (ZoomText / macOS Zoom) | OS | Tooltip & hover content reachable when magnified |
| Color-vision simulators | Chrome DevTools "Rendering" panel | Protanopia / Deuteranopia / Tritanopia / Achromatopsia — luxury palette must still convey hierarchy |
| forced-colors (Windows HC mode) | DevTools "Rendering" → Emulate CSS media features | `forced-colors: active` — focus rings, borders, links remain visible |

---

## 3. Layout-Shift + Touch-Target Issues — Hero-Image Pages

### Hero Overlap & H1 Wrap on Small Screens
At 375px width with a 99KB JPEG hero, the H1 "Mia Sanabria — Luxury SE Florida Realtor" easily wraps to 3-4 lines. Common failures:
- H1 wraps under the gradient/overlay region → invisible against bright sky
- Sticky-header eats the top 64-80px → H1 covered on scroll-restore (browser back-nav)
- Aspect-ratio shift between mobile (4:5) and desktop (16:9) hero causes CLS spike if `aspect-ratio` not declared upfront

### Sticky-Header Collisions
- Sticky header + hash-link anchor → target lands *under* the header. Fix: `scroll-padding-top: 80px;` on `html`.
- Sticky header + iOS Safari URL bar collapse on scroll changes viewport height → recalculates `100vh` heroes mid-scroll. Fix: `100dvh` (dynamic viewport units).

### Touch-Target Spacing Standards [HIGH]
Authoritative numbers — verified across 3 sources:

| Standard | Minimum | Source |
|----------|---------|--------|
| **WCAG 2.5.8 (AA)** | 24×24 CSS px | [W3C](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) |
| **WCAG 2.5.5 (AAA)** | 44×44 CSS px | W3C |
| **Apple HIG** | 44×44 pt (≈59px rendered) | [LogRocket](https://blog.logrocket.com/ux-design/all-accessible-touch-target-sizes/) |
| **Material Design (Android)** | 48×48 dp | Google MD spec |
| **Best practice** | 44×44 + ≥10px gap | [Smashing](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/) |

**Practical rule for Mia's site:** Any tappable element (nav link, CTA, social icon, listing card) ≥ 44×44 px with ≥ 8px gap. Spec WCAG 2.5.5 AAA (44px), not just 2.5.8 AA (24px).

### Form-Input Zoom-on-Focus Prevention (iOS Safari) [HIGH]
**The fix** — verified across 4 sources:
```css
input, select, textarea { font-size: max(16px, 1em); }
```
Do **NOT** use `<meta name="viewport" content="maximum-scale=1, user-scalable=no">` — this prevents zoom for low-vision users and violates [WCAG 1.4.4 Resize Text](https://defensivecss.dev/tip/input-zoom-safari/). [HIGH]

---

## 4. Lighthouse-CI Patterns for Static Export

### Multi-Route Setup
For a Next.js static export with `out/`, drive LHCI from your `sitemap.xml` rather than hardcoded URL lists — keeps coverage in sync with content.

```js
// lighthouserc.cjs
module.exports = {
  ci: {
    collect: {
      url: [
        'https://miasanabriarealtor.trueidea.com/',
        'https://miasanabriarealtor.trueidea.com/about',
        'https://miasanabriarealtor.trueidea.com/contact',
        'https://miasanabriarealtor.trueidea.com/markets/fort-lauderdale',
        // ...one entry per market page from sitemap
      ],
      numberOfRuns: 3, // median of 3, per LHCI docs — variance mitigation
      settings: {
        preset: 'desktop', // run desktop AND mobile separately
        // mobile defaults: 4× CPU slowdown, 1.6Mbps↓ / 750Kbps↑ slow-3G
      },
    },
    assert: {
      assertions: {
        'categories:performance':   ['error', { minScore: 0.90 }],
        'categories:accessibility': ['error', { minScore: 1.00 }],
        'categories:best-practices':['error', { minScore: 0.95 }],
        'categories:seo':           ['warn',  { minScore: 0.90 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift':  ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time':      ['error', { maxNumericValue: 200 }],
        'interactive':              ['warn',  { maxNumericValue: 3500 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci-reports', // commit to MEMORY/WORK/{slug}/lhci/
    },
  },
};
```
([LHCI configuration docs](https://googlechrome.github.io/lighthouse-ci/docs/configuration.html), [Yuri Kan budgets guide](https://yrkan.com/blog/lighthouse-performance-testing/)) [HIGH]

### Profiles to Run
- **Mobile + slow-3G + 4× CPU** (LHCI default `preset: 'mobile'`) — primary gate
- **Desktop + cable** (`preset: 'desktop'`) — secondary, looser thresholds (perf 95, LCP 1.8s)
- **`numberOfRuns: 3`** — median, mitigates LCP/CLS variance ([per Web.dev](https://web.dev/articles/lighthouse-ci))

### Where to Land JSON Output (PAI-Native)
- Per-run reports: `MEMORY/WORK/{mission-slug}/lhci/<timestamp>/`
- Cross-session trend: `MEMORY/KNOWLEDGE/Performance/mia-lhci-trend.jsonl` (one row per run)
- Hook to plot regression: extend `Tools/SessionHarvester.ts` to ingest

### Use Unlighthouse for Sitemap Auto-Discovery
[Unlighthouse](https://unlighthouse.dev/) discovers routes from `sitemap.xml` + crawl, runs Lighthouse against all of them, generates HTML dashboard. Faster path than hand-maintaining LHCI URL lists for a multi-market realtor site.

```bash
bunx unlighthouse --site https://miasanabriarealtor.trueidea.com \
  --output-path ./MEMORY/WORK/mia-sanabria/unlighthouse \
  --device mobile
```

---

## 5. Specific Gotchas the Prior Cycle Hit (Verified)

### Sharp libvips runtime needs LD_LIBRARY_PATH on Linux [HIGH]
Confirmed in PAI memory `feedback_artist_agent_batch_unreliable.md`. When Sharp is invoked from Bun on Linux servers, libvips dynamic loader can fail unless `LD_LIBRARY_PATH` includes `node_modules/sharp/build/Release/`. Mitigation: prefer direct `Generate.ts` CLI calls over Artist agent for batch image work.

### Caddy Stale Cache 7-10 min Post-Deploy [HIGH]
Confirmed in PAI memory `feedback_caddy_dokploy_cache_bust.md`. **Always cache-bust** post-deploy verification:
```bash
curl -sI "https://miasanabriarealtor.trueidea.com/?_=$(date +%s)" \
  -H "Cache-Control: no-cache, no-store"
```
Without it, post-deploy Lighthouse runs against stale assets and reports old metrics — false-positive "regression" or false-negative "fix verified."

### `images: { unoptimized: true }` Mandatory for Static Export [HIGH]
Confirmed in [Next.js docs](https://nextjs.org/docs/app/api-reference/components/image) + [Vercel discussion #60977](https://github.com/vercel/next.js/discussions/60977). Trade-off:
- **Loses:** Next.js `srcset`, automatic AVIF/WebP, responsive variants
- **Gains:** static-exportable build (no Vercel image optimizer dependency)

**Three viable mitigations:**
1. **Cloudflare Polish at cutover** (current plan per `docs/CDN_PREFLIGHT.md`) — Polish auto-converts to WebP/AVIF + lossless re-encode on the edge. Requires DNS-proxied (orange-cloud) Cloudflare.
2. **`next-image-export-optimizer`** — npm package that runs as post-build step, generates srcset variants for static export ([npm](https://www.npmjs.com/package/next-image-export-optimizer)). Adds build complexity but keeps `<Image>` component working pre-CDN.
3. **OpenNext Cloudflare adapter** (1.0 GA Feb 2026) — switches to Cloudflare Images via `/cdn-cgi/image/` loader. Bigger architectural change.

**Recommendation for Mia:** Stay on Polish (path 1) — least change, highest leverage. Polish on the LCP hero image is the single biggest win available; expect LCP 6.4s → ~2.0s on the regression page.

### Bonus Gotcha — Next.js 15 hreflang [HIGH]
From PAI memory `knowledge_nextjs_15_static_export_hreflang.md`: `metadata.alternates.languages` does NOT emit `<link rel="alternate" hrefLang="...">` tags in static export. Render explicit `<link>` tags in `layout.tsx` head if multilingual SEO needed. Not blocking now but logged for the day Mia adds Spanish.

---

## Confidence Summary

| Section | Confidence | Independent Sources |
|---------|-----------|---------------------|
| §1 Mobile beyond Lighthouse | HIGH | 4 (Request Metrics, Smashing, CSS-Tricks, Defensive CSS) |
| §2 A11y deep-audit | HIGH | 5 (TestParty, Accesify, Deque, WebAIM, Inclly) |
| §3 Touch targets / iOS zoom | HIGH | 5 (W3C, LogRocket, Smashing, CSS-Tricks, Stefan Judis) |
| §4 LHCI patterns | HIGH | 3 (LHCI docs, Web.dev, Yuri Kan) |
| §5 Gotchas | HIGH | PAI memory + 3 external (Next.js docs, npm, OpenNext) |

---

## Recommended Order for Next Session

1. **Fix iOS form-zoom** — 1-line CSS, `font-size: max(16px, 1em)` on inputs (~5 min)
2. **Audit touch targets** — DevTools elements panel, ensure ≥44×44 with ≥8px gap on all CTAs (~30 min)
3. **Add `scroll-padding-top` + `100dvh`** for sticky-header + iOS Safari URL bar (~10 min)
4. **Stand up LHCI** — `lighthouserc.cjs` + GitHub Action (~1 hour)
5. **Add Pa11y to CI** — second a11y rule set; cheap insurance (~30 min)
6. **Manual NVDA + VoiceOver walkthrough** — homepage + contact form, 30-min sweep
7. **Cloudflare Polish at cutover** — closes 4-second LCP gap on home regression
8. **Color-vision + forced-colors emulation** — DevTools Rendering panel, 15-min sweep

Total: ~3.5 hours of human work to ship a luxury-realtor site that beats Lighthouse 100/100 *and* passes manual a11y review.
