# Team E — Compliance Severity Classifier (Cycle 4)

## Verdict (one sentence — what's the actual launch posture?)
FAIL for public-launch readiness; three statutory-binary findings remain unresolved (brokerage adjacency, TCPA mechanics, DMCA designated-agent) and will block `.com` launch if treated as hard launch requirements.

## Severity register (top 10)
| # | Finding (1-line) | Severity | Launch impact | Source citation | File/line | Minimal fix | Cycle-4 safe? |
|---|---|---|---|---|---|---|---|
| 1 | License number renders in production-facing HTML despite ISA placeholder guard | statutory-borderline | blocks .com cutover | ISA.md:54; FREC ad-rule precision; docs/CODEX_SPARK_SYNTHESIS_REPORT.md §8.5 | [src/lib/mia.ts](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts:45), [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx:94), [src/app/terms/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/terms/page.tsx:114) | Set `licenseNumber` to `null` until Mia confirms in writing, and keep a verification flag before rendering | No |
| 2 | Footer renders an implied office address from `serviceCore` while `displayOffice` is null | statutory-borderline | blocks .com cutover | ISA.md:54; FREC advertising location accuracy principles (ad-level representation) | [src/lib/mia.ts](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts:49), [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx:91) | Remove pseudo-office until display office is explicitly confirmed, or render an explicit “office pending confirmation” placeholder | Yes |
| 3 | Brokerage name is not consistently adjacent to every contact touchpoint on intake surfaces | statutory-binary | blocks public-launch | FREC 61J2-10.025 (contact/adjacency for real-estate advertising); Florida law implementation pattern in prior cycle notes | [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx:63), [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx:81), [src/app/terms/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/terms/page.tsx:108-115) | Add “LPT Realty LLC” inline with each direct contact action and all lead form blocks before submission CTA | Yes |
| 4 | TCPA consent is declarative only; no affirmative call/SMS consent mechanism or evidence capture at form submit | statutory-binary | blocks public-launch | Fla. Stat. §501.059; FCC 2024 one-to-one TCPA interpretation; Cato §11.1 summary | [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx:190-195), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx:172-177), [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx:108-111), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx:93-97) | Add number-specific opt-in checkbox, explicit scope of contact method, and immutable consent log fields (timestamp + IP + text version) | No |
| 5 | DMCA page states designated-agent registration is in process; no final legal contact address published | statutory-binary | blocks public-launch | 17 U.S.C. §512(c)(2), §512(c)(3), §512(g), §512(f) | [src/app/dmca/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/dmca/page.tsx:69-84) | Complete USCO designated-agent registration and publish final address/procedure before public release | No |
| 6 | REALTORS®/realtor references are used as descriptive marketing language rather than membership-identity context in multiple surfaces | policy/trademark | no launch impact | NAR Membership Marks Manual; NAR IDX Policy 7.58 advisory context | [src/lib/site.ts](/home/torrey/code/mia-sanabria-website/src/lib/site.ts:21), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx:59), [src/app/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/page.tsx:59-80), [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx:44-46) | Keep REALTOR® on member identity locations only and remove geographic/descriptive modifier patterns | Yes |
| 7 | Footer still presents combined REALTOR®/MLS-style mark stack without separated mark-attribution controls | policy/trademark | no launch impact | NAR Membership Marks Manual; NAR IDX policy attribution guidance | [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx:120-126) | Replace combined graphic with distinct, approved marks and only expose MLS/REALTOR branding after confirmed membership state and attribution language | Yes |
| 8 | Root metadata uses lowercase “realtor” term in keyword set contrary to configured mark-language expectations | policy/trademark | no launch impact | NAR branding guidance (identity use + casing conventions as enforced by prior compliance notes) | [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx:40), [src/lib/site.ts](/home/torrey/code/mia-sanabria-website/src/lib/site.ts:21) | Normalize keyword values to approved identity wording while preserving discoverability | Yes |
| 9 | Privacy statement asserts GA4/GHL/Cloudflare usage patterns before actual active integration in page copy | business-risk | no launch impact | Internal cross-check in compliance gate evidence; privacy disclosure truthfulness standards | [src/app/privacy/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/privacy/page.tsx:100-150), [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx:1-3) and [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx:66-77) | Gate each vendor claim behind runtime checks or rewrite to “configured when connected” language | Yes |
| 10 | Contact and valuation lead forms still post `mailto:` only, so capture is passive and not auditable at scale | business-risk | no launch impact | Cycle-3 convergence + Cato audit convergence logs; team notes in [docs/COMPLIANCE_GATE_2026_05_08.md](#) | [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx:108-111), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx:94-97) | Replace with live endpoint/form handler wiring in a separate gated deployment phase with explicit retention and consent capture | No |

## Statutory-binary findings (must ship before public-launch, full detail per finding)

1. Brokerage adjacency on all contact points blocks public-launch (`/buyers`, `/contact`, `/valuation`) because FREC ad/agent-advertising patterns require firm-name proximity and contact context coherence, and this is presently split in footer architecture; minimum remediation is adjacency normalization (`LPT Realty LLC` beside each CTA + direct contact row + form module).
2. TCPA mechanics remain incomplete despite prose; a line stating implied consent is insufficient under Florida/TCPA posture without affirmative checkboxing, explicit number-level authorization text, and submission evidence logging; this can become non-compliant once outbound phone/SMS workflows are enabled and is still a hard risk as a stated consent claim.
3. DMCA designated-agent implementation is incomplete until USCO registration is complete; 17 U.S.C. §512(c)(2) safe-harbor posture depends on proper designated-agent publication and therefore blocks legal completion before public release.

## Statutory-borderline findings (full detail)

1. Unverified license rendering is a non-binary fact-quality question under the project’s own ISA constraints versus interpretive tolerance; the code is technically null-guarded but semantically populated, so it reads as published certainty and should be treated as blocked until confirmation language/flagging is explicit.
2. Footer office location currently reads from `serviceCore` rather than confirmed display-office metadata; this is a cross-field provenance mismatch and can overstate office-disclosure facts in brokerage context even if not an independent federal statute.

## Policy / trademark findings (full detail)

1. Descriptive REALTOR® language (e.g., “Fort Lauderdale REALTOR®” as adjectival descriptor in many UI/SEO strings) is non-statutory but marks-policy sensitive; this should be restricted to authorized identity contexts.
2. Combined mark usage in the footer (`/logos/realtor-r.png`) is a marks-policy/attribution risk; REALTOR® and MLS attribution should be separated per policy and only used when each underlying requirement is met.
3. Metadata keyword use with lowercase `realtor` is a consistency/trademark policy defect; while low legal risk, it should be normalized to avoid brand-rule drift and to prevent future policy disputes.

## License-rendering specific reading (cycle-3 §12 ambiguity)
The clearer legal/compliance interpretation for shipping is Reading B: with ISA’s placeholder requirement, rendering an unverified license number in public production is treated as not compliant because the line-level data becomes a factual assertion; therefore the conservative decision for static compliance is to render it null until Mia confirms in writing.

## TCPA mechanics specific reading (cycle-3 §11.1 finding)
Prose-only disclosure is insufficient. Under Cycle-4 synthesis context (Fla. Stat. §501.059 + 2024 FCC one-to-one consent posture), you need affirmative, capture-bound mechanics and evidence at submission; a helper paragraph alone does not satisfy call/SMS consent requirements.

## What synthesis must NOT flatten
Do not downgrade the following to generic “concerns”: 1) brokerage-adjacency gap, 2) TCPA submission mechanics gap, 3) DMCA designated-agent gap, and 4) unverified license/display-office factual rendering. These are not stylistic; two are statutory-binary and one is statutorily significant even if implementation is currently endpoint-gated.

