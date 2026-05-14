# Lane H — Google / Measurement / Search Console Readiness Dossier

**Author lens:** Google / Measurement / Search Console Advisor
**Scope:** prepare GA4 / GTM / Consent Mode v2 / Search Console / Bing Webmaster / GBP work. No Google writes. No GTM install. No production canonical change.
**Inputs reviewed:** `src/app/layout.tsx`, live CSP header, Cycle 23 GA4-honesty audit, project CLAUDE.md "GA4 ID `G-PYYSF87G8K` referenced but not wired", `docs/CYCLE_22_REMAINING_GAP_CLOSURE/MIA_DECISION_PACKET.md` consent text, Cycle 24 canonical doctrine.

## Current status

| Layer | Status |
|---|---|
| **CSP allows Google domains** | yes — live `content-security-policy: ... script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; ... connect-src 'self' https://www.google-analytics.com; frame-src 'self' https://sef.mlsmatrix.com https://www.google.com https://maps.google.com;` — verified Cycle 30 Phase 2 live HEAD. |
| **GTM container script in HTML** | **not present** — confirmed by live HTML grep for `googletagmanager.com/gtm.js`. |
| **GA4 measurement ID** | known per Cycle 23 + project CLAUDE.md: **`G-PYYSF87G8K`**. Not wired. |
| **Consent Mode v2** | text exists in `/privacy/`; **not wired** to GTM default-deny. No banner UI in live HTML. |
| **Search Console verification** | blocked on canonical cutover. |
| **Bing Webmaster verification** | blocked on canonical cutover. |
| **GBP "Website" field** | blocked on canonical cutover; currently points elsewhere. |
| **`<meta name="google-site-verification">`** | not present in repo. |
| **Sitemap submission to GSC** | blocked on canonical cutover (sitemap content is correct: `src/app/sitemap.ts` emits 47 routes; URL host driven by `SITE_URL` env). |
| **Sitemap submission to Bing** | same. |

## Missing GTM container ID

Cycle 34 fires only when Torrey provisions a **GTM container** (`GTM-XXXXXXX` format) in tagmanager.google.com under Mia's GBP Google account.

Inside that container, Cycle 34 will configure:

1. **Consent Mode v2 default-deny** — `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`, `functionality_storage`, `personalization_storage`, `security_storage` all default to `denied`. Region: blank (treat all visitors equally for now).
2. **GA4 configuration tag** — measurement ID `G-PYYSF87G8K`, firing trigger = "Consent Initialization — All Pages" only after `analytics_storage` granted.
3. **GA4 event tags** — pageview (auto), `form_submit`, `cta_click` (data-attribute-driven), `outbound_link`, `phone_click` (`tel:` listener), `email_click` (`mailto:` listener), `idx_search` (when Cycle 33 Bridge proxy fires).
4. **Conversion goals** (later, in GA4 itself, not GTM): `lead_form_submit`, `valuation_form_submit`, `private_consult_request`.

**Cycle 34 will NOT add Google Ads / AdSense / DoubleClick tags.** Mia has not requested paid-ads tracking.

## GA4 measurement ID verification

`G-PYYSF87G8K` was provided in Cycle 22 R1 work. Before Cycle 34 fires:

