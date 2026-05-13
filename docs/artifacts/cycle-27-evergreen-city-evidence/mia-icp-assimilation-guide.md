# Mia ICP Assimilation Guide

**Generated:** 2026-05-13
**Scope:** Editorial operating guide for future Claude sessions writing or editing Mia-facing copy. Not for publication. Production copy must additionally pass the audit chain in `package.json → audit:all` and the honesty-contract rules in `CLAUDE.md`.

## Approved positioning thesis (locked)

> **Mia helps Southeast Florida luxury homeowners, absentee owners, and qualified buyers make confident real estate decisions with discreet, local, concierge-level guidance.**

Source: `docs/mia-client-decision-record.md` "Positioning thesis (approved)" — Mia confirmed 2026-05-13.

## Primary audience order (locked)

1. **Luxury sellers** ($600k–$5M residences) — homepage and hub copy bias here.
2. **Waterfront / lifestyle buyers** — the deepwater, oceanfront, and lifestyle anchor cohort.
3. **Qualified South Florida buyers** — the broader SE FL buyer pool.
4. **Absentee luxury owners** — second-residence and remote owners.
5. **Expired-listing sellers** — secondary entry channel ; **never homepage-dominant**.
6. **Relocating buyers** — out-of-state inbound, decision-support framing.
7. **Investors** — case-by-case ; **never promote investor returns**.

The decision record (§"Audience priority") is the canonical source. Renters / first-time buyers are listed but marked "not homepage-dominant."

## Tone: local expert + approachable concierge

- **Local expert** means: cites the block, the canal, the corridor, the pier, the named landmark. Mia speaks the city's vocabulary.
- **Approachable concierge** means: warm, candid, no luxury affectation. Concierge as posture, not branding.
- Never mix in "white-glove," "bespoke," "high-net-worth," or "discreet luxury" — these are banned production phrases per `CLAUDE.md` honesty contracts.

## Price-band feel rules ($600k–$5M)

- The page reads as if pricing is real but private. No specific dollar bands on city pages. Pricing conversations happen privately by design.
- Do not pretend the upper end is $20M. Do not pretend the lower end is $300k.
- Comparisons across cities should be qualitative ("relative value," "different price profile") rather than dollar-precise.

## How to talk about waterfront / lifestyle without overclaiming luxury

- ✓ "Deepwater dockage along the Coral Ridge finger isles, with route to ocean via the Hillsboro Inlet."
- ✓ "Bridge clearance, water depth, dock length, and route to open water vary by lot."
- ✗ "Trophy waterfront residences for the most discerning buyer."
- ✗ "Iconic luxury yachting estates."
- The geographic-and-mechanical language ("dockage," "seawall," "bridge clearance," "route to inlet") reads as expertise. The adjectival luxury language ("trophy," "iconic," "discerning") reads as marketing puff.

## How to talk about absentee owners without sounding predatory

- ✓ "Owners away from the residence still need preparation, vendor coordination, and current-comp briefs — Mia's role is local execution."
- ✓ "Reserves, milestone-inspection status, and salt-air maintenance history matter for any oceanfront condominium."
- ✗ "Maximize your absentee return."
- ✗ "Convert your second home into income."
- Frame it as service, not extraction.

## How to talk about expired listings as secondary (not homepage-dominant)

- ✓ "Pompano's micro-market diversity means residences priced against the wrong cohort underperform. A reposition conversation begins with the right comparable cohort."
- ✓ "Two homes on the same canal trade differently when dockage specifics aren't priced in."
- ✗ "Did your home expire? Mia will sell it in 30 days."
- ✗ "Avoid expiring again — list with Mia."
- Reposition framing is *diagnostic*, not predatory. Do not feature on the homepage hero.

## How to talk about relocating buyers without steering

- ✓ "FLL connectivity, the working downtown, and beach proximity are the standard relocation-conversation anchors."
- ✓ "Buyers from out-of-state typically shortlist Weston for the residential cohesion and Everglades-edge geography."
- ✗ "Escape the New York winters."
- ✗ "Get out of California taxes."
- ✗ "Best place to raise a family in Florida." (Steering.)
- Tax language is a buyer's tax-attorney conversation, not Mia's.

## How to talk about investors without promising returns

- ✓ "Investor lens is partially viable in [city] but constrained by association rules / CRA timelines / equestrian zoning."
- ✓ "Due-diligence support: reserves, milestone-inspection status, rental rules, short-term-rental ordinance."
- ✗ "Investor returns of X%."
- ✗ "Cap-rate analysis available." (Unless Mia actually performs and warrants the analysis.)
- ✗ "Best investment market in Broward." (Ranking.)

