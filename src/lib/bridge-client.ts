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
  /**
   * Cycle 37 — runtime mode of the result, single source of truth for the UI:
   *   - "live" — credentials present, demo flag false, fetch returned non-empty data
   *   - "demo" — credentials present, demo flag true (Bridge test fixture)
   *   - "fallback" — no credentials at build time; fixture cards rendered locally
   *   - "error" — fetch failed (network or non-2xx)
   *   - "unconfigured" — no credentials and an empty result before any search
   */
  mode: BridgeRuntimeMode;
};

export type BridgeRuntimeMode =
  | "live"
  | "demo"
  | "fallback"
  | "error"
  | "unconfigured";

/**
 * Cycle 37 — Bundled fixture listings used when Bridge is unconfigured at
 * build time (no NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN / DATASET_ID). These are
 * NOT real MLS data; they exist so /home-search/ remains a working Bridge-
 * shaped UI rather than falling back to a third-party iframe. Every card
 * shows the DEMO badge and the page surfaces the demo banner so visitors
 * cannot mistake fixture data for active inventory.
 */
const FIXTURE_LISTINGS: ReadonlyArray<ListingCard> = [
  {
    listingKey: "FIXTURE-FL-001",
    listPrice: 2950000,
    beds: 4,
    baths: 4,
    sqft: 3450,
    city: "Fort Lauderdale",
    zip: "33301",
    status: "Active",
    mediaUrl: null,
    remarks:
      "Demo fixture — eastern Fort Lauderdale waterfront home illustrating the search surface. Real listings appear once SEF MLS approves the IDX feed.",
  },
  {
    listingKey: "FIXTURE-PB-002",
    listPrice: 1875000,
    beds: 3,
    baths: 3,
    sqft: 2640,
    city: "Pompano Beach",
    zip: "33062",
    status: "Active",
    mediaUrl: null,
    remarks:
      "Demo fixture — Pompano Beach intracoastal residence. Replaced automatically by Bridge live data once IDX is approved.",
  },
  {
    listingKey: "FIXTURE-DB-003",
    listPrice: 1295000,
    beds: 4,
    baths: 3,
    sqft: 2880,
    city: "Deerfield Beach",
    zip: "33441",
    status: "Active",
    mediaUrl: null,
    remarks:
      "Demo fixture — Deerfield Beach single-family home. Used to verify the Bridge UI integration end-to-end.",
  },
  {
    listingKey: "FIXTURE-WS-004",
    listPrice: 1650000,
    beds: 5,
    baths: 4,
    sqft: 4120,
    city: "Weston",
    zip: "33326",
    status: "Active",
    mediaUrl: null,
    remarks:
      "Demo fixture — Weston master-planned community estate. Placeholder data only.",
  },
  {
    listingKey: "FIXTURE-HW-005",
    listPrice: 985000,
    beds: 3,
    baths: 2,
    sqft: 2150,
    city: "Hollywood",
    zip: "33019",
    status: "Active",
    mediaUrl: null,
    remarks:
      "Demo fixture — Hollywood beachside residence. Demo data ahead of IDX provisioning.",
  },
  {
    listingKey: "FIXTURE-CR-006",
    listPrice: 3450000,
    beds: 5,
    baths: 5,
    sqft: 4760,
    city: "Coral Springs",
    zip: "33067",
    status: "Active",
    mediaUrl: null,
    remarks:
      "Demo fixture — Coral Springs gated estate. Used for staging visual QA of the Bridge results grid.",
  },
];

function filterFixtures(query: BridgeSearchQuery): ListingCard[] {
  return FIXTURE_LISTINGS.filter((l) => {
    if (query.city && l.city !== query.city) return false;
    if (typeof query.minPrice === "number" && (l.listPrice ?? 0) < query.minPrice)
      return false;
    if (typeof query.maxPrice === "number" && (l.listPrice ?? 0) > query.maxPrice)
      return false;
    if (typeof query.beds === "number" && (l.beds ?? 0) < query.beds) return false;
    if (typeof query.baths === "number" && (l.baths ?? 0) < query.baths) return false;
    return true;
  });
}

/**
 * Cycle 37 — typed snapshot of Bridge runtime state. Returned by
 * `getBridgeRuntimeStatus()` so UI and audit code can render a truthful
 * banner without importing internal flags.
 */
export type BridgeRuntimeStatus = Readonly<{
  mode: BridgeRuntimeMode;
  source: "bridge" | "fixture" | "none";
  reason: string;
  resourcePath: string;
  updatedAt: string;
}>;

export function getBridgeRuntimeStatus(): BridgeRuntimeStatus {
  const updatedAt = new Date(0).toISOString().replace(/\.\d+Z$/, "Z");
  if (!BRIDGE_AVAILABLE) {
    return {
      mode: "fallback",
      source: "fixture",
      reason: "no-credentials-at-build",
      resourcePath: RESOURCE_PATH,
      updatedAt,
    };
  }
  if (BRIDGE_DEMO_MODE) {
    return {
      mode: "demo",
      source: "bridge",
      reason: "bridge-test-fixture-dataset",
      resourcePath: RESOURCE_PATH,
      updatedAt,
    };
  }
  return {
    mode: "live",
    source: "bridge",
    reason: "credentials-present-non-demo",
    resourcePath: RESOURCE_PATH,
    updatedAt,
  };
}

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
    const fixtures = filterFixtures(query);
    return {
      listings: fixtures,
      total: fixtures.length,
      error: null,
      mode: "fallback",
    };
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
      console.warn(`bridge: search failed status=${res.status}`);
      return { listings: [], total: null, error: "search-error", mode: "error" };
    }

    const data = (await res.json()) as ODataCollection<BridgeProperty>;
    const listings = (data.value ?? [])
      .map(sanitizeListing)
      .filter((l): l is ListingCard => l !== null);
    const total =
      typeof data["@odata.count"] === "number" ? data["@odata.count"] : null;

    return {
      listings,
      total,
      error: null,
      mode: BRIDGE_DEMO_MODE ? "demo" : "live",
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { listings: [], total: null, error: null, mode: "unconfigured" };
    }
    console.warn("bridge: search threw network error");
    return { listings: [], total: null, error: "search-error", mode: "error" };
  }
}
