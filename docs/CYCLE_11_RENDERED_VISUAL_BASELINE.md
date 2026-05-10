# Cycle 11 — Rendered Visual Baseline (BEFORE)

**Captured:** 2026-05-10T02:38–02:42Z
**Source:** live staging `https://miasanabriarealtor.trueidea.com` (ETag `dielten0x4ow2ozi`, last-modified `Sun, 10 May 2026 01:26:29 GMT`)
**Tooling:** `bun scripts/capture-baseline.ts` — chrome `--headless=new --window-size --screenshot` (viewport-honest)

---

## 1. Capture inventory

| Run | Viewport(s) | Routes | PNGs | Duration | Failures |
|---|---|---:|---:|---:|---:|
| Batch 1 | 320×568 / 375×812 / 768×1024 / 1280×800 / 1440×900 | 26 | 130 | ~80s | 0 |
| Batch 2 | 414×896 (mission spec required) | 26 | 26 | 23s | 0 |
| **Total** | 6 viewports | 26 | **156** | ~103s | **0** |

Output: `/tmp/mia-cycle11-before/*.png` + `_capture-summary.json`.

Routes captured:
`/`, `/about/`, `/buyers/`, `/sellers/`, `/valuation/`, `/contact/`, `/markets/`, 13 market detail pages (`/markets/{fort-lauderdale, coral-ridge, victoria-park, rio-vista, lighthouse-point, sea-ranch-lakes, harbor-beach, hillsboro-mile, seven-isles, las-olas-isles, boca-raton, delray-beach, palm-beach}/`), `/insights/`, `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/`, `/404`.

## 2. Operator visual review (above-fold)

**Method:** chrome `--screenshot` captures only the viewport region (top of page). Footer-area observations come from sharp pixel inspection of the asset files + code review + a separate full-page capture run (in flight; results integrate at Phase 9).

### 2.1 Home `/`

| Viewport | Status | Observations |
|---|:-:|---|
| 320×568 | ⚠ POTENTIAL | Eyebrow "REALTOR® WITH LPT REALTY" shows possible right-edge truncation at "REA…"; sub "private representation for buyers and sellers of distinctive coastal residences" appears to clip at "coasta…"; CTA "Begin a Private Conversati…" — pending GPT-5.5/Spark vision verdict at this exact width. **F6 blind spot now SKIPPED in audit:rendered**, so audit doesn't catch this — screenshot review carries the gate. |
| 375×812 | ✅ | Eyebrow + heading + sub + CTAs all visible inside panel; H2 below hero ("What kind of real estate Mia Sanabria specialize in?") shows a possible right-edge clip on line 2 — needs verification. |
| 414×896 | ✅ | Header + hero panel both render cleanly; sub-text reaches right edge but appears wrapped not clipped. |
| 768×1024 | ✅ | Comfortable padding; hero panel + waterfront image read luxury. |
| 1280×800 | ✅ | Cycle 10 fix holds — primary CTA above the fold. |
| 1440×900 | ✅ | Hero composes cleanly; below-hero "What kind of real estate does Mia Sanabria specialize in?" headline fits. |

### 2.2 Markets `/markets/`

| Viewport | Status | Observations |
|---|:-:|---|
| 320×568 | ✅ | Hero panel + "Begin a private market brief" + "Explore the markets" CTAs visible. |
| 375×812 | ✅ | Same as 320 with more breathing room. |
| 414×896 | ✅ | Hero crops nicely. |
| 768/1280/1440 | ✅ | "SOUTHEAST FLORIDA'S MOST COVETED COASTAL COMMUNITIES" hero reads well. |

### 2.3 Market detail (13 routes)

Spot-checked Lighthouse Point + Coral Ridge + Palm Beach (the principal-reported recovery set) at 320 + 1280: all show the hero image rendering cleanly post Cycle 10 Addendum gradient + per-market `cardObjectPosition` fix. No regression.

### 2.4 Other public routes

| Route | Notes |
|---|---|
| `/about/` | hero + bio block render; portrait visible |
| `/contact/` | hero + intake methods visible; mailto-only state preserved (Card 2 in PDR) |
| `/buyers/` `/sellers/` `/valuation/` | dedicated heroes hold; CTAs route to `/contact/?intent=*` |
| `/insights/` | empty-state messaging holds |
| `/privacy/` `/terms/` `/accessibility/` `/dmca/` | legal stubs render with proper headings |
| `/404` | branded 404 page |

## 3. Footer trust-strip — pixel-truth from sharp inspection

`public/logos/lpt-realty.png` `public/logos/realtor-r.png` `public/logos/equal-housing.png` were inspected via sharp + visual Read; results in `docs/CYCLE_11_FOOTER_LOGO_TRUST_STRIP_AUDIT.md`. Summary:

