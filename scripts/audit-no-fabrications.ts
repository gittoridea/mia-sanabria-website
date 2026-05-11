#!/usr/bin/env bun
/**
 * Cycle 19B-FL — audit-no-fabrications.
 *
 * Reinforces the existing audit-stale-terms FORBIDDEN list with claim-classes
 * that ARE NOT case-by-case stale terms but rather structural over-claim risk
 * for a realtor website. Each pattern names something that, if it appears in
 * rendered output without a verified source, is itself the failure.
 *
 * Patterns covered:
 *   - "guaranteed off-market" / "private inventory we control" — off-market
 *     guarantee anti-pattern.
 *   - "$X billion in transactions" / "$X million in transactions" without a
 *     verified principal source.
 *   - "X years experience" / "X+ years experience" — without a verified
 *     start year.
 *   - "speaks X languages" / "fluent in X languages" — languages claim
 *     fabrication.
 *   - "fastest response in the market" / "instant response" — service-time
 *     fabrication.
 *   - "Same-business-day response" — gated until principal Cycle 19B-FL Q2
 *     approval (which Mia chose to omit this cycle).
 *
 * Each pattern matches against rendered HTML in `out/`. Hits are reported with
 * the offending file + line. Exit 1 on any hit.
 *
 * IMPORTANT: this audit reads `out/`, so claims inside source comments / TS
 * code are NOT scanned — only what actually ships to the user. The point is
 * to catch regression in the final artifact, not in code comments.
 */
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "out");

type Forbid = { label: string; pattern: RegExp; reason: string };

const FORBIDDEN: ReadonlyArray<Forbid> = [
  {
    label: "off-market-guarantee",
    pattern: /guaranteed\s+off-market|private\s+inventory\s+we\s+control|we\s+have\s+private\s+listings/i,
    reason: "Off-market access guarantee — Mia maintains relationships; access is not guaranteed.",
  },
  {
    label: "fabricated-transaction-volume",
    pattern: /\$\s?\d{1,4}\s?(?:billion|million)\s+in\s+(?:transactions|sales|deals|volume)/i,
    reason: "Transaction-volume claim — must be verified by principal before display.",
  },
  {
    label: "fabricated-years-experience",
    pattern: /\b\d{1,3}\+?\s+years?\s+(?:of\s+)?(?:experience|practice)\b/i,
    reason: "Years-experience claim — must reference a verified start year (currently unverified).",
  },
  {
    label: "fabricated-languages-claim",
    pattern: /speaks?\s+\d+\s+languages|fluent\s+in\s+\d+\s+languages/i,
    reason: "Languages claim — must be verified before display.",
  },
  {
    label: "service-time-fabrication",
    pattern: /(?:fastest|quickest|instant)\s+response\s+in\s+the\s+market|reply\s+within\s+\d+\s+minutes/i,
    reason: "Response-time claim — service-time commitments need principal approval + audit gate.",
  },
  {
    label: "same-business-day-response",
    pattern: /Same-business-day\s+response/i,
    reason: "Cycle 19B-FL principal directive Q2 — omit until vetted. Re-enable behind a principal-approved flag.",
  },
];

async function* walkHtml(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(path);
    else if (entry.isFile() && entry.name.endsWith(".html")) yield path;
  }
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("✗ out/ missing — run 'bun run build' first.");
    process.exit(2);
  }
  let bad = 0;
  for await (const file of walkHtml(OUT)) {
    const content = await readFile(file, "utf8");
    for (const { label, pattern, reason } of FORBIDDEN) {
      const match = pattern.exec(content);
      if (match) {
        bad++;
        const before = content.slice(0, match.index ?? 0);
        const line = before.split("\n").length;
        const rel = file.replace(`${ROOT}/`, "");
        console.error(`✗ ${rel}:${line} [${label}] — "${match[0]}"`);
        console.error(`   ${reason}`);
      }
    }
  }
  console.log(`audit-no-fabrications — ${bad === 0 ? "0 hits" : `${bad} hit(s)`}`);
  if (bad > 0) process.exit(1);
}

main().catch((err) => {
  console.error("audit-no-fabrications crashed:", err);
  process.exit(1);
});
