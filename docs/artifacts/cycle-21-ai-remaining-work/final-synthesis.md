# Cycle 21-AI-REMAINING-WORK — Final Synthesis

**Cycle:** 21-AI-REMAINING-WORK  
**Date:** 2026-05-11  
**Baseline:** HEAD `750b179` on `main` (matches origin)  
**Mode:** 10-expert-team delegation → synthesis → safe implementation → verify → deploy  
**Teams dispatched:** 10  
**Teams completed:** 10 (all)  
**Teams partial/failed:** 0  

## Executive summary

10 expert teams ran read-only audits in parallel across the entire site (49 routes, 35 lead surfaces, 247 JSON-LD blocks). Site is in strong shape — typecheck/build/all 10 baseline audits pass. **No P0 site defects.** 6 P1 issues with cross-team convergence form the safe-fix backbone for this cycle.

Two **mission-brief discrepancies** discovered (do not act without principal confirmation):
1. Brief names `miasanabria.com/search` as IDX target — actual iframe `src` is `sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx`. No `miasanabria.com/search` exists in repo.
2. Brief names `miasanabria.com` as production cutover target — repo (`src/lib/site.ts:PRODUCTION_URL`) names `miasanabriarealtor.com`. Repo treated as source of truth.

## Top 10 AI-doable improvements ranked

(See `issue-matrix.md` Tier A for the full 18-item list with file:line evidence)

1. **Remove "same business day" response-time promise** (T2-001 / T4-06) — `src/app/thank-you/page.tsx:46`. CLAUDE.md honesty-contract violation; 1-line fix.
2. **Add IDX wrapper: fallback link + handoff CTA + source attribution** (T3-IDX-002/003/004 + T2-A6) — closes IDX→contact lead-capture gap without GHL dependency. `?source=idx-search` carried through to mailto via hidden field stamped by tiny client script.
3. **Bind FAQPage schema on insights + non-FL markets** (T6-I-006 / I-007) — mechanical schema fix; 27 pages get visible-AEO into searchable schema.
4. **Dedupe double FAQPage emission on 5 hub pages** (T6-I-005) — Google warning; add `emitFaqSchema={false}` prop.
5. **Wire MarketCard alt to existing `heroImageAlt`** (T7-001) — curated alt data already exists in `src/lib/markets.ts`, just unused.
6. **Add `download` attribute + visible `(PDF)` marker to lead-magnet links** (T7-002) — `FortLauderdaleV2.tsx:826-849`.
7. **Add /insights/ to primary header NAV** (T1-002) — 1-line array addition in `src/lib/site.ts`.
8. **Add in-page IDX/MLS disclaimer adjacent to iframe** (T8) — single line under iframe.
9. **Add new `audit-idx-iframe.ts` regression guard** (T10-A) — locks 6 invariants on highest-traffic surface; this cycle's durable promotion.
10. **Cutover infrastructure prep**: `scripts/cutover-smoke-test.ts` + `docs/CUTOVER_RUNBOOK.md` + Caddyfile X-Robots-Tag rule for PDFs (T9-F1/F2/F3).

## Top blocked human/GHL/legal items

1. **GHL endpoint + auth + test plan** — gates 11 lead-flow improvements; without this, forms stay mailto-only (which is correctly non-negotiable to preserve).
2. **DBPR license verification (Mia)** — gates production cutover; currently rendered across footer + PDFs as unverified.
3. **NAR REALTOR® membership confirmation (Mia)** — gates display of R logo.
4. **DMCA USCO registration (in-process)** — gates `.com` cutover.
5. **LPT broker-of-record IDX reciprocity statement** — gates `.com` SEF MLS Matrix compliance.
6. **Two mission-brief discrepancies** — domain (`miasanabria.com` vs `miasanabriarealtor.com`) and IDX target (`miasanabria.com/search` vs `sef.mlsmatrix.com`). Principal must confirm.

## Cross-team conflicts and resolutions

| Conflict | Teams | Resolution |
|---|---|---|
| "FL gold standard" framing | T5 dissented (markets share single template — differences are content density, not visual) vs. memory framing | Adopt Team 5's correction: market pages are structurally identical; FL stands out via content density (10-section page) not visual template. Future work: copy depth on Pompano/Coral Ridge, not template duplication. |
| Homepage H1 canonical direction (Pompano vs Delray) | T1 and T4 both flagged, both deferred to principal | Defer to Torrey: which triad wins? Then 4-file alignment in next cycle. |
| miaQuote rewrite vs removal | T4 dissented internally (F5 Palm Beach: remove or rewrite?) | If `miaQuote` presence is audit-enforced on primary markets, rewrite. Otherwise remove. Defer to Mia approval batch. |
| One-promotion-per-cycle vs. multiple team outputs | T10 explicitly flagged | Cycle-level promotion cap applies to durable-doctrine PROMOTION ("audit / CLAUDE.md / checklist / hook / prompt / issue matrix / GHL plan / deploy script / memory") — NOT to per-team fix outputs. Promote ONE: `audit-idx-iframe.ts` (highest-impact, zero current guard, cycle-20 recurrence). The other audit (`audit-source-jsx-patterns`) has false-positive risk — defer. The `audit-completeness` footer-trust fan-out is a SHARPEN, not a new promotion. |
| /insights/ as nav addition vs SEO siloing | T1 flagged missing, no team objected | Ship: `/insights/` belongs in primary nav. |

## Duplicate findings merged

- **Homepage hero drift**: T1-004 ≡ T4-01 → consolidated as B1 (defer for principal).
- **Thank-you response-time promise**: T2-001 ≡ T4-06 → consolidated as A1 (safe fix).
- **IDX attribution gap**: T2-A6 ≡ T3-IDX-003/004 → consolidated as A7/A8/A9 (safe fix).
- **MarketCard generic alt**: T7-001 references `heroImageAlt` data already in `src/lib/markets.ts` → consolidated as A5.

