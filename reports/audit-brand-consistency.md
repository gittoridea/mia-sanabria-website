# Audit Brand Consistency Report

**Generated:** 2026-05-11T16:51:33.942Z

**Summary:** 12 PASS · 0 WARN · 0 FAIL · 0 SKIP

## Results by category

### Color System

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `brand.noForbiddenColors` | ✅ | No off-brand color tokens (red/orange/amber/yellow/lime/emerald/teal/cyan/sky/indigo/violet/purple/fuchsia/pink/rose) in src/ | no off-brand color tokens |

### Typography

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `brand.noForbiddenFonts` | ✅ | Only Cinzel display + Montserrat body (font-display / font-sans / font-cinzel / font-montserrat); no font-mono / font-serif / font-cursive / font-fantasy | no forbidden font families |

### Built Output

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `brand.noForbiddenInBuilt` | ✅ | Built HTML across 8 sampled pages contains no off-brand color/effect classes | 0 off-brand classes in built output |

### Footer Discipline

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `brand.footerTrustElements` | ✅ | Every sampled page renders LPT / REALTOR® / EHO trust sentinels + 4 legal links in footer | 8 sampled pages carry full footer trust set |

### Component Discipline

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `brand.siteFooterStructure` | ✅ | SiteFooter.tsx renders the 4-col grid (brand + EXPLORE + ABOUT + BROKERAGE) per Brand System Contract | all 3 named footer columns present |
| `brand.siteFooterTrustStripAria` | ✅ | SiteFooter trust strip carries aria-label="Industry affiliations" | trust-strip aria-label present |

### Mobile Discipline

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `brand.mobileNavPresent` | ✅ | SiteHeader.tsx renders a mobile-nav affordance (drawer, hamburger, or hidden-on-desktop nav) | mobile nav toggle + breakpoint visibility classes detected |

### Hero Discipline

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `brand.heroH1ContrastTokens` | ✅ | Hero image-mode H1 has structural tokens for readability (panel attr + navy-9X panel bg + brass-300 left edge + bold). STRUCTURAL ONLY — rendered readability is verified by audit:hero-contrast. | panel attr + navy-9X bg + brass-300 left edge + bold weight all present in Hero.tsx |
| `brand.heroNoNavyGlowHalo` | ✅ | Hero text-shadow does not use navy-tint rgba(15,42,68,…) which produced the cycle-5/6 halo smear | no navy-tint text-shadow halo present |
| `brand.heroNoCycle7WeakOverlay` | ✅ | If Hero relies on overlay-only readability (no copy panel), the cycle-7 weak overlay values (via-navy-900/40, sm:to-navy-900/20) must be absent. | copy panel present — overlay strength is decorative not load-bearing |
| `brand.heroOverlayLayers` | ✅ | Hero image-mode renders three overlay layers (mood + content-scrim + cta-scrim). PRESENCE ONLY — opacity correctness verified by audit:hero-contrast. | all 3 overlay layers present (mood, content-scrim, cta-scrim) |

### Email Consistency

| ID | Status | Description | Evidence |
|---|:-:|---|---|
| `brand.publicEmailConsistency` | ✅ | All emails referenced in src/ are the canonical public email (msanabriarea@gmail.com) | 1 distinct email(s) in src/, all canonical |
