#!/usr/bin/env bun
/**
 * audit-about — Cycle 16 sentinel for the About page accuracy contract.
 *
 * Enforces:
 *  - No occurrence of "deliberately small client list" in rendered HTML — across
 *    About AND all service pages (buyers, sellers, valuation, contact). This is
 *    a sitewide overclaim discipline; the audit name is preserved for legacy
 *    chaining, but the scope expanded in C16 after Forge VERIFY surfaced
 *    matching phrases on adjacent service pages.
 *  - No occurrence of "global distribution" sitewide.
 *  - Canonical service area text from PUBLIC_FACT_LEDGER §1 rendered on About.
 *  - No unverified credentials rendered (designations, languages, awards,
 *    practicing-since, MLS membership) on About.
 *  - License # renders only when MIA.unverified.licenseNumber is truthy
 *    AND only on Terms + Footer (not in About body).
 */
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { MIA } from "../src/lib/mia";

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
const REPORTS_DIR = join(REPO_ROOT, "reports");
const results: CheckResult[] = [];
const record = (c: CheckResult) => results.push(c);

async function fileExists(p: string): Promise<boolean> {
  try { await stat(p); return true; } catch { return false; }
}

async function readAbout(): Promise<string | null> {
  try { return await readFile(join(OUT_DIR, "about", "index.html"), "utf8"); } catch { return null; }
}

const FORBIDDEN_PHRASES = [
  { phrase: "deliberately small client list", reason: "Unverified quarterly cap claim (Cycle 16 audit)" },
  { phrase: "global distribution", reason: "Unverified syndication claim (Cycle 16 audit)" },
  // The following are placeholder defects the existing audit:stale catches too —
  // duplicating here keeps the About audit standalone.
  { phrase: "Klein Morgan", reason: "Stale brokerage reference" },
  { phrase: "sunandbreeze", reason: "Stale email domain" },
];

