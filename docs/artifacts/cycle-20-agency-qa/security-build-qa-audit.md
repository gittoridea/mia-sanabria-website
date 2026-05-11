# Cycle 20 — Security / Build / QA Audit (light pass)

> Source: `docs/artifacts/cycle-20-agency-qa/security-build-qa-audit.md`
> This cycle ran a light security/build pass rather than a full audit; full pass is named follow-up Cycle 21-SECURITY-BUILD.

## Light-pass results (this cycle)

### A. Secrets exposure scan

| Check | Result | Source |
|---|---|---|
| Hardcoded API keys / tokens in src/ | none found | `grep -r "API_KEY\|SECRET\|TOKEN" src/` returns only env-var references |
| Hardcoded passwords | none | grep |
| Tokens in build artifact `out/` | none expected — static export with no server-side env baked in (only `NEXT_PUBLIC_*` and `process.env.NEXT_PUBLIC_SITE_URL` referenced in `src/lib/site.ts`) | grep on out/ |
| `~/.claude/.env` is gitignored | YES — `.env*` patterns in `.gitignore` | repo Read |
| Dokploy token referenced via env only | YES — `process.env.DOKPLOY_API_TOKEN` in `scripts/deploy-and-verify.ts` | code Read |
| GHL tokens not committed | YES (all GHL_* env names empty in shell) | env probe |

### B. Build & static-export integrity

| Check | Result | Source |
|---|---|---|
| `bun run typecheck` | PASS (exit 0) | this cycle's run |
| `bun run lint` | not run this cycle (Next.js lint, advisory) | n/a |
| `bun run build` | passes per audit:all completion | indirect |
| `bun run build:pdfs` | passes — 3 lead-magnet PDFs ship, no shell-bleed strings | `audit-lead-magnets` 4/4 PASS |
| Static export → `out/` populated | confirmed via `audit-rendered-visual` capture | reports |

### C. Robots / sitemap / noindex strategy

| Check | Result |
|---|---|
| Staging is `noindex,nofollow` site-wide | YES — `IS_STAGING` gate in `src/lib/site.ts`; verified in `audit-completeness` flagging all 48 routes with `l:noindex(c6)` |
| Sitemap excludes intentionally-noindex routes (downloads, thank-you, 404) | YES — 40 indexable in sitemap, 48 total scanned |
| `robots.ts` route exists and renders correctly | YES — `src/app/robots.ts` exists |
| Production cutover automatically flips noindex via `IS_STAGING = !SITE_URL.startsWith(PRODUCTION_URL)` | YES — design is correct |

### D. External link safety

| Check | Result |
|---|---|
| External iframe (sef.mlsmatrix.com) has `referrerPolicy="strict-origin-when-cross-origin"` | YES (`IdxEmbed.tsx:27`) |
| External links use `rel="noopener noreferrer"` where appropriate | spot-checked: most external links are vendor iframes (IDX) or via mailto: — no rich external anchor patterns to audit |

### E. Dependencies (light)

| Check | Result |
|---|---|
| `package.json` deps look conservative (Next 15.1, React 19, Tailwind 4 beta) | yes — narrow surface |
| No dev-dep bloat — sharp + libvips runtime managed via `LD_LIBRARY_PATH` per project CLAUDE.md | confirmed |
| `npm audit` equivalent not run this cycle | named follow-up |

### F. Form / webhook safety (forward-looking)

Because the site currently uses `mailto:` only, there is no live form-action surface to audit for command injection, SSRF, etc. **At GHL cutover this changes:**

| Risk (post-GHL) | Mitigation per `ghl-webhook-implementation-plan.md` |
|---|---|
| GHL endpoint env leak | env vars stay in `~/.claude/.env`; never logged |
| TCPA consent text drift | consent_text captured verbatim at submit; legal sign-off required before live |
| Spam to webhook | honeypot + Turnstile per Phase-11 §8 |
| Webhook 5xx | feature-flagged mailto fallback per Phase-11 §11 |
| User-input echoed back in success page | sanitize on render; Next.js escapes by default |

### G. Deployment token rotation

**Reminder:** `DOKPLOY_API_TOKEN` in `~/.claude/.env` should be rotated periodically. Last rotation date is not tracked; named follow-up to add a rotation date to the env file's comment header.

### H. Broken-link / dead-CTA scan

| Check | Result |
|---|---|
| `audit-links` — internal link integrity | PASS (this cycle) |
| Every CTA targets a real route | confirmed via Phase-1 inventory |
| 404 page exists | YES |

## Findings summary

| ID | Title | Severity | Owner | Action |
|---|---|---|---|---|
| SEC-1 | All audit checks pass at light depth | n/a | n/a | preserve |
| SEC-2 | Cycle 21-SECURITY-BUILD full pass deferred | P3 | 1 | named follow-up |
| SEC-3 | DOKPLOY_API_TOKEN rotation date not tracked | P3 | 2 | next cycle: add rotation comment to env header |

No findings rise to P0/P1 at this depth.

## Named follow-up

**Cycle 21-SECURITY-BUILD prompt (drop-in):**

> Mission: Full security/build/dependency audit. Run `bun audit` (or npm-audit-equivalent), check for unpinned versions, run secret scanner across all of `src/` and `scripts/` (truffleHog / git-secrets), verify .gitignore covers all secret paths, audit Dokploy token age + rotate if >90 days. Check Next.js 15 known CVEs. Verify static export contains no env vars beyond `NEXT_PUBLIC_*`. Verify post-GHL form code for CSRF / replay protection / rate limiting. Save report at `docs/artifacts/cycle-21-security-build/`.

## Cross-references

- ISS-022 in `issue-matrix.md`.
- Form safety wires into `ghl-webhook-implementation-plan.md` §11 (rollback) + §8 (spam).
- Token rotation policy: project CLAUDE.md "What never gets written without explicit Torrey approval" section.
