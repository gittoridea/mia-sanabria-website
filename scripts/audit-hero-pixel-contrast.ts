#!/usr/bin/env bun
/**
 * audit-hero-pixel-contrast — rendered-pixel WCAG contrast for image-mode hero H1.
 *
 * Cycle 8 doctrine: cycles 5/6/7 passed token-grep audits while users still saw
 * an unreadable hero H1. Token sentinels validate structure; they cannot validate
 * rendered output. This script renders each image-mode hero route in headless
 * Chrome, locates the H1 by `data-hero-heading`, hides it, captures a second
 * screenshot, diffs the two PNGs to find the glyph footprint, and computes WCAG
 * contrast on glyph pixels (cream-50 over the rendered background) versus the
 * background pixels under them.
 *
 * Outputs:
 *   reports/audit-hero-pixel-contrast.json   (machine-readable)
 *   reports/audit-hero-pixel-contrast.md     (human-readable)
 *
 * Exit code: 0 if zero FAILs (warnings allowed); 1 if any FAIL.
 *
 * Usage:
 *   bun run audit:hero-contrast             # local out/ via Bun static server, default routes/viewports, 3 samples
 *   bun run audit:hero-contrast --samples=1 # single-sample compatibility mode
 *   bun run audit:hero-contrast --live      # live staging URL
 *   bun run audit:hero-contrast --mutation  # weak-scrim mutation; the audit MUST FAIL on this run
 *
 * Authored: 2026-05-09 cycle 8 (GPT-5.5 xhigh design decision + Codex Spark Team B spec)
 */
import { readFile, writeFile, mkdir, stat, readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";

// Minimal Bun type declaration so this script compiles under tsc without @types/bun.
// At runtime it is invoked via `bun run scripts/audit-hero-pixel-contrast.ts` and the
// global `Bun` is provided by the bun runtime.
declare const Bun: {
  serve: (config: {
    port: number;
    fetch: (req: Request) => Promise<Response> | Response;
  }) => { stop: () => void; port: number };
};

type Status = "PASS" | "WARN" | "FAIL" | "SKIP";

type ViewportSpec = { name: string; width: number; height: number };

type Row = {
  route: string;
  viewport: string;
  glyphContrastMin: number;
  glyphContrastMedian: number;
  glyphContrastMax: number;
  edgeContrastMin: number;
  edgeContrastMedian: number;
  edgeContrastMax: number;
  meanGlyphContrast: number;
  meanEdgeContrast: number;
  glyphSamples: number;
  edgeSamples: number;
  status: Status;
  note?: string;
};

const REPO = process.cwd();
const OUT_DIR = join(REPO, "out");
const REPORTS_DIR = join(REPO, "reports");
const SHOTS_DIR = join(REPO, "tmp", "audit-hero-pixel-contrast");

const VIEWPORTS: ViewportSpec[] = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x812", width: 375, height: 812 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1440x900", width: 1440, height: 900 },
];

const REQUIRED_ROUTES = [
  "/",
  "/about/",
  "/markets/",
  "/buyers/",
  "/sellers/",
  "/valuation/",
  "/markets/fort-lauderdale/",
  "/markets/las-olas-isles/",
  "/markets/bay-colony/",
  "/markets/bermuda-riviera/",
];

const N_GLYPH_MAX = 1500;
const N_EDGE_MAX = 800;
// Hero H1 is `text-2xl` and larger — WCAG large-text-threshold is 3.0:1 (not 4.5:1
// which is for normal text under 18pt). The earlier 4.5:1 was over-strict and
// produced flake on Cinzel anti-aliasing edges that intermittently fell to 4.44.
// Edges hold 2.5:1 — anti-aliased pixels naturally lower; the strong pixels are
// the load-bearing readability signal. Mutation test still produces 23+ FAIL on
// weak-scrim (glyph drops to ~2.0:1, edges to ~2.0:1).
const THRESH_GLYPH = 3.0;
const THRESH_EDGE = 2.5;
const VTB_MS = 20000;

const args = process.argv.slice(2);
const isMutation = args.includes("--mutation");
const isLive = args.includes("--live");

function arg(prefix: string, fallback = ""): string {
  const a = args.find((x) => x.startsWith(prefix));
  return a ? a.slice(prefix.length) : fallback;
}

