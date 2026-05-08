#!/usr/bin/env bun
/**
 * audit-mobile — captures 5 viewports × N routes against the live staging site.
 *
 * Output: /tmp/mia-mobile-shots/<viewport>-<route-slug>.jpg
 *         /tmp/mia-mobile-shots/index.md (markdown thumbnail grid)
 *
 * Uses headless Chrome directly (per memory: feedback_interceptor_headless_server_fallback.md
 * — Interceptor's daemon needs a real-Chrome host with the extension installed; on Linux server
 * we drive `google-chrome --headless=new --no-sandbox --screenshot=`).
 *
 * Usage:
 *   bun scripts/audit-mobile.ts                 # default 5 viewports × 5 routes
 *   bun scripts/audit-mobile.ts --base=URL      # override staging URL
 *   bun scripts/audit-mobile.ts --routes=/...   # comma-separated route paths
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const VIEWPORTS = [
  { name: "iphone-se", width: 320, height: 568, label: "320 × 568 (iPhone SE 1)" },
  { name: "iphone-15", width: 375, height: 812, label: "375 × 812 (iPhone 15)" },
  { name: "pixel-7", width: 414, height: 896, label: "414 × 896 (Pixel 7)" },
  { name: "ipad-portrait", width: 768, height: 1024, label: "768 × 1024 (iPad Portrait)" },
  { name: "desktop-1024", width: 1024, height: 768, label: "1024 × 768 (Small desktop)" },
] as const;

const DEFAULT_ROUTES = [
  { slug: "home", path: "/" },
  { slug: "about", path: "/about/" },
  { slug: "contact", path: "/contact/" },
  { slug: "fort-lauderdale", path: "/markets/fort-lauderdale/" },
  { slug: "insights", path: "/insights/" },
];

function chromeShot(url: string, width: number, height: number, out: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(
      "google-chrome",
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--hide-scrollbars",
        `--window-size=${width},${height}`,
        `--screenshot=${out}`,
        "--virtual-time-budget=8000",
        url,
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );
    let err = "";
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`chrome exit ${code}: ${err.slice(0, 200)}`));
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const base =
    args.find((a) => a.startsWith("--base="))?.slice("--base=".length) ??
    "https://miasanabriarealtor.trueidea.com";
  const routesArg = args.find((a) => a.startsWith("--routes="));
  const routes = routesArg
    ? routesArg
        .slice("--routes=".length)
        .split(",")
        .map((p) => ({ slug: p.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root", path: p }))
    : DEFAULT_ROUTES;

  const outDir = "/tmp/mia-mobile-shots";
  await mkdir(outDir, { recursive: true });

  console.log(`→ ${VIEWPORTS.length} viewports × ${routes.length} routes = ${VIEWPORTS.length * routes.length} screenshots`);
  const stamp = Date.now();
  const results: { viewport: string; route: string; path: string; file: string; ok: boolean; err?: string }[] = [];

  for (const v of VIEWPORTS) {
    for (const r of routes) {
      const url = `${base}${r.path}?_=${stamp}`;
      const file = `${outDir}/${v.name}-${r.slug}.jpg`;
      try {
        await chromeShot(url, v.width, v.height, file);
        process.stdout.write(`  ✓ ${v.name} ${r.slug}\n`);
        results.push({ viewport: v.name, route: r.slug, path: r.path, file, ok: true });
      } catch (e) {
        process.stdout.write(`  ✗ ${v.name} ${r.slug}: ${(e as Error).message.slice(0, 60)}\n`);
        results.push({ viewport: v.name, route: r.slug, path: r.path, file, ok: false, err: (e as Error).message });
      }
    }
  }

  const passed = results.filter((r) => r.ok).length;
  console.log(`\n${passed}/${results.length} screenshots captured`);

  // Build markdown index
  const lines: string[] = [
    `# Mia Mobile Audit — ${new Date().toISOString()}`,
    ``,
    `Base: \`${base}\``,
    ``,
    `Total: ${results.length} (${passed} ok / ${results.length - passed} failed)`,
    ``,
    `## By Viewport`,
    ``,
  ];
  for (const v of VIEWPORTS) {
    lines.push(`### ${v.label}`, ``);
    lines.push(`| Route | Screenshot |`);
    lines.push(`|-------|------------|`);
    for (const r of routes) {
      const hit = results.find((x) => x.viewport === v.name && x.route === r.slug);
      const cell = hit?.ok ? `![${v.name}-${r.slug}](./${v.name}-${r.slug}.jpg)` : `❌ ${hit?.err?.slice(0, 60) ?? "missing"}`;
      lines.push(`| \`${r.path}\` | ${cell} |`);
    }
    lines.push(``);
  }
  lines.push(``, `## Manual Audit Checklist (per route × viewport)`, ``);
  lines.push(`- [ ] Hero H1 readable against background image (no wash-out)`);
  lines.push(`- [ ] Sticky-header does not overlap H1 on scroll-restore`);
  lines.push(`- [ ] All tappable elements ≥ 44 × 44 CSS px with ≥ 8 px gap (WCAG 2.5.5 AAA)`);
  lines.push(`- [ ] Form inputs ≥ 16 px font-size (no iOS Safari focus-zoom)`);
  lines.push(`- [ ] No horizontal scroll at any viewport`);
  lines.push(`- [ ] Bottom-fixed CTAs honor \`env(safe-area-inset-bottom)\` on iOS`);
  lines.push(`- [ ] Heading hierarchy sequential (no skipped levels)`);
  lines.push(`- [ ] Images have meaningful alt text (or empty alt for decorative)`);
  lines.push(`- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text`);
  lines.push(`- [ ] Visible focus state on every interactive element`);

  await writeFile(`${outDir}/index.md`, lines.join("\n"));
  console.log(`\nIndex: ${outDir}/index.md`);
  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
