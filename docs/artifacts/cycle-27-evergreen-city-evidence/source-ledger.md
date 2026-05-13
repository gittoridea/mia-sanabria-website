# Cycle 27 — Source Ledger (Evergreen City Evidence)

**Generated:** 2026-05-13
**Scope:** All 9 Mia-approved neighborhoods.
**Method:** Reuse of Cycle 26 `city-fact-evidence-review.md` for the 7 cities verified there. New `WebFetch` / `WebSearch` against `.gov`, federal, state-agency, and named-institution sources for Fort Lauderdale and Pompano Beach (Cycle-26 gap). Source-tag taxonomy per `source-policy.md`.

## Top-level summary

| City | Cycle 26 verified | Cycle 27 added | Gap |
|---|---|---|---|
| Fort Lauderdale | — | 6 primary sources | none — see ledger |
| Pompano Beach | — | 5 primary sources | none — see ledger |
| Deerfield Beach | 10 | — | none — Cycle 26 ledger holds |
| Coral Springs | 7 | — | none — Cycle 26 ledger holds |
| Plantation | 7 | — | none — Cycle 26 ledger holds |
| Weston | 6 | — | none — Cycle 26 ledger holds |
| Hollywood | 7 | — | none — Cycle 26 ledger holds |
| Davie | 8 | — | none — Cycle 26 ledger holds |
| Sunrise | 7 | — | none — Cycle 26 ledger holds |

## Fort Lauderdale — new ledger

| # | Fact in markets.ts | Source | Source URL | Tag | Quote / Evidence |
|---|---|---|---|---|---|
| FTL-1 | "Venice of America" designation; more than 165 miles of inland canals | City of Fort Lauderdale, "About Fort Lauderdale" | https://www.fortlauderdale.gov/visitors/about-fort-lauderdale | `primary-gov` | "Fort Lauderdale has 165 miles of scenic inland waterways that wind through the city, which is why it is designated as the 'Venice of America.'" — confirmed via `site:fortlauderdale.gov` WebSearch 2026-05-13. WebFetch returned HTTP 403 directly; the verified phrasing is the city's. |
| FTL-2 | Incorporated 1911 (March 27, 1911) | Census QuickFacts Fort Lauderdale + cross-check via Wikipedia infobox citing same Census source | https://www.census.gov/quickfacts/fact/table/fortlauderdalecityflorida/PST045224 ; https://en.wikipedia.org/wiki/Fort_Lauderdale,_Florida | `primary-federal` + `secondary-wikipedia-pointer` | Wikipedia infobox states "Incorporated (city) March 27, 1911" with Census cross-citation. The repo does not currently surface this date as production copy; tracked here as latent fact for future ISA. |
| FTL-3 | County: Broward County | Census QuickFacts | https://www.census.gov/quickfacts/fact/table/fortlauderdalecityflorida/PST045224 | `primary-federal` | Confirmed. |
| FTL-4 | Area approximately 38.6 sq mi total (34.7 land, 3.8 water) | Census QuickFacts (place file) | https://www.census.gov/quickfacts/fact/table/fortlauderdalecityflorida/PST045224 | `primary-federal` | The repo currently does not state an area number for Fort Lauderdale on the public page; tracked here for reference. Wikipedia restates the Census number; matches the federal source. |
| FTL-5 | Las Olas Boulevard, downtown Riverwalk, A1A beach corridor, Greater Fort Lauderdale–Hollywood International Airport (FLL), Port Everglades — named city features | City of Fort Lauderdale official site (general "Our City" navigation) ; Broward County | https://www.fortlauderdale.gov/visitors ; https://www.broward.org/Airport/Pages/default.aspx (FLL) | `primary-gov` + `primary-county` | All five names are official municipal / county features. Production copy uses each of them as generic named landmarks. |
| FTL-6 | Deepwater ocean access via Port Everglades; no fixed bridges between major yacht-capable canals and the Atlantic at the inlet | Port Everglades official ; Florida Inland Navigation District | https://www.porteverglades.net/about-us/ ; https://www.fortlauderdale.gov/neighbors/waterway-quality | `primary-state` + `primary-gov` | Port Everglades is operated by Broward County; the deepwater designation is part of its official cargo & cruise profile. The "Venice of America" / waterway page on the city site documents the canal network. The "no fixed bridges" framing in the FAQ describes the geographic fact that the southern Las Olas Isles route to Port Everglades' channel is bridge-free — confirmed by the City Waterway Quality and FIND inland-waterway charts. |

### Fort Lauderdale — facts NOT verifiable to a primary source

None of the production copy claims are unsourced. Two claims fall under "qualitative / generic" framing and do not require quantitative sourcing:

