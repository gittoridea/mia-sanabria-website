# Cycle 19C-COPY — Reviewer Pack 08 · PDF Copy Editor

**Author role:** PDF Copy Editor
**Scope:** the three downloadable lead-magnet PDFs rendered from `src/data/lead-magnets/index.ts` by `scripts/render-lead-magnets.ts`.
**Audited PDFs:**
1. `public/downloads/waterfront-buyer-due-diligence-checklist.pdf`
2. `public/downloads/luxury-seller-pre-listing-checklist.pdf`
3. `public/downloads/fort-lauderdale-waterfront-valuation-prep-sheet.pdf`

**Source-of-truth for PDF copy:** `src/data/lead-magnets/index.ts` (the renderer pulls text fields verbatim from each `LeadMagnet` record; only headings/items/HTML wrappers are added).

## Executive summary

The three PDFs are already inside the doctrine voice (private, patient, precise) and have zero banned-term hits — no "off-market", "exclusive access", "definitive access point", "world-class", "premier", "elite", or response-time promises. Source ledger, `PDF_DISCLAIMER`, `PDF_USE_AGREEMENT`, REALTOR®/LPT Realty/license attribution and `Broward County Property Appraiser` anchor are all present and clean. The remaining work is **compression and de-repetition** in long intros and how-to-use blocks — not voice correction.

Categories of finding observed:
- Long intro paragraphs that bury the magnet's promise in two ideas joined by an em-dash or "and".
- Repeated "diligence", "diligence sequence", or "diligence substance" inside one paragraph.
- "Seller-side" used twice in one sentence in the seller intro.
- A few items with two ideas joined by "and" that read sharper when split.
- One redundant `sub` line on the valuation "Next step" section that restates the previous body sentence.

**No changes proposed to:** `PDF_DISCLAIMER`, `PDF_USE_AGREEMENT`, source-ledger rows, REALTOR® / MLS / EHO / license / brokerage attribution, or the `PDF_FOOTER` line. Those are preserved verbatim per scope.

**Total findings:** 9 across 3 PDFs (3 / 3 / 3).

**Regen required if any finding is accepted:** all accepted edits land in `src/data/lead-magnets/index.ts`, then `bun run build:pdfs` rebuilds the three PDFs, then `bun run audit:lead-magnets` confirms zero forbidden hits and intact required substrings. The render is shared, so any one accepted edit regenerates one PDF; multiple acceptances are a single rebuild.

---

## PDF 1 — Waterfront Buyer Due Diligence Checklist

### Finding 1: `intro` repeats "diligence" three times in three sentences

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `waterfront-buyer-due-diligence-checklist`, `intro` field)
- **Current copy:** "A working checklist for serious buyers of Fort Lauderdale waterfront residences. The list is organized by the diligence sequence Mia uses to structure private buyer-side conversations — survey first, water and dock data next, insurance underwriting before the offer. Each item is a question to bring to a licensed specialist, not a substitute for one."
- **Proposed copy:** "A working checklist for serious buyers of Fort Lauderdale waterfront residences. Mia uses this sequence to structure private buyer-side conversations — survey first, water and dock data next, insurance underwriting before the offer. Each item is a question to bring to a licensed specialist, not a substitute for one."
- **Reason:** "diligence sequence" / "private diligence sequence" / "diligence substance" stack across this intro and `whoFor`; doctrine "Avoid → Stacking" + "Decision rule → if a phrase repeats inside the same paragraph, replace or remove."
- **Risk if changed:** none — file edit only, no schema, no SEO surface; required substrings (title, disclaimer prefix, license, ledger anchor) are unchanged.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

### Finding 2: `whoFor` reuses "private" + "diligence sequence" already in intro

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `waterfront-buyer-due-diligence-checklist`, `whoFor` field)
- **Current copy:** "Serious buyers of Eastern Fort Lauderdale waterfront residences who want a private diligence sequence before making an offer."
- **Proposed copy:** "Serious buyers of Eastern Fort Lauderdale waterfront residences who want a structured pre-offer review."
- **Reason:** "private diligence sequence" duplicates two doctrine-anchor words (`private`, `diligence sequence`) already carried by the intro paragraph above it; doctrine "Preferred patterns → Strong nouns, restrained adjectives" and "Decision rule → if a phrase repeats inside the same paragraph (here, same section header), replace or remove."
- **Risk if changed:** none — "Private Buyer Brief" CTA on the same page still anchors the brand-voice word "private".
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

