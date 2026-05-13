# Cycle 25 — Mission Commander Memo

**Mission:** Build seven new approved-neighborhood pages — Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise — into the existing `/markets/[slug]/` template.

**Scope:** Governs page model + risk surface. Does NOT write the city briefs themselves (separate workstream in `city-briefs/`). Does NOT touch Bridge, GHL, DNS, Dokploy, photography, testimonials, or the legacy-market retain-vs-redirect decision.

**Authority:** Decision record (`docs/mia-client-decision-record.md`) §"Approved neighborhoods (9, locked)". Slug source of truth: `src/lib/mia.ts:162-172` (`MIA_APPROVED_NEIGHBORHOODS`).

---

## 1. Page model

Each new city page reuses `src/app/markets/[slug]/page.tsx:120-371` verbatim. No new component, no new schema, no new section. The Fort Lauderdale V2 short-circuit at `:110-118` is not invoked — only `fort-lauderdale` enters `FortLauderdaleV2Page`; every other slug renders the canonical 8-section flow.

Section order (template-fixed):

1. **Schema heads** — `RealEstateAgentSchema`, `PlaceSchema` (county, lat/long, intro), `BreadcrumbSchema`.
2. **Hero** — eyebrow `"{name} · Southeast Florida"`, heading=`tagline`, sub=`intro`, primary `/contact/`, secondary `/markets/`, `imageSrc=heroImage`.
3. **AEO answer block** — `aeoAnswer`.
4. **Lifestyle two-column + market brief aside** — `lifestyle` + `highlights` + `priceCharacter` left; "Considering {name}?" aside with `/contact/` + `/valuation/` right.
5. **Property archetypes grid** — exactly 5 entries from `propertyTypes`, numbered 01–05.
6. **Buyer guidance** — `buyerGuidance` left; `/buyers/` + `/contact/?intent=buyer` aside right.
7. **Seller guidance** — `sellerGuidance` left; `/sellers/` + `/valuation/` aside right.
8. **FAQ + FaqSchema** — 5 visible FAQs; `FaqSchema` emits synthesized AEO + 5 FAQs as one `FAQPage` entity.
9. **Related markets** — `internalLinks` resolved; `comparisonContext` paragraph above card grid. Heading auto-detects "Related Eastern Fort Lauderdale neighborhoods." vs. "Continue your tour." per `:94-105` — the seven new entries trigger the generic heading because their peers are primary-cluster, not Eastern-FtLaud-only.
10. **`RelatedInsightsModule`** — silent-empty if no insights brief references the slug.
11. **CTAStrip** — "Inquire about {name}."

Metadata builder (`:33-42`) clamps `aeoAnswer`'s first sentence + Mia tail to ~158 chars. **Author contract:** that first sentence must read cleanly as a standalone meta description.

---

## 2. Content standard

Pompano Beach (`src/lib/markets.ts:1100-1174`) is the gold standard. Filler is a wordy generic Broward template with no source-traceable geography. The contract:

- **Every factual claim has a public-record source.** The Pompano header (`:1082-1099`) documents the source ledger (City CRA, Coastal Zone Comprehensive Plan, FL DEP, US Census, Broward GeoHub) and names in-line hedges ("approximately 1,000 feet (the CRA Pier page describes the renovated structure as 'over 900 feet')"). Each new city carries the same source rigor in a per-city research ledger before copy is written.
- **Geography is named, never gestured.** Pompano cites compass-named borders (Lauderdale-by-the-Sea south, Hillsboro Beach north), lat/long, square mileage, CRA districts. Generic "vibrant community" / "thriving city center" does not appear. Each new city has specific anchors (Davie equestrian overlay, Sunrise BB&T Center + Sawgrass, Weston Indian Trace, Coral Springs 1960s master-planned origin, Hollywood Broadwalk, Plantation civic-center transition, Deerfield Beach pier + Hillsboro Inlet south side).
- **Comparison is honest about relative value.** Pompano explicitly trades "at relative value to Fort Lauderdale and Boca Raton" — fact-claim about position, not superlative about quality. New entries locate themselves the same way: Coral Springs/Weston as inland master-planned peers, Plantation/Davie as transitional, Hollywood as Fort Lauderdale's south flank coastal alternative.
- **Buyer / seller guidance is operational, not aspirational.** Pompano's `buyerGuidance` (`:1134`) names four briefs and concrete diligence vectors (seawall, dock, milestone-inspection, route to inlet). Each new city has its own vectors — flood zone, equestrian overlay, deed restrictions, HOA density, condominium milestone status. Generic "work with a trusted REALTOR®" is rejected.
- **Exactly 5 property archetypes, exactly 5 FAQs.** The grid contract is fixed; the count forces archetype specificity. FAQ 1 = a real geography / civic-identity question, not an SEO one. One FAQ = cohort comparison. No school / safety / demographics / "best neighborhoods within {city}."
- **`comparisonContext` names the cohort.** Pompano (`:1172`) names Lighthouse Point, Hillsboro Mile, Fort Lauderdale, Boca Raton, Delray Beach with buyer-decision logic. New entries name only existing approved slugs in `internalLinks`; non-slug civic neighbors (Parkland, Cooper City) may appear in prose unlinked.

---

## 3. Risks

| Risk | What it looks like | Audit / gate |
|---|---|---|
| Fact fabrication | Unsourced civic stats; invented founding dates | `audit:no-fabrications` (`scripts/audit-no-fabrications.ts`); per-city research ledger gates copy |
| Superlative drift | "Best schools," "premier master-planned," "the #1 realtor" | `audit:stale` (`scripts/audit-stale-terms.ts:44-72`): `#1 realtor`, `top realtor`, `most exclusive`, `unparalleled`, `pinnacle of`, `unrivaled`, `unmatched`, `flawless`, `seamlessly` |
| Fair Housing steering | "Family-friendly Weston," "safe Coral Springs" | `audit:stale` (`:53-58`): `best schools`, `good schools`, `safe neighborhood`, `family-friendly`, `bachelor pad`, `kid-friendly` |
| FREC superlative / guarantee | "Guaranteed sale in Hollywood" | `audit:stale` (`:44-49`); `audit:legal` |
| School / protected-class claim | School-name reference, demographic characterization | `audit:stale` school patterns; `audit:legal` |
| Double-period defect | Concatenation artifact `"…25 square miles..  Sellers…"` | `audit:stale` (`:82` regex `[a-z]\.\.\s+[A-Z]`) |
| Image gap | Missing `/public/markets/{slug}.jpg` or OG counterpart | `audit:images`; sharp-generated brand-tone SVG placeholder is acceptable until Mia supplies photography |
| Route slug rename temptation | Renaming `/markets/` to `/neighborhoods/` mid-cycle | Out of scope (locked in decision record); `audit:route-inventory` |
| Language-service claim | Any Spanish/bilingual framing | `src/lib/mia.ts:56` locks `languages: ["English"]`; `audit:about`, `audit:schema` |
| Testimonial fabrication | Invented quotes for any of the seven | `audit:no-fabrications`; capture flow per `docs/mia-testimonial-capture-plan.md` is the only path |
| Broker-reciprocity / MLS overclaim | "Live MLS in Coral Springs," "Mia has direct reciprocity" | Decision record §"IDX"; `audit:legal` |
| QA-gate critical regression | `critical > 0` on `audit:qa-gate` | `audit:qa-gate` (`scripts/audit-qa-gate.ts`) — the publish gate |

Every claim in every brief is traceable to a public-record source in a per-city research ledger (modeled on `docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md`, referenced at `markets.ts:1085`). No ledger entry, no copy.

---

## 4. Implementation order

