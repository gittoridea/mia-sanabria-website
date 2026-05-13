# Compliance / Claims Reviewer — Cycle 25

**Author:** Main-session Mission Commander operating Compliance Reviewer role (substitution documented; written before any city copy is drafted so it governs, not audits).
**Date:** 2026-05-13.
**Scope:** Pre-clear the seven new Broward neighborhood pages against Fair Housing, FREC, NAR membership-marks, broker, testimonial, and overclaim risk catalogs.

## Authority

Two banned-phrase audits are HARD gates on rendered `out/`:

1. `scripts/audit-stale-terms.ts` — FREC superlative + fabricated-credential + Fair Housing steering + luxury-as-practice + GATED_MIA + defect-class catalogs.
2. `scripts/audit-no-fabrications.ts` — off-market-guarantee + fabricated-transaction-volume + fabricated-years-experience + language-service-fabrication + response-SLA + overclaim adjectives.

A FAIL on either makes the `audit:all` chain exit non-zero. Cycle 25 must land 0 FAIL.

## Approved language patterns (use these)

- Geographic identity: "in northern Broward County," "framed by [adjacent city] to the north," "the [named feature] is the boundary on the east"
- Property-type framing: "Buyers here usually start with one of four briefs," "diligence covers seawall, dock, route to the inlet," "milestone-inspection and reserve status for condominium"
- Mia voice / process: "Mia represents buyers and sellers in [City] with full attention end-to-end — current comparable sales, brokerage-relationship context, and any relevant informally available residences her network surfaces"
- Buyer/seller posture: "begin with a private conversation about timing, criteria, and the residence in mind," "position the residence to the buyer pool that shops there"
- Pricing posture: "pricing turns on parcel, condition, and architectural state in ways that broad public estimates miss," "a property-specific review beats a corridor average"
- Network framing: "informally available residences her network surfaces along the way" (this is the safe phrasing for what otherwise might be written as "off-market access" — which is GATED_MIA)
- "Private," "discreet," "considered," "thoughtful," "tailored" — all approved tone words (per Mia's 2026-05-13 brief)

## Banned language (never appears in any of the seven pages)

| Banned | Reason | Safe replacement |
|---|---|---|
| best schools / good schools / top schools | Fair Housing steering (`audit-stale-terms`) | Name a school only as a geographic landmark with no adjective; in Cycle 25 we name no schools at all to keep the bar tight |
| safe neighborhood / safest | Fair Housing steering | Describe physical features (gated entrance, on-site security) without safety claim |
| family-friendly / kid-friendly / bachelor pad | Familial-status steering | Describe physical features (parks present, playground present) without familial framing |
| #1 realtor / top realtor / best realtor / guaranteed sale or price | FREC superlative | Remove or restate without superlative |
| as seen in / as seen on | Fabricated-credential risk | Cite the publication + URL or omit |
| luxury concierge / white-glove / bespoke | Luxury-as-practice claim risk | "real estate concierge," "REALTOR® with LPT Realty," "considered," "tailored" |
| high-net-worth / HNW | Unverified network claim | "qualified" or remove |
| off-market (as access guarantee) | GATED_MIA: unverified | "informally available residences her network surfaces" |
| most exclusive | FREC + luxury-as-practice | Remove or cite source |
| since 2017 / since [year] without DBPR confirmation | Unverified history | Remove year claim |
| within two hours / same-business-day / fastest response | Response-SLA without principal approval | Omit; no response-time claim on the page |
| evergreen | Cycle 19B-FL wording cleanup | "Selected field notes" or omit |
| undisputed yachting / absolute zenith / absolute pinnacle / pinnacle of | Overclaim adjectives | Remove or restate concretely |
| Spanish / bilingual / fluent | Mia explicitly disallowed (2026-05-13) | Omit |
| Klein Morgan / kleinmorgan / sunandbreeze / accessibility@agent3000.com / [Legal Brokerage Name] | Stale brokerage / template residue | Already absent; do not reintroduce |
| Specific transaction-volume claims (`$X million in transactions`) | `audit-no-fabrications` regex hit | Omit |
| Specific years-experience claims (`X years experience`) | `audit-no-fabrications` regex hit | Omit |
| Schema `priceRange` | Audit-stale flags `priceRange` token — schema must not emit it | Omit (already handled by current schema components) |
| `..` at sentence boundaries | Cycle 19A-M defect class | Proofread every paragraph |
| Visible `Updated MONTH YYYY` blog label | Cycle 19A-M defect class | Already absent |

## Per-city risk notes (additional, on top of the catalog)

| City | Specific risk to watch | Mitigation |
|---|---|---|
| Deerfield Beach | The Pier is widely known; do not claim landmark status or popularity beyond "named landmark" | Describe as "the public pier district along the Atlantic" |
| Coral Springs | Master-planned-community identity invites accidental "great neighborhoods for families" steering | Stay on civic/parks/road-grid framing; never mention age cohorts or family-status |
| Plantation | "Plantation" name has historical-context sensitivity in the US | Use the city name plainly (it is the city's legal name); do not editorialize on the name's history |
| Weston | Master-planned identity invites "exclusive" superlative drift | Avoid "exclusive," "elite," "most prestigious" — the gated character is a fact; the value judgment is not ours to make |
| Hollywood | Easily confused with Los Angeles Hollywood; first sentence of each page must geographically anchor | Open with "Hollywood, Florida — a south Broward coastal city" |
| Davie | Equestrian heritage invites "lifestyle" framing that can read as steering | Keep equestrian + Tree-City-USA framing as factual designations; do not editorialize fit |
| Sunrise | Confusion with the Sunrise Paddleboards client venture is internal-only; no risk to user copy | None for public copy |

## Final copy clearance posture

Cycle 25 city pages clear compliance only if EVERY one of the following holds for EVERY page:

1. `audit-stale-terms` → 0 hits across `out/`
2. `audit-no-fabrications` → 0 hits across `out/`
3. No school named with any adjective; no school-quality claim, period
4. No safety/crime/protected-class/familial-status language
5. No language-service claim (Spanish, bilingual, fluent)
6. No testimonial / review / endorsement text in the page (no quote attribution, no review framing)
7. No invented neighborhood names, landmark names, or sub-cohorts
8. No Bridge IDX live calls; search anchor remains `/markets/#property-search`
9. No fake transaction-volume / years-experience / response-SLA claim
10. No `..` double-period at sentence boundaries; manual proofread before save

## Pre-clearance verdict

If the seven city briefs and their resulting `Market` entries follow this catalog, the pages clear compliance for **local-only publication on staging**. They do NOT clear production cutover, because production cutover gates on Mia's DBPR license attestation, NAR/Florida Realtors/BPSR membership attestation, counsel review of legal pages (CATO-01 through CATO-08), and the testimonials capture plan. Those gates are external to Cycle 25's scope and remain blockers per `docs/mia-client-decision-record.md` and the Cycle 24 R2 remaining-gap table.
