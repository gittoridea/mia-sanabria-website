# Cycle 40 — Live-Before Visual Critique

date: 2026-05-16T12:10Z
base: https://miasanabriarealtor.trueidea.com
deployed_commit: 21533b9 (= origin/main)
screenshots: docs/artifacts/cycle-40-world-class-visual-recovery/live-before/screenshots/

## Method

Captured 20 screenshots (5 routes × 4 viewports) via
`scripts/capture-baseline.ts` headless Chrome, then opened each PNG with
the Read tool and described what is actually visible. Same approach as
Cycle 39 but conclusions driven from rendered pixels, not class strings.

## Findings

```yaml
operator_issue_reproduced: true

homepage_hero_formatting_issues:
  - issue: |
      Dark navy hero panel overflows the right edge of the viewport.
      Body copy truncates mid-word; "Southeast Florida" cuts to
      "Florida..." and "homeowners, absentee owners, and qualified"
      truncates with no readable terminator. Sub-text is unreadable
      past column ~32.
    viewport: 375x812
    screenshot_path: live-before/screenshots/home__375x812.png
    severity: critical
  - issue: |
      "Search available homes" CTA pill clips past the right viewport
      edge; "Talk with Mia" CTA same. Both interactive controls have
      affordances cut off.
    viewport: 375x812
    screenshot_path: live-before/screenshots/home__375x812.png
    severity: critical
  - issue: |
      Floating Bridge search card overlays the bottom of the truncated
      hero; the card's right side is also clipped past the viewport
      because the card inherits the same overflowing parent column.
    viewport: 375x812
    screenshot_path: live-before/screenshots/home__375x812.png
    severity: critical
  - issue: |
      At desktop (1280, 1440) the hero takes only ~30% of viewport
      height and the dark navy panel dominates ~55% of viewport width —
      the twilight intracoastal image is barely visible. Hero feels
      small and pasted-on rather than full-bleed editorial.
    viewport: 1280x800, 1440x1000
    screenshot_path: live-before/screenshots/home__1440x1000.png
    severity: high
  - issue: |
      Orange/tan disclaimer strip directly below the floating search
      card ("DEMO listings shown") + the cream "WHERE MIA REPRESENTS
      BUYERS AND SELLERS." headline create a visual stacking jam under
      the hero. From a luxury-real-estate UX standpoint the hero
      doesn't breathe.
    viewport: 1280x800, 1440x1000
    screenshot_path: live-before/screenshots/home__1280x800.png
    severity: medium

seven_neighborhood_image_quality:
  deerfield-beach:
    screenshot_path: |
      docs/artifacts/cycle-40-world-class-visual-recovery/live-before/screenshots/markets_deerfield-beach__1280x800.png
      AND direct read of public/markets/deerfield-beach-cycle39.jpg
    visible_subject: |
      Wooden pier extending out over the Atlantic at golden hour,
      gentle surf in foreground, soft turquoise water gradient. Used
      as a full-bleed hero background on the /markets/deerfield-beach/
      detail page with a dark overlay panel carrying the copy.
    off_brand_or_off_topic_reason: none — pier is the canonical Deerfield landmark
    severity: pass
  hollywood:
    screenshot_path: direct read of public/markets/hollywood-cycle39.jpg
    visible_subject: |
      Hollywood Beach broadwalk with mature palms casting long shadows
      on brick pavers; soft turquoise water at the horizon.
    off_brand_or_off_topic_reason: none — Broadwalk is the canonical Hollywood landmark
    severity: pass
  plantation:
    screenshot_path: direct read of public/markets/plantation-cycle39.jpg
    visible_subject: |
      Royal-palm canopy over a quiet residential street, dappled
      sunlight on the road, lush emerald landscaping along curbs.
    off_brand_or_off_topic_reason: none — Plantation's palm streets are signature
    severity: pass
  weston:
    screenshot_path: |
      docs/artifacts/cycle-40-world-class-visual-recovery/live-before/screenshots/markets_weston__1280x800.png
      AND direct read of public/markets/weston-cycle39.jpg
    visible_subject: |
      Master-planned residential edge — mature oaks with Spanish moss,
      manicured lawn foreground, distant pond, golden-hour light.
    off_brand_or_off_topic_reason: none — Weston's master-planned suburb character
    severity: pass
  coral-springs:
    screenshot_path: direct read of public/markets/coral-springs-cycle39.jpg
    visible_subject: |
      Tree-lined boulevard with mature oak canopy and landscaped
      median, suburban roofline at horizon, warm golden hour.
    off_brand_or_off_topic_reason: none — canopy boulevards are Coral Springs' signature
    severity: pass
  davie:
    screenshot_path: |
      docs/artifacts/cycle-40-world-class-visual-recovery/live-before/screenshots/markets_davie__1280x800.png
      AND direct read of public/markets/davie-cycle39.jpg
    visible_subject: |
      Equestrian-trail white wooden rail fencing curving through tall
      Florida pasture grass, distant treeline, small pond, golden hour.
    off_brand_or_off_topic_reason: none — Davie's equestrian identity is its signature
    severity: pass
  sunrise:
    screenshot_path: direct read of public/markets/sunrise-cycle39.jpg
    visible_subject: |
      Lake at golden hour with palms framing left + right, lush
      tropical foreground landscaping, soft pastel sky reflection.
    off_brand_or_off_topic_reason: none — Sunrise has 19+ lakes and lake-community character
    severity: pass

other_site_issues_found:
  - The dark hero panel on /markets/deerfield-beach/, /markets/weston/,
    /markets/davie/ detail pages renders well at desktop; mobile (375)
    is harder to evaluate from headless captures (chrome --headless
    viewport clamping).
  - The "MEA SERVICE AREA" eyebrow vs "MIA SERVICE AREA" wording on
    the orange strip needs operator confirmation — I cannot read it
    clearly from the screenshot.
  - The Cycle 39 hero is the operator-authorized twilight composition.
    The miasanabria.com reference is a *daytime* composition. The mood
    divergence may be the actual creative complaint behind "off-brand".

visual_acceptance_baseline: |
  Cycle 40 must:
  (a) Fix mobile hero overflow at 375 (and 390, 430) — the dark panel
      must constrain to viewport, body copy must wrap fully, CTAs and
      floating search must be visible and tappable end-to-end.
  (b) Make the desktop hero feel intentional and premium — either
      enlarge the panel/image rebalance, or rebalance the dark overlay
      so the image earns its space.
  (c) Get an operator decision on twilight vs daytime hero composition.
  (d) NOT regenerate neighborhood images — they are good as-is unless
      the operator gives a specific creative direction.
```