## How to reference neighborhoods without school / safety / protected-class claims

- ✓ "Established residential character." ✓ "Mature canopy." ✓ "Tree-lined interior streets." ✓ "Master-planned community structure." ✓ "Walkable to Las Olas Boulevard." ✓ "Block-by-block character varies."
- ✗ "Best schools." ✗ "Good schools." ✗ "Top-rated schools." ✗ "Family-friendly." ✗ "Kid-friendly." ✗ "Safe." ✗ "Safest." ✗ "Crime-free." ✗ "Good for retirees." ✗ "Bachelor pad." ✗ "Quiet [demographic]." ✗ "Up-and-coming." ✗ "Diverse neighborhood." (The last reads neutral but is itself a steering vector when used as a marketing hook.)
- Geographic, civic-infrastructure, and architectural language reads as expertise. Demographic language reads as steering.

## Banned phrases (production)

(Re-stated from `CLAUDE.md` honesty contracts. Phase 9 enforces.)

- "luxury concierge"
- "white-glove"
- "bespoke"
- "high-net-worth"
- "off-market" (implies private MLS access Mia does not warrant)
- "since 2017" (years-licensed claim)
- "within two hours" (response-time claim)
- "as seen in" / "as seen on" (media claim without source)
- "best schools" / "good schools" / "top-rated schools"
- "safe neighborhood" / "safest"
- "family-friendly" / "kid-friendly"
- "bachelor pad" / "bachelorette"
- "#1 realtor" / "top realtor" / "best realtor"
- "guaranteed sale" / "guaranteed price"
- Spanish / bilingual / fluent (any non-English service claim)

## Preferred CTA vocabulary

- ✓ "Begin a Private Conversation"
- ✓ "Schedule a Conversation"
- ✓ "Request a Home Valuation"
- ✓ "Walk the Markets"
- ✓ "Search Listings" (only when the IDX/search section actually works — currently the inline scaffold links to the search anchor; Bridge runtime gate per `src/lib/bridge.ts`)
- ✗ "Get Your Free Home Value Now"
- ✗ "Instant Quote"
- ✗ "Talk to an Agent in 60 Seconds"
- ✗ "Find Your Dream Home"

## Sample paragraphs per city

The samples below illustrate the tone, not approved copy. Treat as drafts ; do not inject without Mia review. Each city has three samples: buyer-oriented, seller-oriented, concise search/CTA-oriented.

### Fort Lauderdale

- **Buyer:** "Fort Lauderdale offers a working downtown, the A1A beach corridor, and more than 165 miles of inland waterways — the City's official 'Venice of America' designation — in the same city. The first conversation usually narrows the brief: ocean-access dockage on the Las Olas Isles or Coral Ridge finger isles, in-town walkability in Victoria Park, or beach-corridor condominium living. Each is a different micro-market with different diligence."
- **Seller:** "Fort Lauderdale waterfront sellers benefit from positioning to one of three buyer pools — yachting, walkable in-town, beach corridor — rather than a generic luxury frame. Dockage, lot orientation, and renovation depth drive pricing more than headline market trends. The pre-list brief covers seawall and dock confirmation, comparable-sales narrowed to the right cohort, and staging tuned to the buyer profile most likely to pay the price the residence earns."
- **Search/CTA:** "Compare Fort Lauderdale's waterfront isles, in-town blocks, and beach corridor. Begin a private conversation."

### Pompano Beach

- **Buyer:** "Pompano Beach pairs a roughly three-mile public beachfront, the Fisher Family Pier (dedicated April 2022), and the six-acre East CRA Fishing Village with deepwater Intracoastal residences and an offshore reef-and-wreck dive corridor. Four briefs anchor the search: A1A-corridor condominium, Intracoastal-side single-family with private dockage, inland canal routed to the Hillsboro Inlet, or interior. The city trades at relative value to Fort Lauderdale and Boca Raton."
- **Seller:** "Pompano Beach sellers should position to the right corridor segment. A residence priced against the wrong cohort underperforms — the city's micro-markets diverge quickly across A1A and the canal boundaries. Pre-list preparation covers dock and seawall (waterfront), milestone-inspection and reserves (condominium), and a comparable-sales packet drawn from the same corridor segment."
- **Search/CTA:** "Pompano Beach by corridor: oceanfront condo, Intracoastal-side, inland canal, or interior. Walk the markets."

### Deerfield Beach

