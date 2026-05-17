---
cycle: 42
artifact: staging-live-verification-report
generated_at: 2026-05-17
---

# Cycle 42 — Staging Live Verification Report

```yaml
staging_base: https://miasanabriarealtor.trueidea.com
deployed_commit: 82c70452ceed37c07e0e6f7d48735d6a41c4c833
origin_main: 82c70452ceed37c07e0e6f7d48735d6a41c4c833
deployed_commit_equals_origin_main: true

bad_copy_removed_live: true
bad_copy_live_matches:
  home.html:
    "Search routes to Mia":       0
    "Bridge-backed":              0
    "Search anchors":             0
    "property-search section":    0
    "listings alone cannot tell you": 0
    "residence specifics listings":   0
    "participating brokerages":   0
new_copy_visible_or_removed: visible
  "Begin with an area" count on live homepage: 2   # SSR + RSC inline payload pair

homepage:
  hero_layout_still_passes: true
  search_card_still_integrated: true
  visual_description: |
    Live screenshots at 1280 and 1440 show the waterfront hero image as
    the visual anchor, the dark navy panel narrower than image, and the
    floating search card with the new helper paragraph rendered cleanly
    below the four-control row. At 375 the panel-over-image mobile
    state is unchanged from Cycle 41 baseline (intrinsic mobile
    constraint, not a Cycle 42 regression). 768 tablet shows the
    two-up form layout activated, helper paragraph in the same slot.

bridge:
  mode: demo
  e2e_pass: true   # 11/11 PASS, mode=demo
  demo_honesty_correct_if_needed: true   # banner renders demo language

old_idx_absent: true   # audit:no-old-idx local PASS 481 files
                        # live home.html grep: no IDX / Matrix markers
                        # audit:home-bridge-search live PASS 8/8 including home_no_old_idx

secret_scan_clean: true   # live HTML grep returned zero secret-shaped values

final_result: live_verified
```

## Headers comparison (live-before → live-after)

| Header | Live-before (Cycle 41 build) | Live-after (Cycle 42 build) | Delta |
|---|---|---|---|
| etag (home) | `"dil18zdpf3eo53sd"` | `"dil3wsiarny853qi"` | changed ✓ |
| last-modified (home) | `Sun, 17 May 2026 14:48:06 GMT` | `Sun, 17 May 2026 16:53:14 GMT` | advanced 2h05m ✓ |
| content-length (home) | not captured in live-before run | 238,122 | n/a |

The etag flip is the deploy-flip signal per the project CLAUDE.md cache+verify rule. Confirmed against `https://miasanabriarealtor.trueidea.com/?cb=<hex>` with `Cache-Control: no-cache` headers.

## Live audit results (run with --base=<staging>)

```yaml
audit:home-hero-copy:
  surfaces_scanned: 3   # source + out/ + live
  exit_code: 0
  result: clean

audit:home-bridge-search:
  exit_code: 0
  sub_checks: 8/8 PASS
  notable: home_no_old_idx PASS, home_form_filter_inputs city+minPrice+beds PASS

audit:no-old-idx: clean (live HTML has no IDX runtime markers)
```

## Bridge live E2E

```
$ bun run scripts/test-home-search-bridge-e2e.ts --base=https://miasanabriarealtor.trueidea.com
home-search-bridge-e2e: 11/11 PASS, 0 FAIL, mode=demo
exit 0
```

Mode=demo at staging — the dev Dokploy is provisioned with Bridge in test-dataset/demo mode. The `BridgeSearch` component renders the demo banner ("Demo data — Bridge test fixture connected.") truthfully. Cycle 42 did not touch any Bridge configuration; this mode is identical to what the dev service rendered before Cycle 42.

## Files

- live-after HTML: `docs/artifacts/cycle-42-homepage-hero-copy-polish/live-after/html/`
- live-after screenshots: `docs/artifacts/cycle-42-homepage-hero-copy-polish/live-after/screenshots/` (gitignored, 15 PNGs at 3 routes × 5 viewports)
- live-after capture log: `docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/live-after-capture.log`

## Verdict

Live staging at `https://miasanabriarealtor.trueidea.com/` reflects the Cycle 42 commit (`82c7045`) cleanly. Every hard acceptance criterion in `goal-stack.md` is satisfied.
