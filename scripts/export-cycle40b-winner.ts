#!/usr/bin/env bun
/**
 * export-cycle40b-winner — export a selected Cycle 40B candidate to the
 * production-shaped hero/card + OG paths.
 *
 * Usage:
 *   bun run scripts/export-cycle40b-winner.ts <slug> <candidate-index>
 *
 * Examples:
 *   bun run scripts/export-cycle40b-winner.ts davie 1
 *   bun run scripts/export-cycle40b-winner.ts hollywood 3
 *
 * Reads from:
 *   docs/artifacts/cycle-40b-image-lab-hero-recovery/image-candidates/<slug>/cand-<N>.png
 *
 * Writes to:
 *   public/markets/<slug>-cycle40b.jpg     (1200x1500 portrait 4:5, mozjpeg q=82)
 *   public/og-markets/<slug>-cycle40b.jpg  (1200x630 landscape,  mozjpeg q=82)
 *
 * Appends to manifest:
 *   docs/artifacts/cycle-40b-image-lab-hero-recovery/image-manifest.md
 */

import { mkdir, readFile, writeFile, stat, appendFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

declare const Bun: { argv: string[] };

const REPO = process.cwd();
const CAND_ROOT = join(
  REPO,
  "docs/artifacts/cycle-40b-image-lab-hero-recovery/image-candidates",
);
const MANIFEST_PATH = join(
  REPO,
  "docs/artifacts/cycle-40b-image-lab-hero-recovery/image-manifest.md",
);

async function fileSize(p: string): Promise<number> {
  try {
    return (await stat(p)).size;
  } catch {
    return -1;
  }
}

async function ensureManifest(): Promise<void> {
  try {
    await stat(MANIFEST_PATH);
  } catch {
    await writeFile(
      MANIFEST_PATH,
      `# Cycle 40B — Image Manifest\n\nWinners exported to public Cycle-40B paths. Each entry below records the\nsource candidate PNG, the export timestamp, the final hero + OG path, and\nthe sharp pipeline used.\n\n| slug | candidate | hero path | hero bytes | og path | og bytes | exported_at |\n|------|-----------|-----------|------------|---------|----------|-------------|\n`,
    );
  }
}

async function main() {
  const argv = Bun.argv.slice(2);
  const slug = argv[0];
  const candIndex = Number(argv[1]);
  if (!slug || !Number.isFinite(candIndex)) {
    console.error("usage: bun run scripts/export-cycle40b-winner.ts <slug> <cand-index>");
    process.exit(2);
  }
  const candPath = join(CAND_ROOT, slug, `cand-${candIndex}.png`);
  let buf: Buffer;
  try {
    buf = await readFile(candPath);
  } catch (err) {
    console.error(`source candidate missing at ${candPath}`);
    process.exit(2);
  }

  await mkdir(join(REPO, "public/markets"), { recursive: true });
  await mkdir(join(REPO, "public/og-markets"), { recursive: true });

  const heroPath = join(REPO, "public/markets", `${slug}-cycle40b.jpg`);
  const ogPath = join(REPO, "public/og-markets", `${slug}-cycle40b.jpg`);

  const heroBuf = await sharp(buf)
    .resize(1200, 1500, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await writeFile(heroPath, heroBuf);

  const ogBuf = await sharp(buf)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await writeFile(ogPath, ogBuf);

  const heroBytes = await fileSize(heroPath);
  const ogBytes = await fileSize(ogPath);
  const exportedAt = new Date().toISOString();

  console.log(
    `${slug} cand-${candIndex} → hero ${heroBytes}B og ${ogBytes}B`,
  );

  await ensureManifest();
  await appendFile(
    MANIFEST_PATH,
    `| ${slug} | cand-${candIndex} | /markets/${slug}-cycle40b.jpg | ${heroBytes} | /og-markets/${slug}-cycle40b.jpg | ${ogBytes} | ${exportedAt} |\n`,
  );
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
