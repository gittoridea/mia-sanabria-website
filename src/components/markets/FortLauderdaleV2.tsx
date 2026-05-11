import Link from "next/link";
import { Anchor, Ship, Compass, Building2, ShieldCheck, FileSearch, AlertCircle, Waves, Trees } from "lucide-react";
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
 * Cycle 17 — V3 content lift applied in-place (component name preserved so
 * the rollout template at `src/app/markets/[slug]/page.tsx` does not churn).
 * Cycle 18 — V4 deepening applied in-place (component name preserved):
 *   • New "Research-backed opening" section between prelude and Executive AEO.
 *     Carries the Cycle-18 source-ledger facts (165-mi waterways within city
 *     limits, 24-mi regional coastline, ~10% water of 38.6 sq mi city, $18.5B
 *     regional marine industry, LauderGO Water Trolley as a public mobility
 *     signal). Every claim hedged per the ledger; no overclaim.
 *   • Waterfront decision framework grows from 7 cards → 9 (adds canal width
 *     / turning basin AND outdoor living / dock-side amenities; insurance +
 *     4-point sequence remains the emphasized full-width 9th card).
 *   • New "Buyer's comparison cohort" editorial section between the
 *     waterfront framework and the existing neighborhood-comparison cards.
 *     Three tiers — Eastern FtLaud finger-isle peers, Northern Broward
 *     waterfront alternatives (Pompano Beach + Lighthouse Point + Hillsboro
 *     Mile), Palm Beach County peers (Boca / Palm Beach / Delray) — framed
 *     as decision logic, NOT a list dump.
 *   • Buyer playbook grows from 5 steps → 6 (financing / cash / insurance
 *     considerations as Step 5; private-conversations becomes Step 6).
 *   • Seller playbook grows from 5 steps → 7 (insurance / flood / elevation
 *     documentation as Step 3; photography + narrative carved out from the
 *     original "editorial photography + positioning" as a discrete Step 5).
 *   • FORT_LAUDERDALE_V2_FAQS grows from 4 items → 6 items (page total
 *     5 + 6 = 11 FAQs). New entries: no-fixed-bridge access semantics; how
 *     FtLaud compares to Pompano Beach.
 *   • All V3 markers preserved as a subset (V3 audit remains green; new V4
 *     audit treats V3 markers as a subset).
 *
 * Source-ledger trace: every research-backed claim added in V4 traces back
 * to a row in docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md
 * Part C (Verified facts safe to paraphrase in copy), specifically rows
 * F1-F11. No claim is added that does not appear in the ledger.
 *
 * Lift summary (V3, retained):
 *   • Hero `heading` override — HNWI-precision frame (was: `market.tagline`).
 *   • New prelude section "Why Fort Lauderdale is a decision, not a default"
 *     between Hero and Executive AEO.
 *   • Waterfront decision framework grows from 6 cards → 7 (adds insurance +
 *     4-point inspection sequencing; rendered as a `lg:col-span-3` emphasis
 *     card below the 6-card grid). [V4: framework now 9 cards; insurance +
 *     4-point remains the emphasized full-width card.]
 *   • Neighborhood comparison section adds a per-peer "Comes up when…" italic
 *     pointer above each MarketCard, sourced from V3_PEER_POINTERS.
 *   • Buyer playbook step 1 extends with a relocation-thread sentence.
 *   • Buyer playbook + Seller playbook each carry a closing "What this is not"
 *     anti-pattern aside.
 *   • Seller playbook step 1 inline-links the automated-valuations Insight.
 *   • FORT_LAUDERDALE_V2_FAQS grew from 2 → 4 items (total FAQ count 5+4=9).
 *     [V4: 4 → 6 V2-specific items; total FAQ count 5+6=11.]
 *
 * Structural pattern intended to be cloned for the other featured markets:
 *   1. Hero
 *   2. (V3) Prelude — "Why Fort Lauderdale is a decision, not a default"
 *   3. (V4) Research-backed opening — ledger-cited facts
 *   4. Executive AEO answer
 *   5. Market identity (Eastern FL vs broader market)
 *   6. Waterfront decision framework (9 cards as of V4)
 *   7. (V4) Buyer's comparison cohort — editorial, three tiers
 *   8. Neighborhood comparison module (comparisonContext + per-peer pointers + cards)
 *   9. Buyer playbook (6 steps as of V4 + anti-pattern aside)
 *  10. Seller playbook (7 steps as of V4 + anti-pattern aside)
 *  11. Related Insights
 *  12. FAQ (11 as of V4)
 *  13. CTA strip
 *
 * No invented stats. No school steering. No private-inventory claims. Every
 * content block ties back to `market.*` fields, the source ledger, or to
 * neutrally-worded process language. See:
 *   docs/CYCLE_16_FORT_LAUDERDALE_MARKET_PAGE_V2_BLUEPRINT.md
 *   docs/CYCLE_17_FORT_LAUDERDALE_V3_IMPLEMENTATION.md
 *   docs/CYCLE_18_FORT_LAUDERDALE_PAGE_DEFINITION.md
 *   docs/CYCLE_18_FORT_LAUDERDALE_V4_IMPLEMENTATION.md
 */

