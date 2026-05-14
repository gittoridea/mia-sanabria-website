# Cycle 34 — Rollback Plan

> Phase 20 deliverable. Reversal steps for every cycle-34 change.

## Cycle 34 commit (when made)

To revert the entire cycle in one go:

```bash
git revert <cycle-34-commit-sha>
# resolve any conflicts
git push origin main
# redeploy staging
bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle="Search Listings"
```

The needle for the pre-cycle hero copy is `Search Listings` (the previous primary CTA label).

## Per-change rollback (granular)

### Revert homepage hero polish only

Edit `src/app/page.tsx`:

```tsx
<Hero
  eyebrow="Mia Sanabria · REALTOR® with LPT Realty"
  heading={
    <>
      South Florida Lifestyle
      <br />
      Home Search
    </>
  }
  sub="Discreet, local guidance for Southeast Florida luxury homeowners, absentee owners, and qualified buyers — from a small, deliberate practice."
  ctaPrimary={{ href: "/markets/#property-search", label: "Search Listings" }}
  ctaSecondary={{ href: "/contact/", label: "Begin a Private Conversation" }}
  background="image"
  imageSrc="/markets/fort-lauderdale.jpg"
  imageAlt="Twilight luxury waterfront residence, Eastern Fort Lauderdale"
/>
```

### Revert Home Search hero polish only

Edit `src/app/home-search/page.tsx`:

```tsx
<Hero
  eyebrow="Search Listings"
  heading="Home Search"
  sub="Browse available Southeast Florida listings across Mia's working market — Fort Lauderdale, Pompano Beach, Coral Springs, Weston, and surrounding communities."
  ctaPrimary={{ href: "/contact/?source=home-search", label: "Talk to Mia" }}
  background="image"
  imageSrc="/markets/fort-lauderdale.jpg"
  imageAlt="Fort Lauderdale waterfront"
/>
```

### Disable / hide the artifacts directory

The 23 new artifact files in `docs/artifacts/cycle-34-world-class-completion/` are documentation only. They have no runtime effect on the built site. If they need to be removed:

```bash
rm -rf docs/artifacts/cycle-34-world-class-completion/
git add -A docs/artifacts/
git commit -m "docs(MIA-SITE-CYCLE-34): roll back cycle-34 artifact directory"
```

But: they document the cycle's audit findings, standards, and decisions. Removing them loses institutional memory. Prefer keeping.

### Restore previous hero image

No hero image was changed this cycle. `/markets/fort-lauderdale.jpg` is the same asset that was the hero in Cycles 24 / 25 / 33. Nothing to restore.

### Disable Playwright Chromium headless-shell binary

Not a repo change — lives in `~/.cache/ms-playwright/`. If removal needed:

```bash
playwright uninstall
# or: rm -rf /home/torrey/.cache/ms-playwright/chromium_headless_shell-1208/
```

No effect on the deployed site or the repo.

## Production rollback

**Not applicable.** This cycle did not perform any production cutover. Production canonical (`miasanabria.com`) was not touched. DNS was not modified. The legacy `miasanabriarealtor.com` Direct Axess host was not modified.

## Bridge / API rollback

**Not applicable.** Bridge tokens were not touched. API-key refresh was not performed. No external system received a write.

## Staging redeploy after rollback

If a rollback commit lands on `origin/main`, the Dokploy webhook may auto-redeploy. If not:

```bash
bun scripts/deploy-and-verify.ts --no-lighthouse --wait-for-needle="<pre-rollback-copy>"
```

Confirm staging serves the rolled-back content before declaring rollback complete.

## Confirmation that no production rollback is needed

- No DNS write.
- No GHL endpoint write.
- No Google API write (Search Console, GA4, GBP).
- No Bridge dashboard write.
- No production canonical change.
- No content change to `miasanabria.com` legacy host.

Staging-only rollback is sufficient.

---

Generated 2026-05-14 by Cycle 34 Phase 20.
