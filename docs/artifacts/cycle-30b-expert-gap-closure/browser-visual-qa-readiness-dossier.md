# Lane L — Browser Use / Visual QA Readiness Dossier

**Author lens:** Browser Use / Visual QA Advisor
**Scope:** decide whether Browser Use is worth installing later. No installation this cycle. No authenticated browser writes. No form submissions. Existing Playwright via `audit:mobile-readability` + `audit:rendered-visual` is the read-only baseline.
**Inputs reviewed:** `scripts/audit-mobile-readability.ts`, `scripts/audit-rendered-visual.ts`, `docs/artifacts/cycle-19A-M/mobile-readability/`, `docs/artifacts/cycle-22-r1-*/`, project CLAUDE.md "use Interceptor skill for verification; never agent-browser" rule.

## Current visual QA coverage

| Tool | Coverage | Captures? | Used in Cycle 30 / 30B |
|---|---|---|---|
| `bun run audit:mobile-readability` (Playwright) | 4 device profiles × default route list (now 21 routes after Cycle 30B Lane B extension) = 84 device-route combos | optional via `--capture` flag | yes — 56/56 PASS against live in Cycle 30 (pre-extension); will rerun post-extension in Phase 7 |
| `bun run audit:mobile-readability:capture` (Playwright + screenshot) | same routes, writes screenshots to `docs/artifacts/cycle-<id>/mobile-readability/after/` | yes | last captured Cycle 22 R1; Cycle 30 deferred re-capture |
| `bun run audit:rendered` (Playwright DOM dump + visual check) | rendered-DOM check, no real screenshot | no | Cycle 28 + Cycle 29 §14.4 |
| `bun run audit:hero-contrast` (Playwright pixel sampling) | hero region pixel-contrast check at 4 viewport sizes | partial (pixel samples, not full screenshots) | recurring |
| `bun run audit:rendered-visual` (full Playwright with viewport sims) | rendered+visual sweep | partial captures of failure cases | recurring |
| `curl` + Python regex | nav/copy verification on live HTML | no | this cycle (Cycle 30 Phase 2 + Cycle 30B Phase 0) |
| **Browser Use** | n/a | n/a | **NOT INSTALLED** |

## Existing screenshots inventory

| Cycle | Path | Purpose |
|---|---|---|
| 19A-M | `docs/artifacts/cycle-19A-M/mobile-readability/{before,after}/` | mobile readability baseline at 320/375/414/768 |
| 19c-copy | `docs/artifacts/cycle-19c-copy/` (relevant subdirs) | post-copy edits |
| 22-r1 | `docs/artifacts/cycle-22-r1-mia-decision-implementation/` | post-Mia-decision implementation visual |
| 23-claude-lane | `docs/artifacts/cycle-23-claude-lane/mobile-readability/` | post-WCAG + GA4-honesty audit |
| 25-26-27-28-29-30 | not screenshot-heavy (audit-only cycles) | n/a |

**Conclusion:** existing screenshots are Cycle 22 R1 era. Pre-launch visual sign-off (G7/G8) should re-capture against the post-Mia-decisions build (Cycle 31 or 32).

## When Browser Use adds value

| Use case | Existing Playwright works? | Browser Use better? |
|---|---|---|
| Read-only per-route screenshot deck for Mia review companion | **yes** — `audit:mobile-readability:capture` writes 56+ device-route screenshots in one command | only marginally — Browser Use would add "real browser fingerprint" but mobile review doesn't need that |
| Bot-detected staging site visual verification | n/a — staging has no bot detection | no |
| Authenticated session walks (e.g., logged-in GHL preview) | n/a — Mia site has no login | no |
| Multi-step form flows (e.g., "fill out form, see thank-you page") | **NO** — `audit:mobile-readability` is single-page | **yes** — multi-step recorded flows are Browser Use's wheelhouse |
| Live form submission validation against GHL | n/a — out of mission scope (no live form submits) | no |
| Visual regression on actively-rendered editor surfaces (Google Docs, Slides) | n/a | n/a |
| Recording a click-through video for Mia to watch | **NO** — Playwright video record exists but ergonomics worse | **yes** — Browser Use exports replayable plans |
| Cross-browser pixel diff (Chrome / Firefox / Safari) | partial — Playwright supports `chromium`, `firefox`, `webkit`; current scripts use chromium only | similar — Browser Use defaults to one engine |
| Pre-cutover dry-run via `/etc/hosts` override | **NO** — Playwright doesn't natively use system hosts file unless launched specifically | **partial** — Browser Use uses the real Chrome, so respects `/etc/hosts` |

