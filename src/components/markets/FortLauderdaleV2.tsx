import Link from "next/link";
import { Anchor, Ship, Compass, Building2, ShieldCheck, FileSearch } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Faq } from "@/components/Faq";
import { SectionHeading } from "@/components/SectionHeading";
import { MarketCard } from "@/components/MarketCard";
import { RelatedInsightsModule } from "@/components/insights/RelatedInsightsModule";
import { PlaceSchema } from "@/components/schema/PlaceSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import type { Market } from "@/lib/markets";

/**
 * Cycle 16 — Fort Lauderdale V2 gold-standard market page.
 *
 * Structural pattern intended to be cloned for the other featured markets:
 *   1. Hero
 *   2. Executive AEO answer
 *   3. Market identity (Eastern FL vs broader market)
 *   4. Waterfront decision framework (verifiable-variable cards)
 *   5. Neighborhood comparison module (comparisonContext + cards)
 *   6. Buyer playbook (brief-first checklist)
 *   7. Seller playbook (positioning checklist)
 *   8. Related Insights
 *   9. FAQ
 *  10. CTA strip
 *
 * No invented stats. No school steering. No private-inventory claims. Every
 * content block ties back to `market.*` fields or to neutrally-worded process
 * language. See docs/CYCLE_16_FORT_LAUDERDALE_MARKET_PAGE_V2_BLUEPRINT.md.
 */

const WATERFRONT_VARIABLES = [
  {
    icon: Anchor,
    title: "Dockage capacity",
    body:
      "Dock length, beam clearance, fendering, and pile condition. Measurements come from the survey and recent permits, not the listing photographs. A wide-beam yacht needs a different dock than a 30-foot day boat — and the same canal can support both at different parcels.",
  },
  {
    icon: ShieldCheck,
    title: "Seawall age and inspection",
    body:
      "Seawalls have a finite life. Age, last inspection, cap condition, tieback integrity, and any prior remediation matter. On waterfront residences, seawall reserve cost is a real number that should be understood before offer.",
  },
  {
    icon: Compass,
    title: "Bridge clearance and route-to-inlet",
    body:
      "Vessel routing — bridge clearances from the dock to the Intracoastal, and from the Intracoastal to the Atlantic — determines whether a specific vessel can leave the slip as advertised. A residence two opening bridges away from Port Everglades imposes a different lifestyle than one with a straight no-fixed-bridge run.",
  },
  {
    icon: Ship,
    title: "Lot orientation and canal mouth",
    body:
      "Point, finger, canal-wide, or lakefront. Lot frontage. Whether the canal mouth opens to the Intracoastal directly or through an interior basin. These are the variables that predict how a vessel actually leaves the property — and how the residence feels from the seawall back.",
  },
  {
    icon: Building2,
    title: "Architectural era and renovation history",
    body:
      "Coastal modern, Mediterranean Revival, mid-century, or new construction. Renovation tolerance varies by buyer: some want turnkey, some want pedigree they can finish themselves. Architectural era is also a pricing factor — a renovated mid-century on the right block often trades differently from a similar-size new build.",
  },
  {
    icon: FileSearch,
    title: "Flood, elevation, and inspection records",
    body:
      "FEMA zone, elevation certificate, and recent inspection records (4-point, wind mitigation, roof, electrical). Carefully understood — not over-claimed. Flood-zone considerations affect insurance and resale; documented improvements affect both.",
  },
];

const BUYER_PLAYBOOK = [
  {
    n: "01",
    title: "Begin with a brief, not a search",
    body:
      "The first 60-90 minutes is conversation. Lifestyle anchors, timeline, vessel profile, architectural preference, and target price band. The brief filters listings; aesthetic enthusiasm does not.",
  },
  {
    n: "02",
    title: "Narrow to two or three neighborhoods",
    body:
      "Eastern Fort Lauderdale resolves into deepwater finger isles, in-town walkable streets, mid-century waterfront pockets, and gated barrier-island enclaves. Most serious buyers belong in two or three of those, not all of them.",
  },
  {
    n: "03",
    title: "Treat the lot as data, not aesthetic",
    body:
      "Survey, dock permits, seawall inspection, route-to-inlet — the verifiable variables that listing photographs flatten. The conversation Mia leads on the address typically opens with these, not the kitchen finishes.",
  },
  {
    n: "04",
    title: "Sequence diligence before offer",
    body:
      "Surveyor, marine contractor, title, mortgage advisor where applicable. Mia identifies which licensed specialists will be needed up front so the offer's contingency timeline reflects the actual workload, not an optimistic estimate.",
  },
  {
    n: "05",
    title: "Use private conversations for quiet inventory",
    body:
      "Some residences are quietly available before they list publicly. Access varies by market and timing and is not guaranteed; what Mia maintains is the brokerage relationships that surface fits when they exist.",
  },
];

