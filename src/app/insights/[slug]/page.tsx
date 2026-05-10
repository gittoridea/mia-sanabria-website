import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article, FAQPage, WithContext } from "schema-dts";
import { Hero } from "@/components/Hero";
import { CTAStrip } from "@/components/CTAStrip";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { LeadCaptureCTA } from "@/components/cta/LeadCaptureCTA";
import { InlineInsightCTA } from "@/components/cta/InlineInsightCTA";
import { InsightCard } from "@/components/insights/InsightCard";
import { RelatedMarketsModule } from "@/components/insights/RelatedMarketsModule";
import {
  getAllInsights,
  getInsightBySlug,
  getRelatedInsights,
  estimateReadingTime,
  getPostWordCount,
  type InsightPost,
} from "@/lib/insights";
import { SITE } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Array<Params> {
  return getAllInsights().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsightBySlug(slug);
  if (!post) return {};
  const url = `${SITE.url}/insights/${post.slug}/`;
  const ogImage = `${SITE.url}${post.ogImage}`;
  return {
    title: { absolute: post.seoTitle },
    description: post.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url,
      type: "article",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [ogImage],
    },
  };
}

function buildArticleSchema(post: InsightPost): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}/insights/${post.slug}/#article`,
    headline: post.title,
    description: post.seoDescription,
    author: { "@id": `${SITE.url}/#person` },
    publisher: { "@id": `${SITE.url}/#organization` },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    mainEntityOfPage: `${SITE.url}/insights/${post.slug}/`,
    image: `${SITE.url}${post.ogImage}`,
    inLanguage: "en-US",
    wordCount: getPostWordCount(post),
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };
}

function buildFaqSchema(post: InsightPost): WithContext<FAQPage> | null {
  if (!post.faqs || post.faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}/insights/${post.slug}/#faq`,
    mainEntity: post.faqs.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: { "@type": "Answer" as const, text: item.answer },
    })),
  };
}

export default async function InsightPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getInsightBySlug(slug);
  if (!post) notFound();

  const articleSchema = buildArticleSchema(post);
  const faqSchema = buildFaqSchema(post);
  const relatedPosts = getRelatedInsights(post.slug, 3);
  const readingTime = estimateReadingTime(post);

  // Insert the inline CTA between roughly two-thirds of the body sections so it
  // sits mid-article rather than at the foot. For posts with 4 sections, that's
  // after section index 2 (zero-indexed); for 5-section posts after index 3.
  const inlineCtaPosition = Math.max(2, Math.floor((post.sections.length * 2) / 3));

  const formattedPublishDate = new Date(post.datePublished).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights/" },
          { name: post.title, href: `/insights/${post.slug}/` },
        ]}
      />
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <Hero
        eyebrow={`Insights · ${post.topicMonth}`}
        heading={post.title}
        sub={post.excerpt}
        ctaPrimary={{ href: post.primaryCTA.href, label: post.primaryCTA.buttonLabel }}
      />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.3em] text-brass-700">
            <span>By Mia Sanabria, REALTOR®</span>
            <span aria-hidden className="text-navy-800/30">·</span>
            <time dateTime={post.datePublished} className="text-navy-800/75">
              Published {formattedPublishDate}
            </time>
            <span aria-hidden className="text-navy-800/30">·</span>
            <span className="text-navy-800/75">{readingTime} min read</span>
          </div>

          <p className="text-[17px] leading-relaxed text-navy-800/85 sm:text-[18px]">
            {post.intro}
          </p>

          <aside
            className="mt-10 rounded-sm border border-brass-400/40 bg-brass-400/5 px-5 py-5 text-[15px] leading-relaxed text-navy-800/85"
            aria-label="Quotable summary"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-brass-700">Quick answer</div>
            <p className="mt-2 font-display text-[18px] text-navy-800">{post.aeoQuestion}</p>
            <p className="mt-3 text-[15px] text-navy-800/85">{post.aeoAnswer}</p>
          </aside>

          {post.bodyIntro && (
            <p className="mt-10 text-[16px] leading-relaxed text-navy-800/85">{post.bodyIntro}</p>
          )}

          {post.sections.map((section, idx) => (
            <div key={section.heading}>
              <h2 className="mt-12 font-display text-2xl text-navy-800 sm:text-3xl">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, pidx) => (
                <p
                  key={pidx}
                  className="mt-4 text-[16px] leading-relaxed text-navy-800/85"
                >
                  {paragraph}
                </p>
              ))}
              {idx + 1 === inlineCtaPosition && <InlineInsightCTA cta={post.softCTA} />}
            </div>
          ))}

          <h2 className="mt-14 font-display text-2xl text-navy-800 sm:text-3xl">
            What Mia would clarify privately.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-navy-800/85">
            {post.whatMiaClarifies}
          </p>

          <RelatedMarketsModule
            marketSlugs={[...post.relatedMarkets, ...post.secondaryMarkets].slice(0, 6)}
            heading="Related markets"
            source={`insight-${post.slug}`}
          />

          <LeadCaptureCTA cta={post.primaryCTA} accent="navy" />

          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-14 border-t border-navy-800/10 pt-10">
              <h2 className="font-display text-2xl text-navy-800 sm:text-3xl">
                Frequently asked.
              </h2>
              <dl className="mt-8 space-y-8">
                {post.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-display text-[18px] text-navy-800">{faq.question}</dt>
                    <dd className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-navy-800/10 pt-6 text-xs uppercase tracking-[0.3em] text-navy-800/65">
            <span>Topic month · {post.topicMonth}</span>
            <Link
              href="/insights/"
              className="text-navy-800 transition-colors hover:text-brass-700"
            >
              ← All insights
            </Link>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t border-navy-800/10 bg-cream-100 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="luxury-divider mb-6">
              <span>Continue reading</span>
            </div>
            <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
              Related briefs.
            </h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {relatedPosts.map((rel) => (
                <InsightCard key={rel.slug} post={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTAStrip
        heading="Begin a private conversation."
        sub="Each brief is intended to make the first conversation more productive. When you are ready to make it specific, reach out directly."
      />
    </>
  );
}
