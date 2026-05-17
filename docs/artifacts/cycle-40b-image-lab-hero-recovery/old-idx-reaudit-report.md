# Cycle 40B — Old IDX Reaudit Report

```yaml
date: 2026-05-17T01:00Z

audit_command: bun run audit:no-old-idx
audit_result: PASS — 480 files scanned, 0 old-IDX markers found
audit_definition: |
  scans src/, public/, scripts/, package.json for any reference to
  the removed legacy MLS Matrix iframe (sef.mlsmatrix.com), legacy
  IdxEmbed component, or other Cycle 37 removal targets

baseline:
  cycle_when_removed: Cycle 37 (ed24e69 + 240c2c7 commits)
  removed_targets:
    - sef.mlsmatrix.com iframe reference (HTML + Caddyfile CSP)
    - IdxEmbed legacy component
    - /markets/#property-search anchor (replaced by /home-search/ Bridge surface)

cycle_40b_preservation:
  changes_that_could_have_regressed:
    - src/app/page.tsx (homepage) — changed imageSrc + wrapper class only;
      no IDX or property-search anchor changes
    - src/components/Hero.tsx — CTA + section class adjustments only
    - src/components/HeroSearch.tsx — width-clamping ceilings on outer
      wrapper + select; form action remains /home-search/
    - src/lib/mia.ts — image path helper only; no nav or IDX changes
  result: no regression — Cycle 37 IDX removal is preserved exactly

live_assertion_at_staging: |
  After deploy, the audit will re-run against the live staging URL via
  audit:no-old-idx and audit:home-bridge-search (both check Bridge wire-up
  + old-IDX absence). These will be reported in staging-live-verification-report.md
  in Phase 15.

caddyfile_csp:
  cycle_37_change: removed sef.mlsmatrix.com from frame-src directive (commit 240c2c7)
  cycle_40b_change: NONE — Caddyfile not touched this cycle
  preservation: confirmed
```

## What "old IDX" means in this codebase

The "old IDX" defect class:

1. **Legacy MLS Matrix iframe** (`<iframe src="https://sef.mlsmatrix.com/...">`)
   — removed in Cycle 37.
2. **IdxEmbed component** (legacy React wrapper around the iframe) — removed
   in Cycle 37 source.
3. **`/markets/#property-search` anchor link** — replaced in Cycle 37 by
   `/home-search/` route hosting BridgeSearch.
4. **Caddyfile CSP frame-src** for `sef.mlsmatrix.com` — removed in
   Cycle 37 (commit `240c2c7`).

The audit script greps for any residual reference to these. If a future
edit accidentally reintroduces any of them, the audit fails.

## Cycle 40B's responsibility

Preserve the Cycle 37 removal. Verified via:
- `audit:no-old-idx PASS 480 files scanned` (this cycle)
- `audit:home-bridge-search PASS 8/8` (confirms Bridge is sole search surface)
- `test:home-bridge-e2e PASS 11/11 mode=fallback` (confirms Bridge surface works)

Bridge demo-mode honesty UI continues to display as designed when no
live feed is proven.
