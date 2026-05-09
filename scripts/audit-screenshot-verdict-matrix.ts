#!/usr/bin/env bun
/**
 * audit-screenshot-verdict-matrix — deterministic per-route × per-viewport verdict matrix.
 *
 * Cycle 9 doctrine: captured screenshots are not evidence on their own. Every visual
 * screenshot set must produce a per-route × per-viewport verdict matrix scoring four
 * axes: H1 clipping, CTA above-fold, contrast, visual quality (composite). This script
 * walks a directory of PNGs (filename convention `<route_safe>__<width>x<height>.png`)
 * and emits matching markdown + JSON reports.
 *
 * Heuristics are color-cluster-based — they catch the structural failure shapes without
 * doing OCR. False-positive / false-negative shapes documented in
 * `docs/codex-spark-audits/cycle-9/team-C-verdict-matrix.md` § Limitations.
 *
 * Usage:
 *   bun run scripts/audit-screenshot-verdict-matrix.ts \
 *     --input=/tmp/mia-cycle9-before \
 *     --label=before \
 *     --output-md=docs/CYCLE_9_VISUAL_FAILURE_REPRODUCTION.md \
 *     --output-json=reports/audit-screenshot-verdict-matrix-before.json
 *
 * Authored: 2026-05-09 cycle 9 (Codex Spark Team C spec; Bun-only; sharp pixel access)
 */
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import { dirname } from "node:path";

type Verdict = "PASS" | "PARTIAL" | "FAIL";
type Label = "before" | "local-after" | "live-after";

type AxisResult = {
  verdict: Verdict;
  score: number;
  reason: string;
};

type CaptureResult = {
  file: string;
  route: string;
  route_display: string;
  viewport: string;
  h1_clipping: AxisResult;
  cta_above_fold: AxisResult;
  contrast: AxisResult;
  visual_quality: AxisResult;
};

type CliOptions = {
  input: string;
  label: Label;
  outputMd: string;
  outputJson: string;
};

type Component = {
  area: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  sumLuma: number;
};

const FILENAME_RE = /^(.*)__([0-9]+)x([0-9]+)\.png$/i;

function usage(): never {
  console.error("Usage: bun run scripts/audit-screenshot-verdict-matrix.ts --input=<dir> --label=<before|local-after|live-after> --output-md=<path> --output-json=<path>");
  process.exit(1);
}

function parseArgs(argv: string[]): CliOptions {
  const args: Partial<CliOptions> = {};

  for (const token of argv) {
    const m = token.match(/^--([^=]+)=(.+)$/);
    if (!m) continue;
    const key = m[1];
    const value = m[2];
    if (key === "input") args.input = value;
    else if (key === "label") {
      if (value === "before" || value === "local-after" || value === "live-after") args.label = value;
    } else if (key === "output-md") args.outputMd = value;
    else if (key === "output-json") args.outputJson = value;
  }

  if (!args.input || !args.label || !args.outputMd || !args.outputJson) usage();
  return args as CliOptions;
}

function absDiff(a: number, b: number): number {
  return a > b ? a - b : b - a;
}

function isCreamPixel(r: number, g: number, b: number): boolean {
  const sum = r + g + b;
  return sum >= 700 && absDiff(r, g) <= 15 && absDiff(r, b) <= 15 && absDiff(g, b) <= 15;
}

function isCreamText(r: number, g: number, b: number): boolean {
  return isCreamPixel(r, g, b) && r >= 236 && g >= 233 && b >= 227;
}

function isBrassPixel(r: number, g: number, b: number): boolean {
  return r >= 180 && r <= 220 && g >= 150 && g <= 170 && b >= 90 && b <= 110;
}

function isDarkPanelPixel(r: number, g: number, b: number): boolean {
  return r <= 70 && g <= 100 && b <= 130;
}

