# BSS AI-OS — Deterministic Processes V0

> Three processes extracted from the Mia Sanabria realtor build (this repo, 2026-05-04 → 2026-05-07).
> Each is deterministic — same inputs, same outputs — so future BSS client sites compress to fewer human steps.
> "AI-OS" = the operator + AI assistant working through the same loop. Each step names whether the AI or the human is the actor.

---

## Process P1 — Ideal-State Diff

**One-line:** Articulate the ideal state, probe the current state, classify every gap, then act on what's safe.

**When to invoke:** at the start of every BSS client engagement, again after every Mia/Brian/client review, again before every cutover.

**Inputs:**
- A defined target surface (URL or repo).
- The relevant fact ledger (or a stub if none).
- Any prior ISA for this surface.

**Steps (deterministic, in order):**

| # | Actor | Step | Probe / Output |
|---|-------|------|----------------|
| 1 | AI | Read project ISA + fact ledger if they exist; if not, scaffold | `~/.claude/skills/ISA/` Scaffold workflow |
| 2 | AI | Author `docs/<CLIENT>_IDEAL_PRODUCTION_STATE.md` with the 11-axis matrix (page architecture, compliance, IDX/MLS, SEO/AEO/GEO, conversion, GHL, analytics, performance, client review, launch, rollback) | this repo's `docs/MIA_IDEAL_PRODUCTION_STATE.md` is the worked example |
| 3 | AI | Run preflight probes against the live surface: route sweep, sitemap/robots/manifest 200, security headers via `curl -I`, all audit scripts on the local `out/` | `bun run audit:all` |
| 4 | AI | Author `docs/<CLIENT>_CURRENT_TO_IDEAL_GAP_MATRIX.md` — one row per ideal-state target with a Class column (P0/P1/P2/GATED/APPROVAL/AUTOMATE) and an Evidence column citing what was probed | this repo's `docs/MIA_CURRENT_TO_IDEAL_GAP_MATRIX.md` |
| 5 | AI | Filter rows for "safe-to-act" — typo, a11y, broken link, metadata/canonical/sitemap/robots, schema correctness, generic compliance language, audit-script improvement, doc-only deliverable | manual class filter |
| 6 | AI | Apply each safe-to-act fix; rebuild; re-run `audit:all` | `git diff` is the proof |
| 7 | Human | Approve or queue every GATED / APPROVAL row | written confirmation persisted into ledger or ISA Decisions |
| 8 | AI | Append ISA Decisions / Changelog / Verification entries describing what shipped, what was deferred, why | `Skill("ISA", "append ...")` |

**Outputs:** two documents (`*_IDEAL_PRODUCTION_STATE.md` + `*_CURRENT_TO_IDEAL_GAP_MATRIX.md`), a code diff, an ISA update.

**Exit criteria:** every Class column row is one of `closed | deferred-with-reason | gated | approval-pending | automate-queued`. None remain `unknown`.

**Escalation rule:** if any P0 row is GATED or APPROVAL — the engagement is blocked until resolved; this surfaces in the gap-matrix Summary block.

**Empirical source:** built and run on Mia Sanabria's repo on 2026-05-07 — preflight surfaced 18/18 routes 200, baseline audits clean, then the ideal-state articulation surfaced the **hreflang** miss + the **title/description length** misses that audits had not previously caught. Adding `audit:seo` upstreamed the catch into the build.

---

## Process P2 — Ten-Minute Leverage Scout

**One-line:** A timeboxed search for the smallest fix in three categories: time-saving, risk-reducing, reusability-increasing.

**When to invoke:** mid-sprint, before deciding the next 30 minutes of work; or whenever the project ISA is in `verify` and there's a question of "what's worth doing now vs deferring".

**Inputs:**
- Current ISA Verification status (which ISCs are `[x]`, `[ ]`, `[DEFERRED-VERIFY]`, `[PENDING]`).
- Recent commit history (`git log --oneline -20`).
- Any operator pain points raised in the last session.

**Steps (deterministic, in order):**

| # | Actor | Step | Probe / Output |
|---|-------|------|----------------|
| 1 | AI | Set a 10-minute timer (literal — `bun run` a stopwatch or note the wall-clock start) | start timestamp |
| 2 | AI | Scan the project for **time-saving** candidate: a manual step that runs ≥ 3 times per engagement and could be a one-line bash + script | exemplar: `bun run audit:all` chains 4 audit scripts so a single command runs them all |
| 3 | AI | Scan for **risk-reducing** candidate: a category of mistake the operator has actually made (in this ISA's Changelog, in feedback memory, or in the user's bug reports) and could be auto-prevented | exemplar: `audit-stale-terms.ts` was added after Klein Morgan residue almost shipped; `audit-seo.ts` was added 2026-05-07 after title-length misses surfaced during ideal-state diff |
| 4 | AI | Scan for **reusability-increasing** candidate: code or doc currently single-use that could become multi-client with one rename + one extraction | exemplar: this repo's `docs/BSS_REALTOR_*` template set was extracted from Mia's build for the exact reason |
| 5 | AI | Score each candidate 1–10 on (impact ÷ effort) where effort is "minutes" | three integers |
| 6 | AI | Pick the highest-score candidate and ship it inside the same 10-minute window — no scope creep | the diff |
| 7 | Human | Receives the diff + a one-line "what changed and why" | merge or revert |
| 8 | AI | If the timer is reached and nothing shipped, log the candidates as ISCs in the ISA so they're not forgotten | ISA Decisions entry |

