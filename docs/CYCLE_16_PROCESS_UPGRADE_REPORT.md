# Cycle 16 — Process Upgrade Report

**Date:** 2026-05-10

## Durable lessons learned in Cycle 16

Five process upgrades are worth carrying into the Website Production Loop skill.

### 1. Visual reproduction comes BEFORE remediation

Principal flagged "logos do not look fixed." Cycle 16's first reflex could have been to swap assets or tweak filters; instead the cycle reproduced the issue first with a screenshot, then identified the actual root cause (the source asset was a REALTOR®+MLS combined mark that bleached under monochrome filter). The fix was therefore precise — replace the source asset, not the filter.

**Doctrine to add:** When principal flags a visual issue, take a screenshot of the live state BEFORE editing code. The screenshot becomes both the falsification test and the artifact that proves the fix.

### 2. Audit chain ordering matters when one audit can SIGKILL

`audit:hero-contrast` can OOM-SIGKILL on memory-constrained hosts. With it in the middle of `audit:all`, any subsequent audits never run — and exit 137 looks identical to a failure in those later audits.

**Doctrine to add:** When wiring new audits into `audit:all`, place them BEFORE any audit known to be host-fragile (Chrome-launching probes, large-context model calls, etc.). Document fragility in the script header.

### 3. Adjacent-page overclaim risk

When you remove a phrase from one page, grep the same phrase across `src/app/**/*.tsx` before declaring the cleanup done. Forge VERIFY caught two adjacent pages still using the same phrases Cycle 16 removed from About.

**Doctrine to add:** Forbidden-phrase audits should default to a sitewide sweep, not a single-page check. Single-page checks miss the same overclaim appearing on adjacent pages.

### 4. Per-post images as a strategic surface, not a nice-to-have

The Insights library shipped Cycle 15 with shared `/og-default.jpg` on all 12 posts. Search Console saw 12 posts with identical OG cards. Cycle 16 generated 12 unique OG images by compositing existing market hero photos with editorial overlay — no new design system work, no stock photography licensing, no editorial photo shoot. Average ~89 KB per image, total ~1.07 MB.

**Doctrine to add:** Article surfaces should ship with per-post OG images by default. Reusing existing imagery via SVG-composited overlay is a one-script pipeline that should be templated for future content cycles.

### 5. Date governance is editorial, not schema

The principal asked about backdating publication dates. The right move was to introduce `editorialDate` + `editorialMonthLabel` + `dateDisplayMode` fields for VISIBLE LABELING ONLY, while keeping `datePublished` schema-honest at deployment date. This separation of concerns — visible date label vs. structured-data date — protects both editorial framing AND search-engine trust.

**Doctrine to add:** Visible date labels and schema dates are different concerns. Treat them as separate fields. Never let visible-label changes contaminate schema. When evergreen content needs a calendar frame, use editorial fields, not schema rewrites.

## Updates to Website Production Loop skill

Recommended additions to `~/.claude/skills/WebsiteProductionLoop/SKILL.md` (or equivalent skill home):

### `Workflows/ReproduceBeforeRemediate.md` (new)

When the principal flags a visual issue:
1. Reproduce with `google-chrome --headless=new` screenshot at the principal-cited URL + viewport.
2. Save BEFORE screenshot to `/tmp/<cycle>-before/` with a timestamp.
3. Diagnose root cause from the BEFORE screenshot. Cite the screenshot in the decision register.
4. Implement fix.
5. Build + serve locally via Bun.serve on a non-standard port (4174 / 4175 etc. — NEVER 4173 to avoid Chrome leftover).
6. Screenshot AFTER state at the same URL+viewport, saved to `/tmp/<cycle>-after/`.
7. Side-by-side comparison in the closeout doc.

### `Workflows/SitewideOverclaimSweep.md` (new)

