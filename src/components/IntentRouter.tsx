import Link from "next/link";
import { Compass, Home, BadgeDollarSign } from "lucide-react";

const INTENTS = [
  {
    href: "/valuation/",
    label: "I may sell",
    blurb: "Request a current, property-specific valuation conversation.",
    Icon: BadgeDollarSign,
  },
  {
    href: "/buyers/",
    label: "I am buying",
    blurb: "Clarify markets, property criteria, timing, and next steps.",
    Icon: Home,
  },
  {
    href: "/markets/",
    label: "I am researching",
    blurb: "Compare Fort Lauderdale and South Florida market guides.",
    Icon: Compass,
  },
] as const;

export function IntentRouter() {
  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="luxury-divider mb-6">
          <span>Where would you like to begin?</span>
        </div>
        <h2 className="max-w-3xl font-display text-3xl text-navy-800 sm:text-4xl">
          Three intents. Three private paths. One REALTOR®.
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {INTENTS.map(({ href, label, blurb, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col gap-5 rounded-sm border border-navy-800/10 bg-cream-50 p-7 shadow-soft transition-shadow hover:shadow-card"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 text-brass-200">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl text-navy-800">{label}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-navy-800/80">
                    {blurb}
                  </p>
                </div>
                <span className="mt-auto text-xs uppercase tracking-[0.3em] text-brass-700 group-hover:text-brass-800">
                  Begin →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
