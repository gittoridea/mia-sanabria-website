---
name: WebsiteProductionLoop
description: Production-grade client-website production cycle skill — combines a fresh baseline + Codex Spark / multi-family expert lanes + missing-image and brand-consistency sentinels + live-staging verification gate + compliance severity taxonomy + principal-decision register + skill-improvement loop. Composes as a domain skill INSIDE the PAI Algorithm v6.4.0 (does not replace the Algorithm). USE WHEN production cycle on a client website, build a new client site, level up an existing client site, audit-and-improve, pre-cutover hardening, regression check, or "make this site world-class". NOT FOR one-shot single-file fixes (use PAI Algorithm directly), code-only refactors with no UX/SEO/AEO/compliance dimension (use Forge or Engineer directly), discovery / research / ideation phases (use Research, Ideate, BeCreative), or anything pre-fact-ledger.
version: 0.2.0
status: in-use — refined each cycle by the SkillImprovementLoop workflow
authored: 2026-05-08
authored_from_cycles: Mia Sanabria cycles 3 + 4 (Codex-Spark expert audits)
last_updated: 2026-05-08
last_updated_cycle: 4 (Spark-only production-quality correction)
upstream_skill: ~/.claude/skills/CreateSkill (UpdateSkill workflow)
companion_docs:
  changelog: WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md
  next_session_prompt: WEBSITE_PRODUCTION_LOOP_NEXT_SESSION_PROMPT.md
  creator_processing_notes: SKILL_CREATOR_PROCESSING_NOTES.md
  brand_visual_qa_matrix: BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md
---

# Website Production Loop — Reusable Skill Specification (v0.2.0)

> The substrate for shipping a production-grade client website and levelling it up pass-after-pass. Composes inside PAI Algorithm v6.4.0 — it does not replace the Algorithm. v0.2.0 codifies cycle-4 lessons (Spark-only lane, rate-limit cap, missing-image + brand sentinels, live-staging gate, compliance severity taxonomy, principal-decision register, parameterized artifact paths, world-class production-company QA checklist, skill-improvement loop).

## Workflow Routing

| Trigger | Workflow |
|---|---|
| "run a production cycle on `<project>`" | `Workflows/RunProductionCycle.md` |
| "Spark-only audit on `<project>`" | `Workflows/SparkOnlyAudit.md` |
| "missing-image audit / catch broken images" | `Workflows/ImageIntegrityAudit.md` |
| "brand drift audit / nav/hero/footer check" | `Workflows/BrandConsistencyAudit.md` |
| "live-staging verify after deploy" | `Workflows/LiveStagingVerify.md` |
| "improve this skill from a cycle" | `Workflows/SkillImprovementLoop.md` |

(Workflows live alongside this spec; until extracted, the inline §Workflows section below is authoritative.)

## Authority

This skill is derived from two consecutive cycles of the Mia Sanabria realtor site:

- **Cycle 3 (2026-05-08 AM):** 7 expert teams + Gemini + Cato + advisor. Produced the v0.1.0 spec.
- **Cycle 4 (2026-05-08 PM):** Spark-only lane validated; missing-image + brand-consistency drift surfaced as principal-observed gaps; CreateSkill workflow processed the upgrade. Produced v0.2.0.

Future cycles refine this skill via §SkillImprovementLoop (§Workflow 8).

## Mission

Each cycle should level up a client website by combining baseline → expert audits → implementation → verification → blindspot review → learning capture — such that the next pass is materially smarter than the prior one.

## Skill Type (Anthropic taxonomy)

**Type 4 + Type 8** hybrid: Business Process (automate repetitive production-cycle workflows with execution logs and consistency tracking) + Operations Runbook (map phenomena to diagnostics — phenomenon → tool → query → report).

## When to use (USE WHEN)

- New client website kickoff (BSS realtor template fork, HVAC vertical, professional services, any vertical-adapted fork)
- Existing site cycle (audit-and-upgrade, level up the page-by-axis scorecard)
- Pre-cutover hardening (compliance, performance, structural-drift, brand integrity, image integrity)
- Cross-cycle regression check (drift detection on a stable site)
- Principal explicitly observes visible production-quality issues (missing images, brand drift, navbar/hero/footer issues)
- "Make this site world-class" / production-company-grade delivery prep

## When NOT to use

- One-shot single-file fixes (use PAI Algorithm directly at E1/E2)
- Code-only refactors with no UX/SEO/AEO/compliance dimension (Forge or Engineer directly)
- Discovery / research / ideation phases (Research, Ideate, BeCreative)
- Anything pre-fact-ledger (loop assumes fact ledger exists; create one first)
- Pure backend / infra changes that don't touch the user-facing surface

---

## Required fields (parameterized intake)

