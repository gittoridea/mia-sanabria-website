# Cycle 21 — Consolidated Issue Matrix

> Cross-team merged. 138 raw issue rows from 10 teams → deduplicated + cross-referenced.
> Raw TSV: `probes/issue-rows-raw.tsv` (138 rows).
> Generated: 2026-05-11. Cycle: 21-AI-REMAINING-WORK.

## Severity counts (post-merge)

| Severity | Count | Notes |
|---|---|---|
| P0 | 0 | Staging-noindex T1-008 logged P0-note but verified GREEN |
| P1 | 6 | Cross-team converged (homepage hero drift, thank-you response-time, IDX leak, FAQPage binding, IDX disclaimer, market alt) |
| P2 | 28 | Mix of safe-fix and needs-human |
| P3 | 18 | Polish + notes |
| **Total (merged)** | **52** | Down from 138 raw via cross-team merge |

## Owner-type counts

| Owner Type | Count | Description |
|---|---|---|
| 1 — site/content/design defect | 22 | AI can fix |
| 2 — tool/process defect | 8 | AI can fix (audits, scripts) |
| 3 — principal decision | 9 | Needs Torrey/Mia direction |
| 4 — GHL/ops dependency | 8 | Blocked until GHL endpoint |
| 5 — legal/compliance dependency | 3 | DBPR, NAR, DMCA — needs human |
| 6 — launch/cutover dependency | 2 | Domain, DNS |

## TIER A — Safe AI-doable this cycle (HIGH confidence, ship)

| # | ID(s) | Page | Issue | Fix | Files | Confidence |
|---|---|---|---|---|---|---|
| A1 | T2-001 / T4-06 | `/thank-you/` | "typically the same business day" violates honesty contract per CLAUDE.md | Remove or rephrase — no response-time promise | `src/app/thank-you/page.tsx:46` | HIGH |
| A2 | T6-I-006 | 12 insights | `aeoQuestion`/`aeoAnswer` not bound into FAQPage schema | Add Q/A to FAQPage emit on insight slug page | `src/app/insights/[slug]/page.tsx` | HIGH |
| A3 | T6-I-007 | 15 non-FL markets | Market `aeoAnswer` not bound into FAQPage schema | Add aeoAnswer Q/A pair to market FAQPage emit | `src/app/markets/[slug]/page.tsx` | HIGH |
| A4 | T6-I-005 | 5 hub pages | Double FAQPage entities (AnswerFirst + Faq components both emit) | Add `emitFaqSchema={false}` prop to AnswerFirst; merge into page FAQ | `src/components/AnswerFirst.tsx`, hub pages | HIGH |
| A5 | T7-001 | All MarketCards | Alt is `${name} luxury real estate`; curated `heroImageAlt` strings in `src/lib/markets.ts` are unused | Wire `MarketCard` to read `market.heroImageAlt` | `src/components/MarketCard.tsx` | HIGH |
| A6 | T7-002 | FL page PDF links | PDFs missing `download` attribute + visible `(PDF)` marker | Add `download` + `(PDF)` text + ARIA describe | `src/components/markets/FortLauderdaleV2.tsx:826-849` | HIGH |
| A7 | T3-IDX-002 | Homepage IDX | No visible fallback when iframe blocked | Always-visible "Open search in new tab" link below iframe | `src/components/IdxEmbed.tsx` | HIGH |
| A8 | T3-IDX-003 / T2-A6 | Homepage IDX | No after-iframe handoff CTA — leads leak | Add card with two CTAs carrying `?source=idx-search` | `src/components/IdxEmbed.tsx` | HIGH |
| A9 | T3-IDX-004 | Contact + valuation forms | No source attribution on mailto submissions | Hidden `source` input + tiny `<Script>` that stamps from URL param | `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`, `src/app/layout.tsx` (or component) | HIGH |
| A10 | T8 / T3 | Homepage IDX | No in-page MLS Matrix disclaimer adjacent to iframe | Add one-line "Data deemed reliable but not guaranteed. Source: Matrix MLS." line under iframe | `src/components/IdxEmbed.tsx` | HIGH |
| A11 | T5-001 | `/contact/` form | Submit button computed ~40-42px, lacks explicit `min-h-[44px]` | Add `min-h-[44px]` to submit className | `src/app/contact/page.tsx:187` | HIGH |
| A12 | T1-002 | Header NAV | `/insights/` only in footer, missing from primary NAV | Add `{ href: "/insights/", label: "Insights" }` to NAV array | `src/lib/site.ts:36-44` | HIGH |
| A13 | T9-F1 | Caddyfile / deploy | PDFs in `/downloads/` lack X-Robots-Tag noindex header | Add Caddyfile header rule (or document for Dokploy) | Caddyfile / deploy docs | HIGH |
| A14 | T9-F2 | Cutover infra | No automated cutover smoke-test script | New `scripts/cutover-smoke-test.ts` — 40+ route × header matrix | `scripts/cutover-smoke-test.ts` (new) | HIGH |
| A15 | T9-F3 | Cutover infra | Cutover steps scattered across deploy docs | Consolidated `docs/CUTOVER_RUNBOOK.md` | `docs/CUTOVER_RUNBOOK.md` (new) | HIGH |
| A16 | T10-A / ISS-T10-001 | IDX regression | IDX iframe attribute drift has zero deterministic guard | New `scripts/audit-idx-iframe.ts` locking 6 attributes | `scripts/audit-idx-iframe.ts` (new), `package.json` | HIGH |
| A17 | T10-C / ISS-T10-003 | audit-completeness | Footer-trust check samples 4-5 routes vs all 51 | Replace `SAMPLED_FOOTER_PAGES` with `listBuiltRoutes()` | `scripts/audit-completeness.ts:350` | HIGH |
| A18 | T1-005 | `/404` | Self-canonical to non-route URL `/404/` | Drop `alternates.canonical` from `not-found.tsx` | `src/app/not-found.tsx:9` | HIGH |

