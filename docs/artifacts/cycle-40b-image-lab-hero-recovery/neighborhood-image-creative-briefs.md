# Cycle 40B — Per-Neighborhood Creative Briefs

> Seven Mia-approved Broward neighborhoods. Verbatim from operator brief.
> Each candidate prompt extends from these briefs plus the global
> `visual-creative-brief.md` standard.

## deerfield-beach

```yaml
slug: deerfield-beach
display_name: Deerfield Beach
scene: |
  Coastal neighborhood / pier-adjacent / beach corridor / refined coastal
  homes. Atlantic coastline along Broward, soft golden light, mature
  coastal palms framing the composition.
must_include:
  - coastal light
  - palm / coastal vegetation cues
  - Broward Atlantic coastal character
must_not_include:
  - abstract beach
  - people
  - signs
  - generic mansion-only
optional_anchors:
  - wooden pier extending into calm Atlantic at golden hour
  - low surf in foreground
  - upscale coastal residential structures in background
```

## hollywood

```yaml
slug: hollywood
display_name: Hollywood
scene: |
  Beachside broadwalk-inspired oceanfront community, palm-lined promenade
  or coastal residential context. Hollywood Beach character — brick
  promenade pavers + mature palms casting shadows.
must_include:
  - oceanfront / coastal Broward character
  - brick paver promenade OR coastal residential street
must_not_include:
  - fake text signs
  - art-deco cliché with text
  - framed canvas
optional_anchors:
  - Hollywood Beach Broadwalk brick promenade with mature palm shadows
  - distant turquoise water at horizon
  - cream sand at water line
```

## plantation

```yaml
slug: plantation
display_name: Plantation
scene: |
  Mature tree-canopy residential street, established central Broward
  suburban estate context. Royal palms or mature oaks arching overhead,
  refined residential street.
must_include:
  - leafy canopy
  - refined residential street
  - warm dappled light
must_not_include:
  - beach / ocean
  - downtown skyline
optional_anchors:
  - royal-palm canopy over quiet residential street
  - dappled sunlight on road surface
  - lush emerald landscaping along curbs
```

## weston

```yaml
slug: weston
display_name: Weston
scene: |
  Master-planned luxury suburb, manicured lake / greenway, refined homes,
  western Broward calm. Lakes + palms + tropical landscaping.
must_include:
  - lake or pond
  - palms or oaks
  - manicured landscape
must_not_include:
  - beach / ocean
  - mountains
  - desert
  - generic golf-only cliché
optional_anchors:
  - master-planned community lake at golden hour
  - manicured lawn with mature oaks
  - distant suburban roofline at horizon
```

## coral-springs

```yaml
slug: coral-springs
display_name: Coral Springs
scene: |
  Tree-lined boulevard or suburban luxury residential community, northwest
  Broward planned-community feel. Civic / planned-community calm with
  greenery.
must_include:
  - greenery / canopy
  - residential context
  - civic / planned-community calm
must_not_include:
  - coral reef imagery
  - beach / ocean
  - abstract coral objects
optional_anchors:
  - mature oak canopy over tree-lined boulevard
  - landscaped median
  - warm golden hour with suburban roofline at horizon
```

## davie

```yaml
slug: davie
display_name: Davie
scene: |
  Equestrian estate / ranch-style residential landscape / white rail
  fencing / mature trees. Equestrian identity without people, upscale
  ranch-estate feel.
must_include:
  - equestrian identity (rail fencing) without people
  - upscale ranch-estate landscape
must_not_include:
  - rodeo
  - horse close-up
  - rural barn cliché
  - people
optional_anchors:
  - three-rail white wooden horse-trail fencing curving through pasture
  - distant tree line of mature trees
  - golden-hour soft warm light
```

## sunrise

```yaml
slug: sunrise
display_name: Sunrise
scene: |
  Western Broward suburban / lake community, Sawgrass-adjacent lifestyle
  without logos / signs. Lakes + palms + sunny planned community feel.
must_include:
  - lake or pond
  - palms
  - sunny planned-community feel
must_not_include:
  - arena logos
  - mall signage
  - abstract sculptures
  - beach / ocean
optional_anchors:
  - lake at golden hour with palms framing
  - lush tropical foreground landscaping
  - soft pastel sky reflection
```

## Scoring rubric (8 axes × 0-5 each, ≥34/40 to accept as winner)

```yaml
rubric_axes:
  topic_accuracy: 0-5      # is the SUBJECT correct for this neighborhood?
  neighborhood_specificity: 0-5  # would someone familiar recognize the place vs generic luxury?
  photorealism: 0-5        # reads as photograph vs painting/CGI?
  luxury_real_estate_fit: 0-5    # editorial luxury real-estate magazine?
  full_bleed_composition: 0-5    # edge-to-edge, no frame artifacts?
  brand_consistency: 0-5   # palette / mood matches Mia's site (brass/cream/navy/greens/blues)?
  artifact_free: 0-5       # no people/text/logos/borders/strange objects?
  crop_safety_card_and_hero: 0-5 # survives center-crop to 1200x1500 AND 1200x630?

minimum_acceptance: 34/40

below_threshold_action:
  - retry generation with prompt refinement (operator-facing decision: tighten which axis was lowest)
  - if 3 candidates all <34 after one refinement pass, KEEP Cycle 39 asset for that slug
    (do NOT force a weak Cycle 40B image into production)
  - log decision in image-art-direction-review.md
```
