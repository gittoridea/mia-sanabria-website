# Launch / Cutover Runbook (Cycle 22 — Team 7)

> **Status: PLAN-ONLY.** No DNS edits, no indexing toggles, no token rotations this cycle.
> This runbook is the authoritative sequence for cutting `miasanabriarealtor.trueidea.com` (staging) → production domain.

## 1. Production domain decision path

Decided by `MIA_DECISION_PACKET.md` §3.

| If §3 choice = | Then |
|---|---|
| **3A** (`miasanabriarealtor.com` canonical, `miasanabria.com` 301 → it) | No source change to `src/lib/site.ts:7` PRODUCTION_URL; `miasanabria.com` is configured as a 301 redirect at DNS/host edge. |
| **3B** (`miasanabria.com` canonical, `miasanabriarealtor.com` 301) | `src/lib/site.ts:7` flips to `https://miasanabria.com`; `miasanabriarealtor.com` is reconfigured as 301 source domain at DNS/host edge. |
| **3C** (both serve content directly) | Not recommended — duplicate content SEO penalty. Reject. |

## 2. DNS cutover checklist

Pre-cutover (≥ 7 days before flip):

- [ ] Confirm DNS provider for `miasanabriarealtor.com` (likely Cloudflare or current registrar)
- [ ] Confirm DNS provider for `miasanabria.com` (same or different)
- [ ] Pre-stage TTL reduction to 300s on A/CNAME records of the cutover domain (~48h before flip)
- [ ] Confirm Dokploy app `XJSRlvH-91ZtUsh0RPGvo` accepts the chosen production hostname
- [ ] Confirm Caddy in Dokploy is configured with the chosen production hostname + ACME (Let's Encrypt) certificate
- [ ] Inventory existing `miasanabriarealtor.com` host (currently Direct Axess) — coordinate sunset window with provider per §10 "Legacy presence sunset"

Cutover day:

- [ ] Flip DNS A/CNAME records to point at Dokploy edge IP for chosen production hostname
- [ ] Verify resolution via `dig +short` from multiple resolvers (1.1.1.1, 8.8.8.8, 9.9.9.9)
- [ ] Verify ACME certificate issuance (Caddy auto-renews; first request triggers cert)
- [ ] Test `curl -I https://<production>/` → expect 200, valid cert

Post-cutover (within 24h):

- [ ] Confirm legacy host is serving 301 → production (Direct Axess shutdown OR DNS-only retention)
- [ ] Restore DNS TTL to original (3600 or higher) after stability is confirmed

## 3. Canonical URL strategy

`src/app/sitemap.ts` + every page's `metadata.alternates.canonical` reads from `SITE.url` (which is `process.env.NEXT_PUBLIC_SITE_URL ?? STAGING_URL`).

| State | `NEXT_PUBLIC_SITE_URL` | `SITE.url` | `IS_STAGING` |
|---|---|---|---|
| Today (staging) | unset → fallback `https://miasanabriarealtor.trueidea.com` | staging URL | true |
| Cutover (production) | `https://miasanabriarealtor.com` (or `.com` per §3A/3B) | production URL | false |

At cutover, set the Dokploy app env `NEXT_PUBLIC_SITE_URL` to the chosen production URL and trigger rebuild. The rebuild re-generates sitemap and all canonical URLs.

## 4. Staging noindex → production indexability plan

- Staging today: `robots.txt` = `Disallow: /` + `<meta name="robots" content="noindex, nofollow, nocache">` site-wide. Driven by `IS_STAGING` gate in `src/lib/site.ts`.
- At cutover (`NEXT_PUBLIC_SITE_URL` flipped): `IS_STAGING === false` → robots.txt allows all + meta robots removed.
- Verification: post-rebuild, `curl -s https://<production>/robots.txt` should return `User-agent: *` + `Allow: /` + `Sitemap:` line. `curl -s https://<production>/ | grep robots` should show NO `noindex` meta.

**Anti:** never flip `IS_STAGING` for staging — only via the production env var.

## 5. Sitemap production submission

- After production rebuild, `<production>/sitemap.xml` is regenerated automatically.
- Submit to Search Console (per `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` §3).

## 6. Search Console steps (sequence)

1. Confirm cutover live + DNS resolves consistently (24h+).
2. Add Domain property in Search Console for the chosen production domain.
3. Verify via DNS TXT (Cloudflare or current registrar).
4. Submit `<production>/sitemap.xml`.
5. (Optional) submit `<production>/insights/` and `<production>/markets/` if pages are slow to be discovered.
6. Monitor Coverage report; expect ~80-90% of 40 sitemap routes indexed within 7-14 days.

## 7. GA4 / GTM timing

Per `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` §7 — connect ONLY when (a) Mia accepts copy/site, (b) Legal packet `/privacy/` reviewed for GA4 mention, (c) cutover greenlit. Order: DNS cutover → wait 24h stability → set `NEXT_PUBLIC_GA_ID` in Dokploy → rebuild.

## 8. GBP alignment

Per `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md` §3 step 5 — Mia claims/edits Google Business Profile post-cutover with aligned name + license + service area + phone.

## 9. Branded email / from-domain steps

Decided by `MIA_DECISION_PACKET.md` §4.

| If §4 choice = | Then |
|---|---|
| **4A** (keep Gmail) | No email work. Update `MIA.contact.email` only if a different Gmail address is preferred. |
| **4B** (Google Workspace on `miasanabriarealtor.com`) | (1) Provision Workspace at workspace.google.com; (2) Add MX records to chosen production domain; (3) Add SPF (`v=spf1 include:_spf.google.com ~all`), DKIM (Workspace-generated key), DMARC (`v=DMARC1; p=quarantine; rua=mailto:...`) records; (4) Verify via `dig +short txt`; (5) Update `MIA.contact.email = "mia@miasanabriarealtor.com"` in `src/lib/mia.ts`; (6) Test send + receive. |
| **4C** (Workspace on `miasanabria.com`) | Same as 4B but on the shorter domain. |

## 10. Deployment token rotation reminder

- `~/.claude/.env` likely contains `DOKPLOY_API_TOKEN` and Cloudflare or registrar tokens. Per project CLAUDE.md "When in doubt", these stay in `~/.claude/.env` and are NEVER committed.
- At cutover, no token rotation is strictly required. Recommended: rotate `DOKPLOY_API_TOKEN` post-cutover as standard hygiene; document new value back to `~/.claude/.env`.

## 11. Post-cutover smoke test

```
# 1. Robots/indexability
curl -s https://<production>/robots.txt | grep -E '^User-agent|^Disallow|^Allow|^Sitemap'    # expect Allow: / + Sitemap

# 2. Sitemap
curl -s https://<production>/sitemap.xml | grep -c '<loc>'   # expect 40+ entries

# 3. ETag/cache-bust verification (every route)
for path in / /contact/ /valuation/ /buyers/ /sellers/ /about/ /insights/ /markets/ /markets/fort-lauderdale/ /markets/boca-raton/ ; do
  curl -sk -H 'Cache-Control: no-cache' -o /dev/null -w "%{http_code} %{header_etag}\n" "https://<production>$path?cb=$(openssl rand -hex 4)"
done   # expect 200 each, unique ETag

# 4. PDF downloads
for pdf in waterfront-buyer-due-diligence-checklist luxury-seller-pre-listing-checklist fort-lauderdale-waterfront-valuation-prep-sheet ; do
  curl -sk -o /dev/null -w "%{http_code} %{header_x-robots-tag}\n" "https://<production>/downloads/$pdf.pdf"
done   # expect 200 each; X-Robots-Tag presence depends on Caddyfile rule decision

# 5. Lead surfaces
curl -s "https://<production>/contact/?cb=$(openssl rand -hex 4)" | grep -c 'name="source"'   # expect 1
curl -s "https://<production>/valuation/?cb=$(openssl rand -hex 4)" | grep -c 'name="source"' # expect 1

# 6. Schema
curl -s "https://<production>/?cb=$(openssl rand -hex 4)" | grep -c 'application/ld+json'    # expect 5+

# 7. Trust marks
curl -s "https://<production>/?cb=$(openssl rand -hex 4)" | grep -cE 'LPT Realty|REALTOR|Equal Housing|License #SL3405877'   # expect 4+
```

Run the smoke test from a clean shell. Capture output in `docs/CYCLE_<cutover>_SMOKE.txt`.

## 12. Rollback path

If any smoke step fails OR Search Console reports widespread crawl errors within 24h:

1. Revert DNS records to staging (TTL is 300s if §2 was followed).
2. Confirm staging resumes serving traffic.
3. Triage and fix; re-cut later.

If TTL was not reduced ahead of cutover, rollback latency is 1-24h depending on resolver caches.

## 13. Direct Axess / legacy presence sunset checklist

- [ ] Confirm current `miasanabriarealtor.com` host (Direct Axess) is in a sunset window
- [ ] Coordinate cutover date with Direct Axess (DNS-only retention with 301 to new hosting, OR full shutdown)
- [ ] Capture any existing content/redirects from Direct Axess that should be preserved
- [ ] Confirm any inbound links (GBP, social, business cards) align with new URL post-cutover

## 14. PDF noindex header decision

Per `LEGAL_COMPLIANCE_PACKET.md` §11.1.

If §11.1 = `noindex` (recommended): add Caddyfile header rule via Dokploy:

```caddyfile
@pdfs path *.pdf
header @pdfs X-Robots-Tag "noindex, nofollow"
```

If `index`: no Caddyfile change.

## 15. Caddy / Dokploy cache-bust / ETag verification rule

Per project CLAUDE.md "Cache + verify":

- Every post-cutover live check uses `?cb=<8-byte-hex>` + `Cache-Control: no-cache`.
- ETag flip is the deploy-flip signal.
- The deprecated `?_=<ts>` pattern is forbidden (same-ms collision risk).

```bash
# Reference pattern (already used in scripts/deploy-and-verify.ts)
cb_token() { openssl rand -hex 4; }
curl -sk -H 'Cache-Control: no-cache' -I "https://<production>$path?cb=$(cb_token)"
```

## 16. Go / no-go checklist (cutover day, in order)

- [ ] `MIA_DECISION_PACKET.md` §3 domain decision recorded
- [ ] `MIA_DECISION_PACKET.md` §4 email decision recorded
- [ ] `LEGAL_COMPLIANCE_PACKET.md` §5/§6/§7/§8/§9/§10 counsel signoffs received OR scoped explicit waivers
- [ ] `LEGAL_COMPLIANCE_PACKET.md` §1.1 DBPR verification complete
- [ ] `LEGAL_COMPLIANCE_PACKET.md` §1.2 NAR membership confirmation in writing
- [ ] All `audit:*` scripts green at the cutover commit
- [ ] `bun run build` + `bun run build:pdfs` exit 0
- [ ] DNS TTL pre-reduced to 300s ≥ 48h ago
- [ ] Direct Axess sunset coordination confirmed
- [ ] Rollback path rehearsed (revert DNS records on standby)
- [ ] Smoke-test script (`scripts/deploy-and-verify.ts` or §11 inline) ready in clean shell
- [ ] GHL stays on `GHL_ENABLED=false` until separately greenlit (per `GHL_READY_PACKET.md`)
- [ ] GA4 stays unconnected until cutover stability is confirmed + legal §5 closed (per `GOOGLE_ANALYTICS_SEARCH_READY_PACKET.md`)

When all 13 boxes are ticked → go.

## 17. Anti-checklist

- [ ] No DNS records edited this cycle.
- [ ] No indexing toggles flipped this cycle (staging stays `Disallow: /`).
- [ ] No production canonical URL changed this cycle.
- [ ] No Search Console submission this cycle.
- [ ] No GA4/GTM script added this cycle.
- [ ] No token rotated this cycle.
- [ ] No legacy-host sunset triggered this cycle.

All 7 confirmed at cycle close.
