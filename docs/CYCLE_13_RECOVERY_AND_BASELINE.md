# Cycle 13 — Recovery and Baseline

**Date:** 2026-05-10
**Mission:** Cycle 13 — Add Bay Colony + Bermuda Riviera; final production refinement
**Algorithm:** v6.4.0 · Tier E5 (context-override; classifier failed with 25s timeout → fail-safe E3, escalated to E5 because the mission is explicitly multi-phase comprehensive work)

## Phase 0 — Goal

Establish a clean, reproducible baseline before introducing two new market entities. Confirm Cycle 12 closure is intact, identify which market entities and assets exist today, and surface every audit-script and code site that hardcodes the market list (for Phase 6 coverage updates).

## 1. Git state

| Probe | Result |
|---|---|
| Working tree | clean |
| HEAD | `0bc2564e4b639cd5a68c836f4597f3aaac736f09` |
| origin/main | `0bc2564e4b639cd5a68c836f4597f3aaac736f09` (matches HEAD) |
| Last 3 commits | `0bc2564 docs(MIA-SITE-CYCLE-12): closeout` · `3b0b6a7 feat(MIA-SITE-CYCLE-12): production-readiness closure` · `a535ea7 chore(ISA): mark cycle 11 phase: complete` |

## 2. Live state

| Probe | Result |
|---|---|
| URL | `https://miasanabriarealtor.trueidea.com/` |
| HTTP | `200` |
| Live ETag | `diezhj5m794w2qf6` (Cycle 12 close — matches handoff doc) |
| Last-modified | `Sun, 10 May 2026 12:09:14 GMT` |
| Cache-Control | `public, max-age=300, s-maxage=600, must-revalidate` |
| Content-length | `127554` |

## 3. Cycle 12 closure docs (READ FIRST)

| Doc | Status |
|---|---|
| `docs/PRODUCTION_READINESS_HANDOFF_CYCLE_12_PRODUCTION_READINESS_CLOSURE_2026-05-10.md` | exists · PASS verdict, SESSION_MAY_CLOSE: yes |
| `docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md` | exists · 24 axes, 15 PASS / 1 PARTIAL / 1 REVIEW / 7 BLOCKED |
| `docs/NEXT_SESSION_TRIGGER_AFTER_CYCLE_12.md` | exists · informed Cycle 13 framing |
| `docs/CYCLE_12_GPT55_LIVE_ACCEPTANCE.md` | exists · LIVE PASS, 5/5 yes |
| `docs/CYCLE_12_CATO_CROSS_VENDOR_AUDIT.md` | exists · concerns, 0 critical |
| `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` | exists · v0.3.4 |

## 4. Local toolchain

| Probe | Result |
|---|---|
| `bun run typecheck` | exit 0 |
| `bun run lint` | exit 0 (`No ESLint warnings or errors`) |
| `bun run build` | exit 0 (static export, all routes prerendered) |
| `bun run audit:all` | running in background — captured separately |

## 5. Existing market inventory

`MARKETS` array in `src/lib/markets.ts` defines **13 markets**, with corresponding entries in `ALL_MARKET_SLUGS` (`src/lib/mia.ts`). Every slug has a hero image at `public/markets/<slug>.jpg` (1200×1500 progressive JPEG) and an OG image at `public/og-markets/<slug>.jpg`.

| # | Slug | County | Cluster |
|---|---|---|---|
| 1 | `fort-lauderdale` | Broward | primary city |
| 2 | `coral-ridge` | Broward | E. FTL neighborhood |
| 3 | `victoria-park` | Broward | E. FTL neighborhood |
| 4 | `boca-raton` | Palm Beach | primary city |
| 5 | `palm-beach` | Palm Beach | primary city |
| 6 | `delray-beach` | Palm Beach | primary city |
| 7 | `lighthouse-point` | Broward | primary city |
| 8 | `rio-vista` | Broward | E. FTL neighborhood |
| 9 | `harbor-beach` | Broward | E. FTL neighborhood |
| 10 | `las-olas-isles` | Broward | E. FTL neighborhood |
| 11 | `seven-isles` | Broward | E. FTL neighborhood |
| 12 | `sea-ranch-lakes` | Broward | primary (private village) |
| 13 | `hillsboro-mile` | Broward | primary (oceanfront) |

