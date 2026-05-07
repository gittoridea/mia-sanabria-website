import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { Faq } from "@/components/Faq";
import { ServiceSchema } from "@/components/schema/ServiceSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home Valuation — Luxury Real Estate",
  description:
    "Receive a complimentary, bespoke valuation of your Southeast Florida luxury property. Sophisticated, confidential, and grounded in micro-market dynamics.",
  alternates: { canonical: `${SITE.url}/valuation/` },
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
      "An on-site walk-through (or virtual equivalent) combined with a deep micro-market comparable analysis, recent off-market transaction context, and a strategic positioning conversation.",
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
        name="Complimentary Luxury Property Valuation"
        description="Confidential, bespoke valuation of Southeast Florida luxury residences with strategic pricing analysis."
        serviceType="Real Estate Valuation"
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
        sub="Receive a complimentary, bespoke valuation of your luxury property based on current market dynamics and exclusive insights."
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <form
            method="post"
            action="/api/submit-valuation"
            aria-describedby="valuation-form-helper"
            className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card lg:p-10"
            noValidate
          >
            <h2 className="font-display text-2xl text-navy-800">Request Valuation</h2>
            <p className="mt-2 text-sm text-navy-800/70">
              All conversations are confidential. Most valuations are returned within five business days.
            </p>

            <fieldset className="mt-8">
              <legend className="font-display text-sm tracking-[0.25em] text-brass-500">
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
                    className="mt-2 block w-full rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-sm text-navy-800 focus:border-brass-400 focus:outline-none"
                    placeholder="Recent renovations, dock specifications, square footage, lot, view orientation, etc."
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-display text-sm tracking-[0.25em] text-brass-500">
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
              This is a confidential request. We never share your information.
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
            heading: "Off-market context",
            body: "Recent quietly-traded residences that public data feeds miss, sourced through Mia's brokerage network.",
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
        className="mt-2 block w-full rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-sm text-navy-800 focus:border-brass-400 focus:outline-none"
      />
    </div>
  );
}
