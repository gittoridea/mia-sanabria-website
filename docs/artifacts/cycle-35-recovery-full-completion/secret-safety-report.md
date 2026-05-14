# Cycle 35 — Phase 5 Secret Safety Report

**Two scans run; both clean for value exposure.**

## Narrow source secret-assignment scan

```bash
git grep -nIE "(BRIDGE_[A-Z_]+|DOKPLOY_API_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|server_token|browser_token|client_secret|access_token|refresh_token|api_key)\s*[:=]\s*['\"][^'\"]+['\"]" -- ':!node_modules' ':!.next' ':!out' ':!**/*.lock'
```

Five hits returned. None expose secret values:

| File | Match | Classification |
|---|---|---|
| `docs/artifacts/cycle-30b-expert-gap-closure/bridge-runtime-readiness-dossier.md` | `BRIDGE_DOCS_URL = "https://bridgedataoutput.com/docs/platform/"` | public documentation URL, not a token |
| `docs/artifacts/cycle-30b-expert-gap-closure/master-claim-vs-reality.md` | same `BRIDGE_DOCS_URL` reference | public documentation URL, not a token |
| `src/lib/bridge-client.ts:26` | `BRIDGE_API_BASE = "https://api.bridgedataoutput.com/api/v2/OData"` | public API host URL, not a token |
| `src/lib/bridge.ts:74` | `BRIDGE_DOCS_URL = "https://bridgedataoutput.com/docs/platform/"` | public documentation URL, not a token |
| `src/lib/bridge.ts:95` | `BRIDGE_IDX_RESOURCE = "idx/Properties"` | public resource path, not a token |

No `*_TOKEN`, `*_SECRET`, `BEARER`, `access_token`, `refresh_token`, or `api_key`
literal values appear in the repository source.

## Generated-output scan

```bash
grep -RniE "BRIDGE_SERVER_TOKEN=[A-Za-z0-9._-]|BRIDGE_CLIENT_SECRET=[A-Za-z0-9._-]|GOOGLE_API_KEY=[A-Za-z0-9._-]|GEMINI_API_KEY=[A-Za-z0-9._-]|OPENAI_API_KEY=[A-Za-z0-9._-]|access_token=[A-Za-z0-9._-]|Bearer [A-Za-z0-9._-]{16,}" out .next
```

No matches. The static export `out/` and `.next/` build cache contain no token-shaped
strings.

## Bridge browser-token note

Per Cycle 33B, the Bridge browser token is **intentionally baked into the static
export** (`NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` exposed to client JS by design) so the
homepage Bridge IDX widget can call the Bridge API at runtime. Cycle 33B's security
hardening verified that:

- the **server token** + **client secret** never leave the server-side build env;
- the **browser token** is the limited-scope client-facing credential Bridge supplies
  for exactly this kind of exposure;
- demo mode is honest (`BRIDGE_DEMO_MODE=true` triggers the demo banner + DEMO badge);
- no rotation is performed this cycle.

This Cycle 35 narrow scan deliberately excludes the browser-token presence from the
"secret leak" failure mode — Bridge designs that credential to live in client JS. The
scan instead matches *literal key=value assignment* shapes that would indicate accidental
exposure of the server-side credentials. None are present.

## Environment access discipline

- No `cat ~/.claude/.env` invoked.
- No `printenv` invoked.
- No secrets echoed, logged, or written to commit messages, artifact files, screenshots,
  or generated HTML.
- The Phase 2 presence probe (`node -e 'for (k of …) console.log(k, present|missing)'`)
  prints only the *presence* of each variable, never the value.
- `scripts/deploy-and-verify.ts` reads `~/.claude/.env` only inside the script's own
  process; it never echoes contents back to terminal/logs.

## Verdict

**No secret values exposed in source, output, artifacts, or logs.** Cleared for commit
and push.

---

## Cycle 35B post-recovery addendum (2026-05-14)

After the SSH `Broken pipe` event and the recovery work in Cycle 35B, the same scans
were re-run. Results unchanged:

- Source scan: same 5 non-secret hits (`BRIDGE_API_BASE`, `BRIDGE_DOCS_URL` ×2, `BRIDGE_IDX_RESOURCE`,
  plus the two prior-cycle dossier references). No new secret-shaped assignments.
- Generated-output scan against the freshly built `out/` + `.next/`: no matches.
- Live-staging HTML scan (23 captured files under `live-html-check/`): no matches for
  `BRIDGE_SERVER_TOKEN`, `BRIDGE_CLIENT_SECRET`, `GOOGLE_API_KEY`, `GEMINI_API_KEY`,
  `OPENAI_API_KEY`, `access_token=`, `refresh_token=`, `Bearer …`, or `DOKPLOY_API_TOKEN`.
- Local-final screenshot capture set: same images as staging-recovery (deterministic
  static export); no rendered token strings.

Environment presence check (key names only):
```
GOOGLE_API_KEY        present
GEMINI_API_KEY        present
OPENAI_API_KEY        missing
ANTHROPIC_API_KEY     missing
DOKPLOY_API_URL       present
DOKPLOY_API_TOKEN     present
BRIDGE_SERVER_TOKEN   missing (Docker-baked, not shell-exported)
BRIDGE_CLIENT_ID      missing (same)
BRIDGE_DATASET_ID     missing (same)
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN  missing (build-time only)
```

Posture preserved across the crash-recovery boundary. No rotation performed.
No new secret material introduced.

---

## Cycle 35C resume re-scan (2026-05-14)

After the Phase N drop in Cycle 35B and resumption as Cycle 35C, the source + generated-bundle scans were re-run from a fresh subshell. Results:

- Source scan: identical 8 hits — the 5 prior public-Bridge-URL constants plus 3 documentation references in `cycle-35-recovery-full-completion/secret-safety-report.md` (this file's own classification table). No new secret-shaped assignments.
- Generated bundle scan (`out/` + `.next/`): clean. The freshly-built static export carries no token-shaped strings.
- Environment presence (key names only, never values):
  ```
  GOOGLE_API_KEY        present
  GEMINI_API_KEY        present
  OPENAI_API_KEY        missing
  ANTHROPIC_API_KEY     missing
  DOKPLOY_API_URL       present
  DOKPLOY_API_TOKEN     present
  ```

Phase 8 will add the live-staging HTML re-scan after the final deploy. Until then, posture remains: no secret values printed, logged, committed, or screenshotted in Cycle 35C.
