# Next Session Trigger — After Cycle 10 (Rendered Visual QA + Hero Layout Closure)

**Mission target:** Cycle 11 — close F6 instrumentation finding (DevTools-protocol mobile probe path), run belated Cato cross-vendor audit on Cycle 10 implementation, address verdict-matrix panel-embedded layout-mode flag, and clean up the 2 pre-existing audit:completeness WARN.

---

## Paste-ready trigger prompt (copy this verbatim into the next session):

```text
MISSION: Mia Sanabria Website — Cycle 11 Rendered Audit Honesty + Cato Cross-Vendor Audit + Layout-Mode Flag + Completeness Cleanup

Start in:

~/code/mia-sanabria-website/

Primary objective:
Close Cycle 10's three remaining substrate gaps:
1. F6 (instrumentation): scripts/audit-rendered-visual.ts mobile probe is structurally invalid — Chrome --dump-dom clamps viewport at ~500px regardless of --window-size. Add a DevTools-protocol-driven path so 320 / 375 measurements are real.
2. Belated Cato cross-vendor audit on the Cycle 10 implementation (Algorithm v6.4.0 R8/R9, schema-enforced verdict).
3. scripts/audit-screenshot-verdict-matrix.ts — add `--layout-mode=panel-embedded` flag so panel-embedded CTAs don't false-positive on the brass-pill above-fold heuristic (Cycle 9 §17 #3, deferred from Cycle 10).
4. audit:completeness 2 carry-forward WARN (28 missing img dim attributes — CLS risk; 2 mailto forms on /contact/ + /valuation/) — a clean cycle.

Mission boundaries (DO NOT):
- GHL wiring, TCPA mechanics, license rendering, REALTOR®/MLS logo, Spanish hreflang, lead magnet
- DNS, .com production, Cloudflare, GHL production
- Payload/Postgres install, CMS migration, legal copy rewrite
- Hero copy STRING changes (the locked Card-3 homepage heading stays)
- New colors / fonts / tokens / shadows
- Broad redesign without evidence

READ FIRST:
1. ISA.md (cumulative project ISA)
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_10_RENDERED_VISUAL_QA_2026-05-09.md
3. docs/CYCLE_10_GPT55_LIVE_ACCEPTANCE.md
4. docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md (v0.3.2 entry — F6 doctrine)
5. scripts/audit-rendered-visual.ts (mobile probe path you'll extend)
6. scripts/audit-screenshot-verdict-matrix.ts (layout-mode flag)
7. scripts/audit-completeness.ts (img dim WARN cleanup target)

PHASE 0 — Recovery + state check (CYCLE_11_RECOVERY_AND_LIVE_STATE_CHECK.md)
PHASE 1 — F6 closure: DevTools-protocol mobile probe (chrome-remote-interface OR a Bun/Node DevTools client)
  - Connect to chrome via --remote-debugging-port + DevTools protocol
  - Page.setDeviceMetricsOverride width/height + isMobile=true + deviceScaleFactor=2-3
  - Run probe, ensure window.innerWidth === requested.w
  - Add HARD gate #21 enforcement: SKIP findings if probe.viewport.w !== requested.w
  - Verify with /home /contact /palm-beach @ 320×568 — audit MUST now FAIL on real mobile clipping if it exists post-Cycle-10
PHASE 2 — Cato cross-vendor audit on Cycle 10 implementation
  - codex exec --sandbox read-only --output-schema ~/.claude/agents/Cato.verdict-schema.json
  - Surface findings; reconcile via Algorithm v6.4.0 Rule 3 conflict-surfacing if needed
PHASE 3 — Verdict matrix --layout-mode=panel-embedded
PHASE 4 — audit:completeness 2 WARN cleanup (img dim attributes via render-images.ts or markup updates; mailto forms — defer or null-guard with placeholder POST endpoints)
PHASE 5 — Local + live verification
PHASE 6 — GPT-5.5 live acceptance
PHASE 7 — Skill v0.3.3
PHASE 8 — Handoff + NEXT_SESSION_TRIGGER_AFTER_CYCLE_11.md

Success criteria:
1. F6 closed — audit:rendered mobile probes measure at the requested viewport (320 / 375 / 768) with viewport.w === requested.w
2. Cato verdict ∈ {pass, concerns} (no critical findings)
3. Verdict matrix --layout-mode=panel-embedded flag implemented and tested
4. audit:completeness post-cleanup: 16 PASS · 0 WARN · 0 FAIL (or honest WARN with explained Decision if mailto can't be fixed without GHL)
5. GPT-5.5 live acceptance PASS or PASS_WITH_MINOR_CONCERNS
6. Skill v0.3.3 codifies F6 closure + any new gotchas

Estimate: 3-5h.
```

---

## Cycle 10 closing context

- **Live ETag:** `dielten0x4ow2ozi`
- **Last-Modified:** `Sun, 10 May 2026 01:26:29 GMT`
- **HEAD commit:** `9da20c5` (pushed to `origin/main`)
- **ISA cumulative ISCs:** 449 (cycle 10 added 55 ISCs at ISC-395..ISC-449)
- **audit:all chain:** clean (audit:rendered local 14/0/0/0; audit:images 14/0; audit:brand 12/0; audit:hero-contrast 95/0; audit:completeness 14/2 carry-forward; stale/schema/links/seo all clean)
- **Skill v0.3.2** — 21 HARD gates total, 3 SOFT, 5 new gotchas (#25-#29), 3-layer image model added

## What the operator should know going in

1. **Cycle 10's primary deliverable shipped working:** the rendered audit script catches real layout defects (closed 7→0 desktop CTA below-fold offenders this cycle).
2. **Cycle 10's primary deliverable has a known limitation:** the mobile probe doesn't actually measure 320/375 (Chrome clamps to ~500px). This is the F6 finding — closure is queued for Cycle 11 via DevTools-protocol probe.
3. **Cato was tombstoned in Cycle 9 + Cycle 10** for time-budget reasons in favor of GPT-5.5 explicit authority. Algorithm v6.4.0 R8 says Cato is MANDATORY at E5 unless tombstoned with Decision. Two tombstones is the limit; Cycle 11 must run Cato.
4. **The Hero.tsx mobile tightening** addresses the visible defects per layout reasoning + screenshot-based judgment, BUT the rendered audit didn't catch them (F6); real iPhone-class testing is the only true confirmation. If post-Cycle-10 user-visible defects persist on real devices, Cycle 11 surfaces them via the DevTools-protocol probe.

---

**End of next-session trigger.**
