"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  BRIDGE_AVAILABLE,
  BRIDGE_DEMO_MODE,
  searchListings,
  type BridgeSearchQuery,
  type ListingCard,
} from "@/lib/bridge-client";
import { MIA_APPROVED_NEIGHBORHOODS } from "@/lib/mia";
import { BridgeListingCard } from "./BridgeListingCard";

const PRICE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "Any price" },
  { value: "500000", label: "$500K+" },
  { value: "600000", label: "$600K+" },
  { value: "750000", label: "$750K+" },
  { value: "1000000", label: "$1M+" },
  { value: "1500000", label: "$1.5M+" },
  { value: "2000000", label: "$2M+" },
  { value: "3000000", label: "$3M+" },
];

const BEDS_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "Any beds" },
  { value: "2", label: "2+ beds" },
  { value: "3", label: "3+ beds" },
  { value: "4", label: "4+ beds" },
  { value: "5", label: "5+ beds" },
];

const MLS_MATRIX_URL =
  "https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or=";

function MlsMatrixFallback({ reason }: { reason: "no-credentials" | "error" }) {
  return (
    <div>
      {reason === "no-credentials" && (
        <p className="mb-6 text-sm text-navy-800/70">
          Bridge listing search is being activated. Use the property search below
          in the meantime, or{" "}
          <a href="/contact/" className="underline decoration-brass-400 underline-offset-2">
            contact Mia directly
          </a>{" "}
          for a curated property shortlist.
        </p>
      )}
      {reason === "error" && (
        <p
          data-brand-exception="demo-warning"
          className="mb-6 text-sm text-amber-700"
        >
          Search is temporarily unavailable. Use the property search below or{" "}
          <a href="/contact/" className="underline decoration-brass-400 underline-offset-2">
            contact Mia
          </a>{" "}
          for assistance.
        </p>
      )}
      <div className="overflow-hidden rounded-sm border border-navy-800/10 bg-white shadow-card">
        <iframe
          title="Southeast Florida property search (Matrix MLS)"
          src={MLS_MATRIX_URL}
          className="min-h-[760px] w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[3/2] lg:min-h-[800px]"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <noscript>
          <a
            href={MLS_MATRIX_URL}
            className="block px-6 py-5 text-sm font-medium text-navy-800 underline decoration-brass-400 underline-offset-4"
          >
            Open the Southeast Florida property search.
          </a>
        </noscript>
      </div>
      <p className="mt-4 text-xs text-navy-800/70">
        Search not displaying?{" "}
        <a
          href={MLS_MATRIX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-brass-400 underline-offset-2"
        >
          Open in a new tab.
        </a>
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading listings">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-sm border border-navy-800/10 bg-white shadow-card">
          <div className="aspect-[4/3] bg-navy-800/8 rounded-t-sm" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-navy-800/8 rounded w-1/2" />
            <div className="h-4 bg-navy-800/8 rounded w-1/3" />
            <div className="h-4 bg-navy-800/8 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingAttribution() {
  return (
    <p className="mt-6 text-xs text-navy-800/60 leading-relaxed">
      Listing information is deemed reliable but not guaranteed. Data provided by Bridge Data Output via Southeast Florida MLS.
      All listings are subject to prior sale, change, or withdrawal. Mia Sanabria, REALTOR® with LPT Realty.
      Equal Housing Opportunity.
    </p>
  );
}

function DemoBanner() {
  return (
    <div
      data-brand-exception="demo-warning"
      className="mb-6 rounded-sm border border-amber-400/40 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"
    >
      <strong className="font-display text-base">Demo data — Southeast Florida MLS feed pending.</strong>
      <p className="mt-1">
        This staging page is connected to a Bridge Data Output test fixture so we can
        verify the integration end-to-end. Listings shown below are placeholder data —
        not real Southeast Florida inventory. Real listings will appear automatically
        once SEF MLS approves Mia&rsquo;s IDX feed on this Bridge account.
      </p>
    </div>
  );
}

export function BridgeSearch() {
  const [query, setQuery] = useState<BridgeSearchQuery>({});
  const [listings, setListings] = useState<ListingCard[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const inFlightRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      inFlightRef.current?.abort();
    };
  }, []);

  if (!BRIDGE_AVAILABLE) {
    return <MlsMatrixFallback reason="no-credentials" />;
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    // Cancel any in-flight request before starting a new one.
    inFlightRef.current?.abort();
    const controller = new AbortController();
    inFlightRef.current = controller;

    setLoading(true);
    setError(null);
    setSearched(true);

    const result = await searchListings({ ...query, page: 1 }, controller.signal);

    if (controller.signal.aborted) return;

    if (result.error === "search-unavailable") {
      setError("unavailable");
    } else if (result.error === "search-error") {
      setError("error");
    } else {
      setListings(result.listings);
      setTotal(result.total);
    }
    setLoading(false);
  }

  return (
    <div>
      <form
        onSubmit={handleSearch}
        aria-label="Search available listings"
        className="rounded-sm border border-navy-800/10 bg-white p-5 shadow-card lg:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="bridge-city" className="block text-xs font-medium text-navy-800/70 mb-1">
              City
            </label>
            <select
              id="bridge-city"
              value={query.city ?? ""}
              onChange={(e) =>
                setQuery((q) => ({ ...q, city: e.target.value || undefined }))
              }
              className="w-full rounded-sm border border-navy-800/20 bg-white px-3 py-2 text-sm text-navy-800 focus:border-brass-400 focus:outline-none"
            >
              <option value="">Any city</option>
              {MIA_APPROVED_NEIGHBORHOODS.map((n) => (
                <option key={n.slug} value={n.label}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bridge-min-price" className="block text-xs font-medium text-navy-800/70 mb-1">
              Min price
            </label>
            <select
              id="bridge-min-price"
              value={query.minPrice?.toString() ?? ""}
              onChange={(e) =>
                setQuery((q) => ({
                  ...q,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full rounded-sm border border-navy-800/20 bg-white px-3 py-2 text-sm text-navy-800 focus:border-brass-400 focus:outline-none"
            >
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bridge-beds" className="block text-xs font-medium text-navy-800/70 mb-1">
              Bedrooms
            </label>
            <select
              id="bridge-beds"
              value={query.beds?.toString() ?? ""}
              onChange={(e) =>
                setQuery((q) => ({
                  ...q,
                  beds: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full rounded-sm border border-navy-800/20 bg-white px-3 py-2 text-sm text-navy-800 focus:border-brass-400 focus:outline-none"
            >
              {BEDS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-5 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700 disabled:opacity-60"
            >
              <Search size={15} aria-hidden />
              {loading ? "Searching…" : "Search listings"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8">
        {loading && <LoadingSkeleton />}

        {!loading && error === "unavailable" && (
          <MlsMatrixFallback reason="no-credentials" />
        )}

        {!loading && error === "error" && (
          <MlsMatrixFallback reason="error" />
        )}

        {!loading && !error && searched && listings !== null && (
          <>
            {total !== null && (
              <p className="mb-4 text-sm text-navy-800/70">
                {total === 0
                  ? "No listings matched your search."
                  : `Showing ${listings.length} of ${total.toLocaleString()} available listing${total !== 1 ? "s" : ""}.`}
              </p>
            )}

            {listings.length === 0 ? (
              <div className="rounded-sm border border-navy-800/10 bg-white p-10 text-center">
                <p className="text-navy-800/70">
                  No listings matched your search. Try broadening your criteria or{" "}
                  <a href="/contact/" className="underline decoration-brass-400 underline-offset-2">
                    contact Mia
                  </a>{" "}
                  for a curated shortlist.
                </p>
              </div>
            ) : (
              <>
                {BRIDGE_DEMO_MODE && <DemoBanner />}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((l) => (
                    <BridgeListingCard
                      key={l.listingKey}
                      listing={l}
                      demoMode={BRIDGE_DEMO_MODE}
                    />
                  ))}
                </div>
                {!BRIDGE_DEMO_MODE && <ListingAttribution />}
              </>
            )}
          </>
        )}

        {!loading && !error && !searched && (
          <p className="text-sm text-navy-800/70">
            Select your criteria above and search to see available listings, or{" "}
            <a href="/contact/" className="underline decoration-brass-400 underline-offset-2">
              contact Mia
            </a>{" "}
            for a curated property shortlist based on your goals.
          </p>
        )}
      </div>
    </div>
  );
}
