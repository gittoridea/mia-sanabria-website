# Legal / Compliance Packet (Cycle 22 — Team 6)

> **Status: PACKAGED FOR REVIEW.** No legal conclusions drawn. Every item classified into one of four buckets, with an exact question for counsel / Mia / broker.

## Disposition legend

- **likely-okay-needs-review** — current implementation is reasonable; counsel sanity-checks before launch
- **must-review-before-launch** — site must not go live without counsel signoff
- **external-action-missing** — third-party filing or written confirmation required
- **needs-mia-or-broker-or-legal** — principal-side decision OR Mia's broker (LPT) must provide text

## 1. License & verification

### 1.1 DBPR (Florida Department of Business and Professional Regulation) license

- **Item:** `MIA.unverified.licenseNumber = "SL3405877"` (`src/lib/mia.ts:45`). Footer renders "FL Sales Associate License #SL3405877."
- **Bucket:** `external-action-missing` + `needs-mia-or-broker-or-legal`
- **Exact question for Mia:** "Is `SL3405877` your active Florida Sales Associate license number? If yes, we'll verify against DBPR's primary source and flip the field name from `unverified` to `licenseNumber` in repo."
- **Exact verification step:** look up `SL3405877` at https://www.myfloridalicense.com/wl11.asp (or DBPR's current portal) and confirm active status + association with LPT Realty.

### 1.2 NAR / REALTOR® / local board membership

- **Item:** Footer + every market page renders the REALTOR® mark and uses "REALTOR®" in copy.
- **Bucket:** `external-action-missing`
- **Exact question for Mia:** "Please provide written confirmation of (a) active NAR membership and (b) active local board membership (likely Realtor® Association of Greater Fort Lauderdale or similar). We will not render the REALTOR® mark in production unless this is confirmed in writing."
- **Mark usage rules referenced:** NAR membership marks manual (current edition); REALTOR® must always be capitalized, marked ®, and only used by current members.

## 2. Equal Housing Opportunity

### 2.1 EHO logo + Fair Housing wording

- **Item:** EHO logo present in `SiteFooter.tsx:155-159`; alt = "Equal Housing Opportunity".
- **Bucket:** `likely-okay-needs-review`
- **Exact question for counsel:** "Is rendering the EHO logo + alt text 'Equal Housing Opportunity' in the footer (no separate disclosure paragraph) sufficient for HUD Fair Housing display compliance on a Florida real-estate website?"
- **Fair Housing audits performed:** `audit-stale-terms` blocks "best schools", "good schools", "safe neighborhood", "family-friendly", "bachelor pad", "kid-friendly" — Fair Housing steering language. 0 hits at baseline.

## 3. MLS / IDX disclaimer

### 3.1 IDX iframe MLS disclaimer (Matrix MLS via sef.mlsmatrix.com)

- **Item:** `IdxEmbed.tsx:53` renders "Listing data deemed reliable but not guaranteed. Search provided by Matrix MLS;…".
- **Bucket:** `needs-mia-or-broker-or-legal`
- **Exact question for LPT broker-of-record:** "What is the exact SEF MLS broker-reciprocity disclaimer LPT Realty requires us to render when the site embeds the SEF MLS Matrix IDX iframe? Current text is generic; we need the broker-specific language for the production cutover to `.com`."

## 4. Brokerage identity

### 4.1 Brokerage name + LPT Realty disclosure

- **Item:** Footer renders `{MIA.title}, {MIA.brokerage.legal}` (Realtor, LPT Realty LLC). `WebSite.publisher = "LPT Realty LLC"` in JSON-LD.
- **Bucket:** `needs-mia-or-broker-or-legal`
- **Exact question for LPT:** "Does LPT Realty require additional disclosure language on agent-individual websites (e.g., 'Mia Sanabria is a real estate associate sponsored by LPT Realty LLC, Florida License #XXX')? If yes, please provide the exact line."

## 5. Privacy policy

### 5.1 `/privacy/` page

- **Item:** Page exists at `/privacy/`; baseline `bun run audit:legal` passes.
- **Bucket:** `must-review-before-launch`
- **Exact question for counsel:** "Is the current `/privacy/` policy sufficient for a Florida REALTOR® personal site that (post-cutover) will (a) collect form data via GHL, (b) send via GHL webhook with TCPA-consented phone/SMS, (c) load Google Analytics 4 events, (d) embed a third-party MLS iframe? If revisions are needed, please mark them in track-changes."

## 6. Terms of Service

### 6.1 `/terms/` page

- **Bucket:** `must-review-before-launch`
- **Exact question for counsel:** "Does the current `/terms/` page require revision for (a) IDX iframe third-party content, (b) lead-magnet PDF distribution terms, (c) limitation of liability scoped for Florida real-estate practice?"

## 7. Accessibility statement

### 7.1 `/accessibility/` page

- **Bucket:** `likely-okay-needs-review`
- **Exact question for counsel:** "Is the current `/accessibility/` statement sufficient for ADA Title III compliance signaling? Florida real-estate sites have been targeted in litigation; the WCAG 2.1 AA reference + contact for accommodation requests should be sufficient — please confirm."

## 8. DMCA / USCO designated-agent registration

### 8.1 `/dmca/` page + USCO filing

