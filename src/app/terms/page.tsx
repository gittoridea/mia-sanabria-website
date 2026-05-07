import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of the Mia Sanabria luxury real estate website and the relationship between visitors and the practice.",
  alternates: { canonical: `${SITE.url}/terms/` },
};

const LAST_UPDATED = "2026-05-06";

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Terms", href: "/terms/" },
        ]}
      />

      <Hero eyebrow="Terms of Service" heading="The plain rules of the road." />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-7 px-4 text-[15px] leading-relaxed text-navy-800/85 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-500">
            Last updated · {LAST_UPDATED}
          </p>

          <h2 className="font-display text-2xl text-navy-800">Acceptance</h2>
          <p>
            By using this site you agree to these terms. If you do not agree, please do not use the
            site.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Information accuracy</h2>
          <p>
            All information is deemed reliable but not guaranteed. Real estate listings, market commentary,
            valuation framing, and neighborhood descriptions are provided as guidance and may change without
            notice. Verify all material facts independently before any transaction.
          </p>

          <h2 className="font-display text-2xl text-navy-800">No agency relationship without engagement</h2>
          <p>
            Submitting a form or sending an email does not create a brokerage agency relationship. A
            written brokerage agreement is required for {MIA.title} representation.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Equal Housing Opportunity</h2>
          <p>
            {MIA.brokerage.legal} is committed to Equal Housing Opportunity. We do not discriminate on
            the basis of race, color, religion, sex, handicap, familial status, national origin, or any
            other protected class.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {MIA.name.legal} and {MIA.brokerage.legal} are not
            liable for indirect, incidental, or consequential damages arising from use of this site.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Governing law</h2>
          <p>
            These terms are governed by the laws of the State of Florida, without regard to conflict-of-laws
            principles.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Contact</h2>
          <p>
            Questions: <a href={`mailto:${MIA.contact.email}`} className="underline">{MIA.contact.email}</a> or {MIA.contact.phone}.
          </p>
        </div>
      </article>
    </>
  );
}
