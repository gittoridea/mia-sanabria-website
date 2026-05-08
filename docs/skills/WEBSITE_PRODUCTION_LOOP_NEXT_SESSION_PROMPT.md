# Website Production Loop — Cycle 5 Next-Session Prompt

> Paste-ready prompt for cycle 5 of `~/code/mia-sanabria-website/`. Replaces the cycle-3 prompt at v0.1.0; updated cycle-4 alongside skill v0.2.0.

---

```
/effort max

MISSION: Mia Sanabria Website — Cycle 5 (Statutory Compliance + AEO Funnel Sprint + Skill v0.3.0 Stress-Test)

Continue ~/code/mia-sanabria-website/ ISA. Do NOT start a new ISA.

Primary objective:
Resolve the open principal-decisions surfaced in cycle-3/4, ship the highest-leverage Tier-1/Tier-2 items from the upgrade plan, run a non-realtor-vertical stress test of WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 (test the parameterization), and decide whether to promote the skill to ~/.claude/skills/WebsiteProductionLoop/.

Read first to anchor:
1. ISA.md (cycle-3 + cycle-4 sections — Decisions / Changelog / Verification)
2. docs/PRODUCTION_READINESS_HANDOFF_SPARK_ONLY_CYCLE_4_2026-05-08.md (cycle-4 closeout)
3. docs/PRINCIPAL_DECISION_REGISTER.md (6 cards — RESOLVE in cycle-5 OBSERVE phase before any other work)
4. docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0
5. docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md (v0.1.0 → v0.2.0 evolution)
6. docs/skills/SKILL_CREATOR_PROCESSING_NOTES.md (cycle-4 CreateSkill integration notes)
7. docs/CODEX_SPARK_SYNTHESIS_REPORT.md (cycle-3) + cycle-4 closeout
8. docs/MIA_SITE_HIGH_IMPACT_UPGRADE_PLAN.md (Tier 1+2 are this cycle's surface)
9. docs/BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md (cycle-4 — see ⚠️ + 🔒 cells)
10. docs/codex-spark-audits/cycle-4/ (6 Spark audits — read team-E + team-F especially)
11. reports/audit-completeness.md, reports/audit-images.md, reports/audit-brand-consistency.md (current baseline)

Cycle 5 deliverables (ranked by leverage × principal-gate-status):

PHASE 0 — Principal-decision register triage (FIRST, BEFORE ALL OTHER WORK):
D1. Walk through PRINCIPAL_DECISION_REGISTER.md cards 1-6 with the principal. Resolve at least Cards 1 (license rendering) + 4 (REALTOR® usage) + 5 (combined logo) before code work. Status field on each card moves to DECIDED.

PHASE 1 — Statutory-binary compliance (gated on D1):
D2. Brokerage-adjacency component refactor (Team E cycle-3+4 statutory-binary blocker). Add LPT Realty disclosure adjacent to every contact point (phone tel, email mailto, form helper) in SiteHeader.tsx + SiteFooter.tsx + form pages.
D3. License rendering: implement Card 1 decision (likely Reading B = null until Mia confirms in writing).
D4. REALTOR® mark cleanup per Card 4: replace descriptive phrasing with member-name-adjacent usage; capitalize keywords metadata.
D5. Combined REALTOR®+MLS footer graphic per Card 5: source pure NAR REALTOR® mark; remove MLS attribution until Mia confirms MLS affiliation in writing.

PHASE 2 — GHL form wiring (only if URL has arrived):
D6. If GHL BSS sub-account webhook URL is supplied: wire contact + valuation forms via Cloudflare/Netlify Pages Function proxy per docs/GHL_INTEGRATION_OPTIMAL.md. Add affirmative-consent mechanics (checkbox + timestamp + IP audit log + number-specific authorization) to fully ship TCPA per Florida § 501.059 + 2024 FCC one-to-one consent rule. If URL not supplied: skip D6 and document gating in handoff.

PHASE 3 — AEO funnel sprint (4-team convergence finding from cycle-3):
D7. Answer-first AEO + market-anchored proof on /buyers/, /sellers/, /valuation/, /about/. Each adds a 75-125 word answer block before existing content. Internal-link to 3 relevant market pages. Use Brand-Contract-compliant typography.
D8. Discretion / advisory AEO vocabulary on /about/ + /buyers/ + /sellers/. Add 2-3 phrases per Gemini blindspot: "off-market access," "strict client confidentiality," "discreet representation," "investment-grade waterfront analysis." Centralize in MIA.voice.advisoryPhrases.
D9. Concierge-vs-Contact intake repositioning (Gemini blindspot). Change /contact/ H1 to "Private Consultation Request" or "Client Intake"; add 1 luxury-qualifying dropdown.

PHASE 4 — Steering language audit + neutralization:
D10. Grep src/lib/markets.ts for school/family/kids/children/student references. Substitute with neutral alternatives ("residents enjoy," "the neighborhood lifestyle," "households," "the community"). Update audit-stale-terms.ts with steering-language sentinels.

PHASE 5 — Skill stress-test (the IMPORTANT meta-cycle work):
D11. Pick a non-realtor candidate vertical (HVAC mock site OR existing Sunrise Paddleboards client OR a fabricated "professional services" trial) and ATTEMPT to invoke WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 against it. Document where the parameterization breaks down. The output is NOT a fully-built second site — it's a stress-test report showing which v0.2.0 fields are still realtor-leaky.
D12. Based on D11 + cycle-4 Team F's "v0.3.0 warranted: yes" verdict, write the spec for WEBSITE_PRODUCTION_LOOP_SKILL v0.3.0 (don't ship yet — write the spec).
D13. Decide: promote skill to ~/.claude/skills/WebsiteProductionLoop/? (Yes if D11 stress-test passed; defer if v0.3.0 spec is needed first.)

PHASE 6 — Verification + deploy + closeout:
D14. Audit chain green: typecheck + lint + build + audit:all (incl. images + brand) + audit-completeness FAIL gate.
D15. Run staging deploy via bun scripts/deploy-and-verify.ts. Verify Caddy flip + cache-bust curl on changed routes. Capture screenshots before/after at /tmp/mia-cycle5-*-qa-{before,after}/.
D16. Cycle-5 closeout doc + ISA append + commit + push.

Mission boundaries:
- Do NOT modify DNS, .com production routing, Cloudflare, or live GHL production surfaces without explicit principal approval.
- Do NOT fabricate facts about Mia (license, designations, MLS, Spanish, awards, sales).
- Do NOT treat Boca Raton or Delray Beach as Broward County.
- Do NOT violate the Brand System Contract (no new color, font, glassmorphism — Brand System Contract is locked).
- Do NOT skip audit-completeness, audit:images, audit:brand.
- Do NOT mark complete without evidence.
- Do NOT silently resolve any PRINCIPAL_DECISION_REGISTER card.
- Do NOT downgrade a statutory-binary compliance finding to "concerns" by averaging across audit teams.
- Do NOT claim TCPA-compliant in any synthesis or marketing copy unless full mechanics ship.
- Do NOT claim the skill is generic until D11 stress-test passes.

Algorithm: PAI v6.4.0. WEBSITE_PRODUCTION_LOOP_SKILL.md v0.2.0 governs the cycle composition.

Model lane:
- Default: multi-family lane (Spark for most teams + Cato for cross-vendor verify + Gemini for blindspot + advisor for commitment-boundary). Cycle-4 was Spark-only; cycle-5 returns to multi-family unless principal directs otherwise.
- Concurrency cap: ≤3 same-model concurrent (multi-family) per skill v0.2.0.

Verification:
- bun run typecheck && bun run lint && bun run build
- bun run audit:all (now includes audit:images + audit:brand)
- Cato cross-vendor schema-enforced verdict (E5-mandatory at VERIFY)
- Gemini blindspot review
- Advisor commitment-boundary call
- Re-read check at closeout

Final response should include:
1. Cycle-5 result
2. Each D1-D16 deliverable status (shipped / deferred with reason / blocked-by-X)
3. PRINCIPAL_DECISION_REGISTER status changes (which cards moved DECIDED)
4. Cato + Gemini + advisor verdicts
5. audit:all + audit:images + audit:brand chain results
6. Updated matrices
7. Skill v0.3.0 spec (if written) + promotion decision
8. Remaining blockers for public launch
9. Next-cycle prompt

Success criteria:
- At least D1 + D2 + D3 (the statutory-binary remediation) shipped this cycle
- D7-D10 shipped (the AEO funnel sprint)
- D11 stress-test attempted with documented result (pass/partial/fail)
- D14 audit chain green; D15 deploy + live verify
- The next session is materially smarter than this one
- The site moves visibly closer to "world-class luxury realtor production-grade" by Team C's agency-ship-score axis (cycle-4 was 4/10; cycle-5 target is 6+/10)
```

