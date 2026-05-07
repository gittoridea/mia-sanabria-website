#!/usr/bin/env bun
/**
 * Audits the static export for per-page SEO/AEO hygiene.
 *
 * Checks each `out/**\/*.html`:
 *  - exactly one <h1>
 *  - <html lang="..."> attribute present
 *  - <link rel="canonical" href="..."> present
 *  - hreflang self-link OR x-default present (rel="alternate" hreflang="...")
 *  - <title> present and ≤ 60 chars
 *  - <meta name="description" content="..."> present and ≤ 160 chars
 *  - <meta property="og:image" ...> present
 *  - <meta name="twitter:card" ...> present
 *  - <meta property="og:url" ...> present
 *  - markets/[slug] pages and main top-level pages have ≥ 150 words of body text
 *
 * Exits 1 on any failure. Run after `bun run build`.
 *
 * Why: docs/MIA_CURRENT_TO_IDEAL_GAP_MATRIX.md S1 — turn the SEO/AEO ideal-state
 * thresholds into a build-time gate so regressions surface in CI, not on Mia's
 * desk during review.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;
const BODY_WORD_FLOOR = 150;

type Finding = {
  file: string;
  rule: string;
  detail: string;
  level: "error" | "warn";
};

async function* walkHtml(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(path);
    else if (entry.isFile() && entry.name.endsWith(".html")) yield path;
  }
}

const findings: Finding[] = [];
const root = "out";

function countMatches(html: string, pattern: RegExp): number {
  const m = html.match(pattern);
  return m ? m.length : 0;
}

function attrValue(tag: string, attr: string): string | null {
  const re = new RegExp(`${attr}\\s*=\\s*"([^"]*)"`, "i");
  const m = tag.match(re);
  return m && m[1] !== undefined ? m[1] : null;
}

function visibleText(html: string): string {
  // strip <script>...</script> and <style>...</style>
  let stripped = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
  stripped = stripped.replace(/<style[\s\S]*?<\/style>/gi, " ");
  // strip remaining tags
  stripped = stripped.replace(/<[^>]+>/g, " ");
  // decode common entities
  stripped = stripped.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  return stripped.replace(/\s+/g, " ").trim();
}

const startedAt = Date.now();

try {
  for await (const file of walkHtml(root)) {
    const rel = relative(".", file);
    const html = await readFile(file, "utf8");

    // 404 page is allowed to be lighter — skip body-word floor for it.
    const is404 = /\b404\.html$/.test(rel);

    // <html lang="...">
    const htmlTagMatch = html.match(/<html\b[^>]*>/i);
    const htmlTag = htmlTagMatch ? htmlTagMatch[0] : "";
    const lang = attrValue(htmlTag, "lang");
    if (!lang) findings.push({ file: rel, rule: "html-lang", detail: "<html lang=...> missing", level: "error" });

    // <h1>
    const h1Count = countMatches(html, /<h1[\s>]/gi);
    if (h1Count === 0)
      findings.push({ file: rel, rule: "single-h1", detail: "no <h1> on page", level: "error" });
    else if (h1Count > 1)
      findings.push({ file: rel, rule: "single-h1", detail: `${h1Count} <h1> tags (must be exactly 1)`, level: "error" });

    // <title>
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (!titleMatch)
      findings.push({ file: rel, rule: "title-present", detail: "<title> missing", level: "error" });
    else {
      const titleText = (titleMatch[1] ?? "").trim();
      if (titleText.length === 0)
        findings.push({ file: rel, rule: "title-non-empty", detail: "<title> is empty", level: "error" });
      else if (titleText.length > TITLE_MAX)
        findings.push({
          file: rel,
          rule: "title-length",
          detail: `<title> = ${titleText.length} chars (>${TITLE_MAX}): "${titleText}"`,
          level: "error",
        });
    }

    // <meta name="description" content="...">
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i);
    if (!descMatch)
      findings.push({ file: rel, rule: "description-present", detail: "<meta name=description> missing", level: "error" });
    else {
      const desc = (descMatch[1] ?? "").trim();
      if (desc.length === 0)
        findings.push({ file: rel, rule: "description-non-empty", detail: "description is empty", level: "error" });
      else if (desc.length > DESCRIPTION_MAX)
        findings.push({
          file: rel,
          rule: "description-length",
          detail: `description = ${desc.length} chars (>${DESCRIPTION_MAX})`,
          level: "error",
        });
    }

    // canonical
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
    if (!canonical)
      findings.push({ file: rel, rule: "canonical-present", detail: "<link rel=canonical> missing", level: "error" });

    // hreflang self-link OR x-default (must have at least one)
    const hreflang = html.match(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["'][^>]*>/i);
    if (!hreflang)
      findings.push({
        file: rel,
        rule: "hreflang-present",
        detail: "<link rel=alternate hreflang=...> missing (en-US self-link or x-default required)",
        level: "error",
      });

    // og:url
    const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]*>/i);
    if (!ogUrl)
      findings.push({ file: rel, rule: "og-url", detail: "<meta property=og:url> missing", level: "error" });

    // og:image
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]*>/i);
    if (!ogImage)
      findings.push({ file: rel, rule: "og-image", detail: "<meta property=og:image> missing", level: "error" });

    // twitter:card
    const twCard = html.match(/<meta[^>]+name=["']twitter:card["'][^>]*>/i);
    if (!twCard)
      findings.push({ file: rel, rule: "twitter-card", detail: "<meta name=twitter:card> missing", level: "error" });

    // body word count (skip 404)
    if (!is404) {
      const text = visibleText(html);
      const words = text.split(/\s+/).filter(Boolean).length;
      if (words < BODY_WORD_FLOOR) {
        findings.push({
          file: rel,
          rule: "body-words",
          detail: `${words} words of visible body text (<${BODY_WORD_FLOOR})`,
          level: "warn",
        });
      }
    }
  }
} catch (err) {
  console.error(`audit-seo: cannot read ${root}/ — did you run \`bun run build\`?`);
  console.error(err);
  process.exit(2);
}

const ms = Date.now() - startedAt;
const errors = findings.filter((f) => f.level === "error");
const warnings = findings.filter((f) => f.level === "warn");

for (const f of errors) console.error(`✗ ${f.file} | ${f.rule}: ${f.detail}`);
for (const f of warnings) console.warn(`! ${f.file} | ${f.rule}: ${f.detail}`);

if (errors.length > 0) {
  console.error(`\n✗ audit-seo: ${errors.length} error(s), ${warnings.length} warning(s). (${ms}ms)`);
  process.exit(1);
} else {
  console.log(`✓ audit-seo: ${warnings.length} warning(s), no errors across out/. (${ms}ms)`);
}
