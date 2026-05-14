# Cycle 34 — Site-Wide Audit Matrix

> Phase 5 deliverable. Every public route classified on hero, copy, image, schema, compliance, SEO. Evidence from `src/app/**/page.tsx`, `src/lib/site.ts`, `src/lib/mia.ts`, `src/lib/markets.ts`, and existing audit reports (`reports/audit-legal.md`, `reports/audit-about.md`, `reports/qa-gate-matrix.md`).
>
> Status legend: ✓ standard met · ◐ partial · ✗ gap · — not applicable.
> Priority: **P0** = launch-blocking, **P1** = quality-bar, **P2** = nice-to-have.

## Existing audit baseline (run 2026-05-14, Cycle 34 Phase 5)

| Audit | Result |
|---|---|
| `audit:route-inventory` | **PASS** — 48 sitemap routes reconcile to filesystem |
| `audit:no-fabrications` | **PASS** — 0 hits |
| `audit:stale` | **PASS** — clean across `out/` |
| `audit:legal` | **PASS** — 18 ✓ · 1 WARN (DMCA USCO in-process — acceptable for staging) · 0 FAIL |
| `audit:about` | **PASS** — 12 ✓ · 0 WARN · 0 FAIL |
| `audit:qa-gate` | critical **0** · high **4** · medium **1** · low **56** |
| Compliance pattern sweep | **CLEAN** — only 2 hits, both in guard-comments, not user-facing copy |

## Route matrix

> Routes confirmed by `find src/app -name "page.tsx" | sort` plus `sitemap.ts`. Image accuracy and provenance for markets reads from `public/markets/*.jpg` (Cycle 25 brand-tone placeholders, audited green).

| # | Route | Status | H1 | Hero image | Image provenance | Copy | Unique value | CTAs | Schema | SEO title ≤60 | Meta desc ≤155 | Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | live | ◐ | ✓ `/markets/fort-lauderdale.jpg` | repo-approved | ✓ | ✓ | ◐ primary CTA → `/markets/#property-search` (should be `/home-search/`) | ✓ Person + RealEstateAgent + Breadcrumb | ✓ | ✓ | **P1** | Eyebrow currently `Mia Sanabria · REALTOR® with LPT Realty` — brief locks `South Florida Lifestyle`. CTA target stale. |
| 2 | `/home-search/` | live | ✓ | ✓ `/markets/fort-lauderdale.jpg` | repo-approved | ✓ | ✓ | ◐ primary CTA `Talk to Mia` — no explicit search CTA (form is on page) | ✓ Breadcrumb | ✓ | ✓ | **P1** | Eyebrow `Search Listings` — brief locks `South Florida Lifestyle`. `robots: noindex` correct while Bridge in demo mode. |
| 3 | `/markets/` | live | ✓ | ✓ `/markets/hillsboro-mile.jpg` | repo-approved | ✓ | ✓ | ✓ | ✓ RealEstateAgent + Breadcrumb | ✓ | ✓ | P2 | Hero copy slightly opinionated ("most coveted") — borderline but defensible as positioning, not factual ranking. Keep. |
| 4-12 | `/markets/[slug]/` × 23 | live | ✓ | ✓ `/markets/<slug>.jpg` | repo-approved (Cycle 25 brand-tone placeholders for 7 cities) | ✓ rich `Market` data model in `src/lib/markets.ts` (184 KB) | ✓ | ✓ | ✓ Place + RealEstateAgent + Breadcrumb + FAQPage | ✓ | ✓ via `buildMetaDescription` | P2 | Existing `Market` model is already typed and rich. Phase 8 typed-NeighborhoodProfile is **not required as a refactor** — the existing `Market` model already covers it. Phase 8 retitled to a delta-only enhancement. |
| 13 | `/buyers/` | live | ✓ | ✓ | repo-approved | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | P2 | No issues observed. |
| 14 | `/sellers/` | live | ✓ | ✓ | repo-approved | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | P2 | No issues observed. |
| 15 | `/about/` | live | ✓ | ✓ portrait | repo-approved | ✓ no awards / no sales-vol / no testimonials per `audit:about` | ✓ | ✓ | ✓ Person | ✓ | ✓ | P2 | Audit green. License # correctly footer-only. |
| 16 | `/contact/` | live | ✓ | ✓ | repo-approved | ✓ | ✓ | ✓ | ✓ ContactPage | ✓ | ✓ | P2 | Form is mailto-fallback per CLAUDE.md — do not wire GHL endpoint this cycle. |
| 17 | `/valuation/` | live | ✓ | ✓ | repo-approved | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | P2 | — |
| 18 | `/insights/` | live | ✓ | ✓ | repo-approved | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | P2 | — |
| 19 | `/insights/[slug]/` × 12 | live | ✓ | ✓ `/og-insights/<slug>.jpg` | repo-approved | ✓ MDX-driven | ✓ | ✓ | ✓ Article | ✓ | ✓ | P2 | — |
| 20 | `/privacy/` | live | ✓ | — text | — | ✓ | — | ✓ | ✓ WebPage | ✓ | ✓ | P2 | — |
| 21 | `/terms/` | live | ✓ | — text | — | ✓ FREC + FL governing law present per `audit:legal` | — | ✓ | ✓ WebPage | ✓ | ✓ | P2 | — |
| 22 | `/accessibility/` | live | ✓ | — text | — | ✓ | — | ✓ | ✓ WebPage | ✓ | ✓ | P2 | — |
| 23 | `/dmca/` | live | ✓ | — text | — | ◐ USCO in-process language (staging-acceptable per Cycle 16 audit; pre-cutover gate per `CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md`) | — | ✓ | ✓ WebPage | ✓ | ✓ | P0 for production cutover only | — |
| 24 | `/thank-you/` | live | ✓ | — | — | ✓ | — | ✓ | — | ✓ | ✓ | P2 | — |
| 25 | `/thank-you/buyer-brief/` · `/market-brief/` · `/valuation/` | live | ✓ | — | — | ✓ | — | ✓ | — | ✓ | ✓ | P2 | — |
| 26 | `/downloads/[slug]/` × 3 lead magnets | live | ✓ | — | — | ✓ | ✓ | ✓ | — | ✓ | ✓ | P2 | Listed as fs-only in qa-gate output; expected for download routes. |
| 27 | `/404` (not-found) | live | ✓ | — | — | ✓ branded | — | ✓ home link | — | — | — | P2 | — |

