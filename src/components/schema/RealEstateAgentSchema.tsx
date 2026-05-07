import type { RealEstateAgent, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export function RealEstateAgentSchema() {
  const data: WithContext<RealEstateAgent> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE.url}/#realestate-agent`,
    name: `${MIA.name.legal} — ${MIA.brokerage.display}`,
    url: SITE.url,
    image: `${SITE.url}/mia-headshot.svg`,
    telephone: MIA.contact.phoneTel,
    email: MIA.contact.email,
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: MIA.contact.serviceCore.city,
      addressRegion: MIA.contact.serviceCore.region,
      postalCode: MIA.contact.serviceCore.postalCode,
      addressCountry: "US",
    },
    areaServed: MIA.serviceArea.administrative.map((county) => ({
      "@type": "AdministrativeArea",
      name: county,
    })),
    parentOrganization: {
      "@type": "Organization",
      name: MIA.brokerage.legal,
    },
    sameAs: [
      MIA.social.facebook,
      MIA.social.instagram,
      MIA.social.linkedin,
      MIA.social.youtube,
    ],
  };
  return <JsonLd data={data} />;
}
