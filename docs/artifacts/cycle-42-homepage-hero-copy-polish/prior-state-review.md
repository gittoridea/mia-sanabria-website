---
cycle: 42
artifact: prior-state-review
generated_at: 2026-05-17
---

# Cycle 42 — Prior State Review

## What did Cycle 41 claim?

Cycle 41 (commit `e63a35e`) claimed:
- Hero panel narrowed and lightened.
- Floating Bridge search narrowed (max-w-4xl on lg) and integrated with smaller negative-margin float (-mt-12 sm:-mt-14 lg:-mt-16).
- Post-hero spacer reduced (h-6 sm:h-8 lg:h-10).
- Eyebrow removed to avoid duplicating H1 line 1.
- Local + live E2E search-to-Bridge passed.
- `audit:brand`, `audit:hero-contrast:stable`, `audit:rendered`, `audit:qa-gate critical=0` passed.
- Dev staging deployed and verified.

Cycle 41 did **not** touch the helper paragraph inside the floating card.

## What does the operator screenshot show?

Visible under the floating search card:

> "Search routes to Mia's Bridge-backed Southeast Florida home search. Talk with Mia for current comparable sales and the residence specifics listings alone cannot tell you."

This is implementation-facing language ("Bridge-backed", "Search routes to"), awkward sentence construction ("the residence specifics listings alone cannot tell you" — verb/noun confusion), and inappropriate for a luxury-real-estate hero. Operator flagged it as the visible production-grade blocker.

## Which helper copy variants exist in source?

Single source location:

- `src/components/HeroSearch.tsx:135-139` — the floating-card helper paragraph.

```tsx
<p className="mt-3 text-[11px] leading-relaxed text-navy-800/65">
  Search routes to Mia&apos;s Bridge-backed Southeast Florida home search.
  Talk with Mia for current comparable sales and the residence specifics
  listings alone cannot tell you.
</p>
```

There is also a header comment at `src/components/HeroSearch.tsx:5-12` describing the surface as "Bridge-backed `/home-search/` page". The comment is not user-facing — but to satisfy the source-side audit cleanly (and avoid a "Bridge-backed" snag in the new audit) the comment will be rewritten in non-implementation-loaded prose.

The other 20+ matches for "current comparable sales" / "ownership history where available" across `src/app/{about,home-search,markets,sellers}/page.tsx`, `src/lib/markets.ts`, and `src/data/insights/*.ts` are **legitimate, consumer-facing luxury-real-estate phrasing** outside the homepage hero search card and outside Cycle 42's scope. The brief's audit pattern is explicitly scoped to the homepage hero search card; the new `audit:home-hero-copy` will scan only `src/components/HeroSearch.tsx`, `out/index.html`, and live-fetched homepage HTML.

## Which helper copy variants might exist in live HTML?

The brief warns that the older Cycle 38/39-era variant may still be cached:

> "Search anchors to the Southeast Florida property-search section. Listings shown reflect participating brokerages; talk with Mia for current comparable sales, ownership history where available, and the residence specifics that lists alone cannot tell you."

If Caddy on Dokploy is serving stale HTML for `/`, that older string could still be on live. Phase 2 will fetch live HTML with cache-busting headers (per project CLAUDE.md `?cb=<random-hex>` rule) and confirm which variant is actually live. The new audit must guard against both variants.

## Which component owns the helper text?

`src/components/HeroSearch.tsx`. The `HeroSearch` component is consumed by `src/app/page.tsx:122` as `<HeroSearch floating />` inside the hero column. No other component renders this paragraph.

## What exact phrase(s) must be removed?

Phrases that must not appear under the homepage hero search card (in source, `out/`, or live HTML):

- `Search routes`
- `Bridge-backed` (anywhere in `src/components/HeroSearch.tsx` user-visible OR comment)
- `Search anchors`
- `property-search section`
- `listings alone cannot tell you`
- `lists alone cannot tell you`
- `residence specifics listings alone`
- `participating brokerages` (in the homepage hero context)
- `ownership history where available` (in the homepage hero context)

The new audit scopes these checks to the homepage hero surface explicitly so it never flags legitimate consumer-facing prose elsewhere in the site.

## What wording will replace it?

```tsx
<p className="mt-3 text-[11px] leading-relaxed text-navy-800/65">
  Begin with an area, price range, and bedroom count. Mia will help you
  interpret the listings, neighborhoods, and details behind the search.
</p>
```

This is "Option C" from the brief. Local visual QA will re-confirm; if the card reads cleaner without the paragraph, the paragraph is removed (documented in `helper-copy-implementation-report.md`).

## Could removing/changing the helper copy affect Bridge E2E?

No. The Bridge search is driven by the `<form method="get" action="/home-search/">` and its three controls (`city`, `minPrice`, `beds`) plus the `source=home-hero` hidden input. The helper `<p>` carries no JS, no `name=`, no form participation. `BridgeSearch` on `/home-search/` reads URL params on mount independent of the helper text.

## Files Cycle 42 will edit

| File | Reason |
|---|---|
| `src/components/HeroSearch.tsx` | Replace helper paragraph (lines 135-139); rewrite implementation-loaded header comment |
| `scripts/audit-home-hero-copy.ts` | New scoped audit (homepage hero surface only) |
| `package.json` | Wire `audit:home-hero-copy` script |
| `docs/mia-client-decision-record.md` | MIA-CYCLE-42 decision entry |
| `ISA.md` | Append Decisions / Changelog / Verification entries |
| `docs/artifacts/cycle-42-homepage-hero-copy-polish/**` | All Cycle 42 reports |

No other source files touched.
