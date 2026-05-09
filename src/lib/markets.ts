import type { MarketSlug } from "./mia";

export type MarketFaq = {
  readonly question: string;
  readonly answer: string;
};

export type MarketInternalLink = {
  readonly slug: MarketSlug;
  readonly label: string;
};

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
  /** 2-4 cross-pollination links to related markets/neighborhoods. */
  readonly internalLinks: ReadonlyArray<MarketInternalLink>;
};

export const MARKETS: ReadonlyArray<Market> = [
  {
    slug: "fort-lauderdale",
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
      "Known globally as the 'Venice of America,' Fort Lauderdale is the undisputed yachting capital of the world.",
    aeoAnswer:
      "Fort Lauderdale is known for waterfront luxury living anchored by more than 165 miles of inland canals — the reason it is called the Venice of America. The city pairs deepwater yacht-capable residences along the Intracoastal and finger isles with established in-town neighborhoods near Las Olas Boulevard, the beach corridor on A1A, and downtown's Riverwalk. Buyers compare ocean access, walkability, and architectural era; sellers position on dockage, lot, and condition. Port Everglades, Fort Lauderdale-Hollywood International Airport, and the Las Olas-to-beach axis frame the daily-life geography that makes the market distinct in South Florida.",
    propertyTypes: [
      "Deepwater single-family residences with private dockage",
      "Beach-corridor condominiums east of the Intracoastal",
      "In-town historic and renovated cottages near Las Olas",
      "Contemporary new-build estates on the finger isles",
      "Townhomes and boutique low-rise condos in walkable pockets",
    ],
    buyerGuidance:
      "Fort Lauderdale suits buyers who want a real city alongside deepwater boating, beach access, and a recognizable downtown. The first decision is almost always water — ocean access via the Intracoastal versus fixed-bridge canals — followed by walkability and architectural era. Buyers should plan diligence around seawall condition, dock capacity, flood zone, hurricane shutters, and renovation history. A clear brief on lifestyle priorities makes the search decisive rather than scattered across too many neighborhoods at once.",
    sellerGuidance:
      "Sellers in Fort Lauderdale should position to one of three buyer profiles: yachting and waterfront, in-town walkability, or beach-corridor lifestyle. Local representation matters because pricing turns on dockage specifics, lot orientation, and street-level reputation that public estimates miss. Pre-list preparation typically includes seawall and dock confirmation, light staging tuned to the buyer pool, and a comparable-sales brief that separates renovated trades from estate-condition sales. The home should tell one clear story before it lists.",
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
    ],
  },
  {
    slug: "coral-ridge",
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
    ],
  },
  {
    slug: "victoria-park",
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
  },
  {
    slug: "boca-raton",
    name: "Boca Raton",
    tagline: "Coastal, club, and city access across South Palm Beach County.",
    intro:
      "Boca Raton gives buyers a broad set of options, from coastal condominiums and single-family neighborhoods to club communities. The right match depends on lifestyle, fees, commute, schools, building condition, and long-term ownership goals.",
    highlights: [
      "Coastal, in-town, and club-community options",
      "Access to shopping, dining, beaches, parks, and cultural amenities",
      "Detailed review of association rules, fees, reserves, and maintenance profile",
      "Buyer guidance that narrows searches before showings begin",
      "Seller guidance that positions the home against the right comparable set",
    ],
    lifestyle:
      "Boca Raton rewards clarity. Mia helps clients decide whether the priority is beach proximity, club amenities, school access, walkability, or a quieter residential setting.",
    priceCharacter:
      "Pricing varies widely by property type and community. Start with current comps rather than a generic market average.",
    latitude: 26.3683,
    longitude: -80.1289,
    heroImage: "/markets/boca-raton.jpg",
    localContext:
      "Boca Raton spans from the Atlantic west into central Palm Beach County, with distinct micro-markets along A1A, the East Boca grid, the Royal Palm and Boca Bay Colony estate sections, and the gated club communities west of I-95. Each set has its own buyer profile, fee structure, and resale dynamics.",
    county: "Palm Beach County",
    miaQuote:
      "Boca Raton represents the absolute zenith of South Florida luxury living — renowned globally for its pristine beaches, Mediterranean Revival architecture, and an unparalleled standard of living.",
    aeoAnswer:
      "Boca Raton is a south Palm Beach County city known for layered luxury — Mediterranean Revival architecture inherited from Addison Mizner, ocean-access estate sections like Royal Palm Yacht & Country Club and Boca Bay Colony, A1A coastal condominiums, and gated club communities west of I-95. The market spans single-family waterfront, beach-corridor high-rises, golf-club estates, and family-oriented residential pockets near top-rated schools. Boca's distinguishing features are the architectural continuity east of the Intracoastal, the breadth of club lifestyles, and the balance between resort feel and full-time residential community. Buyers shop across very different micro-markets within one city.",
    propertyTypes: [
      "Royal Palm and Boca Bay Colony deepwater estates",
      "A1A oceanfront and beach-corridor condominiums",
      "East Boca single-family residences in walkable grid blocks",
      "Gated club-community estates west of I-95",
      "Townhomes and boutique condominiums near Mizner Park",
    ],
    buyerGuidance:
      "Boca Raton suits buyers who want optionality — beach, club, or family-residential — within one city. The first decision is east versus west of I-95, which separates the coastal and downtown markets from the gated golf and tennis communities. Diligence on condominiums focuses on association reserves, special assessments, milestone-inspection status, and pet/rental rules. Diligence on club communities focuses on membership transfer rules, equity contributions, and capital fees. Buyers benefit from naming the specific lifestyle priority before touring.",
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
          "East Boca, generally east of I-95, includes the coastal estates, A1A condominiums, downtown and Mizner Park, and walkable single-family grids. West Boca, generally west of I-95, is the gated club-community territory — golf, tennis, and family-oriented neighborhoods. The two markets attract different buyers and trade on different drivers.",
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
          "She begins with a brief that names the lifestyle priority — beach, club, family-residential, or yacht — and the timing. From there she narrows to two or three micro-markets, prepares current comparable sales, and reviews association or club rules in detail before recommending showings. The goal is a focused short list, not a broad tour of the city.",
      },
    ],
    internalLinks: [
      { slug: "delray-beach", label: "Delray Beach" },
      { slug: "palm-beach", label: "Palm Beach" },
      { slug: "fort-lauderdale", label: "Fort Lauderdale" },
    ],
  },
  {
    slug: "palm-beach",
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
      "Palm Beach stands as the absolute pinnacle of generational wealth and exclusivity.",
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
      "Delray Beach can suit clients who want restaurants, beach access, and neighborhood living in one search area. The details of building, block, and condition matter.",
    priceCharacter:
      "Pricing changes by beach proximity, building, condition, and neighborhood. Mia can prepare a current comparison for the exact search or address.",
    latitude: 26.4615,
    longitude: -80.0728,
    heroImage: "/markets/delray-beach.jpg",
    localContext:
      "Delray Beach centers on Atlantic Avenue, with beach blocks east of A1A, the historic Marina District and Pineapple Grove just inland, and established residential pockets like Lake Ida and Tropic Isle pushing west and south. The walkable downtown is the demand driver — distance to it shapes pricing as much as the property itself.",
    county: "Palm Beach County",
    miaQuote:
      "Delray Beach perfectly captures the essence of vibrant coastal luxury. Known as the 'Village by the Sea,' this dynamic enclave seamlessly blends the energetic, culturally rich atmosphere of a world-class downtown with the secluded, ultra-luxurious lifestyle of South Florida's most coveted coastlines.",
    aeoAnswer:
      "Delray Beach, the self-styled Village by the Sea in central Palm Beach County, is known for a walkable Atlantic Avenue downtown that anchors the broader market. East of Federal Highway, the Marina District and Pineapple Grove offer historic blocks and boutique condominiums minutes from the beach. The residential heart includes Lake Ida north of Atlantic, Tropic Isle and Pelican Harbor south on the Intracoastal, and beach-corridor condominiums east of A1A. Distance to downtown is the dominant pricing variable across most of the city — properties that walk to Atlantic Avenue trade differently from those that drive — and that proximity defines how buyers and sellers should think about positioning.",
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
  },
  {
    slug: "lighthouse-point",
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
      "Lighthouse Point is the ultimate sanctuary for the avid boater and yachtsman — an exclusive nautical enclave globally recognized for its pristine deep-water canals, offering seamless, no-fixed-bridge access to the Atlantic Ocean via the Hillsboro Inlet.",
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
    ],
  },
  {
    slug: "rio-vista",
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
    ],
  },
  {
    slug: "las-olas-isles",
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
    ],
  },
  {
    slug: "seven-isles",
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
    ],
  },
];

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}
