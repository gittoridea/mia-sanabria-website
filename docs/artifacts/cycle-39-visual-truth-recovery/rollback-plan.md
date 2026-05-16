# Cycle 39 — Rollback Plan

date: 2026-05-16

## When to invoke

- Mia reviews staging and explicitly rejects the new versioned-path
  hero / mobile hero treatment.
- A live regression appears that traces to a Cycle 39 source change.
- Bridge truthfulness regresses (live banner appears in non-live mode,
  or demo disappears in demo mode).

## Rollback steps (least to most disruptive)

### 1. Revert source-only

```bash
cd /home/torrey/code/mia-sanabria-website
git revert --no-edit 889b2c2b117c9bc5fd5bcfc8b97f82e21bae0978
git push origin main
```

The versioned image files on disk (`*-cycle39.jpg`) remain — the revert
restores `heroImage:` literals to the unversioned form and the helper to
the unversioned form, so runtime references the legacy files again. The
versioned files are dormant but harmless.

### 2. Remove versioned images from disk

Only if the operator explicitly wants the versioned files gone:

```bash
cd /home/torrey/code/mia-sanabria-website
rm public/markets/*-cycle39.jpg public/og-markets/*-cycle39.jpg public/hero/mia-home-hero-cycle39.jpg
git add -A public/markets public/og-markets public/hero
git commit -m "revert(MIA-SITE-CYCLE-39): remove versioned image files per operator decision"
git push origin main
```

### 3. Restore Cycle 38 hero panel treatment

Only if the operator prefers the over-opaque mobile hero treatment:

```bash
cd /home/torrey/code/mia-sanabria-website
git checkout 43a4dfd -- src/components/Hero.tsx src/app/page.tsx
git commit -m "revert(MIA-SITE-CYCLE-39): restore Cycle 38 hero treatment per operator decision"
git push origin main
```

### 4. Redeploy after rollback

```bash
ts="$(date +%Y%m%d-%H%M%S)"
log="docs/artifacts/cycle-39-visual-truth-recovery/logs/rollback-deploy-${ts}.log"
tmux new-session -d -s "mia-c39-rollback-${ts}" \
  "bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle='South Florida Lifestyle' --wait-timeout=900 --wait-interval=15 > '${log}' 2>&1; echo EXIT_CODE:\$? >> '${log}'"
```

## What MUST NOT be rolled back even if Cycle 39 is reverted

- The old IDX (MlsMatrix) runtime removal from Cycle 37 — that was a
  legal/compliance decision and stays gone unless operator + counsel
  explicitly re-approve.
- The Bridge demo-honesty banner in non-live mode — that is a Fair
  Housing / Equal Housing Opportunity requirement, not a Cycle 39
  invention.

## What does NOT need rolling back

- The Mia decision-record entry (declarative log, not a runtime change).
- The ISA entries (declarative log).
- The Cycle 39 artifact directory (audit trail, not a runtime change).

## Production-cutover-rollback scope

None. Cycle 39 touches `miasanabriarealtor.trueidea.com` (Dokploy staging)
only. DNS for `miasanabriarealtor.com` still points at Direct Axess; no
production redirect to roll back; no GHL endpoint touched; no branded
email created.
