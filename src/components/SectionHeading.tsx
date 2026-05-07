export function SectionHeading({
  eyebrow,
  heading,
  sub,
  align = "left",
  inverted = false,
}: {
  eyebrow?: string;
  heading: string;
  sub?: string;
  align?: "left" | "center";
  inverted?: boolean;
}) {
  const center = align === "center";
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow ? (
        <div
          className={`luxury-divider mb-5 ${center ? "justify-center" : ""} ${inverted ? "[&>span]:text-brass-300" : ""}`}
        >
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2
        className={`font-display text-3xl sm:text-4xl ${inverted ? "text-cream-50" : "text-navy-800"} ${center ? "mx-auto max-w-3xl" : "max-w-3xl"}`}
      >
        {heading}
      </h2>
      {sub ? (
        <p
          className={`mt-4 text-[15px] leading-relaxed ${inverted ? "text-cream-200/90" : "text-navy-800/80"} ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}
