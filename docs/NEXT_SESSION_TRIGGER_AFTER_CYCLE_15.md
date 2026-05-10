# Next Session Trigger — After Cycle 15 (Insights Library + Lead-Capture Architecture + Sitewide Content Weaving)

**Cycle 15 close state:** PASS · 12-post evergreen Insights library shipped · 7 reusable lead-capture CTA components · 4 thank-you routes (noindex) · sitewide weaving across 7 page surfaces (+867 internal links) · audit:insights 535/0/0 · Cato concerns→all 6 actionable resolved · GPT-5.5/Forge PASS_WITH_MINOR_CONCERNS · live deploy verified (Caddy ETag flipped, 26/26 routes 200) · 9 external blockers from Cycle 12 still untouched (none re-opened by this cycle).

The next session has THREE realistic shapes. **Option A remains the highest-leverage move** (principal-decision unblocking — still 9 external gates). Option B is the Cycle 15 nice-to-haves cleanup (per-post OG images + Forge follow-ups). Option C is the GHL form wiring engineering cycle (only if GHL webhook URL + TCPA-approved copy provided).

---

## Option A — Principal-decision-gathering session (RECOMMENDED — highest leverage, unchanged from Cycle 12-14 trigger)

If the principal has bandwidth for ~60-90 minutes of decisions, this remains the highest-leverage next move. It unblocks 4 of the 9 external gates without operator engineering time.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Principal Decision Pass on Production-Readiness Scorecard External Blockers (Post-Cycle-15)

Start in:

~/code/mia-sanabria-website/

Primary objective:
Walk principal through the 9 external blockers from Cycle 12's production-readiness scorecard (still open as of Cycle 15 close) and capture decisions on the 4 that are principal-decision-only (not GHL or legal-counsel). The 4 axes are:

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
- Reopen Cycle 15 design work (Insights library locked; 12-post editorial map + content standard + audit:insights — verified PASS).
- Reopen Cycle 14 design work (Ultimate Standard locked; Bay Colony / Bermuda Riviera / comparisonContext / DRY refactor — verified PASS).

READ FIRST:
1. ISA.md
2. docs/PRODUCTION_READINESS_HANDOFF_CYCLE_15_INSIGHTS_AND_LEAD_CAPTURE_2026-05-10.md
3. docs/CYCLE_15_PRODUCTION_READINESS_SCORECARD_UPDATE.md
4. docs/CYCLE_12_PRODUCTION_READINESS_SCORECARD.md (24 axes)
5. docs/PRINCIPAL_DECISION_REGISTER.md (Cards 1, 2, 3, 4, 5, 6)
6. docs/CYCLE_14_OFFICIAL_GRAPHICS_REVIEW.md (NAR/HUD source URLs)
7. src/lib/mia.ts (licenseNumber + email config)
8. src/app/layout.tsx (analytics tag insertion point)
```

---

## Option B — Cycle 16 · Insights polish + per-post OG images + Forge follow-ups (small operator-only cycle)

The 8 nice-to-have follow-ups Forge VERIFY identified in Cycle 15 are real but small. A focused 90-minute cycle can land all 8 plus generate 12 per-post OG images.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Cycle 16 · Insights Library Polish + Per-Post OG Images + Forge VERIFY Follow-Ups

Start in:

~/code/mia-sanabria-website/

Primary objective:
Land the 8 nice-to-have follow-ups from Cycle 15's Forge separate-context VERIFY pass and generate 12 per-post OG images.

Items to ship:

1. Generate per-post OG images for the 12 insights via the existing art pipeline (/tmp/mia-genimg/run.ts pattern + sharp). Output to public/og-insights/{slug}.jpg at 1200x630. Wire each post's `ogImage: "/og-insights/<slug>.jpg"` and confirm getInsightOgImagePath() is the canonical reference.

2. Either delete the now-used getInsightOgImagePath() if step 1 ships images, OR document it as the canonical helper.

3. Tighten scripts/audit-insights.ts docstring claim #10 — currently overstates schema verification; either add a real schema-shape check (build via the same builder the page uses, assert @type: Article) or rewrite the docstring to match what's actually checked.

4. Resolve content standard divergence on market-link inlining. Standard §5 says "Contextual — embedded in prose, not stacked at the bottom" but implementation puts all market links in RelatedMarketsModule. Either (a) update the standard doc to match the module-rendered reality, or (b) extend the data model to allow markdown-style `[Market Name](/markets/slug/)` inline links in section paragraphs. Option (a) is faster + consistent with the data-as-plain-strings discipline.

5. Extract a buildCtaHref({ basePath, intent?, market?, source?, cta?, post_slug? }) helper in src/lib/insights.ts (or src/lib/cta.ts). Refactor the 4 wrapper CTAs (BuyerBriefCTA, MarketBriefCTA, WaterfrontReviewCTA, PrivateConsultationCTA) to use it. ~25 LOC saved + single source of truth for the URL-attribution scheme.

6. Add Post 8 country-club name verification step. Either a manual closeout note ("verify Royal Palm Yacht & Country Club, Boca Bath and Tennis Club, St. Andrews Country Club, Woodfield Country Club still exist and are spelled correctly") or a soft audit check.

7. Adjust inline-CTA position math in src/app/insights/[slug]/page.tsx — currently `Math.max(2, Math.floor((post.sections.length * 2) / 3))` lands at 80% through 5-section posts. Consider `Math.max(2, Math.floor(post.sections.length / 2))` to land genuinely mid-article.

8. Confirm palm-beach service depth — Post 11 lists palm-beach as primary; verify against MIA.serviceArea.

Mission boundaries (DO NOT):
- Touch GHL wiring, TCPA mechanics, license, REALTOR® marks (preserve Cards 4-5 status).
- Reopen Cycle 15 content (12 posts locked, audit:insights green).
- Reopen Cycle 14 design work.
- Introduce new colors, fonts, glassmorphism.

READ FIRST:
1. docs/CYCLE_15_GPT55_PREDEPLOY_REVIEW.md (Forge nice-to-haves §1-8)
2. docs/CYCLE_15_INSIGHTS_CONTENT_STANDARD.md (for the standard-vs-impl divergence in §4)
3. docs/CYCLE_15_LEAD_CAPTURE_ARCHITECTURE.md (URL-attribution scheme — input to step 5)
4. src/lib/insights.ts
5. src/components/cta/*.tsx
6. scripts/audit-insights.ts
7. src/app/insights/[slug]/page.tsx
8. /tmp/mia-genimg/run.ts pattern (existing art pipeline)

Estimate: ~90 minutes total. Pure operator work — no principal decisions needed.
```

