import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { MIA } from "@/lib/mia";
import { SITE } from "@/lib/site";

const LAST_UPDATED = "2026-05-08";
const TITLE = "DMCA Notice";
const DESCRIPTION =
  "How to submit a DMCA takedown notice or counter-notice for content on the Mia Sanabria website under 17 U.S.C. § 512.";
const URL = `${SITE.url}/dmca/`;
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
  inLanguage: SITE.locale,
  dateModified: LAST_UPDATED,
  image: OG_IMAGE,
};

export default function DmcaPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "DMCA Notice", href: "/dmca/" },
        ]}
      />
      <JsonLd data={webPageSchema} />
      <Hero eyebrow="DMCA Notice" heading="Copyright takedown and counter-notice procedures." />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-7 px-4 text-[15px] leading-relaxed text-navy-800/85 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-700">
            Last updated · {LAST_UPDATED}
          </p>

          <h2 className="font-display text-2xl text-navy-800">Overview</h2>
          <p>
            If you believe material on this website infringes your copyright, you may submit a takedown
            notice under the Digital Millennium Copyright Act, 17 U.S.C. § 512. If you believe material
            was removed by mistake or misidentification, you may submit a counter-notice. This page
            explains those procedures in plain language, but it is not legal advice.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Designated agent</h2>
          <p>
            We are in the process of registering a DMCA designated agent with the U.S. Copyright Office.
            Until that registration is complete, send notices to the contact below and allow additional
            processing time.
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${MIA.contact.email}?subject=DMCA%20Notice`} className="underline">
              {MIA.contact.email}
            </a>{" "}
            with the subject line <strong>DMCA Notice</strong>.
          </p>
          {/* TODO: register DMCA agent with US Copyright Office before .com cutover */}
          <p>
            <strong>Mailing address:</strong> A mailing address for formal DMCA notices will be published
            here once the designated-agent registration is complete.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Submitting a takedown notice</h2>
          <p>A takedown notice under 17 U.S.C. § 512(c)(3) should include the following:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Physical or electronic signature of the owner or authorized agent.</li>
            <li>Identification of the copyrighted work claimed to be infringed.</li>
            <li>
              Identification of the material that is claimed to be infringing, with information
              reasonably sufficient to permit us to locate it, preferably including a URL.
            </li>
            <li>Contact information for the notifier, including address, telephone number, and email.</li>
            <li>
              A statement that the notifier has a good-faith belief that the use is not authorized by the
              copyright owner, its agent, or the law.
            </li>
            <li>
              A statement, under penalty of perjury, that the information is accurate and that the
              notifier is authorized to act on behalf of the owner of the exclusive right allegedly
              infringed.
            </li>
          </ul>

          <h2 className="font-display text-2xl text-navy-800">Submitting a counter-notice</h2>
          <p>A counter-notice under 17 U.S.C. § 512(g)(3) should include the following:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Physical or electronic signature.</li>
            <li>
              Identification of the material that was removed and the location at which it appeared
              before removal.
            </li>
            <li>
              A statement under penalty of perjury that the sender has a good-faith belief the material
              was removed or disabled as a result of mistake or misidentification.
            </li>
            <li>
              The sender&apos;s name, address, and telephone number; consent to the jurisdiction of the
              federal district court for the address provided or, if outside the United States, any
              judicial district where the service provider may be found; and a statement that the sender
              will accept service of process from the person who submitted the takedown notice or that
              person&apos;s authorized agent.
            </li>
          </ul>

          <h2 className="font-display text-2xl text-navy-800">Repeat-infringer policy</h2>
          <p>
            We will, in appropriate circumstances, terminate accounts or restrict access for repeat
            infringers if we determine that a user has repeatedly posted or submitted infringing material.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Misrepresentation warning</h2>
          <p>
            Under 17 U.S.C. § 512(f), any person who knowingly materially misrepresents that material or
            activity is infringing, or that material was removed or disabled by mistake or
            misidentification, may be subject to liability for damages, costs, and attorneys&apos; fees.
          </p>

          <h2 className="font-display text-2xl text-navy-800">Where to send notices</h2>
          <p>
            Send DMCA notices and counter-notices to{" "}
            <a href={`mailto:${MIA.contact.email}?subject=DMCA%20Notice`} className="underline">
              {MIA.contact.email}
            </a>{" "}
            with the subject line <strong>DMCA Notice</strong>. Mailing address publication is pending
            designated-agent registration.
          </p>
        </div>
      </article>
    </>
  );
}
