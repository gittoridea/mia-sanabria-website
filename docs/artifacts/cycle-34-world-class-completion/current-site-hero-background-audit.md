# Cycle 34 — Current miasanabria.com Hero Background Audit

> Phase 4 deliverable. Read-only inspection of the current public miasanabria.com homepage to identify the hero background image and decide if it can be safely reused in this repo.

## Method

```bash
curl -sL -A "Mozilla/5.0 (... cycle-34-audit)" --max-time 15 https://miasanabria.com/ > /tmp/mia-current-home.html
grep '<title>', og:*, <img>, background-image
```

Saved 462 352 bytes. The page is the current public Mia Sanabria homepage.

## Findings

**Page title:** `Mia Sanabria | Luxury Real Estate in Southeast Florida`

**OG image:**
```
https://vibe.filesafe.space/1776455982521426814/assets/0cea4829-8017-482f-9f70-4d00deda65a0.png
```

**Hero image candidates in homepage HTML:**

| Asset | URL host | File ID |
|---|---|---|
| Logo PNG | `vibe.filesafe.space` | `9e310e1b-a41d-4b6c-811d-6ede973f7517.png` |
| Hero JPG (primary candidate) | `vibe.filesafe.space` | `9d286670-d1c1-44cf-9bfd-4e701ca8f0e0.jpg` |
| OG PNG | `vibe.filesafe.space` | `0cea4829-8017-482f-9f70-4d00deda65a0.png` |

**Listing thumbnails** (separate concern, not hero):
```
media.sef.mlsmatrix.com/MediaServer/GetMedia.ashx?Key=...
```
These are SEF MLS Matrix IDX iframe listing photos. They are not hero candidates and **must not be copied** — they are MLS-licensed thumbnails belonging to listing brokerages, served through SEF MLS Matrix.

## Provenance assessment

The hero JPG is hosted at `vibe.filesafe.space/1776455982521426814/...`. This is the file-CDN backing **vibe.codes** (a no-code site-builder platform). The presence of a long numeric prefix and per-file UUID suggests Mia (or whoever built the current miasanabria.com surface) uploaded the asset into vibe.codes, and vibe.codes serves it from its own CDN.

**Critical unknowns:**

1. **Original photographer / source.** The file path on `vibe.filesafe.space` does not encode authorship. The image could be Mia's licensed photography, a free stock image used inside a vibe.codes template, or a third-party photo embedded under unknown terms.
2. **Display license vs redistribution license.** Even if Mia is authorized to use this image inside vibe.codes' SaaS surface, that does not automatically grant rights to copy it into a separate Next.js repo hosted by another vendor (Helos VPS / Dokploy).
3. **Trademark / model release.** Photos that include real people, identifiable private residences, or named businesses may need separate clearances.

## Decision

**Do not reuse the vibe.filesafe.space hero asset in this repo this cycle.** Reasons:

- Provenance unknown (per above).
- Per the brief's image policy, "do not use unlicensed third-party photography" and "every image has provenance".
- Per the brief's hero direction, "use the background image currently showing on https://miasanabria.com/ **if safely identifiable and reusable**" — the conditional fails on provenance.

**Fallback:** keep the existing approved repo asset `public/markets/fort-lauderdale.jpg` as the Home Search hero background for now. This asset is already in the repo, already approved through Cycle 24 R2 and Cycle 25 review, and already used as the homepage hero background. No regression.

**Operator escalation needed:** Torrey or Mia should confirm whether the current vibe.codes hero image is Mia-owned and freely re-licensable. If yes, the asset can be downloaded, optimized to WebP, committed to `public/hero/`, and swapped in. Until that confirmation, the fallback stands.

## Recommended alt text + provenance label for current/future hero

If Torrey/Mia provide a licensed Southeast Florida residential establishing shot for the Home Search hero:

```ts
imageSrc="/hero/home-search-hero.webp"
imageAlt="Southeast Florida coastal residential lifestyle"
imageProvenance="operator-provided"  // type in NeighborhoodProfile.hero
```

If a Gemini-generated illustrative image is approved next cycle:

```ts
imageSrc="/hero/home-search-hero-illustrative.webp"
imageAlt="Editorial illustration of a Southeast Florida coastal residential street"
imageProvenance="ai-generated-illustrative"
```

In neither case should alt text claim the image depicts a specific street, building, or person.

## Tangential observations (not in scope this cycle)

- The current miasanabria.com `og:image` is also from vibe.filesafe.space. The Next.js repo already ships its own `public/og-default.jpg` — no change needed.
- The current miasanabria.com has an IDX iframe to SEF MLS Matrix embedded inline. The Next.js site renders MLS Matrix through `IdxEmbed.tsx` and the dedicated Bridge `/home-search/` page. No copy needed.
- The current public site uses copy framing like "Southeast Florida's most exclusive real estate" in its `og:description`. The Next.js repo's current `SITE.description` is more restrained and compliance-safer ("luxury and waterfront homes ... private representation for buyers, sellers, and absentee owners"). Keep the Next.js version.

---

Generated 2026-05-14 by Cycle 34 Phase 4.
