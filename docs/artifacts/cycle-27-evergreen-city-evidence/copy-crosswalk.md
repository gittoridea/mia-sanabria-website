# Cycle 27 — Copy Crosswalk

**Generated:** 2026-05-13
**Method:** Cross-walk every Cycle 27 evidence-library claim against current repo copy. Rows track current claim, source support, risk level, recommended action, whether a Phase 7 safe local fix is possible now, the blocked owner if not, and whether the action was implemented this cycle.

## Risk-level scale

- **Low** — fact is verified, neutral, and matches honesty contract. No action required.
- **Medium** — fact is verified but framing could mislead, or the source is `secondary-wikipedia-pointer` only. Soften or source-upgrade.
- **High** — fact is unsupported, value-laden, or Fair-Housing / FREC-adjacent. Requires neutralization or removal.
- **Mia-blocked** — Mia-voice phrase that requires Mia content decision, not an audit-side fix.
- **Legal-blocked** — broker / legal / counsel sign-off required.

## Per-city crosswalk

### `slug: "fort-lauderdale"`

| Section | Current claim | Source support | Risk | Recommended action | Safe local fix now? | Blocked owner | Implemented this cycle? |
|---|---|---|---|---|---|---|---|
| `intro` | Mia's home market ; pairs waterfront / beach / in-town | Generic city geography per fortlauderdale.gov | Low | None | n/a | n/a | n/a |
| `tagline` / `highlights` | Waterfront / beach / in-town neighborhoods ; FLL / Port Everglades access | Generic city features per City + Broward County | Low | None | n/a | n/a | n/a |
| `miaQuote` | "Venice of America" ; 165 miles inland canals ; deepwater yachting market | fortlauderdale.gov (FTL-1) | Low | None | n/a | n/a | n/a |
| `aeoAnswer` | Venice of America ; 165 miles canals ; deepwater yacht-capable ; Las Olas / A1A / Riverwalk ; Port Everglades / FLL / Las Olas-to-beach axis | All verified (FTL-1, FTL-3, FTL-5, FTL-6) | Low | None | n/a | n/a | n/a |
| `propertyTypes` | Deepwater SF / beach condos / in-town historic / contemporary new-build estates / townhomes / low-rise condos | Qualitative — safe | Low | None | n/a | n/a | n/a |
| `buyerGuidance` / `sellerGuidance` | Three buyer profiles ; dockage / walkability / beach ; seawall + dock + flood diligence | Qualitative — safe | Low | None | n/a | n/a | n/a |
| FAQ 1 | "yachting capital of the world" | Industry-association language, not `.gov` | Medium | Soften to "considered one of the world's leading yachting cities" OR source to MIASF / Chamber | Yes (single-sentence edit) | Editorial — Mia or main session | **Not implemented this cycle** — defer to Phase 7 decision below |
| FAQ 1 | "more than 165 miles of navigable inland waterways" + "deepwater ocean access via Port Everglades" + "no fixed bridges between major yacht-capable canals and the Atlantic" | Verified per FTL-1 + FTL-6 | Low | None | n/a | n/a | n/a |
| FAQ 2–5 | Neighborhood enumerations, dockage importance, SF/condo balance, "how Mia approaches" | Qualitative — safe | Low | None | n/a | n/a | n/a |
| `internalLinks` | Las Olas Isles, Harbor Beach, Victoria Park, Coral Ridge, Bay Colony, Bermuda Riviera | Internal navigation only | Low | Optional: add Pompano Beach as a peer-comparison link | Yes (single-line edit) | Editorial | Not necessary — defer until Mia confirms link target |

### `slug: "pompano-beach"`

| Section | Current claim | Source support | Risk | Recommended action | Safe local fix now? | Blocked owner | Implemented this cycle? |
|---|---|---|---|---|---|---|---|
| `intro` / `tagline` / `highlights` | Northeastern Broward ~25 sq mi ; 3-mile public beachfront ; Fisher Family Pier dedicated April 2022 ; 6-acre Fishing Village in East CRA ; East + Northwest CRA ; Kristin Jacobs Coral Reef ECA | All verified (POM-1 … POM-4) | Low | None | n/a | n/a | n/a |
| `localContext` | Mainland + barrier-island borders ; Hillsboro Inlet Lighthouse split (Hillsboro Beach side / Pompano museum side at Hillsboro Inlet Park) ; 4 marinas / 100 wet slips / dry storage Lake Santa Barbara + NE 16th St / 3 boat ramps Alsdorf Park | Verified (POM-5 + City Coastal Zone element) | Low | None | n/a | n/a | n/a |
| FAQ 2 | "approximately 1,000 feet long" + "over 900 feet" coexist with attribution to City vs CRA page | Sourced honestly to both city descriptions | Low | None — the dual citation is the right discipline | n/a | n/a | n/a |
| FAQ 5 | Kristin Jacobs Coral Reef ECA ; ~105 miles ; renamed 2021 for "the late State Representative Kristin Jacobs" ; Florida DEP Coral Reef Conservation Program ; Shipwreck Park 501(c)(3) ; Wahoo Bay / Lady Luck / Okinawa | All verified (POM-4) | Low | Optional: mention the July 1 2024 redesignation to Coral Aquatic Preserve. Not necessary for accuracy. | n/a | n/a | n/a |

