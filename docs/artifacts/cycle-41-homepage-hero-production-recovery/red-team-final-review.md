---
cycle: 41
artifact: red-team-final-review
generated_at: 2026-05-17
status: final
---

# Cycle 41 — Red-Team Final Review

Post-deploy adversarial review. Each risk vector poses a falsifiable claim and answers with the strongest available evidence (live captures + live audits + live HTML scan). Pre-commit version in `red-team-precommit-review.md`.

## Risk 1 — Dark panel still dominates on live

```yaml
hypothesis: |
  Mia opens the live staging URL and the navy panel still swallows the
  image, despite the local-after change.
falsification_local: panel narrowed to lg:max-w-md + opacity reduced to lg:bg-navy-900/68; local-after 1440 capture confirms image is the lead.
falsification_live: |
  live-after/screenshots/home__1440x1000.png — image occupies ~70% of hero,
  navy panel ~30%. Same composition at 1280, 1536. Image is the lead.
verdict: rejected
```

## Risk 2 — Image still feels like background filler

```yaml
hypothesis: |
  Even with lighter overlays, the waterfront image fails to read as the
  emotional first impression at first paint.
falsification_local: content-scrim /35 (was /45), cta-scrim h-1/3 from-/55 (was h-1/2 from-/85); local 1280/1440 captures confirm image breathes through.
falsification_live: |
  Live 1024/1280/1440/1536 captures all show the waterfront house, pool,
  and palms as the dominant visual element. The lighter scrim allows the
  blue water tone to read through the panel area at lg/xl.
verdict: rejected
```

## Risk 3 — Search still feels pasted on

```yaml
hypothesis: |
  The narrower floating card still reads as a cream band laid across the
  seam between hero and "Mia's Service Areas."
falsification_local: max-w-4xl on lg + -mt-12/-14/-16 float; ~896px wide overlapping hero by ~64px (was 1280px wide overlapping by ~96px).
falsification_live: |
  Live 1280/1440 captures show the search card as a centered, narrower
  composed element. It floats up into the hero edge with intentional
  overlap and lands on the cream surface below — reads as anchored
  to the hero, not pasted across.
verdict: rejected
```

## Risk 4 — Search form still too wide or database-like

```yaml
hypothesis: |
  Even at max-w-4xl, the 4-column horizontal grid still reads as a
  database admin row.
falsification_local: subjective; the shape is unchanged but proportions and slimmer card padding (lg:p-5 vs lg:p-6) + lg:gap-3 make it feel like a refined tool.
falsification_live: live 1280/1440 captures show the search as three slim fields + brass button at ~896px — a focused tool, not a stretched admin row.
verdict: rejected (subjective; Mia review is the load-bearing final signal)
```

## Risk 5 — Mobile overflows or clips on live

```yaml
hypothesis: |
  Cycle 41 broke mobile geometry that Cycle 40C ruled fixed via
  Playwright CDP measurement.
falsification: |
  Cycle 41 only edited sm:+ media-query classes; base mobile classes
  (w-full max-w-full overflow-hidden, [contain:inline-size], max-w-2xl,
  bg-navy-900/85) untouched. min-[375px]:bg-navy-900/90 restored.
  audit:rendered.mobile.noHorizontalOverflow at 35 viewport-honest probes = 0 overflow.
  audit:hero-contrast 145/145 PASS (homepage 1440 = 13.69:1 glyph, 9.11:1 edge).
falsification_live: |
  Live 320/360/375/390/414/430 captures (after fresh-cachebuster recapture
  past Caddy stale cache) all show panel + H1 + sub + 2 CTAs within the
  viewport. Same chrome --headless capture artifact noted in Cycle 40C
  red-team verdict (chrome window-size vs layout-viewport mismatch) is
  not a real-device defect.
verdict: rejected (real-device verification remains operator territory)
```

## Risk 6 — Vertical gap still feels accidental on live

```yaml
hypothesis: |
  The h-6 sm:h-8 lg:h-10 spacer reduction is too aggressive and the
  service-areas heading sits on top of the search card.
falsification_local: 1440 local-after capture shows the eyebrow appearing ~40px below the search card bottom; the next section's own py-20 (lg:py-28) provides the rest.
falsification_live: |
  Live 1280/1440 captures show "MIA'S SERVICE AREAS" eyebrow + "WHERE MIA
  REPRESENTS BUYERS AND SELLERS" heading within ~40-60px below the search
  card. Reads as intentional pause, not crowded.
verdict: rejected
```

