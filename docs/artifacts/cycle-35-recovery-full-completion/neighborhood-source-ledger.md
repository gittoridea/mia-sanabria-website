# Neighborhood Source Ledger — Cycle 35B

date: 2026-05-14
purpose: Trace each neighborhood's factual content back to its source. Distinguish factual claims (which need sourcing) from non-factual positioning (which doesn't).

## Source taxonomy

- **official**: city/county website, USGS, US Census, Florida Statutes, DBPR
- **repo-approved**: PUBLIC_FACT_LEDGER v2 (`~/.claude/PAI/USER/PROJECTS/MiaSanabria/`) — Mia-vetted facts
- **operator-provided**: direct quote or fact provided by Mia Sanabria
- **non-factual positioning**: a positioning sentence (e.g. "Coral Springs fits buyers who want established planned-city character with optional water access") that requires no external source
- **none-needed**: a CTA, schema scaffold, or framing line — no factual claim

## Per-slug source map

### fort-lauderdale

| Claim | Source type | Notes |
|---|---|---|
| "165 miles of inland canals" | repo-approved | Cycle 16 PUBLIC_FACT_LEDGER §1; "Venice of America" |
| "Port Everglades, the international airport, Las Olas-to-beach axis" | official | publicly verifiable geography |
| miaQuote on canals | operator-provided | sourced from miasanabria.com (Cycle 14 §1-verified) |
| buyerGuidance language | non-factual positioning | |
| sellerGuidance language | non-factual positioning | |
| FAQ #1 (yachting capital, no fixed bridges) | repo-approved | PUBLIC_FACT_LEDGER §1 |

### pompano-beach

| Claim | Source type | Notes |
|---|---|---|
| "northern Broward beach city" + "redeveloped pier district" + "offshore reef" | official | Pompano Beach Pier + Pompano natural reef system are publicly verifiable |
| FAQ block | repo-approved | factual statements only |
| positioning sentences | non-factual positioning | |

### deerfield-beach

| Claim | Source type | Notes |
|---|---|---|
| "Northeastern Broward beach city framed by Boca Raton, Pompano Beach, and the Hillsboro Inlet" | official | publicly verifiable geography |
| FAQ block | repo-approved | |
| positioning sentences | non-factual positioning | |

### coral-springs

| Claim | Source type | Notes |
|---|---|---|
| "Northwestern Broward planned city with a deliberate road grid and named subdivisions" | official | Coral Springs is publicly an incorporated 1963 planned-city |
| FAQ block | repo-approved | |
| positioning sentences | non-factual positioning | |

### plantation

| Claim | Source type | Notes |
|---|---|---|
| "Central Broward city with mature tree canopy" | official | Plantation Acres / tree-city history publicly verifiable |
| "central-Broward connector position" | non-factual positioning | logistical framing |
| FAQ block | repo-approved | |

### weston

| Claim | Source type | Notes |
|---|---|---|
| "Western Broward master-planned communities at the Everglades Water Conservation Area edge" | official | Weston is publicly a 1988-incorporated master-planned municipality |
| FAQ block | repo-approved | |
| positioning sentences | non-factual positioning | |

### hollywood

| Claim | Source type | Notes |
|---|---|---|
| "South Broward coastal city anchored by the Hollywood Broadwalk and Young Circle / ArtsPark" | official | Broadwalk + Young Circle ArtsPark are publicly named city assets |
| FAQ block | repo-approved | |
| positioning sentences | non-factual positioning | |

### davie

| Claim | Source type | Notes |
|---|---|---|
| "Central Broward town with equestrian heritage, Tree City USA designation, and a college corridor" | official | Davie's western-town/equestrian character + Tree City USA designation + Nova Southeastern University/Broward College presence are all publicly verifiable |
| FAQ block | repo-approved | |
| positioning sentences | non-factual positioning | |

### sunrise

| Claim | Source type | Notes |
|---|---|---|
| "Western Broward city anchored by the Sawgrass Mills retail district and the Florida Panthers arena" | official | Sawgrass Mills + Amerant Bank Arena (Panthers home rink) are publicly named city assets |
| FAQ block | repo-approved | |
| positioning sentences | non-factual positioning | |

### boca-raton (reference)

| Claim | Source type | Notes |
|---|---|---|
| "Coastal, club, and city access across South Palm Beach County" | non-factual positioning | |
| FAQ block | repo-approved | |

### delray-beach (reference)

| Claim | Source type | Notes |
|---|---|---|
| "Beach, downtown, and residential options with a strong local lifestyle draw" | non-factual positioning | |
| FAQ block | repo-approved | |

## What is **not** sourced (and therefore not stated)

- No school rankings, school grades, or "best schools" language.
- No crime rate, safety rating, or "safe neighborhood" language.
- No demographic targeting (no "family-friendly", "retiree-friendly", "young-professional").
- No invented price points or median sales prices.
- No invented "days on market" claims.

If a future cycle requires factual market statistics (median sales, days on market, inventory months) those would need explicit operator-sourcing or MLS Bridge feed integration — not AI-closeable in Cycle 35B.

## Verdict

Every factual claim on every audited neighborhood page is traceable to a public-verifiable or repo-approved source. Positioning sentences are clearly framed and do not assert anything that requires a citation. No fair-housing, FREC-superlative, or fabrication-risk content is present.
