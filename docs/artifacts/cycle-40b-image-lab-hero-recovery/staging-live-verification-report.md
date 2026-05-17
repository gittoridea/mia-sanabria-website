# Cycle 40C — Staging Live Verification Report

> Truth-test of the staging deploy at `https://miasanabriarealtor.trueidea.com`
> after Phase 8 completed (EXIT_CODE:0, 172s deploy, needle present).

## Deployed-commit verification

```yaml
staging_base: https://miasanabriarealtor.trueidea.com
deployed_commit: d851494deede38e0692f17faf22f7e8d90fb861d  # confirmed via cycle40b data-marker grep on live HTML
origin_main:     d851494deede38e0692f17faf22f7e8d90fb861d
deployed_commit_equals_origin_main: true
deploy_log: docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-cycle40c-20260516-221822.log
deploy_exit_code: 0
deploy_duration: 172 seconds
dokploy_post_issued: true
needle_verified: true   # "South Florida Lifestyle" present after ~0s
live_etag: "diklqh3jne2o541d"
live_last_modified: Sun, 17 May 2026 02:38:39 GMT
deploy_verify_warning:
  - "last-modified did not change between pre/post — likely a Caddy cache-control variance, not a deploy miss.
     Cycle 40C re-verification via cycle40b-specific markers (homepage data-hero-overflow-version=cycle40b,
     data-hero-search-version=cycle40b, data-hero-cta-version=cycle40b, data-hero-copy-panel-version=cycle40b,
     hero asset /hero/mia-home-hero-cycle40b.jpg, all seven /markets/<slug>-cycle40b.jpg paths) confirms the
     d851494 commit IS the deployed code."
```

## Live cycle40b marker presence

```yaml
homepage:
  data_hero_overflow_version: "cycle40b"       # present
  data_hero_search_version:   "cycle40b"       # present
  data_hero_cta_version:      "cycle40b"       # present
  data_hero_copy_panel_version: "cycle40b"     # present
  hero_image_src: "/hero/mia-home-hero-cycle40b.jpg"  # present

markets_index:
  cycle40b_image_paths_present:
    - /markets/coral-springs-cycle40b.jpg
    - /markets/davie-cycle40b.jpg
    - /markets/deerfield-beach-cycle40b.jpg
    - /markets/hollywood-cycle40b.jpg
    - /markets/plantation-cycle40b.jpg
    - /markets/sunrise-cycle40b.jpg
    - /markets/weston-cycle40b.jpg
  cycle39_image_paths_present: none

markets_detail_pages:
  deerfield-beach: /markets/deerfield-beach-cycle40b.jpg present
  hollywood:       /markets/hollywood-cycle40b.jpg present
  plantation:      /markets/plantation-cycle40b.jpg present
  weston:          /markets/weston-cycle40b.jpg present
  coral-springs:   /markets/coral-springs-cycle40b.jpg present
  davie:           /markets/davie-cycle40b.jpg present
  sunrise:         /markets/sunrise-cycle40b.jpg present
```

## Live layout probe (Playwright with system Chromium)

```text
vp=320   panel=288   docScroll=320   hasHorizontalScroll=false   form=288   hero=/hero/mia-home-hero-cycle40b.jpg
vp=360   panel=328   docScroll=360   hasHorizontalScroll=false   form=328   hero=/hero/mia-home-hero-cycle40b.jpg
vp=375   panel=343   docScroll=375   hasHorizontalScroll=false   form=343   hero=/hero/mia-home-hero-cycle40b.jpg
vp=390   panel=358   docScroll=390   hasHorizontalScroll=false   form=358   hero=/hero/mia-home-hero-cycle40b.jpg
vp=414   panel=382   docScroll=414   hasHorizontalScroll=false   form=382   hero=/hero/mia-home-hero-cycle40b.jpg
vp=430   panel=398   docScroll=430   hasHorizontalScroll=false   form=398   hero=/hero/mia-home-hero-cycle40b.jpg
vp=768   panel=672   docScroll=768   hasHorizontalScroll=false   form=736   hero=/hero/mia-home-hero-cycle40b.jpg
vp=1280  panel=672   docScroll=1280  hasHorizontalScroll=false   form=1216  hero=/hero/mia-home-hero-cycle40b.jpg
vp=1440  panel=672   docScroll=1440  hasHorizontalScroll=false   form=1280  hero=/hero/mia-home-hero-cycle40b.jpg
```

Identical to the local Playwright measurements before deploy. Panel respects viewport. No horizontal scroll. Hero asset confirmed live across all viewports.

## Live audit gates

```yaml
audit:no-old-idx:               PASS (480 files scanned)
audit:home-bridge-search:       8/8 PASS
audit:image-creative-acceptance: PASS — 7/7 slugs + all docs present
audit:neighborhood-images-deep: PASS — 23/23 markets (run pre-commit, image paths unchanged after deploy)
audit:images:                   PASS — 14/14, 0 WARN, 0 FAIL — both everyMarketCardImagePresent + everyMarketPageHeroImagePresent green
secret_scan_live_html:          CLEAN (11 routes fetched, 0 matches in /staging-html/cycle40c-final/)
old_idx_live_html_scan:         CLEAN (no mlsmatrix.com / sef.mlsmatrix.com references)
```

## Live Bridge E2E

```yaml
e2e_pass: true
result: 11/11 PASS, 0 FAIL
mode: demo                                          # honest demo posture on the deployed env
old_idx_absent: true
demo_honesty_correct_if_needed: true                # demo banner present per Cycle 33B doctrine
```

## Visual inspection summary (Playwright screenshots)

```yaml
total_screenshots: 99 (11 routes × 9 viewports)
inspected:
  - home @ 375x812: PASS — clean mobile, panel respects viewport, sub wraps cleanly, CTAs full-width, search card fits
  - home @ 390x844: PASS — same composition, slightly more breathing room
  - home @ 1280x800: PASS — premium desktop, daytime waterfront hero dominant, 4-column search card
  - market-deerfield-beach @ 1280x800: PASS — golden-hour beach + palm composition, on-topic
  - market-hollywood @ 1280x800: PASS — Broadwalk-adjacent palm + Atlantic composition
  - market-plantation @ 1280x800: PASS — tree canopy / mature parkway composition
  - market-weston @ 1280x800: PASS — master-planned community with palms + lake
  - market-coral-springs @ 1280x800: PASS — oak-lined boulevard composition
  - market-davie @ 1280x800: PASS — equestrian fence / horse-corridor composition
  - market-sunrise @ 1280x800: PASS — lake + master-planned residential composition
```

All seven Cycle 40B images read as editorial real-estate photography on-topic for each neighborhood's known character. No visible AI artifacts at this resolution.

## Overall verdict

```yaml
staging_live_verified: true
production_changed:    false
final_deployed_commit_equals_origin_main: true
secrets_safe:          true
old_idx_absent:        true
hero_mobile_safe:      true
bridge_truthful:       true
images_visually_acceptable: true
remaining_external_gate: real-device + Mia subjective review (operator territory)
```