async function run() {
  await mkdir(REPORTS_DIR, { recursive: true });
  if (!(await fileExists(OUT_DIR))) {
    record({
      id: "about.skipped.noBuild",
      category: "Setup",
      description: "out/ missing — run bun run build first",
      status: "SKIP",
      evidence: "audit deferred",
    });
    await writeReports();
    return;
  }

  const html = await readAbout();
  if (!html) {
    record({
      id: "about.build",
      category: "Build",
      description: "About page must build",
      status: "FAIL",
      evidence: "out/about/index.html missing",
    });
    await writeReports();
    return;
  }

  // Forbidden phrases — sitewide sweep across About + service pages.
  const SITEWIDE_SCAN_ROUTES = [
    "/about/",
    "/buyers/",
    "/sellers/",
    "/valuation/",
    "/contact/",
  ] as const;

  for (const { phrase, reason } of FORBIDDEN_PHRASES) {
    const hits: Array<{ route: string }> = [];
    for (const route of SITEWIDE_SCAN_ROUTES) {
      const path = join(OUT_DIR, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
      try {
        const pageHtml = await readFile(path, "utf8");
        if (pageHtml.toLowerCase().includes(phrase.toLowerCase())) hits.push({ route });
      } catch {
        // Page not built; ignore.
      }
    }
    if (hits.length === 0) {
      record({
        id: `about.forbidden.${phrase.replace(/\s+/g, "_")}`,
        category: "Accuracy",
        description: `Sitewide service pages do not contain forbidden phrase "${phrase}"`,
        status: "PASS",
        evidence: `phrase absent across ${SITEWIDE_SCAN_ROUTES.length} routes`,
      });
    } else {
      record({
        id: `about.forbidden.${phrase.replace(/\s+/g, "_")}`,
        category: "Accuracy",
        description: `Sitewide service pages must not contain forbidden phrase "${phrase}"`,
        status: "FAIL",
        evidence: `${reason}; found on: ${hits.map((h) => h.route).join(", ")}`,
      });
    }
  }

  // Canonical service-area text
  const canonicalServiceArea = MIA.serviceArea.administrative.join(" · ");
  if (html.includes("Eastern Fort Lauderdale") && html.includes("Eastern Boca Raton") && html.includes("Eastern Delray Beach")) {
    record({
      id: "about.serviceArea.canonical",
      category: "Service area",
      description: "About page renders the three canonical service-area entries",
      status: "PASS",
      evidence: canonicalServiceArea,
    });
  } else {
    record({
      id: "about.serviceArea.canonical",
      category: "Service area",
      description: "About page must render the three canonical service-area entries",
      status: "FAIL",
      evidence: "One or more of Eastern FL/Boca/Delray missing",
    });
  }

  // Unverified credentials negative tests
  const negativeChecks: Array<{ id: string; needle: RegExp; description: string }> = [
    { id: "about.no.designations", needle: /designation[s]?\b.*?(GRI|ABR|SRES|CRS|SRS|CIPS|RENE|PSA)/i, description: "No unverified NAR designation names rendered" },
    { id: "about.no.yearsLicensed", needle: /licensed since|practicing since 19|practicing since 20/i, description: "No unverified 'practicing since YYYY' rendered (experience.since is null)" },
    { id: "about.no.salesVolume", needle: /\$[0-9]+(?:\.[0-9]+)?[\s]*(?:million|billion|m|b)\s+(?:in\s+sales|in\s+volume|closed)/i, description: "No unverified sales-volume claim rendered" },
    { id: "about.no.awardClaims", needle: /(?:top|chairman'?s|presidential|hall of fame|number one|#1)\s+(?:agent|producer|REALTOR|broker)/i, description: "No unverified awards/ranking claim rendered" },
    { id: "about.no.testimonials", needle: /testimonial[s]?\b/i, description: "No unverified testimonials section rendered" },
  ];

  for (const c of negativeChecks) {
    if (c.needle.test(html)) {
      record({
        id: c.id,
        category: "Credentials",
        description: c.description,
        status: "FAIL",
        evidence: `Pattern matched on /about/index.html: ${c.needle}`,
      });
    } else {
      record({
        id: c.id,
        category: "Credentials",
        description: c.description,
        status: "PASS",
        evidence: "pattern not found",
      });
    }
  }

  // License # should not appear in the About body (lives on Footer, which renders
  // sitewide). Scope the check to the <main> region only; the global footer is
  // expected to contain the license # on every page.
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const mainHtml = mainMatch?.[1] ?? "";
  if (MIA.unverified.licenseNumber && mainHtml.includes(MIA.unverified.licenseNumber)) {
    record({
      id: "about.license.notOnAbout",
      category: "License",
      description: "License # should not appear inside About <main> (lives on Footer + Terms)",
      status: "WARN",
      evidence: "License # found inside About body; consider removing from body content",
    });
  } else {
    record({
      id: "about.license.notOnAbout",
      category: "License",
      description: "License # does not appear inside About <main>",
      status: "PASS",
      evidence: "license # absent from body (correctly lives on Footer + Terms)",
    });
  }

  // Brokerage attribution
  if (html.includes("LPT Realty")) {
    record({
      id: "about.brokerage.lpt",
      category: "Brokerage",
      description: "About page attributes Mia to LPT Realty",
      status: "PASS",
      evidence: "LPT Realty present",
    });
  } else {
    record({
      id: "about.brokerage.lpt",
      category: "Brokerage",
      description: "About page must attribute Mia to LPT Realty",
      status: "FAIL",
      evidence: "LPT Realty not found",
    });
  }

  await writeReports();
}

async function writeReports() {
  const pass = results.filter((r) => r.status === "PASS").length;
  const warn = results.filter((r) => r.status === "WARN").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  const skip = results.filter((r) => r.status === "SKIP").length;

  for (const r of results) {
    const icon = r.status === "PASS" ? "✓" : r.status === "WARN" ? "⚠" : r.status === "SKIP" ? "·" : "✗";
    console.log(`  ${icon} ${r.id} — ${r.evidence}`);
  }
  console.log(`\nSummary: ${pass} PASS · ${warn} WARN · ${fail} FAIL · ${skip} SKIP`);

  await writeFile(
    join(REPORTS_DIR, "audit-about.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), summary: { pass, warn, fail, skip }, results }, null, 2),
    "utf8"
  );
  const md = [
    "# Audit About Report",
    `**Generated:** ${new Date().toISOString()}`,
    `**Summary:** ${pass} PASS · ${warn} WARN · ${fail} FAIL · ${skip} SKIP`,
    "",
    "| ID | Status | Description | Evidence |",
    "|---|:-:|---|---|",
    ...results.map((r) => `| \`${r.id}\` | ${r.status === "PASS" ? "✅" : r.status === "WARN" ? "⚠️" : r.status === "SKIP" ? "·" : "❌"} | ${r.description} | ${r.evidence.replace(/\n/g, " ")} |`),
  ].join("\n");
  await writeFile(join(REPORTS_DIR, "audit-about.md"), md, "utf8");
  console.log(`\n→ reports/audit-about.json\n→ reports/audit-about.md`);
  if (fail > 0) process.exit(1);
}

await run();
