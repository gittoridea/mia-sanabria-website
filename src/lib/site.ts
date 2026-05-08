/**
 * Single source of truth for site-wide configuration.
 * Production URL flips to miasanabriarealtor.com at cutover; staging can be overridden with NEXT_PUBLIC_SITE_URL.
 */

const STAGING_URL = "https://miasanabriarealtor.trueidea.com";
const PRODUCTION_URL = "https://miasanabriarealtor.com";

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
  title: "Fort Lauderdale REALTOR® | Waterfront & Luxury Homes — Mia Sanabria",
  shortTitle: "Mia Sanabria | REALTOR®",
  description:
    "Fort Lauderdale REALTOR® Mia Sanabria helps families find waterfront, luxury, and family homes where memories are made. Trusted local real estate guidance.",
  tagline: "Fort Lauderdale REALTOR® | Waterfront, Luxury, and Family Homes Where Memories Are Made",
  positioning: "Fort Lauderdale REALTOR®",
  anchorLine: "If I don't know the answer, I will find it.",
  url: SITE_URL,
  productionUrl: PRODUCTION_URL,
  ogImage: `${SITE_URL}/og-default.jpg`,
  themeColor: "#0F2A44",
  locale: "en-US",
  twitter: { card: "summary_large_image" as const },
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/markets/", label: "Markets" },
  { href: "/buyers/", label: "Buyers" },
  { href: "/sellers/", label: "Sellers" },
  { href: "/valuation/", label: "Home Valuation" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

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
  ],
} as const;
