---
cycle: 42
artifact: rollback-plan
generated_at: 2026-05-17
---

# Cycle 42 — Rollback Plan

## When to roll back

Cycle 42's rollback triggers are narrow because the cycle's surface is narrow (helper-paragraph text + new audit). Roll back only when one of these holds:

1. **Mia explicitly rejects the replacement copy** — e.g., she wants a different sentence or wants the paragraph removed entirely.
2. **Live staging shows the new copy still produces visible defect** (overflow, wrong wrap, contrast fail) and an in-place fix would be more risky than reverting and re-trying.
3. **Live Bridge E2E regressed** (would be unexpected for a text-only edit; if it happens the root cause is almost certainly unrelated, but the rollback below cleanly reverts the Cycle 42 commit so investigation can proceed against the Cycle 41 baseline).
4. **Build/typecheck/lint regression discovered post-deploy** (would be caught locally, but defensive).

Do NOT roll back to restore `Bridge-backed` or `Search routes to`. Those phrases are off-limits without explicit operator approval.

## Rollback procedure

Local-only operations. No production system is touched.

```bash
cd /home/torrey/code/mia-sanabria-website

# 1. Verify state — confirm Cycle 42 commit is HEAD and pushed
git rev-parse HEAD                                # expect 82c70452ceed37c07e0e6f7d48735d6a41c4c833
git rev-parse origin/main                          # same
git log --oneline -3

# 2. Revert (creates a new commit; does NOT rewrite history)
git revert 82c70452ceed37c07e0e6f7d48735d6a41c4c833 --no-edit

# 3. Re-run local validation against the reverted tree
bun run typecheck
bun run lint
bun run build
bun run audit:no-old-idx
bun run audit:home-bridge-search
bun run audit:home-hero-copy   # IMPORTANT: this will fail because the old copy is back —
                                # that is correct behavior, the audit caught it. The revert
                                # itself is documented intent, so wire a one-time skip in
                                # the rollback notes (do NOT remove the audit script).

# 4. Push the revert
git push origin main

# 5. Re-deploy (preferably under tmux, same pattern as Phase 8)
ts="$(date +%Y%m%d-%H%M%S)"
log="docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/staging-rollback-deploy-${ts}.log"
tmux new-session -d -s "mia-cycle42-rollback-${ts}" "set -a && source ~/.claude/.env && set +a && bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15 > '${log}' 2>&1; echo EXIT_CODE:\$? >> '${log}'"

# 6. Verify live shows the OLD (Cycle 41) helper text again
curl -sL -H "Cache-Control: no-cache" "https://miasanabriarealtor.trueidea.com/?cb=$(node -e 'console.log(require(\"crypto\").randomBytes(8).toString(\"hex\"))')" \
  | grep -c "Search routes to Mia" || echo "(expect 2 after rollback)"
```

## What the rollback preserves

- **Cycle 41 hero layout** — preserved (the revert only undoes Cycle 42's text+audit, not Cycle 41's layout).
- **Old IDX absence** — preserved (Cycles 37/38 removed the old Matrix iframe; not touched by Cycle 42).
- **Bridge wiring** — preserved (form action, params, hidden source unchanged).
- **Bridge demo honesty** — preserved (still mode=fallback/demo depending on Dokploy creds).

## What the rollback restores

- Old helper paragraph: "Search routes to Mia's Bridge-backed Southeast Florida home search. Talk with Mia for current comparable sales and the residence specifics listings alone cannot tell you."
- The leading docblock with "Cycle 38 rewires this surface to the Bridge-backed `/home-search/` page".

## What the rollback does NOT remove

- `scripts/audit-home-hero-copy.ts` — the audit script remains. After a rollback the audit would fail (because the old copy is now back in source) — this is correct, intended behavior. The audit's failure after a revert is *evidence* that the rollback restored the old copy, not a bug. If the operator wants to keep `Bridge-backed` indefinitely, the audit can be removed in a follow-up commit; that requires explicit operator decision.

## Production rollback

Not needed. Cycle 42 only touched the dev staging surface
(`https://miasanabriarealtor.trueidea.com/`). Production cutover never happened.

## Operator confirmation gate

Cycle 42 should not roll back without explicit operator confirmation, because the new copy is the result of the operator's explicit Cycle 42 rejection of the old copy. Self-rolling-back would loop on the same defect. If the new copy is wrong, prefer:

- A forward-fix commit with revised copy (e.g., Option B or a Mia-supplied phrase), and a new deploy.
- Not a revert.

Reserve revert for hero-layout regression, build failure, or Bridge wiring break.
