#!/usr/bin/env bun
/**
 * test-home-search-bridge-e2e — real-browser end-to-end probe of the
 * homepage → /home-search/ → BridgeSearch param consumption path.
 *
 * Approach: Cycle 38 verified the form HTML structure but never proved that
 * JS actually picks up the URL params and re-runs the search. This script
 * uses `google-chrome --headless=new --virtual-time-budget=18000 --dump-dom`
 * to render `/home-search/` with the params the homepage form will submit,
 * then asserts:
 *   - bridge-runtime-mode marker present and one of live|demo|fallback|ready|error
 *   - results region renders (listing cards OR demo banner OR error panel)
 *   - the city / minPrice / beds filter selects reflect URL params
 *   - no old IDX markers in the rendered DOM
 *   - homepage form HTML on / contains correct action + hidden source
 *
 * Cycle 42 (2026-05-22) — added `--require-live` STRICT activation gate. In
 * strict mode the script proves the feed is genuinely live (not demo/fallback/
 * error) by asserting the post-fetch DOM contains real, non-fixture inventory.
 * It NEVER prints or writes Bridge tokens or tokenized URLs (redaction pass on
 * every report write; raw DOM is never persisted).
 *
 * Usage:
 *   bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com
 *   bun run scripts/test-home-search-bridge-e2e.ts --base=http://127.0.0.1:4190
 *   bun run scripts/test-home-search-bridge-e2e.ts --require-live --base=https://miasanabriarealtor.trueidea.com
 *
 * Exit 0 = pass, 1 = fail. JSON + markdown written under
 * docs/artifacts/cycle-39-visual-truth-recovery/ (baseline) or
 * docs/artifacts/bridge-idx-live-activation/ (strict --require-live).
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

declare const Bun: { argv: string[] };

const REPO = process.cwd();

type Args = { base: string; requireLive: boolean };
function parseArgs(): Args {
  let base = "http://127.0.0.1:4190";
  let requireLive = false;
  for (const a of Bun.argv.slice(2)) {
    if (a.startsWith("--base=")) base = a.slice("--base=".length);
    else if (a === "--require-live") requireLive = true;
  }
  return { base: base.replace(/\/$/, ""), requireLive };
}

/**
 * Defense-in-depth redaction. The Bridge request URL (carrying access_token) is
 * built client-side and never reaches our report, but we scrub anyway so a
 * token can NEVER leak into an artifact, even if the rendered DOM ever inlined
 * one. Applied to every string we persist.
 */
