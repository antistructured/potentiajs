# Public Preview Publish Prep Scope / Owner Intent Audit

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `docs/internal/api-pruning-stabilization-report.md`
- `docs/internal/public-preview-readiness-regate-report.md`
- `docs/internal/public-preview-package-metadata-contents-audit.md`
- `docs/internal/*jsr*` search
- `docs/internal/*npm*` search
- `.git/` via `git rev-parse`, `git remote -v`, and `git status --short`
- `.github/` search
- root `LICENSE*` search
- root `CHANGELOG*` search

## Scope lock

This block is publish prep only. It may prepare metadata, release checks, CI, release notes, dry-run verification, and final checklists.

Out of scope:

- real npm publish
- real JSR publish
- framework feature work
- API expansion
- package split
- stable API commitment
- TypeScript source conversion
- frontend runtime
- form renderer/generator
- client SDK/OpenAPI
- compiler/CLI expansion

## Confirmed decisions / facts

- Project is a Git repository.
- Git remote exists:
  - `origin https://github.com/antistructured/poteniajs.git`
- Package name is currently `potentia-js`.
- Current package version is `0.0.1`.
- Current package is private: `true`.
- Current license metadata is `UNLICENSED`.
- No root `LICENSE` file exists.
- No root `CHANGELOG.md` exists.
- No `.github/workflows/` CI workflow exists.
- Runtime target is Bun-first.
- Source is plain JavaScript ESM.
- Runtime dependency is `@weipertda/sigiljs@0.18.0`.
- Root API surface is intentionally pruned to 24 exports.
- Future preview target has been repeatedly documented as likely `0.0.2-preview.0`, but not applied.
- Real publishing is forbidden in this block.

## Unconfirmed decisions

- License choice is not confirmed.
- Public npm publish intent is not fully confirmed enough to flip `private` to `false`.
- npm account/access/2FA/package availability are not confirmed.
- Whether `potentia-js` is the final registry name is not externally verified.
- JSR package scope/name/metadata are not confirmed.
- Whether JSR should be part of first preview is not confirmed.
- Whether to add TypeScript declaration files for preview is not confirmed.

## Mechanical prep allowed

- Add truthful repository metadata from the actual Git remote.
- Add a release-check script that composes existing checks.
- Add CI that runs release checks and pack dry-run without secrets or publish actions.
- Create internal release notes/checklists.
- Run `npm pack --dry-run --json`.
- Skip `npm publish --dry-run` while package remains private/unlicensed for public publish.

## Blockers

- License decision/root `LICENSE` file.
- Public/private package decision.
- npm access/2FA/package availability.
- JSR scope/name/metadata decision.
- Optional TypeScript declaration/type-story decision.

## Decision

Proceed with reversible mechanical publish prep. Keep release-critical owner/product choices blocked instead of guessing.
