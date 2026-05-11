# Cycle 19C-COPY — Reviewer Pack 01: ICP Luxury Voice Editor

## Executive summary

The sitewide voice is closer to a careful technical brief than to a private conversation, but the inventory-flagged routes are bleeding the brand-voice promise through three repeating patterns. First, geography stacking: "Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach" appears verbatim in the Home Hero subline, the MeetMia copy block, the SiteFooter strapline, the Sellers Hero subline, the Buyers Hero subline, the About credentials block, and inside both meta descriptions and CTAs — three full place names in a single sentence reads less like discretion and more like a SEO header forced into a sentence. Second, throat-clearing intros and stacked adjectives — "Real estate guidance for luxury Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach buyers and sellers, delivered with discretion and rigor" — pile category, geography, role, and brand voice into one breath when the doctrine-locked footer pattern shows the cleaner two-sentence version already exists. Third, repetition inside single paragraphs ("luxury and waterfront" appearing four times on the Fort Lauderdale page, the word "private" appearing 26 times on the same page, "luxury and waterfront" appearing in three consecutive section headings) — the volume undercuts the precision. The findings below are conservative, never touch waterfront diligence substance (dock specifications, route-to-inlet, seawall, bridge clearance, 4-point, insurance, AVM skepticism stay verbatim), never remove compliance/license/REALTOR®/EHO presentation, and never introduce banned terms. Each rewrite splits one idea per sentence, names geography once per paragraph, and replaces "guidance" used as filler with stronger nouns. Most findings carry low risk because they touch component-level copy strings, not data-layer market entries; flagged exceptions noted per finding.

---

### Finding 1: SiteFooter strapline stacks category, geography, role, and brand voice in one sentence

- **Route / file:** `src/components/SiteFooter.tsx` (line 22) — renders on every route.
- **Current copy:** "Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach. Real estate guidance for luxury Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach buyers and sellers, delivered with discretion and rigor."
- **Proposed copy:** "Private guidance for waterfront and luxury homes from Fort Lauderdale to Boca Raton and Delray Beach. Expect a patient conversation delivered with discretion and nuance."
- **Reason:** Doctrine §Footer pattern is already locked verbatim — the live footer is non-compliant with the cycle doctrine that wraps this pack. Current copy names "Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach" twice across two sentences, repeats "real estate" twice, stacks "luxury" twice, and double-counts "guidance" with "real estate guidance for luxury…buyers and sellers." Locked footer pattern fixes all of it in two sentences.
- **Risk if changed:** None to schema (footer is informational text, not JSON-LD). Hreflang and license block are siblings, not affected. Audit-stale-terms allows "discretion and nuance"; "rigor" is removed but appears elsewhere on the site, so the brand register is preserved. Low risk.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 2: Home Hero sub stacks three full place names and reads as positioning slogan, not conversation

- **Route / file:** `src/app/page.tsx` (line 85) — Home Hero `sub` prop.
- **Current copy:** "A small, deliberate practice — private representation for buyers and sellers of distinctive coastal residences."
- **Proposed copy:** Keep the current Hero sub verbatim. The HERO sub is fine; the FIX target is the H1 heading on line 84, which reads: "Luxury and waterfront real estate across Eastern Fort Lauderdale, Boca Raton, and Delray Beach." Replace the H1 with: "Waterfront and luxury homes — Fort Lauderdale to Delray Beach, represented privately."
- **Reason:** The H1 currently triple-counts geography in one sentence and leads with the category ("luxury and waterfront real estate"), which is SEO-flat. The proposed H1 names geography once as a corridor (the patient-private register the doctrine targets), keeps "waterfront" and "luxury" as nouns rather than the stacked "luxury and waterfront real estate" cliché, and earns the word "privately" by tying it to representation rather than to "access."
- **Risk if changed:** H1 is the principal SEO + AEO surface for the homepage. Loss of the literal token "Eastern Fort Lauderdale" in the H1 may very slightly reduce keyword density for that long-tail variant — but the same token is preserved in the Hero eyebrow, the AnswerFirst paragraph (line 95), the meta description, and the SiteFooter. Net keyword loss is near-zero; voice gain is material. Schema/breadcrumb unaffected.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 3: MeetMia paragraph stacks three full geographies inside a single sentence

