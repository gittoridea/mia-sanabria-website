#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import {
  LEAD_MAGNETS,
  PDF_DISCLAIMER,
  PDF_USE_AGREEMENT,
  type LeadMagnet,
  type LeadMagnetSection,
  type LedgerSource,
} from "../src/data/lead-magnets/index";

const SITE_URL = "https://miasanabriarealtor.trueidea.com" as const;
const ROOT = resolve(process.cwd());
const TMP_DIR = join(ROOT, ".tmp", "lead-magnets");
const PUBLIC_DOWNLOADS = join(ROOT, "public", "downloads");
const OUT_DOWNLOADS = join(ROOT, "out", "downloads");
const CHROME_BIN = process.env["CHROME_BIN"] ?? "google-chrome";
const CHROME_TIMEOUT_MS = 60_000;
const MIN_PDF_BYTES = 10_000;
const ISSUED_DATE = new Date().toISOString().slice(0, 10);
const PDF_FOOTER =
  "Mia Sanabria · REALTOR® · LPT Realty LLC · FL Sales Associate License #SL3405877 · Fort Lauderdale, FL · miasanabriarealtor.trueidea.com";

type RenderTarget = "public" | "out";

type RenderResult = {
  readonly slug: string;
  readonly ok: boolean;
  readonly publicBytes?: number;
  readonly outBytes?: number;
  readonly warnings: ReadonlyArray<string>;
  readonly reason?: string;
};

