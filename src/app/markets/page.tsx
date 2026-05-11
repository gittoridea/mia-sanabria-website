import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { MarketCard } from "@/components/MarketCard";
import { CTAStrip } from "@/components/CTAStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { RelatedInsightsModule } from "@/components/insights/RelatedInsightsModule";
import { getMarketsByCluster, getFortLauderdaleClusterMarkets, type Market } from "@/lib/markets";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Featured Markets — Southeast Florida",
  description:
    "South Florida cities and towns plus the Fort Lauderdale waterfront and Northern Broward clusters — Mia Sanabria's Broward and Palm Beach County markets.",
  alternates: { canonical: `${SITE.url}/markets/` },
  openGraph: {
    title: "Featured Markets — Mia Sanabria, Fort Lauderdale REALTOR®",
    description:
      "South Florida cities and towns plus the Fort Lauderdale waterfront and Northern Broward clusters — Eastern Fort Lauderdale neighborhoods, Pompano Beach, Hillsboro Mile, and the Palm Beach County peers.",
    url: `${SITE.url}/markets/`,
    images: [
      {
        url: `${SITE.url}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Southeast Florida luxury markets",
      },
    ],
  },
};

// Cycle 14 — partition derived from `Market.cluster` (DRY refactor). Hardcoded
// PRIMARY_SLUGS / NEIGHBORHOOD_SLUGS Sets removed; source of truth is now the
// `cluster:` field on each Market entry in `src/lib/markets.ts`. Order preserved
// from MARKETS array — display order matches source-array order.
//
// Cycle 18 — section #2 now renders the union of `neighborhood` and
// `northern-broward-waterfront` clusters via getFortLauderdaleClusterMarkets().
// Hillsboro Mile (cluster: "northern-broward-waterfront") moved out of the
// "South Florida cities and towns" section into the renamed waterfront cluster
// without claiming Hillsboro Mile is Fort Lauderdale. Pompano Beach added to the
// primary "South Florida cities and towns" cluster. See:
//   docs/CYCLE_18_HILLSBORO_MILE_MARKET_TAXONOMY_FIX.md
//   docs/CYCLE_18_POMPANO_BEACH_MARKET_IMPLEMENTATION.md

export default function MarketsIndex() {
  const primary: ReadonlyArray<Market> = getMarketsByCluster("primary");
  const fortLauderdaleCluster: ReadonlyArray<Market> = getFortLauderdaleClusterMarkets();

  return (
    <>
      <RealEstateAgentSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Markets", href: "/markets/" },
        ]}
      />

      <Hero
        eyebrow="Featured Markets"
        heading="Southeast Florida's most coveted coastal communities."
        sub="Each market lives by its own architectural and social logic. Representation begins with fluency in the place — the dock, the country club, the canopy, the avenue."
        background="image"
        imageSrc="/markets/hillsboro-mile.jpg"
        imageAlt="Hillsboro Mile oceanfront luxury estates, Southeast Florida"
        ctaPrimary={{ href: "/contact/?intent=market-brief", label: "Begin a private market brief" }}
        ctaSecondary={{ href: "#primary-markets", label: "Explore the markets" }}
      />

      <section id="primary-markets" className="bg-cream-50 py-20 lg:py-28 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Primary service markets"
            heading="South Florida cities and towns."
            sub="The broader luxury and waterfront cities and towns where Mia represents buyers and sellers across Broward and Palm Beach County."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {primary.map((market) => (
              <li key={market.slug}>
                <MarketCard market={market} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Eastern Fort Lauderdale and adjacent waterfront"
            heading="Fort Lauderdale waterfront and Northern Broward clusters."
            sub="The Eastern Fort Lauderdale neighborhoods clients compare when shopping the deepwater isles, the in-town walkable blocks, and the gated waterfront enclaves — alongside the Northern Broward A1A waterfront corridor at Hillsboro Mile (in the town of Hillsboro Beach, north of the Fort Lauderdale city limits)."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fortLauderdaleCluster.map((market) => (
              <li key={market.slug}>
                <MarketCard market={market} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cycle 15 — cross-market editorial weaving. Three curated briefs that
          frame how markets compare to each other (cohort comparisons + private
          enclaves + buyer-brief discipline). */}
      <RelatedInsightsModule
        slugs={[
          "las-olas-vs-seven-isles-vs-harbor-beach",
          "lighthouse-point-sea-ranch-lakes-hillsboro-mile",
          "private-buyer-brief-defining-the-search",
        ]}
        heading="Cross-market briefs"
        sub="When markets cluster, the brief separates them. These three editorial briefs frame how serious buyers compare cohorts before committing to one."
        background="cream"
      />

      <CTAStrip
        heading="Tell Mia which markets matter."
        sub="A short conversation establishes the brief — and from there the right residences are sourced, including the ones that never reach a public listing."
      />
    </>
  );
}
