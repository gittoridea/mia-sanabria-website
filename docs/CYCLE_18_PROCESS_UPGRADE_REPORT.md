# Cycle 18 — Process Upgrade Report

**Date:** 2026-05-10
**Mission Phase:** P14
**Verdict:** **3 durable lessons** to memorialize in the Website Production Loop skill (when next updated). 1 Cato re-engineering action queued for Cycle 19.

## Lesson 1 — Research-backed market pages need a source ledger BEFORE content expansion

**Cycle 18 evidence.** The Fort Lauderdale page V3 → V4 lift was bottlenecked NOT on engineering effort (the V4 module additions were < 90 minutes of code) but on the source-ledger discipline that anchored every claim to a verified source. Without the ledger, the V4 rewrite would have either (a) generic SEO copy, or (b) overclaimed numbers (the 165-mi vs. 300-mi waterway scope conflict was directly resolved by the ledger; without it, the page would have shipped a city-scope overclaim).

**Generalization.** Any market-page deepening — Boca Raton V2, Palm Beach V2, Delray Beach V2, etc. — should follow the same pre-build research step:

1. Spawn a research agent with explicit source URL list (city / parks / CRA / port / Census / state-DEP / chamber).
2. Demand a ledger format with per-source authority + verification level + suggested editorial use + risk + hedge instructions + verbatim-vs-paraphrase labels.
3. End with a "Verified facts safe to paraphrase in copy" section that the page-build phase reads directly.
4. Surface conflicts explicitly (e.g., Pompano pier length: residents-page "1,000 feet" vs. CRA page "over 900 feet" — surface both, do NOT pick the higher one).

**Rule to add to the skill:** "Market-page V2+ work requires a research source ledger committed BEFORE the page edits."

## Lesson 2 — Visible-date UI must be distinct from schema dateModified

**Cycle 18 evidence.** The visible "Updated <Month YYYY>" label that Cycle 16 introduced bundled UX-noise with SEO-honesty. The label conveyed no useful editorial signal (every post deployed on the same date) but felt like SEO discipline. The Cycle 18 fix removed the visible label without touching the schema — a one-line change in `getVisibleDateForPost`, plus a defensive built-HTML probe in `audit:insights` to prevent regression.

**Generalization.** Visible date labels and schema dates serve DIFFERENT purposes:
- **Schema `dateModified`** is the SEO/AEO honesty signal. It MUST be present in Article JSON-LD. It's how search engines know when content was actually revised.
- **Visible date labels** are UX. They should ONLY appear when the editorial signal is meaningful (e.g., a real revision history; a time-sensitive post; a "Published <date>" hard line). They should NOT be a default rendering of `dateModified` just because the data is there.

**Rule to add to the skill:** "Visible date labels are an explicit editorial choice per post; default-OFF unless the editorial signal is meaningful."

## Lesson 3 — Section taxonomy must not create geographic inaccuracy

**Cycle 18 evidence.** The Cycle 14 `MarketCluster = "primary" | "neighborhood"` discriminator made an implicit geographic claim by routing Hillsboro Mile into "South Florida cities and towns" (which read as a cohort of incorporated cities/towns) — but Hillsboro Mile is a corridor through the *town of Hillsboro Beach*, not a city/town in the same shape as Fort Lauderdale / Boca / Palm Beach / Delray / Lighthouse Point.

The Cycle 18 fix introduced a third cluster value (`"northern-broward-waterfront"`) AND renamed the section heading rather than silently re-cluster Hillsboro Mile into `"neighborhood"` (which would have miscoded it as Eastern Fort Lauderdale).

**Generalization.** When a discriminated-union type drives UI section grouping, AND the union's members carry geographic implications, the cleanest fix for an outlier is:
1. **Add a third value** to the discriminator if the geography genuinely doesn't fit the existing two.
2. **Rename the section heading** to honor the geographic distinction the new value introduces.
3. **Render the union of values** in the same UI section if the visual cohort is what the user actually compares — that's a rendering decision, not a data decision.

