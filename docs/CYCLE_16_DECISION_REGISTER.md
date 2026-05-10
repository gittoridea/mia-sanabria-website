# Cycle 16 — Decision Register

**Date:** 2026-05-10
**Effort:** E5 / Algorithm v6.4.0

This register captures the five Cycle 16 decisions before implementation. Each decision is binding for the cycle; reversals require a `## Decisions` log entry in `ISA.md` with rationale.

---

## Decision 1 — Featured Markets homepage UX

**Question:** How should the homepage Featured Markets section behave when the curated featured set is >6?

### Options

- **A. 6-at-a-time accessible pager** — fixed 3×2 desktop grid · static `Page 1 / Page 2` toggle via querystring-free JS-only client state · Previous/Next + page-dot navigation · aria-labels · keyboard usable · no auto-rotate. Principal's stated preference.
- **B. Fixed 6-card editorial spotlight + "Explore all markets" CTA** — no pager, single 6-card hero grid; full coverage on `/markets/`. Lowest interaction cost; highest editorial polish.
- **C. Premium carousel/slider** — animated horizontal slide with snap points. Modern but auto-rotation/slider has come to feel e-commerce, not editorial luxury. Rejected.

### Decision — **Option A: 6-at-a-time pager**

**Rationale:**
- Principal explicitly requested 6-at-a-time pagination behavior.
- 8 featured markets today; with palm-beach and lighthouse-point promoted to featured, that's 10 — too many for a single-fold spotlight, too few for an infinite-scroll feel.
- A pager preserves the editorial framing (premium card per market, generous whitespace, deliberate first-page composition) while solving the "we have more than 6" problem.
- Option B remains a fallback if Option A doesn't render cleanly; both can coexist in code via a feature flag.

**First-page order (principal-locked):**
1. Fort Lauderdale
2. Boca Raton
3. Palm Beach
4. Victoria Park
5. Lighthouse Point
6. Delray Beach

**Second-page order (Cycle 16 curation, ordered by market familiarity / cohort logic):**
7. Las Olas Isles
8. Harbor Beach
9. Bay Colony
10. Bermuda Riviera
11. Coral Ridge
12. Rio Vista

(Sea Ranch Lakes, Hillsboro Mile, Seven Isles remain on `/markets/` but not in the homepage spotlight.)

### Constraints

- **No auto-rotation.** Carousel/slider animation rejected.
- **Accessible.** Previous/Next buttons + dots are keyboard-focusable; aria-controls + aria-current set; respects `prefers-reduced-motion`.
- **Static-export compatible.** Implementation uses `"use client"` for the pager-state slice only; data is statically resolved at build time.
- **Mobile stacks cleanly.** Single column at sm, 2-up at sm:grid-cols-2, 3-up at lg:grid-cols-3.
- **Visible "Explore all markets" link** present always — pager is a discovery aid, not a gate.

---

## Decision 2 — Blog date governance

**Question:** How should the 12 evergreen Insights posts present their dates, given they were all deployed 2026-05-10 but cover 12 calendar months of seasonal market angles?

### Options

- **A. Honest `datePublished` + editorial month label** — schema `datePublished` stays at honest deployment date (2026-05-10); visible label is "Evergreen Brief · May" or "May Waterfront Brief"; no year shown.
- **B. No visible year ever** — visible label is editorial-month-only (no year displayed anywhere); schema `datePublished` honest.
- **C. Backdate `datePublished` to 2nd-Monday-of-month dates going back 12 months** — explicitly authorized by principal in cycle prompt as an option, but explicitly tagged with "only if explicitly authorized and documented." Principal did NOT authorize; default to honest.

### Decision — **Option A: honest `datePublished` + editorial month label**

**Rationale:**
- Principal's cycle prompt explicitly said: *"Do not misrepresent actual publication dates in schema unless explicitly authorized and documented."*
- Backdating `datePublished` for SEO age signal is technically dishonest; major search engines treat content-age signal as one input among many, and structured-data misrepresentation can backfire under Google's spam policies.
- Honest `datePublished` + visible editorial-month framing preserves both honesty and editorial polish.
- The Cycle 15 close already laid groundwork: `topicMonth` and `marketCycleMonth` fields exist on every post.

### Implementation contract

