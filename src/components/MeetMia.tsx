import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MIA } from "@/lib/mia";

export function MeetMia() {
  return (
    <section className="bg-cream-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-navy-800/10 shadow-card">
            <Image
              src="/mia-headshot.jpg"
              alt="Mia Sanabria, REALTOR® with LPT Realty"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top"
            />
          </div>

          <div>
            <span
              aria-hidden
              className="block h-px w-10 bg-gradient-to-r from-transparent via-brass-300 to-transparent"
            />
            <p className="mt-5 font-display text-xs uppercase tracking-[0.4em] text-brass-700">
              Meet Mia
            </p>
            <h2 className="mt-5 font-display text-3xl text-navy-800 sm:text-4xl lg:text-5xl">
              Personal representation in Southeast Florida&apos;s most coveted coastal markets.
            </h2>
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-navy-800/80">
              <p>
                Mia Sanabria is a Fort Lauderdale REALTOR® with LPT Realty representing buyers and
                sellers across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray
                Beach. Each engagement begins with a private conversation about timing, criteria,
                and the residence itself.
              </p>
              <p>
                Her practice is built on long relationships, current-market evidence, and the
                discretion luxury transactions require.{" "}
                <em>{MIA.voice.anchorLine}</em>
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brass-400 px-6 py-3 text-sm font-semibold tracking-wide text-navy-900 transition-colors hover:bg-brass-300"
              >
                Schedule a Conversation
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/about/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/20 px-6 py-3 text-sm font-medium tracking-wide text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700"
              >
                About Mia
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
