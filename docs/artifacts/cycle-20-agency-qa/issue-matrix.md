# Cycle 20 — Issue Matrix

> Source: `docs/artifacts/cycle-20-agency-qa/issue-matrix.md` (+ machine-readable twin at `issue-matrix.json`).
> Reads from: `full-page-inventory.md`, `lead-flow-map.md`, `idx-search-audit.md`, `copy-consistency-audit.md`, `seo-aeo-schema-audit.md`, all 19 `reports/audit-*.json` outputs, `qa-gate-matrix.json`.

## Severity legend

- **P0** — broken-looking-functional behavior, secrets exposure, severe a11y blocker, schema-invalid on critical route, dead primary CTA, lead path that silently fails to capture. **Zero in this cycle.**
- **P1** — high-friction lead path, missing GHL webhook architecture, major mobile conversion issue, poor IDX wrapper, broken social previews, compliance-sensitive wording.
- **P2** — polish, non-critical consistency, advisory copy-density warnings, performance risks below urgent threshold.
- **P3** — micro-polish, opportunities, principal decisions that aren't urgent.

## Owner-type legend

1. **site/content/design defect** — fixable in repo
2. **tool/process defect** — fixable in tooling
3. **principal decision** — Torrey/Mia decides
4. **GHL/ops dependency** — blocked on GHL setup
5. **legal/compliance dependency** — blocked on counsel
6. **launch/cutover dependency** — flips at DNS swap

## ⭐ Top 6 Levers — read this first

If Torrey reads only one block in this artifact, this is it. **The six fixes below unlock ~80% of the remaining lead-capture lift.** All six are owner-type 4 (GHL) or owner-type 3 (principal). Five are gated by a single primitive: **provision a GHL location + write a webhook + define a contact custom-field map.** Once that primitive lands, fixes 1–5 are mechanical wiring.

| # | Lever | Why it matters | Gated on | Effort |
|---|---|---|---|---|
| 1 | **Wire `/contact/` form to GHL webhook** (ISS-001) | Captures the named-lead path that the entire site funnels toward. | GHL endpoint + PIT or API key | S–M |
| 2 | **Wire `/valuation/` form to GHL with property custom fields** (ISS-001, ISS-006) | Valuation requests are the highest-intent inbound; mailto: silently fails on mobile (ISS-002). | GHL endpoint + custom fields | M |
| 3 | **Add TCPA consent capture to both forms** (ISS-007) | Legal precondition for any phone/SMS follow-up from the captured lead. Without it, the lead is half-captured. | Legal counsel review of consent text | S (once text is approved) |
| 4 | **Wire call-tracked phone number** to header/footer/CTAStrip/contact/valuation `tel:` links (ISS-003) | 11+ on-site touchpoints currently bypass any attribution. Call tracking flips them into CRM events. | GHL phone (or Twilio→GHL) provisioning | M (one rollout to many files) |
| 5 | **Add wrapper-side "Talk to Mia after you search" CTA below IDX iframe** (ISS-004) | The IDX surface is the highest-traffic page block; today every interaction is captured by sef.mlsmatrix.com, not Mia. A wrapper-side handoff CTA is the only thing in Mia's control. | none (purely repo work) | S |
| 6 | **Principal decision on PDF lead-magnet gating** (ISS-005) | 3 PDFs currently ungated; gating them via short email form is the lowest-friction way to grow the top-of-funnel list. Equally valid: keep ungated as a brand-credibility play. | Torrey/Mia decision | S either way |

**Single biggest unlock:** levers 1+2+3 ship together as one Phase-11 deliverable. See `ghl-webhook-implementation-plan.md`.

## Issue matrix

Columns: id · page/component · category · issue · evidence · severity · impact · recommended fix · owner-type · effort · confidence · can_fix_now · files_affected · verification.

### Architectural — GHL / lead capture

