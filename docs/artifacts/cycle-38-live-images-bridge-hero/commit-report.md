# Cycle 38 — Commit Report

date: 2026-05-16

## Commit

- Hash: `8eaf986c411d08db8c443387b74da72bdcc02293` (`8eaf986`)
- Branch: `main`
- Pushed: `origin/main` matches HEAD after push.
- Files staged: 77 (source + assets + scripts + reports + artifacts).

## Subject + body

```
feat(MIA-SITE-CYCLE-38): fix live neighborhood images and launch Bridge-wired hero search
```

(Full body in git log; mission summary covers the 7-image regeneration, the
operator-authorized hero image reuse, the floating search card, the
BridgeSearch URL-param prefill, the new audit, and the gate results.)

## Pre-commit checks executed

- `git diff --check` — clean (no whitespace conflicts).
- `git diff --cached --name-only` reviewed; no prohibited raw chunk files (`staging-html/*chunk*.js`, `*page-*.js`).
- Staged-patch secret-shape grep (`BRIDGE_SERVER_TOKEN=…`, `Bearer …`, etc.) — 0 hits.
- Untracked Cycle-35 leftover logs (3 files) intentionally NOT staged — they predate Cycle 38 and belong to a prior cycle's artifact directory.

## Files of note

- `src/app/page.tsx` — hero swap + floating search + comment block updated.
- `src/components/HeroSearch.tsx` — floating-variant + /home-search/ wiring.
- `src/components/bridge/BridgeSearch.tsx` — URL-param prefill + auto-search.
- `public/hero/mia-home-hero.jpg` + `…-og.jpg` — new operator-authorized hero asset.
- `public/markets/<slug>.jpg` + `public/og-markets/<slug>.jpg` for the 7 affected slugs — regenerated.
- `scripts/generate-neighborhood-images-v2.ts` — Gemini regenerator with perimeter-whiteness validator.
- `scripts/probe-live-neighborhood-images.ts` — headless-Chrome DOM probe.
- `scripts/audit-home-bridge-search.ts` + `package.json` audit script.
- `docs/artifacts/cycle-38-live-images-bridge-hero/**` — 23 artifact files documenting the cycle.

## What was NOT committed

- The 3 Cycle-35 leftover logs in `docs/artifacts/cycle-35-recovery-full-completion/logs/`.
- No `.env`, no Bridge tokens, no Dokploy tokens, no API keys.
- No raw chunked JS files from staging HTML.
