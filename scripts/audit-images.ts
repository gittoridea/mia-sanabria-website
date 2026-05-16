#!/usr/bin/env bun
/**
 * audit-images — image integrity sentinel for production-readiness.
 *
 * Catches the failure mode where the build succeeds but pages render with
 * broken image references, missing OG assets, placeholder filenames, missing
 * alt text, or images that resolve in build but 404 on the live URL.
 *
 * Authored: 2026-05-08 cycle 4 (Codex-Spark Team B Visual QA recommendation)
 *
 * Outputs:
 *   reports/audit-images.json   (machine-readable, CI-grade)
 *   reports/audit-images.md     (human-readable, principal-grade)
 *
 * Exit code: 0 if zero FAILs (warnings allowed); 1 if any FAIL.
 */
import { readFile, readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { join, relative, posix } from "node:path";
import {
  ALL_MARKET_SLUGS,
  getFeaturedMarketSlugs,
  getMarketImagePath,
  getMarketOgImagePath,
  type MarketSlug,
} from "../src/lib/mia";

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
const PUBLIC_DIR = join(REPO_ROOT, "public");
const REPORTS_DIR = join(REPO_ROOT, "reports");

// Placeholder filenames considered unsafe in production unless explicitly allowed
const PLACEHOLDER_PATTERNS = [
  /placeholder/i,
  /lorem/i,
  /todo/i,
  /sample/i,
  /test[-_]image/i,
  /^untitled/i,
];

// Image extensions to track
const IMG_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walkBuiltHtml(): Promise<string[]> {
  const files: string[] = [];
  async function walk(dir: string) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.isFile() && e.name === "index.html") files.push(p);
    }
  }
  await walk(OUT_DIR);
  // Also pick up direct files like 404.html
  const top = await readdir(OUT_DIR, { withFileTypes: true }).catch(() => []);
  for (const e of top) {
    if (e.isFile() && e.name.endsWith(".html") && e.name !== "index.html") {
      files.push(join(OUT_DIR, e.name));
    }
  }
  return files.sort();
}

function htmlPathToRoute(htmlPath: string): string {
  const rel = relative(OUT_DIR, htmlPath);
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404";
  return "/" + rel.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
}

