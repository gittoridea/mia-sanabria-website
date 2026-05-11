# Cycle 20 — Lead-Flow Map

> Source: `docs/artifacts/cycle-20-agency-qa/lead-flow-map.md`
> Reads upstream from `full-page-inventory.md`. Writes downstream to `issue-matrix.md` and `ghl-webhook-implementation-plan.md`.

## 1. Inbound lead surfaces — there are seven, not one

A "lead" is any action a prospect takes that should land in a CRM. The site currently has SEVEN distinct surfaces. Five of them are entirely outside Mia's CRM today. Listing all seven is the first move that makes the GHL cutover plan ship-able.

| # | Surface | Touchpoints | Current capture | Target capture |
|---|---|---|---|---|
| S1 | **Form (`<form>`)** | `/contact/` Send Private Inquiry · `/valuation/` Request Valuation | mailto: opens user's default mail client | GHL webhook → Inquiry pipeline / Valuation pipeline |
| S2 | **Mailto link (text)** | 16+ links across body copy + footer | mailto: opens user's default mail client | Keep mailto as fallback; primary path moves to S1 form |
| S3 | **Tel link (`tel:`)** | 11+ links: SiteHeader×2, SiteFooter, CTAStrip, contact×2, valuation, privacy×2, accessibility, terms | rings Mia's personal cell directly | Call-tracked number routed via GHL phone (out of Phase 11; named follow-up: Cycle 21-CALL-TRACKING) |
| S4 | **PDF download (lead magnet)** | 3 PDFs linked from FortLauderdaleV2 + 3 download-page routes | direct file download, no email gate | Optional email-gate via GHL form-then-redirect (principal decision) |
| S5 | **IDX iframe (sef.mlsmatrix.com)** | embedded on `/` only | sef.mlsmatrix.com's own contact/save-search forms (NOT Mia's CRM) | preserve iframe; add wrapper "Talk to Mia after you search" CTA → S1 |
| S6 | **Contact-page email text** | `(954) 540-0358` phone string + `msanabriarea@gmail.com` email string rendered as text + link | user retypes/copies | secondary to S1, kept as belt-and-suspenders |
| S7 | **404 / Thank-you "Return Home"** | navigation only, not a lead surface | n/a | n/a — leave as-is |

Five active capture surfaces (S1–S5) feed five different paths today. The cutover collapses all of them into one CRM with attribution. That collapse — not new UI — is the conversion lift.

**Note on the counting:** S6 and S7 are listed for completeness but are not separate inbound channels in the strict sense — S6 is the *same* channel as S2/S3 rendered as text rather than as a CTA button; S7 is post-conversion navigation. The effective inbound-surface count is **five**.

## 1.5 Surfaces NOT present on this site (intentionally out of scope)

These are common realtor-website inbound surfaces that **do not exist** on the current site, so they are explicitly out of Cycle 20 scope. Each is a candidate for a future cycle, not a gap in this audit.

| Surface | Why absent | If added → which cycle |
|---|---|---|
| **Social DMs (Instagram, Facebook Messenger)** | Mia is not actively posting on these platforms yet | Cycle 21+ social-presence buildout |
| **Live chat widget (Intercom / Drift / Crisp / GHL Chat)** | not currently part of the brand voice; high-friction with luxury positioning | principal decision; not recommended for "private guidance" voice |
| **SMS-in (short code / 10DLC)** | requires separate carrier compliance + opt-in flow; tied to call-tracking | Cycle 21-CALL-TRACKING |
| **Web push notifications** | not appropriate for luxury realtor brand; intrusive | not recommended; explicit no |
| **Calendar embed (GHL booking widget / Calendly)** | GHL not yet wired; valuation flow could later embed booking step | Cycle 21-GHL or later |
| **Newsletter / email-list signup** | content cadence not established; insights publish irregularly | principal decision after Cycle 21-GHL stabilizes |
| **Quiz / interactive lead funnel** | brand-incompatible with private-conversation positioning | explicit no |

Listing these explicitly closes the audit's claim of comprehensiveness — the lead-flow map is a complete inventory of inbound surfaces *for this site as it ships today*, with future-channel candidates named, scoped, or rejected.

## 2. Lead-path-by-path table

Columns: page · component · CTA label · href/action · surface (S1–S7) · current behavior · desired behavior · GHL status · fields needed · hidden attribution · consent · error/success state · analytics · risk · recommendation.

