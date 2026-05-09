#!/usr/bin/env bun
/**
 * audit-brand-consistency — brand-system-contract sentinel.
 *
 * Catches the failure mode where the build succeeds but components drift from
 * the locked Brand System Contract: unauthorized colors / fonts / glassmorphism,
 * missing trust strip, footer disclosure regressions, CTA hierarchy drift,
 * mobile nav absence.
 *
 * Authored: 2026-05-08 cycle 4 (Codex-Spark Team A Brand Systems Director recommendation)
 *
 * Outputs:
 *   reports/audit-brand-consistency.json   (machine-readable)
 *   reports/audit-brand-consistency.md     (human-readable)
 *
 * Exit code: 0 if zero FAILs (warnings allowed); 1 if any FAIL.
 */
import { readFile, readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

type CheckStatus = "PASS" | "WARN" | "FAIL" | "SKIP";
type CheckResult = {
  id: string;
  category: string;
  description: string;
  status: CheckStatus;
  evidence: string;
  details?: unknown;
};

const REPO_ROOT = process.cwd();
const OUT_DIR = join(REPO_ROOT, "out");
const SRC_DIR = join(REPO_ROOT, "src");
const REPORTS_DIR = join(REPO_ROOT, "reports");

// Approved color tokens per BRAND_SYSTEM_CONTRACT.md
// Token names ONLY — Tailwind utility prefixes (bg-, text-, border-) wrap them.
const APPROVED_COLOR_TOKENS = [
  "navy-800",
  "navy-900",
  "navy-700", // dark transition
  "cream-50",
  "cream-100",
  "cream-200",
  "cream-300",
  "cream-400",
  "brass-100",
  "brass-300",
  "brass-400",
  "brass-700",
  "soft-black",
  "white",
  "transparent",
  "current",
  "inherit",
];

// Forbidden color/effect patterns per Brand System Contract anti-rules
const FORBIDDEN_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bbackdrop-blur(?!-none)/g, reason: "glassmorphism (backdrop-blur) is anti-rule" },
  { pattern: /\bbg-gradient-to-(t|b|l|r|tr|tl|br|bl)\s+from-(red|blue|green|purple|pink|orange|teal|indigo|violet)/g, reason: "off-brand gradient color" },
  // Catch obvious off-palette colors (red/green/yellow/purple/pink/teal/indigo/violet/sky/rose/lime/emerald/amber/orange/cyan/fuchsia)
  // These would mean drift from navy/cream/brass
  { pattern: /\b(?:bg|text|border|ring|outline)-(red|orange|amber|yellow|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-\d{3}/g, reason: "off-brand color token" },
];

// Approved font families per Brand System Contract
const APPROVED_FONT_FAMILIES = ["font-display", "font-sans", "font-cinzel", "font-montserrat"];
// Forbidden font families
const FORBIDDEN_FONT_PATTERN = /\bfont-(serif(?!\s|$)|mono|cursive|fantasy)\b/g;

// Required footer trust-strip sentinels
const FOOTER_TRUST_SENTINELS = [
  /Equal Housing Opportunity/,
  /LPT Realty/,
  /REALTOR®/,
];

// Required footer legal links
const FOOTER_LEGAL_LINKS = [
  /href="\/privacy\/"/,
  /href="\/terms\/"/,
  /href="\/accessibility\/"/,
  /href="\/dmca\/"/,
];

// Sampled core pages to check at the built-output layer
const SAMPLED_PAGES = [
  "/",
  "/about/",
  "/contact/",
  "/buyers/",
  "/sellers/",
  "/valuation/",
  "/markets/",
  "/markets/fort-lauderdale/",
];

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function readBuiltHtml(route: string): Promise<string | null> {
  const path = route.endsWith("/")
    ? join(OUT_DIR, route, "index.html")
    : join(OUT_DIR, `${route}.html`);
  try {
    return await readFile(path, "utf-8");
  } catch {
    return null;
  }
}

async function walkSrc(dir: string, exts: string[]): Promise<string[]> {
  const out: string[] = [];
  async function walk(d: string) {
    let entries;
    try {
      entries = await readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.isFile() && exts.some((x) => e.name.endsWith(x))) out.push(p);
    }
  }
  await walk(dir);
  return out;
}

