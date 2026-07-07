# Post-Release README / Docs Rendering Audit

## Files inspected

- `README.md`
- `CHANGELOG.md`
- `package.json`
- npm registry metadata checks
- JSR page/API for `@potentiajs/core`

## Files changed

- `README.md`
- `CHANGELOG.md`
- `package.json`
- `docs/internal/post-release-readme-docs-rendering-audit.md`

## Public docs rendering status

### npm

npm README rendering cannot be verified because the npm package is not visible from live registry checks.

Affected names checked:

- `@potentiajs/core`
- `@potentiajs/core@0.1.0-preview.0`
- `potentiajs`
- `potentiajs@0.1.0-preview.0`

All returned `E404` from `https://registry.npmjs.org/`.

### JSR

JSR page exists for:

```txt
@potentiajs/core
```

The JSR API reports package metadata and `readmeSource: readme`, but `versionCount: 0` and `latestVersion: null`, so versioned docs rendering cannot be verified yet.

## Docs issues found

- Local `package.json` now uses `@potentiajs/core`, but README still used `potentiajs` install/import examples.
- README still used final-prepublish language (`final publish gate`) even though this block is post-release verification.
- CHANGELOG used `potentiajs` package naming.
- `package.json` had duplicate `keywords` keys; JSON parsers keep the last one, but this is release-metadata hygiene risk.

## Docs fixes applied

- README package name changed to `@potentiajs/core`.
- README install command changed to `bun add @potentiajs/core`.
- README import examples changed to `from '@potentiajs/core'`.
- README manifest package example changed to `@potentiajs/core`.
- README publish wording changed to registry-visibility verification language.
- CHANGELOG package name changed to `@potentiajs/core`.
- `package.json` duplicate `keywords` key was removed, preserving the richer keyword list.

## Remaining docs issues

- Public npm-rendered README cannot be audited until npm package visibility is fixed.
- JSR rendered version docs cannot be audited until a version exists on JSR.

## Patch release needed

Yes, if a package was actually published with the stale README/package metadata.

If the release is not visible because publish did not complete, then no patch release is needed yet; instead, complete/fix the first publish with the corrected docs and metadata.

## Blockers

- npm package not visible.
- JSR package has no visible version.

## Publish status

No second publish occurred.
