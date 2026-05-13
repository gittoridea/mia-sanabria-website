# Cycle 27 — PAI / Tool / Subagent Discovery

**Generated:** 2026-05-13
**Operator:** Claude Code main session (Opus 4.7, 1M-context). ALGORITHM mode, tier E4.
**Method:** Inventoried `Agent` subagent types declared at session start, `Skill` skills declared at session start, and runtime tools available in this CLI session. Recorded which actual surface each phase deliverable was assigned to, and which named passes ran in the main session as substitutions.

## Available surfaces at session start

### Subagent types declared via the `Agent` tool

| Subagent | Capability | Decision for Cycle 27 |
|---|---|---|
| `Algorithm` | ISC evolution / OBSERVE-THINK-PLAN-BUILD-VERIFY-LEARN orchestration | Not invoked. Mission brief is plain markdown with explicit phases; user said "Do not begin by running slash commands" and "This is not a Bridge/GHL/deploy sprint". Phases drive the work; the Algorithm formal loop is not needed for an evidence-and-documentation cycle. |
| `Anvil` | Kimi K2.6 long-context code producer | Not invoked. No code generation required at scale. |
| `Architect` | Distributed-systems design specialist | Not invoked. No system design in scope. |
| `Arthur` | Credential custodian | Not invoked. No credential decisions. |
| `Artist` | Image prompt engineering | Not invoked. No image generation in scope. |
| `Cato` | Cross-vendor GPT-5.4 auditor (read-only) | Not invoked. Phase 9 already runs the local audit chain; cross-vendor audit is reserved for E4/E5 coding ISAs. |
| `claude-code-guide` | Claude Code CLI / SDK / API guidance | Not invoked. |
| `ClaudeResearcher`, `GeminiResearcher`, `GrokResearcher`, `PerplexityResearcher`, `CodexResearcher` | Multi-vendor research subagents | **Considered** for parallel city research, **not invoked** — Cycle 26 already verified 47 facts across 7 cities against `.gov`/`.org`/Census/Wikipedia, leaving Fort Lauderdale + Pompano Beach as the only cities lacking source ledgers. Main-session `WebSearch` + `WebFetch` is sufficient for the 2-city gap and avoids context inflation. |
| `Designer` | UX/UI specialist | Not invoked. No design system work. |
| `Engineer` | Principal engineer (Claude-family) | Not invoked. Mission is research/docs, not engineering. |
| `Explore` | Read-only repo search | Not invoked. Targeted Grep/Read sufficient for known files. |
| `Forge` | GPT-5.4 code producer | **Considered** under the E4 auto-include rule, **not invoked**. The auto-include binding (`CLAUDE.md` → "Forge auto-include") gates on coding tasks ("implement, refactor, debug, build, migrate"). This mission is explicitly evidence and documentation, with surgical safe fixes only — not coding. The user-named pass list (Phase 1 of brief) does not include Forge. Recording the deliberate non-invocation here for audit trail. |
| `general-purpose` | Catch-all multi-step research/exec | Not invoked. Phases mapped to direct tools. |
| `Plan` | Implementation planner | Not invoked. User provided the plan. |
| `Silas` | Offensive security specialist | Not invoked. No security assessment in scope. |
| `pr-review-toolkit:*` | Code-review / silent-failure / type / comment / simplifier | Not invoked. No code review in scope. |
| `statusline-setup` | Configure status line | Not invoked. |

### Skills declared at session start (selected)

- `IterativeDepth` — multi-lens exploration. **Considered, not invoked** — would have surfaced additional ICP angles, but the mission brief already specifies the ICP cohorts (luxury sellers, waterfront/lifestyle buyers, qualified SE FL buyers, absentee owners, expired-listing sellers, relocating buyers, investors); a 4-lens pass would not yield new criteria.
- `RedTeam` — adversarial validation. **Considered, not invoked** — the constraints list in the brief already enumerates banned claim categories; running RedTeam against the evidence library would duplicate work already done by Cycle 22 / 23 / 26 compliance reviews.
- `FirstPrinciples` — assumption decomposition. **Considered, not invoked** — the ICP and constraint surfaces are well-defined.
- `Research` — comprehensive research orchestrator. **Considered, not invoked** — same rationale as the dedicated researcher subagents: scope is two cities of evidence and pre-existing artifact synthesis.
- `Interceptor` — real-Chrome browser automation. **Not relevant** — no deploy verification, no live page interaction.
- `Browser` — headless agent-browser automation. **Not relevant**.

### Runtime tools used directly in this session

- `Bash` — git inspection, audit gates, validation chain, secret-scan grep, package script inspection.
- `Read` — `src/lib/mia.ts`, `src/lib/markets.ts` selected ranges, Cycle 26 artifacts.
- `Write` — Cycle 27 artifact creation under `docs/artifacts/cycle-27-evergreen-city-evidence/`.
- `Edit` — surgical safe fixes if needed in Phase 7.
- `WebFetch` — primary-source verification for the 2 cities not covered by Cycle 26.
- `WebSearch` — locating official `.gov`/`.org` pages where the WebFetch starting URL is not known.
- `TaskCreate` / `TaskUpdate` / `TaskList` — phase progress tracking.

