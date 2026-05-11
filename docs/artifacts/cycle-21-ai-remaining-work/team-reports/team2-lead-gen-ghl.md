# Cycle 21 AI-REMAINING-WORK — Team 2 Report: Lead Generation & GHL Architecture

> Read-only mapping pass. No source edits. Builds on `docs/artifacts/cycle-20-agency-qa/lead-flow-map.md` + `ghl-webhook-implementation-plan.md`. Verifies actual current source vs. cycle-20 snapshot, surfaces drift, identifies what AI can safely scaffold WITHOUT live GHL.

## Section 1 — Lead-Flow Map v2 (verified-from-source)

| # | Path | Type | Destination today | CRM today? | What's needed |
|---|------|------|-------------------|-----------|---------------|
| L1 | `/contact/` form (`<form action="mailto:msanabriarea@gmail.com" encType="text/plain">`) | real form, mailto | user's default mail client | NO | GHL webhook + hidden attribution fields + TCPA consent + honeypot |
| L2 | `/valuation/` form (same pattern) | real form, mailto | user's default mail client | NO | GHL webhook (Valuation pipeline) + 13 property fields + TCPA + honeypot |
| L3 | `/contact/` phone block `tel:+19545400358` | phone-only | rings Mia's personal cell | NO | call-tracking (out of scope — Cycle 21-CALL-TRACKING) |
| L4 | `/contact/` email block (text + mailto) | mailto | user's mail client | NO (manual triage) | leave as belt-and-suspenders fallback |
| L5 | `/valuation/` phone block | phone-only | rings personal cell | NO | call-tracking — same dep |
| L6 | Hero CTA `/` primary "Begin a Private Conversation" → `/contact/` (no params) | nav | contact page | NO attribution | add `?source=home-hero` |
| L7 | Hero CTA `/` secondary "Request Home Valuation" → `/valuation/` (no params) | nav | valuation page | NO attribution | add `?source=home-hero-secondary` |
| L8 | `IntentRouter` 3 cards → `/valuation/`, `/buyers/`, `/markets/` (no params) | nav | landing page | NO attribution | add `?source=home-intent-{slot}` |
| L9 | `CTAStrip` "Request Private Consultation" → `/contact/` (no params) | nav | contact page | NO attribution | add `?source={page}-ctastrip` per consumer |
| L10 | `CTAStrip` "Call Mia (954) 540-0358" `tel:` | phone-only | personal cell | NO | call-tracking dep |
| L11 | `IdxEmbed` iframe (`sef.mlsmatrix.com`) | external IDX vendor | sef.mlsmatrix.com captures leads | NO (leak to vendor) | wrapper-side handoff CTA `/contact/?intent=private-inquiry&source=home-idx-handoff` (component edit OK — no GHL dep) |
| L12 | `/buyers/` hero primary `?intent=buyer` | nav | contact page | NO capture, **partial attribution** (intent only) | preserve; add `&source=buyers-hero`; rename `intent=buyer` → `buyer-brief` for vocab parity with wrapper CTAs |
| L13 | `/buyers/` AnswerFirst CTA `?intent=buyer` | nav | contact page | partial attribution | same as L12 |
| L14 | `/buyers/` `CTAStrip` (no params) | nav | contact page | NO attribution | needs source param via CTAStrip prop |
| L15 | `/sellers/` hero primary `?intent=seller` | nav | contact page | partial | preserve; rename to `listing-conversation`; add `&source=sellers-hero` |
| L16 | `/sellers/` hero secondary `/valuation/` (no params) | nav | valuation page | NO attribution | add `?source=sellers-hero-secondary` |
| L17 | `/sellers/` AnswerFirst CTA `/valuation/` (no params) | nav | valuation page | NO attribution | add `?source=sellers-af` |
| L18 | `/sellers/` `CTAStrip` (no params) | nav | contact page | NO attribution | same as L14 |
| L19 | `/markets/[slug]/` aside lines 201-212 — `/contact/` + `/valuation/` (NO params) | nav | static landing | **NO market/source attribution** | add `?market={slug}&source=market-{slug}-aside` to BOTH links |
| L20 | `/markets/[slug]/` buyer aside `?intent=buyer` (line 266) | nav | contact page | partial attribution | rename to `buyer-brief`; add `&market={slug}&source=market-{slug}-buyer` |
| L21 | `/markets/[slug]/` seller aside `/valuation/` (line 302) | nav | valuation page | NO attribution | add `?market={slug}&source=market-{slug}-seller` |
| L22 | `/markets/` index `?intent=market-brief` | nav | contact page | partial attribution | add `&source=markets-index` |
| L23 | `/markets/fort-lauderdale/` (FortLauderdaleV2) — 7 fully-tagged CTAs | nav | contact + valuation | partial (intent+market+source on URL, but form discards) | **reference implementation**; preserve verbatim |
| L24 | `/markets/fort-lauderdale/` 3 PDF downloads `/downloads/{slug}.pdf` | download-only | static PDF served | NO capture | **principal locked**: ungated per FortLauderdaleV2 comment. Leave as-is. |
| L25 | `/about/` "Request a Private Conversation" (uses `PrivateConsultationCTA`) | nav | contact page | partial attribution | pass `source="about-cta"` prop (already supported) |
| L26 | `/insights/[slug]` `InlineInsightCTA` (12 posts) | nav | contact OR markets OR valuation per post | partial (each insight ships `?source=insights-NN`) | preserve; consider adding `&topic={slug}` for primary CTAs that land on `/contact/` (currently absent) |
| L27 | `/insights/[slug]` `LeadCaptureCTA` (12 posts, post-attached) | nav | varies per `primaryCTA.href` | partial (source param baked in) | preserve; same `topic={slug}` augmentation opportunity |
| L28 | `/insights/` index — `PrivateConsultationCTA source="insights-index"` | nav | contact page | partial | preserve |
| L29 | `SiteHeader` (all pages, desktop + mobile) — `tel:+19545400358` (×2) | phone-only | personal cell | NO | call-tracking dep |
| L30 | `SiteFooter` (all pages) — `tel:+19545400358` | phone-only | personal cell | NO | call-tracking dep |
| L31 | `SiteFooter` — `mailto:msanabriarea@gmail.com` | mailto | user's mail client | NO | preserve as fallback |
| L32 | `/dmca/` (×2), `/privacy/` (×4), `/accessibility/`, `/terms/` — `mailto:` | mailto (legal context) | user's mail client | NO | preserve — legal context, not a lead surface |
| L33 | `/privacy/` (×2), `/accessibility/`, `/terms/` — `tel:` (legal context) | phone-only | personal cell | NO | preserve — legal context |
| L34 | `/thank-you/` + 3 sub-pages "Return Home" + insights links | nav post-conversion | static landing | n/a | not a lead surface |
| L35 | `/downloads/[slug]/` route (HTML print source for PDFs) | download-only build artifact | rendered by `render-lead-magnets.ts` | n/a | NOT a public lead surface (noindex, PDF source) |

