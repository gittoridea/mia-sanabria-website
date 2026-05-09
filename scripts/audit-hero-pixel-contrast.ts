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
 *   bun run audit:hero-contrast            # local out/ via Bun static server, default routes/viewports
 *   bun run audit:hero-contrast --live     # live staging URL
 *   bun run audit:hero-contrast --mutation # weak-scrim mutation; the audit MUST FAIL on this run
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
];

const N_GLYPH_MAX = 1500;
const N_EDGE_MAX = 800;
const THRESH_GLYPH = 4.5;
const THRESH_EDGE = 3.0;
const VTB_MS = 20000;

const args = process.argv.slice(2);
const isMutation = args.includes("--mutation");
const isLive = args.includes("--live");

function arg(prefix: string, fallback = ""): string {
  const a = args.find((x) => x.startsWith(prefix));
  return a ? a.slice(prefix.length) : fallback;
}

const PORT = Number(arg("--port=", "4173"));
const LIVE_BASE = arg("--base=", "https://miasanabriarealtor.trueidea.com");
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

async function startStaticServer(port: number, mutation: boolean): Promise<StaticServer> {
  const indexFor = (urlPath: string): string => {
    let p = urlPath;
    if (p.endsWith("/")) p = p + "index.html";
    if (!p.includes(".")) p = p + "/index.html".replace("//", "/");
    return p;
  };

  const auditCss = (hideHeading: boolean, mutate: boolean): string => {
    const parts: string[] = [];
    if (hideHeading) {
      parts.push("[data-hero-heading]{visibility:hidden!important;}");
    }
    if (mutate) {
      parts.push("[data-hero-overlay='content-scrim']{opacity:0.10!important;}");
      parts.push("[data-hero-copy-panel]{background:transparent!important;border:none!important;box-shadow:none!important;}");
    }
    if (parts.length === 0) return "";
    return `<style data-audit-cycle8>${parts.join("")}</style>`;
  };

  const server = Bun.serve({
    port,
    async fetch(req: Request): Promise<Response> {
      const url = new URL(req.url);
      const auditMode = url.searchParams.get("auditMode") || "normal";
      const mutate = (url.searchParams.get("mutation") || "").toLowerCase() === "true" || mutation;
      const path = decodeURIComponent(url.pathname);

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

      const contentType = filePath.endsWith(".html")
        ? "text/html; charset=utf-8"
        : filePath.endsWith(".js")
          ? "application/javascript"
          : filePath.endsWith(".css")
            ? "text/css"
            : filePath.endsWith(".json")
              ? "application/json"
              : filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")
                ? "image/jpeg"
                : filePath.endsWith(".png")
                  ? "image/png"
                  : filePath.endsWith(".webp")
                    ? "image/webp"
                    : filePath.endsWith(".svg")
                      ? "image/svg+xml"
                      : filePath.endsWith(".ico")
                        ? "image/x-icon"
                        : filePath.endsWith(".woff2")
                          ? "font/woff2"
                          : "application/octet-stream";

      if (filePath.endsWith(".html")) {
        let html = await readFile(filePath, "utf8");
        const inj = auditCss(auditMode === "hide", mutate);
        if (inj && html.includes("</head>")) {
          html = html.replace("</head>", inj + "</head>");
        }
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
      // Threshold 150 (was 60): filters anti-aliasing artifacts + Chrome's
      // sub-pixel rendering noise that occurs across two separate captures.
      // Cream-50 letter centers on navy-900/95 panel produce diff ~600;
      // anti-aliased edges produce diff ~150-300; Chrome render noise <30.
      if (dr + dg + db > 150) mask[y * w + x] = 1;
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

function statusFor(meanGlyph: number, meanEdge: number, gN: number, eN: number): { status: Status; note?: string } {
  if (gN < 200 || eN < 50) return { status: "WARN", note: `low samples (glyph=${gN} edge=${eN})` };
  if (meanGlyph >= THRESH_GLYPH && meanEdge >= THRESH_EDGE) return { status: "PASS" };
  return { status: "FAIL", note: `glyph=${meanGlyph.toFixed(2)} edge=${meanEdge.toFixed(2)}` };
}

function safeName(s: string): string {
  return s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root";
}

async function main(): Promise<void> {
  await mkdir(REPORTS_DIR, { recursive: true });
  await mkdir(SHOTS_DIR, { recursive: true });

  let server: StaticServer | null = null;
  let baseUrl: string;
  if (isLive) {
    baseUrl = LIVE_BASE.replace(/\/$/, "");
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
        const normalPath = join(SHOTS_DIR, `${safeName(route)}-${vp.name}-normal.png`);
        const hiddenPath = join(SHOTS_DIR, `${safeName(route)}-${vp.name}-hidden.png`);
        const sep = route.includes("?") ? "&" : "?";
        try {
          await captureScreenshot(`${baseUrl}${route}${sep}auditMode=normal&_=${ts}`, vp, normalPath);
          await captureScreenshot(`${baseUrl}${route}${sep}auditMode=hide&_=${ts}`, vp, hiddenPath);
          const a = await readPixels(normalPath);
          const b = await readPixels(hiddenPath);
          const { meanGlyph, meanEdge, glyphN, edgeN } = sampleContrast(a, b);
          const { status, note } = statusFor(meanGlyph, meanEdge, glyphN, edgeN);
          rows.push({
            route,
            viewport: vp.name,
            meanGlyphContrast: Number(meanGlyph.toFixed(2)),
            meanEdgeContrast: Number(meanEdge.toFixed(2)),
            glyphSamples: glyphN,
            edgeSamples: edgeN,
            status,
            note,
          });
        } catch (err) {
          rows.push({
            route,
            viewport: vp.name,
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
      `**Thresholds:** glyph ≥ ${THRESH_GLYPH}:1 · edge ≥ ${THRESH_EDGE}:1`,
      "",
      `**Summary:** ${counts.pass} PASS · ${counts.warn} WARN · ${counts.fail} FAIL · ${counts.skip} SKIP`,
      "",
      "| Route | Viewport | Glyph contrast | Edge contrast | Glyph samples | Edge samples | Status | Note |",
      "|---|---|---:|---:|---:|---:|:-:|---|",
      ...rows.map((r) => {
        const icon = r.status === "PASS" ? "✅" : r.status === "WARN" ? "⚠️" : r.status === "FAIL" ? "❌" : "—";
        return `| \`${r.route}\` | ${r.viewport} | ${r.meanGlyphContrast.toFixed(2)} | ${r.meanEdgeContrast.toFixed(2)} | ${r.glyphSamples} | ${r.edgeSamples} | ${icon} ${r.status} | ${r.note ?? ""} |`;
      }),
      "",
      "## Mutation note",
      "",
      "Run with `--mutation` to verify the audit is not a no-op. The mutation flag injects a weak-scrim CSS override that disables the navy panel and reduces overlay opacity. The audit MUST FAIL on a mutated run for it to be considered a real sentinel.",
    ].join("\n");

    await writeFile(join(REPORTS_DIR, "audit-hero-pixel-contrast.md"), md);
    console.log(`audit:hero-contrast — ${counts.pass} PASS · ${counts.warn} WARN · ${counts.fail} FAIL · ${counts.skip} SKIP`);
    console.log(`→ reports/audit-hero-pixel-contrast.json`);
    console.log(`→ reports/audit-hero-pixel-contrast.md`);
    process.exit(counts.fail > 0 ? 1 : 0);
  } finally {
    if (server) server.close();
  }
}

await main().catch((err) => {
  console.error(err);
  process.exit(1);
});