// Cycle 17 — V3 lift. The 7th card (insurance + 4-point sequencing) is rendered
// emphasized (`lg:col-span-3` full-width below the 6-card grid) because it is
// the single decision HNW buyers ask Mia about most often per principal context.
// `emphasize: true` triggers the wider treatment in the render loop below.
//
// Cycle 18 — V4 deepening. Two cards added (canal width / turning basin;
// outdoor living / dock-side amenities). Total = 9 cards (8 in the 3-col grid
// + 1 full-width emphasized "insurance + 4-point" card preserved as the page's
// most-asked-question card). Every variable still ties back to a survey,
// permit, inspection, or listing-photo-distortion-correction discipline.
const WATERFRONT_VARIABLES: ReadonlyArray<{
  icon: typeof Anchor;
  title: string;
  body: string;
  emphasize?: boolean;
}> = [
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
    // Cycle 18 — V4 NEW card. Canal width / turning basin was implicit in V3
    // (named in passing in the lot-orientation card). It's promoted to its own
    // card because the dimension determines whether a specific vessel can
    // physically maneuver to the dock — independent of bridge clearance and
    // independent of dock length. Two boats of identical length can need
    // different turning basins; this is a survey-and-tide question that
    // belongs in due diligence, not in a showing impression.
    icon: Waves,
    title: "Canal width and turning basin",
    body:
      "Canal width at the residence and the turning-basin geometry at the dock determine whether a specific vessel can physically maneuver to the slip — independent of bridge clearance. A wide-beam vessel may need a marked turning basin; some interior canals trade narrow with deep, others wide with skinny water. The number is on the survey and confirmed at low tide; do not infer it from drone photography.",
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
  {
    // Cycle 18 — V4 NEW card. Outdoor living + dock-side amenities (outdoor
    // kitchen, lift, lighting, lanai, pool placement) routinely change the
    // perceived market value of a waterfront parcel without changing the
    // structural dock or seawall facts. Buyers ask about it; the surveys
    // don't capture it; the listing photos compress it. Belongs as a
    // discrete variable so the brief separates the structural question
    // (dock + seawall + route) from the lifestyle question (cooking, hosting,
    // launching).
    icon: Trees,
    title: "Outdoor living and dock-side amenities",
    body:
      "Outdoor kitchen, lift, dock lighting, lanai orientation, pool placement, salt-air-tolerant landscaping. The dock-side experience routinely sets perceived value without changing the survey. Buyers shopping a vessel-first brief sometimes underweight this; buyers shopping a hosting-first brief routinely overweight it. A property-specific walk-through with the dock and the lanai treated as a single outdoor-living unit beats reading the listing copy on either alone.",
  },
  {
    icon: AlertCircle,
    title: "Insurance underwriting and the 4-point sequence",
    body:
      "On Eastern Fort Lauderdale waterfront, the binding decision is rarely listing price — it is whether the residence is underwritable on the buyer's timeline at a defensible premium. Order matters: a 4-point inspection (roof, electrical, plumbing, HVAC), a wind-mitigation report, an elevation certificate, and any prior-claim history get sequenced before the offer's diligence window — not after. A Florida-licensed insurance broker is the right early party. Mia coordinates introductions; the underwriter's quote, not Mia's summary, is the ground truth.",
    emphasize: true,
  },
];

// Cycle 17 — V3 lift. Per-peer "Comes up when…" pointer rendered above each
// MarketCard in the comparison section. Keyed by the peer market slug so the
// data file can grow internalLinks without churning this component (any peer
// without a registered pointer falls back to the MarketCard alone). No invented
// rankings; each pointer is a decision-context anchor, not a market claim.
const V3_PEER_POINTERS: Readonly<Record<string, string>> = {
  "las-olas-isles":
    "Comes up when deepwater dockage and walkability to Las Olas Boulevard rank equally on the brief.",
  "harbor-beach":
    "Comes up when gated barrier-island privacy and beach-club access shape the residence search.",
  "victoria-park":
    "Comes up when in-town walkability is the dominant lifestyle anchor, with or without water access.",
  "coral-ridge":
    "Comes up when an established country-club residential setting matters more than direct water frontage.",
  "bay-colony":
    "Comes up when gated single-entry waterfront is preferred over open-grid finger-isle layouts.",
  "bermuda-riviera":
    "Comes up when mid-century-modern architecture and a quiet residential rhythm anchor the search.",
};

// Cycle 19B-FL — Buyer playbook redesign. Each step retains its canonical
// Cycle 18 ordering (Brief → Neighborhood → Lot data → Diligence sequence →
// Financing/insurance → Private availability) and source-ledger backing.
// Added: optional `tag` (one-line eyebrow above the title for scannability)
// and `gate` flag (renders the step as an emphasized full-width decision-gate
// card with the brass-400 accent — mirrors the WATERFRONT_VARIABLES pattern).
// No factual claim added; all body strings preserve verifiable language.
const BUYER_PLAYBOOK: ReadonlyArray<{
  n: string;
  tag: string;
  title: string;
  body: string;
  gate?: boolean;
}> = [
  {
    n: "01",
    tag: "Brief",
    title: "Begin with a brief, not a search",
    body:
      "The first 60-90 minutes is conversation. Lifestyle anchors, timeline, vessel profile, architectural preference, and target price band. The brief filters listings; aesthetic enthusiasm does not. Relocation briefs add a remote-first phase, then a defined in-person stage.",
  },
  {
    n: "02",
    tag: "Neighborhood shortlist",
    title: "Narrow to two or three neighborhoods",
    body:
      "Eastern Fort Lauderdale resolves into deepwater finger isles, in-town walkable streets, mid-century waterfront pockets, and gated barrier-island enclaves. Most serious buyers belong in two or three of those, not all of them.",
  },
  {
    n: "03",
    tag: "Lot and waterfront data",
    title: "Treat the lot as data, not aesthetic",
    body:
      "Survey, dock permits, seawall inspection, route-to-inlet — the verifiable variables that listing photographs flatten. The conversation Mia leads on the address opens with these, not with the kitchen finishes.",
  },
  {
    n: "04",
    tag: "Diligence sequence",
    title: "Sequence diligence before offer",
    body:
      "Surveyor, marine contractor, title, mortgage advisor where applicable. Mia identifies which licensed specialists will be needed up front so the offer's contingency timeline reflects the actual workload, not an optimistic estimate.",
  },
  {
    n: "05",
    tag: "Financing and insurance",
    title: "Confirm financing, cash, and insurance early",
    body:
      "Cash buyers organize proof-of-funds before the brief; financing buyers engage a coastal-Florida lender and a Florida-licensed insurance broker in parallel with the search. On Eastern FtLaud waterfront, the binding step is often the insurance underwriting — not the lender. Sequencing the broker up front compresses the diligence window from a scramble into a checklist.",
  },
  {
    // Cycle 19B-FL — emphasized decision-gate card. The "private availability"
    // step is the buyer-side question that most often decides whether the brief
    // becomes a public-listing search or a brokerage-relationship conversation.
    // Hedged language preserved verbatim: access is not guaranteed; the gate
    // names what Mia maintains, not what she promises.
    n: "06",
    tag: "Private availability — when it exists",
    title: "Use private conversations for quiet inventory",
    body:
      "Some residences are quietly available before they list publicly. Access varies by market and timing and is not guaranteed; what Mia maintains is the brokerage relationships that surface fits when they exist. Buyers who want only public-listing exposure say so up front; buyers who want both ask for the private-conversation channel to remain open in parallel.",
    gate: true,
  },
];

