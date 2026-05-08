# CUTOVER_PACKET — miasanabriarealtor.trueidea.com → miasanabriarealtor.com

**Author:** Jarvis (DA)
**Date:** 2026-05-08
**Audience:** Torrey (operator) + Mia Sanabria (client confirmation gate)
**Source-of-truth template:** `docs/BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md`
**Source-of-truth gate:** `docs/BSS_REALTOR_COMPLIANCE_GATE.md`
**Status:** **PREFLIGHT — DO NOT EXECUTE.** This packet hands the principal a single document to authorize cutover. No step in this packet has been run. No external surface modified.

---

## TL;DR

The staging build at `https://miasanabriarealtor.trueidea.com` is functionally and structurally ready for cutover to `https://miasanabriarealtor.com`. **Three gates remain open** before cutover should proceed:

| Gate | Status | Owner | What unblocks |
|------|--------|-------|---------------|
| **Compliance Gate** (10 axes per BSS template) | Not yet run as a single signoff doc | Operator (Torrey) | Run BSS_REALTOR_COMPLIANCE_GATE.md against current commit `75935e9` and capture PASS/FAIL per axis |
| **Mia confirmations** | 3 fields still UNCLEAR | Mia | Either confirm-or-decline (a) license #, (b) language(s) beyond English, (c) display office address. Plus this session's Migrate-surfaced items: tagline preference, email address, Miami-Dade in service area |
| **RedTeam Realtor positioning** | REVISE verdict surfaced | Torrey | Pick from 3 alternatives or accept current "South Florida Realtor" with REALTOR®-rendering fix |

When all three are green, the operator follows BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md verbatim. The diffs and probes below are the *Mia-specific* values plugged into that template.

---

## 1. Compliance Gate — required pre-cutover

**Doc:** `docs/BSS_REALTOR_COMPLIANCE_GATE.md`
**Action:** Operator runs each of the 10 axes against commit `75935e9` and captures verdict.

The 10 axes covered by the gate (verbatim from the template):

1. Stale-term sweep (Klein Morgan, prior brokerage residue, etc.)
2. Voice-anchor coherence (no "concierge" residue)
3. PUBLIC_FACT_LEDGER §1 / §2 / §7 separation (zero §2/§7 in shipped HTML)
4. JSON-LD validity + schema-dts type compliance
5. Per-page metadata (title ≤60c, description ≤160c, canonical, OG, Twitter card)
6. Accessibility (axe-core / Lighthouse a11y ≥95)
7. Performance (Lighthouse perf ≥90, LCP ≤2.5s, CLS ≤0.1)
8. FREC + NAR compliance (REALTOR® rendering, brokerage disclosure)
9. Analytics consent gating (if GA4 enabled)
10. Anti-criteria (no DNS / GHL / Mia-surface writes from this codebase)

**Pre-state vs this commit:**

- Axes 1, 3, 4, 5: clean against staging build per `bun run audit:{stale,schema,seo,links}` exit-0 results in this session.
- Axis 6: live Lighthouse against staging post-T16-T22 deploy will resolve.
- Axis 7: same — Lighthouse output is the deciding probe.
- **Axis 8: KNOWN GAP.** The RedTeam audit this session flagged 8 occurrences of "Realtor" in body copy / H1 / schema rendered without the required `REALTOR®` (all-caps + ®). Per NAR rules this is the single-largest enforcement category. Either fix sitewide before cutover OR accept the trademark-dilution risk explicitly.
- Axes 2, 9, 10: clean by audit + by the absence of any external write since prior commit.

**Run command (operator):** `bun run audit:all && open docs/BSS_REALTOR_COMPLIANCE_GATE.md` and walk each axis.

---

## 2. robots.txt flip — diff

**Mechanism:** `src/app/robots.ts` reads `IS_STAGING` from `src/lib/site.ts:16`, which is true for any `SITE_URL` not starting with `https://miasanabriarealtor.com`. Production hostname automatically flips robots from "disallow all" to "allow all + sitemap directive."

**Current staging output** (verified):

```
User-agent: *
Disallow: /

# host: https://miasanabriarealtor.trueidea.com
```

**Post-cutover production output** (deterministic from code):

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# sitemap: https://miasanabriarealtor.com/sitemap.xml
# host: https://miasanabriarealtor.com
```

**Verification probe post-cutover:**
```bash
curl -s https://miasanabriarealtor.com/robots.txt | head -20
# Expect: "Allow: /" + "Sitemap: https://miasanabriarealtor.com/sitemap.xml"
```

---

## 3. sitemap host swap — diff

**Mechanism:** `src/app/sitemap.ts` uses `SITE.url` for every entry. The flip happens automatically when `NEXT_PUBLIC_SITE_URL` is set to the production hostname at build time.

**Current sitemap entries** (sample from staging):

```xml
<url><loc>https://miasanabriarealtor.trueidea.com/</loc>...
<url><loc>https://miasanabriarealtor.trueidea.com/about/</loc>...
<url><loc>https://miasanabriarealtor.trueidea.com/markets/lighthouse-point/</loc>...
```

**Post-cutover sitemap entries:**

```xml
<url><loc>https://miasanabriarealtor.com/</loc>...
<url><loc>https://miasanabriarealtor.com/about/</loc>...
<url><loc>https://miasanabriarealtor.com/markets/lighthouse-point/</loc>...
```

**Verification probe post-cutover:**
```bash
curl -s https://miasanabriarealtor.com/sitemap.xml | grep -oE 'https?://[^<]+' | head -10
# Every URL should start with https://miasanabriarealtor.com
```

---

## 4. NEXT_PUBLIC_SITE_URL change

**Where:** Dokploy app build args.
**App ID:** `XJSRlvH-91ZtUsh0RPGvo` (per `scripts/deploy-and-verify.ts:19`).
**Change:**

| Variable | Pre-cutover | Post-cutover |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SITE_URL` | (unset; defaults to `https://miasanabriarealtor.trueidea.com` per `src/lib/site.ts:6`) | `https://miasanabriarealtor.com` |

