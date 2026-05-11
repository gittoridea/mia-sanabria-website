# Cycle 19C-COPY — Reviewer pack 05: SEO/AEO Preservation Editor

> Role: guard the strings that the site's existing audit suite treats as
> schema-visible or AEO-load-bearing. Every other reviewer-pack proposing
> compression must respect the boundaries below or the build will fail an audit
> gate. The doctrine's "Preserve waterfront diligence substance" rule
> (`docs/CYCLE_19C_COPY_DOCTRINE.md` line 41) is operationalized here against
> the actual audit scripts that ship.

> Format note: per doctrine line 84, the "Proposed copy" field is replaced with
> **Safe-to-compress boundary** — describing what edit pressure is OK vs.
> what would trip an audit.

---

### Finding 1: Fort Lauderdale FAQ count must remain 11 (`@type:Question` entries)

- **Route / file:** `/markets/fort-lauderdale/` — sourced from
  `src/lib/markets.ts` (`fort-lauderdale.faqs` array, 5 entries) +
  `src/components/markets/FortLauderdaleV2.tsx`
  (`FORT_LAUDERDALE_V2_FAQS`, 6 entries).
- **Current copy:** 11 distinct Q+A pairs are emitted as JSON-LD `FAQPage`
  with `@type:"Question"` per entry — 5 market-level FAQs (lines 146-173 of
  `markets.ts`) plus 6 V2-specific FAQs (lines 342-373 of
  `FortLauderdaleV2.tsx`).
- **Reason:** `scripts/audit-fort-lauderdale-standard.ts` line 198-203 hard-asserts
  `faqMatches.length === 11`. The audit only WARNs at ≥9; FAILs below.
- **Safe-to-compress boundary:** OK to tighten the **answer** prose inside any
  FAQ entry as long as the FAQ entry survives (Question + Answer remain).
  FORBIDDEN: deleting an entire FAQ object, merging two FAQ entries into one,
  or moving a FAQ entry out of the page. Removing/renaming any of the named
  Question strings in Finding 2 also breaks the audit independently.
- **Risk if changed:** `audit:fort-lauderdale-standard` flips to FAIL, blocks
  `audit:all` if/when standard joins the gate.
- **Factual / source-ledger review required:** no (count is a structural gate, not a fact)
- **Category:** 1 site/content/design defect

---

### Finding 2: Six Fort Lauderdale FAQ Question strings are matched verbatim

- **Route / file:** `/markets/fort-lauderdale/` (V2 + V3 + V4 specifics).
- **Current copy (each is a literal substring the audit greps):**
  1. `"How is a private buyer brief different from a saved-search alert?"` (v3.faqPrivateBriefVsAlert)
  2. `"Why does route-to-inlet matter for a buyer who isn"` (v3.faqRouteToInletNonYachter — partial-string match, apostrophe-tolerant)
  3. `"What does &quot;no fixed bridges&quot; mean and where does it actually apply"` (v4.faqNoFixedBridges — HTML-entity-encoded form)
  4. `"How does Fort Lauderdale compare to Pompano Beach for waterfront buyers"` (v4.faqPompanoComparison)
  5. `"Confirm financing, cash, and insurance early"` (v4.buyerStep5Financing — playbook H3, not FAQ, but same exact-match enforcement)
  6. `"Organize the insurance dataroom"` (v4.sellerStep3InsuranceDataroom)
- **Reason:** `audit-fort-lauderdale-standard.ts` lines 80-129 do
  `html.includes(c.pattern)` exact-string matching. Compression that rewords
  any of these strings is detected as a missing marker.
- **Safe-to-compress boundary:** Body/answer prose under each FAQ may be
  trimmed. FORBIDDEN: editing the Question/heading wording itself,
  changing "no fixed bridges" to "without fixed bridges", changing
  "Pompano Beach for waterfront buyers" to "Pompano for waterfront", changing
  "Confirm financing, cash, and insurance early" to any other phrasing.
- **Risk if changed:** Specific named check in `audit-fort-lauderdale-standard`
  flips to FAIL.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 3: Fort Lauderdale H1 precision frame is a marker, not just an H1

- **Route / file:** `/markets/fort-lauderdale/` —
  `src/components/markets/FortLauderdaleV2.tsx` line 408.
- **Current copy:** `"Where deepwater yacht access, a working downtown, and a 165-mile canal system meet."`
- **Reason:** Two audits enforce this. `audit-fort-lauderdale-standard.ts`
  line 72 greps for `"Where deepwater yacht access"`. `audit-seo.ts`
  line 95-99 requires exactly one `<h1>` per route. The string itself is the
  V3 hero-precision-frame marker. Also surfaces in `copy-inventory.md` line
  61 as the route H1.
