# Cycle 30B — Tool / Subagent / Skill Discovery

**Date:** 2026-05-13 (Cycle 30B execution)
**Repo:** `/home/torrey/code/mia-sanabria-website`
**Purpose:** establish ground truth on what tools/subagents/skills are actually available before any expert-lane work, so claims in `expert-lane-findings.md` are honest about what was used.

## Repo-local discovery

| Surface | Status |
|---|---|
| `.claude/` directory in repo | **empty / non-existent** |
| Project `CLAUDE.md` subagent/skill mentions | **none** — file contains operational invariants only (stack, audits, deploy substrate, honesty contracts) |
| `package.json` scripts | **30+ audit scripts** plus `build` / `lint` / `typecheck` / `dev` — see inventory below |
| Playwright (used via `scripts/audit-mobile-readability.ts` and `scripts/audit-rendered-visual.ts`) | **available** read-only |

### Project audit scripts (Cycle 30B-relevant)

- `audit:all` / `audit:all:stable` — aggregate suites
- `audit:stale` (stale-term sweep), `audit:no-fabrications`, `audit:legal`, `audit:about`
- `audit:schema`, `audit:seo`, `audit:links`, `audit:images`, `audit:completeness`
- `audit:brand`, `audit:hero-contrast` / `:stable`, `audit:rendered`
- `audit:insights`, `audit:featured-markets`, `audit:fort-lauderdale-standard` / `-v3`
- `audit:lead-magnets`, `audit:trust-row`, `audit:trust-logos`
- `audit:mobile-readability` (default + `--capture` + `--base=` flags)
- `audit:qa-gate` (severity matrix, FAIL=block on critical)
- `audit:route-inventory` (sitemap vs filesystem reconcile)
- `audit:copy-density`
- `port-guard` (port collision guard)
- `build:pdfs`, `render:og-insights`, `dev`, `build`, `start`, `lint`, `typecheck`

All run via `bun run <name>`. All read-only against `out/` or live `--base=` URL except where annotated.

## User-level discovery (`~/.claude/`)

| Surface | Status |
|---|---|
| `~/.claude/agents/` | **16 subagent definitions present** (markdown specs) |
| `~/.claude/PAI/skills/` | empty / not present at the path checked |
| Browser Use (`browser-use` PyPI package or CLI) | **not installed** — not in PATH, not in pip |

### Subagents present at `~/.claude/agents/`

```
Algorithm.md          Cato.md                Engineer.md
Anvil.md              ClaudeResearcher.md    Forge.md
Architect.md          CodexResearcher.md     GeminiResearcher.md
Arthur.md             Designer.md            GrokResearcher.md
Artist.md             PerplexityResearcher.md  Silas.md
                      Cato.verdict-schema.json
```

Per the PAI system prompt, these are addressable via the `Agent` tool with `subagent_type=<Name>`. Each is designed for specific lanes:

- **Forge** — OpenAI-family code producer (GPT-5.4 via `codex exec`, reasoning effort=high). Used for E3/E4/E5 coding work.
- **Cato** — cross-vendor ISA auditor, read-only, returns structured JSON. Designed for VERIFY phase on E4/E5 work.
- **Engineer** — principal engineer; TDD + strategic planning.
- **Architect** — system design + constitutional principles + feature specs.
- **Anvil** — Moonshot Kimi K2.6 code producer (alternative to Forge).
- **Designer** — UX/UI design (Figma + shadcn/ui).
- **Algorithm** — owns Ideal State Criteria, recommends capabilities.
- **Artist** — visual content (Flux 1.1 Pro / Nano Banana / GPT-Image-1) — called by Media skill workflows only.
- **Silas** — offensive security specialist (penetration testing, vulnerability assessment).
- **Arthur** — credential custodian (announces decisions made by deterministic policy engine; does not decide itself).
- **{Claude,Codex,Gemini,Grok,Perplexity}Researcher** — research lanes for ClaudeResearcher (multi-query decomposition), CodexResearcher (TypeScript-focused), GeminiResearcher (multi-perspective), GrokResearcher (contrarian/fact-based), PerplexityResearcher (investigative + source-triple-checking).

## What Cycle 30B uses

Mission scope is **docs/dossiers + small Claude-local QA closures**. Spawning subagents would:

