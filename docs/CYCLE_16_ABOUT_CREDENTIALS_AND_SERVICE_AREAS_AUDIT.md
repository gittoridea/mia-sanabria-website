# Cycle 16 — About Page Credentials & Service Areas Audit

**Date:** 2026-05-10
**Method:** Read About page, classify each rendered claim, soften UNVERIFIED claims, leave VERIFIED claims untouched.
**Boundary:** No facts were ADDED. Only existing unverified copy was softened.

## Classification table

| Candidate fact | Render location | Source / verification | Disposition |
|---|---|---|---|
| Name "Mia Mary Sanabria" | About body + footer + schema | PUBLIC_FACT_LEDGER §1 | **VERIFIED** — keep |
| Marketing name "Mia Sanabria" | site-wide | PUBLIC_FACT_LEDGER §1 | **VERIFIED** — keep |
| Title "REALTOR®" | About body + footer + schema | PUBLIC_FACT_LEDGER §1 + NAR member cited in §2 | **VERIFIED for display** — keep |
| Brokerage "LPT Realty" / "LPT Realty LLC" | About + footer + Terms | PUBLIC_FACT_LEDGER §1 | **VERIFIED** — keep |
| Phone (954) 540-0358 | About + footer + Privacy + Terms + DMCA + Accessibility | PUBLIC_FACT_LEDGER §1 | **VERIFIED** — keep |
| Email msanabriarea@gmail.com | About + footer + legal pages | PUBLIC_FACT_LEDGER §1 (will swap to branded email post-cutover decision) | **VERIFIED — current canonical** |
| Service area "Eastern Fort Lauderdale, Eastern Boca Raton, Eastern Delray Beach" | About credentials block | PUBLIC_FACT_LEDGER §1 | **VERIFIED** — keep |
| FL License # SL3405877 | Terms (conditional) + Footer (conditional) | PUBLIC_FACT_LEDGER §2 (candidate; DBPR primary-source pending) | **UNVERIFIED but defensible** — keep with caveat |
| "Deliberately small client list each quarter" | AnswerFirst + body paragraph 1 | NOT in PUBLIC_FACT_LEDGER | **UNVERIFIED — REMOVED** ✗ |
| "Personal attention at every showing, every consultation, every closing" | AnswerFirst + body paragraph 1 | not principal-confirmed | **SOFTENED** — replaced with "direct attention from first conversation through closing, with consistent presence at showings, consultations, and the closing table itself" |
| "Brokerage relationships that quietly move desirable residences" | Body paragraph 3 | not principal-confirmed | **SOFTENED** — replaced with "Mia maintains brokerage relationships across Eastern Southeast Florida; access to off-market or quietly-available residences varies by market and timing" |
| Languages: English only | data-only (not rendered on About) | inferred | **UNVERIFIED — not rendered** |
| Designations | data-only (empty array) | unconfirmed | **UNVERIFIED — not rendered** |
| Years licensed | data-only (null) | unconfirmed | **UNVERIFIED — not rendered** |
| "Practicing since X" | conditional render on `experience.since` (currently null → not rendered) | unconfirmed | **UNVERIFIED — not rendered** |
| MLS memberships | not rendered anywhere | unconfirmed | **UNVERIFIED — not rendered** |
| NAR membership | implied via REALTOR® mark display | PUBLIC_FACT_LEDGER §2 cites LPT, Realtor.com, Klein Morgan legacy pages | **PARTIAL** — allowed for member-display per NAR Marks Manual |
| Awards / press / reviews | not rendered | none verified | **UNVERIFIED — not rendered** |
| Testimonials | not rendered | none verified | **UNVERIFIED — not rendered** |

---

## Specific edits

### 1. `ABOUT_FAQ` array (3 FAQs)

**Before (Question 1):**
> "Mia's practice is grounded in long relationships rather than transaction count — a deliberately small client list so every engagement receives direct attention."

**After:**
> "Mia's practice is grounded in long relationships rather than transaction count. Each engagement receives direct attention from first conversation through closing — preparation, current comparable sales, and consistent communication on the residence in question."

**Before (Question 2):**
> "Fort Lauderdale's Las Olas Isles, Harbor Beach, Victoria Park, and Coral Ridge are her home turf."

**After:**
> "Fort Lauderdale's deepwater Eastern neighborhoods — Las Olas Isles, Harbor Beach — alongside in-town markets like Victoria Park and Coral Ridge."

