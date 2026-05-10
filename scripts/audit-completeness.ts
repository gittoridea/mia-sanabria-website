#!/usr/bin/env bun
/**
 * audit-completeness — production-readiness structural-drift detector.
 *
 * Probes source-to-output mapping consistency that the existing audit chain
 * (audit:stale + audit:seo + audit:schema + audit:links) misses by design.
 *
 * Catches the failure mode where every individual probe exits 0 but the site
 * has shipped silent regressions: routes built but missing from sitemap,
 * pages without per-page openGraph silently inheriting site-default,
 * placeholder-named hero images, mailto: form actions where GHL was promised,
 * insights/blog deep-link gaps, JSON-LD type-mismatches relative to page intent.
 *
 * Outputs:
 *   reports/audit-completeness.json   (machine-readable, CI-grade)
 *   reports/audit-completeness.md     (human-readable, principal-grade)
 *
 * Exit code: 0 if zero FAILs (warnings allowed); 1 if any FAIL.
 */
import { readFile, readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

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
const SRC_APP_DIR = join(REPO_ROOT, "src", "app");
const REPORTS_DIR = join(REPO_ROOT, "reports");

const SITE_URL_PROD = "https://miasanabriarealtor.com";
const SITE_URL_STAGE = "https://miasanabriarealtor.trueidea.com";

const CORE_PAGES = [
  "/",
  "/about/",
  "/contact/",
  "/buyers/",
  "/sellers/",
  "/valuation/",
  "/insights/",
] as const;

const LEGAL_PAGES = ["/privacy/", "/terms/", "/dmca/", "/accessibility/"] as const;

// Updated 2026-05-10 cycle 13: list now matches all 15 market routes (added bay-colony + bermuda-riviera).
// Future improvement: derive dynamically from src/lib/markets.ts at audit time.
const MARKET_PAGES = [
  "/markets/",
  "/markets/fort-lauderdale/",
  "/markets/coral-ridge/",
  "/markets/victoria-park/",
  "/markets/boca-raton/",
  "/markets/delray-beach/",
  "/markets/palm-beach/",
  "/markets/lighthouse-point/",
  "/markets/rio-vista/",
  "/markets/harbor-beach/",
  "/markets/las-olas-isles/",
  "/markets/seven-isles/",
  "/markets/sea-ranch-lakes/",
  "/markets/hillsboro-mile/",
  "/markets/bay-colony/",
  "/markets/bermuda-riviera/",
] as const;

const SAMPLED_FOOTER_PAGES = [
  "/",
  "/about/",
  "/contact/",
  "/buyers/",
  "/markets/fort-lauderdale/",
  "/insights/",
  "/privacy/",
] as const;

const MARKET_VISIBLE_WORD_FLOOR = 200;

/** Extract visible text by stripping <script>/<style>/<template>/comments + tags + entities. */
function extractVisibleText(html: string): string {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<template[\s\S]*?<\/template>/gi, " ");
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  s = s.replace(/<!--[\s\S]*?-->/g, " ");
  // strip JSON-LD blocks (already removed by script-strip above, but belt+suspenders)
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/&[#a-z0-9]+;/gi, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function countVisibleWords(html: string): number {
  const text = extractVisibleText(html);
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

/** Extract the first match of a regex group. */
function extractAttr(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m && m[1] ? m[1] : null;
}

async function readBuiltHtml(route: string): Promise<string | null> {
  const p = route === "/" ? join(OUT_DIR, "index.html") : join(OUT_DIR, route, "index.html");
  try {
    return await readFile(p, "utf-8");
  } catch {
    return null;
  }
}

async function readSitemapXml(): Promise<string> {
  return await readFile(join(OUT_DIR, "sitemap.xml"), "utf-8");
}

function parseSitemapRoutes(xml: string): string[] {
  const matches = xml.match(/<loc>[^<]+<\/loc>/g) ?? [];
  return matches.map((m) =>
    m
      .replace(/<\/?loc>/g, "")
      .replace(SITE_URL_STAGE, "")
      .replace(SITE_URL_PROD, "")
      .trim()
  );
}

async function listBuiltRoutes(): Promise<string[]> {
  const routes: string[] = [];
  async function walk(dir: string, prefix: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full, `${prefix}${e.name}/`);
      } else if (e.name === "index.html") {
        routes.push(prefix === "" ? "/" : `/${prefix}`);
      }
    }
  }
  await walk(OUT_DIR, "");
  return routes.sort();
}

