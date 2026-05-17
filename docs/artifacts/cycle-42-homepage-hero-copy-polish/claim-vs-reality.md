---
cycle: 42
artifact: claim-vs-reality
generated_at: 2026-05-17
---

# Cycle 42 — Claim vs Reality

| Acceptance Claim | Reality (verified at Phase 9-10) | Status |
|---|---|---|
| 1. Wrong "Search routes to Mia's Bridge-backed..." copy gone from source. | `git grep` on `src/components/HeroSearch.tsx` returns 0 matches for any forbidden pattern. | ✓ |
| 1. Same copy gone from `out/index.html`. | Post-rebuild grep: 0 matches. `audit:home-hero-copy` exit 0. | ✓ |
| 1. Same copy gone from live staging HTML. | Cache-busted `curl ?cb=<hex>`: 0 matches. `audit:home-hero-copy --base=staging`: exit 0. | ✓ |
| 1. Older "Search anchors to the Southeast Florida property-search section..." variant gone from live. | Confirmed absent in live-before AND live-after HTML. | ✓ |
| 2. Replacement helper copy is production-grade (or paragraph removed). | Option C selected: "Begin with an area, price range, and bedroom count. Mia will help you interpret the listings, neighborhoods, and details behind the search." Reads as consumer invitation, names the three controls, no implementation language, no awkward grammar. Local + live screenshots confirm. | ✓ |
| 3. Homepage hero visually improved (Cycle 41 layout preserved). | `audit:brand` 12 PASS · 0 FAIL. `audit:hero-contrast:stable` 145 PASS · 0 FAIL. Side-by-side screenshot inspection at 375/390/768/1280/1440 — identical geometry to live-before. | ✓ |
| 4. Homepage search remains Bridge-wired. | Form action `/home-search/` preserved. `source=home-hero` hidden input preserved. URL params city/minPrice/beds preserved. Local + live E2E 11/11 PASS. | ✓ |
| 4. Live E2E passes. | 11/11 PASS, mode=demo on live. | ✓ |
| 4. Bridge mode is truthful; demo banner shown when appropriate. | Live mode=demo; BridgeSearch renders demo callout at staging `/home-search/`. | ✓ |
| 5. Old IDX remains absent. | `audit:no-old-idx` 481 files PASS. `audit:home-bridge-search` `home_no_old_idx` PASS live + local. | ✓ |
| 6. typecheck pass. | exit 0. | ✓ |
| 6. lint pass. | "No ESLint warnings or errors". | ✓ |
| 6. build pass. | "Compiled successfully", 56 static pages. | ✓ |
| 6. audit:brand pass. | 12 PASS · 0 FAIL. | ✓ |
| 6. audit:hero-contrast:stable pass. | 145 PASS · 0 FAIL. | ✓ |
| 6. audit:no-old-idx pass. | 481 files PASS. | ✓ |
| 6. audit:home-bridge-search pass. | 7/7 local, 8/8 live. | ✓ |
| 6. audit:home-hero-copy pass (NEW). | clean across source + out/ + live. | ✓ |
| 6. qa-gate critical = 0. | critical=0, high=4 readiness register, medium=1. | ✓ |
| 7. Staging deploy completes under tmux/logged mode. | tmux session `mia-cycle42-staging-deploy-20260517-123230`, log at `docs/artifacts/cycle-42-*/logs/staging-deploy-20260517-123230.log`, EXIT_CODE:0. | ✓ |
| 8. `https://miasanabriarealtor.trueidea.com/` verified live after deploy. | etag advanced from `dil18zdpf3eo53sd` to `dil3wsiarny853qi`. last-modified advanced from `14:48:06 GMT` to `16:53:14 GMT`. Cache-busted fetch confirms new copy x2, old copy x0. | ✓ |
| 9. Final deployed runtime commit equals `origin/main`. | After Phase 7 commit + push: deployed=82c7045, origin/main=82c7045. Phase 12 will bundle closeout artifacts in a single follow-up commit AND run an alignment deploy per Cycle 41 precedent. | partially (pending Phase 11/12 alignment) |
| 10. No secrets printed, committed, logged, or exposed. | Source-side scan: only public URL constants (BRIDGE_API_BASE etc.). Staged diff: no token-shaped values. Live HTML: no secret matches. `~/.claude/.env` sourced inside tmux without echoing values. | ✓ |

## Net

```yaml
acceptance_criteria_total:                10
satisfied_at_phase_10:                    9
partially_satisfied:                      1   # Criterion 9 — alignment deploy pending
expected_satisfied_at_phase_12_close:     10
```

All Cycle 42 user-visible outcomes match the brief's mission. The remaining alignment step is a documentation-only deploy to keep the `origin/main` SHA in lock-step with the runtime.