function linearFromSrgb(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luma(r: number, g: number, b: number): number {
  return 0.2126 * linearFromSrgb(r) + 0.7152 * linearFromSrgb(g) + 0.0722 * linearFromSrgb(b);
}

async function loadImage(filePath: string): Promise<{ data: Uint8Array; width: number; height: number }> {
  const raw = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return {
    data: new Uint8Array(raw.data),
    width: raw.info.width,
    height: raw.info.height,
  };
}

function px(data: Uint8Array, i: number): number {
  return data[i] ?? 0;
}

function extractComponents(
  mask: Uint8Array,
  width: number,
  height: number,
  minArea: number,
  sumLumaFn?: (byteOffset: number, pixelIndex: number) => number,
): Component[] {
  const seen = new Uint8Array(mask.length);
  const comps: Component[] = [];
  const qx: number[] = [];
  const qy: number[] = [];

  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      const idx = row + x;
      if ((mask[idx] ?? 0) === 0 || seen[idx]) continue;

      let area = 0;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      let lumSum = 0;

      qx[0] = x;
      qy[0] = y;
      seen[idx] = 1;
      let head = 0;
      let tail = 1;

      while (head < tail) {
        const cx = qx[head] ?? 0;
        const cy = qy[head++] ?? 0;
        const cidx = cy * width + cx;
        area++;

        if (sumLumaFn) lumSum += sumLumaFn(cidx * 4, cidx);

        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        if (cx > 0) {
          const n = cidx - 1;
          if ((mask[n] ?? 0) && !seen[n]) {
            seen[n] = 1;
            qx[tail] = cx - 1;
            qy[tail] = cy;
            tail++;
          }
        }
        if (cx + 1 < width) {
          const n = cidx + 1;
          if ((mask[n] ?? 0) && !seen[n]) {
            seen[n] = 1;
            qx[tail] = cx + 1;
            qy[tail] = cy;
            tail++;
          }
        }
        if (cy > 0) {
          const n = cidx - width;
          if ((mask[n] ?? 0) && !seen[n]) {
            seen[n] = 1;
            qx[tail] = cx;
            qy[tail] = cy - 1;
            tail++;
          }
        }
        if (cy + 1 < height) {
          const n = cidx + width;
          if ((mask[n] ?? 0) && !seen[n]) {
            seen[n] = 1;
            qx[tail] = cx;
            qy[tail] = cy + 1;
            tail++;
          }
        }
      }

      if (area >= minArea) {
        comps.push({ area, minX, maxX, minY, maxY, sumLuma: lumSum });
      }
    }
  }

  return comps;
}

function analyzeH1Clipping(data: Uint8Array, width: number, height: number): AxisResult {
  const window = 8;
  let currentRun = 0;
  let maxRun = 0;

  for (let y = 0; y < height; y++) {
    const rowBase = y * width * 4;
    let edgeRun = 0;
    for (let x = width - 1; x >= Math.max(0, width - window); x--) {
      const p = rowBase + x * 4;
      const r = px(data, p);
      const g = px(data, p + 1);
      const b = px(data, p + 2);
      if (isCreamPixel(r, g, b)) edgeRun++;
      else break;
    }

    if (edgeRun >= 4) {
      currentRun++;
      if (currentRun > maxRun) maxRun = currentRun;
    } else {
      currentRun = 0;
    }
  }

  const creamMask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    if (isCreamPixel(px(data, p), px(data, p + 1), px(data, p + 2))) creamMask[i] = 1;
  }

  const comps = extractComponents(creamMask, width, height, 140);
  const heroBand = Math.floor(height * 0.62);
  const suspectHeroTouch = comps.some((c) => {
    const cW = c.maxX - c.minX + 1;
    return c.maxX === width - 1 && c.minY < heroBand && cW >= Math.max(width * 0.10, 64) && c.area >= cW * 2;
  });

  const threshold = Math.max(12, Math.floor(height * 0.06));
  const score = Math.min(1, maxRun / Math.max(1, Math.floor(height * 0.45)));

  if (maxRun >= threshold * 2) {
    if (suspectHeroTouch) {
      return {
        verdict: "FAIL",
        score,
        reason: `Right-edge run ${maxRun} rows with hero-like cream cluster at viewport edge`,
      };
    }
    return {
      verdict: "PARTIAL",
      score,
      reason: `Strong sustained right-edge cream run (${maxRun} rows)`,
    };
  }

  if (maxRun >= threshold) {
    return {
      verdict: "PARTIAL",
      score,
      reason: "Localized right-edge clipping pattern detected",
    };
  }

  return {
    verdict: "PASS",
    score,
    reason: maxRun > 0 ? "Minor isolated edge cream pattern; no sustained clipping signal" : "No right-edge clipping signature",
  };
}

