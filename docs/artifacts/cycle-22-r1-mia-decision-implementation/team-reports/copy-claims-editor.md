# Team 2 — Copy / Claims Editor

**Files inspected/edited:** `src/lib/markets.ts` (5 miaQuote strings).

## Approved decisions applied

| Market | Line | Before | After |
|---|---|---|---|
| Fort Lauderdale | 132 | "Known globally as the 'Venice of America,' Fort Lauderdale is the **undisputed** yachting capital of the world." | "Known as the Venice of America, Fort Lauderdale is built around more than 165 miles of inland canals — the geography that anchors the deepwater yachting market." |
| Boca Raton | 364 | "Boca Raton represents the **absolute zenith** of South Florida luxury living — renowned globally for its pristine beaches, Mediterranean Revival architecture, and **an unparalleled standard of living**." | "Boca Raton's distinctive layer is Addison Mizner's Mediterranean Revival architecture, ocean-access estate sections, and a balance between resort feel and a full-time residential community." |
| Palm Beach | 443 | "Palm Beach stands as the **absolute pinnacle** of generational wealth and **exclusivity**." | "Palm Beach is a small barrier-island town defined by architectural review, generational tenure, and three distinct sections — North End, Mid-Town, and South End." |
| Delray Beach | 514 | "Delray Beach **perfectly captures the essence** of vibrant coastal luxury. Known as the 'Village by the Sea,' this dynamic enclave **seamlessly blends** … the **ultra-luxurious** lifestyle of South Florida's **most coveted** coastlines." | "Delray Beach — the Village by the Sea — is organized around a walkable Atlantic Avenue downtown. Proximity to Atlantic is the dominant pricing variable; the residential heart spans Lake Ida, Tropic Isle, and the A1A beach corridor." |
| Lighthouse Point | 594 | "Lighthouse Point is the **ultimate sanctuary** for the avid boater and yachtsman — an **exclusive** nautical enclave **globally recognized** for its pristine deep-water canals, offering seamless, no-fixed-bridge access to the Atlantic Ocean via the Hillsboro Inlet." | "Lighthouse Point is a small Broward city north of Pompano Beach, known for finger-isle canals with no-fixed-bridge ocean access via the Hillsboro Inlet — a defining feature for yacht-capable single-family residences." |

## Banned-phrase removal — verification

```
$ grep -ciE 'undisputed yachting|absolute zenith|absolute pinnacle|perfectly captures|ultra-luxurious|unparalleled standard|globally recognized|ultimate sanctuary' src/lib/markets.ts
0
```

## Rules followed

- Used the approved safe replacements from `MIA_DECISION_PACKET.md` §2.1-§2.5 verbatim.
- Removed: "undisputed", "absolute zenith", "absolute pinnacle", "perfectly captures", "seamlessly blends", "ultra-luxurious", "most coveted", "ultimate sanctuary", "exclusive (nautical enclave)", "globally recognized", "unparalleled standard of living".
- Did NOT touch homepage H1, Hero.tsx, site.ts, mia.ts (per Team 1 decision-divergence note).
- Did NOT touch any other market page or component.
- Did NOT add any new claim.
- Preserved market specificity, luxury tone (without overclaim), and factual restraint.
- Length budgets — all 5 replacements ≤ 30 words shorter than originals or comparable; `audit:copy-density` advisory only.

## Implementation safe now? YES — 5 single-line replacements; mechanical text edits.

## Verification method

- `grep -nE 'miaQuote' src/lib/markets.ts` shows 5 entries at expected lines.
- `bun run audit:no-fabrications` exits 0 (unchanged from baseline).
- `bun run audit:stale` exits 0 (unchanged).
- Post-build `out/` will contain the new strings rendered into market page HTML.
