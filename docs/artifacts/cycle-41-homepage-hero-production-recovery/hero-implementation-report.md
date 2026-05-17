---
cycle: 41
artifact: hero-implementation-report
generated_at: 2026-05-17
---

# Cycle 41 — Hero Implementation Report

## Chosen layout strategy

**Option A — Image-first split overlay.** Preserve the image-mode Hero pattern but rebalance the visual weights so the photograph is the lead and the copy panel + search card support it:

- Image stays the full hero, no crop change.
- Dark copy panel narrows (`max-w-md` on lg vs prior `max-w-2xl`) and lightens (`bg-navy-900/72` at sm, `/68` at lg vs prior `/92` at sm).
- Content-scrim left-side dim reduced from `/45 via-/20 to-/10` to `/35 via-/10 to-transparent` so the right two-thirds of the image read true.
- Bottom CTA scrim reduced from `from-/85 via-/45` to `from-/55 via-/20` so the search-card seam isn't a second navy mass.
- Floating search card narrows on lg (`max-w-4xl` vs prior `max-w-7xl`) and floats less aggressively (`-mt-12 lg:-mt-16` vs prior `-mt-20 sm:-mt-24`).
- Post-hero spacer reduced from `h-16 sm:h-20` to `h-6 sm:h-8 lg:h-10` so transition into "Mia's Service Areas" reads as intentional.

Option B (single hero panel containing search) was rejected — it would have collapsed the search card into the panel and overpowered the hero on mobile, where the panel must already carry copy + 2 CTAs. Option C (desktop-overlay / mobile-stacked) is essentially what we have; Option A is the targeted refinement of Option C.

## Copy changes

```yaml
eyebrow_text: REMOVED
  before: "South Florida Lifestyle"
  after:  (prop omitted from page.tsx Hero invocation)
  reason: |
    Verbatim duplication with H1 line 1. The Mia decision-record locks
    the H1 phrasing; it does not separately mandate the same words again
    as an eyebrow. Dropping the eyebrow preserves every locked H1 word
    while killing the visible redundancy. Gold accent line is rendered
    only when eyebrow is present, so it disappears with the text — a
    cleaner top edge for the H1.

h1_text: UNCHANGED
  text:
    line_1: "South Florida Lifestyle"
    line_2: "Home Search"
  visual_change: |
    Tighter leading on lg (1.04 vs prior 1.08) so the two-line H1 reads as
    one composed mark instead of two stacked labels. lg font-size bumped
    36 → 38 px. Text-shadow preserved for image-mode contrast.

sub_text: UNCHANGED

ctas_labels: UNCHANGED
```

## Files changed

```yaml
- src/app/page.tsx
  - removed `eyebrow="South Florida Lifestyle"` prop on Hero
  - reduced post-hero spacer h-16 sm:h-20 → h-6 sm:h-8 lg:h-10
  - added Cycle 41 explanatory comment block

- src/components/Hero.tsx
  - data-hero-copy-panel-version: cycle40b → cycle41
  - data-hero-overlay-version: added "cycle41" on content-scrim + cta-scrim
  - content-scrim: from-navy-900/45 via-/20 to-/10
                  → from-navy-900/35 via-/10 to-transparent
  - cta-scrim:    h-1/2 from-navy-900/85 via-/45 to-transparent
                  → h-1/3 from-navy-900/55 via-/20 to-transparent
  - hero container: lg:min-h-[480px] lg:py-6 → lg:min-h-[540px] lg:py-10
  - copy column: max-w-2xl → max-w-2xl sm:max-w-xl lg:max-w-md xl:max-w-lg
  - copy panel: bg-navy-900/85 min-[375px]:/90 sm:/92 + lg:p-8
              → bg-navy-900/85 min-[375px]:/88 sm:/72 lg:/68 + lg:p-7
  - H1 image-mode leading lg: 1.08 → 1.04 (text 36 → 38 px)
  - H1 image-mode text-shadow class explicit (was rendered via container before; safer to inline now)

- src/components/HeroSearch.tsx
  - data-hero-search-version: cycle40b → cycle41
  - floating wrapper: -mt-20 sm:-mt-24 → -mt-12 sm:-mt-14 lg:-mt-16
  - floating wrapper max-width: max-w-7xl → max-w-7xl lg:max-w-4xl
  - card padding sm:p-5 lg:p-6 → sm:p-5 lg:p-5
  - card grid lg:[1.4fr_1fr_0.9fr_auto] → lg:[1.5fr_1fr_1fr_auto] + lg:gap-3
```

## How panel weight was reduced

Three independent levers (panel width, panel opacity, content-scrim density). Mobile keeps strong contrast for readability; desktop lightens because the panel no longer needs to carry as much real estate. Result: at 1440 the navy panel covers roughly the left 30–35% of the hero instead of 45–50%, and what remains is meaningfully translucent so the image's blue waterfront tone reads through it.

## How search card was integrated

Two levers: narrower max-width on lg, and smaller float-up offset. The card now sits ~120px tall, ~896px wide, centered horizontally, overlapping the hero image by ~64px instead of ~96px. Less violent intrusion, more "intentionally anchored to the hero."

## How mobile overflow was prevented

Mobile path is unchanged from Cycle 40B's defensive surface — `[contain:inline-size]`, `w-full max-w-full overflow-hidden`, `[overflow-wrap:break-word] [word-break:normal] hyphens-auto`, `whitespace-normal text-balance` CTAs, full-width stacked fields. The opacity step at sm+ does not loosen mobile contrast (mobile sits at /85→/88).

## How vertical rhythm was fixed

Post-hero spacer reduced. The next section's own `py-*` already provides ~80px top breathing room. The prior 80–120px cream gap between search card and "Mia's Service Areas" eyebrow drops to ~30–48px on lg, which reads as intentional pause rather than empty afterthought.

## How Bridge wiring was preserved

`HeroSearch` form still uses `method="get" action="/home-search/"` with hidden `source=home-hero`, and three selects emit `city`, `minPrice`, `beds`. BridgeSearch on `/home-search/` reads URL params on mount. The visual refactor doesn't touch the form schema, names, or destination. The `data-home-hero-search="true"` sentinel that `audit:home-bridge-search` and `test-home-search-bridge-e2e.ts` look for is preserved verbatim.

## How old IDX absence was preserved

No `IdxEmbed`, no `sef.mlsmatrix.com`, no `mlsmatrix.com`, no `idxform` references introduced. `audit:no-old-idx` will continue to pass.