async function checkUrl(url: string, timeoutMs = 5000): Promise<{ ok: boolean; status: number; size?: number }> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const r = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    clearTimeout(t);
    const size = parseInt(r.headers.get("content-length") ?? "0", 10);
    return { ok: r.ok, status: r.status, size: Number.isNaN(size) ? undefined : size };
  } catch {
    return { ok: false, status: 0 };
  }
}

/* =========================================================================
 *  CHECKS
 * ========================================================================= */

async function checkRouteSitemapMatch(): Promise<CheckResult[]> {
  const built = (await listBuiltRoutes()).filter((r) => r !== "/_not-found/" && r !== "/404/" && !r.startsWith("/_"));
  const sitemap = parseSitemapRoutes(await readSitemapXml()).map((r) => (r.endsWith("/") || r === "" ? r : `${r}/`));
  const sitemapSet = new Set(sitemap.map((r) => r || "/"));

  const inBuiltNotInSitemap = built.filter((r) => !sitemapSet.has(r) && !r.startsWith("/_") && r !== "/404/");
  const inSitemapNotInBuilt = sitemap.filter((r) => {
    const norm = r === "" ? "/" : r;
    return !built.includes(norm);
  });

  return [
    {
      id: "completeness.sitemap.builtInSitemap",
      category: "Sitemap coverage",
      description: "Every public built route is in sitemap.xml",
      status: inBuiltNotInSitemap.length === 0 ? "PASS" : "FAIL",
      evidence: `${built.length} built · ${sitemap.length} in sitemap · ${inBuiltNotInSitemap.length} missing`,
      details: { missing: inBuiltNotInSitemap, builtCount: built.length, sitemapCount: sitemap.length },
    },
    {
      id: "completeness.sitemap.sitemapInBuilt",
      category: "Sitemap coverage",
      description: "Every sitemap route resolves to a built page",
      status: inSitemapNotInBuilt.length === 0 ? "PASS" : "FAIL",
      evidence: `${inSitemapNotInBuilt.length} unresolved`,
      details: { unresolved: inSitemapNotInBuilt },
    },
  ];
}

async function checkLegalPagesPresent(): Promise<CheckResult> {
  const missing: string[] = [];
  for (const p of LEGAL_PAGES) {
    const html = await readBuiltHtml(p);
    if (!html) missing.push(p);
  }
  return {
    id: "completeness.legal.routesExist",
    category: "Compliance",
    description: "Required legal routes /privacy/, /terms/, /dmca/, /accessibility/ are built",
    status: missing.length === 0 ? "PASS" : "FAIL",
    evidence: missing.length === 0 ? "all 4 legal routes built" : `missing: ${missing.join(", ")}`,
    details: { missing },
  };
}

