# QA / Audit Infrastructure Closure (Cycle 22 — Team 9)

> **Status: ZERO DURABLE CHANGES THIS CYCLE.** All 10 baseline audits already green. Pressure to add audits is low.

## 1. Pressure inventory — would a new audit catch something we missed?

Reviewing the cycle's findings:

| Risk | Already-covered audit | New audit needed? |
|---|---|---|
| miaQuote overclaim regression | `audit:stale` covers narrow banned list (e.g., "same business day") but NOT overclaim adjectives ("absolute", "ultimate", "perfectly"). | Tentative — see §2 |
| Homepage H1 vs constants alignment | Manual grep; no audit | Tentative — see §2 |
| GHL "fake-capture" regression | n/a — site is mailto-only today | NO — audit only useful post-GHL wire |
| GA/GTM premature-wiring | n/a — script not present | Anti-check available via `grep -E '@google|googletagmanager|gtag\(' src/` returns 0 — already trivially monitored |
| Lead-surface field-map coverage | `audit-completeness.forms` reports per-form classification | NO — improvement would compete with GHL packet |
| PDF noindex/cutover status | Caddyfile-side, not repo-checkable | NO |
| Legal packet completeness | Documentation, not audit-able | NO |
| Launch packet completeness | Same | NO |

## 2. Proposed durable change — `audit-no-fabrications` overclaim extension (DEFERRED)

Per project CLAUDE.md "Promote at most one durable change per cycle", a candidate is:

**Extend `scripts/audit-no-fabrications.ts` with an `OVERCLAIM_ADJECTIVES` array** that flags `absolute`, `ultimate`, `unparalleled`, `pinnacle`, `unrivaled`, `unmatched`, `flawless`, `perfectly`, `seamlessly`, `most coveted` in production output, with per-pattern allowlists for legitimate uses (e.g., "absolute zero" in a math context — N/A on this site).

**Why deferred:** the audit's false-positive risk is non-trivial — Mia's approved `miaQuote` rewrites (when she returns the packet) MIGHT keep some descriptive uses. Shipping the audit now would block the next cycle's approved replacements. The correct sequence is:

1. Mia returns the packet decisions (Mia §2.1-§2.5).
2. Next cycle ships approved replacements.
3. THEN this audit ships, calibrated to the final wording.

So the durable change is QUEUED for the cycle after Mia's signoff, not this one.

## 3. Proposed durable change — `audit-h1-alignment` (REJECTED)

Candidate audit: scan `src/app/page.tsx` heading prop vs `src/lib/site.ts:tagline` vs `src/lib/mia.ts:tagline` vs `src/components/Hero.tsx:DEFAULT_HEADING`; fail if any drift.

**Rejected because:**
- Mia §1 will pick the canonical triad next cycle; ~30-min edit aligns all 4 files.
- After alignment, the drift cannot recur unless a future edit reintroduces it — at which point a simple `grep -nE 'tagline|DEFAULT_HEADING' src/` would surface the divergence.
- An audit for a one-shot alignment is over-tooling.

## 4. Existing audit infrastructure (snapshot)

| Audit | Status | Coverage |
|---|---|---|
| `audit:stale` | green | banned-claim catalog (response-time, off-market, Fair Housing steering, etc.) |
| `audit:schema` | green | 242 JSON-LD blocks parse with @context + @type |
| `audit:links` | green | 2525 internal links resolve |
| `audit:seo` | green | 0 warnings across `out/` |
| `audit:completeness` | green | footer-trust fan to 48 built routes + IDX iframe 5-sentinel guard (Cycle 21 promotion) |
| `audit:images` | green (part of audit:all) | image dimensions + alt text |
| `audit:brand` | green | brand consistency |
| `audit:insights` | green | insights catalog integrity |
| `audit:featured-markets` | green | featured-markets data integrity |
| `audit:legal` | green at baseline | legal page presence + DMCA WARN flagged for USCO (in-process) |
| `audit:about` | green | about page integrity |
| `audit:hero-contrast` | green | sampled luminance |
| `audit:rendered` | green | rendered visual baseline |
| `audit:route-inventory` | green | 40 sitemap routes reconcile to filesystem |
| `audit:qa-gate` | green | 48 routes · critical 0 · high 4 · medium 1 · low 48 |
| `audit:trust-row` | green | 51/51 sources |
| `audit:lead-magnets` | green | 4/4 checks |
| `audit:no-fabrications` | green | 0 hits |
| `audit:copy-density` | advisory | 0 FAIL · 133 WARN |
| `audit:fort-lauderdale-standard` / `audit:fort-lauderdale-v3` | green | FL page schema |

20 distinct audits, all currently green. The chain in `audit:all` runs 19 of them sequentially.

## 5. Single durable change shipped this cycle

**None.** Per project CLAUDE.md "Promote at most one durable change per cycle", the right outcome is no change when no change is justified. Cycle 21 promoted `audit-completeness` upgrades. Cycle 22 promotes nothing — by design.

This matches the Cycle 21 Smarter-AI Closeout bloat-reviewer pattern: "Promotion target: no promotion — one-off or already covered" is a valid first-class output.

## 6. Anti-checklist

- [ ] No new audit script added without a baseline-failing test case.
- [ ] No audit added that has known false-positive risk against current site copy.
- [ ] No `audit:all` chain reorder (sequence depends on path semantics).
- [ ] No deletion of existing audits.

All 4 confirmed at cycle close.

## 7. Queued for next cycle

- (a) After Mia's packet returns: ship the `OVERCLAIM_ADJECTIVES` extension to `audit-no-fabrications` calibrated to final approved copy.
- (b) After GHL wire: ship a `audit-ghl-readiness` script that probes form `action` attributes vs env presence + verifies hidden-field set.
- (c) After GA4 wire: ship `audit-analytics-presence` that probes `IS_STAGING` gate + `NEXT_PUBLIC_GA_ID` consistency.

Each of these is a single-file, narrow-scope audit. Ship one per cycle, not all three.
