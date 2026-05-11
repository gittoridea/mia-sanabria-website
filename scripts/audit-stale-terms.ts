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
  /** When set, `term` is treated as a regex source. */
  re?: boolean;
  safeReplacement?: string;
};

const FORBIDDEN: ReadonlyArray<Pattern> = [
  // Original case-sensitive patterns — preserve prior behavior:
  { term: "Klein Morgan", reason: "stale brokerage residue" },
  { term: "kleinmorgan", reason: "stale brokerage residue" },
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
  // Mia VPS gap-closure packet 2026-05-07 — luxury-as-practice claim risk + GATED_MIA gates.
  // These terms either claim a service tier Mia has not verified ("luxury concierge",
  // "white-glove", "bespoke") or reference gated/unverified practice attributes
  // ("off-market" access, "high-net-worth" network, "since 2017", a public SLA).
  { term: "luxury concierge", ci: true, reason: "luxury-as-practice claim risk (gap closure)", safeReplacement: "use 'real estate concierge' or 'REALTOR® with LPT Realty'" },
  { term: "white-glove", ci: true, reason: "luxury-as-practice claim risk (gap closure)", safeReplacement: "use 'considered' or 'thoughtful'" },
  { term: "high-net-worth", ci: true, reason: "GATED_MIA: HNW-network claim is unverified", safeReplacement: "use 'qualified' or remove network claim" },
  { term: "HNW", reason: "GATED_MIA: HNW-network claim is unverified", safeReplacement: "use 'qualified' or remove network claim" },
  { term: "bespoke", ci: true, reason: "luxury-as-practice claim risk (gap closure)", safeReplacement: "use 'tailored' or 'private'" },
  { term: "off-market", ci: true, reason: "GATED_MIA: off-market access is unverified", safeReplacement: "use 'private listings' or 'pre-market via brokerage relationships'" },
  { term: "most exclusive", ci: true, reason: "FREC superlative + luxury-as-practice claim risk", safeReplacement: "remove the superlative or cite source" },
  { term: "priceRange", reason: "schema priceRange tier claim has no verified source", safeReplacement: "remove priceRange from JSON-LD" },
  { term: "since 2017", ci: true, reason: "GATED_MIA: practice-history claim unverified in fact ledger", safeReplacement: "remove year claim until Mia confirms" },
  { term: "within two hours", ci: true, reason: "GATED_MIA: response-SLA claim unverified", safeReplacement: "use 'same business day' without specific SLA" },
  // Cycle 19A-M defect classes manual review caught — promoted to deterministic checks.
  // 1. Double-period in body text. Defect pattern: SITE.tagline ends with "." and template
  //    appended ". " before next sentence. Anchored to <letter>..<whitespace><Capital> to
  //    avoid false-positives on URL paths or JSON-LD content.
  { term: "[a-z]\\.\\.\\s+[A-Z]", re: true, reason: "double-period at sentence boundary (cycle 19A-M defect class)", safeReplacement: "drop one period from the concatenation site" },
  // 2. Visible blog "Updated MONTH YYYY" label form (Cycle 17 removed; sentinel against regression).
  { term: ">\\s*Updated\\s+(January|February|March|April|May|June|July|August|September|October|November|December)\\s+20[0-9][0-9]\\s*<", re: true, reason: "visible 'Updated Month YYYY' blog label (Cycle 17 removed surface label; schema dateModified stays honest)", safeReplacement: "remove visible label; schema dateModified is enough" },
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
    for (const { term, reason, ci, re, safeReplacement } of FORBIDDEN) {
      let hit = false;
      let lineIndex = -1;
      if (re) {
        const flags = ci ? "i" : "";
        const matcher = new RegExp(term, flags);
        const m = content.match(matcher);
        if (m) {
          hit = true;
          lineIndex = content.slice(0, m.index ?? 0).split("\n").length - 1;
        }
      } else {
        const haystack = ci ? content.toLowerCase() : content;
        const needle = ci ? term.toLowerCase() : term;
        if (haystack.includes(needle)) {
          hit = true;
          lineIndex = content
            .split("\n")
            .findIndex((l) => (ci ? l.toLowerCase() : l).includes(needle));
        }
      }
      if (hit) {
        const replacement = safeReplacement ? ` | fix: ${safeReplacement}` : "";
        console.error(
          `✗ ${file}:${lineIndex + 1}  forbidden ${re ? "regex" : "term"} "${term}" (${reason})${replacement}`
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
