# Final Public Preview Release Prep Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `docs/internal/owner-publish-decision-checklist-report.md`
- `docs/internal/owner-decision-follow-up.md`
- `docs/internal/public-preview-publish-prep-report.md`
- `docs/internal/public-preview-npm-jsr-readiness.md`
- `docs/internal/public-preview-release-notes.md`
- `docs/internal/public-preview-changelog-prep.md`
- `.github/workflows/ci.yaml`
- git status

## Scope lock

This block is final public preview release prep for Potentia. It may convert owner decisions into package metadata, docs, package contents, type declarations, and dry-run verification artifacts.

It must stop before real publishing.

## Owner decisions now sufficient

- License: `MIT`
- Repository slug: `antistructured/potentiajs`
- Preferred npm package: `potentiajs`
- Fallback npm package: `@weipertda/potentiajs`
- npm visibility: public preview
- publish method: protected/manual-trigger CI workflow desired
- version target: `0.1.0-preview.0`
- JSR identity: `@weipertda/potentiajs`, with JSR implementation deferred pending compatibility gate
- type posture: minimal conservative handwritten declarations before preview
- changelog: root `CHANGELOG.md`

## Current observed package state

The live `package.json` already has:

- `name`: `potentiajs`
- `version`: `0.1.0`
- `private`: `true`
- `license`: `UNLICENSED`
- repository metadata still points to `antistructured/poteniajs`

The release target remains `0.1.0-preview.0`, so this block should correct the version to the preview prerelease target rather than keeping `0.1.0`.

## Allowed changes

After npm name availability is verified, this block may:

- apply chosen package name
- set version to `0.1.0-preview.0`
- set `private: false`
- set `license: MIT`
- correct repository/bugs/homepage metadata to `antistructured/potentiajs`
- add public publish config if appropriate
- add root `LICENSE`
- add root `CHANGELOG.md`
- add minimal conservative `src/index.d.ts`
- add package type metadata for declarations
- update README release posture, imports, package name, version, license, and limitations
- add protected/manual dry-run publish workflow
- run `npm publish --dry-run`
- run package dry-runs and packed artifact smoke

## Forbidden commands

These commands are forbidden in this block:

```bash
npm publish
jsr publish
```

Allowed dry-run commands:

```bash
npm publish --dry-run
npm pack --dry-run --json
```

## Real publish hard stop

Real publish must not run. The final output must explicitly state: real publish was not run.

## JSR deferral

JSR implementation remains deferred. This block may document JSR identity and readiness, but must not add `jsr.json`, `deno.json`, or run `jsr publish` unless a separate JSR Compatibility Design Gate is explicitly approved.

## npm name availability requirement

Before finalizing or relying on the package name, this block must verify live npm registry availability for:

- `potentiajs`
- `@weipertda/potentiajs`

If availability cannot be verified, package rename/public posture must stop with a blocker.

## Blockers entering Pass 2

- live npm availability check not yet completed
- npm CI credentials/trusted publishing setup is owner-side and cannot be verified locally
