# Cycle 39 — Image Provenance Ledger

date: 2026-05-16

## Cycle 39 image-byte lineage

All Cycle 39 versioned files are byte-identical copies of Cycle 38's
regenerated photorealistic JPEGs. Cycle 39 introduces NO new pixel content
— this is intentional. Cycle 38's image bytes were already correct in a
fresh-cache profile; the failure was that the URL never changed, so the
operator's already-cached old pixels persisted. Cycle 39 republishes the
SAME bytes at NEW URLs.

| Asset (Cycle 39 path) | Byte-identical source | Source provenance |
|----------------------|----------------------|--------------------|
| public/markets/deerfield-beach-cycle39.jpg | public/markets/deerfield-beach.jpg (Cycle 38) | Gemini 2.5 Flash Image via scripts/generate-neighborhood-images-v2.ts (Cycle 38), passed perimeter-whiteness validator |
| public/markets/hollywood-cycle39.jpg | public/markets/hollywood.jpg (Cycle 38) | same generator pipeline |
| public/markets/plantation-cycle39.jpg | public/markets/plantation.jpg (Cycle 38) | same |
| public/markets/weston-cycle39.jpg | public/markets/weston.jpg (Cycle 38) | same |
| public/markets/coral-springs-cycle39.jpg | public/markets/coral-springs.jpg (Cycle 38) | same |
| public/markets/davie-cycle39.jpg | public/markets/davie.jpg (Cycle 38) | same |
| public/markets/sunrise-cycle39.jpg | public/markets/sunrise.jpg (Cycle 38) | same |
| public/og-markets/<seven>-cycle39.jpg | matching public/og-markets/<seven>.jpg (Cycle 38) | same |
| public/hero/mia-home-hero-cycle39.jpg | public/hero/mia-home-hero.jpg (Cycle 38) | operator-authorized reuse of https://miasanabria.com og:image (twilight waterfront composition); Sharp-optimized to 2400×1310 JPEG q85 mozjpeg |

## Open provenance question (operator decision)

The reference-hero probe (`probe-reference-hero-visual.ts`) confirmed
that the actual visible miasanabria.com hero is a DAYTIME composition
(320 KB JPG at `https://vibe.filesafe.space/.../9d286670…jpg`), distinct
from the TWILIGHT og:image PNG Cycle 38 reused (1.2 MB at
`/.../0cea4829…png`).

Cycle 39 PRESERVES Cycle 38's operator-authorized twilight selection.
If the operator decides to swap to the actual daytime composition, the
replacement is a byte-for-byte overwrite of
`public/hero/mia-home-hero-cycle39.jpg` — no path change, no code
change — and the provenance ledger entry would update to reflect the
new source URL.

## What this cycle does NOT claim

- Does NOT claim independent license to any image. All hero composition
  reuse rests on the operator-authorized standing authorization from
  Cycle 38.
- Does NOT scrape or re-encode any vibe.filesafe.space asset without
  operator direction.
- Does NOT modify Mia's existing production surfaces (miasanabriarealtor.com
  Direct Axess host, social profiles, GBP).

## Audit trail

- Cycle 38 generation log: docs/artifacts/cycle-38-live-images-bridge-hero/image-generation-log.md
- Cycle 38 image manifest: docs/artifacts/cycle-38-live-images-bridge-hero/image-manifest.md
- Cycle 38 image provenance: docs/artifacts/cycle-38-live-images-bridge-hero/image-provenance-ledger.md
- Cycle 38 hero extraction: docs/artifacts/cycle-38-live-images-bridge-hero/reference-hero-extraction-report.md (superseded for the divergence finding by Cycle 39's reference-hero-visual-extraction.md)
- Cycle 39 reference re-extraction: docs/artifacts/cycle-39-visual-truth-recovery/reference-hero-visual-extraction.md
