# Cycle 40B — Bridge Truthfulness Report

```yaml
date: 2026-05-17T01:00Z

env_state_on_host:
  BRIDGE_SERVER_TOKEN: missing
  BRIDGE_CLIENT_SECRET: missing
  BRIDGE_CLIENT_ID: missing
  BRIDGE_DATASET_ID: missing
  NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN: missing
  BRIDGE_BROWSER_TOKEN: missing
  consequence: BridgeSearch on /home-search/ renders in demo/fallback mode

local_test_result:
  command: bun run test:home-bridge-e2e --base=http://127.0.0.1:4211
  result: 11/11 PASS, 0 FAIL, mode=fallback
  meaning: |
    "fallback" mode is the explicit honest mode when neither live Bridge
    feed nor sample fixtures can be exercised. Per the Cycle 33 + 37
    Bridge architecture: live-mode requires BRIDGE_* creds, demo-mode
    uses bundled sample fixtures, fallback-mode is the honest "no data
    feed proven" surface. The test passes ALL contract checks against
    fallback mode — it's the most honest state when creds aren't proven.

staging_expected_mode: |
  When deployed to https://miasanabriarealtor.trueidea.com/, the
  container env may have BRIDGE_* creds (per prior cycles, Torrey
  configured these in Dokploy). In that case, mode=live is the expected
  result. If creds are still not configured in the container env,
  mode=demo or mode=fallback is the honest result. The cycle 40B work
  did NOT touch Bridge wiring, so behavior is identical to Cycle 39.

audit_old_idx:
  command: bun run audit:no-old-idx
  result: PASS — 480 files scanned, 0 old-IDX markers found
  evidence: |
    Cycle 37 removed the legacy sef.mlsmatrix.com IDX iframe. Cycle 40B
    preserves that removal. Search continues to route through BridgeSearch
    on /home-search/ exclusively.

audit_home_bridge_search:
  command: bun run audit:home-bridge-search
  result: PASS — 8/8 checks
  checks:
    - home_form_action_home_search: PASS
    - home_form_source_hidden: PASS
    - home_form_filter_inputs: PASS (city + minPrice + beds all present)
    - home_form_legacy_action_absent: PASS (no /markets/#property-search action)
    - home_no_old_idx: PASS
    - home_floating_marker: PASS
    - home_search_bridge_form: PASS (/home-search/ exposes BridgeSearch surface)
    - home_search_no_old_idx: PASS

what_cycle_40b_did_NOT_change:
  - Bridge wire-up in src/components/BridgeSearch* (unchanged)
  - Bridge configuration in src/lib/bridge.ts (unchanged)
  - BRIDGE_* env var definitions in next.config.ts or Dockerfile (unchanged)
  - The /home-search/ page implementation (unchanged)
  - The Bridge demo-mode honesty UI on /home-search/ (unchanged)
  - Cycle 37 old-IDX removal (preserved)

bridge_credential_rotation: NONE
bridge_credential_touch: NONE
production_bridge_touch: NONE
```

## Honesty doctrine preserved

Per Cycle 33B and Cycle 37 doctrine: Bridge runs in the most honest mode
it can prove. The Cycle 40B commit doesn't touch Bridge wiring at all —
the test:home-bridge-e2e + audit:home-bridge-search results above are
identical to Cycle 39's results, confirming behavior parity.

If staging deploys with BRIDGE_* creds in the container env, the live
test on the deployed surface will show mode=live or mode=demo
(whichever Mia's data feed actually proves). If creds aren't in the
container env, mode=fallback honestly indicates "no feed proven."

The "Bridge demo bar" / "DEMO listings shown" UI marker on /home-search/
is the operator-facing honesty indicator; it shows whichever mode the
runtime actually proves.
