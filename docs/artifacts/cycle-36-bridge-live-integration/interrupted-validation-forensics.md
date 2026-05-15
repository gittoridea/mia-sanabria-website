# Interrupted Validation Forensics

**Generated:** 2026-05-14T22:01Z
**Source logs:**
- `docs/artifacts/cycle-36-bridge-live-integration/logs/full-validation-20260514-165608.log`
- `docs/artifacts/cycle-36-bridge-live-integration/logs/audit-all-20260514-171722.log`

## full-validation-20260514-165608.log

```yaml
interrupted_validation_status: completed_fail
evidence:
  - "typecheck step exited non-zero: scripts/audit-hero-pixel-contrast.ts:304:29 TS2345 (Uint8Array<ArrayBufferLike> vs BodyInit)"
  - "build step exited code 1 on the same line"
  - "log file ends with `EXIT_CODE:1` — the wrapper captured the failure before any kill"
exit_code: 1
failure_if_any: typecheck/build TypeScript strict error in scripts/audit-hero-pixel-contrast.ts:304
needs_rerun: true
rerun_reason: gate failure was real; needs to confirm the post-fix build + downstream audits pass cleanly
```

## audit-all-20260514-171722.log

```yaml
interrupted_validation_status: killed_by_disconnect
evidence:
  - "log ends mid-line in the audit:hero-contrast samples=3 invocation: `audit:hero-contrast — primed 23 hero asset(s) into in-memory cache` with no following result row"
  - "no EXIT_CODE marker; log was not produced by the tmux wrapper that appends one"
  - "all gates BEFORE hero-contrast — stale, schema, links, seo, completeness, images, brand, insights, featured-markets, legal, about — PASSED with 0 FAIL"
exit_code: not_recorded
failure_if_any: none observed before disconnect; hero-contrast samples=3 result was not captured
needs_rerun: true
rerun_reason: tail of audit:all (hero-contrast through fort-lauderdale-standard) plus audit:mobile-readability needs a clean, witnessed end-to-end run
```

## Action

Run the full validation in tmux now (Phase 7) under the file
`docs/artifacts/cycle-36-bridge-live-integration/logs/full-validation-<ts>.log`
with `EXIT_CODE:` appended by the wrapper, then continue only if EXIT_CODE:0.
