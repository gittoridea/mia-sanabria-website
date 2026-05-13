# Cycle 28 — Evidence-library QA (audits Cycle 27 docs)

**Generated:** 2026-05-13T20:35:00Z
**Scope:** Every Cycle 27 documentation artifact under `docs/artifacts/cycle-27-evergreen-city-evidence/`.
**Method:** Direct read of each file; pattern scan for malformed text, wrong-city bleed, broken source references, banned phrases used as content (vs. enumerated for avoidance), school/safety/family-friendly/protected-class language, ranking/superlative claims, and future-copy that should not silently leak into public pages.

## Files audited

| File | Bytes | Pass? | Notes |
|---|---|---|---|
| `copy-crosswalk.md` | 12229 | ✅ | All banned-phrase mentions are in the "Cross-page consistency" check section — they enumerate what is forbidden, not what is asserted. Mia-blocked items (FTL FAQ "yachting capital", "most coveted") are flagged correctly. |
| `source-ledger.md` | 13697 | ✅ | FTL-1..FTL-6 + POM-1..POM-5 each have a primary URL. Wikipedia citation explicitly tagged `secondary-wikipedia-pointer`. Time-pin note for the 2024 Coral Aquatic Preserve redesignation is honest. |
| `source-policy.md` | 9828 | ✅ | Taxonomy + banned-source list reads cleanly; concierge-as-private-ICP-descriptor distinction is correctly explained. |
| `mia-icp-assimilation-guide.md` | 14104 | ✅ | "Banned phrases" section enumerates the same set the project `CLAUDE.md` enforces. Sample paragraphs labeled "drafts; do not inject without Mia review." |
| `remaining-gap-closure-map.md` | 16521 | ✅ | Launch-critical block at the bottom names: C.1 / C.3 / D.6 / D.7 / E.1 / F.1 / F.7 / F.8 / F.9. Item B.7 (Davie 1280×800 fold) is the failure Cycle 28 just closed. |
| `pai-tool-discovery.md` | 10175 | ✅ | Phase-by-phase tool selection rationale; no content claims about cities. |
| `city-briefs/coral-springs.md` | 3870 | ✅ | Title + slug + content all "Coral Springs"; cites Cycle 26 §"Coral Springs" rows 1–7. |
| `city-briefs/davie.md` | 4216 | ✅ | Title + slug + content all "Davie"; cites Cycle 26 §"Davie" rows 1–8. References 1925/1961 dates which still appear in the Cycle 26 ledger and in `markets.ts` AEO/FAQ — accurate. |
| `city-briefs/deerfield-beach.md` | 5159 | ✅ | Title + slug + content all "Deerfield Beach"; cites Cycle 26 §"Deerfield Beach" rows 1–10. |
| `city-briefs/fort-lauderdale.md` | 9498 | ✅ | Title + slug + content all "Fort Lauderdale"; cites FTL-1..FTL-6 in `../source-ledger.md`. "Yachting capital of the world" flagged for softening but **not** asserted as Cycle 27's recommendation — flagged as Mia-blocked editorial. |
| `city-briefs/hollywood.md` | 3751 | ✅ | Title + slug + content all "Hollywood" (with "distinct from Los Angeles" disambiguator). |
| `city-briefs/plantation.md` | 3647 | ✅ | Title + slug + content all "Plantation". |
| `city-briefs/pompano-beach.md` | 10242 | ✅ | Title + slug + content all "Pompano Beach"; cites POM-1..POM-5. POM-3 honestly notes the city source uses "Mayor" and "Commissioner" interchangeably for Lamar Fisher; canonical title surfaced is "Broward County Commissioner". |
| `city-briefs/sunrise.md` | 3944 | ✅ | Title + slug + content all "Sunrise"; Amerant Bank Arena rename Sep 19 2023 sourced. |
| `city-briefs/weston.md` | 3744 | ✅ | Title + slug + content all "Weston"; Arvida master plan and 1996 incorporation sourced. |

## Defect classes — none found

The full grep for problem patterns returns hits **only** inside the explicit "do not use" / "banned phrases" enumeration sections of `copy-crosswalk.md`, `mia-icp-assimilation-guide.md`, and `source-policy.md`. These are correct documentation use — they tell future writers what to avoid. Confirmed via inspection of each line context.

| Class | Result |
|---|---|
| Malformed sentences | 0 |
| Wrong-city bleed (a brief naming the wrong city in title / facts / ledger ref) | 0 |
| Broken punctuation (`..` at sentence boundaries) | 0 — the only `..` hits are `../source-ledger.md` (relative path) and `CATO-01..08` (range syntax) |
| Missing source rows / broken FTL-N / POM-N references | 0 — every reference resolves |
| `secondary-wikipedia-pointer` masquerading as primary | 0 — Wikipedia citations are explicitly tagged |
| Cycle 26 `city-fact-evidence-review.md` resolves | ✅ present at `docs/artifacts/cycle-26-readiness-qa/city-fact-evidence-review.md` |
| Schools / safety / family-friendly / protected-class claims used as content | 0 — only enumerated as "what NOT to write" |
| Ranking / superlative claims used as content | 0 — "most coveted" / "yachting capital" appear only as items flagged for Mia decision, not as recommendations |
| "Yachting capital" inadvertently promoted | 0 — the Fort Lauderdale brief surfaces it as `FTL-FAQ-1` flagged for softening, not as a confirmed claim |
| Future-copy that would silently leak to public pages | 0 — sample paragraphs in `mia-icp-assimilation-guide.md` are explicitly labeled "drafts; do not inject without Mia review" |

## Cross-check with project CLAUDE.md honesty contracts

The Cycle 27 banned-phrase list in `mia-icp-assimilation-guide.md` (lines 87–101) and `source-policy.md` (lines 31–73) matches the project `CLAUDE.md` honesty contracts. The `copy-crosswalk.md` "Cross-page consistency check" (lines 95–98) names `audit-stale-terms.ts` as the runtime enforcement.

## Potential carry-forward improvements (not defects)

These are quality-of-life items, NOT documentation errors. None require a Cycle 28 fix.

1. **`copy-crosswalk.md` row D.6 (REALTOR® R logo)** lists `audit-no-fabrications.ts:77-79` as where the Mia-blocked superlative discipline lives. Source is accurate.
2. **`remaining-gap-closure-map.md` C.1** says "5 commits ahead of `origin/main`". Actual current state (Cycle 28 preflight): **6 commits ahead** (`a7a7933` ↔ `967aac5`). Cycle 27 was the 6th commit; the doc was written before Cycle 27's own commit landed. **Not a defect** — the count was correct at the moment it was written. Cycle 28 will write its own state into the session report.
3. **`pai-tool-discovery.md` Phase 3** references "main session via WebFetch / WebSearch + Cycle 26 reuse" — describes Cycle 27's research approach for the two anchor-city gaps. No issue.

## Defects requiring a documentation patch

**None.** No edit to Cycle 27 documentation is required by this Cycle 28 QA pass.

## Recommended follow-ups (NOT this cycle)

- If a future cycle adds Fort Lauderdale's 1911 incorporation date or 38.6 sq mi area to production copy, the source ledger already carries the Census-backed evidence.
- The 2024 Coral Aquatic Preserve dual-designation is documented in POM-4 if Mia wants to surface it in a future cycle.

## Conclusion

Cycle 27 evidence library passes Cycle 28 QA. Zero documentation defects, zero wrong-city bleed, zero broken source references, zero protected-class claims, zero superlative claims surfaced as content. No documentation edits made by Cycle 28.
