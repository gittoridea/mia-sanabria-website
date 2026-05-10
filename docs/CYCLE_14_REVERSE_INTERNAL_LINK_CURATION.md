# Cycle 14 — Phase 3 · Reverse Internal-Link Curation

**Date:** 2026-05-10
**Outcome:** **9 new peer-to-new-market edges** added to the internal-link graph; Bay Colony gained 4 inbound links from peer markets, Bermuda Riviera gained 5 inbound links from peer markets. Audit chain stays green; `audit:links` 1351 → 1360 internal links (delta = 9, all resolve).

---

## 1. Problem

Cycle 13 wired Bay Colony and Bermuda Riviera as full first-class market entities with 4 outbound internalLinks each (to Eastern FtL waterfront / gated peers + the anchor city). The peer markets, however, did not yet link **back**. The internal-link graph was directionally sparse: a buyer landing on Harbor Beach found no link to Bay Colony, even though they sit in the same gated-waterfront cohort and a buyer comparing both is the dominant ICP pattern.

## 2. ICP-driven curation rules

Reverse-edge additions follow real buyer-comparison logic, not mechanical reciprocity:

- **Add** if the source market is in the same architectural / waterfront / cohort as the new market and a real buyer would compare both.
- **Skip** if the markets are geographically distant, in different clusters (Cluster B northern Broward coastal vs Cluster A Eastern FtL waterfront), or address different buyer profiles.
- **Cap** the link list at 6 (raised from previous 4 in `Market.internalLinks` JSDoc) — fewer than that produces a weak related section, more starts to feel like keyword stuffing.

## 3. Before / after link map

| From market | Before (n) | After (n) | Added |
|---|---:|---:|---|
| **fort-lauderdale** | 4 (las-olas-isles, harbor-beach, victoria-park, coral-ridge) | 6 | bay-colony, bermuda-riviera |
| **coral-ridge** | 3 (fort-lauderdale, victoria-park, lighthouse-point) | 5 | bermuda-riviera, bay-colony |
| **harbor-beach** | 3 (rio-vista, las-olas-isles, fort-lauderdale) | 5 | bay-colony, bermuda-riviera |
| **las-olas-isles** | 4 (seven-isles, rio-vista, harbor-beach, fort-lauderdale) | 6 | bay-colony, bermuda-riviera |
| **lighthouse-point** | 3 (hillsboro-mile, sea-ranch-lakes, coral-ridge) | 4 | bermuda-riviera (only) |

**Net:** 9 new edges in the data, all surfacing as related-market cards on the source pages.

## 4. Inbound coverage gained

| New market | Inbound links from |
|---|---|
| **bay-colony** (4 inbound, was 0) | fort-lauderdale, coral-ridge, harbor-beach, las-olas-isles |
| **bermuda-riviera** (5 inbound, was 0) | fort-lauderdale, coral-ridge, harbor-beach, las-olas-isles, lighthouse-point |

Plus the Cycle-13 outbound edges from each new market (4 each), the Eastern FtL cluster A graph is now densely wired around them.

## 5. Why each addition is valuable to the ICP

