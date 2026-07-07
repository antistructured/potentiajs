# Post-Release Verification Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `.github/workflows/ci.yaml`
- `.github/workflows/publish-preview.yaml`
- `docs/internal/final-public-preview-release-readiness-report.md`
- `docs/internal/public-preview-publish-prep-report.md`
- npm registry lookups for likely package names
- JSR package/API lookups for likely package names
- git tags
- GitHub releases via `gh release list`
- git remote/status

## Scope lock

This block is post-release verification, release-path hardening, and launch-loop setup only.

It must verify the artifact users actually receive from public registries and document mismatches. It must not add features, redesign APIs, bump versions, or publish again.

## Published target under verification

Local package metadata currently says:

- package: `@potentiajs/core`
- version: `0.1.0-preview.0`
- license: MIT
- repository: `https://github.com/antistructured/potentiajs`

Registry evidence found so far:

- npm: no visible package for `@potentiajs/core`, `potentiajs`, `@weipertda/potentiajs`, or `potentia-js` from live `npm view` checks.
- JSR: `@potentiajs/core` package page/API exists, but JSR API reports `versionCount: 0` and `latestVersion: null`.

Therefore the published-target assumption is not yet fully verified. This block should treat registry visibility as the first hard gate.

## Registries under verification

- npm: expected if real npm publish occurred, but currently not visible from live checks.
- JSR: `@potentiajs/core` package shell exists, but no version is visible from API.

## Verification commands to run

npm:

```bash
npm view @potentiajs/core
npm view @potentiajs/core@0.1.0-preview.0
npm view potentiajs
npm search potentiajs --json
```

JSR:

```bash
curl -L https://jsr.io/@potentiajs/core
curl -L https://api.jsr.io/scopes/potentiajs/packages/core
```

Install smoke only if a registry package/version is visible:

```bash
bun init -y
bun add <published-package-name>@0.1.0-preview.0
bun run smoke.js
```

Local safety checks:

```bash
bun run test
bun run check:release
npm pack --dry-run --json
```

Git/GitHub checks:

```bash
git tag --list
gh release list --limit 10
gh run list --limit 10
```

## Explicitly out of scope

- no feature work
- no API redesign
- no second publish
- no version bump
- no JSR implementation changes
- no package split
- no frontend/runtime/form renderer/client SDK/OpenAPI work
- no marketing spam

## When a patch release is justified

A patch release such as `0.1.0-preview.1` is justified only if the published artifact is visible and has a user-impacting release issue, such as:

- wrong package name or metadata in package contents
- wrong README install/import instructions
- missing `LICENSE`, `CHANGELOG.md`, or declarations
- broken root exports or install smoke
- broken SigilJS dependency resolution
- incorrect registry tag/access

If the package is simply not visible on npm/JSR, the immediate issue is publish/registry completion, not a patch release.

## Blockers

- npm registry presence is not currently verified.
- JSR package has no visible version according to API.
- Git remote still points to `antistructured/poteniajs.git`, while package metadata targets `antistructured/potentiajs`.

## Publish status

No second publish occurred in this pass.
