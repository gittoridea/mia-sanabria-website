import type { Person, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export function PersonSchema() {
  const data: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: MIA.name.legal,
    alternateName: MIA.name.marketing,
    jobTitle: MIA.title,
    url: SITE.url,
    image: `${SITE.url}/mia-headshot.jpg`,
    telephone: MIA.contact.phoneTel,
    email: MIA.contact.email,
    worksFor: { "@id": `${SITE.url}/#organization` },
    sameAs: [
      MIA.social.facebook,
      MIA.social.instagram,
      MIA.social.linkedin,
      MIA.social.youtube,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: MIA.contact.serviceCore.city,
      addressRegion: MIA.contact.serviceCore.region,
      postalCode: MIA.contact.serviceCore.postalCode,
      addressCountry: "US",
    },
  };
  return <JsonLd data={data} />;
}
