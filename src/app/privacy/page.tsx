import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Mia Sanabria collects, uses, and protects information from visitors and clients. Confidentiality is the default, not the upgrade.",
  alternates: { canonical: `${SITE.url}/privacy/` },
};

const LAST_UPDATED = "2026-05-06";

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy", href: "/privacy/" },
        ]}
      />

      <Hero eyebrow="Privacy Policy" heading="How we handle your information." />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-7 px-4 text-[15px] leading-relaxed text-navy-800/85 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-500">
            Last updated · {LAST_UPDATED}
          </p>

          <h2 className="font-display text-2xl text-navy-800">Who we are</h2>
          <p>
            This site is operated by {MIA.name.legal}, {MIA.title} with {MIA.brokerage.legal}. Contact: {MIA.contact.email}, {MIA.contact.phone}.
          </p>

          <h2 className="font-display text-2xl text-navy-800">What we collect</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Information you submit through forms (name, email, phone, message, property details).</li>
            <li>Standard analytics data — aggregated, never tied to identity (page views, referrer, device class, country).</li>
            <li>Cookies used solely for analytics and form-submission integrity.</li>
          </ul>

          <h2 className="font-display text-2xl text-navy-800">How we use it</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>To respond to your inquiry directly.</li>
            <li>To provide a private valuation, sourcing, or representation conversation.</li>
            <li>For analytics — measuring whether the site serves visitors well, in aggregate.</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your information, share it with third-party data brokers, or
            use it for unrelated marketing. Inquiries do not appear on a marketing list.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Your rights</h2>
          <p>
            You may request a copy of the information we hold about you, request correction, or request
            deletion at any time. Email <a href={`mailto:${MIA.contact.email}`} className="underline">{MIA.contact.email}</a> with the request.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Children</h2>
          <p>
            This site is not directed to children under 13. We do not knowingly collect personal
            information from children.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Updates to this policy</h2>
          <p>
            Material updates will be posted on this page and reflected in the &ldquo;last updated&rdquo;
            date above.
          </p>
        </div>
      </article>
    </>
  );
}