**18 TIER A items.** All preserve non-negotiables. None fake GHL. None alter copy that needs Mia approval.

## TIER B — Defer this cycle (needs principal or Mia direction)

| # | ID(s) | Issue | Why blocked | Recommended path |
|---|---|---|---|---|
| B1 | T1-004 / T4-01 | Homepage hero H1 names "Pompano Beach"; site.ts tagline + Hero.tsx wbr constant + mia.ts tagline name "Eastern Fort Lauderdale, Boca Raton, Delray Beach" | Three-way drift — either H1 is canonical (update other 3) or constants are canonical (update H1). Principal decision: which is the canonical triad? | Ask Torrey: which heading wins? Then 4-file alignment in one edit. |
| B2 | T4-02 / T4-03 / T4-04 / T4-05 | Four `miaQuote` strings: "absolute zenith" (Boca), "absolute pinnacle" (Palm Beach), "perfectly captures the essence" (Delray), "ultimate sanctuary" (Lighthouse Point) — SEO purple, "exclusive" usage | Voice change needs Mia approval | Draft 4 replacement strings; send to Mia |
| B3 | T5-002 | Hero CTA <360px viewport ~32-36px effective height | Pure design judgment — resize vs. stack CTAs | Defer to next cycle with screenshots |
| B4 | T5-003 | `/insights/` uses `py-16 lg:py-24`; other top-level pages use `py-20 lg:py-28` | Design rhythm decision | Defer — principal call |
| B5 | T6 | `WebSite.publisher = "LPT Realty LLC"` but LPT doesn't publish miasanabriarealtor.com | Schema coherence — principal call: change publisher or document brokerage relationship | Defer to compliance loop with LPT |
| B6 | T6 | `AdministrativeArea` "Eastern Fort Lauderdale" is colloquial not administrative | Schema accuracy nit | Defer |
| B7 | T1-003 | Two lead-magnet PDFs only linked from FL page; topically relevant to `/sellers/` and `/valuation/` | Content-discoverability decision — does Mia want them surfaced sitewide? | Defer or ship with explicit principal nod |

## TIER C — Blocked by external dependency

### C-GHL — Requires GHL endpoint + auth + test plan
- T1-001 / T1-007 / T2-002 / T2-003: Forms route mailto-only with no thank-you redirect
- T2-A1 through T2-A11: GHL webhook field map, validation, retry, audit log, TCPA SMS wiring
- T8-TCPA: 10DLC SMS registration goes live at GHL cutover
- T9-S5-04: Branded email creation

### C-Legal — Requires Mia / brokerage / legal
- T8 R1: DBPR primary-source confirmation of license `SL3405877`
- T8 R2: NAR + local-board active membership written confirmation (gates REALTOR® R logo)
- T8 R3: DMCA designated-agent USCO registration (in-process)
- T8: SEF MLS broker reciprocity statement keyed to provider (needs LPT broker-of-record text)

### C-Launch — Requires DNS + domain confirmation
- T9-S4-01: **Mission-brief discrepancy** — brief says PROD = `miasanabria.com`, repo says `miasanabriarealtor.com`. Repo is source of truth pending principal confirmation.
- T3-IDX-clarification: **Mission-brief discrepancy** — brief says IDX target = `miasanabria.com/search`, actual is `sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx`. No `miasanabria.com/search` exists in repo or in any prior cycle artifact.
- T9-S6: DNS cutover from `miasanabriarealtor.trueidea.com` → `miasanabriarealtor.com`
- T1-008: Production NEXT_PUBLIC_SITE_URL flip in Dokploy
