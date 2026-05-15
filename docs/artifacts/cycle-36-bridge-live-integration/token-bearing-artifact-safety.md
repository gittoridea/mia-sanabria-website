# Token-Bearing Artifact Safety

**Generated:** 2026-05-14T22:02Z
**Discipline:** Verify no token-bearing JS chunk is staged for commit. No raw chunk contents are printed in this report.

## Local downloaded chunks (Cycle 36 staging investigation)

```
docs/artifacts/cycle-36-bridge-live-integration/staging-html/PRE_DEPLOY_home-search_chunk.js
```

This file was downloaded for chunk-needle inspection during Cycle 36 (see `bridge-staging-before-deploy-report.md`). It contains the deployed `NEXT_PUBLIC_BRIDGE_BROWSER_TOKEN` literal — public by Bridge "Option D" design but still inappropriate to embed in committed artifacts.

## Status

```yaml
downloaded_chunk_files_found:
  - docs/artifacts/cycle-36-bridge-live-integration/staging-html/PRE_DEPLOY_home-search_chunk.js
tracked_chunk_files_found: []
gitignore_rule_present: true
gitignore_rule_lines:
  - ".gitignore:62 → docs/artifacts/**/staging-html/*chunk*.js"
  - ".gitignore:63 → docs/artifacts/**/staging-html/*page-*.js"
git_check_ignore_pass: true   # confirmed via `git check-ignore -v`
git_status_short_includes_chunk: false
git_ls_files_includes_chunk: false
raw_chunk_contents_printed_this_session: false
raw_chunk_files_committed: false
action_taken: rule verified; no removal required; chunk stays local-only
```

## Notes for downstream phases

- Phase 4 staging re-probe will write to `docs/artifacts/cycle-36-bridge-live-integration/staging-html/current/` — covered by the same `staging-html/**/*chunk*.js` and `staging-html/**/*page-*.js` patterns when paired with a wildcard ancestor; verified below.
- Phase 11 final staging verification will write to `staging-html/final/` — same pattern coverage.
- Any new chunk-shaped JS file downloaded into `docs/artifacts/**/staging-html/` is captured by the existing rule because the glob `docs/artifacts/**/staging-html/*chunk*.js` matches at any depth and the chunk filenames always contain `chunk`.

## Confirmation check (executed earlier in this phase)

```
$ git check-ignore -v docs/artifacts/cycle-36-bridge-live-integration/staging-html/PRE_DEPLOY_home-search_chunk.js
.gitignore:62:docs/artifacts/**/staging-html/*chunk*.js	docs/artifacts/cycle-36-bridge-live-integration/staging-html/PRE_DEPLOY_home-search_chunk.js
```

## Cycle 36D resume revalidation (2026-05-15)

After the SSH-disconnect recovery, the same checks were re-run:

```
$ grep -nE "staging-html/.*chunk|staging-html/.*page-" .gitignore
62:docs/artifacts/**/staging-html/*chunk*.js
63:docs/artifacts/**/staging-html/*page-*.js

$ git ls-files docs/artifacts/cycle-36-bridge-live-integration/staging-html
docs/artifacts/cycle-36-bridge-live-integration/staging-html/current/_home-search__city_Deerfield_20Beach.html
docs/artifacts/cycle-36-bridge-live-integration/staging-html/current/_home-search__city_Fort_20Lauderdale.html
docs/artifacts/cycle-36-bridge-live-integration/staging-html/current/_home-search__city_Pompano_20Beach.html
docs/artifacts/cycle-36-bridge-live-integration/staging-html/current/_home-search_.html
docs/artifacts/cycle-36-bridge-live-integration/staging-html/PRE_DEPLOY_home-search__city_Deerfield_20Beach.html
docs/artifacts/cycle-36-bridge-live-integration/staging-html/PRE_DEPLOY_home-search__city_Fort_20Lauderdale.html
docs/artifacts/cycle-36-bridge-live-integration/staging-html/PRE_DEPLOY_home-search__city_Pompano_20Beach.html
docs/artifacts/cycle-36-bridge-live-integration/staging-html/PRE_DEPLOY_home-search_.html
# → none of these are *.js; the chunk file is NOT in this listing
```

Re-verified status:

```yaml
cycle_36d_revalidation_time: 2026-05-15 (resume)
chunk_file_still_local_only: true
chunk_file_still_gitignored: true
chunk_file_appears_in_git_ls_files: false
new_chunk_files_downloaded_this_session: pending Phase 11 final staging fetch (will use sanitized HTML grep only, will not redownload chunk JS unless strictly required)
secret_value_printed_or_committed_this_session: false
```

Final disposition for this cycle: chunk JS stays local for forensic reference; will NOT be staged, committed, or pushed. After Phase 9 commit the local chunk file may be deleted to reduce disk footprint, but it is not required for safety because the gitignore rule absorbs it.