| Page | Component | Label | href/action | Surface | Current | Desired | GHL | Fields | Hidden | Consent | E/S state | Analytics | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | `Hero` | "Begin a Private Conversation" | `/contact/` | S1 | nav → contact form | nav → GHL-wired form | missing | n/a (carrier) | source=home-hero | n/a | n/a | none | low | preserve |
| `/` | `Hero` | "Request Home Valuation" | `/valuation/` | S1 | nav → valuation form | nav → GHL valuation pipeline | missing | n/a (carrier) | source=home-hero-secondary | n/a | n/a | none | low | preserve |
| `/` | `IntentRouter` | per-intent cards | `/buyers/`, `/sellers/`, `/contact/`, `/valuation/` | S1 | nav | nav | missing | n/a | source=home-intent | n/a | n/a | none | low | preserve |
| `/` | `CTAStrip` | "Begin a Private Conversation" + "Call Mia" | `/contact/` + `tel:` | S1+S3 | nav + ring | nav + tracked ring | missing | n/a | source=home-ctastrip | n/a | n/a | none | low | preserve; add call-tracking number at S3 cutover |
| `/` | `IdxEmbed` | iframe search | `https://sef.mlsmatrix.com/Matrix/...idx=10bd1eab` | S5 | external IDX search; sef captures leads | preserve iframe; add wrapper "Talk to Mia after you search" CTA → /contact/ | missing | for wrapper CTA: source=home-idx-handoff | n/a | n/a | none | **P1 lead leak** | wrapper-side CTA, no iframe replacement |
| `/contact/` | inline form | "Send Private Inquiry" | `action=mailto:${MIA.contact.email}?subject=Private Inquiry — Mia Sanabria` | S1 (form) → S2 (mailto via form submit) | opens user's mail client with pre-filled subject | GHL webhook submission with consent + UTM capture | missing | first_name, last_name, email, phone, inquiry_type, message, preferred_contact_method | source_page=/contact, source_component=ContactForm, utm_*, referrer, user_agent | required TCPA checkbox + `consent_text` + `consent_timestamp` | success → `/thank-you/`, error → inline retry + mailto fallback link | event=lead_submit category=contact | **P1 mailto deliverability** | route to GHL; keep mailto as visible fallback link |
| `/contact/` | phone block | "Call Mia (954) 540-0358" | `tel:+19545400358` | S3 | direct ring to personal cell | call-tracked ring routed via GHL phone | missing | n/a (call metadata is GHL-side) | n/a | n/a | n/a | event=lead_call category=contact | **P1 untracked calls** | named follow-up: Cycle 21-CALL-TRACKING |
| `/contact/` | email block | `msanabriarea@gmail.com` text | `mailto:${MIA.contact.email}` | S2 | direct email | direct email; lower priority than form | n/a | n/a | n/a | n/a | n/a | event=lead_email category=contact | low | preserve |
| `/valuation/` | inline form | "Request Valuation" | `action=mailto:${MIA.contact.email}?subject=Valuation Request — Mia Sanabria` | S1 → S2 | mailto | GHL Valuation pipeline | missing | first_name, last_name, email, phone, property_address, property_type, beds, baths, sqft, year_built, condition, timeline, motivation, message | source_page=/valuation, source_component=ValuationForm, utm_*, referrer, user_agent | required TCPA checkbox + visible "Mia or her team will follow up" copy (NO same-business-day / 5-day promise) | success → `/thank-you/valuation/`, error → retry + mailto fallback | event=lead_submit category=valuation | **P1 mailto deliverability** | route to GHL Valuation pipeline; custom GHL fields for property data |
| `/valuation/` | phone block | "Call Mia" | `tel:+19545400358` | S3 | direct ring | call-tracked ring | missing | n/a | n/a | n/a | n/a | event=lead_call category=valuation | P1 untracked | follow-up: Cycle 21-CALL-TRACKING |
| `/buyers/` | inline CTA | "Begin a Private Buyer Brief" | `/contact/?intent=buyer` *(query param suggestion, currently just `/contact/`)* | S1 | nav | nav with intent param → pre-fill GHL field `inquiry_type=buyer_brief` | missing | per Contact form + `intent=buyer_brief` | source_page=/buyers, source_component=BuyersInlineCTA, intent=buyer_brief | per Contact | per Contact | event=lead_click category=buyers | low | add `?intent=buyer_brief` query param at GHL cutover; UI label unchanged |
| `/sellers/` | inline CTA | "Request a Listing Conversation" | `/contact/?intent=seller` *(suggestion)* | S1 | nav | nav + intent | missing | per Contact + `intent=listing_conversation` | source_page=/sellers, intent=listing_conversation | per Contact | per Contact | event=lead_click category=sellers | low | add intent query param at GHL cutover |
| `/about/` | inline CTA | "Request a Private Conversation" | `/contact/` | S1 | nav | nav | missing | per Contact | source=about-cta | per Contact | per Contact | event=lead_click category=about | low | preserve |
| `/markets/[slug]/` (16) | footer CTA | "Begin a Private Conversation" | `/contact/?market={slug}` *(suggestion)* | S1 | nav | nav + market param → pre-fill GHL field `market` | missing | per Contact + `market={slug}` | source_page=/markets/{slug}, source_component=MarketFooterCTA, market={slug} | per Contact | per Contact | event=lead_click category=market | low | add `?market={slug}` query at GHL cutover; one CTA per page |
| `/markets/fort-lauderdale/` | PDF download cards (×3) | "Download …" | `/downloads/{slug}.pdf` | S4 | direct file download | optional: GHL form-then-download (email-gate); principal decision | missing | for gate: first_name, email, lead_magnet_requested={slug}, consent | source_page=/markets/fort-lauderdale, lead_magnet_requested={slug} | required at gate | success=PDF served via signed redirect, error=mailto link | event=lead_magnet_request category=download | **P2 ungated lead magnets** | **principal decision required** — gate at cutover or accept open distribution as funnel-top awareness asset |
| `/insights/[slug]/` (12) | inline soft CTA | "Begin a Private Conversation" | `/contact/?topic={slug}` *(suggestion)* | S1 | nav | nav + topic param | missing | per Contact + `topic={slug}` | source_page=/insights/{slug}, source_component=InlineInsightCTA, insight_topic={slug} | per Contact | per Contact | event=lead_click category=insights | low | add `?topic={slug}` query param at GHL cutover |
| `SiteHeader` (all pages, mobile + desktop) | phone CTA | "Call (954) 540-0358" | `tel:+19545400358` | S3 | direct ring | call-tracked ring | missing | n/a | n/a (call attribution is GHL-side) | n/a | n/a | event=lead_call category=header | **P1 untracked calls** | follow-up: Cycle 21-CALL-TRACKING |
| `SiteFooter` (all pages) | phone CTA | "Call (954) 540-0358" | `tel:+19545400358` | S3 | direct ring | call-tracked ring | missing | n/a | n/a | n/a | n/a | event=lead_call category=footer | **P1 untracked** | as above |
| `SiteFooter` (all pages) | email CTA | `msanabriarea@gmail.com` | `mailto:` | S2 | direct mail | direct mail | n/a | n/a | n/a | n/a | n/a | event=lead_email category=footer | low | preserve as belt-and-suspenders |
| Legal pages × 4 | inline | mailto link | `mailto:` | S2 | direct mail | direct mail | n/a | n/a | n/a | n/a | n/a | none | low | preserve (legal context) |
| `/thank-you/{,buyer-brief,market-brief,valuation}/` | static | "Return Home" | `/` | S7 | nav | nav | n/a | n/a | n/a | n/a | n/a | event=lead_thanks_view | **honesty risk** | review copy — must not imply CRM capture happened if it didn't; see `copy-consistency-audit.md` |

