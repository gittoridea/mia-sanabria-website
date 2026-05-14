# Lane I — DNS / Dokploy / Cutover Readiness Dossier

**Author lens:** DNS / Dokploy / Cutover Engineer
**Scope:** prepare final `miasanabria.com` cutover. No DNS writes. No Dokploy writes. No deploy. No `.env` reads. No production cutover.
**Inputs reviewed:** `scripts/deploy-and-verify.ts`, `Dockerfile`, `Caddyfile`, `DEPLOY.md`, `next.config.ts`, `docs/artifacts/cycle-29-trueidea-staging-publish/deployment-discovery.md`, `docs/artifacts/cycle-30-mia-staging-review/canonical-domain-drift-audit.md`, `docs/CUTOVER_PACKET.md` (post-Cycle-30 banner), project CLAUDE.md "Deploy substrate: Helos VPS via Dokploy (applicationId XJSRlvH-91ZtUsh0RPGvo)."

## Current staging mechanism

| Component | Value | Source |
|---|---|---|
| Deploy substrate | Helos VPS via Dokploy | project CLAUDE.md |
| Dokploy app ID | `XJSRlvH-91ZtUsh0RPGvo` | `scripts/deploy-and-verify.ts:27` |
| Dokploy host | `dokploy.trueidea.com` | `DEPLOY.md` Prerequisites |
| Helos VPS IP | `148.230.82.215` | Cycle 29 deployment-discovery.md |
| Current staging host | `miasanabriarealtor.trueidea.com` | `scripts/deploy-and-verify.ts:28` `STAGING_BASE` + live verification |
| Reverse proxy | Traefik (Dokploy default) routing to container | Cycle 29 deployment-discovery |
| Container | `Dockerfile` (Bun build → Caddy static export) per Cycle 29 §14.6 | `Dockerfile` + `Caddyfile` |
| Git source | `git@github.com:gittoridea/mia-sanabria-website.git#main` (just pushed `3c0381f` in this session) | git remote |
| Static export | `next.config.ts` → `output: 'export'` (assumed, confirmed by Caddy-as-runtime architecture in Cycle 29) | `next.config.ts` |
| TLS | Let's Encrypt R13 valid for `miasanabriarealtor.trueidea.com` per Cycle 21 + Cycle 29 | Cycle 21 ISC-71/75 |

## Final canonical target

**`https://miasanabria.com`** (Cycle 24 Mia-Live-Decisions, 2026-05-13; locked in `src/lib/site.ts:15` `PRODUCTION_URL`).

## Pre-cutover checklist (must be green before G10 fires)

Gates from `launch-doD.md`:

| Gate | Closed? |
|---|---|
| G1 Mia review packet returned + signed off | open |
| G2 Cycle 31 Mia decisions applied | open |
| G3 Counsel-final DMCA designation | open |
| G4 Cato cross-vendor compliance re-audit (no criticals) | open |
| G5 GHL forms wired (Cycle 32) | open |
| G6 GA4/GTM/Consent Mode v2 wired (Cycle 34) | open |
| G7 Mia photos (if any) placed | open |
| G8 Mia testimonials (if any) placed | open |
| G9 Final pre-cutover dry run `audit:all` green | gated on G1–G8 |
| Rollback runbook (R6 + R7 from `launch-doD.md`) formalized | open — pre-cutover cycle task |
| `miasanabria.com` DNS TTL pre-shortened to ≤ 300s | open |

## DNS records to confirm (no changes this cycle; just verification list)

