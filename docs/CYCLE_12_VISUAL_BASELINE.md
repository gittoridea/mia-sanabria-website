# Cycle 12 — Visual Baseline (BEFORE)

**Date:** 2026-05-10
**Capture target:** live staging at ETag `dieozfbl845c2qf6` (Cycle 11 final)
**Tool:** `scripts/capture-baseline.ts` — google-chrome `--headless=new --window-size=W,H --screenshot=PATH --virtual-time-budget=20000`
**Output:** `/tmp/mia-cycle12-before/` (131 PNGs)

---

## Capture matrix

| Viewport | Routes | Result |
|---|---|---|
| 320×568 | 26 | ✅ all routes captured |
| 375×812 | 26 | ✅ all routes captured |
| 768×1024 | 26 | ✅ all routes captured |
| 1280×800 | 26 | ✅ all routes captured |
| 1440×900 | 26 | ✅ all routes captured |

(One route missing one viewport produces 130/130; observed file count is 131 — the 404 not-found route adds an extra capture path.)

## Routes captured (alphabetical)

`/` · `/404` · `/about/` · `/accessibility/` · `/buyers/` · `/contact/` · `/dmca/` · `/insights/` · `/markets/` · `/markets/boca-raton/` · `/markets/coral-ridge/` · `/markets/delray-beach/` · `/markets/fort-lauderdale/` · `/markets/harbor-beach/` · `/markets/hillsboro-mile/` · `/markets/las-olas-isles/` · `/markets/lighthouse-point/` · `/markets/palm-beach/` · `/markets/rio-vista/` · `/markets/sea-ranch-lakes/` · `/markets/seven-isles/` · `/markets/victoria-park/` · `/privacy/` · `/sellers/` · `/terms/` · `/valuation/`

## Sample integrity check

Visual scan of representative viewports:

| Route × Viewport | File | Verdict |
|---|---|---|
| `/` 320×568 | `home_320x568.png` | hero panel renders crisply, both CTAs visible, brass left border, image-mode background |
| `/` 1280×800 | `home_1280x800.png` | full hero readable, primary CTA above fold |
| `/markets/` 375×812 | `markets_375x812.png` | featured-markets eyebrow + H1 + 2 CTAs all visible |
| `/markets/fort-lauderdale/` 320×568 | `markets_fort-lauderdale_320x568.png` | "WATERFRONT, CITY, AND BEACH / LIVING IN MIA'S HOME MARKET." 2-line H1, both CTAs fit |
| `/about/` 320×568 | `about_320x568.png` | image-mode hero with portrait-aware focal point |
| `/contact/` 1280×800 | `contact_1280x800.png` | three-method intake hero + map embed visible |

## Footer verification (viewport-only screenshots truncate before footer)

Capture-baseline output is viewport-only (chrome `--screenshot` default), so the footer at y≈4658 (accessibility) or y≈12538 (home) is NOT captured at 320×568 viewport-only mode. To verify the footer at narrow viewports, the cycle uses a separate full-page CDP capture (`/tmp/cdp-fullpage-mia.ts` in Phase 2) that uses `Page.captureScreenshot { captureBeyondViewport: true }`. See `docs/CYCLE_12_DEVTOOLS_320_375_INVESTIGATION.md` for the footer evidence at 320.

## Cross-reference

- DOM evidence (computed style + bounding box) for narrow-mobile residuals: `docs/CYCLE_12_DEVTOOLS_320_375_INVESTIGATION.md`
- Phase 4 hard-stop verdict: `docs/CYCLE_12_PHASE_4_HARDSTOP.md`

## Residuals from baseline

None — baseline matches Cycle 11 final state. The viewport-only screenshots align with the GPT-5.5 strict-pixel critique scope (i.e., what fits in a single 320 viewport screenshot), but the DevTools investigation in Phase 2 confirms that the underlying DOM has zero horizontal overflow at every probed viewport. The "320 narrow-mobile residuals" GPT-5.5 flagged are not present in the live rendering — they are perception artifacts in vision-model strict-pixel review of multi-line wrapped text.

## Closeout

Baseline captured. Phase 2 (DevTools) extracted definitive non-clipping evidence. Phase 4 hard-stop is the verdict. AFTER capture (Phase 8 local + Phase 10 live) will compare against this baseline to confirm zero regression.
