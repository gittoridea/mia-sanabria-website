# QA / Validation / Visual Evidence Engineer — Cycle 25

**Author:** Main-session Mission Commander operating QA role (substitution documented).
**Date:** 2026-05-13.
**Scope:** Validate the seven new approved-neighborhood pages and the supporting registry / image / sitemap updates.

## 1. Commands run

| # | Command | Result | Time |
|---|---|---|---|
| 1 | `bun run typecheck` | exit 0 | <2s |
| 2 | `bun run lint` | "No ESLint warnings or errors" | <5s |
| 3 | `bun scripts/render-images.ts` | 14 new JPGs (7 hero + 7 OG) | ~3s |
| 4 | `bun run build` | exit 0; 60 static pages exported; 23 market paths (was 16) | ~12s |
| 5 | `bun run audit:images` | 14 PASS · 0 WARN · 0 FAIL — all 23 markets have hero + OG | <1s |
| 6 | `bun run audit:no-fabrications` | 0 hits across `out/` | <1s |
| 7 | `bun run audit:stale` | clean across `out/` | <1s |
| 8 | `bun run audit:schema` | 56 pages · 284 JSON-LD blocks · all parse with `@context` + `@type` | <1s |
| 9 | `bun run audit:links` | 56 pages · 2,804 internal links checked · all resolve | <1s |
| 10 | `bun run audit:seo` | 0 warnings, 0 errors | <1s |
| 11 | `bun run audit:completeness` | 16 PASS · 1 WARN (mailto fallback acceptable) · 0 FAIL | <1s |
| 12 | `bun run audit:brand` | 12 PASS · 0 FAIL | <1s |
| 13 | `bun run audit:insights` | 547 PASS · 0 FAIL | <2s |
| 14 | `bun run audit:featured-markets` | 17 PASS · 0 FAIL — "23 markets linked" | <1s |
| 15 | `bun run audit:legal` | 18 PASS · 1 WARN (DMCA USCO-in-process, Cycle 24 carry-over) · 0 FAIL | <1s |
| 16 | `bun run audit:about` | 12 PASS · 0 FAIL | <1s |
| 17 | `bun run audit:hero-contrast` (samples=1) | 145 PASS · 0 FAIL | ~20s |
| 18 | `bun run audit:trust-row` | 58/58 sources clean (HTML routes + 3 PDFs) | <1s |
| 19 | `bun run audit:lead-magnets` | 4/4 checks pass (PDF canvas-render warning is known) | <1s |
| 20 | `bun run audit:fort-lauderdale-standard` | 31 PASS · 0 WARN · 0 FAIL | <1s |
| 21 | `bun run audit:route-inventory` | 47 sitemap routes reconcile to filesystem (was 40, +7 new) | <1s |
| 22 | `bun run audit:qa-gate` | 55 routes · critical 0 · high 4 · medium 1 · low 55 — `critical=0` is the gate | <1s |
| 23 | `bun run audit:rendered` | passed as part of `audit:all` chain (Cycle 24 baseline carry-over WARN on chrome `--dump-dom` mobile clamp is pre-existing instrumentation limitation) | ~30s |
| 24 | `bun run audit:all` | exit 0 (full chain) | ~60s |

## 2. Manual `grep` checks against built output (`out/`)

| Check | Hits |
|---|---|
| Bridge credential values (`BRIDGE_.*=['"][a-zA-Z0-9_-]{16,}`) | 0 |
| `Spanish` / `bilingual` / `fluent` (excluding font-family noise) | 0 |
| `best schools` / `good schools` / `safe neighborhood` / `family-friendly` / `kid-friendly` / `bachelor pad` | 0 |
| `#1 realtor` / `top realtor` / `best realtor` / `guaranteed sale` / `guaranteed price` | 0 |
| Fake testimonial placeholders (`lorem` / `placeholder text` / `review text here`) | 0 |

## 3. Route smoke

All routes generated and exist in `out/`:

