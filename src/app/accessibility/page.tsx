import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { MIA } from "@/lib/mia";
import { SITE } from "@/lib/site";

const LAST_UPDATED = "2026-05-08";
const TITLE = "Accessibility Statement";
const DESCRIPTION =
  "Accessibility statement for the Mia Sanabria website, including WCAG 2.1 AA goals, compatibility notes, and how to report barriers.";
const URL = `${SITE.url}/accessibility/`;
const OG_IMAGE = `${SITE.url}/og-default.jpg`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
};

const webPageSchema: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${URL}#webpage`,
  name: TITLE,
  description: DESCRIPTION,
  url: URL,
  isPartOf: { "@id": `${SITE.url}/#website` },
  inLanguage: SITE.locale,
  dateModified: LAST_UPDATED,
  image: OG_IMAGE,
};

export default function AccessibilityPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Accessibility Statement", href: "/accessibility/" },
        ]}
      />
      <JsonLd data={webPageSchema} />
      <Hero eyebrow="Accessibility Statement" heading="Accessibility standards and support for this website." />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-7 px-4 text-[15px] leading-relaxed text-navy-800/85 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-700">
            Last updated · {LAST_UPDATED}
          </p>

          <h2 className="font-display text-2xl text-navy-800">Our commitment</h2>
          <p>
            We are committed to providing a website that is accessible to individuals with disabilities
            and to supporting meaningful access under applicable law, including the Americans with
            Disabilities Act Title III. Our ongoing target is conformance with the Web Content
            Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>

          <h2 className="font-display text-2xl text-navy-800">What we do</h2>
          <p>
            We build and maintain this site using practical accessibility measures intended to improve
            usability across devices, browsers, and assistive technologies.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Semantic HTML, with ARIA used only where native semantics are insufficient.</li>
            <li>Sequential headings with one H1 per page.</li>
            <li>Color contrast intended to meet WCAG AA requirements.</li>
            <li>Keyboard navigation with visible focus indicators for interactive elements.</li>
            <li>Reduced-motion support through <strong>prefers-reduced-motion</strong>.</li>
            <li>A skip-link that allows users to bypass repeated navigation.</li>
            <li>Forms with visible labels and clear instructions.</li>
          </ul>

          <h2 className="font-display text-2xl text-navy-800">Assistive technology compatibility</h2>
          <p>
            We test and review accessibility with compatibility in mind for recent versions of common
            assistive technologies and access methods, including JAWS, NVDA, and VoiceOver, as well as
            voice-control software and keyboard-only navigation.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Third-party content</h2>
          <p>
            Some third-party content or integrations, including embedded MLS widgets, mapping tools,
            video players, or social embeds, may not fully conform to our accessibility target at all
            times. Where possible, we work with vendors and service providers to identify and remediate
            accessibility issues.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Reporting a barrier</h2>
          <p>
            If you encounter an accessibility barrier on this site, please contact us and include the
            page URL, the issue you experienced, and any assistive technology you were using. We will
            acknowledge your report and respond within a reasonable window.
          </p>
          <p>
            You may reach us at{" "}
            <a href={`mailto:${MIA.contact.email}`} className="underline">
              {MIA.contact.email}
            </a>{" "}
            or by phone at{" "}
            <a href={`tel:${MIA.contact.phoneTel}`} className="underline">
              {MIA.contact.phone}
            </a>
            .
          </p>

          <h2 className="font-display text-2xl text-navy-800">Alternative access</h2>
          <p>
            If you need information from this website in an alternative accessible format, contact us and
            we will work to provide the requested information through an accessible alternative where
            feasible.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Ongoing improvement and updates</h2>
          <p>
            Accessibility is an ongoing effort. This statement is effective as of {LAST_UPDATED}, and we
            may update it from time to time as the site, our tools, or our accessibility practices
            change.
          </p>
        </div>
      </article>
    </>
  );
}
