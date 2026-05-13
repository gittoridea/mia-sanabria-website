# Cycle 23 Claude Lane — Mobile Readability Captures

**Generated:** 2026-05-13
**Trigger:** Per project `CLAUDE.md` rule — any visual edit requires before/after captures at 320/375/414/768.

## Edits in this cycle (visual)

| File | Change | Reason |
|---|---|---|
| `src/components/FeaturedMarketsPager.tsx` | Dot buttons now have 24×24 hit area (WCAG 2.2 target-size); visual dot unchanged at 10×10 inside | Lighthouse mobile target-size 0/100 |
| `src/components/insights/InsightCard.tsx` | "min read" badge `text-navy-800/55` → `/70` | Lighthouse mobile color-contrast 3.49:1 → ≥4.5:1 |
| `src/components/IdxEmbed.tsx` | IDX disclaimer `text-navy-800/60` → `/70` | Lighthouse mobile color-contrast 4.05:1 → ≥4.5:1 |
| `src/app/valuation/page.tsx` | Valuation-form helper `text-navy-800/60` → `/80` | Consistent with `/contact/` form helper |

## Before vs after sources

- **before/** — captures of live Cycle 22-R1 staging (`https://miasanabriarealtor.trueidea.com`) prior to this cycle's edits.
- **after/** — captures of locally-rebuilt `out/` served on `http://localhost:4178` after this cycle's edits.

## Contract-presence audit

`audit:mobile-readability` (4 viewports × 3 routes × 2 runs) → **24/24 PASS · 0 FAIL · 0 ERROR.** The script checks CSS contract tokens (body 16px, paragraph line-height ≥1.6, max-width 70ch, tap target ≥44px); my edits did not touch those tokens.

## Lighthouse delta (mobile, homepage)

| Category | Before | After |
|---|---|---|
| Performance | 73 | 74 |
| Accessibility | 93 | 100 |
| Best Practices | 100 | 100 |
| SEO | 69 | 69 (staging robots, flips on cutover) |

`color-contrast` and `target-size` both moved from score=0 → score=1.0 with 0 failing items.

## Routes captured

`/` (homepage — InsightsTeaser + IdxEmbed + FeaturedMarketsPager), `/insights/` (uses InsightCard), `/valuation/` (helper text).
