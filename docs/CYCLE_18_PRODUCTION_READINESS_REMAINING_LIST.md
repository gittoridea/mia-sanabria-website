# Cycle 18 — Production-Readiness Remaining

**Date:** 2026-05-10
**Mission Phase:** P13
**Total open items:** 18 (unchanged from Cycle 17 close — Cycle 18 closed 4 site/content defects, did not introduce new external blockers, did not change the state of any external category)

## Categorization

### A — Site / design / content ready (no remaining defects this cycle)

✅ **Cycle 18 closed:**
- ✅ Visible "Updated …" date label removed from blog UI; schema-side `dateModified` preserved.
- ✅ Fort Lauderdale page deepened to V4 standard with research-backed opening, expanded due-diligence framework, expanded buyer + seller playbooks, Buyer's comparison cohort, 2 new FAQs.
- ✅ Hillsboro Mile moved out of "South Florida cities and towns" without geographic inaccuracy; renamed cluster section preserves intent.
- ✅ Pompano Beach added as full primary market with hero image, OG, schema, sitemap, internal links, FAQs.
- ✅ Audit chain extended: `audit:fort-lauderdale-standard` (V4 markers + V3-as-subset + 2 anti-checks) + `audit:insights` `checkBuiltHtmlNoVisibleUpdatedLabel` per-post probe.
- ✅ Source-ledger discipline: every Cycle 18 research-backed claim traces to a row in `docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md` Part C.

🟡 **Carry-forward, NOT a cycle defect:**
- 🟡 `audit:completeness.forms.classification` — 2 mailto forms (`/contact/`, `/valuation/`). Pending GHL form wiring (Category D below).
- 🟡 `audit:rendered.viewportSanity` — chrome `--dump-dom` mobile-clamp limitation. Documented in Cycle 16 process upgrade.
- 🟡 `audit:legal.dmca.uscoFlag` — USCO DMCA designated-agent registration pending principal action (Category C below).

### B — Needs principal decision (carried forward from Cycle 17, unchanged)

| # | Card | Status | Owner |
|---|---|---|---|
| B1 | License rendering — DBPR-verified license # OR explicit "stay current" with unverified flag | OPEN | Principal |
| B2 | Analytics provider — pick GA4 / Plausible / Umami; provide measurement ID | OPEN | Principal |
| B3 | Branded email — pick provider (Google Workspace / Zoho / Fastmail); provide MX + initial inbox | OPEN | Principal |
| B4 | `.com` cutover sign-off — DNS swap from current Direct Axess host to staging URL; 301 redirect plan | OPEN | Principal |
| B5 | Service-area expansion — confirm Palm Beach proper + non-Eastern variants OR retain "Eastern Fort Lauderdale / Eastern Boca Raton / Eastern Delray Beach" canonical | REVIEW (carried forward from Cycle 17) | Principal |
| B6 | Userway widget activation — load script or null the ID | REVIEW | Principal |
| B7 | Quarterly client-list cap — re-add if confirmed in writing | REVIEW | Principal |
| B8 | Global listing distribution affiliate — re-add with named partner if applicable | REVIEW | Principal |
| B9 | About meta-tag service-area drift (Forge VERIFY surfaced Cycle 17) — `SITE.tagline` / `MIA.tagline` / `Hero` defaults drop "Eastern" qualifier on Boca/Delray on meta + og + twitter | OPEN | Principal direction needed before audit extension |

### C — Needs legal / compliance review (carried forward from Cycle 17, unchanged)

| # | Card | Status | Owner |
|---|---|---|---|
| C1 | `/privacy/` — counsel read pending for `.com` cutover | REVIEW | External counsel + principal |
| C2 | `/terms/` — counsel read + TCPA form copy pending | REVIEW | External counsel + principal |
| C3 | NAR REALTOR® mark usage (Cycle 17 NAR canonical asset) — legal sign-off pending for `.com` cutover | REVIEW | External counsel + principal |
| C4 | TCPA consent copy (mandatory before any GHL form wiring; Category D-blocked on this) | OPEN | External counsel + principal |
| C5 | USCO DMCA designated-agent registration ($6 + ~15 min principal time) | OPEN | Principal |

### D — Needs GHL / ops wiring (carried forward from Cycle 17, sequenced behind C4 TCPA)

