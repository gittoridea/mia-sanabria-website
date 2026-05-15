#!/usr/bin/env bun
/**
 * probe-bridge-live — secret-safe diagnostic probe for the Bridge Data Output IDX feed.
 *
 * Cycle 36 (2026-05-14): added to verify whether Mia's "Bridge should be working" claim
 * actually translates to a working live feed. Reads the same NEXT_PUBLIC_BRIDGE_* env
 * vars the static bundle reads, optionally a server-side BRIDGE_SERVER_TOKEN if present,
 * makes a minimal Bridge API call, classifies the response (live vs demo vs empty vs
 * error), and writes a sanitized JSON report.
 *
 * SECURITY CONTRACT — never violated:
 *   - No env values are echoed, logged, or written to disk
 *   - The full request URL is redacted in all output (token query param replaced)
 *   - Response bodies are never persisted; only counts and shape signals are recorded
 *   - Authorization headers are stripped before any logging
 *   - Sample listing IDs/cities/prices may be present in the JSON output IF the feed
 *     returns non-confidential public IDX data; geographic-signal classification helps
 *     determine demo-vs-live without persisting raw rows
 *
 * Usage:
 *   bun run scripts/probe-bridge-live.ts                        # default: city=Fort Lauderdale, limit=3
 *   bun run scripts/probe-bridge-live.ts --city='Pompano Beach' # filter by city
 *   bun run scripts/probe-bridge-live.ts --limit=5              # how many records to fetch
 *   bun run scripts/probe-bridge-live.ts --status=Active        # default Active
 *
 * Exit codes:
 *   0 — probe completed (whether or not credentials existed)
 *   1 — runtime error (network exception, JSON parse failure)
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const REPO = process.cwd();
const OUTPUT_DIR = join(REPO, "docs/artifacts/cycle-36-bridge-live-integration");

type CredentialPresence = Record<string, "present" | "missing">;
type SampleClassification = "live" | "demo" | "empty" | "error" | "unknown";

type BridgeProbeResult = {
  timestamp: string;
  credentialPresence: CredentialPresence;
  endpointConfigured: boolean;
  endpointHostRedacted: string;
  resourcePath: string;
  datasetIdRedacted: string;
  requestAttempted: boolean;
  httpStatus?: number;
  ok: boolean;
  recordCount: number;
  sampleClassification: SampleClassification;
  geographySignals: string[];
  listingIdSignals: string[];
  mediaSignals: string[];
  errorClass?: string;
  errorMessageRedacted?: string;
  nextAction: string;
};

function arg(prefix: string, fallback = ""): string {
  const a = process.argv.slice(2).find((x) => x.startsWith(prefix));
  return a ? a.slice(prefix.length) : fallback;
}

const CITY = arg("--city=", "Fort Lauderdale");
const LIMIT = Math.max(1, Math.min(10, Number(arg("--limit=", "3")) || 3));
const STATUS = arg("--status=", "Active");

function redactToken(input: string): string {
  return input.replace(/access_token=[^&\s]+/gi, "access_token=[REDACTED]");
}

function presenceOf(name: string): "present" | "missing" {
  return process.env[name] ? "present" : "missing";
}

function classify(records: Array<Record<string, unknown>>, cityFilter: string): {
  classification: SampleClassification;
  geographySignals: string[];
  listingIdSignals: string[];
  mediaSignals: string[];
} {
  if (records.length === 0) {
    return {
      classification: "empty",
      geographySignals: [],
      listingIdSignals: [],
      mediaSignals: [],
    };
  }

  const cities = new Set<string>();
  const states = new Set<string>();
  const ids: string[] = [];
  const mediaHosts = new Set<string>();

  for (const r of records) {
    if (typeof r.City === "string") cities.add(r.City);
    if (typeof r.StateOrProvince === "string") states.add(r.StateOrProvince);
    const key = (r.ListingKey ?? r.ListingId) as string | undefined;
    if (typeof key === "string" && ids.length < 5) ids.push(key);
    const media = Array.isArray(r.Media) ? r.Media : [];
    for (const m of media) {
      const url = (m as Record<string, unknown>).MediaURL;
      if (typeof url === "string") {
        try {
          mediaHosts.add(new URL(url).hostname);
        } catch {
          // ignore malformed URL
        }
      }
    }
  }

  // Demo-vs-live heuristic:
  // - test_sf and test_sd Bridge fixture datasets are San Francisco / San Diego — not Florida.
  // - Real Mia inventory should be in FL with cities matching MIA_APPROVED_NEIGHBORHOODS.
  // - If state code includes "CA" or cities include SF/SD signals → demo.
  // - If state code is "FL" only AND cities include the requested filter → live signal.
  const cityArr = Array.from(cities);
  const stateArr = Array.from(states);

  const flOnly = stateArr.length > 0 && stateArr.every((s) => s === "FL");
  const caSignals = stateArr.some((s) => s === "CA") ||
    cityArr.some((c) => /san francisco|san diego|los angeles|san jose/i.test(c));

  let classification: SampleClassification;
  if (caSignals) {
    classification = "demo";
  } else if (flOnly && cityArr.some((c) => c.toLowerCase().includes(cityFilter.toLowerCase()))) {
    classification = "live";
  } else if (flOnly) {
    classification = "live"; // Florida data without exact city match still counts as live
  } else {
    classification = "unknown";
  }

  return {
    classification,
    geographySignals: [...stateArr.map((s) => `state:${s}`), ...cityArr.slice(0, 5).map((c) => `city:${c}`)],
    listingIdSignals: ids,
    mediaSignals: Array.from(mediaHosts).slice(0, 5).map((h) => `media-host:${h}`),
  };
}

async function probe(): Promise<BridgeProbeResult> {
  const presence: CredentialPresence = {
    NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN: presenceOf("NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN"),
    NEXT_PUBLIC_BRIDGE_DATASET_ID: presenceOf("NEXT_PUBLIC_BRIDGE_DATASET_ID"),
    NEXT_PUBLIC_BRIDGE_RESOURCE_PATH: presenceOf("NEXT_PUBLIC_BRIDGE_RESOURCE_PATH"),
    NEXT_PUBLIC_BRIDGE_DEMO: presenceOf("NEXT_PUBLIC_BRIDGE_DEMO"),
    BRIDGE_SERVER_TOKEN: presenceOf("BRIDGE_SERVER_TOKEN"),
    BRIDGE_CLIENT_ID: presenceOf("BRIDGE_CLIENT_ID"),
    BRIDGE_DATASET_ID: presenceOf("BRIDGE_DATASET_ID"),
  };

  const browserToken = process.env.NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN ?? "";
  const datasetId = process.env.NEXT_PUBLIC_BRIDGE_DATASET_ID ?? "";
  const resourcePath = process.env.NEXT_PUBLIC_BRIDGE_RESOURCE_PATH ?? "idx/Properties";
  const allowedResources = new Set(["idx/Properties", "Property"]);
  const safeResourcePath = allowedResources.has(resourcePath) ? resourcePath : "idx/Properties";

  // Redacted dataset hint — show length-class only, not the value.
  const datasetIdRedacted = datasetId ? `[present:${datasetId.length}-char]` : "[missing]";

  const endpointConfigured = !!(browserToken && datasetId);

  if (!endpointConfigured) {
    return {
      timestamp: new Date().toISOString(),
      credentialPresence: presence,
      endpointConfigured: false,
      endpointHostRedacted: "api.bridgedataoutput.com",
      resourcePath: safeResourcePath,
      datasetIdRedacted,
      requestAttempted: false,
      ok: false,
      recordCount: 0,
      sampleClassification: "unknown",
      geographySignals: [],
      listingIdSignals: [],
      mediaSignals: [],
      nextAction:
        "Bridge credentials missing locally — this is expected per Cycle 33B credential policy " +
        "(values live in Dokploy build args only). Probe staging site directly via bridge-staging-* reports " +
        "to determine deployed chunk's actual mode.",
    };
  }

  // Build the request — and redact the URL in everything we log/persist.
  const url = new URL(`https://api.bridgedataoutput.com/api/v2/OData/${datasetId}/${safeResourcePath}`);
  url.searchParams.set("access_token", browserToken);
  url.searchParams.set("$top", String(LIMIT));
  url.searchParams.set("$select", "ListingKey,ListingId,ListPrice,City,StateOrProvince,StandardStatus,ModificationTimestamp,Media");
  url.searchParams.set("$count", "true");
  url.searchParams.set(
    "$filter",
    `City eq '${CITY.replace(/'/g, "''")}' and StandardStatus eq '${STATUS}'`,
  );

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        timestamp: new Date().toISOString(),
        credentialPresence: presence,
        endpointConfigured: true,
        endpointHostRedacted: "api.bridgedataoutput.com",
        resourcePath: safeResourcePath,
        datasetIdRedacted,
        requestAttempted: true,
        httpStatus: res.status,
        ok: false,
        recordCount: 0,
        sampleClassification: "error",
        geographySignals: [],
        listingIdSignals: [],
        mediaSignals: [],
        errorClass: `http_${res.status}`,
        errorMessageRedacted: redactToken(`Bridge returned status ${res.status}`),
        nextAction:
          res.status === 401
            ? "Browser token rejected. Verify NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN value in Dokploy build args matches a token issued for this dataset."
            : res.status === 403
              ? "Forbidden — token may not be scoped for this dataset/resource. Check Bridge dashboard scopes + Referrer Domain."
              : res.status === 404
                ? "Dataset or resource path not found. Verify NEXT_PUBLIC_BRIDGE_DATASET_ID and NEXT_PUBLIC_BRIDGE_RESOURCE_PATH."
                : `Bridge returned ${res.status}. Inspect Bridge dashboard for account/dataset health.`,
      };
    }

    const data = (await res.json()) as { value?: Array<Record<string, unknown>>; "@odata.count"?: number };
    const records = data.value ?? [];
    const totalCount = typeof data["@odata.count"] === "number" ? data["@odata.count"] : records.length;
    const { classification, geographySignals, listingIdSignals, mediaSignals } = classify(records, CITY);

    return {
      timestamp: new Date().toISOString(),
      credentialPresence: presence,
      endpointConfigured: true,
      endpointHostRedacted: "api.bridgedataoutput.com",
      resourcePath: safeResourcePath,
      datasetIdRedacted,
      requestAttempted: true,
      httpStatus: res.status,
      ok: true,
      recordCount: totalCount,
      sampleClassification: classification,
      geographySignals,
      listingIdSignals,
      mediaSignals,
      nextAction:
        classification === "live"
          ? "Live FL data detected. Verify with staging UI probe; if confirmed, ensure NEXT_PUBLIC_BRIDGE_DEMO=false at build time so DEMO badges don't ship."
          : classification === "demo"
            ? "Demo (non-FL) data detected — preserve demo banner + DEMO badges. External blocker: switch dataset to Mia's IDX feed in Dokploy build args, then redeploy."
            : classification === "empty"
              ? "Bridge returned 0 records for the city/status filter. May indicate dataset has no inventory for this filter, OR feed is wrong dataset for Mia's market."
              : "Bridge returned records but state/city signals are inconclusive. Inspect listingIdSignals + geographySignals manually.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      timestamp: new Date().toISOString(),
      credentialPresence: presence,
      endpointConfigured: true,
      endpointHostRedacted: "api.bridgedataoutput.com",
      resourcePath: safeResourcePath,
      datasetIdRedacted,
      requestAttempted: true,
      ok: false,
      recordCount: 0,
      sampleClassification: "error",
      geographySignals: [],
      listingIdSignals: [],
      mediaSignals: [],
      errorClass: err instanceof Error ? err.name : "unknown",
      errorMessageRedacted: redactToken(message.slice(0, 200)),
      nextAction: "Network or runtime error reaching Bridge. Verify connectivity and Bridge service status.",
    };
  }
}

async function main(): Promise<void> {
  const result = await probe();
  await mkdir(OUTPUT_DIR, { recursive: true });
  const outPath = join(OUTPUT_DIR, "bridge-live-probe-result.json");
  await writeFile(outPath, JSON.stringify(result, null, 2));

  // Console summary — never includes secret values.
  console.log("");
  console.log("=== Bridge Live Probe Summary ===");
  console.log(`Timestamp:       ${result.timestamp}`);
  console.log(`Credentials:     ${Object.entries(result.credentialPresence).filter(([, v]) => v === "present").map(([k]) => k).join(", ") || "(none present)"}`);
  console.log(`Endpoint:        ${result.endpointHostRedacted}/${result.datasetIdRedacted}/${result.resourcePath}`);
  console.log(`Request:         attempted=${result.requestAttempted} ok=${result.ok}` + (result.httpStatus ? ` status=${result.httpStatus}` : ""));
  console.log(`Records:         ${result.recordCount}`);
  console.log(`Classification:  ${result.sampleClassification}`);
  console.log(`Geography:       ${result.geographySignals.join(" | ") || "(none)"}`);
  console.log(`ListingIds:      ${result.listingIdSignals.join(" | ") || "(none)"}`);
  console.log(`Media hosts:     ${result.mediaSignals.join(" | ") || "(none)"}`);
  if (result.errorClass) console.log(`Error:           ${result.errorClass} — ${result.errorMessageRedacted}`);
  console.log(`Next action:     ${result.nextAction}`);
  console.log(`Saved:           ${outPath}`);
  console.log("");
}

await main().catch((err) => {
  console.error("probe-bridge-live: unhandled error", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
