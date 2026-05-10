# Cycle 17 — Production-Readiness Remaining List

**Date:** 2026-05-10
**Status:** Snapshot at Cycle 17 close. Updates from Cycle 16 → Cycle 17 are marked in-line.

This is the explicit blocker register for moving from the live staging URL (`miasanabriarealtor.trueidea.com`) to the production `.com` cutover. Items are grouped by who-owns-them.

---

## A — Site / design / content (ready)

**Status:** ✅ Complete for staging deploy. No engineering blockers carried.

| Axis | Status | Notes |
|---|:-:|---|
| 12-post Insights library | ✅ PASS | 535 audit checks PASS; new "Market Note · `<Month>`" label (Cycle 17). |
| 15-market Markets index | ✅ PASS | Card + hero + OG + sitemap entry for every market. |
| Fort Lauderdale V3 page | ✅ PASS | Hero precision frame, prelude section, 7-card decision framework, peer pointers, anti-pattern asides, 9 FAQs, 4-CTA strip (Cycle 17 lift). |
| 6-pager Featured Markets on homepage | ✅ PASS | First-page order locked: FL, Boca, Palm Beach, Victoria Park, Lighthouse Point, Delray Beach. |
| Footer trust marks | ✅ PASS | NAR canonical REALTOR® + equalhousinglogo.com canonical EHO + LPT brand mark (Cycle 17 swap). |
| Per-post OG images | ✅ PASS | 12 unique images at `/og-insights/`. |
| Per-market OG images | ✅ PASS | 15 unique images at `/og-markets/`. |
| Hero contrast | ✅ PASS | `audit:hero-contrast:stable` 105/105 across 5 viewports. |
| Mobile responsiveness | ✅ PASS | 320 → 1440 verified per rendered + screenshot audits. |
| Audit chain | ✅ PASS | 1067 PASS · 4 WARN (all expected structural) · 0 FAIL across 15 audits. |
| Build size | ✅ Stable | 105 KB shared first-load JS; no regression from Cycle 16. |

---

## B — Needs principal decision

**Status:** 4 axes (carried unchanged from Cycle 12 Principal Decision Register). Highest-leverage move: a single ~60-90 min principal-decision session unblocks all four.

| # | Axis | Source | Estimated lift |
|---|---|---|---|
| B1 | **License rendering** — confirm DBPR-verified license # in writing OR authorize "stay current" with unverified flag | `PRINCIPAL_DECISION_REGISTER.md` Card 1 | ~15 min decision |
| B2 | **Analytics provider** — pick GA4 vs Plausible vs Umami; provide measurement ID | Card 2 | ~15 min decision + ~30 min implementation |
| B3 | **Branded email** — pick provider (Google Workspace / Zoho / Fastmail); provide MX record + inbox provisioning; swap `msanabriarea@gmail.com` references | Card 3 | ~30 min decision + ~60 min provisioning |
| B4 | **`.com` cutover sign-off** — DNS swap from current Direct Axess host to staging URL; 301 redirect plan | Card 6 | ~30 min decision + scheduled cutover |

Also surfaced this cycle (REVIEW not BLOCKER):

| # | Axis | Source | Action |
|---|---|---|---|
| B5 | **Service-area expansion** | `CYCLE_17_ABOUT_ACCURACY_RECHECK.md` | Confirm whether About should reflect a broader area than "Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach" (mission prompt suggested Palm Beach inclusion). Currently locked to Cycle 16 canonical until principal data update. |
| B6 | **Userway widget activation** | `CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md` item 3 | Either load the script in `layout.tsx` or null `MIA.tracking.userwayId`. |
| B7 | **Quarterly client-list cap** | About audit | If Mia genuinely caps load at N/quarter, principal can restore precise claim. |
| B8 | **Global listing distribution affiliate** | About audit | If Mia syndicates through Luxury Portfolio International, Christie's, etc., the "global distribution" language can be restored with a named affiliate. |

---

## C — Needs legal / compliance review

**Status:** 4 axes. All require external counsel time; cannot be operator-closed.

