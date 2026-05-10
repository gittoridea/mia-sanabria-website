# Cycle 10 — Model Usage and Process Plan (2026-05-09)

**Mission honesty contract:** the user requested "GPT-5.5 at maximum verified effort." The honest variant ladder, probed live this cycle, is below.

---

## 1. Model probe (verbatim, this session)

```text
codex-cli 0.129.0
```

| Probe | Setting | Result |
|---|---|---|
| `model_reasoning_effort=max` | gpt-5.5 | ✗ **REJECTED** — `Error loading config.toml: unknown variant 'max', expected one of 'none', 'minimal', 'low', 'medium', 'high', 'xhigh'` |
| `model_reasoning_effort=xhigh` | gpt-5.5 | ✅ accepted (highest accepted variant) |
| `model_reasoning_effort=high` | gpt-5.5 | ✅ accepted (faster fallback for time-bounded gates) |
| `model_reasoning_effort=xhigh` | gpt-5.3-codex-spark | ✅ accepted (Spark teams) |
| `model_reasoning_effort=xhigh` | gpt-5.4 (Cato) | ✅ accepted via codex CLI's `read-only` sandbox + schema-enforced verdict |

**Conclusion:** "max" is a non-existent variant in `codex-cli 0.129.0`. The user's "max" intent is interpreted as "deepest accepted reasoning available" which is `xhigh`. This honesty contract was first explicitly recorded in Cycle 9 (`docs/CYCLE_9_MODEL_CAPABILITY_AND_USAGE.md`); Cycle 10 re-confirms it.

## 2. Cycle-10 model lane assignment

| Gate / phase | Model | Effort | Why |
|---|---|---|---|
| Strategic visual judgment (P5) | `gpt-5.5` | `xhigh` (with `high` fallback if 720s timeout) | Bounded judgment is GPT-5.5's role per Cycle 8/9 doctrine |
| GPT-5.5 live acceptance (P8) | `gpt-5.5` | `high` first (~1 min), escalate to `xhigh` only if verdict ambiguous | Cycle 9 found `high` returned a 91-line verdict in <1 min; `xhigh` timed out at 720s during predeploy |
| Spark teams A–E (P4) | `gpt-5.3-codex-spark` | `xhigh` | Audit-content lane; ≤2 same-model concurrent per concurrency cap |
| Cato cross-vendor audit (VERIFY) | `gpt-5.4` via `codex exec --sandbox read-only --output-schema` | `high` | Schema-enforced verdict (Algorithm v6.4.0 R9) |
| Audit-rendered-visual.ts implementation (P3) | **Forge** (`gpt-5.5` codex exec) | `xhigh` | Foreground only; no parallel main-thread edits during Forge run (Forge race feedback) |
| All audit-script execution (typecheck/lint/build/audit:all/audit:rendered) | n/a (deterministic Bun + Chrome) | n/a | Codex models are not on the verification path; dispatchers only |

## 3. Concurrency caps

Per `feedback_codex_spark_concurrency.md`: max 3 same-model concurrent Codex xhigh calls; stdin stalls at 4+. To eliminate that risk this cycle:

- **Spark teams:** ≤2 same-model concurrent at any time. 5 teams (A/B/C/D/E) run in 3 batches: (A+B), (C+D), (E).
- **GPT-5.5 strategic gates:** sequential. Never parallel with Spark teams of the same family at once.
- **Forge:** foreground only. Main-thread will not edit non-Forge files during the Forge call (Forge race scope drift feedback).

## 4. Stdin discipline

Per Cycle 9 lesson + `feedback_codex_spark_concurrency.md`:

- Always pipe `< /dev/null` on every codex invocation.
- Briefs go via `-c` arg-prompt, NOT stdin, EXCEPT when the brief exceeds ~2000 chars or the dispatcher needs the silent-fail mitigation, in which case stdin-only with no arg-prompt is preferred and timeout raised to 720s.

## 5. Pre-flight Spark probe (Cycle 10 addition)

Before Phase 4 dispatch:

```bash
codex exec --sandbox read-only -c model_reasoning_effort=xhigh -c model="gpt-5.3-codex-spark" "say PROBE_OK on one line and exit" < /dev/null
```

If "PROBE_OK" returns within 60s, Spark is healthy → proceed with Phase 4. If it stalls → reduce reasoning_effort to `high` and re-probe; if still stalls, fall back to Forge for the audit lanes.

## 6. Anti-misrepresentation contract

Per Cycle 9 honesty doctrine:

- Every model invocation that produces a verdict MUST cite the actual `model_reasoning_effort` flag used.
- "max" never appears as a claimed effort tier in any closeout doc; "xhigh" or "high" as actually executed.
- If `xhigh` falls back to `high` for a given gate, the closeout records both attempts.

## 7. Verification

```text
$ codex --version
codex-cli 0.129.0

$ codex exec --sandbox read-only -c model_reasoning_effort=max -c model="gpt-5.5" "test" < /dev/null 2>&1 | head -2
Error loading config.toml: unknown variant `max`, expected one of `none`, `minimal`, `low`, `medium`, `high`, `xhigh`
in `model_reasoning_effort`

$ codex exec --sandbox read-only -c model_reasoning_effort=xhigh -c model="gpt-5.5" "say XHIGH_OK on one line and exit" < /dev/null 2>&1 | tail -3
tokens used
9,068
XHIGH_OK
```

(xhigh probe of gpt-5.5 was started but the test command emitted the `tokens used` summary line via `tail -5` framing — second probe on `gpt-5.3-codex-spark` confirmed `SPARK_OK` directly.)

---

**End of Phase 1 report.**