**Outputs:** at most one shipped fix + a "remaining candidates" log entry.

**Exit criteria:** either (a) one fix shipped within the 10-minute box, or (b) the candidates are persisted as ISCs and the box closes.

**Escalation rule:** any candidate that scores ≥ 8 on impact-per-effort is surfaced to the operator regardless of whether it shipped this round — that's a flag the system is leaving free leverage on the table.

**Empirical source:** the `audit:seo` script is the artifact of running this scout on Mia's repo 2026-05-07 — an estimated 5-minute build paid for itself the same hour by catching 48 metadata gaps that would have surfaced on Mia's review desk.

---

## Process P3 — Production Readiness Gate

**One-line:** A nine-axis pass/fail gate that must clear before any BSS client surface is offered for cutover or signoff.

**When to invoke:** before every `phase: complete` on a project ISA, before sending a review pack to a client, and before flipping DNS to production.

**Inputs:**
- The current `out/` build of the surface.
- The live staging URL.
- The fact ledger.
- The client review pack template.

**Steps (deterministic, all axes; no skipping):**

| Axis | Probe | Pass Threshold | Tool / Source |
|------|-------|----------------|---------------|
| 1. Compliance | `bun run audit:stale` exits 0 | 0 hits on stale-residue + FREC superlative + Fair Housing steering patterns | `scripts/audit-stale-terms.ts` |
| 2. SEO/AEO | `bun run audit:seo` exits 0 | per-page title ≤ 60, description ≤ 160, single h1, hreflang+canonical+OG+twitter, body ≥ 150 words on non-404 | `scripts/audit-seo.ts` |
| 3. IDX/MLS | CSP `frame-src` whitelists MLS host AND IDX iframe loads under HTTPS | live curl + manual MLS surface check | `Caddyfile` + manual |
| 4. Forms | every form `action=` is a placeholder OR the live GHL endpoint mapped in approved packet | grep `<form` + `action=` | repo + GHL packet |
| 5. Analytics | tracking IDs exist in code only behind feature flag OR not yet injected; no live IDs in shipped HTML on staging without explicit Torrey approval | curl + grep | `src/lib/<client>.ts` `tracking` block |
| 6. Performance | Lighthouse Performance ≥ 90 on Home, About, Contact (run from PageSpeed Insights against staging URL) | report screenshots | manual run |
| 7. Accessibility | axe-core has 0 errors on Home, About, Contact (or noted exceptions with remediation date) | report screenshots | manual run |
| 8. Security | `curl -I` shows HSTS (≥ 1 yr), CSP, X-Frame, X-Content-Type, Referrer-Policy, Permissions-Policy | live HEAD probe | `Caddyfile` |
| 9. Client Approval | every `*GATED on Client*` row in the gap matrix has a written confirmation | review pack signoff | client review pack |
| Rollback | rollback recipe is documented for each of code, deploy, env-var, DNS | `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md` is present and accurate for this client | docs |

**Outputs:** a single PASS/FAIL verdict + an evidence row per axis.

**Exit criteria:** all 10 axes (9 + Rollback) PASS. Any FAIL blocks `phase: complete` until remediated.

**Escalation rule:** axes 1–2 + 8 are AI-runnable and must clear without operator intervention. Axes 3–4 + 9 are human-gated. Axes 5–7 + Rollback are "AI prepares evidence, human signs off". The verdict is recorded on the ISA `## Verification` section as `Production Readiness Gate: PASS @<commit>` or `FAIL @<commit> — <axis>: <reason>`.

**Empirical source:** Mia's 2026-05-07 sweep cleared axes 1, 2, 8 fully via the audit chain; axes 5–7 are queued for the live staging URL run; axes 3, 4, 9 wait on Mia confirmation; rollback documented in `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md`.

---

## How the three processes compose

- **P1** is the **macro** loop — runs once per engagement and once per major review.
- **P2** is the **micro** loop — runs many times per sprint, inside any P1 cycle.
- **P3** is the **terminal** gate — one shot, just before signoff or cutover.

When the AI-OS is operating well, P2 generates audit scripts that strengthen P3, and P3's failures generate new ideal-state rows for P1. The loop tightens with every client.