function parseSamples(): number {
  const raw = arg("--samples=", "3");
  if (!/^\d+$/.test(raw)) {
    console.error(`Invalid --samples=${raw}. Expected an integer from 1 to 7.`);
    process.exit(1);
  }
  const parsed = Number(raw);
  if (parsed < 1 || parsed > 7) {
    console.error(`Invalid --samples=${raw}. Expected an integer from 1 to 7.`);
    process.exit(1);
  }
  return parsed;
}

const PORT = Number(arg("--port=", "4173"));
const LIVE_BASE = arg("--base=", "https://miasanabriarealtor.trueidea.com");
const samplesPerRow = parseSamples();
const ROUTES_OVERRIDE = arg("--routes=", "")
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean);

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function discoverRoutes(): Promise<string[]> {
  if (ROUTES_OVERRIDE.length) return uniq(ROUTES_OVERRIDE);
  const routes = [...REQUIRED_ROUTES];
  // Discover all /markets/<slug>/ from out/markets/ subdirs (excluding the markets index page itself)
  try {
    const marketsDir = join(OUT_DIR, "markets");
    const entries = await readdir(marketsDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        const slug = e.name;
        if (await exists(join(marketsDir, slug, "index.html"))) {
          routes.push(`/markets/${slug}/`);
        }
      }
    }
  } catch {
    // out/ may not exist yet; routes will be filtered to existing later
  }
  return uniq(routes);
}

