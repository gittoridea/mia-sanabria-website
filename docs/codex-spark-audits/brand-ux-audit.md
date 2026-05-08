# Team A — Brand / Visual Design Director Audit

## Verdict (one sentence)
The site is directionally consistent with the locked luxury brand system across major routes, but it is not yet ready for luxury-grade release because of two high-risk trust/conversion issues and several mobile-plus-implementation gaps.

## Findings (numbered, ranked by impact)
1. Unverified license is currently presented as active trust proof  
Reference: [src/lib/mia.ts](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts), [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx), [docs/BRAND_SYSTEM_CONTRACT.md](/home/torrey/code/mia-sanabria-website/docs/BRAND_SYSTEM_CONTRACT.md)  
Severity: high  
Recommendation: Use explicit null/placeholder rendering for license/designations until verified; if unresolved, show verification status text only and avoid implying certainty in the footer trust strip.

2. Lead capture is not productized on core conversion pages (contact + valuation)  
Reference: [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx), [docs/MIA_IDEAL_PRODUCTION_STATE.md](/home/torrey/code/mia-sanabria-website/docs/MIA_IDEAL_PRODUCTION_STATE.md)  
Severity: high  
Recommendation: Replace `mailto:` form actions with an integrated capture endpoint (CRM/webhook) and add explicit success/error states and required-field validation; this is required for luxury buyer intent conversion quality.

3. Sticky-header navigation + anchor jump polish is incomplete for mobile touch UX  
Reference: [src/app/layout.tsx](/home/torrey/code/mia-sanabria-website/src/app/layout.tsx), [src/app/globals.css](/home/torrey/code/mia-sanabria-website/src/app/globals.css), [docs/BRAND_SYSTEM_CONTRACT.md](/home/torrey/code/mia-sanabria-website/docs/BRAND_SYSTEM_CONTRACT.md)  
Severity: medium  
Recommendation: Add contract-aligned `scroll-padding-top`/anchor handling for sticky header behavior and ensure in-page navigation never hides section starts under the fixed header on 320/375/414/768 flows.

4. Footer social controls are below recommended touch-target minimum and reduce premium mobile comfort  
Reference: [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx), [docs/BRAND_SYSTEM_CONTRACT.md](/home/torrey/code/mia-sanabria-website/docs/BRAND_SYSTEM_CONTRACT.md)  
Severity: medium  
Recommendation: Raise icon button minimum size to at least 44×44 and maintain visible padding contrast on cream/navy contexts so touch accuracy matches luxury mobile standards.

5. IDX iframe dimensions are fixed (1200×900) and can create constrained scaling behavior  
Reference: [src/components/IdxEmbed.tsx](/home/torrey/code/mia-sanabria-website/src/components/IdxEmbed.tsx), [src/app/about/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx)  
Severity: medium  
Recommendation: Wrap IDX in a responsive container and use fluid width with constrained aspect ratio; avoid hardcoded desktop dimensions to protect layout integrity on 320/375/414/768 breakpoints.

6. Markets route system is complete but under-differentiated visually and in copy voice per locality  
Reference: [src/lib/markets.ts](/home/torrey/code/mia-sanabria-website/src/lib/markets.ts), [src/app/markets/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/page.tsx), [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx), [src/components/MarketCard.tsx](/home/torrey/code/mia-sanabria-website/src/components/MarketCard.tsx), [docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md](/home/torrey/code/mia-sanabria-website/docs/WORLD_CLASS_REALTOR_SITE_GAP_MATRIX.md)  
Severity: low  
Recommendation: Keep structure but add distinct local-intent copy, hero context, and one neighborhood-level signal per market to reduce “template realtor” perception across all 13 routes.

7. CTA hierarchy and premium tone are inconsistent in service-driven pages  
Reference: [src/components/CTAStrip.tsx](/home/torrey/code/mia-sanabria-website/src/components/CTAStrip.tsx), [src/app/buyers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [src/app/sellers/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [src/app/insights/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/insights/page.tsx), [docs/BRAND_SYSTEM_CONTRACT.md](/home/torrey/code/mia-sanabria-website/docs/BRAND_SYSTEM_CONTRACT.md), [docs/MIA_IDEAL_PRODUCTION_STATE.md](/home/torrey/code/mia-sanabria-website/docs/MIA_IDEAL_PRODUCTION_STATE.md)  
Severity: low  
Recommendation: Enforce consistent primary/secondary/tertiary treatment across pages and pages-to-section flow so “intent-first” actions read as a unified luxury voice rather than page-local module repetition.

## Prioritized design improvements (top 5)
1. Gate licensing copy and trust badges by verification state (`mia.ts` + `SiteFooter.tsx`).
2. Replace `mailto:` form actions on contact + valuation with production form pipeline and confirmation UI.
3. Make IDX embed responsive and remove fixed desktop width/height assumptions.
4. Add sticky-anchor-safe scroll offset and verify touch-target sizing in header/footer at 320/375/414/768.
5. Add market-level local storytelling (without new tokens) to reduce templated feel across all 13 market routes.

## Risks of acting on findings
1. Tightening license/verification rendering could initially hide trust proof until legal data is completed; ensure legal copy sets expectation to avoid confusion.
2. Migrating forms from `mailto` to endpoint-based capture may change submission flow and should be tested for email deliverability and spam handling.
3. Responsive embed refactor may affect third-party iframe behavior and requires smoke-checking IDX features.
4. CTA hierarchy normalization can alter micro-conversion sequencing; validate user flow with analytics after publish.
5. Market copy localization increases content maintenance burden and requires factual oversight per jurisdiction/area.

## Recommended patches (specific files only)
1. [src/lib/mia.ts](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts) — set unverified license fields to null-safe defaults and explicit verification state.
2. [src/components/SiteFooter.tsx](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx) — guard trust text rendering and increase social icon hit area to minimum 44×44.
3. [src/app/globals.css](/home/torrey/code/mia-sanabria-website/src/app/globals.css) — add sticky-header scroll offset and mobile interaction-safe spacing rules.
4. [src/components/IdxEmbed.tsx](/home/torrey/code/mia-sanabria-website/src/components/IdxEmbed.tsx) — replace fixed iframe dimensions with responsive container sizing.
5. [src/app/contact/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [src/app/valuation/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx) — switch to production submission endpoint and structured success/error UX.
6. [src/app/markets/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/page.tsx), [src/app/markets/[slug]/page.tsx](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx) — enrich local-market proof points and maintain 13-route consistency with differentiated voice.
7. [src/components/CTAStrip.tsx](/home/torrey/code/mia-sanabria-website/src/components/CTAStrip.tsx) — reassert primary/secondary/tertiary ladder consistency across all service routes.

## Anti-criteria check
- No new fonts, no new accent colors, no glassmorphism, no gradient border accents introduced: pass (audit proposes only contract-compliant implementation corrections).
- No DNS / Cloudflare / GHL / domain migration changes: pass.
- No fabricated licenses/designations/awards/MLS stats/Spanish introduced: pass.
- No county reclassification of Boca Raton/Delray/Palm Beach to Broward: pass.

## Evidence appendix
- Model used: gpt-5.3-codex-spark
- Reasoning effort: xhigh
- Sandbox: read-only

{"verdict":"concerns","completeness":"full","top_concerns":["Unverified license is displayed as active trust proof","Contact/valuation remain mailto-only and not captured into production lead flow","IDX iframe uses fixed desktop dimensions"],"findings_count":7,"high_severity_count":2}