// Cycle 19B-FL — Seller playbook redesign mirrors the buyer pattern: each step
// carries its canonical Cycle 18 ordering (Property-specific valuation →
// Documentation → Insurance dataroom → Buyer-profile positioning → Photography
// & narrative → Tour strategy → Quiet pre-market option) plus an eyebrow `tag`
// and an optional `gate` flag for the final decision-gate emphasis (the
// quiet-pre-market option is the most-asked seller-side question and earns the
// full-width treatment). All hedged language preserved verbatim.
const SELLER_PLAYBOOK: ReadonlyArray<{
  n: string;
  tag: string;
  title: string;
  body: string;
  gate?: boolean;
}> = [
  {
    n: "01",
    tag: "Property-specific valuation",
    title: "Begin with a property-specific valuation",
    body:
      "Current comparable sales drawn from the right cohort — the same block, the same canal, the same lot profile. Broad averages do not predict what a deepwater point-lot trades at relative to an interior canal residence. Why public estimates miss this is its own conversation; the short version lives in the Insights note on automated valuations.",
  },
  {
    n: "02",
    tag: "Waterfront documentation",
    title: "Document the verifiable assets",
    body:
      "Seawall inspection records, dock permits, renovation history, roof and 4-point inspections, elevation certificate. Listings that arrive with this paperwork in hand close faster and renegotiate less.",
  },
  {
    n: "03",
    tag: "Insurance dataroom",
    title: "Organize the insurance dataroom",
    body:
      "Recent 4-point inspection, wind-mitigation report, elevation certificate, prior-claim history (or a CLUE report if available). On waterfront residences, this is what the buyer's insurance broker will request — and what the buyer's lender will require. A seller who has it organized before listing reduces post-inspection renegotiation and shortens the contingency clock for serious buyers.",
  },
  {
    n: "04",
    tag: "Buyer-profile positioning",
    title: "Position to one buyer profile",
    body:
      "Yachting, in-town walkability, or beach-corridor lifestyle. The listing copy, the photography, the showing strategy each lean to one profile. A residence that tries to be everything tends to feel like nothing.",
  },
  {
    n: "05",
    tag: "Photography and dock-up narrative",
    title: "Editorial photography and dock-up narrative",
    body:
      "Editorial photography that shows the lot, the route, the dock, and the lanai, not just the interiors. The narrative — listing copy, open-house script, broker-tour story — should carry the residence's specific identity (architectural era, canal context, lifestyle anchor) without slogan. Cinematic, not theatrical: the residence has to feel real on a second visit.",
  },
  {
    n: "06",
    tag: "Tour strategy",
    title: "Tour-ready presentation tuned to the buyer pool",
    body:
      "Showing strategy, staging, and timing tuned to the one buyer profile chosen in step 04. Buyers shopping a vessel-first brief want to see the dock at sunset; buyers shopping a hosting-first brief want to see the lanai at golden hour; buyers shopping a walkable-Las-Olas brief want a daylight foot-traffic stroll. Mismatching the tour to the buyer is a common, fixable error.",
  },
  {
    // Cycle 19B-FL — emphasized decision-gate card. The quiet-pre-market option
    // is the single seller decision that distinguishes a public-listing strategy
    // from a brokerage-relationship strategy. Full-width emphasis mirrors the
    // buyer-side ISC-21 gate. Hedged language preserved verbatim.
    n: "07",
    tag: "Quiet pre-market option",
    title: "Discreet pre-market and targeted introductions",
    body:
      "Some sellers prefer a quiet pre-market period — letting Mia mention the residence privately to brokers whose buyers fit, before the listing becomes public. Whether that's the right strategy depends on the residence, the timeline, and the seller's preference. The decision happens in writing, with the seller's reasoning recorded, so the strategy stays coherent if conditions change mid-listing.",
    gate: true,
  },
];

