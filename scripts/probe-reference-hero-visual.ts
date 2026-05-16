#!/usr/bin/env bun
/**
 * probe-reference-hero-visual — capture the actual visible hero on
 * https://miasanabria.com/ and surface every image URL candidate that could
 * plausibly be the rendered hero (NOT just og:image).
 *
 * Strategy:
 *   1. google-chrome --headless=new --virtual-time-budget=15000 --dump-dom
 *      renders the page with JS + lazy assets resolved; grep extracts every
 *      <img src>, every CSS `url(...)`, every preload as=image, every meta
 *      og:image/twitter:image content URL.
 *   2. google-chrome --headless=new --screenshot at desktop captures the
 *      actual rendered viewport hero — operator-facing visual proof for the
 *      Cycle 39 reference-hero report.
 *   3. JSON output enumerates every URL with HTTP HEAD status, content-type,
 *      and content-length so the report can show which candidate is the
 *      real hero asset by elimination.
 *
 * No token output, no scraping of restricted endpoints, GET-only requests
 * against a public website. Stays inside the mission brief's reuse
 * authorization.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const REPO = process.cwd();
const OUT = join(REPO, "docs/artifacts/cycle-39-visual-truth-recovery/reference-home");
const TARGET = "https://miasanabria.com/";

function run(cmd: string, argv: string[], timeoutMs: number): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, argv, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (code: number) => {
      if (settled) return;
      settled = true;
      resolve({ stdout, stderr, code });
    };
    const timer = setTimeout(() => {
      try { child.kill("SIGKILL"); } catch {}
      finish(124);
    }, timeoutMs);
    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    child.on("close", (code) => {
      clearTimeout(timer);
      finish(code ?? 1);
    });
    child.on("error", () => finish(1));
  });
}

async function headProbe(url: string): Promise<{ status: number | null; contentType: string | null; bytes: number | null }> {
  try {
    const res = await fetch(url, { method: "HEAD", headers: { "Cache-Control": "no-cache" } });
    return {
      status: res.status,
      contentType: res.headers.get("content-type"),
      bytes: Number(res.headers.get("content-length") ?? "0") || null,
    };
  } catch {
    return { status: null, contentType: null, bytes: null };
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // 1) Headless DOM dump with JS executed.
  const dom = await run("google-chrome", [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1440,1000",
    "--virtual-time-budget=15000",
    "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "--dump-dom",
    TARGET,
  ], 45_000);

  const htmlPath = join(OUT, "miasanabria-home-rendered.html");
  await writeFile(htmlPath, dom.stdout);

  // 2) Headless screenshot of the rendered hero.
  const shotPath = join(OUT, "miasanabria-home-1440x1000.png");
  await run("google-chrome", [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1440,1000",
    "--virtual-time-budget=15000",
    `--screenshot=${shotPath}`,
    TARGET,
  ], 45_000);
  const shotMobile = join(OUT, "miasanabria-home-375x812.png");
  await run("google-chrome", [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=375,812",
    "--virtual-time-budget=15000",
    `--screenshot=${shotMobile}`,
    TARGET,
  ], 45_000);

  // 3) Extract image URL candidates from the rendered DOM.
  const html = dom.stdout;
  const candidates = new Set<string>();
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) candidates.add(m[1] ?? "");
  for (const m of html.matchAll(/url\(([^)]+)\)/gi)) {
    const raw = (m[1] ?? "").replace(/^["']|["']$/g, "").trim();
    if (/\.(jpg|jpeg|png|webp|avif|gif)(\?|$)/i.test(raw)) candidates.add(raw);
  }
  for (const m of html.matchAll(/<link[^>]+rel=["']preload["'][^>]+as=["']image["'][^>]+href=["']([^"']+)["']/gi)) {
    candidates.add(m[1] ?? "");
  }
  for (const m of html.matchAll(/<meta[^>]+property=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi)) {
    candidates.add(m[1] ?? "");
  }

  // 4) HEAD-probe each absolute candidate.
  const results: Array<{
    url: string;
    abs: string | null;
    status: number | null;
    contentType: string | null;
    bytes: number | null;
    surface: string;
  }> = [];
  for (const url of candidates) {
    if (!url) continue;
    let abs: string | null = null;
    try { abs = new URL(url, TARGET).toString(); } catch {}
    if (!abs) continue;
    const surfaces: string[] = [];
    if (html.includes(`og:image"`) && html.includes(url)) surfaces.push("og");
    if (html.includes(`twitter:image"`) && html.includes(url)) surfaces.push("tw");
    if (html.includes(`<img`) && html.includes(`src="${url}"`)) surfaces.push("img");
    if (html.includes(`url(${url})`) || html.includes(`url("${url}")`) || html.includes(`url('${url}')`)) surfaces.push("css");
    if (html.includes(`as="image"`) && html.includes(`href="${url}"`)) surfaces.push("preload");
    const probe = await headProbe(abs);
    results.push({ url, abs, status: probe.status, contentType: probe.contentType, bytes: probe.bytes, surface: surfaces.join("+") || "unknown" });
  }

  const summary = {
    target: TARGET,
    generated_at: new Date().toISOString(),
    rendered_dom_path: htmlPath.replace(REPO + "/", ""),
    screenshots: {
      desktop_1440x1000: shotPath.replace(REPO + "/", ""),
      mobile_375x812: shotMobile.replace(REPO + "/", ""),
    },
    candidates: results.sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0)),
    likely_hero: results
      .filter((r) => r.status === 200 && (r.surface.includes("css") || r.surface.includes("preload") || r.surface.includes("og")))
      .sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0))
      .slice(0, 5),
  };
  const jsonPath = join(OUT, "reference-hero-candidates.json");
  await writeFile(jsonPath, JSON.stringify(summary, null, 2));
  console.log(`probe-reference-hero-visual: wrote ${results.length} candidates → ${jsonPath}`);
  console.log(`screenshots: ${shotPath}, ${shotMobile}`);
  console.log(`top candidates (by bytes):`);
  for (const c of summary.likely_hero) {
    console.log(`  ${c.surface}  ${c.bytes ?? "?"}B  ${c.contentType ?? "?"}  ${c.abs}`);
  }
}

main().catch((err) => {
  console.error("probe-reference-hero-visual FATAL", err);
  process.exit(1);
});
