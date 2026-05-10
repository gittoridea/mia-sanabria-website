# Cycle 14 — Phase 4 · Official REALTOR® / MLS / EHO Graphics Review

**Date:** 2026-05-10
**Decision:** Hold current safe footer treatment in place; document official source URLs for principal review; surface Card 5 (combined REALTOR®+MLS graphic) as still PRINCIPAL_DECISION_REGISTER pending. **No asset swap shipped this cycle.**
**Authority basis:** PRINCIPAL_DECISION_REGISTER Cards 4 + 5 are RECOMMENDATION_PENDING; the cycle prompt's explicit safe-default rule: *"If use is not clearly authorized, do not replace; instead create the review doc and keep the current safe visual treatment."*

---

## 1. Current footer/trust graphics inventory

| Asset | Path | Native size | Bytes | Status |
|---|---|---|---|---|
| LPT Realty | `public/logos/lpt-realty.png` | 1097×1097 PNG transparent | 39,518 | brokerage-canonical (supplied by LPT); white-on-transparent base; rendered `brightness-0 invert opacity-90` |
| **REALTOR® + MLS combined** | `public/logos/realtor-r.png` | 257×118 PNG transparent | 8,388 | **statutory-borderline** — combined mark blurs trademark domains; MLS membership unconfirmed in writing |
| Equal Housing Opportunity | `public/logos/equal-housing.png` | 150×161 PNG transparent | 10,224 | likely OK — rendered `brightness-0 invert opacity-90`; file size ~10 KB matches reduced-resolution PNG export |

Footer treatment (since Cycle 11): all three trust marks rendered with `brightness-0 invert opacity-90` for uniform white-on-navy monochrome silhouettes. The three assets present three different visibility outcomes on the navy footer when rendered as-is; the monochrome normalization is compliance-permitted (NAR REALTOR® "must be black, blue, or solid color"; HUD EHO permits monochrome on contrasting background; LPT canonical white-on-navy).

## 2. Asset classification

| Asset | Official? | Source authority |
|---|:-:|---|
| LPT Realty | ✅ official | Brokerage-supplied (LPT Realty corporate-canonical) |
| REALTOR® + MLS combined | ⚠️ unclear | Unknown origin; combines two distinct trademarks (NAR REALTOR® + NAR MLS service mark) into a single image — non-canonical |
| Equal Housing Opportunity | ✅ likely | Standard EHO graphic widely distributed; comparable to NAR-canonical 25 KB PNG (file is smaller, presumed reduced export) |

## 3. Official source URLs

Confirmed via WebFetch this cycle:

### NAR REALTOR® mark (separate, not combined)

- **Page:** https://www.nar.realtor/logos-and-trademark-rules/the-realtor-logo
- **Available formats:** EPS (print), PNG (web/Office), JPG (web). Three color variations: Blue, Black, Transparent. Each in standard + small.
- **Use authorization:** REALTOR® mark use is restricted to NAR members. Mia is verified-NAR-member per multiple cited public-web sources (LPT Realty agent listing pages, MLS profile pages, Klein Morgan agent legacy page) — sufficient to satisfy NAR Membership Marks Manual prerequisite, **but DBPR primary-source confirmation is the principal-decision-register Card 1 gate.**
- **Per Card 4 (RECOMMENDATION_PENDING):** descriptive usage ("Fort Lauderdale REALTOR®") at `src/lib/site.ts:21`, `src/app/about/page.tsx:59`, `src/app/contact/page.tsx:21`, `src/app/page.tsx:79` is non-compliant with NAR Membership Marks Manual ("the term must always be capitalized when referring to a member"; descriptive use "Fort Lauderdale REALTOR®" non-compliant — should read "Mia Sanabria, REALTOR®"). Cycle-5 content sprint scope.

### NAR MLS service mark

- **Page:** https://www.nar.realtor/logos-and-trademark-rules/mls-service-mark-logo
- **Available formats:** EPS, PNG, JPG (per same NAR pattern)
- **Use authorization:** NAR/MLS attribution requires confirmed MLS affiliation. **Per Card 5 (RECOMMENDATION_PENDING):** "Replace with separate NAR mark; remove MLS attribution until Mia confirms MLS affiliation/jurisdiction in writing."
- Mia's specific MLS jurisdiction (Broward MLS, RAPB+GFLR, MIAMI Association of REALTORS®, etc.) is not yet confirmed in writing. **MLS use is NOT clearly authorized.**

### HUD / NAR Equal Housing Opportunity

- **Page (NAR mirror):** https://www.nar.realtor/logos-and-trademark-rules/equal-housing-opportunity-logo
- **Available formats:** JPG (210 KB), EPS (2.02 MB), PNG (25.14 KB). TIFF not listed in NAR mirror.
- **Source-of-truth:** EHO logo is a HUD federal trademark; broker-display is a Fair Housing Act compliance requirement, not optional. The mark itself is unaffiliated with NAR membership; NAR mirrors the asset for member convenience.
- **Use authorization:** Mandated for all real-estate brokers. Always safe to display.
- **Per memory `knowledge_eho_realtor_logo_sourcing.md`:** HUD ships TIF/EPS only; the PNG fallback chain is `equalhousinglogo.com → NAR mirror → miasanabriarealtor.com images dir → NOT Wikimedia (URLs unreliable for this asset family)`.

