# Cycle 38 — Bridge Truthfulness Report

date: 2026-05-16

## Truthfulness contract (from the mission brief)

A real Bridge live feed is proven only if **all** of the following are true:

1. Runtime uses Bridge configuration intended for Mia / Southeast Florida.
2. Bridge referrer-domain restrictions include the dev/staging and target production domains.
3. A Bridge request succeeds without exposing tokens.
4. Returned records are non-demo / non-fixture / non-test_sf.
5. Records have plausible listing IDs/addresses/prices/media for the expected geography.
6. UI renders the data without leaking credentials.
7. Demo banner and DEMO badges are absent only in proven-live mode.
8. IDX/MLS disclosure remains visible wherever Bridge listings render.

## Cycle 38 stance

Cycle 38 confirms #2 (referrer-domain update by operator). #1, #3–#5 require Dokploy-side dataset/path configuration that is outside this cycle's authorized writes. Cycle 38 therefore:

- Keeps the Bridge UI in its current Dokploy-configured mode (no `NEXT_PUBLIC_BRIDGE_DEMO` flip).
- Continues to render the demo banner whenever mode ∈ {demo, fallback}.
- Continues to render the IDX/MLS attribution copy on every listing rendering branch.
- Classifies the live-deployed mode honestly in `bridge-staging-final-report.md` after deploy.

## Demo-honesty checks in source

- `src/components/bridge/BridgeSearch.tsx` shows `DemoBanner` when `resultMode === "demo" || resultMode === "fallback" || BRIDGE_DEMO_MODE`. The condition is OR-joined — there is no path where the banner is suppressed because referrer domains are now correct. The only way to remove the banner is to flip BOTH the data-layer mode AND `BRIDGE_DEMO_MODE` — i.e., genuine live data.
- `BridgeListingCard` renders the `DEMO` badge when `demoMode={resultMode !== "live"}` — same logic.
- `FixtureAttribution` and `ListingAttribution` both contain the IDX/MLS Equal-Housing-Opportunity disclosure. The render branches:
  - `mode === "fallback"` → `FixtureAttribution`
  - `mode === "live"` → `ListingAttribution`
  - everything else → `FixtureAttribution` (conservative)

## What I deliberately did not do

- I did not flip `NEXT_PUBLIC_BRIDGE_DEMO` to false hoping the referrer change alone proves live.
- I did not remove any demo-banner code path.
- I did not remove any IDX/MLS disclosure copy.
- I did not rotate or print any Bridge token values.

## Conclusion

Cycle 38 leaves the Bridge truthfulness contract intact. Real live-mode activation remains a future cycle once the Dokploy-side dataset / resource-path / demo flag align AND the staging probe confirms non-fixture records.
