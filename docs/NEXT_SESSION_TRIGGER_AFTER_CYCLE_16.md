# Next Session Trigger — After Cycle 16

**Cycle 16 close state:** PASS · Featured Markets 6-at-a-time pager · Blog date governance · 12 per-post OG images · Fort Lauderdale V2 gold standard · Footer REALTOR®/EHO logo fix · About credentials/service-area accuracy audit · 3 new audits (`audit:featured-markets`, `audit:legal`, `audit:about`) · 0 FAIL across audit chain · live-verified on staging.

The next session has three realistic shapes. **Option A remains the highest-leverage move** (principal-decision unblocking — still 6 external gates). Option B is Boca Raton V2 (one-market-per-cycle rollout). Option C is the GHL form wiring engineering cycle (Cycle 17 prereqs must be in hand).

---

## Option A — Principal-decision-gathering session (RECOMMENDED — highest leverage)

If the principal has bandwidth for ~60-90 minutes of decisions, this remains the highest-leverage next move. It unblocks 4 of 8 external gates without operator engineering time.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Principal Decision Pass on Production-Readiness Scorecard External Blockers (Post-Cycle-16)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Walk principal through the 8 external blockers from Cycle 12's production-readiness scorecard (still open as of Cycle 16 close) and capture decisions on the 4 that are principal-decision-only (not GHL or legal-counsel). The 4 axes are:

1. License rendering (PRINCIPAL_DECISION_REGISTER Card 1) — confirm DBPR-verified license # in writing OR authorize "stay current" with unverified flag.
2. Analytics provider — pick GA4 vs Plausible vs Umami; provide measurement ID. ~15 min to ship.
3. Branded email — pick provider (Google Workspace / Zoho / Fastmail); provide MX record + initial inbox provisioning.
4. .com cutover sign-off — DNS swap from current Direct Axess host to staging URL; 301 redirect plan.

After capturing decisions, ship the 1-2 quick wins:
- Update src/lib/mia.ts licenseNumber per principal decision.
- Insert analytics tag into src/app/layout.tsx per principal choice.
- Document branded-email + DNS cutover as scheduled engineering work.

Mission boundaries (DO NOT):
- Touch GHL wiring or TCPA mechanics (separate cycle, blocked by legal-counsel).
- Implement DNS cutover without explicit principal sign-off + scheduled date.
- Modify REALTOR® mark usage beyond Cycle 16 rendition (Cards 4 + 5; legal review pending).
- Reopen Cycle 16 design work (Featured Markets pager locked; Insights date governance locked; FL V2 locked; footer fix locked; About audit locked).
- Reopen Cycle 14 or 15 design work.

