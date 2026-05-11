# Cycle 19B-FL — Production Readiness Register

> Cycle 19B-FL closes Cato F6 / TP-13 (trust proof footer-only) and ships 3 PDF
> lead magnets, redesigned Fort Lauderdale buyer + seller playbooks, the
> homepage "Latest Insights" wording cleanup, and an extended audit chain. The
> Cato F1 / TP-9 (mobile-readability contract-only) remains OPEN — Cycle 19B-FL
> consciously did NOT ship a real Chrome CDP per-viewport measurement; the
> rationale + carry-forward live in TP-9 below.

## A — Closed this cycle (Cycle 19B-FL deliverables)

| # | Card | Status | Owner |
|---|---|---|---|
| TP-13 | Trust-proof per-page above the fold, not satisfied only by shared footer (Cato F6) | **CLOSED** — `<TrustRow>` global strip renders REALTOR® · LPT Realty LLC · FL License #SL3405877 · Fort Lauderdale-based on every route. New `audit:trust-row` (13/13 routes) gates this. Trust row sized ≤24px at desktop so hero CTA stays above fold at 1280×800 (verified by `audit:rendered`). | Closed |
| 19B-A1 | Buyer + seller playbook card-grid redesign on `/markets/fort-lauderdale/` | **CLOSED** — buyer playbook is now 6 atomic cards with decision-gate emphasis on step 06 (private availability); seller playbook is 7 cards with decision-gate emphasis on step 07 (quiet pre-market option). CTA aside moved below the card grid so cards use full editorial width. `audit:fort-lauderdale-standard` 31/0 regression-clean. | Closed |
| 19B-A2 | Lead-magnet system — 3 brand-quality PDFs + honest-fallback gating | **CLOSED** — `Waterfront Buyer Due Diligence Checklist`, `Luxury Seller Pre-Listing Checklist`, `Fort Lauderdale Waterfront Valuation Prep Sheet` rendered via `bun run build:pdfs` (chrome --print-to-pdf). Direct downloads + "Request a private brief" CTA — no fake GHL endpoint (principal directive Q3 + Q4). `audit:lead-magnets` 4/4 checks pass. | Closed |
| 19B-A3 | Visible "evergreen" wording retired from homepage + /insights/ + /thank-you/market-brief/ (keep "Latest Insights" heading) | **CLOSED** — InsightsTeaser default + page.tsx + insights/page.tsx + thank-you/market-brief/page.tsx all rewritten to "Selected field notes…" / "editorial briefs" language. `audit:stale` FORBIDDEN list extended with "evergreen" — clean across out/. | Closed |
| 19B-A4 | Schema / AEO inventory + audit hardening | **CLOSED** — inventory doc at `docs/CYCLE_19B_FL_SCHEMA_INVENTORY.md`; 247 JSON-LD blocks across 49 pages all parse with @context + @type; new `audit:no-fabrications` catches off-market guarantees, fabricated transaction volume, years-experience claims, languages claims, response-time fabrications, and the principal-gated "Same-business-day response" phrase. 0 hits in this build. | Closed |
| 19B-B1 | Principal directive Q1 — license rendering | **RESOLVED** — Mia approved displaying "FL License #SL3405877" in the global trust row. Cycle 18 B1 closes via this approval. License remains in `MIA.unverified.licenseNumber` in `src/lib/mia.ts` as a typed string (no schema change needed); production renders it through the TrustRow component. | Resolved |
| 19B-B2 | Principal directive Q2 — "Same-business-day response" | **RESOLVED-omit** — Mia chose to omit until vetted. TrustRow does NOT render the response-time claim; `audit:no-fabrications` blocks regression. | Resolved |
| 19B-B3 + 19B-B4 | Principal directive Q3 + Q4 — lead-magnet gating with proper disclaimer/agreement | **RESOLVED-honest-fallback** — PDFs ship un-gated with direct download CTAs and a "Request a private brief" alternative path. PDF disclaimer block ("Not legal, insurance, inspection, marine survey, engineering, tax, or lending advice. Mia coordinates; licensed specialists confirm.") AND a separate PDF Use Agreement block ("personal, non-commercial use; no resale / rebranding; copyright retained; not professional advice in any regulated field") are both rendered into every PDF source HTML and audited. | Resolved |