## Visual descriptions (concrete, per viewport)

### Homepage `/` at 375x812 (CRITICAL)

What I see in the screenshot:
- Top: cream header bar with LPT logo + MIA SANABRIA / REALTOR · LPT REALTY
- Mid: dark navy gradient bleeding down behind the hero, then a darker
  navy rectangular panel containing:
  - small gold "SOUTH FLORIDA LIFESTYLE" eyebrow
  - serif H1 "SOUTH FLORIDA LIFESTYLE / HOME SEARCH"
  - body copy "Discreet, local guidance for Southeast Florida[...]"
    that truncates mid-line on the right — at least three lines of body
    are cut off about 20px before the viewport's right edge.
  - gold pill CTA "Search available homes →" — pill clips past right edge
  - outlined cream pill CTA "Talk with Mia" — pill clips past right edge
- Bottom: floating cream search card with NEIGHBORHOOD / MIN PRICE /
  BEDROOMS rows + gold "Search Listings" CTA. The card is cropped on
  the right edge.
- Right edge of every element terminates abruptly, not at the viewport
  edge but past it — visible "Florid", "qualified", and partial pill
  shapes confirm the overflow.

Bottom line: the hero is unreadable and untappable on mobile.

### Homepage `/` at 1280x800 (HIGH)

What I see:
- Header bar (cream)
- Hero band ~280px tall
- Dark navy panel taking up the left ~58% of the viewport
- Twilight intracoastal image visible on the right ~42% — but the panel
  is dark enough that the image-bleed-through is minimal even at /85.
- Floating cream search card stretched horizontally below the hero
- Thin orange/tan disclaimer strip
- "WHERE MIA REPRESENTS BUYERS AND SELLERS." cream headline section starts

Bottom line: hero feels cramped, panel dominates image, no breathing room.

### Homepage `/` at 1440x1000 (HIGH)

Same as 1280 but slightly more image visible on the right. Hero still
takes ~25-30% of viewport height — feels small for a luxury real-estate
landing.

### Markets index `/markets/` (PASS)

Functional, copy reads well at 1280; the page navigates between primary
markets / neighborhoods / northern Broward sections cleanly.

### Neighborhood detail `/markets/deerfield-beach/` at 1280 (PASS)

Hero image (pier-over-Atlantic) reads as the full background; dark
overlay panel on the left holds the title + body + 2 CTAs. Composition
is editorial-magazine standard.

### Neighborhood detail `/markets/weston/` at 1280 (PASS)

Hero image (master-planned oak/pond view) reads well; same overlay
pattern. Looks production-grade.

### Neighborhood detail `/markets/davie/` at 1280 (PASS)

Hero image (equestrian fence + pasture) reads well; same overlay
pattern. Looks production-grade.

## Recommendation to operator

1. **Fix the homepage hero overflow first** — concrete defect, blocks
   any visitor on a real phone. This is the highest-leverage fix in
   the cycle.
2. **Decide on twilight vs daytime hero composition** — this is the
   only image decision worth making. Neighborhood images are good.
3. **Skip the 21-phase mass-regeneration**. The pixels are already
   strong; rebuilding them risks regression and burns API tokens.
