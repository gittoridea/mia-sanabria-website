"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  BRIDGE_DEMO_MODE,
  getBridgeRuntimeStatus,
  searchListings,
  type BridgeRuntimeMode,
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

function FixtureAttribution() {
  return (
    <p className="mt-6 text-xs text-navy-800/60 leading-relaxed">
      IDX/MLS disclosure: Listing data is deemed reliable but not guaranteed when sourced from Southeast Florida MLS via Bridge Data Output.
      The cards above are demo fixtures, not real Southeast Florida inventory. Mia Sanabria, REALTOR® with LPT Realty. Equal Housing Opportunity.
    </p>
  );
}

function DemoBanner({ mode }: { mode: BridgeRuntimeMode }) {
  const headline =
    mode === "fallback"
      ? "Demo data — Southeast Florida MLS feed pending."
      : "Demo data — Bridge test fixture connected.";
  const body =
    mode === "fallback"
      ? "Live property search will turn on automatically once SEF MLS approves Mia's IDX feed on Bridge. The cards below are placeholder demo data — not real Southeast Florida inventory."
      : "This staging page is connected to a Bridge Data Output test fixture so we can verify the integration end-to-end. Listings shown below are placeholder data — not real Southeast Florida inventory. Real listings will appear automatically once SEF MLS approves Mia's IDX feed on this Bridge account.";
  return (
    <div
      data-brand-exception="demo-warning"
      className="mb-6 rounded-sm border border-amber-400/40 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"
    >
      <strong className="font-display text-base">{headline}</strong>
      <p className="mt-1">{body}</p>
    </div>
  );
}

function ErrorPanel() {
  return (
    <div
      data-brand-exception="demo-warning"
      className="mt-6 rounded-sm border border-amber-400/40 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900"
    >
      <p className="font-display text-base">
        Search is temporarily unavailable.
      </p>
      <p className="mt-1">
        The Bridge listing service did not respond. Please try again in a moment, or{" "}
        <a href="/contact/" className="underline decoration-brass-400 underline-offset-2">
          contact Mia
        </a>{" "}
        for an active-inventory shortlist.
      </p>
      <p
        data-brand-exception="demo-warning"
        className="mt-3 text-xs text-amber-900/70"
      >
        IDX/MLS disclosure: Listing information is deemed reliable but not guaranteed when sourced from Southeast Florida MLS via Bridge Data Output.
      </p>
    </div>
  );
}

function parseInitialQueryFromUrl(): { initial: BridgeSearchQuery; hasMeaningful: boolean } {
  if (typeof window === "undefined") return { initial: {}, hasMeaningful: false };
  const params = new URLSearchParams(window.location.search);
  const initial: BridgeSearchQuery = {};
  let hasMeaningful = false;
  const city = params.get("city");
  if (city) {
    const labels = new Set<string>(MIA_APPROVED_NEIGHBORHOODS.map((n) => n.label));
    const bySlug = MIA_APPROVED_NEIGHBORHOODS.find((n) => n.slug === city);
    if (labels.has(city)) {
      initial.city = city;
      hasMeaningful = true;
    } else if (bySlug) {
      initial.city = bySlug.label;
      hasMeaningful = true;
    }
  }
  const minPrice = params.get("minPrice");
  if (minPrice) {
    const n = Number(minPrice);
    if (Number.isFinite(n) && n > 0) {
      initial.minPrice = n;
      hasMeaningful = true;
    }
  }
  const beds = params.get("beds");
  if (beds) {
    const n = Number(beds);
    if (Number.isFinite(n) && n >= 0) {
      initial.beds = n;
      hasMeaningful = true;
    }
  }
  return { initial, hasMeaningful };
}

export function BridgeSearch() {
  const status = getBridgeRuntimeStatus();
  const [query, setQuery] = useState<BridgeSearchQuery>({});
  const [listings, setListings] = useState<ListingCard[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [resultMode, setResultMode] = useState<BridgeRuntimeMode>(status.mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<"error" | null>(null);
  const [searched, setSearched] = useState(false);
  const inFlightRef = useRef<AbortController | null>(null);

  // Cycle 38 (2026-05-16): prefill from URL params (city/minPrice/beds/source) so
  // the homepage floating search card can deep-link into a pre-run search. If
  // any meaningful param is present, kick off the search automatically on mount.
  useEffect(() => {
    const { initial, hasMeaningful } = parseInitialQueryFromUrl();
    if (!hasMeaningful) return;
    setQuery(initial);
    inFlightRef.current?.abort();
    const controller = new AbortController();
    inFlightRef.current = controller;
    setLoading(true);
    setError(null);
    setSearched(true);
    searchListings({ ...initial, page: 1 }, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (result.error === "search-error") {
        setError("error");
        setResultMode("error");
      } else {
        setListings(result.listings);
        setTotal(result.total);
        setResultMode(result.mode);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    return () => {
      inFlightRef.current?.abort();
    };
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    inFlightRef.current?.abort();
    const controller = new AbortController();
    inFlightRef.current = controller;

    setLoading(true);
    setError(null);
    setSearched(true);

    const result = await searchListings({ ...query, page: 1 }, controller.signal);

    if (controller.signal.aborted) return;

    if (result.error === "search-error") {
      setError("error");
      setResultMode("error");
    } else {
      setListings(result.listings);
      setTotal(result.total);
      setResultMode(result.mode);
    }
    setLoading(false);
  }

  const showDemoBanner =
    resultMode === "demo" || resultMode === "fallback" || BRIDGE_DEMO_MODE;
  const showFixtureAttribution = resultMode === "fallback";
  const showLiveAttribution = resultMode === "live";

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

      <div
        className="mt-4 text-xs text-navy-800/60"
        data-bridge-runtime-mode={status.mode}
        data-bridge-source={status.source}
      >
        {status.mode === "fallback" && (
          <span>
            Live IDX feed pending — search currently shows demo fixtures while Bridge integration completes.
          </span>
        )}
        {status.mode === "demo" && (
          <span>Bridge demo dataset connected — listings shown are test fixtures.</span>
        )}
        {status.mode === "live" && (
          <span>Bridge live IDX feed connected — Southeast Florida MLS via Bridge Data Output.</span>
        )}
      </div>

      <div className="mt-8">
        {loading && <LoadingSkeleton />}

        {!loading && error === "error" && <ErrorPanel />}

        {!loading && !error && searched && listings !== null && (
          <>
            {showDemoBanner && <DemoBanner mode={resultMode} />}
            {total !== null && (
              <p className="mb-4 text-sm text-navy-800/70">
                {total === 0
                  ? "No listings matched your search."
                  : `Showing ${listings.length} of ${total.toLocaleString()} ${resultMode === "fallback" ? "demo fixture" : "available"} listing${total !== 1 ? "s" : ""}.`}
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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((l) => (
                    <BridgeListingCard
                      key={l.listingKey}
                      listing={l}
                      demoMode={resultMode !== "live"}
                    />
                  ))}
                </div>
                {showFixtureAttribution ? (
                  <FixtureAttribution />
                ) : showLiveAttribution ? (
                  <ListingAttribution />
                ) : (
                  <FixtureAttribution />
                )}
              </>
            )}
          </>
        )}

        {!loading && !error && !searched && (
          <>
            {status.mode === "fallback" && <DemoBanner mode="fallback" />}
            <p className="text-sm text-navy-800/70">
              Select your criteria above and search to see {status.mode === "fallback" ? "demo fixture" : "available"} listings, or{" "}
              <a href="/contact/" className="underline decoration-brass-400 underline-offset-2">
                contact Mia
              </a>{" "}
              for a curated property shortlist based on your goals.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
