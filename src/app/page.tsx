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
    question: "Where does Mia serve clients?",
    answer:
      "Mia is based in Fort Lauderdale and serves clients across Broward, Miami-Dade, and Palm Beach counties, with this site focusing on Fort Lauderdale, Coral Ridge, Victoria Park, Boca Raton, Palm Beach, Delray Beach, and Lighthouse Point.",
  },
  {
    question: "What sets Mia Sanabria apart as a South Florida Realtor?",
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
    body: "Quiet introductions when Mia's brokerage and ownership relationships across Fort Lauderdale, Boca Raton, and the Palm Beach corridor surface a fit. Access varies by market and timing.",
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

export default function HomePage() {
  return (
    <>
      <PersonSchema />
      <RealEstateAgentSchema />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }]} />

      <Hero
        eyebrow="Mia Sanabria · REALTOR® with LPT Realty"
        heading="Luxury real estate guidance for Fort Lauderdale and South Florida."
        sub="Mia Sanabria is a South Florida Realtor serving buyers and sellers across Fort Lauderdale, Broward, Miami-Dade, and Palm Beach."
        ctaPrimary={{ href: "/contact/", label: "Begin a Private Conversation" }}
        ctaSecondary={{ href: "/valuation/", label: "Request Home Valuation" }}
        background="image"
        imageSrc="/og-default.jpg"
        imageAlt="Luxury waterfront residence at twilight, Southeast Florida"
      />

      <IntentRouter />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Featured Markets"
            heading="Start with the neighborhoods and property types that match the decision."
            sub="Market guides for Fort Lauderdale, Coral Ridge, Victoria Park, Boca Raton, Palm Beach, Delray Beach, and Lighthouse Point — written to point you toward current comparable sales and a property-specific conversation."
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
        eyebrow="The Practice"
        heading="A private, deliberate way to buy and sell in Southeast Florida."
        items={HOME_VALUE_PROPS}
        background="navy"
      />

      <IdxEmbed />

      <Faq items={HOME_FAQ} />
      <CTAStrip />
    </>
  );
}
