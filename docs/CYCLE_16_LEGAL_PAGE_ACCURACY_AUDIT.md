# Cycle 16 — Legal Page Accuracy Audit

**Date:** 2026-05-10
**Method:** Read each legal route, classify against accuracy criteria, mark PASS/REVIEW/BLOCKED.
**Boundary:** No legal copy was rewritten in this audit. REVIEW classifications flag what principal/legal must approve before .com cutover.

## Summary

| Page | Route | Status | Hard blockers? |
|---|---|---|---|
| Privacy Policy | `/privacy/` | **REVIEW** | None for staging; one for .com cutover |
| Terms of Service | `/terms/` | **REVIEW** | None for staging; one for .com cutover |
| Accessibility Statement | `/accessibility/` | **PASS** | None |
| DMCA Notice | `/dmca/` | **BLOCKED BY USCO** | DMCA designated-agent registration pending |

**Net:** 1 PASS, 2 REVIEW, 1 BLOCKED. No FAIL.

---

## /privacy/ — REVIEW

### Structural checks

| Criterion | Result |
|---|---|
| Route built | ✓ — in sitemap, canonical, og:image resolves |
| Footer links to | ✓ — `FOOTER_NAV.legal` |
| Metadata complete | ✓ — title, description, canonical, OG |
| Schema | ✓ — `WebPage` + Breadcrumb |
| Contact email | ✓ — `msanabriarea@gmail.com` (PUBLIC_FACT_LEDGER §1) |
| Brokerage attribution | ✓ — "LPT Realty LLC" + Mia Mary Sanabria |
| Last-updated date | 2026-05-08 |

### Content coverage

| Section | Present |
|---|---|
| Identity + contact | ✓ |
| What information we collect (forms, cookies, server logs, GA4 conditional) | ✓ |
| How we use information (inquiry handling, site ops) | ✓ |
| Legal bases (GDPR, CA business purposes) | ✓ |
| Service providers (GA4, GHL/LeadConnector, Cloudflare, Userway — all conditional) | ✓ |
| California privacy rights (CCPA + CPRA, GPC honored) | ✓ |
| GDPR/UK privacy rights | ✓ |
| Cookies + analytics + tracking choices | ✓ |
| Do Not Track + GPC | ✓ |
| Data retention | ✓ |
| Security + Florida breach response (FS § 501.171) | ✓ |
| Children's privacy (COPPA, <13) | ✓ |
| International data transfers | ✓ |
| Policy updates + effective date | ✓ |

### REVIEW items

1. **GHL/LeadConnector mention is conditional but lives in the prose.** The page states *"GoHighLevel or LeadConnector for lead capture, contact routing, and follow-up workflows **when those tools are connected**."* This is honest (the "when those tools are connected" qualifier covers the current state where GHL is not yet wired). When Cycle 17 wires GHL, this passage will become an active disclosure rather than a conditional one — the language is already correct for that transition.
2. **GA4 ID is present in PUBLIC_FACT_LEDGER (`G-PYYSF87G8K`).** The privacy policy correctly conditionalizes GA4 disclosures on `MIA.tracking.ga4Id`. If the principal swaps analytics providers (CYCLE 12 PRINCIPAL_DECISION Card 2), the conditional auto-handles the swap without rewrite.
3. **Userway accessibility widget mentioned conditionally.** `MIA.tracking.userwayId = "vVNkJJLvR4"` is set — but the live page does NOT currently include the Userway script in `layout.tsx`. The privacy policy line "An accessibility widget used to support on-site accessibility options" renders when `userwayId` is truthy. This is a minor inconsistency — either the widget should be loaded (and the policy line is correct) OR the userwayId should be nulled (and the policy line drops). REVIEW for principal: confirm Userway is intended.
4. **Branded email gap.** Policy uses `msanabriarea@gmail.com` (currently canonical per PUBLIC_FACT_LEDGER §1). When principal provisions branded email (CYCLE 12 PRINCIPAL_DECISION Card 3), policy will need a one-line update — but no code change needed; the email is data-driven.

### Verdict for staging deploy

**Approved for staging.** Privacy policy reflects current state honestly. No misstatement.

### Verdict for .com production cutover

**REVIEW BLOCKED — principal-legal final read.** Privacy policy will be a live legal document on the production .com surface; principal should have legal counsel review the current text before the DNS cutover.

