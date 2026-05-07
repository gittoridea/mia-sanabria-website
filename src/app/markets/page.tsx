import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { MarketCard } from "@/components/MarketCard";
import { CTAStrip } from "@/components/CTAStrip";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { MARKETS } from "@/lib/markets";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Featured Markets — Southeast Florida Luxury Neighborhoods",
  description:
    "Walk Southeast Florida's most coveted luxury markets. Mia Sanabria represents buyers and sellers in Boca Raton, Fort Lauderdale, Palm Beach, Delray Beach, Lighthouse Point, Coral Ridge, and Victoria Park.",
  alternates: { canonical: `${SITE.url}/markets/` },
};

export default function MarketsIndex() {
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
        sub="Each market lives by its own architectural and social logic. Concierge representation begins with fluency in the place — the dock, the country club, the canopy, the avenue."
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MARKETS.map((market) => (
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
