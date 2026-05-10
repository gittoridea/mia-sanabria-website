#!/usr/bin/env bun
/**
 * capture-baseline — parallel google-chrome --headless screenshot harness.
 *
 * Cycle 10 substrate: capture rendered screenshots across all routes × viewports
 * before/after a deploy so rendered-visual QA + GPT-5.5 acceptance can score
 * actual pixel output. Uses google-chrome --headless=new (Interceptor fails on
 * headless servers per feedback_interceptor_headless_server_fallback.md).
 *
 * Usage:
 *   bun run scripts/capture-baseline.ts --base=<url> --out=<dir> [--routes=a,b,c] [--viewports=320x568,...] [--concurrency=N] [--vtb=ms]
 *
 * Defaults:
 *   --base=https://miasanabriarealtor.trueidea.com (live staging)
 *   --out=/tmp/mia-cycle10-rendered-before
 *   --concurrency=4
 *   --vtb=20000
 *
 * Authored: 2026-05-09 cycle 10 (rendered visual QA baseline)
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

type Viewport = { name: string; width: number; height: number };

const args = process.argv.slice(2);
function arg(prefix: string, fallback: string): string {
  const a = args.find((x) => x.startsWith(prefix));
  return a ? a.slice(prefix.length) : fallback;
}

const BASE = arg("--base=", "https://miasanabriarealtor.trueidea.com").replace(/\/$/, "");
const OUT = arg("--out=", "/tmp/mia-cycle10-rendered-before");
const CONCURRENCY = Number(arg("--concurrency=", "4"));
const VTB = Number(arg("--vtb=", "20000"));

const ROUTES_DEFAULT = [
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
  "/404",
];

const ROUTES_OVERRIDE = arg("--routes=", "").split(",").map((s) => s.trim()).filter(Boolean);
const ROUTES = ROUTES_OVERRIDE.length ? ROUTES_OVERRIDE : ROUTES_DEFAULT;

const VIEWPORTS_DEFAULT: Viewport[] = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x812", width: 375, height: 812 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1440x900", width: 1440, height: 900 },
];

const VPS_OVERRIDE = arg("--viewports=", "");
const VIEWPORTS: Viewport[] = VPS_OVERRIDE
  ? VPS_OVERRIDE.split(",").map((s) => {
      const m = s.match(/(\d+)x(\d+)/);
      if (!m) throw new Error(`bad viewport: ${s}`);
      return { name: `${m[1]}x${m[2]}`, width: Number(m[1]), height: Number(m[2]) };
    })
  : VIEWPORTS_DEFAULT;

function routeSafe(route: string): string {
  return route
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .replace(/\//g, "_")
    .replace(/[^a-z0-9_-]/gi, "_") || "home";
}

type Job = { route: string; viewport: Viewport; url: string; outFile: string };

async function captureOne(job: Job): Promise<{ ok: boolean; err?: string }> {
  return new Promise((resolve) => {
    const url = `${BASE}${job.route}?_=${Date.now()}`;
    const chromeArgs = [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${job.viewport.width},${job.viewport.height}`,
      `--virtual-time-budget=${VTB}`,
      `--screenshot=${job.outFile}`,
      url,
    ];
    const p = spawn("google-chrome", chromeArgs, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("exit", (code) => {
      if (code !== 0) resolve({ ok: false, err: err.slice(0, 200) });
      else resolve({ ok: true });
    });
    setTimeout(() => {
      try { p.kill("SIGKILL"); } catch {}
      resolve({ ok: false, err: "timeout" });
    }, VTB + 30000);
  });
}

async function runPool<T>(items: T[], n: number, fn: (item: T, i: number) => Promise<void>): Promise<void> {
  let cursor = 0;
  const workers = Array.from({ length: n }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      if (i >= items.length) break;
      await fn(items[i] as T, i);
    }
  });
  await Promise.all(workers);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const jobs: Job[] = [];
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      const filename = `${routeSafe(route)}__${vp.name}.png`;
      jobs.push({ route, viewport: vp, url: `${BASE}${route}`, outFile: join(OUT, filename) });
    }
  }
  console.log(`capture-baseline: ${jobs.length} jobs · ${ROUTES.length} routes × ${VIEWPORTS.length} viewports · concurrency ${CONCURRENCY} · base ${BASE}`);
  console.log(`output: ${OUT}`);
  const start = Date.now();
  let ok = 0, fail = 0;
  const failures: { url: string; err: string }[] = [];
  await runPool(jobs, CONCURRENCY, async (job, i) => {
    const t0 = Date.now();
    const r = await captureOne(job);
    const ms = Date.now() - t0;
    if (r.ok) {
      ok++;
      process.stdout.write(`  [${i + 1}/${jobs.length}] ✓ ${job.route} @ ${job.viewport.name} (${ms}ms)\n`);
    } else {
      fail++;
      failures.push({ url: `${job.route}@${job.viewport.name}`, err: r.err ?? "?" });
      process.stdout.write(`  [${i + 1}/${jobs.length}] ✗ ${job.route} @ ${job.viewport.name} — ${r.err}\n`);
    }
  });
  const dur = ((Date.now() - start) / 1000).toFixed(0);
  const summary = {
    base: BASE,
    out: OUT,
    routes: ROUTES.length,
    viewports: VIEWPORTS.length,
    jobs: jobs.length,
    ok,
    fail,
    duration_seconds: Number(dur),
    failures,
    timestamp: new Date().toISOString(),
  };
  await writeFile(join(OUT, "_capture-summary.json"), JSON.stringify(summary, null, 2));
  console.log(`\nDone: ${ok}/${jobs.length} ok · ${fail} failed · ${dur}s`);
  console.log(`Summary: ${OUT}/_capture-summary.json`);
  if (fail > 0) process.exit(1);
}

main().catch((e) => { console.error("✗", e.message); process.exit(1); });
