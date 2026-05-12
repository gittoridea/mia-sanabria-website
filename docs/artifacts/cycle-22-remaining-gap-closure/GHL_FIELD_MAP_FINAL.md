# GHL Field Map (Cycle 22 — Team 4)

> Canonical form → webhook field map. Aligned with Cycle 20 `lead-flow-map.md` §3. Each row names the source (user-input or auto-fill), the destination GHL field, and the form(s) that emit it.

## 1. Contact (visible) fields

| GHL field key | Type | Required | Source | Forms |
|---|---|---|---|---|
| `first_name` | text | yes | user input | Contact, Valuation |
| `last_name` | text | yes | user input | Contact, Valuation |
| `email` | email | yes | user input | Contact, Valuation |
| `phone` | tel | yes (TCPA jurisdictions) | user input | Contact, Valuation |
| `message` | textarea | optional | user input | Contact |
| `interest` | text | optional | user input (current `<select>`) | Contact |
| `inquiry_type` | dropdown | yes | derived from `?intent=` OR form host | Contact (= "private_inquiry" default; overrideable) |
| `buyer_or_seller` | dropdown | optional | user select OR derived from intent | Contact |
| `market` | dropdown | optional | from `?market=` OR user select | Contact, Valuation |

## 2. Valuation-specific fields

| GHL field key | Type | Required | Source | Forms |
|---|---|---|---|---|
| `property_address` | text | yes | user input | Valuation |
| `property_type` | dropdown | optional | user select | Valuation |
| `beds` | numeric | optional | user input | Valuation |
| `baths` | numeric | optional | user input | Valuation |
| `sqft` | numeric | optional | user input | Valuation |
| `year_built` | numeric | optional | user input | Valuation |
| `condition` | dropdown | optional | user select | Valuation |
| `budget_or_price_range` | text | optional | user input | Valuation |
| `timeline` | dropdown | optional | user select | Valuation |
| `motivation` | text | optional | user input (current `<textarea name="upgrades">`) | Valuation |
| `preferred_contact_method` | dropdown | optional | user select | Contact, Valuation |

## 3. Consent fields (visible + hidden)

| GHL field key | Type | Required | Source |
|---|---|---|---|
| `consent_checkbox` | checkbox (visible) | yes | user check |
| `consent_text` | hidden text | yes | string-stable copy of visible label at submit |
| `consent_timestamp` | hidden text (ISO-8601) | yes | client clock; server overwrites |

## 4. Hidden attribution fields (client auto-fill)

| GHL field key | Type | Source |
|---|---|---|
| `source` | text | from `?source=` (already present via `LeadSourceStamp` per Cycle 21 A9) |
| `source_page` | text | `window.location.pathname` |
| `source_component` | text | hard-coded per form (`ContactForm` / `ValuationForm` / `LeadMagnetForm`) |
| `intent` | text | from `?intent=` |
| `insight_topic` | text | from `?topic=` |
| `lead_magnet_requested` | text | only on gated lead-magnet form (`{slug}`) |
| `utm_source` | text | from `?utm_source=` |
| `utm_medium` | text | from `?utm_medium=` |
| `utm_campaign` | text | from `?utm_campaign=` |
| `utm_term` | text | from `?utm_term=` (optional) |
| `utm_content` | text | from `?utm_content=` (optional) |
| `referrer` | text | `document.referrer` |
| `user_agent` | text | `navigator.userAgent` (truncated to 256 chars) |
| `landing_page` | text | first-pageview cookie / sessionStorage |
| `session_id` | text | client-side uuid in sessionStorage |
| `submitted_at` | ISO-8601 | client clock; server overwrites |
| `ip_capture_strategy` | server-side | GHL records `X-Forwarded-For` per its own contract; principal decision whether to retain |

## 5. Form-to-webhook routing table

| Form | Webhook env var | Pipeline | Native fields | Custom fields | Hidden attribution |
|---|---|---|---|---|---|
| `/contact/` | `GHL_INQUIRY_WEBHOOK_URL` | Inquiry | first_name, last_name, email, phone, message | inquiry_type, buyer_or_seller, market, interest, preferred_contact_method, consent_text, consent_timestamp | source, source_page=/contact, source_component=ContactForm, intent, market, insight_topic, utm_*, referrer, user_agent, landing_page, session_id, submitted_at |
| `/valuation/` | `GHL_VALUATION_WEBHOOK_URL` | Valuation | first_name, last_name, email, phone | property_address, property_type, beds, baths, sqft, year_built, condition, budget_or_price_range, timeline, motivation, market, preferred_contact_method, consent_text, consent_timestamp | source, source_page=/valuation, source_component=ValuationForm, market, utm_*, referrer, user_agent, landing_page, session_id, submitted_at |
| `/downloads/[slug]/` (conditional on Mia §6 B/C) | `GHL_LEAD_MAGNET_WEBHOOK_URL` | Lead Magnet | first_name, email | consent_text, consent_timestamp | source_page=/downloads/{slug}, source_component=LeadMagnetForm, lead_magnet_requested={slug}, utm_*, referrer, user_agent, landing_page, session_id, submitted_at |

## 6. Notes

- All form `action` attributes flip from `mailto:` to a no-op (e.g., `#`) when GHL is live; submission is handled by `submitLead()` in `src/lib/ghl.ts`. Mailto fallback link is rendered separately on error.
- Form `encType="text/plain"` is removed when forms switch to GHL POST.
- `interest` field on `/contact/` is a current `<select>` capture (Buying / Selling / Valuation / General). Map directly to `inquiry_type` if Mia prefers.
- Existing hidden `lead-source` input (Cycle 21 A9) maps to `source` GHL field — no rewiring needed.
