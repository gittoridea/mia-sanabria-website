import type { JSX } from "react";
import type { Offer, OfferCatalog, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";

export type OfferItem = { name: string; description: string };

type OfferCatalogWithProvider = WithContext<OfferCatalog> & {
  provider: { "@id": string };
};

function slugifyCatalogName(catalogName: string): string {
  return catalogName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function withProvider(data: OfferCatalogWithProvider): WithContext<OfferCatalog> {
  return data;
}

export function OfferCatalogSchema({
  catalogName,
  providerType = "RealEstateAgent",
  items,
}: {
  catalogName: string;
  providerType?: "Person" | "RealEstateAgent";
  items: OfferItem[];
}): JSX.Element {
  const offers: Offer[] = items.map(({ name, description }) => ({
    "@type": "Offer",
    name,
    description,
    itemOffered: {
      "@type": "Service",
      name,
      provider: { "@type": providerType, "@id": `${SITE.url}/#person` },
    },
  }));

  const data: WithContext<OfferCatalog> = withProvider({
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE.url}/${slugifyCatalogName(catalogName)}/#offercatalog`,
    name: catalogName,
    provider: { "@id": `${SITE.url}/#person` },
    itemListElement: offers,
  });

  return <JsonLd data={data} />;
}
