# Optimal Static-Export → GoHighLevel Form Integration
## Mia Sanabria Realtor Site (BSS Client C2) — Investigative Analysis

**Investigator:** Ava Chen | **Date:** 2026-05-08 | **Triple-Check Status:** Verified
**Site:** miasanabriarealtor.trueidea.com (Next.js 15 static export, Helos VPS / Dokploy / Caddy / Traefik)

---

## Executive Summary

**Recommendation: Option 1 — GHL Inbound Webhook fronted by a Cloudflare Pages Function (or Cloudflare Worker) proxy.** This pattern resolves the documented CORS limitation on `services.leadconnectorhq.com/hooks/...`, keeps the webhook URL out of the public repo, preserves full editorial design fidelity (Cinzel + brass), and gives Mia real-time CRM lead capture with workflow-triggered SMS/email notifications. All other options fail at least one of the four binding constraints (brand fidelity, no client-visible secrets, no BSS-workspace-from-codebase mutation, anti-criterion ISC-88).

---

## Option Comparison Matrix

| # | Option | Latency | Contact Fidelity | Static-Export Complexity (1-10) | Mia-Side Landing | Brand Fidelity | Compliance Gate Fit |
|---|--------|---------|------------------|--------|------------------|----------------|---------------------|
| 1 | **GHL Workflow Webhook + edge proxy** | Real-time (<1s) | High — JSON map → custom fields, tags, source, workflow trigger eligible | 5 | CRM contact + workflow → SMS/email/pipeline | **Full** — our HTML/CSS | **High** — our consent UI, our retention text |
| 2 | GHL native form embed (iframe) | Real-time | High — native | 2 | CRM contact + native workflow | **Low** — iframe defeats Cinzel/brass | Medium — GHL's checkbox UI |
| 3 | GHL API direct (`/contacts/upsert`) | Real-time | Highest — full contact schema | 7 (proxy required) | CRM contact (no workflow unless wired) | Full | High |
| 4 | Cal.com via GHL calendar | Real-time | Medium — booking record, not lead | 4 | Calendar slot + contact | Medium — calendar UI imported | Different UX (booking, not inquiry) |
| 5 | Hardened mailto: + GHL email parser | **Hours-batch** | **Low** — best-effort parse, no custom fields, fragile | 1 | Inbox first, CRM maybe | Full | Low — relies on email client behavior |

---

## Per-Option Deep Dive

### Option 1 — GHL Inbound Workflow Webhook (RECOMMENDED)

**URL pattern (verified):** `https://services.leadconnectorhq.com/hooks/{locationId}/webhook-trigger/{uuid}` — confirmed in HighLevel Support docs and corroborated in third-party guides. [HIGH]

**How it works:** Torrey creates an Inbound Webhook trigger inside the **Mia sub-account workflow** (one-time, in GHL UI — NOT from this codebase, satisfying the "no BSS-workspace mutation from this repo" constraint). The workflow consumes JSON, maps `email`/`phone`/`firstName`/`lastName` plus custom fields (`property_interest`, `budget_range`, `consent_text`, `consent_timestamp`, `source_page`), and dispatches Mia's notification chain.

**Critical finding — CORS:** GHL inbound webhooks are documented as a **one-way push** with no CORS headers configured for browser origins. Direct `fetch()` from `miasanabriarealtor.com` will be blocked by the browser. **A server-side proxy is mandatory.** [HIGH — corroborated by HighLevel Support, GoHighLevelExpertTeam, and Pipedream integration docs]

**Failure modes:** GHL webhook outage → fallback to mailto: queue in localStorage with retry; field-mapping drift if GHL workflow edited without updating client payload schema; no built-in idempotency (duplicate-click retry can create dup contacts unless workflow checks).

**Compliance Gate fit:** **Best of all options.** Consent checkbox lives in our HTML so we control wording, timestamp, IP capture, and the consent string flows into GHL as a custom field for audit trail.

---

### Option 2 — GHL Native Form Embed (iframe)

