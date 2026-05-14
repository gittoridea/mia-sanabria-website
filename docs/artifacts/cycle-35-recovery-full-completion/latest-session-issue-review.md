# Cycle 35 — Latest-Session (Cycle 34) Issue Review

**Phase 1 deliverable.** Reads `docs/artifacts/cycle-34-world-class-completion/*` and the
operator session report at `/home/torrey/trueops/session-launcher/reports/MIA_SESSION_REPORT.md`.

## What failed in the latest session

| Failure | Root cause | Owner |
|---|---|---|
| Staging deploy aborted | `audit:brand` rejected 3 amber tokens in Bridge demo UI (pre-existing Cycle 33/33B) | AI — fixable this cycle |
| Image generation deferred | One-sample checkpoint gate not authorized in Cycle 34's 30-min E4 budget | Mostly informational — placeholders already in repo |
| Cycle 34 declared itself a "foundation cycle" | E4 budget + brief boundary | Drove the brief's "Hard anti-foundation rule" for Cycle 35 |

## What was already committed and pushed

- `a88cdfb` — feat(MIA-SITE-CYCLE-34): world-class site completion — hero polish + audit foundation.
- `0a00206` — docs(MIA-SITE-CYCLE-34): record staging-deploy-report.

Both are on `origin/main`. Working tree is clean (only auto-generated audit reports
dirty, classified by Phase 0).

## What was not deployed

The hero polish (eyebrow "South Florida Lifestyle", CTAs "Search available homes" /
"Talk with Mia") on `/` and `/home-search/` is in `origin/main` (`a88cdfb`) but has
not reached staging. The current staging build still shows the pre-Cycle-34 hero.

The needle `South Florida Lifestyle` will be the deploy-flip signal in Phase 6.

## Tools discovered vs. actually working

| Discovery (Cycle 34) | Actually verified Cycle 35 |
|---|---|
| `playwright 1.58.0` present | ✓ proven by Phase 2 PNG capture |
| Chromium headless-shell `1208` installed | ✓ used by Playwright proof |
| `gemini 0.41.2` present, `GOOGLE_API_KEY` + `GEMINI_API_KEY` present | ✓ version probe; full image-gen deferred to Phase 11 checkpoint |
| `codex` on PATH | informational, not used this cycle |
| `interceptor` on PATH | ✗ classified unavailable (no browser extension in headless Linux) |
| `OPENAI_API_KEY` | ✗ missing — not on critical path |
| Dokploy creds | ✓ `DOKPLOY_API_URL` + `DOKPLOY_API_TOKEN` present |

## What work was deferred

From `remaining-blockers.md`:

### External — not AI-closeable this cycle

- Mia: review packet return, designation attestation, languages, years-licensed, display office.
- Mia: licensed photography for the 7 Broward cities.
- Torrey: hero-image provenance decision, AI-gen checkpoint authorization, API-key refresh, DNS cutover, Bridge support ticket.
- Counsel: DMCA USCO certificate, legal-page pre-cutover review.
- Bridge / GHL / Google: real SEF MLS feed, GHL endpoints, GA4/Search Console/GBP/sitemap.
- Hosting / DNS: production cutover.

### AI-closeable — Cycle 35 will close

1. **`audit:brand` recovery fix** — narrow semantic exception for Bridge demo warning tokens. Phase 4.
2. **Recovery staging deploy** — push the existing `a88cdfb` hero polish live. Phase 6.
3. **Staging verification with real screenshots** — Playwright, mobile readability against `https://miasanabriarealtor.trueidea.com`. Phase 7.
4. **Neighborhoods implementation audit** — score every approved + reference route against the full schema. Phase 8.
5. **Typed Neighborhood model verification** — prove existing `Market` type meets the brief's `NeighborhoodRequiredShape` (avoid parallel drift confirmed by Cycle 34 Lane 2). Phase 9.
6. **Neighborhood content polish** — fill any thin spots on the 7 placeholder pages while respecting source-ledger discipline. Phase 10.
7. **Image classification + manifest** — assess every neighborhood hero, classify per brief taxonomy. One-sample generation only if absolutely required and safe. Phase 11.
8. **Hub + detail polish** — minor visual rhythm fixes, schema completeness check. Phase 12.
9. **Site-wide consistency** — sweep every public route for AI-closeable issues. Phase 13.
10. **Local + staging visual QA** — Playwright, 375×812 + 1280×800. Phases 14, 17.
11. **Final commit + staging deploy** — single second commit, deploy. Phase 16-17.
12. **Closeout artifacts** — claim-vs-reality, blockers, rollback, continuation. Phase 18-20.

## What was wrong/incomplete in Cycle 34

- **Foundation framing too cautious.** The brief Phase 17 in Cycle 34 documented the brand-audit failure honestly but didn't attempt to fix it. The fix is narrow and AI-closeable (this Cycle 35 Phase 4 proves it).
- **Tool capability discovery was not paired with tool capability proof.** Cycle 34 found Playwright + chromium installed and Gemini CLI present, but never ran an actual screenshot or generation probe. Cycle 35 Phase 2 closes that.
- **Visual QA captures were local-only.** With the deploy blocked, no staging captures were taken. Cycle 35 will produce both local + staging visual QA after the recovery deploy lands.

## Honesty about the Cycle 34 framing

Cycle 34's `claim-vs-reality.md` was itself honest about its foundation framing. Cycle 35
inherits an essentially clean repo plus one narrow blocker — the bar is exactly what the
brief sets: fix the blocker, deploy, then complete what was deferred.
