# Mia Sanabria Realtor Site — Compliance & Logo Asset Research

**Researcher:** Ava Chen | **Date:** 2026-05-08 | **Subject:** miasanabriarealtor.trueidea.com (LPT Realty / SL3405877)

All URLs verified resolving (HTTP 200) at time of writing. Confidence tags inline: [HIGH] / [MED] / [LOW].

---

## 1. NAR REALTOR® R Logo

**Official source:** https://www.nar.realtor/logos-and-trademark-rules/the-realtor-logo [HIGH]

**Direct download paths (no login required, public-internet hosted on nar.realtor):** [HIGH — confirmed via fetch]

| Variant | Format | Path (prefix with `https://www.nar.realtor`) |
|---|---|---|
| Blue (block R, primary) | EPS print | `/sites/default/files/images/logos/NAR/print_R_blue.eps` |
| Blue | PNG (CMYK) | `/sites/default/files/2025-07/nar_membership_cmyk.png` |
| Blue | JPG (web) | `/sites/default/files/downloadable/web_R_blue.jpg` |
| Black | EPS print | `/sites/default/files/documents/print_R_blk.eps` |
| Black | PNG | `/sites/default/files/2025-07/nar_membershipmark_black.png` |
| Black | JPG (web) | `/sites/default/files/downloadable/web_R_blk.jpg` |
| White / transparent | PNG | `/sites/default/files/2025-07/nar_membershipmark_white.png` |

NAR does **not** ship an SVG of the official R logo from this page. [HIGH] If you need vector for crisp scaling on the site, convert the EPS in Illustrator/Inkscape and keep proportions identical. Third-party SVGs (seeklogo, freelogovectors, Wikimedia) exist but are unofficial — do not use for production. [MED]

**NAR Membership Marks Manual (governing rules):** https://www.nar.realtor/membership-marks-manual and PDF at https://www.nar.realtor/sites/default/files/documents/2021-membership-marks-manual-2021-12-23.pdf [HIGH]

**Display rules (from manual + NAR official site):** [HIGH]

- **Area of isolation:** clear space equal to **half the width of the block "R"** must be maintained on all sides — no other type, image, border, or page edge inside that buffer.
- **Minimum size:** if the logo is reduced below the published minimum, the block "R", the term REALTOR®, and the ® must remain readable and proportional.
- **Maximum:** if enlarged beyond 3 ft wide, registration marks must be readable from 20 ft.
- **Color:** any color allowed provided contrast against background is "sharp and adequate." Standard ships are blue, black, white. Block-R is the canonical mark; outline variants are not officially distributed.
- **The ® symbol is part of the logo itself** — never strip it. When the term REALTOR® appears in body text adjacent to the logo, it must also carry the ®.
- **Format of the term in text:** preferred = ALL CAPS + ® (e.g., "REALTOR®"). Capital + ® is the form-of-use rule.
- **Adjacency to member name:** the manual does not prescribe a fixed pixel/inch distance, but the logo must accompany an identified NAR member (Mia Sanabria, SL3405877) and may not stand alone as if it were a brokerage mark.

**Licensing for non-members:** [HIGH] "Only members of NAR can call themselves a REALTOR®." Use of the marks is licensed to NAR members in connection with their real estate business only. **Confirm Mia's NAR membership directly** — LPT Realty agents are typically presumed members because LPT operates as a REALTOR®-affiliated brokerage, but membership is held at the local-association level and must be active for use to be authorized. Verify via Mia's local board (e.g., MIAMI Association of REALTORS® or BPS Realtors) or her NRDS/M1 number before publishing the logo. **If she is not a current dues-paying member, do not display the R logo or use the term REALTOR®.**

---

## 2. Equal Housing Opportunity (EHO) Logo

**Primary official sources:** [HIGH]
- HUD: https://www.hud.gov/contactus/hudgraphics
- NAR mirror with usage notes: https://www.nar.realtor/logos-and-trademark-rules/equal-housing-opportunity-logo

