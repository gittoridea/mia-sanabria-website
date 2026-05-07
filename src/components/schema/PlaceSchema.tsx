import type { Place, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";

export function PlaceSchema({
  name,
  description,
  region,
  latitude,
  longitude,
}: {
  name: string;
  description: string;
  region: string;
  latitude: number;
  longitude: number;
}) {
  const data: WithContext<Place> = {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: name,
      addressRegion: region,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude, longitude },
  };
  return <JsonLd data={data} />;
}
