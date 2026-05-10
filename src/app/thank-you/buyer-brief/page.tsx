import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buyer Brief Received",
  description:
    "Your private buyer brief request has been received. Mia will respond personally to schedule the first private conversation.",
  alternates: { canonical: `${SITE.url}/thank-you/buyer-brief/` },
  robots: { index: false, follow: true },
};

export default function BuyerBriefThankYouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Thank You", href: "/thank-you/" },
          { name: "Buyer Brief", href: "/thank-you/buyer-brief/" },
        ]}
      />

      <Hero
        eyebrow="Private Buyer Brief Requested"
        heading="The brief is the access."
        sub="Mia will respond personally to schedule the first private conversation — typically 60-90 minutes — where the brief takes shape."
      />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>The first conversation</span>
          </div>
          <p className="text-[17px] leading-relaxed text-navy-800/85">
            The private buyer brief is not a form. It is the working document that captures
            lifestyle, neighborhood preference, lot or building profile, vessel or transport
            requirements, architectural era, target band, and timing. The first conversation —
            typically 60-90 minutes, sometimes broken across two sessions — is where the brief
            takes its initial shape. Mia stress-tests the commitments and returns a written brief
            you can review and revise before any showings are scheduled.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
            Mia will respond personally to schedule the first conversation. The brief tightens
            through pursuit; revisions are tracked so its evolution is honest.
          </p>
          <h3 className="mt-10 font-display text-2xl text-navy-800">
            While you wait.
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            One brief in the Insights library is the most directly useful preparation — the
            framework Mia uses to write briefs with serious buyers, and the questions worth
            sitting with before the first conversation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/insights/private-buyer-brief-defining-the-search/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Read the Buyer Brief framework
            </Link>
            <Link
              href="/markets/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700"
            >
              Walk the markets
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
