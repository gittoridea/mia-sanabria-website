import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Faq } from "@/components/Faq";
import { SectionHeading } from "@/components/SectionHeading";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { LocalBusinessSchema } from "@/components/schema/LocalBusinessSchema";
import { ContactPageSchema } from "@/components/schema/ContactPageSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export const metadata: Metadata = {
  title: "Contact Mia Sanabria — Private Consultation",
  description:
    "Begin a confidential conversation with Mia Sanabria — SE Florida REALTOR® with LPT Realty. Private consultations: Boca Raton, Fort Lauderdale, Palm Beach.",
  alternates: { canonical: `${SITE.url}/contact/` },
};

const CONTACT_FAQ = [
  {
    question: "How does Mia handle a private inquiry?",
    answer:
      "Inquiries received during business hours are reviewed and replied to during the same business day; after-hours messages are returned the following morning. For urgent matters, call (954) 540-0358 directly.",
  },
  {
    question: "Is the initial consultation confidential?",
    answer:
      "Yes — every initial conversation is treated as confidential. Private listing discussions, valuation conversations, and acquisition planning are handled discreetly and never appear on any marketing list.",
  },
  {
    question: "What information helps Mia prepare for a first conversation?",
    answer:
      "If you are buying: target market, architectural preference, timeline, and price range. If you are selling: property address, recent improvements, and a sense of timeline. If you're early in the process, no preparation is needed — the conversation itself is the first step.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PersonSchema />
      <RealEstateAgentSchema />
      <LocalBusinessSchema />
      <ContactPageSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact/" },
        ]}
      />

      <Hero
        eyebrow="Connect With Mia"
        heading="Begin a private conversation."
        sub="A confidential consultation with a REALTOR® who serves Fort Lauderdale, Broward, Miami-Dade, and Palm Beach. Reach out to discuss your real estate goals."
      />

      <section className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div className="space-y-10">
            <div>
              <div className="luxury-divider mb-3">
                <span>Direct Channels</span>
              </div>
              <h2 className="font-display text-3xl text-navy-800">
                Three private paths.
              </h2>
            </div>

            <ul className="space-y-7">
              <ContactRow
                Icon={Phone}
                heading="Call"
                value={MIA.contact.phone}
                href={`tel:${MIA.contact.phoneTel}`}
              />
              <ContactRow
                Icon={Mail}
                heading="Email"
                value={MIA.contact.email}
                href={`mailto:${MIA.contact.email}`}
              />
              <ContactRow
                Icon={MapPin}
                heading="Service Area"
                value={`${MIA.contact.serviceCore.city}, ${MIA.contact.serviceCore.region} ${MIA.contact.serviceCore.postalCode}`}
                hint="Representing Broward, Miami-Dade, and Palm Beach counties"
              />
              <ContactRow
                Icon={Clock}
                heading="Response Window"
                value="Same business day"
                hint="After-hours inquiries returned the following morning"
              />
            </ul>
          </div>

          <form
            method="post"
            action="/api/submit-contact"
            aria-describedby="contact-form-helper"
            className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card lg:p-10"
            noValidate
          >
            <h2 className="font-display text-2xl text-navy-800">Private Inquiry</h2>
            <p className="mt-2 text-sm text-navy-800/70">
              All fields marked with an asterisk are required. Inquiries are confidential.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="First Name" name="firstName" autoComplete="given-name" required />
              <Field label="Last Name" name="lastName" autoComplete="family-name" required />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
            <div className="mt-5">
              <label htmlFor="interest" className="block text-xs uppercase tracking-[0.25em] text-navy-800/70">
                Areas of Interest
              </label>
              <select
                id="interest"
                name="interest"
                className="mt-2 block w-full rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-sm text-navy-800 focus:border-brass-400 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Select…
                </option>
                <option>Buying — Boca Raton</option>
                <option>Buying — Fort Lauderdale</option>
                <option>Buying — Palm Beach</option>
                <option>Buying — Other Market</option>
                <option>Selling — Home Valuation</option>
                <option>Selling — Listing Conversation</option>
                <option>Investment / Private Listings</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div className="mt-5">
              <label
                htmlFor="message"
                className="block text-xs uppercase tracking-[0.25em] text-navy-800/70"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-2 block w-full rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-sm text-navy-800 focus:border-brass-400 focus:outline-none"
                placeholder="A few sentences about timeline, market, and what you're looking for."
              />
            </div>

            <button
              type="submit"
              aria-describedby="contact-form-helper"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium tracking-wide text-cream-50 transition-colors hover:bg-navy-700"
            >
              Send Private Inquiry
            </button>
            <p id="contact-form-helper" className="mt-3 text-xs text-navy-800/60">
              By submitting you agree to receive a private response from Mia or her team. We never share contact details.
            </p>
          </form>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow="Office Location"
            heading="Fort Lauderdale, Florida — by appointment."
            sub="Private consultations are scheduled at the office, on-site at the residence, or virtually as preferred."
          />
          <div className="mt-10 overflow-hidden rounded-sm border border-navy-800/10 bg-white shadow-card">
            <iframe
              title="Fort Lauderdale, Florida map"
              src="https://www.google.com/maps?q=Fort+Lauderdale,+FL+33305&hl=en&output=embed"
              width="1200"
              height="420"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-[420px] w-full"
            />
            <noscript>
              <a
                href="https://www.google.com/maps?q=Fort+Lauderdale,+FL+33305"
                className="block px-6 py-5 text-sm font-medium text-navy-800 underline decoration-brass-400 underline-offset-4"
              >
                Open the Fort Lauderdale map.
              </a>
            </noscript>
          </div>
        </div>
      </section>

      <Faq items={CONTACT_FAQ} />
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

function ContactRow({
  Icon,
  heading,
  value,
  hint,
  href,
}: {
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  heading: string;
  value: string;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4">
      <span className="mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy-800 text-brass-200">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-brass-500">{heading}</div>
        <div className="mt-1 font-display text-lg text-navy-800">{value}</div>
        {hint ? <div className="mt-1 text-sm text-navy-800/70">{hint}</div> : null}
      </div>
    </div>
  );
  return href ? (
    <li>
      <a href={href} className="block rounded-sm transition-colors hover:bg-cream-100">
        {inner}
      </a>
    </li>
  ) : (
    <li>{inner}</li>
  );
}
