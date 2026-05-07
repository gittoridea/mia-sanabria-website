# BSS Realtor — Launch / Cutover Checklist

> Step-by-step recipe for moving a client surface from staging (`<client>realtor.trueidea.com`) to production (`<client>realtor.com`).
> No step happens automatically. Every step has a verification probe.
> Includes rollback commands.

## Pre-flight — must ALL be true before starting

- [ ] Production Readiness Gate (P3) PASS verdict on the staging build
- [ ] Compliance Gate PASS verdict
- [ ] Client review pack signed off (every box in §8 checked)
- [ ] Fact ledger §1 has every gate-blocking field
- [ ] GHL packet signed off (if applicable to this client)
- [ ] Operator has DNS access for the production domain
- [ ] Operator has Dokploy access at `dokploy.trueidea.com`
- [ ] Last-known-green build commit hash captured: `<hash>`
- [ ] Operator has 90 minutes contiguous to monitor the cutover

If any precondition is unmet — **stop**. Cutover does not proceed.

---

## Step 1 — Capture the rollback baseline

| # | Action | Command / UI | Probe |
|---|--------|--------------|-------|
| 1.1 | Note current DNS A record value for `<client>realtor.com` | `dig +short <client>realtor.com` | record IP for rollback |
| 1.2 | Confirm Dokploy app's current build status | Dokploy UI → app → Deployments → "Latest successful" | status = `done` |
| 1.3 | Snapshot environment variables | Dokploy UI → app → Environment | save current `NEXT_PUBLIC_SITE_URL` |
| 1.4 | Confirm staging URL still 200 | `curl -I https://<client>realtor.trueidea.com/` | status 200 |

Output: a one-page rollback baseline doc.

## Step 2 — Update Dokploy app domains + build args

| # | Action | Command / UI | Probe |
|---|--------|--------------|-------|
| 2.1 | Add `<client>realtor.com` to Dokploy app's Domains list with Let's Encrypt enabled, port 80 | Dokploy UI → app → Domains → Add | UI shows pending cert |
| 2.2 | Add `www.<client>realtor.com` to Dokploy app's Domains list (same settings) | Dokploy UI | UI shows pending cert |
| 2.3 | Update build arg `NEXT_PUBLIC_SITE_URL=https://<client>realtor.com` | Dokploy UI → app → Environment → Build args | save |
| 2.4 | Trigger a redeploy | Dokploy UI → app → Deploy | status flips to `building` |

**Note:** at this point the app responds on the new hostname routes too — but DNS hasn't pointed to the VPS yet. Traefik will issue certs once DNS lands.

## Step 3 — DNS swap

| # | Action | Where | Probe |
|---|--------|-------|-------|
| 3.1 | Update A record for `<client>realtor.com` → Helos VPS IP (`148.230.82.215` for trueidea.com infra) | DNS provider UI (Hostinger / Cloudflare / etc.) | TTL 300 |
| 3.2 | Update A record for `www.<client>realtor.com` → same IP | DNS provider UI | TTL 300 |
| 3.3 | Wait for propagation | `dig +short <client>realtor.com` | matches VPS IP |
| 3.4 | Wait for Let's Encrypt cert provisioning | Dokploy UI shows green check; `curl -I https://<client>realtor.com/` returns 200 | TLS valid |

**Typical wall-clock:** 1–10 minutes for DNS, 30–120 seconds for cert.

## Step 4 — Live verification sweep

| # | Action | Command | Pass |
|---|--------|---------|------|
| 4.1 | Public route sweep | `for p in / /about/ /contact/ /buyers/ /sellers/ /valuation/ /insights/ /markets/ /privacy/ /terms/ /accessibility/; do curl -s -o /dev/null -w "%{http_code} $p\n" "https://<client>realtor.com$p"; done` | every line `200 …` |
| 4.2 | Each market page 200 | similar loop over `/markets/<slug>/` per `MARKETS` | every line `200 …` |
| 4.3 | sitemap.xml 200, lists production host | `curl -s https://<client>realtor.com/sitemap.xml | head -5` | host = production |
| 4.4 | robots.txt 200, sitemap directive points to production | `curl -s https://<client>realtor.com/robots.txt` | yes |
| 4.5 | manifest.webmanifest 200 | `curl -I https://<client>realtor.com/manifest.webmanifest` | 200 |
| 4.6 | OG image 200 | `curl -I https://<client>realtor.com/og-default.jpg` | 200 |
| 4.7 | Security headers present | `curl -I https://<client>realtor.com/ | grep -iE "(strict-transport\|content-security\|x-frame\|x-content-type\|referrer-policy\|permissions-policy)"` | all 6 present |
| 4.8 | TLS valid for `.com` and `www.` | `openssl s_client -connect <client>realtor.com:443 -servername <client>realtor.com </dev/null 2>/dev/null | openssl x509 -noout -issuer -subject` | issuer = Let's Encrypt; subject matches |
| 4.9 | Schema canonical/og:url reflects production | `curl -s https://<client>realtor.com/ | grep -oE '(rel="canonical"\|og:url)[^>]*'` | hosts = `<client>realtor.com` |
| 4.10 | Audit suite still clean against fresh `out/` | `bun run audit:all` | exit 0 |

