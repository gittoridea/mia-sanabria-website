#!/usr/bin/env bun
/**
 * audit-home-bridge-search — verifies the homepage floating search card and
 * the /home-search/ Bridge surface are properly wired.
 *
 * Local mode (default): reads the static export at `out/`.
 *   bun run scripts/audit-home-bridge-search.ts
 *
 * Live mode: fetches over HTTP.
 *   bun run scripts/audit-home-bridge-search.ts -- --base=https://miasanabriarealtor.trueidea.com
 *
 * Checks:
 *   1. Homepage HTML contains a form whose action is `/home-search/`.
 *   2. That form has hidden input `source=home-hero` (analytics tag).
 *   3. That form has the three filter inputs (city/minPrice/beds).
 *   4. Homepage does NOT route hero-search to /markets/#property-search any more.
 *   5. Homepage does NOT reference old IDX/MLS Matrix runtime targets.
 *   6. /home-search/ HTML loads BridgeSearch (looks for the form label
 *      "Search available listings" or the data-bridge-runtime-mode attribute).
 *   7. Homepage HTML references a floating-search-card marker so visual layout
 *      remains regression-detectable.
 *
 * Outputs:
 *   reports/audit-home-bridge-search.json
 *   reports/audit-home-bridge-search.md
 *
 * Exit 0 on PASS, 1 on FAIL.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

declare const Bun: { argv: string[] };

type Args = { base: string | null };
function parseArgs(): Args {
  let base: string | null = null;
  for (const a of Bun.argv.slice(2)) {
    if (a.startsWith("--base=")) base = a.slice("--base=".length);
  }
  return { base };
}

async function fetchPage(args: Args, path: string): Promise<string> {
  if (args.base) {
    const url = args.base.replace(/\/$/, "") + path;
    const r = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
    if (!r.ok) throw new Error(`http_${r.status} on ${url}`);
    return r.text();
  }
  const local = join(process.cwd(), "out", path === "/" ? "index.html" : path.replace(/\/$/, "/index.html"));
  return readFile(local, "utf8");
}

type Finding = { id: string; ok: boolean; detail: string };

async function main() {
  const args = parseArgs();
  const findings: Finding[] = [];
  const reportsDir = join(process.cwd(), "reports");
  await mkdir(reportsDir, { recursive: true });

  let homeHtml = "";
  let homeSearchHtml = "";
  try {
    homeHtml = await fetchPage(args, "/");
  } catch (e) {
    findings.push({ id: "home_fetch", ok: false, detail: `failed to fetch homepage: ${e instanceof Error ? e.message : String(e)}` });
  }
  try {
    homeSearchHtml = await fetchPage(args, "/home-search/");
  } catch (e) {
    findings.push({ id: "home_search_fetch", ok: false, detail: `failed to fetch /home-search/: ${e instanceof Error ? e.message : String(e)}` });
  }

  if (homeHtml) {
    // 1. form action="/home-search/"
    const hasHomeSearchAction =
      /<form[^>]+action="\/home-search\/?(?:\?[^"]*)?"/i.test(homeHtml) ||
      /<form[^>]+action="\/home-search\/?"/i.test(homeHtml);
    findings.push({
      id: "home_form_action_home_search",
      ok: hasHomeSearchAction,
      detail: hasHomeSearchAction
        ? "homepage contains <form action=\"/home-search/\">"
        : "homepage does not contain <form action=\"/home-search/\">",
    });

    // 2. hidden source=home-hero
    const hasSource = /<input[^>]+name="source"[^>]+value="home-hero"/i.test(homeHtml) || /<input[^>]+value="home-hero"[^>]+name="source"/i.test(homeHtml);
    findings.push({
      id: "home_form_source_hidden",
      ok: hasSource,
      detail: hasSource ? "hidden input source=home-hero found" : "hidden input source=home-hero missing",
    });

    // 3. filter inputs
    const hasCity = /name="city"/.test(homeHtml);
    const hasMinPrice = /name="minPrice"/.test(homeHtml);
    const hasBeds = /name="beds"/.test(homeHtml);
    findings.push({
      id: "home_form_filter_inputs",
      ok: hasCity && hasMinPrice && hasBeds,
      detail: `city=${hasCity} minPrice=${hasMinPrice} beds=${hasBeds}`,
    });

    // 4. legacy IDX action removed
    const hasLegacyAction = /action="\/markets\/#property-search"/i.test(homeHtml);
    findings.push({
      id: "home_form_legacy_action_absent",
      ok: !hasLegacyAction,
      detail: hasLegacyAction
        ? "homepage still routes to /markets/#property-search (must be /home-search/)"
        : "no legacy /markets/#property-search action on homepage",
    });

    // 5. no old IDX runtime markers on homepage
    const oldIdxMarkers = [
      /MlsMatrix/i,
      /MLS\s*Matrix/i,
      /sef\.mlsmatrix\.com/i,
      /idxbroker/i,
      /ihomefinder/i,
      /flexmls/i,
      /showcaseidx/i,
    ];
    const hits = oldIdxMarkers.map((re) => ({ re: re.source, hit: re.test(homeHtml) })).filter((x) => x.hit);
    findings.push({
      id: "home_no_old_idx",
      ok: hits.length === 0,
      detail: hits.length === 0 ? "homepage clean of old IDX markers" : `old IDX markers found: ${hits.map((h) => h.re).join(", ")}`,
    });

    // 7. floating-search-card marker
    const hasFloatingMarker = /data-floating="true"/i.test(homeHtml) || /data-home-hero-search="true"/i.test(homeHtml);
    findings.push({
      id: "home_floating_marker",
      ok: hasFloatingMarker,
      detail: hasFloatingMarker
        ? "homepage contains floating-search-card marker"
        : "homepage missing data-floating marker — visual regression risk",
    });
  }

  if (homeSearchHtml) {
    // 6. /home-search/ contains BridgeSearch surface
    const hasBridgeForm = /aria-label="Search available listings"/i.test(homeSearchHtml) || /data-bridge-runtime-mode/i.test(homeSearchHtml);
    findings.push({
      id: "home_search_bridge_form",
      ok: hasBridgeForm,
      detail: hasBridgeForm ? "/home-search/ exposes BridgeSearch surface" : "/home-search/ missing BridgeSearch surface",
    });

    // /home-search/ also must be clean of legacy IDX
    const oldIdxMarkers = [/MlsMatrix/i, /sef\.mlsmatrix\.com/i];
    const idxHits = oldIdxMarkers.filter((re) => re.test(homeSearchHtml));
    findings.push({
      id: "home_search_no_old_idx",
      ok: idxHits.length === 0,
      detail: idxHits.length === 0 ? "/home-search/ clean of old IDX markers" : "/home-search/ still references old IDX",
    });
  }

  const ok = findings.every((f) => f.ok);
  const json = {
    base: args.base ?? "local:out/",
    pass: ok,
    findings,
  };
  await writeFile(join(reportsDir, "audit-home-bridge-search.json"), JSON.stringify(json, null, 2));
  const lines = [
    `# audit-home-bridge-search ${ok ? "PASS" : "FAIL"}`,
    "",
    `base: ${json.base}`,
    "",
    ...findings.map((f) => `- ${f.ok ? "PASS" : "FAIL"} \`${f.id}\` — ${f.detail}`),
    "",
  ];
  await writeFile(join(reportsDir, "audit-home-bridge-search.md"), lines.join("\n"));
  console.log(lines.join("\n"));
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(2);
});
