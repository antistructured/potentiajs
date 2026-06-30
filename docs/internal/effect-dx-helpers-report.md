# Effect DX Helpers Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- effect DX scope lock
- experimental helper constructors
- malformed command validation
- clearer internal command diagnostics
- safe public error verification
- composed example effect-helper update
- README/internal docs updates
- package check

Not performed:

- full workflow engine
- concurrency helpers
- retry/cancel/timeout policies
- `delay()`
- background jobs/queues/supervisors
- frontend work
- file-routing work
- compiler work
- CLI expansion
- publish prep
- TypeScript conversion

## 4. New/changed exports

Added experimental root exports:

- `call`
- `value`
- `context`

Existing exports retained:

- `effect`
- `runEffect`

No exports were removed. `runEffect()` remains public for now but is still a future internal candidate.

## 5. Helper behavior

Implemented in `src/kernel/effect.js`:

```js
call(fn, ...args)
value(value)
context(key)
```

Stable shapes:

```js
{ type: 'call', fn, args, meta: null }
{ type: 'value', value, meta: null }
{ type: 'context', key, meta: null }
```

Helpers work through `runEffect()` in:

- direct effect execution
- route handlers
- app hooks
- scoped hooks

Raw command object compatibility is preserved.

## 6. Validation behavior

Object-shaped yielded commands now fail deterministically for:

- missing/non-string command type
- unknown command type
- invalid `call.fn`
- invalid `call.args`
- invalid `context.key`

Non-object yielded values still pass through for compatibility.

## 7. Error diagnostic behavior

Internal `runEffect()` errors have useful messages for malformed commands.

Public route/hook responses still hide unsafe internals through the existing safe handler failure response:

```json
{ "error": { "code": "POTENTIA_HANDLER_FAILED", "message": "Internal server error" } }
```

Exposed framework errors still surface safe explicit messages as designed.

## 8. Example changes

Updated `examples/composed-basic/index.js` so the mounted user route uses:

- `effect(function* getUser(ctx) { ... })`
- `yield call(displayName, ctx.query.include)`

Updated `examples/composed-basic/README.md` to mention the effect helper route.

## 9. Docs updated

- `README.md`
- `docs/internal/framework-effect-model.md`
- `docs/internal/effect-dx-scope-lock.md`
- `docs/internal/effect-command-helpers.md`
- `docs/internal/effect-command-validation.md`
- `docs/internal/effect-error-diagnostics.md`
- `docs/internal/effect-example-dx-update.md`
- `docs/internal/effect-dx-docs-update.md`
- `docs/internal/effect-dx-helpers-report.md`

## 10. Tests added/updated

Added:

- `tests/kernel-effect-helpers.test.js`
- `tests/kernel-effect-command-validation.test.js`
- `tests/kernel-effect-error-diagnostics.test.js`

Updated smoke coverage through the composed example test.

## 11. Deferred features

- `delay()`
- `all()`
- `race()`
- retries
- cancellation
- timeout policies
- queues
- supervisors
- sagas/compensation
- workflow tracing
- task scheduling
- async plugin loading
- full workflow engine semantics
- stable public API commitment

## 12. Recommendation

Next best block: **Contract Projection Upgrade**, if publish decisions remain deferred.

Effect DX is now substantially more teachable: helpers cover the existing command model without expanding Potentia into a workflow engine.
