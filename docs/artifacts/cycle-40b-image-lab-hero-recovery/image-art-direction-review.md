# Cycle 40B — Image Art Direction Review

> Per-slug rationale for the winning candidate. Companion to
> `image-candidate-scorecards.md` (numeric) and `image-manifest.md` (final
> paths + sizes). This doc explains the *why* behind each pick — what's
> uniquely good vs the other two candidates, what tradeoff was accepted.

## deerfield-beach — winner: cand-1 (40/40)

**Why:** The two-palm composition framing the pier creates visual depth that
neither cand-2 (no palms — generic beach) nor cand-3 (right-edge pier —
unsafe crop) achieved. The pier extends from the center of the frame
forward into the water, anchoring the shot. Distant coastal residentials
add place-context without dominating. The brass-tinted water highlights
match Mia's site palette exactly.

**Tradeoffs accepted:** None at this score. Cand-1 dominates the slug.

**Improvement over Cycle 39:** Cycle 39's deerfield-beach was a straight-on
pier shot at golden hour — beautiful but flatter. Cycle 40B adds the
palm-framing dimension and explicit Atlantic + coastal-residential context
visible at the horizon. Reads as more deliberate art direction.

## hollywood — winner: cand-3 (39/40)

**Why:** Of the three, cand-3 has the strongest Broadwalk anchor — the
brick paver promenade clearly winds away into the distance, with mature
palms providing left-foreground depth and the Atlantic visible beyond the
seawall on the right. Cand-1 had faint distant figures (borderline brand
violation under "no people") and cand-2 centered the palms which lost the
Broadwalk anchor.

**Tradeoffs accepted:** Slight crop-safety penalty (4/5) because the
Broadwalk subject is distributed left-to-right; OG center-crop preserves
the brick promenade through the middle. Acceptable.

**Improvement over Cycle 39:** Cycle 39's hollywood was good but the palms
sat closer to centered. Cycle 40B's left-anchor palms + diagonal Broadwalk
recession create a more dynamic editorial composition.

## plantation — winner: cand-2 (40/40)

**Why:** Symmetric royal-palm canopy is THE Plantation signature. Cand-2
has the strongest symmetry of the three — palms arching from both sides
forming a perfect canopy tunnel over the road; the distant house barely
visible through the canopy adds residential context without distracting.
Dappled warm light on the road surface reads as a quiet luxury suburb at
golden hour.

**Tradeoffs accepted:** None. Cand-2 is the cleanest of an already strong
trio.

**Improvement over Cycle 39:** Cycle 39's plantation was a single-side palm
canopy. Cycle 40B's symmetric canopy + visible residential anchor is more
editorial — magazine quality rather than stock-photo quality.

## weston — winner: cand-3 (39/40)

**Why:** Cand-3 is the only one of three with both lake AND palms AND
refined residential context across the water. Cand-1 had a Spanish-moss
oak that's a beautiful Florida cue but more rural Plantation/Davie than
Weston master-planned suburb. Cand-2 was too pure-landscape (lake without
the planned-community signal).

**Tradeoffs accepted:** Crop-safety 4/5 because the subject distributes
across the width; portrait crop preserves left-shade-tree + lake; landscape
OG preserves the across-lake homes.

**Improvement over Cycle 39:** Cycle 39's weston centered on mature oaks
and a distant pond. Cycle 40B reads more as "master-planned community on
the water" — palms + visible community homes + reflective lake.

## coral-springs — winner: cand-2 (40/40)

**Why:** The mature oak canopy arching across both sides of a wide
boulevard with a manicured landscaped median in the center captures the
Coral Springs planned-community identity perfectly. Symmetric composition
ensures the subject sits on the vertical center axis, which crops
beautifully at both portrait 1200×1500 and landscape 1200×630. The small
palm + greenery median in the foreground adds detail without competing.

**Tradeoffs accepted:** None.

**Improvement over Cycle 39:** Cycle 39's coral-springs was a tree-lined
boulevard with a less prominent median. Cycle 40B's symmetric center-median
composition reads as deliberate planned-community design — closer to what
visitors actually see driving the wider Coral Springs boulevards.

## davie — winner: cand-1 (38/40)

**Why:** Davie's signature is equestrian — the three-rail white wooden
horse-trail fence curving through pasture grass is the most recognizable
Davie cue without violating "no horses no people no rodeo." Cand-1's
S-curve fence is the cleanest of the three; cand-2 was straight (less
dynamic); cand-3 had distant ranch homes adding context but slightly
compromised the fence as the focal subject.

**Tradeoffs accepted:** Lowest winner score this cycle (38/40 vs avg 39.4).
The 4/5 on luxury_real_estate_fit reflects that "pasture + fence" reads as
ranch-estate, not waterfront-luxury. This is intentional — Davie IS the
equestrian/ranch identity, not the waterfront identity. Cand-1 honors that
without going Sears-rural-cliché.

**Improvement over Cycle 39:** Cycle 39's davie was a similar rail-fence
shot. Cycle 40B's curve is slightly more dynamic; otherwise comparable.
This was the closest call in the cycle.

## sunrise — winner: cand-2 (40/40)

**Why:** Centered lake with palms framing both sides + flowering shrubs in
the foreground gives Sunrise the most editorial composition of the three
candidates. The flowering accents (cream/gold blooms) add seasonal
interest without violating "no people no signs." The community houses
barely visible across the lake add planned-community context.

**Tradeoffs accepted:** None.

**Improvement over Cycle 39:** Cycle 39's sunrise was a similar lake +
palms composition but flatter. Cycle 40B's flowering foreground band adds
dimensionality and reads as more deliberately art-directed.

---

## Overall art direction conclusions

1. **Multi-candidate workflow worked.** Of 21 candidates, 7 scored ≥39/40
   and the lowest winner (Davie) was 38/40 — all comfortably above the
   34/40 threshold. The contact-sheet review let me see all three
   compositions side-by-side and make decisions on composition strength
   that weren't visible in a one-shot generation.

2. **No prompt-refinement regeneration needed.** Every slug had at least
   one candidate at 38+/40 on first generation. The prompt header (v3's
   refined-from-v2 with explicit "no people, no frame, no painting,
   full-bleed") consistently produces editorial-quality output.

3. **One automated-retry triggered** (Plantation cand-2, attempt 1 was a
   framed-art composition at perim_white=0.574; attempt 2 was a clean
   palm-canopy at 0.008). The v3 retry-on-perimeter-white loop is doing
   its job.

4. **No slug fell back to Cycle 39.** Cycle 40B is a categorical visual
   upgrade for all 7 slugs.

5. **Crop safety is the most variable axis.** Two finalists (deerfield-beach
   cand-3, weston cand-3) had crop-safety 3/5 or 4/5 because their
   subjects sat too close to a single edge. The winners are all 4-5/5
   crop-safety because their subjects are centered or distributed.
