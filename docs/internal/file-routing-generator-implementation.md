# File Routing Generator Implementation

## Files inspected

- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/diagnostics.js`
- `docs/internal/file-routing-projection-boundary-decision.md`
- `tests/fixtures/file-routing-basic/`

## Files changed

- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/index.js`
- `tests/file-routing-generator.test.js`
- `docs/internal/file-routing-generator-implementation.md`

## Implementation

Added `generateRouteModule(scanResult, options)` as a pure generator.

Behavior:

- accepts a scanner result
- fails when scanner result contains errors
- emits deterministic ESM source
- imports `createRoutes` and `mount` from `potentia-js`
- imports route modules explicitly
- imports `_routes.js` scope metadata explicitly
- exports default `createRoutes(...)`
- groups scoped folder routes under `mount(createRoutes({ prefix }))`
- carries scope `hooks`, `contracts`, and `meta`
- does not execute route modules
- does not write files
- emits no filesystem scanning code

## Verification

```bash
bun test tests/file-routing-generator.test.js tests/file-routing-diagnostics.test.js tests/file-routing-scanner.test.js tests/file-routing-path-mapping.test.js
```

Result:

- 20 pass
- 0 fail

## Boundary check

Generator lives under `src/dev/file-routing/`; the runtime kernel remains untouched.

## Blockers

- Generated route modules are not written by the generator; tests or future dev wrappers own writing.
- Method-aware collision validation remains deferred.
- Route module export-shape validation remains deferred beyond import smoke coverage.
