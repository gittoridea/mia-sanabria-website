# Team 8 — Compliance Boundary & Claims

**Cycle:** 21-AI-REMAINING-WORK
**Generated:** 2026-05-11
**Scope:** Mia Sanabria realtor website — REALTOR®/EHO/MLS/brokerage marks, license rendering, disclaimers, Fair Housing wording, TCPA scope, legal pages.
**Boundary:** **This is NOT legal signoff.** Final clearance requires Mia Sanabria, LPT Realty broker-of-record, and (where flagged) outside counsel.

Audits run baseline:
- `bun run audit:legal` → 18 PASS · 1 WARN · 0 FAIL (WARN = DMCA USCO in-process language, principal-gated for staging).
- `bun run audit:no-fabrications` → 0 hits.
- `bun run audit:trust-logos` → 30 PASS · 0 WARN · 0 FAIL.
- Live confirmation against `https://miasanabriarealtor.trueidea.com/?cb=<hex>` Cache-Control: no-cache.

---

## Section 1 — Mark / Logo / License / Brokerage Rendering Audit

| Mark / element | Source-of-truth | Site rendering | Status | Notes |
|---|---|---|---|---|
| REALTOR® word mark | NAR Membership Marks Manual; registered ® required | Rendered everywhere as `REALTOR®` (e.g. `src/lib/site.ts:21,24`, `src/lib/mia.ts:9`, footer label) | PASS | `®` character used, not unstyled `(R)`. |
| REALTOR® R logo | NAR white-on-transparent membership mark PNG 600×600 | `public/logos/realtor-r.png`, footer rendered at h-10, `alt="REALTOR®"`, NAR-derived per Cycle 17 comment block in `SiteFooter.tsx:124-136` | PASS-with-condition | Display permitted under NAR Membership Marks Manual *only while Mia is an active NAR member in good standing*. Membership-status verification is a needs-Mia/brokerage item — see Section 3 risk R1. |
| Equal Housing Opportunity (EHO) logo | HUD ships TIF/EPS only; site uses curated equalhousinglogo.com white PNG 1000×1000 (per memory `knowledge_eho_realtor_logo_sourcing` + Cycle 17 footer comment) | `public/logos/equal-housing.png`, footer h-10, `alt="Equal Housing Opportunity"`, label `Equal Housing Opportunity` | PASS | EHO mark is public-domain Fair Housing signaling. |
| Brokerage logo (LPT Realty) | First-party `lpt-realty.png` 1097×1097 | Footer h-10, `alt="LPT Realty"`, label `LPT Realty` | PASS | Brokerage display visible in BROKERAGE column AND industry-affiliations row. |
| Brokerage identity (legal name) | `MIA.brokerage.legal = "LPT Realty LLC"` (`src/lib/mia.ts:11-12`) | Rendered in footer address (`{MIA.title}, {MIA.brokerage.legal}`), terms page §"Brokerage relationship" (`/terms/` line 108), privacy §"Identity and contact" | PASS | Headquarters address: `1400 S International Parkway, Lake Mary, FL 32746` (`mia.ts:13-19`). Verify against LPT current HQ (needs-brokerage). |
| Sales associate name | `MIA.name.legal = "Mia Mary Sanabria"` | Rendered everywhere | PASS | |
| FL license # | `MIA.unverified.licenseNumber = "SL3405877"` (`src/lib/mia.ts:45`) | Footer: `FL Sales Associate License #SL3405877` (`SiteFooter.tsx:102-106`); also Terms page (`terms/page.tsx:114`); also each lead-magnet download page (`downloads/[slug]/page.tsx:76,184`); also live HTML confirmed | PASS-with-condition | Field is `MIA.unverified.*` — sourced from public-web (LPT agent listing pages, MLS profile, Klein Morgan legacy), comment at `mia.ts:40-44` flags DBPR primary-source confirmation by Mia as **the final pre-.com-cutover gate**. Format `SL` + 7 digits matches FL DBPR Sales Associate convention. Verification: needs-Mia (Section 3 risk R2). |
| MLS / IDX provider attribution | Iframe to `sef.mlsmatrix.com` (SEF MLS Matrix) on homepage (`IdxEmbed.tsx:2`); sitewide footer disclaimer "All information is deemed reliable but not guaranteed. IDX listings provided for consumers' personal, non-commercial use; not for redistribution." (`SiteFooter.tsx:107-110`) | Footer-only attribution | GAP (Section 3 risk R3) | The iframe content carries the MLS's own attribution, but the host page does NOT display: (a) the originating MLS name (SEF MLS / "Southeast Florida MLS"), (b) the specific broker reciprocity / IDX participation statement required by some MLS data-feed contracts, (c) "Last updated" or feed-refresh attribution. Needs-brokerage review of SEF MLS Matrix IDX participation rules (Mia's LPT broker-of-record should be on the IDX participant agreement). |

