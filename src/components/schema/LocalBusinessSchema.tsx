import type { LocalBusiness, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export function LocalBusinessSchema() {
  const data: WithContext<LocalBusiness> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#localbusiness`,
    name: `${MIA.name.marketing} — ${MIA.brokerage.display}`,
    image: `${SITE.url}/mia-headshot.jpg`,
    url: SITE.url,
    telephone: MIA.contact.phoneTel,
    address: {
      "@type": "PostalAddress",
      addressLocality: MIA.contact.serviceCore.city,
      addressRegion: MIA.contact.serviceCore.region,
      postalCode: MIA.contact.serviceCore.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.1224,
      longitude: -80.1373,
    },
  };
  return <JsonLd data={data} />;
}
