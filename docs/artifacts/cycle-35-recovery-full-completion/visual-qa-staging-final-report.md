# Visual QA — Staging Final Report — Cycle 35C

> Captures Phase 8 staging verification: HTTP probes, HTML grep, mobile-readability, screenshots,
> live secret scan. Initial scaffold landed in the Phase N commit; populated values land in the
> Phase 8 follow-up docs commit.

## Probe set

| URL | HTTP | Needle(s) checked |
|---|---|---|
| `/` | _populated_ | `South Florida Lifestyle`, `Mia Sanabria`, `LPT Realty`, `Neighborhoods` |
| `/home-search/` | _populated_ | `Search available homes`, `Home Search`, `Demo data`, `Southeast Florida MLS feed pending` |
| `/markets/` | _populated_ | `Mia Sanabria`, `LPT Realty` |
| `/markets/fort-lauderdale/` | _populated_ | hero, FAQ, schema |
| `/markets/pompano-beach/` | _populated_ |  |
| `/markets/deerfield-beach/` | _populated_ |  |
| `/markets/coral-springs/` | _populated_ |  |
| `/markets/plantation/` | _populated_ |  |
| `/markets/weston/` | _populated_ |  |
| `/markets/hollywood/` | _populated_ |  |
| `/markets/davie/` | _populated_ |  |
| `/markets/sunrise/` | _populated_ |  |
| `/markets/boca-raton/` | _populated_ |  |
| `/markets/delray-beach/` | _populated_ |  |
| `/buyers/` | _populated_ |  |
| `/sellers/` | _populated_ |  |
| `/about/` | _populated_ |  |
| `/contact/` | _populated_ |  |
| `/insights/` | _populated_ |  |
| `/privacy/` | _populated_ |  |
| `/terms/` | _populated_ |  |
| `/accessibility/` | _populated_ |  |
| `/dmca/` | _populated_ |  |

## Mobile readability against staging

- `bun run audit:mobile-readability --base=https://miasanabriarealtor.trueidea.com` — _populated_

## Screenshot capture

- Tool: `bun run scripts/capture-baseline.ts`
- Output: `docs/artifacts/cycle-35-recovery-full-completion/visual-qa/staging-final/`
- Viewports: `375x812`, `1280x800`
- Expected: 72/72 OK (36 routes × 2)
- Actual: _populated_

## Live secret scan

- Source: `docs/artifacts/cycle-35-recovery-full-completion/staging-final-html/`
- Patterns: `BRIDGE_SERVER_TOKEN | BRIDGE_CLIENT_SECRET | GOOGLE_API_KEY | GEMINI_API_KEY | OPENAI_API_KEY | access_token= | refresh_token= | Bearer [A-Za-z0-9._-]+ | DOKPLOY_API_TOKEN`
- Result: _populated_

## Honesty checks

| Check | Expected | Actual |
|---|---|---|
| Bridge demo banner visible on `/home-search/` | yes | _populated_ |
| LPT Realty attribution preserved everywhere | yes | _populated_ |
| IDX/MLS disclosure preserved where IDX renders | yes | _populated_ |
| No off-topic / placeholder copy | yes | _populated_ |
| No off-brand colors outside the demo-warning surface | yes | _populated_ |

## Issues requiring code changes

- _populated or `none`_
