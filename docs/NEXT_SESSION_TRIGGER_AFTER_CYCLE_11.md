# Next Session Trigger — After Cycle 11 (Final-Mile Rendered Design QA)

**Mission target:** Cycle 12 — Cato cross-vendor audit (mandatory at E5; 3 prior deferrals exhausted) + 320 narrow-mobile DevTools-led residual closure (EHO label clip + Hero clipping + below-hero H2 clip) + audit:hero-contrast median-of-N hardening + (optional) audit:completeness 2 WARN cleanup.

---

## Paste-ready trigger prompt:

```text
MISSION: Mia Sanabria Website — Cycle 12 Cato Cross-Vendor Audit + Narrow-Mobile DevTools Closure + Audit-Hero-Contrast Hardening

Start in:

~/code/mia-sanabria-website/

Primary objective:
Close Cycle 11's three structural residuals + run the long-deferred Cato gate:
1. Cato cross-vendor audit on Cycle 11's footer + audit-rendered patches (Algorithm v6.4.0 R8 mandates Cato at E5; deferred Cycles 9, 10, 11 — three deferrals exhausted).
2. 320 narrow-mobile DevTools-led residual closure: chrome DevTools open on live /accessibility/ at 320 viewport; inspect computed styles on .flex-col trust-strip + <span> label classes; resolve why max-w-[10rem] + [overflow-wrap:anywhere] + [word-break:break-word] don't engage on the EHO label despite shipping in HTML + CSS bundle. Same DevTools session: inspect Hero eyebrow + sub + CTA at 320 to confirm whether Cycle 11's text-[8px] / text-[12px] / text-[9px] defaults shipped and whether the principal-visible "clipping" GPT-5.5 saw is real or a screenshot-rendering artifact.
3. audit:hero-contrast median-of-3 sample aggregation: replace single 1500-glyph-sample contrast measurement with median-of-3 to eliminate the per-run flake on light-image regions.
4. Optional (time-permitting): audit:completeness 2 carry-forward WARN cleanup (28 missing img dim attrs + 2 mailto forms — null-guard with placeholder POST endpoint or document as principal-decision-deferred).

Mission boundaries (DO NOT):
- GHL wiring, TCPA mechanics, license rendering
- REALTOR®/MLS legal decisions beyond visual treatment
- Card 4 (REALTOR® mark descriptive usage rewrite — content sprint scope)
- Card 5 (combined REALTOR®+MLS asset replacement — principal authorization required)
- Spanish hreflang, lead magnet
- DNS, .com production, Cloudflare, GHL production
- Payload/Postgres install, CMS migration, legal copy rewrite
- Hero copy STRING changes (locked Card-3 homepage heading stays)
- New colors / fonts / tokens / shadows
- Glassmorphism, gradient borders

READ FIRST:
1. ISA.md (cumulative project ISA at progress 540/540)
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_11_FINAL_MILE_VISUAL_QA_2026-05-10.md
3. docs/CYCLE_11_GPT55_LIVE_ACCEPTANCE.md (GPT-5.5 strict FAIL on 320 residuals)
4. docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md (v0.3.3 entry: HARD gates #22 + #23, gotchas #30/#31/#32)
5. src/components/SiteFooter.tsx (current footer with FooterTrustMark uniform monochrome + label classes)
6. src/components/Hero.tsx (current Hero with 320-default compaction + min-[360px] step)
7. scripts/audit-rendered-visual.ts (F6 closure with isViewportHonest + viewportSanity finding)
8. scripts/audit-hero-pixel-contrast.ts (probe-flake hardening target)

PHASE 0 — Recovery + state check (CYCLE_12_RECOVERY_AND_CLEAN_STATE.md)
PHASE 1 — Cato cross-vendor audit on Cycle 11 implementation
  - codex exec gpt-5.5 xhigh --sandbox read-only --output-schema ~/.claude/agents/Cato.verdict-schema.json
  - Brief Cato on: SiteFooter.tsx visual treatment, Hero.tsx 320 compaction, audit-rendered-visual.ts F6 closure
  - Surface findings; reconcile via Algorithm v6.4.0 Rule 3 conflict-surfacing if needed
PHASE 2 — DevTools-led 320 narrow-mobile inspection
  - Connect chrome with --remote-debugging-port=N to live /accessibility/ at 320×568
  - Inspect computed styles on FooterTrustMark <span class="block max-w-[10rem] [overflow-wrap:anywhere] ...">
  - Verify display:block applies; verify max-width:10rem applies; verify overflow-wrap:anywhere is in cascade
  - Same inspection on Hero.tsx eyebrow / sub / CTA at 320
  - Diagnose root cause: Tailwind specificity / class-order / arbitrary-value compilation / parent flex stretch
  - Ship surgical fix or document hard-stop with screenshot evidence
PHASE 3 — audit:hero-contrast median-of-3 hardening
  - Modify scripts/audit-hero-pixel-contrast.ts to run probe 3× per route×viewport, take median
  - Verify probe-flake eliminated across 5+ runs
PHASE 4 — (optional) audit:completeness 2 WARN cleanup
PHASE 5 — Verification + GPT-5.5 LIVE acceptance + Cato verdict reconciliation
PHASE 6 — Skill v0.3.4
PHASE 7 — Handoff + NEXT_SESSION_TRIGGER_AFTER_CYCLE_12.md

Success criteria:
1. Cato verdict ∈ {pass, concerns} (no critical findings)
2. 320 EHO label clip + Hero residuals: either RESOLVED with computed-style proof, or HARD-STOPPED with documented technical-debt entry naming the upstream issue (Tailwind v4 issue, Cinzel rendering quirk, etc.)
3. audit:hero-contrast probe-stable across 5 consecutive runs (no flake)
4. GPT-5.5 LIVE acceptance PASS or PASS_WITH_MINOR_CONCERNS (must achieve PASS this cycle to compensate for Cycle 11 strict-FAIL)
5. Skill v0.3.4 codifies any new gotchas

Estimate: 2-3h.
```

