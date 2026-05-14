# Lane F — Bridge IDX Runtime Readiness Dossier

**Author lens:** Security / Bridge IDX Architect
**Scope:** prepare a secure Bridge IDX runtime path without using credentials, without calling Bridge, without writing runtime wiring. Document the design space; flag any "iframe v1 ships fine" claims as launch decisions, not closures.
**Inputs reviewed:** `src/lib/bridge.ts` (full read), `next.config.ts` static-export setting, project CLAUDE.md "DOKPLOY_API_TOKEN etc. stay in ~/.claude/.env" rule, Cycle 21 team-reports/team3-idx-search.md, Cycle 29 deployment-discovery.md.

## Current scaffold status

| Item | Status |
|---|---|
| `src/lib/bridge.ts` | scaffold only; `BRIDGE_INTEGRATION_LIVE = false`; module does **not** call `process.env`; module does **not** call Bridge. |
| Public docs URL constant | `BRIDGE_DOCS_URL = "https://bridgedataoutput.com/docs/platform/"` — public Bridge documentation URL, not a token. |
| Env-var name registry | `BRIDGE_ENV_NAMES` — names only (no values). Used to make the env contract greppable. |
| Sanitized response type | `SanitizedListing` type defined — what the future server-side proxy returns to the browser. Excludes raw Bridge fields that could leak pricing model internals, exclusive-access data, or PII. |
| Search criteria input type | `ListingSearchCriteria` — what the hero search collects and posts to the future proxy. |
| Public-page Bridge calls | **none** — verified by `BRIDGE_INTEGRATION_LIVE === false` check + grep of `src/` for `BRIDGE_SERVER_TOKEN` / `BRIDGE_SECRET_ID` / `bridgedataoutput.com` (only the docs URL constant appears). |
| Live HTML on staging | Cycle 30 narrow-secret scan against live root: **0 hits** on `server_token` / `client_secret` / `access_token` / `refresh_token` / `Bearer …` / assigned `BRIDGE_*`. |

**Static-export blocker:** the site is configured for Next.js static export (`next.config.ts` — see project CLAUDE.md). There is no Node runtime, no Server Component, no Edge runtime, and no Node middleware in this app capable of safely holding `BRIDGE_SERVER_TOKEN`. Bridge cannot be called from the current architecture without an architectural change.

## Secure architecture options

### Option A — Edge function proxy in front of static export *(recommended for v2)*

**Shape:**
- A Cloudflare Worker (or Vercel Edge Function, or Dokploy Node sidecar) at e.g. `/api/bridge/*` holds `BRIDGE_SERVER_TOKEN` + `BRIDGE_SECRET_ID` in CF Worker secrets / equivalent.
- Worker calls Bridge, normalizes/sanitizes response via `SanitizedListing` shape, returns JSON.
- Static site fetches `/api/bridge/search?q=...` — no secret material in browser bundle.

**Pros:** no Next.js runtime change. Static export stays static. Worker can rate-limit + cache.
**Cons:** new external runtime to operate (Worker quota, deploy pipeline). Cross-origin CORS to configure.
**Credential placement:** CF Worker secret store (or Dokploy env in sidecar variant). **Never in repo. Never in chat.**

### Option B — Drop static export for IDX routes only

**Shape:**
- Switch `/markets/[slug]/listings/*` and `/listings/*` routes to Next.js Server Components / Route Handlers.
- Rest of site stays static.
- Server-side fetches Bridge directly using `BRIDGE_SERVER_TOKEN` from Dokploy env.

**Pros:** stays inside one runtime; no second service to operate; tight SSR.
**Cons:** requires `next.config.ts` change (drop static export OR switch to `output: 'standalone'` + selective static routes). Dokploy build settings change (Caddy static → Node runtime). Bigger blast radius.
**Credential placement:** Dokploy environment variables on app `XJSRlvH-91ZtUsh0RPGvo`. Marked "Secret" so not exposed in build logs.

### Option C — Iframe-based MLS Matrix (current SEF MLS Matrix shim, v1)

**Shape:**
- Keep the SEF MLS Matrix iframe currently embedded for property search (`<iframe src="https://sef.mlsmatrix.com/…">` — already present per `content-security-policy` allowing `frame-src 'self' https://sef.mlsmatrix.com`).
- No Bridge calls at all.
- Acceptable for v1 launch if Mia + Torrey + counsel agree.

**Pros:** zero credential surface; no runtime change; counsel-friendly (SEF MLS handles IDX disclaimer + reciprocity).
**Cons:** no indexable inventory; no Bridge-data depth; no listing detail pages on `miasanabria.com`.
**Credential placement:** none.

### Option D — Browser-safe Bridge endpoints (only if Bridge docs explicitly authorize)

**Shape:**
- Bridge docs (verify on `https://bridgedataoutput.com/docs/platform/`) may permit a public-only "browser token" against specific read-only endpoints.
- If yes: `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` ships in the bundle for those specific endpoints only.
- Server token NEVER ships under any option.

**Pros:** simplest implementation if docs permit.
**Cons:** Bridge ToS may forbid browser-side use for the intended dataset. Read-only and rate-limited. Misuse risk: developer accidentally calls a privileged endpoint with the browser token and discovers (silently) the call fails — but the token is leaked.
**Credential placement:** `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` only. **Server token still external.**