## Desired role passes — mapping to actual surfaces

The mission brief lists nine desired roles. The session runs them as **named passes inside the main session** rather than as separate subagent spawns. The substitution rationale is recorded per row.

| Desired role | Actual surface used | Substitution rationale |
|---|---|---|
| Mission Commander / PAI Orchestrator | Main session (Opus 4.7) | The brief is the orchestration plan; main session executes phase-by-phase. |
| Official Source Researcher | Main session via `WebFetch` + `WebSearch` for Fort Lauderdale + Pompano Beach; reuse of Cycle 26 `city-fact-evidence-review.md` for the 7 already-verified cities | Avoids duplicating 47 already-verified facts; surgical fill for the 2-city gap. |
| City Evidence Librarian | Main session (this artifact set) | The Cycle 26 review acts as the prior librarian's output; Cycle 27 consolidates it into 9 per-city briefs + a source ledger. |
| Mia ICP / Luxury Real Estate UX Reviewer | Main session against PAI USER context (Mia at `~/.claude/PAI/USER/PROJECTS/MiaSanabria/` referenced from PROJECTS.md; LPT Realty, REALTOR®, English-only language constraint, SE FL waterfront focus) | The Mia content-decision record (`docs/mia-client-decision-record.md`) and the prior Cycle 22 / 23 / 24 / 25 / 26 artifacts already encode Mia's voice constraints. No new ICP discovery this cycle. |
| Compliance / Claims Reviewer | Main session against the project `CLAUDE.md` honesty contracts and Cycle 22 / 25 / 26 banned-language lists | The repo already carries a full banned-claim catalog inside `audit-stale-terms.ts` and `audit-no-fabrications.ts`; the Phase 9 gate is the actual reviewer. |
| SEO / Information Architecture Reviewer | Main session against `audit:route-inventory` + `audit:featured-markets` + `audit:seo` output | Route inventory is canonically machine-verified; no new IA shape this cycle. |
| Security / Bridge IDX Architecture Reviewer | Main session against `src/lib/bridge.ts` scaffold-state and the secret-scan grep in Phase 9 | Bridge runtime is gated by Torrey credential approval and is out of scope for Cycle 27. |
| QA / Validation Engineer | Phase 9 — `bun run typecheck` + `lint` + `build` + `audit:all` + `audit:qa-gate` + targeted greps | The audit chain is the QA engineer. |
| Dev Housekeeping / Bloat Reviewer | Reuse of Cycle 26 `bloat-review.md` (`audit-rendered-visual.json` 1.4MB flagged; otherwise clean) | No new bloat introduced this cycle; carry-over flags noted in the gap-closure map. |

## What this discovery deliberately does NOT do

- It does not pretend that named-pass main-session execution is equivalent to multi-vendor research. Where parallel multi-vendor verification would have added value (e.g., contested historical claims), the brief instead chose pre-verified `.gov` / `.org` / Census / official-institution sources via direct `WebFetch`. The trade-off is honest: depth over breadth for two cities, in service of speed and verifiability.
- It does not invoke Forge despite the E4 tier classification, because the mission is not a coding task. Forge auto-include is a coding-task gate; the user's brief explicitly delineated this as evidence and documentation work.
- It does not spawn six parallel research subagents for nine cities, because seven of nine already have a citation-backed evidence file from Cycle 26. Re-running parallel research would be redundant.
- It does not invoke `Interceptor` or `Browser` because there is no live web verification or deployment artifact to confirm in Cycle 27.

## Phase ownership map

| Phase | Owner | Output path |
|---|---|---|
| Phase 0 — Preflight | Main session | `git status` results in this run (no artifact). |
| Phase 1 — Discovery | Main session | `docs/artifacts/cycle-27-evergreen-city-evidence/pai-tool-discovery.md` (this file) |
| Phase 2 — Source policy | Main session | `docs/artifacts/cycle-27-evergreen-city-evidence/source-policy.md` |
| Phase 3 — Research | Main session via WebFetch / WebSearch + Cycle 26 reuse | `docs/artifacts/cycle-27-evergreen-city-evidence/source-ledger.md` |
| Phase 4 — City briefs | Main session | `docs/artifacts/cycle-27-evergreen-city-evidence/city-briefs/{slug}.md` × 9 |
| Phase 5 — Copy crosswalk | Main session | `docs/artifacts/cycle-27-evergreen-city-evidence/copy-crosswalk.md` |
| Phase 6 — ICP guide | Main session | `docs/artifacts/cycle-27-evergreen-city-evidence/mia-icp-assimilation-guide.md` |
| Phase 7 — Safe fixes | Main session | Edits to `src/lib/*` only if surgical and supported. |
| Phase 8 — Gap closure map | Main session | `docs/artifacts/cycle-27-evergreen-city-evidence/remaining-gap-closure-map.md` |
| Phase 9 — Validation | Main session (audit scripts) | `reports/*.{json,md}` regenerated; deltas noted in session report. |
| Phase 10 — Session report | Main session | Append to `/home/torrey/trueops/session-launcher/reports/MIA_SESSION_REPORT.md` |
| Phase 11 — Commit | Main session | One local commit; no push. |
