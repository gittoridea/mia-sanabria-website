# Cycle 40B — Image Tool Benchmark

> Single low-cost benchmark candidate before committing to the 21-candidate
> batch. Per Cycle 40B mission brief Phase 2 gate.

```yaml
tool: gemini-2.5-flash-image
model: gemini-2.5-flash-image
prompt: |
  Full prompt (header + Davie brief, see image-candidates/davie/prompt.txt
  for the exact string). Brief:
  documentary-style editorial photograph of an open equestrian-friendly
  Florida ranch estate landscape in Davie, central-western Broward County,
  a curving three-rail white wooden horse-trail fence winding through tall
  green pasture grass at warm late afternoon, distant tree line of mature
  trees, soft warm golden hour sunlight, low warm sky, refined ranch-estate
  residential rooflines barely visible in the distant background,
  brass-tinted highlights, no horses no riders no people.

output_path: docs/artifacts/cycle-40b-image-lab-hero-recovery/image-candidates/davie/cand-1.png
dimensions: 1024x1024
file_size: 1.7MB (raw PNG; will optimize to ~250-400KB on export to public/markets/)
generation_time: 6.3 seconds

automated_metrics:
  perimeter_white_ratio: 0.000010 (<<< threshold 0.25 — pass)
  perimeter_total: 194800
  perimeter_near_white: 2
  mean_brightness: 122.5 (well-balanced)
  mean_saturation_proxy: 0.440 (colorful, not desaturated)

visual_description: |
  White wooden 3-rail horse-trail fence S-curves through tall green
  pasture grass at warm late afternoon. Mature tree line in middle
  distance behind fence. Soft golden hour amber sky above. No
  horses, no riders, no people, no text, no logos, no border or
  frame artifacts. Composition is full-bleed edge-to-edge.

scorecard:
  topic_accuracy: 5/5            # equestrian rail fence + pasture = canonical Davie
  neighborhood_specificity: 4/5  # rail-fence-through-pasture is Davie's signature
  photorealism: 5/5              # reads as DSLR shot, not painted
  luxury_real_estate_fit: 4/5    # editorial magazine quality; could be 5 with refined-estate context
  full_bleed_composition: 5/5    # edge-to-edge, no frame
  brand_consistency: 5/5         # golden hour, cream/green palette, brass tones
  artifact_free: 5/5             # no people, text, logos, weird objects
  crop_safety_card_and_hero: 4/5 # well-distributed subject; survives 1200x1500 and 1200x630 crops
  total: 37/40 (above ≥34/40 acceptance threshold)

passes_full_bleed: yes
passes_photorealism: yes
passes_neighborhood_specificity: yes — equestrian rail fencing is Davie's identity per official Town of Davie tagline ("western theme")
passes_brand_fit: yes

failure_modes_observed: none on this candidate
  - prior Cycle 37 framed-canvas / gallery-wall defect: ABSENT (no border/frame)
  - prior Cycle 38 wrong-subject defect: ABSENT (subject matches brief)
  - safety-filter block: ABSENT

decision: use_this_tool
  - gemini-2.5-flash-image performs well on the refined prompt header v3 uses
  - 6.3s/candidate × 21 candidates = ~140s sequential, ~70s with concurrency=2
  - estimated cost: 21 × ~$0.039 = ~$0.82 for full batch
  - acceptable
```

## Verdict

Proceed with full 21-candidate batch (`--slugs=all --candidates=3`) via the
v3 generator. No tool change. No prompt tightening required at the global
header level — the Davie benchmark indicates the rejection rules (no
people, no frames, full-bleed) are being honored.

Per-slug prompt refinement may still be needed if specific candidates
violate the brief (e.g., Hollywood returning generic beach vs the Broadwalk
brick promenade). That decision happens at Phase 6 (scoring) — regenerate
the offending slug only.
