import type { MarketSlug } from "./mia";

export type MarketFaq = {
  readonly question: string;
  readonly answer: string;
};

export type MarketInternalLink = {
  readonly slug: MarketSlug;
  readonly label: string;
};

/**
 * Cycle 14 — Market cluster discriminator. Drives `/markets/` index partition
 * (Primary service markets vs Eastern Fort Lauderdale neighborhoods) and the
 * `[slug]/page.tsx` related-section heading. Replaces the hardcoded
 * `PRIMARY_SLUGS` / `NEIGHBORHOOD_SLUGS` / `easternBrowardSlugs` Sets.
 *
 * Cycle 18 — Added `"northern-broward-waterfront"` to honor the geographic
 * distinction that Hillsboro Mile (the A1A corridor through Hillsboro Beach)
 * is NOT in Fort Lauderdale and NOT a city/town the way the `"primary"`
 * cluster represents — but it sits naturally next to the Fort Lauderdale
 * waterfront cluster on the /markets/ index. Rendering side: section #2
 * groups `[neighborhood ∪ northern-broward-waterfront]` under a renamed
 * heading; geography is honored without claiming Hillsboro Mile is FtLaud.
 * See docs/CYCLE_18_HILLSBORO_MILE_MARKET_TAXONOMY_FIX.md.
 */
export type MarketCluster = "primary" | "neighborhood" | "northern-broward-waterfront";

export type Market = {
  readonly slug: MarketSlug;
  readonly name: string;
  readonly tagline: string;
  readonly intro: string;
  readonly highlights: ReadonlyArray<string>;
  readonly lifestyle: string;
  readonly priceCharacter: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly heroImage: string;
  /**
   * Optional Tailwind `object-position` utility (e.g. "object-right", "object-bottom",
   * "object-[60%_50%]") for the MarketCard image at aspect-[4/5] crop. Defaults to
   * "object-center". Use only when the source image's most distinctive content
   * (lighthouse + sunset estate, mid-century home under canopy) lives off-center
   * and needs to be pulled into the visible portrait crop. Cycle Addendum 2026-05-09.
   */
  readonly cardObjectPosition?: string;
  /** One concrete neighborhood/landmark fact used for AEO differentiation in FAQ. */
  readonly localContext: string;
  /** County the market sits in — used in schema and copy. */
  readonly county: "Broward County" | "Palm Beach County";
  /**
   * Cluster classification (Cycle 14; extended Cycle 18).
   *   - `"primary"` = city/town-level service market that renders under the
   *     "South Florida cities and towns" section (Fort Lauderdale, Boca Raton,
   *     Delray Beach, Palm Beach, Lighthouse Point, Sea Ranch Lakes, Pompano Beach).
   *   - `"neighborhood"` = Eastern Fort Lauderdale neighborhood that renders
   *     in the renamed Fort Lauderdale waterfront cluster section
   *     (Coral Ridge, Victoria Park, Rio Vista, Harbor Beach, Las Olas Isles,
   *     Seven Isles, Bay Colony, Bermuda Riviera).
   *   - `"northern-broward-waterfront"` (Cycle 18) = a Northern Broward
   *     waterfront municipality / corridor that is NOT Fort Lauderdale but
   *     belongs in the same /markets/ section visually because the cohort
   *     a serious waterfront buyer compares includes both. Currently:
   *     Hillsboro Mile.
   *
   * Drives `/markets/` index partition + related-section heading on
   * `[slug]/page.tsx`. The `getFortLauderdaleClusterSlugs()` helper returns
   * the union `[neighborhood ∪ northern-broward-waterfront]` so the section
   * grouping stays single-source.
   */
  readonly cluster: MarketCluster;
  /**
   * §1-verified hero quote sourced from miasanabria.com (PUBLIC_FACT_LEDGER §1).
   * Optional — Coral Ridge has no source quote on the live .com.
   */
  readonly miaQuote?: string;
  /**
   * Natural-language answer to "What is [market] known for in luxury real estate?".
   * 75-125 words; direct and concrete; no SEO stuffing. Drives AEO answer block.
   */
  readonly aeoAnswer: string;
  /** 3-5 short property archetypes typical to the market. */
  readonly propertyTypes: ReadonlyArray<string>;
  /** 60-100 words on who the market suits + buyer-side considerations. */
  readonly buyerGuidance: string;
  /** 60-100 words on positioning for sellers + why local representation matters. */
  readonly sellerGuidance: string;
  /** Exactly 5 market-specific FAQs; answers 30-80 words each. */
  readonly faqs: ReadonlyArray<MarketFaq>;
  /** 2-6 cross-pollination links to related markets/neighborhoods. Cycle 14 raised cap from 4 to 6 to absorb reverse-link curation for Bay Colony + Bermuda Riviera. */
  readonly internalLinks: ReadonlyArray<MarketInternalLink>;
  /**
   * Optional 60-120 word "How this market compares to nearby markets" paragraph,
   * rendered above the related-markets card grid on `[slug]/page.tsx`. Names the
   * cohort + the buyer-decision logic that makes each peer relevant. Required for
   * featured markets per the Ultimate Featured Market Page Standard (Cycle 14);
   * optional for non-featured (the related-markets cards alone suffice). Kept
   * factual: cohort vocabulary, architectural era, water-access tier, walkability —
   * never invented stats or rankings.
   */
  readonly comparisonContext?: string;
};

