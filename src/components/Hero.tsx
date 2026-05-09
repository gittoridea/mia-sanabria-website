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
      data-component="hero"
      data-variant={background}
      className={
        background === "cream"
          ? "relative overflow-hidden bg-cream-100 text-navy-800"
          : "relative overflow-hidden bg-navy-900 text-cream-100"
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
          {/* Cycle 7 hero readability rebuild. Three deterministic overlay layers
              replace the cycle-5/6 multi-stop text-shadow halo stack which produced
              a glowing illegible smear over bright tropical imagery.
              A: full-bleed mood gradient (preserves twilight band feel).
              B: left-edge content scrim where eyebrow/H1/sub live on desktop; on
                 mobile the scrim covers the full width because text is full-width.
              C: bottom CTA scrim — focused darkening behind the CTA row so brass
                 and outline buttons stay legible regardless of source-image brightness. */}
          <div
            aria-hidden
            data-hero-overlay="mood"
            className="absolute inset-0 bg-gradient-to-b from-navy-900/55 via-navy-900/40 to-navy-900/70"
          />
          <div
            aria-hidden
            data-hero-overlay="content-scrim"
            className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/40 sm:from-navy-900/95 sm:via-navy-900/70 sm:to-navy-900/20"
          />
          <div
            aria-hidden
            data-hero-overlay="cta-scrim"
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy-900/80 via-navy-900/40 to-transparent"
          />
        </>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(60%_60%_at_30%_40%,rgba(184,155,94,0.2),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-28 sm:py-32 lg:px-8 lg:py-40">
        {eyebrow ? (
          <>
            <span
              aria-hidden
              className="block h-px w-10 bg-gradient-to-r from-transparent via-brass-300 to-transparent"
            />
            <p
              data-hero-eyebrow
              className={
                background === "cream"
                  ? "mt-5 font-display text-xs uppercase tracking-[0.4em] text-brass-700"
                  : useImage
                    ? "mt-5 font-display text-xs uppercase tracking-[0.4em] text-brass-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]"
                    : "mt-5 font-display text-xs uppercase tracking-[0.4em] text-brass-300"
              }
            >
              {eyebrow}
            </p>
          </>
        ) : null}
        <h1
          data-hero-heading
          className={
            background === "cream"
              ? "mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-800 sm:text-5xl lg:text-6xl [text-wrap:balance]"
              : useImage
                ? // Cycle 7: tight drop-shadow, no blur halo. The content scrim does the
                  // contrast lifting; the shadow is AA insurance against bright pixels
                  // bleeding through the scrim's translucent right edge.
                  "mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl [text-wrap:balance] [text-shadow:0_2px_3px_rgba(0,0,0,0.8)]"
                : "mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl [text-wrap:balance]"
          }
        >
          {heading}
        </h1>
        {sub ? (
          <p
            data-hero-sub
            className={
              background === "cream"
                ? "mt-6 max-w-2xl text-lg text-navy-800/80 [text-wrap:pretty] sm:text-xl"
                : useImage
                  ? "mt-6 max-w-2xl text-lg text-cream-100 [text-wrap:pretty] sm:text-xl [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]"
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
                data-hero-cta="primary"
                className="inline-flex items-center gap-2 rounded-full bg-brass-400 px-8 py-3.5 text-sm font-semibold tracking-wide text-navy-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-200"
              >
                {ctaPrimary.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
            {ctaSecondary ? (
              <Link
                href={ctaSecondary.href}
                data-hero-cta="secondary"
                className={
                  background === "cream"
                    ? "inline-flex items-center gap-2 rounded-full border border-navy-800/30 bg-cream-50/80 px-7 py-3 text-sm font-medium tracking-wide text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
                    : "inline-flex items-center gap-2 rounded-full border border-cream-100/70 bg-navy-900/40 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
                }
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
