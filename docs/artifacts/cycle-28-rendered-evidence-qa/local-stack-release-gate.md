# Cycle 28 — Local-stack release-candidate gap gate

**Generated:** 2026-05-13T20:40:00Z
**Branch:** `main` @ `a7a7933` (Cycle 28's commit will increment this to `+7` if files change)
**Remote:** `origin/main` @ `967aac5`
**State:** **6 commits ahead, 0 behind, tree clean** at this snapshot. **Not pushed. Do not push without principal decision.**

## Commits since origin/main

| Hash | Cycle | Type | Title |
|---|---|---|---|
| `55600a8` | C23 | feat | GA4 honesty + WCAG a11y + overclaim catalog + --wait-for-needle |
| `ab4ec08` | LIVE-DECISIONS | feat | apply Mia canonical domain/nav/hero/neighborhood scaffolds |
| `706773a` | C24-R2 | fix | finish hero search neighborhoods rail and QA recovery |
| `e32310d` | C25 | feat | build approved neighborhood pages and site continuity pass |
| `f4d9a4b` | C26 | fix | add mobile capture paths and readiness evidence audit |
| `a7a7933` | C27 | docs | build evergreen city evidence library and gap map |

111 files changed · 61,497 insertions · 3,370 deletions.

Top-level shape:

| Dir | Count | Class |
|---|---|---|
| `docs/` | 48 | docs / artifacts / decision records — push as historical context |
| `reports/` | 24 | regenerated audit outputs — bloat-prone (see B.1 in C27 gap map) |
| `src/` | 17 | production code — feature build for Mia canonical site |
| `public/` | 14 | hero JPGs + OG cards for the 7 Cycle 25 cities |
| `scripts/` | 5 | audit + deploy tooling updates |
| top-level | 3 | `CLAUDE.md`, `package.json`, `bun.lock` |

## Class 1 — Code/content changes intended for push

Production-side code that should ship together (a launch product, not an internal documentation iteration):

| File | Reason to ship |
|---|---|
| `src/app/page.tsx` | Hero search + neighborhoods rail wired (Cycle 24 R2 carry-forward) |
| `src/app/insights/[slug]/page.tsx`, `src/app/insights/page.tsx` | Insights surface alignment with canonical domain |
| `src/app/valuation/page.tsx` | Valuation page polish |
| `src/components/HeroSearch.tsx` | NEW — homepage hero search (BridgeIDX scaffold; runtime gated to off) |
| `src/components/NeighborhoodsRail.tsx` | NEW — approved-neighborhoods rail |
| `src/components/Hero.tsx`, `src/components/SiteHeader.tsx`, `src/components/SectionHeading.tsx`, `src/components/FeaturedMarketsPager.tsx`, `src/components/IdxEmbed.tsx`, `src/components/insights/InsightCard.tsx`, `src/components/markets/FortLauderdaleV2.tsx` | Cross-component polish for canonical-domain release |
| `src/lib/site.ts` | Canonical `PRODUCTION_URL` + nav + search href (Mia-locked) |
| `src/lib/mia.ts` | Principal identity locks + approved neighborhoods (Cycle 22 R1 + Mia confirmations) |
| `src/lib/markets.ts` | +529 lines — Cycle 25 added the 7 approved-neighborhood market entries; Cycle 28 trims Davie intro |
| `src/lib/bridge.ts` | NEW — scaffold only; `BRIDGE_INTEGRATION_LIVE = false`; no credentials, no live calls |
| `CLAUDE.md` | Project doctrine — cycle closeout rule, cache+verify pattern, audit gates |
| `package.json`, `bun.lock` | Script alias + lock churn from Cycle 23/24/25 |
| `scripts/audit-completeness.ts`, `scripts/audit-mobile-readability.ts`, `scripts/audit-no-fabrications.ts`, `scripts/deploy-and-verify.ts`, `scripts/render-images.ts` | Audit-tool evolution backing the new gates |
| `public/markets/*.jpg` (7) + `public/og-markets/*.jpg` (7) | Brand-tone hero placeholders for the 7 Cycle 25 cities (Mia-approved interim state) |

## Class 2 — Docs/artifacts intended for push

| Path | Reason to ship |
|---|---|
| `docs/mia-client-decision-record.md` | Source of truth for Mia decisions; referenced by `CLAUDE.md` |
| `docs/mia-testimonial-capture-plan.md` | Policy doc for future testimonial capture; no testimonials present |
| `docs/artifacts/cycle-23-claude-lane/**` | Cycle 23 evidence + Lighthouse reports |
| `docs/artifacts/cycle-25-neighborhood-content/**` | Cycle 25 build evidence + agent memos |
| `docs/artifacts/cycle-26-readiness-qa/**` | Cycle 26 readiness audit + mobile capture baseline |
| `docs/artifacts/cycle-27-evergreen-city-evidence/**` | Cycle 27 evergreen library (audited clean by Cycle 28) |
| `docs/artifacts/cycle-28-rendered-evidence-qa/**` | Cycle 28 evidence (this directory) |

## Class 3 — Report churn intended for push (and the risk)

| Path | Note |
|---|---|
| `reports/audit-rendered-visual.json` | **1.4 MB / 50k+ lines per Cycle 26 bloat-review F1**. Currently committed regenerated for every cycle. Cycle 27 gap-map B.1 already flagged this for a tooling cycle. **Recommendation:** ship this commit's regen, but treat repo-emission policy as a real cleanup target in a future cycle. |
| `reports/qa-gate-matrix.{json,md}` | Whole-site verdict matrix — useful for diffability |
| `reports/audit-{about,brand-consistency,completeness,featured-markets,hero-pixel-contrast,images,insights,legal,mobile-readability}.{json,md}` | Per-audit current outputs — fast to regenerate; arguable whether to commit, but they exist in this stack |
| `reports/audit-fort-lauderdale-standard.{json,md}` | Standard-template check for FTL V2 page |

Report churn is real but **does not block push**. The bloat decision in C27 B.1 is a future-cycle housekeeping item, not a launch gate.

## Class 4 — Generated output to keep

- `public/og-markets/*.jpg` — generated by `bun render:og-insights` style tooling; committed because OG cards must be at static URLs.
- `public/markets/*.jpg` — generated brand-tone hero placeholders; will eventually be swapped for licensed photography (D.3 in C27 gap map; Mia-blocked).

## Class 5 — Generated output to AVOID committing

- `out/` — static export. Already in `.gitignore`; verify on every commit.
- `node_modules/` — already gitignored.
- `dev-server.log` and `post-edits-smoke.txt` inside Cycle 23 artifacts — these are committed deliberately as Cycle-23 evidence, not as ongoing dev logs.
- `~/.claude/.env` — never committed, never written to repo, never echoed.

## Risks before push

| Risk | Class | Mitigation in this stack |
|---|---|---|
| Davie 1280×800 rendered fail (was Cycle 27 deterministic FAIL) | code/content | **Closed this cycle** (`src/lib/markets.ts` Davie intro). `audit:rendered` 14 PASS / 1 WARN / 0 FAIL. |
| Repo size growth from `audit-rendered-visual.json` regen | tooling | Cycle 27 B.1 already flagged. Not a launch blocker. |
| Bridge scaffold (`src/lib/bridge.ts`) accidentally going "live" | code | `BRIDGE_INTEGRATION_LIVE = false`; no credentials in repo; `audit:no-fabrications` covers the fabricated-claim surface. |
| Contact form mailto-only | code | `audit:no-fabrications` allows mailto fallback; F.1 in C27 gap map. |
| Forge / GHL endpoints | none in stack | No endpoint URLs in repo. `audit:no-fabrications` enforces. |
| Secret leakage | none expected | `audit:no-fabrications` + secret-grep sweep in P6 below. Env-var names are allowed; values must not be in repo. |
| Mia-blocked editorial items | content | "Most coveted" (MeetMia H2 + markets hub) and "yachting capital" (FTL FAQ) intentionally left intact pending Mia decision. Documented in C27 `copy-crosswalk.md`. |

## Launch blockers that REMAIN AFTER PUSH

Per `docs/artifacts/cycle-27-evergreen-city-evidence/remaining-gap-closure-map.md` §"Launch-critical summary" — these will still block production launch:

- **C.1** — Push window decision (this gate informs it; the push itself is the principal's call)
- **C.3** — Staging vs production env config
- **D.6** — REALTOR® R logo display written attestation (NAR/Florida Realtors/BPSR membership)
- **D.7** — Mia DBPR primary-source license confirmation
- **E.1** — Legal counsel + LPT broker sign-off on 4 legal pages (Privacy / Terms / TCPA PEWC / ADA)
- **F.1** — Contact form endpoint wiring (currently mailto fallback)
- **F.7** — DNS cutover from `miasanabriarealtor.com` (Direct Axess) to `miasanabria.com` (Dokploy)
- **F.8** — Dokploy production env vars + Caddy ETag flip verification
- **F.9** — Rollback plan codification

None of these are closed by this push, and none are made worse by it.

## What this push WOULD accomplish

- Move 6 cycles of work from local-only to `origin/main`, durable against workstation loss.
- Land the Mia canonical-domain release (`miasanabria.com`) front-end on the trunk.
- Surface the Cycle 27 evergreen evidence library + Cycle 28 QA to all future cycles in the same repo state.
- Establish the audit-tool baseline (mobile-readability cycle paths, no-fabrications, rendered visual) that subsequent cycles rebuild from.

## What this push WOULD NOT accomplish

- Deploy to production. Push to `origin/main` is a git event, not a deploy event. Dokploy redeploy + DNS cutover are separate steps under F.7 / F.8.
- Launch the site at `miasanabria.com`. DNS still resolves to legacy host until F.7 fires.
- Wire any form. F.1 remains mailto-fallback after push.
- Add any GHL / Google / Bridge / Realtor.com integration. Those remain credential-gated.

## Recommendation

The stack is **internally consistent**: typecheck/lint/build/audit chain stays green (verified in P6 below). The Davie rendered failure is closed. The Cycle 27 evidence library is documentation-grade, audited, and adds no production-copy risk. No secrets are in the diff.

**This is a healthy push window** from a code-and-content correctness standpoint. The decision to push is Torrey's — coordinated with whatever Mia content review and legal review cadence is in flight. No push performed by Cycle 28.