READ FIRST:
1. ISA.md
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_16_FEATURED_MARKETS_BLOG_DATES_FORT_LAUDERDALE_V2_2026-05-10.md
3. docs/CYCLE_16_PRODUCTION_READINESS_SCORECARD_UPDATE.md
4. docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md (24 axes)
5. docs/PRINCIPAL_DECISION_REGISTER.md
6. docs/CYCLE_14_OFFICIAL_GRAPHICS_REVIEW.md (NAR/HUD source URLs)
7. docs/CYCLE_16_FOOTER_TRUST_LOGO_FIX.md (REVIEW items for principal-legal)
8. docs/CYCLE_16_LEGAL_PAGE_ACCURACY_AUDIT.md (REVIEW gates for cutover)
9. src/lib/mia.ts (licenseNumber + email config)
10. src/app/layout.tsx (analytics tag insertion point)
```

---

## Option B — Boca Raton V2 (single-market V2 rollout)

The Cycle 16 FL V2 pattern is documented in `docs/CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md`. Boca Raton is the next-natural market to V2 (Palm Beach County primary cohort; ranks #2 in the principal-locked HOMEPAGE_FEATURED_ORDER).

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Cycle 17 · Boca Raton V2 Market Page (single-market gold-standard rollout)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Apply the Fort Lauderdale V2 gold-standard pattern to Boca Raton. Build src/components/markets/BocaRatonV2.tsx with the same 10-section structure documented in CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md.

Items to ship:

1. Create src/components/markets/BocaRatonV2.tsx based on FortLauderdaleV2.tsx. Per-section guidance:
   - Hero: Boca-specific tagline + image.
   - Executive AEO: pull from market.aeoAnswer (verify 75-125 word band; expand if needed with verifiable Boca facts).
   - Market identity: explain Boca's three identity layers (coastal condos east of A1A; country-club neighborhoods; beach-oriented Mediterranean Revival).
   - Decision framework: 6 cards — water-access-or-not (since Boca has both waterfront and inland country-club markets), ARCOM/HOA-equivalents, architectural era, beach-block access, country-club membership considerations, walkability to Royal Palm Yacht & Country Club / Mizner Park / Royal Palm Place.
   - Neighborhood comparison: use market.comparisonContext + internal links to Delray Beach, Palm Beach, Fort Lauderdale.
   - Buyer playbook: 5 steps (brief, archetype shortlist, club-membership-question, diligence sequencing, private inventory disclaimer).
   - Seller playbook: 5 steps (valuation by cohort, document club memberships if transferable, position to archetype, editorial photography, discreet pre-market).
   - Related Insights: data-driven.
   - FAQ: existing 5 + 2 V2-specific (Boca-vs-Delray difference + Boca country-club access question).
   - 4-CTA strip: Boca-specific intent params.

2. Wire into src/app/markets/[slug]/page.tsx via the same slug-guard pattern Fort Lauderdale uses.

3. Update audit:featured-markets to enforce a BocaRatonV2 marker (e.g., presence of "ARCOM" or "Mizner Park" in built Boca page HTML).

4. Capture before/after screenshots at 320, 375, 768, 1280, 1440 viewports.

5. Country-club name verification (Cycle 15 Cato residual carried forward — Post 8 lists Royal Palm Yacht & Country Club, Boca Bath & Tennis Club, St. Andrews Country Club, Woodfield Country Club). Confirm correct spelling and current existence before adding to Boca V2 prose.

Mission boundaries (DO NOT):
- Build any other market V2 in this cycle.
- Reopen Cycle 16 work.
- Touch GHL wiring, TCPA, DNS, .com production, Payload, CMS migration.
- Fabricate stats, rankings, MLS claims, private-inventory promises.

READ FIRST:
1. ISA.md
2. docs/CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md (the canonical rollout doc)
3. docs/CYCLE_16_FORT_LAUDERDALE_MARKET_PAGE_V2_BLUEPRINT.md (FL V2 reference)
4. src/components/markets/FortLauderdaleV2.tsx (the template)
5. src/lib/markets.ts (Boca data entry — verify aeoAnswer, buyerGuidance, sellerGuidance, comparisonContext, faqs, internalLinks are all populated; if comparisonContext thin, expand FIRST)
6. src/app/markets/[slug]/page.tsx (slug-guard pattern)

Estimate: ~3-4 hours total (one focused engineering cycle). Pure operator work; no principal decisions needed.
```

---

## Option C — GHL form wiring (Cycle 17 engineering cycle — requires prereqs)

Same trigger as Cycle 15's Option C, carried forward. Requires:
1. Principal-provided GHL workflow webhook URL.
2. Principal-provided + legal-approved TCPA consent copy.
3. Principal-confirmed pipeline stage names + tag taxonomy in GHL.
4. Principal-confirmed notification routing.
5. Privacy policy update reviewed by legal counsel.

If any prereq missing, STOP and route back to Option A.

Full paste-ready trigger preserved at `docs/NEXT_SESSION_TRIGGER_AFTER_CYCLE_15.md` (Option C).

---

## Cycle 16 residuals worth flagging

1. **Forge nice-to-haves (5 of 8 deferred)** — documented in `docs/CYCLE_16_GPT55_PREDEPLOY_REVIEW.md` §"Nice-to-have follow-ups deferred to next cycle". Most impactful: hero-contrast audit hardening, audit:date-governance, audit:overclaim promotion, V2-page rendered-visual probe, footer trust-mark contrast probe.

2. **Cato re-run** — Cycle 16 Cato session completed mid-investigation without structured JSON verdict. Operator-assessed compliance covers the gap; a fresh Cato session with tighter time budget would close the audit loop formally.

3. **Country-club name verification (Post 8)** — Royal Palm YCC, Boca Bath & Tennis Club, St. Andrews CC, Woodfield CC. Manual confirmation worth doing in any cycle that touches Boca content (Option B above).

4. **Carry-forward WARNs unchanged** — `audit:completeness.forms.classification` (2 mailto, expected per lead-capture architecture); `audit:rendered.probe.viewportSanity` (chrome --dump-dom mobile-clamp limitation). Both flip to PASS upon Option C wiring (forms) and a future tooling cycle (rendered probe).

## Recommendation

**Option A.** Cycle 16 closed the visual+content gap. The bottleneck is now back to principal-side decisions. 60-90 minutes of focused walkthrough moves 4 of 8 external gates. Option B (Boca V2) is worth doing but does NOT unblock launch. Option C (GHL) is prerequisite-gated.
