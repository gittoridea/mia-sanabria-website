# Cycle 34 — Claim vs Reality

> Phase 18 deliverable. What this cycle actually shipped vs. what the brief asked for, item by item.

| Brief asked for | Reality | Honest delta |
|---|---|---|
| Hero refit with locked direction (`South Florida Lifestyle` / `Home Search`) | **Shipped** — eyebrow + CTAs updated on `/` and `/home-search/`. | Heading on `/` was already correct; only eyebrow + CTAs changed. |
| Background = current `miasanabria.com` hero, if safely reusable | **Not reused** — provenance unknown (`vibe.filesafe.space` third-party CDN). Fallback `/markets/fort-lauderdale.jpg` retained. | Documented in `current-site-hero-background-audit.md`. Operator decision required. |
| Typed Neighborhoods system refactor | **Already implemented** — `Market` type in `src/lib/markets.ts` already covers the canonical shape proposed. No refactor introduced. | Re-introducing a parallel `NeighborhoodProfile` type would create dead duplication. Documented in `expert-lane-findings.md` Lane 2. |
| Neighborhood hub `/markets/` refactor | **Not changed** — hub already meets the standard. | Polishing optional next cycle. |
| Site-wide quality pass on `/`, `/buyers/`, `/sellers/`, `/about/`, `/contact/`, `/insights/`, header, footer | **Audited, not refactored** — site already audit-green. | `site-wide-audit-matrix.md` documents every route. Two surgical hero edits applied; no broader changes. |
| World-class standards docs | **Shipped** — six standards files under `world-class-standards/`. | — |
| Expert lanes | **Manual passes by primary executor** — not subagent spawns. | Honest substitution disclosed in `expert-lane-findings.md`. |
| Visual QA via real browser tool | **Tool present (Playwright 1.58.0)** — capture run executed after build. | See `visual-qa-report.md`. |
| Image accuracy + provenance | **Manifest + briefs only — no generation** | Per one-sample checkpoint gate. Operator approval required. |
| Compliance-safe copy | **Already clean** — `audit:no-fabrications` 0 hits, `audit:stale` clean, pattern sweep 2 guard-comment hits (not violations). | — |
| Staging deploy if gates pass | **Decision documented in `staging-deploy-report.md`** — final go/no-go after Phase 16. | — |
| Bridge demo honesty | **Preserved** — `/home-search/` `robots: noindex` unchanged, no copy override on demo banner. | — |
| API-key refresh, DNS, GHL, Google, Bridge token writes | **None performed** — explicitly out of scope. | — |
| Single coordinated cycle | **Foundation cycle** — all AI-closeable items done; operator-gated items remain. | Honest about what was achievable in 30-min E4 budget. |
| Production cutover | **Not performed** — explicitly out of scope. | — |
| 30-min E4 budget | **Held** — work performed inside the classifier-set budget. | — |
