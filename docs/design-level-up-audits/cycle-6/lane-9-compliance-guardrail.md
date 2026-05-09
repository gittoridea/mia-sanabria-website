=== AUDIT_START ===
# Lane 9 — COMPLIANCE GUARDRAIL — Cycle 6 Findings

## Finding 1 — Unverified Florida license number is rendered in production footer output
- **Severity:** high
- **Page/Component:** [src/lib/mia.ts](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts), [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx)
- **Observation:** `MIA.unverified.licenseNumber` is still set to `"SL3405877"` and rendered whenever truthy, so the footer currently displays `FL Sales Associate License #SL3405877` despite the register noting this is still an `OPEN` factual gate for DBPR primary-source verification.
- **Recommended fix:** Keep the field null (or empty) until principal confirms DBPR primary-source proof, then render only after confirmation status flips.
- **Validation:** audit check that built HTML never contains `FL Sales Associate License #` while DBPR proof flag is pending.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** One Sotheby’s — publishes only confirmed licensure facts in trust blocks and avoids placeholder-adjacent factual claims.

## Finding 2 — REALTOR® used descriptively rather than member-name-adjacent
- **Severity:** high
- **Page/Component:** [src/lib/site.ts](/home/torrey/code/mia-sanabria-website/src/lib/site.ts), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx)
- **Observation:** `Fort Lauderdale REALTOR®` remains a standalone descriptive phrase in positioning/title strings and metadata, which conflicts with the member-name-adjacent format required by NAR usage guidance and documented in open cards.
- **Recommended fix:** keep this slot as `Mia Sanabria, REALTOR®` (or other member-name adjacency) and avoid location-first standalone REALTOR® constructs.
- **Validation:** regex scan across metadata/title strings for `/Fort Lauderdale REALTOR®/i` and manual legal copy review.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** Ryan Serhant — trademark language stays member-name-adjacent in hero and metadata patterns.

## Finding 3 — Trademark casing drift in SEO keywords
- **Severity:** medium
- **Page/Component:** [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx)
- **Observation:** metadata keyword list includes lowercase `"realtor"` and mixed-case variants, while compliance guidance and current design system usage require strict `REALTOR®` treatment when referenced as a member term.
- **Recommended fix:** normalize the keyword term to a compliant form (or remove from non-strategic fields to avoid misuse context).
- **Validation:** metadata lint assertion on canonical keyword/term casing and regression diff in `metadata.alternates` output.
- **Safe to implement now:** yes
- **Principal-approval required:** no
- **Benchmark:** The Carroll Group — strict metadata hygiene and title/term consistency to avoid brand/legal drift.

## Finding 4 — TRUST MARK stack still uses potentially combined REALTOR®+MLS logo treatment
- **Severity:** high
- **Page/Component:** [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx)
- **Observation:** `/logos/realtor-r.png` is rendered as the REALTOR® trust mark, while the register flags Card 5 as pending regarding combined REALTOR®/MLS attribution handling and confirmed provenance.
- **Recommended fix:** use a pure NAR REALTOR® mark only when confirmed and separate MLS markography into a distinct, attribution-correct stack.
- **Validation:** visual/a11y diff + asset audit verifying no blended trademark composition before `.com` staging cutover.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** One Sotheby’s — separates trusted affiliation marks into discrete, non-merged logo blocks.

## Finding 5 — IDX disclaimer lacks brokerage/MLS attribution specificity
- **Severity:** medium
- **Page/Component:** [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx)
- **Observation:** Footer has a generic IDX sentence (`...provided for personal use...`) but no clear per-market/affiliate attribution language (courtesy/hosting context), which weakens policy-facing defensibility for broker reciprocity and IDX disclosure posture.
- **Recommended fix:** add explicit IDX source/context disclosure language and broker attribution wording adjacent to the IDX presence area or market surfaces.
- **Validation:** compliance script check for broker-attribution phrase patterns on IDX-related routes plus manual legal review.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** Tim Elmes — uses explicit IDX/legal disclosure blocks alongside housing inventory presentation.

