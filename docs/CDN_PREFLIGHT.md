# CDN Preflight — Mia Sanabria Realtor Site
**Author:** Ava Chen (Investigative Analyst) | **Date:** 2026-05-08
**Target site:** miasanabriarealtor.com (cutover from staging at miasanabriarealtor.trueidea.com)
**Stack:** Next.js 15 static export · Tailwind v4 · self-hosted fonts · Helos VPS → Dokploy → Traefik → Caddy
**Baseline:** Lighthouse 91-94 home/about/markets, 72 contact · LCP 2.7s staging vs 2.3s local (0.4s gap = optimization target)
**Audience:** Primary US East Coast, SE Florida luxury realtor

---

## 1. Cloudflare (Free + Pro)

- **Cost @ 50K PV/mo:** **Free** if Free tier suffices; **~$20-25/mo** if Pro added for Polish image optimization. [HIGH] Bandwidth is unmetered on every paid plan and the Free plan has no hard cap for normal use ([Cloudflare plans](https://www.cloudflare.com/plans/)). Optional add-ons: Argo Smart Routing ~$5/mo flat + $0.10/GB after 1GB; Workers Paid $5/mo. [MED]
- **Configuration steps:**
  1. Add `miasanabriarealtor.com` as a Cloudflare zone, set DNS to Cloudflare nameservers.
  2. Enable orange cloud (proxy) on `miasanabriarealtor.com` and `www`. SSL mode = Full (strict) — Caddy already has a valid cert.
  3. In Caddy, add `trusted_proxies cloudflare` so `X-Forwarded-For` stays accurate ([Caddy docs](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)). [HIGH]
  4. Page Rule: `*miasanabriarealtor.com/*` → Cache Level: Cache Everything, Edge Cache TTL: 1 month. (APO is a WordPress-specific product — for a Next.js static export, Cache Everything via Page Rule is the documented equivalent.) [HIGH] ([Cloudflare community](https://community.cloudflare.com/t/apo-versus-cache-everything-page-rule/329146))
  5. (Pro) Enable Polish: Lossy + WebP. Brotli already on by default.
- **Cache strategy:** HTML edge TTL 1 month + purge-on-deploy via API; images `Cache-Control: public, max-age=31536000, immutable`; fonts `max-age=31536000, immutable`. Origin (Caddy) sends the same headers; Cloudflare honors them.
- **Expected LCP impact:** Cache Everything closes most of the 0.4s staging-vs-local gap by serving HTML and the LCP hero image from the nearest Miami/Atlanta PoP instead of Helos VPS. Cloudflare's published APO data shows TTFB -72%, FCP -23%, Speed Index -13% at p90 ([Cloudflare APO post-launch report](https://blog.cloudflare.com/apo-post-launch-report/)). [MED — APO data, not Page Rule, but mechanism is the same edge cache.] Real-world reports of 0.5-1.5s LCP improvement are consistent ([corewebvitals.io](https://www.corewebvitals.io/pagespeed/configure-cloudflare-for-passing-the-core-web-vitals)). [MED]
- **Image optimization:** **Polish** (Pro $20/mo per zone) — lossy mode averages 48% file-size reduction; auto-WebP cuts JPEG ~17%, PNG ~26% ([Cloudflare Polish docs](https://developers.cloudflare.com/images/polish/compression/)). [HIGH] AVIF NOT supported by Polish — for AVIF you'd need Cloudflare Images (separately metered). [HIGH]
- **Failure modes:**
  - Free tier has no SLA; outages on Cloudflare = your site is down even if Helos is up.
  - Polish is per-zone billing; if you put 7 client sites on Pro you pay 7×$20.
  - Cache Everything can serve stale HTML if you forget to purge after deploy — must wire API purge into Dokploy deploy hook.
  - Mirage was deprecated late 2025 ([blazingcdn](https://blog.blazingcdn.com/en-us/cloudflares-pricing-plans-a-comprehensive-guide)). [HIGH]
- **Caddy compatibility:** Excellent. Caddy already does HTTPS + Brotli at origin; Cloudflare adds (a) edge HTML cache, (b) global PoP termination ~10-30ms from FL audience, (c) Polish on top of Caddy's static files, (d) DDoS / WAF. Caddy's Brotli is wasted between Caddy and Cloudflare (Cloudflare re-compresses), but harmless.

## 2. Bunny CDN (Volume Tier + Optimizer)

- **Cost @ 50K PV/mo:** Assume ~5GB/month egress (50K × ~100KB cached HTML+image avg, mostly hot). Volume Tier NA: **$0.005/GB → ~$0.03/mo** bandwidth. With Optimizer: **+$9.50/mo flat per site**. **Total ~$10/mo, $1 minimum applies.** ([bunny.net pricing](https://bunny.net/pricing/), [bunny.net optimizer](https://bunny.net/optimizer/)) [HIGH]
- **Configuration steps:**
  1. Create a Pull Zone in Bunny dashboard pointing at `miasanabriarealtor.trueidea.com` (or whichever origin).
  2. Choose Volume Tier (10 PoPs, cheapest, fine for SE FL audience — Miami/Atlanta/NYC included) or Standard Tier (~$0.01/GB, 119 PoPs) if you want absolute lowest latency.
  3. CNAME `miasanabriarealtor.com` → `<your-zone>.b-cdn.net`. Bunny issues free TLS via Let's Encrypt.
  4. Enable Bunny Optimizer toggle ($9.50/mo) — auto-WebP, CSS/JS minification, dynamic image transforms via URL params.
  5. In Caddy, ensure `Cache-Control` headers are set on responses (Caddy does NOT add aggressive cache headers by default for static files served via `file_server` — must add `header /static/* Cache-Control "public, max-age=31536000, immutable"`).
- **Cache strategy:** Bunny respects origin `Cache-Control`. Set HTML TTL = 1 hour (with manual purge on deploy via Bunny API), images = 1 year immutable, fonts = 1 year immutable.
- **Expected LCP impact:** Bunny's measured global avg latency ~24ms vs Cloudflare ~28ms ([cdnplanet comparison](https://www.cdnplanet.com/compare/cloudflare/bunnycdn/)). [MED] Independent migration reports 15-30% TTFB improvement vs Cloudflare Pro ([Kunal Ganglani](https://www.kunalganglani.com/blog/bunnynet-vs-cloudflare-2026)). [LOW — vendor-comparison content]. Closing the 0.4s gap is realistic given 7×~250KB hero images cached at Miami PoP.
- **Image optimization:** **Bunny Optimizer ($9.50/mo flat, unlimited requests)** — auto-WebP, transform API for resize/crop/blur, CSS/JS minification. WebP only; **NO AVIF** (Bunny has publicly said AVIF was rejected due to encode cost + 3-format cache complexity, [WebP.se 2023 CDN comparison](https://blog.webp.se/2023-cdn-compare-en/)). [HIGH]
- **Failure modes:**
  - Smaller PoP count (~123 vs Cloudflare's 300+) — fine for US-E, weaker for global tail traffic.
  - No DDoS / WAF included; Bunny Shield is a separate product.
  - Volume Tier hits only 10 PoPs — if a Brazilian luxury buyer hits the site, latency spikes.
  - No "free tier" — every byte costs (but $1/mo minimum is trivial).
- **Caddy compatibility:** Pull-origin model is transparent to Caddy. Caddy's Brotli at origin gets used by Bunny on the origin pull (saves your VPS egress); Bunny re-encodes Brotli/gzip at the edge. Recommend disabling Brotli at Caddy when Bunny is in front (saves CPU on Helos).

## 3. KeyCDN

- **Cost @ 50K PV/mo:** ~5GB egress at $0.04/GB NA = **$0.20 bandwidth + $4/mo minimum = $4.20/mo**. Image processing: $0.40 per 1,000 ops; for ~10 hero images served via Image Processing API on demand the cost is rounding error. ([KeyCDN pricing](https://www.keycdn.com/pricing)) [HIGH]
- **Configuration steps:**
  1. Create a Pull Zone in KeyCDN dashboard pointing at staging origin.
  2. CNAME `cdn.miasanabriarealtor.com` → `<zone>-xxx.kxcdn.com`, OR alias the apex via KeyCDN's Zone Alias feature (free TLS via Let's Encrypt).
  3. In Caddy/Next.js config, rewrite asset URLs to `cdn.miasanabriarealtor.com/...` for images and fonts. (Or run KeyCDN as the front-door for the whole site.)
  4. Use KeyCDN Image Processing URL params (`?width=1200&format=webp`) for the 7 hero images.
  5. Set origin `Cache-Control` headers (same as Bunny pattern).
- **Cache strategy:** Same as Bunny — HTML 1h with purge-on-deploy, images/fonts 1y immutable.
- **Expected LCP impact:** KeyCDN has fewer published 2025 benchmarks than the other two; CDNPerf historically shows it competitive with Bunny in NA but ~10-20ms behind Cloudflare on global p95. [LOW — limited public 2025 benchmark data; vendor doesn't publish post-deployment LCP studies.] Closing the 0.4s gap likely but unverified.
- **Image optimization:** Real-time Image Processing API on edge, $0.40 per 1,000 ops ([KeyCDN pricing](https://www.keycdn.com/pricing)) [HIGH]. Supports WebP via `format=webp` param; AVIF support is limited (not first-class). Quality is fine for editorial photography but lacks Polish-style automatic format negotiation.
- **Failure modes:**
  - Smaller market presence and PoP footprint than Cloudflare/Bunny.
  - Image processing is per-operation billing — if a misconfigured cache results in cache misses, costs balloon.
  - $49 minimum prepayment to start ([KeyCDN pricing](https://www.keycdn.com/pricing)) [HIGH] — small friction.
  - Fewer modern features (no auto-AVIF, no advanced rules engine like Cloudflare Workers).
- **Caddy compatibility:** Same pull-origin model as Bunny. Same recommendation: let KeyCDN handle edge compression.

---

## RECOMMENDATION

**Start with Cloudflare Free + Cache Everything Page Rule. Promote to Pro ($20/mo) only if Polish image savings move the LCP needle on the 7 hero shots.** The site is brochureware with editorial photography for a SE FL audience — Cloudflare's Miami/Atlanta PoPs and Cache Everything close the 0.4s LCP gap for **$0**, with no per-zone billing for additional BSS clients later (Free tier doesn't charge per zone). Bunny is the strong #2 if you specifically want lower NA latency or pay-as-you-go transparency, but it costs ~$10/mo and adds image optimization complexity. KeyCDN is third — competent but lacks the free tier, the modern format negotiation, and the published benchmarks the other two have. If you find Polish output isn't editorial-grade for the luxury photography (test required — Polish lossy at 48% reduction can soften skin tones), fall back to Bunny Optimizer at $9.50/mo, which has more transform parameters and a flat unlimited-requests model that scales cleanly.

---

## 5-STEP IMPLEMENTATION CHECKLIST (Cloudflare Path)

1. **Pre-cutover baseline lock** — Capture current Lighthouse + WebPageTest p75 LCP/TTFB from a Miami-region runner against staging. Save to `~/code/mia-sanabria-website/perf-baseline-pre-cdn.json`. (Reproduce-before-fixing rule.)
2. **Cloudflare zone + Page Rule** — Add `miasanabriarealtor.com` to Cloudflare (Free), point nameservers, set SSL Full (strict), create Page Rule `*miasanabriarealtor.com/*` → Cache Everything + Edge Cache TTL 1 month. Verify orange cloud is on and `cf-cache-status` header reads `HIT` after second request.
3. **Caddy origin headers + trusted_proxies** — Edit Caddyfile in Dokploy to add `trusted_proxies cloudflare` and explicit `Cache-Control` headers per file type (HTML 1h with `must-revalidate`; images/fonts 1y immutable). Redeploy via Dokploy app `XJSRlvH-91ZtUsh0RPGvo`. Cache-bust verify per the Caddy-stale-cache feedback rule (`?_=ts` + `Cache-Control: no-cache`).
4. **Deploy-hook cache purge** — Add a Cloudflare API purge call to the Dokploy post-deploy step: `curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE}/purge_cache" -H "Authorization: Bearer $CF_TOKEN" -d '{"purge_everything":true}'`. Without this, stale HTML survives the 1-month edge TTL.
5. **Verify and rate** — Run Lighthouse + WebPageTest again from the same runner, diff against the baseline. Capture screenshots with **Interceptor skill** at the new URL (real Chrome, per the mandatory verification rule). If LCP improvement is < 200ms, evaluate Pro+Polish. If photography quality degrades visually, fall back to Bunny Optimizer.

---

## Sources

- [Cloudflare plans pricing](https://www.cloudflare.com/plans/) — Free/Pro/Business/Ent tiers, per-zone billing
- [Cloudflare APO post-launch report (TTFB -72%, FCP -23%)](https://blog.cloudflare.com/apo-post-launch-report/)
- [Cloudflare Polish compression docs (48% lossy avg)](https://developers.cloudflare.com/images/polish/compression/)
- [Cloudflare Cache Everything vs APO discussion](https://community.cloudflare.com/t/apo-versus-cache-everything-page-rule/329146)
- [Cloudflare Page Rule + APO integration docs](https://developers.cloudflare.com/automatic-platform-optimization/reference/page-rule-integration/)
- [Bunny.net pricing — Volume $0.005/GB NA](https://bunny.net/pricing/)
- [Bunny.net Optimizer — $9.50/mo flat per site](https://bunny.net/optimizer/)
- [Bunny vs Cloudflare CDNPlanet comparison](https://www.cdnplanet.com/compare/cloudflare/bunnycdn/)
- [WebP.se 2023 CDN comparison (Polish vs Bunny Optimizer)](https://blog.webp.se/2023-cdn-compare-en/)
- [KeyCDN pricing](https://www.keycdn.com/pricing)
- [KeyCDN ITQlick pricing analysis](https://www.itqlick.com/keycdn/pricing)
- [Caddy reverse_proxy + trusted_proxies docs](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)
- [Cloudflare Pricing Plans 2026 guide (Mirage deprecation)](https://blog.blazingcdn.com/en-us/cloudflares-pricing-plans-a-comprehensive-guide)
- [Core Web Vitals Cloudflare configuration guide](https://www.corewebvitals.io/pagespeed/configure-cloudflare-for-passing-the-core-web-vitals)