## 4. Risk assessment per asset

### REALTOR® mark usage risk

- **Mark itself:** mid-risk (cited NAR membership, DBPR primary-source pending — Card 1)
- **Descriptive phrase form** (e.g., "Fort Lauderdale REALTOR®" in headlines/keywords): higher risk per Card 4 — NAR Membership Marks Manual prohibits descriptive usage
- **Combined display** (current `realtor-r.png` is REALTOR®+MLS combined): higher risk per Card 5 — combines two marks; correct practice is separate display

### MLS service mark usage risk

- **Mark itself:** unclear-risk — NAR/MLS attribution implies confirmed MLS membership; Mia's MLS jurisdiction not confirmed in writing
- **Combined display** (current asset): same risk as above; should be separated until membership confirmed
- **Recommendation:** keep MLS attribution OUT until membership confirmed. The current combined graphic implies dual mark authorization without source-confirmed MLS membership.

### Equal Housing Opportunity logo source

- **Mark itself:** federal trademark, unrestricted display for all brokers
- **Current asset (`equal-housing.png` 150×161, 10,224 bytes):** rendered as monochrome silhouette via `brightness-0 invert opacity-90` — visually canonical; smaller than NAR's 25 KB PNG export but reads identically on-screen
- **Risk:** low. Asset preserves the canonical EHO treatment; no claim risk.

## 5. Recommended implementation (NOT shipped this cycle)

If principal authorizes Card 5 (asset swap):

1. Download official NAR REALTOR® PNG (Black variant for monochrome footer treatment) from https://www.nar.realtor/logos-and-trademark-rules/the-realtor-logo
2. Download official HUD/NAR EHO PNG from https://www.nar.realtor/logos-and-trademark-rules/equal-housing-opportunity-logo (replace existing 10 KB asset with NAR-canonical 25 KB)
3. Place NAR REALTOR® at `public/logos/realtor-r-nar-official.png`; mark current `realtor-r.png` deprecated; switch `SiteFooter.tsx:138` import
4. **DO NOT** include any MLS asset in footer until Mia confirms MLS affiliation in writing
5. Run `audit:brand` + `audit:images` + `audit:rendered` to validate

If principal authorizes Card 4 (descriptive REALTOR® usage compliance):

1. Replace "Fort Lauderdale REALTOR®" in `src/lib/site.ts:21`, `src/app/about/page.tsx:59`, `src/app/contact/page.tsx:21`, `src/app/page.tsx:79` with "Mia Sanabria, REALTOR®" or restructured prose
2. Capitalize "REALTOR" in `src/app/layout.tsx:40` keywords
3. Update `MIA.voice.positioning` in `src/lib/mia.ts` to compliant form
4. Re-validate audit chain

**Both card resolutions are content/asset changes that require written principal authorization. Cycle 14 does not ship them.**

## 6. What requires principal/compliance review

| Item | Authority needed |
|---|---|
| Card 5 — asset swap to separate NAR REALTOR® + remove MLS combined graphic | Principal authorization to remove MLS attribution; principal authorization to swap asset |
| Card 4 — replace descriptive REALTOR® phrasing across 4 source files | Principal authorization on copy/voice change scope (Cycle-5 content sprint) |
| Card 1 — DBPR primary-source confirmation of license # SL3405877 | Principal verification in writing |
| MLS jurisdiction confirmation | Principal in-writing confirmation of which MLS (Broward / RAPB+GFLR / MIAMI Assoc) |

## 7. What can be safely changed now

**Nothing.** Per the prompt's explicit safe-default rule, we do not replace assets without clear authorization. Both Card 4 and Card 5 remain RECOMMENDATION_PENDING; current footer treatment is the documented Cycle-11 safe visual.

The EHO logo is technically replaceable with the NAR mirror's 25 KB version, but:
- The current 10 KB version renders identically on-screen at the deployed `h-10 w-auto brightness-0 invert opacity-90` size
- No compliance gain; only a +15 KB bundle delta
- Replacement adds no clarity to the trust strip

→ **Hold current EHO asset in place.**

## 8. Summary verdict

| Asset | Action this cycle |
|---|---|
| LPT Realty | Hold (safe, brokerage-canonical) |
| REALTOR® + MLS combined (`realtor-r.png`) | **Hold (NOT replaced) — Card 5 RECOMMENDATION_PENDING; current Cycle-11 monochrome treatment preserves visual without amplifying the unconfirmed-MLS claim** |
| Equal Housing Opportunity | Hold (safe; current 10 KB asset visually canonical) |
| Source URLs | **Documented for principal review** |

## 9. Forward-looking next-session prompt residual

When principal returns to Card 5 / Card 4 decisions:

- Card 5 path A (recommended): swap to separate NAR REALTOR® mark, remove MLS attribution; downstream of Mia confirming MLS jurisdiction the MLS mark can be added back as a separate asset
- Card 5 path B: leave current combined graphic in place; accept the statutory-borderline risk
- Card 4 path A (recommended): rewrite descriptive REALTOR® phrases to compliant member-name-adjacent form; capitalize keyword
- Card 4 path B: leave descriptive phrasing in place; accept the NAR Membership Marks Manual non-compliance

**No code changes shipped from this Phase 4.** Doc-only.