### `slug: "deerfield-beach"`

| Section | Source support | Risk | Recommended action | Implemented? |
|---|---|---|---|---|
| All sections | Cycle 26 ledger (10 of 10 verified) | Low | None | n/a |

### `slug: "coral-springs"` / `plantation` / `weston` / `hollywood` / `davie` / `sunrise`

| Slug | Source support | Risk | Recommended action | Implemented? |
|---|---|---|---|---|
| coral-springs | Cycle 26 ledger (7 of 7) | Low | None | n/a |
| plantation | Cycle 26 ledger (7 of 7) | Low | None | n/a |
| weston | Cycle 26 ledger (6 of 6) | Low | None | n/a |
| hollywood | Cycle 26 ledger (7 of 7) | Low | None | n/a |
| davie | Cycle 26 ledger (8 of 8, 1925/1961 neutralization confirmed) | Low | None | n/a |
| sunrise | Cycle 26 ledger (7 of 7) | Low | None | n/a |

## Homepage and `/markets/` hub voice surfaces

| Surface | File | Current text | Source support | Risk | Recommended action | Safe fix now? | Blocked owner | Implemented? |
|---|---|---|---|---|---|---|---|---|
| `HOME_FAQ` | `src/app/page.tsx:28-49` | Service-area, "what sets Mia apart," home-value question, "how do I begin" | Qualitative — matches Mia decision record | Low | None | n/a | n/a | n/a |
| `HOME_VALUE_PROPS` | `src/app/page.tsx:51-68` | Personal representation, brokerage relationships, current-market clarity, discreet by default | Qualitative — survived Cycle 22-R1 Mia review | Low | None | n/a | n/a | n/a |
| `AnswerFirst` block | `src/app/page.tsx:120-126` | "What kind of real estate does Mia specialize in?" — waterfront/luxury, Eastern FTL + Boca + Delray, finger isles + in-town, Mediterranean Revival, Atlantic Avenue, beach corridor | Qualitative — geographic and architectural framing, all verified neighborhoods | Low | None | n/a | n/a | n/a |
| `MeetMia` H2 | `src/components/MeetMia.tsx:31` | "Personal representation in Southeast Florida's most coveted coastal markets." | "Most coveted" is Mia voice — `audit-no-fabrications.ts:77-79` explicitly leaves it off the audit catalog because it "requires a Mia content decision, not an audit gate." | **Mia-blocked** | Soften or replace if Mia approves a non-superlative alternative. No safe unilateral edit. | No | Editorial — Mia | Not implemented |
| `MeetMia` body | `src/components/MeetMia.tsx:35-45` | Mia is a Fort Lauderdale REALTOR® with LPT Realty ; private conversation framing ; "long relationships, current-market evidence, and the discretion luxury transactions require" + anchorLine | Qualitative — matches Mia decision record | Low | None | n/a | n/a | n/a |
| `/markets/` hub Hero H1 | `src/app/markets/page.tsx:63` | "Southeast Florida's most coveted coastal communities." | Same Mia-voice surface | **Mia-blocked** | Same as MeetMia. Editorial decision. | No | Editorial — Mia | Not implemented |
| `/markets/` hub Hero sub | `src/app/markets/page.tsx:64` | "Each market lives by its own architectural and social logic. Representation begins with fluency in the place — the dock, the country club, the canopy, the avenue." | Qualitative — Mia voice; survived prior cycles | Low | None | n/a | n/a | n/a |
| `/markets/` hub "Eastern Fort Lauderdale and adjacent waterfront" sub | `src/app/markets/page.tsx:94` | Cluster description | Qualitative — safe; cites Hillsboro Beach distinct from Fort Lauderdale honestly | Low | None | n/a | n/a | n/a |
| Featured Markets pager source | `src/lib/mia.ts:142-155` `HOMEPAGE_FEATURED_ORDER` | Fort Lauderdale + Boca + Palm Beach + Victoria Park + Lighthouse Point + Delray + 6 neighborhood-level slugs | Principal-locked (Decision Register Cycle 16 §1) | Low | None | n/a | n/a | n/a |

