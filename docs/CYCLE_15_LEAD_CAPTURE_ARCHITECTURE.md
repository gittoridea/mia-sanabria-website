# Cycle 15 — Lead Capture Architecture (2026-05-10)

> The seven conversion paths shipped in Cycle 15, the components that surface them, the URL-attribution scheme, the planned GHL/n8n mapping for the next engineering cycle, and what is and is not implemented today.

## Honesty contract (top-of-doc)

This cycle ships **soft lead-capture surfaces** — components, attribution params, and acknowledgement routes — without making any GHL production write or claiming TCPA/CRM capture. Every CTA visible to the visitor either:

1. Routes to an existing inquiry surface (`/contact/`, `/valuation/`) with attribution params, OR
2. Routes to a non-GHL `/thank-you/...` page that frames Mia's personal next step honestly.

No copy claims automation, double-opt-in, instant access, guaranteed response time, exclusive private inventory, or CRM capture.

## 1. Seven canonical conversion paths

| Path | Variant | Status | Default href |
|---|---|---|---|
| Private Consultation Request | `private-consultation` | IMPLEMENTED-STATIC | `/contact/?intent=consultation` |
| Confidential Home Valuation | `seller-valuation` | IMPLEMENTED-STATIC | `/valuation/` |
| Private Buyer Brief | `buyer-brief` | IMPLEMENTED-STATIC | `/contact/?intent=buyer-brief` |
| Quarterly Waterfront Market Brief | `market-brief` | IMPLEMENTED-STATIC | `/contact/?intent=market-brief` |
| Dockage / Route-to-Inlet Review | `waterfront-review` | IMPLEMENTED-STATIC | `/contact/?intent=dockage-review` |
| Private Listing Strategy Conversation | `listing-strategy` | IMPLEMENTED-STATIC | `/contact/?intent=listing-strategy` |
| Market-Specific Brief Request | `market-brief` (with `&market=…`) | IMPLEMENTED-STATIC | `/contact/?intent=market-brief&market=<slug>` |

**Status taxonomy used in this doc:**

- `IMPLEMENTED-STATIC` — UI present; routes to existing inquiry surface or thank-you page; no GHL.
- `READY-FOR-GHL` — endpoint integration is straightforward when GHL workflow webhook URL is provided.
- `BLOCKED-BY-GHL` — needs GHL workflow webhook URL + form action change.
- `BLOCKED-BY-LEGAL/TCPA` — needs TCPA-compliant consent copy + double-opt-in mechanic.
- `BLOCKED-BY-PRINCIPAL` — needs principal sign-off on copy/wording or a downstream config (CRM tag, pipeline stage).

## 2. Components that surface the paths

| Component | Used on | Path it serves by default |
|---|---|---|
| `LeadCaptureCTA` (base) | Insights detail pages | All seven (variant is data-driven) |
| `InlineInsightCTA` | Insights detail pages (mid-article) | Soft-CTA per post |
| `BuyerBriefCTA` | Buyers page, market pages, homepage | `buyer-brief` |
| `SellerValuationCTA` | Sellers page, valuation page | `seller-valuation` |
| `MarketBriefCTA` | Insights index, markets index, contact | `market-brief` |
| `PrivateConsultationCTA` | About page, home conversion strip | `private-consultation` |
| `WaterfrontReviewCTA` | Waterfront market pages, sellers | `waterfront-review` |

All seven CTA components compose the same `InsightCTA` shape and pass through to `LeadCaptureCTA`. New conversion paths can be added by extending `InsightCTAVariant` in `src/lib/insights.ts`.

## 3. URL-attribution scheme (hidden-field equivalent until GHL wires)

Until forms POST to GHL, attribution travels via URL query string. This gives downstream wiring a stable substrate to convert into hidden form fields when the webhook is provisioned.

| Param | Value | Purpose |
|---|---|---|
| `intent` | `consultation` / `buyer-brief` / `market-brief` / `dockage-review` / `listing-strategy` | Maps to GHL pipeline stage / tag |
| `market` | Market slug (e.g. `bay-colony`) | Identifies market interest |
| `source` | Component or page identifier (e.g. `insights-05`, `homepage-hero`, `sellers-cta`) | Identifies traffic source |
| `cta` | (optional) Specific CTA variant when multiple on a page | Disambiguates click |
| `post_slug` | (optional) Insight post slug | Identifies content origin |
| `utm_source` / `utm_medium` / `utm_campaign` | Standard UTM | External campaign attribution (if applicable) |

**On the receiving page (`/contact/` or `/valuation/`)**, the params are visible to the visitor (URL bar) and to Mia (when the visitor includes them in the inquiry). When GHL wires, these params will be lifted to hidden form fields automatically.

## 4. Planned GHL / n8n mapping (READY-FOR-GHL / BLOCKED-BY-GHL)

When a GHL workflow webhook URL is provided, the form action on `/contact/` and `/valuation/` becomes a POST to that webhook with the following payload shape:

```json
{
  "intent": "buyer-brief",
  "market": "bay-colony",
  "source": "insights-05",
  "cta": "buyer-brief",
  "post_slug": "bay-colony-and-bermuda-riviera-private-waterfront",
  "name": "<from form>",
  "email": "<from form>",
  "phone": "<from form, optional>",
  "message": "<from form, optional>",
  "consent_email": true,
  "consent_sms": false,
  "user_agent": "<from request>",
  "page_url": "https://miasanabriarealtor.com/contact/?intent=buyer-brief&market=bay-colony&source=insights-05",
  "referrer": "<from document.referrer>",
  "timestamp": "<ISO-8601>",
  "utm_source": "<optional>",
  "utm_medium": "<optional>",
  "utm_campaign": "<optional>"
}
```

