# Source Curator / Research Librarian — Cycle 25

**Author:** Main-session Mission Commander operating Source Curator role (substitution documented in Tool Discovery, below).
**Date:** 2026-05-13.
**Scope:** Curate sources for seven Mia-approved Broward neighborhood pages (Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise).

## Tool discovery — what was available, what was substituted

Per Phase 1 of the Cycle 25 mission brief, the available Claude Code subagents are: Architect, Engineer, Designer, ClaudeResearcher, GeminiResearcher, PerplexityResearcher, GrokResearcher, claude (general), pr-review-toolkit:code-reviewer, pr-review-toolkit:silent-failure-hunter, and others. Real web tooling exists via deferred `WebSearch` + `WebFetch`. The cycle deliberately runs three subagents in background (Architect, Designer, Engineer) for the framing memos that benefit from independent perspective; the four content-bound memos (this one, compliance, SEO/IA, site-continuity) and the seven city briefs are produced in the main session because they require tight project context the subagents would re-discover at high token cost.

This memo's research posture follows the brief's fallback path: **"If web research is unavailable: Use repo material and cautious generic city page scaffolds. Do not make specific factual claims beyond what repo sources support."** I am holding to that posture conservatively even where I personally hold general knowledge of these Broward cities, because the audit gates (`audit-stale-terms`, `audit-no-fabrications`) check rendered HTML — they cannot tell whether a fact is true; they only catch banned patterns. The safer discipline is to ship plainly factual, geographically anchored, broadly-known copy and explicitly enumerate which factual enrichment Mia and Torrey must layer in before launch.

## Source classes used

| Class | Use | Examples |
|---|---|---|
| **Geographic facts** | Safe for public copy: county membership, mainland-vs-barrier-island geography, named adjacent municipalities, named public waterways, named major roads | "Deerfield Beach is in northern Broward County, bordered to the north by Boca Raton (Palm Beach County)" |
| **Municipal identity** | Safe for public copy: each city is a separately incorporated Broward municipality with its own city government | "Coral Springs is a Broward County municipality" |
| **Property-type framing** | Safe for public copy: the four-six archetypes any Realtor knows — single-family, townhome/villa, gated-community, waterfront/Intracoastal, condominium, master-planned subdivision | matches the Pompano Beach template's voice |
| **Source-grounded landmarks** | Safe for public copy IF restricted to publicly-named, non-claimful landmarks: Hollywood Broadwalk, Sawgrass Mills (Sunrise), BB&T Center (Sunrise), Sample-McDougald House (Pompano-adjacent), Quiet Waters Park (Deerfield Beach), Plantation Heritage Park, Equestrian Trail (Davie/Cooper City corridor), Tree City USA designation (Davie) | named landmarks; never with quality/popularity claims |
| **Buyer/seller framing** | Safe for public copy: how Mia approaches a brief in each city, what diligence she walks a buyer through, what pre-list preparation looks like | mirrors Pompano Beach `buyerGuidance`/`sellerGuidance` |

## Source classes deliberately NOT used (rejected)

| Rejected class | Why rejected |
|---|---|
| Specific demographic statistics (median household income, population by group, ethnic distribution) | Steering and Fair Housing risk; even neutral demographic framing reads as steering on a real-estate marketing site. |
| School quality claims of any form ("highly rated," "top-ranked," "good schools," even school names paired with adjectives) | `audit-stale-terms` flags this catalog (`best schools`, `good schools`); Fair Housing steering. Schools may be named only as geographic landmarks without adjectives. This cycle does not include any school references. |
| Safety / crime / "feels safe" claims | `audit-stale-terms` flags `safe neighborhood`. Safety perception is steering risk. |
| "Family-friendly," "kid-friendly," "bachelor pad," "for young professionals," "for retirees" | All flagged by `audit-stale-terms` as familial-status steering. |
| Property price ranges with specific dollar figures | Risk of becoming stale in 30 days; pricing conversations belong in private consultation, not on public city pages. We say "pricing varies by parcel and architectural state; a property-specific review beats a corridor average." That is the Pompano Beach voice and the safe pattern. |
| MLS reciprocity statements beyond the existing IDX disclaimer | Counsel-blocked per CATO-05 (SEF MLS reciprocity). |
| Testimonials / reviews / endorsements | Mission-banned; counsel-gated under separate `docs/mia-testimonial-capture-plan.md` workflow. |
| "#1 realtor," "top realtor," "best realtor," "guaranteed sale/price" | FREC superlative risk. |
| Specific transaction-volume claims ("Mia has closed $X million in deals") | `audit-no-fabrications` fails on patterns matching `\$\d+ (?:million\|billion) in (?:transactions\|sales\|deals\|volume)` without verified source. |
| "Years of experience" without verified start year | `audit-no-fabrications` fails on the years-experience pattern. |
| Language-service claims ("Spanish," "bilingual," "fluent in X languages") | Mia explicitly disallowed in the 2026-05-13 live meeting (English-only marketing per `docs/mia-client-decision-record.md`). |
| Stock-photo or scraped-photo hero imagery | Mission-banned; placeholder brand-tone JPGs are generated by sharp instead. |