**Cascade effects** (deterministic from code):

- `SITE.url` flips → every page's canonical, og:url, twitter:url, JSON-LD `@id`, sitemap entries, robots host, manifest start_url all flip to the production host.
- `IS_STAGING` flips false → robots flips from disallow-all to production allow + sitemap directive.
- All schema components reading from `SITE.url` (every component in `src/components/schema/`) update without code changes.

**No code change required for cutover.** This is the entire point of the env-var-driven design.

---

## 5. DNS A-record

**Domain registrar:** confirm where `miasanabriarealtor.com` DNS is currently managed.
**Target IP:** `148.230.82.215` (Helos VPS — the same IP currently serving `miasanabriarealtor.trueidea.com`).

**Records to create / update:**

| Record | Type | Value | TTL |
|--------|------|-------|-----|
| `miasanabriarealtor.com` | A | `148.230.82.215` | 300 |
| `www.miasanabriarealtor.com` | A | `148.230.82.215` | 300 |

**Pre-cutover read of current state:**
```bash
dig +short miasanabriarealtor.com A
dig +short www.miasanabriarealtor.com A
# CAPTURE both — this is the rollback target.
```

**Post-cutover verification:**
```bash
dig +short miasanabriarealtor.com A
# Expect: 148.230.82.215
```

**Propagation expectation:** 1-10 minutes typical at TTL 300. Plan a 30-minute validation window.

---

## 6. Let's Encrypt verification path

**Mechanism:** Traefik on Helos VPS resolves `miasanabriarealtor.com` and `www.miasanabriarealtor.com` once DNS lands, then provisions Let's Encrypt R13 certificates via HTTP-01 challenge. Same path used to provision the staging cert at `miasanabriarealtor.trueidea.com`.

**Required Dokploy actions BEFORE DNS swap:**

1. Add `miasanabriarealtor.com` to the Mia app's Domains list (Dokploy UI → app `XJSRlvH-91ZtUsh0RPGvo` → Domains → Add).
2. Add `www.miasanabriarealtor.com` to the Domains list.
3. Both with Let's Encrypt enabled, port 80 (Traefik handles 80→443 + cert).

**Trigger:** Cert provisioning fires automatically when DNS resolves to `148.230.82.215` and Traefik receives the inbound 80 request. No manual step.

**Verification probe:**
```bash
openssl s_client -connect miasanabriarealtor.com:443 -servername miasanabriarealtor.com </dev/null 2>/dev/null | openssl x509 -noout -issuer -subject
# Expect: issuer=Let's Encrypt R13 (or current LE intermediate); subject CN=miasanabriarealtor.com
```

