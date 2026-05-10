# Cycle 17 — Recovery and Baseline

**Date:** 2026-05-10
**Mission:** Cycle 17 — Blog Label Cleanup + Fort Lauderdale V3 + Official Trust Logo Fix + Production-Readiness Closure
**Effort:** E5 (Comprehensive) — set by `/effort max`

## Working tree state at start

| Probe | Result |
|---|---|
| Branch | `main` |
| HEAD | `f803cc91fba4ee9e657f684b1883a72138a47ee4` |
| Remote `origin/main` | `f803cc91fba4ee9e657f684b1883a72138a47ee4` (in sync) |
| Working tree | clean |
| Last commit | `f803cc9 docs(MIA-SITE-CYCLE-16): closeout — Forge VERIFY PASS_WITH_MINOR_CONCERNS + Cato partial + LIVE deploy verified` |

## Live state at start

| Probe | Result |
|---|---|
| URL | `https://miasanabriarealtor.trueidea.com/` |
| HTTP | `HTTP/2 200` |
| ETag | `"difbajpynz7k4ns1"` (Cycle 16 close) |
| Last-Modified | `Sun, 10 May 2026 21:24:20 GMT` (Cycle 16 deploy) |
| Cache-Control | `public, max-age=300, s-maxage=600, must-revalidate` |
| Content-Security-Policy | present (script-src, style-src, font-src, frame-src, etc.) |
| HSTS | `max-age=63072000; includeSubDomains; preload` |

## Specialist-prereq probe (OBSERVE-phase gate, v6.4.0 R2)

`bun ~/.claude/PAI/TOOLS/SpecialistProbe.ts --json`

| Specialist | Status | Binary / Auth |
|---|:-:|---|
| **forge** | ✅ available | `/home/torrey/.local/bin/codex` + `~/.codex/auth.json` (oauth) |
| **cato** | ✅ available | same as forge, read-only sandbox accepted |
| **perplexity** | ✅ available | `OPENROUTER_API_KEY` set |
| **anvil** | ❌ missing | binary not at `~/.bun/bin/{anvil,kimi}` or `~/.local/bin/{anvil,kimi}` |

**Resolution:** Forge + Cato bound for VERIFY-phase work. Anvil fallback to Forge for any whole-project-context coding (not blocking — Forge specializes in code quality/completeness anyway).

## Baseline audit chain (local, source-driven)

Audits executed on the build from Cycle 16 (already in `out/`):

| Audit | PASS | WARN | FAIL | Notes |
|---|---:|---:|---:|---|
| `typecheck` | clean | — | — | `tsc --noEmit` zero output |
| `lint` | clean | — | — | `next lint` no warnings/errors |
| `audit:insights` | 535 | 0 | 0 | 12-post library; all banned phrases clean |
| `audit:completeness` | 15 | 1 | 0 | WARN: `forms.classification` (2 mailto, expected pre-GHL) |
| `audit:legal` | 18 | 1 | 0 | WARN: `dmca.uscoFlag` (USCO registration pending — expected) |
| `audit:about` | 12 | 0 | 0 | Sitewide overclaim sweep clean |
| `audit:images` | 14 | 0 | 0 | All assets resolve; canonical email single |
| `audit:brand` | 12 | 0 | 0 | No off-brand colors/fonts; footer trust elements present |
| `audit:featured-markets` | 17 | 0 | 0 | 6-pager order locked; 15-market index complete |

Net: **133 PASS · 2 WARN (both expected/structural) · 0 FAIL** going into Cycle 17.

## "Evergreen Brief" inventory (Phase 2 target)

`grep -rn "Evergreen Brief" src/` returns **15 hits across 14 files**:

### Source data (12 hits — primary targets for the data swap)

```
src/data/insights/01-fort-lauderdale-waterfront-buyer-guide.ts:11
src/data/insights/02-dockage-seawalls-bridge-clearance-route-to-inlet.ts:12
src/data/insights/03-positioning-luxury-waterfront-eastern-fort-lauderdale.ts:12
src/data/insights/04-las-olas-vs-seven-isles-vs-harbor-beach.ts:12
src/data/insights/05-bay-colony-and-bermuda-riviera-private-waterfront.ts:12
src/data/insights/06-coral-ridge-victoria-park-rio-vista.ts:12
src/data/insights/07-lighthouse-point-sea-ranch-lakes-hillsboro-mile.ts:12
src/data/insights/08-boca-raton-luxury-buyers-club-beach-waterfront.ts:12
src/data/insights/09-delray-beach-luxury-buyers-walkability-beach-waterfront.ts:12
src/data/insights/10-why-automated-valuations-miss-luxury-waterfront.ts:12
src/data/insights/11-preparing-waterfront-residence-private-market-conversations.ts:12
src/data/insights/12-private-buyer-brief-defining-the-search.ts:12
```

### Code references (3 hits — type/comment surface)