// FL-specific FAQs beyond the data-driven `market.faqs`. Kept conservatively
// worded — no school steering, no school-zone copy, no school-rating claim.
// Cycle 17 — extended from 2 to 4 items (V3 lift; page-total 5+4=9).
// Cycle 18 — extended from 4 to 6 items (V4 lift; page-total 5+6=11).
//   New entries:
//     • "What is no-fixed-bridge access and why does it matter?" — V4 calls
//       out the precise meaning of the term and where it actually applies
//       (inlet-bound canals south of the New River drawbridges; NOT the
//       New River itself, which has multiple drawbridges).
//     • "How does Fort Lauderdale compare to Pompano Beach?" — V4 closes the
//       comparison cohort to the new Pompano Beach market page.
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
  {
    question: "How is a private buyer brief different from a saved-search alert?",
    answer:
      "A saved-search alert surfaces listings; a private buyer brief surfaces decisions. The brief is a written priority hierarchy — lifestyle anchors, vessel profile, architectural era, dockage requirements, timing — that becomes the filter applied to public listings and, where the brokerage relationships surface a fit, to pre-market introductions. Mia's role is to read the brief carefully enough to rule out three quarters of the market before any address is opened, then narrow to the two or three residences a serious search should actually consider.",
  },
  {
    question: "Why does route-to-inlet matter for a buyer who isn't a serious yachter?",
    answer:
      "Route-to-inlet is a proxy for what the waterfront residence actually feels like day-to-day, even without a vessel. A no-fixed-bridge run to Port Everglades means open Atlantic water sits a short ride away — the canal carries through-traffic, the views include working boats, and resale captures the deepwater premium. Two opening bridges and a narrow turning basin imply a quieter canal experience and a different buyer pool at resale. The question shows up in lifestyle, view, and price; not only in vessel logistics.",
  },
  {
    question: "What does \"no fixed bridges\" mean and where does it actually apply?",
    answer:
      "\"No fixed bridges\" describes a route from a private dock to the open Atlantic that does not require passing under a non-opening (fixed-height) bridge. In Fort Lauderdale this typically applies to canal residences whose run reaches the Port Everglades inlet without crossing under a fixed bridge — the major yacht-capable canals on the Intracoastal-side finger isles south of the New River drawbridges. The New River itself is NOT a no-fixed-bridge corridor: multiple drawbridges (including Davie Boulevard, Andrews Avenue, and the FEC Railroad Bridge) cross it. The term is residence-specific and vessel-specific; confirm by walking the route on the survey before relying on it for a yacht-purchase decision.",
  },
  {
    question: "How does Fort Lauderdale compare to Pompano Beach for waterfront buyers?",
    answer:
      "Fort Lauderdale anchors the broader yachting and finger-isle waterfront cohort, with deepwater residences routed to the Atlantic via the Port Everglades inlet and a working downtown alongside the residential canal network. Pompano Beach — about ten miles north, separated by Lauderdale-by-the-Sea on the barrier island — is a separate municipality with its own beach corridor, the redeveloped Fisher Family Pier and Pompano Beach Fishing Village, deepwater Intracoastal residences, and the Hillsboro Inlet route to the Atlantic for canals farther north. Pompano Beach typically trades at relative value to Fort Lauderdale and offers an active offshore reef-and-wreck dive scene as a distinguishing lifestyle anchor. The choice between the two usually comes down to which inlet vector matches the vessel and where the buyer wants downtown-walkable depth versus beach-corridor lifestyle to anchor the search.",
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
        // Cycle 17 — V3 hero heading override. `market.tagline` is preserved on the
        // markets-index card and OG fallback; here the page leads with a precision
        // frame for the HNWI ICP per CYCLE_17_FORT_LAUDERDALE_ICP_REVIEW.md §"HNWI".
        heading="Where deepwater yacht access, a working downtown, and a 165-mile canal system meet."
        sub={market.intro}
        ctaPrimary={{ href: "/contact/?intent=buyer-brief&market=fort-lauderdale&source=market-v2", label: "Begin a Private Buyer Brief" }}
        ctaSecondary={{ href: "/valuation/?market=fort-lauderdale&source=market-v2", label: "Confidential Valuation" }}
        background="image"
        imageSrc={market.heroImage}
        imageAlt={`${market.name} waterfront luxury real estate`}
      />

      {/* SECTION 1.5 — V3 prelude: "A decision, not a default."
          New in Cycle 17 per CYCLE_17_FORT_LAUDERDALE_ICP_REVIEW.md. Sits between
          Hero and Executive AEO; anchors the privacy-conscious / brief-first framing
          before the snippet-able AEO paragraph below. */}
      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="font-display text-xs tracking-[0.3em] text-brass-700">
            A decision, not a default
          </div>
          <h2 className="mt-3 font-display text-3xl text-navy-800 sm:text-[34px] [text-wrap:balance]">
            Fort Lauderdale rewards a written brief.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-navy-800/85">
            For luxury and waterfront buyers, the city resolves into four or five distinct sub-markets that trade on different fundamentals. For sellers, the work that earns the right price is property-specific, not slogan-driven. The pages that follow are organized around the conversations Mia handles privately before any address is opened — for buyers, the brief; for sellers, the valuation and the buyer-profile decision.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-navy-800/80">
            Treat this page as a primer. The shortlists, the dock and lot specifics, the comparable-sales cohort, and the introductions — those happen in a 30-minute private call, not on a search page.
          </p>
        </div>
      </section>

      {/* SECTION 1.75 — Cycle 18 V4 NEW: Research-backed opening.
          Sits between the V3 prelude and the Executive AEO. Carries the
          Cycle-18 source-ledger facts (165-mi waterways within city limits;
          24-mi regional coastline; ~10% of 38.6 sq mi city is water; $18.5B
          regional marine industry; LauderGO Water Trolley as a free public
          mobility signal). Every claim hedged per the ledger; the geographic
          scope is named on every figure (city vs. county vs. region). See
          docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md, Part C
          rows F1, F2, F4, F5, F6, F9, F10, F11. */}
      <section className="bg-cream-100/80 border-y border-navy-800/5 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="font-display text-xs tracking-[0.3em] text-brass-700">
            What the geography actually is
          </div>
          <h2 className="mt-3 font-display text-3xl text-navy-800 sm:text-[34px] [text-wrap:balance]">
            Fort Lauderdale, in honest scope.
          </h2>
          <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-navy-800/85 sm:text-[17px]">
            <p>
              Fort Lauderdale carries approximately 165 miles of navigable inland waterways within city limits, sitting inside Greater Fort Lauderdale's broader 300-plus-mile Broward County waterway system. The city covers 38.6 square miles in total — of which about 10 percent (3.8 square miles) is water, a structural reflection of its waterfront character (per the U.S. Census Bureau).
            </p>
            <p>
              The city is widely known as the &ldquo;Venice of America&rdquo; for those waterways and as the &ldquo;Yachting Capital of the World&rdquo; for its marine industry — labels used by Visit Lauderdale and the Marine Industries Association of South Florida (MIASF). MIASF estimates South Florida's marine industry generates roughly $18.5 billion in regional economic output and supports 142,000 jobs across Broward, Miami-Dade, and Palm Beach counties.
            </p>
            <p>
              Port Everglades — located within Fort Lauderdale city limits but operated as a self-supporting enterprise fund of Broward County government (not a tax-supported facility) — is one of the busiest cruise ports in the world and South Florida's main petroleum and jet-fuel seaport. The inlet at Port Everglades is the route serious deepwater residences use to reach the open Atlantic. The New River runs approximately three miles through downtown, connecting the Intracoastal to the Atlantic via that inlet (note: the New River itself has multiple drawbridges, so &ldquo;no-fixed-bridge access&rdquo; is a residence-specific question, not a city-wide claim).
            </p>
            <p>
              The City of Fort Lauderdale also operates the LauderGO! Water Trolley — a free public water shuttle along the New River with eight stops, daily 10 a.m. to 10 p.m., in partnership with Water Taxi of Fort Lauderdale and Riverwalk Fort Lauderdale — a measurable signal of city-level investment in waterfront mobility.
            </p>
            <p className="text-[14px] italic text-navy-800/65">
              Sources: U.S. Census Bureau QuickFacts (Fort Lauderdale city, FL); Visit Lauderdale (Greater Fort Lauderdale / Broward County Fact Sheet + city page); Port Everglades; Marine Industries Association of South Florida; City of Fort Lauderdale (LauderGO Water Trolley page). Full ledger and hedges in <Link href="/markets/fort-lauderdale/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md</Link>.
            </p>
          </div>
        </div>
      </section>

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
              heading="Why Fort Lauderdale matters."
            />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-navy-800/85">
              <p>
                Fort Lauderdale is the city in South Florida where deep-water living, a real downtown, and Atlantic beach access exist in one geography. More than 165 miles of navigable inland waterways thread the city; the major yacht-capable canals reach Port Everglades and the Atlantic with no fixed bridges between them and the ocean — the structural reason the city is called the yachting capital of the world.
              </p>
              <p>
                {market.localContext}
              </p>
              <p>
                For buyers comparing Eastern Fort Lauderdale to its Palm Beach County peers, the distinction is structural. Boca Raton and Palm Beach trade on architectural pedigree and country-club residential geography; Delray Beach trades on Atlantic Avenue's walkable downtown. Fort Lauderdale trades on the combination — a working city alongside private dockage, a beach corridor, and established residential neighborhoods that have evolved across architectural eras from the 1920s onward.
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
            heading="Nine verifiable variables before any offer."
            sub="On a Fort Lauderdale waterfront parcel, the variables that matter most live in surveys, permits, and inspections — not in listing photographs. These are the questions Mia handles privately before the second showing."
          />
          {/* Cycle 17 — V3 lift. 7 cards: first 6 in 3-col grid, 7th (insurance + 4-point)
              emphasized as a full-width row below. The `emphasize` flag controls the
              col-span at lg, the inner layout (two-column at sm), and the icon size.
              Editorial intent: the 7th card is the question HNW buyers ask Mia most often,
              so it gets the visual weight a single full-width row provides. */}
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WATERFRONT_VARIABLES.map((v) => {
              const Icon = v.icon;
              if (v.emphasize) {
                return (
                  <li
                    key={v.title}
                    className="rounded-sm border border-brass-400/30 bg-cream-100 p-7 shadow-card sm:col-span-2 lg:col-span-3 lg:p-10"
                  >
                    <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-10">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy-800 text-cream-50">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <div>
                        <div className="font-display text-xs tracking-[0.3em] text-brass-700">
                          THE QUESTION BUYERS ASK MOST OFTEN
                        </div>
                        <h3 className="mt-2 font-display text-2xl text-navy-800">{v.title}</h3>
                        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-navy-800/85">
                          {v.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              }
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
            None of the nine is a substitute for a licensed inspector, marine contractor, surveyor, or insurance broker. Mia coordinates these specialists; their findings — not Mia's summaries — are the ground truth.
          </p>
        </div>
      </section>

      {/* SECTION 4.5 — Cycle 18 V4 NEW: Buyer's comparison cohort.
          An editorial framework — three tiers — for what serious Fort Lauderdale
          buyers are actually comparing. Replaces the implicit "see the cards
          below" handoff that V3 made. The three tiers are:
            • Eastern Fort Lauderdale finger-isle peers (the "which sub-market"
              question — these are the cards in section 5 below)
            • Northern Broward waterfront alternatives (the "should I look north"
              question — Pompano Beach + Lighthouse Point + Hillsboro Mile)
            • Palm Beach County peers (the "should I look out of Broward"
              question — Boca / Palm Beach / Delray)
          Editorial prose, not a list dump. No invented rankings. No school /
          family-composition steering. */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="What Fort Lauderdale buyers are actually comparing"
            heading="Three tiers of decision, not one."
          />
          <div className="mt-8 space-y-7 text-[16px] leading-relaxed text-navy-800/85 sm:text-[17px]">
            <p>
              Most serious Fort Lauderdale buyer briefs resolve into three comparison tiers — not a single shortlist of houses. Each tier asks a different question, and the answer to the question often filters the others.
            </p>
            <div>
              <h3 className="font-display text-xl text-navy-800">Tier 1 — Eastern Fort Lauderdale finger-isle peers</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-navy-800/85">
                The &ldquo;which sub-market within the city&rdquo; question. <Link href="/markets/las-olas-isles/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Las Olas Isles</Link> and <Link href="/markets/seven-isles/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Seven Isles</Link> trade as the canonical deepwater finger-isle markets. <Link href="/markets/harbor-beach/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Harbor Beach</Link> adds gated barrier-island privacy and a beach-club component. <Link href="/markets/rio-vista/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Rio Vista</Link> trades as the New River-side counterpart with stronger walkability to Las Olas Boulevard. <Link href="/markets/coral-ridge/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Coral Ridge</Link> and <Link href="/markets/victoria-park/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Victoria Park</Link> are the residential-feel alternatives where dockage is optional rather than the dominant variable. <Link href="/markets/bay-colony/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Bay Colony</Link> is the gated single-entry deepwater enclave; <Link href="/markets/bermuda-riviera/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Bermuda Riviera</Link> is the mid-century-modern architectural alternative within the same broader cohort.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-navy-800">Tier 2 — Northern Broward waterfront alternatives</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-navy-800/85">
                The &ldquo;should I be shopping north of Fort Lauderdale&rdquo; question. <Link href="/markets/lighthouse-point/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Lighthouse Point</Link> trades on a denser network of finger-isle canals routed to the Atlantic via the Hillsboro Inlet — quieter, smaller, more single-family than central Fort Lauderdale. <Link href="/markets/hillsboro-mile/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Hillsboro Mile</Link> is the linear A1A corridor through the town of Hillsboro Beach (a separate municipality, not Fort Lauderdale), with both oceanfront estates and Intracoastal-side residences. <Link href="/markets/pompano-beach/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Pompano Beach</Link> sits between the Fort Lauderdale waterfront cohort and the northern barrier-island markets, with the redeveloped Fisher Family Pier and Pompano Beach Fishing Village, deepwater Intracoastal residences, and an active offshore reef-and-wreck dive corridor at relative value to Fort Lauderdale.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-navy-800">Tier 3 — Palm Beach County peers</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-navy-800/85">
                The &ldquo;should I be shopping out of Broward&rdquo; question. <Link href="/markets/boca-raton/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Boca Raton</Link> trades on Mizner-pedigree downtown, country-club residential geography, and an A1A oceanfront corridor — a different residential character than central Fort Lauderdale, with country-club-membership considerations independent of homeownership. <Link href="/markets/palm-beach/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Palm Beach</Link> trades on island and coastal property decisions with the most distinct architectural pedigree in the cohort. <Link href="/markets/delray-beach/" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">Delray Beach</Link> trades on Atlantic Avenue's walkable downtown and a beach-corridor residential mix. The Palm Beach County tier is a different state-of-mind decision; the right Fort Lauderdale brief separates &ldquo;which Broward sub-market&rdquo; from &ldquo;Broward versus Palm Beach County&rdquo; rather than blending the two.
              </p>
            </div>
            <p className="text-[14px] italic text-navy-800/65">
              The cards in the section below are the canonical Eastern Fort Lauderdale peer set — useful at first contact, but the three tiers above usually open the brief.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Neighborhood comparison.
          Cycle 18 — visually adjacent to the V4 "Buyer's comparison cohort"
          editorial section above; rendered at the same cream-100 background
          to read as one continuous comparison module. (The waterfront framework
          ABOVE is at cream-50, and the buyer playbook BELOW is at cream-50,
          so the cream-100 pair sits inside its own visual bracket.) */}
      {relatedMarkets.length > 0 ? (
        <section className="bg-cream-100 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading
              eyebrow="Neighborhood comparison cards"
              heading={relatedHeading}
              sub="The Eastern Fort Lauderdale peer cards. Each entry leads to a dedicated market guide; use the three-tier framework above to choose where to begin."
            />
            {market.comparisonContext ? (
              <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-navy-800/85">
                {market.comparisonContext}
              </p>
            ) : null}
            {/* Cycle 17 — V3 lift. Per-peer "Comes up when…" pointer above each MarketCard,
                sourced from V3_PEER_POINTERS keyed by peer market slug. Peers without a
                registered pointer fall back to the MarketCard alone. */}
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedMarkets.map((m) => {
                const pointer = V3_PEER_POINTERS[m.slug];
                return (
                  <li key={m.slug} className="flex flex-col gap-3">
                    {pointer ? (
                      <p className="text-[13px] italic leading-snug text-navy-800/70">
                        {pointer}
                      </p>
                    ) : null}
                    <MarketCard market={m} />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* SECTION 6 — Buyer playbook (Cycle 19B-FL redesign).
          Replaces the prior stacked 2-col grid (number + body) with a card grid
          system. Each step renders as a hairline-bordered panel with eyebrow
          tag, step number, title, and a focused body. The final step (private
          availability) is rendered as an emphasized full-width decision-gate
          card — `gate: true` in the BUYER_PLAYBOOK data above. The CTA aside
          drops below the cards on every viewport so the card grid uses the
          full editorial width rather than competing with a sidebar. */}
      <section id="buyer-playbook" className="bg-cream-50 py-20 lg:py-28 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Buyer playbook"
            heading={`Considering ${market.name} as a buyer.`}
          />
          <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-navy-800/85">
            {market.buyerGuidance}
          </p>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BUYER_PLAYBOOK.map((step) => {
              if (step.gate) {
                return (
                  <li
                    key={step.n}
                    className="group rounded-sm border border-brass-400/30 bg-cream-100 p-7 shadow-card sm:col-span-2 lg:col-span-3 lg:p-10"
                  >
                    <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-10">
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy-800 font-display text-[14px] tracking-[0.2em] text-cream-50">
                          {step.n}
                        </span>
                        <div className="lg:hidden">
                          <div className="font-display text-[11px] uppercase tracking-[0.3em] text-brass-700">
                            DECISION GATE · {step.tag}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="hidden font-display text-[11px] uppercase tracking-[0.3em] text-brass-700 lg:block">
                          DECISION GATE · {step.tag}
                        </div>
                        <h3 className="mt-2 font-display text-2xl text-navy-800">{step.title}</h3>
                        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-navy-800/85">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li
                  key={step.n}
                  className="flex flex-col rounded-sm border border-navy-800/10 bg-cream-100 p-6 shadow-card lg:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 font-display text-[12px] tracking-[0.2em] text-cream-50">
                      {step.n}
                    </span>
                    <div className="font-display text-[11px] uppercase tracking-[0.3em] text-brass-700">
                      {step.tag}
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-xl text-navy-800 [text-wrap:balance]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-navy-800/80">{step.body}</p>
                </li>
              );
            })}
          </ol>
          {/* Cycle 17 — V3 lift, preserved. */}
          <aside className="mt-10 rounded-sm border border-navy-800/10 bg-cream-100 px-6 py-5 text-[14px] leading-relaxed text-navy-800/80">
            <span className="block font-display text-xs uppercase tracking-[0.3em] text-brass-700">
              What this is not
            </span>
            <p className="mt-2">
              The brief is not a saved-search alert; it is a written priority hierarchy. Saved-search alerts surface listings; a brief surfaces decisions — which neighborhoods, which lot profiles, and which trade-offs are inside the search and which are outside it.
            </p>
          </aside>
          {/* Cycle 19B-FL — Buyer-CTA panel moved below the card grid so the
              cards can use the full editorial width. Two CTAs: submit a buyer
              brief (primary) and read how Mia represents buyers (secondary). */}
          <aside className="mt-10 grid gap-6 rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10 lg:p-10">
            <div>
              <div className="font-display text-xs tracking-[0.3em] text-brass-700">
                BUYER NEXT STEPS
              </div>
              <h3 className="mt-3 font-display text-2xl text-navy-800">Begin a buyer brief.</h3>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-navy-800/85">
                A short conversation establishes timeline, lifestyle priorities, and the residence in mind. From there the search narrows to two or three serious candidates rather than a broad open tour.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact/?intent=buyer-brief&market=fort-lauderdale&source=market-v2-buyer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
              >
                Submit a Private Buyer Brief
              </Link>
              <Link
                href="/buyers/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-navy-800"
              >
                How Mia Represents Buyers
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* SECTION 6.5 — Cycle 19B-FL NEW: Buyer → Seller transition + Waterfront
          diligence snapshot module. A one-paragraph hinge between the buyer
          playbook (above) and the seller playbook (below) plus a downloadable
          checklist anchor pointing to the Cycle-19B-FL lead magnets. Honest
          fallback gating per principal directive: direct download links plus a
          private-brief CTA — no fake email capture. PDF URLs are routed under
          /downloads/, which the build pipeline writes at build time. */}
      <section
        id="waterfront-diligence-snapshot"
        className="bg-navy-800 py-16 text-cream-50 lg:py-20 scroll-mt-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8">
          <div>
            <div className="luxury-divider mb-5 [&>span]:text-brass-300">
              <span>Bridge — buyer to seller logic</span>
            </div>
            <h2 className="font-display text-3xl text-cream-50 sm:text-4xl [text-wrap:balance]">
              The same waterfront diligence reads differently from each side of the transaction.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream-200/85">
              For buyers the diligence sequence is a filter — survey first, dock and seawall next, insurance underwriting before the offer. For sellers it becomes a dataroom — the documents that compress the contingency window and shorten renegotiation. Mia coordinates the same licensed specialists; the deliverable changes shape depending on whether the residence is being bought or listed.
            </p>
          </div>
          <aside className="rounded-sm border border-cream-200/20 bg-navy-700/40 p-6 lg:p-8">
            <div className="font-display text-[11px] uppercase tracking-[0.3em] text-brass-300">
              Waterfront diligence snapshot
            </div>
            <h3 className="mt-2 font-display text-2xl text-cream-50">
              Take the diligence list with you.
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-cream-200/85">
              Three brand-quality checklists, written in Mia's voice, drawn from the same Eastern Fort Lauderdale diligence sequence used on private engagements. No email required.
            </p>
            <ul className="mt-5 flex flex-col gap-2 text-[13px]">
              <li>
                <Link
                  href="/downloads/waterfront-buyer-due-diligence-checklist.pdf"
                  className="inline-flex w-full items-center justify-between gap-3 rounded-sm border border-cream-200/30 bg-navy-800/40 px-4 py-3 text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200"
                >
                  <span>Waterfront Buyer Due Diligence Checklist</span>
                  <span aria-hidden="true">↓ PDF</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/downloads/luxury-seller-pre-listing-checklist.pdf"
                  className="inline-flex w-full items-center justify-between gap-3 rounded-sm border border-cream-200/30 bg-navy-800/40 px-4 py-3 text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200"
                >
                  <span>Luxury Seller Pre-Listing Checklist</span>
                  <span aria-hidden="true">↓ PDF</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/downloads/fort-lauderdale-waterfront-valuation-prep-sheet.pdf"
                  className="inline-flex w-full items-center justify-between gap-3 rounded-sm border border-cream-200/30 bg-navy-800/40 px-4 py-3 text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200"
                >
                  <span>Fort Lauderdale Waterfront Valuation Prep Sheet</span>
                  <span aria-hidden="true">↓ PDF</span>
                </Link>
              </li>
            </ul>
            <Link
              href="/contact/?intent=waterfront-review&market=fort-lauderdale&source=market-v2-magnets"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brass-300 px-5 py-2.5 text-[12px] uppercase tracking-[0.25em] text-brass-300 transition-colors hover:bg-brass-300 hover:text-navy-800"
            >
              Request a private brief instead
            </Link>
            <p className="mt-3 text-[11px] leading-snug text-cream-200/60">
              Not legal, insurance, inspection, marine survey, engineering, tax, or lending advice. Mia coordinates; licensed specialists confirm.
            </p>
          </aside>
        </div>
      </section>

      {/* SECTION 7 — Seller playbook (Cycle 19B-FL redesign).
          Mirrors the buyer playbook card-grid pattern. Seven steps: six render
          as standard cards (3-col grid at lg), the seventh (quiet pre-market
          option) renders as the emphasized full-width decision-gate card via
          `gate: true` in the SELLER_PLAYBOOK data above. CTA aside moved below
          the cards (parallel to the buyer-side rearrangement) so the card grid
          uses the full editorial width. */}
      <section id="seller-playbook" className="bg-cream-100 py-20 lg:py-28 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Seller playbook"
            heading={`Listing in ${market.name}.`}
          />
          <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-navy-800/85">
            {market.sellerGuidance}
          </p>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SELLER_PLAYBOOK.map((step) => {
              if (step.gate) {
                return (
                  <li
                    key={step.n}
                    className="group rounded-sm border border-brass-400/30 bg-cream-50 p-7 shadow-card sm:col-span-2 lg:col-span-3 lg:p-10"
                  >
                    <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-10">
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy-800 font-display text-[14px] tracking-[0.2em] text-cream-50">
                          {step.n}
                        </span>
                        <div className="lg:hidden">
                          <div className="font-display text-[11px] uppercase tracking-[0.3em] text-brass-700">
                            DECISION GATE · {step.tag}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="hidden font-display text-[11px] uppercase tracking-[0.3em] text-brass-700 lg:block">
                          DECISION GATE · {step.tag}
                        </div>
                        <h3 className="mt-2 font-display text-2xl text-navy-800">{step.title}</h3>
                        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-navy-800/85">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li
                  key={step.n}
                  className="flex flex-col rounded-sm border border-navy-800/10 bg-cream-50 p-6 shadow-card lg:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 font-display text-[12px] tracking-[0.2em] text-cream-50">
                      {step.n}
                    </span>
                    <div className="font-display text-[11px] uppercase tracking-[0.3em] text-brass-700">
                      {step.tag}
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-xl text-navy-800 [text-wrap:balance]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-navy-800/80">{step.body}</p>
                </li>
              );
            })}
          </ol>
          {/* Cycle 17 — V3 lift, preserved with Insights cross-link. */}
          <aside className="mt-10 rounded-sm border border-navy-800/10 bg-cream-50 px-6 py-5 text-[14px] leading-relaxed text-navy-800/80">
            <span className="block font-display text-xs uppercase tracking-[0.3em] text-brass-700">
              What this is not
            </span>
            <p className="mt-2">
              Pricing is not a number drawn from a public estimate, and positioning is not a slogan. The seller playbook above operates the residence-specific way; the related note on why public estimates miss luxury waterfront — <Link href="/insights/why-automated-valuations-miss-luxury-waterfront/?source=market-v2-seller" className="text-brass-700 underline decoration-brass-400/40 underline-offset-4 hover:decoration-brass-600">read the brief</Link> — covers the category limitation in writing.
            </p>
          </aside>
          {/* Cycle 19B-FL — Seller CTA panel moved below the card grid, mirroring
              the buyer playbook. */}
          <aside className="mt-10 grid gap-6 rounded-sm border border-navy-800/10 bg-cream-50 p-7 shadow-card lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10 lg:p-10">
            <div>
              <div className="font-display text-xs tracking-[0.3em] text-brass-700">
                SELLER NEXT STEPS
              </div>
              <h3 className="mt-3 font-display text-2xl text-navy-800">Position the residence.</h3>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-navy-800/85">
                A focused listing brief begins with a current valuation, a comparable-sales review against the right cohort, and a presentation strategy tuned to the residence's specific story.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/valuation/?market=fort-lauderdale&source=market-v2-seller"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
              >
                Request a Confidential Valuation
              </Link>
              <Link
                href="/sellers/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-navy-800"
              >
                How Mia Represents Sellers
              </Link>
            </div>
          </aside>
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
            Each path opens a different conversation, sized to where you are in the decision. No path obligates anything beyond a private, time-bound discussion.
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
