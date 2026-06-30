# Kernel DX Polish Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/`
- `examples/`
- `tests/`
- `docs/internal/public-preview-scope-lock.md`
- `docs/internal/public-preview-api-classification.md`
- `docs/internal/public-preview-docs-accuracy-report.md`
- `docs/internal/package-contents-registry-readiness.md`

## Scope

This block is a developer-experience polish block for the existing experimental Potentia kernel. It should make the current package easier to understand, use, and diagnose without adding framework features or preparing a registry publish.

## In-scope DX work

- Clarify safe framework error messages.
- Make contract diagnostic issue summaries more useful while preserving safe response bodies.
- Simplify and clarify examples.
- Tighten README quickstart shape and reduce redundancy.
- Review public exports and document pruning recommendations.
- Preserve current package contents cleanliness.
- Preserve current tests and preview checks.

## Explicit non-goals

Do not do any of the following in this block:

- npm publish prep
- version bump
- license decision or root `LICENSE` creation
- repository/bugs/homepage metadata
- CI workflow creation
- JSR config
- file routing
- frontend runtime
- compiler or `.view` work
- CLI expansion
- DB/auth integration
- package split
- TypeScript conversion or declarations
- public API stabilization
- full middleware or plugin ecosystem

## Visible DX issues

### README

- The README is accurate but long for a first read.
- It explains many current details before a compact first-run path.
- Effects and result/error model are present in capabilities but not shown in short sections.
- Public exports are listed, but primary vs lower-level exports are not clearly separated.

### Examples

- Examples are runnable and smoke-tested, but the kernel-basic example mixes app hooks, effects, contracts, typed errors, and response helpers in one file.
- The SigilJS example is focused enough but can use simpler route handler style.
- The composed example demonstrates the right concepts but could better isolate composition from plugin details in docs.
- Nested examples must keep source-relative imports in this checkout because package self-import from nested example directories did not resolve.

### Errors and diagnostics

- Current error bodies are safe and deterministic.
- Generic contract issue summaries are too generic: all contract failures currently show only `Contract validation failed`.
- 404 and 405 messages are safe but terse; developer-facing clarity can improve without changing status codes or shape.
- Handler failures correctly hide internals and should stay conservative.

### Public exports

High-level preview exports are easy to justify:

- `createApp`
- `route`
- `createRoutes`
- `mount`
- `json`
- `text`
- `redirect`
- `ok`
- `fail`
- `effect`

Lower-level exports need explicit future review:

- `composeRoutes`
- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`
- `projectContract`
- `createPlugin`

## Decisions

- Keep package metadata posture unchanged: `private: true`, `version: 0.0.1`, `license: UNLICENSED`.
- Keep all public exports in this block unless a clearly accidental export appears.
- Prefer docs and tests over new helpers.
- Do not add dependencies.
- Do not introduce environment-dependent error behavior or debug modes.
- Keep field-level verbose SigilJS projection deferred unless a safe, deterministic summary can be derived trivially.
- Preserve safe response shapes and status codes.

## Blockers left untouched

- No Git repository detected.
- No root license file.
- Package remains private.
- No real repository/bugs/homepage metadata.
- No CI workflow.
- No registry publish readiness.

## Acceptance summary

DX polish is scoped to sharper messages, safer diagnostics, clearer examples/docs, and export recommendations. Publish prep and feature expansion remain deferred.
