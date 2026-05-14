# Cycle 34 — Remaining Blockers

> Phase 18 deliverable. Cataloged by owner.

## Blocked on Mia (operator)

- Review packet return for the current staging.
- Final attestation of designations in writing (PSA, RENE, CDPE, ABR, SFR, AHWD) — verbal-confirmed Cycle 24 R2.
- Languages confirmation (Spanish capability — currently `["English"]` only).
- Years-licensed claim (currently `null`).
- Display office address (currently `null`).
- Per-city copy for the 7 Broward cities promoted to `hasPage:true` in Cycle 25 (Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise).
- Licensed photography for those 7 cities (brand-tone placeholders currently in place).

## Blocked on Torrey

- Decision on whether the current `miasanabria.com` hero image (hosted on `vibe.filesafe.space`) is Mia-owned and freely re-licensable. If yes → optimize + copy into `public/hero/` + swap in.
- Approval to run a one-sample AI image generation checkpoint (Hollywood proposed).
- API-key refresh (deferred to 2026-05-22 per the brief).
- Decision on DNS cutover to `miasanabria.com`.
- Bridge support ticket for real SEF MLS feed provisioning.

## Blocked on counsel / brokerage

- DMCA USCO certificate (currently in-process language — acceptable for staging, blocked for production cutover per `CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md`).
- Counsel review of legal pages pre-cutover.

## Blocked on Bridge / Google / GHL

- Bridge real SEF MLS feed.
- GHL form/webhook endpoints (forms currently mailto-fallback per `CLAUDE.md`).
- Google Analytics 4 ID, Search Console verification, GBP optimization, sitemap submission.

## Blocked on hosting / DNS

- DNS swap from current Direct Axess host to Helos VPS Dokploy.
- Production canonical cutover to `miasanabria.com`.
- 301 redirect plan from `miasanabriarealtor.com` and any legacy paths.

## Not blockers — informational

- The `audit:qa-gate` `high: 4` items are for `/downloads/...` fs-only routes and the `/404` page. They are tracked in the readiness register and not user-launch blocking.
- `audit:legal` 1 WARN is the DMCA USCO in-process language, acceptable for staging per Cycle 16.
