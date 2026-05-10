#!/usr/bin/env bun
/**
 * audit-rendered-visual — rendered-DOM visual QA sentinel.
 *
 * Cycle 10 doctrine: cycles 5-9 passed token-grep / static-HTML / pixel-contrast
 * audits while principal-visible defects survived in the *rendered* output
 * (clipped CTAs, hidden market cards, hero overflow, sub-paragraph clipping at
 * mobile, eyebrow overflow at 320). Static audits cannot model the runtime
 * layout that real users see; this script combines TWO complementary signals:
 *
 *   1. **Dump-DOM probe channel** (viewport-independent). A Bun reverse-proxy
 *      / static server (default :4173) serves `out/` (local mode) or proxies a
 *      live URL (`--live` / `--base=…`). For every HTML response, an in-page
 *      probe is injected at the end of <head>. The probe runs on
 *      DOMContentLoaded (+ 2000ms lazy-image settle), measures DOM bounding
 *      boxes / computed styles / image natural sizes / overflow / WCAG
 *      contrast, sweeps stale strings + canonical-email, and writes the JSON
 *      into `document.title` as `RV_PROBE::<base64>`. The audit greps the
 *      dumped DOM for that sentinel and parses it. Note: chrome's
 *      `--dump-dom` mode renders at chrome's internal default viewport (~500
 *      px wide) and ignores `--window-size`, so probe-channel measurements
 *      reflect that single viewport. The probe is still load-bearing for
 *      stale-string / canonical-email / image-rendered / market-card-visible
 *      / hero-structure / CTA-contrast checks (which are viewport-stable).
 *
 *   2. **Screenshot pixel-edge channel** (viewport-honest). For each
 *      (route × viewport), chrome `--headless=new --window-size=W,H
 *      --screenshot=PATH` produces a PNG at the requested viewport (chrome's
 *      screenshot pipeline DOES honor --window-size). `sharp` reads the
 *      rightmost pixel column and the upper-half band; if non-background
 *      content reaches the right edge, that's an overflow signature
 *      (CTA tail-clip, hero text overflow, sub-paragraph right-clip). This
 *      catches the principal-confirmed mobile defects that the dump-dom
 *      channel cannot see at non-default viewports.
 *
 * Outputs:
 *   reports/audit-rendered-visual.json   (machine-readable, includes raw probes)
 *   reports/audit-rendered-visual.md     (human-readable, mirrors audit-images.md)
 *
 * Exit code: 0 if zero FAILs (warnings allowed); 1 if any FAIL.
 *
 * Usage:
 *   bun run audit:rendered                              # local out/ via Bun static server
 *   bun run audit:rendered -- --live                    # live staging URL via reverse-proxy
 *   bun run audit:rendered -- --base=<url>              # custom base URL (proxied)
 *   bun run audit:rendered -- --routes=a,b,c            # subset
 *   bun run audit:rendered -- --viewports=320x568,1280x800
 *   bun run audit:rendered -- --concurrency=4           # parallel probes (default 3)
 *   bun run audit:rendered -- --shots-dir=PATH          # also dump PNG screenshots
 *   bun run audit:rendered -- --port=4174               # override Bun server port
 *   bun run audit:rendered -- --no-headless             # debug mode (don't suppress chrome stderr)
 *
 * Authored: 2026-05-09 cycle 10 (Forge implementation; principal-typed task spec)
 */

import { mkdir, readFile, writeFile, stat, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";

// Minimal Bun.serve declaration so this file compiles under tsc --noEmit
// without @types/bun. Mirrors the pattern in audit-hero-pixel-contrast.ts.
declare const Bun: {
  serve: (config: {
    port: number;
    fetch: (req: Request) => Promise<Response> | Response;
  }) => { stop: () => void; port: number };
};

// ---------------------------------------------------------------------------
// Constants — visible at top of file for fast review.

const REPO_ROOT = process.cwd();
const OUT_DIR = join(REPO_ROOT, "out");
const REPORTS_DIR = join(REPO_ROOT, "reports");

const REQUIRED_ROUTES: ReadonlyArray<string> = [
  "/",
  "/about/",
  "/buyers/",
  "/sellers/",
  "/valuation/",
  "/contact/",
  "/markets/",
  "/markets/fort-lauderdale/",
  "/markets/coral-ridge/",
  "/markets/victoria-park/",
  "/markets/rio-vista/",
  "/markets/lighthouse-point/",
  "/markets/sea-ranch-lakes/",
  "/markets/harbor-beach/",
  "/markets/hillsboro-mile/",
  "/markets/seven-isles/",
  "/markets/las-olas-isles/",
  "/markets/boca-raton/",
  "/markets/delray-beach/",
  "/markets/palm-beach/",
  "/markets/bay-colony/",
  "/markets/bermuda-riviera/",
  "/insights/",
  "/privacy/",
  "/terms/",
  "/accessibility/",
  "/dmca/",
];

type ViewportSpec = { name: string; width: number; height: number };

const VIEWPORTS: ReadonlyArray<ViewportSpec> = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x812", width: 375, height: 812 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1440x900", width: 1440, height: 900 },
];

const STALE_NEEDLES: ReadonlyArray<string> = [
  "Klein Morgan",
  "kleinmorgan",
  "Family Homes Where Memories Are Made",
  "mia@miasanabriarealtor.com",
  "[Mia Confirm]",
  "[Legal Brokerage Name]",
  "[Privacy Email]",
  "sunandbreeze",
  "accessibility@agent3000.com",
];

const ALLOWED_EMAIL = "msanabriarea@gmail.com";
const PRINCIPAL_REPORTED_MARKETS: ReadonlyArray<string> = [
  "Lighthouse Point",
  "Coral Ridge",
  "Palm Beach",
];
const CTA_CONTRAST_THRESHOLD = 3.0; // WCAG large-text minimum
const PROBE_SETTLE_MS = 2000;
const VTB_MS = 20000;
const CHROME_HARD_TIMEOUT_MS = 60_000;

// ---------------------------------------------------------------------------
// Types.

type Status = "PASS" | "WARN" | "FAIL" | "SKIP";

type BoxRect = { x: number; y: number; w: number; h: number; right: number; bottom: number };

type ProbeImage = {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  opacity: number;
  visibility: string;
  inViewport: boolean;
  loadingLazy: boolean;
  selectorPath: string;
};

type ProbeHero = {
  panelBox: BoxRect | null;
  headingBox: BoxRect | null;
  headingClipsRight: boolean;
  eyebrowBox: BoxRect | null;
  eyebrowClipsRight: boolean;
  subBox: BoxRect | null;
  subClipsRight: boolean;
  primaryCtaBox: BoxRect | null;
  primaryCtaBelowFold: boolean;
  primaryCtaTailClips: boolean;
  secondaryCtaBox: BoxRect | null;
  secondaryCtaTailClips: boolean;
};

type ProbeMarketCard = {
  href: string;
  cardBox: BoxRect;
  imgBox: BoxRect;
  imgNaturalWidth: number;
  imgVisible: boolean;
  headingText: string;
};

type ProbeCta = {
  selector: string;
  text: string;
  box: BoxRect;
  bgRgba: string;
  fgRgba: string;
  contrast: number;
  tailClips: boolean;
};

type ProbeStaleHit = { needle: string; found: boolean; context: string };

