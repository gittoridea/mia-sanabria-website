import type { Metadata } from "next";
import Link from "next/link";
import type { Article, FAQPage, WithContext } from "schema-dts";
import { Hero } from "@/components/Hero";
import { CTAStrip } from "@/components/CTAStrip";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights — SE Florida Luxury Real Estate",
  description:
    "Notes on the Southeast Florida luxury market from Mia Sanabria — neighborhood reads, lot-profile primers, and reflections on the personal-representation model.",
  alternates: { canonical: `${SITE.url}/insights/` },
  openGraph: {
    title: "Insights — Mia Sanabria, Fort Lauderdale REALTOR®",
    description:
      "Editorial market commentary from Mia Sanabria on Southeast Florida luxury real estate. Neighborhood reads and lot-profile primers.",
    url: `${SITE.url}/insights/`,
    images: [{ url: `${SITE.url}/og-default.jpg`, width: 1200, height: 630, alt: "Southeast Florida luxury real estate market commentary" }],
  },
};

const PUBLISHED_ISO_PRACTICE = "2026-05-07";
const PUBLISHED_ISO_LIGHTHOUSE = "2026-05-08";

const LIGHTHOUSE_FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "Why does the lot profile matter more than the listing photographs in Lighthouse Point?",
    a: "Lighthouse Point's value is structurally tied to water access, dockage capacity, and ocean-route timing — variables that listing photographs flatten. The lot profile (point, finger, canal-wide, or lakefront) is what predicts how a yacht actually leaves the property, how seawall load behaves over a thirty-year horizon, and how the residence resells.",
  },
  {
    q: "What is the difference between a point lot and a deepwater finger lot?",
    a: "A point lot sits at the intersection of two waterways with frontage on both sides — typically the longest dockage envelope and the broadest water view, often at a meaningful premium. A finger lot has frontage on a single canal, generally narrower water and tighter turning radius, and trades at a more accessible price for the same square footage.",
  },
  {
    q: "Does Lighthouse Point have no-fixed-bridge ocean access?",
    a: "Most Lighthouse Point dockage routes through the Hillsboro Inlet to the Atlantic without a fixed bridge, which is part of why the community is sold to vessel owners who want minimum air-draft constraint. Specific routes still vary by canal, and vessel beam and draft should be verified against the route — not assumed from the lot listing.",
  },
  {
    q: "How does a canal-wide lot differ from a lakefront lot?",
    a: "Canal-wide lots face directly across a wider waterway, offering longer view sightlines and more privacy from the opposite seawall — typically priced between point and finger lots. Lakefront lots sit on the interior lakes inside Lighthouse Point and tend to trade lower than direct-canal frontage despite the visual openness, because ocean-route access is indirect.",
  },
  {
    q: "What should a buyer ask before writing an offer on a Lighthouse Point waterfront residence?",
    a: "Three things first: confirmed dockage dimensions (length, beam, water-depth at low tide), confirmed ocean-route bridge clearances and travel time to the Hillsboro Inlet, and the seawall's age, material, and most recent inspection. Each of these is verifiable on the address — not a category answer.",
  },
];

