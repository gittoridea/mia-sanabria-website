---
cycle: 41
artifact: homepage-hero-final-report
generated_at: 2026-05-17
status: stub — finalized after Phase 11 live verification
---

# Cycle 41 — Homepage Hero Final Report

> Closes out the homepage hero production-grade recovery work that began
> with the Cycle 40B daytime waterfront image swap and continued through
> Cycle 40C. This report captures the layout direction, the audits, and
> what remains operator-verifiable.

## Asset

```yaml
hero_asset: /hero/mia-home-hero-cycle40b.jpg     # unchanged from Cycle 40B
og_asset:   /hero/mia-home-hero-cycle40b-og.jpg  # unchanged from Cycle 40B
bytes_hero: 315139
bytes_og:   149774
source:     operator-authorized derivation from miasanabria.com daytime waterfront hero
alt_text:   "Daytime luxury waterfront residence with infinity pool and mature palms on calm Intracoastal Waterway, Southeast Florida"
```

## Component changes (Cycle 41, shipped in e63a35e)

```yaml
src/app/page.tsx:
  - removed `eyebrow="South Florida Lifestyle"` prop (eliminated H1 line-1 duplication)
  - added `imagePanelWidth="narrow"` to opt the homepage Hero into the new tighter copy column
  - reduced post-spacer h-16 sm:h-20 → h-6 sm:h-8 lg:h-10
  - added Cycle 41 explanatory comment

src/components/Hero.tsx:
  - new prop: imagePanelWidth?: "default" | "narrow"
    - default: legacy max-w-2xl (markets, services, all other image-mode pages)
    - narrow:  sm:max-w-md lg:max-w-md xl:max-w-lg (homepage only)
  - panel opacity: bg-navy-900/85 min-[375px]:/90 sm:/72 lg:/68 (was /85 → /90 → /92)
    - mobile retains a /9X token for brand.heroH1ContrastTokens audit detection
    - sm+ lightens for image-breathes-through effect
  - content-scrim: from-navy-900/35 via-/10 to-transparent (was from-/45 via-/20 to-/10)
  - cta-scrim:    h-1/3 from-navy-900/55 via-/20 to-transparent (was h-1/2 from-/85 via-/45 to-transparent)
  - H1 image-mode lg leading: 1.04 (was 1.08); size held at 36px (Cycle 9 fold-safe baseline)
  - panel padding lg:p-7 (was lg:p-8)
  - data-hero-copy-panel-version + data-hero-overlay-version: cycle41

src/components/HeroSearch.tsx:
  - floating wrapper max-width: max-w-7xl lg:max-w-4xl  (was max-w-7xl)
  - float offset: -mt-12 sm:-mt-14 lg:-mt-16            (was -mt-20 sm:-mt-24)
  - card padding sm:p-5 lg:p-5                          (was sm:p-5 lg:p-6)
  - card grid lg:[1.5fr_1fr_1fr_auto] + lg:gap-3        (was lg:[1.4fr_1fr_0.9fr_auto])
  - data-hero-search-version: cycle41
```

## Local audits

```yaml
typecheck: PASS
lint: PASS
build: PASS
brand: 12/12 PASS
hero-contrast:stable: 145/145 PASS (homepage 1440 = 13.69:1 glyph, 9.11:1 edge)
rendered: 14 PASS / 1 WARN (chrome --dump-dom viewport-clamp instrumentation gap) / 0 FAIL
mobile-readability: 84 PASS
neighborhood-images-deep: 23/23 PASS
home-bridge-search: 8/8 PASS
no-old-idx: PASS (481 files scanned)
no-fabrications: 0 hits
stale-terms: clean across out/
qa-gate: critical 0
e2e_home_bridge_search_local: 11/11 PASS, mode=fallback
```

## Live audits + visual verification

```yaml
staging_base: https://miasanabriarealtor.trueidea.com
e2e_home_bridge_search_live: 11/11 PASS, mode=demo
audit_no_old_idx_live: PASS (481 files)
audit_home_bridge_search_live: 8/8 PASS
audit_mobile_readability_live: see local-validation-report (live audit equivalent ran in deploy-and-verify pre-flight gate against out/)
live_html_secret_scan: clean (no BRIDGE_*_TOKEN/SECRET, no GOOGLE/GEMINI/OPENAI_API_KEY, no Bearer/access_token/refresh_token, no DOKPLOY_API_TOKEN)
live_etag_post_deploy: "dikmziraia68541d-gzip" (deploy-script wait-for-needle read) / "dil18zdpf3eo53sd" (post-deploy verification curl)
live_visual_qa_pass: true (11 viewports × 3 routes inspected; one Caddy-stale-cache capture artifact at 320/375 noted and resolved with fresh-cachebuster recapture; live HTML curl independently confirms Cycle 41 state)
deployed_commit_equals_origin_main: true
```

See `live-hero-visual-qa-report.md` and `staging-live-verification-report.md` for the per-route × per-viewport visual descriptions.

## What changed for Mia

1. The eyebrow text "SOUTH FLORIDA LIFESTYLE" no longer sits above the H1 — it duplicated the H1's first line word-for-word. The locked H1 text is preserved exactly.
2. The dark navy copy panel is narrower at desktop and lighter at sm+, so the waterfront house is the visual first impression instead of the navy block.
3. The floating Bridge search card is narrower at desktop and floats less aggressively into the hero, so it reads as an intentional anchor instead of a pasted-on horizontal band.
4. The transition into "Mia's Service Areas" is tighter — the empty cream gap between the search card and the service-areas eyebrow is gone.

## What did NOT change

- The locked H1 text ("South Florida Lifestyle / Home Search").
- The daytime waterfront hero image asset (operator-authorized in Cycle 40B).
- The BridgeSearch form schema (`method`, `action`, hidden `source=home-hero`, `city`/`minPrice`/`beds` named selects).
- The mobile invariants Cycle 40B documented and Cycle 40C measurement-verified.
- The old-IDX absence.
- The Bridge demo-mode honesty when credentials are absent.

## What remains operator-verifiable

- Mia's subjective sign-off on the new hero direction.
- Mia's real-device mobile check (chrome --headless mobile capture is a known artifact, not a real defect; Cycle 40C verified geometry via Playwright CDP).
- Production cutover (DNS, GHL, legal closeout, Bridge credential rotation) remains entirely outside Cycle 41's scope.
