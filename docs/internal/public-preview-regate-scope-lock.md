# Public Preview Readiness Re-Gate Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/`
- `examples/`
- `tests/*example*.test.js`
- `docs/internal/public-preview-api-classification.md`
- `docs/internal/form-projection-foundation-report.md`
- `docs/internal/form-state-helper-foundation-report.md`
- `docs/internal/action-primitive-foundation-report.md`
- `docs/internal/public-preview-readiness-gate-report.md` (not present)

## Files changed

- `docs/internal/public-preview-regate-scope-lock.md`

## Findings

Potentia has grown from a minimal route kernel into a broader experimental framework kernel with route composition, contracts, effects, actions, form state, form projection, route/action projection, manifests, and internal file-routing projection.

Current package posture remains conservative:

- package: `potentia-js`
- version: `0.0.1`
- private: `true`
- license metadata: `UNLICENSED`
- runtime: Bun-first plain JavaScript ESM
- runtime dependency: `@weipertda/sigiljs@0.18.0`
- no dev dependencies
- no TypeScript source

Current examples intentionally shipped by the package allowlist:

- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `examples/action-basic/`
- `examples/form-state-basic/`

Repo-only/internal examples also exist, including `examples/file-routing-dev/`, and should remain excluded from the package unless a later public API gate promotes file routing.

## Decisions

This block is a readiness re-gate only.

Allowed work:

- classify exports
- audit README truthfulness
- audit examples and smoke coverage
- audit package metadata and package contents
- run packed-artifact install smoke
- document npm/JSR/CI/release blockers
- produce a decisive next-path recommendation

Disallowed work:

- no new framework features
- no public API expansion
- no feature examples beyond honesty/smoke needs
- no form rendering
- no client SDK
- no OpenAPI
- no CLI/compiler expansion
- no package split
- no publish
- no version bump
- no license/repository/publish metadata decisions

## Current maturity assessment

The framework shape is coherent enough to audit seriously, but it is not registry-ready. The most likely next decision is whether the root export surface should be pruned/stabilized before public preview or whether only mechanical publish blockers remain.

## Publish blockers to carry forward

- `private: true`
- `UNLICENSED` metadata and no root `LICENSE` file
- repository/bugs/homepage metadata unresolved
- CI workflow absent
- Git/release workflow not confirmed
- npm/JSR publish intent not confirmed
- all APIs remain experimental
- install-from-packed-artifact smoke not yet complete at this pass

## Deferred feature areas

- manifest `forms` section
- HTML rendering/form generation
- frontend runtime
- client SDK
- OpenAPI
- multipart/file projection
- session/flash/redirect-with-errors
- arrays-of-objects/repeater model
- richer finite options/enum projection
- explicit labels/help/placeholders metadata source
- stable public API commitment
- publish prep

## Blockers

No blocker to performing the re-gate. The absence of the earlier `docs/internal/public-preview-readiness-gate-report.md` is informational; current reports and live package state provide enough evidence for this re-gate.
