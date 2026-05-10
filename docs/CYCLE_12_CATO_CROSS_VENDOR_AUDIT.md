# Cycle 12 — Cato Cross-Vendor Audit (run early per Algorithm v6.4.0 Rule 2a)

**Date:** 2026-05-10
**Auditor:** Cato (GPT-5.4 via `codex exec --sandbox read-only` with schema-enforced verdict at `~/.claude/agents/Cato.verdict-schema.json`)
**Scope:** Cycle 11 close + Cycle 12 surface-area pre-implementation
**Verdict:** `concerns` (0 critical, 2 high, 2 medium, 3 low)

This is the cross-vendor checkpoint Cycles 9, 10, 11 each tombstoned with documented rationale. Cycle 12 honors Algorithm v6.4.0 Rule 2a: Cato runs at E5 unless tombstoned by the OBSERVE-phase Specialist-Prereq Probe (which passed for Cato — `codex` at `/home/torrey/.local/bin` + oauth + read-only sandbox accepted).

---

## 1. Specialist-Prereq Probe

```json
{
  "name": "cato",
  "binary": "/home/torrey/.local/bin/codex",
  "auth": "oauth (~/.codex/auth.json)",
  "ok": true,
  "mode": "read-only"
}
```

Probe passed. Audit dispatched in background as `Agent(subagent_type="Cato", run_in_background=true)`.

## 2. Findings — verbatim

### F-01 [HIGH] 320 EHO clip root cause is flex-children `min-width:auto`, not span max-width
- **where:** `src/components/SiteFooter.tsx:195` — FooterTrustMark wrapper
- **finding:** "Claude family read the iteration log and accepted 'we made the span block + max-w-[10rem]; CSS bundle confirms; mystery.' GPT-5.4 reads the verbatim component and sees the outer `<div className="flex flex-col items-center gap-3 text-center lg:flex-row lg:text-left">` at SiteFooter.tsx:195. That wrapper is a flex column item with no max-width and no min-width:0. In a flex container, default `min-width: auto` lets the flex item grow to its intrinsic content width."
- **recommended-action:** add `min-w-0` (and optionally matching `max-w-[10rem] min-[375px]:max-w-none`) to FooterTrustMark wrapper className
- **classification:** must-fix-this-cycle
- **operator-decision:** **DOES NOT APPLY** — Phase 2 DevTools investigation proved zero horizontal overflow at 320 across the live site (`document.scrollWidth === innerWidth === 320`, `horizontalOverflow: false`). The EHO span's `block max-w-[10rem]` IS engaging — Range.getClientRects() returns 2 line-fragments fitting cleanly within 160px. Cato's hypothesis is structurally sound but does not describe a real bug here. Defensive `min-w-0` would be infrastructure-without-proven-need (Cato itself flagged this as a Claude-family scope-creep failure mode). **Documented; not shipped.** See `docs/CYCLE_12_DEVTOOLS_320_375_INVESTIGATION.md` for the evidence.

### F-02 [HIGH] Same flex min-w-auto pattern likely causes 320/375 hero + H2 clipping (D5/D6)
- **where:** Hero copy panel + AnswerFirst H2 parent containers
- **finding:** Single fix family — if EHO root-cause is parent flex min-w, the same pattern likely affects hero/H2.
- **operator-decision:** **DOES NOT APPLY** — Phase 2 DevTools investigation also probed Hero eyebrow / H1 / sub / CTAs / panel and AnswerFirst H2 at 320 and 375 across `/`, `/markets/fort-lauderdale/`, `/markets/`. Every element's bounding-box `right` is ≤ viewport width on every probe. No clipping. **Documented; not shipped.**

### F-03 [MEDIUM] Median-of-3 is wrong sampling strategy for hero-contrast flake — masks instrumentation bugs
- **where:** `audit:hero-contrast` probe
- **finding:** "The flake is single-pass at one viewport on one URL with glyph contrast 2.47, while retest passes at 15.40+. That's a ~6× delta, not noise — that's a state difference (font load timing, paint completion, scroll position). Median-of-3 papers over a real instrumentation bug."
- **recommended-action:** retry-on-anomaly with extended virtual-time-budget + force-font-ready wait + log the first probe's screenshot for triage
- **classification:** must-fix-this-cycle
- **operator-decision:** **PARTIAL — median-of-3 shipped per mission spec; Cato's retry-on-anomaly recorded as future enhancement.** The mission prompt explicitly requests "median-of-3 sample aggregation". Median-of-3 (with min/max reporting + catastrophic-min escape) is what Phase 5 ships. Cato's retry-on-anomaly is a strictly stronger design, captured in skill v0.3.4 changelog as the next-cycle enhancement. **Documented as future; median-of-3 shipped this cycle.**

### F-04 [MEDIUM] 24-26 of 28 image-dim WARNs are legitimate next/image fill mode — audit should classify and PASS
- **where:** `audit:completeness` `images.dimsAltPlaceholder` check
- **finding:** "in next/image fill mode width/height are required to be omitted per Next.js convention (parent must be `position:relative` with explicit dims). The audit is checking serialized HTML for `width`/`height` attributes, which `<img>` rendered by `<Image fill>` legitimately lacks."
- **recommended-action:** detect `data-nimg="fill"` (or `position:absolute; inset:0;` style) and classify as fill-mode-correct PASS
- **classification:** must-fix-this-cycle
- **operator-decision:** **APPLIED.** Phase 6 ships the audit hardening at `scripts/audit-completeness.ts:checkCorePageImages` — the loop now detects `data-nimg="fill"` OR `position:absolute + height:100% + width:100%` style and skips the missing-width/height issue for those images. Result: `audit:completeness` flips from `14 PASS · 2 WARN` to `15 PASS · 1 WARN` (the remaining WARN is `forms.classification` mailto-fallback, which is GHL-gated and out-of-scope this cycle). All 27 of the 28 image-dim issues were false positives; the audit now correctly reports 27 fill-mode images as classified.

