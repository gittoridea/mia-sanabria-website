# audit-mobile-readability — 2026-05-13T18:56:02.977Z

**⚠ HONESTY DISCLOSURE (Cato F1, Cycle 19A-M).** This audit is a CSS-contract presence check, NOT a real per-viewport layout measurement. Pass = the documented CSS contract tokens are present in the served HTML/CSS. It does NOT measure the `@media (max-width: 640px)` mobile bump — that signal lives in the screenshot capture path (`--capture` → `docs/artifacts/.../mobile-readability/after/`) and in independent visual review. A future cycle should replace `fetchAndMeasure` with real chrome JS evaluation via `--remote-debugging-port` + CDP eval.

Base: `https://miasanabriarealtor.trueidea.com` · viewports: 320×568 iPhone SE 1, 375×812 iPhone 15, 414×896 Pixel 7, 768×1024 iPad

Thresholds (contract-presence, not pixel-measured): body ≥16px · line-height ≥1.5 · measure ≥45ch · tap ≥44px

**56/56 contract-presence PASS · 0 FAIL · 0 ERROR**

| Viewport | Route | Status | Failures |
|----------|-------|--------|----------|
| iphone-se | `/` | ✓ | — |
| iphone-se | `/markets/` | ✓ | — |
| iphone-se | `/markets/fort-lauderdale/` | ✓ | — |
| iphone-se | `/markets/pompano-beach/` | ✓ | — |
| iphone-se | `/markets/boca-raton/` | ✓ | — |
| iphone-se | `/markets/delray-beach/` | ✓ | — |
| iphone-se | `/contact/` | ✓ | — |
| iphone-se | `/valuation/` | ✓ | — |
| iphone-se | `/buyers/` | ✓ | — |
| iphone-se | `/sellers/` | ✓ | — |
| iphone-se | `/about/` | ✓ | — |
| iphone-se | `/insights/` | ✓ | — |
| iphone-se | `/insights/fort-lauderdale-waterfront-buyer-guide/` | ✓ | — |
| iphone-se | `/insights/why-automated-valuations-miss-luxury-waterfront/` | ✓ | — |
| iphone-15 | `/` | ✓ | — |
| iphone-15 | `/markets/` | ✓ | — |
| iphone-15 | `/markets/fort-lauderdale/` | ✓ | — |
| iphone-15 | `/markets/pompano-beach/` | ✓ | — |
| iphone-15 | `/markets/boca-raton/` | ✓ | — |
| iphone-15 | `/markets/delray-beach/` | ✓ | — |
| iphone-15 | `/contact/` | ✓ | — |
| iphone-15 | `/valuation/` | ✓ | — |
| iphone-15 | `/buyers/` | ✓ | — |
| iphone-15 | `/sellers/` | ✓ | — |
| iphone-15 | `/about/` | ✓ | — |
| iphone-15 | `/insights/` | ✓ | — |
| iphone-15 | `/insights/fort-lauderdale-waterfront-buyer-guide/` | ✓ | — |
| iphone-15 | `/insights/why-automated-valuations-miss-luxury-waterfront/` | ✓ | — |
| pixel-7 | `/` | ✓ | — |
| pixel-7 | `/markets/` | ✓ | — |
| pixel-7 | `/markets/fort-lauderdale/` | ✓ | — |
| pixel-7 | `/markets/pompano-beach/` | ✓ | — |
| pixel-7 | `/markets/boca-raton/` | ✓ | — |
| pixel-7 | `/markets/delray-beach/` | ✓ | — |
| pixel-7 | `/contact/` | ✓ | — |
| pixel-7 | `/valuation/` | ✓ | — |
| pixel-7 | `/buyers/` | ✓ | — |
| pixel-7 | `/sellers/` | ✓ | — |
| pixel-7 | `/about/` | ✓ | — |
| pixel-7 | `/insights/` | ✓ | — |
| pixel-7 | `/insights/fort-lauderdale-waterfront-buyer-guide/` | ✓ | — |
| pixel-7 | `/insights/why-automated-valuations-miss-luxury-waterfront/` | ✓ | — |
| ipad-portrait | `/` | ✓ | — |
| ipad-portrait | `/markets/` | ✓ | — |
| ipad-portrait | `/markets/fort-lauderdale/` | ✓ | — |
| ipad-portrait | `/markets/pompano-beach/` | ✓ | — |
| ipad-portrait | `/markets/boca-raton/` | ✓ | — |
| ipad-portrait | `/markets/delray-beach/` | ✓ | — |
| ipad-portrait | `/contact/` | ✓ | — |
| ipad-portrait | `/valuation/` | ✓ | — |
| ipad-portrait | `/buyers/` | ✓ | — |
| ipad-portrait | `/sellers/` | ✓ | — |
| ipad-portrait | `/about/` | ✓ | — |
| ipad-portrait | `/insights/` | ✓ | — |
| ipad-portrait | `/insights/fort-lauderdale-waterfront-buyer-guide/` | ✓ | — |
| ipad-portrait | `/insights/why-automated-valuations-miss-luxury-waterfront/` | ✓ | — |