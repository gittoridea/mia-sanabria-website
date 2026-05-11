# Cycle 19A-M — mobile-readability screenshot evidence

> Binary `.jpg` files are gitignored (`docs/artifacts/**/*.jpg`).
> Reports under `reports/audit-mobile-readability.{json,md}` are tracked.
> To regenerate the screenshots on any machine:

```bash
bun run audit:mobile-readability:capture
```

This runs the headless-Chrome screenshot pass at 4 viewports × 14 routes against the live staging site (`https://miasanabriarealtor.trueidea.com`), writing 56 JPGs to `after/`. To capture a fresh `before/` baseline (against an alternate URL or branch), use:

```bash
bun run audit:mobile-readability:capture -- --base=https://other-host.example.com
```

## Manifest

This cycle captured:

- **`before/`** (56 JPGs) — pre-cycle staging at live ETag `difgit5lydj44nrd`. Type scale was: `p { line-height: 1.65; max-width: 70ch }` for all viewports; body font fixed at 16px. No mobile-specific `@media (max-width: 640px)` rules.
- **`after/`** (56 JPGs) — post-cycle staging at live ETag `<post-deploy-etag>`. Type scale at ≤640px: line-height 1.72, measure cap 62ch, body bump to 17px, tap-targets `min-height: 44px` on main/nav/footer anchors. Desktop type scale (>640px) unchanged.

## Viewports

| name | width × height | label |
|------|----------------|-------|
| iphone-se | 320 × 568 | iPhone SE 1 |
| iphone-15 | 375 × 812 | iPhone 15 |
| pixel-7 | 414 × 896 | Pixel 7 |
| ipad-portrait | 768 × 1024 | iPad Portrait |

## Routes (14)

`/`, `/markets/`, `/markets/fort-lauderdale/`, `/markets/pompano-beach/`, `/markets/boca-raton/`, `/markets/delray-beach/`, `/contact/`, `/valuation/`, `/buyers/`, `/sellers/`, `/about/`, `/insights/`, `/insights/fort-lauderdale-waterfront-buyer-guide/`, `/insights/why-automated-valuations-miss-luxury-waterfront/`

= 4 × 14 = 56 screenshot files per side.