`FEATURED_SET` (homepage Featured Markets section) currently has 6 slugs:
`fort-lauderdale`, `las-olas-isles`, `harbor-beach`, `victoria-park`, `boca-raton`, `delray-beach`.

## 6. Bay Colony / Bermuda Riviera presence check

| Market | In `MARKETS`? | In `ALL_MARKET_SLUGS`? | Hero image? | OG image? | Route generated? |
|---|---|---|---|---|---|
| **Bay Colony** | ❌ no | ❌ no | ❌ no | ❌ no | ❌ no |
| **Bermuda Riviera** | ❌ no | ❌ no | ❌ no | ❌ no | ❌ no |

**Decision:** Both markets must be added as full market entities — there is no featured-only-card pathway in this codebase. Featured Markets renders Market objects from `FEATURED_MARKETS.map(getMarket)`, so a featured slug must exist in `MARKETS`.

## 7. Hardcoded market-list inventory (for Phase 6)

Audit scripts and route components that hardcode market slug arrays — these need updates when any new market is added:

| File | Line | Pattern |
|---|---|---|
| `scripts/audit-completeness.ts` | 55-70 | `MARKET_PAGES` const array |
| `scripts/audit-images.ts` | 291-305 | `marketSlugs` array |
| `scripts/audit-images.ts` | 333 | `expectedFeatured` array (currently 6) |
| `scripts/audit-rendered-visual.ts` | 86-95 | route list |
| `scripts/audit-hero-pixel-contrast.ts` | 83-84 | route list |
| `scripts/capture-baseline.ts` | 46-55 | route list |
| `src/app/markets/page.tsx` | 36-43, 45-52 | `PRIMARY_SLUGS` + `NEIGHBORHOOD_SLUGS` Sets |
| `src/app/markets/[slug]/page.tsx` | 83-90 | `easternBrowardSlugs` Set |

Single-market sentinel checks at `audit-brand-consistency.ts:96`, `audit-mobile.ts:32`, `deploy-and-verify.ts:26` use `fort-lauderdale` only — no update needed.

`scripts/audit-images.ts:317` declares "13 market heroes" in audit description — needs update to 15.

## 8. Image generation pipeline (validated)

Established pattern at `/tmp/mia-genimg/` (per `reference_mia_site_assets.md` memory):

- **`run.ts` / `run-new6.ts`:** parallel batch with `bun ~/.claude/skills/Art/Tools/Generate.ts --model nano-banana-pro --aspect-ratio 4:5 --size 2K --output …`
- **`og-derive.ts`:** sharp-based 1.91:1 center-crop derivation from the 4:5 hero into `public/og-markets/<slug>.jpg`

Same pipeline will be used in Phase 3 for Bay Colony + Bermuda Riviera.

## 9. Pre-existing concerns to honor

From Cycle 12 closure (do NOT reopen):
- Hero readability work (audit:hero-contrast PASS at samples=1 and samples=3)
- Footer trust-strip uniform monochrome (D1/D2/D3 closed)
- Mobile 320 / 375 narrow-viewport layout (DevTools probe authoritative)
- 7 explicit external blockers on `.com` cutover (license, branded email, GHL wiring, TCPA, REALTOR®/MLS marks, DNS, analytics provider)

## 10. Out-of-scope for Cycle 13 (per mission prompt)

GHL wiring · TCPA mechanics · license rendering · REALTOR®/MLS legal · Spanish hreflang · lead magnet · DNS / .com production / Cloudflare / GHL production · Payload/Postgres · legal copy rewrites · new colors/fonts · glassmorphism · `.com` launch claim while external blockers remain.

## 11. Next phase

→ **Phase 1 — Market Architecture Decision**
Doc: `docs/CYCLE_13_BAY_COLONY_BERMUDA_RIVIERA_MARKET_ARCHITECTURE_DECISION.md`
