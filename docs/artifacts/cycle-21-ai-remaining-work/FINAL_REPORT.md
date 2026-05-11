# Cycle 21-AI-REMAINING-WORK — Final Report

**Cycle:** 21-AI-REMAINING-WORK
**Date:** 2026-05-11
**Baseline:** `750b179` on `main` (clean)
**Approach:** 10-expert-team parallel delegation → 3-reviewer synthesis council → safe implementation → audit verify → deploy

## 1. Executive summary

10 expert teams ran read-only audits in parallel across the entire site (49 routes, 35 lead surfaces, 247 JSON-LD blocks). 3 fresh-context reviewers (implementation, PM, bloat red-team) reviewed the synthesis before any edit. Reviewer council caught 3 evidence errors + 3 bloat candidates pre-implementation.

13 safe-fix items shipped this cycle. 1 durable promotion (audit-completeness upgrade — footer-trust fan + new IDX iframe integrity check). 0 P0 site defects found. Site is stronger, lighter, and more launch-ready. No non-negotiable violated.

## 2. Team delegation summary

**Teams dispatched (10):**
1. Route inventory & consistency — completed
2. Lead generation & GHL architecture — completed
3. IDX/search experience — completed
4. Copy, ICP, brand compression — completed
5. UI/UX, visual, mobile conversion — completed
6. SEO, AEO, local SEO, schema — completed
7. Accessibility, performance, technical QA — completed
8. Compliance boundary & claims — completed
9. Security, ops, launch, cutover — completed
10. QA tooling & regression infrastructure — completed

**Teams partial/failed:** 0.
**External tools used:** Bun (typecheck/build/audits), google-chrome --headless (screenshot capture via audit:mobile-readability), playwright (available, not directly invoked). No Codex Spark, no Cato (compliance scope kept to in-team classification only — no Cato signoff was claimed).

