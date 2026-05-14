# Cycle 34 — Future Roadmap

> Phase 18 deliverable. AI-closeable + operator-required items grouped by phase.

## Next AI-closeable cycle (Cycle 35 candidate scope)

Pick one focus area; resist mixing:

### Option A — Visual QA + hero image polish

- Run Playwright capture across all approved-neighborhood routes at 320 / 375 / 414 / 768 / 1280 viewports.
- Compare hero CTA visibility above the fold across breakpoints.
- Tune Hero component spacing if any regression.
- Confirmed-safe: this is verification + small visual tuning, no copy or schema change.

### Option B — One-sample illustrative image checkpoint

- Greenlight from Torrey required first.
- Generate **one** Hollywood sample via Gemini Imagen using the prompt in `neighborhood-image-generation-briefs.md`.
- Operator reviews accuracy: did Imagen render Hollywood FL coastal-urban (correct) or Hollywood CA (wrong)?
- If approved → batch-generate the remaining 6 placeholders; write provenance manifest.
- If rejected → tune prompt or escalate to operator-provided photography.

### Option C — Cross-vendor compliance + standards review

- Spawn `Agent(subagent_type="Cato", ...)` against the six `world-class-standards/*.md` files for cross-vendor (GPT-5) blind-spot pass.
- Apply Cato findings as a single PR.

### Option D — Reference markets (Palm Beach / Lighthouse Point / Victoria Park) editorial polish

- These already have routes and approved imagery.
- Audit each page against `page-architecture.md` + `copy-tone-and-ranges.md`.
- No new routes; light polish only.

## Operator-gated cycles (cannot be AI-closed)

| Cycle | Owner | Trigger |
|---|---|---|
| Mia copy + photography delivery for 7 Broward cities | Mia | When Mia delivers |
| Bridge real SEF feed activation | Mia → Bridge | Bridge support ticket clears |
| API-key refresh | Torrey | 2026-05-22 per brief |
| Pre-cutover legal review | Counsel | Before DNS swap |
| DNS cutover to `miasanabria.com` | Torrey | Pre-cutover checklist complete |
| GHL form/webhook wiring | Torrey | Mia GHL sub-account ready |
| Google (GA4, Search Console, GBP, sitemap) | Torrey | Post-cutover |

## Net-new routes — deferred

- `/markets/palm-beach/` exists; treated as reference market, no new route needed.
- `/markets/lighthouse-point/` exists; treated as reference market, no new route needed.
- `/markets/victoria-park/` exists; treated as reference market, no new route needed.

Per the brief: "Do not create new public routes for Palm Beach, Lighthouse Point, or Victoria Park unless they already exist and can be made accurate." They already exist and are accurate. No action.

## Deferred audit / process items

- `audit:qa-gate` 4 high items → classify in readiness register next cycle. (Confirmed not launch-blocking; all are fs-only download routes and the 404 page.)
- `audit:legal` 1 WARN (DMCA USCO) → cleared by Mia obtaining the USCO certificate.

## Long-term

- BSS productization: this repo serves as the BSS luxury-realtor template. After Cycle 35 polish, the post-cutover repo state becomes the seed for the next client deploy (Sunrise Paddleboards already paused; next BSS client TBD).
