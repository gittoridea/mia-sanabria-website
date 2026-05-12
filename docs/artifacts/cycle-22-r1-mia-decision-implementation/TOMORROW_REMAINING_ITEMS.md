# Tomorrow Remaining Items — Cycle 22-R1 handoff

> Every item below has exactly one named unblocker. Reading order matches the mission-packet groups.

## 1. Mia / principal decisions still TBD

| # | Item | Unblocker | Recommended default |
|---|---|---|---|
| 1.1 | Branded email / from-domain | Mia/Torrey selects | Google Workspace `mia@miasanabriarealtor.com` (~$6/mo, full SPF/DKIM/DMARC) |
| 1.2 | Phone / call-tracking | Mia/Torrey approves | Provision GHL phone (or Twilio→GHL) — replaces `MIA.contact.phoneTel` in `src/lib/mia.ts` |
| 1.3 | Lead-magnet gating | Mia decides | Bifurcated: gate Buyer DD checklist; leave Seller + Valuation prep ungated |
| 1.4 | Final visual/copy approval on dev site | Mia reviews live staging | Cycle 22-R1 deploy is live at https://miasanabriarealtor.trueidea.com/ — homepage featured-markets carousel shows all 5 new miaQuotes |

## 2. GHL / ops dependencies

(All from `docs/artifacts/cycle-22-remaining-gap-closure/GHL_READY_PACKET.md` — unchanged this cycle.)

| # | Item | Unblocker |
|---|---|---|
| 2.1 | Endpoint provisioning | Torrey provisions `GHL_INQUIRY_WEBHOOK_URL` + `GHL_VALUATION_WEBHOOK_URL` in `~/.claude/.env` |
| 2.2 | Auth | `GHL_PIT` (preferred) or `GHL_API_KEY` + `GHL_LOCATION_ID` |
| 2.3 | Field map confirmation | per `GHL_FIELD_MAP_FINAL.md` — 31 fields including 21 GHL custom fields to create in UI |
| 2.4 | TCPA consent mechanics | counsel-approved text (per CATO-01 + advisor note: FCC 2024 1:1 vacated; underlying PEWC still in force) |
| 2.5 | Audit log | GHL contact note append (minimum); separate audit pipeline (mature) |
| 2.6 | Spam protection | honeypot + Cloudflare Turnstile (no reCAPTCHA per packet) |
| 2.7 | Success/failure UI states | per `GHL_READY_PACKET.md` §5 — 2xx redirect; non-2xx visible mailto fallback |
| 2.8 | Notification routing | GHL workflows (Mia/Torrey configures in GHL UI) |
| 2.9 | Safe test lead procedure | 10-step plan in `GHL_TEST_PLAN.md` — test pipeline first, then live |
| 2.10 | Rollback | `GHL_ENABLED=false` master switch reverts to mailto-only |

## 3. Google / analytics / search dependencies

(All from `docs/artifacts/cycle-22-remaining-gap-closure/GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` — unchanged this cycle.)

| # | Item | Unblocker |
|---|---|---|
| 3.1 | GA4 Measurement ID | Torrey/Mia provisions `NEXT_PUBLIC_GA_ID` |
| 3.2 | (Optional) GTM Container | `NEXT_PUBLIC_GTM_ID` |
| 3.3 | Search Console property | DNS TXT verification at cutover (post-DNS-stability) |
| 3.4 | GBP access/alignment | Mia claims GBP — align name/license/service area/phone |
| 3.5 | Event taxonomy approval | 11 events per packet §4 |
| 3.6 | Staging-vs-production analytics behavior | gated on `!IS_STAGING && NEXT_PUBLIC_GA_ID` in `src/app/layout.tsx` Script injection |
| 3.7 | Consent / privacy treatment | counsel confirms cookie-banner not needed for GA4 IP-anonymized + no advertising features |

## 4. Legal / compliance dependencies

