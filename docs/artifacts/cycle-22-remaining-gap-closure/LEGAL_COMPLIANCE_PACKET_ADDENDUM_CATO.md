# Legal/Compliance Packet — Addendum from Cato Review (Cycle 22)

> **Status: ADDENDUM.** 10 Cato-surfaced specificity gaps. None are `critical`; 2 are `high`. All route to Cycle 24-LEGAL-CLOSURE counsel/broker questions.
> Full Cato analysis: `external-reviews/cato-compliance-review.md` + `.json`.
> This addendum sits *next to* the original `LEGAL_COMPLIANCE_PACKET.md` rather than rewriting it — the original packet's questions are already in flight; these are sharpening additions.

## Advisor cross-check note (Cycle 22 LEARN, 2026-05-11)

The Algorithm advisor cross-check (Inference.ts --mode advisor) added the following context to Cato's findings before LEARN sealed:

- **CATO-01 FCC-2024 1:1 status:** the FCC's one-to-one consent rule under 47 CFR §64.1200(a)(10) was **vacated by the 11th Circuit** in *Insurance Marketing Coalition v FCC* (issued Jan 2025). The underlying TCPA prior-express-written-consent framework (47 CFR §64.1200(f)(9)) remains in force, but the specific "one-to-one" addition Cato cites is not currently effective. Cycle 24 counsel question should be rephrased: "TCPA PEWC requirements" not "FCC 2024 one-to-one." The substantive gaps Cato flagged (seller+brokerage in consent string, ATDS/prerecorded disclosure, page-snapshot retention) remain valid TCPA-PEWC concerns regardless of 1:1 status.
- **CATO-02 F.S. 475.278 attaches to advertising.** Spot-check confirmed (Cycle 22 LEARN, live): `LPT Realty LLC` and `License #SL3405877` and REALTOR® mark appear on the live-site footer across all 96 HTML routes. The advertising-disclosure obligation is *substantively met* in production today via the Cycle-17 footer trust-mark upgrade. Cycle 24 counsel question is about LPT-specified statutory language refinement (Single Agent / Transaction Broker / No Brokerage Relationship classification), not about adding missing disclosure. No "verify before next deploy" emergency.

---

## CATO-01 (HIGH) — TCPA FCC-2024 one-to-one mechanics

**Where:** `LEGAL_COMPLIANCE_PACKET.md` §9.1 + `GHL_READY_PACKET.md` §4.
**Gap:** Current proposed consent text omits (a) seller + brokerage legal name *inside* the consent string, (b) ATDS / prerecorded-voice disclosure, (c) page-snapshot retention policy.
**Sharpened question for counsel:**
> "Under the FCC's 2024 one-to-one consent rule for TCPA (specifically the 12 CFR / 47 CFR amendment effective Jan 27 2025), please review and revise: (a) the visible consent string MUST name Mia Sanabria (individual licensee) AND LPT Realty LLC (sponsoring brokerage) explicitly — not 'Mia Sanabria' alone; (b) does the consent need to disclose that contact may use automated telephone dialing systems (ATDS) or prerecorded voice messages, even if Mia personally doesn't use them; (c) what is the retention policy for the page snapshot (visible consent label HTML + URL + timestamp) — store alongside `consent_text` and `consent_timestamp` for litigation defensibility?"

## CATO-02 (HIGH) — Florida brokerage-relationship disclosure

**Where:** `LEGAL_COMPLIANCE_PACKET.md` §4.1.
**Gap:** Generic LPT disclosure question. Florida law has a statutory disclosure family — F.S. §475.278 (brokerage relationships) and FREC Rule 61J2-10.033 (Transaction Broker Notice) — that names specific text variants required when a licensee acts as Single Agent, Transaction Broker, or No Brokerage Relationship.
**Sharpened question for LPT broker-of-record:**
> "Under F.S. §475.278 and FREC Rule 61J2-10.033, what brokerage-relationship classification does LPT Realty designate as default for Mia Sanabria's residential practice (Single Agent / Transaction Broker / No Brokerage Relationship)? Please provide the exact statutory disclosure text LPT requires us to render — both (a) on the site (footer or dedicated page) and (b) within the initial-contact form acknowledgment if any."

