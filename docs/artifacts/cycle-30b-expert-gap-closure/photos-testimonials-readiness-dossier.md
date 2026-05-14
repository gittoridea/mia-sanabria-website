# Lane K — Photos / Testimonials / Brand Asset Readiness Dossier

**Author lens:** Photos / Testimonials / Brand Asset Advisor
**Scope:** prepare visual + testimonial sourcing without fabricating. No scraping FB/Realtor.com. No invented or paraphrased testimonials. No unlicensed local photography. No fake photography.
**Inputs reviewed:** `public/markets/*.jpg`, `src/lib/markets.ts`, Cycle 25 page-model, Cycle 27 evergreen city evidence library, Cycle 30 `mia-review-packet.md` §"Photos" + §"Testimonials," project CLAUDE.md honesty contracts.

## Current photography state

| Neighborhood | Current image | Source | Status |
|---|---|---|---|
| Fort Lauderdale | `public/markets/fort-lauderdale.jpg` (cinematic twilight waterfront) | Mia-approved Cycle 22-R1 hero asset; reused per `docs/mia-client-decision-record.md:90` "no credential / scrape risk; reuse keeps the visual stable until Mia approves a new asset" | **APPROVED** for v1 |
| Pompano Beach | `public/markets/pompano-beach.jpg` | placeholder | needs Mia decision |
| Deerfield Beach | `public/markets/deerfield-beach.jpg` (abstract placeholder per Cycle 25 page-model) | placeholder | needs Mia decision |
| Coral Springs | `public/markets/coral-springs.jpg` (abstract placeholder) | placeholder | needs Mia decision |
| Plantation | `public/markets/plantation.jpg` (abstract placeholder) | placeholder | needs Mia decision |
| Weston | `public/markets/weston.jpg` (abstract placeholder) | placeholder | needs Mia decision |
| Hollywood | `public/markets/hollywood.jpg` (abstract placeholder) | placeholder | needs Mia decision |
| Davie | `public/markets/davie.jpg` (abstract placeholder) | placeholder | needs Mia decision |
| Sunrise | `public/markets/sunrise.jpg` (abstract placeholder) | placeholder | needs Mia decision |
| Boca Raton (reference page) | `public/markets/boca-raton.jpg` | older asset | needs decision (Boca is reference-only per Mia approved-9) |
| Delray Beach (reference page) | `public/markets/delray-beach.jpg` | older asset | needs decision |

## Priority order (recommended)

When Mia returns the packet with 1-3 priority cities, replace those first. Recommended bias:

1. **Pompano Beach** — Mia-cited as a primary market alongside Fort Lauderdale; visual matters most for SEO impressions.
2. **Hollywood** — broad search volume; placeholder is most jarring relative to the other vibrant beach markets.
3. **Weston / Coral Springs** — inland markets where placeholder reads more acceptable; Mia may keep these.

If Mia ships only 1 photo: replace **Pompano Beach** first.

## Source options (for Mia)

| Source | Pros | Cons | Cycle 30B verdict |
|---|---|---|---|
| **Mia's own photography** | full rights; brand-consistent | requires capture time | **preferred** |
| **Mia-commissioned local photographer** | full rights once licensed | $$ + lead time | preferred if budget |
| **Licensed stock from Unsplash+ / Getty / Adobe Stock** | fast; well-licensed | risk of "stock photo look" — known images on other sites | **acceptable v1** if Mia approves the specific image |
| **Generative AI imagery** | fastest | (a) sometimes uncanny / artifact-prone for real estate, (b) license / authenticity issues with depicting "this is Hollywood, FL," (c) emerging FREC / FTC scrutiny on AI-generated marketing | **NOT recommended** |
| **Scraping Realtor.com / Facebook / Google Maps** | fast | not licensed; copyright + ToS violation | **PROHIBITED** |
| **Abstract editorial-luxury placeholder (current)** | brand-consistent; no license risk | not photographic | **acceptable bridge** until real photos ship |

## Permission requirements

For Mia's own photos: she confirms in writing (text/email screenshot saved off-repo) "I own the rights and authorize use on miasanabria.com" before placement.

For commissioned: photographer license must permit web display + indefinite use + secondary use in marketing collateral. Photographer credit may be required (footer attribution).

For stock: license must permit commercial use on a real estate website. Save license PDF off-repo; reference path in `docs/mia-client-decision-record.md`.

