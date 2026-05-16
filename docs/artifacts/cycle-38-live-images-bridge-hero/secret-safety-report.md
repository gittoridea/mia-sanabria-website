# Cycle 38 — Secret Safety Report

date: 2026-05-16

## Scanned

- Local env (presence only, never values): `BRIDGE_SERVER_TOKEN`, `BRIDGE_CLIENT_SECRET`, `BRIDGE_CLIENT_ID`, `BRIDGE_DATASET_ID`, `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN`, `BRIDGE_BROWSER_TOKEN`, `NEXT_PUBLIC_BRIDGE_DATASET_ID`, `NEXT_PUBLIC_BRIDGE_DEMO`, `NEXT_PUBLIC_BRIDGE_RESOURCE_PATH`, `GEMINI_API_KEY`, `GOOGLE_API_KEY`, `DOKPLOY_API_URL`, `DOKPLOY_API_TOKEN`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`.
- Source tree (`git grep -E …` over the repo, excluding `node_modules`, `.next`, `out`, lockfiles).
- Built output (`out/`, `.next/`).
- Staged patch (before each commit).

## Result

- Local env: `GEMINI_API_KEY present`, `GOOGLE_API_KEY present`, `DOKPLOY_API_URL present`, `DOKPLOY_API_TOKEN present`. All Bridge tokens are missing locally (live only in the Dokploy environment). `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` missing.
- Source-tree scan for literal-shape token assignments (`<TOKEN_NAME>=['"][A-Za-z0-9_+/.-]{16,}['"]`): **zero hits**.
- Built-output scan for `Bearer …`, `access_token=…`, `refresh_token=…` shapes: **zero hits**.
- Staged-patch scan: scheduled to run before commit. (See `commit-report.md`.)

## What was not done

- No `cat .env`, no `cat ~/.claude/.env`, no `printenv`, no `env` invocations.
- No raw chunk files under `docs/artifacts/**/staging-html/*chunk*.js` or `…/*page-*.js` were generated this cycle. The only chunks present are leftovers from Cycle 37, already excluded by `.gitignore` patterns.
- No Bridge token values were rotated.
- No Dokploy build args were viewed or printed. Phase 6 will probe staging behavior post-deploy without exposing the values.

## Generator scripts and env reads

- `scripts/generate-neighborhood-images-v2.ts` reads `GEMINI_API_KEY ?? GOOGLE_API_KEY` and uses it only in the URL query for the Gemini generateContent endpoint; the key never leaves the process. It is not written to logs, artifacts, commits, or stdout.
- `scripts/deploy-and-verify.ts` (existing) reads `DOKPLOY_API_URL` and `DOKPLOY_API_TOKEN` from `~/.claude/.env`; redaction is the script's responsibility — Cycle 38 did not modify it.

## Pre-commit staged-patch hygiene

The commit step (Phase 10) runs an additional staged-patch grep before push:

```
git diff --cached | grep -E "BRIDGE_SERVER_TOKEN=[A-Za-z0-9]|BRIDGE_CLIENT_SECRET=[A-Za-z0-9]|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN=[A-Za-z0-9]|GOOGLE_API_KEY=[A-Za-z0-9]|GEMINI_API_KEY=[A-Za-z0-9]|OPENAI_API_KEY=[A-Za-z0-9]|Bearer [A-Za-z0-9._-]+|access_token=[A-Za-z0-9._-]+|refresh_token=[A-Za-z0-9._-]+"
```

This must echo `staged patch secret check clean` before commit proceeds.