**Failure mode:** If cert hasn't provisioned within 5 minutes of DNS resolving, check Traefik logs in Dokploy for ACME errors. Most common: rate limit (5 certs per registered domain per week — won't apply here since first issuance) or HTTP-01 challenge blocked (firewall on port 80 — won't apply here, Helos has port 80 open per other apps).

---

## 7. Rollback recipe

**Total reversal time:** ~10 minutes.
**Rollback ladder** (apply in order until issue resolves):

### Tier 1 — Build args revert (fastest, recovers staging-only)

1. Dokploy UI → app → Environment → Build args → unset `NEXT_PUBLIC_SITE_URL` (or set back to staging value).
2. Dokploy UI → Deploy → wait status=`done`.
3. Cache-bust verify: `curl -I "https://miasanabriarealtor.trueidea.com/?_=$(date +%s)" -H "Cache-Control: no-cache"` → expect 200 + Last-Modified flipped.
4. Production hostname will continue to serve briefly with stale build until Tier 2 runs OR until next deploy redeploys with new env.

### Tier 2 — DNS revert (recovers production hostname)

1. DNS provider UI → A record `miasanabriarealtor.com` → revert to whatever value was captured in Step 1.1 of the BSS launch checklist (the rollback baseline doc).
2. Same for `www.miasanabriarealtor.com`.
3. TTL 300 means propagation completes in 1-10 minutes.

### Tier 3 — Domain remove from Dokploy (recovers cert pool)

1. Dokploy UI → app → Domains → remove `miasanabriarealtor.com` and `www.miasanabriarealtor.com` entries.
2. Lets Traefik free the cert slot for re-provisioning later.

### Tier 4 — Build revert to last-known-good commit

1. `cd ~/code/mia-sanabria-website && git log --oneline | head -10` to identify pre-T16-T22 hash (currently `c9637e3`).
2. `git revert 75935e9` (preserves history) OR `git reset --hard c9637e3 && git push --force-with-lease` (rewrites — operator confirmation only).
3. Trigger Dokploy redeploy.

**Rollback verification:** every probe in Section 4 (live verification sweep, BSS template) re-run, with staging URL as the expected respondent.

---

## 8. Pre-cutover Operator Checklist

Operator confirms each of these is **true** before clicking "go" on the BSS launch checklist Step 1:

- [ ] **Compliance Gate** (Section 1 above) — PASS verdict captured per axis.
- [ ] **Mia confirmations** — each of these is either explicitly confirmed in writing or explicitly accepted as null:
  - [ ] License # — confirmed value or null.
  - [ ] Languages beyond English — confirmed list or English-only.
  - [ ] Display office address — confirmed or null.
  - [ ] Email address — `mia@miasanabriarealtor.com` (current repo) or `msanabriarea@gmail.com` (her current .com) — pick one.
  - [ ] Tagline — "Building Relationships for Life" (current repo) or "Elevating the standard of luxury real estate in Southeast Florida" (her current .com).
  - [ ] Service area — keep Miami-Dade (current repo) or drop to Boca/FTL/Palm Beach only (her current .com).
- [ ] **RedTeam REVISE verdict** — operator picked one of:
  - Keep "South Florida Realtor" + fix REALTOR® rendering sitewide (8 occurrences).
  - Switch to "South Florida Luxury REALTOR®".
  - Switch to "Southeast Florida REALTOR® and Adviser".
  - Switch to "South Florida Waterfront REALTOR®".
- [ ] **GHL endpoint URL** — BSS sub-account webhook URL is in hand and tested with one synthetic submission, OR forms left as mailto: placeholder for the cutover and wiring deferred.
- [ ] **CDN decision** — Cloudflare Free + Cache Everything Page Rule (per `docs/CDN_PREFLIGHT.md`) either applied or explicitly deferred. If applied, `dig +short miasanabriarealtor.com` shows Cloudflare nameservers, NOT direct VPS A.
- [ ] **Cato re-audit** — verdict captured (PASS / CONCERNS / FAIL) — see this session's ISA `## Verification` for ISC-T13.
- [ ] **Operator availability** — 90 contiguous minutes blocked for cutover + monitoring.
- [ ] **Last-known-good commit captured:** `c9637e3` (pre-T16-T22) — recovery target.

When every box is checked, proceed to BSS launch checklist Step 1.

---

## 9. Post-cutover smoke-test (first 30 minutes)

After BSS launch checklist Step 4 (live verification sweep) reports green:

1. **Cache-bust full sweep:** `for p in / /about/ /contact/ /buyers/ /sellers/ /valuation/ /insights/ /markets/lighthouse-point/; do curl -s -o /dev/null -w "%{http_code} ${p}\n" "https://miasanabriarealtor.com${p}?_=$(date +%s)"; done` — every line should be `200`.
2. **Headless Chrome screenshots:** `for p in / /about/ /contact/ /markets/lighthouse-point/ /insights/; do google-chrome --headless=new --no-sandbox --window-size=1440,900 --screenshot=/tmp/cutover-${p//\//_}.jpg "https://miasanabriarealtor.com${p}"; done` — visually confirm every page rendered.
3. **Lighthouse production-host:** `bun scripts/deploy-and-verify.ts --no-deploy` (script will need a `--target=production` flag; alternatively manual `bunx lighthouse@12 https://miasanabriarealtor.com` runs).
4. **GSC submission:** add the property in Google Search Console + submit `https://miasanabriarealtor.com/sitemap.xml`. Same in Bing Webmaster Tools.
5. **Inform Mia.** Direct message — site is live at .com.

---

## 10. What this packet does NOT do

This packet is a **preflight document only**. It does NOT:

- Trigger any DNS change.
- Modify any Dokploy build arg.
- Push any code.
- Send any message to Mia.
- Invoke any external API.
- Auto-revert the RedTeam-flagged anchor or auto-fix the REALTOR® rendering issue.

Every action above requires explicit operator authorization at the moment of execution.

---

## 11. References

- Cutover machinery: `docs/BSS_REALTOR_LAUNCH_CUTOVER_CHECKLIST.md`
- Compliance Gate: `docs/BSS_REALTOR_COMPLIANCE_GATE.md`
- Fact ledger schema: `docs/BSS_REALTOR_FACT_LEDGER_SCHEMA.md`
- CDN preflight: `docs/CDN_PREFLIGHT.md`
- Deploy + verify wrapper: `scripts/deploy-and-verify.ts`
- Site config (env-var-driven): `src/lib/site.ts`
- Robots flip: `src/app/robots.ts`
- Sitemap source: `src/app/sitemap.ts`
- Repo ISA (system of record): `ISA.md`
