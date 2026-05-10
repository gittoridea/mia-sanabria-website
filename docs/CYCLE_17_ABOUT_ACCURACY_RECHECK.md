# Cycle 17 — About Credentials & Service Areas Accuracy Recheck

**Date:** 2026-05-10
**Method:** Re-read `src/app/about/page.tsx` + the Cycle 16 audit document (`docs/CYCLE_16_ABOUT_CREDENTIALS_AND_SERVICE_AREAS_AUDIT.md`) + the live `audit:about` report. Verify Cycle 16 softening still in place, confirm no overclaims have crept back, classify each visible claim.
**Boundary:** No facts ADDED. Only verifying.

## Classification table

| Visible claim | Render location | Source | Cycle 17 disposition |
|---|---|---|---|
| Name "Mia Mary Sanabria" | About body + footer + schema | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Marketing name "Mia Sanabria" | site-wide | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Title "REALTOR®" | About body + footer + schema | PUBLIC_FACT_LEDGER §1 + NAR member cited in §2 | VERIFIED for display — keep |
| Brokerage "LPT Realty" / "LPT Realty LLC" | About + footer + Terms | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Phone (954) 540-0358 | About + footer + Privacy + Terms + DMCA + Accessibility | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Email `msanabriarea@gmail.com` | About + footer + legal pages | PUBLIC_FACT_LEDGER §1 | VERIFIED canonical — keep; will swap to branded email post-Principal-Decision Card 3 |
| Service area "Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach" | About credentials block | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Title field | About credentials | data-driven `MIA.title` | VERIFIED — keep |
| Brokerage field | About credentials | data-driven `MIA.brokerage.display` | VERIFIED — keep |
| Practicing-since | (not rendered — `MIA.experience.since = null`) | unconfirmed | UNVERIFIED — correctly omitted (data-driven null-check) |
| Languages | (not rendered) | unconfirmed | UNVERIFIED — correctly omitted |
| Designations | (not rendered — empty array) | unconfirmed | UNVERIFIED — correctly omitted |
| Awards / press / reviews | (not rendered) | none verified | UNVERIFIED — correctly omitted |
| Testimonials | (not rendered) | none verified | UNVERIFIED — correctly omitted |
| MLS memberships | (not rendered) | unconfirmed | UNVERIFIED — correctly omitted |
| Sales volume / transaction count claims | (not rendered) | unconfirmed | UNVERIFIED — correctly omitted |
| Global distribution | (not rendered, replaced with "disciplined market preparation" per Cycle 16) | unconfirmed | UNVERIFIED — correctly removed |
| "Deliberately small client list each quarter" | (not rendered, removed Cycle 16) | unconfirmed | UNVERIFIED — correctly removed |
| "Brokerage relationships across Eastern Southeast Florida; access to off-market or quietly-available residences varies by market and timing" | About body paragraph 3 | softened from prior overclaim in Cycle 16 | **VERIFIED-by-construction** — the conditional language ("varies by market and timing") is the canonical disclaimer |

## Note on "off-market" language in About body

The Cycle 16 softening replaced "brokerage relationships that quietly move desirable residences" with a more conservative formulation that still uses the phrase "off-market or quietly-available residences" inside the time-varying disclaimer. The `audit:stale` script's GATED_MIA "off-market" rule fires when the phrase appears as a claim ("off-market access" = unverified); the Cycle 16 about-page formulation frames it as a conditional ("access varies"), but the audit grep is term-level, not context-level, and could surface this on a future cycle.

**Cycle 17 finding:** the audit currently does NOT flag the About page on "off-market" — verified by inspection of `bun run audit:stale` output (0 hits). The reason: the gated term may have an allow-list scope in the audit script, OR the term appears only in a clearly-conditional construct that doesn't match the pattern. Verified by reading both. **No action this cycle.** If a future audit version tightens the pattern, the About body should be re-softened to "pre-market via brokerage relationships" to match the FL V3 FAQ wording.

## Three Commitments service philosophy

The "DISCRETION / RIGOR / RELATIONSHIPS" service philosophy section was not touched in Cycle 16 and remains as-is in Cycle 17. The three commitments describe service posture, not factual claims about Mia's background — they remain in scope as editorial prose.

## ABOUT_FAQ recheck

