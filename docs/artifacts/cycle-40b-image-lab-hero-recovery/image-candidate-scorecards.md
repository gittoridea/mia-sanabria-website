# Cycle 40B — Image Candidate Scorecards

> 21 candidates (7 slugs × 3 candidates) scored against the 8-axis rubric
> from `neighborhood-image-creative-briefs.md`. Each axis is 0-5; sum is
> 0-40; minimum acceptance is 34/40. Scoring is visual (Read tool on the raw
> PNG) supplemented by automated metrics from `image-generation-results.json`.

## Acceptance threshold reminder

```
topic_accuracy            0-5
neighborhood_specificity  0-5
photorealism              0-5
luxury_real_estate_fit    0-5
full_bleed_composition    0-5
brand_consistency         0-5
artifact_free             0-5
crop_safety_card_and_hero 0-5
--------------------------
                        40 total | ≥34 to accept as winner
```

---

## deerfield-beach

**Brief:** coastal neighborhood, pier-adjacent, beach corridor, refined coastal
homes; Broward Atlantic character; palms framing; golden hour.

### cand-1 — WINNER ✓

```yaml
visual_description: |
  Long wooden public pier extending out into calm turquoise Atlantic water
  at golden hour. Two large coastal palms frame the left and right sides,
  creating depth. Soft cream sand and gentle surf in the foreground.
  Refined distant coastal residential structures barely visible behind
  the pier on the right horizon. Warm amber sky, brass-tinted highlights
  on the water.
topic_accuracy: 5            # pier + Atlantic = canonical Deerfield identity
neighborhood_specificity: 5  # the pier is THE Deerfield landmark; palm framing reinforces Broward Atlantic
photorealism: 5              # DSLR shot quality, natural lens perspective
luxury_real_estate_fit: 5    # editorial magazine composition
full_bleed_composition: 5    # edge-to-edge, no frame artifacts
brand_consistency: 5         # warm cream/golden palette, brass highlights, calm blues
artifact_free: 5             # no people, no text, no logos
crop_safety_card_and_hero: 5 # pier center-low; survives both portrait 1200x1500 and landscape 1200x630 crops
total: 40/40
decision: winner
rationale: |
  Strongest composition of the three. Palms framing on both sides give the
  shot dimensional depth; pier extends from center forward into the water;
  refined background residentials add place-context. Brand-aligned warm
  golden hour palette. Center subject ensures both crop ratios preserve
  the focal point.
```

### cand-2 — finalist (not selected)

```yaml
visual_description: |
  Pier extending from cream-sand beach into calm Atlantic; no palms framing
  the composition; some distant coastal residentials barely visible in
  background. Cleaner but less dimensional.
topic_accuracy: 5
neighborhood_specificity: 4  # less Broward-coastal-specific without palms
photorealism: 5
luxury_real_estate_fit: 4    # missing the palm framing softens the editorial feel
full_bleed_composition: 5
brand_consistency: 4         # palette good but composition less rich
artifact_free: 5
crop_safety_card_and_hero: 5
total: 37/40
decision: finalist
rationale: cand-1 is richer; cand-2 reads as more generic beach
```

### cand-3 — finalist (not selected)

```yaml
visual_description: |
  Pier on the right edge of the frame, palms framing the right side, sand
  and surf in foreground. Right-edge composition makes the OG 1200x630 crop
  less safe — the pier subject sits closer to the right edge.
topic_accuracy: 5
neighborhood_specificity: 5
photorealism: 5
luxury_real_estate_fit: 4
full_bleed_composition: 5
brand_consistency: 5
artifact_free: 5
crop_safety_card_and_hero: 3   # right-edge pier risks losing the subject in OG crop
total: 37/40
decision: finalist
rationale: crop safety is the gating issue; cand-1 wins
```

---

## hollywood

**Brief:** beachside Broadwalk-inspired oceanfront community; brick paver
promenade or coastal residential context; palms; Hollywood Beach character.

### cand-3 — WINNER ✓