---

## /terms/ — REVIEW

### Structural checks

| Criterion | Result |
|---|---|
| Route built | ✓ |
| Footer links to | ✓ |
| Metadata complete | ✓ |
| Schema | ✓ |
| Contact email | ✓ |
| Brokerage attribution | ✓ |
| Last-updated date | 2026-05-08 |

### Content coverage

| Section | Present |
|---|---|
| Acceptance + eligibility (18+) | ✓ |
| License to use the site | ✓ |
| Information accuracy + IDX/MLS disclaimer | ✓ |
| No real estate / legal / tax / financial advice disclaimer | ✓ |
| REALTOR® and NAR membership definition | ✓ |
| Brokerage relationship (when an agency forms) | ✓ |
| License # rendered when set | ✓ (currently `SL3405877`) |
| Equal Housing Opportunity statement (FHA citation) | ✓ |
| Contact and consent (TCPA + FL § 501.059 + STOP keyword) | ✓ |
| User submissions | ✓ |
| Prohibited conduct | ✓ |
| Third-party links | ✓ |
| Disclaimer of warranties | ✓ |
| Limitation of liability | ✓ |
| Indemnification | ✓ |
| Governing law + venue (FL Broward Co) | ✓ |
| Dispute resolution | ✓ |
| DMCA cross-reference | ✓ |
| Changes to terms | ✓ |
| Contact | ✓ |

### REVIEW items

1. **TCPA consent language is generic.** The "Contact and consent" section recites the TCPA + FL § 501.059 framework with the "consent is not a condition of purchasing" and "reply STOP" required elements. This is generally compliant but is not a substitute for a counsel-reviewed TCPA opt-in form copy at the actual point of capture. Cycle 17 (GHL wiring) requires explicit principal-legal-approved TCPA copy at the FORM, not just in the Terms page (per CYCLE_15_LEAD_CAPTURE_ARCHITECTURE.md prereqs).
2. **REALTOR® mark definition is correct.** The section reads: *"REALTOR® is a federally registered collective membership mark of the National Association of REALTORS® and identifies real estate professionals who are members of NAR and subscribe to its Code of Ethics."* This is the canonical NAR-recommended description. Mia is cited as an NAR member; principal-legal should confirm membership status (still on PUBLIC_FACT_LEDGER §2 unverified list).
3. **License # `SL3405877` is rendered.** PUBLIC_FACT_LEDGER §2 says "candidate, awaiting DBPR primary-source confirmation by Mia". The Terms page conditionally renders it when `MIA.unverified.licenseNumber` is truthy. Cycle 16 maintains this conditional render. CYCLE 12 PRINCIPAL_DECISION Card 1 is the gating decision.
4. **Governing law is Florida (Broward County).** Confirmed correct for a Fort Lauderdale REALTOR® site.
5. **No DMCA agent address.** Terms page cross-references `/dmca/` — DMCA page itself is BLOCKED (see below).

### Verdict for staging deploy

**Approved for staging.** Terms reflect current state honestly. License # conditional renders are correct.

### Verdict for .com production cutover

**REVIEW BLOCKED — principal-legal final read, plus TCPA form copy gating.**

---

## /accessibility/ — PASS

### Structural checks

| Criterion | Result |
|---|---|
| Route built | ✓ |
| Footer links to | ✓ |
| Metadata complete | ✓ |
| Schema | ✓ |
| Contact email | ✓ |
| Last-updated date | 2026-05-08 |

### Content coverage

| Section | Present |
|---|---|
| Commitment + WCAG 2.1 AA target + ADA Title III | ✓ |
| What we do (semantic HTML, ARIA, sequential headings, contrast, keyboard nav, reduced motion, skip-link, form labels) | ✓ |
| Assistive technology compatibility (JAWS, NVDA, VoiceOver, voice control, keyboard) | ✓ |
| Third-party content disclosure (MLS embeds, maps, video, social) | ✓ |
| Reporting a barrier | ✓ |
| Reach-us contact (email + phone) | ✓ |
| Alternative access | ✓ |
| Ongoing improvement | ✓ |
| Effective date | ✓ |

### Verdict

**PASS.** No misstatements. The page accurately describes the site's accessibility posture and provides a reasonable response mechanism.

