# Next Session Trigger — After Cycle 17

**Cycle 17 close state:** PASS · "Evergreen Brief" removed sitewide (now "Market Note · `<Month>`") · Fort Lauderdale V3 content lift in-place on FortLauderdaleV2.tsx (new prelude + 7-card framework + per-peer pointers + anti-pattern asides + 9 FAQs) · Footer REALTOR® + EHO logos swapped to canonical NAR + equalhousinglogo.com white-on-transparent assets · Legal pages recheck (1 PASS / 2 REVIEW / 1 BLOCKED-BY-USCO unchanged) · About credentials/service-area recheck (Cycle 16 softening intact; surfaced 5 REVIEW items for principal) · 2 new audits (`audit:trust-logos`, `audit:fort-lauderdale-v3`) · 0 FAIL across 15 audits · live-verified on staging.

The next session has three realistic shapes. **Option A remains the highest-leverage move** (principal-decision unblocking — still 4 hard external gates + 4 surfaced REVIEW items). Option B is Boca Raton V2 (one-market-per-cycle rollout, now using the FL V3 pattern as the canonical gold standard). Option C is the GHL form wiring engineering cycle (Cycle 17+ prereqs must still be in hand).

---

## Option A — Principal-decision session (RECOMMENDED — highest leverage)

If the principal has bandwidth for ~60-90 minutes of decisions, this remains the highest-leverage next move. It unblocks 4 hard external gates (B1-B4) plus surfaces 4 REVIEW items (B5-B8) without operator engineering time.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Principal Decision Pass on Production-Readiness Blockers (Post-Cycle-17)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Walk principal through the 4 hard external blockers from CYCLE_17_PRODUCTION_READINESS_REMAINING_LIST.md category B (still open as of Cycle 17 close), and surface decisions on the 4 REVIEW items the recheck cycle uncovered. The 4 hard axes are:

1. License rendering (Card 1) — confirm DBPR-verified license # in writing OR authorize "stay current" with unverified flag.
2. Analytics provider (Card 2) — pick GA4 vs Plausible vs Umami; provide measurement ID. ~15 min decision + ~30 min implementation.
3. Branded email (Card 3) — pick provider (Google Workspace / Zoho / Fastmail); provide MX record + initial inbox provisioning.
4. .com cutover sign-off (Card 6) — DNS swap from current Direct Axess host to staging URL; 301 redirect plan.

The 4 REVIEW items (surfaced in Cycle 17 About recheck):
B5. Service-area expansion (canonical is currently 3 "Eastern" sub-markets; mission prompt suggested Palm Beach proper + non-Eastern variants).
B6. Userway widget activation (load script or null the ID — Cycle 16 carryforward).
B7. Quarterly client-list cap (re-add if confirmed in writing).
B8. Global listing distribution affiliate (re-add with named partner if applicable).

After capturing decisions, ship the 1-3 quick wins:
- Update src/lib/mia.ts licenseNumber per principal decision.
- Insert analytics tag into src/app/layout.tsx per principal choice.
- Document branded-email + DNS cutover as scheduled engineering work.
- If B5 confirmed: update MIA.contact.serviceAreas + PUBLIC_FACT_LEDGER §1 + audit:about canonical match.

Mission boundaries (DO NOT):
- Touch GHL wiring or TCPA mechanics (separate cycle, blocked by legal-counsel).
- Implement DNS cutover without explicit principal sign-off + scheduled date.
- Modify REALTOR® mark usage beyond Cycle 17 NAR canonical asset (Cards C2 + C3; legal review pending).
- Reopen Cycle 17 design work (label cleanup locked; FL V3 lift locked; trust-logo swap locked; legal recheck locked; about recheck locked).
- Reopen Cycle 14-16 design work.

