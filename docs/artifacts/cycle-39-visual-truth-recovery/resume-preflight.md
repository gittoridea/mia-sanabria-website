# Cycle 39 — Resume Preflight

date: 2026-05-16
branch: main
head: 43a4dfd8feea2d05a1b378f309c01ca7b1a31484
origin_main: 43a4dfd8feea2d05a1b378f309c01ca7b1a31484
head_equals_origin_main: true
cycle38_commits:
  - 43a4dfd docs(MIA-SITE-CYCLE-38): final-deploy alignment report + post-deploy logs
  - 2b122b6 docs(MIA-SITE-CYCLE-38): record live image Bridge hero verification
  - 8eaf986 feat(MIA-SITE-CYCLE-38): fix live neighborhood images and launch Bridge-wired hero search
working_tree_clean: false  # only Cycle-35 untracked logs
uncommitted_files:
  - docs/artifacts/cycle-35-recovery-full-completion/logs/final-deploy-20260514-155531.log
  - docs/artifacts/cycle-35-recovery-full-completion/logs/latest-final-deploy-log.txt
  - docs/artifacts/cycle-35-recovery-full-completion/logs/latest-final-deploy-session.txt
running_validation_processes: none
running_deploy_processes: none
tmux_sessions: none
safe_to_continue: true
first_incomplete_or_incorrect_item: |
  Cycle 38 closed reporting "live_verified" and "23/23 PASS" on neighborhood
  images, but the operator reports the seven images did NOT visually update,
  the homepage hero regressed, and homepage search is not properly wired to
  Bridge. The structural cause is that Cycle 38 replaced files at the SAME
  unversioned asset URLs (/markets/<slug>.jpg, /og-markets/<slug>.jpg,
  /hero/mia-home-hero.jpg) — byte-count + HTTP-200 + DOM <img> presence all
  remain true while the operator's browser (and any intermediate cache) can
  legitimately keep serving the prior pixels. No path-level cache-bust was
  applied. The fix this cycle is versioned asset filenames so cache cannot lie.
locked_constraints_to_preserve:
  - "Homepage H1 (two lines exactly): 'South Florida Lifestyle' / 'Home Search' (decision record §Homepage hero, locked)."
  - "Approved neighborhoods (9, locked) — must not change."
  - "Caddy + Dokploy deploy substrate — never edit prod config without redeploy."
  - "Token values never written to source, commits, logs, or transcripts."
expected_outputs:
  - Versioned image filenames `/markets/<slug>-cycle39.jpg` + `/og-markets/<slug>-cycle39.jpg` for the seven slugs.
  - Versioned hero asset `/hero/mia-home-hero-cycle39.jpg` after reference-hero re-verification.
  - New `scripts/test-home-search-bridge-e2e.ts` (real browser via google-chrome --headless=new).
  - New `scripts/probe-reference-hero-visual.ts` (computed-background extraction).
  - audit-neighborhood-images-deep.ts strengthened to FAIL if any of the seven
    slugs reference the unversioned path in live DOM or in markets.ts source.
