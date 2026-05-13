# Whole-Site Continuity Reviewer — Cycle 25

**Author:** Main-session Mission Commander operating Continuity Reviewer role (substitution documented). Written AFTER the seven new neighborhood pages land so the table reflects the post-implementation state.
**Date:** 2026-05-13.
**Scope:** Evaluate the entire site for continuity where it makes sense after the Cycle 25 neighborhood content lands.

## Method

I walked every surface listed in the mission brief (Phase 5 / Agent 7 scope) against the post-implementation state, classifying each surface as Fix Now / Defer / Blocked, and tying every deferral or block to a specific owner.

Full row-level results live at `docs/artifacts/cycle-25-neighborhood-content/site-continuity-table.md`. This memo is the synthesis.

## Summary of findings

| Bucket | Count | Examples |
|---|---|---|
| **Already continuous** | 14 surfaces | `/markets/` hub picks up the 7 new entries automatically; sitemap.ts picks them up; NeighborhoodsRail flips to `Guide` suffix for all 9; HeroSearch options were already the 9 (no edit); CTA strip patterns reuse existing endpoints |
| **Fix-now (safe local)** | 0 surfaces | Cycle 25 deliberately makes zero copy edits beyond the 7 new entries to keep the cycle's scope tight and not collide with Mia content review. The cycle's risk surface is the 7 new entries themselves, not edits to existing copy |
| **Defer (Mia content review)** | 6 surfaces | `HOME_FAQ` / `HOME_VALUE_PROPS` (old East-FL geo); `AnswerFirst` body on homepage; `/markets/` hero subhead ("most coveted"); `MeetMia.tsx` "most coveted" copy; legacy market retain-vs-redirect-vs-deprecate decision; homepage Featured Markets pager swap to Mia-approved-9 |
| **Blocked (external)** | 4 surfaces | Counsel-gated legal pages (CATO-01..08 still open); GHL endpoint wiring (mailto fallback only); Bridge runtime decision (F1); DNS cutover for production canonical |

## Fix-now items — what I changed in this cycle (besides the 7 new entries)

Nothing. The cycle's discipline is: build the seven new pages cleanly, do not touch existing copy. The mission brief's "Phase 5 — Whole-site continuity pass" explicitly allows deferring Mia-tone decisions; that is what I am doing.

The temptation to "fix" `HOME_FAQ` and `HOME_VALUE_PROPS` East-FL references was real and considered. I held back because:

1. Those bodies are Mia-voice copy. Rewriting them changes how Mia's practice is described on the homepage, which crosses the "no rewriting Mia's voice without her approval" boundary.
2. They are not factually wrong — Mia does serve Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach. The continuity issue is that the homepage frames her practice narrower than the nine-city approved working set. Reconciling the narrower-frame copy with the broader Mia-approved-9 frame is a content decision, not a typo.
3. The implementation-engineer memo explicitly recommended deferring these. I am consistent with that.

## Defer items — passed to Mia content workstream

1. **`HOME_FAQ` first answer** (`src/app/page.tsx` line 31) — references "Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach" and the featured-markets list of Fort Lauderdale, Coral Ridge, Victoria Park, Boca Raton, and Delray Beach. Needs Mia decision on whether to broaden or keep narrow.
2. **`HOME_VALUE_PROPS` "Brokerage relationships" body** (`src/app/page.tsx` line 58) — also references "Eastern Fort Lauderdale, Boca Raton, and Delray Beach." Same Mia decision.
3. **`AnswerFirst` body on homepage** (`src/app/page.tsx` line 122) — "Mia Sanabria represents buyers and sellers of waterfront and luxury residences across Eastern Fort Lauderdale, with adjacent practice in Boca Raton and Delray Beach (both Palm Beach County). The work centers on the deepwater finger isles — Las Olas Isles, Harbor Beach, Rio Vista — and the in-town neighborhoods like Coral Ridge and Victoria Park." This is still accurate but doesn't yet mention the broader Broward set. Same Mia decision.
4. **`/markets/` hub hero subhead** — "Each market lives by its own architectural and social logic. Representation begins with fluency in the place — the dock, the country club, the canopy, the avenue." Strong copy; Cycle 23 hero subhead. Now that the 7 new Broward cities exist, "canopy" and "avenue" still apply (Plantation canopy, Hollywood Broadwalk) but "dock" and "country club" are weighted toward the Eastern Fort Lauderdale cohort. A minor rebalance could include "the inlet, the equestrian trail, the parkway" but this is editorial work for Mia's voice.
5. **`MeetMia.tsx` and `src/app/markets/page.tsx` "most coveted" copy** — flagged as a Mia decision in Cycle 22-R1 and not yet resolved. Continues to be deferred.
6. **Homepage Featured Markets pager** (`HOMEPAGE_FEATURED_ORDER` in `src/lib/mia.ts`) — currently East-FL waterfront 12. Mia decision required to swap or augment with the 7 new Broward cities. Deferred per Cycle 24 R2 C3 blocker.