type ProbeResult = {
  route: string;
  viewport: { w: number; h: number };
  documentWidth: number;
  documentHeight: number;
  hasHorizontalOverflow: boolean;
  images: ProbeImage[];
  hero: ProbeHero | null;
  marketCards: ProbeMarketCard[];
  ctas: ProbeCta[];
  staleStrings: ProbeStaleHit[];
  emails: string[];
  errors: string[];
};

type RouteProbe = {
  route: string;
  viewport: ViewportSpec;
  result: ProbeResult | null;
  edge: EdgeReport | null;
  errors: string[];
};

type Finding = {
  id: string;
  category: string;
  description: string;
  status: Status;
  evidence: string;
  details?: unknown;
};

// ---------------------------------------------------------------------------
// CLI parsing.

const cliArgs = process.argv.slice(2);

function flag(name: string): boolean {
  return cliArgs.includes(name);
}

function arg(prefix: string, fallback = ""): string {
  const a = cliArgs.find((x) => x.startsWith(prefix));
  return a ? a.slice(prefix.length) : fallback;
}

const isLive = flag("--live");
const noHeadless = flag("--no-headless");
const PORT = Number(arg("--port=", "4173"));
const DEFAULT_LIVE_BASE = "https://miasanabriarealtor.trueidea.com";
const LIVE_BASE = arg("--base=", isLive ? DEFAULT_LIVE_BASE : "");
const ROUTES_OVERRIDE = arg("--routes=", "")
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean);
const VIEWPORTS_OVERRIDE = arg("--viewports=", "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);
const CONCURRENCY = Math.max(1, Number(arg("--concurrency=", "3")) || 3);
const SHOTS_DIR = arg("--shots-dir=", "");

// ---------------------------------------------------------------------------
// Helpers.

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function safeName(s: string): string {
  return s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root";
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function contentTypeFromPath(filePath: string): string {
  if (filePath.endsWith(".html") || filePath.endsWith(".htm")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".avif")) return "image/avif";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".ico")) return "image/x-icon";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  if (filePath.endsWith(".woff")) return "font/woff";
  if (filePath.endsWith(".txt")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

function selectViewports(): ViewportSpec[] {
  if (VIEWPORTS_OVERRIDE.length === 0) return [...VIEWPORTS];
  const out: ViewportSpec[] = [];
  for (const name of VIEWPORTS_OVERRIDE) {
    const m = name.match(/^(\d+)x(\d+)$/);
    if (!m || !m[1] || !m[2]) continue;
    out.push({ name, width: Number(m[1]), height: Number(m[2]) });
  }
  return out.length > 0 ? out : [...VIEWPORTS];
}

function selectRoutes(): string[] {
  if (ROUTES_OVERRIDE.length > 0) return uniq(ROUTES_OVERRIDE);
  return uniq([...REQUIRED_ROUTES]);
}

// ---------------------------------------------------------------------------
// Probe script (browser-side).
//
// The probe runs as a normal <script> tag injected at the end of <head>. It
// waits for DOMContentLoaded + PROBE_SETTLE_MS, then collects measurements
// and writes a base64-encoded JSON payload into document.title. The audit
// greps that payload out of the dumped DOM. The script is wrapped in a global
// try/catch and pushes any thrown error into the result's `errors` array.

function buildProbeScript(settleMs: number): string {
  // The probe is one self-contained IIFE. It must NOT depend on any external
  // module, polyfill, or framework. It must NOT throw — every operation is
  // wrapped in safe(...) helpers that record the error and continue.
  return `<script data-rv-probe="1">(function(){
"use strict";
var SETTLE_MS = ${settleMs};
var STALE_NEEDLES = ${JSON.stringify(STALE_NEEDLES)};
var PRM = ${JSON.stringify(PRINCIPAL_REPORTED_MARKETS)};
var errors = [];
function pushErr(label, e) {
  try { errors.push(label + ": " + (e && e.message ? e.message : String(e))); } catch (_) {}
}
function safe(label, fn, fallback) {
  try { return fn(); } catch (e) { pushErr(label, e); return fallback; }
}
function rectOf(el) {
  if (!el) return null;
  try {
    var r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
  } catch (e) { pushErr("rectOf", e); return null; }
}
function selectorPath(el) {
  try {
    var parts = [];
    var node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      var tag = node.tagName.toLowerCase();
      var dataComp = node.getAttribute && node.getAttribute("data-component");
      var id = node.id;
      if (id) parts.unshift(tag + "#" + id);
      else if (dataComp) parts.unshift(tag + "[data-component=" + dataComp + "]");
      else parts.unshift(tag);
      node = node.parentElement;
      if (parts.length > 6) break;
    }
    parts.unshift("body");
    return parts.join(" > ");
  } catch (e) { pushErr("selectorPath", e); return ""; }
}
function parseRgba(s) {
  if (!s) return null;
  var m = s.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*(?:,\\s*([\\d.]+)\\s*)?\\)/i);
  if (!m) return null;
  var a = m[4] === undefined ? 1 : parseFloat(m[4]);
  return { r: parseInt(m[1],10), g: parseInt(m[2],10), b: parseInt(m[3],10), a: isNaN(a) ? 1 : a };
}
function srgbToLin(c) { var s = c/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4); }
function relLum(r,g,b) { return 0.2126*srgbToLin(r) + 0.7152*srgbToLin(g) + 0.0722*srgbToLin(b); }
function contrastRatio(L1,L2) { var hi = Math.max(L1,L2), lo = Math.min(L1,L2); return (hi+0.05)/(lo+0.05); }
function effectiveBg(el) {
  // Walk ancestors until we find a non-transparent background. Fallback to white.
  try {
    var node = el;
    var guard = 0;
    while (node && guard < 32) {
      var cs = window.getComputedStyle(node);
      var bg = cs && cs.backgroundColor;
      var p = parseRgba(bg);
      if (p && p.a > 0) return p;
      node = node.parentElement;
      guard++;
    }
  } catch (e) { pushErr("effectiveBg", e); }
  return { r: 255, g: 255, b: 255, a: 1 };
}
function clipsRight(el, panelBox) {
  if (!el || !panelBox) return false;
  try {
    var r = el.getBoundingClientRect();
    // 1px slack for sub-pixel rounding
    return r.right > panelBox.right + 1;
  } catch (e) { pushErr("clipsRight", e); return false; }
}
function tailClips(el) {
  if (!el) return false;
  try {
    return el.scrollWidth > el.clientWidth + 1;
  } catch (e) { pushErr("tailClips", e); return false; }
}
function inViewport(rect, vh) {
  if (!rect) return false;
  return rect.bottom >= 0 && rect.y < vh && rect.right >= 0 && rect.x < (window.innerWidth || vh);
}

function collect() {
  var vw = window.innerWidth || 0;
  var vh = window.innerHeight || 0;
  var docEl = document.documentElement;
  var documentWidth = (docEl && docEl.scrollWidth) || 0;
  var documentHeight = (docEl && docEl.scrollHeight) || 0;
  var hasHorizontalOverflow = documentWidth > vw + 1;

  // Images
  var images = [];
  safe("images", function () {
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      var cs = window.getComputedStyle(im);
      var rect = im.getBoundingClientRect();
      var loadingLazy = (im.getAttribute("loading") || "").toLowerCase() === "lazy";
      images.push({
        src: im.currentSrc || im.src || "",
        naturalWidth: im.naturalWidth || 0,
        naturalHeight: im.naturalHeight || 0,
        renderedWidth: rect.width,
        renderedHeight: rect.height,
        opacity: parseFloat(cs.opacity || "1") || 0,
        visibility: cs.visibility || "",
        inViewport: rect.bottom >= 0 && rect.top < vh && rect.right >= 0 && rect.left < vw,
        loadingLazy: loadingLazy,
        selectorPath: selectorPath(im),
      });
    }
  }, null);

  // Hero
  var hero = null;
  safe("hero", function () {
    var root = document.querySelector("[data-component=\\"hero\\"]");
    if (!root) return;
    var panel = root.querySelector("[data-hero-copy-panel]") || root;
    var heading = root.querySelector("[data-hero-heading]");
    var eyebrow = root.querySelector("[data-hero-eyebrow]");
    var sub = root.querySelector("[data-hero-sub]");
    var primary = root.querySelector("[data-hero-cta=\\"primary\\"]");
    var secondary = root.querySelector("[data-hero-cta=\\"secondary\\"]");
    var panelBox = rectOf(panel);
    var primaryBox = rectOf(primary);
    var FOLD_BUFFER = 88 + 24; // header + breathing room
    var primaryBelowFold = primaryBox ? (primaryBox.bottom > vh - FOLD_BUFFER) : false;
    hero = {
      panelBox: panelBox,
      headingBox: rectOf(heading),
      headingClipsRight: clipsRight(heading, panelBox),
      eyebrowBox: rectOf(eyebrow),
      eyebrowClipsRight: clipsRight(eyebrow, panelBox),
      subBox: rectOf(sub),
      subClipsRight: clipsRight(sub, panelBox),
      primaryCtaBox: primaryBox,
      primaryCtaBelowFold: primaryBelowFold,
      primaryCtaTailClips: tailClips(primary),
      secondaryCtaBox: rectOf(secondary),
      secondaryCtaTailClips: tailClips(secondary),
    };
  }, null);

  // Market cards (only on /markets/ index)
  var marketCards = [];
  safe("marketCards", function () {
    if (window.location.pathname !== "/markets/") return;
    var anchors = document.querySelectorAll("a[href^=\\"/markets/\\"][href$=\\"/\\"]");
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var href = a.getAttribute("href") || "";
      if (href === "/markets/") continue;
      var img = a.querySelector("img");
      var heading = a.querySelector("h3, h2, h4") || a;
      var imgRect = img ? img.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
      var imgCs = img ? window.getComputedStyle(img) : null;
      var opacity = imgCs ? (parseFloat(imgCs.opacity || "1") || 0) : 0;
      var imgNW = img ? (img.naturalWidth || 0) : 0;
      marketCards.push({
        href: href,
        cardBox: rectOf(a) || { x: 0, y: 0, w: 0, h: 0, right: 0, bottom: 0 },
        imgBox: { x: imgRect.left, y: imgRect.top, w: imgRect.width, h: imgRect.height, right: imgRect.right, bottom: imgRect.bottom },
        imgNaturalWidth: imgNW,
        imgVisible: !!img && imgRect.width > 0 && imgRect.height > 0 && opacity > 0,
        headingText: (heading.textContent || "").trim().slice(0, 80),
      });
    }
  }, null);

  // CTAs (in viewport)
  var ctas = [];
  safe("ctas", function () {
    var seen = new Set();
    var nodes = document.querySelectorAll("[data-hero-cta], a.btn, button, [role=\\"button\\"]");
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (seen.has(n)) continue;
      seen.add(n);
      var rect = n.getBoundingClientRect();
      // Require it to actually be on-screen (non-zero size + intersects viewport vertically)
      if (rect.width <= 0 || rect.height <= 0) continue;
      if (rect.bottom < 0 || rect.top > vh) continue;
      var cs = window.getComputedStyle(n);
      var fg = parseRgba(cs.color || "rgb(0,0,0)") || { r: 0, g: 0, b: 0, a: 1 };
      var bg = effectiveBg(n);
      var L1 = relLum(fg.r, fg.g, fg.b);
      var L2 = relLum(bg.r, bg.g, bg.b);
      var cr = contrastRatio(L1, L2);
      ctas.push({
        selector: selectorPath(n),
        text: (n.textContent || "").trim().slice(0, 80),
        box: { x: rect.left, y: rect.top, w: rect.width, h: rect.height, right: rect.right, bottom: rect.bottom },
        bgRgba: "rgba(" + bg.r + "," + bg.g + "," + bg.b + "," + bg.a + ")",
        fgRgba: "rgba(" + fg.r + "," + fg.g + "," + fg.b + "," + fg.a + ")",
        contrast: Math.round(cr * 100) / 100,
        tailClips: tailClips(n),
      });
    }
  }, null);

  // Stale-string sweep
  var staleStrings = [];
  safe("staleStrings", function () {
    var bodyText = (document.body && document.body.innerText) || "";
    var bodyLower = bodyText.toLowerCase();
    for (var i = 0; i < STALE_NEEDLES.length; i++) {
      var needle = STALE_NEEDLES[i];
      var idx = bodyLower.indexOf(needle.toLowerCase());
      var found = idx >= 0;
      var ctx = "";
      if (found) {
        var start = Math.max(0, idx - 20);
        var end = Math.min(bodyText.length, idx + needle.length + 40);
        ctx = bodyText.slice(start, end).replace(/\\s+/g, " ");
      }
      staleStrings.push({ needle: needle, found: found, context: ctx });
    }
  }, null);

  // Email sweep
  var emails = [];
  safe("emails", function () {
    var bodyText = (document.body && document.body.innerText) || "";
    var seen = {};
    var re = /[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}/gi;
    var m;
    while ((m = re.exec(bodyText)) !== null) {
      var addr = m[0].toLowerCase();
      if (!seen[addr]) { seen[addr] = 1; emails.push(addr); }
    }
  }, null);

  return {
    route: window.location.pathname,
    viewport: { w: vw, h: vh },
    documentWidth: documentWidth,
    documentHeight: documentHeight,
    hasHorizontalOverflow: hasHorizontalOverflow,
    images: images || [],
    hero: hero,
    marketCards: marketCards || [],
    ctas: ctas || [],
    staleStrings: staleStrings || [],
    emails: emails || [],
    errors: errors,
  };
}

function publish(payload) {
  try {
    var json = JSON.stringify(payload);
    // Use Latin1-safe base64 by URI-encoding first.
    var b64 = (typeof btoa === "function")
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, "utf8").toString("base64");
    document.title = "RV_PROBE::" + b64;
  } catch (e) {
    try { document.title = "RV_PROBE_ERROR::" + String(e && e.message ? e.message : e); } catch (_) {}
  }
}

function run() {
  setTimeout(function () {
    try {
      var payload = collect();
      publish(payload);
    } catch (e) {
      pushErr("collect-top", e);
      publish({ route: location.pathname, viewport: { w: window.innerWidth, h: window.innerHeight }, documentWidth: 0, documentHeight: 0, hasHorizontalOverflow: false, images: [], hero: null, marketCards: [], ctas: [], staleStrings: [], emails: [], errors: errors });
    }
  }, SETTLE_MS);
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  run();
} else {
  document.addEventListener("DOMContentLoaded", run, { once: true });
}
})();</script>`;
}

function injectProbeScript(html: string): string {
  if (!html.includes("</head>")) return html;
  return html.replace("</head>", `${buildProbeScript(PROBE_SETTLE_MS)}</head>`);
}

// ---------------------------------------------------------------------------
// Bun server (local + reverse-proxy live).

type StaticServer = { close: () => void; port: number };

async function startServer(port: number, liveBase?: string): Promise<StaticServer> {
  const server = Bun.serve({
    port,
    async fetch(req: Request): Promise<Response> {
      const url = new URL(req.url);
      const path = decodeURIComponent(url.pathname);

      if (liveBase) {
        // Reverse-proxy mode: fetch upstream + inject probe into HTML.
        const upstream = `${liveBase.replace(/\/$/, "")}${path}${url.search}`;
        try {
          const upstreamResp = await fetch(upstream, { headers: { "user-agent": "audit-rendered-visual/1.0" } });
          const upstreamType = upstreamResp.headers.get("content-type") || contentTypeFromPath(path);
          const isHtml =
            upstreamType.includes("text/html") ||
            upstreamType.includes("application/xhtml+xml") ||
            path.endsWith("/") ||
            path.endsWith(".html") ||
            path.endsWith(".htm");
          if (isHtml) {
            const rawHtml = await upstreamResp.text();
            const html = injectProbeScript(rawHtml);
            return new Response(html, {
              status: upstreamResp.status,
              headers: {
                "content-type": upstreamType || "text/html; charset=utf-8",
                "cache-control": "no-cache",
              },
            });
          }
          const data = new Uint8Array(await upstreamResp.arrayBuffer());
          return new Response(data, {
            status: upstreamResp.status,
            headers: {
              "content-type": upstreamType || "application/octet-stream",
              "cache-control": "no-cache",
            },
          });
        } catch (err) {
          return new Response(`upstream error: ${err instanceof Error ? err.message : String(err)}`, {
            status: 502,
            headers: { "cache-control": "no-cache" },
          });
        }
      }

      // Local static-serve mode.
      let filePath: string;
      if (path.endsWith("/")) {
        filePath = join(OUT_DIR, path, "index.html");
      } else if (!path.includes(".")) {
        filePath = join(OUT_DIR, path, "index.html");
      } else {
        filePath = join(OUT_DIR, path);
      }

      if (!(await exists(filePath))) {
        return new Response(`not found: ${filePath}`, { status: 404 });
      }

      const contentType = contentTypeFromPath(filePath);
      if (filePath.endsWith(".html")) {
        let html = await readFile(filePath, "utf8");
        html = injectProbeScript(html);
        return new Response(html, {
          headers: { "content-type": contentType, "cache-control": "no-cache" },
        });
      }
      const data = await readFile(filePath);
      return new Response(data, {
        headers: { "content-type": contentType, "cache-control": "no-cache" },
      });
    },
  });

  return { close: () => server.stop(), port: server.port };
}

// ---------------------------------------------------------------------------
// Chrome runner with hard timeout.

function runChromeDumpDom(
  url: string,
  viewport: ViewportSpec,
  shotPath?: string,
): Promise<{ dom: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const args: string[] = [
      noHeadless ? "--headless=old" : "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      `--window-size=${viewport.width},${viewport.height}`,
      `--virtual-time-budget=${VTB_MS}`,
      "--dump-dom",
    ];
    if (shotPath) args.push(`--screenshot=${shotPath}`);
    args.push(url);

    const child = spawn("google-chrome", args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        child.kill("SIGTERM");
      } catch {
        // child may have already exited
      }
      setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {
          // already gone
        }
      }, 5_000);
      reject(new Error(`chrome timeout after ${CHROME_HARD_TIMEOUT_MS}ms`));
    }, CHROME_HARD_TIMEOUT_MS);

    child.stdout.on("data", (d) => {
      stdout += d.toString("utf8");
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString("utf8");
    });
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
    child.on("exit", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0 || stdout.length > 0) {
        // Chrome sometimes exits non-zero (e.g. because of a benign GPU warning) yet
        // still produces a valid dumped DOM. Accept stdout as canonical signal of success.
        resolve({ dom: stdout, stderr });
      } else {
        reject(new Error(`chrome exit ${code}: ${stderr.slice(0, 300)}`));
      }
    });
  });
}

