#!/usr/bin/env bun
/**
 * audit-neighborhood-images-deep — verifies every market/neighborhood route
 * has a real hero image and OG image (not a brand-tone placeholder).
 *
 * For each slug in ALL_MARKET_SLUGS:
 *   - public/markets/<slug>.jpg must exist
 *   - public/og-markets/<slug>.jpg must exist
 *   - File size ≥ MIN_HERO_BYTES (default 80_000) and dimensions ≥ 1200x630
 *   - When --base=<url> is passed, HEAD checks the live URL too
 *
 * Outputs:
 *   reports/audit-neighborhood-images-deep.json
 *   reports/audit-neighborhood-images-deep.md
 *
 * Exit 0 on PASS, 1 on FAIL.
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ALL_MARKET_SLUGS } from "../src/lib/mia";

declare const Bun: { argv: string[] };

const REPO = process.cwd();
const REPORTS = join(REPO, "reports");

type Args = { base: string | null };
function parseArgs(): Args {
  let base: string | null = null;
  for (const a of Bun.argv.slice(2)) {
    if (a.startsWith("--base=")) base = a.slice("--base=".length);
  }
  return { base };
}

const MIN_HERO_BYTES = 80_000;
const MIN_OG_BYTES = 60_000;
const MIN_HERO_WIDTH = 1200;
const MIN_HERO_HEIGHT = 1500;
const MIN_OG_WIDTH = 1200;
const MIN_OG_HEIGHT = 630;

type RowStatus = "PASS" | "FAIL";
type Row = {
  slug: string;
  hero_path: string;
  hero_exists: boolean;
  hero_bytes: number;
  hero_w: number;
  hero_h: number;
  og_path: string;
  og_exists: boolean;
  og_bytes: number;
  og_w: number;
  og_h: number;
  hero_live_status: number | null;
  og_live_status: number | null;
  status: RowStatus;
  reasons: string[];
};

async function fileSize(p: string): Promise<number> {
  try {
    return (await stat(p)).size;
  } catch {
    return -1;
  }
}

async function imageDims(p: string): Promise<{ w: number; h: number }> {
  try {
    const m = await sharp(p).metadata();
    return { w: m.width ?? 0, h: m.height ?? 0 };
  } catch {
    return { w: 0, h: 0 };
  }
}

async function headStatus(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "Cache-Control": "no-cache" },
    });
    return res.status;
  } catch {
    return null;
  }
}

async function main() {
  await mkdir(REPORTS, { recursive: true });
  const args = parseArgs();

  const rows: Row[] = [];
  for (const slug of ALL_MARKET_SLUGS) {
    const heroPath = join(REPO, `public/markets/${slug}.jpg`);
    const ogPath = join(REPO, `public/og-markets/${slug}.jpg`);
    const heroBytes = await fileSize(heroPath);
    const ogBytes = await fileSize(ogPath);
    const heroDims = heroBytes > 0 ? await imageDims(heroPath) : { w: 0, h: 0 };
    const ogDims = ogBytes > 0 ? await imageDims(ogPath) : { w: 0, h: 0 };

    let heroLive: number | null = null;
    let ogLive: number | null = null;
    if (args.base) {
      const cb = Math.random().toString(16).slice(2, 10);
      heroLive = await headStatus(`${args.base}/markets/${slug}.jpg?cb=${cb}`);
      ogLive = await headStatus(`${args.base}/og-markets/${slug}.jpg?cb=${cb}`);
    }

    const reasons: string[] = [];
    if (heroBytes < 0) reasons.push("hero-missing");
    else if (heroBytes < MIN_HERO_BYTES) reasons.push(`hero-bytes<${MIN_HERO_BYTES}`);
    if (heroDims.w < MIN_HERO_WIDTH || heroDims.h < MIN_HERO_HEIGHT)
      reasons.push(`hero-dims<${MIN_HERO_WIDTH}x${MIN_HERO_HEIGHT}`);
    if (ogBytes < 0) reasons.push("og-missing");
    else if (ogBytes < MIN_OG_BYTES) reasons.push(`og-bytes<${MIN_OG_BYTES}`);
    if (ogDims.w < MIN_OG_WIDTH || ogDims.h < MIN_OG_HEIGHT)
      reasons.push(`og-dims<${MIN_OG_WIDTH}x${MIN_OG_HEIGHT}`);
    if (args.base) {
      if (heroLive !== null && heroLive !== 200) reasons.push(`hero-live-${heroLive}`);
      if (ogLive !== null && ogLive !== 200) reasons.push(`og-live-${ogLive}`);
    }

    rows.push({
      slug,
      hero_path: `/markets/${slug}.jpg`,
      hero_exists: heroBytes > 0,
      hero_bytes: heroBytes,
      hero_w: heroDims.w,
      hero_h: heroDims.h,
      og_path: `/og-markets/${slug}.jpg`,
      og_exists: ogBytes > 0,
      og_bytes: ogBytes,
      og_w: ogDims.w,
      og_h: ogDims.h,
      hero_live_status: heroLive,
      og_live_status: ogLive,
      status: reasons.length === 0 ? "PASS" : "FAIL",
      reasons,
    });
  }

  const fails = rows.filter((r) => r.status === "FAIL");
  const json = {
    generated_at: new Date().toISOString(),
    base: args.base,
    thresholds: {
      MIN_HERO_BYTES,
      MIN_OG_BYTES,
      MIN_HERO_WIDTH,
      MIN_HERO_HEIGHT,
      MIN_OG_WIDTH,
      MIN_OG_HEIGHT,
    },
    total: rows.length,
    pass: rows.length - fails.length,
    fail: fails.length,
    rows,
  };
  await writeFile(
    join(REPORTS, "audit-neighborhood-images-deep.json"),
    JSON.stringify(json, null, 2)
  );

  const md: string[] = [];
  md.push("# audit-neighborhood-images-deep");
  md.push("");
  md.push(`Generated: ${json.generated_at}`);
  md.push(`Base: ${json.base ?? "(local files only)"}`);
  md.push(`Total: ${json.total} | Pass: ${json.pass} | Fail: ${json.fail}`);
  md.push("");
  md.push(
    "| Slug | Hero KB | Hero WxH | OG KB | OG WxH | Hero live | OG live | Status | Reasons |"
  );
  md.push(
    "|------|--------:|----------|------:|--------|----------:|--------:|:------:|---------|"
  );
  for (const r of rows) {
    md.push(
      `| ${r.slug} | ${(r.hero_bytes / 1024).toFixed(0)} | ${r.hero_w}x${r.hero_h} | ${(r.og_bytes / 1024).toFixed(0)} | ${r.og_w}x${r.og_h} | ${r.hero_live_status ?? "-"} | ${r.og_live_status ?? "-"} | ${r.status} | ${r.reasons.join(", ") || "-"} |`
    );
  }
  await writeFile(join(REPORTS, "audit-neighborhood-images-deep.md"), md.join("\n"));

  if (fails.length > 0) {
    console.error(
      `audit-neighborhood-images-deep: FAIL — ${fails.length}/${rows.length} markets weak/missing`
    );
    for (const f of fails) {
      console.error(`  ${f.slug}: ${f.reasons.join(", ")}`);
    }
    process.exit(1);
  }
  console.log(
    `audit-neighborhood-images-deep: PASS — ${rows.length}/${rows.length} markets`
  );
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
