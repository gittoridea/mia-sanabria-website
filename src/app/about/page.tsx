import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { AnswerFirst } from "@/components/AnswerFirst";
import { CTAStrip } from "@/components/CTAStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Mia Sanabria | South Florida Luxury & Waterfront Real Estate" },
  description:
    "Mia Sanabria, REALTOR® with LPT Realty — luxury, waterfront, and lifestyle real estate across Broward County and South Florida. Start a private conversation.",
  alternates: { canonical: `${SITE.url}/about/` },
  openGraph: {
    title: "About Mia Sanabria — South Florida Luxury & Waterfront REALTOR®",
    description:
      "REALTOR® with LPT Realty representing buyers, sellers, investors, and second-home owners across Broward County and South Florida.",
    url: `${SITE.url}/about/`,
    images: [
      {
        url: `${SITE.url}/mia-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Mia Sanabria, REALTOR® with LPT Realty",
      },
    ],
  },
};

/**
 * How I Help Clients — Mia's six service lines, verbatim from her supplied
 * About copy. Rendered as an editorial horizontal ledger (not a feature grid).
 */
const HOW_I_HELP: ReadonlyArray<{ title: string; detail: string }> = [
  {
    title: "Buy luxury & waterfront homes",
    detail: "Buy luxury and waterfront homes across South Florida, matched to lifestyle, water access, and timeline.",
  },
  {
    title: "Sell with strategy",
    detail: "Sell with strategic pricing and high-impact marketing tuned to the right buyer pool.",
  },
  {
    title: "Relocate to Broward County",
    detail: "Relocate to Broward County and surrounding coastal communities with a guided, end-to-end process.",
  },
  {
    title: "Invest in South Florida",
    detail: "Invest in South Florida residential real estate with clear, evidence-led market context.",
  },
  {
    title: "Upgrade, downsize, or buy a second home",
    detail: "Upgrade, downsize, or find the perfect second home — including absentee and seasonal ownership.",
  },
  {
    title: "Understand the market",
    detail: "Understand market trends, home values, and neighborhood dynamics before you make a move.",
  },
];

/**
 * Why Clients Choose Mia — her eight differentiators, verbatim. Rendered as a
 * twin-column linear index marked by a brass hash rule (no SaaS feature cards).
 */
const WHY_MIA: ReadonlyArray<string> = [
  "Local Broward County market expertise",
  "Luxury & waterfront property knowledge",
  "Personalized client experience",
  "Strategic marketing for sellers",
  "Skilled negotiation & clear communication",
  "Relationship-driven service",
  "Modern real estate marketing approach",
  "Deep understanding of South Florida lifestyle communities",
];

/**
 * Client notes — supplied by Mia, rendered verbatim with attribution as given.
 * NO Review / AggregateRating JSON-LD is emitted for these (self-hosted, not a
 * verified third-party review surface — see audit-about.ts about.no.reviewSchema).
 */
const CLIENT_NOTES: ReadonlyArray<{ quote: string; name: string }> = [
  {
    quote:
      "Mia is a wonderful realtor! She's very knowledgeable and makes the selling process a breeze.",
    name: "Ashley Wright",
  },
  {
    quote:
      "Mia was friendly, professional, responsive and effective. Our purchase was super smooth due to all these qualities she possesses. First time I worked with her and plan on working with her again. Thanks Mia.",
    name: "Juana D.",
  },
  { quote: "She was the best, very special.", name: "Dianne" },
  {
    quote: "Very professional Realtor, gives personal attention to all her clients.",
    name: "Terry Pifer Lastella",
  },
  {
    quote:
      "Mia is very thorough and professional with her work. She's a great guide and a reliable source of information.",
    name: "Priscilla Y. Black",
  },
  {
    quote:
      "Mia is knowledgeable and really hard working. She knows South Florida really well and is a wonderful real estate agent.",
    name: "Ashley W.",
  },
  {
    quote:
      "Mia is WONDERFUL, and I recommend her to anyone needing an outstanding realtor. You will never find a person with a greater attitude and desire to do everything just right when finding your perfect home.",
    name: "Tracy Wunsch",
  },
];

/**
 * Areas Served — Mia's seven named markets (her supplied "Areas Served" list),
 * each linking to its market page. Plus the broader counties line.
 */
const AREAS_SERVED: ReadonlyArray<{ slug: string; label: string }> = [
  { slug: "fort-lauderdale", label: "Fort Lauderdale" },
  { slug: "pompano-beach", label: "Pompano Beach" },
  { slug: "coral-springs", label: "Coral Springs" },
  { slug: "boca-raton", label: "Boca Raton" },
  { slug: "lighthouse-point", label: "Lighthouse Point" },
  { slug: "deerfield-beach", label: "Deerfield Beach" },
  { slug: "parkland", label: "Parkland" },
];

const SCHEMA_AREA_SERVED = [
  "Fort Lauderdale",
  "Pompano Beach",
  "Coral Springs",
  "Boca Raton",
  "Lighthouse Point",
  "Deerfield Beach",
  "Parkland",
  "Broward County",
  "Palm Beach County",
];

const SCHEMA_KNOWS_ABOUT = [
  "Luxury homes",
  "Waterfront properties",
  "Lifestyle real estate",
  "Relocation",
  "Residential real estate investment",
  "Second-home purchases",
  "Buyer representation",
  "Seller representation",
  "Fort Lauderdale real estate",
  "Broward County real estate",
];

export default function AboutPage() {
  return (
    <>
      <PersonSchema />
      <RealEstateAgentSchema areaServed={SCHEMA_AREA_SERVED} knowsAbout={SCHEMA_KNOWS_ABOUT} />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about/" },
        ]}
      />

      <Hero
        eyebrow="About Mia Sanabria · LPT Realty"
        heading="South Florida luxury, waterfront, and lifestyle real estate."
        sub="A modern, relationship-focused practice for buyers, sellers, investors, and second-home owners across Broward County and beyond."
        ctaPrimary={{ href: "/contact/", label: "Begin a private conversation" }}
        ctaSecondary={{ href: "/markets/", label: "Explore the markets" }}
        background="image"
        imageSrc="/markets/las-olas-isles.jpg"
        imageAlt="Eastern Fort Lauderdale waterfront — Mia Sanabria, REALTOR® with LPT Realty"
      />

      {/* AEO answer block — a direct, quotable answer to who Mia is and whom she serves. */}
      <AnswerFirst
        question="Who is Mia Sanabria, and whom does she serve?"
        answer="Mia Sanabria is a South Florida real estate professional with LPT Realty, specializing in luxury homes, waterfront properties, and lifestyle-driven real estate throughout Broward County. She helps buyers, sellers, investors, and second-home owners navigate one of Florida's most competitive and desirable markets — from Fort Lauderdale waterfront estates and Intracoastal homes to communities in Coral Springs, Pompano Beach, Boca Raton, and beyond — with a modern, relationship-focused approach grounded in local expertise, strategic negotiation, and genuinely personalized service."
        relatedMarkets={["fort-lauderdale", "boca-raton", "pompano-beach"]}
        cta={{ href: "/contact/", label: "Begin a private conversation" }}
        background="cream-tint"
        emitFaqSchema={false}
      />

      {/* Mia's story — editorial treatment, framed headshot. */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1fr_1.45fr] lg:gap-20 lg:px-8">
          <div>
            <div className="relative isolate pb-3 pr-3">
              <div
                aria-hidden
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm bg-brass-100 -z-10"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-brass-300/60 shadow-luxury">
                <Image
                  src="/mia-profile.jpg"
                  alt="Mia Sanabria, REALTOR® with LPT Realty — South Florida luxury and waterfront real estate"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-brass-700">
              REALTOR® · LPT Realty
            </p>
            <p className="mt-1 text-sm text-navy-800/70">Fort Lauderdale, FL</p>
          </div>

          <div>
            <div className="luxury-divider mb-3">
              <span>South Florida is home</span>
            </div>
            <h2 className="font-display text-3xl text-navy-800 sm:text-4xl [text-wrap:balance]">
              South Florida isn&rsquo;t just where I work — it&rsquo;s home, lifestyle, community, and
              opportunity all in one.
            </h2>
            <div className="mt-7 space-y-6 text-[17px] leading-relaxed text-navy-800/85">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.7] first-letter:text-brass-400">
                As a South Florida real estate professional specializing in luxury homes, waterfront
                properties, and lifestyle-driven real estate throughout Broward County, I help buyers,
                sellers, investors, and second-home owners navigate one of the most competitive and
                desirable markets in Florida with clarity and confidence.
              </p>
              <p>
                From Fort Lauderdale waterfront estates and Intracoastal homes to communities in Coral
                Springs, Pompano Beach, Boca Raton, and beyond, I bring a modern, relationship-focused
                approach grounded in local expertise, strategic negotiation, and genuinely personalized
                service.
              </p>
              <p>
                Real estate today is about more than listing a home online. Buyers want lifestyle.
                Sellers want strategy. Clients want guidance they can trust. My goal is to deliver all
                three — and to make the process feel seamless from the very first conversation to closing
                day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How I Help Clients — horizontal editorial ledger. */}
      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading eyebrow="How I Help Clients" heading="Six ways the practice goes to work." />
          <div className="mt-12 border-t border-navy-800/10">
            {HOW_I_HELP.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 border-b border-navy-800/10 py-7 transition-colors hover:bg-brass-400/5 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <span className="font-display text-lg text-brass-700 sm:w-12">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg text-navy-800 sm:w-72 sm:flex-shrink-0">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-navy-800/80">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Approach + Backyard Buzz — navy intermission. */}
      <section className="bg-navy-800 py-20 text-cream-100 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <div className="luxury-divider mb-5 justify-center [&>span]:text-brass-300">
            <span>My Approach</span>
          </div>
          <h2 className="font-display text-3xl text-cream-50 sm:text-4xl [text-wrap:balance]">
            Relationships still matter in real estate.
          </h2>
          <p className="mt-7 text-[17px] leading-relaxed text-cream-200/90">
            Known for my communication, attention to detail, and client-first mindset, I believe
            relationships still matter in real estate. Technology and marketing are powerful tools — but
            honesty, responsiveness, and strong negotiation are the foundation of exceptional service.
          </p>
          <div aria-hidden className="mx-auto mt-10 h-px w-12 bg-brass-300" />
          <h3 className="mt-10 font-display text-2xl text-cream-50">Backyard Buzz</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-cream-200/85">
            I&rsquo;m also the creator of Backyard Buzz, a South Florida lifestyle and real estate
            platform where I share local insights, community highlights, design trends, and neighborhood
            features that keep buyers and sellers connected to this ever-evolving market.
          </p>
          <p className="mt-10 text-[17px] leading-relaxed text-cream-200/90">
            Whether you&rsquo;re searching for a luxury waterfront property, an investment opportunity, or
            preparing to sell for maximum value — I&rsquo;m here to help you move forward with confidence.
            South Florida real estate moves fast. Great service, local expertise, and genuine
            relationships never go out of style.
          </p>
        </div>
      </section>

      {/* Why Clients Choose Mia — twin-column linear index. */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading eyebrow="Why Clients Choose Mia" heading="Eight reasons clients stay, and refer." />
          <ul className="mx-auto mt-12 grid max-w-5xl gap-x-16 gap-y-8 sm:grid-cols-2">
            {WHY_MIA.map((item, i) => (
              <li key={i} className="border-l-2 border-brass-400/60 pl-6">
                <p className="font-display text-lg leading-snug text-navy-800">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What clients say — verbatim client notes, no Review schema. */}
      <section className="bg-cream-100 py-20 lg:py-28" aria-labelledby="client-notes-heading">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="In their words"
            heading={<span id="client-notes-heading">What clients say.</span>}
          />
          <div className="mt-12 space-y-10">
            {CLIENT_NOTES.map((t, i) => (
              <figure
                key={i}
                className="border-y border-brass-400/30 px-2 py-10 text-center sm:px-10"
              >
                <span aria-hidden className="font-display text-5xl leading-none text-brass-400">
                  &ldquo;
                </span>
                <blockquote className="mt-2 font-display text-xl italic leading-relaxed text-navy-800 [text-wrap:pretty] sm:text-2xl">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-brass-700">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-navy-800/55">
            Client comments shared with permission and reproduced as written.
          </p>
        </div>
      </section>

      {/* Areas Served — curated linked register + administrative service area. */}
      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Areas Served"
            heading="Where Mia represents buyers and sellers."
          />
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 sm:gap-x-5">
            {AREAS_SERVED.map((area, i) => (
              <li key={area.slug} className="flex items-center gap-x-3 sm:gap-x-5">
                <Link
                  href={`/markets/${area.slug}/`}
                  className="text-xs font-medium uppercase tracking-[0.25em] text-navy-800/90 transition-colors hover:text-brass-700"
                >
                  {area.label}
                </Link>
                {i < AREAS_SERVED.length - 1 ? (
                  <span aria-hidden className="font-light text-brass-400/50">
                    |
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed text-navy-800/75">
            Mia&rsquo;s practice centers on Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern
            Delray Beach, and extends across the markets above and communities throughout Broward and
            Palm Beach Counties.
          </p>
          <p className="mt-6">
            <Link
              href="/markets/"
              className="inline-flex items-center gap-2 font-display text-lg text-navy-800 transition-colors hover:text-brass-700"
            >
              Browse every market
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <CTAStrip
        heading="Begin a private conversation."
        sub="Every engagement starts with a confidential conversation about your timeline, the market, and the residence itself — from the first conversation to closing day."
      />
    </>
  );
}