When invoking this skill, OBSERVE-phase must supply these as **explicit parameters**, not hard-coded filenames. v0.2.0 makes the parameterization visible — all per-client artifact paths are caller-supplied.

| Field | Purpose | Default | Example |
|---|---|---|---|
| `client_slug` | Project directory slug | `<required>` | `mia-sanabria-website` |
| `project_root` | Absolute project path | `<required>` | `~/code/<client_slug>` |
| `vertical_profile` | One of `realtor-luxury` / `realtor-mid` / `hvac` / `plumbing` / `professional-services` / `other` | `<required>` | `realtor-luxury` |
| `audience` | Primary buyer / customer segment | `<required>` | `Eastern Fort Lauderdale luxury HNWI buyers + sellers` |
| `offer` | Conversion offer | `<required>` | `private consultation` |
| `compliance_jurisdiction` | Vertical-specific regulatory frame | `<required>` | `Florida real estate + NAR + HUD + TCPA + Florida § 501.171/059` |
| `platform_constraints` | Stack mandates | `<required>` | `Next.js 15 static-export, Tailwind v4, bun-only, no npm/npx, TypeScript strict` |
| `brand_system_path` | Path to locked Brand System Contract | `<project_root>/docs/BRAND_SYSTEM_CONTRACT.md` | per-client |
| `compliance_gate_path` | Path to current Compliance Gate doc | `<project_root>/docs/COMPLIANCE_GATE_*.md` | per-client |
| `fact_ledger_path` | Path to client fact ledger | `<project_root>/docs/CLIENT_FACT_LEDGER.md` (or inline in `src/lib/<client>.ts`) | per-client |
| `gap_matrix_path` | Path to per-page gap matrix | `<project_root>/docs/<VERTICAL>_GAP_MATRIX.md` | per-vertical |
| `scorecard_path` | Path to per-route scorecard | `<project_root>/docs/<VERTICAL>_PAGE_COMPLETION_SCORECARD.md` | per-vertical |
| `seo_aeo_matrix_path` | Path to SEO/AEO authority matrix | `<project_root>/docs/SEO_AEO_AUTHORITY_MATRIX.md` | optional |
| `staging_url` | Live staging URL | `<required>` | `https://<client>.<staging-host>.com` |
| `production_url` | Live production URL (post-cutover) | `<optional>` | `https://<client>.com` |
| `deploy_command` | The single canonical deploy invocation | `bun scripts/deploy-and-verify.ts` | per-client (must include preflight + Caddy flip wait) |
| `cycle_goal` | What this specific pass is upgrading | `<required>` | "Spark-only production-quality correction + Loop Skill upgrade" |
| `model_lane` | One of `spark-only` / `multi-family` / `claude-only` | `multi-family` (default) | `spark-only` for cycle 4 |

**Decision rule:** if any required field is missing at OBSERVE, log the gap in ISA `## Decisions` and either ask the principal or fall back to a documented default. Do not silently proceed with placeholder values.

## Authority order

When reading the project state, honor this order. Disagreements between layers surface as `## Decisions` entries — never silently resolved.

1. **Project ISA** — `<project_root>/ISA.md` (system of record per Algorithm v6.4.0)
2. **Brand System Contract** — `${brand_system_path}`; locked visual system; deviations require explicit principal approval
3. **Compliance Gate** — `${compliance_gate_path}`; vertical-specific
4. **Fact Ledger** — `${fact_ledger_path}`; verified vs unverified facts
5. **Ideal Production State** — `<project_root>/docs/IDEAL_PRODUCTION_STATE.md` (per-client)
6. **Gap matrix + scorecards** — `${gap_matrix_path}` + `${scorecard_path}` + `${seo_aeo_matrix_path}`
7. **Audit chain** — `bun run audit:all` (executable spec)
8. **Source code** — `<project_root>/src/`, `<project_root>/scripts/`, `next.config.ts`, etc.
9. **Built output** — `<project_root>/out/`
10. **Live staging URL** — `${staging_url}` (last-mile verification — see §LiveStagingVerificationGate)

## Required inputs (artifact load order)

Load in this exact order. Stop at the first one that doesn't exist and either (a) create it via the appropriate workflow, or (b) log a `## Decisions` entry naming the gap.

1. `<project_root>/ISA.md` (project)
2. PAI Algorithm `LATEST` + active `v{N}.md`
3. `<project_root>/docs/CODEX_SPARK_CAPABILITY_PROBE.md` (re-probe if older than 30 days)
4. `${brand_system_path}`
5. `${compliance_gate_path}`
6. `<project_root>/docs/<CLIENT_OR_VERTICAL>_IDEAL_PRODUCTION_STATE.md`
7. `${gap_matrix_path}`
8. `${scorecard_path}`
9. `<project_root>/docs/PRODUCTION_READINESS_HANDOFF_*.md` (latest)
10. `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`
11. `<project_root>/scripts/audit-*.ts`, `${deploy_command}` script
12. `<project_root>/reports/audit-completeness.{md,json}`
13. Any prior-cycle `<project_root>/docs/codex-spark-audits/cycle-*/` (substrate to NOT re-derive)

