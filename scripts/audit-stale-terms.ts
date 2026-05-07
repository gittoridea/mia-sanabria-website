#!/usr/bin/env bun
/**
 * Greps the static export for:
 *  1. stale-brokerage residue and pre-launch defects (HARD — exit 1 on any hit)
 *  2. FREC superlative / fabricated-credential / steering-risk patterns (HARD — exit 1 on any hit)
 *
 * Run after `bun run build`.
 *
 * Compliance patterns added 2026-05-07 per docs/MIA_CURRENT_TO_IDEAL_GAP_MATRIX.md S2.
 *  - FREC ad-rule risk: unsubstantiated superlatives ("#1 realtor", "top realtor",
 *    "best realtor", "guaranteed sale price").
 *  - Fabricated credentials: "as seen in/on" framings.
 *  - Fair Housing steering risk: "best schools", "good schools", "safe neighborhood",
 *    "family-friendly", "bachelor pad", "kid-friendly" — these phrases trigger
 *    HUD steering review even when context is innocent. Site copy must use
 *    objective descriptors instead.
 *
 * Each compliance pattern has a `safeReplacement` annotation in the report so
 * the failure message tells the author what to do, not just what's wrong.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

type Pattern = {
  term: string;
  reason: string;
  /** When true, match is case-insensitive. Default false to preserve existing case-sensitive behavior. */
  ci?: boolean;
  safeReplacement?: string;
};

const FORBIDDEN: ReadonlyArray<Pattern> = [
  // Original case-sensitive patterns — preserve prior behavior:
  { term: "Klein Morgan", reason: "stale brokerage residue" },
  { term: "kleinmorgan", reason: "stale brokerage residue" },
  { term: "msanabriarea@gmail.com", reason: "stale email residue" },
  { term: "[Legal Brokerage Name]", reason: "template placeholder residue" },
  { term: "[Privacy Email]", reason: "template placeholder residue" },
  { term: "sunandbreeze", reason: "stale Direct Axess template residue" },
  { term: "accessibility@agent3000.com", reason: "stale Direct Axess template residue" },
  { term: "FLorida", reason: "typo (must be Florida)" },
  // FREC superlative + fabricated-credential risk (case-insensitive):
  { term: "#1 realtor", ci: true, reason: "FREC superlative without substantiation", safeReplacement: "remove or cite source" },
  { term: "#1 agent", ci: true, reason: "FREC superlative without substantiation", safeReplacement: "remove or cite source" },
  { term: "top realtor", ci: true, reason: "FREC superlative without substantiation", safeReplacement: "remove or cite source" },
  { term: "best realtor", ci: true, reason: "FREC superlative without substantiation", safeReplacement: "remove or cite source" },
  { term: "guaranteed sale", ci: true, reason: "FREC ad-rule risk on guaranteed-outcome claims", safeReplacement: "use 'targeted' or 'planned'" },
  { term: "guaranteed price", ci: true, reason: "FREC ad-rule risk on guaranteed-outcome claims", safeReplacement: "use 'pricing strategy' or 'pricing plan'" },
  { term: "as seen in", ci: true, reason: "fabricated-media risk unless verified citation present", safeReplacement: "cite the publication + URL or omit" },
  { term: "as seen on", ci: true, reason: "fabricated-media risk unless verified citation present", safeReplacement: "cite the program + URL or omit" },
  // Fair Housing steering-risk language (case-insensitive):
  { term: "best schools", ci: true, reason: "Fair Housing steering risk", safeReplacement: "describe distance to specific schools by name without quality claim" },
  { term: "good schools", ci: true, reason: "Fair Housing steering risk", safeReplacement: "describe distance to specific schools by name without quality claim" },
  { term: "safe neighborhood", ci: true, reason: "Fair Housing steering risk", safeReplacement: "describe physical features (gated, on-site security) without safety claim" },
  { term: "family-friendly", ci: true, reason: "Fair Housing steering risk", safeReplacement: "describe physical features (parks, playgrounds) without familial-status framing" },
  { term: "bachelor pad", ci: true, reason: "Fair Housing steering risk on familial status", safeReplacement: "describe property type" },
  { term: "kid-friendly", ci: true, reason: "Fair Housing steering risk on familial status", safeReplacement: "describe property feature" },
];

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && /\.(html|xml|txt|json|webmanifest)$/.test(entry.name)) yield path;
  }
}

const root = "out";
let hits = 0;
const startedAt = Date.now();
try {
  for await (const file of walk(root)) {
    const content = await readFile(file, "utf8");
    for (const { term, reason, ci, safeReplacement } of FORBIDDEN) {
      const haystack = ci ? content.toLowerCase() : content;
      const needle = ci ? term.toLowerCase() : term;
      if (haystack.includes(needle)) {
        const lineIndex = content
          .split("\n")
          .findIndex((l) => (ci ? l.toLowerCase() : l).includes(needle));
        const replacement = safeReplacement ? ` | fix: ${safeReplacement}` : "";
        console.error(
          `✗ ${file}:${lineIndex + 1}  forbidden term "${term}" (${reason})${replacement}`
        );
        hits++;
      }
    }
  }
} catch (err) {
  console.error(`audit-stale-terms: cannot read ${root}/ — did you run \`bun run build\`?`);
  console.error(err);
  process.exit(2);
}

const ms = Date.now() - startedAt;
if (hits > 0) {
  console.error(`\n✗ ${hits} stale-term hits across the build. (${ms}ms)`);
  process.exit(1);
} else {
  console.log(`✓ audit-stale-terms: clean across ${root}/. (${ms}ms)`);
}
