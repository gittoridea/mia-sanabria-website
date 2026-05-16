# Cycle 38 — Resume Preflight

date: 2026-05-16
mission: live image fix + Bridge referrer-domain retest + homepage hero + dev deploy

## Repo state

- branch: main
- head: `e7635840b64fd9366e690f437dcfe09cc3a71a5f` (`e763584`)
- origin/main: `e7635840b64fd9366e690f437dcfe09cc3a71a5f` (`e763584`)
- head_equals_origin_main: true
- working_tree_clean: false (three pre-existing untracked Cycle-35 log files)

## Current Cycle 37 commits already on main

- `e763584` — docs(MIA-SITE-CYCLE-37): final-deploy alignment report + post-deploy logs
- `240c2c7` — fix(MIA-SITE-CYCLE-37): remove `sef.mlsmatrix.com` from Caddyfile CSP frame-src
- `52a33db` — docs(MIA-SITE-CYCLE-37): record staging deploy + live verification + ISA log
- `ed24e69` — feat(MIA-SITE-CYCLE-37): complete neighborhood images and replace old IDX with Bridge fallback

These are the prior-cycle starting point for Cycle 38.

## Uncommitted files (pre-existing, not from Cycle 38)

```
?? docs/artifacts/cycle-35-recovery-full-completion/logs/final-deploy-20260514-155531.log
?? docs/artifacts/cycle-35-recovery-full-completion/logs/latest-final-deploy-log.txt
?? docs/artifacts/cycle-35-recovery-full-completion/logs/latest-final-deploy-session.txt
```

All three are leftover Cycle 35 deploy logs from 2026-05-14. They do not block Cycle 38; they will not be staged by Cycle 38 commits.

## Running processes (host)

- `openclaw` gateway on :18789 (long-running, unrelated)
- two iflow-mcp GHL servers (long-running, unrelated)
- No active deploy, audit, build, capture, or playwright processes.
- No tmux sessions.

## Available specialists (from `~/.claude/agents/`)

Algorithm, Anvil, Architect, Arthur, Artist, Cato, ClaudeResearcher, CodexResearcher, Designer, Engineer, Forge, GeminiResearcher, GrokResearcher, PerplexityResearcher, Silas. (PAI-side; some only useful for specific lanes.)

## Operator-reported live failure (acceptance)

The operator reports that the following neighborhood images are NOT displaying on the live dev site `https://miasanabriarealtor.trueidea.com/`:

- Deerfield Beach
- Hollywood
- Plantation
- Weston
- Coral Springs
- Davie
- Sunrise

Visible on both `/markets/` and each `/markets/<slug>/` detail page.

Cycle 37 artifacts claim these were generated, audit-passed, and live-verified. The operator's live report supersedes prior audit claims; Cycle 38 will reproduce the live failure first.

## Bridge external change (acceptance)

Operator reports Bridge referrer-domain configuration now includes all 3 domains. Cycle 38 will retest Bridge runtime truthfulness end-to-end; will not flip demo flag on hope alone.

## Safe to continue

- safe_to_continue: yes
- first_incomplete_item: Phase 1 — prior-state review, then Phase 2 live reproduction.

## Mission completion definition (terminal)

- All seven named neighborhood cards show visible images on `/markets/` live.
- All seven detail pages show visible hero images live.
- Live image asset URLs return HTTP 200 and `naturalWidth > 0` via Playwright.
- Homepage hero uses operator-authorized miasanabria.com hero asset.
- Homepage floating search wires to `/home-search/` with Bridge-compatible params at mobile/tablet/desktop.
- Bridge mode on staging classified truthfully (live or demo or fallback or error).
- No old IDX/MLS Matrix runtime remains in `src/`, `public/`, `out/`, `.next/`, `Caddyfile`, `Dockerfile`, `next.config.ts`.
- All validation gates pass.
- Staging deploy completes with `EXIT_CODE:0`.
- `https://miasanabriarealtor.trueidea.com/` confirmed live with current commit.
- Deployed commit equals `origin/main` HEAD.
- No secrets exposed; no production/DNS/GHL/Google/Bridge credential writes.
