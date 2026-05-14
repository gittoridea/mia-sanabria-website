# Cycle 30B — Expert Lane Findings (consolidated)

**Mission:** Expert gap-closure command center + launch readiness dossiers
**Date:** 2026-05-13
**Repo HEAD:** `3c0381f` (Cycle 30 commit, pushed to origin/main in Phase 1)
**Lanes run as:** manual named expert review passes (see `tool-and-expert-discovery.md` for tool/subagent inventory + substitution policy)

## Lane → role → deliverable index

| Lane | Role lens | What's already closed | What Claude closed this cycle | What stays externally blocked | Recommended future mission | Dossier |
|---|---|---|---|---|---|---|
| **A** | Mission Commander / Launch DoD Officer | Cycle 30 launch-blocker matrix + cutover decision tree exist | Launch gate sequence G1–G12; "do not start before" list; LE exception template; rollback readiness checklist; minimum safe cutover criteria; honesty contract enforcement rule | All gates G1–G9 owned by Mia / counsel / Torrey / GHL / Google / DNS | Continuous use across Cycles 31–37 | `launch-doD.md` |
| **B** | Repo / Validation Engineer | `audit:mobile-readability` 56/56 PASS against live for 14 default routes (Cycle 30) | **Extended `scripts/audit-mobile-readability.ts` `DEFAULT_ROUTES` from 14 → 21 routes** to cover all 9 Mia-approved neighborhoods + 2 reference markets (boca-raton, delray-beach); rewrote stale comment | n/a — Lane B fully closable; Phase 7 will rerun audit to prove new route count | next visual cycle | (embedded in this index — see "Lane B closure detail" below) |
| **C** | Canonical / Doctrine Consistency Engineer | `src/lib/site.ts` `PRODUCTION_URL`; `docs/mia-client-decision-record.md` already correct; Cycle 30 banners on `CUTOVER_PACKET`, `MIA_IDEAL_PRODUCTION_STATE`, `NEXT_SESSION_TRIGGER` | **Added CANONICAL TARGET UPDATE banner to top of `ISA.md`** pointing to decision record + naming current doctrine; preserved Vision body + Decision Log as honest dated history | None — Lane C closed for Cycle 30B scope. Full ISA Vision body rewrite deferred to post-cutover ISA-rev cycle. | post-cutover ISA-rev cycle | (embedded in this index — see "Lane C closure detail" below) |
| **D** | UX / Conversion / Luxury Real Estate Advisor | Cycle 30 `mia-review-packet.md` (route checklist + decision buckets + 9 specific questions) | `mia-review-sendoff.md` (short send message Torrey can paste to Mia); `mia-feedback-intake-template.md` (deterministic Mia-feedback → Cycle-31-action mapping) | Mia's actual response | Cycle 31 Mia Review Decisions Application | `mia-review-sendoff.md` + `mia-feedback-intake-template.md` |
| **E** | Local SEO / Content Truth Advisor | Cycle 27 evergreen evidence library; no fabrication invariants; route slugs locked; sitemap reconciles | SEO readiness dossier with alias/redirect plan (Option A recommended: keep current slugs forever) | Mia's "Blog vs Insights" decision; Mia's Boca/Palm full-page decision; Mia's photo priorities | Cycle 31 | `seo-content-readiness-dossier.md` |
| **F** | Security / Bridge IDX Architect | `src/lib/bridge.ts` scaffold with `BRIDGE_INTEGRATION_LIVE = false`; sanitized `SanitizedListing` type defined; no credentials in repo | Bridge runtime readiness dossier; **classification correction:** Bridge is "launch-decision required," NOT "non-critical" until LE exception is recorded | Torrey's runtime choice (A/B/C/D); credentials remain external | Cycle 33 Bridge Runtime Architecture | `bridge-runtime-readiness-dossier.md` |
| **G** | GHL Lead Routing Engineer | Form scaffold + mailto fallback; thank-you pages in place; CTAs route correctly | GHL forms readiness dossier with G-A (CF Worker / Function proxy) recommended; full custom-field/workflow/Turnstile/honeypot/success-fail UI plan | Torrey provides webhook URL + custom field IDs + workflow IDs + Turnstile keys; runtime decision | Cycle 32 GHL Forms + Lead Routing | `ghl-forms-readiness-dossier.md` |
| **H** | Google / Measurement / Search Console Advisor | CSP allows GTM + GA4 domains; GA4 measurement ID `G-PYYSF87G8K` known; Consent Mode v2 text exists in `/privacy/` | Google readiness dossier with GTM container setup, Consent Mode v2 default-deny, GA4 config + event tags, GSC/Bing/GBP post-cutover plan | Torrey provisions GTM container; Mia/Torrey hold off on GSC/Bing/GBP until DNS cutover | Cycle 34 Google/GTM/Consent + post-cutover Cycle 37 GSC/Bing/GBP | `google-measurement-readiness-dossier.md` |
| **I** | DNS / Dokploy / Cutover Engineer | Staging deploy mechanism documented (Dokploy app `XJSRlvH-91ZtUsh0RPGvo`, Helos VPS `148.230.82.215`, Caddy static export, Traefik routing) | Cutover readiness dossier with pre-cutover checklist, DNS records list, Dokploy domain bind steps, `NEXT_PUBLIC_SITE_URL` build-arg, TLS verification, 301 redirect plans for staging + legacy `miasanabriarealtor.com`, rollback paths, pre-cutover dry-run via `/etc/hosts` | All of G1–G9 from `launch-doD.md` | Cycle 36 DNS/Dokploy Canonical Cutover | `dns-dokploy-cutover-readiness-dossier.md` |
| **J** | Legal / Compliance / CATO Readiness Advisor | EHO, REALTOR® rendering, TCPA text, Florida CCPA disclosure all in place (Cycle 22 audit) | Legal/CATO readiness dossier with counsel question list, broker (LPT) question list, Cato 10-axis re-audit scope, LE exception template for known legal gaps | Counsel-final DMCA USCO designation; Cato re-run on E4/E5 ISA mission | Cycle 35 Legal/CATO Closure | `legal-cato-readiness-dossier.md` |
| **K** | Photos / Testimonials / Brand Asset Advisor | Fort Lauderdale hero approved Cycle 22-R1; no fabrication invariants; testimonial capture rules locked (FB/Realtor.com exact text + permission) | Photos/testimonials readiness dossier with city-image replacement priority recommendation (Pompano Beach → Hollywood → Weston/Coral Springs first), source options with risk ranking, testimonial intake YAML template, source attribution rendering pattern | Mia's photos + license; Mia's testimonial captures with permission evidence | Cycle 31 / 32 application as Mia responses arrive | `photos-testimonials-readiness-dossier.md` |
| **L** | Browser Use / Visual QA Advisor | Playwright coverage via 5+ audit scripts; cycle 22-R1 + 23 screenshot baselines preserved | Browser Use readiness dossier with use-case matrix (low value for review, moderate for pre-cutover dry run, high for form-submit verification); install prerequisites; no-write safety policy; Interceptor vs Browser Use comparison | Torrey decision to install (separate authorization) | Cycle 30A Browser Use Skill Install + Read-Only Staging QA (optional) | `browser-visual-qa-readiness-dossier.md` |
| **M** | Dev Housekeeping / Bloat Reduction Advisor | `out/`, `node_modules/`, `.next/` already `.gitignore`-d; cycle artifacts intentional history | Bloat dossier classifying intentional vs regenerated; no-delete recommendation; future cleanup candidates listed without endorsement | n/a — preserves status quo | optional post-launch | `dev-housekeeping-bloat-dossier.md` |