- **Safe-to-compress boundary:** None. This H1 is locked. Even a synonym
  swap (`"165-mile"` → `"165 miles of"`) breaks the marker grep AND is the
  H1 the SEO audit's "single-h1" rule depends on.
- **Risk if changed:** `v3.heroPrecisionFrame` flips FAIL; route H1 might
  duplicate/lose its uniqueness signal in `audit-completeness`.
- **Factual / source-ledger review required:** yes (165-mile canal-system
  claim is source-ledger-bound)
- **Category:** 1 site/content/design defect

---

### Finding 4: Fort Lauderdale eyebrow + heading pairs are marker grepped

- **Route / file:** `/markets/fort-lauderdale/`.
- **Current copy:** Six exact-substring markers across V3 + V4:
  - `"A decision, not a default"` (v3.preludeEyebrow)
  - `"Fort Lauderdale rewards a written brief"` (v3.preludeHeading)
  - `"What the geography actually is"` (v4.researchBackedEyebrow)
  - `"Fort Lauderdale, in honest scope"` (v4.researchBackedHeading)
  - `"Nine verifiable variables before any offer"` (v4.frameworkNineVariablesHeading)
  - `"What Fort Lauderdale buyers are actually comparing"` (v4.cohortEyebrow)
  - `"Three tiers of decision, not one"` (v4.cohortHeading)
- **Reason:** `audit-fort-lauderdale-standard.ts` greps each as a literal
  `html.includes(...)` substring. Brevity edits that shorten "Nine verifiable
  variables before any offer" → "Nine variables before any offer" will FAIL.
- **Safe-to-compress boundary:** Body prose under each eyebrow/heading
  is fair game for compression. The eyebrow + heading strings themselves are
  locked.
- **Risk if changed:** Multiple FAIL rows in
  `audit-fort-lauderdale-standard.json`.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 5: Fort Lauderdale framework card titles + cohort tier headings

- **Route / file:** `/markets/fort-lauderdale/`.
- **Current copy:** Five framework / cohort heading strings:
  - `"Canal width and turning basin"` (v4.frameworkCanalWidthCard)
  - `"Outdoor living and dock-side amenities"` (v4.frameworkOutdoorLivingCard)
  - `"Tier 1 — Eastern Fort Lauderdale finger-isle peers"` (v4.cohortTier1Heading)
  - `"Tier 2 — Northern Broward waterfront alternatives"` (v4.cohortTier2Heading)
  - `"Tier 3 — Palm Beach County peers"` (v4.cohortTier3Heading)
  - `"Insurance underwriting and the 4-point sequence"` (v3.seventhCardTitle)
  - `"THE QUESTION BUYERS ASK MOST OFTEN"` (v3.emphasizedCardEyebrow — uppercased)
  - `"Editorial photography and dock-up narrative"` (v4.sellerStep5PhotoNarrative)
- **Reason:** Each is a literal-substring marker in
  `audit-fort-lauderdale-standard.ts`. Tier 1/2/3 use em-dashes (`—`),
  not hyphens — compression that flips em-dash to hyphen breaks the match.
- **Safe-to-compress boundary:** Card body prose is open for trimming.
  Heading strings, dashes, and ordinal language ("Tier 1 — ... peers") are
  locked verbatim.
- **Risk if changed:** Named markers in
  `audit-fort-lauderdale-standard.json` flip to FAIL.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 6: Fort Lauderdale internal links to Pompano / Hillsboro / AVM insight

- **Route / file:** `/markets/fort-lauderdale/`.
- **Current copy:** Three href-pattern markers:
  - `'href="/markets/pompano-beach/"'` (v4.cohortPompanoLink)
  - `'href="/markets/hillsboro-mile/"'` (v4.cohortHillsboroLink)
  - `'/insights/why-automated-valuations-miss-luxury-waterfront/'` (v3.sellerPlaybookInsightsLink)
- **Reason:** `audit-fort-lauderdale-standard.ts` greps for the literal href
  attribute. Removing the cross-link, restructuring the cohort section
  without these anchors, or changing the link text without preserving the
  href, breaks the audit.
