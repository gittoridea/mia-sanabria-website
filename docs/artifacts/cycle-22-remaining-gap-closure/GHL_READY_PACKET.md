# GHL Readiness Packet (Cycle 22 — Team 4)

> **Status: PLAN-ONLY.** GHL env (`GHL_INQUIRY_WEBHOOK_URL`, `GHL_VALUATION_WEBHOOK_URL`, `GHL_PIT`, `GHL_LOCATION_ID`) absent at run start. No live wiring shipped. Site stays on `mailto:` until Torrey provisions credentials and approves cutover.
>
> This packet is a refinement of Cycle 20's `ghl-webhook-implementation-plan.md` — same architecture, tightened test plan + rollback + secrets discipline.

## 1. What "ready" means

Site is GHL-ready when:

1. `GHL_*` env vars exist in `~/.claude/.env` (NOT in repo).
2. GHL custom fields are provisioned in the UI (§3) BEFORE first synthetic submit.
3. Counsel has approved TCPA consent copy (§4).
4. Two test pipelines exist (Inquiry-Test + Valuation-Test) for the test cutover.
5. `src/lib/ghl.ts` client (proposed, not yet created) is wired to forms with feature-flagged mailto fallback.
6. A test lead has been submitted end-to-end AND verified in GHL contact view BEFORE flip to live.

## 2. Required environment (Torrey provisions)

All values live in `~/.claude/.env` per project CLAUDE.md. Anti: do NOT commit any of these to repo.

| Env var | Required | Notes |
|---|---|---|
| `GHL_LOCATION_ID` | yes | GHL sub-account UUID |
| `GHL_PIT` *(preferred)* OR `GHL_API_KEY` | yes (one of) | Private Integration Token — fewer scopes, easier rotation |
| `GHL_INQUIRY_WEBHOOK_URL` | yes | Inquiry pipeline inbound webhook from `https://services.leadconnectorhq.com/hooks/...` |
| `GHL_VALUATION_WEBHOOK_URL` | yes | Valuation pipeline |
| `GHL_LEAD_MAGNET_WEBHOOK_URL` | conditional | only if Mia packet §6 selects 6B/6C (gated/bifurcated PDFs) |
| `GHL_CALENDAR_ID` | optional | if valuation flow embeds a booking step |
| `GHL_WEBHOOK_ENV` | yes | `test` or `live` — feature flag |
| `GHL_ENABLED` | yes | master switch; `false` reverts to mailto-only |

## 3. GHL custom fields to provision BEFORE first submit

Standard GHL native fields (`first_name`, `last_name`, `email`, `phone`, `message`) do not need creation. Custom fields below MUST exist in GHL UI → Custom Fields before the first webhook fires, or the lead will arrive with missing data:

```
inquiry_type        dropdown (private_inquiry / buyer_brief / listing_conversation / valuation / general)
buyer_or_seller     dropdown (buyer / seller / both / undecided)
market              dropdown (16 market slugs + "other")
property_address    text
property_type       dropdown (single-family / condo / townhouse / land / other)
beds, baths         numeric
sqft, year_built    numeric
condition           dropdown (excellent / good / needs-work / unknown)
budget_or_price_range text
timeline            dropdown (0-3mo / 3-6mo / 6-12mo / 12+mo / exploring)
motivation          text
preferred_contact_method dropdown (phone / email / text / no_preference)
consent_text        text
consent_timestamp   text (ISO-8601)
source_page         text
source_component    text
intent              text
insight_topic       text
lead_magnet_requested text
utm_source, utm_medium, utm_campaign, utm_term, utm_content   text
referrer            text
user_agent          text
landing_page        text
session_id          text
submitted_at        text (ISO-8601)
```

See `GHL_FIELD_MAP_FINAL.md` for the exact field map per form.

## 4. TCPA consent mechanics

