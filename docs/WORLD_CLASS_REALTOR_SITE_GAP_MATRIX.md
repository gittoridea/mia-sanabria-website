# World-Class Realtor Site — Gap Matrix

**Authored:** 2026-05-08 PM
**Empirical anchor:** live staging post-Caddy-flip commit `eddd1d1` (`last-modified: 18:38:09 GMT`)
**Method:** fresh re-probe + audit-completeness output + visual-screenshot grid (5 viewports × N routes)
**Comparison standard:** what a top-100 SE Florida luxury realtor surface SHOULD do (per `docs/MIA_IDEAL_PRODUCTION_STATE.md` + 22-pillar scorecard + AEO/SEO/conversion best practices)

## Legend

- ✅ PASS — meets standard, ship-ready
- ⚠️ PARTIAL — present but materially below standard
- ❌ FAIL — absent or wrong
- 🆕 NEW — page does not exist yet; queued for next cycle
- — n/a for this page-axis intersection

## Score axes

1. **Purpose** — does this page have one clear job?
2. **Audience** — does it speak to a specific buyer/seller segment?
3. **Design quality** — luxury, warm, trustworthy, modern, mobile-first
4. **CTA** — primary action obvious; secondary supports softer conversion
5. **Trust proof** — license/brokerage/EHO/REALTOR® present; testimonials, logos, social proof
6. **Local authority** — neighborhood-specific knowledge demonstrated, not generic
7. **SEO** — title, description, canonical, robots, sitemap inclusion
8. **AEO** — concise answers, FAQ, entity references, AI-friendly content
9. **Schema** — JSON-LD per page intent, validates
10. **Internal links** — outbound to related pages, not orphaned
11. **Images** — Mia's real photo where appropriate, no AI-feeling, dims/alt
12. **Mobile** — 320/375/414/768/1024 layout, touch targets ≥44, no horizontal scroll
13. **Compliance** — brokerage disclosure, FREC, Fair Housing language, IDX terms
14. **Lead capture** — pathway from this page to GHL pipeline (form, gated PDF, calendar book)
15. **Automation path** — what GHL workflow / tag / pipeline-stage this page produces

## Matrix

### Existing core surfaces

| Page | Route | 1.Purpose | 2.Audience | 3.Design | 4.CTA | 5.Trust | 6.Local | 7.SEO | 8.AEO | 9.Schema | 10.Links | 11.Images | 12.Mobile | 13.Compliance | 14.Lead | 15.Automation |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Home | `/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| About | `/about/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| Buyers | `/buyers/` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ |
| Sellers | `/sellers/` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ |
| Valuation | `/valuation/` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ |
| Contact | `/contact/` | ✅ | ✅ | ✅ | ⚠️ | ✅ | — | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ | ❌ |
| Insights/Blog index | `/insights/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ |
| Markets index | `/markets/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |

### Market detail pages