## Recommended v1 path

**Option C** (iframe MLS Matrix) for v1 launch, **explicitly recorded as a launch exception** per `launch-doD.md` LE template. Then **Option A** (Edge worker proxy) as v2 architecture for Bridge integration depth, scheduled post-launch.

**Critical correction to prior cycles:** Cycle 30 `launch-blocker-matrix.md` Group 5 marks Bridge as "non-critical (iframe MLS Matrix still works for v1)." That is not the same as an **explicit recorded approval** to launch with iframe-only. Until Torrey + Mia (+ counsel for IDX disclaimer review) record a `LE-NNNN` exception, Bridge IDX architecture is a **launch decision required**, not closed.

## Exact secret placement requirements (when Cycle 33 fires)

| Secret | Where it lives | Where it MUST NOT live |
|---|---|---|
| `BRIDGE_CLIENT_ID` | CF Worker secret (Option A) **or** Dokploy env "Secret" (Option B) | repo, chat, screenshots, build logs, commit messages, `.env.example`, browser bundle |
| `BRIDGE_SECRET_ID` | server-only — CF Worker secret **or** Dokploy env | anywhere else (zero-tolerance) |
| `BRIDGE_SERVER_TOKEN` | server-only — CF Worker secret **or** Dokploy env | anywhere else (zero-tolerance) |
| `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` | (only if Bridge docs authorize, Option D only) — Dokploy `NEXT_PUBLIC_*` build-arg | as a Server token. Never mix the two. |
| `BRIDGE_DATASET_NAME` | CF Worker env **or** Dokploy env (not a secret per se, but contextual) | n/a |

## Sanitized request / response boundary

The future proxy contract:

```
Browser → /api/bridge/search?<ListingSearchCriteria fields>
  ↓ proxy holds BRIDGE_SERVER_TOKEN + BRIDGE_SECRET_ID + BRIDGE_CLIENT_ID
  ↓ proxy calls Bridge with normalized criteria
  ↓ Bridge returns full payload (may include pricing model, internal fields, etc.)
Proxy → Browser: only SanitizedListing[] shape per src/lib/bridge.ts
```

Allowed exposed fields: `mlsNumber`, `city`, `state`, `zip`, `beds`, `baths`, `listPrice`, `primaryPhotoUrl` (CDN-host-allowlisted), `status` (normalized), `listDate` (ISO).
Disallowed: raw Bridge response, agent attribution beyond standard IDX disclaimer surface, internal scoring fields, gross-commission data, off-market addresses.

## Risks

1. **Server token leak** — if any path of the chosen runtime exposes it to the browser bundle or build log, every assistance pipeline (chat, screenshots, commits) becomes a leak surface. Mitigation: secret scanner in CI; narrow grep on `out/` per cycle; never paste in chat.
2. **Bridge ToS / IDX rules violation** — IDX agreements typically forbid bulk scraping, archival storage, or re-display beyond the timing rules. Mitigation: counsel review before live, server-side rate limit, no archival cache > IDX-allowed TTL.
3. **Stale-listing publication** — listings update frequently; static-export pages with cached listings drift. Mitigation: never bake listings into static HTML; always fetch via proxy at request time (Option A) or SSR (Option B).
4. **Pricing leak via response field** — Bridge may return data we should not surface. Mitigation: `SanitizedListing` is the only shape allowed across the proxy boundary; reject everything else in the response.
5. **CORS misconfiguration** (Option A) — Worker accepting all origins reflectively. Mitigation: Worker validates `Origin` is the canonical host.

## Implementation DoD (for the future Cycle 33)

- [ ] Runtime decision recorded in `docs/mia-client-decision-record.md` §"Bridge runtime decision" with date + approver.
- [ ] Credential placement chosen (CF Worker secrets OR Dokploy env "Secret"). No values in chat.
- [ ] Proxy boundary implemented; `SanitizedListing` enforced (response that doesn't match → reject + log).
- [ ] CORS locked to `https://miasanabria.com` (and `www.miasanabria.com`) only.
- [ ] Rate limiting at proxy.
- [ ] CSP allows the proxy origin (if cross-host); otherwise served same-origin.
- [ ] `audit:no-fabrications` still 0 hits with listings rendering.
- [ ] No `BRIDGE_*` value appears in `out/` after build (narrow scan).
- [ ] Counsel sign-off on IDX disclaimer + brokerage attribution rendered alongside listings.
- [ ] `BRIDGE_INTEGRATION_LIVE` flipped to `true` only when all of above are green.
- [ ] Rollback path documented: flip `BRIDGE_INTEGRATION_LIVE` to `false`; site falls back to MLS Matrix iframe (Option C) within one redeploy.

## Future paste-ready Bridge implementation prompt

See `future-prompt-bank.md` → "Cycle 33 — Bridge Runtime Architecture."

## Launch-decision required

Until either:

1. Torrey + Mia (+ counsel for IDX disclaimer review) record a `LE-NNNN` "launch with Option C iframe v1 only" exception in `docs/mia-client-decision-record.md`, OR
2. Cycle 33 ships Option A or Option B before cutover,

Bridge IDX is classified as **launch-decision-required**, not "non-critical." Cycle 30 row 22 in the launch-blocker matrix is updated by this dossier to reflect that.
