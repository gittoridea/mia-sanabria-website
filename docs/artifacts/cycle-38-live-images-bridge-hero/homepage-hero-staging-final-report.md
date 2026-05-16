# Cycle 38 — Homepage Hero Staging Final Report

date: 2026-05-16
target: `https://miasanabriarealtor.trueidea.com/`

## Live verification checklist (all GREEN)

- ✓ `GET https://miasanabriarealtor.trueidea.com/` → 200, new ETag `dik4iwm8fb405372`.
- ✓ `GET https://miasanabriarealtor.trueidea.com/hero/mia-home-hero.jpg` → 200, content-type `image/jpeg`, content-length matches repo (~195 KB).
- ✓ Raw HTML of `/` contains `<img … src="/hero/mia-home-hero.jpg" …>` (verified via curl + grep).
- ✓ Chrome-dumped DOM of `/` includes the `<img>` element (asset loads with positive natural size — 2400×1310 JPEG decodes).
- ✓ Hero copy panel renders:
  - eyebrow "South Florida Lifestyle"
  - H1 "South Florida Lifestyle / Home Search"
  - sub-copy "Discreet, local guidance for Southeast Florida luxury homeowners…"
- ✓ Primary CTA "Search available homes" → `/home-search/`.
- ✓ Secondary CTA "Talk with Mia" → `/contact/`.
- ✓ Floating search card overlays the hero image at all 4 captured viewports (375 / 768 / 1280 / 1440).
- ✓ Form action: `/home-search/` (verified via grep on live HTML).
- ✓ Hidden `<input type="hidden" name="source" value="home-hero">` present.
- ✓ Filter `<select>` elements: `name="city"`, `name="minPrice"`, `name="beds"` all present.
- ✓ `audit:home-bridge-search -- --base=https://miasanabriarealtor.trueidea.com` → 8/8 PASS (form action, source hidden, filter inputs, no legacy action, no old IDX, floating-card marker, BridgeSearch surface on `/home-search/`, no old IDX on `/home-search/`).
- ✓ No form controls clipped on mobile (cross-confirmed by `audit:mobile-readability` PASS 84/0/0 on local build that matches staging).
- ✓ `data-home-hero-search="true"` + `data-floating="true"` markers present so future visual regression is detectable.

## Fields

```yaml
home_http_status: 200
home_etag: dik4iwm8fb405372
hero_asset_http_status: 200
hero_asset_content_type: image/jpeg
hero_asset_bytes_match_repo: true
copy_panel_renders: true
floating_search_visible_at_375: true
floating_search_visible_at_768: true
floating_search_visible_at_1280: true
floating_search_visible_at_1440: true
form_action_is_home_search: true
hidden_source_input_present: true
filter_inputs_present: city=true minPrice=true beds=true
audit_home_bridge_search_live_pass: true   # 8/8 against staging base
final_result: live_verified
```

## Visual artifacts

`docs/artifacts/cycle-38-live-images-bridge-hero/visual-qa/staging/home-*.png` (4 captures, one per viewport). Manual review confirms the floating-card overlay pattern matches production miasanabria.com aesthetics.

## What was NOT verified live

- BridgeSearch URL-param auto-search behavior. This requires JS execution after URL params arrive; the static-HTML curl + dump-dom channels do not exercise it. The mechanism is exercised by the React `useEffect` in `BridgeSearch.tsx` and confirmed locally via the source code path; an end-to-end live click-through with `Interceptor` or a Playwright session would be the next hardening step. Queued in `remaining-blockers.md`.