---

## Notes for the cycle-5 operator

- **Cycle-4 caught a real Brand Contract violation.** `backdrop-blur` glassmorphism was shipping in `SiteHeader.tsx` since cycle-1; cycle-3 audit teams missed it; the cycle-4 `audit:brand` sentinel caught it. The new sentinels are load-bearing — keep them green.
- **The Spark-only lane works at ≤2 concurrent.** Cycle-4 ran 6 Spark teams in 3 batches of 2 with no stdin-stage stalls. The rate-limit cap rule in skill v0.2.0 §1a is empirical, not aspirational.
- **The deploy preflight gate had TWO bugs that took two cycles to find.** Cycle-3 caught the field-name (`summary→counts`); cycle-4 caught the casing (`pass→PASS`). Both fixes shipped. Watch for similar producer-consumer-shape mismatches in any new audit script — type-share between producer and consumer is the structural fix.
- **The principal-decision register is load-bearing.** Cycle-3 left license-rendering and TCPA mechanics ambiguous; cycle-4 surfaced 6 cards. Cycle-5 starts by walking the cards with the principal. Do NOT silently advance past an OPEN card.
- **The skill v0.2.0 cleared its own gate during cycle-4.** v0.2.0 was written via CreateSkill UpdateSkill; cycle-4 Team F (Loop Improvement Architect) audited the v0.2.0 spec and found it "partial" on closing cycle-3 gaps. Cycle-5 D11 stress-test on a non-realtor vertical is the next quality gate; v0.3.0 spec is the write-up that closes the partial.
- **Audit chain coverage now spans 28 PASS** (14 audit:all + 7 audit:images + 7 audit:brand) across 25 routes + sentinel scripts. Cycle-5 should ADD coverage (e.g. Lighthouse-mobile threshold gate per Team F cycle-3 + Team F cycle-4) rather than deepening into single dimensions.
