# Cycle 38 — Image Provenance Ledger

Every image regenerated this cycle is recorded here. Provenance must remain
auditable for the lifetime of the asset. Supersedes the Cycle 37 ledger for
these 7 slugs.

| Slug | Generated at | Tool | Model | Prompt summary | Provenance | Validator | Alt text |
|------|--------------|------|-------|----------------|------------|-----------|----------|
| coral-springs | 2026-05-16 | `scripts/generate-neighborhood-images-v2.ts` | gemini-2.5-flash-image | documentary-style photorealistic tree-lined master-planned boulevard at golden hour, full-bleed | ai-generated-illustrative | perimeter_white_ratio 0.001 (max allowed 0.25) | Coral Springs tree-lined boulevard at golden hour (editorial) |
| davie | 2026-05-16 | `scripts/generate-neighborhood-images-v2.ts` | gemini-2.5-flash-image | documentary-style photorealistic equestrian ranch landscape with three-rail white fencing, full-bleed | ai-generated-illustrative | perimeter_white_ratio 0.000 | Davie equestrian pasture and trail fencing (editorial) |
| deerfield-beach | 2026-05-16 | `scripts/generate-neighborhood-images-v2.ts` | gemini-2.5-flash-image | documentary-style photorealistic wooden Atlantic pier at golden hour, full-bleed | ai-generated-illustrative | perimeter_white_ratio 0.006 | Deerfield Beach pier over calm Atlantic at golden hour (editorial) |
| hollywood | 2026-05-16 | `scripts/generate-neighborhood-images-v2.ts` | gemini-2.5-flash-image | documentary-style photorealistic Hollywood Beach brick promenade with palm shadows, full-bleed | ai-generated-illustrative | perimeter_white_ratio 0.041 | Hollywood Beach brick promenade with palm shadows (editorial) |
| plantation | 2026-05-16 | `scripts/generate-neighborhood-images-v2.ts` | gemini-2.5-flash-image | documentary-style photorealistic royal-palm canopy over residential street, full-bleed | ai-generated-illustrative | perimeter_white_ratio 0.003 | Plantation royal-palm canopy over a quiet residential street (editorial) |
| sunrise | 2026-05-16 | `scripts/generate-neighborhood-images-v2.ts` | gemini-2.5-flash-image | documentary-style photorealistic lakeside scene at warm sunrise framed by tropical palms, full-bleed | ai-generated-illustrative | perimeter_white_ratio 0.000 | Sunrise lakeside at warm dawn (editorial) |
| weston | 2026-05-16 | `scripts/generate-neighborhood-images-v2.ts` | gemini-2.5-flash-image | documentary-style photorealistic master-planned community landscape with mature oak shade, full-bleed | ai-generated-illustrative | perimeter_white_ratio 0.007 | Weston master-planned community landscape (editorial) |

## Safety review summary

For every regenerated image:

- No people, no faces, no identifiable silhouettes (prompt enforced + visual spot-check)
- No real or identifiable private homes (prompt enforced + visual spot-check)
- No logos, license plates, named landmarks, photographer signatures (prompt enforced)
- Native portrait 1024×1024 reference output, resized to portrait 1200×1500 hero and 1200×630 OG via Sharp `fit: cover, position: centre`
- All assets retain `provenance: ai-generated-illustrative`; alt text frames scene as editorial, not documentary truth
- New perimeter-whiteness validator gates each candidate at <25 % near-white perimeter pixels

## Rollback

To revert any single image to its Cycle 37 form:

```
git checkout ed24e69 -- public/markets/<slug>.jpg public/og-markets/<slug>.jpg
```

To revert all 7 simultaneously:

```
for slug in coral-springs davie deerfield-beach hollywood plantation sunrise weston; do
  git checkout ed24e69 -- public/markets/$slug.jpg public/og-markets/$slug.jpg
done
```
