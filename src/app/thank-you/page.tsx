import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { SITE } from "@/lib/site";

/**
 * Cycle 15 — Generic thank-you / acknowledgement route. Used after a private
 * inquiry has been initiated through any of the standard /contact/?intent=…
 * paths. Honesty contract: does NOT claim CRM capture, automated follow-up,
 * or guaranteed response time. Frames Mia's reply as a personal next step.
 */

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Your inquiry has been received. Mia will respond personally — confidentially — when she has the time to give it the attention it deserves.",
  alternates: { canonical: `${SITE.url}/thank-you/` },
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Thank You", href: "/thank-you/" },
        ]}
      />

      <Hero
        eyebrow="Inquiry Received"
        heading="Thank you. The conversation is private."
        sub="Mia will respond personally. The reply will arrive when she has the time to give it the attention it deserves."
      />

      <article className="bg-cream-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="luxury-divider mb-6">
            <span>What happens next</span>
          </div>
          <p className="text-[17px] leading-relaxed text-navy-800/85">
            Every inquiry Mia receives is read personally. Replies are drafted by Mia rather than
            an automated system, which means the timing reflects her schedule. The reply will
            reference your inquiry directly and propose the most useful first step, whether that
            is a phone conversation, a written response to a specific question, or a private
            property review.
          </p>
          <h3 className="mt-10 font-display text-2xl text-navy-800">
            While you wait.
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-800/85">
            The Insights library is the most useful place to spend the time. The twelve briefs are
            written for the same conversations Mia handles privately and will help frame the next
            discussion productively.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/insights/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Read the Insights library
            </Link>
            <Link
              href="/markets/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700"
            >
              Walk the markets
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