---

## Section 2 — Disclaimer Placement Audit

| Disclaimer | Required where | Found where | Status |
|---|---|---|---|
| "Deemed reliable but not guaranteed" | Anywhere listing/comparable data is displayed | Footer sitewide; Terms `/terms/` §"Information accuracy and IDX/MLS disclaimer" | PASS |
| IDX consumer-use / not-for-redistribution | Near IDX content + Terms | Footer sitewide; Terms page | PASS-with-gap — host page wrapping the IDX iframe has no in-page disclaimer adjacent to the iframe (sole reliance on footer). Recommend a 1-sentence note immediately above/below the iframe (low-risk AI fix). |
| No-real-estate-legal-tax-financial-advice scope | All editorial / informational content + lead-magnet PDFs | Terms `/terms/` §"No real estate, legal, tax, or financial advice"; `PDF_DISCLAIMER` on every lead-magnet PDF (`src/data/lead-magnets/index.ts:497-498`); inline footer of `FortLauderdaleV2.tsx:858-859`; `LeadMagnetIndex` callouts | PASS |
| Brokerage-relationship-not-formed | Anywhere a CTA solicits inquiry | Terms `/terms/` §"Brokerage relationship" | PASS at Terms; not repeated on Contact/Valuation pages (acceptable — Terms is the canonical home; sitewide link in footer). |
| Fair Housing / Equal Housing statement | Footer (logo) + Terms | EHO logo + label in footer; Terms `/terms/` §"Equal Housing Opportunity" cites 42 U.S.C. § 3601 et seq. | PASS |
| TCPA / SMS consent disclaimer | Adjacent to any form collecting phone, when phone may be used for SMS/marketing | Contact form helper (`contact/page.tsx:191-196`); Valuation form helper (`valuation/page.tsx:181-186`); Terms §"Contact and consent" cites TCPA + Florida § 501.059, STOP opt-out | PASS-with-condition — consent text says "Consent to receive calls or text messages is not a condition of any service." That is the **TCPA quid-pro-quo carve-out**, correct. But the forms currently `mailto:` to `msanabriarea@gmail.com` (no server endpoint), so the SMS scenario is hypothetical until GHL is wired. Once SMS is actually sent (post-GHL), the consent string and STOP/HELP keyword handling become live obligations. Needs-Mia decision at GHL cutover. |
| PDF use agreement (copyright + scope) | Every lead-magnet PDF | `PDF_USE_AGREEMENT` (`lead-magnets/index.ts:500-501`) | PASS |
| DMCA designated agent | DMCA page | DMCA page states "in the process of registering a DMCA designated agent with the U.S. Copyright Office. Until that registration is complete, send notices to the contact below…" (`/dmca/page.tsx:67-80`) | WARN-staging-OK / FAIL-for-prod-cutover — `audit:legal` already flags this as `legal.dmca.uscoFlag` WARN, BLOCKED for production cutover per CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md. Needs-Mia: register DMCA agent before `.com` cutover. |
| Privacy CCPA / GDPR / GPC / Florida § 501.171 | Privacy page | All present in `/privacy/page.tsx` | PASS |

---

## Section 3 — Claims Risk Register

