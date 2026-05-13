/**
 * Single source of truth for site-wide configuration.
 *
 * Cycle 24 Mia-Live-Decisions (2026-05-13): canonical production domain switched
 * from miasanabriarealtor.com → miasanabria.com per Mia's confirmed decision.
 * Staging stays on the trueidea.com sub-host until DNS cutover (owned by Torrey
 * + DNS owner; not in this lane). Old domain remains accessible until cutover
 * lands the 301 redirect plan documented in docs/mia-client-decision-record.md.
 *
 * Anything other than the canonical production hostname is treated as staging
 * (IS_STAGING below), which drives noindex/nofollow metadata.
 */

const STAGING_URL = "https://miasanabriarealtor.trueidea.com";
const PRODUCTION_URL = "https://miasanabria.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? STAGING_URL;

/**
 * Staging gate — drives noindex/nofollow on robots metadata until a separate
 * production-cutover packet authorizes indexable production. Anything other
 * than the canonical production hostname is treated as staging.
 */
export const IS_STAGING = !SITE_URL.startsWith(PRODUCTION_URL);

export const SITE = {
  name: "Mia Sanabria",
  fullName: "Mia Mary Sanabria",
  title: "Fort Lauderdale REALTOR® | Waterfront & Luxury Homes",
  shortTitle: "Mia Sanabria | REALTOR®",
  description:
    "Mia Sanabria, REALTOR® with LPT Realty — luxury and waterfront homes across Eastern Fort Lauderdale, Boca Raton, and Delray Beach. Private representation.",
  tagline: "Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach.",
  positioning: "Fort Lauderdale REALTOR®",
  anchorLine: "If I don't know the answer, I will find it.",
  url: SITE_URL,
  productionUrl: PRODUCTION_URL,
  ogImage: `${SITE_URL}/og-default.jpg`,
  themeColor: "#0F2A44",
  locale: "en-US",
  twitter: { card: "summary_large_image" as const },
} as const;

/**
 * Cycle 24 Mia-Live-Decisions (2026-05-13): nav order locked by Mia to:
 *   1. Neighborhoods (label) → /markets/ (route retained for SEO continuity)
 *   2. Buyers
 *   3. Sellers
 *   4. Blog (label) → /insights/ (route retained for SEO continuity)
 *   5. About
 *   6. Contact
 *   7. Search icon (rendered separately in SiteHeader.tsx with aria-label "Home Search")
 *
 * Removed from labeled top nav (still accessible elsewhere):
 *   - "Home" — replaced by logo link
 *   - "Home Valuation" — remains in footer + CTA strip + /valuation/ route
 *
 * Route slug rename (/markets/ → /neighborhoods/, /insights/ → /blog/) is
 * deferred to a separate SEO-redirect cycle owned by Torrey.
 */
export const NAV = [
  { href: "/markets/", label: "Neighborhoods" },
  { href: "/buyers/", label: "Buyers" },
  { href: "/sellers/", label: "Sellers" },
  { href: "/insights/", label: "Blog" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

/** Search icon target; renders as an icon button in SiteHeader (Cycle 24). */
export const SEARCH_ICON_HREF = "/markets/#property-search" as const;

export const FOOTER_NAV = {
  explore: [
    { href: "/markets/", label: "Featured Markets" },
    { href: "/buyers/", label: "Buying" },
    { href: "/sellers/", label: "Selling" },
    { href: "/valuation/", label: "Home Valuation" },
    { href: "/insights/", label: "Insights" },
  ],
  about: [
    { href: "/about/", label: "About Mia" },
    { href: "/contact/", label: "Contact" },
  ],
  legal: [
    { href: "/privacy/", label: "Privacy Policy" },
    { href: "/terms/", label: "Terms of Service" },
    { href: "/accessibility/", label: "Accessibility" },
    { href: "/dmca/", label: "DMCA" },
  ],
} as const;