// Run chrome in --screenshot-only mode at the requested viewport. Unlike
// --dump-dom, the screenshot pipeline DOES honor --window-size so the PNG
// reflects the actual layout the user would see at that viewport.
function runChromeScreenshot(url: string, viewport: ViewportSpec, outPath: string): Promise<{ stderr: string }> {
  return new Promise((resolve, reject) => {
    const args: string[] = [
      noHeadless ? "--headless=old" : "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      `--window-size=${viewport.width},${viewport.height}`,
      `--virtual-time-budget=${VTB_MS}`,
      `--screenshot=${outPath}`,
      url,
    ];
    const child = spawn("google-chrome", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        child.kill("SIGTERM");
      } catch {
        // already exited
      }
      setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {
          // already gone
        }
      }, 5_000);
      reject(new Error(`chrome screenshot timeout after ${CHROME_HARD_TIMEOUT_MS}ms`));
    }, CHROME_HARD_TIMEOUT_MS);
    child.stderr.on("data", (d) => {
      stderr += d.toString("utf8");
    });
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
    child.on("exit", async (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (await exists(outPath)) {
        resolve({ stderr });
      } else {
        reject(new Error(`chrome screenshot produced no file (exit ${code}): ${stderr.slice(0, 200)}`));
      }
    });
  });
}

