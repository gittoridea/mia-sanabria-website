# Cycle 39 — Homepage Hero Regression Fix

date: 2026-05-16

## Operator-reported regression (live-before evidence)

Screenshot: `live-before/screenshots/home__375x812.png`

- Near-opaque navy panel (`bg-navy-900/95`) covered ~80% of the mobile hero,
  reducing the operator-authorized twilight waterfront image to a thin
  vertical sliver.
- Sub-text overflowed rightward past the panel edge — words `Florida`,
  `qualified` visually clipped.
- Floating Bridge search card landed BELOW the dark slab rather than
  overlapping the hero image.

## Constraints respected

- **H1 locked** per `docs/mia-client-decision-record.md` §Homepage hero
  ("Line 1: `South Florida Lifestyle` / Line 2: `Home Search`"). Cycle 39
  does NOT change copy.
- **Operator-authorized hero asset** (twilight composition reused from
  miasanabria.com og:image) preserved at versioned path
  `/hero/mia-home-hero-cycle39.jpg`.
- **No production cutover** — staging only (`miasanabriarealtor.trueidea.com`).

## Source changes (`src/components/Hero.tsx`)

| Property | Before | After (Cycle 39) | Why |
|---------|--------|-------------------|-----|
| Copy panel `bg-` | `bg-navy-900/95` | `bg-navy-900/85` → `min-[375px]:bg-navy-900/90` → `sm:bg-navy-900/92` (lg implied default panel) | Reveal hero image on mobile while preserving CTA contrast |
| Copy panel padding | `p-3` | `p-4` → `min-[375px]:p-5` | Slightly more breathing room without consuming hero height |
| Copy panel overflow | (none) | `overflow-hidden` | Sub-text can never visually overflow the panel again |
| H1 max-width (mobile) | `max-w-[27ch]` | `max-w-full` | `[overflow-wrap:anywhere]` already wraps gracefully; the artificial ch constraint added no value |
| Sub-paragraph max-width (mobile) | `max-w-xl` (576px) | `max-w-full` on mobile; `sm:max-w-xl` reactivated at ≥640px | 576px was wider than the entire 375px mobile viewport — the root cause of the rightward text overflow |
| Marker | `data-hero-copy-panel="true"` | `data-hero-copy-panel="true" data-hero-copy-panel-version="cycle39"` | Surface-level marker for future regression detection |

## Source changes (`src/app/page.tsx`)

- `imageSrc="/hero/mia-home-hero.jpg"` → `imageSrc="/hero/mia-home-hero-cycle39.jpg"` (versioned path).

## What this fix does NOT do

- Does NOT swap the hero asset from the Cycle 38 twilight composition to
  the actual visible miasanabria.com daytime hero. See
  `reference-hero-visual-extraction.md` for the divergence the probe
  surfaced — that swap is an operator decision, not an AI-closeable change.
- Does NOT change the floating search card layout (`pointer-events-none`
  outer wrapper + `pointer-events-auto` inner + `-mt-20 sm:-mt-24` negative
  margin) — preserving Cycle 38's structure. The panel-opacity fix alone
  resolves most of the perceived overlap problem because the hero image is
  now visible through the panel; the card no longer competes with an
  opaque slab.
- Does NOT alter the locked H1 or eyebrow.

## Build + audit evidence

- `bun run typecheck` — exit 0.
- `bun run lint` — exit 0.
- `bun run build` — exit 0; built output contains versioned hero ref count = 1, unversioned ref count = 0 in `out/index.html`.
- `bun run audit:hero-contrast:stable` — 145/0/0 PASS.
- `bun run audit:brand` — 12/0/0 PASS (`heroH1ContrastTokens`, `heroNoNavyGlowHalo`, `heroNoCycle7WeakOverlay`, `heroOverlayLayers` all PASS).
- `bun run audit:mobile-readability` — 84/0/0 PASS across iPhone SE / iPhone 14 Plus / iPad portrait.

## Anti-regression markers

- `data-hero-copy-panel-version="cycle39"` is a new DOM attribute that future
  visual-regression audits can pattern-match to confirm the Cycle 39
  treatment is in place.
- The `data-floating="true"` + `data-home-hero-search="true"` markers
  installed in Cycle 38 are preserved.
