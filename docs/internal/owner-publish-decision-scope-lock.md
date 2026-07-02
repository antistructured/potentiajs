# Owner Publish Decision Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `docs/internal/public-preview-publish-prep-report.md`
- `docs/internal/public-preview-license-metadata-prep.md`
- `docs/internal/public-preview-version-publish-config-decision.md`
- `docs/internal/public-preview-npm-jsr-readiness.md`
- `docs/internal/public-preview-release-notes.md`
- `docs/internal/public-preview-changelog-prep.md`
- `.github/workflows/ci.yaml`
- root `LICENSE*` search
- root `CHANGELOG*` search
- root `*.d.ts` search
- `jsr.json` / `deno.json` search
- `git remote -v`

## Scope lock

This block is an owner decision capture gate only.

It may create internal documentation that converts publish blockers into explicit owner choices. It must not make irreversible or publish-impacting package posture changes.

## Current publish blockers

- license choice unresolved
- root `LICENSE` file absent
- package remains `private: true`
- no `publishConfig.access`
- npm access/2FA/package availability unconfirmed
- final preview version not applied
- root `CHANGELOG.md` deferred
- JSR scope/name/metadata unresolved
- TypeScript declarations/type story unresolved
- `npm publish --dry-run` skipped while package remains private/unlicensed for public preview
- all APIs remain experimental

## Decisions required from owner

- license
- repository URL / project slug, especially `poteniajs` vs `potentia-js` / `potentiajs`
- npm package name and scope
- npm visibility and publish path
- npm account/access/2FA/package availability
- final preview version
- JSR timing and package identity
- TypeScript declaration posture
- changelog/release notes posture

## Changes explicitly forbidden in this block

- no real npm publish
- no npm publish dry-run while package remains private
- no real JSR publish
- no `private: false`
- no version bump
- no `publishConfig`
- no package name change
- no repository metadata change
- no root `LICENSE` file
- no package license metadata change
- no `jsr.json`
- no `deno.json`
- no declaration files
- no root `CHANGELOG.md`
- no source feature changes
- no package split

## Next block candidates

### Owner decisions complete

Proceed to **Final Public Preview Release Prep**.

That block may apply the chosen license, add root `LICENSE`, apply the chosen version, flip `private`, add `publishConfig`, create root `CHANGELOG.md`, run `npm publish --dry-run`, and prepare final release notes. It still must not publish unless explicitly instructed.

### Owner decisions incomplete

Proceed to **Owner Decision Follow-Up** for only the missing choices.

### JSR required before npm preview

Proceed to **JSR Compatibility Design Gate** before any release-prep implementation.

### Repository/package name mismatch must be fixed first

Proceed to **Repository / Naming Correction Pass**.

## Findings

Mechanical publish prep is in place, but owner decisions remain blocked. This block should document the decisions rather than mutating package posture.

## Blocked changes

All publish-impacting changes remain blocked pending explicit owner choices.