If Userway widget is activated (see Privacy item 3), an "Accessibility tools" subsection should mention it. Currently not a blocker.

---

## /dmca/ — BLOCKED BY USCO

### Structural checks

| Criterion | Result |
|---|---|
| Route built | ✓ |
| Footer links to | ✓ |
| Metadata complete | ✓ |
| Schema | ✓ |
| Contact email | ✓ |
| Last-updated date | 2026-05-08 |

### Content coverage

| Section | Present |
|---|---|
| Overview + DMCA citation (17 U.S.C. § 512) | ✓ |
| Designated agent | **PARTIAL — not yet registered with USCO** |
| Mailing address for notices | **PENDING** |
| Submitting a takedown notice (6-element checklist per § 512(c)(3)) | ✓ |
| Submitting a counter-notice (per § 512(g)(3)) | ✓ |
| Repeat-infringer policy | ✓ |
| Misrepresentation warning (§ 512(f)) | ✓ |
| Where to send notices | ✓ (email only currently) |

### Why BLOCKED

The page explicitly states: *"We are in the process of registering a DMCA designated agent with the U.S. Copyright Office. Until that registration is complete, send notices to the contact below and allow additional processing time."*

This is honest disclosure and is appropriate for staging. But for production, full DMCA safe-harbor under § 512 requires:
1. **USCO-registered designated agent** — a discrete, fee-paid registration at the U.S. Copyright Office.
2. **Public mailing address** for formal notice service.
3. **Repeat-infringer policy formalization** (text is present; principal/legal should confirm enforcement mechanism if any user-generated-content surface exists — currently none, so this is mostly forward-looking).

CYCLE 12 PRINCIPAL_DECISION did not specifically gate DMCA registration; it should be added as a pre-cutover blocker. Estimated cost: $6 filing fee + ~15 minutes principal time at https://www.copyright.gov/dmca-directory/.

### Verdict for staging

**Approved for staging.** DMCA page is correctly worded for a pre-USCO state.

### Verdict for .com production cutover

**BLOCKED by USCO registration.** Either:
1. Principal registers a DMCA designated agent at USCO → unblock + remove "in the process of registering" language.
2. OR — accept the increased liability exposure of running production without the safe-harbor (NOT RECOMMENDED).

---

## Cross-page audit (footer links + sitemap + canonicals)

| Check | Result |
|---|---|
| All 4 routes in `FOOTER_NAV.legal` | ✓ |
| All 4 routes in sitemap.xml | ✓ |
| All 4 canonicals point to staging URL | ✓ (will flip to production URL post-cutover via `NEXT_PUBLIC_SITE_URL`) |
| All 4 have OG metadata | ✓ |
| All 4 have unique titles | ✓ |
| All 4 have schema-dts WebPage block + Breadcrumb | ✓ |
| No XML/HTML legacy markup | ✓ |
| No empty `<aside>` / `<details>` / `<callout>` (markdown-zealot rule) | N/A — these are TSX pages |
| No off-brand fonts/colors | ✓ (audit:brand passes) |

---

## Recommendations for principal

1. **Schedule a 30-minute legal-counsel read** on Privacy + Terms before .com cutover. Both are substantive long-form legal documents that should not ship live without independent legal review.
2. **Register DMCA agent at USCO.** $6 fee, ~15 minutes online, unblocks DMCA route for production.
3. **Confirm Userway intent.** Either activate the widget (load the script in layout.tsx) OR null `MIA.tracking.userwayId` — either resolves the conditional inconsistency.
4. **For TCPA-compliant form copy** (Cycle 17 prereq): work with legal counsel on the explicit opt-in language to render at the actual form, separate from the Terms page disclosure.

---

## Audit chain integration

A new `audit:legal` script (Phase 10) enforces:
- All 4 routes built.
- All 4 routes in sitemap.
- Each page has metadata + canonical + OG + WebPage schema + Breadcrumb.
- DMCA page contains the "in the process of registering" flag (until USCO registration documented in PUBLIC_FACT_LEDGER §2) — WARN, not FAIL.
- Privacy page references the canonical email (data-driven via `MIA.contact.email`).
- Terms page references LPT brokerage legal name.

Status taxonomy: PASS · REVIEW · BLOCKED. WARN allowed for known principal-gated items.
