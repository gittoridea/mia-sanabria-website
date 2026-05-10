import type { MarketSlug } from "./mia";
import { POST_01 } from "@/data/insights/01-fort-lauderdale-waterfront-buyer-guide";
import { POST_02 } from "@/data/insights/02-dockage-seawalls-bridge-clearance-route-to-inlet";
import { POST_03 } from "@/data/insights/03-positioning-luxury-waterfront-eastern-fort-lauderdale";
import { POST_04 } from "@/data/insights/04-las-olas-vs-seven-isles-vs-harbor-beach";
import { POST_05 } from "@/data/insights/05-bay-colony-and-bermuda-riviera-private-waterfront";
import { POST_06 } from "@/data/insights/06-coral-ridge-victoria-park-rio-vista";
import { POST_07 } from "@/data/insights/07-lighthouse-point-sea-ranch-lakes-hillsboro-mile";
import { POST_08 } from "@/data/insights/08-boca-raton-luxury-buyers-club-beach-waterfront";
import { POST_09 } from "@/data/insights/09-delray-beach-luxury-buyers-walkability-beach-waterfront";
import { POST_10 } from "@/data/insights/10-why-automated-valuations-miss-luxury-waterfront";
import { POST_11 } from "@/data/insights/11-preparing-waterfront-residence-private-market-conversations";
import { POST_12 } from "@/data/insights/12-private-buyer-brief-defining-the-search";

/**
 * Cycle 15 — Insights data model.
 *
 * Every post is a typed InsightPost record in `src/data/insights/`. The library
 * is registered here as INSIGHTS; helpers below derive routes, related-market
 * indexes, and topic-month groupings without re-encoding the slug list anywhere
 * else (DRY discipline carried forward from Cycle 14's market-system refactor).
 *
 * Honesty contracts:
 *  - datePublished / dateModified are honest current dates; no fake history.
 *  - topicMonth is an editorial label (e.g. "January Reset"); not a publish date.
 *  - All CTAs route to existing pages or non-GHL thank-you routes; no claims of
 *    CRM capture or automated follow-up.
 */

export type InsightCategory =
  | "buyer-guide"
  | "seller-guide"
  | "market-comparison"
  | "neighborhood-read"
  | "valuation"
  | "diligence";

export type InsightCTAVariant =
  | "buyer-brief"
  | "seller-valuation"
  | "market-brief"
  | "private-consultation"
  | "waterfront-review"
  | "listing-strategy";

export type InsightCTA = {
  readonly variant: InsightCTAVariant;
  readonly heading: string;
  readonly body: string;
  readonly buttonLabel: string;
  readonly href: string;
};

export type InsightSection = {
  readonly heading: string;
  readonly paragraphs: ReadonlyArray<string>;
};

export type InsightFaq = {
  readonly question: string;
  readonly answer: string;
};

export type InsightAuthor = "mia-sanabria";

export type InsightPost = {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly datePublished: string;
  readonly dateModified: string;
  readonly topicMonth: string;
  readonly seasonalFocus: string;
  readonly marketCycleMonth: number;
  readonly author: InsightAuthor;
  readonly category: InsightCategory;
  readonly tags: ReadonlyArray<string>;
  readonly icp: string;
  readonly relatedMarkets: ReadonlyArray<MarketSlug>;
  readonly secondaryMarkets: ReadonlyArray<MarketSlug>;
  readonly relatedInsights?: ReadonlyArray<string>;
  readonly primaryCTA: InsightCTA;
  readonly softCTA: InsightCTA;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly ogImage: string;
  readonly aeoQuestion: string;
  readonly aeoAnswer: string;
  readonly intro: string;
  readonly bodyIntro?: string;
  readonly sections: ReadonlyArray<InsightSection>;
  readonly whatMiaClarifies: string;
  readonly faqs?: ReadonlyArray<InsightFaq>;
  readonly editorialNote?: string;
};

export const INSIGHTS: ReadonlyArray<InsightPost> = [
  POST_01,
  POST_02,
  POST_03,
  POST_04,
  POST_05,
  POST_06,
  POST_07,
  POST_08,
  POST_09,
  POST_10,
  POST_11,
  POST_12,
];

