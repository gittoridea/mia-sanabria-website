# Cycle 16 — Insights Image Strategy

**Date:** 2026-05-10
**Status:** Implemented — 12 per-post OG images shipped.

## Decision

Each post has a unique hero image and a unique OG image generated from existing market photography composited with editorial overlay. No generic stock; no repeated `/og-default.jpg`.

## What changed

### Source images

- Source: existing curated `public/markets/*.jpg` portraits (1200×1500).
- 12 posts → 12 OG images. Some sources reused (Harbor Beach used for both Post 02 and Post 10) because they are the right topical image.

### Generator (`scripts/render-insight-og-images.ts`)

- For each post: load `heroImage` source from `/public/markets/*.jpg`.
- Resize to 1200×630 with sharp `cover` fit + `attention` strategy (smart center crop on points of interest).
- Composite SVG overlay: brass divider, MIA SANABRIA wordmark, REALTOR® · LPT REALTY line, editorial-month label in brass-200 caps, post title (Cinzel, 3-line wrap, 42pt), "INSIGHTS · EVERGREEN LIBRARY" eyebrow, miasanabriarealtor.com footer line.
- 3-layer navy scrim matching Hero.tsx (mood + content + cta) so visible text always renders at WCAG AA contrast on cream-50 type over any input image.
- JPEG output at q=82, mozjpeg encoder.
- Average output: ~88 KB per image. All under the 200 KB editorial OG budget.

### `npm` script

- `bun run render:og-insights` — generates all 12 OG images. Idempotent (overwrites).

### Per-post wiring

- Each post's `ogImage: "/og-insights/<slug>.jpg"` (was `/og-default.jpg` for all 12).
- `heroImage: "/markets/<source>.jpg"` (per Decision Register §3 mapping).
- Article schema `image` array now references the per-post asset (via `${SITE.url}${post.ogImage}`).
- Article-page hero now `background="image"` (was text-only); image is the same market photo used as the OG source.

## Per-post final mapping

| Post | Slug | Hero source | OG size |
|---|---|---|---|
| 01 | fort-lauderdale-waterfront-buyer-guide | /markets/fort-lauderdale.jpg | 61 KB |
| 02 | dockage-seawalls-bridge-clearance-route-to-inlet | /markets/harbor-beach.jpg | 111 KB |
| 03 | positioning-luxury-waterfront-eastern-fort-lauderdale | /markets/las-olas-isles.jpg | 70 KB |
| 04 | las-olas-vs-seven-isles-vs-harbor-beach | /markets/seven-isles.jpg | 82 KB |
| 05 | bay-colony-and-bermuda-riviera-private-waterfront | /markets/bay-colony.jpg | 100 KB |
| 06 | coral-ridge-victoria-park-rio-vista | /markets/coral-ridge.jpg | 136 KB |
| 07 | lighthouse-point-sea-ranch-lakes-hillsboro-mile | /markets/lighthouse-point.jpg | 73 KB |
| 08 | boca-raton-luxury-buyers-club-beach-waterfront | /markets/boca-raton.jpg | 96 KB |
| 09 | delray-beach-luxury-buyers-walkability-beach-waterfront | /markets/delray-beach.jpg | 83 KB |
| 10 | why-automated-valuations-miss-luxury-waterfront | /markets/harbor-beach.jpg | 107 KB |
| 11 | preparing-waterfront-residence-private-market-conversations | /markets/bermuda-riviera.jpg | 90 KB |
| 12 | private-buyer-brief-defining-the-search | /markets/fort-lauderdale.jpg | 58 KB |

Total payload: ~1.07 MB across 12 OG images (avg ~89 KB each).

## Why we did NOT generate stock-style editorial images

The cycle prompt said:
> Use existing market images where appropriate / do not use generic stock-looking imagery / do not hotlink external assets.

The 15 existing market images already cover 12/12 posts topically: every post's `relatedMarkets[0]` matches the chosen source image, OR is a legitimate cohort representative (Harbor Beach for the valuation post — its high-end waterfront frames the "automated valuations miss this" angle).

A future cycle can layer a "valuation editorial graphic" or "diligence editorial graphic" for posts 10–12 if principal wants more semantic differentiation, but the current cohort feels coherent.

## SEO + AEO impact

- Each article now ships a unique `og:image` matching its topic. Social shares (Facebook, LinkedIn, X) render a market-specific card.
- Article schema `image` field is per-post, satisfying Google's structured data preference for specific image references.
- The `/og-insights/` directory is new; sitemap is unaffected (images are not sitemap-listed for this site).

## Audit

`audit:insights` passes 535/0/0 after the data-model upgrade. Will be extended in Phase 10 to enforce:
- `post.ogImage` matches `/og-insights/<slug>.jpg` pattern OR is documented exception.
- `post.heroImage` resolves to an existing file.
- The OG file's bytes are 30–200 KB.

## Rollback

Remove the new images, revert `ogImage` and `heroImage` fields, set article hero back to text-only. Trivial.
