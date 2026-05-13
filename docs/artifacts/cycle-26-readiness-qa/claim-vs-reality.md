# Cycle 26 — Claim-vs-Reality Audit

**Generated:** 2026-05-13 (post-Cycle-25)
**Method:** every Cycle 25 claim re-verified against `git`, filesystem, source code, and audit output.

## Summary

| Claims verified | Overstated | Understated | Gaps requiring follow-up |
|---|---|---|---|
| 14 | 0 | 0 | 4 (mobile-capture tooling, city-fact sourcing posture, audit-rendered-visual.json growth, deferred Mia content surfaces) |

No Cycle 25 claim is overstated. Four follow-up items surface as evidence gaps — none of them are launch blockers Cycle 25 missed; they are honest follow-ups that should be acknowledged.

## Per-claim table

| # | Cycle 25 claim | Repo evidence | Actual status | Gap | Safe local fix now? | Blocked owner | Action this cycle |
|---|---|---|---|---|---|---|---|
| 1 | HEAD is `e32310d` | `git rev-parse HEAD` → `e32310d…` | ✓ exact match | none | n/a | n/a | confirmed |
| 2 | Branch is `main` | `git branch --show-current` → `main` | ✓ exact match | none | n/a | n/a | confirmed |
| 3 | Local branch is +4 ahead of `origin/main` | `git rev-list --left-right --count origin/main...HEAD` → `0	4` | ✓ exact match | none | n/a | n/a | confirmed |
| 4 | Working tree starts clean | `git status --short` → empty | ✓ exact match | none | n/a | n/a | confirmed |
| 5 | All 7 Cycle 25 pages render | `out/markets/{deerfield-beach,coral-springs,plantation,weston,hollywood,davie,sunrise}/index.html` present after build | ✓ all 7 present | none | n/a | n/a | reconfirmed via Phase 7 build |
| 6 | All 9 approved neighborhoods have `hasPage: true` | `src/lib/mia.ts` MIA_APPROVED_NEIGHBORHOODS — Fort Lauderdale + Pompano Beach + 7 Cycle 25 cities all set to `true` | ✓ exact match | none | n/a | n/a | confirmed |
| 7 | `ALL_MARKET_SLUGS` grew 16 → 23 | `src/lib/mia.ts` ALL_MARKET_SLUGS — 23 entries counted | ✓ exact match | none | n/a | n/a | confirmed |
| 8 | All 23 markets have hero + OG images | `audit:images` → 14 PASS · 0 FAIL · "all 23 markets have card images on /markets/" + "all 23 markets have OG image asset + reference" | ✓ exact match | none | n/a | n/a | reconfirmed via Phase 7 audit |
| 9 | Sitemap includes 7 new pages | `audit:route-inventory` → 47 sitemap routes reconcile (was 40 in Cycle 24 R2) | ✓ exact match — +7 | none | n/a | n/a | reconfirmed via Phase 7 audit |
| 10 | No old image churn | `public/mia-headshot.jpg` and `public/og-default.jpg` and the seven existing market OG cards were re-rendered as a side-effect of running render-images.ts; were intentionally reverted before commit per Cycle 25 closeout | ✓ no committed churn — commit shows only 7 new hero + 7 new OG | none | n/a | n/a | confirmed via `git show --stat e32310d` |
| 11 | No accidental generated `out/`, `.next/`, cache committed | `.gitignore` lines 12-13 (`out/`, `.next/`) confirmed; `docs/artifacts/**/*.jpg` gitignored line 41-42; no untracked output present | ✓ none committed | none | n/a | n/a | confirmed |
| 12 | Mobile-readability `--capture` hardcodes Cycle 19A-M path | `scripts/audit-mobile-readability.ts:289` — `const screenshotDir = "docs/artifacts/cycle-19A-M/mobile-readability/after"` (hardcoded constant) | ✓ confirmed hardcoded | This is a known carry-over from Cycle 24 R2 (gap #5) reaffirmed in Cycle 25 visual-artifacts note. | YES (fix in this cycle) | tool / process defect — main session | Phase 3 fix: add `--cycle=` and `--outDir=` flag support; default preserved |
| 13 | Cycle 25 used "repo material" fallback for facts (no web research) | `docs/artifacts/cycle-25-neighborhood-content/agent-memos/source-curator.md` — explicit "If web research is unavailable: Use repo material" posture | ✓ confirmed honest posture | Specific factual claims (1963 Coral Ridge Properties master plan; 1925 Hollywood incorporation; 1996 Weston incorporation; 1925 Davie incorporation; 1953 Plantation incorporation; 1961 Sunrise Golf Village incorporation; Tree City USA Davie; Sawgrass Mills / BB&T Center / Amerant Bank Arena Sunrise; Hollywood Broadwalk; Young Circle / ArtsPark; Quiet Waters Park; etc.) are widely-known public facts but were committed without per-fact citation. | YES (Phase 5 reviews each; safe neutralization where unsupported) | none — honest gap | Phase 5 city-fact evidence review |
| 14 | Legal / GHL / Google / DNS / Bridge blockers remain open | Cycle 25 report §"Remaining blockers (by owner category)" lists every blocker; `docs/mia-client-decision-record.md` still references each as open; no code change in `src/lib/bridge.ts` (BRIDGE_INTEGRATION_LIVE = false); no GHL endpoint added; `IS_STAGING` still `true` for any non-production URL | ✓ exact match — none misrepresented | none | n/a | n/a | confirmed |
| 15 | No production-readiness claim | Cycle 25 commit message + report carefully say "passes audit gates" + "0 FAIL" but explicitly do NOT claim production-ready; qa-gate matrix carries 4 `high` warnings (CATO-01..08 legal) and these are tracked open | ✓ no misrepresentation | none | n/a | n/a | confirmed — Cycle 26 maintains this discipline |

## Follow-up items surfaced (not Cycle 25 overstatements)

| # | Item | Owner | Cycle 26 action |
|---|---|---|---|
| F1 | `audit-rendered-visual.json` grew +16,936 lines in Cycle 25 — accumulating per-route × per-viewport probe data, now 50,153 lines / 1.4 MB | tooling / process | Flagged in `bloat-review.md`; recommend a future cycle either compress (summary JSON) or move to gitignored output. NOT addressed in Cycle 26 to avoid invalidating committed audit evidence pattern across all prior cycles. |
| F2 | Audit reports committed for every cycle — established pattern but not minimum-evidence | tooling / process | Flagged; not changed (consistent with prior cycle pattern). |
| F3 | Eight deferred Mia content surfaces still open (HOME_FAQ, HOME_VALUE_PROPS, AnswerFirst, /markets/ hero subhead, "most coveted" copy, Featured Markets pager swap, legacy markets, mobile-readability:capture path) | one item closed in Cycle 26 (mobile-capture path); 7 remain deferred | mobile-capture path fixed this cycle (Phase 3) |
| F4 | City facts ship without per-fact source citation | content / evidence | Phase 5 review; targeted neutralizations only where unsupported. |

## Verdict

Cycle 25 claims hold. No overstatement. Three of the four follow-up items are out of Cycle 26 scope (audit-rendered-visual.json size; deferred Mia content; established audit-report tracking pattern). The fourth — mobile-capture path — is the headline Cycle 26 fix.
