# Ultimate Featured Market Page Standard

**Version:** 1.0 (Cycle 14, 2026-05-10)
**Owner:** Mia Sanabria, REALTOR® · LPT Realty
**Audience for ICP definition:** luxury / waterfront buyers and sellers in Eastern Fort Lauderdale, Eastern Boca Raton, Eastern Delray Beach, and adjacent Palm Beach County primary markets.

This document defines the bar that every featured market page in the Mia Sanabria site must meet to be considered world-class. Featured market pages are not template-fillers — they are buyer-decision-grade briefings that an HNWI client could read in five minutes and walk into a private conversation prepared.

---

## ICP — who the page is written for

Every clause below assumes the reader is one of the following profiles. The page must speak to all of them without diluting the prose.

1. **Luxury / waterfront buyer** — actively comparing 2-4 markets in Southeast Florida; prioritizes deepwater dockage, architectural era, gate/security, beach/club access, school radius (without steering language).
2. **Luxury / waterfront seller** — currently owns or has owned in the market; needs positioning language, comparable-sale framing, listing-strategy specificity.
3. **Privacy-conscious client** — wants a discreet conversation, not a public open-house tour; values "off-market" / "informally available" / "private brief" framing.
4. **Relocation or second-home buyer** — coming from Northeast / Midwest / California, comparing SE FL to other warm-weather second-home markets; needs lifestyle-context, climate, hurricane diligence.
5. **HNWI / affluent household** — net worth in the $5M-$50M range or above; expects considered prose, not generic SEO copy; recognizes language inauthenticity instantly.
6. **Cross-comparison shopper** — moving between Eastern Fort Lauderdale, Boca Raton, and Delray Beach; needs explicit comparative anchors per market.
7. **Serious seller positioning** — expects the page to know the market intimately; generic "luxury redefined" language disqualifies the agent on first read.

The page is **not** written for: bargain shoppers, low-price-point buyers, generic open-market browsers, or AVM-driven valuation seekers (those audiences have other touchpoints).

---

## The 12-section page contract

Every featured market page MUST emit these twelve sections in this order. Sections may be combined visually but the **content** must be present.

### 1. Premium hero

- **H1** is the market's tagline (`Market.tagline`). Not a generic "Welcome to [Market]" — must communicate something specific about the market in one sentence.
- **Eyebrow** reads `<MARKET NAME> · SOUTHEAST FLORIDA` (cluster-aware framing, not generic).
- **Hero image** is a market-specific 1200×1500 portrait that visually represents the place — waterfront for waterfront markets, gated for gated markets, mid-century for mid-century markets, A1A oceanfront for oceanfront markets. AI-generated heroes are acceptable as INTERIM until real photography is supplied; placeholder generic luxury images are NOT acceptable.
- **Subcopy** (`Market.intro`) is 1-3 sentences (≤ 370 char soft cap to keep desktop primary CTA above 1280×800 fold per Cycle 13 Lesson 2).
- **Primary CTA** "Inquire About [Market]" → `/contact/`
- **Secondary CTA** "Other Markets" → `/markets/`
- **Mobile readability:** subcopy ≥ 13px at 320 viewport; eyebrow ≥ 9px; pixel-contrast glyph ≥ 3.0:1, edge ≥ 2.5:1 (audit:hero-contrast PASS).

### 2. AEO answer block

- 75-125 words answering "What is [Market] known for in luxury real estate?"
- First sentence stands alone as a complete answer (used by `buildMetaDescription` for the meta description tail).
- No fabricated stats, no SEO stuffing, no "redefining luxury" language, no rankings without source.
- Speaks in Mia's editorial voice — concrete and specific, not promotional.

### 3. Market identity

- Why this market matters in the broader Eastern FtL / SE FL luxury picture
- How it differs from peer markets (`internalLinks` cohort)
- What a buyer should understand BEFORE searching here
- What a seller should understand BEFORE positioning here
- 60-100 words; can be split between `Market.lifestyle` (broader frame) and the bullet `Market.highlights` (specifics).

### 4. Waterfront / luxury specifics (if applicable)

