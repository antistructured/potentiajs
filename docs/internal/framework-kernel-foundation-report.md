# Framework Kernel Foundation Report

## Summary

This block created the first experimental Bun-native framework kernel for `potentia-js`.

The kernel now proves:

Request → Route Match → Contract Boundary → Effect Execution → Result Normalization → Response

## Package surface

Package entrypoints now resolve to `./src/index.js`:

- `main`: `./src/index.js`
- `module`: `./src/index.js`
- `exports["."]`: `./src/index.js`
- `type`: `module`

The old `src/index.mjs` prototype remains untouched and is not the public package path.

## Experimental public exports

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

All new public APIs are experimental. No stable surface is declared.

## Kernel files

- `src/index.js`
- `src/kernel/app.js`
- `src/kernel/context.js`
- `src/kernel/contract.js`
- `src/kernel/effect.js`
- `src/kernel/result.js`
- `src/kernel/response.js`
- `src/kernel/route.js`

## Tests added

- `tests/kernel-result-response.test.js`
- `tests/kernel-router-context.test.js`
- `tests/kernel-effect.test.js`
- `tests/kernel-contract-boundary.test.js`

## Behavior covered

- Shape-stable `ok()` / `fail()` results.
- JSON/text/redirect response descriptors.
- Native `Response` conversion.
- Safe deterministic error responses.
- Static route matching.
- 404 and 405 responses.
- Stable request context shape.
- Plain, async, and generator/effect route handlers.
- Minimal explicit effect commands: `call`, `value`, `context`.
- Body contract validation/transform before handler execution.
- Response contract validation before native response conversion.
- No body parsing when no body contract exists.

## Package hygiene

- Added `test`, `check`, and `pack:dry` scripts.
- Added package `files` allowlist for `src/`, `README.md`, and `docs/`.
- `.history/`, editor metadata, `node_modules`, and other root artifacts are excluded from pack output by the allowlist.

## Constraints respected

- Plain JavaScript only.
- ES modules.
- Bun-first runtime.
- No TypeScript source.
- No JSDoc typing layer.
- No runtime dependencies added.
- No package split.
- No frontend scope added.
- No CLI expansion added.
- No SigilJS dependency added.

## Deferred

- Dynamic route params.
- Query/header contracts.
- Multiple response contracts by status.
- Middleware/effect composition.
- App-level hooks.
- Example app smoke test.
- Release-readiness checks.
- Frontend runtime stabilization.

## Recommended next block

**Framework Kernel Hardening — Manual Virtual Sub-Agent Workflow**

Focus on dynamic route params, query/header contract validation, typed error codes, response projection semantics, app-level hooks, composable middleware/effects, an example app smoke test, and release-readiness checks.