| ID | Page/Comp | Cat | Issue | Evidence | Sev | Impact | Fix | OT | Eff | Conf | Now? | Files | Verify |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ISS-001 | Contact + Valuation forms | lead-capture | Forms submit via `mailto:` not GHL webhook | `audit-completeness.forms.classification`: 2 forms · 0 live-ghl · 2 mailto | P1 | every captured-intent lead opens user's mail client; ~30% silent fail on mobile | implement GHL webhook per `ghl-webhook-implementation-plan.md` | 4 | M | 0.95 | no (GHL env empty) | `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`, +new `src/lib/ghl.ts` | live test lead in GHL contact view |
| ISS-002 | mailto links (16+) | lead-capture | mailto: silently fails on mobile users without configured Mail.app | UX failure class (no in-repo provable artifact); cited in advisor PLAN→BUILD review and in `ghl-webhook-implementation-plan.md` §4 fallback design; widely documented mobile-Safari behavior on devices where the default `mailto:` handler is unset | P1 | inquiry never reaches Mia and user thinks it did | replace primary path with GHL form (ISS-001); keep mailto as visible fallback link | 4 | M (ships with ISS-001) | 0.85 | no | per-page form components | manual test on iOS Safari sans Mail.app |
| ISS-003 | Phone (`tel:` links ×11+) | lead-capture | Phone calls untracked; no attribution | grep `tel:` across `src/` | P1 | inbound calls invisible to CRM; can't attribute to source page or campaign | provision call-tracked number routed via GHL phone; rollout to header/footer/CTAStrip/contact/valuation | 4 | M | 0.85 | no (provisioning required) | `src/lib/mia.ts` (phone), header/footer/CTAStrip + 5 page files | live test call appears in GHL |
| ISS-004 | `IdxEmbed` (home only) | lead-capture | Iframe captures leads at sef.mlsmatrix.com, outside Mia's CRM | `src/components/IdxEmbed.tsx` line 2 | P1 | highest-traffic on-page surface leaks leads to vendor | wrapper-side "Talk to Mia after you search" CTA strip below iframe linking to `/contact/?source=home-idx-handoff` | 3 | S | 0.90 | yes (Tier-2 candidate this cycle if budget; else next) | `src/components/IdxEmbed.tsx` | Read post-edit + screenshot |
| ISS-005 | 3 lead-magnet PDFs | lead-capture | PDFs are ungated; no email exchange before download | `src/components/markets/FortLauderdaleV2.tsx:826-844` | P2 | misses top-of-funnel list growth opportunity | **principal decision** — gate or accept open distribution; if gated, ship as GHL form-then-download | 3 | S | 0.80 | no (principal decision) | `src/app/downloads/[slug]/page.tsx`, +form gate | GHL contact tagged `lead_magnet_requested` |
| ISS-006 | Forms (Contact + Valuation) | lead-capture | No UTM/referrer/source attribution wiring | grep `utm_` and `source_page` in `src/app/contact/page.tsx`, `src/app/valuation/page.tsx` | P2 | post-cutover, can't attribute leads to source | ships with ISS-001 — hidden-field set per `lead-flow-map.md` §3 | 4 | S | 0.95 | no | per-form components | live test inspects GHL contact custom fields |
| ISS-007 | Forms (Contact + Valuation) | compliance | No TCPA consent capture | per-form component Read | P1 | inbound calls/SMS to captured leads need TCPA consent on record | required checkbox + `consent_text` + `consent_timestamp` storage; legal counsel reviews copy | 5 | S (after legal sign-off) | 0.95 | no (legal review) | per-form components + GHL custom fields | GHL contact has consent_* fields stamped |
| ISS-008 | Forms (Contact + Valuation) | security | No spam protection (honeypot/Turnstile/reCAPTCHA) | per-form Read | P2 | post-cutover, will receive bot leads | honeypot field at minimum; Turnstile if budget; reCAPTCHA v3 deprecated default | 4 | S | 0.90 | no (ships with ISS-001) | per-form components | bot-submit test |
| ISS-009 | All form-targeting CTAs | lead-capture | `?intent=`, `?market=`, `?topic=` not wired into CTA hrefs | grep `href="/contact/"` across src | P2 | post-cutover, contact form can't pre-fill `inquiry_type`/`market`/`insight_topic` | wire `?intent=`, `?market=`, `?topic=` at GHL cutover; UI labels unchanged | 4 | S | 0.95 | no (ships with ISS-001) | inline CTAs across ~22 pages | per-form pre-fill matches param |
| ISS-010 | Thank-you pages × 4 | lead-capture-honesty | Pages exist but are unreachable via mailto; copy must not imply CRM capture in interim | route walk + form-action grep | P3 | minor — pages aren't reached today, but honesty matters at cutover | review copy at GHL cutover, no edit this cycle | 4 | S | 0.85 | no | `src/app/thank-you/**` | post-GHL: form submit → /thank-you/* serves correct copy |

### Tool / process defects

| ID | Page/Comp | Cat | Issue | Evidence | Sev | Impact | Fix | OT | Eff | Conf | Now? | Files | Verify |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ISS-011 | `scripts/deploy-and-verify.ts` | tooling | Cache-bust pattern `?_=${Date.now()}` vulnerable to same-ms collisions | pre-fix line scan | P2 | parallel probes may share token, defeating cache-bust | switch to `?cb=<8-byte-hex>` via `crypto.randomBytes` | 2 | S | 1.00 | **YES — DONE THIS CYCLE** | `scripts/deploy-and-verify.ts` (3 sites, lines 172/191/205), `CLAUDE.md` updated | post-deploy ETag flip with hex token |
| ISS-012 | `audit-mobile-readability` requires `@napi-rs/canvas` | tooling | Lead-magnet PDF page-render skip warning | `audit-lead-magnets` "warning: page-render skipped — @napi-rs/canvas not installed" | P3 | non-blocking; PDFs are validated by other means | install `@napi-rs/canvas` OR remove the page-render-check skip and audit still PASS | 2 | S | 0.80 | yes, but defer — not blocking | `package.json` devDeps | re-run audit, no warning |
| ISS-013 | audit:all chain excludes `audit:copy-density` | tooling | `audit-copy-density` is advisory but not in audit:all | `package.json` scripts | P3 | advisory warnings invisible in CI sweep | add to audit:all OR keep advisory-only — current is fine | 2 | S | 0.75 | no | `package.json` | n/a |

