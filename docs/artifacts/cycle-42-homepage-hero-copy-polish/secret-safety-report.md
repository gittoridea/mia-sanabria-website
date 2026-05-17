---
cycle: 42
artifact: secret-safety-report
generated_at: 2026-05-17
---

# Cycle 42 — Secret Safety Report

## Source-side scan

Pattern (regex): `(BRIDGE_[A-Z_]+|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN|DOKPLOY_API_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|server_token|browser_token|client_secret|access_token|refresh_token|api_key)\s*[:=]\s*['"][^'"\$\{]+['"]`

Excludes: `node_modules`, `.next`, `out`, lockfiles, `docs/artifacts/**/staging-html/*chunk*.js`, `docs/artifacts/**/staging-html/*page-*.js`, and any `process.env.X` / `env[X]` references.

Hits, classified:

| Location | Match | Classification |
|---|---|---|
| `src/lib/bridge-client.ts:26` | `BRIDGE_API_BASE = "https://api.bridgedataoutput.com/api/v2/OData"` | PUBLIC API hostname — Bridge OData base URL. Not a secret. |
| `src/lib/bridge.ts:76` | `BRIDGE_DOCS_URL = "https://bridgedataoutput.com/docs/platform/"` | PUBLIC documentation URL. Not a secret. |
| `src/lib/bridge.ts:97` | `BRIDGE_IDX_RESOURCE = "idx/Properties"` | PUBLIC OData resource path constant. Not a secret. |
| `docs/artifacts/cycle-*/secret-safety-report.md` and `docs/artifacts/cycle-*/master-claim-vs-reality.md` | references to the three constants above by name | Prior-cycle reports documenting the same classification. Not a secret. |

No `*_TOKEN`, `*_SECRET`, `*_CLIENT_ID`, `*_DATASET_ID`, `GOOGLE_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `DOKPLOY_API_TOKEN`, GHL token, `access_token`, `refresh_token`, Bearer token, `client_secret`, or `api_key` was found assigned to a literal string in source.

## Generated output scan (`out/`)

Pattern: `BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|BRIDGE_CLIENT_ID|BRIDGE_DATASET_ID|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|access_token=|refresh_token=|Bearer [A-Za-z0-9._-]+|DOKPLOY_API_TOKEN`

The only matches are inside `out/_next/static/chunks/app/home-search/page-*.js`, where the names appear as `process.env.NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN`, `process.env.NEXT_PUBLIC_BRIDGE_DATASET_ID`, etc. — the standard Next.js public-env-var lookup. Those are **variable name references**, not values. The Bridge runtime mode in this build resolved to `fallback`, which is the runtime declaration that those env vars were empty at build time. No actual token value was inlined.

The chunk also embeds the literal string `"access_token"` once — that is an OData query-parameter key the Bridge client uses when an env-injected token is present at runtime. Not a value, just the parameter name.

```yaml
out_scan_classification:
  process_env_name_references: present_and_expected
  literal_token_values: none_found
  bridge_runtime_mode_in_out: fallback   # confirms no creds inlined
```

## Cycle 42 staged-diff scan (will run pre-commit in Phase 7)

Phase 7 runs:

```bash
git diff --cached | grep -E "BRIDGE_SERVER_TOKEN=[A-Za-z0-9]|BRIDGE_CLIENT_SECRET=[A-Za-z0-9]|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN=[A-Za-z0-9]|GOOGLE_API_KEY=[A-Za-z0-9]|GEMINI_API_KEY=[A-Za-z0-9]|OPENAI_API_KEY=[A-Za-z0-9]|Bearer [A-Za-z0-9._-]+|access_token=[A-Za-z0-9._-]+|refresh_token=[A-Za-z0-9._-]+" && echo "SECRET_SHAPED_MATCH_IN_STAGED_PATCH" || echo "clean"
```

Cycle 42's actual code-side staged diff is exactly two surfaces — `src/components/HeroSearch.tsx` (helper paragraph + header comment) and `scripts/audit-home-hero-copy.ts` (new audit) plus `package.json` (one script entry). None of those files contain secret-shaped strings. The staged-diff scan is expected to print `clean`.

## Cycle 42 environment hygiene

```yaml
env_files_touched:                       none
tokens_printed_to_terminal:              false
tokens_committed:                        false
tokens_screenshotted:                    false
.env_committed:                          false
dokploy_credentials_touched:             false
bridge_credentials_rotated:              false
google_ads_credentials_touched:          false
ghl_credentials_touched:                 false
```

## Verdict

Cycle 42's staged surface introduces no new secret-shaped strings. Pre-existing public-URL constants remain in source under their established classification. Safe to proceed to commit and staging deploy.
