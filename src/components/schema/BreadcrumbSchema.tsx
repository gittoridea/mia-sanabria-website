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
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE.url}${item.href}`,
    })),
  };
  return <JsonLd data={data} />;
}
