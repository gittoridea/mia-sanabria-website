---
cycle: 42
artifact: live-visual-qa-report
generated_at: 2026-05-17
base: https://miasanabriarealtor.trueidea.com
---

# Cycle 42 — Live Visual QA Report

Source: `docs/artifacts/cycle-42-homepage-hero-copy-polish/live-after/screenshots/`
Method: `google-chrome --headless=new --window-size=<viewport> --virtual-time-budget=15000`
Comparison baseline: live-before screenshots (same viewports), captured before Cycle 42 commit.

## Per-viewport inspection (home `/` on live staging)

```yaml
375x812:
  pass: true
  visual_description: |
    Live-after identical in geometry to live-before. Top: logo +
    REALTOR® · LPT REALTY. Hero panel "SOUTH FLORIDA LIFESTYLE /
    HOME SEARCH" with body copy + two CTAs. Search card below with
    Neighborhood/Min Price/Bedrooms/Search Listings. Helper
    paragraph below the search-button row is below the 812-tall
    capture fold — same as live-before, same as local-after. No
    regression.

390x844:
  pass: true
  visual_description: |
    Same as 375 with marginally more horizontal breathing room.
    Body-copy right-edge clipping matches live-before (CDP
    --window-size artifact, not a real-device defect — classified
    by Cycle 40C/41).

768x1024:
  pass: true
  visual_description: |
    Two-up form layout activated (Neighborhood + Min Price row 1;
    Bedrooms + Search Listings row 2). Helper paragraph renders
    below the form. Hero image visible behind a narrower navy panel.
    Layout identical to local-after capture.

1280x800:
  pass: true
  visual_description: |
    Desktop reference frame. Hero image (waterfront house with
    palms, daytime light) anchors the right side; navy panel
    on the left is narrower than the image, with CTAs ("Search
    available homes" + "Talk with Mia"). Floating search card
    integrates cleanly via Cycle 41's max-w-4xl + -mt-12 sm:-mt-14
    lg:-mt-16 float. The new helper paragraph reads as TWO short
    lines beneath the four-control row, in 11px navy-800/65 type.
    Card no longer reads as "admin row with bug-tracker footnote";
    it reads as a hosted invitation. Mia's Service Areas heading
    visible at bottom — vertical rhythm preserved.

1440x900:
  pass: true
  visual_description: |
    Same as 1280 with additional desktop breathing room. Hero
    geometry unchanged from Cycle 41. Helper paragraph in same
    slot, same type, same color. "MIA'S SERVICE AREAS" header
    visible at bottom of capture. No regression.
```

## Hero layout regression: none

Live-after matches live-before geometry exactly. The only delta is the helper paragraph text content. Image, dark panel width, CTA buttons, search-card max-w, search-card padding, float offsets, post-hero spacer — all unchanged.

## Search card regression: none

Form action `/home-search/` preserved, hidden `source=home-hero` input preserved, three select controls (city / minPrice / beds) preserved, Search Listings button preserved with the same icon and gold-fill styling. The helper paragraph is now a clean two-line consumer invitation; the prior three-line implementation-facing paragraph is gone.

## Bad-copy removal (live HTML, cache-busted)

Confirmed via `curl -sL -H "Cache-Control: no-cache" "https://miasanabriarealtor.trueidea.com/?cb=<hex>"` and `grep -oF`:

```
- "Search routes to":                   0 occurrences
- "Bridge-backed":                       0 occurrences
- "Search anchors":                      0 occurrences
- "property-search section":             0 occurrences
- "listings alone cannot tell you":      0 occurrences
- "residence specifics listings":        0 occurrences
- "participating brokerages":            0 occurrences
- "Begin with an area" (NEW):            2 occurrences   # SSR + RSC pair
```

## Bridge UI at /home-search/

Live screenshots at 1280/1440 show the BridgeSearch surface rendering with the demo-banner mode (orange-amber callout above the form: "Demo data — Bridge test fixture connected. This staging page is connected to a Bridge Data Output test fixture so we can verify the integration end-to-end..."). Demo honesty preserved.

## /home-search/ with home-hero params

Live screenshots at 1280/1440 for `/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero` show the BridgeSearch's URL-param consumption working — the "City" dropdown is pre-filled to Fort Lauderdale, "Min price" to $1M+, "Bedrooms" to 3+. End-to-end form-to-Bridge URL-param wiring is intact.

## Verdict

Live staging at `https://miasanabriarealtor.trueidea.com/` reflects the Cycle 42 fix cleanly. No visual regressions vs Cycle 41 baseline. The homepage hero card now reads as production-grade consumer-facing copy. The cycle's primary acceptance criterion (visible bad helper copy gone, replacement copy professional) is met live.
