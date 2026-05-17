---
cycle: 41
artifact: local-validation-report
generated_at: 2026-05-17
---

# Cycle 41 — Local Validation Report

All gates run against the Cycle 41 local build (`bun run build` → `out/`, served on `127.0.0.1:4231` for screenshot + audit passes that need a local HTTP server).

## Quality gates

```yaml
typecheck:                            PASS  (`bun run typecheck`)
lint:                                 PASS  (`bun run lint` → 0 ESLint warnings or errors)
build:                                PASS  (`bun run build` → static export at out/)
audit:brand:                          PASS  (12 PASS / 0 WARN / 0 FAIL)
audit:hero-contrast (samples=1):      PASS  (145 PASS / 0 WARN / 0 FAIL)
audit:hero-contrast:stable (samples=3): PASS  (145 PASS / 0 WARN / 0 FAIL — homepage 1280 = 13.52:1 glyph, 9.15:1 edge; thresholds 3.0/2.5)
audit:no-old-idx:                     PASS  (481 files scanned, no markers)
audit:home-bridge-search:             PASS  (8/8 checks)
audit:no-fabrications:                PASS  (0 hits)
audit:route-inventory:                PASS  (48 sitemap routes reconcile)
audit:stale-terms:                    PASS  (clean across out/)
audit:images:                         PASS  (14/14)
audit:completeness:                   PASS  (16 PASS / 1 WARN; warn is pre-existing about-page micro-token, not Cycle 41 introduced)
audit:legal:                          PASS  (18 PASS / 1 WARN; warn is pre-existing USCO-in-process gate, c5 dependency)
audit:about:                          PASS  (12/12)
audit:insights:                       PASS  (535 PASS / 12 WARN; warns are pre-existing date-backdating notices on prior insights, unrelated to Cycle 41)
audit:featured-markets:               PASS  (17/17)
audit:qa-gate:                        PASS  (critical 0 — gate condition; high 4 = legal_review(c5), medium 1 = lead_capture(c4) — all pre-existing external dependencies)
audit:mobile-readability:             PASS  (84 PASS / 0 FAIL / 0 ERROR)
audit:neighborhood-images-deep:       PASS  (23/23)
audit:rendered:                       PASS  (14 PASS / 1 WARN / 0 FAIL — WARN is the pre-existing chrome --dump-dom mobile viewport-clamp instrumentation gap; same as prior cycles)
test:home-bridge-e2e (local):         PASS  (11/11)
```

## Initial Cycle 41 regression caught during validation

The first iteration of Cycle 41 introduced a regression on `audit:rendered.primaryCtaAboveFoldDesktop` — 20 `/markets/<slug>/` heroes had their primary CTA pushed below the 1280x800 / 1440x900 fold. Two compounding causes:

1. `lg:min-h-[480px]` was raised to `lg:min-h-[540px]` and `lg:py-6` to `lg:py-10` (intent: more breathing room for the homepage image). This made every image-mode hero taller.
2. The narrower lg copy column (`lg:max-w-md` vs prior `max-w-2xl`) caused longer market-page H1s to wrap to 3 lines instead of 2, plus the 38px lg H1 size bump.

Resolution (also documented in `hero-implementation-report.md`):

- `lg:min-h-[480px]` and `lg:py-6` restored to Cycle 9 fold-safe baseline.
- `lg:text-[38px]` reverted to `lg:text-[36px]` (tighter `lg:leading-[1.04]` preserved so the homepage H1 still reads as a composed two-line mark).
- A new `imagePanelWidth?: "default" | "narrow"` prop was added to `Hero.tsx`. Default keeps the legacy `max-w-2xl` for every existing image-mode page; only the homepage opts into `"narrow"` and gets the new `sm:max-w-md lg:max-w-md xl:max-w-lg` column.

After these resolutions, `audit:rendered` returned to 14 PASS / 1 WARN / 0 FAIL. The visual intent on the homepage is preserved because the narrow column is opt-in.

## Verdict

All gates listed in the Cycle 41 brief pass. The single FAIL caught during validation was introduced AND resolved within Phase 7 before commit. No known-FAIL gate remains at commit time.