(All from `docs/artifacts/cycle-22-remaining-gap-closure/LEGAL_COMPLIANCE_PACKET.md` + `LEGAL_COMPLIANCE_PACKET_ADDENDUM_CATO.md`.)

| # | Item | Unblocker |
|---|---|---|
| 4.1 | DBPR verification of `SL3405877` + employing-broker linkage + renewal cadence (CATO-08) | Mia confirms + Torrey verifies at DBPR portal |
| 4.2 | NAR + Florida Realtors + BPSR membership written confirmation (CATO-03 — RAGFL absorbed into BPSR 2020) | Mia provides written confirmation |
| 4.3 | EHO display refinement — HUD relative-size rules + Broward source-of-income (CATO-04) | counsel |
| 4.4 | SEF MLS broker reciprocity beyond disclaimer (CATO-05) | LPT broker-of-record |
| 4.5 | F.S. 475.278 brokerage-relationship statutory text (CATO-02 HIGH) | LPT (Single Agent / Transaction Broker / No Brokerage Relationship classification) |
| 4.6 | TCPA PEWC refinement (CATO-01 HIGH — note FCC 2024 1:1 vacated 11th Cir.) | counsel approves consent text + ATDS disclosure + page-snapshot retention |
| 4.7 | `/privacy/` `/terms/` `/accessibility/` `/dmca/` review (Legal §5-§8) | counsel returns track-changes |
| 4.8 | DMCA USCO designated-agent registration | Mia/Torrey filing |
| 4.9 | PDF disclaimer policy — FL-specific (CATO-07 — flood/wind/Citizens, F.S. 718.503/720.401, Johnson v Davis) | counsel |

## 5. Launch / cutover dependencies

(All from `docs/artifacts/cycle-22-remaining-gap-closure/LAUNCH_CUTOVER_READY_PACKET.md`.)

| # | Item | Unblocker |
|---|---|---|
| 5.1 | `miasanabriarealtor.com` DNS cutover | DNS provider edits (TTL pre-reduce → flip → restore) |
| 5.2 | Canonical production URL | flip Dokploy app env `NEXT_PUBLIC_SITE_URL = https://miasanabriarealtor.com` |
| 5.3 | Staging-noindex → production-indexable | automatic via `IS_STAGING` gate when `NEXT_PUBLIC_SITE_URL` matches `PRODUCTION_URL` |
| 5.4 | Search Console sitemap submission | post-cutover stability ≥24h |
| 5.5 | Deployment token rotation | post-cutover hygiene (`DOKPLOY_API_TOKEN`) |
| 5.6 | Branded email | per 1.1 above |
| 5.7 | Post-cutover smoke test | `scripts/deploy-and-verify.ts` + §11 inline pattern in `LAUNCH_CUTOVER_READY_PACKET.md` |
| 5.8 | Rollback plan | revert DNS records (TTL 300s recovery window) |

## Recommended next cycle

The next cycle is whichever signal arrives first:

- **Mia returns dev-site review with 1-4 TBD answers** → targeted small cycle (or integrated cycle for all 4).
- **Counsel returns Legal pack** → Cycle 24-LEGAL-CLOSURE.
- **Torrey provisions GHL env** → Cycle 25-GHL.
- **DNS owner ready for cutover (after Mia/counsel/GHL prerequisites met)** → Cycle 26-CUTOVER.
- **None of the above by tomorrow** → audit-stale-terms overclaim-adjective extension (calibrated to Mia-approved copy, per Cycle 22 `qa-infrastructure-closure.md` §2 queue).

## Reading order for tomorrow

1. This file — confirm scope.
2. `APPROVED_MIA_DECISIONS_IMPLEMENTED.md` — what shipped tonight.
3. `docs/artifacts/cycle-22-remaining-gap-closure/FINAL_REMAINING_LIST_FOR_TORREY.md` — Cycle 22 packet roll-up (still canonical for sections 2-5 above).
4. Whichever specific packet matches the next signal that arrives.
