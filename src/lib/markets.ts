import type { MarketSlug } from "./mia";

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
  /** One concrete neighborhood/landmark fact used for AEO differentiation in FAQ. */
  readonly localContext: string;
  /** County the market sits in — used in schema and copy. */
  readonly county: "Broward County" | "Palm Beach County" | "Miami-Dade County";
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
      "Concierge guidance from first consultation through closing coordination",
    ],
    lifestyle:
      "Fort Lauderdale combines boating, beach access, downtown dining, and established residential neighborhoods. Mia helps clients compare the tradeoffs between water access, walkability, renovation needs, and long-term fit.",
    priceCharacter:
      "Pricing changes block by block. Request a current market conversation before relying on public estimates or broad online ranges.",
    latitude: 26.1224,
    longitude: -80.1373,
    heroImage: "/markets/fort-lauderdale.svg",
    localContext:
      "Fort Lauderdale stretches from the Atlantic across the Intracoastal to the New River and downtown — buyer briefs typically segment by water access (deep-water dockage vs. fixed-bridge), proximity to Las Olas, and beach corridor.",
    county: "Broward County",
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
    heroImage: "/markets/coral-ridge.svg",
    localContext:
      "Coral Ridge sits north of Sunrise Boulevard between the Intracoastal and Federal Highway, anchored by the Coral Ridge Country Club. The waterfront streets along the finger isles trade differently from the interior blocks — a brief that confuses the two will price wrong.",
    county: "Broward County",
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
    heroImage: "/markets/victoria-park.svg",
    localContext:
      "Victoria Park is the in-town Fort Lauderdale neighborhood immediately east of Federal Highway, framed by Sunrise Boulevard, the Middle River, and Holiday Park. Block-by-block character changes quickly — historic bungalows, mid-century cottages, contemporary new builds, and townhomes coexist within walking distance.",
    county: "Broward County",
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
    heroImage: "/markets/boca-raton.svg",
    localContext:
      "Boca Raton spans from the Atlantic west into central Palm Beach County, with distinct micro-markets along A1A, the East Boca grid, the Royal Palm and Boca Bay Colony estate sections, and the gated club communities west of I-95. Each set has its own buyer profile, fee structure, and resale dynamics.",
    county: "Palm Beach County",
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
    heroImage: "/markets/palm-beach.svg",
    localContext:
      "The Town of Palm Beach is a barrier island with strict building review, established estate sections in the North End and South End, and the Worth Avenue / Mid-Town corridor in between. Off-island, the Palm Beach area extends through West Palm Beach and the Intracoastal communities — buyer briefs need to specify which side of the bridges.",
    county: "Palm Beach County",
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
    heroImage: "/markets/delray-beach.svg",
    localContext:
      "Delray Beach centers on Atlantic Avenue, with beach blocks east of A1A, the historic Marina District and Pineapple Grove just inland, and established residential pockets like Lake Ida and Tropic Isle pushing west and south. The walkable downtown is the demand driver — distance to it shapes pricing as much as the property itself.",
    county: "Palm Beach County",
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
    heroImage: "/markets/lighthouse-point.svg",
    localContext:
      "Lighthouse Point is a small Broward city north of Pompano Beach with a network of finger isles and ocean-access canals. Property evaluation hinges on the canal — bridge clearances, water depth, seawall condition, and dockage capacity vary block by block and have a larger pricing impact than square footage.",
    county: "Broward County",
  },
];

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}
