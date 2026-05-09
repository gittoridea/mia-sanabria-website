# Cycle 6 — Design Audit Baseline (Phase 3 artifact)

**Authored:** 2026-05-09 (cycle 6, Phase 3)
**Purpose:** Visual baseline against which cycle-6 design level-up work is measured. Companion to `docs/CYCLE_6_DESIGN_AUDIT_BASELINE.md` (this file) and `docs/CYCLE_6_DESIGN_LEVEL_UP_AFTER.md` (Phase 7).

## Method

- **Tool:** chrome-headless via `google-chrome --headless=new --no-sandbox --hide-scrollbars --window-size=W,H --virtual-time-budget=20000 --screenshot=...` (per memory `feedback_interceptor_headless_server_fallback.md`).
- **Routes:** 15 surfaces — Home, About, Buyers, Sellers, Valuation, Contact, Markets hub + 8 market detail pages (Fort Lauderdale, Coral Ridge, Victoria Park, Rio Vista, Harbor Beach, Las Olas Isles, Boca Raton, Delray Beach).
- **Viewports:** 5 breakpoints — 320×568 (mobile-sm), 375×812 (mobile-md), 768×1024 (tablet), 1280×800 (laptop), 1440×900 (desktop).
- **Total captures:** 75 PNGs.
- **Output dir:** `/tmp/mia-cycle6-design-before/`.
- **Reference baseline (cycle-5 closeout):** `/tmp/mia-cycle5-fix-after/` (70 captures, identical viewport set minus 414×896).

## Screenshot path index

```
/tmp/mia-cycle6-design-before/
  home_{mobile-sm,mobile-md,tablet,laptop,desktop}.png
  about_{viewport}.png
  buyers_{viewport}.png
  sellers_{viewport}.png
  valuation_{viewport}.png
  contact_{viewport}.png
  markets-hub_{viewport}.png
  markets-fort-lauderdale_{viewport}.png
  markets-coral-ridge_{viewport}.png
  markets-victoria-park_{viewport}.png
  markets-rio-vista_{viewport}.png
  markets-harbor-beach_{viewport}.png
  markets-las-olas-isles_{viewport}.png
  markets-boca-raton_{viewport}.png
  markets-delray-beach_{viewport}.png
```

## Visual issues at baseline (synthesized from 9-lane audit)

The 9-lane audit IS the baseline analysis. Each lane's full findings live at `docs/design-level-up-audits/cycle-6/lane-{1..9}-*.md`; high-confidence convergence is in `docs/CYCLE_6_DESIGN_LEVEL_UP_SYNTHESIS.md`. This file enumerates the obvious visual issues a high-end production company would flag on first scan, organized by axis.

### Hero issues

- **Eyebrow contrast on image-mode hero** ≈ 1.05:1 on bright image regions (well below WCAG 1.4.3 AA 4.5:1) — Lane 7 F1.
- **H1 contrast on image-mode hero** ≈ 2.02:1 on bright bands (below AA 3:1 for large text) — Lane 7 F2. Cycle-5 H1 text-shadow stack helped but did not fully resolve.
- **No staged-reveal motion** on hero — all elements paint simultaneously, lacking the cinematic "moment" top-tier sites use — Lane 1 F4.
- **No first-viewport CTA** on `/markets/` hero — Lane 3 F2.

### Nav issues

- **Mobile drawer missing focus trap, ESC dismiss, scroll lock, aria-modal** — keyboard + screen-reader users tab into hidden page content — Lane 5 F3, Lane 7 F6.
- **Header menu icon at h-10 w-10 (40×40)** — below WCAG 2.5.5 AAA 44×44 floor — Lane 5 F4.
- **No aria-current on nav anchors** — screen-reader orientation degraded — Lane 7 F7.

### Typography issues

- **Eyebrow tracking inconsistent** between SectionHeading/Hero/MeetMia (`tracking-[0.4em]` vs `tracking-[0.3em]` interchangeably) — Lane 4 F2.
- **All h1-h6 use `--font-display`** (Cinzel) — flattens editorial hierarchy in dense long-form blocks — Lane 1 F2.
- **MarketCard h3 has `tracking-[0.05em]`** — reads engineered/compressed instead of editorial — Lane 4 F9.
- **Section h2 missing `[text-wrap:balance]`** — Lane 4 F3 (only Hero H1 had it).
- **Long-form body missing `[text-wrap:pretty]`** in About / Markets / Faq / AnswerFirst — Lane 4 F4.

### Spacing issues

- **`AnswerFirst` uses `py-14 lg:py-20`** while approved cadence is `py-16 lg:py-20` (secondary) or `py-20 lg:py-28` (primary) — Lane 4 F6.
- **Width contractions: Faq (`max-w-4xl`) and AnswerFirst (`max-w-3xl`)** break the 7xl rhythm — Lane 4 F5.
- **No `scroll-padding-top` on `html`** — sticky-header anchor jumps land underneath nav — Lane 5 F2.

### Image / crop issues