## Image placement plan (Cycle 31/32)

| Asset | Where it lands |
|---|---|
| Hero / above-fold per market page | `public/markets/{slug}.jpg` at 1920×1080 source; Next.js `<Image>` component resizes for srcset; current `<Image priority>` for above-fold |
| Card thumbnail (markets hub + neighborhood rail) | derived from hero or separate 800×600 crop; reuse hero if performance OK |
| OG preview image | reuse hero OR commission specific 1200×630 OG image per page |
| Mia's portrait (About) | `public/people/mia-sanabria.jpg` — placeholder currently; same approval flow |
| Logo / favicon | LPT Realty + Mia's brand mark; current `public/logo-lpt.png` |

## Testimonials — capture rules (verbatim from Mia review packet §"Testimonials")

| Rule | Reason |
|---|---|
| Only direct quotes from **Facebook reviews** or **Realtor.com reviews** | Two surfaces where Mia's reviews are public and attributable. No private testimonials, no paraphrased reviews. |
| **Exact wording** from the source | FTC endorsement rule 16 CFR Part 255 — material misrepresentation of testimonial content can trigger enforcement |
| Reviewer name **matches the public display name** on FB / Realtor.com | Trace-back must be possible |
| **Written permission** captured before publication | Screenshot or DM confirmation from the reviewer; saved off-repo |
| **No invented reviews** | Honesty contract; `audit:no-fabrications` enforces |
| **No paraphrased reviews quoted as direct** | Same |
| **No reviews from people who didn't actually leave one publicly** | Provenance |

## Testimonial intake form / template

For each testimonial Mia wants to use, capture:

```yaml
testimonial:
  id: TESTI-NNNN
  reviewer_name: "Jane Smith"          # exact spelling/casing on source
  source: "facebook" | "realtor.com"
  source_url: "<deep link to the review>"   # NOT a screenshot — actual URL
  source_screenshot_path: "<off-repo path>"
  exact_text: |
    "Mia helped us navigate a tricky waterfront purchase. Her knowledge of
    Las Olas Isles and the dockage rules saved us from a $40k mistake."
  text_starts_at_quote_mark: true
  permission_received: yes
  permission_evidence_path: "<off-repo path to DM or email screenshot>"
  permission_date: YYYY-MM-DD
  surface_to_display:
    - homepage_proof_section
    - market-fort-lauderdale-proof-section
    - sellers-proof-section   # only if testimonial speaks to selling
  consent_to_keep_displayed: "indefinite" | "until <date>" | "until I retract"
```

## Source attribution rendering

When testimonials ship (Cycle 31/32):

```tsx
<blockquote>
  <p>"{exact_text}"</p>
  <footer>
    <cite>— {reviewer_name}</cite>
    <small>{source === 'facebook' ? 'via Facebook review' : 'via Realtor.com review'}</small>
  </footer>
</blockquote>
```

No header link to the source page (those are paginated and can rot). Source attribution is in the rendered text.

## Risks

1. **Stock photo collision** with another local agent's site. Mitigation: prefer Mia's own; if stock, choose lesser-used assets.
2. **Image rights expiry** — some stock licenses are not indefinite. Mitigation: track expiry date in `docs/mia-client-decision-record.md`.
3. **Testimonial reviewer disputes** the use post-publication. Mitigation: written permission + the right to delete on request, documented in `/privacy/`.
4. **AI-generated image misclassified as real photography** by Google → potential ranking demotion. Mitigation: do not use AI for these.
5. **Klein Morgan residue in OG previews** — Mia's legacy sites may still have OG images surfacing on social-shared links. Cycle 37 post-cutover task.

## Future paste-ready photos/testimonials application prompt

See `future-prompt-bank.md` → "Cycle X — Photos/Testimonials Application."

## DoD for the photos/testimonials cycle (when it fires)

- [ ] All Mia-provided photo decisions captured as `MIA-DEC-NNNN` rows
- [ ] License/permission evidence saved off-repo for each new asset
- [ ] Images placed under `public/markets/` (or `public/people/`) with correct slug
- [ ] `audit:images` passes (size budgets, alt text presence)
- [ ] Testimonials (if any) rendered with full source attribution
- [ ] `audit:no-fabrications` still 0 hits
- [ ] No image without an explicit Mia or licensor permission record
