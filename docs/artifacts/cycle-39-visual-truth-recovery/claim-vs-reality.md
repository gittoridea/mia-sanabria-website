# Cycle 39 — Claim vs Reality

date: 2026-05-16

A focused, AI-honest scorecard against Cycle 39's hard completion standard
(the 16-item list in the mission brief).

## Brief's hard completion standard — Cycle 39 reality

| # | Mission requirement | Cycle 39 status |
|---|---------------------|------------------|
| 1 | Seven neighborhood images visibly update on live dev site | code+assets versioned; visible-update certainty depends on operator browser; staging probe Phase 12 |
| 2 | Seven neighborhood images use NEW VERSIONED asset paths | DONE — `/markets/<slug>-cycle39.jpg`, `/og-markets/<slug>-cycle39.jpg` for all 7 |
| 3 | `/markets/` live DOM references the new versioned card image paths for all seven | local build verified (out/markets/index.html grep matches all 7); staging probe Phase 12 |
| 4 | Each `/markets/<slug>/` live DOM references the new versioned hero image path | local build verified (out/markets/<slug>/index.html grep matches); staging probe Phase 12 |
| 5 | New image paths return HTTP 200 live and decode in real browser with naturalWidth > 0 | local files exist + sized 199 KB to 405 KB JPEG; live HEAD probe Phase 12 |
| 6 | Visual screenshots confirm images display correctly at 4 viewports | local-after capture (20 screenshots) DONE; staging capture Phase 12 |
| 7 | Homepage hero restored / rebuilt to target visual standard | mobile panel-opacity + sub-text-overflow fix landed; locked twilight composition + locked H1 preserved; daytime-hero swap deferred to operator |
| 8 | Homepage hero search floats without clipping/overlap mobile/tablet/desktop | floating card preserved; panel opacity reduction lets hero image bleed through reducing perceived overlap conflict |
| 9 | Homepage search verified end-to-end in live browser | local E2E 11/11 PASS via google-chrome --headless; staging Phase 12 |
| 10 | Bridge referrer-domain update re-tested | sanitized presence-check only (operator confirmed referrer domains in Cycle 38 brief). LIVE flip remains externally blocked |
| 11 | Old IDX / MLS Matrix runtime remains absent | audit:no-old-idx PASS (480 files); manual grep PASS |
| 12 | All validation gates pass | 27 gates green, 0 critical findings, 4 pre-existing high carry-overs unchanged |
| 13 | Changes committed, pushed, deployed, verified live | committed `889b2c2`, pushed, deploy in flight, live verify Phase 12 |
| 14 | Final deployed commit equals origin/main HEAD | will assert in `final-deploy-alignment-report.md` after Phase 14 |
| 15 | No secrets printed, committed, logged, or exposed | secret scan clean source + staged + out/ (variable NAMES only) |
| 16 | No production DNS/GHL/Google/Bridge credential rotation | confirmed — only `miasanabriarealtor.trueidea.com` touched |

## What Cycle 39 closed fully (AI-closeable)

- Versioned-path republish of seven neighborhood card+OG images and the
  homepage hero — defeats the silent-cache-failure class that Cycle 38
  hid behind structural PASS checks.
- Helpers (`getMarketImagePath`, `getMarketOgImagePath`) + audit
  enforcement (`MIA_CYCLE_39_VERSIONED_SLUGS` + live-DOM scan) make any
  future regression to unversioned paths a hard FAIL.
- Mobile hero copy panel opacity + sub-text width fix — operator's
  reported "hero regressed" defect class addressed without touching the
  locked H1 or the operator-authorized twilight composition.
- New `scripts/test-home-search-bridge-e2e.ts` proves the JS path
  Cycle 38 left unverified — 11/11 PASS locally.
- New `scripts/probe-reference-hero-visual.ts` enumerates all hero
  candidates on miasanabria.com (not just og:image) and surfaces the
  composition divergence Cycle 38 missed.
- Hardened `audit:neighborhood-images-deep` honors the
  `MIA_CYCLE_39_VERSIONED_SLUGS` set and live-HTML versioned-path
  enforcement.
- 23 audit gates + 1 E2E test all green local; commit + push DONE.

## What is in flight (will close at Phase 12 post-deploy)

- Staging-live verification of all 7 versioned image paths.
- Staging-live E2E homepage-search-to-Bridge test.
- Staging visual QA screenshots (live-after capture).
- Final deploy-alignment if a post-deploy docs-only commit lands.

## What remains externally blocked

- Bridge live mode activation (operator Dokploy build args).
- Production cutover (DNS, GHL endpoints, branded email).
- Mia's visual approval of the Cycle 39 staging treatment.
- Operator decision on twilight-vs-daytime hero composition (the
  reference probe surfaced the divergence; operator chooses).

## Honesty notes

- Cycle 39 supersedes Cycle 38's "live_verified" claim for the seven
  neighborhood images and the homepage hero — Cycle 38's PASS was
  structurally true but operator-visually false; Cycle 39's versioned
  URLs eliminate the silent-cache failure class.
- Cycle 39 makes no claim about Bridge live mode (still demo on staging
  per Cycle 38). The mode marker rendered after deploy will be the
  authoritative classification.
- The reference-hero divergence finding is the most consequential new
  signal of this cycle. Operator may want to act on it; Cycle 39 records
  the option without taking it.
