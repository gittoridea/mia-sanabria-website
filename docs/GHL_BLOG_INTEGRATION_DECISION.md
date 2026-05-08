# GHL Blog Integration — Decision Document

**Authored:** 2026-05-08
**Mission Phase:** Production Readiness Audit Phase 5
**Verdict:** **Next.js `/insights/` is canonical. GHL is CRM-only. No GHL-side blog needed.**

## Context

The principal's Phase 5 brief asked: "Discover the best practical path to wire Mia's BSS GHL Blog to the site." The audit must answer:

1. Is GHL Blog suitable as the canonical content surface, OR is the Next.js `/insights/` better positioned?
2. What integration path actually works given GHL V2 API constraints?
3. What's required to ship — or is the right answer "no integration"?

## Capability inventory (verified, no assumption)

Sources: `~/.claude/PAI/USER/PROJECTS/MiaSanabria/GHL_API_CAPABILITY_MATRIX.md` (2026-05-04 v1.0), `~/.claude/PAI/USER/PROJECTS/MiaSanabria/HERMES_GHL_ACCESS_MAP.md` (2026-05-04 v1.0).

| Capability | GHL V2 API status | Implication for blog wiring |
|---|---|---|
| Page/funnel/website CRUD | ❌ NOT SUPPORTED | Cannot create/update GHL Blog posts via API |
| Page content updates | ❌ NOT CONFIRMED (read-only at best) | Cannot programmatically push markdown into GHL Blog |
| Per-page SEO metadata | ❌ NOT SUPPORTED | Cannot auto-set per-post SEO from MDX |
| Custom code / tracking injection | ❌ NOT SUPPORTED | Cannot inject schema or analytics from API |
| Form creation | ❌ NOT SUPPORTED | UI-only |
| Workflow CRUD | 📖 READ-ONLY | Cannot programmatically attach blog publish to workflow |
| Contacts CRUD | ✅ SUPPORTED | Can sync form submissions → GHL Contact record |
| Conversations | ✅ SUPPORTED | Can send SMS/email triggered by site events |
| Opportunities | ✅ SUPPORTED | Can create pipeline opportunities from site form fills |
| Webhooks (subscribe + manage) | ✅ SUPPORTED | Can subscribe to GHL events; can hit GHL Inbound Workflow Webhooks |
| Calendars | ✅ SUPPORTED | Can render Mia's calendar booking flows |

**Headline finding:** GHL V2 API is **a CRM + ops + comms API, not a page-builder API.** Blog posts in GHL Blog are UI-authored only; there is no programmatic pipe from MDX → GHL Blog.

**Hermes MCP state:** `ghl_bss` and `ghl_bss_company` servers exist in `~/.hermes/config.yaml`, but **Mia's specific sub-account is NOT yet wired to MCP**. Mia's BSS sub-account API token would need to be provisioned + a third MCP server added before any programmatic GHL access to her blog is possible — and even then, the blog-CRUD limitation above stands.

## The 5 architecture options re-evaluated for THIS site at THIS moment

The site at `miasanabriarealtor.trueidea.com` is the Next.js staging that will REPLACE Mia's current Apache/GHL-CRM production at `miasanabriarealtor.com` at cutover. The question is which surface owns the public-facing blog post-cutover.

| Path | Description | Verdict |
|------|-------------|:-------:|
| 1. **Link out to GHL-hosted blog** | Next.js `/insights/` is a redirect or stub linking to `<gohighlevel-domain>/blog/...` | ❌ Fragments domain authority; wastes Mia's ranking signal on a GHL subdomain |
| 2. **Pull/sync GHL → Next.js** | GHL Blog is canonical author surface; cron pulls posts into MDX during build | ❌ Requires GHL Blog **read** API (not directly verified); requires Mia to learn GHL Blog UI; doubles content surface for one author |
| 3. **Embed GHL blog content** | iframe or fetch GHL Blog HTML on Next.js routes | ❌ Worst-case SEO (iframe); fragile (HTML scraping if no embed API); no schema control |
| 4. **Next.js canonical, mirror to GHL** | MDX is canonical; render in Next.js; copy-paste markdown into GHL Blog UI manually if a workflow trigger requires it | ⚠️ Manual sync surface; only meaningful if GHL workflows specifically trigger on GHL Blog publish |
| 5. **Hybrid (Option D from `MIA_BLOG_ARCHITECTURE_OPTIONS.md`)** | Canonical markdown in repo; render in Next.js NOW; render in GHL ONLY IF a future BSS realtor template needs GHL-side blog | ✅ Right answer — see below |

## Recommended path — Option 5 (Hybrid, deferred GHL render)

**For the Mia site at this cutover:** **Next.js `/insights/` is the canonical and sole public-facing blog surface. GHL is CRM-only.**

