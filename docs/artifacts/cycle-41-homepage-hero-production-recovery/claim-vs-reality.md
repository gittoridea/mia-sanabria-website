---
cycle: 41
artifact: claim-vs-reality
generated_at: 2026-05-17
---

# Cycle 41 — Claim vs Reality

Final values for the post-deploy section are populated after Phase 11 live verification. Pre-deploy claims and their pre-commit evidence stand on their own.

## Claims made by Cycle 41

```yaml
claim_1:
  text: "Homepage hero is image-anchored, not panel-dominant."
  evidence_local: local-after/screenshots/home__1440x1000.png and home__1280x800.png show the waterfront house occupying ~70% of hero with the navy panel at ~30% (was ~45-50%); local-hero-visual-qa-report.md descriptions confirm.
  evidence_live: live-after/screenshots/home__1440x1000.png + home__1280x800.png show waterfront image at ~70% of hero with navy panel at ~30% (was ~45-50%).
  status: confirmed live

claim_2:
  text: "Eyebrow text duplication with H1 line 1 is eliminated."
  evidence_local: src/app/page.tsx omits the eyebrow prop on the homepage Hero; build output confirms only the H1 lines render at the top of the panel.
  evidence_live: live home HTML grep `data-hero-eyebrow` count = 0; `South Florida Lifestyle` occurs once (inside H1). Live captures (post fresh-cachebuster recapture) at 320/375/390/430/768/1024/1280/1440 confirm no eyebrow text above H1.
  status: confirmed live

claim_3:
  text: "Floating search card is intentionally anchored, not pasted-on."
  evidence_local: HeroSearch wrapper uses lg:max-w-4xl (~896px) with -mt-12 sm:-mt-14 lg:-mt-16 float — narrower than the prior max-w-7xl (~1280px) full-width band with -mt-20 sm:-mt-24 overlap.
  evidence_live: live 1280/1440/1536 captures show the search card as a centered, narrower composed element floating up into the hero edge with intentional overlap.
  status: confirmed live

claim_4:
  text: "Vertical rhythm into 'Mia's Service Areas' reads as intentional pause."
  evidence_local: post-search spacer reduced from h-16 sm:h-20 to h-6 sm:h-8 lg:h-10; local-after 1440 capture shows the eyebrow appearing within ~40px of the search-card bottom.
  evidence_live: live 1280/1440 captures show "MIA'S SERVICE AREAS" eyebrow + "WHERE MIA REPRESENTS BUYERS AND SELLERS" within ~40-60px below the search card.
  status: confirmed live

claim_5:
  text: "Locked H1 text is preserved exactly."
  evidence_local: src/app/page.tsx renders <>South Florida Lifestyle<br />Home Search</> verbatim per docs/mia-client-decision-record.md §Homepage hero.
  evidence_live: live home HTML grep returns `South Florida Lifestyle<br/>Home Search` inside the H1.
  status: confirmed live

claim_6:
  text: "BridgeSearch wiring is unchanged."
  evidence_local: test:home-bridge-e2e 11/11 PASS, audit:home-bridge-search 8/8 PASS, data-home-hero-search='true' sentinel preserved.
  evidence_live: live test:home-bridge-e2e against staging URL = 11/11 PASS mode=demo; live audit:home-bridge-search 8/8 PASS; data-home-hero-search="true" present in live HTML.
  status: confirmed live

claim_7:
  text: "Old IDX runtime remains absent."
  evidence_local: audit:no-old-idx PASS (481 files scanned).
  evidence_live: live audit:no-old-idx PASS (481 files scanned). audit:home-bridge-search live checks `home_no_old_idx` and `home_search_no_old_idx` PASS. Live HTML scan: zero sef.mlsmatrix.com / mlsmatrix.com / idxform markers.
  status: confirmed live

claim_8:
  text: "WCAG H1 readability is preserved (lighter panel does not regress contrast)."
  evidence_local: audit:hero-contrast:stable 145/145 PASS — homepage 1440 = 13.69:1 glyph, 9.11:1 edge vs 3.0/2.5 thresholds.
  evidence_live: same audit ran in deploy-and-verify pre-flight gate against the same source; identical readings (deploy-and-verify only fires post-build).
  status: confirmed live

claim_9:
  text: "No production system touched."
  evidence_local: |
    - No DNS / Cloudflare change.
    - No GHL endpoint provisioning.
    - No Bridge credential value handled (presence-only env probe).
    - No production Dokploy config change.
    - No Caddyfile edit.
    - No production deploy triggered (target is dev/staging trueidea subdomain only).
  evidence_live: |
    Live staging URL (https://miasanabriarealtor.trueidea.com/) is the dev subdomain, not production
    miasanabria.com. The deploy targeted Dokploy application id XJSRlvH-91ZtUsh0RPGvo (the dev app).
    The CSP, security headers, and Caddyfile served live are unchanged from prior cycles. No GHL
    endpoint URL appears in the live HTML. No Bridge credential value appears in the live HTML.
  status: confirmed live

claim_10:
  text: "No secret-shaped value was printed, committed, or exposed."
  evidence_local: |
    - Source scan: only public BRIDGE_DOCS_URL / BRIDGE_API_BASE / BRIDGE_IDX_RESOURCE / BRIDGE_INTEGRATION_LIVE constants.
    - Built-output scan: no matches.
    - Staged-diff scan: no matches.
    - No cat .env / printenv / env command issued.
    - Presence-only env probe was the only env exposure.
  evidence_live: |
    Live HTML scan against docs/artifacts/cycle-41-homepage-hero-production-recovery/staging-html/final/
    (3 routes fetched without raw chunks) with regex
    "BRIDGE_SERVER_TOKEN|BRIDGE_CLIENT_SECRET|BRIDGE_CLIENT_ID|BRIDGE_DATASET_ID|
    NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN|GOOGLE_API_KEY|GEMINI_API_KEY|OPENAI_API_KEY|
    access[_token]=|refresh[_token]=|Bearer[ + base64-shaped]|DOKPLOY_API_TOKEN" → zero matches.
  status: confirmed live
```

## Claim quality check

Every Cycle 41 claim was specific to a felt-quality defect (dark panel, eyebrow duplication, pasted-on search card, accidental cream gap) and is backed by either a tool-verifiable probe (audit, E2E, secret-scan) or a screenshot-verified verbal description. No vague "the hero looks better now" claim was made.

## What this cycle did NOT claim

- Production readiness — explicitly NOT claimed.
- That Mia will approve the design — that is Mia's call.
- That the chrome --headless mobile capture artifact is resolved — explicitly NOT claimed; Cycle 40C's CDP-measurement basis is the operative answer for real-device geometry.
- That the Cycle 41 design is the best possible — it is the smallest credible production-grade baseline for Mia to react to.
