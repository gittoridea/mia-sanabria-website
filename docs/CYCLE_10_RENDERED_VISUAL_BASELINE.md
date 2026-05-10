# Cycle 10 — Rendered Visual Baseline (2026-05-09)

**Captured:** 130 PNGs (26 routes × 5 viewports) against `https://miasanabriarealtor.trueidea.com/` via `bun scripts/capture-baseline.ts --concurrency=5 --vtb=12000` in 100 seconds. Failures: 0/130. Output dir: `/tmp/mia-cycle10-rendered-before/`. Capture summary: `/tmp/mia-cycle10-rendered-before/_capture-summary.json`.

The captures hit the LIVE staging URL — not local — because the static-vs-rendered miss class only manifests on the served page (Caddy headers, font loads, image decode timing, real DOM layout).

---

## 1. Capture index

26 routes captured at 5 viewports each:

| # | Route | 320×568 | 375×812 | 768×1024 | 1280×800 | 1440×900 |
|---|---|:-:|:-:|:-:|:-:|:-:|
| 1 | `/` (home) | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2 | `/about/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 3 | `/buyers/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 4 | `/sellers/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 5 | `/valuation/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 6 | `/contact/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 7 | `/markets/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 8 | `/markets/fort-lauderdale/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 9 | `/markets/coral-ridge/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 10 | `/markets/victoria-park/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 11 | `/markets/rio-vista/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 12 | `/markets/lighthouse-point/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 13 | `/markets/sea-ranch-lakes/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 14 | `/markets/harbor-beach/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 15 | `/markets/hillsboro-mile/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 16 | `/markets/seven-isles/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 17 | `/markets/las-olas-isles/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 18 | `/markets/boca-raton/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 19 | `/markets/delray-beach/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 20 | `/markets/palm-beach/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 21 | `/insights/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 22 | `/privacy/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 23 | `/terms/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 24 | `/accessibility/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 25 | `/dmca/` | ✓ | ✓ | ✓ | ✓ | ✓ |
| 26 | `/404` | ✓ | ✓ | ✓ | ✓ | ✓ |

Filename convention: `<route_safe>__<W>x<H>.png` — e.g. `markets_lighthouse-point__1280x800.png`. The capture-baseline.ts script Bun-stamps each request with `?_=<ts>` cache-bust headers and a `--virtual-time-budget=12000ms` minimum.

## 2. Direct visual review — rendered-DOM defects (operator review)

Visual review of representative captures by the primary executor (operator-grade, not GPT-5.5 yet):

### 2a. CONFIRMED DEFECTS — visible in rendered output

| # | Route | Viewport | Defect | Evidence |
|---|---|---|---|---|
| **D1** | `/` | 320×568 | **Primary CTA tail-clipping** — "Begin a Private Conversa[tion]" right edge cut off inside panel | `home__320x568.png` — primary brass pill terminates with truncated label |
| **D2** | `/` | 320×568 | **Secondary CTA tail-clipping** — "Request Home Valuati[on]" right edge cut off | same screenshot |
| **D3** | `/` | 320×568 | **Hero eyebrow overflow** — "MIA SANABRIA · REALTOR® WITH LPT REA[LTY]" right-clips inside panel | same — first line of panel content bleeds past right edge |
| **D4** | `/contact/` | 320×568 | **Sub-paragraph right-clipping** — "A confidential consultation with a REA[LTOR®]" / "serves Eastern Fort Lauderdale, Easter[n]" / "Reach out to di[scuss]" each truncate | `contact__320x568.png` — three lines of sub-paragraph clip the panel right edge |
| **D5** | `/markets/palm-beach/` | 375×812 | **Sub-paragraph right-clipping** — multiple lines of the panel sub-text overflow right edge | `markets_palm-beach__375x812.png` — "buil[d]", "expecta[tions]", "due d[iligence]", "pursu[ing]" |

These are the high-confidence visible defects from operator review. Full per-route × per-viewport scoring is the job of the rendered audit (Phase 3) + GPT-5.5 visual judgment (Phase 5).

### 2b. CONFIRMED PASSES — Cycle 9 + market-image-recovery wins held

| # | Route | Viewport | What works | Evidence |
|---|---|---|---|---|
| W1 | `/markets/lighthouse-point/` | 1280×800 | Hero image is **vivid + distinctive** (lighthouse + sunset + boats); H1 readable | `markets_lighthouse-point__1280x800.png` |
| W2 | `/markets/coral-ridge/` | 1280×800 | Hero image is vivid (canopy + house); H1 readable | `markets_coral-ridge__1280x800.png` |
| W3 | `/markets/palm-beach/` | 375×812 | Hero IMAGE renders fine + 2 CTAs visible (clipping is in the SUB-TEXT, not the image) | same screenshot as D5 |
| W4 | `/markets/` | 1280×800 | Hub hero panel + sub-text + 2 CTAs all readable above-fold | `markets__1280x800.png` |

### 2c. KNOWN CARRY-FORWARD (Cycle 9 §17 + Market Image Recovery §8 — not new in Cycle 10)

- 28 missing img dim attributes (CLS risk) — `audit:completeness` 1 of 2 pre-existing WARN
- 2 mailto forms (`/contact/`, `/valuation/`) — `audit:completeness` 1 of 2 pre-existing WARN

## 3. What the rendered audit must catch (Phase 3 spec)

From the operator review above + Cycle 9 lessons, the new `scripts/audit-rendered-visual.ts` MUST probe:

1. **Image rendering** — every `<img>` on key routes has `naturalWidth > 0`, rendered width > 0, rendered height > 0, opacity > 0, visibility != hidden.
2. **Market cards visibly render** — every card image bounding box is nonzero; explicit per-market checks for Lighthouse Point / Coral Ridge / Palm Beach.
3. **Hero H1 inside panel** — H1 bounding box right edge `<=` panel right edge at every viewport.
4. **CTA above-fold (desktop)** — primary CTA bottom edge `<=` viewport_height − header_height − 24px buffer at 1280/1440.
5. **CTA tail-clipping (mobile 320)** — primary + secondary CTA visible right edge `<=` panel right edge AND text not clipping (compare bounding-box width vs. natural text width).
6. **Hero sub-paragraph overflow (mobile 320/375)** — `[data-hero-sub]` width `<=` panel content width minus padding.
7. **Hero eyebrow overflow (mobile 320)** — `[data-hero-eyebrow]` width `<=` panel content width.
8. **Mobile horizontal overflow** — page document width `<=` viewport width at every mobile viewport (320/375/768).
9. **CTA contrast** — visible text/background contrast on primary + secondary at all routes/viewports.
10. **Stale-string sweep** — no rendered text contains `Klein Morgan`, `kleinmorgan`, `Family Homes Where Memories Are Made`, `mia@miasanabriarealtor.com`, `[Mia Confirm]`, `[Legal Brokerage Name]`.
11. **Canonical email** — single canonical `msanabriarea@gmail.com` email present on `/contact/` (rendered, not just HTML).

## 4. Skipped / Out-of-Scope

- `/insights/` individual articles — not built (hub is empty-state); flagged in matrix but probe walks the hub only.
- `/markets/` cards visibility test — promoted to Phase 3 / `audit:rendered` per #2.
- 360px / 414px breakpoints — Cycle 11 candidate; this cycle stays on the 5 required viewports.

## 5. Phase 2 verdict

**PROCEED to Phase 3 (rendered audit script via Forge).** Baseline captured + reviewed; high-confidence defects identified (5 across 3 routes); image rendering layer post-Cycle-Addendum is holding (Lighthouse Point / Coral Ridge / Palm Beach all show vivid imagery on desktop). The class of issue Cycle 10 must close is **mobile text overflow inside the navy panel** — Sub-paragraph + eyebrow + CTA all hit the same root cause class.

---

**End of Phase 2 report.**
