import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Valuation Request Received",
  description:
    "Your confidential valuation request has been received. Mia will respond personally with the next step in the parcel-level pricing exercise.",
  alternates: { canonical: `${SITE.url}/thank-you/valuation/` },
  robots: { index: false, follow: true },
};

export default function ValuationThankYouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Thank You", href: "/thank-you/" },
          { name: "Valuation", href: "/thank-you/valuation/" },
        ]}
      />

      <Hero
        eyebrow="Confidential Valuation Requested"
        heading="The pricing exercise begins privately."
        sub="Mia will respond personally to schedule the walk-through and the parcel-level comparable pull."
      />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>The pricing pass</span>
          </div>
          <p className="text-[17px] leading-relaxed text-navy-800/85">
            A confidential valuation typically begins with a private walk-through of the residence,
            followed by a curated parcel-level comparable pull (recent sales on the specific street
            or canal, recent sales of comparable lot profiles, current active inventory the buyer
            pool will see). The deliverable is a defensible price band with each comparable named —
            the work that an automated estimate cannot do.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
            Mia will respond personally to schedule the walk-through. The pricing exercise typically
            takes a week to ten days from the first walk-through.
          </p>
          <h3 className="mt-10 font-display text-2xl text-navy-800">
            While you wait.
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            Two briefs in the Insights library are directly relevant to the pricing pass — one
            on why automated valuations miss luxury waterfront value, and one on positioning a
            luxury waterfront residence for sale.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/insights/why-automated-valuations-miss-luxury-waterfront/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Why automated valuations miss
            </Link>
            <Link
              href="/insights/positioning-luxury-waterfront-eastern-fort-lauderdale/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700"
            >
              Positioning a luxury waterfront home
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