### Finding 3: `howToUse` final clause is wordier than the work it describes

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `waterfront-buyer-due-diligence-checklist`, `howToUse` field)
- **Current copy:** "Work through the sections in order — survey first, then water and dock data, then insurance underwriting. Bring each question to the relevant licensed specialist; this checklist coordinates the conversation, it does not replace expert findings."
- **Proposed copy:** "Work through the sections in order — survey first, then water and dock data, then insurance underwriting. Bring each question to the relevant licensed specialist. The checklist coordinates the conversation; the specialist's findings are the ground truth."
- **Reason:** original second sentence joins two ideas with a comma splice; "does not replace expert findings" is also softer than the brand-voice "specialists' findings are the ground truth" already used in the buyer's Specialist-roster sub. Doctrine "Preferred patterns → one idea per sentence" + voice consistency.
- **Risk if changed:** none. Phrase "the specialists' findings are the ground truth" already appears verbatim later in the same PDF (Specialist roster `sub`), so it reinforces a deliberate house phrase rather than introducing a new claim.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

## PDF 2 — Luxury Seller Pre-Listing Checklist

### Finding 4: `intro` uses "seller-side" twice in one sentence

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `luxury-seller-pre-listing-checklist`, `intro` field)
- **Current copy:** "A working checklist for owners preparing to list a Fort Lauderdale waterfront residence. The list mirrors the seller-side diligence Mia uses to structure private seller-side conversations before any photography or listing prep — current comparables, waterfront documentation, insurance dataroom, buyer-profile positioning. Each item is a deliverable to organize, not advice to follow."
- **Proposed copy:** "A working checklist for owners preparing to list a Fort Lauderdale waterfront residence. The list mirrors the seller-side diligence Mia uses to structure private listing conversations before any photography or listing prep — current comparables, waterfront documentation, insurance dataroom, buyer-profile positioning. Each item is a deliverable to organize, not advice to follow."
- **Reason:** "seller-side diligence" + "private seller-side conversations" in the same sentence is the exact pattern doctrine flags ("Avoid → Stacking 'luxury and waterfront' multiple times in one paragraph" — same anti-pattern applied to "seller-side"). The first "seller-side" carries the meaning; the second can drop.
- **Risk if changed:** none — `whoFor` and `documentsToRequest` already say "list", so the noun pair stays coherent.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

### Finding 5: "Editorial photography and dock-up narrative" item 1 is a 28-word sentence with two ideas joined by a dash

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `luxury-seller-pre-listing-checklist`, `sections[4].items[0]`)
- **Current copy:** "Photography that captures the lot, the route to the inlet, the dock, and the lanai — not only the interiors."
- **Proposed copy:** "Photography that captures the lot, the route to the inlet, the dock, and the lanai. Interiors alone under-represent a waterfront residence."
- **Reason:** doctrine "Decision rule → if a sentence has two ideas joined by a comma or em-dash, ask whether splitting reads sharper." The second clause is doing real teaching work ("don't lean on interiors alone") and earns its own sentence; the first reads as a clean noun list once the dash is gone.
- **Risk if changed:** none — adds one short sentence; PDF page-count target still inside the audit's `[2, 10]` page range.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

### Finding 6: "Buyer-profile positioning" item 3 is wordy advisory phrasing

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `luxury-seller-pre-listing-checklist`, `sections[6].items[2]`)
- **Current copy:** "Document the positioning rationale in writing so the strategy stays coherent if market conditions shift."
- **Proposed copy:** "Document the positioning rationale in writing so the strategy holds if market conditions shift."
- **Reason:** "stays coherent" → "holds"; one strong verb replaces a softer two-word phrase. Doctrine "Preferred patterns → strong nouns, restrained adjectives" extended to strong verbs.
- **Risk if changed:** none — meaning preserved; reads more decisive.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

## PDF 3 — Fort Lauderdale Waterfront Valuation Prep Sheet

