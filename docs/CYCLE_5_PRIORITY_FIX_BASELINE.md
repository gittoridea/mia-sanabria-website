# Cycle 5 Priority Fix Baseline — Pre-Implementation

**Captured:** 2026-05-08 PM cycle 5 (before code changes)
**Source:** live staging `https://miasanabriarealtor.trueidea.com` at cycle-4 commit `0c259cc`, last-modified `Sat, 09 May 2026 02:01:24 GMT` (cycle-4 deploy state); ETag `didmtu6seolc2bl8`
**Capture method:** `google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=W,H --virtual-time-budget=20000 --screenshot=...`
**Storage:** `/tmp/mia-cycle5-fix-before/` (70 PNGs = 14 routes × 5 viewports)

## Routes (14)

`/`, `/about/`, `/buyers/`, `/sellers/`, `/valuation/`, `/contact/`, `/markets/`,
`/markets/fort-lauderdale/`, `/markets/coral-ridge/`, `/markets/victoria-park/`,
`/markets/rio-vista/`, `/markets/harbor-beach/`, `/markets/boca-raton/`, `/markets/delray-beach/`

## Viewports (5)

- `mobile-sm` 320×568
- `mobile-md` 375×812
- `tablet` 768×1024
- `laptop-sm` 1280×800
- `desktop` 1440×900

## Pre-cycle-5 visual issues confirmed

### Hero H1 contrast / readability (homepage)

Pre-cycle-5: hero used `imageSrc="/og-default.jpg"` (a generic 1200×630 OG card cropped to a tall hero — light visual weight). Overlay was the cycle-2 "brighter feel" gradient `from-navy-900/15 via/35 to/15`. H1 carried the cycle-3 text-shadow but on this lower-contrast image + lighter overlay the typography felt thin. Visible at every `home_*.png` screenshot.

### Featured Markets cards — first 4 of 6 visually appear missing images

Pre-cycle-5: principal observed first 4 featured cards (fort-lauderdale, victoria-park, boca-raton, delray-beach in display order) appeared blank in screenshots. Investigation:

- Built HTML DOES contain `<img src="/markets/{slug}.jpg">` for ALL 6 cards (verified by direct HTML grep).
- All 6 image files present on disk: `audit:images.localFilesResolve` PASS for 187 imgs.
- The cards use `loading="lazy"` (Next.js default for non-priority Image components).
- Screenshot capture at `--virtual-time-budget=20000` did not always trigger lazy-load on cards below the fold; capture artifact rather than build artifact.

Visible at `home_desktop.png` + `home_laptop-sm.png` + `home_tablet.png`.

### `/markets/` hero missing image

Pre-cycle-5: `/markets/page.tsx` used `<Hero ... background="navy">` (text-only hero with brass radial-gradient background). No image asset rendered in the hero region. Visible at `home_markets_*.png` (note: `home_markets_*` is the screenshot naming prefix for `/markets/`).

### `/about/` hero missing image-led treatment

Pre-cycle-5: `/about/page.tsx` used `<Hero ... background="navy">` (text-only). Mia's headshot rendered in a brass-card frame in the section BELOW the hero (intentional — bio panel), but the hero itself read as text-only navy with no image anchor. Visible at `home_about_*.png`.

### Tagline / brand-voice family-homes vs luxury-first

Pre-cycle-5: `MIA.voice.tagline` = "Fort Lauderdale REALTOR® | Waterfront, Luxury, and Family Homes Where Memories Are Made" rendered in:

- `MIA.voice.tagline` (src/lib/mia.ts:34)
- `SITE.tagline` (src/lib/site.ts:25)
- `SITE.description` (src/lib/site.ts:24) — "helps families find waterfront, luxury, and family homes where memories are made"
- Homepage `<Hero heading="Fort Lauderdale REALTOR® — Waterfront, Luxury, and Family Homes Where Memories Are Made.">` (src/app/page.tsx:79)
- BRAND_SYSTEM_CONTRACT.md tagline reference (line 14)

Cycle-3 surfaced the family-vs-luxury tension as PRINCIPAL_DECISION_REGISTER Card 3. Cycle-5 mission text directs DECIDED → luxury/waterfront. All five surfaces above need updates.

### Email identity consistency

Pre-cycle-5: `MIA.contact.email = "msanabriarea@gmail.com"` (correct). Documents only mention `mia@miasanabriarealtor.com` as a forward-looking provisioning note (NEXT_SESSION_LEAD_MAGNET / RESEARCH_COMPLIANCE_LOGOS / CUTOVER_PACKET / PRODUCTION_READINESS_HANDOFF_PM*). No public src/ rendering of branded email — already canonical.

### Service-area statement

Pre-cycle-5: `MIA.serviceArea.administrative = ["Eastern Fort Lauderdale", "Eastern Boca Raton", "Eastern Delray Beach"]` (correct — Boca/Delray NOT labeled Broward). FAQ + page-level prose mostly aligned. Cycle-5 mission directs preferred phrasing variants for marketing copy.

## Mobile / nav / footer pre-cycle-5

Mobile/nav/footer/typography all already passing post-cycle-4 fixes (backdrop-blur removed, footer touch-targets 44×44, etc.). Cycle-5 does not touch nav/footer structurally — only refines hero + tagline + AEO content + 4 new audit sentinels.

## Cross-references

- Cycle-5 after: `docs/CYCLE_5_PRIORITY_FIX_AFTER.md`
- Closeout: `docs/PRODUCTION_READINESS_HANDOFF_PRIORITY_2_4_FIXES_2026-05-08.md`
- Design-level-up trigger: `docs/NEXT_SESSION_DESIGN_LEVEL_UP_TRIGGER_PROMPT.md`
- Prior cycle baseline: `docs/CYCLE_4_VISUAL_QA_BASELINE.md`
- Storage: `/tmp/mia-cycle5-fix-before/` (70 PNGs)
