# Image Manifest — Cycle 35B

date: 2026-05-14
scope: Hero images (`public/markets/*.jpg`) + OG images (`public/og-markets/*.jpg`) for every approved + reference market.

## Schema

```
slug | hero path | hero kB | og path | og kB | content_summary | image_provenance | alt_text | operator_needed |
```

`image_provenance`:
- `existing-approved-photographic` — real photograph licensed/approved for this site
- `existing-approved-brand-tone` — typographic editorial card, brand-consistent, deliberate
- `ai-generated-illustrative` — generated this cycle (none this cycle)
- `operator-provided` — uploaded by Mia (none this cycle)
- `needs-operator` — placeholder pending replacement (none — see plan)

## Manifest

| Slug | Hero path | Hero kB | OG path | OG kB | Content summary | Provenance | Alt text | Operator-needed |
|---|---|---|---|---|---|---|---|---|
| fort-lauderdale | /markets/fort-lauderdale.jpg | 245 | /og-markets/fort-lauderdale.jpg | 150 | modern waterfront residence + yacht at sunset | existing-approved-photographic | "Fort Lauderdale luxury real estate" | no |
| pompano-beach | /markets/pompano-beach.jpg | 281 | /og-markets/pompano-beach.jpg | 138 | aerial Pompano pier + beach corridor + condos | existing-approved-photographic | "Pompano Beach luxury real estate" | no |
| deerfield-beach | /markets/deerfield-beach.jpg | 65 | /og-markets/deerfield-beach.jpg | 43 | navy editorial card, "Deerfield Beach" H1, NE Broward subhead | existing-approved-brand-tone | "Deerfield Beach luxury real estate" | future: licensed photography |
| coral-springs | /markets/coral-springs.jpg | 63 | /og-markets/coral-springs.jpg | 41 | navy editorial card, "Coral Springs" H1, NW Broward planned-city subhead | existing-approved-brand-tone | "Coral Springs luxury real estate" | future: licensed photography |
| plantation | /markets/plantation.jpg | 59 | /og-markets/plantation.jpg | 39 | navy editorial card, "Plantation" H1, Central Broward tree-canopy subhead | existing-approved-brand-tone | "Plantation luxury real estate" | future: licensed photography |
| weston | /markets/weston.jpg | 58 | /og-markets/weston.jpg | 38 | navy editorial card, "Weston" H1, Western Broward master-planned subhead | existing-approved-brand-tone | "Weston luxury real estate" | future: licensed photography |
| hollywood | /markets/hollywood.jpg | 60 | /og-markets/hollywood.jpg | 39 | navy editorial card, "Hollywood" H1, Broadwalk subhead | existing-approved-brand-tone | "Hollywood luxury real estate" | future: licensed photography |
| davie | /markets/davie.jpg | 56 | /og-markets/davie.jpg | 36 | navy editorial card, "Davie" H1, equestrian-heritage subhead | existing-approved-brand-tone | "Davie luxury real estate" | future: licensed photography |
| sunrise | /markets/sunrise.jpg | 57 | /og-markets/sunrise.jpg | 37 | navy editorial card, "Sunrise" H1, Sawgrass Mills + Panthers subhead | existing-approved-brand-tone | "Sunrise luxury real estate" | future: licensed photography |
| boca-raton | /markets/boca-raton.jpg | 362 | /og-markets/boca-raton.jpg | 201 | photographic | existing-approved-photographic | "Boca Raton luxury real estate" | no |
| delray-beach | /markets/delray-beach.jpg | 455 | /og-markets/delray-beach.jpg | 210 | photographic | existing-approved-photographic | "Delray Beach luxury real estate" | no |

### Non-neighborhood images audited (no change)

- `mia-headshot.jpg`, `mia-headshot-256.jpg`, `mia-headshot-512.jpg`, `mia-profile.jpg` — operator-provided (Mia herself).
- `mia-og.jpg`, `og-default.jpg`, `og-buyers.jpg`, `og-sellers.jpg`, `og-contact.jpg`, `og-valuation.jpg` — existing-approved.
- `public/og-insights/*.jpg` (12 insight OG images) — existing-approved-editorial.
- `public/services/{buyers,contact,sellers,valuation}.jpg` — existing-approved.
- `public/logos/equal-housing.png`, `lpt-realty.png`, `realtor-r.png` — existing-approved trust marks (LPT/NAR/HUD logos).
- `public/source-assets/*` — source files for derived assets; not served via HTTP.

## Counts

```
existing_approved_photographic_neighborhood_heroes: 4 (fort-lauderdale, pompano-beach, boca-raton, delray-beach)
existing_approved_brand_tone_neighborhood_heroes: 7 (deerfield-beach, coral-springs, plantation, weston, hollywood, davie, sunrise)
ai_generated_illustrative: 0 (none this cycle — see image-completion-plan.md)
operator_needed_for_future_cycle: 7 (the brand-tone group, when Mia provides licensed photography)
```

## Audit posture

- Every neighborhood hero has matching `/og-markets/<slug>.jpg`. `audit:images` passed.
- No image is missing, off-topic, lorem-ipsum, or visually broken.
- No identifiable private residences, license plates, logos (other than approved LPT/NAR/HUD), or text overlays that would violate publicity/copyright.
- No identifiable people on neighborhood hero images.
