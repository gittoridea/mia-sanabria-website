import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { MIA } from "@/lib/mia";
import { SITE } from "@/lib/site";

const LAST_UPDATED = "2026-05-08";
const TITLE = "Terms of Service";
const DESCRIPTION =
  "Terms governing use of the Mia Sanabria real estate website, MLS content, inquiry handling, and when a brokerage relationship is formed.";
const URL = `${SITE.url}/terms/`;
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

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Terms of Service", href: "/terms/" },
        ]}
      />
      <JsonLd data={webPageSchema} />
      <Hero eyebrow="Terms of Service" heading="Terms governing use of this website and inquiry submissions." />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-7 px-4 text-[15px] leading-relaxed text-navy-800/85 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-700">
            Last updated · {LAST_UPDATED}
          </p>

          <h2 className="font-display text-2xl text-navy-800">Acceptance and eligibility</h2>
          <p>
            By accessing or using this website, you agree to these Terms of Service. You represent that
            you are at least 18 years old and legally capable of entering into a binding agreement. If
            you do not agree to these terms, do not use the site.
          </p>

          <h2 className="font-display text-2xl text-navy-800">License to use the site</h2>
          <p>
            Subject to these terms, we grant you a limited, revocable, non-transferable, non-exclusive
            license to access and use this website for your personal, informational, and non-commercial
            use. This license does not permit resale, republication, systematic extraction of content, or
            any use inconsistent with applicable law or these terms.
          </p>

          <h2 className="font-display text-2xl text-navy-800">
            Information accuracy and IDX/MLS disclaimer
          </h2>
          <p>
            Property information, pricing, availability, market commentary, measurements, school data,
            neighborhood information, and similar content on this site are deemed reliable but not
            guaranteed. You are responsible for independently verifying all material facts before relying
            on them in any transaction.
          </p>
          <p>
            Any IDX, MLS, or similar listing content is subject to the rules, policies, display
            requirements, and data standards of the applicable listing provider. Listing content may be
            delayed, incomplete, withdrawn, or changed without notice.
          </p>

          <h2 className="font-display text-2xl text-navy-800">
            No real estate, legal, tax, or financial advice
          </h2>
          <p>
            Content on this site is provided for general informational purposes only and does not
            constitute real estate, legal, tax, accounting, mortgage, or financial advice. You should
            consult qualified licensed professionals regarding your specific transaction, investment, tax,
            financing, or legal situation.
          </p>

          <h2 className="font-display text-2xl text-navy-800">REALTOR® and NAR membership</h2>
          <p>
            REALTOR® is a federally registered collective membership mark of the National Association of
            REALTORS® and identifies real estate professionals who are members of NAR and subscribe to
            its Code of Ethics.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Brokerage relationship</h2>
          <p>
            {MIA.brokerage.legal} is the licensed Florida real estate broker affiliated with this
            website. {MIA.name.legal} serves in a sales-associate role in connection with that brokerage.
            Visiting the site, sending a message, requesting information, or submitting a form does not
            by itself create an agency, fiduciary, or brokerage relationship. No such relationship is
            formed unless and until a written brokerage agreement is executed where required by law.
          </p>
          {MIA.unverified.licenseNumber ? <p>FL License #{MIA.unverified.licenseNumber}</p> : null}

          <h2 className="font-display text-2xl text-navy-800">Equal Housing Opportunity</h2>
          <p>
            We support Equal Housing Opportunity and comply with the Fair Housing Act, 42 U.S.C. § 3601
            et seq. We do not discriminate on the basis of race, color, religion, sex, disability,
            familial status, national origin, or any other characteristic protected by applicable law.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Contact and consent</h2>
          <p>
            If you submit a form, request information, or otherwise provide your contact details, you
            consent to being contacted by phone, SMS, and email regarding your inquiry, subject to
            applicable law including the Telephone Consumer Protection Act and Florida Statutes § 501.059.
            Your consent is not a condition of purchasing any property, goods, or services. You may opt
            out of SMS communications at any time by replying STOP.
          </p>

          <h2 className="font-display text-2xl text-navy-800">User submissions</h2>
          <p>
            Any comments, messages, inquiries, documents, feedback, or other materials you submit through
            the site are treated as non-confidential, except as otherwise required by law or described in
            the Privacy Policy. By submitting content, you grant us a non-exclusive right to use, store,
            review, and forward that content as reasonably necessary to respond to your inquiry and
            operate the site and related business workflows.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Prohibited conduct</h2>
          <p>You agree not to use the site to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Scrape, harvest, copy, or extract listing data or other content through automated means.</li>
            <li>Reverse engineer, interfere with, damage, or attempt to bypass site functionality or security.</li>
            <li>Use bots, scripts, or other automated access methods except standard search-engine crawling as allowed.</li>
            <li>Harass, threaten, defame, or abuse any person through or in connection with the site.</li>
            <li>Impersonate another person or misrepresent your affiliation, authority, or identity.</li>
          </ul>

          <h2 className="font-display text-2xl text-navy-800">Third-party links</h2>
          <p>
            This site may link to third-party websites, tools, maps, videos, forms, or services for your
            convenience. We are not responsible for the content, availability, policies, or practices of
            third parties, and a link does not imply endorsement.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Disclaimer of warranties</h2>
          <p>
            This website and all content, tools, and services made available through it are provided on
            an AS IS and AS AVAILABLE basis, without warranties of any kind, whether express, implied, or
            statutory, including implied warranties of merchantability, fitness for a particular purpose,
            title, non-infringement, accuracy, or uninterrupted availability.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {MIA.name.legal}, {MIA.brokerage.legal}, and their
            affiliates, officers, agents, and service providers will not be liable for any indirect,
            incidental, special, consequential, exemplary, or punitive damages, or for any loss of data,
            profits, revenue, goodwill, or business opportunity arising out of or related to your use of
            or inability to use the site.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless {MIA.name.legal}, {MIA.brokerage.legal},
            and their affiliates, officers, agents, and service providers from and against claims,
            liabilities, damages, judgments, losses, and expenses, including reasonable attorneys&apos;
            fees, arising out of or related to your violation of these terms or misuse of the site.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Governing law and venue</h2>
          <p>
            These terms are governed by the laws of the State of Florida, without regard to conflict-of-
            laws principles. Any action arising out of or relating to these terms or the site must be
            brought exclusively in the state or federal courts serving Broward County, Florida, and you
            consent to that venue and jurisdiction.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Dispute resolution</h2>
          <p>
            Before initiating formal legal proceedings, the parties agree to attempt in good faith to
            resolve any dispute informally by written notice and direct discussion. If any provision of
            these terms is held unenforceable, the remaining provisions will remain in full force and
            effect. These terms, together with any policies incorporated by reference, constitute the
            entire agreement between you and us regarding use of the site.
          </p>

          <h2 className="font-display text-2xl text-navy-800">DMCA</h2>
          <p>
            If you believe content on this site infringes your copyright, review our{" "}
            <a href="/dmca/" className="underline">
              DMCA Notice
            </a>{" "}
            for takedown and counter-notice procedures.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Changes to these terms</h2>
          <p>
            We may update these terms from time to time to reflect legal, operational, or site changes.
            When we do, we will post the revised version on this page and update the last-updated date
            above. Your continued use of the site after any update constitutes acceptance of the revised
            terms.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Contact</h2>
          <p>
            Questions about these terms may be sent to{" "}
            <a href={`mailto:${MIA.contact.email}`} className="underline">
              {MIA.contact.email}
            </a>{" "}
            or by phone at{" "}
            <a href={`tel:${MIA.contact.phoneTel}`} className="underline">
              {MIA.contact.phone}
            </a>
            .
          </p>
        </div>
      </article>
    </>
  );
}