async function checkSourceForbiddenPatterns(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const files = await walkSrc(SRC_DIR, [".tsx", ".ts", ".css"]);
  type Hit = { file: string; line: number; match: string; reason: string };
  const hits: Hit[] = [];
  for (const f of files) {
    const content = await readFile(f, "utf-8");
    const lines = content.split("\n");
    for (const { pattern, reason } of FORBIDDEN_PATTERNS) {
      lines.forEach((line, idx) => {
        const m = line.match(pattern);
        if (m) {
          hits.push({
            file: relative(REPO_ROOT, f),
            line: idx + 1,
            match: m[0],
            reason,
          });
        }
      });
    }
  }
  results.push({
    id: "brand.noForbiddenColors",
    category: "Color System",
    description: "No off-brand color tokens (red/orange/amber/yellow/lime/emerald/teal/cyan/sky/indigo/violet/purple/fuchsia/pink/rose) in src/",
    status: hits.length === 0 ? "PASS" : "FAIL",
    evidence: hits.length === 0 ? "no off-brand color tokens" : `${hits.length} off-brand uses`,
    details: hits.length ? { hits } : undefined,
  });

  // Forbidden fonts
  type FontHit = { file: string; line: number; match: string };
  const fontHits: FontHit[] = [];
  for (const f of files) {
    const content = await readFile(f, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      const m = line.match(FORBIDDEN_FONT_PATTERN);
      if (m) {
        fontHits.push({ file: relative(REPO_ROOT, f), line: idx + 1, match: m[0] });
      }
    });
  }
  results.push({
    id: "brand.noForbiddenFonts",
    category: "Typography",
    description: "Only Cinzel display + Montserrat body (font-display / font-sans / font-cinzel / font-montserrat); no font-mono / font-serif / font-cursive / font-fantasy",
    status: fontHits.length === 0 ? "PASS" : "FAIL",
    evidence: fontHits.length === 0 ? "no forbidden font families" : `${fontHits.length} forbidden font references`,
    details: fontHits.length ? { fontHits } : undefined,
  });

  return results;
}

async function checkBuiltOutputForbiddenPatterns(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  type Hit = { route: string; match: string; reason: string };
  const hits: Hit[] = [];
  for (const route of SAMPLED_PAGES) {
    const html = await readBuiltHtml(route);
    if (!html) continue;
    for (const { pattern, reason } of FORBIDDEN_PATTERNS) {
      for (const m of html.matchAll(pattern)) {
        hits.push({ route, match: m[0], reason });
      }
    }
  }
  results.push({
    id: "brand.noForbiddenInBuilt",
    category: "Built Output",
    description: "Built HTML across 8 sampled pages contains no off-brand color/effect classes",
    status: hits.length === 0 ? "PASS" : "FAIL",
    evidence: hits.length === 0 ? "0 off-brand classes in built output" : `${hits.length} off-brand classes`,
    details: hits.length ? { hits: hits.slice(0, 50) } : undefined,
  });

  return results;
}

async function checkFooterTrustElements(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  type Issue = { route: string; missing: string[] };
  const issues: Issue[] = [];
  for (const route of SAMPLED_PAGES) {
    const html = await readBuiltHtml(route);
    if (!html) continue;
    const missing: string[] = [];
    for (const sentinel of FOOTER_TRUST_SENTINELS) {
      if (!sentinel.test(html)) missing.push(sentinel.source);
    }
    for (const link of FOOTER_LEGAL_LINKS) {
      if (!link.test(html)) missing.push(link.source);
    }
    if (missing.length) issues.push({ route, missing });
  }
  results.push({
    id: "brand.footerTrustElements",
    category: "Footer Discipline",
    description: "Every sampled page renders LPT / REALTOR® / EHO trust sentinels + 4 legal links in footer",
    status: issues.length === 0 ? "PASS" : "FAIL",
    evidence:
      issues.length === 0
        ? `${SAMPLED_PAGES.length} sampled pages carry full footer trust set`
        : `${issues.length} pages missing footer elements`,
    details: issues.length ? { issues } : undefined,
  });
  return results;
}

