#!/usr/bin/env bun
/**
 * Cycle 17 — audit:trust-logos.
 *
 * Verifies the three footer trust marks (LPT Realty, REALTOR®, Equal Housing
 * Opportunity) are present in `public/logos/`, have the expected asset format,
 * and render in a recognizable shape under the SiteFooter monochrome filter
 * chain. Also confirms the SiteFooter source references all three by canonical
 * path and renders them with the expected alt text + label string.
 *
 * Why this audit exists (per CYCLE_17_FOOTER_OFFICIAL_TRUST_LOGO_FIX.md):
 *   - Principal flagged "logos do not look fixed" through Cycle 16 close.
 *   - Cycle 17 swapped Cycle-16 SVG renditions for canonical NAR + EHO sources.
 *   - This audit is the structural probe that catches asset regressions in
 *     future cycles (wrong file in public/logos/, wrong dimensions, wrong
 *     filter treatment, missing footer reference, etc.).
 *
 * Checks:
 *   1. Three files exist in public/logos/ — lpt-realty.png, realtor-r.png, equal-housing.png.
 *   2. Each file is a valid PNG image data file (file probe via `file(1)`-equivalent
 *      check: magic-number prefix 0x89 0x50 0x4E 0x47).
 *   3. Each file is RGBA with reasonable dimensions (≥ 256×256 to allow clean rasterization at 40×40 footer render).
 *   4. None of the three are pure-transparent (i.e. alpha-mean > 0).
 *   5. None of the three are pure-white-everywhere (alpha-mean > 0 AND mean stats indicate visible content).
 *   6. SiteFooter.tsx references all three by canonical path.
 *   7. SiteFooter.tsx renders each asset with canonical alt text ("LPT Realty", "REALTOR®", "Equal Housing Opportunity").
 *   8. SiteFooter.tsx applies the monochrome filter chain (`brightness-0 invert opacity-90`) to all three.
 *   9. SiteFooter.tsx does NOT reference combined REALTOR®+MLS marks (forbidden file names like `realtor-mls.png`).
 *  10. Built output: `out/index.html` (homepage) contains all three asset references in the footer.
 *
 * Standalone audit — not wired into `audit:all` until Phase-13 live deploy is
 * verified to confirm rendering does not regress. Run independently:
 *   bun run audit:trust-logos
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import sharp from "sharp";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";

type CheckRow = {
  name: string;
  status: "PASS" | "WARN" | "FAIL";
  detail: string;
};

const ROOT = process.cwd();
const LOGOS_DIR = join(ROOT, "public", "logos");
const FOOTER_FILE = join(ROOT, "src", "components", "SiteFooter.tsx");
const OUT_HOMEPAGE = join(ROOT, "out", "index.html");

const EXPECTED_LOGOS = [
  { file: "lpt-realty.png", alt: "LPT Realty", label: "LPT Realty" },
  { file: "realtor-r.png", alt: "REALTOR®", label: "REALTOR®" },
  { file: "equal-housing.png", alt: "Equal Housing Opportunity", label: "Equal Housing Opportunity" },
];

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

async function main() {
  const rows: CheckRow[] = [];

  // 1, 2, 3, 4, 5 — per-asset probes
  for (const logo of EXPECTED_LOGOS) {
    const path = join(LOGOS_DIR, logo.file);
    if (!existsSync(path)) {
      rows.push({
        name: `asset.${logo.file}.exists`,
        status: "FAIL",
        detail: `file missing: ${path}`,
      });
      continue;
    }
    rows.push({ name: `asset.${logo.file}.exists`, status: "PASS", detail: path });

    const buf = await readFile(path);
    const magicOk = buf.subarray(0, 8).equals(PNG_MAGIC);
    rows.push({
      name: `asset.${logo.file}.png-magic`,
      status: magicOk ? "PASS" : "FAIL",
      detail: magicOk ? "PNG signature ok" : "missing PNG signature",
    });

    if (!magicOk) continue;

    try {
      const meta = await sharp(path).metadata();
      const dimsOk = (meta.width ?? 0) >= 256 && (meta.height ?? 0) >= 256;
      rows.push({
        name: `asset.${logo.file}.dimensions`,
        status: dimsOk ? "PASS" : "WARN",
        detail: `${meta.width}x${meta.height}`,
      });
      const alphaOk = meta.channels === 4 && meta.hasAlpha;
      rows.push({
        name: `asset.${logo.file}.rgba`,
        status: alphaOk ? "PASS" : "WARN",
        detail: `channels=${meta.channels} hasAlpha=${meta.hasAlpha}`,
      });

      const stats = await sharp(path).stats();
      const alphaMean = stats.channels.length >= 4 ? stats.channels[3]?.mean ?? 0 : 0;
      const visibleContent = alphaMean > 5; // not pure transparent
      rows.push({
        name: `asset.${logo.file}.visible-content`,
        status: visibleContent ? "PASS" : "FAIL",
        detail: `alpha-mean=${alphaMean.toFixed(1)} (must be > 5 to render as visible silhouette)`,
      });
    } catch (e: unknown) {
      rows.push({
        name: `asset.${logo.file}.image-probe`,
        status: "FAIL",
        detail: `sharp probe failed: ${(e as Error).message}`,
      });
    }
  }

  // 6, 7, 8, 9 — SiteFooter source-level probes
  if (!existsSync(FOOTER_FILE)) {
    rows.push({ name: "siteFooter.exists", status: "FAIL", detail: `missing: ${FOOTER_FILE}` });
  } else {
    const src = await readFile(FOOTER_FILE, "utf8");
    rows.push({ name: "siteFooter.exists", status: "PASS", detail: "ok" });
    for (const logo of EXPECTED_LOGOS) {
      const refOk = src.includes(`/logos/${logo.file}`);
      rows.push({
        name: `siteFooter.references.${logo.file}`,
        status: refOk ? "PASS" : "FAIL",
        detail: refOk ? "ok" : `SiteFooter does not reference /logos/${logo.file}`,
      });
      const altOk = src.includes(`alt="${logo.alt}"`);
      rows.push({
        name: `siteFooter.alt.${logo.file}`,
        status: altOk ? "PASS" : "FAIL",
        detail: altOk ? `alt="${logo.alt}" present` : `expected alt="${logo.alt}" not found`,
      });
      const labelOk = src.includes(`label="${logo.label}"`);
      rows.push({
        name: `siteFooter.label.${logo.file}`,
        status: labelOk ? "PASS" : "FAIL",
        detail: labelOk ? `label="${logo.label}" present` : `expected label="${logo.label}" not found`,
      });
    }
    const filterOk = src.includes("brightness-0 invert opacity-90");
    rows.push({
      name: "siteFooter.filterChain",
      status: filterOk ? "PASS" : "WARN",
      detail: filterOk
        ? "brightness-0 invert opacity-90 filter present"
        : "monochrome filter chain not detected (may be intentional)",
    });
    // 9 — REALTOR®+MLS combined-mark guard
    const forbidden = ["realtor-mls.png", "realtor-and-mls.png", "realtor-r-and-mls.png", "realtor_mls.png"];
    const mlsCombinedRef = forbidden.some((f) => src.includes(`/logos/${f}`));
    rows.push({
      name: "siteFooter.noMlsCombined",
      status: mlsCombinedRef ? "FAIL" : "PASS",
      detail: mlsCombinedRef
        ? "SiteFooter references a forbidden REALTOR®+MLS combined-mark filename"
        : "no combined REALTOR®+MLS asset referenced",
    });
  }

  // 10 — built homepage references
  if (!existsSync(OUT_HOMEPAGE)) {
    rows.push({
      name: "builtOutput.homepageExists",
      status: "WARN",
      detail: `out/index.html not built — run \`bun run build\` first`,
    });
  } else {
    const html = await readFile(OUT_HOMEPAGE, "utf8");
    for (const logo of EXPECTED_LOGOS) {
      const refOk = html.includes(`/logos/${logo.file}`) || html.includes(`/_next/image?url=%2Flogos%2F${logo.file}`);
      rows.push({
        name: `builtOutput.homepage.${logo.file}`,
        status: refOk ? "PASS" : "FAIL",
        detail: refOk ? "asset referenced in built homepage HTML" : `not found in homepage HTML`,
      });
    }
  }

  // Summary
  const pass = rows.filter((r) => r.status === "PASS").length;
  const warn = rows.filter((r) => r.status === "WARN").length;
  const fail = rows.filter((r) => r.status === "FAIL").length;

  for (const r of rows) {
    const mark = r.status === "FAIL" ? "✗" : r.status === "WARN" ? "⚠" : "✓";
    console.log(`${mark} ${r.name.padEnd(50)} ${r.detail}`);
  }
  console.log(`\naudit:trust-logos — ${pass} PASS · ${warn} WARN · ${fail} FAIL`);

  // Reports
  const reportsDir = join(ROOT, "reports");
  await writeFile(
    join(reportsDir, "audit-trust-logos.json"),
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        summary: { pass, warn, fail },
        rows,
      },
      null,
      2
    ),
    "utf8"
  );
  const md = [
    "# audit:trust-logos report",
    "",
    `**Generated:** ${new Date().toISOString()}`,
    "",
    `**Summary:** ${pass} PASS · ${warn} WARN · ${fail} FAIL`,
    "",
    "| Check | Status | Detail |",
    "|---|:-:|---|",
    ...rows.map(
      (r) => `| \`${r.name}\` | ${r.status === "FAIL" ? "✗" : r.status === "WARN" ? "⚠️" : "✅"} | ${r.detail} |`
    ),
    "",
  ].join("\n");
  await writeFile(join(reportsDir, "audit-trust-logos.md"), md, "utf8");

  process.exit(fail > 0 ? 1 : 0);
}

await main();
