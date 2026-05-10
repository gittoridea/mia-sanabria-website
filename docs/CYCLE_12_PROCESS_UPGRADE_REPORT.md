# Cycle 12 — Process Upgrade Report

**Date:** 2026-05-10
**Skill:** `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` v0.3.3 → **v0.3.4**
**Changelog:** `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md` v0.3.4 entry appended at top

---

## 1. Top-level v0.3.4 changes

- **Hard-gate count:** 23 → 26 (+ #24 CDP-probe-before-CSS-iteration, + #25 Cato deferral redemption, + #26 production-readiness scorecard mandatory).
- **Soft-gate count:** 3 (unchanged).
- **Gotchas:** added #33 (vision-model false-positive on multi-line wrapped uppercase letterspaced text), #34 (next/image fill detection in audit:completeness), #35 (audit:hero-contrast mutation sentinel must survive median-of-N).
- **New workflow:** `Workflows/StrictPixelClipEscalation.md` — 5-step escalation flow (CSS confirm → 1× iteration → CDP probe → verdict per element → HARD-STOP if non-real-defect).
- **Per-cycle artifact:** `CYCLE_<N>_PRODUCTION_READINESS_SCORECARD.md` when cycle approaches `.com`-cutover-readiness language.

## 2. Durable lessons codified this cycle

### Lesson 1 — When strict-pixel reviewer flags a clip and CSS is confirmed-correct, escalate to CDP probe, not another CSS iteration

Cycle 11 ran 3 within-cycle iterations on a 320 EHO label clip. CSS classes were confirmed in HTML + bundle on each iteration. The visual didn't resolve. **The next attempt should not have been a 4th CSS iteration.** Cycle 12 broke the pattern: CDP probe (computed style + bbox + Range.getClientRects + full-page screenshot) produced definitive evidence that there was no real defect. The "clip" was a perception artifact in vision-model strict-pixel review of multi-line wrapped Cinzel-uppercase letterspaced text.

The skill now codifies this as HARD gate #24: **strict-pixel reviewer flags a clip → 1× CSS iteration permitted → if iteration fails, NEXT probe MUST be CDP, not another CSS iteration**. Reference scripts `/tmp/cdp-probe-mia.ts` + `/tmp/cdp-fullpage-mia.ts` are reproducible from any clean session and should migrate into permanent skill substrate (Cycle 13 candidate).

### Lesson 2 — Cato deferral has a redemption ceiling

Three consecutive cycles tombstoned Cato (Cycles 9, 10, 11) with documented rationale (operator designated GPT-5.5 as cross-vendor authority; time budget; principal-visible footer issue dominated session attention). Each rationale was reasonable in isolation. Three consecutive deferrals normalize the pattern.

Cycle 12 ran Cato early (Phase 1) and used its findings to SHAPE the rest of the cycle, not append at the end. Cato F-04 (next/image fill detection) became Phase 6's audit-script hardening. Cato F-01/F-02 hypothesis was empirically falsified by Phase 2's CDP probe — but the falsification IS valuable: it moves the cycle from "speculate at flex-children min-width" to "verify with computed-style evidence". Cato earned its keep.

The skill now codifies this as HARD gate #25: **at most 2 consecutive Cato deferrals at E5; the 3rd cycle MUST run Cato or escalate at the doctrine layer**.

### Lesson 3 — Production-readiness scorecard separates design from external blockers

Cycles 1-11 were drifting toward conflating cycle-close ("Cycle N done") with launch-readiness ("ready for .com cutover"). The conflation is dangerous because external blockers (GHL wiring, principal decisions on credentials, legal review of TCPA/REALTOR® mark, DNS cutover) cannot be resolved at the design layer — but they will keep coming up in cycle reviews if the cycle's PASS criterion treats them as in-scope.

Cycle 12 introduced a 24-axis production-readiness scorecard with explicit 6-status taxonomy. The scorecard's verdict is **not** "production-ready" full-stop — it is "production-ready as a design surface; pending external gates for .com cutover". The 9 non-PASS axes are not design defects; they are owner-shaped tasks with named owners.

The skill now codifies this as HARD gate #26: **when cycle invokes "launch readiness" / "production readiness" / "cutover" language, the cycle MUST produce a per-axis scorecard with the 6-status taxonomy**. The scorecard is the closure deliverable, distinct from cycle-level "done."

### Lesson 4 — Vision-model strict-pixel verdict can be a false positive on multi-line wrapped uppercase letterspaced text

Cinzel-uppercase + tracking-[0.16em] + 2-line wrap visually approximates a single-line clip pattern in low-resolution thumbnail review. GPT-5.5 saw "EQUAL HOUSING / OPPORTUNITY" wrapped to 2 lines and read it as a single-line clip. Without DOM-level evidence, this misreading drove Cycle 11's 3-iteration loop.

The skill now codifies this as gotcha #33: **always verify vision-model "clip" claim with `Range.getClientRects()` (returns per-line fragment rects) before iterating CSS**. The CDP probe's `Range.getClientRects()` output is the ground truth.

### Lesson 5 — Forge background dispatch with disjoint scope is the right pattern for audit-script hardening

Cycle 12 ran Forge in background to implement median-of-N hardening on `scripts/audit-hero-pixel-contrast.ts` (164 insertions, 21 deletions, type-checked, smoke-tested). Main thread ran DevTools investigation, audit-script hardening on `scripts/audit-completeness.ts`, and doc writing in parallel. Strict scope discipline (Forge: script-only; main thread: docs + components untouched) per `feedback_forge_race_scope_drift.md`. Wall-clock save: ~10 min vs sequential. This pattern is the right shape for E3+ coding work that's strictly disjoint from main-thread changes.

The skill records this as a v0.3.4 process improvement (codified in changelog).

## 3. What did NOT need codification

- The Phase 4 hard-stop pattern is already a natural consequence of HARD gate #24 (CDP probe before CSS iteration). No separate gate needed.
- The DevTools probe scripts at `/tmp/cdp-probe-mia.ts` + `/tmp/cdp-fullpage-mia.ts` work session-scoped; codifying them as permanent substrate is a Cycle 13 candidate (skill limitation noted).
- The retry-on-anomaly hero-contrast strategy from Cato F-03 is strictly stronger than median-of-N but not in this cycle's mission scope. v0.3.5 will ship it.

## 4. Skill version bump rationale

v0.3.3 → v0.3.4 is a **minor version bump** (3 new HARD gates + 3 new gotchas + 1 new workflow + 1 new per-cycle artifact). It is NOT a major bump because:
- The 5 sub-skills (FactLedger, FormalSpec, AssetIntegrityAudit, RegressionGuard, SkillImprovementLoop) are unchanged.
- The cycle structure (OBSERVE → THINK → PLAN → STATE PROBE → BUILD → EXECUTE → VERIFY → LEARN) is unchanged.
- The compliance-asset polarity inspection (gate #22 from v0.3.3) and F6 honest-skip enforcement (gate #23 from v0.3.3) are preserved verbatim.
- New gates extend rather than replace existing gates.

A major bump would be warranted if the skill structure itself changed (e.g., a new sub-skill was introduced or a sub-skill was retired).

## 5. Phase 13 ISC reconciliation

| ISC | Description | Status | Evidence |
|---|---|---|---|
| ISC-592 | docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md updated with durable Cycle 12 lessons | ✅ | frontmatter version 0.3.3 → 0.3.4; new_in_v034 enumerates additions |
| ISC-593 | docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md v0.3.4 entry written | ✅ | v0.3.4 entry prepended at top |
| ISC-594 | docs/CYCLE_12_PROCESS_UPGRADE_REPORT.md exists | ✅ | this document |

All Phase 13 ISCs pass.
