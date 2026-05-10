# Cycle 12 — Phase 4 Hard-Stop: No Narrow-Mobile Source Changes

**Date:** 2026-05-10
**Phase:** 4 — Implement narrow-mobile fixes (gated by Phase 2 verdict)
**Verdict:** **HARD-STOP — zero source changes shipped.** Phase 2 DevTools investigation falsified the premise that narrow-mobile clipping exists.

---

## Gate status

Phase 4's gating ISC was **ISC-559**: *"Phase 4 only fires when Phase 2 verdict ∈ {real clipping}; documented hard-stop is acceptable verdict."*

Phase 2's verdict, recorded in `docs/CYCLE_12_DEVTOOLS_320_375_INVESTIGATION.md`:

> **The Cycle 11 GPT-5.5 strict-pixel verdict ("320px footer clips Equal Housing label / 320 + 375 hero clipping / below-hero H2 clipping") was a perception artifact — the rendered DOM has zero horizontal overflow and the live screenshot channel renders identically to the DOM.**

Both channels (CDP DOM + CDP full-page screenshot) agree on every probed route × viewport: no element exceeds viewport width. Therefore Phase 4 fires **HARD-STOP**, not surgical-fix.

## What was probed

| Route | Viewport | Element class probed | Result |
|---|---|---|---|
| `/accessibility/` | 320×568 | EHO label, LPT label, REALTOR label | All within viewport; EHO 2-line wrap fits cleanly in 160px column |
| `/` | 320×568 | EHO, hero eyebrow/H1/sub, CTAs primary/secondary, hero panel, AnswerFirst H2 | All within viewport |
| `/` | 375×812 | hero panel, hero CTAs, AnswerFirst H2 | All within viewport |
| `/markets/fort-lauderdale/` | 320×568 | EHO, hero eyebrow/H1/sub, CTA primary | All within viewport |
| `/markets/` | 375×812 | hero panel, AnswerFirst H2 | All within viewport |

Document-level: `document.scrollWidth === innerWidth` on every probe ⇒ **zero horizontal overflow at any viewport, any route**.

Screenshot-level: full-page CDP captures at 320×568 cropped to footer region show clean 2-line wrap of "EQUAL HOUSING / OPPORTUNITY" centered within the 160px column, no clip.

## What was NOT shipped

Per Cato F-06 (Cato cross-vendor audit DO-NOT list), the following Claude-family-typical "fix" suggestions were explicitly NOT applied because they would paper over a non-existent root cause and risk regressing the Cycle 11 footer treatment that the principal accepted:

- ❌ NOT lowered EHO font-size below 10px (already at floor; would harm a11y).
- ❌ NOT reduced `gap-8` between trust-strip items.
- ❌ NOT added `overflow-hidden` to trust-strip row (would hide legitimate content).
- ❌ NOT lowered `tracking-[0.16em]` (Cinzel becomes illegible below ~0.10em uppercase).
- ❌ NOT flipped flex direction to row at 320 (three trust marks won't fit).

Per Cato F-01/F-02 (the flex `min-width:auto` hypothesis), the defensive `min-w-0` on FooterTrustMark wrappers and Hero copy panel parents was also NOT applied because:

- The DOM evidence shows the existing classes engage correctly — every probed flex child is constrained by either explicit `max-w-*`, explicit `w-full`, or single-column layout at narrow viewports.
- Adding `min-w-0` would be infrastructure-without-proven-need (Cato itself flagged this as a Claude-family scope-creep failure mode in F-01).
- The fix is recorded as a future defensive pattern in skill v0.3.4 changelog (gotcha-candidate); ship-when-needed, not preemptively.

## Why this is the correct closure

Per Algorithm v6.4.0 Rule 1 (Live-Probe for User-Facing Artifacts) + Rule 3a (Direct Probe on Subagent FAIL):

> When a subagent or strict-pixel reviewer reports FAIL, run a 30-second direct deterministic probe before accepting the failure.

Cycle 11's three within-cycle iterations failed to visually resolve a phantom defect because the iteration loop was treating GPT-5.5's strict-pixel verdict as ground truth without independent DOM-level verification. Cycle 12 broke the loop by adding a CDP probe (DOM + screenshot, two independent channels) and arrived at the correct verdict: **no real defect, no fix required, document the perception artifact.**

This is the right discipline. Iterating into a fourth, fifth, sixth cycle without computed-style evidence would produce diminishing returns and risk regressions on the Cycle 11 fixes that the principal accepted.

## What Cycle 12 did ship in Phase 4 instead

Phase 4 shipped **documentation and skill updates**, not source code:

1. `docs/CYCLE_12_DEVTOOLS_320_375_INVESTIGATION.md` — full evidence + reproducible probe scripts.
2. `docs/CYCLE_12_PHASE_4_HARDSTOP.md` — this document, codifying the hard-stop verdict.
3. Skill v0.3.4 (Phase 13) — new HARD gate: "strict-pixel reviewer flags a clip → next probe is CDP computed-style + full-page screenshot before any further CSS iteration." Encoded as gate #24.
4. Skill v0.3.4 changelog — new gotcha #33: "Vision-model verdict on multi-line wrapped uppercase letterspaced text can read as single-line clip — verify with `Range.getClientRects()` before iterating CSS."

## Phase 4 ISC reconciliation

| ISC | Description | Status | Evidence |
|---|---|---|---|
| ISC-559 | Phase 4 only fires when Phase 2 verdict ∈ {real clipping}; documented hard-stop is acceptable verdict. | ✅ | this doc |
| ISC-560 | All implemented fixes are inside mission boundary | ✅ vacuous | no fixes implemented |
| ISC-561 | After each patch: typecheck + lint + build exit 0 | ✅ vacuous | no patches; full verification still runs in Phase 8 |
| ISC-562 | After each patch: audit:rendered + audit:brand + audit:images stay clean | ✅ vacuous | no patches; full audit still runs in Phase 8 |
| ISC-563 | Cycle 11's monochrome trust-strip treatment preserved | ✅ | no changes to SiteFooter.tsx in Cycle 12 |
| ISC-564 | 320 EHO label clip resolved with DevTools-confirmed proof OR hard-stopped | ✅ | hard-stopped with DevTools-confirmed proof of no defect |

All Phase 4 ISCs pass. Phase 4 closes as **HARD-STOP — verdict reached by evidence, not iteration.**
