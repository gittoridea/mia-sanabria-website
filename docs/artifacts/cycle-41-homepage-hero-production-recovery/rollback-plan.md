---
cycle: 41
artifact: rollback-plan
generated_at: 2026-05-17
---

# Cycle 41 — Rollback Plan

## When to invoke

Roll back if any of the following is true after Phase 11 live-after capture:

- Mia reviews the deployed homepage and rejects the design direction.
- Live-after captures show a felt-quality defect worse than the live-before state.
- Live BridgeSearch surface mode shows `error` and old-IDX absence has regressed.
- Production cutover plans accelerate and stakeholders want a known-stable baseline.

## What to roll back

The Cycle 41 commit is `e63a35e`. Its parent is `9a6ab53` (Cycle 40C final-alignment-deploy log + ETag flip).

Reverting Cycle 41 takes the homepage hero back to the Cycle 40B/C visual state — the daytime waterfront image (`/hero/mia-home-hero-cycle40b.jpg`) was operator-authorized in Cycle 40B and stays correct as the asset; only the layout returns to the pre-Cycle-41 dark-panel-dominant composition.

## Rollback steps

```bash
cd /home/torrey/code/mia-sanabria-website

# 1. Verify state
git rev-parse HEAD                # should be e63a35e
git rev-parse origin/main         # should be e63a35e

# 2. Revert (creates a new commit; preserves Cycle 41 audit-trail)
git revert e63a35e --no-edit

# 3. Push the revert
git push origin main

# 4. Tmux-deploy the revert
ts="$(date +%Y%m%d-%H%M%S)"
log="docs/artifacts/cycle-41-homepage-hero-production-recovery/logs/staging-deploy-revert-${ts}.log"
tmux new-session -d -s "mia-cycle41-revert-deploy-${ts}" \
  "bun scripts/deploy-and-verify.ts --no-lighthouse \
   --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15 \
   > '${log}' 2>&1; echo EXIT_CODE:\$? >> '${log}'"

# 5. Verify live state on staging
curl -I -H "Cache-Control: no-cache" "https://miasanabriarealtor.trueidea.com/?cb=$(openssl rand -hex 8)"
bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com

# 6. After revert deploy:
#    - final deployed commit equals origin/main HEAD = <revert-sha>
#    - homepage shows the pre-Cycle-41 layout
#    - Bridge wiring unchanged
#    - old IDX still absent
```

## What is preserved through rollback

- The Cycle 40B daytime waterfront hero asset (`/hero/mia-home-hero-cycle40b.jpg`) — not touched by Cycle 41 source changes.
- BridgeSearch wiring (`method="get" action="/home-search/"`, `source=home-hero`, `city`/`minPrice`/`beds`) — schema unchanged in Cycle 41.
- Old IDX absence (no `IdxEmbed`, no `sef.mlsmatrix.com` reference).
- Bridge demo/fallback/live honesty posture.
- Decision-record locked H1 text.

## What is NOT in scope for this rollback

- Production DNS / Cloudflare changes — Cycle 41 made none.
- GHL endpoint configuration — Cycle 41 made none.
- Bridge credential values — Cycle 41 made none.
- Dokploy production application config — Cycle 41 made none.
- Caddyfile prod changes — Cycle 41 made none.

## Partial rollback option

If Mia accepts the eyebrow removal and panel lightening but rejects the floating search-card width change, a partial revert is possible:

```bash
# Revert only HeroSearch.tsx changes (keep page.tsx + Hero.tsx changes)
git checkout 9a6ab53 -- src/components/HeroSearch.tsx
git commit -m "partial-revert(MIA-SITE-CYCLE-41): restore HeroSearch floating wrapper to Cycle 40B"
git push origin main
# Then redeploy as in step 4 above
```

## Last verified

Cycle 41 commit applied at `2026-05-17T14:27:00Z` (approx). Deploy was launched immediately after commit; rollback is available the moment a `git revert` is pushed and a redeploy fires.
