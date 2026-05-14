# Lane G — GHL Forms / Lead Routing Readiness Dossier

**Author lens:** GHL Lead Routing Engineer
**Scope:** prepare GHL implementation. No GHL writes. No endpoint calls. No credential inspection. No form submissions on live staging.
**Inputs reviewed:** `src/app/contact/page.tsx`, `src/app/valuation/page.tsx`, `src/app/thank-you/*`, `src/components/cta/*` (7 CTA components), `docs/GHL_INTEGRATION_OPTIMAL.md`, `docs/GHL_BLOG_INTEGRATION_DECISION.md`, project CLAUDE.md rule "GHL form/webhook endpoints — currently mailto fallback. Do not invent endpoint URLs."

## Current form inventory

| Surface | File | Current behavior |
|---|---|---|
| **Contact form** | `src/app/contact/page.tsx` | mailto fallback to `MIA.contact.email` |
| **Valuation form** | `src/app/valuation/page.tsx:105` | `<form action="mailto:${MIA.contact.email}?subject=...">` — mailto fallback |
| **CTAs** (no native form fields) | `src/components/cta/*.tsx` | static CTAs that link to `/contact/`, `/valuation/`, or `/insights/`. No form submission of their own. |
| **Lead-capture CTA** | `src/components/cta/LeadCaptureCTA.tsx` | scaffold; not wired to GHL |
| **Thank-you confirmation pages** | `src/app/thank-you/{,buyer-brief,valuation,market-brief}/page.tsx` | static "thanks" pages — currently reachable only via direct navigation since no form posts to them yet. Designed to be the post-submit redirect target once GHL fires. |

Per `src/lib/insights.ts:26` comment: "All CTAs route to existing pages or non-GHL thank-you routes; no claims of CRM capture or automated follow-up." This is the **honesty contract** — the site does NOT claim a working lead capture today.

## Required endpoint(s)

| Endpoint role | What Cycle 32 needs from Torrey |
|---|---|
| Primary lead-capture webhook | GHL **Inbound Webhook URL** for Mia's GHL sub-account ("MS-001" or whichever short_code) — pasted into Torrey's terminal env, **never to chat**. |
| Per-form distinct field mapping | GHL custom field IDs for `firstName`, `lastName`, `email`, `phone`, `inquiry`, `propertyType`, `priceRange`, `marketSlug`, `consentTimestamp`, `consentText`, `sourceUrl`, `utmSource`/`utmMedium`/`utmCampaign`, `userAgent`, `landingPage`. |
| Workflow / pipeline ID | GHL workflow ID that consumes the webhook and (a) creates Contact, (b) tags by form type, (c) optionally triggers email/SMS sequence per Mia's preference. |
| Notification subscriber | Mia's email + SMS for "new lead" notification (uses existing GHL notification node, not new code). |

## Required runtime architecture

The same static-export constraint that affects Bridge applies: there is no Node runtime in this app today. Options:

| Option | Shape | Pro | Con |
|---|---|---|---|
| **G-A** (recommended) | Cloudflare Pages Function or CF Worker at `/api/lead` that holds nothing secret (GHL inbound webhook URL **is** a long random string, treat it as semi-secret), forwards POST to GHL, returns 200/4xx for the static page UI to render success/fail states. | No Next.js runtime change. Easy CSP. | Adds a small Worker/Function to operate. |
| **G-B** | Drop static export for `/api/*` only via Next.js Route Handler (App Router). | Single runtime; co-located with code. | Requires Dokploy build mode change (static → standalone); higher blast radius. |
| **G-C** | Browser POSTs directly to GHL Inbound Webhook URL. | Simplest; no runtime needed. | URL is exposed in browser bundle — bots will hammer it. **Not recommended.** |

**Recommendation:** G-A. Cycle 32 implements the CF Worker (or Dokploy sidecar Function) and wires `src/components/forms/*` to POST `/api/lead`.

## Honeypot + Turnstile plan

| Layer | Implementation |
|---|---|
| Honeypot field | Hidden CSS-`display:none` form field named e.g. `company_name`. If filled, server-side reject. |
| Cloudflare Turnstile | Site key (public) embedded in form `<div class="cf-turnstile">`. Server-side: validate token via `https://challenges.cloudflare.com/turnstile/v0/siteverify` before forwarding to GHL. **Secret key stays in Worker/Function env, never in repo.** |
| Rate limit | Per-IP throttle at Worker (e.g., 5 submissions / 10 min / IP). |
| Replay protection | Single-use nonce in form, validated at Worker. |
| Email content sanitization | Sanitize user-provided `inquiry` text before forwarding to prevent header injection. |

## Success / failure UI

