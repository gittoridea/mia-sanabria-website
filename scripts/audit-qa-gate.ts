#!/usr/bin/env bun
/**
 * audit-qa-gate — full-site QA matrix derived from sitemap source-of-truth.
 *
 * Per-route columns produced (deterministic, machine-checkable subset):
 *   route, page_type, h1_present, h1_text_snip, title, meta_description,
 *   canonical, noindex, schema_present (JSON-LD count), trust_proof_present,
 *   internal_links_count, has_faq, mobile_readability_pass, screenshot_evidence,
 *   stale_strings_pass, contact_form_honest, severity, owner_category
 *
 * Owner categories (1..6):
 *   1 = site/content/design defect (in our hands)
 *   2 = tool/process defect (audit infra)
 *   3 = principal decision required (Mia/Torrey)
 *   4 = GHL / ops dependency
 *   5 = legal / compliance dependency
 *   6 = launch / cutover dependency
 *
 * Output:
 *   reports/qa-gate-matrix.json   (machine-readable; full row data)
 *   reports/qa-gate-matrix.md     (human-readable matrix; one table per page_type)
 *
 * Exit codes:
 *   0  — every required cell is present and severity:critical count == 0
 *   1  — at least one critical finding
 *   2  — out/ missing
 */
import { readFile, readdir, stat, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const OUT_DIR = "out";
const SITEMAP_PATH = `${OUT_DIR}/sitemap.xml`;
const REPORT_JSON = "reports/qa-gate-matrix.json";
const REPORT_MD = "reports/qa-gate-matrix.md";
const STAGING_BASE = "https://miasanabriarealtor.trueidea.com";

type Finding = {
  field: string;
  status: "pass" | "warn" | "fail" | "info";
  evidence: string;
  severity: "low" | "medium" | "high" | "critical";
  owner_category: 1 | 2 | 3 | 4 | 5 | 6;
};

type Row = {
  route: string;
  page_type: string;
  out_file: string;
  title?: string;
  h1_text?: string;
  meta_description?: string;
  canonical?: string;
  noindex: boolean;
  schema_blocks: number;
  internal_links: number;
  trust_proof_present: boolean;
  has_faq: boolean;
  contact_form_present: boolean;
  contact_form_action_kind: "mailto" | "ghl" | "none" | "other";
  stale_strings_clean: boolean;
  mobile_readability_pass?: boolean;
  screenshot_evidence?: string;
  findings: Finding[];
};

const PAGE_TYPE_RULES: Array<{ test: RegExp; type: string }> = [
  { test: /^\/$/, type: "home" },
  { test: /^\/about\/?$/, type: "identity" },
  { test: /^\/contact\/?$/, type: "contact" },
  { test: /^\/buyers\/?$/, type: "service" },
  { test: /^\/sellers\/?$/, type: "service" },
  { test: /^\/valuation\/?$/, type: "service" },
  { test: /^\/markets\/?$/, type: "markets_index" },
  { test: /^\/markets\/[a-z0-9-]+\/?$/, type: "market_detail" },
  { test: /^\/insights\/?$/, type: "insights_index" },
  { test: /^\/insights\/[a-z0-9-]+\/?$/, type: "insight_post" },
  { test: /^\/(privacy|terms|accessibility|dmca)\/?$/, type: "legal" },
  { test: /^\/thank-you/, type: "thank_you" },
];

function classifyPageType(route: string): string {
  for (const r of PAGE_TYPE_RULES) if (r.test.test(route)) return r.type;
  return "other";
}

function normalizeRoute(url: string, base: string): string {
  return url.replace(new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), "") || "/";
}

