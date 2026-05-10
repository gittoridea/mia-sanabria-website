# Cycle 16 — Live Verification

**Date:** 2026-05-10
**URL:** https://miasanabriarealtor.trueidea.com/

## Caddy state

| Metric | Pre-Cycle-15 | Post-Cycle-16 main commit | Post-Forge-fix patch |
|---|---|---|---|
| ETag | `dif86vkf7ke838d4` | `difb2hdu6m804ns1` | `difbajpynz7k4ns1` |
| Last-Modified | 2026-05-10 18:58:29 UTC | 2026-05-10 21:13:48 UTC | (same — patch was idempotent rebuild) |
| HTTP status | 200 | 200 | 200 |

## Live content verification

| Surface | Probe | Result |
|---|---|---|
| Homepage — Featured Markets sub-heading | `grep "Fort Lauderdale, Boca Raton, Palm Beach, Victoria Park, Lighthouse Point, and Delray Beach"` | ✓ present |
| Homepage — Pager `aria-label` | `grep "Featured Markets pagination"` (NB: pager state is client-hydrated; aria-label appears post-JS) | ⚠ JS-only (expected) |
| `/markets/fort-lauderdale/` — V2 sections | `grep "Six verifiable variables before any offer"` | ✓ present |
| `/markets/fort-lauderdale/` — V2 sections | `grep "Four ways to begin a Fort Lauderdale"` | ✓ present |
| `/markets/fort-lauderdale/` — V2 sections | `grep "Venice of America"` | ✓ present |
| `/og-insights/fort-lauderdale-waterfront-buyer-guide.jpg` | HTTP HEAD | ✓ 200 |
| `/logos/realtor-r.png` | HTTP HEAD | ✓ 200 |
| `/logos/equal-housing.png` | HTTP HEAD | ✓ 200 |
| `/about/` — forbidden phrase | `grep "deliberately small client list"` | ✓ absent |
| `/buyers/` — forbidden phrase | `grep "deliberately small client list"` | ✓ absent (post-Forge-fix patch) |
| `/sellers/` — forbidden phrase | `grep "global distribution"` | ✓ absent |
| `/sellers/` — replacement copy | `grep "multi-channel listing syndication"` | ✓ present |
| `/sellers/` — replacement copy | `grep "multi-channel syndication"` | ✓ present |

All Cycle 16 changes confirmed live.

## Footer trust strip — visual verification

Captured screenshot of footer at 1440px wide via `google-chrome --headless=new` against the live URL.

Before (Cycle 15 state captured during baseline at `/tmp/mia-cycle16-before/footer-actual-1440.png`):
- LPT — recognizable.
- **REALTOR® — flat white asymmetric block** (REALTOR®+MLS combined mark bleached by monochrome filter; "MULTIPLE LISTING SERVICE" implied authorization Mia has not confirmed).
- **EHO — small white house silhouette with illegible white-on-white wordmark blob inside**.

After (Cycle 16 state captured at `/tmp/mia-cycle16-live-after/home-footer-live.png`):
- LPT — unchanged, recognizable.
- **REALTOR® — clean white rounded square with NAVY "R" cut-out** (negative-space rendition; no MLS implication).
- **EHO — clean house silhouette with equal sign inside** (no embedded text artifact).

The visual fix lands. Principal-legal review remains the gate for production cutover per CYCLE_16_FOOTER_TRUST_LOGO_FIX.md REVIEW items.

## Routes verified at 1440 viewport

- `/` → home-live-1440.png (homepage with Featured Markets pager page 1 visible)
- `/markets/` → markets-live-1440.png (15-market index)
- `/markets/fort-lauderdale/` → markets_fort-lauderdale-live-1440.png (V2 with 10 sections)
- `/insights/` → insights-live-1440.png (12-post library)
- `/about/` → about-live-1440.png (softened copy)
- `/buyers/` → buyers-live-1440.png (post-Forge-fix)
- `/sellers/` → sellers-live-1440.png (post-Forge-fix)

Screenshots saved to `/tmp/mia-cycle16-live-after/`. Footer crops saved alongside main shots.

## Deploy ETag chain

Two deploys in this cycle:
1. **Cycle 16 main commit (`231dfe4`)** — feat: featured-markets pager + date governance + FL V2 + footer fix + about softening. Dokploy deploy in 123s. ETag flipped after observed delay (~30 min for Caddy refresh). Final ETag `difb2hdu6m804ns1` confirmed at probe time.
2. **Forge-fix patch (`94087ea`)** — fix: sitewide overclaim sweep + audit ordering. Dokploy deploy in 90s. ETag flipped to `difbajpynz7k4ns1` after ~30s Caddy refresh.

Both deploys confirmed via cache-busting HEAD requests; live content probed via cache-busting GET.

## Net live result

**ALL CYCLE 16 DELIVERABLES LIVE AND VERIFIED.**

- Featured Markets pager with principal-locked first-page order — LIVE.
- Blog date governance — LIVE.
- Per-post hero + OG images — LIVE.
- Fort Lauderdale V2 gold-standard page — LIVE.
- Footer REALTOR®/EHO logo fix — LIVE.
- About credentials/service-area audit + softening — LIVE.
- Forge-fix sitewide overclaim sweep — LIVE.

No regressions observed on any other route.
