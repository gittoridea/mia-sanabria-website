AUDIT_START

## Verdict
recommended_approach: C-refined  
safe_to_implement_now: yes  
reasoning_effort_attested: xhigh

## Why this approach
C-refined is the safest fix because it preserves the Cycle 8 panel direction while removing the separate CTA band that caused the desktop fold risk. The mobile clipping is addressed by reducing the image-hero H1 scale, tightening panel padding, removing panel `overflow-hidden`, and adding copy-preserving `<wbr />` hints for the locked homepage heading.

No `globals.css` cascade fix is needed. The global `h1` clamp is in `@layer base`; Tailwind text utilities are in `@layer utilities` and win by layer order and class specificity.

## Why the other three approaches lose
Approach A loses because it keeps CTAs outside the panel. It can probably pass with aggressive compression, but it leaves less vertical margin and preserves the exact structural cause of the fold failure.

Approach B loses because it changes the visual model from cinematic full-bleed to split editorial. That is a broader design change than this cycle needs.

Approach D loses because it is intentionally multi-variant and multi-call-site. This cycle needs one layout repair, not a hero system redesign.

## Implementation guidance — copy-paste-ready
```tsx
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
  const homeHeroHeading =
    "Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach.";
  const headingContent =
    heading === homeHeroHeading ? (
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
              ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-brass-400 px-4 py-3 text-[13px] font-semibold tracking-wide text-navy-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-200 sm:w-auto sm:px-6 sm:text-sm lg:px-7"
              : "inline-flex items-center gap-2 rounded-full bg-brass-400 px-8 py-3.5 text-sm font-semibold tracking-wide text-navy-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-200"
          }
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
              ? "inline-flex items-center justify-center gap-2 rounded-full border border-navy-800/30 bg-cream-50/80 px-7 py-3 text-sm font-medium tracking-wide text-navy-800 transition-colors hover:border-brass-400 hover:text-brass-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"
              : useImage
                ? "inline-flex w-full items-center justify-center gap-2 rounded-full border border-cream-100/80 bg-navy-900/80 px-4 py-3 text-[13px] font-medium tracking-wide text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300 sm:w-auto sm:px-6 sm:text-sm lg:px-7"
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
          <Image src={imageSrc} alt={imageAlt ?? ""} fill priority sizes="100vw" className="object-cover object-center" />
          <div aria-hidden data-hero-overlay="mood" className="absolute inset-0 bg-navy-900/20" />
          <div aria-hidden data-hero-overlay="content-scrim" className="absolute inset-0 bg-gradient-to-r from-navy-900/45 via-navy-900/20 to-navy-900/10" />
          <div aria-hidden data-hero-overlay="cta-scrim" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-900/85 via-navy-900/45 to-transparent" />
        </>
      ) : null}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(60%_60%_at_30%_40%,rgba(184,155,94,0.2),transparent_70%)]" />
      <div
        className={
          useImage
            ? "relative mx-auto flex min-h-[440px] max-w-7xl items-center px-4 py-8 sm:min-h-[500px] sm:py-12 lg:min-h-[560px] lg:px-8 lg:py-16"
            : "relative mx-auto max-w-7xl px-4 py-28 sm:py-32 lg:px-8 lg:py-40"
        }
      >
        <div className={useImage ? "w-full min-w-0 max-w-2xl" : "w-full"}>
          <div
            data-hero-copy-panel={useImage ? "true" : undefined}
            className={useImage ? "min-w-0 rounded-sm border-l-2 border-brass-300 bg-navy-900/95 p-4 shadow-luxury min-[375px]:p-5 sm:p-6 lg:p-8" : ""}
          >
            {eyebrow ? (
              <>
                <span aria-hidden className={isCream ? "block h-px w-10 bg-gradient-to-r from-transparent via-brass-700 to-transparent" : "block h-px w-10 bg-gradient-to-r from-transparent via-brass-300 to-transparent"} />
                <p data-hero-eyebrow className={isCream ? "mt-5 font-display text-[11px] uppercase tracking-[0.3em] text-brass-700 sm:text-xs sm:tracking-[0.4em]" : useImage ? "mt-4 max-w-full break-words font-display text-[10px] uppercase tracking-[0.22em] text-brass-300 [overflow-wrap:anywhere] sm:text-xs sm:tracking-[0.32em]" : "mt-5 font-display text-[11px] uppercase tracking-[0.3em] text-brass-300 sm:text-xs sm:tracking-[0.4em]"}>
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
                    ? "mt-4 w-full max-w-[27ch] min-w-0 break-words font-display text-[16px] font-bold leading-[1.18] tracking-normal text-cream-50 [overflow-wrap:anywhere] [word-break:normal] min-[375px]:text-[17px] sm:max-w-xl sm:text-[26px] sm:leading-[1.1] md:text-[32px] lg:text-[40px]"
                    : "mt-5 w-full max-w-full font-display text-[20px] font-semibold leading-[1.2] tracking-normal text-cream-50 sm:max-w-4xl sm:text-[32px] sm:leading-[1.1] md:text-5xl lg:text-6xl break-words [overflow-wrap:anywhere]"
              }
            >
              {headingContent}
            </h1>
            {sub ? (
              <p data-hero-sub className={isCream ? "mt-6 max-w-2xl text-lg text-navy-800/80 [text-wrap:pretty] sm:text-xl" : useImage ? "mt-4 max-w-xl text-[15px] leading-7 text-cream-200/95 [text-wrap:pretty] sm:text-base md:text-lg" : "mt-6 max-w-2xl text-lg text-cream-200/90 [text-wrap:pretty] sm:text-xl"}>
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
```