Recommendation: a single Cycle 26 Mia content review session walks all six in 30 minutes with Mia and lands either approved rewrites or explicit "keep as-is" decisions.

## Blocked items — passed to counsel / Torrey / Bridge

1. **Counsel-gated legal pages** (`/privacy/`, `/terms/`, `/accessibility/`, `/dmca/`) — Cycle 24 R2 qa-gate carries 4 `high` warnings on these. No Cycle 25 edits; carry-over.
2. **GHL endpoint wiring** — forms still use mailto fallback. Cycle 25 does not touch.
3. **Bridge runtime** — F1 architecture decision still owned by Torrey. The new city pages link to the existing `/markets/#property-search` anchor; the Bridge scaffold remains scaffold-only in `src/lib/bridge.ts`.
4. **DNS cutover for `https://miasanabria.com`** — owned by Torrey + DNS provider. Cycle 25 does not touch.

## Risks introduced by Cycle 25 and their mitigation

| Risk | Mitigation |
|---|---|
| 7 placeholder hero JPGs ship as brand-tone abstract cards rather than Mia-licensed photos | Documented as a Mia photography upgrade pending. Replacement is a single asset swap per city. No fabricated photograph; brand-tone abstract on its face. |
| 7 new pages claim factual geographic / municipal-identity content that is plain public knowledge but cited per `source-curator.md` | All claims pre-cleared against `audit-stale-terms` + `audit-no-fabrications`; 0 hits post-build. No school / safety / familial-status / superlative claims. Geographic anchor in opening sentence of each city. |
| Internal links from 7 new pages cross-link to slugs that all exist | Verified pre-write: every internal link target is in the existing or newly-added MARKETS array. typecheck + build green. |
| Adding 7 new "primary" cluster cities grows the `/markets/` hub section #1 from 7 to 14 cards | Layout already supports any count via responsive grid. Visual continuity preserved. |

## Where the new pages plug into the site

| Surface | How it picks up the new pages | Code change required? |
|---|---|---|
| `/markets/` hub | `getMarketsByCluster("primary")` reads MARKETS automatically | No |
| `/markets/<slug>/` page | `generateStaticParams` reads MARKETS automatically | No |
| `sitemap.xml` | `src/app/sitemap.ts` maps MARKETS | No |
| Homepage `NeighborhoodsRail` | Reads `MIA_APPROVED_NEIGHBORHOODS.hasPage` | Already flipped to true for all 9 |
| Homepage `HeroSearch` | Reads `MIA_APPROVED_NEIGHBORHOODS` for `<select>` options | Already includes all 9 |
| Homepage `FeaturedMarketsPager` | Reads `HOMEPAGE_FEATURED_ORDER` | No change in Cycle 25 (Mia decision required) |
| Footer | Reads `FOOTER_NAV` from `site.ts` | No change |

## Summary

The seven new pages land with zero rewrites to existing Mia-voice copy. Six homepage / hub-page copy surfaces are flagged for Mia content review in a future cycle, four external gates remain blocked, and the new pages plug into all existing site surfaces (hub, sitemap, schema, rail, search) through the existing data-driven helpers without component edits. Compliance audits and image audits are green across the 23 markets.
