import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { CTAStrip } from "@/components/CTAStrip";
import { Faq } from "@/components/Faq";
import { SectionHeading } from "@/components/SectionHeading";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export const metadata: Metadata = {
  title: "About Mia Sanabria — Southeast Florida Luxury Realtor",
  description:
    "Mia Sanabria is a Fort Lauderdale–based luxury real estate concierge representing buyers, sellers, and investors across Boca Raton, Fort Lauderdale, and Palm Beach with discretion, rigor, and white-glove care.",
  alternates: { canonical: `${SITE.url}/about/` },
};

const ABOUT_FAQ = [
  {
    question: "How long has Mia been representing clients in Southeast Florida?",
    answer:
      "Mia has practiced real estate in Southeast Florida since 2017, building a luxury concierge practice grounded in long relationships rather than transaction count.",
  },
  {
    question: "Which markets does Mia know most deeply?",
    answer:
      "Fort Lauderdale's Las Olas Isles, Harbor Beach, Victoria Park, and Coral Ridge are her home turf. She represents actively across Boca Raton, Palm Beach, Delray Beach, and Lighthouse Point.",
  },
  {
    question: "What types of representation does Mia accept?",
    answer:
      "Buyer representation, seller representation, investment-portfolio acquisition, and selective relocation work. Engagement is invitation-style — a deliberately small client list per quarter.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PersonSchema />
      <RealEstateAgentSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about/" },
        ]}
      />

      <Hero
        eyebrow="About Mia"
        heading="South Florida's real estate concierge — a practice built on relationships, not transactions."
        sub={MIA.voice.anchorLine}
        background="navy"
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:px-8">
          <div>
            <div
              aria-hidden
              className="aspect-[4/5] w-full rounded-sm border border-navy-800/10 bg-cover bg-center shadow-card"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(15,42,68,0.05) 0%, rgba(15,42,68,0.55) 100%), url(/mia-headshot.jpg)",
              }}
            />
            <p className="mt-5 text-xs uppercase tracking-[0.3em] text-brass-500">
              {MIA.title} · {MIA.brokerage.display}
            </p>
            <p className="mt-1 text-sm text-navy-800/70">
              {MIA.contact.serviceCore.city}, {MIA.contact.serviceCore.region}
            </p>
          </div>

          <div className="space-y-7 text-[17px] leading-relaxed text-navy-800/85">
            <div className="luxury-divider mb-3">
              <span>{MIA.voice.positioning}</span>
            </div>
            <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
              Concierge by design, not by claim.
            </h2>
            <p>
              Mia Sanabria represents buyers, sellers, and investors across Southeast Florida's most
              coveted coastal markets. Her practice is structured around a deliberately small client
              list each quarter — every engagement receives concierge attention, direct access, and
              full presence at every showing, every consultation, every closing table.
            </p>
            <p>
              Her work centers on the residence as a primary cultural and financial object. Every
              listing is positioned with editorial photography, copywriting, and global distribution.
              Every acquisition begins with a private conversation about timeline, architectural
              preference, and lifestyle — long before the first showing is scheduled.
            </p>
            <p>
              She is fluent in Fort Lauderdale's deepwater Las Olas Isles geography, Boca Raton's
              country-club estate market, Palm Beach's landmark Estate Section, and the off-market
              networks that quietly move the most desirable residences. The Hispanic community of
              Southeast Florida has been part of her network since she began.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Service Philosophy"
            heading="Three commitments, every engagement."
          />
          <ul className="mt-12 grid gap-12 lg:grid-cols-3">
            <li>
              <div className="font-display text-xs tracking-[0.3em] text-brass-500">01 · DISCRETION</div>
              <h3 className="mt-3 font-display text-xl text-navy-800">
                Privacy as a default, not an upgrade.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-navy-800/80">
                Off-market networks, NDA-style consultations, photography that respects the
                residence, and a client roster that never appears on a marketing list. Discretion is
                the standard — not a service tier.
              </p>
            </li>
            <li>
              <div className="font-display text-xs tracking-[0.3em] text-brass-500">02 · RIGOR</div>
              <h3 className="mt-3 font-display text-xl text-navy-800">
                Title, due diligence, structure, financing.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-navy-800/80">
                Luxury transactions reward precision. Every closing is scaffolded by experienced
                title, escrow, financing, and tax-structuring partners — and Mia stays present
                across every milestone.
              </p>
            </li>
            <li>
              <div className="font-display text-xs tracking-[0.3em] text-brass-500">03 · RELATIONSHIPS</div>
              <h3 className="mt-3 font-display text-xl text-navy-800">
                The residence after the transaction.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-navy-800/80">
                The most-quoted line in Mia's practice — &ldquo;Building Relationships for Life.&rdquo; A meaningful share of new
                business arrives by introduction from former clients, neighbors, and partners.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-navy-800 py-16 text-cream-100 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="luxury-divider mb-5 [&>span]:text-brass-300">
            <span>Credentials</span>
          </div>
          <dl className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-brass-300">Title</dt>
              <dd className="mt-2 font-display text-xl">{MIA.title}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-brass-300">Brokerage</dt>
              <dd className="mt-2 font-display text-xl">{MIA.brokerage.display}</dd>
            </div>
            {MIA.experience.since ? (
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-brass-300">Practicing since</dt>
                <dd className="mt-2 font-display text-xl">{MIA.experience.since}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-brass-300">Service area</dt>
              <dd className="mt-2 font-display text-base">
                Broward · Miami-Dade · Palm Beach
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Faq items={ABOUT_FAQ} />

      <CTAStrip
        heading="Begin a private conversation."
        sub="Every engagement starts with a confidential consultation — preferences, market, timeline, and the residence itself."
      />
    </>
  );
}
