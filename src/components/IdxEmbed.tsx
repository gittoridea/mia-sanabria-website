export function IdxEmbed() {
  return (
    <section
      aria-labelledby="idx-heading"
      className="bg-cream-50 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="luxury-divider mb-5">
          <span>Live MLS Inventory</span>
        </div>
        <h2 id="idx-heading" className="font-display text-3xl text-navy-800 sm:text-4xl">
          Exclusive listings, refreshed in real time.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-navy-800/80">
          Search Southeast Florida's most desirable inventory through the regional MLS.
          For off-market and pre-market opportunities, the conversation happens privately.
        </p>
        <div className="mt-10 overflow-hidden rounded-sm border border-navy-800/10 bg-white shadow-card">
          <iframe
            title="Southeast Florida MLS Inventory"
            src="https://sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or="
            className="h-[800px] w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}