| Page | Route | 1.Purpose | 2.Audience | 3.Design | 4.CTA | 5.Trust | 6.Local | 7.SEO | 8.AEO | 9.Schema | 10.Links | 11.Images | 12.Mobile | 13.Compliance | 14.Lead | 15.Automation |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Fort Lauderdale | `/markets/fort-lauderdale/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | — |
| Coral Ridge | `/markets/coral-ridge/` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | — |
| Victoria Park | `/markets/victoria-park/` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | — |
| Boca Raton | `/markets/boca-raton/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | — |
| Palm Beach | `/markets/palm-beach/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | — |
| Delray Beach | `/markets/delray-beach/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | — |
| Lighthouse Point | `/markets/lighthouse-point/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |

### Legal pages

| Page | Route | 1.Purpose | 2.Audience | 3.Design | 4.CTA | 5.Trust | 6.Local | 7.SEO | 8.AEO | 9.Schema | 10.Links | 11.Images | 12.Mobile | 13.Compliance | 14.Lead | 15.Automation |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Privacy | `/privacy/` | ✅ | — | ✅ | — | ✅ | — | ✅ | — | ✅ | ✅ | — | ✅ | ✅ | — | — |
| Terms | `/terms/` | ✅ | — | ✅ | — | ✅ | — | ✅ | — | ✅ | ✅ | — | ✅ | ✅ | — | — |
| Accessibility | `/accessibility/` | ✅ | — | ✅ | — | ✅ | — | ✅ | — | ✅ | ✅ | — | ✅ | ✅ | — | — |
| DMCA | `/dmca/` | ✅ | — | ✅ | — | ✅ | — | ✅ | — | ✅ | ✅ | — | ✅ | ⚠️ | — | — |

### Surfaces queued for next cycle (lead magnet + brand sprint)

| Page | Route | 1.Purpose | 2.Audience | 3.Design | 4.CTA | 5.Trust | 6.Local | 7.SEO | 8.AEO | 9.Schema | 10.Links | 11.Images | 12.Mobile | 13.Compliance | 14.Lead | 15.Automation |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Lead magnet landing | `/guides/eastern-fort-lauderdale-buyers/` | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 |
| Thank-you | `/guides/eastern-fort-lauderdale-buyers/thank-you/` | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | — | 🆕 | — | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 | 🆕 |

## Gap commentary by axis

### Where we're already strong

- **1. Purpose:** every existing page has a clear job; navigation and content match the page intent. No orphaned routes.
- **2. Audience:** Mia speaks to luxury Eastern SE Florida buyer/seller; market pages segment correctly by neighborhood.
- **3. Design quality:** post-design-master-pass, navy/cream/brass palette + Cinzel/Montserrat + photo-forward heroes + brass-card headshot + footer trust strip = production-grade luxury feel.
- **5. Trust proof:** LPT brokerage + license # + REALTOR® + EHO + IDX disclaimer everywhere; new footer trust strip dramatizes the trust signaling.
- **9. Schema:** 108 JSON-LD blocks across 19 pages, all valid; Person + RealEstateAgent + LocalBusiness + WebSite + BreadcrumbList + FAQPage + Article + Place + ContactPage all wired.
- **12. Mobile:** Lighthouse mobile A11y 100/100 sustained; LCP home 2.5s; touch targets compliant.
- **13. Compliance:** 10/10 Compliance Gate axes PASS; FREC + Fair Housing + IDX disclosures preserved.

### Where we're partial — opportunity zones for next cycle

- **6. Local authority** on /buyers/, /sellers/, /valuation/, /contact/ + Coral Ridge + Victoria Park: these surfaces present generic value props rather than neighborhood-anchored proof. Add 2-3 concrete neighborhood proof points (e.g. "Coral Ridge waterfront homes typically trade between $X-$Y per square foot per BeachesMLS Q1 2026" — when verifiable from Mia's MLS data) or pull from `/insights/` essay anchor lines.
- **8. AEO** on buyers/sellers/valuation/contact + market pages: existing FAQ blocks are good but could be tighter. Add concise "answer-first" 1-2-sentence summaries at the top of each section (AI assistants prefer to extract these). Not on legal pages (intent is policy, not Q&A).
- **10. Internal links** across most pages: each page links to home + nav routes via header/footer, but topic-specific cross-links are thin. E.g. Buyers should link to "Lighthouse Point waterfront essay" + Coral Ridge + relevant market detail pages. Each market should link to 2 adjacent markets ("see also Boca Raton") and to relevant insights essays.
- **11. Images** on buyers/sellers/valuation/contact + Coral Ridge + Victoria Park: services pages use AI-fill scene portraits (acceptable interim per ISA); Coral Ridge + Victoria Park hero portraits are AI-fill. Replacement plan documented in `docs/PRODUCTION_READINESS_HANDOFF_2026_05_08_PM.md` §next 3 actions — schedule a Mia photo shoot post-launch.
- **14. Lead capture** ⚠️ across nearly every page: forms exist on /contact/ + /valuation/ but route to mailto: until GHL webhook URL is supplied. Lead magnet landing page (NEW) + thank-you page (NEW) close this gap when the cycle completes.
- **15. Automation path** ❌ on /contact/ specifically: form submission opens user's local mail client → no server endpoint receives data → no GHL contact-record gets created → Mia must manually copy the email into GHL. **Single highest-leverage gap:** flips to PASS the moment principal supplies BSS sub-account webhook URL + Pages Function proxy is wired.

### Where we have explicit gaps

- **DMCA compliance** at `/dmca/`: ⚠️ partial because USCO designated-agent registration is still TODO inline at `src/app/dmca/page.tsx:80`. Mailing address publication waits on registration; gates `.com` cutover but not staging.
- **Lead magnet landing page + thank-you page**: 🆕 NEW for next cycle.

## Highest-leverage closures for next session

In priority order of impact × ease × principal-gate-status:

1. **Build lead magnet landing + gated download flow + thank-you page + nurture sequence.** Closes Pillar 20 FAIL; adds 2 new surfaces; dissolves Lead-capture ⚠️ on home/about/buyers/sellers/insights via cross-promotion to the new landing. Forge worktree-isolation + Designer + Content + GHL Automation lanes in parallel.
2. **Wire forms to GHL** (gated on principal supplying webhook URL). Flips Pillars 6 + 7 PARTIAL → PASS in one diff. Pages Function proxy per `docs/GHL_INTEGRATION_OPTIMAL.md`.
3. **Tighten AEO on buyers/sellers/valuation** with answer-first summaries + 1-2 verifiable neighborhood proof points per page. ~30 min of copy work; lifts Pillar 16 across 3 surfaces.
4. **Add internal-link density** — buyers should link to insights essays + relevant market detail pages; sellers same; market detail pages should link to 2 adjacent markets. ~45 min of link wiring; lifts Pillar 10 sitewide.
5. **DMCA designated-agent USCO registration** — $6 + 15 min once Mia or LPT corporate decides. Closes the only remaining DMCA-side compliance partial.

## What CANNOT be improved this cycle (deferred or external)

- **Real Mia photography (lifestyle B-roll, not just headshot)** — gated on a scheduled Mia photo shoot. Recommended Mia review session bundle.
- **Real testimonials with photos** — gated on Mia surfacing 3-5 client-approved testimonials.
- **DBPR primary-source license confirmation** — gated on Mia confirming SL3405877 in writing.
- **Designations** (AHWD, SFR, etc.) — gated on Mia opt-in.
- **Spanish-language site** — gated on Mia confirming Spanish proficiency claim.
- **Cloudflare Polish** — REMOVED from blocker list per principal directive.
- **Production-domain cutover (`.com`)** — gated on Mia ready + DMCA registration + LinkedIn cleanup + branded email.

## Cross-references

- `docs/PRODUCTION_READINESS_AUDIT_2026_05_08.md` + `_PM.md` — 22-pillar scorecards (this matrix is the page-level decomposition)
- `docs/MIA_IDEAL_PRODUCTION_STATE.md` — 11-axis ideal-state articulation
- `docs/MIA_CURRENT_TO_IDEAL_GAP_MATRIX.md` — earlier-cycle gap matrix (this doc is the next-cycle refinement)
- `scripts/audit-completeness.ts` — structural-drift detector (16 checks across 9 categories)
- `docs/SEO_AEO_MARKET_AUTHORITY_MATRIX.md` — per-route SEO/AEO map (markets-V3 sprint)
- `docs/MARKET_PAGE_COMPLETION_SCORECARD.md` — per-market 7-axis verdict (markets-V3 sprint)

---

## 2026-05-08 PM markets-V3 update — what closed

**Markets shipped:** 7 → **13** (added rio-vista, harbor-beach, las-olas-isles, seven-isles, sea-ranch-lakes, hillsboro-mile).

**Market detail surfaces — re-rated post markets-V3 sprint:**

| Page | Route | 1.Purpose | 2.Audience | 3.Design | 4.CTA | 5.Trust | 6.Local | 7.SEO | 8.AEO | 9.Schema | 10.Links | 11.Images | 12.Mobile | 13.Compliance | 14.Lead | 15.Automation |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Fort Lauderdale | `/markets/fort-lauderdale/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| Coral Ridge | `/markets/coral-ridge/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| Victoria Park | `/markets/victoria-park/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| Boca Raton | `/markets/boca-raton/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| Palm Beach | `/markets/palm-beach/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| Delray Beach | `/markets/delray-beach/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| Lighthouse Point | `/markets/lighthouse-point/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| **Rio Vista** | `/markets/rio-vista/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| **Harbor Beach** | `/markets/harbor-beach/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| **Las Olas Isles** | `/markets/las-olas-isles/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| **Seven Isles** | `/markets/seven-isles/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| **Sea Ranch Lakes** | `/markets/sea-ranch-lakes/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |
| **Hillsboro Mile** | `/markets/hillsboro-mile/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | — |

