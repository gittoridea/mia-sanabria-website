# BSS Realtor Website — Deployment Template V0

> Reusable deployment recipe extracted from the Mia Sanabria build (this repo).
> Forks to any BSS realtor client with content swaps in `src/lib/<client>.ts` + `src/lib/markets.ts` + `public/` assets — not code rewrites.

## Stack

- **Framework:** Next.js 15.x (App Router, `output: 'export'`, Server Components default)
- **Language:** TypeScript strict + `noUncheckedIndexedAccess`
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` tokens)
- **Schema:** schema-dts compile-time validated JSON-LD
- **Runtime:** bun 1.3+ (no npm/npx, ever)
- **Edge:** Caddy (in-container) → Traefik (Dokploy) → Let's Encrypt
- **Deploy substrate:** Dokploy on Helos VPS (or operator's equivalent)

## Repo skeleton

```
<client>-realtor-website/
├─ ISA.md                       # project ISA — 96+ ISCs (this is the test harness)
├─ docs/                        # ideal-state + gap matrix + checklists per client
├─ Dockerfile                   # multi-stage: bun → out → caddy
├─ docker-compose.yml           # Traefik labels for Dokploy
├─ Caddyfile                    # gzip+zstd + cache headers + full security header set
├─ DEPLOY.md                    # 4-step Dokploy runbook
├─ src/
│  ├─ app/                      # Next.js App Router pages
│  ├─ components/               # Hero, MarketCard, Faq, IntentRouter, CTAStrip, etc.
│  │  └─ schema/                # PersonSchema, RealEstateAgentSchema, LocalBusinessSchema, FAQPageSchema, BreadcrumbSchema, etc.
│  └─ lib/
│     ├─ site.ts                # SITE_URL toggle (staging/prod), brand, name, tagline
│     ├─ <client>.ts            # the agent's verified facts (ledger), unverified-fields nullable
│     └─ markets.ts             # market data — slug + name + tagline + lat/lon + localContext
└─ scripts/
   ├─ audit-stale-terms.ts      # forbidden-string sweep over out/
   ├─ audit-schema.ts           # JSON-LD parse + schema-dts validation
   ├─ audit-links.ts            # internal link resolution
   ├─ audit-seo.ts              # per-page title/desc/h1/hreflang/og/twitter
   └─ render-images.ts          # OG image generation via sharp