function extractImgSrcs(html: string): { src: string; alt: string | null; width: string | null; height: string | null }[] {
  const out: { src: string; alt: string | null; width: string | null; height: string | null }[] = [];
  const imgRe = /<img\b[^>]*?>/gi;
  for (const m of html.matchAll(imgRe)) {
    const tag = m[0];
    const srcMatch = tag.match(/\bsrc=["']([^"']+)["']/);
    if (!srcMatch || !srcMatch[1]) continue;
    const src: string = srcMatch[1];
    const altMatch = tag.match(/\balt=["']([^"']*)["']/);
    const widthMatch = tag.match(/\bwidth=["']?(\d+)["']?/);
    const heightMatch = tag.match(/\bheight=["']?(\d+)["']?/);
    out.push({
      src,
      alt: altMatch && altMatch[1] !== undefined ? altMatch[1] : null,
      width: widthMatch && widthMatch[1] ? widthMatch[1] : null,
      height: heightMatch && heightMatch[1] ? heightMatch[1] : null,
    });
  }
  return out;
}

function extractOgImages(html: string): string[] {
  const out: string[] = [];
  const re = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/gi;
  for (const m of html.matchAll(re)) {
    if (m[1]) out.push(m[1]);
  }
  return out;
}

function extractTwitterImages(html: string): string[] {
  const out: string[] = [];
  const re = /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/gi;
  for (const m of html.matchAll(re)) {
    if (m[1]) out.push(m[1]);
  }
  return out;
}

function siteRelativeUrlToFile(url: string): string | null {
  // Resolve site-relative URLs to public/ files; ignore data: and external
  if (url.startsWith("data:")) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Only resolve same-host URLs
    const m = url.match(/^https?:\/\/[^/]+(\/.*)$/);
    if (!m || !m[1]) return null;
    return join(PUBLIC_DIR, m[1].replace(/^\//, ""));
  }
  if (url.startsWith("/")) {
    return join(PUBLIC_DIR, url.replace(/^\//, ""));
  }
  return null;
}

function isPlaceholder(src: string): boolean {
  const fn = src.split("/").pop() || src;
  return PLACEHOLDER_PATTERNS.some((p) => p.test(fn));
}

async function runAuditImages(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const htmls = await walkBuiltHtml();

  type Issue = { route: string; src: string; problem: string };
  const brokenLocal: Issue[] = [];
  const brokenOg: Issue[] = [];
  const brokenTwitter: Issue[] = [];
  const placeholders: Issue[] = [];
  const missingAlt: Issue[] = [];
  const missingDims: Issue[] = [];
  const remoteImages: Issue[] = [];
  let totalImgsScanned = 0;
  let totalOgScanned = 0;

  for (const htmlPath of htmls) {
    const route = htmlPathToRoute(htmlPath);
    const html = await readFile(htmlPath, "utf-8");

    // <img> tags
    const imgs = extractImgSrcs(html);
    for (const img of imgs) {
      totalImgsScanned++;
      if (img.src.startsWith("data:")) continue;
      const localPath = siteRelativeUrlToFile(img.src);
      if (localPath) {
        if (!(await fileExists(localPath))) brokenLocal.push({ route, src: img.src, problem: "local file missing" });
        if (isPlaceholder(img.src)) placeholders.push({ route, src: img.src, problem: "placeholder filename" });
      } else if (img.src.startsWith("http://") || img.src.startsWith("https://")) {
        remoteImages.push({ route, src: img.src, problem: "remote URL (not statically resolvable)" });
      }
      // alt text — empty string OK if aria-hidden context, but we accept '' as decorative; nullish means missing attr
      if (img.alt === null) missingAlt.push({ route, src: img.src, problem: "no alt attribute" });
      // dim hints — only flag if it's a foreground content image (next/image fill mode is the documented WARN)
      // We accept missing dims here because audit-completeness already tracks this; this script focuses on resolution
    }

    // og:image
    const ogs = extractOgImages(html);
    for (const og of ogs) {
      totalOgScanned++;
      const localPath = siteRelativeUrlToFile(og);
      if (localPath) {
        if (!(await fileExists(localPath))) brokenOg.push({ route, src: og, problem: "og:image local file missing" });
        if (isPlaceholder(og)) placeholders.push({ route, src: og, problem: "og:image placeholder filename" });
      }
    }

    // twitter:image
    const twts = extractTwitterImages(html);
    for (const tw of twts) {
      const localPath = siteRelativeUrlToFile(tw);
      if (localPath && !(await fileExists(localPath))) brokenTwitter.push({ route, src: tw, problem: "twitter:image local file missing" });
    }
  }

  results.push({
    id: "images.localFilesResolve",
    category: "Image Resolution",
    description: "Every <img> referencing a local /public/* path resolves to an actual file",
    status: brokenLocal.length === 0 ? "PASS" : "FAIL",
    evidence:
      brokenLocal.length === 0
        ? `${totalImgsScanned} <img> tags across ${htmls.length} pages — all local references resolve`
        : `${brokenLocal.length} broken local images`,
    details: brokenLocal.length ? { broken: brokenLocal } : undefined,
  });

  results.push({
    id: "images.ogImagesResolve",
    category: "Image Resolution",
    description: "Every og:image referencing a local /public/* path resolves to an actual file",
    status: brokenOg.length === 0 ? "PASS" : "FAIL",
    evidence:
      brokenOg.length === 0
        ? `${totalOgScanned} og:image entries across ${htmls.length} pages — all local references resolve`
        : `${brokenOg.length} broken og:images`,
    details: brokenOg.length ? { broken: brokenOg } : undefined,
  });

  results.push({
    id: "images.twitterImagesResolve",
    category: "Image Resolution",
    description: "Every twitter:image referencing a local /public/* path resolves to an actual file",
    status: brokenTwitter.length === 0 ? "PASS" : "FAIL",
    evidence:
      brokenTwitter.length === 0
        ? `0 broken twitter:image references`
        : `${brokenTwitter.length} broken twitter:images`,
    details: brokenTwitter.length ? { broken: brokenTwitter } : undefined,
  });

  results.push({
    id: "images.noPlaceholderFilenames",
    category: "Production Polish",
    description: "No images use placeholder/lorem/todo/sample/untitled filenames",
    status: placeholders.length === 0 ? "PASS" : "WARN",
    evidence:
      placeholders.length === 0
        ? "no placeholder filenames detected"
        : `${placeholders.length} placeholder-named images`,
    details: placeholders.length ? { placeholders } : undefined,
  });

  results.push({
    id: "images.altPresent",
    category: "Accessibility",
    description: "Every <img> has an alt attribute (empty alt for decorative is acceptable)",
    status: missingAlt.length === 0 ? "PASS" : "WARN",
    evidence:
      missingAlt.length === 0
        ? `${totalImgsScanned} <img> tags — all have alt attribute`
        : `${missingAlt.length} <img> tags missing alt attribute`,
    details: missingAlt.length ? { missingAlt } : undefined,
  });

  results.push({
    id: "images.noUnresolvableRemote",
    category: "Static Export Integrity",
    description: "No <img> uses a remote URL that bypasses the static-export pipeline (warns; does not fail)",
    status: remoteImages.length === 0 ? "PASS" : "WARN",
    evidence:
      remoteImages.length === 0
        ? "no remote <img> URLs detected"
        : `${remoteImages.length} <img> tags reference remote URLs`,
    details: remoteImages.length ? { remoteImages } : undefined,
  });

  // Inventory: required public/ assets (per Brand System Contract)
  const requiredAssets = [
    "mia-headshot.jpg",
    "mia-headshot-256.jpg",
    "mia-og.jpg",
    "og-default.jpg",
    "og-buyers.jpg",
    "og-sellers.jpg",
    "og-contact.jpg",
    "logo-lpt.png",
    "logos/lpt-realty.png",
    "logos/realtor-r.png",
    "logos/equal-housing.png",
  ];
  // Cycle 14 — DRY refactor: derived from `ALL_MARKET_SLUGS` in src/lib/mia.ts.
  // Adding a market is now a single-edit operation in mia.ts (and markets.ts entry);
  // this audit picks up the new slug automatically.
  const marketSlugs = [...ALL_MARKET_SLUGS];
  const missingAssets: { path: string; reason: string }[] = [];
  for (const a of requiredAssets) {
    if (!(await fileExists(join(PUBLIC_DIR, a)))) missingAssets.push({ path: a, reason: "Brand-Contract-required asset" });
  }
  for (const slug of marketSlugs) {
    if (!(await fileExists(join(PUBLIC_DIR, "markets", `${slug}.jpg`))))
      missingAssets.push({ path: `markets/${slug}.jpg`, reason: `market hero for ${slug}` });
  }
  results.push({
    id: "images.requiredAssetsExist",
    category: "Asset Inventory",
    description: "Every Brand-Contract-required asset (headshot, logos, OG defaults, 15 market heroes) exists in public/",
    status: missingAssets.length === 0 ? "PASS" : "FAIL",
    evidence:
      missingAssets.length === 0
        ? "all required assets present"
        : `${missingAssets.length} required assets missing`,
    details: missingAssets.length ? { missing: missingAssets } : undefined,
  });

  // ───────────────────────────────────────────────────────────────────────
  // Cycle-5 §8 additions — featured-card image presence + hub-page hero image + public email consistency.
  // ───────────────────────────────────────────────────────────────────────

  // (1) Homepage Featured Markets — every visible card on page 1 of the pager
  //     must render an <img src="/markets/SLUG.jpg"> in the prerendered HTML.
  //     Cycle 16 — pager is client-rendered above page 1; only the first 6
  //     (principal-locked HOMEPAGE_FEATURED_ORDER) need to render in static HTML.
  //     Pages 2+ hydrate client-side and are not part of static-HTML coverage.
  const { HOMEPAGE_FEATURED_ORDER, HOMEPAGE_FEATURED_PAGE_SIZE } = await import("../src/lib/mia");
  const homeHtml = await readFile(join(OUT_DIR, "index.html"), "utf-8").catch(() => "");
  const featuredImgs = [...homeHtml.matchAll(/src="\/markets\/([a-z-]+)\.jpg"/g)].map((m) => m[1]);
  const firstPageSlugs = [...HOMEPAGE_FEATURED_ORDER].slice(0, HOMEPAGE_FEATURED_PAGE_SIZE);
  const missingFeatured = firstPageSlugs.filter((slug) => !featuredImgs.includes(slug));
  results.push({
    id: "images.homepageFeaturedCards",
    category: "Featured Markets",
    description: `Homepage Featured Markets section renders an <img> for each of the ${HOMEPAGE_FEATURED_PAGE_SIZE} first-page featured market cards`,
    status: missingFeatured.length === 0 ? "PASS" : "FAIL",
    evidence:
      missingFeatured.length === 0
        ? `all ${HOMEPAGE_FEATURED_PAGE_SIZE} first-page featured cards render <img src="/markets/SLUG.jpg">`
        : `${missingFeatured.length} first-page featured cards missing img: ${missingFeatured.join(", ")}`,
    details: missingFeatured.length ? { missingFeatured } : undefined,
  });

  // (2) Hub-page hero images — /markets/ + /about/ should render an image-mode Hero (i.e. an <img> inside the first <section>).
  type HubResult = { route: string; hasHeroImg: boolean };
  const hubChecks: HubResult[] = [];
  for (const route of ["/markets/", "/about/"]) {
    const htmlPath = join(OUT_DIR, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
    const html = await readFile(htmlPath, "utf-8").catch(() => "");
    if (!html) continue;
    // Take the first <section>...</section> block (the hero section) and check for an <img> inside.
    const firstSection = html.match(/<section\b[^>]*>([\s\S]*?)<\/section>/);
    const hasHeroImg = firstSection ? /<img\b[^>]*src=/i.test(firstSection[1] || "") : false;
    hubChecks.push({ route, hasHeroImg });
  }
  const missingHubHero = hubChecks.filter((h) => !h.hasHeroImg);
  results.push({
    id: "images.hubPageHeroImage",
    category: "Hub Pages",
    description: "/markets/ and /about/ hero sections render an <img> (image-mode Hero)",
    status: missingHubHero.length === 0 ? "PASS" : "FAIL",
    evidence:
      missingHubHero.length === 0
        ? `${hubChecks.length} hub pages — all render image-mode hero`
        : `${missingHubHero.length} hub pages missing hero <img>: ${missingHubHero.map((h) => h.route).join(", ")}`,
    details: missingHubHero.length ? { missingHubHero } : undefined,
  });

  // ───────────────────────────────────────────────────────────────────────
  // Cycle Addendum 2026-05-09 — Market Image Recovery: per-market explicit
  // checks. The "audit:images passes but principal sees missing images on
  // /markets/lighthouse-point/, /markets/coral-ridge/, /markets/palm-beach/"
  // pattern proved that a generic-image audit doesn't catch the principal's
  // actual user-visible pain. Add explicit per-market checks so this can't
  // recur silently.
  // ───────────────────────────────────────────────────────────────────────

  // (a) Every market's heroImage path appears in BOTH the markets index
  //     /markets/index.html (as a card image) AND the corresponding market
  //     page /markets/<slug>/index.html (as a hero image).
  const marketsIndexHtml = await readFile(join(OUT_DIR, "markets", "index.html"), "utf-8").catch(() => "");
  // Cycle 39 — match versioned + unversioned card images so versioned slugs
  // (Deerfield Beach, Hollywood, Plantation, Weston, Coral Springs, Davie,
  // Sunrise) pass the index-card presence check. Suffix tolerated: any
  // trailing `-cycle{N}` token before `.jpg`.
  const cardImagePathsOnIndex = new Set<string>(
    [...marketsIndexHtml.matchAll(/src="(\/markets\/[a-z0-9-]+\.jpg)"/g)].map((m) => m[1] ?? ""),
  );
  const missingCardOnIndex: string[] = [];
  const missingHeroOnPage: string[] = [];
  for (const slug of marketSlugs) {
    const expectedPath = getMarketImagePath(slug);
    if (!cardImagePathsOnIndex.has(expectedPath)) {
      missingCardOnIndex.push(slug);
    }
    const pageHtml = await readFile(join(OUT_DIR, "markets", slug, "index.html"), "utf-8").catch(() => "");
    if (!pageHtml.includes(`src="${expectedPath}"`)) {
      missingHeroOnPage.push(slug);
    }
  }
  results.push({
    id: "images.everyMarketCardImagePresent",
    category: "Featured Markets",
    description: "Every market in MARKETS renders <img src=/markets/<slug>.jpg> on /markets/ index",
    status: missingCardOnIndex.length === 0 ? "PASS" : "FAIL",
    evidence:
      missingCardOnIndex.length === 0
        ? `all ${marketSlugs.length} markets have card images on /markets/`
        : `${missingCardOnIndex.length} markets missing card image: ${missingCardOnIndex.join(", ")}`,
    details: missingCardOnIndex.length ? { missingCardOnIndex } : undefined,
  });
  results.push({
    id: "images.everyMarketPageHeroImagePresent",
    category: "Market Pages",
    description: "Every market page /markets/<slug>/ renders <img src=/markets/<slug>.jpg> in its hero",
    status: missingHeroOnPage.length === 0 ? "PASS" : "FAIL",
    evidence:
      missingHeroOnPage.length === 0
        ? `all ${marketSlugs.length} market pages have a hero image`
        : `${missingHeroOnPage.length} market pages missing hero image: ${missingHeroOnPage.join(", ")}`,
    details: missingHeroOnPage.length ? { missingHeroOnPage } : undefined,
  });

  // (b) Every market has an OG image at the slug's resolved path AND that
  //     image is referenced on the market's page in og:image meta. Path is
  //     resolved via getMarketOgImagePath() so the Cycle 39 versioned slugs
  //     are honored.
  const missingOgFile: string[] = [];
  const missingOgOnPage: string[] = [];
  for (const slug of marketSlugs) {
    const expectedOg = getMarketOgImagePath(slug);
    const ogFile = join(PUBLIC_DIR, expectedOg.replace(/^\//, ""));
    if (!(await fileExists(ogFile))) {
      missingOgFile.push(slug);
    }
    const pageHtml = await readFile(join(OUT_DIR, "markets", slug, "index.html"), "utf-8").catch(() => "");
    if (!pageHtml.includes(expectedOg)) {
      missingOgOnPage.push(slug);
    }
  }
  results.push({
    id: "images.everyMarketOgImageExists",
    category: "OG Images",
    description: "Every market has an OG image at /og-markets/<slug>.jpg AND its page emits og:image referencing it",
    status: missingOgFile.length === 0 && missingOgOnPage.length === 0 ? "PASS" : "FAIL",
    evidence:
      missingOgFile.length === 0 && missingOgOnPage.length === 0
        ? `all ${marketSlugs.length} markets have OG image asset + reference`
        : `${missingOgFile.length} missing files (${missingOgFile.join(", ") || "none"}); ${missingOgOnPage.length} missing references (${missingOgOnPage.join(", ") || "none"})`,
    details:
      missingOgFile.length || missingOgOnPage.length ? { missingOgFile, missingOgOnPage } : undefined,
  });

  // (c) Explicit per-market checks for Lighthouse Point, Coral Ridge, Palm Beach
  //     (the principal-reported defects). Redundant with (a)+(b) on a green
  //     build but the explicit naming makes regression on these specific
  //     surfaces impossible to miss.
  const principalReportedMarkets: ReadonlyArray<MarketSlug> = ["lighthouse-point", "coral-ridge", "palm-beach"];
  type ExplicitCheck = { slug: string; cardOnIndex: boolean; heroOnPage: boolean; ogFile: boolean; ogOnPage: boolean };
  const explicitChecks: ExplicitCheck[] = [];
  for (const slug of principalReportedMarkets) {
    const expectedCardPath = getMarketImagePath(slug);
    const expectedOgPath = getMarketOgImagePath(slug);
    const cardOnIndex = cardImagePathsOnIndex.has(expectedCardPath);
    const pageHtml = await readFile(join(OUT_DIR, "markets", slug, "index.html"), "utf-8").catch(() => "");
    const heroOnPage = pageHtml.includes(`src="${expectedCardPath}"`);
    const ogFile = await fileExists(join(PUBLIC_DIR, expectedOgPath.replace(/^\//, "")));
    const ogOnPage = pageHtml.includes(expectedOgPath);
    explicitChecks.push({ slug, cardOnIndex, heroOnPage, ogFile, ogOnPage });
  }
  const principalFails = explicitChecks.filter((c) => !(c.cardOnIndex && c.heroOnPage && c.ogFile && c.ogOnPage));
  results.push({
    id: "images.principalReportedMarkets",
    category: "Principal-Reported Markets (Cycle 9 Addendum)",
    description: "Lighthouse Point, Coral Ridge, Palm Beach — card image on /markets/, hero image on page, OG file + OG reference",
    status: principalFails.length === 0 ? "PASS" : "FAIL",
    evidence:
      principalFails.length === 0
        ? `all 3 principal-reported markets PASS — Lighthouse Point, Coral Ridge, Palm Beach`
        : `${principalFails.length} principal-reported markets FAIL: ${principalFails.map((c) => c.slug).join(", ")}`,
    details: { explicitChecks },
  });

  // (3) Public email consistency — exactly one canonical email should appear in rendered HTML across pages.
  // Collect all unique <name>@<domain> matches; flag if >1 distinct address rendered publicly (excluding RFC-bait).
  const emailSet = new Set<string>();
  const allowList = new Set<string>([
    // Allow these meta/build/RFC noise patterns (decode none of them as "publishing additional emails to users")
    "noreply@example.com",
    "abuse@example.com",
  ]);
  for (const htmlPath of htmls) {
    const html = await readFile(htmlPath, "utf-8");
    // Match plausible email patterns: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
    for (const m of html.matchAll(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g)) {
      if (!m[1]) continue;
      const addr = m[1].toLowerCase();
      if (!allowList.has(addr)) emailSet.add(addr);
    }
  }
  const emails = [...emailSet];
  results.push({
    id: "images.publicEmailConsistency",
    category: "Email Consistency",
    description: "Exactly one canonical public email address appears in rendered HTML",
    status: emails.length <= 1 ? "PASS" : "FAIL",
    evidence:
      emails.length === 1
        ? `single canonical email: ${emails[0]}`
        : emails.length === 0
        ? "no email addresses found in rendered HTML"
        : `${emails.length} distinct emails in rendered HTML — should be 1`,
    details: emails.length > 1 ? { emails } : undefined,
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
  await writeFile(join(REPORTS_DIR, "audit-images.json"), JSON.stringify(json, null, 2));

  const md: string[] = [
    "# Audit Images Report",
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
  await writeFile(join(REPORTS_DIR, "audit-images.md"), md.join("\n"));
}

async function main() {
  const results = await runAuditImages();

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
  console.log(`→ reports/audit-images.json`);
  console.log(`→ reports/audit-images.md`);
  process.exit(counts.fail > 0 ? 1 : 0);
}

main();