- **LPT Realty asset** is white-on-transparent (RGB mean 63.7, alpha mean 62.6); rendered on the footer's `bg-white/95 p-1` tile = **invisible** (white on white).
- **REALTOR®+MLS asset** is mid-gray-on-transparent (RGB mean 137.8, alpha mean 176.1) and contains the COMBINED REALTOR®+MLS+MULTIPLE LISTING SERVICE mark; rendered on navy footer = **low contrast**.
- **EHO asset** is black-on-transparent (RGB mean 0.2, alpha mean 117.2); rendered on navy footer = **barely visible**.

Three distinct visibility/treatment failures presenting as one "looks inconsistent" complaint.

## 4. Hero readability cross-cycle review

Cycle 10's Hero.tsx mobile-tightening (six surgical edits — eyebrow `text-[9px]`, sub `text-[14px]`, CTAs `text-[10px]`, panel `p-3`) holds across 375 / 414 / 768 / 1280 / 1440. **The 320 width remains a sharp edge** — Hero.tsx defaults are tuned for 375+ via `min-[375px]:` breakpoints; 320 inherits the smaller defaults but the content (locked Card-3 heading + sub + CTAs) is intrinsically near-the-limit at that width. Spark Team B + GPT-5.5 vision will rule on whether the 320 trade-off is acceptable or needs a 320-only smaller-text branch.

## 5. Defect catalog (BEFORE state)

| # | Defect | Severity | Evidence | Phase 7 disposition |
|---|---|---|---|---|
| D1 | Footer trust-strip: LPT logo white-on-white invisible | deploy-blocker | sharp pixel mean 63.7/62.6 + footer `bg-white/95` | FIX (uniform monochrome white treatment + remove white tile) |
| D2 | Footer trust-strip: EHO black-on-navy near-invisible | deploy-blocker | sharp pixel mean 0.2/117.2 + footer navy bg | FIX (uniform monochrome white via `[filter:brightness(0)_invert(1)] opacity-80`) |
| D3 | Footer trust-strip: REALTOR®+MLS combined mark + low contrast | concerns | sharp pixel mean 137.8/176.1 + Card 5 PRINCIPAL_DECISION_REGISTER `RECOMMENDATION_PENDING` | VISUAL FIX ONLY (filter to white); keep combined-asset semantics until Card 5 authorization |
| D4 | Footer trust marks: inconsistent sizing | polish | LPT 1097² square / REALTOR® 257×118 wide / EHO 150×161; rendered h-10 / h-7 / h-9 — different baselines | FIX (unify to h-10 + flex baseline alignment) |
| D5 | Mobile 320 hero potentially clips eyebrow / sub / CTA tail | concerns | screenshot evidence, audit:rendered SKIPS this viewport (F6) | DEFER to Spark Team B + GPT-5.5 vision; only fix if confirmed |
| D6 | Mobile 375 H2 below hero appears to right-clip on line 2 | concerns | screenshot evidence | DEFER to Spark Team B + GPT-5.5 vision |
| D7 | `audit:hero-contrast` glyph-sample probe flake (1 FAIL on first run, 0 on retest) | polish | reports/audit-hero-pixel-contrast.md | DEFER (Cycle 12 candidate — median-of-N hardening) |
| D8 | `audit:completeness` 28 missing img dim attrs + 2 mailto forms | carry-forward WARN | reports/audit-completeness.md | DEFER (Card 2 + render-images.ts dim-injection) |

## 6. What the audit chain confirmed clean (post-Phase-2 patch)

- **`audit:images`** 14 PASS · 0 FAIL — every image present + alt + resolves
- **`audit:brand`** 12 PASS · 0 FAIL — brand contract intact
- **`audit:hero-contrast`** 95 PASS · 0 FAIL (after retest)
- **`audit:rendered`** 14 PASS · 1 WARN (viewportSanity = F6 honesty gate now active) · 0 FAIL
- **`audit:stale`** clean
- **`audit:schema`** 153 JSON-LD blocks · 0 broken
- **`audit:links`** 1245 internal links · 0 broken
- **`audit:seo`** 0 warnings · 0 errors
- **`audit:completeness`** 14 PASS · 2 WARN (carry-forward) · 0 FAIL

## 7. Cycle 11 fix scope

Based on this baseline, the implementation pass (Phase 7) targets:

1. **Footer trust-strip uniform monochrome treatment** (D1 + D2 + D3 + D4) — primary work
2. **Hero 320 micro-polish** if Spark Team B / GPT-5.5 vision requires (D5)
3. **Below-hero H2 wrap if needed** (D6) — if Spark Team B / GPT-5.5 vision requires
4. Other items deferred per disposition above

---

**Phase 3 result: ✅ 156 BEFORE PNGs captured at 6 viewports × 26 routes; defect catalog written; primary fix scope is footer trust-strip uniform treatment.**
