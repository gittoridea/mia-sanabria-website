# Cycle 39 — Local Validation Report

date: 2026-05-16

## Gates

| Gate | Result | Notes |
|------|:------:|-------|
| `bun run typecheck` | PASS | exit 0 |
| `bun run lint` | PASS | "No ESLint warnings or errors" |
| `bun run build` | PASS | exit 0; 35 prerendered routes; out/ produced |
| `bun run audit:stale` | PASS | clean across out/ |
| `bun run audit:schema` | PASS | 287 JSON-LD blocks across 57 pages, all parse |
| `bun run audit:links` | PASS | 2846 internal links resolve |
| `bun run audit:seo` | PASS | 0 warnings, 0 errors |
| `bun run audit:images` | PASS | 14/0/0 (cycle39 versioned slugs honored via helpers) |
| `bun run audit:brand` | PASS | 12/0/0 |
| `bun run audit:hero-contrast:stable` | PASS | 145/0/0 |
| `bun run audit:rendered` | PASS-WARN | 14/1/0 — pre-existing viewport-honesty WARN, unchanged from Cycle 38 |
| `bun run audit:mobile-readability` | PASS | 84/0/0 (iphone-se / iphone-14-plus / ipad-portrait) |
| `bun run audit:mobile-readability:capture --cycle=cycle-39-visual-truth-recovery` | PASS | captured to docs/artifacts/cycle-39-visual-truth-recovery/mobile-readability/after/ |
| `bun run audit:featured-markets` | PASS | 17/0/0 |
| `bun run audit:legal` | PASS-WARN | 18/1/0 — pre-existing USCO/in-process WARN (acceptable for staging, blocks production cutover) |
| `bun run audit:about` | PASS | 12/0/0 |
| `bun run audit:completeness` | PASS-WARN | 16/1/0 — pre-existing WARN |
| `bun run audit:route-inventory` | PASS | 48 sitemap routes reconcile to filesystem |
| `bun run audit:no-fabrications` | PASS | 0 hits |
| `bun run audit:no-old-idx` | PASS | 480 files scanned, 0 IDX runtime markers |
| `bun run audit:neighborhood-images-deep` | PASS | 23/23 — Cycle 39 versioned slugs require -cycle39. in path; verified |
| `bun run audit:home-bridge-search` | PASS | 8/8 |
| `bun run audit:trust-row` | PASS | 59/59 sources clean |
| `bun run audit:lead-magnets` | PASS | 4/4 checks |
| `bun run audit:insights` | PASS | 547/0/0 |
| `bun run audit:fort-lauderdale-standard` | PASS | 31/0/0 |
| `bun run audit:qa-gate` | PASS-on-critical | 56 routes; critical=0; high=4 (pre-existing carry-over); medium=1; low=56 |
| `bun run test:home-bridge-e2e --base=http://127.0.0.1:4190` | PASS | 11/11 with bridge_mode=fallback |

## Critical gates summary

- **typecheck=0, lint=0, build=0**.
- **qa-gate critical=0** (the deploy gate per CLAUDE.md).
- **Versioned-path enforcement audit (`audit-neighborhood-images-deep` extended this cycle) PASS** for all 7 affected slugs.
- **E2E home→Bridge test PASS** locally with the expected fallback mode signal.

## Pre-existing warnings (carried over, not introduced this cycle)

- `legal.dmca.uscoFlag` — USCO + in-process language present (acceptable for staging; blocks production cutover per CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md).
- `qa-gate` high=4 — pre-existing high-severity findings from prior cycles. Cycle 39 did not regress qa-gate critical (still 0) and did not introduce new high findings.
- `rendered.probe.viewportSanity` — pre-existing chrome --dump-dom mobile-viewport-clamp instrumentation note.

## Cycle 39 introduced regressions

None observed.