**Surface count (verified):** 35 distinct lead-relevant rows · 5 inbound surface types (form / mailto / tel / IDX-iframe / PDF-download) + nav-to-form.

**Capture-state summary:**
- Real CRM capture today: **0** (no GHL env, no webhook)
- Form → mailto fallback: **2** (`/contact/`, `/valuation/`)
- Mailto links (text/footer/legal): **14**
- Tel links (phone-only, untracked): **11**
- IDX iframe leak to sef.mlsmatrix.com: **1**
- Ungated PDF downloads (principal-locked): **3**
- Nav-to-form rows (no GHL touch needed, just attribution): **17** (L6–L9, L12–L18, L20–L22, L25)

## Section 2 — GHL Webhook Field Map v2

Schema preserved verbatim from `cycle-20-agency-qa/lead-flow-map.md` §3. v2 adds the **server-side / form-side mapping** column: what the source field is named in the JSX today, where the value comes from at submit, and which thank-you redirect lands the user.

### Contact form (`/contact/`) → `GHL_INQUIRY_WEBHOOK_URL`

| Form field (visible) | JSX `name` today | Type | Required | Source value at submit | UTM/source mapping | Thank-you URL |
|---|---|---|---|---|---|---|
| first_name | `firstName` (rename at GHL wire) | text | yes | user input | n/a | per-intent |
| last_name | `lastName` | text | yes | user input | n/a | per-intent |
| email | `email` | email | yes | user input | n/a | per-intent |
| phone | `phone` | tel | yes | user input | n/a | per-intent |
| inquiry_type | (missing — derive) | enum | yes | `URLSearchParams('intent')` → `buyer-brief` / `listing-conversation` / `private-consultation` / `private-inquiry` / `waterfront-review` / `dockage-review` / `market-brief` / `consultation` (current values in source) | n/a | per-value |
| interest (`Buying — Fort Lauderdale` etc.) | `interest` | enum | no | user select | n/a | per-intent |
| message | `message` | textarea | no | user input | n/a | per-intent |
| consent_checkbox | **MISSING (P1)** | checkbox | yes | user check | n/a | n/a |
| consent_text | **MISSING (P1)** | hidden | yes | exact visible consent label string | n/a | n/a |
| consent_timestamp | **MISSING (P1)** | hidden | yes | `new Date().toISOString()` at submit | n/a | n/a |
| source_page | **MISSING — safe to scaffold** | hidden | yes | `window.location.pathname` | n/a | n/a |
| source_component | **MISSING — safe to scaffold** | hidden | yes | hard-coded `ContactForm` | n/a | n/a |
| intent | **MISSING — safe to scaffold** | hidden | optional | `URLSearchParams('intent')` | n/a | n/a |
| market | **MISSING — safe to scaffold** | hidden | optional | `URLSearchParams('market')` | n/a | n/a |
| insight_topic | **MISSING — safe to scaffold** | hidden | optional | `URLSearchParams('topic')` | n/a | n/a |
| source | **MISSING — safe to scaffold** | hidden | optional | `URLSearchParams('source')` | n/a | n/a |
| utm_source/medium/campaign/term/content | **MISSING — safe to scaffold** | hidden ×5 | optional | `URLSearchParams('utm_*')` | n/a | n/a |
| referrer | **MISSING — safe to scaffold** | hidden | optional | `document.referrer` | n/a | n/a |
| user_agent | **MISSING — safe to scaffold (truncated)** | hidden | optional | `navigator.userAgent` slice 0-200 | n/a | n/a |
| landing_page | **MISSING — safe to scaffold** | hidden | optional | `sessionStorage('landing_page')` | n/a | n/a |
| session_id | **MISSING — safe to scaffold** | hidden | optional | `sessionStorage('session_id')` (crypto.randomUUID once) | n/a | n/a |
| submitted_at | **MISSING — safe to scaffold** | hidden | yes | `new Date().toISOString()` at submit | n/a | n/a |
| honeypot `company` | **MISSING (P2)** | hidden text input | client filter | bot fills; server discards | n/a | n/a |