READ FIRST:
1. ISA.md
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_17_BLOG_LABEL_FORT_LAUDERDALE_V3_TRUST_LOGOS_2026-05-10.md
3. docs/CYCLE_17_PRODUCTION_READINESS_REMAINING_LIST.md
4. docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md (24 axes)
5. docs/PRINCIPAL_DECISION_REGISTER.md
6. docs/CYCLE_17_FOOTER_OFFICIAL_TRUST_LOGO_FIX.md (REVIEW items for principal-legal)
7. docs/CYCLE_17_LEGAL_PRODUCTION_READINESS_RECHECK.md (REVIEW gates for cutover)
8. docs/CYCLE_17_ABOUT_ACCURACY_RECHECK.md (5 surfaced REVIEW items)
9. src/lib/mia.ts (licenseNumber + email config + serviceAreas)
10. src/lib/site.ts (tagline + site description — note Forge VERIFY surfaced meta drift)
11. src/app/layout.tsx (analytics tag insertion point)
```

---

## Option B — Boca Raton V2 (single-market V2 rollout using the FL V3 pattern)

The Cycle 17 FL V3 pattern is the new canonical gold standard. Boca Raton is the next-natural market to V2 (Palm Beach County primary cohort; ranks #2 in the principal-locked HOMEPAGE_FEATURED_ORDER).

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Cycle 18 · Boca Raton V2 Market Page (single-market rollout using the FL V3 gold-standard pattern)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Apply the Cycle 17 FL V3 content pattern to Boca Raton. Build src/components/markets/BocaRatonV2.tsx using FortLauderdaleV2.tsx as the canonical template — preserve all V3 sections (hero precision frame, "A decision, not a default" prelude, 7-card decision framework, per-peer pointers, buyer + seller playbooks with anti-pattern asides, 9 FAQs, 4-CTA strip).

Items to ship:

1. Create src/components/markets/BocaRatonV2.tsx based on FortLauderdaleV2.tsx. Per-section guidance:
   - Hero: Boca-specific precision frame (not "yacht access, downtown, canal" — Boca's vector is "country-club residential, A1A oceanfront, Mizner-pedigree downtown").
   - Prelude: "Boca Raton rewards a written brief." — anchor in the Palm Beach County / pedigree / country-club lens.
   - Executive AEO: pull from market.aeoAnswer (verify 75-125 word band; expand with verifiable Boca facts).
   - Market identity: explain Boca's three identity layers (coastal condos east of A1A; country-club neighborhoods; beach-oriented Mediterranean Revival residential).
   - Decision framework: 7 cards — water-access-or-not (since Boca has both waterfront and inland country-club markets), ARCOM/HOA-equivalents, architectural era, beach-block access, country-club membership considerations, walkability to Royal Palm Yacht & Country Club / Mizner Park / Royal Palm Place, **and** the 7th card: insurance underwriting / 4-point — emphasized as the most-asked-question card.
   - Peer pointers: register per-peer "Comes up when…" lines for Boca's internalLinks (Delray Beach, Palm Beach, Fort Lauderdale, plus any additional).
   - Neighborhood comparison: use market.comparisonContext + internal links to Delray Beach, Palm Beach, Fort Lauderdale.
   - Buyer playbook: 5 steps + anti-pattern aside ("What this is not: the brief is not a country-club tour; it is a residence-first priority hierarchy").
   - Seller playbook: 5 steps + anti-pattern aside (with cross-link to /insights/why-automated-valuations-miss-luxury-waterfront/).
   - Related Insights: data-driven.
   - FAQ: existing 5 + 4 V2-specific (Boca-vs-Delray, Boca country-club access, private brief vs saved-search alert, why country-club membership matters even when not buying-into-membership).
   - 4-CTA strip: Boca-specific intent params.

2. Wire into src/app/markets/[slug]/page.tsx via the same slug-guard pattern Fort Lauderdale uses (line 96-104 of [slug]/page.tsx).

3. Update audit:featured-markets to enforce a BocaRatonV2 marker (e.g., presence of "ARCOM" or "Mizner Park" in built Boca page HTML).

4. Add audit:boca-raton-v2 mirroring audit:fort-lauderdale-v3 — verify the V3-style markers on Boca's page.

5. Capture before/after screenshots at 320, 375, 768, 1280, 1440 viewports.

6. Country-club name verification (Cycle 15 Cato residual carried forward — Post 8 lists Royal Palm Yacht & Country Club, Boca Bath & Tennis Club, St. Andrews Country Club, Woodfield Country Club). Confirm correct spelling and current existence before adding to Boca V2 prose.

Mission boundaries (DO NOT):
- Build any other market V2 in this cycle.
- Reopen Cycle 17 work.
- Touch GHL wiring, TCPA, DNS, .com production, Payload, CMS migration.
- Fabricate stats, rankings, MLS claims, private-inventory promises.
- Change the FortLauderdaleV2.tsx component (it remains the rollout template — only Boca's new file ships).

READ FIRST:
1. ISA.md
2. docs/CYCLE_17_FORT_LAUDERDALE_V3_IMPLEMENTATION.md (the new canonical rollout reference)
3. docs/CYCLE_17_FORT_LAUDERDALE_ICP_REVIEW.md (the audit framework for V3 standard)
4. docs/CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md (the original rollout doc; still canonical)
5. src/components/markets/FortLauderdaleV2.tsx (the V3 template — clone its structure)
6. src/lib/markets.ts (Boca data entry — verify aeoAnswer, buyerGuidance, sellerGuidance, comparisonContext, faqs, internalLinks are all populated)
7. src/app/markets/[slug]/page.tsx (slug-guard pattern at line 96-104)

Estimate: ~3-4 hours total (one focused engineering cycle). Pure operator work; no principal decisions needed.
```

