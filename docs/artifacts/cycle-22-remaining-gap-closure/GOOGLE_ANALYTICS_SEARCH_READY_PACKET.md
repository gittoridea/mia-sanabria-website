# Google Analytics / Search Console / GBP Readiness (Cycle 22 — Team 5)

> **Status: PLAN-ONLY.** No GA4 / GTM / Search Console / GBP wiring shipped this cycle.
> Site stays opaque to Google measurement until (a) Mia accepts the copy/site as ready and (b) Torrey provisions IDs and approves cutover.

## 1. What "ready" means

Site is GA-ready when:

1. GA4 property exists in Torrey's Google account (or Mia's, if she owns measurement).
2. `NEXT_PUBLIC_GA_ID` (Measurement ID, format `G-XXXXXXXXXX`) is present in `~/.claude/.env`.
3. (Optional) `NEXT_PUBLIC_GTM_ID` (`GTM-XXXXXX`) provisioned if GTM layer is preferred.
4. Search Console property is created (DNS-verified at cutover, not staging).
5. Google Business Profile is claimed/edited for `Mia Sanabria · REALTOR® with LPT Realty` with aligned name / license / service area / phone.
6. Privacy policy explicitly names GA4 / GTM in `/privacy/` (Legal packet §Privacy).

## 2. Required IDs / access

| Item | Form | Env var | Where it lives | Acquired |
|---|---|---|---|---|
| GA4 Measurement ID | `G-XXXXXXXXXX` | `NEXT_PUBLIC_GA_ID` | `~/.claude/.env` | Torrey/Mia provisions at analytics.google.com → Admin → Data Streams |
| GTM Container ID (optional) | `GTM-XXXXXX` | `NEXT_PUBLIC_GTM_ID` | `~/.claude/.env` | optional; only if GTM-layered |
| Search Console property | URL prefix or Domain property | n/a (DNS-verified) | Google account | DNS TXT record at cutover; staging is `Disallow: /` and not eligible |
| GBP account access | OAuth | n/a | Mia's Google account | Mia claims or shares access |

## 3. Recommended GA4 / GTM setup sequence

1. **Pre-cutover (staging) — do nothing.** Staging is `Disallow: /` and intentionally unmeasured.
2. **Cutover day, post-DNS:**
   - Create GA4 property "Mia Sanabria" at analytics.google.com.
   - Create Web Data Stream for `https://miasanabriarealtor.com` (or the chosen production domain).
   - Copy the `G-XXXXXXXXXX` Measurement ID.
   - Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` in Dokploy app env (NOT staging env).
   - Production rebuild loads GA4 via the `<Script src="https://www.googletagmanager.com/gtag/js?id=...">` snippet (proposed: `src/app/layout.tsx` conditional render guarded by `IS_STAGING === false && NEXT_PUBLIC_GA_ID`).
   - Verify in GA4 → Realtime → user count goes up when Torrey opens the live site.
3. **GTM (optional, only if Mia wants future tag flexibility):**
   - Create GTM container "Mia Sanabria" at tagmanager.google.com.
   - Add GA4 Configuration Tag → All Pages trigger.
   - Set `NEXT_PUBLIC_GTM_ID` in Dokploy app env.
   - Switch GA4 script from direct injection to GTM-managed.
4. **Search Console:**
   - At cutover, add `https://miasanabriarealtor.com` (or `.com` per Mia §3) as a Domain property.
   - Verify via DNS TXT record (Cloudflare or current DNS provider).
   - Submit `/sitemap.xml`.
5. **GBP:**
   - Mia claims (or accesses) Google Business Profile.
   - Aligns name (`Mia Sanabria · REALTOR® with LPT Realty`), license (`SL3405877` once DBPR-verified per Legal packet), service area (Eastern Fort Lauderdale + Boca Raton + Delray Beach per Mia §1), phone (call-tracked per Mia §5).

## 4. Event taxonomy (canonical naming for any GA4/GTM trigger)

| Event name | When fired | GA4 params |
|---|---|---|
| `contact_form_start` | first user input on `/contact/` form | `source_page=/contact/`, `intent` if set |
| `contact_form_submit` | submit success (GHL `ok:true`) | `source_page`, `intent`, `market` if set |
| `valuation_form_start` | first user input on `/valuation/` form | `source_page=/valuation/`, `market` if set |
| `valuation_form_submit` | submit success | `source_page`, `market`, `timeline` |
| `phone_click` | user taps `tel:` link | `surface` ∈ {header, footer, hero, ctastrip, contact, valuation, market} |
| `email_click` | user taps `mailto:` link | `surface` |
| `idx_open` | IDX iframe scrolled into view (Intersection Observer) | n/a |
| `idx_search_click` | user clicks "Open the property search in a new tab" | n/a |
| `pdf_download` | user clicks any `/downloads/*.pdf` link | `pdf_slug` |
| `lead_magnet_cta_click` | user clicks lead-magnet CTA (FL page) | `pdf_slug` |
| `market_page_cta_click` | user clicks market-page "Begin a Private Conversation" | `market` |