**Documented limitation:** The "embed" code is an iframe that "greatly reduces functionality, notably in that it can no longer pickup URL parameters" and is "completely useless when it comes to tracking marketing." [HIGH — quoted from GoHighLevel Ideas board]

**Brand fidelity:** **Disqualifying.** iframe styling is sandboxed; Cinzel + brass design language cannot be propagated. Custom CSS override capability is undocumented and historically limited. [MED]

**Use case:** Acceptable for fast MVPs, not for editorial-grade luxury realtor brand.

---

### Option 3 — GHL API Direct (`/contacts/upsert`)

**Endpoint (verified):** `POST https://services.leadconnectorhq.com/contacts/upsert` with `Authorization: Bearer {PIT}`, `Version: 2021-07-28`, `Content-Type: application/json`. [HIGH]

**Auth options:** OAuth 2.0 (multi-account agency) or **Private Integration Token** (single sub-account — better fit here). [HIGH]

**Disqualifier #1:** PIT in client-side JS = exposed token = anyone can read/write Mia's CRM. Forces a proxy anyway, at which point Option 1 webhook is simpler (no auth header to manage, no token rotation drama).

**Disqualifier #2:** Doesn't trigger Mia's notification workflow unless we ALSO build a separate "contact created" trigger in GHL — more BSS-workspace surface to maintain.

**Verdict:** Strictly worse than Option 1 for this use case. Reserve for cases needing surgical contact updates, not lead capture.

---

### Option 4 — Cal.com via GHL Calendar

Different problem domain — a slot picker, not a lead form. Replaces the hero CTA pattern. **Recommendation:** Add as a *secondary* CTA ("Book a private consultation") *alongside* the Option 1 form, not as a replacement. Out of scope for this decision.

---

### Option 5 — Hardened mailto: + GHL Email Parser

**Failure modes (severe):** Depends on user's mail client; iOS/Android clients mangle form-encoded bodies; no delivery confirmation; GHL email parser is regex-fragile; no real-time SMS notify; lead can sit unread for hours. **Reject.**

---

## RECOMMENDATION & Rationale

**Wire the Mia site to a GHL Inbound Workflow Webhook via a Cloudflare Pages Function proxy.** This single pattern dissolves the four binding constraints simultaneously: the proxy hides the webhook URL from the public repo (constraint: secret hygiene), it sidesteps GHL's documented CORS block (constraint: it has to actually work from a browser), the form HTML stays ours (constraint: editorial brand fidelity), and Torrey configures the workflow once inside GHL UI without this codebase ever touching the BSS workspace (constraint: no cross-codebase mutation). Real-time lead capture, workflow-eligible for SMS/email dispatch, full custom-field fidelity, and a consent-capture surface we control end-to-end.

---

## 5-Step Implementation Checklist

1. **Provision the GHL surface (Torrey, in GHL UI — NOT from repo).** In the Mia sub-account, create a Workflow with Inbound Webhook trigger. Copy the generated URL `https://services.leadconnectorhq.com/hooks/{locationId}/webhook-trigger/{uuid}`. Add workflow actions: Create/Update Contact (map JSON keys), Add Tag `web-lead-mia-site`, Send Internal Notification (SMS + email to Mia), and Add to Pipeline stage "New Inquiry."

2. **Stand up the proxy as a Cloudflare Pages Function.** Create `functions/api/lead.ts` in a tiny sibling repo (or in the Mia repo if hosted on Cloudflare Pages — but since hosting is Helos/Dokploy, use a separate Cloudflare Pages project as a standalone proxy at `lead.miasanabria.com` or similar). Store webhook URL as `GHL_WEBHOOK_URL` encrypted secret via Cloudflare dashboard → Settings → Variables and Secrets → Encrypt. Function: validate origin header against allowlist (`miasanabriarealtor.com` + trueidea preview), validate honeypot empty, server-side timestamp the consent, POST JSON to `env.GHL_WEBHOOK_URL`, return `{ ok: true }` to the browser. Webhook URL never appears in the static bundle, never in git. **Alternative if a Cloudflare account is undesirable:** Helos VPS micro-service (Hono + Bun) behind Caddy at `/api/lead` on the same origin — eliminates CORS entirely but adds ops surface.

