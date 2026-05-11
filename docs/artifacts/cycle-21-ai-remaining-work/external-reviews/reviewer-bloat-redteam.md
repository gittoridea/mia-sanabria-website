# Reviewer — Bloat Red-Team (BitterPillEngineering applied)

**Cycle:** 21-AI-REMAINING-WORK
**Reviewer:** Bloat Red-Team
**Date:** 2026-05-11
**Method:** BPE five-question test against each Tier A item + the four new artifacts.
**Inputs:** `final-synthesis.md`, `issue-matrix.md`, project `CLAUDE.md`, scripts dir, `docs/CUTOVER_PACKET.md`, `docs/BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md`, `src/components/IdxEmbed.tsx`.

## Verdict counts

| Classification | Count |
|---|---|
| KEEP | 9 |
| MERGE | 3 |
| DEFER | 3 |
| CUT | 3 |
| **Tier A total** | **18** |

## Top 3 to kill

1. **A15 — `docs/CUTOVER_RUNBOOK.md` (CUT, no questions).** `docs/CUTOVER_PACKET.md` (297 lines) + `docs/BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md` (the template the packet is built from) already cover this ground exhaustively. Adding a third doc named "RUNBOOK" violates BPE Q3 (redundant) and Q4 (one-off masquerading as doctrine) and trips the "documentation bloat" flag explicitly: three cutover docs is *worse* than two — operator has to choose which one to follow at 3am. **Pick a winner: keep the PACKET (Mia-specific) + CHECKLIST (template). The RUNBOOK is dead weight.**
2. **A14 — `scripts/cutover-smoke-test.ts` (CUT).** Cutover smoke is already encoded in two places: (a) `CUTOVER_PACKET.md §9` lists the exact bash loops (status-code sweep + headless screenshots + Lighthouse), (b) `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md §4` gives the full 10-probe sweep with copy-pasteable curl. Promoting that to a TS script means: (i) a new file to maintain, (ii) duplicated logic with `deploy-and-verify.ts` (which already handles cache-bust + Lighthouse), (iii) the script gets run once at cutover and then rots. BPE Q3 + Q4. The right move is to *extend* `deploy-and-verify.ts` with a `--target=production` flag (already named as a TODO in CUTOVER_PACKET §9.3) — not a new script.
3. **A16 — `scripts/audit-idx-iframe.ts` (CUT or radically downscope).** This is the cycle's nominated "durable promotion," but it locks 6 invariants on a **42-line component used in exactly one page** (`src/app/page.tsx`). BPE Q3 (redundant — a 5-line eyeball or a smoke-test grep would do the same), Q4 (one-off masquerading as doctrine — cycle 20 had ONE iframe-drift incident; n=1 is not a "recurrence pattern"), and Q1 (a smarter team would just put `// DO NOT MODIFY without audit:idx` at the top of the 42-line file and call it a day). If kept, downscope to 2 invariants (src URL host + referrerPolicy) and inline as a 20-line `grep` check inside `audit-completeness.ts` — do NOT spawn a new audit file with its own runner, package.json entry, and reporting surface. Promoting *audit-idx-iframe* burns the cycle's single-promotion budget on the lowest-leverage candidate when `audit-completeness footer-trust fan-out (A17)` is a SHARPEN of an existing audit that hits 51 routes for the same cost.

## Item-by-item BPE classification