## 3. Target GHL field map (canonical)

The full schema the GHL cutover should request. Hidden fields are populated client-side at submit; consent fields are user-checked.

### Contact fields (visible)

| Field | Type | Required | Source value at fill |
|---|---|---|---|
| `first_name` | text | yes | user input |
| `last_name` | text | yes | user input |
| `email` | email | yes | user input |
| `phone` | tel | yes (in jurisdictions allowing) | user input |
| `inquiry_type` | enum (private_inquiry / buyer_brief / listing_conversation / valuation / general) | yes | derived from `intent` param or form-host page |
| `buyer_or_seller` | enum (buyer / seller / both / undecided) | optional | user select |
| `market` | enum (16 market slugs + "other") | optional | from `market` param or user select |
| `property_address` | text | conditional (valuation) | user input |
| `property_type` | enum (single-family / condo / townhouse / land / other) | optional | user select |
| `beds`, `baths`, `sqft`, `year_built` | numeric | optional (valuation) | user input |
| `condition` | enum (excellent / good / needs-work / unknown) | optional (valuation) | user select |
| `budget_or_price_range` | enum or numeric pair | optional | user input |
| `timeline` | enum (0–3mo / 3–6mo / 6–12mo / 12+mo / exploring) | optional | user select |
| `motivation` | text | optional (valuation) | user input |
| `message` | textarea | optional | user input |
| `preferred_contact_method` | enum (phone / email / text / no_preference) | optional | user select |

### Consent fields (visible)

| Field | Type | Required | Notes |
|---|---|---|---|
| `consent_checkbox` | checkbox | yes | label = the TCPA-aware text rendered visibly on the form |
| `consent_text` | hidden | yes | server-captured copy of the visible consent label (string-stable at submit time) |
| `consent_timestamp` | hidden | yes | ISO-8601 client clock; server overwrites with server clock for legal record |

