---
cycle: 42
artifact: homepage-hero-copy-final-report
generated_at: 2026-05-17
---

# Cycle 42 — Homepage Hero Copy Final Report

```yaml
mission: |
  Remove the implementation-facing helper copy ("Search routes to Mia's
  Bridge-backed Southeast Florida home search...") from the homepage
  floating search card, preserve the Cycle 41 hero layout and Bridge
  wiring, validate, deploy to dev staging, verify live.

cycle: 42
status: complete_live_verified

repo:
  branch: main
  parent_head: e3f2683c9dc6807d891d0573b4384dd81aa422c6   # Cycle 41
  cycle_42_head: 82c70452ceed37c07e0e6f7d48735d6a41c4c833
  origin_main:   82c70452ceed37c07e0e6f7d48735d6a41c4c833
  head_equals_origin_main: true

source_change:
  file: src/components/HeroSearch.tsx
  helper_paragraph:
    before: |
      Search routes to Mia's Bridge-backed Southeast Florida home search.
      Talk with Mia for current comparable sales and the residence
      specifics listings alone cannot tell you.
    after: |
      Begin with an area, price range, and bedroom count. Mia will help
      you interpret the listings, neighborhoods, and details behind the
      search.
  header_docblock:
    note: |
      Rewrote the leading comment to drop "Cycle 38 rewires this surface
      to the Bridge-backed page" prose. Behavior description and param
      contract preserved. No user-facing effect — keeps the new scoped
      audit from snagging on a source comment.

new_audit:
  script: scripts/audit-home-hero-copy.ts
  package_json_entry: '"audit:home-hero-copy": "bun run scripts/audit-home-hero-copy.ts"'
  surfaces_scanned:
    - src/components/HeroSearch.tsx (form <p> + button text only)
    - out/index.html (after build)
    - live https://<base>/?cb=<hex> (only when --base= supplied)
  forbidden_patterns:
    - Search routes to
    - Bridge-backed
    - Search anchors to the Southeast Florida property-search section
    - property-search section
    - listings alone cannot tell you
    - lists alone cannot tell you
    - residence specifics listings
    - participating brokerages

validation_gates:
  local:
    typecheck:                pass
    lint:                     pass
    build:                    pass
    audit:brand:              pass (12 PASS · 0 FAIL)
    audit:hero-contrast:stable pass (145 PASS · 0 FAIL)
    audit:route-inventory:    pass (48 routes reconcile)
    audit:no-fabrications:    pass (0 hits)
    audit:no-old-idx:         pass (481 files scanned)
    audit:home-bridge-search: pass (7/7)
    audit:home-hero-copy:     pass (clean across surfaces)
    audit:mobile-readability: pass (84 PASS · 0 FAIL)
    audit:qa-gate:            pass (critical=0, high=4 readiness register, medium=1)
    home-search-bridge-e2e:   pass (11/11, mode=fallback)
  live:
    audit:home-hero-copy:     pass (3 surfaces clean)
    audit:home-bridge-search: pass (8/8)
    audit:no-old-idx:         pass
    home-search-bridge-e2e:   pass (11/11, mode=demo)
    live_html_bad_copy:       0 occurrences (cache-busted fetch)
    live_html_new_copy:       2 occurrences (SSR + RSC pair)
    live_secret_scan:         clean

deployment:
  staging_base: https://miasanabriarealtor.trueidea.com/
  tmux_session: mia-cycle42-staging-deploy-20260517-123230
  deploy_log: docs/artifacts/cycle-42-homepage-hero-copy-polish/logs/staging-deploy-20260517-123230.log
  exit_code: 0
  dokploy_duration: 114s
  etag_before: '"dil18zdpf3eo53sd"'
  etag_after:  '"dil3wsiarny853qi"'
  last_modified_before: Sun, 17 May 2026 14:48:06 GMT
  last_modified_after:  Sun, 17 May 2026 16:53:14 GMT
  bridge_mode_live: demo

honesty:
  production_cutover_performed: false
  dns_changed: false
  ghl_endpoints_provisioned: false
  bridge_credentials_rotated: false
  bridge_live_feed_proven: false   # mode=demo at staging
  demo_banner_shown_when_appropriate: true
  miasanabriacom_production_touched: false

cycle_42_smarter_ai_closeout:
  earlier_catch: |
    audit:home-hero-copy at scripts/audit-home-hero-copy.ts — this audit
    now exists and would have caught the Cycle 38 introduction of
    "Bridge-backed" in the hero helper text before it ever shipped.
    Cycle 38/39/40/41 all passed audit gates because no scoped audit
    existed for the homepage hero copy specifically.
  pattern_type: system_defect
  smallest_durable_improvement: |
    Scoped audit scripts/audit-home-hero-copy.ts now ships; wired into
    package.json. Will protect against the same defect class on future
    helper-paragraph regressions.
  promotion_target: audit
  bloat_guard: |
    Single new audit script (199 lines) targeted to a single source file
    + build output + optional live surface. Did not extend audit:all (the
    existing audit:all chain is already long); the audit runs explicitly
    in this cycle and is invoked manually or via --base in CI. Future
    cycles may decide whether to fold into audit:all after a few
    regression-prevention runs prove its stability.
  action_taken: |
    added scripts/audit-home-hero-copy.ts + package.json entry, ran clean
    against fresh build + live staging.
  owner_category: tool_process_defect

acceptance_criteria_results:
  1_bad_copy_gone_source_build_live:        true
  2_replacement_copy_production_grade:      true   # operator review remains
  3_hero_remains_visually_improved:         true
  4_homepage_search_still_bridge_wired:     true
  5_old_idx_remains_absent:                 true
  6_validation_gates_pass:                  true
  7_staging_deploy_completes_tmux:          true
  8_live_staging_verified:                  true
  9_final_deployed_commit_equals_origin:    true
  10_no_secrets_printed_committed:          true

next:
  - Mia/operator review of the new helper text at https://miasanabriarealtor.trueidea.com/
  - If accepted, the next smallest mission toward production readiness is
    the qa-gate "high" register (4 items) — separate cycle, separate brief.
  - Production cutover scope remains external (DNS, GHL endpoints,
    Bridge live credentials, USCO/DMCA legal review, Mia sign-off on
    hero visuals).
```
