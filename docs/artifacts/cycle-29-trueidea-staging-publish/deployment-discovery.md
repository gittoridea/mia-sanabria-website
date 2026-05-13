# Cycle 29 — Deployment Mechanism Discovery

**Date:** 2026-05-13
**Repo HEAD:** `5a45ad4` (clean, ahead/behind 0/0 vs `origin/main`)
**Live URL under investigation:** `https://miasanabriarealtor.trueidea.com/`

## Pre-deploy live state (stale → publish required)

| Marker | Live count | Local `out/index.html` count | Verdict |
|---|---|---|---|
| `Luxury and waterfront real estate across Fort Lauderdale...` (old H1) | 1 | 0 | old build still served |
| `South Florida Lifestyle` (new) | 0 | 1 | new build not deployed |
| `Home Search` (new aria-label) | 0 | 1 | new build not deployed |
| `/markets/{deerfield-beach,coral-springs,plantation,weston,hollywood,davie,sunrise}/` | all `HTTP/2 404` | dirs exist locally | new routes not deployed |

Live ETag: `digazs0gnm684p4a` | Last-Modified: `Tue, 12 May 2026 01:22:56 GMT` (older than +7 local commits)

## Serving mechanism

`https://miasanabriarealtor.trueidea.com/` is served by:

- **Platform:** Dokploy at `https://dokploy.trueidea.com/` on the Helos VPS (`148.230.82.215`)
- **Dokploy application ID:** `XJSRlvH-91ZtUsh0RPGvo`
- **Source:** `git@github.com:gittoridea/mia-sanabria-website.git` branch `main` (origin/main verified at `5a45ad4`)
- **Build:** repo `Dockerfile` (multi-stage `oven/bun:1.3` → `caddy:2-alpine`)
  - Build arg: `NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.trueidea.com`
  - Produces Next.js 15 static export (`output: "export"`, `trailingSlash: true`) under `/srv`
- **Runtime:** Caddy `:80` inside container (see `Caddyfile`), Traefik in front terminates TLS
- **Cache:** Caddy `max-age=300, s-maxage=600, must-revalidate` on HTML — known stale-serve window after deploy

## Canonical deploy path

`scripts/deploy-and-verify.ts` is the established, auditable mechanism:

1. Preflight: `bun run typecheck` → `bun run lint` → `bun run build` → `bun run audit:all` → `audit-completeness` FAIL=block gate
2. Loads `DOKPLOY_API_URL` + `DOKPLOY_API_TOKEN` from `~/.claude/.env` (values never printed)
3. POSTs to Dokploy `application.deploy` with `applicationId=XJSRlvH-91ZtUsh0RPGvo`
4. Polls `application.one` until `applicationStatus != "running"`
5. Cache-busted HEAD on `https://miasanabriarealtor.trueidea.com/` confirms Last-Modified flip
6. Optional `--wait-for-needle=<substring>` polls live HTML until a new-build copy needle appears (defeats Caddy s-maxage stale-serve)
7. Optional Lighthouse sweep

## Confidence

**High.** Dockerfile + Caddyfile + DEPLOY.md + deploy-and-verify.ts all agree on this topology. Local repo's `out/markets/` contains all 7 new neighborhood dirs (deerfield-beach, coral-springs, plantation, weston, hollywood, davie, sunrise) plus 16 additional approved neighborhoods. Origin/main already at `5a45ad4` (Dokploy will pull this). No DNS change required — the staging hostname A record is already pointing at `148.230.82.215`.

## Scope guard

The deploy touches **only** the Dokploy application `XJSRlvH-91ZtUsh0RPGvo`, which serves **only** `miasanabriarealtor.trueidea.com`. No changes to:

- `miasanabria.com`
- `miasanabriarealtor.com` (Direct Axess host, untouched)
- DNS for any zone
- `.env` values (read internally by script, never printed)
- GHL / Google / Bridge / database

## Chosen path

**Path A — Dokploy app identified.** Execute `bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle="South Florida Lifestyle"`. The script's bundled preflight covers Phase 4 build validation.

## Risks

- Caddy s-maxage=600 may serve stale up to ~10 minutes after deploy. Mitigated by `--wait-for-needle` polling.
- If preflight `audit:all` flags new FAILs (unlikely — HEAD `5a45ad4` is the gate-clearing commit), the script will abort and no deploy fires.
