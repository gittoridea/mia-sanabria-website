# Reviewer — Implementation Verifier

**Cycle:** 21-AI-REMAINING-WORK
**Date:** 2026-05-11
**Reviewer role:** fresh-context implementation verification of 18 Tier A safe-fix items
**Source files spot-checked:** `src/app/thank-you/page.tsx`, `src/lib/site.ts`, `src/components/IdxEmbed.tsx`, `src/components/MarketCard.tsx`, `src/lib/markets.ts`, `src/components/AnswerFirst.tsx`, `src/app/insights/[slug]/page.tsx`, `src/app/markets/[slug]/page.tsx`, `src/app/not-found.tsx`, `src/app/contact/page.tsx`, `src/components/markets/FortLauderdaleV2.tsx`, `scripts/audit-completeness.ts`, `scripts/audit-stale-terms.ts`, `package.json`

## Per-item verdicts

A1: SHIP — `thank-you/page.tsx:45-46` text exact, no audit conflict, clean edit.
A2: SHIP — `buildFaqSchema` exists at insights `[slug]:89`; appending aeoQ/A trivially supported.
A3: REWRITE — `Market` type has `aeoAnswer` but NO `aeoQuestion` field; need synthetic Q or schema addition.
A4: SHIP — `AnswerFirst.tsx:14` already exposes `emitFaqSchema` prop defaulting true; flip on 5 hubs.
A5: REWRITE — `heroImageAlt` does NOT exist in `markets.ts`; type lacks field, no curated strings present.
A6: SHIP — FL PDF block at lines 826-849 confirmed; `download` + visible `(PDF)` text is purely additive.
A7: SHIP — `IdxEmbed.tsx` has only `<noscript>` fallback; always-visible link below iframe is additive.
A8: SHIP — handoff CTA card with `?source=idx-search` is additive, mailto-preserving, no GHL.
A9: SHIP — hidden `<input name="source">` + client `<Script>` works in static-export Next.js.
A10: SHIP — single disclaimer line under iframe; no audit constraint on iframe wrapper copy.
A11: SHIP — `contact/page.tsx:187` submit className confirmed; `min-h-[44px]` is additive.
A12: SHIP — `site.ts:36-44` NAV array confirmed; one-line array push.
A13: SHIP — documentation-only (Caddyfile lives in Dokploy, repo edit is `docs/DEPLOY.md`).
A14: SHIP — new script, no existing-file overlap; one-promotion rule does not apply to scaffolding.
A15: SHIP — new doc, no overlap; same caveat as A14.
A16: SHIP — `scripts/audit-idx-iframe.ts` new; THIS is the cycle's one promotion (synthesis correctly flags).
A17: SHIP — `audit-completeness.ts:65` confirms `SAMPLED_FOOTER_PAGES` (7 routes, not 4-5 as synthesis claims); fan-out to `listBuiltRoutes()` is mechanical.
A18: SHIP — `not-found.tsx:9` self-canonical to `/404/` confirmed; deletion is correct.

**SHIP: 16 · REWRITE: 2 · HOLD: 0 · Items needing attention: 2 (A3, A5)**

## Answers to 5 review questions

**1. Audit/non-negotiable breakage risk?** A17 fan-out from 7 → ~51 routes may surface NEW failures the sampled audit was masking (e.g., footer trust strip drift on insight slugs or non-FL markets). This is the intended behavior but should be run pre-commit so any newly-exposed failures get fixed in-cycle, not after. No other item breaks an existing gate.

**2. File:line evidence wrong?** A5 says curated `heroImageAlt` strings "already exist in `src/lib/markets.ts`" — they do NOT. `grep -n heroImageAlt src/lib/markets.ts` returns zero matches; `Market` type at line 30 has no such field. A17 says "4-5 routes" — actual is 7. A3 implies markets have aeoQuestion — they only have `aeoAnswer`; the FAQ Q must be synthesized or a new field added.

**3. Static-export infeasible?** None. A9 hidden-input + tiny client `<Script>` stamping `URLSearchParams` into a form input is fine in static export (runs in browser). A14 cutover smoke-test is a Node script, not bundled. A16 audit script is build-time only.

**4. Tier B that should be Tier A?** **B7** (surfacing 2 PDF lead-magnets on `/sellers/` and `/valuation/`) is low-risk additive linkage — same `download` pattern as A6, no copy change, no Mia approval needed if framing matches existing FL copy. Recommend promote to A19.

**5. Non-negotiable violation?** None violated. Synthesis correctly preserves mailto fallback, footer copy is untouched, no "evergreen"/"same business day" reintroduced (A1 removes it), bun-only, static export preserved, one-promotion-per-cycle honored (A16 is the durable promotion; A17 is a SHARPEN of existing audit per synthesis).

## Required pre-implementation actions

- A3: amend fix — either (a) add `aeoQuestion` field to `Market` type + 16 entries (HIGH effort, defer), or (b) synthesize Q as `"What is [name] known for in luxury real estate?"` matching the existing aeoAnswer docstring at `markets.ts:80` (LOW effort, ship). Recommend (b).
- A5: amend fix — add `heroImageAlt?: string` to `Market` type, populate per-market in `markets.ts`, then wire `MarketCard.tsx:29`. This is no longer a "one-line wire-up"; it is a 16-entry content addition. Either rewrite the ticket or downgrade confidence from HIGH to MEDIUM and split into type-add + content-fill subtasks.
- A17: run pre-commit and triage any newly-surfaced footer-trust failures before declaring `audit:all` green.