const SELLER_PLAYBOOK = [
  {
    n: "01",
    title: "Begin with a property-specific valuation",
    body:
      "Current comparable sales drawn from the right cohort — the same block, the same canal, the same lot profile. Broad averages do not predict what a deepwater point-lot trades at relative to an interior canal residence.",
  },
  {
    n: "02",
    title: "Document the verifiable assets",
    body:
      "Seawall inspection records, dock permits, renovation history, roof and 4-point inspections, elevation certificate. Listings that arrive with this paperwork in hand close faster and renegotiate less.",
  },
  {
    n: "03",
    title: "Position to one buyer profile",
    body:
      "Yachting, in-town walkability, or beach-corridor lifestyle. The listing copy, the photography, the showing strategy each lean to one profile. A residence that tries to be everything tends to feel like nothing.",
  },
  {
    n: "04",
    title: "Editorial photography and positioning",
    body:
      "Editorial photography that shows the lot and the route, not just the interiors. Tour-ready presentation tuned to the buyer pool. Cinematic, not theatrical — the residence has to feel real on a second visit.",
  },
  {
    n: "05",
    title: "Discreet pre-market and targeted introductions",
    body:
      "Some sellers prefer a quiet pre-market period — letting Mia mention the residence privately to brokers whose buyers fit, before the listing becomes public. Whether that's the right strategy depends on the residence, the timeline, and the seller's preference.",
  },
];

// FL-specific FAQs beyond the data-driven `market.faqs`. Kept conservatively
// worded — no school steering, no school-zone copy, no school-rating claim.
const FORT_LAUDERDALE_V2_FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "How does Eastern Fort Lauderdale differ from broader Broward County?",
    answer:
      "Eastern Fort Lauderdale — the area east of US-1 and the surrounding waterfront — operates as a distinct market with its own architectural character, water access, and pricing logic. Broader Broward County includes commuter-oriented inland communities that trade on different fundamentals (single-family schools, commute, square footage at price). A buyer brief should specify which side of US-1 the conversation belongs in.",
  },
  {
    question: "Does Fort Lauderdale's flood-zone overlap make insurance harder?",
    answer:
      "Flood zone affects insurance pricing and lender requirements, particularly for waterfront residences. Elevation certificates, prior remediation, and mitigation history all factor in. Mia recommends a property-specific conversation with a Florida-licensed insurance broker early in the diligence window for any waterfront residence — not after the contract is signed.",
  },
];

// V2 hero override — uses `image` background and the FL hero image, but with
// a section-specific eyebrow and a Cycle 16 V2 marker.
type Props = {
  market: Market;
  relatedMarkets: ReadonlyArray<Market>;
  relatedHeading: string;
};