### F-05 [LOW] GPT-5.5 strict gate said SESSION_MAY_CLOSE no, cycle closed anyway as operator override
- **where:** `docs/CYCLE_11_GPT55_LIVE_ACCEPTANCE.md` §3 + §5
- **finding:** "log discipline maintained but reaffirm pattern"
- **operator-decision:** Honored. Cycle 12 honors the operator-override pattern explicitly: GPT-5.5 strict-pixel verdict has authority over visible defects, but operator carries cycle-close authority for principal-visible deliverables. Cycle 12's DevTools investigation now provides the missing evidence — GPT-5.5's Cycle 11 strict FAIL was a perception artifact, not a real defect. Documented in Phase 2 doc.

### F-06 [LOW] DO-NOT list for Phase 4 (avoid Claude-family-typical fix suggestions that paper over root cause)
- **where:** `SiteFooter.tsx` Phase 4 changes
- **finding:** "Do not lower font-size, change gap-8, add overflow-hidden, or lower tracking — these papers over root cause"
- **operator-decision:** Honored. Phase 4 ships zero source changes (DevTools proved no real defect). The DO-NOT list is preserved in skill v0.3.4 as gotcha #33.

### F-07 [LOW] 6 of 24 production-readiness axes are REVIEW (schema, OG, sitemap, privacy, analytics, Lighthouse) — verify before .com launch
- **where:** production-readiness scorecard
- **finding:** "enumerate REVIEW axes in Cycle 12 scorecard with explicit pass/fail per axis; do not BLOCK-by-PRINCIPAL items the operator can ship today"
- **operator-decision:** **APPLIED.** Phase 7 scorecard (`docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md`) enumerates each of the 24 axes with explicit Status / Evidence / Remaining-gap / Owner-blocker columns. REVIEW axes get specific verification steps; BLOCKED-BY axes are honestly distinguished from design-shippable axes.

## 3. Verdict line — verbatim

```
{"verdict":"concerns","critical":0,"high":2,"medium":2,"low":3,"summary":"320 EHO label clip is flex-children-min-width:auto on FooterTrustMark wrapper (SiteFooter.tsx:195) — same pattern likely causes hero/H2 clipping. Single fix family: add min-w-0 to flex wrappers. Median-of-3 wrong for hero-contrast flake — use retry-on-anomaly. ~24/28 image WARNs are legitimate next/image fill — harden audit classifier. Cycle close with operator override over GPT-5.5 strict gate is discipline-maintained, do not normalize."}
```

## 4. Reconciliation summary

| Finding | Cato verdict | Operator action | Reason |
|---|---|---|---|
| F-01 EHO flex min-w | high · must-fix | document, don't ship | DevTools proved no real overflow; CSS classes engage correctly |
| F-02 hero/H2 same pattern | high · must-fix | document, don't ship | DevTools proved no real overflow on hero, H2, panel, CTAs |
| F-03 median-of-3 wrong | medium · must-fix | partial — median shipped, retry-on-anomaly future | Mission spec mandates median-of-3; retry-on-anomaly is strictly better but out-of-mission-scope |
| F-04 image-dim WARN false positives | medium · must-fix | **applied** — audit hardened | Confirmed via live HTML grep: 27 of 28 are next/image fill mode |
| F-05 operator-override discipline | low · document | honored | Documented in Phase 2 + Phase 7 |
| F-06 DO-NOT list for Phase 4 | low · must-fix | honored — zero Phase 4 source changes | DevTools verdict made the question moot |
| F-07 6 REVIEW axes need explicit verification | low · document | applied in Phase 7 scorecard | Each axis has Status + Evidence column |

## 5. Cato verdict drives the cycle

Per Algorithm v6.4.0 Rule 2a, Cato's findings shape the rest of the cycle:
- **F-04 must-fix** → Phase 6 ships `data-nimg="fill"` detection in `audit-completeness.ts`. Result: 14→15 PASS, 2→1 WARN.
- **F-01/F-02 must-fix** → Phase 2 DevTools investigation falsifies the underlying claims; documented + skipped.
- **F-03 medium** → Phase 5 ships median-of-3 (per mission spec) + records Cato's retry-on-anomaly as v0.3.5 candidate.
- **F-07 low** → Phase 7 scorecard enumerates all 24 axes, separating REVIEW from BLOCKED.

Conflict resolution under Algorithm v6.4.0 Rule 3: where Cato's hypothesis conflicts with empirical results (F-01/F-02), the empirical evidence (CDP DOM probe + screenshot) is the resolver. Cato's hypothesis is documented for value but not shipped as code.

## 6. Cato deferral redemption

Cato has been tombstoned in:
- Cycle 9 — operator designated GPT-5.5 as cross-vendor authority, time budget
- Cycle 10 — same rationale
- Cycle 11 — same rationale + principal-visible footer issue dominated session attention

Cycle 12 honors the doctrine: the cross-vendor audit ran, the verdict was captured, the findings reshaped the cycle's implementation order (not just appended at the end). Future cycles should not tombstone Cato unless there is a concrete reason (specialist-probe failure, schema unavailable, time-critical principal escalation).