| # | Item | Verdict | BPE rationale |
|---|---|---|---|
| A1 | Remove "same business day" promise | **KEEP** | Real honesty-contract violation per CLAUDE.md; 1-line fix; auditable via `audit-stale-terms`. Non-negotiable. |
| A2 | Insight aeoQ/A → FAQPage schema | **KEEP** | 12 pages get visible-AEO into machine-readable schema; mechanical; high ROI. |
| A3 | Market aeoAnswer → FAQPage schema | **MERGE into A2** | Same pattern, same fix shape, two adjacent file edits. Single PR-style commit. The matrix already presents them as a pair; treating as two items is just bookkeeping bloat. |
| A4 | Dedupe double FAQPage (5 hub pages) | **KEEP** | Google rich-results warning is real; `emitFaqSchema={false}` prop is the right shape. |
| A5 | MarketCard alt — wire `heroImageAlt` | **KEEP** | Data already exists in `src/lib/markets.ts`; this is plumbing a fact, not adding one. |
| A6 | PDF `download` + `(PDF)` marker | **KEEP** | A11y win; 1 component; passes BPE Q1 (model wouldn't infer this without spec). |
| A7 | IDX fallback link below iframe | **MERGE into A8/A10** | The IDX component is 42 lines. Doing A7+A8+A10 as one edit is the natural unit. Treating as three items inflates apparent cycle scope. |
| A8 | After-iframe handoff CTA | **KEEP (as IDX-wrapper bundle)** | Real lead-leak fix; closes Tier C-GHL gap without inventing endpoints. |
| A9 | Hidden `source` input + URL stamp script | **KEEP** | Carries `?source=idx-search` to mailto — useful regardless of GHL state. |
| A10 | IDX in-page MLS disclaimer | **MERGE into A8** | Same component, same paragraph region; one edit. |
| A11 | Contact submit `min-h-[44px]` | **KEEP** | Accessibility tap-target spec; deterministic; auditable. |
| A12 | `/insights/` to primary NAV | **KEEP** | 1-line array addition; no team objected; pure win. |
| A13 | Caddyfile X-Robots-Tag for PDFs | **DEFER** | Caddyfile lives in Dokploy, not the repo (per project CLAUDE.md). "Document the expected rule" in DEPLOY.md is fine *if DEPLOY.md exists* — `find docs -maxdepth 1 -name DEPLOY.md` returned nothing in this project. Either (a) ship the doc edit only if DEPLOY.md exists, or (b) defer until cutover when the Caddyfile is actually editable. As written, the item proposes documenting a rule that has no canonical home. BPE Q5 (vague). |
| A14 | `scripts/cutover-smoke-test.ts` | **CUT** | See "top 3 to kill" #2. Redundant with CUTOVER_PACKET §9 + CHECKLIST §4 + `deploy-and-verify.ts`. |
| A15 | `docs/CUTOVER_RUNBOOK.md` | **CUT** | See "top 3 to kill" #1. Third cutover doc on a site that already has PACKET + CHECKLIST. Pure documentation bloat. |
| A16 | `scripts/audit-idx-iframe.ts` | **CUT** (or downscope to a 20-line grep in audit-completeness) | See "top 3 to kill" #3. 6 invariants on a 42-line single-use component is over-engineering; n=1 incident is not a recurrence pattern. |
| A17 | `audit-completeness` footer-trust fan-out | **KEEP (this is the right promotion)** | SHARPENS an existing 723-line audit from 4-5 sampled routes to all 51. Single-line conceptual change (`listBuiltRoutes()`). This is the audit promotion that should win the cycle's "1 durable change" budget — NOT A16. |
| A18 | Drop `/404/` canonical | **KEEP** | 1-line metadata removal; real schema correctness fix. |

## New-artifact attack (BPE-style)

### `docs/CUTOVER_RUNBOOK.md`

| Question | Answer |
|---|---|
| Will this be read again? | Read **once**, at cutover, by an operator who already opened `CUTOVER_PACKET.md` (Mia-specific, 297 lines, 11 sections covering every cutover concern). |
| Does it duplicate existing docs? | **Yes.** `CUTOVER_PACKET.md` + `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md` cover this exhaustively. The PACKET is the Mia-instance of the CHECKLIST template. A RUNBOOK is a third doc with the same intent. |
| Catches a recurrence? | No. There's been **zero** prior cutover incident — site hasn't cut over yet. This is anticipatory doctrine for an event that hasn't happened. |
| Violates 1-per-cycle? | Yes if counted as the promotion (it's marked `audit | …` candidate). |

**Verdict: CUT.** If anything is missing from PACKET/CHECKLIST, *edit those*. Don't add a third.

### `scripts/cutover-smoke-test.ts`

| Question | Answer |
|---|---|
| Will this be read again? | Once per cutover. Then it rots — no recurring trigger. |
| Does it duplicate? | **Yes.** `deploy-and-verify.ts` (231 lines) already does cache-bust + Lighthouse + status sweep. `CUTOVER_PACKET.md §9` already lists the exact bash. `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md §4` already lists 10 probes with copy-pasteable curl. |
| Smarter team move? | Add a `--target=production` flag to `deploy-and-verify.ts`. Three additional lines, zero new files. |
| Test infra maintenance burden? | New script = new failure surface; CI doesn't run cutover smoke; rot is guaranteed. |

**Verdict: CUT.** Extend `deploy-and-verify.ts` instead — that's where the cache-bust + Lighthouse logic already lives.

### `scripts/audit-idx-iframe.ts`

| Question | Answer |
|---|---|
| Catches a real recurrence? | **No.** Cycle 20 had a single iframe-attribute incident. n=1 is not a pattern. The component is 42 lines, used in exactly one place (`src/app/page.tsx`). |
| Already covered? | Partially — `audit-no-fabrications.ts` and `audit-completeness.ts` already grep rendered HTML. A 10-line grep block in either file would lock the `src=` host + `referrerPolicy` invariants. |
| Worth the single-promotion budget? | **No.** A17 (footer-trust fan-out: 4 routes → 51 routes) is a bigger SHARPEN with smaller surface than promoting a new audit file. |
| Test infra maintenance burden? | New audit = new package.json script + new exit-code surface for `audit:all`. 6 invariants locked on a component where 1 (`src=` host) carries 90% of the value. |

**Verdict: CUT or DOWNSCOPE.** If the iframe URL host is load-bearing for compliance, add a 5-line check inside `audit-completeness.ts` or `audit-no-fabrications.ts`. Don't spawn a new audit file for a 42-line single-use component.

### `scripts/audit-source-jsx-patterns.ts` (mentioned in synthesis)

Final synthesis explicitly defers this one with "false-positive risk." Reviewer agrees: **DEFER permanently** unless a real pattern emerges.

## One-promotion-per-cycle audit

Cycle 20-R1 added the rule: "Promote at most ONE durable change per cycle." The synthesis attempts to satisfy this by nominating `audit-idx-iframe.ts` as the promotion, but the plan also ships:

- A14 `cutover-smoke-test.ts` (new script, durable)
- A15 `CUTOVER_RUNBOOK.md` (new doc, durable)
- A17 `audit-completeness` fan-out (existing audit edit — claimed as "SHARPEN, not promotion")

That's **3 durable additions + 1 SHARPEN** dressed as one promotion. The rule's intent is to keep the system small. Even if A14 and A15 are classified as "cutover infra" rather than "doctrine," they're files that will live in the repo forever and must be re-read or re-deleted in future cycles. The synthesis is gaming the rule by category-juggling.

**Reviewer recommendation: actually pick ONE.**

- Promote: **A17 — `audit-completeness` footer-trust fan-out.** Single-line conceptual change; sharpens an existing 723-line audit from sampled to comprehensive; touches all 51 routes; the highest-leverage durable change in the cycle.
- Cut A14, A15, A16.
- Treat A1-A12 + A18 as **content/component fixes** — they aren't doctrine promotions and don't count against the cap.

## Over-implementation risk

- **A8/A9/A10** as written specs a "new client component" for URL-param stamping and a separate "tiny `<Script>`" in layout.tsx. Pick one — both is over-engineered for stamping `?source=idx-search` into a hidden input. A 6-line inline `<Script>` in `layout.tsx` is sufficient.
- **A4** specifies `emitFaqSchema={false}` *prop* on AnswerFirst. Consider whether the inverse — make AnswerFirst NEVER emit, and require pages to opt in — is cleaner. Don't lock a default-true prop into a component used on 5+ hub pages without thinking through the inversion.
- **A16** locks 6 invariants on a 42-line file. Lock 1-2 max if kept at all.

## Documentation bloat flags

- `CUTOVER_RUNBOOK.md` (proposed) duplicates `CUTOVER_PACKET.md` (297 lines) + `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md`.
- `DEPLOY.md` (referenced by A13 but does NOT exist in `docs/`) — A13 proposes documenting a Caddyfile rule in a doc that has no canonical home.
- Per cycle 20-R1 Reviewer H: 7-bullet closeout should be compressed to 3 load-bearing bullets. Synthesis still uses the full 7-bullet form. Recommend adopting the H compression in this cycle's closeout.

## Test infrastructure that will rot

- `scripts/audit-idx-iframe.ts` — runs only inside `audit:all`; locks 6 invariants on a single-use 42-line component; first time IdxEmbed.tsx changes intentionally, audit owner has to think about whether to update 6 invariants or weaken them.
- `scripts/cutover-smoke-test.ts` — runs once at cutover. Between cutover and the next cutover (which, for this project, is **never** — there's one production cutover), the script is dead code.

## Items that pass BPE cleanly (KEEP without caveat)

A1, A2 (with A3 merged), A4, A5, A6, A11, A12, A17, A18.

## Items requiring scope merge

A3 → merge into A2. A7 + A10 → merge into A8. A9 → fold into A8 bundle as same-component edit.

## Items to defer

A13 (no DEPLOY.md home), A14 (extend `deploy-and-verify.ts` instead), A15 (use PACKET + CHECKLIST).

## Items to cut outright

A14, A15, A16 (or radically downscope A16).

## Recommended cycle scope (post-bloat-cut)

**11 content/component fixes (no promotion budget):** A1, A2+A3 merged, A4, A5, A6, A7+A8+A10 merged, A9, A11, A12, A18.

**1 audit promotion (uses the cycle budget):** A17 (`audit-completeness` footer-trust fan-out).

**3 deferred:** A13, A14, A15.

**1 cut:** A16.

**Net result:** Cycle ships the high-ROI fixes, honors the 1-promotion rule cleanly, and adds zero new files. The single durable change is a sharpened existing audit.

## BPE summary

The cycle synthesis is mostly clean — Tier A correctly excludes mailto/GHL invention, correctly defers Tier B/C. The bloat is concentrated in the "infra/audits" batch (#15-19 of the implementation plan), which proposes **2 new docs + 2 new scripts + 1 audit edit** under the cover of "infra prep." That's where the BPE blade cuts. The body of work (text/schema/a11y fixes) is fine — it's the durable-artifact proliferation that needs trimming.
