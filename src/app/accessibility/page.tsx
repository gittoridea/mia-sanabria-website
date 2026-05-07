import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Mia Sanabria's commitment to a digitally accessible real estate website for every visitor — and how to report any barrier you encounter.",
  alternates: { canonical: `${SITE.url}/accessibility/` },
};

const LAST_UPDATED = "2026-05-06";

export default function AccessibilityPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Accessibility", href: "/accessibility/" },
        ]}
      />

      <Hero eyebrow="Accessibility" heading="A site that works for everyone." />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-7 px-4 text-[15px] leading-relaxed text-navy-800/85 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-500">
            Last updated · {LAST_UPDATED}
          </p>

          <h2 className="font-display text-2xl text-navy-800">Our commitment</h2>
          <p>
            We are committed to providing a website that is accessible to the widest possible audience,
            regardless of ability. We aim to conform to Web Content Accessibility Guidelines (WCAG) 2.2
            level AA.
          </p>

          <h2 className="font-display text-2xl text-navy-800">What we do</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Semantic HTML and ARIA only where native semantics are insufficient.</li>
            <li>Sequential heading hierarchy with one H1 per page.</li>
            <li>Color contrast ratios meeting WCAG AA on body text and large text.</li>
            <li>Keyboard navigation across every interactive element with visible focus states.</li>
            <li>Reduced-motion preferences respected via <code>prefers-reduced-motion</code>.</li>
            <li>Skip-to-main-content link available on every page.</li>
            <li>Form fields labeled and validated with clear error messaging.</li>
          </ul>

          <h2 className="font-display text-2xl text-navy-800">Reporting a barrier</h2>
          <p>
            If you encounter an accessibility barrier on this site, please let us know — we treat these
            reports with priority and will work to resolve them quickly.
          </p>
          <p>
            Email: <a href={`mailto:${MIA.contact.email}`} className="underline">{MIA.contact.email}</a>
            <br />
            Phone: <a href={`tel:${MIA.contact.phoneTel}`} className="underline">{MIA.contact.phone}</a>
          </p>

          <h2 className="font-display text-2xl text-navy-800">Ongoing improvement</h2>
          <p>
            Accessibility is an ongoing effort. This page documents our current standards and will be
            updated as improvements ship.
          </p>
        </div>
      </article>
    </>
  );
}