## Risk 7 — Bridge search merely appears wired

```yaml
hypothesis: |
  The visual refactor broke the form contract; e2e PASS is a false-positive.
falsification_local: 11/11 E2E + 8/8 audit; data-home-hero-search="true" preserved; form method/action/destination unchanged; named selects unchanged.
falsification_live: |
  Live test-home-search-bridge-e2e against https://miasanabriarealtor.trueidea.com
  → 11/11 PASS, mode=demo. Live audit:home-bridge-search → 8/8 PASS.
  Live DOM marker grep: data-home-hero-search="true" present.
verdict: rejected
```

## Risk 8 — Old IDX reappeared

```yaml
hypothesis: |
  The refactor accidentally re-imported IdxEmbed or surfaced
  sef.mlsmatrix.com / mlsmatrix.com / idxform.
falsification_local: audit:no-old-idx PASS (481 files scanned). No IdxEmbed import. Caddyfile unchanged.
falsification_live: |
  Live audit:no-old-idx PASS (481 files). audit:home-bridge-search live checks
  home_no_old_idx and home_search_no_old_idx PASS. Live HTML scan: zero
  sef.mlsmatrix.com / mlsmatrix.com / idxform / idx-iframe markers.
verdict: rejected
```

## Risk 9 — Deployed commit mismatch

```yaml
hypothesis: |
  Dokploy built from an older revision; the live HTML does not reflect
  Cycle 41 source.
falsification: |
  Live HTML contains data-hero-copy-panel-version="cycle41",
  data-hero-overlay-version="cycle41", data-hero-search-version="cycle41".
  data-hero-eyebrow ABSENT (count 0). "South Florida Lifestyle" occurs
  once (inside H1). Cycle 41 source state is live.
  git rev-parse HEAD = git rev-parse origin/main = e63a35e
  (unchanged since commit; no post-deploy commits at red-team time).
verdict: rejected
```

## Risk 10 — Screenshots counted but not inspected

```yaml
hypothesis: |
  The cycle counted screenshots without producing verbal descriptions, so
  visual quality is unverified.
falsification: |
  live-before-hero-critique.md, local-hero-visual-qa-report.md, and
  live-hero-visual-qa-report.md each contain per-route × per-viewport
  verbal descriptions of what is visible. The Caddy stale-cache artifact
  at the first live-after 320/375 captures was noticed by visual inspection
  (not by token count) and resolved by cross-checking the live HTML curl
  and re-capturing.
verdict: rejected
```

## Risk 11 — Secret-shaped strings exposed

```yaml
hypothesis: |
  Live HTML contains BRIDGE_SERVER_TOKEN / BRIDGE_CLIENT_SECRET /
  NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN value / Bearer / access_token / etc.
falsification: |
  secret-safety-report.md: source scan + out-tree scan + presence-only env
  probe all clean. Live HTML scan (3 routes fetched into staging-html/final/)
  scanned with regex "BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|BRIDGE_CLIENT_ID|
  BRIDGE_DATASET_ID|NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN|GOOGLE_API_KEY|
  GEMINI_API_KEY|OPENAI_API_KEY|access[_token]=|refresh[_token]=|Bearer[ + base64-shaped]|
  DOKPLOY_API_TOKEN" → zero matches.
verdict: rejected
```

## Closure recommendation

```yaml
recommendation: approve_close
operator_only_gates_remaining:
  - Mia subjective hero review (Mia's call on whether the new direction lands)
  - Mia real-device mobile check (Playwright CDP measurement is AI-side decisive but real-device sign-off belongs to Mia)
  - Production cutover decisions (DNS, GHL endpoints, Bridge live credential provisioning, legal closeout) — entirely outside Cycle 41 scope
notes: |
  All 11 AI-side risk vectors rejected by live evidence. The Cycle 41
  homepage hero recovery shipped to the dev staging URL, visual fix
  confirmed by 11-viewport × 3-route live capture inspection, Bridge
  wiring + old-IDX absence preserved, no secrets exposed, no production
  systems touched. Production readiness is NOT claimed.
```