**GHL workflow steps (planned, NOT shipped this cycle):**

1. Receive webhook → create / update contact (key by email).
2. Apply tags: `intent:<intent>`, `market:<market>` (if present), `source:<source>`, `post:<post_slug>` (if present).
3. Move contact to pipeline stage based on `intent`:
   - `buyer-brief` → "Buyer — Brief Requested"
   - `seller-valuation` → "Seller — Valuation Requested"
   - `market-brief` → "Subscriber — Market Brief"
   - `dockage-review` → "Buyer — Waterfront Review"
   - `listing-strategy` → "Seller — Listing Strategy"
   - `consultation` → "Inquiry — General"
4. Notification: SMS to Mia + email to Mia (with the payload summary).
5. Auto-acknowledge: simple email confirming receipt; no claims about response time or automated next step.

**TCPA / consent layer (BLOCKED-BY-LEGAL):**

- `consent_email` defaults `true` only when an email-explicit checkbox is checked on the form.
- `consent_sms` defaults `false` until SMS opt-in is wired with TCPA-compliant copy (express written consent, opt-out instructions, frequency disclosure).
- This cycle does NOT ship SMS opt-in mechanics.

## 5. Hidden field schema (full)

When GHL wires and forms become POST destinations, these fields are populated on submit (sourced from URL params, form inputs, browser context). They do not ship as hidden inputs in the static HTML this cycle.

| Field | Source | Example | Notes |
|---|---|---|---|
| `intent` | URL param | `buyer-brief` | Drives pipeline stage |
| `market` | URL param | `bay-colony` | Optional; market-specific |
| `source` | URL param | `insights-05` | Component / page identifier |
| `cta_clicked` | Form input (auto) | `buyer-brief` | Tracks which CTA on multi-CTA pages |
| `post_slug` | URL param | `bay-colony-and-bermuda-riviera-private-waterfront` | Insight content origin |
| `buyer_seller_researcher` | Form select | `buyer` / `seller` / `researcher` | Optional self-identification |
| `utm_source` | URL param | `linkedin` | Campaign attribution |
| `utm_medium` | URL param | `social` | Campaign attribution |
| `utm_campaign` | URL param | `q2-2026-launch` | Campaign attribution |
| `referrer` | `document.referrer` | `https://google.com/...` | Traffic source |
| `timestamp` | Server | `2026-05-10T17:42:00Z` | Submission time |
| `consent_email` | Form checkbox | `true` | TCPA / GDPR-friendly |
| `consent_sms` | Form checkbox | `false` (default) | BLOCKED until SMS mechanics wired |
| `user_agent` | Request header | `Mozilla/5.0 ...` | Optional, privacy-policy gated |
| `page_url` | `window.location.href` | (full URL) | For source disambiguation |

**Privacy-policy alignment:** the existing `/privacy/` page may need to be updated when GHL wires — Cycle 15 does NOT modify legal copy, but the hidden-field schema documented here gives the legal review a concrete contract to validate against.

## 6. Thank-you routes shipped this cycle

| Route | Used after | Frames |
|---|---|---|
| `/thank-you/` | Generic acknowledgement | Personal reply, not automated; suggests Insights library + markets |
| `/thank-you/valuation/` | Confidential valuation request | Pricing exercise begins privately; suggests AVM + positioning posts |
| `/thank-you/buyer-brief/` | Private buyer brief request | First conversation 60-90 minutes; suggests buyer-brief post + markets |
| `/thank-you/market-brief/` | Market brief request | Infrequent dispatch, not a newsletter; suggests Insights library + markets |

All four pages are noindex (per `metadata.robots`) and excluded from sitemap (Next.js `MetadataRoute.Sitemap` does not include them by default since they're not added to the static-routes list). They are NOT linked from active form-submit flows this cycle (no form `action` is configured to redirect to them yet) — they exist as the destination GHL will redirect to once wired.

## 7. What ships in this cycle (Cycle 15)

- 7 reusable CTA components in `src/components/cta/`.
- `LeadCaptureCTA` and `InlineInsightCTA` rendered on every Insights detail page.
- 4 thank-you routes ready for the GHL wiring cycle.
- URL-attribution scheme documented and used by every CTA component.
- This architecture document.
- No GHL production write.
- No TCPA mechanic.
- No SMS opt-in.
- No claim of CRM capture, automated follow-up, or guaranteed response time.

## 8. What blocks the next cycle

- **GHL workflow webhook URL** (BLOCKED-BY-GHL).
- **TCPA consent copy + double-opt-in flow design** (BLOCKED-BY-LEGAL/TCPA).
- **Pipeline stage names + tag taxonomy** in GHL (BLOCKED-BY-PRINCIPAL — Mia's preferred names).
- **Notification routing** — SMS to Mia, email summary, frequency cap (BLOCKED-BY-PRINCIPAL).
- **Privacy policy update** to reference the hidden-field schema (BLOCKED-BY-LEGAL).

When these are unblocked, the engineering work to wire the forms is approximately one focused cycle: form `action` change on `/contact/` and `/valuation/`, hidden-field injection from URL params, JS for `cta_clicked` capture, redirect to the appropriate `/thank-you/...` route, and end-to-end test with a sandbox GHL workflow.
