# Cycle 38 — Homepage Search → Bridge Wiring Report

date: 2026-05-16

## Final wiring

```
Homepage hero (src/app/page.tsx)
  │ floating search card (src/components/HeroSearch.tsx)
  │   form method=GET action=/home-search/
  │   hidden input source=home-hero
  │   select name=city      (values = MIA_APPROVED_NEIGHBORHOODS[*].label)
  │   select name=minPrice  (values = "" | "600000" | "1000000" | "2000000" | "3000000" | "5000000")
  │   select name=beds      (values = "" | "2" | "3" | "4" | "5")
  │
  ▼ user clicks "Search Listings"
  │
/home-search/  (src/app/home-search/page.tsx)
  │  static export route; renders <BridgeSearch /> client component
  │
  ▼  on mount
  │
BridgeSearch (src/components/bridge/BridgeSearch.tsx)
  │  useEffect → parseInitialQueryFromUrl()
  │    - city: accept label OR slug; map slug→label via MIA_APPROVED_NEIGHBORHOODS
  │    - minPrice: parse Number, ignore non-positive
  │    - beds: parse Number, ignore negative
  │  if hasMeaningful → setQuery + searchListings(..., AbortController.signal)
  │
  ▼
searchListings (src/lib/bridge-client.ts)
  │  Mode resolution: getBridgeRuntimeStatus()
  │    - live   : real Bridge IDX feed
  │    - demo   : Bridge test fixture
  │    - fallback: NEXT_PUBLIC_BRIDGE_DEMO=true → curated fixture
  │  Returns { listings, total, mode, error? }
  │
  ▼
BridgeSearch render
  │  Demo banner shown when mode in { demo | fallback }, or BRIDGE_DEMO_MODE=true.
  │  Fixture attribution / Live attribution branches as before.
```

## Param translation rationale

| Hero field | Hero `name` | Hero value space | BridgeSearch consumes |
|------------|-------------|------------------|------------------------|
| Neighborhood | `city` | LABEL (e.g. "Fort Lauderdale") | `city` (label compared to `MIA_APPROVED_NEIGHBORHOODS[*].label`) |
| Min price | `minPrice` | integer USD | `minPrice: number` |
| Bedrooms | `beds` | integer | `beds: number` |
| Analytics | `source` | "home-hero" | (ignored by Bridge, kept in URL for analytics) |

Slug→label resilience: BridgeSearch's `parseInitialQueryFromUrl` accepts either form, so if some future caller emits `city=fort-lauderdale` instead of `city=Fort%20Lauderdale`, the search still works.

## What is honest about this wiring

- The Bridge mode shown on `/home-search/` after a homepage submit is **the same mode shown on a direct visit** — there is no demo-hiding logic.
- The demo banner / IDX attribution stays visible whenever the runtime is not in proven-live mode.
- The form is plain HTML GET — works with JS disabled (the homepage will navigate to /home-search/?…); auto-search activates only on the client-rendered Bridge page.
- The hidden `source=home-hero` param is purely analytics; it never bypasses any mode gate.

## What this wiring does NOT do

- Does not change which Bridge dataset is served — that is a Dokploy `NEXT_PUBLIC_BRIDGE_*` build-arg decision (see `bridge-referrer-domain-retest.md` and `bridge-live-integration-report.md`).
- Does not validate Bridge live mode. Live-mode classification is performed against the deployed staging in Phase 6.
- Does not modify production `miasanabria.com`.

## Test plan

Local (built static export):
- `bun run build` produces `out/index.html` and `out/home-search/index.html`.
- `bun run audit:home-bridge-search` exercises the static HTML.
- Manual: open `http://127.0.0.1:<port>/?…` then `/home-search/?city=Fort%20Lauderdale&minPrice=1000000&beds=3&source=home-hero` and confirm BridgeSearch auto-runs.

Live staging (post-deploy):
- `bun run audit:home-bridge-search --base=https://miasanabriarealtor.trueidea.com`
- Capture screenshots at 375 / 768 / 1280 / 1440 viewports.