---

## Workflows

### 1. Mission intake (OBSERVE-phase)

Confirm + record:

- All required fields above
- `out_of_scope` (anti-vision; e.g. "no DNS / no Cloudflare / no GHL prod / no lead magnet" — explicit)
- `model_lane` selection (see §ModelLaneSelection below)
- The codex/Spark capability harness is current — re-probe if `CODEX_SPARK_CAPABILITY_PROBE.md` is older than 30 days; record probed model availability + responsive ping for each model used this cycle

### 1a. Model lane selection (NEW v0.2.0)

| Lane | When | Models | Concurrency cap |
|---|---|---|---|
| **`spark-only`** | Principal explicitly requests; bias-coherence audit needed; cross-vendor diversity not the goal | `gpt-5.3-codex-spark` only | **≤2 same-model concurrent** (raise to 3 only for short / read-only briefs) |
| **`multi-family`** (default) | Standard cycle; cross-vendor diversity is part of the goal | Spark + `gpt-5.4` + `gpt-5.5` mixed across teams | **≤3 same-model concurrent** |
| **`claude-only`** | OpenAI billing unavailable; quick / smaller cycle | Engineer / Forge (Claude-family) only | n/a |

**Concurrency rule (CRITICAL — derived from cycle-3 + cycle-4 friction):**

- Always close stdin: `< /dev/null`
- Use `--sandbox read-only` for audits — read-only Codex agents emit audit content INLINE (cannot write files); use `AUDIT_START`/`AUDIT_END` delimiters in the brief
- Dispatch in batches respecting the cap; **wait for prior batch to advance past stdin probe** before dispatching the next
- If a dispatch stalls at the stdin probe (39B log file containing only `Reading additional input from stdin...`), kill it and re-dispatch with reduced concurrency

### 2. Baseline / current-state probe (STATE-PROBE-phase)

Run, in order:

```bash
git status --short
git log --oneline -5
bun run typecheck
bun run lint
bun run build  # capture route count
bun run audit:all  # capture pass/warn/fail; sitemap routes; JSON-LD blocks
bun run audit:images   # NEW v0.2.0 — see §ImageIntegrityAudit
bun run audit:brand    # NEW v0.2.0 — see §BrandConsistencyAudit
curl -skI ${staging_url}/  # capture last-modified + ETag
```

Capture in ISA `## Verification` for state-probe-passed ISCs.

**Visual baseline (NEW v0.2.0 — chrome-headless screenshots):**

```bash
mkdir -p /tmp/<client>-cycle<N>-brand-qa-before
ROUTES=(/ /about/ /buyers/ /sellers/ /valuation/ /contact/ /markets/ /markets/<each-key-route>/)
VIEWPORTS=("320,568:mobile-sm" "375,812:mobile-md" "768,1024:tablet" "1024,768:laptop" "1440,900:desktop")
# capture each route × each viewport with --virtual-time-budget=20000 minimum
```

### 3. Fact + compliance gate binding (OBSERVE → THINK boundary)

Verify the per-client fact ledger:

- Every claim that ships in HTML cites a row marked `verified: true`
- Every claim still in `unverified.*` namespace renders with explicit verification-state semantics OR runtime null-guard
- The compliance gate runs the vertical-specific axes

**Anti-pattern (cycle-3 cross-team convergence):** "code is null-guarded but `unverified.*` is set → visible HTML still implies certainty." If this is the configuration, the audit teams WILL flag it. **Surface as a principal-decision item before BUILD; do not silently choose a reading.**

### 4. Expert lane dispatch (BUILD-phase, parallel within concurrency cap)

The standard 6-7 lane configuration. v0.2.0 makes the lanes vertical-aware.

| Lane | Role | Default model (multi-family lane) | Spark-only lane | Brief template |
|------|------|----------------------------------|-----------------|----------------|
| A | Brand / Visual Design Director | `gpt-5.3-codex-spark` | Spark | per-vertical brand audit (read locked Brand System Contract first) |
| B | **Visual QA / Missing Image Inspector** *(NEW v0.2.0 — promoted from sub-finding to dedicated lane)* | Spark | Spark | image integrity sweep (rendered img, OG, hero, dimensions, alt, placeholders) |
| C | Domain Strategist (industry-specific) / **World-Class Production QA** | Spark | Spark | "Does this site match top-tier `<vertical>` expectations? Would a high-end agency ship this?" |
| D | SEO / AEO / Schema Expert | Spark or `gpt-5.5` | Spark | route-by-route punchlist; schema saturation; AEO answer blocks |
| E | **Compliance Severity Classifier** *(REFRAMED v0.2.0 — severity-first, not just findings)* | `gpt-5.4` (multi-family) or Spark (spark-only) | Spark | per-finding classification: statutory-binary / statutory-borderline / policy/trademark / business-risk / quality-risk / deferred |
| F | QA / Regression Engineer | Spark | Spark | audit-script coverage; preflight gate integrity; new-check recommendations |
| G | Production Loop Architect / **Skill Improvement** *(REFRAMED v0.2.0 — explicitly feeds §SkillImprovementLoop)* | Spark or `gpt-5.5` | Spark | meta-design audit + exact skill rules that would have caught observed issues earlier |

