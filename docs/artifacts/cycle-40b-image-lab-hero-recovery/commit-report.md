# Cycle 40B — Commit Report

```yaml
commit_hash: 8095c786988924b2069d86b9602f672df27158d7
pushed_to: origin/main
push_time: 2026-05-17T01:03Z
prior_head: 21533b9367862503915a44e185b1949a097f9007

commit_message_subject: "feat(MIA-SITE-CYCLE-40B): image-lab + hero recovery + daytime waterfront swap"

staged_files_total: 125 (after restore of build.pid + local-preview log)
patch_size: 6.2MB on disk (excluding gitignored raw PNGs + screenshots)

files_added: 100+ (cycle-40b artifacts dir + new scripts + new public images)
files_modified: 9 (src/* + scripts/audit-neighborhood-images-deep.ts + package.json + globals.css + reports/* auto-emitted)

precommit_secret_scan: clean (no realistic-length token values in staged patch)
precommit_chunk_scan: clean (no docs/artifacts/**/staging-html/*chunk*.js or page-*.js staged)
precommit_pid_scan: clean (build.pid restored from staging)

src_changes:
  - src/app/globals.css: +overflow-x:clip on html + body (safety net)
  - src/app/page.tsx: hero asset swap cycle39→cycle40b daytime + w-full max-w-full overflow-x-clip wrapper
  - src/components/Hero.tsx: section w-full max-w-full, flex parent w-full, panel box-border + [contain:inline-size] + max-w-full + version=cycle40b, CTAs lose whitespace-nowrap and gain min-w-0 + max-w-full + text-balance
  - src/components/HeroSearch.tsx: floating outer w-full max-w-full, inner w-full min-w-0, formCard box-border + [contain:inline-size] + max-w-full + overflow-hidden, selects box-border + min-w-0 + max-w-full + w-full + min-h-[44px]
  - src/lib/mia.ts: MIA_CYCLE_40B_VERSIONED_SLUGS set + CYCLE_40B_VERSION_SUFFIX + imageSuffixForSlug resolves cycle40b before cycle39 fallback

script_changes:
  - scripts/generate-neighborhood-images-v3.ts: new (3-candidate workflow + contact sheet stitching + manifest)
  - scripts/export-cycle40b-winner.ts: new (winner-export via sharp pipeline)
  - scripts/audit-image-creative-acceptance.ts: new (creative-acceptance gate)
  - scripts/audit-neighborhood-images-deep.ts: enforce -cycle40b on the seven Mia slugs (cycle39 fallback retained)
  - package.json: 3 new bun-run scripts

public_assets_added:
  - public/hero/mia-home-hero-cycle40.jpg (Cycle 40 partial-work preserved on disk)
  - public/hero/mia-home-hero-cycle40-og.jpg (same)
  - public/hero/mia-home-hero-cycle40b.jpg (active hero)
  - public/hero/mia-home-hero-cycle40b-og.jpg (active OG)
  - public/markets/{7-slugs}-cycle40b.jpg (active hero/card images)
  - public/og-markets/{7-slugs}-cycle40b.jpg (active OG images)

artifacts_committed:
  - docs/artifacts/cycle-40b-image-lab-hero-recovery/ (22 .md docs + image-generation-results.json + image-manifest.md + 21 cand-N-meta.json + 7 prompt.txt + 7 contact-sheet.jpg + logs/)
  - docs/artifacts/cycle-40-world-class-visual-recovery/ (preserved Cycle 40 partial work — 4 .md + 20 live-before screenshots gitignored + 1 reference PNG gitignored + cycle-40-failure-analysis preserved as evidence)
  - docs/artifacts/cycle-39-visual-truth-recovery/ (auto-emitted e2e/* + leftover logs)
  - docs/artifacts/cycle-35-recovery-full-completion/ (leftover logs from prior cycle)

artifacts_intentionally_gitignored:
  - 21 raw candidate PNGs in image-candidates/*/cand-N.png (~41MB) — gitignored via docs/artifacts/**/*.png
  - 60 local-after screenshot PNGs in local-after/screenshots/ — gitignored via screenshots/ pattern
  - reference-home/actual-miasanabria-hero-source.png — same screenshots pattern
  - Contact sheets (JPG) and metadata (JSON) ARE committed for full audit trail
  - image-generation-results.json manifest IS committed
```

## Push acknowledgment

```
$ git push origin main
To github.com:gittoridea/mia-sanabria-website.git
   21533b9..8095c78  main -> main
```

`git rev-parse HEAD` == `git rev-parse origin/main` == `8095c786988924b2069d86b9602f672df27158d7`

## What this commit DOES NOT change

- DNS / production config / domain swap
- GHL form/webhook endpoints (mailto fallback preserved)
- Bridge credentials (none rotated; not present on this host; demo mode honest)
- Mia's existing live surfaces (miasanabria.com Direct Axess, GBP, social profiles)
- Cycle 39 image paths on disk (kept as fallback evidence; runtime helper resolves cycle40b first)
- Twilight hero asset on disk (kept as fallback evidence; runtime references cycle40b daytime)
- The 12 non-cycle40b market images (Fort Lauderdale, Coral Ridge, etc. — unchanged)
- Any other route's hero asset besides the homepage hero
