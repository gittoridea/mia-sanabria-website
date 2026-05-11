# Team 5 — UI/UX, Visual Design, Mobile Conversion

**Cycle:** 21-AI-REMAINING-WORK
**Date:** 2026-05-11
**Scope:** Read-only inspection. No source edits. Screenshots captured at 375 and 1280; audits re-run.
**Live target:** https://miasanabriarealtor.trueidea.com (audited against local `out/` served at :8765 for parity).

---

## Section 1 — Pages Reviewed + Screenshots Index

14 screenshots captured to `docs/artifacts/cycle-21-ai-remaining-work/screenshots/`:

| File | Page | Width |
|---|---|---|
| `team5-home-1280.png` | `/` | 1280 |
| `team5-home-375.png` | `/` | 375 |
| `team5-fort-lauderdale-1280.png` | `/markets/fort-lauderdale/` | 1280 |
| `team5-fort-lauderdale-375.png` | `/markets/fort-lauderdale/` | 375 |
| `team5-pompano-beach-375.png` | `/markets/pompano-beach/` | 375 |
| `team5-boca-raton-1280.png` | `/markets/boca-raton/` | 1280 |
| `team5-coral-ridge-375.png` | `/markets/coral-ridge/` | 375 |
| `team5-markets-index-375.png` | `/markets/` | 375 |
| `team5-buyers-375.png` | `/buyers/` | 375 |
| `team5-contact-375.png` | `/contact/` | 375 |
| `team5-valuation-375.png` | `/valuation/` | 375 |
| `team5-insights-1280.png` | `/insights/` | 1280 |
| `team5-insight-fl-waterfront-375.png` | `/insights/fort-lauderdale-waterfront-buyer-guide/` | 375 |
| `team5-thank-you-buyer-brief-375.png` | `/thank-you/buyer-brief/` | 375 |

### Audits re-run (all green)

- `bun run audit:rendered` → **14 PASS · 1 WARN · 0 FAIL** (warn = viewport-instrumentation gap, covered by screenshot channel).
  - `rendered.hero.primaryCtaAboveFoldDesktop` — 0 desktop probes show CTA below fold.
  - `rendered.mobile.noHorizontalOverflow` — 0 overflow at 28 viewport-honest probes.
  - `rendered.ctas.contrastVisible` — 0 CTAs below contrast threshold.
- `bun run audit:mobile-readability` → **56/56 PASS** across iphone-se / iphone-15 / pixel-7 / ipad-portrait.
- `bun run audit:hero-contrast` → **110 PASS · 0 WARN · 0 FAIL**.

---

## Section 2 — Visual Consistency Findings

### Market pages — structural parity confirmed

`src/app/markets/[slug]/page.tsx` is a single 360-line dynamic template feeding **all** market pages (Fort Lauderdale, Pompano Beach, Boca Raton, Delray Beach, Lighthouse Point, Coral Ridge, and others). FL is NOT structurally privileged — it shares hero rhythm, "An honest summary" panel, "What the geography actually is" section, market-data table, FAQ, and CTA strip with every other market.

**Implication:** the "FL gold standard" framing in the team-5 brief overstates the gap. Differences between FL and other markets are *content density only* (FL has more deeply-written market data and a richer geography section in source MDX/data), not visual rhythm. Verified by parallel section structure: `py-20 lg:py-28` repeats identically at lines 150, 163, 218, 240, 276, 323 of the slug template.

**Hero rhythm parity:** All market hero screenshots (FL/Pompano/Boca/Coral Ridge at 375) show identical above-fold cadence — eyebrow → display headline → 3-line paragraph → two CTAs → cream-50 "An honest summary" section. Hero contrast audit (110 PASS) confirms identical color treatment.

### Section rhythm — one consistency anomaly

| Page family | Section padding | Files |
|---|---|---|
| Home / Markets / Buyers / Sellers / Contact / Valuation / About | `py-20 lg:py-28` | 6 files agree |
| Insights index | `py-16 lg:py-24` | `src/app/insights/page.tsx` (4 sections) |

Insights uses tighter vertical rhythm than every other top-level page. This is *defensible* for an editorial library page (denser content reads as tighter), but it is the only inconsistency in section spacing across the site. Confidence: medium that this is intentional, low that it was an audited decision.

### Hero alternating background pattern — consistent

Hero alternates `bg-cream-100`/`bg-cream-50` per section across home + markets. Verified visually identical across 6 captured market/practice pages.

### Typography — consistent

