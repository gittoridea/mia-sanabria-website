# Cycle 19A-M — Production-Readiness Register

> Generated 2026-05-11 alongside Cycle 19A-M deploy.
> Every open item classified into one of 6 owner categories.
> Source data: `reports/qa-gate-matrix.json`, `reports/audit-mobile-readability.json`, `out/sitemap.xml`.

## Owner categories

| # | Name | Meaning |
|---|------|---------|
| 1 | Site / content / design defect | In our hands — we fix in next cycle |
| 2 | Tool / process defect | Audit infra, deploy pipeline, harness — we fix |
| 3 | Principal decision required | Mia / Torrey owner decision; nothing legal needed |
| 4 | GHL / ops dependency | Endpoint, auth, field-map, consent — unblocks when GHL wired |
| 5 | Legal / compliance dependency | Attorney sign-off required before .com cutover |
| 6 | Launch / cutover dependency | DNS, canonical, Search Console, GA4, analytics, email, etc. |

## Scorecard (Cycle 19A-M post-deploy expected)

| Bucket | This cycle | Notes |
|--------|------------|-------|
| Site / content / design defects (c1) | **0** | QA-gate matrix shows 0 critical, 0 c1 findings |
| Tool / process defects (c2) | **2** | Cato/Forge PARTIAL-mode pattern (bounded); chrome --dump-dom viewport-clamp (documented WARN in audit-rendered) |
| Principal decisions (c3) | **2** | Branded email/domain decision; license rendering decision |
| GHL / ops dependencies (c4) | **1** | Contact form action="mailto:" — GHL endpoint, auth, field-map not yet wired |
| Legal / compliance dependencies (c5) | **8** | 4 legal pages × principal/legal review + REALTOR®/EHO/MLS mark review + DMCA USCO designated-agent registration + Privacy/Terms attorney review + TCPA consent capture mechanics |
| Launch / cutover dependencies (c6) | **9** | staging noindex strategy lift; .com DNS swap; canonical cutover; Search Console + GA4 + GBP alignment; analytics provider decision; deployment token rotation; live smoke checklist; post-cutover indexability; rollback path |

**Overall verdict:** staging is launch-grade for site/content/design (c1 = 0). Holding for c4/c5/c6 ownership and decisions outside the dev surface.

---

## c1 — Site / content / design defects

*(In our hands. We fix.)*

**This cycle: 0 open.**

Items closed this cycle:
- ✅ Footer double-period: removed trailing `.` after `{SITE.tagline}` concatenation in `SiteFooter.tsx`.
- ✅ "Showing markets" copy ambiguity: sharpened to "Showing featured markets X-Y of Z. Browse all markets at the markets index." in `FeaturedMarketsPager.tsx`.
- ✅ Mobile readability: `globals.css` mobile media query — paragraph line-height 1.72, measure 62ch, body bump to 17px, tap-targets `min-height: 44px` on main/nav/footer anchors. Editorial-luxury desktop type scale preserved above 640px.

---

## c2 — Tool / process defects

*(Audit/infra/harness. We fix.)*