## Lane B closure detail

**Before Cycle 30B:** `scripts/audit-mobile-readability.ts` `DEFAULT_ROUTES` = 14 routes (Home, Markets hub, Fort Lauderdale, Pompano Beach, Boca Raton, Delray Beach, Contact, Valuation, Buyers, Sellers, About, Insights, 2× insight detail). The 7 new Mia-approved neighborhood routes (Cycle 25) were held out of the default sweep because the live staging deploy hadn't shipped them at the time the file was authored.

**Cycle 29 deploy:** shipped commit `e32310d` to TrueIdea staging. All 7 routes verified 200 live per Cycle 29 §14.6.

**Cycle 30B closure:** `DEFAULT_ROUTES` rewritten to include all 9 Mia-approved neighborhoods + Boca Raton + Delray Beach (kept as reference markets that still ship pages) + 5 core surfaces + 3 insights routes = **21 routes**. Comment block updated to describe the post-Cycle-29 reality and to point at the `MIA_APPROVED_CYCLE25_ROUTES` export (preserved for explicit `--routes=` callers).

**Validation:** Phase 7 runs `audit:mobile-readability --base=https://miasanabriarealtor.trueidea.com` and prove the new count appears in the output. Expected: 4 device profiles × 21 routes = **84 PASS** (or close, depending on whether any combos warn).

## Lane C closure detail

**Before Cycle 30B:** `ISA.md` §Vision (line 25) named `miasanabriarealtor.com` as the cutover target. The Cycle 30 canonical-domain-drift audit deferred this edit because Vision body rewrites are larger-touch and risky.

**Cycle 30B closure:** ISA.md gained a top banner immediately under the title (lines 18-19) noting the CANONICAL TARGET UPDATE per Cycle 24/30/30B, naming `https://miasanabria.com` as the final canonical, pointing to `docs/mia-client-decision-record.md` + `src/lib/site.ts:14-15` as the source of truth. Vision body + Decision Log entries preserved as honest dated history. A future ISA-rev cycle (post-cutover) will rewrite the Vision body itself; until then, no operator runs cutover from ISA — they run from `docs/CUTOVER_PACKET.md`, which already carries a Cycle 30 banner.

**Net effect:** any reader of ISA.md sees the canonical update before reading any Vision/Out-of-Scope/Decision-Log row that names the old target. Zero risk of mis-reading.

## Mission scope summary

| Closed this cycle | External-blocked (dossier'd) | Deferred to future cycle |
|---|---|---|
| Cycle 30 commit push (Phase 1) | Mia review/sign-off (Cycle 31) | ISA Vision body rewrite (post-cutover) |
| Mobile-readability default route extension (Lane B) | Counsel DMCA designation (Cycle 35) | Artifact dir restructuring (post-launch, optional) |
| ISA canonical banner (Lane C) | Cato re-audit (Cycle 35) | Bing Webmaster + GBP sync (post-cutover Cycle 37) |
| 13 expert dossiers + 1 send-off + 1 intake template + 1 launch DoD | GHL forms wiring (Cycle 32) | Direct Axess unhook + legacy 301 (post-cutover) |
| Cycle 30B claim-vs-reality + tool-discovery + index | Bridge runtime decision (Cycle 33) | |
| Session report Cycle 30B section (Phase 8) | GA4/GTM (Cycle 34) | |
| One Cycle 30B local commit (Phase 9) | DNS cutover (Cycle 36) | |
|  | Post-cutover smoke (Cycle 37) | |

**Production-readiness claim made this cycle:** none.
