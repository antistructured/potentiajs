# Public Preview Changelog Prep

## Files inspected

- `package.json`
- `README.md`
- `docs/internal/api-pruning-stabilization-report.md`
- `docs/internal/public-preview-release-notes.md`

## Files changed

- `docs/internal/public-preview-release-notes.md`
- `docs/internal/public-preview-changelog-prep.md`

## Root CHANGELOG decision

Decision: defer root `CHANGELOG.md`.

Reason: the project is not yet in a publishable package configuration:

- license remains `UNLICENSED`
- root `LICENSE` file is absent
- package remains `private: true`
- final preview version has not been applied
- npm access/package availability are not confirmed

A root changelog should be created once the owner confirms license/public publish intent and the final preview version target. Until then, the internal release notes draft captures the release message without implying the package has been released.

## Draft changelog entry

Future root changelog section should use the selected preview version, likely:

```md
## 0.0.2-preview.0

### Added

- Contract-driven routing kernel and explicit route composition.
- SigilJS request/response/action contract boundaries.
- Effect descriptors and helper commands.
- Experimental action primitive with JSON and URL-encoded input.
- Normalized route/action diagnostics with field issue metadata.
- Safe form state helper and renderer-independent form projection metadata.
- Projection metadata and deterministic route manifest helpers.
- Focused examples for kernel, SigilJS, composition, actions, and form state.

### Changed

- Pruned root exports to the intended 24-symbol public preview surface.
- Kept low-level request-context/effect-runner/error-normalization/response-projection helpers internal.

### Notes

- Experimental preview only.
- Not production-ready.
- No stable public API yet.
- No frontend runtime, form renderer, client SDK, OpenAPI generator, public file-routing API, or TypeScript declarations yet.
```

## Blockers

Root changelog creation remains blocked on owner-confirmed publish intent/version/license.
