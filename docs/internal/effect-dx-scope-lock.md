# Effect DX Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/effect.js`
- `src/kernel/app.js`
- `tests/kernel-effect.test.js`
- `tests/kernel-lifecycle-hooks.test.js`
- `tests/kernel-scoped-hooks.test.js`
- `examples/`
- `docs/internal/framework-effect-model.md`
- `docs/internal/kernel-dx-polish-report.md`

## Findings

Potentia already supports effect descriptors through `effect(generatorOrFunction)` and `runEffect(effectValue, context, ...args)`.

Current supported command shapes are raw objects:

```js
{ type: 'call', fn, args }
{ type: 'value', value }
{ type: 'context', key }
```

Current interpreter behavior:

- plain functions run through `runEffect()`
- async functions run through `runEffect()`
- `effect(...)` descriptors run through `runEffect()`
- generator effects yield command objects
- `call` executes `command.fn(...args)` with `args` defaulting to `[]` when not an array
- `value` returns `command.value`
- `context` returns `context[command.key]`
- unknown objects currently pass through unchanged
- non-object yielded values currently pass through unchanged
- thrown errors normalize through existing app/hook error handling

Effects already work in:

- route handlers
- app lifecycle hooks
- scoped hooks
- plugin hooks through existing hook execution paths

## Decisions

Add these experimental public exports:

- `call(fn, ...args)`
- `value(value)`
- `context(key)`

Use shape-stable command objects:

```js
{ type: 'call', fn, args, meta: null }
{ type: 'value', value, meta: null }
{ type: 'context', key, meta: null }
```

Preserve compatibility with existing raw command objects that omit `meta`.

Improve command validation in `src/kernel/effect.js` so malformed command objects fail deterministically instead of silently passing through.

Keep non-object yielded values as pass-through values for compatibility.

Defer `delay()` in this block. Reason: the requested core DX improvement is helper constructors for existing semantics. Adding time-based behavior introduces timer semantics and async scheduling questions that are better handled in a later block if needed.

## Explicitly deferred

- `delay()`
- `all()`
- `race()`
- retries
- cancellation
- timeout policies
- background jobs
- queues
- supervisors
- sagas/compensation
- workflow tracing
- task scheduling
- async plugin loading
- frontend integration
- file-routing work
- compiler work
- CLI expansion
- publish prep
- TypeScript conversion

## Docs/examples to update

- `README.md` Effects section should show `call(...)` helper usage.
- `README.md` public export list should include `call`, `value`, `context` under experimental effects.
- `docs/internal/framework-effect-model.md` should document helper commands and validation posture.
- At least one example should use effect helpers without making examples noisy; `examples/composed-basic/` is the best candidate because it already demonstrates composed routes/plugins/hooks.

## Blockers

- All APIs remain experimental.
- `runEffect()` remains public for now but is still a future internal candidate.
- No full workflow engine semantics should be inferred from these helpers.