## CATO-03 (MEDIUM) — NAR Membership Marks Manual specifics

**Where:** `LEGAL_COMPLIANCE_PACKET.md` §1.2 + `MIA_DECISION_PACKET.md` §9.
**Gap:** REALTOR® mark usage rules beyond capitalization/® — specifically:
- comma adjacency rule ("Mia Sanabria, REALTOR®" not "Mia Sanabria REALTOR®");
- plural and possessive handling (NAR rule: do not pluralize/possessivize the mark; use "REALTOR® members" not "REALTORS'");
- domain-name usage (per current NAR policy, the mark cannot appear in the domain itself except for member-licensee subdomains under specific NAR rules);
- the local-board reference is stale — Realtor® Association of Greater Fort Lauderdale (RAGFL) merged into Broward, Palm Beaches & St. Lucie Realtors (BPSR) in 2020.
**Sharpened question for Mia:**
> "Please confirm active membership in (a) NAR (national), (b) Florida Realtors (state), and (c) Broward, Palm Beaches & St. Lucie Realtors (BPSR) — formerly RAGFL. We'll also audit the site for the comma-adjacency rule and plural/possessive misuse before launch."

## CATO-04 (MEDIUM) — HUD EHO spec specificity + Broward source-of-income

**Where:** `LEGAL_COMPLIANCE_PACKET.md` §2.1.
**Gap:** The current EHO question doesn't bound the answer to HUD spec dimensions.
**Sharpened question for counsel:**
> "Per HUD's EHO display guidance: (a) is the current footer EHO logo render acceptable in terms of relative size/prominence vs. the LPT and REALTOR® logos? (b) Should the site render the EHO logotype, the EHO slogan, or the full Equal Housing Opportunity statement (or all three)? (c) Beyond federal protected classes, Broward County prohibits source-of-income discrimination — should `audit-stale-terms` add source-of-income proxies ('Section 8 not accepted', 'cash only', 'no vouchers') to its banned list?"

## CATO-05 (MEDIUM) — SEF MLS reciprocity scope

**Where:** `LEGAL_COMPLIANCE_PACKET.md` §3.1.
**Gap:** Current question narrows to disclaimer text. Real SEF MLS reciprocity rules typically cover: last-updated timestamp display, per-listing broker attribution (each listing card naming the listing broker), prohibited modifications (don't alter MLS data), co-mingling rules (don't mix MLS data with non-MLS data deceptively), and opt-out obligations.
**Sharpened question for LPT broker-of-record:**
> "Beyond a generic disclaimer, what does SEF MLS require for our iframe IDX usage on (a) last-updated timestamp display, (b) per-listing broker attribution if individual listings are surfaced, (c) prohibited modifications of MLS data, (d) co-mingling with non-MLS content, and (e) opt-out obligations? Is the iframe scope (vs. direct-feed) covered by the same rules?"

## CATO-06 (MEDIUM) — SMS vs email consent mismatch

**Where:** `GHL_READY_PACKET.md` §4 + `GHL_FIELD_MAP_FINAL.md` §3.
**Gap:** Proposed consent text references SMS ("Reply STOP to unsubscribe") but the form may capture email-only addresses. STOP/HELP keyword handling and `sms_opt_out_at` field are not modeled.
**Sharpened spec for next cycle:**
- If form requires phone AND consent applies to SMS: keep STOP language + add `sms_opt_out_at` GHL custom field.
- If phone is optional: split consent into "Email contact OK" + "SMS contact OK (if phone provided)" — two checkboxes.
- Either way, add `sms_opt_out_at` ISO-8601 to GHL custom fields and an audit-log row for STOP/HELP keyword inbound events.

