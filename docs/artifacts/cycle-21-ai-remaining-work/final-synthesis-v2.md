# Cycle 21 — Final Synthesis v2 (post-reviewer council)

**Updated:** 2026-05-11 after 3 reviewer verdicts.
**Supersedes:** `final-synthesis.md` for implementation order.

## Reviewer council outcomes

| Reviewer | Key finding |
|---|---|
| Implementation verifier | 2 evidence errors: A5 (`heroImageAlt` doesn't exist on Market type), A3 (markets have only `aeoAnswer`, not `aeoQuestion`). 16/18 items SHIP. |
| PM verifier | Top-5: IDX bundle, A1, B1 (homepage H1), A12, A6. Promotes B1, flags A2/A3/A5 over-graded. 5 missing items (most blocked or already covered). |
| Bloat red-team | CUT A14 + A15 (duplicate `CUTOVER_PACKET.md` / `deploy-and-verify.ts`). CUT A16 (n=1 incident; replace with 5-line grep in audit-completeness). A17 is the right promotion. |

Verified bloat claims: `docs/CUTOVER_PACKET.md` (297 lines, §1-§11) + `scripts/deploy-and-verify.ts` (231 lines) + `docs/BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md` (163 lines) all exist. Adding parallel docs/scripts would be pure bloat.

## Revised Tier A — 13 ship items

### Batch 1 — Text + Nav (zero visual risk)
- **A1** Remove "typically the same business day" — `src/app/thank-you/page.tsx:45-46`. Replace with response-style language that respects honesty contract.
- **A12** Add `/insights/` to primary NAV — `src/lib/site.ts:36-44`.
- **A18** Drop `/404/` self-canonical — `src/app/not-found.tsx:9`.

### Batch 2 — Schema (mechanical, no copy change)
- **A4** Add `emitFaqSchema={false}` to AnswerFirst on hub pages that also render Faq — find via grep.
- **A2** Bind insight `aeoQuestion`/`aeoAnswer` into FAQPage emit on `/insights/[slug]/page.tsx`.
- **A3** *(rewritten)* For markets: emit FAQPage with `{ question: "What is ${name} known for in luxury real estate?", answer: market.aeoAnswer }` on `/markets/[slug]/page.tsx`. Template question is safe (same shape as the AEO-block already used).

### Batch 3 — A11y (additive, low risk)
- **A6** Add `download` attribute + visible `(PDF)` marker to FL PDF links — `src/components/markets/FortLauderdaleV2.tsx:826-849`.
- **A11** Contact submit `min-h-[44px]` — `src/app/contact/page.tsx:187`.

### Batch 4 — IDX wrapper (single component + 2 forms; merged from A7/A8/A10 + A9)
- **A8** (merges A7 + A10): In `src/components/IdxEmbed.tsx`, add section id `property-search`, remove dead `width="1200" height="900"`, refine title to "Southeast Florida property search (Matrix MLS)", add (a) visible fallback link, (b) after-iframe handoff CTA card with `?source=idx-search` query, (c) one-line in-page disclaimer.
- **A9** Add hidden `source` input to contact + valuation forms; add tiny client-side stamp script in `app/layout.tsx`.

### Batch 5 — Audits (single edit; the cycle's promotion)
- **A17 + A16-replacement** *(unified)*: In `scripts/audit-completeness.ts`:
  - Replace `SAMPLED_FOOTER_PAGES` iteration with `listBuiltRoutes()` (footer-trust fan from 7→51).
  - Add 5-line IDX iframe `src` host check that grep-finds `sef.mlsmatrix.com` in `out/index.html` and fails if absent.

### Bonus — Tier B promotion
- **A19** *(B7 promoted by impl verifier)*: Surface 2 lead-magnet PDFs (luxury-seller-pre-listing-checklist + valuation-prep-sheet) from `/sellers/` and `/valuation/` aside blocks. Same additive pattern as A6.

## Demoted / cut

| ID | Decision | Reason |
|---|---|---|
| A5 | DEMOTE → Tier B | `heroImageAlt` field doesn't exist on Market type; requires 16 curated alts → Mia approval |
| A14 | CUT | Duplicate of `CUTOVER_PACKET.md §9` + `deploy-and-verify.ts` |
| A15 | CUT | Duplicate of `CUTOVER_PACKET.md` |
| A16 | CUT + merge into A17 | n=1 incident → 5-line grep in audit-completeness, not 80-line new script |
| A13 | Cancelled | `docs/DEPLOY.md` doesn't exist; PDF noindex policy belongs in `CUTOVER_PACKET.md` (deferred — Caddyfile lives in Dokploy, not repo) |

## Pushback risks (PM verifier)

- **A8 IDX CTA copy** — brokerage may want specific wording; default to neutral "Begin a Private Inquiry" / "Request a Valuation" (already used elsewhere on site).
- **A12 /insights/ in NAV** — visible global header change; trigger screenshot capture per project CLAUDE.md.
- **A4 emitFaqSchema removal** — could surprise if Google had ranked hub pages on the duplicate emit; benefit (no Google warning) outweighs theoretical risk.

## Durable promotion (1 per cycle, per project CLAUDE.md rule)

**Promote:** A17 unified — `scripts/audit-completeness.ts` upgrade. Two improvements in one file, single PR. Captures the cycle's load-bearing regression-guard work without burning the budget on a new file.

## Files touched (final count)

Source: 11 files
- `src/app/thank-you/page.tsx`
- `src/app/not-found.tsx`
- `src/app/contact/page.tsx`
- `src/app/valuation/page.tsx`
- `src/app/sellers/page.tsx`
- `src/app/layout.tsx`
- `src/app/insights/[slug]/page.tsx`
- `src/app/markets/[slug]/page.tsx`
- `src/lib/site.ts`
- `src/components/IdxEmbed.tsx`
- `src/components/AnswerFirst.tsx`
- `src/components/markets/FortLauderdaleV2.tsx`

Scripts/docs: 1 file
- `scripts/audit-completeness.ts`

Hub pages (5, for emitFaqSchema={false}) — to be identified via grep.

Visual-edit set (triggers `audit:mobile-readability:capture` per project CLAUDE.md):
- `src/components/IdxEmbed.tsx`, `src/lib/site.ts` (via SiteHeader render), `src/components/markets/FortLauderdaleV2.tsx`, `src/app/contact/page.tsx`, `src/app/thank-you/page.tsx`, `src/app/sellers/page.tsx`, `src/app/valuation/page.tsx`.
