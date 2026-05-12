# Cato — Cross-Vendor Compliance Review (Cycle 22)

> Reviewer: Cato (GPT-5.4 lineage, Rule 2a auditor). Scope: docs-only audit of three packets.
> Files audited:
> - `MIA_DECISION_PACKET.md` §2.1–2.5, §6, §7, §8, §9
> - `LEGAL_COMPLIANCE_PACKET.md` §1.1, §1.2, §2.1, §3.1, §9.1, §10.1
> - `GHL_READY_PACKET.md` §4, §12
> Out of scope: the site itself, anything outside these files.

## What I'm looking for

Anthropic-family blind spots — categories where a Claude executor + Claude advisor will both rate the recommendation "reasonable" while a domain-specific operator will not. Specifically: Florida statutory specifics (FREC, F.S. 475), FCC TCPA 2024-2025 one-to-one rule, NAR Membership Marks Manual (current), HUD/FHA logo spec sheet, SEF MLS IDX rules of participation, ADA Title III recent FL caselaw.

---

## Findings

### F1 — TCPA "one-to-one consent" missing (FCC 2024-2025 rule)
**File:** `LEGAL_COMPLIANCE_PACKET.md` §9.1 + `GHL_READY_PACKET.md` §4
**Severity:** HIGH

The proposed consent string — *"I agree to be contacted by Mia Sanabria at the phone/email above…"* — names a single seller, which is good, but the surrounding **mechanics** miss the **FCC 2024 Order on Closing the Lead Generator Loophole** (FCC 23-107, finalized rules with effective dates that shifted through 2025; status remains volatile post-11th-Circuit vacatur of one-to-one in *IMC v FCC*, but **best practice is still one-to-one**):

