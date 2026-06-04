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
    // Public displayed email canonicalized to mia@miasanabria.com on 2026-05-18
    // (docs/artifacts/cycle-public-email-canonicalization/). Legacy msanabriarea@gmail.com
    // may remain only as private/backend lead-alert routing; it is forbidden from public
    // rendered HTML and enforced by scripts/audit-public-email.ts.
    email: "mia@miasanabria.com",
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
  tracking: {
    ga4Id: (process.env.NEXT_PUBLIC_GA_ID ?? null) as string | null,
    userwayId: (process.env.NEXT_PUBLIC_USERWAY_ID ?? null) as string | null,
  },
  unverified: {
    // SL3405877 cited across multiple public-web sources (LPT Realty agent listing pages, MLS profile pages,
    // Klein Morgan agent legacy page) as Mia's Florida Sales Associate license number. NAR / Florida Realtors /
    // Broward, Palm Beaches & St. Lucie REALTORS® membership cited in the same sources — satisfies the NAR
    // Membership Marks Manual prerequisite for REALTOR® R logo display. DBPR primary-source confirmation by
    // Mia is the final pre-.com-cutover gate; placeholder remains `unverified.*` until then.
    //
    // Cycle 24 Mia-Live-Decisions (2026-05-13): Mia verbally confirmed the license number is correct AND
    // approved the six designations below for display. Per the file-level docstring, fields stay in the
    // `unverified` block until a written attestation lands; they are now populated rather than empty so
    // downstream schema / About / footer components can read the canonical set. Site components must still
    // gate visible display on a separate verified attestation flag before publishing to production.
    licenseNumber: "SL3405877" as string | null,
    designations: ["PSA", "RENE", "CDPE", "ABR", "SFR", "AHWD"] as string[],
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
  // Cycle 18 — Pompano Beach added as a primary South Florida cities-and-towns market.
  "pompano-beach",
  // Cycle 25 — seven Mia-approved Broward neighborhoods registered as primary
  // cities-and-towns markets. Slug order matches the implementation-engineer
  // memo's content-adjacency apply order (coastal cohort first; western-Broward
  // master-planned cohort last). docs/mia-client-decision-record.md is the
  // authoritative source for the nine-city approved working set.
  "deerfield-beach",
  "hollywood",
  "plantation",
  "weston",
  "coral-springs",
  // Cycle 2026-06-01 (About + 7-market refresh) — Parkland added as a primary
  // northwestern Broward market. Mia named it in her supplied "Areas Served"
  // list. Inland, master-planned; hero/OG generated via the Gemini image
  // pipeline (scripts/generate-parkland-images.ts), unversioned filenames.
  "parkland",
  "davie",
  "sunrise",
] as const;

export type MarketSlug = (typeof ALL_MARKET_SLUGS)[number];

/**
 * Cycle 16 — Featured Markets discriminator.
 *
 * Two related but separate concepts:
 *   - FEATURED_SET — the SET of markets considered "featured" (drives audit,
 *     index emphasis, and any "featured" sub-collection). Cycle 16 expanded from
 *     8 → 12 to admit palm-beach + lighthouse-point + coral-ridge + rio-vista
 *     per principal direction on homepage first-page composition.
 *   - HOMEPAGE_FEATURED_ORDER — the EXPLICIT ORDERED LIST used by the homepage
 *     Featured Markets pager. Principal locked the first 6 (Decision Register
 *     Cycle 16 §1). Order is intentional, not array-order-coincidental.
 */
const FEATURED_SET: ReadonlySet<MarketSlug> = new Set<MarketSlug>([
  "fort-lauderdale",
  "boca-raton",
  "palm-beach",
  "victoria-park",
  "lighthouse-point",
  "delray-beach",
  "las-olas-isles",
  "harbor-beach",
  "bay-colony",
  "bermuda-riviera",
  "coral-ridge",
  "rio-vista",
]);

export const FEATURED_MARKETS: ReadonlyArray<MarketSlug> = ALL_MARKET_SLUGS.filter(
  (slug) => FEATURED_SET.has(slug)
);

/**
 * Cycle 16 — Homepage Featured Markets pager order (12 slugs, 2 pages of 6).
 *
 * First page (principal-locked, Decision Register §1):
 *   Fort Lauderdale, Boca Raton, Palm Beach, Victoria Park, Lighthouse Point, Delray Beach.
 *
 * Second page (Cycle 16 editorial curation by cohort/familiarity):
 *   Las Olas Isles, Harbor Beach, Bay Colony, Bermuda Riviera, Coral Ridge, Rio Vista.
 *
 * Audit:featured-markets enforces this order matches principal direction.
 */
