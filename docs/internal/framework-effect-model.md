# Framework Effect Model

## Files changed

- `src/kernel/effect.js`
- `src/kernel/app.js`
- `src/index.js`
- `tests/kernel-effect.test.js`

## Experimental exports

- `effect(generatorOrFunction)`
- `call(fn, ...args)`
- `value(value)`
- `context(key)`
- `runEffect(effectValue, context)`

## Supported handler forms

- Plain function returning a value.
- Async function returning a value.
- Generator function wrapped with `effect(...)`.
- Already-created effect descriptor from `effect(...)`.

## Supported effect commands

```js
{ type: 'call', fn, args, meta: null }
{ type: 'value', value, meta: null }
{ type: 'context', key, meta: null }
```

Existing raw command objects without `meta` remain supported.

`context` support is intentionally small and only returns `context[key]`.

## Helper posture

Effect helpers are shape-stable command constructors for userland readability:

```js
yield call(loadUser, ctx.params.id)
yield value('pong')
yield context('userId')
```

They do not imply a full workflow engine.

## Validation posture

Malformed object-shaped commands now fail deterministically:

- unknown command type
- missing/non-string command type
- `call` without function
- `call` with non-array `args` when provided
- `context` without non-empty string key

Non-object yielded values still pass through for compatibility.

Public route/hook responses continue to hide unsafe thrown messages through the existing `POTENTIA_HANDLER_FAILED` path.

## App integration

`createApp(...).fetch(request)` runs route handlers through `runEffect(...)` before response conversion. Thrown effect errors flow into the existing error normalization path.

## Deferred

- Cancellation.
- Retries.
- Concurrency.
- Supervisors.
- Queues.
- Background jobs.
- Long-running workflows.
- Algebraic syntax sugar.
- `delay()` and timer semantics.

## Verification

`bun test tests/kernel-effect.test.js tests/kernel-router-context.test.js tests/kernel-result-response.test.js` passes with 21 tests.