- **Item:** `audit-legal.dmca.uscoFlag` returns WARN in Cycle 20 baseline — USCO designated-agent registration is in-process.
- **Bucket:** `external-action-missing`
- **Exact question for Mia / Torrey:** "Has the USCO designated-agent registration completed (https://dmca.copyright.gov/)? If not, what is the expected completion date? The `/dmca/` page must name the registered agent + USCO acknowledgment before launch."

## 9. TCPA consent text

### 9.1 Phone/SMS consent for GHL forms

- **Item:** Proposed consent text in `GHL_READY_PACKET.md` §4 is currently unapproved.
- **Bucket:** `must-review-before-launch` + `needs-mia-or-broker-or-legal`
- **Exact question for counsel:** "Please review the following consent text for Florida TCPA compliance + alignment with FCC 2024 robocall/text rulings: 'I agree to be contacted by Mia Sanabria at the phone/email above about my inquiry. Message and data rates may apply. I understand consent is not a condition of any service. Reply STOP to unsubscribe.' If revisions are needed, please mark."

## 10. Lead-magnet disclaimers

### 10.1 PDF lead-magnet content disclaimers

- **Item:** 3 PDFs (`waterfront-buyer-due-diligence-checklist.pdf`, `luxury-seller-pre-listing-checklist.pdf`, `fort-lauderdale-waterfront-valuation-prep-sheet.pdf`) are educational checklists.
- **Bucket:** `likely-okay-needs-review`
- **Exact question for counsel:** "Should the PDFs carry a disclaimer page stating: (a) the checklist is general guidance not personalized legal/tax/inspection advice, (b) the reader should retain licensed professionals for specific transactions, (c) Mia Sanabria's role is as a REALTOR® not as legal/tax/insurance counsel? Currently the PDFs do not render this disclaimer."

## 11. PDF noindex policy

### 11.1 X-Robots-Tag on `/downloads/*.pdf`

- **Item:** PDFs are currently public. No `X-Robots-Tag: noindex` header.
- **Bucket:** `needs-mia-or-broker-or-legal`
- **Exact question for Torrey:** "Should the lead-magnet PDFs be `noindex` (so they don't compete with `/markets/fort-lauderdale/` in search), OR `index` (so the checklists themselves can rank for query intent)?"
- **Recommendation:** `noindex` (treat PDFs as conversion assets, not SEO landing pages) — requires Caddyfile rule via Dokploy post-cutover. Routes to `LAUNCH_CUTOVER_READY_PACKET.md`.

## 12. Fair Housing wording

### 12.1 Site-wide Fair Housing language

- **Bucket:** `likely-okay-needs-review`
- **Exact question for counsel:** "The site uses descriptive geography (e.g., 'A1A beach corridor', 'Mediterranean Revival architecture') and avoids family-status / national-origin / disability proxies. Audited via `audit-stale-terms` (0 hits). Are there Florida-specific Fair Housing terms we should additionally avoid?"

## 13. Scope-of-advice boundaries

### 13.1 Legal / tax / insurance / inspection / marine-survey / engineering

- **Item:** Site copy and PDFs reference these professions but do not advise.
- **Bucket:** `likely-okay-needs-review`
- **Exact question for counsel:** "Does any current site copy or PDF cross the line from 'mentioning the role' to 'advising'? We've audited for explicit overclaim language but not for scope-of-advice. Please flag any passage that needs softening."

## 14. Summary checklist

| Section | Bucket | Owner |
|---|---|---|
| 1.1 DBPR license verification | external + Mia | Mia confirms + Torrey verifies |
| 1.2 NAR / REALTOR® membership | external | Mia provides written confirmation |
| 2.1 EHO display | likely-okay | counsel |
| 3.1 SEF MLS broker reciprocity | needs-LPT | LPT broker-of-record |
| 4.1 LPT additional disclosure | needs-LPT | LPT |
| 5.1 /privacy/ | must-review | counsel |
| 6.1 /terms/ | must-review | counsel |
| 7.1 /accessibility/ | likely-okay | counsel |
| 8.1 DMCA + USCO | external | Mia/Torrey filing + counsel |
| 9.1 TCPA consent text | must-review | counsel |
| 10.1 PDF disclaimers | likely-okay | counsel |
| 11.1 PDF noindex policy | needs-decision | Torrey |
| 12.1 Fair Housing wording | likely-okay | counsel |
| 13.1 Scope-of-advice | likely-okay | counsel |

## 15. Next-cycle prompt (drop-in for the legal-closure cycle)

> Mission: Close every legal/compliance item in `LEGAL_COMPLIANCE_PACKET.md` before site launch. Preconditions: Mia provides written NAR membership confirmation + DBPR license confirmation; LPT Realty provides broker-of-record disclosure text + MLS reciprocity disclaimer; counsel returns track-changes on `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/`, TCPA consent, PDF disclaimers, scope-of-advice. Implement: flip `MIA.unverified.licenseNumber` to `MIA.license`; update legal pages with counsel-approved text; add Mia/LPT disclosure line to footer if required; render PDF disclaimer pages via `scripts/render-lead-magnets.ts`; record DMCA designated-agent registration in `/dmca/` page. Run `audit:legal` + `audit:stale` + `audit:no-fabrications` post-edit. Commit, push, deploy.
