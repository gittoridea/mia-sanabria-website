# Cycle 37 — Remaining Blockers

## Genuinely external (no AI move available)

1. **SEF MLS approval of Mia's IDX feed on the Bridge account.** Required before `BRIDGE_DEMO_MODE=false` can be flipped without lying. Owner: Mia + her broker + SEF MLS.
2. **Bridge dashboard `Referrer Domain` allowlist** must include both staging (`miasanabriarealtor.trueidea.com`) and the eventual production host. Owner: Torrey (Bridge dashboard access).
3. **Operator (Mia) sign-off on AI-generated neighborhood images.** Each of the 7 images is an editorial illustration, not a documentary photo of the city. If Mia wants licensed photography, the AI generations roll back per `rollback-plan.md`.
4. **DNS / production cutover.** Out of scope this cycle — staging stays on `trueidea.com`.
5. **GHL form / webhook endpoint provisioning.** Forms remain `mailto:` per `audit:completeness` WARN; live GHL switchover is an operator decision.

## Bridge-specific external

1. The current Dokploy build args may bake `NEXT_PUBLIC_BRIDGE_*` values, but the dataset itself remains a SEF test fixture until MLS approval. Even after deploy, `bridge_mode_staging_after_deploy` will resolve to `demo` or `fallback`, not `live`.
2. The Bridge browser-token is, by design, a public-facing token. It is safe to ship in the bundle if (a) Referrer Domain restriction is set in the Bridge dashboard, (b) the IDX endpoint is in use. Verifying Referrer Domain in the dashboard is an operator action; this cycle does not touch the dashboard.

## AI-closeable items remaining for next cycle

1. **Live-promotion smoke test once SEF MLS approves.** When Mia confirms approval, flip `NEXT_PUBLIC_BRIDGE_DEMO=false` build arg + deploy + verify `data-bridge-runtime-mode="live"` on the search container in live HTML.
2. **Iconography refinement on AI-generated images.** Some renderings have a subtle "framed canvas" perspective; a follow-up generation pass with a stricter prompt could remove the frame. Low priority — not a blocker.
3. **Optional: programmatic editorial fallback path.** `generate-neighborhood-images.ts` already has `programmaticEditorial()` SVG/Sharp path; document its use as a "no API key" backup in the script header.
4. **Optional: extend `audit:no-old-idx` allowlist** to other future archived doc directories so the audit continues to pass as cycles roll forward.

## Non-AI follow-ups for Mia / Torrey

- **Mia photography handover.** When Mia provides licensed photography for any of the 7 neighborhoods, drop into `public/markets/<slug>.jpg` + `public/og-markets/<slug>.jpg`, update `image-provenance-ledger.md` to record provenance change to `licensed-photography`, redeploy.
- **Mia copy review of the new market detail pages** for the 7 neighborhoods (copy is from Cycle 25, untouched this cycle).
