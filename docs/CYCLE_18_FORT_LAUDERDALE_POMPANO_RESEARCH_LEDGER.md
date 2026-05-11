# Cycle 18 — Fort Lauderdale + Pompano Beach Research Source Ledger

**Date:** 2026-05-10
**Compilers:** Ava (PerplexityResearcher subagent) + ClaudeResearcher subagent — parallel.
**Use:** Every research-backed claim that lands on the Fort Lauderdale market page or the new Pompano Beach market page in Cycle 18 must trace to a row in this ledger. Anything outside the ledger is operator copy or banned.

> **Bot-block caveat (Fort Lauderdale only).** All `fortlauderdale.gov` and `parks.fortlauderdale.gov` URLs return HTTP 403 to automated requests (AkamaiGHost). The URLs RESOLVE in a real browser. Where content was captured via Google's indexed verbatim snippets we mark `[MED]`. Where claims could only be paraphrased without verbatim text we mark `[LOW]` and avoid using them. **Operator follow-up:** open the four blocked municipal URLs in Interceptor and capture verbatim text for the highest-stakes claims (specifically the 165-mile waterway figure). Until that happens we hedge in copy.

---

## Part A — Fort Lauderdale Source Ledger

### Source A1 — Visit Lauderdale Fort Lauderdale city page
- **URL:** https://www.visitlauderdale.com/beaches-and-beyond/cities-towns/fort-lauderdale/
- **Authority:** Tourism (Visit Lauderdale = Broward County Convention & Visitors Bureau, quasi-public destination marketing organization)
- **Verification:** [HIGH] — directly fetched
- **Facts (verbatim):**
  - "Over 300 miles of navigable inland waterways"
  - "24 miles of coastline"
  - "3,000 hours of sunshine every year"
  - "Venice of America" (inspired by the Intracoastal Waterway)
  - "Yachting Capital of the World"
  - Fort Lauderdale International Boat Show is "the world's largest in-water boat show"
  - Broward Center for the Performing Arts "overlooks the New River and ranks among the top ten most-visited theaters in the world"
- **Suggested use:** Research-backed opening (positioning); FAQ ("Why Fort Lauderdale?"); identity framing
- **Risk:** LOW for nicknames + 24-mile coastline. MEDIUM for "300+ miles" if applied to city limits — that figure is destination-wide, not city-only (see Source A2).
- **Notes:** Tourism source — strong for nicknames, weaker for legal/geographic precision. "Yachting Capital" attribution triangulates with MIASF (Source A7).

### Source A2 — Visit Lauderdale Greater Fort Lauderdale / Broward County Fact Sheet
- **URL:** https://www.visitlauderdale.com/media/press-releases-and-resources/post/greater-fort-lauderdale-broward-county-fact-sheet/
- **Authority:** Tourism (official destination marketing fact sheet)
- **Verification:** [HIGH]
- **Facts (verbatim):**
  - "300+ miles of navigable inland waterways within Broward County"
  - "23 miles of Atlantic Ocean beach" (Broward-wide)
  - "148 marinas and 35 boat repair yards" (Broward-wide)
  - Broward County resident population: "almost 1.9 million"
  - Fort Lauderdale (city): "over 180,000" residents
  - Broward County: "1,197 square miles (766,016 acres)"
  - "31 municipalities" total in Broward
  - "69 miles of live coral reef in a three-tier natural reef system"
- **Suggested use:** Comparison framework (city-vs-region); due-diligence framework; FAQ
- **Risk:** LOW for Broward-scoped facts. **HIGH** if used to claim Fort Lauderdale (the city) has 300 miles of waterways.
- **Notes:** **Conflict-resolution source.** "300+ miles" is Broward; "165 miles within city" sits in Source A3 only.

### Source A3 — Visit Lauderdale Intracoastal / canal-cities article
- **URL:** https://www.visitlauderdale.com/beaches-and-beyond/waterways/canal-cities/
- **Authority:** Tourism (same DMO)
- **Verification:** [MED] — Google indexed snippet via WebSearch
- **Facts (paraphrased from snippet):**
  - "Nearly 300 miles of mostly navigable inland waterways carve through the Fort Lauderdale area"
  - "Fort Lauderdale offers 165 miles of scenic waterways, with direct access to the Atlantic Ocean and winds through beautiful residential neighborhoods."