Rationale:
1. **GHL workflows do NOT require a GHL-Blog publish to fire.** Workflows fire on form-submission, contact-tag, calendar-book, or webhook receive — none of which depend on GHL Blog. Lead capture from `/insights/` essays will route through the same proxied GHL Inbound Workflow Webhook as form submissions on `/contact/` or `/valuation/` once the principal supplies the BSS sub-account webhook URL.
2. **SEO/AEO authority concentrates on one surface.** Search engines reward a single canonical for a topic cluster — splitting "Lighthouse Point lot profiles" between a Next.js essay and a GHL Blog version dilutes ranking signal.
3. **Schema control is decisive.** Next.js renders Article + FAQPage + BreadcrumbList JSON-LD per-essay (`audit:schema` reports 108 valid blocks across 19 pages). GHL Blog cannot match this without UI-injected per-post header code that requires manual maintenance.
4. **Portability stays preserved.** MDX in repo is forkable for BSS realtor template clients (Sunrise, Client C5, etc.). If any future client demands a GHL-Blog surface specifically, the SAME MDX file can be pasted into GHL Blog UI — content portability is the architectural guarantee.
5. **Mia's editing path** is `~/code/mia-sanabria-website/src/app/insights/page.tsx` (today, Torrey edits) → planned post-launch: a Decap CMS layer over the repo OR a small admin dashboard. GHL Blog UI editing is NOT a viable Mia-edits path because it would require the principal to teach Mia GHL Blog UI **and** maintain content sync to the repo.

## What ships this cycle

**Implemented:**
- Next.js `/insights/` is the public-facing blog. 2 long-form essays live (`What Working with a Fort Lauderdale REALTOR® Means in Practice`, `What Lighthouse Point Lot Profiles Actually Tell a Buyer`). Each emits Article + FAQPage schema + BreadcrumbList. Routes `/insights/` and the implied `/insights/<slug>/` pattern are sitemap-listed and crawlable post-cutover.
- Sitemap, canonical, OG image, FAQPage schema all canonical to the Next.js surface.
- GHL Inbound Workflow Webhook architecture (form submission → Cloudflare Pages Function proxy → GHL → Mia notified) is documented in `docs/GHL_INTEGRATION_OPTIMAL.md` and ships when the principal supplies the BSS sub-account webhook URL.

**NOT implemented (intentionally):**
- No GHL Blog content sync. None needed.
- No GHL Blog read API integration. Not viable; GHL V2 API doesn't support it cleanly.
- No GHL Blog mirror. Not needed unless a specific GHL workflow requires GHL-Blog publish-trigger (no current requirement).

## What requires principal decision

1. **Confirm canonical-Next.js verdict** — if you specifically want GHL Blog to be the canonical surface (e.g., because Mia's existing BSS sub-account already has GHL-Blog posts that drive workflows), invert this verdict and we'll do path 2 (pull/sync) with the read-only GHL Blog API IF endpoints exist on the V2 API.
2. **Provide Mia's BSS sub-account API token** — needed for ANY programmatic GHL access (contacts sync, workflow trigger, calendar embed). Per HERMES_GHL_ACCESS_MAP, currently NOT wired. ~15 min provisioning once token is supplied.
3. **Form-wiring webhook URL** — gates Pillars 6 + 7 PARTIAL → PASS in the 22-pillar scorecard.

## Open questions for next session

- Does Mia's BSS GHL sub-account already have GHL-Blog posts that need migration TO the Next.js `/insights/` surface? If yes, manual content-pull during the .com cutover window. If no, this question is closed.
- Will future BSS realtor template clients (e.g., Sunrise) want GHL-hosted blog instead of Next.js-hosted? If yes, the Hybrid Option 5 supports it without re-architecture — same MDX files, different render target.

## Cross-references

- `~/.claude/PAI/USER/PROJECTS/MiaSanabria/GHL_API_CAPABILITY_MATRIX.md` — GHL V2 API capability matrix
- `~/.claude/PAI/USER/PROJECTS/MiaSanabria/HERMES_GHL_ACCESS_MAP.md` — Hermes ↔ GHL MCP access map
- `~/.claude/PAI/USER/PROJECTS/MiaSanabria/MIA_BLOG_ARCHITECTURE_OPTIONS.md` — original 4-option comparison (Option D = today's recommendation)
- `~/code/mia-sanabria-website/docs/GHL_INTEGRATION_OPTIMAL.md` — form-wiring architecture (Cloudflare Pages Function proxy, TCPA + Florida § 501.059 + CCPA consent text)
- `~/code/mia-sanabria-website/src/app/insights/page.tsx` — canonical blog rendering surface
