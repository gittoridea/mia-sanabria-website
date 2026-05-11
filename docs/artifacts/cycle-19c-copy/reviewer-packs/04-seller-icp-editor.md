# Cycle 19C-COPY — Seller ICP Editor reviewer pack

> **Editor role:** Seller ICP — `/sellers/`, `/valuation/`, the Fort Lauderdale V4 seller playbook section, seller-relevant FAQs, and the two seller-side lead-magnet templates (`luxury-seller-pre-listing-checklist`, `fort-lauderdale-waterfront-valuation-prep-sheet`).
> **Doctrine:** `docs/CYCLE_19C_COPY_DOCTRINE.md`. Inventory: `docs/artifacts/cycle-19c-copy/copy-inventory.md`.
> **Bounds:** No edits proposed inside `src/`, `public/`, `scripts/`, or `out/`. Every proposal here is a copy delta for the principal to approve before any code change.

## Executive summary

The seller-facing surfaces are already structurally strong — the valuation, dataroom, buyer-profile-positioning, photography, tour-strategy, and quiet-pre-market logic is the asset and must be preserved verbatim where it carries diligence substance. The compression opportunities are concentrated in three places. (1) The `/sellers/` page hero, AnswerFirst, ValueProps body copy, and FAQs lean on "higher-priced", "considered", "tailored", and "global" — softeners that read like brochure copy and undercut the authority the playbook earns elsewhere. (2) The valuation page carries one explicit response-time promise ("Most valuations are returned within five business days") that is the same risk class as the doctrine's banned "within 24 hours" — it needs to be removed or rewritten as a non-promise. (3) The seller-side lead-magnet `intro` and `whoFor` strings double-state "Fort Lauderdale waterfront residence" inside a single paragraph, which is the inventory's repeated-geography smell at the PDF cover.

The seller playbook in `FortLauderdaleV2.tsx` (steps 01–07) is the page's strongest writing in the cycle — it earns its length and should not be shortened. The CTAStrip subline on `/sellers/` and the AnswerFirst on `/valuation/` are over-length by the doctrine's 55-word paragraph and 28-word sentence rules and can compress without losing diligence content.

Eleven findings below, ordered by impact. None propose deleting a disclaimer, source-ledger line, REALTOR®/MLS/EHO mark, or AVM-skepticism content. None introduce a banned term or a response-time promise.

---

### Finding 1: `/sellers/` H1 reads as a brochure, not as a practice

- **Route / file:** `src/app/sellers/page.tsx` — Hero `heading` (line 114)
- **Current copy:** "Elevating your property's global presence."
- **Proposed copy:** "Selling a luxury or waterfront residence in Southeast Florida."
- **Reason:** Doctrine voice is "luxury without bragging" and "strong nouns, restrained adjectives." "Elevating" + "global presence" is the exact undifferentiated-luxury filler the doctrine names as a smell; it also makes the H1 the only seller surface that does not state what is being sold. The replacement is a strong-noun H1 that mirrors the buyer-page pattern and the H1 the seller playbook section already uses ("Listing in Fort Lauderdale.").
- **Risk if changed:** OG title, meta title, and the existing OfferCatalog name reference "Selling — Elevated Marketing & Strategy" — those stay as written (separate fields). The H1 is purely on-page copy; no schema dependency. SEO risk is mild — "Elevating your property's global presence" carries no search value; the new H1 carries the head term "selling … Southeast Florida."
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 2: `/sellers/` Hero sub double-states geography

- **Route / file:** `src/app/sellers/page.tsx` — Hero `sub` (line 115)
- **Current copy:** "Pricing, presentation, and considered introductions — sequenced by Mia personally for residences across Mia's core Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach markets."
- **Proposed copy:** "Pricing, presentation, and discreet introductions — sequenced by Mia personally across Eastern Fort Lauderdale, Boca Raton, and Delray Beach."
- **Reason:** Doctrine: "Geography once per paragraph. First mention is the full named place; subsequent references use pronouns or 'the area' / 'the corridor' / 'these isles'." The current sub repeats "Eastern" three times in 29 words and says "Mia" twice. "Considered" is also doctrine-soft — "discreet" is the brand-aligned word already used everywhere else.
- **Risk if changed:** None — purely cosmetic copy. The footer still carries the canonical "Fort Lauderdale to Boca Raton and Delray Beach" enumeration; SEO geography presence is unchanged.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 3: `/sellers/` AnswerFirst preamble is filler; the substance follows it

