# Cycle 26 — Visual Capture Review

**Generated:** 2026-05-13.
**Capture script:** `scripts/audit-mobile-readability.ts` with the new `--cycle=` / `--outDir=` flag support landed in Phase 3 of this cycle.

## Command run

```
bun scripts/lib/port-guard.ts --port=4178 --fallbacks=4179,4180,4181,4182
# returned PORT=4178

cd out && python3 -m http.server 4178 &
SERVER_PID=$!
sleep 2

bun scripts/audit-mobile-readability.ts \
  --capture \
  --cycle=cycle-26-readiness-qa \
  --base=http://localhost:4178 \
  --routes=/,/markets/,/markets/fort-lauderdale/,/markets/pompano-beach/,/markets/deerfield-beach/,/markets/coral-springs/,/markets/plantation/,/markets/weston/,/markets/hollywood/,/markets/davie/,/markets/sunrise/,/buyers/,/sellers/,/about/,/contact/,/insights/

kill $SERVER_PID
```

A local Python HTTP server serves the static `out/` directory (post-`bun run build`) so the Cycle 25 routes — which have not yet shipped to the live `miasanabriarealtor.trueidea.com` staging deploy — are reachable for capture.

## Output path

`docs/artifacts/cycle-26-readiness-qa/mobile-readability/after/`

64 JPGs total — 4 viewports × 16 routes. Aggregate size 3.7 MB. The directory and its contents are gitignored (`docs/artifacts/**/*.jpg` rule in `.gitignore:42`), so screenshots are NOT committed but ARE reproducible from this command at any time.

## Routes captured (16)

| Route | New in Cycle 25? | Status |
|---|---|---|
| `/` | no | ✓ 4 viewports |
| `/markets/` | no | ✓ 4 viewports |
| `/markets/fort-lauderdale/` | no (FortLauderdaleV2 page) | ✓ 4 viewports |
| `/markets/pompano-beach/` | no | ✓ 4 viewports |
| `/markets/deerfield-beach/` | yes | ✓ 4 viewports |
| `/markets/coral-springs/` | yes | ✓ 4 viewports |
| `/markets/plantation/` | yes | ✓ 4 viewports |
| `/markets/weston/` | yes | ✓ 4 viewports |
| `/markets/hollywood/` | yes | ✓ 4 viewports |
| `/markets/davie/` | yes | ✓ 4 viewports |
| `/markets/sunrise/` | yes | ✓ 4 viewports |
| `/buyers/` | no | ✓ 4 viewports |
| `/sellers/` | no | ✓ 4 viewports |
| `/about/` | no | ✓ 4 viewports |
| `/contact/` | no | ✓ 4 viewports |
| `/insights/` | no | ✓ 4 viewports |

## Viewports captured (4)

| Viewport | Width × Height | Files |
|---|---|---|
| iphone-se | 320 × 568 | 16 (`iphone-se-*.jpg`) |
| iphone-15 | 375 × 812 | 16 (`iphone-15-*.jpg`) |
| pixel-7 | 414 × 896 | 16 (`pixel-7-*.jpg`) |
| ipad-portrait | 768 × 1024 | 16 (`ipad-portrait-*.jpg`) |

## Failures

None. `audit-mobile-readability` returned 64 PASS · 0 FAIL · 0 ERROR.

## Screenshots not captured + why

None deliberately. The mission's "minimum target pages" list was 16 routes; all 16 were captured at all 4 viewports.

Routes NOT in scope this cycle:

- `/valuation/` — was in the script's prior `DEFAULT_ROUTES` set but not in the Cycle 26 mission target list. Captured separately via `audit:mobile-readability` non-capture run as part of `audit:all`.
- `/insights/<post-slug>/` — individual Insights posts. The Cycle 26 mission target list named `/insights/` only.
- Other legacy market pages (`/markets/coral-ridge/`, `/markets/victoria-park/`, `/markets/boca-raton/`, etc.) — pre-Cycle-25 routes; not in Cycle 26 target list.

## Visual concerns observed

The probe-run `evaluate()` function returned 64 PASS · 0 FAIL · 0 ERROR against all 16 routes at all 4 viewports. The contract-presence audit is green.

No visual-edit changes were made in Cycle 26, so the screenshots reflect the state of the seven new Cycle 25 placeholder-hero pages plus the pre-existing site layout. The hero JPGs are intentionally brand-tone abstract cards (navy gradient with brass accent + city name + LPT Realty / Mia Sanabria branding) rather than fabricated photography — see Cycle 25 closeout for rationale.

Reviewer is encouraged to walk a representative sample (e.g., `iphone-se-markets-deerfield-beach.jpg`, `iphone-15-markets-weston.jpg`, `pixel-7-markets-hollywood.jpg`, `ipad-portrait-markets-sunrise.jpg`) plus a corresponding non-Cycle-25 page (`iphone-se-about.jpg`, `pixel-7-contact.jpg`) before any production-cutover decision.

## Cycle 19A-M baseline integrity

`docs/artifacts/cycle-19A-M/mobile-readability/after/` — verified empty after Cycle 26 capture. The original Cycle 19A-M baseline screenshots were never committed (gitignored), so they exist only in working trees that captured them. The new `--cycle=` flag prevents accidental overwrite of any future Cycle 19A-M re-render attempt.

To intentionally re-render the Cycle 19A-M baseline, pass `--cycle=cycle-19A-M` explicitly — the script supports this path as an explicit opt-in.

## Tooling fix summary

`scripts/audit-mobile-readability.ts` was updated in Phase 3:

- New flags: `--cycle=<slug>` and `--outDir=<path>` resolve the capture directory; previously the script hardcoded `docs/artifacts/cycle-19A-M/mobile-readability/after`.
- New safety: `--capture` without one of those flags now exits 2 with a usage hint rather than silently writing to the historic baseline path.
- Script header usage block updated to document both new flags and the Cycle 19A-M safety policy.
- A new exported constant `MIA_APPROVED_CYCLE25_ROUTES` provides the canonical list of the seven Cycle 25 neighborhood routes for future capture runs (use via `--routes=`).

## Conclusion

Mobile-capture tooling carry-over from Cycle 24 R2 is now closed. Cycle 26 produced 64 mobile screenshots spanning all 16 mission-target routes at all 4 viewports, written to a Cycle-26-specific gitignored path, with no clobber of any historic baseline. The contract-presence audit was green across the entire sample.