(Removed the "home turf" framing — that's still slightly editorial but not overclaiming; reframed as factual neighborhood list.)

**Before (Question 3):**
> "Buyer representation, seller representation, investment-portfolio acquisition, and selective relocation work. Mia keeps a deliberately small client list so every engagement receives direct attention."

**After:**
> "Buyer representation, seller representation, investment-portfolio acquisition, and selective relocation work. Every engagement begins with a private conversation about timeline, criteria, and the residence in mind."

### 2. AnswerFirst body

**Before:**
> "Mia represents a deliberately small client list each quarter, with personal attention at every showing, every consultation, and every closing."

**After:**
> "Mia represents buyers and sellers across Southeast Florida's luxury and waterfront markets — concentrated in Eastern Fort Lauderdale's deepwater isles and in-town neighborhoods, plus adjacent Boca Raton and Delray Beach."

### 3. Body paragraph 1

**Before:**
> "Her practice is structured around a deliberately small client list each quarter — every engagement receives personal attention, direct access, and full presence at every showing, every consultation, every closing table."

**After:**
> "Her practice is structured around long client relationships — direct attention from first conversation through closing, with consistent presence at showings, consultations, and the closing table itself."

### 4. Body paragraph 2

**Before:** "Every listing is positioned with editorial photography, copywriting, and global distribution."

**After:** "Every listing is positioned with editorial photography, copywriting, and disciplined market preparation."

(Removed "global distribution" — without specific evidence Mia uses a global syndication network beyond standard MLS+IDX, this was an overclaim.)

### 5. Body paragraph 3

**Before:**
> "She knows Fort Lauderdale's deepwater Las Olas Isles, Boca Raton's country-club neighborhoods, and Delray Beach — and the brokerage relationships that quietly move desirable residences across Eastern Southeast Florida."

**After:**
> "She represents actively across Fort Lauderdale's deepwater Las Olas Isles, Boca Raton's country-club neighborhoods, and Delray Beach. Mia maintains brokerage relationships across Eastern Southeast Florida; access to off-market or quietly-available residences varies by market and timing."

### 6. Sections NOT touched

- Hero (image-only, no copy concerns)
- "Three commitments" service philosophy (DISCRETION / RIGOR / RELATIONSHIPS — these describe service posture, not factual claims about Mia's background; left as-is)
- Credentials dl (Title / Brokerage / Practicing since / Service area — all data-driven; `experience.since` null → "Practicing since" auto-omits; safe)
- CTAStrip (call-to-action, no factual claim)

---

## Constraints honored

| Constraint | Result |
|---|---|
| Verified facts only | ✓ — every remaining claim traces to PUBLIC_FACT_LEDGER §1 or is a softened service-process description |
| No fabricated credentials, awards, languages, memberships, license details, or designations | ✓ — none added; designations array stays empty; languages stays at ["English"] data-only |
| No backwards-compatibility shim | ✓ — clean edit |
| No deletion of unused code | ✓ — N/A |
| No new colors, fonts, glassmorphism | ✓ — pure copy edit |

---

## REVIEW items for principal (not Cycle 16 blockers)

1. **Quarterly client-list cap.** If Mia genuinely does cap client load at a specific number per quarter, principal can re-add a more precise claim ("Mia accepts X engagements per quarter" or similar). The current softer language is safer until that number is confirmed in writing.
2. **Global listing distribution.** LPT Realty's listing-distribution network is unknown to this project. If Mia syndicates through Luxury Portfolio International, Christie's International Real Estate, or a comparable luxury network, the "global distribution" language can be restored with a specific named affiliate.
3. **Off-market and quiet inventory.** The softened "access varies by market and timing" language is the canonical disclaimer. If Mia has documented examples of off-market transactions, principal-legal can revisit the strength of the claim.
4. **Service area expansion.** Current canonical is "Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach." If Mia represents elsewhere (Palm Beach proper, Lighthouse Point, Sea Ranch Lakes, Hillsboro Mile), service area can expand — but that's a PUBLIC_FACT_LEDGER §1 update, not an About-page-only edit.

---

## Audit chain integration

A new `audit:about` script (Phase 10) enforces:
- No occurrence of `deliberately small client list` in rendered HTML.
- No occurrence of `global distribution` in rendered HTML (unless explicitly authorized in PUBLIC_FACT_LEDGER §1 — currently not authorized).
- Service area text matches the canonical PUBLIC_FACT_LEDGER §1 entry.
- Designations / awards / years-licensed / languages stay unrendered until principal-data-update.
- License # only renders when `MIA.unverified.licenseNumber` is truthy.

Status taxonomy: PASS · WARN (for PUBLIC_FACT_LEDGER §2 unverified-but-rendered items) · FAIL (for ledger violations).
