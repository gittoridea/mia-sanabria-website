import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Market Brief Request Received",
  description:
    "Your private market brief request has been received. Mia will follow up personally with the most relevant market notes.",
  alternates: { canonical: `${SITE.url}/thank-you/market-brief/` },
  robots: { index: false, follow: true },
};

export default function MarketBriefThankYouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Thank You", href: "/thank-you/" },
          { name: "Market Brief", href: "/thank-you/market-brief/" },
        ]}
      />

      <Hero
        eyebrow="Private Market Brief Requested"
        heading="The market brief is private."
        sub="Mia will follow up personally with the most relevant market notes for the markets you indicated."
      />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>What the brief contains</span>
          </div>
          <p className="text-[17px] leading-relaxed text-navy-800/85">
            The private market brief is an infrequent dispatch on the markets Mia covers —
            Eastern Fort Lauderdale, Boca Raton, Delray Beach, and the surrounding waterfront
            municipalities. It is sent only when there is something specific worth saying — a
            meaningful turnover pattern, a parcel-level comparable that reframes pricing in a
            cohort, a quietly-developing inventory shift in a specific neighborhood. It is not a
            newsletter, and it is not automated.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
            Mia will follow up personally with one private response on the markets you indicated.
            There is no subscription mechanic; if you would like to receive ongoing market notes
            after that first conversation, the request is handled separately and explicitly — never
            as an automatic enrollment from this form.
          </p>
          <h3 className="mt-10 font-display text-2xl text-navy-800">
            While you wait.
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            The Insights library has twelve evergreen briefs that frame the markets and the
            decisions a market brief sometimes touches on. Read in any order; each stands alone.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/insights/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Read the Insights library
            </Link>
            <Link
              href="/markets/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700"
            >
              See the markets
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
