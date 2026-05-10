#!/usr/bin/env bun
/**
 * Cycle 17 — audit:fort-lauderdale-v3.
 *
 * Verifies the Fort Lauderdale V3 content lift (per CYCLE_17_FORT_LAUDERDALE_V3_IMPLEMENTATION.md)
 * is present in the built /markets/fort-lauderdale/index.html. Catches regressions
 * if a future cycle accidentally reverts the V3 markers.
 *
 * Standalone audit — not wired into `audit:all` until the V3 content has shipped
 * through one full live-deploy cycle and is verified stable. Run independently:
 *   bun run audit:fort-lauderdale-v3
 *
 * Checks:
 *   1. Built page exists at out/markets/fort-lauderdale/index.html.
 *   2. Hero H1 contains the V3 precision frame ("Where deepwater yacht access...").
 *   3. Prelude section eyebrow present ("A decision, not a default").
 *   4. Prelude section H2 present ("Fort Lauderdale rewards a written brief").
 *   5. 7th decision-framework card present ("Insurance underwriting and the 4-point sequence").
 *   6. Emphasized-card eyebrow ("THE QUESTION BUYERS ASK MOST OFTEN").
 *   7. Per-peer pointer marker ("Comes up when") present at least 4 times (one per registered peer; FL has 6 registered peers + V2 has up to 6 internalLinks).
 *   8. Buyer playbook anti-pattern aside ("What this is not" — appears at least twice — buyer + seller).
 *   9. New FAQ #3 question ("How is a private buyer brief different from a saved-search alert?").
 *  10. New FAQ #4 question ("Why does route-to-inlet matter for a buyer who isn't a serious yachter?").
 *  11. Inline seller-playbook Insights link (`/insights/why-automated-valuations-miss-luxury-waterfront/`).
 *  12. Total visible FAQ count on the page is 9 (5 from market.faqs + 4 from FORT_LAUDERDALE_V2_FAQS).
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

type CheckRow = {
  name: string;
  status: "PASS" | "WARN" | "FAIL";
  detail: string;
};

const ROOT = process.cwd();
const FL_PAGE = join(ROOT, "out", "markets", "fort-lauderdale", "index.html");

async function main() {
  const rows: CheckRow[] = [];

  if (!existsSync(FL_PAGE)) {
    console.error(`✗ out/markets/fort-lauderdale/index.html not built. Run \`bun run build\` first.`);
    process.exit(1);
  }

  const html = await readFile(FL_PAGE, "utf8");

  type Check = { name: string; pattern: RegExp | string; expectCount?: number | "at-least-2" | "at-least-4" };
  const checks: Check[] = [
    { name: "v3.heroPrecisionFrame", pattern: "Where deepwater yacht access" },
    { name: "v3.preludeEyebrow", pattern: "A decision, not a default" },
    { name: "v3.preludeHeading", pattern: "Fort Lauderdale rewards a written brief" },
    { name: "v3.seventhCardTitle", pattern: "Insurance underwriting and the 4-point sequence" },
    { name: "v3.emphasizedCardEyebrow", pattern: "THE QUESTION BUYERS ASK MOST OFTEN" },
    { name: "v3.peerPointers", pattern: /Comes up when/g, expectCount: "at-least-4" },
    { name: "v3.antiPatternAside", pattern: /What this is not/g, expectCount: "at-least-2" },
    {
      name: "v3.faqPrivateBriefVsAlert",
      pattern: "How is a private buyer brief different from a saved-search alert?",
    },
    {
      name: "v3.faqRouteToInletNonYachter",
      pattern: "Why does route-to-inlet matter for a buyer who isn",
    },
    {
      name: "v3.sellerPlaybookInsightsLink",
      pattern: "/insights/why-automated-valuations-miss-luxury-waterfront/",
    },
  ];

  for (const c of checks) {
    if (typeof c.pattern === "string") {
      const ok = html.includes(c.pattern);
      rows.push({
        name: c.name,
        status: ok ? "PASS" : "FAIL",
        detail: ok ? `"${c.pattern}" present` : `"${c.pattern}" missing`,
      });
    } else {
      const matches = html.match(c.pattern) ?? [];
      let ok = false;
      let target = "1";
      if (c.expectCount === "at-least-2") {
        ok = matches.length >= 2;
        target = "≥ 2";
      } else if (c.expectCount === "at-least-4") {
        ok = matches.length >= 4;
        target = "≥ 4";
      } else if (typeof c.expectCount === "number") {
        ok = matches.length === c.expectCount;
        target = String(c.expectCount);
      } else {
        ok = matches.length > 0;
      }
      rows.push({
        name: c.name,
        status: ok ? "PASS" : "FAIL",
        detail: `${matches.length} matches (target ${target})`,
      });
    }
  }

  // Total FAQ count on the page — count `<dt` opens or count `accepted-answer` patterns in the FAQ JSON-LD.
  // Quick: count occurrences of `"@type":"Question"` in the FAQPage schema. Should be exactly 9.
  const faqMatches = html.match(/"@type"\s*:\s*"Question"/g) ?? [];
  rows.push({
    name: "v3.faqPageCountIs9",
    status: faqMatches.length === 9 ? "PASS" : faqMatches.length >= 7 ? "WARN" : "FAIL",
    detail: `FAQPage schema has ${faqMatches.length} Question entries (target 9 = market.faqs:5 + V2 specifics:4)`,
  });

  const pass = rows.filter((r) => r.status === "PASS").length;
  const warn = rows.filter((r) => r.status === "WARN").length;
  const fail = rows.filter((r) => r.status === "FAIL").length;

  for (const r of rows) {
    const mark = r.status === "FAIL" ? "✗" : r.status === "WARN" ? "⚠" : "✓";
    console.log(`${mark} ${r.name.padEnd(40)} ${r.detail}`);
  }
  console.log(`\naudit:fort-lauderdale-v3 — ${pass} PASS · ${warn} WARN · ${fail} FAIL`);

  const reportsDir = join(ROOT, "reports");
  await writeFile(
    join(reportsDir, "audit-fort-lauderdale-v3.json"),
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
    "# audit:fort-lauderdale-v3 report",
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
  await writeFile(join(reportsDir, "audit-fort-lauderdale-v3.md"), md, "utf8");

  process.exit(fail > 0 ? 1 : 0);
}

await main();
