# Framework Kernel Scope Lock

## Goal

Lock the smallest useful `potentia-js` kernel before implementation. This block creates an experimental server/kernel foundation only.

## Files inspected

- `package.json`
- `README.md`
- `src/index.mjs`
- `src/`
- `docs/internal/framework-sanity-pass-report.md`
- `docs/internal/framework-public-surface-classification.md`
- `docs/internal/sigiljs-contract-integration-audit.md`
- `docs/internal/framework-architecture-boundary-audit.md`

## Current prototype/internal files

These files remain prototype/internal and are not part of the new public kernel surface:

- `src/index.mjs` — old Bun server prototype; imports missing `../dist/app.js` and starts a server as a side effect.
- `ui.mjs` — experimental browser DOM helper prototype.
- `reactive.mjs` — experimental reactive prototype.
- `plugins/dsl-ui.mjs` — experimental `.view` compiler plugin.
- `cli/index.mjs` and `cli/dev.mjs` — prototype CLI/dev workflow.
- `examples/UserProfile.view` — prototype view DSL example.
- `potentia.config.mjs` — empty placeholder.

## Files to leave untouched

This kernel block should not modify frontend/compiler/CLI prototypes unless required for package import safety. Leave untouched:

- `ui.mjs`
- `reactive.mjs`
- `plugins/dsl-ui.mjs`
- `cli/*`
- `examples/UserProfile.view`
- `potentia.config.mjs`

## Kernel location

The new kernel lives under:

- `src/index.js` — public experimental package entrypoint.
- `src/kernel/result.js` — result helpers and error normalization.
- `src/kernel/response.js` — response descriptors and native `Response` conversion.
- `src/kernel/route.js` — route declaration and route matching helpers.
- `src/kernel/context.js` — request context creation.
- `src/kernel/app.js` — app factory and Bun-native `fetch` handler.
- `src/kernel/effect.js` — explicit effect wrapper/interpreter.
- `src/kernel/contract.js` — SigilJS-compatible contract adapter.

The old `src/index.mjs` remains a prototype and is not the package entrypoint.

## Required experimental exports

Initial public API candidates for this block:

- `createApp`
- `route`
- `createRequestContext`
- `ok`
- `fail`
- `json`
- `text`
- `redirect`
- `toResponse`
- `effect`
- `runEffect`

All exports are **experimental**. Nothing is stable yet.

## Deferred exports / framework areas

Explicitly deferred:

- frontend rendering and hydration
- client router
- file-based routing
- dynamic route params
- wildcard/nested routes
- middleware chains
- streaming
- server actions/RPC
- CLI expansion
- `.view` compiler changes
- database integration
- auth
- package splitting
- TypeScript source or JSDoc typing layer
- CI/release workflow
- SigilJS dependency installation

## Package surface decision

Repair `package.json` so package imports resolve to `./src/index.js` and never import the old broken `src/index.mjs` or missing `../dist/app.js` through the public path.

## Contract boundary decision

Support SigilJS-compatible contract shapes without adding SigilJS as a dependency:

- function contract
- object with `parse(value)`
- object with `check(value)`

Only `body` and `response` route contract slots are in scope for this block. Query, params, headers, and projection semantics are deferred to hardening.

## Pass 1 decisions

- Build the smallest Bun-native kernel path: Request → Route Match → Contract Boundary → Effect Execution → Result Normalization → Response.
- Preserve current prototype files as internal/experimental historical work.
- Keep public API intentionally small and experimental.
- Add tests as behavioral contracts for each new kernel layer.
