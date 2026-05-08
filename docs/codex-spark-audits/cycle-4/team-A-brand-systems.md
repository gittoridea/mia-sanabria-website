# Team A — Brand Systems Director (Cycle 4)

## Verdict (one sentence)
The site is close to production grade but still has material brand-system and conversion gaps, so it should be addressed before full luxury launch.

## Top 10 findings

### Finding 1: Hero visual rhythm is under-specified on narrow breakpoints
- Severity: medium
- File/component: [`Hero.tsx`](/home/torrey/code/mia-sanabria-website/src/components/Hero.tsx)
- Recommended fix: At `320/375/414`, reduce heading/eyebrow scale stack to a tested rhythm (`gap` and max-width tuning) and make overlay/ text-shadow tuning deterministic per mode so the first viewport frame always reads as a premium editorial hero.
- Validation method: Capture 320/375/414 hero frames across home/about/buyers/sellers and confirm no text crowding, no long-line clipping, and stable first-glance visual hierarchy.
- Safe to implement now: yes
- Principal approval required: no

### Finding 2: Mobile/compact header rhythm lacks an explicit compact lockup budget
- Severity: medium
- File/component: [`SiteHeader.tsx`](/home/torrey/code/mia-sanabria-website/src/components/SiteHeader.tsx)
- Recommended fix: Introduce a compact 320/375/414 tokenized spacing profile (`h`, `px`, gap) so logo lockup, nav trigger, and phone action do not drift as viewport width changes.
- Validation method: Visual QA on 320/375/414 with route-level walkthrough confirming no overlap, wrap, or unintentional reflow.
- Safe to implement now: yes
- Principal approval required: no

### Finding 3: Sticky header can obscure anchored content without explicit scroll-offset discipline
- Severity: low
- File/component: [`globals.css`](/home/torrey/code/mia-sanabria-website/src/app/globals.css) + [`SiteHeader.tsx`](/home/torrey/code/mia-sanabria-website/src/components/SiteHeader.tsx)
- Recommended fix: Add global sticky-aware offset (`scroll-padding-top` at the content root) and keep internal top-offset consistent with final header height.
- Validation method: Any anchor/jump interaction should resolve with section title fully visible below the sticky bar on mobile and desktop.
- Safe to implement now: yes
- Principal approval required: no

### Finding 4: Footer social targets are below 44×44 minimum tap size
- Severity: high
- File/component: [`SiteFooter.tsx`](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx)
- Recommended fix: Increase social icon link target to 44×44 minimum (`h-11 w-11` minimum with spacing discipline) while preserving icon centering and focus visibility.
- Validation method: On 320/375/414 run a manual tap-target map (or devtools hitbox check) and verify all footer social links are ≥44×44.
- Safe to implement now: yes
- Principal approval required: no

### Finding 5: License/credential surface lacks null-guard and verification semantics
- Severity: high
- File/component: [`mia.ts`](/home/torrey/code/mia-sanabria-website/src/lib/mia.ts) + [`SiteFooter.tsx`](/home/torrey/code/mia-sanabria-website/src/components/SiteFooter.tsx)
- Recommended fix: If Mia confirmation is pending, hide credential blocks behind explicit verified/null-safe flags and avoid rendering a potentially unverified license/designations UI state.
- Validation method: Load with mock null/unset values and confirm only verified blocks render and copy never shows placeholder/unknown claims.
- Safe to implement now: no
- Principal approval required: yes

### Finding 6: CTA geometry no longer matches the locked contract defaults in production strip
- Severity: medium
- File/component: [`CTAStrip.tsx`](/home/torrey/code/mia-sanabria-website/src/components/CTAStrip.tsx)
- Recommended fix: Standardize primary CTA to `px-8 py-3.5`; standardize secondary to contract border/color treatment and enforce consistent 8px gap/tap area across all pages.
- Validation method: Inspect computed button classes and rendered size snapshots for home/about/buyers/sellers/valuation/contact/markets pages at 320/768/1024.
- Safe to implement now: yes
- Principal approval required: no

