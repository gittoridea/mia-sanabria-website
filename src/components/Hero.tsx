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
  const isCream = background === "cream";

  return (
    <section
      data-component="hero"
      data-variant={background}
      className={
        isCream
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
          {/* Cycle 8 hero readability rebuild (GPT-5.5 xhigh Option C — content card / scrim panel).
              Cycle 5/6/7 placed the H1 directly on uncontrolled image pixels with global gradients
              as the only readability mechanism. Three cycles audited PASS while users still saw
              illegible H1. v0.3.0 doctrine: image-over-text hero changes require a deterministic
              reading field, not operator assertions or token presence checks.
              The image overlays here are intentionally light (mood/20, content-scrim/45-20-10) —
              they preserve image presence around the panel. The H1 readability comes from the
              `data-hero-copy-panel` solid navy-900/95 box (computed contrast 14:1 over worst-case
              white) rather than from the overlay math. */}
          <div aria-hidden data-hero-overlay="mood" className="absolute inset-0 bg-navy-900/20" />
          <div
            aria-hidden
            data-hero-overlay="content-scrim"
            className="absolute inset-0 bg-gradient-to-r from-navy-900/45 via-navy-900/20 to-navy-900/10"
          />
          <div
            aria-hidden
            data-hero-overlay="cta-scrim"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-900/85 via-navy-900/45 to-transparent"
          />
        </>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(60%_60%_at_30%_40%,rgba(184,155,94,0.2),transparent_70%)]"
      />
      <div
        className={
          useImage
            ? "relative mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-16 sm:min-h-[620px] sm:py-24 lg:min-h-[680px] lg:px-8 lg:py-32"
            : "relative mx-auto max-w-7xl px-4 py-28 sm:py-32 lg:px-8 lg:py-40"
        }
      >
        {/* `min-w-0` is mandatory on flex children whose contents must wrap.
         * Without it, long-word display H1 (e.g. "WATERFRONT") forces the
         * wrapper to its intrinsic content width and the panel + H1 spill
         * past the viewport at 320/375 widths. Cycle 8 mobile-clipping fix.
         * `overflow-hidden` is the belt to `min-w-0`'s suspenders — guards
         * against any descendant whose content min-width still exceeds parent. */}
        <div className={useImage ? "w-full min-w-0 max-w-2xl" : "w-full"}>
          <div
            data-hero-copy-panel={useImage ? "true" : undefined}
            className={
              useImage
                ? "min-w-0 overflow-hidden rounded-sm border-l-2 border-brass-300 bg-navy-900/95 p-5 shadow-luxury sm:p-8 lg:p-12"
                : ""
            }
          >
            {eyebrow ? (
              <>
                <span
                  aria-hidden
                  className={
                    isCream
                      ? "block h-px w-10 bg-gradient-to-r from-transparent via-brass-700 to-transparent"
                      : "block h-px w-10 bg-gradient-to-r from-transparent via-brass-300 to-transparent"
                  }
                />
                <p
                  data-hero-eyebrow
                  className={
                    isCream
                      ? "mt-5 font-display text-[11px] uppercase tracking-[0.3em] text-brass-700 sm:text-xs sm:tracking-[0.4em]"
                      : "mt-5 font-display text-[11px] uppercase tracking-[0.3em] text-brass-300 sm:text-xs sm:tracking-[0.4em]"
                  }
                >
                  {eyebrow}
                </p>
              </>
            ) : null}
            <h1
              data-hero-heading
              className={
                isCream
                  ? "mt-5 w-full max-w-full font-display text-[20px] font-semibold leading-[1.2] tracking-normal text-navy-800 sm:text-[32px] sm:max-w-4xl sm:leading-[1.1] md:text-5xl lg:text-6xl break-words [overflow-wrap:anywhere]"
                  : useImage
                    ? "mt-5 w-full max-w-full font-display text-[18px] font-bold leading-[1.2] tracking-normal text-cream-50 sm:text-[28px] sm:max-w-xl sm:leading-[1.1] md:text-[38px] lg:text-5xl xl:text-6xl break-words [overflow-wrap:anywhere]"
                    : "mt-5 w-full max-w-full font-display text-[20px] font-semibold leading-[1.2] tracking-normal text-cream-50 sm:text-[32px] sm:max-w-4xl sm:leading-[1.1] md:text-5xl lg:text-6xl break-words [overflow-wrap:anywhere]"
              }
            >
              {heading}
            </h1>
            {sub ? (
              <p
                data-hero-sub
                className={
                  isCream
                    ? "mt-6 max-w-2xl text-lg text-navy-800/80 [text-wrap:pretty] sm:text-xl"
                    : useImage
                      ? "mt-6 max-w-xl text-lg text-cream-200/95 [text-wrap:pretty] sm:text-xl"
                      : "mt-6 max-w-2xl text-lg text-cream-200/90 [text-wrap:pretty] sm:text-xl"
                }
              >
                {sub}
              </p>
            ) : null}
          </div>
          {(ctaPrimary || ctaSecondary) && (
            <div
              data-hero-ctas
              className={useImage ? "mt-6 flex flex-wrap items-center gap-4" : "mt-10 flex flex-wrap items-center gap-4"}
            >
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
                    isCream
                      ? "inline-flex items-center gap-2 rounded-full border border-navy-800/30 bg-cream-50/80 px-7 py-3 text-sm font-medium tracking-wide text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
                      : useImage
                        ? "inline-flex items-center gap-2 rounded-full border border-cream-100/80 bg-navy-900/80 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
                        : "inline-flex items-center gap-2 rounded-full border border-cream-100/70 bg-navy-900/40 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
                  }
                >
                  {ctaSecondary.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
