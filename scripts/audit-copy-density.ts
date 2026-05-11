#!/usr/bin/env bun
/**
 * scripts/audit-copy-density.ts — Cycle 19C-COPY
 *
 * Deterministic copy-quality audit. Reads rendered HTML in `out/` and surfaces:
 *   - paragraphs over a configurable word limit (default 55)
 *   - sentences over a configurable word limit (default 28)
 *   - repeated-phrase counts (Eastern X, luxury and waterfront, guidance, discretion, rigor, private)
 *   - repeated geography in the same <p>
 *   - banned terms (HARD FAIL)
 *   - visible footer copy length
 *
 * Exemptions:
 *   - Legal pages (/dmca, /privacy, /terms, /accessibility) exempt from density warnings
 *   - PDF use-agreements / disclaimers — `out/` does not include PDFs so they are not scanned here
 *
 * Exit codes:
 *   - 0 on no banned-term hits (default)
 *   - 1 on any banned-term hit
 *   - 1 in --strict mode on any soft-rule violation above threshold
 *
 * Flags:
 *   --paragraph-limit=N    (default 55)
 *   --sentence-limit=N     (default 28)
 *   --footer-max=N         (default 220)
 *   --strict               fail on any soft-rule violation
 *   --json                 emit JSON to stdout instead of pretty text
 *   --report=path          write JSON report (default reports/copy-density.json)
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const argv = process.argv.slice(2);
const opt = (name: string, def: string | null = null) => {
  const m = argv.find(a => a.startsWith(`--${name}=`));
  return m ? m.slice(name.length + 3) : def;
};
const PARA_LIMIT = parseInt(opt("paragraph-limit", "55") ?? "55", 10);
const SENT_LIMIT = parseInt(opt("sentence-limit", "28") ?? "28", 10);
const FOOTER_MAX = parseInt(opt("footer-max", "220") ?? "220", 10);
const STRICT = argv.includes("--strict");
const JSON_ONLY = argv.includes("--json");
const REPORT_PATH = opt("report", "reports/copy-density.json") ?? "reports/copy-density.json";

const ROUTES: { route: string; file: string; label: string; densityExempt?: boolean }[] = [
  { route: "/", file: "out/index.html", label: "Home" },
  { route: "/markets/", file: "out/markets/index.html", label: "Markets index" },
  { route: "/markets/fort-lauderdale/", file: "out/markets/fort-lauderdale/index.html", label: "Fort Lauderdale" },
  { route: "/markets/pompano-beach/", file: "out/markets/pompano-beach/index.html", label: "Pompano Beach" },
  { route: "/markets/boca-raton/", file: "out/markets/boca-raton/index.html", label: "Boca Raton" },
  { route: "/markets/delray-beach/", file: "out/markets/delray-beach/index.html", label: "Delray Beach" },
  { route: "/buyers/", file: "out/buyers/index.html", label: "Buyers" },
  { route: "/sellers/", file: "out/sellers/index.html", label: "Sellers" },
  { route: "/contact/", file: "out/contact/index.html", label: "Contact" },
  { route: "/valuation/", file: "out/valuation/index.html", label: "Home Valuation" },
  { route: "/about/", file: "out/about/index.html", label: "About" },
  { route: "/insights/", file: "out/insights/index.html", label: "Insights index" },
  { route: "/privacy/", file: "out/privacy/index.html", label: "Privacy (exempt)", densityExempt: true },
  { route: "/terms/", file: "out/terms/index.html", label: "Terms (exempt)", densityExempt: true },
  { route: "/dmca/", file: "out/dmca/index.html", label: "DMCA (exempt)", densityExempt: true },
  { route: "/accessibility/", file: "out/accessibility/index.html", label: "Accessibility (exempt)", densityExempt: true },
];

const BANNED = [
  "definitive access point",
  "exclusive access",
  "guaranteed access",
  "off-market access",
  "private inventory",
  "mls bypass",
  "same-business-day response",
];

const CONCERN = [
  "luxury and waterfront",
  "eastern fort lauderdale",
  "eastern boca raton",
  "eastern delray beach",
  "guidance",
  "discretion",
  "rigor",
  "private",
];

const GEO = [
  "eastern fort lauderdale",
  "eastern boca raton",
  "eastern delray beach",
  "fort lauderdale",
  "boca raton",
  "delray beach",
];

// Pre-approved footer line — exact match counts as PASS.
const FOOTER_APPROVED = "Private guidance for waterfront and luxury homes from Fort Lauderdale to Boca Raton and Delray Beach. Expect a patient conversation delivered with discretion and nuance.";

function stripTags(s: string) {
  return s.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function pickParas(html: string): string[] {
  const out: string[] = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const t = stripTags(m[1] ?? "");
    if (t.length > 1) out.push(t);
  }
  return out;
}

function words(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

function sentences(s: string): string[] {
  return s.split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/).map(t => t.trim()).filter(Boolean);
}

function countAll(haystack: string, needle: string): number {
  if (!needle) return 0;
  const safe = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (haystack.match(new RegExp(safe, "g")) ?? []).length;
}

type Finding = {
  route: string;
  rule: string;
  severity: "fail" | "warn" | "info";
  detail: string;
};

const findings: Finding[] = [];
const routeReports: any[] = [];

for (const r of ROUTES) {
  if (!existsSync(r.file)) {
    findings.push({ route: r.route, rule: "file_missing", severity: "warn", detail: `Missing ${r.file}` });
    routeReports.push({ ...r, present: false });
    continue;
  }
  const html = readFileSync(r.file, "utf8");
  const text = stripTags(html);
  const lower = text.toLowerCase();
  const paras = pickParas(html);

  // Banned terms — HARD FAIL on any hit, anywhere on any route.
  for (const t of BANNED) {
    const n = countAll(lower, t);
    if (n > 0) findings.push({ route: r.route, rule: "banned_term", severity: "fail", detail: `"${t}" ×${n}` });
  }

  // Footer line — every route should render the approved footer line.
  const footerPresent = text.includes(FOOTER_APPROVED);
  if (!footerPresent) {
    findings.push({ route: r.route, rule: "footer_missing", severity: "warn", detail: "approved footer line not found in route HTML" });
  }
  const footerLen = FOOTER_APPROVED.length;
  if (footerLen > FOOTER_MAX) {
    findings.push({ route: r.route, rule: "footer_length", severity: "warn", detail: `approved footer length ${footerLen} > ${FOOTER_MAX}` });
  }

  if (r.densityExempt) {
    routeReports.push({ ...r, present: true, exempt: true, banned: BANNED.map(t => ({ term: t, count: countAll(lower, t) })) });
    continue;
  }

  // Paragraph density
  const longParas = paras.filter(p => words(p) > PARA_LIMIT);
  if (longParas.length > 0) {
    for (const p of longParas) {
      findings.push({ route: r.route, rule: "paragraph_too_long", severity: "warn", detail: `${words(p)}w > ${PARA_LIMIT}: "${p.slice(0, 120)}..."` });
    }
  }

  // Sentence density
  const allSentences = paras.flatMap(p => sentences(p));
  const longSentences = allSentences.filter(s => words(s) > SENT_LIMIT);
  if (longSentences.length > 0) {
    for (const s of longSentences.slice(0, 50)) {
      findings.push({ route: r.route, rule: "sentence_too_long", severity: "warn", detail: `${words(s)}w > ${SENT_LIMIT}: "${s.slice(0, 120)}..."` });
    }
  }

  // Repeated geography in a single <p>
  const repGeoParas = paras.filter(p => {
    const pl = p.toLowerCase();
    return GEO.reduce((acc, g) => acc + countAll(pl, g), 0) >= 3;
  });
  if (repGeoParas.length > 0) {
    findings.push({ route: r.route, rule: "repeated_geo_in_paragraph", severity: "warn", detail: `${repGeoParas.length} paragraph(s) with ≥3 geo mentions` });
  }

  // Concern-phrase counts (info only — no fail)
  const concern = CONCERN.map(t => ({ term: t, count: countAll(lower, t) })).filter(c => c.count > 0);

  routeReports.push({
    ...r,
    present: true,
    paragraphs: paras.length,
    paragraph_max_words: paras.reduce((m, p) => Math.max(m, words(p)), 0),
    paragraphs_over_limit: longParas.length,
    sentences: allSentences.length,
    sentence_max_words: allSentences.reduce((m, s) => Math.max(m, words(s)), 0),
    sentences_over_limit: longSentences.length,
    repeated_geo_paragraphs: repGeoParas.length,
    banned: BANNED.map(t => ({ term: t, count: countAll(lower, t) })),
    concern,
    footer_present: footerPresent,
  });
}

const failCount = findings.filter(f => f.severity === "fail").length;
const warnCount = findings.filter(f => f.severity === "warn").length;

const report = {
  generated_at: new Date().toISOString(),
  config: { PARA_LIMIT, SENT_LIMIT, FOOTER_MAX, STRICT, FOOTER_APPROVED },
  totals: { routes: ROUTES.length, fail: failCount, warn: warnCount },
  routes: routeReports,
  findings,
};

mkdirSync(dirname(REPORT_PATH), { recursive: true });
writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

if (JSON_ONLY) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`audit-copy-density — paragraph-limit=${PARA_LIMIT} sentence-limit=${SENT_LIMIT} footer-max=${FOOTER_MAX} strict=${STRICT}`);
  for (const rr of routeReports) {
    if (!rr.present) { console.log(`✗ ${rr.label} — MISSING ${rr.file}`); continue; }
    if (rr.exempt) {
      const bannedHits = rr.banned.filter((b: any) => b.count > 0);
      console.log(`✓ ${rr.label} (density-exempt) — banned: ${bannedHits.length ? bannedHits.map((b: any) => b.term + " ×" + b.count).join(", ") : "0"}; footer-line ${(rr.footer_present ?? "n/a")}`);
      continue;
    }
    const flag = rr.paragraphs_over_limit + rr.sentences_over_limit + rr.repeated_geo_paragraphs > 0 ? "·" : "✓";
    console.log(`${flag} ${rr.label} — p>${PARA_LIMIT}: ${rr.paragraphs_over_limit} · s>${SENT_LIMIT}: ${rr.sentences_over_limit} · rep-geo: ${rr.repeated_geo_paragraphs} · max-p: ${rr.paragraph_max_words}w · max-s: ${rr.sentence_max_words}w · footer: ${rr.footer_present ? "present" : "MISSING"}`);
  }
  console.log(`audit-copy-density — ${failCount} FAIL · ${warnCount} WARN`);
  console.log(`report: ${REPORT_PATH}`);
}

const shouldFail = failCount > 0 || (STRICT && warnCount > 0);
process.exit(shouldFail ? 1 : 0);
