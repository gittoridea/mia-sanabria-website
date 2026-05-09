import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { MarketCard } from "@/components/MarketCard";
import { CTAStrip } from "@/components/CTAStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { MARKETS, type Market } from "@/lib/markets";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Featured Markets — Southeast Florida",
  description:
    "Eastern Fort Lauderdale neighborhoods plus adjacent South Florida luxury markets — Boca Raton, Delray Beach, Lighthouse Point, Hillsboro Mile, Sea Ranch Lakes.",
  alternates: { canonical: `${SITE.url}/markets/` },
  openGraph: {
    title: "Featured Markets — Mia Sanabria, Fort Lauderdale REALTOR®",
    description:
      "Eastern Fort Lauderdale neighborhoods alongside Boca Raton, Delray Beach, Palm Beach, Lighthouse Point, Hillsboro Mile, and Sea Ranch Lakes — neighborhood-by-neighborhood luxury real estate guidance.",
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

// Split into city/town-level "Primary service markets" vs Eastern Fort Lauderdale neighborhood
// cluster. The split preserves visual rhythm and gives buyers a clear orientation between
// "where in South Florida" and "which Fort Lauderdale neighborhood".
const PRIMARY_SLUGS = new Set<string>([
  "fort-lauderdale",
  "boca-raton",
  "delray-beach",
  "palm-beach",
  "lighthouse-point",
  "hillsboro-mile",
  "sea-ranch-lakes",
]);

const NEIGHBORHOOD_SLUGS = new Set<string>([
  "coral-ridge",
  "victoria-park",
  "rio-vista",
  "harbor-beach",
  "las-olas-isles",
  "seven-isles",
]);

function partitionMarkets(): {
  primary: ReadonlyArray<Market>;
  neighborhoods: ReadonlyArray<Market>;
} {
  const primary: Market[] = [];
  const neighborhoods: Market[] = [];
  for (const m of MARKETS) {
    if (PRIMARY_SLUGS.has(m.slug)) primary.push(m);
    else if (NEIGHBORHOOD_SLUGS.has(m.slug)) neighborhoods.push(m);
    // Any future slug not in either set will not render here — surface as TS-build error
    // instead by adding it to one of the sets above.
  }
  return { primary, neighborhoods };
}

export default function MarketsIndex() {
  const { primary, neighborhoods } = partitionMarkets();

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
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Primary service markets"
            heading="South Florida cities and towns."
            sub="The broader luxury and waterfront markets where Mia represents buyers and sellers across Broward and Palm Beach County."
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
            eyebrow="Eastern Fort Lauderdale neighborhoods"
            heading="The Fort Lauderdale waterfront and in-town clusters."
            sub="The core neighborhoods clients compare when shopping eastern Fort Lauderdale — the deepwater isles, the in-town walkable blocks, and the gated waterfront enclaves."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((market) => (
              <li key={market.slug}>
                <MarketCard market={market} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTAStrip
        heading="Tell Mia which markets matter."
        sub="A short conversation establishes the brief — and from there the right residences are sourced, including the ones that never reach a public listing."
      />
    </>
  );
}