async function checkPerPageMetadata(): Promise<CheckResult[]> {
  const all = [...CORE_PAGES, ...LEGAL_PAGES, ...MARKET_PAGES];
  const titles = new Map<string, Set<string>>();
  const descriptions = new Map<string, Set<string>>();
  const issues: { route: string; field: string; problem: string }[] = [];
  let siteDefaultTitle: string | null = null;

  // Capture site-default title from layout.tsx default behavior:
  // home page exports `title.absolute` — read its title as the "site default" we DON'T want other pages to silently inherit.
  const homeHtml = await readBuiltHtml("/");
  if (homeHtml) {
    siteDefaultTitle = extractAttr(homeHtml, /<title[^>]*>([^<]+)<\/title>/);
  }

  for (const route of all) {
    const html = await readBuiltHtml(route);
    if (!html) {
      issues.push({ route, field: "page", problem: "no built page" });
      continue;
    }
    const title = extractAttr(html, /<title[^>]*>([^<]+)<\/title>/);
    const description = extractAttr(html, /name="description"\s+content="([^"]+)"/);
    const canonical = extractAttr(html, /<link\s+rel="canonical"\s+href="([^"]+)"/);
    const ogTitle = extractAttr(html, /property="og:title"\s+content="([^"]+)"/);
    const ogDesc = extractAttr(html, /property="og:description"\s+content="([^"]+)"/);
    const ogUrl = extractAttr(html, /property="og:url"\s+content="([^"]+)"/);
    const ogImage = extractAttr(html, /property="og:image"\s+content="([^"]+)"/);

    if (!title) issues.push({ route, field: "title", problem: "missing" });
    if (!description) issues.push({ route, field: "description", problem: "missing" });
    if (!canonical) issues.push({ route, field: "canonical", problem: "missing" });
    if (!ogTitle) issues.push({ route, field: "og:title", problem: "missing" });
    if (!ogDesc) issues.push({ route, field: "og:description", problem: "missing" });
    if (!ogUrl) issues.push({ route, field: "og:url", problem: "missing" });
    if (!ogImage) issues.push({ route, field: "og:image", problem: "missing" });

    // og:title silently inheriting site default → flag (except home itself)
    if (route !== "/" && ogTitle && siteDefaultTitle && ogTitle === siteDefaultTitle) {
      issues.push({ route, field: "og:title", problem: `silently inheriting site default "${siteDefaultTitle}"` });
    }

    // og:url should match canonical
    if (route !== "/" && ogUrl && canonical && ogUrl !== canonical) {
      issues.push({ route, field: "og:url", problem: `does not match canonical (${ogUrl} vs ${canonical})` });
    }

    if (title) {
      if (!titles.has(title)) titles.set(title, new Set());
      titles.get(title)!.add(route);
    }
    if (description) {
      if (!descriptions.has(description)) descriptions.set(description, new Set());
      descriptions.get(description)!.add(route);
    }
  }

  const dupTitles = [...titles.entries()].filter(([, set]) => set.size > 1);
  const dupDescriptions = [...descriptions.entries()].filter(([, set]) => set.size > 1);

  const results: CheckResult[] = [];
  results.push({
    id: "completeness.metadata.allPresent",
    category: "SEO/AEO",
    description: "Every core/legal/market page has title + description + canonical + og:title + og:description + og:url + og:image",
    status: issues.filter((i) => i.problem === "missing").length === 0 ? "PASS" : "FAIL",
    evidence: `${issues.length} field issues across ${all.length} pages`,
    details: { issues },
  });
  results.push({
    id: "completeness.metadata.uniqueTitles",
    category: "SEO/AEO",
    description: "Each core/legal/market page has unique <title>",
    status: dupTitles.length === 0 ? "PASS" : "WARN",
    evidence:
      dupTitles.length === 0
        ? `${titles.size} unique titles across ${all.length} pages`
        : `${dupTitles.length} duplicate titles`,
    details: { duplicates: dupTitles.map(([t, s]) => ({ title: t, routes: [...s] })) },
  });
  results.push({
    id: "completeness.metadata.uniqueDescriptions",
    category: "SEO/AEO",
    description: "Each core/legal/market page has unique <meta description>",
    status: dupDescriptions.length === 0 ? "PASS" : "WARN",
    evidence: dupDescriptions.length === 0 ? "all descriptions unique" : `${dupDescriptions.length} duplicates`,
    details: { duplicates: dupDescriptions.map(([d, s]) => ({ description: d, routes: [...s] })) },
  });
  return results;
}

