# Action JSON Input / `ctx.input`

## Files inspected

- `src/kernel/action.js`
- `src/kernel/app.js`
- `src/kernel/contract.js`
- `src/kernel/context.js`

## Files changed

- `src/kernel/action.js`
- `src/kernel/app.js`
- `tests/kernel-action-input.test.js`
- `docs/internal/action-json-input-context.md`

## Behavior added

Action routes now parse JSON request input and attach it to:

```js
ctx.input
```

Supported JSON input:

- `application/json`
- `application/json; charset=utf-8`
- missing content type with valid JSON body

No body produces deterministic `ctx.input = null`.

Malformed JSON returns safe deterministic `400` with `POTENTIA_ACTION_INPUT_FAILED`.

## Route compatibility

Non-action routes are unaffected.

Action routes can still use an existing route `body` contract. The action runtime parses JSON once and applies route `body` contract to the parsed value while keeping `ctx.input` as the action boundary value.

## Deferred

- URL-encoded form input
- multipart input
- file uploads
- implicit params/query/header merging

## Verification

```bash
bun test tests/kernel-action-input.test.js tests/kernel-action-shape.test.js
```

Result:

- 15 pass
- 0 fail