| ID | Claim / element | Page(s) | Risk level | Owner |
|---|---|---|---|---|
| R1 | REALTOR® R logo display | Footer (sitewide) | MED | needs-Mia + needs-brokerage — confirm active NAR + local-board membership in writing before `.com` cutover. NAR Membership Marks Manual is strict on lapse. |
| R2 | `FL Sales Associate License #SL3405877` | Footer, Terms, every download PDF | HIGH | needs-Mia — primary-source DBPR confirmation. The field literally lives under `unverified.licenseNumber`. Wrong-license printing on a regulated brokerage display is an FREC concern. |
| R3 | IDX iframe attribution / broker reciprocity | Homepage IDX section, Footer | MED | needs-brokerage — confirm LPT's SEF MLS Matrix IDX participation agreement allows the embed in current form; confirm in-page attribution string required by SEF MLS contract; add in-page note adjacent to iframe. |
| R4 | "informally available residences" / brokerage-relationship pre-market mentions | Buyers page (multiple), Markets index, Fort Lauderdale V2, Bay Colony/Bermuda Riviera insight | LOW | AI-already-hedged — every instance pairs with "availability varies by market and timing" or "not a claim of guaranteed pre-market access". This is the cleaned-up replacement of the now-banned "off-market" language. Keep audit:stale enforcing. |
| R5 | "Mia coordinates; licensed specialists confirm" boundary | Lead-magnet PDFs, market pages, valuation page | LOW | AI-safe — clearly scopes Mia to brokerage services and routes legal/tax/insurance/inspection/marine-survey/engineering work to licensed specialists. PASS. |
| R6 | Brokerage HQ address (Lake Mary, FL 32746) | Footer (implicit via brokerage.headquarters), Terms | LOW | needs-brokerage — quick check that LPT's current registered HQ still matches. |
| R7 | Response-time language ("Inquiries are reviewed in order of priority and returned personally") | Contact page | LOW | AI-safe — non-numeric, no SLA promised. CLAUDE.md already bans "within two hours". |
| R8 | TCPA SMS consent string | Contact form, Valuation form, Terms | MED-at-cutover | needs-Mia + GHL — once a real lead capture endpoint sends SMS, STOP/HELP keyword handler + 10DLC registration become live obligations. Currently mailto, so dormant. |
| R9 | DMCA designated-agent registration | `/dmca/` | HIGH-at-cutover | needs-Mia — must register with U.S. Copyright Office before `.com` cutover (already tracked by `audit:legal` WARN). |
| R10 | "All information is deemed reliable but not guaranteed" + IDX disclaimer scope | Footer | LOW | AI-safe — standard MLS-compliant phrasing. |
| R11 | Privacy disclosures (CCPA/CPRA/GDPR/Florida § 501.171/GPC) | `/privacy/` | LOW | needs-legal at cutover — strong baseline drafted; legal review recommended before `.com`. |
| R12 | Service-area enumeration ("Eastern Fort Lauderdale, Eastern Boca Raton, Eastern Delray Beach") | site.ts, mia.ts, schema | LOW | AI-safe — geographic, not protected-class. |
| R13 | "If I don't know the answer, I will find it." | Tagline (site.ts:27, mia.ts:36) | LOW | AI-safe — competence promise, not a guarantee. |
| R14 | Lead-magnet PDF content claims (dock/seawall/insurance diligence checklists) | `/downloads/[slug]/` | LOW | AI-safe — every checklist item ends in a routing to a licensed specialist. PDF_DISCLAIMER scope-locks the document. |
| R15 | Schema markup (`RealEstateAgent`, `Broker`, license, areaServed) | All pages via schema components | LOW | needs-brokerage spot-check — schema mirrors `MIA` object; once R2 is confirmed, schema is authoritative. |

---

## Section 4 — Fair Housing Risk Audit

Steering language ban list (per `CLAUDE.md` + `audit:stale-terms`): "best schools", "good schools", "safe neighborhood", "family-friendly", "bachelor pad", "kid-friendly", "perfect for".

Grep result sitewide: **zero hits on any banned steering phrase.**

Allowed adjacencies observed (not steering):
- "school data" — listed as a category of information consumers verify independently (`/terms/page.tsx:78`). Descriptive, neutral.
- "family stage" — buyer-brief framing in `12-private-buyer-brief-defining-the-search.ts:58` and Fort Lauderdale V2. Describes buyer's own self-categorization of timeline, not a steering directive about the residence or neighborhood.
- "neighborhood character", "neighborhood texture", "residential grid neighborhood" — descriptive architectural / built-environment language. No protected-class adjacency.
- "luxury", "waterfront", "estate-scale" — economic category, not protected class.

