import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { HeroSearch } from "@/components/HeroSearch";
import { NeighborhoodsRail } from "@/components/NeighborhoodsRail";
import { AnswerFirst } from "@/components/AnswerFirst";
import { MeetMia } from "@/components/MeetMia";
import { IntentRouter } from "@/components/IntentRouter";
import { FeaturedMarketsPager } from "@/components/FeaturedMarketsPager";
import { ValueProps } from "@/components/ValueProps";
import { Faq } from "@/components/Faq";
import { CTAStrip } from "@/components/CTAStrip";
import { IdxEmbed } from "@/components/IdxEmbed";
import { SectionHeading } from "@/components/SectionHeading";
import { InsightsTeaser } from "@/components/insights/InsightsTeaser";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { getMarket, type Market } from "@/lib/markets";
import { HOMEPAGE_FEATURED_ORDER, HOMEPAGE_FEATURED_PAGE_SIZE } from "@/lib/mia";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: `${SITE.url}/` },
};

const HOME_FAQ = [
  {
    question: "Where does Mia serve clients?",
    answer:
      "Mia is based in Fort Lauderdale and serves clients across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach. Featured market guides cover Fort Lauderdale, Coral Ridge, Victoria Park, Boca Raton, and Delray Beach.",
  },
  {
    question: "What sets Mia Sanabria apart as a Fort Lauderdale REALTOR®?",
    answer:
      "It means a guided process: clarify the goal, narrow the right markets, review current comparable data, coordinate next steps, and keep the client informed from first conversation through closing.",
  },
  {
    question: "Can Mia help with a home value question before I am ready to sell?",
    answer:
      "Yes. The valuation request is designed for owners who want a current read on their property, even if they are still early in the decision process.",
  },
  {
    question: "How do I begin?",
    answer:
      "Call (954) 540-0358, send a private inquiry, or request a home valuation. Mia or her team can then confirm the next appropriate step.",
  },
];

const HOME_VALUE_PROPS = [
  {
    heading: "Personal representation",
    body: "Every engagement starts with a private conversation about timing, criteria, and the residence you have in mind — not a generic IDX search.",
  },
  {
    heading: "Brokerage relationships",
    body: "Quiet introductions when Mia's brokerage and ownership relationships surface a fit across Eastern Fort Lauderdale, Boca Raton, and Delray Beach. Access varies by market and timing.",
  },
  {
    heading: "Current-market clarity",
    body: "Pricing conversations are grounded in current comparable sales for the specific street, building, or block — never broad public ranges.",
  },
  {
    heading: "Discreet by default",
    body: "Inquiries are handled privately. Listings, valuations, and search work proceed without unnecessary exposure of you or the property.",
  },
];

// Cycle 16 — Homepage featured-markets pager source. Order is principal-locked
// via HOMEPAGE_FEATURED_ORDER in src/lib/mia.ts (Decision Register §1). Display
// is paginated 6-at-a-time by FeaturedMarketsPager.
const featuredMarkets: ReadonlyArray<Market> = HOMEPAGE_FEATURED_ORDER.map(getMarket).filter(
  (market): market is Market => Boolean(market)
);