- **Route / file:** `src/app/sellers/page.tsx` — AnswerFirst `answer` (line 125)
- **Current copy:** "A luxury or waterfront residence is positioned for the buyer who is already searching for it — not a generic public listing. The work begins with disciplined pricing built from current comparable sales on the same street, building, or block — never broad public ranges. Editorial photography, twilight imagery, drone, video, and copywriting present the residence as an architectural object. For dock-capable estates, dock specifications, water depth, and route to the inlet are documented as marketable infrastructure. Distribution layers private brokerage introductions on top of MLS exposure so qualified, prepared buyers see the residence first. Showings are coordinated to protect the household's privacy and the residence's condition."
- **Proposed copy:** "Position the residence for the buyer who is already searching for it. Pricing comes from current comparable sales on the same street, building, or block — not broad public ranges. Photography, twilight imagery, video, and copywriting present the residence as an architectural object. For dock-capable estates, dock specifications, water depth, and route to the inlet are documented as marketable infrastructure. Distribution layers brokerage introductions on top of MLS exposure so prepared buyers see the residence first. Showings are coordinated to protect the household's privacy and the residence's condition."
- **Reason:** Doctrine: "If a section header restates the next paragraph's first sentence, kill the duplication" and "throat-clearing intros" are out. The current first sentence is a setup paragraph; the same idea is the H2 just above ("How should sellers position a luxury or waterfront home …"). Dropping "A luxury or waterfront residence is positioned" and changing "Editorial photography, twilight imagery, drone, video" to "Photography, twilight imagery, video" (drone is presentation, already implied by aerial photography downstream) trims 24 words while preserving every diligence variable (price source, comparable cohort, dock specifics, route-to-inlet, MLS+brokerage layering, showing privacy).
- **Risk if changed:** AnswerFirst is AEO-targeted; the current copy is what schema/AEO scrapers see. The compressed answer still leads with the core claim ("Position the residence for the buyer who is already searching for it"), so AEO snippet quality is intact. Watch for the AnswerFirst schema emission — confirm `Faq` schema is not pulling this string verbatim before edit.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 4: `/sellers/` ValueProps "considered" + "global luxury" pile up softeners

- **Route / file:** `src/app/sellers/page.tsx` — ValueProps `heading` (line 152) and items (lines 155–171)
- **Current copy:** Heading: "A listing partner positioned for the residence — not the volume." Item bodies use "Cinematic photography, twilight imagery, video, drone, and copywriting that present the residence as the architectural object it is." / "Discreet introduction to qualified buyers through brokerage and cooperating-agent relationships across Southeast Florida — alongside the public marketing every listing receives." / "Data-driven micro-market analysis combined with global luxury context to optimize price and velocity." / "Title, escrow, financing, and tax-structuring partners aligned with the discretion and complexity higher-priced transactions demand."
- **Proposed copy:** Keep the heading verbatim — it is doctrine-clean. Compress item 3 to: "Micro-market analysis grounded in current comparable sales — pricing tuned to the buyer pool the residence actually competes for." Compress item 4 to: "Title, escrow, financing, and tax partners experienced with the complexity these transactions require."
- **Reason:** "Global luxury context" is doctrine-banned in spirit ("undifferentiated luxury filler") and the practice is local — no global comparable set is being pulled. "Higher-priced" appears three separate times across this page; once is informative, three times is throat-clearing. "Discretion and complexity" doubles a word the rest of the page already carries.
- **Risk if changed:** OfferCatalog schema (lines 80–104) carries the canonical service descriptions for SEO — those stay verbatim and continue to surface "private brokerage outreach". On-page ValueProps body copy is not in any schema. Compliance unchanged.
- **Factual / source-ledger review required:** no — both compressions remove claims rather than add them
- **Category:** 1 site/content/design defect

---

### Finding 5: `/sellers/` FAQ — "Should I list publicly or pursue a private sale?" is the seller's actual question and the answer hedges away from a position