| # | Card | Status | Owner |
|---|---|---|---|
| D1 | GHL workflow webhook URL — provide for /contact/ + /valuation/ + /thank-you/* form POSTs | OPEN (blocked by C4) | Principal + engineering |
| D2 | GHL pipeline stage names + tag taxonomy | OPEN (blocked by C4) | Principal + engineering |
| D3 | GHL notification routing (email / SMS) | OPEN (blocked by C4) | Principal + engineering |
| D4 | Privacy policy update reviewed by legal counsel (post-GHL wiring) | OPEN (blocked by C1 + D1) | External counsel + principal |

### E — Needs launch / cutover (carried forward from Cycle 17, unchanged)

| # | Card | Status | Owner |
|---|---|---|---|
| E1 | DNS cutover from current Direct Axess host to staging URL | OPEN (blocked by B4) | Operations + principal |
| E2 | 301 redirect plan from old `.com` to new `.com` | OPEN | Operations + principal |
| E3 | Cloudflare proxy setup (TLS, edge caching policy) | OPEN | Operations + principal |
| E4 | Direct Axess decommission timing | OPEN | Operations + principal |
| E5 | Final pre-cutover smoke test (lighthouse, broken-link sweep, 301 verification) | OPEN | Operations + principal |

## Cycle 18 deliberate non-goals (out of scope, not blockers)

- Lighthouse performance audit (deploy explicitly runs `--no-lighthouse` per mission boundary)
- Boca Raton / Palm Beach / Delray V2 page rollouts (mission says "not a broad market rollout. Do Fort Lauderdale properly first.")
- Insights cohort expansion (12-post library is fixed; Pompano Beach cross-references arrive in Cycle 19+)
- HOMEPAGE_FEATURED_ORDER reordering to include Pompano Beach (Cycle 18 added Pompano to MARKETS but not to FEATURED_MARKETS — operator decision needed for cohort changes)
- Image-pipeline migration (Pompano Beach hero generated via `bun ~/.claude/skills/Art/Tools/Generate.ts --model nano-banana-pro`; the prior `/tmp/mia-genimg/run.ts` batch generator remains absent — not a defect, just a different invocation path)

## What changed this cycle

| Category | Cycle 17 close | Cycle 18 close |
|---|---|---|
| A — Site/content defects | 4 open (blog Updated label; FtLaud V3 ICP gap; Hillsboro Mile geography; Pompano Beach missing) | **0 open** (all 4 closed) |
| B — Principal decision | 4 hard + 4 surfaced REVIEW | 4 hard + 5 surfaced REVIEW (B9 added — about meta-tag drift, surfaced by Cycle 17 Forge VERIFY) |
| C — Legal / compliance | 5 open | 5 open (unchanged) |
| D — GHL / ops | 4 open (blocked by C4) | 4 open (unchanged) |
| E — Launch / cutover | 5 open (blocked by B4) | 5 open (unchanged) |

## What is blocked externally

The remaining 18 items all require external decision or action — they are not site/content defects:
- **Principal time**: 9 items (B1-B9). Highest leverage: 60-90 min decision session unblocks all 9.
- **External counsel**: 5 items (C1-C5). Highest leverage: schedule a single counsel review for the C1+C2+C3+C4 cluster.
- **GHL / ops wiring**: 4 items (D1-D4) sequenced behind TCPA (C4).
- **Operations + principal**: 5 items (E1-E5) sequenced behind DNS sign-off (B4).

## Honest claim

Cycle 18 is **NOT `.com` launch-ready**. It IS staging-deploy-ready with the four mission-phase site/content defects (blog Updated label, FtLaud V3 ICP gap, Hillsboro Mile geography, missing Pompano Beach) closed and audit chain green.

## Next 3 highest-leverage actions

1. **Principal-decision session (~60-90 min)** — same as Cycle 17 recommendation. Closes 4 hard external gates (B1-B4) + surfaces 5 REVIEW items (B5-B9).
2. **USCO DMCA designated-agent registration** ($6 + ~15 min principal time). Closes C5; flips `/dmca/` from BLOCKED to PASS_FOR_CUTOVER.
3. **Boca Raton V2 rollout (Cycle 19)** — apply the now-canonical FL V4 rollout pattern to Boca Raton. The FL V4 page is the new gold standard (replacing the FL V3 reference); Boca's data already supports a V4-pattern lift (`market.aeoAnswer`, `buyerGuidance`, `sellerGuidance`, `comparisonContext`, `faqs`, `internalLinks` populated).
