import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Faq } from "@/components/Faq";
import { CTAStrip } from "@/components/CTAStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { MarketCard } from "@/components/MarketCard";
import { PlaceSchema } from "@/components/schema/PlaceSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { MARKETS, getMarket } from "@/lib/markets";
import { SITE } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Array<Params> {
  return MARKETS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) return {};
  const title = `${market.name} Luxury Real Estate`;
  const description = `${market.name} luxury real estate with Mia Sanabria. ${market.tagline}`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/markets/${market.slug}/` },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/markets/${market.slug}/`,
      images: [{ url: `${SITE.url}/og-markets/${market.slug}.jpg`, width: 1200, height: 630, alt: `${market.name} — Mia Sanabria, Luxury Real Estate Concierge` }],
    },
  };
}

export default async function MarketPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) notFound();

  const otherMarkets = MARKETS.filter((m) => m.slug !== slug).slice(0, 3);
  const faq = [
    {
      question: `Where is ${market.name} and what defines the market?`,
      answer: `${market.localContext} ${market.intro}`,
    },
    {
      question: `What does day-to-day life in ${market.name} look like?`,
      answer: market.lifestyle,
    },
    {
      question: `What is the typical price range in ${market.name}?`,
      answer: market.priceCharacter,
    },
    {
      question: `Which county is ${market.name} in, and how does that affect a transaction?`,
      answer: `${market.name} is in ${market.county}. County matters for property tax assessment, recording fees, permit and inspection processes, and the public records you will rely on during diligence — Mia coordinates the right county-specific resources for each transaction.`,
    },
    {
      question: `Does Mia have off-market access in ${market.name}?`,
      answer: `Yes. Off-market and pre-market access in ${market.name} is sourced through brokerage and ownership relationships built over time in ${market.county}. Every conversation begins privately, and a clearly written brief is what unlocks the right introductions.`,
    },
  ];

  return (
    <>
      <RealEstateAgentSchema />
      <PlaceSchema
        name={market.name}
        description={market.intro}
        region="FL"
        latitude={market.latitude}
        longitude={market.longitude}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Markets", href: "/markets/" },
          { name: market.name, href: `/markets/${market.slug}/` },
        ]}
      />

      <Hero
        eyebrow={`${market.name} · Southeast Florida`}
        heading={market.tagline}
        sub={market.intro}
        ctaPrimary={{ href: "/contact/", label: `Inquire About ${market.name}` }}
        ctaSecondary={{ href: "/markets/", label: "Other Markets" }}
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:px-8">
          <div>
            <SectionHeading
              eyebrow={`Why ${market.name}`}
              heading="The lifestyle, in plain language."
            />
            <p className="mt-6 text-[17px] leading-relaxed text-navy-800/85">
              {market.lifestyle}
            </p>
            <h2 className="mt-10 font-display text-xl text-navy-800">Highlights</h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-navy-800/85">
              {market.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brass-400"
                  />
                  {h}
                </li>
              ))}
            </ul>
            <h2 className="mt-10 font-display text-xl text-navy-800">The market</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
              {market.priceCharacter}
            </p>
          </div>

          <aside className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card lg:p-10">
            <div className="font-display text-xs tracking-[0.3em] text-brass-500">
              CONCIERGE BRIEF
            </div>
            <h3 className="mt-3 font-display text-2xl text-navy-800">
              Considering {market.name}?
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
              Mia represents buyers and sellers in {market.name} with concierge access to off-market and pre-market opportunities. Begin with a private conversation about timeline, architectural preference, and the specifics of the residence you have in mind.
            </p>
            <a
              href="/contact/"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Request Private Consultation
            </a>
            <a
              href="/valuation/"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-navy-800"
            >
              Request Valuation
            </a>
          </aside>
        </div>
      </section>

      <Faq items={faq} />

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading eyebrow="Other Markets" heading="Continue your tour of Southeast Florida." />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherMarkets.map((m) => (
              <li key={m.slug}>
                <MarketCard market={m} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTAStrip
        heading={`Inquire about ${market.name}.`}
        sub="A short conversation establishes the brief — and from there the right residences are sourced privately, including those that never reach a public listing."
      />
    </>
  );
}
