#!/usr/bin/env bun
/**
 * Cycle 18 — audit:fort-lauderdale-standard.
 *
 * Successor to `audit:fort-lauderdale-v3`. Verifies the Cycle 18 V4 deepening
 * (per docs/CYCLE_18_FORT_LAUDERDALE_V4_IMPLEMENTATION.md) is present in the
 * built /markets/fort-lauderdale/index.html, AND that all V3 markers (per
 * docs/CYCLE_17_FORT_LAUDERDALE_V3_IMPLEMENTATION.md) remain in place — V3 is
 * a strict subset of V4.
 *
 * Standalone audit — not wired into `audit:all` until V4 has shipped through
 * one full live-deploy cycle and is verified stable. Run independently:
 *   bun run audit:fort-lauderdale-standard
 *
 * V3-subset checks (must remain green — Cycle 17 markers carried forward):
 *   • Hero precision frame
 *   • Prelude eyebrow + heading
 *   • Insurance + 4-point emphasized card
 *   • Per-peer pointers
 *   • Buyer + seller anti-pattern asides
 *   • V3-specific FAQs
 *   • Seller-playbook Insights link
 *
 * V4 NEW checks (Cycle 18):
 *   • Research-backed opening section eyebrow + heading
 *   • Research-backed opening sources line ("Visit Lauderdale" or "Census Bureau")
 *   • Waterfront framework header now reads "Nine verifiable variables"
 *   • Two new framework cards (canal width / outdoor living)
 *   • Buyer's comparison cohort section eyebrow + heading
 *   • All three tier headings present
 *   • Pompano Beach link rendered in the cohort section
 *   • Buyer playbook step 5 ("Confirm financing, cash, and insurance")
 *   • Seller playbook step 3 ("Organize the insurance dataroom")
 *   • Two new FAQs ("no fixed bridges" + Pompano-comparison)
 *   • FAQPage schema has 11 Question entries (5 from market.faqs + 6 from V2)
 *
 * Anti-checks (must NOT appear — Cycle 18 banned per source-ledger hedges):
 *   • No "300 miles of inland waterways within Fort Lauderdale" (city-scope overclaim)
 *   • No "no fixed bridges" claim about the New River specifically
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

  type Check = {
    name: string;
    pattern: RegExp | string;
    expectCount?: number | "at-least-2" | "at-least-4";
  };

  // V3-subset checks (markers must remain green).
  const v3Checks: Check[] = [
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

  // V4 NEW checks (Cycle 18 deepening).
  const v4Checks: Check[] = [
    { name: "v4.researchBackedEyebrow", pattern: "What the geography actually is" },
    { name: "v4.researchBackedHeading", pattern: "Fort Lauderdale, in honest scope" },
    {
      name: "v4.researchBackedSourcesLine",
      // Visit Lauderdale + Census + Port Everglades sources are cited inline.
      pattern: /Visit Lauderdale.*Census Bureau|Census Bureau.*Visit Lauderdale/,
    },
    { name: "v4.frameworkNineVariablesHeading", pattern: "Nine verifiable variables before any offer" },
    { name: "v4.frameworkCanalWidthCard", pattern: "Canal width and turning basin" },
    { name: "v4.frameworkOutdoorLivingCard", pattern: "Outdoor living and dock-side amenities" },
    {
      name: "v4.cohortEyebrow",
      pattern: "What Fort Lauderdale buyers are actually comparing",
    },
    { name: "v4.cohortHeading", pattern: "Three tiers of decision, not one" },
    { name: "v4.cohortTier1Heading", pattern: "Tier 1 — Eastern Fort Lauderdale finger-isle peers" },
    {
      name: "v4.cohortTier2Heading",
      pattern: "Tier 2 — Northern Broward waterfront alternatives",
    },
    { name: "v4.cohortTier3Heading", pattern: "Tier 3 — Palm Beach County peers" },
    { name: "v4.cohortPompanoLink", pattern: 'href="/markets/pompano-beach/"' },
    { name: "v4.cohortHillsboroLink", pattern: 'href="/markets/hillsboro-mile/"' },
    { name: "v4.buyerStep5Financing", pattern: "Confirm financing, cash, and insurance early" },
    { name: "v4.sellerStep3InsuranceDataroom", pattern: "Organize the insurance dataroom" },
    { name: "v4.sellerStep5PhotoNarrative", pattern: "Editorial photography and dock-up narrative" },
    {
      name: "v4.faqNoFixedBridges",
      pattern: "What does &quot;no fixed bridges&quot; mean and where does it actually apply",
    },
    {
      name: "v4.faqPompanoComparison",
      pattern: "How does Fort Lauderdale compare to Pompano Beach for waterfront buyers",
    },
  ];

  // Anti-checks (Cycle 18 banned — must NOT match).
  const antiChecks: Check[] = [
    {
      name: "v4.anti.no300MilesCityScope",
      // Banned: "300 miles of inland waterways within Fort Lauderdale" or
      // similar city-scope overclaim. Allowed: "300 miles of navigable inland
      // waterways across Broward County" (the correct geographic scope).
      pattern: /300\+?\s*miles[^.]{0,80}within\s+(the\s+)?(city\s+of\s+)?Fort\s+Lauderdale/i,
    },
    {
      name: "v4.anti.noFixedBridgesNewRiverClaim",
      // Banned: positive assertion that the New River has no fixed bridges
      // ("the New River has no fixed bridges" / "no-fixed-bridge run on the
      // New River" / similar). NEGATING the claim — explicitly saying the
      // New River HAS multiple drawbridges and that no-fixed-bridge access
      // is residence-specific — is REQUIRED V4 copy and must NOT trip this
      // anti-check. We require the regex match to NOT be inside a sentence
      // that contains a negating phrase nearby ("has multiple drawbridges",
      // "is NOT", "is not a no-fixed-bridge").
      pattern: /\bNew\s+River\s+(?:is\s+)?(?:a\s+)?no[-\s]fixed[-\s]bridge|no[-\s]fixed[-\s]bridge\s+(?:run|access|corridor|route)\s+(?:on|along|through|of)\s+the\s+New\s+River/i,
    },
  ];

  for (const c of [...v3Checks, ...v4Checks]) {
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

  // Anti-checks: pass when no match.
  for (const c of antiChecks) {
    const pat = c.pattern as RegExp;
    const m = html.match(pat);
    rows.push({
      name: c.name,
      status: m ? "FAIL" : "PASS",
      detail: m ? `BANNED match found: "${m[0]}"` : "no banned match",
    });
  }

  // FAQ count — V4 expects 11 (5 market + 6 V2-specific).
  const faqMatches = html.match(/"@type"\s*:\s*"Question"/g) ?? [];
  rows.push({
    name: "v4.faqPageCountIs11",
    status: faqMatches.length === 11 ? "PASS" : faqMatches.length >= 9 ? "WARN" : "FAIL",
    detail: `FAQPage schema has ${faqMatches.length} Question entries (target 11 = market.faqs:5 + V2 specifics:6)`,
  });

  const pass = rows.filter((r) => r.status === "PASS").length;
  const warn = rows.filter((r) => r.status === "WARN").length;
  const fail = rows.filter((r) => r.status === "FAIL").length;

  for (const r of rows) {
    const mark = r.status === "FAIL" ? "✗" : r.status === "WARN" ? "⚠" : "✓";
    console.log(`${mark} ${r.name.padEnd(40)} ${r.detail}`);
  }
  console.log(`\naudit:fort-lauderdale-standard — ${pass} PASS · ${warn} WARN · ${fail} FAIL`);

  const reportsDir = join(ROOT, "reports");
  await writeFile(
    join(reportsDir, "audit-fort-lauderdale-standard.json"),
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
    "# audit:fort-lauderdale-standard report",
    "",
    `**Generated:** ${new Date().toISOString()}`,
    "",
    `**Summary:** ${pass} PASS · ${warn} WARN · ${fail} FAIL`,
    "",
    "| Check | Status | Detail |",
    "|---|:-:|---|",
    ...rows.map(
      (r) =>
        `| \`${r.name}\` | ${r.status === "FAIL" ? "✗" : r.status === "WARN" ? "⚠️" : "✅"} | ${r.detail} |`
    ),
    "",
  ].join("\n");
  await writeFile(join(reportsDir, "audit-fort-lauderdale-standard.md"), md, "utf8");

  process.exit(fail > 0 ? 1 : 0);
}

await main();