- **Suggested use:** Research-backed opening — IF scope hedged correctly
- **Risk:** MEDIUM — closest source distinguishing city (165 mi) vs. area (300+ mi). Not pinned to a primary municipal engineering doc.
- **Notes:** No primary municipal source (City Engineering / Public Works) for the 165-mi city-specific number was retrievable in this research session. Use with hedge.

### Source A4 — Port Everglades "About Us"
- **URL:** https://www.porteverglades.net/about-us/
- **Authority:** Port (Broward County government enterprise fund)
- **Verification:** [HIGH]
- **Facts (verbatim):**
  - Located at "1850 Eller Drive, Fort Lauderdale, FL 33316"
  - "A self-supporting enterprise fund of Broward County government" — "does not rely on local tax dollars"
  - "One of the most diverse seaports in the United States"
  - "An economic powerhouse for Broward County"
  - "One of the busiest cruise ports in the world"
  - "South Florida's main seaport for receiving petroleum products including, gasoline and jet fuel"
  - "Foreign-Trade Zone No. 25"
  - Official dedication: February 22, 1928
- **Suggested use:** Due-diligence framework; FAQ on port-adjacency; comparison framework
- **Risk:** LOW
- **Notes:** Port Everglades is physically *within Fort Lauderdale city limits* but *operated by Broward County* — a useful distinction for serious buyers.

### Source A5 — Port Everglades Economic Impact
- **URL:** https://www.porteverglades.net/community/economic-impact/
- **Authority:** Port
- **Verification:** [HIGH]
- **Facts (verbatim):**
  - "Generates almost $28.1 billion worth of business activity annually"
  - "Supports 12,272 direct local jobs and 204,385 jobs statewide"
  - Source study: Martin Associates
  - Total state and local taxes: $1.118 billion
  - Personal income impact: ~$9.4 billion
- **Suggested use:** Due-diligence framework (regional economic stability); FAQ
- **Risk:** LOW
- **Notes:** Cruise-passenger / TEU figures from secondary search results NOT directly verified — do NOT cite.

### Source A6 — US Census Bureau QuickFacts: Fort Lauderdale city, FL
- **URL:** https://www.census.gov/quickfacts/fact/table/fortlauderdalecityflorida/PST045224
- **Authority:** Federal (US Census Bureau)
- **Verification:** [MED] — URL canonical and resolves; HTTP 403 to automated agents but publicly accessible via browser; cross-referenced via Census-aligned aggregators (florida-demographics, datausa.io, populationu) which all align
- **Facts (paraphrased — Census-aligned):**
  - 2020 decennial census population: 182,760
  - 2024 estimated population: 185,604
  - Total area: 38.6 sq mi (99.9 km²)
  - Land area: 34.7 sq mi (90.0 km²)
  - Water area: 3.8 sq mi (9.9 km²) — ~10% of city
- **Suggested use:** Fast-facts; due-diligence framing
- **Risk:** LOW for 2020 decennial. MEDIUM for 2024 estimate (label as "estimate").
- **Notes:** ~10% of city area is water — strong waterfront-living signal that is itself a verified primary fact.

### Source A7 — Marine Industries Association of South Florida (MIASF) "About"
- **URL:** https://www.miasf.org/about/
- **Authority:** Industry trade association — largest marine trade body in Southeast US, FtLaud-headquartered, owner of FLIBS
- **Verification:** [HIGH]
- **Facts (verbatim):**
  - "142,000 regional marine jobs" (Broward, Miami-Dade, Palm Beach)
  - "Annual economic output of $18.5 billion"
  - "More than 500 members"
  - Owner of "the Fort Lauderdale International Boat Show (FLIBS)"
  - Headquarters: 221 SW Third Ave, Fort Lauderdale, FL 33312
  - Founded: 1961
- **Suggested use:** Research-backed opening (marine industry depth)
- **Risk:** MEDIUM if applied as Fort-Lauderdale-only — these are 3-county figures. Always hedge "across the South Florida marine industry."

