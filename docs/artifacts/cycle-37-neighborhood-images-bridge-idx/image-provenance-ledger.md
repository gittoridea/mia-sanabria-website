# Cycle 37 — Image Provenance Ledger

Every image generated this cycle is recorded here. Provenance must remain auditable for the lifetime of the asset.

| Slug | Generated at | Tool | Model | Prompt summary | Provenance | Alt text |
|------|--------------|------|-------|----------------|------------|----------|
| coral-springs | 2026-05-16T01:58Z | scripts/generate-neighborhood-images.ts | gemini-2.5-flash-image | tree-lined master-planned suburban boulevard at golden hour | ai-generated-illustrative | Coral Springs tree-lined boulevard at golden hour (illustrative editorial) |
| davie | 2026-05-16T01:58Z | scripts/generate-neighborhood-images.ts | gemini-2.5-flash-image | open equestrian-friendly Florida landscape, white horse-trail fencing | ai-generated-illustrative | Davie equestrian-style open pasture and trail fencing (illustrative editorial) |
| deerfield-beach | 2026-05-16T01:58Z | scripts/generate-neighborhood-images.ts | gemini-2.5-flash-image | sun-washed Florida beach pier over calm Atlantic at golden hour | ai-generated-illustrative | Deerfield Beach pier over calm Atlantic at golden hour (illustrative editorial) |
| hollywood | 2026-05-16T01:58Z | scripts/generate-neighborhood-images.ts | gemini-2.5-flash-image | iconic Florida beachfront brick promenade boardwalk | ai-generated-illustrative | Hollywood beachfront promenade with palm shadows (illustrative editorial) |
| plantation | 2026-05-16T01:58Z | scripts/generate-neighborhood-images.ts | gemini-2.5-flash-image | dense royal palm canopy over a quiet South Florida residential street | ai-generated-illustrative | Plantation royal-palm canopy over a quiet residential street (illustrative editorial) |
| sunrise | 2026-05-16T01:58Z | scripts/generate-neighborhood-images.ts | gemini-2.5-flash-image | vast manicured Florida lakeside plaza at sunrise, warm golden horizon | ai-generated-illustrative | Sunrise lakefront plaza at warm dawn (illustrative editorial) |
| weston | 2026-05-16T01:58Z | scripts/generate-neighborhood-images.ts | gemini-2.5-flash-image | elegant master-planned community fountain courtyard with mature oak shade | ai-generated-illustrative | Weston master-planned community fountain courtyard (illustrative editorial) |

## Safety review summary

For every image:
- No people, no faces, no identifiable silhouettes (prompt enforced + visual spot-check passed)
- No real or identifiable private homes (prompt enforced)
- No logos, license plates, named landmarks, photographer signatures (prompt enforced)
- 1600×900 reference output, resized to portrait 1200×1500 hero and 1200×630 OG via Sharp `fit: cover, position: centre`
- All assets carry `provenance: ai-generated-illustrative` and the alt text frames the scene as illustrative, not documentary

## Rollback

To revert any image, delete `public/markets/<slug>.jpg` + `public/og-markets/<slug>.jpg` and restore the brand-tone placeholder from git history (`git show 772cc5e:public/markets/<slug>.jpg > public/markets/<slug>.jpg`).