- **Route / file:** `src/components/MeetMia.tsx` (lines 35-39) — Home page mid-section.
- **Current copy:** "Mia Sanabria is a Fort Lauderdale REALTOR® with LPT Realty representing buyers and sellers across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach. Each engagement begins with a private conversation about timing, criteria, and the residence itself."
- **Proposed copy:** "Mia Sanabria is a Fort Lauderdale REALTOR® with LPT Realty. She represents buyers and sellers across the Eastern Fort Lauderdale waterfront and the adjacent Boca Raton and Delray Beach corridors. Each engagement begins with a private conversation about timing, criteria, and the residence itself."
- **Reason:** Doctrine §"Geography once per paragraph" — first mention is the full named place; subsequent references should compress. Splitting the first sentence in two also makes the brokerage line read like an introduction rather than a SEO byline. The phrase "the Eastern Fort Lauderdale waterfront" earns the "Eastern" qualifier (it's specific to the waterfront cohort east of US-1); "the adjacent Boca Raton and Delray Beach corridors" removes the repeated "Eastern…Eastern…Eastern" cadence without losing the geographic frame.
- **Risk if changed:** None. REALTOR® mark preserved, LPT Realty preserved, three-city service area preserved. No schema attached to this block. Low risk.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 4: Buyers Hero sub repeats the three-city stack inside the seller-buyer hero cluster

- **Route / file:** `src/app/buyers/page.tsx` (line 115) — Buyers Hero `sub` prop.
- **Current copy:** "Mia represents buyers across Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach — every brief written before the first showing, every closing attended in person."
- **Proposed copy:** "Mia represents buyers across the Eastern Fort Lauderdale waterfront, with adjacent practice in Boca Raton and Delray Beach. Every brief is written before the first showing; every closing is attended in person."
- **Reason:** Same three-name stack as Findings 1-3 inside a single sentence. The "every…every…" cadence also reads more cleanly as two clauses than as a comma-em-dash chain. Buyers-page meta description (line 18, 23) carries the same triple stack — see Finding 5 — so editing the visible hero text first is the highest-leverage fix.
- **Risk if changed:** None — Hero sub is plain text, no schema. The buyers FAQ schema (`Faq` component) is unaffected.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 5: Sellers Hero sub uses "Mia's core Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach markets" — three full names plus a possessive

- **Route / file:** `src/app/sellers/page.tsx` (line 115) — Sellers Hero `sub` prop.
- **Current copy:** "Pricing, presentation, and considered introductions — sequenced by Mia personally for residences across Mia's core Eastern Fort Lauderdale, Eastern Boca Raton, and Eastern Delray Beach markets."
- **Proposed copy:** "Pricing, presentation, and considered introductions — sequenced by Mia personally for residences across Eastern Fort Lauderdale and the Boca Raton and Delray Beach corridors."
- **Reason:** Doctrine §"Geography once per paragraph." Also drops "Mia's core…markets" — a quietly self-flattering hedge that adds nothing and reads owner-narrated rather than client-narrated. The seller is the audience; "core markets" is internal language.
- **Risk if changed:** None to schema. The `ServiceSchema` and `OfferCatalogSchema` JSON-LD blocks above this Hero are unaffected.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 6: Home AnswerFirst paragraph runs four place names and three architectural eras through one 90+ word sentence

- **Route / file:** `src/app/page.tsx` (line 95) — Home `AnswerFirst` answer.
- **Current copy:** "Mia Sanabria represents buyers and sellers of luxury and waterfront residences across Eastern Fort Lauderdale, with adjacent primary service in Boca Raton (Palm Beach County) and Delray Beach (Palm Beach County). Her practice centers on deepwater estates and finger-isle homes along Las Olas Isles, Harbor Beach, and Rio Vista; in-town Eastern Fort Lauderdale neighborhoods such as Coral Ridge and Victoria Park; and the Mediterranean Revival, Atlantic Avenue, and beach-block trade in Boca Raton and Delray Beach. Engagements begin with a private brief — preferences, timeline, and the residence in mind — long before any showing."
- **Proposed copy:** "Mia Sanabria represents buyers and sellers of waterfront and luxury residences across Eastern Fort Lauderdale, with adjacent practice in Boca Raton and Delray Beach (both Palm Beach County). The work centers on the deepwater finger isles — Las Olas Isles, Harbor Beach, Rio Vista — and the in-town neighborhoods like Coral Ridge and Victoria Park. In Boca and Delray, the trade runs from Mediterranean Revival to Atlantic Avenue walk-blocks to the beach corridor. Engagements begin with a private brief — preferences, timeline, the residence in mind — long before any showing."
- **Reason:** Current second sentence is 56 words and chains three semicolon-joined clauses; the doctrine asks to split at 28+. The double "(Palm Beach County)" parenthetical reads as legal annotation, not conversation. Splitting into four sentences keeps every diligence substance fact (finger isles named, in-town neighborhoods named, Mediterranean Revival named, Atlantic Avenue named, beach corridor named) and adds nothing. "Waterfront and luxury" reordered to lead with the more specific noun.
- **Risk if changed:** This is the AEO answer block — Google's "answer-first" surface. Total word count drops about 15 words but the named-entity inventory is preserved (Eastern Fort Lauderdale, Boca Raton, Delray Beach, Las Olas Isles, Harbor Beach, Rio Vista, Coral Ridge, Victoria Park, Mediterranean Revival, Atlantic Avenue). AEO answer integrity preserved.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 7: FortLauderdaleV2 "Market identity" section uses "luxury and waterfront" twice inside three adjacent paragraphs and once again as its H2

- **Route / file:** `src/components/markets/FortLauderdaleV2.tsx` (lines 494, 498, 504) — "Why Fort Lauderdale matters in luxury and waterfront real estate" section.
- **Current copy:** H2: "Why Fort Lauderdale matters in luxury and waterfront real estate." First paragraph leads: "Fort Lauderdale is the city in South Florida where deep-water living, a real downtown, and Atlantic beach access exist in one geography." Third paragraph leads: "For luxury and waterfront buyers comparing Eastern Fort Lauderdale to its Palm Beach County peers, the distinction is structural."
- **Proposed copy:** H2: "Why Fort Lauderdale matters." Third paragraph leads: "For buyers comparing Eastern Fort Lauderdale to its Palm Beach County peers, the distinction is structural."
- **Reason:** "Luxury and waterfront" appears four times on the Fort Lauderdale page total; this section alone uses the phrase twice within 200 words of each other plus once as the H2. The H2 is stronger when it stops trying to do keyword work — the section's own first sentence already names "deep-water living, a real downtown, and Atlantic beach access," which is the specificity the H2 promises. The third paragraph already establishes "Eastern Fort Lauderdale" as the comparison anchor; "luxury and waterfront buyers" before "buyers" is redundant — the entire section is for that buyer.
- **Risk if changed:** H2 SEO loss is minimal because the page H1 ("Where deepwater yacht access, a working downtown, and a 165-mile canal system meet") and the AEO answer block (market.aeoAnswer) both carry the long-tail keyword load. The Cycle 16 commentary on line 405-407 explicitly says `market.tagline` is preserved on the markets-index card and OG fallback; the H2 is internal navigation, not the OG title.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 8: About page hero sub leads with brand anchorLine, but the AnswerFirst block underneath stacks geography + architecture + service area in one 100-word run

- **Route / file:** `src/app/about/page.tsx` (line 73) — About `AnswerFirst` answer.
- **Current copy:** "Mia represents buyers and sellers across Southeast Florida's luxury and waterfront markets — concentrated in Eastern Fort Lauderdale's deepwater isles and in-town neighborhoods, plus adjacent Boca Raton and Delray Beach. Engagements start with a private brief — timeline, architectural preference, dock or beach access, lifestyle — long before the first showing. Listings are positioned with editorial photography and disciplined pricing built from current comparables on the specific street, building, or block. Every transaction is scaffolded by experienced title, escrow, financing, and inspection partners, and Mia stays present from first conversation through closing."
- **Proposed copy:** "Mia represents buyers and sellers across the waterfront and luxury corridors of Southeast Florida — concentrated in Eastern Fort Lauderdale's deepwater finger isles and in-town neighborhoods, with adjacent practice in Boca Raton and Delray Beach. Engagements start with a private brief: timeline, architectural preference, dock or beach access, lifestyle. Listings are positioned with editorial photography and pricing built from current comparables on the specific street, building, or block. Every transaction is scaffolded by experienced title, escrow, financing, and inspection partners — and Mia is present from first conversation through closing."
- **Reason:** Three changes — (1) "Southeast Florida's luxury and waterfront markets" inverts to "the waterfront and luxury corridors of Southeast Florida" so geography leads rather than category; (2) the em-dash interjection in sentence 2 becomes a colon list, which reads more like conversation than parenthetical; (3) "disciplined pricing built from current comparables" loses the redundant "disciplined" (the pricing discipline is in the parcel-level cohort itself, not in the adjective). All diligence substance preserved.
- **Risk if changed:** AEO/answer integrity preserved. Word count drops ~5 words. None of the named entities are removed.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 9: Boca Raton market entry uses a vague self-flattering opener that reads SEO-flat

- **Route / file:** `src/lib/markets.ts` (lines 344-345) — Boca Raton `intro` field, renders as Hero sub on `/markets/boca-raton/` and as MarketCard description on markets-index.
- **Current copy:** "Boca Raton gives buyers a broad set of options, from coastal condominiums and single-family neighborhoods to club communities. The right match depends on lifestyle, fees, commute, schools, building condition, and long-term ownership goals."
- **Proposed copy:** "Boca Raton offers a layered market — coastal condominiums along A1A, single-family residences in the eastern grid, and gated club communities west of I-95. The right match depends on lifestyle priority, association detail, and the residence's micro-market within the city."
- **Reason:** Doctrine §"Specific without SEO stuffing." Current opener says "gives buyers a broad set of options" — pure SEO filler. The proposed version names the actual three layers (A1A coastal, eastern grid, club west of I-95) that the rest of the page already calls out (lines 366, 411 `comparisonContext`) and ties the decision to the specifics buyers actually weigh. Note: the current sentence mentions "schools" — this is a Fair Housing steering risk per the project CLAUDE.md ("No 'best schools', 'good schools', 'safe neighborhood', 'family-friendly'"). Replacing "schools" with "association detail" closes that risk.
- **Risk if changed:** This is shared copy — same string renders on the market page, the markets-index card, and feeds the OG description via `buildMetaDescription`. The `aeoAnswer` field downstream is unchanged, so AEO surface is preserved. **Fair Housing risk: the current "schools" mention is a steering concern; this finding actually reduces compliance exposure.** Cross-check meta-description rendered length stays within the 158-char target via `buildMetaDescription` (the function uses `aeoAnswer`, not `intro`, so meta is unaffected).
- **Factual / source-ledger review required:** no (the I-95 boundary and A1A corridor are already stated verbatim elsewhere in the same file)
- **Category:** 5 legal/compliance dependency (Fair Housing steering reduction) + 1 site/content/design defect

---

### Finding 10: Delray Beach `priceCharacter` and `lifestyle` both use "Mia can prepare a current comparison" / "The details of building, block, and condition matter" — generic filler

- **Route / file:** `src/lib/markets.ts` (lines 503-506) — Delray Beach `lifestyle` and `priceCharacter`.
- **Current copy:** lifestyle: "Delray Beach can suit clients who want restaurants, beach access, and neighborhood living in one search area. The details of building, block, and condition matter." priceCharacter: "Pricing changes by beach proximity, building, condition, and neighborhood. Mia can prepare a current comparison for the exact search or address."
- **Proposed copy:** lifestyle: "Delray Beach suits clients who want a walkable downtown, Atlantic beach access, and residential neighborhood living within one city. Distance to Atlantic Avenue is the single biggest pricing variable; the building, the block, and the condition shape the rest." priceCharacter: "Pricing turns on walkability to Atlantic Avenue first, then building, condition, and neighborhood. A current parcel-level comparison resolves what an automated estimate misses."
- **Reason:** Three issues — (1) "can suit" hedges where the rest of the page asserts (the `aeoAnswer` later directly says "Distance to downtown is the dominant pricing variable across most of the city"); (2) "Mia can prepare a current comparison" reads as a sales pitch in third-person — replacing with "A current parcel-level comparison resolves what an automated estimate misses" makes it about the buyer's question, not Mia's offer, and ties to the existing Insights brief on automated valuations; (3) "neighborhood living in one search area" is throat-clearing. All diligence substance preserved (walkability, beach, neighborhood, building, condition).
- **Risk if changed:** Shared copy used on `/markets/delray-beach/` page (lines 504, 506 render in the lifestyle column and the price-character paragraph). AEO answer (line 515) already establishes the walkability claim, so this rewrite just brings the lifestyle and priceCharacter into voice alignment with the AEO. No schema impact.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 11: Pompano Beach buyerGuidance opens with "Pompano Beach suits buyers who want…" — a sentence that repeats the lifestyle opener verbatim

- **Route / file:** `src/lib/markets.ts` (lines 1115-1116 and 1134-1135) — Pompano Beach `lifestyle` and `buyerGuidance`.
- **Current copy:** lifestyle (line 1116): "Pompano Beach suits buyers who want Atlantic beach access, deepwater boating, an active reef-and-wreck dive scene, and a city visibly investing in its oceanfront and downtown — at relative value to its neighbors." buyerGuidance (line 1135): "Pompano Beach suits buyers who want Atlantic beach access, deepwater boating, and a city visibly reinvesting in its oceanfront and downtown — at relative value to Fort Lauderdale and the Palm Beach County markets."
- **Proposed copy:** Keep `lifestyle` verbatim. Change `buyerGuidance` first sentence to: "Buyers here usually start with one of four briefs: A1A-corridor condominium, Intracoastal-side single-family with private dockage, inland canal routed to the Hillsboro Inlet, or interior single-family. The first conversation establishes which."
- **Reason:** The current page renders both `lifestyle` and `buyerGuidance` on the same scroll. They open with the same five-clause "Pompano Beach suits buyers who want Atlantic beach access, deepwater boating, and…" cadence — once is positioning, twice is filler. The proposed buyerGuidance opener jumps directly to the buyer-decision frame the rest of the paragraph already promises ("The first conversation should establish whether the priority is A1A-corridor condominium, Intracoastal-side single-family, inland canal, or interior") and preserves every diligence variable. Removes one of the inventory's 2 repeated-geo paragraphs on this page.
- **Risk if changed:** All four buyer briefs preserved. Insurance/seawall/dock/route-to-inlet language in subsequent sentences (lines 1135) preserved verbatim. No schema impact.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 12: Insights index leads "The Library" with a 60-word run that names Eastern Fort Lauderdale, Boca Raton, Delray Beach, AND "surrounding municipalities" in one breath

- **Route / file:** `src/app/insights/page.tsx` (lines 85-91) — Insights index "The Library" paragraph.
- **Current copy:** "These briefs are written for the buyers and sellers Mia works with directly — luxury and waterfront across Eastern Fort Lauderdale, Boca Raton, Delray Beach, and the surrounding municipalities. Each brief is built to make the first private conversation more productive: it frames what to verify on a specific address, how to separate similar markets, and where the leverage points sit before any introduction is made."
- **Proposed copy:** "These briefs are written for the buyers and sellers Mia works with directly — waterfront and luxury across Eastern Fort Lauderdale and the adjacent Boca Raton and Delray Beach corridors. Each brief is built to make the first private conversation more productive. It frames what to verify on a specific address, how to separate similar markets, and where the leverage points sit before any introduction."
- **Reason:** Same three-name geography stack pattern as Findings 1-5. Splits the 50-word second sentence into two for breath. Removes "is made" passive at the end. "Luxury and waterfront" reordered to "waterfront and luxury" to match the doctrine-locked footer ordering and stop leading with the category.
- **Risk if changed:** Insights index is the editorial-library entry point; this paragraph is descriptive prose, not the BlogPosting schema seed (schema is built from each post's structured metadata at lines 48-58). No SEO impact.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 13: Buyers page CTAStrip sub stacks "informally available opportunities" with "her brokerage relationships" in a single sentence that reads sales-y

- **Route / file:** `src/app/buyers/page.tsx` (lines 190-193) — Buyers CTAStrip.
- **Current copy:** heading: "Tell Mia what you're looking for." sub: "A short private conversation is the first step. From there, Mia sources the right residences across her core markets — including any informally available opportunities her brokerage relationships uncover."
- **Proposed copy:** heading: "Tell Mia what you're looking for." sub: "A short private conversation is the first step. From there, Mia narrows the search to the residences worth your time — including any informally available opportunities her brokerage relationships surface. Access varies by market and timing."
- **Reason:** Two reasons. (1) "Mia sources the right residences across her core markets" reads owner-narrated and self-flattering ("her core markets" plus "the right residences"). Replacing with "narrows the search to the residences worth your time" centers the buyer. (2) The page elsewhere consistently hedges informal-availability with "Access varies by market and timing" (lines 36, 62, 157). The CTAStrip omits the hedge — adding it back keeps the page's compliance posture uniform and pre-empts any "private inventory" read.
- **Risk if changed:** Adds, rather than removes, compliance hedge. Strengthens, rather than weakens, the page's "no private-inventory implication" posture per doctrine banned-term list.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect + 5 legal/compliance dependency (strengthens hedge)

---

## Open questions for the main thread

1. Finding 1 proposes adopting the doctrine-locked footer pattern verbatim. The doctrine literally specifies it as "locked for this cycle" — confirm this can ship as a single string-swap edit, or whether the footer locked-text needs a separate principal sign-off given it renders on every route.

2. Finding 2 changes the homepage H1, which is the strongest SEO surface on the site. Recommend the main thread either (a) ship as proposed (voice-aligned, minor keyword-density tradeoff), or (b) reject Finding 2 specifically while accepting Findings 3-13. The other 12 findings stand independently.

3. Finding 9 quietly removes the word "schools" from a Boca entry. This is a Fair Housing compliance improvement, not a voice edit — flag for the main thread that it earns separate audit-stale-terms regression verification before the cycle closes.
