AUDIT_START

# Cycle 8 — Hero Design Decision (GPT-5.5 xhigh)

## Recommended option: C

Option C is the right Cycle 8 call because the defect is structural, not cosmetic: `src/components/Hero.tsx:53-67` puts the H1 over broad image gradients whose weakest zones are exactly where the text lands, especially `via-navy-900/40` and `sm:to-navy-900/20`, while `src/components/Hero.tsx:95-105` asks a tight `0_2px_3px` shadow to rescue bright pixels behind thin Cinzel strokes. A near-solid navy reading panel solves the actual failure by making the H1 background deterministic while preserving the image-led, luxury editorial feel around it. Use `bg-navy-900/95`, not `/92`, because navy-900 `#0a1d30` at 95% over worst-case white still gives cream-50 roughly 14:1 contrast. It stays inside the locked navy/cream/brass system, avoids glassmorphism, avoids new hero variants, and keeps all current `background="image"` call sites working.

## Why the previous approach failed

Cycles 5-7 kept treating readability as an overlay-strength problem while leaving the H1 directly on top of uncontrolled photography. The lightest middle band and weak desktop right edge meant the H1 could always cross bright sky, marina, wall, or interior pixels. Text-shadow helped edges but did not create a stable reading field behind the glyph bodies. Token audits passed because they verified the presence of shadows and overlays, not rendered pixel contrast.

## Implementation approach (copy-paste-ready)

