# Cycle 30 — Torrey Action List

> Operator-side next moves grouped by who can close them and what unblocks each. Lives next to `launch-blocker-matrix.md` (deeper classification). Updated 2026-05-13 (Cycle 30 close).

## Immediate (this week)

| # | Action | Owner | Status | Next step | Risk if skipped |
|---|---|---|---|---|---|
| 1 | Hand Mia the review packet | Torrey | ready | Send `docs/artifacts/cycle-30-mia-staging-review/mia-review-packet.md` to Mia (Telegram / email — whichever she uses). Optionally export to PDF first. | Launch slips indefinitely; everything downstream is gated on Mia sign-off. |
| 2 | Capture Mia's decisions when she returns the packet | Torrey | gated on #1 | When she replies, drop her notes into `docs/mia-client-decision-record.md` §"Mia Cycle 30 review decisions" (create the section) so they're versioned. | Decisions get lost in chat; future cycles can't audit what was actually approved. |
| 3 | Decide whether to install Browser Use for higher-fidelity Mia QA | Torrey | optional | If Mia wants a walkthrough video / per-route screenshot set before her review, queue Cycle 30A `Browser Use Skill Install + Read-Only Staging QA`. Existing `audit:mobile-readability` already covers 56 device-route combos with PASS verdicts, so this is *enrichment*, not blocker. | None. |

## Mia-decision-gated (waiting on packet return)

| # | Action | Owner | Status | Next step | Risk if skipped |
|---|---|---|---|---|---|
| 4 | Apply Mia's copy edits | Torrey + Claude (Cycle 31) | gated on Mia return | When packet returns, run Cycle 31 "Mia Review Decisions Application" — apply only the edits she marked 🛑 / ⚠️; defer ✅ / 📅. | Sub-optimal copy ships if launched without her feedback applied. |
| 5 | Decide "Blog" vs "Insights" end-to-end | Mia (decision) → Torrey (apply) | gated on Mia return | If Mia wants `Blog` everywhere, edit `src/lib/site.ts` line 85 (`FOOTER_NAV.explore` label) + `src/app/page.tsx:166` `<InsightsTeaser heading="Latest Insights">` + the section eyebrow. ~3 line edits, no route changes. | Cosmetic inconsistency between header label and footer/section labels. Not launch-blocking. |
| 6 | Decide on Boca Raton + Palm Beach as full neighborhood pages | Mia | gated on Mia return | If yes, scaffold them under `src/app/markets/[boca-raton|palm-beach]/page.tsx` following the Cycle 25 pattern. If no, leave as references in copy only. | Coverage gap if she expects them. |
| 7 | Photo plan for 1–3 priority cities | Mia (provide) → Torrey (place) | gated on Mia return | Mia ships photos + license confirmation; Torrey places them under `public/markets/` and edits the city `page.tsx` to reference real assets instead of abstract placeholders. | Site launches with placeholders, which Mia may not approve. |
| 8 | Testimonials capture | Mia (provide exact source text + written permission from FB/Realtor.com) → Torrey (place) | gated on Mia return | Build a `src/lib/testimonials.ts` data file with `{ reviewerName, exactText, source: "facebook" | "realtor.com", permissionEvidencePath }`. Render in a small Testimonials section on Home + Sellers + About. No paraphrasing. | Site launches without social proof — weaker conversion, but not legally blocking. |

## External / platform blockers (independent of Mia)

| # | Action | Owner | Status | Next step | Risk if skipped |
|---|---|---|---|---|---|
| 9 | Legal-page DMCA final designation | Counsel | blocked | Counsel writes final USCO designation language → Torrey replaces "USCO in-process" copy on `/dmca/`. | Compliance exposure if legal pages claim in-process when launch happens. |
| 10 | GHL Forms wiring | Torrey + GHL | blocked | Pull GHL form/webhook endpoint URL + custom field IDs from your GHL sub-account for Mia. Build a Cloudflare Pages Function or Dokploy-side proxy (per `docs/GHL_INTEGRATION_OPTIMAL.md`) that posts to GHL, adds honeypot + Turnstile, returns success/fail UI states. Source-code scope: replace `src/lib/bridge.ts` form-submit scaffold with the live POST + state machine. | Forms fall back to mailto on launch — bad first impression, no lead tracking. |
| 11 | Bridge IDX runtime decision | Torrey | blocked (decision needed) | Decide between (a) keep iframe-based MLS search (current SEF MLS Matrix), (b) Bridge IDX API with server-side rendering on Dokploy, (c) Bridge IDX with Cloudflare Worker token broker. Then design the runtime — credentials stay in Dokploy env vars / Cloudflare secrets, never in repo. | IDX remains the iframe shim; deeper search/listing depth is gated. Not launch-blocking. |
| 12 | GA4 + GTM injection | Torrey | blocked | Install GTM container (`GTM-XXXX`) in `src/app/layout.tsx` per consent-mode-v2 pattern (CSP already allows `googletagmanager.com` + `google-analytics.com`). Wire GA4 measurement ID `G-PYYSF87G8K` through GTM, not directly. Add consent banner (TCPA + Florida CCPA + GDPR-safe defaults). | No conversion data post-launch — flying blind. |
| 13 | Search Console + Bing Webmaster sitemap submission | Torrey | blocked on canonical | After `miasanabria.com` cutover lands, submit sitemap `https://miasanabria.com/sitemap.xml` to Google Search Console + Bing Webmaster under the final canonical. Cannot submit before canonical is live because GSC/Bing verify the host. | Organic indexation slow; first 2-4 weeks of traffic lost. |
| 14 | Google Business Profile sync | Torrey + Mia | blocked | After canonical cutover, update Mia's GBP "Website" field to `https://miasanabria.com`. Confirm GBP attributes (REALTOR®, languages, hours) match `MIA` constant in `src/lib/mia.ts`. | GBP keeps pointing at legacy `miasanabriarealtor.com` — sub-optimal local SEO. |
| 15 | DNS + Dokploy cutover for `miasanabria.com` | Torrey + DNS owner + Mia | blocked on all of above | Once #1-#14 are green (or explicitly exception-approved): (a) flip `miasanabria.com` A/AAAA from current host to Helos VPS IP `148.230.82.215`; (b) bind `miasanabria.com` + `www.miasanabria.com` in Dokploy app `XJSRlvH-91ZtUsh0RPGvo` Domains list with Let's Encrypt; (c) redeploy with `NEXT_PUBLIC_SITE_URL=https://miasanabria.com` build-arg; (d) verify schema/canonical/sitemap reflect production host; (e) add 301 from `miasanabriarealtor.trueidea.com` → `https://miasanabria.com`; (f) add 301 from legacy `miasanabriarealtor.com` → `https://miasanabria.com` once Direct Axess is unhooked. | Site never reaches the production canonical. |