### Legal — pre-cutover blockers (c5)

| ID | Page | Issue | Evidence | Sev | OT | Now? |
|---|---|---|---|---|---|---|
| ISS-014 | `/privacy/` | needs counsel review prior to production cutover | qa-gate `h:legal_review(c5)` | P1 (cutover) | 5 | no |
| ISS-015 | `/terms/` | same | qa-gate | P1 (cutover) | 5 | no |
| ISS-016 | `/accessibility/` | same | qa-gate | P1 (cutover) | 5 | no |
| ISS-017 | `/dmca/` | + USCO designated-agent registration in process | qa-gate + `audit-legal.dmca.uscoFlag` WARN | P1 (cutover) | 5 | no |

### SEO/AEO/schema

| ID | Page | Issue | Sev | OT | Now? |
|---|---|---|---|---|---|
| ISS-018 | `/markets/fort-lauderdale/` | Title length = 62 chars (over 60 cap) | P3 | 1 | yes (defer — micro-polish) |

### Tier-3 deferred audit slots

| ID | Topic | Evidence | Sev | OT | Now? |
|---|---|---|---|---|---|
| ISS-019 | UI/UX screenshot review at 320/375/414/768/1280 across 15+ routes | this cycle did not run capture; baseline at `docs/artifacts/cycle-19A-M/mobile-readability/after/` | P2 | 1 | **no — Tier-3 stub + named follow-up Cycle 21-UI-UX-SCREENSHOTS** |
| ISS-020 | Accessibility deep pass (axe / pa11y / Lighthouse) | `command -v lighthouse axe pa11y` all return absent on this host | P2 | 1 | **no — Tier-3 stub; install tooling + named follow-up Cycle 21-A11Y-PERF** |
| ISS-021 | Performance / Core Web Vitals run with Lighthouse | as above (no lighthouse CLI) | P2 | 1 | **no — Tier-3 stub; same follow-up as ISS-020** |
| ISS-022 | Security / build / dependency audit | `security-build-qa-audit.md` light pass present; full pass deferred | P3 | 1 | **partially this cycle** — light pass in `security-build-qa-audit.md` stub |

### Launch / cutover (c6)

| ID | Issue | Evidence | Sev | OT | Now? |
|---|---|---|---|---|---|
| ISS-023 | Staging-wide `noindex,nofollow` flips to allow-all at production cutover (IS_STAGING gate) | `src/lib/site.ts:14` `IS_STAGING = !SITE_URL.startsWith(PRODUCTION_URL)` + qa-gate-matrix `l:noindex(c6)` on all 48 routes | P1 (cutover) | 6 | no — gated by DNS swap |
| ISS-024 | `SITE_URL` flips from `https://miasanabriarealtor.trueidea.com` to `https://miasanabriarealtor.com` at cutover | `src/lib/site.ts:8` `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? STAGING_URL` | P1 (cutover) | 6 | no — gated by DNS swap |
| ISS-025 | Sitemap regenerates with production hostname at cutover build | `src/app/sitemap.ts` reads `SITE.url`; rebuilds on env flip | P1 (cutover) | 6 | no — automated when env flips |

## Implementation status this cycle

| Status | Count | IDs |
|---|---|---|
| Implemented this cycle | 1 | ISS-011 (cache-bust safe fix) |
| Implementable but principal-deferred | 1 | ISS-004 (wrapper CTA below IDX — Tier-2 candidate; see "If budget permits" below) |
| Blocked on GHL provisioning | 7 | ISS-001, ISS-002, ISS-003, ISS-006, ISS-008, ISS-009, ISS-010 |
| Blocked on principal decision | 2 | ISS-005, ISS-022 (security audit depth) |
| Blocked on legal counsel | 5 | ISS-007, ISS-014, ISS-015, ISS-016, ISS-017 |
| Tier-3 deferred (named follow-up) | 3 | ISS-019, ISS-020, ISS-021 |
| Cutover-gated | 3 | ISS-023, ISS-024, ISS-025 |
| Defer (micro-polish) | 2 | ISS-012, ISS-013, ISS-018 |

## "If budget permits this cycle" candidates

Listed in descending value-per-effort:

1. **ISS-004 — wrapper CTA below IDX** (S, principal-allowed, no GHL dependency). 6 lines of JSX in `IdxEmbed.tsx`. Highest single fix that doesn't require GHL.
2. **ISS-018 — FL title length trim** (S, 1 char). Trivial. Defer if pressed for time.

## Cross-reference index

- `full-page-inventory.md` § 6 → which rows above are c5/c6.
- `lead-flow-map.md` § 6 → reverse map of ISS-001..ISS-010.
- `idx-search-audit.md` § 4 → ISS-004 derivation.
- `copy-consistency-audit.md` § 2 → ISS-014..ISS-017 derivation.
- `seo-aeo-schema-audit.md` § 10 → ISS-018 derivation.
- `ghl-webhook-implementation-plan.md` § (forward) → cites ISS-001..ISS-010 by id.