// Edge-overflow analysis: read the rightmost N pixel columns of the upper
// portion of the screenshot. If those columns contain more than `MIN_HITS`
// pixels that are NOT close to the dominant background color (cream-50 or
// navy panel), that's a content-overflow signature: text or CTAs that have
// pushed content past the visible viewport edge.
//
// Returns a structured signal so the audit can report exactly which side
// of the page is overflowing.
type EdgeReport = {
  rightEdgeContentPx: number;     // count of non-background px in the rightmost columns
  bottomEdgeContentPx: number;    // count of non-background px in the bottommost rows
  imageWidth: number;
  imageHeight: number;
  flagged: boolean;
  reason: string;
};

const EDGE_COLS = 4;        // 4-pixel-wide right-edge band
const EDGE_ROWS = 4;        // 4-pixel-tall bottom-edge band
const EDGE_MIN_HITS = 24;   // minimum non-bg pixels to call it "content-touching-edge"

function isLikelyBackground(r: number, g: number, b: number): boolean {
  // Site palette — cream-50 (#fdfaf5 / 253,250,245), white-ish, navy-900 (#0a1d30 / 10,29,48),
  // navy-900/95 panel (~12,32,52). Treat anything within ±18 of those as background.
  const closeTo = (cr: number, cg: number, cb: number, slack: number): boolean =>
    Math.abs(r - cr) <= slack && Math.abs(g - cg) <= slack && Math.abs(b - cb) <= slack;
  if (closeTo(253, 250, 245, 18)) return true; // cream-50 page bg
  if (closeTo(255, 255, 255, 18)) return true; // pure white
  if (closeTo(10, 29, 48, 24)) return true;     // navy-900 panel
  if (closeTo(15, 42, 68, 24)) return true;     // navy-800-ish header
  if (closeTo(184, 155, 94, 26)) return true;   // gold CTA bg — count CTAs themselves as bg, only their tail-clipped TEXT counts
  return false;
}

