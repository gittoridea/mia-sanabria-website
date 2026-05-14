import type { ListingCard } from "@/lib/bridge-client";

const FMT_PRICE = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const FMT_SQFT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

type Props = { listing: ListingCard };

export function BridgeListingCard({ listing }: Props) {
  const {
    listPrice,
    beds,
    baths,
    sqft,
    city,
    zip,
    status,
    mediaUrl,
    remarks,
  } = listing;

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-navy-800/10 bg-white shadow-card">
      <div className="relative aspect-[4/3] bg-navy-800/5">
        {mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt={`${city} listing`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-navy-800/30">No photo available</span>
          </div>
        )}
        {status && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-navy-800 shadow-sm">
            {status}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-xl font-semibold text-navy-800">
          {listPrice !== null ? FMT_PRICE.format(listPrice) : "Price on request"}
        </p>

        <p className="mt-1 text-sm text-navy-800/70">
          {[city, zip].filter(Boolean).join(", ")}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-800/80">
          {beds !== null && (
            <span>
              <strong>{beds}</strong> bed{beds !== 1 ? "s" : ""}
            </span>
          )}
          {baths !== null && (
            <span>
              <strong>{baths}</strong> bath{baths !== 1 ? "s" : ""}
            </span>
          )}
          {sqft !== null && <span>{FMT_SQFT.format(sqft)} sq ft</span>}
        </div>

        {remarks && (
          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-navy-800/60">
            {remarks}
          </p>
        )}

        <div className="mt-4">
          <a
            href={`/contact/?source=listing&mlsid=${encodeURIComponent(listing.listingKey)}`}
            className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-navy-800/20 px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400"
          >
            Inquire About This Property
          </a>
        </div>
      </div>
    </article>
  );
}
