# Cycle 33 — Secret Safety Report

**Date:** 2026-05-14

## Pre-implementation Scan

### Repo secret assignment scan
```bash
git grep -nIE "(BRIDGE_[A-Z_]+|server_token|browser_token|client_secret|access_token|refresh_token|api_key)\s*[:=]\s*['\"][^'\"]+['\"]" -- ':!node_modules' ':!.next' ':!out'
```
**Result:** 0 hits — no token values assigned in repo source.

### Generated output scan
```bash
grep -RniE "BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|access_token=|Bearer [A-Za-z0-9._-]+" out .next 2>/dev/null
```
**Result:** `out/` and `.next/` do not exist (no build artifact present in working tree).

### No .env files
`.env`, `.env.local`, `.env.production` — none found in repo root or subdirectories.

## Architecture Safety Analysis

| Credential | Where it lives | Where it does NOT live | Status |
|---|---|---|---|
| `BRIDGE_CLIENT_ID` | To be placed in Dokploy env (not build arg) | Repo, chat, screenshots, logs | Safe |
| `BRIDGE_SECRET_ID` (Client Secret) | External only — NOT needed for browser token architecture | Repo, chat, browser bundle | Safe — excluded from this architecture |
| `BRIDGE_SERVER_TOKEN` | External only — NOT needed for browser token architecture | Repo, chat, browser bundle | Safe — excluded from this architecture |
| `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` | Dokploy build arg → baked into client bundle | Repo source, chat, logs | Safe per Bridge design; Referrer Domain required |
| `NEXT_PUBLIC_BRIDGE_DATASET_ID` | Dokploy build arg → baked into client bundle | Repo source | Safe — not a secret |

## Bridge Token in Client Bundle

The `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` value will appear in:
- The built JavaScript bundle (`out/_next/static/chunks/*.js`)
- Browser network requests to Bridge API (as `?access_token=...` query param)
- Browser dev tools network panel

This is **by design** — Bridge explicitly documents the Browser Token for browser use. The Referrer Domain restriction in the Bridge dashboard limits which domains can successfully use the token. Risk acceptance is documented in `browser-token-risk-acceptance.md`.

**The Server Token and Client Secret must NEVER appear in the bundle.** The browser-token architecture excludes them entirely.

## Post-build Verification Protocol

After any Dokploy deploy with `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` set, run:

```bash
# Scan generated output for server-grade credentials (should find none)
grep -RniE "BRIDGE_SERVER_TOKEN|BRIDGE_SECRET_ID|client_secret" out .next 2>/dev/null || echo "CLEAN"

# Confirm browser token appears only in expected bundle location (acceptable)
grep -rniE "NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN" out .next 2>/dev/null | wc -l
```

## Current Status

**CLEAN** — No secrets in repo, no .env files, no build artifacts present. Implementation code uses `process.env.NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` (standard Next.js client env pattern). Server token and client secret are not referenced in any implementation code.
