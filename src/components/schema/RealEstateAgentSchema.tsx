import type { RealEstateAgent, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export function RealEstateAgentSchema({
  areaServed,
  knowsAbout,
}: {
  /** Optional override of the served areas (place/municipality names). Defaults
   *  to MIA.serviceArea.administrative. Used on /about to carry Mia's confirmed
   *  broader market set (the seven named markets + both counties). */
  areaServed?: ReadonlyArray<string>;
  /** Optional override of the knowsAbout expertise list. */
  knowsAbout?: ReadonlyArray<string>;
} = {}) {
  const servedAreas = areaServed ?? MIA.serviceArea.administrative;
  const expertise = knowsAbout ?? [
    "Residential real estate",
    "Waterfront properties",
    "Buyer representation",
    "Seller representation",
    "Fort Lauderdale real estate",
    "Boca Raton real estate",
    "Delray Beach real estate",
  ];
  const data: WithContext<RealEstateAgent> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE.url}/#realestate-agent`,
    name: MIA.name.legal,
    alternateName: MIA.name.marketing,
    url: SITE.url,
    image: `${SITE.url}/mia-headshot.jpg`,
    telephone: MIA.contact.phoneTel,
    email: MIA.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: MIA.contact.serviceCore.city,
      addressRegion: MIA.contact.serviceCore.region,
      postalCode: MIA.contact.serviceCore.postalCode,
      addressCountry: "US",
    },
    areaServed: servedAreas.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    parentOrganization: { "@id": `${SITE.url}/#organization` },
    knowsAbout: expertise,
    sameAs: [
      MIA.social.facebook,
      MIA.social.instagram,
      MIA.social.linkedin,
      MIA.social.youtube,
    ],
  };
  return <JsonLd data={data} />;
}
