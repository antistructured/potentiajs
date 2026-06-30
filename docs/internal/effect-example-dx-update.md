# Effect Example DX Update

## Files inspected

- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `examples/file-routing-dev/`
- `tests/composed-basic-example.test.js`

## Files changed

- `examples/composed-basic/index.js`
- `examples/composed-basic/README.md`
- `docs/internal/effect-example-dx-update.md`

## Update

Updated the composed route example to demonstrate effect helpers without making every example effect-heavy.

The mounted `GET /api/users/:id` route now uses:

- `effect(function* getUser(ctx) { ... })`
- `yield call(displayName, ctx.query.include)`

The behavior remains unchanged:

- `include=full` returns `Ada Lovelace`
- default response returns `Ada`
- route/scoped contracts still apply
- scoped hooks still apply

## Why composed-basic

`examples/composed-basic/` already demonstrates route composition, scoped contracts, scoped hooks, and plugins. Adding one effect helper route there shows the workflow in a realistic composed setting without distracting from the contract-focused SigilJS example or the minimal kernel example.

## Verification

```bash
bun test tests/composed-basic-example.test.js tests/kernel-effect-helpers.test.js
```

Result:

- 15 pass
- 0 fail

## Blockers

- No broader example rewrite was done.
- `delay()` and advanced workflow examples remain deferred.
