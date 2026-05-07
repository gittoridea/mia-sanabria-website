import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { CTAStrip } from "@/components/CTAStrip";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights — Southeast Florida Luxury Real Estate",
  description:
    "Notes from the Southeast Florida luxury real estate market — Boca Raton, Fort Lauderdale, Palm Beach. Quietly published, deeply researched.",
  alternates: { canonical: `${SITE.url}/insights/` },
};

export default function InsightsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights/" },
        ]}
      />

      <Hero
        eyebrow="Insights"
        heading="Notes from the Southeast Florida luxury market."
        sub="Quarterly market notes, neighborhood deep-dives, and reflections on architecture, design, and the residences themselves. Quietly published."
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <div className="luxury-divider mb-6">
            <span>Coming Soon</span>
          </div>
          <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
            The first dispatches are being drafted.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-800/80">
            New essays land at a quarterly cadence — micro-market data, off-market reflections, and neighborhood briefings curated by Mia. Reach out directly to be added to the private list.
          </p>
          <Link
            href="/contact/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
          >
            Join the Private List
          </Link>
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
