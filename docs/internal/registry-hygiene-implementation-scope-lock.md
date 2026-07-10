# Registry Hygiene Implementation Scope Lock

## Files inspected

- `docs/internal/registry-hygiene-planning-report.md`
- `docs/internal/registry-hygiene-jsr-artifact-decision.md`
- `docs/internal/registry-hygiene-patch-preview-version-decision.md`
- `package.json`
- `jsr.json`
- `.github/workflows/publish.yml`
- `CHANGELOG.md`
- git status

## Current verified preview

Publicly verified package:

```txt
@potentiajs/core@0.1.0-preview.0
```

Verified public smoke:

- npm package/version/preview tag visible
- JSR package/version visible
- fresh npm registry install works
- root import works
- file-routing subpath import works
- forms subpath import works
- installed `potentia` binary works
- `potentia routes check --json` works
- `potentia routes generate --json` works
- generated routes serve via `createApp(...)`
- `renderForm(...)` works from registry install

## Allowed implementation scope

Allowed changes in this block:

- `jsr.json` include/exclude hygiene
- package metadata cleanup only if required
- publish workflow dist-tag verification posture
- internal docs audit trail preservation
- `CHANGELOG.md` entry only if version bump happens
- version bump to `0.1.0-preview.1` only if artifact config changes are made

## Out of scope

Disallowed changes:

- framework source API changes
- route behavior changes
- file-routing behavior changes
- form renderer behavior changes
- examples restructuring
- new features
- npm dist-tag mutation
- real publish
- final `0.1.0` release prep

## Working tree notes

Current working tree contains untracked internal docs from the post-publish verification and registry hygiene planning passes:

- `docs/internal/post-publish-*.md`
- `docs/internal/registry-hygiene-*.md`

Planning decision says these should be committed as the project audit trail, while remaining excluded from package artifacts.

## No-publish guarantee

No `npm publish`, `npx jsr publish` without `--dry-run`, or `npm dist-tag` mutation is run in this implementation block.

## Blockers

None at scope-lock time.
