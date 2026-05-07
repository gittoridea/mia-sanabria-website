import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { IntentRouter } from "@/components/IntentRouter";
import { MarketCard } from "@/components/MarketCard";
import { ValueProps } from "@/components/ValueProps";
import { Faq } from "@/components/Faq";
import { CTAStrip } from "@/components/CTAStrip";
import { IdxEmbed } from "@/components/IdxEmbed";
import { SectionHeading } from "@/components/SectionHeading";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { LocalBusinessSchema } from "@/components/schema/LocalBusinessSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { MARKETS } from "@/lib/markets";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/` },
};

const HOME_FAQ = [
  {
    question: "Where does Mia practice?",
    answer:
      "Mia is based in Fort Lauderdale and represents clients across Broward, Miami-Dade, and Palm Beach counties — with deepest fluency in the luxury waterfront markets of Boca Raton, Fort Lauderdale, Palm Beach, Delray Beach, Lighthouse Point, Coral Ridge, and Victoria Park.",
  },
  {
    question: "What does 'concierge representation' mean in practice?",
    answer:
      "It means a small client list, white-glove discretion, and access to the full off-market and pre-market layer of Southeast Florida luxury inventory. Every engagement begins with a private conversation about timeline, lifestyle, and the residence — not the transaction.",
  },
  {
    question: "Does Mia handle off-market and pre-market opportunities?",
    answer:
      "Yes. A meaningful share of the most desirable Southeast Florida residences trade quietly. Mia maintains relationships across the brokerage community and the high-net-worth ownership network specifically to surface the homes that never reach the open market.",
  },
  {
    question: "What is the typical price range Mia represents?",
    answer:
      "Most engagements fall in the $1.5M–$30M range across single-family waterfront, oceanfront condominiums, and country-club estates. Larger landmark residences and commercial assets are handled on a case-by-case basis.",
  },
  {
    question: "How do I begin?",
    answer:
      "Send a private note via the contact form, call (954) 540-0358, or request a complimentary valuation if you are evaluating a sale. Every initial conversation is confidential.",
  },
];

const HOME_VALUE_PROPS = [
  {
    heading: "Curated representation",
    body: "A deliberately small client list — every engagement receives concierge attention, full presence at every showing, and direct access to Mia.",
  },
  {
    heading: "Off-market access",
    body: "Relationships across the brokerage community surface pre-market and off-market residences before they ever reach a public listing.",
  },
  {
    heading: "Editorial presentation",
    body: "Listings positioned as architectural objects — cinematic photography, copywriting, and global distribution that the property deserves.",
  },
  {
    heading: "Quiet rigor",
    body: "Title work, due diligence, financing coordination, and closing execution handled with the discretion luxury transactions require.",
  },
];

export default function HomePage() {
  return (
    <>
      <PersonSchema />
      <RealEstateAgentSchema />
      <LocalBusinessSchema />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }]} />

      <Hero
        eyebrow="Mia Sanabria · LPT Realty"
        heading="Discover Southeast Florida's most exclusive real estate."
        sub="A concierge practice for buyers, sellers, and investors who treat the residence as the primary asset — Boca Raton, Fort Lauderdale, Palm Beach, and the waterfronts in between."
        ctaPrimary={{ href: "/contact/", label: "Request Private Consultation" }}
        ctaSecondary={{ href: "/markets/", label: "Explore Featured Markets" }}
      />

      <IntentRouter />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Featured Markets"
            heading="The pinnacle of Southeast Florida luxury, neighborhood by neighborhood."
            sub="Each market on the coast lives by its own architectural and social logic. Mia's representation begins with fluency in the place — the dock, the country club, the canopy, the avenue — before the first showing is ever scheduled."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MARKETS.slice(0, 6).map((market) => (
              <li key={market.slug}>
                <MarketCard market={market} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ValueProps
        eyebrow="The Concierge Difference"
        heading="A private practice, deliberately structured."
        items={HOME_VALUE_PROPS}
        background="navy"
      />

      <IdxEmbed />

      <Faq items={HOME_FAQ} />

      <CTAStrip />
    </>
  );
}