3. **Build the form component in the static export.** Standard `<form>` with `action="https://lead.miasanabria.com/api/lead"` (or same-origin `/api/lead` if Helos route). Include: visible fields (name, email, phone, message, property interest); honeypot field `<input name="website_url" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px">` (bots fill it, humans don't); minimum-fill-time guard (reject submissions <2s after page load via JS-set timestamp); explicit consent checkbox with the text below.

4. **Add layered spam + abuse protection.** Honeypot (frictionless), submit-time floor (2s minimum), Cloudflare Turnstile invisible challenge on the proxy (free, privacy-respecting, no Google), and a per-IP rate limit on the Pages Function (Cloudflare KV counter or Durable Object — 5/min/IP). reCAPTCHA explicitly avoided per editorial brand and privacy posture.

5. **Test pattern that respects ISC-88 (no real contact data).** (a) **Synthetic-only test contacts:** every test submission MUST use email `qa+{timestamp}@trueidea.com` and phone `+15555550100` (RFC 5733 reserved range — never routable); add `qa: true` JSON key so the GHL workflow can branch and skip Mia's SMS/email notify when present. (b) **Tag isolation:** test submissions tagged `qa-synthetic` for one-click bulk-delete. (c) **Pre-deploy smoke:** `curl -X POST` directly against the Pages Function with a synthetic payload, verify 200 + verify the contact lands in GHL with the `qa-synthetic` tag and Mia notification was suppressed. (d) **Browser smoke:** Interceptor-driven submission from a preview deploy, same synthetic payload. (e) **Cleanup:** Torrey runs a one-time GHL bulk action to delete all `qa-synthetic` contacts before go-live.

---

## Required Form Consent Text (TCPA + Florida Mini-TCPA + GDPR/CCPA hybrid, 2026)

> By submitting this form, I consent to be contacted by Mia Sanabria, REALTOR® regarding real estate inquiries via phone call, SMS text message, and email at the contact information I provided, including via automated technology. Message and data rates may apply. Message frequency varies. I understand consent is **not a condition of any purchase** and I may opt out at any time by replying STOP. SMS contact will only occur between 8 AM and 8 PM local time, with a maximum of three messages per 24-hour period, in compliance with Florida Statute § 501.059. View our [Privacy Policy](https://miasanabriarealtor.com/privacy) and [Terms of Service](https://miasanabriarealtor.com/terms). California residents: see [CCPA Notice](https://miasanabriarealtor.com/ccpa).

**Why this exact wording (verified 2026 requirements):**
- TCPA one-to-one consent rule (effective 2026-01-26 after FCC postponement) requires consent be **specific to one identified seller**, not bundled. [HIGH]
- Florida § 501.059 ("Mini-TCPA") restricts SMS to 8 AM-8 PM local, max 3/24h, applies DNC list to texts. [HIGH]
- "Not a condition of purchase" + "STOP" language = TCPA safe-harbor pattern. [HIGH]
- CCPA requires explicit notice + opt-out link.

**Implementation:** Capture consent_text verbatim, consent_timestamp (server-side, not client), consent_ip, and user_agent into custom fields on the GHL contact. This is the audit trail that survives a TCPA dispute.

---

## Where the Webhook URL Lives (Summary)

| Layer | Storage | Visibility |
|-------|---------|------------|
| GHL UI | Inside Mia sub-account workflow | Torrey + GHL agency owners only |
| Cloudflare Pages | Encrypted secret `GHL_WEBHOOK_URL` (Settings → Variables and Secrets → Encrypt) | Pages Function runtime only |
| Public repo (Mia site) | **NEVER** — repo only knows `https://lead.miasanabria.com/api/lead` | Public-safe |
| Dokploy build args | **Not used for the webhook URL** — proxy decoupled from Dokploy build | N/A |
| Local `.dev.vars` | Optional for `wrangler pages dev` local testing | Dev machine only, gitignored |

Torrey provisions the URL once via Cloudflare dashboard. Zero code changes required to rotate the webhook URL — re-encrypt the secret and redeploy the Function. The Mia static export is decoupled from the secret entirely.

---

## Confidence Tagging Summary

- [HIGH] Webhook URL pattern `services.leadconnectorhq.com/hooks/{loc}/webhook-trigger/{uuid}` — verified in HighLevel Support and corroborated by third-party guides
- [HIGH] CORS is unsupported for browser-direct webhook submission — corroborated by HighLevel Support, GoHighLevelExpertTeam, and Pipedream documentation
- [HIGH] `/contacts/upsert` endpoint, headers, and PIT auth — verified in HighLevel marketplace developer docs
- [HIGH] iframe embed limitation — verified via official GoHighLevel Ideas board
- [HIGH] TCPA 2026-01-26 effective date and Florida § 501.059 8AM-8PM/3-msg cap — verified across multiple legal-compliance sources
- [HIGH] Cloudflare Pages Functions encrypted secrets pattern — verified in official Cloudflare Pages docs
- [MED] Custom CSS override depth on iframe-embedded GHL forms — undocumented at the depth required for editorial brand work; treated as disqualifier under precautionary principle

---

## Sources

- [Workflow Trigger - Inbound Webhook (HighLevel Support)](https://help.gohighlevel.com/support/solutions/articles/155000003147-workflow-trigger-inbound-webhook)
- [How to use the Inbound Webhook Workflow Premium Trigger (HighLevel Support)](https://help.gohighlevel.com/support/solutions/articles/48001237383-how-to-use-the-inbound-webhook-workflow-premium-trigger)
- [How to Use Webhooks in HighLevel - Zapier (HighLevel Support, contains URL pattern)](https://help.gohighlevel.com/support/solutions/articles/155000001183-how-to-use-webhooks-in-highlevel-zapier-)
- [Upsert Contact - HighLevel API Marketplace Docs](https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact/index.html)
- [HighLevel API Documentation - Developer Portal](https://marketplace.gohighlevel.com/docs/)
- [Private Integrations - Everything You Need to Know](https://help.gohighlevel.com/support/solutions/articles/155000003054-private-integrations-everything-you-need-to-know)
- [Embedding HighLevel Forms on Non-HighLevel Websites](https://help.gohighlevel.com/support/solutions/articles/155000004524-embedding-highlevel-forms-on-non-highlevel-websites)
- [Ditch iFrame for a Proper Form Embed code - GoHighLevel Ideas](https://ideas.gohighlevel.com/forms/p/ditch-iframe-for-a-proper-form-embed-code)
- [Cloudflare Pages Functions - Bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Hide Your API Keys on a Static Site with Cloudflare Workers (Medium)](https://medium.com/@IamCOD3X/%EF%B8%8Fhide-your-api-keys-on-a-static-site-with-cloudflare-workers-3c87077da309)
- [How to Use GoHighLevel Webhooks (GoHighLevelExpertTeam, CORS confirmation)](https://gohighlevelexpertteam.com/how-to-use-gohighlevel-webhooks-inbound-outbound-guide/)
- [GoHighLevel Webhooks 2026 Guide (SupplyGem)](https://supplygem.com/gohighlevel-webhooks/)
- [Brokerages and Realtors: Navigate New TCPA Texting Laws (Vreeland Real Estate)](https://vreelandre.com/blog/real-estatae-realtor-texting-laws-2025)
- [TCPA Consent Rule Changes for 2026 (Tratta)](https://www.tratta.io/blog/tcpa-consent-rule-changes)
- [TCPA Compliance Checklist for Lead Forms (MakeForms)](https://makeforms.io/blog/tcpa-compliance-checklist-of-tcpa-compliant-lead-form)
- [Consent Templates for Lead Forms - TCPA, CCPA, GDPR (LeadCapture.io)](https://leadcapture.io/blog/consent-templates-for-lead-forms/)
- [Form Honeypot Fields Implementation Guide (FormShield)](https://formshield.dev/blog/form-honeypot-implementation-guide)
- [Honey Potting in Next JS (Medium)](https://medium.com/@zainshahza/honey-potting-in-next-js-acfd80eb8010)

