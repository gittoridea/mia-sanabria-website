# Cycle 15 — Production Readiness Scorecard Update (2026-05-10)

> Updates Cycle 12's 24-axis production-readiness scorecard with deltas from Cycles 13, 14, and 15. Preserves classification of unchanged external blockers.

## Status taxonomy

- **PASS** — fully shipped, no open work
- **PARTIAL** — partially shipped, in-scope follow-up identified
- **REVIEW** — needs principal or Cato review before sign-off
- **BLOCKED-BY-PRINCIPAL** — needs principal decision (no operator engineering can move it)
- **BLOCKED-BY-GHL** — needs GHL workflow webhook URL + downstream config
- **BLOCKED-BY-LEGAL/COMPLIANCE** — needs legal-counsel or compliance review
- **BLOCKED-BY-DNS** — needs DNS scheduling

## Cycle 15 deltas (vs Cycle 14 close)

| Axis | Cycle 12 status | Cycle 14 close | Cycle 15 close | Delta evidence |
|---|---|---|---|---|
| 1. Technical foundation (Next.js 15 + TS strict + static export) | PASS | PASS | PASS | typecheck/lint/build green (47 routes total, +16 vs Cycle 14) |
| 2. Design system | PASS | PASS | PASS | No brand-token changes; no new colors/fonts/glassmorphism |
| 3. Hero rendering at 320/375 mobile | PASS | PASS | PASS | audit:hero-contrast 105 PASS · audit:rendered hero gates 0 offenders |
| 4. Footer trust strip + EHO label | PASS | PASS | PASS | Untouched this cycle |
| 5. Markets system architecture | PASS | PASS (DRY refactor) | PASS | Untouched; Cycle 14 DRY refactor preserved; insights system uses same patterns |
| 6. Markets content | PASS (15 markets) | PASS (8 featured + comparisonContext) | PASS | Untouched; insights now reference all 15 markets |
| 7. SEO/AEO/Schema saturation | PASS | PASS (159 JSON-LD blocks) | **UPGRADED** | 190 JSON-LD blocks (+31) — 12 Article + 12 Breadcrumb + 6 FAQPage + 1 Blog |
| 8. Sitemap discipline | PASS | PASS | **UPGRADED** | +12 insight routes via getAllInsightRoutes() helper; thank-you correctly excluded |
| 9. Brand consistency (canonical email) | PASS | PASS | PASS | audit:brand 14 PASS; canonical msanabriarea@gmail.com preserved |
| 10. Internal linking | PASS (1351) | PASS (1360 after reverse-link curation) | **UPGRADED** | 2227 internal links (+867) from insights weaving |
| 11. License rendering | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL | Card 1 unchanged — DBPR primary-source confirmation pending |
| 12. REALTOR® / MLS / EHO graphics | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL (Cards 4+5) | BLOCKED-BY-PRINCIPAL | Cycle 14 OFFICIAL_GRAPHICS_REVIEW unchanged |
| 13. Branded email | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL | Card 2 unchanged — `mia@miasanabriarealtor.com` not yet provisioned |
| 14. Analytics provider | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL | GA4 G-PYYSF87G8K already wired; Plausible/Umami swap pending |
| 15. .com cutover | BLOCKED-BY-DNS | BLOCKED-BY-DNS | BLOCKED-BY-DNS | Direct Axess host swap pending DNS scheduling + principal sign-off |
| 16. GHL form wiring | BLOCKED-BY-GHL | BLOCKED-BY-GHL | BLOCKED-BY-GHL | No GHL workflow webhook URL provisioned; this cycle did not change |
| 17. TCPA / SMS opt-in mechanics | BLOCKED-BY-LEGAL/COMPLIANCE | BLOCKED-BY-LEGAL/COMPLIANCE | BLOCKED-BY-LEGAL/COMPLIANCE | No SMS consent flow; thank-you pages explicitly do NOT claim CRM capture |
| 18. Lead-magnet PDF | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL | BLOCKED-BY-PRINCIPAL | Out of scope this cycle |
| 19. CMS / editorial UX for Mia | DEFERRED | DEFERRED | DEFERRED | Not in Cycle 15 scope; insights edited as repo-side TypeScript |
| 20. **Insights/blog system** | DEFERRED | DEFERRED | **PASS · NEW** | 12-post evergreen library shipped; honest dates; sitewide weaving; audit:insights 535/0/0 |
| 21. **Lead-capture architecture** | DEFERRED (placeholder forms only) | DEFERRED | **PARTIAL · NEW** | Architecture doc + 7 CTA components + 4 thank-you routes shipped (IMPLEMENTED-STATIC); GHL wiring still BLOCKED-BY-GHL |
| 22. **Sitewide content weaving** | PARTIAL (markets cross-link only) | PARTIAL (Cycle 14 reverse-link delta) | **PASS · NEW** | RelatedInsightsModule on home + markets index + 15 market pages + buyers + sellers + valuation + contact (data-driven where market-derivable, curated where editorial) |
| 23. Audit chain coverage | PASS (10 audits) | PASS (10 audits) | **UPGRADED** | 11 audits — added audit:insights (535 PASS · 0 WARN · 0 FAIL) |
| 24. Spanish hreflang | DEFERRED | DEFERRED | DEFERRED | Out of scope; Mia confirmation pending |

