# Cycle 35 — Phase 2 Tool Operational Proof

**Not just discovery — actual probe results.**

## Discovery summary

| Tool | Found at | Version | Operational? |
|---|---|---|---|
| Playwright | `/home/torrey/.local/bin/playwright` | `1.58.0` | ✓ proven (PNG captured) |
| Chromium (headless-shell) | `~/.cache/ms-playwright/chromium_headless_shell-1208` | bundled | ✓ used by proof |
| Interceptor | `/home/torrey/.local/bin/interceptor` | n/a | ✗ unavailable in this environment |
| Gemini CLI | `/snap/bin/gemini` | `0.41.2` | partial (CLI present, API keys present, generation deferred to Phase 11 checkpoint) |
| Codex | `/home/torrey/.local/bin/codex` | n/a | not exercised this cycle |
| OpenAI CLI | not on PATH | n/a | n/a |
| Node | `/home/torrey/.local/bin/node` | `v22.22.2` | ✓ |
| Bun | `/home/torrey/.local/bin/bun` | `1.3.13` | ✓ |

## API credential presence (no values printed)

```
GOOGLE_API_KEY     present
GEMINI_API_KEY     present
OPENAI_API_KEY     missing
ANTHROPIC_API_KEY  missing
DOKPLOY_API_URL    present
DOKPLOY_API_TOKEN  present
```

## Playwright proof — real screenshot captured

A minimal HTML doc was served on `127.0.0.1:4199`. Playwright launched chromium and
captured a 375×812 mobile screenshot. The file was confirmed on disk:

```
mkdir -p /tmp/mia-cycle35-tool-proof
printf '...' > /tmp/mia-cycle35-tool-proof/index.html
python3 -m http.server 4199 --bind 127.0.0.1 &
playwright screenshot --browser=chromium --viewport-size="375,812" \
  --wait-for-timeout=300 \
  "http://127.0.0.1:4199/" /tmp/mia-cycle35-tool-proof/proof.png
```

Output:

```
Navigating to http://127.0.0.1:4199/
Waiting for timeout 300...
Capturing screenshot into /tmp/mia-cycle35-tool-proof/proof.png
-rw-rw-r-- 1 torrey torrey 15K May 14 12:27 /tmp/mia-cycle35-tool-proof/proof.png
```

Screenshot archived alongside this report at `playwright-proof.png` (15K PNG, matches
the size reported by `ls -lh`). **Playwright is operational.** Cycle 35 visual QA
in Phases 7, 14, 17 will use Playwright as the screenshot capture engine.

## Interceptor — classified unavailable

```
$ interceptor status
mode: browser-only
daemon: not running
socket: not found
transport: unknown
```

Interceptor requires a Chrome/Brave session running the Interceptor extension. This
session is a headless Linux automation context with no live browser. Brief Phase 2
explicitly permits this classification:

> "If Interceptor fails because of Linux/macOS framework issues, classify it as
> unavailable on this environment and do not spend time fixing it. Use Playwright."

**Decision: Playwright is the visual-QA engine for this cycle. Interceptor is not used.**

## Gemini CLI — capability probe only

`gemini --version` returned `0.41.2`. Both `GOOGLE_API_KEY` and `GEMINI_API_KEY` are
present in the environment. Image generation is deliberately deferred to the **Phase 11
one-sample checkpoint**, where a single AI-generated image will be evaluated before any
batch run. Per brief: "Do not generate images before Phase 11 one-sample checkpoint."

A capability probe (`gemini --help`) is not exercised here because Phase 11 may
ultimately not require generation at all (see image inventory in Phase 11 plan — all
23 market hero JPGs already exist in `public/markets/`).

## What this cycle will use

- **Playwright** — local + staging screenshots, mobile readability staging probes.
- **Bun + Node** — all scripts, audits, deploy-and-verify.
- **Dokploy API** — staging deploy via `scripts/deploy-and-verify.ts`.
- **Gemini CLI** — only if the Phase 11 checkpoint decides a generation is required.

## What this cycle will NOT use

- **Interceptor** — unavailable in headless Linux automation.
- **OpenAI / Anthropic SDKs** — keys absent; no fallback path required.
- **Rotated Bridge tokens** — explicitly out of scope per mission brief.
