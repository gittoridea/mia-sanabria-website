import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
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
  /**
   * Heading content — string or ReactNode. ReactNode supports explicit
   * line breaks (e.g., two-line H1 on the homepage per Cycle 24 Mia-decision:
   * `<>South Florida Lifestyle<br />Home Search</>`). String inputs may
   * activate the Cycle-9 wbr-break path below.
   */
  heading: string | ReactNode;
  sub?: string;
  ctaPrimary?: { href: string; label: string };
  ctaSecondary?: { href: string; label: string };
  background?: "navy" | "cream" | "image";
  imageSrc?: string;
  imageAlt?: string;
}) {
  const useImage = background === "image" && imageSrc;
  const isCream = background === "cream";

  // Cycle 9 — GPT-5.5 xhigh "C-refined" decision: insert <wbr> soft-break hints into the
  // locked Card-3 homepage heading so 320×568 / 375×812 viewports can wrap inside the
  // proper-noun cluster ("LAUDERDALE", "BOCA RATON", "DELRAY BEACH") that previously
  // forced right-edge clipping in Cycle 8 deploy. The string match is exact — any future
  // copy edit on `/` reverts this branch and the bounding-box audit must re-fire.
  // Cycle 24 — heading prop now accepts ReactNode; the wbr-break only fires for the
  // legacy exact-string match. Two-line ReactNode headings (e.g., homepage) fall through.
  const homeHeroHeading =
    "Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach.";
  const headingContent =
    typeof heading === "string" && heading === homeHeroHeading ? (
      <>
        {"Luxury and waterfront real estate across Eastern Fort Lauder"}
        <wbr />
        {"dale, Boca "}
        <wbr />
        {"Raton, and Delray "}
        <wbr />
        {"Beach."}
      </>
    ) : (
      heading
    );

  // Cycle 9 — CTAs render INSIDE the data-hero-copy-panel on image-mode heroes
  // (Approach C-refined). Cycle 8 placed CTAs in a separate band below the panel,
  // which forced lg:min-h-[680px] + lg:py-32 = ~768px hero bottom and pushed the
  // primary CTA under the 1280×800 visible-viewport fold (800 - 88 sticky header
  // = 712px). Embedding the CTAs in the panel + reducing min-h to 560 and lg:py
  // to 16 keeps the primary CTA bottom at <= 608px from page top, ~80px under
  // the 688px above-fold target.
  const ctas = ctaPrimary || ctaSecondary ? (
    <div
      data-hero-ctas
      className={
        useImage
          ? "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          : "mt-10 flex flex-wrap items-center gap-4"
      }
    >
      {ctaPrimary ? (
        <Link
          href={ctaPrimary.href}
          data-hero-cta="primary"
          className={
            useImage
              ? "inline-flex w-full items-center justify-center gap-1 whitespace-normal text-balance rounded-full bg-brass-400 px-1.5 py-2.5 text-[9px] font-semibold tracking-normal text-navy-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-200 min-[360px]:gap-1.5 min-[360px]:px-2 min-[360px]:py-3 min-[360px]:text-[10px] min-[375px]:gap-2 min-[375px]:whitespace-nowrap min-[375px]:px-4 min-[375px]:text-[13px] min-[375px]:tracking-wide sm:w-auto sm:px-6 sm:text-sm lg:px-7"
              : "inline-flex items-center gap-2 rounded-full bg-brass-400 px-8 py-3.5 text-sm font-semibold tracking-wide text-navy-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-200"
          }
        >
          {ctaPrimary.label}
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      ) : null}
      {ctaSecondary ? (
        <Link
          href={ctaSecondary.href}
          data-hero-cta="secondary"
          className={
            isCream
              ? "inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 bg-cream-50/80 px-7 py-3 text-sm font-medium tracking-wide text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
              : useImage
                ? "inline-flex w-full items-center justify-center whitespace-normal text-balance rounded-full border border-cream-100/80 bg-navy-900/80 px-1.5 py-2.5 text-[9px] font-medium tracking-normal text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300 min-[360px]:px-2 min-[360px]:py-3 min-[360px]:text-[10px] min-[375px]:whitespace-nowrap min-[375px]:px-4 min-[375px]:text-[13px] min-[375px]:tracking-wide sm:w-auto sm:px-6 sm:text-sm lg:px-7"
                : "inline-flex items-center gap-2 rounded-full border border-cream-100/70 bg-navy-900/40 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
          }
        >
          {ctaSecondary.label}
        </Link>
      ) : null}
    </div>
  ) : null;

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
            ? "relative mx-auto flex min-h-[440px] max-w-7xl items-center px-4 py-8 sm:min-h-[500px] sm:py-12 lg:min-h-[480px] lg:px-8 lg:py-6"
            : "relative mx-auto max-w-7xl px-4 py-28 sm:py-32 lg:px-8 lg:py-40"
        }
      >
        <div className={useImage ? "w-full min-w-0 max-w-2xl" : "w-full"}>
          <div
            data-hero-copy-panel={useImage ? "true" : undefined}
            data-hero-copy-panel-version={useImage ? "cycle39" : undefined}
            className={
              useImage
                ? "min-w-0 overflow-hidden rounded-sm border-l-2 border-brass-300 bg-navy-900/85 p-4 shadow-luxury min-[375px]:bg-navy-900/90 min-[375px]:p-5 sm:bg-navy-900/92 sm:p-6 lg:p-8"
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
                      : useImage
                        ? "mt-3 max-w-full break-words font-display text-[9px] uppercase tracking-[0.12em] text-brass-300 [overflow-wrap:break-word] [word-break:normal] min-[360px]:mt-4 min-[360px]:text-[10px] min-[360px]:tracking-[0.18em] min-[375px]:text-[10px] min-[375px]:tracking-[0.24em] sm:text-xs sm:tracking-[0.32em]"
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
                  ? "mt-5 w-full max-w-full font-display text-[20px] font-semibold leading-[1.2] tracking-normal text-navy-800 sm:max-w-4xl sm:text-[32px] sm:leading-[1.1] md:text-5xl lg:text-6xl break-words [overflow-wrap:anywhere]"
                  : useImage
                    ? "mt-4 w-full max-w-full min-w-0 break-words font-display text-[16px] font-bold leading-[1.18] tracking-normal text-cream-50 [overflow-wrap:anywhere] [word-break:normal] min-[375px]:text-[17px] sm:max-w-xl sm:text-[26px] sm:leading-[1.1] md:text-[32px] lg:text-[36px] lg:leading-[1.08]"
                    : "mt-5 w-full max-w-full font-display text-[20px] font-semibold leading-[1.2] tracking-normal text-cream-50 sm:max-w-4xl sm:text-[32px] sm:leading-[1.1] md:text-5xl lg:text-6xl break-words [overflow-wrap:anywhere]"
              }
            >
              {headingContent}
            </h1>
            {sub ? (
              <p
                data-hero-sub
                className={
                  isCream
                    ? "mt-6 max-w-2xl text-lg text-navy-800/80 [text-wrap:pretty] sm:text-xl"
                    : useImage
                      ? "mt-3 w-full max-w-full min-w-0 text-[13px] leading-[1.5] text-cream-200/95 [text-wrap:pretty] [overflow-wrap:break-word] [word-break:break-word] hyphens-auto min-[360px]:mt-4 min-[360px]:text-[14px] min-[360px]:leading-[1.55] min-[375px]:text-[15px] min-[375px]:leading-7 sm:max-w-xl sm:text-base md:text-lg lg:leading-6"
                      : "mt-6 max-w-2xl text-lg text-cream-200/90 [text-wrap:pretty] sm:text-xl"
                }
              >
                {sub}
              </p>
            ) : null}
            {useImage ? ctas : null}
          </div>
          {!useImage ? ctas : null}
        </div>
      </div>
    </section>
  );
}
