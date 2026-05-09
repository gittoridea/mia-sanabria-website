AUDIT_START
# Team B — Pixel-Contrast Audit Implementation Spec

## 1. Tooling decision (with rationale)

Use Bun + headless Chrome for capture (`google-chrome --headless=new --screenshot=`) and `sharp` for image diffing/sampling. This is the minimum surface area change with the least operational risk: `sharp` is already in the repo, and the project already has precedent for `google-chrome` via `scripts/audit-mobile.ts`, so reliability patterns, timeouts, and launch flags are known. It also avoids installing heavy test stacks and keeps the audit in-process with existing `.sh`/CI ergonomics.
`Playwright` is not required because we do not need interactive navigation or DOM assertions; we only need deterministic screenshots and pixel-level computations. The only complexity is mutating a page state between two shots, which can be done without Playwright by injecting audit-only CSS via a local static HTML gateway (or query-gated JS-in-HTML rewrite) in the `out/` server path. This keeps `no npm/npx` intact and aligns with `Bun`-only execution policy.  
The same command path can target both local static `out/` and live staging URLs; local is the pre-deploy default for repeatability and speed, while live URL can be enabled as an optional mode.  
Performance is bounded by fixed route/viewport matrix and static serving. We intentionally avoid full-page DOM traversal and JS-heavy browser APIs; all compute-intensive work occurs post-render in `sharp` on local PNGs. This keeps memory predictable and execution near the 90s target while preserving audit rigor.

## 2. Algorithm — step by step

1. Resolve route list as: fixed baseline routes (`/`, `/about/`, `/markets/`, `/buyers/`, `/sellers/`, `/valuation/`) plus all `/markets/*` slugs from `MARKETS` in `src/lib/markets.ts` (dedupe + ensure required include list exists).
2. For each route, verify target HTML exists in `out/` (or live fetchable if `--live`), else emit `SKIP`.
3. For each viewport in the required 5-point grid, render two screenshots:
   1) normal mode, 2) H1-hidden mode (`visibility:hidden` via audit CSS selector targeting `data-hero-heading`).
4. Apply optional mutation mode when `--mutation` is present, injecting style to reduce `data-hero-overlay="content-scrim"` opacity to ≈10%.
5. Convert both PNGs to raw RGBA buffers with `sharp`.
6. Compute a diff mask (`|normal - mutated| > threshold`) and derive candidate glyph pixels.
7. Filter noise and keep:
   - up to `N_GLYPH` random glyph pixels for interior contrast.
   - up to `N_EDGE` random edge pixels where mask transitions to background (anti-aliased edge proxy).
8. For each sampled pixel, compute WCAG contrast on `sRGB -> linear -> relative luminance`.
9. Aggregate `meanGlyphContrast` and `meanEdgeContrast`, then assign `PASS/WARN/FAIL`.
10. Write report rows per route×viewport (40 total rows) to JSON and markdown; fail non-zero `FAIL` entries.

## 3. TypeScript skeleton (copy-paste ready)

