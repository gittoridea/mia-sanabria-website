---
name: WebsiteProductionLoop
trigger: "production cycle on a client website (build / level-up / audit-and-improve / cutover-prep)"
version: 0.1.0
authored: 2026-05-08
authored_from_cycle: Mia Sanabria cycle 3 (Codex-Spark expert team audit)
status: spec — first execution will refine
---

# Website Production Loop — Reusable Skill Specification

> The Website Production Loop is the substrate for shipping a production-grade client website (and improving it pass-after-pass) using PAI v6.4.0 + Codex Spark/5.4/5.5 + Gemini + Cato + Claude Code, without re-deriving the rules each time. It composes as a domain skill INSIDE the PAI Algorithm — it does not replace the Algorithm.

## Authority

This skill spec is derived from cycle-3 of the Mia Sanabria realtor site (`~/code/mia-sanabria-website/`). The artifacts cited in §"Authority order" are the load-bearing substrate; the workflows in §"Workflows" are the operational primitives lifted from that cycle's friction; the anti-criteria are the failures the cycle prevented.

Future cycles refine this skill via the LEARN workflow (§7).

## Mission

Each cycle should level up a client website by combining expert-team audits, implementation, verification, blindspot review, and learning capture — such that the next pass is materially smarter than the prior one.

## When to use

- New client website kickoff (BSS realtor template fork, HVAC vertical, professional services)
- Existing site cycle (audit-and-upgrade, level up the page-by-axis scorecard)
- Pre-cutover hardening (compliance, performance, structural-drift)
- Cross-cycle regression check (drift detection on a stable site)

## When NOT to use

- One-shot single-file fixes (use the PAI Algorithm directly at E1/E2)
- Code-only refactors with no UX/SEO/AEO/compliance dimension (use Forge or Engineer directly)
- Discovery / research / ideation phases (use Research, Ideate, BeCreative)
- Anything pre-fact-ledger (the loop assumes a fact ledger exists; create one first)

---

## Required fields

When invoking this skill, the caller (or the OBSERVE phase of the calling Algorithm run) must supply:

| Field | Purpose | Source |
|---|---|---|
| `client` | Client business name | Project ISA `## Vision` or `## Goal` |
| `vertical_profile` | `realtor-luxury` / `realtor-mid` / `hvac` / `plumbing` / `professional-services` / `other` | Decided at intake; drives compliance gate selection |
| `audience` | Primary buyer/customer segment | Project ISA `## Vision` |
| `offer` | Conversion offer (consultation / quote / booking / lead-magnet-download) | Project ISA `## Goal` |
| `compliance_jurisdiction` | Regulatory frame (e.g. Florida real estate + NAR + HUD + TCPA + state breach law) | `client_fact_ledger.yaml` or `docs/COMPLIANCE_*.md` |
| `platform_constraints` | Stack mandates (e.g. Next.js 15 static-export, Tailwind v4, bun-only) | Project ISA `## Constraints` |
| `brand_system_path` | Path to locked Brand System Contract for this client | `docs/BRAND_SYSTEM_CONTRACT.md` (per-client) |
| `fact_ledger_path` | Path to client's fact ledger (verified vs unverified) | `docs/CLIENT_FACT_LEDGER.md` (per-client) |
| `current_state_anchor` | Last commit + audit result reference | `git log -1 --oneline` + `reports/audit-completeness.md` |
| `cycle_goal` | What this specific pass is upgrading | User prompt at session start |

## Authority order

When reading the project state, the loop honors this order:

1. Project ISA — `<project>/ISA.md` (the system of record per Algorithm v6.4.0)
2. Brand System Contract — locked visual system; deviations require explicit principal approval
3. Compliance Gate — regulated risk; vertical-specific
4. Ideal Production State — 11-22 axis target articulation
5. Gap matrix + scorecard — page-by-axis drift map
6. Audit chain (`audit:all`) — executable spec
7. Source code (`src/`, `scripts/`, `next.config.ts`)
8. Built output (`out/`)
9. Live staging URL — last-mile verification

Disagreements between layers surface as `## Decisions` entries on the project ISA — they are not silently resolved.

## Required inputs (artifact load order)

