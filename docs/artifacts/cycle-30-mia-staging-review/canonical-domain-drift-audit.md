# Cycle 30 — Canonical-Domain Drift Audit

**Audit date:** 2026-05-13 (Cycle 30 mission run)
**Authoritative source:** `docs/mia-client-decision-record.md` §"Production canonical" (lines 29-31)
**Source-of-truth code constants:** `src/lib/site.ts:14-15`

## Current canonical doctrine

| Layer | Value | Status |
|---|---|---|
| **Final production canonical** | `https://miasanabria.com` | locked by Mia 2026-05-13 (Cycle 24 Mia-Live-Decisions) |
| **Staging / public review** | `https://miasanabriarealtor.trueidea.com` | live (post-Cycle-29 deploy) |
| **Legacy Direct Axess surface (Mia's existing site)** | `https://miasanabriarealtor.com` | **DO NOT TOUCH** per project CLAUDE.md line 53. Will be 301-redirected to `miasanabria.com` post-cutover. Not the final canonical. |

## Why the canonical changed

Cycle 22 / Cycle 21 doctrine had `miasanabriarealtor.com` as the production-cutover target (move Mia's Direct Axess host to the new Next.js build at the same domain). On 2026-05-13 during Cycle 24, Mia decided the new build should land at her stronger domain `miasanabria.com` instead — the legacy `miasanabriarealtor.com` becomes a 301-redirect surface, not the canonical target.

This means any doc, report, or code constant authored **before 2026-05-13** that names `miasanabriarealtor.com` as the cutover target is **stale**. Anything authored or correctly updated **on or after 2026-05-13** should name `miasanabria.com`.

## Source-of-truth check

| File | Line(s) | Treats as | Status |
|---|---|---|---|
| `src/lib/site.ts` | 14-15 | `STAGING_URL = "https://miasanabriarealtor.trueidea.com"`, `PRODUCTION_URL = "https://miasanabria.com"` | **CORRECT** ✓ |
| `src/lib/site.ts` | 1-12 (doc header) | Cites Cycle 24 Mia-Live-Decisions for the switch | **CORRECT** ✓ |
| `src/lib/markets.ts` | 75 | Comment cites `miasanabria.com` (Mia's legacy React SPA — source of §1-verified hero quote per PUBLIC_FACT_LEDGER §1) | **CORRECT** ✓ (historical citation, not a canonical declaration) |
| `scripts/deploy-and-verify.ts` | 28 | `STAGING_BASE = "https://miasanabriarealtor.trueidea.com"` | **CORRECT** ✓ |
| `docs/mia-client-decision-record.md` | 29-31 | Names `miasanabria.com` as production canonical and `miasanabriarealtor.com` as legacy/prior canonical | **CORRECT** ✓ (this is the source-of-truth doc) |

**Conclusion:** all source code constants and the canonical decision record correctly reflect the Cycle 24 decision. Live HTML carries `<link rel="canonical" href="https://miasanabriarealtor.trueidea.com/">` (staging-scoped, correctly noindexed via `IS_STAGING`).

## Stale launch-doctrine documents (active risk)

These docs would actively misdirect a future cutover operator if they were trusted without cross-checking the decision record:

| File | Stale claim | Cycle 30 action |
|---|---|---|
| `docs/CUTOVER_PACKET.md` | Title and TL;DR name `miasanabriarealtor.com` as cutover destination; document is the operator's "single document to authorize cutover" | **BANNER ADDED** at top pointing to `mia-client-decision-record.md` and noting canonical changed to `miasanabria.com`. Body left as historical record (dated 2026-05-08) so the audit trail stays honest. |
| `docs/MIA_IDEAL_PRODUCTION_STATE.md` | Top blockquote says `Target: https://miasanabriarealtor.com (post-cutover production)`. §11 rows 11.2–11.5, 11.7 all name `miasanabriarealtor.com` as the cutover target. | **BANNER ADDED** at top pointing to `mia-client-decision-record.md` and noting target changed to `miasanabria.com`. §11 rows left as historical record — the **technical actions** (DNS A flip, Dokploy domain bind, NEXT_PUBLIC_SITE_URL build-arg, sitemap re-submit, TLS issue) are still correct; only the target host changed. A future cutover-rev cycle will re-write §11 against the live canonical. |
| `docs/NEXT_SESSION_TRIGGER.md` | Paste-prompt for "next session" names staging as the immediate target with `.com DNS swap` referring to `miasanabriarealtor.com`. If pasted into a fresh session post-Cycle-24, it would re-anchor on the wrong canonical. | **BANNER ADDED** at top noting the doc predates Cycle 24 + Cycle 30 and pointing to `mia-client-decision-record.md`. Recommend: replace this trigger with the Cycle 30 "Recommended next mission" (Phase 7 launch-blocker matrix). |
| `ISA.md` | §Vision (line 25) "ready for cutover to `miasanabriarealtor.com`"; §Out of Scope (lines 29, 32, 34) describe the legacy `miasanabriarealtor.com` Direct Axess surface as not-touched; §Decision Log entries dated 2026-05-06 and 2026-05-07 describe canonical as `miasanabriarealtor.com`. | **NO BANNER ADDED THIS CYCLE.** The Vision is stale; the Decision Log entries are honest dated history. ISA edits are larger-touch and belong in a future ISA-rev cycle, not this audit. Surfaced here as a future-mission item for Torrey: a focused ISA Vision + Out-of-Scope rev once `miasanabria.com` cutover lands. The risk of leaving ISA.md as-is is low because no operator runs cutover from ISA — they run it from `docs/CUTOVER_PACKET.md`, which now carries a banner. |

## Historical evidence (preserve as-is — no edits)

Every file below names `miasanabriarealtor.com` in dated historical context. These are **not edited** because (a) they're labeled by date and cycle, (b) they're the audit trail for what was true at the time, and (c) rewriting them would destroy the evolution record. Future readers can identify them as historical by their cycle prefix and by cross-referencing the current canonical via `docs/mia-client-decision-record.md`.

- `docs/CYCLE_*.md` — every cycle handoff doc (Cycle 4 through Cycle 19c)
- `docs/PRODUCTION_READINESS_HANDOFF_*.md` — cycle-dated readiness handoffs
- `docs/artifacts/cycle-19A-M/`, `cycle-19b-fl/`, `cycle-19b-fl-r1/`, `cycle-19c-copy/`, `cycle-20-*/`, `cycle-21-*/`, `cycle-22-*/`, `cycle-23-*/`, `cycle-25-*/`, `cycle-26-*/`, `cycle-27-*/`, `cycle-28-*/`, `cycle-29-*/` — every cycle-scoped artifact directory
- `docs/codex-spark-audits/` — cycle 8, 9, 11 audit team reports
- `docs/CODEX_SPARK_SYNTHESIS_REPORT.md`
- `docs/COMPLIANCE_GATE_2026_05_08.md`
- `docs/CDN_PREFLIGHT.md`
- `docs/BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md`
- `docs/BSS_REALTOR_GHL_INTEGRATION_PACKET_TEMPLATE.md`
- `docs/BSS_REALTOR_WEBSITE_DEPLOYMENT_TEMPLATE_V0.md`
- `docs/GHL_BLOG_INTEGRATION_DECISION.md`, `docs/GHL_INTEGRATION_OPTIMAL.md`
- `docs/LEAD_MAGNET_PDF_SPEC.md`
- `docs/MARKET_PAGE_COMPLETION_SCORECARD.md`
- `docs/RESEARCH_COMPLIANCE_LOGOS.md`, `docs/RESEARCH_MOBILE_A11Y.md`
- `docs/SEO_AEO_MARKET_AUTHORITY_MATRIX.md`
- `docs/ULTIMATE_FEATURED_MARKET_PAGE_STANDARD.md`
- `docs/CYCLE_15_INSIGHTS_*.md`, `docs/CYCLE_16_INSIGHTS_*.md` — early insights-feature cycle docs (also contain `Insights` references that pre-date Mia's Cycle 24 nav-label decision; non-nav, classification only)
- `docs/NEXT_SESSION_TRIGGER_AFTER_*.md` — superseded by newer `NEXT_SESSION_TRIGGER.md` (still active risk — banner added per above)

## Reports / generated artifacts (regenerated)

These are audit output, not authoritative doctrine. They regenerate from current code each run. No edit needed.

- `reports/audit-mobile-readability.{json,md}`
- `reports/audit-rendered-visual.json`
- `reports/qa-gate-matrix.{json,md}`

## CLAUDE.md (project) — already correct

Project `CLAUDE.md` line 53 names `miasanabriarealtor.com` as one of "Mia's existing surfaces" not to be touched. This is **correct** — it correctly describes `miasanabriarealtor.com` as Mia's legacy Direct Axess host (a do-not-touch surface), not as the final canonical target. No edit needed.

## Live HTML — already correct

Cycle 30 Phase 2 live verification confirmed:
- `<link rel="canonical" href="https://miasanabriarealtor.trueidea.com/">` — correctly staging-scoped
- `IS_STAGING = true` → `robots: noindex,nofollow` until DNS cutover
- No `miasanabria.com` or `miasanabriarealtor.com` strings leaked into live HTML where they would imply final-canonical status

## Net result

| Layer | Pre-Cycle-30 | Post-Cycle-30 |
|---|---|---|
| Source code constants | already correct | unchanged ✓ |
| Live HTML | already correct | unchanged ✓ |
| `docs/mia-client-decision-record.md` | already correct | unchanged ✓ |
| `docs/CUTOVER_PACKET.md` | stale launch target named in title + TL;DR | **banner added** pointing to decision record |
| `docs/MIA_IDEAL_PRODUCTION_STATE.md` | stale launch target named in header + §11 | **banner added** pointing to decision record |
| `docs/NEXT_SESSION_TRIGGER.md` | stale (predates Cycle 24) | **banner added** + supersede recommendation |
| `ISA.md` Vision + Out-of-Scope | stale launch target named | **no edit this cycle** — surfaced as future ISA-rev mission |
| Historical cycle docs/artifacts | dated historical record | unchanged (preserved as audit trail) |
| `CLAUDE.md` (project) | already correct (do-not-touch flag) | unchanged ✓ |

**Total edits this cycle:** 3 docs banner-prefixed + 0 source code changes + 0 generated reports changed. Net launch-risk reduced (no doc that an operator would consult for cutover now points at the wrong canonical).
