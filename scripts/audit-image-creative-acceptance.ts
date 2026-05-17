#!/usr/bin/env bun
/**
 * audit-image-creative-acceptance — Cycle 40B creative-acceptance gate.
 *
 * Confirms the artifact chain that proves seven Cycle 40B neighborhood
 * images were generated through a real multi-candidate-with-scoring
 * workflow, not a one-shot guess. Fails if:
 *   - a Cycle 40B hero or OG file is missing or under-size
 *   - the per-slug candidate dir is missing
 *   - a slug has fewer than 3 candidate PNGs in the candidates dir
 *   - the per-slug contact-sheet is missing
 *   - the scorecards / art-direction-review / image-manifest /
 *     image-provenance-ledger doc is missing
 *
 * Outputs:
 *   reports/audit-image-creative-acceptance.json
 *   reports/audit-image-creative-acceptance.md
 *
 * Exit 0 on PASS, 1 on FAIL.
 */

import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { MIA_CYCLE_40B_VERSIONED_SLUGS } from "../src/lib/mia";

const REPO = process.cwd();
const REPORTS = join(REPO, "reports");
const ARTIFACT_DIR = join(REPO, "docs/artifacts/cycle-40b-image-lab-hero-recovery");
const CAND_ROOT = join(ARTIFACT_DIR, "image-candidates");

const MIN_HERO_BYTES = 150_000;
const MIN_OG_BYTES = 60_000;
const MIN_CANDIDATES_PER_SLUG = 3;

const REQUIRED_DOCS = [
  "visual-creative-brief.md",
  "neighborhood-image-creative-briefs.md",
  "image-tool-benchmark.md",
  "image-generation-tool-discovery.md",
  "image-candidate-scorecards.md",
  "image-art-direction-review.md",
  "image-manifest.md",
  "image-provenance-ledger.md",
  "image-generation-results.json",
];

type Row = {
  slug: string;
  hero_bytes: number;
  og_bytes: number;
  candidate_count: number;
  contact_sheet_exists: boolean;
  status: "PASS" | "FAIL";
  reasons: string[];
};

async function fileSize(p: string): Promise<number> {
  try {
    return (await stat(p)).size;
  } catch {
    return -1;
  }
}

async function fileExists(p: string): Promise<boolean> {
  return (await fileSize(p)) >= 0;
}

async function countCandidatesPng(slug: string): Promise<number> {
  let count = 0;
  for (let i = 1; i <= 5; i++) {
    const p = join(CAND_ROOT, slug, `cand-${i}.png`);
    if (await fileExists(p)) count++;
  }
  return count;
}

async function main() {
  await mkdir(REPORTS, { recursive: true });
  const rows: Row[] = [];
  for (const slug of MIA_CYCLE_40B_VERSIONED_SLUGS) {
    const heroPath = join(REPO, "public/markets", `${slug}-cycle40b.jpg`);
    const ogPath = join(REPO, "public/og-markets", `${slug}-cycle40b.jpg`);
    const heroBytes = await fileSize(heroPath);
    const ogBytes = await fileSize(ogPath);
    const candCount = await countCandidatesPng(slug);
    const contactSheetExists = await fileExists(
      join(CAND_ROOT, slug, "contact-sheet.jpg"),
    );

    const reasons: string[] = [];
    if (heroBytes < 0) reasons.push("hero-missing");
    else if (heroBytes < MIN_HERO_BYTES) reasons.push(`hero-bytes<${MIN_HERO_BYTES}`);
    if (ogBytes < 0) reasons.push("og-missing");
    else if (ogBytes < MIN_OG_BYTES) reasons.push(`og-bytes<${MIN_OG_BYTES}`);
    if (candCount < MIN_CANDIDATES_PER_SLUG)
      reasons.push(`candidates<${MIN_CANDIDATES_PER_SLUG}`);
    if (!contactSheetExists) reasons.push("contact-sheet-missing");

    rows.push({
      slug,
      hero_bytes: heroBytes,
      og_bytes: ogBytes,
      candidate_count: candCount,
      contact_sheet_exists: contactSheetExists,
      status: reasons.length === 0 ? "PASS" : "FAIL",
      reasons,
    });
  }

  const docReasons: string[] = [];
  for (const doc of REQUIRED_DOCS) {
    const p = join(ARTIFACT_DIR, doc);
    if (!(await fileExists(p))) docReasons.push(`doc-missing:${doc}`);
  }

  const fails = rows.filter((r) => r.status === "FAIL");
  const docsPass = docReasons.length === 0;

  const json = {
    generated_at: new Date().toISOString(),
    thresholds: {
      MIN_HERO_BYTES,
      MIN_OG_BYTES,
      MIN_CANDIDATES_PER_SLUG,
    },
    total_slugs: rows.length,
    pass_slugs: rows.length - fails.length,
    fail_slugs: fails.length,
    docs_pass: docsPass,
    doc_reasons: docReasons,
    rows,
  };
  await writeFile(
    join(REPORTS, "audit-image-creative-acceptance.json"),
    JSON.stringify(json, null, 2),
  );

  const md: string[] = [];
  md.push("# audit-image-creative-acceptance");
  md.push("");
  md.push(`Generated: ${json.generated_at}`);
  md.push(`Slugs: ${json.total_slugs} | Pass: ${json.pass_slugs} | Fail: ${json.fail_slugs}`);
  md.push(`Docs pass: ${docsPass}`);
  if (docReasons.length > 0) {
    md.push("");
    md.push("## Missing docs");
    for (const r of docReasons) md.push(`- ${r}`);
  }
  md.push("");
  md.push(
    "| Slug | Hero KB | OG KB | Candidates | Contact Sheet | Status | Reasons |",
  );
  md.push("|------|--------:|------:|-----------:|:-------------:|:------:|---------|");
  for (const r of rows) {
    md.push(
      `| ${r.slug} | ${(r.hero_bytes / 1024).toFixed(0)} | ${(r.og_bytes / 1024).toFixed(0)} | ${r.candidate_count} | ${r.contact_sheet_exists ? "✓" : "✗"} | ${r.status} | ${r.reasons.join(", ") || "-"} |`,
    );
  }
  await writeFile(
    join(REPORTS, "audit-image-creative-acceptance.md"),
    md.join("\n"),
  );

  if (fails.length > 0 || !docsPass) {
    console.error(
      `audit-image-creative-acceptance: FAIL — ${fails.length} slug fails, ${docReasons.length} doc fails`,
    );
    for (const f of fails) console.error(`  ${f.slug}: ${f.reasons.join(", ")}`);
    for (const r of docReasons) console.error(`  ${r}`);
    process.exit(1);
  }
  console.log(
    `audit-image-creative-acceptance: PASS — ${rows.length}/${rows.length} slugs + all docs present`,
  );
}

main().catch((err) => {
  console.error("FATAL", err);
  process.exit(1);
});