## B — Needs principal decision (carried forward from Cycle 18, unchanged except B1)

| # | Card | Status | Owner |
|---|---|---|---|
| B1 | License rendering | **CLOSED** via Cycle 19B-FL Q1 — see 19B-B1 above. |
| B2 | Analytics provider — pick GA4 / Plausible / Umami; provide measurement ID | OPEN | Principal |
| B3 | Branded email — pick provider; provide MX + initial inbox | OPEN | Principal |
| B4 | `.com` cutover sign-off — DNS swap + 301 redirect plan | OPEN | Principal |
| B5 | Service-area expansion — Palm Beach proper + non-Eastern variants OR retain canonical | REVIEW (carry forward) | Principal |
| B6 | Userway widget activation — load script or null the ID | REVIEW | Principal |
| B7 | Quarterly client-list cap — re-add if confirmed in writing | REVIEW | Principal |
| B8 | Global listing distribution affiliate — re-add with named partner if applicable | REVIEW | Principal |
| B9 | About meta-tag service-area drift — Boca/Delray "Eastern" qualifier on meta + og + twitter | OPEN | Principal direction needed |

## C — Needs legal / compliance review (carried forward from Cycle 17, unchanged)

| # | Card | Status | Owner |
|---|---|---|---|
| C1 | `/privacy/` — counsel read pending for `.com` cutover | REVIEW | External counsel + principal |
| C2 | `/terms/` — counsel read + TCPA form copy pending | REVIEW | External counsel + principal |
| C3 | NAR REALTOR® mark usage — legal sign-off pending for `.com` cutover | REVIEW | External counsel + principal |
| C4 | TCPA consent copy (mandatory before any GHL form wiring) | OPEN | External counsel + principal |
| C5 | USCO DMCA designated-agent registration ($6 + ~15 min principal time) | OPEN | Principal |
| **C6 (new)** | PDF lead-magnet disclaimer + use-agreement copy — Cycle 19B-FL drafted in Mia's voice; external counsel review recommended before `.com` cutover for liability posture | REVIEW (carry forward) | External counsel + principal |

## D — Needs GHL / ops wiring (carried forward, sequenced behind C4)

