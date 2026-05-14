# Lane M — Dev Housekeeping / Bloat Reduction Readiness Dossier

**Author lens:** Dev Housekeeping / Bloat Reduction Advisor
**Scope:** prevent artifact/report bloat without deleting evidence. Classify before any cleanup. **No deletion this cycle.**
**Inputs reviewed:** `docs/artifacts/`, `reports/`, `.gitignore`, `out/` (build output), git log churn, project CLAUDE.md rules around audit artifact preservation.

## Inventory

### `docs/artifacts/` cycle directories (intentional history)

| Cycle | Dir | Type | Size |
|---|---|---|---|
| 19A-M | `cycle-19A-M/` | Production-readiness register + mobile-readability baseline screenshots | ~ |
| 19b-fl, 19b-fl-r1 | `cycle-19b-fl/`, `cycle-19b-fl-r1/` | Fort Lauderdale standard + handoff | ~ |
| 19c-copy | `cycle-19c-copy/` | Copy doctrine + reviewer packs | ~ |
| 20-agency-qa, 20-r1 | `cycle-20-agency-qa/`, `cycle-20-r1-smarter-ai-closeout/` | Agency-tier QA + smarter-AI closeout | ~ |
| 21-ai-remaining-work | `cycle-21-ai-remaining-work/` | 6+ team reports + baseline audits | ~ |
| 22-r1, 22-remaining | `cycle-22-r1-mia-decision-implementation/`, `cycle-22-remaining-gap-closure/` | Mia decisions implementation + 12 packets + Cato review | ~ |
| 23-claude-lane | `cycle-23-claude-lane/` | GA4 honesty + WCAG a11y + overclaim catalog | ~ |
| 25 | `cycle-25-neighborhood-content/` | 7 new neighborhood pages + agent memos | ~ |
| 26 | `cycle-26-readiness-qa/` | Mobile capture paths + readiness evidence | ~ |
| 27 | `cycle-27-evergreen-city-evidence/` | Evergreen evidence library + gap map | ~ |
| 28 | `cycle-28-rendered-evidence-qa/` | Rendered gate + evidence library | ~ |
| 29 | `cycle-29-trueidea-staging-publish/` | TrueIdea staging deploy log + discovery | ~ |
| 30 | `cycle-30-mia-staging-review/` | Mia review packet + drift gate + 7 artifacts | ~ |
| 30B | `cycle-30b-expert-gap-closure/` | (this cycle) | growing |

**Recommendation:** all `docs/artifacts/cycle-*/` dirs are **intentional historical record**. They are the audit trail for what was true at the time. **Do not delete any.** They make Cato re-audits and post-mortems possible.

### `reports/` regenerated outputs

| File | Type | Behavior |
|---|---|---|
| `reports/audit-legal.json/.md` | regenerated each `audit:legal` run | timestamp + verdicts |
| `reports/audit-mobile-readability.json/.md` | regenerated each run | per-route per-device PASS/FAIL |
| `reports/audit-rendered-visual.json` | regenerated each run | rendered-DOM check |
| `reports/qa-gate-matrix.json/.md` | regenerated each `audit:qa-gate` run | severity matrix |
| `reports/audit-*` (other files) | same pattern | timestamp + verdicts |

**Recommendation:** these are **regenerated** on every audit run. They commit on most cycles because they're tracked. Each cycle's commit will show 1-2 line `Generated:` timestamp diffs in each `reports/*.md` file. That's noise but harmless.

**Possible future improvement (not this cycle):**

1. Add `reports/.gitkeep` and add `reports/audit-*.{json,md}` to `.gitignore`. Pro: no churn. Con: lose the post-audit-snapshot audit trail (can't `git show HEAD~5:reports/audit-qa-gate.json` to see historical state).
2. Or: commit reports only on cycles where verdict materially changed (manual judgment). Pro: signal-only. Con: harder discipline.

**Cycle 30B verdict:** leave `reports/` as-is. The 1-line `Generated:` diff is acceptable noise compared to losing historical snapshots. Document as a known trade-off.

### `out/` build output

`out/` is `.gitignore`-d per Next.js static export convention. Verified:

```
$ git check-ignore out
out
```

Build output never commits. Good.

### `node_modules/` and `.next/`

Both `.gitignore`-d. Good.

### Cycle 30 report churn

Cycle 30 commit `3c0381f` touched 5 `reports/*.{json,md}` files with only the `Generated:` timestamp changing. This is the expected pattern — every cycle's "validation pass" regenerates the report. Not a defect.

## Candidate future cleanup (NO action this cycle)

| Candidate | Why considered | Reason not now |
|---|---|---|
| Move `docs/artifacts/cycle-19*` / `cycle-20*` / `cycle-21*` / `cycle-22*` (older cycles) into a `docs/artifacts/archive/` subdir | reduces top-level scrollbar in `docs/artifacts/` | breaks all relative links in older docs. Need a migration cycle with link rewriting. |
| Delete redundant duplicate JSON+MD outputs in `reports/` | both formats exist for every audit | downstream tools may read one or the other; need to audit consumers first |
| Remove `.gitignore` entries for files that already exist (none found) | n/a | no actual issue |
| Compress historical screenshot directories to `.tar.gz` | screenshots can balloon repo | breaks browse-in-GitHub UX; needs eviction-vs-history call |
| Move `docs/codex-spark-audits/` (cycle 8, 9, 11 third-party audits) into `docs/artifacts/cycle-*/` properly | inconsistent layout | safe rename; out of mission scope |

## No-delete recommendation

**Cycle 30B does not delete anything.** Each removal candidate above requires:

1. A separate authorization from Torrey (not implicit).
2. A migration plan that preserves git-history searchability.
3. A test that downstream audits / `audit:route-inventory` / `audit:no-fabrications` / build still work.

Until those are explicit, the bias is **preserve evidence**.

## Recommended discipline for future cycles (no enforcement code this cycle)

| Discipline | Why |
|---|---|
| Every new `docs/artifacts/cycle-N-<topic>/` dir gets a `README.md` at its root with: cycle slug, date range, mission brief, files-list with one-line purpose each | makes cold-read of old cycles fast |
| Every cycle's commit message names the artifact directory explicitly | already done; keep doing |
| Every banner-correction docs (CUTOVER_PACKET, MIA_IDEAL, NEXT_SESSION_TRIGGER, ISA) cite the cycle that added the banner | already done; keep doing |
| Cycle reports in `MIA_SESSION_REPORT.md` reference the artifact dir, not duplicate contents | already done; keep doing |
| Use `git mv` (not delete + add) when restructuring so history follows | when restructure cycle fires |

## Future paste-ready cleanup prompt

See `future-prompt-bank.md` → "Cycle Z — Artifact/Report Bloat Cleanup" (optional, low priority, post-launch).

## DoD for Cycle 30B (this lane)

- [x] Inventory complete (no deletions)
- [x] Regenerated-vs-intentional classification done
- [x] Future cleanup candidates listed without endorsement
- [x] No-delete recommendation documented
- [x] No actual deletion this cycle
