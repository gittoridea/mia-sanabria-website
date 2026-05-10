# Next Session Trigger — After Cycle 12 (Production-Readiness Closure)

**Cycle 12 close state:** PASS · production-ready as design surface · 9 external blockers honestly enumerated · SESSION_MAY_CLOSE: yes.

The next session has TWO realistic shapes depending on principal availability and decision-readiness. Pick one.

---

## Option A — Principal-decision-gathering session (RECOMMENDED — highest leverage)

If the principal has bandwidth for ~60-90 minutes of decisions, this is the highest-leverage next move. It unblocks 4 of the 9 external gates without any operator engineering time.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Principal Decision Pass on Cycle 12 Production-Readiness Scorecard External Blockers

Start in:

~/code/mia-sanabria-website/

Primary objective:
Walk principal through the 9 external blockers from Cycle 12's production-readiness scorecard and capture decisions on the 4 that are principal-decision-only (not GHL or legal-counsel). The 4 axes are:

1. License rendering (PRINCIPAL_DECISION_REGISTER Card 1) — confirm DBPR-verified license # in writing OR authorize "stay current" with unverified flag.
2. Analytics provider — pick GA4 vs Plausible vs Umami; provide measurement ID. ~15 min to ship.
3. Branded email — pick provider (Google Workspace / Zoho / Fastmail); provide MX record + initial inbox provisioning.
4. .com cutover sign-off — DNS swap from current Direct Axess host to staging URL; 301 redirect plan.

After capturing decisions, ship the 1-2 quick wins:
- Update src/lib/mia.ts licenseNumber per principal decision.
- Insert analytics tag into src/app/layout.tsx per principal choice.
- Document branded-email + DNS cutover as scheduled engineering work for Cycle 13/14.

Mission boundaries (DO NOT):
- Touch GHL wiring or TCPA mechanics (separate cycle, blocked by legal-counsel).
- Implement DNS cutover without explicit principal sign-off + scheduled date.
- Modify REALTOR® mark usage (Cards 4+5; legal review pending).
- Change colors/fonts/tokens; respect Cycle 11/12 visual contract.

READ FIRST:
1. ISA.md (cumulative project ISA at progress 602/602; Cycle 12 closed)
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_12_PRODUCTION_READINESS_CLOSURE_2026-05-10.md
3. docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md (24 axes; sections 14-18 enumerate external blockers)
4. docs/PRINCIPAL_DECISION_REGISTER.md (Cards 1, 2, 3, 4, 5, 6 — Card 1 OPEN; Cards 2/4/5 RECOMMENDATION_PENDING)
5. src/lib/mia.ts (licenseNumber + email config)
6. src/app/layout.tsx (analytics tag insertion point)

PHASES:
PHASE 0 — Recovery + integrity check
PHASE 1 — Walk principal through 4 decision axes (license, analytics, branded email, .com cutover)
PHASE 2 — For decisions made: ship the 1-2 quick wins (analytics tag + license render flip)
PHASE 3 — Document principal decisions in PRINCIPAL_DECISION_REGISTER + close relevant cards
PHASE 4 — Update production-readiness scorecard with new states (PASS / scheduled / etc.)
PHASE 5 — Verification + GPT-5.5 LIVE acceptance + Cato follow-up
PHASE 6 — Skill v0.3.5 (analytics tag insertion gate)
PHASE 7 — Handoff + NEXT_SESSION_TRIGGER_AFTER_PRINCIPAL_DECISIONS.md

Success criteria:
1. 4 principal-decision axes addressed in PRINCIPAL_DECISION_REGISTER.
2. Quick-win shippable changes deployed (analytics tag + license render).
3. Updated scorecard reflects new state.
4. GPT-5.5 LIVE acceptance PASS.
5. Skill captures any new gate (e.g. analytics-tag-required gate).

