import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { MIA } from "@/lib/mia";
import { SITE } from "@/lib/site";

const LAST_UPDATED = "2026-05-08";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How Mia Sanabria collects, uses, and protects personal information on this real estate website, including privacy rights and contact options.";
const URL = `${SITE.url}/privacy/`;
const OG_IMAGE = `${SITE.url}/og-default.jpg`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE }],
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
  about: [
    { "@type": "Thing", name: "Privacy policy" },
    { "@type": "Thing", name: "Real estate lead inquiries" },
  ],
  inLanguage: SITE.locale,
  dateModified: LAST_UPDATED,
  image: OG_IMAGE,
};

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy/" },
        ]}
      />
      <JsonLd data={webPageSchema} />

      <Hero
        eyebrow="Privacy Policy"
        heading="How this website collects, uses, and protects personal information."
      />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-7 px-4 text-[15px] leading-relaxed text-navy-800/85 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-700">
            Last updated · {LAST_UPDATED}
          </p>

          <h2 className="font-display text-2xl text-navy-800">Identity and contact information</h2>
          <p>
            This website is operated by {MIA.name.legal}, {MIA.title}, in affiliation with{" "}
            {MIA.brokerage.legal}. If you have a privacy question, request, or complaint, contact us at{" "}
            <a href={`mailto:${MIA.contact.email}`} className="underline">
              {MIA.contact.email}
            </a>{" "}
            or{" "}
            <a href={`tel:${MIA.contact.phoneTel}`} className="underline">
              {MIA.contact.phone}
            </a>
            .
          </p>

          <h2 className="font-display text-2xl text-navy-800">Information we collect</h2>
          <p>
            We collect information you choose to provide and limited technical information needed to
            operate, secure, and improve the site.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Form submissions, including your name, email address, phone number, message, and property
              interest.
            </li>
            <li>
              Cookies and similar technologies used for analytics and form-integrity or anti-abuse checks.
            </li>
            <li>
              Server logs and device data, such as IP address, browser type, pages requested, and
              user-agent string.
            </li>
            <li>Referral data, such as the page or campaign that brought you to the site.</li>
            {MIA.tracking.ga4Id ? (
              <li>
                Usage and performance information collected through Google Analytics 4, such as page
                views, session activity, and broad geographic trends.
              </li>
            ) : null}
          </ul>

          <h2 className="font-display text-2xl text-navy-800">How we use information</h2>
          <p>
            We use personal information for real estate inquiry handling, site operations, and lawful
            business administration.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              To respond to questions, schedule follow-up conversations, and provide requested real estate
              information.
            </li>
            <li>
              To maintain records related to active inquiries, representation discussions, and service
              requests.
            </li>
            <li>To secure the site, detect abuse, troubleshoot errors, and monitor traffic patterns.</li>
            <li>To evaluate site performance and improve content, usability, and lead-routing workflows.</li>
          </ul>

          <h2 className="font-display text-2xl text-navy-800">Legal bases and business purposes</h2>
          <p>
            When GDPR applies, we process personal information based on your consent, our legitimate
            interests in operating and securing this website, and the steps needed to respond to your
            request before any brokerage relationship is formed.
          </p>
          <p>
            For California privacy disclosures, we collect and use personal information for business
            purposes such as responding to inquiries, operating the website, analytics, fraud prevention,
            recordkeeping, and quality assurance.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Service providers and third parties</h2>
          <p>
            We may share information with service providers that help us operate the website and respond
            to inquiries, subject to contractual or operational controls appropriate to the service.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            {MIA.tracking.ga4Id ? <li>Google Analytics 4 for website analytics and performance reporting.</li> : null}
            <li>
              GoHighLevel or LeadConnector for lead capture, contact routing, and follow-up workflows
              when those tools are connected.
            </li>
            <li>Cloudflare as a content delivery network and security layer.</li>
            {MIA.tracking.userwayId ? <li>An accessibility widget used to support on-site accessibility options.</li> : null}
          </ul>
          <p>
            We may also disclose information if required by law, to protect rights or safety, or as part
            of a business transfer involving the website or related operations.
          </p>

          <h2 className="font-display text-2xl text-navy-800">California privacy rights</h2>
          <p>
            California residents may request to know the categories and specific pieces of personal
            information we have collected about them, request deletion, request correction of inaccurate
            information, and request information about our disclosure practices.
          </p>
          <p>
            We do not sell or share personal information as those terms are defined under the CCPA and
            CPRA. We do not use sensitive personal information to infer characteristics about you. If you
            believe a limit request is still appropriate for your circumstances, contact us and we will
            review it.
          </p>
          <p>
            California residents also have the right to non-discrimination for exercising privacy rights.
            To submit a request, email{" "}
            <a href={`mailto:${MIA.contact.email}`} className="underline">
              {MIA.contact.email}
            </a>
            .
          </p>

          <h2 className="font-display text-2xl text-navy-800">GDPR and UK privacy rights</h2>
          <p>
            If you are located in the EEA or the UK, you may have rights to access, rectify, erase,
            restrict, or object to our processing of your personal information, and to request data
            portability where applicable. You may also withdraw consent at any time for consent-based
            processing without affecting the lawfulness of processing before withdrawal.
          </p>
          <p>
            You also have the right to lodge a complaint with your local supervisory authority if you
            believe our processing violates applicable data-protection law.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Cookies, analytics, and tracking choices</h2>
          <p>
            This website uses essential technologies needed for site security, form integrity, and basic
            functionality, along with analytics technologies that help us understand site performance.
          </p>
          <p>
            You can manage cookies through your browser settings and, where available, by using
            platform-level opt-out tools offered by analytics providers. Blocking some technologies may
            affect how forms or accessibility features function.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Do Not Track</h2>
          <p>
            Browser-based Do Not Track signals are not yet subject to a uniform industry standard. For
            that reason, this website does not currently respond differently to Do Not Track signals.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Data retention</h2>
          <p>
            We retain form submissions for the duration of an active inquiry and for a reasonable
            follow-up window afterward, unless a longer retention period is required by law, dispute
            resolution needs, or recordkeeping obligations.
          </p>
          <p>
            Analytics retention is governed by the settings and controls of the upstream analytics
            provider.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Security and breach response</h2>
          <p>
            We use administrative, technical, and physical safeguards designed to protect personal
            information against unauthorized access, disclosure, alteration, and destruction. No method
            of transmission over the internet or method of electronic storage is 100% secure, so we
            cannot guarantee absolute security.
          </p>
          <p>
            We will notify affected Florida residents and the Florida Department of Legal Affairs as
            required by Florida Statutes § 501.171 in the event of a security breach involving personal
            information.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Children's privacy</h2>
          <p>
            This website is not directed to children under 13, and we do not knowingly collect personal
            information from children under 13. If a parent or guardian believes that a child has
            provided personal information through the site, contact us at{" "}
            <a href={`mailto:${MIA.contact.email}`} className="underline">
              {MIA.contact.email}
            </a>{" "}
            so we can review and delete the information if appropriate.
          </p>

          <h2 className="font-display text-2xl text-navy-800">International data transfers</h2>
          <p>
            This website is operated from the United States, and servers or service providers handling
            information may be located in the United States or other jurisdictions. By using the site and
            submitting information, you understand that personal information may be transferred to and
            processed in the United States.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Policy updates and effective date</h2>
          <p>
            This Privacy Policy is effective as of {LAST_UPDATED}. We may update it from time to time to
            reflect legal, technical, or operational changes. When we do, we will post the revised
            version here and update the last-updated date above.
          </p>
          <p>
            Privacy requests and questions may be sent to{" "}
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