## Claude-local close (can be done now, no external dependency)

| # | Action | Owner | Status | Next step | Risk if skipped |
|---|---|---|---|---|---|
| 16 | Canonical-domain doc-banner corrections (3 docs) | Claude | **DONE this cycle** | `CUTOVER_PACKET.md`, `MIA_IDEAL_PRODUCTION_STATE.md`, `NEXT_SESSION_TRIGGER.md` now carry top-banner pointing to `mia-client-decision-record.md` and naming `miasanabria.com` as the final canonical. | n/a (done) |
| 17 | Cycle 30 audit artifacts | Claude | **DONE this cycle** | `claim-vs-reality.md`, `visual-qa.md`, `canonical-domain-drift-audit.md`, `nav-content-drift-audit.md`, `mia-review-packet.md`, `torrey-action-list.md`, `launch-blocker-matrix.md` under `docs/artifacts/cycle-30-mia-staging-review/`. | n/a (done) |
| 18 | Session report update | Claude | **DONE this cycle** | Cycle 30 section appended to `MIA_SESSION_REPORT.md`. | n/a (done) |
| 19 | Extend `audit:mobile-readability` default route list to include the 7 new neighborhood routes | Claude (future cycle) | queued | Edit `scripts/audit-mobile-readability.ts` default route array to add `/markets/deerfield-beach/`, `/markets/coral-springs/`, `/markets/plantation/`, `/markets/weston/`, `/markets/hollywood/`, `/markets/davie/`, `/markets/sunrise/`. ~7-line edit. | Default `audit:all` runs don't sweep the 7 new neighborhood pages at 4 device profiles. Not launch-blocking (cycle 26 already covered them; cycle 29 deploy verified 200 + ETag flip). |
| 20 | Future ISA-rev cycle for canonical-domain refresh | Claude (future cycle) | queued | After `miasanabria.com` cutover lands, rewrite ISA.md §Vision + §Out of Scope + §Decision-Log new entry against the live canonical. Re-baseline ISCs that reference `miasanabriarealtor.com` as cutover target. | Stale Vision keeps surfacing in `/cs` queries and Algorithm OBSERVE phases — confusion risk only, no launch risk because no cutover gets run from ISA. |

## Recommended next mission (post-Cycle-30)

**Cycle 31 — Mia Review Decisions Application** (gated on Mia's return of the review packet).

Scope:
- Read Mia's marked-up packet
- Tag each item with bucket (🛑 / ⚠️ / ✅ / 📅)
- Apply only 🛑 + ⚠️ items as code/copy edits
- Defer ✅ + 📅 with rationale
- Capture decisions in `docs/mia-client-decision-record.md` §"Mia Cycle 30 review decisions"
- Validate: typecheck / lint / build / audit:qa-gate / audit:mobile-readability
- Stage to TrueIdea (no production cutover)
- Hand back to Mia for final sign-off OR proceed to Cycle 32 (GHL Forms) if she's signed off

**Alternative if Mia is slow to return:** Cycle 30A "Browser Use Skill Install + Read-Only Staging QA" — install Browser Use, generate per-route screenshot deck, ship that as a richer visual review companion to the packet.

**Alternative if Torrey wants to move forward without Mia:** Cycle 32 "GHL Forms + Lead Routing" — implement the GHL endpoint/webhook + honeypot + Turnstile + success/fail UI. Independent of Mia copy review.

**Do NOT** proceed to DNS cutover until Mia signs off + GHL Forms + GA4/GTM are wired + legal designation is final.

## What never gets done this cycle

- ❌ No GHL writes (no webhook firing, no contact created)
- ❌ No Google writes (no GA4 measurement-protocol post, no GSC submission, no GBP update)
- ❌ No DNS edits
- ❌ No Dokploy production-domain bind
- ❌ No Bridge credential read or paste
- ❌ No `.env` read
- ❌ No production cutover
- ❌ No edit to `miasanabria.com` or `miasanabriarealtor.com`
- ❌ No form submitted on live staging
- ❌ No testimonial scraping or invention
- ❌ No public copy rewrite without Mia approval

All preserved from Cycle 29 §14.7 scope guarantees.
