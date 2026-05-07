export function IdxEmbed() {
  const searchUrl = "https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or=";

  return (
    <section
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
            title="Southeast Florida property search"
            src={searchUrl}
            width="1200"
            height="900"
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
      </div>
    </section>
  );
}
