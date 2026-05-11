# Reviewer A — Existing-Infrastructure Mapper

- **Reviewer:** A — Existing-Infrastructure Mapper
- **Files inspected:**
  - `/home/torrey/code/mia-sanabria-website/CLAUDE.md` (63 lines, full read)
  - `/home/torrey/code/mia-sanabria-website/ISA.md` (section header grep only — 65 `^## ` matches; Decisions/Changelog/ISC-additions/Follow-up tasks dominate)
  - `/home/torrey/code/mia-sanabria-website/docs/CYCLE_19C_COPY_DOCTRINE.md`
  - `/home/torrey/code/mia-sanabria-website/docs/CYCLE_19C_COPY_HANDOFF.md`
  - `/home/torrey/code/mia-sanabria-website/docs/NEXT_SESSION_TRIGGER.md`
  - `/home/torrey/code/mia-sanabria-website/docs/CYCLE_18_PROCESS_UPGRADE_REPORT.md`
  - `/home/torrey/code/mia-sanabria-website/docs/artifacts/cycle-20-agency-qa/final-pm-synthesis.md`
  - `/home/torrey/code/mia-sanabria-website/docs/artifacts/cycle-20-agency-qa/issue-matrix.md` (lines 1-120; legend + Top-6-Levers + matrix tables)
  - Directory listing: `docs/CYCLE_*_PROCESS_UPGRADE_REPORT.md` (7 files: 9, 11, 12, 13, 15, 16, 18 — no 14, 17, 19, 20)
  - `docs/BSS_REALTOR_CLIENT_REVIEW_PACK_TEMPLATE.md` + `docs/BSS_REALTOR_GHL_INTEGRATION_PACKET_TEMPLATE.md` (grep only — no closeout pattern in either)

- **Finding:** The repo already carries closeout-like content in two distinct surfaces. (1) `docs/CYCLE_*_PROCESS_UPGRADE_REPORT.md` is the de-facto closeout series — 7 files exist, each ~5-12k lines of prose lessons + queued improvements (Cycle 18 has 4 lessons + a Cycle 19 backlog). (2) `CYCLE_19C_COPY_HANDOFF.md` ends with a six-bucket "Remaining blockers" taxonomy that maps 1:1 to the owner-type legend in `issue-matrix.md`. The series is discontinuous (skips 14, 17, 19, 20) — no canonical doc enforces "every cycle ships one." CLAUDE.md (63 lines, terse, invariants-only) carries no closeout protocol today.

- **Recommended minimal change:** **A — append a `## Cycle closeout learning rule` section to CLAUDE.md.** A 7-bullet protocol with closed enumerations is exactly the kind of project-invariant that CLAUDE.md is already shaped for (see the existing "Honesty contracts" and "Audit gates" sections). It auto-loads every session, costs ~25 lines on a small file, and creates the missing forcing function that the discontinuous PROCESS_UPGRADE_REPORT series proves is absent.

- **Bloat risk:** **low** — CLAUDE.md is currently 63 lines of invariants; +25 lines stays well under the project-CLAUDE.md prudence ceiling (~150 lines) and the new section uses the same bullet style as existing sections.

- **Promotion target:** **CLAUDE.md**

- **Owner category:** **tool/process defect** (owner-type 2 from issue-matrix.md legend — "fixable in tooling")

- **Confidence:** **0.85**

- **Should main thread act:** **yes**

- **Justification one-paragraph:** CLAUDE.md is the only surface in this repo that auto-loads every Claude Code session and already enforces invariants in the exact bullet style the protocol requires. The PROCESS_UPGRADE_REPORT series is the right place to write closeout *content* per cycle, but nothing currently mandates writing one — that mandate belongs in CLAUDE.md as a one-time rule. Templates (BSS_REALTOR_*) target client deliverables, not internal cycles. A new docs/CYCLE_CLOSEOUT_TEMPLATE.md would itself need a CLAUDE.md pointer to ever fire. ISA.md is wrong shape (252KB, append-only, not rule-bearing). Embed the rule once in CLAUDE.md; the protocol body lives there; per-cycle artifacts continue to land in docs/.
