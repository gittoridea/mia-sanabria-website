# Mia Sanabria — Client Decision Record

> **Source:** Live meeting between Mia Sanabria and Torrey Rozycki on 2026-05-13. Transcribed and confirmed via Cycle 24 Mia-decisions implementation lane. This document is the durable on-repo source of truth for Mia's confirmed positioning, identity, navigation, and content decisions. Cross-reference: `src/lib/mia.ts`, `src/lib/site.ts`, `ISA.md` (project root).

## Identity (locked)

- **Display name:** Mia Sanabria
- **Legal name:** Mia Mary Sanabria
- **Brokerage display:** LPT Realty
- **Brokerage legal:** LPT Realty LLC
- **License number (Florida):** SL3405877 — Mia confirmed correct on 2026-05-13. DBPR primary-source verification remains a pre-production-cutover gate (`src/lib/mia.ts` `unverified` block stays until DBPR portal screenshot captured).
- **Languages claimed in marketing:** English only. **Spanish/bilingual claims explicitly disallowed** — do not surface Spanish service language anywhere on the site or in schema.

## Designations approved (2026-05-13)

Mia verbally approved the following designations for site display. They have moved into `src/lib/mia.ts → unverified.designations` pending a written attestation + NAR membership card cross-check. **REALTOR® R logo display remains gated on NAR / Florida Realtors / BPSR membership confirmation per `CATO-03`.**

- PSA — Pricing Strategy Advisor
- RENE — Real Estate Negotiation Expert
- CDPE — Certified Distressed Property Expert
- ABR — Accredited Buyer's Representative
- SFR — Short Sales & Foreclosure Resource
- AHWD — At Home With Diversity

No other designations may be displayed without a new written approval from Mia.

## Canonical domain

- **Production canonical:** `https://miasanabria.com`
- **Prior canonical (legacy):** `https://miasanabriarealtor.com` — Mia's existing Direct Axess hosted site. DNS/cutover, 301 redirects from legacy → canonical, and brand-email reissue (`mia@miasanabria.com`) are external work owned by Torrey + Mia.
- **Code-side change:** `src/lib/site.ts` `PRODUCTION_URL` updated to `https://miasanabria.com`. Schema, OG, canonical link, hreflang, sitemap all auto-flow from this constant.
- **Boundary:** Claude / Cycle 24 lane does NOT touch DNS, Dokploy environment vars, Direct Axess, GHL sub-account hostnames, or the existing legacy domain. Cutover requires a separate Torrey-authorized cycle.

## Positioning thesis (approved)

> **Mia helps Southeast Florida luxury homeowners, absentee owners, and qualified buyers make confident real estate decisions with discreet, local, concierge-level guidance.**

- Price band: **$600k–$5M residences**
- Tone: local expert + approachable concierge
- Banned phrasing (per project `CLAUDE.md` honesty contracts): "luxury concierge", "white-glove", "bespoke", "high-net-worth", "off-market", "since 2017", "within two hours", "as seen in/on"
- Audit guard: `bun run audit:no-fabrications` will block overclaim regression (13-pattern catalog shipped Cycle 23).

## Audience priority

1. Luxury sellers ($600k–$5M)
2. Waterfront / lifestyle buyers
3. Qualified South Florida buyers
4. Absentee luxury owners
5. Expired-listing sellers
6. Relocating buyers
7. Investors
8. Renters / first-time buyers — **lower priority, not homepage-dominant**

Expired-listing sellers and absentee owners are real priority niches but must remain **secondary**, not homepage-dominant. Homepage retains an answer-first hero with broad luxury Southeast FL framing.

## Navigation (locked)

Header navigation, in order:

1. Neighborhoods
2. Buyers
3. Sellers
4. Blog
5. About
6. Contact
7. **Search icon** — hover/title/aria-label exactly: `Home Search`

Routes (code-side, kept for SEO continuity):