## P0/P1/P2/P3 issue matrix

See `issue-matrix.md` for full table. Summary:

- **P0:** 0 (T1-008 staging-noindex verified GREEN; logged P0-note only)
- **P1 (6):** A1 (thank-you response-time), A2/A3/A4 (FAQPage schema), A5 (alt), A7/A8/A9 (IDX wrapper). Cross-team converged. All ship this cycle.
- **P2 (28):** Mix of safe (A6, A10, A11, A12, A13, A14, A15, A16, A17, A18) and deferred (B1-B7) and blocked (C-*)
- **P3 (18):** Polish + confirmations + notes

## Safe implementation plan (TIER A — 18 items)

Implementation order minimizes file overlap and lets a single `bun run audit:all` validate at end:

**Batch 1 — text + nav (no visual impact):**
1. A1: Remove response-time promise — `src/app/thank-you/page.tsx`
2. A12: Add /insights/ to NAV — `src/lib/site.ts`
3. A18: Drop /404/ canonical — `src/app/not-found.tsx`

**Batch 2 — schema (mechanical):**
4. A4: AnswerFirst `emitFaqSchema` prop — `src/components/AnswerFirst.tsx` + 5 hub pages
5. A2: Insight aeoQ/A → FAQPage — `src/app/insights/[slug]/page.tsx`
6. A3: Market aeoAnswer → FAQPage — `src/app/markets/[slug]/page.tsx`

**Batch 3 — a11y + alt (low-risk additive):**
7. A5: MarketCard alt — `src/components/MarketCard.tsx`
8. A6: PDF download attribute + (PDF) marker — `src/components/markets/FortLauderdaleV2.tsx`
9. A11: Contact submit min-h-[44px] — `src/app/contact/page.tsx`

**Batch 4 — IDX wrapper (single component + 2 forms + layout):**
10. A7: Fallback link below iframe — `src/components/IdxEmbed.tsx`
11. A8: After-iframe handoff CTA — `src/components/IdxEmbed.tsx`
12. A10: IDX in-page disclaimer — `src/components/IdxEmbed.tsx`
13. A9 part 1: Hidden source inputs — `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`
14. A9 part 2: Lead-source stamp script — `src/app/layout.tsx` or new client component

**Batch 5 — infra/audits (no rendered impact):**
15. A16: New `scripts/audit-idx-iframe.ts` + wire into `audit:all` — `scripts/audit-idx-iframe.ts`, `package.json`
16. A17: `audit-completeness` footer-trust fan-out — `scripts/audit-completeness.ts`
17. A14: `scripts/cutover-smoke-test.ts` — new
18. A15: `docs/CUTOVER_RUNBOOK.md` — new
19. A13: Document `X-Robots-Tag: noindex /downloads/*.pdf` in DEPLOY.md (Caddyfile is in Dokploy, not repo — document the expected rule)

## Files likely affected (visual edit subset triggers screenshot capture)

**Visual-edit set (per project CLAUDE.md, triggers `audit:mobile-readability:capture`):**
- `src/components/IdxEmbed.tsx` (A7/A8/A10)
- `src/components/MarketCard.tsx` (A5)
- `src/components/markets/FortLauderdaleV2.tsx` (A6)
- `src/components/AnswerFirst.tsx` (A4)
- `src/components/SiteHeader.tsx` (A12 reads NAV from site.ts)
- `src/lib/site.ts` (A12 — NAV addition, but src/components/SiteHeader.tsx is the visual surface)
- `src/app/thank-you/page.tsx` (A1)
- `src/app/contact/page.tsx` (A9 + A11)
- `src/app/valuation/page.tsx` (A9)

**Non-visual set:**
- `src/app/insights/[slug]/page.tsx` (A2 — schema only)
- `src/app/markets/[slug]/page.tsx` (A3 — schema only)
- `src/app/not-found.tsx` (A18 — metadata only)
- `src/app/layout.tsx` (A9 — script tag only)
- `scripts/audit-idx-iframe.ts` (new)
- `scripts/audit-completeness.ts` (A17)
- `scripts/cutover-smoke-test.ts` (new)
- `docs/CUTOVER_RUNBOOK.md` (new)
- `docs/DEPLOY.md` (A13 — runbook addendum)
- `package.json` (audit:idx-iframe script entry)

## Deploy/no-deploy expectation

**DEPLOY required** — source/rendered behavior changes (IDX wrapper, FAQPage schema on 27 pages, MarketCard alts on 16 cards, thank-you copy, header nav, contact form). After commit + push:
1. Dokploy deploy via existing flow
2. Cache-bust live verification with `?cb=<hex>` per project CLAUDE.md
3. Smoke-test on key routes (`/`, `/markets/`, `/markets/fort-lauderdale/`, `/contact/`, `/valuation/`, `/thank-you/`, `/insights/`)
4. Confirm `audit:all` green pre-and-post commit

## Verification gates (Phase 4)

Must all pass before commit:
- `bun run typecheck` — exit 0
- `bun run lint` — exit 0
- `bun run build` — exit 0
- `bun run audit:all` — exit 0 (existing 16 audits)
- `bun run audit:idx-iframe` — exit 0 (new audit)
- `bun run audit:no-fabrications` — exit 0
- `bun run audit:trust-row` — exit 0 (no regression)
- `bun run audit:lead-magnets` — exit 0
- `bun run audit:stale` — exit 0
- Manual: footer copy unchanged
- Manual: no `evergreen`, no `same business day`, no `same-day`, no banned superlatives
