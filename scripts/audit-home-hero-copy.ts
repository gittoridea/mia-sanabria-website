#!/usr/bin/env bun
/**
 * audit-home-hero-copy — Cycle 42 (2026-05-17).
 *
 * Scoped audit: the homepage hero search-card helper paragraph must not
 * contain implementation-facing or awkward language. The audit scans
 * exactly three surfaces:
 *
 *   1. src/components/HeroSearch.tsx — the only source of the helper copy
 *   2. out/index.html               — the static-export build output, if present
 *   3. https://<base>/?cb=<hex>     — live HTML, only when --base=<url> is passed
 *
 * Why scoped: the brief's forbidden phrase list ("Bridge-backed", "Search
 * routes", "ownership history where available", "current comparable sales",
 * etc.) targets the homepage hero search card explicitly. Many of those
 * phrases appear as legitimate consumer-facing prose elsewhere in the
 * site (about, sellers, markets, insights, /home-search/ page body) and
 * are not in scope for this audit.
 *
 * Usage:
 *   bun run scripts/audit-home-hero-copy.ts                 # source + out/
 *   bun run scripts/audit-home-hero-copy.ts --base=<url>    # source + out/ + live
 *
 * Exit codes:
 *   0   no findings, surfaces clean
 *   1   one or more findings in scanned surfaces
 */
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

type Finding = {
  surface: string;
  pattern: string;
  count: number;
  excerpt: string;
};

const args = process.argv.slice(2);
function argOpt(prefix: string): string | undefined {
  const a = args.find((x) => x.startsWith(prefix));
  return a ? a.slice(prefix.length) : undefined;
}

const BASE = argOpt("--base=");

const FORBIDDEN: ReadonlyArray<{ pattern: RegExp; label: string }> = [
  { pattern: /Search routes to/i, label: "Search routes to" },
  { pattern: /Bridge-backed/i, label: "Bridge-backed" },
  { pattern: /Search anchors to the Southeast Florida property-search section/i, label: "Search anchors to the Southeast Florida property-search section" },
  { pattern: /property-search section/i, label: "property-search section" },
  { pattern: /listings alone cannot tell you/i, label: "listings alone cannot tell you" },
  { pattern: /lists alone cannot tell you/i, label: "lists alone cannot tell you" },
  { pattern: /residence specifics listings/i, label: "residence specifics listings" },
  { pattern: /participating brokerages/i, label: "participating brokerages" },
];

/**
 * Source surface scan — the helper-paragraph DOM lives between the closing
 * </div> of the form grid and the closing </form>. We isolate that region
 * by string-bracket and scan only there, so legitimate code comments
 * documenting historical context don't trigger the audit.
 */
async function scanSource(): Promise<Finding[]> {
  const path = "src/components/HeroSearch.tsx";
  const text = await readFile(path, "utf8");

  // The helper paragraph DOM region — pluck the <p>...</p> blocks inside the
  // <form>. The HeroSearch component currently emits exactly one such <p>;
  // if it grows, all <p> contents inside the form get scanned.
  const formMatch = text.match(/<form[\s\S]*?<\/form>/);
  const formBody = formMatch ? formMatch[0] : text;
  const paraMatches = [...formBody.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)];
  const helperText = paraMatches.map((m) => m[1] ?? "").join("\n");

  // Also scan rendered text constants exported from the component (CTA copy etc.).
  const buttonText = formBody.match(/<button[\s\S]*?<\/button>/g)?.join("\n") ?? "";

  const scanned = `${helperText}\n${buttonText}`;
  const findings: Finding[] = [];
  for (const { pattern, label } of FORBIDDEN) {
    const matches = scanned.match(new RegExp(pattern.source, "gi"));
    if (matches && matches.length > 0) {
      findings.push({
        surface: `source: ${path} (helper <p> + button text inside <form>)`,
        pattern: label,
        count: matches.length,
        excerpt: scanned.slice(0, 320).replace(/\s+/g, " ").trim(),
      });
    }
  }
  return findings;
}

