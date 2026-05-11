import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { AnswerFirst } from "@/components/AnswerFirst";
import { ValueProps } from "@/components/ValueProps";
import { Faq } from "@/components/Faq";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { OfferCatalogSchema } from "@/components/schema/OfferCatalogSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RelatedInsightsModule } from "@/components/insights/RelatedInsightsModule";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export const metadata: Metadata = {
  title: "Home Valuation — Southeast Florida",
  description:
    "Receive a complimentary, tailored valuation of your Southeast Florida property. Careful, confidential, and grounded in micro-market dynamics.",
  alternates: { canonical: `${SITE.url}/valuation/` },
  openGraph: {
    title: "Home Valuation — Southeast Florida",
    description:
      "Receive a complimentary, tailored valuation of your Southeast Florida property. Careful, confidential, and grounded in micro-market dynamics.",
    url: `${SITE.url}/valuation/`,
    images: [{ url: `${SITE.url}/og-valuation.jpg`, width: 1200, height: 630 }],
  },
};

const VALUATION_FAQ = [
  {
    question: "Is the valuation actually complimentary?",
    answer:
      "Yes. Mia provides a private, complimentary valuation as part of evaluating whether to work together. There is no obligation to list.",
  },
  {
    question: "How is the valuation conducted?",
    answer:
      "An on-site walk-through (or virtual equivalent) combined with a deep micro-market comparable analysis, recent transaction context where available, and a strategic positioning conversation.",
  },
  {
    question: "Will my information be shared?",
    answer:
      "No. Valuation conversations are confidential and never appear on a marketing list, drip campaign, or third-party data feed.",
  },
  {
    question: "What if I'm not ready to sell?",
    answer:
      "Many valuations are part of long-horizon planning — estate strategy, refinance timing, portfolio analysis. The conversation is useful even when no sale is imminent.",
  },
];

