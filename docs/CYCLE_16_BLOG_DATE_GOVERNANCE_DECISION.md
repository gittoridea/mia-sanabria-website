# Cycle 16 — Blog Date Governance Decision

**Date:** 2026-05-10
**Decision:** Honest `datePublished` + visible editorial-month frame

## What changed

### Type (`src/lib/insights.ts`)

Added to `InsightPost`:
- `editorialDate: string` — 2nd-Monday-of-month anchor; VISIBLE SORT/LABEL ONLY; never schema.
- `editorialMonthLabel: string` — e.g. "Evergreen Brief · May"; replaces bare `topicMonth` for display.
- `dateDisplayMode: "evergreen-month" | "full-date" | "updated-only"` — drives visible label strategy.
- `showYear?: boolean` — default false for evergreen mode.
- `heroImage: string` — per-post hero image path (Cycle 16 Phase 5 sets these).
- `heroImageAlt?: string` — per-post alt text.

New helper: `getVisibleDateForPost(post): InsightVisibleDate` returns `{ primary, secondary? }` per mode.
New helper: `getUpdatedMonthYearLabel(post)` — "Month YYYY" from `dateModified`.

### All 12 posts (`src/data/insights/*.ts`)

Each post received:
- `editorialDate` = 2nd Monday of marketCycleMonth, going back 12 months from now (2025-05 → 2026-04).
- `editorialMonthLabel` = `"Evergreen Brief · <Month>"`.
- `dateDisplayMode` = `"evergreen-month"`.
- `showYear` = `false`.
- `heroImage` = per-Decision-Register §3 mapping (existing market image).
- `heroImageAlt` = topical alt text.
- `ogImage` switched from `/og-default.jpg` to `/og-insights/{slug}.jpg` (Phase 5 generates the files).

### Article page (`src/app/insights/[slug]/page.tsx`)

- Hero now uses `background="image"` with `imageSrc={post.heroImage}` (was text-only hero).
- Header date row now renders `visibleDate.primary` + optional `visibleDate.secondary` line.
- `<time>` elements stay schema-faithful: `datetime={post.datePublished}` and `datetime={post.dateModified}`.
- Footer `Topic month · …` swapped for `editorialMonthLabel`.
- Inline-CTA position math corrected to `Math.max(2, Math.floor(post.sections.length / 2))` (was floor((n*2)/3), which landed at 80% on 5-section posts per Forge VERIFY).

### Index card (`src/components/insights/InsightCard.tsx`)

- Label switched from `post.topicMonth` to `post.editorialMonthLabel`.
- Renders "Evergreen Brief · January" instead of "January Reset".

## Schema and SEO integrity

### What stays honest

- `Article.datePublished` = `post.datePublished` = `2026-05-10` (verifiable in Search Console as the actual first-crawl date).
- `Article.dateModified` = `post.dateModified` = real most-recent revision.
- `<time datetime="2026-05-10">` on rendered HTML.
- OpenGraph `og:article:published_time` / `og:article:modified_time` = honest.

### What's editorial-only

- The visible label "Evergreen Brief · May" + "Updated May 2026" — does not feed schema.
- `editorialDate` is a sort/anchor field only, never serialized to JSON-LD.

This keeps us aligned with Google's structured-data guidelines (no misrepresentation of publication date), while solving the "all 12 posts have the same date" Search Console signal Cato flagged in Cycle 15.

## Visible display per mode (worked example, Post 01)

**Hero eyebrow:** `Insights · Evergreen Brief · January`
**Header date row:**
- `By Mia Sanabria, REALTOR®`
- `<time datetime="2026-05-10">Evergreen Brief · January</time>`
- `<time datetime="2026-05-10">Updated May 2026</time>`
- `8 min read`

**Index card eyebrow:** `Evergreen Brief · January` (replaces "January Reset")

## Why we did NOT backdate `datePublished`

The cycle prompt explicitly said:

> Do not misrepresent actual publication dates in schema unless explicitly authorized and documented.

Backdating would have:
- Falsified `Article.datePublished` for SEO age-signal manipulation.
- Required a separate `Decisions` ISA entry documenting principal authorization.
- Created provenance fog inside the data files (the `01-...ts` file's content was authored 2026-05-10; the schema would claim 2026-01-12).
- Made future cycle audits harder ("when did this *really* deploy?").

Honest dates + editorial framing is the better long-term posture. If a future cycle authorizes backdating for legitimate-reason re-publication, the `dateDisplayMode: "full-date"` mode is in place to support it without needing to retro-fit the visible-label scaffolding.

## 12-month editorial anchor table

| marketCycleMonth | editorialDate (visible only) | editorialMonthLabel |
|---|---|---|
| 1 (Jan) | 2026-01-12 | Evergreen Brief · January |
| 2 (Feb) | 2026-02-09 | Evergreen Brief · February |
| 3 (Mar) | 2026-03-09 | Evergreen Brief · March |
| 4 (Apr) | 2026-04-13 | Evergreen Brief · April |
| 5 (May) | 2025-05-12 | Evergreen Brief · May |
| 6 (Jun) | 2025-06-09 | Evergreen Brief · June |
| 7 (Jul) | 2025-07-14 | Evergreen Brief · July |
| 8 (Aug) | 2025-08-11 | Evergreen Brief · August |
| 9 (Sep) | 2025-09-08 | Evergreen Brief · September |
| 10 (Oct) | 2025-10-13 | Evergreen Brief · October |
| 11 (Nov) | 2025-11-10 | Evergreen Brief · November |
| 12 (Dec) | 2025-12-08 | Evergreen Brief · December |

## Verification plan

- `audit:insights` will fail loudly if any post lacks `editorialDate` / `editorialMonthLabel` / `dateDisplayMode` (Phase 10).
- Typecheck blocks any post that fails the contract (already enforced — typecheck passes).
- Article schema is built from `post.datePublished` only — no risk of schema drift.

## Rollback

Reverting requires removing the four new fields + reverting the article-page render. Trivial.
