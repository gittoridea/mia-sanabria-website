# Cycle 27 — Source Policy and Research Protocol

**Generated:** 2026-05-13
**Authority:** This document binds Phase 3 research and Phase 4 city briefs. The Phase 9 audit gate enforces several of these rules at validation time (`audit-stale-terms.ts`, `audit-no-fabrications.ts`).

## Allowed primary sources

These are the only sources that may stand alone as a citation. A fact backed only by a banned-list secondary source is **not** considered verified — the evidence ledger must trace it back to one of the surfaces below before any copy can rely on it.

1. **Official city domains** — `.gov` or city-issued `.org` (e.g., `coralsprings.gov`, `plantation.org`, `westonfl.org`, `hollywoodfl.org`, `davie-fl.gov`, `sunrisefl.gov`, `fortlauderdale.gov`, `pompanobeachfl.gov`, `deerfield-beach.com` — the last is the City of Deerfield Beach's official municipal site).
2. **Broward County official** — `broward.org` (county geography, county parks system, National Register listings, comprehensive plan / CRA pages).
3. **Census / GNIS / federal geographic** — `census.gov`, `usgs.gov` (place identifiers, square miles, ZIP boundaries, official place names).
4. **State agency** — Florida DEP (`floridadep.gov`), FDOT for state route names (`fdot.gov`), Florida Realtors / DBPR for licensing.
5. **Official park / venue / civic-asset pages** — operated by the city, county, or named institution (e.g., `amerantbankarena.com` for the Florida Panthers arena, `pierdedicated` history on the City of Pompano Beach CRA Pier Development page).
6. **Existing repo decision records and prior cycle artifacts** — `docs/mia-client-decision-record.md`, Cycle 22 / 23 / 24 / 25 / 26 audit evidence under `docs/artifacts/`, when those artifacts already cite an allowed primary source. Cycle 26 `city-fact-evidence-review.md` is the canonical pre-existing per-city fact ledger and is treated as primary insofar as it cites primary sources directly.
7. **Bridge Data Output documentation** — `bridgedataoutput.com` developer docs are allowed only for IDX-architecture documentation (Phase 8 gap-closure map). No credential or example-credential value is permitted to enter the repo.

## Allowed secondary sources (cross-check only, never sole authority)

- **Wikipedia** — used only as a pointer to a primary source. The fact must trace back through Wikipedia's own citation list to a `.gov` / `.org` / Census / federal / institutional surface before it counts as verified. Wikipedia infobox values for coordinates and square miles are accepted when they themselves cite Census/USGS.
- **Local historical societies** — only for non-sensitive (incorporation date, founder name) facts, only when cross-checked against a `.gov` source.
- **Reputable institutional pages** — universities, public-agency reports, state legislative archives — accepted as secondary when an official `.gov` source does not exist or is unreachable.

## Banned / quarantined sources

Findings traced only to these sources do **not** justify any production copy. They may be used to *locate* a primary source, but the citation in this evidence library must point at the primary source, not these.

- Broker blogs (any brokerage, including LPT, Compass, Coldwell Banker, RE/MAX, eXp).
- SEO listicles, "best neighborhoods" pages, ranking and "top X" sites.
- School-ranking sites — `niche.com`, `greatschools.org`, `schooldigger.com`, etc.
- Crime / safety / "safe neighborhood" sites — `areavibes.com`, `neighborhoodscout.com`, `bestplaces.net`.
- Demographic-persuasion content — sites that exist to channel buyer or seller behavior.
- Reddit, Twitter / X, Facebook, Nextdoor, social media in general.
- AI-generated content sites (LLM-produced "city guides").
- Unverified neighborhood blogs.
- Testimonial / review text from any source unless exact-source and permission-backed by Mia.
- Mia's existing social profiles (Facebook, Instagram, LinkedIn, YouTube) for facts about cities. Profile *contact information* is already canonical in `src/lib/mia.ts`; profile content is not a source for city facts.

## Banned claim categories

Every banned category below is a re-statement of an existing repo invariant. The Phase 9 audit gate enforces most of these automatically.

### Real-estate steering (Fair Housing)

- School quality, "good schools," "best schools," "top schools."
- "Safe," "safest," "secure," "low crime," "high crime," or any neighborhood-safety implication beyond the literal fact of city / sheriff jurisdiction.
- "Family-friendly," "kid-friendly," "great for kids," "raising a family," "good for retirees," "young professionals" — any protected-class-fit framing.
- "Bachelor pad," "bachelorette," "starter home" used as a demographic signal.

### FREC superlatives

- "#1 realtor," "top realtor," "best realtor," "most desirable agent," "leading," "most trusted."
- "Guaranteed sale," "guaranteed price," "guaranteed offer."
- "Will sell in X days," "sold in X days," or any performance promise.

### Unsupported market claims

- Specific price ranges for any city or neighborhood (pages defer pricing to private conversation by design).
- Appreciation percentages without a `.gov` or Census source.
- Inventory counts, days-on-market, absorption rate, list-to-sale ratio without a sourced and current citation. The site does **not** carry live MLS counts.
- "Off-market" implication that Mia has private access to listings before MLS broadcast.

### Performance / experience / awards

- Transaction volume claims ("sold $X in 2025," "X transactions YTD").
- Awards, rankings, "named one of," "as seen in / on" — unless the citation links to the awarding body's own page or a `.gov` / institutional source.
- Years-licensed / years-in-business — Mia's `unverified.yearsLicensed` is `null` per `src/lib/mia.ts:57`; do not invent.
- Response-time SLAs ("within two hours," "same day," "24/7") — luxury-as-practice risk per the project `CLAUDE.md` honesty contracts.

### Service-area scope

- Spanish, bilingual, fluent in another language, or any non-English professional language service. Mia's confirmed languages array is `["English"]` per `src/lib/mia.ts:56`. The 2026-05-13 English-only decision is canonical.
- "Concierge," "white-glove," "bespoke," "high-net-worth," "discreet" used in production copy. The brief uses "concierge-level" privately as an ICP descriptor for editorial guidance; production pages use plainer language.
- Service-area claims beyond the canonical SE Florida cohort (`Eastern Fort Lauderdale`, `Eastern Boca Raton`, `Eastern Delray Beach` administrative areas + the 9 Mia-approved neighborhoods).

### MLS / IDX

- Live listings claims unless Bridge runtime is wired and credentialed (it is not — `BRIDGE_INTEGRATION_LIVE = false` scaffold per `src/lib/bridge.ts`).
- "Search the MLS" CTA wording on any page not actually wired to an IDX runtime.
- "Get all listings" / "view every home" claims.

### Testimonial / review content

- Quoted client reviews unless the exact source URL is on Mia's broker-controlled review surface, captured with timestamps, and confirmed by Mia in writing for publication. None currently meet this bar; none appear on the site.

## Honesty disciplines for Cycle 27 specifically

- **WebSearch / WebFetch availability.** Where the tool is available, it is used to confirm Fort Lauderdale and Pompano Beach facts that Cycle 26 did not cover. Where it is unavailable for any reason, the brief records the gap honestly and does not fabricate citations.
- **Cycle 26 reuse.** Facts already verified in Cycle 26 `city-fact-evidence-review.md` are not re-verified; they are cited by Cycle-26-row reference in the source ledger. Re-verification would not improve trust — Cycle 26 sourced the same `.gov` / `.org` surfaces that Cycle 27 would consult.
- **No invented buyer-pool stats.** Where Mia's site speaks to "luxury buyers" or "qualified buyers," that language is editorial framing of the ICP, not a market-data claim. The brief does not introduce dollar bands, volume figures, or buyer-source statistics into production copy.
- **Photo claims.** Cycle 25 hero JPGs are described in repo as "brand-tone abstract cards (intentionally not photographs)." Cycle 27 does not relabel them as photographs.
- **No Mia attestation invention.** Where a fact requires Mia's written confirmation (license number flag, designation visibility, photography, testimonials), the brief tags it as Mia-blocked and does not infer permission.

## Source-tag taxonomy used in the source ledger

The Phase 3 source ledger applies these tags consistently to every row:

| Tag | Meaning |
|---|---|
| `primary-gov` | Cited only to an official `.gov` or city-issued `.org` page. |
| `primary-county` | Cited to `broward.org`. |
| `primary-federal` | Cited to Census, USGS, or another federal geographic source. |
| `primary-state` | Cited to a Florida agency (DEP, FDOT, DBPR, Florida Realtors). |
| `primary-institution` | Cited to a named-institution official page (arena, museum, named park operator). |
| `primary-prior-artifact` | Cited via Cycle 26 `city-fact-evidence-review.md` which itself traces to a primary source. |
| `secondary-wikipedia-pointer` | Wikipedia used only as a pointer; the fact also traces to a primary source. |
| `unverified-banned` | The fact is supported only by a banned source. May not be used in production copy without a primary re-source. |
| `mia-blocked` | The fact requires Mia confirmation before publication. |
| `legal-blocked` | The fact requires broker/legal/counsel review before publication. |
| `safe-for-public-copy` | The fact is verified, neutral, and within the honesty contract. |
| `safe-internal-only` | The fact is safe to use in this evidence library but not for public copy (e.g., editorial framing notes). |
