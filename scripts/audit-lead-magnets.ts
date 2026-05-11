#!/usr/bin/env bun
/**
 * Cycle 19B-FL — audit-lead-magnets.
 *
 * Verifies the three Cycle 19B-FL lead-magnet artifacts:
 *   1. PDF files exist at `out/downloads/{slug}.pdf` and `public/downloads/{slug}.pdf`
 *   2. Each PDF is ≥10 KB (sanity bound — a real, branded PDF, not an empty stub)
 *   3. The rendered HTML source (`out/downloads/{slug}/index.html`) contains
 *      both the disclaimer and the use-agreement strings (Cato F4 reinforcement —
 *      audits scan rendered HTML, not source TS).
 *   4. The Fort Lauderdale market page exposes at least one download CTA per
 *      slug (the section 6.5 "Waterfront diligence snapshot" module).
 *
 * Honesty contract: this audit does NOT verify the PDF visually — that's the
 * screenshot/external-review channel. It verifies presence + sane size +
 * required honesty strings in the HTML the PDF was rendered from.
 *
 * Exit codes:
 *   0 — every magnet ok
 *   1 — at least one magnet artifact / CTA / disclaimer missing
 *   2 — `out/` missing
 */
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { LEAD_MAGNETS, PDF_DISCLAIMER, PDF_USE_AGREEMENT } from "../src/data/lead-magnets/index";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "out");
const PUBLIC_DOWNLOADS = join(ROOT, "public", "downloads");
const FL_HTML = join(OUT, "markets", "fort-lauderdale", "index.html");

type Finding = { slug: string; ok: boolean; reasons: string[] };

// Truncate the long disclaimer/agreement texts to the first 80 characters for
// the substring check — Next.js HTML-escapes some entities differently across
// runs so we only need a stable distinctive prefix.
function distinctivePrefix(s: string): string {
  return s.slice(0, 80);
}

async function checkMagnet(slug: string): Promise<Finding> {
  const reasons: string[] = [];
  const outPdf = join(OUT, "downloads", `${slug}.pdf`);
  const publicPdf = join(PUBLIC_DOWNLOADS, `${slug}.pdf`);
  const htmlPath = join(OUT, "downloads", slug, "index.html");

  if (!existsSync(outPdf)) {
    reasons.push(`PDF artifact missing: out/downloads/${slug}.pdf`);
  } else {
    const size = (await stat(outPdf)).size;
    if (size < 10_000) reasons.push(`PDF too small (${size} bytes — expected ≥10 KB)`);
  }
  if (!existsSync(publicPdf)) {
    reasons.push(`PDF artifact missing in public/: public/downloads/${slug}.pdf`);
  }
  if (!existsSync(htmlPath)) {
    reasons.push(`HTML source missing: out/downloads/${slug}/index.html`);
  } else {
    const html = await readFile(htmlPath, "utf8");
    if (!html.includes(distinctivePrefix(PDF_DISCLAIMER))) {
      reasons.push("HTML source missing disclaimer block (PDF_DISCLAIMER)");
    }
    if (!html.includes(distinctivePrefix(PDF_USE_AGREEMENT))) {
      reasons.push("HTML source missing use-agreement block (PDF_USE_AGREEMENT)");
    }
    if (!html.includes("FL License #SL3405877")) {
      reasons.push("HTML source missing brokerage license #SL3405877");
    }
    if (!html.includes("LPT Realty LLC")) {
      reasons.push("HTML source missing brokerage legal name");
    }
  }
  return { slug, ok: reasons.length === 0, reasons };
}

async function checkFortLauderdaleCtas(): Promise<Finding> {
  const reasons: string[] = [];
  if (!existsSync(FL_HTML)) {
    return { slug: "fort-lauderdale-cta-section", ok: false, reasons: ["FL page HTML missing in out/"] };
  }
  const html = await readFile(FL_HTML, "utf8");
  if (!/id="waterfront-diligence-snapshot"/.test(html)) {
    reasons.push("FL page missing #waterfront-diligence-snapshot section anchor");
  }
  for (const magnet of LEAD_MAGNETS) {
    if (!html.includes(`/downloads/${magnet.slug}.pdf`)) {
      reasons.push(`FL page missing download CTA for /downloads/${magnet.slug}.pdf`);
    }
  }
  return { slug: "fort-lauderdale-cta-section", ok: reasons.length === 0, reasons };
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("✗ out/ missing — run 'bun run build' first.");
    process.exit(2);
  }
  const findings: Finding[] = [];
  for (const m of LEAD_MAGNETS) {
    const f = await checkMagnet(m.slug);
    findings.push(f);
  }
  findings.push(await checkFortLauderdaleCtas());
  let bad = 0;
  for (const f of findings) {
    if (f.ok) {
      console.log(`✓ ${f.slug}`);
    } else {
      bad++;
      console.error(`✗ ${f.slug}`);
      for (const r of f.reasons) console.error(`   ${r}`);
    }
  }
  console.log(`audit-lead-magnets — ${findings.length - bad}/${findings.length} checks pass`);
  if (bad > 0) process.exit(1);
}

main().catch((err) => {
  console.error("audit-lead-magnets crashed:", err);
  process.exit(1);
});
