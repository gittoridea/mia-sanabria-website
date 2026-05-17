# Cycle 40B — Visual Creative Brief

> Brand standard for every image generated this cycle. Per Cycle 40B mission
> brief; lifted from the principal's verbatim brand_feel and
> global_rejection_rules.

## Brand feel

```yaml
brand_feel:
  - refined South Florida luxury real estate
  - photorealistic editorial — DSLR / medium-format, NOT painterly
  - premium but natural — light, calm, polished
  - warm natural light (golden hour, soft daylight, magazine quality)
  - realistic architecture and landscape
  - neighborhood-specific (not generic mansion / generic beach)
  - confident composition — full-bleed, edge-to-edge, no decorative framing
  - editorial palette consistent with Mia's site brass + cream + navy +
    soft greens + calm blues
```

## Global rejection rules

Any candidate exhibiting one or more of these is auto-rejected by visual
inspection regardless of automated metrics:

```yaml
global_rejection_rules:
  - painting, illustration, oil paint, watercolor look
  - framed art, canvas, gallery wall, white border, matting
  - abstract sculpture, surreal object, fake landmark
  - readable text, signs, logos, license plates
  - people, faces, silhouettes
  - identifiable private addresses
  - cartoon, plastic CGI look
  - generic mansion unrelated to neighborhood
  - wrong geography (mountains, desert, snow)
  - ocean / beach scene for an inland city
  - overly dark, muddy, or low-contrast composition
  - real-estate listing interior without context
  - duplicate of an already-shipped Cycle 38 / Cycle 39 image (composition repeat)
```

## Composition baseline

- Aspect: native portrait 4:5 (matches MarketCard tile aspect-ratio used at
  `/markets/`); resized cleanly to landscape 1600×1000 for hero crop and
  1200×630 for OG.
- Full-bleed: the photographic subject must fill the entire frame
  edge-to-edge. NO frame, border, matting, white margin, canvas texture,
  gallery presentation, drop shadow, 3D-perspective frame.
- Lighting: warm natural daylight or golden hour preferred; the brand mood is
  warm sunlit South Florida, not moody twilight (that mood mismatch was the
  Cycle 39 root cause of operator dissatisfaction with the hero).
- Color: brass-tinted highlights, deep emerald greens, soft turquoise blues,
  cream/sand tones — palette consistent with the site's `--color-brass-*` /
  `--color-cream-*` / `--color-navy-*` system.

## Crop safety

For each candidate we output two derived files: a hero/card crop at
1600×1000 (and 1200×1500 portrait card) and an OG crop at 1200×630.
The native 4:5 source is center-cropped via sharp `fit: cover, position:
centre`. Candidates whose subject sits too close to a single edge will
**lose** the subject in the wider 1200×630 OG crop — reject.

## Provenance

All Cycle 40B images are AI-generated illustrative photography. Provenance
recorded per slug in `image-provenance-ledger.md` and an inline alt-text
suffix on each market page. We do not assert these are real Mia-shot
photography; we assert they are brand-aligned illustrative editorial.
