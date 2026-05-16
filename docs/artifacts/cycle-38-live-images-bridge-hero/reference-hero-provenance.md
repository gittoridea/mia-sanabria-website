# Cycle 38 — Homepage Hero Image Provenance

date: 2026-05-16

## Operator authorization

The Cycle 38 mission brief explicitly directs:

> "Replace the current homepage hero with an expert-level hero using the same
> hero image as the current production site: source reference
> `https://miasanabria.com/`; do not hotlink; download/copy the asset only as
> operator-directed reuse; record provenance as operator-authorized reuse from
> Mia's current site; optimize and commit the asset locally."

This document records that provenance.

## Source

- Reference page: `https://miasanabria.com/` (current public production site, run on the Vibe/Filesafe stack — not the staging site being built here)
- Asset URL on reference site:
  `https://vibe.filesafe.space/1776455982521426814/assets/0cea4829-8017-482f-9f70-4d00deda65a0.png`
- Discovery method: curl-fetched home HTML; the URL is published as `<meta property="og:image">` and `<meta name="twitter:image">` of `miasanabria.com/`. Hero `<section>` does not contain an explicit `<img>` element for the hero — it uses CSS-in-JS to apply the same OG-published image as a background. The OG image and the visual hero are the same composition.
- Original dimensions: 1408 × 768 PNG, ~1.2 MB
- Last-Modified header on the source: `Fri, 17 Apr 2026 19:59:43 GMT`
- Subject: twilight luxury waterfront residence on calm Atlantic intracoastal; reflections on still water; mature palms; sunset sky in pink/blue gradient.

## Licensing posture

- The asset is hosted on a third-party CDN (`vibe.filesafe.space`) used by miasanabria.com.
- Cycle 34 audit concluded the third-party CDN-hosted asset is not safely re-licensable for this repo on its own.
- **Cycle 38 operator authorization supersedes that earlier conclusion** for the explicit purpose of reusing this asset on the staging dev site `miasanabriarealtor.trueidea.com`. The mission brief frames this as "operator-directed reuse from Mia's current site," NOT independent license claim.
- This file is the auditable record. Mia's principal license to her own current hero composition is implicit in operator's direction. If Mia ever objects, see the rollback in `rollback-plan.md`.

## Local placement and optimization

- Local saved-source PNG (for evidence): `docs/artifacts/cycle-38-live-images-bridge-hero/reference-hero/miasanabria-og-original.png`
- Runtime hero JPEG: `public/hero/mia-home-hero.jpg`
  - 2400 × 1310, JPEG quality 85, mozjpeg, ~191 KB
  - sharp `fit: cover, position: centre` upscaled-from-original then re-encoded
- Runtime OG JPEG (reused for share previews if needed): `public/hero/mia-home-hero-og.jpg`
  - 1200 × 630, JPEG quality 85, mozjpeg, ~67 KB

The runtime never hotlinks to `vibe.filesafe.space`. The asset is committed to the repo and served from the same Next.js static export as the rest of the public assets.

## Alt text

- Hero image alt: "Twilight luxury waterfront residence on calm Atlantic intracoastal, Southeast Florida"

The alt text describes the visual content without overclaiming documentary truth (the asset originates on miasanabria.com and was likely commissioned/sourced by Mia or her prior site builder).

## Rollback

To revert the hero image:

```
git rm public/hero/mia-home-hero.jpg public/hero/mia-home-hero-og.jpg
git checkout HEAD~1 -- src/app/page.tsx
```

The pre-Cycle-38 hero used `public/markets/fort-lauderdale.jpg` (Cycle 34 fallback). That asset is still tracked and remains usable if rollback is needed.
