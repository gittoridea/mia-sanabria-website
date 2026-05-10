# Next Session Trigger — After Cycle 14 (Market System Integrity + Featured Market Page Excellence)

**Cycle 14 close state:** PASS · 9 reverse-link edges added · 6 hardcoded slug arrays collapsed to 0 · Ultimate Featured Market Page Standard locked · 8/8 featured got `comparisonContext` · audit chain green at parity with Cycle 13 close + expected delta · 9 external blockers from Cycle 12 still untouched (none re-opened by this cycle).

The next session has THREE realistic shapes. Option A remains the highest-leverage move (principal-decision unblocking from Cycle 12 — still 9 external gates). Option B is the Phase-8 deferred themes from Cycle 14's gap matrix. Option C is the GHL form wiring engineering cycle.

---

## Option A — Principal-decision-gathering session (RECOMMENDED — highest leverage, unchanged from Cycle 12-13 trigger)

If the principal has bandwidth for ~60-90 minutes of decisions, this remains the highest-leverage next move. It unblocks 4 of the 9 external gates without operator engineering time.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Principal Decision Pass on Production-Readiness Scorecard External Blockers (Post-Cycle-14)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Walk principal through the 9 external blockers from Cycle 12's production-readiness scorecard (still open as of Cycle 14 close) and capture decisions on the 4 that are principal-decision-only (not GHL or legal-counsel). The 4 axes are:

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
- Modify REALTOR® mark usage (Cards 4 + 5; legal review pending — see Cycle 14 OFFICIAL_GRAPHICS_REVIEW for source URLs).
- Reopen Cycle 14 design work (Ultimate Standard locked; Bay Colony / Bermuda Riviera / comparisonContext / DRY refactor — verified PASS).

READ FIRST:
1. ISA.md
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_14_MARKET_SYSTEM_AND_FEATURED_PAGE_EXCELLENCE_2026-05-10.md
3. docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md (24 axes)
4. docs/CYCLE_13_PRODUCTION_READINESS_SCORECARD_UPDATE.md (Cycle 13 deltas)
5. docs/PRINCIPAL_DECISION_REGISTER.md (Cards 1, 2, 3, 4, 5, 6)
6. docs/CYCLE_14_OFFICIAL_GRAPHICS_REVIEW.md (NAR/HUD source URLs for Card 5 if principal authorizes asset swap)
7. src/lib/mia.ts (licenseNumber + email config)
8. src/app/layout.tsx (analytics tag insertion point)
```

---

## Option B — Cycle 15 · Featured Market Page Phase-8 Deferred Themes (NEW Cycle 14 RESIDUAL)

Cycle 14 shipped Theme 1 (`comparisonContext` for all 8 featured) but explicitly deferred Themes 2-5 from the gap matrix. This is the highest-leverage continuation of Cycle 14's content-quality work.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Cycle 15 · Featured Market Page Phase-8 Deferred Themes

Start in:

~/code/mia-sanabria-website/

Primary objective:
Close the gap matrix PARTIALs that Cycle 14 deferred:

Theme 2 — Buyer/seller specificity sharpening for fort-lauderdale, victoria-park, boca-raton (~30 min content edits per market). Sharpen Market.buyerGuidance and Market.sellerGuidance to call out concrete due-diligence items (seawall, dock capacity, bridge clearance, hurricane prep, milestone-inspection, HOA reserves) for the buyer side and concrete positioning items (architectural era, dockage specifics, lot orientation, association reputation) for the seller side.

Theme 3 — Engagement editorial pass for fort-lauderdale, boca-raton, victoria-park, bay-colony, bermuda-riviera (~60 min). Tighten Market.intro, Market.lifestyle, and Market.aeoAnswer prose toward the deepwater-isles standard. Reference docs/ULTIMATE_FEATURED_MARKET_PAGE_STANDARD.md for editorial-voice guardrails.

Theme 4 — Victoria Park ICP framing (~10 min). Add 1-2 sentences in Market.intro or Market.lifestyle explicitly framing Victoria Park as the in-town-walkable alternative for buyers who don't prioritize waterfront.

Theme 5 — Boca Raton layered specifics (~30-60 min, requires research). Call out the three identity layers (coastal condominiums east of A1A, single-family neighborhoods around the country-club corridor, beach-oriented Mediterranean Revival residences) with concrete details per layer (Royal Palm YCC tier, Boca Bath & Tennis tier) without overclaiming.

After all 4 themes ship, re-audit against ULTIMATE_FEATURED_MARKET_PAGE_STANDARD.md and target 0 PARTIALs across the gap matrix.

Mission boundaries (DO NOT):
- Touch GHL wiring, TCPA mechanics, license, REALTOR® marks (preserve Cards 4-5 status).
- Add new markets.
- Reopen Cycle 13 / Cycle 14 design work.
- Introduce new colors, fonts, glassmorphism.

READ FIRST:
1. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_14_MARKET_SYSTEM_AND_FEATURED_PAGE_EXCELLENCE_2026-05-10.md
2. docs/ULTIMATE_FEATURED_MARKET_PAGE_STANDARD.md
3. docs/CYCLE_14_FEATURED_MARKET_PAGE_GAP_MATRIX.md (Theme 2-5 prioritization detail)
4. docs/CYCLE_14_FEATURED_MARKET_PAGE_UPGRADE_REPORT.md (what shipped, what didn't)
5. src/lib/markets.ts (Market type + 15 entries + comparisonContext)
6. src/app/markets/[slug]/page.tsx (8-section template)

Estimate: ~3-4 hours total. Pure content + editorial polish.
```

