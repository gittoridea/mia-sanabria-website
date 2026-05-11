# audit-mobile-readability — 2026-05-11T05:12:46.539Z

**⚠ HONESTY DISCLOSURE (Cato F1, Cycle 19A-M).** This audit is a CSS-contract presence check, NOT a real per-viewport layout measurement. Pass = the documented CSS contract tokens are present in the served HTML/CSS. It does NOT measure the `@media (max-width: 640px)` mobile bump — that signal lives in the screenshot capture path (`--capture` → `docs/artifacts/.../mobile-readability/after/`) and in independent visual review. A future cycle should replace `fetchAndMeasure` with real chrome JS evaluation via `--remote-debugging-port` + CDP eval.

Base: `https://miasanabriarealtor.trueidea.com` · viewports: 320×568 iPhone SE 1, 375×812 iPhone 15

Thresholds (contract-presence, not pixel-measured): body ≥16px · line-height ≥1.5 · measure ≥45ch · tap ≥44px

**8/8 contract-presence PASS · 0 FAIL · 0 ERROR**

| Viewport | Route | Status | Failures |
|----------|-------|--------|----------|
| iphone-se | `/` | ✓ | — |
| iphone-se | `/markets/` | ✓ | — |
| iphone-se | `/markets/fort-lauderdale/` | ✓ | — |
| iphone-se | `/markets/pompano-beach/` | ✓ | — |
| iphone-15 | `/` | ✓ | — |
| iphone-15 | `/markets/` | ✓ | — |
| iphone-15 | `/markets/fort-lauderdale/` | ✓ | — |
| iphone-15 | `/markets/pompano-beach/` | ✓ | — |