function analyzeCtaAboveFold(data: Uint8Array, width: number, height: number): AxisResult {
  const startY = Math.floor(height / 2);
  const upperViewportLimit = height - 40;
  const mask = new Uint8Array(width * height);

  for (let y = startY; y < height; y++) {
    const rowBase = y * width * 4;
    const mBase = y * width;
    for (let x = 0; x < width; x++) {
      const p = rowBase + x * 4;
      const r = px(data, p);
      const g = px(data, p + 1);
      const b = px(data, p + 2);
      if (isBrassPixel(r, g, b)) mask[mBase + x] = 1;
    }
  }

  const comps = extractComponents(mask, width, height, 70);
  let partial = false;
  let partialScore = 0;

  for (const c of comps) {
    const cW = c.maxX - c.minX + 1;
    const cH = c.maxY - c.minY + 1;
    const area = c.area;
    const density = area / (cW * cH);
    const aspect = cW / Math.max(1, cH);

    const inBottomHalf = c.maxY >= startY;
    const aboveFold = c.minY < upperViewportLimit;
    const isWide = aspect >= 2.4;
    const sizeOk = cW >= 72 && cH >= 10;
    const solid = density >= 0.48;
    const isPill = inBottomHalf && aboveFold && isWide && sizeOk && solid;

    if (isPill) {
      return {
        verdict: "PASS",
        score: Math.min(1, 0.6 * density + 0.4 * Math.min(1, aspect / 6)),
        reason: `Found pill-like brass region ${cW}x${cH}, density ${(density * 100).toFixed(1)}%`,
      };
    }

    if (inBottomHalf && aboveFold && isWide && sizeOk && density >= 0.35) {
      partial = true;
      partialScore = Math.max(partialScore, 0.35 + 0.15 * Math.min(1, density));
    }
  }

  if (partial) {
    return {
      verdict: "PARTIAL",
      score: partialScore,
      reason: "Brass-like region found but shape/density confidence is borderline",
    };
  }

  return {
    verdict: "FAIL",
    score: 0,
    reason: "No qualifying solid brass pill CTA in expected viewport area",
  };
}

function analyzeContrast(data: Uint8Array, width: number, height: number): AxisResult {
  const darkMask = new Uint8Array(width * height);
  let globalDark = 0;
  let globalDarkN = 0;
  let globalCream = 0;
  let globalCreamN = 0;

  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    const r = px(data, p);
    const g = px(data, p + 1);
    const b = px(data, p + 2);
    const lv = luma(r, g, b);

    if (isDarkPanelPixel(r, g, b)) {
      darkMask[i] = 1;
      globalDark += lv;
      globalDarkN++;
    }
    if (isCreamText(r, g, b)) {
      globalCream += lv;
      globalCreamN++;
    }
  }

  const darkMinArea = Math.max(140, Math.floor(width * height * 0.003));
  const darkComps = extractComponents(darkMask, width, height, darkMinArea, (byteOffset) => {
    return luma(px(data, byteOffset), px(data, byteOffset + 1), px(data, byteOffset + 2));
  });

  let target: Component | undefined;
  if (darkComps.length > 0) {
    target = darkComps.sort((a, b) => (a.sumLuma / a.area) - (b.sumLuma / b.area))[0];
  }

  let localCream = 0;
  let localCreamN = 0;
  let localDark = 0;
  let localDarkN = 0;

  if (target) {
    const pad = 6;
    const x0 = Math.max(0, target.minX - pad);
    const x1 = Math.min(width - 1, target.maxX + pad);
    const y0 = Math.max(0, target.minY - pad);
    const y1 = Math.min(height - 1, target.maxY + pad);

    for (let y = y0; y <= y1; y++) {
      const rowBase = y * width * 4;
      for (let x = x0; x <= x1; x++) {
        const p = rowBase + x * 4;
        const r = px(data, p);
        const g = px(data, p + 1);
        const b = px(data, p + 2);
        const lv = luma(r, g, b);

        if (isCreamText(r, g, b)) {
          localCream += lv;
          localCreamN++;
        }
        if (isDarkPanelPixel(r, g, b)) {
          localDark += lv;
          localDarkN++;
        }
      }
    }
  }

  if (localDarkN === 0 && target) {
    localDark = target.sumLuma;
    localDarkN = target.area;
  }

  if (localCreamN === 0 && globalCreamN > 0) {
    localCream = globalCream;
    localCreamN = globalCreamN;
  }
  if (localDarkN === 0 && globalDarkN > 0) {
    localDark = globalDark;
    localDarkN = globalDarkN;
  }

  if (localCreamN === 0 || localDarkN === 0) {
    return {
      verdict: "FAIL",
      score: 0,
      reason: "Insufficient contrast samples (no dark cluster or cream text sample)",
    };
  }

  const creamL = localCream / localCreamN;
  const darkL = localDark / localDarkN;
  const high = Math.max(creamL, darkL);
  const low = Math.min(creamL, darkL);
  const ratio = (high + 0.05) / (low + 0.05);

  if (ratio >= 4.5) {
    return { verdict: "PASS", score: ratio, reason: `Estimated contrast ${ratio.toFixed(2)}:1` };
  }
  if (ratio >= 3.0) {
    return { verdict: "PARTIAL", score: ratio, reason: `Estimated contrast ${ratio.toFixed(2)}:1` };
  }
  return { verdict: "FAIL", score: ratio, reason: `Estimated contrast ${ratio.toFixed(2)}:1` };
}

