---
cycle: 42
artifact: helper-copy-implementation-report
generated_at: 2026-05-17
---

# Cycle 42 — Helper Copy Implementation Report

## Old copy removed

```text
Search routes to Mia's Bridge-backed Southeast Florida home search.
Talk with Mia for current comparable sales and the residence specifics
listings alone cannot tell you.
```

Single source location: `src/components/HeroSearch.tsx:135-139`. Removed in this cycle's edit.

## New copy

```text
Begin with an area, price range, and bedroom count. Mia will help you
interpret the listings, neighborhoods, and details behind the search.
```

```yaml
copy_removed_entirely: false
new_copy: "Begin with an area, price range, and bedroom count. Mia will help you interpret the listings, neighborhoods, and details behind the search."
```

Decision rationale: keep the paragraph but rewrite it. The card visibly improves with the new copy because (a) the first sentence names the *exact three controls* in the row above ("area, price range, bedroom count"), giving the user permission to start — and (b) the second sentence positions Mia as the human behind the data layer without naming the data layer. Removing the paragraph entirely would leave the card visually balanced but emotionally cold; keeping a softer paragraph supports the luxury-real-estate posture. Local-after visual QA confirms the kept-paragraph variant reads better than the removed variant in the floating card frame at 1280/1440.

## Why new copy is better

| Dimension | Old | New |
|---|---|---|
| Implementation language | "Bridge-backed", "Search routes to" | None |
| Reading register | Internal infra note | Consumer-facing invitation |
| Grammar | "residence specifics listings alone cannot tell you" (parse fail) | Two clean sentences |
| Sentence-1 purpose | Tells the user what just happened ("Search routes to...") | Tells the user what to do next ("Begin with an area...") |
| Sentence-2 purpose | Disclaims data limits | Positions Mia as interpreter |
| Fits the form above | No — does not name the inputs | Yes — names exactly the three inputs in the row |
| Luxury voice | Footnote-y, defensive | Calm, hosted |

## Files changed

```yaml
files_changed:
  - src/components/HeroSearch.tsx        # header comment cleaned + helper <p> replaced
  - scripts/audit-home-hero-copy.ts      # new scoped audit (homepage hero surface only)
  - package.json                         # wire audit:home-hero-copy script
```

## Header comment cleaned

The leading docblock in `src/components/HeroSearch.tsx` previously said "Cycle 38 rewires this surface to the Bridge-backed `/home-search/` page". That referenced the data provider by name in source. The comment now says the component "submits as a plain HTML GET to `/home-search/`" without naming the upstream data provider. The behavior description, param contract, and `floating` prop notes are preserved.

This change is non-user-facing (it is a code comment) but ensures the scoped audit cannot accidentally regress on the source file via a comment.

## Audit added

```yaml
audit_added:
  script: scripts/audit-home-hero-copy.ts
  package_json_entry: '"audit:home-hero-copy": "bun run scripts/audit-home-hero-copy.ts"'
  surfaces_scanned:
    - src/components/HeroSearch.tsx (form > <p> + button text only — does not flag comments)
    - out/index.html (when present after build)
    - https://<base>/?cb=<hex> (only when --base= is supplied)
  forbidden_patterns:
    - /Search routes to/i
    - /Bridge-backed/i
    - /Search anchors to the Southeast Florida property-search section/i
    - /property-search section/i
    - /listings alone cannot tell you/i
    - /lists alone cannot tell you/i
    - /residence specifics listings/i
    - /participating brokerages/i
  exit_codes:
    0: clean
    1: findings present
    2: script error
```

The audit scopes itself to the homepage hero surface so it does not flag legitimate consumer-facing prose elsewhere in the site (e.g., the home-search page body, market guides, insights, sellers page). This matches the brief's stated constraint: "Those phrases are not appropriate **under the homepage hero search card**."

## First audit run

Source-side scan: **clean (0 findings)**.
Build-output scan: **4 findings against stale `out/index.html` from the Cycle 41 build**. Expected. Phase 4 (`bun run build`) will refresh `out/index.html` from the new source; re-running the audit at that point will return clean across all surfaces.
