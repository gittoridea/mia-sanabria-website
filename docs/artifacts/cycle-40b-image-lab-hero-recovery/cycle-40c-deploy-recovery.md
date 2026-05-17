# Cycle 40C — Deploy Recovery Classification

> Classifies the dropped Cycle 40B staging deploy by reading the actual
> deploy log, not the prior transcript.

## Inspected log

```yaml
deploy_log: docs/artifacts/cycle-40b-image-lab-hero-recovery/logs/staging-deploy-20260516-210340.log
log_size_bytes: 8586
log_last_write: 2026-05-16T21:04:00-04:00
prior_deploy_status: completed_fail
exit_code: 1
dokploy_post_issued: false
needle_verified: false
```

## What the log shows

The deploy ran the standard `deploy-and-verify.ts` pre-flight gate sequence:

1. `tsc --noEmit` → pass.
2. `next lint` → pass.
3. `next build` → pass (61/61 static pages exported; production bundle size unchanged from prior commits).
4. `bun run audit:all` → **fail**, specifically:
   - `audit-stale` ✓
   - `audit-schema` ✓
   - `audit-links` ✓
   - `audit-seo` ✓
   - `audit-completeness` 16 PASS · 1 WARN (forms classification) · 0 FAIL
   - `audit-images` ✗ ✗ — two FAILs, identical population of seven slugs:
     - `images.everyMarketCardImagePresent` — seven markets missing card image: `deerfield-beach`, `hollywood`, `plantation`, `weston`, `coral-springs`, `davie`, `sunrise`
     - `images.everyMarketPageHeroImagePresent` — same seven markets missing hero image
5. `audit:all` exited 1; `deploy-and-verify` printed `✗ DEPLOY-ABORT (audit:all): exit 1`; final line: `EXIT_CODE:1`.

The Dokploy redeploy POST was never issued — the abort happened before the deploy phase.

## Root cause

Commit `8095c78` (Cycle 40B image-lab + hero recovery + daytime waterfront swap) committed:

- the seven new `public/markets/<slug>-cycle40b.jpg` + `public/og-markets/<slug>-cycle40b.jpg` assets;
- the Hero / HeroSearch / Hero CSS containment changes (cycle40b data markers);
- the homepage hero asset swap in `src/app/page.tsx`;
- the documentation artifacts (scorecards, manifest, provenance, etc).

It did **not** include the corresponding update to `src/lib/markets.ts`, which carries the `heroImage` field for every market record consumed by `MarketCard` (homepage / `/markets/` index) and `MarketPageHero` (per-slug detail page). Without that edit, those components continued to reference `/markets/<slug>-cycle39.jpg`, which had been removed from disk before commit. `audit:images` correctly detected the missing files.

The working tree at session start contained the corrective edit — `heroImage` flipped from `-cycle39` to `-cycle40b` on all seven slugs — but the session dropped before committing.

## Next action

```yaml
next_action: |
  Validate the working-tree markets.ts edit by running typecheck → lint →
  build → audit:all locally. Then run Phase 3 mobile hero proof. Then
  commit + push and re-run the staging deploy in tmux. Then live-verify.
```
