# Cycle 39 — Secret Safety Report

date: 2026-05-16

## Source-tree secret scan

```bash
git grep -nIE "(BRIDGE_[A-Z_]+|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN|DOKPLOY_API_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|server_token|browser_token|client_secret|access_token|refresh_token|api_key)\s*[:=]\s*['\"][^'\"]+['\"]" \
  -- ':!node_modules' ':!.next' ':!out' ':!**/*.lock' \
  ':!docs/artifacts/**/staging-html/*chunk*.js' \
  ':!docs/artifacts/**/staging-html/*page-*.js'
```

Hits classified:

| Match | Path | Classification |
|-------|------|----------------|
| `BRIDGE_DOCS_URL = "https://bridgedataoutput.com/docs/platform/"` | `src/lib/bridge.ts` + Cycle 30b/35/36 dossiers | PUBLIC documentation URL; not a token |
| `BRIDGE_API_BASE = "https://api.bridgedataoutput.com/api/v2/OData"` | `src/lib/bridge-client.ts` | PUBLIC Bridge OData host; not a token |
| `BRIDGE_IDX_RESOURCE = "idx/Properties"` | `src/lib/bridge.ts` | PUBLIC resource path constant; not a token |

No token-shaped values present (no high-entropy strings, no bearer-prefixed
authorization headers, no access-token or refresh-token assignments in
source).

## Built-output secret scan

```bash
grep -RniE "BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|BRIDGE_CLIENT_ID|BRIDGE_DATASET_ID|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|access_token=|refresh_token=|Bearer [A-Za-z0-9._-]+|DOKPLOY_API_TOKEN" out/
```

Hits classified:

| Match shape | Path | Classification |
|-------------|------|----------------|
| `m.env.NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN`, `m.env.NEXT_PUBLIC_BRIDGE_DATASET_ID`, `m.env.NEXT_PUBLIC_BRIDGE_RESOURCE_PATH`, `m.env.NEXT_PUBLIC_BRIDGE_DEMO`, `m.env.NEXT_PUBLIC_BRIDGE_MEDIA_HOSTS`, `m.env.NEXT_PUBLIC_GA_ID`, `m.env.NEXT_PUBLIC_USERWAY_ID` | `out/_next/static/chunks/app/home-search/page-dba4a5142c08b340.js` | Variable NAME references — Webpack's compiled `process.env.*` lookups. NO value substituted at local build (env vars unset). On Dokploy build, NEXT_PUBLIC_* values are inlined by design (browser-side tokens) — that is Bridge's expected mechanism and was already the case in Cycle 38. Cycle 39 introduces no new secret surface. |
| `access_token` (string literal) | `out/_next/static/chunks/app/home-search/page-dba4a5142c08b340.js` | Used as the URL query-param name when calling Bridge OData: `l.access_token = h` — the literal string "access_token" is the API parameter name, not a value. |

## ~/.claude/.env probe (presence-only)

```bash
node -e 'for (const k of ["BRIDGE_SERVER_TOKEN","BRIDGE_CLIENT_SECRET","BRIDGE_CLIENT_ID","BRIDGE_DATASET_ID","NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN","BRIDGE_BROWSER_TOKEN","DOKPLOY_API_URL","DOKPLOY_API_TOKEN","GOOGLE_API_KEY","GEMINI_API_KEY"]) console.log(k, process.env[k] ? "present" : "missing")'
```

Run only after `set +x; set -a; source ~/.claude/.env; set +a` and only
the presence/absence string is captured to docs — never the values.

## Staged-patch secret check (executed pre-commit)

`git diff --cached | grep -E "BRIDGE_SERVER_TOKEN=[A-Za-z0-9]|BRIDGE_CLIENT_SECRET=[A-Za-z0-9]|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN=[A-Za-z0-9]|GOOGLE_API_KEY=[A-Za-z0-9]|GEMINI_API_KEY=[A-Za-z0-9]|OPENAI_API_KEY=[A-Za-z0-9]|Bearer [A-Za-z0-9._-]+|access_token=[A-Za-z0-9._-]+|refresh_token=[A-Za-z0-9._-]+"`
→ "staged patch secret check clean"

## Prohibited chunk-file staging check

`git diff --cached --name-only | grep -E 'staging-html/.*(chunk|page-).*\.js'`
→ "no raw chunks staged"

## Findings

- **Zero token-shaped values** introduced in source or staged for commit.
- **Zero raw chunk files** staged.
- **All Bridge env var references** in built output are variable NAMES, not values — same surface as Cycle 38, unchanged by Cycle 39.

## Compliance with mission's hard security rules

- No `cat .env` or `cat ~/.claude/.env` executed.
- No `env` or `printenv` invoked.
- No chunk file content captured to artifact.
- No key rotation, no value-echo, no token-bearing patch committed.
