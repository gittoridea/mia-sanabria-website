import type { Place, WithContext } from "schema-dts";
import { JsonLd } from "./JsonLd";

const REGION_FULL_NAME: Record<string, string> = { FL: "Florida" };

export function PlaceSchema({
  name,
  description,
  region,
  county,
  latitude,
  longitude,
}: {
  name: string;
  description: string;
  region: string;
  /** County the market sits in — emitted as containedInPlace administrative area for AEO disambiguation. */
  county?: string;
  latitude: number;
  longitude: number;
}) {
  const regionFull = REGION_FULL_NAME[region] ?? region;
  const stateAdmin = {
    "@type": "AdministrativeArea" as const,
    name: regionFull,
    address: {
      "@type": "PostalAddress" as const,
      addressRegion: region,
      addressCountry: "US",
    },
  };
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
      ...(county ? { addressRegion: region, addressLocality: name } : {}),
    },
    geo: { "@type": "GeoCoordinates", latitude, longitude },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    containedInPlace: county
      ? {
          "@type": "AdministrativeArea",
          name: county,
          containedInPlace: stateAdmin,
        }
      : stateAdmin,
  };
  return <JsonLd data={data} />;
}
