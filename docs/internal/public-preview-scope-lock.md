# Public Preview Scope / Release Posture Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/`
- `examples/`
- `tests/`
- `docs/internal/framework-route-composition-foundation-report.md`
- `docs/internal/framework-sigiljs-native-integration-report.md`
- `docs/internal/framework-kernel-hardening-report.md`
- `docs/internal/framework-public-surface-classification.md`
- `.github/workflows/` lookup
- `LICENSE` lookup
- Git status / work-tree probe

## Current package posture

- Package name: `potentia-js`
- Current version: `0.0.1`
- Current package flag: `private: true`
- Runtime: Bun-first ESM plain JavaScript
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Entrypoint: `./src/index.js`
- No TypeScript source
- No Git repository detected at this path
- No root `LICENSE` file detected
- No `.github/workflows/` directory detected

## Public preview target definition

This block targets a **local/GitHub-ready public preview gate**, not an immediate registry publish.

Preview-ready means:

1. The package metadata is coherent and honest.
2. The current package remains installable/testable as a Bun-first JavaScript package.
3. The README accurately describes implemented behavior and limitations.
4. All public exports are classified as experimental.
5. Packaged examples are smoke-tested.
6. `npm pack --dry-run --json` produces a clean artifact.
7. npm/JSR readiness is documented honestly.
8. CI readiness is documented or added safely without publish automation.

## Release posture decisions

### Private/public

Keep `private: true` in this block.

Reason:

- No Git repository exists at this path.
- No root license file exists.
- Repository, bugs, and homepage metadata cannot be honestly completed yet.
- Public API is explicitly experimental and not stable.
- This block is a readiness gate, not a publish-prep command.

### Version target

Document the suggested public-preview target as `0.0.2-preview.0`, but do not bump `package.json` in this block unless a later pass explicitly determines metadata should change.

Reason:

- The current codebase is still private and not registry-ready.
- Version bump should happen in a follow-up publish-prep block when license/repository/public flag are decided.

### Package name

Keep `potentia-js`.

Reason:

- Current package name is consistent across package metadata, README, examples, and self-import verification.
- No evidence in this block requires a rename.

### Registry posture

- npm: preview candidate after metadata/license/repository/public-flag decisions; do not publish now.
- JSR: intentionally deferred; Bun-first runtime and volatile experimental API should be revisited after npm/GitHub preview readiness.

### CI/release workflow posture

Do not add publish automation.

Because there is no Git repository at this path, prefer a CI readiness plan unless a minimal workflow can be added without pretending repository readiness exists. Any workflow must only install/check/test/pack and must not publish or require secrets.

## Safe-to-advertise implemented capabilities

Safe to describe as experimental:

- Bun-native `app.fetch`
- static routes
- dynamic `:param` routes
- deterministic route specificity
- params/query/headers/body/response contracts
- generic function/parse/check contract adapter
- native SigilJS contract support
- typed framework errors
- deterministic response projection
- app-level lifecycle hooks
- route collections
- `mount()` prefix composition
- scoped contracts
- scoped hooks
- minimal plugin seam
- contract projection
- kernel/basic, SigilJS/basic, and composed/basic examples

## Must remain explicitly deferred

- stable public API
- registry publish
- file-based routing / auto-discovery
- frontend runtime/rendering/hydration
- compiler work / `.view` integration
- CLI expansion
- DB/auth
- package split
- TypeScript source conversion
- JSDoc typing layer
- full middleware ecosystem
- plugin discovery/registry/async loading
- CI release automation
- OpenAPI/route docs generators

## Old prototype/internal files

`examples/UserProfile.view` is an old prototype artifact. It should remain excluded from package output unless a later compiler/frontend block makes it runnable and documented.

`docs/internal/` currently ships because `package.json` allows `docs/`; this should be reconsidered during package contents readiness. Internal reports are useful repository evidence but may be inappropriate for registry artifacts.

## Blockers

- No Git repository detected.
- No root `LICENSE` file detected despite `package.json` claiming `MIT`.
- `repository.url`, `bugs.url`, and `homepage` metadata are absent or placeholder-like.
- Package remains private.
- Public API remains experimental.

## Decision summary

This block should harden the current private package for a controlled preview decision. It should not publish, stabilize APIs, add features, or expand scope.
