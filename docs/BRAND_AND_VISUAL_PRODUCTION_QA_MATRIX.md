# Brand and Visual Production QA Matrix — Mia Sanabria Realtor Site

**Cycle:** 2026-05-08 PM cycle 4 (Spark-only production-quality correction)
**Live staging:** https://miasanabriarealtor.trueidea.com (last-modified: 2026-05-08 22:01:24 GMT, ETag `didmtu6seolc2bl8`)
**Authority:** WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 §"World-class production-company QA checklist"
**Method:** 6 Spark-only expert team audits + audit:images + audit:brand sentinels + 70 before/70 after chrome-headless screenshots

## Legend

- ✅ PASS — meets the production-grade bar; no follow-up
- ⚠️ PARTIAL — present but with documented friction; queued for next cycle
- ❌ FAIL — absent or off-brand; blocks "world-class" claim
- 🔒 PRINCIPAL-DECISION — surfaced in PRINCIPAL_DECISION_REGISTER.md
- — n/a for this row × axis

## Axes

1. **Nav** — logo, links, mobile drawer, sticky behavior, contrast
2. **Hero** — image-mode overlay, H1 text-shadow, eyebrow + sub spacing, CTA hierarchy
3. **Footer** — 3-row structure, trust strip, license null-guard, legal links, touch targets
4. **Color consistency** — only contracted tokens (navy/cream/brass + soft-black + white)
5. **Typography** — Cinzel display + Montserrat body + brass eyebrow tracking
6. **Image status** — every img / OG / hero resolves; alt; placeholder check
7. **Mobile quality** — 320 / 375 / 414 / 768 layout; touch targets ≥44×44
8. **CTA consistency** — primary / secondary / tertiary tokens consistent across routes
9. **Compliance display** — license null-guard, REALTOR®, EHO sentinel, IDX disclaimer
10. **Production polish** — voice consistency, no template-realtor clichés, market specificity

## Per-route matrix (post-cycle-4)

### Core surfaces

| Route | 1.Nav | 2.Hero | 3.Footer | 4.Colors | 5.Type | 6.Images | 7.Mobile | 8.CTA | 9.Compliance | 10.Polish | Remaining gap |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | 🔒 | ⚠️ | License rendering 🔒 (Card 1); brand-voice family-vs-luxury 🔒 (Card 3); CTA hierarchy not unified per Team A finding 7 |
| `/about/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔒 | ⚠️ | License 🔒; advisory/discretion AEO vocabulary missing (Team D F4) |
| `/buyers/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | Answer-first AEO block missing (Team D F1); Concierge intake repositioning pending (Gemini cycle-3) |
| `/sellers/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | Same as /buyers/; seller-side AEO + market-anchored proof |
| `/valuation/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | 🔒 | ⚠️ | TCPA mechanics deferred 🔒 (Card 2); AEO answer-block missing |
| `/contact/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | 🔒 | ⚠️ | TCPA mechanics 🔒; Concierge repositioning; mailto-only awaiting GHL |
| `/insights/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Topic-cluster expansion queued (Team D F12) |
| `/markets/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Cluster split working; index strong post-V3 |

### Market detail surfaces (13 routes)

All 13 markets share the same template; per-route variation is in copy only.

| Route | 1.Nav | 2.Hero | 3.Footer | 4.Colors | 5.Type | 6.Images | 7.Mobile | 8.CTA | 9.Compliance | 10.Polish | Remaining gap |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| `/markets/fort-lauderdale/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | None directly — could escalate to enclave granularity (Gemini blindspot) |
| `/markets/coral-ridge/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Same |
| `/markets/victoria-park/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Same |
| `/markets/boca-raton/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Cluster C (Palm Beach) — county discipline intact |
| `/markets/palm-beach/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | Less Mia-specific than priority routes (acknowledged cycle-2) |
| `/markets/delray-beach/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Cluster C |
| `/markets/lighthouse-point/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Cluster B |
| `/markets/rio-vista/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | New cycle-2 |
| `/markets/harbor-beach/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | New cycle-2 |
| `/markets/las-olas-isles/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | New cycle-2 |
| `/markets/seven-isles/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | New cycle-2 |
| `/markets/sea-ranch-lakes/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | New cycle-2 |
| `/markets/hillsboro-mile/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | New cycle-2 |

### Legal pages

| Route | 1.Nav | 2.Hero | 3.Footer | 4.Colors | 5.Type | 6.Images | 7.Mobile | 8.CTA | 9.Compliance | 10.Polish | Remaining gap |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| `/privacy/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ⚠️ | ✅ | Privacy overstates active vendors (cycle-3 Team E F6) — content-policy decision |
| `/terms/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | None |
| `/accessibility/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | None |
| `/dmca/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | 🔒 | ⚠️ | DMCA designated-agent USCO registration TODO at `dmca/page.tsx:80` (statutory-binary per Team E) |
| `/404` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Cycle-3 fixed canonical + noindex |

