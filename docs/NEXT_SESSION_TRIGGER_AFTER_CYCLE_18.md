# Next Session Trigger — After Cycle 18

**Cycle 18 close state (pending deploy verification):** PASS · Fort Lauderdale page V3 → V4 deep lift in-place (research-backed opening with source ledger + 9-card waterfront framework + Buyer's comparison cohort 3-tier editorial + 6-step buyer playbook + 7-step seller playbook + 11 FAQs; component name preserved for route stability) · Visible "Updated <Month YYYY>" label removed from blog UI (schema dateModified preserved) · Hillsboro Mile moved to new `cluster: "northern-broward-waterfront"` rendering in renamed "Fort Lauderdale waterfront and Northern Broward clusters" section (NOT claimed as Fort Lauderdale) · Pompano Beach added as full primary market with hero image + OG + schema + sitemap + internal links + 5 FAQs · 2 audit-script extensions (`audit:fort-lauderdale-standard` + `audit:insights.checkBuiltHtmlNoVisibleUpdatedLabel`) · Forge separate-context VERIFY (verdict in cycle 18 handoff doc) · Cato PARTIAL (same Cycle 17 failure mode) · staging deploy verified · 0 Cycle-18-introduced production-readiness blockers.

The next session has three realistic shapes. **Option A remains the highest-leverage move** (principal-decision unblocking — 9 hard + REVIEW external gates). Option B is Boca Raton V2 using the now-canonical FL V4 pattern. Option C is the Cato re-engineering + audit:about extension cleanup.

---

## Option A — Principal-decision session (RECOMMENDED — highest leverage)

If the principal has bandwidth for ~60-90 minutes of decisions, this is the highest-leverage next move. It unblocks 9 of the 18 open items (B1-B9) without operator engineering time.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Principal Decision Pass on Production-Readiness Blockers (Post-Cycle-18)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Walk principal through the 4 hard external blockers (B1-B4) from CYCLE_18_PRODUCTION_READINESS_REMAINING_LIST.md and surface decisions on the 5 REVIEW items (B5-B9). The 4 hard axes:

1. License rendering (B1) — confirm DBPR-verified license # in writing OR authorize "stay current" with unverified flag.
2. Analytics provider (B2) — pick GA4 vs Plausible vs Umami; provide measurement ID. ~15 min decision + ~30 min implementation.
3. Branded email (B3) — pick provider; provide MX + initial inbox provisioning.
4. .com cutover sign-off (B4) — DNS swap from current Direct Axess host to staging URL; 301 redirect plan.

The 5 REVIEW items (B5-B9):
B5. Service-area expansion — confirm Palm Beach proper + non-Eastern variants OR retain canonical.
B6. Userway widget activation — load script or null the ID.
B7. Quarterly client-list cap — re-add if confirmed in writing.
B8. Global listing distribution affiliate — re-add with named partner if applicable.
B9. About meta-tag service-area drift — SITE.tagline / MIA.tagline / Hero defaults canonicalization decision (Cycle 17 Forge VERIFY surfacing, carried into Cycle 18 review).

After capturing decisions, ship the 1-3 quick wins:
- Update src/lib/mia.ts licenseNumber per principal decision.
- Insert analytics tag into src/app/layout.tsx per principal choice.
- Document branded-email + DNS cutover as scheduled engineering work.
- If B5 confirmed: update MIA.contact.serviceAreas + PUBLIC_FACT_LEDGER §1 + audit:about canonical match.
- If B9 confirmed: extend audit:about to enforce a single canonical service-area string across SITE/MIA/Hero defaults.

Mission boundaries (DO NOT):
- Touch GHL wiring or TCPA mechanics (separate cycle, blocked by legal-counsel).
- Implement DNS cutover without explicit principal sign-off + scheduled date.
- Modify REALTOR® mark usage beyond Cycle 17 NAR canonical asset.
- Reopen Cycle 18 design work (FtLaud V4 locked; Hillsboro Mile cluster locked; Pompano Beach addition locked; blog Updated removal locked).

READ FIRST:
1. ISA.md
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_18_FORT_LAUDERDALE_RESEARCH_POMPANO_MARKET_2026-05-10.md
3. docs/CYCLE_18_PRODUCTION_READINESS_REMAINING_LIST.md
4. docs/PRINCIPAL_DECISION_REGISTER.md
5. docs/CYCLE_17_ABOUT_ACCURACY_RECHECK.md (5 REVIEW items)
6. docs/CYCLE_17_GPT55_PREDEPLOY_REVIEW.md (about meta-tag drift origin)
7. src/lib/mia.ts (licenseNumber + email + serviceAreas)
8. src/lib/site.ts (tagline)
9. src/app/layout.tsx (analytics tag insertion point)
```

---

## Option B — Boca Raton V2 using the FL V4 pattern (Cycle 19 engineering)

The Cycle 18 FL V4 pattern supersedes the Cycle 17 V3 pattern as the canonical gold standard. Boca Raton is the next-natural market to V2 (Palm Beach County primary cohort; ranks #2 in HOMEPAGE_FEATURED_ORDER).

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Cycle 19 · Boca Raton V2 Market Page (single-market rollout using the FL V4 gold-standard pattern)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Apply the Cycle 18 FL V4 content pattern to Boca Raton. Build src/components/markets/BocaRatonV2.tsx using FortLauderdaleV2.tsx as the canonical template — preserve ALL V4 sections.

Items to ship:

1. Boca-specific research source ledger BEFORE content edits. Required sources:
   - City of Boca Raton (https://www.myboca.us)
   - Visit Boca Raton (visitor / tourism)
   - Boca Raton Resort & Club, Royal Palm Yacht & Country Club official pages
   - Palm Beach County GIS / Census QuickFacts
   - Florida DEP Coral ECA (Palm Beach County extension)
   - Boca Raton Airport Authority (if any aviation reference)
   - Cycle 14-15 country-club name verification (Cato residual carried forward — Royal Palm YCC, Boca Bath & Tennis, St. Andrews CC, Woodfield CC).
   Save to: docs/CYCLE_19_BOCA_RATON_RESEARCH_LEDGER.md

2. Create src/components/markets/BocaRatonV2.tsx based on FortLauderdaleV2.tsx. Per-section guidance:
   - Hero: Boca-specific precision frame (not "yacht access, downtown, canal" — Boca's vector is "country-club residential, A1A oceanfront, Mizner-pedigree downtown").
   - Prelude: "Boca Raton rewards a written brief" — anchor in the Palm Beach County / pedigree / country-club lens.
   - Research-backed opening: pull from ledger Part C (Boca area, population, country clubs, Mizner Park, A1A oceanfront, Boca Raton Resort & Club, El Rio Trail). Hedge correctly per ledger.
   - Executive AEO: pull from market.aeoAnswer; verify 75-125 word band.
   - Market identity: explain Boca's three identity layers (coastal east of A1A; country-club neighborhoods west; Mizner Park/Royal Palm Place downtown).
   - Waterfront framework: 9 cards. Boca's emphasis differs from FtLaud — country-club membership considerations + ARCOM / HOA-equivalents + architectural era + oceanfront-vs-inland trade-off + insurance underwriting as the emphasized 9th card.
   - Buyer's comparison cohort 3-tier (V4 NEW):
     • Tier 1 — Boca Raton sub-markets (East Boca / Royal Palm Yacht & CC / Boca Bath & Tennis / Mizner Park / etc.)
     • Tier 2 — Palm Beach County alternatives (Palm Beach, Delray Beach, Highland Beach)
     • Tier 3 — Broward County alternatives (Fort Lauderdale, Pompano Beach, Lighthouse Point)
   - Peer pointers: register per-peer "Comes up when…" lines for Boca's internalLinks.
   - Neighborhood comparison cards.
   - Buyer playbook: 6 steps + anti-pattern aside.
   - Seller playbook: 7 steps + anti-pattern aside (with cross-link to /insights/why-automated-valuations-miss-luxury-waterfront/).
   - Related Insights: data-driven.
   - FAQ: 5 + 6 V2-specific (Boca-vs-Delray, Boca-vs-Palm Beach, country-club access, ARCOM, private brief vs saved-search alert, why country-club membership matters even when not buying-into-membership).
   - 4-CTA strip: Boca-specific intent params.

3. Wire into src/app/markets/[slug]/page.tsx via the same slug-guard pattern Fort Lauderdale uses.

4. Update audit:featured-markets to enforce a BocaRatonV2 marker.

5. Add audit:boca-raton-standard mirroring audit:fort-lauderdale-standard — V3-style markers (preserve baseline) + V4-style markers + 2 anti-checks for Boca-specific overclaim risks.

6. Capture before/after screenshots at 320, 375, 768, 1280, 1440 viewports.

7. Country-club name verification (Cycle 15 Cato residual). Confirm correct spelling and current existence before adding to Boca V2 prose.

Mission boundaries (DO NOT):
- Build any other market V2 in this cycle.
- Reopen Cycle 18 work (FL V4 locked).
- Touch GHL wiring, TCPA, DNS, .com production, Payload, CMS migration.
- Fabricate stats, rankings, MLS claims, private-inventory promises.
- Change the FortLauderdaleV2.tsx component (it remains the V4 reference template).

READ FIRST:
1. ISA.md
2. docs/CYCLE_18_FORT_LAUDERDALE_V4_IMPLEMENTATION.md (the new canonical rollout reference)
3. docs/CYCLE_18_FORT_LAUDERDALE_PAGE_DEFINITION.md (V4 audit framework)
4. docs/CYCLE_18_FORT_LAUDERDALE_POMPANO_RESEARCH_LEDGER.md (ledger format)
5. docs/CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md (rollout doc)
6. src/components/markets/FortLauderdaleV2.tsx (V4 template — clone its structure)
7. src/lib/markets.ts (Boca data — verify aeoAnswer, buyerGuidance, sellerGuidance, comparisonContext, faqs, internalLinks populated)
8. src/app/markets/[slug]/page.tsx (slug-guard pattern)

Estimate: ~4-6 hours total (one focused engineering cycle with research-first discipline). Pure operator work; no principal decisions needed.
```

---

## Option C — Cato re-engineering + Cycle 18 residuals cleanup

If the bandwidth is limited and Options A + B are gated:

```text
MISSION: Mia Sanabria Website — Cycle 19 · Cato Re-Engineering + Audit Cleanup

Start in:

~/code/mia-sanabria-website/

Primary objective:
Close 3 small-but-durable residuals from Cycle 17 + 18:

1. Cato dispatch re-engineering. Per Algorithm v6.4.0 R9 erratum, wire `codex exec --output-schema ~/.claude/agents/Cato.verdict-schema.json` for hard-enforced structured-verdict tail. Tighten the Cato prompt to ≤800 words, ≤5 explicit file reads, explicit "emit verdict in FIRST 5 minutes" instruction. Test against Cycle 18 work; expect a structured verdict.

2. audit:about extension to canonicalize service-area string (B9 from Cycle 17 Forge VERIFY surfacing). SITE.tagline / MIA.tagline / Hero default render "Eastern Fort Lauderdale, Boca Raton, and Delray Beach" (drops "Eastern" qualifier on Boca/Delray on meta + og + twitter). Body + schema use "Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach" — canonical. Extend audit:about to enforce a single canonical string across all 4 surfaces.

3. Image-pipeline canonical doc. Add a section to docs/CYCLE_16_FEATURED_MARKET_ROLLOUT_PROCESS.md documenting the canonical `bun ~/.claude/skills/Art/Tools/Generate.ts --model nano-banana-pro --size 2K --aspect-ratio 4:5` invocation for new market heroes, including the `LD_LIBRARY_PATH=...node_modules/@img/sharp-libvips-linux-x64/lib` requirement for sharp resize.

Mission boundaries (DO NOT):
- Reopen Cycle 18 design or content work.
- Touch GHL / TCPA / DNS / .com / Payload / CMS.
- Modify any market data, route, or component.

READ FIRST:
1. ISA.md
2. ~/.claude/projects/-home-torrey/memory/feedback_cato_structured_verdict_prompt.md
3. ~/.claude/PAI/ALGORITHM/v6.4.0.md (R9 erratum on Cato output-schema)
4. docs/CYCLE_18_CATO_OR_COMPLIANCE_CROSSCHECK.md
5. docs/CYCLE_17_GPT55_PREDEPLOY_REVIEW.md (B9 origin)
6. scripts/audit-about.ts
7. src/lib/site.ts, src/lib/mia.ts (canonical service-area strings)

Estimate: ~2-3 hours. Pure plumbing work; no principal decisions.
```

---

## Cycle 18 residuals worth flagging

1. **Cato re-engineering** — Cycle 17 + 18 both saw Cato terminate mid-investigation before emitting a structured verdict. Documented in `docs/CYCLE_18_CATO_OR_COMPLIANCE_CROSSCHECK.md`. Option C above is the dedicated fix.

2. **About meta-tag service-area drift** — Cycle 17 Forge surfacing carried into Cycle 18 as B9 in the production-readiness remaining list. Requires principal direction on canonical service-area string before audit-extension can enforce it.

3. **Insights cohort expansion** — current 12-post library does NOT reference Pompano Beach. Cross-references arrive in Cycle 19+ post-cohort expansion. The relevant insights post would be a "Pompano Beach versus Fort Lauderdale" comparison or a "Pompano Beach reef + wreck dive lifestyle" piece — operator decision needed.

4. **Image-pipeline documentation** — `bun Generate.ts --model nano-banana-pro` is the canonical invocation; `LD_LIBRARY_PATH` is the libvips-runtime gotcha. Documented in Cycle 18 process upgrade; not yet in the rollout-process doc itself.

5. **Featured-markets cohort** — Cycle 18 added Pompano Beach to `MARKETS` (16 total) but did NOT add it to `FEATURED_MARKETS` cohort or `HOMEPAGE_FEATURED_ORDER`. Operator decision needed on whether Pompano joins the featured cohort.

## Recommendation

**Option A.** Cycle 18 closed the four mission site/content defects (blog Updated label, FtLaud V3 ICP gap, Hillsboro Mile geography, missing Pompano Beach). The bottleneck is back to principal-side decisions. 60-90 minutes of focused walkthrough moves 9 gates. Option B (Boca V2) is worth doing but does NOT unblock launch. Option C (Cato + audit cleanup) is small-but-durable.
