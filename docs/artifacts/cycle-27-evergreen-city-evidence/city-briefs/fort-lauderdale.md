# Fort Lauderdale — Evidence Brief

**Slug:** `fort-lauderdale` | **Cluster:** primary | **Status:** anchor market
**Source ledger rows:** FTL-1 … FTL-6 in `../source-ledger.md`

## City identity

Fort Lauderdale is the seat of Broward County's 31-municipality cohort and Mia Sanabria's home market. The city is anchored by 165 miles of navigable inland waterways — the geographic basis for the "Venice of America" designation used on the City's own official site — and pairs that boating geography with a working downtown, a continuous A1A beach corridor, an international airport on the south boundary, and the Port Everglades deepwater seaport.

## Official evergreen facts

- **County:** Broward.
- **Designation:** "Venice of America" — official City framing, citing 165 miles of inland waterways.
- **Largest of:** Broward's 31 municipalities (city site / Census).
- **Incorporated:** 1911 (March 27, 1911 per Census-cross-referenced record). *Not currently in production copy.*
- **Area:** ~38.6 sq mi total (~34.7 land + ~3.8 water) per Census QuickFacts. *Not currently in production copy.*
- **Named features:** Las Olas Boulevard ; downtown Riverwalk ; A1A beach corridor ; Greater Fort Lauderdale–Hollywood International Airport (FLL — operated by Broward County) ; Port Everglades ; New River.
- **Deepwater context:** Port Everglades is a deepwater seaport. The Las Olas Isles canal cohort routes to the Atlantic via the Port Everglades channel without fixed-bridge clearance constraints (the typical yacht draw).

## Mia ICP relevance

| Audience | Why Fort Lauderdale is the anchor |
|---|---|
| Luxury sellers | The city's waterfront cohort — Las Olas Isles, Rio Vista, Harbor Beach, Coral Ridge — drives the upper end of Mia's listing pipeline. Sellers in these blocks need a representative who can position to the right of three buyer profiles (yachting, walkable in-town, beach corridor) rather than a one-size luxury pitch. |
| Waterfront / lifestyle buyers | The deepwater isle + beach + downtown trifecta is rare in South Florida. Buyers who move here are buying a *lifestyle* — boat, beach, walkability — not just a residence. |
| Qualified SE FL buyers | Fort Lauderdale is the natural starting comparison for buyers also considering Boca Raton or Delray. The architectural variety and water-access mix is the differentiator. |
| Absentee luxury owners | Many waterfront residences are second / seasonal. Mia's role for absentee owners is local execution — preparation, vendor coordination, comparable-sales briefs — without the owner relocating to manage. |
| Expired-listing sellers | Fort Lauderdale generates a steady expired-listing pool because public estimates routinely miss dockage and renovation depth. The reposition opportunity is real. **Treat as a secondary entry channel**, not a homepage frame. |
| Relocating buyers | The "Why Fort Lauderdale?" conversation usually centers on FLL connectivity, the working downtown, and beach proximity — not on the predatory "snowbird tax flight" trope. Frame as decision support, not opportunism. |
| Investors | Investor lens (short-term-rental, condo-hotel) is significantly constrained by city ordinance and condo association rules. **Do not present Fort Lauderdale as an investor-friendly market** without confirming the specific block's rules. |

## Local-expert framing Mia can credibly own

- "Block-by-block." Two homes on the same canal can trade at different multiples depending on dock specifics — Mia speaks to that distinction.
- "If I don't know the answer, I will find it." (Anchor line from `src/lib/mia.ts:36`.)
- "Three buyer profiles, one city." Yachting / in-town / beach — Mia narrates each rather than blending them.

## Safe language examples

- "Fort Lauderdale's waterfront isles and beach corridor share the same city but trade as distinct micro-markets."
- "Buyers usually start with one decision: ocean-access dockage or in-town walkability."
- "Pricing turns on dockage, lot, and renovation depth more than headline market trends."

## Unsafe language to avoid

- "Best place to live in Florida." (Ranking claim.)
- "Safe family neighborhoods." (Steering.)
- "Top-rated schools." (Steering.)
- "Sold for record price." (Volume claim without source.)
- "Guaranteed waterfront sale in 60 days." (Performance promise.)
- "The yachting capital of the world." — currently in FAQ; trade-association rhetoric. Suggested softening to "considered one of the world's leading yachting cities" or sourcing to an industry body.

## Facts currently used in `src/lib/markets.ts` (slug `fort-lauderdale`)

