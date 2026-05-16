# Cycle 38 — Rollback Plan

date: 2026-05-16

## Trigger conditions (any one is sufficient)

- Mia/operator rejects the new homepage hero image.
- Mia/operator rejects any of the 7 regenerated neighborhood images.
- Floating search card creates a layout or accessibility issue not surfaced in local QA.
- BridgeSearch auto-search misbehaves in a user-visible way.
- A legal/licensing concern arises about the operator-authorized hero reuse.

## Rollback granularity (least-disruptive first)

### Per-asset

```bash
# Single neighborhood image (replace <slug> with the affected slug)
git checkout ed24e69 -- public/markets/<slug>.jpg public/og-markets/<slug>.jpg
git commit -m "revert MIA-SITE-CYCLE-38 image for <slug>"

# Homepage hero (revert to Cycle-34 fort-lauderdale.jpg fallback)
git rm public/hero/mia-home-hero.jpg public/hero/mia-home-hero-og.jpg
git checkout e763584 -- src/app/page.tsx
git commit -m "revert MIA-SITE-CYCLE-38 homepage hero"
```

### All 7 neighborhood images simultaneously

```bash
for slug in coral-springs davie deerfield-beach hollywood plantation sunrise weston; do
  git checkout ed24e69 -- public/markets/$slug.jpg public/og-markets/$slug.jpg
done
git commit -m "revert MIA-SITE-CYCLE-38 neighborhood-image regeneration"
```

### Full Cycle 38 revert (hero + floating search + image regen + Bridge param prefill)

```bash
git revert --no-edit 8eaf986
# resolve any conflicts manually
git commit
```

### Bridge demo/fallback restoration

Cycle 38 did not change any Bridge runtime flags. No rollback action is needed for Bridge mode. If a future cycle activates live mode and Mia/operator wants to revert to demo:

```bash
# Dokploy side (manual):
#   set NEXT_PUBLIC_BRIDGE_DEMO=true
#   (re-)deploy
```

The application UI will resume showing the demo banner immediately.

### Old IDX restoration

Cycle 38 does NOT restore old IDX. The Matrix iframe runtime has been gone since Cycle 37 commit `ed24e69`. Bringing it back requires explicit operator authorization and is intentionally out of any rollback path here.

## After-rollback steps

1. Build: `bun run build`
2. Re-run gates: `bun run typecheck && bun run lint && bun run audit:brand && bun run audit:no-old-idx && bun run audit:neighborhood-images-deep && bun run audit:home-bridge-search`
3. Deploy: `tmux new-session -d -s mia-cycle38-rollback "bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900"`
4. Re-verify `https://miasanabriarealtor.trueidea.com/` HTML, asset 200s, no defect class re-introduced.

## Production rollback?

**Not applicable.** Cycle 38 does not change production. `miasanabria.com` is the operator's existing public site and was not touched. DNS, GHL, Google, Bridge credentials, and Dokploy production config are all untouched.

## Bridge token rotation?

**Not applicable.** Cycle 38 did not read, log, write, or rotate any Bridge token. No rotation is needed.