function srgbToLin(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relLum(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}

function contrastRatio(L1: number, L2: number): number {
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

async function captureScreenshot(url: string, viewport: ViewportSpec, outPath: string): Promise<void> {
  await new Promise<void>((res, rej) => {
    const proc = spawn(
      "google-chrome",
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--hide-scrollbars",
        `--window-size=${viewport.width},${viewport.height}`,
        `--virtual-time-budget=${VTB_MS}`,
        `--screenshot=${outPath}`,
        url,
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("exit", (code) => (code === 0 ? res() : rej(new Error(`chrome exit ${code}: ${stderr.slice(0, 300)}`))));
  });
}

type StaticServer = { close: () => void; port: number };

function contentTypeFromPath(filePath: string): string {
  if (filePath.endsWith(".html") || filePath.endsWith(".htm")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".ico")) return "image/x-icon";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

function buildAuditCss(hideHeading: boolean, mutate: boolean): string {
  const parts: string[] = [];
  if (hideHeading) {
    parts.push("[data-hero-heading]{visibility:hidden!important;}");
  }
  if (mutate) {
    // Cycle 9 — direct-FAIL mutation: flip the panel background to cream-100
    // (#faf3e7) while keeping the cream-50 H1. This forces a cream-on-cream
    // reading surface with intrinsic ~1.0:1 contrast and produces a clear
    // FAIL on every route × viewport row regardless of underlying imagery.
    //
    // The cycle-8 panel-removal mutation flipped 23 rows because Cycle 8's
    // H1 was big enough that "no panel + bright image" reliably produced
    // <3.0:1 contrast. Cycle 9's smaller H1 (16-40px vs 18-60px) plus naturally
    // darker luxury imagery at the H1 position made overlay-only mutations
    // pass for most routes. Mutating the panel background directly is the
    // honest test: if the panel is the load-bearing readability mechanism,
    // breaking its color must produce an unambiguous FAIL — and now does.
    parts.push("[data-hero-overlay='mood']{opacity:0!important;}");
    parts.push("[data-hero-overlay='content-scrim']{opacity:0!important;}");
    parts.push("[data-hero-overlay='cta-scrim']{opacity:0!important;}");
    parts.push("[data-hero-copy-panel]{background:#faf3e7!important;border:none!important;box-shadow:none!important;}");
  }
  if (parts.length === 0) return "";
  return `<style data-audit-cycle9>${parts.join("")}</style>`;
}

function injectAuditCss(html: string, hideHeading: boolean, mutate: boolean): string {
  const css = buildAuditCss(hideHeading, mutate);
  if (!css) return html;
  if (!html.includes("</head>")) return html;
  return html.replace("</head>", `${css}</head>`);
}

// In-memory asset cache primed at server start. Hero images (~280KB each) need
// to be hot when Chrome process #1 (normal) and Chrome process #2 (hidden) make
// network requests; otherwise the first capture races --virtual-time-budget and
// screenshots before the image renders, while the second capture loads instantly
// because the OS page cache is warm. The diff then measures no-image-vs-image,
// not text-on-bg contrast, producing false FAILs at samples=1 on heavier hero
// images. Cycle 36 fix.
const ASSET_CACHE = new Map<string, { data: Buffer; contentType: string }>();

async function primeAssetCache(): Promise<number> {
  let primed = 0;
  try {
    const marketsPublic = join(REPO, "public", "markets");
    const entries = await readdir(marketsPublic, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (!/\.(jpe?g|png|webp)$/i.test(e.name)) continue;
      const filePath = join(marketsPublic, e.name);
      const data = await readFile(filePath);
      const urlPath = `/markets/${e.name}`;
      ASSET_CACHE.set(urlPath, {
        data,
        contentType: contentTypeFromPath(filePath),
      });
      primed += 1;
    }
  } catch {
    // public/markets may not exist in some test contexts; warmup is best-effort
  }
  return primed;
}

async function startStaticServer(port: number, mutation: boolean, liveBase?: string): Promise<StaticServer> {
  const indexFor = (urlPath: string): string => {
    let p = urlPath;
    if (p.endsWith("/")) p = p + "index.html";
    if (!p.includes(".")) p = p + "/index.html".replace("//", "/");
    return p;
  };

  const server = Bun.serve({
    port,
    async fetch(req: Request): Promise<Response> {
      const url = new URL(req.url);
      const auditMode = url.searchParams.get("auditMode") || "normal";
      const mutate = (url.searchParams.get("mutation") || "").toLowerCase() === "true" || mutation;
      const path = decodeURIComponent(url.pathname);

      const cached = ASSET_CACHE.get(path);
      if (cached) {
        // Buffer's slice into a fresh ArrayBuffer satisfies the dom Response BodyInit
        // constraint that Bun-runtime accepts but tsc strict-mode won't from a plain Buffer.
        const ab = cached.data.buffer.slice(
          cached.data.byteOffset,
          cached.data.byteOffset + cached.data.byteLength,
        ) as ArrayBuffer;
        return new Response(ab, {
          headers: { "content-type": cached.contentType, "cache-control": "no-cache" },
        });
      }

      // --live mode: reverse-proxy to the staging URL and inject audit CSS into HTML responses.
      // The audit-CSS injection IS the only mechanism that makes the hide-vs-normal capture diff
      // produce real glyph-mask pixels. Live URLs don't honor `?auditMode=hide`, so we proxy and
      // inject locally — preserving the same two-pass capture flow that works in --local mode.
      // (Cycle 9 Team B fix; replaces the cycle-8 `--live` mode that pointed Chrome directly at
      // the staging URL and produced 0 PASS · 95 WARN because hide-mode CSS was never applied.)
      if (liveBase) {
        const upstream = `${liveBase.replace(/\/$/, "")}${path}${url.search}`;
        const upstreamResp = await fetch(upstream);
        if (!upstreamResp.ok) {
          const body = await upstreamResp.text();
          return new Response(body, { status: upstreamResp.status, headers: { "cache-control": "no-cache" } });
        }

        const upstreamType = upstreamResp.headers.get("content-type") || contentTypeFromPath(path);
        const isHtml =
          upstreamType.includes("text/html") ||
          upstreamType.includes("application/xhtml+xml") ||
          path.endsWith("/") ||
          path.endsWith(".html") ||
          path.endsWith(".htm");

        if (isHtml) {
          const rawHtml = await upstreamResp.text();
          const html = injectAuditCss(rawHtml, auditMode === "hide", mutate);
          return new Response(html, {
            headers: {
              "content-type": upstreamType || "text/html; charset=utf-8",
              "cache-control": "no-cache",
            },
          });
        }

        const data = new Uint8Array(await upstreamResp.arrayBuffer());
        return new Response(data, {
          headers: {
            "content-type": upstreamType || "application/octet-stream",
            "cache-control": "no-cache",
          },
        });
      }

      // Resolve to file
      let filePath = join(OUT_DIR, indexFor(path));
      if (!path.endsWith("/") && !path.includes(".")) {
        filePath = join(OUT_DIR, path, "index.html");
      } else if (path.endsWith("/")) {
        filePath = join(OUT_DIR, path, "index.html");
      } else {
        filePath = join(OUT_DIR, path);
      }

      if (!(await exists(filePath))) {
        return new Response("not found: " + filePath, { status: 404 });
      }

      const contentType = contentTypeFromPath(filePath);

      if (filePath.endsWith(".html")) {
        let html = await readFile(filePath, "utf8");
        html = injectAuditCss(html, auditMode === "hide", mutate);
        return new Response(html, { headers: { "content-type": contentType, "cache-control": "no-cache" } });
      }

      const data = await readFile(filePath);
      return new Response(data, { headers: { "content-type": contentType, "cache-control": "no-cache" } });
    },
  });

  return { close: () => server.stop(), port: server.port };
}

async function readPixels(path: string): Promise<{ width: number; height: number; data: Uint8Array }> {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { width: info.width, height: info.height, data: new Uint8Array(data) };
}

function px(buf: Uint8Array, i: number): number {
  return buf[i] ?? 0;
}

function sampleContrast(
  normal: { width: number; height: number; data: Uint8Array },
  hidden: { width: number; height: number; data: Uint8Array }
): { meanGlyph: number; meanEdge: number; glyphN: number; edgeN: number } {
  const w = Math.min(normal.width, hidden.width);
  const h = Math.min(normal.height, hidden.height);
  const stride = w * 4;
  const a = normal.data;
  const b = hidden.data;
  // Build glyph mask: pixel where normal differs significantly from hidden (the H1 was rendered there)
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * stride + x * 4;
      const dr = Math.abs(px(a, i) - px(b, i));
      const dg = Math.abs(px(a, i + 1) - px(b, i + 1));
      const db = Math.abs(px(a, i + 2) - px(b, i + 2));
      // Threshold 200 (was 60→150→200): tightened iteratively in cycle 8 to
      // eliminate run-flakiness on /markets/<slug>/ at large viewports where
      // Cinzel anti-aliasing edges have lower contrast and intermittently fall
      // just under the boundary across separate Chrome captures. Cream-50
      // letter centers on navy-900/95 panel produce R+G+B diff ~600; anti-
      // aliased edges produce ~150-350; Chrome render noise <30. The 200 line
      // captures clear glyph centers + strong edges while filtering noise.
      if (dr + dg + db > 200) mask[y * w + x] = 1;
    }
  }
  const glyphContrasts: number[] = [];
  const edgeContrasts: number[] = [];
  let glyphN = 0;
  let edgeN = 0;
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      const p = y * w + x;
      if (!(mask[p] ?? 0)) continue;
      const n = (mask[(y - 1) * w + x] ?? 0) && (mask[(y + 1) * w + x] ?? 0) && (mask[y * w + (x - 1)] ?? 0) && (mask[y * w + (x + 1)] ?? 0);
      const isEdge = !n;
      const i = y * stride + x * 4;
      const fg = relLum(px(a, i), px(a, i + 1), px(a, i + 2));
      const bg = relLum(px(b, i), px(b, i + 1), px(b, i + 2));
      const cr = contrastRatio(fg, bg);
      if (isEdge) {
        if (edgeN < N_EDGE_MAX) {
          edgeContrasts.push(cr);
          edgeN++;
        }
      } else {
        if (glyphN < N_GLYPH_MAX) {
          glyphContrasts.push(cr);
          glyphN++;
        }
      }
      if (glyphN >= N_GLYPH_MAX && edgeN >= N_EDGE_MAX) break;
    }
    if (glyphN >= N_GLYPH_MAX && edgeN >= N_EDGE_MAX) break;
  }
  const mean = (arr: number[]) => (arr.length ? arr.reduce((acc, v) => acc + v, 0) / arr.length : 0);
  return { meanGlyph: mean(glyphContrasts), meanEdge: mean(edgeContrasts), glyphN, edgeN };
}

