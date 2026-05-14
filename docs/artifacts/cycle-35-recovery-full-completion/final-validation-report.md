# Final Validation Report — Cycle 35B

date: 2026-05-14
purpose: Capture the result of every gate run after the recovery work + audits + visual-QA were complete and immediately before the final commit + staging deploy.

## Gates run

| Gate | Command | Result | Notes |
|---|---|---|---|
| typecheck | `bun run typecheck` | **PASS exit 0** | clean |
| lint | `bun run lint` | **PASS exit 0** | clean |
| build | `bun run build` | **PASS exit 0** | static export produced at `out/`; route table includes 23 `/markets/[slug]` SSG paths + 3 `/downloads/[slug]` SSG paths + 12 `/insights/[slug]` SSG paths + all core static routes |
| audit:brand | `bun run audit:brand` | **PASS** 12 PASS · 0 WARN · 0 FAIL | Bridge demo-warning narrow exception preserved (3 allowed) |
| audit:route-inventory | `bun run audit:route-inventory` | **PASS exit 0** | |
| audit:no-fabrications | `bun run audit:no-fabrications` | **PASS exit 0** | |
| audit:legal | `bun run audit:legal` | **PASS** 18 PASS · 1 WARN · 0 FAIL | 1 staging-acceptable WARN: `legal.dmca.uscoFlag` (USCO in-process language; BLOCKED only for production cutover per CYCLE_16 audit) |
| audit:about | `bun run audit:about` | **PASS** 12 PASS · 0 WARN · 0 FAIL | |
| audit:stale | `bun run audit:stale` | **PASS exit 0** | |
| audit:qa-gate | `bun run audit:qa-gate` | **PASS** critical=0 · high=4 · medium=1 · low=56 | critical=0 is the gate; 4 high are pre-existing readiness-register classification items (already classified in Cycle 30B `master-claim-vs-reality.md`); 1 medium same |
| audit:images | `bun run audit:images` | **PASS** 14 PASS · 0 WARN · 0 FAIL | all 23 market card+page+OG images resolve; 397 `<img>` tags audited |
| audit:completeness | `bun run audit:completeness` | **PASS** 16 PASS · 1 WARN · 0 FAIL | 1 expected WARN: `completeness.forms.classification` — 2 mailto / 1 search / 0 GHL-live (matches `CLAUDE.md` invariant; GHL endpoint wiring is operator-needed) |
| audit:mobile-readability (local) | `bun run audit:mobile-readability` | **PASS** 84 PASS · 0 FAIL · 0 ERROR | |
| audit:mobile-readability (staging) | `bun run audit:mobile-readability --base=https://miasanabriarealtor.trueidea.com` | **PASS** 84 PASS · 0 FAIL · 0 ERROR | |

## Critical-gate posture

```
critical: 0
high: 4 (pre-existing readiness-register classification; not new this cycle)
medium: 1
low: 56
```

## Sequenced log

Full validation output captured at:
- `docs/artifacts/cycle-35-recovery-full-completion/logs/validation-20260514-131233.log` (Cycle 35B typecheck + lint + build)
- `docs/artifacts/cycle-35-recovery-full-completion/logs/audits-20260514-131318.log` (Cycle 35B 9 audits + summaries)
- `docs/artifacts/cycle-35-recovery-full-completion/logs/phase5-validation-20260514-155208.log` (**Cycle 35C re-run**: typecheck + lint + build + audit:brand + audit:route-inventory + audit:no-fabrications + audit:qa-gate + secret scans + env presence)

Pointer files:
- `docs/artifacts/cycle-35-recovery-full-completion/logs/latest-validation-log.txt` → Phase 5 Cycle 35C log
- `docs/artifacts/cycle-35-recovery-full-completion/logs/latest-audits-log.txt` → Cycle 35B audits log

## Cycle 35C re-run delta

Cycle 35C re-ran the gates that gate the Phase N commit + final deploy. All five matched the prior-session result:

| Gate | Cycle 35C result | Prior-session result |
|---|---|---|
| typecheck | exit 0 | exit 0 |
| lint | 0 warnings/errors | exit 0 |
| build | exit 0 (61/61 static pages) | exit 0 (61/61 static pages) |
| audit:brand | 12 PASS · 0 FAIL · 3 allowed | 12 PASS · 0 FAIL · 3 allowed |
| audit:route-inventory | 48 sitemap routes reconcile · pass=true | 48 sitemap routes reconcile · pass=true |
| audit:no-fabrications | 0 hits | 0 hits |
| audit:qa-gate | critical=0 · high=4 · medium=1 · low=56 | critical=0 · high=4 · medium=1 · low=56 |
| narrow source secret-assignment scan | clean (only public Bridge URL constants matched) | clean |
| generated bundle secret-like scan (`out/` + `.next/`) | clean | clean |

## Verdict

All required gates pass at staging level. 2 known WARN items are explicitly classified as acceptable for staging by prior-cycle artifacts:

- **`legal.dmca.uscoFlag`** — production cutover gate, not a staging gate.
- **`completeness.forms.classification`** — GHL endpoint wiring is operator-needed; mailto fallback is the documented staging behavior.

Cycle 35B is cleared for final commit and final staging deploy.
