export type ValueProp = {
  heading: string;
  body: string;
};

export function ValueProps({
  eyebrow,
  heading,
  items,
  background = "cream",
}: {
  eyebrow?: string;
  heading?: string;
  items: ReadonlyArray<ValueProp>;
  background?: "cream" | "navy";
}) {
  const isNavy = background === "navy";
  return (
    <section
      className={
        isNavy ? "bg-navy-800 text-cream-100 py-20 lg:py-28" : "bg-cream-50 py-20 lg:py-28"
      }
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {eyebrow ? (
          <div className={`luxury-divider mb-6 ${isNavy ? "[&>span]:text-brass-300" : ""}`}>
            <span>{eyebrow}</span>
          </div>
        ) : null}
        {heading ? (
          <h2 className={`max-w-3xl font-display text-3xl sm:text-4xl ${isNavy ? "text-cream-50" : "text-navy-800"}`}>
            {heading}
          </h2>
        ) : null}
        <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={i}>
              <div className={`font-display text-sm tracking-[0.3em] ${isNavy ? "text-brass-300" : "text-brass-700"}`}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className={`mt-3 font-display text-xl ${isNavy ? "text-cream-50" : "text-navy-800"}`}>
                {item.heading}
              </h3>
              <p className={`mt-3 text-[15px] leading-relaxed ${isNavy ? "text-cream-200/90" : "text-navy-800/80"}`}>
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
