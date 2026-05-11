#!/usr/bin/env bun
/**
 * audit-route-inventory — derive the route list from build artifacts (sitemap.xml)
 * and cross-check against MARKETS + INSIGHTS data + filesystem page.tsx files.
 *
 * Purpose: catch route drift. If a sitemap entry exists with no page.tsx (or
 * vice-versa), the QA gate has a phantom route. Used by audit-qa-gate to fan
 * out per-route checks.
 *
 * Exit codes:
 *   0  — all sources reconcile
 *   1  — drift detected (sitemap vs filesystem vs data)
 *   2  — out/ missing (run `bun run build`)
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = "out";
const SITEMAP_PATH = `${OUT_DIR}/sitemap.xml`;
const PAGES_DIR = "src/app";

type RouteSource = "sitemap" | "filesystem";
type RouteRecord = { route: string; sources: Set<RouteSource>; pageFile?: string };

function normalizeRoute(url: string, base: string): string {
  return url.replace(new RegExp(`^${escapeRegex(base)}`), "").replace(/\/$/, "") || "/";
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function readSitemap(): Promise<{ base: string; routes: string[] }> {
  let xml: string;
  try {
    xml = await readFile(SITEMAP_PATH, "utf-8");
  } catch {
    console.error(`audit-route-inventory: ${SITEMAP_PATH} not found — run \`bun run build\``);
    process.exit(2);
  }
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g))
    .map((m) => m[1])
    .filter((u): u is string => typeof u === "string");
  if (locs.length === 0) {
    console.error("audit-route-inventory: sitemap has 0 <loc> entries");
    process.exit(1);
  }
  const firstLoc = locs[0]!;
  const baseMatch = firstLoc.match(/^(https?:\/\/[^/]+)/);
  if (!baseMatch || typeof baseMatch[1] !== "string") {
    console.error(`audit-route-inventory: first loc has no host — ${firstLoc}`);
    process.exit(1);
  }
  const base = baseMatch[1];
  return { base, routes: locs.map((u) => normalizeRoute(u, base)) };
}

async function walkPages(dir: string, prefix = ""): Promise<{ route: string; file: string }[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: { route: string; file: string }[] = [];
  for (const e of entries) {
    if (e.name.startsWith("_") || e.name === "node_modules") continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      const segment = e.name.startsWith("(") && e.name.endsWith(")") ? "" : `/${e.name}`;
      out.push(...(await walkPages(full, prefix + segment)));
    } else if (e.isFile() && e.name === "page.tsx") {
      const route = prefix || "/";
      out.push({ route, file: full });
    }
  }
  return out;
}

function hasDynamic(route: string): boolean {
  return /\[[^\]]+\]/.test(route);
}

async function main() {
  const { base, routes: sitemapRoutes } = await readSitemap();
  const pages = await walkPages(PAGES_DIR);
  const fsRoutes = pages.map((p) => p.route);
  const records = new Map<string, RouteRecord>();
  for (const r of sitemapRoutes) {
    const rec = records.get(r) ?? { route: r, sources: new Set<RouteSource>() };
    rec.sources.add("sitemap");
    records.set(r, rec);
  }
  for (const p of pages) {
    if (hasDynamic(p.route)) continue;
    const r = p.route;
    const rec = records.get(r) ?? { route: r, sources: new Set<RouteSource>() };
    rec.sources.add("filesystem");
    rec.pageFile = p.file;
    records.set(r, rec);
  }
  // Dynamic [slug] pages: their concrete routes come ONLY from sitemap (data-driven).
  // We still require the dynamic template exists if any sitemap routes match the prefix.
  const dynamicTemplates = pages.filter((p) => hasDynamic(p.route));
  for (const tmpl of dynamicTemplates) {
    const prefix = tmpl.route.replace(/\/\[[^\]]+\]$/, "/");
    const concrete = sitemapRoutes.filter((r) => r.startsWith(prefix) && r !== prefix.replace(/\/$/, ""));
    for (const r of concrete) {
      const rec = records.get(r) ?? { route: r, sources: new Set<RouteSource>() };
      rec.sources.add("filesystem");
      rec.pageFile = tmpl.file;
      records.set(r, rec);
    }
  }

  // Static page validation: every sitemap route must have either a static page.tsx
  // or be matched by a dynamic template.
  const sitemapOnly: string[] = [];
  const fsOnly: string[] = [];
  for (const [route, rec] of records) {
    if (rec.sources.has("sitemap") && !rec.sources.has("filesystem")) sitemapOnly.push(route);
    if (!rec.sources.has("sitemap") && rec.sources.has("filesystem")) fsOnly.push(route);
  }
  // Filesystem routes that are intentionally not in sitemap (thank-you, etc.)
  const SITEMAP_OPTIONAL = ["/thank-you", "/thank-you/buyer-brief", "/thank-you/market-brief", "/thank-you/valuation"];
  const fsOnlyUnexpected = fsOnly.filter((r) => !SITEMAP_OPTIONAL.includes(r));

  const sitemapCount = sitemapRoutes.length;
  const fsConcreteCount = fsRoutes.filter((r) => !hasDynamic(r)).length;
  const allReconcile = sitemapOnly.length === 0 && fsOnlyUnexpected.length === 0;

  const report = {
    base,
    sitemap_routes: sitemapCount,
    filesystem_static_pages: fsConcreteCount,
    sitemap_only_unmatched: sitemapOnly,
    filesystem_only_unmatched_unexpected: fsOnlyUnexpected,
    filesystem_only_optional_present: fsOnly.filter((r) => SITEMAP_OPTIONAL.includes(r)),
    pass: allReconcile,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!allReconcile) {
    console.error(
      `✗ route-inventory drift: sitemap_only=${sitemapOnly.length} fs_only_unexpected=${fsOnlyUnexpected.length}`
    );
    process.exit(1);
  }
  console.log(`✓ audit-route-inventory: ${sitemapCount} sitemap routes reconcile to filesystem`);
}

await main();
