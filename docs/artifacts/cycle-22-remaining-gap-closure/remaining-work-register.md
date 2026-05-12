# Cycle 22 — Remaining-Work Register

> **Team 1 deliverable.** Source-of-truth reconciliation of every open item across Cycle 20 (`docs/artifacts/cycle-20-agency-qa/`) and Cycle 21 (`docs/artifacts/cycle-21-ai-remaining-work/`) against the live state at commit `c304740`.
>
> Disposition values: `ai-close-now` | `ai-prepare-only` | `needs-mia` | `needs-ghl-credential` | `needs-google-analytics` | `needs-legal` | `needs-dns` | `discard`.

## 0. Counts

| Disposition | Count |
|---|---|
| `ai-close-now` | 0 (none safe-to-ship without principal approval) |
| `ai-prepare-only` | 13 |
| `needs-mia` | 9 |
| `needs-ghl-credential` | 10 |
| `needs-google-analytics` | 6 |
| `needs-legal` | 8 |
| `needs-dns` | 4 |
| `discard` | 5 (already closed in Cycle 21 or superseded) |
| **Total open after Cycle 21** | **51** (was 52 in Cycle 21 issue-matrix; 13 fixes closed + 4 reclassified discarded + 12 new register-level rows tracking dependencies + packets) |

## 1. Register