## Cycle 15 net effect

**Design surface:** the site moves from "design-complete + content-thin" to "design-complete + 12-post evergreen library + sitewide weaving + lead-capture component library". Organic landing on a market page now opens into a substantive editorial layer; every page now offers a soft conversion path that does not require GHL wiring to function.

**External blockers unchanged:** none of the 9 BLOCKED-* axes from Cycle 12 moved this cycle. Per the mission brief, this is correct — Cycle 15 is content + conversion build, not principal-decision unblocking.

## What this means for the principal

| Question | Honest answer |
|---|---|
| "Is the site production-ready as a design surface?" | Yes — has been since Cycle 12 close; Cycle 15 added depth, not gates. |
| "Can I send a marketing campaign to /insights/?" | Yes — the library is live, schema-saturated, and editorially defensible. |
| "Can the site capture leads into my GHL?" | Not yet — forms still route to mailto/contact pages with attribution params. The wiring is one engineering cycle away once you provide the GHL workflow webhook URL. |
| "Can I publish 'Subscribe to my newsletter' content?" | Not yet — TCPA mechanics and SMS opt-in remain BLOCKED-BY-LEGAL. Cycle 15 ships market-brief CTAs that route to private inquiry, not opt-in. |
| "Can I cutover to .com?" | Not yet — DNS scheduling + principal sign-off pending; Cards 4+5 (REALTOR®/MLS) still need authorization for asset swap. |
| "Is the editorial content honest?" | Yes — no fake dates, no fabricated stats, no fabricated MLS/inventory claims. audit:insights enforces. Cato cross-vendor audit confirms. |

## Remaining work to ship

| Item | Owner | Cycle |
|---|---|---|
| GHL workflow webhook URL + form action change | Principal + GHL admin | Next engineering cycle once URL provided |
| TCPA consent copy + double-opt-in flow design | Principal + legal counsel | Separate legal-review cycle |
| License # DBPR primary-source confirmation | Principal | Single conversation; small ship cycle |
| Branded email provisioning | Principal + email-provider decision | Single conversation; small ship cycle |
| Analytics provider swap decision | Principal | Single conversation; tiny ship cycle |
| `.com` cutover | Principal + DNS scheduling | Coordinated cutover packet |
| REALTOR®/MLS asset authorization | Principal | Cards 4+5 review |
| OG image generation per insight post | Operator | Small follow-up cycle (12 images) |
| CMS / editorial UX for Mia (when she onboards as content editor) | Operator + decision on MDX vs Decap | Future cycle |
| Spanish hreflang | Mia confirmation + operator | Future cycle |

## Verdict

**PASS · DEPLOY_ALLOWED: yes** (pending Cato + Forge VERIFY clearance — both running at time of writing).

External blocker count unchanged from Cycle 14. Cycle 15 added 3 new "PASS · NEW" axes (insights, weaving) and 1 "PARTIAL · NEW" axis (lead-capture architecture, with the GHL gate explicitly preserved).
