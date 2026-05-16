#!/usr/bin/env bun
/**
 * probe-live-neighborhood-images — visit /markets/ + each /markets/<slug>/
 * with Chrome headless dump-dom, extract every <img> for the 7 slugs of
 * interest, and report naturalWidth/naturalHeight/complete/visibility.
 *
 * Usage:
 *   bun run scripts/probe-live-neighborhood-images.ts \
 *     --base=https://miasanabriarealtor.trueidea.com \
 *     --out=docs/artifacts/cycle-38-live-images-bridge-hero/live-image-repro
 *
 * Exits 0 if every named slug has at least one rendered image with
 * naturalWidth>0 across /markets/ AND its detail page; otherwise exits 1.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

declare const Bun: { argv: string[] };

const SEVEN = [
  "deerfield-beach",
  "hollywood",
  "plantation",
  "weston",
  "coral-springs",
  "davie",
  "sunrise",
] as const;

type Args = { base: string; out: string };
function parseArgs(): Args {
  let base = "https://miasanabriarealtor.trueidea.com";
  let out = "docs/artifacts/cycle-38-live-images-bridge-hero/live-image-repro";
  for (const a of Bun.argv.slice(2)) {
    if (a.startsWith("--base=")) base = a.slice("--base=".length);
    else if (a.startsWith("--out=")) out = a.slice("--out=".length);
  }
  return { base, out };
}

function probeScript() {
  return `
    <script>
      (function () {
        function dump() {
          try {
            const imgs = Array.from(document.querySelectorAll('img')).map((el) => {
              const r = el.getBoundingClientRect();
              const cs = getComputedStyle(el);
              return {
                src: el.currentSrc || el.src || '',
                alt: el.alt || '',
                complete: !!el.complete,
                naturalWidth: el.naturalWidth || 0,
                naturalHeight: el.naturalHeight || 0,
                renderedWidth: Math.round(r.width),
                renderedHeight: Math.round(r.height),
                visible: cs.visibility !== 'hidden' && cs.display !== 'none' && r.width > 0 && r.height > 0,
                loading: el.loading || '',
              };
            });
            const payload = { url: location.href, imgs };
            const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
            document.title = 'IMG_PROBE::' + b64;
          } catch (e) {
            document.title = 'IMG_PROBE_ERR::' + (e && e.message || 'unknown');
          }
        }
        if (document.readyState === 'complete') setTimeout(dump, 2000);
        else window.addEventListener('load', () => setTimeout(dump, 2000));
      })();
    </script>
  `;
}

async function dumpDom(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--virtual-time-budget=15000",
      "--window-size=1280,2000",
      "--user-data-dir=" + join(tmpdir(), `chrome-img-probe-${Date.now()}`),
      "--dump-dom",
      url,
    ];
    const child = spawn("google-chrome", args, { stdio: ["ignore", "pipe", "pipe"] });
    const chunks: Buffer[] = [];
    child.stdout.on("data", (d: Buffer) => chunks.push(d));
    child.stderr.on("data", () => {});
    child.on("error", reject);
    child.on("close", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
  });
}

// Inject probe by fetching HTML, prepending <script>, hosting via data: URL — too risky.
// Simpler: just dump-dom the page and read <img> tags + JS-side naturalWidth via a small
// proxy. But chrome --dump-dom runs JS, so a server-side rewrite is the cleanest path.
// For dev expedience, do TWO passes:
//   pass A: fetch HTML, prepend probe, write to temp file, dump-dom the file:// URL
//   pass B: fall back to dump-dom raw — extract <img src=...> only (no naturalWidth)
async function probeOne(base: string, path: string, outDir: string) {
  const full = base.replace(/\/$/, "") + path;
  // Pass A: fetch HTML, inject probe before </head>, dump local file
  let html = "";
  try {
    const r = await fetch(full + (full.includes("?") ? "&" : "?") + "cb=" + Math.random().toString(36).slice(2), {
      headers: { "Cache-Control": "no-cache" },
    });
    html = await r.text();
  } catch (err) {
    return { url: full, error: `fetch failed: ${err}`, imgs: [] };
  }
  // Rewrite relative URLs to absolute so the local file pulls live assets.
  const baseHref = new URL(base).origin;
  html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseHref}/">${probeScript()}`);
  if (!/<base href=/.test(html)) {
    // already inserted; fine
  }
  const tmp = join(tmpdir(), `mia-probe-${path.replace(/[^a-z0-9-]/gi, "_")}-${Date.now()}.html`);
  await writeFile(tmp, html, "utf8");
  const dom = await dumpDom("file://" + tmp);
  // Look for IMG_PROBE::<b64>
  const m = dom.match(/IMG_PROBE::([A-Za-z0-9+/=]+)/);
  let payload: { url: string; imgs: Array<{ src: string; alt: string; complete: boolean; naturalWidth: number; naturalHeight: number; renderedWidth: number; renderedHeight: number; visible: boolean; loading: string }> } | null = null;
  if (m && m[1]) {
    try {
      const json = Buffer.from(m[1], "base64").toString("utf8");
      payload = JSON.parse(json);
    } catch {}
  }
  await writeFile(join(outDir, `probe-dom-${path.replace(/[^a-z0-9-]/gi, "_")}.html`), dom, "utf8");
  return { url: full, error: payload ? null : "probe did not run", imgs: payload?.imgs ?? [] };
}

async function main() {
  const args = parseArgs();
  await mkdir(args.out, { recursive: true });

  const routes = ["/markets/"];
  for (const slug of SEVEN) routes.push(`/markets/${slug}/`);

  const results: Record<string, unknown> = {};
  for (const path of routes) {
    process.stderr.write(`probing ${path}…\n`);
    results[path] = await probeOne(args.base, path, args.out);
  }

  // Per-slug evaluation
  const slugSummary: Record<string, { card_visible: boolean; detail_visible: boolean; card_src: string | null; detail_src: string | null }> = {};
  const marketsImgs = (results["/markets/"] as { imgs: Array<{ src: string; naturalWidth: number; renderedWidth: number; visible: boolean }> }).imgs ?? [];

  for (const slug of SEVEN) {
    const cardMatch = marketsImgs.find((i) => typeof i.src === "string" && i.src.includes(`/markets/${slug}.jpg`));
    const detail = results[`/markets/${slug}/`] as { imgs: Array<{ src: string; naturalWidth: number; renderedWidth: number; visible: boolean }> };
    const detailMatch = (detail?.imgs ?? []).find((i) => typeof i.src === "string" && i.src.includes(`/markets/${slug}.jpg`));
    slugSummary[slug] = {
      card_visible: !!(cardMatch && cardMatch.naturalWidth > 0 && cardMatch.renderedWidth > 0 && cardMatch.visible),
      detail_visible: !!(detailMatch && detailMatch.naturalWidth > 0 && detailMatch.renderedWidth > 0 && detailMatch.visible),
      card_src: cardMatch?.src ?? null,
      detail_src: detailMatch?.src ?? null,
    };
  }

  await writeFile(
    join(args.out, "live-neighborhood-image-reproduction.json"),
    JSON.stringify({ base: args.base, results, slugSummary }, null, 2),
    "utf8",
  );

  const lines: string[] = ["# Live Neighborhood Image Reproduction", "", `base: ${args.base}`, ""];
  let allOk = true;
  for (const slug of SEVEN) {
    const s = slugSummary[slug];
    if (!s) continue;
    const ok = s.card_visible && s.detail_visible;
    if (!ok) allOk = false;
    lines.push(`- **${slug}** — card_visible: ${s.card_visible}, detail_visible: ${s.detail_visible}`);
  }
  lines.push("", `all_seven_visible: ${allOk}`);
  await writeFile(join(args.out, "live-neighborhood-image-reproduction.md"), lines.join("\n") + "\n", "utf8");

  process.stderr.write(`\nall_seven_visible: ${allOk}\n`);
  process.exit(allOk ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
