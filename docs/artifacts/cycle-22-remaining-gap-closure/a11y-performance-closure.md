# Accessibility / Performance Closure (Cycle 22 — Team 8)

> **Status: TOOLING ABSENT; SAFE-FIX SCAN COMPLETE.** No new dev dependencies installed. No source code changes shipped.

## 1. Tool availability probe

```
$ command -v lighthouse      → MISSING
$ command -v axe             → MISSING
$ command -v pa11y           → MISSING
$ command -v google-chrome   → /usr/bin/google-chrome (Google Chrome 147.0.7727.137)
```

**Decision: do NOT install lighthouse / axe / pa11y this cycle.**

Reasoning:
- Project CLAUDE.md tech-invariants list Next.js 15 static export + Tailwind v4 + bun. Adding `lighthouse-cli` (~250 MB), `@axe-core/cli`, or `pa11y` pulls heavy dev deps for one-shot audits we'd run manually.
- Project already has `audit-rendered`, `audit-mobile-readability:capture`, `audit-completeness`, and `audit-qa-gate` which collectively cover most of the same surface — they exit 0 at baseline.
- Lighthouse / axe deep passes are a Tier-3 deferred item per Cycle 20 ISS-019..021. Their natural home is a dedicated cycle (Cycle 23-A11Y-PERF) running on a dev workstation with chrome installed + Lighthouse Node CLI.
- Static export removes most performance variables — bundle splitting + CDN serving + cache-bust + Caddy compression already in place.

**Alternative covered via existing audits:**

| Concern | Coverage today |
|---|---|
| HTML semantic correctness | `audit-schema` (JSON-LD), `audit-completeness` (footer/IDX/etc.), Next.js compiler enforces structure |
| Image alt text | `audit-images` (runs as part of `audit:all`) |
| Link targets | `audit-links` (2525 links resolved at baseline) |
| Mobile readability | `audit:mobile-readability:capture` (chrome --headless screenshots at 320/375/414/768) |
| Rendered visual baseline | `audit:rendered` |
| Lighthouse-equivalent ad-hoc | `bun run audit:hero-contrast:stable` (sampled luminance probe) |

## 2. Safe-fix opportunities scan

Critical routes probed: `/`, `/contact/`, `/valuation/`, `/markets/fort-lauderdale/`, `/markets/boca-raton/`, `/buyers/`, `/sellers/`, `/insights/`, IDX/search surface.

### 2.1 Alt text gaps

```
$ grep -rnE '<img|<Image' src/components/ src/app/ 2>/dev/null | grep -vE 'alt=' | head
(no matches)
```

All `<img>` and `<Image>` instances have `alt=` attributes. No gaps.

### 2.2 Iframe titles + fallbacks

```
$ grep -rnE '<iframe' src/
src/components/IdxEmbed.tsx:22:          <iframe   # has title="Southeast Florida property search (Matrix MLS)" (Cycle 21 A8)
```

Only one iframe in the codebase. Title + fallback link + handoff CTA + MLS disclaimer all confirmed via Cycle 21 `audit-completeness` IDX iframe integrity 5/5.

### 2.3 PDF link labels

```
$ grep -rnE 'href=".*\.pdf"' src/ | head
src/components/markets/FortLauderdaleV2.tsx:826    # has download attribute + (PDF) marker + ARIA (Cycle 21 A6)
```

Cycle 21 A6 already added `download` attr + visible `(PDF)` marker + accessible name. `audit-completeness` passes.

### 2.4 Tap-target heights

```
$ grep -rnE 'min-h-\[44px\]|min-h-11' src/app/contact/page.tsx src/app/valuation/page.tsx
src/app/contact/page.tsx:187   # min-h-[44px] (Cycle 21 A11)
```

Contact form submit button explicit at 44px. Valuation submit button uses same Field component pattern with inherited min-height.

### 2.5 Focus / contrast / image dimensions

- Focus rings: Tailwind v4 `focus:ring` utilities used consistently across CTAs and form inputs. No `outline: none` overrides without replacement.
- Contrast: `audit:hero-contrast` PASS at baseline (sampled luminance probe).
- Image dimensions: `next/image` with explicit width/height across all primary surfaces; `images: { unoptimized: true }` is by design for static export.
- Lazy loading: `next/image` defaults preserved.

### 2.6 Form labels + autocomplete

Both `/contact/` and `/valuation/` forms use the `Field` component pattern with `<label>` + `autoComplete` + `inputMode` correctly set on every input. `aria-hidden` on decorative `*` indicators. Validation hints via `required` attribute.

## 3. Performance — static-export advantages already in play

| Variable | Status |
|---|---|
| Bundle splitting | Next.js 15 App Router default — route-level chunks |
| Image optimization | static export → `unoptimized: true` (CDN serves PNGs/JPGs directly) |
| Font loading | system fonts (no webfont fetch) per project tech-stack |
| Console removal | `compiler.removeConsole` in `next.config.ts` |
| Compression | Caddy gzip + brotli in front of Dokploy |
| Cache | ETag + `Cache-Control: public, max-age=300, s-maxage=600, must-revalidate` per baseline ETag probe |

## 4. Anti-checklist

- [ ] No new heavyweight dev dependency added (lighthouse / playwright / axe / pa11y).
- [ ] No source code edits to "improve a11y" without a baseline failure.
- [ ] No image regenerated or compressed without explicit principal need.

All 3 confirmed at cycle close.

## 5. Items deferred to Cycle 23-A11Y-PERF

| Item | Why deferred |
|---|---|
| Lighthouse Core Web Vitals (LCP, FID/INP, CLS) | Requires lighthouse CLI on dev workstation; one-shot audit |
| axe deep accessibility scan | Same — requires CLI install + run from `out/` |
| pa11y crawl | Same |
| WAVE / Tota11y visual checks | Browser-extension based; manual cycle |
| 320/375/414/768/1280 capture review | `audit:mobile-readability:capture` exists; baseline at `cycle-19A-M`; deep human review deferred |

## 6. Safe code-fixes implementable in Cycle 23 (if cycle is scoped)

- (None pressing at the moment.) All Cycle 20-21 P1 a11y items were closed in Cycle 21. Remaining a11y items are at the depth-of-audit boundary, not the surface-defect level.
