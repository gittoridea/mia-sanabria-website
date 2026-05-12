# Final Remaining List for Torrey — Cycle 22

> Buckets A–H, every item from `remaining-work-register.md` mapped to exactly one. Reviewable in one sitting.

## Bucket A — Closed by AI this cycle (Cycle 22)

**Source/rendered changes:** 0. The cycle was documentation-only.

**Artifacts shipped:**
- `remaining-work-register.md` + `.json`
- `MIA_DECISION_PACKET.md`
- `GHL_READY_PACKET.md` + `GHL_FIELD_MAP_FINAL.md` + `GHL_TEST_PLAN.md`
- `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md`
- `LEGAL_COMPLIANCE_PACKET.md`
- `LAUNCH_CUTOVER_READY_PACKET.md`
- `copy-claims-closure.md`
- `a11y-performance-closure.md`
- `qa-infrastructure-closure.md`
- `FINAL_SYNTHESIS.md`
- `FINAL_REMAINING_LIST_FOR_TORREY.md` *(this file)*
- `FINAL_REPORT.md` *(the cycle's wrap)*

## Bucket B — Still AI-doable next cycle (queued, low-risk source edits)

These are safe edits but were deliberately deferred because they pair naturally with principal-decision unlock items or because the cycle is documentation-scope:

- **B-1** Apply Mia §1 homepage triad alignment (4 files; ~30 min after Mia returns the packet).
- **B-2** Apply Mia §2.1-§2.5 miaQuote rewrites (1 file; 5 strings; pending Mia signoff).
- **B-3** Verify FL market title length 62→60 if SEO audit re-introduces the warning (currently reports 0).
- **B-4** Parameterize `audit-mobile-readability.ts` cycle-id (tech-debt cleanup; ~30 min).
- **B-5** Ship `audit-no-fabrications` overclaim-adjective extension AFTER Mia approves replacements (calibrated to final wording).
- **B-6** PDF disclaimer pages — pending counsel signoff (Legal §10).
- **B-7** Mia §6b PDF surfacing on `/sellers/` + `/valuation/` (pending Mia signoff).
- **B-8** Apply Mia §3 production-domain canonical to `src/lib/site.ts:7` if §3 = 3B chosen.
- **B-9** Apply Mia §7 response-time stance to thank-you copy (currently already honest; minor wording polish only).
- **B-10** Apply Mia §8 license display: flip `MIA.unverified.licenseNumber` to `licenseNumber` post-DBPR verify.
- **B-11** Apply Mia §9 mark presentation tweaks if Mia/LPT supplies additional brokerage disclosure.
- **B-12** Apply Mia §10 voice-acceptance outcomes (if any sections flagged "not me").
- **B-13** Inventory open Cycle-20 stub items (ISS-019/020/021 deferred Lighthouse/axe/pa11y deep pass) for Cycle 28 prep.

## Bucket C — Needs Mia / Torrey decision

(All in `MIA_DECISION_PACKET.md`, in priority order.)

- **C-1** Homepage triad canonical (§1).
- **C-2** miaQuote rewrites for FL/Boca/Palm Beach/Delray/Lighthouse Point (§2.1-§2.5).
- **C-3** Production domain canonical: `miasanabriarealtor.com` vs `miasanabria.com` (§3).
- **C-4** Branded email / Google Workspace (§4).
- **C-5** Phone / call-tracking strategy (§5).
- **C-6** Lead-magnet gating (§6) + PDF cross-page surfacing (§6b).
- **C-7** Response-time stance for thank-you copy (§7).
- **C-8** License display: confirm `SL3405877` (§8).
- **C-9** Mark presentation tweaks (§9).

## Bucket D — Needs GHL endpoint / auth / test plan

(All in `GHL_READY_PACKET.md`.)

- **D-1** Provision `GHL_LOCATION_ID` + `GHL_PIT` (or `GHL_API_KEY`).
- **D-2** Provision `GHL_INQUIRY_WEBHOOK_URL`.
- **D-3** Provision `GHL_VALUATION_WEBHOOK_URL`.
- **D-4** Provision `GHL_LEAD_MAGNET_WEBHOOK_URL` (only if Mia §6 = gated/bifurcated).
- **D-5** Provision all 21 custom fields in GHL UI before first submit.
- **D-6** Optional: `GHL_CALENDAR_ID` if valuation flow ever embeds booking.
- **D-7** Counsel signoff on TCPA consent text (cross-bucket dep with E).
- **D-8** Run the 10-step `GHL_TEST_PLAN.md`.
- **D-9** Call-tracked phone number (or Twilio→GHL) — gates Mia §5.
- **D-10** Turnstile site-key (Cloudflare free tier).

## Bucket E — Needs Google Analytics / Search Console / GBP access

(All in `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md`.)

- **E-1** Create GA4 property + Measurement ID (`NEXT_PUBLIC_GA_ID`).
- **E-2** Optional: Create GTM Container (`NEXT_PUBLIC_GTM_ID`).
- **E-3** Search Console Domain property + DNS TXT verification (post-cutover only).
- **E-4** Submit sitemap.
- **E-5** Mia claims/edits GBP listing.
- **E-6** Privacy policy update to mention GA4/GTM (cross-bucket dep with F).

## Bucket F — Needs legal / compliance review

(All in `LEGAL_COMPLIANCE_PACKET.md`.)

- **F-1** DBPR primary-source verification of `SL3405877` (Mia + Torrey).
- **F-2** NAR + local-board active membership written confirmation (Mia).
- **F-3** SEF MLS broker reciprocity disclaimer text (LPT broker-of-record).
- **F-4** LPT additional brokerage disclosure language, if required (LPT).
- **F-5** Counsel review of `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/` pages.
- **F-6** Counsel review of TCPA consent text.
- **F-7** Counsel review of PDF disclaimers + scope-of-advice + Fair Housing wording.
- **F-8** DMCA USCO designated-agent registration finalization.

## Bucket G — Needs launch / cutover access

(All in `LAUNCH_CUTOVER_READY_PACKET.md`.)

- **G-1** DNS provider edits (TTL drop + cutover flip + post-stability restore).
- **G-2** Dokploy app env `NEXT_PUBLIC_SITE_URL` flip to production.
- **G-3** Direct Axess sunset coordination on existing `miasanabriarealtor.com` host.
- **G-4** Caddyfile rule via Dokploy for PDF `X-Robots-Tag` (per Legal §11 recommendation).

## Bucket H — Should be deferred / discarded

- **H-1** Cycle 20 ISS-004 IDX wrapper CTA → shipped in Cycle 21 A8.
- **H-2** Cycle 20 ISS-011 cache-bust hex pattern → shipped in Cycle 20-R1.
- **H-3** Cycle 21 9.6 IDX target = `miasanabria.com/search` mission-brief discrepancy → resolved: `sef.mlsmatrix.com` is the actual IDX (no `.com/search` exists or is intended).
- **H-4** Lighthouse / axe / pa11y deep pass → deferred to Cycle 28 on a dev workstation (per `a11y-performance-closure.md` §5).
- **H-5** Bigger audit-infrastructure rebuild → not justified; existing 20 audits are sufficient.

## Reading order for Torrey

1. This file → confirms scope.
2. `MIA_DECISION_PACKET.md` → schedule the 30-45 min Mia call.
3. `LAUNCH_CUTOVER_READY_PACKET.md` § 16 → understand the cutover gate.
4. `LEGAL_COMPLIANCE_PACKET.md` § 14 → send to counsel as one batch.
5. `GHL_READY_PACKET.md` § 2 + § 14 → know which env vars to provision and which Mia decisions block.
6. `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` § 7 → know when to activate.

Total reading time: ~30 minutes if read linearly.

## Summary line

**You have a launch-quality site with 51 open items, each mapped to exactly one unblocker, packaged into 5 reviewable artifacts. No code edit is pending an "AI to figure out" — every next move has a named owner.**