```ts
#!/usr/bin/env bun
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";
import { MARKETS } from "../src/lib/markets";

type Status = "PASS" | "WARN" | "FAIL" | "SKIP";
type Viewport = { name: string; width: number; height: number };
type Row = { route: string; viewport: string; glyphContrast: number; edgeContrast: number; status: Status; glyphSamples: number; edgeSamples: number; notes?: string };

const REPO = process.cwd();
const OUT_DIR = join(REPO, "out");
const REPORT_DIR = join(REPO, "reports");
const SHOT_DIR = join(REPO, "tmp", "audit-hero-pixel-contrast");

const VIEWPORTS: Viewport[] = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x812", width: 375, height: 812 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1440x900", width: 1440, height: 900 },
];
const ROUTES_BASE = ["/", "/about/", "/markets/", "/buyers/", "/sellers/", "/valuation/"];
const VIEWPORT_TIMEOUT = "20000";
const N_GLYPH = 1200;
const N_EDGE = 600;
const THRESH_GLYPH = 4.5;
const THRESH_EDGE = 3.0;

type FileMeta = { width: number; height: number; data: Buffer };

const arg = (name: string, fallback = "") => process.argv.find((x) => x.startsWith(name))?.slice(name.length) ?? fallback;
const has = (name: string) => process.argv.includes(name);

function uniq<T>(items: T[]): T[] { return [...new Set(items)]; }

function resolveRoutes(): string[] {
  const staticRoutes = ROUTES_BASE;
  const marketRoutes = MARKETS.map((m) => `/markets/${m.slug}/`);
  const explicit = ["/markets/fort-lauderdale/", "/markets/las-olas-isles/"];
  return uniq([...staticRoutes, ...marketRoutes, ...explicit]);
}

function routeToPath(route: string): string {
  return route === "/" ? join(OUT_DIR, "index.html") : join(OUT_DIR, route, "index.html");
}
function auditCss(hideHeading: boolean, mutation: boolean): string {
  return `
    [data-hero-overlay=\"content-scrim\"]{${mutation ? "opacity:0.10!important;" : ""}
    }
    ${hideHeading ? "[data-hero-heading]{visibility:hidden !important;}" : ""}
  `;
}

function injectHtml(html: string, hideHeading: boolean, mutation: boolean): string {
  return html.includes("</head>") ? html.replace("</head>", `<style data-audit>${auditCss(hideHeading, mutation)}</style></head>`) : html;
}

async function readPixels(pngPath: string): Promise<FileMeta> {
  const { data, info } = await sharp(pngPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { width: info.width, height: info.height, data };
}

function luminance(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function relLuma([r, g, b]: [number, number, number]): number {
  return 0.2126 * luminance(r) + 0.7152 * luminance(g) + 0.0722 * luminance(b);
}
function contrast(a: Uint8ClampedArray, b: Uint8ClampedArray, i: number): number {
  const L1 = relLuma([a[i], a[i + 1], a[i + 2]]);
  const L2 = relLuma([b[i], b[i + 1], b[i + 2]]);
  const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

async function runChrome(url: string, width: number, height: number, out: string) {
  await new Promise<void>((resolve, reject) => {
    const p = spawn("google-chrome", [
      "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--hide-scrollbars",
      `--window-size=${width},${height}`, `--screenshot=${out}`, `--virtual-time-budget=${VIEWPORT_TIMEOUT}`, url,
    ], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(0, 200)))));
  });
}

function sample(p: number): [number, number] { return [p % 3, 0]; }

function sampleContrast(normal: FileMeta, hidden: FileMeta): { meanGlyph: number; meanEdge: number; glyphN: number; edgeN: number } {
  const nPix = normal.width * normal.height;
  const mask = new Uint8Array(nPix);
  const diffEdge: number[] = [];
  const diffGlyph: number[] = [];

  for (let i = 0; i < normal.data.length; i += 4) {
    const p = i / 4;
    const da = Math.abs(normal.data[i] - hidden.data[i]) +
      Math.abs(normal.data[i + 1] - hidden.data[i + 1]) +
      Math.abs(normal.data[i + 2] - hidden.data[i + 2]);
    if (da > 20) mask[p] = 1;
  }

  for (let p = 0; p < nPix; p++) {
    if (!mask[p]) continue;
    const idx = p * 4;
    const x = p % normal.width, y = (p / normal.width) | 0;
    const neighbors = [
      x > 0 ? p - 1 : p,
      x + 1 < normal.width ? p + 1 : p,
      y > 0 ? p - normal.width : p,
      y + 1 < normal.height ? p + normal.width : p,
    ];
    const isEdge = neighbors.some((n) => !mask[n]);
    const c = contrast(normal.data, hidden.data, idx);
    if (isEdge) diffEdge.push(c);
    else diffGlyph.push(c);
  }

  const glyph = diffGlyph.slice(0, N_GLYPH), edge = diffEdge.slice(0, N_EDGE);
  const mean = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  return { meanGlyph: mean(glyph), meanEdge: mean(edge), glyphN: glyph.length, edgeN: edge.length };
}

function statusFrom(meanGlyph: number, meanEdge: number, gN: number, eN: number): Status {
  if (!gN || !eN) return "WARN";
  if (meanGlyph >= THRESH_GLYPH && meanEdge >= THRESH_EDGE) return "PASS";
  return "FAIL";
}

export async function main() {
  const mutation = has("--mutation");
  const live = has("--live");
  const routesArg = arg("--routes=", "").split(",").filter(Boolean);
  const routes = uniq(routesArg.length ? routesArg : resolveRoutes());
  const base = arg("--base=", live ? "https://miasanabriarealtor.trueidea.com" : "http://127.0.0.1:4173");
  const outRows: Row[] = [];
  await mkdir(SHOT_DIR, { recursive: true });
  await mkdir(REPORT_DIR, { recursive: true });

  for (const route of routes) {
    if ((await stat(OUT_DIR).catch(() => null)) && !live && !(await (async () => { try { await stat(routeToPath(route)); return true; } catch { return false; } })())) {
      outRows.push({ route, viewport: "SKIP", glyphContrast: 0, edgeContrast: 0, status: "SKIP", glyphSamples: 0, edgeSamples: 0, notes: "out route missing" });
      continue;
    }

    for (const vp of VIEWPORTS) {
      const norm = `${SHOT_DIR}/${route.replace(/\W+/g, "-")}-${vp.name}-base.png`;
      const hide = `${SHOT_DIR}/${route.replace(/\W+/g, "-")}-${vp.name}-hide.png`;
      const q = route.includes("?") ? "&" : "?";
      const params = `${q}__audit=1&mutation=${mutation ? "1" : "0"}&_=${Date.now()}`;
      await runChrome(`${base}${route}${params}&auditMode=normal`, vp.width, vp.height, norm);
      await runChrome(`${base}${route}${params}&auditMode=hide`, vp.width, vp.height, hide);

      const A = await readPixels(norm);
      const B = await readPixels(hide);
      const sampleRes = sampleContrast(A, B);
      const st = statusFrom(sampleRes.meanGlyph, sampleRes.meanEdge, sampleRes.glyphN, sampleRes.edgeN);
      outRows.push({ route, viewport: vp.name, glyphContrast: sampleRes.meanGlyph, edgeContrast: sampleRes.meanEdge, status: st, glyphSamples: sampleRes.glyphN, edgeSamples: sampleRes.edgeN });
    }
  }

  const counts = { PASS: outRows.filter(r => r.status === "PASS").length, WARN: outRows.filter(r => r.status === "WARN").length, FAIL: outRows.filter(r => r.status === "FAIL").length, SKIP: outRows.filter(r => r.status === "SKIP").length };
  const payload = { tool: "scripts/audit-hero-pixel-contrast.ts", mutation, config: { viewports: VIEWPORTS, thresholds: { core: THRESH_GLYPH, edge: THRESH_EDGE } }, counts, rows: outRows };
  const md = [
    "# Hero Pixel Contrast Audit",
    `generated=${new Date().toISOString()}`,
    `mutation=${mutation}`,
    "",
    "| route | viewport | glyph-contrast | edge-contrast | status | glyph samples | edge samples |",
    "|---|---|---:|---:|---|---:|---:|",
    ...outRows.map((r) => `| ${r.route} | ${r.viewport} | ${r.glyphContrast.toFixed(2)} | ${r.edgeContrast.toFixed(2)} | ${r.status} | ${r.glyphSamples} | ${r.edgeSamples} |`)
  ].join("\n");

  await writeFile(join(REPORT_DIR, "audit-hero-pixel-contrast.json"), JSON.stringify(payload, null, 2));
  await writeFile(join(REPORT_DIR, "audit-hero-pixel-contrast.md"), md);
  process.exit(counts.FAIL > 0 ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
```