| Route | exists in `out/` | hero `<img>` resolves | og:image resolves |
|---|---|---|---|
| `/` | ✓ | ✓ | ✓ |
| `/markets/` | ✓ | ✓ | ✓ |
| `/markets/fort-lauderdale/` | ✓ (V2 page preserved) | ✓ | ✓ |
| `/markets/pompano-beach/` | ✓ | ✓ | ✓ |
| `/markets/deerfield-beach/` | ✓ NEW | ✓ placeholder hero | ✓ placeholder OG |
| `/markets/coral-springs/` | ✓ NEW | ✓ placeholder hero | ✓ placeholder OG |
| `/markets/plantation/` | ✓ NEW | ✓ placeholder hero | ✓ placeholder OG |
| `/markets/weston/` | ✓ NEW | ✓ placeholder hero | ✓ placeholder OG |
| `/markets/hollywood/` | ✓ NEW | ✓ placeholder hero | ✓ placeholder OG |
| `/markets/davie/` | ✓ NEW | ✓ placeholder hero | ✓ placeholder OG |
| `/markets/sunrise/` | ✓ NEW | ✓ placeholder hero | ✓ placeholder OG |
| `/buyers/` | ✓ | ✓ | ✓ |
| `/sellers/` | ✓ | ✓ | ✓ |
| `/insights/` | ✓ | ✓ | ✓ |
| `/about/` | ✓ | ✓ | ✓ |
| `/contact/` | ✓ | ✓ | ✓ |
| `/valuation/` | ✓ | ✓ | ✓ |

## 4. Built-output checks (per Phase 7 brief)

| Check | Status |
|---|---|
| All seven new pages exist | ✓ |
| All 9 approved neighborhoods linked from homepage NeighborhoodsRail | ✓ (rail picks up `MIA_APPROVED_NEIGHBORHOODS`) |
| `MIA_APPROVED_NEIGHBORHOODS.hasPage` true only for pages that exist | ✓ (all 9 set to `true`; all 9 paths verified in `out/`) |
| No "content pending" public text | ✓ (no such string in `out/`) |
| No fake testimonials | ✓ (no quote attribution, no review framing) |
| No hardcoded Bridge credential values | ✓ (only env-var NAMES in `src/lib/bridge.ts`) |
| No Spanish / bilingual / fluent claims | ✓ |
| No school-quality / safety / protected-class steering | ✓ |
| No unsupported best/top/#1/guaranteed claims | ✓ |
| No old canonical-domain drift | ✓ (canonical `https://miasanabria.com` from `src/lib/site.ts`) |
| No broken internal links | ✓ (2,804 links audited; all resolve) |

## 5. Visual evidence — screenshots

**Not captured this cycle.** Reason: `bun run audit:mobile-readability:capture` hardcodes output to `docs/artifacts/cycle-19A-M/mobile-readability/after/` (`scripts/audit-mobile-readability.ts:289`). Capturing Cycle 25 screenshots without overwriting the Cycle 19A-M baseline would require adding `--cycle=` / `--outDir=` support to the script. Per the mission brief: "if adding flags is risky, document not-run with reason." The flag addition is small but is its own work (test, regression check on existing Cycle 19A-M behavior, etc.) and is out of scope for Cycle 25. **Recommended Cycle 26 (or follow-up tooling cycle):** add `--cycle=` flag, then re-run capture against the seven new pages.

Note: `audit:mobile-readability` (the non-capture variant) ran as part of `audit:all` and passed. The non-capture variant validates contract presence (responsive header / hero / nav / footer / typographic sizes) against the seven new pages without writing images. No new viewport regression was detected.

## 6. Compliance / Fair Housing / claims review

Pre-cleared via `compliance-claims-review.md`; verified post-build:

- `audit-stale-terms` against `out/` → 0 hits
- `audit-no-fabrications` against `out/` → 0 hits
- No school references with any adjective
- No safety / crime / "feels safe" claims
- No family / kid / "young professionals" / "retirees" / "bachelor pad" framing
- No testimonial / review / endorsement text
- No invented neighborhood names, landmark names, or sub-cohorts beyond publicly-named ones
- No fake transaction-volume / years-experience / response-SLA claim
- No `..` double-period at sentence boundaries
- No language-service claims

## 7. Test posture

This is a content + data change. No new code paths, no new functions, no new components — so no unit-test additions were required. The TypeScript type system + the audit chain together provide the contract. If a future cycle adds a city-specific page component (e.g., a "WestonV2" page like FortLauderdaleV2), that cycle should add a corresponding `audit:weston-standard` script in the spirit of `audit:fort-lauderdale-standard`.

## 8. Summary

The cycle's seven new pages and the supporting data + image updates pass every audit in the `audit:all` chain with 0 FAIL. The four `high` warnings on the qa-gate matrix are the Cycle 24 carry-over on the four counsel-gated legal pages (CATO-01..08) and are NOT caused by Cycle 25. The single `WARN` on `audit:completeness` is the documented mailto-fallback. The single `WARN` on `audit:legal` is the DMCA USCO-in-process language, also a Cycle 24 carry-over. Visual screenshots were not captured this cycle due to the Cycle 24 R2 carry-over of the hardcoded mobile-readability:capture output path; flagged for a follow-up tooling cycle.
