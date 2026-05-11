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

/**
 * Cycle 16 — Blog date governance discriminator.
 *
 * Posts are evergreen briefs that all happen to deploy on the same date
 * (Cycle 15 close, 2026-05-10). For SEO/UX integrity we keep `datePublished`
 * honest (= deployment date) but display an editorial-month frame on cards
 * and headers. `editorialDate` is the 2nd-Monday-of-month anchor used for
 * VISIBLE SORT AND LABEL ONLY — it is NEVER fed to schema.
 *
 *  - "evergreen-month"  → visible label is `editorialMonthLabel` (e.g. "Market Note · May").
 *                          (Cycle 18 — visible "Updated <Month YYYY>" secondary label
 *                          REMOVED from blog UI per CYCLE_18_BLOG_UPDATED_DATE_REMOVAL.md.
 *                          Schema-side `dateModified` remains honest in Article JSON-LD;
 *                          `getVisibleDateForPost` no longer emits a `secondary` field
 *                          for evergreen-month, so the article-page conditional renders
 *                          nothing under the editorial label.)
 *                          (Cycle 17 — "Market Note · <Month>" replaced "Evergreen Brief · <Month>"
 *                          per CYCLE_17_DECISION_REGISTER.md Card 1. The internal mode name stays
 *                          `evergreen-month` since the underlying architectural choice — posts are
 *                          evergreen, labeled by editorial month — is unchanged.)
 *  - "full-date"        → visible label is the full publication date (e.g. "Published May 10, 2026").
 *  - "updated-only"     → visible label is "Updated <Month YYYY>" only — useful for revisions to
 *                          posts that were originally part of the 12-post launch cohort.
 *                          (Retained for opt-in revision-only display; not used by current cohort.)
 */
export type InsightDateDisplayMode = "evergreen-month" | "full-date" | "updated-only";

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
  /** Honest deployment date. Used directly in schema datePublished. NEVER backdated. */
  readonly datePublished: string;
  /** Honest most-recent revision date. Bumped on real content edits only. */
  readonly dateModified: string;
  /**
   * Cycle 16 — Editorial anchor (2nd Monday of the corresponding cycle month).
   * Used for VISIBLE SORT/LABEL ONLY. Never fed to schema.
   */
  readonly editorialDate: string;
  /**
   * Cycle 16 — Visible editorial-month frame, e.g. "Market Note · May" (Cycle 17 update;
   * replaced "Evergreen Brief · <Month>" per CYCLE_17_DECISION_REGISTER.md Card 1).
   * Replaces the bare `topicMonth` in card/header display.
   */
  readonly editorialMonthLabel: string;
  /** Cycle 16 — Visible date-display strategy. See InsightDateDisplayMode. */
  readonly dateDisplayMode: InsightDateDisplayMode;
  /** Cycle 16 — Whether visible labels include the year. Default false for evergreen mode. */
  readonly showYear?: boolean;
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
  /**
   * Cycle 16 — Per-post hero image (rendered above the article body). Falls
   * back to ogImage if not set. Use existing market images where topical.
   */
  readonly heroImage: string;
  /** Optional alt text for heroImage; falls back to title if not set. */
  readonly heroImageAlt?: string;
  /**
   * Open Graph + Article schema image. Cycle 16: should be a per-post asset
   * under /og-insights/ — fallback to /og-default.jpg permitted but loud-failed
   * by audit:insights once the per-post pipeline is wired.
   */
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

/**
 * Cycle 16 — Format the post's `dateModified` as "Month YYYY" for the
 * "Updated …" frame on article headers under evergreen-month mode.
 */
export function getUpdatedMonthYearLabel(post: InsightPost): string {
  const parts = post.dateModified.split("-");
  const y = parts[0];
  const m = parts[1];
  if (!y || !m) return "";
  const monthName = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-US", {
    month: "long",
  });
  return `${monthName} ${y}`;
}

/**
 * Cycle 16 — Visible date display per the post's `dateDisplayMode`. Used by
 * the article header and the InsightCard's editorial label. NEVER substitute
 * for schema-side datePublished/dateModified — those stay honest.
 *
 * Returns the structured pieces so the caller can format them with the right
 * <time> elements (only datePublished is schema-faithful).
 *
 * Cycle 18 — `evergreen-month` mode no longer emits a `secondary` line.
 * Visible "Updated <Month YYYY>" was removed from blog UI per
 * CYCLE_18_BLOG_UPDATED_DATE_REMOVAL.md. Schema-side `dateModified` continues
 * to be emitted in Article JSON-LD via `buildArticleSchema`; the visible
 * label noise was a UX cost without a corresponding SEO benefit (Article
 * dateModified is the canonical update-time signal). The `secondary` field
 * is preserved on the type so other modes (or future opt-in display modes)
 * can still emit it; only `evergreen-month` has it removed.
 */
export type InsightVisibleDate = {
  /** Top-line editorial label, e.g. "Market Note · May" or "Published May 10, 2026". */
  readonly primary: string;
  /** Optional secondary line, e.g. "Updated May 2026". Cycle 18: not emitted by `evergreen-month` mode. */
  readonly secondary?: string;
};

export function getVisibleDateForPost(post: InsightPost): InsightVisibleDate {
  if (post.dateDisplayMode === "full-date") {
    const formatted = new Date(post.datePublished).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return { primary: `Published ${formatted}` };
  }
  if (post.dateDisplayMode === "updated-only") {
    return { primary: `Updated ${getUpdatedMonthYearLabel(post)}` };
  }
  // evergreen-month — Cycle 18: no secondary "Updated …" line. Schema dateModified
  // remains honest in Article JSON-LD; the visible secondary was UI noise.
  return {
    primary: post.editorialMonthLabel,
  };
}