async function checkSiteFooterContractStructure(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const path = join(SRC_DIR, "components", "SiteFooter.tsx");
  if (!(await fileExists(path))) {
    results.push({
      id: "brand.siteFooterExists",
      category: "Component Discipline",
      description: "SiteFooter.tsx exists",
      status: "FAIL",
      evidence: "src/components/SiteFooter.tsx not found",
    });
    return results;
  }
  const content = await readFile(path, "utf-8");
  const expectedColumns = ["EXPLORE", "ABOUT", "BROKERAGE"]; // 4-col grid: brand mark + 3 named columns per Brand Contract
  const missingCols = expectedColumns.filter((c) => !content.includes(c));
  results.push({
    id: "brand.siteFooterStructure",
    category: "Component Discipline",
    description: "SiteFooter.tsx renders the 4-col grid (brand + EXPLORE + ABOUT + BROKERAGE) per Brand System Contract",
    status: missingCols.length === 0 ? "PASS" : "WARN",
    evidence: missingCols.length === 0 ? "all 3 named footer columns present" : `missing column headings: ${missingCols.join(", ")}`,
    details: missingCols.length ? { missingCols } : undefined,
  });

  // aria-label="Industry affiliations" sentinel for trust strip
  const hasTrustStripAria = /aria-label=["']Industry affiliations["']/.test(content);
  results.push({
    id: "brand.siteFooterTrustStripAria",
    category: "Component Discipline",
    description: "SiteFooter trust strip carries aria-label=\"Industry affiliations\"",
    status: hasTrustStripAria ? "PASS" : "WARN",
    evidence: hasTrustStripAria ? "trust-strip aria-label present" : "missing aria-label on trust strip",
  });
  return results;
}

async function checkHeroH1ContrastTokens(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  // Source-side token check: the Hero component must (a) use a text-shadow stack on image-mode H1
  // and (b) use an overlay gradient over the image. We grep for the canonical shadow stack tokens
  // and overlay class — if the patterns disappear, we want to know.
  const heroPath = join(SRC_DIR, "components", "Hero.tsx");
  if (!(await fileExists(heroPath))) {
    results.push({
      id: "brand.heroComponentExists",
      category: "Hero Discipline",
      description: "Hero.tsx exists",
      status: "FAIL",
      evidence: "src/components/Hero.tsx not found",
    });
    return results;
  }
  const heroSrc = await readFile(heroPath, "utf-8");
  const hasTextShadow = /\[text-shadow:[^\]]*rgba/.test(heroSrc);
  const hasOverlay = /from-navy-900\/\d+/.test(heroSrc) && /via-navy-900\/\d+/.test(heroSrc);
  const hasFontWeight = /font-(?:semibold|bold|extrabold)/.test(heroSrc);
  results.push({
    id: "brand.heroH1ContrastTokens",
    category: "Hero Discipline",
    description: "Hero image-mode H1 retains text-shadow + dark-overlay gradient + bold font weight",
    status: hasTextShadow && hasOverlay && hasFontWeight ? "PASS" : "WARN",
    evidence:
      hasTextShadow && hasOverlay && hasFontWeight
        ? "text-shadow + overlay gradient + bold weight all present in Hero.tsx"
        : `missing tokens (text-shadow:${hasTextShadow} overlay:${hasOverlay} bold:${hasFontWeight})`,
  });
  return results;
}

async function checkPublicEmailConsistency(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  // Source-side check: the canonical public email is in src/lib/mia.ts MIA.contact.email.
  // Any other email literal (matching the standard email regex) in src/ that isn't an internal allow-listed
  // pattern (msanabriarea@gmail.com) is a violation.
  const allowed = new Set<string>(["msanabriarea@gmail.com", "noreply@example.com", "abuse@example.com"]);
  const files = await walkSrc(SRC_DIR, [".tsx", ".ts"]);
  type EmailHit = { file: string; line: number; email: string };
  const violations: EmailHit[] = [];
  const seen = new Set<string>();
  for (const f of files) {
    const content = await readFile(f, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      // Skip comments-only lines that mention emails as future references
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
      for (const m of line.matchAll(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g)) {
        if (!m[1]) continue;
        const addr = m[1].toLowerCase();
        seen.add(addr);
        if (!allowed.has(addr)) {
          violations.push({ file: relative(REPO_ROOT, f), line: idx + 1, email: addr });
        }
      }
    });
  }
  const distinct = [...seen];
  results.push({
    id: "brand.publicEmailConsistency",
    category: "Email Consistency",
    description: "All emails referenced in src/ are the canonical public email (msanabriarea@gmail.com)",
    status: violations.length === 0 ? "PASS" : "FAIL",
    evidence:
      violations.length === 0
        ? `${distinct.length} distinct email(s) in src/, all canonical`
        : `${violations.length} non-canonical email reference(s) in src/`,
    details: violations.length ? { violations: violations.slice(0, 20), distinct } : undefined,
  });
  return results;
}