**Thank-you URL redirect map (already-built routes):**
| intent param value | redirect-on-success target |
|---|---|
| `buyer-brief`, `buyer` | `/thank-you/buyer-brief/` |
| `listing-conversation`, `seller` | `/thank-you/market-brief/` (verify with Torrey — could also map to a future seller-conversation route) |
| `market-brief` | `/thank-you/market-brief/` |
| `private-consultation`, `private-inquiry`, `consultation` | `/thank-you/` |
| `waterfront-review`, `dockage-review` | `/thank-you/` (default — no dedicated route) |

### Valuation form (`/valuation/`) → `GHL_VALUATION_WEBHOOK_URL`

| Form field (visible) | JSX `name` today | Type | Required | Source value at submit | UTM/source mapping | Thank-you URL |
|---|---|---|---|---|---|---|
| property_address | `address` | text | yes | user input | n/a | `/thank-you/valuation/` |
| city | `city` | text | yes | user input | n/a | same |
| beds | `bedrooms` | number | no | user input | n/a | same |
| baths | `bathrooms` | number | no | user input | n/a | same |
| upgrades / motivation | `upgrades` | textarea | no | user input | n/a | same |
| first_name | `firstName` | text | yes | user input | n/a | same |
| last_name | `lastName` | text | yes | user input | n/a | same |
| email | `email` | email | yes | user input | n/a | same |
| phone | `phone` | tel | no | user input | n/a | same |
| consent_*, source_*, utm_*, etc. | identical to contact form (currently all missing) | hidden | mixed | as above | as above | `/thank-you/valuation/` |

**Field-vocab mismatches surfaced (P3):** existing JSX uses `firstName` / `lastName` / `bedrooms` / `bathrooms` / `address` / `upgrades`; the GHL schema uses `first_name` / `last_name` / `beds` / `baths` / `property_address` / `motivation`. At GHL wire-up, map at the client (`src/lib/ghl.ts`) — do not rename JSX `name` attributes (browser autocomplete cares about `autoComplete` attribute, which is fine; but renaming creates a downstream stale-form-data event for any in-flight browser sessions). Map at submit; do not rename in markup.

