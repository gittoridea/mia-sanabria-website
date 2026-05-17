---
cycle: 41
artifact: hero-creative-brief
generated_at: 2026-05-17
---

# Cycle 41 — Hero Creative Brief

## Brand feel

```yaml
- luxury South Florida real estate
- Mia-led advisory
- image-forward
- calm and elegant
- high-trust
- search-enabled but not database-first
```

## Composition

```yaml
hero_image:
  - daytime waterfront with infinity pool, palms, calm Intracoastal — already correct
  - must read as the emotional first impression at first paint
  - dark overlay weight: just enough to keep text WCAG AA (4.5:1) — never more

copy_panel:
  desktop_lg:
    max_width: ~480px (max-w-md)
    opacity:   bg-navy-900/65 — lighter than mobile, allows image to breathe
    padding:   p-6 lg:p-7
  desktop_xl:
    same as lg
  tablet:
    max_width: ~512px (max-w-lg)
    opacity:   bg-navy-900/75
  mobile:
    max_width: full
    opacity:   bg-navy-900/85 → /88 (preserve readability at 320–414)

search_card:
  desktop_lg:
    max_width:    max-w-4xl (~896px) — narrower than max-w-7xl (1280px)
    layout:       3 selects + 1 button on one row, slimmer fields
    padding:      p-4 lg:p-5
    float_offset: -mt-12 lg:-mt-16 (less aggressive overlap than -mt-24)
  tablet:
    max_width:    max-w-3xl
    float_offset: -mt-12
  mobile:
    max_width:    full
    float_offset: -mt-10
    layout:       flex-col stacked fields, full-width button

next_section_transition:
  - post-search spacer reduced from h-16 sm:h-20 to h-8 sm:h-10 lg:h-12
  - "Mia's Service Areas" eyebrow gets a clean ~80–96px of breathing room (not 160+)
```

## Copy hierarchy

```yaml
eyebrow:
  decision: REMOVED on homepage hero
  reason: The eyebrow text "South Florida Lifestyle" is identical to the
          locked H1's first line. Visible verbatim duplication. Removing
          the eyebrow text preserves every locked H1 word while killing
          the redundancy. The gold accent line above the eyebrow is
          rendered only when eyebrow is present, so it also disappears,
          giving the H1 a cleaner top edge.

headline:
  decision: PRESERVED EXACTLY per Mia decision-record §Homepage hero
  text:
    line_1: "South Florida Lifestyle"
    line_2: "Home Search"
  visual_treatment:
    - bigger and bolder on desktop so it becomes the visual anchor
    - line height tightened to ~1.05 at lg so the two-line H1 reads as one
      composed mark, not two stacked labels
    - text-shadow preserved for image-mode contrast

subcopy:
  decision: PRESERVED
  text: |
    Discreet, local guidance for Southeast Florida luxury homeowners,
    absentee owners, and qualified buyers — from a small, deliberate
    practice.
  visual_treatment:
    - max-w ~52ch so it doesn't run the panel width on lg
    - leading slightly relaxed

ctas:
  decision: PRESERVED labels
  primary:   "Search available homes" → /home-search/
  secondary: "Talk with Mia" → /contact/
  visual_treatment:
    - inline-flex row on sm+
    - stacked on mobile
    - smaller height-step on the primary to keep panel weight contained
```

## Responsive acceptance

```yaml
mobile_320_to_430:
  - no horizontal overflow
  - dark panel inset 16px from both edges
  - eyebrow line is GONE
  - H1 readable at min 16px
  - 2 CTAs visible (stacked or wrapped)
  - search card visible below hero with intentional small overlap
  - search card fields stack

tablet_768_to_1024:
  - dark panel max-w-lg leaves ~30–40% of hero image visible
  - search card max-w-3xl, 2-col grid + full-width search button

desktop_1280_to_1536:
  - dark panel max-w-md leaves ~55–65% of image visible
  - search card max-w-4xl sits centered, three slim fields + brass button
  - vertical rhythm from hero → search → service areas reads as one
    composed sequence
```

## Anti-list

```yaml
- no fake live Bridge claim
- no MLS Matrix iframe reintroduction
- no Fair Housing / FREC superlative / luxury-as-practice copy added
- no H1 word change
- no asset swap (cycle40b hero stays)
- no over-design (avoid adding a third color, a glassmorphism layer, a
  new icon set, or any decorative flourish that wasn't already present)
```
