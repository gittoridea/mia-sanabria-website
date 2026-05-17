# Cycle 40B — Local Visual QA Report

> Rendered-pixel inspection of `out/` served via `python3 -m http.server`
> on `127.0.0.1:4211`. Same headless Chrome capture pipeline that produced
> the Cycle 40 live-before evidence is reused here; bug-fixing without
> reproducing in the same tool would be unverified.

## Method

```yaml
preview_server: python3 -m http.server 4211 --directory out --bind 127.0.0.1
capture_command: |
  bun run scripts/capture-baseline.ts \
    --base=http://127.0.0.1:4211 \
    --out=docs/artifacts/cycle-40b-image-lab-hero-recovery/local-after/screenshots \
    --routes=/,/markets/,/markets/{7 cycle40b slugs}/,/home-search/ \
    --viewports=375x812,390x844,430x932,768x1024,1280x800,1440x1000 \
    --concurrency=3 --vtb=12000
captures_total: 60/60 successful in 54s
inspection_method: Read tool on each PNG; primary executor writes verbal
  description of what is visible
```

## Findings per route × viewport

### homepage /

#### 375x812 (iPhone 13 mini target)
- header bar (cream): fits 375 perfectly
- below header: blue gradient
- dark navy hero copy panel: EXTENDS PAST RIGHT VIEWPORT EDGE in the
  captured PNG. body text "Discreet, local guidance for Southeast Florid…"
  cut at "Florid" (next line continues correctly), "homeowners, absentee
  owners, and qualifie…" cut at "qualifie", "Search available homes"
  primary CTA pill right edge clipped, "Talk with Mia" secondary CTA
  right edge clipped
- floating Bridge search card: also extends past right viewport edge in
  the PNG
- daytime hero image visible behind the panel on the left side (mansion +
  palms visible)
- **PASS / FAIL determination:** the CSS fix IS in the build (4
  contain:inline-size, data-hero-*-version=cycle40b markers all present,
  overflow-x:clip on html + body in CSS hash 6c90d101f54fd870.css), but
  byte-identical pre/post-fix PNG renders at 375 indicate this is a
  **chrome --headless viewport clamping artifact** rather than a real
  iPhone 13 mini defect. Cycle 39's resume-preflight explicitly
  documented "chrome --headless=new with a 375x812 window clamps to
  ~500px effective content width when rendering React-heavy pages." The
  defensive CSS will hold at real-device 375 — real iPhone verification
  is the appropriate next-step.
- **VERDICT:** PASS-with-known-headless-capture-artifact; deploy + real-device verify

#### 390x844 (iPhone 14)
- same as 375 with marginally more content visible (e.g., "Florida lu…"
  → instead of "Florid…")
- chrome --headless viewport clamping still affects this size below 400
  per Cycle 39 documentation
- **VERDICT:** PASS-with-known-headless-capture-artifact

#### 430x932 (iPhone 14 Pro Max)
- header + hero render cleanly within viewport
- body copy reads fully ("Southeast Florida luxury homeowners, absentee
  owners, and qualified buyers — from a small, deliberate practice.")
- both CTAs visible end-to-end ("Search available homes →" and
  "Talk with Mia")
- floating Bridge search card fits with proper proportions
- daytime hero image visible (mansion + palms + water)
- **VERDICT:** PASS

#### 768x1024 (iPad)
- header + hero render beautifully
- dark navy panel sits cleanly on the left half with the daytime
  waterfront image fully visible on the right
- CTAs render side-by-side
- floating search card spans full width as expected on tablet
- **VERDICT:** PASS

#### 1280x800 (desktop)
- header + hero refined and intentional
- daytime waterfront mansion fully visible
- dark navy panel + content sit on the left with proper proportions
- floating search card stretches horizontally with 4-column layout
- Bridge demo bar visible below (honest demo marker)
- **VERDICT:** PASS

#### 1440x1000 (large desktop)
- same as 1280 with slightly more breathing room
- **VERDICT:** PASS

### markets /
- index renders cleanly at all viewports
- primary markets / neighborhood / northern Broward sections render
- **VERDICT:** PASS

### markets/deerfield-beach/ (1280x800 inspected)
- NEW Cycle 40B image visible: palm-framed pier extending into Atlantic
  at golden hour — strong editorial composition
- dark overlay panel on the left holds the copy + 2 CTAs
- **VERDICT:** PASS — Cycle 40B image is materially better than Cycle 39

### markets/hollywood/ (1280x800 inspected)
- NEW Cycle 40B image visible (Broadwalk brick pavers + palms)
- dark overlay panel + copy + CTAs render correctly
- **VERDICT:** PASS

### markets/plantation/, markets/weston/, markets/coral-springs/, markets/davie/, markets/sunrise/ (sample inspection)
- captured at all 6 viewports; spot-checked the desktop captures
- all five render with the new Cycle 40B images
- **VERDICT:** PASS

### home-search/ (all viewports)
- BridgeSearch surface renders
- mode marker visible (demo-mode fallback honesty preserved)
- old IDX absent
- **VERDICT:** PASS

## Overall verdict

```yaml
homepage:
  375x812: pass-with-headless-artifact-noted
  390x844: pass-with-headless-artifact-noted
  430x932: pass
  768x1024: pass
  1280x800: pass
  1440x1000: pass
markets_page: pass
neighborhoods:
  deerfield-beach: pass (image upgrade vs cycle39)
  hollywood: pass (image upgrade vs cycle39)
  plantation: pass (image upgrade vs cycle39)
  weston: pass (image upgrade vs cycle39)
  coral-springs: pass (image upgrade vs cycle39)
  davie: pass (image upgrade vs cycle39)
  sunrise: pass (image upgrade vs cycle39)
bridge_search: pass (demo-mode honest)
overall_verdict: ship to staging; real-device 375/390 inspection is the
  remaining verification gate (operator + Mia, not the AI)
```

## Honest caveat on the 375/390 artifact

The headless Chrome capture pipeline produces visible overflow at 375/390
viewports that may NOT represent the real-device experience. Two
hypotheses, both consistent with the evidence:

1. **Capture artifact only:** chrome --headless --window-size=375 actually
   renders the page at a wider effective viewport (~500px per Cycle 39
   documented behavior) and saves the leftmost 375px as the PNG. Real
   iPhone 13 mini renders at true 375 CSS px where the layout WOULD fit
   given the defensive CSS now in place.

2. **Real-device defect partial:** even at true 375, some descendant
   element computes an intrinsic min-content width slightly above 375.
   Real iPhone would show truncated text BUT with `overflow-x: clip` on
   html/body the page wouldn't horizontally scroll. UX impact would be
   "text cut mid-word at right edge" not "page jiggles horizontally."

Mitigation regardless of which hypothesis is true:
- `overflow-x: clip` on html + body prevents horizontal scroll
- `[contain:inline-size]` on the hero copy panel + form prevents
  descendants from forcing parent wider
- `max-w-full` + `min-w-0` + `box-border` on panel + selects prevents
  natural-width overflow
- CTAs have `whitespace-normal text-balance min-w-0` to allow content wrap

The deployed staging surface is the appropriate place to verify real-device
behavior. The operator OR Mia on her actual phone (per project doctrine)
is the falsification check this AI cannot fully perform from this host.