When softening or removing copy on one page:
1. `grep -rE "<forbidden phrase>" src/app/**/*.tsx` BEFORE declaring the cleanup done.
2. If hits on adjacent pages, fix them in the same cycle (not the next one).
3. Extend the page-specific audit (`audit:about` etc.) to a sitewide sweep across logical neighbors.

### `Workflows/PerPostImagePipeline.md` (new)

Template script for compositing existing imagery with editorial overlay:
1. Inputs: source images directory + per-output mapping.
2. Sharp resize-cover-with-attention crop.
3. SVG overlay with brand wordmark + scrim layers matching Hero.tsx.
4. Output: `/og-<surface>/<slug>.jpg` at 1200×630.
5. Wire into `package.json` as `render:og-<surface>`.

### `Workflows/DateGovernanceForEvergreenContent.md` (new)

When publishing evergreen content with editorial calendar framing:
1. Add `editorialDate`, `editorialMonthLabel`, `dateDisplayMode`, `showYear?` to the post type.
2. NEVER change `datePublished` or `dateModified` to match the editorial frame.
3. Article schema reads from `datePublished` only.
4. Visible `<time>` element uses `datetime={datePublished}` (honest) with visible text from `editorialMonthLabel` or `dateDisplayMode`.

### `Workflows/AuditChainOrdering.md` (update)

When adding a new audit to `audit:all`:
1. Place it BEFORE any host-fragile audit (Chrome-launching, large LLM probe, etc.).
2. Document host-fragility in the new audit's script header.
3. Ensure the new audit can run standalone via `bun run audit:<name>`.
4. Confirm `audit:all` SIGKILL on fragile-audit doesn't mask new-audit results.

## Changelog entry for WebsiteProductionLoop skill

Add to `~/.claude/skills/WebsiteProductionLoop/CHANGELOG.md`:

```markdown
## v0.5.0 — 2026-05-10 (Cycle 16)

### Added
- `Workflows/ReproduceBeforeRemediate.md` — screenshot-first visual fix doctrine.
- `Workflows/SitewideOverclaimSweep.md` — forbidden-phrase grep before declaring cleanup done.
- `Workflows/PerPostImagePipeline.md` — composited OG pipeline template.
- `Workflows/DateGovernanceForEvergreenContent.md` — editorial-frame vs. schema-date separation.

### Updated
- `Workflows/AuditChainOrdering.md` — order new audits before host-fragile ones.

### Lessons captured (not rules)
- Featured homepage modules need UX governance, not just route/image existence (homepage Featured Markets in Cycle 16).
- Article pages should have representative images and OG assets (Insights surface in Cycle 16).
- A gold-standard page should be built before cloning a pattern across all markets (Fort Lauderdale V2 in Cycle 16; rollout deferred to per-cycle pacing).
- Legal/About accuracy should be audited as source-of-truth facts, not visual pages.

### Files touched (Cycle 16 reference)
- 12 docs/CYCLE_16_*.md
- 1 new client component (FeaturedMarketsPager)
- 1 new market component (FortLauderdaleV2Page)
- 3 new audit scripts (audit-featured-markets, audit-legal, audit-about)
- 2 new utility scripts (render-insight-og-images, render-trust-logos)
- 12 insights data files updated with date-governance fields
- 6 page source files edited (homepage, about, buyers, sellers, sellers FAQ, [slug])
- 2 new public asset files (clean R-mark + clean EHO house)
- 12 new public OG image files
```

## Recommendations for next cycle

1. **Reproduce-before-remediate as default reflex.** If Cycle 17 (whatever its mission) starts with a principal-flagged visual issue, take the screenshot before opening any editor.
2. **Sitewide audit-about pattern** can be generalized. Consider promoting it to `audit:overclaim` covering ALL service-page text.
3. **Per-cycle V2 rollout** — exactly ONE featured-market V2 per cycle. Anti-pattern is batch conversion. Build Boca Raton V2 in the cycle after a principal-decision session unblocks .com gates.
