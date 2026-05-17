---
cycle: 42
artifact: red-team-precommit-review
generated_at: 2026-05-17
---

# Cycle 42 — Red-Team Precommit Review

Attack each acceptance criterion before commit. Goal: try to break the claim that the helper-copy fix is complete and the rest of the site is intact.

## Q1: Could the forbidden helper copy still exist in source?

**Attempt:** `git grep -nE "Search routes|Bridge-backed|Search anchors|property-search section|listings alone cannot tell you|residence specifics listings|participating brokerages" -- 'src/components/HeroSearch.tsx'`
**Result:** No matches.

Other matches across `src/app/` and `src/lib/` are legitimate non-hero copy on unrelated surfaces (about page, sellers, insights, markets, home-search page body). The scoped audit `scripts/audit-home-hero-copy.ts` exists to guarantee the homepage hero surface stays clean specifically. Source surface clean.

## Q2: Could the bad copy still exist in `out/`?

**Attempt:** `bun run audit:home-hero-copy` → `clean`.
`grep -oF "Bridge-backed" out/index.html | wc -l` → `0`.
`grep -oF "Begin with an area" out/index.html | wc -l` → `2`.

Build output reflects the new source after `bun run build`. Clean.

## Q3: Could it still exist in live HTML after deploy?

This will be re-verified in Phase 9 with a hex-cache-buster fetch and another run of `audit:home-hero-copy --base=https://miasanabriarealtor.trueidea.com`. The current live HTML still contains the old copy (the Cycle 41 commit is what's live until Cycle 42's commit lands and the staging service redeploys). That is the very condition Cycle 42 exists to fix.

**Pre-deploy risk:** Caddy on Dokploy could serve stale HTML even after the source repo is updated. Mitigation: the project CLAUDE.md cache+verify rule (hex cache-buster on every live probe) and the `deploy-and-verify` script's `--wait-for-needle` arm. Phase 8 will explicitly wait for the new build's needle and check the etag flips before claiming success.

## Q4: Could the replacement copy still sound technical/internal?

Replacement text:

> "Begin with an area, price range, and bedroom count. Mia will help you interpret the listings, neighborhoods, and details behind the search."

Adversarial reading:

- "interpret the listings" — could read as data-y. Mitigation: paired with "neighborhoods" and "details", the verb reads as the agent (Mia) interpreting on the user's behalf, which is the luxury-real-estate posture, not internal infra.
- "behind the search" — could imply the search has a backend. Acceptable: every consumer-grade search has a backend; the phrase here positions Mia as the human who reads the data, which is the brand.
- No "Bridge", no "API", no "data provider", no "MLS", no "routes to", no "anchors to", no "feed".

Verdict: replacement copy survives adversarial reading. Not internal.

## Q5: Could the hero visual layout regress?

The only delta to `src/components/HeroSearch.tsx` is the leading docblock prose and the helper `<p>` text content. No class names changed. No DOM structure changed. No CSS module touched. No Tailwind config touched. The form, the floating wrapper, the negative-margin offsets, the max-w, the card padding — all unchanged.

`audit:hero-contrast:stable` (which captures pixel screenshots at 3 samples each across hero routes × viewports and runs WCAG contrast math) returned 145 PASS · 0 FAIL.

`audit:brand` (which checks `brand.heroOverlayLayers`, `brand.heroNoCycle7WeakOverlay`, and 10 other brand invariants) returned 12 PASS · 0 FAIL.

Hero layout cannot regress from a text-only edit, and the contrast/brand gates prove it didn't.

## Q6: Could Bridge search break?

Local E2E: 11/11 PASS, mode=fallback. Form action `/home-search/` preserved. Hidden `source=home-hero` preserved. Three control names (`city`, `minPrice`, `beds`) preserved. `BridgeSearch` URL-param consumption unchanged. Bridge wiring intact.

## Q7: Could old IDX reappear?

`bun run audit:no-old-idx` → 481 files scanned, PASS. Cycle 37+ removed the old Matrix IDX iframe and added this guard. No regression.

## Q8: Could a docs-only commit after deploy create alignment ambiguity?

Phase 7 commits the code change + the new audit + the cycle-42 artifacts together. Cycle 42 does **not** plan a post-deploy docs commit. Phase 11 (final-deploy-alignment) is the safety net if any final report edit lands after the deploy — in that case a second deploy fires.

## Q9: Could secrets be staged?

`git diff --cached` will be inspected pre-commit. The only files Cycle 42 stages are:

- `src/components/HeroSearch.tsx` (helper paragraph + comment text — no values)
- `scripts/audit-home-hero-copy.ts` (regex patterns only — no values)
- `package.json` (one script entry — no values)
- `docs/artifacts/cycle-42-homepage-hero-copy-polish/**` (reports — no values, no chunk JS, no staging-html, no PID files)
- `ISA.md` and `docs/mia-client-decision-record.md` (decision entries)

No `.env`, no chunk JS, no token-shaped strings. Phase 7's staged-secret grep will confirm.

## Q10: Could the new audit be a no-op (false-clean)?

**Attempt:** put the bad string back in source temporarily to confirm the audit catches it.

This would be a real test but would require an extra commit cycle. Instead: the initial audit run (Phase 3, before rebuild) **did** flag the stale Cycle 41 build's `out/index.html` for all four forbidden patterns with correct counts and excerpts, proving the regex set fires correctly. The post-rebuild clean run is therefore a true negative, not a false negative.

## Verdict

```yaml
real_issues_found:                       0
issues_requiring_fix_before_commit:      0
proceed_to_commit:                       true
proceed_to_staging_deploy_after_commit:  true
```
