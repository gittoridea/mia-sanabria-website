# Bridge Config Presence Report

**Generated:** 2026-05-14T20:36Z
**Discipline:** names only. NO env values were printed, logged, screenshotted, or written to disk during this check.

## Local shell env (default)

| Variable | Status |
|---|:--:|
| `BRIDGE_SERVER_TOKEN` | missing |
| `BRIDGE_CLIENT_SECRET` | missing |
| `BRIDGE_CLIENT_ID` | missing |
| `BRIDGE_DATASET_ID` | missing |
| `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` | missing |
| `BRIDGE_BROWSER_TOKEN` | missing |
| `NEXT_PUBLIC_BRIDGE_DATASET_ID` | missing |
| `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` | missing |
| `NEXT_PUBLIC_BRIDGE_DEMO` | missing |
| `NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS` | missing |
| `BRIDGE_SECRET_ID` | missing |

## Local shell env after sourcing `~/.claude/.env`

| Variable | Status |
|---|:--:|
| All `BRIDGE_*` and `NEXT_PUBLIC_BRIDGE_*` | missing |

`~/.claude/.env` contains only Dokploy variables (`DOKPLOY_API_TOKEN`, `DOKPLOY_API_URL`, `DOKPLOY_BASIC_USER`, `DOKPLOY_BASIC_PASS`). **Bridge credentials are not in the local secret surface at all.**

## Repo references (var names only — no values present)

`Dockerfile` (lines 19-28) declares 5 build ARGs/ENVs:
- `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN`
- `NEXT_PUBLIC_BRIDGE_DATASET_ID`
- `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH`
- `NEXT_PUBLIC_BRIDGE_DEMO`
- `NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS`

These are populated at Docker build time from Dokploy build-arg configuration. None have hardcoded values in the Dockerfile. None appear in any `.env*` file in the repo.

`src/lib/bridge.ts` and `src/lib/bridge-client.ts` reference variable names in `process.env.NEXT_PUBLIC_BRIDGE_*` lookups. The values of those names are populated by Next.js's build-time inlining of `process.env.NEXT_PUBLIC_*` into the static bundle. **Local builds without those env vars produce a bundle where `BROWSER_TOKEN === ""` and `BRIDGE_AVAILABLE === false`** — the MLS Matrix iframe fallback ships.

## Where the credentials live

- **Dokploy build args** for application `XJSRlvH-91ZtUsh0RPGvo` (per `CLAUDE.md` Tech invariants).
- **Mia's Bridge dashboard** (account-side; not in any system this audit can read).
- **NOT in repo. NOT in shell. NOT in `~/.claude/.env`. NOT in any chat history.**

## Implications

- Cannot run a true live Bridge API probe from this local machine.
- Can build the probe script (Phase 5) — when run with env vars present, it will execute; without, it reports `credentialPresence: "missing"` and exits cleanly.
- Can probe the staging site (Phase 8) directly to learn what the deployed chunk does in practice.
- This is **Path C** territory in the mission brief: config missing locally, may exist in staging.