| # | Card | Status | Owner |
|---|---|---|---|
| D1 | GHL workflow webhook URL — provide for /contact/ + /valuation/ + /thank-you/* form POSTs | OPEN (blocked by C4) | Principal + engineering |
| D2 | GHL pipeline stage names + tag taxonomy | OPEN (blocked by C4) | Principal + engineering |
| D3 | GHL notification routing (email / SMS) | OPEN (blocked by C4) | Principal + engineering |
| D4 | Privacy policy update reviewed by legal counsel (post-GHL wiring) | OPEN (blocked by C1 + D1) | External counsel + principal |
| **D5 (new)** | Lead-magnet event capture (download counts, magnet → conversation rate) when analytics + GHL are wired | OPEN (blocked by B2 + D1) | Principal + engineering |

## E — Needs launch / cutover (carried forward, unchanged)

| # | Card | Status | Owner |
|---|---|---|---|
| E1 | DNS cutover from current Direct Axess host to staging URL | OPEN (blocked by B4) | Operations + principal |
| E2 | 301 redirect plan from old `.com` to new `.com` | OPEN | Operations + principal |
| E3 | Cloudflare proxy setup (TLS, edge caching policy) | OPEN | Operations + principal |
| E4 | Direct Axess decommission timing | OPEN | Operations + principal |
| E5 | Final pre-cutover smoke test (lighthouse, broken-link sweep, 301 verification) | OPEN | Operations + principal |

## TP — Tool / process register

| # | Card | Status | Owner |
|---|---|---|---|
| TP-9 | Mobile readability — CSS-contract-presence-only (Cato F1, Cycle 19A-M) | **OPEN (carry-forward)** — Cycle 19B-FL did NOT ship real Chrome CDP per-viewport measurement. The decision: time budget at E5 was better spent on the gold-standard FL page redesign + lead-magnet system + audit chain + trust-row close. The existing `audit:mobile-readability` remains a CSS-contract-presence check; the report header honestly discloses this. Screenshot-backed before/after captures live in `docs/artifacts/cycle-19b-fl/screenshots/before/` and (after Gemini blindspot review) `docs/artifacts/cycle-19b-fl/screenshots/after-local/`. Cycle 19C should ship the CDP path as a dedicated mission. |
| TP-13 | Trust-proof footer-only (Cato F6) | **CLOSED** — `<TrustRow>` global strip + `audit:trust-row` gate. |
| **TP-14 (new)** | `audit:hero-pixel-contrast` glyph 2.94 < 3.0 on `/markets/seven-isles/` at 768×1024 | **OPEN (carry-forward)** — pre-existing edge case (min=max=median, no sample variance), NOT introduced by Cycle 19B-FL. The seven-isles hero text contrast against the hero image at 768 is 2.94, 0.06 below the 3.0 threshold. Cycle 18 trimmed Pompano Beach for a similar reason; Cycle 19C should evaluate (a) a darker image overlay specifically on seven-isles or (b) lowering the threshold to 2.9 if the WCAG-large-text guideline permits given font size + weight. |
| **TP-15 (new)** | Schema duplicates on `/markets/fort-lauderdale/` — RealEstateAgent + Place + BreadcrumbList emitted both by `FortLauderdaleV2.tsx` and by `markets/[slug]/page.tsx` | **OPEN (carry-forward)** — produces 6 JSON-LD blocks where 3 would suffice. Audit-schema accepts (all parse); noise is informational, not breaking. Cycle 19C cleanup: pick the canonical emitter and add `audit-schema-no-duplicates`. |

## Cycle 19B-FL deliberate non-goals (out of scope, not blockers)

- Boca Raton V2 page rollout (per principal directive — only after FL is accepted as gold-standard).
- Real Chrome CDP per-viewport measurement (TP-9 carry-forward — see above).
- Schema duplicate cleanup on `/markets/fort-lauderdale/` (TP-15 carry-forward).
- Seven-isles hero contrast remediation (TP-14 carry-forward).
- New schema types (Review / Rating / Award / priceRange / Offer) — principal verification required, not introduced this cycle.
- GHL form wiring (D1-D4 carry-forward).
- Cloudflare / DNS cutover (E1-E5 carry-forward).

## Next-cycle recommendation

Cycle 19C should proceed in this priority order:
1. **Boca Raton V2 page rollout** — Fort Lauderdale is now the canonical gold-standard template; apply the rollout pattern (Hero → trust-aware section spacing → playbook card grids with decision-gate emphasis → waterfront-diligence-snapshot lead-magnet module → schema → FAQ → 4-CTA strip) to Boca Raton.
2. **Real Chrome CDP mobile measurement** — close TP-9; convert `audit:mobile-readability` from contract-only to real per-viewport `getComputedStyle` + above-fold + tap-target measurement at 320/375/414/768/desktop.
3. **Schema duplicate cleanup** — close TP-15; pick canonical emitter on `/markets/[slug]/`.
4. **Seven-isles hero contrast remediation** — close TP-14; revisit Hero image overlay strength or text contrast threshold.
5. **Principal-decision session** — same as Cycle 18's recommendation — 60-90 min principal session to close B2-B9 (analytics, branded email, .com cutover, service-area expansion, etc.).

## Honest claim

Cycle 19B-FL ships the Fort Lauderdale gold-standard market page, the homepage trust row, 3 PDF lead magnets, the schema/AEO inventory, the audit-chain hardening, and the visible "evergreen" cleanup — verified locally with all gating audits green except the pre-existing seven-isles hero-contrast edge case (TP-14, not introduced by this cycle).

Cycle 19B-FL is **NOT `.com` launch-ready** — the C, D, E carry-forwards remain blocking external decisions. It IS gold-standard for the Fort Lauderdale market page and is the canonical template for Cycle 19C's Boca Raton V2 rollout.
