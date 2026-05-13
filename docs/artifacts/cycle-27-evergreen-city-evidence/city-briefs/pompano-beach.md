# Pompano Beach — Evidence Brief

**Slug:** `pompano-beach` | **Cluster:** primary | **Status:** relative-value peer to Fort Lauderdale
**Source ledger rows:** POM-1 … POM-5 in `../source-ledger.md`

## City identity

Pompano Beach is a northeastern Broward city framed on the barrier island by Lauderdale-by-the-Sea (south) and Hillsboro Beach (north), with mainland borders shared with Lighthouse Point, Deerfield Beach, and Fort Lauderdale. It pairs a continuous Atlantic public beachfront and the rebuilt Fisher Family Pier (dedicated 2022) with deepwater Intracoastal residences, an active East / Northwest CRA redevelopment program, and the offshore Kristin Jacobs Coral Reef Ecosystem Conservation Area.

## Official evergreen facts

- **County:** Broward.
- **Area:** ~25 sq mi per Census QuickFacts.
- **Public beachfront:** roughly 3 miles, A1A near Terra Mar Drive north to the Hillsboro Inlet.
- **Fisher Family Pier:** dedicated April 2, 2022 ; over 900 feet long ; elevated for sea-level rise ; nearly double the original width ; overhead sails ; marine artwork ; named for the Fisher family (former Mayor and Broward County Commissioner Lamar Fisher).
- **Pompano Beach Fishing Village:** six acres, East CRA District ; parking garage adjacent to the City's first Visitors Center.
- **Active CRA districts:** East (downtown Atlantic Boulevard / pier corridor) and Northwest (Old Town / Civic Commons).
- **Hillsboro Inlet Lighthouse:** structure on the Hillsboro Beach side of the inlet (opened 1907) ; Hillsboro Lighthouse Museum & Information Center on the Pompano Beach side, at Hillsboro Inlet Park, 2700 N. Ocean Boulevard (opened March 2012, operated by the HLPS).
- **Offshore conservation:** Florida DEP-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area (2018 designation, 2021 rename) ; ~105 miles, St. Lucie Inlet (Martin County) to the northern boundary of Biscayne National Park (Miami-Dade) ; managed by the DEP Coral Reef Conservation Program ; *as of July 1, 2024, also designated the Kristin Jacobs Coral Aquatic Preserve*.
- **Boating infrastructure (City Coastal Zone Comprehensive Plan element):** four marinas with 100 wet slips ; dry storage around Lake Santa Barbara and NE 16th Street ; three public boat ramps at William J. Alsdorf Park.
- **Shipwreck Park:** 501(c)(3) artificial-reef + underwater-art program ; sites include Wahoo Bay, Lady Luck, Okinawa.

## Mia ICP relevance

| Audience | Why Pompano Beach is on the working set |
|---|---|
| Luxury sellers | Pompano is the relative-value alternative to Fort Lauderdale and Lighthouse Point — sellers who own the right block (oceanfront condominium, Intracoastal-side single-family, deepwater canal) need positioning to the right cohort, not a generic luxury pitch. |
| Waterfront / lifestyle buyers | The reef-and-wreck dive scene is the distinguishing lifestyle anchor. Beach access plus deepwater dockage plus reef diving is the buyer profile Mia can articulate. |
| Qualified SE FL buyers | "Boca Raton's quality with Fort Lauderdale's water access at a different price entry" is a real positioning — but only when the residence supports it. Mia's role is the honest fit conversation. |
| Absentee owners | Common pattern: oceanfront condominium owned as second residence. Reserves, milestone-inspection status, and salt-air maintenance history matter; Mia coordinates remotely. |
| Expired listings | Pompano's micro-market diversity (A1A / Intracoastal / canal / mainland / CRA-corridor) means residences priced against the wrong cohort underperform — the reposition opportunity here is *structural*, not just cosmetic. |
| Relocating buyers | Pompano is often the third comparison after Fort Lauderdale and Boca Raton. The CRA redevelopment narrative is real; do not pretend it is finished. |
| Investors | The investor lens is partially viable (oceanfront condo rental in association-allowed buildings, CRA-corridor reposition) but constrained. **Do not promote investor returns**; offer due-diligence support. |

## Local-expert framing Mia can credibly own

- "Four briefs, one city." Oceanfront condo / Intracoastal single-family / inland canal / interior — Mia narrates which is right for the client.
- "The corridor is moving." East CRA redevelopment is a buyer's friend or buyer's frustration depending on the block — Mia frames the timing honestly.
- "The reef matters." Buyers who dive, boat, or care about the offshore ecosystem can hear the Kristin Jacobs story from Mia without the marketing varnish.

## Safe language examples

- "Pompano Beach sits between Fort Lauderdale and Boca Raton and trades at relative value to both."
- "The Fisher Family Pier, dedicated April 2022, anchors the six-acre East CRA Fishing Village."
- "Offshore waters fall within the state-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area, managed by Florida DEP."
- "The Hillsboro Inlet Lighthouse stands on the Hillsboro Beach side of the inlet; the lighthouse museum is on the Pompano Beach side at Hillsboro Inlet Park."

## Unsafe language to avoid

- "Up-and-coming neighborhood." (Steering / value-judgment.)
- "Cheaper than Fort Lauderdale." (Imprecise; the relationship is corridor-dependent.)
- "The next Fort Lauderdale." (Trope.)
- "Top investment market in South Florida." (Investor-return claim.)
- "Best dive spot." (Ranking.)

