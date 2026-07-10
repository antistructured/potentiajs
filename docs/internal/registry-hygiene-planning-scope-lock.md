# Registry Hygiene Planning Scope Lock

## Files inspected

- `package.json`
- `jsr.json`
- `README.md`
- `CHANGELOG.md`
- `.github/workflows/`
- `docs/internal/post-publish-registry-verification-report.md`
- `docs/internal/post-publish-npm-registry-visibility.md`
- `docs/internal/post-publish-jsr-registry-visibility.md`
- `docs/internal/post-publish-registry-metadata-docs-check.md`
- git status

## Verified public preview state

Published and externally verified package:

```txt
@potentiajs/core@0.1.0-preview.0
```

Public verification passed for:

- npm package visibility
- npm preview tag visibility
- JSR package/version visibility
- fresh npm registry install
- root import
- `@potentiajs/core/file-routing` import
- `@potentiajs/core/forms` import
- installed `potentia` binary
- `potentia routes check --json`
- `potentia routes generate --json`
- generated routes served through `createApp(...)`
- `renderForm(...)` from registry install

## Known hygiene issues

1. npm `latest` also points to `0.1.0-preview.0`.
2. JSR artifact contents appear broader than intended.
3. `docs/internal/post-publish-*.md` verification docs are currently untracked.

## Scope

This block is planning-only for:

- npm dist-tag posture
- whether current npm `latest` should move/remove/stay
- future preview publish tag behavior
- final `0.1.0` tag behavior
- JSR package content policy
- internal docs tracking policy
- whether `0.1.0-preview.1` is warranted
- next implementation recommendation

## Out of scope

- source feature work
- public API changes
- renderer work
- file-routing behavior changes
- workflow redesign implementation
- version bump implementation
- real publish
- `0.1.0` final prep

## No-publish guarantee

No `npm publish`, `npx jsr publish`, or `npm dist-tag` mutation command is run in this planning block.

## Patch scope

Documentation only.

## Blockers

None.
