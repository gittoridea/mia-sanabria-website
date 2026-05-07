/**
 * Single source of truth for site-wide configuration.
 * Production URL flips to miasanabriarealtor.com at cutover; staging stays on trueidea.com.
 */

const STAGING_URL = "https://miasanabriarealtor.trueidea.com";
const PRODUCTION_URL = "https://miasanabriarealtor.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? STAGING_URL;

export const SITE = {
  name: "Mia Sanabria",
  fullName: "Mia Mary Sanabria",
  title: "Mia Sanabria | Luxury Real Estate in Southeast Florida",
  shortTitle: "Mia Sanabria | Luxury Realtor",
  description:
    "Southeast Florida's luxury real estate concierge. Mia Sanabria curates exclusive waterfront estates in Boca Raton, Fort Lauderdale, and Palm Beach with white-glove discretion.",
  tagline: "Building Relationships for Life",
  positioning: "South Florida Real Estate Concierge",
  anchorLine: "If I don't know the answer, I will find it.",
  url: SITE_URL,
  productionUrl: PRODUCTION_URL,
  ogImage: `${SITE_URL}/og-default.svg`,
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
