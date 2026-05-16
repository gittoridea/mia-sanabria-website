# Cycle 39 — Image Manifest

date: 2026-05-16

All Cycle 39 image-asset changes.

## New versioned files on disk

| Path | Bytes | Provenance |
|------|------:|------------|
| public/markets/deerfield-beach-cycle39.jpg | 199 686 | copy of Cycle 38 deerfield-beach.jpg |
| public/markets/hollywood-cycle39.jpg | 271 516 | copy of Cycle 38 hollywood.jpg |
| public/markets/plantation-cycle39.jpg | 379 393 | copy of Cycle 38 plantation.jpg |
| public/markets/weston-cycle39.jpg | 405 135 | copy of Cycle 38 weston.jpg |
| public/markets/coral-springs-cycle39.jpg | 394 510 | copy of Cycle 38 coral-springs.jpg |
| public/markets/davie-cycle39.jpg | 263 928 | copy of Cycle 38 davie.jpg |
| public/markets/sunrise-cycle39.jpg | 222 571 | copy of Cycle 38 sunrise.jpg |
| public/og-markets/deerfield-beach-cycle39.jpg | 106 052 | copy of Cycle 38 deerfield-beach.jpg |
| public/og-markets/hollywood-cycle39.jpg | 130 344 | copy of Cycle 38 hollywood.jpg |
| public/og-markets/plantation-cycle39.jpg | 186 532 | copy of Cycle 38 plantation.jpg |
| public/og-markets/weston-cycle39.jpg | 185 248 | copy of Cycle 38 weston.jpg |
| public/og-markets/coral-springs-cycle39.jpg | 198 915 | copy of Cycle 38 coral-springs.jpg |
| public/og-markets/davie-cycle39.jpg | 133 336 | copy of Cycle 38 davie.jpg |
| public/og-markets/sunrise-cycle39.jpg | 122 791 | copy of Cycle 38 sunrise.jpg |
| public/hero/mia-home-hero-cycle39.jpg | 195 246 | copy of Cycle 38 mia-home-hero.jpg |

## Legacy unversioned files (retained on disk, no longer referenced by runtime)

| Path | Bytes | Status |
|------|------:|--------|
| public/markets/deerfield-beach.jpg | 199 686 | legacy — kept for external-link safety |
| public/markets/hollywood.jpg | 271 516 | legacy |
| public/markets/plantation.jpg | 379 393 | legacy |
| public/markets/weston.jpg | 405 135 | legacy |
| public/markets/coral-springs.jpg | 394 510 | legacy |
| public/markets/davie.jpg | 263 928 | legacy |
| public/markets/sunrise.jpg | 222 571 | legacy |
| public/og-markets/<seven>.jpg | varies | legacy (matching) |
| public/hero/mia-home-hero.jpg | 195 246 | legacy |

## Unchanged Cycle 38 + earlier image assets

Sixteen non-affected markets (fort-lauderdale, coral-ridge, victoria-park,
boca-raton, palm-beach, delray-beach, lighthouse-point, rio-vista,
harbor-beach, las-olas-isles, seven-isles, sea-ranch-lakes,
hillsboro-mile, pompano-beach, bay-colony, bermuda-riviera) and their OG
variants are untouched by Cycle 39. Their `heroImage:` literals in
`src/lib/markets.ts` continue to reference the unversioned path; the
helper returns the unversioned path because the slug is not in
`MIA_CYCLE_39_VERSIONED_SLUGS`.

## Build-time verification

`bun run build` emits:

- 0 references to `src="/markets/<slug>.jpg"` for the seven versioned
  slugs in `out/`.
- 2 references to `src="/markets/<slug>-cycle39.jpg"` per slug per route
  (card on /markets/ index + hero on /markets/<slug>/).
- 1 reference to `https://miasanabriarealtor.trueidea.com/og-markets/<slug>-cycle39.jpg`
  in each of the seven `out/markets/<slug>/index.html` og:image tags.
- 1 reference to `/hero/mia-home-hero-cycle39.jpg` in `out/index.html`
  (homepage hero image source).
- 0 references to the unversioned homepage hero in `out/index.html`.