Fair Housing risk assessment: **LOW**. Editorial voice (Mia-of-the-residence-not-the-resident) is structurally Fair-Housing-aware. The `/terms/` page §"Equal Housing Opportunity" cites the Fair Housing Act statute correctly.

One soft caution worth Mia's attention (not a violation, a brand-tone note): the descriptive market copy occasionally distinguishes "primary-residence buyers" vs "second-home buyers" vs "relocation buyers". Federal Fair Housing protected classes do not include residency-status, so this is permissible; some state/local jurisdictions add source-of-income or other classes. Florida currently follows federal classes plus a few add-ons (none triggered here).

---

## Section 5 — TCPA Scope

| Form | Page | Phone collected? | Endpoint today | TCPA-relevant text shown | Verdict |
|---|---|---|---|---|---|
| Private Inquiry | `/contact/` | Yes (optional, `type=tel`) | `mailto:msanabriarea@gmail.com` (no server) | "By submitting, you agree to receive a private response from Mia or her team at the email or phone number you provide. Consent to receive calls or text messages is not a condition of any service. We never share your information. Standard message and data rates may apply." (`contact/page.tsx:191-196`) | OK-while-mailto. At GHL cutover: confirm 10DLC registration, STOP/HELP keywords, written-consent record retention. |
| Home Valuation | `/valuation/` | Yes (optional, `type=tel`) | `mailto:` | Same disclaimer pattern (`valuation/page.tsx:181-186`) | Same verdict. |
| Lead-magnet downloads | `/downloads/[slug]/` | No form on page itself; CTA points to `/contact/` | n/a | n/a | OK. |

Terms `/terms/` §"Contact and consent" explicitly cites **TCPA** + **Florida Statutes § 501.059** (FL Mini-TCPA) + the STOP opt-out. This is the strongest current TCPA scaffolding. The fact that forms are still `mailto:` is the saving grace — there is no SMS being sent yet. The moment GHL is wired, the consent string must be displayed at point-of-capture (already is), the consent timestamp + form-version must be logged with the lead record (needs-GHL config), and any SMS auto-reply must use the registered 10DLC sender (needs-brokerage / needs-Mia).

---

## Section 6 — Privacy / Terms / DMCA / Accessibility Page Status

| Page | Exists | Last updated | Schema | Footer-linked | Status |
|---|---|---|---|---|---|
| `/privacy/` | Yes | 2026-05-08 | WebPage + Breadcrumb | Yes | PASS (legal review recommended before `.com` cutover; needs-legal R11) |
| `/terms/` | Yes | 2026-05-08 | WebPage + Breadcrumb | Yes | PASS (TCPA + REALTOR® + FL governing law + brokerage relationship all present) |
| `/dmca/` | Yes | 2026-05-08 | WebPage + Breadcrumb | Yes | WARN-staging — designated-agent registration with US Copyright Office in-process; blocked for prod cutover (R9). |
| `/accessibility/` | Yes | 2026-05-08 | WebPage + Breadcrumb | Yes | PASS (WCAG 2.1 AA target, UserWay widget referenced) |

All four routes confirm canonical link, BreadcrumbList JSON-LD, footer links, and contact email `msanabriarea@gmail.com` per `audit:legal`.

---

## Section 7 — Safe AI-Fixable vs. Blocked-Needs-Human

### AI-fixable now (low risk, no legal judgment required)

1. Add a 1-sentence "MLS data is provided for personal, non-commercial use; deemed reliable but not guaranteed." note immediately adjacent (above or below) to the homepage IDX iframe in `src/components/IdxEmbed.tsx`. The footer disclaimer covers the page sitewide, but in-page proximity is standard practice — closes R3 partial.
2. Add `audit:idx-attribution` check (small audit script) to assert: "an IDX-disclaimer string is rendered within the same `<section>` as any iframe pointing to a known MLS host (`sef.mlsmatrix.com`, `idx.*`)". One-time durable audit; matches Cycle-21 audit-promotion discipline.
3. Render the EHO logo + "Equal Housing Opportunity" label in any lead-magnet PDF footer (currently the PDFs cite REALTOR® + LPT but not EHO). Cosmetic Fair Housing reinforcement.

### Blocked — needs-human

