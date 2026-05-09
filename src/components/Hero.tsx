import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero({
  eyebrow,
  heading,
  sub,
  ctaPrimary,
  ctaSecondary,
  background = "navy",
  imageSrc,
  imageAlt,
}: {
  eyebrow?: string;
  heading: string;
  sub?: string;
  ctaPrimary?: { href: string; label: string };
  ctaSecondary?: { href: string; label: string };
  background?: "navy" | "cream" | "image";
  imageSrc?: string;
  imageAlt?: string;
}) {
  const useImage = background === "image" && imageSrc;
  return (
    <section
      className={
        background === "cream"
          ? "relative overflow-hidden bg-cream-100 text-navy-800"
          : "relative overflow-hidden bg-navy-800 text-cream-100"
      }
    >
      {useImage ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Cycle-5 principal-authorized stronger overlay for H1 contrast: from 15/35/15 to 35/65/35.
              Brand-Contract update — overrides cycle-2 "brighter feel" directive per cycle-5 mission §3. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-navy-900/35 via-navy-900/65 to-navy-900/35"
          />
        </>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_50%_30%,rgba(184,155,94,0.18),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-28 sm:py-32 lg:px-8 lg:py-40">
        {eyebrow ? (
          <>
            <span
              aria-hidden
              className="block h-px w-10 bg-gradient-to-r from-transparent via-brass-300 to-transparent"
            />
            <p className="mt-5 font-display text-xs uppercase tracking-[0.4em] text-brass-300">
              {eyebrow}
            </p>
          </>
        ) : null}
        <h1
          className={
            background === "cream"
              ? "mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-800 sm:text-5xl lg:text-6xl [text-wrap:balance]"
              : useImage
                ? // Cycle-5 §3 principal-authorized H1-visibility: stronger weight + multi-stop shadow stack.
                  "mt-5 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl [text-wrap:balance] [text-shadow:0_4px_24px_rgba(15,42,68,0.95),0_2px_8px_rgba(0,0,0,0.85),0_1px_2px_rgba(0,0,0,0.6)]"
                : "mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl [text-wrap:balance]"
          }
        >
          {heading}
        </h1>
        {sub ? (
          <p
            className={
              background === "cream"
                ? "mt-6 max-w-2xl text-lg text-navy-800/80 [text-wrap:pretty] sm:text-xl"
                : useImage
                  ? "mt-6 max-w-2xl text-lg text-cream-200/95 [text-wrap:pretty] sm:text-xl [text-shadow:0_1px_12px_rgba(15,42,68,0.8)]"
                  : "mt-6 max-w-2xl text-lg text-cream-200/90 [text-wrap:pretty] sm:text-xl"
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
                className="inline-flex items-center gap-2 rounded-full bg-brass-400 px-8 py-3.5 text-sm font-semibold tracking-wide text-navy-900 transition-colors hover:bg-brass-300"
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
