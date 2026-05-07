import type { Place, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";

const REGION_FULL_NAME: Record<string, string> = { FL: "Florida" };

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
  const regionFull = REGION_FULL_NAME[region] ?? region;
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
    hasMap: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: regionFull,
      address: {
        "@type": "PostalAddress",
        addressRegion: region,
        addressCountry: "US",
      },
    },
  };
  return <JsonLd data={data} />;
}
