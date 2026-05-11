# Cycle 18 — Fort Lauderdale V4 Implementation

**Date:** 2026-05-10
**Predecessor:** docs/CYCLE_17_FORT_LAUDERDALE_V3_IMPLEMENTATION.md
**Definition doc:** docs/CYCLE_18_FORT_LAUDERDALE_PAGE_DEFINITION.md
**Source ledger:** docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md
**Component:** `src/components/markets/FortLauderdaleV2.tsx` (filename + export name preserved per Decision Card 4 — route stability for the rollout-template architecture)

## What shipped

In-place V3 → V4 lift on `FortLauderdaleV2.tsx`. Filename + export name preserved; the `[slug]/page.tsx` slug-guard pattern (line 96-104) does not churn. V3 markers preserved as a strict subset of V4.

### Sections (V4 module list)

1. **Hero** — V3 precision frame retained (`heading="Where deepwater yacht access, a working downtown, and a 165-mile canal system meet."`).
2. **Prelude — "A decision, not a default"** — V3 preserved verbatim (eyebrow + heading + body).
3. **Research-backed opening (NEW V4)** — new section between prelude and Executive AEO. Carries the Cycle 18 source-ledger facts:
   - Approximately 165 miles of inland navigable waterways within city limits, sitting inside Greater Fort Lauderdale's broader 300+ mile Broward County system.
   - 38.6 sq mi total area, ~10% water (3.8 sq mi) — per US Census.
   - "Venice of America" + "Yachting Capital of the World" labels (Visit Lauderdale + MIASF).
   - $18.5B regional marine industry / 142,000 jobs across Broward, Miami-Dade, Palm Beach (MIASF).
   - Port Everglades operational character (within FtLaud city limits, Broward County enterprise fund, busiest cruise port, primary petroleum / jet-fuel seaport).
   - New River ~3 miles through downtown — explicitly noted as having multiple drawbridges (no "no-fixed-bridge access" claim about the New River itself).
   - LauderGO! Water Trolley — free public water shuttle, 8 stops, daily 10 a.m. – 10 p.m., partnership with Water Taxi + Riverwalk.
   - Inline source attribution + cross-link to the source ledger doc.
4. **Executive AEO answer** — V3 preserved (`market.aeoAnswer` paragraph).
5. **Market identity** — V3 preserved.
6. **Waterfront decision framework — Nine verifiable variables (extended from 7 V3)** — section heading updated from "Six verifiable variables" → "Nine verifiable variables". Two new cards added:
   - **Canal width and turning basin** (Waves icon) — promotes the V3-implicit dimension to its own card; survey + low-tide confirmation language.
   - **Outdoor living and dock-side amenities** (Trees icon) — outdoor kitchen, lift, lighting, lanai, pool placement, salt-air-tolerant landscaping; treats dock-side experience as a discrete variable separate from the structural dock + seawall + route variables.
   - The 9th card (insurance + 4-point sequence) remains the emphasized full-width card; helper prose updated from "None of the seven" → "None of the nine".
7. **Buyer's comparison cohort (NEW V4 editorial)** — new section between waterfront framework and existing neighborhood comparison cards. Three tiers, editorial prose, NOT a list dump:
   - Tier 1 — Eastern Fort Lauderdale finger-isle peers (Las Olas Isles, Seven Isles, Harbor Beach, Rio Vista, Coral Ridge, Victoria Park, Bay Colony, Bermuda Riviera).
   - Tier 2 — Northern Broward waterfront alternatives (Lighthouse Point, Hillsboro Mile, Pompano Beach).
   - Tier 3 — Palm Beach County peers (Boca Raton, Palm Beach, Delray Beach).
   - Each peer name is an inline `<Link>` to the dedicated market guide.
8. **Neighborhood comparison cards** — V3 6-peer cards + per-peer pointers retained. Section heading reframed to clarify it's the canonical Eastern Fort Lauderdale peer set; sub-text references the three-tier framework above.
9. **Buyer playbook (extended from 5 V3 → 6 V4)** — new Step 5 ("Confirm financing, cash, and insurance early"). Original Step 5 ("Use private conversations for quiet inventory") moves to Step 6. Anti-pattern aside retained.
10. **Seller playbook (extended from 5 V3 → 7 V4)** — two new steps inserted:
    - New Step 3: "Organize the insurance dataroom" — recent 4-point + wind-mitigation report + elevation certificate + prior-claim history (or CLUE report).
    - New Step 5: "Editorial photography and dock-up narrative" — carved out of V3's combined "Editorial photography and positioning" step.
    - Step 6: "Tour-ready presentation tuned to the buyer pool" — cleanly separated.
    - Anti-pattern aside retained.
11. **Related Insights** — V3 preserved.
12. **FAQ (extended from 9 V3 → 11 V4)** — `FORT_LAUDERDALE_V2_FAQS` extended from 4 → 6 items (page total 5 + 6 = 11). New entries:
    - "What does 'no fixed bridges' mean and where does it actually apply?" — clarifies the term, identifies the New River as NOT a no-fixed-bridge corridor (multiple drawbridges).
    - "How does Fort Lauderdale compare to Pompano Beach for waterfront buyers?" — closes the comparison cohort to the new Pompano Beach market page.
13. **4-CTA strip** — V3 preserved.

### Helper-prose / heading edits

