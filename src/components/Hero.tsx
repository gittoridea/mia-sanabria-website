import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero({
  eyebrow,
  heading,
  sub,
  ctaPrimary,
  ctaSecondary,
  background = "navy",
}: {
  eyebrow?: string;
  heading: string;
  sub?: string;
  ctaPrimary?: { href: string; label: string };
  ctaSecondary?: { href: string; label: string };
  background?: "navy" | "cream" | "image";
}) {
  return (
    <section
      className={
        background === "navy"
          ? "relative bg-navy-800 text-cream-100"
          : background === "cream"
            ? "relative bg-cream-100 text-navy-800"
            : "relative bg-navy-800 text-cream-100"
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_50%_30%,rgba(184,155,94,0.18),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:px-8 lg:py-40">
        {eyebrow ? (
          <p className="font-display text-xs uppercase tracking-[0.4em] text-brass-300">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={
            background === "navy" || background === "image"
              ? "mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl [text-wrap:balance]"
              : "mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-800 sm:text-5xl lg:text-6xl [text-wrap:balance]"
          }
        >
          {heading}
        </h1>
        {sub ? (
          <p
            className={
              background === "navy" || background === "image"
                ? "mt-6 max-w-2xl text-lg text-cream-200/90 [text-wrap:pretty] sm:text-xl"
                : "mt-6 max-w-2xl text-lg text-navy-800/80 [text-wrap:pretty] sm:text-xl"
            }
          >
            {sub}
          </p>
        ) : null}
        {(ctaPrimary || ctaSecondary) && (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {ctaPrimary ? (
              <Link
                href={ctaPrimary.href}
                className="inline-flex items-center gap-2 rounded-full bg-brass-400 px-7 py-3 text-sm font-medium tracking-wide text-navy-900 transition-colors hover:bg-brass-300"
              >
                {ctaPrimary.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
            {ctaSecondary ? (
              <Link
                href={ctaSecondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-cream-200/40 px-7 py-3 text-sm font-medium tracking-wide text-cream-100 transition-colors hover:border-brass-300 hover:text-brass-300"
              >
                {ctaSecondary.label}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