| Label | Route | Notes |
|---|---|---|
| Neighborhoods | `/markets/` | Label changed from "Markets" → "Neighborhoods" in nav; route slug retained to preserve existing SEO. Future cycle may add `/neighborhoods/` 301 alias. |
| Buyers | `/buyers/` | Unchanged |
| Sellers | `/sellers/` | Unchanged |
| Blog | `/insights/` | Label changed from "Insights" → "Blog" in nav; route slug retained for SEO. |
| About | `/about/` | Unchanged |
| Contact | `/contact/` | Unchanged |
| (Search icon) | `/markets/#property-search` | Anchors to existing property-search section; will retarget to Bridge IDX route when wired |

Removed from labeled top nav (still accessible via footer / homepage CTAs / direct route):
- `Home` (replaced by logo link)
- `Home Valuation` (`/valuation/`) — remains in footer + CTA strip

## Homepage hero (locked content; visual scaffold deferred)

- **H1 (two lines, exactly):**
  - Line 1: `South Florida Lifestyle`
  - Line 2: `Home Search`
- **Search box in hero:** Required. Initial implementation = "quick-jump" link to the property-search section + retained Matrix MLS iframe below. Full inline Bridge IDX search-by-city/price/beds remains blocked on the Bridge middleware decision (see IDX section below).
- **Hero background image:** Existing `/public/markets/fort-lauderdale.jpg` reused (Cycle 22-R1 approved twilight luxury waterfront). The current `miasanabria.com` hero asset is **not pulled** this cycle — no credential / scrape risk; reuse keeps the visual stable until Mia approves a new asset.

## Approved neighborhoods (9, locked)

