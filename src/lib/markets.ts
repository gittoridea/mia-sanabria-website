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
};

export const MARKETS: ReadonlyArray<Market> = [
  {
    slug: "boca-raton",
    name: "Boca Raton",
    tagline: "Where Mediterranean architecture meets coastal sophistication.",
    intro:
      "Boca Raton is Southeast Florida's polished northern anchor — a city where Addison Mizner's Mediterranean Revival heritage shapes residential expectations and where master-planned country-club estates trade alongside oceanfront condominiums and Intracoastal compounds. Buyers come for the privacy, the schooling, the dining at Mizner Park and Royal Palm Place, and the rare combination of cultural depth and barefoot proximity to the Atlantic.",
    highlights: [
      "Royal Palm Yacht & Country Club estates with private dockage",
      "Oceanfront and oceanview condominiums in The Sanctuary, Sea Ranch, Mizner Tower",
      "Country-club living at St. Andrews, The Polo Club, Boca West, Woodfield",
      "Walkable Mizner Park lifestyle — dining, gallery row, Boca Raton Museum of Art",
      "A-rated public schools and proximity to Pine Crest, Saint Andrew's, Boca Prep",
    ],
    lifestyle:
      "Boca Raton lives in two registers: the country-club rhythm of golf, tennis, and members-only dining; and the coastal-cultural cadence of beach club mornings, gallery openings, and small-plate evenings on Plaza Real. Both reward residents who value discretion and craft over spectacle.",
    priceCharacter:
      "Country-club residences begin in the seven figures; oceanfront and Royal Palm waterfront properties move comfortably into the eight figures.",
    latitude: 26.3683,
    longitude: -80.1289,
    heroImage: "/markets/boca-raton.svg",
  },
  {
    slug: "fort-lauderdale",
    name: "Fort Lauderdale",
    tagline: "The Venice of America — where every estate is a yacht apart.",
    intro:
      "Fort Lauderdale is the rare American city where the deepwater finger-isle home is the architectural protagonist and where 165 miles of navigable waterways shape daily life. Las Olas Isles, Harbor Beach, Rio Vista, and the barrier-island enclaves combine yachting infrastructure, walkable downtown culture, and oceanfront luxury into a single market — making it Mia's home market and her deepest area of fluency.",
    highlights: [
      "Las Olas Isles deepwater estates with private dockage and ocean access",
      "Harbor Beach Marina compounds — gated waterfront with oceanfront beach club",
      "Rio Vista and Tarpon River historic neighborhoods with new-construction depth",
      "Las Olas Boulevard culture — boutiques, gallery row, dining, the Riverwalk",
      "Direct ocean access via Port Everglades and a 15-minute drive to FXE / FLL",
    ],
    lifestyle:
      "Mornings on the water, afternoons at the Riverwalk or Bonnet House gardens, evenings on Las Olas — the Fort Lauderdale rhythm rewards homeowners who treat the dock as a primary amenity. Yacht-club membership, marina-adjacent residences, and oceanfront tower options give every buyer a path to the water.",
    priceCharacter:
      "Las Olas Isles waterfront estates trade from $4M into $30M+; Harbor Beach compounds clear $10M; well-positioned non-waterfront in Rio Vista and Victoria Park range from low seven figures upward.",
    latitude: 26.1224,
    longitude: -80.1373,
    heroImage: "/markets/fort-lauderdale.svg",
  },
  {
    slug: "palm-beach",
    name: "Palm Beach",
    tagline: "An island measured in legacy, not square footage.",
    intro:
      "Palm Beach is the most concentrated luxury market in the United States — a 16-mile barrier island where landmark Mizner, Volk, and Fatio estates have changed hands among a small set of families for nearly a century. Buying here means engaging a particular ecosystem: zoning council, Worth Avenue's old-line retailers, the Bath & Tennis tradition, and a brokerage culture where off-market is the rule, not the exception.",
    highlights: [
      "Estate Section Mediterranean Revival residences (Mizner, Volk, Fatio originals)",
      "North End oceanfront and Intracoastal compounds with deepwater dockage",
      "In-Town Palm Beach pieds-à-terre near Worth Avenue",
      "Membership-driven lifestyle — Bath & Tennis, Everglades, Mar-a-Lago, Palm Beach Country Club",
      "Worth Avenue's old-line retail and the Royal Poinciana Plaza",
    ],
    lifestyle:
      "Palm Beach rewards quiet capital and architectural literacy. Days move between the club, the studio, and the avenue; the residence itself is a primary cultural artifact. Off-market access, restoration discipline, and zoning-council fluency separate brokers who can close from those who cannot.",
    priceCharacter:
      "Entry oceanfront condominiums begin in the low eight figures; landmark Estate Section properties trade routinely above $30M and into nine figures for direct-oceanfront compounds.",
    latitude: 26.7056,
    longitude: -80.0364,
    heroImage: "/markets/palm-beach.svg",
  },
  {
    slug: "delray-beach",
    name: "Delray Beach",
    tagline: "Atlantic Avenue's village heart with luxury at the edges.",
    intro:
      "Delray Beach has earned its reputation as Florida's best small-town main street — Atlantic Avenue's gallery row and dining cluster ground a community that extends from the oceanfront on the east to country-club estate enclaves on the west. The market combines walkable coastal living with a deeper inventory of mid-eight-figure waterfront and country-club estates than its modest profile suggests.",
    highlights: [
      "Oceanfront and ocean-block residences along South Ocean Boulevard",
      "Atlantic Avenue walkable lifestyle — Pineapple Grove, art galleries, dining",
      "Mizner Country Club, Stone Creek Ranch, and Seven Bridges luxury estates",
      "Historic Marina District and Lake Ida enclaves",
      "20-minute drive to Boca Raton, 35 minutes to West Palm Beach",
    ],
    lifestyle:
      "Delray balances small-village pace with serious cultural infrastructure — the Pineapple Grove arts district, the Cornell Museum, and a dining scene that reads bigger than the city's footprint. Country-club residents commute to Atlantic Avenue rather than escaping it.",
    priceCharacter:
      "Oceanfront residences trade from the mid seven figures into the mid eight figures; country-club estates west of I-95 range broadly from the $1.5M cap range up to high seven figures.",
    latitude: 26.4615,
    longitude: -80.0728,
    heroImage: "/markets/delray-beach.svg",
  },
  {
    slug: "lighthouse-point",
    name: "Lighthouse Point",
    tagline: "A boater's enclave where the dock is the front door.",
    intro:
      "Lighthouse Point is a small, quietly affluent municipality north of Fort Lauderdale, defined entirely by its canal-cut deepwater geography. Nearly every homesite is on water, the Hillsboro Inlet provides the most direct ocean access on the South Florida coast, and the community character is fundamentally a boater's community — yacht-club centered, low-rise, and protected from spillover from larger neighbors.",
    highlights: [
      "Deepwater canal residences with no fixed bridges to ocean",
      "Hillsboro Inlet — direct, fast ocean access for sportfishing and yachting",
      "Lighthouse Point Yacht Club tradition",
      "Single-family-only zoning preserves the low-rise character",
      "Walkable proximity to Pompano Beach restaurants and the Sands Harbor area",
    ],
    lifestyle:
      "Buy in Lighthouse Point if you intend to live on the water — the dock, the boat, the inlet ten minutes away — every day. The market is small, well-known to a tight set of brokers, and rewards patience for the right deepwater turn-key estate to surface.",
    priceCharacter:
      "Canal-front and point-lot residences typically trade from $2.5M into the high seven figures; new-construction deepwater estates clear $8M with regularity.",
    latitude: 26.2756,
    longitude: -80.0875,
    heroImage: "/markets/lighthouse-point.svg",
  },
  {
    slug: "victoria-park",
    name: "Victoria Park",
    tagline: "The walkable historic heart of Fort Lauderdale.",
    intro:
      "Victoria Park is Fort Lauderdale's most desirable in-town historic neighborhood — a walkable, tree-canopied grid of 1920s Mediterranean Revival cottages and tasteful new-construction homes, bordered by Las Olas Boulevard, Sunrise Boulevard, and the Holiday Park amenities. Buyers choose Victoria Park when they want Fort Lauderdale's downtown culture without surrendering single-family yard, garage, and pool.",
    highlights: [
      "Walkable to Las Olas Boulevard dining and gallery row",
      "Holiday Park — tennis center, ArtServe, the Parker Playhouse",
      "1920s Mediterranean Revival architecture protected by historic-district overlays",
      "New-construction and tasteful renovations on 50-foot interior lots",
      "Direct access to downtown Fort Lauderdale and the beach corridor",
    ],
    lifestyle:
      "Victoria Park lives at walking pace — coffee on Las Olas, tennis at Holiday Park, dinner at the Riverwalk. The neighborhood holds its luxury in the renovation quality and the canopy, not in private gates and country-club fees.",
    priceCharacter:
      "Renovated historic cottages range from the low to mid seven figures; new-construction Victoria Park homes trade in the high seven figures and into the low eight figures for premium lots.",
    latitude: 26.1303,
    longitude: -80.1244,
    heroImage: "/markets/victoria-park.svg",
  },
  {
    slug: "coral-ridge",
    name: "Coral Ridge",
    tagline: "Mid-century waterfront living, redrawn for a new generation.",
    intro:
      "Coral Ridge is Fort Lauderdale's classic mid-century waterfront neighborhood — wide canal-cut lots, the Coral Ridge Country Club at its center, and a steady supply of teardown-and-rebuild opportunity that has turned the area into one of South Florida's most active luxury new-construction markets. Buyers come for the lot quality, the country-club anchor, and the walkable Coral Ridge Mall corridor.",
    highlights: [
      "Coral Ridge Country Club golf, tennis, and dining tradition",
      "Wide deepwater canals with direct Intracoastal access",
      "Active luxury new-construction market — modern coastal architecture on classic lots",
      "Coral Ridge Mall corridor — Trader Joe's, Whole Foods, neighborhood retail",
      "10-minute drive to Las Olas, the beach, and downtown Fort Lauderdale",
    ],
    lifestyle:
      "Coral Ridge buyers tend to commission the residence, not just buy it. The neighborhood is the proof point of Fort Lauderdale's design talent — architects, landscape teams, and builders who have refined a recognizable coastal-modern vocabulary on classic mid-century lots.",
    priceCharacter:
      "Renovated waterfront residences trade from the mid seven figures; new-construction deepwater Coral Ridge estates routinely clear $8M and reach into the low eight figures for premium lots.",
    latitude: 26.1638,
    longitude: -80.1136,
    heroImage: "/markets/coral-ridge.svg",
  },
];

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}