**Verdict:** Browser Use's incremental value for the Mia site is **low for review** and **moderate for pre-cutover dry-run**. The recommended trigger to install:

- Mia requests a video walkthrough → install Browser Use, record, send.
- Cycle 36 pre-cutover dry-run wants real-browser-via-`/etc/hosts` validation → install Browser Use, run dry-run.
- Cycle 32 (GHL Forms) wants end-to-end form-submit verification against GHL test workflow → install Browser Use, run authenticated walk.

## Install prerequisites (when triggered)

Per the global PAI ecosystem, Browser Use is a separate skill that needs:

1. Browser Use Python package: `pip install browser-use` in a project-managed venv (NOT global).
2. Playwright browsers: `playwright install chromium` (or whichever engine).
3. ChromeDriver / Chrome installed at OS level (Chromium via Playwright bundles is the safer path).
4. Skill registration in `~/.claude/PAI/skills/BrowserUse/` per the PAI skill spec.
5. Confirmation that Browser Use does not autostart anything that touches `.env` or chats outbound on default install.

**Cycle 30B does not install.** Cycle 30A is the install + read-only QA mission.

## No-write safety policy (mandatory for any future Browser Use session)

- No form submissions on live staging or production (forms only exist on staging until Cycle 32 wires GHL).
- No clicks that fire payment / signup / outbound contact flows on third-party services.
- No paste of credentials.
- No upload of files containing secrets.
- All sessions logged via Browser Use's built-in monitor system; logs saved to `docs/artifacts/cycle-<id>/browser-use-logs/` (sanitized of any credential material — Browser Use itself supports this).
- Default to **incognito** unless authenticated session is the explicit goal.
- Cookies cleared between sessions unless persistence is the explicit goal.

## Comparison with project CLAUDE.md "Interceptor" rule

Project CLAUDE.md (and the global PAI doctrine) calls out **Interceptor** as the mandatory tool for all visual verification on the global PAI stack. Interceptor and Browser Use differ:

| Aspect | Interceptor | Browser Use |
|---|---|---|
| Architecture | Chrome extension running inside the user's real browser | Headless or non-headless Playwright wrapper, separate process |
| Bot detection | passes (real browser fingerprint) | passes if used in non-headless mode |
| Authenticated sessions | uses user's logged-in state | needs separate auth or session persistence |
| Recording / replay | built-in monitor + replay | replayable plans |
| Suitable for live deploy verification | yes (mandatory per CLAUDE.md) | yes |

For this project specifically, the mission rule was "use Interceptor for visual verification; never agent-browser." Browser Use is a third option — sits between `agent-browser` (forbidden) and Interceptor (mandatory). Cycle 30A install evaluates Browser Use against Interceptor for the Mia-review walkthrough use case.

## Future paste-ready Browser Use install + read-only QA prompt

See `future-prompt-bank.md` → "Cycle 30A — Browser Use Skill Install + Read-Only Staging QA."

## DoD for Cycle 30A (when it fires)

- [ ] Browser Use installed in project-managed venv (no global install)
- [ ] Skill registered at `~/.claude/PAI/skills/BrowserUse/`
- [ ] Run **read-only** sweep of all 16 reviewed routes (homepage + markets hub + 9 neighborhoods + buyers + sellers + insights + about + contact) at iPhone-15 + iPad portrait + 1440p desktop = 48 captures
- [ ] Captures saved under `docs/artifacts/cycle-30A-*/captures/`
- [ ] No form submission
- [ ] No cookie persisted
- [ ] No outbound to non-`*.trueidea.com` host
- [ ] Optional: recorded click-through video of homepage → markets hub → neighborhood → buyers CTA → mailto fallback, for Mia walkthrough
- [ ] Capture deck attached to Mia review-packet send (optional addendum)
