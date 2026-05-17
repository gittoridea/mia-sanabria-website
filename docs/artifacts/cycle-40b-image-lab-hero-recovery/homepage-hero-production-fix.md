# Cycle 40B — Homepage Hero Production Fix

> Root-cause analysis + the fix landed for the mobile hero overflow and
> desktop hero cramping the operator reported through Cycle 38, 39, 40.

## Root cause

Three contributing defects, each individually small, combining to produce
the observed mobile overflow and desktop cramping:

1. **CTA primary nowrap at 375+:** `min-[375px]:whitespace-nowrap` on the
   `Search available homes →` primary CTA forced the link content to never
   wrap. At 13px font-size + 4px icon gap + arrow icon, the natural content
   width of the inline-flex CTA reached ~190px — fine in isolation, but
   combined with `w-full` set on the same element produced inconsistent
   flex-item sizing at the boundary where the inner panel content tried to
   shrink.

2. **Missing intrinsic-width safety net on section + panel parent
   containers:** The `<section>` wrapping the hero had `overflow-hidden`
   but no `w-full max-w-full` ceiling, and the inner flex parent didn't
   carry `w-full` either. Combined with the CTA whitespace-nowrap, this
   allowed the panel to compute an intrinsic width slightly wider than
   viewport in narrow-viewport scenarios.

3. **No global horizontal-overflow safety net on html/body:** The
   `globals.css` `html { ... }` block didn't set `overflow-x: clip`, so any
   single descendant computing a width > viewport caused the entire body to
   scroll horizontally. Headless capture-baseline.ts saved that overflow as
   visible defect at 375px.

## The fix (Cycle 40B)

Four surgical edits, all minimum-blast-radius:

### 1. `src/app/globals.css` — global overflow-x:clip safety net

```css
html {
  /* ...existing rules... */
  /* Cycle 40B — global horizontal-overflow safety net. */
  overflow-x: clip;
}

body {
  /* ...existing rules... */
  overflow-x: clip;
}
```

`overflow-x: clip` (vs `hidden`) preserves `position: sticky` for the
SiteHeader and `position: fixed` for any overlays. This is the strongest
single defense against future regressions where a child component decides
to compute a too-wide width.

### 2. `src/components/Hero.tsx` — section + container width-clamping

Added `w-full max-w-full` to the section and `w-full` to the inner flex
container. Both clamp the hero to viewport regardless of descendant width
behavior. Bumped `data-hero-overflow-version="cycle40b"` for auditability.

### 3. `src/components/Hero.tsx` — CTA wrap relaxation + `<span>` content wrap

- Removed `min-[375px]:whitespace-nowrap` from BOTH primary and secondary
  image-mode CTAs. CTAs may now wrap their label text at narrow viewports.
- Added `max-w-full min-w-0` to the CTA element so it cannot push parent
  width beyond container.
- Wrapped the label text in a `<span class="min-w-0 text-balance">` so the
  text-balance algorithm can break clean lines and the arrow icon stays
  on-line.
- Raised base text size from `text-[9px]` to `text-[12px]` (still small but
  legible) with cleaner break at `min-[360px]:text-[13px]` and
  `min-[400px]:px-4`. Removed the noisy multi-step
  `min-[360px]:gap-1.5 min-[360px]:px-2 ...` chain — flat ramp now.
- Bumped `data-hero-cta-version="cycle40b"` on both CTAs for auditability.

### 4. `src/components/HeroSearch.tsx` — floating container width-clamping

Added `w-full max-w-full` to the floating outer wrapper and `w-full min-w-0`
to the inner `mx-auto max-w-7xl` wrapper. Same defensive ceiling as the
hero. Bumped `data-hero-search-version="cycle40b"`.

### 5. `src/app/page.tsx` — hero asset swap + relative wrapper clamping

- `imageSrc` swapped from `/hero/mia-home-hero-cycle39.jpg` (twilight) to
  `/hero/mia-home-hero-cycle40b.jpg` (daytime waterfront mansion,
  operator-authorized, derived from the actual miasanabria.com hero).
- `imageAlt` updated to describe the daytime composition.
- Outer wrapper added `w-full max-w-full overflow-x-clip` for an extra
  defensive ceiling at the route level.

## Verification approach

1. **Local capture at 6 viewports** (375, 390, 430, 768, 1280, 1440) via
   `capture-baseline.ts` against `bun run build && python3 -m http.server
   4211 --directory out`.
2. **PNG read inspection** of each captured screenshot — the file gets
   opened by the Read tool, the model writes a verbal description of what's
   visible, and an overflow defect manifests as visible truncation /
   clipping.
3. **Live capture after staging deploy** at same 6 viewports, against the
   deployed `https://miasanabriarealtor.trueidea.com/` URL (with
   `?cb=<hex>` cache-bust to defeat Caddy edge cache).
4. **Audit `audit:hero-contrast:stable`** for hero-overlay contrast
   regression check.
5. **DOM marker grep** — `data-hero-overflow-version="cycle40b"` and
   `data-hero-cta-version="cycle40b"` should appear in the built HTML for
   `/`, confirming the fix landed in the bundle.

## What this fix does NOT do

- Does not change the homepage copy beyond the alt-text update.
- Does not change the NeighborhoodsRail, FeaturedMarketsPager, or any
  section below the hero.
- Does not modify the legacy non-floating `HeroSearch` (used elsewhere).
- Does not address potential issues at viewport widths < 320 (those
  viewports are outside Tailwind's default mobile-first range and would
  need explicit testing).

## Cycle 39 vs Cycle 40B

Cycle 39 attempted to fix this with:
- `bg-navy-900/85` → opacity-reduction on the panel (cosmetic, not
  structural)
- `max-w-xl` → `max-w-full` on the sub paragraph (helped wrapping but
  didn't address overflow)
- `max-w-[27ch]` → `max-w-full` on the heading (same)

These were source-level proofs (class-string presence) declared
`live_verified` without rendered-pixel inspection. They didn't address
the CTA `whitespace-nowrap` ingestion point OR the missing
section-width-ceiling, so the panel kept overflowing.

Cycle 40B addresses the root cause at the ingestion point: the CTA
nowrap is removed, defensive width-ceilings are added at every level
(section, flex parent, child, hero-search wrapper, html/body), and a
post-deploy rendered-pixel verification is built into the closeout.