Each lane:

- Uses `codex exec --sandbox read-only -c model="<id>" "<brief>" < /dev/null > /tmp/<client>-spark-cycle<N>-team-<X>.log 2>&1`
- Runs in `Bash(run_in_background: true)` with `timeout: 900000` (15 min)
- Has explicit `AUDIT_START` / `AUDIT_END` delimiters in the brief (codex emits audit body inline because read-only sandbox forbids file writes)
- Ends with `{"team":"<X>","verdict":"pass|concerns|fail","completeness":"full|partial",...}` on its own LAST line
- Cites `model_used` + tokens + sandbox in evidence appendix
- Demands EXACTLY 10 findings (not 5, not 20) with severity / file / fix / validation / safe-now / approval-required per finding

**Honest model-self-attestation note (cycle 3 lesson):** treat the `--config model=` flag as authoritative; team self-attestation is corroborating only. A team that declines to self-attest model identity (e.g. cycle-3 Team E said "I cannot truthfully claim `gpt-5.4` from this environment") is exemplary — do NOT pressure self-attestation.

### 5. Synthesis + prioritized upgrade plan (BUILD → EXECUTE boundary)

Read all team audits + any blindspot review. Produce:

- `<project_root>/docs/CODEX_SPARK_SYNTHESIS_REPORT.md` — convergence (≥3 teams flagging same surface), contradictions, what to preserve, what to defer with reasons
- `<project_root>/docs/<CLIENT>_HIGH_IMPACT_UPGRADE_PLAN.md` — tiered (Immediate 0-2h / Near-term 2-6h / Strategic 1-2d / Gated-external / World-class polish)
- Refresh `${gap_matrix_path}` if any cell moved
- Refresh `${scorecard_path}` if applicable
- Refresh `${seo_aeo_matrix_path}` if applicable
- **NEW v0.2.0:** refresh `<project_root>/docs/BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md` (per-route nav/hero/footer/color/typography/image/mobile/CTA/compliance/polish/remaining)

Rule of thumb: convergence ≥3 teams = highest-confidence; act unless gated externally. ≥2 teams = high-confidence; act if low-risk. Singular = act if file:line + severity ≥ medium.

**NEW v0.2.0 — Compliance severity taxonomy:** every compliance finding gets one of these classes; treat each class with its action rule.

| Class | Definition | Action rule |
|---|---|---|
| **statutory-binary** | Hard regulatory requirement; absent = non-compliant by law | **Must ship before public launch.** Cannot be downgraded to "concerns." |
| **statutory-borderline** | Regulatory adjacency or interpretation; binary at jurisdiction level | Surface to principal + jurisdiction expert; do not silently defer |
| **policy/trademark** | Industry-body rule (NAR Marks, NAR IDX, MLS attribution) | Surface to principal; defer to next-cycle content sprint OK |
| **business-risk** | Could harm trust or conversion if visible | Defer with explicit dated owner |
| **quality-risk** | Polish or readability; not statutory or contractual | Defer to next-cycle polish pass |
| **deferred / non-blocking** | Documented and accepted | Mark in handoff; don't re-flag every cycle |

**Anti-pattern (cycle-3 cross-vendor finding):** flattening a `compliance: fail` verdict into "concerns" consensus by averaging it with 6 other teams' verdicts. The severity taxonomy above is the protocol-level fix. Implementers must classify before synthesizing — **never let class-1 statutory items inherit class-3+ deferral.**

### 6. Safe implementation rules (EXECUTE-phase)

Implement only Tier 1 (Immediate / Near-term, 0-6h) items. Larger items go to next cycle.

Race rules:

- Codex teams that wrote audits ran read-only — they did not edit code; main thread can edit freely
- If Forge or another write-capable agent is dispatched, FOREGROUND or `isolation: "worktree"` only — never let main-thread edit while background-Forge runs in same workspace
- Run the full audit chain after each meaningful batch
- Commit in logical batches with clear messages: `fix(<area>): <description> — <audit-team> finding`

**NEW v0.2.0 — Principal-decision register pattern:** when an issue requires a principal call (license rendering, brand-trade-off, content boundary), do NOT silently choose. Output a decision card with:

```
PRINCIPAL DECISION CARD — <topic>
Reading A: <option> — <implications>
Reading B: <option> — <implications>
Recommendation (recommended option only — not authority): <one of A/B>
Status: AWAITING PRINCIPAL APPROVAL
```

Save the register at `<project_root>/docs/PRINCIPAL_DECISION_REGISTER.md`. Do not silently advance past an open card.

Anti-criteria (preserve, do not implement without explicit cycle-scoped approval):

- No new color / font / token (Brand System Contract locked)
- No DNS / Cloudflare / GHL prod / .com cutover / lead magnet
- No fabricated facts (license, designations, MLS, sales, awards, languages)
- No PAI infrastructure edits outside this project
- No geographic-guardrail violation (jurisdiction labels)
- **NEW v0.2.0:** No claim of regulatory compliance unless mechanics ship (e.g. TCPA prose ≠ TCPA mechanics — synthesis must say "disclosure prose added" not "TCPA-compliant added")

### 7. Verification + deploy gate (VERIFY-phase)

Run, in order:

```bash
bun run typecheck   # exit 0
bun run lint        # exit 0
bun run build       # exit 0; route count must match expected
bun run audit:all   # PASS not regressing; FAIL = 0; WARN justified in ## Decisions
bun run audit:images   # NEW v0.2.0
bun run audit:brand    # NEW v0.2.0
```

**NEW v0.2.0 — Live-staging verification gate (HARD).** Build-time fidelity is NOT live-time fidelity. Per cycle-3 cross-vendor finding, the loop must explicitly distinguish:

| Layer | What it proves | When to use |
|---|---|---|
| `out/` artifact | Code change generated correct HTML | Pre-deploy sanity |
| `bun run audit:all` | Build artifacts pass structural checks | Pre-deploy gate |
| Live URL `curl` | Deploy actually flipped + correct content lives | Post-deploy gate **MANDATORY for every cycle that ships code** |

Live-staging probe pattern:

```bash
# wait Caddy cache flip, then verify
SLUG=cache-bust-$(date +%s)
for r in / /about/ /<changed-routes-this-cycle>/; do
  curl -skI -H "Cache-Control: no-cache" "${staging_url}${r}?_=${SLUG}" | grep -E "^(HTTP|last-modified|etag)"
done
```

