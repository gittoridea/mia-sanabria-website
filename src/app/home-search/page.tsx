import type { Metadata } from "next";
import { BridgeSearch } from "@/components/bridge/BridgeSearch";
import { Hero } from "@/components/Hero";
import { CTAStrip } from "@/components/CTAStrip";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home Search | Mia Sanabria REALTOR®",
  description:
    "Search available Southeast Florida listings — Fort Lauderdale, Pompano Beach, Coral Springs, Weston, and surrounding Broward County communities.",
  alternates: { canonical: `${SITE.url}/home-search/` },
  robots: { index: false, follow: true },
};

export default function HomeSearchPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Home Search", href: "/home-search/" },
        ]}
      />

      {/*
        Cycle 34 World-Class Completion (2026-05-14): eyebrow aligned with the
        homepage hero theme lock ("South Florida Lifestyle"). Primary CTA now
        anchor-jumps to the in-page Bridge search section so the hero has a
        concrete affordance above the fold; secondary CTA preserves the
        Talk-to-Mia path. Bridge demo-mode honesty is preserved by the
        <BridgeSearch /> component below and by the page-level robots: noindex.
      */}
      <Hero
        eyebrow="South Florida Lifestyle"
        heading="Home Search"
        sub="Browse available Southeast Florida listings across Mia's working market — Fort Lauderdale, Pompano Beach, Coral Springs, Weston, and surrounding communities."
        ctaPrimary={{ href: "#listing-search", label: "Search available homes" }}
        ctaSecondary={{ href: "/contact/?source=home-search", label: "Talk with Mia" }}
        background="image"
        imageSrc="/markets/fort-lauderdale.jpg"
        imageAlt="Fort Lauderdale waterfront"
      />

      <section
        id="listing-search"
        aria-labelledby="search-heading"
        className="bg-cream-50 py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="luxury-divider mb-5">
            <span>Available Listings</span>
          </div>

          <h2
            id="search-heading"
            className="font-display text-3xl text-navy-800 sm:text-4xl"
          >
            Search available Southeast Florida listings.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-navy-800/80">
            Filter by city, price, or bedroom count. Contact Mia for a property-specific
            review, current comparable sales, and next-step guidance on any residence.
          </p>

          <div className="mt-10">
            <BridgeSearch />
          </div>

          <div className="mt-12 rounded-sm border border-brass-400/25 bg-brass-400/5 p-5 lg:p-6">
            <p className="font-display text-lg text-navy-800">
              Found a residence worth a closer look?
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-navy-800/80">
              Note the MLS number and begin a private conversation. Mia will pull
              current comparable sales, ownership history where available, and dock or
              HOA specifics relevant to the residence.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href="/contact/?source=home-search"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
              >
                Begin a Private Inquiry
              </a>
              <a
                href="/valuation/?source=home-search"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-navy-800/20 px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400"
              >
                Request a Valuation
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
