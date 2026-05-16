# Cycle 37 — Deep Neighborhood Image Audit

Tool: `scripts/audit-neighborhood-images-deep.ts`
Thresholds: hero ≥ 80,000 bytes, OG ≥ 60,000 bytes, hero ≥ 1200×1500, OG ≥ 1200×630.
Scope: every market slug in `ALL_MARKET_SLUGS` (`src/lib/mia.ts`).

## Results (post-Cycle-37 image generation)

| Slug | Hero KB | Hero W×H | OG KB | OG W×H | Status |
|------|--------:|----------|------:|--------|:------:|
| fort-lauderdale | 239 | 1200×1500 | 147 | 1200×630 | PASS |
| coral-ridge | 571 | 1200×1500 | 246 | 1200×630 | PASS |
| victoria-park | 551 | 1200×1500 | 239 | 1200×630 | PASS |
| boca-raton | 353 | 1200×1500 | 196 | 1200×630 | PASS |
| palm-beach | 261 | 1200×1500 | 150 | 1200×630 | PASS |
| delray-beach | 444 | 1200×1500 | 206 | 1200×630 | PASS |
| lighthouse-point | 276 | 1200×1500 | 134 | 1200×630 | PASS |
| rio-vista | 260 | 1200×1500 | 157 | 1200×630 | PASS |
| harbor-beach | 448 | 1200×1500 | 223 | 1200×630 | PASS |
| las-olas-isles | 310 | 1200×1500 | 175 | 1200×630 | PASS |
| seven-isles | 289 | 1200×1500 | 149 | 1200×630 | PASS |
| sea-ranch-lakes | 600 | 1200×1500 | 230 | 1200×630 | PASS |
| hillsboro-mile | 350 | 1200×1500 | 174 | 1200×630 | PASS |
| bay-colony | 409 | 1200×1500 | 159 | 1200×630 | PASS |
| bermuda-riviera | 388 | 1200×1500 | 152 | 1200×630 | PASS |
| pompano-beach | 274 | 1200×1500 | 134 | 1200×630 | PASS |
| **deerfield-beach** | **174** | **1200×1500** | **80** | **1200×630** | **PASS** (was 64 / 42 — Cycle 37 generated) |
| **hollywood** | **133** | **1200×1500** | **105** | **1200×630** | **PASS** (was 59 / 39 — Cycle 37 generated) |
| **plantation** | **255** | **1200×1500** | **122** | **1200×630** | **PASS** (was 58 / 38 — Cycle 37 generated) |
| **weston** | **173** | **1200×1500** | **136** | **1200×630** | **PASS** (was 57 / 37 — Cycle 37 generated) |
| **coral-springs** | **327** | **1200×1500** | **161** | **1200×630** | **PASS** (was 62 / 40 — Cycle 37 generated) |
| **davie** | **143** | **1200×1500** | **82** | **1200×630** | **PASS** (was 55 / 35 — Cycle 37 generated) |
| **sunrise** | **102** | **1200×1500** | **72** | **1200×630** | **PASS** (was 56 / 36 — Cycle 37 generated) |

`audit-neighborhood-images-deep: PASS — 23/23 markets`

## Pre-Cycle-37 placeholder-only state (recorded for posterity)

Before this cycle, the seven Cycle-25 neighborhoods (deerfield-beach, hollywood, plantation, weston, coral-springs, davie, sunrise) shipped with brand-tone placeholder JPGs at 36-65 KB. The previous `audit:images` PASS reports were structurally correct but visually blind: existence + file-size > 0 was enough. Cycle 37 introduces a real-richness threshold via this new audit so the regression cannot recur silently.
