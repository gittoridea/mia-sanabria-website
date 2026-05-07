# Mia Sanabria — Luxury Real Estate Site

Production Next.js 15 static-export site for Mia Sanabria, Southeast Florida luxury real estate concierge with LPT Realty.

- **Staging:** `https://miasanabriarealtor.trueidea.com`
- **Production:** `https://miasanabriarealtor.com` (cutover gated)
- **Stack:** Next.js 15 + App Router + TypeScript strict + Tailwind CSS 4 + static export
- **Runtime:** bun 1.3+ (no npm/npx)
- **Deploy:** Dokploy on Helos VPS (Caddy serves static `out/`, Traefik fronts it)

## Quick start

```bash
bun install            # install dependencies
bun run dev            # dev server at http://localhost:3000
bun run typecheck      # tsc --noEmit
bun run lint           # next lint
bun run build          # produces out/ static export
bun run audit:all      # stale terms + schema + links audits
```

## Deploy

- Push to a remote (GitHub/Gitea) and connect to Dokploy.
- Dokploy reads `docker-compose.yml` (or you configure the app via the Dokploy UI with the same Traefik labels).
- Cert provisioning is handled by Traefik's letsencrypt resolver.
- Build env: `NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.trueidea.com`.

## Editing content

- **Site copy / nav:** `src/lib/site.ts`
- **Mia facts (NAP, social, voice):** `src/lib/mia.ts` — every fact traceable to PUBLIC_FACT_LEDGER v2
- **Markets:** `src/lib/markets.ts` — add a slug + content; the dynamic route `/markets/[slug]/` and the markets index pick it up automatically
- **Pages:** `src/app/<route>/page.tsx`
- **Schema components:** `src/components/schema/*` — every page composes the schema graph it needs

## Adding a new market

1. Append a `Market` entry to `MARKETS` in `src/lib/markets.ts`.
2. Drop a placeholder hero into `public/markets/<slug>.svg` (any image works).
3. `bun run build` — sitemap, schema, breadcrumbs, FAQ all auto-emit.

## Adding a new page

1. Create `src/app/<route>/page.tsx`.
2. Export `metadata` with `title`, `description`, `alternates.canonical`.
3. Compose schema components and one or more sections.
4. Add to `NAV` / `FOOTER_NAV` in `src/lib/site.ts` if linkable.
5. Add to `src/app/sitemap.ts`.

## Pre-launch checklist (the top-100 spirit)

- [x] Per-page unique title + meta description
- [x] Per-page canonical URL + OG + Twitter card
- [x] JSON-LD schema saturation (Organization, WebSite, Person, RealEstateAgent, LocalBusiness, BreadcrumbList, FAQPage, Place, Service, ContactPage)
- [x] sitemap.xml + robots.txt with sitemap directive
- [x] Manifest + favicon + theme-color
- [x] Skip-to-main-content link
- [x] Prefers-reduced-motion respected
- [x] Color contrast meets WCAG AA
- [x] Forms labeled, keyboard reachable
- [x] HSTS + X-Frame + X-Content-Type-Options + Referrer-Policy + Permissions-Policy headers (Caddy)
- [x] Long-cache for hashed assets, short-cache for HTML
- [ ] Live Lighthouse run on staging URL (deferred to post-deploy)
- [ ] Google Search Console + Bing Webmaster verified (post-deploy)
- [ ] GA4 GTM container wired via env (deferred to Mia G3 + GTM)
- [ ] Form endpoints wired to GHL CRM (deferred to G6)
- [ ] License # / designations / Spanish populated in `mia.ts` (deferred — Mia confirmation gate)

## Project context

Broader context (client brief, content strategy, prelaunch defects, GHL integration, fact ledger) lives in `~/.claude/PAI/USER/PROJECTS/MiaSanabria/`. This repo is the website artifact only.
