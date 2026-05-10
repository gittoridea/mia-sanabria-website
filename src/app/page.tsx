import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { AnswerFirst } from "@/components/AnswerFirst";
import { MeetMia } from "@/components/MeetMia";
import { IntentRouter } from "@/components/IntentRouter";
import { FeaturedMarketsPager } from "@/components/FeaturedMarketsPager";
import { ValueProps } from "@/components/ValueProps";
import { Faq } from "@/components/Faq";
import { CTAStrip } from "@/components/CTAStrip";
import { IdxEmbed } from "@/components/IdxEmbed";
import { SectionHeading } from "@/components/SectionHeading";
import { InsightsTeaser } from "@/components/insights/InsightsTeaser";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { getMarket, type Market } from "@/lib/markets";
import { HOMEPAGE_FEATURED_ORDER, HOMEPAGE_FEATURED_PAGE_SIZE } from "@/lib/mia";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/` },
};

const HOME_FAQ = [
  {
    question: "Where does Mia serve clients?",
    answer:
      "Mia is based in Fort Lauderdale and serves clients across luxury Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach, with featured market guides for Fort Lauderdale, Coral Ridge, Victoria Park, Boca Raton, and Delray Beach.",
  },
  {
    question: "What sets Mia Sanabria apart as a Fort Lauderdale REALTOR®?",
    answer:
      "It means a guided process: clarify the goal, narrow the right markets, review current comparable data, coordinate next steps, and keep the client informed from first conversation through closing.",
  },
  {
    question: "Can Mia help with a home value question before I am ready to sell?",
    answer:
      "Yes. The valuation request is designed for owners who want a current read on their property, even if they are still early in the decision process.",
  },
  {
    question: "How do I begin?",
    answer:
      "Call (954) 540-0358, send a private inquiry, or request a home valuation. Mia or her team can then confirm the next appropriate step.",
  },
];

const HOME_VALUE_PROPS = [
  {
    heading: "Personal representation",
    body: "Every engagement starts with a private conversation about timing, criteria, and the residence you have in mind — not a generic IDX search.",
  },
  {
    heading: "Brokerage relationships",
    body: "Quiet introductions when Mia's brokerage and ownership relationships across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach surface a fit. Access varies by market and timing.",
  },
  {
    heading: "Current-market clarity",
    body: "Pricing conversations are grounded in current comparable sales for the specific street, building, or block — never broad public ranges.",
  },
  {
    heading: "Discreet by default",
    body: "Inquiries are handled privately. Listings, valuations, and search work proceed without unnecessary exposure of you or the property.",
  },
];

// Cycle 16 — Homepage featured-markets pager source. Order is principal-locked
// via HOMEPAGE_FEATURED_ORDER in src/lib/mia.ts (Decision Register §1). Display
// is paginated 6-at-a-time by FeaturedMarketsPager.
const featuredMarkets: ReadonlyArray<Market> = HOMEPAGE_FEATURED_ORDER.map(getMarket).filter(
  (market): market is Market => Boolean(market)
);

export default function HomePage() {
  return (
    <>
      <PersonSchema />
      <RealEstateAgentSchema />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }]} />

      <Hero
        eyebrow="Mia Sanabria · REALTOR® with LPT Realty"
        heading="Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach."
        sub="A small, deliberate practice — private representation for buyers and sellers of distinctive coastal residences."
        ctaPrimary={{ href: "/contact/", label: "Begin a Private Conversation" }}
        ctaSecondary={{ href: "/valuation/", label: "Request Home Valuation" }}
        background="image"
        imageSrc="/markets/fort-lauderdale.jpg"
        imageAlt="Twilight luxury waterfront residence, Eastern Fort Lauderdale"
      />

      <AnswerFirst
        question="What kind of real estate does Mia Sanabria specialize in?"
        answer="Mia Sanabria represents buyers and sellers of luxury and waterfront residences across Eastern Fort Lauderdale, with adjacent primary service in Boca Raton (Palm Beach County) and Delray Beach (Palm Beach County). Her practice centers on deepwater estates and finger-isle homes along Las Olas Isles, Harbor Beach, and Rio Vista; in-town Eastern Fort Lauderdale neighborhoods such as Coral Ridge and Victoria Park; and the Mediterranean Revival, Atlantic Avenue, and beach-block trade in Boca Raton and Delray Beach. Engagements begin with a private brief — preferences, timeline, and the residence in mind — long before any showing."
        relatedMarkets={["fort-lauderdale", "boca-raton", "delray-beach"]}
        cta={{ href: "/markets/", label: "Walk the markets" }}
      />

      <MeetMia />

      <IntentRouter />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Featured Markets"
            heading="Start with the neighborhoods and property types that match the decision."
            sub="Market guides for Fort Lauderdale, Boca Raton, Palm Beach, Victoria Park, Lighthouse Point, and Delray Beach — written to point you toward current comparable sales and a property-specific conversation."
          />
          <div className="mt-12">
            <FeaturedMarketsPager
              markets={featuredMarkets}
              pageSize={HOMEPAGE_FEATURED_PAGE_SIZE}
            />
          </div>
        </div>
      </section>

      <ValueProps
        eyebrow="The Practice"
        heading="A private, deliberate way to buy and sell in Southeast Florida."
        items={HOME_VALUE_PROPS}
        background="navy"
      />

      <IdxEmbed />

      {/* Cycle 15 — Latest Insights cross-site weaving. Three curated briefs:
          buyer guide, deepwater isle comparison, and seller positioning —
          spanning the three principal ICPs without crowding the hero. */}
      <InsightsTeaser
        slugs={[
          "fort-lauderdale-waterfront-buyer-guide",
          "las-olas-vs-seven-isles-vs-harbor-beach",
          "preparing-waterfront-residence-private-market-conversations",
        ]}
        heading="Latest Insights"
        sub="A twelve-part evergreen guide to the Southeast Florida luxury and waterfront market — read in any order."
        background="cream"
      />

      <Faq items={HOME_FAQ} />
      <CTAStrip />
    </>
  );
}