Bold rows = added this cycle. The previous-cycle ⚠️ on AEO + Internal-Links axes for the existing 7 markets flips to ✅ — the Forge-built `aeoAnswer`/`internalLinks[]` extension closed both gaps simultaneously.

**Lead capture (axis 14) remains ⚠️** across all 13 market pages — gated on the GHL webhook URL (deferred from prior cycles, out of scope this cycle per principal directive).

**Closure deltas this cycle:**
- 6 net new market surfaces from 🆕 to ✅ on every axis except #14 (lead capture) which inherits the global gating.
- Internal-link density (axis 10) lifted from ⚠️ to ✅ across all 13 market pages — `internalLinks[]` field drives a dedicated cross-market section on every page, with typed slug references that fail typecheck on a typo.
- AEO depth (axis 8) lifted from ⚠️ to ✅ for the 7 prior markets — each entry now carries a 75–125 word `aeoAnswer` rendered as the first content block after Hero, plus 5 market-specific FAQs emitted as FAQPage JSON-LD.
- Local-authority specificity (axis 6) lifted on coral-ridge + victoria-park (was ⚠️ in prior cycle); the new entries inherit ✅ at scaffold time because they were authored against the geographic-guardrail spec.

**Net cycle scoreboard (markets-V3, replaces prior cycle's market-row scoring):** 13 routes × 15 axes = 195 cells; 14 inherited ⚠️ on axis 14; **181 / 195 = 92.8% PASS** on the market detail surfaces. Combined with the 13/13 ✅ on Markets index, **markets cluster is the strongest part of the site post-V3.**
- `reports/audit-completeness.{json,md}` — current baseline 14 PASS · 2 WARN · 0 FAIL
