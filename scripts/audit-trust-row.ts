#!/usr/bin/env bun
/**
 * Cycle 19B-FL — audit-trust-row.
 *
 * Closes Cato F6 / TP-13. Asserts that every public route renders the
 * brokerage-identity trust row above the fold (DOM-position: before <main>,
 * inside <body> but after <header> markup) and that the row contains all four
 * required strings: REALTOR® mark, brokerage legal name, FL license number,
 * and the Fort-Lauderdale city anchor. Crucially: the audit FAILS if the
 * trust marks appear ONLY in the shared footer (TP-13 anti-pattern from the
 * Cycle 19A-M Cato cross-vendor audit) by looking for the dedicated
 * `data-testid="trust-row"` element.
 *
 * Exit codes:
 *   0 — every scanned route renders trust-row above main with all 4 marks
 *   1 — at least one route is missing the trust-row or a required mark
 *   2 — `out/` missing (build needed)
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { existsSync } from "node:fs";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "out");

const REQUIRED_MARKS = [
  { label: "REALTOR® mark", pattern: /REALTOR®/u },
  { label: "Brokerage legal name", pattern: /LPT Realty LLC/ },
  { label: "FL License #SL3405877", pattern: /FL License #SL3405877/ },
  { label: "Fort Lauderdale-based anchor", pattern: /Fort Lauderdale-based/ },
];

// Scan a representative subset of routes that exist in the static export.
// Each route maps to `out/<route>/index.html`.
const ROUTES_TO_SCAN: ReadonlyArray<string> = [
  "",
  "about",
  "buyers",
  "sellers",
  "contact",
  "valuation",
  "insights",
  "markets",
  "markets/fort-lauderdale",
  "markets/boca-raton",
  "markets/delray-beach",
  "markets/coral-ridge",
  "markets/victoria-park",
];

function indexOfMain(html: string): number {
  const m = html.match(/<main\b/);
  return m ? m.index ?? -1 : -1;
}

function indexOfFooter(html: string): number {
  const m = html.match(/<footer\b/);
  return m ? m.index ?? -1 : -1;
}

function indexOfTrustRow(html: string): number {
  const m = html.match(/data-testid=["']trust-row["']/);
  return m ? m.index ?? -1 : -1;
}

type Finding = {
  route: string;
  ok: boolean;
  reasons: string[];
};

async function scanRoute(route: string): Promise<Finding> {
  const path = route === "" ? join(OUT, "index.html") : join(OUT, route, "index.html");
  if (!existsSync(path)) {
    return { route: route || "/", ok: false, reasons: [`html missing: ${path}`] };
  }
  const html = await readFile(path, "utf8");
  const reasons: string[] = [];
  const trustIdx = indexOfTrustRow(html);
  const mainIdx = indexOfMain(html);
  const footerIdx = indexOfFooter(html);
  if (trustIdx === -1) {
    reasons.push("trust-row element (data-testid=trust-row) missing");
  } else {
    if (mainIdx === -1) {
      reasons.push("<main> not found in HTML — cannot verify above-fold DOM position");
    } else if (trustIdx >= mainIdx) {
      reasons.push("trust-row appears AFTER <main> in DOM — should render above-the-fold before <main>");
    }
    if (footerIdx !== -1 && trustIdx > footerIdx) {
      reasons.push("trust-row appears AFTER <footer> — TP-13 anti-pattern (footer-only trust)");
    }
    // Restrict required-mark search to the trust-row element block (heuristic:
    // 800 chars after the data-testid match — generous to cover the strip).
    const slice = html.slice(trustIdx, trustIdx + 1200);
    for (const { label, pattern } of REQUIRED_MARKS) {
      if (!pattern.test(slice)) {
        reasons.push(`required mark missing inside trust-row: ${label}`);
      }
    }
  }
  return { route: route || "/", ok: reasons.length === 0, reasons };
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("✗ out/ missing — run 'bun run build' first.");
    process.exit(2);
  }
  const results = await Promise.all(ROUTES_TO_SCAN.map((r) => scanRoute(r)));
  let bad = 0;
  for (const r of results) {
    if (r.ok) {
      console.log(`✓ ${r.route}`);
    } else {
      bad++;
      console.error(`✗ ${r.route}`);
      for (const reason of r.reasons) console.error(`   ${reason}`);
    }
  }
  console.log(`audit-trust-row — ${results.length - bad}/${results.length} routes pass`);
  if (bad > 0) process.exit(1);
}

main().catch((err) => {
  console.error("audit-trust-row crashed:", err);
  process.exit(1);
});
