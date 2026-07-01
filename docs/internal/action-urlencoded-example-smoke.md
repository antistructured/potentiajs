# Action URL-Encoded Example Smoke

## Files inspected

- `examples/action-basic/index.js`
- `examples/action-basic/README.md`
- `tests/action-basic-example.test.js`

## Files changed

- `examples/action-basic/index.js`
- `examples/action-basic/README.md`
- `tests/action-basic-example.test.js`
- `docs/internal/action-urlencoded-example-smoke.md`

## Example behavior

`examples/action-basic/` now demonstrates both JSON action input and URL-encoded plain-form-compatible input against the same explicit action route:

```js
route('POST', '/users', createUser)
```

The README includes a plain HTML form snippet only as standard browser submission shape. No form helper or frontend runtime was added.

The example still demonstrates:

- `action()`
- `ctx.input`
- SigilJS input contract
- SigilJS output contract
- `effect(...)` with `call(...)`
- deterministic validation failure

## Verification

```bash
bun test tests/action-basic-example.test.js tests/kernel-action-urlencoded-input.test.js tests/kernel-action-urlencoded-contracts.test.js
```

Result:

- 18 pass
- 0 fail

## Deferred

- form helper
- frontend runtime
- client JS
- multipart
- client SDK
- OpenAPI
