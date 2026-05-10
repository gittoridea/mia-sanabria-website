/**
 * Verified facts from PUBLIC_FACT_LEDGER v2 (~/.claude/PAI/USER/PROJECTS/MiaSanabria/).
 * Candidate / unverified fields stay null or empty until Mia confirms in writing.
 * Schema components must read from this file — never inline unverified facts.
 */

export const MIA = {
  name: { legal: "Mia Mary Sanabria", marketing: "Mia Sanabria" },
  title: "REALTOR®",
  brokerage: {
    legal: "LPT Realty LLC",
    display: "LPT Realty",
    headquarters: {
      street: "1400 S International Parkway",
      city: "Lake Mary",
      region: "FL",
      postalCode: "32746",
      country: "US",
    },
  },
  contact: {
    phone: "(954) 540-0358",
    phoneTel: "+19545400358",
    email: "msanabriarea@gmail.com",
    serviceCore: { city: "Fort Lauderdale", region: "FL", postalCode: "33305" },
  },
  social: {
    facebook: "https://www.facebook.com/miasanrea/",
    instagram: "https://www.instagram.com/mia_sanabria_realtor/",
    linkedin: "https://www.linkedin.com/in/miasanrea/",
    youtube: "https://www.youtube.com/channel/UCXQwnpWflWRRtYuO9QX1jvg",
  },
  voice: {
    tagline: "Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach.",
    positioning: "Fort Lauderdale REALTOR®",
    anchorLine: "If I don't know the answer, I will find it.",
  },
  tracking: { ga4Id: "G-PYYSF87G8K", userwayId: "vVNkJJLvR4" },
  unverified: {
    // SL3405877 cited across multiple public-web sources (LPT Realty agent listing pages, MLS profile pages,
    // Klein Morgan agent legacy page) as Mia's Florida Sales Associate license number. NAR / Florida Realtors /
    // Broward, Palm Beaches & St. Lucie REALTORS® membership cited in the same sources — satisfies the NAR
    // Membership Marks Manual prerequisite for REALTOR® R logo display. DBPR primary-source confirmation by
    // Mia is the final pre-.com-cutover gate; placeholder remains `unverified.*` until then.
    licenseNumber: "SL3405877" as string | null,
    designations: [] as string[],
    languages: ["English"] as const,
    yearsLicensed: null as string | null,
    displayOffice: null as string | null,
  },
  experience: { since: null as string | null },
  serviceArea: {
    administrative: ["Eastern Fort Lauderdale", "Eastern Boca Raton", "Eastern Delray Beach"],
  },
} as const;

export const ALL_MARKET_SLUGS = [
  "fort-lauderdale",
  "coral-ridge",
  "victoria-park",
  "boca-raton",
  "palm-beach",
  "delray-beach",
  "lighthouse-point",
  "rio-vista",
  "harbor-beach",
  "las-olas-isles",
  "seven-isles",
  "sea-ranch-lakes",
  "hillsboro-mile",
  "bay-colony",
  "bermuda-riviera",
] as const;

export type MarketSlug = (typeof ALL_MARKET_SLUGS)[number];

const FEATURED_SET: ReadonlySet<MarketSlug> = new Set<MarketSlug>([
  "fort-lauderdale",
  "las-olas-isles",
  "harbor-beach",
  "victoria-park",
  "boca-raton",
  "delray-beach",
  "bay-colony",
  "bermuda-riviera",
]);

export const FEATURED_MARKETS: ReadonlyArray<MarketSlug> = ALL_MARKET_SLUGS.filter(
  (slug) => FEATURED_SET.has(slug)
);

/* ─────────────────────────────────────────────────────────────────────────
 * Cycle 14 — canonical route + image-path helpers (DRY refactor).
 *
 * These operate only on slugs (no `MARKETS` data dependency), so they can be
 * imported from anywhere — Bun-runnable audit scripts and Next.js components
 * alike — without circular-import risk. Helpers that need `MARKETS` live in
 * `markets.ts` (cluster derivation, `getMarket`, etc.).
 * ─────────────────────────────────────────────────────────────────────────
 */

export const MARKETS_INDEX_ROUTE = "/markets/" as const;

export function getMarketRoute(slug: MarketSlug): string {
  return `/markets/${slug}/`;
}

export function getAllMarketRoutes(): ReadonlyArray<string> {
  return ALL_MARKET_SLUGS.map((slug) => getMarketRoute(slug));
}

export function getAllMarketRoutesIncludingIndex(): ReadonlyArray<string> {
  return [MARKETS_INDEX_ROUTE, ...getAllMarketRoutes()];
}

export function getFeaturedMarketSlugs(): ReadonlyArray<MarketSlug> {
  return FEATURED_MARKETS;
}

export function getFeaturedMarketRoutes(): ReadonlyArray<string> {
  return FEATURED_MARKETS.map((slug) => getMarketRoute(slug));
}

export function getMarketImagePath(slug: MarketSlug): string {
  return `/markets/${slug}.jpg`;
}

export function getMarketOgImagePath(slug: MarketSlug): string {
  return `/og-markets/${slug}.jpg`;
}
