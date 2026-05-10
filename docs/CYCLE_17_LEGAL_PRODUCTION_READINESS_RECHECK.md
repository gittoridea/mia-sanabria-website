# Cycle 17 — Legal Page Production-Readiness Recheck

**Date:** 2026-05-10
**Method:** Re-read `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/` source files + the Cycle 16 audit document (`docs/CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md`) + the live `audit:legal` report. Confirm classifications still hold. No legal copy was modified in this cycle.
**Boundary:** Recheck-only. Cycle 17 does not rewrite legal copy. Cycle 17 makes only low-risk metadata/link/email corrections if any are needed; the recheck found none.

## Summary table (unchanged from Cycle 16)

| Page | Route | Cycle 16 status | Cycle 17 status | Hard blockers (staging) | Hard blockers (.com) |
|---|---|:-:|:-:|---|---|
| Privacy Policy | `/privacy/` | REVIEW | **REVIEW (unchanged)** | None | Principal-legal counsel read required |
| Terms of Service | `/terms/` | REVIEW | **REVIEW (unchanged)** | None | Principal-legal counsel read + TCPA form copy at capture surface |
| Accessibility Statement | `/accessibility/` | PASS | **PASS (unchanged)** | None | None |
| DMCA Notice | `/dmca/` | BLOCKED BY USCO | **BLOCKED BY USCO (unchanged)** | None (staging copy honest about pending registration) | USCO designated-agent registration ($6 + ~15 min principal time) |

Net: **1 PASS · 2 REVIEW · 1 BLOCKED BY USCO**. No change in classification from Cycle 16.

## `audit:legal` live results (current as of Cycle 17)

`bun run audit:legal` reports:

- **18 PASS · 1 WARN · 0 FAIL.**
- The single WARN (`legal.dmca.uscoFlag`) is the expected "USCO + in-process language present (acceptable for staging; BLOCKED for production cutover per CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md)" warning — structural, not corrective.

## Per-page recheck

### `/privacy/`

- **Metadata + canonical:** present (`<canonical>` resolves to `https://miasanabriarealtor.trueidea.com/privacy/`).
- **Footer link:** present in `FOOTER_NAV.legal`.
- **Schema:** `WebPage` + `BreadcrumbList` emit; both parse.
- **Contact email:** `msanabriarea@gmail.com` rendered (data-driven via `MIA.contact.email`).
- **Brokerage attribution:** "LPT Realty LLC" rendered (data-driven via `MIA.brokerage.legal`).
- **Last-updated date:** 2026-05-08.
- **Content coverage:** 14/14 required sections present (identity, data collection, use, legal bases, service providers, privacy rights, cookies, DNT/GPC, retention, security, COPPA, international transfers, updates, effective date).
- **Conditional GHL/GA4/Userway disclosure language:** intact and honest about current state.
- **No stale brand names:** zero "Klein Morgan" or sunandbreeze references (cleared in Cycle 14).
- **No overclaiming:** none observed.
- **REVIEW items carried:** (a) Userway script not loaded but `userwayId` set in tracking data — minor inconsistency; principal decision whether to load widget or null the ID; (b) branded email gap (post-cutover provisioning is Card 3 in PRINCIPAL_DECISION_REGISTER).

### `/terms/`

- **Metadata + canonical:** present.
- **Footer link:** present in `FOOTER_NAV.legal`.
- **Schema:** `WebPage` + `BreadcrumbList` emit; both parse.
- **Contact email:** `msanabriarea@gmail.com` rendered.
- **Brokerage attribution:** "LPT Realty LLC" rendered.
- **Last-updated date:** 2026-05-08.
- **Content coverage:** 19/19 required sections present.
- **REALTOR® mark definition:** NAR-canonical "REALTOR® is a federally registered collective membership mark..." text intact.
- **License # render:** Conditionally rendered when `MIA.unverified.licenseNumber` is truthy (currently `SL3405877`, candidate per ledger §2).
- **Governing law:** Florida (Broward County) — correct for FL REALTOR® site.
- **TCPA framework:** General recital present in Terms; form-capture-surface TCPA copy remains a Cycle 17+ prereq for production form wiring (separate from this audit).
- **REVIEW items carried:** Counsel read before `.com` cutover.

### `/accessibility/`

- **Metadata + canonical:** present.
- **Footer link:** present in `FOOTER_NAV.legal`.
- **Schema:** `WebPage` + `BreadcrumbList` emit; both parse.
- **Contact email + phone:** present (data-driven via `MIA.contact.email` + `MIA.contact.phone`).
- **Last-updated date:** 2026-05-08.
- **Content coverage:** 9/9 required sections present (commitment, what we do, AT compatibility, third-party content, reporting a barrier, reach-us contact, alternative access, ongoing improvement, effective date).
- **WCAG 2.1 AA + ADA Title III** properly cited.
- **PASS for staging.** **PASS for `.com` cutover** (no legal-counsel blocker for accessibility statement; structural completeness is the gate).

### `/dmca/`

- **Metadata + canonical:** present.
- **Footer link:** present in `FOOTER_NAV.legal`.
- **Schema:** `WebPage` + `BreadcrumbList` emit; both parse.
- **Contact email:** present.
- **Last-updated date:** 2026-05-08.
- **Content coverage:** 7/8 sections — designated agent + mailing address are PENDING USCO registration (explicit disclosure in the page).
- **17 U.S.C. § 512 citations:** complete (takedown, counter-notice, repeat-infringer, misrepresentation).
- **"In process of registering" disclosure language:** present and accurate.
- **BLOCKED BY USCO for `.com` cutover.** Carryforward action: principal-registered DMCA designated agent at https://www.copyright.gov/dmca-directory/ ($6 fee, ~15 min). On registration, page copy update (remove "in the process of registering" sentence; add designated-agent details).

## Cross-page checks

| Check | Status |
|---|:-:|
| All 4 routes in `FOOTER_NAV.legal` | ✓ |
| All 4 routes in `sitemap.xml` | ✓ |
| All 4 canonicals point to staging URL | ✓ (will flip post-cutover via `NEXT_PUBLIC_SITE_URL`) |
| All 4 have OG metadata | ✓ |
| All 4 have unique titles | ✓ |
| All 4 have schema-dts WebPage + Breadcrumb | ✓ |
| No off-brand fonts/colors | ✓ |

## Changes this cycle

**None.** No legal copy was rewritten. No metadata edits. No schema changes. No email/link corrections were needed (the canonical email `msanabriarea@gmail.com` resolves correctly; all 4 footer links resolve; all canonicals resolve).

## What blocks `.com` cutover for the legal surface

| Gate | Owner | Estimated effort |
|---|---|---|
| Principal-legal counsel read on Privacy + Terms | Principal + legal counsel | 30-60 min |
| USCO designated-agent registration | Principal | ~15 min + $6 |
| TCPA-approved form copy at form capture | Principal + legal counsel | 30-60 min |
| Branded email provisioning + Privacy/Terms email swap | Principal | ~30 min |

These are external/principal/legal blockers, not engineering blockers. The site code is ready for the legal-page surface to flip from REVIEW to PASS_FOR_CUTOVER as soon as the four gates close.

## Audit chain integration

No changes to `audit:legal` script this cycle. The Cycle 16 script remains canonical and continues to enforce structural completeness.

## Related artifacts

- Cycle 16 audit lineage: `docs/CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md`.
- Live audit: `reports/audit-legal.json` + `reports/audit-legal.md`.
- Audit script: `scripts/audit-legal.ts`.
- Decision register: `docs/PRINCIPAL_DECISION_REGISTER.md` (carries license + analytics + email + cutover gates).