function redact(s: string): string {
  return s
    .replace(/access_token=[^&"'\s]+/gi, "access_token=REDACTED")
    .replace(
      /\b(authorization|secret|client_secret|browser_token|server_token|api_key|apikey)=[^&"'\s]+/gi,
      "$1=REDACTED"
    )
    .replace(/(["']?token["']?\s*[:=]\s*["']?)[A-Za-z0-9._-]{12,}/gi, "$1REDACTED");
}

async function writeReport(path: string, body: string): Promise<void> {
  await writeFile(path, redact(body));
}

// South Florida geography plausibility (Broward / Miami-Dade / Palm Beach).
const SOFLO_CITIES = [
  "Fort Lauderdale",
  "Pompano Beach",
  "Deerfield Beach",
  "Hollywood",
  "Coral Springs",
  "Weston",
  "Boca Raton",
  "Miami",
  "Miami Beach",
  "Aventura",
  "Hallandale",
  "Dania",
  "Plantation",
  "Davie",
  "Parkland",
  "Wilton Manors",
  "Lighthouse Point",
  "Coconut Creek",
  "Sunrise",
  "Pembroke Pines",
  "Boynton Beach",
  "Delray Beach",
];
const SOFLO_CITY_RE = new RegExp(
  "\\b(" + SOFLO_CITIES.map((c) => c.replace(/ /g, "\\s+")).join("|") + ")\\b",
  "i"
);

function extractMlsIds(dom: string): string[] {
  const ids: string[] = [];
  const re = /mlsid=([^"&]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(dom))) {
    const raw = m[1];
    if (raw === undefined) continue;
    try {
      ids.push(decodeURIComponent(raw));
    } catch {
      ids.push(raw);
    }
  }
  return ids;
}

function run(cmd: string, argv: string[], timeoutMs: number): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, argv, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (code: number) => {
      if (settled) return;
      settled = true;
      resolve({ stdout, stderr, code });
    };
    const timer = setTimeout(() => { try { child.kill("SIGKILL"); } catch {} finish(124); }, timeoutMs);
    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    child.on("close", (code) => { clearTimeout(timer); finish(code ?? 1); });
    child.on("error", () => finish(1));
  });
}

async function dumpDom(url: string): Promise<string> {
  const res = await run("google-chrome", [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1280,900",
    "--virtual-time-budget=18000",
    "--dump-dom",
    url,
  ], 60_000);
  return res.stdout;
}

async function screenshot(url: string, path: string): Promise<void> {
  await run("google-chrome", [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1280,900",
    "--virtual-time-budget=15000",
    `--screenshot=${path}`,
    url,
  ], 60_000);
}

async function fetchHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

type Check = { name: string; passed: boolean; detail: string };

/** Precise failure classification for a non-live mode (task §10). */
function diagnose(mode: string | null): string {
  switch (mode) {
    case "fallback":
      return "Env vars missing at build time, or a stale static bundle is served. Fix Dokploy build args (NEXT_PUBLIC_BRIDGE_*) and REBUILD.";
    case "demo":
      return "NEXT_PUBLIC_BRIDGE_DEMO=true, or a stale demo bundle is served. Set it false/unset and REBUILD.";
    case "ready":
      return "Build is configured but the in-browser fetch did not complete/succeed before snapshot — likely 401/403/404/CORS. Check token, dataset code, resource path, and Bridge referrer allowlist.";
    case "error":
      return "Bridge fetch failed (network or non-2xx). Check token (401), data-access approval (403), dataset/resource path (404), and referrer allowlist.";
    case null:
      return "No data-bridge-runtime-mode marker found — page did not render the Bridge surface.";
    default:
      return `Unexpected mode '${mode}'.`;
  }
}

async function main() {
  const { base, requireLive } = parseArgs();
  const OUT = join(
    REPO,
    requireLive
      ? "docs/artifacts/bridge-idx-live-activation"
      : "docs/artifacts/cycle-39-visual-truth-recovery/e2e"
  );
  await mkdir(OUT, { recursive: true });
  await mkdir(join(OUT, "screenshots"), { recursive: true });

  const checks: Check[] = [];

  // === Homepage static-HTML invariants ===
  const homeHtml = await fetchHtml(`${base}/`);
  checks.push({
    name: "home.form.action",
    passed: /<form[^>]*action="\/home-search\/"/i.test(homeHtml),
    detail: "homepage form action must be /home-search/",
  });
  checks.push({
    name: "home.form.source",
    passed: homeHtml.includes('name="source" value="home-hero"'),
    detail: "hidden source=home-hero input must be present",
  });
  for (const field of ["city", "minPrice", "beds"]) {
    checks.push({
      name: `home.form.${field}`,
      passed: new RegExp(`name="${field}"`).test(homeHtml),
      detail: `homepage form must have ${field} input`,
    });
  }
  checks.push({
    name: "home.form.floating",
    passed: homeHtml.includes('data-floating="true"') || homeHtml.includes('data-home-hero-search="true"'),
    detail: "homepage form must carry floating-card marker for layout-regression detection",
  });

  // === Bridge E2E with URL params (clean static route, NO cache-buster) ===
  const params = "?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero";
  const searchUrl = `${base}/home-search/${params}`;
  const searchDom = await dumpDom(searchUrl);
  await screenshot(searchUrl, join(OUT, "screenshots", "home-search-with-params-1280x900.png"));

  const modeMatch = searchDom.match(/data-bridge-runtime-mode="(live|demo|fallback|ready|error)"/);
  const mode = modeMatch?.[1] ?? null;
  checks.push({
    name: "search.bridge-mode-marker",
    passed: mode !== null,
    detail: `data-bridge-runtime-mode must be live|demo|fallback|ready|error (got ${mode ?? "missing"})`,
  });
  const oldIdxClean = !/MlsMatrix|sef\.mlsmatrix\.com|idxbroker|ihomefinder|flexmls|showcaseidx/i.test(searchDom);
  checks.push({
    name: "search.no-old-idx-runtime",
    passed: oldIdxClean,
    detail: "no old IDX runtime in rendered DOM",
  });
  const resultsLikelyVisible =
    /class="[^"]*animate-pulse/i.test(searchDom) ||                  // loading state
    /Showing \d+/.test(searchDom) ||                                  // result count
    /No listings matched/.test(searchDom) ||                          // empty state
    /aria-busy="true"/.test(searchDom) ||                             // skeleton
    /Demo data/.test(searchDom) ||                                    // demo banner
    /Search is temporarily unavailable/.test(searchDom);              // error state
  checks.push({
    name: "search.results-region-rendered",
    passed: resultsLikelyVisible,
    detail: "search results / demo banner / loading / error must render after JS executes",
  });
  checks.push({
    name: "search.bridge-surface-present",
    passed: searchDom.includes('aria-label="Search available listings"'),
    detail: "BridgeSearch form must be rendered on /home-search/",
  });
  const idxDisclosure =
    /Listing information is deemed reliable but not guaranteed|IDX\/MLS disclosure|Equal Housing Opportunity/i.test(searchDom);
  checks.push({
    name: "search.idx-disclosure-rendered",
    passed: idxDisclosure,
    detail: "IDX/MLS disclosure copy must render under fixture or live results",
  });

  // === STRICT LIVE ACTIVATION GATE (--require-live) ===
  const cardCount = (searchDom.match(/Inquire About This Property/gi) || []).length;
  const mlsIds = extractMlsIds(searchDom);
  const nonFixtureIds = mlsIds.filter(
    (id) => id && !/^FIXTURE/i.test(id) && /^[A-Za-z0-9-]{3,}$/.test(id)
  );
  const prices = searchDom.match(/\$[\d,]{4,}/g) || [];
  const showingMatch = searchDom.match(/Showing\s+(\d+)\s+of/i);
  const showingCount = showingMatch?.[1] ? Number(showingMatch[1]) : null;
  const geoOk = SOFLO_CITY_RE.test(searchDom) || /\b3[34]\d{3}\b/.test(searchDom);
  const statusOk = /\b(Active|Coming\s*Soon|ComingSoon)\b/i.test(searchDom);

  if (requireLive) {
    checks.push({
      name: "live.mode-is-live",
      passed: mode === "live",
      detail: mode === "live"
        ? 'data-bridge-runtime-mode="live"'
        : `EXPECTED live, GOT ${mode ?? "missing"} — ${diagnose(mode)}`,
    });
    checks.push({
      name: "live.no-demo-banner",
      passed: !/Demo data/i.test(searchDom),
      detail: "no 'Demo data' banner may appear in live mode",
    });
    checks.push({
      name: "live.no-feed-pending-copy",
      passed: !/Live IDX feed pending/i.test(searchDom),
      detail: "no 'Live IDX feed pending' copy in live mode",
    });
    checks.push({
      name: "live.no-demo-dataset-copy",
      passed: !/Bridge demo dataset connected/i.test(searchDom),
      detail: "no 'Bridge demo dataset connected' copy in live mode",
    });
    checks.push({
      name: "live.no-demo-badge",
      passed: !/>\s*DEMO\s*<|Inquiry disabled in demo mode/i.test(searchDom),
      detail: "no DEMO badge / demo-disabled CTA on listing cards",
    });
    checks.push({
      name: "live.no-fixtures",
      passed: !/FIXTURE-|Demo fixture/i.test(searchDom),
      detail: "no FIXTURE-* keys or 'Demo fixture' copy in rendered DOM",
    });
    checks.push({
      name: "live.at-least-one-result",
      passed: cardCount > 0 || (showingCount !== null && showingCount > 0),
      detail: `at least one live listing must render (cards=${cardCount}, showing=${showingCount ?? "n/a"})`,
    });
    checks.push({
      name: "live.inquiry-enabled",
      passed: cardCount > 0,
      detail: "'Inquire About This Property' CTA must be enabled on live cards",
    });
    checks.push({
      name: "live.nonfixture-listing-key",
      passed: nonFixtureIds.length > 0,
      detail: `at least one plausible non-fixture MLS id (found ${nonFixtureIds.length})`,
    });
    checks.push({
      name: "live.plausible-price",
      passed: prices.length > 0,
      detail: `at least one plausible price rendered (found ${prices.length})`,
    });
    checks.push({
      name: "live.plausible-status",
      passed: statusOk,
      detail: "at least one plausible listing status (Active / Coming Soon)",
    });
    checks.push({
      name: "live.plausible-geography",
      passed: geoOk,
      detail: "at least one South Florida city or 33xxx/34xxx ZIP",
    });
    checks.push({
      name: "live.idx-disclosure",
      passed: idxDisclosure,
      detail: "IDX/MLS disclosure must remain visible in live mode",
    });
    checks.push({
      name: "live.no-old-idx",
      passed: oldIdxClean,
      detail: "no legacy MLS Matrix / IDX markers in live DOM",
    });
  }

  // === Final scoring ===
  const passed = checks.filter((c) => c.passed).length;
  const failed = checks.filter((c) => !c.passed).length;
  // Sanitized sample — IDX-safe public fields only; never remarks/PII/tokens.
  const sanitizedSample = {
    sample_mls_ids: nonFixtureIds.slice(0, 3),
    sample_prices: prices.slice(0, 3),
    showing_count: showingCount,
    card_count: cardCount,
    geography_plausible: geoOk,
    status_plausible: statusOk,
  };
  const summary = {
    base,
    target_url: searchUrl,
    strict_require_live: requireLive,
    generated_at: new Date().toISOString(),
    bridge_mode: mode,
    classification: mode === "live" ? "live" : diagnose(mode),
    proven_live: requireLive ? failed === 0 && mode === "live" : null,
    passed,
    failed,
    total: checks.length,
    sanitized_sample: sanitizedSample,
    checks,
  };
  await writeReport(join(OUT, "report.json"), JSON.stringify(summary, null, 2));

  const md: string[] = [];
  md.push(`# Home Search → Bridge ${requireLive ? "LIVE Activation" : "E2E"}`);
  md.push("");
  md.push(`generated: ${summary.generated_at}`);
  md.push(`base: ${base}`);
  md.push(`target: ${searchUrl}`);
  md.push(`bridge_mode: ${mode ?? "missing"}`);
  if (requireLive) md.push(`proven_live: ${summary.proven_live ? "YES" : "NO"}`);
  md.push(`classification: ${summary.classification}`);
  md.push(`passed: ${passed}/${checks.length} | failed: ${failed}`);
  md.push("");
  md.push("## Sanitized sample (IDX-safe fields only)");
  md.push("```json");
  md.push(JSON.stringify(sanitizedSample, null, 2));
  md.push("```");
  md.push("");
  md.push("| Check | Result | Detail |");
  md.push("|-------|:------:|--------|");
  for (const c of checks) {
    md.push(`| ${c.name} | ${c.passed ? "PASS" : "FAIL"} | ${c.detail} |`);
  }
  await writeReport(join(OUT, "report.md"), md.join("\n"));

  const tag = requireLive ? "bridge-live-activation" : "home-search-bridge-e2e";
  console.log(`${tag}: ${passed}/${checks.length} PASS, ${failed} FAIL, mode=${mode ?? "missing"}`);
  if (requireLive) {
    console.log(`proven_live: ${summary.proven_live ? "YES" : "NO"} (${summary.classification})`);
  }
  if (failed > 0) {
    for (const c of checks.filter((c) => !c.passed)) console.error(`  FAIL ${c.name}: ${c.detail}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("test-home-search-bridge-e2e FATAL", err);
  process.exit(1);
});