Each post adds:
- `editorialMonthLabel: string` — e.g., `"Evergreen Brief · May"` (display value)
- `editorialDate: string` — e.g., `"2025-05-12"` (2nd Monday of corresponding month, ONE-YEAR-BACK calendar; used for visual sort + display, NEVER for schema)
- `dateDisplayMode: "evergreen-month" | "full-date" | "updated-only"` — drives `<time>` element + visible label
- `showYear?: boolean` — default false for evergreen mode
- `datePublished` — unchanged; honest deployment date (`2026-05-10`)
- `dateModified` — bumped on real content edits only

### Visible format

- Index: `Evergreen Market Brief · May`
- Article header: `Evergreen Market Brief · May  ·  Updated May 2026`
- `<time datetime="2026-05-10">` — schema-faithful
- Article schema: `datePublished: "2026-05-10"` unchanged

### 12-month editorial sequence (2nd Monday of each month, 2025-05 → 2026-04)

| marketCycleMonth | editorialMonthLabel | editorialDate (display only) |
|---|---|---|
| 1 (Jan) | Evergreen Brief · January | 2026-01-12 |
| 2 (Feb) | Evergreen Brief · February | 2026-02-09 |
| 3 (Mar) | Evergreen Brief · March | 2026-03-09 |
| 4 (Apr) | Evergreen Brief · April | 2026-04-13 |
| 5 (May) | Evergreen Brief · May | 2025-05-12 |
| 6 (Jun) | Evergreen Brief · June | 2025-06-09 |
| 7 (Jul) | Evergreen Brief · July | 2025-07-14 |
| 8 (Aug) | Evergreen Brief · August | 2025-08-11 |
| 9 (Sep) | Evergreen Brief · September | 2025-09-08 |
| 10 (Oct) | Evergreen Brief · October | 2025-10-13 |
| 11 (Nov) | Evergreen Brief · November | 2025-11-10 |
| 12 (Dec) | Evergreen Brief · December | 2025-12-08 |

These dates are EDITORIAL ANCHORS for visible sort and label only. They never enter schema `datePublished`.

---

## Decision 3 — Blog images

**Question:** Should blog posts have per-post images, and how?

### Options

- **A. Unique article hero + OG per post** — each post gets a representative image; 1200×630 OG; reused on Article schema.
- **B. Use existing market images where aligned** — Post 01 (FL waterfront) → `/markets/fort-lauderdale.jpg`; Post 05 (Bay Colony + Bermuda Riviera) → composite or one of the two; Post 10 (valuation) → neutral editorial graphic.
- **C. Keep text-led posts with shared OG only** — defer image work; not the principal's preference.

### Decision — **Hybrid A+B: per-post images sourced from existing market assets + 2-3 editorial fallbacks**

**Rationale:**
- Principal explicitly stated: *"Default answer: yes, each should have a unique article hero/OG image if practical."*
- Generating 12 new editorial 1200×630 images from scratch is in scope but image generation requires the existing art pipeline (`/tmp/mia-genimg/run.ts`) and would extend cycle time significantly.
- The existing 15 market images already provide topical coverage for 9 of 12 posts (each post has a `relatedMarkets` array). Reusing them for OG is honest and topical: a Fort Lauderdale waterfront-buyer post genuinely IS about Fort Lauderdale.
- For the 3 posts where no single market image suffices (Post 10 valuation, Post 11 listing-prep, Post 12 buyer brief), use a designated "editorial" image — pick the strongest waterfront hero (Harbor Beach or Fort Lauderdale) as the cohort-agnostic premium fallback.

### Per-post mapping (Cycle 16 contract)

