# Action URL-Encoded Input Integration

## Files inspected

- `src/kernel/action.js`
- `src/kernel/app.js`
- `tests/kernel-action-input.test.js`

## Files changed

- `src/kernel/action.js`
- `tests/kernel-action-urlencoded-input.test.js`
- `docs/internal/action-urlencoded-input-integration.md`

## Behavior

Action routes now parse `application/x-www-form-urlencoded` request bodies and attach the parsed object to `ctx.input`.

Examples:

```txt
name=Ada&email=ada%40example.com
```

becomes:

```js
{ name: 'Ada', email: 'ada@example.com' }
```

Repeated fields become arrays:

```js
{ tag: ['a', 'b'] }
```

Empty values remain empty strings.

JSON action input remains unchanged. Non-action routes are unaffected.

Unsupported non-empty content types fail with safe `POTENTIA_ACTION_INPUT_FAILED` diagnostics. Unsupported content type without a body still produces `ctx.input = null` because there is no input payload to parse.

Missing content type remains JSON-only for non-empty bodies.

## Verification

```bash
bun test tests/kernel-action-urlencoded-input.test.js tests/kernel-action-content-type.test.js tests/kernel-action-urlencoded-parser.test.js tests/kernel-action-input.test.js
```

Result:

- 32 pass
- 0 fail

## Deferred

- implicit params/query/body merge
- multipart
- file uploads