| Edge | Buyer-comparison rationale |
|---|---|
| fort-lauderdale → bay-colony | Anchor-city listing should reach all major sub-markets, including the gated estate cohort. Buyers researching Fort Lauderdale waterfront learn the gated option exists. |
| fort-lauderdale → bermuda-riviera | Same anchor logic. Bermuda Riviera's mid-century-modern architectural identity is a meaningfully different positioning than the deepwater-isles default. |
| coral-ridge → bermuda-riviera | **Strongest geographic + architectural cousin** — Coral Ridge sits to the south, Bermuda Riviera north of the country-club corridor. Same canal cohort, similar architectural era. A Coral Ridge browser should surface Bermuda Riviera. |
| coral-ridge → bay-colony | Both Eastern FtL waterfront, both off the Bayview Drive corridor. Bay Colony's gated single-entry character differentiates from Coral Ridge's open neighborhood pattern; buyers worth surfacing the alternative. |
| harbor-beach → bay-colony | **Strongest gated-peer match** — Harbor Beach is the canonical Eastern FtL gated trophy estate market; Bay Colony is the secondary gated waterfront. A Harbor Beach buyer not finding the right residence should know Bay Colony exists. |
| harbor-beach → bermuda-riviera | Both Eastern FtL deepwater; different architectural era. Worth surfacing as the mid-century alternative. |
| las-olas-isles → bay-colony | Las Olas Isles buyers prioritize deepwater + walkability; Bay Colony's gated security + dockage is a discreet alternative for buyers who prioritize privacy over walkability. |
| las-olas-isles → bermuda-riviera | Both deepwater Eastern FtL; Bermuda Riviera trades walkability for residential quiet + architectural heritage. |
| lighthouse-point → bermuda-riviera | Geographic neighbor — Lighthouse Point sits north, Bermuda Riviera south of the Galt Ocean Mile / Coral Ridge corridor. Buyers comparing northern Broward canal residences benefit from the southern-corridor reference. Bay Colony skipped (different cohort — gated estate vs neighborhood). |

## 6. Skipped peers (with reason)

| Peer | Why skipped |
|---|---|
| **rio-vista** | South of New River; geographic distance to Bay Colony / Bermuda Riviera makes the comparison weaker than the existing `fort-lauderdale → las-olas-isles → harbor-beach → ...` chain. Adding would feel forced. |
| **seven-isles** | Already cohort-bonded with Las Olas Isles + Harbor Beach + Rio Vista. Adding more would dilute the focused deepwater-yacht niche. |
| **victoria-park** | In-town walkable, no waterfront cohort. Adding Bay Colony / Bermuda Riviera would mismatch the buyer profile. |
| **sea-ranch-lakes** | Gated-village cohort in northern Broward; not a direct architectural or geographic comparison to either new market. |
| **hillsboro-mile** | A1A oceanfront corridor; no canal-residence comparison. |
| **palm-beach / boca-raton / delray-beach** | Cluster C Palm Beach County primary luxury markets — different geographic and price-band cohort. |

## 7. Cap relaxation

The `Market.internalLinks` JSDoc cap was raised from "2-4" to "2-6" in `src/lib/markets.ts`:

```typescript
/** 2-6 cross-pollination links to related markets/neighborhoods. Cycle 14 raised cap from 4 to 6 to absorb reverse-link curation for Bay Colony + Bermuda Riviera. */
```

Six entries fit the existing card grid (`grid sm:grid-cols-2 lg:grid-cols-3`) → 6 = 2×3 on desktop, 3×2 on tablet, 6×1 on mobile. No empty trailing rows, no overflow.

## 8. Acceptance gate

| Check | Result |
|---|---|
| `bun run typecheck` | exit 0 ✓ |
| `bun run build` | 27 routes prerendered ✓ |
| `bun run audit:links` | 1360 internal links · 0 broken (delta = +9 ✓ matches expected) |

## 9. Visible effect

On any of the 5 source markets' pages, the "Related Eastern Fort Lauderdale neighborhoods" / "Continue your tour" section now includes Bay Colony and/or Bermuda Riviera cards as appropriate. The graph is now bidirectional in cluster A.

## 10. Conclusion

The Eastern FtL waterfront cluster A graph is now **densely connected** around the two new markets. A buyer landing on Harbor Beach, Coral Ridge, or Las Olas Isles can reach Bay Colony and Bermuda Riviera in one click; the anchor city Fort Lauderdale reaches both directly; the northern-corridor buyer landing on Lighthouse Point can pivot to the canal-cohort reference. **Mechanical reciprocal links explicitly avoided** — Bay Colony + Bermuda Riviera continue to link **only** to peers where the comparison adds value, not back to every market that links to them.
