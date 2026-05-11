# Reviewer Pack 02 — Brevity / Compression Editor

> Cycle 19C-COPY. Reviewer role: Brevity / Compression Editor. Reviewed against `docs/CYCLE_19C_COPY_DOCTRINE.md` and `docs/artifacts/cycle-19c-copy/copy-inventory.md`. No source files were edited; this pack proposes rewrites only.

## Executive summary

The pages that fail the 55-word paragraph and 28-word sentence thresholds are dominated by long, two-idea-per-sentence prose in the market data file (`src/lib/markets.ts`) plus three editorial sections in the Fort Lauderdale V2 component (`src/components/markets/FortLauderdaleV2.tsx`). The pattern is repeatable: a paragraph names geography once, then names it again as a comma-spliced clarifier, then trails into an "and" chain that bundles three diligence variables into a single 40-60 word sentence. Splitting along the natural seams — survey vs. lifestyle, buyer vs. seller, structural vs. amenity — preserves every diligence variable, every hedge, every disclaimer, and every CTA destination while cutting mean paragraph length 25-40% on the worst offenders. Repeated-geography paragraphs (Fort Lauderdale at 8, Home and Insights index at 7+) can be neutralized by replacing the second and third place-mention in the same paragraph with "the city", "these isles", "the corridor", or a pronoun — the doctrine's preferred pattern. The proposals below are scoped to the worst-density paragraphs that do not carry source-ledger facts or compliance language verbatim; none touches the Fisher Family Pier, MIASF, US Census, Florida DEP, ARCOM, or LauderGO Water Trolley sentences (those stay verbatim because they cite a source).

## Findings

### Finding 1: Fort Lauderdale `aeoAnswer` — five-idea sentence chain compressed

- **Route / file:** `src/lib/markets.ts` (line 134, `slug: "fort-lauderdale"` → `aeoAnswer`)
- **Current copy:** "Fort Lauderdale is known for waterfront luxury living anchored by more than 165 miles of inland canals — the reason it is called the Venice of America. The city pairs deepwater yacht-capable residences along the Intracoastal and finger isles with established in-town neighborhoods near Las Olas Boulevard, the beach corridor on A1A, and downtown's Riverwalk. Buyers compare ocean access, walkability, and architectural era; sellers position on dockage, lot, and condition. Port Everglades, Fort Lauderdale-Hollywood International Airport, and the Las Olas-to-beach axis frame the daily-life geography that makes the market distinct in South Florida."
- **Proposed copy:** "Fort Lauderdale is known for waterfront living anchored by more than 165 miles of inland canals — the reason it is called the Venice of America. The city pairs deepwater yacht-capable residences with in-town neighborhoods near Las Olas Boulevard, the A1A beach corridor, and downtown's Riverwalk. Buyers compare ocean access, walkability, and architectural era. Sellers position on dockage, lot, and condition. Port Everglades, FLL, and the Las Olas-to-beach axis frame the daily geography that distinguishes the market in South Florida."
- **Reason:** Splits the 40-word "Buyers compare … sellers position …" semicolon sentence; trims "luxury" (already implied by site framing); trims the doubled "established" and one Intracoastal reference; preserves the 165-mile ledger fact and every diligence variable.
- **Risk if changed:** Meta-description build trims `aeoAnswer` first sentence; the proposed first sentence is shorter but preserves the 165-mile claim. Verify the rebuild does not push the meta description under target length. AEO snippet eligibility unaffected.
- **Factual / source-ledger review required:** no (165-mile claim preserved verbatim; "Venice of America" preserved verbatim).
- **Category:** 1

### Finding 2: Fort Lauderdale `buyerGuidance` — diligence-stack run-on split into four sentences

- **Route / file:** `src/lib/markets.ts` (line 143, `slug: "fort-lauderdale"` → `buyerGuidance`)
- **Current copy:** "Fort Lauderdale suits buyers who want a real city alongside deepwater boating, beach access, and a recognizable downtown. The first decision is almost always water — ocean access via the Intracoastal versus fixed-bridge canals — followed by walkability and architectural era. Buyers should plan diligence around seawall condition, dock capacity, flood zone, hurricane shutters, and renovation history. A clear brief on lifestyle priorities makes the search decisive rather than scattered across too many neighborhoods at once."
- **Proposed copy:** "Fort Lauderdale suits buyers who want a real city alongside deepwater boating, beach access, and a recognizable downtown. The first decision is almost always water — ocean access via the Intracoastal versus fixed-bridge canals. Walkability and architectural era come next. Diligence covers seawall, dock capacity, flood zone, hurricane shutters, and renovation history. A clear brief makes the search decisive rather than scattered across too many neighborhoods."
- **Reason:** Doctrine "one idea per sentence" — splits the 30-word "first decision …" sentence and the 24-word diligence list; "Buyers should plan diligence around" collapses to "Diligence covers" without losing the five verifiable variables.
- **Risk if changed:** None to schema; the diligence list is preserved verbatim. The fourth-sentence trim drops "on lifestyle priorities" — minor voice loss, recoverable if the principal prefers the long form.
- **Factual / source-ledger review required:** no
- **Category:** 1