Headlines use `font-display` small-caps treatment uniformly (verified in home, FL, Pompano, Boca, Coral Ridge, Contact, Valuation hero screenshots). Eyebrow letter-spacing scales correctly per-breakpoint (audit:rendered passed `eyebrowFitsPanel` 0 offenders).

---

## Section 3 — Mobile-Specific Issues

### Tap targets

`src/components/SiteHeader.tsx` and `src/components/SiteFooter.tsx` and `src/components/Faq.tsx` use **explicit `min-h-[44px]`** on every nav link, summary, and call button (verified at SiteHeader L92, L133, L142; SiteFooter L48, L65; Faq L26). Mobile menu uses `h-12 w-12` for the hamburger — comfortable 48×48.

Hero CTAs (`src/components/Hero.tsx`) use `py-3.5 text-sm` (desktop) and `py-3 text-[13px]` at 375+ — these compute to ~46-48px effective height. **No explicit `min-h-[44px]`** on hero CTAs, but padding+font math passes the 44px contract. Below 360px width, hero CTAs collapse to `py-2.5 text-[9px]` — computed height ~36px, below tap-target — but this only triggers at <360px (iPhone SE 320 territory).

Form submit button on `/contact/` (page.tsx L187) uses `py-3 text-sm` → ~40px effective. **Borderline at 44px contract.** Form inputs themselves (L155, L179, L248) use `py-3 text-base` → ~48px, pass.

### Form usability (`/contact/`)

- Inputs use semantic `inputMode="email"`/`"tel"` and `autoComplete` — correct.
- Single-column layout at mobile width verified in `team5-contact-375.png`.
- Mailto fallback notice rendered in `<p>` above form (cycle-19 contract). Visible at 375.
- Form ends at "FIRST NAME *" in the visible screenshot tail — remainder is below fold but standard scroll.

### Header behavior

Sticky top, `border-b border-cream-300 bg-cream-50`. At 375, the logo + "MIA SANABRIA / REALTOR® · LPT REALTY" lockup occupies left, and a `h-12 w-12` round menu button occupies right. No phone-pill at mobile (moved into menu) — correct decision for 375 width.

### Footer behavior

Verified `min-h-[44px] py-2` on every footer link. Multi-column collapse to single column at mobile is visible in long-scroll screenshots. No issues.

### Chrome-headless artifact disclosure

Multiple 375-width screenshots (`team5-fort-lauderdale-375.png`, `team5-pompano-beach-375.png`, `team5-coral-ridge-375.png`, `team5-home-375.png`) show paragraph text appearing to clip at the right edge. **This is the documented chrome `--headless` canvas-offset artifact** (visible canvas 5-20px narrower than `--window-size`; see global memory `knowledge_chrome_headless_screenshot_canvas_offset.md`). Verified by re-capturing pompano at width=400 (`/tmp/team5-pb-400.png`) — text wraps fully, no clipping. `audit:rendered` reports 0 horizontal overflow across 28 viewport-honest probes. **Not a real defect.**

---

## Section 4 — Safe Polish Candidates (high-confidence only)

### P1 — Contact form submit button height

**File:** `src/app/contact/page.tsx` L187
**Current:** `... px-6 py-3 text-sm ...`
**Computed height:** ~40-42px (14px text + 24px padding + line-height)
**Recommendation:** Add `min-h-[44px]` to the className to match the SiteHeader/Faq/SiteFooter contract.
**Rationale:** Site-wide 44px tap-target contract is already enforced everywhere else; the conversion-critical form submit is the one place it's implicit-not-explicit. Zero visual change at default fonts; only enforces minimum on narrow viewports if line-height collapses.
**Confidence:** HIGH. Pure additive, no breakage risk.

### P2 — Hero sub-360px CTA height review

**File:** `src/components/Hero.tsx` L71, L87
**Current:** at viewports <360px, hero CTAs collapse to `px-1.5 py-2.5 text-[9px]` → ~32-36px effective height.
**Affected devices:** iPhone SE 1st gen (320), older Android (320-359).
**Recommendation:** Add `min-h-[40px]` to the small-viewport branch. Below 360 the CTA is already aggressively cramped (9px text + 1.5 px-padding) to fit two CTAs on one row inside the hero panel. Adding a min-h would not break layout (panel is already vertical-rhythm tolerant) and would meet a relaxed-but-honest 40px tap target on edge-case devices.
**Confidence:** MEDIUM. Decision deserves principal review — could alternatively stack CTAs at <360 instead of resizing.

### P3 — Insights section padding harmonization (optional, low-impact)