function combineVisual(h1: AxisResult, cta: AxisResult, contrast: AxisResult): AxisResult {
  if (h1.verdict === "FAIL" || cta.verdict === "FAIL" || contrast.verdict === "FAIL") {
    return { verdict: "FAIL", score: 0, reason: "At least one mandatory axis failed" };
  }
  if (h1.verdict === "PARTIAL" || cta.verdict === "PARTIAL" || contrast.verdict === "PARTIAL") {
    return { verdict: "PARTIAL", score: 0.5, reason: "At least one mandatory axis is partial" };
  }
  return { verdict: "PASS", score: 1, reason: "All mandatory axes passed" };
}

function routeSafeToDisplay(routeSafe: string): string {
  return routeSafe === "root" ? "/" : `/${routeSafe.replace(/_/g, "/")}/`;
}

function routeOrder(a: string, b: string): number {
  if (a === "root") return -1;
  if (b === "root") return 1;
  return routeSafeToDisplay(a).localeCompare(routeSafeToDisplay(b));
}

function viewportSort(a: string, b: string): number {
  const [aw] = a.split("x").map((v) => Number.parseInt(v, 10));
  const [bw] = b.split("x").map((v) => Number.parseInt(v, 10));
  return (aw ?? 0) - (bw ?? 0);
}

async function evaluateCapture(inputDir: string, fileName: string, routeSafe: string, viewport: string): Promise<CaptureResult> {
  const filePath = `${inputDir.replace(/\/+$/, "")}/${fileName}`;
  const image = await loadImage(filePath);

  const h1 = analyzeH1Clipping(image.data, image.width, image.height);
  const cta = analyzeCtaAboveFold(image.data, image.width, image.height);
  const contrast = analyzeContrast(image.data, image.width, image.height);
  const visual = combineVisual(h1, cta, contrast);

  return {
    file: filePath,
    route: routeSafe,
    route_display: routeSafeToDisplay(routeSafe),
    viewport,
    h1_clipping: h1,
    cta_above_fold: cta,
    contrast,
    visual_quality: visual,
  };
}

async function ensureDir(path: string): Promise<void> {
  const d = dirname(path);
  if (d && d !== "." && d !== "/") {
    await mkdir(d, { recursive: true });
  }
}