---

## Option C — GHL form wiring (Cycle 18+ engineering cycle — requires prereqs)

Same trigger as Cycle 15's Option C, carried forward. Requires:
1. Principal-provided GHL workflow webhook URL.
2. Principal-provided + legal-approved TCPA consent copy.
3. Principal-confirmed pipeline stage names + tag taxonomy in GHL.
4. Principal-confirmed notification routing.
5. Privacy policy update reviewed by legal counsel.

If any prereq missing, STOP and route back to Option A.

Full paste-ready trigger preserved at `docs/NEXT_SESSION_TRIGGER_AFTER_CYCLE_15.md` (Option C).

---

## Cycle 17 residuals worth flagging

1. **Forge minor concerns (5 of 6 are doc-vs-code reconciliation or pre-existing drift; 1 fixed in-cycle)** — documented in `docs/CYCLE_17_GPT55_PREDEPLOY_REVIEW.md` §"Minor concerns surfaced". Most impactful: **About meta-tag service-area drift** (SITE.tagline / MIA.tagline drops "Eastern" qualifier on Boca/Delray) — Cycle 18 audit:about extension is the clean fix.

2. **Cato re-run** — Cycle 17 Cato session completed mid-investigation without structured JSON verdict. Operator-assessed compliance covers the gap; a fresh Cato session with reduced read surface + `codex exec --output-schema` enforcement (per Algorithm v6.4.0 R9 erratum) would close the audit loop formally.

3. **Decision Register Cards 2 & 3 vs implementation drift** — Decision text binds "remove filter chain for the new assets"; implementation preserves the uniform chain (pixel output identical). Future polish: either edit the Decision Register or split the filter chain. End-state is correct.

4. **Decision Register Card 4 vs implementation drift** — Decision text binds "wire into audit:all after audit:featured-markets"; implementation keeps both new audits standalone (per principal stability direction). Future polish: reconcile the Decision Register text.

5. **Carry-forward WARNs unchanged** — `audit:completeness.forms.classification` (2 mailto, expected per lead-capture architecture); `audit:rendered.probe.viewportSanity` (chrome --dump-dom mobile-clamp limitation). Both flip to PASS upon Option C wiring (forms) and a future tooling cycle (rendered probe).

## Recommendation

**Option A.** Cycle 17 closed the visual+content gap that Cycle 16 left open. The bottleneck is now back to principal-side decisions. 60-90 minutes of focused walkthrough moves 4 hard gates + surfaces 4 REVIEW items. Option B (Boca V2) is worth doing but does NOT unblock launch. Option C (GHL) remains prerequisite-gated.