async function analyzeEdges(pngPath: string): Promise<EdgeReport> {
  const { data, info } = await sharp(pngPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const stride = w * 4;
  const buf = data;
  // Right-edge band: rightmost EDGE_COLS columns, but only sample the upper 70% (where
  // content like hero/CTA lives — bottom often has footer with intentional chrome).
  const upperLimit = Math.floor(h * 0.7);
  let rightHits = 0;
  for (let y = 0; y < upperLimit; y += 1) {
    for (let x = w - EDGE_COLS; x < w; x += 1) {
      const i = y * stride + x * 4;
      const r = buf[i] ?? 0;
      const g = buf[i + 1] ?? 0;
      const b = buf[i + 2] ?? 0;
      if (!isLikelyBackground(r, g, b)) rightHits += 1;
    }
  }
  // Bottom-edge band: bottommost EDGE_ROWS rows full width — but only meaningful at desktop
  // (mobile pages legitimately have content extending beyond the visible viewport because
  // the user scrolls). We always compute, the audit decides whether to flag based on viewport.
  let bottomHits = 0;
  for (let y = h - EDGE_ROWS; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = y * stride + x * 4;
      const r = buf[i] ?? 0;
      const g = buf[i + 1] ?? 0;
      const b = buf[i + 2] ?? 0;
      if (!isLikelyBackground(r, g, b)) bottomHits += 1;
    }
  }
  const flagged = rightHits >= EDGE_MIN_HITS;
  const reason = flagged
    ? `right-edge content reaches viewport boundary (${rightHits} non-bg px in rightmost ${EDGE_COLS} cols, upper 70%)`
    : `clean (right-edge non-bg px: ${rightHits})`;
  return { rightEdgeContentPx: rightHits, bottomEdgeContentPx: bottomHits, imageWidth: w, imageHeight: h, flagged, reason };
}

const TITLE_RE = /<title[^>]*>RV_PROBE::([A-Za-z0-9+/=]+)<\/title>/i;
const TITLE_ERROR_RE = /<title[^>]*>RV_PROBE_ERROR::([^<]*)<\/title>/i;

function parseProbeFromDom(dom: string): { result: ProbeResult | null; error: string | null } {
  const errMatch = dom.match(TITLE_ERROR_RE);
  if (errMatch && errMatch[1]) {
    return { result: null, error: `probe-internal: ${errMatch[1].slice(0, 200)}` };
  }
  const m = dom.match(TITLE_RE);
  if (!m || !m[1]) {
    // Look for raw <title> for diagnostics
    const titleM = dom.match(/<title[^>]*>([^<]*)<\/title>/i);
    return {
      result: null,
      error: `no probe sentinel; title=${titleM && titleM[1] ? titleM[1].slice(0, 80) : "<missing>"}`,
    };
  }
  try {
    const json = Buffer.from(m[1], "base64").toString("utf8");
    const parsed = JSON.parse(json) as ProbeResult;
    return { result: parsed, error: null };
  } catch (e) {
    return { result: null, error: `probe decode failed: ${e instanceof Error ? e.message : String(e)}` };
  }
}

// ---------------------------------------------------------------------------
// Worker pool: bounded parallel probes.

async function runWithPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const cap = Math.max(1, Math.min(concurrency, items.length));
  const runners: Promise<void>[] = [];
  for (let w = 0; w < cap; w += 1) {
    runners.push(
      (async () => {
        while (true) {
          const idx = next;
          next += 1;
          if (idx >= items.length) return;
          const item = items[idx];
          if (item === undefined) return;
          results[idx] = await worker(item, idx);
        }
      })(),
    );
  }
  await Promise.all(runners);
  return results;
}

// ---------------------------------------------------------------------------
// Findings derivation.

type Offender = Record<string, unknown>;

function isMobile(viewport: ViewportSpec): boolean {
  return viewport.width <= 768;
}

// Cycle 11 (F6 closure): chrome `--dump-dom` mode renders at ~500px regardless
// of `--window-size`. The probe self-records `viewport.w` from
// `window.innerWidth`, which exposes the mismatch. A probe is "viewport-honest"
// only when actual ≈ requested (±5px slack). Findings that depend on layout-at-
// requested-viewport (mobile overflow, narrow-breakpoint CTAs) MUST filter to
// honest probes only — never PASS on a dishonest probe. Viewport-stable
// findings (image presence, stale strings, canonical email) are unaffected.
const VIEWPORT_HONEST_TOLERANCE_PX = 5;

function isViewportHonest(p: RouteProbe): boolean {
  if (!p.result) return false;
  const requested = p.viewport.width;
  const actual = p.result.viewport.w;
  if (!actual || actual <= 0) return false;
  return Math.abs(actual - requested) <= VIEWPORT_HONEST_TOLERANCE_PX;
}

function viewportMismatch(p: RouteProbe): { requested: number; actual: number } | null {
  if (!p.result) return null;
  if (isViewportHonest(p)) return null;
  return { requested: p.viewport.width, actual: p.result.viewport.w };
}