**Rule to add to the skill:** "Cluster discriminators that drive UI section grouping must respect geographic precision; add a new cluster value before silently re-grouping an outlier."

## Lesson 4 — Adding a city/town market requires the full bundle

**Cycle 18 evidence.** Adding Pompano Beach was NOT just a `MARKETS.push(pompanoData)`. The full bundle includes:

- ALL_MARKET_SLUGS entry
- Market data record (with all required fields: tagline, intro, highlights, lifestyle, priceCharacter, lat/lng, heroImage, localContext, county, aeoAnswer, propertyTypes, buyerGuidance, sellerGuidance, faqs, internalLinks, comparisonContext)
- Hero image (1200×1500 JPEG at `public/markets/<slug>.jpg`)
- OG image (1200×630 JPEG at `public/og-markets/<slug>.jpg`)
- Route generation (auto via `generateStaticParams`)
- Metadata (auto via `generateMetadata` in `[slug]/page.tsx`)
- Schema (auto via PlaceSchema + BreadcrumbSchema + RealEstateAgentSchema + FaqSchema)
- Sitemap (auto via `app/sitemap.ts`)
- Internal links FROM the new market (via `internalLinks`)
- Internal links TO the new market (manual edit — must add the new slug to peer markets' `internalLinks` where editorially relevant)
- Image audit coverage (auto via `audit:images.everyMarket*` checks)
- Featured-markets audit coverage (auto via `audit:featured-markets.marketsIndex.complete`)

The bundle is reliable when the full sequence is documented. Cycle 18 took ~15 minutes of mechanical work for the Pompano addition once the data, image, and prior-market-edits were ready.

**Rule to add to the skill:** "Adding a city/town market = full bundle (12 surfaces). Document the bundle once; reference the doc on every subsequent addition."

## Cycle 19 backlog (queued process improvements)

1. **Cato re-engineering.** Cato sessions in Cycle 17 + Cycle 18 both terminated mid-investigation before emitting a structured verdict. Per Algorithm v6.4.0 R9 erratum, the fix is `codex exec --output-schema`. A Cycle 19 task: re-engineer the Cato dispatch to (a) pass an explicit `output-schema`, (b) tighten the read scope to ≤5 specific files, (c) cap the prompt at ≤800 words, (d) add an explicit "if you cannot finish investigation in 5 minutes, emit `skipped` with rationale" instruction. This is documented in `feedback_cato_structured_verdict_prompt.md` and `docs/CYCLE_18_CATO_OR_COMPLIANCE_CROSSCHECK.md`.
2. **Image-pipeline documentation.** `/tmp/mia-genimg/run.ts` (the prior batch generator) is gone. Cycle 18 used `bun ~/.claude/skills/Art/Tools/Generate.ts --model nano-banana-pro` directly. A Cycle 19 task: document the canonical image-generation invocation for new markets in the rollout-process doc, including the `LD_LIBRARY_PATH` requirement for the sharp resize step.
3. **Sandboxed Lighthouse re-introduction.** Cycle 18 explicitly skipped Lighthouse per mission boundary (`--no-lighthouse`). A Cycle 19+ task: re-introduce Lighthouse (or replace with a lighter perf probe like `web-vitals` synthetic) so page-weight regressions on V4-pattern pages are caught before deploy.

## Documentation update queue

Update when next editing the Website Production Loop skill:

- Lesson 1 (research source ledger) → add to "Pre-build" or "OBSERVE" section.
- Lesson 2 (visible vs. schema dates) → add to "Blog post" or "Insights" subsection.
- Lesson 3 (cluster taxonomy) → add to "Markets" or "Data model" subsection.
- Lesson 4 (full bundle for new markets) → add to "Adding a market" subsection or split into a new "Market addition checklist" subsection.

The skill update is queued, not auto-applied this cycle (per principal stability direction — Cycle 17 closeout did not touch the skill either; updates land in batches).