| Item | Spec |
|---|---|
| Visible checkbox label | "I agree to be contacted by Mia Sanabria at the phone/email above about my inquiry. Message and data rates may apply. I understand consent is not a condition of any service. Reply STOP to unsubscribe." |
| Required to submit | yes (client-side form validation fails if unchecked) |
| Storage | `consent_text` (string-stable copy at submit time) + `consent_timestamp` ISO-8601 |
| Server overwrite | server clock overrides client timestamp for legal record |
| Counsel signoff | REQUIRED before this copy ships to production source. Until then, placeholder is `data-pending-legal="true"` in source |

Routes to `LEGAL_COMPLIANCE_PACKET.md` § TCPA for counsel question.

## 5. Endpoint architecture (`src/lib/ghl.ts`, proposed)

This file does NOT yet exist. When credentials arrive, scaffold:

```ts
// src/lib/ghl.ts (proposed, NOT YET CREATED)
const ENDPOINTS = {
  inquiry: process.env.GHL_INQUIRY_WEBHOOK_URL,
  valuation: process.env.GHL_VALUATION_WEBHOOK_URL,
  leadMagnet: process.env.GHL_LEAD_MAGNET_WEBHOOK_URL,
};
const FEATURE_FLAG = process.env.GHL_ENABLED === "true";

export async function submitLead(pipeline: "inquiry"|"valuation"|"leadMagnet", payload: LeadPayload):
  Promise<{ ok: true; contactId: string } | { ok: false; fallback: "mailto"; error: string }>;
```

- Returns `ok:true` only after a 2xx + parsable response.
- Returns `ok:false, fallback:"mailto"` on any 4xx/5xx OR timeout (configurable, default 8s).
- Client UI shows mailto fallback link on `ok:false`.
- No retry loops — surface failure quickly.

## 6. Per-form routing

### `/contact/` (`src/app/contact/page.tsx`)

| Property | Value |
|---|---|
| Target | `GHL_INQUIRY_WEBHOOK_URL` |
| Method | POST application/json |
| Hidden lead-source input | ALREADY PRESENT (Cycle 21 A9) — read by `LeadSourceStamp` from URL `?source=…` |
| Pre-fill from URL | `inquiry_type` from `?intent=`, `market` from `?market=`, `insight_topic` from `?topic=` |
| Success redirect | `/thank-you/` (or `/thank-you/buyer-brief/`, `/thank-you/market-brief/` based on `intent`) |
| Error state | inline retry button + visible mailto fallback link |

### `/valuation/` (`src/app/valuation/page.tsx`)

| Property | Value |
|---|---|
| Target | `GHL_VALUATION_WEBHOOK_URL` |
| Method | POST application/json |
| Hidden lead-source input | ALREADY PRESENT (Cycle 21 A9) |
| Pre-fill from URL | `market` from `?market=`, `property_address` from `?address=` if set |
| Success redirect | `/thank-you/valuation/` |
| Error state | inline retry + visible mailto fallback |

### Lead-magnet gate (conditional on Mia §6)

If 6B/6C: new `/downloads/[slug]/` short form → `GHL_LEAD_MAGNET_WEBHOOK_URL` with `lead_magnet_requested={slug}` → PDF reveal.

## 7. Spam protection

| Tier | Mechanism | Tradeoff |
|---|---|---|
| Default this packet | **Honeypot** (invisible `<input name="company">` discarded server-side) + **Cloudflare Turnstile** (free, no third-party tracking) | ~1s validation, cookieless |
| Rejected | reCAPTCHA v3 | Google tracking baggage incompatible with luxury-private brand voice |

Honeypot ships with R-013/R-014. Turnstile adds ~10 lines of JSX + one `<script>` injection in `layout.tsx`.

## 8. Audit log requirements

Every form submit logs (server-side, GHL-recorded):

```
timestamp · pipeline · contact_id (if ok) · status_code · consent_text · consent_timestamp · source_page · ip_capture_strategy
```

Minimum viable: GHL contact note field append. Mature: separate audit pipeline (out of scope for this packet).