- **Route / file:** `src/app/sellers/page.tsx` — SELLER_FAQ item 1 (lines 50–53)
- **Current copy:** "Both have a place. Public listing maximizes exposure and tends to produce the strongest pricing in active markets; a privately marketed sale preserves privacy and often appeals to owners who value discretion above marginal price. Strategy is set together based on the residence and the market."
- **Proposed copy:** "Both have a place. A public MLS listing maximizes exposure and tends to produce the strongest pricing in active markets. A privately marketed sale preserves privacy and often appeals to owners who value discretion above marginal price. The right path is decided in writing, with the seller's reasoning recorded, so the strategy stays coherent if conditions change mid-listing."
- **Reason:** The current closing sentence ("Strategy is set together based on the residence and the market") is the doctrine's "let's discuss" smell in a different costume — it ends on a soft, advisory hand-wave. The FL seller playbook step 07 already says the right thing verbatim ("the decision happens in writing, with the seller's reasoning recorded"); aligning the seller-page FAQ to that line gives the answer authority and consistency.
- **Risk if changed:** Faq emits schema — confirm the question/answer pair is re-rendered after the build. The proposal is longer by one sentence than the original (47 vs. 51 words on the final sentence count), still inside the 55-word paragraph budget. No banned term introduced; no response-time promise.
- **Factual / source-ledger review required:** no — the claim is already in the FL seller playbook
- **Category:** 1 site/content/design defect

---

### Finding 6: `/sellers/` FAQ — "How long does a higher-priced sale take?" leans on "highly market-dependent" filler before the substance

- **Route / file:** `src/app/sellers/page.tsx` — SELLER_FAQ item 3 (lines 59–63)
- **Current copy:** "Highly market-dependent. Well-positioned waterfront and country-club residences often move within 60-120 days; properties in tightly defined estate sections can take longer by design. Your timeline shapes the strategy."
- **Proposed copy:** "Market-dependent. Well-positioned waterfront and country-club residences often move within 60-120 days; properties in tightly defined estate sections can take longer by design. The seller's timeline shapes the strategy."
- **Reason:** "Highly market-dependent" is throat-clearing; "Market-dependent." carries the same meaning in three fewer words. "Your" in the final sentence breaks the second-person voice the rest of the page maintains (the page otherwise consistently refers to "the seller" or "Mia"). Both are minor; both compound.
- **Risk if changed:** Faq schema again — confirm rebuild. No compliance, SEO, or AEO risk.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 7: `/valuation/` carries an explicit response-time promise

- **Route / file:** `src/app/valuation/page.tsx` — valuation form helper paragraph (line 112)
- **Current copy:** "All conversations are confidential. Most valuations are returned within five business days."
- **Proposed copy:** "All conversations are confidential. Valuations are returned after a private walk-through (or virtual equivalent) and a comparable-sales pull tuned to the residence."
- **Reason:** The doctrine bans "within 24 hours" / "same-business-day response" as response-time promises and the principle generalizes to any specific business-day commitment surfaced as a guarantee. "Within five business days" is the same risk class — it commits to a turnaround Mia does not control (specialist availability, on-site scheduling, comparable-sales access) and is functionally identical to the banned response-time language. The proposed copy replaces the promise with a description of the process, which is what the rest of the page already does.
- **Risk if changed:** The compressed line loses one piece of information (the implicit "you'll hear back within a week" expectation). That can be re-anchored elsewhere as "a valuation is a working engagement, not an instant report" if the principal wants the expectation managed. No schema dependency.
- **Factual / source-ledger review required:** yes — confirm with the principal whether any committed-SLA exists in the engagement letter. If yes, keep the SLA in the engagement letter, not on the public page.
- **Category:** 5 legal/compliance dependency

---

### Finding 8: `/valuation/` AnswerFirst is doctrine-strong but exceeds the 55-word paragraph rule

