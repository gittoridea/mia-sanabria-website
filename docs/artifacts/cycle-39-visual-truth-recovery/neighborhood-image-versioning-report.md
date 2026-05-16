# Cycle 39 — Neighborhood Image Versioning Report

date: 2026-05-16

## Why versioned filenames

Cycle 38 regenerated the seven affected neighborhood images at the SAME
unversioned URLs (`/markets/<slug>.jpg`, `/og-markets/<slug>.jpg`). Every
structural verification passed at the origin (HTTP 200, byte-for-byte match,
DOM `<img>` presence) yet the operator continued to see the prior pixels —
the unambiguous signature of HTTP-cache and/or service-worker persistence.
The only way to make the cache irrelevant is to change the URL itself.

Cycle 39 republishes the seven slugs at versioned filenames; the URL change
forces every browser, every proxy, every CDN edge layer to fetch the new
bytes on first sight. The legacy unversioned files remain on disk so any
external links that may exist do not 404, but the runtime UI no longer
references them.

## Versioned path table

| Slug | Card path (live DOM + on disk) | OG path (live meta + on disk) |
|------|-------------------------------|-------------------------------|
| deerfield-beach | `/markets/deerfield-beach-cycle39.jpg` | `/og-markets/deerfield-beach-cycle39.jpg` |
| hollywood | `/markets/hollywood-cycle39.jpg` | `/og-markets/hollywood-cycle39.jpg` |
| plantation | `/markets/plantation-cycle39.jpg` | `/og-markets/plantation-cycle39.jpg` |
| weston | `/markets/weston-cycle39.jpg` | `/og-markets/weston-cycle39.jpg` |
| coral-springs | `/markets/coral-springs-cycle39.jpg` | `/og-markets/coral-springs-cycle39.jpg` |
| davie | `/markets/davie-cycle39.jpg` | `/og-markets/davie-cycle39.jpg` |
| sunrise | `/markets/sunrise-cycle39.jpg` | `/og-markets/sunrise-cycle39.jpg` |

## Where the versioning lives (single source of truth)

```
src/lib/mia.ts
  export const MIA_CYCLE_39_VERSIONED_SLUGS = new Set<MarketSlug>([
    "deerfield-beach", "hollywood", "plantation",
    "weston", "coral-springs", "davie", "sunrise",
  ]);
  function imageSuffixForSlug(slug) { return MIA_CYCLE_39_VERSIONED_SLUGS.has(slug) ? "-cycle39" : "" }
  export function getMarketImagePath(slug) { return `/markets/${slug}${imageSuffixForSlug(slug)}.jpg` }
  export function getMarketOgImagePath(slug) { return `/og-markets/${slug}${imageSuffixForSlug(slug)}.jpg` }
```

The seven affected `Market.heroImage` literals in `src/lib/markets.ts`
were edited inline to the versioned filename. `src/app/markets/[slug]/page.tsx`
og:image url now flows through `getMarketOgImagePath(market.slug)` instead
of a hardcoded `/og-markets/${market.slug}.jpg`. `scripts/audit-images.ts`
and `scripts/audit-neighborhood-images-deep.ts` now consult the same helpers
so the audits and the runtime cannot diverge.

## Image-byte provenance

The Cycle 39 versioned files are byte-identical copies of Cycle 38's
regenerated photorealistic JPEGs (Gemini-generated with the hardened
prompt + perimeter-whiteness validator). Cycle 39's contribution is the
URL change — the pixel content was already correct after Cycle 38; the
URL was the silent failure surface.

| Slug | Cycle 38 bytes | Cycle 39 bytes | Identical? |
|------|---------------:|---------------:|:----------:|
| deerfield-beach hero | 199 686 | 199 686 | yes |
| hollywood hero | 271 516 | 271 516 | yes |
| plantation hero | 379 393 | 379 393 | yes |
| weston hero | 405 135 | 405 135 | yes |
| coral-springs hero | 394 510 | 394 510 | yes |
| davie hero | 263 928 | 263 928 | yes |
| sunrise hero | 222 571 | 222 571 | yes |

OG variants identical in the same way (106 052 / 130 344 / 186 532 /
185 248 / 198 915 / 133 336 / 122 791).

## Audit-boundary anti-regression (new gate)

`scripts/audit-neighborhood-images-deep.ts` was extended this cycle so any
slug in `MIA_CYCLE_39_VERSIONED_SLUGS` whose resolved card path or OG path
does NOT contain `-cycle39.` triggers a hard FAIL. When `--base=<url>` is
provided, the audit also fetches the live `/markets/` index and each
`/markets/<slug>/` detail HTML and FAILS if the unversioned `/markets/<slug>.jpg`
appears as a rendered `src="…"` or as a CSS `url(…)` reference for any
versioned slug. The audit can no longer say "23/23 PASS" while the runtime
points at a cacheable URL.

## Build-time verification

`bun run build` emits the seven versioned `src="…"` references in
`out/markets/index.html` (twice each — card + visible related-markets card)
and in each `out/markets/<slug>/index.html`. Grep across `out/` finds
**zero** matches of `src="/markets/<slug>.jpg"` for the seven versioned
slugs.

## Anti-regression rule

Any future asset swap that is visually significant (hero, market cards, OG
images) MUST republish at a new versioned URL. In-place asset replacement
at a stable URL is permanently classified as a silent-failure pattern for
this project.