- **Buyer:** "Deerfield Beach is the Boca-adjacent Broward city, framed by Quiet Waters Park (430-acre Broward County Parks facility) inland and the Hillsboro Inlet at the southern edge. The Cove sits along the Intracoastal in northeastern Deerfield with canal-routed homes; oceanfront condominium owners trade differently again. Buyers usually narrow by the route to ocean and the architectural era."
- **Seller:** "Cove Intracoastal sellers benefit from positioning to the specific dock-and-route-to-inlet profile. Oceanfront condominium sellers benefit from documented reserves and milestone-inspection status. The pre-list brief separates the two markets — they are not one Deerfield comp set."
- **Search/CTA:** "Deerfield Beach: the Cove, the pier, oceanfront condo, or inland. Begin a private conversation."

### Coral Springs

- **Buyer:** "Coral Springs was chartered July 10, 1963 and master-planned by Coral Ridge Properties. The commercial spine runs along Sample Road and University Drive; the Coral Springs Sportsplex is a named city facility. Sub-neighborhood pricing diverges from a city average — the meaningful search is by the specific master-planned development."
- **Seller:** "Coral Springs sellers benefit from positioning to the specific master-planned sub-community, not a city-wide comp set. Mature canopy and master-plan covenants both matter."
- **Search/CTA:** "Coral Springs sub-neighborhood comparison. Walk the markets."

### Plantation

- **Buyer:** "Plantation is a central Broward city incorporated 1953, bordered by Sunrise to the north, Davie to the south, and Fort Lauderdale to the east. Major corridors include Broward Boulevard and University Drive. Civic anchors include Plantation Heritage Park (Broward Parks system) and Volunteer Park."
- **Seller:** "Plantation sellers benefit from leaning into the established-residential character — pre-1980s housing stock and mature landscaping are the differentiators against the master-planned western cities."
- **Search/CTA:** "Plantation by corridor and architectural era. Begin a private conversation."

### Weston

- **Buyer:** "Weston was incorporated September 3, 1996 and developed beginning in the 1980s by Arvida under the Weston master plan, with first homes completed in 1984 in Windmill Ranch and Country Isles. The city is bounded on the west by the Everglades Water Conservation Area. Named communities include Weston Hills, the Falls, Country Isles, Bonaventure, Savanna, and Windmill Ranch Estates."
- **Seller:** "Weston sellers benefit from positioning to the specific named sub-community — Weston Hills trades differently from the rest of Weston. The pre-list brief draws comps narrowly."
- **Search/CTA:** "Weston by named community. Walk the markets."

### Hollywood

- **Buyer:** "Hollywood (distinct from Los Angeles) is a south Broward coastal city, formally incorporated November 28, 1925 and founded by Joseph W. Young — whose home is on the National Register. The Hollywood Broadwalk is the city's signature public oceanfront pedestrian promenade; Young Circle anchors the downtown."
- **Seller:** "Hollywood Lakes and the Broadwalk-corridor condominium cohort trade differently from the inland blocks. Sellers benefit from positioning to the right cohort."
- **Search/CTA:** "Hollywood by corridor: Lakes, Broadwalk, or inland. Begin a private conversation."

### Davie

- **Buyer:** "Davie is a central Broward town first incorporated in 1925 and reincorporated in 1961, with continuous Tree City USA recognition since 1991. The Equestrian Trail network is maintained by the Town. The college corridor includes Nova Southeastern University, Broward College Central Campus, and FAU Davie. Major corridors include Griffin Road, Stirling Road, and Nova Drive."
- **Seller:** "Davie equestrian-zoned acreage trades on lot, barn, and trail access — distinct from the rest of Broward. Pre-list briefs benefit from documentation of the zoning and the trail-network proximity."
- **Search/CTA:** "Davie by zoning and corridor. Walk the markets."

### Sunrise

- **Buyer:** "Sunrise was incorporated in 1961, originally as Sunrise Golf Village. Sawgrass Mills (opened 1990, ~2.7M sq ft) and Amerant Bank Arena (formerly BB&T Center, renamed September 19, 2023 ; home of the NHL Florida Panthers) anchor the city's commercial and civic identity. Expressway access via the Sawgrass Expressway, Florida Turnpike, and I-595 is the city's daily-life shape."
- **Seller:** "Sunrise sellers benefit from leaning into the expressway-access and civic-anchor proximity that defines the city's profile."
- **Search/CTA:** "Sunrise: expressway-adjacent, arena-adjacent, or master-planned interior. Begin a private conversation."

## When in doubt

- Read this file alongside `docs/mia-client-decision-record.md` (single source of truth for Mia decisions).
- Run a candidate paragraph through the banned-phrase list above before saving.
- If a phrase feels right but you can't cite it, it's not yet right.