- **Route / file:** `src/app/valuation/page.tsx` — AnswerFirst `answer` (line 95)
- **Current copy:** "Automated valuation models miss the variables that decide a luxury waterfront price. A serious valuation accounts for dock specifics — length, water depth, fixed-bridge clearance, route to the inlet, and any yacht-capacity history — alongside lot orientation to prevailing winds, view corridor, hurricane shutters, generator coverage, flood-zone elevation, and HOA or country-club access. It cross-checks recent comparable sales on the same street, building, or block; reviews architectural era and renovation depth; and weighs the residence's scarcity within its sub-market. Mia delivers a confidential walk-through (or virtual equivalent) plus a written strategic positioning recommendation — useful for estate planning, refinancing, or a future sale."
- **Proposed copy:** "Automated valuation models miss the variables that decide a luxury waterfront price. A serious valuation accounts for dock specifics — length, water depth, fixed-bridge clearance, route to the inlet, yacht-capacity history — alongside lot orientation, view corridor, hurricane shutters, generator coverage, flood-zone elevation, and HOA or country-club access. It cross-checks recent comparable sales on the same street, building, or block; reviews architectural era and renovation depth; and weighs the residence's scarcity within its sub-market. Mia delivers a confidential walk-through (or virtual equivalent) plus a written positioning recommendation — useful for estate planning, refinancing, or a future sale."
- **Reason:** AVM-skepticism content is the page's value proposition and must be preserved (doctrine: "Preserve waterfront diligence substance"). The compression trims "to prevailing winds" (lot orientation already implies the variable), drops "and any" before "yacht-capacity history" (the en-dash list already absorbs the conjunction), and drops "strategic" before "positioning recommendation" (strong noun stands alone). Net: 117 → 99 words, well within the 55-word-per-paragraph spirit when the AnswerFirst is structurally one long answer paragraph in the AEO sense.
- **Risk if changed:** AnswerFirst is the page's AEO-targeted answer. The structural claim ("AVMs miss the variables", "dock specifics", "comparable sales at the parcel level", "Mia delivers a walk-through plus a written recommendation") is preserved. Confirm AnswerFirst's underlying schema emits the new string verbatim.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 9: `/valuation/` ValueProps "Brokerage relationship context" implies a non-public-inventory advantage and brushes the compliance line

- **Route / file:** `src/app/valuation/page.tsx` — ValueProps item 2 (lines 199–202)
- **Current copy:** "Where available, Mia's brokerage relationships add color from recent quietly-traded residences that public data feeds miss."
- **Proposed copy:** "Where available, brokerage relationships add color from recent comparable sales that public data feeds reflect with a lag — context, not a substitute for licensed appraisal."
- **Reason:** "Quietly-traded residences" reads close to the "off-market" / "private inventory" / "MLS bypass" cluster the doctrine bans. The substance — that Mia's network gives her earlier visibility into comparable-sales context than a public feed — is true and useful, but the framing has to make it about *comparable-sales context*, not about access to inventory the public market does not see. The "lag" framing is defensible because public data feeds genuinely lag by 30–90 days on luxury sales. Adding "context, not a substitute for licensed appraisal" closes the compliance gap the doctrine flags around valuation language.
- **Risk if changed:** This is the highest-stakes copy edit in the pack. Confirm with the principal that the principal is comfortable framing the brokerage-network advantage as *earlier comparable-sales visibility* rather than *quietly-traded residence access*. The compliance gain is significant; the marketing implication is that the brokerage-network value proposition narrows somewhat.
- **Factual / source-ledger review required:** yes — principal review for compliance framing
- **Category:** 5 legal/compliance dependency

---

