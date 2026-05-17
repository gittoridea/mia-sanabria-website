---
cycle: 42
artifact: goal-stack
generated_at: 2026-05-17
---

# Cycle 42 — Goal Stack

## Topline

Replace the implementation-facing homepage hero helper copy ("Search routes to Mia's Bridge-backed Southeast Florida home search...") with production-grade language (or remove it entirely if the card reads stronger without it). Preserve the Cycle 41 hero geometry and Bridge search wiring. Validate, deploy to dev staging, verify live at `https://miasanabriarealtor.trueidea.com/`. Do not claim production readiness.

## Hard acceptance criteria (verbatim from brief)

1. Wrong helper text gone from source, build output, and live staging — both variants:
   - "Search routes to Mia's Bridge-backed Southeast Florida home search. Talk with Mia..."
   - "Search anchors to the Southeast Florida property-search section..."
2. Replacement helper copy is production-grade (or paragraph removed).
3. Homepage hero remains visually improved (Cycle 41 layout preserved).
4. Homepage search remains Bridge-wired (form action `/home-search/`, params city / minPrice / beds / source=home-hero, E2E green).
5. Old IDX remains absent.
6. All validation gates pass (typecheck, lint, build, audit:brand, audit:hero-contrast:stable, audit:no-old-idx, audit:home-bridge-search, audit:home-hero-copy, audit:qa-gate critical=0).
7. Staging deploy completes under tmux/logged mode.
8. `https://miasanabriarealtor.trueidea.com/` is verified live after deploy.
9. Final deployed runtime commit equals `origin/main`; second alignment deploy if post-deploy docs commit occurs.
10. No secrets printed, committed, logged, or exposed.

## Replacement copy candidates

| Option | Text |
|---|---|
| A — Brief preferred | Start with Mia's approved service areas, then continue to the full Home Search page for available listings and a private conversation about the homes that fit. |
| B — Shorter | Choose an area and price range to begin. Mia can help you compare the homes, streets, and details that matter most. |
| C — Most polished (brief recommended) | Begin with an area, price range, and bedroom count. Mia will help you interpret the listings, neighborhoods, and details behind the search. |
| D — Remove paragraph entirely | (none — card stands on its own) |

**Selected:** Option C. Rationale: matches the actual control surface (area + price + bedrooms are the three real inputs in the card), reads consumer-facing, sounds like Mia's brand, no implementation language. Final selection re-confirmed after local screenshots.

## Out of scope (explicit)

- No production cutover, no DNS, no Cloudflare cache work, no GHL endpoint provisioning, no Bridge credential rotation, no token printing.
- No Mia visual approval (her review surface remains the dev URL).
- No Cycle 41 hero geometry changes beyond the helper paragraph.
- No edits to other pages' use of "current comparable sales" or related legitimate luxury-real-estate phrasing — Cycle 42's scope is strictly the homepage hero search-card helper paragraph and the supporting audit guard.

## Stop conditions

- A real secret-shaped string lands in a staged diff → stop, restore.
- Build fails after the edit → stop, fix the build, don't push a broken main.
- Live HTML after deploy still contains the bad copy → re-edit + re-deploy, do not close out.
- Deploy log shows a non-zero EXIT_CODE → fix root cause, do not retry blindly.

## Doneness signal

`https://miasanabriarealtor.trueidea.com/` returns a homepage HTML payload where (a) neither bad copy variant appears, (b) Option C copy is visible (or the paragraph is intentionally absent), (c) form action is `/home-search/`, (d) Bridge E2E passes, (e) hero layout passes 320/375/390/768/1280/1440 inspection, AND deployed commit equals `origin/main` HEAD.