## Legacy East-FL markets — retain / de-emphasize strategy

The repo has 14 legacy market slugs not on Mia's approved-9: `coral-ridge`, `victoria-park`, `boca-raton`, `palm-beach`, `delray-beach`, `lighthouse-point`, `rio-vista`, `harbor-beach`, `las-olas-isles`, `seven-isles`, `sea-ranch-lakes`, `hillsboro-mile`, `bay-colony`, `bermuda-riviera`.

| Slug | Cluster | Current intent | Recommended action |
|---|---|---|---|
| `boca-raton` | primary | Adjacent Palm Beach County primary city | **Retain** — explicit in Mia service area (`MIA.serviceArea.administrative`) |
| `palm-beach` | primary | Adjacent Palm Beach County primary city | **Retain** — explicit in Mia service area + featured pager |
| `delray-beach` | primary | Adjacent Palm Beach County primary city | **Retain** — explicit in Mia service area + featured pager |
| `victoria-park`, `coral-ridge`, `las-olas-isles`, `harbor-beach`, `rio-vista`, `seven-isles`, `bay-colony`, `bermuda-riviera` | neighborhood | Eastern Fort Lauderdale neighborhood guides | **Retain** — these are Fort Lauderdale sub-neighborhoods, valid SEO + content depth ; do NOT promote past `cluster: "neighborhood"` |
| `lighthouse-point`, `hillsboro-mile`, `sea-ranch-lakes` | northern-broward-waterfront | Adjacent Northern Broward / Hillsboro corridor | **Retain** — geographically valid peers ; do NOT claim Mia exclusively works these |

**No legacy market is recommended for removal this cycle.** SEO continuity argues for retention ; honesty contract is preserved by keeping the cluster taxonomy accurate.

## Comparison-context audit

| Slug | `comparisonContext` claim | Verified? |
|---|---|---|
| fort-lauderdale | Anchor city ; compared against Las Olas Isles, Harbor Beach, Victoria Park, Coral Ridge, Bay Colony, Bermuda Riviera | ✓ neighborhood-enumeration, safe |
| pompano-beach | Relative-value peer ; framed against Lighthouse Point, Hillsboro Mile, Fort Lauderdale, Boca Raton, Delray Beach | ✓ safe |
| Cycle 25 cities | Comparison contexts written in Cycle 25 ; survived Cycle 26 review | ✓ |

## Cross-page consistency check

- **"Concierge" / "white-glove" / "bespoke" / "high-net-worth" / "off-market" / "since 2017" / "within two hours" / "as seen in/on":** `audit-stale-terms.ts` enforces zero hits. Phase 9 will reconfirm.
- **"Best schools" / "good schools" / "safe neighborhood" / "family-friendly" / "kid-friendly" / "bachelor pad":** `audit-stale-terms.ts` enforces zero hits. Phase 9 will reconfirm.
- **"#1 realtor" / "top realtor" / "best realtor" / "guaranteed sale/price":** `audit-stale-terms.ts` enforces zero hits.
- **Spanish / bilingual / fluent claims:** `MIA.unverified.languages = ["English"]` per `src/lib/mia.ts:56`. No marketing language claims English-plus. Phase 9 will reconfirm.

## Crosswalk findings summary

| Outcome | Count |
|---|---|
| Verified, no action | ~70 production claims across 9 cities + homepage + hub |
| Mia-voice phrases left intact | 2 (MeetMia H2 + Markets-hub H1: "most coveted") |
| Soften-or-source recommended (medium) | 1 (FTL FAQ "yachting capital of the world") |
| Required removal | 0 |
| Mia-blocked content decisions | 2 (as above, both "most coveted") |
| Legal-blocked content decisions | 0 (the legal-pages content is separately gated; no city-evidence rows touch it) |

## Phase 7 decision

Two candidate safe fixes were considered:

1. **Soften FTL FAQ "yachting capital of the world"** — a one-sentence textual edit. **Decision: DEFER.** The phrasing is widely used in industry contexts and is not in the audit ban list. Editing it unilaterally without Mia review would alter voice. Mark as Mia-blocked in the gap-closure map.
2. **"Most coveted" in MeetMia + markets hub** — Mia-blocked per `audit-no-fabrications.ts:77-79`. No edit.

**Result: zero production copy edits this cycle.** Cycle 27 is a pure documentation cycle. Phase 7 will reaffirm "no production code edits made."