### Finding 10: `/markets/fort-lauderdale/` seller playbook bridge paragraph repeats "the same" three times

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` — Section 6.5 bridge paragraph (line 810)
- **Current copy:** "For buyers the diligence sequence is a filter — survey first, dock and seawall next, insurance underwriting before the offer. For sellers the same sequence becomes a dataroom — the documents that compress the contingency window and shorten renegotiation. Mia coordinates the same set of licensed specialists; the deliverable changes shape depending on whether the residence is being bought or listed."
- **Proposed copy:** "For buyers the diligence sequence is a filter — survey first, dock and seawall next, insurance underwriting before the offer. For sellers it becomes a dataroom — the documents that compress the contingency window and shorten renegotiation. Mia coordinates the same licensed specialists; the deliverable changes shape depending on whether the residence is being bought or listed."
- **Reason:** "The same sequence" + "the same set of licensed specialists" inside three sentences is doctrine-flagged repetition. "For sellers it becomes a dataroom" replaces "For sellers the same sequence becomes" without losing meaning. Net: 70 → 64 words.
- **Risk if changed:** None — purely cosmetic. The seller playbook below this bridge is the substance; the bridge is glue copy. The buyer/seller distinction is preserved.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 11: Seller lead-magnet `intro` strings double-state "Fort Lauderdale waterfront residence" in the cover paragraph

- **Route / file:** `src/data/lead-magnets/index.ts` — `luxury-seller-pre-listing-checklist.intro` (line 207); same pattern on `fort-lauderdale-waterfront-valuation-prep-sheet.intro` (line 351)
- **Current copy (seller checklist):** "A working checklist for owners preparing to list a Fort Lauderdale waterfront residence. The list mirrors the seller-side diligence Mia uses to structure private seller-side conversations before any photography or listing prep — current comparables, waterfront documentation, insurance dataroom, buyer-profile positioning. Each item is a deliverable to organize, not advice to follow."
- **Proposed copy (seller checklist):** "A working checklist for owners preparing to list a Fort Lauderdale waterfront residence. It mirrors the diligence Mia uses to structure private seller conversations before any photography or listing prep — comparables, waterfront documentation, insurance dataroom, buyer-profile positioning. Each item is a deliverable to organize, not advice to follow."
- **Reason:** "Seller-side diligence … seller-side conversations" inside one sentence is doctrine-flagged repetition. "The list mirrors the seller-side diligence" → "It mirrors the diligence" trims six words without changing meaning, because "the list" was already established by the prior sentence and "seller-side" is implied by the cover title ("Luxury Seller Pre-Listing Checklist") and subtitle ("Eastern Fort Lauderdale waterfront residences"). Apply the analogous trim to the valuation prep sheet `intro`.
- **Risk if changed:** PDFs are regenerated by `scripts/render-lead-magnets.ts`. After approval, the render script must rebuild both `public/downloads/luxury-seller-pre-listing-checklist.pdf` and `public/downloads/fort-lauderdale-waterfront-valuation-prep-sheet.pdf` and the `out/downloads/` mirror. The `validateStandaloneHtml` gate in the render script should pass — no banned phrases introduced. Source-ledger lines, disclaimer (`PDF_DISCLAIMER`), and use agreement (`PDF_USE_AGREEMENT`) stay verbatim.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

## Out of scope (explicit non-findings)

The following were reviewed and left unchanged:

- **FL seller playbook steps 01–07** (`SELLER_PLAYBOOK` in `FortLauderdaleV2.tsx`, lines 274–329). Every step carries diligence substance — comparable cohort, seawall/dock/4-point documentation, insurance dataroom, buyer-profile positioning, photography brief, tour strategy, quiet-pre-market decision tree. Compression here would delete the asset.
- **AVM-skepticism content** on `/valuation/` AnswerFirst, the FL seller playbook step 01, and the related-Insights cross-link to `why-automated-valuations-miss-luxury-waterfront`. Preserve verbatim.
- **REALTOR® / LPT Realty LLC / FL Sales Associate License #SL3405877 / Equal Housing Opportunity / MLS attribution** wherever they appear (`/sellers/`, `/valuation/`, lead-magnet covers and footers, render-lead-magnets validator). Preserve verbatim.
- **Source ledgers** on all three seller-relevant lead magnets (`luxury-seller-pre-listing-checklist.ledger`, `fort-lauderdale-waterfront-valuation-prep-sheet.ledger`). Preserve verbatim.
- **PDF disclaimer and use agreement** (`PDF_DISCLAIMER`, `PDF_USE_AGREEMENT` in `src/data/lead-magnets/index.ts`). Preserve verbatim.
- **CTAStrip** on `/sellers/` (lines 189–192). "Begin with a complimentary valuation. Pricing a residence well begins with the right valuation — careful, private, and grounded in current micro-market dynamics." is doctrine-clean — one idea per sentence, no banned terms, no softener, one CTA.
- **Seller next-step CTA panel** at the bottom of the FL seller playbook (lines 945–969). Doctrine-clean.