### Hidden attribution fields (auto-filled)

| Field | Type | Source |
|---|---|---|
| `source_page` | string | `window.location.pathname` |
| `source_component` | string | hard-coded per form (ContactForm / ValuationForm / etc.) |
| `intent` | string | `URLSearchParams('intent')` if set |
| `market` | string | `URLSearchParams('market')` if set |
| `insight_topic` | string | `URLSearchParams('topic')` if set |
| `lead_magnet_requested` | string | only on lead-magnet gate forms |
| `utm_source` | string | `URLSearchParams('utm_source')` |
| `utm_medium` | string | `URLSearchParams('utm_medium')` |
| `utm_campaign` | string | `URLSearchParams('utm_campaign')` |
| `utm_term` | string | optional |
| `utm_content` | string | optional |
| `referrer` | string | `document.referrer` |
| `user_agent` | string | `navigator.userAgent` (truncated) |
| `landing_page` | string | first-pageview cookie / sessionStorage |
| `session_id` | string | client-side uuid in sessionStorage |
| `submitted_at` | ISO-8601 | client clock; server overwrites |
| `ip_capture_strategy` | n/a (server-side decision) | server records `X-Forwarded-For` per GHL contract; **principal decision** whether to retain |

**Total visible+hidden+consent fields:** 31 (above the 27-field floor in the mission packet).

## 4. Anti-checklist (no fake capture)

- [x] No form anywhere is wired to a fake-success path
- [x] No "Thanks, we'll be in touch" displayed unless an actual CRM record was created
- [x] No fabricated submission analytics
- [x] No fake-honored TCPA consent (consent must be checked AND stored)
- [x] No silent failure — if GHL webhook fails, the UI shows the mailto fallback link
- [x] No response-time guarantee in any form copy ("same business day", "within five business days" — both banned per Cycle 19C-COPY)

## 5. Thank-you page honesty review (S7)

The site currently ships four thank-you routes:
- `/thank-you/` (generic)
- `/thank-you/buyer-brief/`
- `/thank-you/market-brief/`
- `/thank-you/valuation/`

**These routes are not currently reached by any form submission** (forms are all `mailto:` which opens the user's mail client, not navigates the browser). The pages exist for the post-GHL future. Until GHL is wired, copy on these pages must NOT imply CRM capture happened — they should read as "if you got here, your inquiry was sent; if you're not sure, send it again or call." Phase 4 copy audit covers per-page line-by-line — see `copy-consistency-audit.md`.

## 6. Reverse map — every issue-matrix row that this map produces

The Phase-9 issue matrix should include one row per architectural gap below. Cross-references in `issue-matrix.md`:

| ID anchor | Title | Severity | Owner-type | Surface | Notes |
|---|---|---|---|---|---|
| ISS-001 | All forms route to mailto: rather than GHL webhook | P1 | 4 (GHL) | S1 | architectural ceiling — Phase 11 plan |
| ISS-002 | mailto deliverability silently fails on mobile without configured Mail.app | P1 | 4 (GHL) | S2 | belt-and-suspenders: live form fallback to copy-able email + visible "If your mail app didn't open, write to …" |
| ISS-003 | Phone calls are an unobserved lead channel | P1 | 4 (GHL) | S3 | named follow-up: Cycle 21-CALL-TRACKING |
| ISS-004 | IDX iframe captures leads at sef.mlsmatrix.com, outside Mia's CRM | P1 | 3 (principal) | S5 | options: wrapper-side handoff CTA / vendor lead-routing negotiation / accept the leak |
| ISS-005 | Lead-magnet PDFs are ungated | P2 | 3 (principal) | S4 | principal decision — gate or accept open distribution |
| ISS-006 | Forms have no UTM / referrer / source attribution wiring | P2 | 4 (GHL) | S1 | included in Phase 11 plan |
| ISS-007 | Forms have no TCPA consent capture | P1 | 5 (legal) | S1 | legal review needed alongside GHL cutover; copy + storage spec in Phase 11 plan |
| ISS-008 | Forms have no honeypot / Turnstile / reCAPTCHA spam protection | P2 | 4 (GHL) | S1 | included in Phase 11 plan |
| ISS-009 | `?intent=`, `?market=`, `?topic=` query-param plumbing not wired into CTAs | P2 | 4 (GHL) | S1 | wire at GHL cutover; UI labels unchanged |
| ISS-010 | Thank-you pages exist but are unreachable (mailto opens external client, not browser nav) | P3 | 4 (GHL) | S7 | wired at GHL cutover; copy must not lie about capture in interim — see `copy-consistency-audit.md` |