| Post | Slug | Hero/OG image |
|---|---|---|
| 01 | fort-lauderdale-waterfront-buyer-guide | `/markets/fort-lauderdale.jpg` |
| 02 | dockage-seawalls-bridge-clearance-route-to-inlet | `/markets/harbor-beach.jpg` |
| 03 | positioning-luxury-waterfront-eastern-fort-lauderdale | `/markets/las-olas-isles.jpg` |
| 04 | las-olas-vs-seven-isles-vs-harbor-beach | `/markets/seven-isles.jpg` |
| 05 | bay-colony-and-bermuda-riviera-private-waterfront | `/markets/bay-colony.jpg` |
| 06 | coral-ridge-victoria-park-rio-vista | `/markets/coral-ridge.jpg` |
| 07 | lighthouse-point-sea-ranch-lakes-hillsboro-mile | `/markets/lighthouse-point.jpg` |
| 08 | boca-raton-luxury-buyers-club-beach-waterfront | `/markets/boca-raton.jpg` |
| 09 | delray-beach-luxury-buyers-walkability-beach-waterfront | `/markets/delray-beach.jpg` |
| 10 | why-automated-valuations-miss-luxury-waterfront | `/markets/harbor-beach.jpg` (editorial fallback) |
| 11 | preparing-waterfront-residence-private-market-conversations | `/markets/bermuda-riviera.jpg` |
| 12 | private-buyer-brief-defining-the-search | `/markets/fort-lauderdale.jpg` |

### OG image deployment

- Generate `/og-insights/{slug}.jpg` for each (1200×630, optimized).
- For Cycle 16: derive from market source images via `sharp` resize+crop pipeline (same `/tmp/mia-genimg/run.ts` pattern Cycle 14/15 used).
- Wire each post's `heroImage` (article page) and `ogImage` (metadata + schema).
- Update Article schema `image` array.

### Article-page hero pattern

Use the same `Hero` component as market/legal pages with `background="image"` and `imageSrc=post.heroImage`. Maintain the existing scrim + Cinzel headline pattern. No new design tokens.

---

## Decision 4 — Footer REALTOR®/EHO logo treatment

**Question:** Are the current footer trust marks visually acceptable to the principal, and what's the safe correction path?

### Options

- **A. Source official assets and implement (REALTOR® R + HUD EHO)** — pull canonical assets from NAR / HUD official download pages; render at known dimensions; preserve monochrome treatment that Cycle 11 chose.
- **B. Use text-only trust labels while logo rights/fit are reviewed** — drop the image entirely; render the words "REALTOR®" + "Equal Housing Opportunity" + "LPT Realty" in display type only. Compliance-safe; visually weaker.
- **C. Keep current but improve layout** — same asset set, better tile/sizing/contrast.

### Decision — **Option A + visual reproduction first**

**Rationale:**
- Principal's exact words: *"Footer REALTOR® and Equal Housing Opportunity logos still do not look fixed. Reproduce visually and correct."*
- The mandate has TWO steps: (1) reproduce the issue with screenshots, (2) correct.
- Cycle 14 OFFICIAL_GRAPHICS_REVIEW already documented the canonical NAR and HUD source URLs. We have authoritative assets to work from.
- Cycle 11 chose monochrome `brightness-0 invert opacity-90` — that decision stands UNLESS pixel-contrast verification proves the resulting silhouettes are illegible.
- If reproduction shows the existing implementation is fine and the principal's perception was based on outdated cache, mark this NO-CHANGE with screenshot proof.
- If reproduction shows a real issue (e.g., REALTOR®+MLS combined-mark filename mismatch, EHO ratio distortion, contrast failure on navy), implement the smallest safe fix.

### Constraints

- No claim of MLS authorization (Cycle 14 flagged the "REALTOR®+MLS" filename concern — verify the actual asset shape).
- No claim of REALTOR® mark authorization beyond NAR's standard member-display rule (Mia is cited as NAR member in PUBLIC_FACT_LEDGER; this stays unverified until DBPR/NAR confirmation, but display under standard member rule is generally permitted).
- HUD EHO mark is in the public domain when used to indicate Fair Housing compliance.
- LPT logo is canonical-brand asset; preserve as-is.
- Add appropriate visible labels next to each mark (Cycle 11 already did this — `<span>` after each `<Image>`).

### Implementation path

1. Capture BEFORE screenshots of footer at desktop+mobile, multiple viewports.
2. Inspect existing `realtor-r.png`/`equal-housing.png`/`lpt-realty.png` for size/aspect/contrast.
3. If pixel-contrast probes fail, replace with NAR/HUD canonical assets (sourced via Cycle 14 OFFICIAL_GRAPHICS_REVIEW URLs).
4. If pixel-contrast probes pass, this becomes a no-change with screenshot proof.
5. Capture AFTER screenshots.

### Stop condition

If safe asset replacement cannot be verified (rights-of-use question on NAR mark), fall back to **Option C+B hybrid**: keep current image with text-only contingency, mark `REVIEW` for principal-legal confirmation in CYCLE_16_FOOTER_TRUST_LOGO_FIX.md.