type ChromeResult = {
  readonly code: number;
  readonly stderr: string;
  readonly timedOut: boolean;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function absoluteSiteHref(href: string): string {
  if (href.startsWith("/")) {
    return `${SITE_URL}${href}`;
  }
  return `${SITE_URL}/${href}`;
}

function buildStyleBlock(): string {
  return `<style>
@page { size: Letter; margin: 0.75in; }
* { box-sizing: border-box; }
html { background: #FFFFFF; color: #3E4A60; }
body {
  margin: 0;
  background: #FFFFFF;
  color: #3E4A60;
  font-family: "Montserrat", system-ui, -apple-system, "Helvetica", "Arial", sans-serif;
  font-size: 11pt;
  line-height: 1.55;
}
a { color: inherit; }
.document { padding-bottom: 0.45in; }
.cover {
  border: 1px solid #D8D2C4;
  background: #FBF8F2;
  padding: 30px 32px 24px;
  margin: 0 0 28px;
  break-inside: avoid;
}
.micro-strap {
  color: #B68F4F;
  font-size: 8.5pt;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 12px;
}
h1 {
  color: #13243B;
  font-family: "Cinzel", "Times New Roman", "Georgia", serif;
  font-size: 28pt;
  font-weight: 700;
  line-height: 1.08;
  margin: 0 0 10px;
}
.subtitle {
  color: #3E4A60;
  font-size: 13pt;
  line-height: 1.4;
  margin: 0 0 22px;
}
.meta-grid {
  border-top: 1px solid #D8D2C4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  padding-top: 14px;
  color: #13243B;
  font-size: 9.5pt;
}
.intro {
  color: #13243B;
  font-size: 12pt;
  margin: 0 0 24px;
}
.section {
  margin: 0 0 22px;
  break-inside: avoid;
}
.section-title {
  color: #13243B;
  font-family: "Cinzel", "Times New Roman", "Georgia", serif;
  font-size: 16pt;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 12px;
}
.section-title::after {
  content: "";
  display: block;
  width: 36px;
  border-bottom: 1px solid #B68F4F;
  margin-top: 8px;
}
.section-sub,
.paragraph {
  margin: 0 0 10px;
}
.checklist,
.bullet-list,
.ledger-list {
  margin: 0;
  padding: 0;
}
.checklist { list-style: none; }
.bullet-list { list-style: disc; padding-left: 20px; }
.ledger-list { list-style: none; }
.checklist li,
.bullet-list li,
.ledger-list li {
  margin: 0 0 8px;
}
.checklist li::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #13243B;
  background: #FBF8F2;
  vertical-align: middle;
  margin-right: 8px;
}
.notes-list {
  display: grid;
  gap: 13px;
}
.note-line {
  color: #13243B;
  white-space: nowrap;
}
.note-blank {
  display: inline-block;
  border-bottom: 1px solid #D8D2C4;
  min-width: 4.2in;
  transform: translateY(-2px);
}
.blank-note {
  border: 0;
  border-top: 1px dotted #D8D2C4;
  margin: 24px 0;
}
.next-step {
  border: 1px solid #B68F4F;
  background: #FBF8F2;
  padding: 18px 20px;
}
.cta-link {
  display: inline-block;
  border: 1px solid #B68F4F;
  color: #13243B;
  font-weight: 700;
  padding: 9px 13px;
  text-decoration: none;
}
.ledger-list {
  border-top: 1px solid #D8D2C4;
  padding-top: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 8.8pt;
  overflow-wrap: anywhere;
}
.fine-print {
  color: #3E4A60;
  font-size: 9.5pt;
  font-style: italic;
  margin: 0;
}
.page-footer { display: none; }
@media print {
  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .page-footer {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #B68F4F;
    color: #3E4A60;
    background: #FFFFFF;
    font-size: 8.5pt;
    line-height: 1.25;
    text-align: center;
    padding-top: 6px;
  }
}
</style>`;
}

function buildCoverBlock(magnet: LeadMagnet): string {
  return `<header class="cover">
  <div class="micro-strap">MIA SANABRIA · REALTOR® · LPT REALTY</div>
  <h1>${escapeHtml(magnet.title)}</h1>
  <p class="subtitle">${escapeHtml(magnet.subtitle)}</p>
  <div class="meta-grid">
    <div>${escapeHtml(`Prepared by Mia Sanabria · (954) 540-0358 · Issued ${ISSUED_DATE}`)}</div>
    <div>${escapeHtml("FL Sales Associate License #SL3405877 · Fort Lauderdale, FL")}</div>
  </div>
</header>`;
}

function buildParagraphSection(title: string, body: string): string {
  return `<section class="section">
  <h2 class="section-title">${escapeHtml(title)}</h2>
  <p class="paragraph">${escapeHtml(body)}</p>
</section>`;
}

function buildChecklistSection(title: string, items: ReadonlyArray<string>, sub?: string): string {
  const subHtml = sub ? `<p class="section-sub">${escapeHtml(sub)}</p>` : "";
  return `<section class="section">
  <h2 class="section-title">${escapeHtml(title)}</h2>
  ${subHtml}
  <ul class="checklist">
    ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n    ")}
  </ul>
</section>`;
}

function buildExistingSection(section: LeadMagnetSection): string {
  return buildChecklistSection(section.heading, section.items, section.sub);
}

function buildBulletSection(title: string, items: ReadonlyArray<string>): string {
  return `<section class="section">
  <h2 class="section-title">${escapeHtml(title)}</h2>
  <ul class="bullet-list">
    ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n    ")}
  </ul>
</section>`;
}

function buildNotesSection(notes: ReadonlyArray<string> | undefined): string {
  if (notes && notes.length > 0) {
    return `<section class="section">
  <h2 class="section-title">Notes</h2>
  <div class="notes-list">
    ${notes
      .map((note) => `<div class="note-line">${escapeHtml(note)} <span class="note-blank"></span></div>`)
      .join("\n    ")}
  </div>
</section>`;
  }
  return `<section class="section">
  <h2 class="section-title">Notes</h2>
  <hr class="blank-note">
  <hr class="blank-note">
  <hr class="blank-note">
  <hr class="blank-note">
  <hr class="blank-note">
  <hr class="blank-note">
</section>`;
}

function buildNextStepBlock(magnet: LeadMagnet): string {
  const href = absoluteSiteHref(magnet.nextStep.href);
  return `<section class="section next-step">
  <h2 class="section-title">Next step</h2>
  <p class="paragraph">${escapeHtml(magnet.nextStep.label)}</p>
  <a class="cta-link" href="${escapeHtml(href)}">${escapeHtml(href)}</a>
</section>`;
}

function buildLedgerRow(source: LedgerSource): string {
  const base = source.url ? `${source.label} — ${source.url}` : source.label;
  const withNote = source.note ? `${base} — ${source.note}` : base;
  return `<li>${escapeHtml(withNote)}</li>`;
}

function buildLedgerBlock(ledger: ReadonlyArray<LedgerSource>): string {
  return `<section class="section">
  <h2 class="section-title">Source ledger</h2>
  <ul class="ledger-list">
    ${ledger.map((source) => buildLedgerRow(source)).join("\n    ")}
  </ul>
</section>`;
}

function buildFinePrintBlock(title: string, body: string): string {
  return `<section class="section">
  <h2 class="section-title">${escapeHtml(title)}</h2>
  <p class="fine-print">${escapeHtml(body)}</p>
</section>`;
}

function buildBodyBlocks(magnet: LeadMagnet): string {
  const blocks: string[] = [
    buildCoverBlock(magnet),
    `<p class="intro">${escapeHtml(magnet.intro)}</p>`,
  ];

  if (magnet.whoFor) {
    blocks.push(buildParagraphSection("Who this is for", magnet.whoFor));
  } else {
    // Optional enrichment: no section is rendered when absent.
  }

  if (magnet.howToUse) {
    blocks.push(buildParagraphSection("How to use this document", magnet.howToUse));
  } else {
    // Optional enrichment: no section is rendered when absent.
  }

  for (const section of magnet.sections) {
    blocks.push(buildExistingSection(section));
  }

  if (magnet.documentsToRequest && magnet.documentsToRequest.length > 0) {
    blocks.push(buildChecklistSection("Documents to request", magnet.documentsToRequest));
  } else {
    // Optional enrichment: no section is rendered when absent.
  }

  if (magnet.specialists && magnet.specialists.length > 0) {
    blocks.push(buildBulletSection("Specialists to involve", magnet.specialists));
  } else {
    // Optional enrichment: no section is rendered when absent.
  }

  if (magnet.redFlags && magnet.redFlags.length > 0) {
    blocks.push(buildBulletSection("Red flags / questions to ask", magnet.redFlags));
  } else {
    // Optional enrichment: no section is rendered when absent.
  }

  blocks.push(buildNotesSection(magnet.notes));
  blocks.push(buildNextStepBlock(magnet));
  blocks.push(buildLedgerBlock(magnet.ledger));
  blocks.push(buildFinePrintBlock("Disclaimer", PDF_DISCLAIMER));
  blocks.push(buildFinePrintBlock("Use agreement", PDF_USE_AGREEMENT));

  return blocks.join("\n\n");
}

function buildStandaloneHtml(magnet: LeadMagnet): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(magnet.title)}</title>
  ${buildStyleBlock()}
