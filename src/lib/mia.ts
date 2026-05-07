/**
 * Verified facts from PUBLIC_FACT_LEDGER v2 (~/.claude/PAI/USER/PROJECTS/MiaSanabria/).
 * Candidate / unverified fields are typed `string | null` and stay `null` in production
 * until Mia confirms in writing. Schema components must read from this file — never inline.
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
    email: "mia@miasanabriarealtor.com",
    emailLegacy: "msanabriarea@gmail.com",
    addressFormatted: "Fort Lauderdale, FL 33305",
    serviceCore: { city: "Fort Lauderdale", region: "FL", postalCode: "33305" },
  },
  social: {
    facebook: "https://www.facebook.com/miasanrea/",
    instagram: "https://www.instagram.com/mia_sanabria_realtor/",
    linkedin: "https://www.linkedin.com/in/miasanrea/",
    youtube: "https://www.youtube.com/channel/UCXQwnpWflWRRtYuO9QX1jvg",
  },
  voice: {
    tagline: "Building Relationships for Life",
    positioning: "South Florida Real Estate Concierge",
    anchorLine: "If I don't know the answer, I will find it.",
  },
  tracking: { ga4Id: "G-PYYSF87G8K", userwayId: "vVNkJJLvR4" },
  unverified: {
    licenseNumber: null as string | null,
    designations: [] as string[],
    languages: ["English"] as const,
    yearsLicensed: null as string | null,
    displayOffice: null as string | null,
  },
  experience: { since: 2017 },
  serviceArea: {
    administrative: ["Broward County", "Miami-Dade County", "Palm Beach County"],
  },
} as const;

export const FEATURED_MARKETS = [
  "boca-raton",
  "fort-lauderdale",
  "palm-beach",
  "delray-beach",
  "lighthouse-point",
  "victoria-park",
  "coral-ridge",
] as const;

export type MarketSlug = (typeof FEATURED_MARKETS)[number];
