import type { Service, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export function ServiceSchema({
  name,
  description,
  serviceType,
}: {
  name: string;
  description: string;
  serviceType: string;
}) {
  const data: WithContext<Service> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: { "@id": `${SITE.url}/#realestate-agent` },
    areaServed: MIA.serviceArea.administrative.map((county) => ({
      "@type": "AdministrativeArea",
      name: county,
    })),
  };
  return <JsonLd data={data} />;
}