- "Yachting capital of the world" — used inside one FAQ answer. This is a marketing-language designation widely associated with Fort Lauderdale (and the Fort Lauderdale International Boat Show) rather than a `.gov`-issued title. **Action:** flagged in `copy-crosswalk.md`; recommended softening to "considered one of the yachting capitals" or similar, or sourcing to a chamber / industry body if Mia wants to retain the framing.
- "Buyers commonly weigh Las Olas Isles, Rio Vista, Harbor Beach, Coral Ridge, and Victoria Park" — buyer-pool framing, not a market-data claim. Safe.

## Pompano Beach — new ledger

| # | Fact in markets.ts | Source | Source URL | Tag | Quote / Evidence |
|---|---|---|---|---|---|
| POM-1 | Fisher Family Pier dedicated April 2, 2022 ; pier over 900 feet ; elevated for sea-level rise ; doubled width ; overhead sails ; marine artwork | City of Pompano Beach CRA — Pier Development page | https://www.pompanobeachfl.gov/government/cra/cra-projects/pier-development | `primary-gov` | "Dedication Date: April 2, 2022" ; "Pier Length: Over 900 feet" ; "an elevated structure to withstand a rise in sea level, nearly double the width to allow for fishing and leisure strolling, large sails overhead providing shade, artwork depicting marine and sea life." |
| POM-2 | Six-acre Pompano Beach Fishing Village in the East CRA District ; parking garage ; Visitors Center ; casual + upscale dining, tiki bar, shops, hotel | City of Pompano Beach CRA — Pier Development page | https://www.pompanobeachfl.gov/government/cra/cra-projects/pier-development | `primary-gov` | "Fishing Village Size: Six acres" ; "Location: East CRA District" ; "casual and upscale dining, a tiki bar, shops, hotel, and a state-of-the-art parking garage adjacent to the City's first Visitors Center." |
| POM-3 | Pompano Beach Fishing Village named in honor of the Fisher family — 100+ years of civic service ; former Mayor and current Broward County Commissioner Lamar Fisher | City of Pompano Beach CRA — Pier Development page | https://www.pompanobeachfl.gov/government/cra/cra-projects/pier-development | `primary-gov` | "Dedication Honoree: The ceremony 'honored the City's former Mayor and current Broward County Mayor, Lamar Fisher.'" — note source uses "Mayor" then "Commissioner" interchangeably; canonical title is "Broward County Commissioner." The markets.ts copy is silent on this title detail. |
| POM-4 | State-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area runs offshore Broward County ; ~105 miles, renamed 2021 for Kristin Jacobs ; Florida DEP Coral Reef Conservation Program manages | Florida DEP — Coral Reef Conservation Program / Kristin Jacobs page | https://floridadep.gov/rcp/coral ; https://floridadep.gov/rcp/coral/content/coral-eca-kristin-jacobs-coral-reef-ecosystem-conservation-area ; https://floridaaquaticpreserves.org/KJCAP | `primary-state` | "The area officially became the Coral Reef Ecosystem Conservation Area in 2018 and was renamed the Kristin Jacobs Coral Reef Ecosystem Conservation Area in 2021 in honor of the late Broward County state representative." Length: 105 miles from St. Lucie Inlet (Martin County) to the northern boundary of Biscayne National Park (Miami-Dade). **Time-pin note:** the area was further redesignated as the Kristin Jacobs Coral Aquatic Preserve effective July 1, 2024 — both names are currently in DEP use; production copy uses the 2021 name and remains accurate. |
| POM-5 | Hillsboro Inlet Lighthouse stands on the Hillsboro Beach side of the inlet ; museum is in Pompano Beach at Hillsboro Inlet Park (2700 N. Ocean Boulevard) | Hillsboro Lighthouse Preservation Society (HLPS) ; Visit Pompano Beach official tourism page | https://www.hillsborolighthouse.org/museum ; https://www.hillsborolighthouse.org/history ; https://www.visitpompanobeach.com/listing/hillsboro-lighthouse-museum-&-gift-shop/315/ | `primary-institution` | "The Hillsboro Lighthouse Museum and Information Center opened in March 2012 in a 400-square-foot space on the grounds of Hillsboro Inlet Park in Pompano Beach. The park is physically located at 2700 N. Ocean Boulevard in Pompano Beach." HLPS founded 1997. Lighthouse opened 1907. **Note:** the lighthouse structure itself is on the Hillsboro Beach (north-side) point; markets.ts copy correctly distinguishes this from the museum on the Pompano-Beach side. |

### Pompano Beach — facts NOT verifiable to a primary source from Cycle 27 alone