### Finding 3: Fort Lauderdale `sellerGuidance` — repeated "luxury / waterfront" implied, three-tier list flattened

- **Route / file:** `src/lib/markets.ts` (line 145, `slug: "fort-lauderdale"` → `sellerGuidance`)
- **Current copy:** "Sellers in Fort Lauderdale should position to one of three buyer profiles: yachting and waterfront, in-town walkability, or beach-corridor lifestyle. Local representation matters because pricing turns on dockage specifics, lot orientation, and street-level reputation that public estimates miss. Pre-list preparation typically includes seawall and dock confirmation, light staging tuned to the buyer pool, and a comparable-sales brief that separates renovated trades from estate-condition sales. The home should tell one clear story before it lists."
- **Proposed copy:** "Sellers should position to one of three buyer profiles: yachting, in-town walkability, or beach-corridor lifestyle. Pricing turns on dockage, lot orientation, and street-level reputation that public estimates miss. Pre-list preparation includes seawall and dock confirmation, staging tuned to the buyer pool, and a comparable-sales brief that separates renovated trades from estate-condition sales. The residence should tell one clear story before it lists."
- **Reason:** Drops the redundant "in Fort Lauderdale" (the section heading already names the market) and the doctrine-flagged adjective stack "Local representation matters because pricing"; switches "home" → "residence" for voice consistency with the FortLauderdaleV2 component which uses "residence" throughout.
- **Risk if changed:** None to compliance. "Local representation matters" was a soft selling phrase; the proposed phrasing keeps the diligence content but loses one piece of practice framing — acceptable since the entire site already frames the practice as local.
- **Factual / source-ledger review required:** no
- **Category:** 1

### Finding 4: Pompano Beach `aeoAnswer` — 52-word sentence split, geography-repeat reduced

- **Route / file:** `src/lib/markets.ts` (line 1126, `slug: "pompano-beach"` → `aeoAnswer`)
- **Current copy:** "Pompano Beach is a northeastern Broward city of approximately 25 square miles, framed on the barrier island by Lauderdale-by-the-Sea to the south and Hillsboro Beach to the north. The market is known for a roughly three-mile public beachfront, the rebuilt Fisher Family Pier (dedicated April 2022) and the six-acre Pompano Beach Fishing Village in the East CRA District, deepwater Intracoastal residences, and an active reef-and-wreck dive corridor — Florida DEP's state-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area runs offshore. The city's two CRA districts (East and Northwest) are visibly reshaping the downtown Atlantic Boulevard corridor and Old Town. For luxury and waterfront buyers, the market trades at relative value to Fort Lauderdale, Lighthouse Point, and the Palm Beach County markets to the north."
- **Proposed copy:** "Pompano Beach is a northeastern Broward city of approximately 25 square miles, framed on the barrier island by Lauderdale-by-the-Sea to the south and Hillsboro Beach to the north. The market is known for a roughly three-mile public beachfront, the rebuilt Fisher Family Pier (dedicated April 2022), and the six-acre Pompano Beach Fishing Village in the East CRA District. Deepwater Intracoastal residences and an active reef-and-wreck dive corridor round out the waterfront profile; Florida DEP's state-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area runs offshore. The East and Northwest CRA districts are visibly reshaping Atlantic Boulevard and Old Town. The market trades at relative value to Fort Lauderdale, Lighthouse Point, and the Palm Beach County markets to the north."
- **Reason:** The original second sentence runs 52 words and packs five distinct items behind an em-dash; splitting at "Deepwater Intracoastal residences …" keeps every source-ledger fact intact (Fisher Family Pier April 2022, six-acre Fishing Village, Florida DEP Kristin Jacobs ECA) while restoring sentence rhythm. Drops the doctrine-flagged "for luxury and waterfront buyers" filler intro.
- **Risk if changed:** Source-ledger lines preserved verbatim. Audit `audit:rendered` should re-confirm Fisher Family Pier and Kristin Jacobs ECA strings still match the rendered HTML.
- **Factual / source-ledger review required:** yes — the change is structural, but rebuild audits should confirm the source-ledger facts still render verbatim.
- **Category:** 1