### Intent-value vocabulary drift (P2 — separate from GHL wire)

Current `intent=` values in source: `buyer-brief`, `buyer`, `listing-conversation`, `seller`, `consultation`, `private-consultation`, `market-brief`, `private-inquiry`, `waterfront-review`, `dockage-review`. **Three of these are pairs that mean the same thing (`buyer`/`buyer-brief`, `seller`/`listing-conversation`, `consultation`/`private-consultation`)**. At GHL cutover, normalize at the form-submit boundary: read `intent`, map via a tiny canonicalizer in `src/lib/intent.ts`, send the canonical name. Markup untouched. Owner-type 4.

## Section 3 — GHL Implementation Backlog

| Item | Description | Blocks on |
|---|---|---|
| **B1. Env provisioning** | `~/.claude/.env` must hold `GHL_INQUIRY_WEBHOOK_URL`, `GHL_VALUATION_WEBHOOK_URL`, optional `GHL_PIT`, `GHL_LOCATION_ID`, `GHL_ENABLED` master flag, `GHL_WEBHOOK_ENV` (`test`/`live`) | Torrey provisions in GHL UI (1-2h) |
| **B2. `src/lib/ghl.ts`** | client-only POST helper: `submitLead(payload, target)`, reads `process.env.NEXT_PUBLIC_GHL_*` at build time, handles network errors, returns `{ok, error?}` | B1 |
| **B3. Custom GHL fields** | 27 fields per §3 of cycle-20 plan must exist in GHL UI before first submit | Torrey |
| **B4. Client validation** | required-field client-side validation (current form is `noValidate` with `required` attrs); add a tiny in-form Zod or hand-rolled validator before POST | B2 |
| **B5. Retry / fallback** | on 5xx or network error: surface inline error UI + visible mailto fallback link (preserve current mailto as the honest fallback path) | B2 |
| **B6. Audit log** | minimum-viable: append a GHL contact note with `consent_text`, `consent_timestamp`, `user_agent`, `referrer`, delivery status. Storage: GHL contact note field. | B3 |
| **B7. TCPA consent capture** | visible checkbox (required), `consent_text` hidden field captures the verbatim visible label at submit time, `consent_timestamp` captures ISO-8601 | **legal counsel signoff required** before placeholder ships |
| **B8. Honeypot + Turnstile** | hidden `company` text input (always present, always discarded server-side) + Cloudflare Turnstile widget on form mount. No reCAPTCHA. | B2 |
| **B9. Thank-you redirect logic** | on `{ok: true}`, `window.location.assign(thankYouFor(intent))`; on error stay on form + show retry + mailto fallback | B2 |
| **B10. Error UX copy** | inline error must NOT promise response time, MUST surface mailto link, MUST avoid blame language ("temporary issue — please email …" not "submission failed") | own work item |
| **B11. Build-time env enforcement** | if `GHL_ENABLED=true` but a webhook URL is missing, `bun run build` should fail loudly (prevents accidentally shipping broken capture) | B2 |
| **B12. Test pass** | per cycle-20 plan §12: 10-step procedure; document in `docs/CYCLE_21_GHL_TEST_PROCEDURE.md` with screenshots | B1-B11 |

### Out of scope for any AI scaffolding this cycle (read-only confirmation)

- GHL webhook URL provisioning — Torrey only
- GHL custom field creation — Torrey only
- TCPA consent legal signoff — counsel
- Call tracking (Cycle 21-CALL-TRACKING — separate cycle)
- Lead-magnet gating — **principal-locked** as ungated per FortLauderdaleV2 comment + cycle-20 §7
- IDX vendor lead-routing negotiation (business, not code)

## Section 4 — Safe AI Scaffolding Candidates (ships WITHOUT live GHL)

These edits are honest, reversible, and do NOT create the appearance of capture. They prepare the surface so GHL wire-up is a leaf edit. Each has zero dependency on `GHL_*` env values.