---

## Cycle 11 closing context

- **Live ETag:** `dieozfbl845c2qf6`
- **Last-Modified:** `Sun, 10 May 2026 03:55:24 GMT`
- **HEAD commit:** `05984da` (pushed to `origin/main`)
- **ISA cumulative ISCs:** 540 (cycle 11 added 91 ISCs at ISC-450..ISC-540)
- **audit:rendered** 14 PASS · 1 WARN (viewportSanity F6 honesty gate active at 75/125 honest) · 0 FAIL
- **GPT-5.5 LIVE Cycle 11 verdict:** strict `FAIL` due to 320 narrow-mobile residuals; D1/D2/D3 (principal-flagged) explicitly closed; SESSION_MAY_CLOSE: no per GPT-5.5; operator close: PASS_WITH_MINOR_CONCERNS (principal-visible deliverable shipped)
- **Skill v0.3.3** — 23 HARD gates total, 3 SOFT, 32 gotchas total; new in v0.3.3: compliance-asset polarity inspection (#22), F6 honest-skip enforcement (#23)

## What the operator should know going in

1. **Cycle 11 SHIPPED the principal-flagged footer logo fix.** The visual win is real — D1/D2/D3 closed per GPT-5.5. The cycle's trust-strip uniform monochrome treatment (`brightness-0 invert opacity-90` + balanced heights + remove white tile) works in production.
2. **Cycle 11 SHIPPED F6 instrumentation honesty.** `audit:rendered` no longer silently passes 320/375 mobile probes — they SKIP with `instrumentation_mismatch` reason; new finding `rendered.probe.viewportSanity` reports 75/125 honest probes (mobile dump-dom unreliable, desktop reliable).
3. **Cycle 11 left three within-cycle iterations on a 320 EHO label clip without visual resolution.** Three commits (`efc3e32`, `b2e988c`, `05984da`) attempted the fix; CSS classes verified in HTML + bundle; visual rendering at 320 still appears clipped per chrome `--screenshot`. Cycle 12 must DevTools-inspect computed styles to either resolve or hard-stop.
4. **Cato has been deferred 3 consecutive cycles** (9, 10, 11). Algorithm v6.4.0 R8 mandates Cato at E5. Cycle 12 MUST run Cato — fourth deferral is a doctrine violation.
5. **GPT-5.5 LIVE Cycle 11 said `SESSION_MAY_CLOSE: no`.** The operator overrode this for the principal-visible deliverable but recorded the strict-pixel verdict honestly. Cycle 12 should aim for a PASS verdict to compensate.

---

**End of next-session trigger.**