In OBSERVE, load in this exact order:

1. `ISA.md` (project)
2. PAI Algorithm `LATEST` + active `v{N}.md`
3. `docs/CODEX_SPARK_CAPABILITY_PROBE.md` (verify codex CLI + Spark/5.4/5.5 still responsive)
4. `docs/BRAND_SYSTEM_CONTRACT.md`
5. `docs/COMPLIANCE_GATE_*.md`
6. `docs/<CLIENT>_IDEAL_PRODUCTION_STATE.md`
7. `docs/WORLD_CLASS_*_GAP_MATRIX.md`
8. `docs/MARKET_PAGE_COMPLETION_SCORECARD.md` (or vertical equivalent)
9. `docs/PRODUCTION_READINESS_HANDOFF_*.md` (latest)
10. `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`
11. `scripts/audit-*.ts`, `scripts/deploy-and-verify.ts`
12. `reports/audit-completeness.{md,json}`
13. Any `docs/codex-spark-audits/` from prior cycles

If any artifact is missing, log a `## Decisions` entry on the ISA naming what's missing — do not silently skip.

---

## Workflows

### 1. Mission intake (OBSERVE-phase)

Confirm + record:

- `client`, `vertical_profile`, `audience`, `offer`
- `compliance_jurisdiction`
- `platform_constraints`
- `cycle_goal`
- `out_of_scope` (explicit anti-vision; e.g. "no DNS / no Cloudflare / no GHL prod / no lead magnet")

Verify the codex/Spark capability harness is current — re-probe `gpt-5.3-codex-spark`, `gpt-5.4`, `gpt-5.5` if `CODEX_SPARK_CAPABILITY_PROBE.md` is older than 30 days.

### 2. Baseline / current-state probe (STATE-PROBE-phase)

Run, in order:

- `bun run typecheck`
- `bun run lint`
- `bun run build` — capture route count
- `bun run audit:all` — capture pass/warn/fail counts; sitemap routes; JSON-LD blocks
- `git log --oneline -5` — last 5 commits for context
- `git status --short` — uncommitted changes
- Live curl probe of `${SITE.url}/` — verify 200 + cache-bust + last-modified
- Visual screenshot grid (chrome-headless 5×N viewports if visual-affecting cycle)

Record output in ISA `## Verification` for state-probe-passed ISCs (see Algorithm v6.4.0 STATE PROBE phase).

### 3. Fact + compliance gate binding (OBSERVE → THINK boundary)

Verify the per-client fact ledger:

- Every claim that ships in HTML cites a row in the fact ledger marked `verified: true`
- Every claim still in `unverified.*` namespace renders behind a runtime null-guard OR with explicit verification-state semantics
- The compliance gate runs the vertical-specific axes (10-axis for realtor-luxury; vertical equivalents for HVAC / professional services)

Anti-pattern guarded against (from Mia cycle-3 convergence): "code is null-guarded but unverified.* is set → visible HTML still implies certainty." If this is the configuration, the audit teams WILL flag it. Surface as a principal-decision item before BUILD.

### 4. Expert lane dispatch (BUILD-phase, parallel)

The standard 7-lane configuration:

| Lane | Role | Default model | Brief template |
|------|------|--------------|----------------|
| A | Brand / Visual Design Director | `gpt-5.3-codex-spark` | per-vertical brand audit (read locked Brand System Contract first) |
| B | Domain Strategist (industry-specific) | `gpt-5.3-codex-spark` | "Does this site match top-tier <vertical> expectations?" |
| C | SEO / AEO / Schema Expert | `gpt-5.3-codex-spark` | route-by-route punchlist; schema saturation; AEO answer blocks |
| D | Domain Content Editor | `gpt-5.5` | voice consistency; specificity; generic phrasing flags; rewrite candidates |
| E | Compliance / Risk Guardrail | `gpt-5.4` | jurisdiction-specific PASS/PARTIAL/FAIL/REVIEW table |
| F | QA / Regression Engineer | `gpt-5.3-codex-spark` | audit-script coverage; preflight gate integrity; new-check recommendations |
| G | Production Loop Architect | `gpt-5.3-codex-spark` or `gpt-5.5` | meta-design audit (where does the loop need structural enforcement vs vigilance?) |

