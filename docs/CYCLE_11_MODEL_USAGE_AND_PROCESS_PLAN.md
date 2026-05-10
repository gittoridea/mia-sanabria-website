# Cycle 11 — Model Usage + Process Plan (2026-05-09)

**Captured:** 2026-05-10T02:38–02:39Z
**Algorithm:** v6.4.0 · **Effort:** E5 (explicit `/effort max`)
**Authority:** GPT-5.5 highest verified effort = predeploy + live acceptance gate

---

## 1. Model capability — fresh probe (this cycle)

| Probe | Command (excerpt) | Result | Token cost | Latency |
|---|---|---|---:|---|
| `gpt-5.5` `model_reasoning_effort=max` | `codex exec -m gpt-5.5 -c model_reasoning_effort=max ...` | ❌ `Error loading config.toml: unknown variant 'max'` | n/a | <1s |
| `gpt-5.5` `model_reasoning_effort=xhigh` | `codex exec -m gpt-5.5 -c model_reasoning_effort=xhigh ...` | ✅ `PROBE_OK` returned | 7,046 | ~10s |
| `gpt-5.3-codex-spark` `model_reasoning_effort=xhigh` | `codex exec -m gpt-5.3-codex-spark -c model_reasoning_effort=xhigh ...` | ✅ `SPARK_OK` returned | 9,120 | ~12s |
| `codex --version` | — | `codex-cli 0.129.0` | n/a | <1s |

**Highest accepted reasoning effort:** `xhigh` (same as Cycle 9, Cycle 10).
**Codex CLI version:** unchanged (`0.129.0`).

## 2. Honesty contract for this cycle

- **Predeploy + live acceptance gates** will use `gpt-5.5` at `model_reasoning_effort=xhigh` (highest accepted variant, since `max` is rejected by codex-cli 0.129.0).
- The string "max" will not be claimed in this cycle's documentation.
- Cato cross-vendor audit will use `gpt-5.5` `xhigh` via `codex exec --sandbox read-only --output-schema ~/.claude/agents/Cato.verdict-schema.json`.
- Codex Spark teams will use `gpt-5.3-codex-spark` at `xhigh` with `--sandbox read-only` (audit lanes) or `workspace-write` (implementation lanes).

## 3. Concurrency cap (per skill v0.3.2 + memory `knowledge_codex_spark_concurrency.md`)

- **≤ 2 same-model concurrent** Codex xhigh calls. Pipe `< /dev/null` to close stdin and prevent stdin-stalls observed at concurrency 4+.
- For multi-family lane, can mix Spark + 5.4 + 5.5 at ≤ 3 concurrent total.
- Spark teams dispatched in **3 batches of 2** (A+B, then C+D, then E+F) for the 6-team plan.

## 4. Browser / instrumentation capability (NEW THIS CYCLE)

This is the substrate change that closes Cycle 10's F6.

| Probe | Command | Result |
|---|---|---|
| Chrome DevTools listener | `google-chrome --remote-debugging-port=0 ...` | ✅ port 45721 LISTEN on 127.0.0.1 (CDP available) |
| Chrome screenshot at 320×568 | `--window-size=320,568 --screenshot=/tmp/p.png` | ✅ PNG 320×568 written (1664 B for blank) |
| Chrome `--dump-dom` at narrow viewport | (Cycle 10 finding) | ❌ clamps to ~500px regardless of `--window-size` (F6) |

**Conclusion:** the F6 mobile-DOM gap is closeable via DevTools Protocol, NOT via `--dump-dom` flag tuning. Strategy:

- **For DOM probing at 320 / 375:** open Chrome with `--remote-debugging-port=N`, connect via WebSocket, send `Page.setDeviceMetricsOverride { width, height, deviceScaleFactor, mobile: true }`, then `Runtime.evaluate` the probe expression. This gives `window.innerWidth === requested.w`.
- **For pixel screenshots:** existing `--screenshot --window-size` is already truthful and unchanged.
- **HARD gate enforcement:** every viewport-specific finding MUST record `probe.viewport.w` and `probe.requestedViewport.w`; if they disagree, finding becomes SKIP with `instrumentation_mismatch` reason. Never PASS on a viewport-mismatch — that's a silent lie.

## 5. Spark-team plan (six teams in 3 batches of 2)

| Batch | Team | Sandbox | Focus |
|---|---|---|---|
| 1 | A — Footer / Trust-Strip Designer | read-only | LPT/REALTOR®/EHO visual treatment, mobile stack, premium feel |
| 1 | B — True Mobile QA Engineer | read-only | Validate Phase 2 instrumentation; surface 320/375/414 issues against Cycle 10 carry-forward |
| 2 | C — Image + Logo Asset QA | read-only | All site assets — markets, headshot, OG, favicons, footer logos |
| 2 | D — Luxury Production-Polish Critic | read-only | Top-luxury production-shop final-mile checklist |
| 3 | E — SEO/AEO + Structured Content QA | read-only | Visible structure for answer extraction, metadata, schema, OG, stale brand |
| 3 | F — Process Improvement Architect | read-only | Skill v0.3.3 candidates; what the system still missed |

Each brief carries an `AUDIT_START` / `AUDIT_END` delimiter, mandatory `top_findings: []` JSON suffix, and severity taxonomy `{deploy_blocker, would_not_ship, concerns, polish, info}`.

## 6. GPT-5.5 acceptance gates

- **Phase 6 (visual judgment + fix plan)** — pre-implementation — synthesizes Spark findings + screenshots + footer audit into a fix plan. Scope-of-fix recommendation; not a deploy gate.
- **Phase 10 (predeploy acceptance)** — pre-deploy — verdict ∈ {PASS, PASS_WITH_MINOR_CONCERNS, FAIL}. FAIL requires one iteration before deploy.
- **Phase 12 (live acceptance)** — post-deploy — final verdict. SESSION_MAY_CLOSE: yes/no.

All three GPT-5.5 calls are `model_reasoning_effort=xhigh` (highest accepted).

## 7. Cato (Algorithm v6.4.0 R8 — MANDATORY at E5)

Two prior tombstones (Cycle 9 + Cycle 10) was the documented limit per next-session trigger after Cycle 10. **Cato runs this cycle.** Schema-enforced verdict via `Cato.verdict-schema.json`. Read-only.

## 8. Process discipline reminders (consolidated)

| Rule | Source |
|---|---|
| Pipe `< /dev/null` on every Spark dispatch | `knowledge_codex_spark_concurrency.md` |
| Audit chain green pre-deploy AND post-deploy | skill v0.3.2 hard gates #1, #20 |
| Live screenshots only — no theorizing from local | skill v0.3.2 hard gate #15 (probe-viewport sanity assertion) |
| Probe-viewport sanity assertion | skill v0.3.2 hard gate #21 |
| Forge race-scope-drift discipline | `feedback_forge_race_scope_drift.md` |
| Cato structured-verdict prompt | `feedback_cato_structured_verdict_prompt.md` |
| Caddy cache-bust after deploy | `feedback_caddy_dokploy_cache_bust.md` |

---

**Phase 1 result: ✅ models honestly probed; xhigh is highest accepted; Chrome DevTools listener opens cleanly; F6 closure path is executable.**
