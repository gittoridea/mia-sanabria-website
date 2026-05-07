import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { MIA } from "@/lib/mia";

export function CTAStrip({
  heading = "Begin a private conversation.",
  sub = "Every engagement starts with a confidential conversation about timeline, market, and the residence — not the transaction.",
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <section className="bg-navy-800 py-16 text-cream-50 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-8">
        <div>
          <h2 className="font-display text-3xl text-cream-50 sm:text-4xl">{heading}</h2>
          <p className="mt-4 max-w-2xl text-cream-200/90">{sub}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href="/contact/"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brass-400 px-6 py-3 text-sm font-medium text-navy-900 transition-colors hover:bg-brass-300"
          >
            Request Private Consultation
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href={`tel:${MIA.contact.phoneTel}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-cream-200/40 px-6 py-3 text-sm font-medium text-cream-100 transition-colors hover:border-brass-300 hover:text-brass-300"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {MIA.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