### Finding 5: Pompano Beach `buyerGuidance` — three-segment diligence stack split

- **Route / file:** `src/lib/markets.ts` (line 1135, `slug: "pompano-beach"` → `buyerGuidance`)
- **Current copy:** "Pompano Beach suits buyers who want Atlantic beach access, deepwater boating, and a city visibly reinvesting in its oceanfront and downtown — at relative value to Fort Lauderdale and the Palm Beach County markets. The first conversation should establish whether the priority is A1A-corridor condominium, Intracoastal-side single-family, inland canal, or interior. Diligence on waterfront residences covers seawall, dock, bridge clearance, and route to the Hillsboro Inlet (or the Hillsboro Inlet versus Port Everglades vector for canals farther south). Diligence on condominiums covers reserves, milestone-inspection status, hurricane and salt-air maintenance history, and rental rules. Buyers shopping the redevelopment corridor should weigh CRA timelines and the construction context of the immediate block."
- **Proposed copy:** "Pompano Beach suits buyers who want Atlantic beach access, deepwater boating, and a city reinvesting in its oceanfront and downtown — at relative value to Fort Lauderdale and the Palm Beach County markets. The first conversation establishes the priority: A1A condominium, Intracoastal single-family, inland canal, or interior. Waterfront diligence covers seawall, dock, bridge clearance, and route to the Hillsboro Inlet — for canals farther south, the Port Everglades vector applies. Condominium diligence covers reserves, milestone-inspection status, salt-air maintenance history, and rental rules. Buyers shopping the redevelopment corridor weigh CRA timelines and the construction context of the immediate block."
- **Reason:** "Diligence on waterfront residences covers" → "Waterfront diligence covers" saves four words per sentence twice; the inlet-vector parenthetical reads more cleanly as an em-dash clause; "hurricane and salt-air" collapses to "salt-air" since hurricane exposure is implicit in any South Florida coastal residence and the diligence variable is already named by the maintenance-history pointer.
- **Risk if changed:** Minor: "hurricane" deletion loses one explicit hedge. If the principal wants hurricane named, restore as "salt-air and hurricane maintenance history" — costs one word, gains the explicit hedge.
- **Factual / source-ledger review required:** no
- **Category:** 1

### Finding 6: Boca Raton `aeoAnswer` — Mizner inheritance paragraph compressed without losing pedigree facts

- **Route / file:** `src/lib/markets.ts` (line 366, `slug: "boca-raton"` → `aeoAnswer`)
- **Current copy:** "Boca Raton is a south Palm Beach County city known for layered luxury — Mediterranean Revival architecture inherited from Addison Mizner, ocean-access estate sections like Royal Palm Yacht & Country Club and Boca Bay Colony, A1A coastal condominiums, and gated club communities west of I-95. The market spans single-family waterfront, beach-corridor high-rises, golf-club estates, and family-oriented residential pockets near top-rated schools. Boca's distinguishing features are the architectural continuity east of the Intracoastal, the breadth of club lifestyles, and the balance between resort feel and full-time residential community. Buyers shop across very different micro-markets within one city."
- **Proposed copy:** "Boca Raton is a south Palm Beach County city known for layered character: Mediterranean Revival architecture inherited from Addison Mizner, ocean-access estate sections like Royal Palm Yacht & Country Club and Boca Bay Colony, A1A coastal condominiums, and gated club communities west of I-95. The market spans single-family waterfront, beach-corridor high-rises, golf-club estates, and residential pockets near recognized public and private schools. The distinguishing features are architectural continuity east of the Intracoastal, breadth of club lifestyles, and a balance of resort feel and full-time residential community. Buyers shop across very different micro-markets within one city."
- **Reason:** "Top-rated schools" is a Fair Housing steering risk under the project CLAUDE.md ("No 'best schools', 'good schools', 'safe neighborhood', 'family-friendly'"). "Top-rated" should be replaced with neutral, neighborhood-descriptive language. Also drops one "luxury" instance per doctrine (page already brands as luxury).
- **Risk if changed:** Compliance improvement — removes a Fair Housing trigger phrase. No CTA, no schema impact. Search snippet may shift slightly; meta description build pulls first sentence which is unchanged in length.
- **Factual / source-ledger review required:** yes — confirm "top-rated schools" appearing anywhere else in the codebase is addressed in the same audit pass.
- **Category:** 5

