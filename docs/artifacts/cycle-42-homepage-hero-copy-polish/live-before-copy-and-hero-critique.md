---
cycle: 42
artifact: live-before-copy-and-hero-critique
generated_at: 2026-05-17
base: https://miasanabriarealtor.trueidea.com
---

# Cycle 42 — Live-Before Copy + Hero Critique

## Bad copy visible in live HTML

```yaml
bad_copy_visible: true
bad_copy_live_html_matches:
  home.html:
    "Search routes to Mia": 2
    "Bridge-backed": 2
    "listings alone cannot tell you": 2
    "residence specifics listings": 2
  _home-search_.html:
    "ownership history where available": 2  # legitimate body content on a different page; out of Cycle 42 scope
  _home-search__city_*_home-hero.html:
    "ownership history where available": 2  # same source; out of scope
bad_copy_variants_found:
  - "Search routes to Mia's Bridge-backed Southeast Florida home search. Talk with Mia for current comparable sales and the residence specifics listings alone cannot tell you."
  - (older "Search anchors to the Southeast Florida property-search section..." variant — NOT present in current live)
```

The Cycle 38-era Cycle 41-survived helper paragraph is live on the homepage hero search card. The older "Search anchors..." variant the brief flagged as possibly-cached is no longer in live HTML — only the current "Search routes to Mia's Bridge-backed..." variant. The double-count (x2) per phrase is the Next.js SSR pattern (rendered HTML + RSC inline payload).

The phrase `ownership history where available` appears on `/home-search/` HTML — but that is the home-search page's own body content, not the homepage hero search card. The brief explicitly scopes forbidden phrases "under the homepage hero search card." Cycle 42 will not touch `/home-search/` body copy.

## Screenshots inspected

```yaml
screenshots_inspected:
  - home @ 375x812: visually inspected (Read tool)
  - home @ 390x844: visually inspected (Read tool)
  - home @ 768x1024: visually inspected (Read tool via summary file list)
  - home @ 1280x800: visually inspected (Read tool)
  - home @ 1440x900: visually inspected (Read tool)
  - home-search @ 375/390/768/1280/1440: captured, not opened (out of Cycle 42 scope; baseline only)
```

## Hero layout still good?

```yaml
hero_layout_still_good: true
notes:
  - "Image is the visual anchor at 1280 and 1440 (waterfront house with palms, daytime light)."
  - "Dark navy panel is narrower than image — does not dominate at desktop widths."
  - "Floating search card is integrated (negative-margin float lands it cleanly half-over the hero image at 1280/1440)."
  - "Vertical rhythm tight — no accidental cream gap below the card before 'Mia's Service Areas'."
  - "At 375/390, the dark navy panel still covers most of the small mobile viewport (intrinsic mobile constraint, not a Cycle 42 regression). Image visible at top edge only. Cycle 41 baseline."
  - "Right-edge body-copy clipping at 375 ('Southeast Florida' cuts off mid-word) is the CDP-vs-real-device artifact classified by Cycle 40C/41 as non-defective. Operator phone test territory; not a Cycle 42 task."
```

## Helper copy visual problem (the headline issue)

The floating search card is otherwise production-grade. Below the four control row (Neighborhood / Min Price / Bedrooms / Search Listings) a small 11px paragraph reads:

> Search routes to Mia's Bridge-backed Southeast Florida home search. Talk with Mia for current comparable sales and the residence specifics listings alone cannot tell you.

Three independent problems:

1. **Implementation-facing.** "Bridge-backed" and "routes to" are internal infrastructure language. A luxury-real-estate buyer should never see the data-provider name in the hero.
2. **Grammar/parse fail.** "the residence specifics listings alone cannot tell you" reads as broken English — the noun "specifics" and the gerund/clause "listings alone cannot tell you" fight for the same syntactic slot.
3. **Hedge-y framing.** "Talk with Mia for..." reads like a footnote disclaimer rather than an invitation to begin a search.

Combined effect: a polished hero with a bug-tracker comment dropped underneath.

## Other homepage issues found

```yaml
other_homepage_issues_found:
  - "None in Cycle 42 scope. Hero layout, image, panel, CTAs, search card geometry, post-hero rhythm all read as Cycle 41 production-grade."
  - "At 375 the dark panel still covers most of the hero image — this is the structural Cycle 38→41 mobile decision (panel-over-image vs panel-beside-image). Operator-territory; not a Cycle 42 closure."
  - "Right-edge body-copy clipping at 375 — already classified by Cycle 40C/41 as CDP --window-size artifact, not real-device defect."
```

## Must fix

```yaml
must_fix:
  - "Replace OR remove the 11px helper paragraph at src/components/HeroSearch.tsx:135-139."
  - "Clean the implementation-loaded header comment at src/components/HeroSearch.tsx:5-12 ('Bridge-backed `/home-search/` page')."
  - "Add scripts/audit-home-hero-copy.ts to guard against regression."
  - "Wire `audit:home-hero-copy` in package.json."
  - "Verify gone in source, in out/, and in live HTML after deploy."
```

## Decision on replacement copy (final)

Selecting Option C from `goal-stack.md`:

> Begin with an area, price range, and bedroom count. Mia will help you interpret the listings, neighborhoods, and details behind the search.

This will be re-confirmed visually at local-after capture. If the card visibly reads stronger without any helper paragraph, the paragraph is removed and `helper-copy-implementation-report.md` records the decision.
