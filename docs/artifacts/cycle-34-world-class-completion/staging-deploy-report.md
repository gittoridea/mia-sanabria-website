# Cycle 34 — Staging Deploy Report

> Phase 17 deliverable.

## Status

**Push landed. Staging deploy NOT performed by this cycle.** Blocked on a pre-existing `audit:brand` failure unrelated to Cycle 34 changes.

## Commit + push

- Commit SHA: `a88cdfb5194aaa60f1dc4a1ec2c16016816efd18`
- Title: `feat(MIA-SITE-CYCLE-34): world-class site completion — hero polish + audit foundation`
- Pushed: `origin/main` advanced from `3abbe05` → `a88cdfb` ✓
- Working tree: clean

## Deploy attempt

```bash
bun scripts/deploy-and-verify.ts --no-lighthouse \
  --wait-for-needle="South Florida Lifestyle" \
  --wait-timeout=600 --wait-interval=15
```

**Result:** `✗ DEPLOY-ABORT (audit:all): exit 1`

## Root cause

`audit:brand` (`brand.noForbiddenColors`) fails with **3 off-brand color uses**:

| File | Line | Token | Introduced |
|---|---|---|---|
| `src/components/bridge/BridgeSearch.tsx` | 51 | `text-amber-700` | Cycle 33 (`36a9e7a`, Torrey 2026-05-14 08:18) |
| `src/components/bridge/BridgeSearch.tsx` | 120 | `border-amber-400` (also `bg-amber-50`, `text-amber-900`) | Cycle 33B (`985f704`, Torrey 2026-05-14 08:39) |
| `src/components/bridge/BridgeListingCard.tsx` | 48 | `bg-amber-500/90` | Cycle 33B (`985f704`) |

All three are **pre-existing** at HEAD `3abbe05` (Cycle 33B), the commit Cycle 34 was built on. `git blame` confirms none were introduced by Cycle 34.

## Why this failure is intentional / not in Cycle 34 scope to fix

The amber tokens are the **Bridge demo-mode visual distinction** — they intentionally use an off-brand warning color so users can visually distinguish demo data from real listings. Re-coloring them to brass / navy would weaken the demo-honesty signal the brief explicitly required to preserve:

> "Do not hide Bridge demo mode if demo data appears."
> "Bridge demo honesty preserved: true"

The `audit:brand` script (last touched Cycle 8, `8cc0cc2`) predates the Bridge IDX implementation and has not been taught about the demo-banner color whitelist. This is a known mismatch.

## Decision

Per the brief Phase 17 — "If any gate fails, do not deploy. Document blockers and stop at validation." — **deploy is not executed by this cycle.**

The hero polish + audit foundation work is committed and pushed to `origin/main` (`a88cdfb`). Staging will reflect the new content on the next operator-triggered deploy.

## Operator paths forward (next cycle, not this one)

1. **Quickest:** override the preflight check on a one-off deploy:
   ```bash
   bun scripts/deploy-and-verify.ts --no-preflight --no-lighthouse \
     --wait-for-needle="South Florida Lifestyle"
   ```
   Justified because `audit:brand` is the only failing gate, the failure is pre-existing, and Cycle 34's typecheck/lint/build/route-inventory/no-fabrications/stale/legal/about/qa-gate/images/completeness were all independently verified green before push.
2. **Cleanest:** extend `audit:brand`'s `brand.noForbiddenColors` to whitelist Bridge demo-banner uses (`src/components/bridge/Bridge*.tsx` lines that render demo-state UI), then run normal deploy.
3. **Visually compromised:** replace the amber tokens with a brass / warm token from the brand palette. Rejected — would weaken the demo-mode signal.

## Gates verified independently before push

| Gate | Result |
|---|---|
| `bun run typecheck` | ✓ |
| `bun run lint` | ✓ |
| `bun run build` | ✓ (static export `out/` produced) |
| `bun run audit:route-inventory` | ✓ 48 sitemap routes reconcile |
| `bun run audit:no-fabrications` | ✓ 0 hits |
| `bun run audit:stale` | ✓ clean across `out/` |
| `bun run audit:legal` | ✓ 18 PASS · 1 staging-acceptable WARN · 0 FAIL |
| `bun run audit:about` | ✓ 12 PASS · 0 WARN · 0 FAIL |
| `bun run audit:qa-gate` | ✓ critical 0 · high 4 fs-only · medium 1 · low 56 |
| `bun run audit:images` | ✓ 14 PASS · 0 WARN · 0 FAIL (from deploy script's preflight chain) |
| `bun run audit:completeness` | ✓ 16 PASS · 1 WARN · 0 FAIL · 0 SKIP (from deploy script's preflight chain) |
| Compliance pattern sweep | ✓ 2 guard-comment hits, 0 violations |
| Visual QA (Playwright) | ✓ 20 / 20 captures |
| Secret scan against `out/` | ✓ 0 hits |
| `bun run audit:brand` | ✗ **3 pre-existing Bridge demo-banner amber tokens** (not Cycle 34 regression) |

## No production change

- No DNS write.
- No production canonical change.
- No GHL endpoint write.
- No Google API write.
- No Bridge dashboard write.
- No Bridge token rotation.

## No security exposure

- No secret values printed, committed, or exposed.
- No `.env` read.
- `out/` HTML scan returned 0 hits for `BRIDGE_SERVER_TOKEN | BRIDGE_CLIENT_SECRET | GOOGLE_API_KEY | GEMINI_API_KEY | OPENAI_API_KEY | access_token= | Bearer …`.

---

Generated 2026-05-14 by Cycle 34 Phase 17.
