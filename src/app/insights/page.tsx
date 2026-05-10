import type { Metadata } from "next";
import Link from "next/link";
import type { Blog, WithContext } from "schema-dts";
import { Hero } from "@/components/Hero";
import { CTAStrip } from "@/components/CTAStrip";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { InsightCard } from "@/components/insights/InsightCard";
import { MarketBriefCTA } from "@/components/cta/MarketBriefCTA";
import { getAllInsights, getTopicMonthIndex } from "@/lib/insights";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights — SE Florida Luxury Real Estate",
  description:
    "Twelve evergreen briefs on the SE Florida luxury and waterfront market — buyer guides, market comparisons, and pre-listing positioning by Mia Sanabria.",
  alternates: { canonical: `${SITE.url}/insights/` },
  openGraph: {
    title: "Insights — Mia Sanabria, REALTOR® · SE Florida Luxury & Waterfront",
    description:
      "A twelve-part evergreen guide to the Southeast Florida luxury and waterfront market. Read in any order.",
    url: `${SITE.url}/insights/`,
    images: [
      {
        url: `${SITE.url}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Southeast Florida luxury real estate insights",
      },
    ],
  },
};

export default function InsightsIndexPage() {
  const posts = getAllInsights();
  const topicMonths = getTopicMonthIndex();

  const blogSchema: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE.url}/insights/#blog`,
    name: "Mia Sanabria — Southeast Florida Luxury & Waterfront Insights",
    description:
      "A twelve-part evergreen guide to the Southeast Florida luxury and waterfront market — buyer guides, market comparisons, neighborhood reads, and pre-listing positioning.",
    url: `${SITE.url}/insights/`,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE.url}/#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting" as const,
      "@id": `${SITE.url}/insights/${post.slug}/#article`,
      headline: post.title,
      description: post.seoDescription,
      url: `${SITE.url}/insights/${post.slug}/`,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      author: { "@id": `${SITE.url}/#person` },
      mainEntityOfPage: `${SITE.url}/insights/${post.slug}/`,
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights/" },
        ]}
      />
      <JsonLd data={blogSchema} />

      <Hero
        eyebrow="Insights · A Twelve-Part Evergreen Guide"
        heading="Notes from the Southeast Florida luxury and waterfront market."
        sub="Twelve evergreen briefs — buyer guides, market comparisons, neighborhood reads, and pre-listing positioning. Read in any order; each is written for a specific decision."
      />

      <section className="bg-cream-50 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>The Library</span>
          </div>
          <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
            A twelve-part evergreen guide series.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-navy-800/85">
            These briefs are written for the buyers and sellers Mia works with directly — luxury and
            waterfront across Eastern Fort Lauderdale, Boca Raton, Delray Beach, and the surrounding
            municipalities. Each brief is built to make the first private conversation more
            productive: it frames what to verify on a specific address, how to separate similar
            markets, and where the leverage points sit before any introduction is made.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
            The library is a guide series, not a chronological dispatch. The topic-month labels
            organize the twelve briefs as a working market cycle; you can read in any order, and
            each brief stands alone.
          </p>
        </div>
      </section>

      <section className="bg-cream-100 py-16 lg:py-24" id="library">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>The twelve briefs</span>
          </div>
          <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
            Read in any order.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-navy-800/85">
            Each brief is written for a specific decision — a search, a positioning, a market
            comparison. The topic-month label identifies the brief's seasonal relevance and library
            position.
          </p>
          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <InsightCard post={post} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>Library navigation · By topic month</span>
          </div>
          <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
            The twelve-month working cycle.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-navy-800/85">
            The topic-month labels are an editorial frame for the library — not publication dates.
            Each brief was written to be useful in any month and across multiple market cycles.
          </p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topicMonths.map((tm) => (
              <li key={tm.slug}>
                <Link
                  href={`/insights/${tm.slug}/`}
                  className="group flex items-baseline justify-between gap-4 rounded-sm border border-navy-800/10 bg-white px-4 py-3 transition-colors hover:border-brass-400"
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-brass-700">
                    {String(tm.month).padStart(2, "0")} · {tm.label}
                  </span>
                  <span className="text-[12px] text-navy-800/55 group-hover:text-brass-700">
                    {tm.seasonalFocus}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <MarketBriefCTA
            accent="cream"
            source="insights-index"
            heading="Request the private market brief."
            body="An infrequent dispatch on the markets Mia covers — Eastern Fort Lauderdale, Boca Raton, Delray Beach, and the waterfront municipalities. Sent only when there is something specific worth saying."
          />
        </div>
      </section>

      <CTAStrip
        heading="Begin a private conversation."
        sub="The briefs are intended to make the first conversation more productive. When you are ready to make it specific, reach out directly."
      />
    </>
  );
}
