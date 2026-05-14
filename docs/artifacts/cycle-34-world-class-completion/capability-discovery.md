# Cycle 34 — Capability Discovery

> Phase 2 deliverable. Documents tooling actually available in this session for visual QA, image generation, and credential presence. No values printed. Read-only checks only.

## Verdict summary

| Class | Status | Tool | Notes |
|---|---|---|---|
| Browser / visual QA | **PRESENT** | Playwright 1.58.0 | `/home/torrey/.local/bin/playwright` — usable headless or headed |
| Image generation (LLM CLI) | **PRESENT** | Gemini CLI (`/snap/bin/gemini`) + Codex CLI (`/home/torrey/.local/bin/codex`) | Both available |
| Image generation (SDK) | absent | — | No `@google/generative-ai` or `openai` package in `node_modules` |
| `GOOGLE_API_KEY` | present | — | Available in shell env (value NOT printed) |
| `GEMINI_API_KEY` | present | — | Available in shell env |
| `VERTEX_AI_PROJECT` | missing | — | — |
| `OPENAI_API_KEY` | missing | — | — |
| `ANTHROPIC_API_KEY` | missing | — | — |
| `DOKPLOY_API_TOKEN` | present | — | Deploy substrate token (do not print, do not commit) |
| `BRIDGE_BROWSER_TOKEN` / `BRIDGE_CLIENT_ID` / `BRIDGE_DATASET_ID` | missing in shell | — | Expected — Bridge tokens live in Dokploy build args, not shell exports |
| PAI subagents reachable | yes | — | `Forge`, `Engineer`, `Cato`, `Explore`, `Plan`, `Designer` etc. visible to top-level Agent tool |

## Browser / visual QA

`playwright --version` → `Version 1.58.0`. Binary at `/home/torrey/.local/bin/playwright`. Repo does not currently declare playwright in `package.json` as a dev dep — it is installed globally for user `torrey`. Headless Chromium and headed mode both usable. Read-only browser sessions only this cycle (no logins, no form submissions on live staging).

## Image generation

Gemini CLI (`/snap/bin/gemini`) and `GEMINI_API_KEY` both present. **Generation would consume API credits.** No `openai` Node SDK installed; OpenAI key absent regardless. Local Stable Diffusion / ComfyUI absent. Per the brief's gate, image generation is allowed only after a one-sample checkpoint. **This cycle defers full neighborhood image generation** because:

1. The brief instructs not to install both a browser-QA tool and an image-gen client in the same session — Playwright is already present, so generation tooling is what would be net-new operationally, even though the credentials exist.
2. Provenance discipline (no real people, no identifiable residences, accurate establishing shots only) requires operator review before batch generation.
3. The current miasanabria.com hero background (Phase 4 finding) is hosted on a third-party platform (`vibe.filesafe.space`) and is not safely reusable — that decision alone changes the image policy default for this cycle.

**Operator-gated:** if Torrey approves a one-sample run next cycle, the Gemini CLI is ready. Prompts and slot-by-slot briefs are produced in `neighborhood-image-generation-briefs.md`.

## Credential presence (names only)

Output of `node -e 'for (const k of [...]) console.log(k, process.env[k] ? "present" : "missing")'`:

```
GOOGLE_API_KEY      present
GEMINI_API_KEY      present
VERTEX_AI_PROJECT   missing
OPENAI_API_KEY      missing
ANTHROPIC_API_KEY   missing
DOKPLOY_API_TOKEN   present
BRIDGE_BROWSER_TOKEN missing
BRIDGE_DATASET_ID   missing
BRIDGE_CLIENT_ID    missing
```

Bridge `missing` in shell is the correct, expected state — Bridge tokens are baked at Docker build time via Dockerfile `ARG` and consumed at runtime through Next.js' `NEXT_PUBLIC_*` build-time inlining. They are not, and should not be, available in the developer shell.

## What this cycle uses

- **Playwright** for Phase 15 visual QA (route renders, mobile + desktop viewports, screenshot capture under `docs/artifacts/cycle-34-world-class-completion/visual-qa/`).
- **Bash + curl + grep** for Phase 4 hero audit and Phase 14 compliance scan.
- **Bun audit scripts** (already in `package.json`) for Phase 16 validation gates.
- **No image generation** this cycle. Prompts and briefs only.

## What this cycle does not use

- No Gemini API calls (gated on operator approval + one-sample checkpoint per brief).
- No Dokploy deploy unless Phase 16 gates all pass.
- No Bridge token reads, rotations, or writes.
- No `.env` reads.
- No `cat .env` or `printenv`.

## Install gate decision

No installs required. Playwright + Gemini CLI both already present. Per the brief's "do not install both in the same session unless one is already present" rule, no action.

---

Generated 2026-05-14 by Cycle 34 Phase 2.
