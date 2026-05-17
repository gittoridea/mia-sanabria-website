# Cycle 40B — Homepage Hero Provenance

```yaml
asset_paths:
  hero_card: /hero/mia-home-hero-cycle40b.jpg
  hero_og:   /hero/mia-home-hero-cycle40b-og.jpg

source:
  fetched_from: vibe.filesafe.space (Mia Sanabria's own CDN bucket)
  source_asset_id: 12f02f56-afc4-4d6d-92e3-5ebb5b76140f.png
  source_kind: PNG, ~2MB, ~1408x768 daytime composition
  reference_copy: docs/artifacts/cycle-40-world-class-visual-recovery/reference-home/actual-miasanabria-hero-source.png

description: |
  Daytime modernist white luxury waterfront mansion on a calm South
  Florida Intracoastal Waterway. Multi-story glass-and-white architecture
  with floor-to-ceiling windows, infinity pool on the dock-level terrace,
  yacht docked at the boat slip on the left, manicured tropical gardens,
  lush mature palms framing both sides of the composition, bright daytime
  blue sky with light cloud cover. The composition reads as warm,
  confident, and refined — the literal visual mood the operator wanted to
  reinstate after Cycle 39 shipped a twilight composition.

authorization:
  authorized_by: operator (Torrey, on Mia's behalf)
  authorization_date: 2026-05-16
  authorization_context: |
    The PNG is published by miasanabria.com itself (Mia's site uses it as
    the visible CSS background-image hero). Reusing it locally on the
    Cycle 40B staging site is operator-authorized — same client, same
    asset, server-side performance optimization (3.7x smaller as JPEG,
    served from same origin = better Cache-Control + smaller LCP).

processing_pipeline:
  step_1: |
    Source PNG fetched from vibe.filesafe.space asset URL during Cycle 40
    partial work (preserved at
    docs/artifacts/cycle-40-world-class-visual-recovery/reference-home/
    actual-miasanabria-hero-source.png).
  step_2: |
    Optimized to JPEG via `sharp` in Cycle 40:
      hero (large display): 1920x1080 cover, quality 85 → ~308 KB
      og (social): 1200x630 cover, quality 85 → ~147 KB
    Saved to `public/hero/mia-home-hero-cycle40.jpg` and
    `public/hero/mia-home-hero-cycle40-og.jpg`.
  step_3: |
    Cycle 40B re-exported via `cp` to the `-cycle40b` suffix to align
    with Cycle 40B versioning convention (cache-bust + auditability).
    Cycle 40 originals preserved on disk as evidence.

cache_bust_versioning: |
  The `-cycle40b` suffix in the path ensures any browser/CDN cache holding
  the prior `-cycle39` twilight composition cannot serve stale pixels.
  Caddy on Dokploy caches with s-maxage=600 must-revalidate; the new
  filename forces a fresh edge fetch. Post-deploy verification waits for
  the live ETag to advance.

is_ai_generated: false
license_intent: client-asset-reuse-with-operator-authorization
```

## Why not the twilight composition?

Cycle 39 selected a twilight intracoastal composition (191KB JPG at
`/hero/mia-home-hero-cycle39.jpg`). The operator reported it as "off-brand"
in subsequent feedback. Direct inspection of the actual `miasanabria.com`
public hero showed a *daytime* composition (the asset above), and the
Cycle 40 commander identified the mood mismatch as the most likely
explanation for the operator's "hero looks wrong" complaint.

Cycle 40B's swap to the daytime hero closes that defect class. The
twilight asset is preserved on disk as `mia-home-hero-cycle39.jpg` for
evidence-trail and rollback purposes only — it is no longer wired in any
active route.

## Why not AI-generate a new hero?

The hero is the literal front door of the practice. Using the asset that
Mia's own current site uses produces the same brand mood, same focal
point, same client-recognized visual identity — the deliberate choice is
*continuity with what Mia has already shipped*, not a competing
AI-generated alternative. The neighborhood market images are illustrative
stand-ins (because Mia hasn't yet provided real per-neighborhood
photography), but the hero has a clear authorized source asset to reuse.
