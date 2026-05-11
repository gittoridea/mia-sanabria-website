#!/usr/bin/env bun
/**
 * Cycle 19B-FL-R1 — audit-trust-row (rewritten).
 *
 * Cycle 19B-FL introduced a global above-fold trust row between SiteHeader and
 * <main> on every route. The principal rejected this — trust marks must NOT
 * appear above the hero on any route, and must NOT appear inside lead-magnet
 * PDFs. They may still appear in the site footer, About, Contact, valuation/
 * contact CTA modules, and PDF disclosure footers.
 *
 * This audit FAILS the build if EITHER of these regressions reappears:
 *   1. The legacy above-fold string `REALTOR® · LPT Realty LLC · FL License
 *      #SL3405877 · Fort Lauderdale-based` (with or without the middle-dot
 *      glyph spacing) appears in any route HTML BEFORE the opening `<main>`
 *      tag.
 *   2. Any element with `data-testid="trust-row"` appears in any route HTML
 *      before `<main>`.
 *   3. Any lead-magnet PDF text-extract contains the legacy above-fold string.
 *
 * The audit does NOT require trust proof above the fold — that contract was
 * retired in Cycle 19B-FL-R1.
 *
 * Exit codes:
 *   0 — every scanned route + every PDF clean
 *   1 — at least one route or PDF carries the forbidden regression
 *   2 — `out/` missing (build needed)
 */
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { existsSync } from "node:fs";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "out");
const PUBLIC_DOWNLOADS = join(ROOT, "public", "downloads");

// Legacy above-fold strings — the old TrustRow rendered REALTOR® and the
// brokerage line; these regexes capture both the rendered glyph form and the
// raw text the build now ships if anything reintroduces it.
const LEGACY_ABOVE_FOLD = [
  // The compact one-line trust strip with FL License + city anchor.
  /REALTOR(?:®|&reg;|&#174;)\s*(?:·|·|&middot;|&#183;|\|)\s*LPT\s+Realty\s+LLC\s*(?:·|·|&middot;|&#183;|\|)\s*FL\s+License\s+#?\s*SL\s*3405877\s*(?:·|·|&middot;|&#183;|\|)\s*Fort\s+Lauderdale-based/i,
  // Looser fallback — the brokerage + license + city anchor in any order on a
  // single line. Catches reformulations that still violate the contract.
  /Fort\s+Lauderdale-based.*?SL\s*3405877|SL\s*3405877.*?Fort\s+Lauderdale-based/is,
] as const;

const FORBIDDEN_TESTID = /data-testid=["']trust-row["']/;

// Scan every emitted route HTML in out/, not just a fixed subset. The walk
// guards against new routes being added without coverage.
async function* walkHtml(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(path);
    else if (entry.isFile() && entry.name === "index.html") yield path;
  }
}

function indexOfMain(html: string): number {
  const m = html.match(/<main\b/);
  return m && typeof m.index === "number" ? m.index : -1;
}

type Finding = { source: string; ok: boolean; reasons: string[] };

async function scanHtmlRoute(path: string): Promise<Finding> {
  const reasons: string[] = [];
  const html = await readFile(path, "utf8");
  const mainIdx = indexOfMain(html);
  if (mainIdx === -1) {
    // No <main> means we can't reason about above-fold position; treat as a
    // hard fail so the audit doesn't silently miss a malformed page.
    reasons.push("no <main> in HTML — cannot verify above-fold absence");
  } else {
    const aboveFold = html.slice(0, mainIdx);
    for (const re of LEGACY_ABOVE_FOLD) {
      const m = re.exec(aboveFold);
      if (m) {
        reasons.push(`legacy trust-row string present above <main>: "${m[0].slice(0, 80)}…"`);
      }
    }
    if (FORBIDDEN_TESTID.test(aboveFold)) {
      reasons.push('forbidden data-testid="trust-row" present above <main>');
    }
  }
  const rel = path.replace(`${ROOT}/`, "");
  return { source: rel, ok: reasons.length === 0, reasons };
}

async function scanPdfText(): Promise<Finding[]> {
  // Lazy-load pdfjs-dist so the audit runs even if the dep isn't installed
  // (returns a single "deps missing" finding instead of crashing).
  let getDocument: typeof import("pdfjs-dist/legacy/build/pdf.mjs")["getDocument"];
  try {
    ({ getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs"));
  } catch {
    return [
      {
        source: "pdf-text-extract",
        ok: false,
        reasons: ["pdfjs-dist not installed — run 'bun add pdfjs-dist' to enable PDF text checks"],
      },
    ];
  }
  if (!existsSync(PUBLIC_DOWNLOADS)) {
    return [{ source: "public/downloads", ok: true, reasons: [] }];
  }
  const files = (await readdir(PUBLIC_DOWNLOADS)).filter((f) => f.endsWith(".pdf"));
  const findings: Finding[] = [];
  for (const f of files) {
    const reasons: string[] = [];
    const path = join(PUBLIC_DOWNLOADS, f);
    const data = new Uint8Array(await readFile(path));
    const doc = await getDocument({ data, useSystemFonts: true }).promise;
    let allText = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allText += content.items.map((it: any) => it.str).join(" ") + " ";
    }
    for (const re of LEGACY_ABOVE_FOLD) {
      const m = re.exec(allText);
      if (m) {
        reasons.push(`PDF text contains legacy trust-row string: "${m[0].slice(0, 80)}…"`);
      }
    }
    findings.push({ source: `public/downloads/${f}`, ok: reasons.length === 0, reasons });
  }
  return findings;
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("✗ out/ missing — run 'bun run build' first.");
    process.exit(2);
  }
  const htmlFindings: Finding[] = [];
  for await (const path of walkHtml(OUT)) {
    htmlFindings.push(await scanHtmlRoute(path));
  }
  const pdfFindings = await scanPdfText();
  const all = [...htmlFindings, ...pdfFindings];
  let bad = 0;
  for (const r of all) {
    if (r.ok) {
      console.log(`✓ ${r.source}`);
    } else {
      bad++;
      console.error(`✗ ${r.source}`);
      for (const reason of r.reasons) console.error(`   ${reason}`);
    }
  }
  console.log(`audit-trust-row — ${all.length - bad}/${all.length} sources clean (HTML routes + PDFs)`);
  if (bad > 0) process.exit(1);
}

main().catch((err) => {
  console.error("audit-trust-row crashed:", err);
  process.exit(1);
});