| ID | Item | Status | Plan |
|----|------|--------|------|
| TP-1 | Cato verdict reliability — historical PARTIAL/terminated-mid-investigation pattern | BOUNDED | PAI Algorithm v6.4.0 errata 2026-05-08 enforces Cato verdict-schema (`pass/concerns/fail/skipped` + severities) at the protocol level via `codex exec --output-schema`. This cycle: Cato only on bounded compliance prompts; never accept PARTIAL as final verdict — classify as c2 if it recurs. |
| TP-2 | Forge race-scope-drift on overlapping main-thread edits | BOUNDED | Per `feedback_forge_race_scope_drift.md` — this cycle uses zero overlapping main-thread + Forge edits. Forge invoked read-only in VERIFY at most; main-thread edits paused during any Forge dispatch. |
| TP-3 | chrome --dump-dom mobile viewport clamping (audit-rendered WARN) | DOCUMENTED | `audit-rendered` reports 56/140 probes viewport-dishonest at mobile — instrumentation limitation. Mitigated by separate `audit-mobile-readability` using `--screenshot` capture path; QA gate cross-references both. |
| TP-4 | deploy-and-verify ↔ audit-rendered/audit-hero port 4173 collision | CLOSED | Added `scripts/lib/port-guard.ts` — sub-second TCP connect probe, preferred + fallbacks, refuses to kill blindly. CLI mode `bun port-guard --port=4173 --fallbacks=4174,4175` returns the chosen port. |
| TP-5 | Manual defect class "footer double-period" was not deterministically gated | CLOSED | `audit-stale-terms.ts` now matches regex `[a-z]\.\.\s+[A-Z]` (sentence-boundary double-period) — defect class promoted from manual to gate. |
| TP-6 | Manual defect class "visible Updated MONTH YYYY blog label" not deterministically gated | CLOSED | `audit-stale-terms.ts` now matches `>\s*Updated\s+<month>\s+20[0-9][0-9]\s*<` — defect class promoted from manual to gate. |
| TP-7 | Full-site per-page QA matrix did not exist | CLOSED | `scripts/audit-qa-gate.ts` produces `reports/qa-gate-matrix.{json,md}` covering 40 routes × ~12 columns; classifies every finding into owner_category 1..6. |
| TP-8 | Route inventory not derived from source-of-truth | CLOSED | `scripts/audit-route-inventory.ts` derives from `out/sitemap.xml`, cross-checks against filesystem `src/app/**/page.tsx` + dynamic templates. |
| TP-9 | Mobile readability not deterministically gated | PARTIAL — contract presence only | `scripts/audit-mobile-readability.ts` is a CSS-contract-presence check (per Cato F1 cross-vendor audit). The PASS verdict means documented CSS tokens (line-height 1.6X, max-width 70ch, body 16px, tap-target tokens) are present in served HTML — it does NOT do a real per-viewport layout pass. The `@media (max-width: 640px)` mobile bump is asserted via the screenshot capture channel (`--capture` → `docs/artifacts/.../mobile-readability/after/`) plus independent visual review, not by this audit's verdict. Future cycle should add real chrome JS evaluation via `--remote-debugging-port` + CDP eval. Reports honestly disclose this at the top. |
| TP-10 | qa-gate footer double-period regex broader than audit-stale-terms (Cato F2) | CLOSED | Tightened `audit-qa-gate.ts` to `/[a-z]\.\.\s+[A-Z]/` (sentence-boundary) — matches audit-stale-terms contract. Prevents future false-fires on path-like or aria-label `..` tokens. |
| TP-11 | qa-gate only iterated sitemap routes (Cato F4) | CLOSED | `audit-qa-gate.ts` now also walks `out/` for every `index.html` and reports `filesystem_route_count` + `fs_only_routes[]`. Routes shipped to live but absent from sitemap are now scanned (still flagged as fs-only for review). |
| TP-12 | globals.css mobile tap-target selector caught inline prose links (Cato F5) | CLOSED | Tightened from `:where(main a[href]:not([class*="inline"]))` to specifically-targeted selectors: `nav`, `footer`, `a[role="button"]`, `a.btn`, `a[class*="btn-"]`, `a[class*="button"]`, `a[href^="tel:"]`, `a[href^="mailto:"]`. Inline `<p>` prose links no longer forced to `inline-flex`. |
| TP-13 | qa-gate trust_proof_present satisfied only by footer (Cato F6) | OPEN — c2 (low) | Per-page assertion of EHO/MLS disclaimer/license # not yet wired; current trust-proof passes only because shared footer renders LPT + REALTOR®. Defer to next cycle; risk = a future build regression dropping the EHO logo would still show ✓. |

---

## c3 — Principal decisions required

*(Mia / Torrey owner decision; nothing legal needed.)*

| ID | Item | Required from | Notes |
|----|------|---------------|-------|
| P-1 | Branded email + domain decision | Mia | Choose: `info@miasanabriarealtor.com` or `hello@`; affects email-row in footer + contact-page Mail row. Currently uses Mia's personal Gmail `msanabriarea@gmail.com`. |
| P-2 | License rendering decision (c3 + adjacent c5) | Mia + counsel | Footer + Terms currently conditional on `MIA.unverified.licenseNumber`. Decision: do we surface license # in production or leave brokerage-level (LPT Realty) only? **Cato F3 (Cycle 19A-M cross-vendor audit):** Florida FREC Rule 61J2-10.025 governs licensee identification on advertising; this is a regulatory boundary, not pure principal aesthetics. Confirm with counsel before final decision. |

---

## c4 — GHL / ops dependencies

*(Unblocks when GHL endpoint + auth + field-map are wired in repo.)*

| ID | Item | Status | Spec needed |
|----|------|--------|-------------|
| G-1 | Contact form GHL endpoint | BLOCKED-MISSING | endpoint URL · auth scheme · field map (name, email, phone, message, market-interest, budget-band, source) · consent capture · TCPA consent mechanics · timestamp/IP/user-agent capture if required · audit log · spam protection · success/failure logging · failure fallback (back to mailto?) · test lead procedure · notification routing · CRM source attribution. |
| G-2 | Home Valuation form GHL endpoint | BLOCKED-MISSING | Same spec as G-1 plus address fields. Currently mailto fallback. |
| G-3 | Buyer Brief intake GHL endpoint | BLOCKED-MISSING | Same spec; lives behind `/thank-you/buyer-brief` flow. |

---

## c5 — Legal / compliance dependencies

*(Attorney sign-off before .com cutover.)*