export const ALL_INSIGHT_SLUGS: ReadonlyArray<string> = INSIGHTS.map((p) => p.slug);

const INSIGHT_BY_SLUG: ReadonlyMap<string, InsightPost> = new Map(
  INSIGHTS.map((post) => [post.slug, post] as const)
);

export const INSIGHTS_INDEX_ROUTE = "/insights/" as const;

export function getAllInsights(): ReadonlyArray<InsightPost> {
  return INSIGHTS;
}

export function getInsightBySlug(slug: string): InsightPost | undefined {
  return INSIGHT_BY_SLUG.get(slug);
}

export function getInsightRoute(slug: string): string {
  return `/insights/${slug}/`;
}

export function getAllInsightRoutes(): ReadonlyArray<string> {
  return ALL_INSIGHT_SLUGS.map((slug) => getInsightRoute(slug));
}

export function getInsightOgImagePath(slug: string): string {
  return `/og-insights/${slug}.jpg`;
}

export function getInsightsForMarket(marketSlug: MarketSlug): ReadonlyArray<InsightPost> {
  return INSIGHTS.filter(
    (post) =>
      post.relatedMarkets.includes(marketSlug) ||
      post.secondaryMarkets.includes(marketSlug)
  );
}

export function getPrimaryInsightsForMarket(marketSlug: MarketSlug): ReadonlyArray<InsightPost> {
  return INSIGHTS.filter((post) => post.relatedMarkets.includes(marketSlug));
}

export function getInsightsByTopicMonth(month: number): ReadonlyArray<InsightPost> {
  return INSIGHTS.filter((post) => post.marketCycleMonth === month);
}

export function getInsightsByCategory(category: InsightCategory): ReadonlyArray<InsightPost> {
  return INSIGHTS.filter((post) => post.category === category);
}

export function getRelatedInsights(slug: string, n: number = 3): ReadonlyArray<InsightPost> {
  const post = INSIGHT_BY_SLUG.get(slug);
  if (!post) return [];
  // First, any explicitly-related insights.
  const explicit = (post.relatedInsights ?? [])
    .map((s) => INSIGHT_BY_SLUG.get(s))
    .filter((p): p is InsightPost => p !== undefined);
  if (explicit.length >= n) return explicit.slice(0, n);
  // Otherwise, fill with insights that share at least one primary market.
  const sharedMarket = INSIGHTS.filter(
    (other) =>
      other.slug !== slug &&
      !explicit.some((e) => e.slug === other.slug) &&
      other.relatedMarkets.some((m) => post.relatedMarkets.includes(m))
  );
  return [...explicit, ...sharedMarket].slice(0, n);
}

/**
 * Estimate reading time in minutes based on intro + AEO + sections + faqs.
 * Uses the conventional 200 wpm reading rate for editorial prose.
 */
export function estimateReadingTime(post: InsightPost): number {
  const wordCount = countWords(postBodyText(post));
  return Math.max(1, Math.round(wordCount / 200));
}

export function postBodyText(post: InsightPost): string {
  const sectionText = post.sections
    .map((s) => `${s.heading} ${s.paragraphs.join(" ")}`)
    .join(" ");
  const faqText = (post.faqs ?? [])
    .map((f) => `${f.question} ${f.answer}`)
    .join(" ");
  return [
    post.intro,
    post.aeoAnswer,
    post.bodyIntro ?? "",
    sectionText,
    post.whatMiaClarifies,
    faqText,
  ].join(" ");
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Total word count for a post's body (used by audit:insights). */
export function getPostWordCount(post: InsightPost): number {
  return countWords(postBodyText(post));
}

/**
 * The set of editorial topic-month labels in canonical sequence (1..12).
 * Used by the Insights index for library navigation.
 */
export type TopicMonth = {
  readonly month: number;
  readonly label: string;
  readonly seasonalFocus: string;
  readonly slug: string;
};

export function getTopicMonthIndex(): ReadonlyArray<TopicMonth> {
  return INSIGHTS.map((post) => ({
    month: post.marketCycleMonth,
    label: post.topicMonth,
    seasonalFocus: post.seasonalFocus,
    slug: post.slug,
  })).sort((a, b) => a.month - b.month);
}