export default function HomePage() {
  return (
    <>
      <PersonSchema />
      <RealEstateAgentSchema />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }]} />

      {/*
        Cycle 24 Mia-Live-Decisions (2026-05-13): H1 locked by Mia to a two-line
        search-forward format. The sub-heading retains the practice framing; the
        primary CTA now leads to the property-search anchor so the hero reads as
        search-forward, with the private-conversation path retained as secondary.
        The Bridge IDX inline search-input scaffold is deferred pending the
        runtime decision documented in src/lib/bridge.ts.
      */}
      {/*
        Cycle 34 World-Class Completion (2026-05-14): hero eyebrow + primary CTA
        target aligned with Torrey's locked direction. The eyebrow now carries the
        "South Florida Lifestyle" theme (previously the brokerage attribution
        line). The primary CTA routes to the dedicated Bridge-backed Home Search
        page introduced in Cycle 33; the secondary CTA preserves the private-
        conversation path. Heading and image fallback unchanged — `vibe.filesafe.space`
        hero asset on the current public miasanabria.com is third-party-hosted
        and not safely re-licensable for this repo (see
        docs/artifacts/cycle-34-world-class-completion/current-site-hero-background-audit.md).
      */}
      <Hero
        eyebrow="South Florida Lifestyle"
        heading={
          <>
            South Florida Lifestyle
            <br />
            Home Search
          </>
        }
        sub="Discreet, local guidance for Southeast Florida luxury homeowners, absentee owners, and qualified buyers — from a small, deliberate practice."
        ctaPrimary={{ href: "/home-search/", label: "Search available homes" }}
        ctaSecondary={{ href: "/contact/", label: "Talk with Mia" }}
        background="image"
        imageSrc="/markets/fort-lauderdale.jpg"
        imageAlt="Twilight luxury waterfront residence, Eastern Fort Lauderdale"
      />

      {/* Cycle 24 R2 — listings search box scaffold per Mia's live-meeting request.
          Plain HTML form (no JS) → /markets/#property-search; query params are
          inert until a Bridge runtime consumer reads them (see src/lib/bridge.ts). */}
      <HeroSearch />

      {/* Cycle 24 R2 — Mia's 9 approved working neighborhoods surfaced as a
          service-area rail. Two with hasPage=true link to /markets/<slug>/,
          the other seven anchor to the property-search section. No invented
          per-neighborhood copy. */}
      <NeighborhoodsRail />

      <AnswerFirst
        question="What kind of real estate does Mia Sanabria specialize in?"
        answer="Mia Sanabria represents buyers and sellers of waterfront and luxury residences across Eastern Fort Lauderdale, with adjacent practice in Boca Raton and Delray Beach (both Palm Beach County). The work centers on the deepwater finger isles — Las Olas Isles, Harbor Beach, Rio Vista — and the in-town neighborhoods like Coral Ridge and Victoria Park. In Boca and Delray, the trade runs from Mediterranean Revival to Atlantic Avenue walk-blocks to the beach corridor. Engagements begin with a private brief — preferences, timeline, the residence in mind — long before any showing."
        relatedMarkets={["fort-lauderdale", "boca-raton", "delray-beach"]}
        cta={{ href: "/markets/", label: "Walk the markets" }}
        emitFaqSchema={false}
      />

      <MeetMia />

      <IntentRouter />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Featured Markets"
            heading="Start with the neighborhoods and property types that match the decision."
            sub="Market guides for Fort Lauderdale, Boca Raton, Palm Beach, Victoria Park, Lighthouse Point, and Delray Beach — written to point you toward current comparable sales and a property-specific conversation."
          />
          <div className="mt-12">
            <FeaturedMarketsPager
              markets={featuredMarkets}
              pageSize={HOMEPAGE_FEATURED_PAGE_SIZE}
            />
          </div>
        </div>
      </section>

      <ValueProps
        eyebrow="The Practice"
        heading="A private, deliberate way to buy and sell in Southeast Florida."
        items={HOME_VALUE_PROPS}
        background="navy"
      />

      <IdxEmbed />

      {/* Cycle 15 — Latest Insights cross-site weaving. Three curated briefs:
          buyer guide, deepwater isle comparison, and seller positioning —
          spanning the three principal ICPs without crowding the hero. */}
      <InsightsTeaser
        slugs={[
          "fort-lauderdale-waterfront-buyer-guide",
          "las-olas-vs-seven-isles-vs-harbor-beach",
          "preparing-waterfront-residence-private-market-conversations",
        ]}
        heading="Latest Insights"
        sub="Selected field notes on Southeast Florida luxury, waterfront, and market decisions — written to support private buyer and seller conversations."
        background="cream"
      />

      <Faq items={HOME_FAQ} />
      <CTAStrip />
    </>
  );
}