```yaml
visual_description: |
  Hollywood Beach brick-paver Broadwalk arcing along the Atlantic shoreline
  at golden hour. Strong mature palms on the left foreground anchor the
  composition; brick promenade winds away into the distance on the right;
  distant cream sand and calm turquoise water visible beyond the seawall.
  Warm amber sky, soft palm shadows on the brick paving.
topic_accuracy: 5            # Broadwalk = canonical Hollywood landmark
neighborhood_specificity: 5  # brick paver + palms + Atlantic = unambiguous Hollywood Beach
photorealism: 5
luxury_real_estate_fit: 5    # editorial-magazine quality
full_bleed_composition: 5
brand_consistency: 5         # warm cream/golden palette + brass
artifact_free: 5
crop_safety_card_and_hero: 4 # subject distributed; portrait crop holds palms; landscape OG holds Broadwalk
total: 39/40
decision: winner
```

### cand-1 — finalist

```yaml
visual_description: |
  Curving Broadwalk brick paving with palm shadow on left, beach to the
  right side, distant figures barely visible (passable but borderline).
topic_accuracy: 5
neighborhood_specificity: 4   # less anchor strength
photorealism: 5
luxury_real_estate_fit: 4
full_bleed_composition: 5
brand_consistency: 4
artifact_free: 4              # tiny far-distance figures faintly visible
crop_safety_card_and_hero: 4
total: 35/40
decision: finalist
```

### cand-2 — finalist

```yaml
visual_description: |
  Tall palms centered, brick promenade winding through, beach to the right.
  Slightly more centered composition than cand-3.
topic_accuracy: 5
neighborhood_specificity: 4   # palms-as-center loses some Broadwalk anchor
photorealism: 5
luxury_real_estate_fit: 4
full_bleed_composition: 5
brand_consistency: 4
artifact_free: 5
crop_safety_card_and_hero: 4
total: 36/40
decision: finalist
```

---

## plantation

**Brief:** mature tree-canopy residential street, royal palms forming canopy.

### cand-2 — WINNER ✓

```yaml
visual_description: |
  Symmetric royal-palm canopy arching overhead across both sides of a
  quiet residential street; dappled warm late-afternoon sunlight on the
  road surface; refined residential structures barely visible in the
  background through the canopy; lush emerald landscaping along the curbs.
topic_accuracy: 5            # royal-palm streets = canonical Plantation
neighborhood_specificity: 5  # symmetric palm canopy is Plantation's signature
photorealism: 5
luxury_real_estate_fit: 5    # editorial magazine quality
full_bleed_composition: 5
brand_consistency: 5
artifact_free: 5
crop_safety_card_and_hero: 5 # vertical-aligned subject center; crops well at all ratios
total: 40/40
decision: winner
```

### cand-1 — finalist

```yaml
visual_description: Palms lining street, slightly less symmetric than cand-2.
total: 37/40
decision: finalist
```

### cand-3 — finalist

```yaml
visual_description: Same kind of palm street, slightly different angle but less canopy-density than cand-2.
total: 36/40
decision: finalist
```

---

## weston

**Brief:** master-planned luxury suburb, manicured lake/greenway, refined homes.

### cand-3 — WINNER ✓

```yaml
visual_description: |
  Calm reflective community lake at golden hour. Tall slender palms on
  the right edge framing the composition; mature shade trees on the left
  side; refined waterfront residential rooflines barely visible across
  the lake; manicured emerald lawn rolling down to the water; brass-tinted
  sky reflection on the water surface.
topic_accuracy: 5            # lake + master-planned suburb = canonical Weston
neighborhood_specificity: 5  # the lake-community setting is Weston's identity
photorealism: 5
luxury_real_estate_fit: 5    # editorial luxury suburb composition
full_bleed_composition: 5
brand_consistency: 5
artifact_free: 5
crop_safety_card_and_hero: 4 # crops well; subject distributed across width
total: 39/40
decision: winner
```

### cand-1 — finalist

```yaml
visual_description: |
  Lake with Spanish-moss-draped oak in left foreground, planned-community
  houses across, golden hour.
total: 38/40
decision: finalist
```

### cand-2 — finalist

```yaml
visual_description: Open centered lake view without foreground anchor.
total: 36/40
decision: finalist
```

---

## coral-springs

**Brief:** tree-lined master-planned residential boulevard, NW Broward,
civic/planned-community calm with greenery.

### cand-2 — WINNER ✓