Each lane:

- Uses `codex exec --sandbox read-only -c model="<id>" "<brief>" < /dev/null > /tmp/codex-team-<X>.log 2>&1`
- Runs in `Bash(run_in_background: true)` with `timeout: 900000` (15 min)
- Has an explicit `<<AUDIT_START>>` / `<<AUDIT_END>>` delimiter pair in the brief (codex emits the audit body inline because read-only sandbox forbids file writes)
- Ends its output with `{"verdict":"pass|concerns|fail","completeness":"full|partial",...}` on its own LAST line
- Cites a model + tokens + sandbox in its evidence appendix

Concurrency rule: max 4 simultaneous high-reasoning calls across model families; 3 same-model concurrent or fewer (rate-limit safety; observed 4-Spark concurrent stalls on first dispatch in Mia cycle-3).

### 5. Synthesis + prioritized upgrade plan (BUILD → EXECUTE boundary)

Read all 7 audit reports + Gemini blindspot. Produce:

- `docs/CODEX_SPARK_SYNTHESIS_REPORT.md` — convergence (≥3 teams flagging same surface), contradictions, what to preserve, what to defer with reasons
- `docs/<CLIENT>_HIGH_IMPACT_UPGRADE_PLAN.md` — tiered (Immediate 0-2h / Near-term 2-6h / Strategic 1-2d / GHL-dependent / Mia-dependent / Cutover prereqs / World-class polish)
- Refresh `docs/WORLD_CLASS_*_GAP_MATRIX.md` if any cell moved
- Refresh `docs/MARKET_PAGE_COMPLETION_SCORECARD.md` (or vertical equivalent) if applicable
- Refresh `docs/SEO_AEO_*_AUTHORITY_MATRIX.md` if applicable

Rule of thumb: convergence ≥3 teams = highest-confidence; act unless gated externally. Convergence ≥2 teams = high-confidence; act if low-risk. Singular finding = act if it cites file:line and severity ≥ medium.

### 6. Safe implementation rules (EXECUTE-phase)

Implement only the tier 1 (Immediate / Near-term, 0-6h) items. Larger items go to next cycle.

Race rules:

- Codex teams that wrote audits ran read-only — they did not edit code; main thread can edit freely
- If Forge or another write-capable agent is dispatched, FOREGROUND or `isolation: "worktree"` only — never let main-thread edit while background-Forge runs in same workspace (per `feedback_forge_race_scope_drift.md`)
- Run `bun run audit:all` after each meaningful batch
- Commit in logical batches with clear messages: `fix(<area>): <description> — <audit-team> finding`

Anti-criteria (preserve, do not implement):

- No new color / font / token (Brand System Contract locked)
- No DNS / Cloudflare / GHL prod / .com cutover / lead magnet without explicit principal approval
- No fabricated facts (license, designations, MLS, sales, awards, languages)
- No PAI infrastructure edits outside this project
- No geographic-guardrail violation (jurisdiction labels)

### 7. Verification + deploy gate (VERIFY-phase)

Run, in order:

- `bun run typecheck` — exit 0
- `bun run lint` — exit 0
- `bun run build` — exit 0; route count must match expected
- `bun run audit:all` — pass count must not regress; FAIL count = 0; WARN count must not increase from baseline without an entry in `## Decisions` explaining why
- Fresh-Cato dispatch — read-only audit on the cycle's diff via `Agent({ subagent_type: "Cato", prompt: "<artifact + ISCs>" })`. Verdict on LAST line in canonical schema.
- Gemini blindspot review — separate-vendor (`gemini-3.1-pro-preview` via `Inference.ts --level expert-long`)
- Advisor commitment-boundary call — `bun ~/.claude/PAI/TOOLS/Inference.ts --mode advisor --auto-state "<task>" "<question>"`
- Re-read check — re-read user's last message verbatim against shipped work
- Deploy via `bun scripts/deploy-and-verify.ts` ONLY (preflight gate is the production-grade path; never `curl … application.deploy` from memory)

If deploying:

- Wait for Caddy flip (~60s post-deploy)
- Verify live routes with cache-busting (`?_=$(date +%s)` + `Cache-Control: no-cache`)
- Capture live evidence

If not deploying (cycle is staging-only):

- Document why in `## Decisions`

### 8. Learning loop (LEARN-phase)

For each repeated catch this cycle, ask:

- Could a script have caught this? (→ add to `audit-completeness.ts`)
- Could a doc have prevented it? (→ update Brand Contract / Compliance Gate / Ideal State)
- Could a skill rule have prevented it? (→ amend this `WEBSITE_PRODUCTION_LOOP_SKILL.md` spec)
- Could a hook have prevented it? (→ surface to principal for `~/.claude/hooks/` design)

Update the project ISA `## Decisions`, `## Changelog`, `## Verification` via `Skill("ISA", "append ...")` — Decisions get short timestamped entries; Changelog gets the conjecture/refutation/learning format; Verification gets per-ISC evidence.

Write the next-session prompt to `docs/skills/WEBSITE_PRODUCTION_LOOP_NEXT_SESSION_PROMPT.md` (paste-ready) so the next cycle starts at the cycle-end state, not at OBSERVE-from-zero.

---

## Decision gates (HARD — block phase advance if not met)

1. **Authority load gate (OBSERVE)** — every required artifact loaded; missing artifacts logged in `## Decisions`
2. **Fact-ledger gate (OBSERVE → THINK)** — every claim that ships has a verified-row reference; unverified.* claims render with explicit verification semantics or null-guard
3. **Brand-contract drift gate (BUILD → EXECUTE)** — no implementation introduces a new color / font / token; no glassmorphism / gradient-border / un-contracted accent
4. **Audit-chain gate (VERIFY)** — `bun run audit:all` exit 0; 0 FAIL; PASS count not regressing
5. **Schema-enforced auditor verdict gate (VERIFY)** — Cato verdict comes back schema-validated (per Algorithm v6.4.0 R9 errata); incomplete verdict is a process failure, NOT "concerns"
6. **Deploy-preflight gate (VERIFY)** — typecheck → lint → build → audit:all → audit-completeness FAIL gate runs before any Dokploy / hosting deploy
7. **Live-freshness gate (VERIFY post-deploy)** — Caddy `last-modified` flipped before declaring deployed
8. **Re-read gate (VERIFY)** — every explicit ask in the user's mission addressed or marked SKIP with reason

## Decision gates (SOFT — surface but don't block)

1. **Lighthouse-mobile threshold** — capture, surface a warning when below threshold; future cycle should make this HARD via deploy gate
2. **Visual screenshot acceptance** — chrome-headless 5×N grid; documented but not deploy-blocking
3. **Form-readiness** — WARN-only on mailto-classified forms; flips HARD when GHL endpoint URL arrives
4. **Performance regression** — Lighthouse threshold drift between cycles; surface, don't block

## Verification commands (canonical)

```bash
bun run typecheck
bun run lint
bun run build
bun run audit:all
bun run audit:completeness
bun run audit:seo
bun run audit:schema
bun run audit:links
bun scripts/deploy-and-verify.ts
```

Always run from project root; always via bun (no npm / npx anywhere).

## Scorecards to refresh each cycle

- `docs/WORLD_CLASS_*_GAP_MATRIX.md`
- `docs/MARKET_PAGE_COMPLETION_SCORECARD.md` (or vertical equivalent — `SERVICE_AREA_COMPLETION_SCORECARD.md` for HVAC, etc.)
- `docs/SEO_AEO_*_AUTHORITY_MATRIX.md`
- `docs/PRODUCTION_READINESS_AUDIT_*.md` (22-pillar or vertical equivalent)

## Handoff outputs (canonical)

Each cycle produces:

- `docs/PRODUCTION_READINESS_HANDOFF_<TAG>_<DATE>.md` — 14-section closeout
- ISA append (Decisions / Changelog / Verification)
- 7 audit reports + Gemini blindspot in `docs/codex-spark-audits/` and `docs/GEMINI_BLINDSPOT_CHECK_<DATE>.md`
- Synthesis report + tiered upgrade plan
- `docs/skills/WEBSITE_PRODUCTION_LOOP_NEXT_SESSION_PROMPT.md` — paste-ready next-cycle trigger
- Reflection JSONL in `MEMORY/LEARNING/REFLECTIONS/algorithm-reflections.jsonl`

