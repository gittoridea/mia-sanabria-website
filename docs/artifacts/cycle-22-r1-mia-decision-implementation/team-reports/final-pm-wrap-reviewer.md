# Team 6 — Final PM / Wrap Reviewer

**Scope:** decide if cycle wraps; produce tomorrow's grouped list.

## Wrap decision: **YES — wrap.**

Reasons:
- All 6 approved Mia decisions either implemented (A2-A6) or recorded as confirmed-no-source-change (A1 H1, B8 domain).
- All 4 TBD items (B9 email, B10 phone, C11 lead-magnet gating, C14 REALTOR®/EHO/MLS legal) explicitly documented in `TOMORROW_REMAINING_ITEMS.md` with clear named unblockers from Cycle 22 packets.
- Non-negotiables all honored (IDX preserved, GHL unconnected, GA/SC/GBP unconnected, no above-fold trust row, no evergreen, no DNS edit, no response-time promise, no secrets logged).
- Post-edit audit chain green; staging deploy + ETag verify in flight.

## Tomorrow grouped list

### 1. Mia / principal decisions still TBD

- Branded email / from-domain (Mia §4): `mia@miasanabriarealtor.com` via Google Workspace is the recommended default.
- Phone / call-tracking (Mia §5): GHL phone or Twilio→GHL number — gates `MIA.contact.phoneTel` flip.
- Lead-magnet gating (Mia §6): bifurcated gate (Buyer DD only) is the recommended default; current ungated state is honestly preserved meanwhile.
- Final visual/copy approval on dev site (this cycle's deploy lets Mia review the 5 new market-page quotes).

### 2. GHL / ops dependencies

- Endpoint provisioning: `GHL_INQUIRY_WEBHOOK_URL`, `GHL_VALUATION_WEBHOOK_URL`.
- Auth: `GHL_PIT` (preferred) or `GHL_API_KEY` + `GHL_LOCATION_ID`.
- Field map confirmation (per `GHL_FIELD_MAP_FINAL.md`).
- TCPA consent mechanics (counsel-approved text per `LEGAL_COMPLIANCE_PACKET_ADDENDUM_CATO.md` CATO-01 + advisor note on FCC 2024 1:1 vacatur).
- Audit log policy.
- Spam protection (honeypot + Turnstile).
- Success/failure UI states.
- Notification routing.
- 10-step test-lead procedure (per `GHL_TEST_PLAN.md`).
- Rollback (`GHL_ENABLED` master switch).

### 3. Google / analytics / search dependencies

- GA4 Measurement ID (`NEXT_PUBLIC_GA_ID`) and/or GTM Container (`NEXT_PUBLIC_GTM_ID`).
- Search Console property access (post-cutover only).
- GBP claim/edit alignment (name + license + service area + phone).
- 11-event taxonomy approval (per `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` §4).
- Staging-stays-unmeasured vs production-injected behavior (via `IS_STAGING` gate).
- Consent / privacy treatment (counsel says whether cookie banner needed).

### 4. Legal / compliance dependencies

- DBPR primary-source verification of `SL3405877` + employing-broker linkage + renewal-cadence audit (Cato CATO-08).
- NAR + Florida Realtors + BPSR membership written confirmation (Cato CATO-03 corrects the stale RAGFL reference).
- EHO display refinement (Cato CATO-04 — HUD relative-size rules + Broward source-of-income).
- SEF MLS broker reciprocity (Cato CATO-05 — beyond disclaimer: timestamp, attribution, prohibited-mods, co-mingling, opt-out).
- F.S. 475.278 brokerage-relationship classification (Cato CATO-02 — Single Agent / Transaction Broker / No Brokerage Relationship statutory text via LPT).
- TCPA PEWC refinement (Cato CATO-01 + advisor: 11th Cir. vacated FCC 2024 1:1; underlying PEWC framework still in force).
- Privacy / Terms / Accessibility / DMCA + USCO designated-agent (Legal §5/§6/§7/§8).
- PDF disclaimer policy (Cato CATO-07 — flood/wind/Citizens currency-date, F.S. 718.503/720.401, Johnson v Davis).

### 5. Launch / cutover dependencies

- `miasanabriarealtor.com` DNS cutover (TTL pre-reduction → flip → restore).
- `NEXT_PUBLIC_SITE_URL` flip in Dokploy app env.
- Staging-noindex → production-indexable (`IS_STAGING` gate).
- Search Console sitemap submission (post-cutover stability ≥24h).
- Deployment token rotation (`DOKPLOY_API_TOKEN`) — post-cutover hygiene.
- Branded email setup (Mia §4 path 4B/4C).
- Post-cutover smoke test sweep (`scripts/deploy-and-verify.ts` + §11 inline pattern in `LAUNCH_CUTOVER_READY_PACKET.md`).
- Direct Axess legacy sunset + rollback path.
- PDF noindex Caddyfile rule via Dokploy (per Legal CATO-07).

## Recommended next cycle

**Cycle 23 — Wait for Mia's dev-site review and the 4 TBD answers.** Specifically:
- If she returns 1-2 TBDs: small targeted cycle to implement them.
- If she returns all 4: integrated cycle covering branded email + call-tracking + lead-magnet gating + REALTOR®/EHO/MLS refinements.
- If she returns site-copy approval only: trigger Cycle 24-LEGAL-CLOSURE (counsel + LPT batch).
- If counsel returns first: Cycle 24-LEGAL-CLOSURE.
- If GHL credentials arrive first: Cycle 25-GHL.

Whichever signal lands first picks the next cycle.

## Bloat-guard reflection

- Zero new audits added this cycle (per Cycle 22 `qa-infrastructure-closure.md` discipline).
- Zero new scripts added.
- 5 single-line text replacements + 1 commit + 1 deploy — minimum diff to honor the principal-approved changes.
