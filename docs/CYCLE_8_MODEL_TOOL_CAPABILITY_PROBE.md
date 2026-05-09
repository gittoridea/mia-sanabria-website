# Cycle 8 — Model & Tool Capability Probe

**Captured:** 2026-05-09T14:30Z
**Algorithm:** PAI v6.4.0 / E5 (`/effort max` explicit)
**Skill:** Website Production Loop v0.2.0 (cycle 8 will bump to v0.3.0)

## Codex CLI

| Probe | Command | Result |
|---|---|---|
| Version | `codex --version` | `codex-cli 0.129.0` |
| Binary | `command -v codex` | `/home/torrey/.local/bin/codex` |
| Auth | `ls ~/.codex/auth.json` | present (oauth) |
| Default model | `~/.codex/config.toml` `model` | `gpt-5.5` |
| Default reasoning | `~/.codex/config.toml` `model_reasoning_effort` | `xhigh` |
| Migration notice | `~/.codex/config.toml` `notice.model_migrations` | `gpt-5.3-codex` → `gpt-5.4` |

## Model availability — empirical pings (read-only sandbox)

| Model | Probe command | Result | Tokens |
|---|---|---|---|
| `gpt-5.5` (xhigh) | `codex exec --sandbox read-only --skip-git-repo-check --model gpt-5.5 --config model_reasoning_effort=xhigh ...` | `ALIVE-XHIGH-OK` | 20,017 |
| `gpt-5.3-codex-spark` | `codex exec --sandbox read-only --skip-git-repo-check --model gpt-5.3-codex-spark ...` | `ALIVE-XHIGH-OK` | 9,970 |
| `gpt-5.4` (Forge default) | gated through `codex exec` default config or explicit `--model gpt-5.4` | available (probed inferred from auth health) | n/a |

**Both required models are operational.** No fallback needed.

## Specialist-Prereq Probe (PAI v6.4.0 OBSERVE gate)

| Specialist | Probe | Result | Resolved |
|---|---|---|---|
| **Forge** | `command -v codex && (test -n "$OPENAI_API_KEY" || test -f ~/.codex/auth.json)` | pass | Forge bound (GPT-5.4 high) |
| **Anvil** | `test -n "$MOONSHOT_API_KEY" \|\| test -n "$OPENROUTER_API_KEY"` (Kimi K2 reachable) — also requires anvil/kimi binary which is missing | fail (binary absent) | Forge fallback |
| **Cato** | same codex binary, `--sandbox read-only` accepted | pass | Cato bound for VERIFY |
| **PerplexityResearcher** | `OPENROUTER_API_KEY` set | pass | not selected this cycle |
| **Engineer auto-worktree** | `git rev-parse --show-toplevel` in project | pass | available for Rule 2b separate-context VERIFY |

## Concurrency rules (carry-forward from prior cycles)

- **GPT-5.5 xhigh:** ≤1 concurrent. Used at decision gates only (not every minor task).
- **Codex 5.3 Spark:** ≤2 same-model concurrent (raise to 3 only for short / read-only briefs per cycle-6 successful run).
- **stdin:** always close with `< /dev/null`.
- **AUDIT_START / AUDIT_END envelope:** mandatory in read-only briefs (Codex cannot write files; emits inline).
- **`--skip-git-repo-check`:** required outside trusted repos when running from /tmp brief paths.
- **Output capture:** `--output-last-message <file>` extracts the assistant's final emission; tail and verify before consuming.

## Role allocation for Cycle 8

| Role | Model | Where it fires |
|---|---|---|
| Strategic reviewer | GPT-5.5 xhigh | Phase 1 retrospective, Phase 3 design decision gate, Phase 6 predeploy acceptance, Phase 7 live acceptance |
| Implementation team | Codex 5.3 Spark (×5 lanes A-E, ≤2 concurrent) | Phase 4 |
| Code producer (heavy lifting) | Forge (GPT-5.4 high via `codex exec`) | Phase 5 implementation of pixel-contrast audit + Hero variant |
| Cross-vendor audit | Cato | Phase 7 VERIFY (E5 mandatory) |
| Independent verifier | Engineer worktree | Phase 7 Rule 2b separate-context |
| Orchestrator + integrator + verifier + final deploy owner | Claude Code (this session) | every phase |

## Tool harness

| Tool | Probe | Result |
|---|---|---|
| Bun | `bun --version` | available (project uses bun-only per CLAUDE.md) |
| Chrome headless | `google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=W,H --virtual-time-budget=20000 --screenshot=...` | working (60 PNGs captured at /tmp/mia-cycle8-before/) |
| sharp | `bun -e "import('sharp').then(s=>console.log(s.default.versions))"` | available — used by /tmp/mia-genimg/run.ts and OG generator |
| ImageMagick | `magick -version` | TBD — pixel sampling will use sharp where possible |
| Playwright | `bunx playwright --version` | TBD; if absent, Chrome `--screenshot=` plus sharp pixel sampling is the path |
| Python | `python3 --version` | available — used as fallback for pixel sampling if sharp scripts get unwieldy |

## Falsification check — would a smarter model make this probe unnecessary?

The probe is anti-fragile: it captures empirical command-line truth rather than re-asserting prior probes. Even at higher model intelligence, the question "is gpt-5.5 reachable from THIS shell with THIS auth?" needs a real ping. **Keep.**

