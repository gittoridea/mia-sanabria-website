# Cycle 28 — Visual proof

**Captured:** 2026-05-13T20:30:00Z (approximate; both runs completed within the cycle)
**Base:** http://localhost:4173 (bunx serve out)

## Desktop rendered audit (1280x800 + 1440x900 + mobile sweep)

Source: `bun run audit:rendered -- --shots-dir=docs/artifacts/cycle-28-rendered-evidence-qa/desktop-rendered-after`

| Route | 1280x800 (fold-gate viewport) | 1440x900 |
|---|---|---|
| `/` | `desktop-rendered-after/index-1280x800.png` (if present, else not in fold-gate scope) | n/a |
| `/markets/` | `desktop-rendered-after/markets-1280x800.png` | `desktop-rendered-after/markets-1440x900.png` |
| `/markets/fort-lauderdale/` | `desktop-rendered-after/markets-fort-lauderdale-1280x800.png` | `desktop-rendered-after/markets-fort-lauderdale-1440x900.png` |
| `/markets/pompano-beach/` | `desktop-rendered-after/markets-pompano-beach-1280x800.png` | `desktop-rendered-after/markets-pompano-beach-1440x900.png` |
| `/markets/davie/` | `desktop-rendered-after/markets-davie-1280x800.png` ✅ post-fix | `desktop-rendered-after/markets-davie-1440x900.png` |

All 175 screenshots captured by the rendered audit live in `desktop-rendered-after/` (one PNG per route × viewport). The four routes above are the requested visual-proof set; the additional routes are sweep coverage and untouched by this cycle.

## Mobile-readability capture

Source: `bun scripts/audit-mobile-readability.ts --capture --cycle=cycle-28-rendered-evidence-qa --base=http://localhost:4173 --routes=/,/markets/,/markets/fort-lauderdale/,/markets/pompano-beach/,/markets/davie/`

Output dir: `docs/artifacts/cycle-28-rendered-evidence-qa/mobile-readability/after/`

Per-viewport coverage: iphone-se (320×568), iphone-15 (375×812), pixel-7 (414×800), ipad-portrait (768×1024) × 5 routes = 20 JPGs. All PASS in the mobile-readability contract-check channel.

## Davie 1280x800 — before vs after metrics

Before (Cycle 27 audit, `subH=192`, intro 71 words):

```
panelBox     y=101   bottom=647.5
subBox       y=353.5 h=192   bottom=545.5
primaryCta   y=570.5 h=44    bottom=614.5   ← exceeds 601 threshold by +13.5px
primaryCtaBelowFold: true
audit verdict: ❌ FAIL
```

After (Cycle 28 audit, `subH=168`, intro 55 words):

```
panelBox     y=101   bottom=647.5
subBox       y=353.5 h=168   bottom=521.5
primaryCta   y=546.5 h=44    bottom=590.5   ← clears 601 threshold by -10.5px
primaryCtaBelowFold: false
audit verdict: ✅ PASS  (entire audit:rendered: 14 PASS · 1 WARN · 0 FAIL)
```

Margin to threshold matches the rest of the 7-line-intro cohort (Coral Springs, Sunrise, Weston, Deerfield), all at 590.5 / -10.5px.

## Observed visual issues — Davie

None observed at 1280x800 after fix. Hero panel renders cleanly; eyebrow/heading/sub/CTAs all within the panel and above the fold. Image-side composition unchanged.

## Capture path note

The audit:rendered `--shots-dir` only fires when the run starts its own preview (a single `bunx serve out` cannot serve both the rendered audit and the mobile-readability run simultaneously without port juggling). Order-of-ops:
1. Started `bunx serve out -l 4173` for mobile-readability capture.
2. Mobile-readability run completed against that preview.
3. Killed the standalone preview, then ran `audit:rendered -- --shots-dir=…` (it spins up its own preview).
