#!/usr/bin/env bun
/**
 * deploy-and-verify — single-command Mia site deploy + verify cycle.
 *
 * Steps:
 *  1. Trigger Dokploy application.deploy
 *  2. Poll application.one until status != running
 *  3. Cache-busted curl to staging URL — confirm Last-Modified flipped
 *  4. (optional) Run Lighthouse on critical pages, emit compact scoreboard
 *
 * Usage:
 *   bun scripts/deploy-and-verify.ts                # default sweep (home, about, fort-lauderdale, contact)
 *   bun scripts/deploy-and-verify.ts --no-lighthouse # skip Lighthouse, just deploy + cache-bust verify
 *   bun scripts/deploy-and-verify.ts --pages=home,insights
 */
import { readFile, mkdir } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";

const APP_ID = "XJSRlvH-91ZtUsh0RPGvo";
const STAGING_BASE = "https://miasanabriarealtor.trueidea.com";
const ENV_PATH = `${process.env.HOME}/.claude/.env`;

const DEFAULT_PAGES: Record<string, string> = {
  home: "/",
  about: "/about/",
  "fort-lauderdale": "/markets/fort-lauderdale/",
  contact: "/contact/",
};

async function loadEnv() {
  const txt = await readFile(ENV_PATH, "utf-8");
  for (const line of txt.split("\n")) {
    const [k, ...v] = line.trim().split("=");
    if (!k || k.startsWith("#") || !v.length) continue;
    process.env[k] ??= v.join("=").replace(/^["']|["']$/g, "");
  }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${process.env.DOKPLOY_API_URL!.replace(/\/$/, "")}/api/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "x-api-key": process.env.DOKPLOY_API_TOKEN!,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function curlHead(url: string): Promise<{ status: number; lastModified?: string; etag?: string }> {
  const r = await fetch(url, {
    method: "HEAD",
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    redirect: "follow",
  });
  return {
    status: r.status,
    lastModified: r.headers.get("last-modified") ?? undefined,
    etag: r.headers.get("etag") ?? undefined,
  };
}

async function lighthouseRun(url: string, outPath: string): Promise<{ perf: number; a11y: number; bp: number; seo: number; lcp?: string; fcp?: string }> {
  return new Promise((resolve, reject) => {
    const p = spawn("bunx", [
      "lighthouse@12", url,
      "--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--form-factor=mobile",
      "--quiet",
      "--output=json",
      "--output-path", outPath,
    ], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("exit", async (code) => {
      if (code !== 0) return reject(new Error(`lighthouse failed: ${err.slice(0, 200)}`));
      try {
        const json = JSON.parse(await readFile(outPath, "utf-8"));
        resolve({
          perf: Math.floor(json.categories.performance.score * 100),
          a11y: Math.floor(json.categories.accessibility.score * 100),
          bp: Math.floor(json.categories["best-practices"].score * 100),
          seo: Math.floor(json.categories.seo.score * 100),
          lcp: json.audits["largest-contentful-paint"]?.displayValue,
          fcp: json.audits["first-contentful-paint"]?.displayValue,
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

function preflightStage(name: string, cmd: string): void {
  console.log(`\n▶ pre-flight ${name}`);
  const r = spawnSync("bash", ["-c", cmd], { stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`\n✗ DEPLOY-ABORT (${name}): exit ${r.status}`);
    process.exit(1);
  }
}

async function preflightAuditCompleteness(): Promise<void> {
  console.log("\n▶ pre-flight audit:completeness gate");
  // audit:all already invoked above; re-read the structured JSON to enforce FAIL=block / WARN=allow.
  // The audit script writes counts under `counts.PASS|WARN|FAIL|SKIP` (uppercase keys).
  // Cycle-3 fixed field name (summary→counts); cycle-4 fixed casing (lowercase→uppercase).
  type Counts = { PASS?: number; WARN?: number; FAIL?: number; SKIP?: number; pass?: number; warn?: number; fail?: number; skip?: number };
  try {
    const raw = await readFile("reports/audit-completeness.json", "utf-8");
    const j = JSON.parse(raw) as { counts?: Counts; summary?: Counts };
    const c: Counts = j.counts ?? j.summary ?? {};
    const pass = c.PASS ?? c.pass ?? 0;
    const warn = c.WARN ?? c.warn ?? 0;
    const fail = c.FAIL ?? c.fail ?? 0;
    const skip = c.SKIP ?? c.skip ?? 0;
    console.log(`  pass=${pass} warn=${warn} fail=${fail} skip=${skip}`);
    if (fail > 0) {
      console.error(`✗ DEPLOY-ABORT (audit-completeness): ${fail} FAIL(s) — see reports/audit-completeness.md`);
      process.exit(1);
    }
  } catch (e) {
    console.error(`✗ DEPLOY-ABORT (audit-completeness): cannot read reports/audit-completeness.json — ${(e as Error).message}`);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Usage: bun scripts/deploy-and-verify.ts [--no-preflight] [--no-lighthouse] [--pages=slug,slug]
  Pre-flight gates (typecheck → lint → build → audit:all → audit-completeness FAIL gate),
  triggers Dokploy deploy, polls until done, cache-bust verifies the live URL, and runs
  Lighthouse on critical pages by default.`);
    return;
  }
  const skipPreflight = args.includes("--no-preflight");
  const skipLh = args.includes("--no-lighthouse");
  const pagesArg = args.find((a) => a.startsWith("--pages="));
  const pages = pagesArg
    ? Object.fromEntries(pagesArg.slice("--pages=".length).split(",").map((slug) => [slug, DEFAULT_PAGES[slug] ?? `/${slug}/`]))
    : DEFAULT_PAGES;

  if (!skipPreflight) {
    preflightStage("typecheck", "bun run typecheck");
    preflightStage("lint", "bun run lint");
    preflightStage("build", "bun run build");
    preflightStage("audit:all", "bun run audit:all");
    await preflightAuditCompleteness();
    console.log("\n✓ pre-flight passed — proceeding to deploy.");
  } else {
    console.log("⚠ --no-preflight passed — skipping typecheck/lint/build/audit gates.");
  }

  await loadEnv();

  console.log("→ triggering deploy");
  await api<unknown>("application.deploy", { method: "POST", body: JSON.stringify({ applicationId: APP_ID }) });

  const before = await curlHead(`${STAGING_BASE}/?_=${Date.now()}`);
  console.log(`  pre-deploy last-modified: ${before.lastModified ?? "?"}`);

  console.log("→ polling application status");
  const start = Date.now();
  let status = "running";
  while (status === "running") {
    await new Promise((r) => setTimeout(r, 8000));
    const app = await api<{ applicationStatus: string }>(`application.one?applicationId=${APP_ID}`);
    status = app.applicationStatus;
    process.stdout.write(`  [${((Date.now() - start) / 1000).toFixed(0)}s] status=${status}\n`);
  }
  if (status !== "done") {
    console.error(`✗ deploy ended with status=${status}`);
    process.exit(1);
  }
  console.log(`✓ deploy done in ${((Date.now() - start) / 1000).toFixed(0)}s`);

  await new Promise((r) => setTimeout(r, 3000));
  const after = await curlHead(`${STAGING_BASE}/?_=${Date.now()}`);
  console.log(`  post-deploy last-modified: ${after.lastModified ?? "?"}`);
  if (after.lastModified === before.lastModified) {
    console.warn("  ⚠ last-modified did not change — Caddy may be caching even with bust headers");
  }

  if (skipLh) return;

  console.log("\n→ Lighthouse sweep");
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const auditDir = `audits/${ts}`;
  await mkdir(auditDir, { recursive: true });
  const results = await Promise.all(
    Object.entries(pages).map(async ([slug, path]) => {
      const url = `${STAGING_BASE}${path}?_=${Date.now()}`;
      const out = `${auditDir}/lh-${slug}.json`;
      try {
        const r = await lighthouseRun(url, out);
        return { slug, ok: true as const, ...r };
      } catch (e) {
        return { slug, ok: false as const, error: (e as Error).message };
      }
    })
  );
  console.log(`\n=== Lighthouse scoreboard (${auditDir}) ===`);
  console.log(`${"page".padEnd(20)} perf  a11y  bp    seo   LCP        FCP`);
  for (const r of results) {
    if (r.ok) {
      console.log(
        `${r.slug.padEnd(20)} ${String(r.perf).padStart(3)}   ${String(r.a11y).padStart(3)}   ${String(r.bp).padStart(3)}   ${String(r.seo).padStart(3)}   ${(r.lcp ?? "?").padEnd(10)} ${r.fcp ?? "?"}`
      );
    } else {
      console.log(`${r.slug.padEnd(20)} ✗ ${r.error.slice(0, 80)}`);
    }
  }
}

main().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
