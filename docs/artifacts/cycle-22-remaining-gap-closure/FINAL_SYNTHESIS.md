# Cycle 22 — Final Synthesis (Team 10)

> **Outcome:** every remaining Mia-website gap is now mapped to exactly one unblocker. Zero AI-doable safe fixes pending. Five reviewable packets cover every blocker on Mia, GHL, Google measurement, legal, and DNS cutover.

## 1. Cycle 22 disposition rollup

| Category | Count | Where they live |
|---|---|---|
| Closed by AI this cycle | 0 source edits | (no live changes — all open items required principal/credential/legal input) |
| AI-doable next cycle (queued) | 13 | `remaining-work-register.md` + targeted next-cycle prompts in each packet |
| Needs Mia / principal decision | 9 | `MIA_DECISION_PACKET.md` |
| Needs GHL endpoint / auth / test plan | 10 | `GHL_READY_PACKET.md` + `GHL_FIELD_MAP_FINAL.md` + `GHL_TEST_PLAN.md` |
| Needs Google Analytics / Search Console / GBP access | 6 | `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` |
| Needs legal / compliance review | 7 | `LEGAL_COMPLIANCE_PACKET.md` |
| Needs launch / cutover access | 4 | `LAUNCH_CUTOVER_READY_PACKET.md` |
| Should be discarded / already resolved | 5 | recorded as `discard` rows in `remaining-work-register.md` |

## 2. The single sentence

> Every remaining Mia-website issue is one of: (a) a decision Mia/Torrey owns, (b) a credential or endpoint Torrey provisions, (c) a counsel/broker/external filing, or (d) a DNS cutover event — and each has a packet that names exactly what unblocks it.

## 3. Recommended ordering of next cycles

The packets are independent enough to run in parallel, but the natural order that minimizes rework is:

**Cycle 23a — MIA DECISION CALL** *(30-45 min, no code).*
- Walk `MIA_DECISION_PACKET.md` with Mia.
- Capture decisions for §1–§10.
- Routes outputs to: Cycle 23b (copy + homepage edits), Cycle 23c (GHL prep), Cycle 24 (cutover).

**Cycle 23b — APPROVED-COPY + DOMAIN CONSENSUS** *(small code cycle).*
- Apply Mia §1 homepage triad alignment across 4 files.
- Apply Mia §2.1–§2.5 miaQuote rewrites.
- Apply Mia §3 production-domain canonical decision to `src/lib/site.ts` and downstream docs.
- Apply Mia §6/§6b/§7/§8/§9/§10 if any source edits land.
- Ship overclaim-adjective extension to `audit-no-fabrications.ts` calibrated to the approved copy.
- Bundled commit + deploy + ETag verify.

**Cycle 24 — LEGAL CLOSURE** *(documentation cycle).*
- Counsel returns track-changes on `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/`, TCPA consent, PDF disclaimers, scope-of-advice.
- Mia returns DBPR + NAR confirmations.
- LPT returns broker-of-record + MLS reciprocity text.
- Update site copy + render PDF disclaimer pages.
- DMCA / USCO designated-agent finalization.

**Cycle 25 — GHL ACTIVATION** *(major code cycle).*
- Preconditions: Torrey provisions GHL env; counsel approves TCPA copy (Cycle 24).
- Implement `src/lib/ghl.ts`; wire `/contact/` + `/valuation/`; honeypot + Turnstile; test-mode → live-mode.
- Run 10-step test plan from `GHL_TEST_PLAN.md`.

**Cycle 26 — DNS CUTOVER** *(coordination cycle).*
- All prerequisites green: Mia §3 domain decision, Mia §4 email decision, all Legal §5–§14 closed, GHL working in test mode.
- Run `LAUNCH_CUTOVER_READY_PACKET.md` go/no-go checklist.
- DNS flip + Search Console + sitemap.
- Smoke-test sweep.

**Cycle 27 — GA4 + GBP ACTIVATION** *(post-stability cycle).*
- Wait 24-48h post-cutover for DNS stability.
- Inject GA4 (and optionally GTM) via `<Script>` in `src/app/layout.tsx` gated by `!IS_STAGING && NEXT_PUBLIC_GA_ID`.
- Mia claims/edits GBP.
- Verify in GA4 DebugView + GBP listing.

**Cycle 28 — A11Y/PERF DEEP PASS** *(on a dev workstation with chrome + lighthouse CLI).*
- Lighthouse Core Web Vitals.
- axe-core CLI deep scan.
- pa11y crawl.
- Address any remaining defects.

Total: 5-7 cycles from here to launch + measurement, depending on dependency wait times.

## 4. What this cycle proved

- The post-Cycle-21 site is already launch-quality at the audit level (20 audits green; 0 critical; 0 high P0).
- Every remaining gap is a *coordination problem*, not an *implementation problem*. The implementation work is small once the coordination happens.
- The Forge race scope drift was avoided by running all 10 "teams" as packet-writing rather than parallel coding agents. (See `qa-infrastructure-closure.md` § 5 for the "no promotion" justification.)

## 5. Reviewer council outputs

Cycle 22 ran narrower than Cycle 21 because the cycle's primary work was packet authorship, not code. External reviewer scope:

| Reviewer | Scope | Verdict capture |
|---|---|---|
| Codex Spark | Reviewing safe-fix diff AND GHL/GA readiness packets for implementation completeness | `external-reviews/codex-spark-review.json` (see VERIFY phase) |
| Cato | Narrow compliance review — miaQuote replacement candidates + Legal packet TCPA / REALTOR® / EHO / MLS sections + PDF disclaimer recommendation | `external-reviews/cato-compliance-review.json` (see VERIFY phase) |
| Gemini | Skipped — zero visual changes this cycle (documentation-only) | tombstoned in ISA Decisions |

## 6. The 5 packets — at-a-glance

| Packet | Lines | Key open questions |
|---|---|---|
| `MIA_DECISION_PACKET.md` | ~175 | 14 decisions, all with recommended defaults |
| `GHL_READY_PACKET.md` + `GHL_FIELD_MAP_FINAL.md` + `GHL_TEST_PLAN.md` | ~430 combined | 9 env vars + 31 fields + 10-step test |
| `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` | ~135 | GA4 ID + GTM optional + Search Console + GBP |
| `LEGAL_COMPLIANCE_PACKET.md` | ~165 | 14 items, classified into 4 buckets, one question each |
| `LAUNCH_CUTOVER_READY_PACKET.md` | ~205 | DNS + canonical + sitemap + GA4 timing + GBP + email + smoke + rollback + 13-box go/no-go |

## 7. Cycle 22 in one number

**Items mapped vs unmapped:** 51 / 51 (100%). Zero open work items lack a packet home.