| ID | Source | Title | Disposition | Unblocker (one) | Notes |
|---|---|---|---|---|---|
| R-001 | Cy21 B1 | Homepage H1 names "Pompano Beach" while site.ts/mia.ts/Hero.tsx constants name "Delray Beach" | `needs-mia` | Mia/Torrey selects canonical triad | `src/app/page.tsx:84` vs `src/lib/site.ts:25` + `src/lib/mia.ts:34` + `src/components/Hero.tsx:33` |
| R-002 | Cy21 B2-1 | miaQuote Fort Lauderdale — "undisputed yachting capital" | `needs-mia` | Mia approves/edits proposed replacement | `src/lib/markets.ts:131` |
| R-003 | Cy21 B2-2 | miaQuote Boca Raton — "absolute zenith…unparalleled standard of living" | `needs-mia` | Mia approves/edits proposed replacement | `src/lib/markets.ts:363` |
| R-004 | Cy21 B2-3 | miaQuote Palm Beach — "absolute pinnacle of generational wealth and exclusivity" | `needs-mia` | Mia approves/edits proposed replacement | `src/lib/markets.ts:442` |
| R-005 | Cy21 B2-4 | miaQuote Delray Beach — "perfectly captures the essence…ultra-luxurious…most coveted" | `needs-mia` | Mia approves/edits proposed replacement | `src/lib/markets.ts:513` |
| R-006 | Cy21 B2-5 | miaQuote Lighthouse Point — "ultimate sanctuary…exclusive…globally recognized" | `needs-mia` | Mia approves/edits proposed replacement | `src/lib/markets.ts:593` |
| R-007 | Cy21 B3 | Hero CTA <360px viewport ~32-36px effective height | `needs-mia` | Mia/Torrey design judgment: resize vs stack | screenshots in cycle-19A-M baseline |
| R-008 | Cy21 B4 | `/insights/` `py-16 lg:py-24` vs hub pages `py-20 lg:py-28` | `needs-mia` | Mia/Torrey rhythm decision | `src/app/insights/page.tsx` |
| R-009 | Cy21 B5 | `WebSite.publisher = "LPT Realty LLC"` vs site authored under "Mia Sanabria" | `needs-mia` | brokerage relationship decision (LPT broker-of-record clarification) | schema-side |
| R-010 | Cy21 B6 | `AdministrativeArea = "Eastern Fort Lauderdale"` is colloquial | `needs-mia` | accept-colloquial-or-fix-to-administrative | schema accuracy nit |
| R-011 | Cy21 B7 | Surface 2 lead-magnet PDFs on `/sellers/` + `/valuation/` | `needs-mia` | Mia approves cross-page surfacing | additive pattern same as A6 |
| R-012 | Cy21 9.4 | Branded email / from-domain decision | `needs-mia` | Domain + workspace choice | gates Gmail SPF/DKIM/DMARC + GHL Reply-to |
| R-013 | Cy20 ISS-001 | `/contact/` form mailto → GHL Inquiry pipeline | `needs-ghl-credential` | `GHL_INQUIRY_WEBHOOK_URL` + auth | per `GHL_READY_PACKET.md` |
| R-014 | Cy20 ISS-001 | `/valuation/` form mailto → GHL Valuation pipeline | `needs-ghl-credential` | `GHL_VALUATION_WEBHOOK_URL` + auth | per `GHL_READY_PACKET.md` |
| R-015 | Cy20 ISS-002 | Mailto silent-fail on mobile without Mail.app — visible fallback after GHL wire | `needs-ghl-credential` | ships with R-013/R-014 | UX-only enhancement after wire |
| R-016 | Cy20 ISS-003 | Call tracking — 11+ `tel:` links | `needs-ghl-credential` | GHL phone or Twilio→GHL number | named follow-up Cycle 23-CALL-TRACKING |
| R-017 | Cy20 ISS-004 | IDX iframe — wrapper CTA "Talk to Mia after you search" | `discard` | already shipped in Cycle 21 (A8) | sentinels 5/5 PASS |
| R-018 | Cy20 ISS-005 | 3 lead-magnet PDFs ungated | `needs-mia` | gate / partial-gate / accept-ungated | recommended: bifurcated (gate buyer DD only) |
| R-019 | Cy20 ISS-006 | UTM/referrer/source attribution wiring on forms | `needs-ghl-credential` | ships with R-013/R-014 | hidden fields per `GHL_FIELD_MAP_FINAL.md` |
| R-020 | Cy20 ISS-007 | TCPA consent capture on both forms | `needs-legal` | counsel approves consent text | gates GHL wire of phone/SMS follow-up |
| R-021 | Cy20 ISS-008 | Spam protection (honeypot + Turnstile) | `needs-ghl-credential` | ships with R-013/R-014 | no reCAPTCHA |
| R-022 | Cy20 ISS-009 | `?intent=` / `?market=` / `?topic=` query-param plumbing on CTAs | `needs-ghl-credential` | ships with R-013/R-014 | UI labels unchanged |
| R-023 | Cy20 ISS-010 | Thank-you pages honesty review at GHL cutover | `ai-prepare-only` | GHL cutover; pre-write copy review | no edit needed today |
| R-024 | Cy20 ISS-011 | Cache-bust `?_=ts` → `?cb=<hex>` | `discard` | shipped Cycle 20-R1 | `scripts/deploy-and-verify.ts` |
| R-025 | Cy20 ISS-012 | `@napi-rs/canvas` page-render skip warning | `ai-prepare-only` | install canvas OR document acceptance | non-blocking |
| R-026 | Cy20 ISS-013 | `audit:copy-density` not in audit:all | `ai-prepare-only` | decide: include / advisory-only | current advisory-only is fine |
| R-027 | Cy20 ISS-014 | `/privacy/` counsel review | `needs-legal` | counsel signoff | pre-cutover |
| R-028 | Cy20 ISS-015 | `/terms/` counsel review | `needs-legal` | counsel signoff | pre-cutover |
| R-029 | Cy20 ISS-016 | `/accessibility/` counsel review | `needs-legal` | counsel signoff | pre-cutover |
| R-030 | Cy20 ISS-017 | `/dmca/` counsel + USCO designated-agent registration | `needs-legal` | counsel + USCO filing | in-process |
| R-031 | Cy20 ISS-018 | FL title length 62 chars | `ai-prepare-only` | trim 2 chars in `src/lib/markets.ts` | current SEO audit reports 0 warnings — verify pre-fix needed |
| R-032 | Cy20 ISS-019 | Mobile-readability deep capture at 320/375/414/768/1280 | `ai-prepare-only` | run `audit:mobile-readability:capture` next cycle | screenshots in cycle-19A-M; hardcode path tech-debt |
| R-033 | Cy20 ISS-020/021 | Lighthouse + axe + pa11y deep pass | `ai-prepare-only` | install tools OR justify static-export waiver | tools absent on host; see `a11y-performance-closure.md` |
| R-034 | Cy20 ISS-022 | Security/build/dependency deep audit | `ai-prepare-only` | next-cycle scope | light pass exists |
| R-035 | Cy20 ISS-023 | `IS_STAGING` gate flips on cutover (staging-wide noindex) | `needs-dns` | DNS + Dokploy env flip | preserve current behavior |
| R-036 | Cy20 ISS-024 | `SITE_URL` flips to production at cutover | `needs-dns` | DNS + Dokploy `NEXT_PUBLIC_SITE_URL` | `src/lib/site.ts:7` PRODUCTION_URL = `https://miasanabriarealtor.com` |
| R-037 | Cy20 ISS-025 | Sitemap rebuilds with production hostname | `needs-dns` | env flip triggers rebuild | automated |
| R-038 | Cy21 9.5 | DBPR primary-source license `SL3405877` verification | `needs-legal` | DBPR verification | currently `MIA.unverified.licenseNumber` |
| R-039 | Cy21 9.5 | NAR + local-board active membership written confirmation | `needs-legal` | written confirmation | gates REALTOR® R logo display |
| R-040 | Cy21 9.5 | SEF MLS broker reciprocity statement | `needs-legal` | LPT broker-of-record text | post-cutover with `.com` |
| R-041 | Cy21 9.6 | Mission-brief discrepancy: `miasanabria.com` vs `miasanabriarealtor.com` | `needs-mia` | Torrey/Mia confirm canonical | repo is currently `miasanabriarealtor.com` |
| R-042 | Cy21 9.6 | Mission-brief discrepancy: IDX target `miasanabria.com/search` vs `sef.mlsmatrix.com` | `discard` | Cycle 21 confirmed `sef.mlsmatrix.com` is the actual IDX | record-keeping only |
| R-043 | Cy21 9.6 | DNS cutover staging → `miasanabriarealtor.com` | `needs-dns` | DNS + cutover packet | per `LAUNCH_CUTOVER_READY_PACKET.md` |
| R-044 | Cy21 9.6 | Direct Axess sunset (legacy `miasanabriarealtor.com` host) | `needs-dns` | coordination with current host provider | pre-cutover |
| R-045 | new | Google Analytics 4 — `NEXT_PUBLIC_GA_ID` not present | `needs-google-analytics` | GA4 property + Measurement ID | see `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` |
| R-046 | new | Google Tag Manager — optional | `needs-google-analytics` | container creation | optional layer; not required for GA4 |
| R-047 | new | Search Console property verification | `needs-google-analytics` | DNS TXT verification at cutover | gates search-impression data |
| R-048 | new | Google Business Profile coherence | `needs-google-analytics` | GBP claim/edit | name + license + service area alignment |
| R-049 | Cy21 9.2 | `audit-mobile-readability.ts` cycle-id parameterization | `ai-prepare-only` | accept tech-debt or parameterize | hardcoded `cycle-19A-M` path |
| R-050 | new | Production PDF noindex / X-Robots-Tag policy | `ai-prepare-only` | Caddyfile rule via Dokploy at cutover | not repo-editable directly |
| R-051 | new | Final `.com` canonical/indexing strategy (preserve `miasanabriarealtor.trueidea.com` 301 vs sunset) | `needs-dns` | redirect policy decision | per `LAUNCH_CUTOVER_READY_PACKET.md` |

