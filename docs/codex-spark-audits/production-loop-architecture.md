# Team G — Production Loop Architecture

## Verdict (one sentence)
**Concerns:** the Mia build already contains the bones of a reusable website production loop, but the loop still relies on principal vigilance where route coverage, deploy gates, model-verdict completeness, form readiness, and vertical adaptation should be structurally enforced.

## How this site got built (current state of loop, descriptive — phases, artifacts, decision gates)
The site was built as a PAI-run project ISA loop: articulate ideal state in `ISA.md`, decompose into ISCs, state-probe current artifacts, build against those ISCs, deploy to staging, verify with scripts/live probes/Cato/screenshots, then append Decisions/Changelog/Verification.

The production pattern compounded across cycles: initial Next.js static-export build → image/rendering fixes → brand/compliance closeout → 22-pillar production audit → `audit-completeness.ts` structural-drift detector → Forge worktree design pass → markets-V3 authority sprint → Codex/Spark expert audit cycle.

Primary artifacts today: `ISA.md`, `docs/MIA_IDEAL_PRODUCTION_STATE.md`, `docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md`, `docs/MARKET_PAGE_COMPLETION_SCORECARD.md`, `docs/BRAND_SYSTEM_CONTRACT.md`, `docs/COMPLIANCE_GATE_2026_05_08.md`, BSS realtor templates, `scripts/audit-completeness.ts`, and `scripts/deploy-and-verify.ts`.

Current gates: fact-ledger/null-guard discipline, brand contract, 10-axis compliance gate, 22-pillar scorecard, market-page scorecard, audit chain, deploy preflight, Cato/Gemini review, and handoff docs.

## Role map — what each tool/agent/skill does today and should do tomorrow
- **Claude Code (orchestrator + verifier):** owns ISA continuity, artifact load order, delegation, synthesis, implementation integration, deploy verification, and final handoff. Tomorrow: also enforce the production-loop checklist before any agent lane starts.
- **Codex Spark / 5.4 / 5.5 (specialist audit + implementation teams):** Spark is best for bounded read-only expert audits; 5.4 is strong fallback and Cato-family diversity; 5.5 is default broad reasoning/architecture. Tomorrow: use them in named lanes with mandatory evidence appendix and last-line JSON verdict.
- **Gemini (blindspot):** separate-family luxury/psychology/semiotics review. Tomorrow: run after synthesis, not before, so it tests what the normal audit stack missed.
- **Cato (cross-vendor verification):** VERIFY-phase challenge pass. Tomorrow: foreground or schema-enforced verdict only; incomplete verdict is a process failure, not “concerns.”
- **Forge (Claude-family) — when used vs Spark:** use Forge for write-capable whole-project implementation/design passes, preferably foreground or isolated worktree. Use Spark for parallel read-only audit lanes or tightly scoped specialist analysis. Do not race Forge against main-thread edits.
- **PAI Algorithm v6.4.0 (frame):** OBSERVE/THINK/PLAN/STATE-PROBE/BUILD/EXECUTE/VERIFY/LEARN stays the parent loop. Website Production Loop is a skill inside it, not a replacement.
- **Audit scripts (drift detection):** `audit:all` is the executable spec; `audit-completeness` catches source-to-output drift; `deploy-and-verify` is the intended deployment path.
- **Each design / pattern doc:** Brand Contract locks visual drift; Compliance Gate locks regulated risk; Ideal State defines target; Gap Matrix maps page/axis gaps; Market Scorecard gives per-page compounding; Handoff preserves operational state.

## Reusable skill behavior (what's worth lifting into WEBSITE_PRODUCTION_LOOP)
1. Artifact load order and authority order.
2. Vertical intake profile: client, industry, compliance jurisdiction, conversion model.
3. Fact-ledger gating and unverified-field rendering rules.
4. Baseline route/build/audit/live-state probe.
5. Expert lane dispatch briefs and evidence appendix format.
6. Synthesis rubric: immediate / gated / approval / external / defer.
7. Implementation race rules: foreground or worktree for writers.
8. Brand-contract drift check.
9. Compliance gate selection by vertical.
10. Scorecard refresh after every pass.
11. Deploy preflight and live freshness verification.
12. LEARN step: convert repeated miss into script/doc/skill update.

## Missing decision gates
1. `audit-completeness.ts` hardcodes 7 market pages while the site now has 13.
2. `deploy-and-verify.ts` reads `summary`, but report JSON writes `counts`; FAIL gating can be bypassed.
3. Lighthouse results print but do not enforce thresholds.
4. Mobile screenshot acceptance is documented but not a deploy-blocking gate.
5. Form readiness is WARN-only despite being a conversion-critical launch gate.
6. License verification state is ambiguous: populated under `unverified.*` while docs still describe DBPR/client confirmation as a gate.
7. Cato incomplete-verdict handling still depends on operator recognition.
8. Expected expert audit file completeness is not structurally enforced; Team E compliance-risk output is absent in `docs/codex-spark-audits/`.
9. Caddy freshness check warns when `last-modified` does not flip but does not poll to timeout before verification.
10. Schema validation checks parseability more than route-specific semantic contracts.
11. Vertical compliance profiles are not yet formalized.
12. Social proof/testimonial approval is known-gated but not yet part of the client review gate as a hard launch decision.

