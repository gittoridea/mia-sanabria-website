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
import { RelatedInsightsModule } from "@/components/insights/RelatedInsightsModule";
import { FortLauderdaleV2Page } from "@/components/markets/FortLauderdaleV2";
import { MARKETS, getMarket, getNeighborhoodSlugs, type Market } from "@/lib/markets";
import { SITE } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Array<Params> {
  return MARKETS.map((m) => ({ slug: m.slug }));
}

/** Trim a string to <= maxLen characters, breaking at the last whitespace before maxLen and adding an ellipsis if cut. */
function clampDescription(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 80 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[,.;:\s]+$/, "")}…`;
}

/** Build a 140-160 char metadata description from the market's first AEO sentence + Mia voice. */
function buildMetaDescription(market: Market): string {
  const firstSentenceMatch = market.aeoAnswer.match(/^(.+?[.!?])(\s|$)/);
  const captured = firstSentenceMatch?.[1];
  const lead = captured ? captured.trim() : market.aeoAnswer;
  const tail = " Mia Sanabria, REALTOR® with LPT Realty.";
  const target = 158;
  const room = target - tail.length;
  const trimmedLead = clampDescription(lead, room);
  return `${trimmedLead}${tail}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) return {};
  const title = `${market.name} Luxury Real Estate | Mia Sanabria`;
  const description = buildMetaDescription(market);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE.url}/markets/${market.slug}/` },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/markets/${market.slug}/`,
      images: [
        {
          url: `${SITE.url}/og-markets/${market.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${market.name} — Mia Sanabria, REALTOR® with LPT Realty`,
        },
      ],
    },
  };
}