1. **Forge / Anvil / Engineer / Architect** — designed to write code. Cycle 30B's only safe code edit is `scripts/audit-mobile-readability.ts` route-list extension — a 7-route additive change. Spawning a subagent for that is overkill and adds coordination cost.
2. **Cato** — read-only cross-vendor auditor. Useful at VERIFY on E4/E5 ISAs. Cycle 30B is dossier-prep, not implementation; Cato's audit lane fires properly in Cycle 35 (Legal/CATO Closure) or pre-cutover, not here.
3. **Designer** — useful for visual edits / mockups. Cycle 30B explicitly does no public copy or visual rewrites.
4. **{Claude,Codex,Gemini,Grok,Perplexity}Researcher** — research lanes. Cycle 30B uses repo-internal evidence, not external research. Bridge IDX runtime evaluation could use a researcher in a future cycle, but the dossier prepared in Lane F is design-only and leans on Bridge's own public docs (URL preserved in `src/lib/bridge.ts:67`).
5. **Silas** — offensive security. Not in this mission's scope (pentest is post-cutover hardening).
6. **Arthur** — credential custodian. Not in scope; no credentials touched.
7. **Artist / Algorithm** — workflow-internal, not user-invoked for this kind of work.

### Substitution policy

The 13 expert lanes (A–M) in `expert-lane-findings.md` are **manual named expert review passes**. They are not subagent invocations. The lane labels (Mission Commander, Repo/Validation Engineer, Canonical/Doctrine Consistency Engineer, UX/Conversion Advisor, etc.) describe the *role lens* applied during review, not a subagent name. Each lane reads the same authoritative project artifacts (ISA.md, project CLAUDE.md, mia-client-decision-record.md, cycle-30 artifacts, project source for the relevant area) and produces a dossier sized to that role's deliverables.

This is the same pattern used in Cycle 21 (`docs/artifacts/cycle-21-ai-remaining-work/team-reports/team*.md`) and Cycle 22 (`docs/artifacts/cycle-22-remaining-gap-closure/team-reports/*.md`) — multiple "team" reports authored by a single execution pass.

### Tools actually used in Cycle 30B

| Tool | Where | Lane |
|---|---|---|
| `git` (state inspection + commit + push) | Phase 0, Phase 1, Phase 9 | n/a (operator) |
| `curl` + Python regex | live HTML extraction for nav + content drift | re-uses Cycle 30 method, light verification only |
| `bun run typecheck` / `lint` / `build` | Phase 7 | Lane B (Repo/Validation Engineer) |
| `bun run audit:*` (qa-gate, route-inventory, stale, no-fabrications, legal, mobile-readability with `--base=` live URL) | Phase 7 | Lane B |
| `Read` / `Edit` / `Write` tools | dossier authoring + 1 surgical script edit | Lane B for script; all other lanes write dossiers only |
| `git grep` (narrow secret-assignment scan) | Phase 7 | Lane F (Security/Bridge IDX) + Phase 1 push gate |

### Tools deliberately not used

| Tool | Why |
|---|---|
| Browser Use | not installed; mission scope says do not install. Deferred to Cycle 30A (paste-ready prompt in `future-prompt-bank.md`). |
| Anthropic subagents (Forge, Cato, Engineer, Architect, etc.) | dossier-prep does not need parallel code-producer or cross-vendor auditor; the route-list extension is too small to justify orchestration overhead. Each subagent is available for future cycles where its lane fires properly (e.g., Forge for Cycle 32 GHL forms implementation; Cato for Cycle 35 Legal/CATO Closure). |
| Live form submission | mission rule — no form submitted on live staging. |
| `.env` reads | mission rule — never. |
| Dokploy API writes | mission rule — no deploy. |
| GHL / Google / Bridge live writes | mission rule — none. |

## Safety constraints (carried from Cycle 30 + tightened for Cycle 30B)

- **No new secrets.** `git grep` narrow-assignment scan re-run as part of Phase 7. Hits expected only on public `BRIDGE_DOCS_URL` constant (`src/lib/bridge.ts:67`).
- **No source code changes** other than the proposed additive `scripts/audit-mobile-readability.ts` route-list extension. That edit is non-public, audit-only, and reversible.
- **No public copy changes.** Banners on doctrine docs only.
- **No public route migration.** `/markets/` and `/insights/` slugs stay.
- **No package/lockfile churn.** No `bun add`, no `bun install`, no version bumps.
- **One Cycle 30B commit max.** Local only unless Torrey explicitly authorizes push.
- **Production-readiness claim:** none made.
