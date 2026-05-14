# Image System Standard

> Cycle 34 Phase 6.

## Image taxonomy

| Type | Where it lives | Provenance value | Allowed alt-text |
|---|---|---|---|
| Mia portrait | `public/mia-headshot*.jpg` | operator-provided | "Mia Sanabria, REALTOR®" |
| Neighborhood hero | `public/markets/<slug>.jpg` | repo-approved | "<Neighborhood> coastal residential establishing shot" |
| Insights OG | `public/og-insights/<slug>.jpg` | repo-approved | matching insight title |
| Market OG | `public/og-markets/<slug>.jpg` | repo-approved | "<Market> — Mia Sanabria, REALTOR®" |
| Service hero | `public/services/<slug>.jpg` | repo-approved | accurate service description |
| Logo | `public/logos/*.png` | brand-provided | brand name only |

## Provenance values (every image must have one)

```ts
type ImageProvenance =
  | "existing-approved"           // already in repo, audited
  | "ai-generated-illustrative"   // generated, never claimed as documentary
  | "operator-provided"           // Mia/Torrey delivered with license
  | "needs-operator";             // placeholder; flagged in manifest
```

## Hard rules

1. **No real identifiable people** other than Mia in marketing photography.
2. **No identifiable private residences** unless owner-licensed.
3. **No identifiable license plates.**
4. **No imitation of a named photographer's style.**
5. **No fake exact-landmark claims** in alt text.
6. **No hotlinking** to third-party CDNs.
7. **AI-generated imagery is never presented as documentary photography** — alt text uses words like "editorial illustration of...", "establishing shot of...", never "this is a photo of...".
8. **Optimize to WebP/AVIF where reasonable.** Cap hero images at ~250 KB; cap card thumbnails at ~80 KB.

## One-sample checkpoint (gating image generation)

Before any batch generation:

1. Pick the highest-priority missing/off-topic image.
2. Generate or prepare one sample only.
3. Document: target route, exact prompt, output path if generated, provenance, accuracy assessment.
4. Operator review.
5. Only proceed to batch if checkpoint passes.

## Baseline prompt style (tailor per city)

```
Editorial South Florida real estate lifestyle establishing image for <Neighborhood>,
showing <accurate general visual cues>, warm natural light, refined modern
residential feel, no people, no logos, no text, no license plates, realistic
but illustrative rather than documentary, premium real estate website hero
image, 16:9.
```

Never use this prompt verbatim — adapt visual cues per city (e.g., Coral Springs is suburban master-planned; Hollywood is coastal urban; Sunrise is western Broward; Deerfield Beach is beach-corridor).

## Cycle 34 image policy decision

The current `public/markets/<slug>.jpg` assets shipped Cycle 25 are documented as brand-tone placeholders awaiting Mia-provided licensed photography. They pass `audit:images`. They stay until Mia provides replacements. **No generated images this cycle** (per Phase 12 deferred decision and the brief's one-sample checkpoint requirement).