- Section 4 heading: "Six verifiable variables before any offer." → "Nine verifiable variables before any offer."
- Section 4 closing italic: "None of the seven is a substitute for…" → "None of the nine is a substitute for…"
- Section 5 heading reframe: was implicit; now references the three-tier framework above.

## Source-ledger trace

Every research-backed claim added in V4 traces back to a row in
`docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md` Part C (Verified
facts safe to paraphrase in copy):

| V4 claim | Ledger row | Source |
|---|---|---|
| 165 mi waterways within city limits | F1 | A3 [MED] |
| 300+ mi waterways across Broward | F1 | A2 [HIGH] |
| Venice of America + Yachting Capital | F2 | A1 + A7 [HIGH] |
| Port Everglades — within city, Broward County enterprise fund | F3 | A4 [HIGH] |
| New River ~3 mi, drawbridges (NOT no-fixed-bridge) | F4 | A12 [MED] |
| 24 mi coastline / 23 mi beach (regional) | F5 | A1 + A2 [HIGH] |
| $18.5B regional marine industry / 142,000 jobs | F6 | A7 [HIGH] |
| Intracoastal role | F7 | Composite [HIGH for role] |
| Cooley's Landing on the New River | F8 | A2 + A10 [HIGH/MED] |
| Census 38.6 sq mi / 10% water | F9 | A6 [HIGH for water-area %] |
| LauderGO Water Trolley | F10 | A11 [HIGH] |
| Pompano Beach comparison points | Pompano Part C P1, P5, P7, P11 | B1, B4, B11 [HIGH] |

All hedges in the ledger are honored in the V4 copy (geographic scope named on every figure; "approximately" used for soft numbers; tourism positioning labels prefixed with "widely known as" not "officially designated").

## Anti-claims (Cycle 18 banned per source ledger)

- ❌ "300 miles of inland waterways within Fort Lauderdale" — that figure is Broward County, not city.
- ❌ "No fixed bridges" claim about the New River — multiple drawbridges cross it.
- ❌ "Cooley's Landing has X slips" or "no-fixed-bridge access" claim about Cooley's Landing — Source A10 [MED] does not support either.
- ❌ Any specific fact attributed to a `fortlauderdale.gov` URL except the LauderGO Water Trolley page (A11) — those URLs return 403 to bots; until operator browser-confirms, they are unverified.
- ❌ "Exclusive private inventory" / "off-market exclusive listings I have access to" — banned by `audit:insights` and `audit:about`.

## Audit

`scripts/audit-fort-lauderdale-standard.ts` (NEW V4 audit) — successor to `scripts/audit-fort-lauderdale-v3.ts`. V3 markers retained as a strict subset; V4 markers added; two anti-checks added (no 300-mi-city-scope, no-fixed-bridge-New-River-positive-assertion).

`package.json` script: `audit:fort-lauderdale-standard` added; `audit:fort-lauderdale-v3` retained as a back-compat alias.

Run result: **31 PASS · 0 WARN · 0 FAIL.**

## Acceptance criteria status (against page-definition doc)

| ISC | Status |
|---|---|
| V4-1: Research-backed opening section | ✅ PASS |
| V4-2: Waterfront framework 7 → 9 cards | ✅ PASS |
| V4-3: Buyer's comparison cohort section | ✅ PASS |
| V4-4: Pompano Beach in Tier 2 | ✅ PASS |
| V4-5: Buyer playbook 5 → 6 steps | ✅ PASS |
| V4-6: Seller playbook 5 → 7 steps | ✅ PASS |
| V4-7: FAQ 9 → 11 (FAQPage schema = 11 Question entries) | ✅ PASS |
| V4-8: All V3 markers preserved | ✅ PASS (V3 audit also remains green; V4 audit treats V3 as subset) |
| V4-9: V4 audit introduced and PASS at first run | ✅ PASS |
| V4-10: No 300-mi-city-scope; no New-River-no-fixed-bridge claim; no `fortlauderdale.gov` cite outside LauderGO | ✅ PASS (anti-checks green) |
| V4-11: Anti-pattern asides retained | ✅ PASS (4 matches) |
| V4-12: Hero precision frame retained | ✅ PASS |
| V4-13: Component filename + export name unchanged | ✅ PASS |

## Rollback

Single commit. To revert V4 → V3:
1. Revert `src/components/markets/FortLauderdaleV2.tsx` to the Cycle 17 version (git checkout `9b7f828 -- src/components/markets/FortLauderdaleV2.tsx`).
2. Optional: delete `scripts/audit-fort-lauderdale-standard.ts` and the package.json script entry.
3. Cycle 17 V3 audit (`audit:fort-lauderdale-v3`) remains in place and remains green against the reverted file.

## Cross-references

- docs/CYCLE_17_FORT_LAUDERDALE_V3_IMPLEMENTATION.md — V3 baseline
- docs/CYCLE_17_FORT_LAUDERDALE_ICP_REVIEW.md — V3-era ICP framework
- docs/CYCLE_18_FORT_LAUDERDALE_PAGE_DEFINITION.md — V4 page definition
- docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md — V4 source ledger
- docs/ULTIMATE_FEATURED_MARKET_PAGE_STANDARD.md — rollout standard
- docs/CYCLE_16_FORT_LAUDERDALE_MARKET_PAGE_V2_BLUEPRINT.md — V2 blueprint
- docs/CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md — rollout process