Recommended sequence by content-difficulty + geographic adjacency. One-sentence defense each:

1. **Deerfield Beach** — northernmost Broward coastal city directly adjacent to shipped Pompano Beach; inherits the most adjacent-city framing from the existing source taxonomy.
2. **Hollywood** — southernmost Broward coastal city with well-documented A1A + Broadwalk + Intracoastal sources; cleanly contrasts against Fort Lauderdale's south flank.
3. **Plantation** — inland transition between coastal Fort Lauderdale and the western cohort; mid-sized civic-record surface bridges the coastal framings into the inland ones.
4. **Davie** — Town of Davie equestrian overlay + Nova Southeastern + western expansion are denser than Plantation; written fourth to inherit the inland framing.
5. **Coral Springs** — 1960s master-planned anchor with HOA density and parks system; written before Weston to establish the master-planned framing.
6. **Weston** — 1990s master-planned peer with deed-restriction patterns and Indian Trace; inherits and contrasts against Coral Springs' older-cohort framing.
7. **Sunrise** — Sawgrass Mills + BB&T Center + western boundary; least dense residential civic surface, written last to inherit all prior cohort context.

---

## 5. Cluster assignment

All seven entries: `cluster: "primary"`. The `"primary"` cluster (`markets.ts:55-59`) is defined as "city/town-level service market" — all seven are independent Broward municipalities with their own governments. The `"neighborhood"` cluster (`:60-62`) is Eastern Fort Lauderdale neighborhoods only. The `"northern-broward-waterfront"` cluster (`:63-67`) is bounded by Hillsboro Mile. Existing `"primary"` peers: Fort Lauderdale, Boca Raton, Delray Beach, Palm Beach, Lighthouse Point, Sea Ranch Lakes, Pompano Beach. Mis-classifying any of the seven as `"neighborhood"` would falsely route them under the Eastern FtLaud heading at `[slug]/page.tsx:94-105` — a geographic-misrepresentation risk.

---

## 6. What must remain blocked / deferred

Any agent attempt to ship these must hard-stop:

- **Testimonial import** — `docs/mia-testimonial-capture-plan.md` flow; reviewer name + date + permission required.
- **Language-service claims** — `src/lib/mia.ts:56` locks English-only. No Spanish or bilingual framing anywhere.
- **MLS reciprocity / Bridge runtime** — Bridge stays scaffold-only (`src/lib/bridge.ts`). No "live search," "real-time inventory," "MLS feed" copy. Search affordance remains `/markets/#property-search`.
- **School / safety / protected-class claims** — Fair Housing catalog at `audit-stale-terms.ts:53-58` is the hard wall.
- **Route slug rename** (`/markets/` → `/neighborhoods/`) — deferred per decision record.
- **Mia photography upload** — placeholder JPGs via sharp from inline brand-tone SVG only. No scraping from `miasanabriarealtor.com`, socials, Street View, or stock.
- **GHL endpoint wiring / lead capture** — mailto fallback only.
- **Legacy-market retain-vs-redirect** — boca-raton, palm-beach, delray-beach, las-olas-isles, harbor-beach, coral-ridge, victoria-park, lighthouse-point, rio-vista, seven-isles, sea-ranch-lakes, hillsboro-mile, bay-colony, bermuda-riviera all stay; Cycle 25 is additive.
- **Homepage Featured Markets pager swap** — `HOMEPAGE_FEATURED_ORDER` (`mia.ts:130-143`) unchanged.
- **`/markets/` index restructure** beyond automatic inclusion of the seven new primary-cluster entries.
- **DBPR license verification** — Mia's `unverified.licenseNumber` stays unverified until DBPR primary-source screenshot.

---

*Mission Commander memo authored Cycle 25, 2026-05-13. Implementation engineer follows `page-model.md` and per-city briefs under `city-briefs/`. Per-city research ledger modeled on Cycle 18 Pompano is prerequisite for each brief.*