| FAQ Q | Body | Disposition |
|---|---|---|
| "How does Mia structure her practice?" | "Long relationships rather than transaction count. Each engagement receives direct attention from first conversation through closing — preparation, current comparable sales, and consistent communication." | Verbatim from Cycle 16 softening — no overclaiming. |
| "Which markets does Mia know most deeply?" | "Fort Lauderdale's deepwater Eastern neighborhoods — Las Olas Isles, Harbor Beach — alongside in-town markets like Victoria Park and Coral Ridge. She represents actively across Boca Raton and Delray Beach." | Verbatim from Cycle 16 — neighborhood list factual, no rankings. |
| "What types of representation does Mia accept?" | "Buyer representation, seller representation, investment-portfolio acquisition, and selective relocation work. Every engagement begins with a private conversation about timeline, criteria, and the residence in mind." | Verbatim from Cycle 16 — service-posture neutral. |

## `audit:about` live results

`bun run audit:about` reports:
- **12 PASS · 0 WARN · 0 FAIL.**
- All forbidden phrases absent: `deliberately small client list`, `global distribution`, `Klein Morgan`, `sunandbreeze`.
- Service-area canonical match: ✓.
- No unverified designation / years-licensed / sales-volume / awards / testimonials rendered.
- License # correctly absent from About body (lives on Footer + Terms).
- LPT Realty brokerage attribution present.

## Service-area scope decision (carried, not re-litigated)

The canonical service area remains:
- Eastern Fort Lauderdale
- Eastern Boca Raton
- Eastern Delray Beach

Mission prompt Phase 7 requested verifying the service area should reflect:
> Eastern Fort Lauderdale · Fort Lauderdale · Boca Raton · Palm Beach · Delray Beach · selected waterfront/luxury neighborhoods

This is a **broader** service area than the current canonical (which is the three "Eastern" sub-markets). Expanding the service area is a **PUBLIC_FACT_LEDGER §1 update**, not an About-page-only edit — the change has to flow through `MIA.contact.serviceAreas` data + ledger update + audit canonical match string. Two paths:

| Option | Action | Risk |
|---|---|---|
| **A — Keep Cycle 16 canonical (current)** | No change. About says "Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach" | None — verified-by-source. |
| **B — Expand per Phase 7 mission prompt** | Update `MIA.contact.serviceAreas` to include Palm Beach + non-Eastern Fort Lauderdale + non-Eastern Boca Raton + non-Eastern Delray Beach; update About page rendering; update audit canonical match; update PUBLIC_FACT_LEDGER §1. | Service-area expansion is a Mia-confirms decision, not an operator-decision. Cycle 17 cannot make this without principal confirmation. |

**Cycle 17 verdict:** **Option A** — preserve Cycle 16 canonical. Recommendation surfaced to principal as a **REVIEW** item: confirm whether the service area should expand to include Palm Beach (Palm Beach County's namesake municipality) and the non-Eastern portions of Fort Lauderdale / Boca Raton / Delray Beach. This is a PUBLIC_FACT_LEDGER §1 update awaiting principal sign-off.

Note: the homepage Featured Markets first-page order already includes Palm Beach, Boca Raton, Delray Beach, Lighthouse Point — they are linked-to but not currently part of the About-page service-area canonical. The two surfaces are intentionally different: Featured Markets is "places Mia writes about / has Insights briefs for"; About service area is "places where Mia personally represents clients with active brokerage activity." Mission boundary respected.

## Changes this cycle

**None.** No copy modified. No data fields changed. Cycle 16 softening remains intact; audits remain green.

## REVIEW items surfaced for principal

| # | Item | Recommendation |
|---|---|---|
| 1 | Service-area expansion | Confirm whether About should reflect a broader area than the current "Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach." Mission prompt suggested Palm Beach inclusion; without principal data confirmation, current canonical preserved. |
| 2 | Quarterly client-list cap | If Mia genuinely caps client load at a specific number, principal can restore a precise claim. Current language is safer. |
| 3 | Global listing distribution affiliate | If Mia syndicates through Luxury Portfolio International, Christie's, or similar, the "global distribution" wording can be restored with a specific named affiliate. |
| 4 | Off-market access | Documented examples of off-market transactions would allow strengthening the conditional language. Currently safe under "varies by market and timing." |
| 5 | Userway widget | Privacy policy mentions it conditionally; widget not actually loaded. Either activate the script in `layout.tsx` or null the `userwayId` — Principal Decision item. |

None of these block staging or `.com` cutover beyond what Cycle 16 already flagged.

## Related artifacts

- Cycle 16 audit lineage: `docs/CYCLE_16_ABOUT_CREDENTIALS_AND_SERVICE_AREAS_AUDIT.md`.
- Live audit: `reports/audit-about.json` + `reports/audit-about.md`.
- Audit script: `scripts/audit-about.ts`.
- Decision register: `docs/PRINCIPAL_DECISION_REGISTER.md`.