- The consent must be obtained through a **clearly and conspicuously disclosed** interaction where the **single identified seller** is named **at the moment of consent** — a checkbox with text that says "Mia Sanabria" is borderline. A reviewing FL counsel will want the seller's **legal name + brokerage** in the consent string itself, not just the visible page context.
- Consent must be **logically and topically related to the interaction** that prompted it (a valuation form's consent cannot bleed into "any future marketing"). Current consent text says "about my inquiry" — this is good — but the packet does not state that the **same consent record blocks reuse for unrelated campaigns**. A Claude reviewer reads "consent is not a condition of any service" and stops; a TCPA litigator reads it and asks "what about transactional vs marketing carve-outs."
- **Express written consent for autodialed/prerecorded marketing calls and texts** requires the **ESIGN-style attestation** that the consumer is **not required** to consent as a condition of purchase. Your text has this clause — good. But it does not include the **dialer disclosure** ("calls/texts may be made using an automatic telephone dialing system or artificial/prerecorded voice"). If GHL ever sends an SMS broadcast or a power-dial sequence, this omission is the litigation hook.
- **Storage:** §4 stores `consent_text` + `consent_timestamp`, but does not store **the rendered HTML/page snapshot or page URL with version hash**. The TCPA defense burden is on the seller; "I have a timestamp" is weaker than "I have the exact bytes the consumer saw at that timestamp." A Claude-family reviewer treats `consent_text` as sufficient; a TCPA defense attorney does not.

**Recommendation to surface to counsel:** ask specifically about (a) one-to-one identification of Mia + LPT Realty inside the consent string, (b) ATDS/prerecorded-voice disclosure, (c) page-snapshot retention policy, (d) separate consent records for marketing vs. transactional contact.

---

### F2 — Florida statutory disclosure (F.S. 475.278) entirely absent
**File:** `LEGAL_COMPLIANCE_PACKET.md` §4.1
**Severity:** HIGH

Florida is a **brokerage-relationship disclosure** state under **F.S. §475.278**. A residential sales associate's website that solicits buyer or seller inquiries triggers the **No Brokerage Relationship Notice** / **Transaction Broker Notice** / **Single Agent Notice** logic. The packet treats LPT disclosure as a generic "brokerage identity" issue and asks LPT for "any additional disclosure language." That framing misses the statutory hook:

- The default brokerage relationship in Florida is **transaction broker** (per the 2008 amendments removing the presumption requirement, but the **notice** is still required at or before entering into a single agent or no-brokerage-relationship arrangement).
- A site that captures buyer/seller leads via `/contact/` and `/valuation/` is the **first touchpoint** where this disclosure can be referenced. Many FL agents put the **Transaction Broker Notice** language in a `/disclosures/` page or in the lead-form fine print.
- An Anthropic-family advisor will read §4.1's "does LPT require additional disclosure language" and shrug; it will not flag F.S. 475.278 as a **named statute** to ask about. The right question for LPT broker-of-record is: *"Per F.S. §475.278, does LPT require the Transaction Broker Notice (or No Brokerage Relationship Notice) text on the website at the lead-capture point, or only at first in-person meeting?"*

**Recommendation:** add a §4.2 to LEGAL_COMPLIANCE_PACKET specifically naming F.S. §475.278, FREC Rule 61J2-10.033, and the Transaction Broker Notice as the disclosure family to confirm with LPT.

---

### F3 — NAR Membership Marks Manual: incomplete usage audit
**File:** `LEGAL_COMPLIANCE_PACKET.md` §1.2 + `MIA_DECISION_PACKET.md` §9
**Severity:** MEDIUM

§1.2 correctly flags that REALTOR® usage requires active NAR membership, and notes the mark must be capitalized + ®-marked. Two specifics the Claude-family reviewer missed:

- **Spacing/punctuation rule:** Per the NAR Membership Marks Manual, the mark must be **separated from the member's name by punctuation**. "Mia Sanabria, REALTOR®" is correct. "Mia Sanabria REALTOR®" (no comma) is non-compliant. The audit needs to grep for adjacency without separator.
- **Plural / possessive:** "REALTORS®" (plural) and "REALTOR's®" (possessive) have specific rules — the plural form is allowed, the possessive is **discouraged**. Worth a single grep across copy.
- **Domain name use:** A domain like `miasanabriarealtor.com` uses the mark in lower-case unmarked form. NAR generally **permits** unmarked use in domain names (you cannot put ® in a URL), but the Manual asks members to clarify the relationship on the destination page. The footer already does this implicitly; counsel should confirm.
- The packet asks for "written confirmation of NAR + local board membership" — the **local board** is almost certainly **Broward, Palm Beaches & St. Lucie Realtors** (BPSR, merged entity) for an agent covering Fort Lauderdale → Palm Beach → Delray. The packet says "likely Realtor® Association of Greater Fort Lauderdale or similar" — that association was absorbed into BPSR in 2020. This is a minor factual staleness in the packet itself.

---

### F4 — EHO logo: HUD spec compliance not bounded
**File:** `LEGAL_COMPLIANCE_PACKET.md` §2.1
**Severity:** MEDIUM

The packet asks counsel "is the logo + alt text sufficient." It does not bound the question with HUD's actual spec language. The HUD Fair Housing logo spec (24 CFR Part 109, **withdrawn 1996** but still the de facto industry standard, plus the **HUD Advertising Guidelines** that replaced it) addresses:

- **Logo size/prominence relative to other logos.** A common litigation hook is that the EHO logo is rendered substantially smaller than the brokerage logo or the agent's headshot. The packet doesn't ask about relative size.
- **Slogan vs logo vs statement** — there are three accepted forms (the EHO **logotype**, the EHO **slogan** "Equal Housing Opportunity", and the EHO **statement** "We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the Nation…"). For print and "large display advertising" HUD's table recommends specific forms; for websites HUD has not issued a clean rule, which is exactly why counsel should be asked **whether the slogan alone (alt text) is sufficient or whether the full statement should appear in `/accessibility/` or `/fair-housing/`**.
- **Familial status, disability, source-of-income** — Florida adds **no** statewide source-of-income protected class, but **Broward County** (Mia's primary market) **does** prohibit source-of-income discrimination under the Broward Human Rights Ordinance, and **Miami-Dade** has similar local protections. A site marketing across Broward/Palm Beach should be audited against local protected classes, not only the federal seven. The `audit-stale-terms` list in §2.1 covers federal proxies but does not list source-of-income proxies ("no Section 8", "no vouchers", "professionals only", "verifiable employment income"). This is a Claude-family blind spot — federal-class focus, county-class miss.

---

### F5 — SEF MLS IDX: the disclaimer is only one of ~6 IDX rule obligations
**File:** `LEGAL_COMPLIANCE_PACKET.md` §3.1
**Severity:** MEDIUM

The packet narrowly asks LPT for "the exact SEF MLS broker-reciprocity disclaimer." That's one obligation. SEF MLS (Southeast Florida Regional MLS, operating through MIAMI Association of REALTORS + Beaches MLS) IDX Rules of Participation typically also require:

- **Last-updated timestamp** for the displayed data (must be visible per the rules).
- **Attribution to the listing broker** on each listing detail view ("Listing courtesy of …").
- **Source attribution** ("Information provided by SEF MLS" or equivalent — the consortium has a specific name to use).
- **Prohibited modifications** to listing data (price, address, photos cannot be altered without listing-broker permission).
- **Co-mingling rules** — IDX listings cannot be displayed alongside non-MLS listings (e.g., scraped Zillow data) without clear separation.
- **Opt-out compliance** — listing brokers can opt out of IDX display; the consuming site must honor the daily-feed opt-out flag.

Since this site uses an **iframe** to the SEF Matrix portal (`sef.mlsmatrix.com`), most of these are inherited from the iframe's own compliance posture — and that's a defensible stance — but the packet should explicitly ask LPT: *"Because we render the SEF Matrix IDX as an iframe (not a direct VOW/IDX data feed), confirm that no additional disclaimer or attribution is required outside the iframe boundary. If LPT wires a direct IDX feed later, the obligations expand."*

Without that bounding question, the launch can ship with a generic disclaimer that becomes wrong the day a real IDX feed replaces the iframe.

---

### F6 — TCPA consent: "Reply STOP to unsubscribe" implies SMS but checkbox doesn't gate SMS specifically
**File:** `GHL_READY_PACKET.md` §4
**Severity:** MEDIUM

The consent string contains "Reply STOP to unsubscribe" — that's an SMS-channel artifact. But the form may capture **only email** for some submissions (a user can leave phone blank if it's not required). Three implications a Claude-family reviewer misses:

- If phone is **optional** on the form, the user who submits email-only still ticks a consent that references SMS — that's misleading and the FCC has fined for this exact mismatch.
- If phone **is** required, then the consent should say so explicitly *and* the form copy at the phone field should warn that providing the number authorizes SMS.
- The **STOP keyword** must actually be wired in GHL's SMS handler. The packet doesn't list "STOP/HELP keyword handling" in §3 custom fields or §8 audit log. Adding `sms_opt_out_at` and `sms_opt_out_source` as audit fields is the durable fix.

---

### F7 — PDF lead-magnet disclaimers: missing Florida-specific items
**File:** `LEGAL_COMPLIANCE_PACKET.md` §10.1
**Severity:** LOW–MEDIUM

The packet's proposed disclaimer covers (a) general guidance not advice, (b) retain licensed professionals, (c) Mia's role as REALTOR® not legal/tax/insurance. Three Florida-specific additions a Claude-family reviewer will not surface:

- **Flood zone / wind mitigation / 4-point inspection** language in a "Waterfront Buyer Due Diligence Checklist" should disclaim that flood-zone determinations are made by FEMA and the **Citizens Property Insurance Corporation** (Florida's insurer of last resort) underwriting rules change frequently. The PDF will go stale fast; a disclaimer should include a **"current as of YYYY-MM"** date.
- **Condo/HOA disclosure (F.S. §718.503 / §720.401)** — any seller-side checklist that touches condo or HOA properties should mention the statutory disclosure obligations. A "Luxury Seller Pre-Listing Checklist" without this reference is a soft miss.
- **Hurricane / loss disclosure** — Florida sellers have a duty to disclose known material defects including prior flood/storm damage (per *Johnson v Davis*). A pre-listing checklist not mentioning this is incomplete from a Florida-practice standpoint.

These are not "site must not launch" items — they're "the PDFs read as generic and could be Florida-specific without much work."

---

### F8 — License display: DBPR verification step under-specified
**File:** `MIA_DECISION_PACKET.md` §8 + `LEGAL_COMPLIANCE_PACKET.md` §1.1
**Severity:** LOW

The verification step in §1.1 says "look up SL3405877 at https://www.myfloridalicense.com/wl11.asp." Two refinements:

- The DBPR portal returns **license status** (Active / Inactive / Null and Void), **expiration date**, **license type** (Sales Associate vs Broker), and **employing broker**. The verification should record **all four** in the repo, not only "active yes/no." A Claude reviewer treats "active" as the binary; the broker linkage is the operationally important field — if Mia switches brokerages later, the site must update LPT references.
- **License expiration cadence** — FL real estate licenses renew every 24 months with a 14-hour CE requirement (45 hours post-licensing for the first renewal). The site should have an **audit reminder** keyed to the expiration date, not just verify once. This is a process item, not a counsel item.

---

### F9 — `audit-stale-terms` Fair Housing list: federal-only, missing FL/county-level proxies
**File:** `LEGAL_COMPLIANCE_PACKET.md` §2.1 + §12.1
**Severity:** LOW

The audit blocks "best schools / good schools / safe neighborhood / family-friendly / bachelor pad / kid-friendly." That's a solid federal-proxy list. Florida-specific or county-specific additions to consider:

- **Age-restricted communities** — FL has many 55+ communities (legitimate under HOPA exemption). Marketing copy that references "active adult" or "55+" needs the HOPA disclaimer; copy that says "no children" or "adults only" is a violation. Worth a grep.
- **Source-of-income** — see F4. Add "no Section 8 / vouchers / housing assistance" to the blocked list for Broward-county coverage.
- **Disability proxies** — "walk-up", "must climb stairs", "not wheelchair accessible" can be disability proxies. The current list does not capture these.
- **National origin proxies** — "English-speaking community", "Christian neighborhood", "Jewish community" — none of these likely appear, but the list doesn't enforce against them.

A Claude-family reviewer will rate the current list "good enough." A FH compliance officer will flag the gaps.

---

### F10 — `MIA_DECISION_PACKET.md` §9: REALTOR® mark gated on NAR confirmation but rollout doesn't have a fallback
**File:** `MIA_DECISION_PACKET.md` §9
**Severity:** LOW

Row 2 says "Keep REALTOR® R logo — Recommended but requires NAR membership written confirmation." If confirmation is **not** obtained before launch, the packet does not specify the **alternate footer rendering** (LPT logo only? Strip the R logo and replace REALTOR® with "real estate agent" in copy?). Add an explicit "if NAR confirmation is not in hand at launch, the footer reverts to: <exact alt layout>" — otherwise launch-day risk is a copy-paste scramble.

---

## Cross-vendor blind spots surfaced

1. **Federal vs state vs county compliance stacking** — Anthropic-family review tends to satisfy at the federal layer and stop (TCPA federal rule, HUD federal logo, federal Fair Housing classes). Florida statutory layer (F.S. 475.278, Johnson v Davis duty to disclose) and county layer (Broward source-of-income) get skipped.
2. **Statute-named questions vs paraphrased questions** — the packets ask counsel "what should we do about X" rather than "per [named statute/rule], what is required." Statute-named questions get cleaner counsel responses and lower legal-hour spend.
3. **Process completeness vs durable audit** — license verification, NAR confirmation, MLS reciprocity are treated as one-time-at-launch items. None have a renewal/audit cadence. A Claude reviewer doesn't flag the missing cadence because the "launch checklist" framing absorbs the attention.
4. **TCPA storage discipline** — `consent_text` + `consent_timestamp` is the obvious Claude-shaped data model. A TCPA-defensible model also stores page snapshot, IP, user-agent, consent-version hash, and channel-specific consent records. Same-family review will not push for the harder schema.
5. **Mark-usage mechanics (NAR Manual specifics)** — adjacency punctuation, plural/possessive, domain-name usage — these are NAR Manual specifics that don't surface from general-knowledge LLM review.

---

## Agreement with Advisor

Partial. The advisor verdict (not directly reviewed here — Cato sees only the artifacts) almost certainly green-lights these three packets as "well-scoped, no source edits, ready for principal/counsel review." That's defensible. The findings above are **additions** to surface to counsel + Mia, not rejections of the packets' framing.

---

## Verdict

**concerns** — the three packets are well-structured docs-only artifacts and do not need to be rewritten, but launch should not proceed until at least F1 (TCPA one-to-one + ATDS disclosure + snapshot retention), F2 (F.S. §475.278 transaction-broker notice), F4 (county-level Fair Housing classes), and F6 (SMS-channel consent mismatch) are answered by counsel. F3, F5, F7–F10 are quality improvements to the questions asked of counsel, not blockers.
