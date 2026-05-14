# Cycle 34 — Neighborhood Image Generation Briefs

> Phase 12 deliverable. Production-grade prompts for the seven brand-tone-placeholder neighborhoods (Cycle 25 cohort). **Not generated this cycle.** Gated on operator one-sample-checkpoint approval.

## Generator preference

1. Gemini Imagen via `gemini` CLI (`GEMINI_API_KEY` present).
2. Fallback: OpenAI image API (key currently missing — would require setup).
3. Fallback: local Stable Diffusion / ComfyUI (not present).

## Hard rules (apply to every prompt)

- No people.
- No identifiable private residences.
- No identifiable license plates.
- No logos / text in the image.
- No imitation of a named photographer's style.
- Editorial illustrative, not documentary photography.
- Warm natural light, refined modern residential feel.
- 16:9 aspect ratio.
- Realistic but stylized — clear that this is an "establishing image", not a specific street.

## Per-city briefs

### Deerfield Beach

```
Editorial South Florida real estate lifestyle establishing image for Deerfield
Beach: low-rise oceanfront community with the Atlantic visible in the
background, palm trees along a coastal road, pastel low-rise residential
architecture, an empty wood pier in the distance, warm late-afternoon light,
no people, no logos, no text, no license plates, realistic but illustrative,
premium real estate website hero image, 16:9.
```

Accuracy cue source: Deerfield Beach is a beach-corridor city with a long municipal pier and a mostly low-rise oceanfront skyline.

### Coral Springs

```
Editorial South Florida real estate lifestyle establishing image for Coral
Springs: a suburban master-planned residential street lined with mature
palms, single-family homes with tile roofs and lush manicured landscaping,
no people, no logos, no text, no license plates, warm late-afternoon light,
realistic but illustrative, premium real estate website hero image, 16:9.
```

Accuracy cue source: Coral Springs is a 1960s-planned western Broward suburb known for tree-lined planned-community streets.

### Plantation

```
Editorial South Florida real estate lifestyle establishing image for
Plantation, Florida: a tree-canopied residential street with banyans and
oaks arching overhead, mid-century to contemporary single-family homes,
warm dappled light, no people, no logos, no text, no license plates,
realistic but illustrative, premium real estate website hero image, 16:9.
```

Accuracy cue source: Plantation is known for its mature tree canopy, especially in the older eastern neighborhoods.

### Weston

```
Editorial South Florida real estate lifestyle establishing image for Weston,
Florida: a master-planned community boulevard with a wide median planted
with palms, upscale residential subdivisions in the distance, a community
lake on one side, warm late-afternoon light, no people, no logos, no text,
no license plates, realistic but illustrative, premium real estate website
hero image, 16:9.
```

Accuracy cue source: Weston is a planned community (Arvida) with characteristic median-planted boulevards and integrated lakes.

### Hollywood

```
Editorial South Florida real estate lifestyle establishing image for
Hollywood, Florida: coastal urban character — a wide oceanfront broadwalk
along the Atlantic with the boardwalk in the foreground, low-to-mid-rise
beach-side architecture, mature palms, warm golden-hour light, no people,
no logos, no text, no license plates, realistic but illustrative, premium
real estate website hero image, 16:9.
```

Accuracy cue source: Hollywood's defining visual is the Hollywood Beach Broadwalk, a long pedestrian promenade along the Atlantic.

### Davie

```
Editorial South Florida real estate lifestyle establishing image for Davie,
Florida: an equestrian-adjacent western Broward suburb — a quiet road lined
with split-rail fencing, mature trees, a small pasture in the middle ground,
warm late-afternoon light, no people, no logos, no text, no license plates,
realistic but illustrative, premium real estate website hero image, 16:9.
```

Accuracy cue source: Davie has a notable equestrian/agrarian character distinct from neighboring cities, with horse trails and large-lot residences in many neighborhoods.

### Sunrise

```
Editorial South Florida real estate lifestyle establishing image for
Sunrise, Florida: a western-Broward residential boulevard with a wide
landscaped median, tile-roof single-family homes set back from the road,
distant low-rise mixed-use in the background, palm trees, warm late-
afternoon light, no people, no logos, no text, no license plates, realistic
but illustrative, premium real estate website hero image, 16:9.
```

Accuracy cue source: Sunrise is a western Broward city centered on planned residential and the Sawgrass corridor.

## One-sample checkpoint

If Torrey approves a one-sample test:

1. **Pick:** Hollywood (most distinctive identity → easiest to verify "did the model understand the city?").
2. **Command (conceptual — Gemini CLI image generation surface varies by version):**
   ```bash
   gemini image generate \
     --model imagen-3.0 \
     --prompt "<Hollywood prompt above>" \
     --aspect-ratio 16:9 \
     --output public/markets/_one-sample/hollywood.webp
   ```
3. **Document in a follow-up artifact:** prompt used (exact), output path, file size, dimensions, what the image actually shows, whether the model confused Hollywood FL with Hollywood CA, whether it included unintended people / vehicles / text.
4. **Operator review.** Approve to proceed, or tune.

## What this cycle does

- Produces these prompts.
- Does **not** call the Gemini API.
- Does **not** write to `public/markets/_one-sample/`.
- Does **not** swap in any generated image.

## Why not generate this cycle

- Per the brief: "Before generating a full batch of neighborhood images, generate or prepare only one sample image/brief first."
- Per the brief: "Do not install both a browser QA tool and an image-generation client in the same session unless one is already present." Playwright is already present; the brief's intent is one focus area per cycle. Image-gen tools are present too, but the operator gate matters more than the install gate.
- Provenance discipline: even a single sample should be operator-approved before insertion.