```yaml
visual_description: |
  Wide tree-canopy boulevard with mature oaks arching overhead across both
  sides; manicured landscaped median strip in the center (small palms +
  green ornamental plantings); soft warm late-afternoon sunlight raking
  across the road surface; refined planned-community residential rooflines
  barely visible at the horizon; civic/planned-community calm.
topic_accuracy: 5            # canopy boulevard = canonical Coral Springs
neighborhood_specificity: 5
photorealism: 5
luxury_real_estate_fit: 5
full_bleed_composition: 5
brand_consistency: 5
artifact_free: 5
crop_safety_card_and_hero: 5 # symmetric vertical axis crops perfectly at all ratios
total: 40/40
decision: winner
```

### cand-1 — finalist

```yaml
visual_description: Same tree-canopy boulevard with slight asymmetry; ~38/40.
total: 38/40
decision: finalist
```

### cand-3 — finalist

```yaml
visual_description: Tree-canopy boulevard, similar composition with subtly different angle.
total: 37/40
decision: finalist
```

---

## davie

**Brief:** equestrian estate / ranch-style residential landscape; white rail
fencing; mature trees; equestrian identity without people.

### cand-1 — WINNER ✓

```yaml
visual_description: |
  Three-rail white wooden horse-trail fence curves through tall green
  pasture grass at warm late afternoon; distant tree line of mature
  trees; soft warm golden hour sunlight; low amber sky; brass-tinted
  highlights on the fencing; no horses, no riders, no people; refined
  ranch-estate quality.
topic_accuracy: 5            # rail fence + pasture = canonical Davie equestrian identity
neighborhood_specificity: 5
photorealism: 5
luxury_real_estate_fit: 4    # could be 5 with more visible ranch-estate context, but the brief said "no people" and the rail-fence-through-pasture reads correctly
full_bleed_composition: 5
brand_consistency: 5
artifact_free: 5
crop_safety_card_and_hero: 4 # fence S-curve survives both crops; subject distributed
total: 38/40
decision: winner
```

### cand-2 — finalist

```yaml
visual_description: Straight rail fence extending into distance.
total: 36/40
decision: finalist
```

### cand-3 — finalist

```yaml
visual_description: |
  Rail fence curving with distant ranch homes visible right edge; adds
  context but slightly less clean composition.
total: 37/40
decision: finalist
```

---

## sunrise

**Brief:** western Broward suburban/lake community, lakes + palms + sunny
planned-community feel.

### cand-2 — WINNER ✓

```yaml
visual_description: |
  Centered community lake view at golden hour with flowering shrubs in
  the foreground (a low band of cream/gold blooms); tall palms framing
  both sides of the composition; refined planned-community residential
  rooflines barely visible across the lake; soft pastel sky reflection
  on the water; warm light bathing the scene.
topic_accuracy: 5            # lake + palms + planned community = canonical Sunrise
neighborhood_specificity: 5
photorealism: 5
luxury_real_estate_fit: 5    # editorial-magazine quality with flowering accents adding seasonal interest
full_bleed_composition: 5
brand_consistency: 5         # warm cream/golden + brass + lush greens
artifact_free: 5
crop_safety_card_and_hero: 5 # centered subject; survives both crops perfectly
total: 40/40
decision: winner
```

### cand-1 — finalist

```yaml
visual_description: Lake with palms framing left, flowering shrubs in foreground; ~37/40.
total: 37/40
decision: finalist
```

### cand-3 — finalist

```yaml
visual_description: Lake with palms framing right side; similar quality to cand-1.
total: 37/40
decision: finalist
```

---

## Summary

| slug | winner | score | finalists | finalist_scores |
|------|--------|-------|-----------|-----------------|
| deerfield-beach | cand-1 | 40/40 | cand-2, cand-3 | 37, 37 |
| hollywood | cand-3 | 39/40 | cand-1, cand-2 | 35, 36 |
| plantation | cand-2 | 40/40 | cand-1, cand-3 | 37, 36 |
| weston | cand-3 | 39/40 | cand-1, cand-2 | 38, 36 |
| coral-springs | cand-2 | 40/40 | cand-1, cand-3 | 38, 37 |
| davie | cand-1 | 38/40 | cand-2, cand-3 | 36, 37 |
| sunrise | cand-2 | 40/40 | cand-1, cand-3 | 37, 37 |

All winners ≥ 34/40 acceptance threshold (range 38-40/40, avg 39.4/40).
All finalists ≥ 34/40 (range 35-38/40). No slug required prompt-refinement
regeneration. No slug required falling back to Cycle 39.