### Finding 7: Route-level CTA hierarchy is not unified to a single conversion spine
- Severity: high
- File/component: [`src/app/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/page.tsx), [`about/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/about/page.tsx), [`buyers/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/buyers/page.tsx), [`sellers/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/sellers/page.tsx), [`valuation/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/valuation/page.tsx), [`contact/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/contact/page.tsx), [`markets/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/markets/page.tsx), [`markets/[slug]/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/markets/[slug]/page.tsx), [`insights/page.tsx`](/home/torrey/code/mia-sanabria-website/src/app/insights/page.tsx)
- Recommended fix: Normalize route hero-to-main conversion path: identical CTA priority order and wording intent for each intent funnel (learn → consult → schedule) so users always see one clear primary action first.
- Validation method: Route-by-route sequence audit confirming primary CTA appears in the first fold and no secondary CTA outranks it.
- Safe to implement now: yes
- Principal approval required: no

### Finding 8: Market visual component drifts from locked palette with noncanonical navy shade usage
- Severity: medium
- File/component: [`MarketCard.tsx`](/home/torrey/code/mia-sanabria-website/src/components/MarketCard.tsx)
- Recommended fix: Replace non-canonical shade usage (`navy-700` variants in card background/hover states) with contract-approved `navy-800/900` surfaces and verify contrast against adjacent cream strips.
- Validation method: Palette audit script/diff and manual contrast check on hover/active states to ensure no unapproved color appears.
- Safe to implement now: no
- Principal approval required: yes

### Finding 9: Typography authority is inconsistent across heading families in reusable blocks
- Severity: medium
- File/component: [`SectionHeading.tsx`](/home/torrey/code/mia-sanabria-website/src/components/SectionHeading.tsx) + page uses
- Recommended fix: Enforce tokenized variants: Cinzel for display/headings/eyebrows and Montserrat for body/meta, with contract tracking and weight locks in one place to prevent component-by-component drift.
- Validation method: DOM audit for font-family assignments in heading tiers and confirm no mixed heading-face regressions.
- Safe to implement now: yes
- Principal approval required: no

### Finding 10: Missing `ContactCard.tsx` asset causes contract-to-code drift and weakens maintainability across contact touchpoints
- Severity: low
- File/component: [`src/components/ContactCard.tsx`](/home/torrey/code/mia-sanabria-website/src/components/ContactCard.tsx) (missing)
- Recommended fix: Either add `ContactCard.tsx` with locked pattern and use it on contact-related routes, or explicitly remove references/instructions that imply its existence to avoid future component divergence.
- Validation method: Confirm the file exists and is reused consistently; run a grep for contact-card imports/usages and verify none reference a missing pattern.
- Safe to implement now: yes
- Principal approval required: no

## Cross-cutting observations
- The biggest brand-risk remains conversion coherence: the shell is mostly cohesive, but CTA rhythm is the main point where luxury intent can degrade into template-like UX.
- Contract fidelity is mostly good overall, but the gaps are concentrated in interaction quality, trust-surface correctness, and token consistency in reusable primitives.
- The site reads as premium in many places; however, unresolved touch-target, credential-guard, and CTA hierarchy issues will be visible to high-end users as quality defects before conversion conversion.

## Anti-criteria check
- No new accent colors or font swaps were proposed.
- No glassmorphism, gradient borders, or neon effects were proposed.
- No DNS/Cloudflare/GHL/domain/.com migration recommendations were added.
- No fabricated license/designation/MLS/market facts were introduced; the license issue is framed as a null-guard and verification problem.

## Evidence appendix
- model_used: gpt-5.3-codex-spark
- team: A Brand Systems Director
- reasoning_effort: xhigh
- sandbox: read-only

{"team":"A","verdict":"concerns","completeness":"partial","top_concerns":["Footer social links are below 44×44 minimum tap target","Credential/license surface is not null-guarded and may render unverified claims","Route-level CTA hierarchy is not unified across home/about/buyers/sellers/valuation/contact/markets/markets-detail/insights"],"findings_count":10,"high_severity_count":3,"safe_now_count":8,"approval_required_count":2}