**File:** `src/app/insights/page.tsx` L77, L100, L123, L155
**Current:** `py-16 lg:py-24` (tighter than rest of site)
**Recommendation:** Decide whether `py-16 lg:py-24` is deliberate editorial cadence or drift. If drift, normalize to `py-20 lg:py-28`. If deliberate, leave and document the decision somewhere a future cycle won't relitigate.
**Confidence:** LOW that this is a defect. HIGH that the inconsistency exists and is worth a principal decision.

---

## Section 5 — Issue Rows (TSV)

```tsv
id	team	page	category	issue	evidence	severity	impact	recommended_fix	owner_type	effort	confidence	can_fix_now	files_affected	verify_method
team5-001	team5	/contact/	mobile-tap-target	Contact form submit button computed height ~40-42px lacks explicit min-h-[44px] contract that SiteHeader/Faq/SiteFooter enforce	src/app/contact/page.tsx:187 className uses py-3 text-sm with no min-h	low	medium	Add min-h-[44px] to submit button className	site/content/design defect	XS	HIGH	yes	src/app/contact/page.tsx	Re-run audit:mobile-readability; visual confirm at 375 in audit:mobile-readability:capture
team5-002	team5	/	mobile-tap-target	Hero CTAs at viewport <360px collapse to py-2.5 text-[9px] computed ~32-36px below 44px tap contract	src/components/Hero.tsx:71,87 small-viewport branch	low	low	Add min-h-[40px] to <360 branch OR restructure to stacked CTAs below 360	site/content/design defect	S	MEDIUM	no (needs principal call)	src/components/Hero.tsx	Capture at 320 width; verify CTA height ≥40px
team5-003	team5	/insights/	section-rhythm	Insights index uses py-16 lg:py-24 while every other top-level page uses py-20 lg:py-28	src/app/insights/page.tsx:77,100,123,155 vs src/app/page.tsx:104 and 5 others	info	low	Principal decision — keep as editorial cadence or normalize to py-20 lg:py-28	principal decision	XS	LOW	no	src/app/insights/page.tsx	Visual compare insights at 1280 vs home/markets/buyers/sellers/contact/valuation
team5-004	team5	all-375	tool/process	chrome --headless 375-width screenshots show false-positive right-edge text clipping; documented canvas-offset artifact	team5-fort-lauderdale-375.png,team5-pompano-beach-375.png vs /tmp/team5-pb-400.png re-capture at 400	info	none	No fix — known artifact; trust audit:rendered probes (0 overflow at 28 viewport-honest probes)	tool/process defect	none	HIGH	n/a	none	audit:rendered viewport-honest probes
```

---

## Section 6 — Confidence + Dissent

### Confidence

- **HIGH** that visual consistency across market pages is structurally enforced by the single `[slug]/page.tsx` template. The "FL is gold standard, others are weaker" framing in the team-5 brief is incorrect at the visual-rhythm layer. Differences are content density, not design.
- **HIGH** that mobile readability and rendered audits are green (56/56 + 14/14/1-warn).
- **HIGH** that the contact form submit button is the one place the site-wide explicit 44px tap-target contract is not enforced.
- **MEDIUM** on hero CTAs <360px — the math is borderline and the device population is small.
- **LOW** that any of these would block launch.

### Dissent

I dissent from any interpretation that this audit identifies meaningful conversion defects. The site is in strong visual shape. The three polish candidates are *hygiene*, not *blockers*. The "FL gold standard" framing in the brief should be retired — there is no per-market visual divergence to chase. Future cycle effort would yield higher ROI on copy density and content depth for thinner market pages (Pompano/Coral Ridge appear copy-light vs FL in the screenshots) than on visual polish.

I also dissent from the implicit suggestion to capture screenshots at chrome `--window-size=375` for any future verification work. Per documented memory, the visible canvas is 5-20px narrower at this width. Either capture at 400 to get true 375 wrap behavior, or use `audit:rendered` viewport-honest probes (already running in CI).

---

## Smarter-AI Closeout

- Earlier catch: `audit:rendered` already reported 0 horizontal overflow at 28 viewport-honest probes; chrome `--headless --window-size=375` screenshots would have created false-positive findings without it.
- Pattern type: recurring (chrome canvas-offset artifact has bitten before per `knowledge_chrome_headless_screenshot_canvas_offset.md`).
- Smallest durable improvement: none — the existing memory already documents the artifact and `audit:rendered` already provides the honest signal.
- Promotion target: no promotion — one-off or already covered.
- Bloat guard: existing memory `knowledge_chrome_headless_screenshot_canvas_offset.md` + existing `audit:rendered` viewport-honest probes already carry this.
- Action taken: none.
- Owner category: tool/process defect.