---

## Option C — GHL form wiring engineering cycle (only if GHL webhook URL + TCPA-approved copy provided)

If the principal provides the GHL workflow webhook URL + a TCPA-approved consent copy block, this is the engineering cycle that wires the static lead-capture surface Cycle 15 shipped into a live CRM-capture surface.

### Paste-ready trigger:

```text
MISSION: Mia Sanabria Website — Cycle 17 · GHL Form Wiring + TCPA Consent + Lead-Capture End-to-End

Start in:

~/code/mia-sanabria-website/

PREREQUISITES (block on these):
1. Principal-provided GHL workflow webhook URL.
2. Principal-provided + legal-approved TCPA consent copy (express written consent, opt-out instructions, frequency disclosure for SMS; email consent block).
3. Principal-confirmed pipeline stage names + tag taxonomy in GHL.
4. Principal-confirmed notification routing (SMS to Mia, email summary, frequency cap).
5. Privacy policy update reviewed by legal counsel (the hidden-field schema is documented in docs/CYCLE_15_LEAD_CAPTURE_ARCHITECTURE.md §5; legal must approve the privacy policy reflects it).

If any prerequisite is missing, STOP and route the request back to principal-decision Option A.

Primary objective:
Wire the Cycle 15 static lead-capture surface into a live GHL CRM-capture surface end-to-end:

1. Replace the mailto: action on /contact/ and /valuation/ with a POST to the GHL workflow webhook URL.
2. Inject hidden form fields from URL params (intent, market, source, cta, post_slug, utm_*, referrer, timestamp) per the schema in CYCLE_15_LEAD_CAPTURE_ARCHITECTURE.md §5.
3. Add JS-driven cta_clicked capture for multi-CTA pages.
4. Add the TCPA consent copy block + email/SMS opt-in checkboxes.
5. Wire form-submit redirect to /thank-you/<intent>/ (already shipped in Cycle 15).
6. End-to-end test against a sandbox GHL workflow with 7 representative submissions (one per conversion path).
7. Update audit:completeness forms.classification check — should now show 2 forms · 2 live-ghl · 0 mailto.
8. Update lead-capture architecture doc status taxonomy: 7 paths flip from IMPLEMENTED-STATIC to LIVE-GHL.

Mission boundaries (DO NOT):
- Make any production write to GHL until the webhook URL has been verified safe with the sandbox test.
- Ship without the TCPA consent flow tested and confirmed.
- Reopen Cycle 14 / Cycle 15 design work.

READ FIRST:
1. docs/CYCLE_15_LEAD_CAPTURE_ARCHITECTURE.md (full GHL/n8n mapping + hidden-field schema)
2. docs/CYCLE_15_INSIGHTS_AND_LEAD_CAPTURE_STRATEGY.md (banned vs preferred CTA copy)
3. src/app/contact/page.tsx (current mailto: form)
4. src/app/valuation/page.tsx (current mailto: form)
5. src/app/thank-you/{,buyer-brief/,valuation/,market-brief/}page.tsx (redirect targets — already shipped)
6. src/components/cta/* (URL-attribution scheme — already encoded in href construction)
7. (legal-provided) TCPA consent copy block

Estimate: ~3-4 hours total when prerequisites are in hand. Pure engineering work.
```

---

## Cycle 15 residuals worth flagging

1. **Forge nice-to-haves (8 items)** — documented in `docs/CYCLE_15_GPT55_PREDEPLOY_REVIEW.md` §"Nice-to-have follow-ups". Captured as Option B above.

2. **Cato 7th finding — all-12-posts-same-date Search Console signal** — honest behavior; not a fix. Cycle 16+ may revisit if Google flags thin-content review. Mitigate via library framing ("evergreen guide series" not "year of dispatches") which is already in place. Strategy options if it becomes a problem: (a) staggered `dateModified` updates as posts are revised, (b) `republished_from` editorial field documenting future re-publication.

3. **Country-club name verification (Post 8)** — Royal Palm YCC, Boca Bath & Tennis Club, St. Andrews CC, Woodfield CC. Captured in Option B step 6. Audit doesn't validate external entity names; manual confirmation worth adding.

4. **Carry-forward WARNs unchanged** — `audit:completeness.forms.classification` (2 mailto, expected per lead-capture architecture); `audit:rendered.probe.viewportSanity` (chrome --dump-dom mobile-clamp limitation, documented Cycle 12). Neither is a Cycle 15 regression. Both flip to PASS upon Option C wiring (forms) and a future tooling cycle (rendered probe).

## Recommendation

**Option A.** Cycle 15 closed the content + conversion gap; the bottleneck is now back to principal-side decisions. 90 minutes of focused walkthrough moves 4 of 9 external gates. Cycle 16 (Option B) is worth doing but does NOT unblock launch. Cycle 17 (Option C) is GHL-prerequisite-gated.