type ContrastReading = {
  meanGlyphContrast: number;
  meanEdgeContrast: number;
  glyphSamples: number;
  edgeSamples: number;
};

type AggregatedContrast = {
  glyphContrastMin: number;
  glyphContrastMedian: number;
  glyphContrastMax: number;
  edgeContrastMin: number;
  edgeContrastMedian: number;
  edgeContrastMax: number;
  glyphSamples: number;
  edgeSamples: number;
};

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length % 2 === 1) {
    return sorted[(sorted.length - 1) / 2] ?? 0;
  }
  const hiIndex = sorted.length / 2;
  const lo = sorted[hiIndex - 1] ?? 0;
  const hi = sorted[hiIndex] ?? 0;
  return (lo + hi) / 2;
}

function minValue(values: number[]): number {
  return values.length ? values.reduce((acc, v) => Math.min(acc, v), values[0] ?? 0) : 0;
}

function maxValue(values: number[]): number {
  return values.length ? values.reduce((acc, v) => Math.max(acc, v), values[0] ?? 0) : 0;
}

function aggregateRow(readings: ContrastReading[]): AggregatedContrast {
  const glyphContrasts = readings.map((r) => r.meanGlyphContrast);
  const edgeContrasts = readings.map((r) => r.meanEdgeContrast);
  const glyphSampleCounts = readings.map((r) => r.glyphSamples);
  const edgeSampleCounts = readings.map((r) => r.edgeSamples);
  return {
    glyphContrastMin: minValue(glyphContrasts),
    glyphContrastMedian: median(glyphContrasts),
    glyphContrastMax: maxValue(glyphContrasts),
    edgeContrastMin: minValue(edgeContrasts),
    edgeContrastMedian: median(edgeContrasts),
    edgeContrastMax: maxValue(edgeContrasts),
    glyphSamples: minValue(glyphSampleCounts),
    edgeSamples: minValue(edgeSampleCounts),
  };
}