---

## Option C — GHL form wiring engineering cycle (unchanged from Cycle 13 trigger)

If the principal has authorized the GHL workflow webhook URL + TCPA approach, this is the engineering cycle to wire the forms.

See `docs/NEXT_SESSION_TRIGGER_AFTER_CYCLE_13.md` Option C for the full paste-ready trigger.

---

## Cycle 14 residuals worth flagging

1. **Phase 4 Cards 4 + 5 still PRINCIPAL_DECISION_PENDING** — Cycle 14 documented official NAR/HUD source URLs but did not ship an asset swap. Awaiting principal authorization on (a) descriptive REALTOR® usage rewrite, (b) combined REALTOR®+MLS graphic separation.

2. **Bay Colony + Bermuda Riviera prose battle-test** — Cycle 14 added bidirectional reverse-link wiring + comparisonContext but the prose itself hasn't been battle-tested across multiple cycles. Revisit after Cycle 14 deploys live and reader-flow patterns reveal defects (if any). Theme 6 in the gap matrix.

3. **F6 chrome `--dump-dom` viewport clamp** — The audit:rendered probe runs at chrome's default ~500px viewport for mobile (pre-existing limitation). Screenshot channel + GPT-5.5 visual review covers the gap. Not a Cycle 14 regression. Could be addressed in a future tooling cycle if the limitation becomes a real defect.

4. **Hero `[word-break:break-word]` edge cases** — Cycle 14 tightened the word-break rules; current copy has no truly long unbreakable tokens (long URLs, Spanish brand names). If a future cycle introduces such copy, may need to revisit at the smallest viewport.

5. **6-card related-markets grid at 320/375** — Cycle 14 raised the `internalLinks` cap to 6 on `fort-lauderdale` and `las-olas-isles`. The `lg:grid-cols-3` grid resolves cleanly to 3×2 on desktop, 2×3 on tablet, 6×1 on mobile. Audit:rendered confirms 0 hero clipping. Visual review at Phase 13 Cato pass for confirmation.

## Recommendation

**Option A.** The site is production-ready as a design surface; the bottleneck is principal-side decisions that 90 minutes of focused walkthrough can move. Cycle 14 added depth (graph + DRY + standard + comparison-section content) without moving the launch-blocker count. Option B and Option C are good follow-on work but neither moves the .com cutover date.