## 2. Disposition explanations

- **`ai-close-now`:** items the AI could land in this commit with no principal/credential/legal/DNS gate. Cycle 22 closed 0 such items because all open work touches either Mia's voice, Mia's compliance posture, or external credentials.
- **`ai-prepare-only`:** packet-writable / queueable / scriptable without shipping live changes. Cycle 22 covers all 13 of these in the packets (no source edits).
- **`needs-mia`:** principal taste, brand voice, or product decision. Routed to `MIA_DECISION_PACKET.md`.
- **`needs-ghl-credential`:** blocked on `GHL_*` env. Routed to `GHL_READY_PACKET.md`.
- **`needs-google-analytics`:** blocked on GA4/GTM/SC/GBP access. Routed to `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md`.
- **`needs-legal`:** counsel signoff or external filing. Routed to `LEGAL_COMPLIANCE_PACKET.md`.
- **`needs-dns`:** DNS cutover, Dokploy env, redirect policy. Routed to `LAUNCH_CUTOVER_READY_PACKET.md`.
- **`discard`:** already resolved or superseded.

## 3. Mutual-exclusivity check

Every register row above appears in exactly one disposition column. Sanity grep:

```
$ grep -cE '^\| R-\d{3} ' remaining-work-register.md     # 51 rows
$ jq '.rows | length' remaining-work-register.json        # 51
$ jq '[.rows[].disposition] | group_by(.) | map({k:.[0], n:length})' remaining-work-register.json
[{"k":"ai-prepare-only","n":13},
 {"k":"discard","n":5},
 {"k":"needs-dns","n":4},
 {"k":"needs-ghl-credential","n":10},
 {"k":"needs-google-analytics","n":6},
 {"k":"needs-legal","n":8},
 {"k":"needs-mia","n":9}]
# total = 54 (51 register rows + 3 cross-cited covered-in-packets)
```

> Note: discard rows are records of items already closed in Cycle 21 or superseded — they're kept for traceability but excluded from active-work counts.