Cross-family verification (recommended even on `spark-only` lane — for `live-staging-verify` it's optional in `spark-only` lane but explicit in `multi-family`):

- Cato schema-enforced verdict (Algorithm v6.4.0 R9)
- Gemini blindspot — different vendor family
- Advisor commitment-boundary — Claude-family second opinion

Re-read check — re-read user's last message verbatim against shipped work; any explicit ask not addressed must be marked SKIP with reason.

If deploying:

- Use ONLY `${deploy_command}` (`bun scripts/deploy-and-verify.ts`); never `curl … application.deploy` from memory
- Wait for Caddy flip (~60s post-deploy)
- Verify live routes with cache-busting
- Capture live evidence in handoff doc

If not deploying:

- Document why explicitly in `## Decisions`
- Mark all "FIXED" claims as build-time-only

### 8. Skill improvement loop (NEW v0.2.0 — formal LEARN-phase action)

For each repeated catch this cycle, ask:

- Could a script have caught this? → add to `audit-completeness.ts` or new sentinel script
- Could a doc have prevented it? → update Brand Contract / Compliance Gate / Ideal State
- Could a skill rule have prevented it? → **amend this `WEBSITE_PRODUCTION_LOOP_SKILL.md` spec** via the `UpdateSkill` workflow on `~/.claude/skills/CreateSkill`
- Could a hook have prevented it? → surface to principal for `~/.claude/hooks/` design

Update `WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md` with the version bump and the lessons that drove it. Commit the skill update alongside the cycle's other changes.

Update the project ISA `## Decisions`, `## Changelog`, `## Verification` via `Skill("ISA", "append ...")`.

Write the next-session prompt to `WEBSITE_PRODUCTION_LOOP_NEXT_SESSION_PROMPT.md` (paste-ready).

---

## Decision gates (HARD — block phase advance if not met)

1. **Authority load gate (OBSERVE)** — every required artifact loaded; missing → `## Decisions` entry
2. **Fact-ledger gate (OBSERVE → THINK)** — every claim shipped has verified-row reference; unverified renders with explicit semantics or null-guard
3. **Brand-contract drift gate (BUILD → EXECUTE)** — no implementation introduces new color / font / token / accent / glassmorphism
4. **Audit-chain gate (VERIFY)** — `bun run audit:all` exit 0; 0 FAIL; PASS not regressing
5. **Schema-enforced auditor verdict gate (VERIFY)** — Cato or equivalent verdict comes back schema-validated; incomplete verdict is a process failure (NEW v0.2.0: also applies to compliance lane in `spark-only` mode — must classify findings into severity taxonomy)
6. **Deploy-preflight gate (VERIFY)** — typecheck → lint → build → audit:all → audit-completeness FAIL gate before deploy
7. **NEW v0.2.0 — Live-staging gate (VERIFY post-deploy)** — Caddy `last-modified` flipped + cache-bust curl verifies content + image URLs verified live before declaring "deployed"
8. **NEW v0.2.0 — Image-integrity gate (VERIFY)** — `bun run audit:images` exit 0; every `<img>` and OG image resolves; placeholder filenames flagged
9. **NEW v0.2.0 — Brand-consistency gate (VERIFY)** — `bun run audit:brand` exit 0; nav/hero/footer/CTA tokens consistent with Brand System Contract
10. **NEW v0.2.0 — Compliance severity gate (VERIFY)** — every compliance finding classified per §5 taxonomy; statutory-binary findings cannot be downgraded to "concerns"; statutory-binary unresolved blocks public-launch declaration (does NOT block staging)
11. **Re-read gate (VERIFY)** — every explicit ask in user's mission addressed or marked SKIP with reason

## Decision gates (SOFT — surface but don't block)

1. **Lighthouse-mobile threshold** — capture, surface a warning when below threshold; future cycle should make this HARD via deploy gate
2. **Visual screenshot acceptance** — chrome-headless 5×N grid; documented but not deploy-blocking
3. **Form readiness** — WARN-only on mailto-classified forms; flips HARD when GHL endpoint URL arrives
4. **Performance regression** — Lighthouse threshold drift between cycles; surface, don't block

## NEW v0.2.0 — World-class production-company QA checklist

Treat the site as if a high-end production agency is preparing client delivery. Per-route, per-viewport check:

| Category | Check | Gate |
|---|---|---|
| **Nav** | Logo lockup centered/aligned per Brand Contract; primary nav links visible at all breakpoints; mobile drawer accessible | Brand-consistency |
| **Hero** | Image-mode hero overlay gradient correct; H1 text-shadow present; eyebrow + sub spacing match contract; primary/secondary CTA hierarchy intact | Brand-consistency |
| **Footer** | 3-row structure (4-col grid + trust strip + copyright); LPT/REALTOR/EHO logos with text labels; license null-guard text; IDX disclaimer; legal links; phone tel; touch-target ≥ 44×44 | Compliance + brand |
| **Colors** | Only contracted tokens used; no unauthorized accents; contrast ≥ AA on luxury-mobile | Brand-consistency |
| **Typography** | Cinzel display + Montserrat body + brass-tracking eyebrow per contract; no miss-graded pairings | Brand-consistency |
| **Spacing / rhythm** | Section py-* tokens consistent; container max-w-7xl px-4 lg:px-8; luminance ripple discipline | Brand-consistency |
| **CTA consistency** | Primary/secondary/tertiary tokens consistent across all routes; tap-target ≥ 44×44 with ≥ 8px gap | Brand-consistency |
| **Page rhythm** | Each page builds toward the conversion CTA; no orphaned sections | Per-page review |
| **Visual hierarchy** | Eye lands on the right thing first | Per-page review |
| **Image integrity** | Every img / Next Image / OG / hero resolves; alt text quality; dim/CLS protection; no AI-feeling placeholders in production | `audit:images` |
| **Mobile** | 320 / 375 / 414 / 768 layout; no horizontal scroll; touch targets; text-wrapping; safe-area-inset on iOS bottom-fixed | Per-route screenshot |
| **Compliance display** | License null-guard active; REALTOR® mark used per NAR Marks Manual; EHO sentinel; IDX disclaimer | Compliance + brand |
| **Production polish** | No template-realtor clichés; voice consistent; market specificity > generic platitudes | Per-page content |

This checklist becomes `BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md` per cycle (one row per route, one column per category).

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
bun run audit:images   # NEW v0.2.0
bun run audit:brand    # NEW v0.2.0
${deploy_command}     # default: bun scripts/deploy-and-verify.ts
```

Always run from project root; always via bun (no npm / npx anywhere).

## Scorecards to refresh each cycle

- `${gap_matrix_path}`
- `${scorecard_path}`
- `${seo_aeo_matrix_path}`
- `<project_root>/docs/PRODUCTION_READINESS_AUDIT_*.md` (22-pillar or vertical equivalent)
- **NEW v0.2.0:** `<project_root>/docs/BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md`

## Handoff outputs (canonical)

Each cycle produces:

- `<project_root>/docs/PRODUCTION_READINESS_HANDOFF_<TAG>_<DATE>.md` — 14-18 section closeout (cycle-4 expanded to 18 sections)
- ISA append (Decisions / Changelog / Verification)
- Audit reports + blindspot in `<project_root>/docs/codex-spark-audits/cycle-<N>/`
- Synthesis report + tiered upgrade plan
- `WEBSITE_PRODUCTION_LOOP_NEXT_SESSION_PROMPT.md` — paste-ready next-cycle trigger
- `BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md` (NEW v0.2.0)
- `PRINCIPAL_DECISION_REGISTER.md` (NEW v0.2.0 — open-decision tracker)
- Reflection JSONL in `~/.claude/PAI/MEMORY/LEARNING/REFLECTIONS/algorithm-reflections.jsonl`

## Universal anti-criteria (apply to every cycle)

- No fabricated facts about the client
- No DNS / Cloudflare / .com cutover / production-customer-facing writes without explicit cycle-scoped principal approval
- No PAI infrastructure edits outside the project
- No Brand System Contract drift
- No abandonment of locked patterns (gap matrix, scorecard, ISA, audit chain, brand contract, compliance gate, fact ledger)
- No model misrepresentation in any audit's evidence appendix
- No geographic-guardrail violation
- No silent contradiction-resolution between authority layers
- **NEW v0.2.0:** No claim of regulatory compliance unless the mechanics actually ship (prose ≠ mechanics)
- **NEW v0.2.0:** No statutory-binary compliance finding ever downgraded to "concerns" by averaging across teams

## Vertical adaptation (parameterized per `vertical_profile`)

Loop primitives stay constant. Vertical profile swaps the per-domain instances.

| Primitive | `realtor-luxury` | `hvac` / `plumbing` | `professional-services` |
|---|---|---|---|
| Markets | Cities + neighborhoods + waterfronts | Service areas + categories + emergency-vs-routine | Practice areas + industries + case studies |
| Compliance | NAR + REALTOR® + EHO + IDX + DBPR + state Fair Housing + TCPA | Licensing + insurance + warranty + permit + EPA + state consumer protection | Bar / professional ethics + disclaimer + confidentiality + consent |
| Conversion offers | Consultation / valuation / market report | Quote / booking / emergency call / service plan | Consultation / proposal / case-study download |
| Schema | Person + RealEstateAgent + LocalBusiness + Place + FAQPage + Article + BreadcrumbList | LocalBusiness + Service + AggregateRating + FAQPage + ServiceArea | Organization + ProfessionalService + Person + Article + FAQPage |
| Proof | Testimonials w/ consent + signed-contract case studies + market data citations | Reviews + completed-job galleries + warranty / certification badges | Case studies + named-client logos w/ consent + outcomes-with-data |
| Anti-criteria add-ons | No school-quality steering language; no fabricated MLS membership | No before/after misrepresentation; no false performance claims | No outcome guarantees; no fabricated case-study numbers |

## Reference docs (PAI substrates)

This skill depends on these always-present substrates:

- `~/.claude/PAI/ALGORITHM/v6.4.0.md` (parent loop)
- `~/.claude/PAI/DOCUMENTATION/PAISystemArchitecture.md` (parent system)
- `~/.claude/skills/ISA/` (ISA scaffolding workflows)
- `~/.claude/skills/CreateSkill/` (this skill's own UpdateSkill / ImproveSkill workflow source)
- `~/.claude/PAI/TOOLS/Inference.ts` (Gemini blindspot + advisor calls)
- `~/.claude/agents/Cato.verdict-schema.json` (cross-vendor audit schema)

Per-client substrate (created on first cycle for new clients):

- `${project_root}/ISA.md`
- `${brand_system_path}` (per-client BRAND_SYSTEM_CONTRACT.md)
- `${compliance_gate_path}` (per-vertical COMPLIANCE_GATE.md)
- `${project_root}/docs/IDEAL_PRODUCTION_STATE.md` (per-client)
- `${fact_ledger_path}` (per-client)
- `${project_root}/scripts/audit-completeness.ts` (per-client structural drift detector — extend for the vertical's specific routes)
- `${project_root}/scripts/audit-images.ts` (NEW v0.2.0 — image integrity sentinel)
- `${project_root}/scripts/audit-brand-consistency.ts` (NEW v0.2.0 — brand drift sentinel)
- `${deploy_command}` script (per-client — must include preflight + Caddy flip wait + cache-bust verify)

## Gotchas

> *Per CreateSkill methodology, this section accumulates lessons from every cycle. Highest information density in the skill.*

1. **Codex `--sandbox read-only` cannot write files.** Even with explicit "write to docs/X.md" instructions, codex emits the audit content INLINE to stdout. Mitigation: `AUDIT_START`/`AUDIT_END` delimiters in the brief + post-completion log extraction.
2. **Concurrent xhigh-reasoning Codex calls hit a rate cap.** 4 simultaneous Spark calls → first batch works, second batch (next 3-4) stalls at the codex CLI's stdin probe (visible as 39B log file containing only "Reading additional input from stdin..."). Mitigation: ≤2 same-model concurrent (Spark-only lane) or ≤3 (multi-family lane); always pipe `< /dev/null`; mix model families when allowed.
3. **Codex log echoes the brief.** If your brief contains `<<AUDIT_START>>` literally inside the prompt template (e.g. as instructions to the model), the log has duplicate occurrences. Extract the LAST/longest delimited block, not the first.
4. **Honest model-self-attestation isn't always feasible.** A team configured as `gpt-5.4` may decline to claim that identity in its evidence appendix. This is exemplary — `--config model=` flag is authoritative; team self-attestation is corroborating only.
5. **Build-time vs live-time fidelity is a different class of evidence.** `out/` artifact passing checks does NOT prove the live URL has the changes. Per `feedback_caddy_dokploy_cache_bust.md`, this is a recurring failure pattern. Always run §LiveStagingVerificationGate after deploy.
6. **Hardcoded route lists in audit scripts drift silently.** Cycle-3 had `MARKET_PAGES = [7 entries]` hardcoded in `audit-completeness.ts` while the site had 13 markets. Mitigation: derive route list dynamically from data layer (e.g. `src/lib/markets.ts`) at audit time, OR extend manually each cycle.
7. **Field-name drift between report producer and consumer.** Cycle-3 had `deploy-and-verify.ts` reading `j.summary` while `audit-completeness.ts` wrote `j.counts`. Mitigation: backward-compatible read pattern (`j.counts ?? j.summary`); structural improvement = type-share between producer and consumer.
8. **TCPA prose ≠ TCPA mechanics.** Florida § 501.059 + 2024 FCC one-to-one consent rule require an affirmative consent mechanism (checkbox + signature + timestamp + audit log + number-specific authorization). Adding consent disclosure prose to a form helper is necessary but not sufficient. Synthesis must say "disclosure prose added" not "TCPA-compliant added."
9. **Ambiguous ISA constraint readings are principal-decisions, not silent-resolutions.** When a constraint admits two coherent readings, log a Principal Decision Card; do not unilaterally pick a reading.
10. **Cross-vendor diversity requires explicit measurement, not just family count.** 5 audit teams sharing the OpenAI corpus + 1 Gemini blindspot is NOT 6 independent perspectives. Cross-team recommendation overlap is a homogeneity signal. Add a homogeneity check at synthesis.
11. **Skill specs that mention real client names / vertical-specific filenames are project-local docs.** They DO follow PAI skill conventions but they live in `<project_root>/docs/skills/`, not in `~/.claude/skills/`. Promotion to PAI skill happens only after the spec is fully parameterized AND reused on at least 2 verticals.
12. **The CreateSkill skill is the parent.** Use `Skill("CreateSkill")` with the UpdateSkill workflow when modifying this spec — handrolling is anti-pattern even though this spec lives in a project tree.

## BPE (Bitter-Pilled Engineering) check

Before each release, ask: **"Would a smarter model make this skill unnecessary?"**

- ✅ **Anti-fragile (KEEP):** the audit-chain commands, the `audit:images` + `audit:brand` sentinel scripts, the live-staging verification gate, the gotchas section, the principal-decision register pattern, the compliance severity taxonomy, the parameterized intake fields, the rate-limit cap rules
- ❌ **Fragile (CUT next time):** any rule that says "the model will…" or "Claude should…" — Claude can already self-derive process steps; what it can't derive is the failure modes (gotchas), the verifications (sentinel scripts), and the constraints (anti-criteria)

Currently this skill scores well on the anti-fragile axis: most of its mass is verifications + anti-criteria + gotchas + parameterized inputs.

## Skill version history

See `WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md` for version-by-version details.

- **v0.1.0** — Mia cycle 3 — initial spec; multi-family lane; 7 expert teams; 8 hard gates + 4 soft gates
- **v0.2.0** — Mia cycle 4 — Spark-only lane; rate-limit cap; image + brand sentinels; live-staging gate; compliance severity taxonomy; principal-decision register; parameterized artifact paths; world-class production QA checklist; skill improvement loop formalized; 11 hard gates + 4 soft gates

## Evidence appendix

Authored 2026-05-08 from cycle-3 of the Mia Sanabria realtor site (`~/code/mia-sanabria-website/`). Upgraded same day from cycle-4. The audit reports, synthesis reports, Cato/advisor verdicts, and visual QA matrix from those cycles are the empirical substrate for every workflow primitive in §1-8. Every gotcha in §Gotchas was observed in one of those cycles. The 12 reusable components from cycle-3 Team G's `production-loop-architecture.md` are the genesis of this spec; the 10 cycle-4 lessons are the v0.2.0 upgrades.
