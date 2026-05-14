# Cycle 34 — Visual QA Report

> Phase 15 deliverable. Real-browser capture of 10 routes × 2 viewports = 20 screenshots, via Playwright 1.58.0 + Chromium headless-shell against locally-served static build (`out/` on `http://127.0.0.1:4188`). Screenshots saved under `visual-qa/`.

## Tool used

Playwright **1.58.0** CLI (Chromium headless-shell v1208, Chrome 145.0.7632.6). See `visual-qa-tool-install.md`.

## Viewports

- `mobile-375` — 375 × 812 (iPhone X / 13 mini / 14 size class)
- `desktop-1280` — 1280 × 800 (small-laptop / 13" MBP)

## Routes captured

| # | Route | Mobile | Desktop |
|---|---|---|---|
| 1 | `/` | ✓ `home__mobile-375.png` | ✓ `home__desktop-1280.png` |
| 2 | `/home-search/` | ✓ `home-search__mobile-375.png` | ✓ `home-search__desktop-1280.png` |
| 3 | `/markets/` | ✓ `markets__mobile-375.png` | ✓ `markets__desktop-1280.png` |
| 4 | `/markets/fort-lauderdale/` | ✓ `market-fort-lauderdale__mobile-375.png` | ✓ `market-fort-lauderdale__desktop-1280.png` |
| 5 | `/markets/hollywood/` | ✓ `market-hollywood__mobile-375.png` | ✓ `market-hollywood__desktop-1280.png` |
| 6 | `/buyers/` | ✓ `buyers__mobile-375.png` | ✓ `buyers__desktop-1280.png` |
| 7 | `/sellers/` | ✓ `sellers__mobile-375.png` | ✓ `sellers__desktop-1280.png` |
| 8 | `/about/` | ✓ `about__mobile-375.png` | ✓ `about__desktop-1280.png` |
| 9 | `/contact/` | ✓ `contact__mobile-375.png` | ✓ `contact__desktop-1280.png` |
| 10 | `/insights/` | ✓ `insights__mobile-375.png` | ✓ `insights__desktop-1280.png` |

20 / 20 captures succeeded. No `pageerror` recovered.

## Key findings — homepage `/`

- **Eyebrow renders `SOUTH FLORIDA LIFESTYLE`** at mobile (brass tracking, uppercase) — locked direction satisfied.
- **Heading renders two-line `South Florida Lifestyle / Home Search`** at mobile and desktop — readable, no clip at 375.
- **Primary CTA `Search available homes` with chevron** renders fully inside the hero copy panel on mobile-375 — meets above-fold rule from `page-architecture.md`. Tap target visually clears 44 px.
- **Secondary CTA `Talk with Mia`** renders directly below the primary on mobile; side-by-side on desktop.
- **Background image** (`/markets/fort-lauderdale.jpg`) renders with the navy gradient overlay; copy is legible against the photo (existing `audit:hero-contrast` enforces this).

## Key findings — `/home-search/`

- **Eyebrow renders `SOUTH FLORIDA LIFESTYLE`** — locked direction satisfied.
- **Heading `Home Search`** — single-line, fits cleanly at mobile.
- **Primary CTA `Search available homes`** — anchor jump to `#listing-search`. Works in-page (verified via local serve).
- **Secondary CTA `Talk with Mia`** — destination `/contact/?source=home-search` preserved.
- **Bridge demo banner** rendered by `<BridgeSearch />` component below the hero — demo-mode honesty preserved.

## Key findings — neighborhood detail pages

- `/markets/fort-lauderdale/` desktop hero renders cleanly; Place + RealEstateAgent + Breadcrumb + FAQPage schema baked into HTML.
- `/markets/hollywood/` (Cycle 25 placeholder) hero image renders, slightly muted (placeholder character). Page is shorter than `fort-lauderdale` — expected, since the Hollywood `Market` entry has less editorial copy. Documented in `remaining-blockers.md` (Mia copy outstanding).

## Key findings — other routes

- `/buyers/`, `/sellers/`, `/about/`, `/contact/`, `/insights/`, `/markets/` all render their existing approved hero + sub + CTAs. No regressions from this cycle's two edits.
- No `<script>` errors observed in any console capture.
- No off-topic hero imagery surfaced.

## Anti-findings

- **No demo banner on non-Bridge pages** — verified.
- **No Bridge token strings in static HTML** — verified by `grep -REniE "BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|access_token=|Bearer "` against `out/` — 0 hits.
- **No fake testimonials in HTML** — `audit:no-fabrications` 0 hits.
- **No stale-term hits in built output** — `audit:stale` clean.

## Limitations of this QA pass

- **Local static build** (`out/`) served via `python3 -m http.server`, not the staging Dokploy host. Production-specific behavior (Caddy headers, ETag, Dokploy deploy-flip) was not exercised in this pass.
- **Two viewports only** (375, 1280). The brief listed 320 / 375 / 414 / 768 as suggested mobile targets — the project's existing `audit:mobile-readability` already covers 320 / 375 / 414, so this pass focused on 375 (representative mobile) + 1280 (representative desktop).
- **`wait-for-timeout=800`** gives lazy-loaded sections (insights, IDX) limited time to render. The headline-fold material is captured correctly.

## Recommendation

Next cycle: run `bun run audit:mobile-readability:capture` for the full 320 / 375 / 414 mobile triplet under the project's existing capture script, and update `docs/artifacts/cycle-<id>/mobile-readability/{before,after}/`.

---

Generated 2026-05-14 by Cycle 34 Phase 15.
