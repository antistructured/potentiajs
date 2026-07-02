# Final Release License / Changelog

## Files inspected

- `package.json`
- `README.md`
- `docs/internal/public-preview-release-notes.md`
- `docs/internal/public-preview-changelog-prep.md`
- `docs/internal/final-release-package-identity-metadata.md`

## Files changed

- `LICENSE`
- `CHANGELOG.md`
- `README.md`
- `docs/internal/final-release-license-changelog.md`

## Applied

### License

Added root `LICENSE` using standard MIT license text.

Copyright holder:

```txt
Daniel Weipert
```

Package metadata already matches:

```json
"license": "MIT"
```

### Changelog

Created root `CHANGELOG.md` for:

```txt
0.1.0-preview.0
```

The changelog documents:

- experimental preview status
- routing kernel
- SigilJS contracts
- effects
- actions
- URL-encoded form-compatible action input
- normalized diagnostics
- form state helper
- form projection metadata
- route/action/manifest projection
- intentional non-goals and deferred features

### README

Updated README release posture:

- package name: `potentiajs`
- version: `0.1.0-preview.0`
- visibility: public preview package candidate
- license: MIT
- install shape: `bun add potentiajs` after final publish gate
- imports updated from `potentia-js` to `potentiajs`
- release/publish status updated
- license and changelog links added

## Blockers

No license/changelog blocker remains.

Remaining external blocker:

- real publish still requires explicit owner confirmation and npm account/trusted-publishing setup.

## Publish status

Real publish was not run.
