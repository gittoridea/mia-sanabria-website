import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Market } from "@/lib/markets";

export function MarketCard({ market }: { market: Market }) {
  return (
    <Link
      href={`/markets/${market.slug}/`}
      className="group relative block overflow-hidden rounded-sm border border-navy-800/10 bg-cream-100 shadow-card transition-shadow hover:shadow-luxury"
    >
      <div className="aspect-[4/5] w-full overflow-hidden bg-navy-700">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(15,42,68,0.05) 0%, rgba(15,42,68,0.65) 100%), url(${market.heroImage})`,
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
        <h3 className="font-display text-2xl tracking-[0.05em] text-cream-50">
          {market.name}
        </h3>
        <p className="mt-2 text-sm text-cream-200/90">{market.tagline}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brass-300">
          Explore Area
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
