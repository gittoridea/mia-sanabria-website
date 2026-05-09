import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Market } from "@/lib/markets";

export function MarketCard({ market, priority = false }: { market: Market; priority?: boolean }) {
  return (
    <Link
      href={`/markets/${market.slug}/`}
      className="group relative block overflow-hidden rounded-sm border border-navy-800/10 bg-cream-100 shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-luxury"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-navy-700">
        <Image
          src={market.heroImage}
          alt={`${market.name} luxury real estate`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={priority}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-navy-800/5 to-navy-800/65"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
        <h3 className="font-display text-2xl text-cream-50 [text-wrap:balance]">
          {market.name}
        </h3>
        <p className="mt-2 text-sm text-cream-200/95 [text-wrap:pretty]">{market.tagline}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream-50">
          Explore Area
          <ArrowRight className="h-3 w-3" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
