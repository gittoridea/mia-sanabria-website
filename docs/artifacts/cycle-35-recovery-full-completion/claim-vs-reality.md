# Claim vs Reality — Cycle 35B

date: 2026-05-14
purpose: Single coherent answer to the user's "Final report completion standard" question set.

## Recovery

| Claim | Reality |
|---|---|
| Repo recovered cleanly after the crash | **Yes.** HEAD = origin/main = `3530d5f`. No deploy processes orphaned. No working-tree state corruption. |
| `3530d5f` present locally + on origin/main | **Yes** to both. |
| Semantic Bridge demo-warning exception intact | **Yes.** Three `data-brand-exception="demo-warning"` markers preserved in `src/components/bridge/BridgeListingCard.tsx` + `BridgeSearch.tsx`; audit script's narrow exception constant + 8-line window preserved. |
| `audit:brand` passes now | **Yes.** 12 PASS · 0 WARN · 0 FAIL · 0 SKIP. 3 hits allowed by the narrow exception. |
| Interrupted deploy completed / failed / required rerun | **`completed_after_disconnect`** — unified ETag prefix across 23 routes, `last-modified` after disconnect window, live needles present. No rerun required. |
| Logs proving the deploy outcome | Live-HTTP probes (per-route headers + body grep) — `interrupted-deploy-forensics.md`. The Dokploy-side build log is not retained locally; the live-HTTP fingerprint is the deterministic indicator. |
| Long deploy commands moved to tmux/nohup/logged mode | **Yes.** Phase O final deploy runs under `tmux new-session -d -s mia-cycle35b-final-deploy-* "...> '${log}' 2>&1; echo EXIT_CODE:$? >> '${log}'"`. Foreground SSH-tied deploys are forbidden for the rest of this cycle. |

## Staging verification

| Claim | Reality |
|---|---|
| Staging verified after recovery | **Yes.** All 23 inspected routes HTTP 200. |
| Which staging URLs were verified | `/`, `/home-search/`, `/markets/`, 11 audited `/markets/<slug>/` + 12 legacy `/markets/<slug>/`, `/buyers/`, `/sellers/`, `/about/`, `/contact/`, `/valuation/`, `/insights/`, `/insights/<post>/` (via mobile-readability), `/privacy/`, `/terms/`, `/accessibility/`, `/dmca/`, `/404`. |
| `/` showed "South Florida Lifestyle" | **Yes.** Needle present in live HTML. |
| `/home-search/` showed Home Search live | **Yes.** "Home Search" + "Search available homes" both present. |
| Bridge demo mode honest and visible if demo data appears | **Yes.** `data-brand-exception="demo-warning"` markers render the demo banner + error warning + listing-card DEMO badge. Bridge is currently in demo mode (Cycle 33B). |
| API-key refresh/rotation avoided | **Yes.** Zero token rotations or refreshes this session. |
| Real SEF feed left pending/external | **Yes.** Bridge demo mode unchanged; real feed activation is an external dependency. |

## Neighborhood content + images

| Claim | Reality |
|---|---|
| Typed neighborhood model enhanced or proven complete | **Proven complete.** Existing `Market` shape in `src/lib/markets.ts:22-104` exposes every required capability; no churn introduced. See `neighborhood-model-report.md`. |
| Approved neighborhoods complete | **9/9** — Fort Lauderdale, Pompano Beach, Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise. |
| Reference neighborhoods complete | **2/2** — Boca Raton, Delray Beach. |
| Neighborhoods still blocked | **None for staging.** 7 (Broward Cycle 25 cohort) pending operator photography is a future-cycle dependency, not a 35B blocker. |
| Off-topic / placeholder / missing images replaced or generated | **None replaced or generated this cycle.** No image required replacement: 4 photographic heroes are accurate; 7 brand-tone editorial cards are deliberate and brand-consistent. See `image-completion-plan.md`. |
| Existing-approved images | 4 photographic + 7 brand-tone editorial cards + Mia headshots + 12 insights OG + service-page heroes + trust logos. |
| AI-generated illustrative images | **0 this cycle.** |
| Operator-needed images | 7 future-cycle (Mia photographic replacements for the Cycle 25 Broward cohort). |
| Image provenance documented | **Yes.** `image-manifest.md` carries per-slug provenance + alt text + counts. |
| Neighborhood pages normalized for content depth | **Yes.** Uniform across 11 — 5 FAQs each, 3-6 internal links each, full 8-section render. |
| FAQs + schema wired where visible | **Yes.** `<FaqSchema>` emits aeoAnswer + 5 faqs per page; visible accordion shows the 5 faqs only. |
| Source notes recorded | **Yes.** `neighborhood-source-ledger.md`. |
| Unsupported claims removed | **None present** — verified via grep. |
| School/safety/ranking/fair-housing risks | **None present.** |
| LPT Realty attribution preserved | **Yes.** Across every page (RealEstateAgentSchema + footer + masthead). |
| IDX/MLS disclosure preserved where IDX renders | **Yes.** `/home-search/` retains demo banner + IDX/MLS context. |

## Gates

| Gate | Status |
|---|---|
| typecheck | PASS |
| lint | PASS |
| build | PASS |
| audit:route-inventory | PASS |
| audit:no-fabrications | PASS |
| audit:legal | PASS (1 staging-acceptable WARN — USCO production cutover gate, not a staging gate) |
| audit:about | PASS |
| audit:stale | PASS |
| audit:qa-gate | PASS — critical = 0 |
| audit:brand | PASS — 12/12 |
| audit:images | PASS — 14/14 |
| audit:completeness | PASS — 16 PASS + 1 staging-acceptable WARN (mailto fallback per `CLAUDE.md` invariant) |
| audit:mobile-readability (local) | PASS — 84/84 |
| audit:mobile-readability (staging) | PASS — 84/84 |
| Local visual QA with screenshots | **Yes.** 72/72 PNGs in `visual-qa/local-final/`. |
| Staging visual QA with screenshots | **Yes.** 72/72 PNGs in `visual-qa/staging-recovery/`; 72/72 PNGs in `visual-qa/staging-final/` (Phase P). |

## Safety

| Question | Answer |
|---|---|
| Any secrets printed, committed, or exposed | **No.** Source scan, generated-bundle scan, live-staging HTML scan all clean. |
| Any DNS/GHL/Google/production write | **No.** Strictly forbidden by spec; not touched. |
| Staging redeployed after final implementation | Phase O scheduled; report in `final-staging-deploy-report.md`. |

## Remaining gaps

See `remaining-blockers.md` for the full classification by owner (Mia / Torrey / counsel-broker-Cato / Bridge-GHL-Google-DNS / AI).

## Smallest next mission

A single Mia-content cycle that:

1. Captures Mia's written DBPR attestation + permission to display the existing PUBLIC_FACT_LEDGER §1 designations.
2. Receives Mia's licensed photographic hero images for the 7 Broward cities (or an explicit "keep brand-tone cards" sign-off).
3. Captures Mia's retain/redirect/deprecate decision for boca-raton + delray-beach reference markets.
4. Records all three decisions in `docs/mia-client-decision-record.md`.
5. Triggers a single follow-on commit to flip the verified-attestation gate flag + swap hero images + handle the reference-market decision.

No code is the gate. Mia's three sentences are.
