import type { ContactPage, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";

export function ContactPageSchema() {
  const data: WithContext<ContactPage> = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Mia Sanabria",
    url: `${SITE.url}/contact/`,
    isPartOf: { "@id": `${SITE.url}/#website` },
  };
  return <JsonLd data={data} />;
}