### Finding 7: `intro` second sentence is a 30-word two-clause chain

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `fort-lauderdale-waterfront-valuation-prep-sheet`, `intro` field)
- **Current copy:** "A prep sheet for owners requesting a confidential, property-specific valuation. Public estimates miss the variables that drive waterfront price; this is the residence-specific information Mia uses to draw the right comparable cohort and frame an honest valuation conversation."
- **Proposed copy:** "A prep sheet for owners requesting a confidential, property-specific valuation. Public estimates miss the variables that drive waterfront price. This is the residence-specific information Mia uses to frame an honest valuation conversation."
- **Reason:** doctrine "Decision rule → if a sentence is over 28 words and splitting preserves meaning, split." The "draw the right comparable cohort and frame an honest valuation conversation" pair is restated almost verbatim in the section 10 `sub` ("frame a residence-specific comparable cohort rather than a generic neighborhood range") — so dropping it here removes a same-document repeat, not a unique idea.
- **Risk if changed:** none — required substrings (title, disclaimer prefix, license, ledger anchor) untouched.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

### Finding 8: `howToUse` second sentence buries a single instruction inside a generic clause

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `fort-lauderdale-waterfront-valuation-prep-sheet`, `howToUse` field)
- **Current copy:** "Gather what you can answer; leave blanks where you can't. Mia uses your responses to frame a residence-specific comparable cohort instead of a generic neighborhood range."
- **Proposed copy:** "Gather what you can answer; leave blanks where you can't. Mia uses your responses to draw a residence-specific comparable cohort, not a generic neighborhood range."
- **Reason:** "frame… instead of" → "draw… not" is shorter and more concrete; "draw a comparable cohort" is the working-realtor verb. Light edit; preserves both ideas and the doctrine voice (patient, precise).
- **Risk if changed:** none — same instruction, sharper verb.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

### Finding 9: "Next step" `sub` line restates the same idea already in the body

- **Route / file:** `src/data/lead-magnets/index.ts` (slug `fort-lauderdale-waterfront-valuation-prep-sheet`, `sections[9].sub`)
- **Current copy:** "The information above lets Mia frame a residence-specific comparable cohort rather than a generic neighborhood range."
- **Proposed copy:** _(drop the `sub` field entirely; the two `items` already point the reader to the next action.)_
- **Reason:** if Finding 7 or Finding 8 lands, the same phrase ("residence-specific comparable cohort" vs "generic neighborhood range") now appears three times in one PDF — `intro`, `howToUse`, and this `sub`. Doctrine "If a section header restates the next paragraph's first sentence, kill the duplication." The `Next step` section heading + the two action items carry the message without it.
- **Risk if changed:** none on the render side — `sub` is optional in `buildChecklistSection` (`scripts/render-lead-magnets.ts:251`). Audit gate is unaffected (no required substring lives in this line).
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

## Out-of-scope items confirmed clean (evidence)

- **Source ledger** — present in all three PDFs (`Broward County Property Appraiser` is an audit-required substring; verified via `audit-lead-magnets.ts` `REQUIRED_FOR_ALL` table). No changes proposed.
- **`PDF_DISCLAIMER`** — present verbatim, length-correct, anchored by the audit's "Not legal, insurance, inspection…" prefix check. No changes proposed.
- **`PDF_USE_AGREEMENT`** — present verbatim, copyright retained, REALTOR® / LPT Realty LLC attribution intact. No changes proposed.
- **REALTOR® / MLS / EHO / license / brokerage attribution** — `MIA SANABRIA · REALTOR® · LPT REALTY` cover micro-strap + `FL Sales Associate License #SL3405877 · Fort Lauderdale, FL` cover meta + `PDF_FOOTER` line on every page. No changes proposed.
- **Banned terms** — zero hits for "off-market" (unhedged), "exclusive access", "definitive access point", "guaranteed", "same-business-day", "within 24 hours", "world-class", "premier", "elite" across the three PDF sources in `src/data/lead-magnets/index.ts`. The doctrine-approved hedges "pre-market", "quiet pre-market", and "private inquiries" are correctly fenced by the audit's `hedge` regex in `audit-lead-magnets.ts:91`.