async function loadSitemap(): Promise<{ base: string; routes: string[] }> {
  let xml: string;
  try {
    xml = await readFile(SITEMAP_PATH, "utf-8");
  } catch {
    console.error(`audit-qa-gate: ${SITEMAP_PATH} missing — run \`bun run build\``);
    process.exit(2);
  }
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g))
    .map((m) => m[1])
    .filter((u): u is string => typeof u === "string");
  if (locs.length === 0) {
    console.error("audit-qa-gate: sitemap has 0 <loc> entries");
    process.exit(1);
  }
  const firstLoc = locs[0]!;
  const base = firstLoc.match(/^(https?:\/\/[^/]+)/)?.[1] ?? STAGING_BASE;
  const routes = locs.map((u) => normalizeRoute(u, base).replace(/\/$/, "") || "/");
  return { base, routes };
}

async function readHtmlForRoute(route: string): Promise<string | null> {
  // Static export shape: out/<route>/index.html (root → out/index.html)
  const candidates = [
    `${OUT_DIR}${route === "/" ? "" : route}/index.html`,
    `${OUT_DIR}${route === "/" ? "" : route}.html`,
  ];
  for (const c of candidates) {
    try {
      return await readFile(c, "utf-8");
    } catch {
      /* try next */
    }
  }
  return null;
}

function extract(html: string, re: RegExp): string | undefined {
  const m = html.match(re);
  if (!m) return undefined;
  const capture = m[1] ?? m[0];
  return typeof capture === "string" ? capture.trim() : undefined;
}

