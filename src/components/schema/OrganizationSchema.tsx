import type { Organization, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export function OrganizationSchema() {
  const data: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: MIA.brokerage.legal,
    alternateName: `${MIA.name.marketing} — ${MIA.brokerage.display}`,
    url: SITE.url,
    logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` },
    sameAs: [
      MIA.social.facebook,
      MIA.social.instagram,
      MIA.social.linkedin,
      MIA.social.youtube,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: MIA.contact.phoneTel,
        contactType: "sales",
        areaServed: "US-FL",
        availableLanguage: ["English"],
      },
    ],
  };
  return <JsonLd data={data} />;
}