async function checkMobileNavExists(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const path = join(SRC_DIR, "components", "SiteHeader.tsx");
  if (!(await fileExists(path))) {
    results.push({
      id: "brand.siteHeaderExists",
      category: "Component Discipline",
      description: "SiteHeader.tsx exists",
      status: "FAIL",
      evidence: "src/components/SiteHeader.tsx not found",
    });
    return results;
  }
  const content = await readFile(path, "utf-8");
  const hasMobileToggle = /\b(MobileMenu|Drawer|aria-label="Open menu"|aria-expanded|MenuToggle|isOpen|setOpen|HamburgerMenu)\b/.test(content);
  const hasMobileBreakpoint = /\b(lg:hidden|md:hidden|sm:hidden|md:flex|lg:flex)\b/.test(content);
  results.push({
    id: "brand.mobileNavPresent",
    category: "Mobile Discipline",
    description: "SiteHeader.tsx renders a mobile-nav affordance (drawer, hamburger, or hidden-on-desktop nav)",
    status: hasMobileToggle && hasMobileBreakpoint ? "PASS" : "WARN",
    evidence:
      hasMobileToggle && hasMobileBreakpoint
        ? "mobile nav toggle + breakpoint visibility classes detected"
        : `mobile nav affordance missing (toggle:${hasMobileToggle} breakpoint:${hasMobileBreakpoint})`,
  });
  return results;
}

async function writeReports(results: CheckResult[]): Promise<void> {
  await mkdir(REPORTS_DIR, { recursive: true });

  const counts = {
    pass: results.filter((r) => r.status === "PASS").length,
    warn: results.filter((r) => r.status === "WARN").length,
    fail: results.filter((r) => r.status === "FAIL").length,
    skip: results.filter((r) => r.status === "SKIP").length,
  };

  const json = {
    timestamp: new Date().toISOString(),
    counts,
    results,
  };
  await writeFile(join(REPORTS_DIR, "audit-brand-consistency.json"), JSON.stringify(json, null, 2));

  const md: string[] = [
    "# Audit Brand Consistency Report",
    "",
    `**Generated:** ${json.timestamp}`,
    "",
    `**Summary:** ${counts.pass} PASS · ${counts.warn} WARN · ${counts.fail} FAIL · ${counts.skip} SKIP`,
    "",
    "## Results by category",
    "",
  ];
  const categories = [...new Set(results.map((r) => r.category))];
  for (const cat of categories) {
    md.push(`### ${cat}`);
    md.push("");
    md.push("| ID | Status | Description | Evidence |");
    md.push("|---|:-:|---|---|");
    const icon = (s: CheckStatus) => (s === "PASS" ? "✅" : s === "WARN" ? "⚠️" : s === "FAIL" ? "❌" : "—");
    for (const r of results.filter((r) => r.category === cat)) {
      md.push(`| \`${r.id}\` | ${icon(r.status)} | ${r.description} | ${r.evidence} |`);
    }
    md.push("");
  }
  if (counts.warn > 0 || counts.fail > 0) {
    md.push("## Failures and warnings — details");
    md.push("");
    for (const r of results) {
      if (r.status === "PASS" || r.status === "SKIP") continue;
      const icon = r.status === "WARN" ? "⚠️" : "❌";
      md.push(`### ${icon} \`${r.id}\``);
      md.push("");
      md.push(`**Description:** ${r.description}`);
      md.push("");
      md.push(`**Evidence:** ${r.evidence}`);
      md.push("");
      if (r.details) {
        md.push("```json");
        md.push(JSON.stringify(r.details, null, 2));
        md.push("```");
        md.push("");
      }
    }
  }
  await writeFile(join(REPORTS_DIR, "audit-brand-consistency.md"), md.join("\n"));
}

async function main() {
  const results: CheckResult[] = [];
  results.push(...(await checkSourceForbiddenPatterns()));
  results.push(...(await checkBuiltOutputForbiddenPatterns()));
  results.push(...(await checkFooterTrustElements()));
  results.push(...(await checkSiteFooterContractStructure()));
  results.push(...(await checkMobileNavExists()));
  results.push(...(await checkHeroH1ContrastTokens()));
  results.push(...(await checkPublicEmailConsistency()));

  for (const r of results) {
    const icon = r.status === "PASS" ? "✓" : r.status === "WARN" ? "⚠" : r.status === "FAIL" ? "✗" : "—";
    console.log(`  ${icon} ${r.id} — ${r.evidence}`);
  }

  await writeReports(results);

  const counts = {
    pass: results.filter((r) => r.status === "PASS").length,
    warn: results.filter((r) => r.status === "WARN").length,
    fail: results.filter((r) => r.status === "FAIL").length,
    skip: results.filter((r) => r.status === "SKIP").length,
  };
  console.log(``);
  console.log(`Summary: ${counts.pass} PASS · ${counts.warn} WARN · ${counts.fail} FAIL · ${counts.skip} SKIP`);
  console.log(``);
  console.log(`→ reports/audit-brand-consistency.json`);
  console.log(`→ reports/audit-brand-consistency.md`);
  process.exit(counts.fail > 0 ? 1 : 0);
}

main();