- **Safe-to-compress boundary:** Link **text** ("Pompano Beach", "Hillsboro
  Mile", "see the AVM brief") may be tightened. The `href="..."` attribute
  values must remain verbatim, and at least one link to each target route
  must survive on this page.
- **Risk if changed:** Cohort cross-link markers FAIL; also degrades
  internal linking that `audit-completeness` (line 70-71) samples Fort
  Lauderdale as a representative footer/internal-link page.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 7: V3 "Comes up when" + "What this is not" repeated markers

- **Route / file:** `/markets/fort-lauderdale/`.
- **Current copy:** Two recurring labels:
  - `"Comes up when"` — must appear **≥ 4 times** (v3.peerPointers, regex `/Comes up when/g`).
  - `"What this is not"` — must appear **≥ 2 times** (v3.antiPatternAside, regex `/What this is not/g`).
- **Reason:** `audit-fort-lauderdale-standard.ts` lines 77-78 enforce
  `expectCount: "at-least-4"` and `"at-least-2"`. Brevity edits that
  consolidate the four peer-pointer asides into one ("Comes up when buyers
  compare X, Y, Z") drop the count below threshold.
- **Safe-to-compress boundary:** Prose **after** "Comes up when" / "What
  this is not" is open for trimming. The label phrase itself must repeat at
  least the required number of times. Don't merge asides; tighten each one
  in place.
- **Risk if changed:** `v3.peerPointers` / `v3.antiPatternAside` flip FAIL.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 8: AnswerFirst sections — every Q+A on Home/Buyers/Sellers/About/Valuation is a FAQPage entity

- **Route / file:**
  - `src/app/page.tsx` line 94 — `"What kind of real estate does Mia Sanabria specialize in?"`
  - `src/app/buyers/page.tsx` line 124 — `"How should buyers approach luxury and waterfront homes in Eastern Fort Lauderdale?"`
  - `src/app/sellers/page.tsx` line 124 — `"How should sellers position a luxury or waterfront home in Eastern Fort Lauderdale?"`
  - `src/app/about/page.tsx` line 72 — `"How does Mia Sanabria represent luxury and waterfront clients?"`
  - `src/app/valuation/page.tsx` line 94 — `"What should a luxury waterfront valuation consider beyond automated estimates?"`
- **Current copy:** Each `<AnswerFirst question=... answer=... />` emits a
  `<FaqSchema items={[{ question, answer }]} />` JSON-LD block
  (`src/components/AnswerFirst.tsx` line 83). The H2 prints `{question}`
  verbatim and the `<p>` prints `{answer}` verbatim.
- **Reason:** Every word of `question` + `answer` ships as **both** rendered
  H2/paragraph **and** schema-visible `name` / `acceptedAnswer.text`. This
  is the site's primary AEO surface (LLM-search direct-answer citation).
  The doctrine's "Useful — every paragraph teaches" rule (line 16) maps
  one-to-one onto these answers.
- **Safe-to-compress boundary:** Answers are 75-125 words by design (per
  the AnswerFirst contract — see component prop docstring line 19). Trim
  toward 75 words only by removing throat-clearing or redundant geography
  mentions. The **first sentence must remain a direct answer to the
  question** — that is what LLM-snippet selection grabs. Questions
  themselves are locked: they are the AEO query the page is optimized for.
- **Risk if changed:** Schema still parses (`audit-schema` is loose), but
  the AEO direct-answer signal degrades. If anyone shortens an answer below
  ~50 words, mobile readers lose context and the FAQ snippet stops being
  citation-grade.
- **Factual / source-ledger review required:** yes — answers contain
  factual scope claims about Mia's practice and waterfront diligence
  variables.
- **Category:** 1 site/content/design defect

---

### Finding 9: Insights AEO Q+A is gated by `audit:insights` word-count windows

- **Route / file:** `src/data/insights/*.ts` — `aeoQuestion` and
  `aeoAnswer` fields on all 12 posts; rendered into `/insights/<slug>/`.
- **Current copy:** Each post's `aeoQuestion` becomes an H2; `aeoAnswer`
  becomes the visible paragraph and is also serialized into the
  `FAQPage` JSON-LD via `buildFaqSchema(post)`
  (`src/app/insights/[slug]/page.tsx` line 89-113).
- **Reason:** `audit-insights.ts` lines 295-309 enforce:
  - intro 60-220 words (target 90-140)
  - **aeoAnswer 50-200 words (target 75-125)** — `wordCount.aeoInRange`
  - body min 600 words — `wordCount.bodyMin600`
  Compressing an `aeoAnswer` below 50 words flips WARN; total body below
  600 flips FAIL.
- **Safe-to-compress boundary:** Trim AEO answers toward the **lower bound
  of 75** (target band) — never below 50. If a brevity reviewer wants to
  cut an aeoAnswer to 40 words, refuse. Intro can move toward 60 words;
  body sections can be trimmed but the total post must stay ≥ 600 words.
- **Risk if changed:** `audit:insights` FAIL on bodyMin600 (blocks
  `audit:all` since insights is in the gate per `CLAUDE.md`).
- **Factual / source-ledger review required:** no (lengths only)
- **Category:** 1 site/content/design defect

---

### Finding 10: Meta description ≤ 160 chars + Title ≤ 60 chars

- **Route / file:** Every public route in `out/`. Sources include
  `src/app/*/page.tsx` exported metadata + `src/data/insights/*.ts`
  (`seoTitle`, `seoDescription`).
- **Current copy:** Example baselines from `copy-inventory.md`:
  - Home meta: 160-char band (inventory line 30 shows 158-char form).
  - Fort Lauderdale meta uses a truncated tail (`… Mia Sanabria, REALTOR®
    with LPT Realty.`) at line 62 — already near the 160-char ceiling.
- **Reason:** `audit-seo.ts` lines 109-115 + 126-132 emit a FAIL when
  `title.length > 60` or `description.length > 160` (skipped for noindex
  routes). Brevity edits that *add* qualifying phrases to a description
  to make it "clearer" will overshoot.
- **Safe-to-compress boundary:** Always OK to shorten an over-budget
  description. Never grow a description past 160 chars. Titles must stay
  ≤ 60 chars including the `| Mia Sanabria` suffix already appended by the
  site default. Insights `seoTitle` ≤ 70 (per `audit-insights.ts` line 222,
  slightly looser than route titles).
- **Risk if changed:** `audit:seo` exit 1 → blocks `audit:all` → blocks
  deploy.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 11: Per-route body word floor ≥ 150 (markets ≥ 200)

- **Route / file:** Every public route in `out/`. Markets pages
  separately gated at 200.
- **Current copy:** All routes currently pass. Risk lives in pages with
  shorter body — `/contact/` (250-word zone), `/valuation/`, `/about/`.
- **Reason:** `audit-seo.ts` line 167-176 warns when visible body words
  < 150 (warning, not error). `audit-completeness.ts` line 75 +
  `MARKET_VISIBLE_WORD_FLOOR = 200` enforces ≥ 200 visible words on
  every market page.
- **Safe-to-compress boundary:** Compression on already-thin pages
  (`/contact/`, `/valuation/`) should leave ≥ 200 visible words.
  Aggressive trims to Pompano Beach / Boca Raton / Delray (already
  smaller per inventory — Pompano 26 paragraphs / Boca 28 / Delray 28)
  must not push them under the 200-word market floor.
- **Risk if changed:** `audit:completeness` FAIL on market page
  word-floor; `audit:seo` WARN on core pages.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 12: Direct-answer first sentence pattern (LLM snippet contract)

- **Route / file:** Every `AnswerFirst` answer, every Insights `aeoAnswer`,
  every Fort Lauderdale FAQ answer.
- **Current copy:** Each begins with a direct-answer sentence. E.g. Home:
  `"Mia Sanabria represents buyers and sellers of luxury and waterfront
  residences across Eastern Fort Lauderdale..."`. FL FAQ on Pompano:
  `"Fort Lauderdale anchors the broader yachting and finger-isle waterfront
  cohort..."`. Insights `aeoAnswer` (e.g. `03-positioning-luxury-waterfront`):
  `"A luxury waterfront home in Eastern Fort Lauderdale is positioned
  through four disciplined choices..."`.
- **Reason:** No audit currently parses *which* sentence is first, but the
  AEO contract documented in `AnswerFirst.tsx` line 19
  (`/** 75-125 words; first sentence answers directly, remaining sentences
  expand. */`) is the design contract that makes the page a citation
  candidate. Compression that opens with throat-clearing
  ("In Fort Lauderdale's waterfront market...") breaks the LLM-snippet
  pattern even though no audit currently catches it.
- **Safe-to-compress boundary:** When trimming any AEO answer, the
  **first sentence must remain a direct answer** to the H2 question.
  Brevity edits that move the direct answer to sentence 2 or 3 forfeit
  the snippet. Acceptable to remove redundant trailing sentences; never
  move the lead.
- **Risk if changed:** Soft (no audit FAIL), but the entire reason for
  the AnswerFirst component degrades. This is the highest-leverage AEO
  asset the site has.
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 13: Insights H1 strings are also the LLM-search target queries

- **Route / file:** All 12 `/insights/<slug>/` routes.
- **Current copy:** H1s per `copy-inventory.md` lines 241, 257, 273, 289,
  305, 321:
  - `"How to Position a Luxury Waterfront Home in Eastern Fort Lauderdale"`
  - `"Dockage, Seawalls, Bridge Clearance, and Route-to-Inlet: A Buyer's Due Diligence Guide"`
  - `"Las Olas Isles vs. Seven Isles vs. Harbor Beach: How Buyers Compare the Deepwater Finger-Isle Markets"`
  - `"Coral Ridge, Victoria Park, and Rio Vista: Choosing the Right Eastern Fort Lauderdale Lifestyle"`
  - `"Delray Beach Luxury Buyers: Walkability, Beach Proximity, and Waterfront Fit"`
  - `"Why Automated Valuations Miss Luxury Waterfront Property Value"`
- **Reason:** Each H1 is keyword-dense by design and survived a slug ↔
  title ↔ H1 alignment in Cycle 15. `audit-seo.ts` enforces exactly one
  `<h1>` per page (line 95-99). `audit-insights.ts` enforces `seoTitle`
  ≤ 70 chars (line 222) — these H1s are intentionally longer than
  `seoTitle` so the page H1 carries the long-tail query, while `seoTitle`
  carries the SERP-truncated form.
- **Safe-to-compress boundary:** H1 strings on Insights routes are
  locked. They are the long-tail-keyword anchor. `seoTitle` /
  `seoDescription` may be tuned (within 70 / 200 chars per
  `audit-insights.ts`); H1 is not.
- **Risk if changed:** Loss of the long-tail intent the post is built for;
  drift between H1 and `aeoQuestion` (the rendered H2 directly below H1).
- **Factual / source-ledger review required:** no
- **Category:** 1 site/content/design defect

---

### Finding 14: Banned-phrase + no-fabrication audits forbid common compression shortcuts

- **Route / file:** Everywhere. Enforced by `scripts/audit-stale-terms.ts`,
  `scripts/audit-no-fabrications.ts`, `scripts/audit-insights.ts`.
- **Current copy:** Compression patterns that often LOOK like good
  tightening but are banned:
  - "luxury concierge", "white-glove", "bespoke", "high-net-worth",
    "off-market", "since 2017", "within two hours" (project CLAUDE.md
    "Honesty contracts").
  - "best schools" / "good schools" / "family-friendly" /
    "bachelor pad" (Fair Housing — `audit-insights.ts` line 64-70).
  - "guaranteed sale" / "X years experience" / "speaks X languages" /
    "fastest response" / "Same-business-day response" /
    `private inventory we control` (`audit-no-fabrications.ts` line 40-71).
  - "Evergreen Brief" (Cycle 17 retired label —
    `audit-insights.ts` line 92).
- **Reason:** Brevity edits sometimes substitute these phrases for longer
  hedged wording (e.g. compressing "Mia maintains private brokerage
  relationships that occasionally surface residences before public
  listing" → "private inventory" — banned). The doctrine's banned-term
  list (lines 56-66) mirrors this but the *audited* surface is broader.
- **Safe-to-compress boundary:** Keep the doctrine banned list in front
  of every compression decision. If unsure whether a shortening lands on
  a banned term, run `bun run audit:stale` and `bun run audit:no-fabrications`
  before committing. Hedged long-form is preferred to a banned compression.
- **Risk if changed:** `audit:stale` / `audit:no-fabrications` /
  `audit:insights` exit 1 → blocks `audit:all`.
- **Factual / source-ledger review required:** yes (claims must reference
  source ledger)
- **Category:** 5 legal/compliance dependency

---

## Open notes for the editor running compression

1. The doctrine's "geography once per paragraph" rule (line 40) is the
   highest leverage compression lever on Fort Lauderdale — 18 occurrences
   of "Eastern Fort Lauderdale" on that page per inventory line 71. None
   of those tokens are audited individually. Safe to trim aggressively.
2. The 924-word paragraph on Fort Lauderdale (inventory line 65) is
   compressible only if the FAQ Question strings, framework card titles,
   tier headings, and cross-market hrefs inside it are preserved. Walk it
   sentence-by-sentence with this pack open.
3. The longest sentences (52 words) in Pompano Beach / Boca Raton /
   Delray / Insights posts are good split candidates per doctrine line 36
   without touching any audit marker.
4. If a future cycle wants to *remove* a Fort Lauderdale FAQ to bring the
   count down, that decision belongs in a new cycle doc (Category 3
   principal decision), not a brevity edit — it requires editing
   `audit-fort-lauderdale-standard.ts` line 198-203 and a principal
   sign-off on which of the 11 questions is dropping.