## Cycle-4 deltas (what moved this cycle)

| Cell | Before cycle-4 | After cycle-4 | Driver |
|---|---|---|---|
| Nav · all routes · backdrop-blur glassmorphism | ❌ FAIL (Brand Contract anti-rule violation, undetected pre-cycle-4) | ✅ PASS | `audit:brand` sentinel caught it; SiteHeader.tsx fixed |
| Footer · all routes · social icon touch-target | ⚠️ WARN (h-9 = 36×36, below WCAG 2.5.5 AAA 44×44) | ✅ PASS (h-11 = 44×44 + focus-visible outline) | Team A finding 1; SiteFooter.tsx fixed |
| Audit chain · image integrity | (no script existed) | ✅ NEW `audit:images` (7 PASS) | Team B (Visual QA) recommendation |
| Audit chain · brand consistency | (no script existed) | ✅ NEW `audit:brand` (7 PASS) | Team A recommendation |
| Deploy preflight · audit-completeness counts JSON read | ⚠️ silently 0 (cycle-3 fixed field name `summary→counts` but NOT casing) | ✅ PASS (reads `counts.PASS|WARN|FAIL|SKIP` uppercase) | Caught during cycle-4 deploy run; fixed inline |

## Per-axis cycle-4 verdict (cross-route summary)

| Axis | Verdict | Rationale |
|---|:-:|---|
| 1. Nav | ✅ PASS | Mobile drawer + breakpoint discipline + glassmorphism removal |
| 2. Hero | ✅ PASS | Image-mode overlay + text-shadow + CTA pair across all routes |
| 3. Footer | ✅ PASS | 3-row + trust strip + 44×44 touch targets; license null-guard intact (Card 1 surfaced) |
| 4. Color consistency | ✅ PASS | `audit:brand` confirms no off-brand tokens; 0 forbidden classes in built output |
| 5. Typography | ✅ PASS | `audit:brand` confirms only Cinzel + Montserrat |
| 6. Image status | ✅ PASS | `audit:images` confirms 187 imgs / 27 OGs / required assets all resolve |
| 7. Mobile quality | ✅ PASS | Breakpoint visibility classes detected; touch targets compliant |
| 8. CTA consistency | ⚠️ PARTIAL | Team A finding 7 + Team C finding — primary/secondary tokens not yet unified across all routes (next-cycle) |
| 9. Compliance display | ⚠️ PARTIAL + 🔒 | License rendering Card 1 OPEN; TCPA mechanics Card 2 deferred; REALTOR® mark Card 4 + 5 next-cycle |
| 10. Production polish | ⚠️ PARTIAL + 🔒 | Brand voice Card 3 OPEN; AEO answer-first blocks queued; advisory vocabulary queued |

## Production-company-grade verdict (cycle-4 close)

**Score:** the site moved from cycle-3 Cato `concerns` (build-time only, no live verify) to cycle-4 `concerns` (live-verified, glassmorphism + touch-target violations fixed, image + brand sentinels live).

**Live verified:** every route this cycle touched returns HTTP 200, Caddy flipped to last-modified `2026-05-08 22:01:24 GMT` ETag `didmtu6seolc2bl8`, backdrop-blur absent from rendered HTML.

**Outstanding production-company gaps (queued):**
- Card 1 (license rendering) — principal decision required before public launch
- Card 2 (TCPA mechanics) — gated on GHL form-wiring cycle
- Card 3 (brand voice family-vs-luxury) — principal + Mia content decision
- Card 4-5 (REALTOR® mark + combined logo) — cycle-5 content sprint
- Card 6 (Spanish hreflang) — gated on Mia language confirmation
- Answer-first AEO blocks on /buyers/ /sellers/ /valuation/ /about/ — cycle-5 content
- 13 market pages "template-feel" (Team C finding 10) — needs market-distinct copy refinement

## Cross-references

- Skill spec: `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` v0.2.0 §"World-class production-company QA checklist"
- Principal decisions: `docs/PRINCIPAL_DECISION_REGISTER.md` (6 cards)
- Image audit: `reports/audit-images.md` (NEW cycle-4)
- Brand audit: `reports/audit-brand-consistency.md` (NEW cycle-4)
- Spark team audits: `docs/codex-spark-audits/cycle-4/team-{A,B,C,D,E,F}-*.md`
- Before screenshots: `/tmp/mia-cycle4-brand-qa-before/` (70 PNGs)
- After screenshots: `/tmp/mia-cycle4-brand-qa-after/` (70 PNGs, post-Caddy-flip)