| ID | Item | Required from | Notes |
|----|------|---------------|-------|
| L-1 | Privacy policy review | Mia + counsel | `/privacy` page exists with conditional GHL language; needs attorney sign-off. |
| L-2 | Terms of service review | Mia + counsel | `/terms` page exists with REALTOR® + FL governing law; needs attorney sign-off. |
| L-3 | Accessibility statement review | Mia + counsel | `/accessibility` page exists; needs attorney sign-off prior to public cutover. |
| L-4 | DMCA notice + USCO designated-agent registration | Mia + counsel | `/dmca` page contains in-process language flagged by `audit-legal` (acceptable for staging, BLOCKED for production cutover per `CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md`). USCO designated-agent registration ($6/year) required before public listing. |
| L-5 | REALTOR® mark usage approval | NAR Membership Marks Manual | Footer + headings reference REALTOR®. Confirm Mia's active NAR membership status before live cutover. |
| L-6 | Equal Housing Opportunity mark usage | HUD (public domain for Fair Housing signaling) | Footer renders EHO. Public-domain mark; document on legal sign-off. |
| L-7 | MLS / IDX disclaimer + mark usage | Local MLS (SEF) | Footer states "All information is deemed reliable but not guaranteed. IDX listings provided for consumers' personal, non-commercial use; not for redistribution." Confirm wording matches local MLS rules. |
| L-8 | TCPA consent mechanics on contact forms | Counsel + GHL setup | When GHL endpoint wires up (c4), TCPA consent flow needs counsel review (consent text, opt-in vs opt-out, audit log retention). |

**Anti:** no legal conclusions provided by this cycle. All items mark PRINCIPAL_DECISION_REQUIRED or LEGAL_APPROVAL_REQUIRED.

---

## c6 — Launch / cutover dependencies

*(DNS, canonical, analytics, email, etc.)*

| ID | Item | Status | Notes |
|----|------|--------|-------|
| LC-1 | Staging noindex strategy | IN-PLACE | Every staging route emits `meta robots noindex` (QA-gate matrix shows 40/40 routes c6:noindex). For production cutover: remove noindex on production canonical pages; keep staging noindex on .trueidea.com. |
| LC-2 | .com DNS swap from current host | DEFERRED | `miasanabriarealtor.com` currently points at Direct Axess/GHL surface. Cutover ETA undecided; coordinate with current host removal + DNS TTL pre-lowering. |
| LC-3 | Production canonical rules | PLANNED | Once .com is live, every page emits `rel=canonical` pointing at the .com URL (already configured via `SITE.url` in `src/lib/site.ts`). Verify after cutover. |
| LC-4 | Search Console / GA4 / GBP alignment | NOT-STARTED | Set up GA4 property + Search Console property post-cutover; submit sitemap to Search Console; ensure GBP listing claims and links to the production URL. |
| LC-5 | Analytics provider decision | PRINCIPAL | GA4 alone, or GA4 + Plausible? PRINCIPAL decision before production cutover. |
| LC-6 | Branded email & domain | PRINCIPAL (see P-1) | Mia decides domain + alias scheme. |
| LC-7 | Deployment token rotation | HIGH-PRIORITY | DOKPLOY_API_TOKEN was reportedly exposed in a pasted terminal transcript. Rotate via Dokploy admin UI BEFORE next deploy that requires a new token. Do not echo the new token to chat/logs. (This cycle preserved the existing token in `~/.claude/.env`; no token value appeared in any output.) |
| LC-8 | Live smoke-test checklist | DRAFTED | Post-deploy checks: Home, Markets, Fort Lauderdale, Pompano Beach, Boca Raton, Delray Beach, Contact, Home Valuation each return 200 with `?_=<ts>` cache-bust; ETag flipped; mobile screenshot evidence captured under `docs/artifacts/cycle-19A-M/mobile-readability/after/`. |
| LC-9 | Post-cutover indexability check | PLANNED | After .com is live: `curl -sI https://miasanabriarealtor.com/sitemap.xml`; submit to Search Console; check `site:miasanabriarealtor.com` returns the canonical pages within 1-2 weeks. |
| LC-10 | Rollback path | DRAFTED | Dokploy retains prior images; rollback = redeploy last good image. Prior live ETag (`difgit5lydj44nrd`) captured pre-cycle and recorded in handoff. |

---

## Open-items severity rollup (post-Cycle 19A-M, pre-cutover)

| Severity | Count | Categories |
|----------|-------|------------|
| Critical | 0 | — |
| High | 4 | c5 × 4 (legal pages need attorney) |
| Medium | 1 | c4 × 1 (contact mailto fallback) |
| Low (intentional) | 40 | c6 × 40 (staging noindex) |

Site is launch-grade for c1; holding for c4/c5/c6 ownership.
