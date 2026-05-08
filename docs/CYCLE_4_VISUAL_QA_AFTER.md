# Cycle 4 Visual QA After — Post-Implementation + Live Verify

**Captured:** 2026-05-08 PM cycle 4 (after deploy + Caddy flip)
**Source:** live staging `https://miasanabriarealtor.trueidea.com` at cycle-4 commit `aad9820`
**Caddy state post-deploy:** last-modified `Fri, 08 May 2026 22:01:24 GMT`, ETag `didmtu6seolc2bl8` (was `didkhjfmkidc2b33` pre-deploy — flip confirmed)
**Storage:** `/tmp/mia-cycle4-brand-qa-after/` (70 PNGs = 14 routes × 5 viewports, same set as `before/`)

## Live verification (cache-busted curl)

| Route | HTTP | Notes |
|---|---|---|
| `/` | 200 | backdrop-blur GONE from rendered HTML (grep clean) |
| `/about/` | 200 | header backdrop-blur absent |
| `/buyers/` | 200 | live |
| `/sellers/` | 200 | live |
| `/valuation/` | 200 | TCPA-disclosure prose live (mechanics still pending GHL) |
| `/contact/` | 200 | TCPA-disclosure prose live; mailto-only |
| `/markets/` | 200 | live |
| `/markets/fort-lauderdale/` | 200 | live |

All probed with `?_=$(date +%s)` cache-bust + `Cache-Control: no-cache` header. Caddy flipped from cycle-3 last-modified at `20:11:18 GMT` to cycle-4 at `22:01:24 GMT` (~1h 50m total wall-clock incl. cycle-4 work + ~107s deploy + ~30s Caddy flip).

## Cycle-4 deltas — visible in after-screenshots

### Fix 1: backdrop-blur glassmorphism removed

- **File:** `src/components/SiteHeader.tsx` line 15
- **Before:** `<header className="sticky top-0 z-50 border-b border-cream-300 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/85">`
- **After:** `<header className="sticky top-0 z-50 border-b border-cream-300 bg-cream-50">`
- **Visible in:** every after-screenshot at the sticky header band — solid cream-50 instead of frosted-glass effect
- **Audit verification:** `audit:brand` reports `brand.noForbiddenInBuilt — 0 off-brand classes in built output` (was `8 off-brand classes` pre-fix)

### Fix 2: Footer social icons 36×36 → 44×44 + focus ring

- **File:** `src/components/SiteFooter.tsx` line 198
- **Before:** `className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream-200/30 transition-colors hover:border-brass-400 hover:text-brass-300"`
- **After:** `className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream-200/30 transition-colors hover:border-brass-400 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-400"`
- **Visible in:** every after-screenshot's footer block, specifically `home_mobile-sm.png` and `home_mobile-md.png` where touch targets are now ≥44×44
- **Spec compliance:** WCAG 2.5.5 AAA tap-target minimum
- **Audit verification:** `audit:brand` reports footer trust elements still PASS

### Fix 3: New audit:images sentinel (structural)

- **File:** `scripts/audit-images.ts` (NEW, 360 lines)
- **Wired:** `package.json` `audit:images` + `audit:all` chain
- **Outputs:** `reports/audit-images.{json,md}`
- **Run result:** `7 PASS · 0 WARN · 0 FAIL`
- **Caught:** 0 actual missing images (confirms Team B's empirical finding); structural gap was the absence of the sentinel itself
- **Coverage:** every `<img>` resolves locally, every `og:image` resolves, every `twitter:image` resolves, no placeholder filenames, all alt attrs present, no remote URLs, all required Brand-Contract assets present (Mia headshots, OGs, logos, 13 market heroes)

### Fix 4: New audit:brand-consistency sentinel (structural)

- **File:** `scripts/audit-brand-consistency.ts` (NEW, 250 lines)
- **Wired:** `package.json` `audit:brand` + `audit:all` chain
- **Outputs:** `reports/audit-brand-consistency.{json,md}`
- **Run result:** `7 PASS · 0 WARN · 0 FAIL` (caught + fixed `backdrop-blur` violation in cycle-4)
- **Coverage:** source forbidden colors, fonts, glassmorphism in source + built output, footer trust elements, footer 4-col structure, trust-strip aria-label, mobile nav presence

### Fix 5: Deploy preflight casing bug

- **File:** `scripts/deploy-and-verify.ts`
- **Before:** read `counts.fail`, `counts.warn`, `counts.pass`, `counts.skip` (lowercase) — but JSON ships `counts.PASS|WARN|FAIL|SKIP` uppercase. Result: silently always-zero gate.
- **After:** read `counts.PASS ?? counts.pass ?? 0` (uppercase first, lowercase fallback). Cycle-3 fixed field name (`summary` → `counts`); cycle-4 fixed casing.
- **Visible in:** terminal output during cycle-4 deploy run; previously showed `pass=0 warn=0 fail=0 skip=0` despite 14 PASS / 2 WARN / 0 FAIL.

## What did NOT change this cycle (preserve list)

- Brand System Contract content (no new colors, fonts, tokens)
- Voice / tagline / anchor lines (`MIA.voice.tagline` unchanged — Card 3 deferred)
- License rendering (`MIA.unverified.licenseNumber` unchanged — Card 1 OPEN)
- TCPA mechanics (Card 2 deferred to GHL form-wiring cycle)
- REALTOR® mark usage (Card 4 deferred to next-cycle content sprint)
- Combined REALTOR®+MLS footer graphic (Card 5 deferred)
- Spanish hreflang (Card 6 deferred to Mia language confirmation)
- 13 market pages copy
- 5 non-market funnel pages copy
- ISA structure
- Audit-completeness existing checks (extended, not replaced)

## Audit-chain post-cycle-4

```
typecheck:                 exit 0
lint:                      exit 0
build:                     exit 0 (25 routes prerendered)
audit:all (chain):         14 PASS · 2 WARN · 0 FAIL · 0 SKIP
audit:images (NEW):        7 PASS · 0 WARN · 0 FAIL · 0 SKIP
audit:brand (NEW):         7 PASS · 0 WARN · 0 FAIL · 0 SKIP
─────────────────────────────────────────────────────────
Total cycle-4 chain:      28 PASS · 2 WARN · 0 FAIL · 0 SKIP
```

The 2 WARNs are the same accepted ones from cycle-2 onward:

- `completeness.images.dimsAltPlaceholder` — 27 next/image fill artifact issues (CLS-protected via aspect-ratio CSS; documented as accepted)
- `completeness.forms.classification` — 2 mailto forms (gated on GHL webhook URL)

Both flip to PASS when GHL form-wiring lands.

## Cross-references

- Skill spec: `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL.md` v0.2.0
- Skill changelog: `docs/skills/WEBSITE_PRODUCTION_LOOP_SKILL_CHANGELOG.md`
- Skill processing notes: `docs/skills/SKILL_CREATOR_PROCESSING_NOTES.md`
- Brand+Visual QA matrix: `docs/BRAND_AND_VISUAL_PRODUCTION_QA_MATRIX.md`
- Principal-decision register: `docs/PRINCIPAL_DECISION_REGISTER.md`
- Cycle-4 closeout: `docs/PRODUCTION_READINESS_HANDOFF_SPARK_ONLY_CYCLE_4_2026-05-08.md`
- Before screenshots: `/tmp/mia-cycle4-brand-qa-before/` (70 PNGs)
- After screenshots: `/tmp/mia-cycle4-brand-qa-after/` (70 PNGs)
