#!/usr/bin/env bun
/**
 * Cycle 19B-FL — render lead-magnet PDFs.
 *
 * Reads the static-export HTML rendered by Next.js at `out/downloads/{slug}/`
 * and prints each to a brand-quality PDF via Chrome `--headless --print-to-pdf`.
 * Writes each PDF to BOTH `out/downloads/{slug}.pdf` (so this deploy serves it)
 * AND `public/downloads/{slug}.pdf` (so the next clean build picks it up via
 * Next.js's automatic public-asset copy).
 *
 * Prerequisites: `bun run build` must have produced `out/downloads/{slug}/`
 * before this script runs. The PostStep is non-destructive — overwrite is
 * acceptable.
 *
 * Chrome flags chosen for headless Linux server (no Playwright/Puppeteer
 * dependency): `--headless=new --no-sandbox --disable-gpu --hide-scrollbars
 * --no-pdf-header-footer --virtual-time-budget=4000`. The PDF emits letter
 * size, default Chrome print settings.
 *
 * Exit codes:
 *   0 — all PDFs rendered + copied
 *   1 — chrome failed on at least one slug
 *   2 — out/downloads/{slug}/ missing for at least one slug (build needed)
 */
import { mkdir, stat, copyFile, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { spawn } from "node:child_process";
import { LEAD_MAGNETS } from "../src/data/lead-magnets/index";

const ROOT = resolve(import.meta.dirname, "..");
const OUT_DIR = join(ROOT, "out");
const PUBLIC_DOWNLOADS = join(ROOT, "public", "downloads");

const CHROME_BIN = process.env["CHROME_BIN"] ?? "google-chrome";

function runChrome(args: ReadonlyArray<string>): Promise<{ code: number; err: string }> {
  return new Promise((resolvePromise) => {
    const child = spawn(CHROME_BIN, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (chunk) => {
      err += String(chunk);
    });
    child.on("close", (code) => resolvePromise({ code: code ?? -1, err }));
  });
}

async function renderOne(slug: string): Promise<{ slug: string; ok: boolean; reason?: string }> {
  const htmlDir = join(OUT_DIR, "downloads", slug);
  const htmlIndex = join(htmlDir, "index.html");
  if (!existsSync(htmlIndex)) {
    return { slug, ok: false, reason: `missing out/downloads/${slug}/index.html — run 'bun run build' first` };
  }
  const outPdf = join(OUT_DIR, "downloads", `${slug}.pdf`);
  const publicPdf = join(PUBLIC_DOWNLOADS, `${slug}.pdf`);
  await mkdir(dirname(outPdf), { recursive: true });
  await mkdir(dirname(publicPdf), { recursive: true });
  const fileUrl = `file://${htmlIndex}`;
  const args = [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-pdf-header-footer",
    "--virtual-time-budget=4000",
    `--print-to-pdf=${outPdf}`,
    fileUrl,
  ];
  const result = await runChrome(args);
  if (result.code !== 0 || !existsSync(outPdf)) {
    return { slug, ok: false, reason: `chrome exited ${result.code}: ${result.err.slice(0, 200)}` };
  }
  const size = (await stat(outPdf)).size;
  if (size < 5_000) {
    return { slug, ok: false, reason: `pdf too small (${size} bytes)` };
  }
  await copyFile(outPdf, publicPdf);
  return { slug, ok: true };
}

async function main() {
  if (!existsSync(OUT_DIR)) {
    console.error(`✗ out/ missing — run 'bun run build' first.`);
    process.exit(2);
  }
  // Clear stale PDF artifacts in public/downloads so we don't keep ones that
  // no longer correspond to an active slug.
  if (existsSync(PUBLIC_DOWNLOADS)) {
    const existing = await readdir(PUBLIC_DOWNLOADS);
    for (const f of existing) {
      if (f.endsWith(".pdf") && !LEAD_MAGNETS.find((m) => `${m.slug}.pdf` === f)) {
        await rm(join(PUBLIC_DOWNLOADS, f));
      }
    }
  }

  const results = [] as Array<{ slug: string; ok: boolean; reason?: string }>;
  for (const magnet of LEAD_MAGNETS) {
    process.stdout.write(`▶ ${magnet.slug} … `);
    const r = await renderOne(magnet.slug);
    results.push(r);
    if (r.ok) {
      const size = (await stat(join(OUT_DIR, "downloads", `${magnet.slug}.pdf`))).size;
      console.log(`✓ ${(size / 1024).toFixed(1)} KB`);
    } else {
      console.log(`✗ ${r.reason ?? "unknown"}`);
    }
  }
  const ok = results.filter((r) => r.ok).length;
  console.log(`render-lead-magnets — ${ok}/${results.length} PDFs rendered`);
  if (ok !== results.length) {
    const missingBuild = results.some((r) => r.reason?.includes("missing out/"));
    process.exit(missingBuild ? 2 : 1);
  }
}

main().catch((err) => {
  console.error("render-lead-magnets crashed:", err);
  process.exit(1);
});
