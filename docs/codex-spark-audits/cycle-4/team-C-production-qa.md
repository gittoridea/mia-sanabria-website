# Team C — World-Class Website Production QA (Cycle 4)

## Verdict (one sentence — 'would a high-end agency ship this?')
No — a high-end agency would not ship this yet because core conversion, trust, and mobile polish gaps are still production-blocking for a luxury real-estate brand.

## Top 10 findings

### Finding 1: Contact and valuation flows are email-client dependent instead of CRM-grade conversion funnels
- Severity: critical
- File/component: [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx)
- Recommended fix: Replace `mailto:` form actions with a real capture path (approved form processor or CRM endpoint), add inline validation, loading state, explicit success/error messaging, anti-bot controls, and a follow-up confirmation step.
- Validation method: Manual QA on desktop/mobile by submitting both forms with valid/invalid input and confirming server-side receive + on-screen confirmation without opening an email client.
- Safe to implement now: no
- Principal approval required: yes

### Finding 2: Mobile nav drawer is visually functional but not premium-behaviorally complete
- Severity: high
- File/component: [src/components/SiteHeader.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteHeader.tsx)
- Recommended fix: Add body-scroll lock, focused-tab trap, `Escape` key close, backdrop dimming, and explicit close affordance; keep hamburger state restore when closing.
- Validation method: Device QA at 360/390/768 widths: open drawer, attempt page scroll, keyboard tab through links, and close via overlay/escape while verifying focus returns to trigger.
- Safe to implement now: yes
- Principal approval required: no

### Finding 3: Sticky-header jump behavior leaves users blind to anchored sections
- Severity: medium
- File/component: [src/app/globals.css](/home/torrey/code/mia-sanabria-website/src/app/globals.css), [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx)
- Recommended fix: Add `scroll-padding-top` and route-specific `scroll-margin-top` for anchor targets to clear sticky header overlap and improve in-page navigation.
- Validation method: Verify section anchors from top nav/CTA links across 320/768/1280 widths land with target heading fully visible.
- Safe to implement now: yes
- Principal approval required: no

### Finding 4: Footer trust stack feels crowded and low-touch, under-delivering luxury trust signaling
- Severity: medium
- File/component: [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx)
- Recommended fix: Reorder trust hierarchy: brand proof (license/REALTOR®/EHO context, credentials) first, then contact, then social; increase icon touch targets and spacing to maintain 44px minimum hit area on mobile.
- Validation method: Visual QA at mobile and tablet for alignment, target size, and one-screen legibility.
- Safe to implement now: yes
- Principal approval required: no

### Finding 5: Core brand voice still advertises a “family homes” framing instead of luxury-first positioning
- Severity: medium
- File/component: [src/lib/site.ts](/home/torrey/code/mia-sanabria-website/src/lib/site.ts)
- Recommended fix: Replace broad “family homes”/generic realtor phrasing with luxury, discretion, and market-expertise language matching the BRAND_SYSTEM contract; align homepage and page meta copy accordingly.
- Validation method: Copy review against [docs/BRAND_SYSTEM_CONTRACT.md](/home/torrey/code/mia-sanabria-website/docs/BRAND_SYSTEM_CONTRACT.md) and run a 25-route spot-read for tone drift.
- Safe to implement now: yes
- Principal approval required: no

### Finding 6: License/credential rendering mixes unverified source with public trust surfaces
- Severity: high
- File/component: [src/lib/mia.ts](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts), [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/app/terms/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/terms/page.tsx)
- Recommended fix: Remove unverified-data indirection from visible trust surfaces; pull only confirmed, compliance-safe credentials and render in one clearly audited trust block with legal-safe phrasing.
- Validation method: Compliance/legal review + visual pass confirming the only displayed credentials are verified and consistently placed.
- Safe to implement now: no
- Principal approval required: yes

### Finding 7: IDX embed implementation risks broken responsive behavior and perceived quality regressions on mobile
- Severity: high
- File/component: [src/components/IdxEmbed.tsx](/home/torrey/code/mia-sanabria-website/src/components/IdxEmbed.tsx)
- Recommended fix: Replace fixed width/height iframe sizing with strict responsive container behavior and deterministic loading fallback; defer render when off-screen if needed.
- Validation method: Capture 320/414/768 viewport screenshots and measure no overflow, no clipping, and no unexpected vertical shift (CLS).
- Safe to implement now: yes
- Principal approval required: no

