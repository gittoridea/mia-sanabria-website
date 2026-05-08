import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found · Mia Sanabria, REALTOR®" },
  description:
    "The page you requested isn't on this website. Return home, walk the markets, or begin a private conversation with Mia Sanabria.",
  alternates: { canonical: `${SITE.url}/404/` },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function NotFound() {
  return (
    <section className="bg-navy-800 py-32 text-cream-100 lg:py-44">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-brass-300">
          404 · Not Found
        </p>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl">
          The residence you are looking for has changed addresses.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-cream-200/90">
          The page you requested doesn't exist or has been moved. Return home, walk the markets,
          or begin a private conversation directly.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brass-400 px-7 py-3 text-sm font-medium tracking-wide text-navy-900 transition-colors hover:bg-brass-300"
          >
            Return Home
          </Link>
          <Link
            href="/markets/"
            className="inline-flex items-center gap-2 rounded-full border border-cream-200/40 px-7 py-3 text-sm font-medium tracking-wide text-cream-100 transition-colors hover:border-brass-300 hover:text-brass-300"
          >
            Explore Markets
          </Link>
        </div>
      </div>
    </section>
  );
}
