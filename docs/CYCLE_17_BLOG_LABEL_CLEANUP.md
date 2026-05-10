# Cycle 17 — Blog Label Cleanup

**Date:** 2026-05-10
**Status:** COMPLETE for source — built/live verification pending Phase 10/13.
**Decision binding:** CYCLE_17_DECISION_REGISTER.md Card 1.

## What changed

| Surface | Before | After |
|---|---|---|
| `editorialMonthLabel` (12 data files) | `"Evergreen Brief · <Month>"` | `"Market Note · <Month>"` |
| `src/lib/insights.ts` JSDoc (3 references) | example `"Evergreen Brief · May"` | example `"Market Note · May"` with Cycle 17 historical note |
| `src/components/insights/InsightCard.tsx` JSDoc | example `"Evergreen Brief · May"` | example `"Market Note · May"` with Cycle 17 historical note |
| `scripts/audit-insights.ts` BANNED_PHRASES | (n/a) | adds `/\bEvergreen Brief\b/i` regex |
| `scripts/audit-insights.ts` scan surface | `body + title + excerpt + seoTitle + seoDescription` | extends to also include `editorialMonthLabel + topicMonth` |

## What is intentionally unchanged

| Item | Why |
|---|---|
| `dateDisplayMode: "evergreen-month"` type literal | Internal architectural-mode name; underlying intent (evergreen post, month-anchor display) is unchanged. Renaming would churn 12 data files without changing semantics. |
| `topicMonth` field values (e.g. `"January Reset"`) | Different from `editorialMonthLabel`; serves library-navigation grouping; the audit was not previously checking this surface anyway. |
| `datePublished` / `dateModified` schema fields | Honest deployment date; never affected by visible label decisions. |
| Article hero eyebrow | Renders `Insights · ${post.editorialMonthLabel}` — auto-picks up the new label. No code change required. |
| Article footer "All insights" line | Renders `${post.editorialMonthLabel}` — auto-picks up the new label. |
| Insight card preview | Renders `${post.editorialMonthLabel}` — auto-picks up the new label. |

## Per-post label inventory

| Slug | Old | New |
|---|---|---|
| `fort-lauderdale-waterfront-buyer-guide` | `Evergreen Brief · January` | `Market Note · January` |
| `dockage-seawalls-bridge-clearance-route-to-inlet` | `Evergreen Brief · February` | `Market Note · February` |
| `positioning-luxury-waterfront-eastern-fort-lauderdale` | `Evergreen Brief · March` | `Market Note · March` |
| `las-olas-vs-seven-isles-vs-harbor-beach` | `Evergreen Brief · April` | `Market Note · April` |
| `bay-colony-and-bermuda-riviera-private-waterfront` | `Evergreen Brief · May` | `Market Note · May` |
| `coral-ridge-victoria-park-rio-vista` | `Evergreen Brief · June` | `Market Note · June` |
| `lighthouse-point-sea-ranch-lakes-hillsboro-mile` | `Evergreen Brief · July` | `Market Note · July` |
| `boca-raton-luxury-buyers-club-beach-waterfront` | `Evergreen Brief · August` | `Market Note · August` |
| `delray-beach-luxury-buyers-walkability-beach-waterfront` | `Evergreen Brief · September` | `Market Note · September` |
| `why-automated-valuations-miss-luxury-waterfront` | `Evergreen Brief · October` | `Market Note · October` |
| `preparing-waterfront-residence-private-market-conversations` | `Evergreen Brief · November` | `Market Note · November` |
| `private-buyer-brief-defining-the-search` | `Evergreen Brief · December` | `Market Note · December` |

## Validation

- `grep -rn "Evergreen Brief" src/data/` → 0 matches.
- `grep -rn "Evergreen Brief" src/` → 3 historical-record JSDoc comments only (in `src/lib/insights.ts` and `src/components/insights/InsightCard.tsx`); JSDoc is stripped from built output.
- `bun run audit:insights` → **535 PASS · 0 WARN · 0 FAIL** with the new regex active.
- Built-output grep (Phase 10 verification): expected 0 matches.
- Live grep (Phase 13 post-deploy verification): expected 0 matches.

## Why "Market Note · `<Month>`" specifically

Rationale per Decision Register Card 1:
1. Editorial seriousness without overclaiming frequency.
2. Voice consistency with the canonical "Brief" CTA word ("Begin a private buyer brief").
3. Topic-agnostic (each of 12 posts fits — buyer guide, comparison, valuation, positioning).
4. No "evergreen" disclosure visible to reader; the library's evergreen architecture is correctly captured in schema honesty, not in visible prose.
5. Lowest churn: single-token swap; audit permanently bans the legacy phrase.

## Rollback

```bash
# Restore Cycle 16 labels:
cd ~/code/mia-sanabria-website
for f in src/data/insights/*.ts; do
  sed -i 's/"Market Note · /"Evergreen Brief · /' "$f"
done
# Revert the audit-insights.ts BANNED_PHRASES addition (single regex line).
# Revert the 4 JSDoc comments via git.
```

## Related artifacts

- Decision binding: `docs/CYCLE_17_DECISION_REGISTER.md` Card 1.
- Source delta: 12 data files + `src/lib/insights.ts` + `src/components/insights/InsightCard.tsx` + `scripts/audit-insights.ts`.
- Audit binding: `audit:insights` (banned-phrase regex + scan-surface extension).