export default async function MarketPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) notFound();

  // Resolve internal links to full Market objects, dropping any that don't resolve.
  const relatedMarkets: ReadonlyArray<Market> = market.internalLinks
    .map((link) => getMarket(link.slug))
    .filter((m): m is Market => m !== undefined);

  // Cycle 14 — derived from `Market.cluster` via `getNeighborhoodSlugs()` (DRY
  // refactor). Hardcoded `easternBrowardSlugs` Set removed; source of truth is
  // the `cluster: "neighborhood"` field on each Market entry.
  const easternBrowardSlugs: ReadonlySet<string> = new Set(getNeighborhoodSlugs());
  const allEasternFTL = relatedMarkets.length > 0 &&
    relatedMarkets.every((m) => easternBrowardSlugs.has(m.slug));
  const relatedHeading = allEasternFTL
    ? "Related Eastern Fort Lauderdale neighborhoods."
    : "Continue your tour.";

  // Cycle 16 — Fort Lauderdale gets the gold-standard V2 page. The structural
  // pattern in FortLauderdaleV2Page becomes the rollout template for other
  // featured markets in subsequent cycles (see CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md).
  if (market.slug === "fort-lauderdale") {
    return (
      <FortLauderdaleV2Page
        market={market}
        relatedMarkets={relatedMarkets}
        relatedHeading={relatedHeading}
      />
    );
  }

  return (
    <>
      <RealEstateAgentSchema />
      <PlaceSchema
        name={market.name}
        description={market.intro}
        region="FL"
        county={market.county}
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
        background="image"
        imageSrc={market.heroImage}
        imageAlt={`${market.name} luxury real estate`}
      />

      {/* SECTION 1 — AEO answer block */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow={`What ${market.name} is known for`}
            heading="An honest summary."
          />
          <p className="mt-8 max-w-3xl text-[17px] leading-relaxed text-navy-800/85">
            {market.aeoAnswer}
          </p>
        </div>
      </section>

      {/* SECTION 2 — lifestyle two-column + market brief aside (preserved pattern) */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:px-8">
          <div>
            <SectionHeading
              eyebrow={`Why ${market.name}`}
              heading="The lifestyle, in plain language."
            />
            <p className="mt-6 text-[17px] leading-relaxed text-navy-800/85">
              {market.lifestyle}
            </p>
            <h3 className="mt-10 font-display text-xl text-navy-800">Highlights</h3>
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
            <h3 className="mt-10 font-display text-xl text-navy-800">The market</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
              {market.priceCharacter}
            </p>
          </div>

          <aside className="rounded-sm border border-navy-800/10 bg-cream-50 p-7 shadow-card lg:p-10">
            <div className="font-display text-xs tracking-[0.3em] text-brass-700">
              MARKET BRIEF
            </div>
            <h3 className="mt-3 font-display text-2xl text-navy-800">
              Considering {market.name}?
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
              Mia represents buyers and sellers in {market.name} with full attention end-to-end — current comparable sales, brokerage-relationship context, and any relevant informally available residences her network surfaces. Begin with a private conversation about timeline, architectural preference, and the specifics of the residence you have in mind.
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

      {/* SECTION 3 — Property archetypes */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading eyebrow="Properties" heading="What you'll find." />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {market.propertyTypes.map((type, i) => (
              <li
                key={i}
                className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card"
              >
                <div className="font-display text-xs tracking-[0.3em] text-brass-700">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="mt-4 font-display text-lg leading-snug text-navy-800">
                  {type}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 4 — Buyer guidance */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="For buyers"
              heading={`Considering ${market.name} as a buyer.`}
            />
            <p className="mt-6 text-[17px] leading-relaxed text-navy-800/85">
              {market.buyerGuidance}
            </p>
          </div>
          <aside className="rounded-sm border border-navy-800/10 bg-cream-50 p-7 shadow-card lg:p-10">
            <div className="font-display text-xs tracking-[0.3em] text-brass-700">
              BUYER NEXT STEPS
            </div>
            <h3 className="mt-3 font-display text-2xl text-navy-800">Begin a buyer brief.</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
              A short conversation establishes timeline, lifestyle priorities, and the residence in mind. From there the search narrows to two or three serious candidates rather than a broad open tour.
            </p>
            <a
              href="/buyers/"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              How Mia Represents Buyers
            </a>
            <a
              href="/contact/?intent=buyer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-navy-800"
            >
              Begin a Buyer Conversation
            </a>
          </aside>
        </div>
      </section>

      {/* SECTION 5 — Seller guidance */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="For sellers"
              heading={`Listing in ${market.name}.`}
            />
            <p className="mt-6 text-[17px] leading-relaxed text-navy-800/85">
              {market.sellerGuidance}
            </p>
          </div>
          <aside className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card lg:p-10">
            <div className="font-display text-xs tracking-[0.3em] text-brass-700">
              SELLER NEXT STEPS
            </div>
            <h3 className="mt-3 font-display text-2xl text-navy-800">Position the residence.</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
              A focused listing brief begins with a current valuation, a comparable-sales review against the right cohort, and a presentation strategy tuned to the residence's specific story.
            </p>
            <a
              href="/sellers/"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              How Mia Represents Sellers
            </a>
            <a
              href="/valuation/"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-navy-800"
            >
              Request a Valuation
            </a>
          </aside>
        </div>
      </section>

      {/* SECTION 6 — Market-specific FAQ (single emission via Faq's built-in FaqSchema) */}
      <Faq
        heading={`Frequently asked questions about ${market.name}.`}
        items={market.faqs}
        emitSchema
      />

      {/* SECTION 7 — Related markets, driven by market.internalLinks.
          Cycle 14 — comparisonContext prose paragraph rendered above the card grid
          per Ultimate Featured Market Page Standard §7. Optional field; pages without
          comparisonContext render the legacy card-only related section. */}
      {relatedMarkets.length > 0 ? (
        <section className="bg-cream-100 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading eyebrow="Related Markets" heading={relatedHeading} />
            {market.comparisonContext ? (
              <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-navy-800/85">
                {market.comparisonContext}
              </p>
            ) : null}
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedMarkets.map((m) => (
                <li key={m.slug}>
                  <MarketCard market={m} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* SECTION 7b — Related Insights (Cycle 15). Renders only when the
          market is referenced by ≥1 published Insights brief; data-driven via
          getInsightsForMarket(slug). For markets not referenced by any post,
          the section silently omits — no empty-state pollution. */}
      <RelatedInsightsModule
        marketSlug={market.slug}
        heading={`From the Insights library — ${market.name}`}
        sub="Editorial briefs that frame the conversations buyers and sellers in this market most often arrive with."
        background="cream"
      />

      {/* SECTION 8 — CTA strip (preserved) */}
      <CTAStrip
        heading={`Inquire about ${market.name}.`}
        sub="A short conversation establishes the brief — and from there the right residences are sourced privately, including those that never reach a public listing."
      />
    </>
  );
}
