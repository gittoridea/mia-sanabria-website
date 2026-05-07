import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { Faq } from "@/components/Faq";
import { CTAStrip } from "@/components/CTAStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Selling with Mia Sanabria — Elevated Marketing & Strategy",
  description:
    "A bespoke approach to marketing Southeast Florida's most distinguished estates. Mia Sanabria positions luxury residences with editorial photography, off-market networks, and strategic pricing for optimal market velocity.",
  alternates: { canonical: `${SITE.url}/sellers/` },
};

const SELLER_PROCESS = [
  {
    heading: "Strategic valuation & pricing",
    body: "Pricing a luxury asset requires sophisticated understanding of micro-market dynamics, comparable transactions, and global economic context. Strategy is set before the residence touches the market.",
  },
  {
    heading: "Property curation",
    body: "Architectural staging, landscape refinement, and a meticulous, white-glove presentation that frames the residence as the cultural object it is.",
  },
  {
    heading: "Editorial marketing",
    body: "Cinematic photography, video, copywriting, and global distribution through luxury portals — alongside discreet off-market networking with high-net-worth buyers.",
  },
  {
    heading: "Closing coordination",
    body: "Navigating the financial mechanics of a luxury transaction — title, escrow, financing, and tax considerations — with precision and the right partners at every step.",
  },
];

const SELLER_FAQ = [
  {
    question: "Should I list publicly or pursue an off-market sale?",
    answer:
      "Both have a place. Public listing maximizes exposure and tends to produce the strongest pricing in active markets; off-market sales preserve privacy and often appeal to owners who value discretion above marginal price. Strategy is set together based on the residence and the market.",
  },
  {
    question: "What is the typical commission structure?",
    answer:
      "Commission is set in writing at engagement and reflects the property, the marketing scope, and the cooperating brokerage commission. Mia's listings receive editorial-tier photography, video, and global distribution as part of the engagement.",
  },
  {
    question: "How long does a luxury sale take?",
    answer:
      "Highly market-dependent. Well-positioned waterfront and country-club estates frequently move within 60-120 days; landmark Estate Section properties can take longer by design. Your timeline shapes the strategy.",
  },
  {
    question: "What does the marketing scope include?",
    answer:
      "Editorial photography and twilight imagery, cinematic video, drone, copywriting, dedicated property page, MLS distribution, global portal distribution, and discreet off-market introduction to the high-net-worth buyer network.",
  },
];

export default function SellersPage() {
  return (
    <>
      <RealEstateAgentSchema />
      <ServiceSchema
        name="Luxury Listing & Seller Representation"
        description="Editorial-tier marketing, strategic pricing, off-market networking, and full closing coordination for Southeast Florida luxury sellers."
        serviceType="Real Estate Seller Representation"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Sellers", href: "/sellers/" },
        ]}
      />

      <Hero
        eyebrow="For Sellers"
        heading="Elevating your property's global presence."
        sub="Pricing, presentation, and quiet pre-market introduction — sequenced by Mia personally for residences from Las Olas Isles to the Palm Beach Estate Section."
        ctaPrimary={{ href: "/valuation/", label: "Request Valuation" }}
        ctaSecondary={{ href: "/contact/", label: "Begin a Private Conversation" }}
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Listing Concierge"
            heading="Four phases of bespoke representation."
          />
          <ol className="mt-12 grid gap-10 lg:grid-cols-2">
            {SELLER_PROCESS.map((step, i) => (
              <li key={step.heading} className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-soft">
                <div className="font-display text-xs tracking-[0.3em] text-brass-500">
                  PHASE {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 font-display text-xl text-navy-800">{step.heading}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-navy-800/80">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ValueProps
        eyebrow="Why Mia"
        heading="A listing partner positioned for the residence — not the volume."
        background="navy"
        items={[
          {
            heading: "Editorial-tier presentation",
            body: "Cinematic photography, twilight imagery, video, drone, and copywriting that present the residence as the architectural object it is.",
          },
          {
            heading: "Off-market networking",
            body: "Discrete pre-market introduction to high-net-worth buyers and a tightly held brokerage network across Southeast Florida.",
          },
          {
            heading: "Strategic pricing",
            body: "Data-driven micro-market analysis combined with global luxury context to optimize price and velocity.",
          },
          {
            heading: "Closing precision",
            body: "Title, escrow, financing, and tax-structuring partners aligned with the discretion and complexity luxury transactions demand.",
          },
        ]}
      />

      <Faq items={SELLER_FAQ} />

      <CTAStrip
        heading="Begin with a complimentary valuation."
        sub="Pricing a luxury residence well begins with the right valuation — sophisticated, private, and grounded in current micro-market dynamics."
      />
    </>
  );
}