export default function ValuationPage() {
  return (
    <>
      <ServiceSchema
        name="Complimentary Property Valuation"
        description="Confidential, tailored valuation of Southeast Florida residences with strategic pricing analysis."
        serviceType="Real Estate Valuation"
      />
      <OfferCatalogSchema
        catalogName="Complimentary Property Valuation"
        items={[
          {
            name: "On-Site Property Brief",
            description:
              "walk-through (or virtual equivalent) assessing condition, finishes, and unique features.",
          },
          {
            name: "Comparative Market Analysis",
            description:
              "recent transaction context, micro-market dynamics, strategic positioning conversation.",
          },
          {
            name: "Strategic Pricing Recommendation",
            description: "written valuation deliverable with positioning rationale.",
          },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Home Valuation", href: "/valuation/" },
        ]}
      />

      <Hero
        eyebrow="Home Valuation"
        heading="Discover your home's value."
        sub="Receive a complimentary, tailored valuation of your Southeast Florida property based on current market dynamics and recent comparable activity."
        background="image"
        imageSrc="/services/valuation.jpg"
        imageAlt="Panoramic Florida deepwater canal vista with moored yachts and a contemporary waterfront mansion at golden hour"
      />

      <AnswerFirst
        question="What should a luxury waterfront valuation consider beyond automated estimates?"
        answer="Automated valuation models miss the variables that decide a luxury waterfront price. A serious valuation accounts for dock specifics — length, water depth, fixed-bridge clearance, route to the inlet, and any yacht-capacity history — alongside lot orientation to prevailing winds, view corridor, hurricane shutters, generator coverage, flood-zone elevation, and HOA or country-club access. It cross-checks recent comparable sales on the same street, building, or block; reviews architectural era and renovation depth; and weighs the residence's scarcity within its sub-market. Mia delivers a confidential walk-through (or virtual equivalent) plus a written strategic positioning recommendation — useful for estate planning, refinancing, or a future sale."
        relatedMarkets={["fort-lauderdale", "boca-raton", "lighthouse-point"]}
        cta={{ href: "/contact/", label: "Talk through your property" }}
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <form
            method="post"
            action={`mailto:${MIA.contact.email}?subject=${encodeURIComponent("Valuation Request — Mia Sanabria")}`}
            encType="text/plain"
            aria-describedby="valuation-form-helper"
            className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card lg:p-10"
            noValidate
          >
            <h2 className="font-display text-2xl text-navy-800">Request Valuation</h2>
            <p className="mt-2 text-sm text-navy-800/70">
              All conversations are confidential. Valuations are returned after a private walk-through (or virtual equivalent) and a comparable-sales pull tuned to the residence.
            </p>
            <p className="mt-3 rounded-sm border border-brass-400/30 bg-brass-400/5 px-3 py-2 text-xs text-navy-800/80">
              This form opens your default email app to send your valuation details directly to
              Mia. Direct lead capture is being finalized. For an immediate response, call{" "}
              <a href={`tel:${MIA.contact.phoneTel}`} className="underline decoration-brass-400 underline-offset-2">
                {MIA.contact.phone}
              </a>{" "}
              or email{" "}
              <a href={`mailto:${MIA.contact.email}`} className="underline decoration-brass-400 underline-offset-2">
                {MIA.contact.email}
              </a>.
            </p>

            <fieldset className="mt-8">
              <legend className="font-display text-sm tracking-[0.25em] text-brass-700">
                THE PROPERTY
              </legend>
              <div className="mt-4 grid gap-5">
                <Field label="Property Address" name="address" autoComplete="street-address" required />
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="City" name="city" autoComplete="address-level2" required />
                  <Field label="Bedrooms" name="bedrooms" type="number" inputMode="numeric" />
                  <Field label="Bathrooms" name="bathrooms" type="number" inputMode="numeric" />
                </div>
                <div>
                  <label
                    htmlFor="upgrades"
                    className="block text-xs uppercase tracking-[0.25em] text-navy-800/70"
                  >
                    Additional Details or Upgrades
                  </label>
                  <textarea
                    id="upgrades"
                    name="upgrades"
                    rows={4}
                    className="mt-2 block w-full rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-base text-navy-800 focus:border-brass-400 focus:outline-none"
                    placeholder="Recent renovations, dock specifications, square footage, lot, view orientation, etc."
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-display text-sm tracking-[0.25em] text-brass-700">
                YOU
              </legend>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <Field label="First Name" name="firstName" autoComplete="given-name" required />
                <Field label="Last Name" name="lastName" autoComplete="family-name" required />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                />
                <Field label="Phone Number" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
              </div>
            </fieldset>

            <button
              type="submit"
              aria-describedby="valuation-form-helper"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium tracking-wide text-cream-50 transition-colors hover:bg-navy-700"
            >
              Request Valuation
            </button>
            <p id="valuation-form-helper" className="mt-3 text-xs text-navy-800/60">
              This is a confidential request. By submitting, you agree to receive a private
              response from Mia or her team at the email or phone number provided. Consent to
              receive calls or text messages is not a condition of any service. We never share your
              information. Standard message and data rates may apply.
            </p>
          </form>
        </div>
      </section>

      <ValueProps
        eyebrow="What the Valuation Includes"
        heading="Sophisticated analysis, plain English."
        items={[
          {
            heading: "Micro-market comparables",
            body: "A pulled set of recent comparable transactions in your specific market — not a regional approximation.",
          },
          {
            heading: "Brokerage relationship context",
            body: "Where available, brokerage relationships add color from recent comparable sales that public data feeds reflect with a lag — context, not a substitute for licensed appraisal.",
          },
          {
            heading: "Strategic positioning",
            body: "Pricing recommendations grounded in the buyer pool the residence is actually competing for.",
          },
          {
            heading: "Velocity analysis",
            body: "Expected days-on-market, optimal listing window, and any seasonal considerations for your micro-market.",
          },
        ]}
      />

      <Faq items={VALUATION_FAQ} />

      {/* Cycle 15 — valuation-focused editorial weaving. The two briefs that
          frame why the valuation work has to happen at the parcel level. */}
      <RelatedInsightsModule
        slugs={[
          "why-automated-valuations-miss-luxury-waterfront",
          "positioning-luxury-waterfront-eastern-fort-lauderdale",
          "preparing-waterfront-residence-private-market-conversations",
        ]}
        heading="Before the valuation"
        sub="Three briefs on why luxury waterfront pricing requires parcel-level work — and what the conversation about positioning looks like once the price is set."
        background="cream"
      />
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  inputMode,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "numeric";
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-[0.25em] text-navy-800/70">
        {label} {required ? <span aria-hidden>*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        aria-required={required}
        className="mt-2 block w-full rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-base text-navy-800 focus:border-brass-400 focus:outline-none"
      />
    </div>
  );
}