## Cycle 34 AI-closeable items (highest leverage)

1. **Homepage `/` Hero eyebrow** — current `Mia Sanabria · REALTOR® with LPT Realty`. Brief locks `South Florida Lifestyle`. **Change.**
2. **Homepage `/` Hero primary CTA target** — current `/markets/#property-search`. The dedicated `/home-search/` page now exists (Cycle 33). **Change to `/home-search/`** with label `Search available homes`.
3. **Homepage `/` Hero secondary CTA label** — current `Begin a Private Conversation`. Brief allows `Talk with Mia` as a more direct phrasing. **Change** (lighter friction; same destination).
4. **`/home-search/` Hero eyebrow** — current `Search Listings`. Brief locks `South Florida Lifestyle`. **Change.**
5. **`/home-search/` Hero CTAs** — add primary `Search available homes` anchor jump to `#listing-search` so the hero has a concrete affordance above the fold. Keep `Talk to Mia` as secondary.

Items 1-5 are the entirety of the Phase 10 implementation slice — surgical, audit-safe, and reversible.

## Items deferred to operator / future cycle

| Item | Why deferred | Owner |
|---|---|---|
| Real SEF MLS feed in Bridge | Bridge demo mode by design until Mia's referrer domain propagates + Bridge support ticket clears | Mia → Bridge |
| Bridge API-key refresh | Explicitly deferred to 2026-05-22 per brief | Torrey |
| Hero background swap to current miasanabria.com asset | Provenance unknown (`vibe.filesafe.space`) per `current-site-hero-background-audit.md` | Torrey/Mia |
| Full neighborhood content fill for 7 Broward cities | Mia copy + licensed photography required | Mia |
| AI-generated illustrative imagery batch | One-sample checkpoint per brief; gated on operator approval | Torrey |
| GHL form wiring | Forbidden per CLAUDE.md this cycle | Torrey |
| DNS cutover to `miasanabria.com` | Out of scope | Torrey |
| `audit:qa-gate` 4 `high` items | Routes flagged: `/downloads/...` and `/404` — fs-only download routes and the 404 page; not user-launch-blocking. To be classified in readiness register. | Next cycle |

## Reference markets (Palm Beach / Lighthouse Point / Victoria Park)

Already routed and approved via `ALL_MARKET_SLUGS` in `src/lib/mia.ts` and `MARKETS` in `src/lib/markets.ts`. They are part of the Featured Markets cluster, not in the 9-city `MIA_APPROVED_NEIGHBORHOODS` working set. **No new routes created** this cycle. Documented in `future-roadmap.md`.

---

Generated 2026-05-14 by Cycle 34 Phase 5.