The canonical Mia-approved neighborhood list (Broward focus, Mia's daily working market):

1. Fort Lauderdale
2. Pompano Beach
3. Deerfield Beach
4. Coral Springs
5. Plantation
6. Weston
7. Hollywood
8. Davie
9. Sunrise

**Coverage state vs existing repo content:**

| Approved neighborhood | Existing market page? | Status |
|---|---|---|
| Fort Lauderdale | Yes (`/markets/fort-lauderdale/`) | Live, FortLauderdaleV2 component |
| Pompano Beach | Yes (`/markets/pompano-beach/`) | Live (Cycle 18) |
| Deerfield Beach | **No** | Content gap — needs Mia copy + photos |
| Coral Springs | **No** | Content gap — needs Mia copy + photos |
| Plantation | **No** | Content gap — needs Mia copy + photos |
| Weston | **No** | Content gap — needs Mia copy + photos |
| Hollywood | **No** | Content gap — needs Mia copy + photos |
| Davie | **No** | Content gap — needs Mia copy + photos |
| Sunrise | **No** | Content gap — needs Mia copy + photos |

**Legacy markets (in repo, NOT on Mia's approved list — flagged for legacy SEO review):**

`coral-ridge`, `victoria-park`, `boca-raton`, `palm-beach`, `delray-beach`, `lighthouse-point`, `rio-vista`, `harbor-beach`, `las-olas-isles`, `seven-isles`, `sea-ranch-lakes`, `hillsboro-mile`, `bay-colony`, `bermuda-riviera`.

Per mission boundary ("avoid destructive removal unless safe"), legacy pages are **retained for SEO continuity** with a tracked decision: review and decide retain-vs-redirect-vs-deprecate in a separate Mia-content cycle. The homepage Featured Markets pager still references the existing East FL waterfront set until Mia confirms the homepage neighborhood-emphasis switch.

The Mia-approved 9 are now also surfaced as `MIA_APPROVED_NEIGHBORHOODS` in `src/lib/mia.ts` for downstream nav / sitemap / schema reuse.

## IDX — Bridge Data Output (architecture decision)

- **Provider chosen by Mia:** Bridge Data Output (`bridgedataoutput.com/docs/platform/`)
- **Credentials state:** Torrey has client ID, secret ID, server token, browser token ready. **No credentials are in this repo, in `.env`, or in chat. Claude has not seen them.**
- **Static-export blocker:** Site is Next.js 15 App Router with `next.config.ts` static export. Static export has **no server runtime** — there is no Next.js API route, no serverless function, no Node middleware to safely hold the server token or secret ID.
- **Safe options (any of):**
  1. Add a **Cloudflare Worker / Vercel Edge Function / Dokploy Node sidecar** that holds Bridge server token; site calls Worker URL with browser token. Worker proxies + sanitizes.
  2. Switch the affected routes to Next.js SSR/Server Components (drop static export for those routes) and call Bridge from server actions.
  3. Use Bridge's browser-safe public endpoints ONLY if Bridge docs explicitly permit browser token use against those endpoints; never use server token client-side.
- **Decision required:** Torrey owns the platform choice; counsel may need to review consent + tracking implications of new client-side data flow.
- **Code scaffold this cycle:** `src/lib/bridge.ts` — placeholder env var names + types + provider-pattern documentation. NO API calls, NO secrets, NO baked tokens. Build never executes against Bridge.

Env var placeholder names (values to be added to `~/.claude/.env` by Torrey when the runtime path is chosen — not now, not in this repo):

```
BRIDGE_CLIENT_ID
BRIDGE_SECRET_ID
BRIDGE_SERVER_TOKEN
NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN  # only if Bridge docs explicitly permit browser-side use
BRIDGE_DATASET_NAME               # MLS / dataset target slug
```

**Compliance reminder:** SEF MLS reciprocity disclaimer language (CATO-05), F.S. 475.278 brokerage-relationship statutory text (CATO-02), and TCPA PEWC consent (CATO-01) all interact with the IDX flow. Counsel review remains an external blocker.

## Testimonials

- **Sources Mia approved (2026-05-13):**
  - Facebook page: `https://www.facebook.com/miasanrea/`
  - Realtor.com profile (Mia's listing-agent profile)
- **Mia's standing instruction:** Direct quotes may be imported.
- **Hard constraints:**
  1. No invented review text. No paraphrase as direct quote.
  2. No implied endorsement from Facebook or Realtor.com (platforms are sources, not sponsors).
  3. Exact text + reviewer name + date + permission status must be captured **before publishing** any direct quote.
- **Action:** See `docs/mia-testimonial-capture-plan.md` for the capture workflow. No testimonials added on-site this cycle.

## CTAs / forms / lead capture

- Existing mailto fallback (`mailto:msanabriarea@gmail.com`) preserved this cycle.
- **GHL endpoint wiring blocked** on Torrey-provided credentials (`GHL_INQUIRY_WEBHOOK_URL`, `GHL_VALUATION_WEBHOOK_URL`) + counsel-approved TCPA consent text. See remaining-gap table §E.
- Form fields, field map, honeypot + Cloudflare Turnstile, success/failure UI: all blocked on GHL endpoint provisioning (Tomorrow §2.1–§2.10).

## Decisions intentionally NOT made this cycle (Mia content pending)

- "Most coveted" copy in `src/components/MeetMia.tsx` and `src/app/markets/page.tsx` — Mia approval pending; audit catalog leaves this phrase un-flagged so a Mia decision can land without breaking the build.
- Replacing the existing East-FL-waterfront homepage Featured Markets pager with the new Broward-9 set — requires Mia to approve the SEO consequence (deprecating East-FL waterfront emphasis) plus produce neighborhood copy for the 7 missing pages.
- Migrating `/insights/` → `/blog/` route slug — keeps SEO but is a separate redirect cycle.
- Migrating `/markets/` → `/neighborhoods/` route slug — same.
- Hero asset replacement with a current-`miasanabria.com`-style image — Mia must approve the source asset and grant license; no scraping.

## Pointer back to ISA

This decision record is referenced from `ISA.md` (Mia Sanabria Website ISA). On the next Mia-decisions cycle, the ISA Decisions and Verification sections should land receipts pointing back to the specific items here that closed live.

---

*Generated by Cycle 24 Mia-Live-Decisions implementation lane, 2026-05-13.*