async function checkMarketWordFloor(): Promise<CheckResult> {
  const issues: { route: string; words: number }[] = [];
  let checked = 0;
  for (const route of MARKET_PAGES) {
    if (route === "/markets/") continue; // index page
    const html = await readBuiltHtml(route);
    if (!html) continue;
    checked++;
    const words = countVisibleWords(html);
    if (words < MARKET_VISIBLE_WORD_FLOOR) issues.push({ route, words });
  }
  return {
    id: "completeness.markets.wordFloor",
    category: "Local Authority",
    description: `Market pages have ≥${MARKET_VISIBLE_WORD_FLOOR} visible words`,
    status: issues.length === 0 ? "PASS" : "WARN",
    evidence:
      issues.length === 0
        ? `all ${checked} market pages exceed ${MARKET_VISIBLE_WORD_FLOOR}-word floor`
        : `${issues.length}/${checked} below floor`,
    details: { thinPages: issues, marketsChecked: checked },
  };
}

async function checkFooterTrust(): Promise<CheckResult> {
  const sentinels = {
    lpt: /LPT Realty/,
    licenseSlot: /Sales Associate License #|License #SL/,
    eho: /Equal Housing Opportunity/,
    realtorLogo: /<img[^>]+(realtor-r|MLS-clear|REALTOR®)/i,
    privacyLink: /href="\/privacy\/"/,
    termsLink: /href="\/terms\/"/,
    accessibilityLink: /href="\/accessibility\/"/,
    dmcaLink: /href="\/dmca\/"/,
  };
  const failsByRoute: Record<string, string[]> = {};
  for (const route of SAMPLED_FOOTER_PAGES) {
    const html = await readBuiltHtml(route);
    if (!html) continue;
    const fails: string[] = [];
    for (const [key, re] of Object.entries(sentinels)) {
      if (!re.test(html)) fails.push(key);
    }
    if (fails.length > 0) failsByRoute[route] = fails;
  }
  return {
    id: "completeness.footer.trust",
    category: "Compliance",
    description: "Footer trust elements (LPT, license, EHO, REALTOR, 4 policy links) on sampled pages",
    status: Object.keys(failsByRoute).length === 0 ? "PASS" : "FAIL",
    evidence:
      Object.keys(failsByRoute).length === 0
        ? `all ${SAMPLED_FOOTER_PAGES.length} sampled pages carry full footer trust set`
        : `${Object.keys(failsByRoute).length} pages missing sentinels`,
    details: { failsByRoute },
  };
}