export const MARKETS: ReadonlyArray<Market> = [
  {
    slug: "fort-lauderdale",
    cluster: "primary",
    name: "Fort Lauderdale",
    tagline: "Waterfront, city, and beach living in Mia's home market.",
    intro:
      "Fort Lauderdale is Mia's home market and a natural starting point for buyers and sellers comparing waterfront, beach, and in-town neighborhoods. The right strategy depends on lifestyle fit, commute patterns, property condition, and current comparable sales.",
    highlights: [
      "Waterfront neighborhoods, beach corridors, and in-town residential pockets",
      "Access to Las Olas, downtown Fort Lauderdale, the beach, FLL, and Port Everglades",
      "Buyer conversations that start with lifestyle, timing, and preferred property type",
      "Seller conversations grounded in neighborhood-specific preparation and pricing",
      "REALTOR® guidance from first consultation through closing coordination",
    ],
    lifestyle:
      "Fort Lauderdale combines boating, beach access, downtown dining, and established residential neighborhoods. Mia helps clients compare the tradeoffs between water access, walkability, renovation needs, and long-term fit.",
    priceCharacter:
      "Pricing changes block by block. Request a current market conversation before relying on public estimates or broad online ranges.",
    latitude: 26.1224,
    longitude: -80.1373,
    heroImage: "/markets/fort-lauderdale.jpg",
    localContext:
      "Fort Lauderdale stretches from the Atlantic across the Intracoastal to the New River and downtown — buyer briefs typically segment by water access (deep-water dockage vs. fixed-bridge), proximity to Las Olas, and beach corridor.",
    county: "Broward County",
    miaQuote:
      "Known as the Venice of America, Fort Lauderdale is built around more than 165 miles of inland canals — the geography that anchors the deepwater yachting market.",
    aeoAnswer:
      "Fort Lauderdale is known for waterfront living anchored by more than 165 miles of inland canals — the reason it is called the Venice of America. The city pairs deepwater yacht-capable residences with in-town neighborhoods near Las Olas Boulevard, the A1A beach corridor, and downtown's Riverwalk. Buyers compare ocean access, walkability, and architectural era. Sellers position on dockage, lot, and condition. Port Everglades, the international airport, and the Las Olas-to-beach axis frame the daily geography that distinguishes the market in South Florida.",
    propertyTypes: [
      "Deepwater single-family residences with private dockage",
      "Beach-corridor condominiums east of the Intracoastal",
      "In-town historic and renovated cottages near Las Olas",
      "Contemporary new-build estates on the finger isles",
      "Townhomes and boutique low-rise condos in walkable pockets",
    ],
    buyerGuidance:
      "Fort Lauderdale suits buyers who want a real city alongside deepwater boating, beach access, and a recognizable downtown. The first decision is almost always water — ocean access via the Intracoastal versus fixed-bridge canals. Walkability and architectural era come next. Diligence covers seawall, dock capacity, flood zone, hurricane shutters, and renovation history. A clear brief makes the search decisive rather than scattered across too many neighborhoods.",
    sellerGuidance:
      "Sellers should position to one of three buyer profiles: yachting, in-town walkability, or beach-corridor lifestyle. Pricing turns on dockage, lot orientation, and street-level reputation that public estimates miss. Pre-list preparation includes seawall and dock confirmation, staging tuned to the buyer pool, and a comparable-sales brief that separates renovated trades from estate-condition sales. The residence should tell one clear story before it lists.",
    faqs: [
      {
        question:
          "What makes Fort Lauderdale's waterfront different from other South Florida cities?",
        answer:
          "Fort Lauderdale has more than 165 miles of navigable inland waterways and deepwater ocean access via Port Everglades — no fixed bridges between the major yacht-capable canals and the Atlantic. That combination, plus a working downtown and beach in one city, is rare in South Florida and is why the market is considered the yachting capital of the world.",
      },
      {
        question: "Which neighborhoods do most luxury buyers compare first?",
        answer:
          "Buyers commonly weigh Las Olas Isles and Rio Vista (deepwater, walkable to Las Olas), Harbor Beach (private gated waterfront), Coral Ridge (established country-club setting), and Victoria Park (in-town walkability). The right shortlist depends on whether dockage, walkability, or a residential street feel is the priority.",
      },
      {
        question: "How important is dockage to Fort Lauderdale pricing?",
        answer:
          "On waterfront residences, dockage often drives more pricing variance than square footage. Bridge clearance, water depth, dock length, and proximity to the inlet matter. Two homes on the same canal can trade at different multiples depending on whether the dock can hold a 60-foot yacht versus a 30-foot day boat.",
      },
      {
        question: "Is Fort Lauderdale primarily a single-family or condo market?",
        answer:
          "Both. Single-family dominates the waterfront isles and in-town neighborhoods like Victoria Park, Coral Ridge, and Rio Vista. Condominiums dominate the A1A beach corridor and downtown high-rises. Buyers usually decide single-family versus condo based on maintenance preference, lock-and-leave needs, and view priority.",
      },
      {
        question: "How does Mia approach a Fort Lauderdale search or listing?",
        answer:
          "It begins with a private conversation about the brief — lifestyle anchors, timeline, and the residence in mind. From there she narrows the search or shapes the listing strategy block by block, with current comparable sales, dockage and lot details, and any informally available residences her network surfaces along the way.",
      },
    ],
    internalLinks: [
      { slug: "las-olas-isles", label: "Las Olas Isles" },
      { slug: "harbor-beach", label: "Harbor Beach" },
      { slug: "victoria-park", label: "Victoria Park" },
      { slug: "coral-ridge", label: "Coral Ridge" },
      { slug: "bay-colony", label: "Bay Colony" },
      { slug: "bermuda-riviera", label: "Bermuda Riviera" },
    ],
    comparisonContext:
      "Fort Lauderdale is the anchor for the Eastern Fort Lauderdale waterfront cohort. Buyers usually compare three vectors against the city itself: Las Olas Isles for deepwater dockage with walkable Las Olas Boulevard frontage; Harbor Beach for private gated estate living with a beach-club component; and Victoria Park or Coral Ridge for in-town or country-club residential alternatives. Bay Colony and Bermuda Riviera are the gated and mid-century-modern subsets within the broader cohort. The right shortlist depends on whether dockage specifics, gate-controlled privacy, walkability, or architectural era is the dominant priority.",
  },
  {
    slug: "coral-ridge",
    cluster: "neighborhood",
    name: "Coral Ridge",
    tagline: "A Fort Lauderdale neighborhood known for water access and established streets.",
    intro:
      "Coral Ridge is a key Fort Lauderdale market for clients comparing waterfront, golf-course-adjacent, and established residential options. Good decisions here require attention to lot, condition, renovation history, and current neighborhood comps.",
    highlights: [
      "Established Fort Lauderdale neighborhood context",
      "Waterfront and non-waterfront options depending on the street and parcel",
      "Convenient access to beach, retail, dining, and central Fort Lauderdale",
      "Property-by-property review of renovation quality and long-term suitability",
      "Seller preparation focused on presentation, pricing, and buyer objections",
    ],
    lifestyle:
      "Coral Ridge appeals to clients who want Fort Lauderdale access with a residential feel. Mia helps clients evaluate which streets and property types match their priorities before scheduling showings or pricing a listing.",
    priceCharacter:
      "Use a current CMA or buyer brief for pricing. Online estimates often miss condition, dockage, lot, and renovation differences.",
    latitude: 26.1638,
    longitude: -80.1136,
    heroImage: "/markets/coral-ridge.jpg",
    // Source image: mid-century modern home centered in the lower portion of the
    // landscape frame, with heavy oak canopy filling the upper portion. At
    // aspect-[4/5] portrait crop with object-center, the canopy dominates and
    // the cream house sinks to the lower edge under the text-region gradient.
    // Pulling the position to the bottom keeps the bright cream architecture
    // up in the visible upper-card region where the new gradient lets the
    // image breathe.
    cardObjectPosition: "object-bottom",
    localContext:
      "Coral Ridge sits north of Sunrise Boulevard between the Intracoastal and Federal Highway, anchored by the Coral Ridge Country Club. The waterfront streets along the finger isles trade differently from the interior blocks — a brief that confuses the two will price wrong.",
    county: "Broward County",
    aeoAnswer:
      "Coral Ridge is an established Fort Lauderdale neighborhood north of Sunrise Boulevard, framed by the Intracoastal to the east and Federal Highway to the west, and centered on the Coral Ridge Country Club. The market is known for ocean-access waterfront finger isles, mid-century and renovated single-family residences on tree-lined interior streets, and proximity to the beach corridor, Galleria shopping, and downtown Fort Lauderdale. Buyers value the combination of country-club setting and city access; sellers benefit from presenting the residence within the neighborhood's quieter, residential cadence rather than as a beach or downtown property.",
    propertyTypes: [
      "Waterfront single-family on Coral Ridge finger isles",
      "Mid-century ranch homes on interior tree-lined streets",
      "Renovated estate residences with pool and patio",
      "Country-club-adjacent residences near the Coral Ridge CC",
      "Boutique low-rise condos along Bayview Drive",
    ],
    buyerGuidance:
      "Coral Ridge fits buyers who want established Fort Lauderdale residential character with optional water access. The first decision is waterfront isle versus interior street — they trade as different micro-markets. Diligence on interior homes focuses on renovation quality, roof age, and lot depth. Diligence on waterfront homes focuses on dockage, seawall, and bridge clearance. Country-club membership is independent of homeownership; clarify expectations upfront so the search isn't crossed with assumptions about included amenities.",
    sellerGuidance:
      "Sellers in Coral Ridge should position the residence within its specific street category: waterfront isle, interior block, or country-club-adjacent. Pricing turns on lot, renovation depth, and dockage details that broad online estimates miss. Local representation matters because buyers in this market actively compare against Las Olas Isles, Victoria Park, and Lighthouse Point — a listing brief should anticipate those comparisons. Pre-list preparation usually emphasizes neutral staging, exterior tidy-up, and a comparable-sales packet narrowed to the right block category.",
    faqs: [
      {
        question:
          "What is the difference between Coral Ridge waterfront and interior streets?",
        answer:
          "The Coral Ridge finger isles east toward the Intracoastal trade as a deepwater waterfront market with dockage and bridge-clearance considerations. The interior streets west of Bayview Drive trade as a more traditional residential market priced on lot, renovation, and proximity to the country club. The two should be compared as separate markets, not lumped together.",
      },
      {
        question: "Is Coral Ridge Country Club membership tied to owning a home there?",
        answer:
          "No. Coral Ridge Country Club membership is separate from real estate ownership in the neighborhood. Buyers who want club access apply independently. Mia helps clients factor membership intentions into the search so the residence selection and the lifestyle goal stay aligned, not crossed.",
      },
      {
        question: "How does Coral Ridge compare to Las Olas Isles for waterfront buyers?",
        answer:
          "Las Olas Isles is closer to downtown and Las Olas Boulevard with a more urban-walkable feel. Coral Ridge is quieter, more residential, and farther north. Both offer deepwater dockage; the choice usually comes down to walkability versus residential calm, and the specific dock and lot a given buyer wants.",
      },
      {
        question: "What property condition should buyers expect in Coral Ridge?",
        answer:
          "The neighborhood has a mix of original mid-century homes, partial renovations, and full studs-out remodels. Two homes on the same block can vary widely in condition. A property-specific review covering roof, HVAC, electrical, and any added square footage is essential before relying on a price-per-foot comparison.",
      },
      {
        question: "Where do most Coral Ridge buyers come from?",
        answer:
          "Buyers commonly come from elsewhere in Fort Lauderdale wanting a quieter residential street, from the Northeast and Midwest seeking primary or seasonal residences, and from nearby Lighthouse Point or Victoria Park trading up. The brief usually centers on the country-club setting, the schools, and the established neighborhood feel.",
      },
    ],
    internalLinks: [
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
      { slug: "victoria-park", label: "Victoria Park" },
      { slug: "lighthouse-point", label: "Lighthouse Point" },
      { slug: "bermuda-riviera", label: "Bermuda Riviera" },
      { slug: "bay-colony", label: "Bay Colony" },
    ],
  },
  {
    slug: "victoria-park",
    cluster: "neighborhood",
    name: "Victoria Park",
    tagline: "Walkable Fort Lauderdale living near Las Olas, downtown, and the beach corridor.",
    intro:
      "Victoria Park is an in-town Fort Lauderdale neighborhood for clients who value proximity to restaurants, parks, downtown, and the beach corridor. The market includes a mix of older homes, renovated properties, townhomes, and newer construction.",
    highlights: [
      "In-town Fort Lauderdale location near Las Olas and downtown",
      "Mix of property ages, styles, lot sizes, and renovation levels",
      "Strong fit for buyers prioritizing walkability and central access",
      "Careful due diligence around condition, insurance, parking, and layout",
      "Seller strategy focused on presentation and neighborhood-specific buyer demand",
    ],
    lifestyle:
      "Victoria Park works well for clients who want a neighborhood feel without giving up central Fort Lauderdale access. Property selection benefits from careful comparison between charm, updates, parking, and maintenance profile.",
    priceCharacter:
      "Pricing depends heavily on property type, condition, lot, and location within the neighborhood. Mia can prepare current comps for a specific address or buyer brief.",
    latitude: 26.1303,
    longitude: -80.1244,
    heroImage: "/markets/victoria-park.jpg",
    localContext:
      "Victoria Park is the in-town Fort Lauderdale neighborhood immediately east of Federal Highway, framed by Sunrise Boulevard, the Middle River, and Holiday Park. Block-by-block character changes quickly — historic bungalows, mid-century cottages, contemporary new builds, and townhomes coexist within walking distance.",
    county: "Broward County",
    aeoAnswer:
      "Victoria Park is an in-town Fort Lauderdale neighborhood east of Federal Highway, framed by Sunrise Boulevard, the Middle River, and Holiday Park. It is known for walkability — Las Olas Boulevard, downtown Fort Lauderdale, the Riverwalk, and the beach corridor are all minutes away. The housing stock is unusually layered: historic bungalows, mid-century cottages, contemporary new builds, and modern townhomes share the same blocks. Buyers value the city access without high-rise living; sellers benefit from presenting the residence's character — original detail, renovation depth, or new-build clarity — as a defined story within a neighborhood that rewards distinct properties.",
    propertyTypes: [
      "Historic 1920s-1940s bungalows with original character",
      "Mid-century cottages renovated to current standard",
      "Contemporary new-build single-family on tear-down lots",
      "Townhomes and small fee-simple multi-unit projects",
      "Compact lots with pool and outdoor living",
    ],
    buyerGuidance:
      "Victoria Park suits buyers who want walkable city living without committing to a downtown high-rise. The neighborhood rewards property-specific decisions because two homes on the same block can be a 1930s bungalow and a 2023 new build. Diligence focuses on renovation quality, parking and driveway, hurricane impact protection, flood zone, and lot orientation. Buyers should drive the streets they like at different times of day — the corner blocks have a different feel than the interior streets, and that matters for daily life.",
    sellerGuidance:
      "Sellers in Victoria Park should lean into the residence's specific story — original character preserved, mid-century thoughtfully renovated, or contemporary new build — rather than listing it as a generic neighborhood home. Local representation matters because the buyer pool is narrow and discerning: design-aware buyers who already know the block-by-block differences. Pre-list preparation typically emphasizes professional photography, light staging that fits the architectural era, and a comparable-sales brief drawn from the right archetype rather than a neighborhood average.",
    faqs: [
      {
        question: "What kinds of properties are available in Victoria Park?",
        answer:
          "The neighborhood has a layered mix — original 1920s-1940s bungalows, mid-century cottages, modern new builds, and townhomes — often coexisting on the same block. Lot sizes are typically smaller than the waterfront isles. The variety is the appeal; it also means the search needs to be specific about era and condition, not just location.",
      },
      {
        question: "How walkable is Victoria Park?",
        answer:
          "Victoria Park is one of Fort Lauderdale's most walkable single-family neighborhoods. Las Olas Boulevard, Holiday Park, downtown, and the Riverwalk are within a 10-15 minute walk or short bike ride from most blocks. Some interior streets are quieter; the perimeter near Sunrise Boulevard and Federal Highway is busier. Walking the specific block matters.",
      },
      {
        question: "Is Victoria Park a good fit for first-time luxury buyers?",
        answer:
          "It can be. Buyers who want city access, character, and a neighborhood feel — without a yacht-capable dock — often start here before deciding whether they want to step up to Las Olas Isles or Rio Vista. The smaller lots and renovated cottage segment can offer a defined entry point compared to the deepwater waterfront markets.",
      },
      {
        question: "What should buyers expect on insurance and flood considerations?",
        answer:
          "Like much of coastal Fort Lauderdale, insurance varies by elevation, year built, roof age, hurricane impact protection, and flood zone. Older homes can require updated roofs and impact windows to be insurable on competitive terms. Clarifying insurance and flood-zone status early in the search prevents surprises during diligence.",
      },
      {
        question: "How does Victoria Park compare to Las Olas Isles?",
        answer:
          "Victoria Park is in-town and walkable but does not offer deepwater dockage or finger-isle waterfront. Las Olas Isles trades on water access and yacht-capable canals at a higher price band. Buyers who prioritize walkability and architectural character lean Victoria Park; buyers who prioritize the boat lean Las Olas Isles or Rio Vista.",
      },
    ],
    internalLinks: [
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
      { slug: "rio-vista", label: "Rio Vista" },
      { slug: "las-olas-isles", label: "Las Olas Isles" },
      { slug: "coral-ridge", label: "Coral Ridge" },
    ],
    comparisonContext:
      "Victoria Park is the in-town walkable alternative within Eastern Fort Lauderdale. Buyers who prioritize Las Olas Boulevard adjacency without the deepwater dockage premium usually compare Victoria Park against Las Olas Isles (water access at higher price band), Rio Vista (residential walkable plus deepwater), and Coral Ridge (country-club setting, less walkable). The Eastern Fort Lauderdale cohort offers four meaningful tradeoffs — walkability, waterfront, architectural character, and country-club access — and Victoria Park is the canonical walkable-without-waterfront answer for buyers who value the in-town residential pattern over canal frontage.",
  },
  {
    slug: "boca-raton",
    cluster: "primary",
    name: "Boca Raton",
    tagline: "Coastal, club, and city access across South Palm Beach County.",
    intro:
      "Boca Raton runs in three layers — A1A coastal condominiums, single-family residences in the eastern grid, and gated club communities west of I-95. The right match depends on lifestyle priority, association detail, building condition, and long-term ownership goals.",
    highlights: [
      "Coastal, in-town, and club-community options",
      "Access to shopping, dining, beaches, parks, and cultural amenities",
      "Detailed review of association rules, fees, reserves, and maintenance profile",
      "Buyer guidance that narrows searches before showings begin",
      "Seller guidance that positions the home against the right comparable set",
    ],
    lifestyle:
      "Boca Raton rewards clarity. Mia helps clients decide whether the priority is beach proximity, club amenities, walkability, or a quieter residential setting.",
    priceCharacter:
      "Pricing varies widely by property type and community. Start with current comps rather than a generic market average.",
    latitude: 26.3683,
    longitude: -80.1289,
    heroImage: "/markets/boca-raton.jpg",
    localContext:
      "Boca Raton spans from the Atlantic west into central Palm Beach County, with distinct micro-markets along A1A, the East Boca grid, the Royal Palm and Boca Bay Colony estate sections, and the gated club communities west of I-95. Each set has its own buyer profile, fee structure, and resale dynamics.",
    county: "Palm Beach County",
    miaQuote:
      "Boca Raton's distinctive layer is Addison Mizner's Mediterranean Revival architecture, ocean-access estate sections, and a balance between resort feel and a full-time residential community.",
    aeoAnswer:
      "Boca Raton is a south Palm Beach County city known for layered character — Mediterranean Revival architecture inherited from Addison Mizner, ocean-access estate sections like Royal Palm Yacht & Country Club and Boca Bay Colony, A1A coastal condominiums, and gated club communities west of I-95. The market spans single-family waterfront, beach-corridor high-rises, golf-club estates, and residential pockets within established neighborhoods. Distinguishing features are architectural continuity east of the Intracoastal, the breadth of club lifestyles, and a balance between resort feel and full-time residential community. Buyers shop across very different micro-markets within one city.",
    propertyTypes: [
      "Royal Palm and Boca Bay Colony deepwater estates",
      "A1A oceanfront and beach-corridor condominiums",
      "East Boca single-family residences in walkable grid blocks",
      "Gated club-community estates west of I-95",
      "Townhomes and boutique condominiums near Mizner Park",
    ],
    buyerGuidance:
      "Boca Raton suits buyers who want optionality — beach, club, or in-town residential — within one city. The first decision is east versus west of I-95: east is coastal and downtown; west is gated golf and tennis. Condominium diligence covers association reserves, special assessments, milestone-inspection status, and pet/rental rules. Club-community diligence covers membership transfer rules, equity contributions, and capital fees. Naming the lifestyle priority before touring narrows the search to two or three serious candidates.",
    sellerGuidance:
      "Sellers in Boca Raton should position to the buyer pool that matches the residence's exact micro-market — Royal Palm yacht buyer, A1A beach-condo buyer, East Boca walkable family, or western club buyer. Local representation matters because pricing turns on association detail, club rules, and architectural pedigree that broad estimates miss. Pre-list preparation typically includes a comparable-sales brief drawn from the right archetype, building reserves and milestone status documentation, and presentation tuned to the architectural era.",
    faqs: [
      {
        question: "Which county is Boca Raton in, and why does that matter?",
        answer:
          "Boca Raton is in southern Palm Beach County. County matters for property tax assessment, recording, permitting, and the public records used during diligence. It also affects which board of REALTORS® and MLS coverage applies to a transaction. Mia coordinates the right Palm Beach County resources for searches and listings here.",
      },
      {
        question: "How do East Boca and West Boca differ for luxury buyers?",
        answer:
          "East Boca, generally east of I-95, includes the coastal estates, A1A condominiums, downtown and Mizner Park, and walkable single-family grids. West Boca, generally west of I-95, is the gated club-community territory — golf, tennis, and established residential neighborhoods. The two markets attract different buyers and trade on different drivers.",
      },
      {
        question: "What should condo buyers know about milestone inspections?",
        answer:
          "Florida law requires structural integrity reserve studies and milestone inspections for older condominium buildings. Reserves can no longer be waived in many situations. Buyers should review the most recent inspection, reserve study, and any pending special assessments before committing — these can materially affect monthly cost of ownership.",
      },
      {
        question: "Does Boca Raton offer ocean-access waterfront for boaters?",
        answer:
          "Yes. Royal Palm Yacht & Country Club and Boca Bay Colony are the two best-known deepwater estate sections, with private dockage and Intracoastal access to the Boca Inlet. Bridge clearance and dockage specifics vary by canal — buyers focused on yacht-capable residences should plan diligence around the specific dock, not the neighborhood average.",
      },
      {
        question: "How does Mia approach Boca Raton searches?",
        answer:
          "She begins with a brief that names the lifestyle priority — beach, club, in-town residential, or yacht — and the timing. From there she narrows to two or three micro-markets, prepares current comparable sales, and reviews association or club rules in detail before recommending showings. The goal is a focused short list, not a broad tour of the city.",
      },
    ],
    internalLinks: [
      { slug: "delray-beach", label: "Delray Beach" },
      { slug: "palm-beach", label: "Palm Beach" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
    comparisonContext:
      "Boca Raton sits within the Palm Beach County primary luxury cohort alongside Delray Beach and Palm Beach. Boca offers three identity layers — coastal condominiums east of A1A, single-family neighborhoods around the country-club corridor, and beach-oriented Mediterranean Revival residences — that make the brief broader than either neighbor. Delray Beach trades on its downtown Atlantic Avenue lifestyle and beach-block residences; Palm Beach trades on its oceanfront formality. Fort Lauderdale to the south is the alternative for buyers who want a major city alongside the waterfront. The right Boca shortlist depends on which of those three layers fits the lifestyle.",
  },
  {
    slug: "palm-beach",
    cluster: "primary",
    name: "Palm Beach",
    tagline: "Island and coastal property decisions that require careful preparation.",
    intro:
      "Palm Beach-area decisions often involve building rules, association requirements, renovation expectations, seasonal timing, and detailed property due diligence. Mia helps clients clarify the brief before pursuing a specific property or listing strategy.",
    highlights: [
      "Coastal condominium and single-family considerations",
      "Attention to building rules, reserves, fees, and renovation constraints",
      "Seasonal timing and showing strategy reviewed upfront",
      "Clear comparison between lifestyle needs and ownership responsibilities",
      "Current comps prepared for the specific property question",
    ],
    lifestyle:
      "Palm Beach-area searches benefit from preparation. Mia helps clients compare location, building profile, access, timing, and property condition before making decisions.",
    priceCharacter:
      "Current comps and property-specific details matter more than broad public ranges. Request a focused review for the address or target building.",
    latitude: 26.7056,
    longitude: -80.0364,
    heroImage: "/markets/palm-beach.jpg",
    // Source image: Mediterranean estate on the left with palms + pool + ocean
    // on the right. At portrait crop the estate detail is lost. Position
    // slightly to the right pulls in the most-luxurious element (palms over
    // the pool with ocean horizon) without dropping the architecture entirely.
    cardObjectPosition: "object-[65%_50%]",
    localContext:
      "The Town of Palm Beach is a barrier island with strict building review, established estate sections in the North End and South End, and the Worth Avenue / Mid-Town corridor in between. Off-island, the Palm Beach area extends through West Palm Beach and the Intracoastal communities — buyer briefs need to specify which side of the bridges.",
    county: "Palm Beach County",
    miaQuote:
      "Palm Beach is a small barrier-island town defined by architectural review, generational tenure, and three distinct sections — North End, Mid-Town, and South End.",
    aeoAnswer:
      "Palm Beach is a barrier-island town in northern Palm Beach County known for generational-wealth real estate, strict architectural review, and three distinct sections — the North End estate corridor, the Worth Avenue and Mid-Town residential and shopping core, and the South End condominiums. The on-island market is small, controlled, and trades on architectural pedigree, lot, ocean or lake frontage, and renovation depth. Off-island, the broader Palm Beach area extends to West Palm Beach, the Intracoastal communities, and the bridge-access neighborhoods. The defining feature is preparation — building rules, seasonal timing, and property-specific due diligence shape every decision more than headline market trends.",
    propertyTypes: [
      "North End single-family estates between Lake and Ocean",
      "Mid-Town and Worth Avenue residential properties",
      "South End oceanfront and Intracoastal condominiums",
      "Bermuda, Mizner, and Mediterranean Revival architecture",
      "Off-island West Palm Beach and Intracoastal residences",
    ],
    buyerGuidance:
      "Palm Beach suits buyers who want a controlled architectural environment, established residential geography, and access to a recognizable lifestyle. The first decision is on-island versus off-island — they trade as different markets with different rules and timelines. On-island, diligence focuses on Town of Palm Beach building review, ARCOM approval pathways for renovation, and comparable sales drawn from the correct section. Buyers should plan a longer search horizon than typical South Florida markets and treat seasonality as a real factor in showings and offers.",
    sellerGuidance:
      "Sellers in the Palm Beach area should position the residence to its exact section — North End, Mid-Town, South End, or off-island — and to the buyer pool that shops there. Local representation matters because architectural review history, lot pedigree, and section-specific comparables shape pricing more than broad averages. Pre-list preparation often includes documentation of past ARCOM approvals where relevant, condition disclosure for older buildings, and a comparable-sales brief drawn narrowly from the right cohort rather than the island as a whole.",
    faqs: [
      {
        question: "What is ARCOM and how does it affect Palm Beach properties?",
        answer:
          "ARCOM is the Town of Palm Beach Architectural Commission, which reviews exterior changes to many properties on the island. Buyers planning renovation should understand the approval pathway before committing. Sellers benefit from documenting prior approvals. Off-island areas like West Palm Beach do not have the same review process.",
      },
      {
        question: "How do the North End, Mid-Town, and South End differ?",
        answer:
          "The North End is primarily single-family estates on lots running between the Lake and the Ocean. Mid-Town centers on Worth Avenue and the residential streets around it. The South End is more condominium-driven, with oceanfront and Intracoastal buildings. Each section has a different buyer profile and pricing logic.",
      },
      {
        question: "Is the Palm Beach market seasonal?",
        answer:
          "Yes. Showings, listings, and transaction activity concentrate from late fall through spring. Off-season periods can bring quieter showing schedules and longer days-on-market for residences not priced precisely. A search or listing strategy should account for the calendar rather than ignore it.",
      },
      {
        question: "Where does most off-island activity happen?",
        answer:
          "West Palm Beach, including the historic and waterfront neighborhoods east of I-95, plus the Intracoastal communities and bridge-access pockets. Off-island offers different price bands, different building types, and faster transaction timelines than the on-island Town of Palm Beach. The right side of the bridge depends on the buyer's priorities.",
      },
      {
        question: "Why does Mia treat Palm Beach as a preparation-first market?",
        answer:
          "Because building rules, association rules, architectural review, and seasonality all interact. A casual approach produces dead ends. The most efficient path is a clearly written brief, a small short list, and detailed diligence on each candidate before showings — rather than a broad open-ended tour.",
      },
    ],
    internalLinks: [
      { slug: "boca-raton", label: "Boca Raton" },
      { slug: "delray-beach", label: "Delray Beach" },
    ],
  },
  {
    slug: "delray-beach",
    cluster: "primary",
    name: "Delray Beach",
    tagline: "Beach, downtown, and residential options with a strong local lifestyle draw.",
    intro:
      "Delray Beach offers a mix of beach-adjacent, downtown, and residential neighborhoods. Buyers often compare walkability, beach access, association structure, renovation quality, and commute patterns.",
    highlights: [
      "Atlantic Avenue, beach access, and residential neighborhood options",
      "Condominium, townhome, and single-family comparisons",
      "Association and maintenance review before committing to a property",
      "Seller preparation based on current local demand and competing inventory",
      "Buyer shortlists shaped around lifestyle and ownership preferences",
    ],
    lifestyle:
      "Delray Beach suits clients who want a walkable downtown, Atlantic beach access, and residential neighborhood living within one city. Distance to Atlantic Avenue is the single biggest pricing variable; the building, the block, and the condition shape the rest.",
    priceCharacter:
      "Pricing turns on walkability to Atlantic Avenue first, then building, condition, and neighborhood. A current parcel-level comparison resolves what an automated estimate misses.",
    latitude: 26.4615,
    longitude: -80.0728,
    heroImage: "/markets/delray-beach.jpg",
    localContext:
      "Delray Beach centers on Atlantic Avenue, with beach blocks east of A1A, the historic Marina District and Pineapple Grove just inland, and established residential pockets like Lake Ida and Tropic Isle pushing west and south. The walkable downtown is the demand driver — distance to it shapes pricing as much as the property itself.",
    county: "Palm Beach County",
    miaQuote:
      "Delray Beach — the Village by the Sea — is organized around a walkable Atlantic Avenue downtown. Proximity to Atlantic is the dominant pricing variable; the residential heart spans Lake Ida, Tropic Isle, and the A1A beach corridor.",
    aeoAnswer:
      "Delray Beach, the self-styled Village by the Sea in central Palm Beach County, is known for a walkable Atlantic Avenue downtown that anchors the broader market. East of Federal Highway, the Marina District and Pineapple Grove offer historic blocks and boutique condominiums minutes from the beach. The residential heart includes Lake Ida north of Atlantic, Tropic Isle and Pelican Harbor south on the Intracoastal, and beach-corridor condominiums east of A1A. Distance to downtown is the dominant pricing variable. Properties that walk to Atlantic Avenue trade differently from those that drive — and that proximity shapes how buyers and sellers position.",
    propertyTypes: [
      "Beach-corridor condominiums east of A1A",
      "Atlantic Avenue and Pineapple Grove walkable residences",
      "Marina District historic homes and townhouses",
      "Lake Ida and Tropic Isle single-family residences",
      "Intracoastal residences with private dockage",
    ],
    buyerGuidance:
      "Delray Beach suits buyers who want a walkable downtown alongside beach and residential options in one city. The first decision is walkable-to-Atlantic versus residential interior — that proximity is the single biggest pricing driver. Diligence on condominiums focuses on reserves, milestone inspection, rental rules, and pet policy. Diligence on single-family focuses on lot, renovation depth, and flood/insurance status. Buyers shopping for an Intracoastal residence should add dockage and bridge-clearance review on top of the standard single-family checklist.",
    sellerGuidance:
      "Sellers in Delray Beach should position the residence to its specific location — walkable downtown, beach corridor, Marina District, or interior residential — and to the buyer pool active in that segment. Local representation matters because the city's micro-markets diverge quickly: a residence three blocks from Atlantic Avenue trades on entirely different drivers than one a mile away. Pre-list preparation typically emphasizes accurate downtown-walkability framing, association documentation for condos, and a comparable-sales brief drawn from the correct geographic radius rather than a city-wide average.",
    faqs: [
      {
        question: "How important is walkability to Atlantic Avenue?",
        answer:
          "Very important. Walkable-to-Atlantic Avenue residences trade at a meaningful premium to drive-only ones. The premium covers restaurants, retail, the beach via Atlantic, and the year-round downtown energy. Buyers who do not need walkability can find more value moving even a few blocks west or north — but they should make that tradeoff consciously.",
      },
      {
        question: "Which neighborhoods make up most Delray Beach searches?",
        answer:
          "Common comparisons include the beach-corridor condominiums east of A1A, the Marina District and Pineapple Grove walkable single-family, Lake Ida north of Atlantic Avenue, and Tropic Isle or Pelican Harbor south near the Intracoastal. Each has a distinct buyer profile, price band, and lifestyle pace.",
      },
      {
        question: "What should condominium buyers focus on in Delray Beach?",
        answer:
          "Reserves, milestone inspection status, recent special assessments, rental and pet rules, and any pending construction. Florida's reserve and inspection rules apply here, and beach-corridor buildings can vary widely in financial health. A clear association review during the inspection period prevents surprises post-closing.",
      },
      {
        question: "How does Delray Beach compare to Boca Raton for luxury buyers?",
        answer:
          "Delray Beach is more downtown-walkable and pedestrian-scaled. Boca Raton offers broader optionality across coastal estates, gated club communities, and a larger overall market. Buyers who prioritize a small-downtown lifestyle lean Delray; buyers who want club, school, and architectural breadth often lean Boca. The two cities are 15 minutes apart and frequently compared.",
      },
      {
        question: "Are there waterfront single-family options in Delray Beach?",
        answer:
          "Yes. Tropic Isle, Pelican Harbor, and the Intracoastal-adjacent pockets offer private-dockage single-family residences. Bridge clearance and ocean access vary; not every canal in Delray is yacht-capable. Buyers focused on a specific boat should review the dock and the canal route to the inlet before committing to a residence.",
      },
    ],
    internalLinks: [
      { slug: "boca-raton", label: "Boca Raton" },
      { slug: "palm-beach", label: "Palm Beach" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
    comparisonContext:
      "Delray Beach pairs with Boca Raton and Palm Beach in the Palm Beach County primary luxury cohort. Delray's center of gravity is Atlantic Avenue, the beach blocks east of A1A, and the canal-front Tropic Isle and Pelican Harbor pockets. Boca Raton to the south offers a more formal country-club tier; Palm Beach further north offers a more formal oceanfront tier. Fort Lauderdale is the alternative for buyers who prefer the larger waterfront city. Delray's brief usually sits between these — beach-and-downtown lifestyle without the formality of Palm Beach or the scale of Fort Lauderdale.",
  },
  {
    slug: "lighthouse-point",
    cluster: "primary",
    name: "Lighthouse Point",
    tagline: "A Broward coastal community where water access often drives the search.",
    intro:
      "Lighthouse Point is often considered by buyers who want a quieter coastal setting and, in many cases, water-oriented living. Property evaluation should include lot, seawall, dockage, insurance, elevation, and renovation history where applicable.",
    highlights: [
      "Residential coastal setting in northern Broward County",
      "Water-oriented and non-waterfront options depending on buyer priorities",
      "Due diligence around condition, dockage, seawall, elevation, and insurance",
      "Search planning for clients who value a quieter local pace",
      "Address-specific seller review before pricing or preparation decisions",
    ],
    lifestyle:
      "Lighthouse Point is a fit for clients who want a more residential coastal feel. Mia helps clients compare water access, maintenance needs, property condition, and convenience to nearby amenities.",
    priceCharacter:
      "Use a current property-specific review. Water access, updates, lot, and condition can change the pricing story quickly.",
    latitude: 26.2756,
    longitude: -80.0875,
    heroImage: "/markets/lighthouse-point.jpg",
    // Source image: white modern estate on the left, water in the center, the
    // namesake lighthouse + sunset sky on the right. The lighthouse is what
    // makes this image distinctive vs the other waterfront markets and must
    // appear in the card crop. object-right pulls the lighthouse + sunset
    // into the portrait viewport while preserving partial estate context.
    cardObjectPosition: "object-right",
    localContext:
      "Lighthouse Point is a small Broward city north of Pompano Beach with a network of finger isles and ocean-access canals. Property evaluation hinges on the canal — bridge clearances, water depth, seawall condition, and dockage capacity vary block by block and have a larger pricing impact than square footage.",
    county: "Broward County",
    miaQuote:
      "Lighthouse Point is a small Broward city north of Pompano Beach, known for finger-isle canals with no-fixed-bridge ocean access via the Hillsboro Inlet — a defining feature for yacht-capable single-family residences.",
    aeoAnswer:
      "Lighthouse Point is a small residential city in northern Broward County north of Pompano Beach, known for a tight network of finger isles and ocean-access canals routed to the Atlantic via the Hillsboro Inlet. Many of the canals offer no-fixed-bridge access, which makes the city a recognized destination for yacht-capable single-family residences. The market is predominantly single-family, quieter than Fort Lauderdale, and centered on water — bridge clearance, dock length, and seawall condition often matter more to pricing than interior square footage. The Lighthouse Point Yacht & Racquet Club anchors the social geography for many residents.",
    propertyTypes: [
      "No-fixed-bridge deepwater single-family residences",
      "Canal-front estate homes on finger-isle blocks",
      "Renovated mid-century waterfront ranches",
      "Non-waterfront single-family on interior streets",
      "Boutique low-rise condominiums on the Intracoastal",
    ],
    buyerGuidance:
      "Lighthouse Point suits buyers who want a quieter, more residential coastal city with serious boating access. The first decision is canal selection — bridge clearance, water depth, and route to the Hillsboro Inlet vary block by block and define what kind of vessel can live at the dock. Diligence on waterfront homes focuses on seawall condition, dock pilings, lot orientation to prevailing wind, and elevation. Buyers shopping interior streets should weigh the value tradeoff carefully because most demand here is water-driven.",
    sellerGuidance:
      "Sellers in Lighthouse Point should lead with the water story — bridge clearance, dock specifics, and route to the inlet — because that is what most buyers come for. Local representation matters because canal-by-canal differences are not visible in broad estimates. Pre-list preparation typically includes seawall and dock confirmation, a clear photo of dockage at high and low tide, and a comparable-sales brief narrowed to the same canal category. The home should be presented as a specific waterfront proposition rather than a generic single-family.",
    faqs: [
      {
        question: "What makes Lighthouse Point appealing to boaters?",
        answer:
          "A high concentration of no-fixed-bridge canals routed to the Atlantic via the Hillsboro Inlet. That combination allows yacht-capable vessels to live at private docks and reach open water quickly. Many cities have waterfront; few have this density of unobstructed ocean access. It is the dominant reason buyers shop here.",
      },
      {
        question: "Are all Lighthouse Point canals deepwater and ocean-accessible?",
        answer:
          "No. Bridge clearance, water depth, and route to the inlet vary by canal. Some canals are fully ocean-accessible at any tide; others require timing or have fixed bridges that limit vessel height. Buyers focused on a specific boat should review the canal first, then the residence — not the other way around.",
      },
      {
        question: "How does Lighthouse Point compare to Fort Lauderdale waterfront?",
        answer:
          "Lighthouse Point is smaller, quieter, and more residential, with a tighter focus on the boating lifestyle. Fort Lauderdale offers a real city alongside the waterfront — downtown, beach corridor, restaurants, and a larger overall market. The choice depends on whether the priority is residential calm with serious boating, or a full-city lifestyle.",
      },
      {
        question: "Is the Lighthouse Point Yacht & Racquet Club tied to homeownership?",
        answer:
          "No. Membership at the Lighthouse Point Yacht & Racquet Club is independent of homeownership in the city. Buyers interested in club access apply separately. Mia helps clients clarify membership intentions early so the residence search and the club lifestyle goal stay aligned.",
      },
      {
        question: "What should non-waterfront buyers know about Lighthouse Point?",
        answer:
          "The interior streets offer quieter residential blocks at a different price band than the waterfront. Demand and resale are heavily water-driven, so non-waterfront buyers should expect a different pricing curve and plan diligence around lot, schools, condition, and proximity to the canals — even if they don't sit directly on water.",
      },
    ],
    internalLinks: [
      { slug: "hillsboro-mile", label: "Hillsboro Mile" },
      { slug: "sea-ranch-lakes", label: "Sea Ranch Lakes" },
      { slug: "coral-ridge", label: "Coral Ridge" },
      { slug: "bermuda-riviera", label: "Bermuda Riviera" },
    ],
  },
  {
    slug: "rio-vista",
    cluster: "neighborhood",
    name: "Rio Vista",
    tagline: "Walkable deepwater living south of Las Olas in eastern Fort Lauderdale.",
    intro:
      "Rio Vista is an eastern Fort Lauderdale waterfront neighborhood south of Las Olas across the New River, known for deepwater single-family residences with private dockage and walkable proximity to Las Olas Boulevard. Property selection here usually centers on dock specifics, lot orientation, and renovation depth.",
    highlights: [
      "Deepwater single-family residences with private dockage",
      "No-fixed-bridge ocean access via Port Everglades",
      "Walkable to Las Olas Boulevard restaurants and shops",
      "Established tree-lined streets with mid-century and renovated estate homes",
      "Property-by-property review of dock, lot, and renovation",
    ],
    lifestyle:
      "Rio Vista combines the boat-at-the-dock lifestyle with walkability to Las Olas — a rare pairing. Mia helps clients compare specific docks, lot orientation, and renovation history before scheduling showings or pricing a listing.",
    priceCharacter:
      "Pricing changes by canal, dock length, and renovation depth. Use a current property-specific review rather than a neighborhood average.",
    latitude: 26.1145,
    longitude: -80.1326,
    heroImage: "/markets/rio-vista.jpg",
    localContext:
      "Rio Vista sits south of the New River and east of Federal Highway, framed by Cordova Road and the Stranahan River corridor. The neighborhood's deepwater canals route to Port Everglades with no fixed bridges — yacht-capable access defines the buyer pool. Tree-lined interior streets and walkability to Las Olas distinguish it from larger but less walkable waterfront markets.",
    county: "Broward County",
    aeoAnswer:
      "Rio Vista is an eastern Fort Lauderdale waterfront neighborhood south of Las Olas Boulevard across the New River, known for deepwater single-family residences with private dockage and no-fixed-bridge ocean access via Port Everglades. The neighborhood combines yacht-capable canals with walkability to Las Olas Boulevard's restaurants and shops — a rare pairing in South Florida. The housing stock is established: tree-lined interior streets, mid-century waterfront residences, full-renovation estates, and contemporary new builds on tear-down lots. Buyers shop here when they want both serious boating and walkable urban access in one residence rather than choosing between the two.",
    propertyTypes: [
      "Deepwater single-family residences with private docks",
      "Mid-century waterfront ranches with renovation potential",
      "Contemporary new-build estates on canal lots",
      "Tree-lined interior streets with non-waterfront single-family",
      "Estate residences with pool, dock, and outdoor living",
    ],
    buyerGuidance:
      "Rio Vista suits buyers who want both deepwater boating and walkability to Las Olas in one residence. The first decision is canal selection — dock length, water depth, and route to Port Everglades vary by block. Diligence on waterfront homes covers seawall condition, dock pilings, lot orientation, and renovation depth. Buyers should also weigh whether the search needs a tear-down lot for new construction or a finished residence — Rio Vista trades actively in both categories, and the briefs differ.",
    sellerGuidance:
      "Sellers in Rio Vista should lead with the dock and the walkability story — yacht-capable access plus stroll-to-Las-Olas is the distinguishing pitch. Local representation matters because pricing turns on dock specifics, lot, and renovation depth that broad public estimates miss. Pre-list preparation typically includes dock and seawall confirmation, light staging tuned to a luxury single-family buyer, and a comparable-sales brief drawn narrowly from canal-similar trades rather than the neighborhood as a whole.",
    faqs: [
      {
        question: "Where is Rio Vista within Fort Lauderdale?",
        answer:
          "Rio Vista is east of Federal Highway and south of the New River, framed by Cordova Road and the Stranahan River corridor. It sits across the New River from Las Olas Boulevard — a short walk or quick drive — and the deepwater canals route to Port Everglades. The location is what makes the neighborhood unusual.",
      },
      {
        question: "Is Rio Vista a no-fixed-bridge waterfront?",
        answer:
          "Most of the deepwater canals in Rio Vista offer no-fixed-bridge ocean access via Port Everglades, which is what makes the neighborhood yacht-capable. Specifics vary by exact canal and route. Buyers focused on a particular vessel should confirm the route to open water during diligence rather than rely on neighborhood reputation.",
      },
      {
        question: "How does Rio Vista compare to Las Olas Isles?",
        answer:
          "Las Olas Isles sits north of the New River on the seven finger isles east of downtown, with a more urban-walkable Las Olas Boulevard frontage. Rio Vista sits south of the river, with established tree-lined streets and a slightly more residential feel. Both offer deepwater dockage; the choice usually comes down to neighborhood character.",
      },
      {
        question: "What property condition should buyers expect?",
        answer:
          "Rio Vista has a mix of original mid-century waterfront homes, partial renovations, full studs-out remodels, and contemporary new builds on tear-down lots. Two homes on the same canal can vary widely. A property-specific review covering dock, seawall, roof, and renovation depth is essential before relying on a price-per-foot comparison.",
      },
      {
        question: "Is Rio Vista a good fit for clients who want walkability?",
        answer:
          "Yes — that is one of the neighborhood's defining features. Most blocks are within a 10-15 minute walk to Las Olas Boulevard's restaurants, shops, and the Riverwalk extension. Buyers who want deepwater boating and walkability in one residence usually start their Fort Lauderdale waterfront search here or in Las Olas Isles.",
      },
    ],
    internalLinks: [
      { slug: "las-olas-isles", label: "Las Olas Isles" },
      { slug: "harbor-beach", label: "Harbor Beach" },
      { slug: "victoria-park", label: "Victoria Park" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
  },
  {
    slug: "harbor-beach",
    cluster: "neighborhood",
    name: "Harbor Beach",
    tagline: "Eastern Fort Lauderdale's gated ultra-luxury waterfront enclave.",
    intro:
      "Harbor Beach is an eastern Fort Lauderdale gated waterfront enclave south of Las Olas, set between Bahia Mar and the Atlantic. The neighborhood is known for ultra-luxury estate lots, deepwater dockage, and private beach club access — a small, controlled buyer pool that rewards careful representation.",
    highlights: [
      "Gated community south of Las Olas, between Bahia Mar and the Atlantic",
      "Private beach club access and deepwater dockage",
      "Large estate lots with mature landscaping",
      "Mediterranean Revival, modern, and contemporary single-family residences",
      "Small, controlled buyer pool requiring discreet representation",
    ],
    lifestyle:
      "Harbor Beach is for clients who want a private waterfront enclave with both yacht-capable dockage and oceanfront beach-club access. Mia approaches the market quietly — by relationship, brief, and current comparable sales — rather than open marketing.",
    priceCharacter:
      "Pricing reflects estate lot, dock, and architectural pedigree. Public estimates almost always understate or misread the right comparable cohort.",
    latitude: 26.1018,
    longitude: -80.114,
    heroImage: "/markets/harbor-beach.jpg",
    localContext:
      "Harbor Beach is a guard-gated coastal enclave south of Las Olas Boulevard and Bahia Mar, framed by the Intracoastal to the west and the Atlantic to the east. Residents share access to a private beach club. The combination of gate, ocean, and dockage in one neighborhood is rare in Fort Lauderdale.",
    county: "Broward County",
    aeoAnswer:
      "Harbor Beach is a guard-gated ultra-luxury enclave in eastern Fort Lauderdale, situated south of Las Olas and Bahia Mar between the Intracoastal Waterway and the Atlantic Ocean. It is known for large estate lots, Mediterranean Revival and contemporary residences, deepwater private dockage, and shared private-beach-club access — a combination of gate, dock, and ocean rare in Fort Lauderdale. The market is small, the buyer pool is controlled, and transactions often happen through relationships before reaching public listings. Architectural pedigree, lot size, and dock specifics drive pricing more than headline market trends, and representation here leans toward private and discreet rather than broad marketing.",
    propertyTypes: [
      "Mediterranean Revival waterfront estates",
      "Contemporary architect-designed waterfront residences",
      "Modern new-build estates on deepwater lots",
      "Renovated estate homes with pool, dock, and beach access",
      "Estate-scale lots with mature landscaping",
    ],
    buyerGuidance:
      "Harbor Beach suits buyers who want privacy, ocean and dock access, and an architecturally significant residence inside a small gated community. The first conversation should establish whether the priority is the dock, the architectural pedigree, the beach-club lifestyle, or all three. Diligence covers seawall and dock condition, lot orientation, renovation history, and any prior architectural review. Buyers should expect a longer search horizon and treat the neighborhood as a relationship-driven market rather than a public-listing market.",
    sellerGuidance:
      "Sellers in Harbor Beach benefit from quiet, relationship-led representation. Local representation matters because the buyer pool is small, well-known to active agents, and trades on architectural pedigree, lot, and dock specifics. Pre-list preparation often emphasizes professional architectural photography, a private comparable-sales brief, and a controlled introduction strategy that respects the gate and the buyer profile. The residence should be positioned as a specific architectural and lifestyle proposition, not as a broad luxury single-family.",
    faqs: [
      {
        question: "What distinguishes Harbor Beach from other Fort Lauderdale waterfront?",
        answer:
          "It combines a guard gate, deepwater dockage, and shared private-beach-club access in one neighborhood — a combination not found in the open finger-isle markets like Las Olas Isles or Rio Vista. The result is a controlled enclave with a smaller buyer pool and a more private transaction culture.",
      },
      {
        question: "Is the private beach club included with home ownership?",
        answer:
          "Beach-club access for Harbor Beach residents follows the community's own membership and rules, which can differ from typical private clubs. Buyers should review the current rules, fees, and access framework as part of diligence — particularly because beach-club access is a meaningful share of why buyers choose Harbor Beach.",
      },
      {
        question: "Are most Harbor Beach homes sold publicly or privately?",
        answer:
          "Many Harbor Beach transactions involve private or relationship-driven introductions before, or instead of, broad public marketing. The neighborhood's gate and the small buyer pool make discreet representation common. A clearly written brief is what enables the right introduction at the right moment.",
      },
      {
        question: "What architectural styles dominate Harbor Beach?",
        answer:
          "The neighborhood includes Mediterranean Revival, contemporary architect-designed residences, and modern new builds. Lot size and renovation depth vary; estate-scale lots with mature landscaping are common. Buyers comparing residences should evaluate the architectural era as a primary factor, not a secondary one.",
      },
      {
        question: "How does Mia approach Harbor Beach representation?",
        answer:
          "Quietly, by brief and relationship, with a comparable-sales packet drawn from the right architectural cohort. Whether buying or selling, the goal is a small set of qualified, prepared candidates rather than a public open market — which respects both the gate and the buyer profile this neighborhood attracts.",
      },
    ],
    internalLinks: [
      { slug: "rio-vista", label: "Rio Vista" },
      { slug: "las-olas-isles", label: "Las Olas Isles" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
      { slug: "bay-colony", label: "Bay Colony" },
      { slug: "bermuda-riviera", label: "Bermuda Riviera" },
    ],
    comparisonContext:
      "Harbor Beach is the canonical Eastern Fort Lauderdale gated trophy estate brief — deepwater dockage, private security, and a private beach-club component. Buyers usually compare Bay Colony for the alternate gated single-entry deepwater enclave (different architectural era, no beach-club), Las Olas Isles or Rio Vista for the deepwater walkable alternatives without the gate, Fort Lauderdale for the broader anchor-city option, and Bermuda Riviera for the mid-century-modern quieter waterfront alternative. The right Harbor Beach shortlist depends on whether the gate, the beach club, the dockage, or the architectural era is the dominant priority.",
  },
  {
    slug: "las-olas-isles",
    cluster: "neighborhood",
    name: "Las Olas Isles",
    tagline: "The seven finger isles east of downtown Fort Lauderdale, walkable to Las Olas Boulevard.",
    intro:
      "Las Olas Isles is the residential isles district east of downtown Fort Lauderdale — seven finger isles framed between Las Olas Boulevard and the Intracoastal. The market is known for deepwater dockage, walkability to Las Olas, and a layered mix of mid-century cottages, contemporary new builds, and trophy estates.",
    highlights: [
      "Seven finger isles between Las Olas Boulevard and the Intracoastal",
      "Deepwater dockage with no-fixed-bridge access via Port Everglades",
      "Walkable to Las Olas Boulevard restaurants, galleries, and shops",
      "Mix of mid-century, contemporary new-build, and trophy estates",
      "Block-by-block character and dockage variation",
    ],
    lifestyle:
      "Las Olas Isles is for clients who want both a yacht-capable dock and walkability to one of South Florida's most active boulevards. Mia helps clients sort across the seven isles, where each block has its own micro-market dynamic.",
    priceCharacter:
      "Pricing turns on the specific isle, dock length, water orientation, and architectural era. Public estimates rarely capture the right cohort.",
    latitude: 26.1217,
    longitude: -80.117,
    heroImage: "/markets/las-olas-isles.jpg",
    localContext:
      "Las Olas Isles refers to the residential finger isles east of downtown Fort Lauderdale — Hendricks Isle, Isle of Venice, Royal Palm Isle, Isle of Capri, Nurmi Isle, Solar Isle, and the Aqua Vista Boulevards section. The isles share a Las Olas spine with restaurants and shops; they differ block-by-block in dockage, architectural era, and street character.",
    county: "Broward County",
    aeoAnswer:
      "Las Olas Isles is the residential isles district east of downtown Fort Lauderdale — the seven finger isles between Las Olas Boulevard and the Intracoastal, including Hendricks Isle, Isle of Venice, Royal Palm Isle, Isle of Capri, Nurmi Isle, Solar Isle, and the Aqua Vista Boulevards section. The market is known for deepwater dockage with no-fixed-bridge access via Port Everglades, walkability to Las Olas Boulevard's restaurants and shops, and a layered architectural mix from mid-century cottages through contemporary new builds to trophy estates. Each isle trades as its own micro-market — block-by-block dockage, lot orientation, and architectural era matter more than a district-level average.",
    propertyTypes: [
      "Trophy waterfront estates with yacht-capable dockage",
      "Contemporary architect-designed new builds",
      "Mid-century cottages on smaller isle lots",
      "Renovated waterfront residences with pool and dock",
      "Tear-down opportunities on prime isle lots",
    ],
    buyerGuidance:
      "Las Olas Isles suits buyers who want yacht-capable dockage with walkable urban access in eastern Fort Lauderdale. The first decision is which isle — each has its own street width, dockage range, and architectural mix. Diligence on waterfront homes covers seawall condition, dock pilings, bridge clearance to the inlet, lot orientation, and renovation depth. Buyers should also clarify whether the search wants a finished residence or a tear-down lot for new construction, because both trade actively here and the briefs are different.",
    sellerGuidance:
      "Sellers in Las Olas Isles should lead with the specific isle, the dock, and the walkability — district-level averages will mislead buyers who already know the differences. Local representation matters because the buyer pool actively compares against Rio Vista, Harbor Beach, and Coral Ridge, and the listing brief should anticipate those comparisons. Pre-list preparation typically emphasizes professional photography that captures the dock at high tide, a comparable-sales brief drawn from the same isle, and a clear architectural framing for the residence's era.",
    faqs: [
      {
        question: "Which isles make up Las Olas Isles?",
        answer:
          "The seven finger isles between Las Olas Boulevard and the Intracoastal include Hendricks Isle, Isle of Venice, Royal Palm Isle, Isle of Capri, Nurmi Isle, Solar Isle, and the Aqua Vista Boulevards section. Each isle has its own street width, lot pattern, dockage range, and architectural mix, and each trades as its own micro-market.",
      },
      {
        question: "Is dockage typically deepwater and yacht-capable?",
        answer:
          "Most Las Olas Isles canals offer deepwater no-fixed-bridge access to the Atlantic via Port Everglades, supporting yacht-capable vessels at private docks. Specifics vary by isle and lot orientation. Buyers focused on a particular boat should confirm dock length, water depth, and route to the inlet during diligence rather than rely on district reputation.",
      },
      {
        question: "Do the isles share a single architectural style?",
        answer:
          "No. Mid-century cottages, contemporary architect-designed residences, full-renovation estates, and trophy new builds coexist on most isles. The architectural mix is part of the appeal but means a residence search needs a clear preference for era and condition, not just location, to be efficient.",
      },
      {
        question: "How walkable is Las Olas Isles to Las Olas Boulevard?",
        answer:
          "Most isles are within a 5-15 minute walk to Las Olas Boulevard's restaurants, galleries, and shops. Hendricks Isle and the inner isles tend to be closest; the outer isles add a few minutes. Walkability plus deepwater dockage in one residence is a defining feature of the district.",
      },
      {
        question: "How does Las Olas Isles compare to Rio Vista?",
        answer:
          "Rio Vista sits south of the New River with established tree-lined streets and a more residential feel. Las Olas Isles sits north on the finger isles with closer Las Olas Boulevard frontage and a more urban-walkable feel. Both offer deepwater dockage; the choice usually comes down to neighborhood character and architectural preference.",
      },
    ],
    internalLinks: [
      { slug: "seven-isles", label: "Seven Isles" },
      { slug: "rio-vista", label: "Rio Vista" },
      { slug: "harbor-beach", label: "Harbor Beach" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
      { slug: "bay-colony", label: "Bay Colony" },
      { slug: "bermuda-riviera", label: "Bermuda Riviera" },
    ],
    comparisonContext:
      "Las Olas Isles is the canonical Eastern Fort Lauderdale deepwater isles brief — finger isles north of the New River with yacht-capable canals and walkable Las Olas Boulevard frontage. Buyers usually compare Seven Isles for the deepwater-yacht subset, Rio Vista for the more residential walkable alternative south of the river, Harbor Beach for the gated trophy alternative with a beach-club component, Bay Colony for the gated single-entry alternative without the walkability, and Bermuda Riviera for the mid-century-modern quieter waterfront alternative. The right Las Olas Isles shortlist depends on whether walkability, vessel size, or architectural era is the priority.",
  },
  {
    slug: "seven-isles",
    cluster: "neighborhood",
    name: "Seven Isles",
    tagline: "The deepwater yacht-capable finger isles east of downtown Fort Lauderdale.",
    intro:
      "Seven Isles refers to the deepwater finger isles east of downtown Fort Lauderdale framed for the yacht-capable, ocean-access narrative. The market overlaps geographically with Las Olas Isles but is shopped by buyers focused specifically on the boat, the dock, and the route to open water.",
    highlights: [
      "Seven named finger isles east of downtown Fort Lauderdale",
      "Deepwater dockage with no-fixed-bridge access via Port Everglades",
      "Yacht-capable lots that trade on dock specifics and route to inlet",
      "Architect-designed contemporary new builds and renovated estates",
      "Buyer pool focused on the boat and the dock as primary drivers",
    ],
    lifestyle:
      "Seven Isles is for clients shopping specifically for an ocean-access yacht-capable residence. Mia helps clients evaluate dock length, bridge clearance, water depth, and the route to Port Everglades before evaluating the residence itself.",
    priceCharacter:
      "Pricing on Seven Isles trades on dock and lot specifics. Two residences on the same isle can vary materially based on dock capacity and orientation.",
    latitude: 26.1212,
    longitude: -80.1162,
    heroImage: "/markets/seven-isles.jpg",
    localContext:
      "Seven Isles describes the same geographic core as Las Olas Isles — Hendricks, Venice, Royal Palm, Capri, Nurmi, Solar, and Aqua Vista — but framed for buyers shopping specifically on yacht-capable deepwater access rather than walkability or architectural mix. The lens narrows to the dock and the canal route to Port Everglades.",
    county: "Broward County",
    aeoAnswer:
      "Seven Isles refers to the seven named finger isles east of downtown Fort Lauderdale — Hendricks Isle, Isle of Venice, Royal Palm Isle, Isle of Capri, Nurmi Isle, Solar Isle, and the Aqua Vista Boulevards section — viewed through the lens of deepwater yacht-capable real estate. The geography overlaps with Las Olas Isles, but the framing differs: buyers shopping Seven Isles tend to lead with the boat, the dock, and the no-fixed-bridge route to Port Everglades. The market trades on dock length, water depth, bridge clearance, and lot orientation, with the residence itself often a secondary consideration to the waterfront infrastructure that supports a serious vessel.",
    propertyTypes: [
      "Deepwater yacht-capable single-family residences",
      "Contemporary architect-designed waterfront new builds",
      "Renovated estate residences with extended dockage",
      "Tear-down lots prized for the dock and water orientation",
      "Trophy estates with mega-yacht-capable dockage",
    ],
    buyerGuidance:
      "Seven Isles suits buyers whose primary brief is the boat — vessel size, water depth at the dock, route to the Atlantic, and dock infrastructure (pilings, shore power, fuel, lifts where present). The residence comes second. Diligence covers dock length, water depth, seawall condition, bridge clearance to Port Everglades, and lot orientation to prevailing wind. Buyers shopping a specific yacht should walk the dock at low tide and confirm the route to open water before committing to the residence above the dock.",
    sellerGuidance:
      "Sellers on Seven Isles should lead with the dock — length, water depth, capacity, route to the inlet, and any yacht-capacity history. Local representation matters because pricing turns on dock specifics that broad public estimates miss. Pre-list preparation often includes documented dock dimensions and water-depth soundings, professional photography of the residence and dock at high tide, and a comparable-sales brief drawn from same-isle yacht-capacity-similar trades. The residence should be positioned as the yacht's primary infrastructure, not just a single-family home.",
    faqs: [
      {
        question: "How does Seven Isles differ from Las Olas Isles?",
        answer:
          "Geographically, they describe the same seven finger isles east of downtown Fort Lauderdale. The framing differs: Seven Isles is the lens for buyers shopping specifically on yacht-capable deepwater access, while Las Olas Isles is the broader district view that also weighs walkability and architectural mix. The isles are the same; the buyer brief shapes which lens fits.",
      },
      {
        question: "What dock specifics matter most to Seven Isles buyers?",
        answer:
          "Dock length, water depth at the dock, bridge clearance to Port Everglades, the route to open water, and dock infrastructure such as pilings, shore power, and lifts where present. Two homes on the same isle can support very different vessels depending on these specifics, and that difference shows up in pricing.",
      },
      {
        question: "Is the route to the Atlantic always no-fixed-bridge?",
        answer:
          "Most Seven Isles canals route to the Atlantic via Port Everglades with no fixed bridges in the way, which is why the district supports yacht-capable vessels. Specifics vary by exact starting canal and tide. Buyers shopping a specific boat should confirm the route and any height or width constraints during diligence.",
      },
      {
        question: "Do Seven Isles residences trade differently than Las Olas Isles residences?",
        answer:
          "The same residences appear in both lenses, but the buyer pool differs. A walkability-first buyer may pay a premium for a less yacht-optimized residence close to Las Olas Boulevard. A boat-first buyer may pay a premium for an extended dock on a less walkable lot. The lens explains why two seemingly similar residences can trade differently.",
      },
      {
        question: "Should sellers list as Seven Isles or Las Olas Isles?",
        answer:
          "Both. The residence is on a named isle and is part of Las Olas Isles district. The yacht-capable framing belongs in the listing narrative when the dock supports it, with documented dock dimensions and water depth. Mia tunes the presentation so the residence reaches both lenses without overstating either.",
      },
    ],
    internalLinks: [
      { slug: "las-olas-isles", label: "Las Olas Isles" },
      { slug: "rio-vista", label: "Rio Vista" },
      { slug: "harbor-beach", label: "Harbor Beach" },
    ],
  },
  {
    slug: "sea-ranch-lakes",
    cluster: "primary",
    name: "Sea Ranch Lakes",
    tagline: "A small private gated coastal village in northern Broward.",
    intro:
      "Sea Ranch Lakes is a small private gated coastal village in northern Broward County between Lauderdale-by-the-Sea and Lighthouse Point. The community is predominantly single-family with private beach club access, a quiet residential pace, and a tightly held resale market.",
    highlights: [
      "Private gated village with controlled access",
      "Predominantly single-family residential",
      "Private beach club access for residents",
      "Quiet residential pace between Lauderdale-by-the-Sea and Lighthouse Point",
      "Tightly held resale market with limited inventory",
    ],
    lifestyle:
      "Sea Ranch Lakes is for clients who want a private, quiet coastal village where days run on a residential rhythm. Mia approaches the market with patience — inventory is limited and the right opportunity often emerges through relationship rather than open listing.",
    priceCharacter:
      "Pricing reflects the private-village setting and beach-club access. Inventory is limited; current comparable sales matter more than any broad average.",
    latitude: 26.201,
    longitude: -80.0945,
    heroImage: "/markets/sea-ranch-lakes.jpg",
    localContext:
      "Sea Ranch Lakes is a guard-gated village along A1A in northern Broward County, framed between Lauderdale-by-the-Sea to the south and Lighthouse Point to the west. The community shares a private beach club. The mix is predominantly single-family on residential streets, distinct from the surrounding A1A condominium corridor.",
    county: "Broward County",
    aeoAnswer:
      "Sea Ranch Lakes is a small private guard-gated village along A1A in northern Broward County, located between Lauderdale-by-the-Sea and Lighthouse Point. The community is known for predominantly single-family residences on quiet residential streets, shared private-beach-club access, and a tightly controlled resale market. The village's defining feature is its scale — it is small enough that the buyer pool is well known to active local representation, and inventory is limited enough that the right opportunity often surfaces through relationship before public marketing. Sea Ranch Lakes appeals to buyers who want privacy and a residential coastal pace rather than a high-rise or downtown lifestyle.",
    propertyTypes: [
      "Single-family residences on residential village streets",
      "Renovated mid-century coastal homes",
      "Larger estate homes on interior lots",
      "Residences with pool and outdoor living",
      "Tear-down lots prized for the village setting",
    ],
    buyerGuidance:
      "Sea Ranch Lakes suits buyers who want a private, quiet, residential coastal village with shared beach-club access. Inventory is limited, so patience and a clearly written brief matter more than rushing the search. Diligence on residences focuses on renovation depth, roof age, hurricane impact protection, lot orientation, and elevation. Buyers should expect a longer search horizon than larger markets and treat the community as a relationship-driven inventory rather than an open-listing one.",
    sellerGuidance:
      "Sellers in Sea Ranch Lakes benefit from quiet, relationship-led representation given the village's small scale and controlled buyer pool. Local representation matters because the right buyer often appears through introduction rather than broad public marketing. Pre-list preparation typically emphasizes professional photography that captures the village setting, a comparable-sales brief drawn from inside the gate, and an introduction strategy that respects the community's residential character. The residence should be positioned to its specific village context, not as generic coastal Broward.",
    faqs: [
      {
        question: "Where exactly is Sea Ranch Lakes?",
        answer:
          "Sea Ranch Lakes is along A1A in northern Broward County, framed between Lauderdale-by-the-Sea to the south and Lighthouse Point to the west. The village sits east of the Intracoastal and is guard-gated. The location places it within easy reach of Pompano Beach, Hillsboro Beach, and the broader north-Broward coastal corridor.",
      },
      {
        question: "Is the private beach club tied to homeownership?",
        answer:
          "Beach-club access for Sea Ranch Lakes residents follows the village's own membership and rules, which can differ from typical private clubs. Buyers should review the current rules, fees, and access framework as part of diligence — particularly because the beach-club access is a meaningful share of why buyers choose the village.",
      },
      {
        question: "How limited is Sea Ranch Lakes inventory?",
        answer:
          "Very. The village is small and tightly held. In a given quarter, only a handful of residences may be available — sometimes none publicly. Buyers should expect a longer search horizon and consider expressing interest through representation that can surface upcoming opportunities before they reach broad listing.",
      },
      {
        question: "How does Sea Ranch Lakes compare to Lighthouse Point?",
        answer:
          "Lighthouse Point is larger, with a focus on canal-front yacht-capable single-family residences. Sea Ranch Lakes is smaller, more village-scaled, and focused on a private gated coastal residential setting with beach-club access rather than canal dockage. The two attract different buyer profiles even though they sit minutes apart.",
      },
      {
        question: "How does Mia approach Sea Ranch Lakes representation?",
        answer:
          "Patiently and by relationship. Whether buying or selling, the goal is a clearly written brief that aligns with the village's residential character and a comparable-sales packet drawn from inside the gate. Open marketing has a smaller role here than in larger Broward markets — discreet introductions usually do more work.",
      },
    ],
    internalLinks: [
      { slug: "lighthouse-point", label: "Lighthouse Point" },
      { slug: "hillsboro-mile", label: "Hillsboro Mile" },
    ],
  },
  {
    slug: "hillsboro-mile",
    // Cycle 18 — moved from cluster:"primary" to a dedicated Northern Broward
    // waterfront cluster. Hillsboro Mile is the A1A corridor through the town
    // of Hillsboro Beach (NOT Fort Lauderdale, NOT a primary city/town the way
    // FtLaud / Boca / Palm Beach / Delray / Lighthouse Point / Pompano Beach
    // are). Geography is preserved (Broward County) but the /markets/ index
    // section #2 is renamed to "Fort Lauderdale Waterfront and Northern
    // Broward Clusters" so the visual grouping makes sense without claiming
    // Hillsboro Mile is Fort Lauderdale.
    // See docs/CYCLE_18_HILLSBORO_MILE_MARKET_TAXONOMY_FIX.md.
    cluster: "northern-broward-waterfront",
    name: "Hillsboro Mile",
    tagline: "The A1A oceanfront and Intracoastal corridor in Hillsboro Beach.",
    intro:
      "Hillsboro Mile is a roughly three-mile A1A corridor in Hillsboro Beach, northern Broward County, running from the Hillsboro Inlet south to Deerfield Beach. The market is known for oceanfront estates, Intracoastal-side residences with deep-water dockage, and no-fixed-bridge access to the Atlantic via the Hillsboro Inlet.",
    highlights: [
      "A1A corridor running approximately three miles in Hillsboro Beach",
      "Oceanfront estates east of A1A",
      "Intracoastal-side single-family residences with deep-water dockage",
      "No-fixed-bridge ocean access via the Hillsboro Inlet",
      "Quieter, low-density coastal setting in northern Broward County",
    ],
    lifestyle:
      "Hillsboro Mile is for clients who want oceanfront or yacht-capable Intracoastal living with a quieter, low-density feel. Mia helps clients sort east-versus-west of A1A and the canal-by-canal differences along the Intracoastal side.",
    priceCharacter:
      "Pricing depends on whether the residence is oceanfront, A1A-adjacent, or Intracoastal-side, plus dock specifics. A property-specific review beats any corridor average.",
    latitude: 26.2828,
    longitude: -80.0801,
    heroImage: "/markets/hillsboro-mile.jpg",
    localContext:
      "Hillsboro Mile is the A1A corridor through Hillsboro Beach, framed by the Hillsboro Inlet to the north and Deerfield Beach to the south. East of A1A sits oceanfront residential; west of A1A sits Intracoastal-side residential, often with private dockage and ocean access via the inlet. The corridor is low-density and quieter than the surrounding cities.",
    county: "Broward County",
    aeoAnswer:
      "Hillsboro Mile is a roughly three-mile A1A corridor through Hillsboro Beach in northern Broward County, running from the Hillsboro Inlet south to Deerfield Beach. The market is known for oceanfront estates east of A1A, Intracoastal-side single-family residences with deep-water private dockage west of A1A, and no-fixed-bridge ocean access via the Hillsboro Inlet. The corridor is low-density and quieter than surrounding cities, with a residential rather than commercial character. Buyers compare oceanfront versus Intracoastal-side based on whether the priority is the beach view or the boat at the dock — the two trade as related but distinct micro-markets.",
    propertyTypes: [
      "Oceanfront single-family estates east of A1A",
      "Oceanfront condominium buildings along A1A",
      "Intracoastal-side single-family residences with private dockage",
      "Estate homes with pool and outdoor living",
      "Tear-down lots prized for ocean or Intracoastal frontage",
    ],
    buyerGuidance:
      "Hillsboro Mile suits buyers who want oceanfront or yacht-capable Intracoastal living in a low-density coastal corridor. The first decision is east versus west of A1A — oceanfront and Intracoastal-side trade differently. Diligence on oceanfront homes covers dune line, hurricane exposure, elevation, and any coastal construction control line considerations. Diligence on Intracoastal-side homes covers seawall, dock pilings, bridge clearance through the inlet, and lot orientation. Buyers focused on a specific vessel should review the dock and the route to the Atlantic before committing.",
    sellerGuidance:
      "Sellers on Hillsboro Mile should position the residence to its exact corridor segment — oceanfront, A1A-adjacent condominium, or Intracoastal-side single-family — and to the buyer pool that shops there. Local representation matters because the corridor's micro-markets diverge quickly across A1A. Pre-list preparation typically includes documentation of any coastal-construction or dock approvals where relevant, professional photography that captures both the residence and its waterfront frontage, and a comparable-sales brief drawn narrowly from the same corridor segment.",
    faqs: [
      {
        question: "What is the Hillsboro Mile geographically?",
        answer:
          "Hillsboro Mile is a roughly three-mile A1A corridor through the town of Hillsboro Beach in northern Broward County. It runs from the Hillsboro Inlet at the north end south to Deerfield Beach. East of A1A is oceanfront; west of A1A is Intracoastal-side. The corridor is residential, low-density, and quieter than surrounding cities.",
      },
      {
        question: "Is Intracoastal-side ocean access yacht-capable?",
        answer:
          "Many Intracoastal-side canals along Hillsboro Mile route to the Atlantic via the Hillsboro Inlet with no fixed bridges, supporting yacht-capable vessels. Specifics vary by lot and route. Buyers focused on a particular boat should confirm dock dimensions, water depth, and the route to open water during diligence rather than rely on corridor reputation.",
      },
      {
        question: "How does Hillsboro Mile compare to Lighthouse Point?",
        answer:
          "Lighthouse Point is a larger interior city with a denser network of finger-isle canals. Hillsboro Mile is a linear A1A corridor with both oceanfront and Intracoastal-side residences. Buyers wanting a beach view often lean Hillsboro Mile; buyers wanting a tighter neighborhood of canal-front single-families often lean Lighthouse Point. The two are minutes apart.",
      },
      {
        question: "What should oceanfront buyers know about diligence?",
        answer:
          "Oceanfront residences carry specific considerations: dune line, hurricane exposure, elevation, the Florida coastal construction control line, insurance, and roof condition. Renovation can require state and local approvals beyond a typical interior project. A clear understanding of these constraints early prevents surprises and informs the right comparable-sales cohort.",
      },
      {
        question: "Are there condominium options on Hillsboro Mile?",
        answer:
          "Yes. The corridor includes a number of A1A oceanfront condominium buildings alongside the single-family residences. Buyers comparing condominium options should focus on reserves, milestone-inspection status, hurricane and salt-air maintenance history, and rental rules — these vary meaningfully across the buildings on the corridor.",
      },
    ],
    internalLinks: [
      { slug: "lighthouse-point", label: "Lighthouse Point" },
      { slug: "sea-ranch-lakes", label: "Sea Ranch Lakes" },
      // Cycle 18 — added Pompano Beach as the South Florida cities/towns peer
      // immediately south on the mainland from the Hillsboro Inlet.
      { slug: "pompano-beach", label: "Pompano Beach" },
    ],
  },
  /**
   * Cycle 18 — Pompano Beach added as a primary South Florida cities-and-towns
   * market. All facts trace to the Cycle 18 source ledger
   * (docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md), specifically
   * Sources B1-B13 (City of Pompano Beach, CRA, Parks, Comprehensive Plan,
   * Florida DEP Coral ECA, Shipwreck Park, US Census, Broward GeoHub).
   * Hedges in this entry preserve the operator's "no overclaim" rules:
   *   - Pier length: described as "approximately 1,000 feet (the City CRA
   *     Pier Development page describes the renovated structure as 'over 900
   *     feet')". No marketing rounding.
   *   - "Wreck Capital of Florida" tourism marketing label NOT used.
   *   - Hillsboro Inlet Lighthouse always qualified as Hillsboro Beach, not
   *     Pompano Beach.
   *   - "Pompano Beach is luxury-only" — NOT claimed.
   *   - "Pompano Beach is part of Fort Lauderdale" — NOT claimed.
   *   - Marina counts: framed as "per the City's Coastal Zone Comprehensive
   *     Plan element" rather than as live current capacity.
   */
  {
    slug: "pompano-beach",
    cluster: "primary",
    name: "Pompano Beach",
    tagline:
      "A northern Broward beach city with deepwater boating, redeveloped pier district, and offshore reef.",
    intro:
      "Pompano Beach is a northeastern Broward city framed by Lauderdale-by-the-Sea to the south and Hillsboro Beach to the north. The market pairs a public beachfront and the redeveloped Fisher Family Pier with deepwater Intracoastal residences and an active offshore reef-dive corridor — at relative value to Fort Lauderdale and Boca Raton.",
    highlights: [
      "Northeastern Broward city of approximately 25 square miles",
      "Roughly three-mile public beachfront from A1A near Terra Mar Drive to the Hillsboro Inlet",
      "Fisher Family Pier — dedicated April 2022 — and the six-acre Pompano Beach Fishing Village in the East CRA District",
      "Active East and Northwest CRA redevelopment districts (downtown Atlantic Boulevard / Old Town / Civic Commons)",
      "Offshore waters within the state-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area",
    ],
    lifestyle:
      "Pompano Beach suits buyers who want Atlantic beach access, deepwater boating, an active reef-and-wreck dive scene, and a city visibly investing in its oceanfront and downtown — at relative value to its neighbors. Mia helps clients sort A1A-corridor condominium versus Intracoastal-side single-family versus inland canal options, and frames the comparison honestly against Fort Lauderdale, Lighthouse Point, Hillsboro Mile, and the Palm Beach County markets to the north.",
    priceCharacter:
      "Pricing depends on whether the residence is oceanfront condominium, A1A-adjacent, Intracoastal-side single-family, inland canal, or interior. A property-specific review beats a corridor average; the city's residential mix is broader than the marketing labels suggest.",
    latitude: 26.2378,
    longitude: -80.0998,
    heroImage: "/markets/pompano-beach.jpg",
    localContext:
      "Pompano Beach sits in northeastern Broward County, with mainland borders shared with Lighthouse Point, Deerfield Beach, and Fort Lauderdale; on the barrier island it is framed by Lauderdale-by-the-Sea to the south and Hillsboro Beach to the north. The historic Hillsboro Inlet Lighthouse stands on the Hillsboro Beach side of the inlet, with its museum on the Pompano Beach side at Hillsboro Inlet Park. Per the City's Coastal Zone Comprehensive Plan element, the coastal study area includes four marinas with 100 wet slips, dry storage around Lake Santa Barbara and NE 16th Street, and three public boat ramps at William J. Alsdorf Park.",
    county: "Broward County",
    aeoAnswer:
      "Pompano Beach is a northeastern Broward city of approximately 25 square miles, framed on the barrier island by Lauderdale-by-the-Sea to the south and Hillsboro Beach to the north. The market is known for a roughly three-mile public beachfront, the rebuilt Fisher Family Pier (dedicated April 2022), and the six-acre Pompano Beach Fishing Village in the East CRA District. Deepwater Intracoastal residences and an active reef-and-wreck dive corridor round out the waterfront profile; Florida DEP's state-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area runs offshore. The East and Northwest CRA districts are visibly reshaping Atlantic Boulevard and Old Town. The market trades at relative value to Fort Lauderdale, Lighthouse Point, and the Palm Beach County markets to the north.",
    propertyTypes: [
      "Oceanfront and beach-corridor condominiums along A1A",
      "Intracoastal-side single-family residences with private dockage",
      "Inland canal homes routed to the Intracoastal and the Hillsboro Inlet",
      "Mainland single-family residences in established interior neighborhoods",
      "Downtown Atlantic Boulevard / Old Town redevelopment-area residences",
    ],
    buyerGuidance:
      "Buyers here usually start with one of four briefs: A1A-corridor condominium, Intracoastal-side single-family with private dockage, inland canal routed to the Hillsboro Inlet, or interior single-family. The first conversation establishes which. Waterfront diligence covers seawall, dock, bridge clearance, and route to the Hillsboro Inlet — for canals farther south, the Port Everglades vector applies. Condominium diligence covers reserves, milestone-inspection status, salt-air and hurricane maintenance history, and rental rules. Buyers shopping the redevelopment corridor weigh CRA timelines and the construction context of the immediate block.",
    sellerGuidance:
      "Sellers in Pompano Beach should position the residence to its specific corridor segment — oceanfront condominium, A1A-adjacent, Intracoastal-side single-family, inland canal, or interior — and to the buyer pool that shops there. Local representation matters because the city's micro-markets diverge quickly across A1A and across the canal-system boundaries; a residence priced against the wrong cohort underperforms. Pre-list preparation typically includes documentation of dock and seawall (for waterfront), milestone-inspection and reserve status (for condominium), and a comparable-sales packet drawn from the same corridor segment. Photography and narrative should emphasize the buyer-specific lifestyle — boating, reef diving, walkable beachfront, or downtown redevelopment access — rather than a generic luxury frame.",
    faqs: [
      {
        question: "Where is Pompano Beach geographically?",
        answer:
          "Pompano Beach is in northeastern Broward County. On the barrier island it is framed by Lauderdale-by-the-Sea to the south and Hillsboro Beach to the north; on the mainland it borders Lighthouse Point, Deerfield Beach, and Fort Lauderdale. It is approximately 25 square miles. It is a separate municipality with its own government — not part of Fort Lauderdale.",
      },
      {
        question: "What is the Pompano Beach Pier?",
        answer:
          "The Fisher Family Pier was rebuilt as part of the City CRA Pier Development program and dedicated April 2, 2022 — elevated for sea-level resilience, with doubled width, overhead sails, and marine artwork. The City describes the pier as approximately 1,000 feet long; the CRA Pier Development page describes the renovated structure as over 900 feet. It is open daily from 7 a.m. to 10 p.m. and anchors the six-acre Pompano Beach Fishing Village.",
      },
      {
        question: "How does Pompano Beach compare to Fort Lauderdale and Boca Raton for luxury or waterfront buyers?",
        answer:
          "Fort Lauderdale anchors the broader yachting and finger-isle waterfront cohort to the south, with a working downtown and beach corridor. Boca Raton, in Palm Beach County, anchors the country-club and Mizner-pedigree cohort to the north. Pompano Beach sits between the two and trades at relative value — with strong Atlantic beach access, deepwater Intracoastal residences, an active redevelopment corridor, and the offshore reef-and-wreck scene as a distinguishing lifestyle anchor.",
      },
      {
        question: "Is Pompano Beach a serious boating market?",
        answer:
          "Yes. Per the City's Coastal Zone Comprehensive Plan element, the coastal study area includes four marinas with 100 wet slips, dry storage capacity around Lake Santa Barbara and NE 16th Street, and three public boat ramps at William J. Alsdorf Park. Many Intracoastal-side residences and inland-canal homes route to the Atlantic via the Hillsboro Inlet. Buyers focused on a particular vessel should confirm dock dimensions, water depth, and the route to open water during diligence rather than rely on city-wide reputation.",
      },
      {
        question: "What about the offshore coral reef and dive sites?",
        answer:
          "Offshore waters of Broward County, including those off Pompano Beach, fall within the state-designated Kristin Jacobs Coral Reef Ecosystem Conservation Area, a roughly 105-mile coral reef tract managed by Florida DEP's Coral Reef Conservation Program (renamed in 2021 to honor the late State Representative Kristin Jacobs). The City also funds Shipwreck Park, a 501(c)(3) nonprofit creating an artificial-reef and underwater-art system at sites including Wahoo Bay, Lady Luck, and Okinawa. The reef-and-wreck dive scene is a distinguishing lifestyle anchor for Pompano Beach buyers.",
      },
    ],
    internalLinks: [
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
      { slug: "lighthouse-point", label: "Lighthouse Point" },
      { slug: "hillsboro-mile", label: "Hillsboro Mile" },
      { slug: "boca-raton", label: "Boca Raton" },
      { slug: "delray-beach", label: "Delray Beach" },
    ],
    comparisonContext:
      "Pompano Beach is the relative-value beach-and-boating peer in northern Broward, framed by Lighthouse Point and Hillsboro Mile to the north and the Fort Lauderdale waterfront cohort to the south. Buyers usually compare three vectors: Fort Lauderdale for the working-city alongside deepwater living; Lighthouse Point for the dense canal-finger-isle alternative routed to the Hillsboro Inlet; Hillsboro Mile for the linear A1A corridor; and Boca Raton or Delray Beach to the north for the country-club / walkable-Atlantic-Avenue alternatives in Palm Beach County. The right Pompano Beach brief usually centers on whether the priority is beach-corridor condominium, deepwater Intracoastal single-family, the redevelopment corridor, or the offshore-reef lifestyle.",
  },
  {
    slug: "bay-colony",
    cluster: "neighborhood",
    name: "Bay Colony",
    tagline: "Eastern Fort Lauderdale's gated deepwater enclave off Bayview Drive.",
    intro:
      "Bay Colony is a gated single-entry waterfront community in eastern Fort Lauderdale, accessed off Bayview Drive between Sunrise Boulevard and Oakland Park Boulevard. The neighborhood is known for estate-scale homes on private deepwater canals, a controlled buyer pool, and a quiet residential character that distinguishes it from the more public Las Olas finger-isle markets.",
    highlights: [
      "Gated single-entry community accessed off Bayview Drive",
      "Estate-scale waterfront residences on private deepwater canals",
      "Intracoastal Waterway and ocean access via the inlet",
      "Established mature landscaping, low-traffic interior streets",
      "Small, controlled buyer pool — quiet, relationship-driven trades",
    ],
    lifestyle:
      "Bay Colony is for clients who want privacy, deepwater dockage, and a small gated community where day-to-day life is residential rather than public-facing. Mia approaches the neighborhood through brief and relationship rather than open marketing — the buyer pool is small enough that the right introduction matters more than broad exposure.",
    priceCharacter:
      "Pricing reflects the gate, the dock, and the architectural era of the residence. Public estimates rarely model the controlled-access premium, the dock specifics, or the right comparable cohort.",
    latitude: 26.1505,
    longitude: -80.1078,
    heroImage: "/markets/bay-colony.jpg",
    localContext:
      "Bay Colony sits in eastern Fort Lauderdale off Bayview Drive between Sunrise Boulevard and Oakland Park Boulevard, with a single guarded entry and private interior streets. Its deepwater canals route to the Intracoastal Waterway and onward to ocean access via the inlet. The combination of a security gate, deepwater dockage, and an estate-scale lot pattern is uncommon in Fort Lauderdale's eastern waterfront cohort.",
    county: "Broward County",
    aeoAnswer:
      "Bay Colony is a gated waterfront community in eastern Fort Lauderdale, accessed via a single guarded entry off Bayview Drive between Sunrise Boulevard and Oakland Park Boulevard. The neighborhood is known for estate-scale single-family residences on private deepwater canals, a controlled buyer pool, and Intracoastal access onward to the ocean. Architectural pedigree, lot, and dock specifics drive pricing more than headline market trends, and transactions often happen through relationships before reaching public listings. The character is residential and quiet by design — the gate, the canal frontage, and the interior cul-de-sac pattern create a different daily-life feel than the more public finger-isle markets to the south.",
    propertyTypes: [
      "Estate-scale waterfront single-family residences on deepwater canals",
      "Mediterranean Revival and contemporary architect-designed estates",
      "Modern new-build estates on tear-down lots",
      "Renovated estate homes with pool, dock, and outdoor living",
      "Interior cul-de-sac residences inside the community gate",
    ],
    buyerGuidance:
      "Bay Colony suits buyers who value privacy, deepwater dockage, and estate-scale residences inside a small gated community. The first conversation should establish whether the priority is the dock, the architectural era, the gate-and-privacy lifestyle, or all three. Diligence covers seawall and dock condition, lot orientation, route from the canal to the inlet, renovation history, and any community covenants. Buyers should expect a longer search horizon and treat the neighborhood as a relationship-driven market rather than a public-listing market — the right residence often surfaces through introduction rather than the open MLS.",
    sellerGuidance:
      "Sellers in Bay Colony benefit from quiet, relationship-led representation. Local representation matters because the buyer pool is small, well-known to active eastern Fort Lauderdale agents, and trades on architectural pedigree, lot, and dock specifics. Pre-list preparation often emphasizes professional architectural photography, a private comparable-sales brief drawn from the right cohort (gated peers and deepwater estates rather than the broader market), and a controlled introduction strategy that respects the gate. The residence should be positioned as a specific architectural and lifestyle proposition, not a broad luxury single-family.",
    faqs: [
      {
        question: "Where exactly is Bay Colony in Fort Lauderdale?",
        answer:
          "Bay Colony sits in eastern Fort Lauderdale off Bayview Drive, between Sunrise Boulevard and Oakland Park Boulevard. Access is through a single guarded entry, with private interior streets and deepwater canal homes inside the gate. It is residential and quiet by design — daily life feels different from the more public finger-isle waterfront markets.",
      },
      {
        question: "What kind of dockage do Bay Colony residences offer?",
        answer:
          "Most Bay Colony residences sit on deepwater canals that route to the Intracoastal Waterway and onward to the ocean via the inlet. Bridge clearance, water depth, dock length, and route to open water vary by lot. Buyers focused on a particular vessel should confirm dock and route specifics during diligence rather than rely on neighborhood reputation.",
      },
      {
        question: "Is Bay Colony a public-listing market or a relationship market?",
        answer:
          "Many Bay Colony transactions involve private or relationship-driven introductions before, or instead of, broad public marketing. The gate and the small buyer pool make discreet representation common. A clearly written brief — buyer or seller — is what enables the right introduction at the right moment.",
      },
      {
        question: "How does Bay Colony compare to Harbor Beach or Las Olas Isles?",
        answer:
          "Harbor Beach combines a guard gate with shared private-beach-club access, which Bay Colony does not include — Bay Colony's identity is gate plus deepwater canal rather than gate plus ocean-club. Las Olas Isles offers walkability to Las Olas Boulevard at the cost of a guard gate. Bay Colony sits between the two: gated and quiet, with deepwater canal access, but residential rather than walkable-urban.",
      },
      {
        question: "How does Mia approach Bay Colony representation?",
        answer:
          "Quietly, by brief and relationship, with a comparable-sales packet drawn from gated and deepwater estate peers rather than the broader Fort Lauderdale waterfront. Whether buying or selling, the goal is a small set of qualified, prepared candidates rather than a public open market — which respects both the gate and the buyer profile this neighborhood attracts.",
      },
    ],
    internalLinks: [
      { slug: "harbor-beach", label: "Harbor Beach" },
      { slug: "las-olas-isles", label: "Las Olas Isles" },
      { slug: "coral-ridge", label: "Coral Ridge" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
    comparisonContext:
      "Bay Colony is the gated single-entry deepwater enclave alternative within Eastern Fort Lauderdale. Buyers usually compare Harbor Beach as the canonical gated trophy peer with a beach-club component (Bay Colony has neither), Las Olas Isles for the walkable-deepwater alternative without the gate, Coral Ridge for the country-club geographic neighbor, Fort Lauderdale for the anchor city, and Bermuda Riviera for the mid-century-modern architectural alternative within the same broader Eastern Fort Lauderdale waterfront cohort. The right Bay Colony brief usually centers on private security, dockage, and the gated single-entry character.",
  },
  {
    slug: "bermuda-riviera",
    cluster: "neighborhood",
    name: "Bermuda Riviera",
    tagline: "Eastern Fort Lauderdale waterfront with mid-century-modern architectural heritage.",
    intro:
      "Bermuda Riviera is a waterfront residential neighborhood in eastern Fort Lauderdale, east of Bayview Drive and west of the Intracoastal. It is known for deepwater canal homes, tree-lined streets, and mid-century-modern architectural heritage — quieter than Las Olas Isles and convenient to Galt Ocean Mile.",
    highlights: [
      "Waterfront residential neighborhood east of Bayview Drive",
      "Deepwater canal homes with Intracoastal Waterway access",
      "Mid-century-modern architectural heritage with renovated and tear-down options",
      "Tree-lined interior streets and a quieter residential feel",
      "Convenient to Galt Ocean Mile, Lauderdale-by-the-Sea, and the beach",
    ],
    lifestyle:
      "Bermuda Riviera is for clients who want waterfront access with a quieter residential character than Las Olas Isles or Rio Vista. Mid-century-modern architectural fans find a deeper inventory here than in most Fort Lauderdale neighborhoods. Mia helps clients navigate the spectrum from preserved originals to full renovations to new builds on tear-down canal lots.",
    priceCharacter:
      "Pricing turns on canal frontage, dock specifics, and the architectural state of the residence — preserved mid-century, renovated, or new build. A property-specific review beats a broad neighborhood average every time.",
    latitude: 26.1755,
    longitude: -80.1085,
    heroImage: "/markets/bermuda-riviera.jpg",
    localContext:
      "Bermuda Riviera sits in eastern Fort Lauderdale, east of Bayview Drive and west of the Intracoastal Waterway, with deepwater canal homes routing to the Intracoastal and onward to ocean access. The neighborhood is convenient to Galt Ocean Mile's beach corridor, Lauderdale-by-the-Sea's restaurants and pier, and Coral Ridge to the south. It is one of Fort Lauderdale's better surviving pockets of mid-century-modern residential architecture.",
    county: "Broward County",
    aeoAnswer:
      "Bermuda Riviera is a waterfront residential neighborhood in eastern Fort Lauderdale, east of Bayview Drive between the Intracoastal Waterway and the Coral Ridge corridor. The neighborhood is known for deepwater canal homes with Intracoastal access, tree-lined interior streets, and a notable concentration of mid-century-modern architecture — preserved originals, renovations, and new builds on tear-down canal lots all trade actively. The residential feel is quieter than the more public Las Olas Isles or Rio Vista markets, and the location is convenient to Galt Ocean Mile's beach corridor and Lauderdale-by-the-Sea. Architectural era, canal frontage, and dockage drive pricing more than broad waterfront averages.",
    propertyTypes: [
      "Mid-century-modern waterfront single-family residences",
      "Renovated deepwater canal homes with private dockage",
      "Contemporary new-build estates on tear-down canal lots",
      "Tree-lined interior streets with non-waterfront single-family",
      "Estate-scale waterfront residences with pool, dock, and outdoor living",
    ],
    buyerGuidance:
      "Bermuda Riviera suits buyers who want waterfront access with a residential character quieter than the public finger-isle markets, plus the option of architectural pedigree from the mid-century-modern stock. The first decision is canal selection — dock length, water depth, and Intracoastal route vary by block. Diligence on waterfront homes covers seawall condition, dock pilings, lot orientation, and renovation depth. Buyers should also weigh whether the search needs a preserved original, a renovated residence, or a tear-down lot for new construction — Bermuda Riviera trades in all three categories, and the briefs differ.",
    sellerGuidance:
      "Sellers in Bermuda Riviera should lead with the canal and the architectural story — deepwater dockage plus mid-century-modern heritage is a distinctive pitch in eastern Fort Lauderdale. Local representation matters because pricing turns on dock, lot, and architectural state in ways that broad public estimates miss. Pre-list preparation typically includes dock and seawall confirmation, light staging tuned to a luxury single-family buyer, and a comparable-sales brief drawn narrowly from canal-similar trades and architectural peers rather than the neighborhood as a whole.",
    faqs: [
      {
        question: "Where is Bermuda Riviera within Fort Lauderdale?",
        answer:
          "Bermuda Riviera sits in eastern Fort Lauderdale, east of Bayview Drive and west of the Intracoastal Waterway, north of the Coral Ridge corridor. The neighborhood is convenient to Galt Ocean Mile's beach corridor and Lauderdale-by-the-Sea, with deepwater canal homes routing to the Intracoastal and onward to the ocean.",
      },
      {
        question: "What architectural styles dominate Bermuda Riviera?",
        answer:
          "Bermuda Riviera is one of Fort Lauderdale's better surviving pockets of mid-century-modern residential architecture. The stock ranges from preserved originals to studs-out renovations to contemporary new builds on tear-down canal lots. Buyers comparing residences should evaluate the architectural era as a primary factor and budget renovation accordingly.",
      },
      {
        question: "How does Bermuda Riviera compare to Coral Ridge or Las Olas Isles?",
        answer:
          "Coral Ridge sits to the south and centers on the country-club corridor with a mix of waterfront and non-waterfront residences. Las Olas Isles offers walkability to Las Olas Boulevard and a more public-isles character. Bermuda Riviera is quieter and more residential than Las Olas Isles, with a stronger mid-century-modern architectural identity than most Fort Lauderdale waterfront neighborhoods.",
      },
      {
        question: "Is dockage similar to Las Olas Isles or Rio Vista?",
        answer:
          "Bermuda Riviera's deepwater canals route to the Intracoastal Waterway and onward to ocean access. Bridge clearance, water depth, dock length, and route to open water vary by canal — buyers focused on a particular vessel should confirm route specifics during diligence rather than rely on neighborhood reputation. Yacht-capable docks are present but not uniform across every block.",
      },
      {
        question: "How does Mia approach Bermuda Riviera representation?",
        answer:
          "Property by property — with attention to dock, canal route, and architectural state. Buyers receive a brief tuned to mid-century-modern, renovated, or new-build inventory depending on priorities. Sellers receive a comparable-sales review drawn from the right cohort rather than the whole neighborhood, plus a presentation strategy that leads with the canal and the architectural story.",
      },
    ],
    internalLinks: [
      { slug: "coral-ridge", label: "Coral Ridge" },
      { slug: "harbor-beach", label: "Harbor Beach" },
      { slug: "las-olas-isles", label: "Las Olas Isles" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
    comparisonContext:
      "Bermuda Riviera is the mid-century-modern waterfront alternative within Eastern Fort Lauderdale. Buyers usually compare Coral Ridge as the architectural and geographic cousin to the south, Harbor Beach for the gated trophy alternative with a beach-club component, Las Olas Isles for the walkable-deepwater alternative with stronger Las Olas Boulevard adjacency, and Fort Lauderdale as the broader anchor city. The right Bermuda Riviera brief usually centers on architectural era — preserved mid-century-modern original, studs-out renovation, or contemporary new build — alongside dockage and canal-route specifics, rather than competing on walkability or formal-club access.",
  },
  // ──────────────────────────────────────────────────────────────────────────
  // Cycle 25 — seven Mia-approved Broward neighborhood pages.
  // Source-grounded geographic + municipal-identity framing. No school/safety/
  // familial-status/protected-class claims. No fabricated metrics. Brand-tone
  // placeholder hero JPGs render until Mia provides licensed photography.
  // Centroids per implementation-engineer memo (U.S. Census / GNIS).
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: "deerfield-beach",
    cluster: "primary",
    name: "Deerfield Beach",
    tagline:
      "Northeastern Broward beach city framed by Boca Raton, Pompano Beach, and the Hillsboro Inlet.",
    intro:
      "Deerfield Beach is a northeastern Broward coastal city framed by Boca Raton (Palm Beach County) to the north and Pompano Beach and Lighthouse Point to the south. The market pairs Atlantic beach access — anchored by the public Deerfield Beach Pier — with Intracoastal-side single-family residences and named city pockets like the Cove, often at relative value to its Palm Beach County neighbor.",
    highlights: [
      "Northeastern Broward County coastal municipality",
      "Atlantic Ocean frontage anchored by the public Deerfield Beach Pier",
      "Intracoastal Waterway through the city, with canal-routed residential blocks",
      "Cove residential pocket near the Hillsboro Inlet",
      "Quiet Waters Park (Broward County Parks system) as a named regional landmark",
    ],
    lifestyle:
      "Deerfield Beach suits buyers who want Atlantic beach access and Intracoastal-side single-family residences without committing to the Palm Beach County price band. Mia helps clients sort the A1A-and-pier corridor, the Cove residential pocket, and Intracoastal-side canal homes against each other, and frames the comparison honestly against Pompano Beach and southern Boca Raton so the brief is decisive rather than scattered across three counties of inventory.",
    priceCharacter:
      "Pricing changes corridor by corridor. Oceanfront condominium, pier-adjacent single-family, Cove residential, Intracoastal-side, and interior all trade against different cohorts. A property-specific review beats a city-wide average.",
    latitude: 26.3184,
    longitude: -80.0998,
    heroImage: "/markets/deerfield-beach.jpg",
    localContext:
      "Deerfield Beach occupies the northeastern corner of Broward County, bordered on the north by Boca Raton in Palm Beach County and on the south by Pompano Beach and Lighthouse Point. The Hillsboro Inlet to the south anchors the deepwater route to the Atlantic for boat-routed canal residences. The Hillsboro Boulevard / Federal Highway / A1A axis frames the public-corridor identity. Quiet Waters Park, a regional Broward Parks system facility, sits inland and is one of the city's better-known named landmarks.",
    county: "Broward County",
    aeoAnswer:
      "Deerfield Beach is a northeastern Broward coastal city of roughly 17 square miles, framed by Boca Raton (Palm Beach County) to the north and Pompano Beach and Lighthouse Point to the south. The market is known for Atlantic beach access anchored by the public Deerfield Beach Pier, the Cove residential pocket near the Hillsboro Inlet, and Intracoastal-side single-family residences with canal-routed access. The Hillsboro Boulevard / Federal Highway / A1A axis frames the public corridor. Quiet Waters Park, a Broward Parks system facility, sits inland. The market often trades at relative value to its Palm Beach County neighbor while sharing the same Atlantic and Intracoastal water-access logic.",
    propertyTypes: [
      "Oceanfront and beach-corridor condominiums along A1A",
      "Pier-adjacent and Cove single-family residences",
      "Intracoastal-side single-family with private dockage",
      "Inland canal residences routed toward the Hillsboro Inlet",
      "Interior single-family in the established Deerfield neighborhoods",
    ],
    buyerGuidance:
      "Buyers here usually start with one of four briefs: A1A-corridor or pier-adjacent condominium; Cove or other beach-corridor single-family; Intracoastal-side with private dockage; or interior single-family. The first conversation establishes which. Waterfront diligence covers seawall, dock specifics, bridge clearance, and the route to the Hillsboro Inlet. Condominium diligence covers reserves, milestone-inspection status, and rental rules. Buyers comparing against southern Boca Raton should weigh county tax-roll and pricing differences alongside the lifestyle comparison.",
    sellerGuidance:
      "Sellers in Deerfield Beach should position the residence to its specific corridor — oceanfront condominium, pier-adjacent, Cove residential, Intracoastal-side, or interior — and to the buyer pool that shops there. Pre-list preparation typically includes dock and seawall documentation for waterfront, milestone-inspection and reserve status for condominium, and a comparable-sales packet drawn from the same corridor rather than the city average. Photography and narrative should emphasize the corridor-specific lifestyle rather than a generic luxury frame.",
    faqs: [
      {
        question: "Where is Deerfield Beach geographically?",
        answer:
          "Deerfield Beach sits in northeastern Broward County. It is bordered on the north by Boca Raton (Palm Beach County) and on the south by Pompano Beach and Lighthouse Point. It is a separately incorporated Broward municipality with its own city government — not a part of Pompano Beach or Boca Raton.",
      },
      {
        question: "What is the Cove in Deerfield Beach?",
        answer:
          "The Cove is a named residential pocket in Deerfield Beach near the Hillsboro Inlet. It is one of the city's better-known waterfront-residential cohorts and is referenced by name in city addressing. Buyers comparing the Cove against other Deerfield corridors should treat it as its own comparable-sales cohort.",
      },
      {
        question: "How does Deerfield Beach compare to Boca Raton for waterfront buyers?",
        answer:
          "Both share Atlantic and Intracoastal water-access logic, but Deerfield Beach sits in Broward County while Boca Raton sits in Palm Beach County — which means different county tax rolls, different municipal services, and often a different price band for comparable property profiles. Many waterfront buyers compare the two side by side rather than choosing one without the comparison.",
      },
      {
        question: "Is Deerfield Beach a serious boating market?",
        answer:
          "Yes, for buyers focused on Atlantic access via the Hillsboro Inlet. Intracoastal-side residences and canal-routed homes share the inlet with Lighthouse Point and Hillsboro Beach to the south. Bridge clearance, water depth, dock length, and the inlet route should be confirmed during diligence rather than assumed from a city-wide reputation.",
      },
      {
        question: "How does Mia approach a Deerfield Beach search or listing?",
        answer:
          "She begins with a private conversation about the brief — lifestyle anchors, timeline, and the residence in mind. From there the search narrows to a specific corridor or the listing strategy shapes to one of Deerfield's distinct buyer cohorts, with current comparable sales, dock-and-seawall context, and any relevant informally available residences her network surfaces along the way.",
      },
    ],
    internalLinks: [
      { slug: "pompano-beach", label: "Pompano Beach" },
      { slug: "hillsboro-mile", label: "Hillsboro Mile" },
      { slug: "lighthouse-point", label: "Lighthouse Point" },
      { slug: "boca-raton", label: "Boca Raton" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
    comparisonContext:
      "Deerfield Beach is the northeastern Broward coastal peer immediately south of Boca Raton. Buyers usually compare four vectors: Boca Raton for the Palm Beach County country-club and walkable-Atlantic-Avenue alternative; Pompano Beach for the redevelopment-corridor and reef-diving Broward peer to the south; Lighthouse Point for the dense canal-finger-isle alternative routed to the Hillsboro Inlet; and Hillsboro Mile for the linear A1A corridor north of the inlet. The right Deerfield Beach brief usually centers on whether the priority is the pier-and-Cove residential character, deepwater Intracoastal with inlet routing, or beach-corridor condominium at relative value to the Palm Beach County alternative immediately north.",
  },
  {
    slug: "hollywood",
    cluster: "primary",
    name: "Hollywood",
    tagline:
      "South Broward coastal city anchored by the Hollywood Broadwalk and Young Circle / ArtsPark.",
    intro:
      "Hollywood, Florida, is a south Broward coastal city — distinct from Los Angeles — framed by Hallandale Beach to the south and Dania Beach to the north. The market is known for the Hollywood Broadwalk along the Atlantic, Young Circle and ArtsPark in the downtown core, and an Intracoastal-and-canal residential network that runs west from the beach corridor.",
    highlights: [
      "South Broward County coastal municipality, incorporated 1925",
      "Hollywood Broadwalk — public oceanfront pedestrian promenade along the Atlantic",
      "Young Circle and ArtsPark at Young Circle as named downtown landmarks",
      "Intracoastal Waterway and a network of residential canals routed to the inlet",
      "Mixed residential mix from beach-corridor condominium to interior single-family",
    ],
    lifestyle:
      "Hollywood suits buyers who want Atlantic beach access, a walkable downtown distinct from the Fort Lauderdale cohort, and a residential mix that ranges from A1A condominium to canal-routed single-family. Mia frames the comparison against Pompano Beach to the north and Hallandale Beach to the south, and helps clients sort the Broadwalk corridor, the downtown / Young Circle pocket, the Intracoastal residential streets, and the western interior subdivisions against each other.",
    priceCharacter:
      "Pricing depends on corridor. Beach-corridor condominium, A1A-adjacent, Intracoastal-side single-family, downtown / Young Circle, and interior single-family all trade against different cohorts. A property-specific review beats a city-wide average.",
    latitude: 26.0112,
    longitude: -80.1495,
    heroImage: "/markets/hollywood.jpg",
    localContext:
      "Hollywood occupies south Broward County between Hallandale Beach to the south and Dania Beach to the north, with West Park on the western boundary. The Atlantic Ocean frames the east; the Hollywood Broadwalk is the public-corridor anchor. Young Circle in the downtown core hosts ArtsPark at Young Circle. The Intracoastal Waterway and a network of residential canals route inland buyers to the inlet shared with Port Everglades to the north. The city was founded in 1925 by Joseph W. Young as a planned Florida-coast development.",
    county: "Broward County",
    aeoAnswer:
      "Hollywood, Florida — a south Broward coastal city distinct from Los Angeles — is anchored by the Hollywood Broadwalk along the Atlantic Ocean and Young Circle with ArtsPark in the downtown core. The city was incorporated in 1925 and developed by Joseph W. Young as a planned Florida-coast city. The market spans beach-corridor condominium along A1A, Intracoastal-side single-family with canal-routed dockage, the downtown / Young Circle pocket, and an interior single-family residential mix west of the Intracoastal. The city is framed by Hallandale Beach to the south and Dania Beach to the north, and shares the inlet routing with Port Everglades immediately north.",
    propertyTypes: [
      "A1A oceanfront and beach-corridor condominiums",
      "Hollywood Broadwalk-adjacent and beach-corridor single-family",
      "Intracoastal-side single-family with private dockage",
      "Inland canal residences and Lakes-section single-family",
      "Downtown / Young Circle condominium and mixed-use residential",
    ],
    buyerGuidance:
      "Buyers in Hollywood usually start with one of four briefs: A1A or Broadwalk-adjacent condominium; Intracoastal-side or canal-routed single-family; downtown / Young Circle pocket; or interior single-family. The first conversation establishes which corridor and which residential cohort. Waterfront diligence covers seawall, dock specifics, and the route through the Intracoastal toward the inlet. Condominium diligence covers reserves, milestone-inspection, and rental rules in towers along A1A. Buyers comparing Hollywood against Pompano Beach or eastern Fort Lauderdale should weigh downtown-walkability and price-corridor differences carefully.",
    sellerGuidance:
      "Sellers in Hollywood should position the residence to its specific corridor and the buyer pool that shops there. Comparable-sales cohorts diverge sharply across the A1A condominium tier, the Intracoastal-side single-family pool, and the inland residential streets — a residence priced against the wrong cohort underperforms. Pre-list preparation typically includes dock and seawall documentation for waterfront, milestone-inspection and reserve status for condominium, and a comparable-sales packet drawn from the same corridor rather than the city average.",
    faqs: [
      {
        question: "Where is Hollywood, Florida?",
        answer:
          "Hollywood is a south Broward County coastal city — not in Los Angeles. It is bordered on the south by Hallandale Beach, on the north by Dania Beach, and on the west by West Park. The Atlantic Ocean frames the east. It is a separately incorporated Broward municipality with its own city government.",
      },
      {
        question: "What is the Hollywood Broadwalk?",
        answer:
          "The Hollywood Broadwalk is a public oceanfront pedestrian promenade running along the Atlantic Ocean in Hollywood. It is one of the city's defining named landmarks and frames the residential character of the A1A corridor and the immediately adjacent beach-corridor pockets.",
      },
      {
        question: "How does Hollywood compare to Pompano Beach or eastern Fort Lauderdale?",
        answer:
          "Pompano Beach sits to the north of Fort Lauderdale and shares a redevelopment-corridor and reef-diving identity. Hollywood sits south of Fort Lauderdale and pairs the Broadwalk and Young Circle / ArtsPark downtown with the same Intracoastal water-access logic. Buyers comparing the two should weigh downtown character, beach-corridor density, and the price band each market trades in.",
      },
      {
        question: "Is Hollywood a serious boating market?",
        answer:
          "Yes, for buyers focused on Intracoastal-side or canal-routed single-family. The Intracoastal Waterway and the network of residential canals route inland residences toward the inlet shared with Port Everglades immediately to the north. Bridge clearance, water depth, dock length, and the route to open water should be confirmed during diligence.",
      },
      {
        question: "How does Mia approach a Hollywood search or listing?",
        answer:
          "She begins with a private conversation about the brief and the corridor — Broadwalk-adjacent, Intracoastal-side, downtown / Young Circle, or interior. The search or listing then narrows to a specific cohort, with current comparable sales, condominium-reserve or dock context as appropriate, and any relevant informally available residences her network surfaces along the way.",
      },
    ],
    internalLinks: [
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
      { slug: "davie", label: "Davie" },
      { slug: "pompano-beach", label: "Pompano Beach" },
      { slug: "plantation", label: "Plantation" },
    ],
    comparisonContext:
      "Hollywood is the south Broward coastal peer that pairs Atlantic-Ocean Broadwalk frontage with a walkable downtown around Young Circle. Buyers usually compare three vectors: Fort Lauderdale for the broader anchor city to the north with its deepwater finger-isle cohort; Pompano Beach for the redevelopment-corridor alternative also to the north; and Davie, Plantation, or interior cohorts for buyers who want central- or western-Broward residential density without the beach-corridor premium. The right Hollywood brief usually centers on whether the priority is the Broadwalk / A1A condominium tier, an Intracoastal-side single-family with canal dockage, or a downtown / Young Circle walkable residence.",
  },
  {
    slug: "plantation",
    cluster: "primary",
    name: "Plantation",
    tagline:
      "Central Broward city with mature tree canopy and a central-Broward connector position.",
    intro:
      "Plantation is a central Broward city, incorporated in 1953, framed by Sunrise to the north, Davie to the south, and Fort Lauderdale to the east. The market is known for established residential streets, a mature tree canopy along several corridors, and central-Broward connector access via Broward Boulevard, University Drive, Sunrise Boulevard, and Peters Road.",
    highlights: [
      "Central Broward County municipality, incorporated 1953",
      "Mature tree-canopy character along several established residential corridors",
      "Plantation Heritage Park (Broward Parks system) as a named regional landmark",
      "Volunteer Park as a named city facility",
      "Central-Broward connector access via Broward Boulevard, University Drive, Sunrise Boulevard, and Peters Road",
    ],
    lifestyle:
      "Plantation suits buyers who want central-Broward residential character with mature landscaping and convenient connector access to Fort Lauderdale, Sunrise, and Davie. Mia helps clients compare the established mature-canopy streets, the newer gated-community subdivisions, and the mixed-use corridors block by block, and frames the comparison honestly against the master-planned alternatives in Coral Springs, Sunrise, and Weston.",
    priceCharacter:
      "Pricing turns on lot, canopy adjacency, and the architectural state of the residence. Established single-family on a mature-canopy street trades against a different cohort than a newer gated-subdivision residence. A property-specific review beats a city average.",
    latitude: 26.1275,
    longitude: -80.2331,
    heroImage: "/markets/plantation.jpg",
    localContext:
      "Plantation sits in central Broward County, bordered on the north by Sunrise, on the south by Davie, and on the east by Fort Lauderdale and the unincorporated areas adjacent to it. The city was incorporated in 1953. Major civic and commercial spines run along Broward Boulevard (east-west), University Drive (north-south), Sunrise Boulevard, Peters Road, and Pine Island Road. Plantation Heritage Park, a Broward County Parks system facility, is a named regional landmark. The city is predominantly single-family residential with mixed-use along the major commercial corridors.",
    county: "Broward County",
    aeoAnswer:
      "Plantation is a central Broward County municipality, incorporated in 1953, framed by Sunrise to the north, Davie to the south, and Fort Lauderdale to the east. The market is known for established residential streets, a mature tree canopy along several corridors, and central-Broward connector access via Broward Boulevard, University Drive, Sunrise Boulevard, and Peters Road. Plantation Heritage Park (Broward Parks system) and Volunteer Park (city) are named landmarks. The residential mix runs from established mature-canopy single-family to newer gated-community subdivisions, with mixed-use along the major commercial spines.",
    propertyTypes: [
      "Established single-family on mature-canopy streets",
      "Gated-community single-family in newer subdivisions",
      "Townhomes and villas along mixed-use commercial corridors",
      "Renovated residences on established Plantation lots",
      "Larger-lot single-family in older Plantation neighborhoods",
    ],
    buyerGuidance:
      "Buyers in Plantation usually start with one of three briefs: established mature-canopy single-family on a residential street; newer gated-community single-family or townhome; or a mixed-use-corridor residence. The first conversation establishes which. Diligence covers tree-canopy impact on hurricane-shutter strategy, roof and impact-window status, prior renovation, lot orientation, and HOA / community-covenant scope where relevant. Buyers comparing Plantation against Coral Springs, Sunrise, Weston, or Davie should weigh the canopy and connector character against the master-planned alternative.",
    sellerGuidance:
      "Sellers in Plantation should position the residence to the specific corridor and architectural state. Comparable-sales cohorts diverge across the mature-canopy and newer-subdivision pools — a residence priced against the wrong cohort underperforms. Pre-list preparation typically includes ordinance-compliant tree trimming, photography that captures the canopy as a feature where it applies, a comparable-sales packet drawn narrowly from similar residences, and HOA documentation where the residence sits inside a gated community.",
    faqs: [
      {
        question: "Where is Plantation in Broward County?",
        answer:
          "Plantation sits in central Broward County, framed by Sunrise to the north, Davie to the south, and Fort Lauderdale to the east. It is a separately incorporated Broward municipality with its own city government. The city was incorporated in 1953 and has its name from the earlier land-use history of the site.",
      },
      {
        question: "What is the tree-canopy character of Plantation?",
        answer:
          "Several established residential corridors in Plantation carry a mature tree canopy that distinguishes them from the newer master-planned subdivisions in the surrounding cities. Buyers shopping a canopy street should treat tree-condition diligence, ordinance-compliant trimming, and hurricane-shutter strategy as part of the brief rather than a generic city-wide feature.",
      },
      {
        question: "How does Plantation compare to Coral Springs or Sunrise?",
        answer:
          "Coral Springs and Sunrise are largely master-planned with deliberate road grids and newer subdivisions. Plantation pairs an older established residential character with newer gated-community pockets, and sits closer to Fort Lauderdale and the eastern Broward corridor. Buyers comparing the three should weigh canopy and connector character against the master-planned alternative.",
      },
      {
        question: "Is there waterfront in Plantation?",
        answer:
          "Plantation is predominantly inland; it does not have Atlantic or Intracoastal frontage. Buyers seeking Atlantic, Intracoastal, or canal water-access should compare to Fort Lauderdale, Pompano Beach, Deerfield Beach, or Hollywood. Plantation residences may sit on lakes or man-made water features within named subdivisions, which is a different diligence conversation.",
      },
      {
        question: "How does Mia approach a Plantation search or listing?",
        answer:
          "She begins with a private conversation about the brief — mature-canopy street, newer gated subdivision, or a mixed-use-corridor residence. The search or listing then narrows to a specific cohort, with current comparable sales, canopy and lot context, HOA documentation where applicable, and any relevant informally available residences her network surfaces along the way.",
      },
    ],
    internalLinks: [
      { slug: "davie", label: "Davie" },
      { slug: "sunrise", label: "Sunrise" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
      { slug: "coral-springs", label: "Coral Springs" },
    ],
    comparisonContext:
      "Plantation is the central-Broward connector peer between Sunrise to the north and Davie to the south, immediately west of Fort Lauderdale. Buyers usually compare four vectors: Sunrise for the western-Broward civic-and-retail spine with the Sawgrass Mills district; Davie for the lower-density / equestrian-overlay alternative immediately south; Coral Springs for the northwestern Broward master-planned alternative; and Fort Lauderdale for the broader anchor city to the east. The right Plantation brief usually centers on whether the priority is a mature-canopy street, a newer gated subdivision, or a mixed-use corridor residence — and how much central-Broward connector convenience matters in the lifestyle.",
  },
  {
    slug: "weston",
    cluster: "primary",
    name: "Weston",
    tagline:
      "Western Broward master-planned communities at the Everglades Water Conservation Area edge.",
    intro:
      "Weston is a western Broward municipality, incorporated in 1996, developed beginning in the 1980s under an Arvida master plan. The city sits at the western edge of urbanized Broward against the Everglades Water Conservation Area, organized around named Weston communities including Weston Hills, the Falls, Country Isles, Bonaventure, Savanna, and Windmill Ranch Estates.",
    highlights: [
      "Western Broward County municipality, incorporated 1996",
      "Original master plan developed by Arvida beginning in the 1980s",
      "Bounded on the west by the Everglades Water Conservation Area",
      "Named Weston communities (Weston Hills, the Falls, Country Isles, Bonaventure, Savanna, Windmill Ranch Estates) — each a distinct cohort",
      "Parkway-style road grid centered on Royal Palm Boulevard, Indian Trace, Bonaventure Boulevard, and Saddle Club Road",
    ],
    lifestyle:
      "Weston suits buyers who want a master-planned western-Broward residential character with named-community identity and lower density than most Broward cities. Mia helps clients sort the Weston communities against each other — Weston Hills and Windmill Ranch Estates for the estate-scale single-family cohort; the Falls, Country Isles, Bonaventure, and Savanna for the established single-family and townhome cohorts — and frames the comparison honestly against the alternative master-planned cities in Coral Springs and Parkland.",
    priceCharacter:
      "Pricing turns on the named community first and the residence second. Comparable-sales cohorts diverge sharply across Weston communities. A property-specific review against the right named-community cohort beats a city-wide average.",
    latitude: 26.1003,
    longitude: -80.3997,
    heroImage: "/markets/weston.jpg",
    localContext:
      "Weston sits at the western edge of urbanized Broward County, bordered on the west by the Everglades Water Conservation Area. The city was incorporated in 1996 after Arvida had been developing the area under the Weston master plan since the 1980s. Named Weston communities include Weston Hills, the Falls, Country Isles, Bonaventure, Savanna, and Windmill Ranch Estates — each is a distinct residential cohort with its own community-covenant scope, road-grid pattern, and architectural era. The civic and commercial spine runs along Royal Palm Boulevard, Indian Trace, Bonaventure Boulevard, and Saddle Club Road.",
    county: "Broward County",
    aeoAnswer:
      "Weston is a western Broward County municipality, incorporated in 1996, developed beginning in the 1980s under an Arvida master plan. The city sits at the western edge of urbanized Broward against the Everglades Water Conservation Area. The market is organized around named Weston communities — Weston Hills, the Falls, Country Isles, Bonaventure, Savanna, Windmill Ranch Estates — each with its own architectural era and community-covenant scope. Pricing and comparable-sales cohorts diverge sharply across these named communities, and a serious Weston brief is community-specific rather than city-wide. The parkway-style road grid centers on Royal Palm Boulevard, Indian Trace, Bonaventure Boulevard, and Saddle Club Road.",
    propertyTypes: [
      "Estate-scale single-family in Weston Hills and Windmill Ranch Estates",
      "Established single-family in the Falls, Country Isles, and Savanna",
      "Townhomes and villas in named Bonaventure cohorts",
      "Newer gated-subdivision single-family across the western Weston perimeter",
      "Renovated single-family on legacy Weston-community lots",
    ],
    buyerGuidance:
      "Buyers in Weston usually start with the named community first and the residence second. The first conversation establishes which Weston community fits the brief — Weston Hills or Windmill Ranch Estates for the estate-scale cohort; the Falls or Country Isles for the established single-family cohort; Bonaventure or Savanna for townhome / villa or established single-family. Diligence covers HOA and community-covenant scope, lot orientation, impact-window status, prior renovation, and Everglades-perimeter context where applicable. Comparable-sales review must draw narrowly from the same named community.",
    sellerGuidance:
      "Sellers in Weston should position the residence to the named community and the buyer pool that shops there. Buyer pools are heavily community-segmented; a residence priced against the wrong community underperforms. Pre-list preparation typically includes HOA documentation review, a comparable-sales packet drawn from the same Weston community, photography tuned to the named-community character, and a brief that acknowledges the master-planned identity without drifting into superlative claims.",
    faqs: [
      {
        question: "Where is Weston in Broward County?",
        answer:
          "Weston sits in western Broward County, at the edge of urbanized Broward against the Everglades Water Conservation Area. It is a separately incorporated Broward municipality with its own city government. The city was incorporated in 1996 after Arvida had been developing the area since the 1980s under the Weston master plan.",
      },
      {
        question: "What are the named Weston communities?",
        answer:
          "Weston organizes around named communities including Weston Hills, the Falls, Country Isles, Bonaventure, Savanna, and Windmill Ranch Estates. Each is a distinct residential cohort with its own community-covenant scope, road-grid pattern, and architectural era. Buyers and sellers should treat the named community as the primary segmenter — not the city as a whole.",
      },
      {
        question: "How does Weston compare to Coral Springs or Parkland?",
        answer:
          "All three are western or northwestern Broward master-planned cities with strong named-subdivision identity. Coral Springs centers on the original 1963 Coral Ridge Properties master plan. Parkland sits to the north of Coral Springs. Weston was developed later under Arvida and sits at the western perimeter. Buyers comparing the three should weigh the named-community cohort, the architectural era, and the parkway-style road grid.",
      },
      {
        question: "Is there waterfront in Weston?",
        answer:
          "Weston is inland; it does not have Atlantic or Intracoastal frontage. Many Weston-community residences sit on lakes or man-made water features within named subdivisions, which is a different diligence conversation than ocean or Intracoastal water access. Buyers seeking Atlantic, Intracoastal, or canal access should compare to Fort Lauderdale, Pompano Beach, or Hollywood.",
      },
      {
        question: "How does Mia approach a Weston search or listing?",
        answer:
          "She begins with a private conversation about the named community and the brief — Weston Hills estate-scale, the Falls or Country Isles established single-family, or Bonaventure / Savanna townhome cohort. From there the search or listing narrows to a specific community-level cohort with HOA documentation, comparable sales drawn narrowly, and any relevant informally available residences her network surfaces along the way.",
      },
    ],
    internalLinks: [
      { slug: "davie", label: "Davie" },
      { slug: "coral-springs", label: "Coral Springs" },
      { slug: "sunrise", label: "Sunrise" },
      { slug: "plantation", label: "Plantation" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
    comparisonContext:
      "Weston is the western-Broward master-planned peer at the edge of urbanized Broward. Buyers usually compare four vectors: Coral Springs for the northwestern Broward master-planned alternative with the original 1963 Coral Ridge Properties master plan; Davie for the lower-density / equestrian-overlay alternative to the east; Sunrise for the western-Broward civic-and-retail spine alternative; and Plantation for the central-Broward connector alternative with mature canopy character. The right Weston brief usually centers on the named Weston community first — Weston Hills, the Falls, Country Isles, Bonaventure, Savanna, or Windmill Ranch Estates — and the residence specifics second, with Everglades-perimeter and HOA-covenant scope as part of the brief rather than incidental detail.",
  },
  {
    slug: "coral-springs",
    cluster: "primary",
    name: "Coral Springs",
    tagline:
      "Northwestern Broward planned city with a deliberate road grid and named subdivisions.",
    intro:
      "Coral Springs is a northwestern Broward municipality, incorporated in 1963 and named for the original Coral Ridge Properties master plan filed the same year. The city is framed by Parkland to the north, Tamarac and Margate to the south and east, and Coconut Creek to the east. The market centers on an established planned-community character with a deliberate parkway road grid.",
    highlights: [
      "Northwestern Broward County municipality, incorporated 1963",
      "Original master plan developed by Coral Ridge Properties",
      "Major civic and commercial spine along Sample Road, University Drive, and Atlantic Boulevard",
      "Established city parks and recreation system, including the Coral Springs Sportsplex",
      "Predominantly single-family residential with named subdivisions and a parkway road grid",
    ],
    lifestyle:
      "Coral Springs suits buyers who want a northwestern-Broward planned-community character with a deliberate road grid and named subdivisions, at relative distance from the beach corridor. Mia helps clients sort the original 1960s and 1970s single-family subdivisions, the 1980s and 1990s subdivisions along Sample Road and University Drive, and the newer gated-community pockets against each other, and frames the comparison honestly against Parkland, Tamarac, and the Weston alternative further west.",
    priceCharacter:
      "Pricing turns on the named subdivision, architectural era, and lot specifics. Comparable-sales cohorts diverge by subdivision; a subdivision-specific brief outperforms a city-wide average.",
    latitude: 26.2710,
    longitude: -80.2706,
    heroImage: "/markets/coral-springs.jpg",
    localContext:
      "Coral Springs occupies northwestern Broward County, bordered on the north by Parkland, on the east by Coconut Creek, and on the south and east by Tamarac and Margate. The city was incorporated in 1963 and is named for the original Coral Ridge Properties master plan filed the same year. The civic and commercial spine runs along Sample Road (east-west), University Drive (north-south), and Atlantic Boulevard. The Coral Springs Sportsplex and named city parks frame the public-recreation identity. The residential mix runs from original 1960s and 1970s single-family subdivisions to newer gated-community pockets.",
    county: "Broward County",
    aeoAnswer:
      "Coral Springs is a northwestern Broward County municipality, incorporated in 1963, named for the original Coral Ridge Properties master plan filed the same year. The city is framed by Parkland to the north and Tamarac, Margate, and Coconut Creek to the south and east. The market is known for a deliberate parkway road grid, named single-family subdivisions, and an established city parks and recreation system that includes the Coral Springs Sportsplex. The civic and commercial spine runs along Sample Road, University Drive, and Atlantic Boulevard. The residential mix runs from original 1960s and 1970s single-family to newer gated-community pockets, with pricing strongly segmented by named subdivision.",
    propertyTypes: [
      "Original 1960s and 1970s single-family on the Coral Ridge Properties road grid",
      "1980s and 1990s subdivision single-family along the Sample Road / University Drive corridors",
      "Newer gated-community single-family in the western Coral Springs subdivisions",
      "Townhomes and villas in named Coral Springs cohorts",
      "Renovated single-family on legacy Coral Springs subdivision lots",
    ],
    buyerGuidance:
      "Buyers in Coral Springs usually start with the named subdivision and the architectural era. The first conversation establishes which — original 1960s and 1970s single-family, 1980s and 1990s subdivision, or newer gated community. Diligence covers HOA and community-covenant scope where applicable, roof and impact-window status, prior renovation, lot orientation, and proximity to the Sample Road / University Drive commercial corridor. Buyers comparing Coral Springs against Parkland, Weston, or Sunrise should weigh the named-subdivision cohort and the parkway road-grid character.",
    sellerGuidance:
      "Sellers in Coral Springs should position the residence to the named subdivision and the architectural era. Comparable-sales cohorts diverge by subdivision; a residence priced against the wrong cohort underperforms. Pre-list preparation typically includes HOA documentation where the residence sits inside a gated community, a comparable-sales packet drawn narrowly from the same subdivision, and photography tuned to the residence's specific architectural era rather than a generic city frame.",
    faqs: [
      {
        question: "Where is Coral Springs in Broward County?",
        answer:
          "Coral Springs sits in northwestern Broward County, framed by Parkland to the north, Coconut Creek to the east, and Tamarac and Margate to the south and east. It is a separately incorporated Broward municipality with its own city government. The city was incorporated in 1963 and named for the original Coral Ridge Properties master plan filed the same year.",
      },
      {
        question: "What is the Coral Springs master-plan origin?",
        answer:
          "Coral Springs was named for and originally master-planned by Coral Ridge Properties, with the plan filed in 1963. The deliberate parkway road grid, the named subdivisions, and the established parks-and-recreation system all trace back to that master-planned origin. The character distinguishes Coral Springs from incrementally-developed Broward cities.",
      },
      {
        question: "How does Coral Springs compare to Parkland or Weston?",
        answer:
          "Parkland sits immediately to the north and shares the master-planned northwestern Broward identity. Weston sits to the south and was developed later under Arvida. All three pair planned-community road grids with named subdivisions. Buyers comparing the three should weigh the architectural era, the named-subdivision cohort, and the proximity to the western Broward perimeter against the Everglades.",
      },
      {
        question: "Is there waterfront in Coral Springs?",
        answer:
          "Coral Springs is inland; it does not have Atlantic or Intracoastal frontage. Many Coral Springs subdivisions sit on lakes or man-made water features, which is a different diligence conversation than ocean or Intracoastal water access. Buyers seeking Atlantic, Intracoastal, or canal access should compare to Fort Lauderdale, Pompano Beach, Deerfield Beach, or Hollywood.",
      },
      {
        question: "How does Mia approach a Coral Springs search or listing?",
        answer:
          "She begins with a private conversation about the named subdivision and the architectural era. The search or listing then narrows to a specific subdivision-level cohort, with HOA documentation where applicable, comparable sales drawn narrowly from the same subdivision, and any relevant informally available residences her network surfaces along the way.",
      },
    ],
    internalLinks: [
      { slug: "plantation", label: "Plantation" },
      { slug: "sunrise", label: "Sunrise" },
      { slug: "weston", label: "Weston" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
    comparisonContext:
      "Coral Springs is the northwestern Broward master-planned peer in the cohort that includes Parkland to the north and Weston to the south. Buyers usually compare four vectors: Weston for the later Arvida master plan at the Everglades perimeter; Sunrise for the western-Broward civic-and-retail spine with Sawgrass Mills; Plantation for the central-Broward connector alternative with mature canopy; and Fort Lauderdale for the broader anchor city to the southeast. The right Coral Springs brief usually centers on the named subdivision first and the architectural era second, with the parkway road grid and the deliberate planned-community character as the through-line of the city's identity.",
  },
  {
    slug: "davie",
    cluster: "primary",
    name: "Davie",
    tagline:
      "Central Broward town with equestrian heritage, Tree City USA designation, and a college corridor.",
    intro:
      "Davie is a central Broward town — first incorporated in 1925 and re-established as a municipal corporation in 1961 — with a distinct equestrian heritage, Tree City USA designation, and a college corridor that includes Nova Southeastern University's main campus, Broward College Central Campus, and FAU Davie. The market is known for lower-density residential character relative to most Broward cities and zoning that supports agricultural and equestrian uses in named pockets.",
    highlights: [
      "Central Broward County town — first incorporated 1925, reincorporated 1961",
      "Distinct equestrian heritage and an active Equestrian Trail network",
      "Tree City USA designation (Arbor Day Foundation)",
      "College corridor — Nova Southeastern University, Broward College Central Campus, FAU Davie",
      "Lower-density residential character relative to most Broward cities, with named equestrian-overlay pockets",
    ],
    lifestyle:
      "Davie suits buyers who want a central-Broward residential character at lower density than most surrounding Broward cities, with the option of equestrian or agricultural-zoning use in named pockets. Mia helps clients sort the larger-lot equestrian-overlay residences, the established higher-density named subdivisions, and the college-corridor single-family pool against each other, and frames the comparison honestly against the master-planned alternatives in Weston, Plantation, and Cooper City.",
    priceCharacter:
      "Pricing turns on lot size, zoning use, architectural state, and proximity to the equestrian-trail corridor or the college campuses. Comparable-sales cohorts diverge sharply across these briefs.",
    latitude: 26.0628,
    longitude: -80.2331,
    heroImage: "/markets/davie.jpg",
    localContext:
      "Davie sits in central Broward County, bordered on the north by Plantation, on the south by Pembroke Pines, and on the east by Fort Lauderdale and the unincorporated areas. The town was first incorporated in 1925 and re-established as a municipal corporation in 1961. Davie maintains an active Equestrian Trail network that runs through several named residential pockets, and carries a Tree City USA designation from the Arbor Day Foundation. The college corridor includes Nova Southeastern University's main campus, the Broward College Central Campus, and Florida Atlantic University's Davie campus. Major axes run along Griffin Road, Stirling Road, Nova Drive, Davie Road, and University Drive.",
    county: "Broward County",
    aeoAnswer:
      "Davie is a central Broward County town — first incorporated in 1925 and re-established as a municipal corporation in 1961 — distinguished by an equestrian heritage and active Equestrian Trail network, a Tree City USA designation from the Arbor Day Foundation, and a college corridor that includes Nova Southeastern University's main campus, Broward College Central Campus, and FAU Davie. The market runs from lower-density equestrian-overlay residences with agricultural zoning use in named pockets to higher-density established named subdivisions and college-corridor single-family. Major axes run along Griffin Road, Stirling Road, Nova Drive, Davie Road, and University Drive. The residential character is distinctively lower-density relative to most Broward cities.",
    propertyTypes: [
      "Larger-lot single-family with agricultural or equestrian zoning use",
      "Equestrian-overlay residences along the town's Equestrian Trail network",
      "Established higher-density single-family in named Davie subdivisions",
      "College-corridor single-family near NSU, Broward College, and FAU Davie",
      "Renovated single-family on legacy Davie lots",
    ],
    buyerGuidance:
      "Buyers in Davie usually start with one of three briefs: larger-lot single-family with agricultural or equestrian-zoning potential; established single-family in named higher-density subdivisions; or college-corridor single-family or townhome near NSU, Broward College, or FAU Davie. The first conversation establishes which. Diligence covers zoning use, easements, well-or-septic versus municipal water, equestrian-trail access where applicable, lot orientation, and HOA documentation in subdivisions. Buyers comparing Davie against Plantation, Cooper City, or Weston should weigh the lower-density and equestrian-overlay character against the master-planned alternative.",
    sellerGuidance:
      "Sellers in Davie should position the residence to the specific brief — equestrian / larger-lot, established subdivision, or college-corridor — and to the buyer pool that shops there. Comparable-sales cohorts diverge sharply across these three. Pre-list preparation typically includes zoning and use documentation for the equestrian and larger-lot pool, HOA documentation for the subdivision pool, and a brief that frames the college-corridor demand for that segment. Photography should reflect the lot character and zoning use rather than a generic city frame.",
    faqs: [
      {
        question: "Where is Davie in Broward County?",
        answer:
          "Davie sits in central Broward County, framed by Plantation to the north, Pembroke Pines to the south, and Fort Lauderdale and the adjacent unincorporated areas to the east. It is a separately incorporated Broward town with its own town government. Davie was first incorporated in 1925 and re-established as a municipal corporation in 1961.",
      },
      {
        question: "What is Davie's equestrian heritage?",
        answer:
          "Davie maintains an active Equestrian Trail network that runs through several named residential pockets, with zoning that supports agricultural and equestrian uses on larger lots. The town is one of the more distinctive equestrian-overlay residential markets in Broward County, and equestrian-trail access is part of the diligence conversation for buyers in those pockets.",
      },
      {
        question: "What is Tree City USA and how does it apply to Davie?",
        answer:
          "Tree City USA is a designation from the Arbor Day Foundation that recognizes municipal commitment to community forestry programs. Davie carries the designation, which corresponds to the town's tree-canopy character and ordinance approach. For buyers, the practical implication is ordinance-aware tree management and a residential character that runs cooler than higher-density Broward cities.",
      },
      {
        question: "How does Davie compare to Plantation or Weston?",
        answer:
          "Plantation sits to the north and pairs an older established residential character with newer gated-community pockets at higher density. Weston sits to the west and is largely master-planned at the Everglades perimeter. Davie is distinctly lower-density and carries the equestrian-overlay and Tree City USA character. Buyers comparing the three should weigh density, zoning use, and master-planned-versus-equestrian character.",
      },
      {
        question: "How does Mia approach a Davie search or listing?",
        answer:
          "She begins with a private conversation about the brief — equestrian / larger-lot, established subdivision, or college-corridor. The search or listing then narrows to a specific cohort with zoning and use documentation where applicable, comparable sales drawn narrowly from the right cohort, and any relevant informally available residences her network surfaces along the way.",
      },
    ],
    internalLinks: [
      { slug: "plantation", label: "Plantation" },
      { slug: "weston", label: "Weston" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
      { slug: "hollywood", label: "Hollywood" },
      { slug: "sunrise", label: "Sunrise" },
    ],
    comparisonContext:
      "Davie is the central-Broward lower-density / equestrian-overlay peer between Plantation to the north and Pembroke Pines to the south. Buyers usually compare four vectors: Plantation for the established mature-canopy connector alternative immediately north; Weston for the western-Broward master-planned alternative at the Everglades perimeter; Hollywood for the south-Broward coastal alternative with the Broadwalk and Young Circle / ArtsPark; and Fort Lauderdale for the broader anchor city to the east. The right Davie brief usually centers on whether the priority is the equestrian-overlay / larger-lot character, a named higher-density subdivision, or a college-corridor residence near NSU, Broward College, or FAU Davie.",
  },
  {
    slug: "sunrise",
    cluster: "primary",
    name: "Sunrise",
    tagline:
      "Western Broward city anchored by the Sawgrass Mills retail district and the Florida Panthers arena.",
    intro:
      "Sunrise is a western Broward municipality, incorporated in 1961 (originally as Sunrise Golf Village). The city is anchored by the Sawgrass Mills retail district on its western edge and by the BB&T Center / Amerant Bank Arena, home of the NHL Florida Panthers. The residential market spans established single-family in central Sunrise and master-planned subdivisions in the western Sawgrass Lakes corridor.",
    highlights: [
      "Western Broward County municipality, incorporated 1961 (originally Sunrise Golf Village)",
      "Sawgrass Mills retail district as a named regional landmark",
      "BB&T Center / Amerant Bank Arena — home of the NHL Florida Panthers",
      "Sawgrass Expressway, Florida Turnpike, and I-595 access",
      "Established single-family in central Sunrise plus master-planned subdivisions in the western Sawgrass Lakes corridor",
    ],
    lifestyle:
      "Sunrise suits buyers who want a western-Broward residential character with strong civic-and-retail proximity and convenient expressway access. Mia helps clients sort the established single-family in central Sunrise — the Springs and the Pine Island corridor — against the newer master-planned subdivisions in the Sawgrass Lakes corridor on the west side of the city, and frames the comparison honestly against the Weston, Coral Springs, and Plantation alternatives.",
    priceCharacter:
      "Pricing turns on the named subdivision, architectural era, and proximity to the Sawgrass Expressway or Sawgrass Mills corridor. Comparable-sales cohorts diverge by subdivision; a subdivision-specific brief outperforms a city-wide average.",
    latitude: 26.1670,
    longitude: -80.2566,
    heroImage: "/markets/sunrise.jpg",
    localContext:
      "Sunrise occupies western Broward County. The city was incorporated in 1961, originally as Sunrise Golf Village, and shifted to its current name as the residential character broadened beyond the original golf-community plan. The civic and commercial identity is anchored by the Sawgrass Mills retail district on the western perimeter and by the BB&T Center / Amerant Bank Arena, home of the NHL Florida Panthers. The Sawgrass Expressway, Florida Turnpike, and I-595 provide expressway access. The residential mix runs from established single-family in central Sunrise — the Springs, Pine Island corridor — to newer master-planned subdivisions in the western Sawgrass Lakes corridor.",
    county: "Broward County",
    aeoAnswer:
      "Sunrise is a western Broward County municipality, incorporated in 1961 (originally as Sunrise Golf Village). The city is anchored by the Sawgrass Mills retail district on its western perimeter and by the BB&T Center / Amerant Bank Arena, home of the NHL Florida Panthers. Sawgrass Expressway, Florida Turnpike, and I-595 provide expressway access. The residential market runs from established single-family in central Sunrise — the Springs and the Pine Island corridor — to newer master-planned subdivisions in the Sawgrass Lakes corridor on the west side of the city, with pricing strongly segmented by named subdivision and architectural era.",
    propertyTypes: [
      "Established single-family in central Sunrise (the Springs, Pine Island corridor)",
      "Newer master-planned single-family in the Sawgrass Lakes corridor",
      "Townhomes and villas in named Sunrise subdivisions",
      "Renovated single-family on legacy Sunrise lots",
      "Newer gated-community single-family across the western Sunrise perimeter",
    ],
    buyerGuidance:
      "Buyers in Sunrise usually start with one of two briefs: established single-family in central Sunrise (the Springs, Pine Island corridor); or newer master-planned single-family in the Sawgrass Lakes corridor on the west side. Diligence covers HOA and community-covenant scope, lot orientation, expressway-corridor sound and light impact, roof and impact-window status, and prior renovation. Buyers weighing Sunrise against Weston, Coral Springs, or Plantation should compare the named-subdivision cohort, the expressway access, and the civic-and-retail proximity.",
    sellerGuidance:
      "Sellers in Sunrise should position the residence to the named subdivision and the architectural era. Comparable-sales cohorts diverge by subdivision; a residence priced against the wrong cohort underperforms. Pre-list preparation typically includes HOA documentation, a subdivision-specific comparable-sales packet, and photography that captures the residence's specific architectural era rather than a generic 'near Sawgrass Mills' framing.",
    faqs: [
      {
        question: "Where is Sunrise in Broward County?",
        answer:
          "Sunrise sits in western Broward County, framed by Plantation to the east, Lauderhill and Tamarac to the north, Davie and Weston to the south and west. It is a separately incorporated Broward municipality with its own city government. The city was incorporated in 1961, originally as Sunrise Golf Village.",
      },
      {
        question: "What is the Sawgrass Mills retail district?",
        answer:
          "Sawgrass Mills is a large retail district on the western perimeter of Sunrise, one of the city's defining named landmarks. The district frames the western Sunrise residential cohort and is part of the daily-geography brief for buyers shopping in the Sawgrass Lakes corridor or the adjacent newer master-planned subdivisions.",
      },
      {
        question: "What is the BB&T Center / Amerant Bank Arena?",
        answer:
          "The BB&T Center, now under naming rights as Amerant Bank Arena, is the home arena of the NHL Florida Panthers and a regional event venue. Both names are publicly cited; the arena sits in Sunrise and is part of the city's civic-and-retail identity alongside the Sawgrass Mills district.",
      },
      {
        question: "How does Sunrise compare to Weston or Coral Springs?",
        answer:
          "Weston sits to the south and west at the Everglades perimeter, organized around named Arvida-era communities. Coral Springs sits to the north and is centered on the original 1963 Coral Ridge Properties master plan. Sunrise pairs the established central single-family with newer master-planned subdivisions in the Sawgrass Lakes corridor and adds the civic-and-retail spine of Sawgrass Mills and the arena.",
      },
      {
        question: "How does Mia approach a Sunrise search or listing?",
        answer:
          "She begins with a private conversation about the brief — established central single-family or newer Sawgrass Lakes master-planned. The search or listing then narrows to a specific subdivision-level cohort, with HOA documentation where applicable, comparable sales drawn narrowly from the same subdivision, and any relevant informally available residences her network surfaces along the way.",
      },
    ],
    internalLinks: [
      { slug: "plantation", label: "Plantation" },
      { slug: "weston", label: "Weston" },
      { slug: "coral-springs", label: "Coral Springs" },
      { slug: "davie", label: "Davie" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
    comparisonContext:
      "Sunrise is the western-Broward civic-and-retail anchor in the cohort framed by Weston to the south, Coral Springs to the north, and Plantation to the east. Buyers usually compare four vectors: Weston for the Arvida master-planned alternative at the Everglades perimeter; Coral Springs for the northwestern Broward Coral Ridge Properties master-planned alternative; Plantation for the central-Broward connector alternative with mature canopy; and Davie for the lower-density / equestrian-overlay alternative to the south. The right Sunrise brief usually centers on whether the priority is established central single-family along the Pine Island corridor, a newer master-planned residence in the Sawgrass Lakes corridor, or a position with strong civic-and-retail proximity to Sawgrass Mills and the arena.",
  },
];

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Cycle 14 — cluster-derived helpers (DRY refactor).
 *
 * Derived from `Market.cluster`. Replaces the hardcoded `PRIMARY_SLUGS` /
 * `NEIGHBORHOOD_SLUGS` Sets in `src/app/markets/page.tsx` and the local
 * `easternBrowardSlugs` Set in `src/app/markets/[slug]/page.tsx`. Source-array
 * order is preserved (callers that depend on display order still get it).
 * ─────────────────────────────────────────────────────────────────────────
 */

export function getMarketsByCluster(cluster: MarketCluster): ReadonlyArray<Market> {
  return MARKETS.filter((m) => m.cluster === cluster);
}

export function getPrimarySlugs(): ReadonlyArray<MarketSlug> {
  return getMarketsByCluster("primary").map((m) => m.slug);
}

export function getNeighborhoodSlugs(): ReadonlyArray<MarketSlug> {
  return getMarketsByCluster("neighborhood").map((m) => m.slug);
}

/**
 * Cycle 18 — Northern Broward waterfront (currently: Hillsboro Mile only).
 * Markets that are NOT Fort Lauderdale and NOT a "primary" city/town the way
 * the South Florida cities/towns cohort is, but belong visually next to the
 * Fort Lauderdale waterfront cluster on the /markets/ index because that's
 * the cohort serious waterfront buyers compare. See
 * docs/CYCLE_18_HILLSBORO_MILE_MARKET_TAXONOMY_FIX.md.
 */
export function getNorthernBrowardWaterfrontSlugs(): ReadonlyArray<MarketSlug> {
  return getMarketsByCluster("northern-broward-waterfront").map((m) => m.slug);
}

/**
 * Cycle 18 — Fort Lauderdale-adjacent cluster (renders under the renamed
 * "Fort Lauderdale Waterfront and Northern Broward Clusters" section on
 * `/markets/`). Source-array order preserved (neighborhoods first in their
 * original sequence, then northern-broward-waterfront in its original sequence).
 */
export function getFortLauderdaleClusterMarkets(): ReadonlyArray<Market> {
  return MARKETS.filter(
    (m) => m.cluster === "neighborhood" || m.cluster === "northern-broward-waterfront"
  );
}

/**
 * Cycle 18 — Slug list for the Fort Lauderdale cluster section. Used by
 * `[slug]/page.tsx` to recognize "this peer is rendered under the FtLaud
 * cluster heading" without claiming geography.
 */
export function getFortLauderdaleClusterSlugs(): ReadonlyArray<MarketSlug> {
  return getFortLauderdaleClusterMarkets().map((m) => m.slug);
}
