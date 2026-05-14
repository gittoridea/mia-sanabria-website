# Expert Team Findings — Cycle 35B

date: 2026-05-14
purpose: Capture the cross-lane synthesis from Phase 3's `expert-lane-plan.md` (which set out the recovery agenda) into actionable findings produced through the cycle.

## Lane results

### Lane A — Recovery commit integrity (brand audit Bridge demo-warning exception)

- **3530d5f** present locally and on `origin/main`. Pushed pre-crash.
- Three semantic `data-brand-exception="demo-warning"` markers confined to Bridge demo UI (banner, error warning, listing-card DEMO badge).
- Audit exception keyed to a single regex constant + 8-line proximity window. No broad allowlist.
- `audit:brand` returns 12 PASS · 0 FAIL with "3 allowed by data-brand-exception=demo-warning".
- See `brand-recovery-integrity-check.md`.

### Lane B — Interrupted-deploy forensics

- Prior-session SSH `client_loop: send disconnect: Broken pipe` killed the local `deploy-and-verify.ts` poller, not the Dokploy build.
- Live staging probes confirm a coherent post-disconnect deploy bundle (unified `last-modified` + ETag prefix).
- Classification: `completed_after_disconnect`. No corrective redeploy needed at recovery stage.
- See `interrupted-deploy-forensics.md`.

### Lane C — Neighborhood implementation depth

- All 9 Mia-approved + 2 reference markets carry full `Market` data shape with 5 FAQs, 3-6 internal links, 70-75 source lines.
- Hero treatment: 4 photographic, 7 brand-tone editorial cards (deliberate per Cycle 25 design decision).
- All 8 detail-page sections + 4 schemas render correctly on staging.
- See `neighborhood-implementation-audit.md`, `neighborhood-model-report.md`, `neighborhood-copy-completion-report.md`, `neighborhood-source-ledger.md`.

### Lane D — Image provenance

- Decision: no AI image generation this cycle. Existing inventory is adequate.
- Brand-tone editorial cards for the 7 Cycle 25 Broward cities are deliberate, not lorem-ipsum placeholders.
- Future operator-needed: Mia-supplied licensed photographic heroes (out of AI scope).
- See `image-completion-plan.md`, `image-manifest.md`, `image-generation-log.md`.

### Lane E — Visual QA, validation, secret safety

- 72 staging-recovery PNGs (36 routes × 2 viewports) captured in 51s, 0 failures.
- 72 local-final PNGs captured in 40s from local `out/` static export, 0 failures.
- typecheck/lint/build all green.
- 9 audit-suite runs all exit 0 (2 acceptable WARN items pre-classified by Cycle 30B and 16).
- audit:qa-gate critical=0 (the gate).
- mobile-readability 84/84 on staging AND local.
- Three secret scans all clean (narrow source assignment; generated `out`/`.next`; live staging HTML).
- See `visual-qa-staging-recovery-report.md`, `visual-qa-local-final-report.md`, `final-validation-report.md`, `secret-safety-report.md`.

## Cross-lane synthesis

The site is in a coherent staging-ready state. The brand audit narrow exception is the only source change pushed this cycle (already on `origin/main`). The remaining Cycle 35B work is documentation, evidence capture, and one final tmux-wrapped deploy to confirm the pipeline survives end-to-end.

## Outstanding "external blocker" classifications

Lane work cleanly surfaces the genuinely-external dependencies. None of these are AI-closeable in Cycle 35B:

- DBPR-verified license-number written attestation (Mia).
- Mia's licensed photographic heroes for the 7 Broward cities (Mia).
- Mia retain/redirect/deprecate decision for boca-raton + delray-beach reference markets (Mia).
- Bridge real-feed activation requires API-key refresh/rotation (Torrey + Bridge — explicitly off-limits this session).
- GHL form-endpoint wiring (Torrey + GHL — explicitly off-limits).
- Production cutover from `miasanabriarealtor.trueidea.com` → `miasanabriarealtor.com` (Torrey + DNS).
- USCO + in-process language on `/dmca/` must be resolved before production cutover (counsel/Torrey).

See `remaining-blockers.md` for the full classification.