/**
 * Build-output surface scan — out/index.html only (the static export entry
 * for the homepage). We scan the WHOLE document for the forbidden patterns
 * because the helper text is the same string regardless of where the
 * minifier put it; if it appears anywhere in the homepage HTML, the
 * helper paragraph is back.
 */
async function scanBuildOutput(): Promise<Finding[]> {
  const path = "out/index.html";
  try {
    await stat(path);
  } catch {
    // out/index.html is optional — only present after `bun run build`.
    return [];
  }
  const text = await readFile(path, "utf8");
  const findings: Finding[] = [];
  for (const { pattern, label } of FORBIDDEN) {
    const matches = text.match(new RegExp(pattern.source, "gi"));
    if (matches && matches.length > 0) {
      // Find the first occurrence's surrounding context.
      const idx = text.search(pattern);
      const start = Math.max(0, idx - 80);
      const excerpt = text.slice(start, Math.min(text.length, idx + 200)).replace(/\s+/g, " ").trim();
      findings.push({
        surface: `build output: ${path}`,
        pattern: label,
        count: matches.length,
        excerpt,
      });
    }
  }
  return findings;
}

/**
 * Live surface scan — only runs when --base=<url> is provided. Fetches
 * the homepage with a hex cache-buster (per project CLAUDE.md Cache+Verify
 * rule) and scans the resulting HTML.
 */
async function scanLive(base: string): Promise<Finding[]> {
  const cb = randomBytes(8).toString("hex");
  const url = `${base.replace(/\/$/, "")}/?cb=${cb}`;
  const findings: Finding[] = [];
  const res = await fetch(url, { headers: { "Cache-Control": "no-cache", Pragma: "no-cache" } });
  if (!res.ok) {
    findings.push({
      surface: `live: ${url}`,
      pattern: `<fetch failed: HTTP ${res.status}>`,
      count: 1,
      excerpt: `Could not fetch live homepage at ${url}`,
    });
    return findings;
  }
  const text = await res.text();
  for (const { pattern, label } of FORBIDDEN) {
    const matches = text.match(new RegExp(pattern.source, "gi"));
    if (matches && matches.length > 0) {
      const idx = text.search(pattern);
      const start = Math.max(0, idx - 80);
      const excerpt = text.slice(start, Math.min(text.length, idx + 200)).replace(/\s+/g, " ").trim();
      findings.push({
        surface: `live: ${url}`,
        pattern: label,
        count: matches.length,
        excerpt,
      });
    }
  }
  return findings;
}

async function main() {
  const surfaces: string[] = ["source: src/components/HeroSearch.tsx"];
  surfaces.push("build output: out/index.html (if present)");
  if (BASE) surfaces.push(`live: ${BASE}`);

  console.log(`audit-home-hero-copy: scanning ${surfaces.length} surface(s)`);
  for (const s of surfaces) console.log(`  - ${s}`);

  const findings: Finding[] = [];
  findings.push(...(await scanSource()));
  findings.push(...(await scanBuildOutput()));
  if (BASE) findings.push(...(await scanLive(BASE)));

  if (findings.length === 0) {
    console.log("\n✓ audit-home-hero-copy: clean");
    process.exit(0);
  }

  console.log(`\n✗ audit-home-hero-copy: ${findings.length} finding(s)\n`);
  for (const f of findings) {
    console.log(`  ${f.surface}`);
    console.log(`    pattern: "${f.pattern}"`);
    console.log(`    count:   ${f.count}`);
    console.log(`    excerpt: ${f.excerpt.slice(0, 240)}${f.excerpt.length > 240 ? "..." : ""}`);
    console.log("");
  }
  process.exit(1);
}

main().catch((e) => {
  console.error("✗ audit-home-hero-copy failed:", e instanceof Error ? e.message : String(e));
  process.exit(2);
});