Estimate: 90-120 min (mostly principal walk-through; engineering time minimal).
```

---

## Option B — GHL form wiring engineering cycle (if principal already authorized GHL workflow + TCPA approach)

If the principal has already authorized the GHL workflow webhook URL + TCPA mechanics scope (per Card 2 acknowledgment), this is the engineering cycle to wire the forms.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — GHL Form Wiring + TCPA Mechanics

Start in:

~/code/mia-sanabria-website/

Primary objective:
Wire the contact + valuation forms to the principal-authorized GHL workflow webhook + ship TCPA-compliant consent mechanics. Replace the mailto: fallback with a real lead-capture path. This requires principal-confirmed prerequisites:
- GHL workflow webhook URL (from PRINCIPAL_DECISION_REGISTER Card 2 acknowledgment)
- Sub-account form schema mapping (field-name reconciliation)
- TCPA consent UI design approved by legal counsel (or accepted-as-staging-MVP per principal)

Mission boundaries (DO NOT):
- Touch the design system (colors, fonts, tokens, glassmorphism).
- Modify TCPA copy without legal-counsel approval.
- Wire GHL without confirmed webhook URL (no guessing).
- Skip the audit:completeness forms.classification check post-wire.

READ FIRST:
1. ISA.md
2. docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md (axes 13, 14, 15)
3. docs/PRINCIPAL_DECISION_REGISTER.md Card 2
4. src/app/contact/page.tsx + src/app/valuation/page.tsx
5. scripts/audit-completeness.ts checkFormsClassification

PHASES:
PHASE 0 — Recovery + verify principal authorization on file
PHASE 1 — TCPA consent UI design + implementation (checkbox + timestamp + IP capture stub)
PHASE 2 — GHL workflow webhook integration (form action POST + field mapping + error handling)
PHASE 3 — audit:completeness re-run — forms.classification should flip from mailto to live-ghl
PHASE 4 — Cato + GPT-5.5 predeploy
PHASE 5 — Deploy + live verification + form-submission smoke test
PHASE 6 — GPT-5.5 LIVE acceptance + Cato follow-up
PHASE 7 — Skill v0.3.5 (GHL form-wiring gate + TCPA mechanics gate)
PHASE 8 — Handoff

Estimate: 3-4h.
```

---

## Cycle 12 closing context

- **Live ETag:** `diezhj5m794w2qf6`
- **Last-Modified:** `Sun, 10 May 2026 12:09:14 GMT`
- **HEAD commit:** `3b0b6a7` (pushed to origin/main)
- **ISA cumulative ISCs:** 602 (cycle 12 added 62 ISCs at ISC-541..ISC-602; progress 540 → 602/602 at close)
- **audit:completeness** 15 PASS · 1 WARN · 0 FAIL (was 14/2 — improvement: 27 next/image fill false positives eliminated)
- **audit:hero-contrast** hardened with median-of-N (Forge 164/21 diff)
- **GPT-5.5 PREDEPLOY verdict:** PASS · 8/8 questions yes
- **GPT-5.5 LIVE verdict:** PASS · 5/5 questions yes · SESSION_MAY_CLOSE: yes · PRODUCTION_READY_AS_DESIGN_SURFACE: yes
- **Cato verdict:** concerns (0 critical) · 5/7 findings closed, 2/7 partial
- **Skill v0.3.4** — 26 HARD gates total (23 → 26), 3 SOFT, 35 gotchas total (32 → 35); CDP-probe-before-CSS-iteration enforcement is the marquee addition

## What the operator should know going in

1. **Cycle 12 SHIPPED no source-of-rendered-HTML changes.** The Cycle 11 GPT-5.5 strict-FAIL was empirically falsified by Cycle 12's CDP DOM probe + full-page screenshot. Phase 4 closed as HARD-STOP with documented evidence. This is the right discipline — iterating into Cycle 13/14 on a phantom defect would have been wasted budget.
2. **Cycle 12 SHIPPED audit-script hardening that improves signal-to-noise across all future cycles.** Median-of-N eliminates probe-flake on `audit:hero-contrast`. `data-nimg="fill"` detection eliminates false-positive WARNs on `audit:completeness`. Both are zero-rendered-output-impact substrate changes — lasting value.
3. **The production-readiness scorecard is the closure deliverable.** Future cycles should distinguish "cycle done" from "launch ready" with explicit external-blocker enumeration. The 24-axis scorecard format is reusable.
4. **Cato deferral redemption doctrine activated.** Cycle 12 ran Cato early after 3 consecutive deferrals. Future cycles should not normalize the deferral pattern — at most 2 consecutive E5 deferrals; the 3rd MUST run Cato.
5. **The CDP probe scripts at `/tmp/cdp-probe-mia.ts` + `/tmp/cdp-fullpage-mia.ts` are session-scoped.** Cycle 13 should migrate them to `~/.claude/PAI/TOOLS/CDPProbe.ts` or `scripts/cdp-probe.ts` for permanent reuse across the BSS realtor template family.

---

**End of next-session trigger. Pick Option A or Option B based on principal availability.**
