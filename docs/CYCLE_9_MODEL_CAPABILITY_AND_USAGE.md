# Cycle 9 — Model Capability and Usage (Phase 1)

**Date:** 2026-05-09
**Purpose:** Probe whether GPT-5.5 supports `model_reasoning_effort=max` and document the operating configuration honestly.

## Verdict

**`max` is NOT a valid `model_reasoning_effort` value in `codex-cli 0.129.0`.** The accepted variants are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`. **`xhigh` is the highest accepted setting** and is already the default in `~/.codex/config.toml`. Cycle 9 will use **`gpt-5.5` with `model_reasoning_effort=xhigh`** for every GPT-5.5 strategic gate and acceptance review, exactly as Cycle 8 did. This is **not a downgrade from "max"** — `max` was never a real setting; it was language the user used to mean "deepest reasoning available," and `xhigh` is that setting.

## Probes

### codex CLI version

```
$ codex --version
codex-cli 0.129.0
```

Binary: `/home/torrey/.local/bin/codex`. Auth: `~/.codex/auth.json` (oauth, no `OPENAI_API_KEY` env).

### Codex config snapshot

`~/.codex/config.toml` first lines:

```toml
model = "gpt-5.5"
model_reasoning_effort = "xhigh"
```

Defaults already favor gpt-5.5 + xhigh.

### `max` rejection

```
$ echo "say hi" | codex exec -m gpt-5.5 -c model_reasoning_effort=max --sandbox read-only
Error loading config.toml: unknown variant `max`, expected one of `none`, `minimal`, `low`, `medium`, `high`, `xhigh` in `model_reasoning_effort`
```

The `max` variant is rejected at the config-loader level — it never reaches the API. There is no "max" reasoning tier in this codex CLI build.

### `xhigh` confirmation

```
$ echo "say hi" | codex exec -m gpt-5.5 -c model_reasoning_effort=xhigh --sandbox read-only --skip-git-repo-check
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
…
codex
Hi.
```

`xhigh` is the highest accepted reasoning_effort for gpt-5.5 and confirmed working.

### gpt-5.3-codex-spark availability

```
$ echo "say hi" | codex exec -m gpt-5.3-codex-spark -c model_reasoning_effort=xhigh --sandbox read-only --skip-git-repo-check
…
codex
Hi.
```

Codex 5.3 Spark is available at xhigh and ready to dispatch.

### Specialist availability

`bun ~/.claude/PAI/TOOLS/SpecialistProbe.ts --json`:

| Specialist | Status | Notes |
|---|---|---|
| Forge (gpt-5.4 via codex exec) | ✅ available | binary `/home/torrey/.local/bin/codex`, oauth |
| Cato (gpt-5.4 via codex exec --sandbox read-only) | ✅ available | same binary, read-only mode confirmed |
| PerplexityResearcher (via OpenRouter) | ✅ available | `OPENROUTER_API_KEY` set |
| Anvil (Kimi K2.6 via Moonshot/OpenRouter) | ❌ unavailable | `kimi`/`anvil` binary not present at expected paths |

Anvil unavailability is not a blocker — Cycle 9 does not require Kimi. Forge handles any Claude-equivalent code-producer fallback if needed; the bulk of bounded implementation work runs through Codex Spark teams.

## Cycle 9 operating configuration (committed)

| Role | Model | Effort | Where |
|---|---|---|---|
| Strategic / acceptance reviewer | `gpt-5.5` | `xhigh` (highest available) | Phase 4 layout decision · Phase 8 predeploy acceptance · Phase 10 live acceptance |
| Bounded implementation / audit teams | `gpt-5.3-codex-spark` | `xhigh` | Phase 5 Teams A/B/C/D |
| Auto-included code producer | Forge (`gpt-5.4` via `codex exec`) | `high` (codex default) | Phase 6 implementation if dispatched |
| Cross-vendor audit (E5 mandatory) | Cato (`gpt-5.4` via `codex exec --sandbox read-only`) | n/a | Phase 9 VERIFY (Algorithm v6.4.0 R9 schema-enforced) |
| Code orchestrator + integrator + deploy owner | Claude Code (this session) | E5 (`/effort max` user explicit, mapped to comprehensive tier) | every phase |

## Honesty contract

The Cycle 9 mission prompt asks for "GPT-5.5 with maximum available reasoning/effort." We commit to:

- using `model_reasoning_effort=xhigh` (highest accepted by codex CLI 0.129.0) for every GPT-5.5 invocation
- never claiming `model_reasoning_effort=max` worked when it did not
- documenting any future GPT-5.5 invocation that uses anything other than `xhigh` with the reason
- treating `xhigh` and "max-available-effort" as synonyms in this cycle's docs, with this Phase 1 file as the authoritative explanation

Cycle 8 also operated at gpt-5.5 / xhigh — Cycle 9 is not changing the model lane, it is delivering the layout fix that Cycle 8 deferred.

## Concurrency rules (Codex Spark teams)

Per `feedback_codex_spark_concurrency.md`:

- **Cap:** ≤2 same-model concurrent for normal Spark teams; ≤3 only for short read-only briefs that have proven to clear the stdin probe stall.
- **Stdin:** every dispatch closes stdin (`< /dev/null`) to avoid the 39B-log-file stall pattern.
- **Mix families when possible:** Spark + Forge + Cato across phases reduces same-model contention.

Cycle 9 will dispatch Teams A/B in one batch and Teams C/D in a second batch. If Phase 4's layout-decision prompt is short and read-only, A/B/C may fan to 3-concurrent.

## Fallback documentation

If at any moment in this cycle a `gpt-5.5` invocation fails with a model-availability or rate-cap error, we fall back in this order:

1. Retry once with the same params after a 30s wait.
2. If still failing, downshift to `gpt-5.4` with `model_reasoning_effort=high` and **document the fallback in `docs/CYCLE_9_MODEL_FALLBACKS.md`**.
3. Never silently swap models — every fallback gets a written line item with timestamp + reason + invocation context.

---

**End of Phase 1 doc.**
