# Cycle 20 — GHL Webhook Implementation Plan

> Source: `docs/artifacts/cycle-20-agency-qa/ghl-webhook-implementation-plan.md`
> Reads upstream from: `lead-flow-map.md` (canonical field map), `issue-matrix.md` (ISS-001..ISS-010 are this plan's customers).
> Status: **plan-only**. No live wiring this cycle. GHL env empty: `GHL_API_KEY`, `GHL_WEBHOOK_URL`, `GHL_LOCATION_ID`, `GHL_PIT` all missing.

**Discipline (per Phase-3 advisor):** every *feature* section below cites an issue-matrix `id`. Speculative feature sections were cut. Cross-cutting sections (§2 Dependencies, §11 Rollback, §12 Test procedure, §13 Estimated effort) serve the lead-capture issue rows **ISS-001..ISS-010 collectively** — they aren't feature sections, so a per-section single-id citation would mis-scope them. Their content is bounded by the feature sections that DO cite ids.

## 1. What this plan implements (matrix-row scope)

| ISS-id | Section in this plan |
|---|---|
| ISS-001 | §2 endpoint provisioning, §4 client wiring (Contact + Valuation) |
| ISS-002 | §4 fallback (mailto kept as visible fallback) |
| ISS-003 | §6 phone path (call-tracked) — **separate Cycle 21-CALL-TRACKING** |
| ISS-005 | §7 lead-magnet gate — **principal decision required** |
| ISS-006 | §3 hidden-attribution fields |
| ISS-007 | §5 TCPA consent capture |
| ISS-008 | §8 spam protection |
| ISS-009 | §9 query-param plumbing |
| ISS-010 | §10 thank-you wiring |

ISS-004 (IDX wrapper CTA) is **not** in this plan — it ships as a no-GHL-dependency repo edit (see issue-matrix §"If budget permits"). The current cycle ships that fix where principal-allowed.

## 2. Dependencies (must be in place before code lands)

### A. GHL location + auth

| Item | Required value | Where it lives | How acquired |
|---|---|---|---|
| GHL location ID | UUID-like string | `~/.claude/.env` → `GHL_LOCATION_ID` | Torrey provisions in GHL UI (Settings → Business Profile) |
| GHL auth method | Personal Integration Token (PIT) — preferred — or API key | `~/.claude/.env` → `GHL_PIT` or `GHL_API_KEY` | Torrey provisions in GHL UI (Settings → Private Integrations → Create) |
| GHL webhook URL — Inquiry pipeline | `https://services.leadconnectorhq.com/hooks/...` | `~/.claude/.env` → `GHL_INQUIRY_WEBHOOK_URL` | created in GHL UI (Workflows → New → Inbound Webhook) |
| GHL webhook URL — Valuation pipeline | `https://services.leadconnectorhq.com/hooks/...` | `~/.claude/.env` → `GHL_VALUATION_WEBHOOK_URL` | as above |
| GHL webhook URL — Lead-magnet (optional) | `https://...` | `~/.claude/.env` → `GHL_LEAD_MAGNET_WEBHOOK_URL` | only if ISS-005 principal-approves gating |
| GHL calendar ID (optional, for valuation booking) | UUID | `~/.claude/.env` → `GHL_CALENDAR_ID` | Settings → Calendars |
| GHL custom fields (created in advance) | per §3 list | GHL UI → Custom Fields | created BEFORE first form submit |

**Anti:** do NOT hardcode any of the above in source. All read from `process.env.GHL_*` at build time (via `src/lib/site.ts` companion file).

### B. Test mode (preferred over live cutover)

| Step | Action |
|---|---|
| 1 | Create a second GHL location OR a separate "Test" pipeline tagged with sub-account suffix; provision distinct webhook URLs |
| 2 | Set `GHL_WEBHOOK_ENV=test` in `~/.claude/.env`; src/lib/ghl.ts routes to the test webhook |
| 3 | Submit synthetic leads from each form; confirm contact appears in GHL test view with all custom fields populated |
| 4 | Flip `GHL_WEBHOOK_ENV=live` only after test pass |

### C. Legal counsel signoff on TCPA consent text

| Item | Value (placeholder until counsel approves) |
|---|---|
| Consent checkbox label (visible) | "I agree to be contacted by Mia Sanabria at the phone/email above about my inquiry. Message and data rates may apply. I understand consent is not a condition of any service. Reply STOP to unsubscribe." |
| Where stored | `consent_text` hidden field (server captures verbatim copy at submit time) + `consent_timestamp` ISO-8601 |
| Retention | per GHL contact record indefinitely; deletion on request per privacy policy |

Counsel signs off on copy. Then it ships in source. Anti: do NOT ship placeholder consent copy as if approved.

## 3. Field map (canonical, citing ISS-006)

See `lead-flow-map.md` § 3 for the full 31-field schema. Summary by category:

- **Contact fields (16)**: first_name, last_name, email, phone, inquiry_type, buyer_or_seller, market, property_address, property_type, beds, baths, sqft, year_built, condition, budget_or_price_range, timeline, motivation, message, preferred_contact_method
- **Consent fields (3)**: consent_checkbox, consent_text, consent_timestamp
- **Hidden attribution (12+)**: source_page, source_component, intent, market, insight_topic, lead_magnet_requested, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, user_agent, landing_page, session_id, submitted_at

### GHL custom fields to provision (create in GHL UI before first submit)

| GHL field key | Type | Purpose |
|---|---|---|
| `inquiry_type` | dropdown | derived from form host or `?intent=` |
| `buyer_or_seller` | dropdown | optional |
| `market` | dropdown (16 slugs + other) | optional |
| `property_address` | text | valuation |
| `property_type` | dropdown | optional |
| `beds`, `baths`, `sqft`, `year_built` | numeric | optional |
| `condition` | dropdown | optional |
| `budget_or_price_range` | text | optional |
| `timeline` | dropdown | optional |
| `motivation` | text | optional |
| `preferred_contact_method` | dropdown | optional |
| `consent_text`, `consent_timestamp` | text | TCPA record |
| `source_page`, `source_component`, `intent`, `insight_topic`, `lead_magnet_requested` | text | attribution |
| `utm_*` (5 fields) | text | attribution |
| `referrer`, `user_agent`, `landing_page`, `session_id`, `submitted_at` | text | attribution |

GHL native fields (`first_name`, `last_name`, `email`, `phone`, `message`) do not need custom-field creation.

## 4. Per-form routing (citing ISS-001, ISS-002)

### Contact form (`/contact/`)

| Property | Value |
|---|---|
| Target | `GHL_INQUIRY_WEBHOOK_URL` |
| Method | POST application/json |
| Fields | Contact §3 + Consent §3 + Hidden §3 (all applicable) |
| Pre-fill from URL | `inquiry_type` from `?intent=`, `market` from `?market=`, `insight_topic` from `?topic=` |
| Success state | redirect to `/thank-you/` |
| Error state | inline retry button + visible mailto fallback link |
| mailto fallback (preserved) | `<a href="mailto:msanabriarea@gmail.com?subject=Private Inquiry — Mia Sanabria">If the form is not working, email Mia directly.</a>` |

### Valuation form (`/valuation/`)

| Property | Value |
|---|---|
| Target | `GHL_VALUATION_WEBHOOK_URL` |
| Method | POST application/json |
| Fields | Contact + Property-detail subset + Consent + Hidden |
| Pre-fill from URL | `market` from `?market=`, `property_address` from `?address=` if used |
| Success state | redirect to `/thank-you/valuation/` |
| Error state | inline retry + visible mailto fallback |

### Lead-magnet gate (`/downloads/[slug]/`) — **principal decision required, ISS-005**

If gating: form submits to `GHL_LEAD_MAGNET_WEBHOOK_URL` with `lead_magnet_requested={slug}` and email-only payload; on success the page reveals the PDF download link. If not gating: status quo (direct download).

## 5. TCPA consent capture (ISS-007)

### Visible consent checkbox

- Required to submit. Unchecked = client-side form validation fail.
- Text frozen at submit time and copied verbatim into hidden `consent_text` field.
- Timestamp captured client-side as `consent_timestamp` ISO-8601; server overwrites with server clock.

### Storage

- `consent_text` and `consent_timestamp` survive in GHL contact record indefinitely (subject to privacy-policy deletion request).
- Audit log entry: every submit creates an immutable row recording IP (if retained), user-agent, consent_text, consent_timestamp, and webhook delivery status. Storage TBD — minimum option: append to GHL contact note field.

### Pre-cutover legal sign-off

- Final consent text reviewed by counsel.
- Placeholder copy in source is loud (uppercase or `data-pending-legal` class) until signoff.

## 6. Phone path — Cycle 21-CALL-TRACKING (ISS-003)

Out of scope for this plan; separate cycle. Architecture preview:

- Provision a GHL phone number (or Twilio routed to GHL).
- Replace `MIA.contact.phoneTel` constant in `src/lib/mia.ts` with the call-tracked number.
- Rollout to 11+ surfaces in one edit.
- GHL captures call metadata: source page (passed via URL fragment if practical), duration, recording (if compliant).
- **Rollback:** revert `MIA.contact.phoneTel` to personal cell if any routing failure occurs.

## 7. Lead-magnet gating — principal decision (ISS-005)

**Open question for Torrey:** gate the 3 lead magnets via short form (email + name only), or accept the open distribution model where the PDFs serve as top-of-funnel brand artifacts?

Tradeoffs:

| Path | Pros | Cons |
|---|---|---|
| Gate | Grows top-of-funnel CRM list; matches BSS productization story | Adds friction; some prospects bounce; partial gating is a maintenance burden |
| No gate | Lowest friction; PDF link is shareable on social/email; matches "private guidance" brand voice | No attribution back to Mia's CRM |

**Recommendation (advisory):** gate the **Buyer Due Diligence Checklist** (highest-intent download) and **leave the Seller and Valuation prep sheets ungated** as awareness assets. Bifurcates the funnel rather than gates the whole thing. Principal call.

## 8. Spam protection (ISS-008)

| Tier | Mechanism | Tradeoff |
|---|---|---|
| Minimum | Honeypot field — invisible `<input name="company">` that bots fill; server discards | zero UX cost; catches naive bots only |
| Default | Cloudflare Turnstile (free, no third-party tracking concerns) | 1 widget render; ~1s validation; works without cookies |
| Maximum | reCAPTCHA v3 | Google tracking baggage; we explicitly don't want it |

**Plan: ship Honeypot at MVP + Turnstile in the same release as ISS-001.** No reCAPTCHA.

## 9. Query-param plumbing (ISS-009)

CTA links that target a form should pass intent context via URL parameters:

| Source page | Target href change |
|---|---|
| `/buyers/` "Begin a Private Buyer Brief" | `/contact/?intent=buyer_brief` |
| `/sellers/` "Request a Listing Conversation" | `/contact/?intent=listing_conversation` |
| `/markets/[slug]/` "Begin a Private Conversation" | `/contact/?intent=private_inquiry&market={slug}` |
| `/insights/[slug]/` soft CTA | `/contact/?intent=private_inquiry&topic={slug}` |
| `IdxEmbed` wrapper CTA (ISS-004) | `/contact/?intent=private_inquiry&source=home-idx-handoff` |

Forms read these on mount and pre-fill hidden fields. Visible field labels are unchanged.

## 10. Thank-you wiring (ISS-010)

Each thank-you route already exists. After GHL is wired, the form redirects to the matching one:

| Form | Redirect on success |
|---|---|
| Contact form (any intent) | `/thank-you/` |
| Buyer-brief intent specifically | `/thank-you/buyer-brief/` |
| Listing-conversation intent | `/thank-you/market-brief/` |
| Valuation form | `/thank-you/valuation/` |

Thank-you-page copy must confirm what the user did (e.g., "Your valuation request reached Mia. She will respond personally.") and **must not promise a response time** (per 19C ban on "same business day" / "within five business days").

## 11. Rollback plan

| Trigger | Action |
|---|---|
| GHL webhook 5xx | Form switches to mailto: fallback automatically on submit error; user sees inline "Send via email instead" link |
| GHL endpoint URL change | Update env, redeploy; rollback by reverting commit |
| Spam protection misfire | Disable Turnstile via env flag; honeypot stays |
| TCPA consent copy challenged by counsel | Pull consent copy from `src/lib/legal.ts` and redeploy with new text; lead capture pauses until live |
| Total GHL outage | Feature-flag `GHL_ENABLED=false` reverts the entire site to mailto-only forms |

The feature flag `GHL_ENABLED` is the master switch — set in `~/.claude/.env`, read at build time, drives whether forms POST to GHL or fall back to mailto:.

## 12. Test lead procedure

| Step | Action | Pass criterion |
|---|---|---|
| 1 | Set `GHL_WEBHOOK_ENV=test` | env loaded |
| 2 | Submit synthetic Contact lead with all fields + consent | GHL test contact appears with all 31 fields populated |
| 3 | Inspect `consent_text` matches the visible consent copy verbatim | string-equal |
| 4 | Inspect `consent_timestamp` is within last 10s | parse ISO-8601 |
| 5 | Submit synthetic Valuation lead | GHL test contact with property fields |
| 6 | Submit Contact lead with `?intent=buyer_brief&market=fort-lauderdale` | GHL contact has `intent=buyer_brief`, `market=fort-lauderdale` |
| 7 | Submit Contact lead with honeypot field filled | request rejected; lead does NOT appear |
| 8 | Force webhook to 503 via env flip | client falls back to mailto; user sees fallback link |
| 9 | Flip env to `live`; submit one real test lead Torrey himself owns | real GHL contact in inquiry pipeline |
| 10 | Document the test run in `docs/CYCLE_21_GHL_TEST_PROCEDURE.md` with screenshots | doc committed |

## 13. Estimated effort (Cycle 21-GHL or later)

- Provisioning + custom fields in GHL: 1–2 hours principal-side (Torrey)
- `src/lib/ghl.ts` client (POST helper, env reading, fallback wiring): 2–3 hours
- Two-form wiring (Contact + Valuation): 2–4 hours
- Turnstile integration: 1–2 hours
- Test pass + first-live verification: 1–2 hours
- Counsel review of TCPA consent: external lead-time

**Total Cycle-21-GHL build effort: ~8–12 hours from principal-side green light.**

## 14. Out of scope for THIS plan (Cycle 20)

- Call tracking (ISS-003): separate Cycle 21-CALL-TRACKING
- IDX vendor lead-routing negotiation (ISS-004 long-term): business relationship, not code
- Production legal counsel review of `/privacy`, `/terms`, `/accessibility`, `/dmca` (ISS-014..ISS-017): separate Cycle 21-LEGAL-CUTOVER
- DNS swap to `miasanabriarealtor.com` (ISS-024): separate Cycle 21-CUTOVER
- GBP / social profile updates: out of repo scope

## 15. Cross-reference

- Field map source of truth: `lead-flow-map.md` § 3
- Issue rows this plan addresses: ISS-001, ISS-002, ISS-003 (partial — points to follow-up), ISS-005, ISS-006, ISS-007, ISS-008, ISS-009, ISS-010
- Next-cycle prompt: `### Cycle 21-GHL launch prompt` below

---

## Cycle 21-GHL launch prompt (next session, drop-in)

> Mission: Wire `/contact/` + `/valuation/` to GHL inquiry + valuation pipelines, with TCPA consent capture, hidden attribution fields, honeypot+Turnstile spam protection, and feature-flagged mailto fallback. Use `docs/artifacts/cycle-20-agency-qa/ghl-webhook-implementation-plan.md` as the binding spec. Preconditions: Torrey must provision GHL location, two webhook URLs, and all custom fields per §3 before code starts. Counsel must approve TCPA consent copy in §5. Implement, write `src/lib/ghl.ts`, wire forms, ship test mode first, then live. Verify via the 10-step test procedure in §12. Commit, push, deploy via Dokploy XJSRlvH-91ZtUsh0RPGvo, ETag verify with `?cb=<hex>`. Capture test-lead screenshots in `docs/CYCLE_21_GHL_TEST_PROCEDURE.md`.