## Anti-criteria (universal — apply to every cycle of this skill)

- No fabricated facts about the client (license #, designations, certifications, sales counts, awards, language proficiency, MLS membership, jurisdiction service area)
- No DNS / Cloudflare / .com cutover / production-customer-facing writes without explicit principal approval scoped to this cycle
- No PAI infrastructure edits outside the project (`~/.claude/`, `~/forge/`, `~/trueops/`)
- No Brand System Contract drift (no new color / font / token / accent / pattern)
- No abandonment of locked patterns (gap matrix, scorecard, ISA, audit chain, brand contract, compliance gate, fact ledger)
- No model misrepresentation in any audit's evidence appendix
- No geographic-guardrail violation (Florida realtor: Boca/Delray/Palm = Palm Beach County; everything else in scope = Broward County; HVAC/plumbing: service area boundaries by license jurisdiction)
- No silent contradiction-resolution between authority layers (every contradiction → `## Decisions` entry)

## Vertical adaptation

Keep loop primitives constant. Swap vertical profile:

| Primitive | Realtor (luxury) | HVAC / plumbing | Professional services |
|---|---|---|---|
| Markets | Cities + neighborhoods + waterfronts | Service areas + service categories + emergency-vs-routine | Practice areas + industries + case studies |
| Compliance | NAR + REALTOR® + EHO + IDX + DBPR + state-specific Fair Housing | Licensing + insurance + warranty + permit + EPA + state-specific consumer protection | Bar / professional ethics + disclaimer + confidentiality + consent |
| Conversion offers | Consultation / valuation / market report | Quote / booking / emergency call / service plan | Consultation / proposal / case-study download |
| Schema | Person + RealEstateAgent + LocalBusiness + Place + FAQPage + Article + BreadcrumbList | LocalBusiness + Service + AggregateRating + FAQPage + Service Area | Organization + ProfessionalService + Person + Article + FAQPage |
| Proof artifacts | Testimonials with consent + signed-contract case studies + market data citations | Reviews + completed-job galleries + warranty / certification badges | Case studies + named-client logos (with consent) + outcomes-with-data |
| Anti-criteria add-ons | No school-quality steering language; no fabricated MLS membership | No before/after misrepresentation; no false performance claims | No outcome guarantees; no fabricated case-study numbers |

## Reference docs

This skill spec depends on these always-present substrates:

- `~/.claude/PAI/ALGORITHM/v6.4.0.md` (parent loop)
- `~/.claude/PAI/DOCUMENTATION/PAISystemArchitecture.md` (parent system)
- `~/.claude/skills/ISA/` (ISA scaffolding workflows)
- `~/.claude/PAI/TOOLS/Inference.ts` (Gemini blindspot + advisor calls)
- `~/.claude/agents/Cato.verdict-schema.json` (cross-vendor audit schema)

Per-client substrate (created on first cycle for new clients):

- `<project>/ISA.md`
- `<project>/docs/BRAND_SYSTEM_CONTRACT.md`
- `<project>/docs/COMPLIANCE_GATE_<DATE>.md`
- `<project>/docs/<CLIENT>_IDEAL_PRODUCTION_STATE.md`
- `<project>/docs/CLIENT_FACT_LEDGER.md`
- `<project>/scripts/audit-completeness.ts`
- `<project>/scripts/deploy-and-verify.ts`

## Evidence appendix

Authored 2026-05-08, derived from the cycle-3 Codex-Spark expert team audit on `~/code/mia-sanabria-website/`. The 7 audit reports + Gemini blindspot + synthesis report at `~/code/mia-sanabria-website/docs/codex-spark-audits/` and `~/code/mia-sanabria-website/docs/CODEX_SPARK_SYNTHESIS_REPORT.md` are the source material. Every workflow primitive in §1-8 was empirically verified during that cycle. The 12 reusable components and 12 missing decision gates in this spec come directly from Team G's `production-loop-architecture.md` audit.