- **Identical 4:5 framing across all 13 markets** — geographic/architectural distinction lost — Lane 1 F3, Lane 6 F3.
- **No per-market `objectPosition`** — facades/balconies/waterline edges crop unpredictably — Lane 6 F3.
- **Generic alt text** — every market gets `${name} luxury real estate` — Lane 6 F4.
- **OG generator hard-codes 7 markets** while site has 13 — silent skew risk — Lane 6 F1.
- **Legacy SVG placeholders** in `public/markets/` namespace — accidental reuse risk — Lane 6 F8.

### CTA issues

- **CTA tokens not centralized** — Hero/CTAStrip/page-inline CTAs use slightly varying class strings — Lane 3 F4.
- **Touch targets** — `py-3.5` without explicit `min-h-44` likely <44px on mobile — Lane 3 F5, Lane 5 F5.
- **Markets hub Hero has no CTA** — Lane 3 F2.
- **`/buyers/` and `/sellers/` lose intent context** when handing off to `/contact/` — no `?intent=*` passthrough — Lanes 2 F3, 3 F8.
- **MarketCard "Explore Area" `text-brass-300`** over image strip ≈ 2.17:1 contrast — fails AA — Lane 7 F3.

### Footer issues

- **Footer link rows lack explicit padding/min-height** — touch accuracy risk on mobile — Lane 7 F8.
- **Footer trust mark** uses combined REALTOR®+MLS logo (Card 5 OPEN — DO NOT change without approval) — Lane 9 F4.
- **License # rendered conditionally** when set (Card 1 OPEN — DO NOT change without approval) — Lane 8 F5, Lane 9 F1.

### Mobile issues

- **Form controls at 14px (`text-sm`)** trigger iOS Safari zoom-on-focus — Lane 5 F6, Lane 7 F4.
- **IDX iframe `min-h-[760px]` hardcoded** — oversized on 320/375 — Lane 5 F10.
- **Mailto silent failure** — `/contact/`, `/valuation/` post via `mailto:` with no completion state — Lane 2 F1+F2, Lane 3 F6+F7, Lane 5 F7, Lane 9 F6.

### Compliance / production polish issues

- **Lane 9** carries 5 high-severity findings — all intersect OPEN principal-decision cards (1, 2, 4, 5).
- **Lane 9 F3** — `keywords` metadata has lowercase `realtor` — descriptive non-compliant per NAR Marks Manual.
- **Lane 9 F10** — Card 3 status drift between PRINCIPAL_DECISION_REGISTER (still OPEN) and BRAND_SYSTEM_CONTRACT (DECIDED).

### Things a high-end production agency would NOT ship

Cross-lane convergence (highest-confidence "would not ship" items):

1. **Mailto-only forms** with no completion state — Lanes 2, 3, 5, 9.
2. **40×40 header tap target** below AAA floor — Lane 5.
3. **Hero contrast failing on bright imagery** — Lane 7.
4. **Mobile drawer with no focus trap** — Lane 5, Lane 7.
5. **MarketCard "Explore Area" failing AA contrast** — Lane 7.
6. **Identical card layout across geographically distinct markets** — Lanes 1, 4, 6.
7. **Form fields at 14px causing iOS zoom-on-focus** — Lane 5, Lane 7.
8. **Conditional license rendering against constraint** — Lane 8, Lane 9 (Card 1 OPEN).
9. **REALTOR® descriptive usage in title strings** — Lane 9 (Card 4 OPEN).

## Audit telemetry (pre-implementation)

```
typecheck: ✓ clean
lint: ✓ no warnings
build: ✓ 31 routes, 105 kB shared first-load JS, 137-205 B per-route
audit:images: 10 PASS · 0 WARN · 0 FAIL
audit:brand: 9 PASS · 0 WARN · 0 FAIL
audit:seo: 0 warnings
audit:schema: 148 JSON-LD blocks across 27 pages, all parse
audit:links: 1244 internal links, all resolve
audit:completeness: 14 PASS · 2 WARN · 0 FAIL (28 img dim placeholders + 2 mailto forms — known)
audit:stale-terms: ✓ clean

Live staging at baseline (cycle-5 deploy):
  ETag: didpufmmopa82fnd
  last-modified: 2026-05-09T00:23:14Z
  HTTP 200 across all 25 routes
```

## Outputs from this baseline

- 9 lane reports → `docs/design-level-up-audits/cycle-6/lane-{1..9}-*.md`
- Synthesis → `docs/CYCLE_6_DESIGN_LEVEL_UP_SYNTHESIS.md`
- Upgrade plan → `docs/DESIGN_LEVEL_UP_UPGRADE_PLAN.md`
- Stack architecture review → `docs/STACK_ARCHITECTURE_REVIEW_NEXT_TAILWIND_SHADCN_PAYLOAD_POSTGRES.md`
- Implementation pass → cycle-6 commit `7f8800c`
- After captures → `/tmp/mia-cycle6-design-after/` (15 routes × 5 viewports = 75 PNGs)
- After analysis → `docs/CYCLE_6_DESIGN_LEVEL_UP_AFTER.md`
- Updated QA matrix → `docs/BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md` (cycle-6 cell deltas at top)
- Closeout → `docs/PRODUCTION_READINESS_HANDOFF_DESIGN_LEVEL_UP_CYCLE_6_2026-05-09.md`
- Next-session prompt → `docs/NEXT_SESSION_TRIGGER_AFTER_DESIGN_LEVEL_UP.md`