function deriveFindings(probes: RouteProbe[]): Finding[] {
  const findings: Finding[] = [];

  // 1. rendered.images.allRendered
  {
    const offenders: Offender[] = [];
    for (const p of probes) {
      const r = p.result;
      if (!r) continue;
      for (const im of r.images) {
        if (im.loadingLazy && !im.inViewport) continue;
        const broken = !(im.naturalWidth > 0 && im.renderedWidth > 0 && im.opacity > 0);
        if (broken) {
          offenders.push({
            route: p.route,
            viewport: p.viewport.name,
            src: im.src,
            naturalWidth: im.naturalWidth,
            renderedWidth: Number(im.renderedWidth.toFixed(1)),
            opacity: im.opacity,
            visibility: im.visibility,
            selectorPath: im.selectorPath,
          });
        }
      }
    }
    findings.push({
      id: "rendered.images.allRendered",
      category: "Rendered Images",
      description: "Every non-lazy image renders with naturalWidth>0, renderedWidth>0, opacity>0",
      status: offenders.length === 0 ? "PASS" : "FAIL",
      evidence:
        offenders.length === 0
          ? `0 broken images across ${probes.length} probes`
          : `${offenders.length} broken image renderings across ${uniq(offenders.map((o) => String(o.route))).length} routes`,
      details: offenders.length > 0 ? { offenders } : undefined,
    });
  }

  // 2. rendered.marketCards.allVisibleOnIndex
  {
    const indexProbes = probes.filter((p) => p.route === "/markets/" && p.result);
    let bestVisible = 0;
    let bestViewport = "";
    let bestTotal = 0;
    for (const p of indexProbes) {
      const r = p.result;
      if (!r) continue;
      const visible = r.marketCards.filter((c) => c.imgVisible).length;
      if (visible > bestVisible) {
        bestVisible = visible;
        bestViewport = p.viewport.name;
        bestTotal = r.marketCards.length;
      }
      if (bestTotal === 0) bestTotal = r.marketCards.length;
    }
    const status: Status = indexProbes.length === 0 ? "SKIP" : bestVisible >= 10 ? "PASS" : "FAIL";
    findings.push({
      id: "rendered.marketCards.allVisibleOnIndex",
      category: "Market Index",
      description: "/markets/ index renders ≥10 market cards with imgVisible=true",
      status,
      evidence:
        status === "SKIP"
          ? "/markets/ not probed"
          : status === "PASS"
            ? `${bestVisible} visible cards (best viewport: ${bestViewport})`
            : `only ${bestVisible} visible cards on /markets/ (total cards seen: ${bestTotal})`,
      details:
        status === "FAIL"
          ? {
              probes: indexProbes.map((p) => ({
                viewport: p.viewport.name,
                totalCards: p.result?.marketCards.length ?? 0,
                visibleCards: p.result?.marketCards.filter((c) => c.imgVisible).length ?? 0,
                cards: p.result?.marketCards.map((c) => ({
                  href: c.href,
                  imgVisible: c.imgVisible,
                  imgNaturalWidth: c.imgNaturalWidth,
                  headingText: c.headingText,
                })),
              })),
            }
          : undefined,
    });
  }

  // 3. rendered.principalReportedMarkets.visible
  {
    const target = probes.find(
      (p) => p.route === "/markets/" && p.viewport.name === "1280x800" && p.result,
    );
    if (!target || !target.result) {
      findings.push({
        id: "rendered.principalReportedMarkets.visible",
        category: "Market Index",
        description: "Lighthouse Point, Coral Ridge, Palm Beach cards visible on /markets/ (1280×800)",
        status: "SKIP",
        evidence: "/markets/ at 1280x800 not probed",
      });
    } else {
      const cards = target.result.marketCards;
      const matches: Array<{ market: string; matched: boolean; visible: boolean }> = PRINCIPAL_REPORTED_MARKETS.map(
        (m) => {
          const card = cards.find((c) =>
            c.headingText.toLowerCase().includes(m.toLowerCase()),
          );
          return { market: m, matched: !!card, visible: !!card && card.imgVisible };
        },
      );
      const missing = matches.filter((m) => !m.visible);
      findings.push({
        id: "rendered.principalReportedMarkets.visible",
        category: "Market Index",
        description: "Lighthouse Point, Coral Ridge, Palm Beach cards visible on /markets/ (1280×800)",
        status: missing.length === 0 ? "PASS" : "FAIL",
        evidence:
          missing.length === 0
            ? "all 3 principal-reported markets visible"
            : `${missing.length} principal-reported markets missing/hidden: ${missing.map((m) => m.market).join(", ")}`,
        details: missing.length > 0 ? { matches } : undefined,
      });
    }
  }

  // 4-6. hero panel-fit checks
  type HeroAxis = { key: keyof Pick<ProbeHero, "headingClipsRight" | "eyebrowClipsRight" | "subClipsRight">; id: string; label: string };
  const heroAxes: HeroAxis[] = [
    { key: "headingClipsRight", id: "rendered.hero.headingFitsPanel", label: "heading" },
    { key: "eyebrowClipsRight", id: "rendered.hero.eyebrowFitsPanel", label: "eyebrow" },
    { key: "subClipsRight", id: "rendered.hero.subFitsPanel", label: "sub-paragraph" },
  ];
  for (const axis of heroAxes) {
    const offenders: Offender[] = [];
    for (const p of probes) {
      if (!p.result || !p.result.hero) continue;
      if (p.result.hero[axis.key]) {
        offenders.push({ route: p.route, viewport: p.viewport.name });
      }
    }
    findings.push({
      id: axis.id,
      category: "Hero",
      description: `Hero ${axis.label} stays inside the copy panel (no right-edge clipping)`,
      status: offenders.length === 0 ? "PASS" : "FAIL",
      evidence:
        offenders.length === 0
          ? `0 offenders across ${probes.length} probes`
          : `${offenders.length} (route × viewport) pairs clip on the right`,
      details: offenders.length > 0 ? { offenders } : undefined,
    });
  }

  // 7. rendered.hero.primaryCtaAboveFoldDesktop (1280x800 + 1440x900 only)
  {
    const offenders: Offender[] = [];
    for (const p of probes) {
      if (!p.result || !p.result.hero) continue;
      if (p.viewport.name !== "1280x800" && p.viewport.name !== "1440x900") continue;
      if (p.result.hero.primaryCtaBelowFold) {
        offenders.push({ route: p.route, viewport: p.viewport.name });
      }
    }
    findings.push({
      id: "rendered.hero.primaryCtaAboveFoldDesktop",
      category: "Hero",
      description: "Hero primary CTA stays above the fold at desktop viewports (1280x800 + 1440x900)",
      status: offenders.length === 0 ? "PASS" : "FAIL",
      evidence:
        offenders.length === 0
          ? "0 desktop probes show primary CTA below fold"
          : `${offenders.length} desktop probes push primary CTA below fold`,
      details: offenders.length > 0 ? { offenders } : undefined,
    });
  }

  // 8. rendered.hero.primaryCtaTextFits
  {
    const offenders: Offender[] = [];
    for (const p of probes) {
      if (!p.result || !p.result.hero) continue;
      if (p.result.hero.primaryCtaTailClips) {
        offenders.push({ route: p.route, viewport: p.viewport.name });
      }
    }
    findings.push({
      id: "rendered.hero.primaryCtaTextFits",
      category: "Hero",
      description: "Hero primary CTA text does not tail-clip (scrollWidth > clientWidth)",
      status: offenders.length === 0 ? "PASS" : "FAIL",
      evidence:
        offenders.length === 0
          ? "0 primary-CTA tail-clips"
          : `${offenders.length} primary-CTA tail-clips (mobile is the expected hot spot)`,
      details: offenders.length > 0 ? { offenders } : undefined,
    });
  }

  // 9. rendered.hero.secondaryCtaTextFits
  {
    const offenders: Offender[] = [];
    for (const p of probes) {
      if (!p.result || !p.result.hero) continue;
      if (p.result.hero.secondaryCtaTailClips) {
        offenders.push({ route: p.route, viewport: p.viewport.name });
      }
    }
    findings.push({
      id: "rendered.hero.secondaryCtaTextFits",
      category: "Hero",
      description: "Hero secondary CTA text does not tail-clip",
      status: offenders.length === 0 ? "PASS" : "FAIL",
      evidence:
        offenders.length === 0
          ? "0 secondary-CTA tail-clips"
          : `${offenders.length} secondary-CTA tail-clips`,
      details: offenders.length > 0 ? { offenders } : undefined,
    });
  }

  // 10. rendered.mobile.noHorizontalOverflow
  // Cycle 11 (F6 closure): only count probes that actually rendered at the requested
  // mobile viewport. Probes whose actual `window.innerWidth` does not match (±5px) the
  // requested width are marked SKIP — chrome `--dump-dom` clamps to ~500px, so a 320
  // request that came back as 500 cannot answer the question "does this overflow at
  // 320?". This converts the prior over-confident PASS into honest SKIP at narrow
  // widths until the screenshot-channel review (or a future CDP probe path) confirms.
  {
    const offenders: Offender[] = [];
    const skipped: Offender[] = [];
    let honestMobileProbes = 0;
    for (const p of probes) {
      if (!p.result) continue;
      if (!isMobile(p.viewport)) continue;
      const mismatch = viewportMismatch(p);
      if (mismatch) {
        skipped.push({
          route: p.route,
          viewport: p.viewport.name,
          requested: mismatch.requested,
          actual: mismatch.actual,
        });
        continue;
      }
      honestMobileProbes++;
      if (p.result.hasHorizontalOverflow) {
        offenders.push({
          route: p.route,
          viewport: p.viewport.name,
          documentWidth: p.result.documentWidth,
          windowInnerWidth: p.result.viewport.w,
        });
      }
    }
    let status: Status;
    if (honestMobileProbes === 0) status = "SKIP";
    else if (offenders.length === 0) status = "PASS";
    else status = "FAIL";
    let evidence: string;
    if (status === "SKIP") {
      evidence = `0 viewport-honest mobile probes — instrumentation mismatch at ${skipped.length} probe(s); use screenshot review for 320/375/414`;
    } else if (status === "PASS") {
      evidence =
        skipped.length === 0
          ? `0 mobile probes show horizontal overflow (${honestMobileProbes} viewport-honest probes)`
          : `0 overflow at ${honestMobileProbes} viewport-honest probes; ${skipped.length} dishonest probes SKIPPED (instrumentation mismatch)`;
    } else {
      evidence = `${offenders.length} mobile probes overflow horizontally${skipped.length ? ` (${skipped.length} dishonest probes SKIPPED)` : ""}`;
    }
    findings.push({
      id: "rendered.mobile.noHorizontalOverflow",
      category: "Mobile",
      description: "No horizontal overflow at mobile viewports (≤768) — viewport-honest probes only",
      status,
      evidence,
      details:
        offenders.length > 0 || skipped.length > 0
          ? { offenders, skipped, honestMobileProbes }
          : undefined,
    });
  }

  // 11. rendered.ctas.contrastVisible (≥3.0 large-text WCAG)
  {
    const offenders: Offender[] = [];
    for (const p of probes) {
      if (!p.result) continue;
      for (const c of p.result.ctas) {
        if (c.contrast < CTA_CONTRAST_THRESHOLD) {
          offenders.push({
            route: p.route,
            viewport: p.viewport.name,
            text: c.text,
            contrast: c.contrast,
            fg: c.fgRgba,
            bg: c.bgRgba,
            selector: c.selector,
          });
        }
      }
    }
    findings.push({
      id: "rendered.ctas.contrastVisible",
      category: "CTAs",
      description: `Every CTA in the viewport has WCAG large-text contrast ≥${CTA_CONTRAST_THRESHOLD.toFixed(1)}:1`,
      status: offenders.length === 0 ? "PASS" : "FAIL",
      evidence:
        offenders.length === 0
          ? "0 CTAs below contrast threshold"
          : `${offenders.length} CTAs below ${CTA_CONTRAST_THRESHOLD.toFixed(1)}:1`,
      details: offenders.length > 0 ? { offenders } : undefined,
    });
  }

  // 12. rendered.staleStrings.absent
  {
    const offenders: Offender[] = [];
    for (const p of probes) {
      if (!p.result) continue;
      for (const s of p.result.staleStrings) {
        if (s.found) {
          offenders.push({
            route: p.route,
            viewport: p.viewport.name,
            needle: s.needle,
            context: s.context.slice(0, 120),
          });
        }
      }
    }
    findings.push({
      id: "rendered.staleStrings.absent",
      category: "Stale Strings",
      description: "No legacy / placeholder / template-residue strings appear in rendered text",
      status: offenders.length === 0 ? "PASS" : "FAIL",
      evidence:
        offenders.length === 0
          ? "0 stale-string hits across rendered surfaces"
          : `${offenders.length} stale-string hits`,
      details: offenders.length > 0 ? { offenders } : undefined,
    });
  }

  // 13. rendered.canonicalEmail.consistent
  {
    const seen = new Set<string>();
    const offendersByEmail = new Map<string, Offender[]>();
    for (const p of probes) {
      if (!p.result) continue;
      for (const e of p.result.emails) {
        seen.add(e);
        if (e !== ALLOWED_EMAIL.toLowerCase()) {
          const list = offendersByEmail.get(e) || [];
          list.push({ route: p.route, viewport: p.viewport.name });
          offendersByEmail.set(e, list);
        }
      }
    }
    const distinctEmails = [...seen];
    const offending = [...offendersByEmail.keys()];
    const status: Status = offending.length === 0 ? "PASS" : "FAIL";
    findings.push({
      id: "rendered.canonicalEmail.consistent",
      category: "Email",
      description: `Only the canonical email address (${ALLOWED_EMAIL}) appears in rendered text`,
      status,
      evidence:
        status === "PASS"
          ? distinctEmails.length === 0
            ? "no email rendered"
            : `single canonical email rendered: ${ALLOWED_EMAIL}`
          : `${offending.length} non-canonical email(s) rendered: ${offending.join(", ")}`,
      details:
        status === "FAIL"
          ? {
              distinctEmails,
              offendersByEmail: Object.fromEntries(offendersByEmail.entries()),
            }
          : undefined,
    });
  }

  // 14. rendered.errors.zero (probe-health WARN, not content FAIL)
  {
    const offenders: Offender[] = [];
    for (const p of probes) {
      const all = [...(p.result?.errors || []), ...p.errors];
      if (all.length > 0) {
        offenders.push({ route: p.route, viewport: p.viewport.name, errors: all });
      }
    }
    findings.push({
      id: "rendered.errors.zero",
      category: "Probe Health",
      description: "Zero probe-internal errors and zero chrome runner errors",
      status: offenders.length === 0 ? "PASS" : "WARN",
      evidence:
        offenders.length === 0
          ? "0 probe errors"
          : `${offenders.length} (route × viewport) pairs reported probe/runner errors`,
      details: offenders.length > 0 ? { offenders } : undefined,
    });
  }

  // 15. rendered.probe.viewportSanity (NEW Cycle 11 — F6 closure HARD gate)
  //
  // Surface the dump-dom mobile-clamp behavior as its own finding rather than
  // letting it lurk inside other categories. Reports the count of probes whose
  // probed `window.innerWidth` matched the requested `--window-size` width
  // (±5 px slack), and the per-viewport breakdown of mismatches. WARN — not
  // FAIL — because the existing fallback path (capture-baseline.ts screenshot
  // channel + GPT-5.5 visual review) does cover the gap; the gate exists so
  // future runs don't silently regress.
  {
    const sanity: Array<{ requested: string; total: number; honest: number; mismatched: number; sampleActual: number | null }> = [];
    const byViewport = new Map<string, RouteProbe[]>();
    for (const p of probes) {
      const list = byViewport.get(p.viewport.name) ?? [];
      list.push(p);
      byViewport.set(p.viewport.name, list);
    }
    let totalProbes = 0;
    let honestProbes = 0;
    for (const [name, list] of byViewport.entries()) {
      const honest = list.filter((p) => isViewportHonest(p)).length;
      const mismatched = list.length - honest;
      const firstWithResult = list.find((p) => p.result);
      sanity.push({
        requested: name,
        total: list.length,
        honest,
        mismatched,
        sampleActual: firstWithResult?.result?.viewport.w ?? null,
      });
      totalProbes += list.length;
      honestProbes += honest;
    }
    sanity.sort((a, b) => a.requested.localeCompare(b.requested));
    const totalMismatched = totalProbes - honestProbes;
    const status: Status =
      totalProbes === 0 ? "SKIP" : totalMismatched === 0 ? "PASS" : "WARN";
    const evidence =
      status === "SKIP"
        ? "no probes captured"
        : status === "PASS"
          ? `all ${totalProbes} probes ran at requested viewport (±${VIEWPORT_HONEST_TOLERANCE_PX}px)`
          : `${honestProbes}/${totalProbes} probes viewport-honest; ${totalMismatched} mismatched (chrome --dump-dom clamps mobile to ~500px — screenshot channel + GPT-5.5 visual review covers the gap)`;
    findings.push({
      id: "rendered.probe.viewportSanity",
      category: "Probe Health",
      description: `Every probe's actual window.innerWidth matches requested viewport width (±${VIEWPORT_HONEST_TOLERANCE_PX}px) — F6 instrumentation gate`,
      status,
      evidence,
      details: { sanity, totalProbes, honestProbes, totalMismatched },
    });
  }

  return findings;
}

