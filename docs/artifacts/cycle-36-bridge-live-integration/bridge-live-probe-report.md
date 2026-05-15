# Bridge Live Probe Report

**Generated:** 2026-05-14T20:46Z
**Script:** `scripts/probe-bridge-live.ts` (added this cycle)
**Result JSON:** `bridge-live-probe-result.json`

## Probe outcome (local environment)

| Question | Answer |
|---|---|
| was_request_attempted | **NO** — credentials missing |
| http_status | n/a |
| record_count | 0 |
| sample_classification | `unknown` (probe did not run) |
| is_real_live_feed_proven | **NO — credentials are not in local environment, so a true live probe could not be issued from here** |
| evidence | All `NEXT_PUBLIC_BRIDGE_*` env vars `missing` per `bridge-config-presence-report.md`. The probe correctly short-circuits without attempting a request when `endpointConfigured=false`. |
| errors_redacted | none (no request to error on) |
| next_action | Probe **staging site** directly (Phase 8) — that is where the deployed Bridge bundle's real behavior can be observed. |

## Probe security properties verified

- Did NOT print or persist any token value
- Did NOT echo full request URL
- Did NOT store raw response bodies (would only persist counts + signal classification if a real probe had run)
- Will safely report `errorClass="http_401|403|404"` with redacted-message field if invoked with bad credentials in a future environment
- Returned `endpointConfigured: false` and exited with informative `nextAction` rather than throwing

## How to invoke this probe in a credential-bearing environment

If/when Bridge env vars become available (e.g., on a build host or via `--build-arg`-equivalent local sourcing approved by Mia), a future operator can run:

```bash
bun run scripts/probe-bridge-live.ts                              # default city=Fort Lauderdale, limit=3
bun run scripts/probe-bridge-live.ts --city='Pompano Beach' --limit=5
bun run scripts/probe-bridge-live.ts --status=Active
```

Output classification logic:
- `state == FL` only AND city matches request → `live`
- `state == CA` OR cities include SF/SD signals → `demo` (test_sf / test_sd Bridge fixtures are San Francisco/San Diego)
- empty `value[]` → `empty`
- HTTP error → `error` with redacted error class

## Why this matters

The local probe could not prove or disprove "Bridge is working." That answer must come from staging-site observation (Phase 8) — the only place the deployed bundle, with its baked-in build args, runs against the real Bridge service. The local probe is a tool for the next time credentials are present (e.g., during a controlled credential-bearing investigation that Mia approves).
