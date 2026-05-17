# Cycle 40B — Image Provenance Ledger

> Source-of-truth for what each Cycle 40B image actually is. All seven
> neighborhood images and the homepage hero are illustrative AI-generated
> photography (not licensed real photography), generated under operator
> authorization. This ledger documents the model, prompt, license intent,
> and authorized use scope per image.

## Authorization & intent

- **Operator authorization:** explicit in Cycle 40B mission brief
  (2026-05-16) and in Cycle 38 BSS doctrine documents — AI-generated
  illustrative photography is the authorized stand-in until Mia provides
  licensed real photography for each neighborhood.
- **Display posture:** images are used as full-bleed editorial photography
  for the homepage hero and per-neighborhood `/markets/<slug>/` detail
  pages, with alt text that describes the *subject*, not "AI-generated."
- **Honesty:** the artifact ledger here AND the image-manifest in
  `docs/artifacts/cycle-40b-image-lab-hero-recovery/image-manifest.md`
  record provenance for accountability. The site does not assert these
  are licensed real photography of specific properties; the alt text is
  descriptive of the subject (e.g., "Coral Springs tree-lined boulevard
  at golden hour (editorial)") to communicate illustrative intent without
  burying the user in disclaimers.

## Neighborhood images

| Slug | Final path | Source candidate | Model | Generation date |
|------|-----------|------------------|-------|-----------------|
| deerfield-beach | `/markets/deerfield-beach-cycle40b.jpg` + `/og-markets/deerfield-beach-cycle40b.jpg` | cand-1 | gemini-2.5-flash-image | 2026-05-17 |
| hollywood | `/markets/hollywood-cycle40b.jpg` + `/og-markets/hollywood-cycle40b.jpg` | cand-3 | gemini-2.5-flash-image | 2026-05-17 |
| plantation | `/markets/plantation-cycle40b.jpg` + `/og-markets/plantation-cycle40b.jpg` | cand-2 | gemini-2.5-flash-image | 2026-05-17 |
| weston | `/markets/weston-cycle40b.jpg` + `/og-markets/weston-cycle40b.jpg` | cand-3 | gemini-2.5-flash-image | 2026-05-17 |
| coral-springs | `/markets/coral-springs-cycle40b.jpg` + `/og-markets/coral-springs-cycle40b.jpg` | cand-2 | gemini-2.5-flash-image | 2026-05-17 |
| davie | `/markets/davie-cycle40b.jpg` + `/og-markets/davie-cycle40b.jpg` | cand-1 | gemini-2.5-flash-image | 2026-05-17 |
| sunrise | `/markets/sunrise-cycle40b.jpg` + `/og-markets/sunrise-cycle40b.jpg` | cand-2 | gemini-2.5-flash-image | 2026-05-17 |

Provenance per slug: `ai-generated-illustrative`

## Homepage hero

| Asset | Path | Source | Notes |
|-------|------|--------|-------|
| hero (card / large display) | `/hero/mia-home-hero-cycle40b.jpg` (308KB) | reused from Cycle 40 partial work — derived from vibe.filesafe.space asset `12f02f56-afc4-4d6d-92e3-5ebb5b76140f.png` (operator-authorized) | not AI-generated; same source the live miasanabria.com homepage uses |
| OG hero (1200×630) | `/hero/mia-home-hero-cycle40b-og.jpg` (147KB) | same source, sharp-resized | not AI-generated |

Provenance for hero: `operator-authorized-reuse` (the visible hero asset on
`miasanabria.com` itself, fetched from her vibe.filesafe.space CDN and
optimized locally for performance + cache-control).

The reference original PNG is preserved at
`docs/artifacts/cycle-40-world-class-visual-recovery/reference-home/actual-miasanabria-hero-source.png`
(Cycle 40 capture, ~2MB).

## What is NOT in this ledger

- Cycle 38 / Cycle 39 image assets remain on disk under their respective
  versioned paths but are NOT active in runtime markup for the seven
  Cycle 40B slugs. They are retained as fallback evidence and
  audit-context only.
- The 12 non-cycle40b market images (Fort Lauderdale, Coral Ridge, etc.)
  are unchanged this cycle — those use their pre-Cycle-40B unversioned
  paths via the helper's fallthrough in `src/lib/mia.ts`.
- The `og-default.jpg` and other static brand assets are unchanged.
