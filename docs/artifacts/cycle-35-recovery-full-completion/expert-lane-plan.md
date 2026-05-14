# Cycle 35 — Expert-Lane Plan

**Phase 3 deliverable.** Honest operator-mode plan.

## Honesty about delegation

The mission brief lists 12 expert lanes. The PAI agent ecosystem on this host supports
spawning Forge/Engineer/Cato/etc. subagents, but the work needed here is mostly:

- A narrow audit-script edit (Phase 4).
- A series of small JSX/data tweaks (Phase 10, 12, 13).
- Audits and screenshot captures (Phase 5, 14, 17).

Subagent spawning is appropriate for cross-vendor verification on E4/E5 deliverables
(Algorithm v6.4.0 Rule 2a) and for parallel research; it is not the right vehicle for
small in-repo edits where context loading would exceed the actual work. **The lanes
below are executed as named passes by the primary executor**, with one exception: a
Forge cross-vendor pass is queued for Phase 15 final validation if budget permits.

This mirrors Cycle 34's honest substitution disclosure
(`docs/artifacts/cycle-34-world-class-completion/expert-lane-findings.md` Lane Operator
Mode), and is consistent with the brief's instruction: "Use actual subagents only if
available and reliable. Otherwise use manual named passes and document honestly."

## Lanes

| Lane | Operator | Primary phases | Acceptance gate |
|---|---|---|---|
| Recovery Commander | primary | 0–7 | recovery deploy lands, `South Florida Lifestyle` needle present on staging |
| Brand Audit Engineer | primary | 4 | `audit:brand` exits 0 without `--no-preflight`, exception is narrow + semantic |
| Release Engineer | primary | 5, 6, 16, 17 | `deploy-and-verify` exits 0, last-modified + etag flip |
| Neighborhood Information Architect | primary | 8, 9, 10 | every approved slug satisfies brief schema or has a sourced gap row |
| Luxury Real Estate UX Director | primary | 12, 13 | hub + detail pages, vertical rhythm, CTA hierarchy, no thin pages |
| Local SEO / Content Truth Editor | primary | 10, 13 | metadata complete, no school/safety/ranking risk, source notes recorded |
| Compliance / Fair Housing / Brokerage Editor | primary | 10, 13, 15 | `audit:no-fabrications` clean, honesty contracts in `CLAUDE.md` respected |
| Image Director / Provenance Officer | primary | 11 | every neighborhood image classified + provenance tagged; no unlicensed/hotlinked assets |
| Image Generation Operator | primary | 11 | one-sample checkpoint executed only if a real gap requires it |
| Bridge Demo Honesty Custodian | primary | 4, 7, 17 | `BRIDGE_DEMO_MODE` true → demo banner + DEMO badge + "Inquiry disabled" all render; demo warning colors preserved |
| Performance / Accessibility Engineer | primary | 14, 17 | `audit:mobile-readability` exits 0 against staging |
| Visual QA Reviewer | primary | 7, 14, 17 | Playwright captures all approved + reference + system routes at 375×812 and 1280×800 |
| (optional) Cato cross-vendor auditor | Forge / GPT-5.4 | 15 | spawned only if budget allows after final validation |

## Per-lane closeout schema

Each lane writes its closeout into `expert-team-findings.md` under its name:

```yaml
closed_now:       [...]   # list of files changed or audits passed by this lane
prepared_now:     [...]   # work staged but not closed (pointers to follow-up)
blocked_external: [...]   # external owner + what they need to do
risks_found:      [...]   # any new risk surfaced this cycle
files_touched:    [...]   # exact paths
validation:       [...]   # exact audits / probes that confirm closure
```

## Decision rules

- **Build-over-ask** on reversible, AI-closeable items (per global `CLAUDE.md`).
- **Stop and document** when a real external blocker appears (per the brief).
- **No production writes** (DNS / GHL / Google / Bridge dashboards).
- **No secret printing** (per Hard security rules).
- **No `--no-preflight`** unless a semantic fix proves impossible.
- **Single coherent commit per phase pair** (brand-audit recovery; then full implementation).
