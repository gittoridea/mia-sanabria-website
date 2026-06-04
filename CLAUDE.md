# mia-sanabria-website — project-local rules

> Loaded automatically by Claude Code when working inside this repo.
> Keep concise — the global PAI `CLAUDE.md` already handles general doctrine.

## Tech invariants

- **Stack:** Next.js 15 App Router · TypeScript strict + `noUncheckedIndexedAccess: true` · Tailwind v4 · static export.
- **Runtime:** `bun` always. Never `npm` or `npx`.
- **Deploy substrate:** Helos VPS via Dokploy (applicationId `XJSRlvH-91ZtUsh0RPGvo`). Never direct VPS edits. Never edit Caddyfile in prod without Dokploy redeploy.

## Canonical client invariants

When a Mia-confirmed fact changes, edit exactly these locations (in order). Cross-check with the decision record before publishing.

- **Canonical domain** — `src/lib/site.ts` `PRODUCTION_URL`.
- **Top nav structure** — `src/lib/site.ts` `NAV` + `SEARCH_ICON_HREF` (consumed by `src/components/SiteHeader.tsx`).
- **Approved neighborhoods** — `src/lib/mia.ts` `MIA_APPROVED_NEIGHBORHOODS` (consumed by `src/components/NeighborhoodsRail.tsx` + `src/components/HeroSearch.tsx`).
- **Bridge IDX env-var names** — `src/lib/bridge.ts` (scaffold only — no credentials in repo).
- **Source of truth doc** — `docs/mia-client-decision-record.md`.

## Reproduce before fixing

- UI bug reported → open the page with `bun run audit:mobile-readability:capture` or `audit:rendered` and look at the screenshot **before** reading code.
- Stale-copy claim → run `bun run audit:stale` against the latest `out/` first; the audit's regex+string catalog is authoritative.

## Cache + verify

- Caddy on Dokploy serves stale. Every post-deploy live check must add `?cb=<random-hex>` (8-byte hex via `node:crypto.randomBytes`) and `Cache-Control: no-cache`. ETag is the deploy-flip signal. The older `?_=<ts>` pattern is deprecated as of Cycle 20 — hex avoids same-ms collisions across parallel probes.
- After a deploy: confirm the live `etag:` header changed before claiming success.

## Audit gates (must stay green)

- `bun run typecheck` — exits 0.
- `bun run lint` — exits 0.
- `bun run build` — exits 0; produces `out/`.
- `bun run audit:all` — runs the full chain (stale, schema, links, seo, completeness, images, brand, insights, featured-markets, legal, about, hero-contrast, rendered, route-inventory, qa-gate). 0 FAIL is the gate.
- `bun run audit:qa-gate` — full-site matrix. `critical` count == 0 is the gate; `high` count needs the readiness register classification.
- `bun run audit:mobile-readability:capture` — re-captures `docs/artifacts/cycle-19A-M/mobile-readability/after/`. Required on any visual edit.

## Honesty contracts (audited by audit-stale-terms)

- No "luxury concierge", "white-glove", "bespoke", "high-net-worth", "off-market", "since 2017", "within two hours", "as seen in/on" — luxury-as-practice or GATED_MIA risks.
- No "best schools", "good schools", "safe neighborhood", "family-friendly", "bachelor pad", "kid-friendly" — Fair Housing steering risk.
- No `#1 realtor`, `top realtor`, `best realtor`, `guaranteed sale/price` — FREC superlative risk.
- No `..` at sentence boundaries — double-period from concatenation defect class.
- No visible `Updated MONTH YYYY` blog labels — schema `dateModified` stays honest; do not surface a label.

## What never gets written without explicit Torrey approval

- GHL form/webhook endpoints — currently mailto fallback. Do not invent endpoint URLs.
- DNS / Dokploy production config / branded email creation.
- Anything that touches Mia's existing surfaces (`miasanabriarealtor.com` Direct Axess host, social profiles, GBP).
- Token values to chat or logs. `DOKPLOY_API_TOKEN` etc. stay in `~/.claude/.env`.

## sharp + libvips runtime

- Linux runtime requires `LD_LIBRARY_PATH` prefix to find libvips. Package.json scripts using sharp already wrap. New sharp consumers must prefix the same way or fail with `ERR_DLOPEN_FAILED`.

## Port collisions

- `audit:rendered` and `deploy-and-verify` both want port 4173. Use `scripts/lib/port-guard.ts` (`bun port-guard --port=4173 --fallbacks=4174,4175`) before spinning a preview server. Never kill an unknown holder blindly.

## When you touch visual files

- Visual edit = `.tsx` in `src/components/`, `globals.css`, image swap, hero, footer.
- Required on visual edit: capture mobile screenshots at 320/375/414/768 via `audit:mobile-readability:capture` and store under `docs/artifacts/cycle-<id>/mobile-readability/{before,after}/`.

## Navigating / refactoring the code

- Before "where is X / what uses X / what breaks if I change `src/lib/*`", read **`AGENT_NAV.md`** (repo root) — zero-install `rg`/`fd` recipes for symbol-def, usages, route import graph (both directions), and the refactor preflight. Recipe 3b gives the reverse impact set for any content module.

## When in doubt

- Read the project ISA at `~/code/mia-sanabria-website/ISA.md` (single source of truth, 745 ISCs).
- Read prior cycle handoffs under `docs/CYCLE_*_HANDOFF.md` and `docs/NEXT_SESSION_TRIGGER.md`.
- Check `~/.claude/PAI/USER/PROJECTS/MiaSanabria/` for client-context (off-repo).

## Cycle closeout learning rule

At the end of every **major** cycle (wrap, regression repair, deploy, or continuation that changes repo/process state), emit a `## Smarter-AI Closeout` block — 7 bullets, ≤120 words:

- Earlier catch: <name the artifact/log/probe from this cycle that would have caught it>
- Pattern type: one-off | recurring | system defect
- Smallest durable improvement: <concrete edit; name the file/script/section, or write "none">
- Promotion target: audit | CLAUDE.md | checklist | hook | prompt | issue matrix | GHL plan | deploy script | memory | discard | no promotion — one-off or already covered
- Bloat guard: <name the existing file/section already carrying this OR write `discard — see Promotion target`>
- Action taken: none | updated <file/script> | added issue <id> | queued next-cycle trigger
- Owner category: site/content/design defect | tool/process defect | principal decision | GHL/ops dependency | legal/compliance dependency | launch/cutover dependency

Rules:
- Promote at most **one** durable change per cycle. Each lesson must cite a concrete artifact from this cycle's evidence; speculative rules are rejected.
- Prefer audits > existing files > new files. Reject vague closeouts and closeouts naming no concrete file/script/issue.
- `Promotion target: no promotion — one-off or already covered` is a valid first-class output.
