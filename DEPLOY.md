# Deploy Runbook — miasanabriarealtor.trueidea.com

This repo is production-ready. Last mile to ship: 4 manual steps, ≤10 min.

## Prerequisites

- Dokploy at `dokploy.trueidea.com` (already running on Helos VPS)
- DNS for `trueidea.com` (Hostinger or wherever the zone lives)
- Cloudflare/DNS access for the A record
- Git remote (GitHub, Gitea, or local Dokploy file upload — pick one path below)

## Path 1 — Dokploy Git Integration (recommended)

### Step 1 · Create a remote and push

```bash
cd ~/code/mia-sanabria-website
# Pick one:
gh repo create torrey-rozycki/mia-sanabria-website --private --source=. --push
# OR
git remote add origin git@github.com:torrey-rozycki/mia-sanabria-website.git
git branch -M main
git push -u origin main
```

### Step 2 · Add DNS A record

In your DNS provider for `trueidea.com`, add:

```
miasanabriarealtor   A   <Helos VPS IP — 148.230.82.215>   300 TTL
```

Verify: `dig +short miasanabriarealtor.trueidea.com` should return `148.230.82.215`.

### Step 3 · Create Dokploy application

1. Sign in at `https://dokploy.trueidea.com/`.
2. Pick a project (or create `Mia` project).
3. **Create Application → Application** (compose-style, NOT a docker image pull).
4. Source: **Git** → connect your GitHub account → pick `mia-sanabria-website`, branch `main`.
5. Build type: **Dockerfile** (the repo root has one).
6. **Build args:** add `NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.trueidea.com`.
7. **Domains:** add `miasanabriarealtor.trueidea.com` with Let's Encrypt enabled, port `80`.
8. Click **Deploy**.

Dokploy will: clone → docker build (multi-stage, Bun → Caddy) → start container → wire Traefik route → request Let's Encrypt cert.

### Step 4 · Verify

```bash
# Wait ~60s for cert provisioning
curl -I https://miasanabriarealtor.trueidea.com/
# Expect: HTTP/2 200 + valid TLS cert

# Quick page sweep
for p in / /about/ /contact/ /buyers/ /sellers/ /valuation/ /markets/ /markets/fort-lauderdale/; do
  echo -n "  $p — "
  curl -s -o /dev/null -w "%{http_code}\n" "https://miasanabriarealtor.trueidea.com$p"
done
```

Then run Lighthouse against `https://miasanabriarealtor.trueidea.com/` from PageSpeed Insights or local Chrome DevTools.

---

## Path 2 — Compose file upload (no git remote)

Dokploy supports compose-from-source. From the project directory:

```bash
tar czf /tmp/mia.tar.gz -C ~/code/mia-sanabria-website \
  --exclude=node_modules --exclude=.next --exclude=out .
```

In Dokploy UI: **Create Application → Compose** → upload `/tmp/mia.tar.gz` → Deploy. Same DNS + cert flow as Path 1.

---

## Path 3 — Local docker build + push to registry

If you have a Docker registry (GHCR, Docker Hub, GitLab, etc.):

```bash
cd ~/code/mia-sanabria-website
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.trueidea.com \
  -t ghcr.io/<you>/mia-website:latest .
docker push ghcr.io/<you>/mia-website:latest
```

Then in Dokploy: **Create Application → Image** → registry image `ghcr.io/<you>/mia-website:latest` → port `80` → domain → Deploy.

---

## Cutover to miasanabriarealtor.com (separate gated step — NOT this session)

Once staging is verified by Mia and Torrey:

1. **DNS:** flip `miasanabriarealtor.com` A record from Direct Axess to the Helos VPS IP.
2. **Dokploy:** edit the application's domains — replace (or add) `miasanabriarealtor.com` and `www.miasanabriarealtor.com`. Let Traefik issue new certs.
3. **Site env:** set `NEXT_PUBLIC_SITE_URL=https://miasanabriarealtor.com` in Dokploy build args, redeploy. Schema, sitemap, canonicals all flip automatically.
4. **301 redirect:** the staging subdomain stays live; add a Caddy route in `Caddyfile` (or a Traefik middleware) to 301 from staging → production once you've cut over.
5. Re-submit sitemap to Google Search Console + Bing Webmaster Tools under the new domain.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| 502 from Traefik | container not running OR port mismatch | check `docker logs` in Dokploy; confirm Caddyfile listens on `:80` |
| Cert pending → fail | DNS not propagated yet OR rate-limited | wait 5 min; if rate-limited, switch to staging issuer for a day |
| Pages render but no styles | `NEXT_PUBLIC_SITE_URL` mismatch causing CSP-style block | verify build arg matches domain exactly (https, no trailing slash) |
| Sitemap shows wrong host | env var was wrong at build time | rebuild with correct `NEXT_PUBLIC_SITE_URL` |
| MLS iframe blocked | mixed-content or X-Frame headers from MLS | confirm `https://sef.mlsmatrix.com` is reachable (it is) |

## Smoke tests post-deploy

```bash
# JSON-LD structured data sanity
curl -s https://miasanabriarealtor.trueidea.com/ | grep -o 'application/ld+json' | wc -l
# Expect: 5 (Org, WebSite, Person, RealEstateAgent, LocalBusiness, Breadcrumb, FAQ — 7 actually)

# Sitemap accessible to crawlers
curl -s https://miasanabriarealtor.trueidea.com/sitemap.xml | head -20

# Robots permits indexing
curl -s https://miasanabriarealtor.trueidea.com/robots.txt
```

## Search Console + analytics setup (post-launch)

- [ ] Add property in Google Search Console (DNS TXT or HTML file verification)
- [ ] Submit `https://miasanabriarealtor.trueidea.com/sitemap.xml`
- [ ] Add Bing Webmaster property + sitemap
- [ ] Wire GA4 (`G-GTPQM5P6Q6` already in `mia.ts`) via GTM (`<script>` injection in `layout.tsx`)
- [ ] Wire UserWay accessibility widget (`vVNkJJLvR4`) when Mia approves
