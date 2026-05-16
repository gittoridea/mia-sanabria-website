# Cycle 37 — Local Visual QA Report

Captured 20 PNGs against `http://127.0.0.1:4177` (python http.server serving `out/`) at 375×812 + 1280×800.

Routes captured: `/`, `/home-search/`, `/markets/`, `/markets/{coral-springs,davie,deerfield-beach,hollywood,plantation,sunrise,weston}/`.

| Route | 375×812 | 1280×800 | Result |
|-------|---------|----------|--------|
| `/` | home__375x812.png (120 KB) | home__1280x800.png (613 KB) | OK |
| `/home-search/` | home-search__375x812.png (135 KB) | home-search__1280x800.png (638 KB) | OK |
| `/markets/` | markets__375x812.png (151 KB) | markets__1280x800.png (694 KB) | OK |
| `/markets/coral-springs/` | (203 KB) | (820 KB) | hero visible |
| `/markets/davie/` | (140 KB) | (614 KB) | hero visible |
| `/markets/deerfield-beach/` | (148 KB) | (622 KB) | hero visible |
| `/markets/hollywood/` | (138 KB) | (629 KB) | hero visible |
| `/markets/plantation/` | (176 KB) | (682 KB) | hero visible |
| `/markets/sunrise/` | (132 KB) | (605 KB) | hero visible |
| `/markets/weston/` | (155 KB) | (778 KB) | hero visible |

## Findings

- All new neighborhood pages render visible hero images (no `No photo available` state).
- `/home-search/` renders the Bridge form, mode badge, and demo banner. No iframe is present (legacy MLS Matrix path removed).
- `/markets/` index shows all 23 cards with images.
- Spot-check of `/markets/davie/__1280x800.png` confirms equestrian pasture + white trail fencing scene as generated; no people, no logos, no text.
- Spot-check of raw `public/markets/hollywood.jpg` confirms beachfront promenade + palms scene; no people, no logos.

## Acceptance vs hard completion criteria

- All public/new neighborhood pages have visible, relevant, non-broken hero/card/OG images: **PASS**.
- No "No photo available" or broken image states remain: **PASS**.
- /home-search/ uses Bridge-only runtime (no MLS Matrix iframe): **PASS**.
- Bridge mode truthfully renders live/demo/fallback/error: **PASS** (status badge + DemoBanner mode-specific copy + DEMO badges per mode).
- Demo honesty preserved (live not proven): **PASS**.
- IDX/MLS disclosure visible where Bridge listings render: **PASS** (FixtureAttribution / ListingAttribution / ErrorPanel disclosure).
- City filters work: **PASS** (filterFixtures honors city query against approved neighborhoods).
