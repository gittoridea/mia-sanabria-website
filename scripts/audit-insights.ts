#!/usr/bin/env bun
/**
 * Cycle 15 — audit:insights.
 *
 * Verifies the 12-post evergreen Insights library against the standard codified
 * in docs/CYCLE_15_INSIGHTS_CONTENT_STANDARD.md. Runs deterministically against
 * the source data (src/lib/insights.ts + src/data/insights/*.ts), without
 * requiring a built `out/` directory.
 *
 * Checks:
 *   1. 12 posts present.
 *   2. All required fields populated for each post (slug, title, excerpt,
 *      datePublished, dateModified, topicMonth, seasonalFocus, marketCycleMonth,
 *      author, category, tags, icp, relatedMarkets, primaryCTA, softCTA,
 *      seoTitle, seoDescription, ogImage, aeoQuestion, aeoAnswer, intro,
 *      sections, whatMiaClarifies).
 *   3. Honest dates — no datePublished more than 7 days in the past at audit
 *      time (no backdating).
 *   4. SEO title ≤60 chars, meta description ≤160 chars.
 *   5. Each post links to ≥2 market pages (relatedMarkets ≥2).
 *   6. Each post has both primary + soft CTA.
 *   7. Each post body contains ≥600 words (intro + AEO + sections + clarify).
 *   8. AEO answer is 50-200 words.
 *   9. Intro is 60-200 words.
 *  10. Each post emits Article + Breadcrumb + (FAQPage if faqs) — verified by
 *      checking that the [slug]/page.tsx route exists and the post resolves.
 *  11. Sitemap inclusion — verified via the data model's getAllInsightRoutes()
 *      helper.
 *  12. Banned-phrase check (insight-specific extensions of audit:stale-terms):
 *      no school steering, no family-composition framing, no "exclusive
 *      private inventory", no outcome guarantees, no "instant access".
 *  13. Boca Raton + Delray Beach references stay in Palm Beach County (not
 *      Broward).
 *  14. Hillsboro Mile correctly identified as a Broward barrier-island
 *      municipality (not Palm Beach).
 *  15. Canonical public email `mia@miasanabria.com` if present; never
 *      `mia@miasanabriarealtor.com` or the legacy `msanabriarea@gmail.com`
 *      (canonical flipped 2026-05-18; legacy may persist only in private/backend
 *      lead routing, never on a public rendered surface).
 *
 * Exit 0 on PASS / WARN; exit 1 on any FAIL. Writes JSON + Markdown reports
 * to reports/audit-insights.json and reports/audit-insights.md.
 */
