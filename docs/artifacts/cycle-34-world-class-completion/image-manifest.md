# Cycle 34 — Image Manifest

> Phase 12 deliverable. Single source of truth for every image slot used by the site, with current path, accurate alt text, provenance, and operator-action queue.

## Manifest

| Route(s) | Slot | Path | Alt text | Provenance | Operator action |
|---|---|---|---|---|---|
| `/` , `/home-search/` | Hero bg | `/markets/fort-lauderdale.jpg` | "Twilight luxury waterfront residence, Eastern Fort Lauderdale" | existing-approved | none |
| `/markets/` | Hero bg | `/markets/hillsboro-mile.jpg` | "Hillsboro Mile oceanfront luxury estates, Southeast Florida" | existing-approved | none |
| `/markets/fort-lauderdale/` | Detail hero | `/markets/fort-lauderdale.jpg` | "Fort Lauderdale luxury waterfront establishing shot" | existing-approved | none |
| `/markets/pompano-beach/` | Detail hero | `/markets/pompano-beach.jpg` | "Pompano Beach Atlantic coastline establishing shot" | existing-approved | none |
| `/markets/deerfield-beach/` | Detail hero | `/markets/deerfield-beach.jpg` | "Deerfield Beach coastal establishing shot" | existing-approved (brand-tone placeholder Cycle 25) | replace with Mia-licensed photo |
| `/markets/coral-springs/` | Detail hero | `/markets/coral-springs.jpg` | "Coral Springs residential establishing shot" | existing-approved (placeholder) | replace |
| `/markets/plantation/` | Detail hero | `/markets/plantation.jpg` | "Plantation residential establishing shot" | existing-approved (placeholder) | replace |
| `/markets/weston/` | Detail hero | `/markets/weston.jpg` | "Weston master-planned residential establishing shot" | existing-approved (placeholder) | replace |
| `/markets/hollywood/` | Detail hero | `/markets/hollywood.jpg` | "Hollywood Florida coastal residential establishing shot" | existing-approved (placeholder) | replace |
| `/markets/davie/` | Detail hero | `/markets/davie.jpg` | "Davie residential establishing shot" | existing-approved (placeholder) | replace |
| `/markets/sunrise/` | Detail hero | `/markets/sunrise.jpg` | "Sunrise western-Broward residential establishing shot" | existing-approved (placeholder) | replace |
| `/markets/coral-ridge/` … `/bermuda-riviera/` | Detail hero | `/markets/<slug>.jpg` | per-slug coastal/waterfront | existing-approved | none |
| `/about/` | Portrait | `/mia-headshot.jpg`, `/mia-headshot-{256,512}.jpg` | "Mia Sanabria, REALTOR® with LPT Realty" | operator-provided | none |
| `/buyers/` | Hero | `/services/buyers.jpg` | "Buyer-side representation in Southeast Florida" | existing-approved | none |
| `/contact/` | Hero | `/services/contact.jpg` | "Contact Mia Sanabria, REALTOR®" | existing-approved | none |
| All OG cards | OG | `/og-default.jpg` and per-route `/og-<scope>/<slug>.jpg` | matches route | existing-approved | none |
| Brand | Logos | `/logos/lpt-realty.png`, `/logos/realtor-r.png`, `/logos/equal-housing.png` | brand-only | brand-provided | none |

## Provenance distribution

| Value | Count |
|---|---|
| existing-approved | 23 |
| existing-approved (brand-tone placeholder Cycle 25) | 7 |
| operator-provided | 3 (Mia portrait variants) |
| ai-generated-illustrative | 0 |
| needs-operator | 0 |

## One-sample checkpoint protocol (when greenlit)

1. Pick highest-impact placeholder: **Hollywood** (most distinctive coastal-urban character among the seven). 
2. Generate one Gemini Imagen sample using the prompt in `neighborhood-image-generation-briefs.md` → write to `public/markets/_one-sample/hollywood.webp`.
3. Document: target route, exact prompt, output path, provenance, accuracy assessment.
4. Operator review. If approved → batch-generate the remaining 6 cities.
5. If rejected → tune prompt, regenerate one sample, repeat checkpoint.

Until operator greenlight, the placeholder set remains in place. Site continues to ship.
