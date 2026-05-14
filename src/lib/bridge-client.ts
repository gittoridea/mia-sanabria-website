/**
 * Bridge Data Output — browser-side API client.
 *
 * Architecture: Option D — Browser Token direct client.
 *
 * Bridge explicitly documents the Browser Token as "Used for websites
 * that may query the API directly from the browser." This module reads
 * NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN and NEXT_PUBLIC_BRIDGE_DATASET_ID,
 * which are baked into the static bundle at build time via Next.js
 * NEXT_PUBLIC_ convention.
 *
 * Security controls:
 *   - Referrer Domain must be set in Bridge dashboard (Torrey action)
 *   - IDX endpoint (/idx/Properties) limits to IDX-appropriate data
 *   - Server token and client secret are never referenced here
 *   - Response is sanitized to SanitizedListing before reaching the UI
 *   - Query inputs are validated and clamped before reaching Bridge
 *
 * See: docs/artifacts/cycle-33-bridge-runtime/browser-token-risk-acceptance.md
 */

import type { ODataCollection, BridgeProperty } from "./bridge-schema";
import { BRIDGE_SELECT_FIELDS } from "./bridge-schema";
import { MIA_APPROVED_NEIGHBORHOODS } from "./mia";

const BRIDGE_API_BASE = "https://api.bridgedataoutput.com/api/v2/OData";
const MAX_PAGE_SIZE = 12;

const BROWSER_TOKEN = process.env.NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN ?? "";
const DATASET_ID = process.env.NEXT_PUBLIC_BRIDGE_DATASET_ID ?? "";
/**
 * Production default: "idx/Properties" — the IDX-license-filtered endpoint.
 * Override with "Property" for test datasets that don't have an IDX feed
 * provisioned (e.g., test_sf, test_sd). Allow-listed to prevent path injection.
 */
const RAW_RESOURCE_PATH =
  process.env.NEXT_PUBLIC_BRIDGE_RESOURCE_PATH ?? "idx/Properties";
const ALLOWED_RESOURCE_PATHS = new Set(["idx/Properties", "Property"]);
const RESOURCE_PATH = ALLOWED_RESOURCE_PATHS.has(RAW_RESOURCE_PATH)
  ? RAW_RESOURCE_PATH
  : "idx/Properties";

/**
 * Demo mode flag — surfaces a "Demo Data" banner above results and
 * disables the inquiry CTA on cards, so test fixture data is never
 * presented to visitors as real listings.
 */
export const BRIDGE_DEMO_MODE =
  (process.env.NEXT_PUBLIC_BRIDGE_DEMO ?? "").toLowerCase() === "true";

/** True when both required public env vars are present in the bundle. */
export const BRIDGE_AVAILABLE = !!(BROWSER_TOKEN && DATASET_ID);

const ALLOWED_CITIES: Set<string> = new Set(
  MIA_APPROVED_NEIGHBORHOODS.map((n) => n.label)
);

const ALLOWED_STATUSES = new Set(["Active", "ComingSoon"]);

export type BridgeSearchQuery = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  status?: "Active" | "ComingSoon";
  page?: number;
};

export type ListingCard = {
  listingKey: string;
  listPrice: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  city: string;
  zip: string;
  status: string;
  mediaUrl: string | null;
  remarks: string | null;
};

export type BridgeSearchResult = {
  listings: ListingCard[];
  total: number | null;
  error: "search-unavailable" | "search-error" | null;
};

function buildODataParams(query: BridgeSearchQuery): Record<string, string> {
  const filters: string[] = [];

  if (query.city && ALLOWED_CITIES.has(query.city)) {
    filters.push(`City eq '${query.city.replace(/'/g, "''")}'`);
  }
  if (typeof query.minPrice === "number" && query.minPrice > 0) {
    filters.push(`ListPrice ge ${Math.round(query.minPrice)}`);
  }
  if (typeof query.maxPrice === "number" && query.maxPrice > 0) {
    filters.push(`ListPrice le ${Math.round(query.maxPrice)}`);
  }
  if (typeof query.beds === "number" && query.beds > 0) {
    filters.push(`BedroomsTotal ge ${Math.round(query.beds)}`);
  }
  if (typeof query.baths === "number" && query.baths > 0) {
    filters.push(`BathroomsTotalInteger ge ${Math.round(query.baths)}`);
  }

  const rawStatus = query.status;
  const status =
    rawStatus && ALLOWED_STATUSES.has(rawStatus) ? rawStatus : "Active";
  filters.push(`StandardStatus eq '${status}'`);

  const page = Math.max(
    1,
    typeof query.page === "number" ? Math.round(query.page) : 1
  );
  const skip = (page - 1) * MAX_PAGE_SIZE;

  const params: Record<string, string> = {
    access_token: BROWSER_TOKEN,
    $top: String(MAX_PAGE_SIZE),
    $skip: String(skip),
    $select: BRIDGE_SELECT_FIELDS,
    $orderby: "ModificationTimestamp desc",
    $count: "true",
  };

  if (filters.length > 0) {
    params["$filter"] = filters.join(" and ");
  }

  return params;
}