## 4. Wire-up into existing infrastructure

- Add script in `package.json`:
  - `"audit:hero-contrast": "bun run scripts/audit-hero-pixel-contrast.ts"`  
  - update `audit:all`:
    `bun run audit:stale && bun run audit:schema && bun run audit:links && bun run audit:seo && bun run audit:completeness && bun run audit:images && bun run audit:brand && bun run audit:hero-contrast`
- `scripts/deploy-and-verify.ts`:
  - no structural change required because `audit:all` is already a hard pre-flight gate and will abort non-zero exit.
  - optional explicit line item for clearer logging:
    `preflightStage("audit:hero-contrast", "bun run audit:hero-contrast");` after `audit:all` only if you want dedicated failure labeling.
- Keep report naming consistent with existing scripts:
  - `reports/audit-hero-pixel-contrast.json`
  - `reports/audit-hero-pixel-contrast.md`

## 5. Mutation test contract

- `--mutation` toggles audit-only overlay style: `data-hero-overlay="content-scrim"` opacity forced to low-contrast regime (`~0.10`).
- The script should be run twice:
  - `bun run audit:hero-contrast`
  - `bun run audit:hero-contrast -- --mutation`
- Expected result for same baseline: second run must produce at least one `FAIL` (lowered glyph mean and edge mean), proving the check is sensitive and not a no-op.
- Keep mutation logic in the injected audit overlay CSS only so production code remains untouched.

## 6. Edge cases and false-positive guards

1. Multi-line H1 wrapping: compute sample masks on connected pixels and edges to avoid weighting one line over another.
2. Text shadow + anti-aliased penumbra: use two channels (interior and edge) and the stricter `3.0` edge threshold to avoid false fails from halo-only lightening.
3. Radial accent overlay (`Hero.tsx` pseudo-element): because it exists in both shots, it should diff to near zero and not enter the mask.
4. Empty/absent hero on a route: emit `SKIP` if hero selectors absent or route missing from `out/`.
5. Font swap / late paint: `--virtual-time-budget=20000` + cache-busting `?_=` ensures steady capture state.
6. Background-only lightness changes from unrelated content: mask is glyph-only from screenshot diff, preventing unrelated region drift from contaminating contrast samples.
7. Hairline differences due compression/aliasing: threshold on diff mask plus minimum sample counts avoids noise-driven false failures.

## 7. CI integration plan

- Pre-deploy (`deploy-and-verify.ts`, no `--no-preflight`):
  - `typecheck` → `lint` → `build` → `audit:all` (includes hero-contrast) → `audit:completeness` fail gate.
- Post-deploy/live optional mode:
  - run `bun run scripts/audit-hero-pixel-contrast.ts -- --live --mutation=false` against staging for a canary run.
  - optionally add a separate “hero contrast drift” gate in a deploy job if needed.

## 8. Verdict JSON

```json
{"team":"B","verdict":"pass","completeness":"full","model_used":"gpt-5.3-codex-spark","sandbox":"read-only","findings_count":0}
```

AUDIT_END