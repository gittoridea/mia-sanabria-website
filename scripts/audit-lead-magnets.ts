#!/usr/bin/env bun
/**
 * Cycle 19B-FL-R1 — audit-lead-magnets (rewritten).
 *
 * The Cycle 19B-FL version only verified PDF byte-size + HTML-source string
 * presence (`out/downloads/{slug}/index.html`). It missed the actual failure
 * class: site-shell content bleeding into the PDF (skip link, header, nav,
 * trust row, site footer, duplicated logo marks, Privacy/Terms/Accessibility/
 * DMCA links). Full evidence: `docs/CYCLE_19B_FL_R1_PDF_FAILURE_ANALYSIS.md`.
 *
 * This rewrite uses `pdfjs-dist` to extract text from each PDF page-by-page
 * and FAILs the build on forbidden phrases and on missing required substrings.
 * It also asserts a sane page count and PDF byte-size floor.
 *
 * Exit codes:
 *   0 — every magnet PDF clean against forbidden and required checks
 *   1 — at least one magnet artifact / forbidden / required check failed
 *   2 — public/downloads/ missing (run `bun run build:pdfs` first)
 */
import { readFile, stat, readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { LEAD_MAGNETS, PDF_DISCLAIMER, PDF_USE_AGREEMENT } from "../src/data/lead-magnets/index";

const ROOT = resolve(import.meta.dirname, "..");
const PUBLIC_DOWNLOADS = join(ROOT, "public", "downloads");
const OUT = join(ROOT, "out");
const FL_HTML = join(OUT, "markets", "fort-lauderdale", "index.html");
const RENDER_DIR = join(ROOT, "docs", "artifacts", "cycle-19b-fl-r1", "pdf-renders", "after");
const STRICT_PNG = process.env["STRICT_PNG"] === "1";
const MIN_PDF_BYTES = 5_000;
const MIN_PAGES = 2;
const MAX_PAGES = 10;

type Finding = { source: string; ok: boolean; reasons: string[]; warnings?: string[] };

/* ─────────────────────────────────────────────────────────────────────────
 * Forbidden phrases (text-extract).
 *
 * Each entry: a regex that, if matched against the joined-page text, fails
 * the audit. The legacy trust-row string is tolerant of single-glyph variance
 * across renderers. The `off-market` rule is hedged: it only fails when the
 * substring appears WITHOUT one of the approved hedges within 60 chars
 * before/after.
 * ────────────────────────────────────────────────────────────────────────*/
type Forbidden = { label: string; re: RegExp; reason: string; hedge?: RegExp };

const FORBIDDEN: ReadonlyArray<Forbidden> = [
  { label: "skip-link", re: /Skip\s+to\s+main\s+content/i, reason: "PDF contains skip link from site shell" },
  { label: "site-footer-marker", re: /\bSite\s+footer\b/i, reason: 'PDF contains the literal "Site footer" marker' },
  {
    label: "nav-strip",
    re: /Home\s+Markets\s+Buyers\s+Sellers/i,
    reason: "PDF contains site nav text",
  },
  { label: "footer-privacy", re: /Privacy\s+Policy/i, reason: "PDF contains footer link: Privacy Policy" },
  { label: "footer-terms", re: /Terms\s+of\s+Service/i, reason: "PDF contains footer link: Terms of Service" },
  {
    label: "footer-accessibility-dmca",
    re: /Accessibility\s+DMCA/i,
    reason: "PDF contains the Accessibility/DMCA footer link pair",
  },
  {
    label: "duplicate-lpt-realty",
    re: /LPT\s*Realty\s*LPT\s*Realty/i,
    reason: 'PDF contains the duplicate "LPT Realty LPT Realty" footer-mark text',
  },
  {
    label: "duplicate-realtor",
    re: /REALTOR(?:®|&reg;)\s*REALTOR(?:®|&reg;)/i,
    reason: 'PDF contains the duplicate "REALTOR® REALTOR®" footer-mark text',
  },
  {
    label: "duplicate-eho",
    re: /Equal\s+Housing\s+Opportunity\s+Equal\s+Housing\s+Opportunity/i,
    reason: 'PDF contains the duplicate "Equal Housing Opportunity Equal Housing Opportunity" footer-mark text',
  },
  {
    label: "legacy-trust-row",
    re: /REALTOR(?:®|&reg;)\s*(?:·|·)\s*LPT\s+Realty\s+LLC\s*(?:·|·)\s*FL\s+License\s+#?\s*SL\s*3405877\s*(?:·|·)\s*Fort\s+Lauderdale-based/i,
    reason: "PDF contains the legacy above-fold trust-row string",
  },
  {
    label: "same-business-day",
    re: /same[\s-]business[\s-]day|within\s+the\s+same\s+business\s+day/i,
    reason: 'PDF contains a banned "same-business-day" response-time claim',
  },
  {
    label: "off-market-unhedged",
    re: /off-market/i,
    reason: 'PDF contains "off-market" without an approved hedge (private inquiries / pre-market / brokerage-relationship)',
    hedge: /private\s+inquiries|pre-market|brokerage-relationship/i,
  },
  {
    label: "mias-own-engagements",
    re: /Mia(?:'s|’s)?\s+own\s+engagements/i,
    reason: 'PDF contains banned phrase "Mia\'s own engagements" (use "structure private buyer/seller conversations" hedge instead)',
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * Required substrings (per slug). Each magnet PDF must contain:
 *   - its title verbatim,
 *   - distinctive prefix of PDF_DISCLAIMER,
 *   - distinctive prefix of PDF_USE_AGREEMENT,
 *   - the brokerage/license footer marker `FL Sales Associate License #SL3405877`,
 *   - a source-ledger anchor `Broward County Property Appraiser`.
 * ────────────────────────────────────────────────────────────────────────*/
function distinctivePrefix(s: string): string {
  return s.slice(0, 80);
}

const REQUIRED_FOR_ALL: ReadonlyArray<{ label: string; needle: string }> = [
  { label: "disclaimer", needle: distinctivePrefix(PDF_DISCLAIMER) },
  { label: "use-agreement", needle: distinctivePrefix(PDF_USE_AGREEMENT) },
  { label: "brokerage-license-footer", needle: "FL Sales Associate License #SL3405877" },
  { label: "source-ledger-anchor", needle: "Broward County Property Appraiser" },
];

/* ─────────────────────────────────────────────────────────────────────────
 * pdfjs text extraction.
 * ────────────────────────────────────────────────────────────────────────*/

async function extractPdfText(path: string): Promise<{ text: string; pages: number }> {
  // Lazy-load pdfjs-dist so the audit can run even without it (returns a
  // single dependency-missing finding instead of crashing).
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(await readFile(path));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  let allText = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allText += content.items.map((it: any) => it.str).join(" ") + " ";
  }
  return { text: allText, pages: doc.numPages };
}

/* ─────────────────────────────────────────────────────────────────────────
 * Page-1 PNG render (best-effort; non-blocking unless STRICT_PNG=1).
 *
 * pdfjs-dist canvas-rendering in Node requires a canvas backend
 * (@napi-rs/canvas or node-canvas). We do not require the dep; if it's not
 * installed we record a non-blocking warning. The PDF text-extract checks
 * above are the deterministic gate.
 * ────────────────────────────────────────────────────────────────────────*/
async function renderPage1Png(slug: string, pdfPath: string): Promise<{ ok: boolean; reason?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createCanvas: any;
  try {
    // @ts-ignore — optional dependency, not required at typecheck time
    const mod = await import("@napi-rs/canvas");
    createCanvas = mod.createCanvas;
  } catch {
    return { ok: false, reason: "page-render skipped — @napi-rs/canvas not installed" };
  }
  try {
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const data = new Uint8Array(await readFile(pdfPath));
    const doc = await getDocument({ data, useSystemFonts: true }).promise;
    const dir = join(RENDER_DIR, slug);
    await mkdir(dir, { recursive: true });
    const maxPages = Math.min(2, doc.numPages);
    for (let i = 1; i <= maxPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext("2d");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await page.render({ canvasContext: ctx as any, viewport } as any).promise;
      const buf = canvas.toBuffer("image/png");
      await writeFile(join(dir, `page-${i}.png`), buf);
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: `canvas render failed: ${(e as Error).message.slice(0, 200)}` };
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * Per-magnet check.
 * ────────────────────────────────────────────────────────────────────────*/

async function checkMagnetPdf(slug: string, title: string): Promise<Finding> {
  const reasons: string[] = [];
  const warnings: string[] = [];
  const pdfPath = join(PUBLIC_DOWNLOADS, `${slug}.pdf`);

  if (!existsSync(pdfPath)) {
    return {
      source: `public/downloads/${slug}.pdf`,
      ok: false,
      reasons: [`PDF artifact missing: public/downloads/${slug}.pdf`],
    };
  }
  const size = (await stat(pdfPath)).size;
  if (size < MIN_PDF_BYTES) {
    reasons.push(`PDF too small (${size} bytes — expected ≥${MIN_PDF_BYTES})`);
  }

  let text = "";
  let pages = 0;
  try {
    const r = await extractPdfText(pdfPath);
    text = r.text;
    pages = r.pages;
  } catch (e) {
    reasons.push(`pdfjs-dist extract failed: ${(e as Error).message.slice(0, 200)}`);
    return { source: `public/downloads/${slug}.pdf`, ok: false, reasons, warnings };
  }

  if (pages < MIN_PAGES || pages > MAX_PAGES) {
    reasons.push(`page count ${pages} outside expected [${MIN_PAGES}, ${MAX_PAGES}]`);
  }

  // Required substrings.
  if (!text.includes(title)) {
    reasons.push(`PDF text missing magnet title: "${title}"`);
  }
  for (const { label, needle } of REQUIRED_FOR_ALL) {
    if (!text.includes(needle)) {
      reasons.push(`PDF text missing required ${label}: "${needle.slice(0, 40)}…"`);
    }
  }

  // Forbidden phrases (with hedge support).
  for (const f of FORBIDDEN) {
    const m = f.re.exec(text);
    if (!m) continue;
    if (f.hedge) {
      const idx = m.index ?? 0;
      const window = text.slice(Math.max(0, idx - 60), idx + (m[0]?.length ?? 0) + 60);
      if (f.hedge.test(window)) {
        // Hedged occurrence — allowed.
        continue;
      }
    }
    reasons.push(`forbidden [${f.label}]: ${f.reason}`);
  }

  // Page-1 PNG render (best-effort).
  const png = await renderPage1Png(slug, pdfPath);
  if (!png.ok) {
    if (STRICT_PNG) {
      reasons.push(`PNG render failed (STRICT_PNG=1): ${png.reason ?? "unknown"}`);
    } else {
      warnings.push(png.reason ?? "PNG render skipped");
    }
  }

  return { source: `public/downloads/${slug}.pdf`, ok: reasons.length === 0, reasons, warnings };
}

/* ─────────────────────────────────────────────────────────────────────────
 * FL-page CTA check — kept from the prior audit so we don't regress the
 * download CTAs on the Fort Lauderdale market page.
 * ────────────────────────────────────────────────────────────────────────*/
async function checkFortLauderdaleCtas(): Promise<Finding> {
  const reasons: string[] = [];
  if (!existsSync(FL_HTML)) {
    return { source: "out/markets/fort-lauderdale/index.html", ok: false, reasons: ["FL page HTML missing in out/ — run `bun run build` first"] };
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
  return { source: "fort-lauderdale-cta-section", ok: reasons.length === 0, reasons };
}

/* ─────────────────────────────────────────────────────────────────────────
 * Main.
 * ────────────────────────────────────────────────────────────────────────*/
async function main() {
  if (!existsSync(PUBLIC_DOWNLOADS) || (await readdir(PUBLIC_DOWNLOADS)).filter((f) => f.endsWith(".pdf")).length === 0) {
    console.error("✗ public/downloads/ missing or empty — run `bun run build:pdfs` first.");
    process.exit(2);
  }
  const findings: Finding[] = [];
  for (const m of LEAD_MAGNETS) {
    findings.push(await checkMagnetPdf(m.slug, m.title));
  }
  findings.push(await checkFortLauderdaleCtas());

  let bad = 0;
  for (const f of findings) {
    if (f.ok) {
      console.log(`✓ ${f.source}`);
      for (const w of f.warnings ?? []) console.log(`   warning: ${w}`);
    } else {
      bad++;
      console.error(`✗ ${f.source}`);
      for (const r of f.reasons) console.error(`   ${r}`);
      for (const w of f.warnings ?? []) console.error(`   warning: ${w}`);
    }
  }
  console.log(`audit-lead-magnets — ${findings.length - bad}/${findings.length} checks pass`);
  if (bad > 0) process.exit(1);
}

main().catch((err) => {
  console.error("audit-lead-magnets crashed:", err);
  process.exit(1);
});