1. **R2 — DBPR license #SL3405877 verification** — needs Mia in writing OR DBPR primary-source screenshot before `.com` cutover. Flip `MIA.unverified.licenseNumber` → `MIA.license.number` once confirmed.
2. **R1 — NAR / local-board active-membership confirmation** — needs Mia + LPT brokerage in writing. Locked condition for REALTOR® R logo display.
3. **R3 — SEF MLS Matrix IDX participation agreement** — needs LPT broker-of-record to confirm; AI must not invent reciprocity text.
4. **R9 — DMCA designated-agent USCO registration** — needs Mia.
5. **R11 — Privacy policy outside-counsel review** — needs Mia → legal counsel before `.com` cutover.
6. **R8 — GHL form endpoint + 10DLC SMS registration** — needs Mia decision + GHL config; do NOT invent endpoint URLs (per project CLAUDE.md).
7. **Tax / insurance / inspection / marine-survey / engineering scope claims** — every existing instance already routes to a licensed specialist. Do NOT remove that routing language under any "tightening" pass.

---

## Section 8 — Issue Rows (TSV)

```
id	team	page	category	issue	evidence	severity	impact	recommended_fix	owner_type	effort	confidence	can_fix_now	files_affected	verify_method
T8-001	team8	/	idx-attribution	No in-page IDX disclaimer adjacent to homepage iframe (sole reliance on sitewide footer)	src/components/IdxEmbed.tsx:1-42 has no disclaimer string in same section	MED	Compliance hygiene; some MLS IDX agreements require in-page attribution	Add 1-sentence "Data provided for consumers' personal, non-commercial use; deemed reliable but not guaranteed." above or below the iframe within IdxEmbed	AI	XS	HIGH	YES	src/components/IdxEmbed.tsx	bun run build && grep adjacent disclaimer in out/index.html
T8-002	team8	site	audit-coverage	No audit asserting in-page MLS-iframe disclaimer adjacency	scripts/audit-legal.ts checks legal-route HTML but not IDX-iframe co-location	LOW	Defect class can recur on additional pages embedding IDX	Add scripts/audit-idx-attribution.ts; promote into audit:all	AI	S	HIGH	YES	scripts/audit-idx-attribution.ts (new); package.json	bun run audit:idx-attribution
T8-003	team8	/downloads/[slug]/	eho-symbol	Lead-magnet PDFs cite REALTOR® + LPT in footer but not EHO logo/text	src/app/downloads/[slug]/page.tsx:180-191 footer	LOW	Fair Housing visual reinforcement; cosmetic	Add small EHO label/icon to PDF footer block	AI	S	MED	YES	src/app/downloads/[slug]/page.tsx	bun run build:pdfs && visual check
T8-004	team8	footer + downloads + terms	license-verification	FL license #SL3405877 rendered everywhere from MIA.unverified.licenseNumber	src/lib/mia.ts:39-50 (explicit unverified)	HIGH	FREC concern if wrong; correct as of public-web sources but not Mia-confirmed	Mia confirms in writing + DBPR primary source; flip field to MIA.license.number	needs-Mia	XS	HIGH	NO	src/lib/mia.ts; downstream consumers	manual confirmation + DBPR screenshot in PROJECTS/MiaSanabria/
T8-005	team8	footer	nar-membership	REALTOR® R logo display conditional on active NAR membership	src/components/SiteFooter.tsx:145-152; Cycle 17 comment block explicitly flags pre-cutover gate	MED	NAR Membership Marks Manual ties logo right to active membership in good standing	Mia + LPT confirm active NAR + local-board membership in writing pre-cutover	needs-Mia + needs-brokerage	XS	HIGH	NO	src/components/SiteFooter.tsx	written confirmation in PROJECTS/MiaSanabria/ledger
T8-006	team8	homepage IDX + footer	idx-mls-attribution	Iframe target sef.mlsmatrix.com (SEF MLS) but no broker reciprocity / IDX participation statement in host page	src/components/IdxEmbed.tsx; src/components/SiteFooter.tsx:107-110	MED	Some SEF MLS IDX agreements require explicit reciprocity text	LPT broker-of-record confirms participation agreement text; AI lays it down once confirmed	needs-brokerage	S	HIGH	NO	src/components/IdxEmbed.tsx	post-text confirmation, then visual check
T8-007	team8	/dmca/	usco-registration	DMCA designated agent registration with U.S. Copyright Office in-process	src/app/dmca/page.tsx:67-80; audit:legal flags legal.dmca.uscoFlag WARN	HIGH-at-cutover	17 U.S.C. § 512 safe-harbor depends on registered agent	Mia completes USCO registration; AI updates DMCA page with agent name + mailing address	needs-Mia	XS	HIGH	NO	src/app/dmca/page.tsx	bun run audit:legal still WARN until done; PASS thereafter
T8-008	team8	contact + valuation forms	tcpa-at-cutover	Forms are mailto today; once GHL wires SMS, TCPA + FL § 501.059 + 10DLC obligations go live	src/app/contact/page.tsx:109-115,191-196; src/app/valuation/page.tsx:181-186	MED-at-cutover	TCPA private right of action; FL Mini-TCPA per-violation statutory damages	At GHL cutover: register 10DLC, log consent timestamp + form-version, wire STOP/HELP keywords, confirm consent string is at point of capture (already is)	needs-Mia + GHL	M	MED	NO	src/app/contact/page.tsx; src/app/valuation/page.tsx; GHL config	post-cutover test SMS flow + audit consent-log retention
T8-009	team8	/privacy/	legal-review	Privacy policy is comprehensive draft; recommended outside-counsel review pre-cutover	src/app/privacy/page.tsx full document	LOW-as-staging / MED-at-cutover	CCPA/CPRA/GDPR/Florida § 501.171 references are correct but not lawyered	Outside counsel review pre-.com cutover	needs-legal	M	HIGH	NO	src/app/privacy/page.tsx	counsel signoff documented in PROJECTS/MiaSanabria/
T8-010	team8	footer brokerage block	hq-address	LPT HQ "1400 S International Parkway, Lake Mary, FL 32746" — quick verification against LPT current registered address	src/lib/mia.ts:13-19	LOW	Stale brokerage address is a small public-records mismatch	Quick check with LPT broker office; AI updates if changed	needs-brokerage	XS	HIGH	NO	src/lib/mia.ts	LPT confirmation
```