```
src/lib/insights.ts:47   (JSDoc comment for InsightDateDisplayMode mode)
src/lib/insights.ts:97   (JSDoc for editorialMonthLabel field)
src/lib/insights.ts:303  (JSDoc for InsightVisibleDate.primary)
src/components/insights/InsightCard.tsx:12  (JSDoc)
```

### Built output (verified via grep on `out/`)

Live label renders at:
- Insights index cards (`InsightCard.editorialMonthLabel`)
- Article hero eyebrow: `Insights · Evergreen Brief · <Month>`
- Article footer: `editorialMonthLabel` line above "All insights" link

## Current footer trust logo assets

```
public/logos/lpt-realty.png      1097x1097 RGBA  (unchanged from Cycle 11)
public/logos/realtor-r.png       512x512   RGBA  (Cycle 16 SVG rendition)
public/logos/equal-housing.png   512x512   RGBA  (Cycle 16 SVG rendition)
```

**Issue carried from principal:** despite Cycle 16 marking these "FIXED", principal still reports the trust marks as visually wrong. Phase 5 of this cycle replaces Cycle 16's SVG renditions with **official NAR + equalhousinglogo.com white-on-transparent assets**.

## Source URLs confirmed for Phase 5

- **NAR official REALTOR® white/reversed PNG (public download, no member login required):**
  `https://www.nar.realtor/sites/default/files/2025-07/nar_membershipmark_white.png`
  Format: 8-bit RGBA, R-block + REALTOR® wordmark beneath. Single-color white on transparent.
- **EHO white PNG (principal-requested third-party source per mission prompt):**
  `https://equalhousinglogo.com/wp-content/uploads/2019/03/equal-housing-logowhite-1000.png`
  Format: 1000px, white-on-transparent, canonical HUD house silhouette with equal-sign.
- **NAR REALTOR Logo trademark rules:**
  `https://www.nar.realtor/logos-and-trademark-rules/the-realtor-logo` — confirms member-use permitted.
- **HUD EHO trademark page (canonical EHO public-domain mark):**
  Public-domain when used for Fair-Housing compliance signaling.

## Cycle 17 mission scope confirmed

| Phase | Deliverable | Risk |
|---|---|---|
| 0 | Recovery and baseline (this doc) | — |
| 1 | Decision register — 4 cards (blog label, EHO source, REALTOR source, FL V3 scope) | — |
| 2 | Remove "Evergreen Brief" — replace label with editorial alternative across 12 data files + lib/insights.ts + InsightCard JSDoc | LOW — data-only change |
| 3 | Fort Lauderdale ICP review — score V2 against HNWI ICP, identify gaps | — |
| 4 | Fort Lauderdale V3 implementation — build new component or extend V2 to fill ICP gaps | MED — content-heavy |
| 5 | Footer REALTOR®/EHO logo fix using official sources | LOW — asset swap |
| 6 | Legal pages production-readiness recheck | LOW — audit-only |
| 7 | About credentials/service-areas accuracy recheck | LOW — audit-only |
| 8 | Audit hardening (`audit:insights` rejects "Evergreen Brief", `audit:trust-logos` if stable) | LOW |
| 9 | Screenshots before/after | LOW |
| 10 | Local verification | — |
| 11 | GPT-5.5 / Forge VERIFY review | — |
| 12 | Cato compliance cross-check | — |
| 13 | Deploy + live verification | LOW (incremental) |
| 14 | Production-readiness remaining list | — |
| 15 | Handoff + next-prompt | — |

## Working assumption for execution order

1. **Phase 1 first** (decision register) — needed for Phase 2/4/5 implementation choices.
2. **Phase 2 + 5 in parallel** — label cleanup and trust-logo asset swap are independent data/asset changes.
3. **Phase 3 → 4** sequential — review the V2 page, then build V3 informed by the gaps.
4. **Phase 6 → 7** in parallel — both are read-only audits of existing pages.
5. **Phase 8** after Phase 2 lands so the new `audit:insights` rule has the cleaned data to validate against.
6. **Phase 9-10** local verification gate before Forge/Cato.
7. **Phase 11-12** in parallel where possible — Forge + Cato can both audit.
8. **Phase 13-15** sequential (deploy gates the rest).

## Constraints honored (from mission DO-NOT list)

- No GHL production wiring; only documenting blocker status.
- No TCPA compliance claim.
- No DNS, `.com` production, Cloudflare, or GHL production modification.
- No Payload/Postgres install; no CMS migration; no lead magnet build.
- Legal page copy preserved unless explicit principal-approved review.
- No fabricated credentials, license details, MLS membership, awards, reviews, sales volume, languages, testimonials, or market statistics.
- No new colors or fonts; no glassmorphism.
- Boca Raton / Palm Beach / Delray Beach treated as Palm Beach County (not Broward).
- No `.com` launch-ready claim while blockers remain.

## Next: Phase 1 — Decision Register
