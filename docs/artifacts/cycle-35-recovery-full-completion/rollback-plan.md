# Rollback Plan — Cycle 35B

date: 2026-05-14
purpose: Document the exact recovery procedure if any part of Cycle 35B is rejected or causes regression after the final staging deploy.

## What this cycle changed on `origin/main`

- **3530d5f** (pre-crash, already pushed): `fix(MIA-SITE-CYCLE-35): allow semantic Bridge demo warning in brand audit` — three semantic `data-brand-exception="demo-warning"` markers in `src/components/bridge/*.tsx` + a narrow exception block in `scripts/audit-brand-consistency.ts` + audit report regeneration.
- **Cycle 35B commit** (about to be pushed): `feat(MIA-SITE-CYCLE-35B): complete neighborhoods, image provenance, and staging QA` — documentation/evidence-only commit. **No source code changes.** Files added are all under `docs/artifacts/cycle-35-recovery-full-completion/`, plus regenerated `reports/audit-*.{json,md}`, plus the secret-safety addendum.

## Production state at time of writing

**No production was touched.** All deploys this cycle are staging-only (`miasanabriarealtor.trueidea.com`). The production-canonical `miasanabriarealtor.com` is not in scope and has not been DNS-cut. **No production rollback is needed because there is no production deploy to roll back.**

## Reversal paths

### Path A — Mia rejects the semantic brand exception

```
git revert 3530d5f
git push origin main
```

This restores the prior brand-audit behavior (the audit would then FAIL on the three Bridge demo-mode amber-token hits unless the Bridge demo banner / DEMO badge / error warning are also reverted to the pre-Cycle-33B state). Documentation in `docs/artifacts/cycle-35-recovery-full-completion/brand-audit-demo-warning-exception.md` is kept for the audit trail.

### Path B — Mia rejects the documentation/evidence commit

```
git revert <cycle-35B-commit-sha>
git push origin main
```

Source code is unaffected. Only the `docs/artifacts/cycle-35-recovery-full-completion/` directory + audit report drift is reverted. Staging functionality unchanged.

### Path C — Mia rejects the brand-tone editorial cards for the 7 Broward cities

These cards already shipped in Cycle 25 (pre-35B), so this is a CY25 rollback, not a 35B rollback. Procedure:

```
# Replace the 7 brand-tone JPGs with Mia-provided photographic JPGs
# (or revert the Cycle 25 commit that introduced the brand-tone cohort)
git revert <cycle-25-commit-sha>   # would also revert the 7 neighborhood routes
# Alternative: keep the routes, swap the JPGs only
cp <mia-photos>/deerfield-beach.jpg public/markets/deerfield-beach.jpg
# ... etc ...
bun run audit:images
bun run build
# Commit + deploy
```

### Path D — Staging deploy fails or surfaces unexpected regression

```
# Roll back to the prior good commit:
git checkout 3530d5f          # last known-good post-recovery
# Inspect: is the regression in the audit reports, the brand fix, or both?
# If only the documentation commit caused the issue, revert it via Path B.
# If the brand fix itself is the issue, Path A.
```

The Dokploy app rebuilds from `origin/main` on each `application.deploy` POST. After any revert + push, run `bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle'` under tmux, watch for `EXIT_CODE:0`, then re-verify staging.

### Path E — Mia rejects AI-generated images

**Not applicable.** No AI-generated images were produced this cycle. See `image-generation-log.md`.

## Disable switches

- **Bridge demo mode visibility**: untouched this cycle. Bridge stays in demo mode until Cycle 33C activates the real feed. No new switch was introduced.
- **Verified-attestation gate for license + designations**: untouched this cycle. Still off; site doesn't surface license number or designations.

## Confirmation of "no production rollback needed"

```
production_deployed_this_cycle: no
production_routes_touched: 0
DNS_writes: 0
GHL_writes: 0
Google_writes: 0
```

The site at the production-canonical `miasanabriarealtor.com` has not been DNS-cut to this codebase. Any rollback is staging-scope only.
