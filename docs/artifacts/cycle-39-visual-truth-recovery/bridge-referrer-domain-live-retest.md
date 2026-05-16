# Cycle 39 — Bridge Referrer-Domain Live Retest

date: 2026-05-16

## What this cycle did (sanitized)

Cycle 38 brief recorded: "Operator confirmed referrer-domain restriction
list includes the 3 target domains" — meaning that one external blocker
was removed. Cycle 39 treats this as confirmation that the referrer-domain
gate would not be the failure cause if Bridge live mode were activated.

Cycle 39 did NOT:
- Echo or capture any token value.
- Mutate Dokploy build args.
- Rotate any Bridge credential.
- Probe Bridge with an authenticated request from this workstation.

## Sanitized config presence check (workstation)

```
node -e 'for (const k of [
  "BRIDGE_SERVER_TOKEN","BRIDGE_CLIENT_SECRET","BRIDGE_CLIENT_ID",
  "BRIDGE_DATASET_ID","NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN","BRIDGE_BROWSER_TOKEN",
  "NEXT_PUBLIC_BRIDGE_DATASET_ID","NEXT_PUBLIC_BRIDGE_DEMO",
  "NEXT_PUBLIC_BRIDGE_RESOURCE_PATH"
]) console.log(k, process.env[k] ? "present" : "missing")'
```

Result (workstation env, NOT Dokploy build args):

```
BRIDGE_SERVER_TOKEN              missing
BRIDGE_CLIENT_SECRET             missing
BRIDGE_CLIENT_ID                 missing
BRIDGE_DATASET_ID                missing
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN missing
BRIDGE_BROWSER_TOKEN             missing
NEXT_PUBLIC_BRIDGE_DATASET_ID    missing
NEXT_PUBLIC_BRIDGE_DEMO          missing
NEXT_PUBLIC_BRIDGE_RESOURCE_PATH missing
```

Local build mode is therefore `fallback` (correct — no credentials at
build).

## Expected staging classification (without changes this cycle)

Per Cycle 38 staging probe (unchanged this cycle):

```
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN  present  # operator-set in Dokploy
NEXT_PUBLIC_BRIDGE_DATASET_ID     present  # set to test_sf (Bridge test dataset)
NEXT_PUBLIC_BRIDGE_DEMO           true     # forces demo mode
NEXT_PUBLIC_BRIDGE_RESOURCE_PATH  present  # idx/Properties
dataset_classification:           test_sf
resource_path_classification:     idx/Properties
referrer_domains_operator_confirmed_all_3: true
```

Cycle 39 staging probe (Phase 12) will re-classify after deploy.

## Truthfulness rule honored

Bridge mode is `demo` (test_sf dataset + DEMO=true) until and unless ALL
of the following operator-side changes land in Dokploy:

1. `NEXT_PUBLIC_BRIDGE_DATASET_ID` flipped from `test_sf` to the live
   Southeast Florida MLS dataset.
2. `NEXT_PUBLIC_BRIDGE_DEMO` removed or set to `false`.
3. Bridge IDX feed approval finalized for Mia / LPT Realty / SEF MLS.
4. Dokploy redeploy.

Cycle 39 does NOT claim live activation. Demo honesty preserved
unconditionally.

## What Cycle 39 contributes net-new on the Bridge axis

- E2E proof that the homepage → /home-search/ → BridgeSearch param
  consumption → result render path works under real JS execution
  (`scripts/test-home-search-bridge-e2e.ts`, 11/11 PASS local). Cycle 38
  explicitly deferred this proof.
- Confirmation that `data-bridge-runtime-mode` is rendered (one of
  live | demo | fallback | error) for every code path, enabling unambiguous
  staging classification.

## What Cycle 39 does NOT touch

- No token values written to source, transcript, or commits.
- No Dokploy build-arg mutations.
- No Bridge credential rotation.
- No Bridge OData call from this workstation against a non-public dataset.
