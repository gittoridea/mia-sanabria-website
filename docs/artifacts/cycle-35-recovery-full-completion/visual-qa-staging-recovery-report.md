# Visual QA — Staging Recovery Report

date: 2026-05-14
purpose: Verify the staging surface after the prior-session interrupted deploy classified as `completed_after_disconnect` (see `interrupted-deploy-forensics.md`).

## Tools used

- `curl` with hex cache-buster + `Cache-Control: no-cache` (per `CLAUDE.md`).
- Headless google-chrome capture via `scripts/capture-baseline.ts` (Cycle 10 substrate). 36 routes × 2 viewports = 72 screenshots, **72/72 OK, 0 failures, 51s total**.
- `bun run audit:mobile-readability --base=https://miasanabriarealtor.trueidea.com` — full staging mobile-readability run.

## Answers to required questions

| Question | Result |
|---|---|
| Did `/` show "South Florida Lifestyle"? | **Yes** (live HTML grep) |
| Did `/home-search/` show "Home Search" / "Search available homes"? | **Yes** (both needles present) |
| Did Bridge demo honesty remain visible if demo data rendered? | **Confirmed indirectly** — `data-brand-exception="demo-warning"` exists in three source spots (DemoBanner, error warning, listing-card DEMO badge). Bridge feed is in demo mode (per Cycle 33B substrate), so the warning surfaces wherever Bridge UI is mounted. Production HTML inspected in `/home-search/` captures shows the live demo banner copy preserved. |
| Did LPT Realty attribution remain visible? | **Yes** (matched on `/` and `/home-search/`) |
| Were any secrets visible in HTML? | **No** — secret-safety grep across the 23 captured HTML files returned zero hits for `BRIDGE_SERVER_TOKEN`, `BRIDGE_CLIENT_SECRET`, `GOOGLE_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `access_token=`, `refresh_token=`, `Bearer …`, `DOKPLOY_API_TOKEN`. |
| Were all tested routes HTTP 200? | **Yes** — 23/23 (approved + reference neighborhoods + core + legal + utility). |
| Were screenshots captured? | **Yes** — 72/72 PNGs under `docs/artifacts/cycle-35-recovery-full-completion/visual-qa/staging-recovery/`. |

## Staging HTTP fingerprint (single coherent deploy bundle)

All routes share the same `last-modified` and the same ETag-prefix `diijwdedso3k…`. This is the signature of a single completed deploy, served by Caddy after the etag flipped — the deploy survived the SSH disconnect.

```
last-modified: Thu, 14 May 2026 16:46:59 GMT
cache-control: public, max-age=300, s-maxage=600, must-revalidate
```

## Mobile-readability on staging

```
audit-mobile-readability — 84 PASS · 0 FAIL · 0 ERROR
```

7 devices (pixel-7 + ipad-portrait among them) × 12+ routes; all green.

## Screenshot inventory

```
docs/artifacts/cycle-35-recovery-full-completion/visual-qa/staging-recovery/
  72 PNGs (36 routes × 375x812 + 1280x800)
  _capture-summary.json (ok=72, fail=0)
```

Screenshots include:
- `/` × 2
- `/home-search/` × 2
- `/markets/` × 2
- All 23 `/markets/<slug>/` routes × 2
- `/buyers/`, `/sellers/`, `/about/`, `/contact/`, `/valuation/`, `/insights/` × 2
- `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/` × 2
- `/404` × 2

## Verdict

Staging is healthy post-disconnect. No corrective redeploy required at this stage. Cycle 35B may proceed to Phase F (neighborhood implementation audit) without re-running the deploy step.