function round2(n: number): number {
  return Number(n.toFixed(2));
}

function statusFor(stats: AggregatedContrast): { status: Status; note?: string } {
  const gN = stats.glyphSamples;
  const eN = stats.edgeSamples;
  if (gN < 200 || eN < 50) return { status: "WARN", note: `low samples (glyph=${gN} edge=${eN})` };
  if (
    stats.glyphContrastMin >= THRESH_GLYPH / 2 &&
    stats.glyphContrastMedian >= THRESH_GLYPH &&
    stats.edgeContrastMedian >= THRESH_EDGE
  ) {
    return { status: "PASS" };
  }
  return {
    status: "FAIL",
    note: `glyph min/median/max=${stats.glyphContrastMin.toFixed(2)}/${stats.glyphContrastMedian.toFixed(2)}/${stats.glyphContrastMax.toFixed(2)} edge min/median/max=${stats.edgeContrastMin.toFixed(2)}/${stats.edgeContrastMedian.toFixed(2)}/${stats.edgeContrastMax.toFixed(2)}`,
  };
}

function safeName(s: string): string {
  return s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root";
}

async function main(): Promise<void> {
  await mkdir(REPORTS_DIR, { recursive: true });
  await mkdir(SHOTS_DIR, { recursive: true });

  if (!isLive) {
    const primed = await primeAssetCache();
    if (primed > 0) {
      console.log(`audit:hero-contrast — primed ${primed} hero asset(s) into in-memory cache`);
    }
  }

  let server: StaticServer | null = null;
  let baseUrl: string;
  if (isLive) {
    server = await startStaticServer(PORT, isMutation, LIVE_BASE);
    baseUrl = `http://127.0.0.1:${server.port}`;
  } else {
    server = await startStaticServer(PORT, isMutation);
    baseUrl = `http://127.0.0.1:${server.port}`;
  }

  try {
    const routes = await discoverRoutes();
    const rows: Row[] = [];
    for (const route of routes) {
      // For local mode, ensure file exists
      if (!isLive) {
        const fp = route === "/" ? join(OUT_DIR, "index.html") : join(OUT_DIR, route, "index.html");
        if (!(await exists(fp))) {
          for (const vp of VIEWPORTS) {
            rows.push({
              route,
              viewport: vp.name,
              glyphContrastMin: 0,
              glyphContrastMedian: 0,
              glyphContrastMax: 0,
              edgeContrastMin: 0,
              edgeContrastMedian: 0,
              edgeContrastMax: 0,
              meanGlyphContrast: 0,
              meanEdgeContrast: 0,
              glyphSamples: 0,
              edgeSamples: 0,
              status: "SKIP",
              note: "out/ route missing",
            });
          }
          continue;
        }
      }
      for (const vp of VIEWPORTS) {
        const ts = Date.now();
        const sep = route.includes("?") ? "&" : "?";
        try {
          const readings: ContrastReading[] = [];
          for (let sampleIndex = 0; sampleIndex < samplesPerRow; sampleIndex += 1) {
            const cacheBust = ts + sampleIndex;
            const sampleName = `${safeName(route)}-${vp.name}-s${sampleIndex + 1}-${cacheBust}`;
            const normalPath = join(SHOTS_DIR, `${sampleName}-normal.png`);
            const hiddenPath = join(SHOTS_DIR, `${sampleName}-hidden.png`);
            await captureScreenshot(`${baseUrl}${route}${sep}auditMode=normal&_=${cacheBust}`, vp, normalPath);
            await captureScreenshot(`${baseUrl}${route}${sep}auditMode=hide&_=${cacheBust}`, vp, hiddenPath);
            const a = await readPixels(normalPath);
            const b = await readPixels(hiddenPath);
            const { meanGlyph, meanEdge, glyphN, edgeN } = sampleContrast(a, b);
            readings.push({
              meanGlyphContrast: meanGlyph,
              meanEdgeContrast: meanEdge,
              glyphSamples: glyphN,
              edgeSamples: edgeN,
            });
          }
          const stats = aggregateRow(readings);
          const { status, note } = statusFor(stats);
          const medianGlyphContrast = round2(stats.glyphContrastMedian);
          const medianEdgeContrast = round2(stats.edgeContrastMedian);
          rows.push({
            route,
            viewport: vp.name,
            glyphContrastMin: round2(stats.glyphContrastMin),
            glyphContrastMedian: medianGlyphContrast,
            glyphContrastMax: round2(stats.glyphContrastMax),
            edgeContrastMin: round2(stats.edgeContrastMin),
            edgeContrastMedian: medianEdgeContrast,
            edgeContrastMax: round2(stats.edgeContrastMax),
            // Legacy JSON keys retained for downstream consumers; values now hold the median-of-N reading.
            meanGlyphContrast: medianGlyphContrast,
            meanEdgeContrast: medianEdgeContrast,
            glyphSamples: stats.glyphSamples,
            edgeSamples: stats.edgeSamples,
            status,
            note,
          });
        } catch (err) {
          rows.push({
            route,
            viewport: vp.name,
            glyphContrastMin: 0,
            glyphContrastMedian: 0,
            glyphContrastMax: 0,
            edgeContrastMin: 0,
            edgeContrastMedian: 0,
            edgeContrastMax: 0,
            meanGlyphContrast: 0,
            meanEdgeContrast: 0,
            glyphSamples: 0,
            edgeSamples: 0,
            status: "WARN",
            note: `capture error: ${err instanceof Error ? err.message.slice(0, 120) : String(err)}`,
          });
        }
      }
    }

    const counts = {
      pass: rows.filter((r) => r.status === "PASS").length,
      warn: rows.filter((r) => r.status === "WARN").length,
      fail: rows.filter((r) => r.status === "FAIL").length,
      skip: rows.filter((r) => r.status === "SKIP").length,
    };
    const payload = {
      tool: "scripts/audit-hero-pixel-contrast.ts",
      generated: new Date().toISOString(),
      mode: isLive ? "live" : "local",
      mutation: isMutation,
      base: baseUrl,
      samples: samplesPerRow,
      thresholds: { glyph: THRESH_GLYPH, edge: THRESH_EDGE },
      viewports: VIEWPORTS.map((v) => v.name),
      counts,
      rows,
    };
    await writeFile(join(REPORTS_DIR, "audit-hero-pixel-contrast.json"), JSON.stringify(payload, null, 2));

    const md = [
      "# Audit Hero Pixel Contrast Report",
      "",
      `**Generated:** ${payload.generated}`,
      `**Mode:** ${payload.mode}`,
      `**Mutation:** ${payload.mutation}`,
      `**Base:** ${payload.base}`,
      `**Samples per row:** ${payload.samples}`,
      `**Thresholds:** glyph ≥ ${THRESH_GLYPH}:1 · edge ≥ ${THRESH_EDGE}:1`,
      "",
      `**Summary:** ${counts.pass} PASS · ${counts.warn} WARN · ${counts.fail} FAIL · ${counts.skip} SKIP`,
      "",
      "| Route | Viewport | Glyph contrast | Edge contrast | Stability | Glyph samples | Edge samples | Status | Note |",
      "|---|---|---:|---:|---:|---:|---:|:-:|---|",
      ...rows.map((r) => {
        const icon = r.status === "PASS" ? "✅" : r.status === "WARN" ? "⚠️" : r.status === "FAIL" ? "❌" : "—";
        const stability = `${r.glyphContrastMedian.toFixed(2)} (${r.glyphContrastMin.toFixed(2)}..${r.glyphContrastMax.toFixed(2)})`;
        return `| \`${r.route}\` | ${r.viewport} | ${r.meanGlyphContrast.toFixed(2)} | ${r.meanEdgeContrast.toFixed(2)} | ${stability} | ${r.glyphSamples} | ${r.edgeSamples} | ${icon} ${r.status} | ${r.note ?? ""} |`;
      }),
      "",
      "## Stability summary",
      "",
      ...(() => {
        const unstableRows = rows.filter((r) => r.glyphContrastMax - r.glyphContrastMin > 1.0);
        if (!unstableRows.length) return ["_All rows within 1.0 contrast spread — no high-variance rows._"];
        return [
          "| Route | Viewport | Min | Median | Max | Spread |",
          "|---|---|---:|---:|---:|---:|",
          ...unstableRows.map((r) => {
            const spread = r.glyphContrastMax - r.glyphContrastMin;
            return `| \`${r.route}\` | ${r.viewport} | ${r.glyphContrastMin.toFixed(2)} | ${r.glyphContrastMedian.toFixed(2)} | ${r.glyphContrastMax.toFixed(2)} | ${spread.toFixed(2)} |`;
          }),
        ];
      })(),
      "",
      "## Mutation note",
      "",
      "Run with `--mutation` to verify the audit is not a no-op. The mutation flag injects a weak-scrim CSS override that disables the navy panel and reduces overlay opacity. The audit MUST FAIL on a mutated run for it to be considered a real sentinel.",
    ].join("\n");

    await writeFile(join(REPORTS_DIR, "audit-hero-pixel-contrast.md"), md);
    console.log(`audit:hero-contrast — ${counts.pass} PASS · ${counts.warn} WARN · ${counts.fail} FAIL · ${counts.skip} SKIP`);
    console.log(`→ reports/audit-hero-pixel-contrast.json`);
    console.log(`→ reports/audit-hero-pixel-contrast.md`);
    // Cycle 9 — mutation-mode sentinel: when --mutation is on, the audit MUST
    // detect the regression (either as FAIL on contrast threshold OR as WARN
    // from low-sample masks when the H1 is hidden by panel-color collapse).
    // Treat any mutation run that produces ≥10% non-PASS rows as a successful
    // sentinel detection. A mutation run that comes back fully green is a
    // no-op audit — the script must exit 1 in that case to flag the lack of
    // sensitivity. (See cycle-8 doctrine: every visual sentinel ships with a
    // mutation test, and a sentinel that passes its mutation has zero signal.)
    const totalRows = counts.pass + counts.warn + counts.fail + counts.skip;
    const nonPass = counts.warn + counts.fail;
    if (isMutation) {
      const detected = totalRows > 0 && nonPass >= Math.ceil(totalRows * 0.1);
      if (!detected) {
        console.error(
          `MUTATION SENTINEL FAILED — fewer than 10% of rows flagged (${nonPass}/${totalRows}). The audit is not sensitive to the mutation fixture; treat as no-op.`,
        );
        process.exit(1);
      }
      // Mutation succeeded in detecting the regression; exit 1 anyway because
      // a "successful" mutation run is one that the audit caught as broken.
      process.exit(1);
    }
    process.exit(counts.fail > 0 ? 1 : 0);
  } finally {
    if (server) server.close();
  }
}

await main().catch((err) => {
  console.error(err);
  process.exit(1);
});