| # | Axis | Source | Effort |
|---|---|---|---|
| C1 | **Privacy + Terms legal-counsel review** for cutover | `CYCLE_17_LEGAL_PRODUCTION_READINESS_RECHECK.md` | ~30-60 min counsel read |
| C2 | **REALTOR® R-mark rendition principal-legal review** (NAR Membership Marks Manual) — confirm Mia's active NAR membership + rendition compliance with NAR style guidelines for the 40×40 navy footer treatment | `CYCLE_17_FOOTER_OFFICIAL_TRUST_LOGO_FIX.md` REVIEW gates | Principal + legal sign-off |
| C3 | **HUD EHO mark display permission** in current layout — public-domain HUD asset, but layout-specific rendition principal-legal sign-off | `CYCLE_17_FOOTER_OFFICIAL_TRUST_LOGO_FIX.md` REVIEW gates | Principal + legal sign-off |
| C4 | **TCPA-approved form copy** at the actual point of capture (separate from Terms general framework recital) | `CYCLE_15_LEAD_CAPTURE_ARCHITECTURE.md` + Cycle 17 prereq | Principal + legal counsel time |
| C5 | **USCO DMCA designated-agent registration** ($6 + ~15 min principal time at https://www.copyright.gov/dmca-directory/) | `CYCLE_17_LEGAL_PRODUCTION_READINESS_RECHECK.md` `/dmca/` | ~15 min principal |

---

## D — Needs GHL / ops wiring

**Status:** 1 axis. Sequence requires legal-approved TCPA copy (C4) before engineering can wire forms.

| # | Axis | Source | Effort |
|---|---|---|---|
| D1 | **GHL workflow webhook URL + sandbox test** + form action swap from mailto to live POST endpoint | `CYCLE_15_LEAD_CAPTURE_ARCHITECTURE.md` prereqs | Principal-provided webhook URL + 30-60 min engineering after C4 closes |
| D2 | **Pipeline stage names + tag taxonomy in GHL** | Card 4 (operator-defined; principal can confirm or override) | Principal confirmation |
| D3 | **Notification routing** for new inquiries | Principal-defined | Principal confirmation |
| D4 | **Thank-you / acknowledgment mechanics** | `/thank-you/buyer-brief/`, `/thank-you/valuation/`, `/thank-you/market-brief/` static routes already shipped; behavior on form submit handled in GHL workflow | Final review when GHL wired |

---

## E — Needs launch / cutover

**Status:** Operational. None block staging.

| # | Axis | Source | Effort |
|---|---|---|---|
| E1 | **`.com` DNS swap** from current Direct Axess host to the new Dokploy-hosted staging build | Cycle 12 Card 6 | Scheduled engineering after principal sign-off |
| E2 | **Canonical domain flip** via `NEXT_PUBLIC_SITE_URL` env var | `.env.production` + Dokploy variable | Single-build redeploy |
| E3 | **noindex / staging robots.txt decision** | `out/robots.txt` currently allows indexing of staging URL; production cutover should ensure single canonical domain is indexed | Operator decision at cutover time |
| E4 | **Search Console / GA4 / GBP alignment** | Google Search Console verification + analytics tag + Google Business Profile linkage | ~60 min principal time post-cutover |
| E5 | **301 redirect plan** for any legacy `miasanabriarealtor.com` URLs that need to point at new structure | Principal-defined inventory | Single Caddy/Dokploy rule batch |

---

## Summary by category

| Category | Open items | Open work-type |
|---|---:|---|
| A — Site / design / content (engineering) | 0 | Cycle 17 closed all engineering items |
| B — Principal decision | 4 hard + 4 surfaced | ~60-90 min decision session |
| C — Legal / compliance review | 5 | External counsel time |
| D — GHL / ops wiring | 4 (sequenced behind C4) | Principal-provided webhook + engineering |
| E — Launch / cutover | 5 | Scheduled rollout |

**Net:** 0 engineering blockers on staging. **18 open items** across principal / legal / GHL / cutover, none of which are reopen-Cycle-17 items.

---

## What is verified ready

The site at `miasanabriarealtor.trueidea.com` is:
- Visually production-grade per Cycle 17 audits + screenshots.
- Content-accurate per audit:about + audit:legal + audit:insights + audit:fort-lauderdale-v3 + audit:stale.
- Trademark-source-canonical per audit:trust-logos (REALTOR® from NAR, EHO from equalhousinglogo.com).
- Accessibility-conformant per audit:rendered + audit:brand + audit:hero-contrast:stable.
- Mobile-responsive per audit:rendered across 5 viewport probes.
- Build-stable per `bun run build` exit 0 across 45 routes.

What is NOT verified — and SHOULD NOT be claimed — at staging close:
- `.com` launch readiness (blocked by Section C + E gates).
- TCPA compliance (gated by C4 + D1).
- DBPR-confirmed REALTOR® member display (PUBLIC_FACT_LEDGER §2 candidate per Cycle 14 review).
- Service-area accuracy beyond the three "Eastern" canonical entries (REVIEW per B5).

## Next 3 highest-leverage actions

1. **Principal-decision session (~60-90 min).** Closes B1–B4, surfaces principal direction on B5–B8. Highest leverage by far — unblocks the largest absolute count of gates with the smallest principal time investment.
2. **USCO DMCA designated-agent registration** ($6 + 15 min). Closes C5 and lifts the `/dmca/` page from BLOCKED to PASS_FOR_CUTOVER. Smallest action, cleanest unblock.
3. **Boca Raton V2 rollout (Cycle 18).** Apply the FL V3 rollout pattern to the next-natural featured market. Pure operator work; ~3-4 hour engineering cycle; no principal-decision dependency. Documented process at `docs/CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md` + `docs/CYCLE_17_FORT_LAUDERDALE_V3_IMPLEMENTATION.md` (the new gold standard).
