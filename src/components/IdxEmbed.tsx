export function IdxEmbed() {
  const searchUrl = "https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or=";

  return (
    <section
      id="property-search"
      aria-labelledby="idx-heading"
      className="bg-cream-50 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="luxury-divider mb-5">
          <span>Property Search</span>
        </div>
        <h2 id="idx-heading" className="font-display text-3xl text-navy-800 sm:text-4xl">
          Search available Southeast Florida listings.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-navy-800/80">
          Use the embedded search as a starting point, then contact Mia for a property-specific review,
          current comparable sales, and next-step guidance.
        </p>
        <div className="mt-10 overflow-hidden rounded-sm border border-navy-800/10 bg-white shadow-card">
          <iframe
            title="Southeast Florida property search (Matrix MLS)"
            src={searchUrl}
            className="min-h-[760px] w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[3/2] lg:min-h-[800px]"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <noscript>
            <a
              href={searchUrl}
              className="block px-6 py-5 text-sm font-medium text-navy-800 underline decoration-brass-400 underline-offset-4"
            >
              Open the Southeast Florida property search.
            </a>
          </noscript>
        </div>

        <p className="mt-4 text-sm text-navy-800/70">
          Search not displaying?{" "}
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-brass-400 underline-offset-2"
          >
            Open the property search in a new tab
          </a>
          .
        </p>

        <p className="mt-2 text-xs text-navy-800/60">
          Listing data deemed reliable but not guaranteed. Search provided by Matrix MLS;
          data reflects participating Southeast Florida brokerages.
        </p>

        <div className="mt-8 rounded-sm border border-brass-400/25 bg-brass-400/5 p-5 lg:p-6">
          <p className="font-display text-lg text-navy-800">
            Found a residence worth a closer look?
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-navy-800/80">
            Note the MLS number and begin a private conversation. Mia will pull current comparable
            sales, ownership history where available, and dock or HOA specifics relevant to the
            residence.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href="/contact/?source=idx-search"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-700"
            >
              Begin a Private Inquiry
            </a>
            <a
              href="/valuation/?source=idx-search"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-navy-800/20 px-5 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:border-brass-400"
            >
              Request a Valuation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
