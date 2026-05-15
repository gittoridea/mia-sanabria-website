# Cycle 36D — Validation Recovery Classification

**Generated:** 2026-05-15T (Cycle 36D)

## Source

- log: `docs/artifacts/cycle-36-bridge-live-integration/logs/full-validation-20260514-180132.log`
- pointer: `docs/artifacts/cycle-36-bridge-live-integration/logs/latest-full-validation-log.txt`
- tmux session: `mia-cycle36c-validation-20260514-180132` (ended; not present at resume)

## Classification

```yaml
latest_validation_log: docs/artifacts/cycle-36-bridge-live-integration/logs/full-validation-20260514-180132.log
validation_session_active: false
validation_status: completed_pass
exit_code: 0
last_completed_gate: audit:mobile-readability (84 PASS · 0 FAIL · 0 ERROR)
failure_if_any: none
needs_rerun: false
rationale: |
  Log ends with `EXIT_CODE:0` written by the tmux wrapper. All gates
  in the full chain reported PASS/0-FAIL or 0-FAIL with allowed WARN.
  Per Phase 1 rule, completed_pass means run only the sanity subset
  before commit — not full validation re-run.
```

## Gate-by-gate witness (from log)

| Stage | Result |
| --- | --- |
| typecheck | clean (tsc --noEmit, no output) |
| lint | `✔ No ESLint warnings or errors` |
| build | 61 static pages generated, Exporting (3/3) ✓ |
| audit:stale | clean across out/ (913ms) |
| audit:schema | 287 JSON-LD blocks parse with @context + @type |
| audit:links | 2847 internal links resolve |
| audit:seo | 0 warnings, 0 errors |
| audit:completeness | `Summary: 16 PASS · 1 WARN · 0 FAIL · 0 SKIP` |
| audit:images | `Summary: 14 PASS · 0 WARN · 0 FAIL · 0 SKIP` |
| audit:brand | `Summary: 12 PASS · 0 WARN · 0 FAIL · 0 SKIP` (demo-warning exception honored) |
| audit:insights | 547 PASS · 0 WARN · 0 FAIL across 12 articles |
| audit:featured-markets | `Summary: 17 PASS · 0 WARN · 0 FAIL · 0 SKIP` |
| audit:legal | `Summary: 18 PASS · 1 WARN · 0 FAIL · 0 SKIP` |
| audit:about | `Summary: 12 PASS · 0 WARN · 0 FAIL · 0 SKIP` |
| audit:hero-contrast (stable, samples=3) | 145 PASS · 0 WARN · 0 FAIL · 0 SKIP |
| audit:rendered | 14 PASS · 1 WARN · 0 FAIL · 0 SKIP |
| audit:fort-lauderdale-standard | 31 PASS · 0 WARN · 0 FAIL |
| audit:hero-contrast (samples=1, second pass) | 145 PASS · 0 WARN · 0 FAIL · 0 SKIP |
| audit:hero-contrast:stable (second pass) | 145 PASS · 0 WARN · 0 FAIL · 0 SKIP |
| audit:mobile-readability | 84 PASS · 0 FAIL · 0 ERROR |

WARN counts (legal:1, completeness:1, rendered:1) are allowed by the gate convention; FAIL == 0 in every gate.

## Sanity subset to run now (per Phase 1 rule)

```bash
bun run typecheck
bun run lint
bun run build       # optional — only if source files changed since 18:01
bun run audit:brand
bun run audit:hero-contrast
bun run audit:hero-contrast:stable
bun run audit:mobile-readability
bun run scripts/audit-hero-pixel-contrast.ts --mutation --samples=1 \
  --routes=/markets/seven-isles/,/markets/pompano-beach/,/markets/fort-lauderdale/
```

Run sanity subset → secret scan → commit.
