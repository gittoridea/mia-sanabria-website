#!/usr/bin/env bun
/**
 * scripts/copy-inventory.ts — Cycle 19C-COPY
 *
 * Reads rendered HTML from out/ for the in-scope routes and emits a per-route
 * copy inventory: H1, meta description, hero subtitle, section headings (h2/h3),
 * CTA labels (a[role=button]/button text), paragraph word counts (mean, max,
 * count >55w), sentence word counts (mean, max, count >28w), repeated-phrase
 * tallies (banned + concern phrases), and a mobile-density heuristic.
 *
 * Output: docs/artifacts/cycle-19c-copy/copy-inventory.md
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const ART = "docs/artifacts/cycle-19c-copy";

const ROUTES: { route: string; file: string; label: string }[] = [
  { route: "/", file: "out/index.html", label: "Home" },
  { route: "/markets/", file: "out/markets/index.html", label: "Markets index" },
  { route: "/markets/fort-lauderdale/", file: "out/markets/fort-lauderdale/index.html", label: "Fort Lauderdale" },
  { route: "/markets/pompano-beach/", file: "out/markets/pompano-beach/index.html", label: "Pompano Beach" },
  { route: "/markets/boca-raton/", file: "out/markets/boca-raton/index.html", label: "Boca Raton" },
  { route: "/markets/delray-beach/", file: "out/markets/delray-beach/index.html", label: "Delray Beach" },
  { route: "/buyers/", file: "out/buyers/index.html", label: "Buyers" },
  { route: "/sellers/", file: "out/sellers/index.html", label: "Sellers" },
  { route: "/contact/", file: "out/contact/index.html", label: "Contact" },
  { route: "/valuation/", file: "out/valuation/index.html", label: "Home Valuation" },
  { route: "/about/", file: "out/about/index.html", label: "About" },
  { route: "/insights/", file: "out/insights/index.html", label: "Insights index" },
];

const INSIGHT_GLOB_HINT = [
  "out/insights/positioning-luxury-waterfront-eastern-fort-lauderdale/index.html",
  "out/insights/dockage-seawalls-bridge-clearance-route-to-inlet/index.html",
  "out/insights/las-olas-vs-seven-isles-vs-harbor-beach/index.html",
  "out/insights/coral-ridge-victoria-park-rio-vista/index.html",
  "out/insights/delray-beach-luxury-buyers-walkability-beach-waterfront/index.html",
  "out/insights/why-automated-valuations-miss-luxury-waterfront/index.html",
];

const BANNED = [
  "definitive access point",
  "exclusive access",
  "guaranteed access",
  "off-market access",
  "private inventory",
  "mls bypass",
  "same-business-day response",
];

const CONCERN = [
  "luxury and waterfront",
  "eastern fort lauderdale",
  "eastern boca raton",
  "eastern delray beach",
  "guidance",
  "discretion",
  "rigor",
  "private",
  "world-class",
  "premier",
  "elite",
];

function stripTags(s: string) {
  return s.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(html: string, re: RegExp): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) out.push(stripTags(m[1] ?? ""));
  return out;
}

function words(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

function sentences(s: string): string[] {
  return s.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).map(t => t.trim()).filter(t => t.length > 0);
}

function metric(label: string, file: string) {
  if (!existsSync(file)) return { label, file, present: false } as any;
  const html = readFileSync(file, "utf8");
  const text = stripTags(html);

  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi)[0] ?? "";
  const metaDesc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "");
  const h2s = pick(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const h3s = pick(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi);
  const ctas = pick(html, /<(?:a|button)[^>]*(?:role=["']button["']|class=["'][^"']*(?:btn|cta|button)[^"']*["'])[^>]*>([\s\S]*?)<\/(?:a|button)>/gi)
    .filter(t => t && t.length < 80);
  const paragraphsRaw = pick(html, /<p[^>]*>([\s\S]*?)<\/p>/gi).filter(p => p && p.length > 1);

  const paragraphWordCounts = paragraphsRaw.map(words);
  const meanP = paragraphWordCounts.length ? paragraphWordCounts.reduce((a, b) => a + b, 0) / paragraphWordCounts.length : 0;
  const maxP = paragraphWordCounts.length ? Math.max(...paragraphWordCounts) : 0;
  const over55 = paragraphWordCounts.filter(n => n > 55).length;

  const sentenceList = paragraphsRaw.flatMap(p => sentences(p));
  const sentenceWordCounts = sentenceList.map(words);
  const meanS = sentenceWordCounts.length ? sentenceWordCounts.reduce((a, b) => a + b, 0) / sentenceWordCounts.length : 0;
  const maxS = sentenceWordCounts.length ? Math.max(...sentenceWordCounts) : 0;
  const over28 = sentenceWordCounts.filter(n => n > 28).length;
  const longestSentence = sentenceWordCounts.length
    ? (sentenceList[sentenceWordCounts.indexOf(maxS)] ?? "")
    : "";

  const lower = text.toLowerCase();
  const bannedHits = BANNED.map(t => ({ term: t, count: (lower.match(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length }));
  const concernHits = CONCERN.map(t => ({ term: t, count: (lower.match(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length }));

  // Repeated geography in same paragraph heuristic
  const geo = ["eastern fort lauderdale", "eastern boca raton", "eastern delray beach", "fort lauderdale", "boca raton", "delray beach"];
  const repeatedGeoParas = paragraphsRaw.filter(p => {
    const pl = p.toLowerCase();
    return geo.reduce((acc, g) => acc + ((pl.match(new RegExp(g, "g")) ?? []).length), 0) >= 3;
  }).length;

  const mobileDensityRisk = (over55 >= 3) || (over28 >= 6);

  return {
    label,
    file,
    present: true,
    h1,
    metaDesc,
    h2_count: h2s.length,
    h2_first: h2s.slice(0, 5),
    h3_count: h3s.length,
    cta_labels: Array.from(new Set(ctas)).slice(0, 15),
    paragraphs: paragraphsRaw.length,
    paragraph_mean_words: Math.round(meanP),
    paragraph_max_words: maxP,
    paragraphs_over_55w: over55,
    sentences: sentenceList.length,
    sentence_mean_words: Math.round(meanS * 10) / 10,
    sentence_max_words: maxS,
    sentences_over_28w: over28,
    longest_sentence: longestSentence.slice(0, 280),
    banned_hits: bannedHits.filter(b => b.count > 0),
    concern_hits: concernHits.filter(b => b.count > 0),
    repeated_geo_paragraphs: repeatedGeoParas,
    mobile_density_risk: mobileDensityRisk,
  };
}

function render(rows: any[]): string {
  const lines: string[] = [];
  lines.push("# Cycle 19C-COPY — Sitewide copy inventory");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("Source: rendered HTML in `out/`. Run `bun run build` first.");
  lines.push("");
  lines.push("## Summary table");
  lines.push("");
  lines.push("| Route | Paragraphs | Mean p-words | Max p-words | p>55w | Mean s-words | Max s-words | s>28w | Repeated-geo paragraphs | Banned hits | Mobile risk |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|");
  for (const r of rows) {
    if (!r.present) {
      lines.push(`| ${r.label} | (missing: \`${r.file}\`) | | | | | | | | | |`);
      continue;
    }
    const bannedTotal = (r.banned_hits as any[]).reduce((a, b) => a + b.count, 0);
    lines.push(`| ${r.label} | ${r.paragraphs} | ${r.paragraph_mean_words} | ${r.paragraph_max_words} | ${r.paragraphs_over_55w} | ${r.sentence_mean_words} | ${r.sentence_max_words} | ${r.sentences_over_28w} | ${r.repeated_geo_paragraphs} | ${bannedTotal} | ${r.mobile_density_risk ? "yes" : "no"} |`);
  }
  lines.push("");
  lines.push("## Per-route detail");
  lines.push("");
  for (const r of rows) {
    if (!r.present) {
      lines.push(`### ${r.label} — MISSING file \`${r.file}\``);
      lines.push("");
      continue;
    }
    lines.push(`### ${r.label}`);
    lines.push("");
    lines.push(`- **File:** \`${r.file}\``);
    lines.push(`- **H1:** ${r.h1 || "_(none)_"}`);
    lines.push(`- **Meta description:** ${r.metaDesc || "_(none)_"}`);
    lines.push(`- **H2 count:** ${r.h2_count} — first 5: ${r.h2_first.length ? r.h2_first.map((t: string) => `"${t}"`).join("; ") : "_(none)_"}`);
    lines.push(`- **H3 count:** ${r.h3_count}`);
    lines.push(`- **CTA labels (unique, first 15):** ${r.cta_labels.length ? r.cta_labels.map((t: string) => `\`${t}\``).join("; ") : "_(none)_"}`);
    lines.push(`- **Paragraphs:** ${r.paragraphs} · mean ${r.paragraph_mean_words}w · max ${r.paragraph_max_words}w · **${r.paragraphs_over_55w} > 55w**`);
    lines.push(`- **Sentences:** ${r.sentences} · mean ${r.sentence_mean_words}w · max ${r.sentence_max_words}w · **${r.sentences_over_28w} > 28w**`);
    lines.push(`- **Longest sentence (truncated):** "${r.longest_sentence}"`);
    lines.push(`- **Repeated-geography paragraphs (≥3 mentions of any geo in a single <p>):** ${r.repeated_geo_paragraphs}`);
    if (r.banned_hits.length) {
      lines.push(`- **Banned-term hits:** ${(r.banned_hits as any[]).map(b => `${b.term} ×${b.count}`).join("; ")}`);
    } else {
      lines.push(`- **Banned-term hits:** none`);
    }
    if (r.concern_hits.length) {
      lines.push(`- **Concern-phrase hits (informational):** ${(r.concern_hits as any[]).map(b => `${b.term} ×${b.count}`).join("; ")}`);
    }
    lines.push(`- **Mobile density risk:** ${r.mobile_density_risk ? "**yes**" : "no"}`);
    lines.push("");
  }
  lines.push("## Insights posts (representative)");
  lines.push("");
  return lines.join("\n");
}

const primary = ROUTES.map(r => metric(r.label, r.file));
const insights = INSIGHT_GLOB_HINT.map(f => metric(f.replace(/^out\/insights\/|\/index\.html$/g, ""), f));

const out = render(primary) + "\n" + render(insights).replace(/^# .*\n/, "").replace(/^## Summary table[\s\S]*?##/, "## Insights summary table\n\n##");

writeFileSync(join(ART, "copy-inventory.md"), out, "utf8");
console.log(`copy-inventory — wrote ${join(ART, "copy-inventory.md")}`);
console.log(`primary: ${primary.filter(p => p.present).length}/${primary.length} present`);
console.log(`insights: ${insights.filter(p => p.present).length}/${insights.length} present`);