```

## Per-client variables (the swap surface)

| Variable | Lives in | Example (Mia) |
|----------|----------|---------------|
| Site name | `src/lib/site.ts → SITE.name` | "Mia Sanabria" |
| Site title | `SITE.title` | "Mia Sanabria \| Fort Lauderdale Luxury Real Estate" |
| Site description | `SITE.description` (≤ 160 chars) | "Mia Sanabria — REALTOR® with LPT Realty…" |
| Tagline | `SITE.tagline` | "Building Relationships for Life" |
| Anchor line | `SITE.anchorLine` | "If I don't know the answer, I will find it." |
| Production URL | `PRODUCTION_URL` constant | "https://miasanabriarealtor.com" |
| Staging URL | `STAGING_URL` constant | "https://miasanabriarealtor.trueidea.com" |
| Theme color | `SITE.themeColor` | "#0F2A44" |
| OG image | `public/og-default.jpg` (1200×630) | client headshot or location |
| Markets | `src/lib/markets.ts → MARKETS` | 7-row array |
| Featured-market slugs | `src/lib/<client>.ts → FEATURED_MARKETS` | `["fort-lauderdale", "coral-ridge", …]` |
| Verified facts | `<client>.ts → CLIENT.*` | `name`, `brokerage`, `contact`, `social` |
| Unverified facts | `<client>.unverified.*` (must default `null`) | `licenseNumber`, `designations`, `languages`, `displayOffice`, `yearsLicensed` |
| Tracking IDs | `<client>.tracking.*` | `ga4Id`, `userwayId` (placeholder until injection-flag turned on) |
| Service area | `<client>.serviceArea.administrative` | array of county/region names |

## Forbidden string set (per-client extension)

Each client extends `scripts/audit-stale-terms.ts → FORBIDDEN` with their own residue terms (prior brokerage names, prior contact emails, template placeholders). Universal patterns (Fair Housing steering, FREC superlatives, fabricated-media risk) stay shared.

## Dockerfile contract

- Multi-stage: `bun install` → `bun run build` → copy `out/` → caddy:alpine
- Caddy serves on `:80`; Traefik handles TLS termination
- Build args: at minimum `NEXT_PUBLIC_SITE_URL` (staging or production URL)
- Image: ≤ 50 MB final (alpine + caddy + static `out/`)

## Caddyfile contract

```
:80 {
  root * /srv
  encode gzip zstd
  file_server

  @hashed path_regexp /_next/static/.*
  header @hashed Cache-Control "public, max-age=31536000, immutable"

  @media path *.svg *.jpg *.jpeg *.png *.webp *.avif *.woff2
  header @media Cache-Control "public, max-age=2592000, must-revalidate"

  @html { path *.html ; path / ; path */ }
  header @html Cache-Control "public, max-age=300, s-maxage=600, must-revalidate"

  header {
    X-Content-Type-Options "nosniff"
    X-Frame-Options "SAMEORIGIN"
    Referrer-Policy "strict-origin-when-cross-origin"
    Permissions-Policy "geolocation=(), camera=(), microphone=(), payment=()"
    Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-src 'self' https://<MLS_HOST> https://www.google.com https://maps.google.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self';"
    -Server
  }

  handle_errors {
    @404 expression {http.error.status_code} == 404
    rewrite @404 /404.html
    file_server
  }
}
```

Per-client edit: `<MLS_HOST>` (Mia uses `sef.mlsmatrix.com`; Brian/Sunrise on a different IDX would whitelist their host).

## Deploy paths (in order of preference)

1. **Path 1: Git → Dokploy** — push to GitHub remote, Dokploy app pulls + builds. Webhook is unreliable (per Mia ISA Changelog 2026-05-07) — operator polls `application.one`; if `applicationStatus` unchanged after 60s, manually trigger `application.deploy` via API or UI.
2. **Path 2: Compose upload** — `tar czf` the source (excluding `node_modules`/`.next`/`out`), upload to Dokploy compose endpoint.
3. **Path 3: Local build → registry** — `docker build` locally, push to GHCR/registry, Dokploy pulls Image-mode app.

## Domains + DNS

- **Staging:** every client gets a subdomain on the operator's own domain (e.g. `<client>realtor.trueidea.com`). Cert via Traefik + Let's Encrypt. No client-DNS exposure required.
- **Production cutover:** documented separately in `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md`. DNS A record flips from current host to operator VPS IP; staging subdomain stays as a 301 safety net.

## Per-page metadata budget (HARD)

- `<title>` ≤ 60 chars (after the `%s | <SiteName>` template applies)
- `<meta name="description">` ≤ 160 chars
- `<h1>` exactly one per page
- `<link rel="canonical">` on every page
- hreflang `en-US` + `x-default` self-link (rendered explicitly in `layout.tsx <head>` — Next.js 15.1 `metadata.alternates.languages` does not currently emit the link tag in static export)
- Open Graph + Twitter card on every page
- Body ≥ 150 words on non-404 pages

Verified by `bun run audit:seo`.

## Schema budget (HARD)

- Every page emits a JSON-LD `@graph` matching the page's actual content:
  - Identity surfaces (Home, About, Contact): Person + RealEstateAgent + LocalBusiness + WebSite + BreadcrumbList
  - Market hubs: Place + RealEstateAgent + BreadcrumbList + (FAQPage if Q&A present)
  - Service surfaces (Buyers, Sellers, Valuation): Service + BreadcrumbList + FAQPage
  - Insights/blog: Article (or Blog hub)
- Every JSON-LD compile-time validated via schema-dts types
- Runtime null-guard on unverified facts: license #, designations, languages > English, display office never appear in production HTML until written client confirmation

Verified by `bun run audit:schema` + `bun run typecheck`.

## Build → audit → deploy loop

```bash
bun run typecheck          # TS strict pass
bun run build              # Next.js static export → out/
bun run audit:all          # stale + schema + links + seo
# if all green:
git add -A && git commit -m "feat: <change>"
git push origin main
# poll Dokploy:
# - if status changed within 60s → ready in ~120s
# - else manually trigger application.deploy (per ISA D-2026-05-07)
# verify:
for p in / /about/ /contact/ ...; do curl -s -o /dev/null -w "%{http_code}\n" "https://<staging>/$p"; done
```

## Cutover gate

Production cutover requires Production Readiness Gate (P3) PASS verdict + every Mia/Brian-confirmation row in the client's gap matrix marked confirmed. Documented per-client in `BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md`.

## Empirical baseline (Mia Sanabria, 2026-05-07)

- 18/18 routes 200 on staging
- All 4 audits pass
- 100 valid JSON-LD blocks across 20 pages
- 669 internal links resolve
- TLS valid (Let's Encrypt R13)
- Static-export ~3.5 MB total in `out/`
- First-Load JS shared 105 KB
