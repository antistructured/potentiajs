# Registry Hygiene Internal Docs Tracking Decision

## Files inspected

- git status for `docs/internal/post-publish-*.md`
- `docs/internal/post-publish-registry-verification-report.md`
- package contents checks from post-publish verification
- `package.json` files allowlist
- `jsr.json` exclusion posture

## Untracked post-publish docs

Current untracked verification docs:

- `docs/internal/post-publish-fresh-npm-install-smoke.md`
- `docs/internal/post-publish-jsr-registry-visibility.md`
- `docs/internal/post-publish-npm-registry-visibility.md`
- `docs/internal/post-publish-public-cli-smoke.md`
- `docs/internal/post-publish-public-import-surface-smoke.md`
- `docs/internal/post-publish-registry-metadata-docs-check.md`
- `docs/internal/post-publish-registry-verification-report.md`
- `docs/internal/post-publish-registry-verification-scope-lock.md`

This planning block also creates new `registry-hygiene-*.md` docs.

## Options considered

### Option A — Commit internal verification docs

Pros:

- preserves real public registry verification history
- aligns with existing `docs/internal` audit-trail workflow
- keeps pass-by-pass evidence for final release decisions
- documents what actually worked from the public registries

Cons:

- grows internal docs count

### Option B — Squash into one report and delete individual docs

Pros:

- less file count

Cons:

- loses pass-by-pass detail
- makes future debugging harder if a registry artifact regresses

### Option C — Do not commit generated verification docs

Pros:

- less repo noise

Cons:

- inconsistent with prior block workflow
- loses the first true public-registry verification evidence

## Decision

Commit the internal verification docs.

Rationale:

- `docs/internal` is the project audit trail.
- This was the first true public registry verification pass.
- The docs capture real npm/JSR commands and outcomes that local tests cannot reproduce later.
- Pass-by-pass evidence is useful for deciding whether to prepare `0.1.0-preview.1` or `0.1.0`.

## Package exclusion requirement

`docs/internal` must remain excluded from public artifacts.

Current npm package posture satisfies this through the `files` allowlist in `package.json`.

Current JSR artifact did not include `docs/internal`, and the hygiene patch should continue excluding all `docs` from JSR.

## Blockers

None.