### Finding 8: DMCA/legal route still reads as pre-production, which weakens credibility in trust-sensitive sections
- Severity: medium
- File/component: [src/app/dmca/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/dmca/page.tsx)
- Recommended fix: Finalize legal text to production-ready language (no “pending” placeholders), include final contact path and clear notice language, and keep legal pages stylistically aligned with brand shell.
- Validation method: Legal/editorial review with a final text pass and a no-placeholders grep pass for “pending/temporary/under construction.”
- Safe to implement now: no
- Principal approval required: yes

### Finding 9: Buyers/Sellers page flow does not escalate to a single high-intent CTA within first fold
- Severity: medium
- File/component: [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/components/CTAStrip.tsx](/home/torrey/code/mia-sanabria-website/src/components/CTAStrip.tsx)
- Recommended fix: Introduce a clear conversion micro-flow above the fold per page (primary consultation CTA + secondary proof CTA), with a persistent contact/valuation anchor for high-intent visitors.
- Validation method: Record first-screen interaction map and verify CTA discoverability in first 2 seconds on mobile and desktop.
- Safe to implement now: yes
- Principal approval required: no

### Finding 10: 13 market pages are visually template-stable but not market-distinct, hurting premium personalization
- Severity: medium
- File/component: [src/app/markets/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/page.tsx), [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx), [src/lib/markets.ts](/home/torrey/code/mia-sanabria-website/src/lib/markets.ts), [src/components/MarketCard.tsx](/home/torrey/code/mia-sanabria-website/src/components/MarketCard.tsx)
- Recommended fix: Add route-specific proof assets and local market narratives (stat anchor, neighborhood proof, local comparables framing) so each slug reads authored, not generated.
- Validation method: Capture each market route at 5 screen sizes and compare for repetitive rhythm, duplicate blocks, and missing local specificity.
- Safe to implement now: yes
- Principal approval required: no

## What a luxury realtor would notice that the cycle-3 audits missed
- The website’s premium tone weakens in utility details (forms, footer trust, legal copy) where affluent clients evaluate seriousness before reading marketing copy.
- Mobile behavior shows “works” but not “careful”: drawer interactions and scroll/anchor flow feel like a generic implementation, not a concierge-grade one.
- Market sections can read as systemized inventory rather than lived local expertise, which matters for a luxury brand’s differentiation.
- The conversion model still asks users to act before being guided, instead of guiding with reassurance and proof.
- The legal trust layer is visible but not yet fully production-grade (notably credential provenance and DMCA finality).

## What the cycle-3 implementation pass over- or under-shot
- Over-shot: substantial structural progress was made in componentization, layout consistency, and section skeleton quality, with fewer obvious missing-page failures than earlier cycles.
- Under-shot: conversion-critical production mechanics, trust provenance, and mobile micro-interactions were left behind behind visual assembly.
- Net: the product has styling maturity, but not yet funnel maturity.
- Directly actionable priority for next cycle: forms, nav/body-scroll behavior, trust hierarchy integrity, and market-page personalization.

## Anti-criteria check
- No recommendations made to switch frameworks, alter DNS/CDN/GHL stack, or change domain strategy.
- No invention or claim of new licenses, MLS status, awards, Spanish-language capability, or sales figures.
- No replacement of market geography with incorrect jurisdiction language (e.g., Broward County mislabeling).
- No recommendations that conflict with the locked constraints.

## Evidence appendix
- model_used: gpt-5.3-codex-spark
- team: C World-Class Production QA
- reasoning_effort: xhigh
- sandbox: read-only

{"team":"C","verdict":"concerns","completeness":"full","top_concerns":["Contact and valuation flows are email-client dependent instead of CRM-grade conversion funnels","Mobile nav drawer is visually functional but not premium-behaviorally complete","Sticky-header jump behavior leaves users blind to anchored sections","Footer trust stack feels crowded and low-touch, under-delivering luxury trust signaling","Core brand voice still advertises a family-homes framing instead of luxury-first positioning","License/credential rendering mixes unverified source with public trust surfaces","IDX embed implementation risks broken responsive behavior on mobile","DMCA/legal route still reads as pre-production, weakening credibility","Buyers/Sellers pages do not escalate to a high-intent CTA within first fold","13 market pages read as template-like rather than market-distinct"],"findings_count":10,"high_severity_count":4,"safe_now_count":7,"agency_ship_score_1_to_10":4}