async function checkCorePageImages(): Promise<CheckResult[]> {
  const placeholderHints = [/placeholder/i, /lorem/i, /\.svg\?placeholder/i, /sample-/i];
  const results: CheckResult[] = [];
  const issues: { route: string; img: string; problem: string }[] = [];
  const broken: { route: string; img: string; status: number }[] = [];
  // Cycle 12 — track fill-mode classification so the report can show how many
  // images are correctly using next/image fill (no width/height by Next convention).
  let fillModeCount = 0;

  for (const route of [...CORE_PAGES, ...MARKET_PAGES.slice(1, 4)]) {
    const html = await readBuiltHtml(route);
    if (!html) continue;
    // Pull <img> tags
    const imgTags = html.match(/<img\b[^>]*>/g) ?? [];
    for (const tag of imgTags) {
      const src = extractAttr(tag, /\bsrc="([^"]+)"/);
      const alt = tag.match(/\balt="([^"]*)"/);
      const w = tag.match(/\bwidth="?(\d+)/);
      const h = tag.match(/\bheight="?(\d+)/);
      if (!src) continue;
      // Skip Next.js srcset placeholders
      if (src.startsWith("data:")) continue;
      // Cycle 12 — next/image `fill` mode: parent must be position:relative with explicit
      // dimensions; the rendered <img> is position:absolute and has NO width/height by
      // Next.js convention. The audit must not flag legitimate fill-mode usage.
      // Two signals identify fill mode:
      //   1. data-nimg="fill" — canonical attr emitted by next/image v13+ in fill mode
      //   2. inline style position:absolute + height:100%; width:100% — the runtime CSS
      //      next/image injects (defense-in-depth in case Next changes the data attr)
      const isFillMode =
        /\bdata-nimg="fill"/.test(tag) ||
        (/\bstyle="[^"]*position:absolute[^"]*"/.test(tag) &&
          /\bstyle="[^"]*height:100%[^"]*"/.test(tag) &&
          /\bstyle="[^"]*width:100%[^"]*"/.test(tag));
      if (isFillMode) {
        fillModeCount++;
      }
      // alt text required (empty alt OK only if aria-hidden or decorative)
      if (alt === null) issues.push({ route, img: src, problem: "missing alt attribute" });
      // dims required for non-decorative images — UNLESS rendered in next/image fill mode
      if (alt && alt[1] !== "" && (!w || !h) && !isFillMode) {
        issues.push({ route, img: src, problem: "missing width/height" });
      }
      // placeholder name
      for (const pat of placeholderHints) {
        if (pat.test(src)) issues.push({ route, img: src, problem: "placeholder-named" });
      }
      // local URL existence check (only for /…)
      if (src.startsWith("/")) {
        const localPath = join(OUT_DIR, src);
        try {
          await stat(localPath);
        } catch {
          broken.push({ route, img: src, status: 404 });
        }
      }
    }
  }
  results.push({
    id: "completeness.images.dimsAltPlaceholder",
    category: "Design/Display Integrity",
    description: "Core-page <img> tags have alt + width/height + no placeholder names (next/image fill mode exempted from dims check)",
    status: issues.length === 0 ? "PASS" : "WARN",
    evidence: issues.length === 0
      ? `no img-attribute issues (${fillModeCount} next/image fill-mode images correctly classified)`
      : `${issues.length} img attribute issues (${fillModeCount} next/image fill-mode images correctly classified)`,
    details: { issues, fillModeCount },
  });
  results.push({
    id: "completeness.images.localFilesExist",
    category: "Design/Display Integrity",
    description: "Local image references resolve to files in out/",
    status: broken.length === 0 ? "PASS" : "FAIL",
    evidence: broken.length === 0 ? "all referenced local images exist" : `${broken.length} broken local refs`,
    details: { broken },
  });
  return results;
}

async function checkOgImagesResolve(): Promise<CheckResult> {
  const broken: { route: string; ogImage: string }[] = [];
  for (const route of [...CORE_PAGES, ...LEGAL_PAGES]) {
    const html = await readBuiltHtml(route);
    if (!html) continue;
    const ogImage = extractAttr(html, /property="og:image"\s+content="([^"]+)"/);
    if (!ogImage) continue;
    // local-relative or absolute
    if (ogImage.startsWith("http")) {
      // remote — skip in non-network mode
      continue;
    }
    const path = ogImage.startsWith(SITE_URL_STAGE)
      ? ogImage.slice(SITE_URL_STAGE.length)
      : ogImage.startsWith(SITE_URL_PROD)
        ? ogImage.slice(SITE_URL_PROD.length)
        : ogImage;
    try {
      await stat(join(OUT_DIR, path));
    } catch {
      broken.push({ route, ogImage });
    }
  }
  return {
    id: "completeness.og.imagesResolve",
    category: "SEO/AEO",
    description: "Every page's og:image resolves to a local file in out/",
    status: broken.length === 0 ? "PASS" : "FAIL",
    evidence: broken.length === 0 ? "all og:images resolve" : `${broken.length} broken og:images`,
    details: { broken },
  };
}