For waterfront markets:
- **Dockage** — depth, length, route to ocean access
- **Canal type** — fixed-bridge vs no-fixed-bridge, depth class, navigability
- **Bridge clearance** — implications for vessel size
- **Ocean / Intracoastal access** — through which inlet (Hillsboro, Port Everglades, etc.)
- **Architecture** — era / style / typical condition (estate, mid-century, contemporary, new-build)
- **Lot orientation** — canal-frontage vs interior; cul-de-sac vs through-street
- **Privacy / gate / security** — gated, single-entry, security patrol, HOA discipline
- **Beach / country club access** — where accurate

For non-waterfront markets:
- The equivalent — country-club setting, walkability radius, downtown-corridor access, A1A oceanfront, etc.

### 5. Buyer section

- Who this market is best for (lifestyle priority — yachting, walkability, family-residential, quiet, oceanfront, etc.)
- Property-fit considerations — what the residence MUST have to be a good fit
- Due diligence points — seawall, dock capacity, bridge clearance, hurricane prep, flood zone, milestone-inspection (condos), HOA reserves, etc.
- What Mia helps clarify — the relationship-specific value-add for this market

### 6. Seller section

- How to position a residence for this market's buyer profile
- What buyers value here — concrete, not "buyers want luxury"
- Photography / presentation strategy — specific to architecture, era, dock, lot
- What public estimates miss — pricing turns on what (dock specifics, lot orientation, association reputation, etc.)

### 7. Comparison section ("How [Market] compares to nearby markets")

- 3-5 relevant peer markets via `Market.internalLinks`
- Each link must represent a real buyer-comparison vector (architecture, dockage, walkability, price band, etc.)
- Header reads "Related Eastern Fort Lauderdale neighborhoods" if all related are cluster-A neighborhood markets, else "Continue your tour" (driven by `getNeighborhoodSlugs()` post-Cycle-14 DRY refactor).

### 8. FAQ section

- 4-6 market-specific FAQs in `Market.faqs`
- Answers 30-80 words each
- No unsupported claims (no school ratings, no specific dollar averages, no statistics without source, no rankings without source, no MLS membership claims beyond verified)
- No Fair Housing steering language (no school steering, no family-friendly framing)
- FAQPage JSON-LD emitted automatically via `<Faq emitSchema>` on the page template

### 9. Internal links

- Relevant peer markets (per Section 7)
- Buyers (`/buyers/`)
- Sellers (`/sellers/`)
- Valuation (`/valuation/`)
- Contact (`/contact/`)
- Insights (`/insights/`) where applicable

### 10. SEO/AEO metadata

