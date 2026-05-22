# Bridge IDX Live Activation — Operator Checklist

> Generated: 2026-05-22 · Branch: `activate-bridge-idx-live`
> This file contains NO token values. All secrets stay in `~/.claude/.env` and
> Dokploy build secrets. Confirm each item, then trigger a Dokploy **rebuild**
> (NEXT_PUBLIC_* vars are baked at build time — a redeploy without rebuild will
> serve a stale bundle).

## A. Bridge dashboard (bridgedataoutput.com) — human verification required

Cannot be verified from this repo/CI. Confirm in the Bridge dashboard:

- [ ] Mia's account has **approved API/IDX data access** for the MIAMI / Southeast
      Florida / **MIAMI REALTORS (MiamiRE)** dataset.
- [ ] **API Access Tokens** exist for the account.
- [ ] **Browser Token** is enabled (this is the only token shipped client-side).
- [ ] **Dataset code** matches `NEXT_PUBLIC_BRIDGE_DATASET_ID` exactly.
      Prior docs suggest `miamire` — confirm the exact code in the dashboard;
      do not assume.
- [ ] **Production resource path** is `idx/Properties` (not `Property`).
      `Property` is only valid for Bridge test datasets without an IDX feed.
- [ ] **Referrer / domain restrictions** include the live host(s):
  - [ ] `miasanabriarealtor.trueidea.com` (staging)
  - [ ] `miasanabria.com` (production cutover, if applicable)
  - [ ] `www.miasanabria.com`
  - [ ] `miasanabriarealtor.com` (only if still used for production/cutover)
  - [ ] `localhost` / `127.0.0.1` (only if local browser testing is needed)
- [ ] `NEXT_PUBLIC_BRIDGE_DEMO` is **false or unset** for live mode.

## B. Dokploy build env (applicationId `XJSRlvH-91ZtUsh0RPGvo`)

Set these as **build-time** env / secrets so they bake into the static bundle.
Values redacted — copy from the Bridge dashboard / token email.

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://miasanabriarealtor.trueidea.com` | staging; swap for prod URL at cutover |
| `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` | `<REDACTED — Browser Token>` | client-safe browser token ONLY |
| `NEXT_PUBLIC_BRIDGE_DATASET_ID` | `<REDACTED — confirm; likely miamire>` | exact dashboard dataset code |
| `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH` | `idx/Properties` | production IDX path |
| `NEXT_PUBLIC_BRIDGE_DEMO` | `false` | or leave unset |
| `NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS` | `<blank unless a real live host is observed>` | HTTPS host suffixes only |

NEVER place `BRIDGE_SERVER_TOKEN`, `BRIDGE_SECRET_ID`, or `BRIDGE_CLIENT_ID`
(when paired with secret/token context) into any `NEXT_PUBLIC_*` var — they
must never reach client code.

## C. Rebuild + verify

1. [ ] Save the Dokploy build env above.
2. [ ] Trigger a **fresh rebuild** (not just redeploy) so the new env bakes in.
3. [ ] Confirm the live `etag:` header changed before claiming success.
4. [ ] Run the strict live audit (locally, against staging):

   ```sh
   bun run test:home-bridge-e2e:live
   # or, custom base:
   bun run audit:bridge-live -- --base=https://miasanabriarealtor.trueidea.com
   ```

5. [ ] Confirm `proven_live: YES` in
       `docs/artifacts/bridge-idx-live-activation/report.md`.

## D. If it fails — classification (auto-printed by the audit)

- `mode=fallback` → build env vars missing at build time, or stale bundle. Fix Dokploy build args + rebuild.
- `mode=demo` → `NEXT_PUBLIC_BRIDGE_DEMO=true` or stale demo bundle. Set false/unset + rebuild.
- `mode=ready` → configured but in-browser fetch did not succeed (401/403/404/CORS). See below.
- `mode=error` → Bridge fetch failed:
  - **HTTP 401** — wrong/expired Browser Token, or a Server Token/Secret pasted into the wrong var.
  - **HTTP 403** — data access not approved, token lacks dataset permission, or referrer/domain restriction wrong.
  - **HTTP 404** — wrong dataset code or wrong resource path.
  - **CORS/referrer** (browser fails, API works elsewhere) — fix Bridge dashboard referrer/domain settings.
- **Zero results (broad query)** — re-test without filters; only call it a failure if a broad live query also returns nothing.
- **No photos** — inspect the media host (host only, never tokenized URL) and add it via `NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS` (HTTPS host suffix only).