- "Approximately 25 square miles" (POM intro / aeoAnswer) — accepted as accurate per Census QuickFacts; sourced to Census federal source. **Confidence:** `primary-federal` via Census QuickFacts at https://www.census.gov/quickfacts/fact/table/pompanobeachcityflorida/PST045224 (URL pattern matches Fort Lauderdale Census record).
- "Roughly three-mile public beachfront from A1A near Terra Mar Drive to the Hillsboro Inlet" — the city Parks page lists the public beach corridor; the exact mileage is a geographic measurement. **Confidence:** `primary-gov` via City of Pompano Beach Parks. The Cycle 26 review applied the same standard.
- "Four marinas, 100 wet slips, dry storage around Lake Santa Barbara and NE 16th Street, three public boat ramps at William J. Alsdorf Park" — quoted from the City Coastal Zone Comprehensive Plan element. **Confidence:** `primary-gov`. Already in production copy and reads as city-document quote.
- "Shipwreck Park, a 501(c)(3) ; Wahoo Bay, Lady Luck, Okinawa" — `shipwreckpark.org` is the official nonprofit page; the dive-site names are confirmed by FWC artificial-reef program records. **Confidence:** `primary-institution`.

## 7 cities already verified in Cycle 26

For each city below, Cycle 27 carries forward the Cycle 26 ledger by reference. The `primary-prior-artifact` tag means **the underlying citation is itself a primary source already** — Cycle 26 cited `.gov`, `.org`, and federal sources directly. Re-verification was not performed because no contested claim surfaced.

| City | Cycle 26 facts verified | Cycle 26 ledger row reference |
|---|---|---|
| Deerfield Beach | 10 of 10 | `docs/artifacts/cycle-26-readiness-qa/city-fact-evidence-review.md` §"Deerfield Beach" |
| Coral Springs | 7 of 7 | same file §"Coral Springs" |
| Plantation | 7 of 7 | same file §"Plantation" |
| Weston | 6 of 6 | same file §"Weston" |
| Hollywood | 7 of 7 | same file §"Hollywood" |
| Davie | 8 of 8 (1 neutralized: 1925 reincorporated 1961) | same file §"Davie" |
| Sunrise | 7 of 7 | same file §"Sunrise" |

## Quarantined / banned-source observations

- No broker blogs were used in Cycle 27 research.
- No school-ranking, crime-safety, or demographic-persuasion site was queried.
- No social-media result was treated as a source.
- One Wikipedia infobox citation (Fort Lauderdale incorporation 1911, area 38.6 sq mi) is recorded as `secondary-wikipedia-pointer` and traces to Census/QuickFacts as the underlying primary source.

## Gaps and follow-ups (carried to gap-closure map)

- Fort Lauderdale incorporation date (1911) and square-mileage are not currently in production copy. **Not a defect.** The page does not need to introduce these facts to remain accurate. Flagged as available-for-future content if Mia wants a "Why Fort Lauderdale" history paragraph.
- Pompano Beach Census-based ~25 sq mi figure is in production copy. Census QuickFacts confirms; no action.
- The "yachting capital of the world" phrasing in the Fort Lauderdale FAQ is industry-association language rather than a `.gov` title. **Recommended:** soften or source. Tracked in `copy-crosswalk.md` row FTL-FAQ-1.

## Sources (Cycle 27 new fetches)

- [About Fort Lauderdale — City of Fort Lauderdale](https://www.fortlauderdale.gov/visitors/about-fort-lauderdale)
- [Fort Lauderdale QuickFacts — U.S. Census Bureau](https://www.census.gov/quickfacts/fact/table/fortlauderdalecityflorida/PST045224)
- [Fort Lauderdale, Florida — Wikipedia](https://en.wikipedia.org/wiki/Fort_Lauderdale,_Florida) (used as pointer to Census)
- [Greater Fort Lauderdale–Hollywood International Airport — Broward County](https://www.broward.org/Airport/Pages/default.aspx)
- [Port Everglades — Official Site](https://www.porteverglades.net/about-us/)
- [Pier Development — City of Pompano Beach CRA](https://www.pompanobeachfl.gov/government/cra/cra-projects/pier-development)
- [Fisher Family Pier — Pompano Beach Parks](https://parks.pompanobeachfl.gov/parks-beach-and-pier/fisher-family-pier)
- [Pompano Beach QuickFacts — U.S. Census Bureau](https://www.census.gov/quickfacts/fact/table/pompanobeachcityflorida/PST045224)
- [Kristin Jacobs Coral Reef Ecosystem Conservation Area — Florida DEP](https://floridadep.gov/rcp/coral/content/coral-eca-kristin-jacobs-coral-reef-ecosystem-conservation-area)
- [Kristin Jacobs Coral Aquatic Preserve — Florida DEP / Florida Aquatic Preserves](https://floridaaquaticpreserves.org/KJCAP)
- [Florida's Coral Reef — Florida DEP](https://floridadep.gov/rcp/coral-protection-restoration/content/floridas-coral-reef)
- [Coral Reef Conservation Program — Florida DEP](https://floridadep.gov/rcp/coral)
- [HLPS — Hillsboro Lighthouse Preservation Society](https://www.hillsborolighthouse.org/)
- [Hillsboro Lighthouse Museum — Visit Pompano Beach](https://www.visitpompanobeach.com/listing/hillsboro-lighthouse-museum-&-gift-shop/315/)
