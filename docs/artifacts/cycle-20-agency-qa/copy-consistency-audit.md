# Cycle 20 — Copy Consistency Audit (19C Doctrine Pass)

> Source: `docs/artifacts/cycle-20-agency-qa/copy-consistency-audit.md`
> Doctrine baseline: Cycle 19C-COPY accepted state (commit `70e1df2`). Repeat-pass to confirm nothing regressed and to surface any per-page tone drift since.
> Authoritative regression guards: `audit-stale-terms.json`, `audit-no-fabrications.json`, `audit-trust-row.json`, `audit-about.json`, `audit-completeness.json`, `audit-lead-magnets.json` — all PASS at this cycle.

## 1. Cycle 19C accepted state (verify-locked)

| String | Where it lives | Verified absent in repo | Verified present |
|---|---|---|---|
| Accepted footer copy | `src/components/SiteFooter.tsx` | n/a | **PASS** — "Private guidance for waterfront and luxury homes from Fort Lauderdale to Boca Raton and Delray Beach. Expect a patient conversation delivered with discretion and nuance." |
| Accepted home H1 | `src/app/page.tsx` line ~82 | n/a | **PASS** — "Luxury and waterfront real estate across Fort Lauderdale, Pompano Beach, and Boca Raton." |
| Accepted sellers H1 | `src/app/sellers/page.tsx` | n/a | **PASS** — "Selling a luxury or waterfront residence in Southeast Florida." |
| "Same business day" | anywhere in source | **PASS — 0 hits** (audit-stale-terms) | n/a |
| "within five business days" / "within 5 business days" | anywhere in source | **PASS — 0 hits** (audit-stale-terms) | n/a |
| "evergreen" (visible body copy) | anywhere in source | **PASS — 0 hits** (audit-stale-terms) | n/a |
| "Klein Morgan", "kleinmorgan" | anywhere | **PASS — 0 hits** (audit-about) | n/a |
| "off-market", "luxury concierge", "white-glove", "bespoke", "high-net-worth" | anywhere | **PASS — 0 hits** (audit-stale-terms) | n/a |
| "best schools", "good schools", "safe neighborhood", "family-friendly" | anywhere (Fair Housing) | **PASS — 0 hits** (audit-stale-terms) | n/a |
| "#1 realtor", "top realtor", "guaranteed sale/price" | anywhere (FREC superlative risk) | **PASS — 0 hits** (audit-stale-terms) | n/a |
| Above-fold trust row (global) | `src/components/*` | **PASS — 0 sources host trust row** (audit-trust-row 51/51 clean) | n/a |
| Lead magnet PDF shell-bleed strings | PDFs | **PASS — no "Skip to main content" / "Site footer"** (audit-lead-magnets) | n/a |
| "deliberately small client list", "global distribution", "sunandbreeze" | about / bios | **PASS — 0 hits** (audit-about) | n/a |
| Awards / years-licensed / sales-volume / testimonials / designations / response-time guarantees | anywhere | **PASS — 0 hits** (audit-about + audit-no-fabrications) | n/a |

Cycle 19C copy doctrine is intact. Nothing in this cycle should touch the accepted strings above.

## 2. Per-page rating (this cycle)

Legend: keep · trim · sharpen · blocked. **Action means safe-fix this cycle** only where called out; otherwise = defer (preserve).

| Route | Rating | Notes / evidence |
|---|---|---|
| `/` (home) | **keep** | Hero, AnswerFirst, MeetMia, IntentRouter, FeaturedMarketsPager, ValueProps, Faq (4 Q&A), CTAStrip, IdxEmbed, InsightsTeaser — all 19C-passed. AnswerFirst section is doing AEO work; no need to touch. |
| `/about/` | **keep** | 12/12 audit-about passes (no Klein Morgan, no awards, no testimonials, no designations, no years-licensed, no sales-volume). License # correctly absent from `/about/`, present on footer + `/terms/` only. |
| `/contact/` | **trim (defer)** | FAQ + intake methods are clear. The intro paragraph repeats "private" 3 times in 4 sentences; this is brand-on-purpose, not drift. Tier-2 candidate, not P0/P1 — preserve until next copy cycle. |
| `/buyers/` | **keep** | 19C pass. Process timeline + FAQ are concrete; CTA aligned. |
| `/sellers/` | **keep** | 19C pass with accepted H1. |
| `/valuation/` | **trim (defer)** | Removed "within five business days" claim per 19C. Current copy reads as honest. Could tighten the intro by 1 sentence — Tier-2 candidate, defer. |
| `/markets/` | **keep** | 19C pass. Word-count floor met (audit-completeness.markets.wordFloor: all 16). |
| `/markets/fort-lauderdale/` | **keep** | Gold-standard page per cycle-19B-FL-R1; audit-fort-lauderdale-standard 31/31 PASS. |
| Other market pages (15) | **keep** | each meets 200-word floor; FAQ schema present where rendered. No regressions surfaced. |
| `/insights/` | **keep** | Blog schema on index, 12 posts indexed. |
| `/insights/[slug]/` (12) | **keep** | Each post: H1 + Article schema + FAQ + Person + RealEstateAgent + BreadcrumbList. audit-insights all PASS. |
| `/privacy/` | **blocked (c5 legal-review)** | Surfaced as `high` in qa-gate-matrix. Legal counsel review needed before production cutover. Not a Cycle-20 edit target. |
| `/terms/` | **blocked (c5 legal-review)** | Same. |
| `/accessibility/` | **blocked (c5 legal-review)** | Same. |
| `/dmca/` | **blocked (c5 legal-review + USCO in-process flag)** | Same. USCO designated-agent registration is in process; pre-cutover blocker. |
| `/thank-you/{,buyer-brief,market-brief,valuation}/` | **sharpen** | These pages exist for the post-GHL future but currently are unreachable via the mailto-form pattern. Copy must NOT imply a CRM record was created. Read each page below. |
| `/downloads/[slug]/` | **keep** | 3 lead-magnet HTML render pages; PDF disclaimer + use agreement present (audit-lead-magnets 4/4 PASS). |
| `/404` | **keep** | Branded, lists nav. |

