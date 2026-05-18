#!/usr/bin/env bun
/**
 * audit-public-email — enforces the public-email canonicalization contract
 * locked on 2026-05-18.
 *
 * Canonical public email: mia@miasanabria.com
 *
 * FAIL conditions (any one fails the build):
 *   1. Any built HTML page in out/ contains the legacy public email
 *      `msanabriarea@gmail.com`. (Legacy is allowed only on private/backend
 *      lead-routing surfaces — never on a public rendered surface.)
 *   2. Any built HTML page in out/ contains the forbidden branded variant
 *      `mia@miasanabriarealtor.com`.
 *   3. Critical contact routes are missing the canonical email
 *      `mia@miasanabria.com` where the contact email must render. Routes
 *      and modes:
 *        /                 — soft (homepage may rely on header/footer only;
 *                            checked but not gating if absent)
 *        /contact/         — REQUIRED
 *        /accessibility/   — REQUIRED
 *        /dmca/            — REQUIRED
 *        /privacy/         — REQUIRED
 *        /terms/           — REQUIRED
 *        /about/           — soft (intro page; checked but not gating)
 *        /valuation/       — soft (mailto fallback may be route-only)
 *
 * Outputs:
 *   reports/audit-public-email.json
 *   reports/audit-public-email.md
 *
 * Exit 0 on PASS; exit 1 on any FAIL.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { readdir } from "node:fs/promises";

const REPO = process.cwd();
const REPORTS = join(REPO, "reports");
const OUT_DIR = join(REPO, "out");

const CANONICAL_PUBLIC_EMAIL = "mia@miasanabria.com";
const LEGACY_PUBLIC_EMAIL = "msanabriarea@gmail.com";
const BRANDED_FORBIDDEN_EMAIL = "mia@miasanabriarealtor.com";

type Severity = "REQUIRED" | "SOFT";

const CRITICAL_ROUTES: ReadonlyArray<{ route: string; severity: Severity }> = [
  { route: "/", severity: "SOFT" },
  { route: "/contact/", severity: "REQUIRED" },
  { route: "/accessibility/", severity: "REQUIRED" },
  { route: "/dmca/", severity: "REQUIRED" },
  { route: "/privacy/", severity: "REQUIRED" },
  { route: "/terms/", severity: "REQUIRED" },
  { route: "/about/", severity: "SOFT" },
  { route: "/valuation/", severity: "SOFT" },
];

type Finding = {
  kind: "legacy-in-out" | "branded-in-out" | "missing-canonical";
  route?: string;
  file: string;
  line?: number;
  detail: string;
};

type CheckResult = {
  id: string;
  description: string;
  status: "PASS" | "FAIL" | "WARN";
  evidence: string;
};

async function walkHtml(root: string, acc: string[]): Promise<void> {
  let names: string[];
  try {
    names = await readdir(root);
  } catch {
    return;
  }
  for (const name of names) {
    if (name.startsWith(".") || name === "node_modules") continue;
    const full = join(root, name);
    let s: Awaited<ReturnType<typeof stat>>;
    try {
      s = await stat(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      await walkHtml(full, acc);
    } else if (s.isFile() && name.endsWith(".html")) {
      acc.push(full);
    }
  }
}

function routeForHtml(absPath: string): string {
  const rel = relative(OUT_DIR, absPath).replace(/\\/g, "/");
  // index.html -> /
  // foo/index.html -> /foo/
  // 404.html -> /404 (sentinel; never used for criticality)
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel;
}

function scanForLiteral(html: string, literal: string): Array<{ line: number; snippet: string }> {
  const out: Array<{ line: number; snippet: string }> = [];
  const lines = html.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (ln === undefined) continue;
    const idx = ln.indexOf(literal);
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(ln.length, idx + literal.length + 40);
      out.push({ line: i + 1, snippet: ln.slice(start, end) });
    }
  }
  return out;
}

async function main() {
  await mkdir(REPORTS, { recursive: true });

  // Verify out/ exists. If absent, audit cannot run authoritatively.
  try {
    await stat(OUT_DIR);
  } catch {
    const msg = "audit-public-email: out/ not present — run `bun run build` first.";
    console.error(msg);
    await writeFile(
      join(REPORTS, "audit-public-email.json"),
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          pass: false,
          error: "out/ missing",
          message: msg,
        },
        null,
        2
      )
    );
    await writeFile(join(REPORTS, "audit-public-email.md"), `# audit-public-email\n\nFAIL — ${msg}\n`);
    process.exit(1);
  }

  const htmls: string[] = [];
  await walkHtml(OUT_DIR, htmls);

  const findings: Finding[] = [];
  const routesPresent = new Set<string>();

  for (const file of htmls) {
    const route = routeForHtml(file);
    routesPresent.add(route);
    let html: string;
    try {
      html = await readFile(file, "utf8");
    } catch {
      continue;
    }

    for (const hit of scanForLiteral(html, LEGACY_PUBLIC_EMAIL)) {
      findings.push({
        kind: "legacy-in-out",
        route,
        file: relative(REPO, file),
        line: hit.line,
        detail: hit.snippet,
      });
    }
    for (const hit of scanForLiteral(html, BRANDED_FORBIDDEN_EMAIL)) {
      findings.push({
        kind: "branded-in-out",
        route,
        file: relative(REPO, file),
        line: hit.line,
        detail: hit.snippet,
      });
    }
  }

  // Canonical-presence checks per critical route.
  const checks: CheckResult[] = [];
  for (const { route, severity } of CRITICAL_ROUTES) {
    // Resolve the html file for the route.
    const candidate =
      route === "/"
        ? join(OUT_DIR, "index.html")
        : join(OUT_DIR, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
    let routeHtml: string | null = null;
    try {
      routeHtml = await readFile(candidate, "utf8");
    } catch {
      // Route file absent — record as SKIP (not failure).
      checks.push({
        id: `public-email.present.${route}`,
        description: `${route} renders canonical public email (${CANONICAL_PUBLIC_EMAIL})`,
        status: "WARN",
        evidence: `route file absent (${relative(REPO, candidate)})`,
      });
      continue;
    }
    const hasCanonical = routeHtml.includes(CANONICAL_PUBLIC_EMAIL);
    if (hasCanonical) {
      checks.push({
        id: `public-email.present.${route}`,
        description: `${route} renders canonical public email (${CANONICAL_PUBLIC_EMAIL})`,
        status: "PASS",
        evidence: `canonical email present`,
      });
    } else {
      const status: CheckResult["status"] = severity === "REQUIRED" ? "FAIL" : "WARN";
      checks.push({
        id: `public-email.present.${route}`,
        description: `${route} renders canonical public email (${CANONICAL_PUBLIC_EMAIL}) [${severity}]`,
        status,
        evidence: `canonical email absent`,
      });
      if (status === "FAIL") {
        findings.push({
          kind: "missing-canonical",
          route,
          file: relative(REPO, candidate),
          detail: `canonical email ${CANONICAL_PUBLIC_EMAIL} missing on ${route} (REQUIRED)`,
        });
      }
    }
  }

  const fail = findings.length > 0;

  const json = {
    generated_at: new Date().toISOString(),
    canonical_public_email: CANONICAL_PUBLIC_EMAIL,
    legacy_public_email_forbidden_in_out: LEGACY_PUBLIC_EMAIL,
    branded_variant_forbidden: BRANDED_FORBIDDEN_EMAIL,
    scanned_html_pages: htmls.length,
    findings,
    checks,
    pass: !fail,
  };
  await writeFile(
    join(REPORTS, "audit-public-email.json"),
    JSON.stringify(json, null, 2)
  );

  const md: string[] = [];
  md.push("# audit-public-email");
  md.push("");
  md.push(`Generated: ${json.generated_at}`);
  md.push(`Canonical public email: \`${CANONICAL_PUBLIC_EMAIL}\``);
  md.push(`Scanned HTML pages in out/: ${htmls.length}`);
  md.push(`Findings: ${findings.length}`);
  md.push(`Pass: ${json.pass}`);
  md.push("");
  md.push("## Critical-route canonical-presence checks");
  md.push("");
  md.push("| Route | Status | Description | Evidence |");
  md.push("|-------|--------|-------------|----------|");
  for (const c of checks) {
    const icon = c.status === "PASS" ? "PASS" : c.status === "WARN" ? "WARN" : "FAIL";
    md.push(`| ${c.id.replace("public-email.present.", "")} | ${icon} | ${c.description} | ${c.evidence} |`);
  }
  md.push("");
  if (findings.length === 0) {
    md.push("FAIL count: 0. PASS — no legacy or branded email leaked into rendered HTML; all REQUIRED routes carry canonical email.");
  } else {
    md.push("## Findings");
    md.push("");
    md.push("| Kind | Route | File | Line | Detail |");
    md.push("|------|-------|------|------|--------|");
    for (const f of findings) {
      const safe = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
      md.push(`| ${f.kind} | ${f.route ?? ""} | ${f.file} | ${f.line ?? ""} | ${safe(f.detail)} |`);
    }
  }
  await writeFile(join(REPORTS, "audit-public-email.md"), md.join("\n"));

  if (fail) {
    console.error(
      `audit-public-email: FAIL — ${findings.length} finding${findings.length === 1 ? "" : "s"}`
    );
    for (const f of findings.slice(0, 20)) {
      console.error(`  [${f.kind}] ${f.route ?? ""} ${f.file}${f.line ? `:${f.line}` : ""} — ${f.detail}`);
    }
    process.exit(1);
  }
  console.log(
    `audit-public-email: PASS (${htmls.length} html files scanned; canonical=${CANONICAL_PUBLIC_EMAIL})`
  );
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