---

## Decision 5 — About page credentials and service areas

**Question:** Which claims on the About page are verified facts vs. unverified copy that should be softened or removed?

### Decision — **Fact-classification audit before any text change**

**Rationale:**
- Principal explicitly stated: *"Verify before adding credentials, awards, languages, memberships, license details, or designations. Do not fabricate or rely on stale assumptions."*
- The cycle 15 closeout already flagged "deliberately small client list each quarter" as a probable softening target; Cycle 16 formalizes the audit.

### Classification table (preview — full audit in CYCLE_16_ABOUT_CREDENTIALS_AND_SERVICE_AREAS_AUDIT.md)

| Candidate fact | Current state | Source | Cycle 16 disposition |
|---|---|---|---|
| Name "Mia Mary Sanabria" | rendered | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Title "REALTOR®" | rendered | PUBLIC_FACT_LEDGER §1 + NAR member cited | VERIFIED — keep |
| Brokerage "LPT Realty" | rendered | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Phone (954) 540-0358 | rendered | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Email msanabriarea@gmail.com | rendered | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| Service area "Eastern FL/Boca/Delray" | rendered | PUBLIC_FACT_LEDGER §1 | VERIFIED — keep |
| FL License # SL3405877 | rendered (footer) | PUBLIC_FACT_LEDGER §2 (cited; awaiting DBPR primary-source) | UNVERIFIED — keep with caveat |
| "Deliberately small client list each quarter" | rendered twice | NOT in PUBLIC_FACT_LEDGER | UNVERIFIED — REMOVE/SOFTEN |
| "Personal attention at every showing, every consultation, every closing" | rendered | not principal-confirmed | UNVERIFIED — SOFTEN to "engagement-by-engagement attention" |
| "Mia's brokerage relationships move desirable residences quietly" | rendered | not principal-confirmed | UNVERIFIED — SOFTEN to "Mia maintains brokerage relationships across Eastern Southeast Florida; access varies by market and timing" |
| Languages: ["English"] | not rendered on About (data-only) | inferred | UNVERIFIED — leave unrendered |
| Designations | empty array | unconfirmed | UNVERIFIED — leave unrendered |
| Years licensed | null | unconfirmed | UNVERIFIED — leave unrendered |
| "Practicing since" | only rendered when `experience.since` set; currently null | unconfirmed | UNVERIFIED — leave unrendered |
| MLS memberships | not rendered | unconfirmed | UNVERIFIED — leave unrendered |
| NAR member display rule | implied by REALTOR® mark on footer | LPT-page cited as NAR + Realtor.com | PARTIAL — okay for standard mark display |
| Awards / press / reviews | not rendered | none verified | UNVERIFIED — leave unrendered |

### Updates to ship

1. Replace "deliberately small client list each quarter" (both instances) with **principal-safe alternative**:
   - AnswerFirst body: open with "Mia represents buyers and sellers of luxury and waterfront residences across…" — strike the "deliberately small client list each quarter" frame.
   - Body paragraph: replace with neutral statement of practice — "engagement-by-engagement representation, with consistent presence from first showing through closing."
2. Soften "Mia's brokerage relationships that quietly move desirable residences" to "Mia maintains brokerage relationships across Eastern Southeast Florida; access to off-market and quietly-available residences varies by market and timing."
3. Service area: keep current ("Eastern Fort Lauderdale · Eastern Boca Raton · Eastern Delray Beach"). PUBLIC_FACT_LEDGER §1.
4. Do NOT add designations, languages, years, awards, MLS list, or any other unverified field until principal confirmation in writing.

---

## Recap

| Decision | Choice |
|---|---|
| 1. Featured Markets UX | 6-at-a-time accessible pager, principal's first-page order locked |
| 2. Blog date governance | Honest `datePublished` + visible "Evergreen Brief · Month" label |
| 3. Blog images | Per-post images, sourced from market images + 3 editorial fallbacks |
| 4. Footer logos | Reproduce-first, fix only if pixel verification shows real issue |
| 5. About credentials | Audit-then-soften unverified claims; verified facts only |

All five decisions are binding for Cycle 16. Reversals require an `ISA.md ## Decisions` entry.