## Facts currently used in `src/lib/markets.ts` (slug `pompano-beach`)

| Section | Claim | Status |
|---|---|---|
| `intro` / `tagline` / `highlights` | ~25 sq mi ; ~3-mile public beachfront ; Fisher Family Pier (April 2022) ; 6-acre Fishing Village ; East + Northwest CRA ; Kristin Jacobs Coral Reef ECA | ✓ all verified per POM-1 … POM-4 |
| `lifestyle` / `priceCharacter` | Beach + deepwater boating + reef diving + redevelopment ; A1A condo vs Intracoastal SF vs inland canal vs interior | ✓ qualitative — safe |
| `latitude` / `longitude` | 26.2378, -80.0998 | ✓ verified — Census/Wikipedia infobox |
| `localContext` | Mainland borders ; barrier-island framing ; Hillsboro Inlet Lighthouse split ; Coastal Zone element marinas / wet slips / dry storage / boat ramps | ✓ verified per POM-5 + City Coastal Zone element |
| `miaQuote` | not set | ✓ |
| `aeoAnswer` | Restates intro facts with named features | ✓ all verified |
| `propertyTypes` | Oceanfront / A1A condos ; Intracoastal SF ; inland canal ; mainland SF ; downtown Old Town | ✓ qualitative — safe |
| `buyerGuidance` / `sellerGuidance` | Four-corridor framing ; seawall, dock, bridge clearance, route to inlet ; milestone-inspection + reserves for condo | ✓ qualitative — safe |
| FAQ 1 — Geographic location | Boundaries ; ~25 sq mi ; separate municipality from Fort Lauderdale | ✓ verified |
| FAQ 2 — Pompano Beach Pier | April 2, 2022 dedication ; ~1,000 ft city description vs over-900 ft CRA description ; elevated, doubled width, overhead sails, marine artwork ; open 7 am–10 pm ; anchors 6-acre Fishing Village | ✓ verified per POM-1 / POM-2 ; the two length descriptions (~1,000 vs >900) are both city-sourced — the existing copy acknowledges the discrepancy honestly |
| FAQ 3 — Compare to Fort Lauderdale + Boca Raton | Fort Lauderdale = yachting / finger-isle / working downtown ; Boca = country-club / Mizner ; Pompano = between, relative value, reef | ✓ qualitative — safe |
| FAQ 4 — Boating market | 4 marinas / 100 wet slips / dry storage Lake Santa Barbara + NE 16th St / 3 boat ramps Alsdorf Park ; route via Hillsboro Inlet | ✓ verified per City Coastal Zone element |
| FAQ 5 — Coral reef and dive sites | Kristin Jacobs Coral Reef ECA ; ~105 mile coral reef tract ; renamed 2021 for Kristin Jacobs ; Florida DEP Coral Reef Conservation Program ; Shipwreck Park 501(c)(3) ; Wahoo Bay / Lady Luck / Okinawa | ✓ all verified per POM-4 |
| `comparisonContext` | Relative-value beach-and-boating peer ; Fort Lauderdale / Lighthouse Point / Hillsboro Mile / Boca Raton / Delray Beach comparison axes | ✓ qualitative — safe |

## Facts verified

All `markets.ts` claims for Pompano Beach trace to primary sources.

## Facts needing source upgrade

- FAQ 5 currently says "renamed in 2021 to honor the late State Representative Kristin Jacobs." DEP source confirms 2021 rename. Both "State Representative" and "Broward County Commissioner" are accurate titles for Kristin Jacobs at different points in her career — current copy is correct.
- **Optional update:** as of July 1, 2024, the area is also designated the Kristin Jacobs Coral Aquatic Preserve. The current copy uses the 2021 ECA name, which remains in DEP use and is accurate; no edit required, but a future cycle could mention the dual designation if Mia wants the more current frame.

## Facts needing Mia / local-expert confirmation

None.

## Facts to remove or neutralize

None.

## Suggested internal links (already present)

- Fort Lauderdale, Lighthouse Point, Hillsboro Mile, Boca Raton, Delray Beach — all in `internalLinks` array.
- Already complete given the comparison axes; no addition needed.

## Suggested search / filter implications

- A future search UI should distinguish A1A-corridor condo from Intracoastal-side SF from inland canal, because Pompano's four-corridor structure is the brief differentiator.
- A future content addition could surface the CRA redevelopment timeline as a buyer-context page (out of Cycle 27 scope).

## Suggested photo / visual direction

- Replacement for placeholder hero JPG: Fisher Family Pier from the south at golden hour, OR a wide Intracoastal residential shot with private dockage. Avoid: another beach-towel-and-umbrella stock shot.
- The Hillsboro Inlet Lighthouse is photogenic but is technically Hillsboro Beach side — using it as Pompano's hero would conflate the two municipalities.

## Source citations / ledger references

- POM-1 through POM-5 in `../source-ledger.md`.
- Anchor URLs: https://www.pompanobeachfl.gov/government/cra/cra-projects/pier-development ; https://parks.pompanobeachfl.gov/parks-beach-and-pier/fisher-family-pier ; https://floridadep.gov/rcp/coral ; https://www.hillsborolighthouse.org/ ; https://www.census.gov/quickfacts/fact/table/pompanobeachcityflorida/PST045224