Replace `src/components/Hero.tsx` with this Option C version:

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

  return (
    <section
      data-component="hero"
      data-variant={background}
      className={isCream ? "relative overflow-hidden bg-cream-100 text-navy-800" : "relative overflow-hidden bg-navy-900 text-cream-100"}
    >
      {useImage ? (
        <>
          <Image src={imageSrc} alt={imageAlt ?? ""} fill priority sizes="100vw" className="object-cover object-center" />
          <div aria-hidden data-hero-overlay="mood" className="absolute inset-0 bg-navy-900/20" />
          <div aria-hidden data-hero-overlay="content-scrim" className="absolute inset-0 bg-gradient-to-r from-navy-900/45 via-navy-900/20 to-navy-900/10" />
          <div aria-hidden data-hero-overlay="cta-scrim" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-900/85 via-navy-900/45 to-transparent" />
        </>
      ) : null}

      <div
        className={
          useImage
            ? "relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:min-h-[620px] sm:py-24 lg:min-h-[680px] lg:px-8 lg:py-32"
            : "relative mx-auto max-w-7xl px-4 py-28 sm:py-32 lg:px-8 lg:py-40"
        }
      >
        <div className={useImage ? "w-full max-w-2xl" : "w-full"}>
          <div
            data-hero-copy-panel={useImage ? "true" : undefined}
            className={useImage ? "rounded-sm border-l-2 border-brass-300 bg-navy-900/95 p-8 shadow-luxury sm:p-10 lg:p-12" : ""}
          >
            {eyebrow ? (
              <>
                <span aria-hidden className={isCream ? "block h-px w-10 bg-brass-700" : "block h-px w-10 bg-brass-300"} />
                <p
                  data-hero-eyebrow
                  className={isCream ? "mt-5 font-display text-xs uppercase tracking-[0.4em] text-brass-700" : "mt-5 font-display text-xs uppercase tracking-[0.4em] text-brass-300"}
                >
                  {eyebrow}
                </p>
              </>
            ) : null}

            <h1
              data-hero-heading
              className={
                isCream
                  ? "mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-normal text-navy-800 sm:text-5xl lg:text-6xl [overflow-wrap:break-word] [text-wrap:balance]"
                  : useImage
                    ? "mt-5 max-w-xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-normal text-cream-50 sm:text-5xl lg:text-6xl [overflow-wrap:break-word] [text-wrap:balance]"
                    : "mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-normal text-cream-50 sm:text-5xl lg:text-6xl [overflow-wrap:break-word] [text-wrap:balance]"
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
            <div data-hero-ctas className={useImage ? "mt-6 flex flex-wrap items-center gap-4" : "mt-10 flex flex-wrap items-center gap-4"}>
              {ctaPrimary ? (
                <Link
                  href={ctaPrimary.href}
                  data-hero-cta="primary"
                  className="inline-flex items-center gap-2 rounded-full bg-brass-400 px-8 py-3.5 text-sm font-semibold tracking-wide text-navy-900 shadow-card transition-colors hover:bg-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
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
                        ? "inline-flex items-center gap-2 rounded-full border border-cream-100/80 bg-navy-900/80 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
                        : "inline-flex items-center gap-2 rounded-full border border-cream-100/70 bg-navy-900/40 px-7 py-3 text-sm font-medium tracking-wide text-cream-50 transition-colors hover:border-brass-300 hover:text-brass-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
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
```

No page-level JSX changes are required. Mobile behavior: the navy panel spans the available content width above the image, with CTAs directly below it. Desktop behavior: the panel is capped at `max-w-2xl`, left aligned in the existing `max-w-7xl` hero shell, with the image still full-bleed behind and around it.

## What to avoid

- Do not ship Option A-style heavier broad overlays as the primary fix; that preserves the same uncontrolled text-on-photo failure.
- Do not keep `via-navy-900/40`, `sm:to-navy-900/20`, or the old `0_2px_3px` shadow as acceptance evidence.
- Do not put the H1 outside `data-hero-copy-panel` on image heroes.
- Do not use `backdrop-blur`, glass panels, gradient borders, neon strokes, `text-transparent`, or `bg-clip-text`.
- Do not add new colors, new fonts, or raw off-token decorative colors.
- Do not place CTAs inside the copy panel; keep the panel for eyebrow/H1/sub only.
- Do not accept token-only audits as visual proof. The gate must sample rendered pixels after fonts load.

## Acceptance criteria for THIS implementation

1. `src/components/Hero.tsx` image mode renders `data-hero-copy-panel="true"` with `bg-navy-900/95`, `border-l-2`, and `border-brass-300`.
2. `[data-hero-heading]`, `[data-hero-eyebrow]`, and `[data-hero-sub]` are descendants of `data-hero-copy-panel` for every `background="image"` hero.
3. `[data-hero-ctas]` is outside and after `data-hero-copy-panel` in DOM order.
4. `Hero.tsx` contains no `sm:to-navy-900/20`, no `via-navy-900/40`, no `[text-shadow:0_2px_3px`, no `rgba(15,42,68`, and no `tracking-tight` on hero H1.
5. New pixel sentinel `scripts/audit-hero-pixel-contrast.ts` runs built pages in Chrome, waits for `document.fonts.ready`, hides `[data-hero-heading]`, samples background pixels inside the heading rect, and asserts contrast against computed H1 color is `>= 4.5:1`.
6. Pixel sentinel covers at least `/`, `/about/`, `/markets/`, `/markets/fort-lauderdale/`, `/buyers/`, `/sellers/`, `/valuation/`, and `/contact/` at `375x812`, `768x1024`, and `1440x900`.
7. Pixel sentinel writes route, viewport, min contrast, sampled pixel count, and screenshot path to `reports/audit-hero-pixel-contrast.json`.
8. `package.json` adds `audit:hero-contrast` and includes it in `audit:all`.
9. `scripts/audit-brand-consistency.ts` stops requiring H1 text-shadow and instead verifies the deterministic reading panel structure.
10. After screenshots are captured to `/tmp/mia-cycle8-hero-card-after/`; a human closeout cannot claim PASS without referencing those files.
11. `bun run typecheck`, `bun run build`, `bun run audit:brand`, and `bun run audit:hero-contrast` all pass before deploy.
12. WebsiteProductionLoop skill v0.3.0 is amended to state: image-over-text hero changes require rendered pixel-contrast gates, not operator assertions or token presence checks.

## Pages and components affected

- `src/components/Hero.tsx`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/markets/page.tsx`
- `src/app/markets/[slug]/page.tsx`
- `src/app/buyers/page.tsx`
- `src/app/sellers/page.tsx`
- `src/app/valuation/page.tsx`
- `src/app/contact/page.tsx`
- `scripts/audit-brand-consistency.ts`
- `scripts/audit-hero-pixel-contrast.ts`
- `package.json`
- WebsiteProductionLoop skill `SKILL.md` v0.3.0

## Safe to implement now? yes

Yes. This is a single-component architecture change that keeps the existing Hero API and current image assets, so blast radius is controlled. It is not safe to deploy on assertion alone; it is safe to implement now if the pixel-contrast sentinel and after-screenshot gates are added in the same cycle.

AUDIT_END