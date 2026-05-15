# Cycle 35C Deploy Failure Forensics

**Generated:** 2026-05-14T20:14Z
**Source log:** `docs/artifacts/cycle-35-recovery-full-completion/logs/final-deploy-20260514-155531.log`
**Source report:** `reports/audit-hero-pixel-contrast.{md,json}` (regenerated locally 2026-05-14T20:00Z, identical signature)

## Pipeline classification

| Question | Answer |
|---|---|
| did_1386d20_push | yes — origin/main = 1386d20 before deploy started |
| did_final_deploy_start | yes — `bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900` started 2026-05-14T15:55:31 local |
| did_final_deploy_post_to_dokploy | **NO** — abort fired during pre-flight `audit:all`, never reached Dokploy POST |
| did_final_deploy_finish | yes — script exited cleanly with code 1 (no orphan process) |
| final_deploy_exit_code | 1 |
| blocking_gate | `bun run audit:hero-contrast` (exited 1 inside `audit:all` chain) |

## Pre-abort gate sequence

All gates BEFORE hero-contrast passed:
- audit:stale ✓ clean
- audit:schema ✓ 287 JSON-LD blocks parse
- audit:links ✓ 2847 internal links
- audit:seo ✓ 0 warn / 0 fail
- audit:completeness ✓ 16 PASS / 1 WARN / 0 FAIL (forms-classification WARN is pre-existing, mailto is intentional)
- audit:images ✓ 14 PASS
- audit:brand ✓ 12 PASS / 0 FAIL (brand exception working)
- audit:insights ✓ 547 PASS
- audit:featured-markets ✓ 17 PASS
- audit:legal ✓ 18 PASS / 1 WARN (USCO in-process; staging-OK / production-blocking — pre-existing)
- audit:about ✓ 12 PASS

## Hero-contrast failures (deterministic, not sampling variance)

The audit ran with `--samples=1` (default in deploy-and-verify). Variance evidence: every row's `min == median == max` to 2 decimal places. Ergo failures are deterministic, not random.

| Route | Viewport | Glyph (≥3) | Edge (≥2.5) | Status | Note |
|---|---|---:|---:|:-:|---|
| `/markets/seven-isles/` | 768x1024 | **2.94** | 3.49 | ❌ FAIL | Glyph below 3.0 floor — only the 768x1024 tablet viewport fails; all four other viewports pass at 15.36..16.03 |
| `/markets/pompano-beach/` | 768x1024 | **2.85** | 2.83 | ❌ FAIL | Glyph below 3.0; edge only 0.33 above floor — same 768x1024-only pattern |

All other 143 routes/viewports pass with healthy margins (lowest non-failing glyph value is 15.10 on `/markets/rio-vista/` 320x568).

## Likely cause

- **Both failing routes have a hero image whose dominant color at the 768x1024 frame intersects the white text area in a way the other four viewports don't intersect.** Likely tablet-portrait crop centers a bright section (sky, sand, light water) under the H1.
- The user-reported failure named only Seven Isles; the audit shows Pompano-Beach also fails identically. Both must be fixed.
- The drop to 2.85–2.94 (vs ~15+ everywhere else) is not a small overlay tweak — it's the route hitting an image area whose luminance is high enough that the navy-9X panel + scrim are no longer doing their job at that single viewport for that route.

## Sampling variance — ruled out

- `--samples=1` results are deterministic per Chromium render; variance evidence in same row min/max equality.
- A second invocation against the same `out/` would produce identical pixel sampling.
- The fix is real, not statistical re-roll.

## is_code_fix_needed

- **YES** — design-safe fix at hero overlay logic, route-specific image swap, or focal-position adjustment for these two routes.
- NOT acceptable: lower threshold, route whitelist, `--no-preflight`, broad audit exception, hide content.

## Next action

Phase 2 — Reproduce locally, identify root cause (which hero image, which crop region, which overlay token), apply minimal design-safe fix to BOTH seven-isles and pompano-beach, re-run `audit:hero-contrast` until 145/145 PASS.
