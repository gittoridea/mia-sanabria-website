# Cycle 13 — Process Upgrade Report

**Date:** 2026-05-10
**Mission:** Cycle 13 — Add Bay Colony + Bermuda Riviera; final production refinement
**Skill version:** v0.3.4 → v0.3.5

## Durable lessons surfaced this cycle

### 1. Adding a market is a 10-touch operation, not a 1-touch

The Mia site's data-driven market system means a new market is not "add a slug + image". The actual touch surface:

| Touch | File | Purpose |
|---|---|---|
| 1 | `src/lib/mia.ts` `ALL_MARKET_SLUGS` | type-narrowed slug union |
| 2 | `src/lib/mia.ts` `FEATURED_SET` | homepage Featured Markets membership (optional per market) |
| 3 | `src/lib/markets.ts` `MARKETS` | full Market entity (intro/highlights/lifestyle/priceCharacter/lat-lng/heroImage/localContext/county/aeoAnswer/propertyTypes/buyerGuidance/sellerGuidance/5 FAQs/2-4 internalLinks) |
| 4 | `src/app/markets/page.tsx` `PRIMARY_SLUGS` or `NEIGHBORHOOD_SLUGS` | partition assignment for /markets/ index |
| 5 | `src/app/markets/[slug]/page.tsx` `easternBrowardSlugs` | cohort treatment for the related-section heading |
| 6 | `public/markets/<slug>.jpg` | 1200×1500 progressive JPEG hero |
| 7 | `public/og-markets/<slug>.jpg` | 1200×630 progressive mozjpeg OG image |
| 8 | `scripts/audit-completeness.ts` `MARKET_PAGES` | route list |
| 9 | `scripts/audit-images.ts` `marketSlugs` + `expectedFeatured` (if featured) + description string | asset inventory + featured-card check |
| 10 | `scripts/audit-rendered-visual.ts` + `scripts/audit-hero-pixel-contrast.ts` + `scripts/capture-baseline.ts` | route lists for screenshot/contrast/baseline coverage |

**Auto-pickup (no edit needed):** `src/app/sitemap.ts` (derives from MARKETS); `[slug]/page.tsx` `generateStaticParams` (derives from MARKETS); homepage Featured Markets renderer (derives from FEATURED_MARKETS).

**Reverse-link curation:** added markets get `internalLinks` to peer cohort. Reverse links — peer markets gaining links to the new ones — are NOT auto-generated and may need case-by-case curation in a follow-up cycle (NOT done in Cycle 13; the new markets link out to peers but peer markets do not yet link back).

### 2. Hero `intro` length has a soft cap at ~370 chars to keep desktop CTA above the 1280×800 fold

`audit:rendered.hero.primaryCtaAboveFoldDesktop` measures whether the primary CTA bbox `top` < 800 at 1280×800. The market-page Hero is a split-panel layout where the copy panel grows vertically with the `tagline` (heading) + `intro` (sub). Cycle 13 found:

| Market | Intro chars | Verdict at 1280×800 |
|---|---:|---|
| Las Olas Isles | 313 | PASS |
| Coral Ridge | ~280 | PASS |
| Harbor Beach | ~330 | PASS |
| Bay Colony | 374 | PASS |
| Bermuda Riviera (initial) | 437 | **FAIL** |
| Bermuda Riviera (corrected) | 311 | PASS |

**Empirical soft cap:** ~370 chars combining tagline + intro to keep CTA above fold at 1280×800. The check is automated by the existing audit, but a pre-commit lint that flags `intro.length > 370` would catch this BEFORE build, saving a build → audit → rebuild loop.

### 3. Image-generation pipeline at `/tmp/mia-genimg/` is reusable substrate

The `run.ts` / `run-new6.ts` / `run-cycle13.ts` pattern (Gemini `nano-banana-pro` parallel batch via `~/.claude/skills/Art/Tools/Generate.ts`, 4:5 aspect, 2K, 30-sec parallel) plus `og-derive.ts` (sharp center-crop to 1.91:1 OG) is the standing pattern for adding markets. Cycle 13 added 2 markets in 26.3s wall-clock parallel generation. Document this as the standing market-image pattern in the skill, not a per-cycle reinvention.