function buildMarkdown(label: Label, rows: CaptureResult[]): string {
  const viewports = [...new Set(rows.map((r) => r.viewport))].sort(viewportSort);
  const routes = [...new Set(rows.map((r) => r.route))].sort(routeOrder);

  const byRoute = new Map<string, Map<string, CaptureResult>>();
  for (const row of rows) {
    if (!byRoute.has(row.route)) byRoute.set(row.route, new Map());
    byRoute.get(row.route)!.set(row.viewport, row);
  }

  const header = [
    "route",
    ...viewports.flatMap((v) => [
      `${v} H1 clipping`,
      `${v} CTA above-fold`,
      `${v} Contrast`,
      `${v} Visual quality`,
    ]),
  ];

  const lines: string[] = [
    `# Cycle 9 — Screenshot verdict matrix (${label})`,
    "",
    `**Generated:** deterministic per-route × per-viewport scoring against the screenshots in this snapshot. Heuristics are color-cluster-based; see \`docs/codex-spark-audits/cycle-9/team-C-verdict-matrix.md\` § Limitations for known false-positive / false-negative shapes.`,
    "",
    "**Axes:**",
    "- **H1 clipping** — does the heading text touch / extend past the right edge of the viewport?",
    "- **CTA above-fold** — is a brass-400 pill visible in the bottom half of the viewport?",
    "- **Contrast** — is there a deterministic dark-panel + cream-text reading field with luminance contrast ≥ 4.5:1?",
    "- **Visual quality** — composite (PASS only when all three are PASS).",
    "",
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
  ];

  for (const route of routes) {
    const routeMap = byRoute.get(route) ?? new Map();
    const cells: string[] = [routeSafeToDisplay(route)];

    for (const vp of viewports) {
      const item = routeMap.get(vp);
      cells.push(item ? item.h1_clipping.verdict : "N/A");
      cells.push(item ? item.cta_above_fold.verdict : "N/A");
      cells.push(item ? item.contrast.verdict : "N/A");
      cells.push(item ? item.visual_quality.verdict : "N/A");
    }

    lines.push(`| ${cells.join(" | ")} |`);
  }

  lines.push("");
  lines.push("## Counts by axis");
  for (const vp of viewports) {
    const passes = rows.filter((r) => r.viewport === vp && r.visual_quality.verdict === "PASS").length;
    const partials = rows.filter((r) => r.viewport === vp && r.visual_quality.verdict === "PARTIAL").length;
    const fails = rows.filter((r) => r.viewport === vp && r.visual_quality.verdict === "FAIL").length;
    lines.push(`- **${vp}** — ${passes} PASS · ${partials} PARTIAL · ${fails} FAIL`);
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function buildJsonReport(inputDir: string, label: Label, rows: CaptureResult[]): string {
  const viewports = [...new Set(rows.map((r) => r.viewport))].sort(viewportSort);
  const routes = [...new Set(rows.map((r) => r.route))].sort(routeOrder);

  const byRoute = new Map<string, Map<string, CaptureResult>>();
  for (const row of rows) {
    if (!byRoute.has(row.route)) byRoute.set(row.route, new Map());
    byRoute.get(row.route)!.set(row.viewport, row);
  }

  const matrix = routes.map((route) => {
    const routeMap = byRoute.get(route)!;
    const values: Record<string, string> = {};
    for (const vp of viewports) {
      const r = routeMap.get(vp);
      values[`${vp} H1 clipping`] = r ? r.h1_clipping.verdict : "N/A";
      values[`${vp} CTA above-fold`] = r ? r.cta_above_fold.verdict : "N/A";
      values[`${vp} Contrast`] = r ? r.contrast.verdict : "N/A";
      values[`${vp} Visual quality`] = r ? r.visual_quality.verdict : "N/A";
    }
    return { route: routeSafeToDisplay(route), route_safe: route, columns: values };
  });

  const headers = [
    "route",
    ...viewports.flatMap((vp) => [
      `${vp} H1 clipping`,
      `${vp} CTA above-fold`,
      `${vp} Contrast`,
      `${vp} Visual quality`,
    ]),
  ];

  return JSON.stringify(
    {
      generator: "route-viewport deterministic matrix v1",
      input_dir: inputDir,
      label,
      generated_at: new Date().toISOString(),
      summary: {
        routes: routes.length,
        viewports: viewports.length,
        records: rows.length,
      },
      axis: {
        h1_clipping: "PASS/PARTIAL/FAIL",
        cta_above_fold: "PASS/PARTIAL/FAIL",
        contrast: "PASS/PARTIAL/FAIL",
        visual_quality: "derived",
      },
      matrix: {
        headers,
        columns: headers,
        rows: matrix,
      },
      records: rows.map((r) => ({
        file: r.file,
        route: r.route,
        route_display: r.route_display,
        viewport: r.viewport,
        h1_clipping: r.h1_clipping,
        cta_above_fold: r.cta_above_fold,
        contrast: r.contrast,
        visual_quality: r.visual_quality,
      })),
    },
    null,
    2,
  );
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const entries = await readdir(options.input);

  const captures = entries
    .map((file) => {
      const m = file.match(FILENAME_RE);
      if (!m) return null;
      return {
        file,
        routeSafe: m[1] ?? "root",
        viewport: `${m[2]}x${m[3]}`,
      };
    })
    .filter((x): x is { file: string; routeSafe: string; viewport: string } => Boolean(x))
    .sort((a, b) => {
      const routeCmp = routeOrder(a.routeSafe, b.routeSafe);
      if (routeCmp !== 0) return routeCmp;
      return viewportSort(a.viewport, b.viewport);
    });

  if (captures.length === 0) {
    console.error(`No matching PNG files in ${options.input}`);
    process.exit(1);
  }

  const rows: CaptureResult[] = [];
  for (const c of captures) {
    rows.push(await evaluateCapture(options.input, c.file, c.routeSafe, c.viewport));
  }

  rows.sort((a, b) => {
    const routeCmp = routeOrder(a.route, b.route);
    if (routeCmp !== 0) return routeCmp;
    return viewportSort(a.viewport, b.viewport);
  });

  const markdown = buildMarkdown(options.label, rows);
  const json = buildJsonReport(options.input, options.label, rows);

  await ensureDir(options.outputMd);
  await ensureDir(options.outputJson);
  await writeFile(options.outputMd, markdown, "utf8");
  await writeFile(options.outputJson, json, "utf8");

  console.log(`wrote ${options.outputMd}`);
  console.log(`wrote ${options.outputJson}`);
}

await main();