</head>
<body>
  <div class="document">
${buildBodyBlocks(magnet)}
  </div>
  <div class="page-footer">${escapeHtml(PDF_FOOTER)}</div>
</body>
</html>`;
}

function validateStandaloneHtml(html: string, slug: string): ReadonlyArray<string> {
  const failures: string[] = [];
  const lower = html.toLowerCase();
  const forbiddenPhrases = [
    "skip to main content",
    "site footer",
    "home markets buyers sellers",
    "privacy policy",
    "terms of service",
    "dmca",
    "lpt realty lpt realty",
    "lpt realtylpt realty",
    "realtor® realtor®",
    "realtor®realtor®",
    "equal housing opportunity equal housing opportunity",
    "equal housing opportunityequal housing opportunity",
    "realtor® · lpt realty llc · fl license #sl3405877 · fort lauderdale-based",
    "same business day",
    "same-business-day",
    "mia&#39;s own engagements",
    "mia's own engagements",
  ] as const;

  for (const phrase of forbiddenPhrases) {
    if (lower.includes(phrase)) {
      failures.push(`standalone HTML for ${slug} contains forbidden phrase: ${phrase}`);
    } else {
      // Phrase is absent, which is the expected state.
    }
  }

  if (!html.includes("@page { size: Letter; margin: 0.75in; }")) {
    failures.push(`standalone HTML for ${slug} is missing required @page rule`);
  } else {
    // Required print page rule is present.
  }

  if ((html.match(/<style\b/g) ?? []).length !== 1 || (html.match(/<\/style>/g) ?? []).length !== 1) {
    failures.push(`standalone HTML for ${slug} must contain exactly one style block`);
  } else {
    // The document has one inline stylesheet.
  }

  if (/<link\s/i.test(html) || /<script\s[^>]*\bsrc=/i.test(html) || /\b(?:src|poster)=["']/i.test(html) || /url\(/i.test(html)) {
    failures.push(`standalone HTML for ${slug} contains an external resource reference`);
  } else {
    // No linked resources are present.
  }

  const hrefMatches = html.matchAll(/\bhref="([^"]*)"/g);
  for (const match of hrefMatches) {
    const href = match[1];
    if (!href) {
      failures.push(`standalone HTML for ${slug} has an empty href`);
    } else if (!href.startsWith(SITE_URL)) {
      failures.push(`standalone HTML for ${slug} has non-site href: ${href}`);
    } else {
      // Absolute site href is allowed.
    }
  }

  if (/<a\s+[^>]*href="\//i.test(html)) {
    failures.push(`standalone HTML for ${slug} contains a relative root href`);
  } else {
    // No file://-resolved root hrefs can be emitted.
  }

  return failures;
}

function runChrome(args: ReadonlyArray<string>): Promise<ChromeResult> {
  return new Promise((resolvePromise) => {
    const child = spawn(CHROME_BIN, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill("SIGKILL");
        resolvePromise({ code: -1, stderr, timedOut: true });
      } else {
        // The process already resolved before the timeout fired.
      }
    }, CHROME_TIMEOUT_MS);

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolvePromise({ code: -1, stderr: `${stderr}${String(error.message)}`, timedOut: false });
      } else {
        // A late child-process error after settlement is ignored.
      }
    });
    child.on("close", (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolvePromise({ code: code ?? -1, stderr, timedOut: false });
      } else {
        // A close event after timeout is expected after SIGKILL.
      }
    });
  });
}

async function printPdf(htmlPath: string, pdfPath: string): Promise<{ readonly ok: boolean; readonly bytes?: number; readonly reason?: string }> {
  await mkdir(dirname(pdfPath), { recursive: true });
  const args = [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-pdf-header-footer",
    "--disable-extensions",
    "--disable-background-networking",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=2000",
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).toString(),
  ] as const;
  const result = await runChrome(args);
  if (result.timedOut) {
    return { ok: false, reason: `chrome timed out after ${CHROME_TIMEOUT_MS / 1000}s` };
  }
  if (result.code !== 0) {
    return { ok: false, reason: `chrome exited ${result.code}: ${result.stderr.slice(0, 240)}` };
  }
  if (!existsSync(pdfPath)) {
    return { ok: false, reason: "chrome exited successfully but did not create the PDF" };
  }
  const bytes = (await stat(pdfPath)).size;
  if (bytes < MIN_PDF_BYTES) {
    return { ok: false, bytes, reason: `PDF too small (${bytes} bytes)` };
  }
  return { ok: true, bytes };
}

async function writeStandaloneHtml(magnet: LeadMagnet): Promise<string> {
  await mkdir(TMP_DIR, { recursive: true });
  const html = buildStandaloneHtml(magnet);
  const failures = validateStandaloneHtml(html, magnet.slug);
  if (failures.length > 0) {
    throw new Error(failures.join("; "));
  }
  const htmlPath = join(TMP_DIR, `${magnet.slug}.html`);
  await writeFile(htmlPath, html, "utf8");
  return htmlPath;
}

async function renderOne(magnet: LeadMagnet): Promise<RenderResult> {
  const warnings: string[] = [];
  const htmlPath = await writeStandaloneHtml(magnet);
  const publicPdf = join(PUBLIC_DOWNLOADS, `${magnet.slug}.pdf`);
  const publicResult = await printPdf(htmlPath, publicPdf);
  if (!publicResult.ok) {
    return { slug: magnet.slug, ok: false, warnings, reason: publicResult.reason ?? "public PDF render failed" };
  }

  const outPdf = join(OUT_DOWNLOADS, `${magnet.slug}.pdf`);
  let outBytes: number | undefined;
  const outResult = await printPdf(htmlPath, outPdf);
  if (outResult.ok) {
    outBytes = outResult.bytes;
  } else {
    warnings.push(`out/downloads best-effort skipped or failed: ${outResult.reason ?? "unknown failure"}`);
  }

  return {
    slug: magnet.slug,
    ok: true,
    publicBytes: publicResult.bytes,
    outBytes,
    warnings,
  };
}

async function main(): Promise<void> {
  await mkdir(PUBLIC_DOWNLOADS, { recursive: true });
  const results: RenderResult[] = [];

  console.log(`render-lead-magnets — standalone HTML + Chrome PDF for ${LEAD_MAGNETS.length} magnets`);
  for (const magnet of LEAD_MAGNETS) {
    process.stdout.write(`▶ ${magnet.slug} ... `);
    const result = await renderOne(magnet);
    results.push(result);
    if (result.ok) {
      const outSummary = result.outBytes ? `, out ${result.outBytes.toLocaleString()} bytes` : "";
      console.log(`public ${result.publicBytes?.toLocaleString() ?? "unknown"} bytes${outSummary}`);
      for (const warning of result.warnings) {
        console.warn(`   warning: ${warning}`);
      }
    } else {
      console.log(`FAIL — ${result.reason ?? "unknown failure"}`);
    }
  }

  const passed = results.filter((result) => result.ok).length;
  console.log(`render-lead-magnets — ${passed}/${results.length} PASS`);
  if (passed !== results.length) {
    process.exit(1);
  } else {
    // All canonical public PDFs rendered successfully.
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`render-lead-magnets crashed: ${message}`);
  process.exit(1);
});
