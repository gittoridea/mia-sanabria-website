# Cycle 8 — Hero Visual Baseline

**Captured:** 2026-05-09
**Live URL:** `https://miasanabriarealtor.trueidea.com/` (cycle-7 HEAD `8600a5e`, ETag `die7ha04szcw2mxs`)

## Capture parameters

- `google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=W,H --virtual-time-budget=20000 --screenshot=...`
- Cache-bust `?_=$(date +%s)` appended to every URL
- 12 routes × 5 viewports = 60 PNGs at `/tmp/mia-cycle8-before/`
- Plus pre-existing `/tmp/mia-cycle7-live-defect-after/viewport/` and `/tmp/mia-cycle7-live-defect-after/tall/` from the cycle-7 closeout (which is functionally cycle-8 BEFORE)

## Routes captured

`/`, `/about/`, `/markets/`, `/buyers/`, `/sellers/`, `/valuation/`, `/contact/`, `/markets/fort-lauderdale/`, `/markets/las-olas-isles/`, `/markets/harbor-beach/`, `/markets/boca-raton/`, `/markets/delray-beach/`

## Viewports

- 320×568 mobile-sm
- 375×812 mobile-md
- 768×1024 tablet
- 1280×800 laptop
- 1440×900 desktop

## What the screenshots show — verdict per major route × desktop+mobile

| Route | Viewport | H1 readable? | Pattern |
|---|---|---|---|
| `/` | desktop 1440 | **NO** | "LUXURY AND WATERFRONT REAL ESTATE…" renders as faint cream-tinted thin outlines over bright marina/yacht photo; letters look translucent/ghosted; sub-text on navy band below is readable |
| `/` | mobile 375 | **NO** | Same defect, gold/cream outlined Cinzel letters; H1 not readable as continuous body text |
| `/about/` | desktop 1440 | **NO** | "A PERSONAL PRACTICE FOR LUXURY AND WATERFRONT REAL ESTATE" — same ghosting on Las Olas Isles waterfront house |
| `/markets/` | desktop 1440 | **NO** | "SOUTHEAST FLORIDA'S MOST COVETED COASTAL COMMUNITIES" — same ghosting on Hillsboro Mile oceanfront |
| `/buyers/` | desktop 1440 | **NO** | "PRIVATE BUYER REPRESENTATION ACROSS SOUTHEAST FLORIDA" — same ghosting on living-room interior |
| header (cream nav) | all | YES | "MIA SANABRIA · REALTOR® · LPT REALTY" reads cleanly |
| sub-text under H1 | most | YES | sits lower in viewport on darker mood-gradient band |
| CTA primary brass | most | YES | brass-400 bg + navy-900 text + lift shadow keeps it legible |
| CTA secondary | desktop | YES (cycle-7 fix) | navy-900/40 fill + cream-100/70 border keeps it readable |

**Summary:** the defect is a STRUCTURAL hero-H1-only failure across every image-mode hero in production. Sub-text and CTAs are unaffected. The cycle-7 audits PASS but the rendered output FAILS for the user.

## Why each pattern fails (paired with retrospective §1)

1. **H1 sits in the lightest band of the mood gradient.** `from-navy-900/55 via-navy-900/40 to-navy-900/70` — middle is the LEAST dark. The H1 renders mid-section due to `py-28 sm:py-32 lg:py-40` padding.
2. **Desktop right-edge of H1 falls into weak content-scrim coverage.** `sm:from-navy-900/95 sm:via-navy-900/70 sm:to-navy-900/20` — right portion of `max-w-3xl` H1 sits where the scrim is only navy/20 (very weak).
3. **Tight 3px black drop-shadow doesn't blur enough to bridge bright pixels.** `[text-shadow:0_2px_3px_rgba(0,0,0,0.8)]` is structural insurance; on bright tropical sky/water pixels it is consumed by the photo.
4. **`max-w-3xl` + `[text-wrap:balance]` lets letters straddle the scrim/non-scrim boundary.** When the H1 wraps to two/three lines, edges of letters land in inconsistently dark regions.
5. **Audits validate token presence, not pixel contrast.** `brand.heroH1ContrastTokens` checks the CSS tokens are present; `brand.heroNoNavyGlowHalo` proves the cycle-5 anti-pattern is gone (negative-only); `brand.heroOverlayLayers` verifies the three layers exist. None measure rendered glyph vs background contrast.

## Failure type classification

- **Image choice:** correct (luxury cinematic intent matches brand)
- **Overlay strength:** insufficient at desktop right edge AND middle-band
- **Text effect (shadow):** too tight, no blur halo
- **Typography:** Cinzel-700 is loaded but at large display sizes thin glyphs need wider stroke OR a deterministic dark field under them
- **Layout:** H1 should NOT be on a generic global overlay; it needs a measured readable field
- **CTA styling:** acceptable post-cycle-7 fix
- **Composition:** the H1 should not require user to find the right image area to read it

## Conclusion: H1 should NOT be on raw image with only generic gradient

Per GPT-5.5 retrospective: "Stop relying on broad gradient mood layers as the primary readability mechanism. Choose a deterministic H1 reading field tied to the text box or a stronger editorial treatment using only existing navy/cream/brass tokens."

The Cycle 8 design decision (output of the next phase) chooses between Options A (stronger overlay), B (editorial split hero), C (content card / scrim panel), or D (page-specific hero modes) — and ships only after pixel-contrast audit passes locally AND on live staging.

## Hero-crop directory

`/tmp/mia-cycle8-before/hero-crops/` is reserved for cropped hero regions. Cropping is performed by `scripts/audit-hero-pixel-contrast.ts` (built in Phase 5) which locates the H1 by `data-hero-heading="true"`, samples glyph + background pixels, and computes WCAG AA contrast ratio. The crop is saved as evidence per route × viewport.

