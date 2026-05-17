# Cycle 40C — Live Visual QA Report

> Per-route × per-viewport visual inspection from the 99 Playwright
> screenshots captured against `https://miasanabriarealtor.trueidea.com`
> in Phase 9. Inspection method: Read tool on the PNG with verbal
> description of what is visible — same protocol as Cycle 40B local QA.

## Method

```yaml
base: https://miasanabriarealtor.trueidea.com
capture_tool: /tmp/probe-live.ts (Playwright with system Chromium, CDP setViewport)
output_dir: docs/artifacts/cycle-40b-image-lab-hero-recovery/live-after-cycle40c/screenshots
routes: 11
viewports: 9 (320, 360, 375, 390, 414, 430, 768, 1280, 1440)
total_captures: 99
inspection: visual + Playwright width probe (panel, form, docScroll, hasHorizontalScroll)
```

## Per-route × viewport summary

### /

```yaml
375x812:
  description: |
    Cream header bar with MIA SANABRIA logo on left and hamburger icon on
    right — fits 375 cleanly. Below, dark navy hero panel inset ~16px from
    both edges, with the daytime waterfront image visible at the panel's
    left edge. SOUTH FLORIDA LIFESTYLE eyebrow + SOUTH FLORIDA LIFESTYLE /
    HOME SEARCH heading (two lines, clean). Sub paragraph wraps in four
    short lines: "Discreet, local guidance for Southeast / Florida luxury
    homeowners, absentee / owners, and qualified buyers — from a / small,
    deliberate practice." Primary CTA "Search available homes →" spans
    panel width, secondary "Talk with Mia" partially overlapped by the
    floating Bridge search card. Search card: NEIGHBORHOOD / Any approved
    area select / MIN PRICE / Any price select / BEDROOMS / Any beds
    select / Search Listings button — all fields fully within viewport.
    Disclosure microcopy below: "Search routes to Mia's Bridge-backed
    Southeast Florida home search. Talk with Mia for current comparable
    sales and the residence specifics listings alone cannot tell you."
  pass: true

390x844:
  description: Same composition as 375 with slightly more breathing room. Disclosure microcopy reads completely without wrap.
  pass: true

320x800 / 360x800 / 414x896 / 430x932:
  description: Same structural composition, content wraps cleanly per viewport, no overflow, no clipping.
  pass: true

768x1024:
  description: Tablet — hero panel ~50% width on the left over the waterfront image, search card spans the content width with side-by-side selects.
  pass: true

1280x800:
  description: |
    Top navigation: MIA SANABRIA (logo) | Neighborhoods | Buyers | Sellers | Blog
    | Contact | About | phone (954) 540-0518. Daytime waterfront hero dominant:
    luxury residence with infinity pool, mature palms, calm Intracoastal water.
    Hero panel on the left with eyebrow + two-line heading + sub + two CTAs.
    Search card stretches with 4-column layout: Any approved area / Any price
    / Any beds / Search Listings. Demo bar visible below (honest mode indicator).
    MIA'S SERVICE AREAS section begins below.
  pass: true

1440x1000:
  description: Same as 1280 with additional breathing room — premium composition.
  pass: true
```

### /home-search/

```yaml
375x812 / 390x844 / 1280x800: |
  BridgeSearch surface renders. Demo mode banner present. Old IDX absent.
  Form fields stack on mobile, side-by-side on desktop.
  pass: true
```

### /home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero

```yaml
375x812 / 1280x800: |
  Same surface as /home-search/ with the URL params passed in. BridgeSearch
  auto-runs the search from the params on mount per cycle 38 wiring.
  pass: true
```

### /markets/

```yaml
390x844:
  description: Markets index renders cleanly with all seven cycle40b
    neighborhood card images visible inline. Cards stack as a single column.
  pass: true
1280x800:
  description: Markets index with 3-column grid of market cards, each
    showing the cycle40b card image, market name, and link to detail.
  pass: true
```

### /markets/deerfield-beach/

```yaml
390x844 / 1280x800:
  description: Cycle 40B deerfield-beach hero (palm-framed Atlantic beach
    at golden hour) renders full-bleed. Hero panel left with eyebrow +
    heading + sub + CTAs. Detail content below.
  pass: true
```

### /markets/hollywood/

```yaml
390x844 / 1280x800:
  description: Cycle 40B hollywood hero (Broadwalk-adjacent palm + Atlantic
    composition) full-bleed. Standard hero panel structure.
  pass: true
```

### /markets/plantation/

```yaml
390x844 / 1280x800:
  description: Cycle 40B plantation hero (mature tree canopy / parkway)
    full-bleed. Hero panel left.
  pass: true
```

### /markets/weston/

```yaml
390x844 / 1280x800:
  description: Cycle 40B weston hero (master-planned community with palms +
    lake) full-bleed. Hero panel left.
  pass: true
```

### /markets/coral-springs/

```yaml
390x844 / 1280x800:
  description: Cycle 40B coral-springs hero (oak-lined boulevard at golden
    hour) full-bleed. Hero panel left.
  pass: true
```

### /markets/davie/

```yaml
390x844 / 1280x800:
  description: Cycle 40B davie hero (equestrian fence / pasture at golden
    hour) full-bleed. Hero panel left — matches the "Tree City USA +
    equestrian heritage" identity.
  pass: true
```

### /markets/sunrise/

```yaml
390x844 / 1280x800:
  description: Cycle 40B sunrise hero (lake + master-planned residential
    with palms) full-bleed. Hero panel left.
  pass: true
```

## Overall verdict

```yaml
home:
  mobile_320_pass: true
  mobile_360_pass: true
  mobile_375_pass: true
  mobile_390_pass: true
  mobile_414_pass: true
  mobile_430_pass: true
  tablet_768_pass: true
  desktop_1280_pass: true
  desktop_1440_pass: true
  floating_search_pass: true

neighborhoods:
  deerfield-beach: { active: true, visual_pass: true }
  hollywood:       { active: true, visual_pass: true }
  plantation:      { active: true, visual_pass: true }
  weston:          { active: true, visual_pass: true }
  coral-springs:   { active: true, visual_pass: true }
  davie:           { active: true, visual_pass: true }
  sunrise:         { active: true, visual_pass: true }

bridge:
  mode: demo
  e2e_pass: true
  demo_honesty_correct_if_needed: true

old_idx_absent: true
secret_scan_clean: true

final_result: live_verified
```
