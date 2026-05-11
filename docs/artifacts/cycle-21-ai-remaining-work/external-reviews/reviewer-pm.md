# PM Verifier Review — Cycle 21-AI-REMAINING-WORK

**Reviewer:** Product Manager (external, fresh context)
**Date:** 2026-05-11
**Inputs:** `final-synthesis.md`, `issue-matrix.md`, team reports 2/3/4/8 skimmed
**Lens:** business outcomes, lead-gen, conversion, luxury brand risk

---

## 1. Is the P0/P1 ranking correct?

**Mostly yes — but two P1s are over-graded as compliance plays when they're actually conversion plays, and two P2s deserve a P1 bump.**

### P0 = 0 — agree
Staging-noindex GREEN. No site-breaking defect. Correct call.

### P1 review (6 items)

| ID | Synthesis grade | My grade | Rationale |
|---|---|---|---|
| A1 thank-you "same business day" | P1 (compliance) | **P1 — keep**, but reframe | Right grade, wrong reason. This is a *liability* fix (Mia commits to an SLA she won't honor on weekends), not a generic doctrine ding. Sell it to Mia as "stops a discoverable broken promise," not "doctrine says so." |
| A2 insight FAQPage schema | P1 | **P2** | AEO/SEO upside is real, but not revenue-shaping in 90 days. Schema gains compound slowly. Pre-launch site has no SEO authority anyway. |
| A3 market FAQPage schema | P1 | **P2** | Same as A2. Defer-not-skip. |
| A4 double FAQPage dedupe | P1 (Google warning) | **P1 — keep** | Schema errors on 5 hub pages WILL eventually nuke rich-result eligibility. Cheap to fix. |
| A5 MarketCard alt | P1 (a11y) | **P2** | Curated alt strings exist; wiring is mechanical. But "luxury real estate" alt is not failing WCAG — it's just generic. Defer-friendly. |
| A7/A8/A9/A10 IDX wrapper | P1 | **P1 — promote to #1** | **This is the only P1 with direct lead-gen impact.** Every IDX-engaged visitor today is a lead that walks to sef.mlsmatrix.com. Wrapper CTA captures intent at the highest-friction moment in the funnel. |

### P2s that should be P1

- **B1 / T4-01 — Homepage H1 drift across 4 files.** Currently grouped as "needs principal direction" → defer. But the H1 currently names *Pompano Beach* (per `page.tsx:84`) — a market Mia doesn't anchor her brand on. Hero.tsx's `<wbr>` mobile-soft-break is silently broken. This is the single most-trafficked surface and it's confused. **Bump to P1 — pre-launch blocker.** Cost to defer: every visit between now and `.com` cutover lands on an H1 that doesn't match Mia's actual ICP.
- **T4-13 / contact-page "Three private paths" → 4 ContactRow items.** Counted P1 by Team 4, doesn't appear in synthesis Tier A (?). **This is a credibility defect on a high-intent page.** A luxury buyer who counts will notice. 1-line fix.

### P1s that are actually P2

- A2 + A3 + A5 as noted above. Move to "ship in cycle but don't headline."

---

## 2. The Top-5 sequence — if Mia could only ship 5

Optimizing for **lead-gen + conversion + brand integrity at launch**, in priority order:

1. **A7/A8/A9/A10 — IDX wrapper bundle** (IdxEmbed.tsx + contact/valuation hidden source fields). Single highest-leverage item. Captures lead intent at the funnel point where it's currently leaking 100%. Ships without GHL.
2. **A1 — Remove thank-you response-time promise** (`src/app/thank-you/page.tsx:46`). Liability + honesty. 1-line. Ship first because it's a strict honesty-contract fix.
3. **B1-PROMOTED — Homepage H1 + Hero `<wbr>` + site.ts + mia.ts canonical alignment** (4 files). Needs Mia's 30-second confirmation of the canonical triad, then a single coordinated edit. Mobile hero is silently broken right now.
4. **A12 — Add /insights/ to primary NAV** (`src/lib/site.ts`). The strongest organic-trust surface (12 luxury briefs) is currently footer-only. Insights are what move a luxury buyer from "found her" to "she sounds like the one." 1-line array addition.
5. **A6 — PDF `download` attribute + `(PDF)` marker** (`FortLauderdaleV2.tsx:826-849`) **OR** A11 contact submit min-h-[44px]. Either is a small UX/trust fix on a high-intent page. Pick A6 — luxury buyers downloading dock-diligence PDFs on mobile is the exact moment trust forms.

**Items I'd cut from top-5 even though they're in synthesis:**
- A2/A3 (FAQPage schema) — important but not 90-day lead-shifting
- A4 (FAQPage dedupe) — schema-clean, but invisible to Mia and visitors
- A14/A15/A16/A17 (audits + cutover infra) — should ship, but they are *engineering* wins, not *product* wins. Don't crowd the visible-impact list.

---

## 3. Hidden risk — what Mia or LPT brokerage might push back on

### LIKELY pushback (HIGH confidence)

- **B2 — miaQuote rewrites on Boca / Palm Beach / Delray / Lighthouse Point.** Team 4 wants to strip "absolute zenith," "absolute pinnacle," "ultimate sanctuary," "perfectly captures the essence." **Mia may have written or signed off on these herself.** Luxury realtors are often attached to the very prose that reads as purple from outside. Send all 4 proposed replacements as a single batch with rationale ("voice consistency with Fort Lauderdale miaQuote"). Don't ship without explicit batch-approval.
- **A8 — IDX after-iframe handoff CTA.** This is a *behavioral nudge* that didn't exist before. LPT brokerage compliance may want to review the CTA copy ("Open search in new tab" + handoff card). Specifically: any text that implies a buyer relationship is forming via the CTA could trigger the brokerage-relationship-not-formed disclaimer requirement. **Mitigation:** keep the CTA copy purely informational ("Discuss what you found with Mia") and verify the existing Terms-page brokerage-relationship language covers it.
- **A12 — /insights/ in primary NAV.** Visual change to the global header on every page. The header is brand-critical. Mia or her stylist may want sign-off on nav-bar length or label phrasing ("Insights" vs "Private Insights" vs "Library").

### LOOKS-SAFE-BUT-COULD-SURPRISE

- **A10 — IDX in-page disclaimer.** Adds a one-line "deemed reliable… Matrix MLS." note under the iframe. **Risk:** if LPT's IDX participation agreement with SEF MLS has a specific reciprocity statement they want displayed verbatim (e.g. naming the broker-of-record), our generic text could conflict. Team 8's R3 flagged this as needs-brokerage. **Recommendation:** ship the disclaimer with the safest superset of language, but flag for LPT review BEFORE `.com` cutover.
- **A9 — Hidden source attribution fields on forms.** Reads as "dormant scaffolding." **But** the `<Script>` tag that stamps these from URL params is a behavioral addition. If Mia's privacy stance is strict, she may object to *any* URL-param reading even when not transmitted. Low risk — disclose in commit message.
- **A18 — Drop /404/ canonical.** Mechanical fix. But there's a *non-zero* risk a search engine has already indexed `/404/` URL and removing the canonical changes what they see. Pre-launch, this is fine.

### SHOULD NOT SURPRISE BUT WORTH NAMING

- **Cutover infrastructure work (A14/A15/A16/A17)** is invisible to Mia. She won't push back because she won't see it. **But** if she's billing-sensitive or perceives a slow cycle as "engineers padding scope," a cycle that ships 4 audits + 1 runbook *and only 13 visible fixes* could read as engineering-heavy. Frame the cycle to Mia as "13 site improvements + we built the safety nets that prevent regressions before launch."

---

## 4. Missing items the 10 teams didn't flag

**Count: 5 missing items I'd add to the matrix.**

1. **MISSING-1 — Phone-tap tracking gap is unmeasured pre-launch.** Team 2 noted `tel:+19545400358` rings personal cell on 11 surfaces with NO observability. Deferred to "Cycle 21-CALL-TRACKING." **PM concern:** for a luxury realtor, the phone call IS the conversion. Going to `.com` without ANY call attribution is shipping blind on the highest-value channel. At minimum: a documented baseline ("we will not know which surface drove which call until [date]") should be in the readiness register, not a future cycle.
2. **MISSING-2 — Email-sender reputation for `msanabriarea@gmail.com`.** Forms are mailto-only. Every lead lands in a Gmail inbox shared with personal mail. **Risk:** a serious buyer's first impression after submitting is whether Mia's reply lands in their spam folder. No team checked SPF/DKIM/DMARC for outbound personal Gmail. Pre-`.com`-cutover branded email (`mia@miasanabriarealtor.com`) is C-GHL-adjacent but the underlying deliverability question is separate.
3. **MISSING-3 — Mobile screenshot capture for THIS cycle's visual edits.** Project CLAUDE.md mandates `audit:mobile-readability:capture` on any visual edit. The 18 Tier A items include visual edits to `IdxEmbed.tsx`, `MarketCard.tsx`, `FortLauderdaleV2.tsx`, `AnswerFirst.tsx`, `SiteHeader.tsx`, `thank-you/page.tsx`, `contact/page.tsx`, `valuation/page.tsx` — 8 files. Synthesis names the visual-edit set but doesn't explicitly call out the capture deliverable as a blocker before commit. **Add:** "before/after mobile captures at 320/375/414/768" as a verification gate.
4. **MISSING-4 — Conversion path for high-intent visitors who can't or won't use mailto.** Mailto silently fails on mobile users without a default mail client configured (Team 2 ISS-002 noted this from Cycle 20 but it didn't make Tier A). On a luxury site this is a recurring **silent conversion loss**. Recommended addition: a visible "WhatsApp / text Mia directly" link with `?source=mailto-fallback` on the contact form's error or as a sibling option. Out of scope without Mia's WhatsApp number consented, but the *option* should be in the matrix.
5. **MISSING-5 — Trust-row brokerage logo ordering.** Team 8 confirmed footer renders LPT + EHO + REALTOR® at h-10. **No team audited the order.** NAR has guidance on REALTOR® mark placement (the R logo shouldn't be subordinated to brokerage logos in ways that obscure the agent's membership). Quick visual review needed.

---

## 5. Tier C — single most important blocker to unblock for revenue

**Winner: C-GHL (GHL endpoint + auth + custom fields).**

Of all six Tier C blocks, the GHL endpoint is the only one that **directly creates new revenue flow** rather than enabling a launch event. Without it:

- 11 lead-flow improvements stay scaffolded-but-inert (T2-A1 through T2-A11)
- Every form submission today is a mailto that may not deliver, won't attribute, and never enters a follow-up workflow
- Mia has no way to measure conversion by surface, market, or campaign — flying blind on what's working
- The IDX wrapper handoff CTA (top-priority Tier A item above) lands users at /contact/ where the form *still* drops their attribution context

**Cost to NOT unblock GHL this quarter:**
- Estimated 30-50% lead-loss vs. attached CRM (mailto deliverability + no follow-up automation)
- Zero attribution data → impossible to make a Cycle 22+ "which markets convert" decision
- Cutover to `.com` without GHL means brand launch with a known-broken capture pipe; first-impression risk
- Compounds with MISSING-1 (no call tracking) and MISSING-2 (Gmail deliverability): three independent leaks, all unmeasured

**Why not legal (DBPR / NAR / DMCA)?** These gate the **`.com` cutover event**, not steady-state revenue. They're high-impact but bounded — pay the cost once, done. GHL is recurring leverage.

**Practical unblock cost for GHL:**
- 1-2 hrs Torrey to provision env + GHL UI custom fields
- ~1 day engineering to wire `src/lib/ghl.ts` + retry/honeypot/Turnstile per Team 2 Section 3 backlog (B1-B12)
- Legal-counsel sign-off on TCPA consent string (B7) — this is the real critical-path human dependency

**Recommendation:** Schedule GHL unblock as a parallel workstream to Tier A implementation. Engineering can scaffold A1/A4 (hidden carriers, feature flag) in this cycle, and the moment Torrey provisions the endpoint + counsel signs the consent string, capture goes live without another cycle.

---

## 6. PM verdict on cycle scope — one line

**18 items is the right size for ENGINEERING but slightly too many for PRODUCT-VISIBLE IMPACT — recommend executing all 18 but communicating to Mia as a 5-item win list (top-5 above) with 13 internal improvements bundled.**

Of the 18 Tier A items: 5 are product-visible to Mia, 5 are mechanical schema/a11y fixes invisible to anyone but auditors, 5 are infrastructure/runbook prep for launch, 3 are nav/copy. That's a clean cycle scope, but the surface narrative needs sequencing — leading with "we did 18 fixes" understates the 5 that drive the funnel and overstates the 13 that don't.

---

## Quick-reference summary for caller

**Top-5 sequence (priority order):**
1. IDX wrapper bundle (A7/A8/A9/A10)
2. Thank-you response-time fix (A1)
3. Homepage H1 alignment (B1-promoted, was deferred)
4. /insights/ in primary NAV (A12)
5. PDF download attribute + (PDF) marker (A6)

**1-line PM verdict:** *18 items is the right size for engineering but reads heavy externally — execute all, but sell it to Mia as a 5-item win list with 13 internal improvements bundled.*

**Missing items count:** 5 (call tracking baseline, Gmail deliverability, mobile capture deliverable, mailto-fail fallback path, trust-row logo ordering).
