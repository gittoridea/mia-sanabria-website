# GHL Test Plan (Cycle 22 — Team 4)

> 10-step test-lead procedure. Run end-to-end on `GHL_WEBHOOK_ENV=test` BEFORE flipping to live.
> Storage: results captured in `docs/CYCLE_<n>_GHL_TEST_PROCEDURE.md` (created at activation cycle).

## Preconditions

- All `GHL_*` env vars provisioned per `GHL_READY_PACKET.md` §2.
- Two test pipelines exist: `Inquiry-Test`, `Valuation-Test` (separate from live pipelines, tagged with `_test` suffix).
- All custom fields exist in GHL UI per `GHL_FIELD_MAP_FINAL.md`.
- `GHL_WEBHOOK_ENV=test` in `~/.claude/.env`.
- Counsel-approved TCPA consent text in `src/lib/legal.ts`.

## 1. Env load check

```bash
bun -e 'console.log(["GHL_ENABLED","GHL_WEBHOOK_ENV","GHL_LOCATION_ID","GHL_INQUIRY_WEBHOOK_URL","GHL_VALUATION_WEBHOOK_URL"].map(k=>[k, Boolean(process.env[k])]))'
```

**Pass:** every key shows `true` (presence-only; never print values).

## 2. Synthetic Contact lead — all fields populated

Open `/contact/?intent=private_inquiry`. Fill every visible field (firstName, lastName, email=`test+inquiry-{ts}@example.com`, phone, interest=Buying, message). Tick consent checkbox. Submit.

**Pass:** UI shows success state; `/thank-you/` reached. GHL Inquiry-Test pipeline shows new contact with all 31 fields populated within 30s.

## 3. Consent fields verify

In GHL contact view, confirm:
- `consent_text` exactly matches the visible checkbox label string.
- `consent_timestamp` parses as ISO-8601 and is within last 60s of submit.

**Pass:** both string-equal and within window.

## 4. Synthetic Valuation lead

Open `/valuation/?market=fort-lauderdale`. Fill every field. Submit.

**Pass:** `/thank-you/valuation/` reached. GHL Valuation-Test pipeline shows contact with valuation fields populated (property_address, beds, baths, sqft, condition, timeline). `market=fort-lauderdale` set in GHL custom field.

## 5. Intent + market params

Open `/contact/?intent=buyer_brief&market=boca-raton`. Submit minimal form.

**Pass:** GHL contact has `inquiry_type=buyer_brief`, `market=boca-raton`, redirected to `/thank-you/buyer-brief/`.

## 6. Insight topic param

Open `/insights/<slug>/` → click "Begin a Private Conversation" CTA. Submit minimal form.

**Pass:** GHL contact has `insight_topic={slug}`.

## 7. Honeypot trip

Use browser devtools to fill the hidden `<input name="company">` field with "ACME Co". Submit.

**Pass:** form returns success (decoy); GHL pipeline shows NO new contact.

## 8. Turnstile bypass attempt

Disable JS in browser. Attempt submit on `/contact/`.

**Pass:** form does not submit OR submits but is rejected by Turnstile server-side; no GHL contact created.

## 9. Webhook failure → mailto fallback

Temporarily set `GHL_INQUIRY_WEBHOOK_URL` to a known-503 endpoint (or rotate webhook to disabled state in GHL UI). Submit `/contact/`.

**Pass:** UI shows inline error + visible mailto fallback link with prefilled subject + body. NO success state shown. NO GHL contact created.

## 10. Live cutover smoke

Set `GHL_WEBHOOK_ENV=live`. Rebuild + redeploy. Submit one real-info test lead Torrey himself owns from a clean device.

**Pass:** GHL Inquiry (live) pipeline shows the real contact; all 31 fields populated; Torrey receives any GHL-side notification configured (email/SMS); ETag flipped per `LAUNCH_CUTOVER_READY_PACKET.md` rules.

## Test-lead checklist

| # | Step | Pass criterion |
|---|---|---|
| 1 | Env load | all keys present |
| 2 | Synthetic Inquiry full | 31 fields populated |
| 3 | Consent fields | string-equal + ISO-8601 within window |
| 4 | Synthetic Valuation | property fields populated |
| 5 | Intent + market params | params reach GHL fields |
| 6 | Insight topic param | param reaches GHL field |
| 7 | Honeypot trip | rejected silently |
| 8 | Turnstile bypass | rejected |
| 9 | Webhook 503 | mailto fallback visible |
| 10 | Live cutover smoke | real test lead lands |

## Rollback if any step fails

1. Set `GHL_ENABLED=false` in `~/.claude/.env`.
2. Rebuild + redeploy.
3. Site reverts to mailto-only across all forms.
4. Document failure in `docs/CYCLE_<n>_GHL_TEST_PROCEDURE.md`.
5. Fix root cause; re-run from step 1.