## CATO-07 (LOW) — FL-specific PDF disclaimers

**Where:** `LEGAL_COMPLIANCE_PACKET.md` §10.1.
**Gap:** Generic disclaimer recommendation. Florida-specific items:
- Flood / wind / Citizens insurance currency date (insurance landscape shifts quarterly; checklists should print the "current as of YYYY-MM-DD" date).
- F.S. §718.503 (condominium) and §720.401 (HOA) seller disclosure requirements when checklists touch HOA/condo properties.
- Johnson v Davis (1985) duty-to-disclose obligations for prior storm/hurricane damage when checklists reference inspection items.
**Sharpened question for counsel:**
> "Should the 3 lead-magnet PDFs carry a Florida-specific addendum covering (a) insurance-landscape currency-date disclaimer, (b) F.S. §718.503/§720.401 HOA/condo seller-disclosure references where applicable, (c) Johnson v Davis duty-to-disclose framing for storm/hurricane damage inspection items?"

## CATO-08 (LOW) — DBPR verification depth

**Where:** `LEGAL_COMPLIANCE_PACKET.md` §1.1 + `MIA_DECISION_PACKET.md` §8.
**Gap:** Current step is binary (active y/n). Florida DBPR records also surface (a) employing broker linkage (Mia's record should show LPT Realty as employing broker), (b) license expiration date (FL Sales Associate renews every 24 months; pre-launch we want >6 months to expiration), (c) any disciplinary history.
**Sharpened verification step:**
> When verifying `SL3405877` at the DBPR portal, also record: employing broker = LPT Realty LLC (yes/no), license expiration date, any disciplinary actions. Schedule a renewal-cadence audit (re-check 60 days before expiration).

## CATO-09 (LOW) — audit-stale-terms gap

**Where:** `LEGAL_COMPLIANCE_PACKET.md` §2.1 + §12.1 + `qa-infrastructure-closure.md`.
**Gap:** Current `audit-stale-terms` banned list covers federal-protected-class proxies but misses:
- source-of-income proxies (Broward County local class): "no Section 8", "no vouchers".
- disability proxies: "walk-up only", "must climb stairs", "no service animals".
- HOPA 55+ wording rules ("adults-only" without HOPA registration is illegal; "55+ community" with registration is allowed).
- national-origin proxies ("English-speaking only", "Christian community").
**Cycle 24 candidate:** extend `scripts/audit-stale-terms.ts` `BANNED_TERMS` array. Calibrate against current copy (which is currently clean of these terms per re-grep).

## CATO-10 (LOW) — REALTOR® mark fallback

**Where:** `MIA_DECISION_PACKET.md` §9.
**Gap:** If NAR confirmation isn't received by launch, the site has no fallback render plan.
**Fallback plan to lock in:** if NAR confirmation isn't received by launch -2 weeks, switch every "REALTOR®" usage to "real estate agent" or "Florida licensed sales associate"; remove the REALTOR® logo from footer; ship a single commit `feat(mia-site): conditional-realtor-mark` controlled by an env flag (`MIA_NAR_CONFIRMED=true|false`).

## Disposition rollup

| Severity | Count | Routes to |
|---|---|---|
| critical | 0 | (none) |
| high | 2 | Cycle 24-LEGAL-CLOSURE top of queue (CATO-01 TCPA, CATO-02 Florida brokerage disclosure) |
| medium | 4 | Cycle 24-LEGAL-CLOSURE second batch (CATO-03..06) |
| low | 4 | Cycle 24-LEGAL-CLOSURE polish + Cycle 25-GHL spec inputs (CATO-07..10) |

Per Algorithm v6.4.0 Rule 2a verdict table: `concerns` with no `critical` finding does NOT block `phase: complete`. Findings surfaced; disposition is "iterate at Cycle 24" not "block".