| State | UI |
|---|---|
| Submit in flight | button disabled, "Sending…" spinner state (existing scaffold) |
| 200 from `/api/lead` | redirect to `/thank-you/{form-slug}/` page (`buyer-brief`, `valuation`, `market-brief`, or default `/thank-you/`) |
| 400/422 (validation) | inline error per field; do not navigate away |
| 401/403 (Turnstile fail) | "Please refresh and try again." Do not reveal it's a Turnstile failure. |
| 5xx / network | "Something went wrong. Try again or email mia@…" with explicit fallback to mailto link |
| Honeypot trip | server-side: log + return 200 with thank-you redirect (silent reject) so bot thinks it worked |

## Notification / workflow / pipeline mapping

| Form | GHL workflow | GHL tag | Notification |
|---|---|---|---|
| Contact (`/contact/`) | "Mia – Inbound Contact" workflow | `web-contact-general` | Mia email + SMS within 5 min |
| Valuation (`/valuation/`) | "Mia – Seller Valuation Request" workflow | `web-valuation` + `seller-intent` | Mia email + SMS within 2 min (higher priority) |
| Buyer Brief CTA | "Mia – Buyer Brief" workflow | `web-buyer-brief` + `buyer-intent` | Mia email |
| Market Brief CTA | "Mia – Market Brief" workflow | `web-market-brief` + `prospect` | Mia email; weekly digest mode |
| Waterfront Review CTA | "Mia – Waterfront Review" workflow | `web-waterfront-review` + `buyer-intent` + `waterfront` | Mia email + SMS |
| Private Consultation CTA | "Mia – Private Consultation" workflow | `web-private-consult` + `high-intent` | Mia SMS immediately |
| Seller Valuation CTA (variant) | folds into "Mia – Seller Valuation Request" | same | same |

Cycle 32 will not create these workflows; Torrey creates them in GHL UI and provides the workflow IDs as a numbered list. Cycle 32 wires the form-type → workflow-ID mapping in code.

## Test plan (when Cycle 32 fires)

1. Local-only: POST mock against a local mock endpoint, verify field mapping serializes correctly per GHL Inbound Webhook contract.
2. Staging-only end-to-end: Torrey provides a **test GHL sub-account** OR a **separate test workflow ID** in the same sub-account. Submit one test from staging; verify lead lands in test workflow only; tag = `test-cycle-32`; Mia not notified.
3. Once test passes, swap test workflow ID → production workflow IDs in Worker env. Redeploy.
4. Single production end-to-end test: Torrey submits one lead from staging with explicit "TEST — please ignore" content; verify Mia gets notification; verify she can mark it test-ignore.
5. Honeypot test: simulate bot submission (Turnstile-skip + honeypot-fill) — verify silent 200, no GHL lead created.

## Exact missing inputs Torrey must provide

When Cycle 32 fires, Torrey must hand over (terminal/env paste, not chat):

1. GHL **Inbound Webhook URL** for Mia's sub-account (e.g., `https://services.leadconnectorhq.com/hooks/...`).
2. GHL **custom field IDs** for the 14 fields listed in "Required endpoint(s)" above.
3. GHL **workflow IDs** for the 7 form-types.
4. Cloudflare **Turnstile site key** (public — fine for browser) + Turnstile **secret key** (worker-only).
5. Choice of **G-A vs G-B** runtime.
6. Mia's preferred **notification channel** (email-only vs email+SMS) per form-type.
7. Whether to include **Calendly / GHL calendar** embed on `/contact/` or `/valuation/` for self-serve booking.

## Compliance dependencies

- **TCPA PEWC consent text** must be visible above the submit button on any form that captures a phone number for SMS/voice contact. Existing Cycle 22 legal copy is ready — wire it through.
- **Florida CCPA disclosure** in privacy policy (already on `/privacy/`). Form footer references it.
- **CASL** (if any international leads) — out of scope for v1.
- Counsel review of final form copy + post-submit thank-you copy.

## Future paste-ready GHL implementation prompt

See `future-prompt-bank.md` → "Cycle 32 — GHL Forms + Lead Routing."

## DoD for Cycle 32 (when it fires)

- [ ] `/api/lead` proxy implemented (G-A) with Turnstile + honeypot + rate-limit + email sanitization
- [ ] All 7 form types wired to correct workflow + tags
- [ ] All 7 thank-you redirects firing correctly
- [ ] One staging-only test lead verified end-to-end with Mia
- [ ] Honeypot trip verified silent
- [ ] Turnstile failure mode tested (incorrect site key) — UI handles gracefully
- [ ] `audit:no-fabrications` + `audit:legal` still green
- [ ] No webhook URL, custom field IDs, or workflow IDs in repo or chat
- [ ] Rollback path: env var unset → proxy returns 503 → frontend falls back to mailto (existing fallback)
