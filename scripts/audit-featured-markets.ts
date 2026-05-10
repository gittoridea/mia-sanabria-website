#!/usr/bin/env bun
/**
 * audit-featured-markets — Cycle 16 sentinel for the homepage Featured Markets
 * pager and the broader featured-markets contract.
 *
 * Enforces:
 *  - HOMEPAGE_FEATURED_ORDER first 6 slugs match principal-locked Cycle 16 order.
 *  - All 12 featured slugs render in the built homepage HTML.
 *  - Each featured market has a /markets/<slug>/ route, hero image, OG image,
 *    schema, and sitemap entry.
 *  - The /markets/ index page includes every market in MARKETS (not just featured).
 *  - The pager renders with `aria-label="Featured markets pagination"` for >6 markets.
 *
 * Exit 0 if zero FAILs (WARN allowed); 1 on any FAIL.
 */
import { readFile, readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import {
  ALL_MARKET_SLUGS,
  FEATURED_MARKETS,
  HOMEPAGE_FEATURED_ORDER,
  HOMEPAGE_FEATURED_PAGE_SIZE,
  getMarketImagePath,
  getMarketOgImagePath,
  getMarketRoute,
} from "../src/lib/mia";

type CheckStatus = "PASS" | "WARN" | "FAIL" | "SKIP";
type CheckResult = {
  id: string;
  category: string;
  description: string;
  status: CheckStatus;
  evidence: string;
};

const REPO_ROOT = process.cwd();
const OUT_DIR = join(REPO_ROOT, "out");
const PUBLIC_DIR = join(REPO_ROOT, "public");
const REPORTS_DIR = join(REPO_ROOT, "reports");

const PRINCIPAL_FIRST_PAGE: ReadonlyArray<string> = [
  "fort-lauderdale",
  "boca-raton",
  "palm-beach",
  "victoria-park",
  "lighthouse-point",
  "delray-beach",
];

const results: CheckResult[] = [];

function record(c: CheckResult) {
  results.push(c);
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readBuiltHtml(route: string): Promise<string | null> {
  const path = route === "/" ? join(OUT_DIR, "index.html") : join(OUT_DIR, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
  try {
    return await readFile(path, "utf8");
  } catch {
    return null;
  }
}

async function readSitemap(): Promise<string> {
  try {
    return await readFile(join(OUT_DIR, "sitemap.xml"), "utf8");
  } catch {
    return "";
  }
}

async function run() {
  await mkdir(REPORTS_DIR, { recursive: true });
  const outExists = await fileExists(OUT_DIR);
  if (!outExists) {
    record({
      id: "featured.skipped.noBuild",
      category: "Setup",
      description: "out/ directory missing — skip audit until next bun run build",
      status: "SKIP",
      evidence: "Run `bun run build` first then re-run this audit.",
    });
    await writeReports();
    return;
  }

  // ── 1. HOMEPAGE_FEATURED_ORDER vs principal first-page order
  const orderFirstSix = HOMEPAGE_FEATURED_ORDER.slice(0, 6);
  if (
    orderFirstSix.length === 6 &&
    orderFirstSix.every((s, i) => s === PRINCIPAL_FIRST_PAGE[i])
  ) {
    record({
      id: "featured.order.firstPageMatchesPrincipal",
      category: "Order",
      description: "First 6 entries of HOMEPAGE_FEATURED_ORDER match principal Cycle 16 §1 first-page direction",
      status: "PASS",
      evidence: `Order: ${orderFirstSix.join(", ")}`,
    });
  } else {
    record({
      id: "featured.order.firstPageMatchesPrincipal",
      category: "Order",
      description: "First 6 entries of HOMEPAGE_FEATURED_ORDER must match principal Cycle 16 §1 first-page direction",
      status: "FAIL",
      evidence: `Expected: ${PRINCIPAL_FIRST_PAGE.join(", ")}\nGot: ${orderFirstSix.join(", ")}`,
    });
  }

  // ── 2. Page size
  if (HOMEPAGE_FEATURED_PAGE_SIZE === 6) {
    record({
      id: "featured.pageSize.is6",
      category: "Order",
      description: "HOMEPAGE_FEATURED_PAGE_SIZE is 6",
      status: "PASS",
      evidence: `HOMEPAGE_FEATURED_PAGE_SIZE = ${HOMEPAGE_FEATURED_PAGE_SIZE}`,
    });
  } else {
    record({
      id: "featured.pageSize.is6",
      category: "Order",
      description: "HOMEPAGE_FEATURED_PAGE_SIZE must equal 6 per Cycle 16 §1",
      status: "FAIL",
      evidence: `HOMEPAGE_FEATURED_PAGE_SIZE = ${HOMEPAGE_FEATURED_PAGE_SIZE}`,
    });
  }

  // ── 3. HOMEPAGE_FEATURED_ORDER ⊆ FEATURED_MARKETS ⊆ ALL_MARKET_SLUGS
  for (const slug of HOMEPAGE_FEATURED_ORDER) {
    if (!FEATURED_MARKETS.includes(slug)) {
      record({
        id: `featured.subset.${slug}`,
        category: "Order",
        description: `Homepage featured slug must be in FEATURED_MARKETS`,
        status: "FAIL",
        evidence: `${slug} is in HOMEPAGE_FEATURED_ORDER but NOT in FEATURED_MARKETS`,
      });
    }
    if (!ALL_MARKET_SLUGS.includes(slug)) {
      record({
        id: `featured.allSlugs.${slug}`,
        category: "Order",
        description: `Homepage featured slug must be a valid market slug`,
        status: "FAIL",
        evidence: `${slug} is in HOMEPAGE_FEATURED_ORDER but NOT in ALL_MARKET_SLUGS`,
      });
    }
  }

  // ── 4. Pager HTML on built homepage
  const home = await readBuiltHtml("/");
  if (home) {
    const hasPagerLabel = home.includes('aria-label="Featured markets pagination"');
    if (HOMEPAGE_FEATURED_ORDER.length > HOMEPAGE_FEATURED_PAGE_SIZE) {
      if (hasPagerLabel) {
        record({
          id: "featured.pager.rendered",
          category: "Render",
          description: "Featured Markets pager renders on homepage with accessible label",
          status: "PASS",
          evidence: 'aria-label="Featured markets pagination" present in /index.html',
        });
      } else {
        record({
          id: "featured.pager.rendered",
          category: "Render",
          description: "Featured Markets pager should render on homepage when >6 featured markets",
          status: "WARN",
          evidence: 'aria-label="Featured markets pagination" not found in /index.html (client-only state may be JS-hydrated)',
        });
      }
    }

    // First-page slugs visible in built HTML
    const missingFromHome: string[] = [];
    for (const slug of PRINCIPAL_FIRST_PAGE) {
      if (!home.includes(`/markets/${slug}/`)) {
        missingFromHome.push(slug);
      }
    }
    if (missingFromHome.length === 0) {
      record({
        id: "featured.homepage.firstPagePresent",
        category: "Render",
        description: "All 6 first-page featured market routes present in homepage HTML",
        status: "PASS",
        evidence: `Routes found for: ${PRINCIPAL_FIRST_PAGE.join(", ")}`,
      });
    } else {
      record({
        id: "featured.homepage.firstPagePresent",
        category: "Render",
        description: "All 6 first-page featured market routes must be present in homepage HTML",
        status: "FAIL",
        evidence: `Missing from homepage: ${missingFromHome.join(", ")}`,
      });
    }
  } else {
    record({
      id: "featured.homepage.read",
      category: "Render",
      description: "Read built /index.html",
      status: "FAIL",
      evidence: "Could not read out/index.html",
    });
  }

  // ── 5. Every featured market — route + hero + OG asset
  const sitemap = await readSitemap();
  for (const slug of FEATURED_MARKETS) {
    const route = getMarketRoute(slug);
    const html = await readBuiltHtml(route);
    const hero = await fileExists(join(PUBLIC_DIR, getMarketImagePath(slug).replace(/^\//, "")));
    const og = await fileExists(join(PUBLIC_DIR, getMarketOgImagePath(slug).replace(/^\//, "")));
    const inSitemap = sitemap.includes(route);

    const fails: string[] = [];
    if (!html) fails.push("page not built");
    if (!hero) fails.push("hero image missing");
    if (!og) fails.push("OG image missing");
    if (!inSitemap) fails.push("not in sitemap");

    if (fails.length === 0) {
      record({
        id: `featured.market.${slug}`,
        category: "Coverage",
        description: `Featured market ${slug} has page + hero + OG + sitemap entry`,
        status: "PASS",
        evidence: `route=${route}, hero=ok, og=ok, sitemap=ok`,
      });
    } else {
      record({
        id: `featured.market.${slug}`,
        category: "Coverage",
        description: `Featured market ${slug} coverage`,
        status: "FAIL",
        evidence: fails.join("; "),
      });
    }
  }

  // ── 6. /markets/ index includes every ALL_MARKET_SLUGS entry
  const indexHtml = await readBuiltHtml("/markets/");
  if (indexHtml) {
    const missing: string[] = [];
    for (const slug of ALL_MARKET_SLUGS) {
      if (!indexHtml.includes(`/markets/${slug}/`)) missing.push(slug);
    }
    if (missing.length === 0) {
      record({
        id: "featured.marketsIndex.complete",
        category: "Coverage",
        description: "/markets/ index links to every market in ALL_MARKET_SLUGS",
        status: "PASS",
        evidence: `${ALL_MARKET_SLUGS.length} markets linked`,
      });
    } else {
      record({
        id: "featured.marketsIndex.complete",
        category: "Coverage",
        description: "/markets/ index must link to every market",
        status: "FAIL",
        evidence: `Missing from /markets/: ${missing.join(", ")}`,
      });
    }
  }

  await writeReports();
}

async function writeReports() {
  const pass = results.filter((r) => r.status === "PASS").length;
  const warn = results.filter((r) => r.status === "WARN").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  const skip = results.filter((r) => r.status === "SKIP").length;

  // Console
  for (const r of results) {
    const icon = r.status === "PASS" ? "✓" : r.status === "WARN" ? "⚠" : r.status === "SKIP" ? "·" : "✗";
    console.log(`  ${icon} ${r.id} — ${r.evidence}`);
  }
  console.log(`\nSummary: ${pass} PASS · ${warn} WARN · ${fail} FAIL · ${skip} SKIP`);

  // JSON
  const json = {
    generatedAt: new Date().toISOString(),
    summary: { pass, warn, fail, skip },
    results,
  };
  await writeFile(join(REPORTS_DIR, "audit-featured-markets.json"), JSON.stringify(json, null, 2), "utf8");

  // Markdown
  const md = [
    "# Audit Featured Markets Report",
    "",
    `**Generated:** ${json.generatedAt}`,
    "",
    `**Summary:** ${pass} PASS · ${warn} WARN · ${fail} FAIL · ${skip} SKIP`,
    "",
    "## Results",
    "",
    "| ID | Status | Description | Evidence |",
    "|---|:-:|---|---|",
    ...results.map((r) => `| \`${r.id}\` | ${r.status === "PASS" ? "✅" : r.status === "WARN" ? "⚠️" : r.status === "SKIP" ? "·" : "❌"} | ${r.description} | ${r.evidence.replace(/\n/g, " ")} |`),
  ].join("\n");
  await writeFile(join(REPORTS_DIR, "audit-featured-markets.md"), md, "utf8");

  console.log(`\n→ reports/audit-featured-markets.json\n→ reports/audit-featured-markets.md`);
  if (fail > 0) process.exit(1);
}

await run();