export function FortLauderdaleV2Page({ market, relatedMarkets, relatedHeading }: Props) {
  return (
    <>
      <RealEstateAgentSchema />
      <PlaceSchema
        name={market.name}
        description={market.intro}
        region="FL"
        county={market.county}
        latitude={market.latitude}
        longitude={market.longitude}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Markets", href: "/markets/" },
          { name: market.name, href: `/markets/${market.slug}/` },
        ]}
      />

      <Hero
        eyebrow={`${market.name} · The Venice of America`}
        heading={market.tagline}
        sub={market.intro}
        ctaPrimary={{ href: "/contact/?intent=buyer-brief&market=fort-lauderdale&source=market-v2", label: "Begin a Private Buyer Brief" }}
        ctaSecondary={{ href: "/valuation/?market=fort-lauderdale&source=market-v2", label: "Confidential Valuation" }}
        background="image"
        imageSrc={market.heroImage}
        imageAlt={`${market.name} waterfront luxury real estate`}
      />

      {/* SECTION 2 — Executive AEO answer */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow={`What ${market.name} is known for`}
            heading="The market, in a paragraph."
          />
          <p className="mt-8 max-w-3xl text-[17px] leading-relaxed text-navy-800/85 sm:text-[18px]">
            {market.aeoAnswer}
          </p>
        </div>
      </section>

      {/* SECTION 3 — Market identity */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Market identity"
              heading="Why Fort Lauderdale matters in luxury and waterfront real estate."
            />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-navy-800/85">
              <p>
                Fort Lauderdale is the city in South Florida where deep-water living, a real downtown, and Atlantic beach access exist in one geography. More than 165 miles of navigable inland waterways thread the city; the major yacht-capable canals reach Port Everglades and the Atlantic with no fixed bridges between them and the ocean — the structural reason the city is called the yachting capital of the world.
              </p>
              <p>
                {market.localContext}
              </p>
              <p>
                For luxury and waterfront buyers comparing Eastern Fort Lauderdale to its Palm Beach County peers, the distinction is structural. Boca Raton and Palm Beach trade on architectural pedigree and country-club residential geography; Delray Beach trades on Atlantic Avenue's walkable downtown. Fort Lauderdale trades on the combination — a working city alongside private dockage, a beach corridor, and established residential neighborhoods that have evolved across architectural eras from the 1920s onward.
              </p>
            </div>
          </div>
          <aside className="rounded-sm border border-navy-800/10 bg-cream-50 p-7 shadow-card lg:p-10">
            <div className="font-display text-xs tracking-[0.3em] text-brass-700">
              MIA'S NOTE
            </div>
            <h3 className="mt-3 font-display text-2xl text-navy-800">
              {market.name} is my home market.
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
              {market.miaQuote
                ? `“${market.miaQuote}”`
                : "Fort Lauderdale rewards the buyer or seller who arrives with a written brief and the patience to read the lot before reading the listing."}
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-navy-800/75">
              Engagements begin with a private conversation — timeline, the residence you have in mind, and the variables that matter to your decision.
            </p>
            <Link
              href="/contact/?intent=private-consultation&market=fort-lauderdale&source=market-v2"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Begin a Private Conversation
            </Link>
          </aside>
        </div>
      </section>

      {/* SECTION 4 — Waterfront decision framework */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Waterfront decision framework"
            heading="Six verifiable variables before any offer."
            sub="On a Fort Lauderdale waterfront parcel, the variables that matter most live in surveys, permits, and inspections — not in listing photographs. These are the questions Mia handles privately before the second showing."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WATERFRONT_VARIABLES.map((v) => {
              const Icon = v.icon;
              return (
                <li
                  key={v.title}
                  className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 text-cream-50">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-navy-800">{v.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-navy-800/80">{v.body}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 max-w-3xl text-[14px] italic leading-relaxed text-navy-800/70">
            None of the six is a substitute for a licensed inspector, marine contractor, surveyor, or insurance broker. Mia coordinates these specialists; their findings — not Mia's summaries — are the ground truth.
          </p>
        </div>
      </section>

      {/* SECTION 5 — Neighborhood comparison */}
      {relatedMarkets.length > 0 ? (
        <section className="bg-cream-100 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading
              eyebrow="Neighborhood comparison"
              heading={relatedHeading}
              sub="The cohort buyers compare against Fort Lauderdale. Each entry leads to a dedicated market guide."
            />
            {market.comparisonContext ? (
              <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-navy-800/85">
                {market.comparisonContext}
              </p>
            ) : null}
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedMarkets.map((m) => (
                <li key={m.slug}>
                  <MarketCard market={m} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* SECTION 6 — Buyer playbook */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Buyer playbook"
              heading={`Considering ${market.name} as a buyer.`}
            />
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-navy-800/85">
              {market.buyerGuidance}
            </p>
            <ol className="mt-12 space-y-8">
              {BUYER_PLAYBOOK.map((step) => (
                <li key={step.n} className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  <div className="font-display text-[14px] tracking-[0.3em] text-brass-700">
                    {step.n}
                  </div>
                  <h3 className="font-display text-xl text-navy-800">{step.title}</h3>
                  <div aria-hidden />
                  <p className="text-[15px] leading-relaxed text-navy-800/80">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card lg:p-10">
            <div className="font-display text-xs tracking-[0.3em] text-brass-700">
              BUYER NEXT STEPS
            </div>
            <h3 className="mt-3 font-display text-2xl text-navy-800">Begin a buyer brief.</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
              A short conversation establishes timeline, lifestyle priorities, and the residence in mind. From there the search narrows to two or three serious candidates rather than a broad open tour.
            </p>
            <Link
              href="/contact/?intent=buyer-brief&market=fort-lauderdale&source=market-v2-buyer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Submit a Private Buyer Brief
            </Link>
            <Link
              href="/buyers/"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-navy-800"
            >
              How Mia Represents Buyers
            </Link>
          </aside>
        </div>
      </section>

      {/* SECTION 7 — Seller playbook */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:px-8">
          <aside className="rounded-sm border border-navy-800/10 bg-cream-50 p-7 shadow-card lg:p-10 lg:order-2 order-2">
            <div className="font-display text-xs tracking-[0.3em] text-brass-700">
              SELLER NEXT STEPS
            </div>
            <h3 className="mt-3 font-display text-2xl text-navy-800">Position the residence.</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
              A focused listing brief begins with a current valuation, a comparable-sales review against the right cohort, and a presentation strategy tuned to the residence's specific story.
            </p>
            <Link
              href="/valuation/?market=fort-lauderdale&source=market-v2-seller"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Request a Confidential Valuation
            </Link>
            <Link
              href="/sellers/"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-navy-800"
            >
              How Mia Represents Sellers
            </Link>
          </aside>
          <div className="lg:order-1 order-1">
            <SectionHeading
              eyebrow="Seller playbook"
              heading={`Listing in ${market.name}.`}
            />
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-navy-800/85">
              {market.sellerGuidance}
            </p>
            <ol className="mt-12 space-y-8">
              {SELLER_PLAYBOOK.map((step) => (
                <li key={step.n} className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  <div className="font-display text-[14px] tracking-[0.3em] text-brass-700">
                    {step.n}
                  </div>
                  <h3 className="font-display text-xl text-navy-800">{step.title}</h3>
                  <div aria-hidden />
                  <p className="text-[15px] leading-relaxed text-navy-800/80">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* SECTION 8 — Related Insights */}
      <RelatedInsightsModule
        marketSlug={market.slug}
        heading={`From the Insights library — ${market.name}`}
        sub="Editorial briefs that frame the conversations buyers and sellers in this market most often arrive with."
        background="cream"
      />

      {/* SECTION 9 — FAQ */}
      <Faq
        heading={`Frequently asked questions about ${market.name}.`}
        items={[...market.faqs, ...FORT_LAUDERDALE_V2_FAQS]}
        emitSchema
      />

      {/* SECTION 10 — Four-CTA strip */}
      <section className="bg-navy-800 py-20 text-cream-50 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="luxury-divider mb-5 [&>span]:text-brass-300">
            <span>Choose your next step</span>
          </div>
          <h2 className="font-display text-3xl text-cream-50 sm:text-4xl">
            Four ways to begin a Fort Lauderdale conversation.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream-200/85">
            Each path opens a different conversation — sized to where you are in the decision. None of them obligates anything beyond a private, time-bound discussion.
          </p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Private consultation",
                body: "A 30-minute private call to clarify the brief — buyer or seller, market and timing.",
                href: "/contact/?intent=private-consultation&market=fort-lauderdale&source=market-v2-cta",
                label: "Request a call",
              },
              {
                title: "Confidential valuation",
                body: "Current comparable-sales review for the specific residence, prepared privately.",
                href: "/valuation/?market=fort-lauderdale&source=market-v2-cta",
                label: "Request a valuation",
              },
              {
                title: "Private buyer brief",
                body: "Define the search — lifestyle anchors, vessel profile, neighborhood set, timeline.",
                href: "/contact/?intent=buyer-brief&market=fort-lauderdale&source=market-v2-cta",
                label: "Submit a brief",
              },
              {
                title: "Waterfront review",
                body: "A property-specific waterfront review for an address you are watching.",
                href: "/contact/?intent=waterfront-review&market=fort-lauderdale&source=market-v2-cta",
                label: "Request a review",
              },
            ].map((cta) => (
              <li
                key={cta.title}
                className="rounded-sm border border-cream-200/15 bg-navy-700/40 p-6"
              >
                <h3 className="font-display text-xl text-cream-50">{cta.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-cream-200/85">{cta.body}</p>
                <Link
                  href={cta.href}
                  className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-300 transition-colors hover:text-brass-200"
                >
                  {cta.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