### Source A8 — City of Fort Lauderdale "About Fort Lauderdale" (operator-provided)
- **URL:** https://www.fortlauderdale.gov/visitors/about-fort-lauderdale
- **Authority:** Municipal
- **Verification:** [LOW] — bot-blocked
- **Facts:** UNVERIFIED — operator should browser-confirm before citation.
- **Suggested use:** Reserve for post-Interceptor verification.
- **Risk:** HIGH if cited without verification.

### Source A9 — City of Fort Lauderdale "Neighbors / Our City" (operator-provided)
- **URL:** https://www.fortlauderdale.gov/neighbors
- **Authority:** Municipal
- **Verification:** [LOW] — bot-blocked
- **Facts:** UNVERIFIED.
- **Risk:** HIGH if cited without verification.

### Source A10 — City of Fort Lauderdale Parks Marinas program (operator-provided)
- **URL:** https://www.parks.fortlauderdale.gov/programs/marinas/
- **Authority:** Municipal (Parks & Recreation)
- **Verification:** [MED] — Google index
- **Facts (paraphrased from snippet):**
  - Cooley's Landing Marine Facility "is dedicated to the memory of William Cooley, one of Fort Lauderdale's founding settlers" and "is situated next to the recently completed arts and science district"
- **Suggested use:** Comparison framework (public vs. private marinas); FAQ
- **Risk:** MEDIUM for facility-existence; HIGH for slip counts / "no fixed bridges" (do NOT make this claim for Cooley's Landing).
- **Notes:** Las Olas Marina (Suntex 50-year lease, ~88 slips) is a separate Suntex-operated facility, NOT the same as the city Parks marina program. Do not conflate.

### Source A11 — City of Fort Lauderdale LauderGO Water Trolley (operator-provided)
- **URL:** https://www.fortlauderdale.gov/government/departments-i-z/transportation-and-mobility/transportation-division/laudergo-mobility-services/laudergo-water-trolley
- **Authority:** Municipal (Transportation & Mobility)
- **Verification:** [HIGH] — verbatim multi-paragraph copy returned via Google indexed snippet; Wayback Jan-2026 snapshot confirms
- **Facts (verbatim from indexed snippet):**
  - Operated "by the City of Fort Lauderdale, in partnership with Water Taxi of Fort Lauderdale and Riverwalk Fort Lauderdale"
  - "City of Fort Lauderdale residents and visitors can enjoy the scenic route and access destinations along the New River for FREE"
  - "Operates daily, from 10 a.m. – 10 p.m."
  - "Stops at each of the eight locations every 20 to 30 minutes"
  - North-side stops: Esplanade Park, Riverfront Plaza, Huizenga Plaza, Riverwalk Laura Ward Park
  - South-side stops: Smoker Park, Downtowner Saloon, New River Yacht Club, Tarpon River
  - Contact: 954-828-8000 / transportation@fortlauderdale.gov
- **Suggested use:** Lifestyle FAQ ("free public mobility on the New River"); proof-of-investment in waterfront mobility
- **Risk:** LOW

### Source A12 — New River geographic specs (composite)
- **URL:** No single primary municipal URL. USGS gauge USGS-02286140 (https://waterdata.usgs.gov/monitoring-location/USGS-02286140/) confirms USGS monitors the New River at Fort Lauderdale.
- **Authority:** Mixed federal (USGS) / secondary
- **Verification:** [MED]
- **Facts (paraphrased):**
  - New River is approximately 3 miles long through downtown Fort Lauderdale
  - Tidal estuary connecting Intracoastal and the Atlantic via the Port Everglades cut
  - Channel maintained by US Army Corps of Engineers
  - Composed from the junction of three main canals originating in the Everglades
- **Suggested use:** Research-backed opening; due-diligence (navigability)
- **Risk:** MEDIUM — hedge "approximately." **Do NOT claim "no fixed bridges"** for the New River — multiple drawbridges cross it (Davie Blvd, Andrews Ave, FEC Railroad, etc.). The "no fixed bridges" claim is appropriate ONLY for specific marinas south of the bridges with direct ocean access via Port Everglades inlet.

---

## Part B — Pompano Beach Source Ledger

### Source B1 — City of Pompano Beach (homepage)
- **URL:** https://www.pompanobeachfl.gov/
- **Authority:** Municipal (City government, primary)
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - Three-mile stretch of waterfront
  - Named after the pompano (inshore tropical game fish)
  - "All America City Winner"
  - City Hall: 100 West Atlantic Blvd., Pompano Beach, FL 33060
- **Suggested use:** Research-backed opening; etymology sidebar
- **Risk:** LOW
- **Notes:** "Florida's Warmest Welcome" / "Gold Coast" are city marketing labels — quote as city positioning, not independent fact. Three-mile shoreline pairs with Source B9 (3-mile beachfront from A1A/Terra Mar Drive to Hillsboro Inlet).

### Source B2 — Pompano Beach Residents page
- **URL:** https://www.pompanobeachfl.gov/residents
- **Authority:** Municipal
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - City "spans over 25 square miles in northern Broward County"
  - "Located between Miami and Palm Beach"
  - Features a "1,000-foot-long fishing pier"
  - Beaches, boating facilities, marinas, and "offshore coral reef dive sites"
  - Free Pompano Circuit shuttle
  - Provides utilities, parks, and housing services
- **Suggested use:** Geographic positioning; lifestyle bullets; waterfront character
- **Risk:** LOW
- **Notes:** Pier-length conflict — see Source B4 ("over 900 feet"). Hedge as "approximately 1,000 feet" or "more than 900 feet" — do NOT pick the higher number for marketing.

### Source B3 — Pompano Beach Parks (Beach page)
- **URL:** https://parks.pompanobeachfl.gov/beach
- **Authority:** Municipal (Parks & Recreation)
- **Verification:** [HIGH]
- **Facts (verbatim/paraphrased):**
  - Beach is "open 365 days annually"
  - Guarded swimming "9 a.m.–4:45 p.m., 7 days/week"
  - Fisher Family Pier "operates daily 7 a.m.–10 p.m."
  - Amenities: restroom facilities, showers, picnic shelter and tables, barbecue grills, children's playground
  - Pier Parking Garage, Water Taxi service, Free Circuit Shuttle, beach wheelchairs
  - Current renourishment project placing "approximately 23,000 tons of approved sand"
- **Suggested use:** Lifestyle/amenity bullets; FAQ ("public beach access?"); accessibility note
- **Risk:** LOW
- **Notes:** Renourishment scope is operational/transient — use cautiously, may stale.

### Source B4 — CRA Pier Development page
- **URL:** https://www.pompanobeachfl.gov/government/cra/cra-projects/pier-development
- **Authority:** Municipal (CRA)
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - The Pompano Beach Fishing Village is a "transformed and walkable, six-acre beachfront destination" in the East CRA District
  - Planning began 2010; master developer agreement 2013; groundbreaking January 27, 2017; renovated Pier dedicated April 2, 2022
  - Fisher Family Pier "spans over 900 feet" — elevated for sea-level resilience, doubled width, with overhead sails and marine artwork
  - Tenants have included Beach House Pompano, Oceanic Pompano, Lucky Fish Pompano, BurgerFi, Kilwins, Cannoli Kitchen, Baresco, How You Brewin Coffee Company, Alvin's Island
  - Hotel anchors: Hilton Tru / Home2 Suites
  - On-site: Pier Parking Garage, Visitors Center
- **Suggested use:** Cultural anchor section; redevelopment-energy framing; comparison framework
- **Risk:** LOW for structural facts (acreage, dates, amenities). MEDIUM if listing tenant names — verify each before publishing (restaurant turnover is high).

### Source B5 — CRA Overview page
- **URL:** https://www.pompanobeachfl.gov/government/cra
- **Authority:** Municipal (CRA)
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - Two redevelopment districts: East and Northwest
  - CRA aims to "attract private investment to the city" via public/private partnerships
  - Downtown Atlantic Boulevard / Dixie Highway corridor improvements + oceanfront development are core themes
- **Suggested use:** "Why Pompano now" framing
- **Risk:** LOW
- **Notes:** Do NOT extrapolate dollar figures or growth claims from this page.

### Source B6 — CRA Projects (project inventory)
- **URL:** https://www.pompanobeachfl.gov/government/cra/cra-projects
- **Authority:** Municipal (CRA)
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - East District projects: Pompano Beach Fishing Village (past), Pier Streetscape, Atlantic Boulevard Bridge Improvements (completed Summer 2019), Pier Parking Garage (completed June 2016), McNab House and Botanical Gardens (current)
  - Northwest District: Downtown Pompano (current), Old Town entertainment district (current), Civic Commons (current — cultural center, library, city hall complex)
  - Past projects: Annie Adderly Gillis Park, Collier City, Community Garden, Old Town's Backyard
- **Suggested use:** "Pipeline of completed and active redevelopment"
- **Risk:** LOW for project names; MEDIUM if asserting timelines.

### Source B7 — Pompano Beach Comprehensive Plan, Coastal Zone element (PDF)
- **URL:** https://cdn.pompanobeachfl.gov/city/pages/planning_zoning/Coastal%20Zone.pdf
- **Authority:** Municipal (Planning & Zoning, Comprehensive Plan)
- **Verification:** [HIGH]
- **Facts (paraphrased from PDF index):**
  - "Four marinas providing a total of 100 wet slips in the study area"
  - Dry storage "in the Lake Santa Barbara area (300 spaces) or along Northeast 16th Street (210 spaces)"
  - "Fish City Marina is the home of a fishing and dive boat charter fleet"
  - "Most concentrated area of commercial activity is along Northeast 16th Street"
  - "Three (3) public boat ramps are provided at William J. Alsdorf Park"
  - City "owns and operates a 7.5 mgd reuse water treatment and distribution system"
- **Suggested use:** Boating/marina infrastructure section; FAQ on boat access
- **Risk:** MEDIUM — hedge with "per the City's Coastal Zone element of the Comprehensive Plan" and avoid stating these as live counts.
- **Notes:** "Study area" framing means this is a defined planning sub-area, not the entire city. Frame as "within the City's coastal zone planning area."

### Source B8 — US Census QuickFacts: Pompano Beach city, FL
- **URL:** https://www.census.gov/quickfacts/fact/table/pompanobeachcityflorida/PST045224
- **Authority:** Federal (US Census)
- **Verification:** [MED] — direct page returns 403 to automation; cross-referenced via Census-aligned aggregators
- **Facts (paraphrased):**
  - 2020 decennial census population: 112,046
  - 2024 estimated population: 118,104
  - Total area: 25.4 sq mi (24.0 land / 1.4 water)
- **Suggested use:** Fast-facts; comparison framework
- **Risk:** MEDIUM — label 2024 as estimate, not count.

### Source B9 — Geographic position (City open-data + Broward GeoHub)
- **URL:** https://data.pompanobeachfl.gov/dataset/broward-county-cities (Broward GeoHub layer, hosted by city)
- **Authority:** Municipal open-data / Broward County GIS
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - Pompano Beach is in **northeastern Broward County** along the Atlantic Ocean
  - Barrier-island portion bordered by **Lauderdale-by-the-Sea (south)** and **Hillsboro Beach (north)**
  - Mainland neighbors: **Lighthouse Point, Deerfield Beach, Fort Lauderdale**
  - Municipal beachfront extends approximately **3 miles** from State Road A1A at Terra Mar Drive to the Hillsboro Inlet
- **Suggested use:** Geographic-position opening; comparison framework
- **Risk:** LOW for directional facts; MEDIUM for the 3-mile measurement (city homepage = "three-mile stretch").
- **Notes:** **Do NOT claim Pompano Beach is "next to Fort Lauderdale" without qualifying** — Lauderdale-by-the-Sea sits between them on the barrier island.

### Source B10 — Florida DEP Coral Reef Conservation Program
- **URL:** https://floridadep.gov/rcp/coral
- **Authority:** State (Florida Department of Environmental Protection)
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - Coral Reef Conservation Program manages reefs "from the St. Lucie Inlet to the northern border of Biscayne National Park"
  - Covers Miami-Dade, Broward, Palm Beach, and Martin counties (Broward includes Pompano Beach)
  - Florida's reef system extends "over 350 nautical miles"
  - Operated under FDEP's Office of Resilience and Coastal Protection
- **Suggested use:** Authoritative coral-reef framing
- **Risk:** LOW
- **Notes:** Frame as "offshore waters of Broward County, including Pompano Beach, fall within…" — Pompano Beach itself is not a separately-designated reef jurisdiction.

### Source B11 — Florida DEP Coral ECA / Kristin Jacobs Coral Reef Ecosystem Conservation Area
- **URL:** https://floridadep.gov/CoralReefs (and SEFCRI: https://southeastfloridareefs.net/)
- **Authority:** State (FDEP) / interagency
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - Coral ECA covers "approximately 105 miles" of Florida's Coral Reef from northern Biscayne National Park (Miami-Dade) to St. Lucie Inlet (Martin County)
  - Originally established by Florida Legislature 2018
  - **Renamed in 2021 as the Kristin Jacobs Coral Reef Ecosystem Conservation Area** to honor late State Rep. Kristin Jacobs of Broward
- **Suggested use:** Substantive lifestyle paragraph for diving/coastal nature; positions Pompano's offshore waters within a state-designated conservation area
- **Risk:** LOW
- **Notes:** Do NOT say "Pompano Beach is part of the Kristin Jacobs Coral Reef" — say "offshore waters off Pompano Beach fall within the state-designated Coral ECA."

### Source B12 — Shipwreck Park Pompano (nonprofit, city-funded)
- **URL:** https://shipwreckparkpompano.org/
- **Authority:** Non-profit (501(c)(3), Federal Tax ID 47-4500874), funded by City of Pompano Beach
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - Shipwreck Park is a 501(c)(3) nonprofit "dedicated to the creation of an underwater park system establishing artificial reefs, utilizing public art"
  - Active project sites include Wahoo Bay, Lady Luck, and Okinawa
  - Funded jointly by the City of Pompano Beach and Isle Casino Racing Pompano Park
- **Suggested use:** Dive lifestyle paragraph; differentiator vs. neighboring municipalities
- **Risk:** MEDIUM if quoting "18 wrecks" or "five-square-mile" — those came from secondary tourism/news, not the nonprofit's homepage.
- **Notes:** **"Wreck Capital of Florida" is tourism marketing**, NOT an official designation. Do NOT use as authoritative.

### Source B13 — Hillsboro Inlet Lighthouse (Hillsboro Lighthouse Preservation Society)
- **URL:** https://www.hillsborolighthouse.org/
- **Authority:** Non-profit preservation society
- **Verification:** [HIGH]
- **Facts (paraphrased):**
  - 137-foot iron-pile structure, operational by 1907
  - Listed on the U.S. National Register of Historic Places (Feb 16, 1979)
  - Located on the **north side of Hillsboro Inlet, in Hillsboro Beach** (NOT in Pompano Beach city limits)
  - Hillsboro Lighthouse Museum and Information Center opened March 2012 on the grounds of Hillsboro Inlet Park (Pompano Beach side of the inlet)
- **Suggested use:** Adjacency / cultural-landmark sidebar
- **Risk:** **HIGH if claimed as "Pompano Beach's lighthouse" — it is not.**
- **Notes:** Frame as "the historic Hillsboro Inlet Lighthouse, visible from Pompano Beach's northern shoreline" or "the lighthouse museum on the Pompano side of the inlet."

---

## Part C — Verified facts safe to paraphrase in copy

### Fort Lauderdale

| # | Canonical paraphrase | Source(s) | Risk |
|---|---|---|---|
| F1 | "Greater Fort Lauderdale features more than 300 miles of navigable inland waterways across Broward County, with approximately 165 miles within the city of Fort Lauderdale itself." | A2 [HIGH] + A3 [MED] | Low when both scopes named |
| F2 | "Fort Lauderdale is widely known as the 'Venice of America' for its inland waterways and as the 'Yachting Capital of the World' for its marine industry." | A1 + A7 [HIGH] | Use "widely known" not "officially designated" |
| F3 | "Port Everglades, located within Fort Lauderdale city limits at 1850 Eller Drive, is operated as a self-supporting enterprise fund of Broward County government and does not rely on local tax dollars. It is one of the busiest cruise ports in the world and South Florida's main seaport for petroleum products including gasoline and jet fuel." | A4 [HIGH] | Low |
| F4 | "The New River runs approximately three miles through downtown Fort Lauderdale, connecting to the Intracoastal Waterway and the Atlantic Ocean via the Port Everglades inlet." | A12 [MED] | Use "approximately." DO NOT claim "no fixed bridges." |
| F5 | "Greater Fort Lauderdale's coastline stretches for 24 miles along the Atlantic, with 23 miles of public Atlantic Ocean beach across Broward County." | A1 + A2 [HIGH] | Tourism source; use scope explicit |
| F6 | "South Florida's marine industry — anchored by Fort Lauderdale and the Marine Industries Association of South Florida — generates approximately $18.5 billion in regional economic output and supports 142,000 jobs across Broward, Miami-Dade, and Palm Beach counties." | A7 [HIGH] | Always specify "regional / South Florida" |
| F7 | "The Intracoastal Waterway runs north–south through Fort Lauderdale, providing sheltered passage between the Atlantic Ocean and the city's residential canal network and giving direct ocean access via the Port Everglades inlet." | Composite A1 + A4 [HIGH for role] | Avoid mileage figures within city |
| F8 | "Broward County is home to 148 marinas and 35 boat repair yards. Fort Lauderdale operates public marina facilities including Cooley's Landing on the New River." | A2 [HIGH] + A10 [MED] | County-wide for 148; do NOT state slip counts |
| F9 | "Fort Lauderdale had a population of 182,760 at the 2020 U.S. Census, with a 2024 estimated population of approximately 185,604. The city covers 38.6 square miles in total — of which 34.7 square miles is land and 3.8 square miles (approximately 10%) is water — a structural reflection of its waterfront character." | A6 [MED] | Label 2024 as "estimate" |
| F10 | "The City of Fort Lauderdale operates the LauderGO! Water Trolley, a free public water shuttle along the New River with eight stops, running daily from 10 a.m. to 10 p.m. in partnership with Water Taxi of Fort Lauderdale and Riverwalk Fort Lauderdale." | A11 [HIGH] | Low |
| F11 | "Fort Lauderdale's geography combines an Atlantic beachfront with the north–south Intracoastal Waterway and an inland canal network spanning approximately 165 miles within city limits. Approximately 10% of the city's total area is water (3.8 of 38.6 square miles), and the city's residential 'finger isles' along the Intracoastal provide direct deep-water access for waterfront homeowners." | A3 [MED] + A6 [HIGH water-area %] | Use "approximately" and "finger isles" as descriptive |

### Pompano Beach

| # | Canonical paraphrase | Source(s) | Risk |
|---|---|---|---|
| P1 | "Pompano Beach is in northeastern Broward County, between Lauderdale-by-the-Sea (south) and Hillsboro Beach (north) on the barrier island, with mainland borders shared with Lighthouse Point, Deerfield Beach, and Fort Lauderdale." | B9 [HIGH] | Low |
| P2 | "The City of Pompano Beach spans approximately 25 square miles in northern Broward County." | B2 + B8 [HIGH/MED] | Low |
| P3 | "Per US Census Bureau, Pompano Beach's 2020 decennial population was 112,046." | B8 [MED] | Low for decennial |
| P4 | "Per US Census Bureau estimates, Pompano Beach's 2024 population estimate was approximately 118,104." | B8 [MED] | Label as "estimate" |
| P5 | "The City describes a roughly three-mile stretch of public beachfront extending from State Road A1A near Terra Mar Drive to the Hillsboro Inlet." | B1 + B9 [HIGH] | Use "approximately" |
| P6 | "Public beach amenities include restrooms, showers, picnic shelters, barbecue grills, a children's playground, beach wheelchairs, and access via the Free Circuit Shuttle and Water Taxi." | B3 [HIGH] | Low |
| P7 | "The Fisher Family Pier — operating daily 7 a.m. to 10 p.m. — was rebuilt as part of the City's CRA Pier Development program, dedicated April 2, 2022, with elevated, doubled-width construction. The City's residents page describes the pier as approximately 1,000 feet long; the CRA Pier Development page describes the renovated structure as 'over 900 feet.'" | B2 + B4 [HIGH] | Conflict — see notes |
| P8 | "The Pompano Beach Fishing Village is a six-acre, walkable beachfront destination in the East CRA District anchored by the Pier, with restaurants, retail, hotel, parking garage, and the City's Visitors Center." | B4 [HIGH] | Low |
| P9 | "The City's Community Redevelopment Agency operates two redevelopment districts (East and Northwest), with active downtown projects including Downtown Pompano, Old Town entertainment district, and Civic Commons (cultural center, library, city hall complex)." | B5 + B6 [HIGH] | Low |
| P10 | "Per the City's Coastal Zone element of its Comprehensive Plan, the coastal study area includes four marinas with 100 wet slips, dry storage capacity around Lake Santa Barbara and NE 16th Street, and three public boat ramps at William J. Alsdorf Park." | B7 [HIGH] | Hedge as "per Comp Plan" |
| P11 | "Offshore waters of Broward County, including those off Pompano Beach, fall within the state-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area (Coral ECA), a roughly 105-mile coral reef tract managed by Florida DEP's Coral Reef Conservation Program (renamed in 2021 to honor the late State Rep. Kristin Jacobs)." | B10 + B11 [HIGH] | Low |
| P12 | "Pompano Beach hosts the Shipwreck Park artificial-reef and underwater-art initiative, a 501(c)(3) nonprofit funded by the City of Pompano Beach and Isle Casino Racing Pompano Park, operating sites including Wahoo Bay, Lady Luck, and Okinawa." | B12 [HIGH] | Low |
| P13 | "The historic Hillsboro Inlet Lighthouse — listed on the U.S. National Register of Historic Places in 1979 — stands on the north side of Hillsboro Inlet (in Hillsboro Beach), with its museum and information center on the Pompano Beach side of the inlet at Hillsboro Inlet Park." | B13 [HIGH] | Always qualify — lighthouse is in Hillsboro Beach, not Pompano Beach |

---

## Part D — Conflicts surfaced for operator decision

| # | Conflict | Resolution |
|---|---|---|
| C1 | 300 miles waterways vs. 165 miles | Different geographic scopes (county vs. city). Conservative copy: cite both with explicit scope. |
| C2 | 24 miles coastline vs. 23 miles beach | Both Visit Lauderdale, both regional. Use "24 miles coastline" for destination framing, "23 miles Atlantic Ocean beach" for public beach access. Do not aggregate. |
| C3 | City of Fort Lauderdale URLs (A8 / A9 / A10 / A11) | A11 captured verbatim via Google; A8 / A9 / A10 are unverified. Operator follow-up: open the four blocked URLs in Interceptor and capture verbatim text for the highest-stakes claims (165-mile waterway figure, official self-positioning) before the next cycle. |
| C4 | Fisher Family Pier length (Pompano) | Residents page = "1,000-foot-long" / CRA page = "over 900 feet". Surface both — write "approximately 1,000 feet (described as 'over 900 feet' on the City's CRA Pier Development page)" or pick one with the source explicit. |
| C5 | "Wreck Capital of Florida" (Pompano) | Tourism marketing — NOT an official designation. Do NOT use. |
| C6 | Hillsboro Inlet Lighthouse (Pompano-adjacent) | Lighthouse is in **Hillsboro Beach**, NOT Pompano Beach. Always qualify. |
| C7 | "Pompano Beach is luxury-only" | False — City materials describe a mixed economic profile. Do NOT claim. |
| C8 | "Pompano Beach is part of Fort Lauderdale" | False — separate municipality with own government and CRA. Do NOT claim. |

---

## Part E — Banned or unverified claims

The following must NOT appear in copy this cycle:

- "Pompano Beach is luxury-only"
- "Pompano Beach is in Fort Lauderdale" / "Eastern Fort Lauderdale neighborhood"
- "Hillsboro Mile is in Fort Lauderdale" / "Eastern Fort Lauderdale neighborhood"
- Specific dive-site counts in Pompano (e.g., "18 wrecks," "100+ wrecks") — appear in tourism only
- Median home price, luxury-tier rankings, school rankings — none verified
- "No fixed bridges" claim for the New River
- Las Olas Marina slip count — not directly verified at city URL
- Any assertion attributed to a `fortlauderdale.gov` URL until operator-verified in Interceptor
- The "Wreck Capital of Florida" tourism marketing label as authoritative
- The Hillsboro Inlet Lighthouse claimed as Pompano Beach's lighthouse

---

**End of ledger. All Cycle 18 page copy traces back to a row in Part C or is operator-voice without numeric/structural claim.**