## Step 5 — Staging 301 → production

| # | Action | Where | Probe |
|---|--------|-------|-------|
| 5.1 | Add Caddy redirect block (or Traefik middleware) on the staging app to 301 to `https://<client>realtor.com` | Caddyfile or Dokploy app config for the staging surface | `curl -I https://<client>realtor.trueidea.com/` returns 301 to production |
| 5.2 | Verify all paths redirect (not just `/`) | `curl -I https://<client>realtor.trueidea.com/about/` | 301 to `/about/` on production |

The staging URL stays live as a 301 safety net. It is NOT taken down.

## Step 6 — Search Console + Bing reverification

| # | Action | Where | Probe |
|---|--------|-------|-------|
| 6.1 | Add `<client>realtor.com` property in Google Search Console (DNS TXT or HTML file verification) | search.google.com/search-console | property verified |
| 6.2 | Submit `https://<client>realtor.com/sitemap.xml` in GSC | GSC UI → Sitemaps | sitemap accepted |
| 6.3 | Add Bing Webmaster property + sitemap | bing.com/webmasters | property verified |
| 6.4 | Submit URL inspection for Home + About | GSC URL Inspection | indexable |

## Step 7 — Analytics injection (optional, gated)

If client + operator approved analytics injection (see GHL packet §7 + Compliance Gate §7):

| # | Action | Where |
|---|--------|-------|
| 7.1 | Set `NEXT_PUBLIC_ENABLE_GA=1` in Dokploy build args | UI |
| 7.2 | Set `NEXT_PUBLIC_GA4_ID=<id from fact ledger §9>` | UI |
| 7.3 | Redeploy | UI |
| 7.4 | Verify `gtag` call fires on Home | DevTools Network panel → `collect?v=2&tid=G-...` request |
| 7.5 | Verify cookie consent gates Layer 2/3 trackers | manual click-through |
| 7.6 | Confirm GA4 Realtime shows the test session | GA4 UI |

If not yet approved: skip this section. Cutover proceeds without analytics.

## Step 8 — Mark project ISA `phase: complete`

| # | Action |
|---|--------|
| 8.1 | Append ISA `## Verification` with `Production Readiness Gate: PASS @<commit>` |
| 8.2 | Append ISA `## Verification` with cutover evidence: route sweep output, TLS check output, sitemap host check |
| 8.3 | Set ISA frontmatter `phase: complete`, `progress: <N/N>` |
| 8.4 | Final commit + push |

---

## Rollback recipes

### Rollback A — Code regression after cutover

```bash
cd ~/code/<client>-realtor-website
git revert <bad-commit>
git push origin main
# poll Dokploy; manually trigger application.deploy if webhook silent (per ISA D-2026-05-07)
```

**RTO target:** ≤ 5 minutes.

### Rollback B — Deploy regression (build broke, container won't start)

In Dokploy UI: app → Deployments → click the previous successful build → "Rollback".

**RTO target:** ≤ 3 minutes.

### Rollback C — Env var or build-arg mistake

In Dokploy UI: app → Environment → fix → Redeploy.

**RTO target:** ≤ 5 minutes.

### Rollback D — DNS cutover regression

Re-flip A records for `<client>realtor.com` and `www.` back to the prior host's IP (captured in Step 1.1). The staging subdomain (`<client>realtor.trueidea.com`) stays live and continues serving the new build, so the operator has a place to stage the next attempt.

**RTO target:** ≤ 10 minutes (DNS TTL + propagation).

### Rollback E — Analytics regression

Set `NEXT_PUBLIC_ENABLE_GA=0` in Dokploy → Redeploy. Site renders without tracking.

**RTO target:** ≤ 5 minutes.

### Rollback F — Total revert

If multiple categories regress: re-flip DNS (Rollback D), revert env vars (Rollback C), then revert code commits (Rollback A). The staging subdomain remains untouched as a known-good surface.

**RTO target:** ≤ 15 minutes.

## Anti-patterns

- **Do not** flip DNS before Dokploy has the new domain in its app config — Traefik will fail to issue a cert until DNS lands; and serving on a host without a valid cert is an instant trust failure.
- **Do not** delete the staging subdomain after cutover. It is the rollback safety net AND the ongoing dev surface for future iteration.
- **Do not** push GA4 or pixel injection at the same moment as the DNS swap — bundle them as separate gated steps so a regression in either is isolatable.
- **Do not** mark the ISA `phase: complete` until Step 8 lands — otherwise the project's record-of-truth lies.
