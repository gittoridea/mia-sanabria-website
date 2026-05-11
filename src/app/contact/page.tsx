import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Faq } from "@/components/Faq";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { RealEstateAgentSchema } from "@/components/schema/RealEstateAgentSchema";
import { LocalBusinessSchema } from "@/components/schema/LocalBusinessSchema";
import { ContactPageSchema } from "@/components/schema/ContactPageSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { RelatedInsightsModule } from "@/components/insights/RelatedInsightsModule";
import { SITE } from "@/lib/site";
import { MIA } from "@/lib/mia";

export const metadata: Metadata = {
  title: "Contact Mia Sanabria — Private Consultation",
  description:
    "Begin a private conversation with Mia Sanabria — Fort Lauderdale REALTOR® with LPT Realty. Eastern Fort Lauderdale, Boca Raton, Delray Beach.",
  alternates: { canonical: `${SITE.url}/contact/` },
  openGraph: {
    title: "Contact Mia Sanabria — Private Consultation",
    description:
      "Begin a confidential conversation with Mia Sanabria — SE Florida REALTOR® with LPT Realty.",
    url: `${SITE.url}/contact/`,
    images: [{ url: `${SITE.url}/og-contact.jpg`, width: 1200, height: 630 }],
  },
};

const CONTACT_FAQ = [
  {
    question: "How does Mia handle a private inquiry?",
    answer:
      "Inquiries are reviewed in order of priority and returned personally. For time-sensitive matters, call (954) 540-0358 directly.",
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
        sub="A confidential consultation with a REALTOR® who serves Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach. Reach out to discuss your real estate goals."
        background="image"
        imageSrc="/services/contact.jpg"
        imageAlt="Private outdoor terrace at a Florida coastal mansion at twilight with teak chairs, brass lanterns, and ocean horizon"
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
                hint="Eastern Fort Lauderdale, Boca Raton, and Delray Beach"
              />
              <ContactRow
                Icon={Clock}
                heading="Response"
                value="By appointment"
                hint="Inquiries are reviewed in order of priority and returned personally"
              />
            </ul>
          </div>

          <form
            method="post"
            action={`mailto:${MIA.contact.email}?subject=${encodeURIComponent("Private Inquiry — Mia Sanabria")}`}
            encType="text/plain"
            aria-describedby="contact-form-helper"
            className="rounded-sm border border-navy-800/10 bg-cream-100 p-7 shadow-card lg:p-10"
            noValidate
          >
            <h2 className="font-display text-2xl text-navy-800">Private Inquiry</h2>
            <p className="mt-2 text-sm text-navy-800/70">
              All fields marked with an asterisk are required. Inquiries are confidential.
            </p>
            <p className="mt-3 rounded-sm border border-brass-400/30 bg-brass-400/5 px-3 py-2 text-xs text-navy-800/80">
              This form opens your default email app to send your details directly to Mia. Direct
              lead capture is being finalized. For an immediate response, call{" "}
              <a href={`tel:${MIA.contact.phoneTel}`} className="underline decoration-brass-400 underline-offset-2">
                {MIA.contact.phone}
              </a>{" "}
              or email{" "}
              <a href={`mailto:${MIA.contact.email}`} className="underline decoration-brass-400 underline-offset-2">
                {MIA.contact.email}
              </a>.
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
                className="mt-2 block w-full rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-base text-navy-800 focus:border-brass-400 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Select…
                </option>
                <option>Buying — Fort Lauderdale</option>
                <option>Buying — Boca Raton</option>
                <option>Buying — Delray Beach</option>
                <option>Selling — Home Valuation</option>
                <option>Selling — Listing Conversation</option>
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
                className="mt-2 block w-full rounded-sm border border-navy-800/15 bg-cream-50 px-4 py-3 text-base text-navy-800 focus:border-brass-400 focus:outline-none"
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
            <p id="contact-form-helper" className="mt-3 text-xs text-navy-800/80">
              By submitting, you agree to receive a private response from Mia or her team at the
              email or phone number you provide. Consent to receive calls or text messages is not a
              condition of any service. We never share your information. Standard message and data
              rates may apply.
            </p>
          </form>
        </div>
      </section>

      <Faq items={CONTACT_FAQ} />

      {/* Cycle 15 — contact-page editorial weaving. The two highest-leverage
          briefs to read before the first conversation: the buyer-brief
          framework and the dockage-diligence brief. */}
      <RelatedInsightsModule
        slugs={[
          "private-buyer-brief-defining-the-search",
          "fort-lauderdale-waterfront-buyer-guide",
          "preparing-waterfront-residence-private-market-conversations",
        ]}
        heading="Helpful before the first conversation"
        sub="Three briefs that make the first private conversation more productive — for buyers, for sellers, and for the in-between cases."
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
        <div className="text-xs uppercase tracking-[0.3em] text-brass-700">{heading}</div>
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