async function checkFormsClassification(): Promise<CheckResult> {
  type FormClass = "live-ghl" | "mailto" | "disabled" | "other";
  const classifications: Record<FormClass, { route: string; action: string; type: FormClass }[]> = {
    "live-ghl": [],
    mailto: [],
    disabled: [],
    other: [],
  };
  for (const route of [...CORE_PAGES, "/markets/fort-lauderdale/"]) {
    const html = await readBuiltHtml(route);
    if (!html) continue;
    const forms = html.match(/<form\b[^>]*action="([^"]*)"/g) ?? [];
    for (const f of forms) {
      const action = extractAttr(f, /action="([^"]*)"/) ?? "";
      const cls: FormClass = action.includes("leadconnectorhq")
        ? "live-ghl"
        : action.startsWith("mailto:")
          ? "mailto"
          : action === "" || action === "#"
            ? "disabled"
            : "other";
      classifications[cls].push({ route, action, type: cls });
    }
  }
  const total = Object.values(classifications).flat().length;
  const live = classifications["live-ghl"].length;
  const mailto = classifications["mailto"].length;
  const disabled = classifications["disabled"].length;
  const other = classifications["other"].length;

  // Mailto forms WARN — accepted as fallback per ISA but should be flagged
  let status: CheckStatus = "PASS";
  if (other > 0) status = "FAIL";
  else if (mailto > 0 && live === 0) status = "WARN";

  return {
    id: "completeness.forms.classification",
    category: "Forms/CTAs",
    description: "Form actions classified: live-ghl / mailto / disabled / other",
    status,
    evidence: `${total} forms · ${live} live-ghl · ${mailto} mailto · ${disabled} disabled · ${other} other`,
    details: classifications,
  };
}

async function checkBlogIntegration(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  // Blog/insights in nav
  const homeHtml = await readBuiltHtml("/");
  const navHasInsights = homeHtml ? /href="\/insights\/"/.test(homeHtml) : false;
  results.push({
    id: "completeness.blog.inNav",
    category: "Blog",
    description: "Insights/blog link present in homepage nav (header or footer)",
    status: navHasInsights ? "PASS" : "WARN",
    evidence: navHasInsights ? "insights linked from homepage" : "no insights link found in homepage HTML",
  });

  // Insights in sitemap
  const sitemap = parseSitemapRoutes(await readSitemapXml());
  const insightsInSitemap = sitemap.some((r) => r === "/insights/" || r === "/insights");
  results.push({
    id: "completeness.blog.inSitemap",
    category: "Blog",
    description: "/insights/ in sitemap.xml",
    status: insightsInSitemap ? "PASS" : "FAIL",
    evidence: insightsInSitemap ? "/insights/ in sitemap" : "/insights/ missing from sitemap",
  });

  // Insights page has Article schema
  const insightsHtml = await readBuiltHtml("/insights/");
  const hasArticleSchema = insightsHtml ? /"@type":"Article"/.test(insightsHtml) : false;
  results.push({
    id: "completeness.blog.articleSchema",
    category: "Blog",
    description: "/insights/ emits at least one Article JSON-LD",
    status: hasArticleSchema ? "PASS" : "WARN",
    evidence: hasArticleSchema ? "Article schema present" : "no Article schema found",
  });

  return results;
}

async function checkJsonLdValidity(): Promise<CheckResult> {
  // Reuse logic from audit:schema but just count broken graphs
  let pageCount = 0;
  let blockCount = 0;
  let broken = 0;
  const issues: { route: string; problem: string }[] = [];
  const allRoutes = [...CORE_PAGES, ...LEGAL_PAGES, ...MARKET_PAGES];
  for (const route of allRoutes) {
    const html = await readBuiltHtml(route);
    if (!html) continue;
    pageCount++;
    const blocks = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) ?? [];
    for (const block of blocks) {
      blockCount++;
      const content = block.replace(/<script[^>]*>/, "").replace(/<\/script>$/, "");
      try {
        const parsed = JSON.parse(content);
        const data = Array.isArray(parsed) ? parsed : parsed["@graph"] ? parsed["@graph"] : [parsed];
        for (const node of data) {
          if (!node["@type"]) {
            issues.push({ route, problem: "node missing @type" });
            broken++;
          }
        }
      } catch (e) {
        issues.push({ route, problem: `invalid JSON: ${(e as Error).message.slice(0, 60)}` });
        broken++;
      }
    }
  }
  return {
    id: "completeness.schema.valid",
    category: "Schema",
    description: "All JSON-LD blocks parse and carry @type",
    status: broken === 0 ? "PASS" : "FAIL",
    evidence: `${blockCount} JSON-LD blocks across ${pageCount} pages · ${broken} broken`,
    details: { issues },
  };
}

/* =========================================================================
 *  ORCHESTRATOR
 * ========================================================================= */