const SAFE_PHOTO_PATTERN = /\.(jpe?g|png|webp|avif)(\?|$)/i;

/**
 * Allowlist for media URL hosts. Default set covers Bridge's documented CDN
 * (cloudfront.net) and S3 origin used by Bridge ("retsly-api-production").
 * Operators can extend at build time via NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS as a
 * comma-separated list of additional hostnames (e.g., SEF MLS photo CDN).
 * Defense in depth — even if Bridge response is poisoned, photos render only
 * from allowlisted hosts.
 */
const DEFAULT_MEDIA_HOSTS = [
  "cloudfront.net",
  "amazonaws.com",
  "bridgedataoutput.com",
];
const EXTRA_MEDIA_HOSTS = (process.env.NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const ALLOWED_MEDIA_HOST_SUFFIXES = [
  ...DEFAULT_MEDIA_HOSTS,
  ...EXTRA_MEDIA_HOSTS,
];

function isAllowedMediaHost(rawUrl: string): boolean {
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    return ALLOWED_MEDIA_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith("." + suffix)
    );
  } catch {
    return false;
  }
}

function sanitizeListing(raw: BridgeProperty): ListingCard | null {
  const key = raw.ListingKey;
  if (!key) return null;

  const media = Array.isArray(raw.Media) ? raw.Media : [];
  const cover = media.find((m) => m.Order === 0) ?? media[0];
  const mediaUrl =
    cover?.MediaURL &&
    SAFE_PHOTO_PATTERN.test(cover.MediaURL) &&
    isAllowedMediaHost(cover.MediaURL)
      ? cover.MediaURL
      : null;

  return {
    listingKey: key,
    listPrice: typeof raw.ListPrice === "number" ? raw.ListPrice : null,
    beds: typeof raw.BedroomsTotal === "number" ? raw.BedroomsTotal : null,
    baths:
      typeof raw.BathroomsTotalInteger === "number"
        ? raw.BathroomsTotalInteger
        : null,
    sqft: typeof raw.LivingArea === "number" ? raw.LivingArea : null,
    city: raw.City ?? "",
    zip: raw.PostalCode ?? "",
    status: raw.StandardStatus ?? "",
    mediaUrl,
    remarks: raw.PublicRemarks
      ? raw.PublicRemarks.slice(0, 200).trim()
      : null,
  };
}

export async function searchListings(
  query: BridgeSearchQuery,
  signal?: AbortSignal
): Promise<BridgeSearchResult> {
  if (!BRIDGE_AVAILABLE) {
    return { listings: [], total: null, error: "search-unavailable" };
  }

  const params = buildODataParams(query);
  const url = new URL(
    `${BRIDGE_API_BASE}/${DATASET_ID}/${RESOURCE_PATH}`
  );
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal,
    });

    if (!res.ok) {
      // Operator visibility — no body content, status only.
      // Bridge error envelopes can include diagnostic text; we deliberately
      // do not surface it client-side or in logs.
      console.warn(`bridge: search failed status=${res.status}`);
      return { listings: [], total: null, error: "search-error" };
    }

    const data = (await res.json()) as ODataCollection<BridgeProperty>;
    const listings = (data.value ?? [])
      .map(sanitizeListing)
      .filter((l): l is ListingCard => l !== null);
    const total =
      typeof data["@odata.count"] === "number" ? data["@odata.count"] : null;

    return { listings, total, error: null };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { listings: [], total: null, error: null };
    }
    console.warn("bridge: search threw network error");
    return { listings: [], total: null, error: "search-error" };
  }
}
