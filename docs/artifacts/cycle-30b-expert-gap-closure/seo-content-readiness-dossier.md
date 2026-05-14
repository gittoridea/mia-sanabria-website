# Lane E — Local SEO / Content Truth Readiness Dossier

**Author lens:** Local SEO / Content Truth Advisor
**Scope:** prepare SEO/content decisions without inventing facts; do not change route slugs; do not invent market stats; do not add new pages without Mia approval.
**Inputs reviewed:** `src/lib/mia.ts`, `src/lib/markets.ts`, `src/lib/insights.ts`, `src/app/sitemap.ts`, Cycle 27 evergreen city evidence library, Cycle 25 page-model, Cycle 30 nav/content drift audit, `audit:route-inventory` output, project CLAUDE.md honesty contracts.

## Current state

| Layer | Status |
|---|---|
| **Mia-approved neighborhoods** (9) | Fort Lauderdale, Pompano Beach, Deerfield Beach, Coral Springs, Plantation, Weston, Hollywood, Davie, Sunrise — all live, all 200, all in nav rail |
| **Reference-mention markets** (in copy, not full pages) | Boca Raton, Delray Beach, Palm Beach, Lighthouse Point, Victoria Park (listed in `<option>` filters and copy rail) |
| **Route slug**: `/markets/` | Retained for SEO continuity per Cycle 24 Mia-Live-Decisions lock |
| **Route slug**: `/insights/` | Retained; header labels it "Blog" |
| **Sitemap routes** | 47 — reconciles to filesystem per `audit:route-inventory` |
| **JSON-LD schema** | Per-page LocalBusiness / RealEstateAgent / Place; saturated per Cycle 23 audit |
| **Evergreen evidence library** (Cycle 27) | One per Mia-approved neighborhood; data is sourced (BCPA, Bureau of Census, schools.statesonline, etc.) not invented |
| **`audit:no-fabrications`** | 0 hits |
| **`audit:stale`** (luxury concierge, white-glove, etc.) | clean |
| **Visible non-nav "Insights" surfaces** | 3: footer "Explore" link, homepage section eyebrow, homepage section H2 (`Latest Insights`) |

## What is already closed

- Route slug decisions locked. **No `/markets/` → `/neighborhoods/` migration. No `/insights/` → `/blog/` migration.** Both routes retain their slug for SEO continuity. Mia's nav-label decision is the only public-facing change (`Neighborhoods`, `Blog`).
- All 9 Mia-approved cities have indexable pages with unique titles, descriptions, OG tags, JSON-LD.
- Cycle 25 site-continuity pass closed cross-route navigation: every neighborhood page links to (a) the markets hub, (b) sibling neighborhoods, (c) Buyers + Sellers CTAs.
- `audit:no-fabrications` enforces "no invented stats / awards / rankings / school quality." Cycle 27 evergreen library carries source citations per fact.

## What Claude can safely close now (Cycle 30B)

None this lane this cycle. The only candidate edit (extending `audit:mobile-readability` default routes to cover all 9 neighborhoods) belongs to Lane B and is closed there.

Route-migration alias plans are explicitly out-of-scope this cycle — they are a future redirect-strategy decision (see "Recommended future alias/redirect plan" below).

## What remains externally blocked

| Item | Owner | Status |
|---|---|---|
| Mia's decision on "Blog" vs "Insights" end-to-end labeling | Mia | open — surfaced in Cycle 30 review packet §6 |
| Mia's decision on Boca Raton + Palm Beach as full pages (vs reference-only) | Mia | open — surfaced in §"Specific questions — Neighborhoods" of packet |
| Mia's decision on which 1-3 cities get real photos first | Mia | open — surfaced in §"Photos" of packet |
| Real photography for those 1-3 cities | Mia (provide) + Torrey + Claude (place) | gated on Mia decision |
| Testimonials from FB / Realtor.com (exact text + permission) | Mia | gated on Mia capture |
| Counsel-final DMCA USCO designation | Counsel | open |

## Exact missing inputs

For Cycle 31 (Mia Review Decisions Application) to make SEO-affecting changes, the following Mia decisions are required as `MIA-DEC-NNNN` rows in the intake:

1. "Blog" end-to-end or keep mixed?
2. Boca Raton: keep reference-only or scaffold full `/markets/boca-raton/` page upgrade? (`/markets/boca-raton/` already exists as a placeholder per `audit:route-inventory`; needs Mia-confirmed copy + photo to elevate from "reference" to "full".)
3. Palm Beach: same question.
4. Confirmed final canonical = `https://miasanabria.com` (one-sentence reconfirm).
5. Any other neighborhoods she wants to swap in or out from the approved-9.

## Recommended future mission

Cycle 31 — Mia Review Decisions Application. See `future-prompt-bank.md` for the paste-ready prompt.

## Recommended future alias/redirect plan (no implementation this cycle)

When Mia decides on labels, here is the alias plan that **does not break SEO continuity**:

**Option A — keep current slugs forever** (recommended)
- `/markets/` and `/insights/` stay as the canonical URLs.
- Nav and visible labels say "Neighborhoods" and "Blog".
- No new redirects.
- Pro: zero risk to existing inbound links / sitemap submissions.
- Con: URL structure does not match the visible label semantically.

**Option B — add label-matching aliases that redirect**
- Add 301 redirects: `/neighborhoods/*` → `/markets/*`, `/blog/*` → `/insights/*`.
- Submit both URL families to GSC; canonical stays on `/markets/`/`/insights/`.
- Pro: shareable URLs match label.
- Con: doubles sitemap surface and requires Caddy/Next middleware work.

**Option C — migrate slugs and 301 the old**
- Rename routes: `/markets/*` → `/neighborhoods/*`, `/insights/*` → `/blog/*`.
- 301 from old → new everywhere.
- Pro: clean URL/label alignment.
- Con: SEO equity transfer takes weeks; high-risk pre-launch.

**Cycle 30B recommendation:** **Option A** until post-launch. Revisit after 90 days of `miasanabria.com` SEO baseline if Mia wants slug/label parity. Defer entirely if launch traffic is performing well.

## DoD for this lane (Cycle 30B)

- [x] Current state captured
- [x] What is closed catalogued
- [x] What is external-blocked catalogued with owners
- [x] Future alias/redirect plan provided (design only, no implementation)
- [x] No `/markets/` or `/insights/` slug migration this cycle

## Future paste-ready prompt fragment

> When Mia returns the review packet, append `MIA-DEC-NNNN` rows for label, Boca Raton, Palm Beach, and any photography decisions. Cycle 31 walks those rows; do not add or remove routes without a corresponding Mia decision row.