## 9. Rollback plan

| Trigger | Action |
|---|---|
| GHL webhook returns 5xx | client falls back to mailto automatically; user sees inline mailto link |
| GHL endpoint URL changed in GHL UI | update env, redeploy; rollback by reverting commit |
| Spam-protection misfire (legitimate leads blocked) | disable Turnstile via `GHL_TURNSTILE_ENABLED=false`; honeypot stays |
| TCPA copy challenged by counsel | pull copy from `src/lib/legal.ts` constant; redeploy with new text; leads pause until live |
| Total GHL outage | flip `GHL_ENABLED=false` in `~/.claude/.env`; rebuild → mailto-only |

The feature flag `GHL_ENABLED` is the master switch.

## 10. Test-lead procedure (10 steps)

See `GHL_TEST_PLAN.md` for the bullet-by-bullet checklist with pass criteria.

## 11. What changes when GHL goes live

| Surface | Before | After |
|---|---|---|
| `/contact/` form `action` | `mailto:msanabriarea@gmail.com` | `<form onSubmit={submitLead}>` via `src/lib/ghl.ts` |
| `/valuation/` form `action` | same | same pattern, valuation pipeline |
| Hidden `source` input | already present | unchanged |
| TCPA checkbox | not present | required, visible, frozen at submit |
| Honeypot field | not present | invisible, server-discarded |
| Turnstile widget | not present | renders inline below submit |
| Thank-you pages | unreachable via mailto | reached on success redirect |
| Visible mailto fallback | n/a | visible inline link on submit error |

## 12. Anti-checklist

- [ ] No new code path calls a remote GHL endpoint at runtime in this cycle.
- [ ] No literal webhook URL or PIT/API key committed to repo.
- [ ] No fake submission analytics.
- [ ] No "Thanks, we'll be in touch" displayed unless GHL contact was actually created.
- [ ] No placeholder TCPA consent copy shipped as if approved.
- [ ] No GHL test submissions sent this cycle (env is empty).

All Anti rows confirmed satisfied at cycle close.

## 13. Effort estimate (Cycle 23-GHL or later)

- GHL provisioning (Torrey-side): 1–2h
- `src/lib/ghl.ts`: 2–3h
- Two-form wiring: 2–4h
- Turnstile integration: 1–2h
- Test pass + verification: 1–2h
- Counsel TCPA review: external lead-time

**Total build-side: ~8–12h once principal green-light arrives.**

## 14. Open principal decisions that block GHL cutover

These items must be resolved before the GHL cutover cycle:

- Mia packet §4: branded email (gates Reply-to)
- Mia packet §5: phone / call-tracking (gates whether `tel:` links rollover too)
- Mia packet §6: lead-magnet gating (decides whether `GHL_LEAD_MAGNET_WEBHOOK_URL` is required)
- Mia packet §7: response-time stance (sets thank-you copy)
- Legal packet TCPA: consent text counsel signoff

## 15. Next-cycle prompt (drop-in for the GHL-activation cycle)

> Mission: Wire `/contact/` + `/valuation/` to GHL inquiry + valuation pipelines, with TCPA consent capture, hidden attribution fields, honeypot + Turnstile spam protection, and feature-flagged mailto fallback. Use `docs/artifacts/cycle-22-remaining-gap-closure/GHL_READY_PACKET.md` + `GHL_FIELD_MAP_FINAL.md` as the binding spec. Preconditions: principal must provision GHL location, two webhook URLs, and all custom fields per §3 before code starts. Counsel must approve TCPA consent copy in §4. Implement, write `src/lib/ghl.ts`, wire forms, ship test mode first, then live. Verify via the 10-step test procedure in `GHL_TEST_PLAN.md`. Commit, push, deploy via Dokploy `XJSRlvH-91ZtUsh0RPGvo`, ETag verify with `?cb=<hex>`. Capture test-lead screenshots in `docs/CYCLE_<n>_GHL_TEST_PROCEDURE.md`.