export default function InsightsPage() {
  const articlePractice: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}/insights/#article-realtor-model`,
    headline: "What Working with a Fort Lauderdale REALTOR® Means in Practice",
    description:
      "A working definition of the personal-representation model Mia Sanabria uses for buyers and sellers across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach.",
    author: { "@id": `${SITE.url}/#person` },
    publisher: { "@id": `${SITE.url}/#organization` },
    datePublished: PUBLISHED_ISO_PRACTICE,
    dateModified: PUBLISHED_ISO_PRACTICE,
    mainEntityOfPage: `${SITE.url}/insights/`,
    image: `${SITE.url}/og-default.jpg`,
    inLanguage: "en-US",
    about: [
      { "@type": "Thing", name: "Luxury real estate" },
      { "@type": "Thing", name: "Personal representation" },
      { "@type": "Place", name: "Fort Lauderdale, Florida" },
      { "@type": "Place", name: "Boca Raton, Florida" },
      { "@type": "Place", name: "Delray Beach, Florida" },
    ],
  };

  const articleLighthouse: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}/insights/#article-lighthouse-point-lot-profiles`,
    headline: "What Lighthouse Point Lot Profiles Actually Tell a Buyer",
    description:
      "A primer on the four lot archetypes in Lighthouse Point — point, deepwater finger, canal-wide, and lakefront — and what each predicts about ocean access, dockage, and resale.",
    author: { "@id": `${SITE.url}/#person` },
    publisher: { "@id": `${SITE.url}/#organization` },
    datePublished: PUBLISHED_ISO_LIGHTHOUSE,
    dateModified: PUBLISHED_ISO_LIGHTHOUSE,
    mainEntityOfPage: `${SITE.url}/insights/`,
    image: `${SITE.url}/markets/lighthouse-point.jpg`,
    inLanguage: "en-US",
    about: [
      { "@type": "Place", name: "Lighthouse Point, Florida" },
      { "@type": "Thing", name: "Waterfront real estate" },
      { "@type": "Thing", name: "Deepwater dockage" },
      { "@type": "Thing", name: "Hillsboro Inlet" },
    ],
  };

  const lighthouseFaqSchema: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}/insights/#faq-lighthouse-point-lot-profiles`,
    mainEntity: LIGHTHOUSE_FAQ.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: { "@type": "Answer" as const, text: item.a },
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
      <JsonLd data={articlePractice} />
      <JsonLd data={articleLighthouse} />
      <JsonLd data={lighthouseFaqSchema} />

      <Hero
        eyebrow="Insights · Quarterly Notes"
        heading="Notes from the Southeast Florida luxury market."
        sub="A quarterly cadence — neighborhood notes, lot-profile reads, market reflections. Reach out directly to be added to the private list."
      />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>The Practice</span>
          </div>
          <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
            What working with a Fort Lauderdale REALTOR® means in practice.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-navy-800/85">
            Most luxury buyers and sellers in Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach do not actually need more listings. They need fewer — the right ones, framed clearly, against current comparable sales, with a representative who treats the conversation as private from the first call.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
            That is the working definition of a personal REALTOR® practice. Not a service tier or a marketing label — a different shape of engagement.
          </p>

          <h3 className="mt-12 font-display text-2xl text-navy-800">A clearly written brief comes first.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            Before showings, before pricing exercises, before any IDX search: a private conversation that captures what the residence actually needs to do. Lifestyle, timing, architectural preference, water access, school proximity, building rules, association profile, renovation tolerance. The brief is the access — every introduction Mia makes downstream traces back to it.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">Quietly available residences move through relationships.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            When residences in Coral Ridge, Boca Raton, Lighthouse Point, the Palm Beach corridor, or the Delray Beach grid become quietly available, they tend to surface through brokerage and ownership relationships built over time — not public feeds. Availability varies, and a clearly written brief is what enables the right introduction at the right moment.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">Pricing is current, specific, and earned.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            Online estimates broadcast averages. A property-specific pricing analysis answers a different question — what should this specific street, building, lot, condition, and dockage profile transact at this month, against the buyers actually in the market. The answer requires comparable sales pulled and reviewed for the address, not a generic range.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">Discretion is the default, not a feature.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            Inquiries, valuations, search work, and listing preparation proceed without unnecessary exposure of the principal or the property. Public marketing happens only when the strategy calls for it, and only with the seller's explicit direction.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">Quarterly dispatches.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            New essays land at a quarterly cadence — micro-market reads, neighborhood briefings, and reflections on architecture and design across Mia's core markets. Reach out directly to be added to the private list.
          </p>

          <div className="mt-10">
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Join the Private List
            </Link>
          </div>
        </div>
      </article>

      <article className="border-t border-navy-800/10 bg-cream-50 py-20 lg:py-28" id="article-lighthouse-point-lot-profiles">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>Neighborhood · Lighthouse Point</span>
          </div>
          <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
            What Lighthouse Point lot profiles actually tell a buyer.
          </h2>

          <aside
            className="mt-7 rounded-sm border border-brass-400/40 bg-brass-400/5 px-5 py-4 text-[15px] leading-relaxed text-navy-800/85"
            aria-label="Quotable summary"
          >
            In Lighthouse Point, the lot profile — point, deepwater finger, canal-wide, or lakefront — predicts ocean access time and dockage tolerance more reliably than the listing photographs ever do. Buyers paying a waterfront premium should price the lot, not the staging.
          </aside>

          <p className="mt-7 text-[15px] leading-relaxed text-navy-800/85">
            Lighthouse Point is a small Broward community sold to vessel owners. The marketing language — "boater's paradise," "no-fixed-bridge access," "Hillsboro Inlet to the Atlantic" — is broadly true and largely interchangeable across listings. What distinguishes one address from another is the lot itself, and lot literacy is the first place a careful buyer separates from a casual one.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">Point lots — frontage on two waterways.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            A point lot sits where two canals meet, with frontage on each side. Practically, that means the longest possible dockage envelope on a given parcel, the broadest water view in two directions, and meaningful resilience to a future neighbor changing what the opposing seawall looks like. Point lots typically trade at a premium for those exact reasons. They also tend to attract larger-vessel owners who value swing room — and in older parcel sections, the original 1960s point-lot footprints are still the most coveted.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">Deepwater finger lots — single-canal frontage.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            A finger lot has one waterway and one neighbor on each side. The dockage envelope is shorter than a point lot's, but the price point is more accessible for the same square footage of residence. Vessel beam matters here — a wide-beam yacht in a tight canal needs the turning radius confirmed before the offer, not after the survey. Finger lots also vary sharply by depth-at-low-tide; that single number rarely appears on the listing and is the one a buyer should ask Mia to verify against current bathymetry before writing.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">Canal-wide lots — broad frontage with a wide opposite seawall.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            Canal-wide lots sit on the wider waterways of Lighthouse Point — the parcels where the across-canal sightline is long enough to feel open. Dockage is competitive with a finger lot but the view profile is materially different: longer water vista, more privacy from the opposite bank, often softer wind exposure. Pricing tends to fall between point lots and standard finger lots and to track most closely with the perceived view quality.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">Lakefront lots — interior water, indirect ocean route.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            The interior lakes of Lighthouse Point produce visually striking parcels — broad water, no opposing seawall, a quieter aesthetic. The trade-off is the route: vessels still reach the Atlantic via the Hillsboro Inlet, but the path runs through interior canals first. For buyers who use a tender or smaller vessel and value the lake aesthetic, lakefront is a thoughtful choice. For buyers who plan to keep a primary cruising yacht, the directness of a canal-wide or point lot tends to be the more durable purchase.
          </p>

          <h3 className="mt-10 font-display text-2xl text-navy-800">What to verify on the address before the offer.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            Three numbers, not categories: dockage dimensions (length, beam clearance, depth at mean low tide); ocean-route bridge clearances and timing to the Hillsboro Inlet for the specific vessel; and the seawall's age, material, and most recent inspection. The first two protect the lifestyle; the third protects the basis. Mia handles each of these as part of the standard pre-offer brief.
          </p>

          <div className="mt-10">
            <Link
              href="/markets/lighthouse-point/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700"
            >
              Walk Lighthouse Point
            </Link>
            <Link
              href="/contact/"
              className="ml-3 inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Begin a Private Conversation
            </Link>
          </div>
        </div>
      </article>

      <CTAStrip
        heading="Join the private list."
        sub="A small, infrequent dispatch on Southeast Florida's luxury market — written by Mia, sent only when there is something specific worth saying."
      />
    </>
  );
}
