import type { WebSite, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";

export function WebSiteSchema() {
  const data: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
  return <JsonLd data={data} />;
}