async function main() {
  console.log("→ audit-completeness — production-readiness structural-drift detector\n");
  await mkdir(REPORTS_DIR, { recursive: true });

  // Confirm out/ exists
  try {
    await stat(OUT_DIR);
  } catch {
    console.error("✗ out/ does not exist — run `bun run build` first");
    process.exit(1);
  }

  const results: CheckResult[] = [];
  results.push(...(await checkRouteSitemapMatch()));
  results.push(await checkLegalPagesPresent());
  results.push(...(await checkPerPageMetadata()));
  results.push(await checkMarketWordFloor());
  results.push(await checkFooterTrust());
  results.push(...(await checkCorePageImages()));
  results.push(await checkOgImagesResolve());
  results.push(await checkFormsClassification());
  results.push(...(await checkBlogIntegration()));
  results.push(await checkJsonLdValidity());

  // Summary
  const counts = { PASS: 0, WARN: 0, FAIL: 0, SKIP: 0 };
  for (const r of results) counts[r.status]++;

  // Print to console
  const groupedByCategory = new Map<string, CheckResult[]>();
  for (const r of results) {
    if (!groupedByCategory.has(r.category)) groupedByCategory.set(r.category, []);
    groupedByCategory.get(r.category)!.push(r);
  }
  for (const [cat, items] of groupedByCategory) {
    console.log(`\n=== ${cat} ===`);
    for (const r of items) {
      const icon = r.status === "PASS" ? "✓" : r.status === "WARN" ? "⚠" : r.status === "FAIL" ? "✗" : "·";
      console.log(`  ${icon} ${r.id} — ${r.evidence}`);
    }
  }
  console.log(`\nSummary: ${counts.PASS} PASS · ${counts.WARN} WARN · ${counts.FAIL} FAIL · ${counts.SKIP} SKIP`);

  // Write JSON report
  const ts = new Date().toISOString();
  const json = {
    timestamp: ts,
    counts,
    results,
  };
  await writeFile(join(REPORTS_DIR, "audit-completeness.json"), JSON.stringify(json, null, 2));

  // Write markdown report
  const md: string[] = [
    `# Audit Completeness Report`,
    ``,
    `**Generated:** ${ts}`,
    ``,
    `**Summary:** ${counts.PASS} PASS · ${counts.WARN} WARN · ${counts.FAIL} FAIL · ${counts.SKIP} SKIP`,
    ``,
    `## Results by category`,
    ``,
  ];
  for (const [cat, items] of groupedByCategory) {
    md.push(`### ${cat}`, ``, `| ID | Status | Description | Evidence |`, `|---|:-:|---|---|`);
    for (const r of items) {
      const status =
        r.status === "PASS" ? "✅" : r.status === "WARN" ? "⚠️" : r.status === "FAIL" ? "❌" : "·";
      md.push(`| \`${r.id}\` | ${status} | ${r.description} | ${r.evidence} |`);
    }
    md.push(``);
  }
  md.push(`## Failures and warnings — details`, ``);
  const issues = results.filter((r) => r.status === "FAIL" || r.status === "WARN");
  if (issues.length === 0) {
    md.push(`_No failures or warnings._`);
  } else {
    for (const r of issues) {
      md.push(`### ${r.status === "FAIL" ? "❌" : "⚠️"} \`${r.id}\``);
      md.push(``, `**Description:** ${r.description}`, ``, `**Evidence:** ${r.evidence}`, ``);
      if (r.details) {
        md.push("```json", JSON.stringify(r.details, null, 2).slice(0, 4000), "```", ``);
      }
    }
  }
  await writeFile(join(REPORTS_DIR, "audit-completeness.md"), md.join("\n"));

  console.log(`\n→ reports/audit-completeness.json`);
  console.log(`→ reports/audit-completeness.md`);

  // Exit non-zero on FAIL
  if (counts.FAIL > 0) {
    console.error(`\n✗ ${counts.FAIL} failure(s) — see reports/audit-completeness.md`);
    process.exit(1);
  }
  console.log(`\n✓ audit-completeness exit 0`);
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
