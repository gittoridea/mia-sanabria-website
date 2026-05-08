import type { Metadata } from "next";
import Link from "next/link";
import type { Article, WithContext } from "schema-dts";
import { Hero } from "@/components/Hero";
import { CTAStrip } from "@/components/CTAStrip";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { JsonLd } from "@/components/schema/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights — SE Florida Luxury Real Estate",
  description:
    "What working with a South Florida Realtor means in practice — how Mia Sanabria represents buyers and sellers in Fort Lauderdale, Boca Raton, and Palm Beach.",
  alternates: { canonical: `${SITE.url}/insights/` },
};

const PUBLISHED_ISO = "2026-05-07";

export default function InsightsPage() {
  const article: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}/insights/#article-realtor-model`,
    headline: "What Working with a South Florida Realtor Means in Practice",
    description:
      "A working definition of the personal-representation model Mia Sanabria uses for buyers and sellers across Fort Lauderdale, Boca Raton, and the Palm Beach corridor.",
    author: { "@id": `${SITE.url}/#person` },
    publisher: { "@id": `${SITE.url}/#organization` },
    datePublished: PUBLISHED_ISO,
    dateModified: PUBLISHED_ISO,
    mainEntityOfPage: `${SITE.url}/insights/`,
    image: `${SITE.url}/og-default.jpg`,
    inLanguage: "en-US",
    about: [
      { "@type": "Thing", name: "Luxury real estate" },
      { "@type": "Thing", name: "Personal representation" },
      { "@type": "Place", name: "Fort Lauderdale, Florida" },
      { "@type": "Place", name: "Boca Raton, Florida" },
      { "@type": "Place", name: "Palm Beach, Florida" },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights/" },
        ]}
      />
      <JsonLd data={article} />

      <Hero
        eyebrow="Insights · Inaugural Essay"
        heading="Notes from the Southeast Florida luxury market."
        sub="The first of a quarterly cadence — neighborhood notes, market reads, and reflections on architecture and design. Reach out directly to be added to the private list."
      />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>The Practice</span>
          </div>
          <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
            What working with a South Florida Realtor means in practice.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-navy-800/85">
            Most luxury buyers and sellers in Fort Lauderdale, Boca Raton, and the Palm Beach corridor do not actually need more listings. They need fewer — the right ones, framed clearly, against current comparable sales, with a representative who treats the conversation as private from the first call.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-navy-800/85">
            That is the working definition of a personal Realtor practice. Not a service tier or a marketing label — a different shape of engagement.
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

      <CTAStrip
        heading="Join the private list."
        sub="A small, infrequent dispatch on Southeast Florida's luxury market — written by Mia, sent only when there is something specific worth saying."
      />
    </>
  );
}
