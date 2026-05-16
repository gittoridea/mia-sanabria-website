# Cycle 38 — Reference Hero Extraction Report

date: 2026-05-16

## Approach

The mission brief authorizes reuse of the hero image from `https://miasanabria.com/`. The extraction approach:

1. `curl -L --max-time 30 -s https://miasanabria.com/` — fetched HTML to `docs/artifacts/cycle-38-live-images-bridge-hero/reference-hero/miasanabria-home.html` (1703 lines).
2. Grep'd HTML for image URL candidates (`https?://.+\.(jpg|png|webp|avif)` and `url(...)` CSS declarations).
3. Inspected `<meta property="og:image">` and `<meta name="twitter:image">` content attributes — both pointed at the same `vibe.filesafe.space` asset.
4. Confirmed via `curl -I` that the URL returns HTTP 200, `content-type: image/png`, `content-length: 1237924`, `last-modified: Fri, 17 Apr 2026 19:59:43 GMT`.
5. Downloaded the PNG to `docs/artifacts/cycle-38-live-images-bridge-hero/reference-hero/miasanabria-og-original.png` (1408×768, 1.2 MB).
6. Visually verified the image content via the Read tool — twilight luxury waterfront residence, calm Atlantic intracoastal, mirror-still water reflections, palms, sunset gradient sky.
7. Sharp-optimized into `public/hero/mia-home-hero.jpg` (2400×1310 cover, JPEG q85 mozjpeg, ~191 KB) and `public/hero/mia-home-hero-og.jpg` (1200×630, ~67 KB).

## Why I did not chase a CSS-rendered hero image

The miasanabria.com hero section in the body HTML is:

```html
<section>
  <div></div>
  <div></div>
  <div>
    <span>Mia Sanabria Real Estate</span>
    <h1>Discover Southeast Florida's <br>Most Exclusive Real Estate</h1>
    <div><div><input type="text" placeholder="Search by City, Neighborhood, or Zip Code"></div><button> Search</button></div>
  </div>
</section>
```

There is no `<img>` element in the hero section. The two empty `<div></div>` siblings are CSS-styled with background images via styled-components or similar. Headless-Chrome rendering would have surfaced the computed background-image URL, but the published `og:image` meta is the same composition (this is the standard pattern: a marketing site sets `og:image` to the visual hero so social-share previews match the homepage). I matched on the published OG asset and confirmed visually that it is the right composition.

## Blockers found

None. The asset:

- exists at a stable URL,
- returns 200,
- is the correct visual hero,
- can be re-encoded into the project's JPEG hero pattern without quality loss visible at hero scale.

## What was NOT extracted

- The `<base href>` page proxying approach in `scripts/probe-live-neighborhood-images.ts` was developed for the neighborhood-image DOM check; it is not the right tool for hero extraction. Direct curl + visual inspection was sufficient.
- No CSS computed-style probe was needed because the OG meta exposed the asset URL directly.

## Outputs

- Source PNG (evidence): `docs/artifacts/cycle-38-live-images-bridge-hero/reference-hero/miasanabria-og-original.png`
- Hero JPEG (runtime): `public/hero/mia-home-hero.jpg`
- OG JPEG (runtime spare): `public/hero/mia-home-hero-og.jpg`
- Provenance ledger: `docs/artifacts/cycle-38-live-images-bridge-hero/reference-hero-provenance.md`