function scanRow(route: string, html: string): Row {
  const out_file = `${OUT_DIR}${route === "/" ? "" : route}/index.html`;
  const page_type = classifyPageType(route);
  const title = extract(html, /<title>([^<]+)<\/title>/);
  const meta_description = extract(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/);
  const canonical = extract(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/);
  const noindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/.test(html);
  // H1 — first h1 text content
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1_text = h1Match && typeof h1Match[1] === "string"
    ? h1Match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    : undefined;
  // JSON-LD scripts
  const schema_blocks = (html.match(/<script[^>]+type=["']application\/ld\+json["']/g) || []).length;
  // Internal links: href starting with "/" (not anchor, not external)
  const internal_links = (html.match(/href=["']\/(?!\/)[^"']*["']/g) || []).length;
  // Trust proof — REALTOR® or LPT Realty present in body
  const trust_proof_present = /REALTOR®|LPT Realty/i.test(html);
  // FAQ — FAQPage schema or <details> + question pattern
  const has_faq = /"@type"\s*:\s*"FAQPage"/.test(html) || /<details[^>]*>/.test(html);
  // Contact form detection
  const formActionMatch = html.match(/<form[^>]+action=["']([^"']+)["']/);
  const formAction = formActionMatch?.[1];
  const contact_form_present = !!formAction;
  const contact_form_action_kind: Row["contact_form_action_kind"] =
    !formAction ? "none" :
    /^mailto:/i.test(formAction) ? "mailto" :
    /(gohighlevel|leadconnector|hooks\.|ghl)/i.test(formAction) ? "ghl" :
    "other";
  // Stale strings — match a curated set deterministically
  const staleHits: string[] = [];
  const STALE = [
    /Evergreen Brief/,                // label-form (lowercase prose OK)
    /Klein Morgan/i,
    /\[Legal Brokerage Name\]/,
    /\[Privacy Email\]/,
    /sunandbreeze/i,
  ];
  for (const re of STALE) if (re.test(html)) staleHits.push(re.toString());
  // Footer double period (".." followed by space) — defect class
  const footerDoublePeriodPresent = /\.\.\s/.test(html);
  const stale_strings_clean = staleHits.length === 0 && !footerDoublePeriodPresent;

  const findings: Finding[] = [];
  // Critical findings (severity:critical → cycle blocks)
  if (!title) findings.push({ field: "title", status: "fail", evidence: "missing", severity: "critical", owner_category: 1 });
  if (!canonical) findings.push({ field: "canonical", status: "fail", evidence: "missing", severity: "high", owner_category: 1 });
  if (!h1_text) findings.push({ field: "h1", status: "fail", evidence: "missing", severity: "critical", owner_category: 1 });
  if (!meta_description) findings.push({ field: "meta_description", status: "fail", evidence: "missing", severity: "high", owner_category: 1 });
  if (schema_blocks === 0 && !["thank_you"].includes(page_type)) findings.push({ field: "schema", status: "fail", evidence: "no JSON-LD", severity: "high", owner_category: 1 });
  if (!trust_proof_present && !["thank_you", "legal"].includes(page_type)) findings.push({ field: "trust_proof", status: "warn", evidence: "no REALTOR® / LPT Realty surface", severity: "medium", owner_category: 1 });
  if (staleHits.length > 0) findings.push({ field: "stale_strings", status: "fail", evidence: staleHits.join("; "), severity: "high", owner_category: 1 });
  if (footerDoublePeriodPresent) findings.push({ field: "double_period", status: "fail", evidence: "'.. ' present in HTML", severity: "medium", owner_category: 1 });
  // Contact category overlays
  if (page_type === "contact" && contact_form_action_kind === "mailto") {
    findings.push({
      field: "lead_capture",
      status: "warn",
      evidence: "contact form uses mailto fallback; GHL endpoint not wired",
      severity: "medium",
      owner_category: 4,
    });
  }
  if (page_type === "legal") {
    findings.push({
      field: "legal_review",
      status: "info",
      evidence: "Privacy/Terms/DMCA require legal review before .com cutover",
      severity: "high",
      owner_category: 5,
    });
  }
  // Launch overlays — staging noindex strategy
  if (noindex) {
    findings.push({ field: "noindex", status: "info", evidence: "meta noindex present (intentional on staging)", severity: "low", owner_category: 6 });
  }
  return {
    route,
    page_type,
    out_file,
    title,
    h1_text,
    meta_description,
    canonical,
    noindex,
    schema_blocks,
    internal_links,
    trust_proof_present,
    has_faq,
    contact_form_present,
    contact_form_action_kind,
    stale_strings_clean,
    findings,
  };
}

async function loadMobileReadabilityIfPresent(): Promise<Map<string, boolean>> {
  const map = new Map<string, boolean>();
  if (!existsSync("reports/audit-mobile-readability.json")) return map;
  try {
    const raw = await readFile("reports/audit-mobile-readability.json", "utf-8");
    const j = JSON.parse(raw) as { rows: Array<{ route: string; ok: boolean }> };
    // Pass when ALL viewports ok for that route.
    const byRoute = new Map<string, boolean>();
    for (const r of j.rows) {
      const cur = byRoute.get(r.route);
      byRoute.set(r.route, cur === undefined ? r.ok : cur && r.ok);
    }
    for (const [k, v] of byRoute) {
      const norm = k.replace(/\/$/, "") || "/";
      map.set(norm, v);
    }
  } catch (e) {
    console.error(`qa-gate: failed to read mobile-readability report: ${(e as Error).message}`);
  }
  return map;
}

async function main() {
  const { base, routes } = await loadSitemap();
  const mobilePass = await loadMobileReadabilityIfPresent();
  await mkdir("reports", { recursive: true });
  const rows: Row[] = [];
  for (const route of routes) {
    const html = await readHtmlForRoute(route);
    if (!html) {
      rows.push({
        route,
        page_type: classifyPageType(route),
        out_file: "<missing>",
        noindex: false,
        schema_blocks: 0,
        internal_links: 0,
        trust_proof_present: false,
        has_faq: false,
        contact_form_present: false,
        contact_form_action_kind: "none",
        stale_strings_clean: false,
        findings: [{ field: "out_html", status: "fail", evidence: "no HTML found in out/", severity: "critical", owner_category: 2 }],
      });
      continue;
    }
    const row = scanRow(route, html);
    const mobileOk = mobilePass.get(row.route);
    if (mobileOk !== undefined) row.mobile_readability_pass = mobileOk;
    rows.push(row);
  }

  const criticalCount = rows.flatMap((r) => r.findings).filter((f) => f.severity === "critical").length;
  const highCount = rows.flatMap((r) => r.findings).filter((f) => f.severity === "high").length;
  const mediumCount = rows.flatMap((r) => r.findings).filter((f) => f.severity === "medium").length;
  const lowCount = rows.flatMap((r) => r.findings).filter((f) => f.severity === "low").length;
  const ownerSplit = { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0 };
  for (const f of rows.flatMap((r) => r.findings)) {
    ownerSplit[`c${f.owner_category}` as keyof typeof ownerSplit]++;
  }

  const report = {
    base,
    generated_at: new Date().toISOString(),
    sitemap_route_count: routes.length,
    rows_scanned: rows.length,
    severity_counts: { critical: criticalCount, high: highCount, medium: mediumCount, low: lowCount },
    owner_category_split: ownerSplit,
    rows,
  };
  await writeFile(REPORT_JSON, JSON.stringify(report, null, 2));

  // Human-readable matrix grouped by page_type
  const byType = new Map<string, Row[]>();
  for (const r of rows) {
    if (!byType.has(r.page_type)) byType.set(r.page_type, []);
    byType.get(r.page_type)!.push(r);
  }
  const md: string[] = [];
  md.push(`# QA-Gate Matrix — Cycle 19A-M`);
  md.push(``);
  md.push(`Base: \`${base}\`  ·  Generated: ${new Date().toISOString()}`);
  md.push(``);
  md.push(`**${rows.length} routes scanned** · severity → critical ${criticalCount} · high ${highCount} · medium ${mediumCount} · low ${lowCount}`);
  md.push(``);
  md.push(`**Owner-category split** → c1 site:${ownerSplit.c1} · c2 tool:${ownerSplit.c2} · c3 principal:${ownerSplit.c3} · c4 GHL:${ownerSplit.c4} · c5 legal:${ownerSplit.c5} · c6 launch:${ownerSplit.c6}`);
  md.push(``);
  for (const [type, group] of byType) {
    md.push(`## ${type} (${group.length} routes)`);
    md.push(``);
    md.push(`| Route | H1 | Title (len) | Meta (len) | Schemas | Links | Trust | FAQ | Form | Stale clean | Mobile | Findings |`);
    md.push(`|-------|----|--------------|------------|---------|-------|-------|-----|------|-------------|--------|----------|`);
    for (const r of group) {
      const findingsCell = r.findings.length === 0 ? "—" : r.findings.map((f) => `${f.severity[0]}:${f.field}(c${f.owner_category})`).join(" ");
      md.push(
        `| \`${r.route}\` | ${r.h1_text ? "✓" : "✗"} | ${r.title ? r.title.length : "—"} | ${r.meta_description ? r.meta_description.length : "—"} | ${r.schema_blocks} | ${r.internal_links} | ${r.trust_proof_present ? "✓" : "—"} | ${r.has_faq ? "✓" : "—"} | ${r.contact_form_present ? r.contact_form_action_kind : "—"} | ${r.stale_strings_clean ? "✓" : "✗"} | ${r.mobile_readability_pass === undefined ? "—" : r.mobile_readability_pass ? "✓" : "✗"} | ${findingsCell} |`
      );
    }
    md.push(``);
  }
  md.push(`## Owner-category legend`);
  md.push(``);
  md.push(`1 site/content/design  ·  2 tool/process  ·  3 principal decision  ·  4 GHL/ops  ·  5 legal/compliance  ·  6 launch/cutover`);
  await writeFile(REPORT_MD, md.join("\n"));

  console.log(`audit-qa-gate — ${rows.length} routes · critical ${criticalCount} · high ${highCount} · medium ${mediumCount} · low ${lowCount}`);
  console.log(`→ ${REPORT_JSON}`);
  console.log(`→ ${REPORT_MD}`);
  if (criticalCount > 0) process.exit(1);
}

await main();
