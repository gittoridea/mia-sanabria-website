# Cycle 4 Visual QA Baseline — Pre-Implementation

**Captured:** 2026-05-08 PM cycle 4 (before any code changes)
**Source:** live staging `https://miasanabriarealtor.trueidea.com` at cycle-3 commit `d11c91a`, last-modified `Fri, 08 May 2026 20:11:18 GMT`, ETag `didkhjfmkidc2b33`
**Capture method:** `google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=W,H --virtual-time-budget=20000 --screenshot=...`
**Storage:** `/tmp/mia-cycle4-brand-qa-before/` (70 PNGs = 14 routes × 5 viewports)

## Routes captured (14)

`/`, `/about/`, `/buyers/`, `/sellers/`, `/valuation/`, `/contact/`, `/markets/`,
`/markets/fort-lauderdale/`, `/markets/coral-ridge/`, `/markets/rio-vista/`,
`/markets/harbor-beach/`, `/markets/las-olas-isles/`, `/markets/boca-raton/`, `/markets/delray-beach/`

## Viewports (5)

- `mobile-sm` 320×568 (iPhone SE legacy)
- `mobile-md` 375×812 (iPhone 15 / modern small)
- `tablet` 768×1024 (iPad portrait)
- `laptop` 1024×768 (small desktop)
- `desktop` 1440×900 (modern desktop)

## Pre-cycle-4 issues (to be re-verified post-cycle-4)

These are the issues the cycle-4 Spark team audits identified BEFORE cycle-4 implementation. Each line names what the team flagged + which screenshot file shows it.

### Brand / nav / hero / footer (Team A)

- **Footer social icons below 44×44 tap target** — visible at `home_mobile-sm.png`, `home_mobile-md.png`. Currently `h-9 w-9` = 36×36; spec mandates ≥44×44 with ≥8 px gap.
- **`backdrop-blur` glassmorphism on sticky header** — visible at every route; e.g. scrolling at `home_desktop.png` reveals the cream-50/95 + backdrop-blur effect. Brand System Contract anti-rule.
- **CTA hierarchy not unified across routes** — primary/secondary/tertiary tokens drift between `/buyers/`, `/sellers/`, `/insights/`; observable by comparing `buyers_desktop.png` vs `sellers_desktop.png` vs `insights_desktop.png`.
- **Hero visual rhythm under-specified at narrow breakpoints** — `home_mobile-sm.png` shows tighter type pairing than spec; some H1 / sub spacing pinches at 320 px.

### Visual QA / image integrity (Team B)

- No actual missing images. Sentinel script (`audit:images`) was missing — Team B's primary gap is structural (the audit lacked).

### Production polish (Team C)

- **Mobile nav drawer not premium-behaviorally complete** — visible at `home_mobile-md.png`, `about_mobile-sm.png`. Open/close works but lacks: focus trap, ESC dismiss, scroll lock when open, animated drawer (instant toggle reads templated).
- **Sticky-header scroll-padding-top issue** — anchor jumps land hidden behind the sticky header on mobile. Visible by following any in-page link from `home_mobile-md.png`.
- **Footer trust stack feels crowded** — visible at every footer screenshot; trust strip + 4-col grid feels stacked-and-cramped on `tablet.png`.
- **Brand voice family-homes vs HNWI luxury-first** — homepage tagline reads "Family Homes Where Memories Are Made." Visible at `home_desktop.png` H1+sub block. Surfaced as PRINCIPAL_DECISION_REGISTER Card 3 (do not silently change).
- **License/credential rendering** — license # SL3405877 visible in every footer screenshot. Surfaced as Card 1.
- **DMCA route reads pre-production** — `/dmca/` page screenshots (not in 14-route capture set; verified separately) show TODO inline at registration field.
- **Buyers/Sellers don't escalate to high-intent CTA in first fold** — `buyers_mobile-md.png` first viewport ends in process-timeline before reaching primary CTA.
- **13 market pages template-feel** — comparing `markets_fort-lauderdale_desktop.png` ↔ `markets_coral-ridge_desktop.png` ↔ `markets_rio-vista_desktop.png` reveals shared structure without per-market visual differentiation; all 13 are nearly identical at the layout level.

### SEO / AEO (Team D)

- Visual screenshots don't surface SEO/AEO issues directly; metadata + schema findings live in `seo-aeo-schema-audit.md` and `team-D-seo-aeo.md`. Reference here: missing answer-first AEO blocks on 5 funnel pages, internal-link density thin on non-market pages, Spanish hreflang absent.

### Compliance severity (Team E)

- License rendering, REALTOR® mark descriptive usage, combined REALTOR®+MLS footer graphic, TCPA mechanics absent — all visible in screenshots but require severity classification context (see `team-E-compliance-severity.md` cycle-4 + `compliance-risk-audit.md` cycle-3).

## Cycle-4 implementation targets (mapped to before-screenshots)

| Spark finding | Screenshot evidence | Cycle-4 action |
|---|---|---|
| Footer social <44×44 | `home_mobile-sm.png` footer crop | Fix `h-11 w-11` + focus-visible outline |
| `backdrop-blur` glassmorphism | scroll at `home_desktop.png` | Remove `backdrop-blur supports-[backdrop-filter]:bg-cream-50/85` from `SiteHeader.tsx:15` |
| Audit:images missing | (no screenshot — structural) | Build `scripts/audit-images.ts` |
| Audit:brand missing | (no screenshot — structural) | Build `scripts/audit-brand-consistency.ts` |
| Deploy-preflight casing bug | (terminal evidence) | Fix `j.counts.PASS\|WARN\|FAIL\|SKIP` uppercase read in `deploy-and-verify.ts` |
| All others | various | Queue for next cycle (principal decisions or content sprint) |

## Cross-references

- Live capture: `/tmp/mia-cycle4-brand-qa-before/`
- After capture: `/tmp/mia-cycle4-brand-qa-after/` (same 70 routes×viewports, post-deploy)
- Spark team audits: `docs/codex-spark-audits/cycle-4/team-A-brand-systems.md` + `team-B-visual-qa-images.md` + `team-C-production-qa.md`