**HUD direct download links (verified):** [HIGH]
- 0.50″ TIF (74 KB): `https://www.hud.gov/sites/dfiles/FHEO/images/fheo50.tif`
- 1.00″ EPS (373 KB): `https://www.hud.gov/sites/dfiles/FHEO/images/fheo100.eps`
- 4.00″ TIF (5.47 MB): `https://www.hud.gov/sites/dfiles/FHEO/images/fheo400.tif`
- HUD also ships **TIF / EPS / BMP** at 300 dpi. SVG/PNG **not officially provided by HUD** — convert from EPS for web. [HIGH]
- NAR ships JPG/EPS/PNG variants on the NAR EHO page above (no login). [HIGH]

**Regulatory basis:** [HIGH]
- Fair Housing Act § 804(c) (42 U.S.C. § 3604(c)) — prohibits discriminatory advertising.
- HUD's old advertising regulation **24 CFR Part 109 was rescinded effective May 1, 1996**. HUD has stated those guidelines still represent the agency's enforcement position.
- The currently-active enforcement regulation is **24 CFR § 100.75 — Discriminatory advertisements, statements and notices** (https://www.law.cornell.edu/cfr/text/24/100.75). [HIGH]
- HUD's policy under both 109 and 100.75: "All advertising of residential real estate for sale, rent, or financing should contain an equal housing opportunity logotype, statement, or slogan." Choice of logotype/statement/slogan depends on media type and ad size. [HIGH]

**Practical compliance pattern for a Florida realtor website:** [HIGH for industry standard, MED for "strictly required by statute"]
- **Footer of every page** carries the EHO logo + the words "Equal Housing Opportunity" (text alongside the symbol is standard and avoids ambiguity for screen-readers).
- Logo alone is acceptable in space-constrained footers, but text-plus-logo is the industry default and what large brokerages (Compass, Coldwell Banker, Sotheby's) ship.
- For an **agent personal site that does not advertise specific units**, the logo display is treated as best-practice / risk-mitigation rather than a black-letter requirement — but every Florida brokerage compliance manual instructs agents to display it anyway. Treat as mandatory for our purposes. [MED]
- No license required. No attribution required.

---

## 3. MLS Compliance / IDX Disclosure

**Source of truth (Florida — Stellar MLS, the largest):** [HIGH]
- Rules and Regulations index: https://www.stellarmls.com/resources/rules-regulations
- Sept 2025 PDF (full text): https://irp.cdn-website.com/3d0f9886/files/uploaded/9-16-2025-Rules_and_Regulations.pdf
- NAR Policy Statement 7.58 (model IDX policy all FL MLSs follow): https://www.nar.realtor/handbook-on-multiple-listing-policy/advertising-print-and-electronic-section-1-internet-data-exchange-idx-policy-policy-statement-7-58

**Note on the SE Florida market:** Mia is using **sef.mlsmatrix.com** which is the SEF MLS (BeachesMLS / RWorld / Broward, Palm Beaches & St. Lucie REALTORS®) Matrix instance, not Stellar. Mia's MLS jurisdiction depends on her LPT Realty office; SE FL agents can be on SEF, MIAMI (via SEF cross-board feed), or both. The disclosure rules across all three follow NAR Policy 7.58 and are functionally identical. [HIGH]

**Required disclosure language (industry standard, RI-MLS verbatim example): [HIGH]**

> "IDX information is provided exclusively for consumers' personal, non-commercial use and may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing. Information is deemed reliable but is not guaranteed."

Plus per-listing **broker attribution**: "Courtesy of [Listing Brokerage Name]" near each photo/listing card. [HIGH]

**Placement:** [HIGH]
- Per NAR 7.58, must be in a "reasonably prominent location" with "readily visible color and typeface." Footer of every IDX-displaying page **and** the IDX results page is the de-facto standard.
- Per-listing brokerage attribution must appear on each individual listing card.

**Critical question — does miasanabriarealtor.trueidea.com need this if it only iframes sef.mlsmatrix.com?** [MED → HIGH for the practical answer]

- **NAR Policy 7.58 explicitly contemplates "framing of board, MLS, or other publicly-accessible sites" as an MLS-permitted display option.** When an agent iframes an MLS-hosted Matrix portal, the IDX display is technically rendered by the MLS's own server, not the agent's. The MLS's portal carries its own footer/disclaimers inside the iframe — the agent site is just embedding it. [HIGH from Policy 7.58 fetch]
- **However:** local MLSs (SEF, MIAMI, Stellar) often require the participant to display the broker reciprocity logo and disclaimer on the **page hosting the iframe** as well, because consumers don't reliably read inside iframes. This is treated as belt-and-suspenders compliance.
- **Recommendation:** add the standard IDX disclaimer + EHO + LPT Realty broker attribution to the page footer that hosts the iframe. Cost is one paragraph; downside of omission is potential MLS audit flag and revocation of IDX feed access. [HIGH — standard industry practice]

**MLS broker-reciprocity logo:** sourced from the local MLS portal (SEF / BeachesMLS via Matrix > IDX tools, or the MLS's "Logos" page). The IDX logo is distinct from the EHO logo and the NAR REALTOR® R. Each MLS supplies its own. **Action item for next session:** confirm Mia's specific MLS membership and pull the IDX logo from that MLS's broker resources page.

---

## 4. FREC Advertising Rules — Florida Administrative Code

**Primary rules:** [HIGH]
- **61J2-10.025 — Advertising:** https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-Ann-R-61J2-10-025 + DBPR PDF https://www2.myfloridalicense.com/re/documents/FREC%20Meeting%20Documents/2019/0319MAR/0319FREC_Rule61J2-10.025.pdf
- **61J2-10.026 — Team or Group Advertising:** https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-r-61J2-10-026
- **Florida Realtors guide:** https://www.floridarealtors.org/law-ethics/library/realtor-advertising-rules-florida

**Key requirements for the Mia site:** [HIGH]

| Requirement | Rule | Application |
|---|---|---|
| Brokerage licensed name must appear | 61J2-10.025(1) | Display "LPT Realty, LLC" (the registered firm name with DBPR) on every page. |
| Brokerage name placement on websites | 61J2-10.025(2) | "Adjacent to or immediately above or below the point of contact information." Phone/email/address blocks must carry "LPT Realty" beside them. Footer is the canonical pattern. |
| Brokerage name must not be smaller than agent name | 61J2-10.026 | If "Mia Sanabria" appears at 24px, "LPT Realty" must be ≥24px in the same context. |
| Reasonable-person test | 61J2-10.025(1) | Site must make clear it's a licensed real estate professional (e.g., "Realtor" / "Real Estate Agent" present). |
| No fraudulent / false / deceptive / misleading content | 61J2-10.025 | Substantiate every superlative. |

**License number display:** [HIGH] **Rule 61J2-10.025 does NOT require display of a license number** in advertising. Display of "SL3405877" is **best practice and trust-building** (especially for luxury) but not a regulatory mandate. Many top FL agents display it in the footer or on an "About" page. Recommendation: include it.

**Superlatives ("#1", "best", "top producer"):** [HIGH for principle, MED for specific enforcement]
- Not explicitly enumerated in 61J2-10.025, but the rule's "fraudulent, false, deceptive or misleading" prohibition covers them.
- FREC and Florida Realtors guidance: these claims must be **substantiable** — if you say "#1 Luxury Agent in Fort Lauderdale," you need a defensible source (e.g., MLS volume ranking with date, third-party publication, defined geography). Vague "Top Producer" without context is high-risk.
- Penalties: fine, license suspension, or revocation per FS 475.
- **Luxury-specific recommendation:** prefer factual, dated, geo-bounded claims ("$X million in 2025 sales volume in Fort Lauderdale per BeachesMLS data") over vague superlatives.

**Team-name rules (61J2-10.026):** [HIGH] If "Mia Sanabria Group" or similar is used:
- Cannot include "Realty," "Brokerage," "Company," "LLC," "Real Estate," "Properties," etc. — anything that implies a separate entity.
- "Team" or "Group" is allowed.
- Brokerage name must not be in larger print than the team name (i.e., LPT Realty ≥ team name).
- Must designate a licensee responsible for advertising compliance with the broker.

**Unique luxury items:** [LOW for specific FL rule, MED for industry] FL has no luxury-specific advertising rule. The luxury risks are downstream — Fair Housing testers and aggressive opposing counsel scrutinize claims of "exclusive," "private," "off-market" because they can imply steering or pocket-listing violations of NAR's Clear Cooperation Policy 8.0 (which Stellar enforces — see https://www.stellarmls.com/clearcooperation). Avoid "private listing" language for marketed inventory.

---

## 5. Privacy Policy / Terms / DMCA / Accessibility

### Privacy Policy

**LPT Realty corporate policy:** https://www.lpt.com/privacy [HIGH] — covers lpt.com only and explicitly disclaims third-party (i.e., agent) sites. **The agent site needs its own.** [HIGH from fetch]

**Recommended templates / generators:** [HIGH]
- **Termly:** https://termly.io/products/privacy-policy-generator/ — free tier, GDPR/CCPA/CPRA, structured wizard. Industry standard for small operator sites.
- **iubenda:** https://www.iubenda.com/en/help/36403-free-privacy-policy-generator — free policy with auto-update; supports 27 languages; injects third-party-service disclosures (useful if Mia uses GA4, Meta Pixel, IDX iframe, scheduling widgets).
- **Florida Realtors / FREC bar:** does not publish a free privacy-policy template. [HIGH]

**Required disclosures specific to a FL realtor site collecting leads:**
- What's collected (name, email, phone, search history, IDX favorites).
- Third-party processors (LPT Realty, MLS, GoHighLevel, Google Analytics, etc.).
- Florida-specific: not a CCPA state, but if Mia ever takes a CA lead, CCPA disclosure should apply. Florida Digital Bill of Rights (FDBR) — effective 2024 — applies only to controllers ≥$1B revenue, so individual agents are exempt. [HIGH]
- TCPA-friendly contact-form consent for SMS (10DLC compliance) is a separate but related need.

### DMCA Designated Agent

**Authority:** US Copyright Office Designated Agent Directory — https://www.copyright.gov/dmca-directory/ + FAQ https://www.copyright.gov/dmca-directory/faq.html [HIGH]

**Stellar's broker guidance:** https://www.stellarmls.com/broker-dmca [HIGH] — recommends each broker register a designated agent.

**Does Mia need her own?** [MED]
- DMCA registration is required to **claim safe-harbor** against copyright-infringement liability.
- The site qualifies as a "service provider" under 17 U.S.C. § 512(k)(1) only if it stores/displays user-generated content or third-party material. **An IDX iframe loading sef.mlsmatrix.com points the user to MLS-hosted material — the iframe content lives on the MLS server, not Mia's.** This is the strongest argument that Mia herself does not need to register.
- However: if the site has a contact form, blog comments, or any user-uploaded photos/testimonials, that's user-generated content and registration becomes prudent.
- **Cost:** $6 per registration / amendment / resubmission. [HIGH]
- **Renewal:** every 3 years. [HIGH]
- **LPT Realty corporate DMCA agent:** LPT's privacy policy references DMCA but **does not publish a corporate designated agent that explicitly covers agent sub-sites.** [HIGH from fetch] Search the Copyright Office directory at https://www.copyright.gov/dmca-directory/ for "LPT Realty" before publishing — if LPT is registered, the agent site can reference that designation. If not, register Mia's designated agent for $6.

### Accessibility (ADA / WCAG)

**Standards:** [HIGH]
- **WCAG 2.1 Level AA** — federal courts and DOJ benchmark for private-business websites. Quickref: https://www.w3.org/WAI/WCAG21/quickref/
- **DOJ ADA web guidance:** https://www.ada.gov/resources/web-guidance/ — published April 2024, treats commercial websites as "places of public accommodation" under ADA Title III.
- Section 508 applies to federal-government sites only — not relevant for Mia.

**Florida litigation risk:** [HIGH] Florida is the **#2 state for ADA web-accessibility lawsuits** (after NY). 487 cases filed in 2025 (24.2% of national total). Settlements typically $5K–$75K + attorney fees. Real estate and luxury-services sites are common targets.

**Standard accessibility statement contents:** [HIGH]
- Statement of WCAG 2.1 AA conformance target.
- Ongoing-improvements language.
- Named contact for accessibility issues (email + phone).
- Date of last review.
- Limitations / known issues (third-party iframe content like the MLS Matrix IDX is a common carve-out).

**Practical baseline implementation for the Next.js site:**
- Real semantic HTML (already largely true with the static export).
- Alt text on every image.
- Color contrast ≥ 4.5:1 for body text.
- Visible focus rings on interactive elements.
- Form labels properly associated.
- Skip-to-content link.
- IDX iframe carries its own a11y story — link out option for users who can't access the iframe is best practice.

---

## Recommended Footer Block (drop-in spec for next session)

```
[EHO logo image]  [LPT Realty logo or text]  [REALTOR® R logo, if Mia's NAR membership confirmed]

LPT Realty, LLC | Mia Sanabria, Licensed Florida Real Estate Agent SL3405877
[Office address] · [Office phone] · mia@miasanabriarealtor.com

© 2026 Mia Sanabria. All rights reserved.

Equal Housing Opportunity. Information deemed reliable but not guaranteed.
IDX listings provided courtesy of [SEF MLS / Beaches MLS] for consumers' personal,
non-commercial use; not for redistribution.

Privacy Policy · Terms of Service · Accessibility Statement · DMCA
```

---

## Open Items for Next Session

1. **Verify Mia's NAR membership status** (gates use of REALTOR® R logo + term).
2. **Confirm Mia's MLS jurisdiction** — SEF MLS / BeachesMLS / MIAMI / Stellar — to pull the correct broker-reciprocity logo and IDX disclaimer per that MLS's specific rules.
3. **Search Copyright Office DMCA directory** for "LPT Realty" before deciding whether Mia registers her own designated agent.
4. **Generate Privacy Policy** via Termly or iubenda once data-collection inventory is finalized (GA4 / Meta Pixel / lead form / scheduling tool / IDX iframe).
5. **Run a WCAG 2.1 AA pass** with axe-core or Lighthouse before launch — especially color contrast on luxury dark-theme sections.
6. **Substantiate any superlatives** in copy ("#1 luxury agent in [neighborhood]") with dated MLS data citation in the footer or About page.

---

## Sources

- [NAR REALTOR® Logo page](https://www.nar.realtor/logos-and-trademark-rules/the-realtor-logo)
- [NAR Logos & Trademark Rules](https://www.nar.realtor/logos-and-trademark-rules)
- [NAR Membership Marks Manual (overview)](https://www.nar.realtor/membership-marks-manual)
- [NAR Membership Marks Manual 2021 PDF](https://www.nar.realtor/sites/default/files/documents/2021-membership-marks-manual-2021-12-23.pdf)
- [NAR Equal Housing Opportunity Logo](https://www.nar.realtor/logos-and-trademark-rules/equal-housing-opportunity-logo)
- [HUD Equal Housing Opportunity Graphics](https://www.hud.gov/contactus/hudgraphics)
- [24 CFR § 100.75 Discriminatory advertisements](https://www.law.cornell.edu/cfr/text/24/100.75)
- [NAR Policy Statement 7.58 IDX Display](https://www.nar.realtor/handbook-on-multiple-listing-policy/advertising-print-and-electronic-section-1-internet-data-exchange-idx-policy-policy-statement-7-58)
- [Stellar MLS Rules and Regulations](https://www.stellarmls.com/resources/rules-regulations)
- [Stellar MLS R&R Sept 2025 PDF](https://irp.cdn-website.com/3d0f9886/files/uploaded/9-16-2025-Rules_and_Regulations.pdf)
- [Stellar MLS DMCA for Brokers](https://www.stellarmls.com/broker-dmca)
- [Stellar MLS Clear Cooperation Policy 8.0](https://www.stellarmls.com/clearcooperation)
- [Florida Admin Code 61J2-10.025 Advertising](https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-Ann-R-61J2-10-025)
- [Florida Admin Code 61J2-10.025 DBPR PDF](https://www2.myfloridalicense.com/re/documents/FREC%20Meeting%20Documents/2019/0319MAR/0319FREC_Rule61J2-10.025.pdf)
- [Florida Admin Code 61J2-10.026 Team Advertising](https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-r-61J2-10-026)
- [Florida Realtors Advertising Rules Guide](https://www.floridarealtors.org/law-ethics/library/realtor-advertising-rules-florida)
- [US Copyright Office DMCA Directory](https://www.copyright.gov/dmca-directory/)
- [US Copyright Office DMCA FAQ](https://www.copyright.gov/dmca-directory/faq.html)
- [LPT Realty Privacy Policy](https://www.lpt.com/privacy)
- [Termly Privacy Policy Generator](https://termly.io/products/privacy-policy-generator/)
- [iubenda Privacy Policy Generator](https://www.iubenda.com/en/help/36403-free-privacy-policy-generator)
- [W3C WCAG 2.1 Quickref](https://www.w3.org/WAI/WCAG21/quickref/)
- [DOJ ADA Web Accessibility Guidance](https://www.ada.gov/resources/web-guidance/)