Naming convention: `<surface>_<verb>` snake_case. Match GHL hidden attribution where possible (lets GA4 + GHL be cross-referenced manually).

## 5. Consent / privacy considerations

| Item | Decision |
|---|---|
| Cookie banner needed? | **Recommended NO** for GA4 IP-anonymized + no advertising features. Florida is not under CCPA/GDPR by site default; if Mia ever advertises into EU/CA, revisit. Add to Legal packet for counsel confirmation. |
| Staging behavior | GA4/GTM script ONLY renders when `IS_STAGING === false`. Staging stays unmeasured; staging `robots.txt` already `Disallow: /`. |
| Privacy policy disclosure | `/privacy/` must name "Google Analytics 4" and link to Google's privacy notice when GA4 ships. Counsel-review trigger. |
| IP anonymization | GA4 anonymizes by default; verify in GA4 settings. |

## 6. Staging vs production behavior

| Surface | Staging (current) | Production (post-cutover, with GA4) |
|---|---|---|
| `robots.txt` | `Disallow: /` | allow-all (per `IS_STAGING` gate in `src/lib/site.ts`) |
| GA4 script | not injected | injected via `<Script>` in `src/app/layout.tsx` (gated by `!IS_STAGING && NEXT_PUBLIC_GA_ID`) |
| GTM script | not injected | injected if `NEXT_PUBLIC_GTM_ID` set |
| `<meta name="robots">` | `noindex, nofollow, nocache` | absent (default-indexable) |
| Search Console property | none | DNS-verified |

## 7. When to connect

| Step | Trigger |
|---|---|
| GA4 + GTM connect | (a) Mia accepts copy/site (`MIA_DECISION_PACKET.md` §10) AND (b) Legal packet `/privacy/` reviewed for GA4 mention AND (c) cutover greenlit |
| Search Console submit | post-DNS cutover only |
| GBP alignment | Mia owns access; no repo coupling |

## 8. Verification checklist (post-connect)

- [ ] GA4 Realtime shows Torrey's session within 30s of opening live site.
- [ ] GA4 DebugView shows the 11 events from §4 firing on test interactions.
- [ ] Search Console DNS TXT verification passes.
- [ ] `/sitemap.xml` submitted and processed.
- [ ] GBP listing shows correct name, license, phone, service area.
- [ ] No analytics scripts visible in staging `view-source:`.
- [ ] Privacy policy `/privacy/` mentions GA4 / GTM (post-counsel).

## 9. Anti-checklist

- [ ] No GA4/GTM `<Script>` added to source this cycle.
- [ ] No `NEXT_PUBLIC_GA_ID` value committed to repo.
- [ ] No Search Console "verified" claim made in repo docs.
- [ ] No GBP claim made on Mia's behalf without her explicit access grant.
- [ ] No assumption of GDPR/CCPA cookie banner — that's a Mia + counsel decision per §5.

## 10. Open principal-side questions

- Who owns GA4 property — Torrey or Mia's Google account?
- Same question for GBP.
- Should the brand surface (GBP name) match domain (Mia §3)? Recommendation: yes — alignment matters for E-E-A-T signals.
- Does Mia want call-tracking on GBP "Call" button? If yes, GBP phone = call-tracked number (Mia §5).

Routed to Mia / Torrey at next call.

## 11. Next-cycle prompt (drop-in for the analytics-activation cycle)

> Mission: Wire GA4 + (optionally) GTM into production after Mia accepts the site and counsel approves privacy disclosure. Use this packet (`GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md`) as the binding spec. Preconditions: `NEXT_PUBLIC_GA_ID` (and optional `NEXT_PUBLIC_GTM_ID`) in `~/.claude/.env`; `/privacy/` updated to mention GA4 (Legal packet); DNS already cut over (`LAUNCH_CUTOVER_READY_PACKET.md` complete). Implement: gate `<Script>` injection in `src/app/layout.tsx` on `!IS_STAGING && NEXT_PUBLIC_GA_ID`; ship 11 events from §4; verify via GA4 DebugView. Submit Search Console + sitemap. Align GBP. Capture verification screenshots.