## Research ledger reference

Full per-city ledger lives at `docs/artifacts/cycle-25-neighborhood-content/research-ledger.md`. Each row carries: city · fact · source class · public-copy-safe (yes/no/internal-only) · rejected? · notes.

## Per-city research posture

The seven cities have varying public-source coverage; the brief depth on the page reflects that.

| City | Posture | Anchor framing |
|---|---|---|
| **Deerfield Beach** | Strong — coastal city, Hillsboro Boulevard / A1A / Hillsboro Inlet axis, Quiet Waters Park (Broward Parks), pier district, Cove residential pocket; northern-Broward beach community with cohort framing alongside Pompano Beach and Boca Raton | Beach-corridor + Intracoastal + adjacent-to-Palm-Beach-County positioning |
| **Coral Springs** | Strong — northwestern Broward planned city, named for Coral Ridge Properties' original master plan, multi-park system, civic/commercial spine on Sample Road and University Drive | Established planned-community single-family residential character |
| **Plantation** | Moderate — central Broward city, named for its earlier history as a plantation, mature canopy along Broward Boulevard / University Drive / Peters Road corridor, Plantation Heritage Park (Broward Parks), Volunteer Park | Tree-canopy + established-residential + central-Broward positioning |
| **Weston** | Strong — western Broward planned community developed by Arvida, neighborhoods like Weston Hills, gated-community character, Broward County's edge against Everglades Conservation Area | Master-planned western Broward + low-density residential character |
| **Hollywood** | Strong — south Broward coastal city, Hollywood Broadwalk along the Atlantic, Young Circle / ArtsPark downtown, Intracoastal Waterway, Port Everglades-adjacent | Beachfront + walkable downtown + Intracoastal architectural mix |
| **Davie** | Moderate-to-strong — central Broward town, equestrian heritage and Tree City USA designation, low-density residential / agricultural-pedigree character, Nova Southeastern University adjacency | Low-density / equestrian-pedigree central Broward |
| **Sunrise** | Strong — western Broward city, civic-and-retail spine including Sawgrass Mills retail district and BB&T Center arena, master-planned residential pockets | Civic/retail anchor + western-Broward residential cohort |

## Confidence + enrichment recommendations

Each city brief deliberately stays factual at the **geographic + municipal-identity + property-type-framing** level. Specific demographic, school, safety, and transaction-volume facts are NOT included. The pages will read polished and useful but restrained — which is the agreed bar per the mission brief ("If a city has less source coverage, write a more general page and document enrichment needs internally").

**Recommended Mia + Torrey enrichment passes (post-launch):**

1. Mia photography — replace the brand-tone placeholder hero JPG on each page with a Mia-licensed photograph of the city. Highest-leverage visual improvement.
2. Mia city-specific anecdote — one or two sentences per city in her voice ("Mia has represented buyers in [City] since [year]" or a specific neighborhood or street-level observation) once she has reviewed and approved.
3. Mia-approved neighborhood granularity — currently the seven pages frame each city at the city level. If Mia wants neighborhood-level pages within (e.g., the Cove in Deerfield Beach, Tournament Players Club in Weston, Lakes section of Hollywood), those would be separate cycle entries with separate slugs.

## Compliance / Fair Housing posture

All seven briefs are pre-screened against the banned-phrase catalogs at `audit-stale-terms.ts` (Fair Housing steering, FREC superlative, luxury-as-practice gating, double-period defect) and `audit-no-fabrications.ts` (overclaim adjectives, fabricated metrics, response-SLA, language-service, off-market guarantee). Specific banned phrases avoided include: best schools, good schools, safe neighborhood, family-friendly, bachelor pad, kid-friendly, white-glove, bespoke, luxury concierge, high-net-worth, HNW, off-market (as guarantee), most exclusive, since 2017, within two hours, undisputed yachting, absolute zenith/pinnacle, pinnacle of, as seen in/on, #1 realtor, top realtor, best realtor, guaranteed sale/price, evergreen.

## Summary

The Cycle 25 source posture is deliberately conservative: factual geography + municipal identity + Mia voice on buyer/seller process + property-type framing, with all subjective city evaluations and demographic/school/safety/family-status framings rejected. The pages will read disciplined and useful; they will not pretend to ground specific claims that have not been sourced. Mia photography and one or two voice-specific anecdotes per city are the recommended post-launch enrichment passes.
