import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { Faq } from "@/components/Faq";
import { CTAStrip } from "@/components/CTAStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { OfferCatalogSchema } from "@/components/schema/OfferCatalogSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buying — Private Buyer Representation",
  description:
    "Private buyer representation across Southeast Florida — discreet acquisition guidance in Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach.",
  alternates: { canonical: `${SITE.url}/buyers/` },
  openGraph: {
    title: "Buying — Private Buyer Representation",
    description:
      "Private buyer representation across Southeast Florida — discreet acquisition guidance in Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach.",
    url: `${SITE.url}/buyers/`,
    images: [{ url: `${SITE.url}/og-buyers.jpg`, width: 1200, height: 630 }],
  },
};

const BUYER_PROCESS = [
  {
    heading: "Private discovery",
    body: "A confidential conversation about preferred markets, architectural style, lifestyle requirements, and timeline. The brief is shaped before any showing is scheduled.",
  },
  {
    heading: "Brokerage-relationship sourcing",
    body: "Mia activates her brokerage and ownership relationships to surface relevant residences — including any informally available opportunities those relationships uncover. Access varies by market and timing.",
  },
  {
    heading: "Curated showings",
    body: "Showings are deliberately small — three to five carefully matched residences rather than thirty mismatches. Every visit is accompanied by Mia personally.",
  },
  {
    heading: "Closing coordination",
    body: "Title, escrow, inspection, financing, and closing handled by experienced partners — with Mia present and accountable across every milestone.",
  },
];

const BUYER_FAQ = [
  {
    question: "Do I have to be local to engage Mia as a buyer's agent?",
    answer:
      "No. A meaningful portion of Mia's buyers are relocating from the Northeast, Midwest, California, and internationally. Virtual showings, video tours, and remote-closing coordination are routine.",
  },
  {
    question: "What is the cost of buyer representation?",
    answer:
      "In most Southeast Florida transactions, buyer representation is compensated through the cooperating brokerage commission paid by the seller's side at closing. Specifics are reviewed in writing before any engagement.",
  },
  {
    question: "Will I see privately offered residences before they list?",
    answer:
      "When Mia knows your brief in detail, she shares any relevant opportunities her brokerage relationships surface — including informally available residences when those exist. Availability varies by market and timing; the brief is what enables the right introduction at the right moment.",
  },
  {
    question: "How long does an acquisition typically take?",
    answer:
      "From engagement to closing, six to twelve weeks is typical when the brief is clear and the right residence surfaces. Some clients work over twelve to eighteen months for a specific residence to come to market.",
  },
];

export default function BuyersPage() {
  return (
    <>
      <RealEstateAgentSchema />
      <ServiceSchema
        name="Private Buyer Representation"
        description="Tailored acquisition advisory for Southeast Florida real estate. Private brokerage sourcing, curated showings, and full closing coordination."
        serviceType="Real Estate Buyer Representation"
      />
      <OfferCatalogSchema
        catalogName="Private Buyer Representation"
        items={[
          {
            name: "Private Discovery Brief",
            description:
              "confidential conversation about preferred markets, architectural style, lifestyle requirements, and timeline.",
          },
          {
            name: "Brokerage-Relationship Sourcing",
            description:
              "activation of Mia's brokerage and ownership relationships to surface relevant residences, including informally available opportunities.",
          },
          {
            name: "Curated Showings",
            description:
              "three to five carefully matched residences accompanied by Mia personally.",
          },
          {
            name: "Closing Coordination",
            description:
              "title, escrow, inspection, financing, and closing handled by experienced partners with Mia present.",
          },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Buyers", href: "/buyers/" },
        ]}
      />

      <Hero
        eyebrow="For Buyers"
        heading="Private buyer representation across Southeast Florida."
        sub="Mia represents buyers across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach with a deliberately small client list — every brief written before the first showing, every closing attended in person."
        ctaPrimary={{ href: "/contact/", label: "Begin a Private Conversation" }}
        ctaSecondary={{ href: "/markets/", label: "Walk the Markets" }}
        background="image"
        imageSrc="/services/buyers.jpg"
        imageAlt="Sunlit luxury Florida home interior with floor-to-ceiling glass overlooking a deepwater canal"
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="The Acquisition Process"
            heading="Four phases. One REALTOR® throughout."
          />
          <ol className="mt-12 grid gap-10 lg:grid-cols-4">
            {BUYER_PROCESS.map((step, i) => (
              <li key={step.heading} className="border-t-2 border-brass-400 pt-6">
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
        eyebrow="Buyer Representation"
        heading="Why clients choose this practice."
        background="navy"
        items={[
          {
            heading: "Brokerage relationships",
            body: "Residences surfaced through the brokerage and ownership relationships Mia has built over time — including any informally available opportunities those relationships uncover. Availability varies by market and timing.",
          },
          {
            heading: "Architectural literacy",
            body: "Familiarity with Mediterranean Revival, mid-century waterfront, and contemporary coastal homes across Mia's core Southeast Florida markets.",
          },
          {
            heading: "Relocation-ready",
            body: "Virtual tours, video walk-throughs, and remote closing coordination for buyers relocating to Southeast Florida.",
          },
          {
            heading: "Quiet rigor",
            body: "Title, due diligence, financing, and closing handled by partners who match the discretion the residence requires.",
          },
        ]}
      />

      <Faq items={BUYER_FAQ} />

      <CTAStrip
        heading="Tell Mia what you're looking for."
        sub="A short private conversation is the first step. From there, Mia sources the right residences across her core markets — including any informally available opportunities her brokerage relationships uncover."
      />
    </>
  );
}