## Anti-criteria check
- No recommendation to hardcode unverified facts. 
- No DNS / Cloudflare / GHL prod / `.com` cutover recommendation. 
- No Boca/Delray/Palm Beach county misclassification introduced. 
- No extra principal-level execution requested beyond requested classification.

## Evidence appendix
- model_used: gpt-5.3-codex-spark
- team: E Compliance Severity
- reasoning_effort: xhigh
- sandbox: read-only
- statutes/rules consulted:
  - ISA.md §Constraints line 54
  - Florida Realtors / FREC advisory rule reference used in synthesis: Rule 61J2-10.025
  - Fla. Stat. §501.059
  - 47 C.F.R. §64.1200 (TCPA context)
  - NAR Membership Marks Manual
  - NAR IDX Policy Statement 7.58
  - 17 U.S.C. §512(c)(2), §512(c)(3), §512(g), §512(f)
  - HUD Fair-Housing framing references in prior audit set
  - Local artifacts: ISA.md, docs/COMPLIANCE_GATE_2026_05_08.md, docs/codex-spark-audits/compliance-risk-audit.md, docs/CODEX_SPARK_SYNTHESIS_REPORT.md, docs/MIA_SITE_HIGH_IMPACT_UPGRADE_PLAN.md
- source files reviewed with line citations: ISA.md, src/lib/mia.ts, src/components/SiteFooter.tsx, src/app/contact/page.tsx, src/app/valuation/page.tsx, src/app/dmca/page.tsx, src/app/layout.tsx, src/app/privacy/page.tsx, src/app/terms/page.tsx, src/lib/site.ts, src/app/about/page.tsx, src/app/page.tsx

{"team":"E","verdict":"fail","completeness":"full","statutory_binary_count":3,"statutory_borderline_count":2,"policy_trademark_count":3,"business_risk_count":2,"quality_risk_count":0,"deferred_count":0,"public_launch_blockers":3,"cutover_blockers":2,"safe_to_ship_cycle_4_count":6}
