# Reviewer C — Deterministic-Audit Promotion

- **Reviewer:** C — Deterministic-Audit Promotion
- **Files inspected:**
  - `package.json` (37 `audit:*` scripts, including `audit:all` and `audit:all:stable`)
  - `scripts/audit-*.ts` (25 audit scripts on disk)
  - `scripts/audit-stale-terms.ts` (head — pattern-list grep model)
  - `scripts/audit-trust-row.ts` (head — string-presence regression gate)
  - `CLAUDE.md` (63 lines, project-local rules)
  - `docs/artifacts/cycle-20-agency-qa/issue-matrix.md` (deterministic vs reminder split)
  - `docs/CYCLE_*_HANDOFF.md` (4 prior handoffs — zero contain `Smarter-AI Closeout` today)
- **Finding:** The "did the previous cycle emit a Smarter-AI Closeout block?" check is fully deterministic — it's a grep over the newest `docs/CYCLE_*_HANDOFF.md` (or `NEXT_SESSION_TRIGGER.md`) for the literal heading `## Smarter-AI Closeout`. The 7-bullet shape with closed enumerations is also deterministically checkable (count `^- ` lines under the heading, regex-match each bullet's prefix against a fixed vocabulary). The pattern matches existing micro-audits in style: `audit-stale-terms.ts` is grep+catalog, `audit-trust-row.ts` is presence+structure over emitted HTML. However, the audit is N=1 today — zero prior cycles emitted the block — so it fires on the *next* handoff, not on every PR. Recurrence frequency is per-cycle (~weekly), not per-PR.
- **Recommended minimal change:** CLAUDE.md + lightweight grep audit
- **Bloat risk:** low
- **Promotion target:** both
- **Owner category:** tool/process defect
- **Confidence:** 0.78
- **Should main thread act:** yes
- **Justification one-paragraph:** The closeout block is a structured artifact emitted to a known path with a fixed heading and a closed-enumeration bullet shape — exactly the contract that `audit-stale-terms` and `audit-trust-row` already encode for other surfaces. The check is cheap (one file read + regex), the failure message is actionable ("emit Smarter-AI Closeout in latest handoff with 7 bullets matching schema"), and it pins the doctrine into a verifiable gate rather than a CLAUDE.md hope. Adding it to `audit:all` makes the next cycle's handoff fail-loud if the block is missing or malformed. Two-line CLAUDE.md addition naming the gate keeps the doctrine visible.
- **If audit promotion = yes:**
  - Script: `scripts/audit-closeout.ts`, package.json entry `"audit:closeout": "bun run scripts/audit-closeout.ts"`, appended to `audit:all` and `audit:all:stable`.
  - Deterministic check (pseudocode):
    ```
    latest = newest(docs/CYCLE_*_HANDOFF.md OR docs/NEXT_SESSION_TRIGGER.md)
    body  = readFile(latest)
    if !/^## Smarter-AI Closeout\b/m.test(body) → FAIL "missing block"
    bullets = body.slice(heading).match(/^- /gm).slice(0, 7)
    if bullets.length !== 7 → FAIL "expected 7 bullets, got N"
    for each bullet: assert /^- (Owner|Severity|Bloat|Promotion|Confidence|Action|Verification):/
    ```

Confirm save: `/home/torrey/code/mia-sanabria-website/docs/artifacts/cycle-20-r1-smarter-ai-closeout/reviewer-packs/C-deterministic-audit.md`