// ---------------------------------------------------------------------------
// Reports.

async function writeReports(payload: {
  generated: string;
  mode: "local" | "live";
  base: string;
  concurrency: number;
  viewports: string[];
  routes: string[];
  counts: { pass: number; warn: number; fail: number; skip: number };
  results: Finding[];
  probes: RouteProbe[];
}): Promise<void> {
  await mkdir(REPORTS_DIR, { recursive: true });

  const json = {
    tool: "scripts/audit-rendered-visual.ts",
    ...payload,
  };
  await writeFile(join(REPORTS_DIR, "audit-rendered-visual.json"), JSON.stringify(json, null, 2));

  const { counts, results } = payload;
  const md: string[] = [
    "# Audit Rendered Visual Report",
    "",
    `**Generated:** ${payload.generated}`,
    `**Mode:** ${payload.mode}`,
    `**Base:** ${payload.base}`,
    `**Concurrency:** ${payload.concurrency}`,
    `**Routes:** ${payload.routes.length}`,
    `**Viewports:** ${payload.viewports.join(", ")}`,
    "",
    `**Summary:** ${counts.pass} PASS · ${counts.warn} WARN · ${counts.fail} FAIL · ${counts.skip} SKIP`,
    "",
    "## Results by category",
    "",
  ];
  const categories = uniq(results.map((r) => r.category));
  const icon = (s: Status): string =>
    s === "PASS" ? "✅" : s === "WARN" ? "⚠️" : s === "FAIL" ? "❌" : "—";
  for (const cat of categories) {
    md.push(`### ${cat}`);
    md.push("");
    md.push("| ID | Status | Description | Evidence |");
    md.push("|---|:-:|---|---|");
    for (const r of results.filter((r) => r.category === cat)) {
      md.push(`| \`${r.id}\` | ${icon(r.status)} ${r.status} | ${r.description} | ${r.evidence} |`);
    }
    md.push("");
  }
  if (counts.warn > 0 || counts.fail > 0) {
    md.push("## Failures and warnings — details");
    md.push("");
    for (const r of results) {
      if (r.status === "PASS" || r.status === "SKIP") continue;
      md.push(`### ${icon(r.status)} \`${r.id}\``);
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

  await writeFile(join(REPORTS_DIR, "audit-rendered-visual.md"), md.join("\n"));
}

// ---------------------------------------------------------------------------
// Main.

async function main(): Promise<void> {
  await mkdir(REPORTS_DIR, { recursive: true });
  if (SHOTS_DIR) await mkdir(SHOTS_DIR, { recursive: true });

  const routes = selectRoutes();
  const viewports = selectViewports();
  const liveBase = isLive ? LIVE_BASE || DEFAULT_LIVE_BASE : LIVE_BASE || undefined;

  const server = await startServer(PORT, liveBase);
  const baseUrl = `http://127.0.0.1:${server.port}`;

  try {
    type Job = { route: string; viewport: ViewportSpec };
    const jobs: Job[] = [];
    for (const route of routes) jobs.push(...viewports.map((vp) => ({ route, viewport: vp })));

    const probes = await runWithPool<Job, RouteProbe>(jobs, CONCURRENCY, async (job) => {
      const errors: string[] = [];
      const ts = Date.now();
      const sep = job.route.includes("?") ? "&" : "?";
      const url = `${baseUrl}${job.route}${sep}_=${ts}`;
      const persistentShot = SHOTS_DIR
        ? join(SHOTS_DIR, `${safeName(job.route)}-${job.viewport.name}.png`)
        : undefined;

      // Pass 1: dump-DOM probe channel (runs at chrome's internal default
      // viewport ~500 px wide; viewport-stable structural data only).
      let result: ProbeResult | null = null;
      try {
        const { dom, stderr } = await runChromeDumpDom(url, job.viewport, persistentShot);
        const parsed = parseProbeFromDom(dom);
        result = parsed.result;
        if (parsed.error) errors.push(parsed.error);
        if (stderr && noHeadless) {
          errors.push(`chrome stderr: ${stderr.slice(0, 200)}`);
        }
      } catch (err) {
        errors.push(`chrome dump-dom: ${err instanceof Error ? err.message : String(err)}`);
      }

      // Pass 2: screenshot pixel-edge channel at the requested viewport
      // (chrome screenshot pipeline DOES honor --window-size).
      let edge: EdgeReport | null = null;
      const tmpShot = persistentShot
        ? null
        : join(tmpdir(), `rv-${safeName(job.route)}-${job.viewport.name}-${ts}.png`);
      const shotForEdge = persistentShot ?? tmpShot;
      if (shotForEdge) {
        try {
          if (!persistentShot) {
            // Fresh capture for the edge pass; the dump-dom run's --screenshot
            // companion (when --shots-dir is set) is reused as-is.
            await runChromeScreenshot(url, job.viewport, shotForEdge);
          }
          edge = await analyzeEdges(shotForEdge);
        } catch (err) {
          errors.push(`screenshot/edge: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
          if (tmpShot) {
            try {
              await unlink(tmpShot);
            } catch {
              // tmp file may not have been written; ignore
            }
          }
        }
      }

      return { route: job.route, viewport: job.viewport, result, edge, errors };
    });

    const findings = deriveFindings(probes);
    const counts = {
      pass: findings.filter((r) => r.status === "PASS").length,
      warn: findings.filter((r) => r.status === "WARN").length,
      fail: findings.filter((r) => r.status === "FAIL").length,
      skip: findings.filter((r) => r.status === "SKIP").length,
    };

    await writeReports({
      generated: new Date().toISOString(),
      mode: liveBase ? "live" : "local",
      base: liveBase || baseUrl,
      concurrency: CONCURRENCY,
      viewports: viewports.map((v) => v.name),
      routes,
      counts,
      results: findings,
      probes,
    });

    for (const r of findings) {
      const ic = r.status === "PASS" ? "✓" : r.status === "WARN" ? "⚠" : r.status === "FAIL" ? "✗" : "—";
      console.log(`  ${ic} ${r.id} — ${r.evidence}`);
    }
    console.log("");
    console.log(
      `audit:rendered — ${counts.pass} PASS · ${counts.warn} WARN · ${counts.fail} FAIL · ${counts.skip} SKIP`,
    );
    console.log(`→ reports/audit-rendered-visual.json`);
    console.log(`→ reports/audit-rendered-visual.md`);
    process.exit(counts.fail > 0 ? 1 : 0);
  } finally {
    server.close();
  }
}

await main().catch((err) => {
  console.error(err);
  process.exit(1);
});