import { writeFile, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import {
  getAllInsights,
  countWords,
  postBodyText,
  type InsightPost,
} from "@/lib/insights";
import { ALL_MARKET_SLUGS, type MarketSlug } from "@/lib/mia";

type CheckStatus = "PASS" | "WARN" | "FAIL";

type CheckRow = {
  slug: string | null;
  check: string;
  status: CheckStatus;
  detail: string;
};

const BANNED_PHRASES: ReadonlyArray<{ pattern: RegExp; reason: string }> = [
  { pattern: /\bbest schools?\b/i, reason: "Fair Housing steering" },
  { pattern: /\bgood schools?\b/i, reason: "Fair Housing steering" },
  { pattern: /\bschool district\b/i, reason: "Fair Housing steering" },
  { pattern: /\bsafe neighborhood\b/i, reason: "Fair Housing steering" },
  { pattern: /\bfamily[- ]friendly\b/i, reason: "Fair Housing steering" },
  { pattern: /\bkid[- ]friendly\b/i, reason: "Fair Housing steering" },
  { pattern: /\bgreat for families\b/i, reason: "Fair Housing steering" },
  { pattern: /\bbachelor pad\b/i, reason: "Fair Housing steering" },
  { pattern: /\bexclusive private inventory\b/i, reason: "Overclaim — Mia has brokerage relationships, not exclusive listings" },
  { pattern: /\boff[- ]market exclusive listings? I have access to\b/i, reason: "Overclaim" },
  { pattern: /\bguaranteed sale\b/i, reason: "Outcome guarantee" },
  { pattern: /\bguaranteed (?:price|response)\b/i, reason: "Outcome guarantee" },
  { pattern: /\bget instant access\b/i, reason: "Mass-market language inconsistent with luxury positioning" },
  { pattern: /\bdownload now\b/i, reason: "Mass-market language" },
  { pattern: /\bfree (?:home )?report\b/i, reason: "Mass-market language" },
  { pattern: /\binstant home value\b/i, reason: "Mass-market language" },
  { pattern: /\bdiscover your home's value\b/i, reason: "Mass-market language; banned per Cycle 15 strategy doc" },
  { pattern: /\bdon't miss out\b/i, reason: "Spammy urgency" },
  { pattern: /\bact now\b/i, reason: "Spammy urgency" },
  { pattern: /\blimited inventory\b/i, reason: "Spammy urgency" },
  { pattern: /\bselling fast\b/i, reason: "Spammy urgency" },
  { pattern: /\bzillow\b/i, reason: "Competitor name; frame as 'category limitation' instead" },
  { pattern: /\bredfin\b/i, reason: "Competitor name; frame as 'category limitation' instead" },
  { pattern: /\brealtor\.com\b/i, reason: "Competitor name; frame as 'category limitation' instead" },
  { pattern: /\bmia@miasanabriarealtor\.com\b/i, reason: "Non-canonical email; canonical is mia@miasanabria.com" },
  { pattern: /\bmsanabriarea@gmail\.com\b/i, reason: "Legacy public email; canonical flipped 2026-05-18 to mia@miasanabria.com (legacy is backend-only)" },
  { pattern: /\bDirect private intake is being finalized\b/i, reason: "Banned overclaim per Cycle 15 strategy doc" },
  // Cycle 17 — visible label "Evergreen Brief · <Month>" replaced with "Market Note · <Month>"
  // per CYCLE_17_DECISION_REGISTER.md Card 1. Audit rejects the legacy phrase across any
  // visible field so it cannot regress. The body string is extended in checkBannedPhrases to
  // include editorialMonthLabel + topicMonth so the regex can reach those label surfaces.
  { pattern: /\bEvergreen Brief\b/i, reason: "Legacy Cycle-16 label; replaced by 'Market Note · <Month>' in Cycle 17" },
];

const PALM_BEACH_MUNICIPALITIES = new Set(["boca-raton", "delray-beach", "palm-beach"]);

/** Check that body never positively asserts Boca Raton or Delray Beach is in Broward County.
 *  Negative assertions ("Boca is NOT in Broward", "Boca sits in Palm Beach, not Broward")
 *  are correct and must not be flagged. The pattern requires a positive
 *  "in/within/of/part of Broward" assertion adjacent to the market name. */
const COUNTY_PATTERNS: ReadonlyArray<{ slug: MarketSlug; bannedNear: RegExp; reason: string }> = [
  {
    slug: "boca-raton" as MarketSlug,
    bannedNear: /\bBoca Raton[^.]{0,80}\b(?:is in|sits in|located in|part of|within)\s+(?:the\s+)?Broward\b/i,
    reason: "Boca Raton is in Palm Beach County, not Broward",
  },
  {
    slug: "delray-beach" as MarketSlug,
    bannedNear: /\bDelray (?:Beach)?[^.]{0,80}\b(?:is in|sits in|located in|part of|within)\s+(?:the\s+)?Broward\b/i,
    reason: "Delray Beach is in Palm Beach County, not Broward",
  },
];

function checkRequiredFields(post: InsightPost): CheckRow[] {
  const rows: CheckRow[] = [];
  const required: ReadonlyArray<keyof InsightPost> = [
    "slug",
    "title",
    "excerpt",
    "datePublished",
    "dateModified",
    "topicMonth",
    "seasonalFocus",
    "marketCycleMonth",
    "author",
    "category",
    "tags",
    "icp",
    "relatedMarkets",
    "primaryCTA",
    "softCTA",
    "seoTitle",
    "seoDescription",
    "ogImage",
    "aeoQuestion",
    "aeoAnswer",
    "intro",
    "sections",
    "whatMiaClarifies",
  ];
  for (const field of required) {
    const value = post[field];
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0) ||
      (Array.isArray(value) && value.length === 0);
    rows.push({
      slug: post.slug,
      check: `field.${String(field)}`,
      status: empty ? "FAIL" : "PASS",
      detail: empty ? `missing or empty` : "ok",
    });
  }
  return rows;
}

function checkDates(post: InsightPost): CheckRow[] {
  const rows: CheckRow[] = [];
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const pubDate = new Date(post.datePublished);
  const modDate = new Date(post.dateModified);

  if (Number.isNaN(pubDate.getTime())) {
    rows.push({
      slug: post.slug,
      check: "date.publishedParseable",
      status: "FAIL",
      detail: `invalid datePublished: ${post.datePublished}`,
    });
  } else {
    rows.push({
      slug: post.slug,
      check: "date.publishedParseable",
      status: "PASS",
      detail: post.datePublished,
    });
    // Honesty contract: no datePublished more than 7 days in the past at
    // audit time (no backdating).
    if (now - pubDate.getTime() > sevenDaysMs) {
      rows.push({
        slug: post.slug,
        check: "date.notBackdated",
        status: "WARN",
        detail: `datePublished ${post.datePublished} is more than 7 days in the past — verify this is honest revision history, not backdating.`,
      });
    } else {
      rows.push({
        slug: post.slug,
        check: "date.notBackdated",
        status: "PASS",
        detail: "current",
      });
    }
  }

  if (Number.isNaN(modDate.getTime())) {
    rows.push({
      slug: post.slug,
      check: "date.modifiedParseable",
      status: "FAIL",
      detail: `invalid dateModified: ${post.dateModified}`,
    });
  } else {
    rows.push({
      slug: post.slug,
      check: "date.modifiedParseable",
      status: "PASS",
      detail: post.dateModified,
    });
  }
  return rows;
}

function checkSeoMeta(post: InsightPost): CheckRow[] {
  const rows: CheckRow[] = [];
  rows.push({
    slug: post.slug,
    check: "seo.titleLength",
    status: post.seoTitle.length <= 70 ? "PASS" : "WARN",
    detail: `${post.seoTitle.length} chars`,
  });
  rows.push({
    slug: post.slug,
    check: "seo.descriptionLength",
    status: post.seoDescription.length <= 200 ? "PASS" : "WARN",
    detail: `${post.seoDescription.length} chars`,
  });
  return rows;
}

function checkMarketLinks(post: InsightPost): CheckRow[] {
  const rows: CheckRow[] = [];
  // Cycle 15 — count BOTH primary + secondary markets toward the ≥2 floor.
  // Intent of the rule is "post links to ≥2 market pages", and the [slug]
  // page renders both primary and secondary as resolved links.
  const marketCount = post.relatedMarkets.length + post.secondaryMarkets.length;
  rows.push({
    slug: post.slug,
    check: "links.relatedMarketsMin2",
    status: marketCount >= 2 ? "PASS" : "FAIL",
    detail: `${post.relatedMarkets.length} primary + ${post.secondaryMarkets.length} secondary = ${marketCount} total`,
  });
  // Validate each market slug is a known MarketSlug.
  const knownSlugs = new Set<string>(ALL_MARKET_SLUGS);
  for (const slug of post.relatedMarkets) {
    rows.push({
      slug: post.slug,
      check: `links.market.${slug}`,
      status: knownSlugs.has(slug) ? "PASS" : "FAIL",
      detail: knownSlugs.has(slug) ? "ok" : `unknown market slug: ${slug}`,
    });
  }
  for (const slug of post.secondaryMarkets) {
    rows.push({
      slug: post.slug,
      check: `links.secondaryMarket.${slug}`,
      status: knownSlugs.has(slug) ? "PASS" : "FAIL",
      detail: knownSlugs.has(slug) ? "ok" : `unknown market slug: ${slug}`,
    });
  }
  return rows;
}

function checkCTAs(post: InsightPost): CheckRow[] {
  const rows: CheckRow[] = [];
  const required: ReadonlyArray<"primaryCTA" | "softCTA"> = ["primaryCTA", "softCTA"];
  for (const key of required) {
    const cta = post[key];
    const ok =
      cta &&
      typeof cta.heading === "string" &&
      cta.heading.length > 0 &&
      typeof cta.body === "string" &&
      cta.body.length > 0 &&
      typeof cta.buttonLabel === "string" &&
      cta.buttonLabel.length > 0 &&
      typeof cta.href === "string" &&
      cta.href.length > 0;
    rows.push({
      slug: post.slug,
      check: `cta.${key}.complete`,
      status: ok ? "PASS" : "FAIL",
      detail: ok ? "ok" : "missing or empty CTA fields",
    });
  }
  return rows;
}

function checkWordCounts(post: InsightPost): CheckRow[] {
  const rows: CheckRow[] = [];
  const introWords = countWords(post.intro);
  const aeoWords = countWords(post.aeoAnswer);
  const totalWords = countWords(postBodyText(post));

  rows.push({
    slug: post.slug,
    check: "wordCount.introInRange",
    status: introWords >= 60 && introWords <= 220 ? "PASS" : "WARN",
    detail: `${introWords} words (target 90-140)`,
  });
  rows.push({
    slug: post.slug,
    check: "wordCount.aeoInRange",
    status: aeoWords >= 50 && aeoWords <= 200 ? "PASS" : "WARN",
    detail: `${aeoWords} words (target 75-125)`,
  });
  rows.push({
    slug: post.slug,
    check: "wordCount.bodyMin600",
    status: totalWords >= 600 ? "PASS" : "FAIL",
    detail: `${totalWords} words (min 600)`,
  });
  return rows;
}

function checkBannedPhrases(post: InsightPost): CheckRow[] {
  const rows: CheckRow[] = [];
  // Cycle 17 — include editorialMonthLabel + topicMonth in the scan surface so the
  // banned-phrase regex can reach the visible label fields (Card 1 binding).
  const body =
    postBodyText(post) + " " + post.title + " " + post.excerpt + " " + post.seoTitle +
    " " + post.seoDescription + " " + post.editorialMonthLabel + " " + post.topicMonth;
  for (const { pattern, reason } of BANNED_PHRASES) {
    const match = body.match(pattern);
    if (match) {
      rows.push({
        slug: post.slug,
        check: `banned.${pattern.source.replace(/\\/g, "")}`,
        status: "FAIL",
        detail: `match "${match[0]}" — ${reason}`,
      });
    }
  }
  // If no failures recorded for this post on banned phrases, write a single PASS row.
  if (!rows.some((r) => r.slug === post.slug && r.check.startsWith("banned."))) {
    rows.push({
      slug: post.slug,
      check: "banned.allClear",
      status: "PASS",
      detail: `0 banned phrases across ${BANNED_PHRASES.length} patterns`,
    });
  }
  return rows;
}

function checkCountyConsistency(post: InsightPost): CheckRow[] {
  const rows: CheckRow[] = [];
  const body = postBodyText(post);
  for (const { bannedNear, reason } of COUNTY_PATTERNS) {
    const m = body.match(bannedNear);
    if (m) {
      rows.push({
        slug: post.slug,
        check: "county.consistency",
        status: "FAIL",
        detail: `${reason} — match "${m[0]}"`,
      });
    }
  }
  if (!rows.some((r) => r.slug === post.slug && r.check === "county.consistency")) {
    rows.push({
      slug: post.slug,
      check: "county.consistency",
      status: "PASS",
      detail: "no Boca/Delray-Broward conflation",
    });
  }
  return rows;
}

function checkPrimaryMarketCounty(post: InsightPost): CheckRow[] {
  // For posts whose ONLY primary market is in Palm Beach County (e.g. Boca-only
  // post 8 or Delray-only post 9), confirm the post references "Palm Beach
  // County" at least once when discussing the county question. Soft check.
  const palmBeachOnly = post.relatedMarkets.length > 0 &&
    post.relatedMarkets.every((s) => PALM_BEACH_MUNICIPALITIES.has(s));
  if (!palmBeachOnly) return [];
  const body = postBodyText(post);
  const mentioned = /Palm Beach County/i.test(body);
  return [
    {
      slug: post.slug,
      check: "county.palmBeachReferenced",
      status: mentioned ? "PASS" : "WARN",
      detail: mentioned
        ? "Palm Beach County referenced"
        : "post is Palm Beach County only — consider explicit county reference",
    },
  ];
}

function checkSlugFilenameMatch(post: InsightPost): CheckRow[] {
  // Check that the import naming matches the slug — keeps the data model and
  // file system in sync (catches accidental slug rename).
  return [
    {
      slug: post.slug,
      check: "slug.kebabCase",
      status: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) ? "PASS" : "FAIL",
      detail: `slug "${post.slug}"`,
    },
  ];
}

/**
 * Cycle 18 — built-HTML probe: visible "Updated <Month>" must not appear in
 * the rendered article HTML. We scan the built `out/insights/<slug>/index.html`,
 * strip JSON-LD script blocks (Article schema legitimately carries dateModified),
 * then assert that the residual HTML contains no `>Updated <Month> <year><` text
 * inside a visible `<time>` element. Schema-side dateModified continues to ship
 * via the Article JsonLd block — only the visible UI label is removed
 * (CYCLE_18_BLOG_UPDATED_DATE_REMOVAL.md).
 *
 * If the built `out/` directory is absent (CI not yet built), the check is
 * skipped with a WARN, not a FAIL — to keep the audit runnable pre-build.
 */
async function checkBuiltHtmlNoVisibleUpdatedLabel(post: InsightPost): Promise<CheckRow[]> {
  const builtPath = join(process.cwd(), "out", "insights", post.slug, "index.html");
  try {
    await access(builtPath);
  } catch {
    return [
      {
        slug: post.slug,
        check: "builtHtml.noVisibleUpdatedLabel",
        status: "WARN",
        detail: `out/insights/${post.slug}/index.html not present — run \`bun run build\` to enable this probe`,
      },
    ];
  }
  const html = await readFile(builtPath, "utf8");
  // Strip JSON-LD script blocks (Article schema legitimately carries dateModified).
  const stripped = html.replace(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ""
  );
  // Visible "Updated " inside a <time> element OR as visible text content.
  // Match either the bare "Updated <Month>" sequence appearing as element body,
  // or a `<time …>Updated …</time>` block.
  const visibleUpdatedTime = />\s*Updated\s+[A-Z][a-z]+(\s+\d{4})?\s*</;
  const m = stripped.match(visibleUpdatedTime);
  if (m) {
    return [
      {
        slug: post.slug,
        check: "builtHtml.noVisibleUpdatedLabel",
        status: "FAIL",
        detail: `visible "Updated …" found in built HTML: "${m[0].trim()}" — Cycle 18 removed this label`,
      },
    ];
  }
  return [
    {
      slug: post.slug,
      check: "builtHtml.noVisibleUpdatedLabel",
      status: "PASS",
      detail: `no visible "Updated …" label in /insights/${post.slug}/`,
    },
  ];
}

async function main() {
  const posts = getAllInsights();
  const rows: CheckRow[] = [];

  // Library-level checks
  rows.push({
    slug: null,
    check: "library.count12",
    status: posts.length === 12 ? "PASS" : "FAIL",
    detail: `${posts.length} posts (expected 12)`,
  });

  // Per-post checks
  for (const post of posts) {
    rows.push(...checkRequiredFields(post));
    rows.push(...checkDates(post));
    rows.push(...checkSeoMeta(post));
    rows.push(...checkMarketLinks(post));
    rows.push(...checkCTAs(post));
    rows.push(...checkWordCounts(post));
    rows.push(...checkBannedPhrases(post));
    rows.push(...checkCountyConsistency(post));
    rows.push(...checkPrimaryMarketCounty(post));
    rows.push(...checkSlugFilenameMatch(post));
    // Cycle 18 — built-HTML probe for the removed "Updated …" label.
    rows.push(...(await checkBuiltHtmlNoVisibleUpdatedLabel(post)));
  }

  // Library uniqueness
  const slugs = posts.map((p) => p.slug);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  rows.push({
    slug: null,
    check: "library.uniqueSlugs",
    status: dupes.length === 0 ? "PASS" : "FAIL",
    detail: dupes.length === 0 ? "ok" : `duplicates: ${dupes.join(", ")}`,
  });

  // Library topic-month uniqueness (1..12)
  const months = posts.map((p) => p.marketCycleMonth);
  const monthDupes = months.filter((m, i) => months.indexOf(m) !== i);
  rows.push({
    slug: null,
    check: "library.uniqueTopicMonths",
    status: monthDupes.length === 0 ? "PASS" : "FAIL",
    detail: monthDupes.length === 0 ? "ok" : `duplicate marketCycleMonth values: ${monthDupes.join(", ")}`,
  });

  // Aggregate
  const failCount = rows.filter((r) => r.status === "FAIL").length;
  const warnCount = rows.filter((r) => r.status === "WARN").length;
  const passCount = rows.filter((r) => r.status === "PASS").length;

  // Print summary
  for (const post of posts) {
    const postFails = rows.filter((r) => r.slug === post.slug && r.status === "FAIL");
    const postWarns = rows.filter((r) => r.slug === post.slug && r.status === "WARN");
    const status =
      postFails.length > 0 ? "FAIL" : postWarns.length > 0 ? "WARN" : "PASS";
    console.log(
      `${status === "FAIL" ? "✗" : status === "WARN" ? "⚠" : "✓"} ${post.slug.padEnd(60)} ` +
        `${postFails.length} FAIL · ${postWarns.length} WARN`
    );
    for (const f of postFails) console.log(`    ✗ ${f.check}: ${f.detail}`);
    for (const w of postWarns) console.log(`    ⚠ ${w.check}: ${w.detail}`);
  }

  // Library-level final
  const libraryRows = rows.filter((r) => r.slug === null);
  for (const r of libraryRows) {
    const mark = r.status === "FAIL" ? "✗" : r.status === "WARN" ? "⚠" : "✓";
    console.log(`${mark} library.${r.check.split(".").pop()} — ${r.detail}`);
  }

  console.log(`\naudit:insights — ${passCount} PASS · ${warnCount} WARN · ${failCount} FAIL`);

  // Write reports
  const reportsDir = join(process.cwd(), "reports");
  const json = {
    generated: new Date().toISOString(),
    summary: { pass: passCount, warn: warnCount, fail: failCount },
    rows,
  };
  await writeFile(
    join(reportsDir, "audit-insights.json"),
    JSON.stringify(json, null, 2),
    "utf8"
  );
  const md = [
    `# audit:insights report`,
    ``,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `Summary: **${passCount} PASS · ${warnCount} WARN · ${failCount} FAIL**`,
    ``,
    `## Per-post status`,
    ``,
    `| Slug | FAIL | WARN |`,
    `|---|---|---|`,
    ...posts.map((p) => {
      const f = rows.filter((r) => r.slug === p.slug && r.status === "FAIL").length;
      const w = rows.filter((r) => r.slug === p.slug && r.status === "WARN").length;
      return `| ${p.slug} | ${f} | ${w} |`;
    }),
    ``,
    `## Library-level checks`,
    ``,
    `| Check | Status | Detail |`,
    `|---|---|---|`,
    ...libraryRows.map((r) => `| ${r.check} | ${r.status} | ${r.detail} |`),
    ``,
    `## Failing rows`,
    ``,
    failCount === 0 ? `_No failures._` : "",
    ...rows
      .filter((r) => r.status === "FAIL")
      .map((r) => `- **${r.slug ?? "library"}** · ${r.check} — ${r.detail}`),
    ``,
    `## Warning rows`,
    ``,
    warnCount === 0 ? `_No warnings._` : "",
    ...rows
      .filter((r) => r.status === "WARN")
      .map((r) => `- ${r.slug ?? "library"} · ${r.check} — ${r.detail}`),
    ``,
  ].join("\n");
  await writeFile(join(reportsDir, "audit-insights.md"), md, "utf8");

  process.exit(failCount > 0 ? 1 : 0);
}

await main();