`globals.css` diff: none.

```diff
```

Image-hero H1 typography scale:
320px viewport: `16px`  
375px viewport: `17px`  
768px viewport: `32px`  
1280px viewport: `40px`  
1440px viewport: `40px`

Desktop hero height limit:
`lg:min-h-[560px]` and `lg:py-16`. No `xl` height increase.

CTA above-fold requirement:
At 1280x800, reserve `88px` sticky header plus `24px` buffer, so CTA bottom must be `<= 688px` from page top. This layout places CTAs inside the panel, removes the external CTA block below the panel, and uses `lg:py-16`. Budgeted page y is approximately `88 + 64 + <=456 = <=608px`, leaving about `80px` of margin under the required `688px`.

## Acceptance criteria for this implementation
1. Playwright 320x568 probe: `[data-hero-heading]` bounding box right edge is `<= [data-hero-copy-panel]` right edge.
2. Playwright 375x812 probe: `[data-hero-heading]` bounding box right edge is `<= [data-hero-copy-panel]` right edge.
3. Playwright 1280x800 probe: primary CTA bottom edge is `<= 688px` from page top.
4. Playwright 1440x900 probe: primary CTA bottom edge is `<= 788px` from page top.
5. Computed-style probe at widths 320, 375, 768, 1280, 1440: image-hero H1 font sizes equal `16px`, `17px`, `32px`, `40px`, `40px`.
6. DOM probe: for `background="image"`, `[data-hero-ctas]` is a descendant of `[data-hero-copy-panel="true"]`.
7. CSS probe: no `text-transparent`, `bg-clip-text`, `backdrop-blur`, new font family, or non-token color utility appears in `Hero.tsx`.
8. Visual screenshot probe at 1280x800: both CTA buttons are visible without scrolling.

## What NOT to change
Do not shorten or rewrite the homepage heading.

Do not move CTAs back outside the image hero panel.

Do not restore `lg:min-h-[680px]` or `lg:py-32`.

Do not change GHL, legal copy, principal-card copy, license rendering, REALTOR®/MLS logo handling, Spanish copy, or TCPA mechanics.

Do not add glassmorphism, gradient borders, neon strokes, `text-transparent`, `bg-clip-text`, `backdrop-blur`, new colors, or new fonts.

Do not convert this cycle into split-hero variants or page-specific hero architecture.

## Cycle-9 risk register
Risk: Tailwind arbitrary breakpoint `min-[375px]` could fail to emit in the local build.  
Mitigation: the computed-style probe must assert `17px` at 375px before acceptance.

Risk: future homepage copy changes could bypass the exact `<wbr />` hints.  
Mitigation: the 320px and 375px bounding-box probes remain required.

Risk: CTA labels could wrap differently if translated or changed.  
Mitigation: image-mode CTA buttons are full-width on mobile and inside the measured panel on desktop.

Risk: a future `globals.css` layer-order change could make the base `h1` clamp win again.  
Mitigation: keep the multi-width computed-style probe in the audit suite.

## Closing JSON
{"team":"phase4-decision","verdict":"pass","model_used":"gpt-5.5","reasoning_effort":"xhigh","approach":"C-refined","safe_to_implement_now":true,"completeness":"full"}

AUDIT_END
