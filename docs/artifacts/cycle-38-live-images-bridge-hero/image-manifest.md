# Cycle 38 — Image Manifest

date: 2026-05-16

## Regenerated this cycle (Cycle 38)

| Asset path | bytes | dimensions | git-tracked | last commit (post-Cycle-38) |
|------------|-------|------------|-------------|------------------------------|
| `public/markets/coral-springs.jpg` | 394,510 | 1200×1500 | yes | Cycle 38 commit |
| `public/markets/davie.jpg` | 263,928 | 1200×1500 | yes | Cycle 38 commit |
| `public/markets/deerfield-beach.jpg` | 199,686 | 1200×1500 | yes | Cycle 38 commit |
| `public/markets/hollywood.jpg` | 271,516 | 1200×1500 | yes | Cycle 38 commit |
| `public/markets/plantation.jpg` | 379,393 | 1200×1500 | yes | Cycle 38 commit |
| `public/markets/sunrise.jpg` | 222,571 | 1200×1500 | yes | Cycle 38 commit |
| `public/markets/weston.jpg` | 405,135 | 1200×1500 | yes | Cycle 38 commit |
| `public/og-markets/coral-springs.jpg` | 198,915 | 1200×630 | yes | Cycle 38 commit |
| `public/og-markets/davie.jpg` | 133,336 | 1200×630 | yes | Cycle 38 commit |
| `public/og-markets/deerfield-beach.jpg` | 106,052 | 1200×630 | yes | Cycle 38 commit |
| `public/og-markets/hollywood.jpg` | 130,344 | 1200×630 | yes | Cycle 38 commit |
| `public/og-markets/plantation.jpg` | 186,532 | 1200×630 | yes | Cycle 38 commit |
| `public/og-markets/sunrise.jpg` | 122,791 | 1200×630 | yes | Cycle 38 commit |
| `public/og-markets/weston.jpg` | 185,248 | 1200×630 | yes | Cycle 38 commit |

## Cycle 37 (superseded for the 7 slugs above)

These were the framed/painterly outputs replaced by Cycle 38. Recoverable via
`git checkout ed24e69 -- public/markets/<slug>.jpg public/og-markets/<slug>.jpg`.

## Untouched in Cycle 38

The other 16 markets in `public/markets/` and `public/og-markets/` keep their
prior content. They were not part of the operator's report and pass the
photorealistic editorial bar.

## Audit gate

`bun run audit:neighborhood-images-deep` — PASS 23/23 markets after regeneration.