**Synthesis Council (3 reviewers, fresh context):**
- **Implementation verifier:** 16/18 SHIP, caught 2 evidence errors (A5 `heroImageAlt` field doesn't exist; A3 markets have no `aeoQuestion`). Promoted B7→A19.
- **PM verifier:** Top-5 sequence prioritized IDX bundle, A1, B1 (homepage H1), A12, A6. Flagged P1 over-grading on schema items. 5 missing items surfaced (most blocked or already covered).
- **Bloat red-team:** Cut A14, A15, A16. CUTOVER_PACKET.md + deploy-and-verify.ts + LAUNCH_CHECKLIST.md already exist. n=1 IDX incident doesn't justify a dedicated audit; folded into audit-completeness.

**Conflicts/dissent resolved:**
- A14/A15 (cutover doc/script) — CUT per bloat reviewer; verified existing artifacts cover the ground.
- A16 (audit-idx-iframe.ts standalone) — CUT, folded into audit-completeness as 5-line check.
- A5 (MarketCard heroImageAlt) — DEMOTED to Tier B; field doesn't exist.
- A3 (market FAQPage binding) — REWRITTEN with template question per impl verifier.
- B1 homepage H1 alignment — DEFERRED for principal direction (cannot resolve which triad is canonical).
- A19 PDF surfacing on /sellers/+/valuation/ — DEFERRED; needs visual design judgment.

## 3. Full issue matrix summary

See `issue-matrix.md` for full table. Final tally:

- Total issues across teams (raw): 138 rows
- Deduplicated across team boundaries: 52
- P0: 0
- P1 (cross-team converged): 6
- P2: 28
- P3: 18

By owner type: 22 site/content/design defects, 8 tool/process defects, 9 principal decisions, 8 GHL/ops dependencies, 3 legal/compliance dependencies, 2 launch/cutover dependencies.

## 4. Safe fixes implemented (13 items)

| # | ID | What changed | File(s) | Verification |
|---|---|---|---|---|
| 1 | A1 | Removed thank-you "typically the same business day, occasionally the next" honesty-contract violation | `src/app/thank-you/page.tsx` | grep returns 0 occurrences; audit:stale PASS |
| 2 | A2 | Bound insight `aeoQuestion`/`aeoAnswer` into FAQPage schema on 12 posts | `src/app/insights/[slug]/page.tsx` (`buildFaqSchema`) | audit:schema PASS; output grep shows aeoQuestion text in JSON-LD |
| 3 | A3 | Markets now emit unified FAQPage including AEO Q+A via template question | `src/app/markets/[slug]/page.tsx` | "What is Boca Raton known for in luxury real estate?" present in `out/markets/boca-raton/index.html` JSON-LD |
| 4 | A4 | Added `emitFaqSchema={false}` to AnswerFirst on 5 hub pages — eliminates Google double-FAQPage warning | `src/app/{page,buyers,sellers,valuation,about}/page.tsx` | FAQPage count per hub page now 1 (was 2) |
| 5 | A6 | FL lead-magnet links: converted `<Link>` → `<a download>`, made "PDF" marker accessible to screen readers | `src/components/markets/FortLauderdaleV2.tsx:826-849` | `download` attribute present 3× in built output |
| 6 | A8 | IDX wrapper: section `id="property-search"` anchor, refined iframe title to "(Matrix MLS)", removed dead `width/height` HTML attrs, visible "Open in new tab" fallback link, in-page MLS disclaimer, after-iframe handoff CTA card | `src/components/IdxEmbed.tsx` | All 5 audit-completeness IDX sentinels PASS |
| 7 | A9 | Hidden `source` input on contact + valuation forms; client-side `LeadSourceStamp` component reads URL `?source=…` and stamps the input. Carries through mailto body via `encType="text/plain"`. No GHL dependency. | `src/components/LeadSourceStamp.tsx` (new); `src/app/layout.tsx`; `src/app/contact/page.tsx`; `src/app/valuation/page.tsx` | Hidden input present in both built forms |
| 8 | A10 | (Merged into A8) IDX in-page MLS disclaimer adjacent to iframe | `src/components/IdxEmbed.tsx` | "Listing data deemed reliable but not guaranteed" present on homepage |
| 9 | A11 | Contact form submit button `min-h-[44px]` for WCAG 2.5.5 tap-target compliance | `src/app/contact/page.tsx:187` | `min-h-[44px]` present in built output |
| 10 | A12 | Added `/insights/` to primary header NAV between `/markets/` and `/buyers/` | `src/lib/site.ts:NAV` | Header now shows Insights link; audit:rendered PASS |
| 11 | A17 | `scripts/audit-completeness.ts`: footer-trust fan from 7 sampled → 48 built routes; new IDX iframe integrity check (5 sentinels) | `scripts/audit-completeness.ts` | New audit run: "all 48 built routes carry full footer trust set"; "5/5 IDX sentinels present" |
| 12 | A18 | Dropped self-canonical `/404/` from `not-found.tsx` (404 doesn't need canonical) | `src/app/not-found.tsx` | grep `canonical.*404` returns 0 matches in `out/404.html` |
| 13 | (cleanup) | Removed now-unused `SAMPLED_FOOTER_PAGES` constant | `scripts/audit-completeness.ts` | typecheck PASS |

## 5. Files changed (12 source + 1 script + 1 new component)

```
src/app/about/page.tsx
src/app/buyers/page.tsx
src/app/contact/page.tsx
src/app/insights/[slug]/page.tsx
src/app/layout.tsx
src/app/markets/[slug]/page.tsx
src/app/not-found.tsx
src/app/page.tsx
src/app/sellers/page.tsx
src/app/thank-you/page.tsx
src/app/valuation/page.tsx
src/components/IdxEmbed.tsx
src/components/markets/FortLauderdaleV2.tsx
src/components/LeadSourceStamp.tsx                  (NEW)
src/lib/site.ts
scripts/audit-completeness.ts
```

## 6. Commands run + results

| Phase | Command | Result |
|---|---|---|
| 0 | `git status --short` + ETag probes | clean, baseline ETag captured |
| 0 | `bun run typecheck` | exit 0 (baseline) |
| 0 | `bun run build` | exit 0 (baseline) |
| 0 | `bun run audit:{route-inventory,qa-gate,trust-row,lead-magnets,no-fabrications,copy-density,stale,schema,seo,links}` (parallel) | all 10 exit 0 |
| 1-2 | 10 Team agents + 3 Reviewer agents (parallel) | all 13 completed, 0 partial/failed |
| 3 | (sequential edits, batch 1-5) | 12 source files + 1 new component + 1 script |
| 3 | `bun run typecheck` (post-each-batch) | exit 0 |
| 3 | `bun run lint` (post-each-batch) | 0 warnings/errors |
| 4 | `bun run build` | exit 0 |
| 4 | `bun run audit:all` | all PASS (+ 1 expected WARN on forms.classification — pre-existing mailto state, no regression) |
| 4 | `bun run audit:completeness` (with new check) | 16 PASS · 1 WARN · 0 FAIL — IDX iframe integrity 5/5; footer trust 48/48 |
| 4 | `bun run audit:mobile-readability:capture` | 56 PASS · 0 FAIL — screenshots captured |
| 4 | Regression-guard greps (response-time, evergreen, trust row, footer copy, IDX sentinels, source inputs, NAV /insights/) | all green |

## 7. Screenshots / artifacts

- Team reports: `docs/artifacts/cycle-21-ai-remaining-work/team-reports/team{1-10}-*.md`
- Reviewer reports: `docs/artifacts/cycle-21-ai-remaining-work/external-reviews/reviewer-{implementation-verifier,pm,bloat-redteam}.md`
- Synthesis (v1 + v2): `docs/artifacts/cycle-21-ai-remaining-work/{final-synthesis,final-synthesis-v2}.md`
- Issue matrix: `docs/artifacts/cycle-21-ai-remaining-work/issue-matrix.md`
- Baseline audit logs: `docs/artifacts/cycle-21-ai-remaining-work/baseline-audits/*.log`
- Route inventory: `docs/artifacts/cycle-21-ai-remaining-work/probes/{route-inventory,detailed-routes}.txt`
- Cycle-21 screenshot subset (post-deploy refresh expected): `docs/artifacts/cycle-21-ai-remaining-work/screenshots/after/`
- Full mobile-readability capture: `docs/artifacts/cycle-19A-M/mobile-readability/after/` (audit hardcodes this path — known tech-debt, deferred)

## 8. Live verification (deploy)

*Live ETag + smoke results to be appended to this section after deploy completes.*

## 9. What remains blocked

Grouped by owner type:

### 9.1 Site/content/design defects
- **B1 — Homepage H1 alignment.** `src/app/page.tsx:84` H1 names "Pompano Beach"; `src/lib/site.ts:tagline`, `src/components/Hero.tsx` wbr constant, and `src/lib/mia.ts:tagline` name the canonical triad "Eastern Fort Lauderdale, Boca Raton, Delray Beach." Three-way drift; principal direction needed: which is canonical?
- **B2 — Four `miaQuote` rewrites in `src/lib/markets.ts:364/443/514/594`** (Boca/Palm Beach/Delray/Lighthouse Point). Current strings contain SEO-purple language ("absolute zenith," "absolute pinnacle," "perfectly captures the essence," "ultimate sanctuary," "exclusive"). Mia voice approval needed.
- **B3 — Hero CTA <360px viewport ~32-36px effective height.** Resize vs. stack — design judgment.
- **B4 — `/insights/` `py-16 lg:py-24` vs other top-level pages `py-20 lg:py-28`.** Padding rhythm — principal call.
- **B7 (deferred) — Surface 2 lead-magnet PDFs on `/sellers/` and `/valuation/`.** New visual scaffolding needed.

### 9.2 Tool/process defects
- `audit-mobile-readability.ts` hardcodes `docs/artifacts/cycle-19A-M/mobile-readability/after` as the screenshot destination. Should be parameterized by cycle ID.

### 9.3 Principal decisions
- Homepage H1 canonical triad (B1 — see above).
- miaQuote rewrite vs. removal (B2).
- Hero CTA mobile sizing (B3).
- /insights/ section padding (B4).
- WebSite.publisher = "LPT Realty LLC" coherence (B5 — schema-side; principal call).
- AdministrativeArea "Eastern Fort Lauderdale" as colloquial (B6 — minor schema accuracy nit).

### 9.4 GHL/ops dependencies
- GHL endpoint URL + auth + test plan (gates 11 lead-flow improvements).
- GHL form/webhook field map activation (currently planned, not live).
- 10DLC SMS registration (activates when GHL goes live).
- Branded email / from-domain decision.
- Gmail deliverability check on current `mailto:` recipient (SPF/DKIM/DMARC).
- Phone-tap tracking baseline (deferred — needs an event sink; revisit at GHL cutover).

### 9.5 Legal/compliance dependencies
- DBPR primary-source confirmation of license `SL3405877` (currently rendered as `MIA.unverified.licenseNumber` across footer + PDFs).
- NAR + local-board active membership written confirmation (gates REALTOR® R logo display).
- DMCA designated-agent USCO registration (in-process).
- SEF MLS broker reciprocity statement keyed to provider (needs LPT broker-of-record text for `.com` cutover).

### 9.6 Launch/cutover dependencies
- **Mission-brief discrepancy #1:** Brief named `miasanabria.com` as production cutover target; repo (`src/lib/site.ts:PRODUCTION_URL`) names `miasanabriarealtor.com`. Repo treated as source of truth pending principal confirmation.
- **Mission-brief discrepancy #2:** Brief named `miasanabria.com/search` as IDX target; actual iframe `src` is `sef.mlsmatrix.com/Matrix/Public/IDXSearch.aspx?count=1&idx=10bd1eab&pv=&or=`. No `miasanabria.com/search` exists in repo or any prior cycle artifact.
- DNS cutover from `miasanabriarealtor.trueidea.com` → `miasanabriarealtor.com`.
- Production `NEXT_PUBLIC_SITE_URL` build-arg flip in Dokploy.
- Search Console submission (post-cutover, principal owns).
- Direct Axess sunset coordination on existing `miasanabriarealtor.com` host.

## 10. Exact next-cycle recommendation

**Cycle 22 — Lead-flow GHL Activation + Homepage Canonical Direction**

1. **Pre-cycle:** Principal must answer two questions:
   - Which homepage triad is canonical? Update either `src/app/page.tsx:84` OR (`src/lib/site.ts` + `src/components/Hero.tsx` + `src/lib/mia.ts`) to align. The 4-file alignment is then a 30-minute AI edit.
   - Is `miasanabria.com` or `miasanabriarealtor.com` the production cutover target? (resolves mission-brief discrepancy).
2. **If GHL endpoint + auth + test plan exist:** wire the contact + valuation forms; activate thank-you redirects; ship audit log; preserve mailto as fallback per CLAUDE.md contract.
3. **If GHL not ready:** skip lead-flow work; ship miaQuote rewrites (B2) once Mia approves, plus the deferred A19 PDF-surfacing edit on `/sellers/`+`/valuation/`.

## Smarter-AI Closeout

- **Earlier catch:** The synthesis bloat-reviewer artifact (`reviewer-bloat-redteam.md`) caught 2 new docs + 1 new script that duplicated existing `docs/CUTOVER_PACKET.md`, `scripts/deploy-and-verify.ts`, and `docs/BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md`. A `ls docs/ && ls scripts/` probe before the synthesis would have caught it; the fresh-context reviewer caught it without that probe.
- **Pattern type:** recurring — duplicate-doc creation is a known multi-cycle drift.
- **Smallest durable improvement:** `scripts/audit-completeness.ts` — fanned `checkFooterTrust` from 7 sampled routes to all 48 built routes + added a `checkIdxIframeIntegrity` 5-sentinel guard on the highest-traffic surface. Single file, two coupled improvements, one PR.
- **Promotion target:** audit
- **Bloat guard:** discard — the bloat-reviewer caught 3 unjustified new files (CUTOVER_RUNBOOK.md, cutover-smoke-test.ts, audit-idx-iframe.ts) before they shipped. `docs/CUTOVER_PACKET.md` + `scripts/deploy-and-verify.ts` already carry this load.
- **Action taken:** updated `scripts/audit-completeness.ts` (cycle's single durable promotion); added 13 substantive edits; added new component `LeadSourceStamp.tsx`.
- **Owner category:** site/content/design defect (most of the cycle's work); tool/process improvement (the one promotion).

### Reflection answers (per mission packet final section)

- **What would a smarter AI team have delegated differently?** Run a "what-exists" probe (ls docs/ + ls scripts/ + grep for existing audit functions) BEFORE building the synthesis. Three CUTs in the bloat review (A14/A15/A16) were preventable.
- **Which team should be reused next cycle?** Team 6 (SEO/AEO/schema) — surfaced 12+15 page FAQPage binding gap that no other team would have seen. Team 3 (IDX) — narrow scope, sharp findings. Team 10 (QA tooling) — explicitly flagged the one-promotion-per-cycle tension correctly.
- **Which team created noise and should be dropped?** None outright. Team 2 (lead gen/GHL) produced 12 safe-AI-scaffolding candidates; most are blocked until GHL — Team 2 should narrow to "what can ship without GHL" only for next cycle, not full GHL design space.
- **What is the smallest durable infrastructure improvement from this cycle?** `scripts/audit-completeness.ts`: footer-trust now scans every built route (48), not a hand-picked 7; new IDX iframe 5-sentinel check on highest-traffic surface. Single file, single PR, two coupled improvements.
- **What should not be preserved to avoid bloat?** `final-synthesis.md` (v1) — superseded by `final-synthesis-v2.md`. Keep v2; v1 retained only as audit trail of pre-reviewer state. Also: do NOT promote the synthesis-council pattern to global CLAUDE.md without 2 more cycles of evidence — Cycle 20-R1 already added Smarter-AI Closeout; one-promotion-per-cycle still holds.
