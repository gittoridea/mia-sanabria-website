import type { BreadcrumbList, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";

export function BreadcrumbSchema({
  items,
}: {
  items: ReadonlyArray<{ name: string; href: string }>;
}) {
  const data: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const url = item.href.startsWith("http") ? item.href : `${SITE.url}${item.href}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: { "@id": url, name: item.name },
      };
    }),
  };
  return <JsonLd data={data} />;
}