| # | Scaffold | What it does | What it does NOT do | Risk | Owner |
|---|---|---|---|---|---|
| **A1** | Add hidden `<input type="hidden">` carriers in both `/contact/` and `/valuation/` forms for `source_page`, `source_component`, `intent`, `market`, `insight_topic`, `source`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `referrer`, `landing_page`, `session_id`, `submitted_at` | Provides hidden fields a future `submitLead()` POST can include; mailto still posts the visible fields only (mailto + `text/plain` ignores hidden inputs anyway — no UX change today) | Does NOT capture leads, does NOT enable analytics, does NOT promise anything | Low — fields are dormant carriers; visible UX identical | 2 |
| **A2** | Add a tiny client hook `useLeadAttribution()` (or inline `useEffect`) that, on form mount, reads `URLSearchParams` + `document.referrer` + sessionStorage and populates the A1 hidden inputs via `defaultValue` | Pre-fills hidden carriers from current URL/session; ready for GHL wire | Does NOT submit anywhere, does NOT track | Low — client-only DOM mutation of hidden fields | 2 |
| **A3** | Honest "form opens email app" copy review — current contact form already includes a fallback notice ("This form opens your default email app … Direct lead capture is being finalized"). VERIFY both contact + valuation forms carry parallel honest copy. | Confirms honesty contract is still met | Does NOT change behavior | None — read-only verify | 1 |
| **A4** | Add a hidden honeypot `<input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden>` to both forms NOW with `display:none` (CSS class `sr-only`-style off-screen). When GHL wires up, the server filter activates; before that, it's inert. | Pre-shapes spam protection for the GHL cutover | Does NOT filter anything today (no server) | None — inert hidden field | 2 |
| **A5** | Add `?source={market-slug}-aside` to `/markets/[slug]/page.tsx` lines 202, 208, 266, 302 (the four CTAs missing all attribution); also add `&market={slug}` to the two `/contact/` links | Attribution-only patch: the 16 non-Fort-Lauderdale market pages currently have ~0% attribution; this brings them to parity with FortLauderdaleV2 | Does NOT create CRM records | Low — pure URL augmentation | 1 |
| **A6** | Add `?source=home-{slot}` to `Hero` (`src/app/page.tsx` lines 86-87), `IntentRouter` (3 links), `CTAStrip` (1 link) | Attribution for homepage CTAs — currently all source-blank | Does NOT create CRM records | Low — pure URL augmentation | 1 |
| **A7** | Add `?source=buyers-hero`, `?source=sellers-hero`, `?source=sellers-hero-secondary`, `?source=sellers-af`, `?source=about-cta` to the corresponding hero/strip links on `/buyers/`, `/sellers/`, `/about/`, plus the buyer-page CTAStrip | Attribution closure for the principal landing pages | Does NOT create CRM records | Low — pure URL augmentation | 1 |
| **A8** | Normalize `intent=buyer` → `intent=buyer-brief`, `intent=seller` → `intent=listing-conversation` at the **markup level** (so URL vocab matches the wrapper-CTA vocab Mia's FortLauderdaleV2 already uses) | Removes vocab drift before GHL wire | Could (theoretically) break analytics if any external link or bookmark targets the legacy values — **risk assessment: low** since the site is pre-launch with no inbound external links | Low-Med — depends on whether any docs/social profiles already link to `?intent=buyer` (verify: none found in source) | 1 |
| **A9** | Add an `IdxEmbed` wrapper-side handoff CTA — a Link below the iframe pointing to `/contact/?intent=private-inquiry&source=home-idx-handoff&topic=idx-search` (component-side only; iframe preserved verbatim) | Captures intent for users who finished IDX search and want to talk to Mia | Does NOT route IDX iframe traffic away from sef.mlsmatrix.com (preserves vendor agreement) | Low — additive component change | 1 |
| **A10** | Add an env-aware feature flag scaffold in `src/lib/site.ts` or new `src/lib/ghl-flag.ts` — exports `GHL_ENABLED: boolean` from `process.env.NEXT_PUBLIC_GHL_ENABLED === "true"`, defaults `false`. Forms read this and branch (today: always false → mailto; future: true → fetch). | Skeleton for B11 build-time enforcement | Does NOT enable capture; flag stays false until Torrey provisions env | None — flag scaffold | 2 |
| **A11** | Fix `/thank-you/` response-time promise — current copy reads "_typically the same business day, occasionally the next_" (line 46 of `src/app/thank-you/page.tsx`). This violates the cycle-19C / CLAUDE.md ban on response-time promises. Replace with the language used on the buyer-brief + valuation + market-brief thank-you pages ("Mia will respond personally when she has the time to give it the attention it deserves"). | Restores honesty contract | Does NOT change capture | None — copy-only edit, exact replacement language exists on sibling pages | 1 |
| **A12** | Add `&topic={post.slug}` to insight-page `primaryCTA.href` values in `src/data/insights/*.ts` for the 9 posts whose primary CTA lands on `/contact/` (cycle-20 §3 spec). The `source=insights-NN` already present is preserved. | Attribution closure for insights | Does NOT change visible UX | Low — pure URL augmentation in data layer | 1 |

**Total safe scaffolding items: 12** (A1-A12). A1-A4, A10 prepare the substrate. A5-A9, A11-A12 are surface-attribution / honesty patches that can ship independently and don't depend on each other.

### Non-negotiables actively respected by this list

- No fake GHL capture
- No fabricated TCPA consent (A4 is inert honeypot; no consent checkbox shipped without legal signoff)
- No fake audit log / analytics
- Mailto fallback preserved on every form (A1 adds dormant hidden fields; mailto + `text/plain` ignores them)
- No response-time promises (A11 REMOVES the one existing violation; introduces nothing new)
- No fair-housing language
- IDX iframe preserved verbatim (A9 is a wrapper-side ADDITION, not a replacement)

## Section 5 — Issue Rows (TSV)

```
id	team	page	category	issue	evidence	severity	impact	recommended_fix	owner_type	effort	confidence	can_fix_now	files_affected	verify_method
T2-001	team2	/thank-you/	honesty	Response-time promise violates CLAUDE.md ban	src/app/thank-you/page.tsx:46 "typically the same business day, occasionally the next"	P1	medium	Replace with sibling-page language: "Mia will respond personally when she has the time to give it the attention it deserves"	1	S	high	yes	src/app/thank-you/page.tsx	bun run audit:stale && grep -n "business day" src/
T2-002	team2	contact-form	capture	Form is mailto: with encType=text/plain; no GHL webhook, no hidden attribution, no consent capture	src/app/contact/page.tsx:109-197 — form action is mailto, no hidden inputs, no consent checkbox	P1	high	Wire to GHL webhook per cycle-20 plan §4 once env provisioned; until then scaffold dormant hidden attribution inputs (A1) and feature flag (A10)	4	L	high	scaffolding only (A1+A10); full wire blocks on GHL env	src/app/contact/page.tsx, src/lib/ghl.ts (new), src/lib/ghl-flag.ts (new)	form submit test against test webhook; per cycle-20 §12
T2-003	team2	valuation-form	capture	Same mailto-only architecture as T2-002, with 13 property-specific fields lost to mailto encoding	src/app/valuation/page.tsx:102-187	P1	high	Wire to GHL Valuation pipeline; same scaffolding plan as T2-002	4	L	high	scaffolding only	src/app/valuation/page.tsx, src/lib/ghl.ts	per cycle-20 §12
T2-004	team2	contact-form,valuation-form	consent	No visible TCPA consent checkbox; helper text below button is informational not a consent capture	src/app/contact/page.tsx:191-196 (helper para, no checkbox); src/app/valuation/page.tsx:181-186 (same)	P1	high	Add required checkbox + hidden consent_text + consent_timestamp at GHL cutover; placeholder copy must be marked data-pending-legal until counsel signs off	5	M	high	no — blocks on counsel	src/app/contact/page.tsx, src/app/valuation/page.tsx, src/lib/legal.ts (new)	verify checkbox required at submit; verify consent_text payload exact-match visible label
T2-005	team2	contact-form,valuation-form	attribution	No hidden attribution carriers; URL params (?intent=, ?market=, ?source=, ?topic=, utm_*) are baked into many CTA hrefs but the forms discard them	src/app/contact/page.tsx (no hidden inputs); src/app/valuation/page.tsx (no hidden inputs); CTAs at e.g. src/components/markets/FortLauderdaleV2.tsx:410-411, 524, 774, 853, 957, 1005-1023 carry intent/market/source	P2	high	A1+A2: dormant hidden inputs + URL-param read on mount; payload-ready for GHL wire	2	M	high	yes (A1+A2 scaffold only)	src/app/contact/page.tsx, src/app/valuation/page.tsx	view-source on form HTML; window.URLSearchParams in browser console after navigating from a tagged CTA
T2-006	team2	contact-form,valuation-form	spam	No honeypot, no Turnstile, no captcha	src/app/contact/page.tsx, src/app/valuation/page.tsx	P2	medium	A4: inert hidden honeypot today; Turnstile activates at GHL cutover	2	S	high	yes (A4 inert scaffold)	src/app/contact/page.tsx, src/app/valuation/page.tsx	view-source for company input
T2-007	team2	/markets/[slug]/	attribution	Aside CTAs (lines 202, 208, 266, 302) have NO market or source params — 16 non-Fort-Lauderdale market pages drop attribution at the most important conversion surface	src/app/markets/[slug]/page.tsx:201-212, 259-270, 295-307	P2	high	A5: add ?market={slug}&source=market-{slug}-{aside|buyer|seller} to all four anchors; rename intent=buyer to intent=buyer-brief for vocab parity	1	S	high	yes	src/app/markets/[slug]/page.tsx	grep -n "href=\"/contact/\"" src/app/markets/[slug]/page.tsx returns 0
T2-008	team2	/	attribution	Hero (lines 86-87), IntentRouter (3 cards), CTAStrip default (1 link) all hit /contact/ or /valuation/ with NO source param	src/app/page.tsx:86-87; src/components/IntentRouter.tsx:5-22; src/components/CTAStrip.tsx:21	P2	medium	A6: add ?source=home-hero / home-hero-secondary / home-intent-{slot} / home-ctastrip	1	S	high	yes	src/app/page.tsx, src/components/IntentRouter.tsx, src/components/CTAStrip.tsx	grep -n source= on the three files post-edit
T2-009	team2	/buyers/,/sellers/,/about/	attribution	Hero CTAs and CTAStrip on /buyers/, /sellers/, /about/ drop source attribution	src/app/buyers/page.tsx:116 (has intent= but no source=); src/app/sellers/page.tsx:116-117 (same); src/app/sellers/page.tsx:127 (cta on AnswerFirst); src/app/buyers/page.tsx CTAStrip; src/app/sellers/page.tsx CTAStrip	P3	medium	A7: add &source=buyers-hero / sellers-hero / sellers-hero-secondary / sellers-af / about-cta	1	S	high	yes	src/app/buyers/page.tsx, src/app/sellers/page.tsx, src/app/about/page.tsx, src/components/CTAStrip.tsx	grep on edited files
T2-010	team2	contact-form,valuation-form	field-vocab	JSX name attrs (firstName, lastName, bedrooms, bathrooms, address, upgrades) differ from canonical GHL schema (first_name, last_name, beds, baths, property_address, motivation)	src/app/contact/page.tsx field names; src/app/valuation/page.tsx field names	P3	low	Map at submit-time in src/lib/ghl.ts; do NOT rename JSX names (browser autofill is keyed off autoComplete attr which is correct)	4	S	high	no — defer to GHL wire	src/lib/ghl.ts (new)	test webhook payload field name verification
T2-011	team2	site-wide intents	vocab-drift	intent=buyer vs intent=buyer-brief, intent=seller vs intent=listing-conversation, intent=consultation vs intent=private-consultation all live in source today	grep "intent=" src — 10 distinct values for ~5 concepts	P3	low	A8: normalize markup to canonical {buyer-brief, listing-conversation, private-consultation, private-inquiry, market-brief, waterfront-review, dockage-review}	1	S	med	yes (verify no external links bookmark legacy values — none in source)	src/app/buyers/page.tsx, src/app/sellers/page.tsx, src/app/markets/[slug]/page.tsx	grep "intent=buyer\"\|intent=seller\"\|intent=consultation\"" returns 0
T2-012	team2	/	idx-leak	IDX iframe captures leads at sef.mlsmatrix.com — not in Mia's CRM (per cycle-20 ISS-004)	src/components/IdxEmbed.tsx:1-42 — iframe to sef.mlsmatrix.com, no wrapper handoff CTA	P1	high	A9: ADD wrapper-side handoff CTA below iframe, preserve iframe verbatim	1	S	high	yes	src/components/IdxEmbed.tsx	view rendered /  + verify new CTA below iframe, iframe src unchanged
T2-013	team2	header,footer,contact,valuation,CTAStrip,legal-pages	call-tracking	tel:+19545400358 sitewide rings personal cell; calls are an unobserved lead channel	11 tel: occurrences across 8 files	P1	high	Out of scope this cycle — Cycle 21-CALL-TRACKING dependency; document only	4	L	high	no	src/lib/mia.ts MIA.contact.phoneTel	none this cycle
T2-014	team2	/markets/fort-lauderdale/	lead-magnet	3 PDF downloads ungated (principal-locked per FortLauderdaleV2 comment + cycle-20 §7)	src/components/markets/FortLauderdaleV2.tsx:826,835,844	P3	low	No change — principal decision	3	-	high	no — locked	-	none
T2-015	team2	/insights/[slug]/	attribution	Primary CTAs in 9 insight posts that land on /contact/ carry source=insights-NN but no topic={slug} — drops the topic dimension cycle-20 plan §3 specifies	src/data/insights/*.ts primaryCTA.href values	P3	medium	A12: add &topic={post.slug} to each insights primaryCTA.href landing on /contact/	1	S	high	yes	src/data/insights/01-12*.ts	grep "topic=" src/data/insights returns >=9 hits post-edit
T2-016	team2	/contact/,/valuation/	mailto-deliverability	mailto: + encType=text/plain opens user's default mail client; mobile users without Mail.app configured silently fail (per cycle-20 ISS-002)	src/app/contact/page.tsx:111-112; src/app/valuation/page.tsx:104-105	P2	medium	No fix until GHL wire; current honest fallback copy already present (lines 121-131 contact, 114-124 valuation); verify both pages carry parallel honest copy (A3)	4	S	high	A3 verify-only	src/app/contact/page.tsx, src/app/valuation/page.tsx	visual check; deliverability tested at GHL wire-up
T2-017	team2	/contact/,/valuation/	build-flag	No GHL_ENABLED feature flag — build won't catch the case of GHL_ENABLED=true with missing webhook URL	(none in src/lib/)	P3	low	A10: add src/lib/ghl-flag.ts skeleton; activate at GHL wire (B11)	2	S	high	yes (A10 skeleton only)	src/lib/ghl-flag.ts (new)	bun run typecheck
```

## Section 6 — Confidence + Dissent

**Confidence: high (4/5)** on the lead-flow map (verified directly against source — 35 rows confirmed from grep + read). **High** on the safe-scaffolding list (every item maps to a concrete file edit with a non-destructive change). **Medium** on the issue-row severities: P1 vs P2 calls inherit cycle-20 grading; T2-001 (response-time promise) is a confirmed CLAUDE.md doctrine violation so high-confidence P1. **Medium** on T2-011 (intent-vocab normalization): the risk depends on whether any social profile, business card, or off-repo doc links to legacy `?intent=buyer` URLs — I verified none in source, but cannot verify external bookmarks.

**Dissent from cycle-20 lead-flow map:**
1. **Surface S5 (IDX iframe) wrapper CTA is shippable now, not GHL-gated** — the cycle-20 plan implies it depends on GHL (ISS-004 row labeled "P1 lead leak"). Re-read of plan §1 confirms it IS budget-permitting / no-GHL-dep. Including as A9.
2. **`/thank-you/` response-time promise is a CLAUDE.md violation, not just a cycle-20 honesty risk** — bumping to P1. The sibling thank-you pages (`buyer-brief`, `market-brief`, `valuation`) already use the doctrine-compliant language; replacing the generic page with parallel copy is a 1-line edit.
3. **Field-vocab drift (T2-010) is a P3 not P2** — cycle-20 plan §4 implies renaming JSX names at GHL cutover. I argue the JSX names should NOT change (browser autofill, in-flight form state, accessibility); the rename happens in `src/lib/ghl.ts` at submit time. Same outcome, less risk.
4. **Honeypot can scaffold today (A4) as an inert hidden input** — cycle-20 §8 implied this is part of the GHL cutover. The honeypot is filter-side, but the markup is dormant-safe; shipping the hidden input now removes one item from the cutover-day diff.
5. **Cycle-20 §3 listed 31 fields; this report's full enumeration is 33** — added `source` (the param), `landing_page`, `session_id` already in the cycle-20 list; recount the row in §2 matches cycle-20 with no contradiction (small count drift, not substantive).

**Unresolved (need principal call):**
- Should `?intent=buyer-brief` redirect on success go to `/thank-you/buyer-brief/` or `/thank-you/`? Cycle-20 §10 says `buyer-brief` → buyer-brief route. Confirm.
- Is the `/thank-you/market-brief/` route the right landing for `intent=listing-conversation` or should we add `/thank-you/listing-conversation/`? The market-brief copy speaks to a "private market brief" subscription concept, NOT a listing conversation — these may be distinct user intents lumped onto one thank-you page.
- TCPA consent copy in cycle-20 §2C is "placeholder until counsel approves." Pre-cutover, do we leave the inert helper text? My read of CLAUDE.md says yes — the current helper-text copy ("By submitting, you agree to receive a private response …") is honest about what the form does (opens email app) and what consent the user is giving.
