import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { AnswerFirst } from "@/components/AnswerFirst";
import { ValueProps } from "@/components/ValueProps";
import { Faq } from "@/components/Faq";
import { CTAStrip } from "@/components/CTAStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { OfferCatalogSchema } from "@/components/schema/OfferCatalogSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { RelatedInsightsModule } from "@/components/insights/RelatedInsightsModule";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Selling — Elevated Marketing & Strategy",
  description:
    "Tailored marketing for Southeast Florida residences — editorial photography, private brokerage relationships, and strategic pricing for market velocity.",
  alternates: { canonical: `${SITE.url}/sellers/` },
  openGraph: {
    title: "Selling — Elevated Marketing & Strategy",
    description:
      "Tailored marketing for Southeast Florida residences — editorial photography, private brokerage relationships, and strategic pricing for market velocity.",
    url: `${SITE.url}/sellers/`,
    images: [{ url: `${SITE.url}/og-sellers.jpg`, width: 1200, height: 630 }],
  },
};

const SELLER_PROCESS = [
  {
    heading: "Strategic valuation & pricing",
    body: "Pricing a higher-priced residence requires careful understanding of micro-market dynamics, comparable transactions, and broader economic context. Strategy is set before the residence touches the market.",
  },
  {
    heading: "Property curation",
    body: "Architectural staging, landscape refinement, and a meticulous, considered presentation that frames the residence as the cultural object it is.",
  },
  {
    heading: "Editorial marketing",
    body: "Cinematic photography, video, copywriting, and global distribution through real estate portals — alongside discreet private brokerage outreach to qualified buyers.",
  },
  {
    heading: "Closing coordination",
    body: "Navigating the financial mechanics of a higher-priced transaction — title, escrow, financing, and tax considerations — with precision and the right partners at every step.",
  },
];

const SELLER_FAQ = [
  {
    question: "Should I list publicly or pursue a private sale?",
    answer:
      "Both have a place. Public listing maximizes exposure and tends to produce the strongest pricing in active markets; a privately marketed sale preserves privacy and often appeals to owners who value discretion above marginal price. Strategy is set together based on the residence and the market.",
  },
  {
    question: "What is the typical commission structure?",
    answer:
      "Commission is set in writing at engagement and reflects the property, the marketing scope, and the cooperating brokerage commission. Mia's listings receive editorial-tier photography, video, and global distribution as part of the engagement.",
  },
  {
    question: "How long does a higher-priced sale take?",
    answer:
      "Highly market-dependent. Well-positioned waterfront and country-club residences often move within 60-120 days; properties in tightly defined estate sections can take longer by design. Your timeline shapes the strategy.",
  },
  {
    question: "What does the marketing scope include?",
    answer:
      "Editorial photography and twilight imagery, cinematic video, drone, copywriting, dedicated property page, MLS distribution, global portal distribution, and discreet private introduction to qualified buyers via brokerage relationships.",
  },
];

export default function SellersPage() {
  return (
    <>
      <RealEstateAgentSchema />
      <ServiceSchema
        name="Listing & Seller Representation"
        description="Editorial-tier marketing, strategic pricing, private brokerage outreach, and full closing coordination for Southeast Florida sellers."
        serviceType="Real Estate Seller Representation"
      />
      <OfferCatalogSchema
        catalogName="Listing & Seller Representation"
        items={[
          {
            name: "Strategic Valuation & Pricing",
            description:
              "micro-market analysis, comparables, and pricing strategy set before market entry.",
          },
          {
            name: "Property Curation",
            description:
              "architectural staging, landscape refinement, considered presentation framing the residence as a cultural object.",
          },
          {
            name: "Editorial Marketing",
            description:
              "cinematic photography, video, copywriting, MLS + global portal distribution, discreet private brokerage outreach.",
          },
          {
            name: "Closing Coordination",
            description:
              "title, escrow, financing, tax considerations handled with precision.",
          },
        ]}
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
        sub="Pricing, presentation, and considered introductions — sequenced by Mia personally for residences across Mia's core Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach markets."
        ctaPrimary={{ href: "/contact/?intent=seller", label: "Begin a Private Conversation" }}
        ctaSecondary={{ href: "/valuation/", label: "Request Valuation" }}
        background="image"
        imageSrc="/services/sellers.jpg"
        imageAlt="Editorial twilight exterior of a meticulously staged Florida luxury home with brass-lit entry and uplit royal palms"
      />

      <AnswerFirst
        question="How should sellers position a luxury or waterfront home in Eastern Fort Lauderdale?"
        answer="A luxury or waterfront residence is positioned for the buyer who is already searching for it — not a generic public listing. The work begins with disciplined pricing built from current comparable sales on the same street, building, or block — never broad public ranges. Editorial photography, twilight imagery, drone, video, and copywriting present the residence as an architectural object. For dock-capable estates, dock specifications, water depth, and route to the inlet are documented as marketable infrastructure. Distribution layers private brokerage introductions on top of MLS exposure so qualified, prepared buyers see the residence first. Showings are coordinated to protect the household's privacy and the residence's condition."
        relatedMarkets={["fort-lauderdale", "boca-raton", "delray-beach"]}
        cta={{ href: "/valuation/", label: "Request a valuation" }}
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Listing Representation"
            heading="Four phases of considered representation."
          />
          <ol className="mt-12 grid gap-10 lg:grid-cols-2">
            {SELLER_PROCESS.map((step, i) => (
              <li key={step.heading} className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-soft">
                <div className="font-display text-xs tracking-[0.3em] text-brass-700">
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
            heading: "Brokerage relationships",
            body: "Discreet introduction to qualified buyers through brokerage and cooperating-agent relationships across Southeast Florida — alongside the public marketing every listing receives.",
          },
          {
            heading: "Strategic pricing",
            body: "Data-driven micro-market analysis combined with global luxury context to optimize price and velocity.",
          },
          {
            heading: "Closing precision",
            body: "Title, escrow, financing, and tax-structuring partners aligned with the discretion and complexity higher-priced transactions demand.",
          },
        ]}
      />

      <Faq items={SELLER_FAQ} />

      {/* Cycle 15 — seller-focused editorial weaving. Positioning + automated
          valuation skepticism + private-market preparation. */}
      <RelatedInsightsModule
        slugs={[
          "positioning-luxury-waterfront-eastern-fort-lauderdale",
          "why-automated-valuations-miss-luxury-waterfront",
          "preparing-waterfront-residence-private-market-conversations",
        ]}
        heading="Seller-side briefs"
        sub="Three editorial briefs that frame the work before a residence touches the market — positioning, pricing discipline, and preparation for the private path."
        background="cream"
      />

      <CTAStrip
        heading="Begin with a complimentary valuation."
        sub="Pricing a residence well begins with the right valuation — careful, private, and grounded in current micro-market dynamics."
      />
    </>
  );
}