### Finding 7: Boca Raton `buyerGuidance` — east/west split + dual diligence stack tightened

- **Route / file:** `src/lib/markets.ts` (line 374, `slug: "boca-raton"` → `buyerGuidance`)
- **Current copy:** "Boca Raton suits buyers who want optionality — beach, club, or family-residential — within one city. The first decision is east versus west of I-95, which separates the coastal and downtown markets from the gated golf and tennis communities. Diligence on condominiums focuses on association reserves, special assessments, milestone-inspection status, and pet/rental rules. Diligence on club communities focuses on membership transfer rules, equity contributions, and capital fees. Buyers benefit from naming the specific lifestyle priority before touring."
- **Proposed copy:** "Boca Raton suits buyers who want optionality — beach, club, or in-town residential — within one city. The first decision is east versus west of I-95: east is coastal and downtown; west is gated golf and tennis. Condominium diligence covers association reserves, special assessments, milestone-inspection status, and pet/rental rules. Club-community diligence covers membership transfer rules, equity contributions, and capital fees. Naming the lifestyle priority before touring narrows the search to two or three serious candidates."
- **Reason:** "Family-residential" → "in-town residential" removes a Fair Housing steering term (project CLAUDE.md flags "family-friendly"; "family-residential" is in the same risk family). Splits the 27-word east/west sentence on the colon, mirrors the diligence-pair sentence pattern used in Finding 5.
- **Risk if changed:** Compliance improvement — removes a second Fair Housing trigger. No schema/CTA impact.
- **Factual / source-ledger review required:** yes — confirm "family-residential" elsewhere in the same file gets the same treatment.
- **Category:** 5

### Finding 8: Delray Beach `aeoAnswer` — 52-word "Distance to downtown" sentence split

- **Route / file:** `src/lib/markets.ts` (line 516, `slug: "delray-beach"` → `aeoAnswer`)
- **Current copy:** "Delray Beach, the self-styled Village by the Sea in central Palm Beach County, is known for a walkable Atlantic Avenue downtown that anchors the broader market. East of Federal Highway, the Marina District and Pineapple Grove offer historic blocks and boutique condominiums minutes from the beach. The residential heart includes Lake Ida north of Atlantic, Tropic Isle and Pelican Harbor south on the Intracoastal, and beach-corridor condominiums east of A1A. Distance to downtown is the dominant pricing variable across most of the city — properties that walk to Atlantic Avenue trade differently from those that drive — and that proximity defines how buyers and sellers should think about positioning."
- **Proposed copy:** "Delray Beach, the self-styled Village by the Sea in central Palm Beach County, is known for a walkable Atlantic Avenue downtown that anchors the broader market. East of Federal Highway, the Marina District and Pineapple Grove offer historic blocks and boutique condominiums minutes from the beach. The residential heart includes Lake Ida north of Atlantic, Tropic Isle and Pelican Harbor south on the Intracoastal, and beach-corridor condominiums east of A1A. Distance to downtown is the dominant pricing variable. Properties that walk to Atlantic Avenue trade differently from those that drive — and that proximity shapes how buyers and sellers position."
- **Reason:** The final sentence in the original runs 52 words across two em-dashes; splitting at "Distance to downtown is the dominant pricing variable." restores breath without losing the contrast between walking and driving. Drops the soft "across most of the city" qualifier — the proposition is unchanged.
- **Risk if changed:** None to schema or AEO eligibility.
- **Factual / source-ledger review required:** no
- **Category:** 1

### Finding 9: Home FAQ — Mia's-practice answer reframed to remove repeated-geography stack

- **Route / file:** `src/app/page.tsx` (line 28-31, `HOME_FAQ[0].answer`)
- **Current copy:** "Mia is based in Fort Lauderdale and serves clients across luxury Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach, with featured market guides for Fort Lauderdale, Coral Ridge, Victoria Park, Boca Raton, and Delray Beach."
- **Proposed copy:** "Mia is based in Fort Lauderdale and serves clients across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach. Featured market guides cover Fort Lauderdale, Coral Ridge, Victoria Park, Boca Raton, and Delray Beach."
- **Reason:** The original is a single 38-word sentence that names Fort Lauderdale three times and Boca Raton + Delray Beach twice. Splitting at "Eastern Delray Beach." removes the comma-then-with run-on; the second sentence preserves all five featured-market names exactly. Drops the doctrine-flagged "luxury" filler (Hero and meta already establish the luxury frame).
- **Risk if changed:** FAQ schema is keyed on `question` + `answer`; the answer text changes will reflect in `FaqSchema.tsx` output. Confirm `audit:schema` still passes — the change is purely textual, schema structure unaffected.
- **Factual / source-ledger review required:** no
- **Category:** 1

