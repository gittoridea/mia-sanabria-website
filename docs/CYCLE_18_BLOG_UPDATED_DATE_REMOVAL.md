# Cycle 18 — Blog Visible "Updated …" Label Removal

**Date:** 2026-05-10
**Mission Phase:** P2 (Cycle 18 prompt)
**Decision:** remove visible "Updated `<Month YYYY>`" from public blog UI; keep schema-side `dateModified` honest in Article JSON-LD.

## Problem at baseline

The article page (`src/app/insights/[slug]/page.tsx`) rendered a secondary `<time dateTime={post.dateModified}>Updated <Month YYYY></time>` element in the header reading-time row, sourced from `getVisibleDateForPost(post).secondary` in `src/lib/insights.ts`. Live probe of `/insights/why-automated-valuations-miss-luxury-waterfront/` confirmed the label appeared twice in the rendered HTML.

**Why this was a problem.** All twelve current posts are evergreen briefs deployed on the same date (Cycle 15 close, 2026-05-10). The visible "Updated May 2026" label conveyed no useful editorial signal — every post would carry the same string, drawing reader attention to a non-distinction. Schema-side `dateModified` is the canonical update-time signal for SEO; the visible label was UX noise without corresponding SEO benefit.

## Change

### `src/lib/insights.ts`

`getVisibleDateForPost` no longer emits a `secondary` field for `evergreen-month` mode. The function still returns `{primary: editorialMonthLabel}` (e.g., "Market Note · May") and emits `secondary` only in `updated-only` mode (which is opt-in and not used by any current post).

```ts
// evergreen-month — Cycle 18: no secondary "Updated …" line.
return { primary: post.editorialMonthLabel };
```

The `InsightVisibleDate.secondary` field is preserved on the type so other modes (or future opt-in display modes) can still emit it; only `evergreen-month` has it removed.

### `src/app/insights/[slug]/page.tsx`

The conditional rendering block is preserved — `{visibleDate.secondary ? (<time …>…</time>) : null}` — because the type still allows `secondary` for other modes. The `getVisibleDateForPost` change makes the conditional always render `null` for the current 12-post cohort. JSDoc comment updated to point to this Cycle 18 doc.

### Schema-side preservation

`buildArticleSchema(post)` (same file, lines ~69-87) continues to emit `datePublished` AND `dateModified` in the Article JSON-LD via `<JsonLd data={articleSchema} />`. No schema-side change. The honest update-time signal continues to ship for SEO/AEO consumers.

## New audit check

`scripts/audit-insights.ts` extended with `checkBuiltHtmlNoVisibleUpdatedLabel`:

- For each post, reads `out/insights/<slug>/index.html`
- Strips JSON-LD `<script type="application/ld+json">` blocks (Article schema legitimately carries `dateModified`)
- Asserts the residual HTML contains no `>Updated <Month> <year><` text inside a `<time>` element or as visible content
- WARN if `out/` is absent (pre-build); FAIL if visible "Updated …" appears

The new check makes the change anti-fragile: any future code-path that re-introduces a visible "Updated …" label will trip the audit at build time, not at user-facing-regression time.

## Verification approach

1. `bun run build` produces `out/` with the new article HTML.
2. `bun run audit:insights` runs the new probe.
3. Manual `grep -E "Updated [A-Z]" out/insights/*/index.html` confirms zero visible matches outside JSON-LD.
4. `grep "dateModified" out/insights/*/index.html` confirms the schema continues to carry the honest update date.

## Rollback

Single commit. To restore the pre-Cycle-18 visible label:
1. Revert `getVisibleDateForPost` to emit `secondary: \`Updated ${getUpdatedMonthYearLabel(post)}\`` in `evergreen-month` mode.
2. Remove the `checkBuiltHtmlNoVisibleUpdatedLabel` call from `audit-insights.ts`.
3. Optional: revert the JSDoc updates.

## Cross-references

- Cycle 16 originally introduced the secondary label as part of blog date governance (`docs/CYCLE_16_BLOG_DATE_GOVERNANCE_DECISION.md`). That doc remains historical context; Cycle 18 supersedes the visible-label decision while preserving the discriminator architecture.
- Cycle 17 replaced "Evergreen Brief · `<Month>`" with "Market Note · `<Month>`" (`docs/CYCLE_17_BLOG_LABEL_CLEANUP.md`). The Cycle 18 change is orthogonal — `editorialMonthLabel` (the primary label) is unchanged; only the secondary "Updated …" is removed.
