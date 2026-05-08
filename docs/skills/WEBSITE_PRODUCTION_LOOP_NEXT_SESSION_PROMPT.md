# Website Production Loop — Next Session Prompt

> Paste-ready prompt for a future session that continues levelling up `~/code/mia-sanabria-website/` (or any other website where this skill is invoked). Feed this verbatim to a fresh Claude Code session at the start of the next cycle.

---

```
/effort max

MISSION: Mia Sanabria Website — Cycle 4 (Post-Codex-Spark Implementation Sprint + GHL Integration if URL available)

Primary objective:
Continue the cycle-3 work captured in ~/code/mia-sanabria-website/ — implement the highest-leverage tier-1 items the Codex-Spark expert teams identified, run the verification + Cato + Gemini chain, and refresh the gap matrices. If the GHL BSS sub-account webhook URL has arrived since cycle-3, wire the contact + valuation forms (single biggest conversion lift on the table).

Read this first to anchor:
1. ~/code/mia-sanabria-website/ISA.md (entire mission-3 section: Decisions / Changelog / Verification for cycle-3)
2. docs/PRODUCTION_READINESS_HANDOFF_CODEX_SPARK_2026-05-08.md (cycle-3 closeout — §12 remaining blockers + §13 next 3 actions are the cycle-4 starting point)
3. docs/CODEX_SPARK_SYNTHESIS_REPORT.md (read §8.5 advisor + §11 Cato findings + §12 license-rendering principal-decision)
4. docs/MIA_SITE_HIGH_IMPACT_UPGRADE_PLAN.md (Tier 1 + Tier 2 items are this cycle's surface)
5. docs/GEMINI_BLINDSPOT_CHECK_2026-05-08.md (5 blindspots + 2026 features missing)
6. docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md (the loop skill spec — re-probe codex/Spark capability if older than 30 days)

Cycle 4 deliverable manifest (in priority order):

D1. Principal-decision resolution on license-rendering (synthesis §12). Two readings of ISA §Constraints line 54 are in tension; ask the principal which governs and act on the answer.

D2. If GHL webhook URL available: wire contact + valuation forms via Cloudflare/Netlify Pages Function proxy per docs/GHL_INTEGRATION_OPTIMAL.md. Add affirmative-consent mechanics (checkbox + timestamp + audit log) to fully ship TCPA compliance — cycle-3 only added prose. If GHL webhook URL NOT available: skip D2 and surface the gating in handoff.

D3. Brokerage-adjacency component refactor (Team E statutory blocker #4). Add LPT Realty disclosure adjacent to every contact point (phone tel, email mailto, form helper). Component-level fix in src/components/SiteHeader.tsx + src/components/SiteFooter.tsx + form pages.

D4. Answer-first AEO + market-anchored proof on the 5 non-market funnel pages (4-team convergence). For /buyers/, /sellers/, /valuation/, /about/: add a 75-125 word AEO answer block before the existing structure; include 3 internal links to relevant market pages. /contact/ skips the AEO block.

D5. Steering-language audit + neutralization on 13 market pages. Grep src/lib/markets.ts for school/family/kids/children references; substitute neutral alternatives. Update audit-stale-terms.ts with steering-language sentinels.

D6. LAST_UPDATED build-time stamp on market pages + homepage hero (Gemini static-atrophy lever).

D7. Concierge-vs-Contact intake repositioning (Gemini blindspot top concern) — change /contact/ H1 to "Private Consultation Request"; add 1 luxury-qualifying dropdown.

D8. Discretion / advisory AEO vocabulary injection on /about/ + /buyers/ + /sellers/.

D9. Spanish hreflang for SE FL Hispanic markets (Cato §11.6 non-corpus angle). Emit hreflang="es" pointing self-referentially to English routes; flip to /es/ routes once Mia confirms language status.

D10. Lighthouse-mobile threshold gate in scripts/deploy-and-verify.ts (Team F).

D11. Refresh docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md, docs/SEO_AEO_MARKET_AUTHORITY_MATRIX.md, docs/MARKET_PAGE_COMPLETION_SCORECARD.md with cycle-4 cell deltas (cycle-3 deferred refresh — synthesis §10).

D12. Run staging deploy + external validators (FB Sharing Debugger, Twitter Card Validator, Google Rich Results) on the 5 changed page types (cycle-3 deferred per advisor recommendation).

D13. Re-run Cato cross-vendor audit on cycle-4 deliverables; capture verdict.

D14. Closeout doc (docs/PRODUCTION_READINESS_HANDOFF_CYCLE_4_<date>.md) + ISA append.

Mission boundaries:
- Do not modify DNS, .com production routing, Cloudflare, or live GHL production surfaces without explicit principal approval.
- Do not fabricate facts, sales claims, awards, designations, Spanish-language status, MLS membership, DBPR verification.
- Do not treat Boca Raton or Delray Beach as Broward County — they are Palm Beach County.
- Do not violate the Brand System Contract (no new color, font, glassmorphism, etc.).
- Do not skip audit-completeness or any audit chain step.
- Do not mark complete without evidence.
- Honor ISA §Constraints line 54 once the principal interpretation lands.

Algorithm: PAI v6.4.0 (or LATEST). The Website Production Loop skill spec at docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md governs how the cycle composes with the Algorithm.

Verification:
- bun run typecheck && bun run lint && bun run build
- bun run audit:all (must end 14+ PASS / 0 FAIL; WARN preserved or reduced)
- Cato cross-vendor audit (E5-mandatory at VERIFY)
- Advisor commitment-boundary call before closeout
- Re-read check at closeout

Anti-criteria:
- No PAI infrastructure edits outside this project
- No Brand System Contract drift
- No fabricated facts
- No statutory-binary compliance items left as "concerns" — they are launch-blocking by definition
- No silent contradiction-resolution between authority layers (every contradiction → ## Decisions entry)

Final response should include:
1. Cycle-4 result
2. Which deliverables shipped vs deferred (with reasons)
3. Cato verdict
4. Advisor verdict
5. Verification results
6. Updated scorecards
7. Remaining blockers
8. Next-cycle prompt (auto-update this file)

Success criteria:
- D1 (license-rendering principal-decision) resolved
- At least D3 + D4 + D5 + D6 + D11 shipped this cycle
- D2 + D9 if dependencies clear
- Audit chain green
- The next session is materially smarter than this one.
```

---

## Notes for the cycle-4 operator

- Cycle 3 surfaced a pattern of "Anthropic-family completeness-claim bias" (Cato §11) — when the audit chain says PASS, both Claude Code and the OpenAI Codex teams tend to characterize "concerns" as "next-cycle work" without distinguishing statutory-binary from policy-judgment. Cycle 4 should explicitly maintain that distinction at every gate.
- The advisor (Claude-family) is excellent at commitment-boundary review but shares Anthropic-family blind spots. Cato (cross-vendor) is the formal counterweight; treat its verdict as authoritative on completeness-claim semantics.
- Spark concurrency cap (max 3 same-model concurrent) is documented in the capability probe; honor it in cycle-4's parallel dispatch.
- The 7 audit reports + Gemini blindspot are read-once substrate — cycle 4 should NOT re-run all 7 teams. Re-run is appropriate when (a) ≥6 weeks have passed, (b) major Brand System Contract or vertical-profile change, (c) audit-chain regression happens. For "did cycle-4 fix what cycle-3 caught?" — that's a Cato-only re-audit on the diff.