export const HOMEPAGE_FEATURED_ORDER: ReadonlyArray<MarketSlug> = [
  "fort-lauderdale",
  "boca-raton",
  "palm-beach",
  "victoria-park",
  "lighthouse-point",
  "delray-beach",
  "las-olas-isles",
  "harbor-beach",
  "bay-colony",
  "bermuda-riviera",
  "coral-ridge",
  "rio-vista",
];

export const HOMEPAGE_FEATURED_PAGE_SIZE = 6 as const;

/**
 * Cycle 24 Mia-Live-Decisions (2026-05-13): Mia confirmed her canonical
 * neighborhood working set — the 9 Broward cities below. This list is the
 * single source of truth for "Neighborhoods" nav emphasis going forward.
 *
 * Coverage state vs existing market routes is tracked in
 * docs/mia-client-decision-record.md. Two slugs already have market pages
 * (`fort-lauderdale`, `pompano-beach`); the other seven are content gaps
 * requiring Mia copy + photos in a separate cycle.
 *
 * Legacy markets in MARKETS / ALL_MARKET_SLUGS that are NOT on this list
 * remain in place this cycle for SEO continuity (per mission boundary "avoid
 * destructive removal unless safe"); their retain-vs-redirect-vs-deprecate
 * decision is a separate Mia-content cycle.
 */
export const MIA_APPROVED_NEIGHBORHOODS = [
  { slug: "fort-lauderdale", label: "Fort Lauderdale", hasPage: true },
  { slug: "pompano-beach", label: "Pompano Beach", hasPage: true },
  // Cycle 25 — seven Broward cities promoted from `hasPage: false` to `true`.
  // Backing /markets/<slug>/ pages added in the same cycle; brand-tone
  // placeholder hero JPGs are stand-ins until Mia provides licensed photography.
  { slug: "deerfield-beach", label: "Deerfield Beach", hasPage: true },
  { slug: "coral-springs", label: "Coral Springs", hasPage: true },
  { slug: "plantation", label: "Plantation", hasPage: true },
  { slug: "weston", label: "Weston", hasPage: true },
  { slug: "hollywood", label: "Hollywood", hasPage: true },
  { slug: "davie", label: "Davie", hasPage: true },
  { slug: "sunrise", label: "Sunrise", hasPage: true },
] as const;

export type MiaApprovedNeighborhoodSlug =
  (typeof MIA_APPROVED_NEIGHBORHOODS)[number]["slug"];

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

/**
 * Cycle 39 (2026-05-16) — slugs whose card+detail+OG image assets were
 * republished at versioned paths to defeat browser/CDN cache ambiguity
 * after Cycle 38's in-place replacement failed to land in operator-visible
 * browsers. The set is the authoritative source for both runtime image URLs
 * (via the helpers below) and the deep-image audit. Adding or removing a
 * slug requires the corresponding versioned files on disk and a matching
 * change in `src/lib/markets.ts` `heroImage:` literal.
 *
 * Cycle 40B (2026-05-16) — same slugs republished at `-cycle40b` after a
 * multi-candidate (3-per-slug) scored generation workflow. Cycle 40B
 * supersedes Cycle 39 for these seven slugs; the Cycle 39 files remain on
 * disk as fallback evidence and audit context until a future Bitter Pill
 * cleanup cycle removes them. The version helper below resolves to
 * Cycle 40B first, with Cycle 39 retained only as a lookup-table fallback
 * (not used at runtime since both sets cover the same 7 slugs).
 */
export const MIA_CYCLE_39_VERSIONED_SLUGS: ReadonlySet<MarketSlug> = new Set<MarketSlug>([
  "deerfield-beach",
  "hollywood",
  "plantation",
  "weston",
  "coral-springs",
  "davie",
  "sunrise",
]);

export const MIA_CYCLE_40B_VERSIONED_SLUGS: ReadonlySet<MarketSlug> = new Set<MarketSlug>([
  "deerfield-beach",
  "hollywood",
  "plantation",
  "weston",
  "coral-springs",
  "davie",
  "sunrise",
]);

const CYCLE_39_VERSION_SUFFIX = "-cycle39";
const CYCLE_40B_VERSION_SUFFIX = "-cycle40b";

function imageSuffixForSlug(slug: MarketSlug): string {
  if (MIA_CYCLE_40B_VERSIONED_SLUGS.has(slug)) return CYCLE_40B_VERSION_SUFFIX;
  if (MIA_CYCLE_39_VERSIONED_SLUGS.has(slug)) return CYCLE_39_VERSION_SUFFIX;
  return "";
}

export function getMarketImagePath(slug: MarketSlug): string {
  return `/markets/${slug}${imageSuffixForSlug(slug)}.jpg`;
}

export function getMarketOgImagePath(slug: MarketSlug): string {
  return `/og-markets/${slug}${imageSuffixForSlug(slug)}.jpg`;
}