| Record | Current expected | Post-cutover target |
|---|---|---|
| `miasanabria.com` A | likely points at Mia's React SPA host (unknown to repo) | `148.230.82.215` (Helos VPS) |
| `miasanabria.com` AAAA | unknown | optional IPv6 if Helos provides; otherwise unset |
| `www.miasanabria.com` A | likely same as apex or CNAME | `148.230.82.215` OR CNAME → `miasanabria.com` |
| `miasanabria.com` CAA | unknown | `0 issue "letsencrypt.org"` (allow LE to issue) |
| `miasanabria.com` TXT (GSC verification) | n/a | TXT record issued by GSC during property verification (Cycle 34/37) |
| `miasanabria.com` MX | unknown — Mia's email setup | preserve current (not touched by cutover) |
| `miasanabriarealtor.trueidea.com` A | already pointing at `148.230.82.215` | preserve until staging 301 is configured + tested |
| `miasanabriarealtor.com` A | Direct Axess host (Mia's legacy site) | preserve until Direct Axess is unhooked (separate from cutover); then point at canonical for the legacy 301 surface |

**Cycle 30B does not modify any DNS record.** Verification is read-only via `dig +short` against the public DNS resolver.

## Dokploy domain bind requirements (Cycle 36)

Manual UI steps (Torrey performs in Dokploy):

1. Open app `XJSRlvH-91ZtUsh0RPGvo` → **Domains** tab.
2. **Add domain:** `miasanabria.com`. Enable HTTPS (LE). Wait for Traefik to pick up + LE to issue.
3. **Add domain:** `www.miasanabria.com`. Enable HTTPS. (Wait again.)
4. **Keep:** `miasanabriarealtor.trueidea.com` until staging 301 is configured.
5. Verify in Traefik / Dokploy logs that all three certs are valid.

## `NEXT_PUBLIC_SITE_URL` rebuild requirement

`src/lib/site.ts:17`: `export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? STAGING_URL;`

- Default (no env var): falls back to `https://miasanabriarealtor.trueidea.com` (staging).
- For production build: set `NEXT_PUBLIC_SITE_URL=https://miasanabria.com` in Dokploy **Build Args** (NOT runtime env — Next.js bakes `NEXT_PUBLIC_*` at build time).
- Trigger a fresh build after setting the build arg.
- Verify post-deploy: `curl -s https://miasanabria.com/ | grep '<link rel="canonical"'` shows `href="https://miasanabria.com/"` and `IS_STAGING` derives `false` so `<meta name="robots">` flips from `noindex,nofollow` to default (indexable).

## TLS / Let's Encrypt verification

Post-Dokploy-bind:

```bash
# Cert chain
echo | openssl s_client -servername miasanabria.com -connect miasanabria.com:443 2>/dev/null | openssl x509 -noout -dates -issuer -subject

# www subdomain
echo | openssl s_client -servername www.miasanabria.com -connect www.miasanabria.com:443 2>/dev/null | openssl x509 -noout -dates -issuer -subject

# Cipher / TLS version
curl -ksI https://miasanabria.com/ | grep -i strict-transport-security
```

Expected: Let's Encrypt R3/R10/R11/R13 issuer; valid date range; HSTS header present.

## 301 redirect plan from TrueIdea staging after cutover

| Source | Target | Mechanism |
|---|---|---|
| `https://miasanabriarealtor.trueidea.com/*` | `https://miasanabria.com/*` (same path) | Caddy directive in `Caddyfile` OR Traefik middleware (in Dokploy) |

`Caddyfile` excerpt (proposed for Cycle 36):

```caddyfile
miasanabriarealtor.trueidea.com {
    redir https://miasanabria.com{uri} 301
}
```

**Cycle 30B does not modify `Caddyfile`.** Documented for Cycle 36 to apply.

## 301 redirect plan from legacy `miasanabriarealtor.com` (Direct Axess unhook is separate)

Direct Axess unhook is owned by Mia's prior host setup. After unhook:

1. Mia/Torrey/DNS owner repoints `miasanabriarealtor.com` A → `148.230.82.215`.
2. Add domain to Dokploy app (so LE issues for `miasanabriarealtor.com` + `www.miasanabriarealtor.com`).
3. Add Caddy/Traefik 301 from `miasanabriarealtor.com/*` → `https://miasanabria.com/*` matching path.
4. Verify with `curl -I https://miasanabriarealtor.com/about/` → 301 → `https://miasanabria.com/about/`.

## Rollback plan

| Failure mode | Rollback action |
|---|---|
| Live `https://miasanabria.com` returns 5xx | Dokploy → **Rollback** to previous build (one click). Restore service in <60s. |
| Canonical/SITE_URL wrong post-build | Reset `NEXT_PUBLIC_SITE_URL` to staging URL OR unset; trigger redeploy. |
| TLS not issuing | Verify DNS resolves to `148.230.82.215`; check Traefik logs; common cause = CAA record blocking LE; add `CAA 0 issue "letsencrypt.org"`. |
| Bad redirect loop | Revert `Caddyfile` change; redeploy. |
| DNS TTL still high → some users seeing old site | Wait for TTL expiry; old site (if Direct Axess preserved) still serves. |
| Total reversal | DNS owner re-flips `miasanabria.com` A back to prior host (pre-Helos). Helos config preserved for re-cutover later. |

## Pre-cutover dry run (Cycle 36 first action)

Even before flipping DNS:

1. Add `miasanabria.com` + `www.` as Dokploy domains.
2. Locally edit `/etc/hosts` on Torrey's machine to point `miasanabria.com` → `148.230.82.215`.
3. Verify TLS cert issued (Dokploy/Traefik logs).
4. Rebuild with `NEXT_PUBLIC_SITE_URL=https://miasanabria.com`.
5. Browse `https://miasanabria.com` via the `/etc/hosts` override; verify canonical link, sitemap host, OG urls all on `miasanabria.com`.
6. Once verified, flip DNS A record publicly.
7. Watch ETag flip + last-modified update via cache-busted probe per `scripts/deploy-and-verify.ts` pattern.

This dry-run sequence reduces cutover risk because the build + TLS are validated against the canonical host **before** DNS shifts public traffic.

## Future paste-ready cutover prompt

See `future-prompt-bank.md` → "Cycle 36 — DNS/Dokploy Canonical Cutover."

## Cutover remains blocked

Per `launch-doD.md` G1–G9, cutover is blocked until those gates close OR Torrey + Mia record explicit launch exceptions per LE template. Cycle 30B does **not** approve cutover.

## DoD for Cycle 36 (when it fires)

- [ ] G1–G9 closed OR LE exceptions recorded
- [ ] DNS TTL on `miasanabria.com` pre-shortened to ≤ 300s ≥24 h before cutover
- [ ] `miasanabria.com` + `www.` added as Dokploy domains
- [ ] TLS cert issued for both
- [ ] `NEXT_PUBLIC_SITE_URL` build-arg set + redeploy complete
- [ ] Dry-run via `/etc/hosts` override verified before DNS flip
- [ ] DNS A flipped publicly; ETag on live `miasanabria.com/` matches Dokploy build
- [ ] `<link rel="canonical">` on live = `https://miasanabria.com/`
- [ ] `<meta name="robots">` no longer carries `noindex,nofollow`
- [ ] Sitemap URLs all on `miasanabria.com`
- [ ] 301 from `miasanabriarealtor.trueidea.com` → canonical configured + tested
- [ ] Cycle 37 smoke test scheduled
- [ ] Rollback path documented + tested-in-staging