## Finding 6 — Contact + valuation leads still submit through `mailto:` (no governed intake posture)
- **Severity:** high
- **Page/Component:** [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx)
- **Observation:** both lead forms still use `action={mailto:...}` which bypasses controllable server-side compliance controls (audit logging, consent record retention, suppression controls).
- **Recommended fix:** route submits through approved intake endpoint (GHL or equivalent) with required data handling + retention controls before production; retain mailto only as explicit staging fallback text.
- **Validation:** integration test ensuring no `mailto:` action on live routes and submit event logs include request IDs/time + source IP hash.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** Ryan Serhant — mature agent sites keep form data in controlled intake pipelines rather than direct `mailto:` handoffs.

## Finding 7 — TCPA/consent mechanics absent despite consent-proximity copy
- **Severity:** high
- **Page/Component:** [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx)
- **Observation:** copy states consent conditions but there are no explicit per-number authorization checkboxes, signature capture, timestamp, channel-specific opt-in, or audit evidence in the form schema.
- **Recommended fix:** add required channel-specific consent controls and server-side proof of assent before claiming any TCPA-aligned handling; do not phrase compliance by prose alone.
- **Validation:** legal-compliance QA test that form payload includes explicit consent flags, timestamp, IP/device metadata and route-level consent policy.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** Tim Elmes — production-grade lead capture includes explicit, auditable consent mechanics before messaging opt-ins.

## Finding 8 — Off-market phrasing can imply non-compliant private-listing pathways
- **Severity:** medium
- **Page/Component:** [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/lib/markets.ts](/home/torrey/code/mia-sanabria-website/src/lib/markets.ts)
- **Observation:** phrases like “informally available opportunities,” “privately offered residences,” and “informally available residences her network surfaces” may imply off-market handling without bounded legal framing.
- **Recommended fix:** add a compliance-safe qualifier clarifying lawful source handling and that all opportunities are handled through compliant channels.
- **Validation:** language audit rule to detect off-market/private-listing adjacency and legal-review signoff before publish.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** The Carroll Group — luxury copy avoids open-ended private-inventory claims and keeps sourcing language transparent.

## Finding 9 — DMCA designated-agent process is still incomplete placeholder text
- **Severity:** medium
- **Page/Component:** [src/app/dmca/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/dmca/page.tsx)
- **Observation:** DMCA page explicitly calls out a TODO and incomplete contact flow (`designated-agent` and mailing address are pending), which undercuts legal completeness.
- **Recommended fix:** complete USCO designation registration details and replace placeholder address/procedural language with final agent details.
- **Validation:** compliance checklist proving DMCA section is final and non-placeholder on both staging and production snapshots.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** Ryan Serhant — DMCA notices pages are published as finalized legal endpoints, not placeholders.

## Finding 10 — Principal decision source-of-truth drift for Card 3 and design-control signals
- **Severity:** medium
- **Page/Component:** [docs/PRINCIPAL_DECISION_REGISTER.md](/home/torrey/code/mia-sanabria-website/docs/PRINCIPAL_DECISION_REGISTER.md), [docs/BRAND_SYSTEM_CONTRACT.md](/home/torrey/code/mia-sanabria-website/docs/BRAND_SYSTEM_CONTRACT.md), [src/lib/mia.ts](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts)
- **Observation:** the decision register still contains older unresolved Card 3 wording while other locked docs indicate a DECIDED luxury positioning; this mismatch can cause hidden regressions if lanes read different sources.
- **Recommended fix:** harmonize decision log states (close stale entries or add explicit supersession notes) before subsequent design proposals to prevent silent policy drift.
- **Validation:** add CI check that each lane references a single active decision source and no conflicting status remains for active scope cards.
- **Safe to implement now:** no
- **Principal-approval required:** yes
- **Benchmark:** Senada Adzem — maintains single-source design-decision docs to prevent compliance ambiguity across visual and legal passes.

=== STRUCTURED VERDICT (LAST LINE) ===
{"team":"lane-9-compliance-guardrail","verdict":"concerns","completeness":"full","top_concerns":["Unverified license handling in footer remains active despite open card status","REALTOR® mark usage/casing and trust-mark separation are not fully compliant","Lead intake remains `mailto:` with no TCPA evidence path"],"findings_count":10,"high_severity_count":5,"safe_now_count":1,"benchmark_references":10}
=== AUDIT_END ===
