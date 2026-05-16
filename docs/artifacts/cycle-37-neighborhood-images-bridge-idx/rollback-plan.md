# Cycle 37 — Rollback Plan

## When to roll back

- Mia rejects the AI-generated neighborhood images (any one or all seven).
- Bridge integration regression discovered after promotion (city filter broken, badges missing in non-live mode, etc.).
- Old IDX must be temporarily restored due to operator policy decision.

## Rollback paths

### Image rejection (per-slug or all 7)

```bash
git checkout 772cc5e -- public/markets/<slug>.jpg public/og-markets/<slug>.jpg
```

For all seven at once:

```bash
git checkout 772cc5e -- \
  public/markets/coral-springs.jpg \
  public/markets/davie.jpg \
  public/markets/deerfield-beach.jpg \
  public/markets/hollywood.jpg \
  public/markets/plantation.jpg \
  public/markets/sunrise.jpg \
  public/markets/weston.jpg \
  public/og-markets/coral-springs.jpg \
  public/og-markets/davie.jpg \
  public/og-markets/deerfield-beach.jpg \
  public/og-markets/hollywood.jpg \
  public/og-markets/plantation.jpg \
  public/og-markets/sunrise.jpg \
  public/og-markets/weston.jpg

git commit -m "revert(MIA-SITE-CYCLE-37): restore brand-tone neighborhood placeholders pending licensed photography"
```

NOTE: rolling back images alone will fail `audit:neighborhood-images-deep` (placeholder sizes are below the 80 KB / 60 KB thresholds). Either re-generate, accept Mia-supplied photography, or temporarily skip that audit by removing from `audit:all` until replacement assets land.

### Bridge integration revert (full source revert)

```bash
git revert ed24e69
```

Then validate, build, commit, push, deploy. The revert restores `MlsMatrixFallback` + `IdxEmbed` and the matrix-iframe `audit:completeness` sentinel set. `audit:no-old-idx` will then FAIL (expected) — drop it from `audit:all` until the next forward fix.

### Old IDX must be restored (rare)

If the operator wants the iframe back temporarily (e.g., Bridge live data unavailable + fixture cards rejected), use the full revert above. Do not surgically revert only the iframe — the audit + Bridge state machine changes intertwine, so a clean revert is safer.

### Post-rollback deploy

```bash
ts="$(date +%Y%m%d-%H%M%S)"
log="docs/artifacts/cycle-37-neighborhood-images-bridge-idx/logs/rollback-deploy-${ts}.log"
tmux new-session -d -s "mia-cycle37-rollback-deploy-${ts}" \
  "bash -c 'set +x; set -a; source ~/.claude/.env; set +a; bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle=\"South Florida Lifestyle\" --wait-timeout=900 > \"${log}\" 2>&1; echo EXIT_CODE:\$? >> \"${log}\"'"
```

Verify `https://miasanabriarealtor.trueidea.com/` after rollback deploy.

## Production not affected

No production cutover occurred; production DNS still points to the legacy `miasanabriarealtor.com` Direct Axess host. No production rollback needed.

## Cycle-35 demo-warning exception preserved

The `data-brand-exception="demo-warning"` semantic from Cycle 35 is preserved in Cycle 37 (`DemoBanner`, `DEMO` badge, `ErrorPanel`, and the disclosure paragraph). A revert of Cycle 37 does not remove the Cycle 35 mechanism — it merely returns to the Cycle 36D usage of that mechanism.
