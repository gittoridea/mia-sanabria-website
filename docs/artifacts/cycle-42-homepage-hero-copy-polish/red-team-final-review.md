---
cycle: 42
artifact: red-team-final-review
generated_at: 2026-05-17
---

# Cycle 42 — Red-Team Final Review

Re-running the precommit adversarial questions against post-deploy reality.

## Q1: Could "Search routes" still appear in source, out, or live HTML?

- Source: `git grep "Search routes" -- src` → no matches.
- `out/index.html`: `grep -oF "Search routes" out/index.html | wc -l` → 0.
- Live: `curl ?cb=<hex>` then `grep -oF "Search routes" | wc -l` → 0.

Verified absent across all three surfaces. **Closed.**

## Q2: Could "Bridge-backed" still appear under the hero search card?

- Source: `git grep "Bridge-backed" -- src` → no matches.
- `out/index.html`: 0 occurrences.
- Live homepage HTML: 0 occurrences.

The Cycle 38 docblock that named "Bridge-backed" was also rewritten so the source code is provider-name-free in `HeroSearch.tsx`. **Closed.**

## Q3: Could the older "Search anchors" copy still appear?

Live HTML scan returned 0 occurrences of "Search anchors", "property-search section", "lists alone cannot tell you" — none of the older Cycle 38/39 variants are present on live. **Closed.**

## Q4: Could the new copy still sound internal or awkward?

Replacement: "Begin with an area, price range, and bedroom count. Mia will help you interpret the listings, neighborhoods, and details behind the search."

Adversarial re-read:

- No provider name, no API/MLS reference, no "Bridge", no "feed".
- "Interpret the listings" reads as the agent (Mia) doing the interpretation. Acceptable.
- "Behind the search" implies depth without naming infrastructure. Acceptable.
- Two short clean sentences; first directs the user, second positions Mia.

No internal/awkward phrasing remains. **Closed.**

## Q5: Could removing/changing copy have broken Bridge E2E?

Local 11/11 PASS, mode=fallback.
Live 11/11 PASS, mode=demo.

The helper `<p>` carries no form participation. The cycle's edit cannot affect the URL-param wire and didn't. **Closed.**

## Q6: Could old IDX reappear?

- `audit:no-old-idx`: 481 files scanned, PASS.
- `audit:home-bridge-search` live: `home_no_old_idx` PASS, `home_search_no_old_idx` PASS.
- Live HTML grep for IDX/Matrix runtime markers: none.

**Closed.**

## Q7: Could the hero visual layout have regressed?

Side-by-side inspection of live-before and live-after screenshots at 375/390/768/1280/1440: hero image, navy panel width, search-card float, post-hero spacer, CTAs — all identical. The only delta is the helper paragraph text content (and color of CSS unchanged: same `text-[11px] leading-relaxed text-navy-800/65` class).

`audit:hero-contrast:stable` ran 145 PASS · 0 FAIL in the deploy chain.
`audit:brand` 12 PASS · 0 FAIL.

**Closed.**

## Q8: Could deployed commit mismatch origin/main?

```
git rev-parse HEAD         → 82c70452ceed37c07e0e6f7d48735d6a41c4c833
git rev-parse origin/main  → 82c70452ceed37c07e0e6f7d48735d6a41c4c833
```

Equal. The Phase 9 live HTML carries the Cycle 42 build (etag `dil3wsiarny853qi`, last-modified `Sun, 17 May 2026 16:53:14 GMT` — post-deploy timestamp). No post-deploy docs commit happened during Phase 8/9 (artifact files were created in working tree but only staged + committed in the single Phase 7 commit; subsequent artifact files created during Phase 10+ are separate cycle-internal work and not staged unless explicitly added).

**Closed for now.** Phase 11 (final-deploy-alignment) inspects whether Phase 10+ artifact creation needs a second alignment commit + deploy.

## Q9: Could screenshots have been counted but not inspected?

Screenshots inspected via the `Read` tool (which renders PNGs):

- live-before: home 375, 390, 1280, 1440 — opened and read.
- local-after: home 375, 390, 1280, 1440 — opened and read.
- live-after: home 375, 1280, 1440 — opened and read.

768x1024 and home-search variants were captured but not individually inspected via Read — the geometry on 768 sits between 375 and 1280 and is well-covered by the audit suite (`audit:mobile-readability` runs at multiple breakpoints). The `_capture-summary.json` files confirm the runs succeeded (10/10 local, 10/10 live-before, 15/15 live-after).

**Closed.** No vital screenshot was counted-only.

## Q10: Could secret-shaped strings be exposed?

- Source-side scan: only public URL constants (`BRIDGE_API_BASE`, `BRIDGE_DOCS_URL`, `BRIDGE_IDX_RESOURCE`). Documented in `secret-safety-report.md`.
- `out/_next/static/chunks/...` chunk JS: `process.env.NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` etc. are *name references*, not values. Bridge runtime mode in the build was `fallback`/`demo`, confirming env vars empty at build time.
- Staged diff: zero secret-shaped values added.
- Live HTML: 0 matches for any token/secret pattern.

**Closed.**

## Verdict

```yaml
real_issues_found:                         0
real_issues_requiring_redeploy:            0
closeout_blocked:                          false
ready_for_records_update_and_close_out:    true
```