---

## Section 9 — Confidence + Explicit Boundary

**Confidence: HIGH** that the site's current compliance posture is materially good for staging — Cycle-16/17/18/19 work has built a solid baseline: legal pages exist with current dates, REALTOR®/EHO/LPT marks render with correct attribution, license # renders consistently (sourced from public web pending DBPR confirmation), TCPA consent string is at point-of-capture, IDX listings carry the standard "deemed reliable" disclaimer, lead-magnet PDFs carry the no-professional-advice scope and use-agreement, Fair Housing wording is clean of steering phrases, and the four legal routes (privacy/terms/dmca/accessibility) all pass the existing legal audit with the one well-tracked WARN on DMCA USCO in-process.

**Confidence: MED** on the readiness-for-.com-cutover question. The blockers are concrete and listed in Section 7: (1) DBPR primary-source license verification, (2) NAR + local-board active-membership confirmation, (3) SEF MLS IDX participation reciprocity text from LPT, (4) DMCA designated-agent USCO registration, (5) outside-counsel review of privacy. None are AI-resolvable — each requires Mia, LPT broker, or outside counsel.

**Explicit boundary — NOT LEGAL SIGNOFF.** This audit is an AI compliance read of the source repo and live staging HTML against the project's stated invariants (CLAUDE.md, audit:stale-terms, audit:legal, audit:no-fabrications, audit:trust-logos) and against standard real-estate-marketing compliance heuristics (REALTOR®, EHO, MLS/IDX, TCPA, Fair Housing Act, FREC superlative ban). It is not a substitute for: (a) a Florida-licensed attorney's review of the legal pages, (b) LPT Realty broker-of-record's compliance signoff on the MLS attribution and license display, (c) Mia Sanabria's primary-source confirmation of her DBPR license # and NAR / local-board membership status, (d) any outside agency review of TCPA/CCPA/GDPR posture once the GHL form endpoint actually transmits messages. Any production-cutover (`miasanabriarealtor.com`) gate should require all four signoffs in writing.

**Dissent recorded:** none from Team 8. The closest thing to dissent is a soft note that the "informally available residences" pattern (R4) is well-hedged but invites scrutiny — if Mia ever wants to dial the language down further to "introductions limited to the residences her current relationships surface", that would tighten further without losing positioning. Not a blocker; preference call.