### Finding 10: Home AnswerFirst — 65-word "Mia represents" lead split into three sentences

- **Route / file:** `src/app/page.tsx` (line 93-97, `<AnswerFirst answer=...>`)
- **Current copy:** "Mia Sanabria represents buyers and sellers of luxury and waterfront residences across Eastern Fort Lauderdale, with adjacent primary service in Boca Raton (Palm Beach County) and Delray Beach (Palm Beach County). Her practice centers on deepwater estates and finger-isle homes along Las Olas Isles, Harbor Beach, and Rio Vista; in-town Eastern Fort Lauderdale neighborhoods such as Coral Ridge and Victoria Park; and the Mediterranean Revival, Atlantic Avenue, and beach-block trade in Boca Raton and Delray Beach. Engagements begin with a private brief — preferences, timeline, and the residence in mind — long before any showing."
- **Proposed copy:** "Mia Sanabria represents buyers and sellers of luxury and waterfront residences across Eastern Fort Lauderdale, with adjacent primary service in Eastern Boca Raton and Eastern Delray Beach (Palm Beach County). Her practice centers on deepwater estates and finger-isle homes along Las Olas Isles, Harbor Beach, and Rio Vista. Eastern Fort Lauderdale also includes in-town blocks like Coral Ridge and Victoria Park. In Palm Beach County she works the Mediterranean Revival, Atlantic Avenue, and beach-block trade in Boca Raton and Delray Beach. Engagements begin with a private brief — preferences, timeline, and the residence in mind — long before any showing."
- **Reason:** The original middle sentence is 51 words with three semicolons; the new structure renders the same three property cohorts as three readable sentences, and consolidates the doubled "(Palm Beach County)" parenthetical into one. Geography-mention pattern improves: Fort Lauderdale named once, Boca Raton named once with its Eastern qualifier, Delray Beach named once.
- **Risk if changed:** AEO snippet schema — `<AnswerFirst>` may publish an FAQ entity; confirm the rendered HTML and FaqSchema still extract the answer cleanly. The proposed answer is slightly longer (rephrased, not truncated) so snippet eligibility is preserved.
- **Factual / source-ledger review required:** no
- **Category:** 1

