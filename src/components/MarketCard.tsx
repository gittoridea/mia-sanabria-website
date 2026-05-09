import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Market } from "@/lib/markets";

export function MarketCard({ market, priority = false }: { market: Market; priority?: boolean }) {
  // Cycle Addendum 2026-05-09 — `object-position` per-market override.
  //
  // The aspect-[4/5] portrait crop loses the most distinctive parts of some
  // landscape source images. Without per-market positioning, naturally-darker
  // imagery (Lighthouse Point sunset, Coral Ridge canopy shade) crops into the
  // dark-only zones and combines with the bottom-text gradient overlay to make
  // the card look like a flat dark block — the user-visible "missing image"
  // pattern reported on /markets/.
  //
  // Each market opts in to a non-center crop only when needed. Default is
  // object-center which preserves the cycle-1..8 framing for already-balanced
  // photography. The token system stays untouched (no new colors/fonts/effects).
  const objectPosition = market.cardObjectPosition ?? "object-center";

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
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${objectPosition}`}
          priority={priority}
        />
        {/*
         * Cycle Addendum 2026-05-09 — gradient redistribution.
         *
         * Cycle 1..8 used `from-navy-800/5 to-navy-800/65`: a smooth gradient
         * with the bottom 30% reaching 65% navy. On naturally-dark source
         * images (Lighthouse Point dusk, Coral Ridge canopy shade), this made
         * the entire card read as a dark navy block with text — the user
         * reported it as "missing image" on /markets/.
         *
         * v2 redistributes the same total tint into a 3-stop curve: the upper
         * 50% of the card is essentially clear (image breathes), the middle
         * is a soft 15% tint (image + brand wash), and the bottom 30% holds
         * the 85% navy floor required for cream-50 text contrast (≥ 4.5:1
         * over the worst-case bright-image background pixel). Brighter cards
         * keep their natural luminance; darker cards stop crushing into
         * black.
         */}
        <div
          aria-hidden
          data-marketcard-overlay="v2"
          className="absolute inset-0 bg-gradient-to-b from-navy-800/0 via-navy-800/15 to-navy-800/85"
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