## 3. Detailed: thank-you page honesty review

Each thank-you page currently asserts some variant of "your message is on the way." Until GHL is wired, the only way the user gets there is via direct URL or a (future) form submission. The mailto: forms never navigate to these pages — they open the user's mail client.

**Findings:**

| Page | Current implication | Risk | Recommendation |
|---|---|---|---|
| `/thank-you/` | "Thanks — Mia will be in touch" | implies CRM capture; currently no CRM | sharpen at GHL cutover; do NOT rewrite this cycle — page is post-GHL functional |
| `/thank-you/buyer-brief/` | implies buyer-brief intake happened | as above | same |
| `/thank-you/market-brief/` | implies market-brief intake happened | as above | same |
| `/thank-you/valuation/` | implies valuation intake happened (no response-time promise; verified absent) | as above | same |

**Action this cycle:** none. These pages are wired to fire post-GHL. The mailto-form pattern means they're currently dead routes from the visitor's perspective. Promoting any of these to "blocked" or "principal decision" would be over-classification. They're noted in the issue matrix as ISS-010 (P3, owner-type 4 GHL-dep).

## 4. Tone drift scan

A grep for known drift signals (per CLAUDE.md honesty contracts):

| Signal | Repo hit count | Notes |
|---|---|---|
| "luxury concierge" | 0 | clean |
| "white-glove" | 0 | clean |
| "bespoke" | 0 | clean |
| "high-net-worth" | 0 | clean |
| "off-market" | 0 | clean |
| "since 2017" | 0 | clean |
| "within two hours" | 0 | clean |
| "as seen in" / "as seen on" | 0 | clean |
| "best schools" / "good schools" | 0 | clean |
| "safe neighborhood" / "family-friendly" | 0 | clean |
| "bachelor pad" / "kid-friendly" | 0 | clean |
| "#1 realtor" / "top realtor" / "best realtor" | 0 | clean |
| "guaranteed sale" / "guaranteed price" | 0 | clean |
| double-period `..` at sentence boundaries | n/a | covered by audit-stale-terms |
| visible `Updated MONTH YYYY` blog labels | n/a | schema dateModified only, no visible labels |

Source: `audit-stale-terms.json` + `audit-no-fabrications.json` baseline. Both PASS in this cycle.

## 5. `private` / `guidance` repetition advisory (not a defect)

The brand voice intentionally leans on the word "private" and the word "guidance" (which is on-brand). The advisory `audit-copy-density` reports:

- "private" appears ~70× across the site (most concentrated on `/`, `/contact/`, `/valuation/`).
- "guidance" appears ~30× (most concentrated on `/contact/`, market pages).

This is **intentional brand-voice density**, not a defect. The advisory flag exists so a future copy-cycle can decide whether to thin the density. No action this cycle.

## 6. Verdict

- 0 P0/P1 copy defects to fix this cycle.
- 4 legal pages flagged P0-equivalent for cutover (owner-type 5 legal-review). All four routes ship correctly today on staging with `noindex`. Production cutover requires counsel review.
- Thank-you-page honesty risk (ISS-010) is owner-type 4 GHL-dep, not a copy fix.

**No source/content edits performed in this audit pass.** The 19C copy doctrine is intact; the site is in a known-good rhetorical state.

## 7. Cross-references

- All "blocked" rows → `issue-matrix.md` rows ISS-014..ISS-017 (legal pages c5).
- Thank-you honesty risk → ISS-010.
- Per-page details upstream → `full-page-inventory.md`.