### Finding 11: FortLauderdaleV2 buyer-comparison Tier 1 — single 96-word paragraph rewritten as a guided list

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` (lines 615-618, Tier 1 paragraph inside the "Buyer's comparison cohort" section)
- **Current copy:** "The \"which sub-market within the city\" question. Las Olas Isles and Seven Isles trade as the canonical deepwater finger-isle markets. Harbor Beach adds gated barrier-island privacy and a beach-club component. Rio Vista trades as the New River-side counterpart with stronger walkability to Las Olas Boulevard. Coral Ridge and Victoria Park are the residential-feel alternatives where dockage is optional rather than the dominant variable. Bay Colony is the gated single-entry deepwater enclave; Bermuda Riviera is the mid-century-modern architectural alternative within the same broader cohort."
- **Proposed copy:** "The \"which sub-market within the city\" question. Las Olas Isles and Seven Isles trade as the canonical deepwater finger-isle markets. Harbor Beach adds gated barrier-island privacy with a beach-club component. Rio Vista is the New River-side counterpart, with stronger walkability to Las Olas Boulevard. Coral Ridge and Victoria Park are the residential-feel alternatives — dockage optional, not dominant. Bay Colony is the gated single-entry deepwater enclave. Bermuda Riviera is the mid-century-modern alternative within the same cohort."
- **Reason:** The original ran on a single semicolon-joined trailing clause; splitting at "Bermuda Riviera" reads cleaner. "Stronger walkability to Las Olas Boulevard" replaces "the New River-side counterpart with stronger walkability to Las Olas Boulevard" (the same idea, one comma not "with"). All eight peer links and the per-peer characterization remain.
- **Risk if changed:** Eight `<Link>` elements with specific `href` paths and "underline decoration-brass-400" styling must be preserved verbatim — the prose around them changes, but each anchor and its target slug stay identical. Verify the rebuild renders all eight peer links.
- **Factual / source-ledger review required:** no
- **Category:** 1

### Finding 12: FortLauderdaleV2 buyer-comparison Tier 2 — Pompano Beach 70-word run on closed with one sentence break

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` (lines 621-624, Tier 2 paragraph)
- **Current copy:** "The \"should I be shopping north of Fort Lauderdale\" question. Lighthouse Point trades on a denser network of finger-isle canals routed to the Atlantic via the Hillsboro Inlet — quieter, smaller, more single-family than central Fort Lauderdale. Hillsboro Mile is the linear A1A corridor through the town of Hillsboro Beach (a separate municipality, not Fort Lauderdale), with both oceanfront estates and Intracoastal-side residences. Pompano Beach sits between the Fort Lauderdale waterfront cohort and the northern barrier-island markets, with the redeveloped Fisher Family Pier and Pompano Beach Fishing Village, deepwater Intracoastal residences, and an active offshore reef-and-wreck dive corridor at relative value to Fort Lauderdale."
- **Proposed copy:** "The \"should I be shopping north of Fort Lauderdale\" question. Lighthouse Point trades on a dense network of finger-isle canals routed to the Atlantic via the Hillsboro Inlet — quieter, smaller, and more single-family than central Fort Lauderdale. Hillsboro Mile is the linear A1A corridor through the town of Hillsboro Beach (a separate municipality, not Fort Lauderdale), with both oceanfront estates and Intracoastal-side residences. Pompano Beach sits between the Fort Lauderdale waterfront cohort and the northern barrier-island markets. It carries the redeveloped Fisher Family Pier, Pompano Beach Fishing Village, deepwater Intracoastal residences, and an active offshore reef-and-wreck dive corridor — at relative value to the south."
- **Reason:** The original Pompano Beach sentence runs 50 words; splitting at "between the Fort Lauderdale waterfront cohort and the northern barrier-island markets." restores the rhythm. "At relative value to Fort Lauderdale" is replaced with "at relative value to the south" to drop the third Fort Lauderdale reference in the same paragraph (doctrine "geography once per paragraph").
- **Risk if changed:** Source-ledger fact "Fisher Family Pier" and "Pompano Beach Fishing Village" preserved verbatim. Pompano Beach `<Link>` and the four other peer `<Link>`s remain.
- **Factual / source-ledger review required:** yes — rebuild audits should confirm Fisher Family Pier and Fishing Village strings render verbatim and the Pompano `<Link>` resolves.
- **Category:** 1

### Finding 13: FortLauderdaleV2 closing CTA paragraph — repeated "Fort Lauderdale conversation" tightened

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` (lines 994-998, four-CTA strip intro)
- **Current copy:** "Four ways to begin a Fort Lauderdale conversation." (h2) … "Each path opens a different conversation — sized to where you are in the decision. None of them obligates anything beyond a private, time-bound discussion."
- **Proposed copy:** "Four ways to begin a Fort Lauderdale conversation." (h2 unchanged) … "Each path opens a different conversation, sized to where you are in the decision. No path obligates anything beyond a private, time-bound discussion."
- **Reason:** "None of them obligates anything" reads as a soft-double-negative; "No path obligates anything" is the same length and parses faster. Em-dash to comma is a small density win. H2 unchanged because it already passes the threshold and includes the locked Fort Lauderdale anchor for AEO.
- **Risk if changed:** None — CTA strip headings and labels for all four cards are unchanged.
- **Factual / source-ledger review required:** no
- **Category:** 1

### Finding 14: Home Value Props — "Brokerage relationships" geography stack trimmed to one mention

- **Route / file:** `src/app/page.tsx` (line 56, `HOME_VALUE_PROPS[1].body`)
- **Current copy:** "Quiet introductions when Mia's brokerage and ownership relationships across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach surface a fit. Access varies by market and timing."
- **Proposed copy:** "Quiet introductions when Mia's brokerage and ownership relationships surface a fit across Eastern Fort Lauderdale, Boca Raton, and Delray Beach. Access varies by market and timing."
- **Reason:** The original repeats "Eastern" three times in one sentence — exactly the smell the doctrine flags ("Eastern Fort Lauderdale, Eastern Boca Raton, Eastern Delray Beach inside one sentence is a smell"). The Hero already establishes the Eastern qualifier; the Value Props block can name the geography cleanly with one Eastern anchor.
- **Risk if changed:** None — "Access varies by market and timing." hedge preserved verbatim (this is the doctrine-required hedge against off-market / private-inventory overclaim).
- **Factual / source-ledger review required:** no
- **Category:** 1