- **`<title>`** — `<Market Name> Luxury Real Estate | Mia Sanabria` (≤ 60 chars after the brand tail)
- **`<meta description>`** — 140-160 chars; built deterministically from `Market.aeoAnswer` first sentence + Mia voice tail (`buildMetaDescription`)
- **OG image** — unique 1200×630 at `/og-markets/<slug>.jpg`
- **Canonical** — `https://miasanabriarealtor.com/markets/<slug>/`
- **JSON-LD schema** (must all emit + parse):
  - `Place` (with name, description, address region "FL", county, GeoCoordinates if known)
  - `BreadcrumbList`
  - `RealEstateAgent` (Mia's identity; emitted by RealEstateAgentSchema component)
  - `FAQPage` (if FAQs are present)
  - `LocalBusiness` context (where current pattern supports it)

### 11. Trust / CTA layer

- "Private conversation" / "private consultation" / "private brief" language (per WRITINGSTYLE.md anchor)
- Anti: generic "your dream home awaits" lead-gen language
- Anti: fake urgency / scarcity ("only 3 homes available!")
- Anti: overclaiming ("Mia is the #1 agent in [Market]" without verifiable source)

### 12. Accuracy requirements (HARD)

- Public facts must be verified or carefully worded
- No invented statistics
- No invented rankings
- No fabricated sales claims (no "I just closed a $20M deal in this neighborhood" without proof)
- No language / status / designation claims (no "Mia speaks Spanish" until Mia confirms)
- No school steering (Fair Housing Act compliance — no quality rankings, no "best for families")
- `Market.county` is enforced as the literal-union type `"Broward County" | "Palm Beach County"` — typecheck-enforced

---

## Component contract (technical)

The 12-section content is rendered by `src/app/markets/[slug]/page.tsx` as the 8-section luxury market authority flow:

| Page section | Spec section(s) covered |
|---|---|
| Hero | 1 |
| AEO answer (`market.aeoAnswer`) | 2 |
| Lifestyle two-column + market brief aside | 3, 4 |
| Property archetypes (`market.propertyTypes`) | 4 |
| Buyer guidance (`market.buyerGuidance`) | 5 |
| Seller guidance (`market.sellerGuidance`) | 6 |
| Faq with FaqSchema (`market.faqs`) | 8 |
| Related markets (`market.internalLinks`) | 7, 9 |
| CTAStrip | 11 |
| Schema components | 10 |

---

## Editorial-voice guardrails

The page must read as Mia speaking. Voice anchors:

- **Anchor line** (used at most once per page): "If I don't know the answer, I will find it."
- **Tagline embedded contextually:** "Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach."
- **Frames preferred:** "private conversation", "brief", "shortlist", "considered", "block by block", "comparable sales packet drawn from the right cohort"
- **Frames forbidden** (per WRITINGSTYLE.md + Brand System Contract): "your dream home awaits", "let me find your forever home", "redefining luxury", "elevated experience", "synergy", "leveraging", "best-in-class", any em-dash decoration where comma works.

---

## Anti-pattern register (HARD)

Any of these on a featured market page is an immediate FAIL:

| Anti-pattern | Why |
|---|---|
| Generic luxury platitudes | "Discover unparalleled luxury" — disqualifies on first read for HNWI |
| School ratings or "great schools" framing | Fair Housing Act steering risk |
| Family-friendly steering ("perfect for families") | Same |
| Specific dollar averages without source | Can't be verified; risk of stale claim |
| Specific year-over-year stats without source | Same |
| Rankings ("top 5 in Florida") without source | Same |
| Fabricated sales claims | Statutory misrepresentation risk |
| "I speak Spanish" claim | Card 6 RECOMMENDATION_PENDING — Mia's languages = English only verified |
| Combined REALTOR®+MLS mark with no MLS membership in writing | Card 5 RECOMMENDATION_PENDING — trademark risk |
| Specific HOA fee figures without source | OMIT — verify in private conversation |
| Specific gate-staffing details | OMIT for gated markets |
| "FLorida" typo | audit:stale catches this — block deploy |
| Mailto: form-action cited as TCPA-compliant | Card 2 RECOMMENDATION_PENDING — TCPA mechanics gated by GHL |

---

## Verification gates per page

A featured market page is shipping-ready when:

| Gate | Tool / probe |
|---|---|
| Build | `bun run build` exit 0 |
| Word floor | `audit:completeness` reports ≥ 200 visible words |
| Hero contrast | `audit:hero-contrast` glyph median ≥ 3.0:1, edge median ≥ 2.5:1, all 5 viewports |
| Hero clipping | `audit:rendered.hero.headingFitsPanel` PASS · `subFitsPanel` PASS · `eyebrowFitsPanel` PASS |
| Image inventory | `audit:images.everyMarketCardImagePresent` + `everyMarketPageHeroImagePresent` + `everyMarketOgImageExists` PASS for the slug |
| Stale strings | `audit:stale` 0 hits + `audit:rendered.staleStrings` 0 hits |
| Email consistency | `audit:rendered.canonicalEmail` reports only `msanabriarea@gmail.com` |
| SEO metadata | `audit:completeness.metadata.allPresent` PASS for the route + unique title + unique description |
| Schema | `audit:schema` reports all blocks parse + `audit:completeness.schema.valid` PASS |
| Internal links | `audit:links` reports 0 broken |
| Footer trust | `audit:completeness.footer.trust` PASS for the sampled set |

---

## Continuous improvement rule

**The standard tightens, never loosens.** When a future cycle introduces a new featured market, the new market must clear this bar from day one. When the bar evolves (new section, tighter accuracy rule), all featured pages must re-pass — failing pages drop off the featured set until they re-pass.

This is the rule that prevents featured-market drift back into generic SEO-template territory.