## Compounding loop design
Each pass should start from the current ISA and scorecards, not from a blank audit. STATE-PROBE marks what already passes; expert lanes only inspect remaining or risky surfaces; synthesis converts findings into a ranked delta; implementation handles only safe/high-confidence changes; verification updates the scorecards; LEARN turns any repeated manual catch into a script, checklist, or skill rule.

## Template-quality artifacts (BSS realtor template starting set)
Ship these as the BSS realtor starting kit: Next.js static-export skeleton, `site.ts`/client fact file/`markets.ts` data model, schema components, Hero/MarketCard/FAQ/CTAStrip/SiteFooter components, Brand System Contract, BSS Fact Ledger Schema, Realtor Compliance Gate, GHL Packet, Client Review Pack, Launch/Cutover Checklist, Deployment Template, `audit:*` scripts, `audit-completeness`, `deploy-and-verify`, scorecard docs, gap matrix docs, and ISA changelog discipline.

## Vertical-adaptation rules
Keep the loop primitives; swap the vertical profile. For HVAC/plumbing, markets become service areas + service categories, compliance becomes licensing/insurance/warranty/permit/EPA rules, conversion becomes quote/booking/emergency calls, schema becomes `LocalBusiness`/`Service`/`FAQPage`. For professional services, markets become practice areas or industries, compliance becomes ethics/disclaimer/confidentiality, proof becomes case studies/testimonials with consent, and conversion becomes consultation/intake.

## Composition with PAI Algorithm v6.4.0
`WEBSITE_PRODUCTION_LOOP` composes as a domain skill inside PAI:
OBSERVE loads ISA/docs/fact ledger/vertical profile; THINK identifies risks and gate classes; PLAN maps deliverables to expert lanes; STATE-PROBE runs existing audits and scorecards; BUILD creates or updates artifacts; EXECUTE edits/deploys; VERIFY runs audits, live probes, Cato, Gemini; LEARN updates ISA, scorecards, templates, and skill rules.

## Proposed loop diagram (text-rendered phases)
Intake → Authority Load → Fact Ledger Gate → Ideal-State Diff → Current-State Probe → Expert Lanes → Synthesis & Gate Classification → Safe Implementation → Audit/Build Preflight → Deploy/Freshness Probe → Live/Mobile/Cross-Vendor Verification → Scorecard Refresh → Handoff → LEARN/Skill Update.

## Proposed minimum spec for WEBSITE_PRODUCTION_LOOP_SKILL.md
Required fields: `name`, `trigger`, `vertical_profile`, `authority_order`, `required_inputs`, `artifact_load_order`, `expert_lanes`, `decision_gates`, `verification_commands`, `scorecards_to_refresh`, `handoff_outputs`, `anti_criteria`, `evidence_appendix`.

Required workflows:
1. Mission intake and deliverable manifest.
2. Baseline/current-state probe.
3. Fact and compliance gate binding.
4. Expert lane dispatch.
5. Synthesis and prioritized upgrade plan.
6. Safe implementation rules.
7. Verification and deploy gate.
8. LEARN: update ISA/docs/scripts/skill.

Reference docs: `ISA.md`, PAI v6.4.0, `CODEX_SPARK_CAPABILITY_PROBE.md`, `BRAND_SYSTEM_CONTRACT.md`, `COMPLIANCE_GATE_2026_05_08.md`, `MIA_IDEAL_PRODUCTION_STATE.md`, `WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md`, `MARKET_PAGE_COMPLETION_SCORECARD.md`, `BSS_REALTOR_*`, `audit-completeness.ts`, `deploy-and-verify.ts`.

## Anti-criteria check
No PAI features/hooks invented. PAI is not replaced. Existing patterns are preserved. Boca Raton, Delray Beach, and Palm Beach remain Palm Beach County, not Broward County. No recommendation abandons ISA, gap matrix, scorecards, audit chain, brand contract, or compliance gate.

## Evidence appendix
- Model used: gpt-5.5
- Reasoning: xhigh / Sandbox: read-only
- Files read included the requested ISA, PAI doctrine, capability probe, brand/compliance/ideal/scorecard/gap/handoff docs, BSS template docs, audit scripts, Codex audit outputs, Gemini blindspot check, package scripts, and current audit reports.

{"verdict":"concerns","completeness":"full","reusable_components_count":12,"missing_gates_count":12,"vertical_adaptation_score_1_to_10":8}
