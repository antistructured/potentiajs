# Effect Command Helpers

## Files inspected

- `src/kernel/effect.js`
- `src/index.js`
- `tests/kernel-effect.test.js`
- `tests/kernel-lifecycle-hooks.test.js`
- `tests/kernel-scoped-hooks.test.js`
- `docs/internal/effect-dx-scope-lock.md`

## Files changed

- `src/kernel/effect.js`
- `src/index.js`
- `tests/kernel-effect-helpers.test.js`
- `docs/internal/effect-command-helpers.md`

## Implementation

Added experimental helper exports:

```js
call(fn, ...args)
value(value)
context(key)
```

Stable command shapes:

```js
{ type: 'call', fn, args, meta: null }
{ type: 'value', value, meta: null }
{ type: 'context', key, meta: null }
```

Root export update:

```js
export { call, context, effect, runEffect, value } from './kernel/effect.js';
```

## Compatibility

Existing raw command objects remain supported:

```js
{ type: 'call', fn, args }
{ type: 'value', value }
{ type: 'context', key }
```

No `delay()` helper was added; it remains deferred.

## Tests

Added `tests/kernel-effect-helpers.test.js` covering:

- helper command shapes
- helper execution through `runEffect()`
- route handler usage
- app hook usage
- scoped hook usage
- raw command compatibility

## Verification

```bash
bun test tests/kernel-effect-helpers.test.js tests/kernel-effect.test.js tests/kernel-lifecycle-hooks.test.js tests/kernel-scoped-hooks.test.js
```

Result:

- 34 pass
- 0 fail

## Blockers

- Helpers are experimental.
- No advanced workflow helpers were added.
