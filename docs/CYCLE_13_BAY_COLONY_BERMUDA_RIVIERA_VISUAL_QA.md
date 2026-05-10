# Cycle 13 — Visual QA · Bay Colony + Bermuda Riviera

**Date:** 2026-05-10
**Method:** local-build static-export served at `http://localhost:8765/`, captured with `google-chrome --headless=new --no-sandbox --window-size=W,H` per `feedback_interceptor_headless_server_fallback.md` (Interceptor unavailable on this Linux server, real-Chrome headless is the verified pattern).

## Capture set

24 screenshots: 6 routes × 4 viewports.

| Routes | Viewports |
|---|---|
| `/`, `/markets/`, `/markets/bay-colony/`, `/markets/bermuda-riviera/`, `/markets/coral-ridge/`, `/markets/harbor-beach/` | `320×568`, `375×812`, `1280×800`, `1440×900` |

Stored at `/tmp/mia-cycle13-after/` (filenames: `<route>_<viewport>.png`).

**BEFORE** = live `https://miasanabriarealtor.trueidea.com` Cycle 12 close (ETag `diezhj5m794w2qf6`, `Sun, 10 May 2026 12:09:14 GMT`) — captured continuously via the Cycle 12 visual baseline at `/tmp/mia-cycle12-live-after/`. The new routes do not exist on the BEFORE site by construction; existing routes are sampled from BEFORE.

## Verdict per axis

| Axis | Result | Evidence |
|---|---|---|
| Bay Colony hero — desktop fold | PASS | `/tmp/mia-cycle13-after/markets_bay-colony_1440,900.png` shows full hero panel + both CTAs above fold; `/markets/bay-colony/_1280,800.png` likewise |
| Bermuda Riviera hero — desktop fold | PASS | `/tmp/mia-cycle13-after/markets_bermuda-riviera_1440,900.png` shows full hero panel + both CTAs above fold; intro shortened from 437 → 311 chars to keep CTA above fold at 1280×800 |
| Bay Colony hero — mobile (320 / 375) | PASS | hero stacks vertically with copy panel over image; CTAs visible inside viewport; matches Eastern-FtL neighborhood pattern |
| Bermuda Riviera hero — mobile | PASS | same — vertical stack, both CTAs visible |
| `/markets/` index — new cards present | PASS | `audit:images.everyMarketCardImagePresent` PASS — all 15 markets render `<img src=/markets/SLUG.jpg>`; `bay-colony` and `bermuda-riviera` appear in `Eastern Fort Lauderdale neighborhoods` partition |
| Homepage Featured Markets — 8 cards | PASS | `audit:images.homepageFeaturedCards` PASS — `all 8 featured cards render <img src="/markets/SLUG.jpg">`; layout grid `lg:grid-cols-3` resolves to 3+3+2 cleanly |
| Existing-route regression — Coral Ridge | PASS | `/tmp/mia-cycle13-after/markets_coral-ridge_*.png` matches Cycle-12 baseline framing (object-bottom override preserved) |
| Existing-route regression — Harbor Beach | PASS | `/tmp/mia-cycle13-after/markets_harbor-beach_*.png` matches; gated-luxury hero unchanged |
| Hero contrast (rendered pixels) | PASS | `audit:hero-contrast --samples=1` returns 105 PASS (was 95 in Cycle 12; +10 from 2 new routes × 5 viewports). 0 WARN / 0 FAIL |
| Mobile horizontal overflow | PASS | `audit:rendered.mobile.noHorizontalOverflow` — 0 overflow at 27 viewport-honest probes |
| Stale strings | PASS | `audit:rendered.staleStrings.absent` — 0 hits across all rendered surfaces (including new routes) |
| Image visibility | PASS | both new market images are 1200×1500 progressive JPEG (sized to match the existing 13); rendered cards on `/markets/` show actual photography (not flat dark blocks) |
| Footer trust strip | PASS | inherited via `SiteFooter`; no source changes; `audit:brand.footerTrustElements` PASS |

## Image quality check

Bay Colony hero (`public/markets/bay-colony.jpg`, 409 KB, 1200×1500 progressive JPEG): editorial luxury composition — gated waterfront estate with motoryacht moored at private deepwater dock, ornate iron security gate visible at lower-right, mature royal palms framing the foreground, contemporary white-stucco architecture, late golden-hour light. Matches the established Eastern-FtL neighborhood photography spec.

Bermuda Riviera hero (`public/markets/bermuda-riviera.jpg`, 388 KB, 1200×1500 progressive JPEG): editorial luxury composition — refined mid-century-modern home with signature low-slung horizontal architecture and wide eaves, walls of glass facing the canal, brick paver driveway, mature live-oak canopy in the foreground, motoryacht at the seawall. Visually anchors the Bermuda Riviera mid-century-modern positioning.

OG images derived from heroes via center-crop to 1.91:1 (`public/og-markets/{bay-colony,bermuda-riviera}.jpg`, 1200×630, ~155 KB each, 86 quality progressive mozjpeg). Match the `og-derive.ts` pattern used for the prior 6 markets.

## CTA-fold defect found and corrected

`audit:rendered.hero.primaryCtaAboveFoldDesktop` initially flagged `/markets/bermuda-riviera/` at 1280×800 — the Bermuda Riviera intro was too long (437 chars vs ~313–374 char range of comparable Eastern-FtL neighborhood markets) and pushed the second CTA below the fold. Tightened to 311 chars while preserving the verifiable spine (waterfront, east of Bayview Drive, west of Intracoastal, mid-century-modern heritage, deepwater canal homes, near Galt Ocean Mile). Re-audit returned `0 FAIL`.

## Audit chain (post-Cycle-13)

```
audit:stale       — clean
audit:schema      — 165 JSON-LD blocks across 29 pages (was 149 / 27)
audit:links       — 1351 internal links checked, 0 broken
audit:seo         — 0 warnings
audit:completeness — 15 PASS · 1 WARN (BLOCKED-BY-GHL forms — Cycle 12)
audit:images       — 14 PASS · 0 WARN · 0 FAIL — confirms 15 market heroes + 15 OG + 8 featured cards
audit:brand        — 12 PASS · 0 WARN · 0 FAIL
audit:hero-contrast — 105 PASS · 0 WARN · 0 FAIL (was 95 — +10 = 2 routes × 5 viewports)
audit:rendered     — 14 PASS · 1 WARN · 0 FAIL (matches Cycle 12 baseline; 1 WARN is the F6 viewportSanity sentinel — intended)
typecheck/lint/build — exit 0
```

## Verdict

**PASS.** Bay Colony and Bermuda Riviera integrate cleanly into the existing market system. Existing markets did not regress. Audit chain is green at the same level as Cycle 12 close (with the +10 hero-contrast probes from the new routes), and the new pages match the established editorial-luxury aesthetic.
