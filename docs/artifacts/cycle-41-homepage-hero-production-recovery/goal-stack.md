---
cycle: 41
artifact: goal-stack
generated_at: 2026-05-17
---

# Cycle 41 — Goal Stack

```yaml
north_star_goal:
  Make the homepage hero feel production-grade, luxury, intentional, and ready for Mia's review.

outcome_goals:
  - homepage hero image becomes the premium visual anchor
  - copy panel no longer dominates the image
  - headline reads like a homepage promise, not a page label
  - floating search feels integrated, not pasted on
  - search stays Bridge-wired
  - mobile/tablet/desktop/large desktop layouts all pass visual review
  - next-section transition has polished rhythm
  - dev site is deployed and verified live

proof_goals:
  - live-before screenshots captured and inspected
  - reference/current screenshots compared
  - local-after screenshots captured and inspected
  - live-after screenshots captured and inspected
  - homepage search-to-Bridge E2E passes locally and live
  - validation gates pass
  - final deployed commit equals origin/main

anti_goals:
  - no dark panel swallowing the image
  - no search card floating awkwardly half-in/half-out
  - no clipped CTAs or mobile overflow
  - no oversized database-looking search form
  - no old IDX fallback
  - no fake live Bridge claim
  - no DOM-only pass without screenshot inspection
  - no docs-only commit after deploy without redeploy alignment
```

## Locked invariants

- H1 text remains `South Florida Lifestyle / Home Search` (Mia decision-record §Homepage hero, lines 86-88).
- Approved neighborhoods unchanged.
- BridgeSearch wiring (form GET → `/home-search/?city=&minPrice=&beds=&source=home-hero`) unchanged.
- Old IDX (sef.mlsmatrix.com) remains absent from runtime.
- No production DNS / GHL / Google / Bridge credential rotation.
- Bridge live-mode claim only if objectively proven; otherwise demo/fallback honesty.

## Tier and budget

- Algorithm tier: E3 (classifier-assigned; multi-file visual recovery sprint).
- Mission budget: best-effort within reasonable single-session bound; long-running captures and deploy run in tmux/background.
