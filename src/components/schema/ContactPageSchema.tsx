import type { ContactPage, ContactPoint, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

type ContactPageWithContactPoints = WithContext<ContactPage> & {
  contactPoint: ContactPoint[];
};

function withContactPoints(data: ContactPageWithContactPoints): WithContext<ContactPage> {
  return data;
}

export function ContactPageSchema() {
  const data: WithContext<ContactPage> = withContactPoints({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Mia Sanabria",
    url: `${SITE.url}/contact/`,
    isPartOf: { "@id": `${SITE.url}/#website` },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: MIA.contact.phoneTel,
        contactType: "customer service",
        areaServed: "US-FL",
        availableLanguage: ["en"],
      },
      {
        "@type": "ContactPoint",
        email: MIA.contact.email,
        contactType: "customer service",
        areaServed: "US-FL",
        availableLanguage: ["en"],
      },
      {
        "@type": "ContactPoint",
        telephone: MIA.contact.phoneTel,
        contactType: "sales",
        areaServed: "US-FL",
        availableLanguage: ["en"],
      },
    ],
  });
  return <JsonLd data={data} />;
}
