# Cycle 34 — Visual QA Tool Install

> Phase 3 deliverable. Documents the single capability install performed this session, per the brief's install gate.

## What was installed

**Playwright Chromium headless-shell browser binary** (~110 MB).

```
Chrome Headless Shell 145.0.7632.6 (playwright chromium-headless-shell v1208)
→ /home/torrey/.cache/ms-playwright/chromium_headless_shell-1208/
```

Plus the smaller FFmpeg binary (2.3 MB, used by Playwright for video recording — not used this cycle but pulled as a default dependency).

## Why

- Playwright **CLI** was already present at `/home/torrey/.local/bin/playwright` (version 1.58.0).
- The CLI's `screenshot` subcommand requires the headless-shell browser binary, which had not yet been downloaded into this user's Playwright cache.
- Per the brief: "install at most one primary capability unless one class is already present" — the Playwright class was already present; only the browser binary was missing. Installing the binary is the supported remediation: `playwright install chromium-headless-shell`.
- No npm/bun package was added to the repo. No `package.json` modification. The browser binary lives in the user's `~/.cache/ms-playwright/` and is reusable across projects.

## What was not installed

- No image-generation client (Gemini CLI was already present at `/snap/bin/gemini`; no additional install).
- No new npm packages in the repo.
- No system-level package via apt/snap.

## Verification

```bash
playwright screenshot --browser=chromium --viewport-size="375,812" \
  "http://127.0.0.1:4188/" docs/artifacts/cycle-34-world-class-completion/visual-qa/home__mobile-375.png
# → ok 126 673 bytes
```

20 screenshots captured this cycle (10 routes × 2 viewports). All exited 0.

## How to use this binary in future cycles

Direct CLI:

```bash
playwright screenshot --browser=chromium --viewport-size="375,812" --wait-for-timeout=800 <URL> <file.png>
```

Or via the project's existing `audit:mobile-readability` / `audit:rendered` scripts which use a different (Bun-driven) Playwright import path.

## Rollback

If the Chromium headless-shell binary needs to be removed:

```bash
playwright uninstall
# or selectively:
rm -rf /home/torrey/.cache/ms-playwright/chromium_headless_shell-1208
```

No repo state to revert.