| Section | Claim | Status |
|---|---|---|
| `intro` / `tagline` / `highlights` | Waterfront / beach / in-town neighborhoods ; Las Olas / downtown / beach / FLL / Port Everglades access | ✓ verified — generic city features per City of Fort Lauderdale site |
| `lifestyle` / `priceCharacter` | Combines boating, beach, downtown, residential ; pricing block-by-block | ✓ qualitative — safe |
| `latitude` / `longitude` | 26.1224, -80.1373 | ✓ verified — Census/Wikipedia infobox |
| `localContext` | Stretches Atlantic → Intracoastal → New River / downtown ; segments by water access, Las Olas proximity, beach corridor | ✓ verified — geography per City site |
| `miaQuote` | "Known as the Venice of America, Fort Lauderdale is built around more than 165 miles of inland canals — the geography that anchors the deepwater yachting market." | ✓ verified — City uses "Venice of America" with 165-miles framing |
| `aeoAnswer` | Venice of America ; 165 miles canals ; deepwater yacht-capable + in-town + Las Olas + A1A + Riverwalk ; Port Everglades / airport / Las Olas-to-beach axis | ✓ verified — all named features confirmed |
| `propertyTypes` | Deepwater SF / beach-corridor condos / in-town historic / contemporary new-build estates on finger isles / townhomes / low-rise condos | ✓ qualitative — safe ; matches market |
| `buyerGuidance` / `sellerGuidance` | Three buyer profiles ; dockage / walkability / beach ; seawall + dock + flood / impact protection diligence | ✓ qualitative — safe |
| FAQ 1 — "What makes Fort Lauderdale's waterfront different?" | 165 miles navigable inland waterways ; deepwater ocean access via Port Everglades ; no fixed bridges between major yacht-capable canals and the Atlantic ; "yachting capital of the world" | ✓ first three claims verified ; **"yachting capital of the world" — flagged FTL-FAQ-1; suggest softening or sourcing** |
| FAQ 2 — "Which neighborhoods do most luxury buyers compare?" | Las Olas Isles, Rio Vista, Harbor Beach, Coral Ridge, Victoria Park | ✓ qualitative — neighborhood enumeration, safe |
| FAQ 3 — Dockage drives pricing more than square footage | ✓ qualitative — safe |
| FAQ 4 — Single-family vs condo balance | ✓ qualitative — safe |
| FAQ 5 — How Mia approaches | ✓ qualitative — safe |
| `comparisonContext` | Anchor city for Eastern Fort Lauderdale waterfront cohort ; comparisons to Las Olas Isles, Harbor Beach, Victoria Park, Coral Ridge, Bay Colony, Bermuda Riviera | ✓ qualitative — safe |

## Facts verified

All `markets.ts` claims except "yachting capital of the world" (FAQ 1) trace to primary sources via the source ledger.

## Facts needing source upgrade

- FAQ 1 "yachting capital of the world." Trade-association language. **Recommended action:** soften to "considered one of the world's leading yachting cities" OR source to the Marine Industries Association of South Florida (MIASF) / Greater Fort Lauderdale Chamber if Mia wants to retain the framing. *Not a launch blocker but a small-fix opportunity in Phase 7.*

## Facts needing Mia / local-expert confirmation

None. The Fort Lauderdale entry has been live since pre-Cycle-25 and survived Cycle 22 Mia-decision review.

## Facts to remove or neutralize

None — except the optional FAQ 1 softening above.

## Suggested internal links (already present)

- Las Olas Isles, Harbor Beach, Victoria Park, Coral Ridge, Bay Colony, Bermuda Riviera — all in `internalLinks` array.
- **Optional addition:** Pompano Beach as an internal link, since Pompano's `comparisonContext` already references Fort Lauderdale as a comparison anchor. Would round out the city-to-city navigation.

## Suggested search / filter implications

- A future buyer-search UI should let buyers filter waterfront residences by **route to ocean** (Port Everglades vector vs. Hillsboro Inlet vector vs. fixed-bridge canal). Fort Lauderdale's geographic position makes this filter meaningful.
- A future seller-CMA UI should accept dock dimensions as inputs.

## Suggested photo / visual direction

- Replacement for the current placeholder hero JPG: ideally an honest Fort Lauderdale residential streetscape (not the Las Olas tourism shot, not a yacht ad). A tree-lined Victoria Park block, a Rio Vista canal at low-traffic hour, or a Coral Ridge interior street would all read as "Mia's daily geography."
- Avoid stock yacht-on-blue-water images — those over-represent the luxury tropes and under-represent the city Mia actually walks.

## Source citations / ledger references

- FTL-1 through FTL-6 in `../source-ledger.md`.
- Anchor URLs: https://www.fortlauderdale.gov/visitors/about-fort-lauderdale ; https://www.census.gov/quickfacts/fact/table/fortlauderdalecityflorida/PST045224 ; https://www.porteverglades.net/about-us/ ; https://www.broward.org/Airport/Pages/default.aspx
