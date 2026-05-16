# Cycle 37 — Commit Report

## Single Cycle 37 commit

```
ed24e69  feat(MIA-SITE-CYCLE-37): complete neighborhood images and replace old IDX with Bridge fallback
```

Pushed to `origin/main` at 2026-05-16T02:30Z (approx).

## Pre-commit gates

- typecheck: PASS
- lint: PASS
- build: PASS
- audit:no-old-idx (NEW): PASS — 477 files
- audit:neighborhood-images-deep (NEW): PASS — 23/23 markets
- audit:brand: PASS — 12/12 (after annotating IDX/MLS disclosure paragraph in ErrorPanel)
- audit:hero-contrast:stable: PASS — 145/145
- audit:completeness: PASS — IDX category swapped from matrix-iframe sentinel set to Bridge-shape sentinel set
- audit:images: PASS — 397 img tags + 57 og:image refs resolve
- audit:rendered: PASS — 0 broken images across 175 probes
- audit:mobile-readability: PASS — 84/84
- audit:route-inventory: PASS — 48 sitemap routes reconcile
- audit:no-fabrications: PASS
- audit:qa-gate: PASS — critical 0
- 12 additional category audits: PASS

## Pre-commit secret + chunk safety

- staged patch secret check: clean
- prohibited raw chunks staged: none
- gitignored: docs/artifacts/**/*.png (visual-qa screenshots — reproducible by capture-baseline)

## Files staged

- 7 hero JPGs (public/markets/*) replaced
- 7 OG JPGs (public/og-markets/*) replaced
- 1 source file deleted (src/components/IdxEmbed.tsx)
- 5 source files modified (src/app/page.tsx, src/components/bridge/BridgeSearch.tsx, src/lib/bridge-client.ts, src/lib/bridge.ts, src/lib/site.ts)
- 4 script files (3 new + 1 modified): scripts/audit-neighborhood-images-deep.ts (NEW), scripts/audit-no-old-idx.ts (NEW), scripts/generate-neighborhood-images.ts (NEW), scripts/audit-completeness.ts (modified)
- package.json — added audit:no-old-idx + audit:neighborhood-images-deep + wired into audit:all
- 18 reports (mostly auto-regen) + 4 new reports: audit-neighborhood-images-deep.{json,md} + audit-no-old-idx.{json,md}
- 14 cycle-37 artifacts in docs/artifacts/cycle-37-neighborhood-images-bridge-idx/

## Working tree after commit

- ahead/behind: in sync with origin/main at ed24e69
- 3 untracked Cycle-35 log files remain (out of scope)

## Untracked at commit-time (not added)

- docs/artifacts/cycle-35-recovery-full-completion/logs/{final-deploy-20260514-155531.log,latest-final-deploy-log.txt,latest-final-deploy-session.txt} — pre-existing untracked logs from a prior cycle
- docs/artifacts/cycle-37-neighborhood-images-bridge-idx/visual-qa/local/*.png — 20 PNGs gitignored intentionally
- docs/artifacts/cycle-37-neighborhood-images-bridge-idx/generated-assets-tmp/ — empty scratch dir