### 4. `FEATURED_SET` is membership; display order tracks `ALL_MARKET_SLUGS`

`FEATURED_MARKETS` is built via `ALL_MARKET_SLUGS.filter((slug) => FEATURED_SET.has(slug))`. The Set is membership-only; the array order of `ALL_MARKET_SLUGS` drives the homepage card order. New markets appended to the end of `ALL_MARKET_SLUGS` will appear last in Featured Markets. To insert a new featured market mid-grid, reorder `ALL_MARKET_SLUGS` (not the Set) — but reordering is breaking for any audit that hardcodes positions, so prefer append.

## Skill v0.3.5 changes

### Added

- **HARD gate #27 — Hero intro soft cap.** `Market.intro` length must stay ≤ 370 chars (combined with `tagline`, the practical bound to keep the desktop primary CTA above the fold at 1280×800 in the split-panel hero). Audit `rendered.hero.primaryCtaAboveFoldDesktop` enforces at build time; pre-commit lint optional.
- **Workflows/AddMarket.md (NEW v0.3.5)** — 10-touch checklist for adding a market: data → image-pipeline → partition Sets → audit slug arrays → matrices → typecheck → audit:images → audit:rendered → commit. Paired with the standing `/tmp/mia-genimg/` image pattern.
- **Gotcha #36 — Background bash piped to `tail` discards capture.** `bun … 2>&1 | tail -50` in a `run_in_background` call results in 0-byte output file because the harness writes the upstream-of-pipe stdout, but the pipe is consumed before the file. Use `> /tmp/<file>.txt` redirect or omit the pipe when capturing background output for later read.

### Changed

- **Hard gate count:** 26 → 27.
- **Workflow §3 (Build):** when adding a market, follow `Workflows/AddMarket.md` checklist; do NOT improvise touch order — audit-script slug arrays are the most-forgotten step.

### Limitations (Cycle 14+ candidates)

- **Reverse internal-link curation is manual.** Adding a new market `X` updates `X.internalLinks → [peers]` but does not update peer markets' `internalLinks` to include `X`. A small post-add CLI (`bun scripts/add-reverse-links.ts <slug>`) could maintain bidirectional cohort links automatically.
- **Per-cycle market-add still touches 5 audit scripts.** A `MARKET_SLUGS` constant exported from `src/lib/mia.ts` and imported by audit scripts would collapse 5 hardcoded arrays to 1 import. Cycle 13 deferred this refactor (changed scope), but it would close gate #27's "10-touch" surface to ~6 touches.

## Process improvements caught this cycle

- **Forge predeploy acceptance returned PASS in ~3.5 min with 97k tokens** — slightly higher than Cycle 12's 60s (Cycle 12 wasn't introducing new routes). This is the right place to surface defects before the deploy commit chain. Cycle 13 Forge caught a Phase 1 doc inconsistency (Bay Colony boundary) which was fixed before commit; defects-found-and-fixed in the predeploy phase is the cheapest spot in the cycle.
- **Bermuda Riviera intro length defect was caught by `audit:rendered`, not by GPT-5.5 or Cato** — the deterministic audit is the strongest signal for layout regressions. The fact that it surfaced this with a 1-line evidence block ("1 desktop probes push primary CTA below fold ... `/markets/bermuda-riviera/` ... `1280x800`") is exactly the design intent.
- **Background image generation while updating audit scripts in parallel** saved ~30s wall-clock — the image gen ran while I was hand-editing 5 hardcoded slug arrays. No race because the targets are disjoint (image files vs script files).
- **Local AFTER captures via `google-chrome --headless=new --no-sandbox --window-size=W,H --screenshot=`** worked for 24 captures (6 routes × 4 viewports) without invoking the Interceptor daemon — per `feedback_interceptor_headless_server_fallback.md` this is the correct pattern on this Linux server. Two of the 24 had timing artifacts (Coral Ridge 1440×900 right-side hero image not loaded; mobile 375×812 sub-paragraph rendered at chrome --dump-dom-clamped width). Both flagged as known limitations, not real defects.
