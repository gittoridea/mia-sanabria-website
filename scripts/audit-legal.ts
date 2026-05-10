#!/usr/bin/env bun
/**
 * audit-legal — Cycle 16 sentinel for the four legal routes.
 *
 * Status taxonomy: PASS · WARN (principal-gated, acceptable for staging) · FAIL.
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

const LEGAL_ROUTES = ["/privacy/", "/terms/", "/accessibility/", "/dmca/"] as const;

async function fileExists(p: string): Promise<boolean> {
  try { await stat(p); return true; } catch { return false; }
}

async function readBuiltHtml(route: string): Promise<string | null> {
  const path = join(OUT_DIR, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
  try { return await readFile(path, "utf8"); } catch { return null; }
}

async function run() {
  await mkdir(REPORTS_DIR, { recursive: true });
  if (!(await fileExists(OUT_DIR))) {
    record({
      id: "legal.skipped.noBuild",
      category: "Setup",
      description: "out/ missing — run bun run build first",
      status: "SKIP",
      evidence: "audit deferred",
    });
    await writeReports();
    return;
  }

  for (const route of LEGAL_ROUTES) {
    const html = await readBuiltHtml(route);
    if (!html) {
      record({
        id: `legal.route.${route.replace(/\//g, "")}`,
        category: "Build",
        description: `Legal route ${route} must build`,
        status: "FAIL",
        evidence: `out${route}index.html missing`,
      });
      continue;
    }

    // Canonical metadata
    if (!html.includes(`<link rel="canonical"`) || !html.includes(route)) {
      record({
        id: `legal.canonical.${route.replace(/\//g, "")}`,
        category: "Metadata",
        description: `${route} has correct canonical link`,
        status: "WARN",
        evidence: "Canonical link missing or incorrect for route",
      });
    } else {
      record({
        id: `legal.canonical.${route.replace(/\//g, "")}`,
        category: "Metadata",
        description: `${route} has canonical link`,
        status: "PASS",
        evidence: "canonical present",
      });
    }

    // Breadcrumb + WebPage schema
    if (html.includes('"@type":"BreadcrumbList"') || html.includes('"@type": "BreadcrumbList"')) {
      record({
        id: `legal.breadcrumb.${route.replace(/\//g, "")}`,
        category: "Schema",
        description: `${route} emits BreadcrumbList schema`,
        status: "PASS",
        evidence: "BreadcrumbList present",
      });
    } else {
      record({
        id: `legal.breadcrumb.${route.replace(/\//g, "")}`,
        category: "Schema",
        description: `${route} should emit BreadcrumbList schema`,
        status: "FAIL",
        evidence: "BreadcrumbList not found",
      });
    }

    // Footer links should appear on every page (already validated by audit:completeness, but spot-check)
    const allLegalLinked = LEGAL_ROUTES.every((r) => html.includes(`href="${r}"`));
    if (allLegalLinked) {
      record({
        id: `legal.footerLinks.${route.replace(/\//g, "")}`,
        category: "Cross-link",
        description: `${route} renders all 4 legal footer links`,
        status: "PASS",
        evidence: "all legal links present",
      });
    } else {
      record({
        id: `legal.footerLinks.${route.replace(/\//g, "")}`,
        category: "Cross-link",
        description: `${route} should render all 4 legal footer links`,
        status: "WARN",
        evidence: "one or more legal links missing in footer",
      });
    }

    // Canonical email + phone present on every legal page
    if (html.includes(MIA.contact.email)) {
      record({
        id: `legal.email.${route.replace(/\//g, "")}`,
        category: "Contact",
        description: `${route} uses canonical email from PUBLIC_FACT_LEDGER §1`,
        status: "PASS",
        evidence: `email ${MIA.contact.email} present`,
      });
    } else if (route === "/accessibility/" || route === "/dmca/" || route === "/privacy/" || route === "/terms/") {
      record({
        id: `legal.email.${route.replace(/\//g, "")}`,
        category: "Contact",
        description: `${route} must reference canonical email`,
        status: "FAIL",
        evidence: `email ${MIA.contact.email} not found`,
      });
    }
  }

  // DMCA-specific: must mention USCO-pending status
  const dmca = await readBuiltHtml("/dmca/");
  if (dmca) {
    const usco = /U\.S\.\s*Copyright Office/i.test(dmca);
    const inProcess = /in the process of registering|pending designated-agent/i.test(dmca);
    if (usco && inProcess) {
      record({
        id: "legal.dmca.uscoFlag",
        category: "DMCA",
        description: "DMCA page transparently notes USCO designated-agent registration pending",
        status: "WARN",
        evidence: "USCO + in-process language present (acceptable for staging; BLOCKED for production cutover per CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md)",
      });
    } else {
      record({
        id: "legal.dmca.uscoFlag",
        category: "DMCA",
        description: "DMCA page should transparently state USCO registration status",
        status: "FAIL",
        evidence: `USCO ref: ${usco}; in-process language: ${inProcess}`,
      });
    }
  }

  // Privacy page: GHL/LeadConnector mention should remain conditional ("when those tools are connected")
  const privacy = await readBuiltHtml("/privacy/");
  if (privacy) {
    const ghl = /GoHighLevel|LeadConnector/i.test(privacy);
    const conditional = /when those tools are connected/i.test(privacy);
    if (ghl && conditional) {
      record({
        id: "legal.privacy.ghlConditional",
        category: "Privacy",
        description: "Privacy mentions GHL/LeadConnector as conditional service provider",
        status: "PASS",
        evidence: "conditional language present",
      });
    } else if (ghl && !conditional) {
      record({
        id: "legal.privacy.ghlConditional",
        category: "Privacy",
        description: "Privacy mentions GHL but without 'when connected' qualifier",
        status: "WARN",
        evidence: "GHL mentioned but may be presented as active when it is not yet wired",
      });
    }
  }

  // Terms page: REALTOR® definition + FL governing law
  const terms = await readBuiltHtml("/terms/");
  if (terms) {
    const realtorDef = /federally registered collective membership mark/i.test(terms);
    const flLaw = /State of Florida|Broward County/i.test(terms);
    if (realtorDef && flLaw) {
      record({
        id: "legal.terms.realtorAndFL",
        category: "Terms",
        description: "Terms include canonical REALTOR® mark definition and Florida governing-law clause",
        status: "PASS",
        evidence: "REALTOR® definition + FL governing law present",
      });
    } else {
      record({
        id: "legal.terms.realtorAndFL",
        category: "Terms",
        description: "Terms must include REALTOR® mark definition and FL governing-law clause",
        status: "WARN",
        evidence: `REALTOR® def: ${realtorDef}; FL law: ${flLaw}`,
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

  for (const r of results) {
    const icon = r.status === "PASS" ? "✓" : r.status === "WARN" ? "⚠" : r.status === "SKIP" ? "·" : "✗";
    console.log(`  ${icon} ${r.id} — ${r.evidence}`);
  }
  console.log(`\nSummary: ${pass} PASS · ${warn} WARN · ${fail} FAIL · ${skip} SKIP`);

  await writeFile(
    join(REPORTS_DIR, "audit-legal.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), summary: { pass, warn, fail, skip }, results }, null, 2),
    "utf8"
  );
  const md = [
    "# Audit Legal Report",
    `**Generated:** ${new Date().toISOString()}`,
    `**Summary:** ${pass} PASS · ${warn} WARN · ${fail} FAIL · ${skip} SKIP`,
    "",
    "| ID | Status | Description | Evidence |",
    "|---|:-:|---|---|",
    ...results.map((r) => `| \`${r.id}\` | ${r.status === "PASS" ? "✅" : r.status === "WARN" ? "⚠️" : r.status === "SKIP" ? "·" : "❌"} | ${r.description} | ${r.evidence.replace(/\n/g, " ")} |`),
  ].join("\n");
  await writeFile(join(REPORTS_DIR, "audit-legal.md"), md, "utf8");
  console.log(`\n→ reports/audit-legal.json\n→ reports/audit-legal.md`);
  if (fail > 0) process.exit(1);
}

await run();