1. Torrey verifies the property in `analytics.google.com` still exists and is owned by Mia's GBP account.
2. The Data Stream → "Web" → "Measurement ID" matches `G-PYYSF87G8K`.
3. Enhanced Measurement is **off** initially (we'll enable scroll/outbound/site-search per-event via GTM for control).
4. Data retention set to 14 months minimum (default is 2; 14 max in free tier).
5. IP anonymization automatic in GA4 by default — no action needed.

If `G-PYYSF87G8K` is no longer valid, Mia/Torrey creates a fresh property and Cycle 34 substitutes the new ID. Repo currently treats the constant as a placeholder — no code change other than ID swap.

## Consent Mode v2 requirements

| Requirement | Implementation in Cycle 34 |
|---|---|
| Default-deny `analytics_storage` until user consent | GTM Consent Mode v2 default config; banner UI in `src/components/consent/ConsentBanner.tsx` |
| Granular controls (analytics / personalization / functional) | banner offers "Accept all" / "Reject all" / "Customize"; "Customize" allows per-category toggle |
| TCPA telephone consent (PEWC) | separate per-form checkbox, NOT bundled with cookie consent; copy from `MIA_DECISION_PACKET.md` |
| Florida CCPA "Do Not Sell My Personal Information" | footer link to `/privacy/#do-not-sell`; opt-out toggles `ad_storage` to denied permanently |
| GDPR EU-region | out of scope v1 (no targeted EU traffic) — banner default-deny still applies to be safe |
| Visible consent state persistence | `localStorage` key `consent.mia.v1` with 13-month expiry per ePrivacy Directive |
| Re-consent on policy change | bump key suffix when `/privacy/` materially changes |

## Search Console / Bing Webmaster timing under `miasanabria.com`

**Cannot start before DNS cutover (Gate G10 in `launch-doD.md`).** Process when G10 fires:

1. GSC: Add property → URL prefix `https://miasanabria.com/` → verify via **DNS TXT record** (most reliable, survives any HTML change). DNS owner adds the TXT record.
2. GSC: also add `https://www.miasanabria.com/` as separate property → verify the same way.
3. Submit `https://miasanabria.com/sitemap.xml` as the primary sitemap.
4. Request indexing for top 10 routes (Home, Markets hub, 9 neighborhoods, Buyers, Sellers, About, Contact) via URL Inspection → Request Indexing.
5. Bing Webmaster: Add Site → `https://miasanabria.com/` → "Import from GSC" (free import path), then verify via DNS TXT or `<meta>`.
6. Submit sitemap to Bing.
7. Set GSC + Bing email alerts to Mia + Torrey.

**Critical:** do NOT submit any URL under `miasanabriarealtor.trueidea.com` to GSC. Staging is `noindex`. If accidentally submitted, remove via GSC URL Removal tool.

## Google Business Profile sync (post-cutover)

| Step | When | Owner |
|---|---|---|
| Update GBP "Website" field → `https://miasanabria.com` | post-G10 (Cycle 36/37) | Mia (or Torrey with Mia auth) |
| Update GBP "Service area" if changed in copy | post-G10 | Mia |
| Confirm GBP "Phone" matches `src/lib/mia.ts MIA.contact.phone` | post-G10 | Mia |
| Confirm GBP "Hours" set; if not real estate has variable hours, "By appointment" works | post-G10 | Mia |
| Confirm GBP "Categories" includes "Real Estate Agency" + relevant secondaries | post-G10 | Mia |
| Confirm GBP "Attributes": online appointments, accessibility (wheelchair), Spanish/bilingual (only if Mia confirms) | post-G10 | Mia |
| GBP Posts: publish 1 post per month with neighborhood spotlight + link to that `/markets/{slug}/` page | post-G10 ongoing | Mia |

## Post-cutover verification steps (Cycle 37)

| Probe | Expected |
|---|---|
| `curl -sI https://miasanabria.com/?cb=<hex>` | 200, `<link rel="canonical" href="https://miasanabria.com/">`, no `noindex` |
| `curl -s https://miasanabria.com/sitemap.xml \| grep -c miasanabria.com` | ≥ 47 URLs, all on `miasanabria.com` host |
| `curl -s https://miasanabria.com/robots.txt` | `User-agent: *\nAllow: /\nSitemap: https://miasanabria.com/sitemap.xml` |
| GA4 Realtime → fire one pageview from Torrey's browser | within 30 s shows in Realtime view |
| GA4 → DebugView with `?_dbg=1` | event params correct |
| GTM Preview Mode → walk the form-submit flow on staging mirror | tags fire in correct order; consent state visible |
| GSC URL Inspection → home page | "URL is on Google" within 7 days; if not, request indexing |

## Risks

1. **Double-counting** if staging traffic accidentally fires GA4 with same measurement ID as production. **Mitigation:** Cycle 34 wires GA4 only on hostnames matching `miasanabria.com` (or `www.`), NOT `*.trueidea.com`.
2. **Consent banner blocking layout** — banner must be non-blocking (slide-up at bottom, no modal overlay).
3. **Sitemap stale** — `sitemap.xml` is built at compile time. If new routes added without redeploy, sitemap won't reflect them. Document in Cycle 37 runbook.
4. **GBP categories misaligned** — wrong primary category degrades local SEO. Confirm "Real Estate Agency" is primary.

## Future paste-ready Google implementation prompt

See `future-prompt-bank.md` → "Cycle 34 — Google/GTM/Consent/Search Console/GBP Setup."

## DoD for Cycle 34 (when it fires)

- [ ] GTM container script in `src/app/layout.tsx` head (per Google docs: snippet split between `<head>` and `<body>`)
- [ ] Consent Mode v2 default-deny configured
- [ ] GA4 config tag firing only post-consent
- [ ] Form_submit / cta_click / phone_click / email_click event tags configured
- [ ] Consent banner component shipped with localStorage persistence
- [ ] `audit:legal` still green (privacy + cookie disclosure consistent)
- [ ] CSP header includes `https://www.googletagmanager.com` (already present)
- [ ] One Realtime pageview test from staging mirrors what production will show
- [ ] No GA4 ID hardcoded outside the `src/lib/site.ts` constant (or new analytics constants file)
- [ ] Rollback: comment out GTM script tag → redeploy → no Google traffic
